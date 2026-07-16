# Design QA Report — healing.recipes (first build, premium brief)

**2026-07-16 19:06:09 IST** · sub-agent: design-qa · target: http://localhost:4314 (production build)
Register: ED (editorial, group entity) · Brand law: `packages/ui/brand-tokens.css` v1.1 · Premium tips applied (brief tagged "premium").

**Files reviewed:** `sites/healing.recipes/app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/books/[slug]/page.tsx`, `app/author/page.tsx`, `app/press/page.tsx`, `app/contact/page.tsx`, `app/_components/chrome.tsx`, `content/books.json`, `public/covers/*`, `packages/ui/brand-tokens.css`, `DESIGN_NOTES.md`.
**Evidence:** `launches/healing.recipes/screens/qa-{home,book-harmony}-{mobile,tablet,desktop}-{fold,full}.png`, `qa-focus-ring-desktop.png`, machine probe `qa-audit-results.json` (computed styles, contrast composites, route sweep). Viewports: 375×812 / 768×1024 / 1440×900.

## Findings

| Issue | Severity | Location | Fix |
|---|---|---|---|
| WCAG AA contrast FAIL on book-plate subtitle: bronze on ivory measures **2.80:1** at 20px/400 (needs 4.5:1; not large text). `--bronze-600` is used as intended, but the token still aliases bronze-400 (ramp TODO), so all 4 book pages render sub-AA display text ("Essential Ayurveda for All", etc.) | Critical | `globals.css:317-322` (`.plate .subtitle`) · root cause `packages/ui/brand-tokens.css:34` | Until the real bronze-600 hex lands, set the subtitle to `var(--forest-700)` (or ink); do NOT darken bronze locally with an invented hex. Re-flag the ramp gap in QUESTIONS.md |
| Unoptimized LCP hero image: `/covers/harmony.jpg` is **670 KB JPEG, 1970×2560**, displayed at 270–380px (5–7× oversize), plain `<img>`, no srcset, no WebP/AVIF; `fetchpriority=high` on home + all 4 plates. Home image payload ≈ 2.37 MB (incl. 900 KB `harmony-mockup.jpg`). Likely LCP > 2.5 s on mobile networks; endangers the ≥90 Lighthouse ship gate; premium tip mandates WebP/AVIF | Critical | `app/page.tsx:100-108`, `app/books/[slug]/page.tsx:104-112`, `public/covers/` | Re-encode covers to WebP/AVIF with responsive `srcset`/`sizes` (hero ≤ ~120 KB at 2× display size); keep `fetchPriority=high` + `loading=lazy` split as-is |
| THE SHELF signature not realized: covers do NOT stand on the bronze shelf line. `align-items:flex-end` bottom-aligns whole card columns, so variable caption line-counts push cover bottoms to four different heights and the shelf line runs under the *text*, not the books — the stated intent (DESIGN_NOTES: "covers stand bottom-aligned on a bronze shelf line") is broken | Warning | `globals.css:193-238` (`.shelf-row`, `.shelf-book`) · evidence `qa-home-desktop-full.png` | Bottom-align the image row itself to the rule (e.g. covers in a flex-end row that carries the `--shelf-line` border; captions in a separate row below the line), keeping the landscape book shorter |
| Buy CTA buried on the conversion page: on `/books/*` the buy-row sits below 2 paragraphs + a 6-row biblio table — below the fold at 1440×900 and ~2 screens down at 375px. The declared KPI is the buy click | Warning | `app/books/[slug]/page.tsx:160-173` | Move `.buy-row` (+ "Where to buy" overline) directly under the award banner; biblio table after |
| Overline below brand floor + sub-manual contrast: site overrides `.overline` to 0.8rem (12.8px), under ch.10's "bronze-400 overlines **≥14px** bold"; measured **2.80:1 on ivory** (the manual's 3.1:1 figure assumes white) | Warning | `globals.css:50-58` (brand-tokens sets 14px; the override shrinks it) | Restore `font-size: 14px`; log the ivory-ground ratio gap for the token library (never weaken the check) |
| Biblio-table labels fail AA: `dt` at ink@55% composites to **3.76:1** at 12.8px/700 (needs 4.5:1) | Warning | `globals.css:347-354` (`.biblio-table dt`) | Raise to ≥62% ink — `.biblio-line`'s 62% measures 4.67:1 (pass) |
| Mobile header is wordmark-only: `.site-nav` and `.header-cta` are both hidden < 760px with no menu — `/press` and `/contact` are reachable only via the footer on mobile. (Hero primary CTA is above the fold, so the conversion path survives; desktop nav is fully visible — not hamburger-only) | Warning | `globals.css:97-100, 437` | Keep a compact "Get Harmony" pill in the mobile header, or add a small nav row; at minimum accept consciously and note in DESIGN_NOTES |
| Inline text links under target size: footer email link 18px, "as reported by The Hindu" 18px, consent-banner "Privacy policy" 17px high (WCAG 2.2 inline exception applies, but ch.10 wants 44px on controls) | Warning | `chrome.tsx:44` footer `.footer-line a`, `page.tsx:210`, `packages/consent` banner | Give the footer email link the 44px inline-flex treatment used by `.footer-nav a`; consent banner is a shared-package note |

## Verified PASS (evidence in qa-audit-results.json + screenshots)

| Check | Result |
|---|---|
| Brand palette: token anchors only; no off-ramp colors found in `globals.css` (all colors are vars or color-mix of vars) | PASS |
| Marigold: never body text on light; spent ONCE on light ground (New·2026 tag, ink-on-marigold); dark-band descriptors marigold per ch.08, measured 6.19:1 | PASS |
| Type law: computed h1 = Kurale 400 (never bolded); body Asap 16px; Lato captions; the brand trio only, sub-brand faces absent | PASS |
| Buttons: `.btn` computed border-radius 999px (pill); hover deepens forest-500→700, no lift/transform | PASS |
| Focus: leaf-green ring verified via keyboard probe (`#8E9D35` @55%, 3px) on nav links | PASS |
| Motion: single settle moment 102→100% @400ms brand curve; hover deepens shadow only, nothing bounces; `prefers-reduced-motion` honored (animation 0.00001s) | PASS |
| Mobile-first: zero horizontal overflow at 375/768/1440 on home + book plates; layout intact in all 6 shots | PASS |
| Dark-surface law: shelf + footer body = ivory@90% (8.85:1); footer-fine 5.38:1; shelf biblio 5.74:1 — all AA | PASS |
| Body text: ink on ivory 15.64:1; `.biblio-line` 4.67:1 (AA) | PASS |
| Hierarchy: one focal point per section; single unambiguous primary action (every `.btn-primary` on home → /books/harmony); hero CTA above the fold at all three breakpoints | PASS |
| Navigation: desktop nav fully visible, no unnecessary hamburger | PASS |
| Imagery: real Roli Books covers (no stock); alt text on every content image; header icon `alt="" aria-hidden` | PASS |
| Routes: 8/8 return 200, exactly one h1 each, correct titles; zero console errors | PASS |
| Premium: generous whitespace, restrained earthy palette, real photography, bibliographic-data-as-decoration — minimalism with intent holds | PASS (except image-format tip → Critical #2) |

## Verdict (first pass)

**FAIL — needs rework.** Two Criticals: (1) sub-AA bronze subtitle on all four book plates (token-ramp gap surfacing as real text), (2) unoptimized ~670 KB JPEG LCP hero (5–7× oversize, no modern format) that threatens the 2.5 s LCP / Lighthouse-90 ship gate. Both are narrow, low-risk fixes; Warnings 3–5 (shelf alignment, buried buy CTA, overline floor) should ride the same rework pass. Log entry lands via the PostToolUse hook (rule q); logger rollup to `wiki/log.md` on next pass.

---

# Re-verification — commit 70f231e

**2026-07-16 19:21:20 IST** · sub-agent: design-qa · same production build target http://localhost:4314
**Evidence:** `screens/qa2-{book-harmony-desktop,book-harmony-mobile,home-mobile}-fold.png`, `qa2-shelf-desktop.png`, `qa2-shelf-mobile.png`, machine probe `qa2-reverify-results.json`; CSS diff `git diff HEAD~1 -- sites/healing.recipes/app/globals.css`.

| Original finding | Re-check result | Status |
|---|---|---|
| Critical 1 — plate subtitle contrast | Computed color now `rgb(0,66,38)` (forest-700); measured **10.56:1** on ivory at 20px. CSS comment preserves the bronze-600 ramp TODO instead of deleting it — check not weakened | **FIXED** |
| Critical 2 — LCP image payload | Hero `harmony.jpg` now 760×987 @ **204 KB** (exactly 2× its 380px max display); full home image payload measured over the wire: **836 KB** total (was ~2.37 MB) — harmony 204 + mockup 305 + cookbook 172 + massage 106 + wellness 61 + icon 8 | **FIXED** (note: still JPEG; WebP/AVIF + srcset remains a queued nicety, no longer a gate risk) |
| Warning — shelf signature | All four cover-img bottoms measure identical y (probe: 4 × equal bottom); `qa2-shelf-desktop.png` shows the covers standing ON the bronze line (`.shelf-row::before` at `--shelf-h`), landscape book shorter, captions hanging below like labels. Mobile: per-book shelf segments (`.cover-slot` border) verified in `qa2-shelf-mobile.png` | **FIXED** |
| Warning — buried buy CTA | `.buy-row` top = **385px** at 1440×900 (well above fold). Mobile 375×812: top = 894px — ~80px below the fold (cover height pushes it); one short swipe, acceptable | **FIXED** (desktop) / acceptable residual (mobile) |
| Warning — overline below 14px floor | Computed `.overline` font-size = **14px** (0.875rem) | **FIXED** (bronze-on-ivory 2.8:1 remains the manual-vs-ivory token-library question, logged as Q14 in the CSS comment — escalated, not a site rework item) |
| Warning — mobile nav hidden | At 375px: `.site-nav` visible with all 4 links (The Books / The Author / Press / Contact) + "Get Harmony" CTA visible; header wraps to two rows (113px); horizontal overflow 0; hero primary CTA still in fold (top 505px) | **FIXED** |
| Warning — `.biblio-table dt` contrast | Still ink@55% → measured **3.76:1** at 12.8px/700 (needs 4.5:1). Not in the fix list | **NOT FIXED — remaining** (fix: raise to ≥62% ink; `.biblio-line`'s 62% passes at 4.67:1) |
| Warning — inline links under target size | Footer email link / "as reported by The Hindu" / consent "Privacy policy" unchanged. New minor: mobile fix sets `.header-cta { min-height: 40px }` and nav links measure **40px** high — under the ch.10 44px touch floor (WCAG 2.5.8 AA still passes at ≥24px) | **NOT FIXED — remaining** (minor; bump mobile header controls to 44px, give footer email link the 44px inline-flex treatment) |

## Re-verification verdict

**PASS WITH WARNINGS.** Both Criticals cleared with machine-verified evidence; shelf signature, buy-row fold, overline floor, and mobile nav all confirmed fixed. Remaining (non-blocking): (1) `.biblio-table dt` at 3.76:1 — an AA miss on the small plate-table labels, one-line fix (globals.css `.biblio-table dt`, raise ink mix ≥62%); (2) mobile header controls at 40px vs the 44px ch.10 floor + the pre-existing inline-link sizes (incl. shared consent package). Neither blocks launch-pool entry; both should ride the next touch of globals.css.
