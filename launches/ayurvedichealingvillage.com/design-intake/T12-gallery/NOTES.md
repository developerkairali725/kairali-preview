# T12 GALLERY — Claude Design output, its own comments, verbatim

**Generated 2026-09-21 IST** · sheet item 6 · standing brief (message 1, confirmed) → sheet block
(message 2, verbatim). It READ the existing 7-Sep `AHV Page Ayurveda Gallery` design first and
extracted the live gallery-family data, then built — not designed in a silo.

**Files (3 so far):** `AHV Template Photo Collections Desktop.dc.html`, `notes/photo-collections-template-page.md`
(+ a data module). **Mobile: paused by the tool — "Mobile next, on your approval."** — go-ahead sent
after its self-check completed; mobile is required by the standing brief, so no owner decision.

## Its closing comment — verbatim

> The duplication fix: the slider and grid were the same set on all six affected routes (100%
> overlap, verified in the data). One presentation only — a justified photo grid, de-duplicated by
> image source. Rows are built from each photograph's own aspect ratio at a 230px target row height,
> so a portrait file sits taller inside the row instead of breaking it, and nothing is cropped.
> Tap/Enter opens the enlarged viewer (Esc, ← / →, trapped Tab, focus returned to the thumbnail).
> First four eager, the rest lazy with intrinsic dimensions.
>
> Two things to decide: /photo-gallery/ has 69 slots but only 66 unique files, so it now shows 66
> (marked [TO CONFIRM]); and its 11 page-level caption lines can't be mapped onto specific
> photographs from the capture, so they render verbatim as a list under the collection. The route
> switcher in Tweaks lets you see the 6-photo and 66-photo extremes in this layout.
>
> Content extreme: the grid holds from 5 to 66; below 3 photographs the last row reads half-empty,
> and past ~100 it wants a "show more" break.

## What that means for apply
- The sheet's "FIX THIS FIRST" (same 13 photos as slider then grid on 6 of 9 routes) is fixed at
  the data level — de-duplicated by image source. That is the visible defect the owner named.
- **Two `[TO CONFIRM]` items for the owner at apply time, not now:** (a) `/photo-gallery/` truly
  has 66 unique photographs, not 69 — 3 slots were duplicates; (b) 11 orphan caption lines on
  `/photo-gallery/` cannot be attached to photos from the capture — shown as a list until mapped.
- Tweaks: `route` (all 8 gallery routes) + `rowHeight` (230px) — the template's own extremes test.
- Lightbox is keyboard-complete (Esc/arrows/trapped Tab/focus return) — an a11y point the sheet
  asked for and the 7-Sep design did not have.
- "Past ~100 wants a show-more" — no route is near it (max 66).

## Its own self-check — completed, THREE fixes applied (verbatim)

> Fixed all three:
>
> Grid thumbnails render as resolved nodes, so the streaming pass no longer requests the literal
> `{{ p.src }}` URL — console is clean.
>
> Hero columns top-aligned: eyebrow → H1 now contiguous (12px, was a 341px void), standfirst sits
> beside it and can grow to any length without moving the H1.
>
> Row basis is min(ar × rowHeight, 48%), so the wide 2.24:1 collections stay 2-up below 1220px
> instead of collapsing to one per row (measured 420px each at a 854px column).

Check ran to completion, uninterrupted. The 341px eyebrow→H1 void would have shipped as a visible
layout defect; the `{{ p.src }}` literal would have produced a console error per thumbnail — both
are the class of thing the owner's "let it finish its checks" rule exists to catch.

## Mobile — its closing comment, verbatim (after the go-ahead)

> Separate layout, not a squeeze: stacked hero (breadcrumb → eyebrow → H1 32px → standfirst),
> full-bleed hero band, sticky narrow header. The collection is a single full-width column served
> in batches of 12 with a 52px "Show 12 more" button and a live "Showing 12 of 13 photographs"
> line; each photograph carries an "n / total" ordinal and a tap-to-enlarge affordance. Two-up was
> rejected — at 390px a 2.24:1 photograph in a half cell is 76px tall. Same viewer,
> keyboard-complete (Esc, ← / →, trapped Tab, live counter), and it navigates the whole collection
> including photographs outside the current batch; closing returns focus to the thumbnail, or to
> "Show more" if that photograph isn't rendered yet. First two eager, rest lazy. Checked at 360px:
> nothing scrolls sideways.
>
> Where mobile strains: at 6 photographs the batching never appears and the fixed closing block
> becomes a third of the page; at 66 it stays light but the ordinal line is the only wayfinding, so
> past ~100 it would need a jump-to-index.

Files now: `AHV Template Photo Collections Desktop.dc.html`, `…Mobile.dc.html`,
`notes/photo-collections-template-page.md` (updated with mobile). Tweaks: `route` (8 routes),
`rowHeight` (desktop, 230px), `batchSize` (mobile, 12).

**For apply:** the 6-photo routes (`/product-gallery/`, `/retreats-gallery/` at 5–6) will show the
closing block as ~⅓ of the mobile page — the tool's own note; a decision for the owner at apply
QA, not a defect in the template.
