-- Migration 012: Team-Kalender für Inhaber
-- Inhaber sieht alle Termine des Teams + alle Installer-Profile (für Filter-Chips)

-- 1. Inhaber kann alle Termine sehen
CREATE POLICY "owner_can_view_all_appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- 2. Installer und Owner können alle Installer/Owner-Profile sehen
--    (Installer-Namen für Team-Filter-Chips und Termin-Detail-Modal)
CREATE POLICY "team_can_view_team_profiles" ON profiles
  FOR SELECT USING (
    role IN ('installer', 'owner')
    AND EXISTS (
      SELECT 1 FROM profiles me
      WHERE me.id = auth.uid() AND me.role IN ('installer', 'owner')
    )
  );
