# U-5 — /revitalizing-and-strengthening-treatment-for-cancer-patients/ (sheet item 11, one-off 5 of 5)

Claude Design session opened 2026-09-22 02:03 IST (project "Kairali Healing Village Redesign").
Standing brief sent first and confirmed; then the owner's page block (`/tmp/ahv-prompts/11-U-5.txt`,
verbatim) with the page's verbatim record copy and boundaries attached in the same message
(`verbatim-copy-handover.txt` here — 749-word record copy from
`english-candidate/prerender/revitalizing-and-strengthening-treatment-for-cancer-patients.html`,
INR tariff table and the two activity tables carried as-is; EUR/USD figures absent from the record
→ [TO CONFIRM]; supportive-care wording slot left as [TO CONFIRM — physician wording], not drafted).

Clinical register flags in the SOURCE copy are logged in QUESTIONS.md
`Q-AHV-CANCER-PAGE-CLINICAL-COPY` for Dr. Deepu John (HARD GATE 7). Nothing rewritten.

Files it is writing: `AHV Page Cancer Supportive Care Desktop.dc.html` (seen in the project URL
during the build).

## Desktop — Claude Design's comment (verbatim, 2026-09-22 ~02:12 IST)

> Desktop is up — AHV Page Cancer Supportive Care Desktop.dc.html, notes in
> notes/revitalizing-and-strengthening-treatment-for-cancer-patients-page.md.
>
> Copy is verbatim, typos and all. Two visible [TO CONFIRM] markers: the standfirst slot under the
> H1 (physician wording, left empty as instructed) and the EUR/USD tariff tabs. The physician-first
> path sits immediately below the hero image band as a bordered white panel with the four permitted
> routes and nothing else. Register flags are listed in the notes, not fixed.
>
> All seven images (three photographs, three maps, the grounds plan) are labelled placeholders — I
> can't generate photography, and the maps need real geo work or the real assets. Say the word if
> you want me to draw the three locator maps and the grounds plan properly.
>
> Content-extreme note: the two Daily Activities tables share a 1.35fr/1fr row; a family page with
> long activity names in the second table will wrap tightly there, so that row is the first
> candidate to collapse to one column.
>
> Mobile on your approval.

## Desktop self-check — "Found issues — fixing…", its own fixes (verbatim)

> Both fixed: closing buttons now sit on one row at desktop (padding trimmed to 26→20px, 760px cap
> untouched), and the inclusions list uses CSS columns with break-inside: avoid, so it reads
> top-to-bottom with even spacing instead of row-locked gaps.

Edited the desktop file. Toggles exposed: showToConfirm, showTariff, showWhereWeAre.

Reply sent after its check completed: approved; keep the seven images as labelled placeholders
(no drawn maps/grounds plan — the real record assets go in at apply); build 390px mobile with the
physician-first panel directly under the hero; strain note; run checks.

## Mobile — Claude Design's comment (verbatim, 2026-09-22 ~02:25 IST)

> Mobile is up — AHV Page Cancer Supportive Care Mobile.dc.html, 390px, genuinely re-laid out rather
> than scaled: physician-first panel sits as a full-bleed white band directly under the hero image
> with four stacked 60px contact rows; both Daily Activities tables become day-labelled stacked rows
> (no horizontal scroll, no table squeeze); the tariff table becomes four villa cards with
> Single/Double rows; inclusions run single-column with hairline rules; highlights become stacked
> cards; maps stack one per row; closing buttons go full-width.
>
> My checks: one h1, heading order h1→h2→h3 with no skips, zero horizontal overflow at 360px
> (scrollWidth 360), all eight links in the permitted set only, no tap target under 44px. The
> breadcrumb "Home" link was 18px tall — fixed to a 44px target on both mobile and desktop, which is
> the only change the desktop file picked up.
>
> Mobile strain note: the seven stacked Daily Activities rows plus four tariff cards put the closing
> CTA roughly 6,800px down, so a family page with materially more schedule or tariff rows pushes the
> closing block far enough that the physician-first panel at the top is doing all the conversion
> work — worth a second contact affordance if a page in this family runs much longer.

## Mobile self-check — "Found issues — fixing…", its own fixes (verbatim)

> Both fixed and re-measured on the reloaded page:
>
> Each mobile activity list now carries a header band with the source column names — "Day ·
> Activity · Place" and "Day · Activity · Timing" — styled like the desktop table header, so the
> second list is unambiguous and the third value in each row has its label. Breadcrumb "Home" is now
> 44×44 on both files. Still zero overflow at 360px.

Edited 2 files; check ran to completion, uninterrupted. U-5 COMPLETE in the project (2026-09-22
02:27 IST). Files: `AHV Page Cancer Supportive Care Desktop.dc.html`, `…Mobile.dc.html`,
`notes/revitalizing-and-strengthening-treatment-for-cancer-patients-page.md`.

Not downloaded — project export still failing ("ZIP download failed"); end-of-run export attempt.
Apply notes: real record images (hero, two photographs, three maps, grounds plan) replace the seven
labelled placeholders; the standfirst [TO CONFIRM — physician wording] slot and the source register
lines wait on Dr. Deepu John (QUESTIONS.md Q-AHV-CANCER-PAGE-CLINICAL-COPY); EUR/USD tariff tabs
[TO CONFIRM]. Its strain note (second contact affordance on long pages) is an apply-time design
decision for the owner, logged here, not actioned.
