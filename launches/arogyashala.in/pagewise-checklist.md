# Page-Specific Checklist — arogyashala.in / (home one-pager + 3 legal routes)

**2026-07-17 12:07:08 IST · Master: docs/checklists/pagewise-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**BACKFILLED 2026-07-17 (build merged 16 Jul 2026, PR #84) — retro-filled under the arogyakendra honest-pending precedent; Session 2B evidence backfill**
**Marks: [x] done · [~] partial · [ ] pending (reason) · [n/a] not applicable, with evidence per line. Evidence sources: files inspected today, commands run today (read-only), the three committed reports in this folder, PR #84 CI. MERGED, NOT LAUNCHED — production-hostname checks pending the human DNS flip.**

## / (home — the only content page)

### Content Management
- [x] Content review — group-corporate register (site.config.json entity "group", register A); compliance lint run today: 0 errors, 3 warnings, PASS (warnings are "cure" in code comments/test names, zero findings in shipped copy). Facts law is BY DESIGN, not omission: no outlet counts, no locations, no fees, no cure-claims, computed years — Abilash's rulings, pinned by 6 guard tests re-run green today (`node --test sites/arogyashala.in/test/guards.test.js` → 6/6). Legacy cure-claim copy (2 mined files) deliberately not carried over. · BACKFILLED 2026-07-17
- [~] Proofreading — critic it.2 scored human-made feel 9.5 ("copy is specific, honest and register-correct throughout"); the "computed, not claimed" jargon leak and straight apostrophes were fixed before merge (design-review.md fix-verification + page.tsx inspected today). OPEN warning carried honestly: headings are sentence case vs Brand Manual ch.11 Title Case (design-qa Warning, unresolved — voice ruling pending). · BACKFILLED 2026-07-17
- [~] Internal linking — one-pager: two-door anchor router #owners/#verify (verified functioning, design-qa PASS row) plus 3 outbound family-brand links and 3 legal-route links (all 200 per seo-aeo-geo-report.md). No internal 404 possible on a single content route. · BACKFILLED 2026-07-17
- [~] Multimedia optimization — zero raster images in the page by design: decorative wordmark SVG (`alt="" aria-hidden` inside a link with aria-label — correct pattern, width/height set, no CLS) + the original annotated storefront SVG (`role="img"` + aria-label + HTML callouts; an honest drawing — no photo of a real counter exists, roster data blocked). og.jpg (share card) is 74.8 KB. OPEN: storefront callout `<strong>` labels were re-set via single-span markup (page.tsx:131-132 comment; screens/storefront-final.png) after the critic's finding 3, and board/marker fonts now use var(--font-display)/var(--font-caption) (page.tsx:95,123-127 inspected today) — but no third critic pass re-scored it. · BACKFILLED 2026-07-17
- [x] Canonical tag — self-referencing `https://arogyashala.in` in rendered HTML (grep of .next/server/app/index.html today), matches og:url. · BACKFILLED 2026-07-17
- [~] Breadcrumb navigation — visual breadcrumb n/a on a one-pager; BreadcrumbList JSON-LD (Home) present in the @graph (page.tsx:69-72, parses clean per seo report). · BACKFILLED 2026-07-17
- [x] Structured data — Organization + WebSite + FAQPage + BreadcrumbList @graph; FAQPage's 5 Q&A match the visible `<details>` accordion word-for-word (seo report pairwise check); rendered `"foundingDate":"1989"` grep-verified today after the FLEET-WIDE in-PR fix to packages/schema kairaliOrganization() (was 1908 on every site; regression test packages/schema/test/schema.test.js:25 asserts 1989 + lineage-only 1908 — the schema gate catching a real fleet defect). Rich Results Test: pending live production URL. · BACKFILLED 2026-07-17
- [ ] Analytics/tracking codes — GA4/GTM/pixels pending IDs (Ship Gate B3–B6, none invented); grep today: 10 `data-cta` hooks present (door_owner, door_verify, whatsapp_owner, email_owner, whatsapp_verify, email_verify, whatsapp_closing, email_closing, whatsapp_click, email_click) — per-audience attribution the critic called the fleet's best. · BACKFILLED 2026-07-17
- [n/a] Marketing UTM parameters — no campaigns point at this page; /lp/ doctrine applies when they exist. · BACKFILLED 2026-07-17
- [n/a] hreflang — single locale EN per register (site.config.json locales: ["en"]); no alternates exist. · BACKFILLED 2026-07-17
- [~] Third-party integrations — no chatbot and no CRM form BY DESIGN (WhatsApp/email routing for a trade audience); the only integration is the @kairali/consent banner + @kairali/analytics loader: consent-before-tags order enforced in layout.tsx:31-33, banner render + 44px buttons + equal-prominence decline verified (design-qa PASS row; critic2 first-paint measurements after the consent/door collision fix). · BACKFILLED 2026-07-17
- [~] Accessibility — semantic landmarks (header/main/footer, labelled navs, dl trust facts), single H1, 0 images missing alt, storefront SVG role="img"+aria-label with HTML callouts, reduced-motion honored (transitions collapse, brand-tokens rule), all tap targets ≥44px, leaf focus rings on doors + FAQ summaries fixed and re-proven with real Tab keypresses in it.2 (critic2-focus-*.png). WAVE run: pending live production URL. · BACKFILLED 2026-07-17
- [~] Page-specific 301 redirects — all 14 legacy .aspx URLs land here single-hop except pirvacy-policy.aspx → /privacy; routes-manifest counted today (14, statusCode 308-permanent); guard-asserted; curl-tested on the local prod build (seo report 14/14). Production-hostname test pending DNS flip. · BACKFILLED 2026-07-17
- [x] Metadata — title 54 chars ≤60 with exact brand + attack keyword; description 146 chars ≤155; page OG (title/type/url/site_name/locale) + twitter summary_large_image + og:image 1200×630 real asset (rendered-HTML grep today; og.jpg inspected today — current H1, no baked-in consent banner, critic finding 7 fixed before merge). · BACKFILLED 2026-07-17

### Technical Checks
- [x] Clean descriptive URL — `/` on the branded domain; attack keywords carried by title/H1/H2s, not the URL, on a one-pager. · BACKFILLED 2026-07-17
- [~] All links functional — legal routes 200, outbound family links + wa.me/919289838797 (locked interim Priya number) + mailto:info@kairali.com spot-checked by target (seo report; guards pin the locked contacts, no …38777 anywhere); full automated link crawl not wired — factory-spec matrix never included this site. · BACKFILLED 2026-07-17
- [~] Forms/interactive — no form BY DESIGN (FAQ 1 explicitly refuses to be a franchise-fee page; enquiry routes to WhatsApp/email). Interactive features tested: native details/summary FAQ toggles (no JS needed), custom +/– marker inside the content box, anchor router scroll, consent banner buttons — all verified in the committed critic evidence (critic2-faq-open-mobile.png etc.). · BACKFILLED 2026-07-17

### Mobile-Friendliness (per page)
- [x] Verified at 375×812 (DPR 3, touch, Android UA), 768×1024 and 1440×900/1280×900 — zero horizontal overflow at all; dual-audience first paint restored (both door titles measured above the consent banner: clearances 192.0px / 28.5px); every tap target ≥44px, footer CTAs 54.4px. Evidence: design-qa-report.md + design-review.md it.2 measurements + qa-/critic2- screenshots (41 files in screens/, counted today). · BACKFILLED 2026-07-17

### Performance (per page)
- [~] Lab posture only: text-node LCP on flat forest-700, dimensions on the only `<img>` (CLS ≈ 0), no client data fetching, zero raster in the document, self-hosted fonts, ~525 KB uncompressed localhost total (wire smaller). GTmetrix / PageSpeed / SEOptimer / Lighthouse: NOT RUN — pending production URL + CI wiring (Lighthouse absent from CI, retro-audit §1); recorded honestly, not assumed. · BACKFILLED 2026-07-17

### Post-Migration Monitoring
- [ ] Pending GA4/GSC (no IDs, no property — see sitewide §6); monthly AI-citation query test due within 30 days of DNS flip. · BACKFILLED 2026-07-17

### Individual Page Optimization
- [x] H1 unique and brand-bearing — "Arogya Shala — the Kairali counter for your neighbourhood." (it.2 closed the seo report's exact-brand-H1 WARN; page.tsx:172 inspected today); exactly one H1, order H1→H2→H3→H2→H2 with no skips (seo PASS row); keywords natural incl. "become a Kairali retailer" closing the ATTACK set (page.tsx:204); JSON-LD valid; clean URL. · BACKFILLED 2026-07-17

### Priority Pages
- [~] This is the only page = the priority page; KPI = branded-query defence + trade-enquiry capture (D-SEO-DUAL). Baseline and 90-day tracking: pending GSC property and Fleet Pulse — nothing to measure against until the flip. · BACKFILLED 2026-07-17

## /privacy · /terms · /cookie-policy (shared section — boilerplate legal routes from @kairali/legal)

- [x] Rendered from the shared @kairali/legal components (PrivacyPolicy/TermsOfService/CookiePolicy) with per-site facts (domain/entity/siteName); all three served 200 with H1s on the audited build (design-qa + seo reports). · BACKFILLED 2026-07-17
- [x] noindex — grep-verified today in source (`robots: { index: false, follow: true }` in each page.tsx) AND in rendered output (.next/server/app/privacy.html: `name="robots" content="noindex, follow"`); consistent with the homepage-only sitemap. · BACKFILLED 2026-07-17
- [~] Canonical — KNOWN WARN, recorded not fixed (report-honest backfill): all three inherit the layout canonical and emit `rel=canonical → https://arogyashala.in` (the homepage) instead of self-referencing — grep-verified today in rendered privacy.html; contradictory signalling muted by the noindex (seo-aeo-geo-report.md WARN row). Fix belongs to a code PR, not this backfill. · BACKFILLED 2026-07-17
- [ ] Draft status — all three self-describe as "Draft — pending legal review" with no dated effective date: correct honesty pre-flip, but a PRE-FLIP BLOCKER — must be legally reviewed and dated before DNS flip (seo-aeo-geo-report.md WARN row; tracked for the flip checklist). · BACKFILLED 2026-07-17
- [n/a] Remaining master items (keywords, breadcrumbs, page schema, UTM, hreflang, integrations, priority tracking) — boilerplate noindexed legal pages, not ranking or converting surfaces; nothing applies beyond the rows above. · BACKFILLED 2026-07-17
