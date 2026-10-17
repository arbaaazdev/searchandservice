import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  ArrowUpRight,
  Star,
  Play,
  CheckCircle2,
  MapPin,
  Sparkles,
  Bot,
  BarChart3,
  Globe,
  MessageSquarePlus,
  Workflow,
  ShieldCheck,
  TrendingUp,
  PhoneCall,
  Mail,
  Phone,
  X,
  Download,
  Loader2,
  AlertCircle,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import CaseStudiesPage from './pages/CaseStudiesPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import DisclaimerPage from './pages/DisclaimerPage.jsx';

const PROJECT_BUNDLE_FILES = {
  'package.json': `{
  "name": "searchandservice-pages",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "pages:dev": "npm run build && wrangler pages dev ./dist --d1=DB",
    "db:migrate:local": "wrangler d1 execute searchandservice-db --local --file=./migrations/0001_init.sql",
    "db:migrate:prod": "wrangler d1 execute searchandservice-db --remote --file=./migrations/0001_init.sql",
    "pages:deploy": "npm run build && wrangler pages deploy ./dist --project-name=searchandservice",
    "test": "vitest run"
  },
  "dependencies": {
    "lucide-react": "^0.454.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "vitest": "^2.1.4",
    "wrangler": "^3.86.0"
  }
}`,
  'wrangler.toml': `name = "searchandservice"
pages_build_output_dir = "./dist"
compatibility_date = "2025-02-01"

# Cloudflare D1 Free-Tier SQLite Database Binding
# Run: npx wrangler d1 create searchandservice-db
# Then replace database_id below with your generated UUID
[[d1_databases]]
binding = "DB"
database_name = "searchandservice-db"
database_id = "REPLACE_WITH_YOUR_D1_DATABASE_ID"

[vars]
ENVIRONMENT = "production"
ALLOWED_ORIGIN = "https://searchandservice.pages.dev"
NOTIFICATION_TO_EMAIL = "searchandservicegrowth@gmail.com"
`,
  '.env.example': [
    '# Local Development Secrets for Cloudflare Pages Functions',
    '# Copy this file to .dev.vars for local testing with npm run pages:dev',
    '# NEVER commit .dev.vars or real secrets to GitHub!',
    '# For production on https://searchandservice.pages.dev, add these in:',
    '# Cloudflare Dashboard -> Workers & Pages -> searchandservice -> Settings -> Environment variables',
    '',
    'ENVIRONMENT=development',
    'ALLOWED_ORIGIN=http://localhost:8788',
    'NOTIFICATION_TO_EMAIL=searchandservicegrowth@gmail.com',
    '',
    '# Optional: Resend API Key (https://resend.com - free tier 3,000 emails/mo) for instant email alerts & newsletter welcome emails',
    'RESEND_API_KEY=',
    '',
    '# Optional: Outbound Webhook URL (Slack, Discord, Zapier, Make, or n8n) for instant lead notifications',
    'NOTIFICATION_WEBHOOK_URL=',
    '',
    '# Optional: Cloudflare Turnstile Secret Key (free bot protection)',
    'TURNSTILE_SECRET_KEY='
  ].join('\n'),
  '.gitignore': `node_modules/
dist/
.wrangler/
.dev.vars
.env
.env.local
.DS_Store
*.log
`,
  'public/_headers': `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
`,
  'public/robots.txt': `User-agent: *
Allow: /

Sitemap: https://searchandservice.pages.dev/sitemap.xml
`,
  'public/sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://searchandservice.pages.dev/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
  'migrations/0001_init.sql': `-- Cloudflare D1 Schema for SearchandService (https://searchandservice.pages.dev)
CREATE TABLE IF NOT EXISTS audit_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_name TEXT NOT NULL,
  website TEXT NOT NULL,
  city TEXT NOT NULL,
  bottleneck TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  work_email TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_leads_email ON audit_leads(work_email);
CREATE INDEX IF NOT EXISTS idx_audit_leads_created ON audit_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_leads_ip_created ON audit_leads(ip_hash, created_at);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  ip_hash TEXT,
  subscribed_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_ip_subscribed ON newsletter_subscribers(ip_hash, subscribed_at);
`,
  'functions/_utils.js': [
    '/**',
    ' * Shared validation, security headers, rate-limiting, and notification helpers',
    ' * for Cloudflare Pages Functions (/functions/api/*)',
    ' */',
    '',
    'export const SECURITY_HEADERS = {',
    "  'X-Content-Type-Options': 'nosniff',",
    "  'X-Frame-Options': 'DENY',",
    "  'Referrer-Policy': 'strict-origin-when-cross-origin',",
    "  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'",
    '};',
    '',
    'export function resolveCorsOrigin(request, env) {',
    "  const configured = env?.ALLOWED_ORIGIN || 'https://searchandservice.pages.dev';",
    "  const reqOrigin = request.headers.get('Origin') || '';",
    '  if (',
    '    reqOrigin === configured ||',
    "    reqOrigin.endsWith('.searchandservice.pages.dev') ||",
    "    reqOrigin.startsWith('http://localhost:') ||",
    "    reqOrigin.startsWith('http://127.0.0.1:')",
    '  ) {',
    '    return reqOrigin;',
    '  }',
    '  return configured;',
    '}',
    '',
    "export function jsonResponse(body, status = 200, origin = 'https://searchandservice.pages.dev') {",
    '  return new Response(JSON.stringify(body), {',
    '    status,',
    '    headers: {',
    "      'Content-Type': 'application/json;charset=UTF-8',",
    "      'Access-Control-Allow-Origin': origin,",
    "      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',",
    "      'Access-Control-Allow-Headers': 'Content-Type',",
    '      ...SECURITY_HEADERS',
    '    }',
    '  });',
    '}',
    '',
    'export function sanitizeString(value, maxLen = 250) {',
    "  if (typeof value !== 'string') return '';",
    "  return value.trim().replace(/[<>]/g, '').slice(0, maxLen);",
    '}',
    '',
    'export function isValidEmail(email) {',
    '  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) && email.length <= 254;',
    '}',
    '',
    'export function isValidUrl(url) {',
    '  try {',
    '    const parsed = new URL(url);',
    "    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && Boolean(parsed.hostname);",
    '  } catch {',
    '    return false;',
    '  }',
    '}',
    '',
    'export async function hashIp(ip) {',
    "  if (!ip) return 'unknown';",
    "  const data = new TextEncoder().encode(ip + '-searchandservice-pages-salt');",
    "  const digest = await crypto.subtle.digest('SHA-256', data);",
    '  return Array.from(new Uint8Array(digest))',
    '    .slice(0, 8)',
    "    .map((b) => b.toString(16).padStart(2, '0'))",
    "    .join('');",
    '}',
    '',
    'export async function verifyTurnstileToken(token, ip, secretKey) {',
    '  if (!secretKey) return true;',
    '  if (!token) return false;',
    '  try {',
    "    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {",
    "      method: 'POST',",
    "      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },",
    '      body: new URLSearchParams({',
    '        secret: secretKey,',
    '        response: token,',
    "        remoteip: ip || ''",
    '      })',
    '    });',
    '    const outcome = await res.json();',
    '    return Boolean(outcome.success);',
    '  } catch {',
    '    return false;',
    '  }',
    '}',
    '',
    'export async function sendResendEmail(env, { subject, html, replyTo }) {',
    '  if (!env?.RESEND_API_KEY) return false;',
    "  const toEmail = env.NOTIFICATION_TO_EMAIL || 'searchandservicegrowth@gmail.com';",
    "  const res = await fetch('https://api.resend.com/emails', {",
    "    method: 'POST',",
    '    headers: {',
    "      Authorization: 'Bearer ' + env.RESEND_API_KEY,",
    "      'Content-Type': 'application/json'",
    '    },',
    '    body: JSON.stringify({',
    "      from: 'SearchandService Growth Engine <onboarding@resend.dev>',",
    '      to: [toEmail],',
    '      reply_to: replyTo || toEmail,',
    '      subject,',
    '      html',
    '    })',
    '  });',
    '  return res.ok;',
    '}'
  ].join('\n'),
  'functions/api/health.js': `import { jsonResponse, resolveCorsOrigin } from '../_utils.js';

export async function onRequestOptions(context) {
  return jsonResponse({ ok: true }, 204, resolveCorsOrigin(context.request, context.env));
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const origin = resolveCorsOrigin(request, env);
  const hasD1 = Boolean(env?.DB);
  const hasWebhook = Boolean(env?.NOTIFICATION_WEBHOOK_URL);
  const hasResend = Boolean(env?.RESEND_API_KEY);

  return jsonResponse(
    {
      ok: true,
      platform: 'cloudflare-pages-functions',
      domain: 'https://searchandservice.pages.dev',
      storageConfigured: hasD1 || hasWebhook || hasResend,
      bindings: {
        d1Database: hasD1,
        webhook: hasWebhook,
        resendEmail: hasResend
      },
      timestamp: new Date().toISOString()
    },
    200,
    origin
  );
}
`,
  'functions/api/audit.js': [
    'import {',
    '  jsonResponse,',
    '  resolveCorsOrigin,',
    '  sanitizeString,',
    '  isValidEmail,',
    '  isValidUrl,',
    '  hashIp,',
    '  verifyTurnstileToken,',
    '  sendResendEmail',
    "} from '../_utils.js';",
    '',
    'export async function onRequestOptions(context) {',
    '  return jsonResponse({ ok: true }, 204, resolveCorsOrigin(context.request, context.env));',
    '}',
    '',
    'export async function onRequestPost(context) {',
    '  const { request, env, waitUntil } = context;',
    '  const origin = resolveCorsOrigin(request, env);',
    '',
    '  try {',
    '    const payload = await request.json();',
    '',
    '    // 1. Honeypot spam protection',
    '    if (payload.company_fax_hp) {',
    "      return jsonResponse({ ok: true, message: 'Audit request processed.' }, 200, origin);",
    '    }',
    '',
    '    // 2. Sanitize & validate fields',
    '    const businessName = sanitizeString(payload.businessName, 140);',
    '    const website = sanitizeString(payload.website, 250);',
    '    const city = sanitizeString(payload.city, 120);',
    '    const bottleneck =',
    "      sanitizeString(payload.bottleneck, 180) || 'Need More Calls & #1 Google Maps Ranking';",
    '    const name = sanitizeString(payload.name, 120);',
    '    const phone = sanitizeString(payload.phone, 40);',
    '    const workEmail = sanitizeString(payload.workEmail, 254).toLowerCase();',
    '',
    '    if (!businessName || !website || !city || !name || !phone || !workEmail) {',
    '      return jsonResponse(',
    "        { ok: false, error: 'Please complete all required fields.' },",
    '        400,',
    '        origin',
    '      );',
    '    }',
    '',
    '    if (!isValidEmail(workEmail)) {',
    '      return jsonResponse(',
    "        { ok: false, error: 'Please enter a valid work email address.' },",
    '        400,',
    '        origin',
    '      );',
    '    }',
    '',
    '    if (!isValidUrl(website)) {',
    '      return jsonResponse(',
    "        { ok: false, error: 'Please enter a valid website URL starting with https:// or http://.' },",
    '        400,',
    '        origin',
    '      );',
    '    }',
    '',
    "    const clientIp = request.headers.get('CF-Connecting-IP') || '';",
    '',
    '    // 3. Optional Cloudflare Turnstile verification if TURNSTILE_SECRET_KEY is set',
    '    const turnstileOk = await verifyTurnstileToken(',
    '      payload.turnstileToken,',
    '      clientIp,',
    '      env?.TURNSTILE_SECRET_KEY',
    '    );',
    '    if (!turnstileOk) {',
    '      return jsonResponse(',
    "        { ok: false, error: 'Security verification failed. Please refresh and try again.' },",
    '        403,',
    '        origin',
    '      );',
    '    }',
    '',
    '    // 4. Verify at least one real backend persistence or notification binding is active',
    '    const hasD1 = Boolean(env?.DB);',
    '    const hasWebhook = Boolean(env?.NOTIFICATION_WEBHOOK_URL);',
    '    const hasResend = Boolean(env?.RESEND_API_KEY);',
    '',
    '    if (!hasD1 && !hasWebhook && !hasResend) {',
    '      return jsonResponse(',
    '        {',
    '          ok: false,',
    '          error:',
    "            'Backend storage is not yet bound on this Pages deployment. Bind a D1 database (DB) or configure RESEND_API_KEY / NOTIFICATION_WEBHOOK_URL in Cloudflare Pages Settings.'",
    '        },',
    '        503,',
    '        origin',
    '      );',
    '    }',
    '',
    '    const ipHash = await hashIp(clientIp);',
    "    const userAgent = sanitizeString(request.headers.get('User-Agent') || '', 250);",
    '',
    '    // 5. Rate-limit check & insert in Cloudflare D1 if bound',
    '    if (hasD1) {',
    '      const recentCount = await env.DB.prepare(',
    "        \"SELECT COUNT(*) AS cnt FROM audit_leads WHERE ip_hash = ?1 AND created_at >= datetime('now', '-10 minutes')\"",
    '      )',
    '        .bind(ipHash)',
    '        .first();',
    '',
    '      if (recentCount && Number(recentCount.cnt) >= 5) {',
    '        return jsonResponse(',
    "          { ok: false, error: 'Too many requests from your network. Please try again in a few minutes.' },",
    '          429,',
    '          origin',
    '        );',
    '      }',
    '',
    '      await env.DB.prepare(',
    "        'INSERT INTO audit_leads (business_name, website, city, bottleneck, name, phone, work_email, ip_hash, user_agent) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)'",
    '      )',
    '        .bind(businessName, website, city, bottleneck, name, phone, workEmail, ipHash, userAgent)',
    '        .run();',
    '    }',
    '',
    '    // 6. Optional asynchronous webhook dispatch',
    '    if (hasWebhook) {',
    '      const webhookTask = fetch(env.NOTIFICATION_WEBHOOK_URL, {',
    "        method: 'POST',",
    "        headers: { 'Content-Type': 'application/json' },",
    '        body: JSON.stringify({',
    "          type: 'NEW_GROWTH_AUDIT_LEAD',",
    "          source: 'https://searchandservice.pages.dev',",
    '          businessName,',
    '          website,',
    '          city,',
    '          bottleneck,',
    '          name,',
    '          phone,',
    '          workEmail,',
    '          submittedAt: new Date().toISOString()',
    '        })',
    '      }).catch(() => {});',
    "      if (typeof waitUntil === 'function') waitUntil(webhookTask);",
    '      else await webhookTask;',
    '    }',
    '',
    '    // 7. Optional Resend transactional email alert',
    '    if (hasResend) {',
    '      const emailTask = sendResendEmail(env, {',
    "        subject: '[New Growth Audit Lead] ' + businessName + ' (' + city + ')',",
    '        replyTo: workEmail,',
    '        html:',
    "          '<h2>New Local Growth Audit Request</h2>' +",
    "          '<p><strong>Business:</strong> ' + businessName + '</p>' +",
    "          '<p><strong>Website:</strong> <a href=\"' + website + '\">' + website + '</a></p>' +",
    "          '<p><strong>City / Territory:</strong> ' + city + '</p>' +",
    "          '<p><strong>Primary Bottleneck:</strong> ' + bottleneck + '</p>' +",
    "          '<hr />' +",
    "          '<p><strong>Contact Name:</strong> ' + name + '</p>' +",
    "          '<p><strong>Phone:</strong> ' + phone + '</p>' +",
    "      html: '<p>New subscriber joined the SearchandService newsletter on <strong>searchandservice.pages.dev</strong>: <strong>' + email + '</strong></p>'",
    '      }).catch(() => {});',
    "      if (typeof waitUntil === 'function') waitUntil(emailTask);",
    '      else await emailTask;',
    '    }',
    '',
    '    return jsonResponse(',
    '      {',
    '        ok: true,',
    "        message: 'Growth audit diagnostic request saved.',",
    '        lead: { businessName, workEmail }',
    '      },',
    '      201,',
    '      origin',
    '    );',
    '  } catch (err) {',
    '    return jsonResponse(',
    '      {',
    '        ok: false,',
    "        error: 'Unable to process your audit request right now. Please try again.'",
    '      },',
    '      500,',
    '      origin',
    '    );',
    '  }',
    '}'
  ].join('\n'),
  'functions/api/newsletter.js': [
    'import {',
    '  jsonResponse,',
    '  resolveCorsOrigin,',
    '  sanitizeString,',
    '  isValidEmail,',
    '  hashIp,',
    '  sendResendEmail',
    "} from '../_utils.js';",
    '',
    'export async function onRequestOptions(context) {',
    '  return jsonResponse({ ok: true }, 204, resolveCorsOrigin(context.request, context.env));',
    '}',
    '',
    'export async function onRequestPost(context) {',
    '  const { request, env, waitUntil } = context;',
    '  const origin = resolveCorsOrigin(request, env);',
    '',
    '  try {',
    '    const payload = await request.json();',
    '',
    '    // Honeypot check',
    '    if (payload.company_fax_hp) {',
    "      return jsonResponse({ ok: true, message: 'Subscribed.' }, 200, origin);",
    '    }',
    '',
    '    const email = sanitizeString(payload.email, 254).toLowerCase();',
    '    if (!email || !isValidEmail(email)) {',
    '      return jsonResponse(',
    "        { ok: false, error: 'Please provide a valid email address.' },",
    '        400,',
    '        origin',
    '      );',
    '    }',
    '',
    '    const hasD1 = Boolean(env?.DB);',
    '    const hasWebhook = Boolean(env?.NOTIFICATION_WEBHOOK_URL);',
    '    const hasResend = Boolean(env?.RESEND_API_KEY);',
    '',
    '    if (!hasD1 && !hasWebhook && !hasResend) {',
    '      return jsonResponse(',
    '        {',
    '          ok: false,',
    '          error:',
    "            'Newsletter backend storage is not yet bound on this Pages deployment. Bind a D1 database (DB) or configure RESEND_API_KEY / NOTIFICATION_WEBHOOK_URL.'",
    '        },',
    '        503,',
    '        origin',
    '      );',
    '    }',
    '',
    "    const clientIp = request.headers.get('CF-Connecting-IP') || '';",
    '    const ipHash = await hashIp(clientIp);',
    '',
    '    if (hasD1) {',
    '      const recentCount = await env.DB.prepare(',
    "        \"SELECT COUNT(*) AS cnt FROM newsletter_subscribers WHERE ip_hash = ?1 AND subscribed_at >= datetime('now', '-10 minutes')\"",
    '      )',
    '        .bind(ipHash)',
    '        .first();',
    '',
    '      if (recentCount && Number(recentCount.cnt) >= 5) {',
    '        return jsonResponse(',
    "          { ok: false, error: 'Too many subscription attempts. Please try again shortly.' },",
    '          429,',
    '          origin',
    '        );',
    '      }',
    '',
    '      await env.DB.prepare(',
    "        \"INSERT INTO newsletter_subscribers (email, ip_hash) VALUES (?1, ?2) ON CONFLICT(email) DO UPDATE SET subscribed_at = datetime('now')\"",
    '      )',
    '        .bind(email, ipHash)',
    '        .run();',
    '    }',
    '',
    '    if (hasWebhook) {',
    '      const webhookTask = fetch(env.NOTIFICATION_WEBHOOK_URL, {',
    "        method: 'POST',",
    "        headers: { 'Content-Type': 'application/json' },",
    '        body: JSON.stringify({',
    "          type: 'NEW_NEWSLETTER_SUBSCRIBER',",
    "          source: 'https://searchandservice.pages.dev',",
    '          email,',
    '          subscribedAt: new Date().toISOString()',
    '        })',
    '      }).catch(() => {});',
    "      if (typeof waitUntil === 'function') waitUntil(webhookTask);",
    '      else await webhookTask;',
    '    }',
    '',
    '    if (hasResend) {',
    '      const emailTask = sendResendEmail(env, {',
    "        subject: '[Newsletter Subscriber] ' + email,",
    '        replyTo: email,',
    "        html: '<p>New subscriber joined the SearchandService newsletter on <strong>searchandservice.pages.dev</strong>: <strong>' + email + '</strong></p>'",
    '      }).catch(() => {});',
    "      if (typeof waitUntil === 'function') waitUntil(emailTask);",
    '      else await emailTask;',
    '    }',
    '',
    '    return jsonResponse(',
    '      {',
    '        ok: true,',
    "        message: 'Subscribed to SearchandService local growth briefings.'",
    '      },',
    '      201,',
    '      origin',
    '    );',
    '  } catch (err) {',
    '    return jsonResponse(',
    '      {',
    '        ok: false,',
    "        error: 'Could not complete newsletter subscription. Please try again.'",
    '      },',
    '      500,',
    '      origin',
    '    );',
    '  }',
    '}'
  ].join('\n'),
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Search & Service | Local Business Growth Systems Partner</title>
    <meta name="description" content="We help local businesses get more customers, more calls, and more sales through high-converting websites, Google Maps #1 SEO, and 24/7 AI automation workflows." />
    <link rel="canonical" href="https://searchandservice.pages.dev/" />
    <meta property="og:title" content="Search & Service | Local Business Growth Systems Partner" />
    <meta property="og:description" content="Google Maps dominance, high-converting web platforms, and automated speed-to-lead systems for local service businesses." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://searchandservice.pages.dev/" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Search & Service | Local Business Growth Systems Partner" />
    <meta name="twitter:description" content="We help local businesses get more customers, more calls, and more sales." />
    <meta name="theme-color" content="#FF6B1A" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "SearchandService Agency",
        "url": "https://searchandservice.pages.dev",
        "email": "searchandservicegrowth@gmail.com",
        "telephone": "+1-555-234-5678",
        "description": "Local business growth systems partner specializing in Google Maps SEO, high-converting websites, and 24/7 lead automation."
      }
    </script>
  </head>
  <body class="bg-[#F7F6F2] text-[#0A0A0A] antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
  'src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
`,
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '420px'
      }
    }
  },
  plugins: []
};
`,
  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
`,
  '.github/workflows/ci.yml': `name: CI — Build & Verify Pages Functions

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Run Pages Functions API & validation tests
        run: npm test

      - name: Build production frontend bundle (./dist)
        run: npm run build
`,
  'tests/pages-functions.test.js': `import { describe, it, expect } from 'vitest';
import { onRequestGet as healthGet } from '../functions/api/health.js';
import { onRequestPost as auditPost } from '../functions/api/audit.js';
import { onRequestPost as newsletterPost } from '../functions/api/newsletter.js';

function createMockDb() {
  return {
    prepare: () => ({
      bind: () => ({
        first: async () => ({ cnt: 0 }),
        run: async () => ({ success: true })
      })
    })
  };
}

describe('Cloudflare Pages Functions API (https://searchandservice.pages.dev)', () => {
  it('returns 200 OK and binding status from GET /api/health', async () => {
    const req = new Request('https://searchandservice.pages.dev/api/health', { method: 'GET' });
    const res = await healthGet({ request: req, env: { DB: createMockDb() } });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.platform).toBe('cloudflare-pages-functions');
    expect(body.storageConfigured).toBe(true);
  });

  it('rejects incomplete payloads on POST /api/audit with 400', async () => {
    const req = new Request('https://searchandservice.pages.dev/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName: 'Apex HVAC' })
    });
    const res = await auditPost({ request: req, env: { DB: createMockDb() } });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it('returns 503 if no storage/notification binding is configured (never fakes success)', async () => {
    const req = new Request('https://searchandservice.pages.dev/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Apex HVAC & Plumbing',
        website: 'https://apexhvac.com',
        city: 'Austin, TX',
        bottleneck: 'Need More Calls & #1 Google Maps Ranking',
        name: 'Marcus Vance',
        phone: '(512) 555-0199',
        workEmail: 'marcus@apexhvac.com'
      })
    });
    const res = await auditPost({ request: req, env: {} });
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it('persists valid POST /api/audit lead when D1 binding is present', async () => {
    const req = new Request('https://searchandservice.pages.dev/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Apex HVAC & Plumbing',
        website: 'https://apexhvac.com',
        city: 'Austin, TX',
        bottleneck: 'Need More Calls & #1 Google Maps Ranking',
        name: 'Marcus Vance',
        phone: '(512) 555-0199',
        workEmail: 'marcus@apexhvac.com'
      })
    });
    const res = await auditPost({ request: req, env: { DB: createMockDb() } });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it('validates and stores newsletter subscribers on POST /api/newsletter', async () => {
    const badReq = new Request('https://searchandservice.pages.dev/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email' })
    });
    const badRes = await newsletterPost({ request: badReq, env: { DB: createMockDb() } });
    expect(badRes.status).toBe(400);
      const goodReq = new Request('https://searchandservice.pages.dev/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@localbusiness.com' })
    });
    const goodRes = await newsletterPost({ request: goodReq, env: { DB: createMockDb() } });
    expect(goodRes.status).toBe(201);
  });
});
`,
  'README.md': [
    '# SearchandService Agency — Cloudflare Pages + Pages Functions + D1',
    '',
    'Production-ready full-stack repository for **SearchandService**, engineered for automatic deployment to **https://searchandservice.pages.dev** via GitHub push using **Cloudflare Pages**, **Pages Functions** (`/functions/api/*`), and **Cloudflare D1** (free-tier SQL database).',
    '',
    '---',
    '',
    '## Architecture Overview',
    '',
    '- **Frontend (`src/App.jsx`, Vite + React + Tailwind CSS)**: Preserves 100% of the SearchandService design, Day/Night themes, interactive 5-Pillar ROI & Growth calculator, portfolio filters, and modals.',
    '- **Backend API (`functions/api/*`)**: Native Cloudflare Pages Functions that run on the exact same `searchandservice.pages.dev` origin:',
    '  - `GET /api/health`: Health and binding status check.',
    '  - `POST /api/audit`: Validates, rate-limits, spam-checks, and stores Free Local Growth Audit leads in Cloudflare D1 (`audit_leads` table), with optional Resend email alerts and webhook notifications.',
    '  - `POST /api/newsletter`: Validates, rate-limits, and stores newsletter subscribers in Cloudflare D1 (`newsletter_subscribers` table).',
    '- **Zero Fake Submissions**: If neither D1 (`DB`), `RESEND_API_KEY`, nor `NOTIFICATION_WEBHOOK_URL` is bound, the API returns `503 Service Unavailable` with a clear configuration message rather than faking success.',
    '',
    '---',
    '',
    '## 1. Local Setup & Testing',
    '',
    '```bash',
    '# 1. Install dependencies',
    'npm install',
    '',
    '# 2. Copy local environment variables template',
    'cp .env.example .dev.vars',
    '',
    '# 3. Create & migrate local D1 SQLite database',
    'npm run db:migrate:local',
    '',
    '# 4. Run unit & API validation tests (Vitest)',
    'npm test',
    '',
    '# 5. Start full-stack local Cloudflare Pages + Functions server (http://localhost:8788)',
    'npm run pages:dev',
    '```',
    '',
    '---',
    '',
    '## 2. Create Your Free Cloudflare D1 Database',
    '',
    '1. Log in to Cloudflare via Wrangler:',
    '   ```bash',
    '   npx wrangler login',
    '   ```',
    '2. Create the D1 database:',
    '   ```bash',
    '   npx wrangler d1 create searchandservice-db',
    '   ```',
    '3. Copy the `database_id` UUID printed in your terminal and replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` inside `wrangler.toml`.',
    '4. Apply the SQL schema (`migrations/0001_init.sql`) to your remote production D1 database:',
    '   ```bash',
    '   npm run db:migrate:prod',
    '   ```',
    '',
    '---',
    '',
    '## 3. Connect GitHub to Cloudflare Pages (https://searchandservice.pages.dev)',
    '',
    '1. Push this repository to your GitHub account (`main` branch).',
    '2. Open the **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.',
    '3. Select your GitHub repository.',
    '4. Configure the build settings:',
    '   - **Project name**: `searchandservice` *(this reserves https://searchandservice.pages.dev)*',
    '   - **Production branch**: `main`',
    '   - **Framework preset**: `Vite`',
    '   - **Build command**: `npm run build`',
    '   - **Build output directory**: `dist`',
    '5. Click **Save and Deploy**.',
    '',
    '---',
    '',
    '## 4. Bind D1 & Optional Email/Webhook Secrets in Cloudflare Pages',
    '',
    'After your initial Pages project is created:',
    '',
    '1. Go to **Workers & Pages** -> **searchandservice** -> **Settings** -> **Bindings** (or **Functions** -> **D1 database bindings**):',
    '   - Click **Add** -> **D1 database**',
    '   - **Variable name**: `DB`',
    '   - **D1 database**: `searchandservice-db`',
    '   - Save for both **Production** and **Preview**.',
    '2. *(Optional)* Under **Settings** -> **Environment variables**, add any of the following encrypted secrets if you want instant email or Slack/Discord/Zapier notifications:',
    '   - `RESEND_API_KEY`: Your free Resend.com API key (3,000 free emails/month).',
    '   - `NOTIFICATION_TO_EMAIL`: `searchandservicegrowth@gmail.com`',
    '   - `NOTIFICATION_WEBHOOK_URL`: Slack, Discord, or Zapier incoming webhook URL.',
    '   - `TURNSTILE_SECRET_KEY`: Optional Cloudflare Turnstile secret key.',
    '3. Push any commit to `main` (or click **Retry deployment** in Cloudflare Pages) so the bindings take effect immediately on `https://searchandservice.pages.dev`.'
  ].join('\n')
};

function createZipBlob(filesMap) {
  const encoder = new TextEncoder();
  const entries = Object.entries(filesMap).map(([name, content]) => ({
    nameBytes: encoder.encode(name),
    dataBytes: encoder.encode(content)
  }));

  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }

  const crc32 = (bytes) => {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  };

  let localTotalSize = 0;
  let centralTotalSize = 0;

  entries.forEach((e) => {
    e.crc = crc32(e.dataBytes);
    e.offset = localTotalSize;
    localTotalSize += 30 + e.nameBytes.length + e.dataBytes.length;
    centralTotalSize += 46 + e.nameBytes.length;
  });

  const totalSize = localTotalSize + centralTotalSize + 22;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const out = new Uint8Array(buffer);

  let pos = 0;
  entries.forEach((e) => {
    view.setUint32(pos, 0x04034b50, true); // Local file header signature
    view.setUint16(pos + 4, 20, true); // Version needed
    view.setUint16(pos + 6, 0, true); // Flags
    view.setUint16(pos + 8, 0, true); // Compression (0 = store)
    view.setUint16(pos + 10, 0, true); // Mod time
    view.setUint16(pos + 12, 0, true); // Mod date
    view.setUint32(pos + 14, e.crc, true); // CRC-32
    view.setUint32(pos + 18, e.dataBytes.length, true); // Compressed size
    view.setUint32(pos + 22, e.dataBytes.length, true); // Uncompressed size
    view.setUint16(pos + 26, e.nameBytes.length, true); // Filename length
    view.setUint16(pos + 28, 0, true); // Extra field length
    out.set(e.nameBytes, pos + 30);
    out.set(e.dataBytes, pos + 30 + e.nameBytes.length);
    pos += 30 + e.nameBytes.length + e.dataBytes.length;
  });

  const centralDirOffset = pos;
  entries.forEach((e) => {
    view.setUint32(pos, 0x02014b50, true); // Central directory signature
    view.setUint16(pos + 4, 20, true); // Version made by
    view.setUint16(pos + 6, 20, true); // Version needed
    view.setUint16(pos + 8, 0, true); // Flags
    view.setUint16(pos + 10, 0, true); // Compression
    view.setUint16(pos + 12, 0, true); // Mod time
    view.setUint16(pos + 14, 0, true); // Mod date
    view.setUint32(pos + 16, e.crc, true); // CRC-32
    view.setUint32(pos + 20, e.dataBytes.length, true); // Compressed size
    view.setUint32(pos + 24, e.dataBytes.length, true); // Uncompressed size
    view.setUint16(pos + 28, e.nameBytes.length, true); // Filename length
    view.setUint16(pos + 30, 0, true); // Extra field length
    view.setUint16(pos + 32, 0, true); // Comment length
    view.setUint16(pos + 34, 0, true); // Disk number
    view.setUint16(pos + 36, 0, true); // Internal attrs
    view.setUint32(pos + 38, 0, true); // External attrs
    view.setUint32(pos + 42, e.offset, true); // Relative offset
    out.set(e.nameBytes, pos + 46);
    pos += 46 + e.nameBytes.length;
  });

  // End of central directory record
  view.setUint32(pos, 0x06054b50, true);
  view.setUint16(pos + 4, 0, true);
  view.setUint16(pos + 6, 0, true);
  view.setUint16(pos + 8, entries.length, true);
  view.setUint16(pos + 10, entries.length, true);
  view.setUint32(pos + 12, centralTotalSize, true);
  view.setUint32(pos + 16, centralDirOffset, true);
  view.setUint16(pos + 20, 0, true);

  return new Blob([buffer], { type: 'application/zip' });
}

const HERO_GOOGLE_REVIEWS = [
  {
    id: 1,
    name: 'Marcus Vance',
    role: 'Founder & CEO',
    company: 'Vance HVAC & Mechanical',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80',
    rating: 5.0,
    timeAgo: '2 weeks ago',
    review: '“Moved into the Local Map Pack top rankings within 60 days—our inbound service calls increased steadily.”',
    metric: '+25% Inbound Calls'
  },
  {
    id: 2,
    name: 'Dr. Elena Rostova',
    role: 'Clinical Director',
    company: 'Apex Dental Studio',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    rating: 5.0,
    timeAgo: '1 month ago',
    review: '“Their review generation and follow-up system added steady 5-star reviews and improved our patient pipeline.”',
    metric: '+20% Inquiries'
  },
  {
    id: 3,
    name: 'Tariq Mahmood',
    role: 'Managing Partner',
    company: 'PrimeLine Roofing & Exteriors',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    rating: 5.0,
    timeAgo: '3 weeks ago',
    review: '“Clean website architecture and structured lead tracking saves my team valuable administrative hours weekly.”',
    metric: '4+ Hrs/Wk Saved'
  },
  {
    id: 4,
    name: 'Sophia Chen',
    role: 'Owner & Founder',
    company: 'Lumina MedSpa & Wellness',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    rating: 5.0,
    timeAgo: '5 days ago',
    review: '“SearchandService streamlined our booking workflow and enhanced our local visibility across local search.”',
    metric: '+20% Consultations'
  },
  {
    id: 5,
    name: 'David Sterling',
    role: 'Managing Director',
    company: 'Sterling Legal Group',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    rating: 5.0,
    timeAgo: '2 months ago',
    review: '“Our local organic search presence and map visibility brought qualified consultation leads consistently.”',
    metric: '50% More Efficient'
  },
  {
    id: 6,
    name: 'Rachel Kincaid',
    role: 'Owner',
    company: 'Kincaid Auto Collision & Repair',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    rating: 5.0,
    timeAgo: '3 weeks ago',
    review: '“The automated review collection flow is practical and consistent. We gathered dozens of genuine reviews.”',
    metric: '38 Reviews'
  }
];

const SERVICES_DATA = [
  {
    id: 'websites',
    number: '01',
    title: 'High-Converting Websites.',
    shortDesc:
      'Engineered with local conversion psychology, sub-second speed, and clear trust triggers that turn local searchers into booked customers.',
    icon: Globe,
    tag: 'WEB ARCHITECTURE',
    deliverables: [
      'Custom React / Next.js Performance Optimization',
      'Local Trust Triggers & Clear Quote / Booking Funnels',
      'Mobile-Optimized Click-to-Call & Quick Form Bars',
      'Schema.org LocalBusiness Technical SEO Foundation'
    ],
    impact: 'Aligned with U.S. Home-Service & Professional CVR Benchmarks',
    timeline: '14–21 Days Deployment'
  },
  {
    id: 'local-seo',
    number: '02',
    title: 'Google Maps & Local SEO.',
    shortDesc:
      'Target top Local Map Pack positions where over 85% of local service queries convert. We optimize your Google Business Profile and geo-grid authority.',
    icon: MapPin,
    tag: 'GOOGLE MAPS #1',
    deliverables: [
      'Complete Google Business Profile (GBP) Optimization',
      'Geo-Grid Ranking Visibility Strategy & Tracking',
      'Local Citation Cleanup & Neighborhood Landing Pages',
      'Weekly GBP Updates, Posts & FAQ Management'
    ],
    impact: 'Top Map Pack Ranking in 60–90 Days',
    timeline: 'Ongoing Compounding Dominance'
  },
  {
    id: 'ai-automation',
    number: '03',
    title: 'AI Automation Systems.',
    shortDesc:
      'Capture leads outside business hours. Industry surveys report up to 27% missed-call rates for small businesses; our automated text-back workflows respond in under 60 seconds.',
    icon: Bot,
    tag: '24/7 AUTOMATION',
    deliverables: [
      'Missed-Call Instant Text-Back & Quick SMS Flow',
      'Website Conversational Booking Assistant',
      'Automated Lead Qualification & Calendar Routing',
      'Database Reactivation Campaign Setup'
    ],
    impact: 'Zero Missed Leads • Sub-Minute Response',
    timeline: '7–10 Days Integration'
  },
  {
    id: 'workflows',
    number: '04',
    title: 'Business Workflows.',
    shortDesc:
      'Reduce manual data entry and follow-up delays by connecting your forms, communications, and CRM into one structured operational pipeline.',
    icon: Workflow,
    tag: 'OPERATIONAL OPS',
    deliverables: [
      'End-to-End CRM Pipeline & Stage Tracking',
      'Automated Appointment Reminders to Lower No-Shows',
      'Team Notification & Job Status Triggers',
      'Automated Estimate Follow-Up Sequences'
    ],
    impact: '3–5 Operational Hours Saved Weekly',
    timeline: '10 Days Setup'
  },
  {
    id: 'reviews',
    number: '05',
    title: 'Review Generation Systems.',
    shortDesc:
      'Turn completed jobs or patient visits into authentic 5-star Google reviews automatically while routing feedback appropriately to protect brand reputation.',
    icon: MessageSquarePlus,
    tag: 'REPUTATION ENGINE',
    deliverables: [
      'Automated Post-Service SMS Review Requests',
      'Smart Sentiment Filtering & Direct Feedback Routing',
      'Professional Templates for Review Responses',
      'Verified Review Widgets Synced to Your Website'
    ],
    impact: '+12 to +25 New 5-Star Reviews / Quarter',
    timeline: '48 Hours Activation'
  },
  {
    id: 'dashboards',
    number: '06',
    title: 'Custom KPI Dashboards.',
    shortDesc:
      'Clear visibility with no guesswork. Track phone call records, form submissions, and marketing performance in real time through an executive command center.',
    icon: BarChart3,
    tag: 'GROWTH TELEMETRY',
    deliverables: [
      'Unified Executive Command Center',
      'Dynamic Call Tracking & Outcome Tags',
      'Monthly Geo-Grid Google Maps Ranking Reports',
      'Channel Cost-Per-Lead Attribution'
    ],
    impact: '100% Attribution Clarity',
    timeline: 'Included with Every Growth System'
  }
];

const GROWTH_PILLARS = [
  {
    step: '01',
    title: 'GET DISCOVERED',
    subtitle: 'Own Local Search & Google Map Visibility',
    description:
      'With over 85% of local commercial searches displaying the Google Local Map Pack, positioning your business prominently captures high-intent local traffic across your service area.',
    kpis: ['Top Map Pack Targeting', 'Geo-Grid Territory Optimization', 'Optimized Local Citation Footprint']
  },
  {
    step: '02',
    title: 'GENERATE MORE LEADS',
    subtitle: 'Optimized Digital Storefront & Conversion Funnels',
    description:
      'High-performance websites load in under 1 second and align with local home-service conversion benchmarks for optimized local service landing pages.',
    kpis: ['Sub-Second Page Speed', '1-Tap Click-to-Call & Quote Funnels', 'Mobile-First Local UX']
  },
  {
    step: '03',
    title: 'CONVERT MORE CUSTOMERS',
    subtitle: 'Fast Response Times & Review Authority',
    description:
      'Prompt lead engagement dramatically improves close rates. Automated missed-call text-backs engage prospects instantly, backed by verified review authority.',
    kpis: ['Sub-Minute Response Automation', 'Verified Review Trust Signals', 'Streamlined Consultation Booking']
  },
  {
    step: '04',
    title: 'SAVE OPERATIONAL TIME',
    subtitle: 'Automated Workflows & Reminder Systems',
    description:
      'Eliminate administrative friction. Automated appointment reminders and CRM pipelines save your team administrative hours every week.',
    kpis: ['Hours Saved Per Week', 'Reduced Appointment No-Shows', 'Automated Follow-Up Sequences']
  },
  {
    step: '05',
    title: 'INCREASE REVENUE',
    subtitle: 'Accurate Telemetry & Past-Client Reactivation',
    description:
      'Monitor performance in your command dashboard while reactivation campaigns encourage repeat business from your established customer database.',
    kpis: ['Real-Time Call & Lead Attribution', 'Repeat Business Reactivation', 'Data-Backed Growth Forecasting']
  }
];

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Apex Climate & Mechanical',
    category: 'WEB + GOOGLE MAPS OPTIMIZATION',
    filterKey: 'maps',
    metricBadge: '+25% Inbound Calls in 90 Days',
    location: 'Austin, TX',
    summary: 'Website redesign, streamlined service booking funnel, and local SEO optimization across targeted service areas.',
    stats: [
      { label: 'Map Pack Rank', value: 'Positions 8–12 → 3–5' },
      { label: 'Monthly Calls', value: '32 → 40' },
      { label: 'Added Revenue', value: '+$4,000/mo' }
    ]
  },
  {
    id: 2,
    title: 'Lumina Aesthetics & MedSpa',
    category: 'AUTOMATION + REVIEWS',
    filterKey: 'ai',
    metricBadge: '+20% Consultation Inquiries in 90 Days',
    location: 'Scottsdale, AZ',
    summary: 'Automated consultation follow-ups and post-visit review requests to improve booking efficiency and local reputation.',
    stats: [
      { label: '5-Star Reviews', value: '18 → 38' },
      { label: 'Monthly Inquiries', value: '25 → 30' },
      { label: 'No-Show Rate', value: '15% → 11%' }
    ]
  },
  {
    id: 3,
    title: 'Vanguard Injury & Legal Group',
    category: 'HIGH-CONVERTING WEB',
    filterKey: 'web',
    metricBadge: '50% More Efficient Intake Experience',
    location: 'Chicago, IL',
    summary: 'Professional website redesign, faster page loading, and streamlined legal intake forms to reduce friction for prospective clients.',
    stats: [
      { label: 'Conversion Rate', value: '5.2% → 6.4%' },
      { label: 'Page Load Speed', value: '1.8 sec → 1.2 sec' },
      { label: 'Intake Tracking', value: 'Lead sources organized' }
    ]
  },
  {
    id: 4,
    title: 'SearchAndService Command OS',
    category: 'CUSTOM KPI DASHBOARD',
    filterKey: 'dashboard',
    metricBadge: 'Unified Reporting Across 3 Locations',
    location: 'Multi-Location Franchise',
    summary: 'Centralized reporting dashboard combining location performance, incoming calls, and lead-source attribution.',
    stats: [
      { label: 'Locations Synced', value: '3 Branches' },
      { label: 'Admin Time Saved', value: '4 hrs/week' },
      { label: 'Lead Attribution', value: '90% of tracked leads' }
    ]
  }
];

const INDUSTRY_PRESETS = [
  {
    name: 'HVAC / Plumbing / Home Services',
    defaultLeads: 30,
    avgTicket: 750,
    addedLeads: 10,
    totalLeads: 40,
    conversionRate: 0.25,
    monthlyRevenue: 1875
  },
  {
    name: 'Dental / Orthodontics / Medical',
    defaultLeads: 30,
    avgTicket: 750,
    addedLeads: 10,
    totalLeads: 40,
    conversionRate: 0.20,
    monthlyRevenue: 1500
  },
  {
    name: 'MedSpa / Aesthetics / Wellness',
    defaultLeads: 30,
    avgTicket: 450,
    addedLeads: 12,
    totalLeads: 42,
    conversionRate: 0.20,
    monthlyRevenue: 1080
  },
  {
    name: 'Roofing / Solar / Remodeling',
    defaultLeads: 20,
    avgTicket: 8000,
    addedLeads: 5,
    totalLeads: 25,
    conversionRate: 0.10,
    monthlyRevenue: 4000
  },
  {
    name: 'Legal / Accounting / Professional Services',
    defaultLeads: 20,
    avgTicket: 1500,
    addedLeads: 5,
    totalLeads: 25,
    conversionRate: 0.15,
    monthlyRevenue: 1125
  },
  {
    name: 'Auto Detailing / Repair / Collision',
    defaultLeads: 30,
    avgTicket: 650,
    addedLeads: 10,
    totalLeads: 40,
    conversionRate: 0.25,
    monthlyRevenue: 1625
  }
];

function TurnstileWidget({ sitekey, onVerify, isDark, widgetRef }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let interval = null;
    let timeout = null;
    let isCancelled = false;

    function renderTurnstile() {
      if (isCancelled || !containerRef.current) return false;
      if (!window.turnstile || typeof window.turnstile.render !== 'function') return false;
      if (widgetIdRef.current) return true;

      try {
        containerRef.current.innerHTML = '';
        const id = window.turnstile.render(containerRef.current, {
          sitekey,
          theme: isDark ? 'dark' : 'light',
          callback: (token) => {
            if (!isCancelled) {
              onVerify(token);
            }
          },
          'expired-callback': () => {
            if (!isCancelled) {
              onVerify(null);
            }
          },
          'error-callback': () => {
            if (!isCancelled) {
              onVerify(null);
            }
          }
        });
        widgetIdRef.current = id;
        if (widgetRef) {
          widgetRef.current = id;
        }
        setLoaded(true);
        return true;
      } catch (err) {
        console.warn('Turnstile render warning:', err);
        return false;
      }
    }

    if (!renderTurnstile()) {
      interval = setInterval(() => {
        if (renderTurnstile()) {
          clearInterval(interval);
        }
      }, 150);

      timeout = setTimeout(() => {
        if (!widgetIdRef.current && !isCancelled) {
          setLoadFailed(true);
        }
      }, 6000);
    }

    return () => {
      isCancelled = true;
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
      if (widgetIdRef.current && window.turnstile && typeof window.turnstile.remove === 'function') {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (_) {}
        widgetIdRef.current = null;
        if (widgetRef) {
          widgetRef.current = null;
        }
      }
    };
  }, [sitekey, isDark]);

  return (
    <div className="my-2">
      <div
        ref={containerRef}
        className="min-h-[65px] flex items-center justify-start overflow-hidden"
      />
      {!loaded && !loadFailed && (
        <div className="flex items-center gap-2 text-[11px] opacity-60 py-1.5 font-mono">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6B1A]" />
          <span>Loading security check...</span>
        </div>
      )}
      {loadFailed && (
        <div className="text-[11px] text-amber-500 py-1 leading-snug">
          Security check failed to load. If using Brave Shields or an ad-blocker, please allow challenges.cloudflare.com.
        </div>
      )}
    </div>
  );
}

export default function App() {
  const getPageInfoFromHash = () => {
    if (typeof window === 'undefined') return { page: 'home', slug: null };
    const hash = (window.location.hash || '').toLowerCase();
    if (hash.startsWith('#/blog/') || hash.startsWith('#blog/')) {
      const slug = hash.replace(/^#\/?blog\//, '').split('?')[0];
      return { page: 'blog-post', slug };
    }
    if (hash.startsWith('#/blog') || hash.startsWith('#blog')) return { page: 'blog', slug: null };
    if (hash.startsWith('#/case-studies') || hash.startsWith('#case-studies')) return { page: 'case-studies', slug: null };
    if (hash.startsWith('#/privacy') || hash.startsWith('#privacy')) return { page: 'privacy', slug: null };
    if (hash.startsWith('#/terms') || hash.startsWith('#terms')) return { page: 'terms', slug: null };
    if (hash.startsWith('#/disclaimer') || hash.startsWith('#disclaimer')) return { page: 'disclaimer', slug: null };
    return { page: 'home', slug: null };
  };

  const [currentPage, setCurrentPage] = useState(() => getPageInfoFromHash().page);
  const [currentArticleSlug, setCurrentArticleSlug] = useState(() => getPageInfoFromHash().slug);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [auditTurnstileToken, setAuditTurnstileToken] = useState(null);
  const [newsletterTurnstileToken, setNewsletterTurnstileToken] = useState(null);
  const auditWidgetRef = useRef(null);
  const newsletterWidgetRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const info = getPageInfoFromHash();
      setCurrentPage(info.page);
      setCurrentArticleSlug(info.slug);
      if (info.page !== 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);
  const [isTestimonialsPaused, setIsTestimonialsPaused] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const [activePillar, setActivePillar] = useState(0);
  const [portfolioFilter, setPortfolioFilter] = useState('all');

  const [selectedIndustryIdx, setSelectedIndustryIdx] = useState(0);
  const [currentMonthlyLeads, setCurrentMonthlyLeads] = useState(30);
  const [customTicket, setCustomTicket] = useState(750);
  const [customAddedLeads, setCustomAddedLeads] = useState(10);
  const [customConversionRate, setCustomConversionRate] = useState(0.25);

  const [auditForm, setAuditForm] = useState({
    businessName: '',
    website: '',
    city: '',
    bottleneck: 'Need More Calls & #1 Google Maps Ranking',
    customMessage: '',
    name: '',
    phone: '',
    workEmail: '',
    company_fax_hp: ''
  });
  const [auditSubmitting, setAuditSubmitting] = useState(false);
  const [auditError, setAuditError] = useState('');
  const [auditSubmitted, setAuditSubmitted] = useState(false);
  const [auditFieldErrors, setAuditFieldErrors] = useState({});
  const [vibratingFields, setVibratingFields] = useState({});

  const auditFormRef = useRef(null);
  const focusTimeoutRef = useRef(null);
  const businessNameInputRef = useRef(null);
  const websiteInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const workEmailInputRef = useRef(null);
  const customMessageInputRef = useRef(null);

  const auditInputRefs = {
    businessName: businessNameInputRef,
    website: websiteInputRef,
    city: cityInputRef,
    name: nameInputRef,
    phone: phoneInputRef,
    workEmail: workEmailInputRef,
    customMessage: customMessageInputRef
  };

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const [deployKitOpen, setDeployKitOpen] = useState(false);
  const [activeBundleFile, setActiveBundleFile] = useState('README.md');
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAppJsx, setCopiedAppJsx] = useState(false);

  useEffect(() => {
    window.onTurnstileSuccess = (token) => {
      setTurnstileToken(token);
    };
    return () => {
      delete window.onTurnstileSuccess;
    };
  }, []);

  useEffect(() => {
    if (menuOpen || videoModalOpen || selectedService || deployKitOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, videoModalOpen, selectedService, deployKitOpen]);

  useEffect(() => {
    let start = null;
    const duration = 1400;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = Math.round((1 - Math.pow(1 - rawProgress, 3)) * 100);
      setLoadProgress(easedProgress);

      if (rawProgress < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setIsLoaderExiting(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 650);
        }, 180);
      }
    };

    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (isReviewPaused) return;
    const interval = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % HERO_GOOGLE_REVIEWS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isReviewPaused]);

  const handleIndustryChange = (idx) => {
    setSelectedIndustryIdx(idx);
    const preset = INDUSTRY_PRESETS[idx];
    setCurrentMonthlyLeads(preset.defaultLeads);
    setCustomTicket(preset.avgTicket);
    setCustomAddedLeads(preset.addedLeads);
    setCustomConversionRate(preset.conversionRate);
  };

  const totalLeads = currentMonthlyLeads + customAddedLeads;
  const monthlyRevenueLift = customAddedLeads * customConversionRate * customTicket;
  const annualRevenueLift = monthlyRevenueLift * 12;

  const navigateTo = (page, targetSection = null, slug = null) => {
    setMenuOpen(false);
    if (page === 'home') {
      setCurrentPage('home');
      setCurrentArticleSlug(null);
      if (window.location.hash && window.location.hash !== '#/' && !window.location.hash.startsWith('#hero')) {
        window.location.hash = targetSection ? `#${targetSection}` : '#/';
      }
      if (targetSection) {
        setTimeout(() => {
          const el = document.getElementById(targetSection);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (page === 'blog-post' && slug) {
      window.location.hash = `#/blog/${slug}`;
      setCurrentPage('blog-post');
      setCurrentArticleSlug(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = `#/${page}`;
      setCurrentPage(page);
      setCurrentArticleSlug(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    setMenuOpen(false);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      window.location.hash = `#${id}`;
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectServiceForAudit = (service) => {
    let targetBottleneck = 'Need More Calls & #1 Google Maps Ranking';
    let customText = '';

    const id = service?.id || '';

    if (id === 'local-seo') {
      targetBottleneck = 'Need More Calls & #1 Google Maps Ranking';
    } else if (id === 'websites') {
      targetBottleneck = 'Old Website Not Converting Local Visitors';
    } else if (id === 'ai-automation') {
      targetBottleneck = 'Missing Inbound Calls & Slow Follow-Up';
    } else if (id === 'reviews') {
      targetBottleneck = 'Need Consistent 5-Star Google Reviews';
    } else if (id === 'dashboards') {
      targetBottleneck = 'Need Unified Multi-Location Telemetry';
    } else if (id === 'workflows') {
      // Workflows: auto-select custom service option with prefilled custom requirement text
      targetBottleneck = 'Custom Service Requirement';
      customText = 'Business Workflows: Connect CRM, forms, team dispatch, and automated estimate follow-up pipelines.';
    } else {
      targetBottleneck = 'Custom Service Requirement';
      customText = `Custom Service: ${service?.title || 'Customized Growth System'}`;
    }

    setAuditForm((prev) => ({
      ...prev,
      bottleneck: targetBottleneck,
      customMessage: customText
    }));

    scrollToSection('audit');
  };

  const selectCaseStudyForAudit = (study) => {
    let targetBottleneck = 'Need More Calls & #1 Google Maps Ranking';
    let customText = '';

    if (study) {
      const filterKey = study.filterKey || '';
      const id = study.id;

      if (filterKey === 'maps' || id === 1) {
        targetBottleneck = 'Need More Calls & #1 Google Maps Ranking';
      } else if (filterKey === 'ai' || id === 2) {
        targetBottleneck = 'Missing Inbound Calls & Slow Follow-Up';
      } else if (filterKey === 'web' || id === 3) {
        targetBottleneck = 'Old Website Not Converting Local Visitors';
      } else if (filterKey === 'dashboard' || id === 4) {
        targetBottleneck = 'Need Unified Multi-Location Telemetry';
      } else if (filterKey === 'reviews') {
        targetBottleneck = 'Need Consistent 5-Star Google Reviews';
      } else {
        targetBottleneck = 'Custom Service Requirement';
        customText = `Case Study System: ${study.title || 'Custom Deployment'} (${study.category || ''})`;
      }

      setAuditForm((prev) => ({
        ...prev,
        bottleneck: targetBottleneck,
        customMessage: customText
      }));
    }

    navigateTo('home', 'audit');
  };

  const focusAuditField = (fieldName) => {
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    focusTimeoutRef.current = setTimeout(() => {
      const ref = auditInputRefs[fieldName];
      if (ref && ref.current) {
        ref.current.focus({ preventScroll: true });
      }
    }, 20);
  };

  const triggerVibrate = (fieldName) => {
    setVibratingFields((prev) => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setVibratingFields((prev) => ({ ...prev, [fieldName]: false }));
    }, 450);
  };

  const isValidWebsiteUrl = (val) => {
    if (!val || typeof val !== 'string') return false;
    const trimmed = val.trim();
    if (/\s/.test(trimmed)) return false;
    // Allows domain.com, sub.domain.com, https://domain.com, domain.co.uk/path, etc.
    // Rejects plain words without a TLD like "apex hvac" or "mycompany"
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?$/i;
    return urlPattern.test(trimmed);
  };

  const isValidUsPhone = (val) => {
    if (!val || typeof val !== 'string') return false;
    const digitsOnly = val.replace(/[^\d]/g, '');
    // 10-digit US NANP (area code and exchange code cannot start with 0 or 1)
    if (digitsOnly.length === 10) {
      return /^[2-9]\d{2}[2-9]\d{6}$/.test(digitsOnly);
    }
    // 11-digit US number starting with country code 1
    if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      return /^1[2-9]\d{2}[2-9]\d{6}$/.test(digitsOnly);
    }
    return false;
  };

  const isValidWorkEmail = (val) => {
    if (!val || typeof val !== 'string') return false;
    const trimmed = val.trim();
    // Requires valid username@domain.ext with at least 2 alpha characters in TLD extension
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(trimmed);
  };

  const validateAuditField = (fieldName, rawValue, isSubmit = false) => {
    const val = typeof rawValue === 'string' ? rawValue.trim() : '';

    // Requirement 1 & 3:
    // Only Business Name, Your Name, Phone Number, and Work Email are necessary.
    // If field is empty:
    if (!val) {
      if (isSubmit) {
        if (fieldName === 'businessName') return 'Business name is required.';
        if (fieldName === 'name') return 'Your name is required.';
        if (fieldName === 'phone') return 'Phone number is required.';
        if (fieldName === 'workEmail') return 'Work email is required.';
      }
      // On blur or when user deletes data, empty field has no error
      return '';
    }

    // Guardrails for filled fields:
    if (fieldName === 'website') {
      if (!isValidWebsiteUrl(val)) {
        return 'Enter a valid domain or URL (e.g. domain.com or https://...).';
      }
    } else if (fieldName === 'phone') {
      if (!isValidUsPhone(val)) {
        return 'Enter a valid 10-digit US phone number (e.g. (555) 234-5678).';
      }
    } else if (fieldName === 'workEmail') {
      if (!isValidWorkEmail(val)) {
        return 'Enter a valid email with a domain extension (e.g. name@company.com).';
      }
    }

    return '';
  };

  const handleAuditFieldBlur = (fieldName, e) => {
    // Only intercept and validate on blur if the user is moving to another input/select/textarea inside the audit form.
    // If the visitor clicked outside the audit form (e.g. footer links, nav links, buttons, other page content):
    // DO NOT steal focus, DO NOT trigger vibration, and DO NOT block interaction!
    const target = e?.relatedTarget;
    const isAnotherAuditInput = Boolean(
      target &&
      auditFormRef.current &&
      auditFormRef.current.contains(target) &&
      (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')
    );

    if (!isAnotherAuditInput) {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      return;
    }

    const error = validateAuditField(fieldName, auditForm[fieldName], false);
    if (error) {
      setAuditFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
      triggerVibrate(fieldName);
      // Place visitor back into that wrong filled input
      focusAuditField(fieldName);
    } else {
      setAuditFieldErrors((prev) => {
        if (!prev[fieldName]) return prev;
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleAuditFieldChange = (fieldName, value) => {
    setAuditForm((prev) => ({ ...prev, [fieldName]: value }));

    // Requirement 3: If user deletes all data from an input, error pop should be removed immediately
    if (!value || !value.trim()) {
      setAuditFieldErrors((prev) => {
        if (!prev[fieldName]) return prev;
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
      return;
    }

    // If an error is currently active for this field, revalidate to clear error
    // as soon as the visitor fixes it to a valid value
    if (auditFieldErrors[fieldName]) {
      const error = validateAuditField(fieldName, value, false);
      if (!error) {
        setAuditFieldErrors((prev) => {
          const next = { ...prev };
          delete next[fieldName];
          return next;
        });
      }
    }
  };

  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    setAuditError('');

    // Requirement 1: Business name, Your name, Phone number, and Work Email are necessary only.
    // Website is optional, but if filled, must satisfy URL guardrails.
    const fieldsToCheck = ['businessName', 'name', 'phone', 'workEmail'];
    if (auditForm.website.trim()) {
      fieldsToCheck.push('website');
    }

    const newErrors = {};
    let firstErrorField = null;

    fieldsToCheck.forEach((fieldName) => {
      const err = validateAuditField(fieldName, auditForm[fieldName], true);
      if (err) {
        newErrors[fieldName] = err;
        triggerVibrate(fieldName);
        if (!firstErrorField) {
          firstErrorField = fieldName;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setAuditFieldErrors(newErrors);
      setAuditError('Please complete all required fields and verify highlighted inputs.');
      if (firstErrorField) {
        focusAuditField(firstErrorField);
      }
      return;
    }

    const tokenToUse = auditTurnstileToken || turnstileToken;
    if (!tokenToUse) {
      setAuditError('Please complete the security check.');
      alert('Please complete the security check.');
      return;
    }

    let normalizedWebsite = auditForm.website.trim();
    if (normalizedWebsite && !/^https?:\/\//i.test(normalizedWebsite)) {
      normalizedWebsite = 'https://' + normalizedWebsite;
    }

    setAuditSubmitting(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...auditForm,
          bottleneck:
            auditForm.bottleneck === 'Custom Service Requirement' && auditForm.customMessage.trim()
              ? `Custom Service: ${auditForm.customMessage.trim()}`
              : auditForm.bottleneck,
          customMessage: auditForm.customMessage.trim(),
          customService: auditForm.customMessage.trim(),
          website: normalizedWebsite,
          turnstileToken: tokenToUse,
          'cf-turnstile-response': tokenToUse
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.ok) {
          setAuditSubmitted(true);
        } else {
          setAuditError((data && data.error) || 'Unable to submit audit request.');
        }
      } else if (contentType.includes('application/json')) {
        const errData = await response.json();
        setAuditError(errData.error || 'Submission failed. Please verify your inputs and try again.');
      } else {
        setAuditError(
          'The /api/audit Pages Function endpoint is not reachable in this static preview. Deploy to Cloudflare Pages (https://searchandservice.pages.dev) or run "npm run pages:dev" locally.'
        );
      }
    } catch (err) {
      setAuditError(
        'Could not connect to /api/audit. When deployed on Cloudflare Pages (https://searchandservice.pages.dev) with D1 bound, submissions are stored live.'
      );
    } finally {
      setAuditSubmitting(false);
      setAuditTurnstileToken(null);
      setTurnstileToken(null);
      if (auditWidgetRef.current && window.turnstile && typeof window.turnstile.reset === 'function') {
        try {
          window.turnstile.reset(auditWidgetRef.current);
        } catch (_) {}
      } else if (window.turnstile && typeof window.turnstile.reset === 'function') {
        try {
          window.turnstile.reset();
        } catch (_) {}
      }
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterError('');

    const tokenToUse = newsletterTurnstileToken || turnstileToken;
    if (!tokenToUse) {
      setNewsletterError('Please complete the security check.');
      alert('Please complete the security check.');
      return;
    }

    const cleanEmail = newsletterEmail.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }

    setNewsletterSubmitting(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          turnstileToken: tokenToUse,
          'cf-turnstile-response': tokenToUse
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.ok) {
          setNewsletterSubmitted(true);
        } else {
          setNewsletterError((data && data.error) || 'Subscription failed.');
        }
      } else if (contentType.includes('application/json')) {
        const errData = await response.json();
        setNewsletterError(errData.error || 'Subscription failed. Please try again.');
      } else {
        setNewsletterError(
          'The /api/newsletter Pages Function is not active in static preview. Deploy to https://searchandservice.pages.dev or run "npm run pages:dev".'
        );
      }
    } catch (err) {
      setNewsletterError(
        'Could not connect to /api/newsletter. Deploy to Cloudflare Pages with D1 bound to enable live subscriptions.'
      );
    } finally {
      setNewsletterSubmitting(false);
      setNewsletterTurnstileToken(null);
      setTurnstileToken(null);
      if (newsletterWidgetRef.current && window.turnstile && typeof window.turnstile.reset === 'function') {
        try {
          window.turnstile.reset(newsletterWidgetRef.current);
        } catch (_) {}
      } else if (window.turnstile && typeof window.turnstile.reset === 'function') {
        try {
          window.turnstile.reset();
        } catch (_) {}
      }
    }
  };

  const [isPackagingZip, setIsPackagingZip] = useState(false);

  const handleCopyFullAppJsx = () => {
    const scripts = document.querySelectorAll('script');
    let foundSource = '';
    scripts.forEach((s) => {
      if (s.textContent && s.textContent.includes('HERO_GOOGLE_REVIEWS')) {
        foundSource = s.textContent;
      }
    });
    const instructions =
      '// IMPORTANT: Copy the full code directly from the right-hand code editor panel ("App.jsx") and paste it into src/App.jsx in Antigravity.';
    const textarea = document.createElement('textarea');
    textarea.value = foundSource || instructions;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopiedAppJsx(true);
      setTimeout(() => setCopiedAppJsx(false), 2500);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleDownloadZip = async () => {
    setIsPackagingZip(true);
    try {
      const filesToZip = { ...PROJECT_BUNDLE_FILES };
      // Attempt to automatically include the current App.jsx source file in src/App.jsx
      try {
        const selfRes = await fetch(import.meta.url);
        if (selfRes.ok) {
          const selfCode = await selfRes.text();
          if (selfCode && selfCode.includes('export default function App')) {
            filesToZip['src/App.jsx'] = selfCode;
          }
        }
      } catch {
        // Fallback note if runtime bundler transforms import.meta.url
      }

      const zipBlob = createZipBlob(filesToZip);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'searchandservice-cloudflare-pages-repo.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsPackagingZip(false);
    }
  };

  const handleCopyFileContent = () => {
    const content = PROJECT_BUNDLE_FILES[activeBundleFile] || '';
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 1800);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const filteredPortfolio =
    portfolioFilter === 'all'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.filterKey === portfolioFilter);

  const currentReview = HERO_GOOGLE_REVIEWS[activeReviewIdx];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 selection:bg-[#FF6B1A] selection:text-white ${isDark ? 'bg-[#050505] text-white' : 'bg-[#F7F6F2] text-[#0A0A0A]'
        }`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'Poppins', 'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        .gleamy-outline-letter {
          -webkit-text-stroke: 1.5px ${isDark ? 'rgba(255, 255, 255, 0.13)' : 'rgba(10, 10, 10, 0.12)'};
          color: transparent;
          user-select: none;
          pointer-events: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          line-height: 0.85;
        }

        .gleamy-outline-bottom {
          -webkit-text-stroke: 1.2px ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(10, 10, 10, 0.08)'};
          color: transparent;
          user-select: none;
          pointer-events: none;
          letter-spacing: 0.06em;
          font-weight: 800;
        }

        .gleamy-parallelogram {
          display: inline-block;
          width: 28px;
          height: 11px;
          background-color: #FF6B1A;
          transform: skewX(-24deg) rotate(-12deg);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .group:hover .gleamy-parallelogram {
          width: 44px;
          transform: skewX(-24deg) rotate(-6deg) translateX(4px);
          background-color: #FF5500;
        }

        .vertical-rail-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          letter-spacing: 0.22em;
        }

        @keyframes inputVibrate {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
        .input-vibrate {
          animation: inputVibrate 0.4s ease-in-out !important;
        }

        @keyframes marqueeContinuousLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marqueeContinuousRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-continuous-left {
          display: flex;
          flex-shrink: 0;
          animation: marqueeContinuousLeft 24s linear infinite;
        }
        .animate-marquee-continuous-right {
          display: flex;
          flex-shrink: 0;
          animation: marqueeContinuousRight 24s linear infinite;
        }

        @keyframes testimonialsMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-testimonials-track {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: max-content;
          animation: testimonialsMarquee 38s linear infinite;
        }
        .animate-testimonials-track.paused {
          animation-play-state: paused;
        }

        @keyframes floatCard0 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(18px); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-22px); }
        }
        @keyframes floatCard3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(14px); }
        }
        @keyframes floatCard4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes floatCard5 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        .card-bob-0 { animation: floatCard0 4.1s ease-in-out infinite; }
        .card-bob-1 { animation: floatCard1 3.6s ease-in-out infinite; }
        .card-bob-2 { animation: floatCard2 4.8s ease-in-out infinite; }
        .card-bob-3 { animation: floatCard3 3.9s ease-in-out infinite; }
        .card-bob-4 { animation: floatCard4 4.4s ease-in-out infinite; }
        .card-bob-5 { animation: floatCard5 3.5s ease-in-out infinite; }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 18s linear infinite;
        }

        @keyframes loaderPulse {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(1.03); opacity: 0.14; }
        }
        .animate-loader-watermark {
          animation: loaderPulse 3s ease-in-out infinite;
        }
      `}</style>

      { }
      {isLoading && (
        <div
          className={`fixed inset-0 z-[100] bg-[#F7F6F2] text-[#0A0A0A] flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isLoaderExiting ? '-translate-y-full opacity-95' : 'translate-y-0 opacity-100'
            }`}
        >
          <div className="pointer-events-none absolute inset-0 flex justify-between max-w-[1400px] mx-auto px-6 sm:px-12 opacity-[0.05]">
            <div className="w-[1px] h-full bg-[#0A0A0A]" />
            <div className="w-[1px] h-full bg-[#0A0A0A] hidden sm:block" />
            <div className="w-[1px] h-full bg-[#0A0A0A] hidden lg:block" />
            <div className="w-[1px] h-full bg-[#0A0A0A]" />
          </div>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[420px] h-72 sm:h-[420px] rounded-full blur-[130px] opacity-20"
            style={{ background: '#FF6B1A' }}
          />

          <div className="relative z-10 max-w-[1400px] w-full mx-auto flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6B1A] animate-pulse" />
              <span>SEARCH &amp; SERVICE</span>
            </div>
            <span className="hidden sm:inline">LOCAL BUSINESS GROWTH ARCHITECTURE</span>
            <span className="font-bold text-[#0A0A0A]">{String(loadProgress).padStart(3, '0')}%</span>
          </div>

          <div className="relative z-10 my-auto flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
              <span
                className="animate-loader-watermark absolute inset-0 flex items-center justify-center text-[240px] sm:text-[310px] font-extrabold leading-none pointer-events-none"
                style={{
                  WebkitTextStroke: '1.75px rgba(10, 10, 10, 0.12)',
                  color: 'transparent'
                }}
              >
                s
              </span>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0A0A0A] flex items-center">
                  <span className="relative">
                    search
                    <span className="absolute left-0.5 -bottom-1 w-3.5 sm:w-5 h-[3px] bg-[#FF6B1A] rounded-full" />
                  </span>
                  <span className="mx-1 text-[#FF6B1A]">&amp;</span>
                  <span>service</span>
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF6B1A] ml-1.5 self-end mb-1.5 sm:mb-2.5" />
                </div>

                <p className="mt-4 text-[10px] sm:text-[11px] font-semibold tracking-[0.32em] uppercase text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#FF6B1A]" />
                  <span>Local Business Growth Systems</span>
                </p>

                <div className="mt-6 w-48 sm:w-60 h-[2px] bg-black/10 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#FF6B1A] transition-all duration-75 ease-out rounded-full"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-[1400px] w-full mx-auto flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
            <span>MAPS • WEB • AUTOMATIONS • WORKFLOWS</span>
            <span className="text-[#FF6B1A] font-semibold">
              {loadProgress < 100 ? 'LOADING SYSTEM...' : 'READY'}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${isDark
            ? 'bg-[#050505]/85 border-white/[0.06]'
            : 'bg-[#F7F6F2]/85 border-black/[0.06]'
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
          {/* Left contact icons */}
          <div className="flex items-center gap-1.5 sm:space-x-3 flex-shrink-0">
            <a
              href="mailto:searchandservicegrowth@gmail.com"
              aria-label="Email searchandservicegrowth@gmail.com"
              title="searchandservicegrowth@gmail.com"
              className={`group flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ${isDark
                  ? 'bg-white/[0.06] border-white/15 text-white hover:bg-[#FF6B1A] hover:border-[#FF6B1A] hover:text-white'
                  : 'bg-black/[0.05] border-black/15 text-[#0A0A0A] hover:bg-[#FF6B1A] hover:border-[#FF6B1A] hover:text-white'
                }`}
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110" />
            </a>

            {/* Dot separator hidden on mobile to let phone slide left; preserved on sm+ screens */}
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#FF6B1A]" />

            <a
              href="tel:+15552345678"
              aria-label="Call +1 (555) 234-5678"
              title="+1 (555) 234-5678"
              className={`group flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ${isDark
                  ? 'bg-white/[0.06] border-white/15 text-white hover:bg-[#FF6B1A] hover:border-[#FF6B1A] hover:text-white'
                  : 'bg-black/[0.05] border-black/15 text-[#0A0A0A] hover:bg-[#FF6B1A] hover:border-[#FF6B1A] hover:text-white'
                }`}
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110" />
            </a>
          </div>

          {/* Logo with breathing room */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home', 'hero');
            }}
            className="group flex items-center text-[15px] xs:text-base sm:text-2xl md:text-3xl font-bold tracking-tight focus:outline-none px-2 sm:px-0"
          >
            <span className="relative">
              search
              <span className="absolute left-0.5 bottom-0.5 w-1.5 sm:w-2.5 h-[2px] sm:h-[3px] bg-[#FF6B1A] rounded-full" />
            </span>
            <span className="text-[#FF6B1A] mx-0.5 font-extrabold group-hover:rotate-12 transition-transform">
              &amp;
            </span>
            <span>service</span>
          </a>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:space-x-5 flex-shrink-0">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle Theme"
              className={`relative flex items-center justify-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-medium border transition-all ${isDark
                  ? 'bg-white/[0.05] border-white/15 text-neutral-200 hover:border-[#FF6B1A]'
                  : 'bg-black/[0.05] border-black/15 text-neutral-800 hover:border-[#FF6B1A]'
                }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF6B1A]" />
                  <span className="hidden md:inline tracking-wider uppercase text-[10px]">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF6B1A]" />
                  <span className="hidden md:inline tracking-wider uppercase text-[10px]">Night</span>
                </>
              )}
            </button>

            {/* Vertical separator hidden on mobile to let day/night slide right; preserved on sm+ screens */}
            <span className={`hidden sm:inline-block h-4 w-[1px] ${isDark ? 'bg-white/15' : 'bg-black/15'}`} />

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open Menu"
              className="group flex items-center space-x-2 sm:space-x-2.5 focus:outline-none py-1 pl-1"
            >
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase hidden sm:inline group-hover:text-[#FF6B1A] transition-colors">
                MENU
              </span>
              <div className="flex flex-col items-end justify-center space-y-1 sm:space-y-1.5 w-4 sm:w-6">
                <span
                  className={`block h-[2px] w-4 sm:w-6 transition-all duration-300 group-hover:bg-[#FF6B1A] ${isDark ? 'bg-white' : 'bg-black'
                    }`}
                />
                <span
                  className={`block h-[2px] w-2.5 sm:w-4 transition-all duration-300 group-hover:w-4 sm:group-hover:w-6 group-hover:bg-[#FF6B1A] ${isDark ? 'bg-white' : 'bg-black'
                    }`}
                />
                <span
                  className={`block h-[2px] w-3 sm:w-5 transition-all duration-300 group-hover:w-4 sm:group-hover:w-6 group-hover:bg-[#FF6B1A] ${isDark ? 'bg-white' : 'bg-black'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      {menuOpen && (
        <div
          className={`fixed inset-0 z-[90] flex flex-col justify-between p-6 sm:p-10 lg:p-12 transition-all duration-300 overflow-y-auto lg:overflow-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-[#F7F6F2] text-[#0A0A0A]'
            }`}
        >
          <div className="flex items-center justify-between max-w-[1400px] w-full mx-auto flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold tracking-tight">
              search<span className="text-[#FF6B1A]">&amp;</span>service
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-xs tracking-[0.25em] uppercase hover:text-[#FF6B1A] transition-colors py-1"
            >
              <span>CLOSE</span>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto py-4 sm:py-6 lg:py-2">
            <nav className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-4 lg:space-y-2.5 xl:space-y-3">
              {[
                { num: '01', label: 'HOME', action: () => scrollToSection('hero') },
                { num: '02', label: 'ABOUT US', action: () => scrollToSection('about') },
                { num: '03', label: 'GROWTH SYSTEMS & SERVICES', action: () => scrollToSection('services') },
                { num: '04', label: 'GROWTH ENGINE', action: () => scrollToSection('systems') },
                {
                  num: '05',
                  label: 'CASE STUDIES',
                  action: () => {
                    setMenuOpen(false);
                    navigateTo('case-studies');
                  }
                },
                { num: '06', label: 'FREE LOCAL GROWTH AUDIT', action: () => scrollToSection('audit') }
              ].map((item) => (
                <button
                  key={item.num}
                  onClick={item.action}
                  className="group flex items-baseline space-x-3 sm:space-x-4 text-left focus:outline-none py-0.5"
                >
                  <span className="text-[11px] sm:text-xs font-mono text-[#FF6B1A] tracking-widest flex-shrink-0">
                    /{item.num}
                  </span>
                  <span className="text-lg sm:text-2xl md:text-3xl lg:text-[26px] xl:text-[32px] font-extrabold tracking-tight leading-tight group-hover:translate-x-3 group-hover:text-[#FF6B1A] transition-all">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            <div
              className={`lg:col-span-5 rounded-2xl p-5 sm:p-6 lg:p-6 xl:p-7 border flex flex-col justify-center self-center shadow-2xl ${isDark ? 'bg-[#0C0C0C] border-white/10' : 'bg-white border-black/10'
                }`}
            >
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF6B1A]">
                  <Sparkles className="w-3.5 h-3.5" /> Local Growth Systems Partner
                </span>
                <h3 className="mt-2 text-base sm:text-xl lg:text-lg xl:text-xl font-bold leading-snug">
                  We don’t just build websites. We engineer complete local revenue engines.
                </h3>
              </div>

              <div className="hidden lg:block my-4">
                <div
                  onMouseEnter={() => setIsReviewPaused(true)}
                  onMouseLeave={() => setIsReviewPaused(false)}
                  className={`w-full rounded-xl px-4 py-3 border transition-all duration-500 backdrop-blur-xl shadow-lg ${isDark
                      ? 'bg-[#050505]/90 border-white/15 shadow-black/60'
                      : 'bg-[#F7F6F2]/95 border-black/15 shadow-black/5'
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={currentReview.avatar}
                      alt={currentReview.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#FF6B1A] flex-shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold truncate">
                          {currentReview.name}{' '}
                          <span
                            className={`font-normal text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                              }`}
                          >
                            • {currentReview.role},{' '}
                            <span className="text-[#FF6B1A] font-medium">{currentReview.company}</span>
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 mt-0.5">
                        <div className="flex items-center space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-[#FBBC05] fill-[#FBBC05]" />
                          ))}
                        </div>
                        <span
                          className={`text-[10px] pl-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                            }`}
                        >
                          {currentReview.timeAgo}
                        </span>
                      </div>

                      <p
                        className={`mt-1 text-[11px] leading-snug line-clamp-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'
                          }`}
                      >
                        {currentReview.review}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-widest opacity-60">Direct Growth Line</div>
                  <a
                    href="mailto:searchandservicegrowth@gmail.com"
                    className="block text-xs sm:text-sm font-semibold mt-0.5 hover:text-[#FF6B1A] transition-colors"
                  >
                    searchandservicegrowth@gmail.com
                  </a>
                </div>
                <button
                  onClick={() => scrollToSection('audit')}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#FF6B1A] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#e55a0d] transition-colors text-center"
                >
                  Claim Free Audit →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      { }
      <aside className="fixed left-5 lg:left-8 top-28 bottom-12 z-30 hidden xl:flex flex-col items-center justify-between pointer-events-auto">
        <button
          onClick={() => scrollToSection('about')}
          className="relative w-20 h-20 flex items-center justify-center group focus:outline-none"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            <defs>
              <path id="leftCirclePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
            </defs>
            <text fill={isDark ? '#FFFFFF' : '#0A0A0A'} fontSize="8.5" fontWeight="700" letterSpacing="2.6px">
              <textPath href="#leftCirclePath">SEARCH &amp; SERVICE • GROWTH •</textPath>
            </text>
          </svg>
          <div
            className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${isDark ? 'bg-white text-[#050505]' : 'bg-[#0A0A0A] text-white'
              }`}
          >
            <span className="font-extrabold text-lg -rotate-12 relative">
              s
              <span className="absolute -bottom-0.5 right-0 w-1.5 h-1.5 rounded-full bg-[#FF6B1A]" />
            </span>
          </div>
        </button>

        <div className="flex flex-col items-center space-y-10 my-auto">
          <button
            onClick={() => scrollToSection('services')}
            className={`vertical-rail-text text-[10px] font-semibold tracking-[0.25em] uppercase transition-colors hover:text-[#FF6B1A] ${isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
          >
            AUTOMATIONS
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className={`vertical-rail-text text-[10px] font-semibold tracking-[0.25em] uppercase transition-colors hover:text-[#FF6B1A] ${isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
          >
            WEB DEV
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className={`vertical-rail-text text-[10px] font-semibold tracking-[0.25em] uppercase transition-colors hover:text-[#FF6B1A] ${isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
          >
            GOOGLE MAPS RANKING
          </button>
        </div>
        <div className="w-[1px] h-10 bg-[#FF6B1A]/40" />
      </aside>

      { }
      <div className="fixed right-3 sm:right-8 bottom-3 sm:bottom-7 z-40">
        <button
          onClick={() => setVideoModalOpen(true)}
          aria-label="Watch Video"
          className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center group focus:outline-none"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            <defs>
              <path id="videoCirclePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
            </defs>
            <text fill={isDark ? '#FFFFFF' : '#0A0A0A'} fontSize="8.5" fontWeight="700" letterSpacing="2.5px">
              <textPath href="#videoCirclePath">WATCH • OUR • VIDEO • SYSTEM •</textPath>
            </text>
          </svg>
          <div
            className={`absolute w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110 ${isDark ? 'bg-white' : 'bg-[#0A0A0A]'
              }`}
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B1A] fill-[#FF6B1A] ml-0.5" />
          </div>
        </button>
      </div>

      {/* Main Page Content */}
      {currentPage === 'home' ? (
        <>
          <section
            id="hero"
        className="relative min-h-[96svh] sm:min-h-[100svh] pt-24 sm:pt-32 pb-28 sm:pb-36 lg:pb-32 flex flex-col justify-center overflow-hidden"
      >
        <div className="gleamy-outline-letter absolute right-2 sm:right-auto sm:left-20 xl:left-36 top-[42%] sm:top-[50%] -translate-y-1/2 text-[175px] sm:text-[340px] lg:text-[450px] z-0 opacity-75 sm:opacity-100">
          s
        </div>

        <div
          className="pointer-events-none absolute top-1/3 left-1/4 w-52 sm:w-96 h-52 sm:h-96 rounded-full blur-[120px] sm:blur-[140px] opacity-15"
          style={{ background: '#FF6B1A' }}
        />

        <div className="relative z-20 max-w-[1400px] mx-auto w-full px-5 sm:px-12 xl:pl-28 xl:pr-16 mt-4 sm:mt-12 lg:mt-16 pb-20 sm:pb-24 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-6 items-center">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center pt-4 sm:pt-8">
              <h1 className="tracking-tight">
                <span className="block text-[32px] sm:text-5xl md:text-6xl xl:text-[68px] font-extrabold leading-[1.1] sm:leading-[1.08]">
                  We Help Local Businesses
                </span>
                <span
                  className={`block mt-2.5 sm:mt-3.5 text-[20px] sm:text-2xl md:text-3xl xl:text-[42px] font-semibold leading-[1.2] sm:leading-[1.16] ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}
                >
                  Get More Customers, More Calls, and More Sales<span className="text-[#FF6B1A]">.</span>
                </span>
              </h1>

              <div className="mt-8 sm:mt-10 flex flex-row flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => scrollToSection('audit')}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-none bg-[#FF6B1A] hover:bg-[#ff5500] border border-[#FF6B1A] text-white font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.18em] transition-all shadow-md shadow-[#FF6B1A]/20 flex items-center justify-center gap-1.5 sm:gap-2 group"
                >
                  <span>Get Free Growth Audit</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <button
                  onClick={() => scrollToSection('services')}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-none border border-[#FF6B1A] bg-transparent hover:bg-[#FF6B1A] hover:text-white font-bold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.18em] transition-all hover:shadow-md hover:shadow-[#FF6B1A]/20 flex items-center justify-center gap-1.5 sm:gap-2 group ${isDark ? 'text-white' : 'text-[#0A0A0A]'
                    }`}
                >
                  <span>Explore Systems</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6B1A] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 flex justify-start md:justify-end lg:justify-start pt-4 sm:pt-6 lg:pt-0 lg:translate-y-36 xl:translate-y-44 lg:-translate-x-8 xl:-translate-x-14">
              <div
                onMouseEnter={() => setIsReviewPaused(true)}
                onMouseLeave={() => setIsReviewPaused(false)}
                className={`w-full max-w-full sm:max-w-[370px] rounded-xl px-3.5 sm:px-4 py-3 border transition-all duration-500 backdrop-blur-xl shadow-xl ${isDark
                    ? 'bg-[#0C0C0C]/90 border-white/15 shadow-black/70'
                    : 'bg-white/95 border-black/15 shadow-black/10'
                  }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={currentReview.avatar}
                    alt={currentReview.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#FF6B1A] flex-shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] sm:text-xs font-bold truncate">
                        {currentReview.name}{' '}
                        <span
                          className={`font-normal text-[10px] sm:text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                            }`}
                        >
                          • {currentReview.role},{' '}
                          <span className="text-[#FF6B1A] font-medium">{currentReview.company}</span>
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 mt-0.5">
                      <div className="flex items-center space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FBBC05] fill-[#FBBC05]" />
                        ))}
                      </div>
                      <span
                        className={`text-[9px] sm:text-[10px] pl-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                          }`}
                      >
                        {currentReview.timeAgo}
                      </span>
                    </div>

                    <p
                      className={`mt-1 sm:mt-1.5 text-[11px] sm:text-xs leading-snug line-clamp-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'
                        }`}
                    >
                      {currentReview.review}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal Marquees */}
        <div
          className="pointer-events-none hidden lg:flex items-center fixed-ribbon absolute z-10 bg-white text-[#050505] py-2.5 xl:py-3 shadow-2xl border-y border-black/10 overflow-hidden"
          style={{
            width: '140vw',
            right: '-38vw',
            top: '32%',
            transform: 'rotate(50deg)'
          }}
        >
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee-continuous-right flex items-center space-x-6 lg:space-x-8 pr-6 lg:pr-8 text-[11px] lg:text-xs xl:text-sm font-medium tracking-[0.22em] uppercase">
              {['GOOGLE MAPS', 'WORKFLOWS', 'AUTOMATIONS', 'REVIEW GENERATION', 'CUSTOM DASHBOARDS', 'GOOGLE MAPS', 'WORKFLOWS', 'AUTOMATIONS'].map((text, idx) => (
                <React.Fragment key={idx}>
                  <span>{text}</span>
                  <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" />
                </React.Fragment>
              ))}
            </div>
            <div className="animate-marquee-continuous-right flex items-center space-x-6 lg:space-x-8 pr-6 lg:pr-8 text-[11px] lg:text-xs xl:text-sm font-medium tracking-[0.22em] uppercase" aria-hidden="true">
              {['GOOGLE MAPS', 'WORKFLOWS', 'AUTOMATIONS', 'REVIEW GENERATION', 'CUSTOM DASHBOARDS', 'GOOGLE MAPS', 'WORKFLOWS', 'AUTOMATIONS'].map((text, idx) => (
                <React.Fragment key={idx}>
                  <span>{text}</span>
                  <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none flex lg:hidden items-center absolute z-10 bg-white text-[#050505] py-2 sm:py-2.5 shadow-xl border-y border-black/15 bottom-[6.5%] sm:bottom-[9%] overflow-hidden"
          style={{
            width: '140vw',
            left: '-18vw',
            transform: 'rotate(7deg)',
            transformOrigin: '76% center'
          }}
        >
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee-continuous-right flex items-center space-x-5 sm:space-x-8 pr-5 sm:pr-8 text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase">
              {['GOOGLE MAPS', 'WORKFLOWS', 'AUTOMATIONS', 'REVIEW GENERATION', 'CUSTOM DASHBOARDS'].map((text, idx) => (
                <React.Fragment key={idx}>
                  <span>{text}</span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF6B1A]" />
                </React.Fragment>
              ))}
            </div>
            <div className="animate-marquee-continuous-right flex items-center space-x-5 sm:space-x-8 pr-5 sm:pr-8 text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase" aria-hidden="true">
              {['GOOGLE MAPS', 'WORKFLOWS', 'AUTOMATIONS', 'REVIEW GENERATION', 'CUSTOM DASHBOARDS'].map((text, idx) => (
                <React.Fragment key={idx}>
                  <span>{text}</span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF6B1A]" />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute z-10 bg-[#171717] text-white py-2 sm:py-3.5 shadow-2xl border-y border-white/10 bottom-[4.5%] sm:bottom-[7.5%] lg:bottom-[8%] overflow-hidden"
          style={{
            width: '135vw',
            left: '-12vw',
            transform: 'rotate(-5deg)',
            transformOrigin: '76% center'
          }}
        >
          <div className="flex w-full overflow-hidden">
            <div className="animate-marquee-continuous-left flex items-center space-x-5 sm:space-x-10 pr-5 sm:pr-10 text-[10px] sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.22em] uppercase">
              {['AUTOMATIONS', 'WEB DEVELOPMENT', 'GOOGLE MAPS RANKING', 'BUSINESS WORKFLOWS', 'REVIEW FUNNELS'].map((text, idx) => (
                <React.Fragment key={idx}>
                  <span>{text}</span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF6B1A]" />
                </React.Fragment>
              ))}
            </div>
            <div className="animate-marquee-continuous-left flex items-center space-x-5 sm:space-x-10 pr-5 sm:pr-10 text-[10px] sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.22em] uppercase" aria-hidden="true">
              {['AUTOMATIONS', 'WEB DEVELOPMENT', 'GOOGLE MAPS RANKING', 'BUSINESS WORKFLOWS', 'REVIEW FUNNELS'].map((text, idx) => (
                <React.Fragment key={idx}>
                  <span>{text}</span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF6B1A]" />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      { }
      <section
        aria-label="Credibility"
        className={`relative z-20 border-t border-b py-8 sm:py-12 lg:py-14 ${isDark ? 'bg-[#080808] border-white/[0.08]' : 'bg-[#EFECE6] border-black/[0.08]'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 xl:pl-28 xl:pr-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-6 gap-x-4 sm:gap-8">
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                <span className="text-[#FF6B1A]">4+</span> Years
              </div>
              <div className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold">Industry Experience</div>
              <div className="text-[10px] sm:text-xs mt-0.5 text-neutral-500">Proven local playbooks</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                250<span className="text-[#FF6B1A]">+</span>
              </div>
              <div className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold">Small Businesses Helped</div>
              <div className="text-[10px] sm:text-xs mt-0.5 text-neutral-500">Across 18+ niches</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                3.3M<span className="text-[#FF6B1A]">+</span>
              </div>
              <div className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold">U.S. Service Establishments</div>
              <div className="text-[10px] sm:text-xs mt-0.5 text-neutral-500">U.S. Census Bureau SUSB baseline</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                4.9 <span className="text-[#FF6B1A]">★</span>
              </div>
              <div className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold">Client Testimonials</div>
              <div className="text-[10px] sm:text-xs mt-0.5 text-neutral-500">98.4% retention</div>
            </div>
            <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-current/10">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                100<span className="text-[#FF6B1A]">%</span>
              </div>
              <div className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold">Done-For-You Systems</div>
              <div className="text-[10px] sm:text-xs mt-0.5 text-neutral-500">Custom KPI Dashboards</div>
            </div>
          </div>
        </div>
      </section>

      { }
      <section id="about" className="relative py-16 sm:py-24 lg:py-36 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 xl:pl-28 xl:pr-16">
          <div className="flex items-center justify-between lg:block">
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-normal tracking-[0.14em] uppercase">
                ABOUT US
              </h2>
              <div className={`mt-2.5 sm:mt-3 w-10 sm:w-12 h-[2px] ${isDark ? 'bg-white/60' : 'bg-black/60'}`} />
            </div>
            <div className="gleamy-outline-letter text-[85px] sm:text-[130px] leading-none select-none lg:hidden">
              g
            </div>
          </div>

          <div className="mt-6 sm:mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
            <div className="lg:col-span-4 hidden lg:flex justify-start">
              <div className="gleamy-outline-letter text-[310px] leading-none select-none">
                g
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5 sm:space-y-7 lg:space-y-8">
              <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold lg:font-medium tracking-[0.05em] sm:tracking-[0.06em] uppercase leading-snug">
                WE ARE A LOCAL BUSINESS GROWTH SYSTEMS PARTNER.
              </h3>

              <p
                className={`text-[13px] sm:text-lg md:text-xl lg:text-2xl leading-[1.75] sm:leading-[1.7] font-normal tracking-[0.03em] sm:tracking-[0.04em] uppercase ${isDark ? 'text-neutral-200' : 'text-neutral-800'
                  }`}
              >
                SEARCHANDSERVICE IS A PREMIER DIGITAL GROWTH &amp; AUTOMATION AGENCY. WITH{' '}
                <span className="text-[#FF6B1A] font-semibold">4+ YEARS OF INDUSTRY EXPERIENCE</span>
                , OUR TEAM OF EXPERTS HAS HELPED HUNDREDS OF SMALL BUSINESSES DOMINATE GOOGLE MAPS,
                CONVERT MORE CUSTOMERS, AND AUTOMATE DAILY OPERATIONS. WE UNDERSTAND LOCAL
                BUSINESSES, AND WE KNOW HOW TO GROW THEM.
                <span className="gleamy-parallelogram ml-2 sm:ml-3 align-middle" />
              </p>

              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-6 sm:gap-8">
                <button
                  onClick={() => scrollToSection('audit')}
                  className="group relative inline-flex items-center text-lg sm:text-2xl lg:text-3xl font-medium tracking-wider focus:outline-none py-1"
                >
                  <span className="relative z-10">Contact Us</span>
                  <span className="gleamy-parallelogram -ml-16 sm:-ml-20 mt-2 sm:mt-3 opacity-95" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      { }
      <section
        id="services"
        className={`relative py-16 sm:py-24 lg:py-36 overflow-x-clip border-t ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 xl:pl-28 xl:pr-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3 relative">
              <div className="lg:sticky lg:top-28 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start pb-2 lg:pb-4">
                <div>
                  <h2 className="text-lg sm:text-2xl lg:text-3xl font-normal tracking-[0.14em] uppercase">
                    GROWTH SYSTEMS &amp; SERVICES
                  </h2>
                  <div className={`mt-2.5 sm:mt-3 w-10 sm:w-12 h-[2px] ${isDark ? 'bg-white/60' : 'bg-black/60'}`} />
                </div>
                <div className="lg:mt-16 gleamy-outline-letter text-[85px] sm:text-[130px] lg:text-[300px] leading-none select-none">
                  S
                </div>
              </div>
            </div>

            <div className="lg:col-span-9 flex flex-col">
              <div className="flex lg:justify-end mb-6 sm:mb-10 lg:mb-12">
                <p
                  className={`max-w-md text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.15em] lg:text-right leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}
                >
                  COMPLETE DIGITAL GROWTH STRATEGIES ENGINEERED TO GET DISCOVERED, CONVERT LEADS &amp;
                  SAVE OPERATIONAL TIME.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-8 sm:gap-y-12 lg:gap-y-14">
                {SERVICES_DATA.map((service) => (
                  <div
                    key={service.id}
                    className={`group relative flex flex-col justify-between pb-5 sm:pb-6 border-b transition-all ${isDark
                        ? 'border-white/10 hover:border-[#FF6B1A]/60'
                        : 'border-black/10 hover:border-[#FF6B1A]/60'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#FF6B1A] mb-2.5 sm:mb-3">
                        <span>/{service.number}</span>
                        <span className="tracking-[0.16em] sm:tracking-[0.18em] text-[9px] sm:text-[10px] uppercase opacity-75">
                          {service.tag}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight group-hover:text-[#FF6B1A] transition-colors">
                        {service.title}
                      </h3>

                      <p
                        className={`mt-2.5 sm:mt-4 text-xs sm:text-[13px] leading-[1.75] sm:leading-[1.85] ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                          }`}
                      >
                        {service.shortDesc}
                      </p>

                      <div
                        className={`mt-3.5 sm:mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'
                          }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-[#FF6B1A] flex-shrink-0" />
                        <span>{service.impact}</span>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-7">
                      <button
                        onClick={() => selectServiceForAudit(service)}
                        className="group/btn relative inline-flex items-center text-xs sm:text-sm font-medium tracking-wider focus:outline-none py-1"
                      >
                        <span className="relative z-10">Know More</span>
                        <span className="gleamy-parallelogram -ml-14 mt-2 opacity-80 group-hover/btn:opacity-100" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="gleamy-outline-bottom text-[38px] sm:text-[85px] md:text-[110px] lg:text-[150px] leading-none whitespace-nowrap mt-10 sm:mt-14 -mb-4 sm:-mb-10 px-4 overflow-hidden">
          THE GROWTH8TIVE
        </div>
      </section>

      { }
      <section
        id="systems"
        className={`relative py-16 sm:py-24 lg:py-36 overflow-hidden border-t ${isDark ? 'bg-[#080808] border-white/[0.06]' : 'bg-[#EFECE6] border-black/[0.06]'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 xl:pl-28 xl:pr-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-normal tracking-[0.14em] uppercase">
                5-PILLAR ROI &amp; GROWTH ENGINE
              </h2>
              <div className={`mt-2.5 sm:mt-3 w-10 sm:w-12 h-[2px] ${isDark ? 'bg-white/60' : 'bg-black/60'}`} />
            </div>
            <p
              className={`max-w-md text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
            >
              Data-backed growth metrics calibrated against verified search index benchmarks and baseline reporting.
            </p>
          </div>

          <div className="mt-8 sm:mt-12 flex sm:grid sm:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0">
            {GROWTH_PILLARS.map((pillar, idx) => {
              const isSelected = activePillar === idx;
              return (
                <button
                  key={pillar.step}
                  onClick={() => setActivePillar(idx)}
                  className={`flex-shrink-0 w-[165px] sm:w-auto text-left p-3.5 sm:p-5 transition-all border ${isSelected
                      ? 'bg-[#FF6B1A] text-white border-[#FF6B1A] shadow-lg shadow-[#FF6B1A]/20'
                      : isDark
                        ? 'bg-[#0D0D0D] border-white/10 hover:border-white/30 text-neutral-300'
                        : 'bg-white border-black/10 hover:border-black/30 text-neutral-800'
                    }`}
                >
                  <div
                    className={`text-[10px] sm:text-xs font-mono tracking-widest ${isSelected ? 'text-white/90' : 'text-[#FF6B1A]'
                      }`}
                  >
                    STAGE {pillar.step}
                  </div>
                  <div className="mt-1.5 sm:mt-2 font-extrabold text-xs sm:text-sm lg:text-base tracking-wide uppercase leading-snug">
                    {pillar.title}
                  </div>
                </button>
              );
            })}
          </div>

          <div
            className={`mt-4 sm:mt-6 p-5 sm:p-8 lg:p-10 border grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center ${isDark ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-black/10'
              }`}
          >
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B1A]/15 text-[#FF6B1A] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <span>Stage {GROWTH_PILLARS[activePillar].step}</span>
                <span>•</span>
                <span>{GROWTH_PILLARS[activePillar].title}</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
                {GROWTH_PILLARS[activePillar].subtitle}
              </h3>
              <p
                className={`text-xs sm:text-sm lg:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
              >
                {GROWTH_PILLARS[activePillar].description}
              </p>
              <div className="pt-1 sm:pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {GROWTH_PILLARS[activePillar].kpis.map((kpi, i) => (
                  <div
                    key={i}
                    className={`p-3 sm:p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${isDark
                        ? 'bg-white/[0.03] border-white/10 text-white'
                        : 'bg-black/[0.03] border-black/10 text-black'
                      }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B1A] flex-shrink-0" />
                    <span>{kpi}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`lg:col-span-5 rounded-xl p-4 sm:p-6 border ${isDark ? 'bg-[#050505] border-white/10' : 'bg-[#F7F6F2] border-black/10'
                }`}
            >
              {activePillar === 0 && (
                <div className="space-y-3">
                  <div
                    className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${isDark ? 'bg-white/[0.04] border-white/15' : 'bg-white border-black/15 shadow-sm'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FF6B1A]" />
                      <span className="font-medium">“hvac repair near me”</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#FF6B1A]/20 text-[#FF6B1A] font-bold text-[10px]">
                      Top Map Pack
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        rank: '#1',
                        name: 'Vance HVAC & Mechanical',
                        rating: '4.9',
                        reviews: '(214)',
                        status: 'Open now • 0.4 mi',
                        highlight: true
                      },
                      {
                        rank: '#2',
                        name: 'Capital City Air & Heating',
                        rating: '4.7',
                        reviews: '(188)',
                        status: 'Open • 0.9 mi',
                        highlight: false
                      },
                      {
                        rank: '#3',
                        name: 'Precision Climate Solutions',
                        rating: '4.6',
                        reviews: '(142)',
                        status: 'Open • 1.4 mi',
                        highlight: false
                      }
                    ].map((bus, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border flex items-center justify-between ${bus.highlight
                            ? 'bg-[#FF6B1A]/10 border-[#FF6B1A]/50'
                            : isDark
                              ? 'bg-white/[0.02] border-white/10'
                              : 'bg-white border-black/10'
                          }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded bg-[#FF6B1A] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                            {bus.rank}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{bus.name}</div>
                            <div className="flex items-center gap-1 text-[10px] mt-0.5">
                              <span className="text-[#FBBC05] font-bold">★ {bus.rating}</span>
                              <span className="opacity-60">{bus.reviews}</span>
                              <span className="opacity-40">•</span>
                              <span className="text-[#10B981] font-medium">{bus.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePillar === 1 && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold mb-2">
                    Website Visitor-to-Lead Conversion Funnel (~7.5% Benchmark)
                  </div>
                  {[
                    { label: 'Local Search Visitors', val: '1,200 / mo', pct: '100%' },
                    { label: 'Performance Engagement', val: '920 / mo', pct: '76%' },
                    { label: 'Qualified Calls & Quote Leads', val: '90 Leads', pct: '7.5% CVR' }
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-center justify-between ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10'
                        }`}
                    >
                      <span className="text-xs">{row.label}</span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#FF6B1A]">{row.val}</span>
                        <span className="text-[10px] opacity-60 ml-2">({row.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activePillar === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-current/10">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-[#FF6B1A]" />
                      <span className="text-xs font-bold">Speed-to-Lead Automation</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                      Sub-Minute
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div
                      className={`p-3 rounded-lg border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10'
                        }`}
                    >
                      <div className="text-[10px] font-mono text-[#FF6B1A] uppercase">
                        00:30s • Inquiry Received
                      </div>
                      <div className="mt-1 font-medium">
                        Automated text sent: “Hi! Thanks for reaching out. Are you looking for service or installation?”
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg border ${isDark ? 'bg-[#FF6B1A]/10 border-[#FF6B1A]/40' : 'bg-[#FF6B1A]/10 border-[#FF6B1A]/40'
                        }`}
                    >
                      <div className="text-[10px] font-mono text-[#FF6B1A] uppercase">
                        02:15s • Lead Confirmed
                      </div>
                      <div className="mt-1 font-semibold">
                        Appointment booked on calendar + review proof sent.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePillar === 3 && (
                <div className="space-y-2.5 text-xs">
                  {[
                    { time: 'Instant', task: 'CRM Lead Created & Team Notified' },
                    { time: '24h Prior', task: 'Automated SMS Appointment Reminder Sent' },
                    { time: 'Job Complete', task: 'Automated 5★ Review Request Sent' }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border flex items-center justify-between ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10'
                        }`}
                    >
                      <span className="font-medium">{item.task}</span>
                      <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono text-[10px]">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activePillar === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-current/10">
                    <span className="font-mono uppercase tracking-wider text-[#FF6B1A]">
                      EXECUTIVE REVENUE TELEMETRY
                    </span>
                    <span className="flex items-center gap-1.5 text-[#10B981] font-semibold text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" /> Live Sync
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`p-3 rounded-lg border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10'
                        }`}
                    >
                      <div className="text-[10px] opacity-60">Tracked Monthly Revenue Lift</div>
                      <div className="text-base sm:text-lg font-extrabold text-[#10B981] mt-0.5">
                        +$1,875 / mo
                      </div>
                      <div className="text-[10px] font-bold text-[#10B981] mt-0.5">Verified Formula</div>
                    </div>

                    <div
                      className={`p-3 rounded-lg border ${isDark ? 'bg-[#FF6B1A]/10 border-[#FF6B1A]/40' : 'bg-[#FF6B1A]/10 border-[#FF6B1A]/40'
                        }`}
                    >
                      <div className="text-[10px] text-[#FF6B1A] font-semibold">Projected Leads</div>
                      <div className="text-base sm:text-lg font-extrabold mt-0.5">40 / mo</div>
                      <div className="text-[10px] font-bold text-[#FF6B1A] mt-0.5">100% Tracked</div>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/10'
                      }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-2">
                      <span className="opacity-70 font-medium">Monthly Revenue Growth</span>
                      <span className="font-mono font-bold text-[#FF6B1A]">Avg +$1,875/mo</span>
                    </div>
                    <div className="h-16 flex items-end gap-1.5 pt-2">
                      {[30, 42, 55, 68, 80, 100].map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-[#FF6B1A]/40 to-[#FF6B1A] transition-all duration-500"
                          style={{ height: `${val}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          { }
          <div
            className={`mt-10 sm:mt-14 p-5 sm:p-8 lg:p-10 border rounded-2xl ${isDark ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B1A]">
                    INTERACTIVE REVENUE CALCULATOR
                  </span>
                  <h3 className="text-lg sm:text-2xl font-extrabold mt-1">
                    Simulate Your Local Growth Potential
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 opacity-75">
                    1. Select Your Local Business Industry
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {INDUSTRY_PRESETS.map((ind, idx) => (
                      <button
                        key={ind.name}
                        onClick={() => handleIndustryChange(idx)}
                        className={`px-3 py-2.5 rounded-lg text-[11px] sm:text-xs font-semibold text-left border transition-all ${selectedIndustryIdx === idx
                            ? 'bg-[#FF6B1A] text-white border-[#FF6B1A]'
                            : isDark
                              ? 'bg-white/[0.03] border-white/10 hover:border-white/30'
                              : 'bg-black/[0.03] border-black/10 hover:border-black/30'
                          }`}
                      >
                        {ind.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-1 sm:pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span>Current Monthly Leads</span>
                      <span className="text-[#FF6B1A] font-bold">{currentMonthlyLeads} / mo</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={currentMonthlyLeads}
                      onChange={(e) => setCurrentMonthlyLeads(Number(e.target.value))}
                      className="w-full accent-[#FF6B1A] cursor-pointer h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span>Average Service Value ($)</span>
                      <span className="text-[#FF6B1A] font-bold">
                        ${customTicket.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="12000"
                      step="50"
                      value={customTicket}
                      onChange={(e) => setCustomTicket(Number(e.target.value))}
                      className="w-full accent-[#FF6B1A] cursor-pointer h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span>Added Leads / Month</span>
                      <span className="text-[#FF6B1A] font-bold">+{customAddedLeads} / mo</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={customAddedLeads}
                      onChange={(e) => setCustomAddedLeads(Number(e.target.value))}
                      className="w-full accent-[#FF6B1A] cursor-pointer h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span>Lead-to-Customer Conversion</span>
                      <span className="text-[#FF6B1A] font-bold">
                        {(customConversionRate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.50"
                      step="0.01"
                      value={customConversionRate}
                      onChange={(e) => setCustomConversionRate(Number(e.target.value))}
                      className="w-full accent-[#FF6B1A] cursor-pointer h-2"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`lg:col-span-5 p-5 sm:p-8 rounded-xl border ${isDark
                    ? 'bg-[#050505] border-[#FF6B1A]/40'
                    : 'bg-[#F7F6F2] border-[#FF6B1A]/40'
                  }`}
              >
                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B1A]">
                  PROJECTED SEARCHANDSERVICE IMPACT
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-current/10">
                  <div>
                    <div className="text-[11px] sm:text-xs opacity-60">Total Projected Leads</div>
                    <div className="text-xl sm:text-3xl font-extrabold mt-1">
                      {totalLeads}{' '}
                      <span className="text-[11px] sm:text-xs font-bold text-[#10B981]">(+{customAddedLeads})</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs opacity-60">Admin Time Saved</div>
                    <div className="text-xl sm:text-3xl font-extrabold mt-1">3+ hrs/wk</div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5">
                  <div className="text-[11px] sm:text-xs opacity-60">Additional Monthly Revenue</div>
                  <div className="text-2xl sm:text-4xl font-extrabold text-[#FF6B1A] mt-1">
                    +${Math.round(monthlyRevenueLift).toLocaleString()}
                    <span className="text-xs sm:text-sm font-normal opacity-70"> / mo</span>
                  </div>
                  <div className="text-[11px] sm:text-xs opacity-70 mt-1">
                    ≈ +${Math.round(annualRevenueLift).toLocaleString()} Annualized Revenue Growth (Monthly × 12)
                  </div>
                </div>

                <button
                  onClick={() => scrollToSection('audit')}
                  className="mt-5 sm:mt-6 w-full py-3.5 bg-[#FF6B1A] hover:bg-[#ff5500] text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-colors"
                >
                  Lock In This Growth Plan →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      { }
      <section
        id="portfolio"
        className={`relative py-16 sm:py-24 lg:py-36 overflow-hidden border-t ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 xl:pl-28 xl:pr-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
            <div className="flex items-center justify-between md:block">
              <div>
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-normal tracking-[0.14em] uppercase">
                  PROVEN CASE STUDIES
                </h2>
                <div className={`mt-2.5 sm:mt-3 w-10 sm:w-12 h-[2px] ${isDark ? 'bg-white/60' : 'bg-black/60'}`} />
              </div>
              <div className="gleamy-outline-letter text-[80px] sm:text-[110px] leading-none select-none lg:hidden">
                p
              </div>
            </div>

            <div className="flex overflow-x-auto sm:flex-wrap gap-2 pb-1 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0">
              {[
                { key: 'all', label: 'ALL SYSTEMS' },
                { key: 'maps', label: 'GOOGLE MAPS #1' },
                { key: 'web', label: 'HIGH-CONVERTING WEB' },
                { key: 'ai', label: 'AUTOMATIONS & REVIEWS' },
                { key: 'dashboard', label: 'CUSTOM DASHBOARDS' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPortfolioFilter(tab.key)}
                  className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] sm:tracking-[0.16em] uppercase transition-all border ${portfolioFilter === tab.key
                      ? 'bg-[#FF6B1A] text-white border-[#FF6B1A]'
                      : isDark
                        ? 'border-white/15 text-neutral-400 hover:text-white'
                        : 'border-black/15 text-neutral-600 hover:text-black'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-12 lg:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-3 hidden lg:flex justify-start">
              <div className="gleamy-outline-letter text-[300px] leading-none select-none">
                p
              </div>
            </div>

            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              {filteredPortfolio.map((item, idx) => (
                <div
                  key={item.id}
                  className={`group flex flex-col ${idx % 2 === 1 ? 'md:mt-10' : ''}`}
                >
                  <div
                    onClick={() => selectCaseStudyForAudit(item)}
                    className={`relative overflow-hidden border transition-all duration-500 group-hover:-translate-y-1.5 cursor-pointer ${isDark
                        ? 'bg-[#0F0F0F] border-white/10 group-hover:border-[#FF6B1A]/60'
                        : 'bg-white border-black/10 group-hover:border-[#FF6B1A]/60 shadow-lg'
                      }`}
                  >
                    <div
                      className={`px-3.5 sm:px-4 py-2.5 border-b flex items-center justify-between gap-2 text-[10px] sm:text-[11px] ${isDark ? 'border-white/10 bg-black/40' : 'border-black/10 bg-neutral-100'
                        }`}
                    >
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/70 flex-shrink-0" />
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/70 flex-shrink-0" />
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/70 flex-shrink-0" />
                        <span className="ml-1.5 sm:ml-2 font-mono opacity-60 truncate">{item.location}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#FF6B1A]/20 text-[#FF6B1A] font-bold truncate">
                        {item.metricBadge}
                      </span>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF6B1A]">
                            PROJECT RESULTS
                          </div>
                          <h4 className="text-base sm:text-lg font-extrabold mt-1">{item.title}</h4>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-[#FF6B1A] flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>

                      <p
                        className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                          }`}
                      >
                        {item.summary}
                      </p>

                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1 sm:pt-2">
                        {item.stats.map((st, sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-2.5 sm:p-3 rounded-lg border ${isDark
                                ? 'bg-white/[0.03] border-white/10'
                                : 'bg-black/[0.02] border-black/10'
                              }`}
                          >
                            <div className="text-[9px] sm:text-[10px] opacity-60 truncate">{st.label}</div>
                            <div className="text-[11px] sm:text-sm font-extrabold text-[#FF6B1A] mt-0.5">
                              {st.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-5 text-center">
                    <h3 className="text-base sm:text-xl font-medium tracking-wide">
                      {item.title}
                    </h3>
                    <div className="mt-1 sm:mt-1.5 flex items-center justify-center space-x-2 text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.18em] uppercase opacity-75">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A]" />
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="gleamy-outline-bottom text-[42px] sm:text-[95px] lg:text-[150px] leading-none whitespace-nowrap mt-10 sm:mt-14 -mb-5 sm:-mb-10 px-4">
          THE CRE8TIVE
        </div>
      </section>

      { }
      <section
        id="results"
        className={`relative py-16 sm:py-24 lg:py-36 overflow-hidden border-t ${isDark ? 'bg-[#080808] border-white/[0.06]' : 'bg-[#EFECE6] border-black/[0.06]'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 xl:pl-28 xl:pr-16 mb-6 sm:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-normal tracking-[0.14em] uppercase">
                CLIENT TESTIMONIALS
              </h2>
              <div className={`mt-2.5 sm:mt-3 w-10 sm:w-12 h-[2px] ${isDark ? 'bg-white/60' : 'bg-black/60'}`} />
            </div>
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="flex text-[#FBBC05]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FBBC05]" />
                ))}
              </div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                4.9 / 5.0 Across Local Business Partners
              </span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden py-8 sm:py-12">
          <div className={`animate-testimonials-track ${isTestimonialsPaused ? 'paused' : ''}`}>
            {[...HERO_GOOGLE_REVIEWS, ...HERO_GOOGLE_REVIEWS].map((rev, idx) => {
              const bobClass = `card-bob-${idx % 6}`;

              return (
                <div
                  key={`${rev.id}-${idx}`}
                  onMouseEnter={() => setIsTestimonialsPaused(true)}
                  onMouseLeave={() => setIsTestimonialsPaused(false)}
                  className={`flex-shrink-0 w-[285px] sm:w-[350px] lg:w-[380px] mx-2.5 sm:mx-4 cursor-pointer py-4`}
                >
                  <div
                    className={`p-5 sm:p-7 rounded-2xl border flex flex-col justify-between h-[250px] sm:h-[280px] shadow-xl transition-all duration-300 hover:border-[#FF6B1A] hover:scale-[1.02] ${bobClass} ${isDark
                        ? 'bg-[#0D0D0D] border-white/10 hover:bg-[#121212]'
                        : 'bg-white border-black/10 hover:bg-[#FAF9F5]'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex text-[#FBBC05]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#FBBC05]" />
                          ))}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded bg-[#FF6B1A]/15 text-[#FF6B1A]">
                          {rev.metric}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-neutral-300' : 'text-neutral-700'
                          }`}
                      >
                        {rev.review}
                      </p>
                    </div>

                    <div className="pt-3.5 sm:pt-4 border-t border-current/10 flex items-center space-x-3">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#FF6B1A]"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{rev.name}</div>
                        <div className="text-[10px] sm:text-[11px] opacity-60 truncate">{rev.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      { }
      <section
        id="audit"
        className={`relative py-16 sm:py-24 lg:py-36 overflow-hidden border-t ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'
          }`}
      >
        <div className="gleamy-outline-letter absolute right-4 sm:right-24 top-12 sm:top-1/2 sm:-translate-y-1/2 text-[160px] sm:text-[320px] lg:text-[400px] z-0 pointer-events-none opacity-30 sm:opacity-40">
          R
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-12 xl:pl-28 xl:pr-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <div>
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-normal tracking-[0.14em] uppercase">
                  FREE LOCAL GROWTH AUDIT
                </h2>
                <div className={`mt-2.5 sm:mt-3 w-10 sm:w-12 h-[2px] ${isDark ? 'bg-white/60' : 'bg-black/60'}`} />
              </div>

              <p
                className={`text-xs sm:text-sm lg:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
              >
                Get a free, no-pressure look at your website, local visibility, and customer journey. Leave with a clearer picture of where your next opportunity may be.
              </p>

              <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                {[
                  'A fresh set of eyes on your local presence',
                  'Clear opportunities to increase inbound calls',
                  'Zero obligation to proceed with paid services'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-xs sm:text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B1A] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <a
                  href="mailto:searchandservicegrowth@gmail.com"
                  className="group relative flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 border border-[#FF6B1A] bg-[#FF6B1A] hover:bg-[#ff5500] text-white font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-md shadow-[#FF6B1A]/20"
                >
                  <Mail className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Mail Us</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href="tel:+15552345678"
                  className={`group relative flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 border border-[#FF6B1A] bg-transparent hover:bg-[#FF6B1A] hover:text-white font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:shadow-md hover:shadow-[#FF6B1A]/20 ${isDark ? 'text-white' : 'text-[#0A0A0A]'
                    }`}
                >
                  <Phone className="w-4 h-4 text-[#FF6B1A] group-hover:text-white transition-colors duration-300 group-hover:scale-110" />
                  <span>Call Us Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6B1A] group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              <div
                className={`p-4 sm:p-5 rounded-xl border flex items-center justify-between mt-4 sm:mt-6 ${isDark ? 'bg-[#0C0C0C] border-white/10' : 'bg-white border-black/10'
                  }`}
              >
                <div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">
                    TERRITORY EXCLUSIVITY POLICY
                  </div>
                  <div className="text-[11px] sm:text-xs opacity-75 mt-1 leading-relaxed">
                    We only partner with ONE business per service category in each local zip-code
                    cluster.
                  </div>
                </div>
                <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF6B1A] flex-shrink-0 ml-3 sm:ml-4" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                className={`p-5 sm:p-8 lg:p-10 rounded-2xl border shadow-2xl relative z-10 ${isDark ? 'bg-[#0C0C0C]/95 border-white/15' : 'bg-white/95 border-black/10'
                  }`}
              >
                {!auditSubmitted ? (
                  <form ref={auditFormRef} onSubmit={handleAuditSubmit} noValidate className="space-y-3.5 sm:space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-current/10">
                      <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#FF6B1A] flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#FF6B1A]" />
                        <span>FREE GROWTH SYSTEM DIAGNOSTIC</span>
                      </span>
                      <span className="text-[10px] sm:text-[11px] opacity-60">Takes 45 Seconds</span>
                    </div>

                    {/* Honeypot field hidden from human visitors */}
                    <input
                      type="text"
                      name="company_fax_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={auditForm.company_fax_hp}
                      onChange={(e) => setAuditForm({ ...auditForm, company_fax_hp: e.target.value })}
                      className="hidden"
                      aria-hidden="true"
                    />

                    {auditError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-500 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{auditError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Business Name *
                      </label>
                      <input
                        ref={businessNameInputRef}
                        type="text"
                        placeholder="e.g. Apex HVAC & Plumbing"
                        value={auditForm.businessName}
                        onChange={(e) => handleAuditFieldChange('businessName', e.target.value)}
                        onBlur={(e) => handleAuditFieldBlur('businessName', e)}
                        className={`w-full px-4 py-2.5 text-sm border focus:outline-none transition-colors ${
                          vibratingFields.businessName ? 'input-vibrate ' : ''
                        }${
                          auditFieldErrors.businessName
                            ? 'border-red-500 bg-red-500/5 focus:border-red-500 text-red-500 dark:text-red-400'
                            : isDark
                            ? 'bg-[#050505] border-white/15 text-white focus:border-[#FF6B1A]'
                            : 'bg-[#F7F6F2] border-black/15 text-black focus:border-[#FF6B1A]'
                        }`}
                      />
                      {auditFieldErrors.businessName && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{auditFieldErrors.businessName}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Website URL</span>
                          <span className="text-[10px] font-mono text-neutral-400 font-normal">Optional</span>
                        </label>
                        <input
                          ref={websiteInputRef}
                          type="text"
                          inputMode="url"
                          autoCapitalize="none"
                          autoCorrect="off"
                          placeholder="e.g. searchandservice.com or https://..."
                          value={auditForm.website}
                          onChange={(e) => handleAuditFieldChange('website', e.target.value)}
                          onBlur={(e) => handleAuditFieldBlur('website', e)}
                          className={`w-full px-4 py-2.5 text-sm border focus:outline-none transition-colors ${
                            vibratingFields.website ? 'input-vibrate ' : ''
                          }${
                            auditFieldErrors.website
                              ? 'border-red-500 bg-red-500/5 focus:border-red-500 text-red-500 dark:text-red-400'
                              : isDark
                              ? 'bg-[#050505] border-white/15 text-white focus:border-[#FF6B1A]'
                              : 'bg-[#F7F6F2] border-black/15 text-black focus:border-[#FF6B1A]'
                          }`}
                        />
                        {auditFieldErrors.website && (
                          <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{auditFieldErrors.website}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>City / Location</span>
                          <span className="text-[10px] font-mono text-neutral-400 font-normal">Optional</span>
                        </label>
                        <input
                          ref={cityInputRef}
                          type="text"
                          placeholder="e.g. Austin, TX"
                          value={auditForm.city}
                          onChange={(e) => handleAuditFieldChange('city', e.target.value)}
                          onBlur={(e) => handleAuditFieldBlur('city', e)}
                          className={`w-full px-4 py-2.5 text-sm border focus:outline-none transition-colors ${
                            vibratingFields.city ? 'input-vibrate ' : ''
                          }${
                            auditFieldErrors.city
                              ? 'border-red-500 bg-red-500/5 focus:border-red-500 text-red-500 dark:text-red-400'
                              : isDark
                              ? 'bg-[#050505] border-white/15 text-white focus:border-[#FF6B1A]'
                              : 'bg-[#F7F6F2] border-black/15 text-black focus:border-[#FF6B1A]'
                          }`}
                        />
                        {auditFieldErrors.city && (
                          <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{auditFieldErrors.city}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Your Name *
                        </label>
                        <input
                          ref={nameInputRef}
                          type="text"
                          placeholder="Full Name"
                          value={auditForm.name}
                          onChange={(e) => handleAuditFieldChange('name', e.target.value)}
                          onBlur={(e) => handleAuditFieldBlur('name', e)}
                          className={`w-full px-4 py-2.5 text-sm border focus:outline-none transition-colors ${
                            vibratingFields.name ? 'input-vibrate ' : ''
                          }${
                            auditFieldErrors.name
                              ? 'border-red-500 bg-red-500/5 focus:border-red-500 text-red-500 dark:text-red-400'
                              : isDark
                              ? 'bg-[#050505] border-white/15 text-white focus:border-[#FF6B1A]'
                              : 'bg-[#F7F6F2] border-black/15 text-black focus:border-[#FF6B1A]'
                          }`}
                        />
                        {auditFieldErrors.name && (
                          <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{auditFieldErrors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={auditForm.phone}
                          onChange={(e) => handleAuditFieldChange('phone', e.target.value)}
                          onBlur={(e) => handleAuditFieldBlur('phone', e)}
                          className={`w-full px-4 py-2.5 text-sm border focus:outline-none transition-colors ${
                            vibratingFields.phone ? 'input-vibrate ' : ''
                          }${
                            auditFieldErrors.phone
                              ? 'border-red-500 bg-red-500/5 focus:border-red-500 text-red-500 dark:text-red-400'
                              : isDark
                              ? 'bg-[#050505] border-white/15 text-white focus:border-[#FF6B1A]'
                              : 'bg-[#F7F6F2] border-black/15 text-black focus:border-[#FF6B1A]'
                          }`}
                        />
                        {auditFieldErrors.phone && (
                          <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{auditFieldErrors.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Work Email *
                      </label>
                      <input
                        ref={workEmailInputRef}
                        type="email"
                        placeholder="owner@yourbusiness.com"
                        value={auditForm.workEmail}
                        onChange={(e) => handleAuditFieldChange('workEmail', e.target.value)}
                        onBlur={(e) => handleAuditFieldBlur('workEmail', e)}
                        className={`w-full px-4 py-2.5 text-sm border focus:outline-none transition-colors ${
                          vibratingFields.workEmail ? 'input-vibrate ' : ''
                        }${
                          auditFieldErrors.workEmail
                            ? 'border-red-500 bg-red-500/5 focus:border-red-500 text-red-500 dark:text-red-400'
                            : isDark
                            ? 'bg-[#050505] border-white/15 text-white focus:border-[#FF6B1A]'
                            : 'bg-[#F7F6F2] border-black/15 text-black focus:border-[#FF6B1A]'
                        }`}
                      />
                      {auditFieldErrors.workEmail && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{auditFieldErrors.workEmail}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Primary Bottleneck
                      </label>
                      <select
                        value={auditForm.bottleneck}
                        onChange={(e) =>
                          setAuditForm({ ...auditForm, bottleneck: e.target.value })
                        }
                        className={`w-full px-4 py-2.5 text-sm border focus:outline-none focus:border-[#FF6B1A] ${isDark
                            ? 'bg-[#050505] border-white/15 text-white'
                            : 'bg-[#F7F6F2] border-black/15 text-black'
                          }`}
                      >
                        <option value="Need More Calls & #1 Google Maps Ranking">
                          Need More Calls &amp; #1 Google Maps Ranking
                        </option>
                        <option value="Old Website Not Converting Local Visitors">
                          Old Website Not Converting Local Visitors
                        </option>
                        <option value="Missing Inbound Calls & Slow Follow-Up">
                          Missing Inbound Calls &amp; Slow Follow-Up
                        </option>
                        <option value="Need Consistent 5-Star Google Reviews">
                          Need Consistent 5-Star Google Reviews
                        </option>
                        <option value="Need Unified Multi-Location Telemetry">
                          Need Unified Multi-Location Telemetry
                        </option>
                        <option value="Custom Service Requirement">
                          Custom Service Requirement / Customized System
                        </option>
                      </select>
                    </div>

                    {auditForm.bottleneck === 'Custom Service Requirement' && (
                      <div className="pt-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                          Describe Your Custom Service Requirement
                        </label>
                        <textarea
                          ref={customMessageInputRef}
                          rows={3}
                          placeholder="Tell us about your specific service needs, custom workflow integrations, software stack, or unique operational requirements..."
                          value={auditForm.customMessage}
                          onChange={(e) =>
                            handleAuditFieldChange('customMessage', e.target.value)
                          }
                          onBlur={(e) => handleAuditFieldBlur('customMessage', e)}
                          className={`w-full px-4 py-2.5 text-sm border focus:outline-none transition-colors resize-none ${
                            vibratingFields.customMessage ? 'input-vibrate ' : ''
                          }${
                            auditFieldErrors.customMessage
                              ? 'border-red-500 bg-red-500/5 focus:border-red-500 text-red-500 dark:text-red-400'
                              : isDark
                              ? 'bg-[#050505] border-white/15 text-white placeholder-neutral-500 focus:border-[#FF6B1A]'
                              : 'bg-[#F7F6F2] border-black/15 text-black placeholder-neutral-400 focus:border-[#FF6B1A]'
                          }`}
                        />
                        {auditFieldErrors.customMessage && (
                          <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{auditFieldErrors.customMessage}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <TurnstileWidget
                      sitekey="0x4AAAAAAFYNhLoWTzQbSB6M"
                      onVerify={(token) => {
                        setAuditTurnstileToken(token);
                        setTurnstileToken(token);
                        if (typeof window.onTurnstileSuccess === 'function') {
                          window.onTurnstileSuccess(token);
                        }
                      }}
                      isDark={isDark}
                      widgetRef={auditWidgetRef}
                    />

                    <button
                      type="submit"
                      disabled={auditSubmitting}
                      className="w-full py-3.5 bg-[#FF6B1A] hover:bg-[#ff5500] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors shadow-lg shadow-[#FF6B1A]/25 flex items-center justify-center gap-2 group"
                    >
                      {auditSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Diagnostic...</span>
                        </>
                      ) : (
                        <>
                          <span>Claim Free Local Growth Diagnostic</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold">Growth Audit Request Received!</h4>
                    <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Our team is preparing your custom territory and competitor report for {auditForm.businessName}. We will email your diagnostic to {auditForm.workEmail} shortly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
        </>
      ) : currentPage === 'blog' ? (
        <BlogPage
          isDark={isDark}
          onNavigateHome={() => navigateTo('home')}
          onSelectArticle={(slug) => navigateTo('blog-post', null, slug)}
          onOpenAudit={() => navigateTo('home', 'audit')}
          onExploreServices={() => navigateTo('home', 'services')}
        />
      ) : currentPage === 'blog-post' ? (
        <BlogPostPage
          slug={currentArticleSlug}
          isDark={isDark}
          onNavigateBlog={() => navigateTo('blog')}
          onNavigatePost={(slug) => navigateTo('blog-post', null, slug)}
          onNavigateHome={() => navigateTo('home')}
          onOpenAudit={() => navigateTo('home', 'audit')}
        />
      ) : currentPage === 'case-studies' ? (
        <CaseStudiesPage
          isDark={isDark}
          onNavigateHome={() => navigateTo('home')}
          onOpenAudit={(study) => selectCaseStudyForAudit(study)}
        />
      ) : currentPage === 'privacy' ? (
        <PrivacyPolicyPage
          isDark={isDark}
          onNavigateHome={() => navigateTo('home')}
          onOpenAudit={() => navigateTo('home', 'audit')}
        />
      ) : currentPage === 'terms' ? (
        <TermsPage
          isDark={isDark}
          onNavigateHome={() => navigateTo('home')}
          onOpenAudit={() => navigateTo('home', 'audit')}
        />
      ) : currentPage === 'disclaimer' ? (
        <DisclaimerPage
          isDark={isDark}
          onNavigateHome={() => navigateTo('home')}
          onOpenAudit={() => navigateTo('home', 'audit')}
        />
      ) : null}

      {/* Footer */}
      <footer
        className={`border-t transition-colors duration-500 pt-12 sm:pt-16 pb-12 sm:pb-14 ${isDark ? 'bg-[#050505] border-white/10 text-neutral-300' : 'bg-[#ECE9E2] border-black/10 text-neutral-700'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 xl:pl-28 xl:pr-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 pb-10 sm:pb-12 border-b border-current/10">
            <div className="lg:col-span-3 space-y-4">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('hero');
                }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              >
                search<span className="text-[#FF6B1A]">&amp;</span>service
              </a>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                A premier local business growth systems partner engineering Google Maps dominance,
                high-converting web platforms, and automated speed-to-lead systems.
              </p>
              <div className="pt-1 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FF6B1A] flex-shrink-0" />
                  <a
                    href="mailto:searchandservicegrowth@gmail.com"
                    className="hover:text-[#FF6B1A] transition-colors font-medium"
                  >
                    searchandservicegrowth@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#FF6B1A] flex-shrink-0" />
                  <a
                    href="tel:+15552345678"
                    className="hover:text-[#FF6B1A] transition-colors font-medium"
                  >
                    +1 (555) 234-5678
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B1A] font-bold">
                DISCLAIMER
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                All business figures, case studies, and ROI projections shared on this site are proposed portfolio examples and illustrative scenarios, not independently verified market averages. Individual results will naturally vary based on your local market competitiveness, baseline reputation, service offerings, and team responsiveness. We do not represent them as genuine client results unless supporting records exist.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B1A] font-bold">
                PRIVACY POLICY
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                SearchandService values and safeguards your business privacy. Any business names, domains, phone numbers, or email addresses submitted via our contact and audit forms are collected solely to evaluate territory availability and prepare your customized growth diagnostic. We never sell, rent, license, or distribute your private business information to third-party brokers or advertisers.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6B1A] font-bold">
                NEWSLETTER
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                Get monthly breakdowns on Google Maps algorithm updates, local SEO playbooks, and speed-to-lead automation tactics.
              </p>

              {!newsletterSubmitted ? (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="space-y-2"
                >
                  <TurnstileWidget
                    sitekey="0x4AAAAAAFYNhLoWTzQbSB6M"
                    onVerify={(token) => {
                      setNewsletterTurnstileToken(token);
                      setTurnstileToken(token);
                      if (typeof window.onTurnstileSuccess === 'function') {
                        window.onTurnstileSuccess(token);
                      }
                    }}
                    isDark={isDark}
                    widgetRef={newsletterWidgetRef}
                  />
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className={`w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm border focus:outline-none focus:border-[#FF6B1A] transition-colors ${isDark
                          ? 'bg-[#0A0A0A] border-white/15 text-white placeholder-neutral-500'
                          : 'bg-[#F7F6F2] border-black/15 text-black placeholder-neutral-400'
                        }`}
                    />
                    <button
                      type="submit"
                      disabled={newsletterSubmitting}
                      aria-label="Subscribe to newsletter"
                      className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#FF6B1A] hover:bg-[#ff5500] disabled:opacity-60 text-white flex items-center justify-center transition-colors"
                    >
                      {newsletterSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {newsletterError && (
                    <div className="text-[11px] text-red-500 font-medium">{newsletterError}</div>
                  )}
                  <div className="text-[10px] opacity-60">No spam. Unsubscribe anytime.</div>
                </form>
              ) : (
                <div
                  className={`p-3 rounded border text-xs flex items-center gap-2 ${isDark ? 'bg-white/[0.04] border-[#FF6B1A]/40 text-[#FF6B1A]' : 'bg-white border-[#FF6B1A]/40 text-[#FF6B1A]'
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">Subscribed! Welcome aboard.</span>
                </div>
              )}

              <div className="pt-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold opacity-70 mb-2.5">
                  FOLLOW US ON
                </div>
                <div className="flex items-center gap-2.5">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                    className={`group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ${isDark
                        ? 'bg-white/[0.05] border-white/15 text-neutral-300 hover:text-white hover:border-[#FF6B1A] hover:bg-[#FF6B1A]'
                        : 'bg-black/[0.05] border-black/15 text-neutral-700 hover:text-white hover:border-[#FF6B1A] hover:bg-[#FF6B1A]'
                      }`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                    className={`group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ${isDark
                        ? 'bg-white/[0.05] border-white/15 text-neutral-300 hover:text-white hover:border-[#FF6B1A] hover:bg-[#FF6B1A]'
                        : 'bg-black/[0.05] border-black/15 text-neutral-700 hover:text-white hover:border-[#FF6B1A] hover:bg-[#FF6B1A]'
                      }`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on LinkedIn"
                    className={`group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ${isDark
                        ? 'bg-white/[0.05] border-white/15 text-neutral-300 hover:text-white hover:border-[#FF6B1A] hover:bg-[#FF6B1A]'
                        : 'bg-black/[0.05] border-black/15 text-neutral-700 hover:text-white hover:border-[#FF6B1A] hover:bg-[#FF6B1A]'
                      }`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://whatsapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className={`group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ${isDark
                        ? 'bg-white/[0.05] border-white/15 text-neutral-300 hover:text-white hover:border-[#FF6B1A] hover:bg-[#FF6B1A]'
                        : 'bg-black/[0.05] border-black/15 text-neutral-700 hover:text-white hover:border-[#FF6B1A] hover:bg-[#FF6B1A]'
                      }`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-80">
            <div>
              © {new Date().getFullYear()} SearchandService Agency LLC. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] sm:text-xs font-medium">
              <button
                onClick={() => navigateTo('disclaimer')}
                className="hover:text-[#FF6B1A] transition-colors"
              >
                Disclaimer
              </button>
              <span className="w-1 h-1 rounded-full bg-[#FF6B1A] opacity-60" />
              <button
                onClick={() => navigateTo('privacy')}
                className="hover:text-[#FF6B1A] transition-colors"
              >
                Privacy Policy
              </button>
              <span className="w-1 h-1 rounded-full bg-[#FF6B1A] opacity-60" />
              <button
                onClick={() => navigateTo('terms')}
                className="hover:text-[#FF6B1A] transition-colors"
              >
                Terms of Service
              </button>
              <span className="w-1 h-1 rounded-full bg-[#FF6B1A] opacity-60" />
              <button
                onClick={() => navigateTo('blog')}
                className="hover:text-[#FF6B1A] transition-colors"
              >
                Blog
              </button>
              <span className="w-1 h-1 rounded-full bg-[#FF6B1A] opacity-60" />
              <button
                onClick={() => navigateTo('case-studies')}
                className="hover:text-[#FF6B1A] transition-colors"
              >
                Case Studies
              </button>
            </div>

            <button
              onClick={() => {
                if (currentPage !== 'home') {
                  navigateTo('home', 'hero');
                } else {
                  scrollToSection('hero');
                }
              }}
              className="hover:text-[#FF6B1A] flex items-center gap-1.5 transition-colors font-semibold"
            >
              <span>Back to Top</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Cloudflare Pages + Functions + D1 Production Repository & ZIP Exporter Modal */}
      {deployKitOpen && (
        <div className="fixed inset-0 z-[98] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`max-w-4xl w-full max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${isDark ? 'bg-[#0D0D0D] border-white/15 text-white' : 'bg-white border-black/15 text-[#0A0A0A]'
              }`}
          >
            <div className="px-6 py-4 border-b border-current/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#FF6B1A]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B1A] font-bold">
                  CLOUDFLARE PAGES (SEARCHANDSERVICE.PAGES.DEV) + FUNCTIONS + D1 KIT
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadZip}
                  disabled={isPackagingZip}
                  className="px-4 py-2 bg-[#FF6B1A] hover:bg-[#ff5500] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#FF6B1A]/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isPackagingZip ? 'Packaging ZIP...' : 'Download Cloudflare Pages .ZIP'}</span>
                </button>
                <button
                  onClick={() => setDeployKitOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-current/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-hidden">
              <div className={`md:col-span-4 border-r border-current/10 p-4 overflow-y-auto space-y-1.5 ${isDark ? 'bg-[#080808]' : 'bg-[#F7F6F2]'}`}>
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-2">
                  CLOUDFLARE PAGES REPO FILES
                </div>
                {Object.keys(PROJECT_BUNDLE_FILES).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setActiveBundleFile(filename)}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-mono truncate transition-colors ${activeBundleFile === filename
                        ? 'bg-[#FF6B1A] text-white font-bold'
                        : 'hover:bg-current/5'
                      }`}
                  >
                    {filename}
                  </button>
                ))}
                <div className="pt-3 mt-3 border-t border-current/10 text-[11px] leading-relaxed opacity-75">
                  Click <strong>Download Cloudflare Pages .ZIP</strong> above to export the complete project configured for <code>https://searchandservice.pages.dev</code> (including <code>/functions/api/*</code> Pages Functions, D1 schema, security headers, Vitest test suite, and <code>README.md</code>). If your browser sandbox strips <code>src/App.jsx</code> during export, copy this editor file into <code>src/App.jsx</code>.
                </div>
              </div>

              <div className="md:col-span-8 flex flex-col min-h-0">
                <div className="px-4 py-2.5 border-b border-current/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#FF6B1A] font-semibold">{activeBundleFile}</span>
                  <button
                    onClick={handleCopyFileContent}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-current/15 hover:border-[#FF6B1A] text-[11px]"
                  >
                    {copiedFile ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFile ? 'Copied' : 'Copy File'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono overflow-auto flex-1 leading-relaxed select-all bg-black/95 text-neutral-200">
                  <code>{PROJECT_BUNDLE_FILES[activeBundleFile]}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      { }
      {selectedService && (
        <div className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`max-w-xl w-full rounded-2xl p-6 sm:p-8 border shadow-2xl ${isDark ? 'bg-[#0D0D0D] border-white/15 text-white' : 'bg-white border-black/15 text-black'
              }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-current/10">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B1A]">
                /{selectedService.number} • {selectedService.tag}
              </span>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 rounded-lg hover:bg-current/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold mt-4">{selectedService.title}</h3>
            <p className="mt-3 text-sm opacity-80 leading-relaxed">{selectedService.shortDesc}</p>

            <div className="mt-6">
              <div className="text-xs font-mono uppercase tracking-wider text-[#FF6B1A] mb-3">
                WHAT WE ENGINEER &amp; DEPLOY FOR YOU:
              </div>
              <div className="space-y-2.5">
                {selectedService.deliverables.map((del, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-current/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest opacity-60">
                  Expected Impact
                </div>
                <div className="text-sm font-bold text-[#FF6B1A]">{selectedService.impact}</div>
              </div>
              <button
                onClick={() => {
                  selectServiceForAudit(selectedService);
                  setSelectedService(null);
                }}
                className="px-6 py-3 bg-[#FF6B1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#ff5500]"
              >
                Deploy This System →
              </button>
            </div>
          </div>
        </div>
      )}

      { }
      {videoModalOpen && (
        <div className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full rounded-2xl p-6 sm:p-8 border shadow-2xl ${isDark ? 'bg-[#0D0D0D] border-white/15 text-white' : 'bg-white border-black/15 text-black'
              }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-current/10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF6B1A]">
                <Play className="w-4 h-4 fill-[#FF6B1A]" />
                <span>SEARCHANDSERVICE GROWTH ENGINE OVERVIEW</span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-current/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 rounded-xl p-6 bg-black text-white border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-[#FF6B1A] text-[10px] font-bold uppercase tracking-widest">
                  90-Second Architecture Reel
                </span>
                <span className="text-xs font-mono text-neutral-400">4+ Years • 250+ Clients</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold">
                How We Turn Local Businesses Into #1 Market Leaders in 60 Days
              </h4>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setVideoModalOpen(false);
                  scrollToSection('audit');
                }}
                className="px-6 py-3 bg-[#FF6B1A] text-white text-xs font-bold uppercase tracking-widest"
              >
                Book Live Screen-Share Demo →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}