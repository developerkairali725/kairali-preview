# Keyword map — arogyashala.in (Ship Gate B1 evidence)

- Produced: **2026-07-18 16:53:07 IST**
- Gate: `keyword-map` — "Keyword map per page" (gates/registry.yaml, severity high, run: agent; applicability `organic: required` — this site's class)
- Procedure source: **SITE_LAUNCH_CHECKLIST_v1.0.md §B item 1 (B1)** — "Keyword map: Semrush MCP + GSC (+DataForSEO fallback) → keywords per page written into frontmatter; one-paragraph competitor snapshot for the niche. Evidence: the map file." Registry locates the evidence as "the map file in `launches/<domain>/`"; no filename is prescribed anywhere, so `keyword-map.md` is used (stated, not assumed silent).
- Closes: **docs/reports/2026-07-18-prompt4-single-pager-pilot.md gate row 24** — "GAP — no map file … the B1 evidence file was never produced."
- Operative keyword ruling: **D-SEO-DUAL** (DECISIONS.md, 2026-07-16 — DEFEND / ATTACK / MUST-NOT as two named, non-skippable steps per build), instantiated for this site in **docs/site-briefs/arogyashala-build-2026-07-16.md §D-SEO-DUAL**. This map invents no keyword the ruling and brief do not already carry.

---

## 0. Data provenance (HARD GATE 6 — read this first)

- **No Semrush, GSC, or DataForSEO pull exists for this domain.** The site brief records: "No GSC property exists; the site's search value is branded-query capture (register row 44)" — the GSC property is added **at DNS flip** (we control DNS then; logged in BACKLOG's cutover pattern). `docs/keywords/` carries no S3 artifact for this site, so the `s3-keyword-gates` registry gate stays honestly **un-armed**.
- **Therefore this map contains ZERO search-volume, ranking, difficulty, or traffic numbers.** Every keyword below is intent-derived from the owner-ruled D-SEO-DUAL lists, the mined legacy site (`content-mined/arogyashala.co.in/`), and the committed niche research — never from a metric this repo does not hold. "No data" and "no demand" are not the same thing (scripts/keyword-validate.mjs doctrine); this file claims neither.
- **Follow-up that would attach numbers:** a real S3 demand pull (Semrush MCP / DataForSEO, IN market) landing as `docs/keywords/` artifacts and passing `scripts/seed-lint.mjs` + `scripts/keyword-validate.mjs`. Post-flip, GSC impression data joins it (Day 7 keyword spot-check, checklist §D).

## 1. Site shape (what "per page" means here)

Four routes in `sites/arogyashala.in/app/` (build verified in the 18 Jul pilot report):

| Route | Robots | Ranking surface? |
|---|---|---|
| `/` | `index, follow` | **YES — the only one.** One-pager; sitemap.xml is homepage-only (seo-aeo-geo-report-2026-07-18.md PASS row). |
| `/privacy` | `noindex, follow` | No — legal boilerplate (draft pending legal review, pre-flip). |
| `/terms` | `noindex, follow` | No — same. |
| `/cookie-policy` | `noindex, follow` | No — same. |

Register row 44 (SITE_DESIGN_LOCALE_REGISTER.md): brand-protective single page, EN only, goal **"Indexed + branded query capture"**. Keyword targeting therefore concentrates on `/` by design — that is the strategy, not a gap.

## 2. Per-page map

### 2.1 `/` — homepage (the one indexable page)

**PRIMARY keywords — DEFEND (branded; what the domain already holds).** Source: brief §D-SEO-DUAL DEFEND — "branded queries only … (no GSC data available pre-flip; legacy titles are generic)".

| # | Keyword | Placement evidence (source + live verification) |
|---|---|---|
| P1 | `arogya shala` | Title tag "Arogya Shala — Kairali Branding for Ayurvedic Counters" (layout.tsx:18; 54 chars, live PASS) · H1 "Arogya Shala — the Kairali counter for your neighbourhood." (page.tsx:172; live H1 count = 1, exact-brand WARN closed 18 Jul) · Organization + WebSite JSON-LD (live: parses clean, `@id`s on canonical domain) · og/twitter cards. |
| P2 | `arogyashala` | The canonical domain itself (`arogyashala.in`) + wholesale legacy forward: 14/14 `.aspx` URLs 308 single-hop (live-verified 18 Jul) · llms.txt route. |
| P3 | `arogyashala kairali` | Title, H1 and footer combine both brand tokens; FAQPage JSON-LD answers carry "Kairali" throughout; llms.txt "Arogya Shala — a Kairali retail programme" (llms.txt/route.ts:9). |

**SECONDARY keywords — ATTACK (trade-intent; what the niche searches).** Source: brief §D-SEO-DUAL ATTACK — the four named phrases, "worked naturally into title/meta/H2/FAQ copy" (the brief itself prescribes natural working, not verbatim stuffing). The 18 Jul seo-aeo-geo audit verdict: "all four named trade-intent phrases now present ✓".

| # | Keyword | Form on page | Placement evidence |
|---|---|---|---|
| S1 | `become a kairali retailer` | **verbatim** | "the straightforward way to become a Kairali retailer" (page.tsx:204); live audit 18 Jul counted the phrase ×2 in served homepage HTML (closing its 16-Jul WARN). |
| S2 | `ayurvedic retail counter` | natural variant | Title "…Branding for Ayurvedic Counters" (layout.tsx:18) · door label "I run a chemist shop or retail counter" (page.tsx:186) · H2 "What an Arogya Shala counter is" (page.tsx:200) · hero sub "chemists and retail counters across India" (page.tsx:174–175). |
| S3 | `ayurvedic products for chemist shop` | natural variant | FAQ "Do I need to run a chemist shop?" + answer (page.tsx:36–37) · meta description "Kairali's retail programme for chemists and shop owners…" (layout.tsx:19–21) · FAQPage JSON-LD (5 Q&As, live-validated). |
| S4 | `kairali products for my shop` | natural variant | FAQ "Who supplies the products?" — "Your counter carries the genuine Kairali range, with product training and usage guidance for your staff" (page.tsx:40–41, the sourced staff-guidance promise from the mined legacy site) · meta description "…the WHO-GMP Kairali range, and product guidance for your counter". |

**AEO question set (answer-engine capture, rides the same page).** Source: brief ATTACK — "the FAQ block answers the five realistic first questions verbatim (FAQPage schema + visible accordion)". The five committed questions (page.tsx:30–50, all five live-verified present in BOTH JSON-LD and visible HTML, 18 Jul):
1. "Is this a franchise-fee page?" (deliberately captures-and-declines the franchise-cost query — see MUST-NOT)
2. "Do I need to run a chemist shop?"
3. "Who supplies the products?"
4. "How do customers know a counter is genuine?" (the verification/anti-fake query — brand-protective)
5. "Is medical treatment given at the counter?" (the compliance boundary, stated as an answer)

GEO: llms.txt states the programme + verification path in plain facts (route live 200, 18 Jul).

### 2.2 `/privacy`, `/terms`, `/cookie-policy` — no keyword targets, by design

`noindex, follow`; excluded from sitemap.xml; boilerplate legal from `@kairali/legal` with draft notice pending legal review. **Primary/secondary keywords: NONE — deliberate**, matching the filled pagewise checklist ("boilerplate noindexed legal pages, not ranking or converting surfaces"). Known noindex-muted WARNs on these routes (homepage-pointing canonicals, reused meta description) are already tracked in seo-aeo-geo-report-2026-07-18.md — not keyword items.

## 3. MUST-NOT — negative keyword lanes (ROI protection, verbatim from the brief)

These queries are **never targeted, and their vocabulary is kept off the page**:

- **Cure-claim queries** — no "cure", "treats disease", "no side effects" language (DMR/ASCI; the mined legacy site's cure-claims were deliberately NOT carried over). Live-verified: zero hits across all 4 pages (compliance row, 18 Jul).
- **Invented counts/locations/fees queries** — no "arogya shala near me"-style locator bait (legacy locator showed 0 outlets), no outlet-count or store-list content (HARD GATE 6 + brief).
- **Franchise-commercial keywords** — `franchise cost`, `investment`, fee/margin terms: "those queries belong to ayurvedafranchise.com's lane once its commercials are ruled" (brief). Live-verified 18 Jul: "franchise" appears only in FAQ1 declining to be a franchise-fee page; no fees, ₹ figures, outlet counts, or locations anywhere.

## 4. Competitor snapshot (the B1 one-paragraph, grounded in committed research only)

Per docs/design-research/arogyashala-2026-07-16.md (researched 2026-07-16 19:15–19:43 IST, pages fetched and read; qualitative, no rank data): the niche's high-ranking landers are Indian pharmacy/retail-franchise pages — Wellness Forever's franchise page (missed-call phone-first CTA, trust-stat counts, objection-killing FAQ), Dava India's franchise enquiry (certification badges as furniture), Zeno Health (tier-2/3 "quality medicines for every Indian" positioning), Patanjali Wellness franchise (anti-fraud notice; values-before-money copy order), and Sri Sri Tattva's partner page (bare-form cautionary tale), with Kama Ayurveda as the design-quality benchmark in the tradition. The competitive pattern is uniform: they lead with **"₹X lakhs investment" commercials and "2,000+ stores" count claims** — exactly the two lanes this site is barred from (franchise commercials gate + no invented counts), so arogyashala.in does not compete on those queries at all; it defends the branded query set, takes the trade-intent phrases the competitors' landers under-serve with honest programme copy, and converts on verification trust (authorised-counter check) instead of investment numbers.

## 5. Frontmatter status (the other half of B1's wording)

B1 expects "keywords per page written into frontmatter". Current state, recorded honestly: **no site in the fleet exports a `keywords[]` metadata field** (grep across `sites/*/app/page.tsx`, 18 Jul — zero hits; `packages/seo` buildMetadata carries title/description/OG, no keywords array), although the Factory metadata rule (CLAUDE.md FACTORY RULES) names `keywords[]` in the complete-metadata list. On this build the target terms are carried by title/H1/H2/FAQ/meta description/llms.txt as tabled above. Adding `keywords[]` to shipped page code is a site-code change with its own gates (and a fleet-consistency question) — **flagged as an open follow-up for the owner's lane, not silently patched in an evidence PR.**

## 6. Unverified — listed as such (rule f Checker discipline)

1. **All demand figures** — no search-volume, difficulty, or CPC number exists in this repo for any keyword above; none is stated. UNVERIFIABLE until the S3 pull runs.
2. **Current rankings** — no GSC property pre-flip; "what we already rank for" rests on the brief's branded-query reasoning (legacy titles generic, branded capture via domain + forward), not on impression data. Verifiable only post-flip.
3. **Competitor keyword data** — §4 is page-read qualitative evidence from the 16 Jul research session, not a keyword-gap or rank pull.
4. **"become a Kairali retailer" served count** — authored once in source (page.tsx:204); the 18 Jul live audit reported ×2 in served homepage HTML. Not re-counted in this session; the discrepancy is noted, not adjudicated.
5. **Post-flip behaviour** (indexing of the branded set, forward equity transfer) — Day 1/Day 7 checklist §D territory, unknowable pre-flip.
