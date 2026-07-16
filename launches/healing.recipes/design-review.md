# Design Review — healing.recipes (Ship Gate B-14)

**2026-07-16 19:13:32 IST · Reviewer: independent design-critic agent, skeptical-marketer + senior design-reviewer pass (scripts/design-review/PROMPT.md v1.0)**
**Method: live preview at http://localhost:4314 (`next dev`, sites/healing.recipes). Walked 375×812 first, then 1280×900, with committed screenshots (screens/home-desktop-full.png, home-mobile-full.png, book-harmony-desktop.png, book-massage-desktop.png, author-desktop.png, press-mobile.png) plus fresh audit captures (screens/audit-*.png) and a Playwright computed-style + geometry audit (fonts, token rgb values, radii, one-accent count, focus ring, reduced motion, element bounding boxes). Judged against the rubric AND the stated intent in sites/healing.recipes/DESIGN_NOTES.md. One iteration — findings handed to the builder, not fixed by the critic.**

**Capture note:** scrolled-viewport screenshots from headless Chromium painted the `.shelf` band white (screens/audit-shelf-viewport.png) — a capture artifact, not a site bug. Computed style reads `rgb(0, 66, 38)` (forest-700) and the full-page captures (home-desktop-full.png, audit-home-desktop-1280-full.png) paint it correctly. Geometry measurements from the artifact captures remain valid.

## Iteration 1 — scorecard

| Criterion | Score /10 | Evidence |
|---|---|---|
| Premium feel | 8.5 | The hero is genuinely handsome: Kurale 400 at 57.6px in forest-700, real Harmony cover with warm bronze-tinted shadow, one marigold "New · 2026" tag (measured 64px below the cover top — clear of the cover's own descriptor strip), bibliographic Lato caption (audit-hero-desktop.png). Real covers throughout, no stock photography, no template-smell. **But the signature moment is mis-executed** (finding 1) and the author page is bare at desktop (finding 3) — the two things a buyer would remember. |
| Human-made feel | 9.5 | The best thing about this site. Every fact traces to content/books.json (two-source rule): real ISBNs, imprint honesty ("Lustre Press / Roli Books" on the 2000 book), honest imprecision (the Wellness Cookbook shows no page count because none was verified — its shelf caption is just "2022 · Roli Books"), publisher promotion labelled as such on /press, the launch band an honest placeholder by ruling, and the one endorsement quote attributed ("printed on the publisher's page"). Zero filler. ED register clean — the old blurb's health claims ("removing toxins") were correctly left behind. |
| Mobile UX | 7 | Rendering is clean: no horizontal overflow at 375 on home or book pages (measured), hero buttons and buy buttons all 44px, consent banner buttons 44px, wordmark single-line (186px), the marigold tag not clipped (left: 6px), the landscape 2000 book honestly shorter in the mobile stack (170px vs 240px). **But below 760px the site has no navigation at all** (finding 2): `.site-nav` and `.header-cta` are both `display:none`, there is no hamburger, and the footer carries only external Kairali links + legal. Measured: zero visible links to /press or /contact anywhere on the mobile home page. Two of the site's five pages are unreachable by touch. |
| CTA clarity | 8.5 | Desktop discipline is right: one primary per view (hero "Get Harmony — the new book" → featured "See the book & where to buy" → plate buy-row), all wired (`data-cta`: header_harmony, hero_harmony, hero_shelf, featured_harmony, shelf_book, buy_click, author_more, email_click), and honest helper copy under the buy row ("Links open the bookseller's own page; availability and pricing are theirs"). Docked a point and a half because mobile loses the persistent header CTA entirely (finding 2b) and all four shelf covers share one undifferentiated `data-cta="shelf_book"` (finding 5). |
| Brand-manual fidelity | 9.5 | Computed-style audit all green: h1 Kurale weight 400 `rgb(0,66,38)`; body Asap on ivory `rgb(247,244,234)`; overlines Lato 700 bronze `rgb(193,136,44)`; buttons forest-500 `rgb(0,96,56)`, radius 999px; shelf band forest-700 `rgb(0,66,38)` with marigold descriptors per ch.08; biblio lines Lato 13.12px. **Exactly one marigold element on the light ground** (the `.new-tag` — counted programmatically across every element). Keyboard focus ring verified live: 3px leaf-500 @55% on Tab (`matchesFV: true`). Reduced-motion verified: settle animation collapses to 0.01ms. Hover deepens shadow only — nothing lifts. |

**Iteration-1 average: 8.6 / 10 — below the ≥9.0 gate. No criterion under 7.**

## Detailed findings

1. **THE SHELF — the covers don't stand on the shelf (signature mis-execution).**
   DESIGN_NOTES.md: "all four real covers stand bottom-aligned on a bronze shelf line… like a real shelf." Measured at 1280 (audit-shelf-viewport.png + bounding boxes): cover bottoms sit at y=1316 / 1338 / 1270 / 1333 — a 68px spread — while the bronze shelf line renders at ~y=1471. `align-items: flex-end` on `.shelf-row` bottom-aligns the whole `<a>` column (cover + title + biblio + award line), so what actually aligns is the *caption text*, and each cover floats 133–201px above the "shelf" at a height dictated by its caption's line count. The award-winning Wellness Cookbook — the book the band should be proudest of — floats highest. The chronology and the landscape book's shorter height (208px vs 296px) are real, but the shelf metaphor breaks: books hovering over a rule with text underneath them is a caption grid with a divider, not a shelf. This is the site's stated memory-moment and its weakest execution.
2. **Mobile has no navigation — /press and /contact are orphaned.**
   Below 760px: `.site-nav { display:none }`, `.header-cta { display:none }`, no hamburger or menu of any kind (app/_components/chrome.tsx), and the footer nav lists only the four external Kairali properties plus Privacy/Terms/Cookies. Measured at 375×812: the only anchors to /press and /contact on the home page are the hidden header ones. A journalist on a phone — the person the Press page exists for — cannot reach it. (2b) The header CTA "Get Harmony" also vanishes, so the persistent 64px header spends its entire width on the wordmark while the KPI action disappears. There is room: wordmark 186px + pill ≈120px < 375px.
3. **The author page is a bare column at desktop.**
   At 1280 (audit-author-desktop.png) the text column ends at ~x=815 and the right third of the viewport is empty ivory to the fold. No photograph exists (verified gap, IMAGE_MANIFEST) — but the rubric's standard is placeholders *styled as intentional brand blocks* (the arogyakendra precedent), and this page doesn't attempt one: no cover strip, no pull-quote, no brand block — one prose column and a button. It reads unfinished rather than restrained, and it is the page named after the person the whole site exists to celebrate.
4. **The bibliographic voice — the stated structural device — is not uniform.**
   Hero caption: "Harmony: Essential Ayurveda for All · Roli Books · **280 pages**" (home-desktop-full.png); everywhere else the device is "…· **280 pp**" (shelf, plates). Same data, two voices. Also "Co-Founder & Joint Managing Director" (author-page biblio line, from books.json jobTitle) vs "co-founder and Joint Managing Director" (hero lede, author strip, author-page prose). When real data set small IS the decoration, the formatting is the design — it must not drift.
5. **Analytics can't see which book pulls.** All four shelf covers fire the same `data-cta="shelf_book"`. The KPI is the buy click per book; shelf attribution should carry the slug (e.g. `shelf_book_harmony`).

## Fix list (for the builder — gate re-run required after)

1. Make the covers stand on the shelf: bottom-align the *images* to a shared baseline with the bronze line directly under them (e.g. a fixed-height cover row, `align-items:flex-end`, border under the row), captions below the line like spine labels. The 68px float spread and the text-under-book gap both disappear.
2. Restore mobile navigation: keep the Get Harmony pill in the mobile header (it fits) and add the internal pages (Books · Author · Press · Contact) to the footer nav on all viewports. No hamburger needed for five pages.
3. Give /author a right-hand brand block at ≥760px: the four-cover mini-strip or a styled pull-quote block as the photograph's intentional placeholder (photo slot stays in IMAGE_MANIFEST).
4. Normalise the biblio voice: "280 pp" in the hero caption; pick one casing for "Co-founder…" (body copy currently wins 3-to-1).
5. Suffix `data-cta="shelf_book"` with the book slug.

## Final verdict — iteration 1

**8.6 / 10 — FAIL against the ≥9.0 gate. Does not go to C-1 in this state.**
The honesty layer (facts, register, tokens, accessibility) is the strongest of the factory sites so far — findings 1–3 are all layout-level and cheap to fix, and none touches copy, tokens, or content. A focused fix pass should clear 9.0 on iteration 2; the scorecard is handed to the builder rather than softened.

## Honest limitations (not scored away)

- No author photograph exists (IMAGE_MANIFEST gap) — the premium ceiling of /author stays capped even after fix 3 until a real portrait ships.
- The launch band is a placeholder by explicit ruling (no event details exist; Abilash 16 Jul 2026 18:15 IST) — styled as an intentional card, scored as such.
- `--marigold-300` is aliased to `--marigold-400` in packages/ui/brand-tokens.css (token TODO), so the dark band's descriptors render one step hotter than ch.08 intends — a design-system-library gap, not a site defect.
- Wordmark is Kurale text + icon SVG, not the logo lockup (ch.02 forbids recreating it; assets pending).
- Scrolled-viewport headless captures mis-paint the forest-700 band (see capture note); shelf-band colour verification therefore rests on computed styles + full-page captures.
- content/books.json cover dimensions were touched by a parallel session mid-review (aspect ratios unchanged); geometry findings were re-checked against rendered sizes and stand.

## Iteration 2

**2026-07-16 19:26:25 IST · Same reviewer stance (scripts/design-review/PROMPT.md v1.0). Method: fresh evidence only — nothing taken on the builder's word. Live preview at http://localhost:4314 serving commit 70f231e (verified `git log` HEAD). Playwright (Node library, headless Chromium) at 375×812 (mobile, DPR 2, touch) and 1280×900, element screenshots + full-page captures + computed-style/geometry JSON. New captures: screens/it2-shelf-desktop.png, it2-home-desktop-full.png, it2-home-mobile-full.png, it2-mobile-header.png, it2-book-harmony-mobile-fold.png, it2-book-harmony-desktop-fold.png, it2-author-desktop.png, it2-press-mobile.png. Per the iteration-1 capture note, shelf-band colour was verified via computed style + element/full-page shots (both painted `rgb(0,66,38)` correctly this run).**

### Claimed fixes — verified against fresh evidence

| Claim (commit 70f231e) | Verdict | Evidence |
|---|---|---|
| Covers stand ON a continuous bronze shelf line | **VERIFIED** | Measured at 1280: all four cover-image bottoms at y=624.8, shelf line (`.shelf-row::before`, 2px solid bronze @55%) at y=624.8 — gap 0.0px on every book, bottom spread 0px (was 68px, floating 133–201px above). Landscape 2000 book stands 179px vs 250px portraits. it2-shelf-desktop.png shows a real shelf; captions hang below the line like labels. Mobile: per-book 2px segments, image bottom on its segment within 1.5px on all four (measured). |
| Mobile header wraps to second row; 4 nav links + Get Harmony pill touchable at 375×812 | **VERIFIED, with a size note** | it2-mobile-header.png. Measured: all 4 links + pill `visible:true`, nav row 335px wide — fits 375 with no horizontal scroll (`scrollWidth == clientWidth`). Header total 113px. **But** links and pill are 40px tall — every other control on the site meets the 44px bar this review used in iteration 1 (`.header-cta { min-height: 40px }`, globals.css). |
| Footer internal links | **VERIFIED** | 7 internal hrefs in footer at 375 (/#shelf, /author, /press, /contact, /privacy, /terms, /cookie-policy), each row 44px. /press and /contact no longer orphaned on mobile — iteration-1 blocker 2 resolved. |
| Plate subtitles forest-700 (contrast) | **VERIFIED** | Computed `rgb(0, 66, 38)` at 20px on /books/harmony; measured 10.56:1 on ivory `rgb(247,244,234)` — AAA. |
| Covers downscaled (hero 204KB) | **VERIFIED** | On-disk: harmony.jpg 204,108 B · herbal-massage 105,630 B · harmony-mockup 305,030 B · ayurvedic-cookbook 172,226 B · wellness-cookbook 60,968 B (was 670/423/900/276/102 KB). Mobile LCP element is now the hero lede paragraph, painted ~28ms on the dev server. |
| Overline raised to 14px | **VERIFIED** | Computed 14px Lato 700 on both light ground (`rgb(193,136,44)`) and shelf band. |
| Buy row above the fold on book plates | **PARTIAL — true at desktop only** | 1280×900: first buy button bottom y=429 < 900 (it2-book-harmony-desktop-fold.png). **375×812: first buy button top y=894 > 812** — below the fold, and the consent banner covers the bottom third on first visit (it2-book-harmony-mobile-fold.png). Above the mobile fold: header, back link, cover. The rubric is mobile-first; the claim as stated does not hold at 375. |

### Iteration-1 fix list — what was NOT done

- **Fix 3 (author brand block): not attempted.** /author at 1280 is the same bare prose column — text right edge x=820, 460px of empty ivory to the right, three children in the container (it2-author-desktop.png; diff to fcd603f touched only metadata). Still the page named after the person the site celebrates.
- **Fix 4 (biblio voice): not done.** Hero caption still "…Roli Books · 280 pages" (app/page.tsx:110, confirmed rendered) vs "280 pp" everywhere else; "Co-Founder &" (author biblio line, books.json jobTitle) vs "co-founder and" (hero, author strip, prose — 3 occurrences) casing drift stands.
- **Fix 5 (shelf attribution): not done.** All four shelf covers still fire `data-cta="shelf_book"` (app/page.tsx:136; rendered inventory: shelf_book ×4).

### Iteration 2 — scorecard

| Criterion | It.1 | It.2 | Evidence |
|---|---|---|---|
| Premium feel | 8.5 | **9.0** | The signature moment now lands: four real covers standing on one bronze line, chronology true, landscape book honestly shorter — the element shot reads as a shelf, not a caption grid (it2-shelf-desktop.png, geometry above). Full-page desktop capture is calm and expensive-looking end to end. Held from higher by the untouched bare author page (finding 3 — one of the two things a buyer would remember) and the hero-caption voice drift. |
| Human-made feel | 9.5 | **9.5** | Content layer untouched this iteration (verified diff): ISBNs, imprint honesty, attributed quote, placeholder-by-ruling all stand. Casing drift (Co-Founder/co-founder) is the only blemish. |
| Mobile UX | 7 | **9.0** | The blocker is gone: every page reachable by touch at 375 — 4 nav links + pill in a wrapped header (measured visible, no scroll), internal footer links at 44px. No horizontal overflow on any of 6 routes (measured). Per-book shelf segments work. Focus ring verified live (`:focus-visible` true, 3px leaf-500 @55% box-shadow). Docked: header links/pill 40px vs the 44px bar the rest of the site meets, and the KPI action on book plates sits 82px below the mobile fold behind a first-visit consent banner. |
| CTA clarity | 8.5 | **9.0** | Iteration-1 dock 2b resolved: "Get Harmony" pill now persistent on every viewport (it2-mobile-header.png). One-primary-per-view discipline unchanged; buy-row helper copy intact. Held at 9.0 because shelf attribution is still undifferentiated (`shelf_book` ×4 — fix 5 skipped) and the mobile plate fold miss touches the KPI click itself. |
| Brand-manual fidelity | 9.5 | **9.5** | Re-audited: h1 Kurale 400 57.6px `rgb(0,66,38)`; overlines now at the ch.10 14px floor, Lato 700 bronze; buttons forest-500 `rgb(0,96,56)` radius 999px; shelf band `rgb(0,66,38)` computed AND painted in both full-page captures; subtitle forest-700 10.56:1; exactly one marigold element on the light ground (`.new-tag`, counted programmatically). Known ramp gaps (marigold-300 alias; bronze-400 overlines at 2.80:1 pending the real bronze-600 hex, Q14) remain library-level limitations, not site defects. |

**Iteration-2 average: 9.2 / 10 — no criterion under 7.**

### Final verdict — iteration 2

**9.2 / 10 — PASS against the ≥9.0 gate (was 8.6 FAIL). The preview may go to Abilash (C-1).**
Both iteration-1 blockers are genuinely fixed and machine-verified: the shelf is now the best moment on the site, and mobile navigation is complete. The pass is earned by the fixes, not by softening — the following are still real and should ride the next polish pass (none singly gate-blocking):

1. /author bare desktop column (fix 3, untouched) — the largest remaining premium gap.
2. Buy row below the 812px fold on mobile book plates (y=894) — the commit's "above the fold" claim is desktop-only; the KPI page deserves a mobile-first fix.
3. Header touch targets 40px → 44px (one-line CSS each: `.header-cta`, `.site-nav a`).
4. Biblio voice: "280 pages" → "280 pp" in the hero caption (app/page.tsx:110); pick one casing for "Co-founder…".
5. `data-cta="shelf_book"` still unsuffixed — per-book shelf attribution stays invisible to analytics.
6. Bronze-400 overlines measure 2.80:1 on ivory at 14px — rides the Q14 bronze-600 ramp fix in packages/ui.

### Honest limitations — iteration 2 (carried + new)

- All iteration-1 limitations stand: no author photograph (IMAGE_MANIFEST gap), launch band placeholder by ruling, marigold-300 alias, wordmark not the logo lockup.
- LCP measured on the local dev server (~28ms to the paragraph paint) — a production-CDN Lighthouse run should confirm before DNS, though the 3.3× image-weight cut is verified on disk.
- Headless full-page captures painted the forest-700 band correctly this run; element screenshots remain the primary colour evidence per the iteration-1 note.
