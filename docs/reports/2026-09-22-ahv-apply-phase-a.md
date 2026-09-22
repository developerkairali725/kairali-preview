# AHV — Claude Design families applied, Phase A — 2026-09-22 17:05:00 IST

Owner instruction: "go ahead and apply all families now". Branch `codex/ahv-english-staging-20260915`,
commits `9a605c14` → `7b1548d4` → `567977e6`. Preview (SSO, owner logged in):
**https://kairali-web-factory-ayurvedichealingvillage-ccw2h9esn-kairali.vercel.app**

## What is applied (21 routes, new designs live on the preview)
| Family | Route(s) now on the new design |
|---|---|
| U-1 | /how-to-reach/ |
| U-2 | /faqs-downloads/ |
| U-3 | /sitemap/ |
| U-4 | /defence-and-paramilitary-forces/ |
| U-5 | /revitalizing-and-strengthening-treatment-for-cancer-patients/ |
| T4 STANDARD | /no-preservatives/ |
| T6 PRODUCT | /product-range/ |
| T10 TRAINING | /training-course-fees/ (full V2 rate sheet, course-fee column removed per D-20260922-09) |
| T13 POLICY | /terms-and-conditions/ |
| T7 ARCHIVE | /karma-being-retreat-2019/ |
| T8 OFFER | /offers/ (filled from the record's offer pages) |
| Knowledge Centre hub | /knowledge-centre/ (22-Sep version) |
| T18 ATTRACTIONS | /attractions-above-50kms/ |
| T12 GALLERY | /photo-gallery/ /product-gallery/ /property-gallery/ /retreats-gallery/ /sight-seeing-gallery/ /treatments-gallery/ /villas-gallery/ /yoga-gallery/ |

## How (mechanism, all in git)
- The read-only package is untouched. `tools/import-english-candidate.mjs` gained an **overlay**:
  `english-candidate/package-overlay/` (new view pairs, datasets, repointed `routes.json`,
  `ROUTES-REPOINTED.json` ledger, `OVERLAY.md`). Resolves Q-AHV-PACKAGE-EXTENSION without editing
  the sealed package.
- Two new idempotent repairs run after every import: `repair-claude-design-chrome` (design-board
  unwrap, grey placeholder header/footer → the site's `<dc-import>` chrome, mockup 1440/390 widths
  → 100%, helmet `<title>` stripped and `document.title` made governed, review chips dropped) and
  `repair-claude-design-images` (labelled slots filled from `english-candidate/record-images.json`,
  the pre-apply snapshots' images by meaning: hero / Map 1–3 / grounds plan / photos in order; 34
  slots filled, 13 left labelled and reported).
- Fixed on the way: importer prefixing absolute script URLs (`/ahv/https://unpkg…` 404s on the
  How To Reach maps); importer metadata resolving the wrong dataset record (now prefers the route's
  own dataset); `convert-images-webp` refusing its own earlier output as a "collision";
  `repair-duplicate-canonical` fixed-window lookup and a missing canonical key on /offers/new/.

## Evidence (machine, not self-reported)
- Full chain: 34 tools, all exit 0. 21/21 routes prerendered, 0 failed. `next build` exit 0.
- Playwright, 16 routes × 1440 and 390 = 32 checks: **0 console errors, 0 failed requests,
  0 horizontal overflow, 0 broken images, chrome on every page, no placeholder text, governed title
  on every route** (script: scratchpad `verify-phaseA.mjs`; screenshots in the session scratchpad).
- Preview checked in the owner's Chrome: /offers/, /training-course-fees/ render the new design
  with the real header and record images.

## Visible on the preview by design (facts pending, HARD GATE 6)
`[TO CONFIRM]` chips where no source holds the fact: T8 offer validity/minimum stay/voucher
denominations/two phone numbers; T10 schedule cells; U-4 eligibility/proof/claim/validity; U-5
physician standfirst (Dr. Deepu John) and EUR/USD tariff tabs; U-2 three download slots. The T6
"not sold on this website" line keeps its DRAFT chip for the owner's final look.

## Phase B — not applied, and why (owner's decision on priority)
- Sibling routes of the baked templates: house rules ×7, products, training ×6, legal ×8, past
  retreats ×8, offers/vouchers ×5 — the templates bake one page each; siblings need a data/render
  pair (the package pattern) so their record copy pours into the template.
- T3 ABOUT / T2 ENTITY: Claude Design's datasets are stand-in copy; real datasets must be built
  from the record before wiring.
- T9 INDEX: /packages/ is locked (D-20260921-14); the other index routes need per-route tile
  datasets.
- T1 EXPLAIN: desktop is the older three-page build, mobile is dataset-driven — mismatch.
- T5 FACILITIES: `route` prop is a/b/c/d not a path; T17 CAMPAIGN-SHORT: content by `contentState`.
All source files are in `launches/ayurvedichealingvillage.com/design-intake/`.

## Pre-existing defects surfaced (logged, not fixed)
Q-AHV-CANCER-ROUTE-TITLE (package record title "Yoga retreats for everyone"); the How To Reach
page loads d3/topojson from unpkg (third-party script — Q-AHV-HOW-TO-REACH-MAPS); T13 Terms
page title/§24 (Q-AHV-LEGAL-PAGES-SOURCE-DEFECTS).
