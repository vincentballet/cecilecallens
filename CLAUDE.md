# Cécile Callens — Painter Portfolio (CMS rebuild)

Client project inside the Cedar factory. Goal: rebuild [cecilecallens.art](https://cecilecallens.art/) from scratch as an editor-managed site so the artist can add, remove and re-organise her paintings herself, without touching code.

Factory-wide rules live in [../config/CLAUDE.md](../config/CLAUDE.md) and always apply (engineering standards, Astro best practices, SEO checklist, copywriting voice, performance targets). This file only adds client-specific context and the few places where this project **overrides** the factory defaults.

## Overrides vs the factory rules

- **Hosting**: Netlify, not Vercel. The whole edit/auth/deploy loop is built around Netlify (Identity + Git Gateway + build hooks). This is the one hard deviation from the factory stack.
- **Not static-only**: still an Astro SSG build, but content is owned by a CMS instead of being hardcoded in components. Editors change content, a commit is made, a rebuild ships it.

## The architecture (matches the project diagram)

```
Rédacteur (artist)
   │ edits content
   ▼
Netlify Identity ──authorises──▶ Decap CMS (/admin)
                                     │ commits content (markdown + images)
                                     ▼
                                  GitHub repo  ◀── code + content live together
                                     │ push → build
                                     ▼
                              Netlify Build (CI/CD)
                                     │ runs Astro SSG
                                     ▼
                              Astro.js → HTML/CSS/JS
                                     │ deploy
                                     ▼
                              Netlify CDN ──serves──▶ Visiteur
```

The loop we are wiring: **artist edits in Decap → Git Gateway commits to GitHub → push triggers Netlify build → Astro regenerates the static site → Netlify CDN serves it.** No manual deploys, ever.

### Pieces to build

1. Astro SSG site (frontend + content collection schemas)
2. Content model + migration of the existing paintings/images
3. The public-facing UI (gallery by colour family, expositions, about, contact)
4. Decap CMS at `/admin` with collections that mirror the content schema
5. Netlify hosting + Identity + Git Gateway + build trigger, custom domain

Build prompts for each piece live in [prompts/](prompts/). Read [prompts/00-overview.md](prompts/00-overview.md) first. The full content of the current site is inventoried in [content-inventory.md](content-inventory.md).

## CMS choice and the Netlify Identity risk (read this)

The diagram specifies **Decap CMS + Netlify Identity + Git Gateway**, which is the classic Git-based, no-database, free setup and a perfect fit for one non-technical editor. We follow it.

Caveat to keep in mind: Netlify has put **Netlify Identity and Git Gateway into maintenance mode** and discourages new usage. It still works, but if a new Identity instance cannot be provisioned, the fallback (same CMS, same repo, same UX) is one of:

- **Decap with a direct GitHub OAuth backend** (run the tiny OAuth helper on Netlify Functions), or
- **Sveltia CMS**, a drop-in, actively maintained Decap-compatible replacement that talks to GitHub directly and reuses the same `config.yml`.

Decision: build for Netlify Identity + Git Gateway as drawn; if provisioning fails during the Netlify step, switch to GitHub OAuth (or Sveltia) without changing the content model or the frontend. The deploy prompt covers both paths.

## Content model

Four content collections (Astro Content Collections + Zod, mirrored 1:1 in Decap `config.yml`):

- **categories** — the colour families that organise the gallery. Fields: `title` (e.g. "Les ocres"), `slug` (`ocre`), `order` (int, controls section order), optional `description`. Current set, in order: ocre, bleu, vert, jaune, rouge, noirblanc (Noir et blanc), gris, autres.
- **paintings** — one entry per artwork. Fields: `title`, `category` (ref → categories), `image`, `dimensions` (free text, e.g. "116cm x 84cm" or "tryptique de 50cm x 150cm"), `technique` (enum: acrylique, huile, technique mixte, pastel), optional `year`, `description`, `order`, and `available`/`note` for "collection personnelle" or sold pieces.
- **expositions** — shows. Fields: `title`, `location`, `startDate`, `endDate`, optional `image`, `description`. Upcoming vs past is derived from dates, not stored.
- **siteSettings** (single entry) — artist bio paragraphs, artist photo, hero highlight ("À venir"), contact email and phone, SEO defaults, OG image.

`dimensions` is free text because the source data is irregular (triptychs, prizes, notes mixed in). Keep it a string; do not try to parse width/height.

## Brand and design (carry over from the current site)

- **Voice**: first-person French, warm, personal, poetic. The artist talks about colour, light, travel, childhood in Africa and Corsica, prehistory, her mentor PAJO, her friend the writer Joseph Joffo. Preserve her actual words during migration. Apply the factory copywriting rules (no em dashes, no AI tells) only to any *new* connective copy, never rewrite her bio.
- **Type**: headings **Raleway** (100/400/700), accents in **Latin Modern Roman Slant** (italic serif). Self-host both via `public/fonts/` and preload; do not `@import` Google Fonts (factory rule). Pick the closest modern pairing if the LM Roman webfont is awkward to ship.
- **Palette**: minimal, gallery-like. Source vars were `$white #fff`, `$black #111`, `$tile-bg #efefef`, `$letter-muted #e3e3e3`. The work is the colour; the chrome stays neutral. Let the paintings carry all the saturation.
- **Layout**: hero with bio + portrait, a "À venir" featured exhibition block, then one gallery section per colour family, an expositions slider, and a contact block. Improve on the original (it was a jQuery slider template); the bar is significantly better than the old site, fully responsive 320px→wide, image-optimised.
- **Contact**: email `cecilecallensartiste@gmail.com`, phone `+33611250191`.
- **Analytics**: old site used GA4 `G-LCT97HKZXH`. Confirm with the client whether to keep it before re-adding.

## Repo, domain, deploy

- **Domain**: `cecilecallens.art` (currently a CNAME on GitHub Pages, repo `cecilecallens/cecilecallens.github.io`). Cutover to Netlify happens in the deploy step; keep the old repo untouched as a rollback.
- **New repo**: `cecilecallens` on GitHub (Decap commits content here, Netlify builds from it).
- **Old source of truth**: [../../cecilecallens.github.io](../../cecilecallens.github.io) — Pug + Sass template, paintings as hardcoded `<h4>` captions, images under `assets/img/full-slide/<category>/<n>.jpg` (numbered globally, sorted into category folders). High-res originals may be in `assets/img/full-slide-uncompressed/`.

## Migration gotcha

In the old site, painting **titles** are listed in the Pug in display order, but image **files are named by a global number** (`4.jpg`, `18.jpg`, …) and only sorted into colour folders. The title↔image mapping is therefore **not guaranteed by filename order** and must be verified visually during migration. Do not assume `n`-th title maps to the `n`-th sorted file. See [content-inventory.md](content-inventory.md) for the full title list per category.
