# PANKAJ JII — Personal Portfolio

Responsive personal portfolio for Pankaj Kumar with a Supabase-backed admin dashboard, dynamic content, privacy-conscious analytics, asset uploads, contact inbox and ASK TO AISHA.

## Current status

The development branch is ready for final acceptance testing, but it is **not production-approved yet**. Do not treat placeholders as verified public information.

### Implemented
- Home, About, Skills, Projects, Education, Resume, Social and Contact sections
- Responsive layout, Hindi/English toggle, dark/light theme and project filters
- Supabase profile, project, skill and social content loading
- Admin authentication with database-enforced admin authorization
- Project/skill/social management and contact inbox
- Resume/profile-photo upload flow with `portfolio-assets` Storage policies
- Visitor opt-in analytics with admin reporting
- Public contact form with database validation plus browser honeypot/cooldown
- ASK TO AISHA via Supabase Edge Function with server-side Gemini secret and bounded model fallback
- SEO metadata, keyboard focus treatment and reduced-motion support

### Remaining before production launch
- Deploy latest Edge Function revision and test chat on the final Pages origin
- Add or intentionally omit real profile photo, resume, contact details, social URLs and verified project links
- Add durable server-side abuse/rate limiting for public contact/AI endpoints
- Decide analytics retention policy
- Complete mobile/browser/accessibility/security acceptance testing
- Merge the development PR to `main`, enable GitHub Pages and verify the live URL

## Security
- Never commit Supabase secret/service-role keys, Gemini API keys, passwords or private credentials.
- Browser code uses only a Supabase publishable key; Row Level Security protects data.
- Admin authorization is enforced in Supabase, not by hiding frontend controls.
- AI provider credentials stay in Supabase Edge Function secrets.
- Exact residential address is intentionally excluded from public portfolio/AI knowledge.

## Development branch

`feature/pankaj-jii-portfolio-v1`

Production remains on `main` until final acceptance is complete.
