# Past-retreat record template (family: retreats & events already held) — Desktop

Built 22 Sep 2026. Design route: `/karma-being-retreat-2019/`.
File: `AHV Template Past Retreat Record Desktop.dc.html`.
Source of truth: `data/family-04/hist9/karma-2019.json` (route kit, `PREPARED_NOT_DISPATCHED`,
sourceRecordSha256 3a342f15…; matches frozen-content-lock record `records/en/karma-being-retreat-2019.json`,
sourceSha256 1e413d9c…). Body ported verbatim from that kit — no rewriting.

## Pastness treatment (the design problem)
1. Breadcrumb ends in the archive chain: Home / News & Past Events / Past Retreats / <page>.
2. Hero record card, right of the H1: "PAST RETREAT" label, year in Marcellus 44px, the date
   range, and "Concluded. Not open for admission."
3. Governed historical notice band (sand, full width) immediately under the image band —
   verbatim `copy.historicalNotice` from the kit.
4. Section-level notice on the travel notes, verbatim from the kit.
5. No enquiry or signup affordance anywhere in the body — the only calls to action on the page
   are in the fixed closing block, which points at current programmes.

## Head contract (verbatim from the kit, for Codex)
- title: `Karma Being Retreat | Ayurvedic Remedies | Yoga Therapy`
- description: `This section deals with the Karma Being Retreat, a ten-day schedule of yoga and Ayurvedic remedies at The Ayurvedic Healing Village.`
- canonical: `https://ayurvedichealingvillage.com/karma-being-retreat-2019/`
- robots: `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`
- og: locale en_US · type article · title `Karma Being Retreat 2019` · same description · url self ·
  siteName `Ayurvedic Healing Village` · modifiedTime `2025-03-26T09:32:13+00:00` ·
  og:image `https://ayurvedichealingvillage.com/wp-content/uploads/2023/11/our-story.png` 1440×524 image/png
- twitter: summary_large_image · htmlLang en-US

## Omissions carried from the kit ledger (not my decision)
Expired price table (66–72), Terms & Conditions (99–104), Quick Enquiry (33), sign-up line (111),
stale "Side Tour / Watch this Space" (97–98), empty paragraphs. Full source retained in the kit.

## Drafted content (inline, marked "DRAFT — approve or replace")
- Hero standfirst: "A record of a retreat held at the hospital in November 2019, kept for reference."
  Nothing else on the page is mine. The "In this record" rail and figure captions
  ("2019 record photograph") are navigation/labels, not source copy — flag if you want them gone.
- "Historical travel notes" carries a DERIVED LABEL chip: the kit marks this heading `derivedLabel: true`
  (it is not a live heading).

## Register-violation flags (brand §12.2) — all inside verbatim source copy, left untouched
- "journey" ×3 (intro para 1; "Ayurvedic Healing Journey"; teacher quote "roller coaster that is life" adjacent).
- "Spa Treatment" / "extra spa treatments" — 24th November block.
- "resort" — "Fragrant Nature Retreat & Resorts Pvt Ltd." (visa local-contact address).
- "guests" — none. "luxury" — only in the fixed closing block's award name (proper noun, allowed).
- Whole body is retreat/hospitality register, not clinical. It is historical SEO copy; my read is
  leave it. Say the word if the owner wants a register overlay instead.

## Images (5 in the kit, 4 placed)
- hero band: `assets/img/article/our-story.png` — this is the kit's hero (`our-story.png`, 1440×524,
  ee7d129f…), already self-hosted in the project. **Codex ask:** confirm the copy at
  `assets/img/article/` is byte-equal to the frozen original before wiring.
- intro pair: `assets/img/hist9/7088881a…jpg` (265×273), `assets/img/hist9/f44c0a7c…jpg` (265×273)
- after inclusions: `assets/img/hist9/1c2a20cc…jpg` (834×200) — capped at native width, never upscaled
- teacher: `assets/img/hist9/03ac8a89…jpg` (200×240)
- All local, no hotlinks, no crops, native ratios preserved.

## Link audit vs kit
- 19 related destinations reproduced in the source "About Us" grouping (h2 + four h3 groups), all
  rewritten to the apex `ayurvedichealingvillage.com` host per the kit's `href` field.
- Inline: "Kairali Ayurvedic Healing Village" → `/kairali-the-ayurvedic-healing-village/`;
  "Ayurveda" → `/ayurveda/`. Both RETAIN_INLINE_EXISTING_CANONICAL.
- Kit's third inline ("Accommodation" → `/our-villas/`) sits on an h4 heading in the travel notes.
  I left the heading unlinked. **Open gap — decide:** link the heading, or drop the mapping.
- Old "Enquire Now" inline: OMIT_HISTORICAL_SIGNUP, omitted.
- Plain-text external URLs in the visa/accommodation copy (indianvisaonline.gov.in, vinavisas.com,
  ayurvedichealingvillage.com) are left as plain text exactly as in source — not linked.

## Template behaviour at the content extremes
One line, as asked: **the two-column body grid is the only fragile part — at `/archive/` (156 words,
no images) the sticky "In this record" rail has almost nothing to list and leaves a tall empty left
column, so the rail must be suppressed below ~3 headings and the prose column re-centred; everything
else (hero card, image band, notice, closing block) holds at both extremes because each is
independently full-width and border-box.**

Secondary notes on the same problem:
- Pages with no image of their own still need the hero band (standing rule 2) — supply a library
  image per route; the band is not fed by body images.
- The year card degrades for undated routes (`/karma-being-retreat/`, `/lakshya-yoga-retreat/`):
  it needs an "Undated record" state rather than a blank Marcellus year. **[TO CONFIRM]** the label
  wording the owner wants there.
- The 14-item inclusions list is a 2-column grid; at 1–3 items it should fall to one column.

## Mobile view (AHV Template Past Retreat Record Mobile.dc.html, 390px)
Genuinely separate layout, not the desktop squeezed:
- Pastness is read before the title: a full-width ink strip at the top of content carries
  "PAST RETREAT · 2019" in bright gold with "Concluded. Not open for admission." The desktop's
  side record card has no mobile equivalent — this replaces it.
- Breadcrumb collapses to a single 48px back link ("‹ All past retreats").
- The "In this record" rail becomes a collapsed <details> jump list (tap, never hover).
- Photography goes full-bleed edge to edge (the intro pair becomes a stacked 240px strip, the
  montage runs the full width) with captions on sand — the images gain presence on the phone
  rather than shrinking.
- Inclusions drop to one column; the "About Us" related groups become four <details> accordions,
  source grouping preserved.
- Closing block buttons stack full-width at 52px.
- The file shows both the design route and the short extreme (/archive/, 156 words, no images)
  side by side; the extreme column uses the real /archive/ intro copy from
  data/family-04/article-five-rich.json and demonstrates the undated year-card state.

### Mobile strain note
One line: **the top ink strip is the only thing that can break — a route with both an undated
state and a long qualifier (e.g. "Karma Being Yoga and Ayurveda Retreat") pushes it to three
lines and shoves the H1 below the fold, so the strip must cap at two lines and the date range
move under the title when it does; everything below it is a single 18px column with full-bleed
images and collapses cleanly from 1,670 words to 156.**

## Line-length correction (22 Sep)
CSS `ch` units over-measure for Mulish: `max-width:66ch` renders ~80 real characters. All prose
caps were re-derived by measuring the font — body prose now 51ch (~65 real characters), hero
standfirst 48ch, closing-block paragraph 43ch (the brief's 56-character spec). Mobile columns are
354px wide and sit at ~42 characters, well inside the cap.

## Done-bar
- SEO head: contract recorded above, verbatim from kit (head not yet emitted in the DC — Codex wires it).
- Link audit: done vs kit, one open gap above.
- WCAG 2.2 AA: body 18px/1.7, min 16px anywhere, every link/target ≥44px, AA contrast
  (#2A2118, #514A3F, #75695A on #F7F4EA all pass), no hover-only disclosure, no motion.
- Viewport battle test: skipped per standing rules — Codex QAs widths.

## Open
- Mobile view not started; desktop awaits owner approval first (standing rule 4).
- Breadcrumb chain is the kit's `approvedParent` (`/archive-yoga-retreat/`), not URL hierarchy —
  supersedes the provisional rule for this route.
