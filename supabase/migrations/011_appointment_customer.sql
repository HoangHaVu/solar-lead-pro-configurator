-- Migration 011: Kundenzuordnung für Termine
-- Fügt optionale Kundenfelder zur appointments-Tabelle hinzu.
-- lead_id verlinkt auf einen bestehenden Lead (für spätere Navigation).
-- customer_name/phone/email speichern einen Snapshot der Kontaktdaten.

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS lead_id       UUID REFERENCES leads(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS customer_name  TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- Kunden können Termine lesen, bei denen ihr Lead verlinkt ist
CREATE POLICY "customers_read_linked_appointments" ON appointments
  FOR SELECT USING (
    lead_id IN (
      SELECT lead_id FROM projects
      WHERE customer_id = auth.uid()
        AND lead_id IS NOT NULL
    )
  );
