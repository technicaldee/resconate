import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Brand, Seo, Field, Notice, api, Icon } from "./ui";
const titles = {
  login: "Back to your business.",
  signup: "Start with your team.",
  forgot: "Get back into your account.",
  reset: "Choose a new password.",
  invite: "Join your team’s workspace.",
};
export default function Auth({ mode = "login" }) {
  const router = useRouter();
  const [error, E] = useState(""),
    [success, S] = useState(""),
    [busy, B] = useState(false);
  async function submit(e) {
    e.preventDefault();
    E("");
    S("");
    B(true);
    const d = Object.fromEntries(new FormData(e.target));
    if (mode === "reset" || mode === "invite") d.token = router.query.token;
    try {
      const routes = {
        login: "login",
        signup: "register",
        forgot: "forgot",
        reset: "reset",
        invite: "accept-invite",
      };
      const r = await api("/auth/" + routes[mode], { method: "POST", body: d });
      if (mode === "forgot") S(r.message);
      else if (mode === "reset") {
        S("Password changed. Sign in with your new password.");
      } else await router.push("/app");
    } catch (x) {
      E(x.message);
    } finally {
      B(false);
    }
  }
  return (
    <div className="auth-layout">
      <Seo title={titles[mode]} />
      <aside className="auth-story">
        <Brand />
        <div>
          <p className="eyebrow">THE NEXT WORKING DAY</p>
          <h2>
            People to pay.
            <br />
            Records to keep.
            <br />A business to run.
          </h2>
          <img src="/illustrations/shop.svg" alt="A small shop counter" />
        </div>
        <p>One place for the details that matter.</p>
      </aside>
      <main className="auth-main">
        <Link className="text-link" href="/">
          ← Back to Resconate
        </Link>
        <div className="auth-form">
          <p className="eyebrow">
            {mode === "signup" ? "CREATE YOUR WORKSPACE" : "YOUR ACCOUNT"}
          </p>
          <h1>{titles[mode]}</h1>
          <p>
            {mode === "signup"
              ? "Try 15 workers for 14 days. Keep 2 workers free after that."
              : mode === "login"
                ? "Your team’s records are waiting here."
                : mode === "forgot"
                  ? "Enter your account email to request a reset link."
                  : "Use at least 10 characters."}
          </p>
          <form onSubmit={submit}>
            {["signup", "invite"].includes(mode) && (
              <Field label="Your name">
                <input
                  name="name"
                  required
                  maxLength={100}
                  autoComplete="name"
                />
              </Field>
            )}
            {mode === "signup" && (
              <Field label="Business name">
                <input
                  name="business_name"
                  required
                  maxLength={150}
                  autoComplete="organization"
                />
              </Field>
            )}
            {["login", "signup", "forgot"].includes(mode) && (
              <Field label="Email address">
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </Field>
            )}
            {mode === "signup" && (
              <Field label="Phone / WhatsApp">
                <input name="phone" type="tel" autoComplete="tel" />
              </Field>
            )}
            {mode !== "forgot" && (
              <Field
                label={mode === "reset" ? "New password" : "Password"}
                hint={mode === "signup" ? "At least 10 characters." : ""}
              >
                <input
                  name="password"
                  type="password"
                  minLength={mode === "login" ? 1 : 10}
                  maxLength={128}
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </Field>
            )}
            <Notice>{error}</Notice>
            <Notice type="success">{success}</Notice>
            <button
              className="button wide"
              disabled={
                busy ||
                ((mode === "invite" || mode === "reset") && !router.query.token)
              }
            >
              {busy
                ? "Please wait…"
                : {
                    login: "Sign in",
                    signup: "Create workspace",
                    forgot: "Request reset link",
                    reset: "Save password",
                    invite: "Join workspace",
                  }[mode]}{" "}
              <Icon name="arrow" />
            </button>
          </form>
          {mode === "login" ? (
            <div className="auth-links">
              <Link href="/forgot-password">Forgot password?</Link>
              <span>
                New here? <Link href="/signup">Start free</Link>
              </span>
            </div>
          ) : mode === "signup" ? (
            <>
              <p className="quiet">
                By creating an account, you accept our{" "}
                <Link href="/terms">terms</Link> and{" "}
                <Link href="/privacy">privacy policy</Link>.
              </p>
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-link">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <Link href="/login" className="text-link">
              Return to sign in
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
