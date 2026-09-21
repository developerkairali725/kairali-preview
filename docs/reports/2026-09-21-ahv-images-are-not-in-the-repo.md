# AHV cannot be deployed: 1,746 of its 1,843 images are not in git

**2026-09-21 18:40:12 IST** · branch `codex/ahv-english-staging-20260915` · found while triaging
the 6 red checks on PR #309.

## The finding, in one line

`sites/ayurvedichealingvillage.com/.gitignore` excludes `/public/ahv/**/*.{jpg,jpeg,png,webp,mp4,pdf,ttf}`.
The site references **1,847 media URLs**; **97** of them are in git. Every CI runner and every Vercel
build therefore checks out a site with **no images**.

## Measurements

| | |
|---|---|
| distinct `/ahv/…` media URLs referenced by the shipped surfaces | **1,847** |
| present on this machine | 1,843 |
| **missing even locally** (broken references) | **4** |
| tracked by git | **97** |
| **referenced but absent from any clone** | **1,746** |
| bytes of the referenced set, on disk | **224.5 MB** |
| media files on disk under `public/ahv` | 2,147 (2,057 ignored, 246 MB) |

By type, of the referenced set:

```
jpg    1121 files    126.9 MB
png     359 files     42.5 MB
webp    328 files     28.7 MB
pdf       5 files     20.4 MB
mp4       2 files      5.4 MB
svg      18 files      0.4 MB
jpeg     10 files      0.2 MB
```

## What it explains

Three of the six red checks on PR #309, and the question the owner asked this session
("is the new design hosted?"):

1. **`factory-spec` — `A1: zero console errors on the home template`.** The failure is a wall of
   `Failed to load resource: 404`, and the server-side trace names
   `.next/server/app/(english)/[...slug]/page.js` throwing `NoFallbackError` — every missing image
   falls through to the catch-all route. Not a routing bug: the files are simply not there.
2. **`lighthouse` — Ship Gate A5.** Dies before scoring. (It has a second, independent cause: see
   §"The LP 404" below.)
3. **No Vercel deployment exists for AHV at all.** Zero in the last 100 deploys across the org,
   while abhilashkr, healing.recipes and arogyashala.in deploy on every push. A build that renders
   no images is not a preview anyone can approve.

**This is the reason the flip cannot happen.** DNS cannot point at a site whose images 404.

## Why it is this way, and why that reasoning has expired

The ignore rule is defensible for a local import experiment: `tools/import-english-candidate.mjs`
rewrites `public/ahv/` wholesale on every run, the package was **384 MB** when first mined, and
FACTORY RULES say never commit uploads. That held while the rebuild lived on one machine.

It stops holding the moment the site has to be *served by someone else's computer* — which is what
CI, Vercel and go-live all are.

## The second problem, which makes the first one easy to solve

`tools/optimise-images.mjs` already re-encoded the package in place (384 MB → 246 MB, same
filenames, same formats, so no approved markup moved). It is not enough:

- The **homepage alone references 89 images totalling 16.62 MB.** The same page on the LIVE
  WordPress site sends **6.95 MB**, because WordPress generates phone-sized variants. The audience
  is ~80% mobile and the live site currently **passes** Core Web Vitals (CrUX p75: LCP 1.8s,
  INP 122ms, CLS 0.01). Shipping this build as-is is a regression against a site that works.
- The worst offenders are not hero images. They are **team headshots at 0.5–0.63 MB each**
  (`team-anju-s.jpg` 0.63 MB, `team-sreeyuktha-c.jpg` 0.61 MB, `team-deepu-john.jpg` 0.55 MB). A
  headshot should be ~40 KB.
- **1,121 JPG + 359 PNG = 169.4 MB is still in 1990s formats.** No file carries a `srcset`.

Converting those to WebP/AVIF at sane dimensions is required for the A5 perf budget (≥90 mobile)
**regardless** of the git question — and it happens to shrink the tree to a size nobody argues
about committing.

## Recommendation (owner decision — this is 3 rulings, not 1)

**(a) Re-encode to modern formats at real display sizes.** Not in place this time: JPG/PNG → WebP,
headshots capped at their rendered size. Expected ~169 MB → ~35–45 MB. Blocks nothing else; it is
needed for A5 anyway. The filename-change problem the in-place tool avoided is real and is solved
by rewriting references in the same pass, with a postcondition that every referenced URL resolves.

**(b) Then commit the referenced set** (~60–70 MB after (a)) by narrowing the `.gitignore` to
"ignore everything under `public/ahv` EXCEPT what a page references", generated from the manifest
rather than hand-maintained. The un-referenced ~300 files stay out.

**(c) Or, if you would rather not carry binaries in git at all:** Vercel Blob / a CDN origin with a
committed hash manifest as the pointer of record — which is the shape Evidence Law v2 already
prescribes for large binaries. This is more moving parts and needs a rewrite of every asset URL, so
I do not recommend it for a site that is days from flipping.

**My recommendation is (a) then (b).** (a) is not optional under A5; (b) is the smallest change that
makes the site deployable.

### Also fix regardless: 4 references that are broken on every machine

```
/ahv/assets/img/Rehab.jpg
/ahv/assets/img/kAIRALI%20PALAK%20KAD_DEPICTIONS%20BY%20PRACHI%20KHASGIWALA-200.jpg
/ahv/assets/img/De-addiction-and-Rehabilitation-Treatment1-1.jpg
/ahv/assets/img/article/careers-5148-150x150.jpg
```

These 404 locally too, so they are not a git problem — they are missing assets. Per the
missing-asset protocol (CLAUDE.md §7) these get a creative-team request draft, or are sourced from
the 70 GB image library, before flip.

## The LP 404 — `lighthouse`'s other, independent cause

Separate from images. `app/(lp)/layout.tsx:43`:

```ts
if (process.env.AHV_STAGING !== "0") notFound();
```

Every `/lp/<campaign>` route 404s unless `AHV_STAGING=0`, and the CI job does not set it. All three
URLs in `sites/ayurvedichealingvillage.com/lighthouse-urls.json` are LPs, so the gate dies on the
first one:

```
Runtime error encountered: Lighthouse was unable to reliably load the page you requested.
(Status code: 404)
… http://localhost:4311/lp/panchkarma-treatment
```

The gate already knows LPs are noindexed and waives SEO for them (`seoWaived()`, from
LANDING_PAGE_DOCTRINE §8) — so measuring LPs is intended. They just have to render.

`AHV_STAGING` is read by AHV source only (`(lp)/layout.tsx`, `api/enquiry/route.ts`, `robots.ts`,
`sitemap.ts`, `next.config.ts`, `_families/boot.ts`) — no other site, no other script — so setting
it for the AHV job affects nothing else. Two notes before it is set:

- it must be set for **both** the build and the gate step: the LP pages are statically prerendered,
  so `notFound()` would otherwise be baked in at build time;
- setting it measures the **production** configuration, which is what a pre-ship gate should
  measure — but it also lifts the staging robots lock for that runner, so it belongs in the CI job
  env, never in a `.env` anyone could deploy from.

**Coverage gap found alongside it:** A5 wants *home + one content template + one LP*. AHV's list is
three LPs, no home, no content page. The homepage — the most important page on the site — is not
being measured at all.

## Status of the other three red checks

| check | cause | owner-side? |
|---|---|---|
| `brand-lint` | 1108 → 2 this session; the 2 are one clinical question | **yes** — Dr. Deepu John |
| `front-gate` | PR touches guarded `scripts/*` paths; needs an authenticated owner approval **at the head commit** | **yes** — one click, last |
| `Vercel – kairaliherbals-com` | a different site's project; not this branch's doing | no |
