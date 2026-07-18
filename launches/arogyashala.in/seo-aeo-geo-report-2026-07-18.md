# arogyashala.in — SEO / AEO / GEO re-audit (fresh verdict on deployed origin/main)

*Filed by the PROMPT 4 pilot session (docs/reports/2026-07-18-prompt4-single-pager-pilot.md §4); subagent ran 16:12:52–16:17:57 IST, 18 Jul 2026; verbatim report below. Predecessor: seo-aeo-geo-report.md (16 Jul, verdict FAIL). Subagent telemetry (machine-reported): 96,391 tokens · 24 tool uses · 378s.*

- **Timestamp:** 2026-07-18 16:17:57 IST
- **Sub-agent:** seo-aeo-geo-auditor (REPORT ONLY — no repo writes by the subagent; filed by the parent session)
- **Target:** live Vercel preview `https://kairali-web-factory-arogyashala-in.vercel.app` — `/` (200, 52,241 B), `/privacy` (200), `/terms` (200), `/cookie-policy` (200), `/robots.txt` (200, 68 B), `/sitemap.xml` (200, 258 B), `/llms.txt` (200, 1,311 B), plus all 14 legacy `.aspx` redirects and the OG/icon assets.
- **Method:** curl (exact crawler view of served HTML — no JS execution needed, static export), node parsing of the rendered JSON-LD block, header inspection (`curl -I`), byte-level grep of fetched bodies, `sips` for image dimensions; source cross-checks read-only against `sites/arogyashala.in/next.config.ts`, `packages/schema/src/index.js`, `packages/schema/test/schema.test.js`. Every value quoted was fetched this session (HARD GATE 6).
- **Scope notes:** Shopify checks **N/A** (not a Shopify property). GSC, field Core Web Vitals, GBP entity match, and the monthly live-AI-query test are **N/A-until-DNS-flip** — stated, not attempted.
- **Intent audited against:** D-SEO-DUAL (`docs/site-briefs/arogyashala-build-2026-07-16.md`).

## Verdict: **PASS WITH WARNINGS** — the 16-Jul FAIL is cleared; all three of its actionable WARNs are fixed; remaining warnings are the two known noindex-muted legal-page nits plus the pre-flip legal-draft blocker already tracked for the flip checklist.

## The 16-Jul FAIL and WARNs — current deployed state

| 16-Jul finding | Now | Evidence (fetched this session) |
|---|---|---|
| **FAIL: foundingDate "1908"** | **FIXED — verified in rendered JSON-LD** | Live `@graph` Organization node: `"name": "Kairali Ayurvedic Group", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh — a family practising Ayurveda since 1908."` Source confirms `packages/schema/src/index.js:75` and the regression guard `packages/schema/test/schema.test.js:25` (`assert.equal(org.foundingDate, "1989")`) with line 27 asserting no other `1908` outside the licensed phrasing. |
| WARN: H1 lacks exact brand | **FIXED** | Live H1 (single, count = 1): `"Arogya Shala — the Kairali counter for your neighbourhood."` |
| WARN: no og:image / twitter:image | **FIXED** | `og:image` = `https://arogyashala.in/og.jpg`, `twitter:image` same, `twitter:card` = `summary_large_image`; asset serves `200 image/jpeg` 67,211 B at exactly **1200×630** (sips-verified). |
| WARN: "become a kairali retailer" absent | **FIXED** | `become a Kairali retailer` ×2 in served homepage HTML ("the straightforward way to become a Kairali retailer"). ATTACK phrase set now complete. |

## Findings table

| Check | Pillar | Status | Evidence / Fix Needed |
|---|---|---|---|
| Title tag | SEO | PASS | `Arogya Shala — Kairali Branding for Ayurvedic Counters` — 54 chars (≤60), exact brand + attack keyword. |
| Meta description | SEO | PASS | 146 chars decoded (≤155), no filler, no claims. |
| Canonical (homepage) | SEO | PASS | `<link rel="canonical" href="https://arogyashala.in"/>`, matches `og:url`. Nit only: sitemap uses trailing-slash root — identical URL for a domain root, no action. |
| Robots meta (homepage) | SEO | PASS | `index, follow`. |
| Single H1 / hierarchy | SEO | PASS | 1×H1; H2s: "What an Arogya Shala counter is" / "Saw an Arogya Shala board? Check it in one message." / "Before you ask"; 1×H3; no skipped levels. |
| hreflang (EN-only site) | SEO | PASS | Zero hreflang tags on all four pages, `<html lang="en">`, WebSite JSON-LD `inLanguage: "en"` — no orphan hreflang. Correct for a declared EN-only site. |
| robots.txt sanity | GEO | PASS | `User-Agent: *` / `Allow: /` / `Sitemap: https://arogyashala.in/sitemap.xml`. No AI-crawler blocks — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended all crawlable. |
| sitemap.xml correctness | SEO | PASS | Single `<loc>https://arogyashala.in/</loc>` (canonical domain), `lastmod 2026-07-18T10:41:50.116Z` (current build), homepage-only — consistent with the three legal routes being `noindex`. |
| JSON-LD parses + validates | GEO | PASS | One `@graph` script block, 2,267 chars, `JSON.parse` clean. Nodes: Organization (locked facts correct), WebSite (publisher `@id` → organization), FAQPage (5 Questions), BreadcrumbList. All `@id`s on the canonical domain. |
| FAQPage ↔ visible content | AEO | PASS | All 5 JSON-LD questions AND answers present in the script-stripped visible HTML; 5× native `<details>`/`<summary>` accordion — server-rendered, works without JS. Never-fabricate rule satisfied. |
| Direct answer in first 40–60 words | AEO | PASS | Definitional answer lands inside the first ~90 words of main content, under the definitional H2. |
| llms.txt canonical facts | GEO | PASS | "Founded 1989 by K. V. Ramesh and Gita Ramesh; the family has practised Ayurveda since 1908" (correct split), `info@kairali.com`, `WhatsApp +91 92898 38797`, WHO-GMP, KTAHV NABH Palakkad, explicit "No outlet counts, locations, or commercial terms" line, 3 cross-site links matching the page footer. |
| Locked contact facts (all pages) | GEO | PASS | `info@kairali.com` ×4 + mailto; `+91 92898 38797` visible; `wa.me/919289838797` sole WhatsApp link. **`38777` absent from every fetched body** (byte-level grep on all 7 routes). |
| Rolling numbers | GEO | PASS | "118 years" and "37 years" render consistent with 2026−1908 / 2026−1989 (computed, matches locked facts). |
| 14 legacy .aspx redirects | SEO | PASS | 14/14 respond **308 single-hop** on the live preview: 13 → `/`, `pirvacy-policy.aspx` → `/privacy`. |
| Compliance: cure claims / banned filler | SEO | PASS | Zero hits across all 4 pages for cure/cures/side-effects and the full group banned-filler list. |
| MUST-NOT (D-SEO-DUAL) | SEO | PASS | "franchise" appears only in FAQ1 declining to be a franchise-fee page; no fees, ₹ figures, outlet counts, or locations anywhere. |
| Alt text / images | SEO | PASS | Sole `<img>` (`/images/kairali-icon.svg`, 200) is decorative with `alt=""` — correct pattern. |
| HTTPS posture | SEO | PASS | HTTP/2 200, HSTS `max-age=63072000; includeSubDomains; preload`; zero `http://` references in served HTML. |
| Preview headers | SEO | PASS (note) | No `X-Robots-Tag: noindex` on the preview host — technically crawlable pre-flip; canonical to `arogyashala.in` is the standard mitigation; flip supersedes. |
| Legal pages canonical | SEO | **WARN (persists)** | `/privacy`, `/terms`, `/cookie-policy` all emit `canonical → https://arogyashala.in` (homepage) while `noindex, follow` — contradictory signalling, noindex-muted. Fix: self-canonical or drop the tag on noindexed routes. |
| Legal pages meta description | SEO | **WARN (persists, minor)** | All three reuse the homepage description verbatim. Noindex-mitigated. |
| Legal drafts / no effective date | GEO | **WARN (pre-flip blocker, tracked)** | All three still show "Draft — pending legal review." dated 14 July 2026. Correct honesty pre-flip; must be cleared and dated before DNS flip (already on the flip checklist per the 16-Jul report). |
| favicon.ico | SEO | Nit | `/favicon.ico` 404; head declares `/icon.svg` + `/icon.png` (both 200) — modern browsers satisfied; optional fallback for legacy UAs. |
| GSC / mobile report / field CWV / GBP match | SEO/GEO | N/A-until-flip | DNS not flipped; GSC property scheduled at flip per the brief. Not attempted. |
| Monthly AI-citation query test | GEO | N/A-until-flip | First run due within 30 days of flip — on the cutover checklist. |
| Shopify checks | SEO | N/A | Not a Shopify property. |

## D-SEO-DUAL scorecard (current)
- **DEFEND:** exact-brand title ✓ · **exact-brand H1 ✓ (was WARN)** · Organization/FAQ JSON-LD ✓ **(foundingDate now correct — was the FAIL)** · 14/14 domain-forward map ✓ · llms.txt ✓
- **ATTACK:** all four named trade-intent phrases now present ✓ **("become a Kairali retailer" ×2 — was WARN)** · AEO five-questions block ✓ · GEO plain-facts llms.txt ✓
- **MUST-NOT:** fully honoured ✓

## Overall verdict line
**PASS WITH WARNINGS** — the 16-Jul locked-fact FAIL (foundingDate 1908) is verified FIXED in the live rendered JSON-LD, and all three actionable WARNs from that audit are verified closed on the deployment. Remaining warnings: legal-page canonicals + duplicated legal meta descriptions (both noindex-muted build nits), and the legal pages remain "Draft — pending legal review" (deliberate pre-flip state; must clear before DNS flip). Nothing blocks adding this build to the go-live pool at the SEO/AEO/GEO gate.

Logger contract line:
`2026-07-18 16:17:57 IST | sub-agent=seo-aeo-geo-auditor | page=arogyashala.in live preview (7 routes + 14 redirects + OG/icon assets) | issues: 0 FAIL, 3 WARN (legal canonicals, legal meta-description reuse, legal drafts pre-flip) + 1 nit (favicon.ico 404) | prior FAIL D-1908 verified fixed live | tools: curl + node parse + sips + read-only repo grep`
