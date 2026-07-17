# Page-Specific Checklist — healing.recipes (filled, retro)

**2026-07-17 12:08:36 IST · Master: docs/checklists/pagewise-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**BACKFILLED 2026-07-17 (build merged 16 Jul 2026, PR #81) — retro-filled under the arogyakendra honest-pending precedent; Session 2B evidence backfill.**
**Marks: [x] done · [~] partial · [ ] pending (reason) · [n/a] not applicable, with evidence per line. Page-level claims below were re-verified today by grepping/reading the merged page files (`789b523`) plus the committed audit reports; no builds or browser runs (read-only backfill). Char counts computed today from the actual strings in source.**

Routes: `/` (home) · `/books/<slug>` ×4 · `/author` · `/press` · `/contact` · `/privacy` · `/terms` · `/cookie-policy` (+ robots.txt, sitemap.xml, llms.txt metadata routes). Home gets the full per-master treatment; other routes follow in compact per-page sections.

## / (home) — full treatment

### Content Management
- [x] Content review — register ED, entity group (site.config.json); every fact traces to docs/site-briefs/healing-recipes-books.md (page header comment); compliance lint run TODAY: `node packages/compliance/bin/lint.js sites/healing.recipes` → 0 errors, 0 warnings, PASS; seo report: zero medical-claim patterns, zero banned filler words; award only on the book that won it + no prices + author never "Dr." all pinned by test/books.test.js guards (in CI `gate`, green on PR #81). · BACKFILLED 2026-07-17
- [~] Proofreading — design-review "human-made feel" 9.5/10 both iterations (strongest of the fleet); read-throughs at 375 and 1280 in both review passes. Honest residual, still in merged code (grep today): casing drift "Co-Founder &" (biblio lines, from books.json jobTitle) vs "co-founder and" (hero lede, author strip) — design-review fix 4 was only half-done (the hero-caption "280 pages"→"pp" drift WAS resolved by dropping pages from the caption). · BACKFILLED 2026-07-17
- [x] Internal linking — seo report PASS: home links all 4 book plates with descriptive anchors; header (4 links + CTA) and footer (4 internal + legal) on every page (chrome.tsx read today); /#shelf anchor targets exist. · BACKFILLED 2026-07-17
- [~] Multimedia optimization — covers downscaled 3.3× and verified on disk today (harmony.jpg 200K at 2× display size; total home image payload 836 KB measured over the wire in design-qa re-verify, was ~2.37 MB); descriptive alt text on every content image from books.json coverAlt (seo report PASS; guard test asserts alt names the book); explicit width/height everywhere. Residual: still JPEG — WebP/AVIF + srcset queued as a non-gating nicety (design-qa re-verify). · BACKFILLED 2026-07-17
- [x] Canonical tag — self-referencing `https://healing.recipes` via layout buildMetadata (seo report PASS on the rendered build; harmless no-slash-vs-sitemap-slash note logged there). · BACKFILLED 2026-07-17
- [~] Breadcrumb navigation — no visual breadcrumb (single-level home, by design); BreadcrumbList JSON-LD (Home) present in the @graph (app/page.tsx read today; parses per seo report). · BACKFILLED 2026-07-17
- [x] Structured data — Organization + WebSite + Person + 4×Book + BreadcrumbList @graph, consistent @id cross-references; all blocks parse; ISBN matrix 4/4 exact (seo report). Rich Results Test: pending live production URL. · BACKFILLED 2026-07-17
- [ ] Analytics/tracking codes — GA4/GTM/pixels pending IDs (Ship Gate B3–B6; none exist, none invented). data-cta hooks grep-verified today on home: hero_harmony, hero_shelf, featured_harmony, shelf_book_<slug> (templated per book — the design-review fix 5 "unsuffixed" finding is fixed in merged code), author_more, email_click. · BACKFILLED 2026-07-17
- [n/a] Marketing UTM parameters — no campaigns point at this site yet; PPC lane uses /lp/ routes when they exist (factory rule). · BACKFILLED 2026-07-17
- [n/a] hreflang — EN-only per site.config.json `"locales": ["en"]`; packages/seo emits canonical-only for single-locale sites (no orphan-locale risk). · BACKFILLED 2026-07-17
- [~] Third-party integrations — @kairali/consent banner + @kairali/analytics wired in layout with consent-defaults-before-tag-loaders ordering (layout.tsx read today); consent banner buttons measured 44px in design-review. No chatbot and no forms BY DESIGN — contact is locked-email-only pending Q-HR-PHONE (chrome.tsx/contact page header comments). Consent-banner inline privacy link under 44px = shared-package note (design-qa). · BACKFILLED 2026-07-17
- [~] Accessibility — semantic landmarks with aria-labelledby on every section (page.tsx read today); keyboard focus ring machine-verified (3px leaf-500 @55%, matchesFV true); prefers-reduced-motion honored (animation collapses, measured); dark-band contrasts AA (ivory@90% 8.85:1); h1 Kurale 400 (design-qa PASS rows + design-review computed-style audit). Honest residuals: bronze-400 overlines 2.80:1 on ivory (sub-AA display accent, pending Q14 bronze-600 token — globals.css:335 TODO); inline links under 44px (WCAG 2.2 inline exception). WAVE run: pending live URL. · BACKFILLED 2026-07-17
- [x] Page-specific 301 redirects — home absorbs 8 of the 14 legacy URLs (/default, /concept, /recipes, /faq, /gallery, /chef-retreat-july-2017, /menu-july-2017, /sitemap .aspx → `/`), each single-hop, curl-verified in the seo report (emitted as 308; human-flagged). /recipes.aspx→/ is interim pending Q-HR-ARCHIVE. · BACKFILLED 2026-07-17
- [x] Metadata — title "Healing Recipes — The Books of Gita Ramesh" = 42ch ≤60; description 141ch ≤155 (counted today from layout.tsx); OG + Twitter card with real og.jpg (74 KB on disk, 1200×630 per IMAGE_MANIFEST.md) — no fabricated asset. · BACKFILLED 2026-07-17

### Technical Checks
- [x] Clean descriptive URL — `/` on the branded domain; keyword-bearing routes below it. · BACKFILLED 2026-07-17
- [~] All links functional — internal: 8/8 routes returned 200 with zero console errors (design-qa route sweep); bare /books and unknown slugs correctly 404. External: every buy link is https and on the brief-verified retailer allowlist (books.test.js guard, CI-green); press/publisher links were live at audit time. Full automated external-link crawl not wired for this site — and not run in this read-only backfill. · BACKFILLED 2026-07-17
- [~] Forms/interactive — no forms by design (email-only contact policy, Q-HR-PHONE); interactive surfaces tested in the design passes: nav (desktop + wrapped mobile header), consent banner, shelf links, CTA pills — all in committed screenshots + probes. · BACKFILLED 2026-07-17

### Mobile-Friendliness (per page)
- [x] Verified at 375×812 / 768×1024 / 1440×900: zero horizontal overflow (machine-measured), wrapped two-row mobile header with all 4 nav links + Get Harmony pill visible, hero primary CTA in the mobile fold (top 505px), per-book shelf segments on mobile. Evidence: qa-home-* / qa2-home-* / it2-home-* / it2-mobile-header.png among the 37 committed screenshots + 2 probe JSONs. · BACKFILLED 2026-07-17

### Performance (per page)
- [~] Home image payload measured 836 KB over the wire after the 3.3× cut (design-qa re-verify; on-disk sizes re-checked today); explicit dimensions guard CLS; fonts self-hosted display:swap. NOT done: GTmetrix/PageSpeed/SEOptimer and Lighthouse (Ship Gate A5) — no production URL exists and A5 was never run for this site (retro-audit §1); design-review's LCP observation (~28ms paragraph paint) was on the local dev server, explicitly flagged there as non-authoritative. · BACKFILLED 2026-07-17

### Post-Migration Monitoring
- [ ] Pending GA4/GSC (no IDs/properties; see sitewide §6) — nothing can be monitored before the DNS flip. · BACKFILLED 2026-07-17

### Individual Page Optimization
- [x] H1 unique ("Recipes that carry a lineage." — page.tsx read today; exactly one h1, seo report 11/11 pages); H2s labelled with ids (shelf-heading, featured-heading, award-heading, author-heading, launch-heading — grep today); no skipped heading levels (seo report); keywords natural (Ayurvedic, cookbook, Gita Ramesh, Kairali); rolling year computed not typed (`new Date().getFullYear() - 2000`, guard-tested); launch band placeholder enforced by test (no day-precision date can ship — books.test.js). · BACKFILLED 2026-07-17

### Priority Pages
- [~] Home + /books/harmony are the priority pages (KPI = buy clicks; harmony carries sitemap priority 0.9, verified in sitemap.ts today). Rankings/traffic monitoring and the Fleet Pulse baseline row: pending launch + analytics (Wave 3). · BACKFILLED 2026-07-17

## /books/<slug> ×4 (harmony · ayurvedic-herbal-massage · the-ayurvedic-cookbook · the-ayurvedic-wellness-cookbook) — compact

- [x] Unique titles/descriptions per book, within limits — seo report length table: harmony 21/152 · herbal-massage 38/151 · cookbook 36/134 · wellness 45/133 (title/desc chars); generated from books.json through buildMetadata, which throws on over-limit ([slug]/page.tsx read today). Honest note: values are pre-`slice()`d to LIMITS before the gate — silent truncation the seo report flagged as gate-weakening; unchanged in merged code. · BACKFILLED 2026-07-17
- [x] Canonical + page-specific OG — buildMetadata sets canonical `/books/<slug>`, ogType "book", ogImage = the real cover (file read today); seo report confirmed self-canonicals on all indexable pages. · BACKFILLED 2026-07-17
- [x] H1 = book title, one per page (seo report 11/11); plate subtitle now forest-700 at 10.56:1 (design-qa re-verify FIXED, ex-Critical 1). · BACKFILLED 2026-07-17
- [x] Schema — Person + Book + BreadcrumbList per page; all four ISBNs match content/books.json exactly (seo report matrix); ISBNs locked + award-misattribution + retailer-allowlist + no-price guards in test/books.test.js (CI-green on PR #81). · BACKFILLED 2026-07-17
- [x] Internal links — back-link to /#shelf, breadcrumb via /#shelf, author @id links to /author (file read today; seo report internal-linking PASS). · BACKFILLED 2026-07-17
- [~] Conversion layout — buy row above the fold at 1440×900 (y=385, machine-measured, ex-Warning FIXED); at 375×812 it sits ~82px below the fold behind a first-visit consent banner (design-review it.2) — honest residual on the KPI page, queued for the polish pass. buy_click instrumentation: harmony 4 · cookbook 4 · herbal 3 · wellness 3 links, matching offer counts (seo report). · BACKFILLED 2026-07-17
- [x] Page-specific 301s — /reservations.aspx & /enquire-now.aspx do not target books (→ /contact); no legacy URL maps to a book page (redirects.json read today) — books are new URLs, no equity to carry. · BACKFILLED 2026-07-17

## /author — compact

- [x] Unique title/description — "Gita Ramesh — Author & Co-Founder, Kairali Ayurvedic Group" = 58ch ≤60; description = **143ch** ≤155 (counted today from the merged source). This is the seo report's 160-char FAIL, fixed before merge and now routed through the buildMetadata throw-gate (author/page.tsx:20 comment "Through the packages/seo gate") — no committed re-audit exists, so verification here is today's grep, not the report. · BACKFILLED 2026-07-17
- [x] Canonical — buildMetadata path "/author" (file read today). · BACKFILLED 2026-07-17
- [x] H1 — "Gita Ramesh", one per page (file read today; seo report 11/11). · BACKFILLED 2026-07-17
- [x] Schema — Person (@id shared with home/books, sameAs from books.json) + BreadcrumbList (file read today; parses per seo report). · BACKFILLED 2026-07-17
- [x] Internal links — CTA "See the four books" → /#shelf (data-cta author_shelf); header/footer chrome. · BACKFILLED 2026-07-17
- [~] Page quality residual — bare desktop column: design-review fix 3 was NOT attempted (it.2: same prose column, 460px empty ivory at 1280); no author photograph exists (IMAGE_MANIFEST GAP, flagged to Abilash) — the page's premium ceiling stays capped until a real portrait ships. Recorded, not fixed. · BACKFILLED 2026-07-17
- [x] noindex — n/a, indexable by design; in sitemap at 0.7 (sitemap.ts read today). · BACKFILLED 2026-07-17

## /press — compact

- [x] Unique title/description — "Press — the books of Gita Ramesh" = 32ch; description 128ch (counted today); through buildMetadata (file read today). · BACKFILLED 2026-07-17
- [x] Canonical — buildMetadata path "/press" (file read today; the seo report's site-default-OG WARN for this page is resolved by the same gate routing — code-verified today, not re-audited). · BACKFILLED 2026-07-17
- [x] H1 — "In print and online", one per page (file read today; seo report 11/11). No H2s — seo report WARN (unlabelled sections), an AEO opportunity left open. · BACKFILLED 2026-07-17
- [n/a] Schema — no page-specific JSON-LD (grep today: ld+json only on home/author/books); no on-site article content to mark up — coverage links out to The Hindu, Travel Potpourri, Ayurveda Journals, Roli Books, each labelled with its source (publisher promotion labelled as such). · BACKFILLED 2026-07-17
- [x] Internal links + contact path — mailto info@kairali.com (locked fact) with data-cta email_click; header/footer chrome; reachable on mobile since the it.2 nav fix (was an it.1 blocker — journalist-on-phone case, design-review). · BACKFILLED 2026-07-17
- [x] Page-specific 301 — /press-praise.aspx → /press, single-hop, audit-verified. · BACKFILLED 2026-07-17

## /contact — compact

- [x] Unique title/description — "Contact — Healing Recipes" = 25ch; description 92ch (counted today); through buildMetadata (file read today). · BACKFILLED 2026-07-17
- [x] Canonical — buildMetadata path "/contact" (file read today). · BACKFILLED 2026-07-17
- [x] H1 — "Write to us", one per page (file read today; seo report 11/11). · BACKFILLED 2026-07-17
- [n/a] Schema — no page-specific JSON-LD; Organization contact data lives in the home @graph (info@kairali.com in JSON-LD, seo report entity-consistency PASS). · BACKFILLED 2026-07-17
- [x] Contact facts — locked email only, data-cta email_click; NO phone by rule 6 until Q-HR-PHONE is answered (page header comment; zero occurrences of the …38777 bug fleet-wide per seo report). · BACKFILLED 2026-07-17
- [x] Page-specific 301s — /reservations.aspx, /enquire-now.aspx, /contact-us.aspx → /contact, single-hop, audit-verified (3 of the 14). · BACKFILLED 2026-07-17
- [~] Forms — none by design (email-only); if a form ships later it must use packages/forms with consent gating. · BACKFILLED 2026-07-17

## /privacy · /terms · /cookie-policy (legal, draft) — compact

- [x] Unique titles — "Privacy Policy — Healing Recipes" 32ch · "Terms of Use — Healing Recipes" 30ch · "Cookie Policy — Healing Recipes" 31ch (grep + count today). No page descriptions — they inherit the layout default (seo report noted 141ch inherited); acceptable for noindex boilerplate. · BACKFILLED 2026-07-17
- [x] noindex discipline — `robots: { index: false, follow: true }` grep-verified in all three page files today; all three excluded from sitemap.ts (read today); shared DRAFT text from @kairali/legal, visibly marked "Draft — pending legal review" with visible dates (seo report E-E-A-T row). Legal-review sign-off itself: pending (drafts by design). · BACKFILLED 2026-07-17
- [~] Canonical — open audit note, still true in merged code (grep today: zero `alternates` in the three files): the hand-rolled metadata inherits the layout canonical, so noindex pages canonicalise to the homepage — a contradictory signal the seo report said to resolve (self-canonical or drop). Recorded, not fixed in this backfill. · BACKFILLED 2026-07-17
- [x] H1 — one per page via the shared @kairali/legal components (seo report: exactly 1 H1 on all 11 pages). · BACKFILLED 2026-07-17
- [n/a] Schema — legal boilerplate, noindex; none required. · BACKFILLED 2026-07-17
- [x] Internal links — footer legal nav on every page (chrome.tsx read today); /privacy-policy.aspx → /privacy 301 in the protection map (audit-verified). · BACKFILLED 2026-07-17

## Metadata routes (robots.txt · sitemap.xml · llms.txt) — compact

- [x] All three exist as code and were fetch-verified on the static build: robots sane, sitemap = exactly the 8 indexable URLs, llms.txt facts match books.json (four ISBNs, award, Harmony dates) and links all four book pages + publisher + group (route files read today; seo report PASS rows). Live-URL re-verify + GSC/Bing submission: pending flip. · BACKFILLED 2026-07-17
