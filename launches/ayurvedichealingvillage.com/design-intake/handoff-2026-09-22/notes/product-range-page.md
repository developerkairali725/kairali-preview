# /product-range/ — Product family template (Desktop)

Template files: `AHV Template Product Family Desktop.dc.html` (1440) · `AHV Template Product Family Mobile.dc.html` (390)
Family: products the group manufactures (classical medicines, proprietary medicines,
organics, herbal tea, books, in-house range). Desktop approved 2026-09-22; mobile built as a separate layout (not a squeeze):
rail becomes four collapsible `<details>` groups below the entries, entry images go full-width
above the heading, the three closing CTAs stack full-width, and the hero band drops to 220px.

## Head contract (verbatim from live, 2026-09-22 fetch)
- title: `Kairali Ayurvedic Products – Herbal Teas, Medicines & Wellness`
- description: `Explore Kairali’s Ayurvedic products, including herbal teas, proprietary medicines, organic wellness solutions, and authentic Ayurvedic equipment for holistic health.`
- canonical: `https://ayurvedichealingvillage.com/product-range/`
- og:image: `/wp-content/uploads/2023/11/our-story.png` (1440×524)
- robots: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1
- modified: 2025-03-26T09:03:07+00:00

## Breadcrumb
Live renders `Home • Product Range` (Home href points at `/index.php/ayurvedic-healing-village/`).
Rendered here as Home → `https://ayurvedichealingvillage.com/` → Product Range.
**PROVISIONAL** — replace from `sitemap/sitemap-final.json` when Codex delivers it.

## Structural decision (needs owner sign-off)
Live repeats every product twice: once as a bold lead-in paragraph, once as a captioned
card link below. The template merges the two into one entry row (image + linked h3 + the
verbatim paragraph). **No word is added or removed**, but the product name now appears twice
in close proximity (heading, then bold lead-in) because the live sentences use the product
name as their grammatical subject ("**Books** The founder of…").
→ Owner decision: keep as-is (verbatim), or approve dropping the bold lead-in from the paragraph.

## Drafted content (marked in-page)
- Hero standfirst: "The medicines, organics, teas, books and equipment manufactured by the
  Kairali Ayurvedic Group. Each range is described here and ordered separately."
  Marked **DRAFT — approve or replace** in the page.
- Commerce note: "Products are not sold on this site. Each range links onward to its own page."
  Drafted to satisfy the no-cart/no-price rule. Approve or remove.

## Register + claim flags (no copy changed)
Banned-word scan of the live body: **clean** — no spa / resort / holiday / luxury / cure /
journey / guests. "World Luxury Award Winner" retained in the fixed closing block as a proper noun.

Health-claim risk in the verbatim live copy (these are medicines — flag for legal, not for me to edit):
1. "The tea boosts immunity, offers natural detoxification"
2. "guarantee purity, effectiveness"
3. "made to address certain health issues"
4. "promote effective, holistic healing"
5. "tried-and-tested formulations" / "tried-and-tested classical treatments"
6. "provide the ageless efficacy of Ayurvedic medicine"
7. "can help you empower your health practice"

Register (not banned, but off-house): "premium range", "wellness products", "revitalize the
body and soul", "timeless healing".

## Codex asks
1. **Download and self-host 8 images** (currently sand placeholders labelled with the live path;
   nothing is hotlinked). Source paths, all under `https://ayurvedichealingvillage.com/wp-content/uploads/`:
   - `2023/11/our-story.png` → hero band (1440×524)
   - `2024/12/tea.jpg.webp`
   - `2023/09/Ayurvedic-Proprietary-Organics.jpg`
   - `2024/12/Kair.jpg.webp`
   - `2023/09/Ayurvedic-Proprietary-Medicines.jpg`
   - `2023/09/Ayurvedic-Classial-Medicines.jpg` (note live misspelling "Classial")
   - `2023/09/Books.jpg`
   - `2023/09/Kairali-Ayurvedic-Equipment.jpg`
   Target ratio for entry images 3:2 (320×214 at desktop); crop, do not letterbox.
2. Link audit: 7 entry links + 19 rail links against the frozen record.
3. Width QA 360–1440.

## Open gaps
- Hero band image: is `our-story.png` the right banner for the product family, or should each
  page in the family carry its own? [TO CONFIRM]
- The rail ("About Us" group nav) is live content on this route. Confirm it appears on every
  page in this family; if not, the template hides it via the `showRail` prop.

## Mobile checks run (390 and 360)
- No horizontal overflow at 360px (every element measured: scrollWidth == clientWidth)
- Zero tap targets under 44×44 after enlarging the breadcrumb Home link and the entry title links
  (the same two fixes were applied to desktop)
- Rail `<details>` summaries 56px; rail links 52px; three CTAs 320×52 stacked
- One h1, order h1→h2→h3 with no skips; body 18px/30.6px (1.7)
- Zero `<img>` tags — placeholders only, nothing hotlinked
- Both extremes rendered: no-image entries collapse to heading + paragraph with no empty slot;
  single-entry (161-word) page keeps the same rhythm

## Done-bar
- [x] SEO head contract captured verbatim (above)
- [ ] Link audit vs frozen record — Codex
- [x] WCAG 2.2 AA: body 18px/1.7, rail links 44px min, buttons 52px, single h1, h1→h2→h3 unskipped, no hover-only disclosure, no motion
- [x] Register-violation flag list (above)
- [x] Owner approval → Mobile view built and checked
