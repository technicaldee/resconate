# Deployment and provider setup

## Containers

`docker compose up --build` starts PostgreSQL, the API and the production Next server. Supply a `.env` with a unique database password, correct public HTTPS `APP_URL`, email settings and provider keys. Compose uses `DATABASE_URL` exactly as configured: for its PostgreSQL service use `postgresql://resconate:<password>@db:5432/resconate` and set `POSTGRES_PASSWORD` to the same password. Do not use the local helper password in production.

Put the frontend behind your HTTPS reverse proxy. API ports are private to the container network; Next proxies `/api`. Set the API's `API_HOST=0.0.0.0` in containers. Build environment `API_INTERNAL_URL=http://api:3001` sets the server-side proxy destination; it is not a browser credential. For standalone Next hosting, preserve `.next/standalone`, `.next/static` and `public` as configured by the Dockerfile. `APP_URL` must match the browser origin exactly, including the HTTPS scheme. The HttpOnly session cookie is Secure in production. Set `TRUST_PROXY_HOPS` only for trusted proxies.

Migrations run at API startup under a PostgreSQL advisory lock. Do not run the seed in production. Create the first real account through `/signup`.

## Paystack

1. Use test keys first. Set `PAYSTACK_SECRET_KEY` on the API.
2. Configure `https://<your-domain>/api/webhooks/paystack` as the webhook URL.
3. Verify an exact-amount NGN checkout, replayed webhook, failed checkout, and return-page verification. A verified payment extends access once.
4. Activate the business account and bank-transfer capability, and fund its transfer balance. Validate recipient resolution, successful transfer, failure, pending/timeout and reversal in the provider sandbox.
5. If the account requires transfer OTP, resolve that requirement with Paystack before enabling live transfers; this interface does not complete provider OTP challenges. Pending statuses must be monitored in the provider account.
6. After provider acceptance, use live keys. Never put the secret key in client code. Transfer fees are separate.

## WhatsApp

Configure the Meta Cloud API app, subscribed phone ID, permanent access token and signing secret. Subscribe the app to messages using `https://<your-domain>/api/webhooks/whatsapp`, with your `WHATSAPP_VERIFY_TOKEN`. Test the challenge, signed message delivery, linking, name ambiguity, expired confirmation and duplicate delivery.

`WHATSAPP_API_VERSION` selects the approved Graph API version for your app. Verify its support window with Meta before launch. Responses are user-initiated text replies; this app does not send outside-window marketing templates. Set `WHATSAPP_DISPLAY_NUMBER` so owners know which number to message.

## Email and queue

Use a verified sending domain and working SMTP account. Configure SPF/DKIM/DMARC with your email provider. Test real password-reset and supervisor-invitation delivery, including expired tokens. Set a monitored `SUPPORT_EMAIL`. Assign an operator to saved support requests; the owner-facing UI is not an internal support administration tool.

The persistent API processes queued messages every 30 seconds, with six attempts and increasing retry delays. Multiple processes use `FOR UPDATE SKIP LOCKED`. Monitor failed outbox jobs. For environments without a persistent worker, schedule `POST /api/jobs/process` with `Authorization: Bearer <CRON_SECRET>`. Do not expose the secret in browser code.

## Operations and launch checks

- Provision PostgreSQL with private access, a least-privilege application user and verified TLS where required. `DATABASE_SSL=true` verifies the certificate; use a trusted system CA rather than disabling verification.
- Configure automated encrypted backups, test restoration, capacity and application/database monitoring. Test `/api/health` through the deployed frontend.
- Keep frontend/API together at one browser origin. Multi-instance rate limiting needs a shared edge limiter; the built-in limiter is process-local.
- Confirm the operator's legal identity, data-processing terms, applicable retention, privacy notice, refunds and support contact. The included terms are concise product policies requiring operator review; they are not a legal opinion.
- Run automated tests/build, then repeat provider acceptance against staging. Check small-screen navigation, exports, concurrent approvals and payment status reconciliation.
- Set log retention, an incident owner and a process to correct approved records. Do not claim statutory payroll compliance.

Credentials are the remaining inputs for online integrations locally. Deployment and external account approvals remain real launch prerequisites and cannot be validated by source code alone.
