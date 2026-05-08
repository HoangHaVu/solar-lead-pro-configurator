-- ═══════════════════════════════════════════════════════════════════
-- MIGRATION 010 — Rabatt-Regeln
-- Erweitert discount_codes um Einlöse-Bedingungen:
--   min_investment  → Mindest-Investitionssumme in EUR
--   max_uses        → Maximale Einlösungen gesamt (NULL = unbegrenzt)
--   uses_count      → Zähler (atomar inkrementiert beim Einlösen)
--   valid_until     → Ablaufdatum (NULL = kein Ablauf)
-- ═══════════════════════════════════════════════════════════════════

-- ── Teil 1: Neue Spalten auf discount_codes ──────────────────────────

ALTER TABLE discount_codes
  ADD COLUMN IF NOT EXISTS min_investment  NUMERIC        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS max_uses        INTEGER        DEFAULT NULL
    CONSTRAINT max_uses_positive CHECK (max_uses IS NULL OR max_uses > 0),
  ADD COLUMN IF NOT EXISTS uses_count      INTEGER        NOT NULL DEFAULT 0
    CONSTRAINT uses_count_non_negative CHECK (uses_count >= 0),
  ADD COLUMN IF NOT EXISTS valid_until     TIMESTAMPTZ    DEFAULT NULL;

-- ── Teil 2: Funktion zum atomaren Einlösen eines Codes ───────────────
-- Gibt TRUE zurück wenn erfolgreich, FALSE wenn eine Regel verletzt ist.
-- Wird aus dem App-Layer via rpc() aufgerufen.
--
-- Prüft in dieser Reihenfolge:
--   1. Code existiert und gehört zum Installateur
--   2. active = true
--   3. valid_until noch nicht überschritten
--   4. min_investment erfüllt (p_investment >= min_investment)
--   5. max_uses noch nicht erreicht (uses_count < max_uses)
-- Bei Erfolg: uses_count++ und gibt discount_percentage zurück.

CREATE OR REPLACE FUNCTION redeem_discount_code(
  p_installer_id  UUID,
  p_code          TEXT,
  p_investment    NUMERIC
)
RETURNS TABLE (
  success      BOOLEAN,
  percentage   NUMERIC,
  reason       TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_row discount_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM discount_codes
  WHERE created_by = p_installer_id
    AND code       = p_code;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::NUMERIC, 'Code nicht gefunden'::TEXT;
    RETURN;
  END IF;

  IF NOT v_row.active THEN
    RETURN QUERY SELECT FALSE, NULL::NUMERIC, 'Code ist deaktiviert'::TEXT;
    RETURN;
  END IF;

  IF v_row.valid_until IS NOT NULL AND v_row.valid_until < NOW() THEN
    RETURN QUERY SELECT FALSE, NULL::NUMERIC, 'Code ist abgelaufen'::TEXT;
    RETURN;
  END IF;

  IF v_row.min_investment IS NOT NULL AND p_investment < v_row.min_investment THEN
    RETURN QUERY SELECT FALSE, NULL::NUMERIC,
      format('Mindest-Investitionssumme von %s € nicht erreicht', v_row.min_investment)::TEXT;
    RETURN;
  END IF;

  IF v_row.max_uses IS NOT NULL AND v_row.uses_count >= v_row.max_uses THEN
    RETURN QUERY SELECT FALSE, NULL::NUMERIC, 'Maximale Einlösungen erreicht'::TEXT;
    RETURN;
  END IF;

  -- Atomar inkrementieren — verhindert Race Conditions
  UPDATE discount_codes
  SET uses_count = uses_count + 1
  WHERE id = v_row.id;

  RETURN QUERY SELECT TRUE, v_row.percentage, 'OK'::TEXT;
END;
$$;

-- Nur eingeloggte Nutzer dürfen die Funktion aufrufen
REVOKE ALL ON FUNCTION redeem_discount_code(UUID, TEXT, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION redeem_discount_code(UUID, TEXT, NUMERIC) TO authenticated;

-- ── Teil 3: Dokumentation ─────────────────────────────────────────────

COMMENT ON COLUMN discount_codes.min_investment IS
  'Optionale Mindest-Investitionssumme in EUR — Code nur einlösbar wenn lead.investment >= min_investment';
COMMENT ON COLUMN discount_codes.max_uses IS
  'Maximale Gesamtanzahl von Einlösungen (NULL = unbegrenzt)';
COMMENT ON COLUMN discount_codes.uses_count IS
  'Aktueller Zähler der Einlösungen — wird atomar via redeem_discount_code() inkrementiert';
COMMENT ON COLUMN discount_codes.valid_until IS
  'Ablaufdatum des Codes (NULL = kein Ablauf)';
COMMENT ON FUNCTION redeem_discount_code IS
  'Prüft alle Regeln eines Rabattcodes atomar und inkrementiert uses_count bei Erfolg. Gibt {success, percentage, reason} zurück.';
