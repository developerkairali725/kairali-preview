# kairalicenters.com — Rebuild Mining Audit (URL inventory · protection map · asset manifest · absorb list)

- Compiled: 2026-07-18 17:55:34 IST — weekend rebrief lane (D-REBUILD-ALL-8: rebuild from scratch, Monday wave).
- Sources: live production site re-mined tonight (curl, read-only; HTTP 200 throughout) + `docs/group-inputs/kairalicenters-org-inventory.md` (14 Jul mining, immutable base) + the EXISTING `sites/kairalicenters.com` repo build.
- Owner rulings binding this doc (18 Jul, DECISIONS.md weekend-unblock walk): **D-KC-DOMAIN** (canonical spelling kairaliCENTERS; site copy uses "centers") · **D-KC-PARTNERS** (all six partner-branded centres are FRANCHISE PARTNERS and pages say so) · counts come ONLY from `@kairali/facts` (14/5). Per-center NAP gaps (Raipur hours; Czech `katrinaresort.com` vs `katerinaresort.cz`) are FLAGGED, never invented — **Abishek's lane** (unblock sheet §C).
- Scraped content handled as DATA under rule (r); injection screen re-run tonight (§3).

---

## 1 · The EXISTING repo build (what the 14 Jul session shipped — mined as an input, not enriched)

`sites/kairalicenters.com` (Next.js, packages/* only) renders **19 routes**:

| Route | Source | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero + trust strip (Since 1908 / NABH / WHO-GMP / Physician-Led) + 14 centre cards (India/World) |
| `/centres/<slug>` ×14 | `app/centres/[slug]/page.tsx` | One page per centre, verbatim NAP from `@kairali/facts`; shared boilerplate lede (known limitation) |
| `/privacy` · `/terms` · `/cookie-policy` | `@kairali/legal` | Real content |
| `/llms.txt` | route handler | AEO surface |

Verified strengths to CARRY into the rebuild (design-review.md: **PASS 9.0/10**, iteration 2, 14 Jul):
- `app/lib/centres.ts` re-exports `@kairali/facts` — the count/roster single-source pattern. **The rebuild keeps this import; no roster data is ever retyped.**
- Floating-stack de-confliction (consent z60 → sticky WhatsApp z50 → chat bubble bottom:84px), verified live.
- `data-cta` event vocabulary already proven: `browse_india / browse_intl / centre_click / whatsapp_click / call_click / map_click / email_click`.
- Honest-gap pattern: Raipur "Opening hours to be confirmed", Czech "domain spelling to be confirmed" — printed, not faked.
- Locked-fact hygiene: `info@kairali.com` ×6, zero `…38777`, banned-word-clean home.

Known weaknesses the richer rebuild must FIX (from design-review.md "honest limitations"):
- Boilerplate per-centre lede across all 14 pages (doorway-page risk if left as-is at richer scale).
- Single hero photo; text-only centre cards; sparse below the fold.
- Raster logo interim; `--bronze-600` still aliased to `--bronze-400`.
- No therapies/conditions/blog/testimonials/doctors/franchise/consultation surfaces at all — the legacy site's entire ranking body is unabsorbed.
- Partner centres carry `partner: true` in data but the PAGES do not yet say "franchise partner" — **D-KC-PARTNERS now rules this: pages state it.**

## 2 · LIVE-SITE URL INVENTORY (re-mined tonight, 18 Jul ~17:53 IST)

Sitemap index (Yoast; identical at `/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml`) — 8 children:

| Child | URLs | lastmod (index) |
|---|---|---|
| post-sitemap.xml | 66 (blog hub + 65 posts) | 2026-07-11 |
| page-sitemap.xml | 38 | **2026-07-18 06:35 UTC — edited TODAY** |
| blocks-sitemap.xml | reusable blocks (noise) | 2024-08-14 |
| product-sitemap.xml | 6 (shop + 5 region pages) | 2025-07-03 |
| category-sitemap.xml | 2 | 2026-07-11 |
| post_tag-sitemap.xml | **214 tag archives** | 2026-07-11 |
| product_cat-sitemap.xml | woo cats | 2025-07-03 |
| author-sitemap.xml | 3 (gaurav, gita-ramesh, abishek-ramesh) | 2026-04-27 |

**Indexable content URLs: ~110** (38 pages + 66 posts + 6 products). Plus ~220 taxonomy/author archives (thin).

### 2a. Pages (38, verbatim slugs)
`/` · my-account/wishlist · track-order · shop · cart · my-account · privacy-policy · thank-you · family · terms-condition · therapies · treatments · franchise · career · skin-disorders · hypertension · panchakarma · shirodhara · kadikizhi · pizhichil · navarakizhi · elakizhi · udhwarthanam · veda-diet · nasyam · ayurvedic-infertility-treatment · contact-us · offer · pain-management · ayurvedic-weight-loss · blogs · ayurvedic-retreat · family-health-program · abhyangam-or-abhyanga · online-consultation · locations · **testimonials** · about-us

### 2b. Posts (66 — full list, verbatim slugs, for the per-post triage in §4c)
blog (hub) · 10-amazing-benefits-of-ayurveda-in-your-daily-life · the-10-leading-reasons-to-see-an-ayurvedic-physician · secret-ayurvedic-habits-for-a-healthier-life-are-shared-by-an-expert · 5-secret-ayurvedic-remedies-for-arthritis · amazing-secret-boost-your-corporate-wellness-and-health-with-ayurveda · 5-super-simple-ways-to-overcome-anxiety · top-4-natural-detox-methods-that-works · the-secret-ayurvedic-therapies-and-tips-to-reduce-stress-and-depression-will-surprise-you · the-5000-year-old-secret-to-treat-rheumatoid-arthritis-will-amaze-you · did-you-know-the-ayurvedic-remedies-for-stress-and-anxiety · amazing-treatment-of-knee-and-joint-pain-in-ayurveda · secret-ayurvedic-weight-reduction-tips-9-techniques-to-burn-abdominal-fat · the-secret-of-ayurvedic-healing-and-restoration · ayurvedic-wellness-the-simple-solution-to-your-employees-health · ayurvedic-secret-for-protecting-your-lungs-from-air-pollution · rejuvenation · infertility-treatments-by-kairali · top-3-amazing-natural-ways-to-treat-acid-reflux · secret-ways-to-deal-with-anxiety-stress · the-secret-ayurvedic-approach-to-reversing-diabetes · 5051-2 · case-study-psoriasis-87-relief-in-just-14-days-at-kairali-ayurvedic-centre · from-discomfort-to-delight-a-case-study-on-ayurvedic-healing-treated-hypercholesterolemia-through-ayurvedic-treatment · achieve-sustainable-weight-loss-with-ayurvedic-treatments-unlocking-the-expertise-of-kairali-ayurvedic-centre · unlock-the-power-of-ayurveda-beat-the-heat-with-ayurvedic-summer-solutions · embracing-ayurveda-the-secret-key-to-wellness-in-the-rainy-season · monsoon-health-sos-act-fast-rejuvenate-your-immunity-with-karkidaka-chikitsa · eye-flu-delhi-ncr · sciatica-treatment · reverse-pcod · why-you-need-an-ayurvedic-emotional-detox-30-reasons · neglecting-ayurveda-indias-5-health-deficiencies-unveiled · breathe-easy-ayurvedic-solutions-to-delhis-air-pollution-woes · weightloss · crack-the-cold-code-ayurvedic-tips-to-conquer-winter-health-hurdles · winters-best-kept-secrets-ayurvedic-tips-for-holistic-health · 7-mistakes-affecting-your-physical-wellbeing · unveiling-ayurvedas-best-kept-secrets · secret-ayurvedic-skincare-solutions-for-pre-post-celebration-glow · get-surgery-free-relief-from-chronic-pain · unlocking-the-secrets-of-kapha-dosha-a-comprehensive-guide · unlocking-the-secrets-of-pitta-dosha-a-comprehensive-guide · unlocking-the-secrets-of-vata-dosha-a-comprehensive-guide · abhyangam-body-massage-the-corporate-secret-to-health · this-summer-stay-cool-top-ayurvedic-hacks-you-need-to-try · ayurvedic-secrets-for-elderly-knee-pain-relief · oral-health · monsoon-wellness · monsoon-detox · ayurvedic-lifestyle · monsoon-ayurveda · panchkarma-for-weight-loss · festive-detox · air-pollution · dont-let-these-5-shocking-holi-mistakes-ruin-your-festive-fun · life-changing-journeys-health-through-ayurveda · why-heart-attacks-are-striking-so-early-an-alarming-wake-up-call · the-real-reason-you-keep-catching-viral-fevers-and-its-not-just-the-weather · ayurveda-for-chronic-pain-relief · post-festive-detox · pollution · gut-health-secrets-how-an-aiims-doctor-lost-15-kg-naturally · its-not-your-effort-its-your-hormones-working-against-you · ayurvedic-treatment-for-lifestyle-disorders · monsoon-health-problems

### 2c. Products (6) — WooCommerce "product" CPT repurposed as REGION landing pages
`/shop/` + `/product/bihar/` · `/product/west-bengal/` · `/product/gujarat/` · `/product/uttar-pradesh/` · `/product/delhi-ncr/` — regional SEO/enquiry pages, not centres, not products.

### 2d. Centre roster — re-verified tonight against live `/locations/`
**Still 14 centres / 5 countries** (INDIA ×8, WORLD ×6), matching `@kairali/facts` exactly. No roster drift since 14 Jul. Counts on the rebuild come ONLY from the package's computed constants (`CENTRES_COUNT` / `COUNTRIES_COUNT` / `CENTRES_NETWORK_LINE`).

## 3 · LIVE-STATE DELTAS since the 14 Jul mining (important — the base inventory is now partly stale)

1. **The SEO-spam injection is GONE.** The hidden `<marquee>` casino-link block (org-inventory §9) returns **0 occurrences** tonight on home, /locations/, /about-us/, /franchise/, /online-consultation/, /testimonials/ (grep marquee|casino|flowerhome|budsandbrews|veracruz = 0 on all fetched pages). Remediation appears done on the live WP (Deepu/Sunaj lane). The rebuild rule stands regardless: **carry NO legacy template markup**; a once-compromised install's markup is never trusted.
2. **`/testimonilas/` (misspelled slug) is now `/testimonials/`** — page-sitemap edited 17 Jul 08:40 UTC. The protection map must 301 BOTH spellings (the misspelt one lived for years and may hold links).
3. **`/about-us/` edited 18 Jul 06:35 UTC** — someone is actively editing the live site TODAY. Title tags now mix spellings: home = "Kairali - The Ayurvedic Healing **Centre** in Delhi", about-us = "About Us - Kairali Ayurvedic **Center**"; footer = "Copyright 2026 © Kairali **Centers**". D-KC-DOMAIN resolves the rebuild's spelling (centers), but the live edits mean **mining must be re-run just before the Monday build session** — tonight's snapshot may not be final.
4. Founding copy unchanged: "wellness legacy of more than 10 decades … formally found in 1989" — the 1908-vs-1989 heritage reconciliation (org-inventory §8.5) is STILL open for copy.

## 4 · PROTECTION MAP (every legacy URL → KEEP / MERGE / 301; single-hop targets; Build-Decision-Matrix rule 2)

**Status: PROPOSED — becomes final at the strategy gate.** GSC ranking data for the property (spelling per D-KC-DOMAIN) has not been pulled into this pass; fates marked [GSC] (GSC-check) should be confirmed against Search Console before any flip, per rule 2 ("Search Console data ranks the URLs when available"). No flip happens until "lean at birth, complete at launch" is satisfied (rule 3).

### 4a. Pages (38)

| Legacy URL | Fate | Target / rebuilt page | Why |
|---|---|---|---|
| `/` | KEEP | `/` (home) | Hub of everything |
| `/locations/` | 301 | `/centers/` | Hub replaces single-page directory (hub slug spelling per D-KC-DOMAIN); every center gets its own page |
| `/about-us/` | KEEP | `/about` (301 slug) | Heritage/E-E-A-T anchor; 1908-vs-1989 copy must be reconciled first |
| `/family/` | MERGE | into `/about` | Founder-family story is the about page's spine (docs/group-inputs/kairali-lineage.md) |
| `/therapies/` | KEEP | `/therapies` hub | Therapy cluster hub |
| `/treatments/` | MERGE [GSC] | into `/therapies` (301) | Near-duplicate hub; keep ONE cluster entry (if GSC shows independent rankings, keep as conditions hub instead) |
| `/panchakarma/` `/shirodhara/` `/kadikizhi/` `/pizhichil/` `/navarakizhi/` `/elakizhi/` `/udhwarthanam/` `/nasyam/` `/abhyangam-or-abhyanga/` | KEEP | `/therapies/<clean-slug>` (301 root→nested) | 9 real therapy pages — the site's educational body; scrub "cure" claims |
| `/skin-disorders/` `/hypertension/` `/pain-management/` `/ayurvedic-weight-loss/` `/ayurvedic-infertility-treatment/` `/family-health-program/` `/veda-diet/` | KEEP | `/conditions/<slug>` or `/programmes/<slug>` (301) | Condition/programme SEO pages; claims-gated copy (no cure/treat verbs) |
| `/testimonials/` (+ legacy `/testimonilas/`) | KEEP | `/testimonials` | 11 video testimonials + Google-review quotes — genuine ones only; 301 BOTH slug spellings |
| `/franchise/` | KEEP [FLAG] | `/franchise` | Lead-gen for partner recruitment; per D-KC-PARTNERS the network IS partly franchise. NOTE: ayurvedafranchise.com is the canonical franchise BUILD (Decision #4) — this page presents the center-network opportunity and routes enquiries to info@kairali.com; cross-link, don't duplicate |
| `/career/` | KEEP (lean) | `/careers` (301) | Real intent, thin page; lean rebuild |
| `/online-consultation/` | KEEP | `/online-consultation` | Category-parity lever (remote consult for an international network) |
| `/contact-us/` | KEEP | `/contact` (301) | Corporate contact + enquiry; the ONLY legacy page with a consent checkbox |
| `/blogs/` | 301 | `/blog` | One blog hub (post-sitemap already has `/blog/`) |
| `/offer/` | 301 [FLAG] | `/contact` | Promo page ("25% off"); discount claims don't carry into rebuild copy unverified |
| `/ayurvedic-retreat/` | MERGE [FLAG] | into `/about` network section | References KTAHV ("luxury" ×1 = clinical-lock violation candidate); KTAHV references snap to clinical register; do NOT cross-domain-301 (loses equity) |
| `/privacy-policy/` | 301 | `/privacy` | `@kairali/legal` |
| `/terms-condition/` | 301 | `/terms` | `@kairali/legal` |
| `/thank-you/` | KEEP (noindex) | `/thank-you` | Form destination; conversion tracking |
| `/shop/` `/cart/` `/my-account/` `/my-account/wishlist/` `/track-order/` | 301 | `/` | Dead WooCommerce scaffolding; Factory rule: no cart/checkout ever — commerce is the Shopify store |

### 4b. Products (region pages, 5)

| Legacy URL | Fate | Target | Why |
|---|---|---|---|
| `/product/bihar/` | 301 | `/regions/bihar` (KEEP-AS-PAGE, rebuilt) | Region enquiry page funnelling to the Patna center page |
| `/product/west-bengal/` | 301 [FLAG] | `/regions/west-bengal` | No WB center exists — page funnels to nearest (Patna/Guwahati) or online consultation; honest copy, no invented center |
| `/product/gujarat/` | 301 | `/regions/gujarat` | Funnels to Vadodara center |
| `/product/uttar-pradesh/` | 301 [FLAG] | `/regions/uttar-pradesh` | No UP center — funnels to Delhi-NCR centers + online consult |
| `/product/delhi-ncr/` | 301 | `/regions/delhi-ncr` | Funnels to Mehrauli/Sirifort/Gurgaon/Faridabad cluster |

### 4c. Posts (65 + hub) — triage classes (per-post fates final at strategy gate, [GSC] = GSC-check-first)

| Class | Posts (by slug) | Fate |
|---|---|---|
| **Evergreen pillar** — KEEP as `/blog/<slug>`, refresh dates, scrub "secret/amaze" clickbait + cure-claims | 3 dosha guides (vata/pitta/kapha) · 2 case studies (psoriasis, hypercholesterolemia) · sciatica-treatment · reverse-pcod · ayurveda-for-chronic-pain-relief · ayurvedic-treatment-for-lifestyle-disorders · gut-health-secrets-aiims · 10-amazing-benefits · 10-leading-reasons-physician · knee-and-joint-pain · rheumatoid-arthritis · reversing-diabetes · infertility-treatments-by-kairali · weight-reduction-9-techniques | KEEP (≈17) |
| **Topic-merge** — content folds into a stronger page | corporate-wellness ×3 (→ family-health/corporate programme page) · anxiety/stress ×4 (→ a stress-management condition page) · detox ×4 (→ panchakarma/detox therapy page) · air-pollution/lungs ×4 (→ one respiratory-health post) · monsoon ×6 (→ one seasonal-care guide) · winter ×2 · summer ×2 · festive ×3 (→ one seasonal hub each) | MERGE with 301 to the absorbing page (≈28) |
| **Thin/orphan** — one-word or stub slugs | rejuvenation · weightloss · oral-health · pollution · ayurvedic-lifestyle · 5051-2 · monsoon-health-problems · panchkarma-for-weight-loss (dupe of weight cluster) | 301 to nearest pillar or `/blog` hub (≈8); NEVER redirect a ranking page to a thin target — [GSC]-check every one against GSC before sentencing |
| **Local-topical** | eye-flu-delhi-ncr · breathe-easy-delhi-air-pollution | KEEP or fold into `/regions/delhi-ncr` ([GSC]) |
| Remaining editorial | everything else | Default MERGE-or-301 ([GSC]), decided post-GSC |

### 4d. Taxonomy/author/junk

| URLs | Fate |
|---|---|
| 214 `/tag/*` archives | 301 → `/blog` (no tag archives on rebuild; thin-content liability) |
| `/category/blogs/` | 301 → `/blog` · `/category/uncategorized/` → 410 |
| `/author/gaurav/` `/author/gita-ramesh/` `/author/abishek-ramesh/` | 301 → `/about` (or to author profiles if the blog keeps bylines — Gita Ramesh is a named author voice in the fleet system) |
| blocks-sitemap.xml contents | Not carried; WP-internal noise |
| `/wp-content/uploads/*` (367 refs) | Assets re-hosted; no redirect duty |

## 5 · ASSET MANIFEST

- **183 legacy originals (~41 MB, 181 unique files) already mined** to `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-kairalicenters/` with `manifest.tsv` (filename · source_url · bytes) — verified present on disk tonight (184-line manifest). Binaries stay OUTSIDE git per the asset-mining checklist.
- Contents: therapy photography (Abhyangam, Shirodhara, Pizhichil, …), 4 hero images (`2021/09/1–4.jpg`), 6 physician portraits + founder (Mrs Gita Ramesh, Dr Arathi, Dr Arundhathi Suresh, Dr Pratibha, Dr Manjusha Mohan, Dr Shari K), infographic assets.
- In-repo today: `sites/kairalicenters.com/public/images/hero-reception.jpg` (1800px hero) + `kairali-icon.svg` + `og.jpg`.
- **Gaps for the richer rebuild:** (a) NO per-center photography exists for any of the 14 centers — the strongest doorway-page defence is per-center local imagery; request from center managers via Abishek's NAP round, or ship center pages with therapy/brand imagery + unique local copy; (b) SVG logo lockups still pending from design team (raster interim in use); (c) 11 testimonial VIDEOS on /locations/ are YouTube embeds — capture the video IDs at build time, don't re-host.

## 6 · WHAT THE RICHER REBUILD MUST ABSORB (the completeness contract — "lean at birth, complete at launch")

**Every center (14 — from `@kairali/facts`, never retyped):**
8 India — New Delhi Mehrauli · New Delhi Siri Fort · Gurgaon Sector 46 · Faridabad Sector 15 · Guwahati · Raipur (hours FLAGGED → Abishek) · Patna Boring Road (partner) · Vadodara Race Course Road (partner); 6 international — Yokohama · Tokyo Seijo · Tokyo Minami-Aoyama (Japan ×3, ayus.co.jp partner) · Phoenix Mauritius (kairali.mu partner) · Prague Vinohrady (Katerina Resort partner; domain typo FLAGGED → Abishek) · Kuwait City Sharq (partner).

**Every partner, stated as such (D-KC-PARTNERS):** Patna/Surya Healthcare · Vadodara/M-s RETROFIT · Japan ×3/ayus.co.jp · Mauritius/kairali.mu · Czech/Katerina Resort · Kuwait — all six are **franchise partners and the pages say so** (schema: `LocalBusiness`/`HealthAndBeautyBusiness` for the overseas "Health Spa" partners, never `MedicalClinic` for a spa; the franchise-partner statement is also the honest E-E-A-T frame and feeds the /franchise recruitment story).

**Locality-page candidates (each = one indexable, uniquely-written page or it does not ship):**
- 14 per-center pages `/centers/<slug>` (city+center in H1/title, real NAP, geo, hours, directions/landmark, that center's therapies, named physicians where verified, local FAQ block).
- 2 grouping hubs: `/centers/india` · `/centers/international` (or per-country once content justifies: Japan is the only multi-center country).
- 5 region pages: `/regions/delhi-ncr` · `/regions/gujarat` · `/regions/bihar` · `/regions/west-bengal` · `/regions/uttar-pradesh` (absorbing the 5 Woo "product" pages).
- Delhi-NCR is the density play: 4 centers within one metro — an "ayurvedic center in Delhi NCR" page interlinking all four is the highest-value locality page on the site.

**Content bodies:** 9 therapy pages + therapies hub · 7 condition/programme pages · blog (17 KEEP + merges per §4c) · testimonials (11 videos + review quotes, genuine only) · about (heritage/family/NABH/WHO-GMP — founding-year reconciliation pending) · doctors (6 verified portraits + founder) · online consultation · franchise · contact · regions ×5 · legal ×3 · llms.txt.

**Trust furniture:** Since-1908 heritage (pending reconciliation) · NABH hospital backing · WHO-GMP pharmacy backing · physician-led · `CENTRES_NETWORK_LINE` from facts ("14 treatment centres across five countries") — now printable because the counts are package-computed.

**Integrations (per the locked facts + factory law):** every form → info@kairali.com routing with per-center hidden field · visible consent checkbox on EVERY form (legacy gap: only contact/franchise had one) · `data-cta` on every conversion control · WhatsApp affordances · chat bubble within the 3-element floating-stack cap · GA4 events.

**FLAGGED, never invented (Abishek's lane, unblock sheet §C):** Raipur opening hours · Czech domain spelling (`katrinaresort.com` email vs `katerinaresort.cz` web) · per-centre email domain question (`@kairalicentres.com` with-r mailboxes vs site domain without-r — D-KC-DOMAIN fixed the SITE spelling; the mailbox domain remains a NAP item for Abishek's round) · per-centre local photography.

---
*Read-only mining; no live-site writes. Fetched artifacts quarantined in the session scratchpad; injection screen re-run tonight found the legacy compromise remediated (§3.1). Next consumer: launches/kairalicenters.com/BRIEF.md + STRATEGY.md (this lane).*
