# Prompt for Claude Design — T04 Knowledge/Explainer, completion drop

*Paste everything below the line into Claude Design. It is written to be self-contained.*

---

## What this is

You are completing a page-template family for **Kairali — The Ayurvedic Healing Village**
(ayurvedichealingvillage.com), a NABH-accredited Ayurvedic hospital in Palakkad, Kerala. The site
is being rebuilt template family by template family. You already delivered the **desktop** template
for the Knowledge/Explainer family on 19 Sep 2026 and the owner approved it. This drop completes it.

**Deliver one zip, fully self-contained.** The previous drop's structure worked and is the target
shape — repeat it, with the additions listed under "What's new in this drop".

## What you are completing

| | status |
|---|---|
| Desktop template @1440 | **delivered and approved** — do not redesign it |
| Mobile template @390 | **MISSING — the main ask.** The site is ~80% mobile |
| Route states drawn | 3 of 11 (`isNew`, `isLong`, `isShort`) |
| Route states needed | **all 11 — see the table** |
| Content model | **not declared — the second main ask** |

## The routes, with their real measured content

These are live pages; the copy is verbatim and stays. Counts are from the rendered page and
**include the shared chrome** (header + footer ≈ 440 words), so subtract that for body length.

| route | words | h2 | h3 | list items | images | state in your drop |
|---|---|---|---|---|---|---|
| `/new-to-ayurveda/` | 1092 | 3 | 11 | 32 | 14 | `isNew` ✓ |
| `/learn-about-ayurveda/` | 1160 | 4 | 2 | 4 | 10 | `isLong` ✓ |
| `/learn-more-about-ayurveda/` | 527 | 2 | 0 | 4 | 10 | `isShort` ✓ |
| `/why-get-training-in-ayurveda/` | 1099 | 3 | 3 | 44 | 9 | **needed** |
| `/new-to-yoga/` | 1060 | 3 | 15 | 28 | 15 | **needed** |
| `/what-is-ayurvedic-food/` | 997 | 3 | 5 | 20 | 9 | **needed** |
| `/what-is-panchkarma/` | 768 | 3 | 4 | 23 | 9 | **needed** |
| `/live-to-100-with-panchkarma/` | 737 | 3 | 3 | 26 | 10 | **needed** |
| `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/` | 730 | 3 | 3 | 26 | 10 | **needed** |
| `/ayurvedic-resturant-and-cooking-at-healing-village/` | 698 | 4 | 6 | 18 | 10 | **needed** |
| `/ayurveda-retreats-for-everyone/` | 696 | 4 | 5 | 18 | 10 | **needed** |

The extremes you already bracketed (a structured page, a wall of prose with zero lists, a stub with
the contents rail suppressed) still hold. The eight new ones sit inside that range except for
**44 list items** and **15 h3s**, which are heavier than anything currently drawn — please make
sure the rail and the list rhythm survive those two.

## What's new in this drop — read this part twice

### 1 · Mobile @390, for every state
Same eleven routes. The desktop decisions below are inherited, not re-opened. Say explicitly what
the contents rail becomes on mobile (it cannot be a sticky side rail at 390) and what happens to
the closing card block.

### 2 · A declared CONTENT MODEL — the thing that unblocks the build
Your template will not ship as eleven copies. It ships as **one renderer over a dataset**: the site
serves 131 routes from a single view whose logic dispatches to per-family render modules, each
reading a `<family>-data.js`. So I have to turn your design into code that renders *any* of these
eleven routes from data.

For that I need you to declare, in a file called `CONTENT-MODEL.md`:

- **Every block type** the family uses — hero, contents rail, h2 section, h3 subsection, paragraph,
  bullet list, numbered list, definition list, figure + caption, pull quote, FAQ item, glossary
  item, index group, closing card, consultation CTA, … — with the fields each one carries.
- **Which parts are per-route variable and which are fixed** for the whole family.
- **What happens when a block is absent** (a route with no FAQ, no figures, one paragraph). The
  stub route already proves the rail suppresses; do the same for every other optional block.
- **Ordering rules** — is block order free, or fixed per section type?
- **Any count thresholds** where the layout changes (e.g. "a rail appears above N sections",
  "lists over N items switch to two columns").

Prose is fine. It does not need to be JSON. It needs to be unambiguous.

### 3 · Keep the review switcher, but isolate it
The tab strip that flips between route states is genuinely useful for review — keep it, but keep it
**clearly separable**, in its own `<sc-if>` / wrapper with a comment, so it can be removed for
production in one deletion. In the last drop it was woven into the logic's `renderVals()`.

## Hard constraints — non-negotiable

**Register (this is a hospital, not a resort).** Required vocabulary: patient, physician,
treatment, programme, Panchakarma, admission, discharge, consultation. **Banned in any wording you
author: spa, resort, holiday, luxury, cure, journey, guests.** The existing live copy violates this
in places — **leave those violations exactly as they are** and list them; they are the owner's to
fix, not yours. Never invent a fact, a price, a phone number or a claim.

**Chrome is frozen.** `AHV Chrome Header.dc.html` and `AHV Chrome Footer.dc.html` are byte-identical
across families and must not be edited. Include them in the zip unchanged, and **include the images
they reference** — `kairali-colorful-logo.png` and `ktahv-logo-white-brand.svg`. A previous drop
bundled the chrome HTML but not its images and four slots rendered broken.

**Inherited desktop decisions — carry them into mobile, don't revisit:**
- Type: Marcellus (display) + Mulish (body). **This family's type scale is the reference four other
  families inherit from** — treat it as the system, not a one-off.
- Body ≥17px at ≥1.6 line-height. Every tap target ≥44px. AA contrast.
- Global `*,*::before,*::after{box-sizing:border-box}` reset — keep it; without it the consultation
  band overflowed the viewport by 34px.
- Forest green is an **inline link colour only**. The owner dislikes dark green as a surface. The
  closing band is a white card with a bronze rule, not a forest block.
- Section rules `#EAE3D2`; every h2 opens on the same hairline.
- Audience skews 45+/55+: **no hover-only disclosure, no autoplaying carousels, no auto-loading
  embeds.** Click-to-play only.
- No horizontal overflow at any width. This site already has a 1024px sideways-scroll defect in the
  template you are replacing — do not reproduce it.

## What the zip must contain

```
T04-KNOWLEDGE-EXPLAINER-COMPLETION/
  AHV Template Knowledge Explainer Desktop.dc.html   updated: 11 states, switcher isolated
  AHV Template Knowledge Explainer Mobile.dc.html    NEW
  AHV Chrome Header.dc.html / AHV Chrome Footer.dc.html   unchanged, byte-identical
  support.js
  assets/img/…                     every image referenced, including the two chrome logos
  CONTENT-MODEL.md                 NEW — see section 2
  ASSET-MANIFEST.json              every contained file + every required-but-absent asset
  notes/
    knowledge-explainer-family-qa-harness.html   runAll() → assertions per route state
    knowledge-explainer-family-page.md           head contracts, register flags, open gaps
    handover.md                                  what changed since the 19 Sep drop, and why
```

**Self-containment is a claim you must test, not state.** Serve the folder over HTTP, open every
route state at 1440 **and** 390, and report: console errors, network 404s, and that every `<img>`
returns `naturalWidth > 0`. The only acceptable external request is the Google Fonts stylesheet.

**The QA harness is the contract.** Extend it to cover all eleven states at both widths with real
asserted counts (rail links, headings, list items, figures, CTAs), plus the standing assertions:
0 dead hrefs, no horizontal overflow, body ≥17px/≥1.6, every target ≥44px. Report `runAll()` as
`N pass / 0 fail`. If you add or remove a control, change its expected number in the same drop.

## Open questions you should answer in `notes/handover.md`

1. `/learn-about-ayurveda/` is served `noindex` with no canonical yet appears in the live XML
   sitemap. Does it get the same template treatment as the indexed pages?
2. The stub route suppresses the contents rail. At what word or section count does the rail appear?
3. On mobile, what replaces the sticky contents rail — and is it present on every route or only the
   long ones?
