# Two live pages the rebuild never had, now built

2026-09-20. Owner rulings: **"Keep it, build it"** (the Russian LP) and **"Build monsoon, 301 the
rest"**. The 301s are in `21a248ac`; this is the two builds.

| route | lang | blocks | images | live before | in the rebuild before |
|---|---|---|---|---|---|
| `/karkidaka-chikitsha-or-monsoon-wellness.html` | en | 93 | 17 | 200, `index,follow` | no |
| `/treatment-in-kerala-russian.html` | ru-RU | 147 | 62 | 200, **unreadable** | no |

The manifest is now **254 routes**. Both serve 200, both render with **0 page errors, 0 broken
images, 0 off-origin requests and no horizontal overflow** at 1280.

## Why they were missing, corrected from this morning

Not because the sitemap and Search Console could not see them — that is true of the monsoon page
and false of the Russian one. **Both have complete source kits from 2026-09-01**
(`sourceKitComplete: true`, `pass: true`); what never happened is `designStarted`. Reconciled
across all **241 page kits: exactly two never reached the rebuild**, and these are they. The
manifest is generated from what the design package contains, so nothing downstream could report
an absence — the same failure shape as every other finding this session, a generated view that
cannot describe what is missing from its own input.

## The Russian page: what actually changed

It has been serving **mojibake**, not Russian. 277,280 bytes, valid UTF-8, declaring UTF-8, and
containing **zero Cyrillic letters** against 14,640 corrupted character pairs. Its 5,609
impressions at 0.11% CTR were not a page earning its keep; they were a measure of how long its
title had been gibberish in the SERP.

`tools/lib/mojibake.mjs` inverts the damage. **2,831 runs, all 2,831 decoded, all 2,831 proven to
round-trip** — `verify()` re-applies the damage at each run's own depth and requires the original
back byte for byte, so a recovery that cannot be proven is refused rather than shipped. Nothing
is translated and nothing is invented; the output is the bytes that were there before it broke.

```
title, served     Ð›ÑƒÑ‡ÑˆÐ¸Ð¹ ... | Ð Ð¾ÑÐºÐ¾ÑˆÐ½Ñ‹Ðµ ÐºÑƒÑ€Ð¾Ñ€Ñ‚Ñ‹ ÐšÐµÑ€Ð°Ð»Ñ‹.
title, recovered  Лучший Аюрведический Ретрит в Керале | Роскошные курорты Кералы.
```

Measured on the built page: `lang="ru-RU"`, **11,564 Cyrillic letters visible**, H1
*Аутентичный аюрведический ретрит*, breadcrumb in Russian, on the site's own chrome.

## Three judgment calls, on the record

**1. Both pages are on the article-reader template, not the campaign one.** The Russian page's
English twin, `/treatment-in-kerala.html`, is on the T06 campaign template. That template takes
about thirty hand-mapped structured fields — hero, property, awards, isItForMe, postCare — and
mapping them means deciding which Russian paragraph is the "property" copy and which is the
"mission" copy. **Nobody in this lane reads Russian.** Guessing that mapping would be inventing
structure for content I cannot check. The article template takes content in document order and
preserves it exactly, and it is the family this session's overflow fix corrected.
**Consequence, flagged not hidden: the two pages will not look alike** until someone who reads
Russian maps the fields.

**2. The hero image is measured, not assumed.** "The first image on the page" is a NABH badge on
one and the Kairali logo on the other; either would have stretched a 200px badge across the top.
`tools/wire-legacy-routes.mjs` reads pixel width out of the PNG/JPEG/WebP header and takes the
first image at least 600px wide. No qualifying image means **no hero**, not a wrong one.

**3. Every record carries its provenance.** `provenance.ruling` names the owner decision that
created it, and both the wiring tool and the manifest tool **refuse** a record without one. A row
in an approved dataset with no provenance is indistinguishable from one the design package
produced, and that is exactly how a page ends up shipped with nobody able to say who asked for it.

## What is NOT done, and must be before either page goes to production

1. **Nobody has read the Russian.** The recovery is mechanical and verified byte-for-byte, but
   whether the recovered sentences are correct, current Russian is not something this lane can
   check. A Russian speaker proofs it before the flip.
2. **The register fails.** Run against the built record: **13× luxury, 5× resort, 7× cure, 1× spa
   failing**, and 9× journey, 3× guests, 2× holiday flagged for a human. The `<title>` itself
   reads *"Luxury resorts of Kerala"*. The list is drafted in
   `docs/ktahv-inputs/ktahv-register-ru.md` and **CLAUDE.md is not edited until Abilash signs it**.
3. **Dated content.** The recovered page carries a testimonial stamped *"Последнее посещение
   декабрь 2021 г."* (last visit December 2021) and a German fragment, *"Kerala wurde vom"*,
   leaking into a Russian heading. Both are faithful to the source and both are wrong to publish.
4. **No accepted baseline rows.** Neither route exists in the design package's 504-state evidence,
   so the sweep reports "no accepted baseline row for this route+width" on all four new states.
   That is correct and expected — there is no accepted state to compare a brand-new route against.
5. **No prerender snapshots yet**, so both serve client-rendered until the next prerender pass.

## Proof

- **benchmark**: `tools/computed-style-diff.mjs` — **0 of 16 page/width pairs changed**
- **build**: 275 static pages, exit 0
- **routes**: both 200; both new 301s fire with the exact single-hop target
- **render**: 0 page errors, 0 broken images, 0 off-origin requests, no overflow at 1280
- **tests**: 38 pass, 0 fail (8 of them pinning the recovery in both directions)
- **252-route sweep**, now 508 states over 254 routes:

| | before | after |
|---|---|---|
| states | 504 | 508 |
| passed | 458 | **458** |
| failed | 46 | 50 |
| horizontal overflow | 0 | **0** |
| broken images | 0 | **0** |
| off-origin requests | 0 | **0** |

  The four extra failures are the four new states, and every one of them fails on exactly one
  thing — `no accepted baseline row for this route+width`. There is no accepted state to compare
  a brand-new route against; that is the sweep working, not a defect. **Nothing else moved**: the
  other 46 are the same pre-existing baseline drift, unchanged in either direction.

## One more gate, applied rather than left to memory

`/treatment-in-kerala-russian.html` is **held out of the sitemap** (`sitemapExclude: true` with a
`releaseNote` that says exactly what must be true to remove it). Two things are true of it that
are true of no other route: nobody who reads Russian has read its copy, and it fails the clinical
register in a locale the lock does not yet cover. Submitting it at the DNS flip would index
*"Luxury resorts of Kerala"*.

This is deliberately **not** the same call as `/learn-about-ayurveda/` and
`/retreats-for-everyone/`, where the owner ruled on 2026-09-19 that a live `noindex` was a mistake
and both stay in the sitemap. Those pages read correctly and pass the register. This one does
neither yet, and the note says so, so the difference is on the record rather than in my head.
`/karkidaka-…` is in the sitemap normally — it has neither problem.

---

## Correction: the "234 dangling copyright lines" were my own false positive

Recorded because it was reported to the owner twice — in
`docs/reports/2026-09-19-ahv-1908-attribution` work and in commit `79cd8ee8`.

**The claim.** 234 prerendered snapshots carried `© 1908 — ` with nothing after the dash; the
footer computes its year from `getFullYear()`; the snapshots were captured before that resolved;
re-run the prerender to fix it.

**What happened when I did.** The count went **up**, to 236 — exactly two more, which is the
number of routes added that day. Nothing was resolving because there was nothing to resolve.

**What the snapshots actually carry:**

```html
© 1908 — <span class="sc-interp">2026</span> Kairali — The Ayurvedic Healing Village.
```

Read by a crawler or a person: *"© 1908 — 2026 Kairali — The Ayurvedic Healing Village."* The
line is complete and always was.

**The bug was in my detector**, twice over. It ended in `(?=<|\s*$)` — treating "followed by a
tag" as "nothing after the dash", when the tag that follows is the span **holding the year**. And
the first attempt to fix it, `\s*(?![0-9A-Za-z])`, still reported 236: the engine backtracks one
space, the lookahead sees a space rather than a digit, and succeeds. Moving the whitespace inside
the lookahead — `[—–-](?!\s*[0-9A-Za-z])` — is what actually holds, and it is now pinned by two
assertions in the tool: a complete line yields 0 findings, a genuinely truncated one yields 1.

The tool now reports **0**. No site code was ever changed for this, so nothing shipped wrong —
but a false finding was in the repo and in the owner's inbox, and the count that disproved it only
appeared because the "fix" was actually run. **A count is a claim.** This one had not survived
measurement, and it is the fourth time this session that a generated view turned out to describe
something other than what ships — the others being the stale `route-verification.json`, the
computed-style tool comparing a reverted state against itself, and my own register over-counting
235 routes where the sitemap emits 233.
