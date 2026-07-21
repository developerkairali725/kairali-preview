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

## Images: placeholder-first workflow (Abilash directive, 13 Jul 2026)
No site waits for photography, and no site ships boring. Every image slot gets a
DESCRIBED PLACEHOLDER at build time: a styled block (brand-token colors, correct
aspect ratio) carrying a spec — subject, mood, exact dimensions, format
(AVIF/WebP), alt text — plus a matching entry in the site's `IMAGE_MANIFEST.md`
so the shoot/sourcing list is one file per site. Swap-in is then mechanical.
Sources in priority order: Kairali image library (~/Claude/Kairali-Digital/
image-library/) → the manual-linked galleries (Raag Google Photos album,
kairali.com/media-assets, villaraag.com/photo-gallery) → licensed stock → AI-gen
only per the site's video/imagery policy code (never people on KTAHV).

## Mobile-first is the default
~80% of traffic is mobile: design at 375px first, enhance upward. Layouts, type
scale, and CTAs must be verified at mobile widths BEFORE desktop polish; sticky
WhatsApp/enquiry CTAs on mobile where the register allows.

## Code review: suspected dead code is FLAGGED, never auto-deleted
Owner-approved 2026-07-21 (D-05 candidate card B, D-20260721-11) on an
all-three-agree verdict — Claude, GPT-5 and Perplexity independently agreed, the
only card of the two to clear that bar.

An agent reviewing or editing code **names suspected-dead code in the review and
leaves it in place.** Removing it is a separate, human-approved task.

Why, in this repo specifically:
- "Unused" here is frequently reachable by a path static reading cannot see —
  feature flags, cron and queue entry points, dynamic routes, WordPress hooks,
  Shopify theme includes, and content that references components by name.
- Proving deadness needs production telemetry over time, which an agent cannot
  gather inside one session — so its confidence is structurally lower than it
  feels.
- It keeps an agent's diff traceable to the change that was actually asked for.
  A deletion riding along inside an unrelated PR is the kind of thing that gets
  approved on a green checklist and noticed a week later.

This binds the agent code-review stage (CLAUDE.md rule h) and any agent editing
site or package code. Dead-code REMOVAL remains welcome — as its own PR, with
its own reasoning, reviewed on its own merits.

## Amendments
Via LEARNINGS.md-driven PRs only — same rule as the Ship Gate.
