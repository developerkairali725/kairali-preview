# U-2 `/faqs-downloads/` — Claude Design output, its own comments, verbatim

**Generated 2026-09-22 IST** · sheet item 11, one-off 2 of 5 · standing brief (message 1,
confirmed) → sheet block (message 2, verbatim). Not interrupted. Desktop AND mobile in one pass.
**Files (4):** `AHV Page FAQs and Downloads Desktop.dc.html`, `…Mobile.dc.html`, a FAQ data file,
`notes/faqs-downloads-page.md`. It extracted the full FAQ content from the project record into a
clean data file before designing, and read the How-To-Reach page for consistency.

## Its closing comment — verbatim

> What it is — 44 questions in 12 groups, answers verbatim from the record. Finding one question
> fast is handled three ways: a sticky filter bar (type "visa", matching questions auto-open,
> groups with no hit disappear, live count announces the result), a sticky topic rail on desktop /
> a 12-tile jump grid on mobile, and native collapsed accordions so the whole page is one screen of
> group headings.
>
> Downloads — the source record has no attached files and says explicitly not to invent them from
> the page title. The shelf is built as three wired slots carrying [TO CONFIRM] title, type, size
> and date. That is the one thing blocking sign-off.
>
> Content-extremes note — the layout holds from about 3 groups upward; below that the desktop
> topic rail is taller than its column and looks stranded (collapse it to an inline chip row under
> ~4 groups), and a single group with more than roughly 25 questions makes the rail's sticky column
> shorter than the scroll it governs, which is cosmetic rather than broken.

## What that means for apply
- The sheet's test ("one specific question by eye in under ten seconds, on a phone") is answered
  three ways — filter, jump grid, collapsed accordions.
- **Downloads shelf:** the tool refused to invent files — correct. The real PDFs exist in the site
  repo at `public/ahv/assets/doc/` (three price lists, `healing-secrets.pdf`, one more) and are
  wired into the three slots at apply with their true title / type / size / date.
- Answers are verbatim from the record — no clinical copy was written. Any `[TO CONFIRM]` in the
  answers is inherited from the record, not introduced.
- Strain limits (≥3 groups, ≤25 per group) are both comfortably met by the live page (12 groups).
