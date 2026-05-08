-- ============================================================
-- Solar Konfigurator — Migration 008
-- Offer-Status + Zahlungsstatus in Leads + Owner-Rolle
--
-- Reihenfolge:
--   1. Schema-Änderungen (Constraints, Spalten, RLS)
--   2. Test-Owner-User anlegen (direkt in auth.users)
--   3. Mock-Daten für den Master-Account
-- ============================================================


-- ─────────────────────────────────────────────
-- 1a. PROFILES — 'owner' Rolle zum Constraint hinzufügen
--     (MUSS VOR User-Erstellung laufen, sonst schlägt Trigger fehl)
-- ─────────────────────────────────────────────

DO $$
DECLARE cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'profiles'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%role%';
  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT %I', cname);
  END IF;
EXCEPTION WHEN others THEN NULL;
END$$;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'installer', 'owner'));


-- ─────────────────────────────────────────────
-- 1b. LEADS — offer_status Spalten
-- ─────────────────────────────────────────────

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS offer_status TEXT NOT NULL DEFAULT 'created'
  CHECK (offer_status IN ('created', 'sent', 'viewed', 'accepted', 'rejected'));

ALTER TABLE leads ADD COLUMN IF NOT EXISTS offer_sent_at   TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS offer_viewed_at TIMESTAMPTZ;


-- ─────────────────────────────────────────────
-- 1c. LEADS — Zahlungsstatus (VOB 30/60/10 Modell)
-- ─────────────────────────────────────────────

ALTER TABLE leads ADD COLUMN IF NOT EXISTS payment_1_paid BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS payment_2_paid BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS payment_3_paid BOOLEAN NOT NULL DEFAULT FALSE;


-- ─────────────────────────────────────────────
-- 1d. RLS — Policies für 'owner' erweitern
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "Installateure lesen Leads"         ON leads;
DROP POLICY IF EXISTS "Installer und Owner lesen Leads"   ON leads;
CREATE POLICY "Installer und Owner lesen Leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('installer', 'owner')
    )
  );

DROP POLICY IF EXISTS "Installateure updaten Leads"       ON leads;
DROP POLICY IF EXISTS "Installer und Owner updaten Leads" ON leads;
CREATE POLICY "Installer und Owner updaten Leads"
  ON leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('installer', 'owner')
    )
  );


-- ─────────────────────────────────────────────
-- 2. Test-Master-Account in auth.users anlegen
--    (idempotent — wird übersprungen wenn Email bereits existiert)
-- ─────────────────────────────────────────────

DO $$
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'inhaber@test.de',
    crypt('Test123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"owner","full_name":"Muster Solar GmbH","zip":"80333"}'::jsonb,
    NOW(),
    NOW(),
    '', '', '', ''
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'inhaber@test.de'
  );
END;
$$;


-- ─────────────────────────────────────────────
-- 3. Mock-Daten für den Master-Account
-- ─────────────────────────────────────────────

DO $$
DECLARE
  v_owner_id UUID;
BEGIN
  SELECT id INTO v_owner_id FROM auth.users WHERE email = 'inhaber@test.de';

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Owner-User nicht gefunden — Schritt 2 hat nicht funktioniert';
  END IF;

  -- Profile absichern (Trigger legt es beim INSERT in auth.users an,
  -- aber ON CONFLICT korrigiert die Rolle falls nötig)
  INSERT INTO profiles (id, role, full_name, phone, zip, is_verified)
  VALUES (v_owner_id, 'owner', 'Muster Solar GmbH', '+49 89 123456', '80333', TRUE)
  ON CONFLICT (id) DO UPDATE
    SET role      = 'owner',
        full_name = 'Muster Solar GmbH',
        phone     = '+49 89 123456',
        zip       = '80333';

  -- Leads: 10 Einträge, voller Funnel mit realistischen Timestamps
  INSERT INTO leads (
    created_at,
    first_name, last_name, email, phone, zip,
    roof_orientation, roof_area, consumption,
    has_e_car, has_battery, electricity_price,
    kwp, investment, annual_savings, amortization, autarky, profit_20_years,
    status, installer_id, score, planning_horizon, needs_financing,
    offer_status, offer_sent_at, offer_viewed_at,
    payment_1_paid, payment_2_paid, payment_3_paid
  ) VALUES

  -- ── NEU ────────────────────────────────────────────────────────────
  (NOW() - INTERVAL '45 minutes',
   'Familie',   'Huber',     'huber@muster.de',     '+49 89 100001', '80333',
   'Süd',      90,  4500, FALSE, TRUE,  0.31,
    9.8, 18500, 2100,  9, 71, 25200,
   'neu',          v_owner_id, 65, 'sofort',  FALSE,
   'created', NULL, NULL,
   FALSE, FALSE, FALSE),

  (NOW() - INTERVAL '30 hours',
   'Michael',   'Braun',     'braun@muster.de',     '+49 89 100002', '80336',
   'West',      75,  3800, FALSE, FALSE, 0.30,
    6.2, 12800, 1480,  9, 58, 18400,
   'neu',          v_owner_id, 42, '3monate', FALSE,
   'created', NULL, NULL,
   FALSE, FALSE, FALSE),

  -- ── KONTAKTIERT ────────────────────────────────────────────────────
  (NOW() - INTERVAL '3 days',
   'Petra',     'Hofmann',   'hofmann@muster.de',   '+49 89 100003', '80803',
   'Süd-West', 110,  5200, TRUE,  TRUE,  0.33,
   12.4, 23200, 2680,  9, 75, 31600,
   'kontaktiert',  v_owner_id, 78, 'sofort',  TRUE,
   'created', NULL, NULL,
   FALSE, FALSE, FALSE),

  (NOW() - INTERVAL '5 days',
   'Stefan',    'Richter',   'richter@muster.de',   '+49 89 100004', '86150',
   'Süd',       80,  4100, FALSE, FALSE, 0.29,
    7.6, 14900, 1720, 10, 62, 19800,
   'kontaktiert',  v_owner_id, 55, '3monate', FALSE,
   'created', NULL, NULL,
   FALSE, FALSE, FALSE),

  -- ── ANGEBOT ────────────────────────────────────────────────────────
  (NOW() - INTERVAL '40 days',
   'Dr. Andrea','Wolf',      'wolf@muster.de',      '+49 89 100005', '81667',
   'Süd',      145,  7800, TRUE,  TRUE,  0.34,
   16.8, 31500, 3640,  9, 80, 41200,
   'angebot',      v_owner_id, 85, 'sofort',  TRUE,
   'sent',    NOW() - INTERVAL '38 days', NULL,
   FALSE, FALSE, FALSE),

  (NOW() - INTERVAL '30 days',
   'Gewerbe',   'GmbH Nord', 'gmbh.nord@muster.de', '+49 89 100006', '85049',
   'Flach',    420, 48000, FALSE, TRUE,  0.27,
   48.0, 72000, 7200,  9, 88, 88000,
   'angebot',      v_owner_id, 92, 'sofort',  FALSE,
   'viewed',  NOW() - INTERVAL '28 days', NOW() - INTERVAL '25 days',
   FALSE, FALSE, FALSE),

  (NOW() - INTERVAL '50 days',
   'Christine', 'Maier',     'maier@muster.de',     '+49 89 100007', '80337',
   'Süd-West', 100,  5600, FALSE, TRUE,  0.32,
   10.2, 19500, 2280,  9, 72, 27400,
   'angebot',      v_owner_id, 74, 'sofort',  TRUE,
   'accepted', NOW() - INTERVAL '48 days', NOW() - INTERVAL '47 days',
   TRUE, FALSE, FALSE),

  -- ── GEWONNEN / ABSCHLUSS ───────────────────────────────────────────
  (NOW() - INTERVAL '65 days',
   'Roland',    'Zimmermann','zimmermann@muster.de', '+49 89 100008', '83022',
   'Süd',       95,  4900, FALSE, FALSE, 0.30,
    8.4, 16200, 1880, 10, 65, 22200,
   'gewonnen',     v_owner_id, 68, 'sofort',  FALSE,
   'accepted', NOW() - INTERVAL '62 days', NOW() - INTERVAL '61 days',
   TRUE, TRUE, TRUE),

  (NOW() - INTERVAL '75 days',
   'Familie',   'Berger',    'berger@muster.de',    '+49 89 100009', '82256',
   'Süd',      120,  6200, TRUE,  TRUE,  0.32,
   11.6, 21800, 2520,  9, 73, 29800,
   'abschluss',    v_owner_id, 77, '3monate', TRUE,
   'accepted', NOW() - INTERVAL '72 days', NOW() - INTERVAL '71 days',
   TRUE, TRUE, FALSE),

  (NOW() - INTERVAL '90 days',
   'Bauträger', 'Südost AG', 'suemost@muster.de',   '+49 89 100010', '81735',
   'Flach',    850, 95000, FALSE, TRUE,  0.26,
   85.0, 128000, 9800, 12, 90, 128000,
   'gewonnen',     v_owner_id, 95, 'sofort',  FALSE,
   'accepted', NOW() - INTERVAL '85 days', NOW() - INTERVAL '83 days',
   TRUE, TRUE, TRUE);

END;
$$;


-- ─────────────────────────────────────────────
-- Dokumentation
-- ─────────────────────────────────────────────

COMMENT ON COLUMN leads.offer_status IS
  'Angebotsversand-Status: created → sent → viewed → accepted/rejected';
COMMENT ON COLUMN leads.offer_sent_at IS
  'Zeitpunkt an dem das Angebot per E-Mail versendet wurde';
COMMENT ON COLUMN leads.offer_viewed_at IS
  'Zeitpunkt an dem der Kunde das Angebot zum ersten Mal geöffnet hat';
COMMENT ON COLUMN leads.payment_1_paid IS
  'Abschlagsrechnung 1/3 (30% Anzahlung) erhalten';
COMMENT ON COLUMN leads.payment_2_paid IS
  'Abschlagsrechnung 2/3 (60% Montage) erhalten';
COMMENT ON COLUMN leads.payment_3_paid IS
  'Schlussrechnung 3/3 (10% Abnahme) erhalten';
