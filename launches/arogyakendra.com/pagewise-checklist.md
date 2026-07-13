# Page-Specific Checklist — arogyakendra.com / (home, the only page)

**2026-07-13 19:15:30 IST · Master: docs/checklists/pagewise-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**Marks: [x] done · [~] partial · [ ] pending (reason) · [n/a] not applicable, with evidence per line.**

## Content Management
- [x] Content review — group-corporate register (site.config.json entity "group"); compliance lint 0 findings (banned filler, cure claims, locked facts, heading rules). Evidence: `node packages/compliance/bin/lint.js sites/arogyakendra.com` → PASS.
- [x] Proofreading — Title Case headings, sentence-case body, botanical/none needed, tagline lowercase, "Since 1908" present twice; read-through at 375px and desktop.
- [~] Internal linking — one-pager: anchor `#top` plus six outbound family-brand links (functional targets are live legacy sites). No internal 404 possible (single route).
- [~] Multimedia optimization — placeholder-first: ZERO image bytes ship today; every slot has a described placeholder with alt text (aria-label) + IMAGE_MANIFEST.md row. Compression check applies at swap-in.
- [x] Canonical tag — self-referencing `https://arogyakendra.com` in rendered HTML (curl-verified).
- [~] Breadcrumb navigation — visual breadcrumb n/a on a one-pager; BreadcrumbList JSON-LD (Home) present and parseable.
- [x] Structured data — Organization + WebSite + BreadcrumbList @graph in page HTML; JSON.parse validated in browser; Rich Results Test pending live production domain.
- [ ] Analytics/tracking codes — GA4/GTM/pixels pending IDs (Ship Gate B3–B6); `data-cta` hooks present: whatsapp_click ×5, email_click ×3, brand_click ×6 (DOM-verified).
- [n/a] Marketing UTM parameters — no campaigns pointing at this page yet; PPC lane uses /lp/ routes when they exist.
- [n/a] hreflang — single locale EN per Register row; no alternates exist (no orphan-locale risk).
- [~] Third-party integrations — Chatbase interim Priya bot (rpNt_uRW6W8EDiTf6AvYJ per DECISIONS.md) integrated with lazy post-interaction load; verified loading + answering in browser. CRM form intentionally absent (one-pager routes to WhatsApp/email; packages/forms adoption is a follow-up). Consent gating pending packages/consent (recorded in chatbase-loader.tsx).
- [~] Accessibility — semantic landmarks (header/main/footer/sections with aria-labels), dl for facts, focus rings, ≥44px targets, prefers-reduced-motion honored via brand tokens, placeholder figures carry role="img" + aria-label. WAVE run: pending live production URL.
- [n/a] Page-specific 301 redirects — no prior URLs for this domain.
- [x] Metadata — title 51ch, description 152ch, page-specific OG (title/type/url/site_name/locale) + Twitter card in rendered HTML. og:image deliberately absent — asset does not exist; spec in IMAGE_MANIFEST.md (honesty rule: never fabricate).

## Technical Checks
- [x] Clean descriptive URL — `/` on the branded domain.
- [~] All links functional — six external brand sites + wa.me + mailto spot-checked by target (wa.me/919289838797 is the locked-fact number); full automated link crawl not yet wired for this site.
- [~] Forms/interactive — no form (by design); interactive features tested: WhatsApp links resolve, Chatbase bubble opens, sticky bar buttons tappable at 375px.

## Mobile-Friendliness (per page)
- [x] Verified at 375×812 (screenshots, full-page walkthrough), 768 breakpoint behaviour (sticky bar hides, header CTA shows) and 1120/1280 (computed styles + geometry). Touch elements ≥48px.

## Performance (per page)
- [~] Local production build: first-load JS 103 kB (≤130 kB budget); static prerender; zero images; fonts self-hosted subset. GTmetrix/PageSpeed/SEOptimer + Lighthouse CI: pending production URL / CI wiring — marked honestly, not assumed.

## Post-Migration Monitoring
- [ ] Pending GA4/GSC (see sitewide checklist §6).

## Individual Page Optimization
- [x] H1 unique ("Arogya Kendra — The Centre of Health", live-verified by curl); H2/H3 hierarchy correct (one H2 section head, H3 per brand card); keywords natural (Ayurvedic, Kairali, treatment, centre); JSON-LD valid; clean URL.

## Priority Pages
- [x] This is the only page = the priority page; KPI = branded-query capture (Register). Baseline/90-day row in Fleet Pulse: pending Fleet Pulse build (Wave 3).
