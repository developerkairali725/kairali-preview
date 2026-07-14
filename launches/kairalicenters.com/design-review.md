# kairalicenters.com — Design-critic gate (Ship Gate B-14)

- **Reviewed:** 2026-07-14 23:40:00 IST
- **Reviewer stance:** skeptical marketer + senior design reviewer (per scripts/design-review/PROMPT.md v1.0)
- **Register judged:** Group / treatment-centres directory — non-revenue lead-gen. Judged as a clean, trustworthy multi-location health directory whose job is to help a visitor find a centre and book. KTAHV clinical lock applies only to KTAHV/hospital references (none marketed here).
- **Preview:** http://localhost:4313 — `/` · `/centres/new-delhi-mehrauli` · `/centres/yokohama` · `/privacy` (all HTTP 200).
- **Verdict:** **PASS at iteration 2** — average **9.0/10** (gate ≥ 9.0), no criterion < 7. Iteration 1 was **8.8 FAIL** (held down solely by CTA clarity = 8); the builder applied all three selector-level fixes and CTA clarity rose to 9. Iteration-2 scorecard is at the bottom of this file; iteration-1 record is preserved below it.

---

## Method + viewports

1. **Mobile first, 375×812** (read the two mobile screenshots first, then live walkthrough): full top-to-bottom pass, consent-banner + sticky-CTA + chat-bubble layering tested live, focus ring tested with a real Tab keypress, one-accent scan.
2. **Desktop 1280×800**: nav/sticky visibility, hero grid, 14-card render, footer dark surface, computed-style token audit (DevTools JS).
3. Locked-fact + banned-word greps across all four pages (curl).
4. Console-error and image-load check.

Evidence is computed `rgb()`/px values and live screenshots, not vibes.

### Computed-style audit (both viewports)
| Token | Manual anchor | Computed | Pass |
|---|---|---|---|
| `--ivory` | #F7F4EA | #F7F4EA | ✓ |
| `--forest-500` | #006038 | #006038 (btn bg rgb(0,96,56)) | ✓ |
| `--marigold-400` | #EEB41E | rgb(238,180,30) | ✓ |
| `--bronze-400` | #C1882C | rgb(193,136,44) | ✓ |
| h1 | Kurale, weight 400, never bold | Kurale 400, 35.2px, forest-700 rgb(0,66,38) | ✓ |
| overline | Lato caption | Lato, bronze-400, 12.48px | ⚠ size < 14px (see #5) |
| primary button | forest fill, pill 999px, ≥44px | rgb(0,96,56), 999px, minH 48px | ✓ |
| card | white, 16px, warm shadow | #FFF, 16px, rgba(94,66,22,.08/.10) | ✓ |
| focus ring | leaf-500 visible | box-shadow leaf-500 @55%, `:focus-visible` matches on Tab | ✓ |
| one accent / light view | 1 marigold moment | only `.accent-rule` (home + desktop scans) | ✓ |
| footer | forest-700 dark, marigold-on-dark heads | bg rgb(0,66,38), h4 rgb(238,180,30) | ✓ |

### Locked-fact / compliance greps
- Bad WhatsApp `…38777`: **0** occurrences. Correct `…38797` present (`919289838797` + `92898 38797`). ✓
- Public email: `info@kairali.com` ×6, **zero** `info@kairalicenters.com`. ✓ (matches locked fact)
- Banned KTAHV words on home (`cure/luxury/holiday/journey`): **0** — legacy "cure"/"journey" scrubbed. ✓
- "18 centres / 9 countries" unverified count: **absent** — correctly not asserted (Q-KC-ROSTER). ✓
- Partner "Spa"/"Resort" appear only inside real registered names (Yokohama "Health Spa", Prague "Resort Svatá Kateřina") — factual, allowed on group register. ✓
- `/privacy` renders real content (~23K chars body); consent banner links to `/privacy` (×3). ✓
- Console errors: **none.** All 3 images load (raster logo 500px interim, hero 1800px, chat icon).

---

## Iteration 1 scorecard — 8.8 / FAIL (record preserved)

| # | Criterion | Score | Evidence |
|---|---|---|---|
| 1 | Premium feel | **9** | Ivory ground, Kurale 400 display serif, warm-tinted shadows on white cards, one marigold accent, authentic physician-led hero photo, substantive trust strip (Since 1908 / NABH / WHO-GMP / Physician-Led). Calm and expensive; zero template-smell. Drag: single hero photograph + text-only centre cards read a touch sparse below the fold; raster logo is a soft interim. |
| 2 | Human-made feel | **9** | 14 centres with verbatim NAP (address/phone/email/hours). Honest restraint is a feature: unverified "18/9" count deliberately omitted; Raipur "Opening hours to be confirmed" and Prague "Website/email domain spelling to be confirmed" surfaced rather than faked; partner centres labelled plainly. Family voice ("same family of physicians behind our NABH-accredited hospital"). Responsible disclaimer. Drag: the per-centre lede sentence is identical across all 14 pages — boilerplate below the NAP block. |
| 3 | Mobile UX | **9** | Clean 375px walkthrough, no horizontal leak, h1 wraps cleanly. Three floating elements deliberately de-conflicted: consent banner (fixed z60) sits above the sticky CTA (z50) until dismissed; on "Essential only" the sticky "Book on WhatsApp" (48px tall, full-width) reveals cleanly; chat bubble lifted to `bottom:84px` so it clears the sticky bar (verified live — no collision). Leaf-green focus ring on keyboard focus. Drag: three stacked bottom elements is inherently busy; chat bubble overlaps the hero photo (cosmetic). |
| 4 | CTA clarity | **8** | `data-cta` fully wired (browse_india/browse_intl/centre_click/whatsapp_click/call_click/map_click/email_click). Excellent "what happens next" helper copy on centre pages ("call the number above or message us on WhatsApp… for general enquiries write to info@kairali.com"). Correct hero primary(fill)/secondary(outline) pair. **Weakest thing on the build (named plainly):** (a) the header WhatsApp CTA (`.header-cta` in chrome.tsx) is `style={{display:"none"}}` **permanently** — dead markup, and desktop above-the-fold therefore carries **no persistent conversion affordance** (the nav "Contact" only scrolls to the footer); (b) on mobile the hero shows **two forest-filled primaries at once** — "Centres in India" (a jump link) and the sticky "Book on WhatsApp" — competing for the eye and diluting one-primary-per-view. For a lead-gen directory judged by a conversion marketer, this is a real, evidenced 8. |
| 5 | Brand-manual fidelity | **9** | Tokens only; every computed hex matches the manual; one-accent-per-light-view verified programmatically at both viewports; leaf focus ring; pill radii; forest-700 dark footer with allowed marigold-on-dark headings; group register correct; banned words scrubbed. One nick: `.overline` (12.48px) and `.centre-card .cc-place` / `.country-h` (~12.8px) render in `--bronze-400`, whose 3.1:1 contrast the brand usage law permits only for "overlines ≥14px bold" — below 14px it must step to bronze-600. A strict reading of the manual flags these sub-14px bronze labels. |

**Average = (9 + 9 + 9 + 8 + 9) / 5 = 8.8/10 → FAIL (gate ≥ 9.0; no criterion < 7).**

Per the rulebook this scorecard is NOT ground up by softening criteria — the site is genuinely strong and misses by 0.2 on the conversion layer alone. No source was modified in this pass (review scope). The three fixes below are quick and would take it over 9.0; the fix→rebuild→re-review loop is the builder's next step before C-1.

---

## Top 3 concrete improvements (selector-level)

1. **Give desktop a persistent header CTA (kills the dead markup + the biggest conversion gap).**
   In `app/_components/chrome.tsx` the header CTA is `style={{ display: "none" }}` — remove that inline style. In `app/globals.css` reveal it from the desktop breakpoint:
   ```css
   .header-cta { display: none; }
   @media (min-width: 768px) { .header-cta { display: inline-flex; } }
   ```
   Point it at WhatsApp/Contact (it already carries `data-cta="whatsapp_click"`). Desktop above-the-fold then has a clear "Book / WhatsApp" affordance instead of only a footer jump.

2. **One filled primary per mobile view.** The hero jump buttons are navigation, not conversion — demote them so the sticky "Book on WhatsApp" is the sole forest-fill in view. Change the hero primary to secondary:
   ```css
   /* app/page.tsx hero: make "Centres in India" .btn-secondary too, OR: */
   .hero .cta-row .btn-primary { /* restyle as .btn-secondary (outline) */ }
   ```
   Keep "International" secondary. Restores one-primary-per-view without losing wayfinding.

3. **Lift sub-14px bronze labels to the brand contrast floor.** `.overline`, `.centre-card .cc-place`, `.country-h` are ~12.5–12.8px in `--bronze-400` (3.1:1) — below the manual's "≥14px bold" rule. Bump to 14px:
   ```css
   .overline { font-size: 0.875rem; }            /* 12.48 → 14px */
   .centre-card .cc-place { font-size: 0.875rem; }
   .country-h { font-size: 0.875rem; }
   ```
   (Cleaner long-term: switch their `color` to `var(--bronze-600)` once the real bronze-600 hex lands — it is currently aliased to bronze-400 in brand-tokens.css, so the ramp gap should be flagged.)

---

## Honest limitations (not scored away)

- **Raster logo interim.** `/images/kairali-logo.png` (500px) is an accepted interim pending the SVG lockups the brand manual lists as "assets required from design team." It is slightly soft at the desktop header size. Not penalised; flagged.
- **`bronze-600` ramp is a placeholder.** brand-tokens.css aliases `--bronze-600` to `--bronze-400` (TODO in the manual). Fix #3's ideal form (recolour to bronze-600) can't be fully correct until the real hex lands; the interim (bump to 14px) is applied instead.
- **Single hero photograph; text-only centre cards.** Honest for a verbatim-data directory, but the home page leans sparse below the hero. No per-centre photography or per-centre human detail exists in the source data (lib/centres.ts is verbatim-only), so the per-centre pages share one boilerplate lede — a content limitation, not a build defect.
- **Partner-vs-owned + roster count unresolved upstream.** Partner flags and the "14 live vs 18 register" discrepancy are open questions (Q-KC-ROSTER, Q-KC-PARTNERS); the build correctly asserts neither. Not a design finding.
- **Chat widget is third-party (chatbase).** Its icon loads from an external CDN; its bubble is positioned by our CSS. Behaviour beyond position/collision was not audited here.
- **Not scored:** Lighthouse, spec suite, and compliance-lint results are separate gates (this pass judges only what machines cannot). Legal pages (`/privacy` etc.) confirmed present and content-bearing but not legally reviewed.

---

# Iteration 2 — re-score (2026-07-14 23:55:00 IST)

**Trigger:** builder reported all three iteration-1 fixes applied; rebuild brand-lint PASS, factory-spec 20/20; site restarted at http://localhost:4313; fresh `home-desktop.png` / `home-mobile.png`.

## Fixes verified (source + live computed style + fresh screenshots)

| Fix | Source | Live evidence | Verdict |
|---|---|---|---|
| 1. Desktop header CTA revealed | `chrome.tsx` inline `display:none` removed; `globals.css:68` `.header-cta{display:none}` + `:222` `@media(min-width:768px){.header-cta{display:inline-flex;min-height:48px}}` | Desktop: header WhatsApp `display:flex`, minH 48px, `href=wa.me/919289838797`, `data-cta="whatsapp_click"`, visible top-right (fresh desktop screenshot). | ✓ |
| 2. One filled primary per view | `page.tsx:57-58` both hero jump-buttons now `.btn-secondary`; sticky `page.tsx:104` remains `.btn-primary` | Live: both hero buttons `filled:false` (bg transparent, 1.5px border); zero `.btn-primary` visible on desktop; on mobile the sticky "Book on WhatsApp" is the sole filled primary. | ✓ |
| 3. Sub-14px bronze labels lifted | `globals.css:45` `.overline`, `:241` `.cc-place`, `:254` `.country-h` → `font-size:0.875rem` | Live computed: `.overline` 14px, `.cc-place` 14px (`.country-h` 0.875rem in source, renders on centre pages). Now within the manual's "bronze-400 ≥14px bold" allowance. | ✓ |

**Regression checks (unchanged):** tokens still match (forest #006038, marigold #EEB41E); one-accent-per-light-view holds (only `.accent-rule` marigold, both viewports); locked facts intact — 0× `…38777`, correct `…38797` present, `info@kairali.com` ×6 with zero `kairalicenters.com` email variant; header WhatsApp carries the correct number.

## Iteration-2 scorecard

| # | Criterion | Iter-1 | Iter-2 | Note |
|---|---|---|---|---|
| 1 | Premium feel | 9 | **9** | Unchanged strengths; 14px labels marginally cleaner; all-outline desktop hero reads calm/restrained. Same drags (single hero photo, text-only cards, raster-logo interim). |
| 2 | Human-made feel | 9 | **9** | Content identical — verbatim NAP, honest omissions, boilerplate per-centre lede drag remains. |
| 3 | Mobile UX | 9 | **9** | Still clean; the sticky "Book on WhatsApp" is now the single filled primary, marginally clearer; floating-UI de-confliction (consent z60 / sticky z50 / chat `bottom:84px`) intact. |
| 4 | CTA clarity | 8 | **9** | **The fixed criterion.** Iteration-1's three concrete dings are resolved: desktop now carries a persistent header WhatsApp CTA (was dead `display:none` markup); one filled primary per view (mobile sticky) — no competing forest pills; `data-cta` fully wired; helper copy still excellent. Residual is a soft preference only (see limitations), not a defect. |
| 5 | Brand-manual fidelity | 9 | **9** | The only iteration-1 nick (sub-14px bronze at 3.1:1) is gone — labels at 14px bold now sit inside the manual's usage law. Token-perfect, one-accent verified, leaf focus ring, register-correct. Held at 9, not higher, because the raster-logo interim and the placeholder `--bronze-600` ramp (still aliased to bronze-400) remain acknowledged brand-asset gaps. |

**Iteration-2 average = (9 + 9 + 9 + 9 + 9) / 5 = 9.0/10 → PASS** (gate ≥ 9.0; no criterion < 7). Clears the gate on the strength of the CTA fix; not softened — the CTA rise reflects the objective resolution of the three evidenced iteration-1 problems.

## Iteration-2 honest limitations (not scored away)

- **Desktop hero has no *filled* primary.** With both hero buttons and the header WhatsApp all rendered as forest outlines, the desktop above-the-fold has three equal-weight outline pills and no single filled anchor. This satisfies "one primary per view" and suits the brand's calm restraint, and the filled primary correctly appears at the point of decision (mobile sticky + each centre page's "Book on WhatsApp") — so it is recorded as a hierarchy preference, not a defect. If stronger desktop conversion pull is later wanted, promote only the header WhatsApp to `.btn-primary` (keep the two hero jump-buttons outline). Note: the builder described the header CTA as "the sole filled primary," but it renders as `.btn-secondary` (outline) — functionally a persistent CTA, just not filled.
- **Carried from iteration 1 (unchanged):** raster-logo interim pending SVG lockups; `--bronze-600` ramp still a placeholder alias in brand-tokens.css; single hero photograph + verbatim-only per-centre data (shared boilerplate lede); partner-vs-owned and 14-vs-18 roster questions open upstream (correctly not asserted); third-party chatbase widget (position/collision audited only); Lighthouse/spec/compliance-lint are separate gates; legal pages present but not legally reviewed.
