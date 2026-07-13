# ENGINEERING STANDARDS — binding on every Factory site (CLAUDE.md rule i)

## Fonts
`next/font` only. Kurale (display), Asap, Lato — self-hosted, `display: swap`.
No Google Fonts CDN links, no FOIT-inducing custom loaders.

## Images
`next/image` only: AVIF/WebP, explicit width/height (no CLS), `priority` on the
hero, everything else lazy. Every image has alt text (Checklist A10). OG images
1200×630 per Brand Manual ch.08.

## Rendering
Static generation is the default. `"use client"` requires a one-line
justification comment above it. No data fetching in client components when a
server component can do it.

## Performance budgets (Checklist A5 gates these)
- First-load JS ≤ 130 KB per route.
- Lighthouse: Performance ≥ 90 · Accessibility ≥ 95 · SEO = 100.
- Video: poster-first ≤ 4 MB stream, `prefers-reduced-motion` → static poster.
- Immutable caching for hashed assets.

## Third-party scripts
Only via `packages/analytics`, consent-gated through `packages/consent`
(Google Consent Mode v2). No inline pixels, no per-site snowflake tags.

## Styling
Brand tokens only (`packages/ui/brand-tokens.css`; Raag surfaces use
`raag-tokens.css`). No rogue hex values — brand lint fails the build.
Marigold: one accent moment per view, never body text on white.

## Accessibility
WCAG 2.2 AA. Focus rings present, touch targets ≥ 44 px, semantic landmarks,
`prefers-reduced-motion` honored everywhere motion exists.

## Amendments
Via LEARNINGS.md-driven PRs only — same rule as the Ship Gate.
