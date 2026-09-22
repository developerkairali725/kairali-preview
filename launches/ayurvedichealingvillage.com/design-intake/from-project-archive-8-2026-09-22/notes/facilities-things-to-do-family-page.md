# T04 facilities / things-to-do / experience — image-led desktop template
File: `AHV Template Facilities and Things To Do Desktop.dc.html` (one DC, three live routes + a card-rhythm spec tab)
Mobile: `AHV Template Facilities and Things To Do Mobile.dc.html` (430 frame, same three routes).
Status: **DESKTOP APPROVED by owner 21 Sep 2026** (all three routes, including the three drafted-content items). Mobile built same day, awaiting review.
Source: live server HTML fetched 21 Sep 2026. No `drops/` folder and no `data/records/en/*.json` exists for these three routes; extracted body + head captured verbatim to `data/family-facilities/facilities-family-source.json`.
Family scale: 275,617 impressions — the largest search surface in the set.

## Routes bound
| Route | Words | Live shape | Rendered state |
|---|---|---|---|
| /village-facilities/ | 668 | 8 sections, 4 lists (one of 17 items), 10 cards | default tab |
| /things-to-do/ | 1,089 | 3 sections, 0 lists, 13 bold-lead term pairs, 3 cards | tab 2 |
| /experience/ | 213 | 1 paragraph, 8 cards, no distinct imagery | tab 3 |

## Brief correction — /experience/ is not a no-image page
The brief describes it as "213 words, NO images". Live actually ships **8 cards, each carrying the identical file `2024/10/alcohol-free.png` with an empty alt**. That is a source defect, not an art direction. It is the real-world instance of "a card pattern that works with none": the template detects that every image in the group is the same asset and **drops the image from the plate entirely**, replacing it with a bronze index numeral. Nothing is invented and nothing is repeated eight times. Flagged for owner: either supply eight distinct photographs or keep the no-image treatment.

## The card and gallery system (two later families inherit this)
One primitive — the **plate**: white card on ivory, 1px `#E9E2D3` hairline, 4px radius, no shadow. Image on top, caption bar below, label in Marcellus. Hover deepens ground to `#FBF7EC` and border to bronze; nothing lifts or scales (brand rule). Whole card is the hit target. Unlinked cards render as `div`, never as dead links. Text never sits on the photograph.

**Count decides density.** Every rule resolves to whole rows, so no page pads to fill a grid:
- `n = 0` — the section does not render. No empty state. Weight comes from hero band + centred lead paragraph + closing consultation band.
- `n = 1` — not a card. Full-measure 16:9 figure, label becomes the caption under a bronze rule.
- `n = 2–3` — one row, 16:10 plates, label 26px, CTA pinned to foot. (`/things-to-do/` = 3)
- `n = 4–9` — grid; 3 columns by default, 4 when n divides by four. 4:3 plates, label 20px. (`/experience/` = 8, four across, no-image variant)
- `n ≥ 10` — first card leaves the grid as a full-width 16:6 **lead plate**; the remaining n−1 follow the 4–9 rule. (`/village-facilities/` = 10 → lead plate + exactly three rows of three)

The spec tab in the DC renders all five states as a living reference for the two inheriting families.

## Typography (inherited from the Knowledge Explainer template, unchanged)
Measure 68ch, body 18px/1.75, ink `#2A2118` on ivory `#F7F4EA`. H1 Marcellus clamp(38–56px). H2 Marcellus 32–34px preceded by a full-measure hairline `#DCD3BF` — the section metronome. Lead paragraph 21px; `/experience/` runs its single paragraph at 23px centred at 60ch so one paragraph still reads as a page. Lists: no disc, 22px bronze rule, 2-col (3-col for the 17-item facilities list). Bold-lead term pairs become a `<dl>` with the term in Marcellus 21px in a 19ch column — this is the main rhythm device on the 1,089-word route. Sticky 220px "On this page" rail with the enquiry button pinned below it, rendered only where there are ≥3 sections; `/experience/` has no rail.

## Copy handling
Body copy below the hero is **VERBATIM** on all three routes, including the source's own errors: "Kairali—The Ayurvedic Healing Village" em-dash spacing, "No Refridgeration", "Yoga Classes ( Theory)" stray space, the double open-quote in "‘‘Say No to Caffeine’", "Kairali – The Ayurvedic **care** Village", "Charm Science Experts", trailing comma on the Vegetarian card, "Sight Seeing:" colon in the heading. Nothing rewritten.

Heading corrections (structure only, no wording): page-title H2 → H1 and absorbed into the hero so H1 renders once; section `h4`/`h3` → `h2`. Same ruling as the Attractions family.

Drafted content — **NOT YET APPROVED**, three items, all in the clinical register:
1. Standfirst on each of the three routes (Hero C requires one; live has none).
2. Two derived section labels: "Around the village" (the facilities gallery) and "Browse by place" (the things-to-do gallery). Live gives these card groups no heading at all.
3. Closing consultation band copy on each route (3 headings + 3 lines).

## Register-violation flags (brand §12.2 — inherited from verbatim live copy, do not fix without owner sign-off)
- "wellness retreat", "retreat", "tranquil retreat", "a lifestyle experience" — leisure register, banned by the KTAHV clinical rule.
- "opulent comfort", "top-notch", "unmatched tranquility", "a true sanctuary", "exquisitely decorated", "world's ... paradise" — superlatives and banned filler.
- "tucked away" (×2) — the banned "nestled" family.
- "relaxation", "rejuvenation", "unwind", "immerse yourself" (×3) — leisure verbs.
- "vacation experience", "getaway", "once-in-a-lifetime experience", "fun", "adventure" — holiday register, heaviest on `/things-to-do/`.
- "God's own Country" — tourism-board copy, kept verbatim for SEO.
- "visitors"/"guests" throughout where the clinical register wants "patients".
- My own added copy uses the clinical register only (patient, physician, programme, consultation, stay, treatment hours). The word "resort" appears nowhere in drafted copy.

## Head / SEO contract (verbatim from live, to be emitted server-side in Next.js)
| | /village-facilities/ | /things-to-do/ | /experience/ |
|---|---|---|---|
| title | Kairali Ayurvedic Healing Village: Wellness Retreat in Kerala | Best Things to Do at Kairali &amp; in Kerala – Nature, Ayurveda &amp; More | Holistic Wellness Retreat \| Kairali - The Ayurvedic Healing Village |
| og:title | Village Facilities | Things to do | Experience |
| modified | 2025-02-08T12:16:32Z | 2025-03-06T06:16:45Z | 2025-03-27T08:42:36Z |
| reading time | 6 min | 6 min | 3 min |
Shared: self canonical; robots `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`; og:type article; og:site_name "Ayurvedic Healing Village"; og:locale en_US; og:image `2023/11/our-story.png` 1440×524 image/png; twitter summary_large_image. `/village-facilities/` alone carries `og:locale:alternate fr_FR` and an fr hreflang sibling `/fr/installations-du-village/` (de is null) — per `sitemap-final.json`. Descriptions verbatim in the source JSON.

## Breadcrumbs — from `sitemap/sitemap-final.json` (authority, not live)
All three are two-level: Home / &lt;page&gt;. `breadcrumbState: "unverified"` on all three; `parent: "/"` on `/village-facilities/` despite its primary-nav group being "The Healing Village". Not overridden here.

## Link audit
Every href renders from the source record. `/village-facilities/` carries the 22-link Things to Do sidebar; rendered as a bottom aside "Also in Things to Do" (derived label, same ruling and grouping as the Attractions family), current page marked `aria-current="page"` and non-linked. Source order preserved within each group. No invented destinations. `/things-to-do/` card 3 points at `/sight-seeing-gallery/`, which is a different route from the `/sight-seeing/` in the footer — kept as source.

## CODEX ASKS (blocking for build; not blocking for design review)
1. **Import 14 source images** by `sourceSha256`, self-hosted into `assets/img/` — WP hotlinks must not ship:
   `2023/11/our-story.png` (1440×524, shared hero band, all 3 routes) ·
   `2024/10/Village-1.jpg` … `Village-10.jpg` (facilities gallery) ·
   `2024/11/9-13.jpg`, `2024/11/kerala1.jpg`, `2024/11/img0.jpg` (things-to-do gallery).
   The template renders each slot as a keyed placeholder showing the exact source filename; swap 1:1. `2024/10/alcohol-free.png` is deliberately **not** imported — see the /experience/ finding above.
2. **Alt text**: 3 of 13 gallery images have empty alt in source; the `/experience/` icon has empty alt on all 8 uses. Alt authoring is release work — do not silently invent.
3. **Route records missing**: `data/records/en/{village-facilities,things-to-do,experience}.json` do not exist in this project. The matrix lists them with `recordSuppliedToDesign: false`. Produce or supply them, then re-verify this page against the frozen record.
4. **Viewport QA** at 1024 / 1280 / 1440 / 1920 (skipped here per standing rule 9). Watch the 220px rail + 68ch measure at 1024, and the 19ch `<dl>` term column.

## Done-bar
- SEO head: verbatim table above — **pending**, needs the frozen records (ask 3).
- Link audit: all hrefs source-backed, no invented CTAs — **pass**.
- WCAG 2.2 AA (45+/55+): body 18px/1.75; smallest body 16px on the experience cards; ≥44px targets on every nav item, crumb, card and button; single H1 per route; h2 sequence with no skipped level; focus-visible ring; no hover-only disclosure; no motion; no carousel. Contrast: ink `#2A2118` and `#514a3f` on ivory both ≥7:1; bronze `#8F6212` used only at ≥12.5px bold on ivory (5.1:1); `#75695A` used for 13–16px secondary on ivory (4.6:1). **Pass**, pending a screen-reader run.
- Register flag list: above. **Emitted, unresolved by design.**

## Mobile view (430 frame)
Built on the approved desktop. Same verbatim copy, same head contract, same links, same register flags.

Card rhythm at 430px — the count rule relaxes because horizontal space stops being the constraint:
- lead plate keeps its 16:6 crop and stays full width; it is still the focal point
- `n ≥ 4` image plates go to **2 columns** at 4:3 with a 17px label, not 1 — nine thumbnails in a single column is a scroll wall, and at 2-up they stay above the 44px target comfortably
- `n ≤ 3` large plates stack to 1 column at 16:10, label 23px
- the no-image numbered cards (`/experience/`) stack to 1 column — body copy needs the measure

Other mobile-specific decisions:
- "On this page" rail becomes a collapsed `<details>` at the top of the body, not a sticky rail.
- The 22-link "Also in Things to Do" aside becomes three collapsed `<details>` groups with counts, one per group. Nothing hover-dependent; all rows ≥48px.
- The 17-item facilities list goes 3-col → 1-col with hairline rows.
- The `<dl>` term/description pairs unstack: term above description, term 20px Marcellus, hairline between pairs.
- Consultation band CTAs go full-width stacked at 52px.
- Body 17px/1.7, H1 34px, H2 26–28px. Smallest text is the 16px card body and the 15.5px section sub-lines.

## Desktop change after approval
The "Also in Things to Do" aside was reworked following an owner comment ("this can have a better view"): the three bare link columns became a single white panel with column rules, Marcellus group headings with item counts, and a "You are here" marker on the current page. Content and link set unchanged.

## Open
- Both views carry keyed image placeholders. Blocked on the 14 source files — see the Codex asks and `notes/facilities-image-sourcing-brief.md`.
- Gallery images are keyed placeholders, not photography. The page's visual weight at review is therefore understated — the real plates will carry far more colour.
