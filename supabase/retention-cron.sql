-- PANKAJ JII automatic retention cleanup.
-- Keep analytics for 90 days and short-lived contact abuse fingerprints for 48 hours.
-- This job does NOT delete actual contact inbox messages.
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select cron.schedule(
  'pj-portfolio-retention',
  '15 3 * * *',
  $job$
    delete from public.site_events
    where created_at < now() - interval '90 days';
    delete from public.contact_submission_limits
    where created_at < now() - interval '48 hours';
  $job$
);
