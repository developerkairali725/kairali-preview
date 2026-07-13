# Design Review — arogyakendra.com v2

**2026-07-13 19:12:48 IST · Reviewer: build agent, skeptical-marketer + design-reviewer pass (BACKLOG "design-critic pass ≥9/10" gate)**
**Method: page built, then reviewed live at 375×812 (screenshots) and 1120/1280 (screenshots + computed-style audit via DevTools JS). Two iterations.**

## Iteration 1 findings (initial score below gate)

| Criterion | Score | Finding |
|---|---|---|
| Premium feel | 8.5 | Kurale/ivory/forest system reads calm and expensive; placeholders are honest but visibly placeholders. |
| Human-made feel | 9 | Specific facts (1908, NABH, WHO-GMP, nine countries), family voice, zero filler words. |
| Mobile UX | 7 | BUGS: header "Chat on WhatsApp" pill leaked onto 375px (selector specificity — `.btn` display rule overrode `.header-cta{display:none}`); wordmark wrapped to two lines breaking the 64px header; Chatbase bubble sat on top of the sticky bar's email button. |
| CTA clarity | 9 | WhatsApp primary in hero + promise band + sticky bar, email secondary, one helper line. |
| Brand-manual fidelity | 9 | Tokens only; one marigold moment on light ground; pills; 16px white cards; bronze overlines; forest-700 dark band per ch.08. |

## Fixes applied (commit ae5ab5f)

1. `.site-header .header-cta { display:none }` scoped selector — header CTA now hidden below 768px (verified: computed `display:none` at 375, `flex` at 1120).
2. `.wordmark { white-space: nowrap; font-size: 1.25rem }` — single line inside the 64px header.
3. Chatbase `#chatbase-bubble-button` / `#chatbase-message-bubbles` offset `bottom: calc(84px + safe-area)` under 768px — bubble floats above the sticky contact bar, email button reachable.

## Iteration 2 — final scorecard

| Criterion | Score /10 | Evidence |
|---|---|---|
| Premium feel | 9 | Kurale 400 display verified in computed styles; ivory ground #F7F4EA; warm-shadow white cards at 16px; calm 4px-rhythm spacing; no gradients or lifts. Placeholders styled as intentional brand blocks with leaf mark + spec caption (screenshot: brand card at 375px). |
| Human-made feel | 9 | Copy is register-compliant (compliance lint 0 findings), fact-anchored, no template-speak; trust strip uses locked facts only. |
| Mobile UX | 9 | 375×812 walkthrough clean top-to-bottom: nowrap header, stacked hero, full-width pills ≥48px, 2-col trust card, single-col brand cards, sticky WhatsApp bar with safe-area padding, chat bubble clear of controls. |
| CTA clarity | 9.5 | One primary action (WhatsApp, forest pill, `data-cta="whatsapp_click"`, 5 instances incl. sticky bar) + one secondary (email). Verified live: Chatbase bot loaded lazily and answered on idle. |
| Brand-manual fidelity | 9.5 | Computed-style audit: h1 Kurale weight 400; overline rgb(193,136,44) = bronze-400; buttons rgb(0,96,56) = forest-500, radius 999px; cards 16px; accent rule rgb(238,180,30) = marigold-400, exactly one on the light ground; promise band rgb(0,66,38) = forest-700 with marigold-300 overline per ch.08 dark-surface rule; leaf focus ring + reduced-motion inherited from brand-tokens.css. |

**Final: 9.2 / 10 — gate (≥9) passed on iteration 2 of 3.**

## Honest limitations (not scored away)

- Premium ceiling is capped until real photography replaces the placeholders (IMAGE_MANIFEST.md is the shoot list; BACKLOG has the swap task gated on the image library).
- Wordmark is Kurale text, not the logo lockup — ch.02 forbids recreating the logo and no SVG assets exist yet (QUESTIONS.md Q17). Slot documented in IMAGE_MANIFEST.md.
- No favicon set yet (same Q17 dependency); ch.08 spec recorded in the manifest.
- Desktop screenshots after the first were blocked by a preview-pane capture glitch; desktop verification therefore combines the first 1280px screenshot (hero/header/trust correct) with a computed-style + geometry audit (hero 2-col, brands 3-col, trust 4-col, sticky bar hidden).
