# PANKAJ JII — Final launch checklist

Repository implementation is substantially complete. Items below require live environment verification, owner-approved content, or production operations.

## Already verified
- Supabase database tables and RLS are configured.
- `portfolio-assets` bucket exists with public read and admin-only write/update/delete policies.
- Approved admin authentication works.
- ASK TO AISHA Edge Function has returned a successful live Gemini response.
- Gemini/provider secrets are stored server-side in Supabase, not browser code.
- Analytics requires visitor opt-in before events are sent.

## Publishing status
- GitHub Pages was manually unpublished, and the owner selected `None` for the publishing branch on 12 November 2026. Do not select a publishing branch again before final acceptance.
- Draft PR #2 is mergeable and its static CI checks have passed; it is **not merged**.
- Supabase connector is now connected and the live Edge Function is deployed; read-only database checks and a focused RLS-helper security migration have been completed.

## Verified live Supabase deployment (12 November 2026)
- The connected Supabase project was verified `ACTIVE_HEALTHY`.
- `ask-to-aisha` Edge Function was updated from version 4 to version 5 with the development branch source.
- Retrieved deployed version 5 and checked CORS preflight restriction, non-sensitive visitor errors and completed-ADCA factual context.
- Database contact and analytics policies were inspected; the `is_admin()` SECURITY DEFINER helper was moved (preserving its RLS/Storage policy references) into non-exposed `app_private` schema using the connected Supabase migration action.
- The security advisor was rerun and the two public-Security-Definer warnings are resolved. The remaining warning is leaked-password protection disabled.
- A second focused migration added an index to `public.site_events(project_id)` and replaced redundant `FOR ALL` content RLS policies with separate admin INSERT/UPDATE/DELETE policies; the existing SELECT permissions are unchanged.
- Security advisors now show only leaked-password protection disabled; performance advisor shows one newly created, not-yet-used event index and no missing-index or multiple-permissive-policy warnings.
- Anonymous-role SQL test confirmed `app_private.is_admin()` is false and anonymous SELECT can see zero admin roster rows and zero contact message rows.
- GitHub SQL starter files have been synchronized with these live migrations.
- Supabase Auth leaked-password protection is disabled (security advisor warning). Review available Auth settings before launch.
- Actual chatbot provider response on the new deployment and complete browser acceptance testing remain pending.

## Required before merging to main
1. ~~Deploy latest `supabase/functions/ask-to-aisha/index.ts`~~ — deployed and verified as ACTIVE version 5 on 12 November 2026. Re-deploy if Edge source changes.
2. Test ASK TO AISHA from the final GitHub Pages origin.
3. Test admin login, project/skill/social CRUD, contact inbox, resume upload and profile-photo upload.
4. Test public contact form and confirm the message reaches the admin inbox.
5. Add real resume/photo/contact/social/project data, or intentionally leave each unavailable item unpublished.
6. Add durable server-side abuse protection/rate limiting for public contact submissions and monitor AI usage.
7. Define an analytics retention period and periodically delete older events.
8. Complete keyboard, screen-reader, mobile and major-browser acceptance testing.
9. Review the draft PR, merge to `main`, enable GitHub Pages and verify the production URL.

## Deployment rule
Never publish private residential information or credentials. Never commit Gemini keys, Supabase secret/service-role keys or passwords. Browser code may contain only the Supabase publishable key protected by RLS.
