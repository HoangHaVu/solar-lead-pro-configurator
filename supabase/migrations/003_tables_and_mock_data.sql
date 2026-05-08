-- ============================================================
-- Solar Konfigurator — Neue Tabellen + Mock-Daten
-- Einmalig im Supabase SQL Editor ausführen
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. LEADS — Status + Installateur-Zuweisung
-- ─────────────────────────────────────────────
alter table leads
  add column if not exists status text not null default 'neu'
    check (status in ('neu', 'kontaktiert', 'angebot', 'planung', 'installation', 'abgeschlossen')),
  add column if not exists installer_id uuid references profiles(id) on delete set null;

-- Installateure dürfen zugewiesene Leads aktualisieren
create policy "Installateure updaten Leads"
  on leads for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'installer'
    )
  );

-- ─────────────────────────────────────────────
-- 2. DOCUMENTS
-- ─────────────────────────────────────────────
create table if not exists documents (
  id              uuid default gen_random_uuid() primary key,
  customer_id     uuid references profiles(id) on delete cascade not null,
  project_id      uuid references projects(id) on delete set null,
  title           text not null,
  meta            text,
  type            text not null check (type in ('pdf', 'bolt', 'verified', 'premium')),
  status          text not null check (status in ('signed', 'pending', 'received')),
  status_text     text not null,
  is_downloadable boolean not null default false,
  created_at      timestamptz not null default now()
);

alter table documents enable row level security;

create policy "Kunden sehen ihre Dokumente"
  on documents for select
  using (auth.uid() = customer_id);

create policy "Installateure sehen Projektdokumente"
  on documents for select
  using (
    exists (
      select 1 from projects
      where projects.id = documents.project_id
      and projects.installer_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- 3. APPOINTMENTS (Kalender-Termine)
-- ─────────────────────────────────────────────
create table if not exists appointments (
  id           uuid default gen_random_uuid() primary key,
  installer_id uuid references profiles(id) on delete cascade not null,
  customer_id  uuid references profiles(id) on delete set null,
  project_id   uuid references projects(id) on delete set null,
  title        text not null,
  type         text not null check (type in ('beratung', 'installation', 'abnahme')),
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  location     text,
  notes        text,
  created_at   timestamptz not null default now()
);

alter table appointments enable row level security;

create policy "Installateure sehen ihre Termine"
  on appointments for select
  using (auth.uid() = installer_id);

create policy "Kunden sehen ihre Termine"
  on appointments for select
  using (auth.uid() = customer_id);

-- ─────────────────────────────────────────────
-- 4. MOCK-DATEN für Testnutzer
-- ─────────────────────────────────────────────
do $$
declare
  v_customer_id  uuid;
  v_installer_id uuid;
  v_project_id   uuid;
begin
  -- Testnutzer-IDs per E-Mail auflösen
  select id into v_customer_id  from auth.users where email = 'testkunde@test.de';
  select id into v_installer_id from auth.users where email = 'installateur@test.de';

  if v_customer_id is null or v_installer_id is null then
    raise exception 'Testnutzer nicht gefunden — zuerst den User-SQL ausführen';
  end if;

  -- ── Projekt (Kunde ↔ Installateur) ──────────
  insert into projects (id, customer_id, installer_id, status, zip, kwp, investment, annual_savings, amortization, autarky, notes)
  values (
    gen_random_uuid(),
    v_customer_id,
    v_installer_id,
    'planung',
    '22765',
    8.5,
    16500,
    1850,
    9,
    68,
    'Satteldach, Süd-West Ausrichtung, 14 Module'
  ) returning id into v_project_id;

  -- ── Dokumente (Testkunde) ────────────────────
  insert into documents (customer_id, project_id, title, meta, type, status, status_text, is_downloadable) values
  (v_customer_id, v_project_id, 'Angebot',         'PDF • 2.4 MB • 12. Okt 2023',               'pdf',     'signed',  'Unterschrieben', true),
  (v_customer_id, v_project_id, 'Netzanmeldung',   'Wird derzeit bearbeitet vom Netzbetreiber',  'bolt',    'pending', 'Ausstehend',     false),
  (v_customer_id, v_project_id, 'Abnahmeprotokoll','Erfolgt nach Abschluss der Installation',    'verified','pending', 'Ausstehend',     false),
  (v_customer_id, v_project_id, 'Garantieurkunden','ZIP • 14.5 MB • Module & Wechselrichter',    'premium', 'received','Erhalten',       true);

  -- ── Leads (Installer-Pipeline) ───────────────
  insert into leads (first_name, last_name, email, phone, zip, roof_orientation, roof_area,
                     consumption, has_e_car, has_battery, electricity_price,
                     kwp, investment, annual_savings, amortization, autarky, profit_20_years,
                     status, installer_id)
  values
  ('Familie', 'Müller',   'mueller@example.de', '+49 40 111111', '22765', 'Süd',      80,  4200, false, true,  0.30,  8.5, 16500, 1850,  9, 68, 20500, 'neu',          v_installer_id),
  ('Johannes','Schmidt',  'schmidt@example.de', '+49 40 222222', '20251', 'West',     120, 6800, true,  true,  0.30, 12.0, 22800, 2800,  8, 72, 33200, 'neu',          v_installer_id),
  ('Elena',   'Wagner',   'wagner@example.de',  '+49 40 333333', '21079', 'Süd-West', 70,  3800, false, false, 0.32,  6.8, 14200, 1620,  9, 62, 18400, 'kontaktiert',  v_installer_id),
  ('Dr. Klaus','Becker',  'becker@example.de',  '+49 40 444444', '22587', 'Süd',      150, 8200, true,  true,  0.34, 15.4, 28500, 3200,  9, 78, 35800, 'angebot',      v_installer_id),
  ('Gewerbepark','Nord',  'nord@example.de',    '+49 40 555555', '22113', 'Flach',    400, 42000,false, true,  0.28, 29.9, 45000, 5200,  9, 85, 58000, 'installation', v_installer_id),
  ('Sabine',  'Koch',     'koch@example.de',    '+49 40 666666', '22303', 'Süd',      90,  4800, false, false, 0.29,  9.8,  9800, 1100, 10, 58,  9200, 'abgeschlossen',v_installer_id);

  -- ── Termine (Installer-Kalender) ─────────────
  insert into appointments (installer_id, customer_id, project_id, title, type, starts_at, ends_at, location, notes) values
  (
    v_installer_id, v_customer_id, v_project_id,
    'Erstberatung Max Mustermann',
    'beratung',
    now() + interval '2 days' + interval '9 hours',
    now() + interval '2 days' + interval '10 hours',
    'Musterstraße 1, 22765 Hamburg',
    'Dachbesichtigung + Verbrauchsanalyse'
  ),
  (
    v_installer_id, v_customer_id, v_project_id,
    'Installation Solaranlage Mustermann',
    'installation',
    now() + interval '7 days' + interval '8 hours',
    now() + interval '7 days' + interval '17 hours',
    'Musterstraße 1, 22765 Hamburg',
    'Montage 14 Module + Fronius Wechselrichter'
  ),
  (
    v_installer_id, null, null,
    'Beratung Familie Schmidt',
    'beratung',
    now() + interval '3 days' + interval '14 hours',
    now() + interval '3 days' + interval '15 hours',
    'Eppendorfer Landstraße 32, 20251 Hamburg',
    'Kostenvoranschlag mitbringen'
  ),
  (
    v_installer_id, null, null,
    'Abnahme Sabine Koch',
    'abnahme',
    now() + interval '14 days' + interval '10 hours',
    now() + interval '14 days' + interval '11 hours',
    'Hamburger Str. 42, 22303 Hamburg',
    'Abschlussprotokoll + Übergabe Unterlagen'
  );

end;
$$;
