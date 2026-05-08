-- Migration 015: Auto-Pipeline-Update bei Angebots-Annahme
-- offer_status = 'accepted' → status = 'gewonnen'

CREATE OR REPLACE FUNCTION fn_auto_pipeline_on_accept()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.offer_status = 'accepted' AND (OLD.offer_status IS DISTINCT FROM 'accepted') THEN
    NEW.status := 'gewonnen';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_pipeline_on_accept ON leads;
CREATE TRIGGER trg_auto_pipeline_on_accept
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION fn_auto_pipeline_on_accept();

-- Angebots-Ablauf: offer_valid_until Spalte ergänzen
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS offer_valid_until TIMESTAMPTZ
    GENERATED ALWAYS AS (sent_at + INTERVAL '30 days') STORED;
