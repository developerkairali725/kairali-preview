# BUILD-REPORT — kairali.com local build (29 September 2026)

**Result: the local build is complete and running at http://127.0.0.1:8774.** Nothing has been deployed, pushed, published or sent. Final visual approval, owner answers (`OWNER-QUESTIONS.md`) and production integrations remain open; see "Publication dependencies" below.

## What was built
- **Stack:** Next.js 16.3.7 (App Router), pnpm with a lockfile, and an isolated local git repo in `local-build/` (no remote).
  - All 156 routes are statically generated.
  - `proxy.ts` reproduces the legacy ASP.NET URL behaviour.
  - Main copy is server-rendered and readable without JavaScript (verified).
- **Content pipeline:** `pipeline/*.py` turns the completed audit capture (read-only, no recrawl) into route data.
  - Every page body comes from the captured live HTML through an allowlist sanitiser.
  - Every route record carries `sourceUrl` and `sourceSha256`.
- **Design:** the approved Premium v3 direction, built from the 2026 brand manual rev. 2 tokens:
  - ivory/white composition, forest actions, a single marigold accent per view, bronze-text overlines;
  - Kurale / Asap / Lato;
  - 1120 px container, 720 px prose measure, pill actions;
  - subtle paper and weave textures, and leaf motifs drawn from the official icon artwork;
  - real company photography and the original 2026 logo SVGs;
  - 150–400 ms motion, disabled under reduced motion.
- **Page families:**
  - Home.
  - Hubs.
  - Long-form pages with an "On this page" rail and a physician call-to-action.
  - Properties, with a Villa Raag owned-and-operated badge and a Svata Katerina partner notice.
  - Product categories.
  - Programmes.
  - Corporate pages and awards: a verified "Certificates in force" panel, a 77-record grid, and a recent-recognitions feed.
  - Award details: `Article` JSON-LD and previous/next links.
  - Listings: news, blog with pagination, archive and testimonials.
  - Photo and video libraries: click-to-load YouTube facades, with unavailable films labelled.
  - Download Centre: 12 current collections (100 editions) and 9 earlier-edition collections (72 files), with search and property, language and currency filters, a no-results state and dated historical rates.
  - Forms: enquiry, contact, consultation, careers with `?id` preselection, Svata enquiry and newsletter.
  - Search: a full-text index with keyboard navigation, section facets and a no-results state.
  - Events: from whyayurveda.org, correctly marked as past.
  - Virtual Tour: Coming Soon.
  - Utility and legal pages, the HTML sitemap, and a 404 page.

## Test evidence (all run against the compiled production build)

| Suite | Result | Evidence |
|---|---|---|
| Route dispositions: all 215 mapped routes, 30 audit observations, and case/guard probes | **179/179** HTTP results as specified, with redirects verified single-hop to a 200 | `evidence/verify-report.json`, `evidence/source-to-render.csv` |
| Legacy documents | **72/72** served at their exact URLs with SHA-256 identical to the owner's legacy manifest (71) or the audit capture (1) | `verify-report.json` → `docs` |
| Content parity against the audit's page-copy blocks | 2,846 distinct blocks on 152 pages. 62 are not found as contiguous text (363 of 61,871 words, 0.6%), and **all 62 are classified as deliberate** (see below). | `source-to-render.csv` → `unmatched_reasons` |
| Media | 290/290 rendered images return 200, all with alt attributes and width/height | `verify-report.json` → `media` |
| Internal links | 304/304 resolve to 200 (at most one redirect). No links point back to old kairali.com or admin.kairali.com hosts. | `verify-report.json` → `links` |
| SEO | 0 failures. Checked on every page: one H1; title; description; absolute production canonical keeping the query identity; OG (title, description, type, url, site_name, 1200×630 image with alt); Twitter large card; Organization and WebSite JSON-LD; BreadcrumbList; no localhost leaks; distinct titles and descriptions on indexable pages; local noindex. The sitemap has 149 URLs, all 200. | `verify-summary.md`, `metadata-register.csv` |
| Browser interaction | **39/39** passed. Coverage: no Google Fonts or other third-party requests on load; no console errors; Kurale/Asap/Lato faces loaded with no synthetic bold; skip link; keyboard mega menu with Escape; visible 3 px focus; mobile drawer; 44 px targets; form errors, focused summary and the "checked — not sent" state with no POST; `apply?id=7` preselection; search results, arrow keys, facets and no-results; download filters and no-results; reduced motion; no-JS rendering; 320 px reflow. | `evidence/interact-report.json`, `evidence/screens/interact/` |
| Screenshots | 28 families at 1440 and 390 px (56 captures), 0 with horizontal overflow | `evidence/screens/*.png`, contact sheets `_sheet_*.jpg` |
| Lab performance (local, unthrottled; not field data) | Home LCP 92 ms, CLS 0.000 | `interact-report.json` |
| External links (report only) | 242/258 return 200. The 16 failures are dead historical third-party pages (award-vote pages, old nabh.co lookups, retired whyayurveda author pages, old kairaliproducts.in product URLs, usakairali.com, kairaliequipment.com returning 500). They are kept as published per R10 and listed for the owner. | `evidence/external-links.json` |

**The 62 unmatched blocks are:**
- form validation messages, which appear only on error in the rebuilt forms;
- CAPTCHA labels (retired);
- gender, age and address labels (owner Q7);
- empty phone stubs such as "Mob: +81-";
- a hidden "Courtesy: Whyayurveda" popup shell;
- the old AJAX search shell;
- consent and checkbox labels, whose wording is re-laid-out;
- opener buttons, which are present but have screen-reader text interleaved.

A compare against the audit's own `scripts/compare.py` can also be run against this build.

## Deliberate source-to-render changes (logged)
- **Deliberate-change log** (`pipeline/out/deliberate-changes.csv`, 34 rows):
  - 7 relative e-mail links corrected to `mailto:`;
  - the Namaste Dwaar link retargeted (Q2);
  - retired sub-brand deep links pointed at their canonical sites;
  - old-CMS image links replaced by self-hosted copies;
  - empty phone stubs removed;
  - the malformed congress award rebuilt from its listing teaser.
- **Metadata** (`evidence/metadata-register.csv`): duplicate titles and descriptions replaced with page-specific ones built from each page's own H1 and copy (92 titles and 89 descriptions changed out of 150). The home page follows Q3.
- **Held back pending the owner:**
  - the raster home statistics band (conflicts with the verified centre count; Q1);
  - the old-address contact map (Q6);
  - the lapsed Ayur Diamond classification (Q4).

## Publication dependencies (not done; must happen before or at launch)
1. Owner answers to `OWNER-QUESTIONS.md` (13 items), and final visual approval of the built site.
2. Form delivery: recipients, endpoint or CRM, consent and retention, medical-data handling, CV storage and a production anti-spam service. See `docs/SEO-ROUTING-DEPLOYMENT.md` → Integrations.
3. Cody's document review (due 5 Oct 2026, 18:00 IST). Until then, no legacy document redirects to a "replacement"; all 72 stay available and dated.
4. Hosting size limits for the 473 MB of legacy files (largest 94.4 MB). If they are exceeded, move the files to the owned document portal and add one-hop 301s.
5. The authorised push, protected staging and production cutover (steps 6–7 of the delivery tracker), then `SITE_ENV=production`. After that: Search Console, sitemap submission, robots, OG fetch, the byte check re-run against the production URL, and field CWV monitoring.
6. Brand approvals still open from design: bronze-text #8A5A12, ink, muted and forest-deep tokens; the missing engraving and texture artwork; a horizontal logo lockup if wanted.
7. Rights: the owner has authorised the company image bank. selected photos are all `register_ok`. The page imagery is the company's own site capture. No specific third-party restriction was found for any asset used; press-kit and third-party award logos appear only as they did on the live pages.

## Where things are
- **Build repo:** `local-build/`, with the site in `site/`, the pipeline in `pipeline/`, documentation in `docs/` and test evidence in `evidence/`.
- **Preview:**
  - run `site/tests/rebuild.sh` to rebuild and restart on 127.0.0.1:8774;
  - the log is at `logs/preview.log`.
- **Tests:** `python3 site/tests/verify.py`, `node site/tests/interact.mjs`, `node site/tests/screens.mjs`, `python3 site/tests/external_links.py`.

## Owner feedback round — 29 September 2026 (square edges, natural casing, mobile section navigation)
Implemented locally in the shared layout. These changes supersede the earlier 16 px card and pill specifications of the brand manual and Premium v3. Colours, typography, motifs, content and routes are unchanged.

**1. Square edges site-wide**
- `--radius` and `--radius-sm` are now 0.
- All 36 `border-radius` declarations are 0, and the one inline radius (certificate thumbnails) is removed. A reset covers native button, select, textarea and input rounding, including `appearance: none` on search inputs.
- This covers buttons, cards, image frames, filter chips, boxed links, search, form and newsletter fields, the social icons, the video play control, badges, notices and table frames.
- Radio buttons keep their native circle, because the shape signals single choice.
- Focus indicators are unchanged (3 px solid forest outline), and hit areas are unchanged (buttons ≥ 48 px).
- Measured rounded elements: home 50 → 0 (desktop) and 43 → 0 (mobile); villa-raag.aspx 38 → 0 (desktop) and 31 → 0 (mobile).

**2. Homepage Ayurvedic Products section**
- **Cause:** the portrait still life (2:3) was placed full-width in a 3:4 frame across six grid columns, with four cover-cropped tiles below it.
- **Redesign:** a compact 12-column editorial band. The heading spans the row; the copy takes 5 columns; the still life takes 3 columns at its natural ratio, height `clamp(300px, 28vw, 420px)`, with `object-fit: contain`; a 2×2 packshot grid takes 4 columns, contained on white so no packaging is cut off.
- Local padding is tightened (`.products-band`).
- **Section height:** desktop 1,578 → 790 px; mobile 2,536 → 1,485 px.
- Evidence: `evidence/screens/square-edges/home-products__{desktop,mobile}__{before,after}.png`.

**3. Natural casing**
- **CSS:** removed `text-transform: uppercase` from overlines, mega-menu titles, the TOC title and footer headings. Tracking went from 0.16em to 0.01em and sizes from 12 to 13–14 px.
- **Labels:** navigation groups are now in sentence case (Ayurvedic products, Learn & train, Our group, Stories & resources, Partner with us). Footer and legal link labels, home overlines and source buttons are sentence case too (Download brochure, Visit website, Apply now, Enquire now, Free online consultation).
- **Source strings:** re-cased at pipeline level from a reviewed map (`pipeline/build_content.py` → `CASE_MAP`):
  - the Villa Raag section headings ("Why choose Villa Raag", "Location & surroundings", "Experiences & amenities");
  - one award title (title case);
  - product names in testimonials (title case);
  - Svata Katerina table labels ("Not possible", "08 days Euro");
  - download labels derived from filenames ("Bulk classical products").
- **Preserved:** acronyms (NABH, ISO, INR, USD, EUR, PDF, PPTX, KTAHV, DLX…), filenames, URLs, identifiers, XML sitemap URLs, and the official logo artwork. Page names keep proper-name or title casing.
- **Logged:** 188 casing changes in `pipeline/out/deliberate-changes.csv`.
- **Site-wide scan:** 149 of 149 sitemap pages have 0 ALL-CAPS text nodes outside allowed acronyms, and 0 elements use uppercase CSS.

**4. Mobile section navigation ("section breaks go to the bottom")**
- **Actual cause:**
  - on rail pages, `.article.with-rail` collapses to a single grid column below 1100 px;
  - the `<aside class="rail">` holding the "On this page" section list follows `<article>` in the DOM;
  - so on mobile the section navigation rendered after all the content. On Villa Raag at 390 px it sat at about 10,180 px on a 12,827 px page.
  - The same happened on every rail page (treatments, medicine, partnerships, Healing Village, locations…). The section dividers themselves were correctly placed between sections.
- **Fix (shared layout):**
  - below 1100 px, a compact accessible `<details>` "On this page" disclosure (`.toc-mobile`) renders before the article, with 44 px link targets;
  - the rail keeps only the physician card after the content;
  - the desktop rail is unchanged;
  - headings with anchors get `scroll-margin-top: 112px` to clear the sticky header.
- **Verified** at 390 and 360 px on six rail pages: the section nav is above the content, anchor targets land below the sticky header, and there is no horizontal overflow.

**Evidence and regression results**
- `site/tests/owner-feedback.mjs`: **150/150** passed. It covers uppercase CSS, ALL-CAPS text, rounded corners and overflow on 10 routes at 1440, 390 and 360 px, plus section-nav placement and anchors.
- `evidence/owner-feedback-report.json`; screenshots in `evidence/screens/square-edges/`.
- Full regression after the changes: verify **0 failures** (179/179 routes, 72/72 documents, 304/304 links, 290/290 images); interactions **39/39**; 56 family screenshots with 0 overflow.

## Owner round 2 and publish readiness — 29 September 2026
Full details, the readiness matrix, the measurement audit and the Saturday checklist are in **DEEPU-HANDOFF.md**. In summary:
- **Controls:** WebKit native control rounding fixed (`appearance: none`, a square select).
- **Caching:** local/preview HTML is now `no-store`.
- **Navigation:** Home removed from the "Our group" submenu.
- **News hub:** 172 dated whyayurveda.org posts; Recent/All; year, topic and search filters; Show more.
- **Group Profile:** rebuilt as a brand overview (57,636 px → 9,390 px at 1440). The root causes are documented.
- **Awards:** browsing with source-stated years only; certifications grouped by verified validity (current / validity ended / not stated); "Back to awards" lands on the record.
- **Reveal animation:** can no longer hide content.
- **Analytics:** GA4 `G-XKRP6ZF1R6` (from the live site) is installed, env-gated, production-only and consent-aware. Firing and account access are **not** verified.
- **Share images:** OG/Twitter images use `NEXT_PUBLIC_ASSET_ORIGIN` so they resolve on the staging host.

**Test results:**
- Round-2 checks: 76/76, in Chromium and WebKit.
- Regressions: verify 0 failures, interactions 39/39, owner-feedback 150/150, screenshots 56 with 0 overflow.

**Content parity is not a pass:** 208 of 2,846 blocks are not on their own page. All 208 are classified, and 145 of them are verified as moved to the awards pages.

**Not launch-ready:** forms are mocked, and recipients, integrations and owner answers are open.
