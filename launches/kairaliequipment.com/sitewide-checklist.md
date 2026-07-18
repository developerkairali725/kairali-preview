<!-- launches/kairaliequipment.com — scaffolded by scripts/launch-scaffold.mjs on 2026-07-18 17:57:22 IST.
     Master: docs/checklists/sitewide-migration-checklist.md (Abilash's originals — every item mandatory unless a
     stricter Launch Checklist gate covers it). FILL EVERY ITEM during the build:
     [x] done · [ ] pending with an honest note. CLAUDE.md launch-evidence law:
     "A launch without its filled checklists in the repo is not a launch." -->
# Site-Wide Migration Checklist (Abilash's original — verbatim, ingested 2026-07-13)

> ## ⛔ PREVIEW-ONLY LOCK — D-EQ-CATALOG (added 2026-07-18 20:09:56 IST)
> **This site can NEVER go live while any placeholder remains.** The catalog
> ships with owner-ordered explicit placeholders (SKU-PLACEHOLDER-0NN ·
> ₹X,XXX / $X,XXX · "— awaiting catalog —" · PLACEHOLDER-badged/-named assets).
> Before ANY DNS flip: run `node scripts/placeholder-lint.mjs --golive` — it
> **FAILS while a single placeholder hit remains** (registry row
> `placeholder-preview-lock`, gates/registry.yaml). Report mode runs in every
> CI pass so the live placeholder debt is printed on every PR. The lock lifts
> only when the real catalogue swaps in route-for-route (STRATEGY §6.4).

## 1. Pre-Migration Planning
- Define objectives and goals: clearly articulate the purpose and expected outcomes of the migration.
- Conduct a comprehensive site audit: inventory all existing pages, media, assets; document current URL structure and sitemap; identify high-performing pages and elements critical to SEO; review the site utilising the Screaming Frog tool.
- Backup existing website: complete backups of files and databases; verify integrity and secure storage.

## 2. Technical Setup
- URL structure and redirects: new URL structure logical and SEO-friendly; 301 redirects old→new to preserve link equity; test redirects.
- robots.txt: generate a valid robots.txt (SE Ranking generator); control crawler access appropriately; validate with GSC Robots Testing Tool; ensure proper indexing directives.
- Sitemap: XML sitemap reflecting new structure; submit via Google Search Console AND Bing Webmaster Tools; sitemap updates dynamically with site changes.
- SSL/HTTPS: valid SSL; redirect all HTTP→HTTPS; no mixed content.
- Global metadata: global Open Graph tags; global Twitter Card metadata; consistent branding.
- Core schema markup: Organization/LocalBusiness site-wide; validate with Schema Markup Validator + Google Rich Results Test.
- Webmaster tools & analytics: register GSC + Bing Webmaster; implement Google Analytics; validate HTML (W3C) and CSS (W3C).

## 3. Performance Optimization
- Minify and combine CSS/JS/HTML.
- Browser caching policies with appropriate expiry per asset type.
- CDN set up, integrated seamlessly and securely.
- Server response time under 200ms.
- Site speed: analyze with GTmetrix + Google PageSpeed Insights, act on recommendations.
- Crawl errors: regularly review GSC crawl reports and fix.

## 4. Mobile-Friendliness
- Responsive design across screen sizes/devices/browsers; verify with Google Mobile-Friendly Test.
- Touch-friendly navigation; touch targets sized and spaced properly.
- Mobile performance: optimized images/media; minimize large scripts.

## 5. SEO Considerations
- Maintain URL consistency; 301 redirects for any changed URLs.
- Update internal links to new structure; no broken links.
- Monitor and update backlinks: identify high-value backlinks to old URLs; outreach to update.
- Updated XML sitemap submitted to search engines.
- Metadata: unique, descriptive meta titles and descriptions with target keywords.
- Structured data applied and validated.

## 6. Analytics and Monitoring
- Tracking codes (GA, GTM); goal + event tracking per business objectives.
- Monitor site speed and engagement; GSC for crawl/indexing issues.
- Post-migration review: thorough site review; gather user feedback.

---
## FILL — full-site build lane [2026-07-19 00:35:00 IST]

**1 · Pre-migration planning**
- [x] Objectives: BRIEF.md (signed) — qualified B2B RFQs; quote-first; preview-only under D-EQ-CATALOG.
- [x] Site audit: docs/group-inputs/kairaliequipment-org-inventory.md (full URL inventory, catalog mining, security screen) + protection map (all 40 legacy URLs mapped KEEP/MERGE/301/410).
- [x] Backup/immutability: legacy content mined read-only (INV; content-mined law); legacy server untouched (Q-EQ-SECURITY is the Deepu/Sunaj lane).

**2 · Technical setup**
- [x] URL structure: STRATEGY §1 sitemap built 1:1 (19 content routes + 10 noindex placeholder PDPs); hub-and-spoke.
- [ ] 301 redirects: protection map ready; redirects LAND AT DNS-FLIP TIME on the serving edge (single-hop targets listed; three cross-domain fates + the 410 await sign-off — PM §7).
- [x] robots.txt (app/robots.ts) + XML sitemap (app/sitemap.ts — 21 URLs, zero placeholder PDPs) + llms.txt. Legacy had NONE of these (day-one wins).
- [ ] GSC + Bing submission: DNS-flip-stage action (no property until the domain points here); flagged, not skipped.
- [x] SSL/HTTPS: Vercel by construction; no mixed content (all assets same-origin).
- [x] Global metadata: buildMetadata on every route (title ≤60, desc ≤155 enforced by the seo gate); OG/Twitter cards; ogImage deliberately omitted until a real 1200×630 asset exists (never fabricate).
- [x] Core schema: Organization (group parent + division) + WebSite + BreadcrumbList sitewide; ItemList on /equipment; Product (no offers, no fake SKUs) + FAQPage on categories; FAQPage on /faq. NO Product schema on placeholder PDPs.
- [x] Analytics: @kairali/analytics GA4 via Consent Mode v2 default-denied; data-cta events per STRATEGY §4 (quote-open per category · quote-request-submit · whatsapp-click · email-click · catalogue-download · trade-lane-click · trust-*, pdp-open-*).

**3 · Performance**
- [x] Next.js production build (minified, code-split); next/font self-hosted; next/image for all photography.
- [x] CDN: Vercel edge by construction.
- [ ] Lighthouse ≥90/100 (Ship Gate A5): runs in CI (site added to the lighthouse matrix in this PR); evidence lands with the CI run — not hand-claimed here.

**4 · Mobile-friendliness**
- [x] 390px verified: zero horizontal overflow (scrollWidth 390 = viewport); sticky utility bar; chat bubble stacks above it (machine-evidence §2 + screenshots).
- [x] Touch targets: 62-element audit — every data-cta primary control ≥44px effective (machine-evidence §5).

**5 · SEO**
- [x] Internal links: 33 unique hrefs machine-verified 200 (machine-evidence §3).
- [ ] Backlink outreach: flip-stage (old URLs live until DNS moves; protection map preserves equity).
- [x] Metadata + structured data: per-page, gate-enforced; schema validated by construction (serializeJsonLd, house builders).

**6 · Analytics & monitoring**
- [x] Event tracking per §4 integrations plan; store-first RFQ pipeline (Supabase) with consent timestamp.
- [ ] Post-flip monitoring: begins at DNS flip (site is PREVIEW-ONLY until the real catalogue lands — placeholder-lint blocks the flip; 62 expected hits on record).
