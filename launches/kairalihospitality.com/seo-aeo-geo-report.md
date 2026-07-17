# SEO + AEO + GEO Audit — kairalihospitality.com

**2026-07-16 21:59:37 IST** · sub-agent: seo-aeo-geo-auditor · rule (n) launch pass
Audited against: `docs/site-briefs/kairalihospitality-build-2026-07-16.md` (D-SEO-DUAL) · charter: `.claude/agents/seo-aeo-geo-auditor.md`
Method: fresh `pnpm build` (clean, 12 static routes) → `next start -p 4316` → **curl = crawler truth** on every route + every legacy path; JSON-LD parsed with Python `json.loads`; guards suite re-run (8/8). Firecrawl MCP unavailable this session — raw-curl HTML substitutes and is the stricter test (nothing rendered client-side counts). Server killed after audit.

## Scope notes
- Shopify-specific checks: **N/A** — not a Shopify surface (umbrella brand one-pager; no products, no cart).
- GSC items (sitemap submission, query-data re-rank of redirect fates, CWV field data, mobile-usability report): **N/A-until-flip** — domain not yet pointed at this build. Brief already mandates pulling the aged GSC property at flip time.
- Monthly AI-citation query test: **N/A-until-flip** (nothing live to cite yet).

## Findings

| Check | Pillar | Status | Fix Needed |
|---|---|---|---|
| Every mined legacy `.aspx` (15 files in `content-mined/kairalihospitality.com/`) redirects, single hop | SEO | **PASS** | — . All 15 curl-verified `308` with final destinations (`/`, `/#properties`, `/#healing-village`, `/#enquire`). `permanent: true` in Next.js emits 308, not 301 — equivalent permanent signal for crawlers; noting for the record since the brief says "301". |
| `/default.aspx` + 13 audit-observed extras redirect | SEO | **PASS** | — . All curl-verified 308 single-hop incl. `/privacy-policy.aspx → /privacy`, `/terms-of-use.aspx → /terms`. 29/29 total. |
| No redirect chains: every internal destination serves 200 | SEO | **PASS** | — . `/`, `/privacy`, `/terms` all 200 direct; fragment targets `#properties`, `#healing-village`, `#enquire`, `#develop` all exist as real `id=` anchors in the HTML. |
| Cross-domain franchise fate `/ayurvedic-franchise.aspx → https://ayurvedafranchise.com/` | SEO | **PASS** | — . 308 single hop; live target curl-verified this session: `200`, **0 further redirects** (`num_redirects:0`). `kairalifranchise.com` appears nowhere (guard-asserted). |
| JSON-LD valid | SEO/GEO | **PASS** | — . One `@graph` block, parses clean: Organization (`foundingDate: "1989"`, lineage description "Founded in 1989 by K. V. Ramesh and Gita Ramesh — a family practising Ayurveda since 1908.", slogan lowercase) + WebSite + LodgingBusiness (Villa Raag) + Hospital (KTAHV) + BreadcrumbList. |
| No ownership assertion about the Czech JV in JSON-LD | GEO | **PASS** | — . Resort Svatá Kateřina is deliberately absent from the graph; `parentOrganization` appears only on the two Indian properties. Page copy says "joint venture" (Abilash's own framing) and nothing stronger. |
| JV name ships verified with correct diacritics | SEO/GEO | **PASS** | — . Rendered HTML: "Svatá Kateřina" ×4, "Vysočina" ×4, "VYSOČINA" ×2 (place strip). Case-insensitive regex for `swatak|katrina`: **zero hits** across HTML, llms.txt, og.jpg. latin-ext font subsets loaded, and the og.jpg screenshot shows the caron rendering in the brand face. |
| Clinical-register blocks carry zero banned words (KTAHV GST lock) | SEO | **PASS** | — . Both `data-register="clinical"` blocks (treatment door + Healing Village card) extracted from **rendered HTML** and scanned against the full `CLINICAL_LOCK_BANNED.en` list (spa/resort/holiday/luxury/cure/journey/guest/getaway/escape + plurals): zero hits. Card speaks hospital language (physician-led treatment programmes, patient cottages). "Resort Svatá Kateřina" sits outside the clinical blocks — correct scoping, the lock is KTAHV-only. |
| No invented counts; printed numbers honest | SEO/GEO | **PASS** | — . Full numeric sweep of rendered text: `3 properties` = exactly 3 `<article class="panel">` on the page; `2 countries` = the panels' own places (Goa IN, Kerala IN, Vysočina CZ → 2 distinct); `37` and `118` computed from 1989/1908 origins (source-asserted by guards); remaining digits are the locked phone and footer year. No room/acre/tariff/price content anywhere (guard + curl verified). |
| Title/description limits, all routes | SEO | **PASS** | — . Home title 59 chars (≤60), description 146 chars (≤155), enforced at build by `@kairali/seo` (throws over limit). Legal routes: unique titles 34–36 chars, all `noindex, follow`. |
| Canonical + single host | SEO | **PASS with WARN** | Home canonical `https://kairalihospitality.com` = og:url, one host, no www split. **WARN-1:** `/privacy`, `/terms`, `/cookie-policy` inherit the **homepage** canonical and homepage meta description from the root layout. They are noindex so nothing mis-indexes, but noindex + canonical-pointing-elsewhere is a mixed signal. Fix: per-page canonical (or drop canonical) + short own descriptions on the three legal routes. |
| H1/heading hierarchy | SEO | **PASS with WARN** | Single H1, clean h1→h2→h3, no skips. **WARN-2:** D-SEO-DUAL DEFEND names "exact-brand title/H1 (\"Kairali Hospitality\")" — the title, og:site_name, WebSite JSON-LD name and header wordmark all carry the exact brand, but the H1 is the design statement ("Places built to restore…"), per the same brief's §5.1 design spec. The brief contradicts itself; branded-query defence is still strong via title+schema. Flag to Abilash/builder rather than self-resolve. |
| og:image resolves; no consent banner baked in | SEO | **PASS** | — . `/og.jpg` 200, JPEG 1200×630 (correct OG ratio), absolute URL in og:image + twitter:image, `summary_large_image`. Visual inspection: hero screenshot, brand faces, **no consent banner or cookie bar in the image**. SSR HTML also ships no banner element (consent banner is client-mounted; consent-mode defaults all-denied are inlined BEFORE any tag loader — and no tag loader present pre-flip). |
| llms.txt ruled-facts-only | GEO | **PASS** | — . Every line traces to a lock or the two-source JV verification: three properties + verified JV name/region, "joint venture" framing with no ownership/legal-form claim, 1989 founding + 1908 family lineage (correctly separated), locked contacts only, no counts, no dates beyond the anchors, links to the three property domains + kairali.com + kairaliproducts.in. |
| robots.txt open to AI crawlers | GEO | **PASS** | — . `User-Agent: * / Allow: /` — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended all unblocked; sitemap declared. (Cloudflare/CDN bot rules re-check at flip.) |
| Sitemap correctness | SEO | **PASS** | — . `sitemap.xml` lists exactly the one indexable URL (`/`); noindex legal routes correctly excluded. |
| Server-rendered content | AEO/GEO | **PASS** | — . All 12 routes static-prerendered; every word of copy present in raw curl HTML (this whole audit ran on curl output — nothing depends on client JS). |
| Direct quotable identity answer near the top | AEO | **PASS** | — . Identity block (who/what/where) lands within the first ~60 words: group name, "Places built to restore. A family practising Ayurveda for 118 years.", GOA · PALAKKAD · VYSOČINA, then the three-intent fork mirroring the real query intents (stay / develop / treatment). Meta description + llms.txt summary carry the same canonical sentence for answer engines. |
| FAQ/HowTo schema | AEO | **N/A** | No Q&A content exists on this one-pager — schema correctly not fabricated (charter: never fabricate Q&A). |
| Intent/keyword coverage vs D-SEO-DUAL ATTACK | SEO/AEO | **PASS** | — . All four attack phrases present naturally: "Ayurvedic hospital … Kerala" (clinical card), "boutique wellness property … villa … Goa" (Raag panel), "Resort … Czech Republic … Ayurvedic Pavilion" (JV card + llms.txt), "wellness property / consultancy / Develop with us" (§5.7 chapter H2 + copy). MUST-NOT list clean: no tariffs/prices, no franchise keywords in rendered copy (franchise exists only as a redirect), no hospitality vocabulary inside KTAHV blocks. |
| Entity consistency (contacts) | GEO | **PASS** | — . `info@kairali.com` is the only mailbox in rendered output; WhatsApp 38797 ×10, known-bad 38777 ×0, unruled 9555156156 ×0. |
| Alt text on every image | SEO | **PASS** | — . 5 content images with descriptive 127–198-char alts; decorative wordmark icon correctly `alt="" aria-hidden`. All 8 image/icon assets curl 200. |
| Mixed content / HTTPS | SEO | **PASS** | — . Zero `http://` references in rendered HTML; all external hrefs https and match the locked destinations. |
| Core Web Vitals | SEO | **N/A-until-flip** (lab note: healthy) | Static prerender, 102 kB first-load JS, hero `fetchPriority="high"` with width/height set (CLS-safe). Field CWV + PageSpeed run belongs to the flip checklist. |
| E-E-A-T visible date/byline | GEO | **NOTE** | Brand homepage — no "Last updated" date or byline on the page ("where applicable" — arguably not applicable to a brand umbrella). Founder names present in copy + schema description. If wanted, a footer build-date is the cheap fix. |
| Freshness of rolling numbers | SEO | **NOTE** | `118 years` / `37 years` are computed at **build** time then frozen in the static prerender. True through 2026; they only stay true if the site rebuilds at least yearly (deploy cadence covers this today — noting so a January without deploys doesn't silently age the claim). |
| Monthly AI-citation query log | GEO | **N/A-until-flip** | Start the 10-query ChatGPT/Perplexity/AI-Overviews log at flip; charter requires 30-day cadence thereafter. |

## Evidence spine
- Build: `pnpm build` clean, 12/12 static routes (`/`, `/_not-found`, `/cookie-policy`, `/icon.png`, `/icon.svg`, `/llms.txt`, `/privacy`, `/robots.txt`, `/sitemap.xml`, `/terms` + assets).
- Guards: `node --test test/guards.test.js` → **8/8 pass** (clinical lock, JV spelling, counts, 1908-lineage, filler, redirect coverage, locked contacts, locked links).
- Redirects: 29/29 curl-verified 308 single-hop (15 mined + default.aspx + 13 observed extras); `ayurvedafranchise.com` live-verified 200, zero hops, this session.
- JSON-LD: parsed valid; foundingDate 1989; JV unmodelled (no ownership assertion).
- og.jpg: 1200×630, visually inspected — no consent banner, diacritics correct.

## Verdict: **PASS WITH WARNINGS**

Ship-blocking issues: none. Two warnings for the builder before flip:
1. **WARN-1** — legal routes inherit the homepage canonical + description (noindex contains the damage; still fix: per-page canonical or none, own short descriptions).
2. **WARN-2** — H1 carries the design statement, not the exact brand; the brief's DEFEND line and its §5.1 design spec conflict — needs an Abilash/builder ruling, not a silent fix.
Plus two notes (rolling-number rebuild cadence; optional visible updated-date) and the N/A-until-flip queue (GSC, CWV field, AI-citation log, CDN bot rules).

---
*Logger contract: 2026-07-16 21:59:37 IST · sub-agent=seo-aeo-geo-auditor · page audited: kairalihospitality.com (all 12 routes + 29 legacy paths, local build @ :4316) · issues: 2 WARN, 2 NOTE, 0 FAIL · tools: curl (crawler truth; Firecrawl unavailable), node:test guards, Python JSON-LD parse, sips/visual og inspection.*
