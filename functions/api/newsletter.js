import {
  jsonResponse,
  resolveCorsOrigin,
  sanitizeString,
  isValidEmail,
  hashIp,
  verifyTurnstileToken,
  sendResendEmail
} from '../_utils.js';

export async function onRequestOptions(context) {
  return jsonResponse({ ok: true }, 204, resolveCorsOrigin(context.request, context.env));
}

export async function onRequestPost(context) {
  const { request, env, waitUntil } = context;
  const origin = resolveCorsOrigin(request, env);

  try {
    const payload = await request.json();

    // Honeypot check
    if (payload.company_fax_hp) {
      return jsonResponse({ ok: true, message: 'Subscribed.' }, 200, origin);
    }

    const email = sanitizeString(payload.email, 254).toLowerCase();
    if (!email || !isValidEmail(email)) {
      return jsonResponse(
        { ok: false, error: 'Please provide a valid email address.' },
        400,
        origin
      );
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || '';

    // Optional Cloudflare Turnstile verification if TURNSTILE_SECRET_KEY is set
    const turnstileOk = await verifyTurnstileToken(
      payload.turnstileToken || payload['cf-turnstile-response'],
      clientIp,
      env?.TURNSTILE_SECRET_KEY
    );
    if (!turnstileOk) {
      return jsonResponse(
        { ok: false, error: 'Security verification failed. Please refresh and try again.' },
        403,
        origin
      );
    }

    const hasD1 = Boolean(env?.DB);
    const hasWebhook = Boolean(env?.NOTIFICATION_WEBHOOK_URL);
    const hasResend = Boolean(env?.RESEND_API_KEY);

    if (!hasD1 && !hasWebhook && !hasResend) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Newsletter backend storage is not yet bound on this Pages deployment. Bind a D1 database (DB) or configure RESEND_API_KEY / NOTIFICATION_WEBHOOK_URL.'
        },
        503,
        origin
      );
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || '';
    const ipHash = await hashIp(clientIp);

    if (hasD1) {
      const recentCount = await env.DB.prepare(
        "SELECT COUNT(*) AS cnt FROM newsletter_subscribers WHERE ip_hash = ?1 AND subscribed_at >= datetime('now', '-10 minutes')"
      )
        .bind(ipHash)
        .first();

      if (recentCount && Number(recentCount.cnt) >= 5) {
        return jsonResponse(
          { ok: false, error: 'Too many subscription attempts. Please try again shortly.' },
          429,
          origin
        );
      }

      await env.DB.prepare(
        "INSERT INTO newsletter_subscribers (email, ip_hash) VALUES (?1, ?2) ON CONFLICT(email) DO UPDATE SET subscribed_at = datetime('now')"
      )
        .bind(email, ipHash)
        .run();
    }

    if (hasWebhook) {
      const webhookTask = fetch(env.NOTIFICATION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'NEW_NEWSLETTER_SUBSCRIBER',
          source: 'https://searchandservice.pages.dev',
          email,
          subscribedAt: new Date().toISOString()
        })
      }).catch(() => {});
      if (typeof waitUntil === 'function') waitUntil(webhookTask);
      else await webhookTask;
    }

    if (hasResend) {
      const emailTask = sendResendEmail(env, {
        subject: '[Newsletter Subscriber] ' + email,
        replyTo: email,
        html: '<p>New subscriber joined the SearchandService newsletter on <strong>searchandservice.pages.dev</strong>: <strong>' + email + '</strong></p>'
      }).catch(() => {});
      if (typeof waitUntil === 'function') waitUntil(emailTask);
      else await emailTask;
    }

    return jsonResponse(
      {
        ok: true,
        message: 'Subscribed to SearchandService local growth briefings.'
      },
      201,
      origin
    );
  } catch (err) {
    return jsonResponse(
      {
        ok: false,
        error: 'Could not complete newsletter subscription. Please try again.'
      },
      500,
      origin
    );
  }
}