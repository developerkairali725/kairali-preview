# U-1 `/how-to-reach/` — Claude Design output, its own comments, verbatim

**Generated 2026-09-22 IST** · sheet item 11, one-off 1 of 5 · standing brief (message 1,
confirmed) → sheet block (message 2, verbatim). Not interrupted. Both views in one pass.
**Files (3):** `AHV Page How To Reach Desktop.dc.html`, `…Mobile.dc.html`, `notes/how-to-reach-page.md`.

Mid-build it fetched the live page ("port its copy verbatim"), hit two problems and corrected
itself: OSM tiles 403 in its environment, and the d3 Kerala projection "filled the world" → it
dropped Leaflet, fixed the projection, and switched steps 3–4 to schematic panels. It also ran one
web search ("Kairali Ayu…") — its comment claims no web-sourced fact; **verify at apply** that the
data carries nothing beyond the live page's copy and the five supplied facts.

## Its closing comment — verbatim

> Body copy is verbatim from the live page; header, footer and the closing trust block are
> placeholders/reproduced as specified. The four-step sequence runs India → Kerala → Palakkad →
> grounds, one panel at a time, with a stepped rail (sticky on mobile) and a bottom WhatsApp/Call
> bar in the vehicle case; phone numbers, email and both addresses have one-tap copy.
>
> Two things to decide:
>
> Maps. Steps 1–2 are real Natural Earth geometry. OpenStreetMap tiles are blocked from this
> environment (403) and Google embeds aren't portable, so rather than draw fake district or site
> geography, step 3 is a road diagram built only from your distances and step 4 is a framed artwork
> slot marked [TO CONFIRM]. Both need your call — tile provider, and whether a grounds plan exists.
>
> Content extremes. The step rail is the fragile part: it is fixed at four steps, so a page with
> three or five zoom levels needs the rail rebuilt (desktop splits into four equal columns; mobile
> scrolls, so it survives better). Elsewhere, a much longer page just extends the accordion and card
> stacks; a much shorter one leaves the three-up "by air / rail / road" row visibly gappy if a mode
> is missing — drop it to two columns in that case.

## What that means for apply
- The sheet's asks are met: stepped sequence not four stacked images; vehicle case (sticky rail,
  bottom WhatsApp/Call bar, big targets); one-tap copy on phone numbers, email, both addresses.
- **Owner decision at apply (logged, not asked):** a map-tile provider for step 3 (and its
  consent/third-party implications under the site's Consent Mode), and whether a grounds plan
  artwork exists for step 4 — QUESTIONS.md `Q-AHV-HOW-TO-REACH-MAPS`.
- This is a single page (not a family), so the fixed-four-step rail limit is fine as-is.

## Its own self-check — completed, one fix applied (verbatim)

> Both flagged links now sit in 44px-high hit boxes: the breadcrumb "Home" on desktop and mobile,
> and "Open live directions" under the map stepper (moved onto its own flex line so the footnote
> rhythm holds). Inline prose links left as they were.

Check ran to completion, uninterrupted. **U-1 is complete: desktop + mobile + check.**

## From its notes file (`claude-design-notes.md`) — facts the chat comment did not carry

- **Steps 1–2 load `world-atlas@2.0.2 countries-110m` via CDN** (d3-geo, Mercator). At apply this
  becomes a runtime third-party fetch unless the topojson is self-hosted — self-host it.
- **Marker coordinates:** hospital 10.727275, 76.710507 — taken from the live page's own Google
  Maps links (source-derived, fine). **CJB (11.0297, 77.0434) and COK (10.152, 76.401) came from
  its web search** — numbers not supplied by the owner and not on the live page. Geodata, not a
  price/date/phone, but still unsupplied → verify or `[TO CONFIRM]` at apply.
- The exported desktop file still matches `openstreetmap|tile.|leaflet` somewhere — it dropped
  Leaflet, so this is likely a comment or the notes text; **verify at apply that no tile request
  fires at runtime.**
- Its Codex asks: (a) download `mpas.jpg` and other live banner assets into `assets/img/`;
  (b) tile provider decision for steps 3–4 or keep as diagrams; (c) supply/commission the grounds
  plan; (d) a higher-resolution Kerala outline if 110m is too coarse at step 2.
- Head contract is **verbatim from live** (unlike T17/T3/T2). Register check clean.
- Downloaded 2026-09-22 from `Kairali Healing Village Redesign (8).zip`.
