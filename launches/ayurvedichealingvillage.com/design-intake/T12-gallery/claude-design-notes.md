# Photo collections template — page notes (Desktop delivered 21 Sep 2026)

Files: `AHV Template Photo Collections Desktop.dc.html`, `AHV Template Photo Collections Mobile.dc.html`,
data `assets/photo-collections-data.js`
Designed against `/property-gallery/` (13 photographs). Desktop approved 21 Sep 2026; mobile delivered same day.

## The duplication fix
Source pages carried the same photo set twice: a `glide__slides` slider **and** an identical grid
immediately below. Verified in `assets/gallery-family-data.js`: overlap is 100% on all six
two-group routes (property 13/13, villas 9/9, treatments 9/9, sight-seeing 7/7, yoga 6/6, retreats 5/5).
The template keeps **one** presentation — a justified photo grid — and the data file de-duplicates by
image source, first-seen order. No photograph renders twice on a page.

Side effect worth knowing: `/photo-gallery/` has **69 image slots but only 66 unique files** — three are
repeats inside its single grid. The page now shows 66. [TO CONFIRM] whether the three repeats were
intentional; if they were, the source file list needs correcting, not the template.

## Presentation
Justified rows (flex, `flex-grow` and `flex-basis` proportional to each photograph's aspect ratio, target
row height 230px, trailing spacer so the last row does not blow up). Every photograph keeps its true
proportions — no cropping — so a portrait file simply sits taller inside the same row height and never
breaks the row. At 1440 the 2.24:1 collections run 2-up; the 1.4:1 / 0.7:1 mixed set in `/photo-gallery/`
runs 3–5 per row.

Viewer: tap or Enter on any photograph opens it enlarged in a modal dialog — Esc closes, ← / → move,
Tab is trapped inside, focus returns to the thumbnail it was opened from, counter is announced live.

Lazy loading: first four photographs `loading="eager"`, everything after `loading="lazy"` with intrinsic
`width`/`height` on every `img`, so a 66-photograph page is not a single large download.

## Captions
No source collection carries per-image captions, so none are rendered. The template holds them if a page
supplies them (grid caption under the photograph, and inside the viewer).
`/photo-gallery/` is the exception: it has 11 page-level caption lines that are **not** bound to specific
images, plus its own source heading (`About – `, two strong runs). Those render verbatim as a list under
the collection. [TO CONFIRM] whether owner wants them mapped 1:1 onto photographs — a mapping cannot be
inferred from the capture (11 lines, 66 photographs).

## Drafted content (marked in-page "DRAFT — approve or replace")
- Intro line for every route except `/property-gallery/` (only that route has a source intro).
  Drafts live in `assets/photo-collections-data.js` → `intro.text`, `intro.source:false`.
- Section heading "Photographs" + the "13 PHOTOGRAPHS" tally line. The source section heading simply
  repeated the H1 ("Property Gallery"), so it is retained in data and not rendered.

## Head contract
Title / description / canonical / robots come verbatim from the route record and are applied on mount and
on route change (`syncHead`). Helmet carries the `/property-gallery/` contract as the static default.

## Register flags (verbatim source copy, not introduced by the design)
`/property-gallery/` intro contains "wellness retreat" and "retreat for rejuvenation"; the Kairali estate
map photograph has "Resort Map" and "Resort" burned into the image, and one signage photograph reads
"…Prohibited In The Resort". Design copy itself uses none of the banned words. The fixed closing block
keeps "World Luxury Award Winner" as the award's proper name.

## Codex asks
1. Re-export the estate map image without the "Resort Map" label, or supply a replacement — burned-in text
   cannot be fixed in CSS.
2. Confirm the three duplicate files inside `/photo-gallery/` (69 slots → 66 unique).
3. QA the justified rows at 360 / 768 / 1024 / 1440 / 1920 and confirm no sideways scroll.

## Mobile (390px) — a separate layout, not the desktop squeezed
Stacked hero (breadcrumb → eyebrow → H1 32px → standfirst), full-bleed hero band, sticky narrow header.
The collection is a **single full-width column in batches**: 12 photographs, then a 52px "Show 12 more"
button, with a live "Showing 12 of 13 photographs" line. Each photograph carries an "n / total" ordinal and
a "Tap to enlarge" affordance, so position is never lost in a long scroll. Two-up was rejected: at 390px a
2.24:1 photograph in a half-width cell is 76px tall, unreadable for a 45+/55+ audience.
The viewer is the same component behaviour — full-screen, 52px Previous / Next / Close, Esc, ← / →, trapped
Tab, live counter — and it navigates the **whole** collection, including photographs not yet batched in.
Closing returns focus to the thumbnail, or to "Show more" if that photograph is outside the current batch.
First two photographs eager, the rest lazy. Checked at 360px: no sideways scroll, no element past the edge.

## Content-extreme note
The grid is the only element that scales: it is composed from 5 photographs up to 66. It degrades in two
places — a collection of **1–2** photographs leaves the last row half-empty (acceptable, but a 2-photo page
would read better as a plain pair), and a collection of **100+** would want a "show more" break rather than
one continuous list.

Mobile: at 6 photographs the batching machinery never appears and the page is a short honest stack — the
only strain is that the fixed closing block is then a third of the page; at 66 it stays light (12 at a time,
five taps to the end) but the ordinal line is the only wayfinding, so a jump-to-index would earn its place
above ~100.
