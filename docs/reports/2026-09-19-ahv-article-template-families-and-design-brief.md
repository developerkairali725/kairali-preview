# AHV — the 129 non-programme pages, their template families, and the Claude Design brief

**Written:** 2026-09-19 17:42:05 IST
**Branch:** `codex/ahv-english-staging-20260915`
**Scope:** the 129 routes that currently render through the single shared view pair
`ahv-page-article-reader-desktop` / `-mobile`. These are the "about 120 odd pages" — everything
that is not the homepage, a programme/package page, a campaign, an enquiry/confirmation page,
a gallery or a policy page.
**Reason:** the owner has rejected the current design for these pages and is taking them back to
Claude Design, one template at a time.

---

## 1. The measurement

Every number below is read from the shipped datasets, not estimated.

- Site total: **252 active English routes**, **74 distinct desktop views**.
- Of those, **129 routes share ONE view** — the article reader. That is the design being replaced.
- The other 123 routes are the homepage, 8 campaign routes, 10 enquiry, 10 confirmation,
  9 gallery, 9 policy, 4 attractions, and ~66 owner-approved one-off pages (programmes, villas,
  courses, finders). **None of those are in scope here.**
- The 129 draw their content from 14 datasets under `public/ahv/assets/`. Those dataset names
  (`reader25a`, `hist9`, `utility7`…) are **import batches, not content families** — they tell you
  when a page was imported, not what kind of page it is. That is why the site looks like one
  template stretched over 129 unrelated things.

Content shape per route was measured by walking each dataset record: word count, image count,
list count, heading count, card-collection count.

---

## 2. The twelve families

All 129 routes are assigned. No route appears twice; none is unassigned.

| # | Family | Pages | Words (min–median–max) | Images | GSC clicks | GSC impressions |
|---|---|---:|---|---|---:|---:|
| T1 | **EXPLAIN** — knowledge / explainer article | 22 | 87 – 458 – 722 | 0–7 | 169 | 129,188 |
| T2 | **ENTITY** — group company / institution profile | 13 | 228 – 418 – 1,048 | 0–4 | 226 | 40,475 |
| T3 | **ABOUT** — institutional trust & people | 11 | 0 – 365 – 977 | 0–18 | 728 | 35,398 |
| T4 | **STANDARD** — on-property care standard | 8 | 71 – 342 – 595 | 1–2 | 160 | 12,716 |
| T5 | **EXPERIENCE** — excursion, attraction, on-property | 20 | 213 – 563 – 1,089 | 0–12 | 407 | 275,617 |
| T6 | **PRODUCT** — product & publication | 8 | 161 – 437 – 758 | 0–9 | 97 | 35,436 |
| T7 | **ARCHIVE** — past retreat / event record | 11 | 156 – 578 – 1,670 | 0–9 | 116 | 9,858 |
| T8 | **OFFER** — offer, deal & voucher | 6 | 64 – 67 – 808 | 0–5 | 78 | 15,351 |
| T9 | **INDEX** — collection index / hub | 9 | 0 – 77 – 733 | 0–38 | 160 | 147,406 |
| T10 | **TRAINING** — course & training information | 7 | 132 – 261 – 583 | 0–2 | 137 | 10,957 |
| T11 | **UTILITY** — system & leftover page | 9 | 1 – 248 – 486 | 0–7 | 143 | 14,108 |
| U | **UNIQUE** — needs its own template, one each | 5 | 660 – 794 – 2,308 | 0–3 | 536 | 55,794 |

Clicks/impressions are lifetime figures from the Search Console export in
`launches/ayurvedichealingvillage.com/baseline/raw/gsc-ui-export-2026-07-19{,-www}/Pages.csv`,
summed across the bare and `www` properties.

### The routes, family by family

**T1 EXPLAIN (22)** — teaches one idea and hands the reader to a doctor. Text-led, light imagery.
`/learn-about-ayurveda/` (722w) · `/why-pick-a-yoga-or-yoga-retreat/` (665w) ·
`/new-to-ayurveda/` (644w) · `/why-get-training-in-ayurveda/` (640w) · `/new-to-yoga/` (614w) ·
`/what-is-yoga/` (607w) · `/meditation/` (606w) · `/what-is-ayurvedic-food/` (543w) ·
`/ayurveda/` (505w) · `/kairali-ayurvedic-way-of-weight-management/` (464w) · `/panchakarma/` (458w) ·
`/new-to-yoga-teacher-training/` (382w) · `/learn-more-about-yoga/` (349w) ·
`/why-get-training-in-yoga/` (340w) · `/what-is-panchkarma/` (322w) · `/retreats-for-everyone/` (322w) ·
`/live-to-100-with-panchkarma/` (288w) · `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/` (280w) ·
`/ayurveda-retreats-for-everyone/` (215w) · `/yoga-and-ayurveda/` (167w) ·
`/yoga-retreats-for-everyone/` (154w) · `/learn-more-about-ayurveda/` (87w)

**T2 ENTITY (13)** — a sister company or institution of the Kairali group; ends by sending the
reader to that entity, not to a booking.
`/villa-raag/` (1,048w) · `/kairali-ayurvedic-centre/` (773w) ·
`/kairali-ayurvedic-products-pvt-ltd/` (697w) · `/kairali-ayurvedic-group/` (693w) ·
`/kairali-ayurvedic-equipment/` (582w) · `/kairali-institute-of-ayurveda-and-panchakarma-therapy/` (475w) ·
`/kairali-the-ayurvedic-healing-village/` (418w) · `/kairali-ayurvedic-treatment-center/` (382w) ·
`/arogya-shala/` (381w) · `/kairali-hospitality/` (376w) · `/arogya-kendra/` (343w) ·
`/brief-on-kairali/` (313w) · `/kair-by-kairali/` (228w)

**T3 ABOUT (11)** — highest-earning family on the site (728 clicks). Trust, people, credentials,
and two genuine recruitment pages.
`/social-responsibilities/` (977w) · `/ayurvedic-franchise/` (595w, **433 clicks**) ·
`/consultancy/` (380w) · `/social-cultural-environmental-commitment/` (374w) ·
`/internships-at-kairali/` (367w, **227 clicks**) · `/vision-and-mission/` (365w) ·
`/our-accolades/` (168w) · `/awards-and-accreditations/` (150w) · `/careers/` (150w) ·
`/founders-message/` (56w, 5 images) · `/our-story/` (0w, **18 images**)

**T4 STANDARD (8)** — "this is how the property is run". Short, principled, repetitive by design.
`/no-preservatives/` (595w) · `/no-smoking/` (593w, 111 clicks) · `/no-caffeine/` (520w) ·
`/animal-husbandry/` (342w) · `/alcohol-free/` (280w) · `/organic-farm/` (266w) ·
`/no-refridgeration/` (115w) · `/vegetarian/` (71w)

**T5 EXPERIENCE (20)** — 275,617 impressions, the largest impression pool in scope. Image-led.
`/things-to-do/` (1,089w) · `/things-to-do-in-property/` (693w, 11 img) · `/destination-palakkad/` (690w) ·
`/visit-kerala/` (675w) · `/village-facilities/` (668w, 12 img, **91,729 impressions**) ·
`/cultural-events/` (643w) · `/mountain-jeep-safari/` (642w) · `/wildlife-drive/` (575w) ·
`/ayurvedic-cuisine/` (564w, **153,070 impressions**) · `/things-to-do-in-kerala/` (563w, 11 img) ·
`/festivals/` (486w) · `/ayurvedic-herbal-tea/` (450w) · `/house-boat-tour/` (427w) ·
`/cooking-classes/` (369w, **147 clicks**) · `/elephant-safari/` (362w) · `/sightseeing/` (357w) ·
`/nature-walk/` (291w) · `/back-water-tour/` (271w) ·
`/ayurvedic-resturant-and-cooking-at-healing-village/` (218w) · `/experience/` (213w)

**T6 PRODUCT (8)** — describes products made by the group. **No cart, no checkout** — commerce is
Shopify and out of scope for this site.
`/ayurvedic-proprietary-organics/` (758w) · `/in-house-products/` (511w) · `/ayurvedic-products/` (498w) ·
`/product-range/` (437w, 9 img, 28,689 impressions) · `/books/` (410w) ·
`/ayurvedic-proprietary-medicines/` (395w) · `/butterfly-booklet/` (321w) ·
`/ayurvedic-classical-medicines/` (161w)

**T7 ARCHIVE (11)** — retreats and events that have already happened. Dated, photo-heavy, no
live booking. Must read as a record, not an offer.
`/karma-being-retreat-2019/` (1,670w) · `/karma-being-retreat/` (1,580w) ·
`/prav-simona-monsoon-yoga-retreat/` (1,340w) · `/food-sadhana/` (899w) ·
`/prav-simona-yoga-retreat/` (608w) · `/chef-retreat-food-to-wellness/` (578w) ·
`/katha-wellness-retreat-2019/` (494w) · `/lakshya-yoga-retreat-2017/` (450w) ·
`/lakshya-yoga-retreat-2018/` (319w) · `/lakshya-yoga-retreat/` (218w) · `/archive/` (156w)

**T8 OFFER (6)** — the owner has separately asked for **each offer to get its own landing page**
(handover item B7). Treat this family as the interim template until that decision lands.
`/offers/` (808w) · `/special-offers/` (394w) · `/gift-vouchers/` (67w) · `/ayurveda-offers/` (66w) ·
`/the-baoli-advert-box-deal/` (65w) · `/the-baoli-special-deal/` (64w)

**T9 INDEX (9)** — almost no prose, a lot of tiles. `/ayurveda-treatment/` is 40 words and
**38 images**. The template is a grid, not an article.
`/packages/` (733w, 29 img, 27 cards) · `/ayurvedic-links/` (302w) · `/yoga-and-meditation-package/` (209w) ·
`/ayurveda-package/` (98w) · `/map/` (77w) · `/virtual-tour/` (60w) · `/video-gallery/` (56w) ·
`/ayurveda-treatment/` (40w, 38 img) · `/gallery/` (0w, 4 img)

**T10 TRAINING (7)** — course information and fee tables. Tables are the hard part.
`/training/` (583w) · `/yoga-classes-practical/` (424w) · `/ayurveda-training/` (389w) ·
`/yoga-classes-theory/` (261w) · `/training-course-fees/` (255w, **67 clicks**) ·
`/yoga-therapy-individual/` (251w) · `/ayurveda-workshop/` (132w)

**T11 UTILITY (9) — DO NOT DESIGN THESE.** Six of the nine are leftovers from the old WordPress
site, not pages anyone meant to publish. They need a *decision* (noindex / 301 / leave), not a
Claude Design session. Two do earn clicks and belong elsewhere.
`/test-page-2/` (486w) · `/testing/` (373w) · `/how-to-reach-old/` (265w) · `/test-page/` (252w) ·
`/gift-test/` (6w) · `/my-account/` (1w) — **leftovers, owner decision needed**
`/givefeedback/` (248w) · `/read-feedback/` (80w, **130 clicks**) — real pages; fold into T3 ABOUT
`/search-results/` (33w) — functional; keep as-is until search is wired

**U UNIQUE (5)** — genuinely their own shapes, one template each.
- `/how-to-reach/` — 1,383w, 15 headings, **410 clicks, 39,534 impressions**, and now carries all
  four maps (India → Kerala → Palakkad → grounds plan). Nothing else on the site looks like it.
- `/faqs-downloads/` — 2,308w across **28 lists**. The longest page in scope. Needs grouped,
  collapsible Q&A plus a downloads shelf.
- `/sitemap/` — 794w across **36 link lists**. A directory, not an article.
- `/defence-and-paramilitary-forces/` — 673w, an audience-specific offer page with no imagery.
- `/revitalizing-and-strengthening-treatment-for-cancer-patients/` — 660w. **Clinical content:
  HARD GATE 7 — any wording change needs Dr. Deepu John's sign-off before it leaves staging.**

---

## 3. Recommended order

Ordered so that each template earns the next one — the early ones establish typography and card
rhythm the later ones inherit, and the highest-value pages are reached early.

| Order | Family | Pages | Why here |
|---|---|---:|---|
| 1 | T1 EXPLAIN | 22 | The reading spine. T2, T3, T4, T7 all inherit its typography — get it right once and five families are half-done. |
| 2 | T5 EXPERIENCE | 20 | 275k impressions. Sets the image/card rhythm T6 and T9 inherit. |
| 3 | T3 ABOUT | 11 | Most clicks in scope (728), incl. `/ayurvedic-franchise/` at 433. |
| 4 | T2 ENTITY | 13 | Inherits T1 typography; adds the "go to that entity" ending. |
| 5 | U UNIQUE ×5 | 5 | `/how-to-reach/` alone is 410 clicks. Five separate small sessions. |
| 6 | T9 INDEX | 9 | 147k impressions; pure grid, fast once T5's cards exist. |
| 7 | T4 STANDARD | 8 | Trivial once T1 exists. |
| 8 | T6 PRODUCT | 8 | Inherits T5 cards. |
| 9 | T10 TRAINING | 7 | Tables are the only new problem. |
| 10 | T7 ARCHIVE | 11 | Low traffic, but 11 pages for one template. |
| 11 | T8 OFFER | 6 | Hold if the "each offer its own landing page" decision is imminent. |
| 12 | T11 UTILITY | 9 | **Decide, don't design.** |

---

## 4. How the work actually splits

This matters, because it determines what to ask Claude Design for.

The site does not render React pages. Every one of the 252 routes renders through **one** server
component (`app/(english)/_families/design-view.tsx`), which mounts a compiled **Claude Design view**
(`.dc.html` → JSON payload in `public/ahv/views/`) and feeds it a **dataset record** from
`public/ahv/assets/`. A "template" here is one desktop view + one mobile view, data-bound.

So:

- **You + Claude Design** design **one representative page per family**, filled with that page's
  **real** content, desktop and mobile. You are designing a *page*; you do not need to think about
  data binding at all.
- **I** convert the approved design into the data-bound desktop/mobile view pair, re-point that
  family's routes at it, re-run the 20-step repair chain, sweep all routes for render failures,
  JS errors, horizontal overflow and broken images, and re-prerender so crawlers read the new markup.

Which means the one thing a design must survive is **content variance**. The template will be
handed pages far shorter and far longer than the one you designed against. Section 5 makes that
an explicit instruction, with the measured extremes per family.

---

## 5. THE PROMPT FOR CLAUDE DESIGN

Paste **Part A** once at the start of each new Claude Design session, then paste the **Part B**
block for the family you are working on. One family per session.

### Part A — the standing brief (same every time)

```
You are designing ONE page template for Kairali — The Ayurvedic Healing Village
(ayurvedichealingvillage.com), an NABH-accredited Ayurvedic hospital in Palakkad, Kerala,
run by a family practising Ayurveda since 1908.

This is a HOSPITAL, not a hotel. The register is clinical and calm.

BANNED WORDS — never use these, in any casing, in any sentence I have not given you:
  spa, resort, holiday, luxury, cure, journey, guests
Use instead: patient, physician, treatment, programme, Panchakarma, admission,
discharge, consultation. (Where an award's official name contains a banned word,
keep the award name exactly — it is a proper noun. Never introduce one yourself.)

WHAT I AM ASKING FOR
One page, designed twice: a desktop version (1440px wide) and a mobile version
(390px wide). It must be a TEMPLATE — roughly 20 other pages of the same kind will
be poured into this exact layout, so it has to hold up at the content extremes I
give you below, not just at the one example.

WHAT IS ALREADY FIXED — DO NOT REDESIGN THESE
1. The site header and the site footer. They are shared with pages the owner has
   already approved. Draw them as a plain grey placeholder bar (72px tall at the top,
   ~620px block at the bottom) and design only what sits between them.
2. The closing trust + call-to-action block. Every page ends with it, exactly as
   specified at the end of this brief. Reproduce it; do not restyle it.

BRAND
  Headings      Marcellus, serif, weight 400 (never bold)
  Body          Mulish, sans-serif, 18px, line-height 1.7
  Page canvas   #F7F4EA (warm cream)
  Ink           #2A2118
  Muted text    #75695A   Secondary ink #514A3F
  Gold          #C1882C   Bright gold (buttons) #EEB41E   Deep gold #5A4420
  Kairali green #006038   (all body links; hover #004226)
  Rules/borders #E9E2D3   Sand fills #E0D7C4 / #C9BFA8
  Eyebrow line above every H1, in #8F6212, 12.5px, uppercase, 2.6px letter-spacing:
    "Kairali — The Ayurvedic Healing Village · Since 1908"
  Corner radius 4px. No drop shadows on content. No gradients except very faint
  paper texture. Photography is warm, real and unstyled — no stock-looking imagery.

HARD LAYOUT RULES (these have already broken this site once each)
  - Body text line length capped at 66 characters. Do not run prose the full width.
  - Content column: min(1220px, 94%) centred on desktop.
  - Every tappable thing is at least 44x44px. Buttons are 52px tall.
  - Nothing may scroll sideways at 360px wide. Every full-width block must be
    border-box.
  - Mobile is a genuinely different layout, not the desktop squeezed. Design it.
  - Respect prefers-reduced-motion; no autoplaying movement.
  - Headings go h1 → h2 → h3 with no skipped level. Exactly one h1.

FACTS — never invent, never substitute
  Email        info@kairali.com
  WhatsApp     +91 92898 38797  (link: https://wa.me/919289838797)
  Consultation https://ayurvedichealingvillage.com/online-consultation/
  Enquiry      https://ayurvedichealingvillage.com/enquiry-form/
  If you need a price, a distance, a date or a phone number I have not given you,
  leave a visible [TO CONFIRM] marker. Do not fill the gap with a plausible number.

THE FIXED CLOSING BLOCK (reproduce exactly, at the end of the page)
  A full-width band on white with a faint gold hairline texture, 1px #E9E2D3 rules
  top and bottom, 56px above it. Inside, centred, max 760px:
    - Four trust items in a two-column grid, each prefixed by a gold diamond
      character in #C1882C:
        NABH Certified Hospital
        118+ Years Heritage
        Individualised Programmes
        World Luxury Award Winner
    - h2 in Marcellus 26px: "Not sure which programme fits?"
    - One paragraph, 16.5px, #514A3F, max 56 characters per line:
      "Share your goal in your own words — the patient care team or an Ayurvedic
      doctor will point you to the right programme."
    - Three buttons in a row (wrapping on mobile), each 52px tall, 4px radius,
      700 weight, 14px, uppercase, 1.5px letter-spacing:
        1. "Free Doctor Consultation" — solid #EEB41E, text #2A2118
        2. "WhatsApp Patient Care"    — outlined 1.5px #006038, text #006038
        3. "Enquire Now"              — outlined 1.5px #5A4420, text #5A4420

WHAT I NEED BACK
  - The desktop design and the mobile design.
  - A one-line note on any place where the layout would break if a page in this
    family had much more, or much less, content than the example.
  - Nothing published. I am taking the design away and wiring it up myself.

Confirm you have this, then wait — I will send the specific page in my next message.
```

### Part B — one block per family

Paste the matching block as the second message. Each names a **benchmark page** to design
against and the **measured extremes** the layout must survive.

---

**T1 — EXPLAIN (22 pages)**
```
Family: knowledge / explainer article. A reader who does not yet know what Ayurveda,
Panchakarma, yoga or Ayurvedic food is, arriving from search, deciding whether this
hospital is for them.

Design against: /new-to-ayurveda/  — 644 words, 6 images, 8 lists, 12 headings.

The layout must also hold at these extremes, both of which are real pages in this family:
  - LONGEST:  /learn-about-ayurveda/  — 722 words, only 2 images, ZERO lists.
               An unbroken wall of prose. Show me how it stays readable.
  - SHORTEST: /learn-more-about-ayurveda/ — 87 words, 2 images, zero lists, no
               sub-headings. Show me how the page does not look empty or broken.

It needs: breadcrumb · eyebrow · h1 · a standfirst line · the article body with real
rhythm between prose, sub-headings, bulleted lists and inline images · and a way for
the reader to move to the next related explainer. Then the fixed closing block.

This is the first template and the most important one: four other families inherit
its typography. Spend the effort on how text breathes.
```

**T2 — ENTITY (13 pages)**
```
Family: profile of one company or institution inside the Kairali group — the
pharmacy, the equipment works, the hospitality arm, the training institute,
Villa Raag, Arogya Kendra, Arogya Shala.

Design against: /kairali-ayurvedic-products-pvt-ltd/ — 697 words, 4 images, 5 lists,
13 headings, 3 card groups.
Extremes: /villa-raag/ (1,048 words, 8 lists) and /kair-by-kairali/ (228 words).

Difference from T1: this page ends by sending the reader TO THAT ENTITY — its own
site or its own contact — not to a hospital consultation. Keep the fixed closing
block, but add an entity-specific link block above it.

It needs: a way to say what the entity is in one line, what it makes or does, where
it sits in the group, and how to reach it. Several of these entities are separate
legal companies; the design must not imply the hospital sells their products.
```

**T3 — ABOUT (11 pages)**
```
Family: institutional trust — story, founders, vision, accreditations, social
responsibility — plus two recruitment pages that earn real traffic
(/ayurvedic-franchise/, 433 clicks; /internships-at-kairali/, 227 clicks).

Design against: /internships-at-kairali/ — 367 words, 4 images, 7 lists, 10 headings.
Extremes, and they are violent:
  - /social-responsibilities/ — 977 words, 10 lists
  - /our-story/               — ZERO words, 18 images. A photo essay with no prose.
  - /careers/                 — 150 words, NO images at all.
The same template has to carry a wall of text, a wordless gallery, and a bare
paragraph. That is the whole design problem here.

Two of these pages ask the reader to apply for something. Those need a clear
application path (email info@kairali.com) that does not fight the fixed closing block.
```

**T4 — STANDARD (8 pages)**
```
Family: one house rule of the property, explained — no smoking, no alcohol, no
caffeine, no preservatives, no refrigeration, vegetarian only, the organic farm,
the animal husbandry.

Design against: /no-preservatives/ — 595 words, 2 images.
Extremes: /vegetarian/ (71 words, 1 image) and /no-refridgeration/ (115 words).

These are short, principled statements. They should feel like a quiet promise, not a
list of prohibitions. All eight pages look nearly identical in structure, so the
template must make a 71-word page feel deliberate rather than unfinished.

They should also cross-link to each other — a reader on one usually wants the others.
```

**T5 — EXPERIENCE (20 pages)**
```
Family: what a patient can do outside treatment hours — the grounds, the kitchen,
Kerala itself, excursions, festivals. 275,617 impressions, the biggest search
surface in this set.

Design against: /village-facilities/ — 668 words, 12 images, 7 lists, 10 card groups.
Extremes: /things-to-do/ (1,089 words but only 5 images and ZERO lists) and
/experience/ (213 words, NO images).

This is the image-led template and it sets the card and gallery rhythm that two
later families inherit. It needs a card pattern that works at 1 card, at 10, and at
none — several pages in this family have no imagery at all.

Register caution: these pages are the most likely to drift into holiday language.
They describe what is available to a patient during a stay at a hospital.
```

**T6 — PRODUCT (8 pages)**
```
Family: products the group manufactures — classical medicines, proprietary
medicines, organics, herbal tea, books, the in-house range.

Design against: /product-range/ — 437 words, 9 images, 7 card groups.
Extremes: /ayurvedic-proprietary-organics/ (758 words, ZERO images) and
/ayurvedic-classical-medicines/ (161 words).

CRITICAL: there is NO cart, NO price, NO checkout and NO "buy" button on this site.
Selling happens on a separate store. These pages describe and then point onward.
Do not design commerce UI.

Several of these are medicines. Nothing may read as a health claim or a promise of
outcome.
```

**T7 — ARCHIVE (11 pages)**
```
Family: retreats and events that have ALREADY HAPPENED — 2017, 2018, 2019 yoga
retreats, Food Sadhana, the chef retreat.

Design against: /karma-being-retreat-2019/ — 1,670 words, 9 images, 13 headings.
The longest pages in this whole set.
Extremes: /archive/ (156 words, no images) and /lakshya-yoga-retreat/ (218 words).

The design problem: these must read unmistakably as a RECORD of something past, so
nobody tries to book one, while still showing the photography off. A visible date or
year treatment is essential. The fixed closing block still applies — the reader
should be pointed at current programmes instead.
```

**T8 — OFFER (6 pages)**
```
Family: current offers, deals and gift vouchers.

Design against: /offers/ — 808 words, 5 images, 4 card groups.
Extremes: /the-baoli-special-deal/ and /the-baoli-advert-box-deal/, both about
64 words with 5 short lists — almost nothing to work with.

Every price, date, inclusion and validity window is a fact I will supply. Mark
anything you need as [TO CONFIRM]; never invent an amount or an expiry.

Note: the owner may split these into individual landing pages later. Design the
template so one offer alone fills the page respectably.
```

**T9 — INDEX (9 pages)**
```
Family: a grid of links out to other pages — package index, treatment index,
photo gallery, video gallery, virtual tour, map, link directory.

Design against: /packages/ — 733 words, 29 images, 27 cards.
Extremes: /ayurveda-treatment/ (40 words and 38 images — almost pure grid) and
/gallery/ (ZERO words, 4 images).

This is NOT an article template. It is a directory. Prose is incidental; the tile is
the unit. It needs to look composed at 4 tiles and at 38, and to survive tiles whose
labels are one word or twelve.
```

**T10 — TRAINING (7 pages)**
```
Family: course and training information, including the fee schedule
(/training-course-fees/, 67 clicks).

Design against: /yoga-classes-practical/ — 424 words, 2 images, 9 lists, 12 headings.
Extremes: /training/ (583 words) and /ayurveda-workshop/ (132 words, 7 lists).

The hard part is TABLES: course fees, durations, schedules. Show me a table that is
readable on a 390px phone without sideways scrolling — that is the single thing this
template is for. Dense, quiet, easy to compare down a column.

Fees are facts I will supply. [TO CONFIRM] for anything I have not given you.
```

**U — the five one-offs** (one session each)
```
/how-to-reach/  — 1,383 words, 15 headings, 410 clicks, 39,534 impressions. Carries
   four maps: India → Kerala → Palakkad → the grounds plan, in that zoom order, plus
   directions by air, rail and road. Design the maps as a stepped sequence, and make
   the whole thing work on a phone in a moving vehicle.

/faqs-downloads/ — 2,308 words across 28 lists. The longest page on the site. Needs
   grouped, collapsible questions with a way to jump between groups, plus a separate
   downloads shelf. Must be searchable by eye.

/sitemap/ — 794 words across 36 link lists. A directory of the whole site. Scannable
   columns, clear grouping, nothing decorative.

/defence-and-paramilitary-forces/ — 673 words, NO images. An offer aimed at serving
   and retired defence personnel. Respectful, plain, specific. Eligibility and proof
   requirements must be unmissable.

/revitalizing-and-strengthening-treatment-for-cancer-patients/ — 660 words, 3 images,
   8 lists. SUPPORTIVE care alongside oncology — never an alternative to it, never a
   cure. The most carefully worded page on the site. Design it to carry a prominent
   "speak to a physician first" path, and do not change a word of the clinical copy
   I give you.
```

---

## 6. What to send me back

For each family, I need:

1. The Claude Design **share link** (desktop + mobile).
2. Your one-line note on where the layout strains at the content extremes.
3. Confirmation you did not touch the header, footer, or the closing block.

Then I: convert it to the data-bound view pair, re-point that family's routes, re-run the
repair chain in the order recorded in `docs/reports/2026-09-19-ahv-session-close-handover.md` §5,
sweep every affected route for render failures / JS errors / horizontal overflow / broken images,
re-prerender, and send you a preview URL with a before/after for three pages in the family.

Approvals go in `launches/ayurvedichealingvillage.com/approvals.yaml` — one signed row per
family, your word, not mine.

---

## 7. Decisions needed from the owner

1. **T11 UTILITY — six leftover pages.** `/test-page/`, `/test-page-2/`, `/testing/`, `/gift-test/`,
   `/my-account/`, `/how-to-reach-old/`. These should not be designed. They need a fate: noindex,
   301, or leave. I will not change any page's status without your word (HARD GATE 2).
2. **Header, footer and the closing block are locked** in the brief above, because they are shared
   with pages you have already approved — changing them changes all 252 routes, not 129. Say the
   word and I will unlock them, but that becomes a separate, bigger approval.
3. **T8 OFFER** — you have asked for each offer to get its own landing page. If that is near,
   skip T8 in this pass.
4. **The cancer supportive-care page** carries clinical wording. HARD GATE 7: Dr. Deepu John signs
   it before it leaves staging, whatever the design does.
5. **The register cleanup is still parked** by your 2026-09-19 ruling — ~595 descriptive uses of
   *journey*, *guests*, *holiday* across ~93 routes, left until after go-live. New designs will not
   reintroduce them; the existing copy still carries them.

---

## 8. Provenance

- Route/view binding: `sites/ayurvedichealingvillage.com/english-candidate/route-manifest.json`
- Content shapes: the 14 datasets under `sites/ayurvedichealingvillage.com/public/ahv/assets/`
- Traffic: `launches/ayurvedichealingvillage.com/baseline/raw/gsc-ui-export-2026-07-19{,-www}/Pages.csv`
- Brand values: `public/ahv/components/AHV Chrome Header.dc.html`, `AHV Chrome Footer.dc.html`
- Closing block: `public/ahv/views/ahv-page-ayurvedic-treatments-desktop.json`, the owner's
  approved benchmark, as applied to the article family by `tools/repair-article-cta.mjs`
- Family assignment verified: 129 routes in, 129 assigned, 0 duplicated, 0 unassigned.
