# /how-to-reach/ — page notes

Files: `AHV Page How To Reach Desktop.dc.html` (1440) · `AHV Page How To Reach Mobile.dc.html` (390)
Source: live HTML of https://ayurvedichealingvillage.com/how-to-reach/ fetched 22 Sep 2026 (no drop supplied).
Metrics given: 1,383 words · 15 headings · 410 clicks · 39,534 impressions.

## Head contract (verbatim from live)
- title: How to Reach Kairali – The Ayurvedic Healing Village, Palakkad | Airports, Transfers & Directions
- canonical: https://ayurvedichealingvillage.com/how-to-reach/
- meta description / og:description: Plan your journey to Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital near Palakkad, Kerala. Compare Coimbatore (CJB) and Kochi (COK) airports, arrange a private transfer, find railway details and open live directions.
- og:image: /wp-content/uploads/2024/11/mpas.jpg (1280×600) — must be downloaded and self-hosted
- og:type article · og:locale en_US · alternate fr_FR · robots index, follow
- hreflang siblings: /de/so-erreichen-sie-uns/ · /fr/comment-nous-rejoindre/

## Body copy
Verbatim from live, in live order. Hero H1 ("Your route to the Healing Village"), eyebrow and standfirst absorbed into Hero C banner; H1 renders once. Heading levels h1 → h2 → h3, no skips, one h1.

## Drafted content (approve or replace)
1. Stepper section h2 "Four steps in, from the subcontinent to the gate" — new; the live page had no stepped sequence, only two embedded maps.
2. Step captions 1–4 under the map panel (steps 1–2 paraphrase the live "Where we are" paragraph; steps 3–4 are new label copy).
3. Step 4 grounds-plan frame copy, marked inline as DRAFT.
4. Step 3 column headings "Arrive / Road in / Destination" (desktop only).

## [TO CONFIRM] markers on the page
- Hero image band: live banner `mpas.jpg` to be downloaded and self-hosted (assets/img/).
- Step 4: illustrated grounds plan artwork does not exist. Frame is sized and waiting.

## Maps — how they are built
- Steps 1–2: real geometry, d3-geo + Natural Earth `world-atlas@2.0.2 countries-110m` via CDN, Mercator, markers at the hospital (10.727275, 76.710507 — from the live Google Maps links), CJB (11.0297, 77.0434), COK (10.152, 76.401).
- Steps 3–4: diagrams, not geographic. OpenStreetMap tiles were tried and are blocked (403) from this environment, and Google Maps iframes are not portable; rather than fake district or site geography, step 3 is a road diagram built only from the live distances and step 4 is the artwork frame.
- Codex asks: (a) download `mpas.jpg` and any other live banner assets into assets/img/; (b) decide whether steps 3–4 ship as a self-hosted tile map (needs a tile key/provider decision) or stay as diagrams; (c) supply or commission the grounds plan; (d) confirm a higher-resolution Kerala outline if the 110m coastline is too coarse at step 2.

## Register check (brand §12.2)
- No banned word introduced. "World Luxury Award Winner" retained verbatim in the fixed closing block as a proper noun.
- Live copy carries "spa" once, in the FAQ "Is this a hospital or a spa?" — kept verbatim because it is live SEO copy and the answer refutes it. Flagged, not changed.
- Live copy elsewhere uses patient / physician / programme / hospital consistently. No other violations found.

## Facts used
info@kairali.com · WhatsApp +91 92898 38797 (wa.me/919289838797) · main line +91 9555 156 156 (from live) · consultation and enquiry URLs as briefed. Distances (~62 km CJB, ~115 km COK, ~18 km PGT) and times are live-page values, not computed.

## Open gaps
- Breadcrumb is provisional (Home › How to Reach) pending `sitemap/sitemap-final.json`. Live nav places "How To Reach" in the utility bar, not under Contact.
- Forms: this page has no form; the newsletter form lives in the frozen footer.
- Header and footer are grey placeholders per this page's brief, not the frozen chrome components.

## Done-bar
- SEO head contract captured above · link audit against live links done (all live outbound links preserved: wa.me, tel, Google Maps dir/place, indianvisaonline.gov.in) · AA contrast on all ink/ground pairs · body 17–18px, line-height 1.7, targets ≥52px · no hover-only disclosure · no autoplaying movement · reduced-motion respected.
- Viewport battle test skipped per standing rules (Codex QAs widths).
