import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Brand,
  Seo,
  Icon,
  Field,
  Notice,
  Empty,
  Modal,
  api,
  money,
  date,
} from "./ui";
const planLabel = {
  basic: "Basic",
  small: "Small Team",
  growth: "Growing Team",
  assisted: "Assisted",
};
const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const nav = [
  ["", "home", "Today"],
  ["workers", "workers", "Workers"],
  ["records", "record", "Records"],
  ["pay", "pay", "Pay"],
  ["settings", "settings", "Settings"],
  ["tools", "record", "Team tools"],
  ["support", "help", "Support"],
];
const payName = {
  daily: "per day",
  weekly: "per week",
  monthly: "per month",
  per_job: "per job",
};
const sampleWorkers = [
  {
    id: "sample-1",
    name: "Blessing Okon",
    role: "Cook",
    rate: 4500000,
    pay_type: "monthly",
    phone: "",
    status: "active",
  },
  {
    id: "sample-2",
    name: "Victor Ekong",
    role: "Kitchen assistant",
    rate: 350000,
    pay_type: "daily",
    phone: "",
    status: "active",
  },
  {
    id: "sample-3",
    name: "Iniobong Udo",
    role: "Cashier",
    rate: 4000000,
    pay_type: "monthly",
    phone: "",
    status: "active",
  },
];
const initialDemo = {
  workers: sampleWorkers,
  entries: [
    {
      id: "sample-e1",
      worker_id: "sample-1",
      worker_name: "Blessing Okon",
      kind: "advance",
      amount: 500000,
      entry_date: today(),
      source: "owner",
      note: "Transport",
      created_at: new Date().toISOString(),
    },
    {
      id: "sample-e2",
      worker_id: "sample-2",
      worker_name: "Victor Ekong",
      kind: "work",
      units: 1,
      amount: 0,
      entry_date: today(),
      source: "owner",
      note: "",
      created_at: new Date().toISOString(),
    },
  ],
  pay_runs: [],
  support: [],
};
export default function Workspace({ demo = false }) {
  const router = useRouter(),
    section = demo ? "" : router.query.route?.[0] || "",
    detail = router.query.route?.[1];
  const [auth, A] = useState(null),
    [data, D] = useState(null),
    [error, E] = useState(""),
    [notice, N] = useState(""),
    [modal, M] = useState(null),
    [busy, B] = useState(false),
    [dark, T] = useState(false),
    [search, Q] = useState(""),
    [kind, K] = useState("all"),
    [tool, TT] = useState("leave_requests"),
    [toolRows, TR] = useState([]),
    [audit, AU] = useState([]),
    [transfers, TX] = useState([]),
    [bankList, BL] = useState([]),
    [linkCode, LC] = useState(null);
  const first = useRef(true);
  const user = auth?.user,
    business = auth?.business,
    owner = user?.role === "owner";
  const workers = data?.workers || [],
    entries = data?.entries || [],
    runs = data?.pay_runs || [];
  const active = workers.filter((w) => w.status === "active");
  const base = demo ? "/demo" : "/app";
  async function refresh() {
    if (demo) return;
    const [a, d] = await Promise.all([
      api("/auth/me"),
      api("/workspace/overview"),
    ]);
    A(a);
    D(d);
    if (section === "pay" || section === "settings")
      TX(await api("/workspace/transfers"));
  }
  useEffect(() => {
    T(localStorage.getItem("resconate-theme") === "dark");
    if (demo) {
      A({
        user: { name: "Ada Okon", role: "owner" },
        business: { name: "Ewet Kitchen", effective_plan: "growth" },
        integrations: { payments: false, whatsapp: false, email: false },
      });
      D(initialDemo);
      return;
    }
    refresh().catch((x) =>
      x.status === 401 ? router.replace("/login") : E(x.message),
    );
  }, [demo]);
  useEffect(() => {
    if (!auth || demo) return;
    if (section === "tools")
      api("/workspace/tools/" + tool)
        .then(TR)
        .catch((x) => E(x.message));
    if (section === "settings" && owner)
      api("/workspace/audit")
        .then(AU)
        .catch((x) => E(x.message));
    if (section === "pay")
      api("/workspace/transfers")
        .then(TX)
        .catch((x) => E(x.message));
  }, [section, tool, auth?.user?.id]);
  useEffect(() => {
    if (!auth || !router.query.payment || !first.current) return;
    first.current = false;
    mutate(
      "/billing/verify",
      { reference: router.query.payment },
      "Payment verified. Your plan has been updated.",
    );
  }, [auth, router.query.payment]);
  useEffect(() => {
    if (!modal) return;
    const prior = document.activeElement;
    const dialog = document.querySelector("[role=dialog]");
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll("button,input,select,textarea,a[href]") || [],
      ).filter((e) => !e.disabled);
    focusable()[0]?.focus();
    function trap(e) {
      if (e.key === "Tab") {
        const f = focusable(),
          a = f[0],
          b = f.at(-1);
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b?.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a?.focus();
        }
      }
    }
    document.addEventListener("keydown", trap);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", trap);
      document.body.style.overflow = old;
      prior?.focus();
    };
  }, [modal?.type]);
  async function mutate(path, body, message, method = "POST") {
    E("");
    N("");
    B(true);
    try {
      const r = await api("/workspace" + path, {
        method,
        body,
        csrf: auth.csrf,
      });
      await refresh();
      if (message) N(message);
      return r;
    } catch (x) {
      E(x.message);
      throw x;
    } finally {
      B(false);
    }
  }
  function safe(fn) {
    return (...args) => Promise.resolve(fn(...args)).catch(() => {});
  }
  function theme() {
    T(!dark);
    localStorage.setItem("resconate-theme", dark ? "light" : "dark");
  }
  async function logout() {
    try {
      await api("/auth/logout", { method: "POST", csrf: auth.csrf });
      router.push("/login");
    } catch (x) {
      E(x.message);
    }
  }
  const worker = workers.find((w) => w.id === detail),
    run = runs.find((r) => r.id === detail);
  function goModal(type, extra = {}) {
    E("");
    M({ type, ...extra });
  }
  const filteredEntries = entries.filter(
    (e) =>
      (kind === "all" || e.kind === kind) &&
      ((e.worker_name || "") + " " + e.note)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  function heading(title, desc, action) {
    return (
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">{business?.name || "YOUR WORKSPACE"}</p>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
        {action}
      </div>
    );
  }
  const addRecord = (
    <button className="button" onClick={() => goModal("entry")}>
      <Icon name="plus" /> Add a record
    </button>
  );
  function recordTable(list) {
    return (
      <div className="table-wrap">
        <table className="ledger">
          <thead>
            <tr>
              <th>Worker / record</th>
              <th className="optional">Date</th>
              <th>Amount / units</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id}>
                <td>
                  <span className="person-name">
                    {e.worker_name ||
                      workers.find((w) => w.id === e.worker_id)?.name}
                  </span>
                  <span className="person-meta">
                    {e.kind}
                    {e.method ? " · " + e.method : ""}
                  </span>
                </td>
                <td className="optional">{date(e.entry_date)}</td>
                <td>
                  {e.kind === "work" ? `${e.units} units` : money(e.amount)}
                </td>
                <td>
                  <span className={"status " + (e.voided_at ? "voided" : "")}>
                    {e.voided_at
                      ? "Voided"
                      : e.source === "provider"
                        ? "Confirmed"
                        : "Recorded"}
                  </span>
                </td>
                <td>
                  <button
                    className="table-action"
                    onClick={() => goModal("record-detail", { entry: e })}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  function payRows(r) {
    return (
      <div className="table-wrap">
        <table className="ledger">
          <thead>
            <tr>
              <th>Worker</th>
              <th className="optional">Gross</th>
              <th className="optional">Advances</th>
              <th>Due</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {r.items.map((item) => {
              const paid = Number(
                data.payment_totals?.find(
                  (p) =>
                    p.pay_run_id === r.id && p.worker_id === item.worker_id,
                )?.paid || 0,
              );
              const pending = transfers.some(
                (t) =>
                  t.pay_run_id === r.id &&
                  t.worker_id === item.worker_id &&
                  t.status === "pending",
              );
              return (
                <tr key={item.worker_id}>
                  <td>
                    <span className="person-name">{item.name}</span>
                    <span className="person-meta">
                      {item.units ? item.units + " units · " : ""}
                      {payName[item.pay_type]}
                    </span>
                  </td>
                  <td className="optional">{money(item.gross + item.bonus)}</td>
                  <td className="optional">{money(item.advance)}</td>
                  <td>
                    <strong>{money(Math.max(0, item.net - paid))}</strong>
                    <span className="person-meta">
                      {pending
                        ? "Transfer pending"
                        : paid
                          ? money(paid) + " recorded paid"
                          : ""}
                    </span>
                  </td>
                  <td>
                    {r.status !== "draft" && item.net > paid ? (
                      <button
                        className="table-action"
                        disabled={pending}
                        onClick={() =>
                          goModal("payment", {
                            worker_id: item.worker_id,
                            pay_run_id: r.id,
                            amount: (item.net - paid) / 100,
                          })
                        }
                      >
                        {pending ? "Pending" : "Record / send"}
                      </button>
                    ) : (
                      <button
                        className="table-action"
                        onClick={() => goModal("calculation", { item })}
                      >
                        {r.status === "draft"
                          ? "Check figures"
                          : "Paid · details"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  if (!auth || !data)
    return (
      <div className="loading">
        <Brand />
        <p>{error || "Opening your workspace…"}</p>
        {error && (
          <button className="button" onClick={() => location.reload()}>
            Try again
          </button>
        )}
      </div>
    );
  const content = () => {
    if (section === "workers" && detail) {
      if (!worker)
        return (
          <Empty title="Worker not found">
            Choose a worker from your list.
          </Empty>
        );
      return (
        <>
          {heading(
            worker.name,
            worker.role,
            <button
              className="button secondary"
              onClick={() => goModal("worker", { worker })}
            >
              Edit worker
            </button>,
          )}
          <Link className="text-link" href="/app/workers">
            ← All workers
          </Link>
          <div className="detail-layout">
            <section className="profile-agreement">
              <p className="eyebrow">AGREED PAY</p>
              <p className="amount">{money(worker.rate)}</p>
              <p>
                {payName[worker.pay_type]} · {worker.status}
              </p>
              <p>{worker.phone || "No phone added"}</p>
              {owner && (
                <button
                  className="button secondary small"
                  onClick={safe(async () => {
                    if (!auth.integrations.payments) {
                      E(
                        "Bank verification is available when payments are configured.",
                      );
                      return;
                    }
                    BL(await api("/workspace/banks"));
                    goModal("bank", { worker });
                  })}
                >
                  Verify bank account
                </button>
              )}
              {worker.account_name && (
                <p className="help-inline">
                  {worker.account_name} · account ending{" "}
                  {worker.account_number?.slice(-4)}
                </p>
              )}
            </section>
            <section>
              <h2 style={{ fontSize: 24 }}>Worker records</h2>
              {entries.some((e) => e.worker_id === worker.id) ? (
                recordTable(entries.filter((e) => e.worker_id === worker.id))
              ) : (
                <p>No records yet.</p>
              )}
              <button
                className="button small"
                onClick={() => goModal("entry", { worker_id: worker.id })}
              >
                Add a record
              </button>
            </section>
          </div>
        </>
      );
    }
    if (section === "workers")
      return (
        <>
          {heading(
            "Your workers.",
            `${active.length} active · ${planLabel[business.effective_plan]} plan`,
            <button className="button" onClick={() => goModal("worker")}>
              <Icon name="plus" /> Add a worker
            </button>,
          )}
          <div className="filter-row">
            <input
              aria-label="Search workers"
              placeholder="Find a worker"
              value={search}
              onChange={(e) => Q(e.target.value)}
            />
          </div>
          {workers.length ? (
            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>Name / role</th>
                    <th>Agreed pay</th>
                    <th className="optional">Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {workers
                    .filter((w) =>
                      (w.name + " " + w.role)
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((w) => (
                      <tr key={w.id}>
                        <td>
                          <Link href={"/app/workers/" + w.id}>
                            <span className="person-name">{w.name}</span>
                            <span className="person-meta">{w.role}</span>
                          </Link>
                        </td>
                        <td>
                          <strong>{money(w.rate)}</strong>
                          <span className="person-meta">
                            {payName[w.pay_type]}
                          </span>
                        </td>
                        <td className="optional">
                          <span className="status">{w.status}</span>
                        </td>
                        <td>
                          <Link
                            className="table-action"
                            href={"/app/workers/" + w.id}
                          >
                            View <Icon name="arrow" size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="Start with one worker."
              art="workers"
              action={
                <button className="button" onClick={() => goModal("worker")}>
                  Add your first worker
                </button>
              }
            >
              A name, job and agreed pay are enough to get started.
            </Empty>
          )}
        </>
      );
    if (section === "records")
      return (
        <>
          {heading(
            "The working record.",
            "Work, advances, bonuses and payments. Each with a history.",
            addRecord,
          )}
          <div className="filter-row">
            <input
              aria-label="Search records"
              placeholder="Find a worker or note"
              value={search}
              onChange={(e) => Q(e.target.value)}
            />
            <select
              aria-label="Record type"
              value={kind}
              onChange={(e) => K(e.target.value)}
            >
              <option value="all">All records</option>
              {["work", "advance", "bonus", "payment"].map((k) => (
                <option key={k} value={k}>
                  {k[0].toUpperCase() + k.slice(1)}
                </option>
              ))}
            </select>
            <a className="text-link" href="/api/workspace/export">
              Export CSV <Icon name="arrow" size={16} />
            </a>
          </div>
          {filteredEntries.length ? (
            recordTable(filteredEntries)
          ) : (
            <Empty title="Nothing recorded here yet." action={addRecord}>
              Add a work day, advance or payment as it happens.
            </Empty>
          )}
          <p className="help-inline">
            Showing up to 100 latest records. CSV export includes your complete
            history.
          </p>
        </>
      );
    if (section === "pay" && detail) {
      if (!run)
        return (
          <Empty title="Pay run not found">
            Choose a pay period from your list.
          </Empty>
        );
      return (
        <>
          {heading(
            "Review the pay.",
            `${date(run.start_date)} – ${date(run.end_date)} · ${run.status[0].toUpperCase() + run.status.slice(1)}`,
          )}
          <Link className="text-link" href="/app/pay">
            ← All pay periods
          </Link>
          <div className="pay-total">
            <div>
              <p>PREPARED TOTAL</p>
              <strong>{money(run.total)}</strong>
              <p>
                {run.items.length}{" "}
                {run.items.length === 1 ? "worker" : "workers"} · before
                statutory deductions
              </p>
            </div>
            <div className="pay-controls">
              {run.status === "draft" && owner && (
                <button
                  className="button"
                  onClick={() => goModal("approve", { run })}
                >
                  Approve pay <Icon name="check" />
                </button>
              )}
              <a
                href={"/api/workspace/pay-runs/" + run.id + "/statement"}
                className="button secondary"
              >
                Download statement
              </a>
            </div>
          </div>
          {payRows(run)}
          <p className="help-inline">
            Monthly and weekly wages use the full agreed rate. Daily and per-job
            wages use recorded units. Check each agreement before approval.
          </p>
          {transfers
            .filter((t) => t.pay_run_id === run.id)
            .map((t) => (
              <p className="help-inline" key={t.id}>
                Transfer {t.reference.slice(0, 12)} · {t.status} ·{" "}
                {money(t.amount)}{" "}
                {t.error
                  ? "— review the provider response in your payment account."
                  : ""}
              </p>
            ))}
        </>
      );
    }
    if (section === "pay")
      return (
        <>
          {heading(
            "Pay day, made clear.",
            "Prepare a period. Check the figures. Approve before paying.",
            owner && (
              <button className="button" onClick={() => goModal("payrun")}>
                <Icon name="plus" /> Prepare pay
              </button>
            ),
          )}
          {runs.length ? (
            <div className="pay-list">
              {runs.map((r) => (
                <Link key={r.id} href={"/app/pay/" + r.id}>
                  <div>
                    <h3>
                      {date(r.start_date)} – {date(r.end_date)}
                    </h3>
                    <p>
                      {r.items.length}{" "}
                      {r.items.length === 1 ? "worker" : "workers"} ·{" "}
                      <span className={"status " + r.status}>{r.status}</span>
                    </p>
                  </div>
                  <strong>{money(r.total)}</strong>
                  <Icon name="arrow" />
                </Link>
              ))}
            </div>
          ) : (
            <Empty
              title="Your next pay day starts here."
              action={
                owner && (
                  <button className="button" onClick={() => goModal("payrun")}>
                    Prepare a pay period
                  </button>
                )
              }
            >
              Add workers and record their work or advances. Then review the
              calculation together.
            </Empty>
          )}
        </>
      );
    if (section === "settings")
      return (
        <>
          {heading(
            "Your business, connected.",
            "Account details, plans and the services you use.",
          )}
          {owner && (
            <section className="settings-section">
              <div>
                <h2>Business details</h2>
                <p>The name shown on your records.</p>
              </div>
              <form
                onSubmit={safe(async (e) => {
                  e.preventDefault();
                  await mutate(
                    "/settings",
                    Object.fromEntries(new FormData(e.target)),
                    "Business details saved.",
                    "PATCH",
                  );
                })}
              >
                <Field label="Business name">
                  <input name="name" defaultValue={business.name} required />
                </Field>
                <div className="form-row">
                  <Field label="Business type">
                    <select
                      name="sector"
                      defaultValue={business.sector || "food"}
                    >
                      <option value="food">Food & hospitality</option>
                      <option value="retail">Retail</option>
                      <option value="beauty">Salon & beauty</option>
                      <option value="services">Services</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                  <Field label="Phone">
                    <input
                      name="phone"
                      type="tel"
                      defaultValue={business.phone || ""}
                    />
                  </Field>
                </div>
                <button className="button small" disabled={busy}>
                  Save details
                </button>
              </form>
            </section>
          )}
          <section className="settings-section">
            <div>
              <h2>Plan</h2>
              <p>
                Current access: {planLabel[business.effective_plan]}.{" "}
                {business.trial_ends_at
                  ? "Trial ends " + date(business.trial_ends_at) + "."
                  : ""}
              </p>
              <Link href="/pricing" className="text-link">
                Compare plans
              </Link>
            </div>
            <div>
              <p>
                {business.paid_until
                  ? "Paid access through " + date(business.paid_until)
                  : "Free Basic supports 2 workers after the trial."}
              </p>
              {owner && (
                <div className="plan-choices">
                  {[
                    ["small", "Small · ₦3,500"],
                    ["growth", "Growth · ₦7,500"],
                    ["assisted", "Assisted · ₦25,000"],
                  ].map(([plan, label]) => (
                    <button
                      key={plan}
                      className="button secondary small"
                      disabled={busy}
                      onClick={safe(async () => {
                        const r = await mutate("/billing", { plan });
                        location.assign(r.url);
                      })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <p className="help-inline">
                Monthly access. Provider fees are separate.
              </p>
            </div>
          </section>
          <section className="settings-section">
            <div>
              <h2>Connections</h2>
              <p>Connect when you want to use them.</p>
            </div>
            <div>
              {[
                [
                  "whatsapp",
                  "WhatsApp",
                  "Text records with a confirmation step.",
                ],
                [
                  "payments",
                  "Bank transfers",
                  "Separate from payments you record yourself.",
                ],
                [
                  "email",
                  "Account email",
                  "Reset links, invitations and support delivery.",
                ],
              ].map(([key, label, desc]) => (
                <div className="integration-line" key={key}>
                  <div>
                    <strong>{label}</strong>
                    <p>{desc}</p>
                  </div>
                  <span
                    className={
                      "status " + (auth.integrations[key] ? "success" : "")
                    }
                  >
                    {auth.integrations[key] ? "Available" : "Not configured"}
                  </span>
                </div>
              ))}
              {owner && (
                <div className="actions">
                  <button
                    className="button secondary small"
                    onClick={safe(async () =>
                      LC(await mutate("/whatsapp/link", {})),
                    )}
                  >
                    Link WhatsApp
                  </button>
                  <button
                    className="table-action"
                    onClick={safe(() =>
                      mutate(
                        "/whatsapp/link",
                        undefined,
                        "WhatsApp unlinked.",
                        "DELETE",
                      ),
                    )}
                  >
                    Unlink number
                  </button>
                </div>
              )}
              {linkCode && (
                <Notice type="success">
                  {linkCode.message} {linkCode.number || ""}
                </Notice>
              )}
            </div>
          </section>
          <section className="settings-section">
            <div>
              <h2>Account security</h2>
              <p>{user.email}</p>
            </div>
            <div>
              <button
                className="button secondary small"
                onClick={() => goModal("password")}
              >
                Change password
              </button>
              {owner && (
                <button
                  className="button secondary small"
                  style={{ marginLeft: 12 }}
                  onClick={() => goModal("invite")}
                >
                  Invite supervisor
                </button>
              )}
              <button
                className="table-action"
                style={{ display: "block" }}
                onClick={logout}
              >
                Sign out
              </button>
            </div>
          </section>
          {owner && (
            <section className="settings-section">
              <div>
                <h2>Activity log</h2>
                <p>Changes made in this workspace.</p>
              </div>
              <div>
                {audit.length ? (
                  audit.slice(0, 20).map((a) => (
                    <div className="integration-line" key={a.id}>
                      <div>
                        <strong style={{ fontSize: 14 }}>
                          {a.action.replaceAll(".", " · ")}
                        </strong>
                        <p>
                          {a.user_name || "System"} · {date(a.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No changes recorded yet.</p>
                )}
              </div>
            </section>
          )}
        </>
      );
    if (section === "tools")
      return (
        <>
          {heading(
            "A little more organisation.",
            "Keep leave requests, vacancies and performance notes together.",
            <button className="button" onClick={() => goModal("tool")}>
              <Icon name="plus" /> Add{" "}
              {tool === "jobs"
                ? "vacancy"
                : tool === "reviews"
                  ? "review"
                  : "leave"}
            </button>,
          )}
          <div className="tool-tabs">
            {[
              ["leave_requests", "Leave"],
              ["jobs", "Vacancies"],
              ["reviews", "Reviews"],
            ].map(([k, l]) => (
              <button
                className={tool === k ? "active" : ""}
                key={k}
                onClick={() => TT(k)}
              >
                {l}
              </button>
            ))}
          </div>
          {toolRows.length ? (
            toolRows.map((r) => (
              <article className="tool-row" key={r.id}>
                <div>
                  <h3>
                    {r.title || workers.find((w) => w.id === r.worker_id)?.name}
                  </h3>
                  <p>
                    {tool === "leave_requests"
                      ? `${date(r.start_date)} – ${date(r.end_date)}`
                      : tool === "reviews"
                        ? `${r.rating} / 5`
                        : r.description}
                  </p>
                  {r.note && <p>{r.note}</p>}
                </div>
                <div>
                  <span className="status">{r.status || "Saved"}</span>
                  {owner && tool !== "reviews" && (
                    <select
                      aria-label="Change status"
                      value={r.status}
                      style={{ marginTop: 12 }}
                      onChange={safe(async (e) => {
                        await mutate(
                          "/tools/" + tool + "/" + r.id,
                          { status: e.target.value },
                          "Status updated.",
                          "PATCH",
                        );
                        TR(await api("/workspace/tools/" + tool));
                      })}
                    >
                      {(tool === "jobs"
                        ? ["open", "closed"]
                        : ["pending", "approved", "declined"]
                      ).map((s) => (
                        <option value={s} key={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </article>
            ))
          ) : (
            <Empty
              title={
                tool === "jobs"
                  ? "The next person you need."
                  : tool === "reviews"
                    ? "Keep the feedback."
                    : "Time away, recorded."
              }
            >
              Add a record using the button above.
            </Empty>
          )}
        </>
      );
    if (section === "support")
      return (
        <>
          {heading(
            "A hand with the next step.",
            "Send the details. Your request stays in this workspace.",
          )}
          <div className="detail-layout">
            <form
              onSubmit={safe(async (e) => {
                e.preventDefault();
                const f = e.target;
                await mutate(
                  "/support",
                  Object.fromEntries(new FormData(f)),
                  "Your request has been saved.",
                );
                f.reset();
              })}
            >
              <Field label="What do you need?">
                <select name="category">
                  <option value="support">Workspace help</option>
                  <option value="setup">Guided setup</option>
                  <option value="studio">Website / design project</option>
                  <option value="specialist">Specialist request</option>
                </select>
              </Field>
              <Field label="Tell us what happened">
                <textarea
                  name="message"
                  minLength={10}
                  maxLength={3000}
                  rows={5}
                  required
                />
              </Field>
              <button className="button" disabled={busy}>
                Save support request <Icon name="arrow" />
              </button>
            </form>
            <div>
              <img
                src="/illustrations/chat.svg"
                alt=""
                style={{ height: 140 }}
              />
              <h2 style={{ fontSize: 28 }}>Start with the details.</h2>
              <p>
                Include the worker, period or record you need help with. Support
                can follow up at your account email.
              </p>
              <Link href="/help" className="text-link">
                Read common answers
              </Link>
              <Link
                href="/app/tools"
                className="text-link"
                style={{ display: "flex" }}
              >
                Open team tools
              </Link>
            </div>
          </div>
          <div className="support-history">
            <h2 style={{ fontSize: 24 }}>Your requests</h2>
            {data.support.map((s) => (
              <article key={s.id}>
                <span className="status">{s.status}</span>
                <p>{s.message}</p>
                <small>{date(s.created_at)}</small>
              </article>
            ))}
          </div>
        </>
      );
    if (section !== "")
      return (
        <Empty
          title="This page is not here."
          action={
            <Link href="/app" className="button">
              Open workspace
            </Link>
          }
        >
          Return to your workspace to continue.
        </Empty>
      );
    return (
      <>
        {heading(
          "The working day.",
          active.length
            ? "Keep today’s details before they slip away."
            : "Add your first worker to start keeping records.",
          active.length ? (
            addRecord
          ) : (
            <button className="button" onClick={() => goModal("worker")}>
              <Icon name="plus" /> Add your first worker
            </button>
          ),
        )}
        <section className="workbench">
          <div>
            <p className="eyebrow">
              {active.length
                ? `${active.length} ${active.length === 1 ? "PERSON" : "PEOPLE"} IN YOUR TEAM`
                : "YOUR FIRST WORKER"}
            </p>
            <h2>
              {active.length
                ? "Prepare the next pay day."
                : "A name. A rate.\nA clear start."}
            </h2>
            <p>
              {active.length
                ? "Review work, advances and bonuses together before paying."
                : "Add the people you pay. Daily help or a regular team, each agreement belongs here."}
            </p>
            {active.length > 0 && (
              <div className="actions">
                <button
                  className="button secondary"
                  onClick={() => goModal("payrun")}
                >
                  Prepare pay <Icon name="arrow" size={16} />
                </button>
                <Link
                  className="text-link"
                  href={demo ? "/signup" : "/app/workers"}
                >
                  View team
                </Link>
              </div>
            )}
          </div>
          <div className="workbench-art">
            <img
              src="/illustrations/shop.svg"
              alt="Neighbourhood shop counter"
            />
            <p>One place for work, advances and pay.</p>
          </div>
        </section>
        <section>
          <div className="ledger-header">
            <h2>Latest records</h2>
            <Link
              href={demo ? "/signup" : "/app/records"}
              className="text-link"
            >
              All records <Icon name="arrow" size={16} />
            </Link>
          </div>
          {entries.length ? (
            recordTable(entries.slice(0, 6))
          ) : (
            <Empty title="The record starts here.">
              Work days, an advance, a bonus. Add the first detail.
            </Empty>
          )}
        </section>
        {demo && (
          <p className="help-inline">
            Sample workspace. Changes here are temporary and reset when you
            reload.
          </p>
        )}
      </>
    );
  };
  return (
    <div className={dark ? "dark" : ""}>
      {demo && (
        <div className="demo-banner">
          <span>
            Sample business · your changes stay in this browser session
          </span>
          <Link href="/signup">Create workspace →</Link>
        </div>
      )}
      <Seo
        title={
          (nav.find((n) => n[0] === section)?.[2] || "Workspace") +
          " · " +
          business.name
        }
      />
      <div
        className="workspace"
        data-behind={modal ? true : undefined}
        inert={modal ? true : undefined}
      >
        <aside className="sidebar" data-float>
          <Brand />
          <div className="business-label">
            <strong>{business.name}</strong>
            {planLabel[business.effective_plan]} plan
          </div>
          <nav className="side-nav" aria-label="Workspace navigation">
            {nav.map(([path, icon, label]) => (
              <Link
                href={demo ? "/signup" : "/app" + (path ? "/" + path : "")}
                className={section === path ? "active" : ""}
                key={path}
                data-mobile-hide={
                  ["tools", "support"].includes(path) ? true : undefined
                }
              >
                <Icon name={icon} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <button onClick={theme}>
              <Icon name="sun" size={18} />
              {dark ? "Light appearance" : "Dark appearance"}
            </button>
            <button onClick={demo ? () => router.push("/signup") : logout}>
              <Icon name="logout" size={18} />
              {demo ? "Start your business" : "Sign out"}
            </button>
          </div>
        </aside>
        <div className="workspace-body" data-scrolls>
          <header className="workspace-top">
            <div className="workspace-mobile-brand">
              <Brand />
            </div>
            <span className="top-date">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
            <div className="account-name">
              <span>{user.name}</span>
              <button
                className="icon-button"
                aria-label={
                  dark ? "Use light appearance" : "Use dark appearance"
                }
                onClick={theme}
              >
                <Icon name="sun" size={18} />
              </button>
              <Link
                className="avatar"
                href={demo ? "/signup" : "/app/settings"}
                aria-label="Account settings"
              >
                {user.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </Link>
            </div>
          </header>
          <main className="workspace-main">
            <Notice>{error}</Notice>
            <Notice type="success">{notice}</Notice>
            {content()}
          </main>
        </div>
      </div>
      {modal && (
        <Modal
          title={
            {
              worker: modal.worker ? "Edit worker" : "Add a worker",
              entry: "Add a record",
              payment: "Record or send payment",
              payrun: "Prepare a pay period",
              approve: "Approve this pay period?",
              bank: "Verify bank account",
              password: "Change password",
              invite: "Invite a supervisor",
              tool: "Add a team record",
              "record-detail": "Record details",
              calculation: "Pay calculation",
            }[modal.type]
          }
          onClose={() => M(null)}
        >
          <WorkspaceForm
            modal={modal}
            setModal={M}
            active={active}
            workers={workers}
            runs={runs}
            demo={demo}
            data={data}
            setData={D}
            mutate={mutate}
            busy={busy}
            error={error}
            setError={E}
            owner={owner}
            bankList={bankList}
            tool={tool}
            setToolRows={TR}
            csrf={auth.csrf}
            integrations={auth.integrations}
          />
        </Modal>
      )}
    </div>
  );
}
function WorkspaceForm({
  modal,
  setModal,
  active,
  workers,
  runs,
  demo,
  data,
  setData,
  mutate,
  busy,
  error,
  setError,
  owner,
  bankList,
  tool,
  setToolRows,
  integrations,
}) {
  const [stage, S] = useState("edit"),
    [draft, D] = useState(null),
    [mode, MO] = useState("record"),
    [entryKind, K] = useState(modal.type === "payment" ? "payment" : "advance");
  const close = () => setModal(null);
  const num = (v) => Math.round(Number(v) * 100);
  const safe = (fn) => async (e) => {
    try {
      await fn(e);
    } catch {}
  };
  async function save() {
    if (demo) {
      const e = {
        ...draft,
        id: "demo-" + Date.now(),
        worker_name: workers.find((w) => w.id === draft.worker_id)?.name,
        source: "owner",
        created_at: new Date().toISOString(),
      };
      setData({ ...data, entries: [e, ...data.entries] });
      S("done");
      return;
    }
    await mutate("/entries", draft);
    S("done");
  }
  async function submit(e) {
    e.preventDefault();
    setError("");
    const d = Object.fromEntries(new FormData(e.target));
    if (["entry", "payment"].includes(modal.type)) {
      D({
        worker_id: d.worker_id,
        kind: d.kind,
        entry_date: d.entry_date,
        amount: d.kind === "work" ? 0 : num(d.amount),
        ...(d.kind === "work" ? { units: Number(d.units) } : {}),
        note: d.note || "",
        ...(d.kind === "payment"
          ? {
              method: d.method,
              ...(d.pay_run_id ? { pay_run_id: d.pay_run_id } : {}),
            }
          : {}),
      });
      S("review");
      return;
    }
    if (modal.type === "worker") {
      d.rate = num(d.rate);
      if (demo) {
        setData({
          ...data,
          workers: [
            ...data.workers,
            { ...d, id: "demo-" + Date.now(), status: "active" },
          ],
        });
        close();
        return;
      }
      await mutate(
        "/workers" + (modal.worker ? "/" + modal.worker.id : ""),
        d,
        "Worker saved.",
        modal.worker ? "PATCH" : "POST",
      );
    }
    if (modal.type === "payrun") {
      if (demo) {
        setError("Create your own workspace to save and approve a pay period.");
        return;
      }
      const r = await mutate(
        "/pay-runs",
        d,
        "Pay draft prepared. Open it to review.",
      );
      location.assign("/app/pay/" + r.id);
      return;
    }
    if (modal.type === "bank")
      await mutate(
        "/workers/" + modal.worker.id + "/bank",
        d,
        "Bank account verified.",
      );
    if (modal.type === "password")
      await mutate("/change-password", d, "Password changed.");
    if (modal.type === "invite")
      await mutate("/invite", d, "Invitation queued.");
    if (modal.type === "tool") {
      if (d.rating) d.rating = Number(d.rating);
      await mutate("/tools/" + tool, d, "Team record saved.");
      setToolRows(await api("/workspace/tools/" + tool));
    }
    close();
  }
  if (modal.type === "calculation") {
    const i = modal.item;
    return (
      <div className="record-review">
        <h3>{i.name}</h3>
        <dl>
          {[
            ["Agreed rate", money(i.rate) + " " + payName[i.pay_type]],
            ["Recorded units", i.units],
            ["Gross pay", money(i.gross)],
            ["Bonus", money(i.bonus)],
            ["Advance", money(i.advance)],
            ["Net pay", money(i.net)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="quiet">No statutory deductions calculated.</p>
      </div>
    );
  }
  if (modal.type === "record-detail") {
    const e = modal.entry;
    return (
      <>
        <div className="record-review">
          <dl>
            {[
              [
                "Worker",
                e.worker_name ||
                  workers.find((w) => w.id === e.worker_id)?.name,
              ],
              ["Record", e.kind],
              [
                "Value",
                e.kind === "work" ? e.units + " units" : money(e.amount),
              ],
              ["Date", date(e.entry_date)],
              ["Method", e.method || "—"],
              ["Source", e.source],
              ["Note", e.note || "—"],
              ["Status", e.voided_at ? "Voided: " + e.void_reason : "Recorded"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        {owner &&
          !e.voided_at &&
          !e.allocated_run_id &&
          e.source !== "provider" &&
          !demo && (
            <form
              onSubmit={safe(async (ev) => {
                ev.preventDefault();
                await mutate(
                  "/entries/" + e.id + "/void",
                  Object.fromEntries(new FormData(ev.target)),
                  "Record voided.",
                );
                close();
              })}
            >
              <Field label="Reason for voiding">
                <input name="reason" required minLength={5} maxLength={500} />
              </Field>
              <Notice>{error}</Notice>
              <button className="button secondary" disabled={busy}>
                Void this record
              </button>
            </form>
          )}
      </>
    );
  }
  if (modal.type === "approve")
    return (
      <>
        <p>
          Approve <strong>{money(modal.run.total)}</strong> for{" "}
          {modal.run.items.length} workers. The work, advances and bonuses in
          this period become locked.
        </p>
        <p>Approval prepares pay. It does not send money.</p>
        <Notice>{error}</Notice>
        <div className="modal-actions">
          <button className="button secondary" onClick={close}>
            Keep draft
          </button>
          <button
            className="button"
            disabled={busy}
            onClick={safe(async () => {
              await mutate(
                "/pay-runs/" + modal.run.id + "/approve",
                {},
                "Pay approved. Record payments below.",
              );
              close();
            })}
          >
            Approve {money(modal.run.total)}
          </button>
        </div>
      </>
    );
  if (stage === "done")
    return (
      <div className="record-success">
        <Icon name="check" size={44} />
        <h3>
          {draft.kind === "payment"
            ? draft.method === "cash"
              ? "Cash payment"
              : "Bank payment"
            : draft.kind[0].toUpperCase() + draft.kind.slice(1)}{" "}
          recorded.
        </h3>
        <p>
          {draft.kind === "work" ? draft.units + " units" : money(draft.amount)}{" "}
          for {workers.find((w) => w.id === draft.worker_id)?.name}.
        </p>
        <p className="quiet">{date(draft.entry_date)}</p>
        <p className="quiet">
          {draft.kind === "payment"
            ? "Payment recorded as reported. No money was sent."
            : "Ready for the next pay calculation."}
        </p>
        <button className="button wide" onClick={close}>
          Back to the working day
        </button>
      </div>
    );
  if (stage === "review")
    return (
      <div className="record-review">
        <p className="eyebrow">CHECK THE DETAILS</p>
        <h3>
          {draft.kind === "work" ? draft.units + " units" : money(draft.amount)}
        </h3>
        <dl>
          {[
            ["Worker", workers.find((w) => w.id === draft.worker_id)?.name],
            ["Record", draft.kind],
            ["Date", date(draft.entry_date)],
            ["Note", draft.note || "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {draft.kind === "payment" && (
          <p className="quiet">
            This records a {draft.method} payment you already made. It does not
            send money.
          </p>
        )}
        <Notice>{error}</Notice>
        <div className="modal-actions">
          <button className="button secondary" onClick={() => S("edit")}>
            Edit details
          </button>
          <button className="button" disabled={busy} onClick={safe(save)}>
            Confirm record <Icon name="check" size={18} />
          </button>
        </div>
      </div>
    );
  if (modal.type === "payment" && mode === "send")
    return (
      <>
        <p>
          Send <strong>{money(num(modal.amount))}</strong> to{" "}
          {workers.find((w) => w.id === modal.worker_id)?.name} through
          Paystack. Verify the worker’s bank account first.
        </p>
        <p>
          {workers.find((w) => w.id === modal.worker_id)?.account_name ||
            "No verified account"}{" "}
          · account ending{" "}
          {workers
            .find((w) => w.id === modal.worker_id)
            ?.account_number?.slice(-4) || "—"}
        </p>
        <p className="quiet">
          This requests a real transfer. Pending transfers cannot be requested
          again.
        </p>
        <Notice>{error}</Notice>
        <div className="modal-actions">
          <button className="button secondary" onClick={() => MO("record")}>
            Back
          </button>
          <button
            className="button"
            disabled={busy}
            onClick={safe(async () => {
              await mutate(
                "/pay-runs/" + modal.pay_run_id + "/transfer",
                { worker_id: modal.worker_id, confirmed: true },
                "Transfer requested. Check its status before paying again.",
              );
              close();
            })}
          >
            Send {money(num(modal.amount))}
          </button>
        </div>
      </>
    );
  return (
    <form onSubmit={safe(submit)}>
      {modal.type === "worker" && (
        <>
          <Field label="Worker name">
            <input
              name="name"
              defaultValue={modal.worker?.name}
              required
              maxLength={100}
            />
          </Field>
          <div className="form-row">
            <Field label="Job / role">
              <input
                name="role"
                defaultValue={modal.worker?.role}
                required
                maxLength={100}
              />
            </Field>
            <Field label="Phone">
              <input
                name="phone"
                type="tel"
                defaultValue={modal.worker?.phone}
              />
            </Field>
          </div>
          <div className="form-row">
            <Field label="Pay arrangement">
              <select
                name="pay_type"
                defaultValue={modal.worker?.pay_type || "daily"}
              >
                {Object.keys(payName).map((p) => (
                  <option value={p} key={p}>
                    {p === "per_job"
                      ? "Per job"
                      : p[0].toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Agreed rate (₦)">
              <input
                name="rate"
                type="number"
                min="0.01"
                max="10000000"
                step="0.01"
                required
                defaultValue={
                  modal.worker ? modal.worker.rate / 100 : undefined
                }
              />
            </Field>
          </div>
          {modal.worker && (
            <Field label="Employment status">
              <select name="status" defaultValue={modal.worker.status}>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          )}
          <p className="quiet">
            Weekly and monthly pay use the full agreed rate for a pay period.
          </p>
        </>
      )}
      {["entry", "payment"].includes(modal.type) && (
        <>
          {modal.type === "payment" && owner && (
            <div className="tool-tabs">
              <button type="button" className="active">
                Record payment
              </button>
              <button
                type="button"
                disabled={!integrations.payments}
                onClick={() => MO("send")}
              >
                Send bank transfer
              </button>
            </div>
          )}
          <Field label="Worker">
            <select
              name="worker_id"
              required
              defaultValue={modal.worker_id || active[0]?.id}
            >
              <option value="" disabled>
                Choose a worker
              </option>
              {active.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </Field>
          {modal.type === "entry" ? (
            <Field label="Record type">
              <select
                name="kind"
                value={entryKind}
                onChange={(e) => K(e.target.value)}
              >
                <option value="advance">Advance given</option>
                <option value="work">Work days / units</option>
                <option value="bonus">Bonus</option>
                <option value="payment">Payment already made</option>
              </select>
            </Field>
          ) : (
            <input type="hidden" name="kind" value="payment" />
          )}
          <div className="form-row">
            <Field
              label={
                entryKind === "work" ? "Days / units worked" : "Amount (₦)"
              }
            >
              <input
                name={entryKind === "work" ? "units" : "amount"}
                type="number"
                min="0.01"
                max={entryKind === "work" ? 10000 : 10000000}
                step="0.01"
                required
                defaultValue={modal.amount}
              />
            </Field>
            <Field label="Date">
              <input
                name="entry_date"
                type="date"
                required
                defaultValue={today()}
              />
            </Field>
          </div>
          {entryKind === "payment" && (
            <>
              <Field label="Payment method">
                <select name="method">
                  <option value="cash">Cash — already paid</option>
                  <option value="bank">Bank transfer — already sent</option>
                </select>
              </Field>
              {modal.pay_run_id ? (
                <input
                  type="hidden"
                  name="pay_run_id"
                  value={modal.pay_run_id}
                />
              ) : (
                <Field label="Approved pay period (optional)">
                  <select name="pay_run_id">
                    <option value="">Standalone payment record</option>
                    {runs
                      .filter((r) => r.status !== "draft")
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {date(r.start_date)} – {date(r.end_date)}
                        </option>
                      ))}
                  </select>
                </Field>
              )}
              <p className="quiet">
                Standalone payments do not settle an approved pay run. Choose
                its period to apply payment to it.
              </p>
            </>
          )}
          <Field label="Note (optional)">
            <input name="note" maxLength={500} />
          </Field>
        </>
      )}
      {modal.type === "payrun" && (
        <>
          <p>
            Choose the dates you are paying for. Monthly and weekly wages use
            the full agreed rate. Daily and per-job wages use recorded units.
          </p>
          <div className="form-row">
            <Field label="Start date">
              <input
                name="start_date"
                type="date"
                defaultValue={today().slice(0, 8) + "01"}
                required
              />
            </Field>
            <Field label="End date">
              <input
                name="end_date"
                type="date"
                defaultValue={today()}
                required
              />
            </Field>
          </div>
          <p className="quiet">
            You can review the draft before approving. Approved periods cannot
            overlap.
          </p>
        </>
      )}
      {modal.type === "bank" && (
        <>
          <Field label="Bank">
            <select name="bank_code" required>
              {bankList.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Account number">
            <input
              name="account_number"
              inputMode="numeric"
              pattern="[0-9]{10}"
              minLength={10}
              maxLength={10}
              required
            />
          </Field>
          <p className="quiet">
            The account name is verified with the payment provider.
          </p>
        </>
      )}
      {modal.type === "password" && (
        <>
          <Field label="Current password">
            <input
              name="current"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>
          <Field label="New password">
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              required
            />
          </Field>
        </>
      )}
      {modal.type === "invite" && (
        <>
          <Field label="Supervisor email">
            <input name="email" type="email" required />
          </Field>
          <p className="quiet">
            Supervisors can manage workers and records. Only the owner approves
            pay, requests transfers and changes business settings.
          </p>
        </>
      )}
      {modal.type === "tool" && (
        <>
          {tool !== "jobs" && (
            <Field label="Worker">
              <select name="worker_id" required>
                {active.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {tool === "leave_requests" ? (
            <>
              <div className="form-row">
                <Field label="From">
                  <input name="start_date" type="date" required />
                </Field>
                <Field label="To">
                  <input name="end_date" type="date" required />
                </Field>
              </div>
              <Field label="Note">
                <textarea name="note" rows={3} />
              </Field>
            </>
          ) : tool === "jobs" ? (
            <>
              <Field label="Job title">
                <input name="title" required />
              </Field>
              <Field label="Job details">
                <textarea name="description" rows={4} minLength={10} required />
              </Field>
            </>
          ) : (
            <>
              <Field label="Rating">
                <select name="rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Feedback">
                <textarea name="note" rows={4} minLength={5} required />
              </Field>
            </>
          )}
        </>
      )}
      <Notice>{error}</Notice>
      <div className="modal-actions">
        <button className="button secondary" type="button" onClick={close}>
          Cancel
        </button>
        <button
          className="button"
          disabled={
            busy ||
            (["entry", "payment", "tool"].includes(modal.type) &&
              !active.length)
          }
        >
          {busy
            ? "Saving…"
            : ["entry", "payment"].includes(modal.type)
              ? "Review record"
              : modal.type === "payrun"
                ? "Prepare draft"
                : "Save"}{" "}
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </form>
  );
}
