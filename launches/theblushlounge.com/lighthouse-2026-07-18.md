# LIGHTHOUSE / A5 EVIDENCE — theblushlounge.com golden page

- when: 2026-07-18 23:02:00 IST · runner: scripts/lighthouse-gate.mjs (Ship Gate A5, mobile emulation, local production build via next start)
- budgets (never lowered — rule g): performance ≥90 · accessibility ≥95 · SEO = 100
- coverage: "/" only at golden-page stage (no lighthouse-urls.json yet — the full build adds home + content template per the A5 coverage note; partial coverage stated, never silent)

## RUN 1 — 2026-07-18 22:52 IST (pre-fix, honest trail)

```
FAIL  / → perf 92 · a11y 94 · seo 100
BUDGET  /: accessibility 94 < 95
```

Failing audits (lighthouse --only-categories=accessibility, full item list):
- color-contrast (11 items): `--blush-champagne-deep` #A08652 at 9–10px caps on ivory/white — measured 3.23:1 (needs 4.5:1). Selectors: .brand__word small (hero + footer), .trust__label, .service__cue ×6, .footer h4 ×2. The token sheet's "AA at the tracked-caps sizes used" claim was measurably false.
- heading-order: footer h4 followed the closing-CTA h2 (skipped h3).
- label-content-name-mismatch: aria-labels on .brand (×2) and .credit did not contain the visible text.

## FIXES (page fixed, never the budget)

- packages/ui/blush-tokens.css: new `--blush-champagne-text: #7E683F` (same foil hue, deepened — computed 4.95:1 on ivory #FAF6EF, 5.33:1 on white); champagne-deep's comment corrected to "hover/rules/LARGE display text only". All 9–10px champagne labels switched to the new token.
- footer headings h4 → h3 (+ CSS selector).
- aria-labels removed from .brand (hero + footer) and .credit — the visible lockup/credit text is the accessible name.

## RUN 2 — 2026-07-18 23:01 IST (post-fix)

```
PASS  / → perf 92 · a11y 100 · seo 100
PASS — 1 URL(s) within the A5 budget.
```

perf 92 first-run (no median needed — only triggered on a miss). Interim-image ceiling (IG-sourced derivatives, D-BL-INTERIM) noted as the main perf headroom limit; hi-res shoot swap re-measures.

## RUN 3 — FULL SITE · 2026-07-19 00:55 IST (post full-build; lighthouse-urls.json now covers the key templates)

```
PASS  / → perf 92 · a11y 100 · seo 100
PASS  /portfolio → perf 96 · a11y 100 · seo 100
PASS  /services → perf 97 · a11y 100 · seo 100
PASS  /contact → perf 99 · a11y 100 · seo 100

PASS — 4 URL(s) within the A5 budget.
```
