-- ═══════════════════════════════════════════════════════════════════
-- MIGRATION 009 — Rabatt-System
-- ═══════════════════════════════════════════════════════════════════

-- ── Teil 1: discount_codes Tabelle ──────────────────────────────────
CREATE TABLE IF NOT EXISTS discount_codes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  code        TEXT NOT NULL,
  label       TEXT,
  percentage  NUMERIC(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (created_by, code)
);

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Alle eingeloggten Nutzer dürfen Codes lesen (Filterung auf active=true erfolgt im App-Layer)
CREATE POLICY "auth_can_select_codes" ON discount_codes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "creator_can_insert_code" ON discount_codes
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "creator_can_update_code" ON discount_codes
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "creator_can_delete_code" ON discount_codes
  FOR DELETE USING (created_by = auth.uid());

-- ── Teil 2: Neue Spalten auf leads ───────────────────────────────────
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS discount_code           TEXT,
  ADD COLUMN IF NOT EXISTS discount_percentage     NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS discount_status         TEXT NOT NULL DEFAULT 'none'
    CHECK (discount_status IN ('none','code_applied','requested','approved','rejected')),
  ADD COLUMN IF NOT EXISTS final_price             NUMERIC,
  ADD COLUMN IF NOT EXISTS discount_note           TEXT,
  ADD COLUMN IF NOT EXISTS discount_requested_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS discount_resolved_at    TIMESTAMPTZ;

-- ── Teil 3: Owner darf alle Leads sehen (für Anfragen-Übersicht) ─────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leads' AND policyname = 'owner_can_select_all_leads'
  ) THEN
    CREATE POLICY "owner_can_select_all_leads" ON leads
      FOR SELECT
      USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner')
      );
  END IF;
END $$;

-- ── Teil 4: Beispiel-Codes für Test-Inhaber ───────────────────────────
INSERT INTO discount_codes (created_by, code, label, percentage)
SELECT
  p.id,
  c.code,
  c.label,
  c.pct
FROM profiles p
JOIN auth.users u ON u.id = p.id
CROSS JOIN (VALUES
  ('SOLAR5',   'Standard-Rabatt 5%',    5.00),
  ('SOLAR10',  'Treue-Rabatt 10%',     10.00),
  ('NEUKUNDE', 'Neukunden-Rabatt 8%',   8.00)
) AS c(code, label, pct)
WHERE u.email = 'inhaber@test.de'
ON CONFLICT (created_by, code) DO NOTHING;
