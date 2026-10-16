import {
  jsonResponse,
  resolveCorsOrigin,
  sanitizeString,
  isValidEmail,
  isValidUrl,
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

    // 1. Honeypot spam protection
    if (payload.company_fax_hp) {
      return jsonResponse({ ok: true, message: 'Audit request processed.' }, 200, origin);
    }

    // 2. Sanitize & validate fields
    const businessName = sanitizeString(payload.businessName, 140);
    const website = sanitizeString(payload.website, 250);
    const city = sanitizeString(payload.city, 120);
    const bottleneck =
      sanitizeString(payload.bottleneck, 180) || 'Need More Calls & #1 Google Maps Ranking';
    const name = sanitizeString(payload.name, 120);
    const phone = sanitizeString(payload.phone, 40);
    const workEmail = sanitizeString(payload.workEmail, 254).toLowerCase();

    if (!businessName || !website || !city || !name || !phone || !workEmail) {
      return jsonResponse(
        { ok: false, error: 'Please complete all required fields.' },
        400,
        origin
      );
    }

    if (!isValidEmail(workEmail)) {
      return jsonResponse(
        { ok: false, error: 'Please enter a valid work email address.' },
        400,
        origin
      );
    }

    if (!isValidUrl(website)) {
      return jsonResponse(
        { ok: false, error: 'Please enter a valid website URL starting with https:// or http://.' },
        400,
        origin
      );
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || '';

    // 3. Optional Cloudflare Turnstile verification if TURNSTILE_SECRET_KEY is set
    const turnstileOk = await verifyTurnstileToken(
      payload.turnstileToken,
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

    // 4. Verify at least one real backend persistence or notification binding is active
    const hasD1 = Boolean(env?.DB);
    const hasWebhook = Boolean(env?.NOTIFICATION_WEBHOOK_URL);
    const hasResend = Boolean(env?.RESEND_API_KEY);

    if (!hasD1 && !hasWebhook && !hasResend) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Backend storage is not yet bound on this Pages deployment. Bind a D1 database (DB) or configure RESEND_API_KEY / NOTIFICATION_WEBHOOK_URL in Cloudflare Pages Settings.'
        },
        503,
        origin
      );
    }

    const ipHash = await hashIp(clientIp);
    const userAgent = sanitizeString(request.headers.get('User-Agent') || '', 250);

    // 5. Rate-limit check & insert in Cloudflare D1 if bound
    if (hasD1) {
      const recentCount = await env.DB.prepare(
        "SELECT COUNT(*) AS cnt FROM audit_leads WHERE ip_hash = ?1 AND created_at >= datetime('now', '-10 minutes')"
      )
        .bind(ipHash)
        .first();

      if (recentCount && Number(recentCount.cnt) >= 5) {
        return jsonResponse(
          { ok: false, error: 'Too many requests from your network. Please try again in a few minutes.' },
          429,
          origin
        );
      }

      await env.DB.prepare(
        'INSERT INTO audit_leads (business_name, website, city, bottleneck, name, phone, work_email, ip_hash, user_agent) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)'
      )
        .bind(businessName, website, city, bottleneck, name, phone, workEmail, ipHash, userAgent)
        .run();
    }

    // 6. Optional asynchronous webhook dispatch
    if (hasWebhook) {
      const webhookTask = fetch(env.NOTIFICATION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'NEW_GROWTH_AUDIT_LEAD',
          source: 'https://searchandservice.pages.dev',
          businessName,
          website,
          city,
          bottleneck,
          name,
          phone,
          workEmail,
          submittedAt: new Date().toISOString()
        })
      }).catch(() => {});
      if (typeof waitUntil === 'function') waitUntil(webhookTask);
      else await webhookTask;
    }

    // 7. Optional Resend transactional email alert
    if (hasResend) {
      const emailTask = sendResendEmail(env, {
        subject: '[New Growth Audit Lead] ' + businessName + ' (' + city + ')',
        replyTo: workEmail,
        html:
          '<h2>New Local Growth Audit Request</h2>' +
          '<p><strong>Business:</strong> ' + businessName + '</p>' +
          '<p><strong>Website:</strong> <a href="' + website + '">' + website + '</a></p>' +
          '<p><strong>City / Territory:</strong> ' + city + '</p>' +
          '<p><strong>Primary Bottleneck:</strong> ' + bottleneck + '</p>' +
          '<hr />' +
          '<p><strong>Contact Name:</strong> ' + name + '</p>' +
          '<p><strong>Phone:</strong> ' + phone + '</p>' +
          '<p><strong>Work Email:</strong> <a href="mailto:' + workEmail + '">' + workEmail + '</a></p>'
      }).catch(() => {});
      if (typeof waitUntil === 'function') waitUntil(emailTask);
      else await emailTask;
    }

    return jsonResponse(
      {
        ok: true,
        message: 'Growth audit diagnostic request saved.',
        lead: { businessName, workEmail }
      },
      201,
      origin
    );
  } catch (err) {
    return jsonResponse(
      {
        ok: false,
        error: 'Unable to process your audit request right now. Please try again.'
      },
      500,
      origin
    );
  }
}