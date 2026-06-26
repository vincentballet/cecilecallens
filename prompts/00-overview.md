# Subagent prompts — Cécile Callens CMS rebuild

These are ready-to-serve prompts for building the project one piece at a time. Each is self-contained but assumes the agent reads the shared context first.

## Shared context every agent must read first

Paste this line at the top of every subagent run:

> Read `cedar/cecilecallens/CLAUDE.md`, `cedar/config/CLAUDE.md`, and `cedar/cecilecallens/content-inventory.md` before doing anything. Follow the factory rules. The old site to rebuild is in `cedar/../cecilecallens.github.io` (Pug + Sass). All work happens in `cedar/cecilecallens/`.

## Run order

1. **01-scaffold.md** — Astro project, structure, Netlify static config, base layout, SEO baseline, repo init.
2. **02-content-model-and-migration.md** — content collections + Zod schemas, then migrate the existing paintings/images into them.
3. **03-frontend.md** — build the public UI from the collections (gallery by colour family, expositions, about, contact), responsive, optimised.
4. **04-decap-cms.md** — Decap CMS at `/admin` with collections that mirror the schemas exactly.
5. **05-netlify-deploy.md** — Netlify site, Identity, Git Gateway, build hook, custom domain; verify the full edit→commit→rebuild loop.

Run 1→2→3→4 in order (each depends on the previous). 04 can overlap with 03 once 02 is done. 05 is last and needs a human in the loop for Netlify dashboard steps and DNS.

## Hard constraints (all agents)

- Hosting is **Netlify**, not Vercel. Use `output: 'static'` and `@astrojs/netlify` only if a feature needs it; a pure static build is preferred.
- Content lives in Git as Markdown/data + images. No external database.
- The Decap `config.yml` collections and the Astro content collection schemas must stay **identical in shape**. If one changes, change the other in the same task.
- Never rewrite the artist's French copy. Migrate it verbatim.
- No em dashes and no AI tells in any new copy (factory rule).
- Don't invent painting data, exhibition dates, or analytics IDs. If unknown, leave a clearly marked TODO and flag it.

## Definition of done for the whole project

A non-technical editor logs in at `/admin`, adds a painting with an image and a category, saves, and within a couple of minutes the live site at cecilecallens.art shows it, with no developer involvement.
