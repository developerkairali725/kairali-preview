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

## Mobile — Claude Design's comment (verbatim, 2026-09-22 ~05:12 IST)

> Can't reach /payment-policy-compliance/ from this session (only /terms-and-conditions/ and
> /privacy-statement/ are fetchable), so I won't invent its body. Building mobile with the Terms
> document live, and the short extreme as a real structural state with the copy withheld under
> [TO CONFIRM].

> Now running my own checks on both views.

> Mobile scroll-spy confirmed: at scrollTop 6000 the bar reads "12 · Additional Services and
> Charges"; frame scrollWidth 388 = clientWidth 388, so no sideways scroll. Sheet opens and lists
> all 25.

> Mobile view is up alongside the desktop, notes updated.
>
> Mobile is a different layout, not the desktop squeezed. The 288px rail is gone; in its place a
> sticky 60px "You are reading" bar names the current section and opens a full-height "Jump to
> section" sheet listing all 25 at 52px rows. That is how the 25-section list stays findable on a
> phone. Section numbers drop to a 28px hanging column, body runs full width inside 20px padding
> (~40 characters), H1 34px, h2 22px, body still 18px/1.7, closing-block buttons stack full-width
> at 52px.
>
> My checks: at scrollTop 6000 the bar correctly reads "12 · Additional Services and Charges";
> frame scrollWidth 388 = clientWidth 388, so nothing scrolls sideways; sheet opens, lists all 25,
> closes on selection. Desktop came back clean after the scroll-spy fix.
>
> One thing you need to decide. I could not fetch /payment-policy-compliance/ — only
> /terms-and-conditions/ and /privacy-statement/ were reachable this session. Rather than invent
> legal copy, the short-extreme frame is geometry only: H1, standfirst, dates, section count and
> all four bodies are visible [TO CONFIRM]. It does show the real behaviour I wanted you to see —
> the jump bar is suppressed below 5 sections, because a short document is already scannable and
> the bar would cost a screen of height for nothing. Send me the drop or paste the body and that
> frame becomes real in one pass.
>
> Mobile strain note: the sticky bar truncates to one line, so the two longest titles
> ("Cancellation, Amendments, and Refund Policy", "Check-in, Check-out, and Stay Policies")
> ellipsise to roughly half at 390px — fine as a position cue, not as a full title — and past
> about 60 sections the jump sheet becomes a long unsegmented scroll that would need grouping.

## Mobile self-check — two rounds of its own fixes (verbatim)

> Breadcrumb "Home" now carries the same inline-flex / min-height:44px treatment as the §25
> contact links, with the breadcrumb nav given min-height:44px so it no longer collapses to the
> text line — applied in all three places (desktop, and both mobile frames).

> Added the horizontal floor the vertical one was missing: min-width:44px;
> justify-content:center; padding-inline:6px on the breadcrumb anchors, with a -6px inline-start
> margin so the optical left edge still aligns with the text column. Applied in all three places.

Both rounds ran to completion uninterrupted. Toggles: stickyJumpBar, showReadingTime. T13 (item
16) COMPLETE in the project, 2026-09-22 05:16 IST. Not downloaded (export failing) — end-of-run
attempt.

Apply notes: the record holds ALL legal-family pages (`english-candidate/prerender/`:
terms-and-conditions, privacy-statement, privacy-policy, new-privacy-policy,
payment-policy-compliance [820 words in the record, not 404], cookie-policy, disclaimer,
legal-notice, cancellation-and-refund-policy) — the short-extreme [TO CONFIRM] frame is filled
from the record at apply, no paste-back to the tool needed (its "decide" ask is answered by the
apply pipeline, not by the owner). "Last updated" dates come from the record/owner.
