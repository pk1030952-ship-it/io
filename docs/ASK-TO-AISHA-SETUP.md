# ASK TO AISHA — secure deployment notes

The Edge Function source is at `supabase/functions/ask-to-aisha/index.ts`.

## Important key rotation
The API key previously pasted into chat must be revoked at its provider and replaced. Never commit either the old or new key to GitHub or paste it into chat.

## Configure secrets locally
Install and authenticate the Supabase CLI, then link this project:
```sh
supabase login
supabase link --project-ref wffimpbtcbevbblbbtez
supabase secrets set GEMINI_API_KEY=YOUR_NEW_PROVIDER_KEY
supabase secrets set PORTFOLIO_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
supabase functions deploy ask-to-aisha
```
Replace placeholders only in your local terminal. Do not share terminal output containing secrets.

The function calls Gemini 2.5 Flash. If the key was created for a different provider, this function must be adapted to that provider before deployment.

## Function settings
`supabase/config.toml` disables gateway JWT verification for this public portfolio endpoint; the function itself checks the exact configured publishable key and allowlisted browser Origin. This is not a substitute for abuse prevention. Its in-memory per-instance rate limit is best-effort only; production launch still needs durable IP/session rate limiting, monitoring, and spend limits.

## Current state
- Function source committed on the feature branch.
- Portfolio knowledge draft committed at `docs/PORTFOLIO-KNOWLEDGE.md`.
- Function is NOT deployed yet.
- Chat UI is NOT yet wired to the Edge Function.
- No provider key is stored in Supabase by this repository change.
- Never place `GEMINI_API_KEY` in browser JavaScript, HTML, GitHub Actions logs, or Git history.
