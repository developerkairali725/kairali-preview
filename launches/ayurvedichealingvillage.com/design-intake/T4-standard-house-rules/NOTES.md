# T4 STANDARD — house rules (sheet item 13) — owner's prompt run

Claude Design session opened 2026-09-22 03:07 IST. Standing brief first, confirmed; then the
owner's T4 block (`/tmp/ahv-prompts/13-T4.txt`, verbatim). No drop folder existed in the project,
so the tool fetched the live /no-preservatives/ route itself.

Files: `AHV Page No Preservatives Desktop.dc.html`, `…Mobile.dc.html`, `notes/no-preservatives-
page.md`. Toggles: showDraftMarkers, heroBand (full-bleed / contained).

## Desktop — Claude Design's comment (verbatim, 2026-09-22 ~03:17 IST)

> No drop folder existed, so I fetched the live route — body below the hero line is verbatim from
> it. Desktop is up; notes in notes/no-preservatives-page.md.
>
> The template move: prose column (66ch) on the left, sticky "House rules of the property" rail on
> the right carrying all eight siblings with the current one marked. That rail is what makes a
> 71-word page look deliberate — it holds the right half of the page regardless of how little copy
> arrives, and it doubles as the cross-linking you asked for.
>
> Break-point note (the one line): the layout survives both extremes, but a page with no H2
> subheads loses the hairline rhythm and becomes one undifferentiated block — the 71-word pages
> need either one H2 or a longer standfirst.
>
> Three things need your call:
>
> Live copy contains guests ×3 and journey ×1. Kept verbatim per the SEO rule, flagged in the
> notes. Say the word and I'll swap them.
> No caffeine page and no animal husbandry page exist in the live nav — both marked [TO CONFIRM] in
> the rail. Live nav does list In house Products, which your family list doesn't.
> The refrigeration page's live slug is misspelt (/no-refridgeration/). Kept as-is; confirm whether
> the new site keeps the typo.
>
> Both images render as labelled placeholder panels — I can't download the live assets from here,
> so self-hosting them is logged as a Codex ask.
>
> Approve and I'll build the mobile view.

## Desktop self-check — "Found issues — fixing…", its own fix (verbatim)

> CTA row now sits on one line at desktop width — button horizontal padding trimmed from 26px to
> 21px (24px saved against the 16px shortfall), flex-wrap: wrap kept so mobile still wraps as
> specified. Nothing else touched.

Check ran to completion uninterrupted.

## Reply sent (facts read from the record, nothing invented)
The record (`english-candidate/prerender/` + package `routes.json`) holds all eight family routes:
/no-smoking/, /alcohol-free/, /no-caffeine/, /no-preservatives/, /no-refridgeration/, /vegetarian/,
/organic-farm/, /animal-husbandry/ — so the two rail [TO CONFIRM]s were cleared with record slugs;
the refrigeration slug stays misspelt as the record has it (a slug change is an owner/SEO call,
not made here); /in-house-products/ exists in the record but is not in the owner's family list →
left out of the rail. guests/journey kept verbatim + flagged (live-copy register; QUESTIONS.md
apply-time item). Image placeholders stay labelled — record assets go in at apply. Mobile approved.

## Mobile — Claude Design's comment (verbatim, 2026-09-22 ~03:33 IST)

> Desktop rail patched, and I fetched /vegetarian/ so the extreme frame uses its real live copy
> rather than invented text.

> Mobile is up as two 390px frames on one board: A = /no-preservatives/ (595 words), B =
> /vegetarian/ (57 words, live copy verbatim — I fetched it so the extreme is real, not simulated).
> Desktop rail now carries all eight record slugs, both TO CONFIRM chips gone, refrigeration typo
> retained.
>
> How the rail behaves on mobile: it stops being a rail. The sticky white sidebar card becomes a
> full-bleed sand band that sits after the prose and before the closing block — eight edge-to-edge
> rows at 58px, hairline-separated, current page filled with a bronze "You are here" label instead
> of a link. Two other real changes: numbered lists break the Marcellus numeral above the text
> rather than beside it, and the CTA buttons go full-width stacked.
>
> Mobile strain note: at the 57-word extreme the page reads header → hero → one paragraph → rail,
> so the sibling band becomes the whole second half and the prose reads as an introduction to it;
> below roughly 40 words the hero band plus rail outweigh the copy about ten to one.
>
> My checks: 360px squeeze on both frames — scrollWidth 358 = clientWidth, zero overflowing
> children, no sideways scroll. 24 links, none under 44×44 after I enlarged the breadcrumb "Home"
> (was 36×24 — also fixed in the desktop file). Rail rows minimum 58px, all six CTA buttons exactly
> 52px. One h1 per frame, h1→h2→h3 unskipped. Marcellus and Mulish both resolving, body
> 18px/30.6px. Banned-word scan of rendered text returns only luxury (award proper noun), journey
> and guests (live verbatim, flagged) — nothing introduced.
>
> One thing still open: the nav label for /alcohol-free/. I render "No Alcohol" with a LABEL TO
> CONFIRM chip on desktop, since you gave me slugs rather than labels.

Edited 3 files; its check ran clean. Note: the live /vegetarian/ it fetched is 57 words; the
owner's sheet says 71 — the record copy is the apply-time source either way.

Follow-up sent (record facts): rail labels = the record pages' own H1s verbatim — Alcohol Free,
No Smoking, No Caffeine, No Preservatives, No Refridgeration, Vegetarian, Organic Farming, Animal
Husbandry — drop the LABEL TO CONFIRM chip, run checks.

## Label follow-up — Claude Design's closing comment (verbatim, 2026-09-22 ~03:40 IST)

> Labels applied on both views, chip gone. Nothing else touched.
>
> Checks: both rails read No Smoking · Alcohol Free · No Caffeine · No Preservatives · No
> Refridgeration · Vegetarian · Organic Farming · Animal Husbandry, hrefs unchanged and correct in
> each frame (each omits its own page, which carries the "You are here" row). Zero TO CONFIRM
> markers left anywhere on the page. Tap targets all ≥44×44, rail rows minimum 58px, no overflow at
> 360px, no console errors.

Edited 3 files; check clean. T4 (item 13) COMPLETE in the project, 2026-09-22 03:41 IST. Not
downloaded (project export still failing) — end-of-run export attempt. Apply notes: record copy
(not the live fetch) is the source at apply; images from the record; guests ×3 / journey ×1 in the
/no-preservatives/ record copy → QUESTIONS.md apply-time register item.
