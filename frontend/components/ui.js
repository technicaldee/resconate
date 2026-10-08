import Link from "next/link";
import Head from "next/head";
import { useState, useId, cloneElement } from "react";
export const money = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format((Number(n) || 0) / 100);
export const date = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        timeZone: /^\d{4}-\d{2}-\d{2}$/.test(String(d))
          ? "UTC"
          : "Africa/Lagos",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
export function Icon({ name, size = 20 }) {
  const paths = {
    arrow: "M5 12h14m-6-6 6 6-6 6",
    home: "m3 10 9-7 9 7v11H3Zm6 11v-8h6v8",
    workers:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-8a4 4 0 0 1 0 8",
    record: "M8 3h8v4H8Zm0 2H4v16h16V5h-4M8 12h8m-8 4h5",
    pay: "M3 6h18v12H3Zm9 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
    settings:
      "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0-6v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",
    help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-2 7a2 2 0 1 1 3 1.7L12 13m0 3v.1",
    plus: "M12 5v14M5 12h14",
    check: "m5 12 4 4L19 6",
    close: "m6 6 12 12M6 18 18 6",
    menu: "M4 6h16M4 12h16M4 18h16",
    logout: "M9 4H4v16h5m5-13 5 5-5 5m-5-5h10",
    sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.record} />
    </svg>
  );
}
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Resconate home">
      <img src="/logo.png" alt="" width="38" height="38" />
      <span>
        resconate<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export function Seo({
  title = "Pay your team. Keep your records.",
  description = "Worker records, advances and pay for small businesses in Nigeria.",
}) {
  return (
    <Head>
      <title>{`${title} · Resconate`}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/logo.png" />
    </Head>
  );
}
export function PublicLayout({ children, title }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Seo title={title} />
      <header className="public-header">
        <Brand />
        <nav
          className={open ? "public-nav is-open" : "public-nav"}
          aria-label="Main navigation"
        >
          <Link href="/how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/services">Services</Link>
          <Link href="/help">Help</Link>
          <Link href="/login" className="sign-in">
            Sign in
          </Link>
          <Link href="/signup" className="button small">
            Start free <Icon name="arrow" size={16} />
          </Link>
        </nav>
        <button
          className="icon-button menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </header>
      <main>{children}</main>
      <footer className="public-footer">
        <div>
          <Brand />
          <p>People. Pay. One clear record.</p>
        </div>
        <div>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <small>{new Date().getFullYear()} Resconate</small>
      </footer>
    </>
  );
}
export function Field({ label, children, hint }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, {
        id,
        "aria-describedby": hint ? id + "-hint" : undefined,
      })}
      {hint && <small id={id + "-hint"}>{hint}</small>}
    </div>
  );
}
export function Notice({ children, type = "error" }) {
  return children ? (
    <div
      className={`notice ${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  ) : null;
}
export function Empty({ title, children, art = "records", action }) {
  return (
    <div className="empty">
      <img src={`/illustrations/${art}.svg`} alt="" />
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}
export async function api(path, { method = "GET", body, csrf } = {}) {
  const r = await fetch("/api" + path, {
    method,
    credentials: "same-origin",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(csrf ? { "x-csrf-token": csrf } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await r
    .json()
    .catch(() => ({ error: "The service is unavailable. Please try again." }));
  if (!r.ok)
    throw Object.assign(new Error(data.error || "Request failed"), {
      status: r.status,
    });
  return data;
}
export function Modal({ title, children, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
