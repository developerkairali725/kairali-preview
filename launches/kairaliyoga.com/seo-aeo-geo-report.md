# SEO / AEO / GEO Audit — kairaliyoga.com

- **Audited:** 2026-07-16 21:58:34 IST
- **Sub-agent:** seo-aeo-geo-auditor (rule n post-build gate)
- **Method:** static production build served locally (`next start -p 4317`), fetched via curl — crawler truth, no browser JS. Firecrawl replaced by curl per D-SEO-DUAL adaptation (pre-flip local origin; external fetch impossible).
- **Intent audited against:** docs/site-briefs/kairaliyoga-build-2026-07-16.md (D-SEO-DUAL)
- **Scope exclusions (N/A-until-flip):** Shopify checks (no commerce on this site), GSC property, live AI-engine query logging, real-user CWV/INP, myshopify subdomain, PageSpeed field data.
- **Evidence artifacts:** launches/kairaliyoga.com/screens/ (Playwright set from build pass); guards.test.js run pasted below.

## Routes audited

`/` · `/privacy` · `/terms` · `/cookie-policy` · `/robots.txt` · `/sitemap.xml` · `/llms.txt` · `/og.jpg` · 9 legacy `.aspx` paths · all 9 page images.

## Findings

| Check | Pillar | Status | Fix Needed |
|---|---|---|---|
| All 9 legacy .aspx redirects present, 308 permanent, single-hop (`hops=1`, final 200), anchors exact per protection map (/#programmes, /#voices, /#teachers, /#enquire, / ×4) | SEO | PASS | — |
| Redirect anchor targets exist as real `id`s in rendered HTML (programmes, voices, teachers, enquire all present) | SEO | PASS | — |
| Remaining ~56 legacy sitemap URLs 404 on this origin | SEO | FLAGGED (known) | Pre-flip blocker already in BACKLOG cutover lane: extend redirect map to the full 65-URL legacy sitemap before DNS flip. Re-flagged here per brief instruction. |
| Title ≤60 on every route (/: 52 · /privacy: 29 · /terms: 27 · /cookie-policy: 28) | SEO | PASS | — |
| Meta description ≤155 on every route (154 on all — legal pages inherit the homepage description) | SEO | PASS | (see canonical row for the inheritance note) |
| Single H1 per route; heading hierarchy h1→h2→h3 with no skipped levels | SEO | PASS | — |
| Canonical on `/` = https://kairaliyoga.com; robots `index, follow`; legal pages `noindex, follow` | SEO | PASS | — |
| Legal pages inherit the HOMEPAGE canonical + description (Next metadata inheritance from layout — `/privacy` declares only title+robots) | SEO | WARN | Low severity (pages are noindex so no dupe-content risk), but a noindex page canonicalised to the homepage is contradictory signalling. Fix: per-page `alternates.canonical` (or buildMetadata with `path`) on /privacy, /terms, /cookie-policy. |
| Descriptive alt text on all 9 images; decorative wordmark icon correctly `alt="" aria-hidden` | SEO | PASS | — |
| All image srcs + og.jpg resolve 200 from the static origin | SEO | PASS | — |
| og:image = absolute https://kairaliyoga.com/og.jpg, 1200×630 actual pixels matching declared og:image:width/height; visual check: clean hero render, NO consent banner baked in | SEO | PASS | — |
| Full OG + Twitter card set (og:title/description/url/type/locale/image dims; twitter:card/title/description/image) | SEO | PASS | — |
| sitemap.xml: single URL, current lastmod (2026-07-16), priority 1; robots.txt references it | SEO | PASS | — |
| Viewport meta present; single-column static page, self-hosted fonts `display: swap`, hero `fetchPriority="high"`, below-fold images lazy | SEO | PASS (structural) | Lab/field CWV (LCP/CLS/INP) measurable only post-flip — Lighthouse ≥90 ship gate stands as the pre-flip proxy. |
| HTTPS / mixed content | SEO | N/A-until-flip | All asset references are relative or https; verify TLS at Vercel flip. |
| JSON-LD: one `@graph` script, parses as valid JSON, serializer escapes `<` | AEO | PASS | — |
| Organization node: `foundingDate: "1989"` + lineage ONLY in description with PR #65 licensed phrasing ("Founded in 1989 by K. V. Ramesh and Gita Ramesh — a family practising Ayurveda since 1908.") — the fleet fix is live on this site | AEO/GEO | PASS | — |
| WebSite node (name "Kairali Yoga", publisher → #organization, inLanguage en) + BreadcrumbList | AEO | PASS | — |
| FAQPage schema matches the visible `<details>/<summary>` accordion VERBATIM — 6/6 questions and 6/6 answers byte-identical after entity decoding | AEO | PASS | — |
| Answer content server-rendered (all copy present in curl HTML; no client-JS gate) | AEO/GEO | PASS | — |
| Direct quotable answer up top (hero lede states what/where/registers in first ~40 words) | AEO | PASS | — |
| FAQ questions are `<summary>` elements, not H2/H3 | AEO | PASS (pattern note) | Acceptable: questions are visible, server-rendered, schema-matched. If AI-overview citation underperforms post-flip, consider h3-in-summary markup. |
| NO prices anywhere: zero ₹/$/€/INR/USD in visible text of all routes + llms.txt (raw-HTML `$` hits are React RSC flight markers only); "Why are no prices published here?" FAQ handles it honestly | SEO/compliance | PASS | — |
| NO invented dates: admissions strip is date-free ("Admissions are year-round. Dates are set with you."); zero month-day patterns on `/`; legal pages' "Last reviewed 14 July 2026" is a real package stamp, not an invented batch date | compliance | PASS | — |
| NO cure/treat claims: zero cure/cures/cured/heals/treats-a-condition matches in visible copy; "Chikitsa" appears only inside reckoner-printed programme NAMES (Agni Dīpanam Yoga Chikitsa, Prāna Sāmya Yoga Chikitsa); English framing stays structural ("yoga therapy for digestive wellness" = programme's own printed name; body copy claims routine, not outcomes) | compliance | PASS | — |
| KTAHV banned register: zero spa/resort/holiday/luxury/journey/guests; zero group filler words; "retreat" appears exactly ONCE, as the visitor's word in the FAQ question, per the register note (audit-#14 ruling pending — trivially removable) | compliance | PASS | — |
| No "yoga teacher training" OFFER claim — the phrase appears once, in the honest referral ("If you are researching yoga teacher training, write to us anyway…"), exactly the sanctioned framing; no YTT invented | compliance | PASS | — |
| Testimonials: 3 quotes are verbatim substrings of content-mined/kairaliyoga.com/testimonials.html; attributions (Amitabh Kant Joint Secretary / Late Pramod Mahajan / Mrs. & Mr. Ajitabh Bachhan) exactly as legacy printed; visible carry-over note present; excerpts contain zero banned words | compliance | PASS | Abilash verify-at-flip flag stands (decade-old attributed quotes). |
| Locked facts: info@kairali.com everywhere; WhatsApp 38797 only (zero 38777); no `in@kairali.com` regression | compliance | PASS | — |
| "Since 1908" never attaches to the Group: footer + JSON-LD + llms.txt all use the licensed family-lineage phrasing; rolling year counts computed, never typed | compliance | PASS | — |
| llms.txt: exists, 200 text/plain, llmstxt.org format; every fact traces to a ruled source — 3 programme names/durations verbatim from reckoner, inclusions from reckoner blocks, training list from Ayurveda Training Courses V2, address/transfer distances from reckoner T&C (distances only, no transfer prices), 1989/1908 in licensed phrasing, locked contacts; explicitly states no prices/batch dates published | GEO | PASS | — |
| robots.txt: `User-Agent: * / Allow: /` — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended all unblocked | GEO | PASS | Re-verify at Vercel/WAF layer at flip (platform bot rules can override origin robots.txt). |
| Entity consistency: brand name, Olassery P.O. address, contacts identical across page footer, llms.txt, JSON-LD | GEO | PASS | Sync Google Business Profile at flip (N/A now). |
| Organization node has no `logo`/`sameAs` (builder supports both; site passes neither) | GEO | WARN | Enhancement: pass logo + sameAs (kairali.com, ayurvedichealingvillage.com, official social profiles) to kairaliOrganization() to strengthen the entity graph before flip. |
| E-E-A-T: no named author/visible publish date on the one-pager; provenance note on testimonials + legal last-reviewed stamps present | GEO | WARN | Acceptable for a programme surface; consider a discreet visible "content verified <month year>" line at the pre-flip pass (must stay clear of the date-free admissions strip rule — page-level stamp only, no programme dates). |
| Topic cluster / internal links: goal-first selector routes to #programmes/#training; programmes → #enquire; footer crosslinks to group sites with descriptive anchors | SEO/GEO | PASS | Single-page cluster by design ("lean at birth"); supporting pages are a post-flip growth lane. |
| Comparison table for multi-option content | AEO | PASS (pattern note) | Programmes use editorial blocks (D-DESIGN-DIFF deliberate); each block carries name/duration/inclusions in a consistent scannable frame, and llms.txt carries the same facts as structured lines. No fix required. |
| Monthly AI-engine query logging (10 target queries across ChatGPT/Perplexity/AIO) | GEO | N/A-until-flip | Start the 30-day cadence at DNS flip; add to cutover checklist. |
| Guard suite (guards.test.js, 8 tests: prices, dates, cure claims, 1908, redirect map, locked contacts, testimonials, reckoner names) | all | PASS 8/8 | Run output below. |

## Guard-suite evidence (run 2026-07-16 21:57 IST)

```
✔ no prices anywhere: rates live only in approved surfaces
✔ no invented dates: the admissions device stays honest (no month-day patterns)
✔ no cure/treat claims (compliance floor: yoga cures nothing)
✔ 1908 appears ONLY as family-lineage phrasing, and rolling numbers are computed
✔ redirect map covers every mined legacy page, single-hop
✔ locked contact facts only: info@kairali.com + the interim 38797 WhatsApp
✔ testimonials: at most 3, each a verbatim excerpt of the legacy testimonials page, rendered from the JSON
✔ programme names and durations match the rates reckoner exactly
tests 8 · pass 8 · fail 0
```

## Redirect evidence (curl, static origin :4317)

```
/default.aspx                → 308 → /            (hops=1, final 200)
/about-us.aspx               → 308 → /
/retreat-programs.aspx       → 308 → /#programmes
/testimonials.aspx           → 308 → /#voices
/yoga-teachers.aspx          → 308 → /#teachers
/yoga-and-ayurveda.aspx      → 308 → /
/media-center.aspx           → 308 → /
/competition-form.aspx       → 308 → /#enquire
/free-consultation-form.aspx → 308 → /#enquire
```

(Brief's protection map says "301"; Next.js `permanent: true` emits 308 — equivalent permanent-redirect semantics, method-preserving. Verified single-hop: every hop count = 1.)

## Verdict

**PASS WITH WARNINGS**

All brief-mandated hard checks pass: 9/9 single-hop 308 redirects with exact anchors, valid JSON-LD graph carrying the fleet's 1989/lineage fix, FAQPage verbatim-matched to the visible accordion, titles/descriptions within limits on every route, zero prices, zero invented dates, zero cure/treat claims, verbatim legacy testimonials, clean 1200×630 og.jpg, ruled-facts-only llms.txt, AI crawlers unblocked. Warnings are non-blocking: (1) legal pages inherit the homepage canonical/description, (2) Organization node lacks logo/sameAs, (3) no visible page-level update stamp; plus the already-flagged pre-flip blocker to extend the redirect map to the full 65-URL legacy sitemap.

## Logger contract line

```
timestamp: 2026-07-16 21:58:34 IST · sub-agent: seo-aeo-geo-auditor · page: kairaliyoga.com (one-pager, static build @ :4317) · issues: 3 WARN (legal-page canonical inheritance; Organization logo/sameAs absent; no visible update stamp) + 1 known pre-flip blocker re-flagged (65-URL redirect map) · tools: curl (Firecrawl N/A pre-flip), node HTML/JSON-LD parsing, guards.test.js 8/8, sips og.jpg dims
```
