# Site-Wide Checklist — kairalihospitality.com (filled)

**2026-07-17 12:07:48 IST · Master: docs/checklists/sitewide-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**BACKFILLED 2026-07-17 (build merged 17 Jul 2026, PR #86) — retro-filled under the arogyakendra honest-pending precedent; Session 2B evidence backfill.**
**Marks: [x] done · [~] partial · [ ] pending (reason given) · [n/a] not applicable. Evidence is real command output or a named artifact — no self-reported success. No code was changed in this backfill: it re-ran read-only gates on the merged tree and cites the committed launch evidence.**
**Context: cinematic multi-property umbrella one-pager (site.config: entity "group", register E, EN-only) replacing the legacy .aspx site (Since-1908 footer, stale content). 12 static build routes: `/` + three noindex legal routes + robots/sitemap/llms + icons + `_not-found`. Built 16 Jul 2026; merged 17 Jul 2026 ~10:13 IST as PR #86 (merge commit `79f7ec4`). MERGED, NOT LAUNCHED: no Vercel project for this site could be verified (probes below return 404, and PR #86's status rollup lists six Vercel deploy contexts — none for kairalihospitality), and the DNS flip is a HUMAN action — every production-hostname item is pending. B-14 design critic: 8.9 (it.1 FAIL) → 9.4 PASS at iteration 2, the fleet's highest. Four builder interpretation calls await ratification (Q-KH-BRIEF-RULINGS); JV name/legal-form, 2008-subsidiary claim and legacy phone line are open Abilash rulings (Q-KH-JV-NAME, Q-KH-2008, Q-KH-PHONE).**

## 1. Pre-Migration Planning
- [x] Objectives defined — umbrella brand for the group's properties (Villa Raag · Healing Village · Czech JV) + consultancy lane; D-SEO-DUAL ATTACK/DEFEND intents specified in docs/site-briefs/kairalihospitality-build-2026-07-16.md + docs/design-research/kairalihospitality-2026-07-16.md; seo-aeo-geo audit verified all four attack phrases present naturally. · BACKFILLED 2026-07-17
- [~] Comprehensive site audit — legacy site fully mined: 15 .aspx pages banked as HTML in content-mined/kairalihospitality.com/ (incl. accommodation-tariffs.html — no tariff content carried, rule 6) and 13 more live URLs observed in the 2026-07-16 audit (next.config.ts OBSERVED_EXTRA); every URL given an explicit fate (protection map). Screaming Frog itself not used, and the GSC page-value ranking of legacy URLs is pending the aged GSC property at flip (brief mandates pulling it then). · BACKFILLED 2026-07-17
- [~] Backup existing website — content-mined/ is the immutable raw-sources bank (15 HTML pages + mined image library; 5 library originals used on the new build). Server-side files/database of the legacy .aspx host are not in our custody — the legacy host stays live until the flip, which is the operative rollback. · BACKFILLED 2026-07-17

## 2. Technical Setup
- [x] URL structure & redirects — one-pager + 3 legal routes; 29 legacy fates in next.config.ts (16 LEGACY_MAP + 13 OBSERVED_EXTRA; grep-counted 29 at backfill, output below), all single-hop, section anchors keep intent (`/#properties`, `/#healing-village`, `/#enquire`); one cross-domain fate `/ayurvedic-franchise.aspx → https://ayurvedafranchise.com/` (canonical franchise domain per Decision #4 — kairalifranchise.com would chain two hops; target live-verified 200, 0 further redirects, 16 Jul). 29/29 curl-verified single-hop on the local production build (seo-aeo-geo-report.md); guard "redirect map covers every mined legacy page, single-hop" re-run PASS at backfill. Recorded for honesty: Next.js `permanent: true` emits 308, not 301 — equivalent permanent signal (seo report noted it). · BACKFILLED 2026-07-17
- [~] robots.txt — app/robots.ts via @kairali/seo buildRobots: `User-Agent: * / Allow: /`, sitemap declared, AI crawlers (GPTBot/ClaudeBot/PerplexityBot/Google-Extended) unblocked — curl-verified on the local build (seo report PASS). GSC Robots Testing Tool validation: pending GSC property (DNS-gated); CDN/Cloudflare bot rules re-check at flip. · BACKFILLED 2026-07-17
- [~] Sitemap — app/sitemap.ts emits exactly the one indexable URL (`/`); noindex legal routes correctly excluded (seo report PASS). Submission to GSC AND Bing Webmaster: PENDING — no property exists until DNS (human-gated). · BACKFILLED 2026-07-17
- [ ] SSL/HTTPS — PENDING: no live hostname serves this build at all (Vercel project probes returned 404 at backfill — see Live-URL section; production cert pending DNS flip). The build itself is mixed-content clean: zero `http://` references in the rendered it.2 HTML (re-verified at backfill on .next output) and all external hrefs https. · BACKFILLED 2026-07-17
- [x] Global metadata — buildMetadata in app/layout.tsx: OG (title/type/url/site_name/locale) + Twitter `summary_large_image`; og:image is an absolute URL to a REAL 1200×630 asset (`/og.jpg`, 124KB on disk — current hero, correct diacritics, no consent banner baked in; visually inspected in the seo audit). Rendered-HTML grep re-verified at backfill. · BACKFILLED 2026-07-17
- [x] Core schema markup — one `@graph` in the home HTML: Organization (foundingDate "1989"; family-practising-since-1908 lineage kept in the description, never attached to the Group — guard-enforced) + WebSite + LodgingBusiness (Villa Raag) + Hospital (KTAHV) + BreadcrumbList; re-parsed valid with Python json.loads at backfill on the rendered build output; parentOrganization only on the two Indian properties — the Czech JV is deliberately absent from the graph (no ownership language pending the Q-KH-JV-NAME legal-form ruling). Google Rich Results Test: pending live production URL. · BACKFILLED 2026-07-17
- [ ] Webmaster tools & analytics — GSC, Bing, GA4 all PENDING: no property/stream IDs exist and none are invented (CLAUDE.md gate 6). 16 `data-cta` hooks wired and grep-verified at backfill (per-audience, per-property — full list in the pagewise checklist). W3C HTML/CSS validation not run — recorded honestly. · BACKFILLED 2026-07-17

## 3. Performance Optimization
- [x] Minified assets — Next.js production build, clean, 12/12 static routes (CI green on PR #86); first-load JS 102 kB ≤ 130 kB budget (seo report lab note). · BACKFILLED 2026-07-17
- [ ] Caching policies — would be Vercel platform defaults (immutable hashed /_next/static), but NO Vercel project for this site was verifiable at backfill (probes 404) — pending project creation. · BACKFILLED 2026-07-17
- [ ] CDN — same pending: no Vercel deployment exists to serve from the edge; two-plane rule (Cloudflare stays DNS-only/grey) applies at flip. · BACKFILLED 2026-07-17
- [ ] Server response < 200ms — all 12 routes static-prerendered (the right architecture for it), but there is no live deployment to measure. · BACKFILLED 2026-07-17
- [ ] GTmetrix + PageSpeed Insights — NOT run; Lighthouse (Ship Gate A5) also NOT run — known open gap #1 in the 17 Jul retro-audit (docs/reports/2026-07-17-prompt1-retro-audit.md §1). Groundwork landed pre-merge: it.2 cut the 375px-walk image payload 1,649KB → 766KB via srcset ladders (PR #86; 560/800/1200 derivatives on disk, du-verified at backfill), hero `fetchPriority="high"` with width/height (CLS-safe). · BACKFILLED 2026-07-17
- [ ] GSC crawl-error review — pending GSC property (DNS-gated). · BACKFILLED 2026-07-17

## 4. Mobile-Friendliness
- [x] Responsive design — verified on the production build by two independent passes: design-qa (375×812/768×1024/1440×900, zero horizontal overflow) and the B-14 critic (it.1 + it.2, fresh Playwright evidence each run). The it.1 mobile first-paint defect (consent banner bisecting the first door's title) was FIXED and re-measured in it.2 — hero statement AND first door title+hint clear the banner (it2critic-mobile-firstpaint-consent.png). 52 evidence screenshots in launches/kairalihospitality.com/screens/. · BACKFILLED 2026-07-17
- [x] Touch-friendly — critic tap-target census at 375: ZERO targets under 44px (design-qa's one offender, the 38px-wide footer Terms link, padded before it.2); leaf focus rings keyboard-verified settled-state on every control including panel links on dark. · BACKFILLED 2026-07-17
- [~] Mobile performance — srcset/sizes ladders shipped in it.2 (375-walk images 766KB, builder-measured, accepted by the critic); fonts self-hosted latin-ext with display:swap; panels lazy-loaded, hero eager. Images remain JPEG-only — WebP/AVIF derivation still open (design-qa warning); no field measurement or Lighthouse yet (no live URL). · BACKFILLED 2026-07-17

## 5. SEO Considerations
- [x] URL consistency — canonical `https://kairalihospitality.com` = og:url, single host, no www split (rendered-HTML grep re-verified at backfill); legal routes carry per-page canonicals (seo WARN-1 fixed pre-merge in the legal-canonicals commit 868c950 — re-verified in source at backfill). · BACKFILLED 2026-07-17
- [x] Internal links — fragment targets `#properties`/`#healing-village`/`#develop`/`#enquire` all exist as real `id=` anchors (grep-verified at backfill); no dead internal routes (12-route build table); the three external property links are guard-locked destinations (villaraag.com, www.ayurvedichealingvillage.com, katerinaresort.cz/en — guards 8/8 re-run at backfill). · BACKFILLED 2026-07-17
- [~] Backlink monitoring/outreach — link equity preserved mechanically (29 single-hop fates), but high-value-backlink identification + outreach and the GSC-query-data re-rank of redirect fates are pending the aged GSC property at flip (brief mandates it). · BACKFILLED 2026-07-17
- [~] XML sitemap submitted — file correct and live in the build (see §2); submission pending GSC/Bing properties (DNS-gated). · BACKFILLED 2026-07-17
- [x] Metadata — home title 59 chars ≤60, description 146 chars ≤155 (node-measured at backfill); legal routes unique titles 34–36 chars with own descriptions; limits enforced at build by @kairali/seo (throws over limit). · BACKFILLED 2026-07-17
- [x] Structured data applied — see §2: @graph re-parsed valid at backfill, expected @types ["Organization","WebSite","LodgingBusiness","Hospital","BreadcrumbList"]; Rich Results Test pending live production URL. · BACKFILLED 2026-07-17

## 6. Analytics and Monitoring
- [ ] GA/GTM tracking — pending GA4/GTM IDs (Ship Gate B3/B4); @kairali/analytics loader present but inert without IDs; consent-mode defaults (all denied) inlined BEFORE any tag loader (order verified in layout.tsx + seo report). · BACKFILLED 2026-07-17
- [ ] Goal/event tracking — pending the above; the event vocabulary is already per-audience and per-property (16 data-cta hooks: doors, explore/enquire per property, whatsapp/email per band) so the KPI (partner + stay + consultancy enquiries) is fully attributable on day one. · BACKFILLED 2026-07-17
- [ ] Site-speed + GSC monitoring — pending GSC property; CWV field data and the monthly AI-citation query log are N/A-until-flip (seo report). · BACKFILLED 2026-07-17
- [~] Post-migration review — three reviewer reports (design-qa PASS W/W · seo-aeo-geo PASS W/W · B-14 critic 8.9→9.4 PASS it.2, fleet's highest) + 52 screenshots + this backfilled pack constitute the review. Outstanding: Abilash preview approval (Human Gate C-1) — currently not satisfiable because no Vercel preview URL exists (probes 404); wiki/log.md rollup + LEARNINGS retro for the wave were skipped (retro-audit §1 logger failure); cross-model (Codex/GPT) audit pending for the whole wave. · BACKFILLED 2026-07-17

## Live-URL verification (Ship Gate proof-of-work) — HONEST GAP

There is no live URL to verify. Captured 2026-07-17 ~12:05 IST (real terminal output):

```
$ curl -s -o /dev/null -w "... HTTP %{http_code}\n" https://kairali-web-factory-kairalihospitality-com.vercel.app/
kairali-web-factory-kairalihospitality-com.vercel.app HTTP 404

$ curl -s -o /dev/null -w "... HTTP %{http_code}\n" https://kairali-web-factory-kairalihospitality-co.vercel.app/
kairali-web-factory-kairalihospitality-co.vercel.app HTTP 404
```

Corroboration: `gh pr view 86 --json statusCheckRollup` (fetched this session) lists six Vercel
deploy contexts (abhilashkr, arogyakendra-com, kairali-ai, kairali-com, kairalicenters-com,
whatisayurveda-com) — **none for kairalihospitality**. The Vercel project for this site does not
appear to exist yet; creating it precedes the C-1 preview approval. All local-build route/redirect
curl evidence in this pack comes from the reviewers' `next start` sessions on 16 Jul (documented
in seo-aeo-geo-report.md and design-review.md), not from a deployment.

## Gates — merge-time CI + backfill re-runs

At merge (PR #86, 17 Jul 2026 10:13 IST, merge commit 79f7ec4): all status checks SUCCESS —
gate (incl. full-history gitleaks + security-review), brand-lint, factory-spec × 4. Recorded
honestly: **the factory-spec matrix still lists only the four old sites** (arogyakendra,
kairali.com, kairalicenters, whatisayurveda) — the Playwright browser suite never ran on
kairalihospitality in CI (17 Jul retro-audit §1 known gap). PR body claims build clean
(12 routes), brand-lint 0/0, full suite 315/315 — the 315/315 figure was not re-run at
backfill; only the two gates below were re-executed.

Re-run at backfill, 2026-07-17 12:06 IST (real output):

```
$ node packages/compliance/bin/lint.js sites/kairalihospitality.com
compliance: 0 error(s), 0 warning(s) across 1 target(s) — PASS

$ cd sites/kairalihospitality.com && node --test test/guards.test.js
ℹ tests 8
ℹ pass 8
ℹ fail 0
# 8/8: clinical-register lock (lexicon imported from packages/compliance) ·
# "Swatak"/"Katrina" dictation NEVER ships + verified "Kateřina" does ·
# no invented counts/prices/tariffs · 1908 lineage-only + computed rolling years ·
# banned filler · redirect map single-hop coverage · locked contacts · locked property links

$ grep -cE '^\s+"/[^"]+":' sites/kairalihospitality.com/next.config.ts
29

# KTAHV LANGUAGE LOCK spot-check (banned lexicon across all app TSX):
$ grep -riE "\b(spa|resort|holiday|luxury|cure|journey|guests)\b" sites/kairalihospitality.com/app --include="*.tsx"
app/page.tsx:268:  <h3>Resort Svatá Kateřina</h3>
app/page.tsx:431:  <a href={KATERINA_URL}>Resort Svatá Kateřina</a>
# Interpretation (honest): 2 hits, BOTH the property's verified proper noun, outside the
# data-register="clinical" blocks. The lock applies to the KTAHV/Healing Village panel and
# treatment door, which the guards + both reviewer reports confirmed zero-hit on the RENDERED
# DOM; Villa Raag's hospitality register is exempt by CLAUDE.md. PASS.
```

Deliberate omissions recorded (not gaps): the "on the horizon" band was OMITTED — zero
announceable facts existed, rule-6 discipline; no Kateřina photograph exists in the library, so
the Czech panel ships deliberately text-first (IMAGE_MANIFEST GAP honoured — designed-honest).
Open Abilash rulings riding this site: Q-KH-JV-NAME (verified "Resort Svatá Kateřina" stands in
for the dictation; NO ownership language until the legal form is ruled), Q-KH-2008, Q-KH-PHONE,
Q-KH-BRIEF-RULINGS (four it.2 interpretation calls, each a one-line reversal).

## Post-import live verification — appended 2026-07-17 12:48:45 IST (Session 2B follow-up)

Abilash imported the Vercel project (`kairali-web-factory-kairalihospitality-com`, prj_35O9A52SPqWuce1UiXjXnE09QqC4, team kairali) at ~12:43 IST; latest deployment READY, target production, from main. Note: Vercel truncated the short alias to `kairali-web-factory-kairalihospital.vercel.app` (name-length limit); the full-name aliases `…-kairalihospitality-com-kairali.vercel.app` / `…-git-main-kairali.vercel.app` also serve. Supersedes the 404 probes above; **preview URL for Human Gate C-1 now exists**. Real output:

```
$ curl -s -o page.html -w "HTTP %{http_code}\n" https://kairali-web-factory-kairalihospital.vercel.app/
HTTP 200
$ grep -oE '<h1[^>]*>.{0,120}' page.html | head -1
<h1><span>Places built to restore.</span> <span>A family practising Ayurveda for 118 years.</span></h1>
                                                  # ↑ computed rolling years (2026−1908=118), live
$ grep -o '"foundingDate":"[^"]*"' page.html
"foundingDate":"1989"        # PR #84 fleet-wide schema fix, live on this fresh deploy
$ curl -s -o /dev/null -w "llms.txt %{http_code} · " .../llms.txt; curl -s -o /dev/null -w "sitemap.xml %{http_code}\n" .../sitemap.xml
llms.txt 200 · sitemap.xml 200
$ curl -s -o /dev/null -w "/about-us.aspx → %{http_code} → %{redirect_url}\n" .../about-us.aspx
/about-us.aspx → 308 → https://kairali-web-factory-kairalihospital.vercel.app/   # single-hop
```

Still pending after this update (unchanged): Abilash preview approval (C-1), DNS flip (human), GSC/Bing/GA4, Lighthouse/factory-spec CI, Q-KH-JV-NAME (now with triangulation evidence on the "joint venture" label itself), Q-KH-2008/PHONE/BRIEF-RULINGS, "unbroken" phrasing (fleet item).
