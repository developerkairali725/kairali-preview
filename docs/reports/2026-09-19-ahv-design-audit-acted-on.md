# AHV design audit — what the measurements actually supported

2026-09-19, branch `codex/ahv-english-staging-20260915`. Companion to `launches/ayurvedichealingvillage.com/design-audit/`.

## A correction to the 2026-09-17 summary

The audit produced 143 HIGH and 326 MEDIUM findings, and I reported them as six defects "repeated everywhere, fixable as sitewide rules" reaching 200+ routes each. **Measuring the rendered DOM before writing any CSS showed that framing was wrong**, and acting on it would have made the site worse.

What the browser says, at 390px:

| Page | reading text under 15px | body text range | tap targets under 44px |
|---|---|---|---|
| `/` — owner-built benchmark | 58 | 12–26px | 1 |
| `/ayurvedic-treatments/` — owner-built finder | 26 | 14–18px | **30** (all inline links) |
| `/ayurvedic-treatment-packages.html` — owner-built | 13 | 12.5–28px | 20 |
| `/alcohol-free/` — audit-flagged article | **0** | 17.5px uniform | 6 |
| `/privacy-policy/` — audit-flagged | **0** | 17.5px uniform | 3 |

The pages the audit flagged for "type below the floor" carry **larger and more uniform text than the benchmark**, and the benchmark itself has thirty sub-44px tap targets. Those findings measure the auditors' generic accessibility heuristics against a benchmark *description* I supplied, not against the benchmark's rendered DOM. Applying them sitewide would have moved 243 routes **away** from the owner's design, not toward it.

The audit's value is real but narrower than the headline counts imply. It is a list of candidates; the DOM is the authority.

## What was real, and is now fixed

Measured on all 129 article-reader routes in a browser:

- **36 routes print the legacy corporate sidebar as article body text** — the "About Us / Kairali Ayurvedic Group" menu of 15–19 links, indistinguishable from the page's own prose. On **26 of them it sits above the first real paragraph**: 602–994px of menu, up to a screen and a half, before the article starts.
- **4 routes** render "Book Now" / "Enquire Now" as a 22px inline text link where the benchmark uses a 52px button. Four, not the sitewide sweep implied.

`public/design/article-reader.css` corrects both. The menu becomes a bordered, tinted card with quiet uppercase labels; on desktop it floats into a 300px aside so the article begins at the top.

| Route | width | menu height | article's first paragraph starts |
|---|---|---|---|
| `/arogya-kendra/` | 1280 | 1066 → 966px | **1868 → 802px** |
| `/kairali-hospitality/` | 1280 | 1066 → 966px | **1823 → 758px** |
| `/arogya-kendra/` | 390 | 1147 → 921px | 1617 → 1447px |
| `/awards-and-accreditations/` | both | 994 → 1046px | unchanged (menu already sat below the article) |

## How it is kept off the owner's pages

`design-view.tsx` emits `data-ahv-family` on the design root, derived from the route manifest's view id. Every rule in the stylesheet is nested under `[data-ahv-family="article-reader"]`. The homepage, package, finder and course templates are separate families and are unreachable from this file.

Proof, not assertion: computed styles for the first 120 elements, document height and link count were captured on 9 pages × 2 widths before and after. **0 of 18 changed.** `/sitemap/` links to the same marker page but its list is a nested `ul`-in-`li`, a direct child of neither `nav` nor `section`, so it is excluded by construction — verified across all 129 routes.

Sitewide sweep after the change: 252 routes, 0 render failures, 0 JS errors, 0 horizontal overflow, 0 broken images, 0 live-domain links.

## Two things withdrawn rather than shipped

- **Moving the menu below the article on a phone.** The CSS-only attempt reordered nothing (the nav and the prose are not siblings on every shape) and cost **23 routes in horizontal overflow**. It needs a DOM move in `boot.ts` — the file where a single regex backslash has twice silently killed the whole design — so it is queued as its own change at high effort, not bolted onto this one.
- **Padding on the menu rows.** Those rows already measure 44px; adding to them made the block 322px *taller*. Only colour, size and decoration are corrected now.

## Still open

- The remaining article-reader findings (tariff-table labelling, the repeated stock hero, duplicate headings) are per-shape work, not sitewide.
- `campaign-nine` (8 routes) and `campaign-retreat` (7 routes) are the genuine major-drift families left — legacy campaign pages on a different visual system entirely.
- 176 findings are content or owner facts (alt text, villa slugs, banned register words) and are flagged do-not-invent.
- 7 templates, 7 routes, never audited; all single-route.
