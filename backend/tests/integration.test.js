const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
require("dotenv").config({
  path: require("node:path").join(__dirname, "../../.env"),
  quiet: true,
});
if (
  !process.env.TEST_DATABASE_URL ||
  !new URL(process.env.TEST_DATABASE_URL).pathname.endsWith("_test")
)
  throw new Error(
    "TEST_DATABASE_URL must point to a dedicated database ending _test",
  );
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.PAYSTACK_SECRET_KEY = "test_signature_only";
process.env.WHATSAPP_APP_SECRET = "test_whatsapp_signature";
process.env.WHATSAPP_VERIFY_TOKEN = "test_handshake";
const { app } = require("../src/app");
const { pool } = require("../src/db");
const { migrate } = require("../src/migrate");
const { hashPassword, hashToken } = require("../src/domain");
test("database-backed owner flows, isolation, approvals, exports and webhook integrity", async (t) => {
  await migrate();
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const url = "http://127.0.0.1:" + server.address().port;
  const accounts = [];
  async function request(
    path,
    { method = "GET", body, cookie, csrf, headers = {} } = {},
  ) {
    const r = await fetch(url + "/api" + path, {
      method,
      headers: {
        Origin: "http://localhost:3000",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
        ...(csrf ? { "x-csrf-token": csrf } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let d;
    const type = r.headers.get("content-type");
    d = type?.includes("json") ? await r.json() : await r.text();
    return {
      status: r.status,
      data: d,
      cookie: r.headers.get("set-cookie")?.split(";")[0],
    };
  }
  try {
    let a, b, w, run;
    await t.test(
      "registration, session and two isolated businesses",
      async () => {
        for (const name of ["A", "B"]) {
          const r = await request("/auth/register", {
            method: "POST",
            body: {
              name: "Owner " + name,
              business_name: "Test " + name,
              email: crypto.randomUUID() + "@example.test",
              password: "test-long-password",
            },
          });
          assert.equal(r.status, 201);
          accounts.push({ ...r.data, cookie: r.cookie });
        }
        [a, b] = accounts;
        assert.equal(
          (await request("/auth/me", { cookie: a.cookie })).data.user.name,
          "Owner A",
        );
        assert.equal((await request("/workspace/overview")).status, 401);
        assert.equal(
          (
            await request("/workspace/workers", {
              method: "POST",
              cookie: a.cookie,
              body: {},
            })
          ).status,
          403,
        );
      },
    );
    await t.test(
      "worker, decimals, input validation, cross-tenant access",
      async () => {
        const r = await request("/workspace/workers", {
          method: "POST",
          cookie: a.cookie,
          csrf: a.csrf,
          body: {
            name: "Victor Test",
            role: "Assistant",
            pay_type: "daily",
            rate: 350000,
          },
        });
        assert.equal(r.status, 201);
        w = r.data;
        assert.equal(
          (await request("/workspace/workers/" + w.id, { cookie: b.cookie }))
            .status,
          404,
        );
        assert.equal(
          (
            await request("/workspace/entries", {
              method: "POST",
              cookie: a.cookie,
              csrf: a.csrf,
              body: {
                worker_id: w.id,
                kind: "advance",
                amount: -1,
                entry_date: "2026-09-08",
              },
            })
          ).status,
          400,
        );
        for (const d of [
          { kind: "work", units: 1.5 },
          { kind: "advance", amount: 100000 },
        ])
          assert.equal(
            (
              await request("/workspace/entries", {
                method: "POST",
                cookie: a.cookie,
                csrf: a.csrf,
                body: { worker_id: w.id, entry_date: "2026-09-08", ...d },
              })
            ).status,
            201,
          );
      },
    );
    await t.test(
      "draft snapshot, approval, overlap and locked record protection",
      async () => {
        const r = await request("/workspace/pay-runs", {
          method: "POST",
          cookie: a.cookie,
          csrf: a.csrf,
          body: { start_date: "2026-09-01", end_date: "2026-09-08" },
        });
        assert.equal(r.status, 201);
        run = r.data;
        assert.equal(run.total, 425000);
        assert.equal(
          (
            await request("/workspace/pay-runs/" + run.id + "/approve", {
              method: "POST",
              cookie: a.cookie,
              csrf: a.csrf,
              body: {},
            })
          ).status,
          200,
        );
        const r2 = await request("/workspace/pay-runs", {
          method: "POST",
          cookie: a.cookie,
          csrf: a.csrf,
          body: { start_date: "2026-09-01", end_date: "2026-09-08" },
        });
        assert.equal(
          (
            await request("/workspace/pay-runs/" + r2.data.id + "/approve", {
              method: "POST",
              cookie: a.cookie,
              csrf: a.csrf,
              body: {},
            })
          ).status,
          409,
        );
        const entry = (
          await request("/workspace/overview", { cookie: a.cookie })
        ).data.entries.find((e) => e.kind === "advance");
        assert.equal(
          (
            await request("/workspace/entries/" + entry.id + "/void", {
              method: "POST",
              cookie: a.cookie,
              csrf: a.csrf,
              body: { reason: "A mistaken amount" },
            })
          ).status,
          409,
        );
      },
    );
    await t.test(
      "cash recording settles once, overpay blocked, void reopens pay",
      async () => {
        const payload = {
          worker_id: w.id,
          pay_run_id: run.id,
          kind: "payment",
          amount: 425000,
          method: "cash",
          entry_date: "2026-09-08",
        };
        const results = await Promise.all(
          [1, 2].map(() =>
            request("/workspace/entries", {
              method: "POST",
              cookie: a.cookie,
              csrf: a.csrf,
              body: payload,
            }),
          ),
        );
        assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
        const payment = results.find((r) => r.status === 201).data;
        assert.equal(
          (
            await request("/workspace/overview", { cookie: a.cookie })
          ).data.pay_runs.find((r) => r.id === run.id).status,
          "paid",
        );
        assert.equal(
          (
            await request("/workspace/entries/" + payment.id + "/void", {
              method: "POST",
              cookie: a.cookie,
              csrf: a.csrf,
              body: { reason: "Payment recorded by mistake" },
            })
          ).status,
          200,
        );
        assert.equal(
          (
            await request("/workspace/overview", { cookie: a.cookie })
          ).data.pay_runs.find((r) => r.id === run.id).status,
          "approved",
        );
      },
    );
    await t.test(
      "exports are tenant-scoped and contain real documents",
      async () => {
        const csv = await request("/workspace/export", { cookie: a.cookie });
        assert.equal(csv.status, 200);
        assert.ok(csv.data.includes("Victor Test"));
        assert.equal(
          (
            await request("/workspace/export", { cookie: b.cookie })
          ).data.includes("Victor Test"),
          false,
        );
        const pdf = await request(
          "/workspace/pay-runs/" + run.id + "/statement",
          { cookie: a.cookie },
        );
        assert.ok(pdf.data.startsWith("%PDF"));
        assert.equal(
          (
            await request("/workspace/pay-runs/" + run.id + "/statement", {
              cookie: b.cookie,
            })
          ).status,
          404,
        );
      },
    );
    await t.test(
      "supervisor may record but cannot approve or alter settings",
      async () => {
        const uid = crypto.randomUUID(),
          token = crypto.randomBytes(32).toString("hex");
        await pool.query(
          "INSERT INTO users(id,business_id,name,email,password_hash,role)VALUES($1,$2,'Supervisor',$3,$4,'supervisor')",
          [
            uid,
            a.user.business_id,
            crypto.randomUUID() + "@example.test",
            await hashPassword("supervisor-password"),
          ],
        );
        await pool.query(
          "INSERT INTO sessions(token_hash,user_id,expires_at)VALUES($1,$2,now()+interval '1 hour')",
          [hashToken(token), uid],
        );
        const cookie = "resconate_session=" + token,
          csrf = hashToken(token + ":csrf");
        assert.equal(
          (
            await request("/workspace/settings", {
              method: "PATCH",
              cookie,
              csrf,
              body: { name: "Changed" },
            })
          ).status,
          403,
        );
        assert.equal(
          (
            await request("/workspace/pay-runs/" + run.id + "/approve", {
              method: "POST",
              cookie,
              csrf,
              body: {},
            })
          ).status,
          403,
        );
      },
    );
    await t.test(
      "signed billing webhook is idempotent and invalid signature rejected",
      async () => {
        const reference = "test_" + crypto.randomUUID();
        await pool.query(
          "INSERT INTO billing_checkouts(id,business_id,plan,amount,reference)VALUES($1,$2,$3,$4,$5)",
          [crypto.randomUUID(), a.user.business_id, "small", 350000, reference],
        );
        const event = {
          event: "charge.success",
          data: { reference, amount: 350000, currency: "NGN" },
        };
        assert.equal(
          (
            await request("/webhooks/paystack", {
              method: "POST",
              body: event,
              headers: { "x-paystack-signature": "bad" },
            })
          ).status,
          401,
        );
        const signature = crypto
          .createHmac("sha512", "test_signature_only")
          .update(JSON.stringify(event))
          .digest("hex");
        for (let i = 0; i < 2; i++)
          assert.equal(
            (
              await request("/webhooks/paystack", {
                method: "POST",
                body: event,
                headers: { "x-paystack-signature": signature },
              })
            ).status,
            200,
          );
        const biz = (
          await pool.query(
            "SELECT plan,paid_until FROM businesses WHERE id=$1",
            [a.user.business_id],
          )
        ).rows[0];
        assert.equal(biz.plan, "small");
        assert.ok(
          new Date(biz.paid_until) < new Date(Date.now() + 33 * 86400000),
        );
      },
    );
    await t.test(
      "transfer webhooks verify amount, settle once and reopen on reversal",
      async () => {
        const tid = crypto.randomUUID(),
          reference = "test_transfer_" + tid;
        await pool.query(
          "INSERT INTO transfers(id,business_id,pay_run_id,worker_id,amount,reference)VALUES($1,$2,$3,$4,$5,$6)",
          [tid, a.user.business_id, run.id, w.id, 425000, reference],
        );
        async function notify(event, amount = 425000) {
          const body = { event, data: { reference, amount, currency: "NGN" } };
          const signature = crypto
            .createHmac("sha512", "test_signature_only")
            .update(JSON.stringify(body))
            .digest("hex");
          return request("/webhooks/paystack", {
            method: "POST",
            body,
            headers: { "x-paystack-signature": signature },
          });
        }
        assert.equal((await notify("transfer.success", 1)).status, 400);
        assert.equal((await notify("transfer.success")).status, 200);
        assert.equal((await notify("transfer.success")).status, 200);
        assert.equal(
          (
            await pool.query("SELECT status FROM pay_runs WHERE id=$1", [
              run.id,
            ])
          ).rows[0].status,
          "paid",
        );
        assert.equal(
          Number(
            (
              await pool.query(
                "SELECT count(*) FROM entries WHERE pay_run_id=$1 AND source='provider'",
                [run.id],
              )
            ).rows[0].count,
          ),
          1,
        );
        assert.equal((await notify("transfer.reversed")).status, 200);
        assert.equal(
          (
            await pool.query("SELECT status FROM pay_runs WHERE id=$1", [
              run.id,
            ])
          ).rows[0].status,
          "approved",
        );
      },
    );
    await t.test(
      "stale pay snapshot is rejected and plan limits remain enforced after trial",
      async () => {
        const draft = await request("/workspace/pay-runs", {
          method: "POST",
          cookie: a.cookie,
          csrf: a.csrf,
          body: { start_date: "2026-11-01", end_date: "2026-11-07" },
        });
        await request("/workspace/entries", {
          method: "POST",
          cookie: a.cookie,
          csrf: a.csrf,
          body: {
            worker_id: w.id,
            kind: "bonus",
            amount: 10000,
            entry_date: "2026-11-01",
          },
        });
        assert.equal(
          (
            await request("/workspace/pay-runs/" + draft.data.id + "/approve", {
              method: "POST",
              cookie: a.cookie,
              csrf: a.csrf,
              body: {},
            })
          ).status,
          409,
        );
        await pool.query(
          "UPDATE businesses SET trial_ends_at=now()-interval '1 day',paid_until=NULL WHERE id=$1",
          [b.user.business_id],
        );
        for (let i = 0; i < 3; i++) {
          const r = await request("/workspace/workers", {
            method: "POST",
            cookie: b.cookie,
            csrf: b.csrf,
            body: {
              name: "Worker " + i,
              role: "Helper",
              pay_type: "weekly",
              rate: 100000,
            },
          });
          assert.equal(r.status, i < 2 ? 201 : 409);
        }
      },
    );
    await t.test(
      "reset token is single-use and invalidates sessions",
      async () => {
        const token = crypto.randomBytes(32).toString("hex");
        await pool.query(
          "INSERT INTO reset_tokens(token_hash,user_id,expires_at)VALUES($1,$2,now()+interval '10 minutes')",
          [hashToken(token), b.user.id],
        );
        assert.equal(
          (
            await request("/auth/reset", {
              method: "POST",
              body: { token, password: "new-test-password-long" },
            })
          ).status,
          200,
        );
        assert.equal(
          (await request("/auth/me", { cookie: b.cookie })).status,
          401,
        );
        assert.equal(
          (
            await request("/auth/reset", {
              method: "POST",
              body: { token, password: "new-test-password-long" },
            })
          ).status,
          400,
        );
      },
    );
    await t.test(
      "signed WhatsApp draft requires explicit confirmation and ignores duplicate delivery",
      async () => {
        const phone = "2340000000000",
          wid = w.id;
        await pool.query(
          "INSERT INTO whatsapp_links(phone,business_id,user_id)VALUES($1,$2,$3)",
          [phone, a.user.business_id, a.user.id],
        );
        async function send(body, id = crypto.randomUUID()) {
          const event = {
            entry: [
              {
                changes: [
                  {
                    value: {
                      messages: [
                        { id, from: phone, type: "text", text: { body } },
                      ],
                    },
                  },
                ],
              },
            ],
          };
          const signature =
            "sha256=" +
            crypto
              .createHmac("sha256", "test_whatsapp_signature")
              .update(JSON.stringify(event))
              .digest("hex");
          return request("/webhooks/whatsapp", {
            method: "POST",
            body: event,
            headers: { "x-hub-signature-256": signature },
          });
        }
        const before = Number(
          (
            await pool.query(
              "SELECT count(*) FROM entries WHERE worker_id=$1",
              [wid],
            )
          ).rows[0].count,
        );
        assert.equal((await send("BONUS 200 for Victor Test")).status, 200);
        assert.equal(
          Number(
            (
              await pool.query(
                "SELECT count(*) FROM entries WHERE worker_id=$1",
                [wid],
              )
            ).rows[0].count,
          ),
          before,
        );
        const draft = (
          await pool.query(
            "SELECT id FROM message_drafts WHERE business_id=$1",
            [a.user.business_id],
          )
        ).rows[0];
        const msgId = crypto.randomUUID();
        assert.equal((await send("CONFIRM " + draft.id, msgId)).status, 200);
        assert.equal((await send("CONFIRM " + draft.id, msgId)).status, 200);
        assert.equal(
          Number(
            (
              await pool.query(
                "SELECT count(*) FROM entries WHERE worker_id=$1",
                [wid],
              )
            ).rows[0].count,
          ),
          before + 1,
        );
      },
    );
  } finally {
    for (const a of accounts) {
      const bid = a.user.business_id;
      for (const table of [
        "message_drafts",
        "whatsapp_codes",
        "whatsapp_links",
        "invitations",
        "transfers",
        "entries",
        "pay_runs",
        "leave_requests",
        "reviews",
        "jobs",
        "billing_checkouts",
        "audit_events",
        "support_requests",
      ])
        await pool.query(`DELETE FROM ${table} WHERE business_id=$1`, [bid]);
      await pool.query(
        "DELETE FROM reset_tokens WHERE user_id IN(SELECT id FROM users WHERE business_id=$1)",
        [bid],
      );
      await pool.query("DELETE FROM users WHERE business_id=$1", [bid]);
      await pool.query("DELETE FROM workers WHERE business_id=$1", [bid]);
      await pool.query("DELETE FROM businesses WHERE id=$1", [bid]);
    }
    await new Promise((r) => server.close(r));
    await pool.end();
  }
});
