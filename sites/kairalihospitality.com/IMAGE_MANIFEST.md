# kairalihospitality.com — image manifest

Every asset is a web-optimized derivative (sips crop + Pillow LANCZOS,
optimized progressive JPEG q53–76) of a library original in
`~/Claude/Kairali-Digital/image-library/` (outside git). Provenance = the
row in `docs/media/IMAGE_CATALOG.csv` quoted below. No stock, no
AI-generated imagery, no invented captions — every alt text describes what
the photograph actually shows. Iteration 2 (design review it.1 findings
2/6): every photo ships responsive width variants (`-560`/`-800`/`-1200`
suffixes; the bare name is the srcset fallback) and the two property
panels + the proof portrait are TRUE 3:4 portrait crops cut from the
originals, not CSS cover-crops of landscape files.

| File (public/) | Dims | Library original | Catalog row (entity · category · description) | Used as / alt text |
|---|---|---|---|---|
| images/hero-villa-raag-dusk.jpg (+ -1200, -800) | 1600×1067 / 1200×800 / 800×533 | raag/raag-drive-47.jpg | raag · exterior · "Twilight facade of a white boutique villa with a columned central portico, glass-panelled double doors lit warm from within, wall lanterns, and potted plants framing the entrance." | Full-bleed hero (LCP, fetchpriority=high, srcset sizes=100vw). Alt: "Twilight facade of Villa Raag in Agonda, Goa — a white villa with a columned portico, its glass doors lit warm from within, framed by coconut palms." |
| images/panel-villa-raag-pool.jpg (+ -560) | 800×1067 / 560×747 | raag/raag-drive-34.jpg (portrait re-crop: 1719×2292 region at x1837 y1300 of the 5392×3592 original — framed on the mosaic water feature + floral pool so the photograph's subject sits in the panel's clear zone; it.1 finding 2) | raag · pool · "An open-air plunge pool with a floral tile mosaic on the floor and a mosaic-clad water feature, framed by a covered terrace and overlooking dense palm and tropical greenery." | Villa Raag property panel (true 3:4 portrait). Alt: "An open-air plunge pool at Villa Raag with a floral mosaic floor and a mosaic-clad water feature, overlooking dense palm greenery." |
| images/panel-healing-village-cottage.jpg (+ -560) | 800×1067 / 560×747 | ahv-edited/kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-121.jpg (portrait centre crop: 4098×5464 region at x2047 y0 of the 8192×5464 original; recompressed q53 → 155 KiB per it.1 finding 6) | ktahv · exterior · pro · "Stone-and-brick patient cottage with tiled gabled roof set among coconut palms; landscaped lawn; stone footpath crossing a water channel to the entrance." | Healing Village property panel (true 3:4 portrait; clinical-register card). Alt: "A stone-and-brick patient cottage with a tiled gabled roof among coconut palms at Kairali — The Ayurvedic Healing Village, Palakkad, a stone footpath crossing a garden water channel to its entrance." |
| images/develop-raag-hall.jpg (+ -560, -1200) | 800×533 / 560×373 / 1200×800 | raag/raag-drive-22.jpg | raag · villa-interior · "Wide evening view of a grand dining hall with a turquoise cascading glass chandelier, sculpted swirl wall relief, long banquet table and a white-pebble indoor courtyard." | Consultancy chapter editorial pair (landscape). Alt: "The dining hall at Villa Raag in the evening — a turquoise cascading glass chandelier over a long banquet table, beside a white-pebble indoor courtyard." |
| images/develop-ktahv-morning.jpg (+ -560, -1200) | 800×1067 / 560×747 / 1200×1600 | ahv-edited/kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-169.jpg (portrait centre crop: 2736×3648 region at x1368 y0 of the 5472×3648 original) | ktahv · grounds · pro · "A staff member walks across a lawn swinging a smoking incense burner; garden ferns and palm trunks in warm morning light with drifting smoke." | Consultancy chapter editorial pair (true 3:4 portrait). Alt: "A staff member crosses a lawn at the Palakkad campus at dawn, swinging a smoking clay incense burner through the morning light." |
| og.jpg | 1200×630 | Playwright screenshot of this site's own hero (derivative of raag-drive-47.jpg) | derived locally, consent pre-seeded so no banner bakes into the card | OG/Twitter share card |
| images/kairali-icon.svg | vector | image-library/brand-assets/svg/ (agency pack, Q17) — copied from sites/arogyashala.in | group asset | Header/footer icon mark |
| app/icon.svg + app/icon.png | vector / 64×64 | same brand asset (copied from sites/arogyashala.in) | group asset | Favicons |

GAP (documented, not faked): **no photograph of Resort Svatá Kateřina exists
in the library** — the Czech JV panel ships text-first on a forest-700
surface until a rights-cleared photograph of the property lands in
image-library/ with a catalog row.

Note on KTAHV originals: the two ktahv images above are from the
`ahv-edited/` pro shoot ("Kairali Palakkad — depictions by Prachi
Khasgiwala"), which is explicitly the Palakkad campus. The `ktahv-shoot-2025/`
folder was NOT used for location-labelled panels because the library README
records its Drive source as "KTAHV New Shoot 2025 HO centre" (Head-Office
centre), so those frames cannot be captioned "Palakkad" without a ruling.
