<!-- launches/bulkayurvedaoils.com — scaffolded by scripts/launch-scaffold.mjs on 2026-07-18 18:04:03 IST.
     Master: docs/checklists/sitewide-migration-checklist.md (Abilash's originals — every item mandatory unless a
     stricter Launch Checklist gate covers it). FILL EVERY ITEM during the build:
     [x] done · [ ] pending with an honest note. CLAUDE.md launch-evidence law:
     "A launch without its filled checklists in the repo is not a launch." -->
# Site-Wide Migration Checklist (Abilash's original — verbatim, ingested 2026-07-13)

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
