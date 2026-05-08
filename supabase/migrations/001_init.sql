-- ============================================================
-- Solar Konfigurator — Initiale Datenbankstruktur
-- Einmalig im Supabase SQL Editor ausführen:
-- supabase.com/dashboard → Projekt → SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. PROFILES (erweitert auth.users um App-Rollen)
-- ─────────────────────────────────────────────
create table if not exists profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  role          text not null check (role in ('customer', 'installer')),
  full_name     text not null default '',
  phone         text,
  zip           text,
  is_verified   boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Eigenes Profil lesen"
  on profiles for select
  using (auth.uid() = id);

create policy "Eigenes Profil anlegen"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Eigenes Profil aktualisieren"
  on profiles for update
  using (auth.uid() = id);

-- ─────────────────────────────────────────────
-- 2. LEADS (Konfigurator-Ergebnisse vor Login)
-- ─────────────────────────────────────────────
create table if not exists leads (
  id                uuid default gen_random_uuid() primary key,
  created_at        timestamptz default now(),

  -- Kontaktdaten
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  phone             text,
  wants_zoom_call   boolean default false,

  -- Konfigurations-Kontext
  zip               text,
  roof_orientation  text,
  roof_area         integer,
  construction_year text,
  consumption       integer,
  has_e_car         boolean default false,
  has_heat_pump     boolean default false,
  has_battery       boolean default false,
  electricity_price numeric(4,2),

  -- Berechnete ROI-Werte
  kwp               numeric(5,1),
  investment        integer,
  annual_savings    integer,
  amortization      integer,
  autarky           integer,
  profit_20_years   integer
);

alter table leads enable row level security;

create policy "Jeder kann einen Lead anlegen"
  on leads for insert
  with check (true);

-- Installateure dürfen alle Leads lesen
create policy "Installateure lesen Leads"
  on leads for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'installer'
    )
  );

-- ─────────────────────────────────────────────
-- 3. PROJECTS (verknüpft Kunde ↔ Installateur)
-- ─────────────────────────────────────────────
create table if not exists projects (
  id              uuid default gen_random_uuid() primary key,
  customer_id     uuid references profiles(id) on delete set null,
  installer_id    uuid references profiles(id) on delete set null,
  status          text not null default 'angebot'
                  check (status in ('angebot', 'planung', 'genehmigung', 'installation', 'inbetrieb')),

  -- Konfigurationsdaten aus dem Wizard
  zip             text,
  kwp             numeric(5,1),
  investment      integer,
  annual_savings  integer,
  amortization    integer,
  autarky         integer,

  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table projects enable row level security;

create policy "Kunden sehen ihre Projekte"
  on projects for select
  using (auth.uid() = customer_id);

create policy "Installateure sehen ihre Projekte"
  on projects for select
  using (auth.uid() = installer_id);

-- updated_at automatisch setzen
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();
