# T9 INDEX — tile grids (sheet item 12) — owner's prompt run

Claude Design session opened 2026-09-22 02:33 IST (project "Kairali Healing Village Redesign").
Standing brief first, confirmed; then the owner's T9 block (`/tmp/ahv-prompts/12-T9.txt`, verbatim).
Supersedes the agent-prompted `/gallery/` hub candidate in `../T9-index-gallery-hub/` (its own
notes said item 12 had not run).

Files it wrote: `AHV Template Index Directory Desktop.dc.html`, `…Mobile.dc.html`,
`packages-index-data.js`, `notes/packages-page.md`. Toggles: contentMode (Live page — 27 tiles /
Sparse extreme — 4 tiles, no prose / Dense extreme — 38 tiles), showExcerpts, showActions.

## Desktop — Claude Design's comment (verbatim, 2026-09-22 ~02:47 IST)

> Desktop is up: AHV Template Index Directory Desktop.dc.html. Notes in notes/packages-page.md.
>
> Built against the live /packages/ HTML (no drop, no record supplied). 27 tiles, titles and
> excerpts verbatim, filter row and Book Now / Read More links real.
>
> The tile carries four independently optional parts — image, label, excerpt, action pair — so the
> same grid serves an index, a photo gallery or a bare link directory. A contentMode tweak switches
> between the live 27, a 4-tile prose-free sparse mode and a 38-tile dense mode using real content,
> so you can see the extremes without me inventing copy.
>
> Where it strains, one line: at counts leaving one or two tiles alone on the last row (5, 9, 38…)
> the grid ends on a visibly short row — everything else holds, because the tile reserves label
> and excerpt height rather than growing.
>
> Three things needing you:
>
> H2 "Browse all packages" is drafted and marked inline — the live page has no heading above the
> grid and one is needed for the h1→h2→h3 chain.
> The hero band and 13 card images are library stand-ins; the live files aren't self-hosted yet.
> Download list is in the notes as a Codex ask.
> Breadcrumb is provisional URL hierarchy until the final sitemap lands.
>
> Register flags: "guests" and "journey" both appear in verbatim live excerpts (kept for SEO,
> flagged not fixed). Nothing banned in any new copy.
>
> Mobile on your approval.

## Desktop self-check — two rounds of its own fixes (verbatim)

> Clamp fixed: it now sits on an inner span inside the label and excerpt, with the flex items set
> to flex:none, so truncation is a real 3-line clamp with ellipsis rather than flex-shrink silently
> eating the last lines. Notes corrected to match.

> Dropped the clamp entirely. Excerpts now render in full — right call for a MIGRATE_EXACT page —
> and tiles grow to fit. Labels still reserve two lines, and row stretch plus the pinned action row
> keeps buttons aligned across each row. Notes updated, including the strain line.

Both rounds ran to completion uninterrupted. Reply sent after: approved; drafted H2 stays marked
draft, stand-in images stay labelled, breadcrumb stays provisional; build 390px mobile incl. the
4- and 38-tile extremes; strain note; run checks.

## Apply notes (no questions asked — owner ruled none until 6–18 are done and applied)
- `/packages/` itself is LOCKED (D-20260921-14: homepage + package pages untouched). The owner's
  prompt names /packages/ as the design-against page; the template applies to the other index
  routes (/ayurveda-treatment/, /gallery/, video gallery, virtual tour, map, link directory) at
  apply time. /packages/ stays as-is unless the owner rules otherwise.
- "guests" / "journey" in the live /packages/ excerpts → those excerpts belong to the locked page
  content; register violation logged, not fixed here.
- Drafted H2 "Browse all packages" → replaced per route by a heading from the record, or ruled by
  the owner; never shipped as drafted.
- Image stand-ins → real record assets at apply (the record has them; the tool fetched the live
  site, not the record).
