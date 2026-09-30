# T7 ARCHIVE — past retreats (sheet item 17) — owner's prompt run

Claude Design session opened 2026-09-22 05:18 IST. Standing brief first; it confirmed and flagged
(verbatim): "One flag before you send the page: the project's standing KTAHV rules specify a
different hero pattern (Hero C Banner) and verbatim live-body porting. This brief supersedes those
for this template unless you tell me otherwise."

Reply with the owner's T7 block (`/tmp/ahv-prompts/17-T7.txt`, verbatim) + on the flag: the
standing brief governs and the project's KTAHV rules stay in force alongside it exactly as every
earlier template in the project was built — verbatim live-body porting mandatory, same Hero C
banner so the family matches its siblings (owner's "matches the previous, not designed in silos"
rule; no new decision taken).

Files: `AHV Template Past Retreat Record Desktop.dc.html`, `…Mobile.dc.html`,
`notes/past-retreat-record-template-page.md`. Source it used: the project's governed route kit
`data/family-04/hist9/karma-2019.json` (verbatim port).

## Desktop — Claude Design's comment (verbatim, 2026-09-22 ~05:31 IST)

> Desktop built: AHV Template Past Retreat Record Desktop.dc.html, ported verbatim from the
> governed route kit (data/family-04/hist9/karma-2019.json), with notes at
> notes/past-retreat-record-template-page.md.
>
> Pastness is carried by five things, not one: the archive breadcrumb, a hero record card (PAST
> RETREAT / 2019 / 14–24 November 2019 / "Concluded. Not open for admission."), the kit's
> historical-notice band under the image, the section notice on the travel notes, and zero booking
> affordances in the body — the only calls to action are the fixed closing block.
>
> Extremes note: the two-column body grid is the only fragile part — at /archive/ (156 words, no
> headings to speak of) the sticky "In this record" rail lists almost nothing and leaves a tall
> empty left column, so it must be suppressed below ~3 headings and the prose re-centred; the hero
> card, image band, notice and closing block all hold at both extremes since each is independently
> full-width and border-box.
>
> Three things want your call before I do Mobile:
>
> The undated siblings (/karma-being-retreat/, /lakshya-yoga-retreat/) need wording for the year
> card — marked [TO CONFIRM].
> The kit maps an inline link onto the "Accommodation" heading; I left the heading unlinked.
> Register flags — "journey", "Spa Treatment", "Resorts" all sit inside verbatim source copy, so I
> left them. Notes list every instance.
>
> Say the word and I'll build the mobile view.

## Desktop self-check — "Found issues — fixing…", its own fix (verbatim)

> Both fixed: the historical-notice band stays full-bleed sand but its paragraph is now capped at
> 66ch, and the "About Us" groups flow into auto-fit tracks — the 15-item group spans two and
> splits internally, so the three single-item groups sit compactly and a page with fewer related
> links won't leave empty columns.

Check ran to completion uninterrupted. Reply sent: approved; undated siblings' year-card wording
stays [TO CONFIRM] (owner fact); Accommodation heading stays unlinked but flagged; register flags
stay in the notes, source copy untouched; build 390px mobile (past-ness + photography must survive
the phone), 156-word no-image extreme, strain note, checks on both views.

Apply notes: "Concluded. Not open for admission." and "PAST RETREAT" are the tool's record-card
labels (not source copy) — owner rules the wording at apply; the 2019 dates come from the kit.
Register words in the source (journey, Spa Treatment, Resorts) → apply-time QUESTIONS item.

## Mobile — Claude Design's comment (verbatim, 2026-09-22 ~05:48 IST)

> Mobile built as its own layout — AHV Template Past Retreat Record Mobile.dc.html, showing the
> design route and the /archive/ short extreme side by side.
>
> Pastness is read before the title on mobile: a full-width ink strip carries PAST RETREAT · 2019
> in bright gold with "Concluded. Not open for admission." (the desktop's side record card has no
> phone equivalent, so this replaces it). Breadcrumb collapses to one 48px back link; the contents
> rail becomes a tap-to-open jump list; the About Us groups become four accordions. Photography
> goes full-bleed edge to edge — the intro pair as a stacked 240px strip, the montage at full width
> — so it gains presence on the phone rather than shrinking.
>
> Mobile strain note: the top ink strip is the only thing that can break — a route with both an
> undated state and a long qualifier ("Karma Being Yoga and Ayurveda Retreat") pushes it to three
> lines and shoves the H1 below the fold, so it must cap at two lines and move the date under the
> title when it does; everything below is a single 18px column that collapses cleanly from 1,670
> words to 156.
>
> My own checks on both views: one h1 each, no heading skips, zero overflow (388px content in a
> 390px frame), every non-inline target ≥44px, no hover-only disclosure, no motion. Two things I
> fixed from those checks:
>
> Mobile eyebrow was 11.5px; restored to the brand's 12.5px, and raised the strip line and captions
> to 17px/15px for the 45+ audience.
> Worth knowing: CSS ch units over-measure badly for Mulish — max-width:66ch was rendering about
> 80 real characters, so the desktop was quietly breaking the 66-character rule everywhere, not
> just in the band the review caught. I measured the font and re-derived every cap: body prose
> 51ch, standfirst 48ch, closing paragraph 43ch (your 56-character spec). Noted in the sidecar so
> it doesn't recur on the next template.
>
> Still open and untouched per your call: the undated year-card wording [TO CONFIRM], the unlinked
> Accommodation heading, and the register flags in source copy.

## Mobile self-check — "Found issues — fixing…", its own fix (verbatim)

> Both fixed. The intro pair now sits two-up in a single <figure> with the shared <figcaption>
> correctly parented — images at height:auto, no object-fit, no crop, downscaled from 265×273 to
> ~193px wide with native ratio intact, as the kit requires. The notes' "no crops, native ratios
> preserved" claim is now true of both views.

Check ran to completion uninterrupted. T7 (item 17) COMPLETE in the project, 2026-09-22 05:52 IST.
Not downloaded (export failing) — end-of-run attempt.

### CROSS-TEMPLATE FINDING (apply-time, all families in this run)
Claude Design measured that `max-width: 66ch` in Mulish renders ≈80 real characters; the
66-character measure in the standing brief is therefore only met with ≈51ch (body), 48ch
(standfirst), 43ch (closing paragraph, the 56-char spec). Every earlier template in this run
(T12, T3, T17, T2, T18, U-1…U-5, T9, T4, T6, T10, T13) used `66ch` literally. Not re-opened now
(owner: let each family finish; no double work) — logged for the apply step as a single global
CSS correction candidate, owner's call whether to apply it across the family set.
