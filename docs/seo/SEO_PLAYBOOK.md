# SEO + AEO/GEO PLAYBOOK — Kairali Web Factory
**Compiled 2026-07-14 IST · Maintained via LEARNINGS.md-driven PRs only (same rule as the Ship Gate).**
**Every external claim below is link-cited. "Mechanized" column maps each item to our gates: Ship Gate A/B/D items (SITE_LAUNCH_CHECKLIST_v1.0.md), factory spec tests (tests/factory/factory-site.spec.ts), packages/seo behaviour (packages/seo/README.md), and ENGINEERING_STANDARDS.md. Items with no covering gate are collected in §5 GAPS.**

Legend: ✅ = mechanically enforced (CI/spec/build-time throw) · 🟡 = partially covered or agent-run-with-evidence (B-items) · ❌ = no current gate (see GAPS).

---

## 1 · TOP-5 SEO CHECKLIST (highest-leverage items)

| # | Item | Source | Already mechanized here |
|---|---|---|---|
| 1 | **Server-render everything.** Every indexable page ships content + real `<a href>` links in the initial HTML. No fragment (`#/`) routing, no onclick-only links, no critical content that exists only after client JS. | [Google — JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | ✅ ENGINEERING_STANDARDS "Rendering": static generation is the default; `"use client"` requires a justification comment. 🟡 No lint that *rejects* client-only content — convention, not a gate. |
| 2 | **Core Web Vitals green at p75 mobile:** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. INP replaced FID in 2024 — test INP, not FID. | [web.dev — Web Vitals](https://web.dev/articles/vitals) | 🟡 A5 — Lighthouse Performance ≥90 on home + content template + LP (lab data); ENGINEERING_STANDARDS first-load JS ≤130 KB; D7 "CWV field sample". ❌ No INP-specific gate; no field-data (CrUX) threshold gate. |
| 3 | **Canonical hygiene:** one URL per content — 301 the domain to a single scheme/host, absolute self-referential `rel=canonical` on every indexable page, never conflicting/relative canonicals, internal links only to canonical URLs. | [Google — Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | ✅ A6 + factory spec "A6: title/description/canonical present" (canonical must exist and contain the site domain). 🟡 B11 redirects forward-family domain variants at Cloudflare. ❌ No check that internal links target canonical URLs or that exactly one host variant resolves. |
| 4 | **Unique, descriptive `<title>` per page** (front-load the topic, avoid truncation) + unique meta description; no boilerplate repeated across pages — Google rewrites titles it deems boilerplate/half-empty. | [Google — Title links](https://developers.google.com/search/docs/appearance/title-link) | ✅ A6 — `buildMetadata` THROWS at build time on title >60ch, description >155ch, or missing description (packages/seo README: "merge-blocking, not advisory"); factory spec re-verifies in the rendered page. ❌ No cross-page *uniqueness* check. |
| 5 | **One primary keyword per page, intent-matched, with contextual internal links (descriptive anchors) from existing relevant pages at publish — no orphan pages.** | [Ahrefs — SEO Checklist](https://ahrefs.com/blog/seo-checklist/) | 🟡 B1 — keyword map (Semrush MCP + GSC) written into MDX frontmatter (`keywords[]` is required frontmatter per Factory Rules); A11 crawls internal links for 4xx/5xx. ❌ No orphan-page detection, no anchor-text quality check, no intent-match verification. |

---

## 2 · FULL TECHNICAL / ON-PAGE CHECKLIST

### 2.1 Crawlability & indexation

| Item | Source | Mechanized |
|---|---|---|
| robots.txt = crawl management ONLY, never index exclusion (disallowed URLs can still be indexed if linked). Use meta `noindex` for exclusion; never disallow+noindex on the same URL (Google can't see the noindex it can't crawl). Watch for staging robots.txt carried to production. | [Google — robots.txt intro](https://developers.google.com/search/docs/crawling-indexing/robots/intro) | 🟡 A6 "robots.txt sane" + `buildRobots` in packages/seo. ❌ No explicit disallow-vs-noindex conflict check, no staging-block-leak check. |
| Never ship `noindex` in initial HTML and remove it with JS — Google may skip rendering entirely. | [Google — JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | 🟡 Mitigated by static generation default (ENGINEERING_STANDARDS) and `buildMetadata` owning robots meta; `/lp/*` is noindex-by-default *by design* (packages/seo). ❌ No test that indexable templates carry no stray noindex in raw HTML. |
| Real HTTP status codes: hard 404s (no soft-404 "200 with error text"), 301 for moves, no redirect chains on internal links. | [Google — JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | 🟡 A11 — internal link crawl zero 4xx/5xx + 301 map from legacy inventory spot-checked (10 random old URLs). ❌ No soft-404 detection, no redirect-chain detection. |
| Day-one GSC + Bing Webmaster setup: verify property, submit sitemap, monitor Page Indexing through launch weeks; confirm key templates indexable before DNS flip. | [Ahrefs — SEO Checklist](https://ahrefs.com/blog/seo-checklist/) | ✅ B7 — GSC domain property verified via Cloudflare DNS + sitemap submitted; Bing Webmaster verified + sitemap submitted. D1 — pages-indexed check, GSC coverage errors = 0. |

### 2.2 Sitemaps

| Item | Source | Mechanized |
|---|---|---|
| XML sitemap: only canonical, indexable, 200-status absolute URLs; ≤50,000 URLs / 50MB per file with a sitemap index above splits; referenced in robots.txt AND submitted in GSC. | [Google — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | ✅ A6 — `buildSitemap` generates sitemap.xml; B7 submits it. 🟡 No independent check that every sitemap URL is canonical + 200 + indexable. |
| `<lastmod>` only when truthful and reflecting significant content changes — a build-time timestamp on every URL every deploy trains Google to ignore it. | [Google — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | ❌ No gate on lastmod truthfulness (see GAPS). |

### 2.3 hreflang (EN/DE/FR — load-bearing for KTAHV three-locale rule)

| Item | Source | Mechanized |
|---|---|---|
| One method only (HTML link tags / header / sitemap); every locale version lists itself + all siblings bidirectionally. Missing return links = whole cluster ignored. | [Google — Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) | ✅ A7 — factory spec fetches every alternate URL and asserts the SAME cluster appears on each (reciprocity verified by HTTP fetch, not trust); packages/seo delegates hreflang to @kairali/i18n, "reciprocal by construction". |
| Valid ISO 639-1 (+ ISO 3166-1 alpha-2) codes — 'en', 'de', 'fr', 'en-IN'; invalid codes ('UK', 'EU') fail silently. Add `x-default` pointing at the fallback page. | [Google — Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) | ✅ A7 — factory spec asserts hreflang present for every declared locale AND `x-default`. Locale codes come from `site.config.json.locales`. 🟡 No ISO-validity lint on the config values themselves. |

### 2.4 Structured data

| Item | Source | Mechanized |
|---|---|---|
| JSON-LD (Google's preferred format), describing ONLY visible page content, on crawlable/indexable pages, all required properties per type filled, recommended properties where real data exists. Never invent values (CLAUDE.md rule 6). | [Google — Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) | ✅ A8 — JSON-LD parses + validates per template (Organization + MedicalClinic/LocalBusiness/Product/Article, BreadcrumbList, FAQPage, Person); factory spec asserts JSON.parse succeeds and an Organization node exists. 🟡 Per-type required-property completeness relies on A8 CI validation, not the spec. |

### 2.5 Core Web Vitals build discipline

| Item | Source | Mechanized |
|---|---|---|
| LCP recipe per template: LCP image in initial HTML (not JS-injected), `fetchpriority="high"`, NEVER `loading="lazy"` on the LCP element, preload if CSS-only referenced, minimize TTFB (edge caching, zero redirects). | [web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp) | 🟡 ENGINEERING_STANDARDS — `next/image` with `priority` on hero, everything else lazy; A5 poster-first LCP for hero video; immutable caching for hashed assets. ❌ No lint asserting the hero actually has `priority`/`fetchpriority` and isn't lazy. |
| CLS discipline: explicit width/height (or aspect-ratio) on every image/video/embed; reserved space for late-loading UI (consent banner, font swaps); p75 CLS ≤ 0.1. | [web.dev — Web Vitals](https://web.dev/articles/vitals) | ✅ ENGINEERING_STANDARDS — `next/image` only with explicit width/height ("no CLS"); `next/font` with `display: swap`. 🟡 Consent-banner space reservation not explicitly gated; B14 mobile walkthrough checks floating-UI collisions visually. |

### 2.6 Image SEO

| Item | Source | Mechanized |
|---|---|---|
| Real `<img>` elements (CSS backgrounds are not indexed), descriptive filenames (`kairali-panchakarma-treatment.jpg`, not `IMG_2041.jpg`), contextual alt text, srcset/picture + src fallback, WebP/AVIF. | [Google — Google Images SEO](https://developers.google.com/search/docs/appearance/google-images) | ✅ A10 — every image has alt text; ENGINEERING_STANDARDS — `next/image` only (emits srcset + AVIF/WebP). ❌ No descriptive-filename lint. |
| Image sitemap (supports CDN-hosted off-origin images) + representative image via `og:image` / schema `primaryImageOfPage` — relevant since Kairali media is hosted off-origin. | [Google — Google Images SEO](https://developers.google.com/search/docs/appearance/google-images) | 🟡 A9 — OG cards render-validated per page type (1200×630); packages/seo: OG images never fabricated, omit until a real asset exists. ❌ No image sitemap generated. |

### 2.7 On-page & technical

| Item | Source | Mechanized |
|---|---|---|
| Descriptive short slugs, grouped in topical directories (`/treatments/panchakarma/`) — SERP breadcrumbs + per-section crawl-frequency learning. Cheap at launch, expensive to change. | [Google — SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) | 🟡 Convention (MDX file routing + B11 semantic redirect map). ❌ No slug-quality lint. |
| One H1 per page, logical H2/H3 hierarchy matching the title's promise — competing top-level headings trigger title-link rewrites. | [Google — Title links](https://developers.google.com/search/docs/appearance/title-link) | ❌ No heading-hierarchy gate (see GAPS). 🟡 A5 Lighthouse Accessibility ≥95 catches some heading misuse. |
| HTTPS everywhere, zero mixed content, exactly one protocol+host live with all others 301ing to it. | [Ahrefs — SEO Checklist](https://ahrefs.com/blog/seo-checklist/) | ✅ A2 + factory spec "no mixed content" test (every subresource https, page-origin-aware). 🟡 B11 forward-family redirects. ❌ Single-host-variant resolution not asserted. |

---

## 3 · AEO / GEO (answer-engine & generative-engine optimization)

### 3.1 What Google says officially (the anti-busywork layer)

| Item | Source | Mechanized |
|---|---|---|
| **No special files/markup exist for AI Overviews/AI Mode.** A page needs only to be indexed + snippet-eligible. Google Search explicitly ignores llms.txt and "AI text files". The packages/seo baseline IS the AEO lever. | [Google — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) | ✅ Covered by executing §1–§2 above (A5/A6/A7/A8). Note: we still *generate* llms.txt (A6, packages/seo) — cheap, but do not invest content effort in it (see next row). |
| llms.txt is a dead letter: 97% of published llms.txt files got ZERO requests (137K-domain log study); no major AI platform committed to reading it. At most auto-generate and version-control it. | [Ahrefs — llms.txt study](https://ahrefs.com/blog/llmstxt-study/) · [Mueller/Illyes via SEJ](https://www.searchenginejournal.com/97-of-llms-txt-files-got-no-requests-ahrefs-data-shows/579478/) | ✅ Exactly our posture: `buildLlmsTxt` auto-generates (A6); B2 populates canonical facts. Policy: never prioritize llms.txt work over indexable-page work. |
| Google's snippet controls (`nosnippet`, `data-nosnippet`, `max-snippet`, `noindex`) directly govern AI Overviews/AI Mode eligibility; Google-Extended separately limits Gemini training/grounding. A legacy `max-snippet` on treatment pages silently kills AI citation. | [Google — AI features](https://developers.google.com/search/docs/appearance/ai-features) | ❌ No audit that templates ship no restrictive snippet directives (see GAPS). Meta emission is centralized in `buildMetadata`, which limits the blast radius. |
| Don't fragment content into AI-sized chunks; don't rewrite "for AI" with synonym stuffing or separate AI variants; don't pursue inauthentic mention schemes — Google's own anti-pattern list. | [Google — AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | ✅ Policy alignment: compliance lint (A3) bans filler; no AI-variant pages exist in the factory. |
| AI Mode "query fan-out": multiple background sub-queries, wider citation set. Cover specific subtopics on dedicated well-structured pages (e.g., "Panchakarma duration", "pre-admission preparation") so each page matches a fan-out sub-query. | [Google — AI features](https://developers.google.com/search/docs/appearance/ai-features) | 🟡 B1 keyword map drives page-per-topic IA; not enforced as a structural rule. |
| Non-commodity content with a unique POV, high-quality images + video alongside text (AI is multimodal), good page experience, Business Profiles feeding structured business data into AI answers. | [Google — Succeeding in AI search (May 2025)](https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search) | 🟡 B14 criterion 2 "human-made feel, zero filler" (manual gate); Kairali original photography per ENGINEERING_STANDARDS placeholder-first workflow. ❌ Business Profile linkage not on the checklist. |
| Measurement is first-party: AI Overviews/AI Mode impressions surface in GSC Performance reporting — segment AI-surface impressions per site in the weekly QA audit rather than third-party AI trackers alone. | [Google — AI features](https://developers.google.com/search/docs/appearance/ai-features) | ❌ Weekly QA audit rotation does not yet segment AI-surface impressions (see GAPS). |

### 3.2 What the citation studies say (the do-this layer)

| Item | Source | Mechanized |
|---|---|---|
| Strongest AI-citation separators (Semrush, thousands of citations): answer-first clarity +32.8%, E-E-A-T signals +30.6%, Q&A formatting +25.5%, section structure +22.9%. Open every treatment/programme/FAQ page with a structured summary; physician author credentials; Q&A sections with headings/lists/tables. | [Semrush — AI search content study](https://www.semrush.com/blog/content-optimization-ai-search-study/) | 🟡 B2 — Q&A structuring on money pages + entity clarity block; A8 — FAQPage + Person schema where Q&A/bylines exist. ❌ No content lint enforcing answer-first summaries. |
| Answer-first passage pattern: 30–60-word direct answer immediately below each question-phrased H2, then bullets/visuals/internal links; one idea per paragraph (AI retrieval is passage-level). | [Backlinko — AEO](https://backlinko.com/answer-engine-optimization-aeo) | ❌ Not lint-enforced (see GAPS); the editorial rule for FAQ/consultation/how-to-reach pages. |
| Promotional tone HURTS citation (−26.2% separator). KTAHV's clinical register is an AEO asset — extend the restrained factual tone to Villa Raag/KAPPL informational content too. | [Semrush — AI search content study](https://www.semrush.com/blog/content-optimization-ai-search-study/) | ✅ For KTAHV: A3 compliance lint enforces the clinical register incl. DE/FR. 🟡 For Raag/KAPPL informational pages: register allows hospitality/product language — restraint is editorial policy, not a gate. |
| Unlinked brand mentions correlate with AI visibility at 0.664 vs backlinks 0.218 (~3×, 75K brands); YouTube mentions strongest single correlate (0.737); ~82% of citations are earned media. KPI shift: earn brand mentions (press, YouTube, directories, wellness publications), not links. | [Ahrefs — AI brand visibility correlations](https://ahrefs.com/blog/ai-brand-visibility-correlations/) | ❌ Off-site; no factory mechanism. B12 (social/press/author links) is adjacent but not a mention-earning programme. |
| Classic rankings remain the base layer: page-1 Google rankings correlate ~0.65 with LLM brand mentions; backlinks 0.10, domain rank 0.25. GEO sits ON TOP of SEO, it doesn't replace it. | [Seer Interactive — brand mentions in AI answers](https://www.seerinteractive.com/insights/what-drives-brand-mentions-in-ai-answers) | ✅ By construction — the entire §1–§2 gate stack is the base layer. |
| Freshness matters: AI-cited content ~25.7% fresher than organic results; 76.4% of ChatGPT's most-cited pages updated within 30 days (17M citations). Schedule meaningful refreshes of money pages (stats, dates, dateModified). | [Ahrefs — AI assistants cite fresh content](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) | ❌ No content-refresh rota (see GAPS). The weekly wiki lint covers wiki/, not site money pages. |
| Freshness nuance: median AI Overview citation ~14 months old; authority/structure/named sources outweigh raw dates. Refresh meaningfully — never fake-bump dates (engines and Google discount it). | [Digital Applied — 1,000 AI Overviews study](https://www.digitalapplied.com/blog/we-analyzed-1000-ai-overviews-citation-pattern-study) | ✅ Policy alignment: truthful-lastmod rule (§2.2) and rule 6 (never invent facts) forbid date-bumping anyway. |
| In-content GEO tactics (Princeton lineage): statistics (~+41%, strongest), expert quotations, source citations boost generative visibility 30–40%. For KTAHV: cite clinical outcomes, NABH accreditation facts, physician quotes with attribution. | [Semrush — GEO practical guide](https://www.semrush.com/blog/generative-engine-optimization/) | 🟡 Facts must come from locked sources (CLAUDE.md rule 6); Person schema (A8) carries bylines. ❌ No check that money pages contain statistics/quotes/citations. |
| Schema is NOT a proven AI-citation lever (no correlation found across OpenAI/Gemini/Perplexity; the Princeton GEO study never tested it). Keep schema for rich results + entity disambiguation — don't sell it internally as GEO. | [SEJ — Schema, LLMs & the low bar for evidence](https://www.searchenginejournal.com/schema-llms-the-low-bar-for-evidence-in-geo/576090/) | ✅ Our A8 rationale is already rich-results + entity clarity, not GEO magic. |
| Entity clarity IS the durable schema play: Organization/MedicalOrganization node with stable `@id`, `sameAs` to Wikipedia/Wikidata/official profiles, `mainEntityOfPage` on key pages — three similarly-named Kairali entities (KTAHV/Villa Raag/KAPPL/group) are a textbook disambiguation risk. | [Search Engine Land — entity authority](https://searchengineland.com/entity-authority-ai-search-visibility-471619) | 🟡 A8 asserts an Organization node exists; B2 adds the entity clarity block. ❌ No gate on stable `@id` + `sameAs` completeness (see GAPS). |
| AI crawler policy is per-purpose: training bots (GPTBot, ClaudeBot, Google-Extended) are independent of search/citation agents (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot). ALLOW the search/user agents (citations + referrals); decide training separately; audit robots.txt for accidental blanket AI blocks. | [OpenAI — crawler overview](https://developers.openai.com/api/docs/bots) | 🟡 A6 generates "AI-crawler files" via `buildRobots`; no explicit assertion that search/citation agents are allowed (see GAPS). |
| robots.txt is not a defense: Perplexity documented using stealth undeclared crawlers (spoofed UAs, rotating ASNs) to evade no-crawl directives. Genuine restriction (e.g., patient materials) must be enforced at WAF/CDN (Cloudflare bot management), never robots.txt alone. | [Cloudflare — Perplexity stealth crawlers](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) | ❌ No WAF-level policy defined (only relevant if we ever host restricted content). |
| Platform presence: YouTube is the #2 most-cited domain in AI Overviews; Reddit appears in ~77% of product-review AI searches. Kairali's 355-video YouTube library is an existing citation asset — align titles/descriptions with answerable questions. | [Ahrefs — GEO strategies](https://ahrefs.com/blog/geo-generative-engine-optimization/) | ❌ Off-site; VIDEO_CATALOG exists in-repo (enriched 2026-07) but no title/description optimization pass is gated. |

---

## 4 · GATE CROSS-REFERENCE (quick lookup)

| Gate | What it mechanizes from this playbook |
|---|---|
| **A1** build clean, zero console errors | JS health baseline for renderability |
| **A2 / factory spec** | Locked facts · forms+consent · **no mixed content** (§2.7) |
| **A5** Lighthouse ≥90 perf / 100 SEO / ≥95 a11y | CWV lab proxy (§1.2), poster-first LCP for video, heading/a11y partials |
| **A6 / packages/seo** | `buildMetadata` **throws** on title >60ch / desc >155ch / missing desc; canonical; `buildRobots`; `buildSitemap`; `buildLlmsTxt` + AI-crawler files; `/lp/*` noindex default |
| **A7 / factory spec** | hreflang complete + reciprocal (verified by fetching every alternate) + x-default + locale switcher |
| **A8 / factory spec** | JSON-LD parses; Organization node present; per-template type validation in CI |
| **A9** | OG/Twitter cards render-validated, 1200×630 |
| **A10** | Alt text on every image; favicons |
| **A11** | Internal-link crawl zero 4xx/5xx; legacy 301 map spot-checked |
| **B1** | Keyword map → frontmatter keywords[] |
| **B2** | GEO/AI-readiness: entity clarity block, Q&A structuring, llms.txt facts |
| **B7** | GSC + Bing verification + sitemap submission |
| **D1 / D7** | Indexation check, GSC coverage = 0 errors, CWV field sample, broken-link recrawl |
| **ENGINEERING_STANDARDS** | SSG default · next/image (dims, AVIF/WebP, hero `priority`) · next/font swap · ≤130 KB JS · immutable caching |

---

## 5 · GAPS — no current gate covers these (candidates for the next mechanization pass)

1. **INP gate.** Lighthouse (A5) is lab-only; INP needs field/interaction measurement. Candidate: INP assertion in the factory spec via Playwright interaction traces, + D7 field-data threshold (LCP ≤2.5s / INP ≤200ms / CLS ≤0.1 at p75) once CrUX data exists. ([web.dev](https://web.dev/articles/vitals))
2. **Cross-page title/description uniqueness.** A6 gates length/presence per page only. Candidate: build-time duplicate-title/description detector. ([Google](https://developers.google.com/search/docs/appearance/title-link))
3. **Hero/LCP image lint:** assert the hero has `priority`/`fetchpriority="high"` and is never `loading="lazy"`. ([web.dev](https://web.dev/articles/optimize-lcp))
4. **One-H1 + heading-hierarchy check** per template. ([Google](https://developers.google.com/search/docs/appearance/title-link))
5. **Sitemap URL audit:** every sitemap URL is canonical, 200, indexable; `lastmod` reflects real content changes, not deploy time. ([Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap))
6. **Soft-404 + redirect-chain detection** in the A11 crawl. ([Google](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics))
7. **Single-host canonicalization check:** exactly one scheme+host resolves 200; www/apex/http variants all 301. ([Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls))
8. **Stray-noindex + snippet-directive audit:** indexable templates carry no `noindex`/`max-snippet`/`data-nosnippet` that would suppress SERP + AI Overview eligibility. ([Google](https://developers.google.com/search/docs/appearance/ai-features))
9. **AI-crawler allow-policy assertion:** robots.txt explicitly allows search/citation agents (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot); training-bot stance recorded per entity. ([OpenAI](https://developers.openai.com/api/docs/bots))
10. **Orphan-page detection** + internal-links-point-at-canonicals check in the crawl. ([Ahrefs](https://ahrefs.com/blog/seo-checklist/))
11. **Entity schema completeness:** stable `@id`, `sameAs` (Wikipedia/Wikidata/official profiles), `mainEntityOfPage` per entity — beyond A8's "Organization node exists". ([Search Engine Land](https://searchengineland.com/entity-authority-ai-search-visibility-471619))
12. **Answer-first content lint:** question-phrased H2 followed by a 30–60-word direct answer on FAQ/consultation/how-to-reach pages. ([Backlinko](https://backlinko.com/answer-engine-optimization-aeo) · [Semrush](https://www.semrush.com/blog/content-optimization-ai-search-study/))
13. **Money-page refresh rota:** scheduled meaningful updates (stats, facts, dateModified) for key pages, logged with evidence. ([Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/))
14. **AI-surface impressions in the weekly QA audit:** segment AI Overviews/AI Mode impressions per site from GSC. ([Google](https://developers.google.com/search/docs/appearance/ai-features))
15. **Image sitemap generation** (off-origin CDN media) + descriptive-filename lint. ([Google](https://developers.google.com/search/docs/appearance/google-images))
16. **Statistics/quotes/citations presence check** on money pages (the ~+41% GEO lever) — likely a B-item with evidence, not a hard lint. ([Semrush](https://www.semrush.com/blog/generative-engine-optimization/))
17. **Brand-mention programme** (press/YouTube/directories KPI) — off-site workstream, needs an owner + Fleet Pulse row, not a CI gate. ([Ahrefs](https://ahrefs.com/blog/ai-brand-visibility-correlations/))
18. **Google Business Profile linkage** per entity added to the launch checklist. ([Google](https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search))

---

## 6 · CANONICAL RE-DIFF SOURCES (quarterly re-check against these)

1. [Google Search Essentials / SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) — Google's maintained master reference; changes land here first.
2. [web.dev — Core Web Vitals](https://web.dev/articles/vitals) — metric definitions/thresholds evolve annually (FID→INP 2024).
3. [Ahrefs — SEO Checklist](https://ahrefs.com/blog/seo-checklist/) — best maintained practitioner workflow checklist to diff ours against.
4. [Google — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) + [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — the only first-party AEO documentation.

### All reference sources
- [web.dev — Web Vitals](https://web.dev/articles/vitals)
- [web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp)
- [Google — Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google — Localized versions (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google — JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google — Structured data general policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google — Title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google — Google Images SEO](https://developers.google.com/search/docs/appearance/google-images)
- [Google — SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google — Introduction to robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Ahrefs — SEO Checklist](https://ahrefs.com/blog/seo-checklist/)
- [Google — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google — Guide to optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google — Succeeding in AI search (May 2025)](https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search)
- [Ahrefs — llms.txt study (137K sites)](https://ahrefs.com/blog/llmstxt-study/)
- [SEJ — 97% of llms.txt files got no requests](https://www.searchenginejournal.com/97-of-llms-txt-files-got-no-requests-ahrefs-data-shows/579478/)
- [Semrush — Content optimization for AI search study](https://www.semrush.com/blog/content-optimization-ai-search-study/)
- [Ahrefs — AI brand visibility correlations (75K brands)](https://ahrefs.com/blog/ai-brand-visibility-correlations/)
- [Ahrefs — AI assistants prefer fresh content (17M citations)](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
- [OpenAI — Overview of OpenAI crawlers](https://developers.openai.com/api/docs/bots)
- [Cloudflare — Perplexity stealth crawlers](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/)
- [SEJ — Schema, LLMs & the low bar for evidence in GEO](https://www.searchenginejournal.com/schema-llms-the-low-bar-for-evidence-in-geo/576090/)
- [Search Engine Land — Entity authority and AI search visibility](https://searchengineland.com/entity-authority-ai-search-visibility-471619)
- [Semrush — GEO practical guide](https://www.semrush.com/blog/generative-engine-optimization/)
- [Backlinko — Answer Engine Optimization](https://backlinko.com/answer-engine-optimization-aeo)
- [Seer Interactive — What drives brand mentions in AI answers](https://www.seerinteractive.com/insights/what-drives-brand-mentions-in-ai-answers)
- [Ahrefs — GEO growth strategies](https://ahrefs.com/blog/geo-generative-engine-optimization/)
- [Digital Applied — 1,000 AI Overviews citation study](https://www.digitalapplied.com/blog/we-analyzed-1000-ai-overviews-citation-pattern-study)

*Amendments to this playbook: LEARNINGS.md-driven PRs only.*
