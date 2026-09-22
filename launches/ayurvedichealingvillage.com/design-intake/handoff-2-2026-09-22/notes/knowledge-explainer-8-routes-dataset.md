# Knowledge/Explainer 8 routes — dataset sidecar

**Artefact:** `uploads/knowledge-explainer-8-routes.json`
**Task carried out:** `uploads/FETCH-PROMPT-8-EXPLAINER-ROUTES.md`
**Date:** 22 Sep 2026 · **Record fetched:** 2026-09-21T12:42:39.060Z
**Source:** the delivered verbatim record (three chunks: routes 1-3 / 4-6 / 7-8, `extractedBy sites/ayurvedichealingvillage.com/tools/fetch-explainer-routes.mjs`). No live fetching, no paraphrase, no invented content. Entity strings (`&#8211;` `&#8217;` `&#8220;` `&amp;` `&nbsp;`) are preserved exactly as the record carries them rather than normalised to characters.

## What was produced

One JSON object, 8 routes, in the prompt's schema: `meta` · `h1` · `breadcrumbVisible` · `blocks` (source order) · `links` · `images` · `counts` · `discrepancy`.

| route | body words | h2 | h3 | h4 | list items | images | blocks | links |
|---|---|---|---|---|---|---|---|---|
| /why-get-training-in-ayurveda/ | 662 | 3 | 3 | 7 | 40 | 1 | 25 | 23 |
| /new-to-yoga/ | 621 | 3 | 15 | 0 | 18 | 7 | 42 | 29 |
| /what-is-ayurvedic-food/ | 559 | 3 | 5 | 7 | 16 | 1 | 30 | 17 |
| /what-is-panchkarma/ | 329 | 3 | 4 | 0 | 19 | 1 | 15 | 21 |
| /live-to-100-with-panchkarma/ | 300 | 3 | 3 | 0 | 22 | 2 | 15 | 25 |
| /why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/ | 297 | 3 | 3 | 0 | 22 | 2 | 13 | 23 |
| /ayurvedic-resturant-and-cooking-at-healing-village/ | 245 | 3 | 6 | 0 | 9 | 2 | 19 | 17 |
| /ayurveda-retreats-for-everyone/ | 237 | 3 | 5 | 0 | 9 | 2 | 18 | 19 |

## Checks run

- **JSON validity** — parses clean, 8 routes, UTF-8.
- **Internal consistency** — for every route, `counts.h2/h3/h4` equal the emitted heading blocks; `counts.listItems` reconciles with the `ul`/`ol` item totals; `counts.images` equals `images[]` length; `images[]` is de-duplicated; every `figure`/`link-card` `src` also appears in `images[]`; every `links[].href` is absolute.
- **Against the prompt's expected-counts table** — body word counts land within a few words of `table − ~440 chrome` on all 8 routes (662/659, 621/620, 559/557, 329/328, 300/297, 297/290, 245/258, 237/256). `h2` matches on 6 of 8; `h3` matches on 8 of 8. `listItems` and `images` are short on every route, and `h2` is short by one on the last two. Content was **not** adjusted to match — each route carries a `discrepancy` field, per the prompt's instruction.

## Open items for the owner

1. **In-main sidebar ruling (blocks every page port).** The "Things To Do" / "Knowledge Center" accordion sits *inside* `<main>` on all 8 routes. The record counts it as body; it is kept here as body blocks in source order, and it is the reason `listItems` and `images` fall short of the table. Decide: chrome (strip on port), body (keep), or a separate navigation record. My question on this was not answered.
2. **`h1` is null on all 8 routes.** Each page renders its title as `<h2>` twice — once in the hero cover, once at the top of the content column. Confirm that is the live truth, not an extractor artefact. Under the Hero C ruling the H1 is minted in the hero band and renders once, so the porting path is clear either way — but the SEO head contract needs the confirmation.
3. **Route identity — `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/`.** The Knowledge Center sidebar on the other explainer routes links to `/why-pick-an-ayurveda-treatment-orayurvedic-retreat/` (no hyphen before "ayurvedic"). Two slugs, one page title. Needs a link-audit / redirect decision.
4. **Route identity — restaurant/resturant.** The live route is `.../ayurvedic-resturant-and-cooking-at-healing-village/` (misspelled, preserved). The sidebar carries an empty anchor to the correctly-spelled `/ayurvedic-restaurant-cooking-at-healing-village/`. Same decision needed.
5. **Empty `<a>` artefacts.** Sidebar and card-grid links are doubled in source: an empty anchor immediately followed by the labelled anchor to the same URL. Recorded verbatim with `text: ""`. They should be dropped on port — confirm.
6. **Hero image reuse (defect flag).** `2023/11/our-story.png` (1440×524) is the hero cover on six of the eight routes: why-get-training, what-is-ayurvedic-food, what-is-panchkarma, live-to-100, why-pick-an-ayurveda-treatment, ayurvedic-resturant, ayurveda-retreats-for-everyone. Hero C wants a per-page banner — needs a Kairali-Image-Library assignment per route.
7. **og:image ≠ page image.** `/what-is-panchkarma/` and `/live-to-100-with-panchkarma/` both declare `og:image = 2024/11/panchkarma.webp`, a file that does not appear anywhere in main.
8. **Filename/content mismatches.** `/live-to-100-with-panchkarma/` uses `2024/10/learnmore-about-yoga-1.jpg`; `/ayurveda-retreats-for-everyone/` uses `2024/11/Ayurvedic-Training-aboutus-min-1.png` and upscales it from 580px natural to 631px displayed. Both worth replacing at port time.
9. **Empty `alt` on every body figure** (learnmore-about-yoga-1, ayurveda-stress-management-therapy, cooking, Ayurvedic-Training-aboutus-min-1, and all six hero covers). Recorded as `""`, never invented. WCAG 2.2 AA: decorative-or-not must be decided per image, and real alt text drafted where they are informative.
10. **Copy inconsistency, `/ayurveda-retreats-for-everyone/`:** meta description reads "soul, mind and body" / "gives"; the body reads "body, mind and soul" / "give". Live copy is SEO-governed — do not reconcile without a ruling.
11. **Live `<title>` typo, `/ayurveda-retreats-for-everyone/`:** "Halth Treatment". Preserved verbatim.

## Head contract status — live head pass, 22 Sep 2026

**All 8 routes verified against live and filled in.** Each carries `headVerified: "2026-09-22 live head pass"`. Zero `[TO CONFIRM]` remain anywhere in the JSON.

| route | og:image | og:image:type | reading time | article:modified_time | og:locale:alternate |
|---|---|---|---|---|---|
| /why-get-training-in-ayurveda/ | 1440×524 | image/png | 3 minutes | 2025-02-10T11:25:53+00:00 | none |
| /new-to-yoga/ | 1440×459 | image/jpeg | 5 minutes | 2025-03-24T09:01:03+00:00 | none |
| /what-is-ayurvedic-food/ | 1440×524 | image/png | 3 minutes | 2025-02-07T06:36:04+00:00 | fr_FR |
| /what-is-panchkarma/ | 1920×1000 | image/webp | 2 minutes | 2025-07-15T06:53:58+00:00 | fr_FR |
| /live-to-100-with-panchkarma/ | 1920×1000 | image/webp | 2 minutes | 2025-07-15T06:52:34+00:00 | none |
| /why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/ | 1440×524 | image/png | 2 minutes | 2026-04-13T06:28:29+00:00 | fr_FR |
| /ayurvedic-resturant-and-cooking-at-healing-village/ | 1440×524 | image/png | 2 minutes | 2025-03-31T12:17:16+00:00 | fr_FR |
| /ayurveda-retreats-for-everyone/ | 1440×524 | image/png | 2 minutes | 2024-12-10T09:54:13+00:00 | none |

All eight: `ogType: article`, `ogLocale: en_US`, `twitterCard: summary_large_image`, `twitterLabel1: "Est. reading time"`. Two fields beyond the prompt's list were present and have been captured additively: `ogImageType` and `twitterLabel1`.

Six of the eight share the same og:image (`2023/11/our-story.png`, 1440×524) — the generic site banner, not a page image. Only the two panchkarma routes carry a subject-specific one.

### Findings from the pass

1. **`robots` in the delivered record was wrong on all 8.** Every live head declares `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`. The record had `robots: null` throughout — an extractor gap, not the live truth. Corrected on all 8.
2. **No hreflang anywhere.** Not one `hreflang`/alternate link tag in any of the eight heads, although `/de/` and `/fr/` versions of the site exist. Recorded as `{ en: null, de: null, fr: null }` plus `hreflangNote`. This is a live SEO defect, not missing data — worth raising separately from the port.
3. **`og:locale:alternate` is inconsistent.** `fr_FR` on four routes (what-is-ayurvedic-food, what-is-panchkarma, why-pick, ayurvedic-resturant), absent on the other four. No route declares `de_DE`.
4. **Two slug mismatches in the live Knowledge Center sidebar.** The sidebar links to `/ayurvedic-restaurant-cooking-at-healing-village/` (no "and", correct spelling) while the canonical is `/ayurvedic-resturant-and-cooking-at-healing-village/`; and to `/why-pick-an-ayurveda-treatment-orayurvedic-retreat/` (missing hyphen) while the canonical is `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/`. Both canonicals are what the head declares and what the JSON carries. **Open and rule via `Slug Mismatch Check.dc.html`** — it links both spellings of each pair on the live site. Blocks unchanged pending the ruling.

## Owner rulings applied, 22 Sep 2026

### hreflang — draft added

Each route now carries a `draftHreflang` object alongside the live-truth `hreflang` (which stays all-null, because that is what the live head declares). The draft is marked `"status": "DRAFT — approve or replace"`.

Only `en` and `xDefault` are populated, both from the page's own canonical — a value the live page actually declares. **`de` and `fr` are `[TO CONFIRM]`**: no German or French equivalent of any of these eight explainers appears in the live `/de/` or `/fr/` navigation, so there is nothing to point an alternate at. Inventing translated slugs would be the exact failure mode the record exists to prevent. Confirm whether translated explainers exist before any `de`/`fr` alternate is emitted.

### og:image — Codex ask logged (task E)

### Slug mismatches — RULED 22 Sep 2026

Owner: fix the spelling, 301 the old slug. In both pairs the correctly-spelled URL wins.

| route | ported slug | 301 from |
|---|---|---|
| cuisine | `/ayurvedic-restaurant-cooking-at-healing-village/` | `/ayurvedic-resturant-and-cooking-at-healing-village/` (old canonical) |
| why-pick | `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/` (unchanged) | `/why-pick-an-ayurveda-treatment-orayurvedic-retreat/` (malformed sidebar URL) |

Recorded per-route as `meta.slugRuling`; the live canonical stays untouched in the record as truth. Redirect map: `sitemap/redirects-knowledge-explainers.json`.

**One open confirmation.** On the cuisine route the correctly-spelled URL that exists live also drops the word "and", so the ported slug changes in two ways (`resturant`→`restaurant` *and* "and" removed), not one. If the intent was spelling only, the target should be `/ayurvedic-restaurant-and-cooking-at-healing-village/` — which does not currently resolve and would need creating. Flagged in both the record and the redirect map.

**Before deploy:** the Knowledge Center sidebar on all 8 ported pages must be repointed — the live sidebar carries both malformed forms. The cuisine page's `og:url` and canonical tag also need the new slug. Re-check inbound links, the XML sitemap and the 608-route matrix for the old cuisine slug.

### Codex task E — per-page og:images

Six of the eight routes declare the generic site banner `2023/11/our-story.png` (1440×524) as `og:image`; only the two panchkarma routes carry a subject-specific image. Assign a per-page og:image from the Kairali Image Library to these six:

`/why-get-training-in-ayurveda/` · `/new-to-yoga/` · `/what-is-ayurvedic-food/` · `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/` · `/ayurvedic-resturant-and-cooking-at-healing-village/` · `/ayurveda-retreats-for-everyone/`

Each needs: library filename, downloaded and self-hosted under `assets/img/` (never hotlinked, per standing rule 6), plus width, height and MIME type to populate `og:image:width` / `:height` / `:type`. Several routes already have a subject-appropriate in-body image that may serve — e.g. `2024/10/cooking.jpg` on the cuisine route, `2024/11/Ayurvedic-Training-aboutus-min-1.png` on the retreats route. Do not change the record's current og:image values; supply the replacements as a separate mapping for the ported pages.

Also settled: **`h1: null` is the live truth.** The fetched markup renders the page title as `<h2>` twice on every route. Codex task C can be dropped.

The SEO head contract is now complete for all 8 routes.

Also flagged: `images[].width/height` are the record's `<img>` width/height attributes (WordPress's stored natural size), not a re-measure of the files. Confirm before treating them as authoritative.

## In-main navigation — owner ruling: port plus improvement (22 Sep 2026)

Owner delegated the decision. Here it is, with the reasoning. This closes open item 1.

### What the live pages actually do

Every one of the eight explainers injects a navigation block between the title and the first sentence of the article. It is inconsistent three ways:

| route | live heading | what is in it | blocks |
|---|---|---|---|
| /new-to-yoga/ | Knowledge Center | the other explainers | 11 |
| /what-is-ayurvedic-food/ | Knowledge Center | the other explainers | 11 |
| /ayurvedic-resturant-and-cooking…/ | Knowledge Center | the other explainers | 11 |
| /ayurveda-retreats-for-everyone/ | Knowledge Center | the other explainers | 11 |
| /why-get-training-in-ayurveda/ | Things To Do | nature walk, elephant safari, sightseeing by distance | 7 |
| /live-to-100-with-panchkarma/ | Things To Do | same | 7 |
| /why-pick-an-ayurveda-treatment…/ | Things To Do | same | 7 |
| /what-is-panchkarma/ | Things To Do | **corporate pages** — Kairali Ayurvedic Group, Vision and Mission, CSR, Awards | 9 |

Half the routes carry the right nav, three carry a tourism menu, and one carries a corporate menu under a "Things To Do" heading that does not describe its own contents. On `/why-get-training-in-ayurveda/` the reader meets 22 links about elephant safaris before the first line about Ayurveda training.

### The decision

**1. The injected block leaves the article flow.** It moves below the article on all eight routes. Nothing is deleted — every list is retained verbatim, in live order, under its own live heading, as a secondary block beneath the primary one.

**2. One consistent "More in the Knowledge Center" block sits after the article on all eight routes.** Its content is the live Knowledge Center nav already present on four of the eight — the same five groups (Ayurveda, What is Panchkarma?, Yoga, Ayurvedic Cuisine, Ayurvedic Products) and the same link text. No copy is invented; the block is reused across routes that currently lack it. *That cross-route reuse is the one thing here the owner may want to veto — it is existing site content, but it is content moving between pages.*

**3. No accordion.** Standing rule 9 bans hover-only disclosure, and collapsed panels are the same failure for a 45+/55+ reader: they hide the destination behind an interaction and a guess at the label. The full list is 22 short links — short enough to show. Always open, readable with JS off.

**4. Current page marked, not linked.** On each route its own entry renders as current with a bronze rule and `aria-current="page"`, so a reader can see where they are in the set of eight. The live site links each page to itself.

**5. Sequential prev / next within the group**, so the eight read as a set rather than eight unconnected pages — the largest single gain for a reader working through the subject.

### Why this shape for this reader

A 45+ European reader arriving from search wants the article first and the sibling articles second. The live order inverts that on every route. Moving the nav down costs nothing in discoverability — the reader who has finished the article is exactly the one looking for the next one — and removes 7–11 blocks of interruption before the first sentence. Always-open rather than collapsed keeps ~44px targets, no disclosure guessing, and nothing that needs a steady hand.

### How it is marked in the dataset

Each affected block now carries `role: "injected-nav"`, `navGroup` (its live heading) and `portPlacement: "after-article"`. Each route carries a `navBlocks` summary with block range, count, live heading, a taxonomy verdict and a pointer back to this section. Separately `blocks[0]` and the repeated title h2 are marked `absorbed-into-hero` (standing rule 2 — H1 renders once) and `blocks[1]`, the stray `–`, is marked `breadcrumb-artifact`. No block text was altered.

### Open for the owner

- Cross-route reuse of the Knowledge Center list onto the four routes that lack it (point 2).
- Whether the tourism list, and the corporate list on `/what-is-panchkarma/`, belong on explainer pages at all once the sitemap authority lands. Retained verbatim for now — removal is content deletion and not mine to make.

## Deviations from the record, and why

- **`link-card` blocks.** The record represents the six cards at the foot of `/new-to-yoga/` as alternating `figure` + `paragraph` blocks. The prompt defines `link-card` for exactly this shape, so they are emitted as six `link-card` blocks. No `cta` field: the cards carry no separate "View"/"READ MORE" text — the caption itself is the link, and the image is wrapped in the same href.
- **Empty paragraphs dropped.** `<p class="wp-block-paragraph"></p>` fillers (several per route) are not emitted as blocks; noted where the record's paragraph count includes them.
- **Added fields** beyond the prompt's schema, all additive and non-destructive: `h1Note`, `blocksNote`, `linksNote`, `itemsNote`, `counts.h4`, `counts.listItemsInBlocks`, and `note` on individual images/figures. Nothing in the schema was renamed or omitted.
- **Two-column source order.** On `/live-to-100-with-panchkarma/` and `/ayurvedic-resturant-and-cooking-at-healing-village/` the figure sits in a right-hand column beside the preceding paragraphs, so it renders alongside rather than after them. Recorded in DOM order with a `blocksNote`.

## Not done in this task

No page built. Per the standing pipeline this dataset is the input to `AHV Page <Title> Desktop.dc.html` (Hero C + verbatim body) for each of the 8 routes, and each of those needs its own `notes/<slug>-page.md`. Breadcrumbs stay provisional (URL hierarchy) until `sitemap/sitemap-final.json` lands.
