# AHV English candidate — the server-rendering gap, measured, and what closing it costs

**Task:** AHV English staging session, 2026-09-15 16:22:41 IST
**Branch:** `codex/ahv-english-staging-20260915` · **Authority:** D-20260915-03 (owner ruled
server-side rendering a BLOCKER before any DNS flip)
**Measured against:** the built site (`next build` + `next start`), not a dev server.

## 1. The gap, in numbers

Two figures per route: what a browser that runs JavaScript ends up displaying, and what the
server actually puts in the HTML response (scripts stripped, tags stripped, whitespace collapsed).

| Route | Width | Rendered body text | Text in the server response | Server sends |
|---|---|---|---|---|
| `/` | phone | 12,871 chars | 296 chars | **2.3%** |
| `/` | desktop | 15,277 | 296 | **1.9%** |
| `/ayurvedic-treatment-packages.html` | desktop | 11,886 | 275 | **2.3%** |
| `/panchkarma-treatment.html` | phone | 16,060 | 272 | **1.7%** |
| `/panchkarma-treatment.html` | desktop | 16,133 | 272 | **1.7%** |
| `/wellness-programs/` | phone | 1,202 | 254 | 21% (thin page — see §4) |
| `/wellness-programs/` | desktop | 1,747 | 254 | 15% |

The ~270-300 characters the server does send are boot scaffolding, not page copy. **A crawler
that does not execute JavaScript sees effectively none of this site's content.** The per-route
`<head>` — title, description, canonical, og/twitter, robots — IS server-sent and correct;
that part of "SEO elements preserved" holds. The body is the gap.

Why it matters here specifically: `ayurvedichealingvillage.com` is an established, ranking
domain currently served by server-rendered WordPress. Googlebot usually renders JavaScript,
on a deferred second pass; Bingbot is materially weaker at it, and most AI/answer-engine
crawlers do not render at all. Swapping a fully server-rendered site for this one is the
single highest-risk step in the project, and it is not addressed by form testing.

## 2. Closing it is tractable — the runtime compiles to plain HTML

Measured on the rendered DOM, after the design runtime finishes:

```
customEls  x-dc:0  sc-for:0  sc-if:0  dc-import:0
```

Every framework element the approved views use is **fully compiled away**. What remains is
ordinary, serialisable HTML. This matters because it means the approved design does not need
to be rebuilt, re-themed or ported to TSX to be server-rendered — the owner's instruction to
preserve the approved design is compatible with fixing this.

**The mechanism already exists in this repo.** `tools/verify-english-candidate.mjs` already
renders all 252 routes at both widths (504 states) in a real browser as part of the accepted
verification. Prerendering is that same sweep with one extra step: serialise the result and
emit it into the served HTML.

## 3. The one real complication: the homepage's shadow DOM

| Route | `<image-slot>` elements | Elements with a shadow root |
|---|---|---|
| `/` phone | 46 | 47 |
| `/` desktop | 50 | 51 |
| every other route sampled | 0 | 1 |

`<image-slot>` puts its `<img>` inside a shadow root. `innerHTML` does not serialise shadow
content, so a naive prerender of the homepage would emit the layout with **no images** —
precisely the most important page. Options, in preference order:

1. **Declarative shadow DOM** (`<template shadowrootmode="open">`) — preserves the component
   exactly; supported by Googlebot. Verify Bing before relying on it.
2. **Flatten the slots in the prerendered output only** — each slot already carries its image
   in a `src` attribute, so emit a plain `<img>` for the static copy and let the live runtime
   take over on hydration. Simplest for crawlers, and the served DOM the user gets is unchanged.
3. Leave the homepage client-rendered and prerender the other 251 routes. Not recommended:
   the homepage is the single most valuable URL.

The other 251 routes have no shadow content and serialise cleanly.

## 4. A second finding this surfaced: thin pages

`/wellness-programs/` renders **1,202 characters on phone** against 12,000–16,000 on the
homepage and the package pages. It is a hub with four images and almost no copy. That is an
SEO weakness independent of rendering, and server-rendering it will not fix it. Flagged for
the content pass, not for this workstream. The full audit sweep will identify every route in
this class.

## 5. Mobile-first indexing

Google indexes with a mobile crawler. The design ships **two separate documents** per route
(phone and desktop are different approved views, not one fluid layout), so a prerender must
serve the phone snapshot to mobile user agents and the desktop snapshot to desktop ones, and
the canonical content of the two must not diverge in ways that read as cloaking. The two views
already carry near-identical body text — verified: 499 of 504 states matched exactly in the
accepted baseline — so this is a routing detail, not a content problem.

## 6. What is NOT claimed here

This report establishes feasibility and cost. It does not implement prerendering, and nothing
in the shipped staging build changed as a result of it. No production, DNS or WordPress change.
The numbers above are reproducible with `tools/audit-mobile-ux.mjs` and the snippet recorded
in this session; the audit sweep evidence lands separately.
