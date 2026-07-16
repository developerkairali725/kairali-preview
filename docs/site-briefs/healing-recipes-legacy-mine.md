# healing.recipes — legacy-site mine + protection map (Build Decision Matrix step zero)

Mined: 2026-07-16 18:29:39 IST · Method: curl full-page fetches (13 pages + homepage), image download, security screen. Raw HTML banked verbatim in `content-mined/healing.recipes/` (immutable, doctrine (a)). Images (10) in `~/Claude/Kairali-Digital/image-library/healing-recipes-legacy/` (outside git).

## What the legacy site actually is (surprise finding)

**Not a books site.** The live healing.recipes is the 2017 **"Chef Retreat — Back to Roots"** event site (ASP.NET/IIS, Bootstrap 3, jQuery 1.9): a three-day food-philosophy retreat at Kairali, Palakkad. Title: "Chef Retreat | Healing Recipes | Healing Center | Ayurvedic Retreat".

- **Founders page names K R Abhilash (Promoter & Co-Founder) and Madhulika Dash (Curator & Co-Founder, food journalist).** This is Abilash's own 2017 initiative — biographical/heritage value.
- `recipes.aspx` (85KB) holds **real chef recipes with full ingredient tables** (e.g. Abhijit Saha's "Baby Vegetable Poriyal, beetroot-flavoured curd rice") — the only substantive content asset on the site.
- `press-praise.aspx` is empty ("coming soon..." since 2017).
- A `CartUtil.js` checkout skeleton exists on reservations (2017 ticketing relic).

## Defects on the live site (for the record; site is being replaced, not fixed)

1. Footer sitewide: **"© Kairali Ayurvedic Group Since 1908"** — the exact group-vs-lineage error ruled in PR #65.
2. Contact number **+91-9999231117** sitewide — not any current locked fact; validity unknown (do NOT carry to the rebuild without a ruling; locked email info@kairali.com is also present and IS correct).
3. Dead Google+ link sitewide (Google+ shut down 2019); legacy UA analytics (dead data since GA4 cutover).
4. No robots.txt, no XML sitemap; 9-year-stale event content presented in present tense.

## Security screen (rule r)

Grep screen over all 14 mined files for spam/casino/injection/hidden-link/AI-instruction patterns: **CLEAN** (exit 1, zero hits). Content is safe to read as data.

## SEO/ranking value

healing.recipes has **no GSC property** (not among the 11 enumerated 16 Jul) and is a 2017 single-event site — impressions data unavailable, expected negligible. Domain authority value is in the DOMAIN itself (exact-match .recipes), not the URLs. No content-rich ranking pages are being redirected to thin targets.

## PROTECTION MAP (every legacy URL → explicit fate)

| Legacy URL | Fate | Target | Why |
|---|---|---|---|
| / and /default.aspx | KEEP (replaced) | new / | homepage rebuilt as books showcase |
| /about-us.aspx | 301 | /author | nearest topical successor (author page); retreat-founders content banked in content-mined |
| /concept.aspx | 301 | / | 2017 event concept; no successor page |
| /recipes.aspx | 301 → **HELD open question** | / (interim) | real recipe content — see PARKED question below; content banked verbatim either way |
| /press-praise.aspx | 301 | /press | empty page; new site gets a real press section (book press: The Hindu, Gourmand) |
| /faq.aspx | 301 | / | event FAQ, obsolete |
| /gallery.aspx | 301 | / | 2017 photos banked to image-library |
| /chef-retreat-july-2017.aspx | 301 | / | one-time event page |
| /menu-july-2017.aspx | 301 | / | one-time event menu |
| /reservations.aspx | 301 | /contact | commercial intent → enquiry |
| /enquire-now.aspx | 301 | /contact | same |
| /contact-us.aspx | 301 | /contact | direct successor |
| /privacy-policy.aspx | 301 | /privacy | @kairali/legal shared page |
| /sitemap.aspx | 301 | / | HTML sitemap obsolete (new site ships sitemap.xml) |

All single-hop, implemented as Next.js permanent redirects in `sites/healing.recipes/next.config.ts` at build. DNS flip remains a HUMAN action after Abilash approves the preview (matrix rule 3).

## PARKED for Abilash (logged in QUESTIONS.md, non-blocking)

Does the 2017 Chef Retreat deserve an archive section on the new site (e.g. /retreat-2017 with the recipes + gallery + the Abhilash/Madhulika founding story), or does healing.recipes become purely the Gita Ramesh books home? v1 ships books-only per the 16 Jul ruling; the archive is additive later if wanted. The banked recipes are usable either way.
