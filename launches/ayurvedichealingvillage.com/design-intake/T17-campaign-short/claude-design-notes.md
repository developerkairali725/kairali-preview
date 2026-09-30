# Campaign & Offer template (short landers + standing offers) — 21 Sep 2026

Files: `AHV Template Campaign Offer Desktop.dc.html` (1440) · `AHV Template Campaign Offer Mobile.dc.html` (390)
Designed against `/ayurveda-retreat-kerala.html` (120 words). Extremes held: `/offers/olympics-and-paralympics-offer/` (2 words) and `/family-ayurvedic-retreat-kerala.html` (916 words). Also serves `/offers/senior-citizen-offer/`, `/offers/new/`, `/offers/defence-paramilitary-personnel-get-upto-30-off/`, `/kairali-air-india-maharaja-club.html`.

## Structure
Header placeholder (72px, not designed) → hero (breadcrumb · eyebrow · H1 · bronze-rule standfirst) → full-width image band → **offer-terms card** → optional prose + doctor aside → fixed closing trust/CTA band → footer placeholder (620px, not designed).

The terms card is the spine, not an add-on: gold 1.5px border, gold header bar, status chip, a 2×2 hairline grid of *Who qualifies / What it includes / Valid until / How to claim*, and the single primary action. It renders identically whether the page has 2 words or 916, which is what keeps the two-word page from reading as empty — the frame carries the confidence, the prose is optional.

## Content-state switch (tweak prop `contentState`)
`minimal` — title only, no standfirst, no prose. Hero → image → terms → closing. Nothing empty is drawn.
`typical` — 120-word example, drafted standfirst + 3 paragraphs.
`maximum` — 916-word stress: H3 subheads, list items, Latin filler visibly labelled "not copy".
Also `showStatus` (offer chip) and `showRelated` (aside link list).

## Where the layout strains
One line, as asked: **below ~40 words the prose column disappears entirely by design and the page runs hero → terms → closing (correct, not broken); above ~1,100 words the single 66ch column runs longer than the sticky-less aside, leaving the right rail empty past mid-page — that is the first point where a second image or a pull-quote would need to be specified.**

## Content marked, not invented
- All four term values are `[TO CONFIRM]` — every eligibility line, inclusion, expiry date and proof requirement waits on the owner.
- `typical` standfirst + 3 body paragraphs, the `maximum` standfirst, and the "Mention this offer when you enquire…" card line are DRAFT — visibly marked in the design, approve or replace.
- Image band is an empty slot (1440×430 / 390×240), captioned. No photograph chosen; nothing hotlinked.
- Related-programme links are placeholders (`#`) pending the sitemap.
- Breadcrumb chain is provisional (URL hierarchy) until `sitemap/sitemap-final.json`.

## Register
Clean against the ban list. "World Luxury Award Winner" appears once, inside the fixed closing block, as the award's proper name. "Retreat" is retained only where it is the live route's own title.

## Done-bar
Prose ≤66ch · content column min(1220px, 94%) · targets ≥44px, buttons 52px · mobile `overflow-x: hidden` + percentage gutters, nothing fixed-width below 360 · single H1, h1→h2→h3 unskipped · reduced-motion respected, no autoplay, no hover-only disclosure · body 18px/1.7 desktop, 17px/1.7 mobile · facts limited to info@kairali.com, +91 92898 38797, the consultation and enquiry URLs.

## Open
Nothing published. Head contract / SEO metadata not written — this is the layout template only.
