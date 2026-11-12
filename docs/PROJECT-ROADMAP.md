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
- [ ] Build and connect functional contact form
- [ ] Implement optional ambient sound with explicit user opt-in
- [ ] Complete cinematic intro and motion/accessibility preferences

## Phase 2 — Supabase backend
- [x] Initial SQL schema draft with RLS enabled
- [ ] Review SQL in a real Supabase project
- [ ] Create and configure Supabase project
- [ ] Verify RLS policies and storage policies
- [ ] Configure auth providers and redirect URLs
- [ ] Seed trusted admin account securely
- [ ] Connect public profile, skills, projects and social links
- [ ] Connect contact messages and file storage
- [ ] Add server-side validation and rate limiting

## Phase 3 — Admin dashboard
- [x] Admin login UI and secure session handling (requires Supabase project config)
- [x] Database-enforced admin authorization check via admin_users and RLS
- [x] Admin profile editor (Supabase-backed; public-page rendering still pending)
- [x] Project CRUD and featured-project management UI (requires configured Supabase)
- [ ] Skills and social links management
- [ ] Resume/photo upload and replacement
- [ ] Contact inbox
- [ ] Live content refresh
- [ ] Safe code-editing workflow (no arbitrary unauthenticated code execution)

## Phase 4 — ASK TO AISHA
- [ ] Define portfolio-only knowledge base from verified content
- [ ] Create bilingual chat UI and creative welcome messages
- [ ] Implement text-only chat and local chat history
- [ ] Secure server-side AI endpoint
- [ ] Restrict answers to portfolio information and approved technology/coding help
- [ ] Test prompt injection, privacy and rate limits

## Phase 5 — Analytics
- [ ] Define privacy-conscious event model
- [ ] Track page views, popular pages, project clicks and traffic source
- [ ] Admin analytics dashboard and date filters
- [ ] Consent/privacy notice as appropriate

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
