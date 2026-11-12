# PANKAJ JII — Launch acceptance checklist

This document distinguishes source-code readiness, actual live testing and owner-only publishing steps. Do not assume a completed static check means the public site has been browser-tested.

## Live verification — 12 November 2026

- Confirmed Supabase project is healthy. Database tables and RLS are present.
- `ask-to-aisha` **version 6 ACTIVE**. Gemini high-demand/timeout failures were observed in v5; version 6 provides a fast, explicitly labeled *verified portfolio facts* fallback and reduces repeated provider attempts.
- Live HTTPS smoke run [43266774496, attempt 2](https://github.com/pk1030952-ship-it/io/actions/runs/43266774496) **passed**: allowed CORS 204, rejected origin 403, invalid contact 400, valid contact 200, repeated contact 429, and ASK TO AISHA 200 with correct ADCA fact.
- Test contact `portfolio-smoke-43266774496@example.invalid` was deleted after verification; no QA inbox message remains.
- `submit-contact` Edge Function **version 1 ACTIVE**. Browser sends to the function, not directly to database. Service-role-only RPC limits to one submission per fingerprint per 90 seconds and five per day. Anonymous/direct writes are blocked.
- `public.is_admin()` was moved to `app_private.is_admin()`, preserving RLS references while removing the exposed RPC route. Anonymous test: false admin flag, zero visible admin/inbox rows.
- Redundant permissive content policies were simplified; analytics foreign-key index added. The latest security advisor flags only Supabase Auth leaked-password protection disabled, plus informational/unused table/index notices.
- Daily Supabase Cron job **pj-portfolio-retention** is ACTIVE at 03:15 UTC; deletes site events older than 90 days and rate-limit fingerprints older than 48 hours. Does not delete actual inbox contact messages.
- GitHub PR [#2](https://github.com/pk1030952-ship-it/io/pull/2) remains **Draft, mergeable, unmerged**. Static checks pass; Pages was manually unpublished and its source set to `None` by the owner.

## Still required before public launch

1. Chromium mobile/desktop/admin UI smoke tests, and final keyboard/mobile/browser acceptance. A browser job is running; earlier failure exposed horizontal scrolling from off-screen decoration, and a viewport clip fix is now under test.
2. Enable leaked-password protection in the Supabase Dashboard if available under Authentication security; this is not exposed as a write action through the connected Supabase tools.
3. Owner-approved public contact/social/project URLs, photo and resume must be supplied or the missing items intentionally kept as placeholders/unpublished. Never invent them.
4. Signed-in admin CRUD and real photo/resume upload, contact inbox and final domain testing. Automated HTTPS smoke tests spoof the correct Origin header, but do not replace a live published-browser test.
5. Optional hardening: stronger anti-bot challenge and usage-budget monitoring for public AI/Contact endpoints. IP forwarding headers alone are not a strong abuse barrier.
6. Only after the above: review PR, merge to `main`, set GitHub Pages source to `main` root, verify production URL and test once more.

## Deployment rule

No user passwords, Supabase secret/service-role key, or Gemini API keys in GitHub or browser code. The Supabase publishable key is designed for clients but must always be combined with RLS. Do not publish a private residential address or unapproved contact information.
