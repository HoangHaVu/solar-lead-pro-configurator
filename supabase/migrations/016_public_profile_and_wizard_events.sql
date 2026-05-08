-- Migration 016: wizard_events table + public installer profile RPC

-- Wizard drop-off tracking table (fire-and-forget from frontend)
CREATE TABLE IF NOT EXISTS wizard_events (
  id          BIGSERIAL PRIMARY KEY,
  session_id  TEXT NOT NULL,
  event       TEXT NOT NULL CHECK (event IN ('step_entered', 'abandoned')),
  step        INT  NOT NULL,
  zip         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE wizard_events ENABLE ROW LEVEL SECURITY;

-- Anon darf eintragen (kein PII, nur Step + PLZ)
CREATE POLICY "wizard_events_insert_anon"
  ON wizard_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Nur Installer/Owner dürfen lesen (für Stats-Dashboard)
CREATE POLICY "wizard_events_select_installer"
  ON wizard_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('installer', 'owner')
    )
  );

-- Index für Aggregations-Abfragen
CREATE INDEX IF NOT EXISTS idx_wizard_events_step ON wizard_events (step, event);

-- ────────────────────────────────────────────────────────────────────
-- Öffentliche Installer-Profilfelder
-- ────────────────────────────────────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS website      TEXT,
  ADD COLUMN IF NOT EXISTS bio          TEXT;

-- ────────────────────────────────────────────────────────────────────
-- SECURITY DEFINER RPC — umgeht RLS um öffentliche Profil-Daten
-- ohne PII-Leak zu liefern (kein Hash, kein Token, nur explizite Felder)
-- ────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_installer_public_profile(installer_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'id',           p.id,
    'full_name',    p.full_name,
    'company_name', p.company_name,
    'website',      p.website,
    'bio',          p.bio,
    'zip',          p.zip,
    'phone',        p.phone,
    'is_verified',  COALESCE(p.is_verified, false),
    'email',        u.email
  )
  INTO result
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE p.id = installer_uuid
    AND p.role IN ('installer', 'owner');

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_installer_public_profile(UUID) TO anon, authenticated;
