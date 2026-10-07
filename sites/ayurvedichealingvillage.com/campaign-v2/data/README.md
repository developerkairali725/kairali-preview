# Awards and ratings: one source

Every award, rating and review count on the landing pages comes from this folder. Sections never hold
their own numbers. **Never type a rating, review count, award name or logo path anywhere else**, and never
fill a gap with a plausible-looking number. If a value can't be verified, leave it out.

| File | Holds | Read by |
|---|---|---|
| `awards.ts` | `AWARDS`: every award, with `FEATURED_AWARDS` (shown, in `order`) and archive entries (`featured: false`) | `ProofStrip` (A logo row, B/D card badge), `Hero` trust line |
| `ratings.ts` | `TRIPADVISOR` (rating, count, rank, `asOf`, listing URL) and `NABH_VALIDITY` | `ProofStrip` (all variants) |
| `google-rating.ts` | `getGoogleRating()`: the live Google rating from the Places API, or `null` | `ProofStrip` |

The NABH certificate number (AH-2024-0250) is not stored here. `sections/facts.ts` reads it from
`site.accreditation`.

## Where each value comes from

- **Tripadvisor (`TRIPADVISOR`)**
  - Source: the proof block on https://ayurvedichealingvillage.com/ and its footnote ("as of August 2026" → `asOf: "2026-08"`).
  - Values: rating 4.6, 450 reviews, rank "#2 of 27 hotels in Palakkad", Travelers' Choice & Hall of Fame every year 2011–2026, Hall of Fame 2019.
  - `listingUrl` is the Tripadvisor listing.
  - Spelling: use Tripadvisor's official "Travelers' Choice". The live homepage writes "Travellers'".
- **Awards (`AWARDS`)**
  - Each entry's `sourceUrl` is the whyayurveda.org article or live page the facts were copied from.
  - Logos are the files the live site uses, already in `public/`. `logo.width`/`logo.height` are the file's true pixel size.
  - World Luxury 2025: the source reports four titles but names only two. Only those two are listed; do not add the others. <!-- compliance-allow: luxury -->
  - World Luxury 2025 logo: `/lp-v2/img/logo-wlha-black.png`, the clean mark. The live site's `ann-11-world-luxury-hotel-awards-2025.webp` is an event photo, not a logo. <!-- compliance-allow: luxury -->
  - Excluded on purpose: "Best Marketing Director India" (a personal award) and the APSWC monsoon card (an offer).
- **NABH validity:** 2024–2027, from the live accreditations page.
- **Google:** never stored. See below.

## How to refresh (every 3–4 months, or when lp:check warns `data.stale`)

1. **Tripadvisor**
   - Open https://ayurvedichealingvillage.com/.
   - Copy the rating, review count and rank from the proof block.
   - Set `asOf` to the month in its footnote ("as of <Month YYYY>" → `"YYYY-MM"`) and `verifiedOn` to today.
   - If the homepage footnote is old, check the Tripadvisor listing (`listingUrl`) instead and record that month.
2. **Awards**
   - Check the homepage awards section and whyayurveda.org for new awards.
   - For a new award, add an entry with the exact name, year, titles verbatim, `sourceUrl`, and `verifiedOn` = today.
   - Logo: use the file the live site uses. Copy it into `public/` if it isn't there yet, and read its size with `sips -g pixelWidth -g pixelHeight <file>`. Never guess the size.
   - Set `featured` and `order` (most recent first). The A logo row shows the first 5 on desktop and the first 4 on phones (`AWARD_ROW_MAX`).
   - Move superseded awards to `featured: false`. Don't delete them.
   - Re-check existing entries against their `sourceUrl` and bump `verifiedOn`.
3. **Check:** run `node --test test/lp-v2-proof-data.test.mjs`, which verifies every logo file exists at the size recorded. Then run `pnpm lp:check panchakarma`.

### The freshness guard (`data.stale`)

`lp:check` warns when:

- `TRIPADVISOR.asOf` is more than 120 days old, or
- any featured award's `verifiedOn` is more than 180 days old.

The message is "Re-verify ratings/awards from https://ayurvedichealingvillage.com/ and update campaign-v2/data/*.ts". Fix it by following the refresh steps above. Do not just bump the dates.

## Google rating: live only

The Google item appears only when the Places API answers. When it doesn't, the item is left out entirely: no placeholder, no "[4.x]", no gap (the CSS reflows on `lp-proof__grid--no-google`).

Enable it with three server env vars, all required:

| Var | Value |
|---|---|
| `AHV_GOOGLE_REVIEWS_ENABLED` | `1` |
| `AHV_GOOGLE_PLACES_API_KEY` | a Google Places API (New) key |
| `AHV_GOOGLE_PLACE_ID` | the Healing Village's Place ID |

How `getGoogleRating()` behaves:

- It calls `lib/google-reviews.ts` `loadGoogleReviews()` with a 2.5 s timeout and never throws.
- It returns `{ rating, count, mapsUri }` only on `status: "ready"` with numbers.
- It caches a result per server instance for 6 hours, and a miss for 5 minutes.
- A Place ID whose name isn't "Kairali … Healing Village" is rejected.

## House rules

- Award names with "Luxury" or "Spa" are proper nouns. They appear only as logo alt text or a captioned award name, never in running copy. <!-- compliance-allow: luxury, spa -->
- The register check in `kit/lint/language.ts` skips the exact names in this registry (`AWARD_PROPER_NOUNS`).
- Logo alt = the exact award name and year (`alt`).

## Needs a higher-res asset

Rule: a logo's natural height must be at least 2× its rendered height (A row 60px desktop / 44px phone; B/D card badge 52–54px). This is checked by test.

| Logo | Natural | Rendered (max) | Status |
|---|---|---|---|
| `logo-ta.webp` (Travelers' Choice 2026) | 200×254 | 60px | OK (4.2×) |
| `award-haute-grandeur-2026-crop.webp` (lp-v2/img) | 667×375 | 60px | OK (6.3×). Tightly cropped from the live `award-haute-grandeur-2026-web.webp` (800×450), which had wide transparent margins. |
| `logo-patwa.png` | 400×400 | 60px | OK |
| `award-natgeo-traveller-spa-wellness-2026-kit.webp` | 1200×1071 | 60px | OK |
| `logo-wlha-black.png` | 1015×941 | 60px | OK |
| Archive: `ann-10-lotus-travel-quality-partner-2026.webp` | 200×113 | not shown | **needs a higher-res asset** before it can be featured (113px tall < 2×60) |

No featured logo currently needs replacing.
