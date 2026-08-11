# Lighthouse pilot evidence — 11 August 2026

Runner: `scripts/lighthouse-gate.mjs`, mobile emulation, final local production build. Budgets were unchanged: performance >=90, accessibility >=95, SEO =100.

```text
PASS  /          performance 90 · accessibility 100 · SEO 100
PASS  /portfolio performance 92 · accessibility 100 · SEO 100
PASS  /services  performance 95 · accessibility 100 · SEO 100
PASS  /contact   performance 96 · accessibility 100 · SEO 100
```

All four templates passed. A dedicated axe-core runner is not wired in this repository; Lighthouse 100 and the factory interaction checks are evidence, not a substitute for the still-pending axe card.
