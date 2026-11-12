-- PANKAJ JII: robust public contact submission via an Edge Function.
-- Edge Function submit-contact v1 must be deployed before this script is applied.
-- Service-role-only RPC. Public visitors must never invoke this database function directly.

create table if not exists public.contact_submission_limits (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null check (fingerprint ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);
create index if not exists contact_limits_fingerprint_created_idx
  on public.contact_submission_limits(fingerprint, created_at desc);
create index if not exists contact_limits_created_idx
  on public.contact_submission_limits(created_at);
alter table public.contact_submission_limits enable row level security;
revoke all on public.contact_submission_limits from public, anon, authenticated;
grant select, insert, delete on public.contact_submission_limits to service_role;

create or replace function public.submit_portfolio_contact(
  p_name text, p_email text, p_subject text, p_message text, p_fingerprint text
)
returns uuid
language plpgsql security invoker
set search_path = ''
as $function$
declare
  v_now timestamptz := now();
  v_result uuid;
begin
  if current_user <> 'service_role' then
    raise exception 'contact_access_denied';
  end if;
  if p_fingerprint is null or p_fingerprint !~ '^[0-9a-f]{64}$'
    or length(btrim(coalesce(p_name, ''))) not between 1 and 100
    or length(btrim(coalesce(p_email, ''))) not between 3 and 254
    or btrim(coalesce(p_email, '')) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or length(btrim(coalesce(p_message, ''))) not between 5 and 5000
    or length(coalesce(p_subject, '')) > 180 then
    raise exception 'contact_invalid_input';
  end if;

  -- Serialize requests sharing one fingerprint, even across function isolates.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_fingerprint, 0));

  if exists (
      select 1 from public.contact_submission_limits
      where fingerprint = p_fingerprint and created_at > v_now - interval '90 seconds'
    ) or (
      select count(*) from public.contact_submission_limits
      where fingerprint = p_fingerprint and created_at > v_now - interval '24 hours'
    ) >= 5 then
    raise exception 'contact_rate_limited';
  end if;

  insert into public.contact_messages(name, email, subject, message)
  values (
    btrim(p_name), btrim(p_email), nullif(btrim(coalesce(p_subject, '')), ''),
    btrim(p_message)
  ) returning id into v_result;

  insert into public.contact_submission_limits(fingerprint)
  values (p_fingerprint);

  -- Keep only short-lived, keyed fingerprints; do not retain raw IP addresses.
  delete from public.contact_submission_limits
  where created_at < v_now - interval '48 hours';

  return v_result;
end;
$function$;

revoke all on function public.submit_portfolio_contact(text,text,text,text,text)
  from public, anon, authenticated;
grant execute on function public.submit_portfolio_contact(text,text,text,text,text)
  to service_role;

drop policy if exists "Public submit contact message" on public.contact_messages;
revoke insert on public.contact_messages from anon, authenticated;
