# AHV final re-review (WOPS-AHV-FINAL-DRAFT-20260924-001): search and SEO approved for the candidate release, not for live cutover

I only read files in `sites/ayurvedichealingvillage.com`, about 20 of them across the batches. I ran nothing: no build, specs, crawl or live fetch. My approval rests on reading the code; I have no results of my own, and the production build is still being rerun.

## The residuals you asked about: all resolved

1. **Robots policy** (`app/(english)/_families/robots-policy.ts:4-17`)
   - The internal routes are now an explicit list. The owner's recorded overrides in `route-overrides.json:208-218` take priority: 5 routes set to "index, follow" and 3 junk routes set to "noindex, nofollow".
   - The same function feeds every place a robots value is written: the server metadata (`metadata.ts:55-57`), the settings passed to the page script (`design-view.tsx:81`) and the page script's head guard (`boot.ts:896`). The three can't drift apart.
   - Staging still forces "noindex, nofollow" everywhere.
   - Canonical consolidation is now separate from noindex, which is correct.
2. **Sitemap** (`app/sitemap.ts:35`) excludes routes flagged `sitemapExclude`, anything in the redirect map, and any route that isn't "index" under the production policy. It is still empty on staging.
3. **LP lane** (`app/(lp)/layout.tsx:43`) now needs both `AHV_STAGING=0` and `AHV_LP_LIVE=1`, so it stays closed by default.
4. **Finder data sync** (`tools/sync-finder-search-data.mjs`)
   - It rewrites only the `const DATASET = …;` part. It stops with an error if the dataset is missing, the programme count changes, or a route is unknown.
   - It is wired into `build`, and a `--check` mode is part of `search:check`.
5. **Price handling**
   - Search results only show a price that is current (`search.js:68-73`). The duration sort now ranks non-current prices last (`:290`), and the price sort drops them (`:295`).
   - The finder's expiry check matches, and when there is no price it shows "Request a quote".
6. **`/emailsubscriber/`** is skipped by the search index (`build-search-index.mjs:174`). None of the internal or junk routes appear in `search-index.json`, and those junk routes are in the redirect map.
7. **FAQ q-16** now states: Suite 1001 has one king bedroom plus a living room, Suite 1002 has a king room and a twin room, and every category provides hairdryers. The banned heading "For International Guests" appears only in the notes of `faq-content-2026.json`, not in the rendered FAQ or the search index.

## Material item for the release plan

**The price data expires in 6 days.** Every programme in `search-index.json` has `validTo: "2026-09-30"`, and the build runs with `--allow-expired`.
- From 1 Oct, every price in the finder pages, the search overlay and `/search/` will switch to "Request a quote". Nothing in the build will stop or warn.
- That fallback is safe, but a release around 1 Oct would effectively ship with no prices.
- An FAQ answer already quotes the new tariff ("valid 1 Oct 2026 – 30 Sep 2027", extra bed ₹3,000), while the programme prices still come from the 2025–26 sheet. Until 30 Sep the two can disagree on the page.
- **Needed:** load the 2026–27 tariff into the index and re-sync the finder data, as a separate owner-approved data step. I'm not supplying any figures.

## Non-blocking points to track

- **Answer-text limits differ.** Site search indexes up to 1,500 characters of each FAQ answer (`build-search-index.mjs:148`). The search box on the FAQ page matches only the first 400 (`repair-faq-search.mjs:64`). A term deep inside a long answer can find a question in site search, then disappear when the link filters the FAQ page. It's a known gap, not a correctness blocker.
- **Expiry uses UTC.** Using `T23:59:59Z` keeps a price showing until about 05:29 IST the next day. Midnight IST would be `T18:29:59Z` the day before.
- **The duration sort mixes price types.** Per-night prices are ranked against package totals (`search.js:290`). The price sort excludes per-night entries; this sort does not.
- **Sync script string replace.** `sync-finder-search-data.mjs:22` uses a plain-string `.replace`, so a `$&`- or `` $` ``-style sequence in programme data would be interpreted as a special pattern. There is none today. Passing a function as the replacement closes it.
- **FAQ sign-off records are thin.** q-16 still has `"signoff": null` and two open flags (the dropped "private verandas" claim, and Vastu vs Vaastu). Only 13 of about 61 entries carry a sign-off. The owner confirmation of 1001/1002 and hairdryers should be recorded in the file. Any answer with clinical content still needs Dr. Deepu John's sign-off before it goes to production (HARD GATE 7).
- **The LP layout calls `notFound()` inside a root layout.** That pattern was already there. In the production build, confirm `/lp/*` returns a 404, not a 500.

## What still needs proof, and who produces it

The build rerun should produce and commit this evidence:
- a clean production build, with `search:check` passing and the finder sync reporting 0 stale payloads;
- with `AHV_STAGING=0` set locally, a fetch of 3 to 5 representative pages checking the meta robots value, the `X-Robots-Tag` header, `robots.txt` and the sitemap entry count;
- `/search/?q=…` returning results with noindex set;
- `/lp/*` returning a 404.

## Verdict

- **Search and SEO implementation: APPROVED for the candidate release**, based on reading the code. It stays conditional on the build evidence above and on the tariff rollover being planned.
- **Live cutover: WITHHELD**, for the reasons you already have: form receipt is unverified and there is no authenticated GitHub approval from Abilash. I add the 30 Sep price expiry to that list.

Because you asked for read-only, I haven't saved this review to `docs/reports/`. Whoever commits the release evidence should add it there.


## Codex verification after review

Production-mode build, TypeScript, 78 unit tests and 258 acceptance queries passed. 241 nonredirect static pages contain H1 content with no conflicting robots values. Six finder routes at desktop/mobile render index/follow; search and confirmation routes render noindex/follow; canonical consolidation /our-story/ remains index/follow; the gated LP returns404. This is local production-mode evidence, not a live domain release.

Two review factual corrections: the index has32 programme records valid through30September2026, five courses valid1October2026–30September2027, and one unpriced record. Therefore not every price expires on30September. Served FAQ templates already use1500characters; the older repair-tool source has now been aligned. Data sync replacement now uses a callback, and the owner room-fact confirmation is recorded with q-16. Clinical sign-offs remain separate.
