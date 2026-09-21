# T13 POLICY — legal pages (sheet item 16) — owner's prompt run

Claude Design session opened 2026-09-22 04:36 IST. Standing brief first, confirmed; then the
owner's T13 block (`/tmp/ahv-prompts/16-T13.txt`, verbatim). It reported "Got the live source — 25
sections, verbatim" and is writing `AHV Template Legal Policy Desktop.dc.html`.

Files: `AHV Template Legal Policy Desktop.dc.html`, `…Mobile.dc.html`,
`notes/terms-and-conditions-page.md`. Toggles: tocPosition (Left/Right), showReadingTime,
showBackToTop.

## Desktop — Claude Design's comment (verbatim, 2026-09-22 ~04:50 IST)

> Desktop template is up, plus notes/terms-and-conditions-page.md.
>
> Layout: 288px sticky section rail on the left (scroll-spy, internally scrolling so 25 items fit
> at any viewport height), 66ch measure on the right, hanging gold section numbers, hairline rules
> between sections. No imagery. Meta strip under the H1 carries last-updated, section count,
> reading time.
>
> Body is verbatim from the live page (no drop and no record file existed, so I fetched live). 25
> sections, unchanged.
>
> Two things in the live copy you should see:
>
> The head title and meta description both say Privacy Policy on the Terms page.
> §13 points readers to "Section 24" for contact details; they are in §25. Kept verbatim; the
> in-page link points at 25 so it still works.
>
> Register flags are all in the governed legal text (≈20 uses of "Guest", plus
> booking/stay/wellness vocabulary) — full table in the notes. I introduced none.
>
> Content-extreme note: the sticky rail is the only content-sensitive part — it holds 25 sections
> fine and scrolls internally, but below ~4 sections (payment-policy-compliance, 404 words) it
> should be suppressed rather than shown as a stub, and section titles over ~45 characters wrap to
> three lines and stop being scannable at 288px.
>
> Tweaks exposed: rail left/right, reading time on/off, back-to-top on/off.
>
> Say the word and I'll build the mobile view.

## Desktop self-check — three rounds of its own fixes (verbatim)

> Scroll-spy rewritten: rAF-throttled scroll listener (capture phase, so it catches whichever
> ancestor actually scrolls) picking the last [data-sec] with top <= 120. The rail's internal
> auto-scroll rides on the same setActive, so it now follows the reader through all 25 items.

> Scroll-spy no longer depends on events at all — a requestAnimationFrame loop compares the scroll
> offset (and window width) against the previous frame and only re-reads rects when something
> moved, cancelled on unmount.

> Root cause: the preview embedding suspends rAF, scroll events and IntersectionObserver alike —
> only timers fire — so pick() runs once at mount and is never driven again.
>
> A 150ms setInterval is now the guaranteed driver (it compares scroll offset and window width, and
> only touches the DOM when the active section changes); the rAF loop and scroll/resize listeners
> stay as opportunistic fast paths. All three are torn down on unmount.

All three rounds ran to completion uninterrupted. Reply sent: approved; verbatim copy stays incl.
the "Section 24" reference; live title/meta stay as-is but flagged; register flags stay in the
notes; build 390px mobile (25-section list findable on a phone), 404-word extreme, strain note,
checks on both.

## Source defects surfaced (apply-time, owner's call — not asked now)
- Live /terms-and-conditions/ head title + meta description read "Privacy Policy".
- §13 says contact details are in "Section 24"; they are in §25.
- ≈20 × "Guest" + booking/stay/wellness vocabulary in the governed legal text (KTAHV register) —
  legal copy; GST-language sensitivity → Abilash's ruling at apply, logged in QUESTIONS.md.
