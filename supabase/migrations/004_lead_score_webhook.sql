-- ============================================================
-- Solar Konfigurator — Migration 004
-- Lead-Score, Budget-Felder, Webhook-Settings, Webhook-Log
--
-- Ausführen im Supabase SQL Editor:
-- Dashboard → Projekt → SQL Editor → New Query → Run
-- ============================================================


-- ─────────────────────────────────────────────
-- 1. LEADS — Neue Spalten
-- ─────────────────────────────────────────────

-- Lead-Score (0–100, berechnet aus kWp + Investment + PLZ + Eigentümer + Speicher + Horizont)
alter table leads
  add column if not exists score integer check (score >= 0 and score <= 100);

-- Planungshorizont (sofort / 3monate / 12monate)
alter table leads
  add column if not exists planning_horizon text
    check (planning_horizon in ('sofort', '3monate', '12monate'));

-- Finanzierungsbedarf
alter table leads
  add column if not exists needs_financing boolean default false;

-- Index für Pipeline-Sortierung nach Score
create index if not exists leads_score_idx on leads (score desc);

-- Index für PLZ-Prefix-Abfragen ("X Anlagen in deiner Region")
create index if not exists leads_zip_idx on leads (zip);


-- ─────────────────────────────────────────────
-- 2. INSTALLER_WEBHOOK_SETTINGS
-- ─────────────────────────────────────────────

create table if not exists installer_webhook_settings (
  installer_id    uuid references profiles(id) on delete cascade primary key,
  webhook_url     text,
  webhook_secret  text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table installer_webhook_settings enable row level security;

-- Installateur darf nur seine eigenen Einstellungen lesen/schreiben
create policy "Installer liest eigene Webhook-Settings"
  on installer_webhook_settings for select
  using (auth.uid() = installer_id);

create policy "Installer legt Webhook-Settings an"
  on installer_webhook_settings for insert
  with check (auth.uid() = installer_id);

create policy "Installer aktualisiert Webhook-Settings"
  on installer_webhook_settings for update
  using (auth.uid() = installer_id);

create policy "Installer löscht Webhook-Settings"
  on installer_webhook_settings for delete
  using (auth.uid() = installer_id);

-- Trigger: updated_at automatisch setzen
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger installer_webhook_settings_updated_at
  before update on installer_webhook_settings
  for each row execute function set_updated_at();


-- ─────────────────────────────────────────────
-- 3. WEBHOOK_LOGS — Audit-Trail
-- ─────────────────────────────────────────────

create table if not exists webhook_logs (
  id            uuid default gen_random_uuid() primary key,
  installer_id  uuid references profiles(id) on delete set null,
  lead_id       uuid references leads(id) on delete set null,
  webhook_url   text not null,
  success       boolean not null default false,
  http_status   integer,
  payload       jsonb,
  error_message text,
  created_at    timestamptz not null default now()
);

alter table webhook_logs enable row level security;

-- Installer sieht nur seine eigenen Logs
create policy "Installer liest eigene Webhook-Logs"
  on webhook_logs for select
  using (auth.uid() = installer_id);

-- Edge Function (service_role) darf Logs schreiben
create policy "Service Role schreibt Webhook-Logs"
  on webhook_logs for insert
  with check (true);  -- service_role key umgeht RLS ohnehin

-- Index für schnelle Abfragen pro Installer
create index if not exists webhook_logs_installer_idx on webhook_logs (installer_id, created_at desc);
create index if not exists webhook_logs_lead_idx on webhook_logs (lead_id);


-- ─────────────────────────────────────────────
-- 4. KOMMENTAR-DOKUMENTATION (pg_comment)
-- ─────────────────────────────────────────────

comment on column leads.score is
  '0–100 Lead-Score: kWp (25) + Investment (20) + PLZ-Einstrahlung (25) + Eigentümer (20) + Speicher (10) + Planungshorizont (10)';
comment on column leads.planning_horizon is
  'Vom Nutzer angegebener Zeitraum bis zur Umsetzung: sofort | 3monate | 12monate';
comment on column leads.needs_financing is
  'Ob der Nutzer KfW-Finanzierung wünscht';
comment on table installer_webhook_settings is
  'Webhook-URL + Secret pro Installateur für CRM-Integration (HubSpot, Pipedrive, Zapier etc.)';
comment on table webhook_logs is
  'Audit-Trail aller Webhook-Aufrufe mit Erfolg/Fehler-Status und Payload';
