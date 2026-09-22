# Claude Code handover — T04 facilities / things-to-do / experience (image-led family)
Written 21 Sep 2026. Desktop template: `AHV Template Facilities and Things To Do Desktop.dc.html`.
Design notes (read first): `notes/facilities-things-to-do-family-page.md`.
Verbatim source capture: `data/family-facilities/facilities-family-source.json`.

**Do not ship this page in its current state.** The layout, copy, links, headings, head contract and card system are done and reviewable. The photography is not present. Everything below is what I found and what has to happen before this family is servable.

---

## 1. BLOCKING — 14 source images are missing from the project

No `drops/<slug>/` folder exists for these routes. No `data/records/en/{village-facilities,things-to-do,experience}.json` exists. None of the filenames appear in the attached Kairali-Image-Library. I can read live HTML but cannot pull binaries into the project, and standing rule 6 forbids hotlinking WordPress. So every image slot in the template is a keyed placeholder that prints its own source filename.

Import all 14 self-hosted into `assets/img/`, verify against `sourceSha256`, and preserve natural dimensions.

| Source path (under `https://ayurvedichealingvillage.com/wp-content/uploads/`) | Used on | Suggested project filename | Source alt |
|---|---|---|---|
| `2023/11/our-story.png` (1440×524, PNG) | hero band on **all three** routes; also the og:image | `AHV-Facilities-Landscape.png` | — |
| `2024/10/Village-1.jpg` | /village-facilities/ lead plate | `AHV-Village-01.jpg` | `Ayurvedic Treatment` |
| `2024/10/Village-2.jpg` | /village-facilities/ | `AHV-Village-02.jpg` | `Fine Dining` |
| `2024/10/Village-3.jpg` | /village-facilities/ | `AHV-Village-03.jpg` | `Yoga &amp; Meditation` |
| `2024/10/Village-4.jpg` | /village-facilities/ | `AHV-Village-04.jpg` | `Herbal Garden` |
| `2024/10/Village-5.jpg` | /village-facilities/ | `AHV-Village-05.jpg` | `Charm Science Experts` |
| `2024/10/Village-6.jpg` | /village-facilities/ | `AHV-Village-06.jpg` | `Beauty Therapy` |
| `2024/10/Village-7.jpg` | /village-facilities/ | `AHV-Village-07.jpg` | `Conference Hall` |
| `2024/10/Village-8.jpg` | /village-facilities/ | `AHV-Village-08.jpg` | `Swimming Pool` |
| `2024/10/Village-9.jpg` | /village-facilities/ | `AHV-Village-09.jpg` | `Recreation &amp; Business Centre` |
| `2024/10/Village-10.jpg` | /village-facilities/ | `AHV-Village-10.jpg` | *(empty in source)* |
| `2024/11/9-13.jpg` | /things-to-do/ card 1 | `AHV-ThingsToDo-01.jpg` | *(empty in source)* |
| `2024/11/kerala1.jpg` | /things-to-do/ card 2 | `AHV-ThingsToDo-02.jpg` | *(empty in source)* |
| `2024/11/img0.jpg` | /things-to-do/ card 3 | `AHV-ThingsToDo-03.jpg` | *(empty in source)* |

**Do NOT import `2024/10/alcohol-free.png`** — see §2.

### How to get them — ranked, stop at the first that works
Full brief with per-image rulings and prompts: **`source/IMAGE-SOURCING-BRIEF.md`**.

1. **Download from the live server.** Primary route, covers all 14. They are Kairali's own photographs already published on their own domain. Curl commands are in the brief. Log sha256 + natural dimensions after import.
2. **Kairali-Image-Library** for anything route 1 misses. `ktahv/` holds 50 property photographs but the filenames carry no subject information — mapping them to labels is a **human task**, not an inference. Build a contact sheet and have the owner label them.
3. **Generation — restricted.** Nine of the fourteen name a real, specific place on the premises. **Village-4 (Herbal Garden), Village-5 (Charm Science Experts), Village-7 (Conference Hall), Village-8 (Swimming Pool), Village-9 (Recreation & Business Centre) and Village-10 (Amphitheatre) must NOT be generated** — an invented photograph under those labels on an NABH-accredited hospital's own facilities page is a false claim about the premises. The brief marks each image generate / do-not-generate and carries prompts for the generatable ones only.
4. **Free stock — rejected** for this family, same reason.

Anything generated rather than sourced must be recorded as generated, with its prompt, in the page notes. Generated imagery of a real medical facility has to be traceable.

### How to swap
In the template, each slot is a flex box with background `#EDE5D3` containing a bronze rule, an uppercase caption and a monospace `<span>` holding the source filename. Replace the whole box with:
```html
<img src="assets/img/AHV-Village-02.jpg" alt="Fine Dining" width="…" height="…"
     style="display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-bottom:1px solid #E0D7C4">
```
Keep the aspect ratios the template already sets — `16/6` on the lead plate, `4/3` in the 3-col grid, `16/10` on the three-card row, `16/9` on the spec-tab single figure. Do not upscale beyond natural width. The hero band is a `background-image` on a `clamp(240px,26vw,360px)` div, not an `<img>`.

---

## 2. FINDING — /experience/ is not a "no images" page; it is a source defect

The brief called it "213 words, NO images". Live actually ships **8 cards, every one of them using the identical file `2024/10/alcohol-free.png`, with empty alt on all 8 uses**. That is a content-entry mistake, not art direction.

Design decision already applied: when every image in a card group resolves to the same asset, the plate **drops the image entirely** and a bronze index numeral (01–08) carries the rhythm. This is the family's answer to "a card pattern that works with none", and it is documented on the spec tab.

**Owner decision needed before build.** Either:
- (a) supply 8 distinct photographs and switch those cards to the standard 4-col image plate; or
- (b) ratify the no-image numbered treatment as permanent.

Do not resolve this by shipping the same icon eight times.

---

## 3. BLOCKING — route records do not exist

`coverage/route-content-matrix-608.json` lists all three with `recordSuppliedToDesign: false` and `populatedInReview: false`, and `data/records/en/` has no file for any of them. The template was built from live HTML fetched 21 Sep 2026, captured verbatim to `data/family-facilities/facilities-family-source.json`.

Produce the three frozen records to the same schema as the other `data/records/*.json`, then re-verify this page against them — body text, link set, asset list and head contract. Record hashes to compare against:

| Route | sourceSha256 | bodySha256 |
|---|---|---|
| /village-facilities/ | `a472890a011d2f5dbf1f40304e5c088f5c61ac4c6c9a0cf50add7a8cafed9cda` | `570435a1f6ec4bd3f51cfb50c7db9d7b439d028a21e753ba18bfe4c537c190c4` |
| /things-to-do/ | `a50ba726171c833c85ca840468990c9c5e3cadf4499cbbc1553e4d82f1eae4d8` | *(in matrix)* |
| /experience/ | `b3600e76b2a7daefc78871a70a05096e976b4054f3e28b79e3797faf281bbf85` | *(in matrix)* |

---

## 4. Alt text — release work, do not invent

4 of the 14 images have **empty alt in source** (Village-10 and all three things-to-do cards), plus the 8 experience uses. The 10 non-empty alts are carried verbatim in the table above, including the odd ones ("Charm Science Experts"). Author the missing alts with the owner; do not let a build step auto-generate them.

---

## 5. Head contract — emit server-side, verbatim

Currently not emitted at all by the prototype. Full values in `notes/facilities-things-to-do-family-page.md`. Key points:

- Titles differ from og:titles on all three routes (e.g. `/village-facilities/` title is "Kairali Ayurvedic Healing Village: Wellness Retreat in Kerala", og:title is just "Village Facilities"). Preserve both.
- Shared: self canonical, `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`, og:type article, og:site_name "Ayurvedic Healing Village", og:locale en_US, og:image `our-story.png` 1440×524 image/png, twitter `summary_large_image`.
- `/village-facilities/` **alone** carries `og:locale:alternate fr_FR` and an fr hreflang sibling `/fr/installations-du-village/`; de is null. Do not fabricate de.
- Not emitted here, carry to server metadata as with other families: `article:modified_time`, twitter `Est. reading time` (6 / 6 / 3 minutes).
- JSON-LD: WebPage + BreadcrumbList + WebSite, BreadcrumbList mirroring the visible chain.

---

## 6. Breadcrumbs — sitemap authority, flagged unverified

From `sitemap/sitemap-final.json`: all three are two-level, `Home / <page>`, `parent: "/"`, `breadcrumbState: "unverified"`.

Note the conflict I did **not** resolve: `/village-facilities/` has `parent: "/"` in the breadcrumb chain, but its primary-nav entry sits in group "The Healing Village" (groupPosition 4, itemPosition 3) and its footer entry in group "Stay". The live page's own sidebar also nests it under Things to Do. I followed the sitemap chain. If the owner wants `Home / Things to Do / Village Facilities`, that is a sitemap change, not a page change.

---

## 7. Links — audited, all source-backed

No invented destinations or CTAs. Two things to preserve deliberately:

- `/things-to-do/` card 3 targets `/sight-seeing-gallery/`, which is a **different route** from the `/sight-seeing/` that appears in the footer. Both exist in source. Do not normalise them together.
- `/village-facilities/` carries the 22-link Things to Do sidebar. I moved it from its live position (near the top, before the body) to a bottom aside headed "Also in Things to Do" — same ruling and same three-group split as the Attractions family. Group headings "In Healing Village" / "In Kerala" are source; "Sightseeing" and the aside heading are **derived labels**, logged. Current page is `aria-current="page"` and non-linked.

---

## 8. Drafted content — needs approve-or-replace before build

Three items, all mine, all in the clinical register. They are **not** marked with visible DRAFT badges in the current file; treat this list as the inventory.

1. **Standfirsts**, one per route (Hero C requires one; live has none).
   - /village-facilities/: "What is on the grounds, and what a patient can use between treatment hours — accommodation, the treatment centre, the pavilion, the farm, and the seventeen facilities the village keeps open."
   - /things-to-do/: "Hours outside treatment: what is walkable on the grounds, and what Palakkad and the rest of Kerala put within reach of a stay."
   - /experience/: "Eight standing house rules that shape the food, the air and the day. They apply to every patient, for the whole stay."
2. **Two derived section labels** — "Around the village" (facilities gallery) and "Browse by place" (things-to-do gallery). Live gives these card groups no heading at all.
3. **Closing consultation band** on each route — 3 headings + 3 supporting lines + the CTA pair.

---

## 9. Register violations — flagged, NOT fixed

All inherited from verbatim live copy. Brand §12.2 bans them; standing rule 3 says keep live copy verbatim for SEO and flag. Do not "fix" without owner sign-off.

- "wellness retreat", "retreat", "tranquil retreat", "a lifestyle experience"
- "opulent comfort", "top-notch", "unmatched tranquility", "a true sanctuary", "exquisitely decorated"
- "tucked away" ×2 (the banned "nestled" family)
- "relaxation", "rejuvenation", "unwind", "immerse yourself" ×3
- "vacation experience", "getaway", "once-in-a-lifetime experience", "fun", "adventure" — heaviest on /things-to-do/
- "God's own Country" — tourism-board copy
- "visitors"/"guests" throughout where the clinical register wants "patients"

My own drafted copy uses the clinical register only. **"Resort" appears nowhere in drafted copy** — only inside verbatim live strings.

---

## 10. Source typos preserved verbatim — do not let a linter touch these

"Kairali—The Ayurvedic Healing Village" (unspaced em dash) · "No Refridgeration" · "Yoga Classes ( Theory)" stray space · "‘‘Say No to Caffeine’" double open-quote · "Kairali – The Ayurvedic **care** Village" (/experience/ intro) · "Charm Science Experts" · trailing comma on the Vegetarian card · "Sight Seeing:" colon inside the heading.

Structural heading changes I *did* make (no wording change): page-title H2 → H1, absorbed into the hero so H1 renders once; section `h4`/`h3` → `h2`. Same ruling as the Attractions family.

---

## 11. Card system — must survive the build

Defined once, inherited by two later families. Rendered live on the spec tab. Count decides density; every rule resolves to whole rows so no page pads to fill a grid:

- `n = 0` → section does not render. No empty state.
- `n = 1` → not a card. Full-measure 16:9 figure, label as caption under a bronze rule.
- `n = 2–3` → one row, 16:10, label 26px, CTA pinned to foot.
- `n = 4–9` → 3 columns, or 4 when n divides by four. 4:3, label 20px.
- `n ≥ 10` → first card leaves the grid as a full-width 16:6 lead plate; remainder follows the 4–9 rule.

Plate invariants: white on ivory, 1px `#E9E2D3` hairline, 4px radius, **no shadow**; hover deepens ground to `#FBF7EC` and border to bronze, **nothing lifts or scales**; label Marcellus, never truncated; text never on the photograph; unlinked card is a `div`, not a dead link; whole card is the hit target, ≥44px.

---

## 12. Remaining work

- **Viewport QA** at 1024 / 1280 / 1440 / 1920 — skipped here per standing rule 9. Watch the 220px sticky rail against the 68ch measure at 1024, and the 19ch `<dl>` term column on /things-to-do/.
- **Mobile view** — not started, waiting on owner approval of desktop (standing rule 4).
- **Screen-reader pass** — contrast, heading order, target sizes and focus ring all verified by inspection; no SR run yet.
- **The review bar** (dark strip with the four tabs) is review-only scaffolding. It is `data-review="bar"` and already hidden in print. Strip it and the whole `data-review="spec"` article on build.

---

## Done-bar status
| Check | State |
|---|---|
| SEO head verbatim from record | **blocked** — records don't exist (§3) |
| Link audit vs record | pass by inspection; re-run against records |
| WCAG 2.2 AA | pass by inspection; SR run outstanding |
| Register-violation flag list | emitted (§9), unresolved by design |
| Images self-hosted | **blocked** (§1) |
