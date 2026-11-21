-- ============================================================================
--  IPSA ORBIT 2.0  -  Study Materials portal  -  Supabase setup
--  Supabase Dashboard -> SQL Editor -> New query -> paste all of this -> Run.
--  Safe to run again (it will not duplicate anything).
-- ============================================================================

-- 1) Metadata table ----------------------------------------------------------
create table if not exists public.study_materials (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (char_length(title) between 1 and 200),
  description    text check (description is null or char_length(description) <= 2000),
  subject        text not null check (char_length(subject) between 1 and 120),
  semester       smallint not null check (semester between 1 and 8),
  branch         text not null check (char_length(branch) between 1 and 80),
  file_path      text not null unique,          -- path inside the storage bucket
  file_name      text not null,                 -- original file name shown to people
  file_ext       text not null,
  file_size      bigint not null default 0,
  mime_type      text,
  is_published   boolean not null default true,
  uploaded_by    text,
  download_count integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists study_materials_browse_idx
  on public.study_materials (semester, branch, subject);
create index if not exists study_materials_recent_idx
  on public.study_materials (created_at desc);

-- 2) Row Level Security ------------------------------------------------------
-- Signed-in students may only READ published rows. There is deliberately no
-- insert / update / delete policy: nobody using the public (anon) key can write.
-- All writes go through the app's server routes, which check the admin login
-- first and then use the secret service-role key (which bypasses RLS).
alter table public.study_materials enable row level security;

drop policy if exists "Signed-in users read published materials" on public.study_materials;
create policy "Signed-in users read published materials"
  on public.study_materials
  for select
  to authenticated
  using (is_published = true);

revoke all on public.study_materials from anon;
revoke insert, update, delete on public.study_materials from authenticated;
grant select on public.study_materials to authenticated;

-- 3) Private storage bucket --------------------------------------------------
-- public = false  ->  files can NOT be opened from a plain link. The app hands
-- out short-lived signed links only to signed-in students / admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'study-materials',
  'study-materials',
  false,
  52428800,   -- 50 MB per file
  array[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- No policies are created on storage.objects for this bucket, so the public key
-- cannot list, read, upload or delete anything in it. Uploads use one-time
-- signed upload tokens created by the server after the admin check.

-- 4) Atomic download counter (used by the server only) ------------------------
create or replace function public.bump_material_downloads(material_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.study_materials
     set download_count = download_count + 1
   where id = material_id;
$$;

revoke all on function public.bump_material_downloads(uuid) from public, anon, authenticated;
grant execute on function public.bump_material_downloads(uuid) to service_role;

-- 5) Keep updated_at fresh ----------------------------------------------------
create or replace function public.touch_study_materials()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists study_materials_touch on public.study_materials;
create trigger study_materials_touch
  before update on public.study_materials
  for each row execute function public.touch_study_materials();
