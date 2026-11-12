# PANKAJ JII — Remaining setup before live testing

The feature branch contains the Admin managers, public Supabase content loading, contact inbox/form, analytics and asset upload code. These commits are not merged to `main` and are not the production website yet.

## 1. Enable Storage for profile photo and resume

1. Open the Supabase project used by this portfolio.
2. Open SQL Editor.
3. Open `supabase/storage-setup.sql` from this repository and run the complete script.
4. Confirm a public bucket named `portfolio-assets` exists.
5. Do not use a Supabase secret/service-role key in browser code.

The script allows public read access to files in this bucket, but only authenticated users listed in `public.admin_users` can upload, update or delete files.

## 2. Test the Admin dashboard on the feature branch

After the feature branch is deployed to a staging URL:
- Sign in with the approved admin account.
- Add, hide/show and delete a skill.
- Add, hide/show and delete a social profile URL.
- Send a test contact message from the public page and verify it appears in the inbox.
- Upload a PDF resume and a JPG/PNG/WebP profile image.
- Check analytics after visiting the public page and clicking a project link.

## 3. Still requires external setup or owner-provided information

- ASK TO AISHA needs a server-side AI endpoint and a provider API secret stored only as a server/Edge Function secret. Never add this secret to GitHub Pages/browser JavaScript.
- Public email/phone/WhatsApp and real social URLs must be confirmed by the owner.
- Real resume, profile photo, and verified project details must be supplied by the owner.
- Contact form needs server-side abuse protection/rate limiting before public launch.
- Analytics needs a visitor privacy/consent notice and a retention policy.
- Final keyboard, screen-reader, mobile, browser and security testing must happen before merging to `main`.

## 4. Deployment rule

Keep this branch as staging. Merge to `main` only after the owner has tested the above flows and approved the public content. GitHub Pages deployment and a live Supabase test cannot be truthfully marked complete from repository code checks alone.
