# SearchandService Agency — Cloudflare Pages + Pages Functions + D1

Production-ready full-stack repository for **SearchandService**, engineered for automatic deployment to **https://searchandservice.pages.dev** via GitHub push using **Cloudflare Pages**, **Pages Functions** (`/functions/api/*`), and **Cloudflare D1** (free-tier SQL database).

---

## Architecture Overview

- **Frontend (`src/App.jsx`, Vite + React + Tailwind CSS)**: Preserves 100% of the SearchandService design, Day/Night themes, interactive 5-Pillar ROI & Growth calculator, portfolio filters, and modals.
- **Backend API (`functions/api/*`)**: Native Cloudflare Pages Functions that run on the exact same `searchandservice.pages.dev` origin:
  - `GET /api/health`: Health and binding status check.
  - `POST /api/audit`: Validates, rate-limits, spam-checks, and stores Free Local Growth Audit leads in Cloudflare D1 (`audit_leads` table), with optional Resend email alerts and webhook notifications.
  - `POST /api/newsletter`: Validates, rate-limits, and stores newsletter subscribers in Cloudflare D1 (`newsletter_subscribers` table).
- **Zero Fake Submissions**: If neither D1 (`DB`), `RESEND_API_KEY`, nor `NOTIFICATION_WEBHOOK_URL` is bound, the API returns `503 Service Unavailable` with a clear configuration message rather than faking success.

---

## 1. Local Setup & Testing

```bash
# 1. Install dependencies
npm install

# 2. Copy local environment variables template
cp .env.example .dev.vars

# 3. Create & migrate local D1 SQLite database
npm run db:migrate:local

# 4. Run unit & API validation tests (Vitest)
npm test

# 5. Start full-stack local Cloudflare Pages + Functions server (http://localhost:8788)
npm run pages:dev
```

---

## 2. Create Your Free Cloudflare D1 Database

1. Log in to Cloudflare via Wrangler:
   ```bash
   npx wrangler login
   ```
2. Create the D1 database:
   ```bash
   npx wrangler d1 create searchandservice-db
   ```
3. Copy the `database_id` UUID printed in your terminal and replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` inside `wrangler.toml`.
4. Apply the SQL schema (`migrations/0001_init.sql`) to your remote production D1 database:
   ```bash
   npm run db:migrate:prod
   ```

---

## 3. Connect GitHub to Cloudflare Pages (https://searchandservice.pages.dev)

1. Push this repository to your GitHub account (`main` branch).
2. Open the **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your GitHub repository.
4. Configure the build settings:
   - **Project name**: `searchandservice` *(this reserves https://searchandservice.pages.dev)*
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

---

## 4. Bind D1 & Optional Email/Webhook Secrets in Cloudflare Pages

After your initial Pages project is created:

1. Go to **Workers & Pages** -> **searchandservice** -> **Settings** -> **Bindings** (or **Functions** -> **D1 database bindings**):
   - Click **Add** -> **D1 database**
   - **Variable name**: `DB`
   - **D1 database**: `searchandservice-db`
   - Save for both **Production** and **Preview**.
2. *(Optional)* Under **Settings** -> **Environment variables**, add any of the following encrypted secrets if you want instant email or Slack/Discord/Zapier notifications:
   - `RESEND_API_KEY`: Your free Resend.com API key (3,000 free emails/month).
   - `NOTIFICATION_TO_EMAIL`: `searchandservicegrowth@gmail.com`
   - `NOTIFICATION_WEBHOOK_URL`: Slack, Discord, or Zapier incoming webhook URL.
   - `TURNSTILE_SECRET_KEY`: Optional Cloudflare Turnstile secret key.
3. Push any commit to `main` (or click **Retry deployment** in Cloudflare Pages) so the bindings take effect immediately on `https://searchandservice.pages.dev`.