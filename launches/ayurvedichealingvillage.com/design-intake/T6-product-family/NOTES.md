# T6 PRODUCT — products & publications (sheet item 14) — owner's prompt run

Claude Design session opened 2026-09-22 03:43 IST. Standing brief first, confirmed; then the
owner's T6 block (`/tmp/ahv-prompts/14-T6.txt`, verbatim). No drop folder; it fetched the live
/product-range/ itself.

Files: `AHV Template Product Family Desktop.dc.html`, `…Mobile.dc.html`,
`notes/product-range-page.md`. Toggles: stressTest (example 437 words/7 ranges/images · no images
758-word extreme · short 161-word extreme), showRail.

## Desktop — Claude Design's comment (verbatim, 2026-09-22 ~03:55 IST)

> Desktop template is up, with notes in notes/product-range-page.md.
>
> How it's built — Hero C banner (breadcrumb → eyebrow → h1 → drafted standfirst → full-width
> image band), then a two-column body: entry rows (image 320px left, linked h3 + verbatim paragraph
> right, 66ch) and a sticky "About Us" group-nav rail on the right. Fixed closing block reproduced
> as specced. Header/footer are grey placeholders. No cart, price or buy anywhere; each range links
> onward only.
>
> Content is the live copy verbatim. Images are sand placeholders labelled with their live upload
> path — I can't download binaries, so self-hosting the 8 files is written as a Codex ask rather
> than hotlinked.
>
> Where it strains at the extremes: the entry row degrades cleanly — at 758 words with zero images
> the image column simply drops and prose stays at 66ch; at 161 words the single entry leaves the
> sticky rail taller than the content, so the rail should cap its height or unstick below ~600px
> of body. Use the stressTest tweak to see all three.
>
> Two decisions for you, both in the notes:
>
> Live repeats every product name twice (bold sentence lead-in + card caption). I merged the two
> into one row, so the name now shows as heading and lead-in. Keep verbatim, or approve dropping
> the lead-in?
> The hero standfirst and the "Products are not sold on this site" line are drafted and marked
> in-page — approve or replace.
>
> Mobile next, once you've approved this.

## Desktop self-check — "Found issues — fixing…", its own fix (verbatim)

> Button padding reduced to 0 18px on all three CTAs — the row now fits the 760px block at 1440
> without wrapping. Height, radius, type and the mobile wrap behaviour are unchanged.

Check ran to completion uninterrupted. Reply sent: keep every product name verbatim (no lead-in
dropped — the owner's no-word-changes rule, not a new decision); drafted standfirst + "not sold
here" line stay marked as drafts for the owner at apply; placeholders stay labelled; mobile
approved incl. the two extremes.

## Mobile — Claude Design's comment (verbatim, 2026-09-22 ~04:08 IST)

> Mobile built as a separate layout: entry images run full-width above the heading, the group nav
> becomes four collapsible <details> groups below the entries instead of a rail, the three CTAs
> stack full-width, and the hero band drops to 220px. A small "7 ranges / The range" count sits
> above the list so the page reads the same whether it holds seven entries or one.
>
> Checks I ran (at 390 and 360): no horizontal overflow anywhere; zero tap targets under 44×44
> after I enlarged the breadcrumb Home link and the entry title links — both fixes also applied to
> desktop; details summaries 56px, rail links 52px, CTAs 320×52; one h1, h1→h2→h3 unskipped; body
> 18px/1.7; zero <img> tags. Rendered both extremes: with images off the entry collapses to heading
> + paragraph with no empty slot, and the single-entry page keeps the same rhythm.
>
> Mobile strain note: with images on and seven entries the page runs past 6,000px, so the rail is
> buried below a long scroll — if a page in this family ever exceeds ~10 ranges, the entry images
> should drop to a 120px thumbnail beside the heading rather than full-width.
>
> Notes file updated with the mobile section and the check results.

Edited 3 files; its "Checking the design for issues…" pass ran clean. T6 (item 14) COMPLETE in the
project, 2026-09-22 04:09 IST. Not downloaded (export failing) — end-of-run attempt. Apply notes:
record copy + record images at apply; the drafted standfirst and "not sold here" line are owner
decisions at apply (never shipped as drafted).
