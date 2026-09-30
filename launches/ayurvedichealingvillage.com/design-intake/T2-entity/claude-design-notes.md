# Group entity profile template — page notes

Files: `AHV Template Group Entity Profile Desktop.dc.html` · `AHV Template Group Entity Profile Mobile.dc.html` · `assets/group-entity-data.js`

Family: profile of one company or institution inside the Kairali group — the pharmacy, the equipment works, the hospitality arm, the training institute, Villa Raag, Arogya Kendra, Arogya Shala.

Design target `/kairali-ayurvedic-products-pvt-ltd/` (697w, 4 img, 5 lists, 13 headings, 3 card groups). Extremes carried in the same data file: `/villa-raag/` (1,048w, 8 lists) and `/kair-by-kairali/` (228w). Switch with the `route` prop.

## Content status — READ FIRST
No live record for any of the three routes exists in this project (`data/records/` holds ten unrelated routes; live fetch unavailable this session). `uploads/AHV-frozen-content-lock-608.json` points at `records/en/kairali-ayurvedic-products-pvt-ltd.json`, `records/en/villa-raag.json`, `records/en/kair-by-kairali.json` — none are present locally. **Every body string in `assets/group-entity-data.js` is stand-in copy written to the stated volume so the layout can be judged at the extremes. Replace verbatim from the records before porting.** The dashed bronze strip says so on the page; switch it off with `stressNote`.

Head contracts are `[TO CONFIRM]` placeholders. Breadcrumbs provisional from URL hierarchy (no `sitemap/sitemap-final.json` yet) — assumed chain Home / Kairali Ayurvedic Group / entity.

## What this template adds over the knowledge article
Four elements answer the four questions the family has to answer, in this order:

1. **In one line** — the identity panel's left cell. One sentence, 21px, capped at 46ch, saying what the entity is. Not a heading; it reads as a definition.
2. **Fact list** — six key/value rows in the right cell (type of entity, what it does, registered name, established, based at, licences). Unknown values render as bronze `[TO CONFIRM]`, never as a plausible number.
3. **Separation statement** — green-ruled band directly under the panel, above the fold on desktop at 1440. This is the legal-identity guard: it states that the entity is a separate company, that the hospital does not sell or dispatch its products, and where orders actually go. It is not optional per route and is not styled like a note; it uses Kairali green so it does not read as small print.
4. **Place in the group** — sibling chips, current entity marked with `aria-current="page"`, sand fill and deep-gold border. Reader can see the group shape without leaving the page. Suppress with `showGroupMap`.

Body sections use a side-heading grid (220px sticky h2 gutter + content column) rather than the institutional template's sticky rail — with 13 headings a rail index becomes longer than the viewport, while side headings stay oriented for free. Block vocabulary: paragraph (66ch), h3, list (diamond / plain / numbered steps), **card group** (auto-fit 3-up, sand border), figure, note.

### Entity link block
Sits above the fixed closing block, framed in 1.5px deep gold `#5A4420` on white, so it is visibly a different destination from the cream page and from the white closing band. Entity website and entity email are `[TO CONFIRM]` — none were supplied, so they render as dashed bronze pending chips rather than dead links. The group address `info@kairali.com` is offered as the routing fallback and is the only real address used. Its closing line hands the reader to the hospital block below ("Treatment enquiries belong in the block below"), so the two calls to action do not compete.

### How each extreme lands
- **697w target** — five sections, three card groups, four figures; the side-heading grid keeps prose at 66ch while cards use the full column.
- **1,048w / 8 lists (`/villa-raag/`)** — short-item lists go two-up on desktop; that plus the numbered-step flavour is what stops eight lists reading as one column of bullets.
- **228w (`/kair-by-kairali/`)** — brief mode: content column narrows to 700px, lists stay single-column, hero band shortens to 300px, and the identity panel rebalances to 5/6 so five facts do not look like a half-empty table. The entity link block carries the lower page. Mobile drops the "On this page" disclosure below three sections.

## Where it would break
- **More content:** beyond about eight sections the sticky side heading of a long section scrolls past its own content before the next rule arrives, and a 1,400-word single section leaves the heading gutter empty for two screens — that page needs the section split or a rail.
- **Less content:** below roughly 150 words with no images, brief mode still puts the entity link block and the closing block back to back; that page reads as two calls to action and wants at least the identity panel's facts filled in.
- **Facts:** the identity panel assumes 4–8 rows. Three or fewer leaves an obviously short right cell; more than ten pushes the separation statement below the fold at 1440.

## Register check
No banned word introduced (spa, resort, holiday, luxury, cure, journey, guests). "World Luxury Award Winner" appears only inside the fixed closing block, as the award's proper name. Villa Raag is written as accommodation for patients and accompanying family members, not as hospitality copy. Vocabulary throughout: patient, physician, treatment, programme, Panchakarma, admission, discharge, consultation.

## Facts
Only the supplied ones are used: info@kairali.com, +91 92898 38797 / https://wa.me/919289838797, /online-consultation/, /enquiry-form/. Every entity website, email, tariff, date, distance, price and certification is a visible `[TO CONFIRM]`.

## Accessibility
Body 17–18px / 1.7. One h1; h2 → h3 with no skipped level (the identity panel's h2 is visually hidden so the panel does not sit outside the heading tree). Targets ≥44px, buttons 52px, mobile chips 48px. No hover-only disclosure — the two mobile panels are click-operated `<details>`. `prefers-reduced-motion` honoured; nothing animates. Skip link on both views. Mobile wrapper is `overflow-x:hidden` with no fixed widths; no sideways scroll at 360px.

## Codex asks
1. Supply the three live records (or drops) so body copy, head contract and image manifest can be replaced verbatim.
2. Confirm the entity-level facts and contacts for each route in the family — registered name, year established, address, licences, own website, own email. Every one is currently `[TO CONFIRM]`.
3. Confirm the legal wording of the separation statement with the group. The current sentence is drafted by me and states: separate company, hospital does not sell or dispatch, orders go to the company.
4. Download and self-host the real route images; the current ones are existing `assets/img/` files standing in at the right counts.
5. Confirm the breadcrumb parent (`/kairali-ayurvedic-group/`) once `sitemap/sitemap-final.json` lands.
6. QA at 320/360/390/430 and 1024/1280/1440/1920.
