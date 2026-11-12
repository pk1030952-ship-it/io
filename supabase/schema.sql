-- PANKAJ JII Supabase starter schema. Review before applying.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table if not exists public.profile (
 id uuid primary key default gen_random_uuid(),
 display_name text not null default 'Pankaj Kumar',
 professional_title text not null default 'Student | Web Developer | Creative Creator',
 location text not null default 'Sasaram, Bihar',
 about_en text, about_hi text, avatar_path text, resume_path text,
 updated_at timestamptz not null default now()
);
create table if not exists public.skills (
 id uuid primary key default gen_random_uuid(), name text not null,
 category text not null default 'general', sort_order integer not null default 0,
 visible boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.projects (
 id uuid primary key default gen_random_uuid(), title text not null,
 summary_en text, summary_hi text, description_en text, description_hi text,
 category text not null default 'web', image_path text, project_url text, source_url text,
 featured boolean not null default false, published boolean not null default false,
 sort_order integer not null default 0, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.social_links (
 id uuid primary key default gen_random_uuid(), platform text not null, url text not null,
 visible boolean not null default true, sort_order integer not null default 0
);
create table if not exists public.contact_messages (
 id uuid primary key default gen_random_uuid(), name text not null, email text not null,
 subject text, message text not null,
 status text not null default 'unread' check (status in ('unread','read','archived')),
 created_at timestamptz not null default now()
);
create table if not exists public.site_events (
 id uuid primary key default gen_random_uuid(), event_name text not null,
 page_path text, project_id uuid references public.projects(id) on delete set null,
 referrer_host text, created_at timestamptz not null default now()
);

create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to anon, authenticated;

create or replace function app_private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
 select exists(select 1 from public.admin_users au where au.user_id = (select auth.uid()));
$;
revoke all on function app_private.is_admin() from public;
grant execute on function app_private.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_events enable row level security;

create policy "Admins read admin roster" on public.admin_users
for select to authenticated using (app_private.is_admin());

create policy "Public read profile" on public.profile
for select to anon, authenticated using (true);
create policy "Admins manage profile" on public.profile
for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

create policy "Public read visible skills" on public.skills
for select to anon, authenticated using (visible or app_private.is_admin());
create policy "Admins manage skills" on public.skills
for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

create policy "Public read published projects" on public.projects
for select to anon, authenticated using (published or app_private.is_admin());
create policy "Admins manage projects" on public.projects
for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

create policy "Public read visible socials" on public.social_links
for select to anon, authenticated using (visible or app_private.is_admin());
create policy "Admins manage socials" on public.social_links
for all to authenticated using (app_private.is_admin()) with check (app_private.is_admin());

create policy "Public submit contact message" on public.contact_messages
for insert to anon, authenticated with check (
 length(trim(name)) between 1 and 100
 and length(trim(email)) between 3 and 254
 and length(trim(message)) between 1 and 5000
);
create policy "Admins read messages" on public.contact_messages
for select to authenticated using (app_private.is_admin());
create policy "Admins update messages" on public.contact_messages
for update to authenticated using (app_private.is_admin()) with check (app_private.is_admin());
create policy "Admins delete messages" on public.contact_messages
for delete to authenticated using (app_private.is_admin());

create policy "Visitors record events" on public.site_events
for insert to anon, authenticated with check (
 length(event_name) <= 60
 and (page_path is null or length(page_path) <= 300)
 and (referrer_host is null or length(referrer_host) <= 200)
);
create policy "Admins read events" on public.site_events
for select to authenticated using (app_private.is_admin());
create policy "Admins delete events" on public.site_events
for delete to authenticated using (app_private.is_admin());

-- Add the first admin_users row manually in Supabase SQL Editor using a trusted auth.users UUID.
-- Never create a public INSERT policy for admin_users.
-- Configure Storage buckets/policies and edge rate limiting before production.


-- Optional analytics retention helper: private-schema, admin-only. Call with an authorized role or trusted scheduler.
create or replace function app_private.cleanup_old_site_events(retention_days integer default 90)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare deleted_count bigint;
begin
  if not app_private.is_admin() then
    raise exception 'not authorized';
  end if;
  if retention_days < 7 or retention_days > 3650 then
    raise exception 'retention_days must be between 7 and 3650';
  end if;
  delete from public.site_events where created_at < now() - make_interval(days => retention_days);
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
revoke all on function app_private.cleanup_old_site_events(integer) from public, anon;
grant execute on function app_private.cleanup_old_site_events(integer) to authenticated;
