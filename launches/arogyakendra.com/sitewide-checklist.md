# Site-Wide Checklist — arogyakendra.com (filled)

**2026-07-13 19:15:30 IST · Master: docs/checklists/sitewide-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**Marks: [x] done · [~] partial · [ ] pending (reason given) · [n/a] not applicable. Evidence is real command output or a named artifact — no self-reported success.**
**Context: brand-protective one-pager (Register row: "A (1-pagers) · Brand-protective single pages · EN · Indexed + branded query capture"). New build, not a migration — migration-only items marked n/a with reason. Live on Vercel preview domain; DNS flip to arogyakendra.com is a HUMAN action (Abilash), so every item tied to the production hostname is pending-DNS-flip.**

## 1. Pre-Migration Planning
- [x] Objectives defined — Register row: brand protection + branded-query capture; single page routing visitors to the six brand sites. Evidence: SITE_DESIGN_LOCALE_REGISTER.md line 44.
- [n/a] Comprehensive site audit / Screaming Frog — no legacy arogyakendra.com site existed to audit (new one-pager, Wave 0).
- [n/a] Backup existing website — no existing site/database; domain was parked.

## 2. Technical Setup
- [x] URL structure — single canonical URL `/`; no legacy URLs to redirect. Evidence: `next build` route table (one `/` route + metadata routes).
- [x] robots.txt — generated via app/robots.ts metadata route. Evidence (local): `curl localhost:3000/robots.txt` → `User-Agent: * / Allow: / / Sitemap: https://arogyakendra.com/sitemap.xml`.
- [~] Sitemap — app/sitemap.ts emits sitemap.xml (verified by curl, one URL, lastmod set). Submission to GSC and Bing Webmaster: PENDING — needs GSC/Bing property verification, which needs DNS at Cloudflare (Ship Gate B7, human-gated).
- [~] SSL/HTTPS — Vercel serves HTTPS on the preview domain (curl HTTP 200 over https, no mixed content: zero http:// asset references in rendered HTML). Production-domain cert: pending DNS flip.
- [x] Global metadata — OG (type/url/site_name/title/description/locale) + Twitter card in app/layout.tsx; verified in rendered HTML by curl. og:image intentionally ABSENT: no real 1200×630 asset exists; spec in IMAGE_MANIFEST.md (og-image slot) — never fabricate.
- [x] Core schema markup — Organization + WebSite + BreadcrumbList as one @graph, present in rendered HTML. Parses as valid JSON (JSON.parse in browser check). Google Rich Results Test run: pending live production URL.
- [ ] Webmaster tools & analytics — GSC, Bing, GA4 all PENDING: GA4 property/stream IDs not yet created (Ship Gate B3–B7); no analytics IDs are invented (CLAUDE.md gate 6). `data-cta` attributes (whatsapp_click, email_click, brand_click) are wired and verified in DOM, ready for packages/analytics.

## 3. Performance Optimization
- [x] Minified assets — Next.js production build; first-load JS 103 kB ≤ 130 kB budget. Evidence: build output `Route (app) / … First Load JS 103 kB`.
- [x] Caching — Vercel immutable caching for hashed /_next/static assets (platform default).
- [x] CDN — Vercel edge network serves the site (two-plane rule: Cloudflare will stay DNS-only/grey for this site).
- [~] Server response < 200ms — static prerender on Vercel edge; formal measurement pending production domain.
- [ ] GTmetrix + PageSpeed Insights — pending production URL (preview domain measurements would not carry over meaningfully); Lighthouse gate (Ship Gate A5) to be run in CI — not yet wired for this site, recorded honestly.
- [ ] GSC crawl-error review — pending GSC property (DNS-gated).

## 4. Mobile-Friendliness
- [x] Responsive design — built mobile-first at 375px, verified in browser at 375×812 (screenshots) and 1120/1280 (computed-style + geometry audit): hero stacks, cards single-column, trust card 2-col, no horizontal scroll.
- [x] Touch-friendly — all pills ≥48px min-height; sticky-bar buttons 48px; brand-tokens.css enforces ≥44px targets; leaf focus rings on all controls.
- [x] Mobile performance — no images shipped (placeholder-first = zero image bytes today); Chatbase deferred until interaction/idle; fonts self-hosted with display:swap.

## 5. SEO Considerations
- [x] URL consistency — single URL; canonical `https://arogyakendra.com` in rendered HTML (curl-verified).
- [x] Internal links — six outbound brand links (their availability is those sites' concern); in-page anchor `#top`; no dead internal routes (build route table).
- [n/a] Backlink outreach — no legacy URLs changed; nothing to update.
- [~] XML sitemap submitted — file live (see §2); submission pending GSC/Bing (DNS-gated).
- [x] Metadata — title 51 chars ≤60; description 152 chars ≤155; keyword-bearing ("Ayurvedic", "Kairali", brand terms).
- [x] Structured data applied — see §2; validated locally as parseable JSON-LD with expected @types (browser evaluation: ["Organization","WebSite","BreadcrumbList"]).

## 6. Analytics and Monitoring
- [ ] GA/GTM tracking — pending GA4/GTM IDs (Ship Gate B3/B4); data-cta event vocabulary in place per packages/analytics README.
- [ ] Goal/event tracking — pending the above.
- [ ] Site-speed + GSC monitoring — pending GSC property.
- [~] Post-migration review — this launch-evidence pack + design-review.md constitute the review; owner (Abilash) preview approval is Human Gate C1, outstanding.

## Live-URL verification (Ship Gate proof-of-work)

Deployed via push to main (Vercel project kairali-web-factory-arogyakendra-com).

Captured 2026-07-13 19:15:34 IST (real terminal output):

```
$ curl -s -o /dev/null -w "HTTP %{http_code}\n" https://kairali-web-factory-arogyakendra-co.vercel.app/
HTTP 200

$ grep -oE '<h1>[^<]*</h1>' live.html
<h1>Arogya Kendra — The Centre of Health</h1>

$ grep -o 'wa.me/919289838797' live.html | wc -l
10        # 5 anchors, each mirrored once in the RSC payload

$ curl -s https://kairali-web-factory-arogyakendra-co.vercel.app/robots.txt
User-Agent: *
Allow: /

Sitemap: https://arogyakendra.com/sitemap.xml

$ curl -s -o /dev/null -w "sitemap.xml HTTP %{http_code}\n" .../sitemap.xml
sitemap.xml HTTP 200

# Chatbase is injected client-side, so its id is in the layout chunk, not the HTML:
$ for src in $(grep -oE '/_next/static/chunks/[^"]+\.js' live.html | sort -u); do
    curl -s "https://kairali-web-factory-arogyakendra-co.vercel.app$src" | grep -q rpNt_uRW6W8EDiTf6AvYJ && echo "found in $src"; done
found in /_next/static/chunks/app/layout-c9ec458d7bf8f48f.js
```

Widget behaviour additionally verified in the local browser session: Priya bot bubble
loaded after idle and rendered its opening messages (screenshot in design review pass).

## Gates run at commit time

```
$ node packages/compliance/bin/lint.js sites/arogyakendra.com
compliance: 0 error(s), 0 warning(s) across 1 target(s) — PASS

$ pnpm --filter @kairali/site-arogyakendra build
 ✓ Compiled successfully
 Route (app)                                 Size  First Load JS
 ┌ ○ /                                      131 B         103 kB
 ├ ○ /robots.txt                            131 B         103 kB
 └ ○ /sitemap.xml                           131 B         103 kB
 ○  (Static)  prerendered as static content
```
