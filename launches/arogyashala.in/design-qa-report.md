# Design QA Report — arogyashala.in (feat/arogyashala-v1)

**2026-07-16 20:37:02 IST · sub-agent: design-qa · production build audited live at http://localhost:4315**
**Design intent: docs/design-research/arogyashala-2026-07-16.md §3+§5 · Visual law: packages/ui/brand-tokens.css · D-DESIGN-DIFF similarity gate (DECISIONS 16 Jul 19:40 IST) included below.**

## Method

- Playwright (Node library, headless Chromium) against the production build. Viewports: 375×812, 768×1024, 1440×900.
- Screenshots (10, `qa-` prefix) in `launches/arogyashala.in/screens/`: fold + full-page per viewport, consent banner, FAQ open, door keyboard-focus, focus-ring clip.
- Computed-style audit (colors, faces, weights, radii), keyboard-walk focus audit (20 tab stops), touch-target sweep of every interactive element, pixel-sampling of the hero/doors seam, text scan (banned filler, locked facts, cure claims), resource-weight capture, legal-page fetches.
- `globals.css` diffed against `packages/ui/brand-tokens.css`; served CSS bundle (`b2b1e4398787215d.css`) verified identical to the working tree.
- Not a Shopify surface — Shopify checks skipped per brief.

## Findings

| Issue | Severity | Location | Fix |
|---|---|---|---|
| **Keyboard focus is invisible on the two door cards** — the page's primary router. Brand-tokens' `:where(…):focus-visible` rule (specificity 0,1,0) sets `outline:none` and the leaf ring via `box-shadow`, but `.door`'s own `box-shadow: var(--shadow-warm)` (also 0,1,0, later in cascade since globals.css loads after brand-tokens.css) overrides the ring while `outline:none` still applies. Verified empirically: focused door computes `outline:none`, box-shadow = warm shadow only (screens/qa-desktop-door-focus.png — no indicator). WCAG 2.4.7 failure + charter "missing leaf-green focus rings" (fail-if-violated). | **Critical** | sites/arogyashala.in/app/globals.css:96–109 (`.door`); packages/ui/brand-tokens.css:113–114 | Add to globals.css: `.door:focus-visible { box-shadow: var(--shadow-warm), var(--focus-ring); }` |
| **Footer inline contact links are 18px-tall tap targets** (`info@kairali.com`, `WhatsApp +91 92898 38797` — both carry `data-cta`, so they are conversion CTAs). 18×121 / 18×196 px at all three viewports. This exact issue was caught fleet-wide 14 Jul (Ship Gate A4) and fixed in arogyakendra with the padding-block/negative-margin pattern — this page regresses on a known lesson. | **Critical** | sites/arogyashala.in/app/page.tsx:316–318; globals.css `.site-footer` (no tap-target rule) | Copy arogyakendra's rule: `.site-footer a[data-cta] { display:inline-block; padding-block:14px; margin-block:-14px; }` (sites/arogyakendra.com/app/globals.css:280–284) |
| **FAQ `summary` gets the browser default blue outline** (`rgb(0,95,204)` auto outline), not the leaf ring — `summary` is missing from brand-tokens' focus selector list (`a, button, input, select, textarea, [tabindex]`), so no site rule styles it. Visible, hence not a WCAG failure, but off-brand on every FAQ control. | Warning | globals.css `.faq-list summary` (no focus rule); root cause packages/ui/brand-tokens.css:113 | Site-level: `.faq-list summary:focus-visible { outline:none; box-shadow: var(--focus-ring); }`. Package-level gap (add `summary` to the `:where()` list) routed as a separate task — brand-tokens changes go via their own PR, never patched ad hoc. |
| **Storefront SVG lettering bypasses the brand faces**: board text hard-codes `fontFamily="Georgia, serif"` and marker numerals `"system-ui"`, rendering a fourth face while Kurale/Lato are loaded on the page (computed: `Georgia, serif`). Presentation attributes can't take `var()` — that's why it was hard-coded. | Warning | page.tsx:95 (board text), 123–127 (markers) | Use `style={{ fontFamily: "var(--font-display)" }}` on the board text and `var(--font-caption)` on marker numerals (style prop accepts var()). |
| **Headings are sentence case throughout** ("What an Arogya Shala counter is", "Before you ask", H1 with trailing period) — Manual ch.11 line (docs/brand/kairali-brand-manual-2026-rev2.md:304) specifies Title Case headings; the shipped fleet (arogyakendra: "Find the Kairali You Need") complies. Voice enforcement owns this, but it is a visible fleet inconsistency. | Warning | page.tsx:164, 192, 204, 276, 299 | Re-case headings Title Case, drop the H1's trailing period; confirm with compliance lint. |
| **Internal governance language leaks into public copy**: trust band reads "118 years of unbroken lineage — computed, not claimed." "Computed, not claimed" is repo rule-6 jargon; a chemist in a tier-2 city cannot parse it. | Warning | page.tsx:251 | "118 years of unbroken lineage — and counting." (the number still renders computed). |
| **Straight apostrophes in FAQ answers** ("programme's", "group's", "Kairali's") while all JSX copy uses typographic `&rsquo;` — visible in qa-desktop-faq-open.png. | Warning | page.tsx:33, 41, 49 | Use ’ in the FAQS strings. |
| **Desktop right-half emptiness after the storefront row**: verify + FAQ sections hold the 720px prose measure hard-left inside the 1120px container, leaving ~40% of a 1440px view empty for ~2 consecutive screens (qa-desktop-1440x900-full.png). Deliberate ivory air per §5, and hierarchy stays clear — but the page opens centered and ends left-ragged. | Warning | globals.css `.faq-list`, `.verify .measure` | Consider centering the verify + FAQ blocks (`margin-inline:auto`) to echo the centered opening; owners' section stays left, anchored by the storefront row. |
| **No persistent contact CTA on mobile**: first WhatsApp pill sits at y≈2353 of 4512 (375×812). Mitigated: both doors are fully above the fold at every viewport (door 1 top = 457px on mobile) and each door lands one tap from its CTA; omitting the fleet's sticky bar is also a similarity-gate win. Watch enquiry conversion after launch before copying the sticky-bar pattern back in. | Warning (observation) | page.tsx hero (no CTA), no `.sticky-cta` | Optional: a plain WhatsApp text link in the dark hero (not a pill pair, to keep the hero statement-only and the fleet distance). |

Touch-target sweep detail: the only sub-44px elements are the two footer inline links above (18px tall) — everything else ≥44px including FAQ summaries (44), door cards, pills (44), footer navs (44 tall; "Terms" is 38px wide, passes WCAG 2.5.8's 24px minimum, acceptable in a 20px-gap row).

## PASS checks (evidence-backed)

| Check | Result | Evidence |
|---|---|---|
| Brand-token conformance — every computed color from the ramps | PASS | hero bg rgb(0,66,38)=forest-700; buttons rgb(0,96,56)=forest-500; overlines rgb(193,136,44)=bronze-400; dark-hero overline rgb(238,180,30)=marigold-300→400 fallback per ch.08; body ink/ivory exact |
| One marigold accent moment per view | PASS | light ground: exactly 1 marigold fill (storefront board dot); dark hero overline is the ch.08 dark-surface descriptor rule, not a light-ground accent |
| Kurale 400 display, never bold; Asap body; Lato caption/numerals; 3 faces loaded | PASS | computed h1/dt Kurale w400; body Asap 16px; flow numerals Lato w300 57.6px; document.fonts confirms 3 (SVG Georgia exception flagged above) |
| Pill buttons; hover deepens one ramp step, never lifts | PASS | border-radius 999px, min-height 44px; `.btn-primary:hover` = forest-700, box-shadow none, transform none |
| Mobile-first, no overflow/breakage at 375 / 768 / 1440 | PASS | scrollWidth == clientWidth at all three; full-page screenshots clean top-to-bottom |
| Above-the-fold action on a conversion page | PASS | the two-door router is the page's action and both doors are fully above the fold at every viewport (mobile door-1 top 457px < 812) |
| LCP posture / performance as constraint | PASS | 209 KB total transfer, 4 KB images, zero raster assets, text-paint hero on flat forest-700 — LCP is a text node |
| Focus rings elsewhere (wordmark, 4 pills, 8 footer links) | PASS | keyboard walk: leaf ring `color(srgb …/0.55) 0 0 0 3px` on 15 of 20 stops (exceptions = the two findings above) |
| Reduced motion honored | PASS | emulated `reduce`: door transition collapses to 0.01ms (brand-tokens rule inherited) |
| Alt/ARIA structure | PASS | 0 imgs missing alt; storefront SVG role="img"+aria-label with HTML callouts; icons aria-hidden; navs labelled; single H1, clean H1→H2→H3 order |
| FAQ accordion + anchor router function without JS frameworks | PASS | native details/summary toggles verified; `#verify` jump scrolls target into view |
| Locked facts + register | PASS | info@kairali.com ✓; WhatsApp +91 92898 38797 ✓ (no …38777 anywhere); zero banned-filler hits; no cure claims; no outlet counts/locations/commercials; years computed (118/37), never typed; footer uses lineage phrasing, not the "© … Since 1908" violation; "founded 1989 by K. V. Ramesh and Gita Ramesh, New Delhi" matches mined legacy source (content-mined/arogyashala.co.in/company-profile.html) and healing.recipes precedent |
| Consent banner | PASS | renders with pill buttons, decline ("Essential only") equal prominence, privacy link; qa-mobile-375x812-consent-banner.png |
| Legal pages | PASS | /privacy, /terms, /cookie-policy all 200 with H1s |
| data-cta coverage | PASS | 8 instrumented: door_owner, door_verify, whatsapp_owner, email_owner, whatsapp_verify, email_verify, email_click, whatsapp_click — per-door names beat the fleet's single whatsapp_click |

## D-DESIGN-DIFF similarity verdict — arogyashala.in vs arogyakendra.com

**Comparison basis:** arogyashala judged from the live build + qa screenshots; arogyakendra has no launch screenshots in the repo (launches/arogyakendra.com/ holds checklists + design-review only, and its serve was not running), so it was judged from full reads of sites/arogyakendra.com/app/page.tsx + globals.css and its design-review.md — which together specify every structural device on that page.

**Verdict: NOT mistakable for a recolor. The similarity gate PASSES.** The two pages share one brand system (mandatory: same tokens, faces, pill grammar) but different page grammar — a reviewer comparing them side by side sees a different skeleton, not the same skeleton re-dressed.

Structural devices that DIFFER (arogyakendra → arogyashala):

1. **Opening**: 64px ivory header bar + left-text/right-image two-column hero + marigold accent-rule → full-bleed forest-700 **centered statement hero**, no header bar, no hero image, no accent rule. The fleet's signature opening is gone.
2. **Router**: none (single-audience scroll) → **two-door card router breaching the dark band** (margin -34px seam, pixel-verified) — the layout is the information architecture. Exists nowhere in the fleet.
3. **Trust facts**: 4-up white CARD directly under the hero → hairline-bounded **band mid-page** (after the owners' path), Kurale dts, no card chrome.
4. **Content core**: 6-card photo-placeholder brand grid (3-col) → zero photo cards; instead an **annotated SVG storefront figure** (3 callouts) and an **oversized-numeral 01–03 programme flow** — both devices absent from every fleet build.
5. **Dark band placement**: mid-page promise band with Kurale quote + inverse pill → **no mid-page dark band at all**; dark surfaces are the opening and the footer only. The rhythm is inverted (dark→light vs light→dark→dark).
6. **FAQ accordion** (details/summary): only arogyashala. **Sticky mobile CTA bar**: only arogyakendra.
7. §3's fleet-skeleton checklist, item by item: left/right hero — broken; ivory header — absent; 4-up strip under hero — relocated and restyled; photo card grids — absent; dark promise band — absent. All five mandated new devices (two doors, numbered flow, verification block, storefront figure, FAQ) are present and rendering.

Devices that REPEAT (watch these as the fleet grows):

- Forest-700 dark footer with ivory links (arogyashala's is richer: 3 nav rows vs 3 lines).
- Bronze overline → Kurale heading section grammar (this is brand law, ch.04/11 — it will repeat everywhere by design).
- White 16px-radius warm-shadow card as a device (doors here, brand/trust cards there) — same component dress, different structural role.
- The **WhatsApp-primary + email-secondary pill pair** — third fleet build with the identical CTA formula (interim Priya number, same icon). Fine while the group number ruling is pending, but it is becoming a fleet tell.
- The **4-item locked-facts trust `<dl>`** (1908 / NABH / WHO-GMP / +1) — same content spine as arogyakendra's trust card. Different dress, same skeleton bone; a fifth build should vary the count or form.

## Verdict

**FAIL — needs rework.** Two Critical items (invisible keyboard focus on the door router; 18px footer contact tap targets — a regression on the 14 Jul Ship Gate A4 lesson) violate fail-if-violated charter lines. Both are ≤10-line CSS fixes; re-run this audit after. The D-DESIGN-DIFF similarity gate itself **PASSES** cleanly, the compliance/locked-facts surface is clean, and everything else is PASS or Warning.

---
*Logging: this report + screenshots land in agent-log.jsonl via the deterministic PostToolUse hook (CLAUDE.md rule q); logger rollup to wiki/log.md is the parent session's step. Files reviewed: sites/arogyashala.in/app/{page.tsx,globals.css,layout.tsx}, packages/ui/brand-tokens.css, packages/consent/src/ConsentBanner.tsx, sites/arogyakendra.com/app/{page.tsx,globals.css}, launches/arogyakendra.com/design-review.md. Issues: 2 Critical, 7 Warning.*
