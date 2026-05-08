-- ============================================================
-- Solar Konfigurator — Migration 005
-- Pipeline-Refactor: neue Lead-Statuses + lead_id in projects
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. leads.status — Constraint aktualisieren
-- ─────────────────────────────────────────────

-- Alte Constraint entfernen (Name variiert je nach Erstellungsweg)
DO $$
DECLARE cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'leads'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%status%';
  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE leads DROP CONSTRAINT %I', cname);
  END IF;
EXCEPTION WHEN others THEN NULL;
END$$;

-- Neue Constraint: Sales-Statuses (Pipeline) + Legacy (Projekte-Statuses aus alter Zeit)
ALTER TABLE leads
  ADD CONSTRAINT leads_status_check
  CHECK (status IN (
    'neu', 'kontaktiert', 'angebot', 'abschluss',
    'gewonnen', 'verloren',
    -- Legacy-Werte für bestehende Daten (rückwärtskompatibel)
    'planung', 'installation', 'abgeschlossen'
  ));

-- ─────────────────────────────────────────────
-- 2. projects — lead_id Fremdschlüssel
-- ─────────────────────────────────────────────

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS lead_id uuid references leads(id) on delete set null;

CREATE INDEX IF NOT EXISTS projects_lead_id_idx ON projects(lead_id);

-- ─────────────────────────────────────────────
-- 3. projects — RLS für INSERT (Installateur)
-- ─────────────────────────────────────────────

-- Erlaubt Installateure, Projekte anzulegen (falls Policy noch fehlt)
DO $$
BEGIN
  CREATE POLICY "Installer legt Projekt an"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = installer_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- ─────────────────────────────────────────────
-- 4. Dokumentation
-- ─────────────────────────────────────────────

COMMENT ON COLUMN leads.status IS
  'Sales-Pipeline: neu → kontaktiert → angebot → abschluss → gewonnen/verloren';
COMMENT ON COLUMN projects.lead_id IS
  'Ursprünglicher Lead aus dem Konfigurator-Wizard (falls Projekt per "Auftrag gewonnen" erstellt wurde)';
