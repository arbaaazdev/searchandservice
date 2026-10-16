/**
 * Shared validation, security headers, rate-limiting, and notification helpers
 * for Cloudflare Pages Functions (/functions/api/*)
 */

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

export function resolveCorsOrigin(request, env) {
  const configured = env?.ALLOWED_ORIGIN || 'https://searchandservice.pages.dev';
  const reqOrigin = request.headers.get('Origin') || '';
  if (
    reqOrigin === configured ||
    reqOrigin.endsWith('.searchandservice.pages.dev') ||
    (env?.ENVIRONMENT !== 'production' && (reqOrigin.startsWith('http://localhost:') || reqOrigin.startsWith('http://127.0.0.1:')))
  ) {
    return reqOrigin;
  }
  return configured;
}

export function jsonResponse(body, status = 200, origin = 'https://searchandservice.pages.dev') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...SECURITY_HEADERS
    }
  });
}

export function sanitizeString(value, maxLen = 250) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[<>]/g, '').slice(0, maxLen);
}

export function csvSafe(value) {
  const s = String(value ?? '');
  return /^[\s\u0000-\u001F]*[=+\-@\uFF1D\uFF0B\uFF0D\uFF20]/.test(s) ? "'" + s : s;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export async function hashIp(ip) {
  if (!ip) return 'unknown';
  const data = new TextEncoder().encode(ip + '-searchandservice-pages-salt');
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyTurnstileToken(token, ip, secretKey) {
  if (!secretKey) return true;
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: ip || ''
      })
    });
    const outcome = await res.json();
    return Boolean(outcome.success);
  } catch {
    return false;
  }
}

export async function sendResendEmail(env, { subject, html, replyTo }) {
  if (!env?.RESEND_API_KEY) return false;
  const toEmail = env.NOTIFICATION_TO_EMAIL || 'searchandservicegrowth@gmail.com';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'SearchandService Growth Engine <onboarding@resend.dev>',
      to: [toEmail],
      reply_to: replyTo || toEmail,
      subject,
      html
    })
  });
  return res.ok;
}