# T18 ATTRACTIONS — Claude Design output, its own comments, verbatim

**Generated 2026-09-21 IST** · sheet item 10 · standing brief (message 1, confirmed) → sheet block
(message 2, verbatim). Not interrupted. Built from the frozen source records in the project
(real place names, order, distances). **Desktop first; mobile after its go-ahead** — the standing
brief requires mobile, so the go-ahead is sent once its self-check completes (no owner decision).

## Its closing comment — verbatim

> Facts used: place names, order and distances come from the frozen source records already in
> the project. Distances the live pages don't state (all four 15 km places, four of five under-10
> km places) render as [TO CONFIRM].
>
> Drafted and marked: the one-line summaries are the opening sentences of live copy, unedited; the
> "Good for" labels are drafted from that same copy. Both flagged in a visible DRAFT strip above
> the list.
>
> Where it breaks at the extremes: the card is a fixed 400px photograph beside a text column, so a
> place with only one short sentence (Mangalam Dam) leaves ~90px of white space under its text
> while the photograph holds the row height — at 4 places that reads as a sparse page, and it is
> the one place the template shows strain.
>
> Register flags for your list: "world-renowned" (Rock Garden, Kalamandalam), "fun place for the
> entire family", "hidden treasure", "alluring" — all verbatim live copy, left unchanged. I dropped
> the word "fantastic" from the above-50 standfirst sentence to keep it clean; say the word if you
> want it back verbatim.

## What that means for apply
- **Never estimated a distance.** 8 distances are `[TO CONFIRM]` (four 15 km places, four of five
  under-10 km) — owner supplies at apply, per the sheet ("Distances and place names are facts I
  will supply").
- The distance switcher is live across all four bands (4 / 5 / 6 / 7 places) — the sheet's "design
  them as ONE SET" requirement.
- **One live-copy edit to note:** it dropped "fantastic" from the above-50 standfirst. None of the
  flagged phrases are on the ban list; this is a tone edit, reversible at apply if the owner wants
  the sentence verbatim.
- Strain is real but bounded: Mangalam Dam's one-sentence entry; the 4-place page reads sparse.

## Desktop self-check — completed, no fixes needed

Check ran to completion, uninterrupted, nothing to fix. Mobile go-ahead sent after it (2026-09-22 IST).

## Mobile — its closing comment, verbatim (after the go-ahead)

> Mobile built: AHV Template Attractions By Distance Mobile.dc.html. It's a separate layout, not
> the desktop reduced — photograph first at full frame width, then distance chip, name, summary and
> "Good for" stacked; the four-band switcher is a 2×2 grid of 52px pills under the hero, and the
> three other bands repeat as a full-width list at the end of the cards so a reader who has scrolled
> seven places doesn't have to go back up.
>
> Checks run on the live render: one h1, heading order h1 → h2 → h3 with no skips in every band,
> no broken images, all [TO CONFIRM] distances intact (6 on the 15 km band, 5 on under-10 km), no
> horizontal overflow at 390 or 360, and all tap targets ≥44px — the breadcrumb links were 17px, so
> I raised them on both views.
>
> Where mobile strains: at 7 places the page runs about 4,900px before the closing block, so the
> switcher at the top is long out of sight by card four — the repeated band list at the bottom is
> the mitigation, not a fix; at 4 places the page is short enough that the bottom band list and the
> closing block stack almost adjacently and read as two competing exits.

**For apply:** the breadcrumb tap-target fix (17px → ≥44px) was applied to BOTH views — verify it
survives in the exported files. `[TO CONFIRM]` distance counts as stated by the tool: desktop
comment said "four of five under-10 km"; mobile check says "5 on under-10 km" — reconcile against
the data file at apply, do not assume either.

## Mobile self-check — found issues, two fixes applied (verbatim), then re-checked

> Both fixed on desktop and mobile: breadcrumb links now 44×44 minimum (8px horizontal padding,
> pulled back with a matching negative left margin so the crumb stays flush with the content
> column), and the four trust items hang their wrapped second line past the gold diamond.

Note: the second fix touches the FIXED closing block (trust-item hanging indent). Spec-wise the
block is unchanged — four items, gold diamond prefix, two-column grid — it is a wrap-rendering
correction, not a restyle. Verify at apply that the closing block still matches the standing brief
byte-for-byte in copy and structure.

Re-check ran to completion, uninterrupted, nothing further. **T18 is complete: desktop + mobile + checks.**

## Filing note (2026-09-22)

The project archive carried no new notes file for this session — the `.md` that came out is the
**8-Sep candidate's** `attractions-family-page.md`, renamed here to
`previous-candidate-notes-2026-09-08.md` so it does not pose as this session's. This session's
comments are the verbatim blocks above. `attractions-family-data.js` / `-render.js` beside this
note are also the 8-Sep family's files, kept for reference only.

One fact from the old note that still applies (the new template keeps source distances verbatim):
**Tipu's Fort sits under `/attractions-under-10kms/` with a "14 Km" distance line in the source** —
a source conflict retained, not corrected. Owner decides at apply which band it belongs in.
Downloaded 2026-09-22 from `Kairali Healing Village Redesign (7).zip`.
