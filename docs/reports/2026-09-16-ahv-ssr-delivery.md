# AHV English candidate — server-rendered body delivered, and what it exposed

Task: WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001
Date: 2026-09-16
Branch: `codex/ahv-english-staging-20260915`
Commits: `81e586d3` (SSR), `4e88a2a6` (link repair)
Status: **staging candidate.** Not production ready. See "What still blocks go-live".

---

## 1. What was wrong

The approved English design is a client-side runtime. The server response carried
the correct per-route `<head>` but no page text. Measured on the built site, a
crawler that does not execute JavaScript saw **254–296 characters per route**
against 1,200–16,100 rendered. The owner ruled this a blocker before any DNS flip
(D-20260915-03).

This matters most for the engines that do not run JavaScript well or at all —
Bing, and most AI/answer-engine crawlers.

## 2. What was built

The approved design is **not** rebuilt, re-themed or ported. Its own compiled
output is captured at build time and delivered in the server response. After
hydration the client runtime mounts exactly as before and replaces the snapshot,
so what a visitor interacts with is unchanged.

| Tool | Job |
|---|---|
| `tools/prerender-english.mjs` | Renders each route at **phone width** (Google indexes mobile-first), flattens each `<image-slot>`'s shadow `<img>` to a light-DOM `<img>` so the homepage's 46 images survive serialisation, writes one snapshot per route. |
| `tools/repair-snapshot-links.mjs` | Applies `english-candidate/link-aliases.json` and normalises the legacy Cloudflare email links. Chained into the prerender so a re-render cannot drop it. |
| `tools/verify-ssr.mjs` | Fetches every route with no browser and counts the visible characters that survive tag-stripping — the only number a non-JS crawler actually gets. |
| `design-view.tsx` | Inlines the snapshot into the design root. |

### The trap that cost a deploy

The design root contains the runtime's own `<script data-dc-script>`, and the
captured copy carries `data-props="{}"` because the live props were already
consumed. Shipped in the server HTML it lands in the DOM **before** the boot
script appends the real one, so the runtime's lookup of `script[data-dc-script]`
found the empty copy first and rendered nothing. Body text fell to **110
characters on every route** — worse than the problem being solved.

Scripts inserted through `innerHTML` cannot execute and are worthless to a
crawler, so the extractor now strips every script and stale mount point. The
broken state was caught in regression and **was not deployed**.

## 3. What server-rendering exposed

Serving the design's markup changed *who reads the links*. An authenticated crawl
of the deployed build found **16 internal links resolving to 404**. They are not
new — the design has always carried these legacy spellings and `boot.ts` has
always corrected them in the browser. But the runtime repair comes too late for a
crawler or a no-JS first paint.

Repaired (13 legacy spellings + 20 Cloudflare email links), every target checked
against `route-manifest.json` first. `english-candidate/link-aliases.json` is now
the single source of truth, inlined by `boot.ts` and applied to the snapshots by
the same map, so the two passes cannot drift.

**No redirect was added.** The redirect surface in `next.config.ts` is the Ads
cutover map, gated on Vikash's written per-URL confirmation because live Google
Ads point at those legacy URLs. This repairs link targets only.

## 4. Evidence

Against the rebuilt site and the deployed staging build.

```
crawler text, 252 routes, no JavaScript
  min 1,438 · median 6,259 · max 30,020 chars
  0 below 600 · 0 without <h1>
  homepage 296 -> 18,322 characters

browser, 252 routes x 390px and 1280px = 504 states
  0 render failures      0 missing <h1>        0 thin bodies
  0 horizontal overflow  0 broken images       0 live-domain links
  0 JavaScript errors    0 images still blocking touch scroll

JavaScript fully disabled
  homepage paints the full design, 70/70 images, h1 present

no duplication
  rendered body equals the snapshot exactly on the homepage,
  +111 chars elsewhere (the consent notice, deliberately excluded
  from snapshots and rendered live)

deployed staging, authenticated crawl
  236 pages reachable from /, 0 missing <h1>
  16 broken internal links -> 3 remaining (all non-English, see below)
  136 mobile+desktop view payloads and 2 shared components: all 200

compliance lint   0 errors
tests             71 compliance + 17 lead-conversion, all pass
```

### Page weight — stated plainly

The homepage response is now **527KB raw, ~85KB gzipped** (Vercel serves brotli
at the edge, so smaller in practice). 57% of the snapshot is the design's own
inline `style` attributes. This was **not** stripped: those attributes are what
make the server HTML paint the correct design before JavaScript runs, which is
the entire point. The trade is a heavier response for a page that paints
immediately instead of staying blank until the runtime mounts. On an 80%-mobile
audience that is the right side of the trade, but it is a real cost and the owner
should know the number.

## 5. Sitemap and robots — verified, not assumed

Staging correctly publishes `Disallow: /` and an empty sitemap: a noindexed
review build should advertise nothing. The 252 routes are already wired behind
`AHV_STAGING=0`. Verified by running the flag: **252 `<loc>` entries, canonical
host, zero `/lp/` pages** (the noindex lane stays out by law), and robots
allow-all with the sitemap reference. Go-live is a flag flip, not a rewrite.

## 6. Open — needs an owner decision

Three internal links, all on `/sitemap/`, all outside this lane's English-only
scope. Guessing a target would be inventing a fact.

| Link | Note |
|---|---|
| `/de/behandlung-in-kerala.html` | German. **Also on the Ads cutover map** — Vikash's call, not ours. |
| `/de/lakshya-yoga-retreat-2017` | German. An English `/lakshya-yoga-retreat-2017/` exists, but the `/de/` prefix may be deliberate. |
| `/treatment-in-kerala-russian.html` | Russian. No Russian lane exists in this build. |

Options for each: point at the English page, remove the link from `/sitemap/`, or
leave it until the DE/FR lane ships.

## 7. What still blocks go-live

Unchanged by this work, and none of it is mine to close:

1. **Deepu's form sign-off** — WPForms confirmation config for 11965, 18926, 8055.
2. **KTAHV clinical language lock** — 191 of 252 routes carry banned-register
   words inherited from the approved content. Needs the owner + Dr. Deepu John.
   This is the entire 7,368-warning compliance figure; it is pre-existing and
   unchanged by this commit.
3. **Measurement activation** — the lead-conversion candidate is built, tested
   (17 tests) and **not wired**. Activation is the owner's and Vikash's decision.
4. **Reviewer sign-off** — the seven-recipient review mail is drafted, unsent.

Server-side rendering was a go-live blocker. It is now closed. The site remains a
staging candidate.
