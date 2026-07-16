# arogyashala.in — SEO / AEO / GEO audit

- **Timestamp:** 2026-07-16 20:33:00 IST
- **Sub-agent:** seo-aeo-geo-auditor
- **Page(s) audited:** static production build at `http://localhost:4315` — `/`, `/privacy`, `/terms`, `/cookie-policy`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, plus all 14 legacy `.aspx` redirects
- **Tools used:** curl (static build — exact crawler view; Firecrawl/browser MCPs unavailable this session), node --test (guards), repo grep vs ruled facts. Shopify checks N/A (not a Shopify property). GSC / live AI-query checks N/A-until-flip (DNS not flipped; GSC property is scheduled at flip per the brief and BACKLOG cutover pattern).
- **Intent audited against:** D-SEO-DUAL in `docs/site-briefs/arogyashala-build-2026-07-16.md` (DEFEND branded queries / ATTACK trade-intent queries / MUST-NOT commercial-franchise queries)

## Verdict: **FAIL** — one locked-fact violation in shipped structured data (fleet-wide source); everything else PASS or warning-level

---

## Findings table

| Check | Pillar | Status | Fix Needed |
|---|---|---|---|
| Organization JSON-LD founding claim | GEO | **FAIL** | `foundingDate: "1908"` is emitted on the node `"name": "Kairali Ayurvedic Group"`. schema.org `foundingDate` = "the date that this organization was founded" — this is the machine-readable form of "Kairali Ayurvedic Group — Since 1908", ruled ❌ by PR #65 (merged 16 Jul 13:06 IST: 1908 = family lineage only; the Group was founded **1989**). It also contradicts this site's own `/llms.txt` ("founded 1989 … practised Ayurveda since 1908" — which is CORRECT), so the two GEO surfaces disagree with each other. Source: `packages/schema/src/index.js:71` (`kairaliOrganization()`), asserted by `packages/schema/test/schema.test.js:23`. Fix: `foundingDate: "1989"`; carry the lineage in copy/description per the ruling's licensed phrasing ("a family practising Ayurveda since 1908"), and update the test to assert 1989 (correcting the test's target value is not weakening the check — the check's intent is "locked facts prefilled", and the locked fact is 1989 for the Group). **Fleet blast radius: every factory site calling `kairaliOrganization()` publishes the same wrong claim — fix once in the package, re-audit all consumers.** |
| Guards blind spot that let the above ship | GEO | **WARN** | `sites/arogyashala.in/test/guards.test.js` has a dedicated "1908 must never attach to the Group" guard — but it scans only `app/page.tsx`, so JSON-LD composed in `packages/schema` escaped it and the gate ran green. Strengthen: guard the rendered HTML (or the schema package's own test) so the machine-readable layer is inside the fence. Never weaken; extend scope. |
| Exact-brand H1 (D-SEO-DUAL DEFEND spec) | SEO | **WARN** | Brief names "this page's exact-brand title/H1" as a defence leg. Title carries "Arogya Shala" ✓; H1 is "The Kairali counter for your neighbourhood." — no "Arogya Shala". Mitigation exists (overline `Arogya Shala · A Kairali Retail Programme` directly above the H1, brand in two H2s, WebSite/FAQ schema, og:title), but the documented defend intent asks for it in the H1 itself. Human call: tweak H1 (e.g. "The Arogya Shala counter…") or record the overline as the accepted defence. |
| og:image / twitter:image | SEO | **WARN** | Absent (`twitter:card` = summary, no image). Shares to WhatsApp — the exact channel this trade audience lives in — render without a card image. Add a 1200×630 `opengraph-image` (kairali.com precedent: real OG image shipped at build). |
| Legal pages canonical | SEO | **WARN** | `/privacy`, `/terms`, `/cookie-policy` all emit `rel=canonical → https://arogyashala.in` (the homepage) — inherited layout metadata, not self-referential. `noindex, follow` on all three mutes the impact, but a page canonicalising to a different URL while noindexed is contradictory signalling. Fix: per-page self canonical or drop the tag on noindexed routes. Same pages also reuse the homepage meta description verbatim (minor, noindex-mitigated). |
| ATTACK keyword coverage | SEO | **WARN** | 3 of 4 named attack phrases naturally covered ("ayurvedic retail counter" family: retail counter ×4, chemist ×9, tier-2/tier-3 ×2 each, shop ×15; "kairali products for my shop" ≈ owners-door copy; "ayurvedic products for chemist shop" ≈ FAQ2+FAQ3). **"become a kairali retailer" / "retailer": 0 occurrences.** One natural placement (owners door or FAQ2 answer) closes the set. |
| Legal pages "Draft — pending legal review", no visible Last-updated date | GEO | **WARN (pre-flip blocker)** | All three legal pages self-describe as draft and defer their effective date to go-live. Correct honesty pre-flip; must be cleared and dated before DNS flip. Tracked here so the flip checklist catches it. |
| Title tag | SEO | PASS | "Arogya Shala — Kairali Branding for Ayurvedic Counters" — 54 chars (≤60), exact brand + attack keyword, unique. |
| Meta description | SEO | PASS | 146 chars (≤155), keyword-relevant, no filler, no claims. |
| Single H1 / heading hierarchy | SEO | PASS | Exactly one H1; order H1→H2→H3→H2→H2, no skipped levels. |
| Canonical (homepage) | SEO | PASS | `https://arogyashala.in`, matches og:url. Nit only: sitemap uses trailing-slash `…in/` — identical for a root URL, no action needed. |
| 14 legacy .aspx redirects | SEO | PASS | 14/14 respond **308 single-hop** to mapped targets: 13 → `/`, `pirvacy-policy.aspx` (sic) → `/privacy`; both targets 200. Matches the protection map verbatim. `guards.test.js` asserts map coverage (6/6 tests green, re-run this session). |
| robots.txt | GEO | PASS | `User-Agent: * / Allow: /` + sitemap pointer — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended all unblocked. |
| XML sitemap | SEO | PASS | Present, homepage-only with current lastmod — consistent with the three legal routes being noindexed. |
| llms.txt | GEO | PASS | Present at root, current, and **every fact matches the ruled facts** (`wiki/entities/arogya-brands.md`, PR #65, PROJECT_CONTEXT §3): programme definition verbatim-close to the wiki, WHO-GMP, **founded 1989 / family practice since 1908 (correct split)**, KTAHV NABH Palakkad, locked contacts, explicit "no outlet counts, locations, or commercial terms" line. |
| FAQPage JSON-LD ↔ visible accordion | AEO | PASS | Single valid JSON-LD `@graph` (Organization, WebSite, FAQPage, BreadcrumbList — parses clean). FAQPage's 5 Q&A match the visible `<details>/<summary>` accordion **word-for-word** (verified pairwise). Accordion is native HTML — answers work with JS disabled. |
| Direct answer in first 40–60 words | AEO | PASS | "Arogya Shala is Kairali's retail-branding programme for chemists and retail outlets in tier-2 and tier-3 cities." lands within the first ~50 words of `<main>`, directly under the definitional H2. Quotable as-is. |
| Question-formatted headers + cluster coverage | AEO | PASS | H2 "What an Arogya Shala counter is", H2 "Saw an Arogya Shala board? Check it in one message.", 5 question-formatted FAQ summaries = the brief's "five realistic first questions" (fee? eligibility? supply? verification? treatment?). |
| Server-rendered, no JS-only content | AEO/GEO | PASS | Static export; all copy, FAQ and schema present in raw HTML via curl. |
| Cure claims / DMR-ASCI | SEO (compliance) | PASS | Zero occurrences of cure/side-effects/relieve-disease language (legacy claims confirmed dropped). FAQ5 explicitly routes treatment to physicians — the physician-implication guard also passes. |
| Banned filler (group list) | SEO (compliance) | PASS | 0 hits across all four pages (bespoke/curated/discerning/unparalleled/nestled/indulge/pamper/exquisite/world-class/unique). |
| Locked contact facts | GEO | PASS | `info@kairali.com` everywhere; WhatsApp `+91 92898 38797` (wa.me/919289838797 ×3); **no …38777 anywhere**. |
| Rolling numbers computed, never typed | GEO | PASS | "118 years" is `new Date().getFullYear() − 1908` at build (visible as interpolation in served HTML); group years likewise computed from 1989. Complies with the 16 Jul computed-value rule. |
| Internal linking / anchors | SEO | PASS | Two-door anchor nav (#owners/#verify), descriptive anchors on cross-links to kairali.com, kairaliproducts.in, ayurvedichealingvillage.com (mirrors llms.txt's site list); legal footer links resolve 200. |
| Alt text / image accessibility | SEO | PASS | Sole `<img>` is the decorative wordmark icon: `alt="" aria-hidden` inside a link carrying `aria-label="Arogya Shala — home"` — correct pattern. Width/height set (no CLS). |
| HTTPS / mixed content | SEO | PASS (posture) | Zero `http://` references in served HTML. HTTPS enforcement itself N/A-until-flip (Vercel/DNS). |
| Mobile usability | SEO | PASS (static checks) | Viewport meta present, no fixed-width layout in served markup. GSC mobile report N/A-until-flip. |
| Core Web Vitals | SEO | PASS (lab posture) | Text-first hero (LCP = server-rendered H1), dimensions on the only image (CLS ≈ 0), no client data fetching. JS payload is stock Next.js runtime (~466 KB raw / ~140 KB gz incl. 112 KB polyfills chunk) — fine for the ship-gate Lighthouse ≥90 already required. Field INP/LCP/CLS N/A-until-flip. |
| E-E-A-T / entity consistency | GEO | PASS (with the FAIL above noted) | Entity identity (programme, group, hospital, contacts) consistent across page ↔ llms.txt ↔ wiki ruled facts — **except** the schema foundingDate (the FAIL). No GBP exists for Arogya Shala → GBP-match N/A. Content freshness: built today. |
| MUST-NOT (D-SEO-DUAL ROI protection) | SEO | PASS | No franchise-commercial keywords ("franchise fee/cost", "investment", ₹/lakh/crore all absent — guard-asserted); no outlet counts or locations anywhere; FAQ1 explicitly declines to be a franchise-fee page. ayurvedafranchise.com's lane untouched. |
| Monthly AI-citation query test (10 queries) | GEO | N/A-until-flip | Site not publicly served; first run due within 30 days of DNS flip — add to the cutover checklist alongside the GSC property. |

## D-SEO-DUAL intent scorecard
- **DEFEND:** domain-forward map ✓ (14/14, single-hop) · exact-brand title ✓ · exact-brand H1 **partial (WARN)** · Organization/FAQ JSON-LD ✓ (content) / **✗ foundingDate (FAIL)** · llms.txt ✓
- **ATTACK:** trade-intent phrases in title/meta/H2/FAQ ✓ except "become a Kairali retailer" (WARN) · AEO five-questions block ✓ · GEO plain-facts llms.txt ✓
- **MUST-NOT:** fully honoured ✓

## Logger contract line
`2026-07-16 20:33:00 IST | sub-agent=seo-aeo-geo-auditor | page=arogyashala.in full build (7 routes + 14 redirects, localhost:4315 static prod) | issues: 1 FAIL (packages/schema kairaliOrganization foundingDate=1908 vs PR #65 Group=1989 — fleet-wide), 6 WARN (guards scope, H1 brand term, og:image, legal canonicals, "retailer" keyword, legal drafts pre-flip) | tools: curl + node --test + repo grep (Firecrawl N/A this session)`
