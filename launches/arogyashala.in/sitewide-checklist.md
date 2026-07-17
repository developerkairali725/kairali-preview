# Site-Wide Checklist — arogyashala.in (retro-filled)

**2026-07-17 12:07:08 IST · Master: docs/checklists/sitewide-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**BACKFILLED 2026-07-17 (build merged 16 Jul 2026, PR #84) — retro-filled under the arogyakendra honest-pending precedent; Session 2B evidence backfill**
**Marks: [x] done · [~] partial · [ ] pending (reason given) · [n/a] not applicable. Evidence is real command output, a file inspected today, a committed report, or PR #84 CI — no self-reported success.**
**Context: brand-protective one-pager (entity "group", register A, EN-only, IN market — site.config.json). Rebuild of the legacy arogyashala.co.in (14 mined pages with cure-claims and a "Group Since 1908" footer — content-mined/arogyashala.co.in). MERGED, NOT LAUNCHED: no DNS flip has happened, and serving this on arogyashala.in also lifts the .co.in forward HOLD — that flip is a HUMAN action (Abilash). Every production-hostname item below is pending-DNS-flip. Retro-audit source: docs/reports/2026-07-17-prompt1-retro-audit.md §1.**

## 1. Pre-Migration Planning
- [x] Objectives defined — D-SEO-DUAL intent in docs/site-briefs/arogyashala-build-2026-07-16.md: DEFEND branded queries / ATTACK trade-intent queries / MUST-NOT franchise-commercial queries; audited against in seo-aeo-geo-report.md (intent scorecard: DEFEND ✓, ATTACK ✓ after "become a Kairali retailer" landed in page.tsx:204, MUST-NOT fully honoured). · BACKFILLED 2026-07-17
- [~] Comprehensive site audit — mine-first inventory instead of Screaming Frog: content-mined/arogyashala.co.in holds all 14 legacy pages (`ls *.html | wc -l` → 14 today); "Since 1908" footer found in 14/14 files, cure-claim language in 2 files (grep run 2026-07-17). Protection map derived from it (next.config.ts comment cites the brief). Screaming Frog itself: not run — recorded honestly. · BACKFILLED 2026-07-17
- [~] Backup existing website — legacy content is mirrored read-only in content-mined/arogyashala.co.in (immutable raw-sources layer, CLAUDE.md doctrine (a)); no file/database backup is possible (no hosting access to the .co.in site, which remains live). · BACKFILLED 2026-07-17

## 2. Technical Setup
- [~] URL structure & redirects — single canonical URL `/` + 3 noindexed legal routes; all 14 legacy .aspx URLs map single-hop (13 → `/`, the real misspelled `pirvacy-policy.aspx` → `/privacy`). Verified today: `.next/routes-manifest.json` contains exactly 14 .aspx redirects, statusCode 308 (Next.js `permanent: true`; master says 301 — 308 is the modern permanent equivalent, recorded honestly); guard test "redirect map covers every mined legacy page, single-hop" re-run green today. seo-aeo-geo-report.md curl-tested 14/14 on the local prod build. Production-hostname redirect test: PENDING DNS flip. · BACKFILLED 2026-07-17
- [x] robots.txt — app/robots.ts via @kairali/seo buildRobots; built body inspected today (.next/server/app/robots.txt.body): `User-Agent: * / Allow: /` + `Sitemap: https://arogyashala.in/sitemap.xml`. GSC robots-tester validation: pending GSC property (DNS-gated). · BACKFILLED 2026-07-17
- [~] Sitemap — app/sitemap.ts emits homepage-only sitemap (built body inspected today: loc `https://arogyashala.in/`, lastmod 2026-07-16T15:29:47Z, monthly, priority 1 — consistent with the three legal routes being noindexed). Submission to GSC and Bing: PENDING — no properties exist, DNS-gated. · BACKFILLED 2026-07-17
- [~] SSL/HTTPS — zero `http://` references in the rendered HTML (seo-aeo-geo-report.md PASS row, posture only). Production-domain HTTPS: pending DNS flip. Vercel project existence UNVERIFIED: `curl -s -o /dev/null -w "%{http_code}" https://kairali-web-factory-arogyashala-in.vercel.app/` run today → **404**; PR #84's status contexts list 6 Vercel projects, none named arogyashala-in. · BACKFILLED 2026-07-17
- [x] Global metadata — rendered .next/server/app/index.html grep-verified today: og:title/description/url/site_name/locale(en_IN)/type + og:image `https://arogyashala.in/og.jpg` with 1200×630 width/height meta + twitter summary_large_image. og.jpg is a real 74.8 KB asset, inspected today — carries the CURRENT H1 and no consent banner (critic it.2 finding 7 was fixed before merge; design-review.md documented the bad first capture). · BACKFILLED 2026-07-17
- [x] Core schema markup — Organization + WebSite + FAQPage + BreadcrumbList as one @graph (app/page.tsx:53-73), parses clean (seo-aeo-geo-report.md PASS row). **Fleet-wide catch inside this PR (schema gate working):** both auditors independently found `kairaliOrganization()` publishing `foundingDate: "1908"` on EVERY factory site — the machine-readable form of the claim PR #65 ruled wrong. Fixed at package level inside PR #84: packages/schema/src/index.js:75 now `foundingDate: "1989"` with the licensed lineage phrasing in `description` ("a family practising Ayurveda since 1908"), regression-asserted by packages/schema/test/schema.test.js:25 (`assert.equal(org.foundingDate, "1989")` + a doesNotMatch pinning 1908 to lineage only) — both grep-verified today; rendered HTML emits `"foundingDate":"1989"` (grep-verified today). Google Rich Results Test: pending live production URL. · BACKFILLED 2026-07-17
- [ ] Webmaster tools & analytics — GSC, Bing, GA4 all PENDING: no property/stream IDs exist (packages/analytics/src/core.js reads NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GTM_ID; neither is set for this site — no IDs invented, CLAUDE.md gate 6). Instead, grep-verified today: 10 `data-cta` hooks wired in app/page.tsx (door_owner, door_verify, whatsapp_owner, email_owner, whatsapp_verify, email_verify, whatsapp_closing, email_closing, whatsapp_click, email_click) — best per-audience attribution in the fleet per design-review.md. W3C HTML/CSS validation: not run. · BACKFILLED 2026-07-17

## 3. Performance Optimization
- [x] Minified assets — Next.js production build, clean at merge (PR #84 CI: gate + brand-lint SUCCESS, full suite 182/182 per PR body); .next build artifacts of 16 Jul present locally. Page carries zero raster images in the document; ~525 KB uncompressed localhost total measured by the critic (design-review.md it.2 — wire transfer smaller). No build re-run for this backfill (backfill rule: no builds). · BACKFILLED 2026-07-17
- [ ] Caching policies — Vercel immutable caching for hashed /_next/static assets is the platform default, but this site's Vercel project is UNVERIFIED (curl 404 today, no arogyashala-in status context on PR #84) — cannot claim caching on a deployment not shown to exist. · BACKFILLED 2026-07-17
- [ ] CDN — same reason as caching: pending a verified Vercel project + DNS flip (two-plane rule: Cloudflare stays DNS-only/grey). · BACKFILLED 2026-07-17
- [ ] Server response < 200ms — static prerender by design, but no live deployment verified to measure against. · BACKFILLED 2026-07-17
- [ ] GTmetrix + PageSpeed Insights + Lighthouse — NOT RUN. factory-spec CI matrix never included this site — PR #84 statusCheckRollup lists factory-spec only for arogyakendra.com, kairali.com, whatisayurveda.com, kairalicenters.com; Lighthouse (Ship Gate A5) not in CI (retro-audit §1 AMBER). Recorded honestly, not fixed in this backfill. · BACKFILLED 2026-07-17
- [ ] GSC crawl-error review — pending GSC property (DNS-gated). · BACKFILLED 2026-07-17

## 4. Mobile-Friendliness
- [x] Responsive design — design-qa-report.md: zero horizontal overflow at 375×812 / 768×1024 / 1440×900 (scrollWidth == clientWidth, Playwright computed audit); critic it.2 re-measured 375 first paint after the consent/door fix (both door titles above the banner, clearances 192.0px / 28.5px). Evidence: 41 screenshots in launches/arogyashala.in/screens/ (qa-, critic-, critic2- series; counted today). Google Mobile-Friendly Test: pending live URL. · BACKFILLED 2026-07-17
- [x] Touch-friendly — critic it.2 census: zero tap targets under 44px anywhere; footer conversion links fixed to 54.4px hit boxes (globals.css:285-288 `.site-footer a[data-cta]` padding-block/negative-margin pattern — the Ship Gate A4 regression design-qa caught was closed before merge); FAQ summaries 63.7px; leaf focus rings on doors + summaries verified with real Tab keypresses (critic2-focus-door.png, critic2-focus-faq.png). · BACKFILLED 2026-07-17
- [x] Mobile performance — zero raster images in the document (og.jpg is share-card-only, not fetched by the page); self-hosted fonts (next/font, display:swap, 3 faces); no chat widget; text-node LCP on flat forest-700. Evidence: design-review.md it.2 measurements. · BACKFILLED 2026-07-17

## 5. SEO Considerations
- [~] URL consistency & 301s — canonical `https://arogyashala.in` in rendered HTML (grep-verified today, matches og:url); 14 permanent redirects build-verified (see §2) — production-hostname behaviour pending DNS flip. · BACKFILLED 2026-07-17
- [x] Internal links — two-door anchor router (#owners/#verify) verified functioning (design-qa PASS row); 3 outbound family links (kairali.com, kairaliproducts.in, ayurvedichealingvillage.com — mirrors llms.txt's site list); legal footer links resolve 200 (seo-aeo-geo-report.md). No dead internal routes on a 4-route site. · BACKFILLED 2026-07-17
- [ ] Backlink monitoring/outreach — pending DNS flip: the legacy .co.in URLs keep serving until the forward HOLD lifts, so no link equity moves yet and no outreach has happened. · BACKFILLED 2026-07-17
- [~] XML sitemap submitted — file live in the build (see §2); submission pending GSC/Bing properties (DNS-gated). · BACKFILLED 2026-07-17
- [x] Metadata — title "Arogya Shala — Kairali Branding for Ayurvedic Counters" 54 chars ≤60, exact brand + attack keyword; description 146 chars ≤155, no filler, no claims (seo-aeo-geo-report.md PASS rows; layout.tsx inspected today). · BACKFILLED 2026-07-17
- [x] Structured data applied & validated — @graph parses clean; FAQPage's 5 Q&A match the visible accordion word-for-word (seo-aeo-geo-report.md pairwise check); foundingDate 1989 after the fleet-level fix (§2). Rich Results Test: pending live URL. · BACKFILLED 2026-07-17

## 6. Analytics and Monitoring
- [ ] GA/GTM tracking — pending GA4/GTM IDs (Ship Gate B3/B4); no IDs invented; loader plumbing + 10 data-cta hooks ready (see §2). · BACKFILLED 2026-07-17
- [ ] Goal/event tracking — pending the above; the per-audience data-cta vocabulary (owner vs verify doors) is the event design, wired and DOM-verified by the critic. · BACKFILLED 2026-07-17
- [ ] Site-speed + GSC monitoring — pending GSC property and any live deployment. Monthly AI-citation query test (10 queries): due within 30 days of DNS flip (seo-aeo-geo-report.md N/A-until-flip row). · BACKFILLED 2026-07-17
- [~] Post-migration review — the committed evidence pack IS the review: design-qa-report.md (2 Critical + 7 Warning found, both Criticals fixed and re-proven), seo-aeo-geo-report.md (1 FAIL — the fleet foundingDate — fixed in-PR; 6 WARN), design-review.md (B-14 critic: it.1 8.4 FAIL → it.2 9.1 PASS, fresh re-measurement, first D-DESIGN-DIFF build — "NOT mistakable for a recolor" of arogyakendra), 41 screenshots. Outstanding: Abilash preview approval (Human Gate C1) + DNS flip + this checklist's pending rows. · BACKFILLED 2026-07-17

## Verification actually run for this backfill (2026-07-17, read-only — no builds, no Playwright)

```
$ node packages/compliance/bin/lint.js sites/arogyashala.in
compliance: 0 error(s), 3 warning(s) across 1 target(s) — PASS
# (all 3 warnings are the word "cure" inside code comments / guard-test names,
#  not shipped copy — the guards that BAN cure claims trip the string scanner)

$ node --test sites/arogyashala.in/test/guards.test.js
ℹ tests 6 · pass 6 · fail 0
# no outlet counts/locations/fees · no cure-claims · 1908 lineage-only +
# computed years · physician-implication · redirect-map coverage · locked contacts

$ node -e "…routes-manifest…"   # count the redirect map
aspx redirects: 14   (13 → / · /pirvacy-policy.aspx → /privacy · all 308 permanent)

$ ls content-mined/arogyashala.co.in/*.html | wc -l
14        # mined legacy pages; "Since 1908" in 14/14; cure-language in 2

$ curl -s -o /dev/null -w "%{http_code}" https://kairali-web-factory-arogyashala-in.vercel.app/
404       # Vercel project existence UNVERIFIED — recorded, not fixed

$ grep '"foundingDate"' sites/arogyashala.in/.next/server/app/index.html
"foundingDate":"1989"

$ grep 'rel="canonical"' sites/arogyashala.in/.next/server/app/index.html
<link rel="canonical" href="https://arogyashala.in"/>
```

## Gates at merge time (PR #84, merged 2026-07-16 15:38 UTC as e1c1651)

`gh pr view 84 --json body,statusCheckRollup` (run today): ALL checks SUCCESS — gate (incl. full-history gitleaks), brand-lint, security-review, factory-spec ×4 (NOT including this site — see §3), Vercel ×6. PR body: build clean · brand-lint 0/0 · compliance PASS · guards 6/6 · full suite 182/182 · D-DESIGN-DIFF similarity PASS · B-14 critic 9.1.
