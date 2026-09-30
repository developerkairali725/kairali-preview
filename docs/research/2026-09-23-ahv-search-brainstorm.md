# AHV site search + programme finder + FAQ filter — design brainstorm

**Written:** 2026-09-22 17:05:00 IST (file named for the 23 Sep review slot the coordinator asked for; the clock read 22 Sep when it was written)
**Site:** Kairali – The Ayurvedic Healing Village (KTAHV), NABH-accredited Ayurvedic hospital — CLINICAL register binds on every string proposed here.
**Worktree:** `.codex-worktrees/ahv-english-staging-20260915`, branch `codex/ahv-english-staging-20260915`, local build `http://localhost:4321` (read-only; not restarted, not rebuilt).
**Owner brief:** "the search function in the package page and the search function in the top bar overall site both need a deep dive brainstorm as per the client requirements — in English (other languages later) — the typos and what they would type to find things, and how the results should look, and easy to use for a 45-year-old; make all of this friction-free in UI and UX."
**Scope addition (D-20260922-26, relayed mid-task):** the FAQ filter on `/faqs-downloads/` — make it predictive and typo-tolerant with the SAME engine; brainstorm missing questions; proofread the 44 Q&A.
**Status:** research + recommendation only. Nothing implemented. Every string marked `[DRAFT — owner approval]` is a proposal, not content. Prices and phone numbers quoted are read from the repo datasets and are cited; none is new.

Evidence labels used: OBSERVED_FIRST_PARTY (measured in this session, headless Chromium against localhost:4321), READ_FROM_REPO (file/line cited), INFERRED (my reasoning), UNVERIFIED (stated as such).

---

## 0. Twenty-line summary

1. Today there are THREE search surfaces and TWO different engines, and none of them is the one the header promises. The header on every shared-chrome page opens an inert dialog whose input says "Search unavailable" (`public/ahv/components/AHV Chrome Header.dc.html:87–91`); the homepage still ships the dead `<a href="#search">` (`public/ahv/views/home-hi-fi-v4.json`, measured: click does nothing, no dialog).
2. `/ayurvedic-treatments/` + its four derived hubs (`tools/build-finder-views.mjs`) run a governed matcher, `public/ahv/assets/programme-search.js` (KTAHVSearch `2026-09-01j`, header comment: "NOT approved for release"), over a 38-record dataset embedded in the view logic. It handles "panchkarma", "slip disk", "diabetis", "sciatica", "spondilitis" correctly (measured) — but returns nothing for "14 days", "price", "airport", "villa", "senior citizen", "vegetarian food", "how to reach", "ayurveda treatement".
3. `/all-programs/` runs a SECOND engine (`AHV_FINDER`, `public/ahv/assets/all-programs-data.js`): substring every-word on name+Sanskrit+aliases, `onChange` not `onInput` (filters on blur/Enter, not as you type — read from the view logic, not measured), no typo tolerance, but it has the better dataset (route, name, sanskrit, categories, minimumNights, from{INR,USD,EUR}, validFrom/To, durationDisplay, aliases).
4. The FAQ filter is the best UX on the site (52px/17px input, as-you-type, status line, Clear, empty state) but matches by raw substring over `textContent` — "flight" finds nothing, "vissa" finds nothing, "veg" matches "vegetarian" only by luck.
5. For a 45-year-old the finder fails on placement, not matching: at 1440 the input sits at y=874 in a 900px viewport and the first result at y=1214; at 390 the input is at y=811/844 and the first result at y=1260. After typing, the answer is off-screen at both widths (measured). Cards are 671px (1440) / 736px (390) tall with four CTAs each; the mobile page is 31,289px long.
6. Register violations exist in the search surfaces themselves: the finder dataset and empty-state copy use the g-word five times, the matcher file carries a "yoga h-word" vocabulary entry and three c-word phrases, and the FAQ view carries 28 banned-word hits (counts in §1.6). They ship inside any index built from these files unless the tool strips or the source is fixed.
7. Prices in both finder datasets are valid to **2026-09-30** (8 days from writing); the finder logic comment mandates a three-currency re-read before any release on/after 1 Oct 2026.
8. **Recommendation: Option A — one instant overlay, one engine, one prebuilt index** (`tools/build-search-index.mjs` → `public/ahv/search-index.json`; `public/design/search.js` + `search.css` keyed on the existing header control), with Option C's six big buttons as the overlay's EMPTY state and a static `/search/?q=` page (Option B-lite) so Enter works without JS and the WebSite `SearchAction` can finally be emitted (`app/(english)/_families/schema.ts:36–41` omits it deliberately until search exists).
9. Same engine, same synonyms table, same vocabulary file feed the programme finder (one search box + 6 condition chips + duration + budget, all live, compact result card) and the FAQ filter (predictive, "Showing results for", WhatsApp/consultation fallback).
10. The matcher we already have is 80% of the engine: keep its governed classes (URGENT / CONSULT_FIRST / NOT_TREATED / MULTI), move its vocabulary out of the JS into `english-candidate/search-vocabulary.json`, add title/FAQ/page fields, prefix + Damerau-Levenshtein (≥5 chars) + trigram fallback, and field boosts.
11. Acceptance = the 140-query set in §2 + the 44-query FAQ set in §5.5, run headless in node against the built index (top-1 asserted), plus a Playwright smoke at 390/1440 for the 45+ rules (input ≥18px, rows ≥52px, first result visible without scrolling).
12. Deterministic (agent lane): index builder, engine, overlay, finder rebuild, tests, register-safe copy. Owner-decided (§7.3, 14 MCQ one-liners): pattern choice, fallback contacts, price display before the 1 Oct sheet, condition-chip set, whether `/all-programs/` folds into the finder, competitor-naming FAQs, FAQ register fixes, which new FAQs get answered, SearchAction emission, popular-search list, search analytics event, clinical sign-off of the vocabulary.
13. Clinical sign-off: the condition→programme mapping IS clinical content (HARD GATE 7). Dr. Deepu John signs the vocabulary before it goes live; the matcher header says as much today.
14. Languages later: the vocabulary already carries DE/FR phrases; the index is per-locale (`search-index.de.json`) and the overlay swaps the file on `<html lang>`. Nothing in the design is EN-only by construction.
15. Unverified in this session: `/all-programs/` typing behaviour in a browser (code-read only); the homepage mobile burger (my selector found none — needs a human look); whether the FAQ answers render lists (the extraction flattened them).
16. No files changed except this report and one temporary measurement script under `sites/ayurvedichealingvillage.com/tests/` (untracked, removed at the end of the session).
17. Register note on this document: banned words are quoted only where a finding requires the exact string, one per line, with the compliance-allow marker.
18. Next step if approved: Lane A on `feature/ahv-search` — index tool + engine + tests first (no UI), then the overlay behind the existing dialog, then the finder rebuild, then the FAQ upgrade — each a separate PR, each gated on the acceptance set.
19. Reply format for the owner: `APPROVE search-option-A` or `CHANGES <notes>`, plus the MCQ answers in §7.3.
20. Everything below is the working material behind lines 1–19.

---

## 1. What exists today (verified)

### 1.1 The header search control

| Surface | What is there | Evidence |
|---|---|---|
| Shared chrome header, desktop | `<button … aria-label="Search" aria-haspopup="dialog" aria-controls="ahv-search-dialog">` 44×44 | `public/ahv/components/AHV Chrome Header.dc.html:31` READ_FROM_REPO; measured at 1440 on `/about-us/`: visible, 44×44, y=14 OBSERVED_FIRST_PARTY |
| Shared chrome header, mobile drawer | `⌕ Search` button, Marcellus 20px, min-height 50px | `…Header.dc.html:61`; measured at 390 in the opened drawer: 50px, 20px OBSERVED_FIRST_PARTY |
| The dialog it opens | `role="dialog" aria-modal="true"`, focus trap, Esc closes, input `placeholder="Search unavailable"`, 17px, min-height 48px, a disabled Search button, copy "Search unavailable." and "INERT DESIGN STATE — search backend unresolved. No request is sent from this review candidate." | `…Header.dc.html:78–91`, logic `:99–125`; measured on `/about-us/` at 1440: box 640px wide at top 90px, input 332×48 @17px, focused on open OBSERVED_FIRST_PARTY |
| Homepage header (own chrome, `data-ahv-family="home-hi-fi-v4"`) | `<a href="#search" onClick="{{ openSearch }}" aria-label="Search">` — two instances at 1440 (44×44 at y=−66 i.e. scrolled/hidden, and 91×44 at y=34); click times out, no `#ahv-search-dialog` appears, hash stays empty | `public/ahv/views/home-hi-fi-v4.json` (grep `href=\"#search\"`); measured OBSERVED_FIRST_PARTY |
| Homepage at 390 | no `[aria-label="Search"]`, no `a[href="#search"]` found; my burger selector found nothing | OBSERVED_FIRST_PARTY for the selectors used; UNVERIFIED whether a differently-labelled burger exists |
| Schema | `WebSite.potentialAction` (SearchAction) DELIBERATELY OMITTED: live points at `/?s={search_term_string}`, a WordPress endpoint this build does not serve | `app/(english)/_families/schema.ts:36–41, 162–163` READ_FROM_REPO |
| Legacy `/search-results/` | served (HTTP 200), article-reader family, `utility7-family-data.js`: noindex, "stays outside navigation" | `english-candidate/route-manifest.json` entry; `public/ahv/assets/utility7-family-data.js` navigationPolicy READ_FROM_REPO |
| Owner ruling | Q-AHV-SEARCH-CONTROL (2026-09-19): "search and translation is a to do to do before live keep it pending" | `QUESTIONS.md:1207–1216` READ_FROM_REPO |
| Header row | D-20260922-17: one 73px row — nav + search + EN/DE/FR + BOOK YOUR STAY | `DIRECTIVES.md:204`, `public/design/chrome.css:1–24` READ_FROM_REPO |

So: the header ALREADY has the right shell (a real dialog with focus management, a labelled input, a close button, Esc). What is missing is everything behind the input. The homepage is the outlier — it must be re-pointed at the same dialog.

### 1.2 Finder A — `/ayurvedic-treatments/` and its four derived hubs

- Generator: `sites/ayurvedichealingvillage.com/tools/build-finder-views.mjs` (149 lines). Reads `english-candidate/finder-views.json` (benchmark view ids, shared block, data patch, four derived hubs) + `finder-additions.json` (the five training courses, tariff ref KAHR/AY-TRG/2026-2027/04/GBL) + `route-manifest.json`; derives `/wellness-programs/` (cat W), `/treatment-programs/` (T), `/training-programs/` (R), `/yoga-meditation-programs/` (Y) from the `/ayurvedic-treatments/` pair (`finder-views.json` → `derived[]`).
- Dataset: `const PROGRAMMES = [...]` embedded in the view logic (`public/ahv/views/ahv-page-ayurvedic-treatments-desktop.json` → `logic`, 38 records). Fields per record: `t` title, `s` Sanskrit, `a` legacy alias title, `g` a trust line (five records carry the g-word here), `x` first sentence of the page, `h` absolute href, `i` image, `c` category letters (`T` treatment, `W` the site's second category label, `R` training, `Y` yoga; multi-letter allowed). No condition field, no duration field, no price field on the record.
- Prices: `const PRICING = { '/panchakarma-therapy/': [14, 318920, 4550, 3990], … }` in the same logic — `[minNights, INR, USD, EUR]` from-totals at minimum stay in a Deluxe single villa; comment: "Current window valid to 30 Sep 2026; mandatory three-currency re-read before any release on/after 1 Oct 2026. Yoga Retreats is intentionally unpriced." Course rows carry `'N-day course · stay from ₹18,410 per night'` (`finder-additions.json` → `courseRate`).
- Engine: `public/ahv/assets/programme-search.js` (395 lines) + `fuse.basic.min.js`, loaded via the view's `scripts` array (measured: `window.KTAHVSearch.version === '2026-09-01j'`, Fuse present, at both widths). What it contains, with line ranges:
  - `norm`/`fold` (accents, ß, DE digraphs) — lines 27–35.
  - `STOP` — EN/DE/FR filler and the generic words Codex struck ("pain", "treatment", "ayurveda", "kerala" are stop words on their own) — 40–46.
  - `MISSPELL` — an APPROVED misspelling map (`panchkarma`, `panchakarama`, `diabetis`, `spondilitis`, `siatica`, `psorisis`, `migrane`, …) instead of unrestricted edit distance for short terms — 51–66.
  - `REHAB_EXEMPT` / `URGENT` (facial droop, chest pain, cannot breathe, sudden weakness…) — 71–96; `CONSULT` (gout, fertility, hair loss, surgery…) — 101–107; `DECLINE` (HIV/AIDS, active TB, communicable disease, "treat cancer" phrasing) — 112–119; `CAVEAT` per route (cancer supportive care, endocrine, hypertension, postnatal, paralysis, de-addiction) — 122–130.
  - `GENERIC` — ambiguous symptoms that return SEVERAL routes (`back pain` → chronic back pain / slip disc / spondylitis; `stress` → two; `yoga` → three; `pain` → four) — 135–156.
  - `TERMS` — the vocabulary: per route, a list of EN/DE/FR phrases and words — 161–197 (34 routes).
  - Matching (200–380): phrases matched whole; single words scored against vocabulary words (hard), title/alias words (soft); prefix ≥4 chars; Levenshtein only when the word is ≥5 chars (tol 1 at 4–6, 2 at ≥7 with first-two-letters guard); result CLASS returned (`DIRECT_MATCH`, `MULTIPLE_POSSIBLE_MATCHES`, `CONSULT_FIRST`, `URGENT_MEDICAL_HELP`, `OUT_OF_SCOPE`, `NOT_TREATED`); comorbidity rule: two strong hits joined by "and/also/," lead with the Personalised Programme.
  - Header comment (lines 4–12): "STATUS: rebuilt 1 Sep 2026 to Codex's CHANGES verdict. NOT approved for release." Review trail cited as `notes/codex-ask-treatments-search-and-shape.md` — that file is NOT in this worktree (searched; only the `.vercel/output` build artefacts and the prerender html match `search`).
- UI (view template): label "How can we help you?" (Marcellus 17.5px), `<input id="p11-filter" type="search" placeholder="e.g. back pain, sleep, detox" onInput>` 17px, min-height 46px, width 310px (desktop) / `id="p11m-filter"` 16px, 48px, 100% (mobile); five category chips 44px high, 14px (desktop) / 13.5px (mobile) uppercase with counts; currency group (₹ INR / $ USD / € EURO) 48px; `aria-live="polite"` result line; help text "Type it however you would say it, in English, German or French — spelling slips are fine…"; urgent / declined / consult / empty states; a 3-column card grid.

### 1.3 Finder B — `/all-programs/`

- View `public/ahv/views/ahv-page-all-programs-desktop.json`, script `public/ahv/assets/all-programs-data.js` (`window.AHV_FINDER`, generated 7 Sep 2026 from `planning/owner-decisions-2026-09-07/FINDER-COPY-AND-DATA.json`; 38 programme records).
- Record shape (the better one): `route, name, sanskrit, categories[], minimumNights, from{INR,USD,EUR}, validFrom, validTo, sourceRef, cardSummary, durationDisplay, priceBasisNote, aliases[]`.
- Matcher (view logic): `hay = [name, sanskrit, ...aliases]`; `q.split(/\s+/).every(w => hay.includes(w))` — substring, every word, no typo tolerance, no conditions, no synonyms. Input is bound with `onChange` (fires on commit, not per keystroke) — READ_FROM_REPO, not measured in a browser.
- Extras this finder has and Finder A lacks: shortlist (localStorage `ahv-shortlist`, max 3), compare drawer, expiry-aware price display ("Request a quote" when `today > validTo`), `emptyHeading/emptyBody/clearFilters` copy.
- Not derived by `build-finder-views.mjs`; a separate template. Two engines, two datasets, two pricing snapshots of the same 38 programmes — a drift risk by construction.

### 1.4 The FAQ filter — `/faqs-downloads/`

- View `public/ahv/views/ahv-page-faqs-and-downloads-desktop.json` (+ `-mobile`), no external scripts. Sticky bar: `⌕` glyph, sr-only label "Filter questions", `<input id="faq-filter" data-filter type="search" placeholder="Type a word — diet, airport, insurance, visa…">` height 52px, 17px Mulish; a `Clear` button (shown only when typed); `data-status` `aria-live="polite"` "Showing all 44 questions in 12 topics". Mobile: `id="faq-filter-m"`, same 52px/17px, placeholder "diet, airport, visa…".
- Logic (`componentDidMount`): on `input`, for every `[data-q]` `<details>`: `match = !q || d.textContent.toLowerCase().includes(q)`; matched items are auto-opened; groups without hits are hidden; the topic rail dims to 0.35 for empty topics; empty state shown when 0 hits; status "N questions match “q”" / "No question matches “q”".
- 44 questions in 12 topics (full list in §5.2).
- Strengths worth keeping: the 52px bar, the immediate status line, auto-open of matches, the rail dimming. Weaknesses: raw substring (no typo tolerance, no synonyms, no ranking — a hit in the answer body counts the same as a hit in the question), no fallback CTA in the empty state (UNVERIFIED — the `[data-empty]` block text was not extracted), and a substring that matches inside words ("art" → "heart", "start").

### 1.5 Measurements (OBSERVED_FIRST_PARTY, headless Chromium, `tests/_search-measure.tmp.mjs`, two runs)

`/ayurvedic-treatments/`:

| Metric | 390×844 | 1440×900 |
|---|---|---|
| Visible search input | `#p11m-filter` 359×48, 16px, at y=811 | `#p11-filter` 310×46, 17px, at y=874 |
| Category chips | 5 chips, 44px high, 13.5px, wrapped on THREE rows (y=619/671/723) | 5 chips, 44px, 14px, one row at y=781 |
| Currency chips | 3 × 48px at y=1070 | 3 × 48px at y=989 |
| First card | 359×736 at y=1261 | 389×671 at y=1222 |
| Card title | 21px | 22px |
| Card CTAs | text "Read More" (21px tall link, 16.5px) + button "Read More" 50px + "Book Now" 50px + "Check suitability on WhatsApp" 44px | same, 48/48/44px |
| Card body | 16.5px, truncated first sentence of the page "Program details What is Panchakarma Therapy? Kairali’s Panchakarma Therapy is…" | same |
| Grid | 1 column | 3 × 389px |
| Cards rendered | 38 | 38 |
| Page height | 31,289px | 12,211px |
| After typing "psoriasis": input top / first result top | 810 / 1260 (viewport 844) | 866 / 1214 (viewport 900) |
| Console/page errors | none | none |

Query behaviour (identical at both widths):

| Typed | Result line | Cards |
|---|---|---|
| panchkarma | 1 programme matches | Panchakarma |
| slip disk | 1 programme matches | Spinal Disc & Nerve Restoration |
| back pain | 3 programmes may apply | Chronic Back Pain / Slip Disc / Spondylitis |
| psoriasis | 1 | Psoriasis & Chronic Skin |
| sciatica | 1 | Spinal Disc |
| diabetis | 1 | Diabetes & Metabolic Balance |
| arthritis | 1 | Joint Rehabilitation & Arthritis |
| stress | 2 may apply | Stress Relief / Yoga-Based Stress & Energy Reset |
| sleep | 1 | Sleep Restoration |
| weight loss | 1 | Weight Management |
| spondilitis | 2 match | Spine Care & Spondylitis / Neck & Upper Back |
| yoga retreat | 1 | Yoga Retreats | <!-- compliance-allow: retreat -->
| 14 days | No close match — a personalised programme may suit you | 0 |
| price | No close match | 0 |
| airport | No close match | 0 |
| senior citizen | No close match | 0 |
| villa | No close match | 0 |
| ayurveda treatement | No close match | 0 |
| vegetarian food | No close match | 0 |
| how to reach | No close match | 0 |

Reading: the matcher is good at what it was scoped for (conditions → programmes) and honest when it fails. The failures are all NON-programme intents — exactly what a SITE search must carry and a programme finder should hand off ("Looking for how to reach us? → /how-to-reach/").

Header (`/about-us/`): desktop trigger 44×44 → dialog with a focused 17px/48px input; mobile drawer entry 50px/20px. Homepage: dead anchor at desktop, nothing found at mobile.

### 1.6 Register findings inside the search surfaces (grep, whole-word, case-insensitive)

- `ahv-page-ayurvedic-treatments-desktop.json`: 5 hits of the g-word (four in the dataset `g` trust lines, e.g. "80% g…-trusted", one in the empty-state paragraph "Many g… come to us with more than one condition"), 1 of the l-word (the shared-block item "World L… Award Winner", `finder-views.json` → `sharedBlock.items[3]`). <!-- compliance-allow: guests -->
- `programme-search.js`: 3 g-word hits (comments), 1 h-word vocabulary entry under `/yoga-retreats/` ("yoga h…day"), 3 c-word phrases (in `DECLINE`, where the phrase exists precisely to REFUSE the claim — keep, but the file needs a lint allow-marker). <!-- compliance-allow: holiday -->
- FAQ view: 14 g-word, 8 l-word, 3 j-word, 2 s-word, 1 r-word hits (itemised in §5.4).
- The route-manifest titles feeding any index carry the same words (`/ayurveda-offers/` "Exclusive L… Ayurveda Offers", `/deluxe-villa/` "L… Ayurveda Retreat", `/ayurveda-retreat-kerala.html`, the `/wellness-r…-kerala.html` legacy slug …) <!-- compliance-allow: retreat -->. A search index built from titles would print them in results. The index tool must therefore take result titles from a governed field (H1 or an override), never raw legacy `<title>`, and the compliance lint must run on `search-index.json` as on any content file.

### 1.7 Facts the index can draw on (all READ_FROM_REPO)

- 254 routes in `english-candidate/route-manifest.json` (252 active EN, 2 deferred RU); metadata `title, description, canonical, ogTitle, ogDescription, ogImage, ogType`; `dataset` names the family data file for 187 routes, `null` for 67 view-helmet routes.
- 38 programme records ×2 datasets (§1.2, §1.3); 33 priced + 5 courses; minimum nights 1/3/7/14/21; from-prices INR/USD/EUR valid to 2026-09-30 (`all-programs-data.js` `validTo`; view logic comment).
- Per-programme page views (e.g. `ahv-page-psoriasis-desktop.json` logic): `whoFor = [...]` (four audience lines), `faqs = [{q,a}, …]` (per-programme FAQ with FAQPage schema), `villaData` (per-night INR/USD/EUR by villa), sections "Who is This Program For?", "Benefits", "Process", "Package Tariffs", "Inclusions", "Daily Activities". These are the "for what" and "answer" fields the results need.
- `docs/rates/RATES_RECKONER.md`: the only price truth (rule 1, line 7); six programme tiers with minimum nights; transfer rates (Palakkad Junction 25 km ₹3,900 MPV / Coimbatore 75 km ₹6,775 / Cochin–Calicut 125 km ₹7,950, lines 62–70, 26–27 sheet); inclusions (two therapies/day, one for Preventive), extended-stay 5% over 28 nights.
- 44 FAQ Q&A (§5.2) + 12 topic headings.
- Vocabulary: 34 routes × EN/DE/FR phrases (`programme-search.js` TERMS), MISSPELL map, GENERIC map, safety lists.
- Locked contacts (CLAUDE.md): info@kairali.com; Priya's KTAHV WhatsApp +91 92898 38797 (already used by the finder's WhatsApp CTA `wa.me/919289838797`); hospital line +91 9555 156 156 (finder urgent note, reckoner line 35).

---

## 2. WHO searches and WHAT they type — the query test set

### 2.1 The people

| Persona | Device / habit | Typical query shape | What "friction-free" means for them |
|---|---|---|---|
| P1 — 52-year-old Indian metro patient (Delhi/Mumbai/Bengaluru), Android, WhatsApp-first | Types 1–3 words, Indian English spellings ("panchkarma", "slip disk", "sugar"), expects a price and a phone number | condition / price / "kairali palakkad" | One box, big text, a number to call, price in ₹ |
| P2 — 47-year-old German/French/Swiss patient, iPhone/laptop, reads English but not natively | Types condition in English with Continental spellings ("rheuma", "spondylose", "Kur"), asks about visa, airport, food, duration | condition / logistics / duration | Duration and from-price in € first, "is my condition treated", how to reach |
| P3 — 45-year-old NRI/UK/US patient, laptop, researches for a parent | Long queries ("ayurveda treatment for my mother arthritis 2 weeks"), "senior citizen", "doctor consultation online" | comorbidity / offers / consultation | Multi-condition handling (Personalised Programme), senior offer, free consultation |
| P4 — companion/booker (spouse, daughter) | "villa", "double occupancy", "vegetarian", "wifi", "what to pack" | stay / food / logistics | FAQ answers inline, not another click |
| P5 — student/therapist (training) | "ayurveda course", "panchakarma therapist training", "TAP-HV", "fees" | course / fee / duration | Course list with days and per-night basis |
| P6 — repeat patient / referral | "kairali", "book", "offers", "contact", "discharge summary", "follow up" | brand / nav | Nav pages rank above content pages |

INFERRED from the site's own audiences (finder `whoFor` lines, FAQ topics, offers pages, training pages) and from the owner's brief ("45-year-old", "international/Indian"). No analytics query log exists yet for this site (search is not live).

### 2.2 The query test set (140 queries; expected top-1 is the acceptance assertion)

Legend: **Top-1** = the page that must rank first; *also* = what the result list should show right after; class = the governed result class where relevant. Programme routes are the real 38 (§1.2/§1.3); non-programme routes are from `route-manifest.json`. Nothing here invents a programme.

#### A. Conditions in plain English (P1/P2/P3)

| # | Query | Top-1 | also / class |
|---|---|---|---|
| 1 | back pain | /treatment-for-chronic-back-pain/ | slip disc, spondylitis (MULTI) |
| 2 | lower back pain | /treatment-for-chronic-back-pain/ | slip disc |
| 3 | slip disc | /treatment-for-slip-disc/ | back pain |
| 4 | slipped disc | /treatment-for-slip-disc/ | |
| 5 | herniated disc | /treatment-for-slip-disc/ | |
| 6 | sciatica | /treatment-for-slip-disc/ | nervous disability |
| 7 | neck pain | /treatment-for-cervical-spondylosis/ | spondylitis |
| 8 | cervical spondylosis | /treatment-for-cervical-spondylosis/ | |
| 9 | spondylitis | /treatment-for-spondylitis/ | cervical, arthritis |
| 10 | ankylosing spondylitis | /treatment-for-spondylitis/ | |
| 11 | arthritis | /treatment-for-arthritis-and-spondylitis/ | |
| 12 | knee pain | /treatment-for-arthritis-and-spondylitis/ | |
| 13 | rheumatoid arthritis | /treatment-for-arthritis-and-spondylitis/ | |
| 14 | joint pain | /treatment-for-arthritis-and-spondylitis/ | spondylitis (MULTI) |
| 15 | psoriasis | /treatment-for-psoriasis/ | skin diseases |
| 16 | eczema | /treatment-for-skin-diseases/ | psoriasis |
| 17 | skin problems | /treatment-for-skin-diseases/ | psoriasis (MULTI) |
| 18 | diabetes | /treatment-for-diabetes/ | weight |
| 19 | sugar | /treatment-for-diabetes/ | (Indian-English synonym; add to vocabulary) |
| 20 | type 2 diabetes | /treatment-for-diabetes/ | |
| 21 | weight loss | /weight-loss-programme/ | diabetes |
| 22 | obesity | /weight-loss-programme/ | |
| 23 | belly fat | /weight-loss-programme/ | |
| 24 | stress | /treatment-to-remove-stress-and-strain/ | yoga-based stress reset (MULTI) |
| 25 | anxiety | /treatment-to-remove-stress-and-strain/ | |
| 26 | burnout | /yoga-based-stress-energy-reset-program/ | stress relief |
| 27 | sleep | /sleep-restoration-therapy/ | |
| 28 | insomnia | /sleep-restoration-therapy/ | |
| 29 | cannot sleep | /sleep-restoration-therapy/ | |
| 30 | high blood pressure | /treatment-for-hypertension/ | |
| 31 | bp | /treatment-for-hypertension/ | (Indian-English; add) |
| 32 | cholesterol | /treatment-for-hypertension/ | |
| 33 | migraine | /treatment-for-sinusitis-and-migraine/ | |
| 34 | headache | /treatment-for-sinusitis-and-migraine/ | |
| 35 | sinus | /treatment-for-sinusitis-and-migraine/ | |
| 36 | asthma | /treatment-for-bronchial-diseases/ | |
| 37 | breathing problem | /treatment-for-bronchial-diseases/ | (URGENT check: "cannot breathe" phrasing shows the note) |
| 38 | digestion | /digestive-wellness-gut-health-yoga-therapy/ | |
| 39 | constipation | /digestive-wellness-gut-health-yoga-therapy/ | |
| 40 | acidity | /digestive-wellness-gut-health-yoga-therapy/ | |
| 41 | ibs | /digestive-wellness-gut-health-yoga-therapy/ | |
| 42 | thyroid | /womens-hormonal-balance-endocrine-therapy/ | CAVEAT line |
| 43 | pcos | /womens-hormonal-balance-endocrine-therapy/ | |
| 44 | menopause | /womens-hormonal-balance-endocrine-therapy/ | |
| 45 | after delivery | /post-pregnancy-health-programme/ | |
| 46 | postpartum | /post-pregnancy-health-programme/ | |
| 47 | paralysis | /treatment-for-paralysis/ | facial paralysis; CAVEAT |
| 48 | stroke rehabilitation | /treatment-for-paralysis/ | (REHAB_EXEMPT — not URGENT) |
| 49 | bells palsy | /treatment-for-facial-paralysis/ | |
| 50 | numbness in hands | /treatment-for-nervous-disability/ | |
| 51 | neuropathy | /treatment-for-nervous-disability/ | |
| 52 | multiple sclerosis | /treatment-for-nervous-disability/ | CONSULT-style caveat advisable (owner/physician) |
| 53 | immunity | /immunity-enhancement-executive-health-assessment-therapy/ | |
| 54 | executive health check | /immunity-enhancement-executive-health-assessment-therapy/ | |
| 55 | eye care | /beauty-care-and-eye-care/ | |
| 56 | dry eyes | /beauty-care-and-eye-care/ | |
| 57 | alcohol addiction | /de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/ | CAVEAT |
| 58 | quit smoking | /de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/ | |
| 59 | cancer support | /revitalizing-and-strengthening/ | CAVEAT "we do not treat cancer itself" |
| 60 | chemotherapy side effects | /revitalizing-and-strengthening/ | CAVEAT |
| 61 | detox | /panchakarma-therapy/ | rejuvenation, preventive (MULTI) |
| 62 | rejuvenation | /holistic-treatment-for-rejuvenation-and-detoxification/ | |
| 63 | tired all the time | /holistic-treatment-for-rejuvenation-and-detoxification/ | |
| 64 | preventive | /preventive-and-regenerative-treatment/ | |
| 65 | annual checkup ayurveda | /preventive-and-regenerative-treatment/ | immunity |
| 66 | back pain and diabetes | /personalized-customized-healing-program/ | back pain, diabetes (comorbidity rule) |
| 67 | more than one problem | /personalized-customized-healing-program/ | |
| 68 | not sure what i need | /personalized-customized-healing-program/ | /online-consultation/ |

#### B. Misspellings and Indian/Continental spellings

| # | Query | Top-1 | how |
|---|---|---|---|
| 69 | panchkarma | /panchakarma-therapy/ | MISSPELL (exists) |
| 70 | panchakarama | /panchakarma-therapy/ | MISSPELL (exists) |
| 71 | pancha karma | /panchakarma-therapy/ | token join rule (new) |
| 72 | punchakarma | /panchakarma-therapy/ | DL≤2 on ≥8 chars (new) |
| 73 | ayurveda treatement | /ayurvedic-treatments/ | "treatement"→treatment via DL1; generic → the finder hub |
| 74 | ayurvedic treatmnt | /ayurvedic-treatments/ | same |
| 75 | ayurved | /ayurveda/ or /ayurvedic-treatments/ | prefix; owner picks the hub (Q-06) |
| 76 | slip disk | /treatment-for-slip-disc/ | "disk"→disc synonym (exists via phrase? measured OK) |
| 77 | siatica | /treatment-for-slip-disc/ | MISSPELL (exists) |
| 78 | scaitica | /treatment-for-slip-disc/ | DL (transposition) |
| 79 | spondilitis | /treatment-for-spondylitis/ | MISSPELL (exists; today returns 2 — assert top-1) |
| 80 | spondylosis | /treatment-for-cervical-spondylosis/ | "did you mean spondylitis?" chip |
| 81 | spondolitis | /treatment-for-spondylitis/ | DL1 |
| 82 | arthritus | /treatment-for-arthritis-and-spondylitis/ | MISSPELL (exists) |
| 83 | arthiritis | /treatment-for-arthritis-and-spondylitis/ | MISSPELL (exists) |
| 84 | psorisis | /treatment-for-psoriasis/ | MISSPELL (exists) |
| 85 | soriasis | /treatment-for-psoriasis/ | MISSPELL (exists) |
| 86 | diabetis | /treatment-for-diabetes/ | MISSPELL (exists) |
| 87 | diabeties | /treatment-for-diabetes/ | MISSPELL (exists) |
| 88 | sugar problem | /treatment-for-diabetes/ | synonym (new) |
| 89 | migrane | /treatment-for-sinusitis-and-migraine/ | MISSPELL (exists) |
| 90 | insomia | /sleep-restoration-therapy/ | MISSPELL (exists) |
| 91 | hypertention | /treatment-for-hypertension/ | MISSPELL (exists) |
| 92 | rheuma | /treatment-for-arthritis-and-spondylitis/ | DE term (exists) |
| 93 | obesety | /weight-loss-programme/ | MISSPELL (exists) |
| 94 | wieght loss | /weight-loss-programme/ | DL (transposition) |
| 95 | strees | /treatment-to-remove-stress-and-strain/ | DL1 (5 chars — at the threshold; assert) |
| 96 | sleeep | /sleep-restoration-therapy/ | MISSPELL (exists) |
| 97 | paralisis | /treatment-for-paralysis/ | MISSPELL (exists) |
| 98 | shirodara | /treatment-to-remove-stress-and-strain/ | DL1 on "shirodhara" (vocabulary word) |
| 99 | abhyangam | /one-day-ayurveda-workshop-program-kerala/ | alias (finder-additions) — programme page also mentions it; assert course top-1 |

#### C. Price, duration, budget (P1/P2/P3)

| # | Query | Top-1 | note |
|---|---|---|---|
| 100 | price | /ayurveda-package/ (packages listing) | overlay also shows the "prices" answer line; owner Q-03 |
| 101 | cost of panchakarma | /panchakarma-therapy/ | answer line "14 nights · from ₹3,18,920 / $4,550 / €3,990 (Deluxe, single)" from the dataset |
| 102 | how much does it cost | /ayurveda-package/ | + FAQ Q19 |
| 103 | 14 days | (facet) programmes with minimumNights=14 | duration facet, not text |
| 104 | 2 weeks | same as 103 | "2 weeks"→14 nights normalisation |
| 105 | 7 days | programmes with minimumNights=7 | |
| 106 | 21 days | minimumNights=21 | |
| 107 | 3 days | /preventive-and-regenerative-treatment/ (3 nights) + 3-day course | |
| 108 | one week detox | /holistic-treatment-for-rejuvenation-and-detoxification/ (7 nights) | duration + condition |
| 109 | cheapest programme | /preventive-and-regenerative-treatment/ | lowest from-total in the dataset — sort by `from`, do not hard-code |
| 110 | price list pdf | /ayurveda-package/ → tariff PDFs (`/ahv/assets/doc/KTAHV-Ayurveda-Packages-INR-Price-List-2025-26.pdf` etc.) | from the finder logic TARIFF map |
| 111 | rates 2026 | /ayurveda-package/ | validity note |
| 112 | euro price | /ayurveda-package/ with EUR toggle | currency hint |

#### D. Travel, visa, logistics (P2/P4)

| # | Query | Top-1 | also |
|---|---|---|---|
| 113 | how to reach | /how-to-reach/ | FAQ Q23–Q25 |
| 114 | airport | /how-to-reach/ | FAQ Q23 (Coimbatore 75 km) |
| 115 | nearest airport | /how-to-reach/ | |
| 116 | coimbatore to kairali | /how-to-reach/ | transfer rate FAQ Q24 |
| 117 | pickup from airport | /how-to-reach/ | FAQ Q24 |
| 118 | railway station | /how-to-reach/ | Palakkad Junction |
| 119 | visa | FAQ Q36 | /how-to-reach/ |
| 120 | medical visa india | FAQ Q36 | |
| 121 | map | /map/ | /how-to-reach/ |
| 122 | palakkad | /destination-palakkad/ | /how-to-reach/ |
| 123 | weather | FAQ Q27 | Q28 |
| 124 | best time to visit | FAQ Q28 | |

#### E. Stay, food, facilities (P4)

| # | Query | Top-1 | also |
|---|---|---|---|
| 125 | villa | /our-villas/ | deluxe/classic/royal/maharaja |
| 126 | deluxe villa | /deluxe-villa/ | |
| 127 | maharaja suite | /maharaja-suite/ | |
| 128 | rooms | /our-villas/ | FAQ Q16 |
| 129 | vegetarian food | /vegetarian/ | FAQ Q20 |
| 130 | food | /ayurvedic-cuisine/ | /vegetarian/, FAQ Q20–Q22 |
| 131 | vegan | FAQ Q21 | /ayurvedic-cuisine/ |
| 132 | alcohol | /alcohol-free/ | FAQ Q22 |
| 133 | wifi | FAQ Q17 | |
| 134 | swimming pool | FAQ Q17 | /village-facilities/ |
| 135 | what to pack | FAQ Q29 | |
| 136 | laundry | FAQ Q31 | |

#### F. Doctor, consultation, contact, brand, offers, training (P3/P5/P6)

| # | Query | Top-1 | also |
|---|---|---|---|
| 137 | doctor consultation | /online-consultation/ | FAQ Q11 |
| 138 | free consultation | /online-consultation/ | |
| 139 | talk to a doctor | /online-consultation/ | /contact-us/ |
| 140 | contact | /contact-us/ | |
| 141 | phone number | /contact-us/ | answer line: +91 9555 156 156 (dataset) |
| 142 | whatsapp | /contact-us/ | WhatsApp fallback row |
| 143 | book | /book-now/ | |
| 144 | enquiry | /enquiry-form/ | |
| 145 | kairali palakkad | / (home) | /about-us/, /how-to-reach/ |
| 146 | kairali ayurvedic healing village | / | |
| 147 | nabh | /accreditations/ | |
| 148 | awards | /awards-and-accolades/ | |
| 149 | reviews | /read-feedback/ | |
| 150 | offers | /offers/ | senior, defence, olympics |
| 151 | senior citizen | /offers/senior-citizen-offer/ | FAQ Q35 |
| 152 | discount | /offers/ | |
| 153 | army discount | /offers/defence-paramilitary-personnel-get-upto-30-off/ | |
| 154 | gift voucher | /gift-vouchers/ | |
| 155 | yoga retreat | /yoga-retreats/ | yoga & meditation package | <!-- compliance-allow: retreat -->
| 156 | meditation | /yoga-and-meditation-package/ | /meditation/ |
| 157 | yoga teacher training | /yoga-meditation-training/ | |
| 158 | training course | /ayurveda-training-programme/ | five courses |
| 159 | ayurveda course fees | /training-course-fees/ | /ayurveda-training-programme/ |
| 160 | panchakarma therapist training | /ayurveda-training-programme/ | AALCT-HV course |
| 161 | tap-hv | /three-day-short-term-ayurveda-certificate-program-tap-hv/ | alias (exists) |
| 162 | internship | /internships-at-kairali/ | |
| 163 | jobs | /careers/ | |
| 164 | gallery | /gallery/ | photo/video/villas galleries |
| 165 | video | /video-gallery/ | /virtual-tour/ |
| 166 | faq | /faqs-downloads/ | |
| 167 | cancellation policy | /cancellation-and-refund-policy/ | |
| 168 | walk in treatment | /walk-in-ayurveda-treatment/ | |
| 169 | monsoon treatment | /karkidaka-chikitsha-or-monsoon-wellness.html | FAQ Q28 |
| 170 | what is panchakarma | /what-is-panchkarma/ | /panchakarma-therapy/ |

#### G. Safety / out-of-scope (must NOT sell a programme)

| # | Query | Class | Expected surface |
|---|---|---|---|
| 171 | chest pain | URGENT_MEDICAL_HELP | urgent note (hospital line + local emergency) above any results; no card sells |
| 172 | face drooping since this morning | URGENT | same |
| 173 | hiv | NOT_TREATED | "This is not something we treat." + consultation link |
| 174 | fertility | CONSULT_FIRST | "We would rather talk to you about this" + WhatsApp/consultation |
| 175 | hair fall | CONSULT_FIRST | same |
| 176 | asdfgh | OUT_OF_SCOPE | zero-result screen (§3.1 rule Z) |

That is 176 rows; the ≥120 bar is met with the 68 condition + 31 misspelling + 13 price + 12 travel + 12 stay + 36 nav/brand + 6 safety rows. Rows 1–99 and 171–176 exercise the existing engine's rules; rows 100–170 are the NEW obligations a site search adds.

### 2.3 What the set tells us about matching (INFERRED)

1. About a third of real queries are not conditions at all — they are prices, durations, logistics, contact. A programme-only vocabulary answers "No close match" to a third of the traffic. That is why the finder measured 8 of 20 as zero results.
2. Typos cluster in four shapes: dropped vowel (panchkarma, diabetis), swapped pair (wieght, scaitica), phonetic (siatica, soriasis, migrane), and Continental/Indian variants (rheuma, sugar, bp, disk). The MISSPELL map covers shape 1 and 3 for the short words; shapes 2 and 4 need transposition-aware distance and a synonyms table.
3. Numbers are facets, not text: "14 days", "2 weeks", "3 nights" must normalise to `minimumNights` and filter, never be fuzzy-matched against titles.
4. Two-intent queries ("cost of panchakarma", "back pain and diabetes") need the engine to score the condition AND detect the modifier (price / duration / and-join), and the result to answer BOTH on one line.

---

## 3. Three design options for the top-bar site search

Common ground for all three (the shell already exists — `AHV Chrome Header.dc.html:78–91`):

- The trigger stays the 44×44 header button on shared chrome and the drawer's 50px "⌕ Search" row on mobile; the homepage anchor is re-pointed to the same dialog.
- Index: ONE prebuilt JSON, generated by a tool, loaded lazily on first open (not on page load). No server, no API, no third-party search SaaS (HARD GATE 15 — nothing new to install; Fuse basic is already vendored).
- Engine: the governed matcher (`KTAHVSearch` classes and safety lists) extended per §6, shared with the finder and the FAQ.
- Fallback row is ALWAYS visible, in every state: **Ask Priya on WhatsApp** (+91 92898 38797, locked fact) · **Free online consultation** (`/online-consultation/`) · **Call +91 9555 156 156** (hospital line as printed in the finder's urgent note and the reckoner). Owner confirms the trio in Q-02.

### 3.1 Option A — instant overlay (RECOMMENDED)

```
 1440 ─────────────────────────────────────────────────────────────────────────
 ┌───────────────────────────────── dialog 760px, top 8vh ────────────────────┐
 │  Search Kairali                                                     [ ✕ ]  │
 │  ┌──────────────────────────────────────────────────────────────────────┐  │
 │  │ ⌕  back pain                                                    Clear │  │  ← 18px text, 56px tall
 │  └──────────────────────────────────────────────────────────────────────┘  │
 │  Showing results for “back pain” · 3 programmes, 2 answers, 1 page         │  ← aria-live
 │                                                                            │
 │  PROGRAMMES                                                                │
 │  ┌──────────────────────────────────────────────────────────────────────┐  │
 │  │ Chronic Back Pain Relief Treatment                                 › │  │  ← row 64px
 │  │ 14 nights · from ₹3,09,750 · long-standing lower-back pain            │  │  ← one-line answer
 │  ├──────────────────────────────────────────────────────────────────────┤  │
 │  │ Spinal Disc & Nerve Restoration Treatment                          › │  │
 │  │ 14 nights · from ₹3,09,750 · slipped disc, sciatica                   │  │
 │  ├──────────────────────────────────────────────────────────────────────┤  │
 │  │ Spine Care & Spondylitis Treatment                                 › │  │
 │  │ 14 nights · from ₹3,09,750 · spine stiffness, spondylitis             │  │
 │  └──────────────────────────────────────────────────────────────────────┘  │
 │  QUESTIONS                                                                 │
 │  ┌──────────────────────────────────────────────────────────────────────┐  │
 │  │ How long should I stay for effective results?                      › │  │
 │  │ What specific health conditions can be managed with Ayurveda?      › │  │
 │  └──────────────────────────────────────────────────────────────────────┘  │
 │  PAGES                                                                     │
 │  │ Ayurvedic Treatment Programmes (all 29)                             › │  │
 │                                                                            │
 │  Not sure? Our doctors decide what suits you, at consultation.             │
 │  [ Ask Priya on WhatsApp ]  [ Free online consultation ]  [ Call +91 … ]   │  ← always visible
 └────────────────────────────────────────────────────────────────────────────┘

 390 ─────────────────────────────
 ┌──────────────── full screen ───┐
 │ Search                    [ ✕ ]│
 │ ┌────────────────────────────┐ │
 │ │ ⌕ back pain          Clear │ │  ← 18px, 56px
 │ └────────────────────────────┘ │
 │ Showing results for “back pain”│
 │ PROGRAMMES                     │
 │ ┌────────────────────────────┐ │
 │ │ Chronic Back Pain Relief › │ │  ← 64px rows,
 │ │ 14 nights · from ₹3,09,750 │ │     3 visible
 │ ├────────────────────────────┤ │     above the
 │ │ Spinal Disc & Nerve …    › │ │     fold
 │ ├────────────────────────────┤ │
 │ │ Spine Care & Spondylitis › │ │
 │ └────────────────────────────┘ │
 │ QUESTIONS  …                   │
 │ ┌────────────────────────────┐ │
 │ │ WhatsApp │ Consult │ Call  │ │  ← sticky bottom bar 56px
 │ └────────────────────────────┘ │
 └────────────────────────────────┘
```

**Empty state (before typing) — this is where Option C lives:**

```
 │  What are you looking for?                                                 │
 │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                        │
 │  │ A health     │ │ Prices and   │ │ How to reach │   ← 6 buttons, 72px,  │
 │  │ condition    │ │ duration     │ │ us           │     18px, 2×3 / 3×2   │
 │  ├──────────────┤ ├──────────────┤ ├──────────────┤                        │
 │  │ Where you    │ │ Learn        │ │ Talk to a    │                        │
 │  │ will stay    │ │ Ayurveda     │ │ doctor       │                        │
 │  └──────────────┘ └──────────────┘ └──────────────┘                        │
 │  Often searched: back pain · Panchakarma · psoriasis · diabetes · airport  │  ← owner-listed, Q-11
```

Tapping "A health condition" pre-fills nothing; it swaps the empty state for the six condition chips (§4.2) inside the overlay; "Prices and duration" opens `/ayurveda-package/`; "How to reach us" opens `/how-to-reach/`; "Where you will stay" `/our-villas/`; "Learn Ayurveda" `/ayurveda-training-programme/`; "Talk to a doctor" `/online-consultation/`.

**45+ rules (the checklist the Playwright smoke asserts):**

1. Input text 18px (not 17), input height 56px, 16px side gutter at 390, no zoom on focus (font ≥16px guarantees it on iOS).
2. Result rows ≥64px (title 18px + answer 15px); minimum tap target 48px everywhere; row is one `<a>` — the whole row is the link.
3. Results render INSIDE the dialog, never in a floating listbox that closes on blur; nothing disappears when the finger lifts or the mouse drifts.
4. The dialog stays open until ✕, Esc, backdrop tap, or a result is chosen.
5. Search-as-you-type from 2 characters, 80ms debounce; no Search button required (the disabled one goes); Enter opens the top result; on a page with no JS, Enter submits to `/search/?q=` (form action) — Option B-lite.
6. Typo handling is spoken, not silent: "Showing results for “panchakarma” — you typed “panchkarma”". When two corrections are plausible, "Did you mean: spondylitis · spondylosis" as 48px chips.
7. Group order: Programmes → Questions → Pages, capped at 3 / 3 / 3 with a "Show all N" link per group; the total list never exceeds one scroll on a 844px phone.
8. One-line answer per programme row: `duration · from-price (chosen currency) · plain-English "for what"` — duration from `minimumNights`, price from `from{cur}`, "for what" from the vocabulary's first two EN phrases. Never a marketing sentence.
9. Currency follows a small ₹/$/€ toggle in the overlay header (persisted in localStorage `ahv-cur`, default INR for `en-IN`/no hint, EUR for DE/FR locales later).
10. Zero-result screen (rule Z): "No page matches “xyz”. Try a condition (back pain, psoriasis), a place (airport) or a question (visa)." + the six buttons of the empty state + the fallback row. Never blank.
11. Safety classes render before results: URGENT shows the same red-left-border note as the finder; NOT_TREATED shows the decline sentence; CONSULT_FIRST shows the "we would rather talk to you" sentence with the fallback row promoted to the top.
12. Highlight the matched term in the title (`<mark>` with the site's gradient underline), never the whole row.
13. Fallback row always visible: at 390 as a sticky bottom bar (56px); at 1440 at the dialog's foot.
14. Keyboard: Tab order input → results → fallback → ✕; ArrowDown/Up move a visible focus ring through rows; Home/End; Esc closes and returns focus to the trigger (already implemented in the header logic).
15. Screen reader: `role="dialog" aria-modal="true" aria-labelledby`; results in a `<ul role="listbox">`? — NO: keep them plain `<ul>` of links (listbox semantics fight with the answer line); `aria-live="polite"` status line announces the count and the correction; each row has a visible label and no title attribute tricks.
16. Colour contrast ≥4.5:1 for the answer line (#514a3f on #F7F4EA passes); focus ring 3px #006038.
17. `prefers-reduced-motion`: no slide-in; overlay fades 120ms or not at all.
18. No spinner: the index is local; if it has not loaded yet (first open on slow 3G), show "Loading search…" in the status line and keep the input live.
19. Index loads on first open (or on hover of the trigger at desktop); `<link rel="prefetch">` only after the page's LCP.
20. Index budget: ≤120KB raw, ≤35KB gzip (estimate §3.4). Engine ≤12KB gzip (programme-search.js is ~17KB raw today; Fuse basic ~7KB). Hard cap enforced by the build tool.
21. Query normalisation: lowercase, NFD-strip accents, ß→ss, curly quotes, hyphen/space folding ("post-pregnancy" = "post pregnancy"), number words ("two weeks" → 14).
22. Stop words removed for scoring but the raw query is always echoed back verbatim in quotes.
23. Minimum 2 chars before search; 1 char shows the empty state.
24. Clear (×) inside the input, 44px, returns to the empty state, keeps focus.
25. The dialog title says "Search Kairali" — a name, not "Search the site".
26. Placeholder: "Condition, price, airport, visa…" — examples, not instructions; disappears on focus.
27. Results never show raw `<title>` tags (register risk §1.6); they show the governed `h1` field or the index's `label` override.
28. Programme rows show the Sanskrit name as a second line only at ≥768px (it is trust, not navigation).
29. Question rows open the FAQ page with `#q-NN` and the details element open, and the FAQ filter pre-filled with the query (deep link contract with §5).
30. Page rows show a 1-line description from `route-manifest.metadata.description` truncated at 90 chars, register-linted at build time.
31. Recent searches: none stored (privacy; nothing to consent). "Often searched" is an owner-listed static list (Q-11).
32. Analytics: one consent-gated event `search` with `{q_length, result_class, top_group}` — never the raw query — via the existing consent-gated GA4/Clarity build (D-20260915-01). Owner Q-12.
33. The overlay never changes the URL (no history entries); choosing a result navigates normally.
34. Back button on mobile closes the overlay first (a `popstate` guard) so the patient is not thrown off the page.
35. Works with the language switch: `<html lang>` selects `search-index.{lang}.json`; strings in the overlay come from the index's `ui` block, so DE/FR later is a data change.
36. Body scroll locked while open; the overlay itself scrolls; at 390 it is full-screen (no 28px gutter box).
37. Print: the dialog is `display:none` in print CSS.
38. No-JS fallback: the header button becomes a link to `/search/`.
39. The finder pages and the FAQ page open the same overlay from the header; their own boxes stay (they are the deeper tools).
40. One shared CSS file, tokens from the existing chrome (Marcellus for titles, Mulish for rows, #006038/#C1882C accents) — no new palette.
41. Touch: rows respond on `pointerup`, no 300ms delay (`touch-action: manipulation`).
42. No infinite scroll, no pagination: "Show all N" expands the group in place, max 12 rows per group.
43. Numbers stay Indian-grouped for INR (₹3,09,750) and Western-grouped for USD/EUR — the finder's `gINR`/`gr` helpers already do this.
44. Price rows carry the basis in a tooltip-free way: the answer line ends with "(Deluxe, single)" and the packages page carries the full note — never a bare number (HARD GATE 6 honesty; reckoner rule).
45. After 2026-09-30 the prices in the index are STALE by dataset `validTo`; the build tool refuses to build a priced index past `validTo` unless `--allow-expired` is passed, and the overlay then prints "Request a quote" like `/all-programs/` does today.
46. Every visible string in the overlay passes the compliance lint at build (register lock).
47. Lighthouse: the overlay adds no render-blocking request; the CSS is ≤4KB and inlined into `chrome.css`'s successor or loaded `media="print" onload` style.
48. Acceptance: §2 set top-1 + §5.5 FAQ set + the 390/1440 smoke (input ≥18px, rows ≥64px, first three results within the viewport after typing "back pain").

**Zero-result behaviour** — rule 10 + rule 11. **Mobile** — full-screen, sticky fallback bar, chips wrap two per row. **Performance** — §3.4. **Accessibility** — rules 14–17. **Static-host** — a JSON file + two static assets, built by `tools/build-search-index.mjs`, served from `public/`; no function, no edge. **Languages later** — rule 35.

### 3.2 Option B — a results page `/search/?q=`

```
 /search/?q=back+pain
 ┌────────────────────────────────────────────────────────────┐
 │ [shared header]                                            │
 │ Search results for “back pain”                             │
 │ ┌────────────────────────────────────────┐ [ Search ]      │
 │ │ ⌕ back pain                            │                 │
 │ └────────────────────────────────────────┘                 │
 │ 3 programmes · 2 questions · 1 page        [₹] [$] [€]     │
 │                                                            │
 │ ▌Chronic Back Pain Relief Treatment          14 nights     │
 │  from ₹3,09,750 · long-standing lower-back pain   [Read]   │
 │ ▌Spinal Disc & Nerve Restoration …                         │
 │ …                                                          │
 │ Questions                                                  │
 │  ▸ How long should I stay for effective results?  (opens)  │
 │ [Ask Priya on WhatsApp] [Free online consultation]         │
 └────────────────────────────────────────────────────────────┘
```

- A static Next route (`app/(english)/search/page.tsx`, prerendered shell, `noindex`), the header input becomes a `<form action="/search/" method="get">`; on load the page reads `?q=`, loads the same index and engine, renders the same groups.
- Pros: shareable URL ("send my mother the link"); enables the `WebSite.SearchAction` (`/search/?q={search_term_string}`) so Google can show a sitelinks searchbox — the exact thing `schema.ts:36–41` is waiting for; works with JS disabled up to the form submit; no modal focus-management risk.
- Cons for a 45-year-old: one more page load between question and answer; the header input on the results page and the header input in the dialog are two inputs; on mobile the drawer must close, then the page loads.
- Same 45+ rules apply to the page; rows can be taller (80px) with the image.
- Static-host: fully static; the `?q=` is read client-side.

### 3.3 Option C — guided "I am looking for…" chooser

```
 ┌───────────────────────── dialog ─────────────────────────┐
 │  I am looking for…                                 [ ✕ ] │
 │  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐│
 │  │ 🩺 Treatment for │ │ ₹ Prices &      │ │ ✈ How to     ││  ← 6 buttons 96px
 │  │   a condition    │ │   duration      │ │   reach      ││     20px labels
 │  └─────────────────┘ └─────────────────┘ └──────────────┘│
 │  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐│
 │  │ 🏡 Villas & food │ │ 📚 Ayurveda     │ │ 👩‍⚕️ Talk to a ││
 │  │                  │ │   training      │ │   doctor     ││
 │  └─────────────────┘ └─────────────────┘ └──────────────┘│
 │  ── or type ───────────────────────────────────────────── │
 │  ┌──────────────────────────────────────────────────────┐ │
 │  │ ⌕                                                    │ │
 │  └──────────────────────────────────────────────────────┘ │
 └───────────────────────────────────────────────────────────┘
   → "Treatment for a condition" → step 2: 6 condition chips
     (Back & joints · Skin · Stress & sleep · Weight & diabetes ·
      Women's health · Detox & prevention) → step 3: results
```

- Pros: zero typing for the least confident user; no typo problem at all on the button path; maps 1:1 to the six intents in §2.
- Cons: two or three taps before a result for people who know the word ("psoriasis"); the chips can never cover 38 programmes without a "More…" (which is a list again); it hides the free-text box that P1/P3 want first.
- Verdict: excellent as the EMPTY state of Option A, poor as the whole answer.

### 3.4 Performance — the index size (estimated from the datasets, INFERRED)

| Block | Records | Bytes/record (est.) | Raw |
|---|---|---|---|
| Routes (label, path, description ≤90ch, kind, boost) | 252 | ~220 | ~55KB |
| Programmes (route, name, sanskrit, categories, minimumNights, from{3}, forWhat, vocabulary EN ~12 terms) | 38 | ~600 | ~23KB |
| FAQ (id, topic, question, answer ≤400ch, keywords) | 44 | ~520 | ~23KB |
| Programme-page FAQs (route, q, a ≤200ch) | ~38×5 | ~260 | ~50KB — make optional (`--with-page-faqs`), or index question only (~12KB) |
| Synonyms + misspellings + safety lists | — | — | ~10KB |
| UI strings | — | — | ~2KB |
| **Total (question-only page FAQs)** | | | **~125KB raw ≈ 30–35KB gzip** |

Engine + Fuse ≈ 25KB raw / 9KB gzip. All lazy, nothing on the critical path. A 45-year-old on a 4G phone waits for nothing perceptible.

### 3.5 Side-by-side

| | A overlay | B page | C chooser |
|---|---|---|---|
| Taps to first result (knows the word) | 2 (open, type) | 3 (open, type, load) | 4 |
| Taps to first result (does not know the word) | 3 (open, button, chip) | 4 | 3 |
| Typo tolerance | engine | engine | n/a on button path |
| Shareable URL | no | yes | no |
| SearchAction schema | needs B-lite | yes | no |
| No-JS | needs B-lite | yes | no |
| Focus/scroll-lock risk | medium (shell exists, tested) | none | medium |
| Static-host | yes | yes | yes |
| DE/FR later | index swap | index swap | index + labels |
| **Recommendation** | **primary** | **lite: static page + form fallback + schema** | **as A's empty state** |

---

## 4. The programme finder

### 4.1 What is wrong today for a 45-year-old (measured, §1.5)

1. **The box is below the fold at both widths.** 1440: input at y=874 in a 900px viewport (its top edge is visible, its purpose is not — the label "How can we help you?" and the chips are what the eye lands on after the hero). 390: input at y=811 of 844. The hero image and h1 spend the first screen.
2. **The answer is off-screen after typing.** Desktop: first card at y=1214 vs input at 866 — 350px of currency toggle, tariff line, help text and the "Choose Your Programme" h2 sit between the question and the answer. Mobile: first card at y=1260 vs input at 810 — the patient types, sees "1 programme matches “psoriasis”" and a wall, and must scroll to learn which programme.
3. **Chips are small and, on mobile, three rows deep.** 13.5–14px uppercase with 1px tracking on 44px buttons, wrapped at y=619/671/723 — five category labels ("Wellness / Treatment / Training / Yoga & Meditation") that a patient does not think in; nobody has "a wellness". Conditions are what they think in. <!-- compliance-allow: wellness -->
4. **Cards are tall and noisy.** 671–736px per card, four CTAs (two "Read More", "Book Now", "Check suitability on WhatsApp"), a truncated first sentence that starts with "Program details About the Program…", and a trust line that carries a register violation. 38 cards make the mobile page 31,289px tall; a 45-year-old thumbs through 37 screens.
5. **Duration and price are present but buried** ("Minimum stay: 14 nights · From ₹3,18,920" in Marcellus 17px as a third line). They should be the second thing on the card.
6. **Two finders, two engines** (§1.3): `/all-programs/` does not filter as you type (`onChange`), has no typo tolerance, but has the shortlist/compare and the dated price logic; `/ayurvedic-treatments/` has the governed matcher but no duration/price facets. A patient landing on either gets half.
7. **Non-programme intents dead-end** (8 of 20 test queries). "how to reach", "airport", "villa", "vegetarian food", "price", "senior citizen" produce "No close match — a personalised programme may suit you", which is wrong advice for "airport".
8. **The help text asks the patient to read** ("Type it however you would say it, in English, German or French — spelling slips are fine. This finds the programme to ask about; our doctors decide what suits you, at consultation.") — 34 words, 16px, under the box. Good sentence, wrong place; the box should demonstrate it.
9. **Steps to a result today** (desktop): scroll past hero → find the box → type → scroll again → read card → choose between two "Read More" = 6 decisions. Mobile adds two more scrolls.

### 4.2 Recommended change (one finder template, one engine, one dataset)

```
 1440 ─ /ayurvedic-treatments/ (and the 4 hubs, /all-programs/ folded in — Q-05)
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │ [header]                                                                     │
 │ Ayurvedic Treatment Programmes                                       (h1)    │
 │ ┌──────────────────────────────────────────────────────────┐  ₹  $  €        │  ← sticky bar
 │ │ ⌕  What brings you to us? e.g. back pain, psoriasis      │                 │     56px input
 │ └──────────────────────────────────────────────────────────┘                 │     18px
 │ [Back & joints] [Skin] [Stress & sleep] [Weight & diabetes] [Women's health] │  ← 6 chips 48px
 │ [Detox & prevention]        Duration: [Any] [≤7] [14] [21+]   Budget: [Any ▾]│     16px
 │ Showing 3 programmes for “back pain”                                          │  ← aria-live
 │ ┌────────────────────────┐ ┌────────────────────────┐ ┌──────────────────┐   │
 │ │ [img 16:9, 140px]      │ │                        │ │                  │   │
 │ │ Chronic Back Pain      │ │ Spinal Disc & Nerve    │ │ Spine Care &     │   │  ← card ≤ 360px
 │ │ Relief Treatment       │ │ Restoration Treatment  │ │ Spondylitis      │   │
 │ │ 14 nights · from       │ │ 14 nights · from       │ │ 14 nights · from │   │  ← 2nd line, 17px
 │ │ ₹3,09,750              │ │ ₹3,09,750              │ │ ₹3,09,750        │   │
 │ │ For: long-standing     │ │ For: slipped disc,     │ │ For: spine       │   │  ← "for what", 16px
 │ │ lower-back pain        │ │ sciatica               │ │ stiffness        │   │
 │ │ [ Read the programme ] │ │ [ Read the programme ] │ │ [ Read … ]       │   │  ← ONE CTA 52px
 │ │ Ask on WhatsApp ›      │ │ Ask on WhatsApp ›      │ │ Ask on WhatsApp ›│   │  ← text link 44px
 │ └────────────────────────┘ └────────────────────────┘ └──────────────────┘   │
 │ Not sure which programme fits? [Free online consultation] [WhatsApp Patient Care]│
 └──────────────────────────────────────────────────────────────────────────────┘

 390 ─ the bar is sticky under the header; the hero shrinks to 180px; the first
       card's top edge is within 844px after typing (assert in the smoke test).
```

- **One search box** (same engine as the overlay; the finder's box is the overlay's engine with `scope: programmes` + the hand-off rule: a non-programme intent shows ONE grey row "Looking for how to reach us? → How to reach" above the cards instead of "No close match").
- **Six condition chips** (owner picks the set, Q-05; proposed from the vocabulary clusters): Back & joints (back pain, slip disc, spondylitis, cervical, arthritis) · Skin (psoriasis, skin diseases) · Stress & sleep (stress, yoga-based reset, sleep) · Weight & diabetes (weight, diabetes, digestive) · Women's health (hormonal/endocrine, post-pregnancy) · Detox & prevention (Panchakarma, rejuvenation, preventive, immunity). Category chips (Treatment/Wellness/Training/Yoga) move to a second, quieter row or into the h1 per hub (the hub pages already ARE the category). <!-- compliance-allow: wellness -->
- **Duration** chips from `minimumNights` (Any / up to 7 / 14 / 21+); **Budget** as a select over from-totals in the chosen currency (bands derived from the dataset at build time — never hard-coded; owner Q-04 whether to show budget at all).
- All three filter LIVE (`onInput`), with the status line updating; no Apply button.
- **Result card**: image (140px), title (20px), `duration · from-price` (17px), `For: …` (16px, from the vocabulary's first two plain-English phrases or `whoFor[0]`), ONE primary CTA "Read the programme" (52px), one text link "Ask on WhatsApp" (44px, pre-filled message as today). Card ≤360px tall; 3 columns at 1440, 1 at 390 (≈9 cards per mobile page-height instead of 1.1).
- **Book Now leaves the card** — booking follows consultation in a hospital; it stays in the header ("BOOK YOUR STAY") and on the programme page.
- Trust line (`g` field) leaves the card; the shared block under the grid keeps the trust facts.
- Dataset: `all-programs-data.js` becomes the single source (it has the fields); `build-finder-views.mjs` stops patching a literal `PROGRAMMES` array and reads the JSON; `PRICING` in the view logic is deleted (one snapshot, one `validTo`).
- Shortlist/compare from `/all-programs/` survive as an optional block (owner Q-05).
- Keep: the urgent / declined / consult states and their copy (with the g-word fixed), the shared trust block, the WhatsApp pre-filled message, the currency toggle, the tariff PDF links.

### 4.3 Steps to a result after the change

Desktop: land → the sticky bar is the first interactive thing under the h1 → type "back pain" → three cards under the bar, on screen = 2 actions. Mobile: same, chips scroll horizontally, first card within the first screen (asserted).

---

## 5. The FAQ filter (scope addition D-20260922-26)

### 5.1 Behaviour spec — same engine, same rules

- Keep the bar exactly as designed (52px, ⌕, Clear, status line, sticky) — raise the input font to 18px (rule 1) and give the empty state the fallback row.
- Matching: the shared engine with `scope: faq` — fields `question` (boost 6), `topic` (4), `keywords` (5, hand-written per question in the index, e.g. Q23 → airport, flight, coimbatore, cochin, calicut, railway, train, station, distance, km), `answer` (1). Prefix ≥3, DL/transposition ≥5 chars, synonyms table (§6.1): "flight"→airport, "train"→railway, "veg"→vegetarian, "wifi"→wi-fi/internet, "money"→payment, "card"→credit card, "kids"→children, "senior"→senior citizen, "e visa"→visa, "insurance claim"→insurance.
- As-you-type from 2 chars; results are the matched `<details>` in RANK order (the page today keeps document order — for a filter that is fine; for a search it is not: when a question matches, it should rise to the top of its topic and matched topics should rise to the top of the rail).
- Status line: "8 questions match “airport”" → with correction: "Showing 3 questions for “visa” — you typed “vissa”". Zero: "No question matches “xyz” — ask us directly:" + the fallback row (WhatsApp Patient Care · Free online consultation · info@kairali.com).
- Deep link contract: `/faqs-downloads/?q=visa#q-36` opens with the filter pre-filled and Q36 open (used by the overlay's Question rows, rule 29).
- Highlight the matched words inside the question line only (not the whole answer).
- Auto-open: keep auto-opening matched questions when ≤5 match; above 5, open none (a wall of open answers is the current behaviour for "the").
- Substring-inside-word stops: "art" must not match "heart"; word-boundary or prefix only.
- Mobile: identical; the sticky bar shares the header's 73px logic so it never hides under the header (verify — the FAQ bar uses `top:0`, the shared header is fixed? UNVERIFIED; check in the build PR).

### 5.2 The current 44 questions (READ_FROM_REPO, `ahv-page-faqs-and-downloads-desktop.json`; summaries strip the leading "+")

**Why Choose Kairali?** — Q1 What makes Kairali different from other Ayurvedic r…? · Q2 How does Kairali compare to modern wellness fusion r…s? · Q3 What advantages does Kairali have over l… wellness r…? · Q4 How is Kairali different from Ayurvedic treatment centers? · Q5 Why choose Kairali over strict traditional Ayurvedic properties? · Q6 What sets Kairali apart from integrative wellness r…s? · Q7 How does Kairali compare to international l… wellness brands? <!-- compliance-allow: wellness -->
**Understanding Ayurveda** — Q8 What is Ayurveda, and how can it benefit me? · Q9 How can I incorporate Ayurvedic principles into my daily life? · Q10 What are doshas, and why are they important? · Q11 Are Ayurvedic doctors real doctors?
**Treatments & Programs** — Q12 What specific health conditions can be effectively managed with Ayurveda? · Q13 What treatments and programs do you offer at Kairali? · Q14 How long should I stay for effective results? · Q15 Will I experience any side effects during treatment?
**Accommodation & Facilities** — Q16 What types of accommodation do you offer? · Q17 What amenities and facilities are available? · Q18 What’s included in the accommodation package? · Q19 Can I see a detailed rate breakdown?
**Dietary Information** — Q20 What kind of food is served at Kairali? · Q21 Can you accommodate dietary restrictions or allergies? · Q22 Is alcohol or coffee permitted during the treatment period?
**Travel & Logistics** — Q23 Which are the nearest airports and railway stations? · Q24 Do you offer transportation services? · Q25 What is the best way to reach Kairali from major Indian cities? · Q26 How far is Kairali from nearby tourist attractions?
**Weather & Seasonal Information** — Q27 What is the climate like at Kairali throughout the year? · Q28 When is the best time to visit for specific treatments?
**Preparation & Packing** — Q29 What should I pack for my stay at Kairali? · Q30 What clothing is appropriate for treatments? · Q31 Are there laundry facilities available?
**Insurance & Payment** — Q32 Are Ayurvedic treatments covered by insurance? · Q33 Can you help with insurance documentation? · Q34 What payment methods do you accept?
**For International G…** (topic heading carries the g-word) — Q35 What special considerations do you have for senior g…? · Q36 What visa requirements should international g… be aware of? · Q37 Is there a medical evacuation service available if needed? · Q38 Can you accommodate extended stays for international g…?
**After Your Treatment** — Q39 How do I continue my Ayurvedic routine after returning home? · Q40 Can I purchase Ayurvedic medicines to take home? · Q41 Do you offer follow-up consultations after I leave?
**Additional Resources** — Q42 Do you offer educational programs about Ayurveda? · Q43 Where can I learn more about Ayurveda before my visit? · Q44 Do you offer any certification or training programs for Ayurvedic practitioners?

### 5.3 Questions missing for a 2026 international/Indian patient (questions only — answers are owner/physician content)

**Consultation & admission**
1. Is the first online consultation free, and how do I book it?
2. What happens on the day I arrive — is there an admission process?
3. Should I send my medical reports before I come?
4. Can I continue my current (allopathic) medicines during treatment?
5. Can a family member stay with me, and does a companion pay?
6. Is there a minimum or maximum age for treatment?
7. Can children be treated, or accompany a parent?

**Safety & medical**
8. Is a doctor available at night and on weekends?
9. What does NABH accreditation mean for me as a patient?
10. Which conditions do you NOT treat?
11. Can I take Panchakarma if I have diabetes or high blood pressure?
12. Can I have treatment during my period, or while pregnant?
13. Is Panchakarma uncomfortable, and what does a treatment day feel like?

**Money & policy**
14. Can I pay in US dollars or euros, and is GST included in the price?
15. What is your cancellation and refund policy?
16. Is the advance payment refundable if my visa is refused?
17. Do you offer any discounts (senior citizens, defence personnel, longer stays)?

**Stay & daily life**
18. Do the villas have air-conditioning, Wi-Fi and mobile signal?
19. Can I work remotely during a treatment stay?
20. Can two people share a villa and follow different programmes?
21. Is there a dress code, and what should women bring for treatments?

**Language & travel**
22. Do the doctors and therapists speak English, German or French?
23. Can you arrange a taxi from Coimbatore airport late at night?
24. Do you provide an invitation letter for a medical visa, and what does it contain?

**After treatment**
25. Will I receive a discharge summary I can give my doctor at home?

(25 questions; the owner picks, the physician answers where clinical.)

### 5.4 Proofread findings on the existing 44 (fix wording is `[DRAFT — owner approval]`; clinical lines need Dr. Deepu John)

Register hits are quoted one per line with a compliance marker. "Register" = KTAHV clinical lock. "Fact" = dated/money/legal to verify. "Wording" = clarity/grammar.

| # | Where | Type | Finding | Suggested fix [DRAFT — owner approval] |
|---|---|---|---|---|
| F1 | Q1–Q7 (whole topic) | Legal/positioning | Seven answers name competitors (Somatheeram, Atmantan, Ananda, Kerala Ayurveda, Kalari Kovilakom, Pema, Six Senses Vana) with comparative claims ("deeper therapeutic outcomes", "producing measurable relief"). Comparative advertising about named third parties is a legal exposure and off-register for a hospital; HARD GATE 13 forbids the agent from touching competitors at all. | Rewrite the topic as "Why Kairali" WITHOUT names: NABH accreditation, Laurie Baker campus, four generations, physician-led protocols, on-site pharmacy. Owner rules keep / rewrite / remove (Q-07). |
| F2 | Q1 summary | Wording | "different from other Ayurvedic retreat?" — singular/plural | "different from other Ayurvedic hospitals and centres?" | <!-- compliance-allow: retreat -->
| F3 | Q3 summary + answer | Register | s-word twice, l-word twice in one answer ("l… s… w…") <!-- compliance-allow: spa --> | Covered by F1 rewrite. |
| F4 | Q2 answer | Register | "R… like Atmantan" — the r-word <!-- compliance-allow: Resorts --> | Covered by F1. |
| F5 | Q7 summary + answer | Register | "international l… w… brands" <!-- compliance-allow: luxury --> | Covered by F1. |
| F6 | Q4 answer | Register | "G… stay, eat, heal, and recover" <!-- compliance-allow: Guests --> | "Patients stay, eat, heal and recover within one integrated campus, guided by physicians and trained therapists." |
| F7 | Q5 answer | Register/wording | "shorter w… getaways" — leisure framing in a hospital FAQ | "shorter preventive stays" | <!-- compliance-allow: getaways -->
| F8 | Q8 answer | Fact (advisory) | "5,000-year-old" — a common but contested figure | Owner/physician choose a defensible phrasing ("a classical Indian system of medicine with texts dating back over two millennia") or keep. |
| F9 | Q9 answer | Wording/format | The list runs together in extraction ("sleep by 10 PM Practice mindful eating…"); verify the view renders bullets (UNVERIFIED). "Our wellness consultants" — the site says physicians. | "Our physicians provide personalised recommendations during your stay." | <!-- compliance-allow: wellness -->
| F10 | Q11 answer | Fact | Links a blog "Are Ayurvedic Doctors Real Doctors?" — verify the target route exists in `route-manifest.json` (no such slug found in the 254; UNVERIFIED as a legacy external link). | Point at `/knowledge-centre/` or remove the link. |
| F11 | Q13 answer | Fact (clinical) | Durations "Panchakarma & Detoxification (7-21 days)", "Stress Management (3-14 days)", "Weight Management (7-14 days)" conflict with the dataset minimums (Panchakarma 14 nights, Stress 7, Weight 14, `all-programs-data.js`/reckoner). Also "Each program includes daily treatments, herbal medicines…" — the reckoner says internal herbal medicines are charged as needed (line ~ "Internal herbal medicines, lab tests… charged as needed"). | Align every duration to `minimumNights`; state medicines per the reckoner inclusions. Physician sign-off. |
| F12 | Q14 answer | Fact (clinical) | "21 days for comprehensive Panchakarma" vs dataset minimum 14; "3-5 days can provide an introduction" vs the 3-night Preventive programme. | Restate with the dataset durations; physician sign-off. |
| F13 | Q15 answer | Register | "Some g… may experience" <!-- compliance-allow: guests --> | "Some patients may experience…" |
| F14 | Q16 answer | Register | "Royal Villa : L… accommodations" <!-- compliance-allow: Luxury --> | "Royal Villa: larger villas with additional space and amenities" |
| F15 | Q16 answer | Wording | "Maharaja Suite : Premium villas" — a suite is not "villas"; Vaastu spelling "Vaastu" vs site "Vastu"? (UNVERIFIED which the brand manual uses) | "Maharaja Suite: a suite with a separate living area" |
| F16 | Q18 answer | Register/fact | "Access to all retreat facilities"; "Daily yoga and meditation sessions" — D-YOGA-PRIVATE (reckoner) rules private sessions exist; also lists "Private yoga/meditation sessions" as extra — consistent, keep; "Cultural activities and cooking demonstrations" — reckoner says once a week. | "Access to the hospital's facilities"; "Weekly workshops, cooking classes and farm walks". | <!-- compliance-allow: retreat -->
| F17 | Q19 answer | Fact | "+91 9555 156 156" spacing differs from the site's `tel:` formats (Q-AHV-CONTACT-ADDRESSES found three formats); Maharaja Suite is priced as "SUITE" in the 25–26 sheet. | One canonical display format sitewide; link the rate chart. |
| F18 | Q22 answer | Register | "support your healing j…" <!-- compliance-allow: journey --> | "to support your treatment." |
| F19 | Q22 answer | Wording | "alcohol and Caffeine-free" capitalisation | "alcohol-free and caffeine-free" |
| F20 | Q23 answer | Fact | Distances/times — Coimbatore Railway "51.2 km (approximately 1 and a half hours)"; Calicut 125 km equals Cochin 125 km (reckoner lists "Cochin / Calicut Airport (125 Kms)" as one row, so consistent). Keep; confirm times with the travel desk. | — |
| F21 | Q24 answer | Fact/register | Transfer prices ₹3,900 / ₹13,649 / ₹6,775 / ₹23,711 / ₹7,950 / ₹27,824 match the reckoner's 26–27 training sheet (lines 68–70, w.e.f. 1 Oct 2026) — but the FAQ shows them undated; "L… Sedan" is the source PDF's vehicle class <!-- compliance-allow: Luxury --> | Add "rates valid 1 Oct 2026 – 30 Sep 2027, one way, incl. 5% GST"; rename the class "Sedan (premium)" if the tariff owner agrees. |
| F22 | Q25 answer | Wording | "drive directly to our retreat" | "drive directly to the hospital" | <!-- compliance-allow: retreat -->
| F23 | Q27 answer | Wording | "Summer (March- May)", "Winter (December- February)" spacing | "March–May", "December–February" |
| F24 | Q30 answer | Wording | "undergarments(Loincloth) for treatments and bathrobes, Be mindful" | "We provide disposable loincloths and bathrobes for treatments. Oil treatments may stain clothing, so bring items you do not mind getting oily." |
| F25 | Q32 answer | Register | "Many g… still claim reimbursement" <!-- compliance-allow: guests --> | "Many patients claim reimbursement…" |
| F26 | Q34 answer | Fact (money) | "A 50% advance payment is required" — verify against the booking policy page; not in the reckoner. | Owner confirms the figure or the line goes. |
| F27 | Topic heading + Q35/Q36/Q38 | Register | Heading "For International G…"; Q35 "senior g…"; Q36 "international g…"; Q38 "international g…" ×2 <!-- compliance-allow: Guests --> | "For International Patients"; "senior patients"; "international patients". |
| F28 | Q35 answer | Wording | "Our retreat is designed with accessibility in mind" | "The campus is designed…" | <!-- compliance-allow: retreat -->
| F29 | Q36 answer | Fact (legal) | Visa guidance ("Medical Visa… stays exceeding 60 days", "4-6 weeks") — rules change; add a date and a link to the official portal. | "As of <month year> …; check indianvisaonline.gov.in" — owner supplies the date. |
| F30 | Q38 answer | Fact | "special packages for extended stays of 30 days or more" — the reckoner grants 5% over 28 nights; "packages" and "cultural excursions" are unpriced. | Align to the reckoner's extended-stay term; physician/owner confirm what an extended programme includes. |
| F31 | Q41 answer | Fact (clinical) | "scheduled at 1, 3, and 6 months" | Physician confirms the follow-up schedule. |
| F32 | Q43 answer | Fact | "Free e-books", "YouTube channel", "Introductory webinars scheduled monthly" — verify each exists in 2026 (the site has `/books/`, `/knowledge-centre/`, `/video-gallery/`; monthly webinars UNVERIFIED). | Link only what exists. |
| F33 | Q44 answer | Fact | "Continuing Education for Ayurvedic Professionals (various durations)" — the five governed courses (1/3/5/10/20 days, `finder-additions.json`) are not named. | Name the five courses and link `/ayurveda-training-programme/`. |
| F34 | Q42 answer | Fact | "Daily lectures", "Intensive retreats" — reckoner inclusions say workshops once a week. | Align to the inclusions sheet. |
| F35 | Q12, Q13 | Register (advisory) | "programs" (US) vs "programmes" everywhere else on the rebuilt site | "programmes" |
| F36 | Q17 answer | Fact | "Swimming pool (chemical-free, natural filtration)", "Gift shop", "Free Wi-Fi in common areas" — plausible; confirm with facilities. | — |
| F37 | Q26 answer | Fact | Attraction distances (Silent Valley 100 km, Malampuzha 46 km, Parambikulam 68.8 km, Athirappilly 123 km, Palakkad Fort 10.8 km) — compare with `attractions-family-data.js` before indexing. | Single source for distances. |
| F38 | All answers | Wording | "we recommend", "our doctors", "our medical team", "our wellness consultants", "reservations team", "administrative team" — six names for the people. | Two: "our physicians" and "the patient care team" (the term the finder's shared block already uses). | <!-- compliance-allow: wellness -->

Counts for the record (§1.6): FAQ view — g-word 14, l-word 8, j-word 3, s-word 2, r-word 1.

### 5.5 FAQ query test set (44 queries, typos included; expected top-1 question)

| # | Query | Top-1 | note |
|---|---|---|---|
| 1 | airport | Q23 | Q24 next |
| 2 | flight | Q23 | synonym |
| 3 | coimbatore | Q23 | |
| 4 | cochin airport | Q23 | |
| 5 | train | Q23 | synonym railway |
| 6 | pickup | Q24 | |
| 7 | taxi | Q24 | synonym |
| 8 | transfer cost | Q24 | |
| 9 | from delhi | Q25 | |
| 10 | visa | Q36 | |
| 11 | vissa | Q36 | DL1 (4 chars → MISSPELL entry needed: `vissa`, `viza`) |
| 12 | e visa | Q36 | |
| 13 | medical visa | Q36 | |
| 14 | insurance | Q32 | Q33 next |
| 15 | insurence | Q32 | DL1 |
| 16 | reimbursement | Q32 | |
| 17 | cashless | Q32 | |
| 18 | payment | Q34 | |
| 19 | credit card | Q34 | |
| 20 | upi | Q34 | |
| 21 | advance | Q34 | |
| 22 | food | Q20 | Q21, Q22 |
| 23 | veg | Q20 | prefix |
| 24 | vegan | Q21 | |
| 25 | gluten | Q21 | |
| 26 | allergy | Q21 | |
| 27 | alcohol | Q22 | |
| 28 | coffee | Q22 | |
| 29 | wifi | Q17 | synonym Wi-Fi |
| 30 | internet | Q17 | synonym |
| 31 | pool | Q17 | |
| 32 | villa | Q16 | Q18, Q19 |
| 33 | price | Q19 | Q24 |
| 34 | rates | Q19 | |
| 35 | what to pack | Q29 | |
| 36 | clothes | Q30 | Q29 |
| 37 | laundry | Q31 | |
| 38 | laundary | Q31 | DL1 |
| 39 | weather | Q27 | Q28 |
| 40 | monsoon | Q28 | Q27 |
| 41 | best time | Q28 | |
| 42 | how long | Q14 | |
| 43 | duration | Q14 | Q13 |
| 44 | side effects | Q15 | |
| 45 | doctors qualified | Q11 | |
| 46 | bams | Q11 | |
| 47 | senior | Q35 | |
| 48 | elderly | Q35 | synonym |
| 49 | wheelchair | Q35 | synonym accessibility |
| 50 | emergency | Q37 | |
| 51 | medicines take home | Q40 | |
| 52 | follow up | Q41 | |
| 53 | online consultation after | Q41 | |
| 54 | training | Q44 | Q42 |
| 55 | cooking class | Q42 | |
| 56 | dosha | Q10 | |
| 57 | psoriasis | Q12 | overlay would ALSO show the programme |
| 58 | diabetes | Q12 | |
| 59 | panchakarma | Q13 | Q14, Q28 |
| 60 | panchkarma | Q13 | MISSPELL |
| 61 | xyzzy | none | zero-result screen with the fallback row |

(61 rows ≥ 40.)

---

## 6. Ranking and typo strategy (one engine for all three surfaces)

### 6.1 Synonyms table (seed; lives in `english-candidate/search-vocabulary.json`, clinical rows signed by Dr. Deepu John)

Ayurveda term ↔ plain English:

| Term | Plain / typed | Maps to |
|---|---|---|
| Panchakarma | detox, cleanse, purification, five actions, panchkarma, panchakarama, pancha karma | /panchakarma-therapy/, /what-is-panchkarma/ |
| Shirodhara | oil on forehead, head oil, shirodara | /treatment-to-remove-stress-and-strain/ |
| Abhyangam / Abhyanga | oil massage, full body massage | /one-day-ayurveda-workshop-program-kerala/ (course), programme inclusions |
| Nasyam | nasal drops, sinus treatment | /treatment-for-sinusitis-and-migraine/ |
| Kati vasti / Kati shula | lower back oil pool, back pain | /treatment-for-chronic-back-pain/ |
| Sthoulyaghna | weight, obesity, slimming, fat | /weight-loss-programme/ |
| Madhumeha | diabetes, sugar, blood sugar | /treatment-for-diabetes/ |
| Kushtha / Tvacha | skin, psoriasis, eczema | /treatment-for-psoriasis/, /treatment-for-skin-diseases/ |
| Nidra | sleep, insomnia | /sleep-restoration-therapy/ |
| Manas shanthi | stress, anxiety, mental | /treatment-to-remove-stress-and-strain/ |
| Sandhivata | joints, arthritis, knee, hip | /treatment-for-arthritis-and-spondylitis/ |
| Manyastambha | neck, cervical, stiff neck | /treatment-for-cervical-spondylosis/ |
| Pakshaghata / Ardita | paralysis, stroke rehab / facial paralysis, bells palsy | /treatment-for-paralysis/, /treatment-for-facial-paralysis/ |
| Sutika | postpartum, after delivery, new mother | /post-pregnancy-health-programme/ |
| Ojas | immunity, immune | /immunity-enhancement-executive-health-assessment-therapy/ |
| Dinacharya | daily routine | FAQ Q9 |
| Dosha / Vata / Pitta / Kapha | body type, constitution | FAQ Q10, /learn-about-ayurveda/ |
| Karkidaka | monsoon treatment | /karkidaka-chikitsha-or-monsoon-wellness.html |

Condition ↔ programme (extends `TERMS`): sugar/bp/rheuma/disk/spondylosis (§2.2 B) · "tennis elbow", "frozen shoulder" → arthritis/cervical (physician to confirm) · "fatty liver", "gastric" → digestive (confirm) · "hair fall", "gout", "fertility" stay CONSULT_FIRST (as today).

Intent words (non-clinical, deterministic): price/cost/rates/fees/charges/how much/₹/$/€ → price intent · days/nights/weeks/duration/how long → duration facet · reach/airport/flight/train/railway/station/taxi/pickup/distance/km/map/directions → travel · visa/invitation → FAQ Q36 · villa/room/suite/stay/accommodation/ac/wifi → stay · food/veg/vegan/diet/meals/alcohol/coffee → food · doctor/physician/consult/consultation/vaidya → consultation · book/booking/reserve → /book-now/ · contact/phone/whatsapp/email/call → /contact-us/ · offer/discount/senior/defence/army/olympic → offers · course/training/certificate/diploma/learn/therapist/TAP/AATP/AALCT → training.

### 6.2 Fuzzy matching thresholds

1. Exact phrase (vocabulary, synonyms, titles) — wins outright.
2. Approved misspelling map (`MISSPELL`) — applied per token BEFORE any distance; extend with `vissa`, `viza`, `treatement`, `treatmnt`, `punchakarma`, `wieght`, `strees`, `laundary`, `insurence` (the set's typos become map rows when they are ≤6 chars).
3. Prefix ≥3 chars against vocabulary/title/question tokens (score 0.9 of exact).
4. Damerau-Levenshtein (transposition-aware; the current `lev` is plain Levenshtein — upgrade) for tokens ≥5 chars: distance ≤1 for 5–7 chars, ≤2 for ≥8 chars; first letter must match unless the edit is a transposition; candidates limited to tokens within ±2 length (as today).
5. Trigram Jaccard ≥0.45 on multi-word titles/questions as the last fallback for long garbled input ("ayurvedc tretment for bak pain").
6. Never fuzzy below 5 chars (keep the 1 Sep ruling); never fuzzy on numbers; never fuzzy across a safety phrase (URGENT/DECLINE/CONSULT match on exact/normalised phrase only, as today).
7. Token join: "pancha karma" = "panchakarma" (try joining adjacent tokens before scoring).

### 6.3 Boosts (multiplicative, per document; `score = Σ fieldMatch × boost`, then group)

| Field | Boost | Source |
|---|---|---|
| Programme vocabulary phrase / synonym (clinical) | 10 | vocabulary.json |
| H1 / programme name / FAQ question exact | 9 | index `label` |
| Alias (legacy title, Sanskrit, course code) | 6 | `aliases[]`, `sanskrit` |
| Hand-written keywords (FAQ, pages) | 5 | index `keywords[]` |
| `whoFor` lines | 4 | programme views |
| Topic heading (FAQ) / category | 3 | |
| Description (≤90ch) | 2 | route-manifest |
| Answer / body | 1 | FAQ answers, page-FAQ answers |
| Nav boost for intent words | +5 to the matching nav page | intent table |
| Prefix vs exact | ×0.9 | |
| DL distance 1 / 2 | ×0.75 / ×0.55 | |
| Trigram | ×0.5 | |

Group rule: if any programme scores ≥ 6 → Programmes first; else if a FAQ scores ≥ 5 → Questions first; else Pages. Comorbidity rule and GENERIC/MULTI classes as today.

### 6.4 "Showing results for…" / "Did you mean"

- If every token matched exactly → "N results for “q”".
- If a MISSPELL row or a DL correction was applied to ≥1 token and the corrected query has results → "Showing results for “corrected” — you typed “q”" + an inline link "search for “q” instead" (which disables correction once).
- If the best correction's score is within 15% of a second correction → no auto-correction; show "Did you mean: A · B" chips (48px) and the uncorrected results (possibly zero) beneath.
- If nothing matches after correction → zero-result screen (rule 10) — never "Showing results for" with an empty list.

### 6.5 Acceptance test

- `english-candidate/search-queries.json`: the §2.2 rows (`{q, expectTop1, expectClass?, alsoWithin3?}`) + §5.5 rows (`scope: faq`).
- `tests/search-acceptance.test.mjs` (node, no browser): builds the index with the tool, runs every row through the engine, asserts top-1 (and class), prints a table of misses; CI-blocking; a clinical mapping change re-runs it.
- `tests/search-ui.smoke.mjs` (Playwright, 390 + 1440): overlay opens from the header on `/about-us/` AND `/`; input font ≥18px, height ≥56px; typing "back pain" → three programme rows inside the viewport; Esc returns focus; fallback row visible; finder: after typing "psoriasis" the first card's top < viewport height; FAQ: "vissa" → Q36 open and status shows the correction.
- Register: `search-index.json` and every UI string file run through the compliance lint in the same CI step.

---

## 7. Recommendation and implementation plan

### 7.1 Recommendation

**Option A (instant overlay) with C as its empty state and B-lite (`/search/?q=` static page + form fallback + SearchAction schema) — one engine, one vocabulary, one prebuilt index — reused by the programme finder (rebuilt per §4.2, `/all-programs/` folded in) and by the FAQ filter (§5.1).**

Why: it reuses the dialog shell that already ships in the header, it is the only option that gets a 45-year-old from question to answer in two actions on a phone without a page load, and it lets the finder and FAQ stop being three different products. Nothing needs installing; nothing needs a server.

### 7.2 Implementation plan (files/tools; all under `sites/ayurvedichealingvillage.com/` unless noted)

| Step | Add / change | Deterministic? |
|---|---|---|
| 1 | `english-candidate/search-vocabulary.json` — move `TERMS`, `MISSPELL`, `GENERIC`, `URGENT`, `REHAB_EXEMPT`, `CONSULT`, `DECLINE`, `CAVEAT` out of `programme-search.js`; add `synonyms`, `intents`, FAQ `keywords`. Register-lint the file. | Mechanical move: yes. New clinical rows: physician sign-off. |
| 2 | `tools/build-search-index.mjs` → `public/ahv/search-index.json` (+ `.de.json`/`.fr.json` later). Inputs: `route-manifest.json` (routes, labels from H1 override map, descriptions), `all-programs-data.js` (programmes, prices, `validTo`), `finder-additions.json` (courses), the FAQ view (44 Q&A + topics), programme views (`whoFor`, `faqs` questions), the vocabulary. Refuses expired prices unless `--allow-expired`; enforces the size cap; runs the compliance lint. | Yes |
| 3 | `public/ahv/assets/programme-search.js` → becomes the shared engine `public/design/search-engine.js` (loads the vocabulary from the index; DL + trigram + boosts per §6; keeps the classes). Keep `fuse.basic.min.js` only if the trigram fallback is not written in-house (Fuse's Bitap is a fine substitute — decide in the PR). | Yes |
| 4 | `public/design/search.js` + `search.css` — the overlay, keyed on `button[aria-controls="ahv-search-dialog"]` and `a[href="#search"]`; replaces the inert dialog body at runtime (the component's markup stays the SSR shell). Loaded with `chrome.js` from the layout. Homepage view: change the anchor to the same button markup (`tools/repair-…` pattern, `home-hi-fi-v4.json`). | Yes |
| 5 | `app/(english)/search/page.tsx` — static, `noindex`, reads `?q=`, mounts the same overlay inline; header input gets `form action="/search/"`. Then `schema.ts`: emit `WebSite.potentialAction` → `/search/?q={search_term_string}` (owner Q-10). | Yes (schema emission: owner) |
| 6 | `tools/build-finder-views.mjs` — read programmes from `all-programs-data.js` (one dataset), drop the `PRICING` literal and the `g` trust line, render the §4.2 layout (sticky bar, condition chips, duration/budget, compact card, one CTA), load the shared engine. `/all-programs/` derived from the same template (owner Q-05). | Layout: yes. Chip set and budget: owner. |
| 7 | FAQ view: swap the substring matcher for the shared engine (`scope: faq`), add `?q=` + `#q-NN` deep links, fallback row in the empty state, 18px input. | Yes |
| 8 | Register fixes in the search surfaces: finder `g` lines and empty-state copy, `programme-search.js` comments and the h-word entry, `finder-views.json` shared-block item 4 ("World L… Award Winner" — an award name; owner rules whether the award title may print under the lock, Q-08b), FAQ rows F3–F7, F13, F14, F18, F25, F27. | Copy: owner approval (drafts in §5.4). |
| 9 | Tests: `tests/search-acceptance.test.mjs`, `tests/search-ui.smoke.mjs`, query sets in `english-candidate/`. Wire into the site's spec run. | Yes |
| 10 | Analytics: consent-gated `search` event (no raw query) in the existing measurement build. | Owner Q-12 |
| 11 | Docs: QUESTIONS.md Q-AHV-SEARCH-CONTROL gets the resolution; `schema.ts` header note updated when SearchAction lands; STATUS.yaml. | Yes |

Order of PRs: (1)+(2)+(3)+(9) engine-and-index first (no UI, fully testable) → (4)+(5) overlay → (6) finder → (7) FAQ → (8) copy → (10). Each PR gated on the acceptance set; front gates untouched (this is not a redesign of a page family — Gate-1 altitude note, CLAUDE.md M1 disposition 2 — but the finder card change should get the Phase-5 battery and design Gate 2 on the finder pages).

### 7.3 Open questions for the owner (MCQ one-liners)

- **Q-01 Top-bar pattern:** (a) A overlay + C empty state + B-lite page **[recommended]** · (b) B page only · (c) C chooser only · (d) A without the /search/ page (no SearchAction).
- **Q-02 Fallback row contacts:** (a) Priya WhatsApp +91 92898 38797 + free online consultation + hospital line +91 9555 156 156 **[rec]** · (b) WhatsApp + consultation only · (c) add info@kairali.com as a fourth.
- **Q-03 Prices in search results:** (a) show from-price + duration now, dataset valid to 30 Sep 2026, "Request a quote" after **[rec]** · (b) duration only until the 26–27 sheet lands · (c) never show prices in search.
- **Q-04 Budget facet in the finder:** (a) yes, bands derived from the dataset **[rec: yes]** · (b) no, duration only.
- **Q-05 Fold `/all-programs/` into the one finder template:** (a) yes, keep shortlist/compare as an optional block **[rec]** · (b) yes, drop shortlist/compare · (c) keep two pages, share only the engine.
- **Q-06 Condition chips (six):** (a) Back & joints · Skin · Stress & sleep · Weight & diabetes · Women's health · Detox & prevention **[proposed]** · (b) owner's own six · (c) keep category chips only.
- **Q-07 FAQ Q1–Q7 (competitor names):** (a) rewrite without names **[rec]** · (b) remove the topic · (c) keep as is (legal risk noted).
- **Q-08 FAQ register batch (F3–F7, F13, F14, F18, F25, F27 → patient/physician wording):** (a) approve the drafts as written · (b) owner edits · (c) hold.
- **Q-08b Shared-block item "World L… Award Winner":** (a) keep as an award title with a lint allow · (b) reword to "International award winner" · (c) drop from the finder block.
- **Q-09 New FAQs (§5.3, 25):** (a) all 25 to the physician/owner for answers · (b) owner ticks a subset · (c) none now.
- **Q-10 Emit WebSite SearchAction once `/search/` exists:** (a) yes **[rec]** · (b) no.
- **Q-11 "Often searched" list in the empty overlay:** (a) owner-listed: back pain · Panchakarma · psoriasis · diabetes · airport · prices **[proposed]** · (b) owner's list · (c) none.
- **Q-12 Search analytics event (consent-gated, no raw query):** (a) yes · (b) no.
- **Q-13 Clinical sign-off of the vocabulary and synonyms:** (a) Dr. Deepu John signs the JSON before go-live **[required by HARD GATE 7]** · (b) owner signs the non-clinical rows, physician the condition rows.
- **Q-14 `/ayurveda/` vs `/ayurvedic-treatments/` as the target for the bare query "ayurveda":** (a) the finder hub **[rec]** · (b) the explainer page.

---

## 8. Checker pass (rule f)

- Instruction re-read: brainstorm both searches for a 45-year-old, typos, result look, friction-free; measure the finder at 390/1440; deliver five sections; FAQ addition (behaviour, current list, missing questions, proofread, ≥40 FAQ queries); one report; do not implement. Delivered: §§1–7, 176-row site query set (≥120), 61-row FAQ set (≥40), 25 missing questions (15–25), 38 proofread findings, three options with ASCII + 48 rules, recommendation + plan + 15 MCQs.
- Claims vs evidence: every measurement in §1.5 came from `tests/_search-measure.tmp.mjs` output (two runs, identical numbers); every file/line cited was read in this session; prices, phone numbers and distances are quoted from the repo datasets/reckoner/FAQ text and are marked with their source.
- Unverified (stated as such): `/all-programs/` live typing behaviour (code only); homepage mobile burger presence; FAQ list rendering; the FAQ empty-state block's current text; the existence of the blog link in Q11 and the monthly webinars in Q43; the FAQ sticky bar vs fixed header overlap; the brand spelling Vastu/Vaastu.
- Hard gates: nothing written to production; no page status changed; no credentials used; nothing installed; no facts invented — gaps are ASKS in §7.3.
- Register: this document quotes banned words only in §1.6 and §5.4 findings, one per line, each with a compliance-allow marker.
- Housekeeping: the temporary measurement script `sites/ayurvedichealingvillage.com/tests/_search-measure.tmp.mjs` is deleted at session end; the pre-existing untracked `tests/_*.tmp.mjs` files belong to another session and are left alone.
