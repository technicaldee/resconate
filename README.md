# Resconate

A responsive workforce and pay record workspace for small Nigerian businesses. The new app is a Next.js frontend, Express API and PostgreSQL database. It implements the small-business plan: worker agreements, work days/units, advances, bonuses, owner-approved pay periods, separately recorded cash/bank payments, provider-confirmed transfers, WhatsApp text confirmation and support requests.

## Run locally

Requirements: Node.js 24 LTS, npm, PostgreSQL 18 (or Docker). From this directory:

```sh
npm ci
cp .env.example .env
bash tools/local-db.sh
npm run db:migrate
# Optional: set SEED_PASSWORD in .env before this step.
npm run db:seed
npm run dev
```

Open http://localhost:3000. The API listens on 127.0.0.1:3001; Next routes `/api/*` to it. A standalone sample workspace is at `/demo` and requires no account. The local PostgreSQL helper uses port 55439, creates the application and dedicated test databases, and stores its files under ignored `.local/`. Set `PG_BIN` for a different installation. The helper's password is for local development only.

```sh
npm test                 # domain + database-backed API integration suite
npm run build            # Next production build
npm run start            # production mode, requires DATABASE_URL and APP_URL
npm run test:e2e          # running local app, Chrome installed
```

## Environment

Every supported variable is listed and explained in [.env.example](.env.example). Server secrets never use `NEXT_PUBLIC_*`.

- Core: `APP_URL`, `DATABASE_URL`, `DATABASE_SSL`, `PORT`, `WEB_HOST`, `API_PORT`, `API_HOST`, `API_INTERNAL_URL`, `TRUST_PROXY_HOPS`.
- Tests and local seed: `TEST_DATABASE_URL`, `SEED_EMAIL`, `SEED_PASSWORD`.
- Paystack: `PAYSTACK_SECRET_KEY`. Subscription checkout uses server-defined NGN prices; one confirmed payment buys one month. Automatic recurring debits are not enabled.
- WhatsApp: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_DISPLAY_NUMBER`, `WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_API_VERSION`.
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, `SUPPORT_EMAIL`.
- Scheduled jobs: `CRON_SECRET` for external scheduler requests. A persistent API server also processes delivery and reconciliation every 30 seconds.

Missing integrations are shown as unavailable. Worker records, cash records, calculations, exports and saved support requests remain usable without provider credentials. A support request is saved in the database even when notification email is unavailable.

## Payment and record rules

Amounts are integer kobo. Daily/per-job pay is the agreed rate multiplied by recorded units; weekly/monthly pay uses the full agreed rate, without proration. Bonuses add to gross, advances subtract. An advance greater than earnings blocks approval so it cannot silently disappear. Statutory tax/pension deductions are outside this calculator.

Drafts store a snapshot. Approval rechecks that snapshot and serializes against record edits. Approved date ranges cannot overlap. Included records are locked; later work/advance/bonus records cannot be backdated into approved periods. Unapproved records can be voided with a reason. Payment records remain reversible unless confirmed by the provider. Standalone payment records are distinct from payments applied to an approved run.

Transfers have unique references and an active-transfer constraint. A timeout stays pending for reconciliation; it is never treated as failure or automatically sent again. Paystack webhooks use raw-body HMAC verification and deduplication. Only verified success creates a provider payment record. Configure transfer permissions and funding on your Paystack account; do not retry an uncertain transfer manually without checking its provider status.

WhatsApp supports text commands, linking codes and explicit record confirmation. Voice notes are not transcribed. Codes expire; duplicate webhook messages cannot create duplicate records. Worker-name ambiguity is rejected. WhatsApp cash commands record reported payment only; they never initiate a transfer.

## Production deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Docker, webhooks, TLS, backups and provider acceptance tests. The source is production-buildable, but credentials alone cannot prove a launch is ready. Hosting, provider account activation, webhook subscription, support ownership, legal review and backup restoration must be verified in the actual deployment. No live money transfers or external messages were sent during local verification.

Legacy React/Next pages and previous backend routes remain in source for reference. Only `.screen.js` pages and `backend/src/app.js` are served by the new app. Previous HR and marketplace URLs redirect to current workspace/services pages. Legacy fake testimonials, example marketplaces and mock logins are not served.

Previously tracked dependency directories are removed: install from the workspace lockfile instead of vendoring generated `node_modules`. Legacy checked-in backend/frontend `.env` files have been moved to ignored `.local/legacy-env/` locally. The running application uses the single untracked root `.env`; supply fresh deployment credentials rather than using historical repository credentials.
