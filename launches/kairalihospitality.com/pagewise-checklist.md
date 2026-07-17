# Page-Specific Checklist — kairalihospitality.com (filled)

**2026-07-17 12:07:48 IST · Master: docs/checklists/pagewise-migration-checklist.md · Launch-evidence rule: CLAUDE.md v1.1**
**BACKFILLED 2026-07-17 (build merged 17 Jul 2026, PR #86) — retro-filled under the arogyakendra honest-pending precedent; Session 2B evidence backfill.**
**Marks: [x] done · [~] partial · [ ] pending (reason) · [n/a] not applicable, with evidence per line.**

## Route inventory (what actually exists in app/ — enumerated, not assumed)

12 static build routes. Page routes: `/` (home), `/privacy`, `/terms`, `/cookie-policy`.
Metadata routes: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/icon.png`, `/icon.svg`, plus
`/_not-found` and assets. There are NO separate property-door / treatment / consultancy /
contact routes — those intents live as sections of the home one-pager behind real anchors
(`#properties`, `#healing-village`, `#develop`, `#enquire`; grep-verified at backfill), which is
also where the legacy redirect fates land. Home gets the full per-master treatment below; the
three noindex legal routes share one compact section.

## / (home) — full per-master treatment

### Content Management
- [x] Content review — group-corporate register (site.config entity "group", register E) with the clinical register carved out and enforced: both `data-register="clinical"` blocks (treatment door + Healing Village panel) scanned zero-hit against the full CLINICAL_LOCK_BANNED lexicon imported from packages/compliance, on the RENDERED DOM, by both reviewers; guards re-run 8/8 at backfill; compliance lint re-run at backfill → 0 errors 0 warnings PASS. Backfill spot-grep of the banned lexicon across app/*.tsx: 2 hits, both the proper noun "Resort Svatá Kateřina" outside the clinical blocks (lock is KTAHV-scoped; Villa Raag hospitality register exempt). Legacy stale content replaced; unverified legacy claims omitted per rule 6 (the "established 2008 subsidiary" line → Q-KH-2008; the 9555156156 group line → Q-KH-PHONE; JV ownership language → Q-KH-JV-NAME). · BACKFILLED 2026-07-17
- [x] Proofreading — Kurale 400 heads (never bolded — computed-weight verified), sentence-case body, critic read-throughs at 375/768/1280/1440 across two iterations; the dictated "Swatak Katrina" spelling is guard-tested to NEVER appear (re-run PASS at backfill) while the two-source-verified "Svatá Kateřina" ships ×4 with correct diacritics in the brand faces (latin-ext subsets; document.fonts.check true; caron visible in og.jpg). · BACKFILLED 2026-07-17
- [x] Internal linking — in-page anchors all real ids (grep at backfill); three property links + kairali.com + kairaliproducts.in; property destinations guard-locked (guards 8/8 at backfill); no dead internal routes (12-route build table). · BACKFILLED 2026-07-17
- [~] Multimedia optimization — 5 content images + og.jpg, ALL real library originals (no stock, no AI humans — manifest-verified provenance); alt texts 127–198 chars match IMAGE_MANIFEST.md verbatim and describe the actual frames (it.2 re-crops got new matching alts); srcset ladders (560/800/1200 derivatives) on disk, du-verified at backfill; 375-walk image payload cut 1,649KB → 766KB in it.2 (PR #86). Still open: images are JPEG-only — WebP/AVIF pending (design-qa warning). One honest photo gap, recorded as DESIGNED not missing: no Kateřina photograph exists in the library, so the Czech panel is deliberately text-first (IMAGE_MANIFEST GAP row; critic ruled it holds on desktop, and the it.2 mobile ratio release fixed the stack). · BACKFILLED 2026-07-17
- [x] Canonical tag — self-referencing `https://kairalihospitality.com` = og:url, single host; rendered-HTML grep re-verified at backfill on the it.2 build output. · BACKFILLED 2026-07-17
- [~] Breadcrumb navigation — visual breadcrumb n/a on a one-pager; BreadcrumbList present in the @graph and re-parsed valid at backfill. · BACKFILLED 2026-07-17
- [x] Structured data — one @graph: Organization (foundingDate "1989", 1908 as family lineage only — guard-enforced separation) + WebSite + LodgingBusiness (Villa Raag) + Hospital (KTAHV) + BreadcrumbList; re-parsed with json.loads at backfill; parentOrganization ONLY on the two Indian properties — the Czech JV deliberately unmodelled pending the legal-form ruling (Q-KH-JV-NAME). Rich Results Test pending live URL. · BACKFILLED 2026-07-17
- [ ] Analytics/tracking codes — GA4/GTM/pixels pending IDs (Ship Gate B3–B6; none invented, rule 6). 16 `data-cta` hooks grep-verified at backfill: door_stay · door_develop · door_clinical · raag_explore · raag_enquire · ktahv_site · ktahv_enquire · katerina_explore · katerina_enquire · whatsapp_develop · email_develop · whatsapp_closing · email_closing · whatsapp_click · email_click · header_enquire. · BACKFILLED 2026-07-17
- [n/a] Marketing UTM parameters — no campaigns point at this page; PPC lane uses /lp/ routes when they exist (noindex, single-CTA doctrine). · BACKFILLED 2026-07-17
- [n/a] hreflang — EN-only per site.config `locales: ["en"]`; no alternates exist, no orphan-locale risk. · BACKFILLED 2026-07-17
- [~] Third-party integrations — deliberately minimal: no chatbot, no CRM form (enquiry = WhatsApp + mailto with pre-filled per-property subjects — critic-verified). @kairali/consent banner integrated (defaults DENIED before any tag loader; Essential-only offered as an equal 44px pill; privacy link present — verified in both reviews) and @kairali/analytics present but inert pre-IDs. Consent flow exercised in the reviewers' Playwright sessions, not re-run at backfill. · BACKFILLED 2026-07-17
- [~] Accessibility — semantic sections with aria-labelledby (grep evidence), real-keyboard settled-state focus verified on every control (leaf ring stacks over the card shadow — the arogyashala cascade bug not repeated), zero tap targets <44px (critic census), prefers-reduced-motion collapses every transition (verified in a reduced-motion context), decorative wordmark `alt="" aria-hidden`. WAVE run: pending live production URL. · BACKFILLED 2026-07-17
- [x] Page-specific 301 redirects — 29 fates cover every mined legacy page + 13 observed extras, single-hop, curl-verified 29/29 on the local production build (seo report); intent-preserving anchors (`/accommodation-tariffs.aspx → /#healing-village` with no tariff content carried, rule 6; `/contact-us.aspx`+`/enquiry-now.aspx → /#enquire`); cross-domain franchise fate → ayurvedafranchise.com (live 200, 0 hops, 16 Jul); coverage guard re-run PASS at backfill. 308-not-301 nuance recorded in the sitewide file. · BACKFILLED 2026-07-17
- [x] Metadata — title 59ch ≤60 + description 146ch ≤155 (node-measured at backfill), keyword-bearing per D-SEO-DUAL; page OG (title/type/url/site_name/locale) + Twitter `summary_large_image` in rendered HTML; og:image absolute → real 1200×630 og.jpg (current hero, no consent banner baked in — the arogyashala lesson landed). · BACKFILLED 2026-07-17

### Technical Checks
- [x] Clean descriptive URL — `/` on the branded domain; intent sections addressable via named anchors. · BACKFILLED 2026-07-17
- [~] All links functional — internal anchors + 29 redirect fates + all 8 image/icon assets curl-verified 200 on the local build (seo report); external property links match locked destinations (guards at backfill); ayurvedafranchise.com live-verified. No automated crawl on a live deployment yet — none exists (no Vercel project; probes 404). · BACKFILLED 2026-07-17
- [~] Forms/interactive — no form by design (one-pager routes to WhatsApp/email); interactive features (consent choices, door/panel hover + focus, sticky header pill) exercised in three Playwright review passes at 375/768/1440 — not re-run at backfill (no builds/Playwright in this session). · BACKFILLED 2026-07-17

### Mobile-Friendliness (per page)
- [x] Verified at 375×812 DPR3 (fresh no-consent context), 768×1024 and 1440×900 across design-qa + critic it.1 + critic it.2 (independent re-measures each run). The page's own first-paint law (hero statement AND first door title+hint above the consent banner) FAILED it.1 by 12.3px and was re-measured MET in it.2; tablet panel stack centered (it.2 fix 5); Czech panel ratio released <760px (it.2 fix 4); zero horizontal overflow; zero <44px targets. Evidence: it2critic-*.png (14 files) among the 52 in screens/. · BACKFILLED 2026-07-17

### Performance (per page)
- [~] Lab-only evidence: static prerender, first-load JS 102 kB ≤130 budget, srcset ladders shipped it.2 (375-walk images 766KB, builder-measured, critic-accepted), hero fetchPriority=high with width/height (CLS-safe). GTmetrix / PageSpeed / SEOptimer NOT run and Lighthouse (Ship Gate A5) NOT run — pending live URL + CI wiring (17 Jul retro-audit gap #1) — marked honestly, not assumed. · BACKFILLED 2026-07-17

### Post-Migration Monitoring
- [ ] Pending GA4/GSC (sitewide §6); monthly AI-citation query log starts at flip; rolling-number freshness note (118/37 computed at build then frozen — stays true only with ≥yearly rebuilds, seo report NOTE). · BACKFILLED 2026-07-17

### Individual Page Optimization
- [~] Single H1, clean h1→h2→h3 with no skips (seo PASS; rendered-HTML re-verified at backfill). Recorded honestly: the H1 is the design statement "Places built to restore. A family practising Ayurveda for 118 years." — NOT the exact brand string the brief's DEFEND line names (seo WARN-2: the brief contradicts its own §5.1 design spec); exact-brand defence lives in title/og:site_name/WebSite schema/wordmark. This is interpretation call (4) of Q-KH-BRIEF-RULINGS, awaiting Abilash's ratification — a one-line reversal if ruled otherwise. Keywords natural per the four ATTACK phrases; JSON-LD valid; clean URL. · BACKFILLED 2026-07-17

### Priority Pages
- [x] Home is the priority page (the only indexable one). KPI = partner + stay + consultancy enquiries, fully attributable via the 16 per-audience/per-property data-cta hooks; one primary CTA voice per view held (critic 9.5 on CTA clarity, "a perfect 10" at it.2). Rankings baseline + 90-day monitoring: pending GSC property at flip; Fleet Pulse row pending Wave 3. · BACKFILLED 2026-07-17

## /privacy · /terms · /cookie-policy — shared section (noindex legal boilerplate)

- [x] Metadata — unique per-page titles 34–36ch ("Privacy Policy — Kairali Hospitality" / "Terms of Use — Kairali Hospitality" / "Cookie Policy — Kairali Hospitality", grep-verified in source at backfill) + own short descriptions + PER-PAGE canonicals via buildMetadata `path:` param — the seo audit's WARN-1 (legal routes inheriting the homepage canonical) was FIXED before merge (legal-canonicals commit 868c950; re-verified in all three page.tsx at backfill). · BACKFILLED 2026-07-17
- [x] Indexing — `robots: { index: false, follow: true }` explicitly set on all three (grep at backfill; buildMetadata's coupled flag deliberately overridden after — documented in source); all three excluded from the one-URL sitemap; all three served 200 direct with their .aspx predecessors redirecting single-hop (`/privacy-policy.aspx → /privacy`, `/terms-of-use.aspx → /terms` — config grep + seo curl evidence). · BACKFILLED 2026-07-17
- [~] Content review — shared @kairali/legal components render the pages (closes Ship Gate A12); the text is a shared DRAFT pending legal review (stated in each page's source comment) — honest partial until legal sign-off. · BACKFILLED 2026-07-17
- [x] H1 + structure — the shared component renders one `<h1>{title}</h1>` per page (packages/legal/src/index.tsx:36, grep at backfill); clean URL slugs (`/privacy`, `/terms`, `/cookie-policy`). · BACKFILLED 2026-07-17
- [n/a] Page-specific structured data — none on noindex boilerplate by design; no Q&A/Article schema fabricated (charter rule). · BACKFILLED 2026-07-17
- [~] Mobile/accessibility — same token system and layout shell as the audited surface (brand-lint 0/0 covers them; compliance lint target includes the site), but these three routes were not individually screenshot in the review passes — recorded honestly rather than claimed. · BACKFILLED 2026-07-17
- [n/a] Analytics/UTM/hreflang/forms — noindex EN-only boilerplate: no campaigns, no alternates, no forms; consent banner + footer links are the only interactive elements (covered by the home-page consent verification). · BACKFILLED 2026-07-17
