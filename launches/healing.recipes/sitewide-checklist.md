# Site-Wide Checklist — healing.recipes (filled, retro)

**2026-07-17 12:08:36 IST · Master: docs/checklists/sitewide-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**BACKFILLED 2026-07-17 (build merged 16 Jul 2026, PR #81) — retro-filled under the arogyakendra honest-pending precedent; Session 2B evidence backfill.**
**Marks: [x] done · [~] partial · [ ] pending (reason given) · [n/a] not applicable. Evidence is real command output, a committed report, or PR CI — no self-reported success.**
**Context: book-showcase site (register ED, entity group, EN-only — site.config.json). Rebuild of the legacy 2017 "Chef Retreat" site (mine-first done, protection map live). Merged to main as `789b523` (PR #81, 2026-07-16 19:39:16 IST) but NOT LAUNCHED: no Vercel project existed at PR time (PR #81 "Remaining" section), no DNS flip; the launch event is end of July. Everything tied to a production hostname or live URL is honestly pending. Backfill verification was read-only: no builds, no Playwright runs — file inspection, greps, `node packages/compliance/bin/lint.js`, one curl probe, and the committed reports/PR CI.**

## 1. Pre-Migration Planning
- [x] Objectives defined — launch site for the four books of Gita Ramesh; KPI = buy clicks (no prices on site by design). Evidence: PR #81 body ("official launch end of July; preview target well before ~28 Jul"), sites/healing.recipes/site.config.json (register "ED", entity "group"), docs/site-briefs/healing-recipes-books.md referenced from app source headers. · BACKFILLED 2026-07-17
- [~] Comprehensive site audit — mine-first done: legacy site identified as the 2017 "Chef Retreat — Back to Roots" event site; 14 pages banked verbatim + url-inventory.csv in content-mined/healing.recipes/ (ls-verified today: 14 .html files), 10 legacy images banked outside git (IMAGE_MANIFEST.md note). Screaming Frog specifically was NOT run — inventory built by direct mining; no Search Console data existed for URL value-ranking. · BACKFILLED 2026-07-17
- [~] Backup existing website — page-level verbatim bank of all 14 legacy pages in content-mined/healing.recipes/ (immutable raw-sources layer, doctrine (a)); legacy photography (10 files) banked at ~/Claude/Kairali-Digital/image-library/healing-recipes-legacy/ per IMAGE_MANIFEST.md. No server-side files/database backup — no server access from this repo (legacy host not ours to image). · BACKFILLED 2026-07-17

## 2. Technical Setup
- [x] URL structure and redirects — clean new structure (/, /books/<slug>, /author, /press, /contact, legal); protection map gives all 14 legacy .aspx URLs an explicit single-hop fate in content/redirects.json (counted today: 14 entries = 14 mined pages), wired in next.config.ts; completeness + single-hop asserted by test/books.test.js ("protection map covers every legacy URL"); committed seo-aeo-geo-report.md curl-verified all 14 redirect to the exact targets, all targets 200. NOTE flagged to human: Next.js `permanent: true` emits **308**, not literal 301 (Google treats as 301-equivalent); production-domain redirect behaviour re-verify pending DNS flip. · BACKFILLED 2026-07-17
- [x] robots.txt — app/robots.ts via @kairali/seo buildRobots (file read today); committed seo report: "User-Agent: * / Allow: /" + absolute Sitemap line, AI crawlers (GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot/Google-Extended) not blocked. GSC Robots-Tester validation: pending GSC property (DNS-gated). · BACKFILLED 2026-07-17
- [~] Sitemap — app/sitemap.ts emits 8 indexable URLs with lastmod/changefreq/priority (harmony 0.9, other books 0.8 — file read today); noindex legal pages correctly excluded; referenced from robots.txt (seo report PASS). Submission to GSC and Bing Webmaster: PENDING — no properties exist (Ship Gate B7, DNS-gated, human). · BACKFILLED 2026-07-17
- [ ] SSL/HTTPS — pending: NO deployment exists. Probe run today: `curl -s -o /dev/null -w "%{http_code}" https://kairali-web-factory-healing-recipes.vercel.app/` → **HTTP 404** (no Vercel project — matches PR #81 "Remaining" section). Protocol hygiene is clean in the static build (seo report: zero `http://` references, all asset/OG URLs https or root-relative), so no mixed content is expected — but HTTPS enforcement is host-level and cannot be verified until the project exists. · BACKFILLED 2026-07-17
- [x] Global metadata — app/layout.tsx routes through buildMetadata (title 42ch / description 141ch, counted today) with OG + Twitter card and ogImage /og.jpg; public/og.jpg exists (74,113 bytes, 1200×630 Harmony-on-ivory per IMAGE_MANIFEST.md); seo report verified rendered OG/Twitter on the static build. · BACKFILLED 2026-07-17
- [x] Core schema markup — home emits Organization + WebSite + Person + 4×Book + BreadcrumbList as one @graph with consistent @id cross-references (app/page.tsx read today; seo report: every block parses, ISBN matrix 4/4 exact match to content/books.json). Schema Markup Validator / Google Rich Results Test on the LIVE URL: pending DNS flip. · BACKFILLED 2026-07-17
- [ ] Webmaster tools & analytics — GSC, Bing, GA4, GTM all PENDING: no IDs/properties exist (Ship Gate B3–B7; none invented, CLAUDE.md gate 6). data-cta hooks grep-verified today in app/: buy_click, email_click ×4, header_harmony, hero_harmony, hero_shelf, featured_harmony, shelf_book_<slug> (templated), author_more, author_shelf — ready for packages/analytics when IDs land. W3C HTML/CSS validation not run. · BACKFILLED 2026-07-17

## 3. Performance Optimization
- [~] Minified assets — Next.js production static export minifies by default; PR #81 CI `gate` check SUCCESS 2026-07-16 (includes the build; PR body reports "build clean, 18 static pages" — CI-evidenced, not independently re-built at backfill: builds not permitted in this read-only pass). No first-load-JS budget figure is recorded anywhere for this site. · BACKFILLED 2026-07-17
- [ ] Browser caching policies — pending: caching is the Vercel platform layer and no Vercel project exists (curl probe above → 404). · BACKFILLED 2026-07-17
- [ ] CDN — pending the same missing Vercel project (PR #81 "Remaining": one-click import on Abilash's side). · BACKFILLED 2026-07-17
- [ ] Server response < 200ms — pending deployment; nothing to measure. · BACKFILLED 2026-07-17
- [ ] GTmetrix + PageSpeed Insights — pending production URL; Lighthouse gate (Ship Gate A5) NOT run for this site — confirmed as a known open gap in docs/reports/2026-07-17-prompt1-retro-audit.md §1 ("Lighthouse (A5) not run for any" of the wave). Recorded, not fixed here. · BACKFILLED 2026-07-17
- [ ] GSC crawl-error review — pending GSC property (DNS-gated). · BACKFILLED 2026-07-17

## 4. Mobile-Friendliness
- [x] Responsive design — verified at 375×812 / 768×1024 / 1440×900 with zero horizontal overflow on home + book plates (design-qa-report.md machine probe qa-audit-results.json; re-verified across 6 routes in iteration 2); 37 Playwright PNG screenshots + 2 JSON machine-probe files committed in launches/healing.recipes/screens/ (counted today: 37 + 2 = 39 artifacts). Google Mobile-Friendly Test: pending live URL. · BACKFILLED 2026-07-17
- [~] Touch-friendly navigation — 44px floors grep-verified today in globals.css (4× `min-height: 44px`, incl. ".header-cta … keeps the 44px token floor" at the mobile breakpoint — the it.2 40px finding was raised to 44px in the merged code, though no browser re-measure exists after that change); footer internal links 44px rows (design-review it.2 measured). Honest residuals from design-qa re-verify: inline text links (footer email, "as reported by The Hindu", consent-banner privacy link) under the ch.10 44px bar — WCAG 2.2 inline exception applies; queued for next globals.css touch. · BACKFILLED 2026-07-17
- [x] Mobile performance — cover payload cut 3.3× and verified on disk today (`du -k public/covers/`: harmony 200K · mockup 300K · cookbook 172K · massage 104K · wellness 60K — matches design-qa re-verify figures; was ~2.37 MB total); every `<img>` ships explicit width/height (seo report CLS-guard PASS); fonts self-hosted via next/font with display:swap (layout.tsx read today). Residual nicety: covers still JPEG — WebP/AVIF + srcset queued, no longer a gate risk per design-qa re-verify. · BACKFILLED 2026-07-17

## 5. SEO Considerations
- [x] URL consistency / 301 redirects — see §2: 14/14 legacy URLs single-hop to correct targets, audit-verified on the static build; 308-not-301 note flagged to human in the committed seo report. · BACKFILLED 2026-07-17
- [x] Internal links updated — seo report PASS: pillar home links all 4 book pages with descriptive anchors; header/footer interlink author/press/contact/books on every page (chrome.tsx read today: 4 internal nav links in header AND footer + legal nav); book pages link back to /#shelf and /author; bare /books correctly 404s; unknown slugs 404 (dynamicParams=false, page file read today). · BACKFILLED 2026-07-17
- [ ] Backlink monitoring/outreach — pending: no backlink inventory of the legacy .aspx URLs exists (needs GSC/link data post-flip); link equity is preserved meanwhile by the 14-URL protection map. · BACKFILLED 2026-07-17
- [ ] XML sitemap submitted — file is ready (§2) but submission pending GSC/Bing properties (DNS-gated, Ship Gate B7). · BACKFILLED 2026-07-17
- [x] Metadata unique & within limits — seo report: 11/11 titles unique; its one FAIL (/author description 160>155) was fixed before merge: grep + count today shows the merged description at **143 chars**, routed through the buildMetadata throw-gate along with press/contact/book pages (the audit's "gate bypass" root-cause item) — fixes are code-verified in `789b523`, though NO committed re-audit of the seo report exists (its last committed verdict is FAIL; see discrepancy note below). · BACKFILLED 2026-07-17
- [x] Structured data applied and validated — see §2; JSON-LD parse-validated in the committed audit (all blocks parse; Book/Person/Breadcrumb/Organization/WebSite); Rich Results Test pending live URL. · BACKFILLED 2026-07-17

## 6. Analytics and Monitoring
- [ ] GA/GTM tracking codes — pending GA4/GTM IDs (Ship Gate B3/B4; none exist, none invented). data-cta event vocabulary wired and grep-verified today (§2). · BACKFILLED 2026-07-17
- [ ] Goal/event tracking per KPI — pending the above; KPI (buy_click per retailer link) is instrumented in code: seo report counted harmony 4 · cookbook 4 · herbal 3 · wellness 3 buy links, matching offer counts. · BACKFILLED 2026-07-17
- [ ] Site-speed + GSC monitoring — pending GSC property + deployment. · BACKFILLED 2026-07-17
- [~] Post-migration review — the committed evidence pack IS the pre-launch review: design-qa two passes (FAIL → PASS WITH WARNINGS, both timestamped 16 Jul), design-review B-14 two iterations (8.6 FAIL → 9.2 PASS), seo-aeo-geo audit, 39 evidence artifacts in screens/. Outstanding: Abilash preview approval (Human Gate C-1) has no recorded evidence; site is merged, not launched; user feedback impossible pre-launch. · BACKFILLED 2026-07-17

## Verification actually run at backfill time (2026-07-17, read-only)

```
$ TZ='Asia/Kolkata' date '+%Y-%m-%d %H:%M:%S IST'
2026-07-17 12:08:36 IST

$ node packages/compliance/bin/lint.js sites/healing.recipes
compliance: 0 error(s), 0 warning(s) across 1 target(s) — PASS

$ curl -s -o /dev/null -w "%{http_code}\n" https://kairali-web-factory-healing-recipes.vercel.app/
404        # no Vercel project — matches PR #81 "Remaining" section

$ grep -c '"source"' sites/healing.recipes/content/redirects.json
14         # = 14 legacy pages in content-mined/healing.recipes/ (ls-counted)

$ ls launches/healing.recipes/screens/*.png | wc -l ; ls launches/healing.recipes/screens/*.json | wc -l
37
 2         # 37 Playwright screenshots + 2 machine-probe JSONs = 39 artifacts

$ file sites/healing.recipes/app/icon.png
PNG image data, 64 x 64, 8-bit/color RGBA   # the audit's "/icon.png 404" blocker — file now present

$ grep -n 'min-height' sites/healing.recipes/app/globals.css
94/111/383/429: min-height: 44px   # incl. ".header-cta … ch.10 touch floor — all breakpoints"

$ grep -rho 'data-cta="[^"]*"' sites/healing.recipes/app/ | sort | uniq -c
buy_click · email_click ×4 · header_harmony · hero_harmony · hero_shelf ·
featured_harmony · author_more · author_shelf · shelf_book_${b.slug} (templated)
```

Routes verified to exist on disk (find, today): app/page.tsx · books/[slug]/page.tsx · author · press · contact · privacy · terms · cookie-policy · robots.ts · sitemap.ts · llms.txt/route.ts.

## PR #81 CI evidence (gh pr view 81 --json statusCheckRollup, fetched today)

- Merged **2026-07-16 19:39:16 IST** as `789b523`; title "sites/healing.recipes v1 — the four books of Gita Ramesh (launch site, preview-ready)".
- CI SUCCESS: `gate` (build + discovered tests incl. the 8 books.test.js data-integrity guards + gitleaks) · `brand-lint` (incl. banned-string, cta-label, content-lint) · `security-review`. PR body reports full suite 176/176 + scripts 125/125 behind those green checks.
- **factory-spec (Playwright browser suite) did NOT run on this site** — the CI matrix ran only sites/arogyakendra.com, kairali.com, whatisayurveda.com, kairalicenters.com (statusCheckRollup, confirmed as the matrix-drift finding in docs/reports/2026-07-17-prompt1-retro-audit.md §1). Pending, not fixed here.
- Vercel deployed 6 existing projects on the PR; **none is healing.recipes** — consistent with today's 404 probe.

## Known honest gaps (recorded, not fixed — 17 Jul retro-audit §1 + QUESTIONS.md)

- Merged ≠ launched: no Vercel project, no DNS flip; launch event end of July. All production-hostname items above are pending. · BACKFILLED 2026-07-17
- factory-spec CI matrix omits this site; Lighthouse (A5) never run; cross-model (Codex/GPT) audit pending-triangulation for the whole wave; wiki/log.md + LEARNINGS retro skipped for the wave (retro-audit §1). · BACKFILLED 2026-07-17
- Open questions touching this site: **Q-HR-ARCHIVE** (2017 Chef Retreat archive section?) and **Q-HR-PHONE** (legacy +91-9999231117 unverified — site ships email-only) — QUESTIONS.md lines 309–310; **Q14** bronze-600 ramp: bronze-400 overlines measure 2.80:1 on ivory (sub-AA display accent) until the real bronze-600 hex lands — globals.css:335 comment preserves the TODO. · BACKFILLED 2026-07-17
- Roli Books cover-image blanket permission: confirm at DNS flip (IMAGE_MANIFEST.md licence notes; PR #81 "Remaining"). · BACKFILLED 2026-07-17
- B-14 design gate: iteration 1 scored **8.6 FAIL** → fixes machine-verified → iteration 2 **9.2 PASS** (launches/healing.recipes/design-review.md) — the pass was earned on the second iteration, recorded as such. · BACKFILLED 2026-07-17

## Discrepancy note (report-honesty)

The committed seo-aeo-geo-report.md's final verdict is **FAIL** (3 blockers: /author description 160>155, buildMetadata gate bypass on 7 page files, /icon.png 404) and was never re-audited on the branch. Today's read-only inspection of merge commit `789b523` shows all three were fixed before merge (description 143ch through the gate; author/press/contact/book pages all import buildMetadata; app/icon.png present as a real 64×64 PNG) — but the evidence trail lacks a committed seo re-audit, unlike design-qa which has one. Residual audit notes still true in merged code: noindex legal pages inherit the homepage canonical (contradictory signal), book pages pre-`slice()` before the gate (silent truncation), no FAQ/question-formatted H2s (AEO opportunity), 308-vs-301 human flag.

## Post-import live verification — appended 2026-07-17 12:48:45 IST (Session 2B follow-up)

Abilash imported the Vercel project (`kairali-web-factory-healing-recipes`, prj_eyEq9n2uyd1f9gp6xx7r3oYHh3I3, team kairali) at ~12:41 IST; latest deployment READY, target production, from main. This supersedes the 404 probe recorded above and closes the "no Vercel project" gap; **preview URL for Human Gate C-1 now exists**. Real output:

```
$ curl -s -o page.html -w "HTTP %{http_code}\n" https://kairali-web-factory-healing-recipes.vercel.app/
HTTP 200
$ grep -oE '<h1[^>]*>[^<]*' page.html | head -1
<h1>Recipes that carry a lineage.
$ grep -o '"foundingDate":"[^"]*"' page.html
"foundingDate":"1989"        # the PR #84 fleet-wide schema fix, live on this fresh deploy
$ curl -s -o /dev/null -w "llms.txt %{http_code} · " .../llms.txt; curl -s -o /dev/null -w "sitemap.xml %{http_code}\n" .../sitemap.xml
llms.txt 200 · sitemap.xml 200
$ curl -s -o /dev/null -w "/recipes.aspx → %{http_code} → %{redirect_url}\n" .../recipes.aspx
/recipes.aspx → 308 → https://kairali-web-factory-healing-recipes.vercel.app/
```

Still pending after this update (unchanged): Abilash preview approval (C-1), DNS flip (human), GSC/Bing/GA4 (production-domain-gated), Lighthouse/factory-spec CI, event details, Q-HR-ARCHIVE/Q-HR-PHONE, Harmony pre-event bibliographic re-verification (triangulation note).
