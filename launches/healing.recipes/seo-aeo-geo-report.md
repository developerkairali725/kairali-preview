# SEO / AEO / GEO Audit — healing.recipes (new site, pre-DNS-flip)

- **Timestamp:** 2026-07-16 19:05:32 IST
- **Sub-agent:** seo-aeo-geo-auditor
- **Target:** static Next.js build served at http://localhost:4314 (fully static — curl output = exactly what crawlers get)
- **Pages audited:** `/`, `/books/harmony`, `/books/ayurvedic-herbal-massage`, `/books/the-ayurvedic-cookbook`, `/books/the-ayurvedic-wellness-cookbook`, `/author`, `/press`, `/contact`, `/privacy`, `/terms`, `/cookie-policy`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, all 14 legacy `.aspx` URLs
- **Method:** curl fetch of every route + static analysis (JSON-LD parse, meta/heading/alt extraction, redirect header checks) cross-checked against `content/books.json`, `content/redirects.json`, `packages/seo/src/index.js` (LIMITS), and app source
- **Register:** ED (book showcase) — Book JSON-LD, no Product/medical schema, KPI = buy clicks
- **Tools:** Bash/curl + python (Firecrawl/Context7/browser MCPs unavailable in this session — static build makes curl equivalent)

## Scope notes (N/A until DNS flip — not failures)

| Deferred check | Why |
|---|---|
| GSC sitemap submission, index coverage, mobile-usability report | Site not DNS-flipped; nothing in Search Console yet |
| Live HTTPS enforcement / HSTS / mixed-content in production | Host-level; verify on Vercel preview + after flip |
| Core Web Vitals field data (LCP/CLS/INP) | Needs Lighthouse/CrUX run — ship gate separately requires Lighthouse ≥90 perf / 100 SEO |
| Entity match vs Google Business Profile listings | Cross-check at flip; on-site entity data is internally consistent |
| Monthly AI-engine query logging (ChatGPT/Perplexity/AI Overviews) | Start the 30-day cadence at flip; log citation URLs per charter |
| Shopify-specific checks | Not a Shopify surface — skipped per instruction |

## Findings

| Check | Pillar | Status | Fix Needed |
|---|---|---|---|
| Unique title tags, ≤60 chars (LIMITS.title) | SEO | **PASS** | All 11 titles unique; longest 58 (`/author`). See length table below |
| Meta descriptions present, unique, ≤155 chars (LIMITS.description) | SEO | **FAIL** | `/author` description is **160 chars** (limit 155): "Gita Ramesh co-founded the Kairali Ayurvedic Group and has written four books on Ayurvedic cooking and living, including the Gourmand-winning Wellness Cookbook." Trim ≥5 chars (e.g. drop "-winning") in `app/author/page.tsx:19-20` |
| Pages route metadata through the `packages/seo` gate | SEO | **FAIL (root cause)** | Only `app/layout.tsx` calls `buildMetadata()`. All 7 page files hand-roll `export const metadata` / `generateMetadata`, so the throw-on->155 gate never sees them — that is exactly how the 160-char description shipped through a green `pnpm build`. Book pages even `.slice(0, LIMITS…)` (silent truncation ≠ gate). Route every page's title/description through `buildMetadata` (or a page-level variant); rule (g): gates are never advisory |
| Favicon set resolves | SEO | **FAIL** | Layout emits `<link rel="icon" href="/icon.png" sizes="64x64">` via `faviconIcons()` but **`/icon.png` is 404** (only `app/icon.svg` exists; `public/` has no icon.png). Add the 64×64 raster or drop the PNG entry |
| Single H1 per page | SEO | PASS | Exactly 1 H1 on all 11 pages |
| Logical H2/H3 hierarchy, no skipped levels | SEO | WARN | No skipped levels anywhere, but book, author, press and contact pages have **no H2s at all** — "About", "Where to buy", press-item sections are unlabeled. Add H2s (see AEO row below for double win) |
| Descriptive alt text on every image | SEO | PASS | All content images carry rich descriptive alts (from `books.json coverAlt`); header `kairali-icon.svg` has `alt=""` — correct for a decorative mark |
| Canonical URLs | SEO | PASS (1 note) | All 8 indexable pages self-canonical. Note: noindex legal pages (`/privacy`, `/terms`, `/cookie-policy`) canonicalise to the homepage — contradictory signal (noindex + canonical-elsewhere); make them self-canonical or drop the tag |
| Canonical vs sitemap root form | SEO | NOTE | Canonical `https://healing.recipes` (no slash) vs sitemap `https://healing.recipes/` — equivalent for the root path per URL normalisation; harmless, unify if convenient |
| Open Graph / Twitter cards match the page | SEO | WARN | `/author`, `/press`, `/contact` inherit the **site-default** og:title/og:description/og:url (hand-rolled metadata defines no `openGraph`). Book pages: og:title/desc/image correct but **no og:url**, and twitter:title/description fall back to the site default while twitter:image is book-specific. Social/AI-preview shares misrepresent these pages. Fixing the buildMetadata bypass (above) fixes this too |
| Internal linking / topic cluster | SEO+GEO | PASS | Pillar home links all 4 book pages with descriptive anchors; header/footer interlink author/press/contact/books on every page; book pages link back to `/#shelf` and `/author`. `/books` bare path correctly 404s (breadcrumbs use `/#shelf`) |
| Legacy `.aspx` 301 protection map (14 URLs) | SEO | PASS (1 note) | All 14 redirect single-hop to the exact targets in `content/redirects.json`; all targets 200. **Note: status is 308, not 301** — Next.js `permanent: true` emits 308 (method-preserving permanent; Google treats it as 301-equivalent, and Vercel hosting emits 308 as well). Literal 301 would need an edge/hosting rule — flagging to human rather than silently accepting; full matrix below |
| XML sitemap correct | SEO | PASS | All 8 indexable URLs present with lastmod/changefreq/priority; noindex legal pages correctly excluded; referenced from robots.txt |
| robots.txt sane | SEO | PASS | `User-Agent: * / Allow: /` + absolute Sitemap line |
| noindex discipline | SEO | PASS | Draft legal pages (`/privacy`, `/terms`, `/cookie-policy` — all marked "Draft — pending legal review") are `noindex, follow` and out of the sitemap; all 8 real pages `index, follow` |
| 404 discipline | SEO | PASS | Unknown book slug and unknown routes return real 404s (`dynamicParams = false` — no fabricated pages) |
| Mixed content / protocol hygiene | SEO | PASS | Zero `http://` references in any page; all asset/OG URLs https absolute or root-relative |
| Mobile viewport + CLS guards | SEO | PASS | `width=device-width, initial-scale=1` everywhere; every `<img>` ships explicit width/height; fonts self-hosted with `display: swap` |
| Book JSON-LD — 4 nodes, correct ISBNs | SEO+GEO | **PASS** | All four ISBNs match `content/books.json` exactly (matrix below). Author is `@id`-linked to the shared Person node, publisher/datePublished/numberOfPages correct, award **only** on Wellness Cookbook, offers carry every buy link with sellers, no prices (intentional — KPI is the click). Book, not Product/medical — correct for register ED |
| JSON-LD graph validity | SEO+GEO | PASS | Every block parses; home = Organization + WebSite + Person + 4×Book + BreadcrumbList `@graph` with consistent `@id` cross-references; book pages = Person + Book + BreadcrumbList; author = Person + BreadcrumbList. Minor: `bookFormat` omitted (books.json has `format`) — optional enrichment |
| Direct quotable answer in first 40–60 words | AEO | PASS | Home main content answers "who/what" inside ~50 words (author, role, four books, Gourmand Best in the World 2023); book pages open with bibliographic facts + a factual first paragraph |
| Question-formatted H2s with answers beneath | AEO | WARN | None site-wide, and no FAQ section (legacy `faq.aspx` 301s to `/`). Suggest one "Common questions" block (e.g. "Which Gita Ramesh book should I start with?", "Where can I buy Harmony?") — pairs with FAQPage schema, zero medical claims needed |
| FAQ / HowTo / Article schema | AEO | N/A (opportunity) | No FAQ/HowTo content exists to mark up; Book+Person+Breadcrumb is the right core set for this register. Add FAQPage only if the block above ships |
| Answer content server-rendered | AEO+GEO | PASS | Full content present in raw curl body — static export, no JS-only rendering |
| Comparison table for multi-option content | AEO | WARN (minor) | The four-book shelf uses cards with biblio lines — serviceable, but a compact "which book is which" comparison (year · focus · format) would win listicle/AI-comparison queries |
| Identity block consistent across pages | AEO+GEO | PASS | Footer identity block is byte-identical on every page; Person node (`@id`, name, jobTitle, sameAs) identical everywhere |
| AI crawlers not blocked (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended) | GEO | PASS | robots.txt allows all UAs, no per-bot disallow; CDN/WAF layer to re-verify after flip |
| llms.txt exists and is current | GEO | PASS | Present at root; all four ISBNs, dates, award and Harmony July-2026 launch facts match books.json; links to all four book pages + publisher + group |
| E-E-A-T signals | GEO | PASS (1 note) | Named author with role + LinkedIn/publisher sameAs; press page cites The Hindu and other third parties with live links; legal pages show visible "14 July 2026" dates. Note: content pages have no visible "Last updated" stamp — add a build-date line in the footer if cheap |
| Entity consistency (locked facts) | GEO | PASS | `info@kairali.com` everywhere (mailto + Organization JSON-LD); zero occurrences of the …38777 WhatsApp bug; brand naming consistent ("Kairali Ayurvedic Group"); Gita Ramesh never styled "Dr." (style law) — the only "Dr." is the quoted Dr. P.R. Krishnakumar, correctly attributed |
| Content freshness | GEO | PASS | Built/lastmod 2026-07-16; Harmony launch content current to this week |
| No medical claims (register ED) | House | PASS | Zero hits for cure/treats/heals/remedy/therapeutic/clinically-proven/detox/immunity-boost/weight-loss claim patterns across all pages |
| Group banned filler words | House | PASS | Zero hits (bespoke, curated, discerning, unparalleled, nestled, indulge, pamper, exquisite, world-class, unique) |
| No keyword stuffing / anchor spam | Must-not-do | PASS | Anchors descriptive and varied; no stuffing patterns |
| KPI instrumentation (buy clicks) | House | PASS | Every buy link carries `data-cta="buy_click"` (harmony 4, cookbook 4, herbal 3, wellness 3 — matches offer counts); plus hero/header/shelf/email CTAs instrumented |

## Legacy .aspx redirect matrix (all single-hop, targets 200)

| Legacy URL | Status | Target | Matches redirects.json |
|---|---|---|---|
| /default.aspx | 308 | / | YES |
| /about-us.aspx | 308 | /author | YES |
| /concept.aspx | 308 | / | YES |
| /recipes.aspx | 308 | / | YES |
| /press-praise.aspx | 308 | /press | YES |
| /faq.aspx | 308 | / | YES |
| /gallery.aspx | 308 | / | YES |
| /chef-retreat-july-2017.aspx | 308 | / | YES |
| /menu-july-2017.aspx | 308 | / | YES |
| /reservations.aspx | 308 | /contact | YES |
| /enquire-now.aspx | 308 | /contact | YES |
| /contact-us.aspx | 308 | /contact | YES |
| /privacy-policy.aspx | 308 | /privacy | YES |
| /sitemap.aspx | 308 | / | YES |

14/14 correct targets. 308 = permanent (Next.js `permanent: true`); SEO-equivalent to 301 — flagged to human above.

## Book JSON-LD ISBN verification

| Book | JSON-LD isbn | books.json isbn13 | Match |
|---|---|---|---|
| Ayurvedic Herbal Massage | 9788174360960 | 9788174360960 | YES |
| The Ayurvedic Cookbook | 9788194206842 | 9788194206842 | YES |
| The Ayurvedic Wellness Cookbook | 9789392130755 | 9789392130755 | YES |
| Harmony | 9789349474826 | 9789349474826 | YES |

## Title / description lengths (LIMITS: title 60 · description 155)

| Page | Title chars | Desc chars | Within limits |
|---|---|---|---|
| / | 42 | 141 | YES |
| /books/harmony | 21 | 152 | YES |
| /books/ayurvedic-herbal-massage | 38 | 151 | YES |
| /books/the-ayurvedic-cookbook | 36 | 134 | YES |
| /books/the-ayurvedic-wellness-cookbook | 45 | 133 | YES |
| /author | 58 | **160** | **NO — description over by 5** |
| /press | 32 | 128 | YES |
| /contact | 25 | 92 | YES |
| /privacy (noindex) | 32 | 141 (inherited) | YES |

## Blocking items (fix before ship gate)

1. **/author meta description 160 > 155** — `app/author/page.tsx:19-20`. Trim ≥5 chars.
2. **Metadata gate bypass (root cause)** — 7 page files export hand-rolled metadata that never passes through `buildMetadata()`, so the packages/seo throw-gate is decorative for every page except the layout. This is how item 1 shipped through a green build. Route page metadata through the gate; do not fix by widening LIMITS (rule g).
3. **/icon.png 404** — linked as favicon fallback by `faviconIcons()` in `app/layout.tsx`; file absent from `app/` and `public/`. Add the 64×64 PNG or remove the entry.

## Overall verdict: **FAIL**

Three blocking items — all small and mechanical. Everything structural (Book JSON-LD with correct ISBNs, protection map, sitemap/robots/llms.txt, entity consistency, zero medical claims, buy-click instrumentation) is in place; re-audit after fixes should pass cleanly, with the WARN rows (per-page OG/Twitter, H2 sections, FAQ block) as the beauty-pass backlog.

---
*Logger contract: 2026-07-16 19:05:32 IST · sub-agent=seo-aeo-geo-auditor · pages audited: 11 HTML routes + robots/sitemap/llms.txt + 14 legacy redirects · issues: 3 FAIL (author desc 160>155, buildMetadata bypass on 7 pages, /icon.png 404), 5 WARN (OG/Twitter fallbacks, missing H2 sections, no question-formatted headers/FAQ, legal-page canonicals, no visible last-updated on content pages), 1 human-flag (308 vs literal 301) · tools: curl/Bash + python static analysis (Firecrawl/Context7 unavailable; static build makes curl authoritative) · GSC/live-query/CWV checks deferred to post-DNS-flip.*
