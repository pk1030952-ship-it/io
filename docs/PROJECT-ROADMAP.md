# PANKAJ JII — Development Roadmap

Last updated: 2026-11-10

This is the working checklist for the portfolio. A checked item means implemented in the repository; it does not automatically mean production-tested.

## Phase 1 — Public portfolio frontend
- [x] Home, About, Skills, Projects, Education and Contact foundations
- [x] Responsive base layout and navigation
- [x] English/Hindi toggle
- [x] Dark/light theme toggle
- [x] Project category filters
- [x] Scroll reveal and intro loading screen
- [x] Custom favicon
- [x] Resume section placeholder
- [x] Social profile section placeholders
- [ ] Add real profile photo and image assets
- [ ] Add verified project descriptions, thumbnails, demo and source links
- [ ] Add final resume PDF and working download
- [ ] Add confirmed social profile URLs
- [ ] Add confirmed email, WhatsApp and phone details
- [x] Build and connect functional contact form
- [ ] Implement optional ambient sound with explicit user opt-in
- [ ] Complete cinematic intro and motion/accessibility preferences

## Phase 2 — Supabase backend
- [x] Initial SQL schema draft with RLS enabled
- [x] Review and apply SQL in the user's Supabase project (7 tables verified)
- [x] Create and configure Supabase project
- [x] Apply table RLS policies; Storage policies remain pending
- [ ] Configure auth providers and redirect URLs
- [x] Seed trusted admin account securely
- [x] Connect public profile, skills, projects and social links to Supabase; uploaded photo/resume render on public page
- [x] Connect contact message form and admin inbox; file storage remains pending
- [ ] Add server-side validation and rate limiting (required before public contact-form launch)

## Phase 3 — Admin dashboard
- [x] Admin login UI and secure session handling (requires Supabase project config)
- [x] Database-enforced admin authorization check via admin_users and RLS
- [x] Admin profile editor (Supabase-backed; public-page rendering still pending)
- [x] Project CRUD and featured-project management UI (requires configured Supabase)
- [x] Skills and social links management
- [x] Resume/photo upload UI and Supabase Storage integration (requires storage-setup.sql to be run)
- [x] Contact inbox (read/archive)
- [x] Public content loads from Supabase on page load; realtime subscriptions pending
- [ ] Safe code-editing workflow (no arbitrary unauthenticated code execution)

## Phase 4 — ASK TO AISHA
- [ ] Define portfolio-only knowledge base from verified content
- [ ] Create bilingual chat UI and creative welcome messages
- [ ] Implement text-only chat and local chat history
- [ ] Secure server-side AI endpoint
- [ ] Restrict answers to portfolio information and approved technology/coding help
- [ ] Test prompt injection, privacy and rate limits

## Phase 5 — Analytics
- [x] Define basic event model (page_view and project_click; consent and retention policy still pending)
- [x] Track page views and project clicks; referrer host is captured when available
- [x] Admin analytics dashboard with 7/30/90-day filters
- [x] Add visitor opt-in consent before sending anonymous analytics events
- [ ] Add analytics retention controls

## Phase 6 — Quality and launch
- [ ] Browser/device testing
- [ ] Keyboard and screen-reader accessibility review
- [ ] SEO, metadata and social preview
- [ ] Performance and asset optimization
- [ ] Security review and secrets scan
- [ ] Verify all links, forms and admin flows
- [ ] Final review on staging
- [ ] Merge to main only after approval
- [ ] Enable GitHub Pages and verify public URL
- [ ] Document custom-domain setup for future use

## User-supplied information still needed
- Public email, WhatsApp and phone number (or explicit decision to omit)
- Exact social profile URLs
- Profile photo and resume file
- Verified project names, descriptions, screenshots, live/demo URLs and source URLs
- Supabase project setup and auth provider configuration
- Final approval of public-facing content

## Important
Do not publish placeholders as real contact links or claim unfinished backend features are working. Never commit passwords, Supabase service-role keys or AI API secrets.


## Phase 4 — ASK TO AISHA
- [x] Add portfolio-only assistant knowledge draft
- [x] Add Gemini-backed Supabase Edge Function source (secret key stays server-side)
- [x] Add floating text-chat UI and invoke the Edge Function
- [x] Add origin allowlist, request length limit, and best-effort per-instance throttling
- [ ] Revoke the API key exposed in chat and create a replacement with the provider
- [ ] Set GEMINI_API_KEY and PORTFOLIO_PUBLISHABLE_KEY in Supabase Edge Function secrets
- [ ] Deploy the Edge Function and verify provider/model access
- [ ] Implement durable rate limiting, monitoring, and usage/spend controls before public launch
- [ ] End-to-end browser test on the actual GitHub Pages origin
