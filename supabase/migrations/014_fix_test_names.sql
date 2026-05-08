-- Migration 014: Realistischere Testnamen für Demo
-- "Muster Solar GmbH" als Mitarbeitername macht keinen Sinn — Installer bekommen Personennamen

UPDATE profiles
SET full_name = 'Test Mitarbeiter'
WHERE id = (SELECT id FROM auth.users WHERE email = 'muster@solar.de');
