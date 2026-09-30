# AHV English rebuild — SEO / AEO / GEO audit: /faqs-downloads/ and /search/

- **As of:** 2026-09-22 22:38:54 IST
- **Sub-agent:** seo-aeo-geo-auditor
- **Target:** production `next start` of the current build, served locally at `http://localhost:4321` (read-only — no rebuild, restart, or edit performed)
- **Site dir:** `sites/ayurvedichealingvillage.com` (repo: `ahv-english-staging-20260915` worktree)
- **Tools used:** curl (headers + raw HTML), Python (regex/JSON parsing of fetched HTML), Playwright (`@playwright/test`, via temp scripts under `tests/_audit_*.tmp.mjs`, deleted after use — see Checker), WebFetch (Google structured-data docs)
- **Pages audited:**
  1. `http://localhost:4321/faqs-downloads/`
  2. `http://localhost:4321/search/?q=psoriasis` and `http://localhost:4321/search/` (no query)
- **Reference page used only to verify the sitewide `SearchAction` target:** `http://localhost:4321/about-us/` (not otherwise audited — see Checker)

Source files read: `app/(english)/_families/schema.ts` (route JSON-LD), `app/(english)/_families/metadata.ts` (head metadata), `app/(english)/_families/boot.ts` (client head governance), `app/(english)/search/page.tsx` (results page), `app/(english)/[...slug]/page.tsx` (catch-all route), `public/ahv/views/ahv-page-faqs-and-downloads-{desktop,mobile}.json` (view data).

---

## 1. `/faqs-downloads/`

| Check | Pillar | Status | Fix Needed |
|---|---|---|---|
| FAQPage JSON-LD present | SEO/AEO | **FAIL** | No `FAQPage` node anywhere in the page's single `ld+json` block. Confirmed by parsing the served `@graph`: `["WebPage","ImageObject","BreadcrumbList","WebSite","Organization"]` — no `FAQPage`, no `Question`/`Answer` nodes. `app/(english)/_families/schema.ts` (`routeSchema()`) does not emit one for any route, including this one. See §1a for the eligibility caveat and the exact shape needed if added. |
| Heading hierarchy (h1 → h2 topics → h3 questions) | SEO | **PASS** | Rendered DOM (post-hydration) has exactly one `H1` ("FAQs & Downloads"), followed by 13 `H2` topic headers each immediately followed by its `H3` questions, no skipped levels. The 13 H2s match the claimed "13 topics" exactly: Why Choose Kairali?, Consultation & Admission, Understanding Ayurveda, Treatments & Programs, Accommodation & Facilities, Dietary Information, Travel & Logistics, Weather & Seasonal Information, Preparation & Packing, Insurance & Payment, For International Patients, After Your Treatment, Additional Resources. (Two more H2s follow — "Documents to take away" and "Not sure which programme fits?" — which are the downloads/CTA sections, not FAQ topics, and don't break the pattern.) |
| Answer-first shape, q-45..q-58 (AEO) | AEO | **PASS** | All 14 new answers open with a direct, quotable answer in the first sentence (mostly "Yes."/"Yes, …" or a direct fact), before any elaboration. Evidence (extracted from server HTML, `<details id="q-NN">`): q-45 "Yes. The first online consultation … is free of charge."; q-46 "Yes, a family member can stay with you…"; q-47 "Bookings must be made by a patient aged 18 or above…"; q-50 "Yes. Our published rates are quoted in INR, USD and EUR…"; q-51 "Our current cancellation policy: a full refund if you cancel 30 or more days before admission…"; q-58 "Yes. We can provide admission and discharge notes…". All answers are numeric/specific (prices, day counts, %s), not vague filler. |
| Internal link validity (every href) | SEO | **PASS** | 158 total hrefs on the rendered page → 57 distinct internal path links (excluding anchors/mailto/tel/external), all **200 OK** against `localhost:4321` (full list checked, see raw list in this report's evidence run — includes `/sitemap.xml`, all 5 PDF downloads under `/ahv/assets/doc/`, `/online-consultation/`, `/contact-us/`, etc.). 13 in-page `#topic-*` anchors all resolve to a real `id` in the DOM (checked via Playwright `document.getElementById`). |
| Internal link validity — external links | SEO | **WARNING** | 8 distinct external URLs present (WhatsApp, socials, `chat.kairali.com`, `whyayurveda.org`, `bookings.ayurvedichealingvillage.com`, a Google Maps deep link). `chat.kairali.com` and `whyayurveda.org` returned 200. **`https://bookings.ayurvedichealingvillage.com/` returned 403** to curl with both a default and a browser User-Agent — most likely Cloudflare/bot-protection rather than a dead link, but this could not be confirmed with a real browser session in this pass (out of scope for a curl/HEAD sweep). Flag for a manual browser check; do not treat as a confirmed break. |
| WhatsApp number correct | Register/facts | **PASS** | `https://wa.me/919289838797` = +91 92898 38797, the correct locked number. No `…38777` found anywhere on the page. |
| Title tag | SEO | **WARNING** | `"Ayurvedic FAQs & Hormonal Balance at Kairali Retreat"` (52 chars, fine length) — but this doesn't represent the page's actual content well: the page covers 13 broad topics (accommodation, travel, insurance, dietary, etc.), of which "hormonal balance" is one minor sub-topic, not the page's subject. It also **doesn't match `og:title`** on the same page, which is `"FAQs & Downloads"` (matches the H1). Title/H1/og:title should agree — recommend a title closer to `"FAQs & Downloads \| Kairali – The Ayurvedic Healing Village"` or similar that actually describes the 13-topic page. |
| Meta description | SEO | **FAIL (register)** / PASS (length) | `"Get answers about Ayurveda, women's hormonal balance, stay info & treatments at Kairali Healing Village. A complete guide to your wellness journey."` — 147 chars, fine length, but contains the **banned word "journey"** ("…your wellness journey"). This is duplicated verbatim into `og:description` and `twitter:description` (same string, 3 places). **KTAHV clinical-lock violation — must be reworded** (e.g., "…A complete guide before your stay."). |
| Canonical URL | SEO | **FAIL** | No `<link rel="canonical">` anywhere — confirmed absent in the raw server HTML **and** absent after full client-side hydration (checked `document.head` post-`networkidle` with Playwright; only `preload`/`icon`/`stylesheet`/`preconnect` links present, no canonical). `app/(english)/_families/metadata.ts` deliberately does not emit one, on the documented assumption that "the design writes it itself once the runtime boots" from the view JSON's own helmet data — but `public/ahv/views/ahv-page-faqs-and-downloads-{desktop,mobile}.json` carries **no canonical field at all** (checked both files, none found), so nothing is ever written. This is not FAQ-specific: `ahv-page-about-us-{desktop,mobile}.json` has the same gap. **This is a sitewide finding**, not a single-page one — flagging beyond this page because it changes the fix (likely: view JSON needs a canonical field, or `metadata.ts`'s no-canonical assumption needs revisiting for routes whose view has none). |
| Noindex present (staging) | GEO/SEO | **PASS** | Confirmed two independent ways: (1) `X-Robots-Tag: noindex, nofollow, noarchive, noimageindex` response header (works without JS); (2) client-injected `<meta name="robots" content="noindex, nofollow">` appears in `document.head` after hydration (`boot.ts`'s `enforceStagingHead()`). `robots.txt` also carries a blanket `Disallow: /`. Three independent layers — safe. |
| Register scan (KTAHV clinical lock) | Register | **1 FAIL, 1 clean, 1 allowed** | Full-page banned-word sweep (visible text + all meta fields, word-boundary, case-insensitive) for spa/resort/holiday/luxury/cure/journey/guests: **`spa`: 0. `holiday`: 0. `cure`: 0. `guest(s)`: 0.** `luxury`: 1 occurrence, inside "World Luxury Award Winner" — explicitly an allowed award name per the brief, not flagged. `resort`: 2 occurrences, but both are inside a legacy image **filename** in a JSON asset-mapping payload (`Kairali-Ayurvedic-Health-Resort.jpeg`), not visible copy — low-priority, flagged for awareness, not a content-register FAIL. `journey`: 8 raw occurrences, all the same one string ("…wellness journey") serialized into `meta description` / `og:description` / `twitter:description` / the RSC hydration payload — **this is the one real, actionable violation** (see Meta description row above). |

### §1a — FAQPage schema: what it would need, and whether it would still show rich results in 2026

Verified against Google's current developer documentation (`developers.google.com/search/docs/appearance/structured-data/faqpage`, fetched live): **since the August 2023 policy change, FAQ rich results are restricted to "well-known, authoritative government and health websites."** A private Ayurvedic hospital site — however clinically legitimate — is not in that allowlisted category the way, e.g., a national health service or a Mayo-Clinic-tier property is. So **adding `FAQPage` JSON-LD to this page would very likely NOT produce classic FAQ rich snippets (the expandable Q&A accordion) in Google's organic SERP in 2026.** This should be stated plainly to whoever owns the FAQ build so expectations are set correctly — it is not a quick SERP-real-estate win.

That said, `FAQPage` markup is still worth adding for two separable reasons that don't depend on the 2023 SERP restriction:
1. **AEO/GEO value** — machine-readable Q&A pairs are exactly the shape LLM answer engines (ChatGPT, Perplexity, Google AI Overviews) parse well when deciding what to cite; this is independent of classic rich-result eligibility.
2. **Semantic clarity for any crawler**, rich-result-eligible or not.

If added, the minimum valid shape (per schema.org / Google's spec) is:
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<exact question text>",
      "acceptedAnswer": { "@type": "Answer", "text": "<plain-text answer, matching what's visibly on the page>" }
    }
  ]
}
```
All 58 questions already exist as `<details data-q id="q-NN">` blocks with the question in `<summary>`/`<h3>` and the answer as sibling content — the data to populate this exists on the page already; it would be a straightforward addition to `schema.ts` reading the same source the page renders from (consistent with the file's own HARD-GATE-6 "every value is read, nothing composed" discipline). This is a **build recommendation, not something I implemented** — audit scope only.

---

## 2. `/search/?q=psoriasis` and `/search/` (no query)

| Check | Pillar | Status | Fix Needed |
|---|---|---|---|
| Noindex present | GEO/SEO | **PASS** | Both URLs: `X-Robots-Tag: noindex, nofollow, noarchive, noimageindex` header present, plus server-rendered `<meta name="robots" content="noindex, follow">` in the initial HTML (matches `export const metadata = { robots: { index:false, follow:true } }` in `app/(english)/search/page.tsx`). Note: the header says `nofollow` while the page's own meta says `follow` — a minor same-page inconsistency (see Warning row below); both agree on `noindex`, which is what matters for staging protection. |
| Robots directive consistency | SEO | **WARNING** | Header (`nofollow`) and in-page meta (`follow`) disagree on the `follow` directive. Per Google's combination rule, the more restrictive of two present robots directives generally wins, so this is unlikely to cause harm (both already say `noindex`), but it's worth reconciling — either the route's own `robots.follow: true` should become `false` to match the header, or the header shouldn't blanket-set `nofollow` if some staging routes intend `follow`. |
| WebSite SearchAction target valid | AEO/GEO (sitelinks searchbox) | **PASS** | Verified on `/about-us/`'s served `ld+json` (chosen as a representative content page — same generator, `schema.ts`, runs for every route): `potentialAction.target.urlTemplate` = `"https://ayurvedichealingvillage.com/search/?q={search_term_string}"`, `query-input` = `"required name=search_term_string"`. This is schema.org-valid `SearchAction`/`EntryPoint` shape, and the target is the real server-rendered results page — confirmed `/search/?q=psoriasis` returns live, relevant results (not a 404 or stub). This is the fix the source code comments describe (`D-20260922-37`) replacing a prior broken `/?s={search_term_string}` WordPress-only target; confirmed fixed. |
| Results page: server-rendered, not JS-only | GEO | **PASS** | `curl` (no JS execution) against `/search/?q=psoriasis` returns full result content in the raw HTML: "3 results for "psoriasis"" heading, both matched programmes (Psoriasis & Chronic Skin Treatment; Ayurveda Skin Vitality Revival Treatment) with prices and one-line descriptors, the matched FAQ question, and the fallback WhatsApp/consultation/call CTAs — all present without executing any JavaScript. `export const dynamic = "force-dynamic"` and the query engine runs server-side in a Node `vm` context (`app/(english)/search/page.tsx`), confirmed by reading the source. |
| Register scan (banned words) | Register | **PASS** | Full-page sweep (both `/search/` and `/search/?q=psoriasis`, raw HTML including all meta) for spa/resort/holiday/luxury/cure/journey/guest(s): **zero hits, either page.** Clean. |
| WhatsApp / phone numbers correct | Register/facts | **PASS** | Results page CTA links to `https://wa.me/919289838797` (correct, matches locked +91 92898 38797) and `tel:+919555156156` (the general helpline number used consistently, distinct from the WhatsApp number — not the locked WhatsApp fact, no `…38777` bug present anywhere). |
| Usable H1/title | SEO/AEO | **PASS** | Both URLs: `<title>Search Kairali \| Kairali – The Ayurvedic Healing Village</title>`, `<h1>Search Kairali</h1>`. Present, non-empty, matches page purpose. Not keyword-optimized (nor should it be — it's a noindexed utility page). |
| FAQ deep-link from results | AEO | **PASS** | The psoriasis result's matched question links to `/faqs-downloads/?q=psoriasis#q-12`; confirmed `id="q-12"` exists in the FAQ page's server HTML and `/faqs-downloads/?q=psoriasis` returns 200. Cross-page link integrity holds. |
| Canonical URL | SEO | **N/A (documented)** | No `<link rel="canonical">` on either search URL. Given the page is dynamic, per-query, and noindexed by design (search-results pages are conventionally never indexed), this is a defensible omission rather than a defect — unlike the FAQ page's canonical gap, there's no missing-source-data story here, it's simply not applicable to a noindexed results page. Not flagged as a FAIL. |

---

## Overall verdict

**PASS WITH WARNINGS.**

Blocking-severity items for a content/compliance pass (not blocking noindex/staging safety, which is solid):
1. **FAIL — banned word "journey"** in `/faqs-downloads/`'s meta description (and its `og:`/`twitter:` duplicates). KTAHV clinical-lock violation, needs a reword before this page could ship.
2. **FAIL — no FAQPage JSON-LD** on `/faqs-downloads/`. Not a rich-result loss in practice (2026 Google policy restricts FAQ rich results to authoritative gov/health sites — a private hospital site would likely not qualify regardless), but real AEO/GEO value is left on the table given 58 ready-made Q&A pairs already exist as structured `<details>` blocks.
3. **FAIL — no canonical tag anywhere on `/faqs-downloads/`**, contradicting the code's own comment that the design "writes it itself once the runtime boots" — traced to the view JSON having no canonical field. **This is sitewide** (confirmed the same gap on `/about-us/`'s view JSON too), so it's a fleet-level finding, not FAQ-page-specific — recommend escalating beyond this single-page audit.

Everything else checked (heading hierarchy, 58-question/13-topic count integrity, answer-first AEO shape for the new q-45..q-58, all 57 internal links + 13 in-page anchors, noindex via three independent layers, robots.txt, WhatsApp number correctness, SearchAction validity and its real server-rendered target, search-page register cleanliness, search-page server-rendering without JS) is a clean PASS.

---

## Checker — what I could not fully verify

- **`bookings.ayurvedichealingvillage.com` (403 to curl)**: could not confirm with a real browser session whether this is a genuine broken link or bot-protection (Cloudflare-style) rejecting scripted requests; flagged as a WARNING, not asserted as broken.
- **Google's FAQ rich-result policy** was verified via a live fetch of Google's own developer documentation page at time of audit (2026-09-22); I did not additionally test in an actual Search Console rich-results tester or live SERP, since this page is `noindex`ed on staging and can't be tested live. Policy citation should be treated as current-as-of-fetch, not independently re-confirmed against a live SERP test.
- **Monthly AEO/GEO query-citation test** ("10 target queries across ChatGPT/Perplexity/Google AI Overviews") — out of scope for this pass (this is a page-level structural/content audit of a staging build, not a live-ranking check on an unpublished, `noindex`ed site), and not meaningful to run against a `noindex`ed staging URL that no answer engine has crawled. Flagging that this cadence item is separate housekeeping and unrelated to this build's readiness.
- **`/about-us/`** was read only to obtain a representative `SearchAction` sample (since `schema.ts` generates it identically for every route) and was not otherwise audited — the banned-word grep I ran there incidentally as a sanity check (6 "spa", 2 "resort", 2 "luxury" hits) is **not analyzed or reported on** here since `/about-us/` is outside this task's two assigned pages; flagging its existence only so it isn't mistaken for a clean bill of health if someone reads this report as covering the whole site.
- **Core Web Vitals (LCP/CLS/INP)** and **Lighthouse mobile-usability** were not measured in this pass — no Lighthouse/PageSpeed run was performed against `localhost:4321`; this audit is markup/content/schema-level only, per the checks the task called for. Flagging as unverified rather than assumed-passing.
- I did not attempt to verify GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot/Google-Extended allowances at the CDN/Cloudflare layer (this is a local `next start`, not a deployed edge/CDN — that check is not meaningful against `localhost:4321`) or the presence/currency of `llms.txt` (not checked in this pass; scope was the two named pages' on-page SEO/AEO/GEO structure).
