import { jsonResponse, resolveCorsOrigin } from '../_utils.js';

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
