# PANKAJ JII — Final launch checklist

Repository implementation is substantially complete. Items below require live environment verification, owner-approved content, or production operations.

## Already verified
- Supabase database tables and RLS are configured.
- `portfolio-assets` bucket exists with public read and admin-only write/update/delete policies.
- Approved admin authentication works.
- ASK TO AISHA Edge Function has returned a successful live Gemini response.
- Gemini/provider secrets are stored server-side in Supabase, not browser code.
- Analytics requires visitor opt-in before events are sent.

## Required before merging to main
1. Deploy the latest `supabase/functions/ask-to-aisha/index.ts` revision in Supabase.
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
