# AHV gallery candidates — image-bank mining summary

**Generated:** 2026-09-22 17:01:28 IST (candidate register `docs/media/ahv-gallery-candidates-2026-09-23.json`, generated 2026-09-22 17:00:58 IST)
**Library:** `/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library` (README + `_MANIFEST.txt` read first; `raag/`, `raag-shoot-pro/`, `blushlounge/`, `influencers/` excluded per brief)
**Site:** `sites/ayurvedichealingvillage.com` — served images under `public/ahv/assets/img/**` (3,575 files hashed), gallery dataset `public/ahv/assets/photo-collections-data.js` (generated 2026-09-21)
**Mode:** READ-ONLY on library and repo; nothing copied or converted; the only writes are this file and the JSON.

Owner's brief this answers: *"our image bank has so much, not just 2025 — stop using duplicates and fill it up with images that will compel and sell the property and treatments, and videos too; sightseeing is just a few photos, what's the point."*

## Method (what the numbers rest on)

- **Enumeration:** `find` by image extension over the whole library minus the excluded folders → **2,380 stills**, 12.1 GB (no blind walk of the 70 GB; the 62 GB of video was enumerated by extension only and its MP4 headers parsed for duration/resolution — `ffprobe`/`exiftool` are not installed, and `mdls` works only where Spotlight has indexed the drive, so a small MP4 `mvhd/tkhd` parser was used instead).
- **Dimensions + fingerprint:** PIL read every still's pixel size and a 64-bit dHash (no file was written). **sha256 was computed only for the 400 shortlisted files.**
- **Captions/alt:** taken from `docs/media/IMAGE_CATALOG.csv` (the register the library README names as the live semantic catalog — vision-pass descriptions, not invented here) where a row exists (all `ahv-edited`, `ktahv-shoot-2025`, `ktahv/ktahv-nontherapy-*`, `products`); otherwise from folder/file name only. Treatment names come from the `ktahv-shoot-2025` file names. Clinical-register scrub applied (guest→patient etc.; banned-word scan of every caption/alt = 0 hits). Anything not evidenced by a name or the catalog carries **[TO CONFIRM]**.
- **alreadyOnSite** = sha256 match to a served file, OR normalised filename-stem match, OR a served image visually near-identical (dHash ≤ 4). Distance 5–6 is surfaced in `siteMatch` but does not set the flag. Because the site's originals are 1000–1400 px WordPress downsizes with hashed names, the visual check is what actually catches re-use; stem/sha alone found almost nothing.
- **Library de-dup:** within each gallery pool, dHash ≤ 3 collapses burst frames / colour-grade variants to one keeper (prefers the “-2” natural grade the catalog recommends, then the larger file). Not applied to `products/` packshots, where white-background renders of different products collide on dHash (dedupe there is one image per product handle instead).
- **Ordering:** score = catalog quality + register_ok + resolution + hero/gallery best-use − already-on-site − [TO CONFIRM]; then round-robin over subject keys so one treatment series does not run 30 frames deep; already-on-site items sink to the end of each list; cap 80 per gallery, overflow kept in `reserve`.

## Per-gallery result

| Gallery | On site now | Unique now* | Candidates | Reserve | Already on site (in list) | [TO CONFIRM] | Source folders (top-80) |
|---|---|---|---|---|---|---|---|
| /photo-gallery/ | 66 | ~44 | **80** | 0 | 0 | 0 | ahv-edited 41 · ktahv-shoot-2025 33 · ktahv 6 (best-of: treatments 26, property 19, villas 11, retreats 11, sightseeing 6, product 6, yoga 1) |
| /property-gallery/ | 13 | 8 | **80** | 83 | 0 | 0 | ahv-edited 51 · ktahv 19 · ktahv-shoot-2025 10 |
| /treatments-gallery/ | 9 | 7 | **80** | 269 | 0 | 7 | ktahv-shoot-2025 59 · ahv-edited 9 · ktahv 6 · legacy-treatment-photography 6 |
| /villas-gallery/ | 9 | 7 | **80** | 4 | 2 | 0 | ahv-edited 77 · ktahv-shoot-2025 3 |
| /retreats-gallery/ | 5 | 4 | **58** | 0 | 9 | 0 | ahv-edited 53 · ktahv-shoot-2025 4 · ktahv 1 |
| /product-gallery/ | 6 | 4 | **80** | 96 | 0 | 61 | products (KAPPL Shopify renders) 61 · ktahv-shoot-2025 18 · ktahv 1 |
| /sight-seeing-gallery/ | 7 | 5 | **12** | 0 | 3 | 2 | ahv-edited 10 · legacy-ktahv-site 2 |
| /yoga-gallery/ | 6 | 4 | **10** | 0 | 9 | 0 | ahv-edited 10 |

\* "Unique now" = current count minus the identical-alt pairs the dataset itself carries (see duplicates below).

Resolution of the shortlist: every candidate in property, villas, retreats, product, yoga and photo-gallery is ≥ 3000 px wide; treatments has 3 entries below 1600 px (legacy archive, flagged in `qualityNote`); sightseeing has 2 legacy web exports at 1000/1520 px (both already on site, listed last).

### Treatments (highest priority)
- 80 ordered candidates cover **every named treatment in the 2025 shoot**: Abhyanga, Pinda Sweda, Janu Vasti, Shirodhara, Thakaradhara, Thalapothichil, Greeva Pichu, Shiro Abhyanga, Udara Abhyanga, Mukha Abhyanga, Kati Vasti, Kati & Greeva Vasti, Back/Leg Udwarthanam, Pizhichil, Shiro Pichu, Bashpa Swedana, Nasyam — plus ahv-edited Netra Tarpana / kizhi / dhara frames, therapy-preparation still lifes, and 6 legacy Wakem-archive frames (3,744 px, treatment names not recorded → [TO CONFIRM]).
- Reserve 269 = 150 more legacy-archive frames (1000–1200 px, no treatment names in file names) + 119 further 2025/ahv-edited frames of the same series.
- 71 burst-frame near-duplicates inside `ktahv-shoot-2025` and 17 inside `ktahv/` (nontherapy set overlaps the IMG_ set, e.g. `ktahv-nontherapy-03.jpg` ≈ `IMG_8694-2.jpg`) were collapsed — the current dataset's habit of showing the same frame twice is exactly what the owner objected to.

### Property / Villas
- Property: 80 + 83 reserve across grounds, interiors, reception, facility, pool, signage, details — none currently served. Villas: 40 cottage exteriors + 40 room/bedroom/bathroom interiors from the 8192 px `ahv-edited` set; only 2 are on site today (`kt-18`, `kt-314`, listed last).
- 26 `ahv-edited` pool/lifestyle frames were rejected because `IMAGE_CATALOG.csv` marks them "not suited to KTAHV clinical pages; hospitality use only" (KTAHV register lock).

### Retreats / Yoga / Sightseeing (the thin ones)
- Retreats: 58 (patient-life frames — welcome ritual, tender-coconut refreshment, buggy, verandah walks, physician portraits, dining hall and thali frames). 9 of them already serve on other pages (`kt-188`, `kt-189`, `kt-211`, `ho-welcome-43/49`, `wx-dining`, `AHV-Knowledge-Cuisine`, …) and sit at the end of the list.
- Yoga: the bank holds **exactly 10 yoga stills** (one indoor-hall series with one patient and one instructor), and **9 of the 10 already serve** on the yoga/meditation pages and in the current yoga gallery. The stills bank cannot grow this gallery; the video bank can (below).
- Sightseeing: **no off-campus attraction photography exists in the library.** The 10 usable frames are the farm-surroundings aerials and paddy-transplanting scenes from `ahv-edited` (river aerial, paddy fields, village road). The 7 images currently served (river, waterfall, monkeys, swings — 1280 × 572 legacy crops) have no ≥ 1000 px original anywhere in the bank.

### Product
- 18 KTAHV 2025-shoot product stills (Kairali range displayed on campus) lead the list; the remaining 61 are KAPPL Shopify catalogue renders (one per product handle, ≥ 1600 px) flagged [TO CONFIRM] — the owner decides whether retail packshots belong in a hospital product gallery or only the campus stills do. 96 more handles in reserve.

## What was rejected and why (1,133 of 2,380 enumerated stills)

| Count | Reason |
|---|---|
| 207 | `web-exports/exchange/` — site-derived exports, screenshots, offer creatives (derivatives of already-served images) |
| 181 | `legacy-kairalicenters/` — Kairali Centers (city day-centres), not KTAHV |
| 116 | below 1000 px wide (legacy-ktahv-site 73, legacy-kairali-com 28, ktahv-shoot-2025 8, products 7) |
| 99 | near-duplicate frames (dHash ≤ 3) of a kept candidate — ktahv-shoot-2025 71, ktahv 17, legacy-treatment 9, ahv-edited 2 (each entry names its keeper) |
| 94 + 60 | `legacy-whatisayurveda-org/`, `legacy-whyayurveda/` — editorial-site imagery, not the property |
| 80 | `legacy-agency-draft/` — agency drafts (brief: reject) |
| 45 | `web-exports/` root — copies of ahv-edited originals / influencer set |
| 38 | `web-exports/team/` — clinical-team portraits (team page, not gallery) |
| 35 + 9 | franchise / equipment sites — not KTAHV |
| 28 + 12 + 10 | legacy web assets (logos, awards, banners, PNG graphics), healing-recipes restaurant exports (< 1000 px) |
| 28 | `web-exports/live/` — live-site screenshots |
| 26 | catalog `best_use` = not suited to KTAHV clinical pages (pool/lifestyle) |
| 25 | `web-exports/generated/` — AI concepts (README: never override the real-photography rule) |
| 17 + 6 + 3 + 2 | press/award logos, partner logos, offer creatives, press-kit files |
| 2 + 2 + 2 + 1 + 1 | stock-style `NNNNNNNN_ml.jpg` files [TO CONFIRM], Gita Ramesh archive portraits (rights gate), catalog `other`/`mockup_asset`, the 221-COLLAGE composite, one `_cmyk` duplicate |

Also not mined: `_staging/` (empty mirrors), `group/`, `kappl/`, `video/group`, `video/products`, `video/raag` (empty).

## Duplicates in the CURRENT galleries

The dataset (`photo-collections-data.js`) already de-duplicates the slider+grid repeats (`duplicatedInSource: true` on 7 routes), yet **41 duplicate pairs remain inside what is served**:

- **38 pairs with identical alt text** = the same source image published twice as two crops (photo-gallery pairs alternate 1400 × 1000 and 1400 × 2000; the themed galleries repeat 1000 × 500 / 1280 × 572 banners). By route: photo-gallery 22, property 5, product 2, sightseeing 2, treatments 2, villas 2, yoga 2, retreats 1. The photo gallery's "66 photos" is therefore ~44 pictures.
- **3 pairs visually confirmed by dHash** in /photo-gallery/: #17 ↔ #37 (distance 0, identical powder-massage frame), #15 ↔ #22 (distance 3), #9 ↔ #30 (distance 6).
- No `src` is reused across two galleries, so cross-gallery duplication is by crop, not by file; the per-pair list with both `src` values is in `currentGalleryDuplicates` in the JSON.
- **Provenance of what is served:** only **15 of the 121** current gallery images have a ≥ 1000 px original in the bank (all in /photo-gallery/, matched to `ahv-edited` 8192 px / 3648 px originals — the yoga series 223–229, 180, 190, 192, 150, 154, 25, 75). The other 106 are legacy WordPress downsizes with no master in the library, including two frames in /photo-gallery/ (#15, #22) whose nearest match is `legacy-kairalicenters/2023_10_paint.jpg` — a Kairali Centers image serving in the hospital's gallery. `currentGalleryPhotos[].libraryMatch` in the JSON carries the per-image result.

## Genuinely missing from the bank (for the owner to commission)

1. **Sightseeing / attractions — nothing.** No Malampuzha, Parambikulam, Silent Valley, Nelliyampathy, temples, waterfalls, dam, fort, Palakkad town, Kalpathy, tea/coffee estates, backwaters or beach photography exists in the library at any size; the 7 served attraction images are 1280 × 572 legacy crops with no master. This gallery cannot be filled from the bank — it needs a shoot (or licensed imagery with a rights record). Until then the only honest content is the 10 "surroundings" aerials/paddy scenes shortlisted.
2. **Yoga.** One indoor series (10 stills, one patient, one instructor) and it is already on the site. Missing: outdoor/lawn yoga, group class, pranayama, meditation garden, sunrise session, the yoga hall as a space. 2025 video (19 `2025shoot-yoga` clips) and the 2023 yoga films can carry the page meanwhile.
3. **Treatment coverage gaps.** Only one Nasyam frame; Bashpa Swedana is a single usable set-up; no Vamana/Virechana/Vasti preparation, no physician consultation *during* a treatment programme, no pharmacy/medicine-preparation series, no post-therapy rest. The 165-frame legacy Wakem archive has **no treatment names** in its file names — it needs Dr. Deepu John's team to label it before any caption can name a therapy (currently [TO CONFIRM]).
4. **Retreats.** No group-programme photography (arrival day, group consultation, cooking demonstration, evening cultural programme stills — only the 2023 shadow-puppetry video), no retreat-cohort frames.
5. **Product.** No KTAHV-context product photography beyond the 18 garden-table displays; everything else is KAPPL packshots.
6. **Villas.** Interiors are abundant, but no night/twilight exteriors and no bathroom series beyond a handful; no floor-plan or suite comparison.

## Video

- **Library:** 290 files, 62.6 GB. `video/ktahv/` 19 × 2023 brand films (4K, 6.2 GB — overview, drone, yoga ×2, therapy ×3, therapy room, quiet room, reception, pharmacy/consultation, rooms ×2, restaurant, library/gym/curio, campus walk, nature, paddy-field buggy, shadow puppetry); `video/ktahv/2025-shoot/` 84 catalogued 4K clips (15.7 GB: people 37, yoga 19, grounds 15, detail 6, nature 4, exterior 3 — catalog descriptions attached); `video/ktahv-2025-extra/` **173 uncatalogued HAR_ clips, 40.7 GB, 0.3–67 s each, 33 min total** (titles are [TO CONFIRM subject]); plus the 9 small homepage-loop MP4s and 5 exchange clips. Every file is in the JSON with path, bytes, duration, resolution, proposed title and catalog category/description where one exists. All 2023 catalog rows were joined to the local files by their 01–19 index (the Drive titles match the local names one-for-one).
- **YouTube:** the site links `https://www.youtube.com/user/kairaliayurvedagroup` (14×) and `https://www.youtube.com/@KairaliAyurvedaGroup` (10×) and embeds 27 video IDs (6 of them not in the catalog and untitled). Channel: Kairali Ayurveda Group, id `UCZdKDm4FWjykhp_TURZSH9A`, **4.33K subscribers, 492 videos** (channel page, 2026-09-22). WebFetch returned only the JS shell; a direct fetch of the /videos tab yielded the first 30 items and the RSS feed the 15 newest; merged with the 355 channel rows already in `docs/media/VIDEO_CATALOG.csv` that gives **369 public videos listed** (title + URL) — 123 of the 492 are not enumerated (needs the Data API or browser scrolling). 157 of the listed titles carry the catalog's "REVIEW: possible health claim" flag — none of those may be embedded on KTAHV pages without Dr. Deepu John's sign-off (HARD GATE 7).

## Caveats (unverified, stated as such)

- No image was opened visually by a human; captions rest on the catalog's vision-pass text and file names. Where the catalog has no row (legacy archive, legacy web exports) the caption says so and carries [TO CONFIRM].
- dHash catches same-frame reuse and resizes; it does not catch heavy crops (e.g. a 1280 × 572 banner cut from a 3:2 frame), so a few "not on site" candidates may still be crops of served banners — the 41 same-alt/visual pairs above are the floor, not the ceiling.
- Rights: the legacy Wakem archive's provenance is in `ktahv/legacy-treatment-photography/SOURCE_MANIFEST.tsv`; KAPPL packshots belong to the Shopify catalogue; nothing here is publication approval (README: "Descriptions are not publication approval").
- `git status` shows pre-existing modified files under `sites/ayurvedichealingvillage.com/public/` that this task did not touch and did not stage.
