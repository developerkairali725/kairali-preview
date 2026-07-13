# IMAGE_MANIFEST — arogyakendra.com

Placeholder-first register per docs/ENGINEERING_STANDARDS.md (Abilash
directive, 13 Jul 2026). Every slot below renders today as a described
brand-token placeholder in `app/page.tsx`; swap-in is mechanical
(`next/image`, explicit width/height, alt text as listed).

Source priority: Kairali image library (~/Claude/Kairali-Digital/image-library/)
→ manual-linked galleries (kairali.com/media-assets) → licensed stock →
AI-gen only per site policy (site.config.json: video "none"; entity "group" —
no clinical-surface restriction, but prefer real Kairali photography).

Treatment: Brand Manual ch.05 — natural warm colour for treatments and
places; professional photography only.

| Slot | Placement | Subject | Mood / treatment | Exact px | Format | Alt text |
|---|---|---|---|---|---|---|
| hero-main | Hero, right column (top on mobile) | Real Kairali therapy or Kerala nature photography — e.g. warm-oil therapy in progress, or the Healing Village greenery | Natural warm colour, calm, human; no staged stock look | 1600×900 | AVIF + WebP fallback | Warm photograph of an Ayurvedic therapy in progress amid Kerala greenery at a Kairali centre |
| brand-healing-village | Brand card 1 thumb | Healing Village treatment pavilion amid Kerala greenery | Natural warm colour | 640×360 | AVIF/WebP | Treatment pavilion of Kairali's Ayurvedic Healing Village surrounded by palms in Palakkad, Kerala |
| brand-centres | Brand card 2 thumb | Therapy room interior at a Kairali Ayurvedic Centre | Natural warm colour | 640×360 | AVIF/WebP | Calm therapy room with a wooden treatment table at a Kairali Ayurvedic Centre |
| brand-products | Brand card 3 thumb | Kairali herbal oils and medicines arranged with raw herbs | Natural warm colour, product still-life | 640×360 | AVIF/WebP | Bottles of Kairali Ayurvedic oils beside fresh herbs and grinding stones |
| brand-tea | Brand card 4 thumb | Kairali herbal tea being poured, loose blend alongside | Natural warm colour, morning light | 640×360 | AVIF/WebP | Cup of Kairali herbal tea being poured with the loose-leaf blend beside it |
| brand-franchise | Brand card 5 thumb | Kairali centre entrance with signage | Natural warm colour, welcoming, professional | 640×360 | AVIF/WebP | Entrance of a Kairali Ayurvedic Centre with brand signage |
| brand-group | Brand card 6 thumb | Heritage still-life: stone mortar and pestle, palm leaf, fresh herbs (echoes the logo elements) | Natural warm colour; heritage engraving overlay permitted (ch.05) | 640×360 | AVIF/WebP | Heritage still-life of a stone mortar and pestle with fresh Ayurvedic herbs |
| og-image | Open Graph / Twitter card (no file exists yet — metadata ships WITHOUT og:image until this is produced; never fabricate) | Per Brand Manual ch.08: logo lockup + one Kurale line ("health through ayurveda") on ivory, OR a ch.05 photograph | Ivory ground or natural warm photo | 1200×630 | PNG or JPEG (static) | Arogya Kendra — Kairali Ayurvedic Group, health through ayurveda since 1908 |
| header-logo | Header wordmark (currently interim Kurale text — ch.02 forbids recreating the logo) | Kairali logo lockup, horizontal, light-ground colourway | Vector, as supplied by design (QUESTIONS.md Q17) | SVG, rendered 34–40px tall (ch.08) | SVG | Kairali Ayurvedic Group |
| favicon-set | Browser tab / app icons (not yet shipped — needs the icon asset, Q17) | Icon alone, centred at 70% of tile, on forest #004226 or ivory #F7F4EA (ch.08) | Flat, no effects/borders/gradients | 16 / 32 / 180 / 512 | ICO + PNG | — |
