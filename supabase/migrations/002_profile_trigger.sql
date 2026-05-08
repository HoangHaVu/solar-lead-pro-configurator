-- ============================================================
-- Trigger: Profil automatisch beim SignUp anlegen
-- Rolle + Name werden als user_metadata übergeben
-- → Einmalig im Supabase SQL Editor ausführen
-- ============================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, role, full_name, zip, is_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'zip',
    -- Installateure brauchen manuelle Verifizierung
    (coalesce(new.raw_user_meta_data->>'role', 'customer') != 'installer')
  );
  return new;
end;
$$;

-- Trigger feuert nach jedem INSERT in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
