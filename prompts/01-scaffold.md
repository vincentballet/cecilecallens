# Prompt 01 — Scaffold the Astro project

> Read `cedar/cecilecallens/CLAUDE.md`, `cedar/config/CLAUDE.md`, and `cedar/cecilecallens/content-inventory.md` first. Follow the factory rules.

## Goal

Stand up a clean, empty-but-runnable Astro site in `cedar/cecilecallens/` that the later prompts build on. No real content yet, no CMS yet. Just the skeleton, the conventions, and a working dev/build.

## Tasks

1. Initialise an Astro project in place at `cedar/cecilecallens/` (latest Astro, TypeScript, minimal template). Keep `CLAUDE.md`, `content-inventory.md`, and `prompts/` where they are.
2. Set `output: 'static'` in `astro.config.mjs`. Site URL `https://cecilecallens.art`. Add `@astrojs/sitemap`. Do not add the Netlify adapter unless a later need appears; a plain static build deploys fine on Netlify.
3. Create the directory structure the project will use:
   - `src/layouts/` (base layout with the SEO head)
   - `src/components/`
   - `src/content/` (collections come in prompt 02)
   - `src/pages/` (just `index.astro` for now, single-page site)
   - `src/styles/` (global tokens: colours, type scale, reset)
   - `public/` (`robots.txt`, fonts, favicons, `admin/` placeholder for prompt 04)
4. Build a `BaseLayout.astro` that centralises the SEO head per the factory checklist: `<title>`, meta description, canonical, Open Graph tags, viewport, lang `fr`, and a JSON-LD slot. Accept title/description/image/canonical as props with sensible site-wide defaults.
5. Self-host fonts: add Raleway (100/400/700) and an italic serif accent (Latin Modern Roman Slant, or the closest clean serif if the LM webfont is painful to ship) under `public/fonts/`, preloaded in the head. No Google Fonts `@import` (factory rule). Define them as CSS custom properties / `@font-face`.
6. Add base style tokens in `src/styles/global.css`: neutral gallery palette (white/near-black/light-grey, the work carries the colour), a type scale, spacing scale, and a modern reset. Keep it minimal.
7. Add `public/robots.txt` (allow all, point to sitemap) and a root `public/llms.txt` placeholder (filled properly once content exists).
8. `index.astro` renders the BaseLayout with a placeholder hero so `npm run dev` and `npm run build` both succeed.
9. Initialise a git repo here (`git init`), add a sensible `.gitignore` (node_modules, dist, .env, .netlify), and make one initial commit (`scaffold astro project`, lowercase, imperative, no AI mentions). Do NOT add a remote or push; the deploy prompt handles GitHub.

## Done when

- `npm run dev` serves a styled placeholder page at `/`.
- `npm run build` produces `dist/` with a sitemap and no errors.
- Fonts load self-hosted, head passes the factory SEO checklist, lang is `fr`.
- One clean initial commit exists; no remote configured.

## Report back

The chosen Astro version, the final folder tree, the font decision (real LM Roman or substitute and why), and anything you stubbed for a later prompt.
