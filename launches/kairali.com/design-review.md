# Design Review — kairali.com (flagship group site, register A)

**2026-07-14 19:00:00 IST · Reviewer: design-critic gate agent, skeptical-marketer + senior-design-reviewer pass (Ship Gate B-14, scripts/design-review/PROMPT.md v1.0)**
**Method: production build served at http://localhost:4311 (`next start`). Mobile-first per ENGINEERING_STANDARDS: (1) committed full-page capture `home-mobile-full.png` (375×5920) walked top-to-bottom in eight 740px segments; (2) live browser session at 375×812 — consent-flow test, floating-UI stack test, lazy-image verification, computed-style audit via DevTools JS; (3) desktop pass at 1280×800 live + committed `home-desktop-full.png` (1280×3228) in five segments; (4) `curl -s` HTML audit (data-cta, schema, banned-word scan, locked facts); (5) source audit of `sites/kairali.com/app/globals.css`, `app/page.tsx`, `packages/ui/brand-tokens.css`. One iteration — review-only run; no fixes applied by the reviewer (fix list below handed to the builder).**

## Viewports

| Viewport | What was inspected |
|---|---|
| 375×812 (live) | First paint with consent open; consent dismissed (Essential only); scroll to every pillar card; franchise + heritage lazy images; sticky bar / chat bubble / consent stacking; computed styles |
| 375×5920 (capture) | Full-page walkthrough in 8 segments — wrapping, tap targets, card rhythm, footer |
| 1280×800 (live) | Desktop nav, header CTA, Chatbase proactive popups, one-accent recount |
| 1280×3228 (capture) | 3-col grid, heritage 2-col, promise band, footer |

## Iteration 1 findings (= final; no criterion below the 7 floor, average above 9.0)

| # | Criterion | Score /10 | Finding |
|---|---|---|---|
| 1 | Premium feel | 9 | Real library photography with a consistent warm grade finally fills the system that arogyakendra could only placeholder — the page reads calm and expensive at both widths. Docked: on DESKTOP the Chatbase proactive popups stack THREE white sales bubbles directly over the hero photograph within seconds of load, and the widget avatar (glossy portrait in a leaf wreath + "Help?" badge) is the single cheapest-looking pixel on the page. Raster logo is a known interim. |
| 2 | Human-made feel | 9.5 | Named founders (the late Dr. Sankunny Vaidiar, Dr. K. S. Vasudevan), dated place captions ("The Ayurvedic Healing Village, Palakkad — morning."), specific counts (nine countries, fifty acres, four generations), per-pillar register shifts. Zero filler. Nits: "since 1908" appears 4× (H1, trust strip, promise, footer); casing wobbles between "Health through Ayurveda" (H1) and "Health through ayurveda" (promise/footer tagline). |
| 3 | Mobile UX | 9.5 | Live-verified: no horizontal leak; header lockup single-line at 375; pills ≥48px, footer contact links padded to 44px tap targets (`padding-block:14px` verified computed); consent banner suppresses BOTH chat bubble and popup bubbles while open (`data-consent-open` → `display:none`, verified live) — one decision at a time; after choice the bubble returns lifted to `bottom: 84px` above the sticky bar (verified computed), email button reachable. All 9 images render live at 375 (see artifact note below). |
| 4 | CTA clarity | 8.5 | One unified primary everywhere (WhatsApp, forest pill) + one secondary (email); `data-cta` fully wired — verified in served HTML: whatsapp_click ×5, email_click ×3, brand_click ×6; helper copy is excellent ("One message reaches the whole group — we will point you to the right Kairali door."). Docked: on the 375 first paint the hero's WhatsApp pill and the sticky bar's WhatsApp pill are BOTH visible — two identical full-width primary pills on one view; on desktop the Chatbase popup "Claim Your Free Consultation With Our Certified Ayurvedic Doctors Today" injects a competing CTA the page never made, and asserts a "free consultation" offer no locked fact backs. |
| 5 | Brand-manual fidelity | 9.5 | Computed-style audit at 375 and 1280: h1 Kurale weight 400 rgb(0,66,38)=forest-700; body Asap on ivory rgb(247,244,234), ink rgb(28,27,25); overline Lato 700 rgb(193,136,44)=bronze-400; buttons rgb(0,96,56)=forest-500, radius 999px, min-height 48px; cards white 16px warm-shadow; promise band rgb(0,66,38)=forest-700 with marigold overline (dark-surface rule); focus ring `0 0 0 3px color-mix(#8E9D35 55%)`=leaf-500. One-accent law verified PROGRAMMATICALLY: a DOM sweep for marigold color/background outside dark surfaces returns exactly one element — `div.accent-rule` — at both 375 and 1280. KTAHV card is clinical-register (patient/physician/treatment/programme/consultation/admission/discharge); word-boundary banned-word scan of served HTML: zero hits (the 21 raw "spa" hits are all `<span>` substrings). Locked facts: info@kairali.com ✓, WhatsApp +91 92898 38797 ✓ (zero occurrences of …38777). |

**Average: 9.2 / 10 — gate (≥9.0, no criterion <7) PASSED on iteration 1 of 3.**

## Findings investigated and cleared

- **"Blank image" in the committed mobile capture** — `home-mobile-full.png` shows the Franchise card and heritage figure as empty white blocks. Investigated: both URLs return 200 with full payloads (`franchise-welcome.jpg` 142,745 B; `heritage-therapy-cabinets.jpg` 262,153 B); both render correctly in the desktop capture and in the LIVE 375px session (screenshots taken; `img.complete && naturalWidth>0` true for all 9 images after scroll). Verdict: `loading="lazy"` capture artifact of the full-page screenshot tool, not a site defect. Recommend re-capturing mobile full-page with a scroll-settle wait so committed evidence doesn't show false gaps.
- **Six-doors count** — cards = Healing Village, Products, Centres, Training, Villa Raag, Franchise = six, matching the "One Group, Six Doors" claim. Every card href liveness-annotated in page.tsx (14 Jul curl pass).
- **Schema/SEO plumbing** — Organization + WebSite + BreadcrumbList JSON-LD present; canonical `https://kairali.com`; title/description set. No hreflang — page is EN-only by brief (group site), not a silent omission.

## Fixes required (handed to builder — none applied in this review pass)

Criterion 4 sits below the PROMPT's per-criterion fix threshold (<9), so per §Method-4 these are the queued fixes; the gate itself passes on the average/floor law:

1. **Sticky-bar dedupe on first paint (`.sticky-cta` × `.hero .cta-row`)** — hide the sticky bar while the hero CTA row is on screen: IntersectionObserver on `.cta-row` toggling e.g. `html[data-hero-cta-visible] .sticky-cta { display:none }` (or `transform: translateY(100%)` with the brand fade). Removes the double WhatsApp pill on the 375 first viewport.
2. **Chatbase desktop popups (config, not code — Priya's dashboard)** — the three proactive bubbles cover the hero photo and speak the wrong register ("India's Leading…", "Rejuvenate at Kerala's tranquil retreat", "Claim Your Free Consultation"). Rewrite to group-register lines approved against ch.11 voice, cap at ONE popup with a longer delay, and VERIFY the "free consultation" offer with Abilash before it is ever shown again (locked-facts rule 6 — no unverified offers). Swap the widget avatar to the Kairali icon tile per ch.08 favicon spec (icon @70% on forest #004226).
3. **Casing law for "ayurveda" in display copy** — H1 says "Health through Ayurveda" (page.tsx:176), promise quote and footer tagline say "health through ayurveda" (page.tsx:312, 326). The raster logo artwork uses lowercase. Pick one law (suggest: capital-A only where sentence-initial or the proper discipline is meant; lowercase in the tagline echo) and record it in the wiki brand page.

## Honest limitations (not scored away)

- **Chatbase popups are third-party config outside this repo.** Mobile suppression (`#chatbase-message-bubbles { display:none }` under 768px) is shipped and verified; the desktop popup copy/avatar remain whatever the Chatbase dashboard says — the fix lives there, and until it is made, desktop first paint carries off-register sales copy the page itself never wrote. This is the weakest thing a first-time desktop visitor sees.
- **Raster logo interim** — the header lockup is `kairali-logo.png` at 52px; acceptable at 1× but soft on high-DPI desktop. Vector pack pending (QUESTIONS.md Q17); ch.02 forbids recreating it.
- **No /privacy page yet** — footer carries no privacy link and the consent banner has no policy target; visible gap by policy until the page ships.
- **marigold-300 / leaf-700 / bronze-600 / forest-800 resolve to their anchor fallbacks** — the manual documents no hexes for these steps (brand-tokens.css TODO); the promise-band overline therefore renders marigold-400 on dark. Correct per the do-not-invent rule; will shift slightly when the design-system ramp lands.
- **Committed mobile capture shows two lazy-load blanks** (cleared above as a capture artifact, but the committed evidence file itself is misleading until re-captured).
- **Not scored**: cross-browser (Chromium only), reduced-motion behavior (inherited from brand-tokens.css, not exercised), real-device thumb reach (simulated viewport only), Lighthouse (separate gate).
