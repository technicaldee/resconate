const express = require("express");
const crypto = require("node:crypto");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const { rateLimit } = require("express-rate-limit");
const { z } = require("zod");
const { isDeepStrictEqual } = require("node:util");
const config = require("./config");
const { pool, transaction } = require("./db");
const {
  plans,
  hashPassword,
  checkPassword,
  hashToken,
  calculatePay,
  parseMessage,
} = require("./domain");
const { paystack } = require("./providers");
const { enqueue, processOutbox } = require("./outbox");
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS || 0));
app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.appUrl, credentials: true }));
app.use(
  rateLimit({
    windowMs: 60000,
    limit: 180,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
const id = z.string().uuid(),
  day = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(
      (s) =>
        !isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s,
      "Use a valid date",
    );
const text = z.string().trim().min(1).max(500);
const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((s) => s.toLowerCase());
const password = z.string().min(10).max(128);
const amount = z.number().int().positive().max(1000000000);
const uuid = () => crypto.randomUUID();
const fail = (status, message) => {
  const e = new Error(message);
  e.status = status;
  throw e;
};
const read = (schema, body) => schema.parse(body);
const money = (n) =>
  `₦${(n / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
async function audit(db, req, action, details = {}) {
  await db.query(
    "INSERT INTO audit_events(business_id,user_id,action,details)VALUES($1,$2,$3,$4)",
    [req.user.business_id, req.user.id, action, details],
  );
}
async function worker(db, businessId, workerId) {
  const { rows } = await db.query(
    "SELECT * FROM workers WHERE id=$1 AND business_id=$2",
    [id.parse(workerId), businessId],
  );
  if (!rows[0]) fail(404, "Worker not found");
  return rows[0];
}
async function newSession(res, db, user) {
  const token = crypto.randomBytes(32).toString("hex");
  await db.query(
    "INSERT INTO sessions(token_hash,user_id,expires_at)VALUES($1,$2,now()+interval '7 days')",
    [hashToken(token), user.id],
  );
  res.cookie("resconate_session", token, {
    httpOnly: true,
    secure: config.production,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 86400000,
  });
  return hashToken(`${token}:csrf`);
}
const cookie = (req) => {
  const m = (req.headers.cookie || "")
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith("resconate_session="));
  return m?.slice(18);
};
async function authenticated(req, res, next) {
  try {
    const token = cookie(req);
    if (!token) fail(401, "Sign in to continue");
    const { rows } = await pool.query(
      "SELECT u.id,u.business_id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()",
      [hashToken(token)],
    );
    if (!rows[0]) fail(401, "Your session has ended. Sign in again.");
    req.user = rows[0];
    req.csrf = hashToken(`${token}:csrf`);
    if (
      !["GET", "HEAD"].includes(req.method) &&
      req.headers["x-csrf-token"] !== req.csrf
    )
      fail(403, "Refresh the page before trying again");
    next();
  } catch (e) {
    next(e);
  }
}
const owner = (req, res, next) =>
  req.user.role === "owner"
    ? next()
    : next(
        Object.assign(new Error("Only the owner can do this"), { status: 403 }),
      );
const authLimit = rateLimit({
  windowMs: 15 * 60000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
// Webhooks verify the original bytes before parsing.
app.post(
  "/api/webhooks/paystack",
  express.raw({ type: "application/json", limit: "256kb" }),
  async (req, res) => {
    if (!config.paystackSecret) fail(503, "Payments are not configured");
    const signature = req.headers["x-paystack-signature"] || "";
    const expected = crypto
      .createHmac("sha512", config.paystackSecret)
      .update(req.body)
      .digest("hex");
    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    )
      fail(401, "Invalid signature");
    const event = JSON.parse(req.body.toString());
    const reference = event.data?.reference;
    if (!reference) return res.json({ received: true });
    await transaction(async (db) => {
      const eventId = `${event.event}:${reference}`;
      const inserted = await db.query(
        "INSERT INTO webhook_events(provider,event_id,payload)VALUES($1,$2,$3)ON CONFLICT DO NOTHING RETURNING event_id",
        ["paystack", eventId, event],
      );
      if (!inserted.rowCount) return;
      if (event.event === "charge.success") {
        const { rows } = await db.query(
          "SELECT * FROM billing_checkouts WHERE reference=$1 FOR UPDATE",
          [reference],
        );
        const c = rows[0];
        if (!c || c.status === "paid") return;
        if (event.data.amount !== c.amount || event.data.currency !== "NGN")
          fail(400, "Payment amount does not match");
        await db.query(
          "UPDATE billing_checkouts SET status='paid' WHERE id=$1",
          [c.id],
        );
        await db.query(
          "UPDATE businesses SET plan=$1,paid_until=GREATEST(COALESCE(paid_until,now()),now())+interval '1 month' WHERE id=$2",
          [c.plan, c.business_id],
        );
      }
      if (
        ["transfer.success", "transfer.failed", "transfer.reversed"].includes(
          event.event,
        )
      ) {
        const { rows } = await db.query(
          "SELECT * FROM transfers WHERE reference=$1 FOR UPDATE",
          [reference],
        );
        const t = rows[0];
        if (!t) return;
        if (
          event.event === "transfer.success" &&
          (event.data.amount !== t.amount || event.data.currency !== "NGN")
        )
          fail(400, "Transfer amount does not match");
        if (event.event === "transfer.success" && t.status !== "success") {
          await db.query("UPDATE transfers SET status='success' WHERE id=$1", [
            t.id,
          ]);
          await db.query(
            "INSERT INTO entries(id,business_id,worker_id,kind,amount,entry_date,note,method,pay_run_id,source)VALUES($1,$2,$3,'payment',$4,(now() AT TIME ZONE 'Africa/Lagos')::date,$5,'provider',$6,'provider')",
            [
              uuid(),
              t.business_id,
              t.worker_id,
              t.amount,
              reference,
              t.pay_run_id,
            ],
          );
          await settleRun(db, t.pay_run_id, t.business_id);
        } else if (event.event !== "transfer.success") {
          await db.query(
            "UPDATE transfers SET status='failed',error=$2 WHERE id=$1",
            [t.id, event.event],
          );
          if (t.status === "success") {
            await db.query(
              "UPDATE entries SET voided_at=now(),void_reason=$2 WHERE note=$1 AND source=$3",
              [reference, "Provider reversed transfer", "provider"],
            );
            await db.query(
              "UPDATE pay_runs SET status='approved' WHERE id=$1",
              [t.pay_run_id],
            );
          }
        }
      }
    });
    res.json({ received: true });
  },
);
app.get("/api/webhooks/whatsapp", (req, res) => {
  if (
    config.whatsappVerify &&
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === config.whatsappVerify
  )
    return res.send(req.query["hub.challenge"]);
  res.sendStatus(403);
});
app.post(
  "/api/webhooks/whatsapp",
  express.raw({ type: "application/json", limit: "256kb" }),
  async (req, res) => {
    if (!config.whatsappAppSecret) fail(503, "WhatsApp is not configured");
    const expected =
      "sha256=" +
      crypto
        .createHmac("sha256", config.whatsappAppSecret)
        .update(req.body)
        .digest("hex");
    const signature = req.headers["x-hub-signature-256"] || "";
    if (
      expected.length !== signature.length ||
      !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    )
      fail(401, "Invalid signature");
    const payload = JSON.parse(req.body.toString());
    await transaction(async (db) => {
      for (const e of payload.entry || [])
        for (const c of e.changes || [])
          for (const message of c.value?.messages || []) {
            const inserted = await db.query(
              "INSERT INTO webhook_events(provider,event_id,payload)VALUES($1,$2,$3)ON CONFLICT DO NOTHING RETURNING event_id",
              ["whatsapp", message.id, message],
            );
            if (inserted.rowCount) await handleMessage(db, message);
          }
    });
    res.json({ received: true });
  },
);
app.use(express.json({ limit: "128kb" }));
app.use((req, res, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    !req.path.startsWith("/api/jobs/")
  ) {
    if (req.headers.origin !== config.appUrl)
      return next(
        Object.assign(new Error("This request must come from your workspace"), {
          status: 403,
        }),
      );
  }
  next();
});
app.get("/api/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});
app.get("/api/plans", (req, res) => res.json(plans));
app.post("/api/auth/register", authLimit, async (req, res) => {
  const data = read(
    z.object({
      name: text,
      business_name: text,
      email,
      password,
      phone: z.string().trim().max(30).optional(),
      sector: z.string().max(50).default("food"),
    }),
    req.body,
  );
  const hash = await hashPassword(data.password);
  let csrf;
  const user = await transaction(async (db) => {
    const biz = uuid(),
      userId = uuid();
    await db.query(
      "INSERT INTO businesses(id,name,phone,sector)VALUES($1,$2,$3,$4)",
      [biz, data.business_name, data.phone || null, data.sector],
    );
    const { rows } = await db.query(
      "INSERT INTO users(id,business_id,name,email,password_hash)VALUES($1,$2,$3,$4,$5)RETURNING id,business_id,name,email,role",
      [userId, biz, data.name, data.email, hash],
    );
    csrf = await newSession(res, db, rows[0]);
    return rows[0];
  });
  res.status(201).json({ user, csrf });
});
app.post("/api/auth/login", authLimit, async (req, res) => {
  const data = read(
    z.object({ email, password: z.string().max(128) }),
    req.body,
  );
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE lower(email)=$1",
    [data.email],
  );
  if (!rows[0] || !(await checkPassword(data.password, rows[0].password_hash)))
    fail(401, "Email or password is incorrect");
  const user = rows[0];
  const csrf = await newSession(res, pool, user);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      business_id: user.business_id,
    },
    csrf,
  });
});
app.get("/api/auth/me", authenticated, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM businesses WHERE id=$1", [
    req.user.business_id,
  ]);
  const business = rows[0];
  const entitled =
    new Date(business.trial_ends_at) > new Date() ||
    (business.paid_until && new Date(business.paid_until) > new Date());
  res.json({
    user: req.user,
    csrf: req.csrf,
    business: {
      ...business,
      effective_plan: entitled
        ? business.plan === "basic"
          ? "growth"
          : business.plan
        : "basic",
    },
    integrations: {
      payments: !!config.paystackSecret,
      whatsapp: !!(
        config.whatsappToken &&
        config.whatsappPhone &&
        config.whatsappAppSecret
      ),
      email: !!process.env.SMTP_HOST,
    },
  });
});
app.post("/api/auth/logout", authenticated, async (req, res) => {
  await pool.query("DELETE FROM sessions WHERE token_hash=$1", [
    hashToken(cookie(req)),
  ]);
  res.clearCookie("resconate_session", { path: "/" });
  res.json({ success: true });
});
app.post("/api/auth/forgot", authLimit, async (req, res) => {
  const { email: address } = read(z.object({ email }), req.body);
  const { rows } = await pool.query(
    "SELECT id FROM users WHERE lower(email)=$1",
    [address],
  );
  if (rows[0]) {
    const token = crypto.randomBytes(32).toString("hex");
    await transaction(async (db) => {
      await db.query(
        "INSERT INTO reset_tokens(token_hash,user_id,expires_at)VALUES($1,$2,now()+interval '30 minutes')",
        [hashToken(token), rows[0].id],
      );
      await enqueue(db, "email", address, {
        subject: "Reset your Resconate password",
        text: `Reset your password: ${config.appUrl}/reset-password?token=${token}\nThis link expires in 30 minutes.`,
      });
    });
  }
  res.json({
    message: "If this email has an account, a reset link has been requested.",
  });
});
app.post("/api/auth/reset", authLimit, async (req, res) => {
  const { token, password: newPassword } = read(
    z.object({ token: z.string().length(64), password }),
    req.body,
  );
  const hash = await hashPassword(newPassword);
  await transaction(async (db) => {
    const { rows } = await db.query(
      "SELECT * FROM reset_tokens WHERE token_hash=$1 AND used_at IS NULL AND expires_at>now() FOR UPDATE",
      [hashToken(token)],
    );
    if (!rows[0]) fail(400, "This reset link has expired or was already used");
    await db.query("UPDATE users SET password_hash=$1 WHERE id=$2", [
      hash,
      rows[0].user_id,
    ]);
    await db.query(
      "UPDATE reset_tokens SET used_at=now() WHERE token_hash=$1",
      [hashToken(token)],
    );
    await db.query("DELETE FROM sessions WHERE user_id=$1", [rows[0].user_id]);
  });
  res.json({ success: true });
});
app.post("/api/auth/accept-invite", authLimit, async (req, res) => {
  const data = read(
    z.object({ token: z.string().length(64), name: text, password }),
    req.body,
  );
  const hash = await hashPassword(data.password);
  let csrf;
  const user = await transaction(async (db) => {
    const { rows } = await db.query(
      "SELECT * FROM invitations WHERE token_hash=$1 AND used_at IS NULL AND expires_at>now() FOR UPDATE",
      [hashToken(data.token)],
    );
    if (!rows[0]) fail(400, "This invitation has expired");
    const invite = rows[0];
    const u = (
      await db.query(
        "INSERT INTO users(id,business_id,name,email,password_hash,role)VALUES($1,$2,$3,$4,$5,'supervisor')RETURNING id,business_id,name,email,role",
        [uuid(), invite.business_id, data.name, invite.email, hash],
      )
    ).rows[0];
    await db.query("UPDATE invitations SET used_at=now() WHERE token_hash=$1", [
      hashToken(data.token),
    ]);
    csrf = await newSession(res, db, u);
    return u;
  });
  res.status(201).json({ user, csrf });
});
app.post("/api/contact", authLimit, async (req, res) => {
  const d = read(
    z.object({
      name: text,
      email,
      phone: z.string().max(30).optional(),
      message: z.string().trim().min(10).max(3000),
      category: z
        .enum(["demo", "support", "studio", "specialist"])
        .default("demo"),
    }),
    req.body,
  );
  await transaction(async (db) => {
    await db.query(
      "INSERT INTO support_requests(id,name,email,phone,category,message)VALUES($1,$2,$3,$4,$5,$6)",
      [uuid(), d.name, d.email, d.phone, d.category, d.message],
    );
    await enqueue(db, "email", config.supportEmail, {
      subject: `Resconate ${d.category} request`,
      text: `${d.name}\n${d.email}\n${d.phone || ""}\n${d.message}`,
    });
  });
  res.status(201).json({
    message:
      "Your request has been saved. We will contact you using the details provided.",
  });
});
app.use("/api/workspace", authenticated);
app.get("/api/workspace/overview", async (req, res) => {
  const bid = req.user.business_id;
  const [workers, entries, runs, support, paid] = await Promise.all([
    pool.query("SELECT * FROM workers WHERE business_id=$1 ORDER BY name", [
      bid,
    ]),
    pool.query(
      "SELECT e.*,w.name AS worker_name FROM entries e JOIN workers w ON w.id=e.worker_id WHERE e.business_id=$1 ORDER BY e.created_at DESC LIMIT 100",
      [bid],
    ),
    pool.query(
      "SELECT * FROM pay_runs WHERE business_id=$1 ORDER BY created_at DESC",
      [bid],
    ),
    pool.query(
      "SELECT * FROM support_requests WHERE business_id=$1 ORDER BY created_at DESC LIMIT 20",
      [bid],
    ),
    pool.query(
      "SELECT pay_run_id,worker_id,sum(amount)::bigint AS paid FROM entries WHERE business_id=$1 AND kind='payment' AND voided_at IS NULL AND pay_run_id IS NOT NULL GROUP BY pay_run_id,worker_id",
      [bid],
    ),
  ]);
  res.json({
    workers: workers.rows,
    entries: entries.rows,
    pay_runs: runs.rows,
    support: support.rows,
    payment_totals: paid.rows,
  });
});
const workerSchema = z.object({
  name: text,
  role: text,
  phone: z.string().trim().max(30).default(""),
  pay_type: z.enum(["monthly", "weekly", "daily", "per_job"]),
  rate: amount,
});
app.get("/api/workspace/workers", async (req, res) =>
  res.json(
    (
      await pool.query(
        "SELECT * FROM workers WHERE business_id=$1 ORDER BY name",
        [req.user.business_id],
      )
    ).rows,
  ),
);
app.post("/api/workspace/workers", async (req, res) => {
  const d = read(workerSchema, req.body);
  const w = await transaction(async (db) => {
    const b = (
      await db.query("SELECT * FROM businesses WHERE id=$1 FOR UPDATE", [
        req.user.business_id,
      ])
    ).rows[0];
    const entitled =
      new Date(b.trial_ends_at) > new Date() ||
      (b.paid_until && new Date(b.paid_until) > new Date());
    const limit = entitled
      ? plans[b.plan === "basic" ? "growth" : b.plan].limit
      : 2;
    const count = (
      await db.query(
        "SELECT count(*) FROM workers WHERE business_id=$1 AND status='active'",
        [b.id],
      )
    ).rows[0].count;
    if (Number(count) >= limit)
      fail(
        409,
        `Your current plan allows ${limit} active workers. Choose a larger plan or archive a worker.`,
      );
    const w = (
      await db.query(
        "INSERT INTO workers(id,business_id,name,role,phone,pay_type,rate)VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING *",
        [uuid(), b.id, d.name, d.role, d.phone, d.pay_type, d.rate],
      )
    ).rows[0];
    await audit(db, req, "worker.created", { worker_id: w.id });
    return w;
  });
  res.status(201).json(w);
});
app.patch("/api/workspace/workers/:id", async (req, res) => {
  const d = read(
    workerSchema.extend({
      status: z.enum(["active", "archived"]).default("active"),
    }),
    req.body,
  );
  await transaction(async (db) => {
    await db.query("SELECT id FROM businesses WHERE id=$1 FOR UPDATE", [
      req.user.business_id,
    ]);
    const w = await worker(db, req.user.business_id, req.params.id);
    if (w.status === "archived" && d.status === "active")
      fail(409, "Add a new worker record to reactivate employment");
    await db.query(
      "UPDATE workers SET name=$1,role=$2,phone=$3,pay_type=$4,rate=$5,status=$6 WHERE id=$7 AND business_id=$8",
      [
        d.name,
        d.role,
        d.phone,
        d.pay_type,
        d.rate,
        d.status,
        w.id,
        req.user.business_id,
      ],
    );
    await audit(db, req, "worker.updated", { worker_id: w.id });
  });
  res.json({ success: true });
});
app.get("/api/workspace/workers/:id", async (req, res) => {
  const w = await worker(pool, req.user.business_id, req.params.id);
  const entries = (
    await pool.query(
      "SELECT * FROM entries WHERE worker_id=$1 AND business_id=$2 ORDER BY entry_date DESC",
      [w.id, req.user.business_id],
    )
  ).rows;
  res.json({ worker: w, entries });
});
const entrySchema = z
  .object({
    worker_id: id,
    kind: z.enum(["work", "advance", "bonus", "payment"]),
    units: z.number().positive().max(10000).optional(),
    amount: z.number().int().min(0).max(1000000000).default(0),
    entry_date: day,
    note: z.string().trim().max(500).default(""),
    method: z.enum(["cash", "bank"]).optional(),
    pay_run_id: id.optional(),
  })
  .superRefine((d, ctx) => {
    if (d.kind === "work" && !d.units)
      ctx.addIssue({
        code: "custom",
        message: "Enter the days or units worked",
      });
    if (d.kind !== "work" && !d.amount)
      ctx.addIssue({ code: "custom", message: "Enter an amount" });
    if (d.kind === "payment" && !d.method)
      ctx.addIssue({ code: "custom", message: "Choose cash or bank transfer" });
  });
async function addEntry(db, user, d, source = "owner") {
  await db.query("SELECT id FROM businesses WHERE id=$1 FOR UPDATE", [
    user.business_id,
  ]);
  if (d.pay_run_id && d.kind !== "payment")
    fail(400, "Only payments can be linked to a pay run");
  const w = await worker(db, user.business_id, d.worker_id);
  if (w.status !== "active" && d.kind !== "payment")
    fail(409, "This worker has been archived");
  if (
    d.kind !== "payment" &&
    (
      await db.query(
        "SELECT 1 FROM pay_runs WHERE business_id=$1 AND status<>'draft' AND start_date<=$2 AND end_date>=$2",
        [user.business_id, d.entry_date],
      )
    ).rowCount
  )
    fail(
      409,
      "This date belongs to an approved pay period. Record an adjustment in a new period.",
    );
  if (d.pay_run_id) {
    const run = (
      await db.query(
        "SELECT * FROM pay_runs WHERE id=$1 AND business_id=$2 FOR UPDATE",
        [d.pay_run_id, user.business_id],
      )
    ).rows[0];
    if (!run || run.status === "draft") fail(409, "Approve the pay run first");
    const item = run.items.find((i) => i.worker_id === w.id);
    if (!item) fail(400, "Worker is not in this pay run");
    const paid = Number(
      (
        await db.query(
          "SELECT COALESCE(sum(amount),0) AS paid FROM entries WHERE pay_run_id=$1 AND worker_id=$2 AND kind='payment' AND voided_at IS NULL",
          [run.id, w.id],
        )
      ).rows[0].paid,
    );
    const pending = Number(
      (
        await db.query(
          "SELECT COALESCE(sum(amount),0) AS pending FROM transfers WHERE pay_run_id=$1 AND worker_id=$2 AND status='pending'",
          [run.id, w.id],
        )
      ).rows[0].pending,
    );
    if (d.amount > item.net - paid - pending)
      fail(
        409,
        "This payment exceeds the outstanding amount, including pending transfers",
      );
  }
  const row = (
    await db.query(
      "INSERT INTO entries(id,business_id,worker_id,kind,units,amount,entry_date,note,method,pay_run_id,created_by,source)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)RETURNING *",
      [
        uuid(),
        user.business_id,
        w.id,
        d.kind,
        d.units || null,
        d.kind === "work" ? 0 : d.amount,
        d.entry_date,
        d.note || "",
        d.method || null,
        d.pay_run_id || null,
        user.id,
        source,
      ],
    )
  ).rows[0];
  if (d.pay_run_id) await settleRun(db, d.pay_run_id, user.business_id);
  return row;
}
async function settleRun(db, runId, bid) {
  const run = (
    await db.query("SELECT * FROM pay_runs WHERE id=$1 AND business_id=$2", [
      runId,
      bid,
    ])
  ).rows[0];
  const paid = Number(
    (
      await db.query(
        "SELECT COALESCE(sum(amount),0) AS paid FROM entries WHERE pay_run_id=$1 AND kind='payment' AND voided_at IS NULL",
        [runId],
      )
    ).rows[0].paid,
  );
  await db.query("UPDATE pay_runs SET status=$1 WHERE id=$2", [
    paid >= run.total ? "paid" : "approved",
    runId,
  ]);
}
app.post("/api/workspace/entries", async (req, res) => {
  const d = read(entrySchema, req.body);
  const row = await transaction(async (db) => {
    const e = await addEntry(db, req.user, d);
    await audit(db, req, "entry.created", { entry_id: e.id, kind: e.kind });
    return e;
  });
  res.status(201).json(row);
});
app.post("/api/workspace/entries/:id/void", owner, async (req, res) => {
  const { reason } = read(
    z.object({ reason: z.string().trim().min(5).max(500) }),
    req.body,
  );
  await transaction(async (db) => {
    await db.query("SELECT id FROM businesses WHERE id=$1 FOR UPDATE", [
      req.user.business_id,
    ]);
    const entry = (
      await db.query(
        "SELECT * FROM entries WHERE id=$1 AND business_id=$2 FOR UPDATE",
        [id.parse(req.params.id), req.user.business_id],
      )
    ).rows[0];
    if (!entry) fail(404, "Record not found");
    if (entry.source === "provider")
      fail(409, "Provider-confirmed payments cannot be manually voided");
    if (entry.allocated_run_id)
      fail(409, "This record belongs to an approved pay run");
    await db.query(
      "UPDATE entries SET voided_at=now(),void_reason=$1 WHERE id=$2",
      [reason, entry.id],
    );
    if (entry.pay_run_id)
      await settleRun(db, entry.pay_run_id, req.user.business_id);
    await audit(db, req, "entry.voided", { entry_id: entry.id, reason });
  });
  res.json({ success: true });
});
async function preview(db, bid, start, end) {
  const workers = (
    await db.query(
      "SELECT * FROM workers WHERE business_id=$1 AND status='active' ORDER BY name",
      [bid],
    )
  ).rows;
  const entries = (
    await db.query(
      "SELECT * FROM entries WHERE business_id=$1 AND entry_date BETWEEN $2 AND $3 AND allocated_run_id IS NULL AND voided_at IS NULL",
      [bid, start, end],
    )
  ).rows;
  return calculatePay(workers, entries).map((i) => ({
    ...i,
    entry_ids: entries
      .filter((e) => e.worker_id === i.worker_id && e.kind !== "payment")
      .map((e) => e.id)
      .sort(),
  }));
}
app.post("/api/workspace/pay-runs", owner, async (req, res) => {
  const d = read(
    z
      .object({ start_date: day, end_date: day })
      .refine(
        (d) =>
          d.end_date >= d.start_date &&
          Date.parse(d.end_date) - Date.parse(d.start_date) <= 31 * 86400000,
        "Choose a period of up to 32 days",
      ),
    req.body,
  );
  const items = await preview(
    pool,
    req.user.business_id,
    d.start_date,
    d.end_date,
  );
  if (!items.length) fail(409, "Add a worker before preparing pay");
  if (!Number.isSafeInteger(items.reduce((s, i) => s + i.net, 0)))
    fail(
      400,
      "This pay total exceeds the supported calculation limit. Review the rates.",
    );
  const run = (
    await pool.query(
      "INSERT INTO pay_runs(id,business_id,start_date,end_date,items,total,created_by)VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING *",
      [
        uuid(),
        req.user.business_id,
        d.start_date,
        d.end_date,
        JSON.stringify(items),
        items.reduce((s, i) => s + i.net, 0),
        req.user.id,
      ],
    )
  ).rows[0];
  res.status(201).json(run);
});
app.post("/api/workspace/pay-runs/:id/approve", owner, async (req, res) => {
  await transaction(async (db) => {
    await db.query("SELECT id FROM businesses WHERE id=$1 FOR UPDATE", [
      req.user.business_id,
    ]);
    const run = (
      await db.query(
        "SELECT * FROM pay_runs WHERE id=$1 AND business_id=$2 FOR UPDATE",
        [id.parse(req.params.id), req.user.business_id],
      )
    ).rows[0];
    if (!run) fail(404, "Pay run not found");
    if (run.status !== "draft") return;
    const overlapping = await db.query(
      "SELECT 1 FROM pay_runs WHERE business_id=$1 AND id<>$2 AND status<>'draft' AND start_date<=$3 AND end_date>=$4",
      [req.user.business_id, run.id, run.end_date, run.start_date],
    );
    if (overlapping.rowCount)
      fail(409, "This period overlaps an approved pay run");
    const items = await preview(
      db,
      req.user.business_id,
      run.start_date,
      run.end_date,
    );
    if (!isDeepStrictEqual(items, run.items))
      fail(409, "Records changed after this draft. Prepare a new pay run.");
    if (items.some((i) => i.carried_advance > 0))
      fail(
        409,
        "An advance exceeds this period’s pay. Review the records before approving.",
      );
    for (const item of items)
      if (item.entry_ids.length)
        await db.query(
          "UPDATE entries SET allocated_run_id=$1 WHERE id=ANY($2::uuid[])",
          [run.id, item.entry_ids],
        );
    await db.query(
      "UPDATE pay_runs SET status=CASE WHEN total=0 THEN 'paid' ELSE 'approved' END,approved_at=now() WHERE id=$1",
      [run.id],
    );
    await audit(db, req, "payrun.approved", {
      pay_run_id: run.id,
      total: run.total,
    });
  });
  res.json({ success: true });
});
app.get("/api/workspace/export", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT w.name,w.role,e.kind,e.units,e.amount,e.entry_date,e.note,e.method,e.source,e.voided_at FROM entries e JOIN workers w ON e.worker_id=w.id WHERE e.business_id=$1 ORDER BY e.entry_date DESC",
    [req.user.business_id],
  );
  const columns = [
    "name",
    "role",
    "kind",
    "units",
    "amount",
    "entry_date",
    "note",
    "method",
    "source",
    "voided_at",
  ];
  const cell = (v) =>
    '"' +
    String(v instanceof Date ? v.toISOString() : (v ?? ""))
      .replace(/^[=+@-]/, "'")
      .replaceAll('"', '""') +
    '"';
  res
    .set("Content-Type", "text/csv; charset=utf-8")
    .set("Content-Disposition", 'attachment; filename="resconate-records.csv"')
    .send(
      "\uFEFF" +
        [
          columns.join(","),
          ...rows.map((row) =>
            columns
              .map((c) => cell(c === "amount" ? row[c] / 100 : row[c]))
              .join(","),
          ),
        ].join("\r\n"),
    );
});
app.get("/api/workspace/pay-runs/:id/statement", async (req, res) => {
  const run = (
    await pool.query("SELECT * FROM pay_runs WHERE id=$1 AND business_id=$2", [
      id.parse(req.params.id),
      req.user.business_id,
    ])
  ).rows[0];
  if (!run) fail(404, "Pay run not found");
  const business = (
    await pool.query("SELECT name FROM businesses WHERE id=$1", [
      req.user.business_id,
    ])
  ).rows[0];
  const PDFDocument = require("pdfkit");
  const doc = new PDFDocument({ size: "A4", margin: 48 });
  res.type("pdf").attachment("pay-statement.pdf");
  doc.pipe(res);
  doc.fontSize(24).text("Resconate | Pay statement");
  doc.moveDown().fontSize(16).text(business.name);
  doc.fontSize(11).text(`${run.start_date} to ${run.end_date} · ${run.status}`);
  doc.moveDown();
  for (const item of run.items) {
    doc.fontSize(14).text(item.name);
    doc
      .fontSize(11)
      .text(
        `Gross: NGN ${(item.gross / 100).toFixed(2)}  Bonus: NGN ${(item.bonus / 100).toFixed(2)}  Advance: NGN ${(item.advance / 100).toFixed(2)}`,
      );
    doc.text(`Due: NGN ${(item.net / 100).toFixed(2)}`).moveDown();
  }
  doc.text(`Total: NGN ${(run.total / 100).toFixed(2)}`);
  doc
    .moveDown()
    .fontSize(10)
    .text(
      "Prepared from the business’s confirmed pay arrangements. This statement does not verify cash payments or calculate statutory deductions.",
    );
  doc.end();
});
app.post("/api/workspace/support", async (req, res) => {
  const { message, category } = read(
    z.object({
      message: z.string().trim().min(10).max(3000),
      category: z
        .enum(["support", "setup", "studio", "specialist"])
        .default("support"),
    }),
    req.body,
  );
  const row = await transaction(async (db) => {
    const r = (
      await db.query(
        "INSERT INTO support_requests(id,business_id,name,email,category,message)VALUES($1,$2,$3,$4,$5,$6)RETURNING *",
        [
          uuid(),
          req.user.business_id,
          req.user.name,
          req.user.email,
          category,
          message,
        ],
      )
    ).rows[0];
    await enqueue(db, "email", config.supportEmail, {
      subject: `Resconate ${category}: ${r.id}`,
      text: `${req.user.email}\n${message}`,
    });
    return r;
  });
  res.status(201).json(row);
});
app.get("/api/workspace/tools/:type", async (req, res) => {
  const type = req.params.type;
  if (!["leave_requests", "jobs", "reviews"].includes(type))
    fail(404, "Tool not found");
  res.json(
    (
      await pool.query(
        `SELECT * FROM ${type} WHERE business_id=$1 ORDER BY created_at DESC LIMIT 100`,
        [req.user.business_id],
      )
    ).rows,
  );
});
app.post("/api/workspace/tools/:type", async (req, res) => {
  const type = req.params.type;
  const schemas = {
    leave_requests: z
      .object({
        worker_id: id,
        start_date: day,
        end_date: day,
        note: z.string().max(1000).default(""),
      })
      .refine(
        (d) => d.end_date >= d.start_date,
        "End date must follow start date",
      ),
    jobs: z.object({ title: text, description: z.string().min(10).max(3000) }),
    reviews: z.object({
      worker_id: id,
      rating: z.number().int().min(1).max(5),
      note: z.string().min(5).max(2000),
    }),
  };
  if (!schemas[type]) fail(404, "Tool not found");
  const d = read(schemas[type], req.body);
  if (d.worker_id) await worker(pool, req.user.business_id, d.worker_id);
  const keys = Object.keys(d);
  const row = (
    await pool.query(
      `INSERT INTO ${type}(id,business_id,${keys.join(",")})VALUES(${Array.from({ length: keys.length + 2 }, (_, i) => "$" + (i + 1)).join(",")})RETURNING *`,
      [uuid(), req.user.business_id, ...Object.values(d)],
    )
  ).rows[0];
  res.status(201).json(row);
});
app.patch("/api/workspace/tools/:type/:id", owner, async (req, res) => {
  const { type } = req.params;
  if (!["leave_requests", "jobs"].includes(type)) fail(404, "Tool not found");
  const { status } = read(
    z.object({
      status:
        type === "jobs"
          ? z.enum(["open", "closed"])
          : z.enum(["pending", "approved", "declined"]),
    }),
    req.body,
  );
  const r = await pool.query(
    `UPDATE ${type} SET status=$1 WHERE id=$2 AND business_id=$3 RETURNING id`,
    [status, id.parse(req.params.id), req.user.business_id],
  );
  if (!r.rowCount) fail(404, "Record not found");
  res.json({ success: true });
});
app.patch("/api/workspace/settings", owner, async (req, res) => {
  const d = read(
    z.object({
      name: text,
      phone: z.string().max(30).default(""),
      sector: z.string().max(50).default("food"),
    }),
    req.body,
  );
  await pool.query(
    "UPDATE businesses SET name=$1,phone=$2,sector=$3 WHERE id=$4",
    [d.name, d.phone, d.sector, req.user.business_id],
  );
  res.json({ success: true });
});
app.post("/api/workspace/change-password", async (req, res) => {
  const d = read(
    z.object({ current: z.string().max(128), password }),
    req.body,
  );
  const user = (
    await pool.query("SELECT password_hash FROM users WHERE id=$1", [
      req.user.id,
    ])
  ).rows[0];
  if (!(await checkPassword(d.current, user.password_hash)))
    fail(400, "Current password is incorrect");
  await transaction(async (db) => {
    await db.query("UPDATE users SET password_hash=$1 WHERE id=$2", [
      await hashPassword(d.password),
      req.user.id,
    ]);
    await db.query("DELETE FROM sessions WHERE user_id=$1 AND token_hash<>$2", [
      req.user.id,
      hashToken(cookie(req)),
    ]);
  });
  res.json({ success: true });
});
app.post("/api/workspace/invite", owner, async (req, res) => {
  const { email: address } = read(z.object({ email }), req.body);
  if (!process.env.SMTP_HOST)
    fail(503, "Email must be configured to send invitations");
  const token = crypto.randomBytes(32).toString("hex");
  await transaction(async (db) => {
    await db.query(
      "INSERT INTO invitations(token_hash,business_id,email,expires_at)VALUES($1,$2,$3,now()+interval '2 days')",
      [hashToken(token), req.user.business_id, address],
    );
    await enqueue(db, "email", address, {
      subject: "Join your Resconate workspace",
      text: `${req.user.name} invited you to help manage the workspace. Join: ${config.appUrl}/accept-invite?token=${token}`,
    });
  });
  res.json({ message: "Invitation queued for delivery" });
});
app.post("/api/workspace/whatsapp/link", owner, async (req, res) => {
  if (!config.whatsappToken || !config.whatsappPhone)
    fail(503, "WhatsApp connection is not configured yet");
  const code = crypto.randomBytes(8).toString("hex");
  await pool.query(
    "INSERT INTO whatsapp_codes(code_hash,business_id,user_id,expires_at)VALUES($1,$2,$3,now()+interval '10 minutes')",
    [hashToken(code), req.user.business_id, req.user.id],
  );
  res.json({
    code,
    number: process.env.WHATSAPP_DISPLAY_NUMBER,
    message: `Send LINK ${code} to the Resconate WhatsApp number within ten minutes.`,
  });
});
app.delete("/api/workspace/whatsapp/link", owner, async (req, res) => {
  await pool.query("DELETE FROM whatsapp_links WHERE business_id=$1", [
    req.user.business_id,
  ]);
  res.json({ success: true });
});
app.post("/api/workspace/billing", owner, async (req, res) => {
  const { plan } = read(
    z.object({ plan: z.enum(["small", "growth", "assisted"]) }),
    req.body,
  );
  const checkout = uuid(),
    reference = "sub_" + checkout;
  const price = plans[plan].price;
  await pool.query(
    "INSERT INTO billing_checkouts(id,business_id,plan,amount,reference)VALUES($1,$2,$3,$4,$5)",
    [checkout, req.user.business_id, plan, price, reference],
  );
  const data = await paystack("/transaction/initialize", {
    email: req.user.email,
    amount: price,
    currency: "NGN",
    reference,
    callback_url: `${config.appUrl}/app/settings?payment=${reference}`,
    metadata: { checkout_id: checkout },
  });
  res.json({ url: data.authorization_url, reference });
});
app.post("/api/workspace/billing/verify", owner, async (req, res) => {
  const { reference } = read(
    z.object({ reference: z.string().min(10).max(100) }),
    req.body,
  );
  const checkout = (
    await pool.query(
      "SELECT * FROM billing_checkouts WHERE reference=$1 AND business_id=$2",
      [reference, req.user.business_id],
    )
  ).rows[0];
  if (!checkout) fail(404, "Payment not found");
  const payment = await paystack(
    "/transaction/verify/" + encodeURIComponent(reference),
  );
  if (payment.status !== "success") fail(409, "Payment is not confirmed yet");
  if (payment.amount !== checkout.amount || payment.currency !== "NGN")
    fail(409, "Payment amount does not match");
  await transaction(async (db) => {
    const c = (
      await db.query("SELECT * FROM billing_checkouts WHERE id=$1 FOR UPDATE", [
        checkout.id,
      ])
    ).rows[0];
    if (c.status === "paid") return;
    await db.query("UPDATE billing_checkouts SET status='paid' WHERE id=$1", [
      c.id,
    ]);
    await db.query(
      "UPDATE businesses SET plan=$1,paid_until=GREATEST(COALESCE(paid_until,now()),now())+interval '1 month' WHERE id=$2",
      [c.plan, c.business_id],
    );
  });
  res.json({ success: true });
});
app.get("/api/workspace/banks", async (req, res) =>
  res.json(await paystack("/bank?country=nigeria&perPage=100")),
);
app.post("/api/workspace/workers/:id/bank", owner, async (req, res) => {
  const d = read(
    z.object({
      bank_code: z.string().regex(/^\d{3,6}$/),
      account_number: z.string().regex(/^\d{10}$/),
    }),
    req.body,
  );
  const w = await worker(pool, req.user.business_id, req.params.id);
  const account = await paystack(
    `/bank/resolve?account_number=${d.account_number}&bank_code=${d.bank_code}`,
  );
  const recipient = await paystack("/transferrecipient", {
    type: "nuban",
    name: account.account_name,
    account_number: d.account_number,
    bank_code: d.bank_code,
    currency: "NGN",
  });
  await pool.query(
    "UPDATE workers SET bank_code=$1,account_number=$2,account_name=$3,recipient_code=$4 WHERE id=$5 AND business_id=$6",
    [
      d.bank_code,
      d.account_number,
      account.account_name,
      recipient.recipient_code,
      w.id,
      req.user.business_id,
    ],
  );
  res.json({ account_name: account.account_name });
});
app.post("/api/workspace/pay-runs/:id/transfer", owner, async (req, res) => {
  const { worker_id, confirmed } = read(
    z.object({ worker_id: id, confirmed: z.literal(true) }),
    req.body,
  );
  const transfer = await transaction(async (db) => {
    const run = (
      await db.query(
        "SELECT * FROM pay_runs WHERE id=$1 AND business_id=$2 FOR UPDATE",
        [id.parse(req.params.id), req.user.business_id],
      )
    ).rows[0];
    if (!run || run.status === "draft") fail(409, "Approve this pay run first");
    const w = await worker(db, req.user.business_id, worker_id);
    if (!w.recipient_code) fail(409, "Verify the worker’s bank account first");
    const item = run.items.find((i) => i.worker_id === worker_id);
    if (!item) fail(404, "Worker not found in this pay run");
    const paid = Number(
      (
        await db.query(
          "SELECT COALESCE(sum(amount),0) AS paid FROM entries WHERE pay_run_id=$1 AND worker_id=$2 AND kind='payment' AND voided_at IS NULL",
          [run.id, w.id],
        )
      ).rows[0].paid,
    );
    const due = item.net - paid;
    if (due <= 0) fail(409, "This worker has been paid");
    if (!config.paystackSecret) fail(503, "Payments are not configured");
    const tid = uuid(),
      reference = "pay_" + tid;
    await db.query(
      "INSERT INTO transfers(id,business_id,pay_run_id,worker_id,amount,reference)VALUES($1,$2,$3,$4,$5,$6)",
      [tid, req.user.business_id, run.id, w.id, due, reference],
    );
    await audit(db, req, "transfer.requested", {
      transfer_id: tid,
      amount: due,
    });
    return { id: tid, reference, amount: due, recipient: w.recipient_code };
  });
  try {
    const data = await paystack("/transfer", {
      source: "balance",
      recipient: transfer.recipient,
      amount: transfer.amount,
      reference: transfer.reference,
      reason: "Worker pay",
    });
    await pool.query("UPDATE transfers SET transfer_code=$1 WHERE id=$2", [
      data.transfer_code,
      transfer.id,
    ]);
    res.status(202).json({
      status: "pending",
      message:
        "Transfer requested. The record updates after provider confirmation.",
    });
  } catch (e) {
    await pool.query("UPDATE transfers SET error=$1 WHERE id=$2", [
      e.message,
      transfer.id,
    ]);
    res.status(202).json({
      status: "pending",
      message:
        "The provider response is uncertain. This transfer is held for reconciliation; do not pay it again.",
    });
  }
});
app.get("/api/workspace/transfers", async (req, res) =>
  res.json(
    (
      await pool.query(
        "SELECT * FROM transfers WHERE business_id=$1 ORDER BY created_at DESC",
        [req.user.business_id],
      )
    ).rows,
  ),
);
app.get("/api/workspace/audit", owner, async (req, res) =>
  res.json(
    (
      await pool.query(
        "SELECT a.*,u.name AS user_name FROM audit_events a LEFT JOIN users u ON u.id=a.user_id WHERE a.business_id=$1 ORDER BY a.created_at DESC LIMIT 100",
        [req.user.business_id],
      )
    ).rows,
  ),
);
app.post("/api/jobs/process", async (req, res) => {
  if (
    !config.cronSecret ||
    req.headers.authorization !== `Bearer ${config.cronSecret}`
  )
    fail(401, "Unauthorized");
  await processOutbox();
  await reconcileTransfers();
  res.json({ success: true });
});
async function reconcileTransfers() {
  if (!config.paystackSecret) return;
  const { rows } = await pool.query(
    "SELECT * FROM transfers WHERE status='pending' AND created_at<now()-interval '2 minutes' LIMIT 20",
  );
  for (const t of rows) {
    try {
      const p = await paystack(
        "/transfer/verify/" + encodeURIComponent(t.reference),
      );
      await transaction(async (db) => {
        const locked = (
          await db.query("SELECT * FROM transfers WHERE id=$1 FOR UPDATE", [
            t.id,
          ])
        ).rows[0];
        if (locked.status !== "pending") return;
        if (
          p.status === "success" &&
          p.amount === t.amount &&
          p.currency === "NGN"
        ) {
          await db.query(
            "UPDATE transfers SET status='success',error=NULL WHERE id=$1",
            [t.id],
          );
          await db.query(
            "INSERT INTO entries(id,business_id,worker_id,kind,amount,entry_date,note,method,pay_run_id,source)VALUES($1,$2,$3,'payment',$4,(now() AT TIME ZONE 'Africa/Lagos')::date,$5,'provider',$6,'provider')",
            [
              uuid(),
              t.business_id,
              t.worker_id,
              t.amount,
              t.reference,
              t.pay_run_id,
            ],
          );
          await settleRun(db, t.pay_run_id, t.business_id);
        } else if (["failed", "reversed"].includes(p.status))
          await db.query(
            "UPDATE transfers SET status='failed',error=$2 WHERE id=$1",
            [t.id, p.status],
          );
      });
    } catch {
      /* Preserve pending state until provider confirms; never assume a timeout failed. */
    }
  }
}
async function handleMessage(db, m) {
  const phone = m.from,
    body = m.text?.body?.trim();
  if (!body) {
    await enqueue(db, "whatsapp", phone, {
      text: "Please send text for now. Use: ADVANCE 5000 for Blessing. Voice notes are not processed.",
    });
    return;
  }
  if (/^LINK [a-f0-9]{16}$/i.test(body)) {
    const code = body.split(" ")[1];
    const row = (
      await db.query(
        "DELETE FROM whatsapp_codes WHERE code_hash=$1 AND expires_at>now() RETURNING *",
        [hashToken(code)],
      )
    ).rows[0];
    if (!row) {
      await enqueue(db, "whatsapp", phone, {
        text: "This code has expired. Request a new code in Settings.",
      });
      return;
    }
    await db.query(
      "DELETE FROM whatsapp_links WHERE business_id=$1 OR phone=$2",
      [row.business_id, phone],
    );
    await db.query(
      "INSERT INTO whatsapp_links(phone,business_id,user_id)VALUES($1,$2,$3)",
      [phone, row.business_id, row.user_id],
    );
    await enqueue(db, "whatsapp", phone, {
      text: "Your workspace is linked. Send ADVANCE 5000 for Blessing, WORK 1 for Victor, or SUMMARY. Every record requires confirmation.",
    });
    return;
  }
  const link = (
    await db.query("SELECT * FROM whatsapp_links WHERE phone=$1", [phone])
  ).rows[0];
  if (!link) {
    await enqueue(db, "whatsapp", phone, {
      text: "Connect your account in Resconate Settings first.",
    });
    return;
  }
  if (/^CONFIRM [a-f0-9-]{36}$/i.test(body)) {
    const draft = (
      await db.query(
        "SELECT * FROM message_drafts WHERE id=$1 AND phone=$2 AND confirmed_at IS NULL AND expires_at>now() FOR UPDATE",
        [body.split(" ")[1], phone],
      )
    ).rows[0];
    if (!draft) {
      await enqueue(db, "whatsapp", phone, {
        text: "This confirmation has expired or was already recorded.",
      });
      return;
    }
    const e = await addEntry(
      db,
      { id: link.user_id, business_id: link.business_id },
      draft.payload,
      "whatsapp",
    );
    await db.query("UPDATE message_drafts SET confirmed_at=now() WHERE id=$1", [
      draft.id,
    ]);
    await db.query(
      "INSERT INTO audit_events(business_id,user_id,action,details)VALUES($1,$2,$3,$4)",
      [link.business_id, link.user_id, "entry.whatsapp", { entry_id: e.id }],
    );
    await enqueue(db, "whatsapp", phone, {
      text: `Recorded ${draft.payload.kind} for ${draft.payload.worker_name}. Reference: ${e.id.slice(0, 8)}.`,
    });
    return;
  }
  if (/^SUMMARY$/i.test(body)) {
    const rows = (
      await db.query(
        "SELECT * FROM pay_runs WHERE business_id=$1 AND status='approved' ORDER BY created_at DESC LIMIT 3",
        [link.business_id],
      )
    ).rows;
    await enqueue(db, "whatsapp", phone, {
      text: rows.length
        ? rows
            .map(
              (r) =>
                `${r.start_date}: prepared ${money(r.total)}. Review outstanding payments in your workspace.`,
            )
            .join("\n")
        : "No approved pay runs yet. Prepare one in your workspace.",
    });
    return;
  }
  const workers = (
    await db.query(
      "SELECT * FROM workers WHERE business_id=$1 AND status='active'",
      [link.business_id],
    )
  ).rows;
  const d = parseMessage(body, workers);
  if (!d) {
    await enqueue(db, "whatsapp", phone, {
      text: "Use ADVANCE 5000 for Blessing or WORK 1 for Victor. Use the full name if two workers share a first name. No record has been changed.",
    });
    return;
  }
  const draftId = uuid();
  await db.query(
    "INSERT INTO message_drafts(id,phone,business_id,user_id,payload,expires_at)VALUES($1,$2,$3,$4,$5,now()+interval '10 minutes')",
    [draftId, phone, link.business_id, link.user_id, d],
  );
  await enqueue(db, "whatsapp", phone, {
    text: `Review: ${d.kind} ${d.kind === "work" ? d.units + " units" : money(d.amount)} for ${d.worker_name}. ${d.kind === "payment" ? "This records cash payment; it does not transfer money. " : ""}Reply CONFIRM ${draftId} to save within ten minutes. Ignore this message to cancel.`,
  });
}
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((e, req, res, next) => {
  if (res.headersSent) return next(e);
  if (e instanceof z.ZodError)
    return res
      .status(400)
      .json({ error: e.issues.map((i) => i.message).join(". ") });
  if (e.code === "23505")
    return res.status(409).json({
      error: "This record already exists or a transfer is already pending",
    });
  if (e.code === "23503")
    return res.status(400).json({ error: "A referenced record was not found" });
  const status = e.status || 500;
  if (status === 500)
    console.error("Request failed", { path: req.path, code: e.code || e.name });
  res.status(status).json({
    error:
      status === 500
        ? "This request could not be completed. Please try again."
        : e.message,
  });
});
module.exports = { app, reconcileTransfers };
