-- Beta-Anfragen Tabelle
create table if not exists public.beta_requests (
  id            uuid primary key default gen_random_uuid(),
  company_name  text not null,
  contact_name  text not null,
  email         text not null,
  phone         text,
  zip           text,
  message       text,
  created_at    timestamptz not null default now()
);

-- Jeder darf eintragen (kein Login nötig), nur Service-Role darf lesen
alter table public.beta_requests enable row level security;

create policy "Public can insert beta requests"
  on public.beta_requests for insert
  to anon, authenticated
  with check (true);
