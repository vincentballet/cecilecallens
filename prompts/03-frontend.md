# Prompt 03 — Public frontend

> Read `cedar/cecilecallens/CLAUDE.md`, `cedar/config/CLAUDE.md`, and `cedar/cecilecallens/content-inventory.md` first. Follow the factory rules. Depends on prompts 01 and 02.

## Goal

Build the public-facing site entirely from the content collections. Recreate the spirit of the old cecilecallens.art but make it clearly better: cleaner, faster, fully responsive, image-optimised, with proper SEO. The work (the paintings) is the star; the chrome stays quiet.

## Pages and sections (single-page site, with optional per-painting routes)

Read everything from collections, never hardcode content.

1. **Hero**: artist name, the verbatim bio paragraphs from siteSettings, the artist portrait. Calm, editorial, lots of whitespace.
2. **À venir / featured**: the current exhibition highlight from siteSettings (and/or the next upcoming exposition computed from dates).
3. **Gallery, one section per colour family**: iterate `categories` by `order`; for each, render its paintings (`order`, then title) as an optimised grid or refined slider. Each painting shows its image, title, dimensions, technique, and any `note`. Lazy-load below the fold. Decide grid vs slider on what looks best responsively; the old jQuery banner slider is the baseline to beat, not to copy.
4. **Expositions**: upcoming vs past split computed from dates.
5. **Contact**: email and phone from siteSettings as proper `mailto:`/`tel:` links.

Optionally add `src/pages/oeuvre/[slug].astro` detail pages per painting via `getStaticPaths` if it helps SEO and lets visitors deep-link a work. Keep it static.

## Requirements

- All artwork images through `<Image />` from `astro:assets` with real `width`/`height` and meaningful `alt` (use the painting title; never empty alt on content images). Optimise to WebP/AVIF. Avoid CLS.
- Fully responsive 320px → wide desktop. Mobile is not an afterthought. Navigation works on small screens (the old "Menu" toggle).
- Minimal JS: any slider/lightbox/nav-toggle as a small `<script>` in the `.astro` file, no jQuery, no framework unless interactivity truly demands it (then a `client:` directive).
- SEO: per the factory checklist via BaseLayout. Add **JSON-LD**: at least a `Person`/`VisualArtist` for Cécile and `VisualArtwork` items for paintings; `Event` for expositions if dates exist. Canonical URLs, OG image.
- Fill the root `llms.txt` with a real plain-text summary now that content exists.
- Respect the brand: Raleway + serif accent, neutral palette, let the paintings provide saturation. French throughout.

## Done when

- The home page renders all categories and paintings from the collections, responsive and optimised.
- `npm run build` is clean; Lighthouse 95+ across Performance, Accessibility, Best Practices, SEO (factory target). Report the scores.
- No layout shift on image load; no jQuery; minimal JS.

## Report back

Lighthouse scores, the gallery interaction chosen (grid vs slider) and why, whether per-painting routes were added, and any accessibility tradeoffs.
