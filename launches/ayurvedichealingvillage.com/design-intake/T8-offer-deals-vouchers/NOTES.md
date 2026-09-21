# T8 OFFER — deals & vouchers (sheet item 18) — owner's prompt run

Claude Design session opened 2026-09-22 05:55 IST. Standing brief first, confirmed; then the
owner's T8 block (`/tmp/ahv-prompts/18-T8.txt`, verbatim) with the record facts + the record's
verbatim /offers/ copy attached in the same message (`record-facts-and-copy-handover.txt` here).

Facts: the owner's block says every price/date/inclusion/validity is his to supply. The record
page `english-candidate/prerender/offers.html` is the newer "A Note from Kairali" page (925 words,
three care initiatives, no deal card groups — it differs from the sheet's 808-word/4-card-group
description of the live page). The only figure in it is "Up to 20% off on select wellness
packages"; no other amount or expiry exists → everything else [TO CONFIRM]; gift-voucher amounts
and the two Baoli deals' figures [TO CONFIRM]. Nothing invented (HARD GATE 6).

Register words in the SOURCE copy, ported verbatim and flagged, not fixed: "guest" ×3,
"Journeys"/"The Journey" ×3, "wellness" — KTAHV banned register on /offers/ → apply-time
QUESTIONS item for the owner (the record's own copy, not the tool's).

Files: `AHV Template Offers Deals and Gift Vouchers Desktop.dc.html`, `…Mobile.dc.html`,
`notes/offers-page.md`.

## Desktop — Claude Design's comment (verbatim, 2026-09-22 ~06:08 IST)

> Desktop out for approval. Notes at notes/offers-page.md.
>
> Structure: Hero C banner → offers region (featured offer band + four deal-detail panels +
> three-card grid) → gift vouchers → the record copy verbatim, emoji and all → fixed closing block.
> Every amount, date and validity slot is a visible [TO CONFIRM]; the record's one figure ("Up to
> 20% off on select wellness packages") sits where it belongs in the Senior Citizens list.
>
> Register flags ported untouched, not fixed: "guest" ×3, "Journeys"/"The Journey" ×3, "wellness"
> throughout. None added.
>
> One thing to judge: the record ends on "Not Sure Which Program Applies?", which lands directly
> above the fixed closing block's "Not sure which programme fits?". Both are mandatory, so I left
> both. Say if you want them separated.
>
> Content extremes — at 64 words the featured band plus the four panels carry the page alone and
> it still reads finished; at the fat end the four-across grids assume short card copy, so cards
> over ~160 characters will make those rows tall and ragged.

Its "Checking the design for issues…" pass ran clean (no fixes). Reply sent: approved; both
closing questions stay, adjacency flagged in the notes (owner's call at apply); every
amount/date/validity stays [TO CONFIRM]; build 390px mobile, 64-word single-offer extreme, strain
note, checks on both views.

## Mobile — Claude Design's comment (verbatim, 2026-09-22 ~06:25 IST)

> Mobile built as two 390px screens side by side: /offers/ at 808 words, and the single-offer
> extreme modelled on The Baoli Special Deal.
>
> It's a different layout, not a squeeze. The hero sidebar card becomes a two-cell fact strip; an
> action strip with the two live contact routes sits directly under it; the jump chips become a
> collapsible "On this page"; the four deal-detail panels become an accordion with the first open;
> offer cards become 110px-thumbnail rows with a full-width Enquire bar; "How Healing Begins"
> becomes a vertical numbered rail.
>
> Mobile strain note — the single-offer extreme holds because the accordion gives five titled rows
> of structure to sixty words of prose, but that same accordion is the strain at the fat end: past
> about six panels the screen becomes a wall of closed bars with nothing visible between hero and
> closing block, and the first two should be forced open or split under a second h2.
>
> Checks run on all three views: one h1 each, no skipped heading levels, nothing overflowing the
> page box, no tap target under 44px, no body copy under 16px. The only sub-16px text is the 13px
> placeholder label, which doesn't ship.
>
> Closing-question adjacency is now flagged in notes/offers-page.md with your ruling recorded,
> along with the mobile layout log and the self-check results. All 28 mobile and 34 desktop figure
> slots remain [TO CONFIRM].

## Mobile self-check — "Found issues — fixing…", its own fix (verbatim)

> Replacing the three default-open disclosures with plain always-visible blocks — more reliable
> and better for a 45+ audience than depending on a default-open state.

> Fixed. The three panels that were meant to start open now can't close at all — I replaced them
> with always-visible blocks rather than relying on a default-open state:
>
> "On this page" is a plain list, five links visible
> "What the offer includes" is a visible block on both screens, so the single-offer extreme now
> shows real detail immediately after the hero
>
> Remaining panels stay click-toggled. Re-probed both screens: inclusions visible, one h1 each, no
> skipped heading levels, scrollWidth 390, zero overflow, zero sub-44px targets. Notes updated —
> the earlier "open by default" lines were wrong and are corrected.

Check ran to completion uninterrupted. T8 (item 18) COMPLETE in the project, 2026-09-22 06:31 IST.
Not downloaded (export failing) — end-of-run attempt follows. 28 mobile + 34 desktop figure slots
[TO CONFIRM] → the owner's figures at apply.
