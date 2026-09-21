# T3 ABOUT — Claude Design output, its own comments, verbatim

**Generated 2026-09-21 IST** · sheet item 7 · standing brief (message 1, confirmed) → sheet block
(message 2, verbatim). Not interrupted. **Files (4):** `AHV Template Institutional Trust Desktop.dc.html`,
`…Mobile.dc.html`, `assets/institutional-trust-data.js`, `notes/institutional-trust-template-page.md`.
Desktop AND mobile delivered in one pass (no pause). Tweaks: `route` (4 extremes), `stressNote`, `showRail`.

## Its closing comment — verbatim

> One thing you need to know first: no live record for these four routes exists in the project (the
> frozen content lock points at records/en/*.json files that aren't here) and I couldn't fetch
> live. So every body string is stand-in copy written to your exact volumes — 367w/4img/7lists,
> 977w/10lists, 18 images/no prose, 150w/no images — and the page says so in a dashed bronze strip
> you can switch off. Replace it verbatim when the records land. Unsupplied facts are visible
> [TO CONFIRM].
>
> The template resolves the three-way problem with three modes derived from the content, not set
> by hand:
>
> prose — 232px sticky section rail + 66ch column. The rail only appears at 3+ sections, which is
> what makes the 977-word page navigable.
> gallery — rail suppressed, column opens to full 1220px, 18 plates on a 12-column grid with a
> six-plate rhythm (wide pair → three-up → full-bleed band).
> brief — rail suppressed, column narrows to 760px and centres, hero band shortens; the empty
> "Current openings" section keeps its heading and says nothing is listed rather than vanishing.
>
> Lists whose items are all short go two-up on desktop. That single rule is what stops ten lists
> reading as an endless column.
>
> The application path is a sand #E0D7C4 panel with a gold left rule, left-aligned, ending in one
> deep-gold mailto:info@kairali.com button — deliberately unlike the centred white closing block,
> and a fourth button colour so it doesn't compete with the three fixed ones.
>
> Where it breaks: past ~1,400 words or ~12 sections the sticky rail outgrows the viewport and stops
> being scannable; below ~80 words with no images and no apply panel, the closing block sits too
> close under the hero and the page reads unfinished.
>
> Per the brief I drew the header and footer as grey placeholders — note that the approved chrome
> components already exist in this project and can be swapped in with one line each if you'd rather
> see it whole.

## What that means for apply
- **Every body string is a stand-in.** The four extreme routes DO exist in the site repo
  (`english-candidate/route-manifest.json` + their datasets) — the real copy is sourced from there
  at apply time and dropped in verbatim; the `stressNote` bronze strip is switched off then. Nothing
  is written.
- Mode is derived from content (section count / image count / word count), so the 11 T3 routes
  pour in without per-page configuration. No route in T3 exceeds ~1,400 words (max 977) or ~12
  sections; `/careers/` at 150 words has the apply panel, so it clears the ~80-word floor.
- Application path uses `mailto:info@kairali.com` — the locked contact, as the sheet required.
- The approved chrome components are in the Design project; swapping them for the placeholders is
  a one-line change per view at apply time.

## Its own self-check — completed, one fix applied (verbatim)

> Fixed: added `justify-content:center` to the body grid, so brief mode's 760px column now centres
> instead of hanging left. No effect on prose mode, which fills its tracks.

Check ran to completion, uninterrupted. **T3 is complete: desktop + mobile + check.**

## From its notes file (`claude-design-notes.md`) — facts the chat comment did not carry

- **Head contracts are `[TO CONFIRM]` placeholders** (title/description/canonical/robots) — at apply,
  metadata comes verbatim from each route's existing record, as for T17. Breadcrumbs provisional
  from URL hierarchy until `sitemap/sitemap-final.json`.
- **Register check (its own):** no banned word introduced; "World Luxury Award Winner" only inside
  the fixed closing block as the proper name; stand-in copy uses patient / physician / treatment /
  programme / Panchakarma / admission / discharge / consultation throughout.
- **Facts:** only the five supplied; every other number, date, fee or distance is `[TO CONFIRM]`.
- **Its "Codex asks":** (3) confirm the header/footer swap — the approved `AHV Chrome Header.dc.html`
  / `AHV Chrome Footer.dc.html` exist in the project and drop in with one line each.

Downloaded 2026-09-21 from `Kairali Healing Village Redesign (5).zip`; files placed beside this note.
