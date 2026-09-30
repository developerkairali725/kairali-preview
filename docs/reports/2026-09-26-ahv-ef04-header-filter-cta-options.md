# EF-04: header, filter and CTA options for the owner's choice

2026-09-26 12:20:17 IST · Claude CLI worker · task WOPS-AHV-FINAL-DRAFT-20260924-001 · branch codex/ahv-final-draft-20260924 @ 38f0f280

**Status: OPTIONS ONLY. Nothing in the header, filter or CTA layout has been changed.** This file is here so the owner can choose one. The only header change made is EF-04a (details below). It is a label change, not a layout change.

## What was measured, and how

- **Tool:** `tools/ux-measure-sticky.mjs`, run with Playwright **Chromium emulation** against a local `next start` of this branch's build from 25 Sep. Viewports: 360×640, 390×844, 430×932 (mobile, touch) and 1440×900.
- **Where the output is:** `ux-evidence-20260926/sticky-measure.json`, plus top and scrolled screenshots at 360 and 390.
- **What was not tested:** this was not a physical iPhone or WebKit test. Keyboard, focus and RTL behaviour of the options below were not tested either, because none of the options has been built.
- **Cookie notice:** left out of the numbers. It is a one-time overlay, and dismissing it for good is the visitor's choice.

Share of the screen covered by persistent chrome after scrolling (fixed or sticky bars that span most of the width):

| Page type | 360×640 | 390×844 | 430×932 | 1440×900 | What stays on screen |
|---|---|---|---|---|---|
| Programme finders: /ayurvedic-treatments/, /all-programs/, /yoga-meditation-programs/ | **55%** (351 px) | 42% | 38% | 37–45% | Header 64 + "Find a programme" filter 235 + Call/Enquire/Free Consult bar 52. Desktop: header 73 + filter 261–333. |
| Home | 18% | 14% | 13% | 8% | Header 65 + CTA bar 52 |
| Programme detail (e.g. /ananda-lahari-…/), article family (e.g. /alcohol-free/), /gallery/, /contact-us/ | 10% | 8% | 7% | 8% | Header only. **No CTA bar.** |
| /offers/ | 13% | 10% | 9% | 8% | The **primary header scrolls away**. A fixed "On this page" bar (86 px) replaces it. No CTA bar. |
| /knowledge-centre/ | 23% | 17% | 16% | 6% | "On this page" bar (146 px at 360) |
| /faqs-and-downloads/ | 0% | 0% | 0% | 0% | Nothing sticky |

What the numbers mean:

1. **The owner's report is confirmed on the finder pages.** On a short phone, more than half the screen is chrome. The filter alone is 235 px, and it also sticks on desktop.
2. **The CTA policy is inconsistent.** The Call/Enquire/Free Consult bar shows on home and the finder hubs. It does not show on programme detail pages, where the visitor actually decides.
3. **Pages already disagree with each other.** /offers/ already uses a "primary yields to secondary" pattern. The article family (120 routes) uses an inline, non-sticky "In this section ▾" dropdown. The finders keep everything sticky at once.

Two side observations. Neither has been fixed. Both are for the owner and the release QA:

- The Priya chat bubble ("P") can sit on top of the cookie notice's first button. This was seen in RTL at 390.
- Arabic screenshots from the 25 Sep local build still show English CTA and cookie labels. Those units now have accepted Arabic translations (`t_de20e849879a9d0e1fb0`, `t_3649d8010496a5f13c27`, `t_3e86b1723088cc27e858`, `t_a2d285b352873457207a`). This must be re-verified on the final build. It is not claimed as fixed.

## The three options

The budget is worst case after scrolling, at 360×640.

### Option A: compact primary header, one contextual row, filter drawer (recommended)

- **Header:** the primary header stays sticky at about 56–64 px. Menu, language, Book Now and the EF-04a "Yoga & Training" label stay reachable everywhere.
- **Contextual row:** below the header, **one** sticky row of at most 48 px:
  - on finders, "Filters (n) ▾", the search icon and the ₹ $ € currency chips;
  - on family pages, "In this section ▾" or a single-line row of family chips that scrolls sideways.
- **Filter drawer:** the full filter set moves into a bottom sheet on mobile and a side sheet on desktop. It has a focus trap, closes on Escape, returns focus to the button, and opens from the inline-end side in RTL. Active filters show as a count and as removable chips.
- **Budget:** 64 + 48 + 52 = 164 px, about 26%. That is down from 55%.
- **Pros:**
  - No motion that depends on scroll direction, so no scroll jumps (a stated acceptance criterion).
  - One shared component covers finders, families and /offers/.
  - Primary navigation never disappears.
- **Cons:**
  - Filter choices are one tap away instead of always visible, so the active-count chip is essential.
  - Moderate build: one shared row, a drawer, and the finder rewired to it.
  - Every change touches the shared component, so the whole regression suite has to run.

### Option B: primary header scrolls away, secondary stays sticky

- **Behaviour:** on scroll down, the primary header hides and the secondary row (family chips or a compact filter) sticks at the top. Scrolling up brings the primary header back. /offers/ already does part of this.
- **Budget scrolled down:** 48 + 52 = 100 px, about 16%.
- **Pros:** the most reading space.
- **Cons:**
  - The motion depends on scroll direction. That is the main source of "scroll jumps", especially with the iOS Safari address bar resizing the viewport.
  - Needs reduced-motion handling and re-computed `scroll-margin-top` for every anchor link. Both offsets change.
  - Book Now and the menu are hidden while reading.
  - The hardest to make robust before launch.
- **Verdict:** not recommended before launch.

### Option C: inline family navigation (nothing sticky except the header)

- **Behaviour:** only the primary header and the CTA bar stay on screen.
  - Family navigation sits inline at the top of the page, like the article family's "In this section ▾" does today. It repeats as "More in this section" at the end.
  - Finder filters sit in the page flow and are not sticky. A small "Refine ↑" button takes the visitor back to them.
- **Budget:** 64 + 52 = 116 px, about 18%.
- **Pros:**
  - The simplest and lowest-risk build.
  - Already the pattern on 120 article routes.
- **Cons:**
  - On long finder lists the active filters are out of sight, so a filter summary line is needed.
  - Sibling pages are not visible mid-page.
- **Verdict:** the safest pre-launch fallback if Option A cannot be built and QA'd in time.

## CTA policy (applies to whichever option is chosen)

- **Mobile:** use one bottom bar, Call · Enquire · Free Consult (52 px plus `env(safe-area-inset-bottom)`), on **every** guest-facing page. That includes programme detail, article, gallery and offer pages.
- **Where the bar is hidden:**
  - on form and flow pages (enquiry, online consultation, booking, confirmation), where it would compete with the form's own submit button;
  - while the on-screen keyboard is open.
- **Offer pages:** the page's own specific CTA ("Enquire about this offer") replaces the generic Enquire slot. It does not stack a second bar.
- **Desktop:** no bottom bar. Book Now stays in the header, and CTAs stay inline in the page.
- **Chat bubble:** the Priya chat bubble sits above the bar and never covers the consent buttons or the bar's targets.
- **Destinations and tracking:** the bar keeps its current destinations (tel, /enquiry-form/, /online-consultation/) and its existing `data-cta` hooks. No change to tracking or consent logic (HARD GATE 11).

## Testing required before closing EF-04 (not yet done)

- **Viewports:** 360×640, 390×844, 430×932, iPhone WebKit, and 1440 desktop.
- **Keyboard:** open and close the drawer, Escape, return of focus, tab order.
- **RTL:** Arabic mirroring of the drawer and chip rows.
- **Stability:** no overlapping bars, and no scroll jump when anchor links are followed. Anchor offsets are checked against the new sticky height.
- **Localization:** all 13 locales, using the longest labels (DE and RU) and CJK text.

## EF-04a: the header label (done in source; rendered check still pending)

- **The defect:** the only primary-navigation instance of the long label "Yoga–Dhyāna Abhyāsa — Yoga & Meditation Training" was the homepage **desktop** header (`public/ahv/views/home-hi-fi-v4.json`, inside `<header><nav>`).
- **The fix:** that one label now reads **"Yoga & Training"**, and the destination (/yoga-meditation-training/) is unchanged. The shared chrome header (both copies) and the mobile drawer already used "Yoga & Training". A scan of the `<header>` region in all views found no other long label.
- **What was deliberately not touched:** the programme's full name in body cards, footers and page copy. That is content, not the header label.
- **Translations:** the short label is the same unit as the shared header, which is already translated. So no new translation is needed, and the translated labels stay short.
- **Still open:** the rendered check (desktop and mobile, hosted) comes with the next build.
