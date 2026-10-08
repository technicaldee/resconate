import Link from "next/link";
import { useState } from "react";
import { PublicLayout, Field, Notice, Icon, api } from "./ui";
export function Pricing() {
  return (
    <PublicLayout title="Simple plans for your team">
      <section className="page-intro">
        <p className="eyebrow">PRICING</p>
        <h1>
          Start small.
          <br />
          Grow at your pace.
        </h1>
        <p>
          Try up to 15 workers for 14 days. After that, keep 2 workers free or
          choose a monthly plan. Paid plans renew when you make your next
          payment.
        </p>
      </section>
      <section className="pricing-grid">
        {[
          [
            "Basic",
            "₦0",
            "2 workers",
            "Keep worker records, advances, pay runs and exports.",
            "basic",
          ],
          [
            "Small Team",
            "₦3,500",
            "5 workers",
            "The same clear workflow, with room for your regular team.",
            "small",
          ],
          [
            "Growing Team",
            "₦7,500",
            "15 workers",
            "More workers, the same simple way to keep the books.",
            "growth",
          ],
          [
            "Assisted",
            "₦25,000",
            "15 workers + setup help",
            "One guided setup session and one monthly review. Arrange a time with support.",
            "assisted",
          ],
        ].map(([n, p, l, d, key]) => (
          <article
            className={"price-plan " + (key === "small" ? "recommended" : "")}
            key={key}
          >
            {key === "small" && (
              <span className="plan-tag">FOR A SMALL TEAM</span>
            )}
            <h2>{n}</h2>
            <p className="price">
              {p}
              <small>{key === "basic" ? " / free" : " / month"}</small>
            </p>
            <strong>{l}</strong>
            <p>{d}</p>
            <Link
              className={"button " + (key === "small" ? "" : "secondary")}
              href="/signup"
            >
              Start free <Icon name="arrow" size={16} />
            </Link>
          </article>
        ))}
      </section>
      <section className="section narrow">
        <h2>What stays the same</h2>
        <p>
          All plans include work and pay records, CSV exports, pay statements
          and access to support. WhatsApp and bank transfers become available
          when the services are connected. Bank transfer fees are separate.
        </p>
        <details>
          <summary>Do you calculate tax or pension?</summary>
          <p>
            No. Pay runs calculate agreed wages, recorded bonuses and advances.
            Ask a qualified adviser about statutory deductions and your business
            obligations.
          </p>
        </details>
        <details>
          <summary>Can I still record cash payments?</summary>
          <p>
            Yes. Cash is recorded as reported by your business. Only
            provider-confirmed transfers are marked as confirmed by the payment
            provider.
          </p>
        </details>
        <details>
          <summary>What happens when a plan expires?</summary>
          <p>
            Your records remain available. You can add active workers up to your
            plan’s limit; archive workers you no longer employ or renew to add
            more.
          </p>
        </details>
      </section>
    </PublicLayout>
  );
}
export function How() {
  return (
    <PublicLayout title="How Resconate works">
      <section className="page-intro">
        <p className="eyebrow">FROM THE FIRST WORKER TO PAY DAY</p>
        <h1>
          Three habits.
          <br />
          Clearer books.
        </h1>
        <p>
          You do not need an HR department. You need a record you can check.
        </p>
      </section>
      <section className="how-list">
        {[
          [
            "workers",
            "01",
            "Add the people you pay",
            "Enter a name, job and agreed rate. Choose monthly, weekly, daily or per job. The agreement is visible whenever you prepare pay.",
          ],
          [
            "chat",
            "02",
            "Record the working day",
            "Add work days or units for daily and per-job workers. Record advances and bonuses when they happen. WhatsApp text records ask for confirmation before saving.",
          ],
          [
            "records",
            "03",
            "Review, approve, record payment",
            "Choose a period and review each calculation. Weekly and monthly rates use the full agreed rate; there is no automatic proration. Approve the run, then record cash, a bank payment you made, or request a provider transfer.",
          ],
        ].map(([art, no, title, text]) => (
          <article key={no}>
            <img src={`/illustrations/${art}.svg`} alt="" />
            <div>
              <span className="eyebrow">{no}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </article>
        ))}
        <Link className="button" href="/signup">
          Create your workspace <Icon name="arrow" />
        </Link>
      </section>
    </PublicLayout>
  );
}
export function Services() {
  return (
    <PublicLayout title="Practical help for your business">
      <section className="page-intro">
        <p className="eyebrow">SERVICES</p>
        <h1>
          A hand when
          <br />
          you need one.
        </h1>
        <p>
          Get your records set up or request a separate project. Scope, cost and
          timing are agreed before work begins.
        </p>
      </section>
      <section className="service-list">
        {[
          [
            "Workforce setup",
            "Bring your worker list and pay arrangements. We help you create your workspace and prepare your first pay run.",
            "setup",
          ],
          [
            "Business websites & design",
            "A website, shop page or brand project for your business. Send the brief and receive a scoped quote.",
            "studio",
          ],
          [
            "Find a specialist",
            "Tell us what help you need. We will respond about availability and scope; submitting a request does not guarantee a match.",
            "specialist",
          ],
        ].map(([n, t, c]) => (
          <article key={c}>
            <h2>{n}</h2>
            <p>{t}</p>
            <Link
              href={"/contact?category=" + (c === "setup" ? "demo" : c)}
              className="text-link"
            >
              Request help <Icon name="arrow" size={18} />
            </Link>
          </article>
        ))}
      </section>
    </PublicLayout>
  );
}
export function About() {
  return (
    <PublicLayout title="About Resconate">
      <section className="page-intro">
        <p className="eyebrow">ABOUT RESCONATE</p>
        <h1>
          For the owner
          <br />
          doing it all.
        </h1>
        <p>
          A small business can have a busy team without having an HR department.
        </p>
      </section>
      <section className="about-story">
        <img src="/illustrations/shop.svg" alt="Neighbourhood shop" />
        <div>
          <h2>
            Records that fit
            <br />
            the working day.
          </h2>
          <p>
            Resconate brings worker agreements, work days, advances and pay into
            one workspace. The aim is practical: fewer details lost between a
            notebook, a message and pay day.
          </p>
          <p>
            We start with small teams in Nigeria. The owner stays in control of
            approvals and payments. Human help is available when setting up
            takes more time than you have.
          </p>
          <Link href="/contact" className="text-link">
            Talk to us <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
export function Help() {
  return (
    <PublicLayout title="Help with your records">
      <section className="page-intro">
        <p className="eyebrow">HELP</p>
        <h1>
          Make the next
          <br />
          step clear.
        </h1>
        <p>Short answers for the records you keep every day.</p>
      </section>
      <section className="narrow section">
        {[
          [
            "How do I add daily workers?",
            "Choose daily pay when adding the worker, enter the rate for one day and record their work days. Pay is rate × recorded days, plus bonuses, minus advances.",
          ],
          [
            "What is a pay run?",
            "A reviewed snapshot of pay for a date range. Approving it locks the included work, advance and bonus records. Overlapping approved periods are blocked.",
          ],
          [
            "How do I correct a mistake?",
            "Void an unapproved record with a reason, then add the corrected record. Approved records remain in the history. Ask support before correcting an approved pay period.",
          ],
          [
            "What can I send through WhatsApp?",
            "After linking in Settings, send ADVANCE 5000 for Blessing, BONUS 2000 for Blessing, WORK 1 for Victor or SUMMARY. Use full names if first names are shared. Confirm the returned code to save. Voice notes are not processed.",
          ],
          [
            "Does recording payment send money?",
            "Recording cash or a bank payment only logs a payment you already made. Sending a provider transfer is a separate action with an explicit confirmation. Pending transfers stay pending until verified.",
          ],
          [
            "How do I download my records?",
            "Open Records for CSV export or open a pay run for its PDF statement. Keep a copy alongside your own business records.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
        <Link href="/contact?category=support" className="button">
          Contact support <Icon name="arrow" />
        </Link>
      </section>
    </PublicLayout>
  );
}
export function Contact() {
  const [error, E] = useState(""),
    [done, D] = useState(false),
    [busy, B] = useState(false);
  async function submit(e) {
    e.preventDefault();
    E("");
    B(true);
    const d = Object.fromEntries(new FormData(e.target));
    try {
      await api("/contact", { method: "POST", body: d });
      D(true);
    } catch (x) {
      E(x.message);
    } finally {
      B(false);
    }
  }
  return (
    <PublicLayout title="Contact Resconate">
      <section className="contact-page">
        <div>
          <p className="eyebrow">LET’S GET THE DETAILS</p>
          <h1>
            What do you
            <br />
            need a hand with?
          </h1>
          <p>Tell us about your business and what you want to do next.</p>
          <img src="/illustrations/chat.svg" alt="" />
        </div>
        <div className="form-surface">
          {done ? (
            <>
              <Icon name="check" size={36} />
              <h2>Request saved.</h2>
              <p>
                We will contact you using the details you provided. You can
                continue setting up your workspace.
              </p>
              <Link href="/signup" className="button">
                Start free
              </Link>
            </>
          ) : (
            <form onSubmit={submit}>
              <Field label="Your name">
                <input name="name" required autoComplete="name" />
              </Field>
              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone / WhatsApp">
                <input name="phone" type="tel" autoComplete="tel" />
              </Field>
              <Field label="I need help with">
                <select
                  name="category"
                  defaultValue={
                    typeof window !== "undefined"
                      ? new URLSearchParams(window.location.search).get(
                          "category",
                        ) || "demo"
                      : "demo"
                  }
                >
                  <option value="demo">Getting started</option>
                  <option value="support">My workspace</option>
                  <option value="studio">Website or design</option>
                  <option value="specialist">A specialist</option>
                </select>
              </Field>
              <Field label="A few details">
                <textarea
                  name="message"
                  minLength={10}
                  maxLength={3000}
                  required
                  rows={4}
                />
              </Field>
              <Notice>{error}</Notice>
              <button className="button" disabled={busy}>
                {busy ? "Saving…" : "Send request"} <Icon name="arrow" />
              </button>
              <p className="quiet">
                Your details are used to respond to this request.
              </p>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
export function Legal({ type }) {
  const privacy = type === "privacy";
  return (
    <PublicLayout title={privacy ? "Privacy" : "Terms of use"}>
      <section className="narrow section legal">
        <p className="eyebrow">{privacy ? "PRIVACY" : "TERMS OF USE"}</p>
        <h1>{privacy ? "Your business records." : "Using Resconate."}</h1>
        <p>Effective 8 October 2026.</p>
        {privacy ? (
          <>
            <h2>What we store</h2>
            <p>
              Account details, worker names and pay arrangements, work and
              financial records, support messages and account activity. Bank
              details are stored when you request a transfer recipient.
              Passwords are stored as salted hashes. Session cookies keep you
              signed in.
            </p>
            <h2>Why we use it</h2>
            <p>
              To run your workspace, calculate agreed pay, respond to support,
              deliver account messages and reconcile payments. WhatsApp messages
              are processed only after you link your number. We do not sell your
              worker records.
            </p>
            <h2>Service providers</h2>
            <p>
              Payment information is shared with Paystack for requested
              payments. Linked WhatsApp messages use Meta’s Cloud API. Email is
              sent through our configured email provider. Your business decides
              which worker information to enter and must have a lawful reason to
              process it.
            </p>
            <h2>Access and deletion</h2>
            <p>
              Export records in your workspace. Contact support to request
              account access, correction or deletion. Some payment and audit
              records may need to be retained for applicable legal requirements.
              Ask support for the applicable retention and hosting details.
            </p>
          </>
        ) : (
          <>
            <h2>Your records and approvals</h2>
            <p>
              You are responsible for the accuracy of worker information, agreed
              rates, recorded payments and approvals. Resconate calculates from
              those records. It does not calculate tax, pension or other
              statutory deductions, and does not replace professional advice.
            </p>
            <h2>Plans and services</h2>
            <p>
              Basic supports two active workers. Paid access applies for the
              period purchased. Transfer fees are separate. Assisted support
              includes one setup session and one monthly review, arranged with
              support. Separate projects require an agreed scope and quote.
            </p>
            <h2>Payment records</h2>
            <p>
              A cash or bank record is your report of a payment. A provider
              transfer is confirmed only after verification. Check pending
              payments before paying again. Keep independent copies of important
              business records.
            </p>
            <h2>Account use</h2>
            <p>
              Keep your password private. Invite only authorised supervisors. Do
              not upload unlawful information or use the service for fraud.
              Contact support for cancellation, billing questions or complaints.
            </p>
          </>
        )}
        <Link href="/contact?category=support" className="text-link">
          Contact us <Icon name="arrow" />
        </Link>
      </section>
    </PublicLayout>
  );
}
