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
