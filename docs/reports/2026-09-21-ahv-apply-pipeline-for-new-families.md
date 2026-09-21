# AHV — how a finished Claude Design family gets APPLIED to the site

**2026-09-21 IST** · traced from `tools/import-english-candidate.mjs`, `tools/wire-legacy-routes.mjs`
and the package on disk. Written so the apply step after families 6–18 does not have to be
re-derived. Nothing here is a change; it is the map.

## The three moving parts

1. **The read-only package** — the importer's only input.
   `/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-CLAUDE-CONTINUATION-002/code-handoff/final-english-portable-candidate/`
   138 `.dc.html` views (desktop + mobile pairs, plus chrome header/footer), `routes.json`, `assets/`
   (18 `*-family-data.js` + `*-family-render.js` pairs). The importer NEVER writes to it.

2. **`routes.json`** — one row per route, naming its view pair and its dataset:
   ```json
   {"path":"/offers/senior-citizen-offer/",
    "views":["AHV Page Campaign Retreat Desktop.dc.html","AHV Page Campaign Retreat Mobile.dc.html"],
    "dataset":"assets/campaign-family-data.js"}
   ```
   A route names exactly ONE dataset and the renderer reads exactly ONE global
   (`wire-legacy-routes.mjs` header) — so a new family = new view pair + new data/render pair +
   the family's routes repointed here.

3. **The importer** materialises the package into `english-candidate/` (route-manifest,
   view-manifest, asset-manifest, language-lock-audit) and `public/ahv/` (views/*.json, assets/,
   runtime/). It rewrites `public/ahv/` WHOLESALE on every run — every `repair-*.mjs` and
   `convert-images-webp.mjs` is a post-import step and must be re-run after it, in the order
   recorded in memory (`ahv-programme-navigation-tools`): repair-finder-dataset →
   repair-finder-shortlist → build-finder-views → repair-training-hub → build-training-hub-route →
   repair-route-manifest → build+serve → prerender-english → repair-snapshot-links → build again.

## A fact that will bite at apply time

The 19-Sep Enquiry and Confirmation designs in `launches/…/design-intake/` are **newer than, and
not byte-identical to, the copies in the package** (package: 14 Sep; intake: 19 Sep; sha differs).
So the package is already behind the intake folder. Applying families 6–18 the same way — copying
the new `.dc.html` pair + data/render pair into the package and editing `routes.json` — is the
established practice, but it means the "read-only, SHA-sealed" package is being extended by hand.
That is a decision for the owner to ratify once, not something to do silently 13 times; it is
logged in QUESTIONS.md as `Q-AHV-PACKAGE-EXTENSION` and the apply step will proceed on the
established practice unless he rules otherwise.

## Per-family apply checklist (to run after ALL of 6–18 are generated)

For each family: download desktop + mobile `.dc.html` and the data/render JS Claude Design wrote
→ read its comments/strain notes → place in package → repoint the family's routes in `routes.json`
→ re-run importer → re-run the repair chain → prerender the family's routes → build → verify in a
browser at 1440 and 390 (zero console errors, zero failed requests, register lock, motifs) → commit.
