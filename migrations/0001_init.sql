-- Cloudflare D1 Schema for SearchandService (https://searchandservice.pages.dev)
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
