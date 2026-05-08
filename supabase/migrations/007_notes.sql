-- 007_notes.sql — Interne Installer-Notizen pro Lead oder Projekt

create table public.notes (
  id           uuid        primary key default gen_random_uuid(),
  installer_id uuid        not null references auth.users(id) on delete cascade,
  lead_id      uuid        references public.leads(id) on delete cascade,
  project_id   uuid        references public.projects(id) on delete cascade,
  content      text        not null check (char_length(content) > 0),
  created_at   timestamptz not null default now(),
  constraint notes_has_exactly_one_target check (
    (lead_id is not null and project_id is null) or
    (lead_id is null and project_id is not null)
  )
);

alter table public.notes enable row level security;

create policy "installers_manage_own_notes" on public.notes
  for all
  using  (installer_id = auth.uid())
  with check (installer_id = auth.uid());

create index notes_lead_id_idx    on public.notes (lead_id)    where lead_id    is not null;
create index notes_project_id_idx on public.notes (project_id) where project_id is not null;
create index notes_installer_idx  on public.notes (installer_id, created_at desc);
