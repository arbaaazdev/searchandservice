import { describe, it, expect } from 'vitest';
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
