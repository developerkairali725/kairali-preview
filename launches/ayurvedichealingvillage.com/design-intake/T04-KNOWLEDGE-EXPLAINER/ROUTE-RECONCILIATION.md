# T04 — route split reconciled against the repo, and against the live site

The handover marked its route split **UNVERIFIED against `BUILD-SETS.md`** and asked for it to be
reconciled before building. Done, 2026-09-19, against `english-candidate/sitemap-tree.json` (the
generated truth behind `BUILD-SETS.md`) and against live response headers and HTML.

## Group A — build these: **10 of 10 confirmed**

Every one is a live route, in the sitemap, carrying no 301, on the article-reader template.

| # | route |
|---|---|
| 130 | /new-to-ayurveda/ |
| 117 | /learn-more-about-ayurveda/ |
| 238 | /why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/ |
| 235 | /why-get-training-in-ayurveda/ |
| 233 | /what-is-panchkarma/ |
| 121 | /live-to-100-with-panchkarma/ |
| 26 | /ayurveda-retreats-for-everyone/ |
| 132 | /new-to-yoga/ |
| 232 | /what-is-ayurvedic-food/ |
| 42 | /ayurvedic-resturant-and-cooking-at-healing-village/ |

**No change needed. Build group A as specified.**

## Group B — three claims, three corrections

**1. `/why-pick-an-ayurveda-treatment-orayurvedic-retreat/` is not a route at all.**
It does not exist in the 252-route manifest. It is a typo in the live Knowledge Centre sidebar — a
broken *link*, not a page — so there is nothing to 301. The repo already handles it:
`tools/repair-snapshot-links.mjs` rewrites **22 occurrences** to the correct spelling on every
prerender pass. The handover's instinct (do not build it) was right; the mechanism is different, and
that matters because a redirect map entry for a non-existent page would never fire.

**2. `/retreats-for-everyone/` carries no 301 in the repo.** It is `#173`, in the sitemap, no
redirect. It is *not* among the owner's twelve 301s. See below — the live evidence now settles which
direction it should go.

**3. `/why-pick-a-yoga-or-yoga-retreat/` is a live route (`#237`, in the sitemap), not a redirect.**
The handover's own prose says exactly this — "not a duplicate … stays in group A of the *yoga*
family" — so listing it under B is a labelling slip, not a disagreement. The repo agrees with the
prose.

## Group C — the handover is right, and the live site contradicts itself

`/learn-about-ayurveda/` is `#116` and **is currently in this repo's sitemap**, which disagrees with
the handover. Checked against live:

| route | live `noindex` | live canonical | in live XML sitemap |
|---|---|---|---|
| /learn-about-ayurveda/ | **yes** | **none** | **yes** |
| /retreats-for-everyone/ | **yes** | **none** | **yes** |
| /ayurveda-retreats-for-everyone/ | no | self | yes |
| /new-to-ayurveda/ | no | self | yes |

So the handover's claim is **correct** — `/learn-about-ayurveda/` really is served `noindex` with no
canonical — and the repo's sitemap flag is the thing that needs changing, not the handover.

**Two findings the handover did not have:**

**(a) `/retreats-for-everyone/` is also `noindex` with no canonical.** That settles open decision 2.
The pair is: `/retreats-for-everyone/` (noindex, no canonical, ~10,695 words) against
`/ayurveda-retreats-for-everyone/` (indexed, self-canonical, ~11,391 words). The live site has
already chosen — the 301 runs **`/retreats-for-everyone/` → `/ayurveda-retreats-for-everyone/`**, not
the other way. Owner confirmation is still wanted, but it is now a confirmation rather than a guess.

**(b) The live site noindexes two pages and submits them in its own XML sitemap.** Both
`/learn-about-ayurveda/` and `/retreats-for-everyone/` appear in `wp-sitemap-posts-page-1.xml` while
serving `noindex`. That is a conflicting signal and a standing Search Console warning.

This reframes open decision 1. The question is not "is the noindex intentional?" but **"which of the
two contradictory signals is the intended one?"** — because the live site currently asserts both. If
the noindex is intended, both routes leave the sitemap. If it is not, the noindex goes and they keep
their sitemap entries. Either way the current state is wrong and has been for some time.

## OWNER RULING, 2026-09-19 — the noindex is a MISTAKE

The owner has ruled: **both pages are live pages, the `noindex` is an error, and both STAY in the XML
sitemap.** The content will be fixed later. So of the two contradicting signals the live site asserts,
the sitemap entry is the correct one and the `noindex` is the defect.

Recorded honestly: I first applied `sitemapExclude` to both on the opposite reading of the same
instruction, and reversed it when the owner clarified. Both are back in the sitemap, and
`route-overrides.json` carries a `robotsNote` on each saying why.

**The good news, checked rather than assumed: the mistake does not propagate.** The rebuilt site
emits **no per-route `robots` meta at all** — the staging lock is `robots.txt Disallow: /` alone,
which lifts with `AHV_STAGING=0`. Title and `og:title` are served server-side. So at the DNS flip
these two pages become indexable, without anyone having to undo the live `noindex` first; the
WordPress fix is tidy-up on a site that is being replaced, not a blocker.

What still needs doing on the live site is the owner's own follow-up: the `noindex` should come off
`/learn-about-ayurveda/` and `/retreats-for-everyone/` there too, so Search Console stops reporting
the conflict in the meantime. That is a WordPress change and therefore Deepu's lane, not the agent's.

## What to change before building

1. ~~Set `sitemapExclude` on `/learn-about-ayurveda/`~~ — **superseded by the ruling above.** Both
   routes stay in the sitemap; `sitemapExclude: false` is explicit on both, with a `robotsNote`.
2. Leave `/retreats-for-everyone/` alone until the owner confirms the 301 direction the evidence
   points at.
3. Nothing else. Group A is clean.

## Verified independently

Harness re-run from this workspace, served over HTTP: **38 pass / 0 fail, 0 console errors, 0 network
failures.** The self-containment claim holds — `kairali-colorful-logo.png` and
`ktahv-logo-white-brand.svg` are both present, chrome and `support.js` are duplicated into `notes/`,
and every image reports `naturalWidth > 0`.

One packaging note for the next drop: the zip is rooted at the **full repo-relative path**
(`launches/ayurvedichealingvillage.com/design-intake/T04-KNOWLEDGE-EXPLAINER/`), so it unpacks at the
**repository root**. The handover's instruction to drop it inside `design-intake/` would have nested
it twice. The rooting itself is right and matches the previous drop — only the instruction was
inverted.
