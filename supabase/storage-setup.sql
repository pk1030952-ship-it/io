-- Run once in Supabase SQL Editor for PANKAJ JII file uploads.
-- Uses the existing public.is_admin() helper and admin_users roster.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  8388608,
  array['application/pdf','image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read portfolio assets" on storage.objects;
create policy "Public read portfolio assets"
on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio-assets');

drop policy if exists "Admins upload portfolio assets" on storage.objects;
create policy "Admins upload portfolio assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-assets' and public.is_admin());

drop policy if exists "Admins update portfolio assets" on storage.objects;
create policy "Admins update portfolio assets"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-assets' and public.is_admin())
with check (bucket_id = 'portfolio-assets' and public.is_admin());

drop policy if exists "Admins delete portfolio assets" on storage.objects;
create policy "Admins delete portfolio assets"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-assets' and public.is_admin());
