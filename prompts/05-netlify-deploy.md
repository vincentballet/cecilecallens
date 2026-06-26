# Prompt 05 — Netlify hosting, auth, and the live loop

> Read `cedar/cecilecallens/CLAUDE.md`, `cedar/config/CLAUDE.md` first. Follow the factory rules. Depends on prompts 01-04. This step needs a human in the loop for the Netlify dashboard, GitHub, and DNS; do the code/config and give the human exact click-by-click instructions for the rest.

## Goal

Ship the site on Netlify and close the loop from the diagram: artist edits in Decap → Git Gateway commits to GitHub → push triggers a Netlify build → Astro regenerates → Netlify CDN serves the update. No manual deploys.

## Tasks

1. **GitHub repo**: create the repo for this Astro project (suggest `cecilecallens-site`, confirm name with the client). Push the local repo from prompt 01. Keep the old `cecilecallens/cecilecallens.github.io` repo untouched as rollback.
2. **Netlify build config**: add `netlify.toml` (build command `npm run build`, publish `dist`, Node version pinned). Connect the repo to a new Netlify site. Confirm a push triggers a deploy.
3. **Netlify Identity**: enable Identity on the site. Set registration to **invite-only** (the artist is the only user; no open signups). Invite her email. Add the Identity widget so `/admin` login works (Decap needs it).
4. **Git Gateway**: enable it on the Netlify site so Decap commits via Identity without the artist needing a GitHub account. Confirm the Decap `git-gateway` backend authenticates.
5. **Verify the whole loop end to end**: log into `/admin` as the invited user, add a test painting with an image, publish, watch the commit land in GitHub, watch Netlify rebuild, confirm the painting appears live. Then remove the test entry the same way. This single test is the real acceptance criterion.
6. **Custom domain**: point `cecilecallens.art` at Netlify (Netlify DNS or external DNS records, document which). Provision the Netlify-managed TLS cert. Plan the cutover from GitHub Pages: keep the old site reachable until DNS propagates, then switch. Note the old CNAME and don't break it prematurely.
7. **Build hook (optional)**: create a Netlify build hook if any non-Git content source ever needs to trigger rebuilds. Not required for the Decap→Git→build path, which already triggers on push.

## Fallback if Netlify Identity cannot be provisioned

Netlify Identity + Git Gateway are in maintenance mode (see `CLAUDE.md`). If you cannot enable a new Identity instance, switch the Decap backend to **GitHub OAuth**:

- Change `public/admin/config.yml` backend to `name: github`, `repo: <owner>/cecilecallens-site`, `branch: main`.
- Deploy the small OAuth provider (Netlify Function / the community `netlify-cms-oauth` pattern, or Sveltia CMS which needs no separate server) and register a GitHub OAuth app.
- The artist then logs into `/admin` with GitHub (or via Sveltia's flow). Content model and frontend are unchanged.

Document whichever path was actually used.

## Done when

- Pushes to `main` auto-build and deploy on Netlify.
- The artist can log into `/admin`, publish a change, and see it live within a couple of minutes with zero developer involvement (verified, not assumed).
- `cecilecallens.art` serves the new site over HTTPS; old site retained as rollback.

## Report back

Which auth path shipped (Identity+Git Gateway or GitHub OAuth/Sveltia) and why, the exact DNS records set, the verified result of the end-to-end edit→live test (with timings), and a short plain-French "how to update your site" note to hand to the artist.
