# PANKAJ JII — Personal Portfolio

A responsive personal portfolio for Pankaj Kumar, with a futuristic black, neon-blue and purple visual identity.

## Current status

This branch is an **in-progress frontend foundation**, not the finished production website.

### Implemented
- Home, About, Skills, Projects, Education and Contact sections
- Responsive desktop/mobile layout
- English/Hindi language toggle (browser local storage)
- Dark/light theme toggle (browser local storage)
- Project category filters
- Loading screen and scroll-reveal animations
- Custom PJ favicon

### Remaining before final launch
- Verified project entries, real profile photo, resume and public contact details
- Dedicated Resume section and downloadable resume asset
- Working contact form with Supabase storage and server-side validation
- Supabase database, admin authentication, role-based access and storage policies
- Admin dashboard for profile, projects, resume, messages and settings
- Privacy-conscious analytics
- ASK TO AISHA portfolio-only assistant with secure server-side AI integration
- Ambient sound opt-in, accessibility/performance/security review
- GitHub Pages deployment and future custom domain

## Structure

```text
.
├── index.html
├── assets/css/style.css
├── assets/js/main.js
├── assets/images/favicon.svg
├── supabase/schema.sql
└── README.md
```

## Run locally

No build step is currently required. Clone the repository and open `index.html` in a browser, or use a local static server such as VS Code Live Server.

## Demo content

Project cards and contact details are placeholders. Replace them with verified information before publishing.

## Development branch

`feature/pankaj-jii-portfolio-v1`

The production `main` branch is intentionally kept unchanged until all requirements are implemented and reviewed.

## Security
- Never commit Supabase service-role keys, AI secrets, passwords or private credentials.
- Browser code may use only a publishable/anon key with correct Row Level Security.
- Enforce admin permissions in the database/backend, not by hiding frontend controls.
- Route AI requests through a secure server-side function.
