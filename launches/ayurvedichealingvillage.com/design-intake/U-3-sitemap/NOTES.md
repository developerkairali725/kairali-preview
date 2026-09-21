# U-3 `/sitemap/` — Claude Design output, its own comments, verbatim

**Generated 2026-09-22 IST** · sheet item 11, one-off 3 of 5 · standing brief (message 1,
confirmed) → sheet block (message 2, verbatim). Not interrupted. Built from a live fetch of
`/sitemap/` (no drop existed), cross-checked against the 223-link governance record.
**Files (2 so far):** `AHV Page Sitemap Desktop.dc.html`, `notes/sitemap-page.md`.
**Mobile: paused by the tool — "Mobile follows your approval, per the standing rule."** — go-ahead
sent after its self-check (mobile is required by the standing brief; no owner decision).
Tweaks: `showFilter`, `density` (comfortable / compact).

## Its closing comment — verbatim

> Built from a live fetch of /sitemap/ (no drop existed), cross-checked against the 223-link
> governance record. Every label verbatim. Layout is three sections — Ayurveda Treatment (31, three
> columns), Villas, and More (About / Things to do / Offers / Awards / Training / Yoga / Ayurveda as
> cards, then Packages and Archive full-width) — with a sticky filter and jump chips at the top.
>
> Four things need you:
>
> Head contract is wrong at source. The live title and description are an offers-page string,
> nothing to do with the sitemap. Ported verbatim; recommend a rewrite.
> Two broken targets carried over, both marked [TO CONFIRM] on the page: Media Gallery's href is
> corrupted HTML, and the four Villa Gallery children are href="#".
> 25 URLs are in sitemap_index.xml but not on this page (terms, disclaimer, cookie policy,
> all-programs, gallery, and others). I did not add them — that is an authority call.
> Duplicate target: "Chronic Back Pain Relief Treatment" points at the stress-and-strain page.
> Likely a source typo; left verbatim.
>
> Extremes note: the three More columns are hand-balanced, so a page in this family with a much
> longer About list would leave one column short, and under about twenty links the three-column
> grid reads as empty — both cases want a two-column auto-flow instead.

## What that means for apply
- All four findings are SOURCE defects the design carried verbatim, correctly. They are real on
  the live site today → QUESTIONS.md `Q-AHV-SITEMAP-SOURCE-DEFECTS` (owner authority; no ask now).
  The 25 missing URLs in particular are a sitemap-completeness decision, not a design one.
- Extremes: this is a single page; the hand-balanced "More" columns are fine as-is.

## Mobile — its closing comment, verbatim (after the go-ahead)

> It is a different layout, not the desktop reflowed. Eleven collapsed accordions, one per section,
> each summary carrying the section name and a live page count, so the whole site fits in one
> screen of eleven rows before anyone scrolls. Jump chips sit inside a collapsed "Jump to a section"
> block rather than a sideways rail, and tapping a chip opens its accordion. The filter is sticky at
> the top and auto-opens every section holding a match. The desktop's linked section headings
> become explicit "— section page" rows inside each accordion, which is the only content difference
> between the two views.
>
> Checks I ran:
>
> Desktop — 197 rows, 196 unique targets (the one duplicate is the known source defect), single h1,
> h1→h2→h3→h4 with no skip, nothing under 44px, no href="#", no corrupted hrefs, hero resolves,
> console clean.
> Mobile at 360px — 207 rows across 11 sections, single h1, no skipped level, nothing under 44px, no
> element overflows its container, both [TO CONFIRM] markers intact, console clean.
>
> Where mobile strains: the accordions absorb any length, but Packages (53 links) and Archive (45)
> are each about a 2,700px scroll once opened, so any section past roughly sixty links wants a
> second tier of accordions inside it rather than one long list.

Files now: `AHV Page Sitemap Desktop.dc.html`, `…Mobile.dc.html`, `notes/sitemap-page.md` (both
views). Tweaks: `showFilter`, `sectionsOpen`. Its "no href='#', no corrupted hrefs" on desktop
confirms the two broken source targets render as `[TO CONFIRM]` markers, not as dead links.
