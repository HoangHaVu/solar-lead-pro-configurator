-- Migration 013: Fix infinite recursion in RLS policies
-- Ursache: team_can_view_team_profiles referenziert profiles von innerhalb einer profiles-Policy
--          → infinite recursion. Lösung: SECURITY DEFINER-Funktion umgeht RLS beim Rollen-Check.

-- 1. Selbstreferenzielle Policy entfernen
DROP POLICY IF EXISTS "team_can_view_team_profiles" ON profiles;

-- 2. Rekursive Policy auf appointments entfernen und neu erstellen
DROP POLICY IF EXISTS "owner_can_view_all_appointments" ON appointments;

-- 3. SECURITY DEFINER-Funktion: Rollen-Check ohne RLS-Kontext (kein Loop möglich)
CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'owner'
  );
$$;

CREATE OR REPLACE FUNCTION is_team_member()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('installer', 'owner')
  );
$$;

-- 4. Policies neu anlegen — diesmal mit SECURITY DEFINER-Funktion statt direktem profiles-JOIN
CREATE POLICY "owner_can_view_all_appointments" ON appointments
  FOR SELECT USING (is_owner());

CREATE POLICY "owner_can_view_team_profiles" ON profiles
  FOR SELECT USING (
    role IN ('installer', 'owner')
    AND is_owner()
  );
