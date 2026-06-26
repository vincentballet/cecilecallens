# Prompt 04 — Decap CMS at /admin

> Read `cedar/cecilecallens/CLAUDE.md`, `cedar/config/CLAUDE.md`, and `cedar/cecilecallens/content-inventory.md` first. Follow the factory rules. Depends on prompt 02 (and the on-disk format it reports). Consult the Astro + Decap guide: https://docs.astro.build/en/guides/cms/decap-cms/

## Goal

Add Decap CMS so the artist edits all content through a friendly UI at `/admin`, and saving commits Markdown/data + images straight to the GitHub repo. The CMS collections must mirror the Astro content schemas from prompt 02 exactly, writing to the exact same files, paths, and field names. If the shapes drift, the build breaks.

## Tasks

1. Add `public/admin/index.html` loading Decap CMS, and `public/admin/config.yml`.
2. **Backend**: `git-gateway` with `branch: main` (this pairs with Netlify Identity in prompt 05). Structure the config so the backend block can be swapped to a GitHub OAuth backend later without touching collections (see the fallback note in `CLAUDE.md`).
3. Enable the **editorial workflow** (`publish_mode: editorial_workflow`) so edits become drafts/PRs the artist can publish, not instant pushes. Decide with care; for a solo non-technical editor, simple direct publish may be friendlier. Document the choice.
4. **Media**: `media_folder` / `public_folder` must point at wherever prompt 02 put painting images, so uploads land in the same place the frontend reads. If images live in `src/assets`, configure Decap's media/public folders accordingly (and confirm `<Image/>` still optimises CMS-uploaded files).
5. **Collections** mirroring the four schemas:
   - **categories**: folder/file collection with `title`, `slug`, `order`, `description`.
   - **paintings**: folder collection, one file per painting. Widgets: `title` (string), `category` (relation → categories), `image` (image widget), `dimensions` (string), `technique` (select: acrylique/huile/technique mixte/pastel), `year` (number, optional), `description` (text, optional), `order` (number), `available` (boolean), `note` (string, optional). Field names and output format must match prompt 02 byte-for-byte.
   - **expositions**: folder collection with `title`, `location`, `startDate` (datetime), `endDate` (datetime), `image` (optional), `description` (optional).
   - **siteSettings**: a `files` collection (single file) with `bioParagraphs` (list), `artistPhoto` (image), `heroHighlight`, `contactEmail`, `contactPhone`, `seo` (object), `analyticsId` (optional).
6. Set the CMS UI language hints and labels in **French** where Decap allows (labels, hints, button text) so the artist sees her own language. Add `hint` text on non-obvious fields (e.g. how dimensions are written).
7. Add Decap's local backend (`local_backend: true` guarded for dev) so the CMS can be tested with `npx decap-server` before Netlify Identity exists.

## Validation

- Run the CMS against the **local backend** and confirm: creating a painting writes a file in the exact location/format prompt 02 expects, an `astro build` then renders it, and editing siteSettings/category/exposition all round-trip.
- Confirm a CMS-uploaded image is picked up and optimised by the frontend.

## Done when

- `/admin` loads, all four collections are present and in French, fields match the schemas exactly.
- A full create/edit/delete cycle via the local backend produces valid content that builds and renders.
- The backend block is git-gateway now, cleanly swappable to GitHub OAuth.

## Report back

The editorial-workflow decision and why, the final media/public folder paths, confirmation that CMS output matches the Zod schemas exactly (or the diffs you had to reconcile), and the exact local-backend test steps you ran.
