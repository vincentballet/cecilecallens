# Prompt 02 — Content model + migration

> Read `cedar/cecilecallens/CLAUDE.md`, `cedar/config/CLAUDE.md`, and `cedar/cecilecallens/content-inventory.md` first. Follow the factory rules. Depends on prompt 01.

## Goal

Define the Astro Content Collections (with Zod schemas) that own all site content, then migrate the existing paintings, images, bio, and contact info from the old site into them. After this, the site's data lives entirely in Git as Markdown/data + images, ready for both the frontend (03) and Decap (04).

## Content collections (define all four)

Mirror the model in `CLAUDE.md`. Use `src/content/config.ts` with Zod. Keep field names stable, they become the Decap fields in prompt 04.

- **categories**: `title`, `slug`, `order` (int), `description?`. Seed all 8 in display order: ocre, bleu, vert, jaune, rouge, noirblanc, gris, autres (titles from the inventory).
- **paintings**: `title`, `category` (reference → categories), `image` (use Astro `image()` helper in the schema so `<Image/>` can optimise), `dimensions` (string, free text), `technique` (enum: acrylique | huile | technique mixte | pastel), `year?` (int), `description?`, `order` (int, default 0), `available` (bool, default true), `note?` (for "collection personnelle", prizes, etc.). One file per painting.
- **expositions**: `title`, `location`, `startDate` (date), `endDate` (date), `image?`, `description?`. Upcoming vs past is computed from dates in the frontend, not stored.
- **siteSettings** (single entry): `bioParagraphs` (array of strings, the verbatim bio), `artistPhoto` (image), `heroHighlight` (the "À venir" text/object), `contactEmail`, `contactPhone`, `seo` (default title, description, ogImage), `analyticsId?`.

Store collections so Decap can write them cleanly: paintings and expositions as Markdown-with-frontmatter (or a JSON/YAML data collection if that maps more simply to Decap, your call, but document it); siteSettings as a single data file; categories as a small data collection.

## Migration

Source: `cedar/../cecilecallens.github.io/`. The full painting list per category is in `content-inventory.md`. Image files: `assets/img/full-slide/<category>/<n>.jpg` (high-res possibly in `assets/img/full-slide-uncompressed/`). Artist photo: `assets/img/artist.jpg`. Featured: `assets/img/featured.jpg`. Expo images: `assets/img/three-slide/expo1..6.jpg`.

1. Copy/optimise the images into the Astro project under a structure Decap's media library can also use (e.g. `src/assets/paintings/<category>/` or `public/...`, decide based on whether you want build-time optimisation, which `src/assets` gives you). Prefer originals from `full-slide-uncompressed/` if present and better quality.
2. Create one painting entry per title in the inventory, with its category reference, dimensions, technique, and any `note` (prize/collection personnelle text after the dash). Preserve the artist's exact French strings.
3. **Verify the title↔image mapping visually.** Filenames are global numbers, not title order, so do not assume the n-th title maps to the n-th sorted file. Open the images and match them to titles by the painting's described colour/subject. Where a confident match is impossible, set the image but add a clearly marked `note: "verify image"` and list it in your report rather than guessing silently.
4. Note the discrepancies already known: Noir et blanc has 7 titles but 8 images (identify the extra). Some titles repeat ("abstrait japonisant", "le phare", "soleil couchant") across categories, that's expected.
5. Populate **siteSettings** with the verbatim bio (from the inventory), artist photo, contact email/phone, and the current hero highlight ("Exposition du 27 Octobre au 11 Novembre 2025, Salle St Esprit, Valbonne").
6. For **expositions**, the old markup has 6 captionless images. Create entries from what's known but leave `title`/dates as marked TODOs where the data doesn't exist; do not invent exhibition history. Flag this for the client.

## Done when

- `src/content/config.ts` defines all four collections with Zod and they pass `astro check` / `astro sync`.
- Every inventory painting exists as an entry with an image, category, dimensions, technique.
- Bio, photo, contact, and hero highlight are in siteSettings, verbatim.
- A build succeeds reading from the collections (even with a throwaway debug page listing them).

## Report back

A table of any paintings where the image match was uncertain, the identity of the 8th noir/blanc image, where images ended up (`src/assets` vs `public`) and why, the exact on-disk format Decap will need to target (file/folder collection, extension, field names), and every TODO left for the client (expo data, analytics).
