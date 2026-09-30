# The hero — option E, at a resolution it did not have

**Handover item 5**, owner ruling 2026-09-21: *"Hero image is too dark."* He is right, and the
measurement says how right. The live banner (`Layer 8-min.jpg`, three byte-identical copies in the
repo) carries the darkening **baked into the file**, not applied by CSS:

```
mean luminance 34/255 · median 27 · p05 7 · p95 87
88% of pixels in the bottom quarter of the range · 0% in the top quarter
```

Five options were built, each cropped to the hero slot with the route's real H1 overlaid at its real
position, and shown to the owner: https://claude.ai/artifact/U1b654surY631841tN2oJY

| | option | mean | delivered |
|---|---|---|---|
| A | the current frame | 34 | 1200×554 |
| B | the same frame regraded (my recommendation) | 90 | 1200×554 |
| C | Deluxe villa library frame | 127 | 1400×646 |
| D | Maharaja villa library frame | 113 | 1400×646 |
| **E** | **the villas-page hero — CHOSEN** | **98** | **1280×572** |

**He chose E over my recommendation.** Recorded plainly: the recommendation was B, the decision is
E, and E is now the asset. The reason B was recommended — it keeps the composition the chapter was
laid out around — is not an argument against E, which is a wider garden-and-palms frame already cut
to a banner shape and needing no crop at all.

## The one objection to E, and how it was removed

E's weakness in the comparison was resolution: the repo copy is **1024×458**, below the 1200px slot,
so it would have been upscaled on the exact page where the hero is largest.

The repo copy turned out to be a WordPress derivative — `our-villas-data.js` records its
`legacyUrl` as `…/2025/11/r-3-**1024x458**.webp`, and that dimension suffix is WordPress's, not the
photographer's. Fetching the unsuffixed original returned **1280×572 at 98KB** — wider than the
slot and a *smaller* file than the 1024 derivative already in the repo, because it is a cleaner
encode. The 1536 / 2048 / scaled variants all 404, so 1280 is the true original.

```
installed  public/ahv/assets/img/longform/AHV-LongForm-Hero.webp
           1280×572 · AR 2.238 · 100,702 bytes
           sha256 778484dc576da39583d012606afaae61e73f46a0a2e27099f5be3d4b05935e5a
           source https://ayurvedichealingvillage.com/wp-content/uploads/2025/11/r-3.webp
```

Screened before use, per the external-content rule: RIFF/WEBP magic bytes correct, decodes as an
image, no script-ish markers in the header. Self-hosted, never hotlinked (rule 6).

## What was deliberately NOT done

- **`AHV-OurVillas-Hero.webp` is untouched.** The villas page declares that image at 1024×458 in its
  own data; swapping a different-sized file underneath it would change a page nobody asked about.
  The new asset is a new filename. The villas page could take the same upgrade later — noted, not
  done.
- **E was not regraded.** It measures mean 98 against A's 34. The owner saw it at that brightness in
  the comparison and chose it; applying B's tone curve to it would be restyling his choice rather
  than executing it (MODE A).
- Slot aspect is 2.166 and the frame is 2.238, so the wiring takes a shallow crop or a hair of
  letterbox. Sub-1% difference; the wiring decides it against the rendered page.

## Why the asset needed a .gitignore exception

`sites/ayurvedichealingvillage.com/.gitignore` ignores every runtime binary under `public/ahv/`
because those 2,053 files ship from a pinned private GitHub release, hash-verified by
`tools/restore-runtime-assets.mjs`. A new image cannot join that bundle without cutting a new
release, which the existing comment in that file already records as **an owner action, not an
agent one**.

The same situation was already ruled once — the two BUILD routes of 2026-09-20 got a narrow
exception rather than a new release — so this follows that precedent exactly, in its own directory
so the rule stays narrow: `!/public/ahv/assets/img/longform/**`.

Checked rather than assumed: `restore-runtime-assets.mjs` extracts only members its manifest names
and **never deletes anything else**, so a tracked file in that tree is safe from the next restore.
When the package is next cut with these routes in it, this asset moves into the bundle and the
exception goes.
