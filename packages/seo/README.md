# @kairali/seo

Per-page meta (title ≤60ch, description ≤155ch), canonical, robots.txt, sitemap.xml, llms.txt + AI-crawler files, OG/Twitter card generation (1200×630 per Manual ch.08), GEO/AI-readiness helpers (entity clarity block, Q&A structuring). Checklist items A6, A9, B2.

## API (v0.2, extracted from arogyakendra.com 14 Jul 2026)
Plain-ESM JS + JSDoc, hand-maintained `src/index.d.ts`. `buildMetadata` /
`buildRobots` / `buildSitemap` / `buildLlmsTxt` / `LIMITS` / `OG_IMAGE`.
Gate behaviour: title >60ch, description >155ch, or a missing description
THROWS at build time (A6 is merge-blocking, not advisory). `/lp/*` is noindex
by default. hreflang delegated to @kairali/i18n (reciprocal by construction).
OG images are never fabricated — omit `ogImage` until a real 1200×630 asset
exists. Tests: `pnpm --filter @kairali/seo test`.
