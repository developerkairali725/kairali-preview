# Design QA Report — arogyashala.in (live Vercel preview, origin/main) · PROMPT 4 pilot re-audit

*Filed by the PROMPT 4 pilot session (docs/reports/2026-07-18-prompt4-single-pager-pilot.md §4); subagent ran 16:12:45–~16:25:00 IST, 18 Jul 2026 (final report stamped 16:20:52 IST); verbatim report below. Predecessor: design-qa-report.md (16 Jul, 2 Criticals — both verified fixed below). Subagent telemetry (machine-reported, final snapshot): 138,798 tokens · 37 tool uses.*

**2026-07-18 16:20:52 IST · sub-agent: design-qa · gate: design-qa-audit (gates/registry.yaml) · REPORT ONLY (filed by parent session)**
**Target: https://kairali-web-factory-arogyashala-in.vercel.app (/, /privacy, /terms, /cookie-policy) · Visual law: packages/ui/brand-tokens.css**

## Method

- curl fetch of all 4 routes (all HTTP 200) + the served CSS bundle `/_next/static/css/d392259daf2c24e1.css` (15,565 bytes); full hex/rgb literal scan; rule-presence greps.
- Repo's Playwright 1.61.1 (headless Chromium) against the LIVE preview at **375×812 (deviceScaleFactor 2–3) and 1440×900**: computed-style capture, 25-stop keyboard focus walk per viewport, full tap-target sweep (25 interactive elements), overflow check, door-focus probe with 400ms transition settle, **pixel-row sampling of the rendered focus ring**, consent-banner geometry, legal-page link sweep, font checks.
- Contrast computed from real computed styles with real sRGB alpha compositing.
- **Not measured this run** (HARD GATE 6): 768px tablet breakpoint (375-first + desktop per brief; the 16 Jul audit covered 768), LCP/Lighthouse timing (parent gate run covers it), screen-reader pass, reduced-motion emulation (rule verified present in served CSS instead).

## Previously-found Criticals — verified fresh from the live preview

| 16 Jul Critical | Current state | Evidence |
|---|---|---|
| Invisible focus ring on `.door` cards | **FIXED — verified live, both viewports** | Served CSS contains `.door:focus-visible{outline:none;box-shadow:var(--shadow-warm),var(--focus-ring)}`. Focused door computed (after 400ms settle): warm shadow + `color(srgb …/0.55) 0 0 0 3px` leaf ring. **Pixel-sampled**: ring band renders rgb(181–183,186–188,124–126) outside the card edge — visibly painted. |
| 18px footer contact tap targets | **FIXED — verified live, both viewports** | Served CSS contains `.site-footer a[data-cta]{display:inline-block;padding-block:14px;margin-block:-14px}`. Measured live: `info@kairali.com` 121×**54**px, WhatsApp link 196×**54**px at 375 and 1440. |

## bronze-600 change (PR #94) — regression check

- Light-ground overlines compute **rgb(135,95,31) = #875F1F = bronze-600**: **5.18:1 on ivory, 5.70:1 on white — AA pass with margin** (bronze-400 measured 2.80:1, the reason for the ruling).
- Dark-hero overline correctly still marigold-300 (ch.08 dark-surface rule): 6.77:1 on forest-700 — pass. Cascade verified in the served bundle.
- **No regression found.** PR #89 also verified: zero hits for "unbroken" / "computed, not claimed" in any served route.

## Findings (Criticals: 0)

| Issue | Severity | Location | Evidence | Fix |
|---|---|---|---|---|
| Consent banner's inline "Privacy policy" link is a **91×17px tap target** on the fixed banner, both viewports. WCAG 2.5.8 AA passes via the inline-sentence exception, but sits under the house 44px bar. Shared-package scope, fleet-wide, **not a regression** (pre-existing). | Warning | packages/consent ConsentBanner (via layout.tsx:37) | Measured 91×17, font 15px | Apply the Ship Gate A4 padding-block pattern in the consent package — its own PR, fleet-wide benefit |
| Legal pages' links are 16–18px tall: back-link "← Arogya Shala" 101×16 + inline mailto/cross-policy links 18px. WCAG 2.5.8 passes via spacing/inline exceptions; under the house 44px bar. Shared `@kairali/legal` boilerplate — fleet-wide, not this site's code. | Warning | packages/legal (via the 3 legal pages) | /privacy: 5 links measured ≤18px tall; same on /terms, /cookie-policy | Padding-block tap area in `@kairali/legal` — own PR |
| At exactly 375×812 the consent banner (top 648.75px) grazes door-2's hint line box (bottom 656.5px) — ~8px descender-zone overlap on "Check that it's genuine ↓". All text still reads; the first-paint law is substantially met with zero margin. | Observation | globals.css:311–322 mobile compression block | Measured geometry + mobile-fold screenshot | If margin wanted: ~10px more compression in the ≤759.98px block |
| `--focus-ring` token (leaf-500@55%) ≈1.69:1 vs ivory / 2.13:1 vs forest-700 — visible via hue shift (pixel-verified), passes WCAG 2.4.7 AA, would not meet a strict 3:1 non-text reading. Brand-tokens-level, fleet-wide, ch.10-mandated — not this site's defect. | Observation | packages/ui/brand-tokens.css:226 | Composited ring rgb(189,196,134) | Route to brand-tokens owner as rev.3-errata note; never patched ad hoc |
| Footer "Terms" link 38px wide (44 tall) — unchanged from 16 Jul; passes WCAG 2.5.8 in a 20px-gap row. | Observation | globals.css:297 | Measured 38×44 both viewports | None; noted for continuity |

## PASS checks (evidence-backed)

| Check | Result | Evidence |
|---|---|---|
| Rogue-hex scan of served CSS | **PASS** | All 15 hex literals are brand tokens (incl. bronze-600 #875F1F); only rgb() literals are the two `--shadow-warm` tints. Zero out-of-ramp colors. |
| WCAG AA contrast — 17 computed pairs, real alpha compositing | **PASS all** | ink/ivory 15.64 · bronze-600/ivory 5.18 · bronze-600/white 5.70 · forest-700/white 11.62 · forest-500/white 7.69 · marigold-300/forest-700 6.77 · lede 8.83 · footer fine 5.39 (13px, >4.5) · flow numerals 6.99 (large-text bar 3.0) · rest ≥6.99 |
| Focus visibility — 25-stop keyboard walk × 2 viewports | **PASS** | Leaf ring on 23/25 stops instantly; 2 door cards confirmed with settle-time probe + pixel sampling (initial "miss" was mid-transition serialization). FAQ `summary:focus-visible` leaf ring confirmed (16 Jul Warning now fixed). Zero default-blue outlines, zero invisible stops. |
| Touch targets ≥44px (site-owned) | **PASS** | Wordmark 44×44, doors 335×151/531×146, all 6 pills ≥147×44, summaries ≥64 tall, footer CTAs 54 tall, consent buttons 133/108×44. Sub-44 items are the two shared-package Warnings + accepted 38px "Terms" width. |
| No overflow at 375 or 1440 | **PASS** | scrollWidth == clientWidth both viewports; legal pages overflow-free at 375. |
| Both doors above the fold at 375×812 | **PASS** | door-1 357–508; door-2 bottom 672 < 812 (banner-graze noted); desktop 423–569 < 900. |
| Typography law | **PASS** | h1 Kurale w400, body Asap 16px, overlines/numerals Lato; **storefront SVG board text now computes Kurale** (16 Jul Georgia hard-code Warning fixed); 3 faces total. |
| Pills + 44px floor + motion law in served CSS | **PASS** | `.btn` radius 999px; min 44px floors; hover deepens no-lift; `prefers-reduced-motion` rule present. |
| Locked facts + register | **PASS** | info@kairali.com ✓, +91 92898 38797 ✓, zero …38777, zero banned filler, all 4 routes. |
| Legal routes | **PASS** | All three 200, brand-tokened, draft-notice visible (honest pre-flip state, tracked for flip). |
| Consent banner | **PASS** (link-size Warning aside) | Renders both viewports; "Essential only" equal prominence; privacy link present; does not cover either door CTA at 375 first paint. |

## Verdict

**PASS** (PASS WITH WARNINGS per contract scale) — both 16 Jul Criticals verified fixed on the live preview with computed-style AND pixel evidence; the bronze-600 change is regression-free (2.80:1 → 5.18:1); served CSS 100% token-conformant; all 17 measured contrast pairs clear WCAG AA; every site-owned touch target ≥44px; every focus stop shows the leaf ring. The two Warnings live in shared packages (`@kairali/consent`, `@kairali/legal`) — fleet-wide fixes in their own PRs, not blockers for this site's gate.
