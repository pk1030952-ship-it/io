# Admin dashboard setup

The admin interface lives at `/admin.html`. It uses Supabase Auth and the `admin_users` allow-list; hiding the page is not treated as security.

## Required setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. In Supabase Authentication, enable Email/Password. Enable Google only after configuring its OAuth credentials and redirect URLs.
4. Copy the project URL and the publishable/anon key into `assets/js/supabase-config.js`. These are public browser values; never put a service-role key in this file.
5. Create the first admin account through Supabase's trusted dashboard/invite flow.
6. Copy that user's UUID from Authentication → Users and insert it into `public.admin_users` using the SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID');
```

7. Visit `/admin.html` and sign in. The dashboard checks the signed-in user's UUID against `admin_users`; RLS policies then control access to data.

## Current dashboard scope

- Email/password sign-in
- Google sign-in button (works only after Google provider configuration)
- Admin allow-list verification
- Project list, create, edit, publish/unpublish, featured flag and delete
- Read-only message count

Profile editing, uploads, message inbox, analytics, and safe code editing are not implemented yet.

## Deployment note

GitHub Pages is static hosting. The browser uses only the Supabase publishable/anon key and RLS. AI provider secrets and service-role keys must stay on a trusted server/edge function and must never be committed.
