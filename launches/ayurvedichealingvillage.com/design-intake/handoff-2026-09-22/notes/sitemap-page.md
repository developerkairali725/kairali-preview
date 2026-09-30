# /sitemap/ — page notes (Desktop approved · Mobile delivered)

Route: `/sitemap/` · Files: `AHV Page Sitemap Desktop.dc.html` (1440px) · `AHV Page Sitemap Mobile.dc.html` (390px)
Source: live fetch of `https://ayurvedichealingvillage.com/sitemap/` (no drop supplied). Cross-checked against `data/family-04/html-xml-sitemap-source-distinction.json` (223 link occurrences, 215 distinct URLs).

## Head contract (verbatim from live)
- `title`: Kairali's Special Ayurveda Discount Offers, Coupons and Gift Vouchers
- `canonical`: https://ayurvedichealingvillage.com/sitemap/
- `meta description` / `og:description`: offers/coupons keyword string (identical)
- `og:title`: Sitemap · `og:type`: article · `og:url`: canonical
- `og:image`: /wp-content/uploads/2024/09/our-story.png (1440×524)
- `robots`: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1
- `article:modified_time`: 2026-07-07T09:22:28+00:00

**Head defect — owner decision needed.** Title and description belong to an offers page, not to the sitemap. Ported verbatim as instructed. Recommend a rewrite before go-live; not done here.

## Breadcrumb
`Home › Sitemap` — PROVISIONAL, derived from URL hierarchy. Live breadcrumb points "Home" at `/kairali-the-ayurvedic-healing-village/`; the port points it at `/`. Reconcile against `sitemap/sitemap-final.json` before wiring.

## Structure decisions (hierarchy, not copy)
Every link label is verbatim. Three structural moves, all reversible:
1. Live nests everything below Villas under a non-linking **"More"** label. Kept as an h2 band; its children render as h3 cards so the page is scannable. No label removed.
2. **About** collapses two live levels (Group → Hospitality → …; Products → Product Range → …) into two flat h4 blocks — *Kairali Ayurvedic Group* and *Product Range*. All 16 labels retained.
3. **Training Course Fees** is a peer of Training in live; rendered as a ruled-off line inside the Training card. Promote it out if the owner prefers strict parity.

## Link audit — defects carried from source
- **Media Gallery** — href in source is a corrupted fragment of escaped HTML. Rendered as a non-link label with a visible `[TO CONFIRM] link broken in source` marker.
- **Villa Gallery children** (Classic Villa, Deluxe Villa, Royal Villas, Maharaja Suite) — all `href="#"`. Rendered as a `[TO CONFIRM]` note rather than four dead links.
- **Yoga**, **Awards**, **Feedback**, **Others**, **PPC Landing page**, **Retreat**, **Yoga Training Program** — non-linking group labels in source; rendered as headings, not links.
- **Duplicate target**: "Stress & Strain Relief Treatment" and "Chronic Back Pain Relief Treatment" both point at `/treatment-to-remove-stress-and-strain/`. The second is almost certainly meant for `/treatment-for-chronic-back-pain/`, which already appears one row above. Both kept verbatim. **[TO CONFIRM]**
- **Mixed hosts**: eight links use `https://www.…` while the rest use the bare host (weight-loss-programme, arogya-kendra, ayurvedic-herbal-tea, ayurvedic-proprietary-organics, ayurvedic-proprietary-medicines, product-range, sight-seeing-gallery, de/lakshya-yoga-retreat-2017, de/behandlung-in-kerala.html). Kept as-is; normalise at wiring.
- **Trailing-slash drift**: several links omit the trailing slash the canonical form uses (`/weight-loss-programme`, `/sitemap`, `/arogya-kendra`, `/product-range`). Kept as-is.
- **External**: `https://whyayurveda.org/` (Blog & News) — no `rel` in source.
- **Coverage gap vs XML**: 25 URLs appear in `sitemap_index.xml` but not in this page (all-programs, gallery, terms-and-conditions, cookie-policy, disclaimer, legal-notice, privacy-statement, learn-about-ayurveda, treatment-programs, training-programs, wellness-programs, yoga-meditation-programs, yoga-retreats, walk-in-ayurveda-treatment, jobs/business-development-manager, kairali-air-india-maharaja-club.html, family-ayurvedic-retreat-kerala.html, new-to-yoga-teacher-training, lakshya-yoga-retreat-2017, revitalizing-and-strengthening-treatment-for-cancer-patients, and 5 more). **Owner decision: add them to the HTML sitemap or leave the XML as the fuller index.** Not added — no authority to invent entries.

## Register-violation flags (brand §12.2)
All are verbatim live link labels or the fixed closing block; none introduced by me.
- "resort" — *Wellness Resort Kerala* (PPC landing page title)
- "retreat" — 20+ labels across Archive → Retreat, Yoga, Packages, PPC
- "luxury" — *World Luxury Award Winner* in the fixed closing block (proper noun, kept per brief)
- "guests" — none on this page
- The word "Village" appears throughout as part of proper nouns.

## Drafted content inventory
One item only, marked on-page "DRAFT — approve or replace":
- Standfirst: "Every page on this site, in one list. Sections follow the order of the main navigation. Type a word to narrow the list to the pages that match it."
Two short unmarked orientation lines under section headings ("Individual treatment programmes, listed as they appear in the main navigation." / "Everything else on the site, grouped as the live navigation groups it." / "Past programmes and superseded pages, kept live in the source.") — say so if these should carry the DRAFT marker too, or be cut.

## Images
Hero band reuses `assets/img/article/our-story.png`, already self-hosted, identical to the live top banner (`/wp-content/uploads/2023/11/our-story.png`). No Codex image ask.

## Filter
Client-side, filters on link text only. Typing hides non-matching rows and empty groups; count is read from the DOM at mount, so no hard-coded total. Degrades to the full list with JS off. Tweaks exposed: `showFilter` (off = plain directory), `density` (compact tightens rows to the 44px minimum).

## Done-bar
- SEO head verbatim from live — recorded above, defect flagged.
- Link audit vs source — complete, defects listed.
- WCAG 2.2 AA — 17px links, 1.4 line-height in rows / 1.7 in prose, 44px minimum row height, green #006038 on white ≈ 6.9:1, no hover-only disclosure, single h1, h1→h2→h3→h4 unskipped, visible focus ring, reduced-motion honoured.
- Register flags — listed above.

## Mobile view (390px)
Separate layout, not the desktop reflowed. Eleven collapsed accordions, one per section, each summary carrying the section name and a live page count; all closed on load so the whole site is one screen of eleven rows. The desktop's linked section headings become explicit "— section page" rows inside each accordion (10 extra rows, which is the 197 → 207 link difference between the two views). Jump chips live inside a collapsed "Jump to a section" block rather than a sideways-scrolling rail; tapping a chip opens its accordion. Filter is sticky at the top and auto-opens every section holding a match. Rows are 52px, summaries 64px. Both `[TO CONFIRM]` markers carried across unchanged. Tweaks: `showFilter`, `sectionsOpen` (all sections expanded on load).

## Checks run on both views
- Desktop: 197 link rows, 196 unique targets (the one duplicate is the known source defect), 1 h1, heading run h1→h2→h3→h4 with no skip, 0 rows under 44px, 0 `href="#"`, 0 corrupted hrefs, hero image resolves at 1440×524, no console output.
- Mobile at 360px: 207 link rows across 11 sections, 1 h1, no skipped heading level, 0 rows under 44px, no element overflows its container (the only wide node is the 1px visually-hidden filter label), both `[TO CONFIRM]` markers present, no console output.

## Layout-at-extremes note
Desktop: the three `More` columns are hand-balanced, so a family page with a much longer About or Things-to-do list would leave one column short, and under about twenty links the three-column grid reads as empty — both want a two-column auto-flow. Mobile: the accordions absorb any length, but Packages (53) and Archive (45) are already single scrolls of roughly 2,700px once opened, so a section past about sixty links needs a second tier of accordions inside it rather than one long list.
