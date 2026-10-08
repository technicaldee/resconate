# Verification — 8 October 2026

## Passed

- `npm run check`: 17 Node tests pass against a real, dedicated PostgreSQL test database; the Next.js 16.4.0 production build succeeds without warnings.
- `npm run start`: both the Express API and the standalone production frontend run locally. `/api/health` returns `{"status":"ok"}` through the frontend proxy.
- Browser acceptance against the production server: 39 responsive/asset checks, at 375, 390, 768 and 1440px, plus complete signup → worker → advance → pay draft → approval → cash payment → persisted paid state → CSV export → support → vacancy → logout/session guard flows. Dark active-tab colours are asserted for both Today and Settings.
- Database tests cover tenant isolation, owner/supervisor permissions, CSRF rejection, decimal units, stale snapshots, locked approved records, overlapping periods, concurrent cash recording, overpayment rejection, voiding, exports/PDF, subscription limits, reset-token reuse/session invalidation, signed/idempotent billing and transfer webhooks, reversal handling, and explicit WhatsApp confirmation/deduplication.
- Registry advisory check of all 164 locked dependency names: no current advisory results after updating Nodemailer to 10.0.16. This is a point-in-time dependency check, not an application penetration test.
- `git diff --check`: clean.
- App-designer: three rendered directions, four rounds with one independent critic. Final 12 primary scores: eleven 4s and one 3 (feature/editorial distinction); fidelity 4. Done by the skill's stated stop rule. Original logo, workforce/pay, optional team tools, services, help/contact and plans are retained.
- Final 3× DOM scans at 375×667 and 390×844: no FAILs. Reports live under `design/resconate/scans/r4-*`. Core screenshots and before/after live under `design/resconate/shots/r4`; the gallery is `design/resconate/mockup.html`.

## Scan warning responses

- **iOS safe-area warnings:** these are responsive websites, with no simulated iOS status bar. The web header is intentionally at the top; the phone browser manages device system chrome. Actual navigation is outside the bounded content scroll area.
- **Type-scale warnings:** the scan combines brand lettering, display headings, money, metadata, body and responsive variants. A few nearby sizes are intentionally retained for the brand and receipt/table hierarchy. All visible UI text is at least 11px, and the critic judged hierarchy/typography 4/5. This does not claim a seven-size native-iOS scale.
- **Left-edge warnings:** the outer 6% mobile margin is shared by primary content. Receipt inset, modal inset, table columns and supporting illustrated captions intentionally add local alignment edges; there are no offscreen-text or collision failures.
- **Em-dash warning:** it denotes an empty optional note in the review details, not marketing prose.
- **Inline terms-link target warning:** the policy links remain within consent text and support keyboard navigation. Primary buttons, mobile navigation, account and table controls have at least 44px targets. Inline policy text was retained rather than turning it into another button row.

A final parent-overflow correction made the exported DOM scanner understand the fixed navigation correctly. It was verified pixel-identical in light demo, dark demo and dark settings at 375px. The snapshot wrapper preserves the real viewport height and content scroll position. The scanner's rules are unchanged; only its browser viewport is adapted from an iPhone mockup sheet to this website.

## Not verified locally

- Live Paystack checkout, recipient resolution, funding/transfer permission and provider OTP requirements. Tests exercise signed callback and reconciliation record rules without sending real money.
- A real subscribed Meta WhatsApp account or real SMTP delivery. No external customer messages were sent.
- Deployment HTTPS, shared edge rate limiting, operational monitoring, restore-tested backups, provider account activation and operator review of legal/privacy/retention policies.
- Docker image execution: the installed Docker client cannot access the machine's Docker socket. Docker/Compose definitions are included, but containers were not launched here.
- Native iPhone feel, Apple fonts or real-device motion. The self-authored brief applies the requested iPhone design skill to responsive web; Hanken Grotesk is locally hosted, and the receipt transition honours reduced motion.

Voice notes, statutory tax/pension deductions, automatic recurring debits and a public specialist marketplace are outside the implemented workflow. The live product copy states those limits. Credentials enable the implemented integrations; they do not certify the operational conditions above.
