# /no-preservatives/ — page notes (desktop delivered 22 Sep 2026)

Family: **House rules of the property** (8 pages). Source: LIVE FETCH (no `drops/no-preservatives/` present).
Deliverable: `AHV Page No Preservatives Desktop.dc.html`. Mobile pending desktop approval.

## Head contract (verbatim from live)
- title: `Fresh and Natural Ayurvedic Food at Kairali for Holistic Wellness`
- canonical: `https://ayurvedichealingvillage.com/no-preservatives/`
- meta description / og:description: `Kairali promotes fresh, unprocessed Ayurvedic food for balance, vitality, and holistic well-being. Avoid preservatives and embrace pure nourishment for health.`
- og:title `No Preservatives` · og:type `article` · og:locale `en_US` (alternate `fr_FR`)
- og:image `…/2023/11/our-story.png` (1440×524)
- robots: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
- modified_time: `2025-03-26T11:12:53+00:00`

## Register violations (live copy kept VERBATIM per standing rule 3 — flagged, not edited)
1. `guests` ×3 — "Kairali ensures that **guests** receive the nourishment…"; "Kairali encourages **guests** to adopt these habits…"; "helps its **guests** embark on…"
2. `journey` ×1 — "embark on a **journey** of rejuvenation and vitality"
3. `retreat` ×1 — "Meals prepared at the **retreat** use fresh, locally sourced ingredients" (hotel register, not on the banned list)
4. Award name `World Luxury Award Winner` in the fixed closing block — proper noun, retained deliberately.

Owner decision needed: leave verbatim for SEO, or approve substitutions (`guests`→`patients`, `journey`→`programme of`, `retreat`→`hospital`).

## Drafted content inventory (marked in-page)
- **Standfirst** (hero, bronze left rule): "Nothing served at Kairali is preserved, canned or chemically stabilised. Meals are cooked the day they are eaten, from produce picked on the property. This page sets out the reasoning behind that rule." — DRAFT, approve or replace.
- **Rail intro**: "Eight standing rules govern daily life here. Each is explained on its own page." — DRAFT.
- **Rail heading**: "House rules of the property" — DRAFT (no live equivalent; live nav heading is "Experience").
- **Rail contact block**: "A question about the diet? / Write to the patient care team before admission." — DRAFT. Uses only the given email.
- Everything below the hero line is live copy, unchanged.

## Breadcrumb — PROVISIONAL
Rendered `Home · No Preservatives` (URL hierarchy, matches live). Live "Home" crumb points to `/kairali-the-ayurvedic-healing-village/`, not `/`; the design links `/`. Awaiting `sitemap/sitemap-final.json` for the authoritative chain (live nav suggests an intermediate "Experience" section with no known URL).

## Cross-link set (the 8 house rules) — RESOLVED 22 Sep 2026 from the site record
| Label | href | Status |
|---|---|---|
| No Smoking | /no-smoking/ | live |
| Alcohol Free | /alcohol-free/ | confirmed — label is the record page H1, verbatim |
| No Caffeine | /no-caffeine/ | confirmed from record (absent from live nav) |
| No Preservatives | /no-preservatives/ | current page |
| No Refridgeration | /no-refridgeration/ | confirmed — misspelt slug retained exactly as the record has it, by owner ruling |
| Vegetarian | /vegetarian/ | live |
| Organic Farming | /organic-farm/ | live (label "Organic Farming", slug "organic-farm") |
| Animal Husbandry | /animal-husbandry/ | confirmed from record (absent from live nav) |

`/in-house-products/` exists in the record but is **not in this family** (owner ruling) — excluded from the rail. Live "Experience" nav also repeats **Vegetarian** twice; ignored.

## Codex asks
1. Download and self-host both images: `…/2023/11/our-story.png` → `assets/img/no-preservatives-hero.png`; `…/2024/10/sightseeing-5.jpg` → `assets/img/no-preservatives-body.jpg`. Hero needs a 1440×400 crop (live source is 1440×524) and a 780×440 mobile crop. Both currently render as labelled placeholder panels.
2. ~~Label for `/alcohol-free/`~~ — settled 22 Sep 2026. All eight labels now come from the record pages' own H1s, verbatim; no TO CONFIRM markers remain on either view.
3. QA the template at 1920 / 1440 / 1280 / 1024 widths (viewport battle test skipped here per standing rule 9).

## Done-bar
- [x] SEO head verbatim from live record
- [x] Link audit vs record: all 8 family links + 3 CTA links resolved; zero TO CONFIRM markers remaining
- [x] WCAG 2.2 AA: body 18px/1.7, rail links 16.5px with 44px min height, single h1, h1→h2→h3 unskipped, no hover-only disclosure, no motion, breadcrumb `aria-current`, decorative diamonds `aria-hidden`
- [x] Register flag list above
- [x] Mobile view delivered — `AHV Page No Preservatives Mobile.dc.html`

## Template behaviour at the content extremes
The prose column and the sticky rail are independent, so a 71-word page (`/vegetarian/`) keeps the full-height rail and closing block and reads as complete — but the rail (≈560px) then becomes the tallest element on the page, and at 595 words the rail unsticks well before the prose ends. Only real break point: a page with **no** H2 subheads loses the hairline rhythm entirely and becomes one undifferentiated block, so the 71-word pages need their single paragraph split under at least one H2 or the standfirst carrying more weight.

## Tweaks exposed on the component
- `showDraftMarkers` (default on) — hides every DRAFT / TO CONFIRM chip for a clean owner read.
- `heroBand` — `full-bleed` (default) or `contained` image band.

---

## Mobile view — delivered 22 Sep 2026
File: `AHV Page No Preservatives Mobile.dc.html`. Two 390px frames on one board: **A** = /no-preservatives/ (595 words), **B** = /vegetarian/ (57 words live, verbatim from live fetch, 1 image, no H2 in source) as the short extreme.

Not the desktop squeezed — three structural changes:
1. **The rail stops being a rail.** Desktop's sticky white card becomes a full-bleed sand band (#E0D7C4) sitting after the prose and before the closing block: eight edge-to-edge rows, 58px each, hairline-separated, current page filled #F7F4EA with a "You are here" bronze micro-label instead of a link.
2. **Numbered lists break to two lines** — Marcellus numeral above the text rather than beside it, so the 66-character measure isn't fought at 350px of usable width.
3. **CTA buttons go full-width stacked** (still 52px, still `flex-wrap: wrap` as the brief specifies); hero band drops to 230px, in-body image to 210px, H1 to 36px, H2 to 25px. Body stays 18px/1.7.

### Mobile strain note (one line)
At the 57-word extreme the page becomes header → hero → one paragraph → rail, so the sibling band is the page's whole second half and the prose reads as an introduction to the rail rather than the other way round — acceptable and deliberate, but if a family page ever drops below ~40 words the hero image band (230px) plus the rail (≈600px) will outweigh the copy by roughly ten to one.

### My own checks on the mobile file
- 360px squeeze, both frames: scrollWidth 358 = clientWidth 358, zero overflowing children, no sideways scroll.
- Tap targets: 24 links, none under 44×44 after enlarging the breadcrumb "Home" (was 36×24 — fixed in the desktop file too).
- Rail rows: minimum 58px.
- CTA buttons: all six exactly 52px tall.
- Headings: one h1 per frame, h1→h2→h3 with no skipped level.
- Type resolving: Marcellus on h1, Mulish 18px/30.6px body.
- Banned-word scan of rendered text: only `luxury` (award proper noun), `journey` and `guests` (live verbatim, flagged above). Nothing introduced.
