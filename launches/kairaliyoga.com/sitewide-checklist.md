# Site-Wide Checklist — kairaliyoga.com (retro-filled)

**2026-07-17 12:08:52 IST · Master: docs/checklists/sitewide-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**BACKFILLED 2026-07-17 (build merged 17 Jul 2026, PR #85) — retro-filled under the arogyakendra honest-pending precedent; Session 2B evidence backfill**
**Marks: [x] done · [~] partial · [ ] pending (reason given) · [n/a] not applicable. Evidence is real command output, a committed report, or PR CI — no self-reported success. Backfill scope: NO code changes, NO fixes — evidence recording only; verification commands re-run today were read-only (no builds, no Playwright).**
**Context: E-register (expressive) one-pager (site.config.json: entity "group", register "E", locales ["en"], markets IN/US/DE) — the yoga-programme surface for KTAHV, replacing a LIVE legacy ASP.NET site (audits/kairaliyoga.com-2026-07-16.md), so this IS a migration and redirect items are real. Built 16 Jul 2026 on feat/kairaliyoga-v1; B-14 design critic 8.8 (it.1 FAIL) → 9.2 (it.2 PASS); merged 17 Jul 2026 10:03:36 IST as PR #85 (merge commit 6d1ef5b). Status: MERGED, NOT LAUNCHED — no Vercel project serves this site yet (curl evidence below), Abilash preview approval (C-1) outstanding, DNS flip is a HUMAN action, and one PRE-FLIP BLOCKER is on record (~56 remaining legacy sitemap URLs need wholesale fates — BACKLOG cutover lane).**

## 1. Pre-Migration Planning
- [x] Objectives defined — programme-enquiry surface for KTAHV's residential yoga programmes; brief docs/site-briefs/kairaliyoga-build-2026-07-16.md (D-SEO-DUAL intent doc) + design research docs/design-research/kairaliyoga-2026-07-16.md (PR #83). KPI = programme enquiries, measurable per data-cta device (design-review.md CTA scorecard). · BACKFILLED 2026-07-17
- [x] Comprehensive site audit — audits/kairaliyoga.com-2026-07-16.md (19:22:19 IST): 11 legacy pages fetched, 65-URL legacy sitemap all status-checked (all 200), 62 internal + 13 outbound links checked, redirect matrix, security/injection screen CLEAN, 15 findings logged. Method was curl byte-level inspection, not Screaming Frog (tool substitution noted honestly; coverage equivalent for a 65-URL site). · BACKFILLED 2026-07-17
- [~] Backup existing website — no server/DB access to the third-party ASP.NET/Plesk host, so a full file+database backup is impossible from this repo. What IS banked: all 9 core legacy pages verbatim in content-mined/kairaliyoga.com/ (immutable raw-sources layer, `ls` = 9 .html files) and the legacy site stays live untouched until the human DNS flip. · BACKFILLED 2026-07-17

## 2. Technical Setup
- [~] URL structure & redirects — new structure: `/` one-pager + 3 noindex legal routes + metadata routes. All 9 mined legacy .aspx URLs have explicit single-hop fates in next.config.ts (`grep -c 'source: "/'` = 9, matching 9 mined pages; protection-map comment documents each fate). seo-aeo-geo-report.md curl-verified all 9 as 308 permanent, hops=1, final 200, exact anchors (/#programmes, /#voices, /#teachers, /#enquire, / ×4); guard "redirect map covers every mined legacy page, single-hop" re-run today PASS. Note: brief said "301"; Next `permanent: true` emits 308 — equivalent permanent semantics, recorded in the SEO report. HONEST PENDING: the legacy sitemap holds 65 URLs; the remaining ~56 need wholesale fates before DNS — PRE-FLIP BLOCKER on record (PR #85 body + BACKLOG cutover lane). · BACKFILLED 2026-07-17
- [x] robots.txt — app/robots.ts via @kairali/seo buildRobots (file inspected). seo-aeo-geo-report.md: 200, `User-Agent: * / Allow: /`, sitemap referenced, AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended) unblocked. GSC robots validation pending property (DNS-gated); re-verify at Vercel/WAF layer at flip (platform bot rules can override origin). · BACKFILLED 2026-07-17
- [~] Sitemap — app/sitemap.ts via buildSitemap: single URL `/`, lastmod set, priority 1 (file inspected; SEO report verified the served XML on the static origin, lastmod 2026-07-16). Submission to GSC AND Bing Webmaster: PENDING — no properties exist yet (DNS-gated, Ship Gate B7 human lane). · BACKFILLED 2026-07-17
- [ ] SSL/HTTPS — PENDING deployment: no origin serves this site today. Real result recorded 2026-07-17: `curl -s -o /dev/null -w "HTTP %{http_code}" https://kairali-web-factory-kairaliyoga-com.vercel.app/` → **HTTP 404** — the Vercel project does not exist or is not aliased (PR #85 status contexts list 6 Vercel deploys, none for kairaliyoga). Structural prep done: all asset references relative or https (SEO report "HTTPS / mixed content: N/A-until-flip"); TLS + mixed-content verification owed at deploy. · BACKFILLED 2026-07-17
- [x] Global metadata — buildMetadata in app/layout.tsx: title 52ch, description 154ch, full OG (title/description/url/type/locale/image + declared 1200×630 dims) + Twitter card, verified in rendered HTML by the SEO audit. og:image is a REAL asset: public/og.jpg, 184,791 bytes on disk, 1200×630 actual pixels, re-shot clean (no consent banner baked in). · BACKFILLED 2026-07-17
- [x] Core schema markup — one `@graph` JSON-LD script in app/page.tsx (grep: `application/ld+json` line 149): Organization (foundingDate 1989 + PR #65 licensed lineage phrasing; logo /logo.png 58,814 bytes on disk; sameAs kairali.com + ayurvedichealingvillage.com — it.2 fix, grep lines 112–118) + WebSite + BreadcrumbList + FAQPage verbatim-matched 6/6 to the visible accordion (SEO report PASS, byte-identical after entity decoding). Parses as valid JSON, serializer escapes `<`. Schema Markup Validator / Google Rich Results Test: pending a live production URL. · BACKFILLED 2026-07-17
- [ ] Webmaster tools & analytics — GSC, Bing, GA4 all PENDING: no property/stream IDs exist and none are invented (CLAUDE.md gate 6). Prep verified today: `grep -o 'data-cta="…"' app/page.tsx` → 12 literal hooks + 1 templated `prog_${p.id}_enquire` (×3 programmes at render = 15 rendered instances, matching design-review.md's independent count); ConsentScripts precedes Analytics in the layout head (consent-first order, file inspected). W3C HTML/CSS validation not run — recorded honestly. · BACKFILLED 2026-07-17

## 3. Performance Optimization
- [x] Minified assets — Next.js production build, clean: PR #85 CI `gate` check SUCCESS (run 29520872428) and the it.2 design review served the real production build (BUILD_ID w1uXXblbxqCsM5X-wC-y2 verified newer than every app/ source). No local rebuild for this backfill (read-only rule). · BACKFILLED 2026-07-17
- [ ] Caching policies — PENDING deployment: Vercel immutable caching for hashed /_next/static assets is the platform default, but no Vercel project serves this site yet (curl HTTP 404, recorded above). · BACKFILLED 2026-07-17
- [ ] CDN — PENDING deployment: Vercel edge is the fleet standard (two-plane rule: Cloudflare stays DNS-only/grey), but the kairaliyoga Vercel project is unverified/absent (HTTP 404 today). · BACKFILLED 2026-07-17
- [ ] Server response < 200ms — PENDING deployment; static prerender makes this expected but unmeasured (no origin exists to measure). · BACKFILLED 2026-07-17
- [ ] GTmetrix + PageSpeed Insights — NOT RUN; Lighthouse (Ship Gate A5) NOT RUN either — confirmed by the 17 Jul retro-audit (docs/reports/2026-07-17-prompt1-retro-audit.md §1) and design-review.md it.2 hand-off item 6: "Lighthouse ≥90 perf still unevidenced on a production CDN … the ship-gate requires the run, not the estimate; do it before DNS." Local weight evidence (908KB first load, images 322KB) says it should clear, but the run is owed. · BACKFILLED 2026-07-17
- [ ] GSC crawl-error review — pending GSC property (DNS-gated). · BACKFILLED 2026-07-17

## 4. Mobile-Friendliness
- [x] Responsive design — built mobile-first (design-qa: base styles are mobile, ≥760px adds columns); verified at 375×812 (DPR 3), 768×1024 and 1440×900 / 1280×900 across three independent evidence sets — 74 screenshots committed in launches/kairaliyoga.com/screens/ (12 qa- + 23 critic- + 20 it2critic- + 14 it2- + 3 home + 2 focus). Zero horizontal overflow at 375 and 768 (scrollW = viewport, measured twice). First-paint law measured at 375×812 with consent banner up: H1, both hero CTAs, the "What brings you?" question AND the entire first rail row clear the banner top by 31px (it2critic-mobile-firstpaint-consent.png). Google Mobile-Friendly Test: pending live URL. · BACKFILLED 2026-07-17
- [x] Touch-friendly — it.2 tap census at 375: 28 controls, ZERO under 44px in either dimension (it.1's 38.1px "Terms" link fixed and re-measured); leaf focus rings verified painting at settled state on every control class (it2critic-focus-rail-settled.png, it2critic-focus-summary-settled.png). · BACKFILLED 2026-07-17
- [x] Mobile performance — images 3,066KB → **322.1KB at load** (907.9KB total page) at 375×812 DPR 3, via srcset ladders on all 9 photos (`grep -c srcSet app/page.tsx` = 9 today; ladder files on disk in public/images/); LCP hero request 188KB (was 733KB); numbers independently reproduced by the it.2 critic, not builder-reported. Fonts self-hosted via next/font, display:swap. Watch-item on record: full-scroll image budget passes with only 44KB headroom (1,156 vs 1,200KB). · BACKFILLED 2026-07-17

## 5. SEO Considerations
- [~] URL consistency + 301s for changed URLs — canonical `https://kairaliyoga.com` on `/` (SEO report curl-verified); legal routes carry their OWN canonicals + noindex,follow after the it.2 fix (grep today: buildMetadata `path:` + it.2 WARN-fix comments in all three page.tsx files). 9 legacy URLs → 308 single-hop (see §2). HONEST PENDING: ~56 remaining legacy sitemap URLs still 404 on this origin — the PRE-FLIP BLOCKER; DNS must not flip before the full 65-URL protection map lands (Build Decision Matrix §2). · BACKFILLED 2026-07-17
- [x] Internal links updated, none broken — all in-page anchor targets exist as real ids (grep today: id="programmes" :220, "training" :455, "teachers" :484, "voices" :518, "enquire" :569); SEO report verified redirect anchors land on real ids and all image srcs + og.jpg resolve 200; footer crosslinks to group sites with descriptive anchors. · BACKFILLED 2026-07-17
- [ ] Backlink monitoring/outreach — NOT STARTED: no backlink inventory exists (needs GSC/link data, DNS-gated); the 9-URL redirect map preserves equity for the mined pages meanwhile. Post-flip lane. · BACKFILLED 2026-07-17
- [ ] XML sitemap submitted — file is live in the build (see §2); submission pending GSC/Bing properties (DNS-gated). · BACKFILLED 2026-07-17
- [x] Metadata unique + keyword-bearing — titles ≤60 on every route (/: 52 · /privacy: 29 · /terms: 27 · /cookie-policy: 28), descriptions ≤155 (154; legal pages got their own after it.2) — seo-aeo-geo-report.md table, re-anchored by file inspection today. · BACKFILLED 2026-07-17
- [x] Structured data applied and validated — see §2; JSON-LD parses valid with expected @types; FAQPage 6/6 verbatim; validation against Google Rich Results Test pending live URL. · BACKFILLED 2026-07-17

## 6. Analytics and Monitoring
- [ ] GA/GTM tracking — pending GA4/GTM IDs (Ship Gate B3–B6); data-cta event vocabulary wired and grep-verified (15 rendered instances, §2); consent-first script order in layout. · BACKFILLED 2026-07-17
- [ ] Goal/event tracking — pending the above; per-programme attribution is ready day-one (prog_dhyana/agni/prana_enquire naming, design-review.md). · BACKFILLED 2026-07-17
- [ ] Site-speed + GSC monitoring — pending GSC property; monthly AI-engine query logging (10 target queries) N/A-until-flip, queued for the cutover checklist (SEO report GEO row). · BACKFILLED 2026-07-17
- [~] Post-migration review — three committed reviewer reports constitute the pre-launch review: design-qa-report.md (PASS W/W, 22:05:08 IST), seo-aeo-geo-report.md (PASS W/W, 21:58:34 IST), design-review.md (B-14 critic: it.1 8.8 FAIL → it.2 9.2 PASS, 23:07:19 IST) — plus this backfilled evidence pack. Outstanding: Abilash preview approval (Human Gate C-1) and the actual launch; user feedback impossible pre-flip. · BACKFILLED 2026-07-17

## Deployment verification (real output, 2026-07-17 backfill session)

The site is MERGED to main but NOT DEPLOYED — recorded honestly, contra the arogyakendra precedent where the preview URL served 200:

```
$ curl -s -o /dev/null -w "HTTP %{http_code}\n" https://kairali-web-factory-kairaliyoga-com.vercel.app/
HTTP 404
```

PR #85's statusCheckRollup lists Vercel deployments for 6 sibling projects (arogyakendra-com, kairali-ai, kairali-com, kairalicenters-com, whatisayurveda-com, abhilashkr) — **none for kairaliyoga.com**. Vercel project creation is an open pre-preview task.

## Gates on record (PR #85 CI + local re-runs today)

From `gh pr view 85 --json statusCheckRollup` (fetched 2026-07-17):

- `gate` SUCCESS · `brand-lint` SUCCESS · `security-review` SUCCESS (workflow runs 29520872428 / 29520872490, completed 16 Jul 2026 ~23:17 IST).
- **factory-spec (Playwright browser suite) did NOT run for this site in CI** — the matrix ran only sites/arogyakendra.com, sites/kairali.com, sites/whatisayurveda.com, sites/kairalicenters.com (statusCheckRollup, confirmed by the 17 Jul retro-audit §1: the factory-gate.yml matrix was never extended). The PR body's "factory spec 20" was a LOCAL run claim; both facts recorded — the CI matrix gap is an open process fix (retro-audit "Top 5" #1).
- PR body claims (not re-run here, no builds allowed): build clean · suites green 166 + 125 · B-14 critic 9.2 PASS it.2 · images 3,066KB → 322KB at load.

Local read-only re-runs, 2026-07-17 (this backfill session, on merged main):

```
$ node packages/compliance/bin/lint.js sites/kairaliyoga.com
compliance: 0 error(s), 3 warning(s) across 1 target(s) — PASS
# all 3 warnings are the linter matching guards.test.js's OWN descriptive text
# ("no cure claims" comment + test name) — zero findings in page copy.
# The PR-time run predates the backfill; today's exact output recorded as-is.

$ node --test sites/kairaliyoga.com/test/guards.test.js
tests 8 · pass 8 · fail 0
# prices / invented dates / cure claims / 1908 lineage / redirect coverage /
# locked contacts / verbatim testimonials / reckoner-exact names — all green.

$ grep -c 'source: "/' sites/kairaliyoga.com/next.config.ts   → 9
$ ls content-mined/kairaliyoga.com/*.html | wc -l             → 9   (map covers the mine 1:1)

$ grep -E '₹|€|\$[0-9]|\b(INR|USD)\b' sites/kairaliyoga.com/app/page.tsx
(no output — the no-prices law holds on the merged source)
```

## Known honest gaps (17 Jul retro-audit §1 + PR #85 — none fixed in this backfill)

1. **MERGED, NOT LAUNCHED.** PRE-FLIP BLOCKER: ~56 remaining legacy sitemap URLs need wholesale fates before DNS (BACKLOG cutover lane) — carried in §2/§5 above as pending.
2. **Vercel project absent/unverified** — HTTP 404 recorded above; no preview URL exists for C-1 yet.
3. **factory-spec CI matrix gap** — browser suite never ran on this site in CI; Lighthouse (A5) not run anywhere.
4. **GSC/Bing/GA4** — no IDs; all monitoring rows pending.
5. **Kurale IAST interim** — display faces ship ROMANIZED programme names by documented interim; exact IAST lives in support faces and is guard-pinned. Ruling pending (Q-YOGA-IAST, QUESTIONS.md 2026-07-16 22:39:52 IST) — an open ruling, NOT an error. Also open: Q-YOGA-PRIVATE (reckoner's private-vs-group contradiction) and Q-YOGA-GUESTBOOK (late dignitary's entry).
6. **Wave-wide evidence-layer misses** (retro-audit): no wiki/log.md entry, no LEARNINGS retro, no cross-model audit for this build — this file closes only the checklist gap.
