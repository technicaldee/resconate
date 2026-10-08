import Link from "next/link";
import { PublicLayout, Icon, money } from "../components/ui";
export default function Home() {
  return (
    <PublicLayout>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">FOR THE BUSINESS YOU RUN EVERY DAY</p>
          <h1>
            Your team.
            <br />
            Your pay.
            <br />
            <span>A clear record.</span>
          </h1>
          <p className="hero-intro">
            Keep work days, advances and wages in one place. From your phone or
            through WhatsApp.
          </p>
          <div className="actions">
            <Link className="button" href="/signup">
              Set up your business <Icon name="arrow" />
            </Link>
            <Link className="text-link" href="/demo">
              Try a sample workspace <Icon name="arrow" size={16} />
            </Link>
          </div>
          <p className="quiet">Free for 2 workers. No card needed.</p>
        </div>
        <div className="hero-scene">
          <div className="scene-caption">
            <span>SMALL BUSINESS. CLEAR BOOKS.</span>
            <span>01 / THE EVERYDAY</span>
          </div>
          <img
            className="shop-art"
            src="/illustrations/shop.svg"
            alt="A small neighbourhood shop with a worker behind the counter"
          />
          <div className="scene-receipt">
            <span className="receipt-label">
              PAY DAY, WITHOUT THE GUESSWORK
            </span>
            <div className="receipt-line">
              <span>Blessing · Cook</span>
              <strong>{money(4250000)}</strong>
            </div>
            <div className="receipt-line subdued">
              <span>Advance already recorded</span>
              <span>{money(500000)}</span>
            </div>
            <div className="receipt-status">
              <Icon name="check" size={16} /> Ready for owner review
            </div>
            <small>Illustrative example</small>
          </div>
        </div>
      </section>
      <section className="audience-strip">
        <span>Built around your working day</span>
        <p>
          Food shops <i /> Salons <i /> Retail stores <i /> Small service teams
        </p>
      </section>
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">LESS TO REMEMBER</p>
          <h2>
            Keep the details.
            <br />
            Lose the loose paper.
          </h2>
          <p>
            Start with the records you already keep. A worker’s name, agreed pay
            and what happened today.
          </p>
        </div>
        <div className="feature-grid">
          {[
            [
              "workers",
              "Know who works with you",
              "Monthly wages, daily rates or pay per job. Keep each agreement beside the worker’s name.",
            ],
            [
              "records",
              "Record it while it’s fresh",
              "Save work days, an advance or a bonus. Review the details before they become part of the record.",
            ],
            [
              "chat",
              "Prepare pay with confidence",
              "See the calculation, approve the period, then record payment. Cash and confirmed transfers stay distinct.",
            ],
          ].map(([art, title, desc], i) => (
            <article key={art}>
              <img src={`/illustrations/${art}.svg`} alt="" />
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="whatsapp-section">
        <div>
          <p className="eyebrow">ONE LESS APP TO OPEN</p>
          <h2>
            A quick message.
            <br />A proper record.
          </h2>
          <p>
            Connect your WhatsApp number, send a short text and confirm the
            details. Your workspace keeps the history.
          </p>
          <Link href="/how-it-works" className="text-link">
            See how it works <Icon name="arrow" />
          </Link>
        </div>
        <div
          className="chat-example"
          aria-label="Example WhatsApp conversation"
        >
          <span className="eyebrow">EXAMPLE CONVERSATION</span>
          <div className="bubble sent">ADVANCE 5000 for Blessing</div>
          <div className="bubble received">
            Review: ₦5,000 advance for Blessing. Reply with the confirmation
            code to save.
          </div>
          <div className="bubble sent">CONFIRM [code]</div>
          <div className="chat-confirm">
            <Icon name="check" size={18} /> Recorded. Ready for pay day.
          </div>
          <small>Text messages supported. Records require confirmation.</small>
        </div>
      </section>
      <section className="closing">
        <p className="eyebrow">START WITH YOUR NEXT WORKER</p>
        <h2>
          You run the business.
          <br />
          Keep the records here.
        </h2>
        <Link href="/signup" className="button">
          Start free <Icon name="arrow" />
        </Link>
        <Link href="/contact" className="text-link">
          Prefer help setting up?
        </Link>
      </section>
    </PublicLayout>
  );
}
