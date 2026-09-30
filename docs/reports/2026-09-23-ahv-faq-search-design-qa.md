# Design QA — AHV FAQ page (content pass) + Search results page

**Date:** 2026-09-22 22:48:04 IST
**Auditor:** design-qa sub-agent
**Environment:** `http://localhost:4321` (production `next start`, BUILD_ID `84lWhywkzHZCNOzSdM1dWTue`, built 2026-09-22 22:30:03 IST — confirmed no `app/` source newer than the build, so the server matches the working tree)
**Site dir:** `sites/ayurvedichealingvillage.com` (repo: `.codex-worktrees/ahv-english-staging-20260915`)
**Pages audited:**
1. `/faqs-downloads/` — 58 questions / 13 topics content pass
2. `/search/?q=psoriasis`, `/search/?q=panchkarma`, `/search/?q=asdfgh`, `/search/`
**Method:** Playwright (`@playwright/test`, chromium headless) driven via temporary `tests/_*.tmp.mjs` scripts (deleted after the run, per house rules); `localStorage["ktahv-consent"]="accepted"` set via `addInitScript` on every context. Screenshots at 1440×(full page) and 390×(full page) for both pages, plus targeted state screenshots (open questions, search-typo state, keyboard focus, search overlay). All evidence under `launches/ayurvedichealingvillage.com/design-review/faq-search-2026-09-23/`.

**Tooling note (not a page defect, flagged for the record):** Playwright's native `page.screenshot({fullPage:true})` hangs indefinitely on `/faqs-downloads/` (reproduced twice, still not resolved after 120s, confirmed via a 120s-timeout run). Worked around by resizing the viewport to `document.documentElement.scrollHeight` and taking a non-fullPage capture, which succeeds in <500ms. Root cause not diagnosed (candidates: the `position: sticky` "Jump to a topic" rail, or a `details`/lazy-load reflow loop) — logged here as UNVERIFIED and worth a follow-up if other automated tooling (Lighthouse CI, other QA agents) hits the same page.

---

## Page 1 — `/faqs-downloads/`

| # | Check | Result | Measured |
|---|---|---|---|
| 1 | "Consultation & Admission" sits second, matches other topic blocks | **PASS** | DOM order: 1 Why Choose Kairali? (7) → 2 Consultation & Admission (3) → 3 Understanding Ayurveda (4) → … 13 Additional Resources (3). Same `h2` + count-badge + `details[data-q]` markup as every other `section[data-group]`; visually identical in the screenshot (typography, rule line, badge position). |
| 2 | Badges / rail counts agree with rendered question counts | **PASS** | All 13 topics: badge text vs `details[data-q]` count matched exactly (7/7, 3/3, 4/4, 5/5, 7/7, 3/3, 4/4, 2/2, 4/4, 6/6, 6/6, 4/4, 3/3 = 58 total). "Jump to a topic" rail shows the same 13 counts next to the same topic names, in the same order. Header status line reads "Showing all 58 questions in 13 topics." |
| 3 | Filter with typo "cancelation policy" | **PASS** | Status line updates to **"Showing 2 questions for "cancellation policy" — you typed "cancelation policy""** (correct spell-correction, correct count, singular/plural handled, quote-marks render cleanly). The 2 surfaced questions ("Can children be treated, or accompany a parent?" and "What is your cancellation and refund policy?") are genuinely relevant matches. Clearing the filter restores all 58 and the Downloads section below (verified present, visible, 5 PDF cards). |
| 4 | q-46 answer typography vs q-09 | **PASS** | q-09 (`details[data-q='9']`, "How can I incorporate Ayurvedic principles into my daily life?") and q-46 (`details[data-q='46']`, "Can a family member stay with me, and does a companion pay?") both render body copy at `font-size:17.5px; line-height:30.625px; font-family:Mulish, sans-serif`. q-09's list uses `list-style-type:disc`; q-46 has no list in its answer (prose only — content-driven, not a style defect) but is visually identical in rule-line, spacing and heading weight (confirmed by screenshot comparison). |
| 5 | "+"/"−" mark flips on open | **PASS** | Mark lives in `<span aria-hidden="true" data-mark="1">` (not `::before`/`::after` content as I first assumed on the desktop-only DOM read — confirmed via direct query). Before click: `+`. After click: `−`. Confirmed on q-9 via both DOM read and screenshot. |
| 6 | Sticky rail not taller than viewport (desktop) | **PASS** | At 1440×1000: rail `position:sticky; top:106px`, rendered height 722.8px, bottom edge at 828.8px — fits inside the 1000px viewport with room to spare. No clipped items, no internal scroll needed. |
| 7 | Downloads section intact | **PASS** | `#downloads` present, visible, 5 PDF cards rendered ("Healing Secrets of Kairali — free e-book", "Ayurveda packages price list 2025-26" ×3 currencies, "Butterfly Booklet"), each with a working-looking "DOWNLOAD PDF" button. Confirmed after both search-filter and clear. |
| 8 | Long questions wrap cleanly on mobile (390px) | **PASS** | Longest question in the set, "Do you offer any certification or training programmes for Ayurvedic practitioners?" (85 chars), renders at 315px width inside a 390px viewport — wraps to 3 clean lines, `overflowsViewport:false`. No horizontal scrollbar. |
| 9 | No overflow | **PASS** | `document.documentElement.scrollWidth === clientWidth` at both 1440 (1440/1440) and 390 (390/390). |
| 10 | Keyboard focus visible on summaries | **PASS** | Tabbing to a `<summary>` produces `outline: solid 2px rgb(0,96,56)` (the site's KTAHV green token) with `outline-offset:2px` **plus** a secondary paper-color halo via `box-shadow: rgba(247,244,234,.85) 0 0 0 6px`. `el.matches(':focus-visible')` is `true`. This is a strong, on-brand, double-layer focus ring — no note needed. |
| — | Mobile "Jump to a topic" rail is a 2-column tile grid | **PASS** (called out in the brief as a thing to check even though not numbered) | At 390px the rail's list container is `display:grid; grid-template-columns:170.5px 170.5px` — genuinely a 2-column grid (13 tiles, 2 per row), not a fake/flex approximation. |
| — | Mobile tap targets on FAQ summaries | **PASS** | Sampled 5 summaries: heights 79/58/79/79/79px, width 351px (full content width minus padding). All ≥44px. |
| — | Body/label type floor (≥15.5px body, ≥14px labels) | **PASS**, one label sits exactly at the floor | Answer paragraphs: 17.5px (above floor). "Jump to a topic" rail label: `font-size:14px !important` — exactly at the 14px label floor, not below it. |

### Additional finding (Warning) — WhatsApp CTA color is inconsistent across pages

The FAQ page's "Still unanswered" card uses a **gold** button for its single CTA:
`WHATSAPP PATIENT CARE` → `background: rgb(238,180,30)` (the site's gold-accent token, same gold used for "Connect for Free Doctor Consultation" on the homepage hero and "Free online consultation" on the search page).

Everywhere else the same action ("message Priya on WhatsApp") is styled **green**, not gold:
- Homepage search-overlay dialog: `ASK PRIYA ON WHATSAPP` → `rgb(0,96,56)` (KTAHV green)
- `/search/` results fallback row: `ASK PRIYA ON WHATSAPP` → `rgb(0,96,56)`
- The persistent floating WhatsApp bubble (bottom-right, visible in the overlay screenshot) is also green.

This reads as a real, established sitewide convention (green = WhatsApp, gold = primary consultation CTA, white/outline = phone) that the FAQ page's "Still unanswered" card breaks by using gold for its WhatsApp button instead of green. Minor on its own, but it is the kind of "same component, different color on different pages" drift the design principles call out.

**Fix:** change the FAQ page's "WhatsApp Patient Care" button background from `rgb(238,180,30)` to the site's green token `rgb(0,96,56)` to match the overlay/search/floating-bubble convention.

---

## Page 2 — `/search/`

| # | Check | Result | Measured |
|---|---|---|---|
| 1 | `?q=psoriasis` — grouped results | **PASS** | "3 results for "psoriasis"" heading, two groups rendered — **PROGRAMMES** (2 cards: "Psoriasis & Chronic Skin Treatment", "Ayurveda Skin Vitality Revival Treatment") and **QUESTIONS** (1 card, links to the Treatments & Programmes FAQ topic). Clean card hierarchy, consistent row height, chevron affordance on every card. |
| 2 | `?q=panchkarma` — correction line | **PASS** | Correction line reads **"Showing results for "panchakarma" — you typed "panchkarma""**. Results are richer here: three groups — PROGRAMMES (2), QUESTIONS (5), and a third group **PAGES** (11 legacy/content pages, e.g. "What is Panchakarma?", "Panchakarma Treatment in Kerala") with title + one-line snippet each. Grouping and snippet-truncation ("…") read well; no layout breakage from the longer result set. |
| 3 | `?q=asdfgh` — zero-state, six buttons | **PASS** | "No page matches "asdfgh". Try a condition (back pain, psoriasis), a place (airport) or a question (visa)." followed by exactly **six** tiles in a 3×2 grid (desktop) / stacked (mobile): A health condition, Prices and duration, How to reach us, Where you will stay, Learn Ayurveda, Talk to a doctor — each links to a real page (`/ayurvedic-treatments/`, `/ayurveda-package/`, `/how-to-reach/`, `/our-villas/`, `/ayurveda-training-programme/`, `/online-consultation/`). Consistent 90×247px cards, 4px radius, white background. |
| 4 | `/search/` (empty query) | **PASS** | Same zero-state pattern with "What are you looking for?" instead of the no-match message — sensible, no broken/empty UI. |
| 5 | Fallback row (WhatsApp / consultation / call) | **PASS** | Present and identical on all four states: `Ask Priya on WhatsApp` → `wa.me/919289838797` (matches the locked WhatsApp number **+91 92898 38797** exactly — no …38777 bug), `Free online consultation` → `/online-consultation/`, `Call +91 9555 156 156` → `tel:+919555156156` (matches the homepage's own `tel:` link, so it's a real, consistent front-desk number, not a fabricated one). |
| 6 | Button styles = gold system | **PASS, matches sitewide 3-tier CTA convention** | `Ask Priya on WhatsApp` = green `rgb(0,96,56)`, `Free online consultation` = gold `rgb(238,180,30)`, `Call …` = white/outline. All 4px radius, 50px height (desktop), 48–50px (mobile). This is the same 3-button pattern as the homepage search-overlay (see screenshot), so it's internally consistent — it's the **FAQ page** that deviates from it (see Warning above), not this page. |
| 7 | Mobile stacking | **PASS** | At 390px the three CTA buttons and the six zero-state tiles stack full-width, vertically, no overlap, no overflow (`scrollWidth===clientWidth===390` on both `psoriasis` and `asdfgh` states). |
| 8 | Tap targets | **PASS** (one unrelated Warning below) | Result cards 115–118px tall, CTA buttons 48–50px, zero-state tiles 90px — all comfortably ≥44px. |
| 9 | Header search button still opens the overlay (JS on) | **PASS** | Clicking the visible header `button[aria-label="Search"]` opens the `#ahv-search-dialog` overlay (screenshot: `desktop-1440-search-overlay-open.png`) — currency toggle (₹/$/€), a real text input with visible focus ring, the same six "What are you looking for?" tiles, an "Often searched" chip row (back pain / Panchakarma / psoriasis / diabetes / airport / prices), and the same green/gold/white fallback row. Typing "psoriasis" + Enter submits the dialog's own form (`action="/ayurvedic-treatments/", method=get, input name="q"`) and navigates to a matched content page (`/treatment-for-psoriasis/`) — confirms the whole flow is JS-wired and functional, not a dead button. |

### CRITICAL — `/search/` results page ships with a stripped-down header (missing sitewide nav)

At identical 1440×1000 viewport, the `/faqs-downloads/` header and the `/search/` header are not the same component:

**`/faqs-downloads/` header (the sitewide standard, also seen on the homepage):** logo, full nav (`Ayurveda Treatment · Villas · Yoga & Training · Offers · About Us`), `EN ▾` language switcher (DE/FR), `BOOK YOUR STAY` CTA, search icon. `header.innerHTML` = 4,551 characters.

**`/search/` header (all four query states, desktop and mobile):** logo, a single `Ayurveda Treatment` link, and the search icon. Nothing else. `header.innerHTML` = 904 characters:

```html
<header style="background:rgba(247,244,234,.97);border-bottom:1px solid #E9E2D3">
  <div style="...display:flex;align-items:center;justify-content:space-between...">
    <a href="/">…logo…</a>
    <div style="display:flex;gap:10px;align-items:center">
      <a href="/ayurvedic-treatments/">Ayurveda Treatment</a>
      <button aria-label="Search" aria-controls="ahv-search-dialog">⌕</button>
    </div>
  </div>
</header>
```

This is a hand-rolled, inline-styled header markup — not a hydration failure (zero console errors on either page) but a genuinely different, reduced component shipped specifically for the search results template. Consequences:
- **No way to reach Villas, Yoga & Training, Offers, or About Us** from the header on the page users land on straight from search intent.
- **No language switcher** — breaks the KTAHV EN/DE/FR locale parity expectation for a page that will get organic + on-site search traffic.
- **No "Book Your Stay" CTA** — the site's primary conversion button is absent from the header on a page whose whole purpose is to route a user toward conversion.
- **No hamburger/menu affordance on mobile either** — at 390px the lone "AYURVEDA TREATMENT" label wraps awkwardly onto two lines next to the logo (see `mobile-390-search-psoriasis.png`, `mobile-390-search-asdfgh.png`); there is no menu icon at all, so mobile visitors have literally one header link plus the search icon.
- Footer navigation is intact (Home / Programmes / FAQs / How to reach / Contact / email) on this page, so it is not a complete dead end, but the primary nav — the thing users expect to be sitewide-identical — is not.

This matches the Design Mistakes checklist item "Hidden or non-obvious navigation on desktop" and breaks the "Consistent spacing, color, and component behaviour across all pages" principle. Given this is described as "the new server-rendered results page," this reads like an in-progress build that hasn't yet been wired to the shared site header component, rather than an intentional minimal-chrome decision — but that is a build-owner call, not mine to assume.

**Fix:** replace the hand-rolled inline-styled `/search/` header with the shared site header component (same one used on `/faqs-downloads/` and the homepage) so nav, language switcher, and the Book Your Stay CTA are present on every page.

### Additional finding (Warning) — group-label type size is below the stated 14px floor

`PROGRAMMES` / `QUESTIONS` / `PAGES` section labels on `/search/` render at **`font-size:12.5px`** (`letter-spacing:2.4px`, uppercase, gold-brown `rgb(143,98,18)`). The brief's stated floor for labels on this rebuild is **≥14px**, and the FAQ page's own equivalent label ("Jump to a topic", same visual role — small-caps eyebrow) is exactly 14px. The search page's group labels sit 1.5px under that floor.

**Fix:** bump `/search/` group-label `font-size` from 12.5px to 14px to match the FAQ page's eyebrow-label size and the stated type floor.

### Additional finding (Warning) — footer link tap target under 44px

`How to reach` (and by extension the other footer nav links, sampled on `/search/`) renders at **22px height**, `padding:0`, `display:block` — well under the 44px touch-target floor. This is the **global site footer**, so it is not specific to the search/FAQ pages, but it was measured here and is worth flagging since both audited pages carry it. Not scored against either page individually; flagged once for the shared component.

**Fix:** add vertical padding (or `min-height:44px` with flex/inline-flex centering) to footer nav links, site-wide.

---

## Unverified / not checked

- **Root cause of the `fullPage` screenshot hang** on `/faqs-downloads/` — worked around, not diagnosed. Flag for whoever next runs automated full-page tooling (Lighthouse, other QA agents) against this page.
- **Enter-to-search from the `/search/` page's own inline `#faq-filter`-style input** (typing on `/search/` itself and clicking its `SEARCH` button to re-trigger navigation client-side) was not separately exercised — all four query states were verified by direct URL navigation (`?q=...`), which is how the page will actually be reached from real search traffic, so this gap is low-risk but noted.
- **DE/FR locale parity** for either page was not checked (out of scope of the brief, which named only the English pages) — flagged per the KTAHV locale rule for completeness, not scored.
- Content/factual accuracy of the new FAQ answers (prices, policy text) was not reviewed — out of scope for design QA; the content pass already has its own sign-off per the commit history (`98bc668a`).

---

## Verdict

**PAGE 1 (`/faqs-downloads/`): PASS WITH WARNINGS** — every numbered check in the brief passes with real measurements; one cross-page color-consistency Warning (WhatsApp CTA gold vs. sitewide green).

**PAGE 2 (`/search/`): FAIL — needs rework** — every content/interaction check in the brief passes (grouping, correction line, zero-state six buttons, fallback row, gold-system buttons, mobile stacking, tap targets, header search button opens the overlay), but the page ships a stripped-down header missing the sitewide nav, language switcher, and primary CTA (Critical), plus one label-size Warning below the stated 14px floor.

**OVERALL: FAIL — needs rework** (blocking issue is on Page 2; Page 1 is shippable as-is modulo the one Warning).

---

## Evidence

All screenshots: `launches/ayurvedichealingvillage.com/design-review/faq-search-2026-09-23/`

| File | What it shows |
|---|---|
| `desktop-1440-faq-initial.png` | Full FAQ page, 1440px, topic order incl. Consultation & Admission at #2, sticky rail, downloads section |
| `mobile-390-faq-initial.png` | Full FAQ page, 390px, 2-col rail grid, stacked topics, downloads section |
| `desktop-1440-q9-open.png` / `desktop-1440-q46-open.png` | q-9 (list answer) vs q-46 (prose answer) typography comparison, "−" mark, rail counts |
| `desktop-1440-focus-summary.png` / `desktop-1440-faq-keyboard-focus.png` | Keyboard-focus green ring on a summary element |
| `desktop-1440-search-typo.png` | Full FAQ page with "cancelation policy" filter applied, status line + 2 matches |
| `mobile-390-longest-question.png` | Longest FAQ question wrapping cleanly at 390px |
| `mobile-390-q9-open.png` / `mobile-390-bottom-downloads.png` | Mobile open-question state; mobile downloads section |
| `desktop-1440-search-psoriasis.png` / `-panchkarma.png` / `-asdfgh.png` / `-empty.png` | All four `/search/` query states, desktop, full page, showing the stripped-down header |
| `mobile-390-search-psoriasis.png` / `-asdfgh.png` | Same, mobile — shows the awkward two-line "AYURVEDA TREATMENT" wrap next to the logo |
| `desktop-1440-search-overlay-open.png` | Homepage header search button → overlay dialog open, confirming the search feature is JS-functional |

Report file: `docs/reports/2026-09-23-ahv-faq-search-design-qa.md`
