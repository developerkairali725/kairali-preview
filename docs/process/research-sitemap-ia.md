# Stage S6 — SITEMAP & INFORMATION ARCHITECTURE

**2026-07-15 17:53:13 IST · Research + stage definition. No code changed, no git run.**
**Commission:** Abilash, 15 Jul 2026 — *"BUILDING A SITE MAP is one of the major points which we MISSED"* + his step 7, *"understand where these keywords will go in that site map."*
**Status:** RESEARCH + PROPOSED STAGE. Not ratified. Gate thresholds in §9 need Abilash's sign-off before they bind (see §11).
**Scope of this doc:** the sitemap/IA stage only. The surrounding stage order (S1–S15) is another workstream's deliverable; this doc defines S6 and its interfaces to S5 (keywords) and S7 (build).

---

## 0 · PUSHBACK FIRST — the premise is half-right, and the true failure is worse

Abilash's brief says we *missed* the sitemap step. Duty of pushback (CLAUDE.md Operating Principles) requires correcting this before building doctrine on it, because the wrong diagnosis produces the wrong gate.

**What is actually true:**

1. **We did not skip sitemaps. We did one — ungated, unvalidated, and out of order.** `docs/group-inputs/whatisayurveda-full-sitemap.md` (2026-07-15 14:11:13 IST) is a genuine, competent, 3,400-page IA: URL grammar, template families T0–T7, hub-spoke law, per-phase page targets, WebMD/Mayo/Healthline/Drugs.com teardown with an evidence index. That is not a missed step. It is a *good artifact produced by an unrepeatable process.*
2. **The real defect: that sitemap was built downstream of the DataForSEO demand map — the artifact that was factually wrong.** The demand map invented compound seeds ("turmeric curcumin", "amla amalaki"), understated turmeric 11× and amla 25×, summed implausible zeros into cluster totals, and pulled India in English only. The sitemap's cluster priorities and page-count targets inherit that error. **A sitemap built on unvalidated keyword data is not a missed step — it is a laundered error.** It converts a bad number into an architecture, and architecture is expensive to unwind: URLs, redirects, internal links, and eventually rankings.
3. **So the gate we need is not "remember to do a sitemap."** It is: *keywords may not become architecture until the keyword data has passed a validation gate, and the sitemap may not become content until the sitemap has passed a findability gate.* Two gates, not a reminder.

**Therefore this document defines S6 with a hard entry condition (§3.0) that the existing whatisayurveda sitemap does not currently satisfy.** That sitemap must be re-entered at S6.1 once S5 is re-run with corrected demand data. Its *structural* research (the WebMD teardown, lessons L1–L12) survives — that work is sound and is reusable input. Its *priorities and page counts* do not survive and must be recomputed.

**One more correction to the proposed order.** Abilash's step list runs `4 keywords → 5 SEO → 6 sitemap`. Given the failure above, the honest order is `4 keywords → 5 SEO → 5.5 KEYWORD DATA VALIDATION (blocking) → 6 sitemap`. His intent is preserved exactly; the refinement is that the demand map must survive an adversarial check before anyone draws a box on a diagram. This is the single most load-bearing change in this document.

**On AEO "should technically be FIRST":** correct, and it lands *here* rather than after the build. AEO is not a content-polish step — it is an IA decision. Whether a query gets its own URL or becomes an H2 inside a parent page is an AEO decision made at S6, because answer engines retrieve *chunks*, and a chunk's addressability is determined by the sitemap (§2.8, §6.1).

---

## 1 · Research base — what I read, and what I could not get

Abilash asked specifically for named authorities and real practitioner discussion. Honesty about coverage, per the "unverified is listed as unverified" doctrine:

**Obtained (primary or authoritative):** NN/G on card sorting vs tree testing, tree testing method, flat vs deep hierarchies; Miller (1981) depth/breadth study via SAGE; Google Search Central on crawl budget, faceted navigation, pagination, sitemaps; Ahrefs on keyword mapping and their multiple-rankings study; HubSpot on topic clusters; Aggarwal et al. GEO (KDD 2024, arXiv); Unbounce attention ratio; Logeix Shopify collection SEO.

**Could NOT obtain — do not pretend otherwise:**

| Source | Why not | Consequence |
|---|---|---|
| **Reddit (r/SEO, r/bigseo, r/juststart, r/shopify, r/PPC)** | `reddit.com` is blocked to our user agent — WebSearch returns HTTP 400 "domains are not accessible to our user agent"; WebFetch returns "unable to fetch". Verified, not assumed. | **We have ZERO first-hand Reddit evidence in this document.** Everything I might have written as "Redditors say…" would have been reconstructed from memory or from blogs that claim to summarise Reddit. I have written none. This is a real gap in Abilash's brief that I cannot close with the current toolchain — see §11 Q4. |
| **Koray Tuğberk Gübür's topical-map method (full)** | The public page describes the concept; the operational method (source context, central entity, topical border, query networks, contextual hierarchy) sits behind his paid Semantic SEO course (87+ lectures). His public page does not contain step-by-step construction. | §2.3 states only what is publicly attributable. The specific vocabulary is widely paraphrased by third parties; I have not treated paraphrase as primary. |
| **NN/G's underlying IA research corpus** | Their flat-vs-deep article does not itself cite Miller/Snowberry. I sourced Miller (1981) independently. | Miller is cited to SAGE directly, not to NN/G. |

**Claims I found circulating and am REFUSING to cite** — this is the demand-map failure class, caught in the research phase:

| Claim | Where it circulates | Why rejected |
|---|---|---|
| "Topic clusters → **43% increase** in organic traffic (HubSpot research)" | Repeated by whitehat-seo.co.uk, performancemarketingadvisors.com and others, always attributed to "HubSpot research" | **I fetched HubSpot's own topic-cluster article. The 43% figure is not in it.** No primary HubSpot source found. Uncited number laundered through secondary blogs. Do not use. |
| "Topic clusters get **3.2× more AI citations**" | Same secondary blogs | No primary source. No method, no sample, no date. Do not use. |
| "More than one goal **decreases conversions by 266%**" | hooklead.com, klientboost.com, attributed to Unbounce | **I fetched Unbounce's own attention-ratio glossary page. The 266% figure is not there, and Unbounce cites no study at all.** Also *mathematically impossible* — a decrease cannot exceed 100%. This is the single clearest specimen in this research of a number that survives on repetition alone. Do not use. |
| "Sites with topic clusters improved rankings across 300+ keywords in 12 months" | Secondary | No primary HubSpot source located. Do not use. |

**Lesson for the pipeline, and it is the whole point of the exercise:** three of the four most quotable numbers in the topic-cluster/landing-page literature do not survive a single click through to the primary source. An agent optimising for a confident-sounding deliverable would have shipped all three. The demand-map failure and the "43%" failure are the *same failure* — a plausible number, unverified, promoted to fact. §9's gate treats a missing citation as a build-blocker for exactly this reason.

---

## 2 · What the authorities actually say

### 2.1 IA canon — the sense-making layer

**Abby Covert, *How to Make Sense of Any Mess*** (abbycovert.com/make-sense) — IA is *"the way we arrange the parts of something to make it understandable as a whole."* Her process: **State your intent → Face reality → Choose a direction → Measure the distance → Play with structure → Prepare to adjust.** Two things transfer hard to us:
- **"State your intent" precedes structure.** Our equivalent is the site brief + register (KTAHV clinical vs Villa Raag hospitality vs KAPPL product). A sitemap drawn before the register is chosen will need re-labelling, and labels are the expensive part.
- **"Face reality"** = the live-site inventory. This is already our BUILD DECISION MATRIX rule 1 ("MINE FIRST, ALWAYS"). Covert independently arrives at the same place. Good sign.

**Rosenfeld, Morville & Arango, *Information Architecture: For the Web and Beyond* (4th ed.)** — IA decomposes into **four systems: organization, labeling, navigation, search** (books.google.com/books/about/Information_Architecture.html?id=vJWJCgAAQBAJ). Critically: *these systems do not work in isolation; they must work in concert.* Our sitemap artifact today captures organization + navigation and is silent on labeling and search. For a 3,400-page encyclopedia with Sanskrit/IAST/Latin-botanical/vernacular naming, **labeling is the hardest of the four** and it is the one we have not specified. (The existing whatisayurveda sitemap's lesson L6 — canonical page + alias layer, from Mayo — is a labeling-system answer. It should be promoted from a lesson to a required artifact field.)

**Miller, D.P. (1981), "The Depth/Breadth Tradeoff in Hierarchical Computer Menus,"** *Proceedings of the Human Factors Society 25th Annual Meeting* (journals.sagepub.com/doi/10.1177/107118138102500179) — the foundational experiment. 64 items held constant, arranged as **2⁶, 4³, 8², and 64¹**. Result: goal-acquisition time is a **U-shaped function with its minimum at 8² (two levels, eight choices each)**. Both extremes lost — 64-wide and 6-deep. Errors tracked times: fastest condition also produced fewest errors, least variability, easiest to learn. Miller's own rule for when 8² won't fit: **"expansion in breadth is recommended over expansion in depth."**

**NN/G, "Flat vs. Deep Website Hierarchies"** (nngroup.com/articles/flat-vs-deep-hierarchy/) — *"Content is more discoverable when it's not buried under multiple intervening layers."* Note honestly: NN/G's article argues the principle qualitatively and does **not** cite Miller; and the broader literature (incl. NN/G's own work on information scent) holds that **scent and labeling matter as much as or more than the breadth/depth ratio itself.** A perfectly-proportioned tree with vague labels still fails.

**Reconciled rule for us:** target **moderate breadth, shallow depth**; when a level overflows, **widen before deepening** (Miller); and treat the breadth/depth number as *secondary to label quality* (NN/G). Our URL-depth cap (§2.4) and our hub fan-out are the two knobs.

### 2.2 The topic-cluster model — what HubSpot actually demonstrated

**HubSpot, "Topic Clusters: The Next Evolution of SEO"** (blog.hubspot.com/marketing/topic-clusters-seo). Structure: **pillar page** (broad) + **cluster pages** (specific subtopics) + **internal links**. Structural rules stated: every cluster page links back to its pillar with descriptive anchor text; the pillar links to all important cluster pages; cluster pages cross-link where topics genuinely overlap.

The original research is **Anum Hussain & Cambria Davies (2015)**, run on HubSpot's own content team. What it actually found, stated precisely: *"the more internal links they added between related pages, the higher those pages climbed in SERPs, and the more impressions they earned"* — published as a scatter plot showing positive correlation.

**Read that honestly.** It is (a) a **correlation**, (b) **n=1 site**, (c) **self-reported by the vendor selling the methodology**, (d) from **2015**. It is not a controlled experiment and it does not establish causation. It is *suggestive*, it is *the origin of the industry's most-copied content model*, and it is *weaker evidence than its ubiquity implies*. We adopt pillar-cluster because it is structurally coherent and because it converges with Miller and with chunk-retrieval (§2.8) — **not** because HubSpot proved it.

### 2.3 Topical maps — Koray Tuğberk Gübür

Publicly attributable (topicalauthority.digital/koray-tugberk-gubur): he coined **topical authority = topical coverage + historical data**; a **topical map** is the overall structure of site content, built so that *"every sub-topic, entity, and query variation is covered with semantic precision"*; **query networks** model *"how queries are connected semantically, ensuring that a website captures all user intents and question variations."* The site frames content as a knowledge graph mirroring how engines map entities and relationships.

**What I will not do:** reproduce a step-by-step "Koray method" with confident vocabulary I could not verify from his own writing. The operational detail is behind his course. What survives for our use is the **principle**: coverage is defined over an *entity/query network*, not over a keyword list — which is precisely why the demand map's fake compound seeds ("amla amalaki") were so destructive. They were not entities. No real query network contains them. **A topical map built from non-entities is a map of a country that does not exist.**

### 2.4 URL structure

- **Depth:** practitioner consensus converges on **shallow — roughly 1–2 subfolders, 3–4 levels maximum**; deeper paths show no ranking benefit and clutter crawl paths (loganix.com/url-structure-for-seo/, screamingfrog.co.uk/learn-seo/url-structure/).
- **Length:** Ahrefs' analysis reports URLs beyond **~115 characters** correlate with measurably lower average rankings. Correlational; treat as a smell, not a law.
- **Keywords in slug:** a **confirmed minor** ranking signal. Minor. Do not contort a slug for it.
- **Subfolders over subdomains:** subdomains are classified as independent entities and split authority. Subfolders unless there is a strong reason.
- **Permanence:** the strongest argument for shallow, keyword-exact, hierarchy-light URLs is that **a URL you never have to change is worth more than a URL that reads well.** Every taxonomy change you bake into a path becomes a redirect later. Healthline's flat `/health/<slug>` at ~38.9k pages (existing whatisayurveda sitemap, lesson L10) is the pattern: hierarchy expressed by **hubs and links**, not by **path segments**. This is the correct default for our encyclopedia — it decouples IA changes from URL changes.

### 2.5 Internal linking

The HubSpot correlation (§2.2) is the popular evidence; the durable argument is mechanical: internal links are how PageRank flows and how crawlers discover. The existing whatisayurveda teardown's **lesson L1 is the strongest empirical observation in our own repo** — WebMD's www domain has **no public XML sitemap at all** (zero `Sitemap:` directives in robots.txt; `/sitemap.xml` 404s), and its entire consumer-SEO discovery runs on A–Z indexes + hub-spoke + crosslink modules. A top-tier health property at massive scale demonstrates that **internal linking, not the XML sitemap, is the discovery engine.**

Corollary we must encode: **an XML sitemap is not an architecture.** It is a hint. If a page is only reachable via the XML sitemap, it is an orphan wearing a disguise. **Orphan count must be zero at the gate** (§9).

### 2.6 Crawl budget — and an honest scoping of whether it applies to us

**Google, "Crawl Budget Management"** (developers.google.com/crawling/docs/crawl-budget). Thresholds, quoted:
- *"Large sites (1 million+ unique pages) with content that changes moderately often (once a week)"*
- *"Medium or larger sites (10,000+ unique pages) with very rapidly changing content (daily)"*
- Sites with a large share of URLs reported **"Discovered – currently not indexed"** in Search Console

Google explicitly calls these *"a rough estimate… not exact thresholds."* Definitions: **crawl capacity limit** = *"the maximum number of simultaneous parallel connections that Google can use to crawl a site, as well as the time delay between fetches"*; **crawl demand** = per-crawler need driven by site size, update frequency, quality, relevance. Google's stated levers to *increase* budget are only two: **more server resources**, and **better content quality**.

**Applied honestly to us: at 3,400 pages, whatisayurveda.com is BELOW every threshold Google names.** Google's own guidance for sites like ours: *keep your sitemap up to date and check index coverage regularly — that is adequate.* **So we should not build crawl-budget theatre into the gate.** The one condition that *would* make it real for us is the third bullet — a large share of "Discovered – currently not indexed" — which is a **post-launch observation, not a pre-launch prediction.** S6 therefore carries no crawl-budget gate; it carries a **crawl-efficiency hygiene rule** (no infinite spaces, no redirect chains, correct status codes) which is cheap and correct at any size, plus a **post-launch trigger**: if GSC "Discovered – currently not indexed" exceeds a threshold, crawl budget becomes real and S6 is re-entered. (Threshold needs a decision — §11 Q3.)

### 2.7 Faceted navigation and pagination

**Google, "Improve crawling of faceted navigation URLs"** (developers.google.com/crawling/docs/faceted-navigation). The two named problems: **overcrawling** — *"Because the URLs created for the faceted navigation seem to be novel and crawlers can't determine whether the URLs are going to be useful without crawling first, the crawlers will typically access a very large number of faceted navigation URLs"* — and **slower discovery** — *"If crawling is spent on useless URLs, the crawlers have less time to spend on new, useful URLs."* Guidance: use the standard **`&`** separator (comma, semicolon, brackets are *"hard for crawlers to detect as parameter separators"*); if filters live in the path, keep filter order fixed and forbid duplicates; **robots.txt disallow** is the recommended lever; **`rel=nofollow` and `rel=canonical` are *"generally less effective in the long term."*** Return **404 when a filter combination has no results** rather than redirecting.

**Google, "Pagination Best Practices"** (developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading):
- *"Don't use the first page of a paginated sequence as the canonical page. Instead, give each page its own canonical URL."*
- *"Give each page a unique URL. For example, include a `?page=n` query parameter."*
- *"Don't use URL fragment identifiers (the text after a `#`) for page numbers."*
- *"Include links from each page to the following page using `<a href>` tags."*
- **`rel=next`/`rel=prev`: "Google no longer uses these tags"** (still used by other engines).
- Filtered/sorted variants: block with `noindex` **or** robots.txt.
- Infinite scroll / "load more" break crawling because *"Google's crawlers don't 'click' buttons and generally don't trigger JavaScript functions that require user actions."*

**Note the tension, and resolve it:** Google says *robots.txt* for facets (crawl-side) but *noindex or robots.txt* for paginated variants (index-side). These do different jobs and are **not interchangeable** — robots.txt stops the crawl (so a `noindex` on a disallowed URL is never seen), `noindex` stops the index (but the crawl still happens). Google's crawl-budget doc explicitly warns against using `noindex` to save crawl budget for this reason. **Rule for us: robots.txt to prevent crawl of combinatorial spaces; `noindex` only on URLs we still want crawled and followed.**

### 2.8 How AI answer engines consume structure

**Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan & Deshpande, "GEO: Generative Engine Optimization," KDD 2024** (arxiv.org/abs/2311.09735). A black-box optimisation framework + **GEO-BENCH** (~10K queries across domains). Headline: **GEO methods boost visibility by up to 40% in generative engine responses**; best performers improve on baseline by **+22% on Position-Adjusted Word Count** and **+37% on Subjective Impression**. Top-performing methods reported: **Statistics Addition** and **Quotation Addition** (also Cite Sources). Key caveat the paper itself raises: *"the efficacy of these strategies varies across domains, underscoring the need for domain-specific optimization methods."*

**This is the only peer-reviewed, benchmarked evidence in this document.** Note it is about *content tactics on a page*, not IA — so do not over-claim it for sitemap decisions. Its IA-relevant implication is indirect but real: cite-and-statistic-dense, self-contained passages win, which means **the unit of retrieval is the passage, not the page.**

The practitioner GEO/AEO literature (lumar.io/blog/best-practice/content-chunking-ai-extractability-geo-aeo-explainer/, wsiworld.com/blog/how-to-structure-content-for-ai-answer-engines-a-geo-and-aeo-guide) converges on: RAG pipelines chunk by heading/paragraph; each chunk should stand alone if extracted; headings should read as **user queries** ("retrieval anchors"); avoid pronouns replacing key entities inside chunks. This is vendor-blog material, not research — flagged as such — but it is *mechanically consistent* with how RAG demonstrably works, and it is consistent with the GEO paper's findings.

**The IA decision this forces, and it is the AEO-is-first point made concrete:** if the retrieval unit is the passage, then **"does this query get a URL or an H2?"** becomes the central S6 question. Give a query its own URL when it needs to rank, be linked, and be cited independently. Give it an H2 inside a parent when it is a facet of one intent. **Both are addressable to an answer engine; only one is addressable to a link.** Getting this wrong in the direction of "URL for everything" is precisely how a 3,400-page encyclopedia becomes 3,400 thin pages. Getting it wrong the other way buries citable answers.

### 2.9 The three sitemaps — do not conflate

| | **UX sitemap** | **XML sitemap** | **HTML sitemap** |
|---|---|---|---|
| Audience | Internal team | Search engines / crawlers | Human visitors (and crawlers, incidentally) |
| Form | Diagram / tree / spreadsheet | `sitemap.xml`, protocol-bound | A page on the site |
| Purpose | Design the structure before building | Assist discovery; declare `lastmod` | Navigation aid **+ PageRank distribution** |
| Ships? | No — it is a planning artifact | Yes | Yes, when scale justifies |
| Ours | **The S6 deliverable** | `app/sitemap.ts` (shipped for whatisayurveda) | `/sitemap` curated hub (planned, L2) |

**XML limits** (developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): **50MB uncompressed or 50,000 URLs** per file; exceed either → split and use a **sitemap index**. Only the primary `<loc>` counts toward 50,000 — **hreflang alternates in `<xhtml:link>` do not increment the counter** (relevant to KTAHV's EN/DE/FR). **Google ignores `<priority>` and `<changefreq>`; it does use accurate `<lastmod>`.** UTF-8 required. Segment by content type so GSC coverage is diagnosable per template family.

**When Abilash says "sitemap," he means the UX sitemap.** That is the one we skipped as a *stage*. The XML one is a build artifact we already emit. Conflating them is how the miss happened: someone saw `app/sitemap.ts` in the repo and the box felt ticked.

---

## 3 · THE STAGE — S6, labelled, one sub-step at a time

Per Abilash: *"LABEL THEM CLEARLY so you understand where you're going and which step to enter."* Each sub-step has an **entry condition**, an **artifact**, and an **exit check**. **An agent enters exactly one sub-step at a time and may not proceed on a failed exit check.**

### S6.0 — ENTRY GATE (blocking; this is the anti-laundering gate)

**S6 may not be entered unless ALL are true:**

| # | Condition | Machine evidence |
|---|---|---|
| E1 | S5 keyword data exists and is **validated** | `keywords-validated.json` present, `validation.status == "PASS"` |
| E2 | **Every seed is a real entity or a real query** — no invented compounds | Each seed carries `source: "dataforseo" \| "gsc" \| "autocomplete" \| "paa"` + a raw response hash. **Seeds with `source: "agent_constructed"` are FORBIDDEN.** This is the "turmeric curcumin" killer. |
| E3 | **Zero-volume claims are proven, not assumed** | Any keyword reported at volume 0 must carry a second-source check. Shilajit/shatavari/gokshura at 0 US while India shows 246K/90.5K/27.1K = an unproven zero. **Unproven zeros block S6.** |
| E4 | **Every target market pulled in its real languages** | `locales[]` per market. India = `en` **+ `hi` (Devanagari) + Hinglish transliteration**. English-only India = FAIL. |
| E5 | Live-site inventory complete (BUILD DECISION MATRIX rule 1) | `<site>-live-inventory.md` |
| E6 | Protection map complete for any legacy site (rule 2) | `<site>-protection-map.md`, every legacy URL has a fate |
| E7 | Audience segments + awareness stages defined (Abilash steps 2–3, 9, 12–14) | `audience-segments.md` with needs/desires/fears per segment |
| E8 | Register chosen (KTAHV clinical / Villa Raag hospitality / KAPPL product / group-corporate) | `site.config.json → register` |

**E2 + E3 + E4 exist solely to make the DataForSEO failure unrepeatable.** They are stated as machine checks, not as advice, because advice is what we had and it did not work.

### S6.1 — ENTITY & QUERY NETWORK

Turn the validated keyword list into an **entity graph**, not a spreadsheet. For each: the central entity (`ashwagandha`), its aliases (Sanskrit / IAST / Latin-botanical / vernacular / common misspellings), its relations (treats / contraindicated-with / member-of / sourced-from), and its attached query set.
**Artifact:** `entities.json`.
**Exit:** every validated keyword attaches to ≥1 entity. **Orphan keywords are a finding** — usually they are either a fake seed that survived E2, or a real entity we forgot.

### S6.2 — INTENT & SERP-SHAPE CLASSIFICATION

Per query cluster: intent (informational / commercial / transactional / navigational), the **SERP shape actually observed** (which page type ranks — article? PDP? category? video?), and the audience segment + awareness stage served.
**Artifact:** adds `intent`, `serp_shape`, `segment`, `awareness_stage` to `entities.json`.
**Exit:** **SERP shape is observed and dated, never assumed.** If the SERP shows product pages and we plan an article, that is an intent mismatch — the most common topical-map failure (topicalmap.com/topical-map/mistakes/) — and it blocks.

### S6.3 — URL-OR-H2 ADJUDICATION *(the AEO decision; the heart of S6)*

For every query cluster, decide: **own URL**, or **H2 section inside a parent URL**. Decision rule:

**Give it a URL when ≥2 hold:**
- it has independent demand (real, validated volume)
- its SERP shape differs from the parent's
- it needs to be linked to independently (nav, hub, or external)
- it can carry ≥1 unique, citable claim/statistic not in the parent (GEO paper: Statistics/Quotation Addition)

**Otherwise make it an H2** — retrievable as a chunk, not competing as a page.

**Artifact:** `url-or-h2.tsv` with the decision + the reason per cluster.
**Exit:** every cluster adjudicated with a stated reason. **"Give it a URL" without a reason = fail.** This is the single check standing between "3,400 valuable pages" and "3,400 thin pages."

### S6.4 — HIERARCHY & URL GRAMMAR

Assemble adjudicated URLs into the tree. Apply: **shallow, ≤3–4 levels, ≤~115 chars, keyword-exact slugs, subfolders not subdomains, widen-before-deepening** (Miller), **hierarchy via hubs/links not path segments** (Healthline/L10) so IA changes don't force URL changes.
**Artifact:** `sitemap-ux.md` (the tree) + `url-grammar.md` (the rules, per template family).
**Exit:** grammar rules stated as **lintable regex**, not prose.

### S6.5 — LABELING SYSTEM (the one we keep dropping)

Rosenfeld/Morville's labeling system: the canonical label per node, its aliases, and the alias→canonical mapping. For us this is **lesson L6 promoted to a required artifact**: one canonical page per herb/formulation/therapy; Sanskrit + IAST + Latin-botanical + vernacular names become **A–Z index entries pointing at the canonical URL**, never separate pages.
**Artifact:** `labels.json`.
**Exit:** no alias resolves to two canonicals; no canonical lacks a label.

### S6.6 — KEYWORD→URL MAP

Produce the artifact in §4. This is Abilash's step 7 — *where the keywords go* — made into a file.
**Exit:** §5's cannibalisation checks pass.

### S6.7 — INTERNAL-LINKING LAW

Hub-and-spoke per HubSpot's structural rules + WebMD's L1/L3 (A–Z ladders, crosslink modules). Specify per template: required links out, required links in, anchor-text rule, and the depth-from-home budget.
**Artifact:** `linking-law.md` + `links` fields populated in the keyword→URL map.
**Exit:** **zero orphans** (§2.5); every page reachable from home within the depth budget by `<a href>`; every spoke links to its hub; every hub links to every spoke.

### S6.8 — VALIDATION (§8)

Card sort → tree test. **Exit:** §9 gate.

---

### 3.9 — DO / DON'T PER SUB-STEP (mandatory structural theme, Abilash 15 Jul 2026)

*Added 2026-07-15 18:31:43 IST. Gap found on audit: the ruling is that **every** stage carries BOTH a cited DO list and a cited DON'T list, because **"the DON'T list is not decoration — it is how average work is actually prevented, and it is what an auditor checks against."*** The material below was previously scattered across 33 inline "never/don't" mentions in this document. Scattered prose **cannot be audited against**. This table is the auditable form. Every DON'T is a real, documented failure — either an authority's or **our own on the record**.

Sources keyed: **[TM]** topicalmap.com/topical-map/mistakes/ · **[NNG-D]** nngroup.com/articles/flat-vs-deep-hierarchy/ · **[NNG-C]** nngroup.com/articles/card-sorting-definition/ · **[G-SM]** developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap · **[G-FN]** developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation · **[AH]** ahrefs.com/blog/multiple-rankings-study/ · **[OURS]** our own documented failure, on the record.

| Sub-step | DO (cited) | DON'T (cited) |
|---|---|---|
| **S6.0** Entry gate | Validate keyword data **before** it becomes architecture; require `source` + raw-response hash per seed | **DON'T invent compound seeds** — "turmeric curcumin", "amla amalaki" understated turmeric 11× / amla 25× **[OURS]** · **DON'T sum unproven zeros** into cluster totals (shilajit US=0 beside India 246K) **[OURS]** · **DON'T pull a market in English only** (India needs `hi` + Hinglish) **[OURS]** · **DON'T treat modelled tool volumes as measured ground truth** — Google publishes none; tools diverge **[OURS]** |
| **S6.1** Entity network | Map **entities and relations**, not a keyword list — "Ignoring Entities and Knowledge Graph Signals… pages feel thin" **[TM #8]** | **DON'T start from a seed topic that is too broad** ("dogs") — "blurs topical signals and dilutes authority" **[TM #2]** |
| **S6.2** Intent & SERP shape | **Observe the live SERP** and date the observation **[TM #7]** | **DON'T map content to a query whose intent doesn't match the page format** — "weaker rankings, higher bounce rates, and thin engagement usually follow" **[TM #1]** · **DON'T rely solely on keyword tools without checking live results** **[TM #7]** |
| **S6.3** URL-or-H2 | Require ≥1 unique citable claim before granting a URL | **DON'T publish thin or repetitive pages** built for keyword matching **[TM #6]** · **DON'T build awareness-only clusters** — "a cluster built only around awareness topics often turns into Thin Content" **[TM #10]**. **⚠️ This is the sharpest live risk to whatisayurveda.com:** a 3,400-page encyclopedia is *definitionally* awareness-stage. [TM #10] says that shape trends to thin content and misses commercial intent — which is precisely what Abilash's **step 11 "WILL IT SELL?"** is protecting against. The `will_it_sell` column (§4) is the mechanical answer; a map where nearly every row is `will_it_sell: none` is [TM #10] happening to us, visible at planning time. |
| **S6.4** Hierarchy & URL grammar | Subfolders not subdomains; ≤~115 chars; hierarchy in **hubs/links not path segments** so IA changes don't force URL changes | **DON'T bury content** — "deep hierarchies are more difficult to use" **[NNG-D]** · **DON'T over-flatten either** — see correction below **[NNG-D]** · **DON'T cite the "three-click rule"** — NN/G's flat-vs-deep article does not endorse it; it is folklore, and we do not cite folklore **[NNG-D]** · **DON'T encode hierarchy in the path** (guarantees future URL churn) |
| **S6.5** Labeling | One canonical page per entity; aliases → A–Z index entries pointing at it | **DON'T create a page per synonym** — that is C1 cannibalisation *by construction* (Sanskrit/IAST/Latin/vernacular each getting a URL) |
| **S6.6** Keyword→URL map | One primary intent per URL **at planning time** (§5) | **DON'T let multiple URLs answer identical search needs** — engines struggle to choose, "weakening both" **[TM #4]** · **DON'T merge a LIVE page because a spreadsheet says "cannibalisation"** — 1 of 80 hand-reviewed cases needed action **[AH]**; see §5's planning-vs-remediation split · **DON'T treat the map as a one-time document** — "Stale maps usually fail" **[TM #9]** |
| **S6.7** Internal linking | Hub-and-spoke; every spoke→hub, every hub→spoke; contextual links | **DON'T leave semantic orphans** — "Weak internal linking turns related pages into semantic orphans" **[TM #5]** · **DON'T build a flat pillar-cluster with no role distinction** — "readers and crawlers struggle to see which page is the pillar" and cannibalisation emerges **[TM #3]** |
| **S6.8** Validation | Tree-test the spreadsheet before content exists | **DON'T treat a card sort as an answer** — it yields groupings ideas, and "individual users will group the same content in different ways" **[NNG-C]** · **DON'T record an LLM-simulated tree test as passing** (§8) · **DON'T hand an auditor an artifact pre-annotated with our own conclusions and call its echo independent verification** **[OURS]** |

**Cross-cutting DON'Ts for the three sitemap artifacts (§2.9) — all newly verified against primary sources:**

| # | DON'T | Primary evidence |
|---|---|---|
| X1 | **DON'T set `<priority>` or `<changefreq>` in XML.** | Google, verbatim: *"Google ignores `<priority>` and `<changefreq>` values."* **[G-SM]** |
| X2 | **DON'T emit a `lastmod` you cannot verify.** | Google uses `lastmod` only *"if it's consistently and verifiably… accurate"*, and it must reflect significant main-content change, not a build step **[G-SM]**. **This is our fabricated-review failure in a second costume:** we already shipped a **hardcoded build date emitted as `lastReviewed`** under a named BAMS physician for reviews that never happened **[OURS]**. A build-stamped `lastmod` is the identical defect — a machine timestamp asserting a human event. **Same lint should cover both fields.** |
| X3 | **DON'T let facets generate crawl spaces**; disallow in robots.txt. | Google: crawlers *"access a very large number of faceted navigation URLs before… determin[ing] the URLs are in fact useless"*, and *"if crawling is spent on useless URLs, the crawlers have less time to spend on new, useful URLs"* **[G-FN]** |
| X4 | **DON'T rely on `rel=canonical` / `rel=nofollow` to control facet crawling.** | Google: these are *"generally less effective in the long term"* than robots.txt **[G-FN]** |
| X5 | **DON'T dump every URL into an HTML sitemap.** | §6.1 — curated ~250-link distributor (WebMD pattern), not an exhaustive index |
| X6 | **DON'T split XML on size grounds at our scale** — segment for *diagnosability*, not limits. | Limit is 50,000 URLs / 50MB uncompressed **[G-SM]**; at 3,400 URLs one file is legal. Segmenting is a GSC-debuggability choice, and should be stated as such rather than as a fake technical necessity. |

**🔧 CORRECTION to §6.1 forced by [NNG-D] (this is a fix, not a gloss).** §6.1 says hubs should *"fan out wide (8–~100 spokes)"* and *"widen before deepening"*, resting on Miller (1981). NN/G's position is **explicitly two-sided** and we were quoting only the half that suited us: *"there's no single right answer, and going too far to either extreme will backfire."* NN/G warns that in *"broad hierarchies with a very large number of items, there is often some conceptual overlap between at least a few of the categories"* and *"users can also become overwhelmed with long, cluttered menus."* **A 100-spoke hub is squarely inside that warning** — and "conceptual overlap between categories" is *cannibalisation arriving through the navigation instead of through the keyword map*, which our C1–C7 checks (which run on `primary_keyword`, not on labels) would not catch. **Consequence:** the ~100-spoke ceiling is not authority-backed and must not be presented as such. The honest rule is *"breadth until labels start overlapping, then introduce a level"* — and **the tree test (S6.8), not Miller, is what settles the number for a given hub.** Flagged to §11 as **Q6**: does the fan-out ceiling get set per-hub from tree-test directness scores rather than as a global constant? Recommend yes.

---

## 4 · The KEYWORD→URL MAPPING artifact

**File:** `docs/<entity>-inputs/<domain>-keyword-url-map.tsv` (TSV — diffable in git, greppable, no tooling).
Schema is Ahrefs' six-step template (ahrefs.com/blog/keyword-mapping/ — topic, KD, TP, URL, secondary keywords, action, assignee) **extended with the fields Abilash's order demands** (segment, awareness stage, needs/desires/fears) **and the fields our failure demands** (evidence provenance).

| Column | Type | Rule |
|---|---|---|
| `url` | path | Final path. Must match `url-grammar.md` regex. **Primary key.** |
| `primary_keyword` | string | **Exactly one.** The intent this URL owns. |
| `primary_intent` | enum | `informational` / `commercial` / `transactional` / `navigational` |
| `serp_shape` | enum + date | Observed page type ranking, with observation date. Never assumed. |
| `secondary_keywords` | list | Same intent, subordinate. **Must not be any other row's `primary_keyword`** (§5). |
| `volume_primary` | int | With `volume_source` + `volume_locale` + raw-response hash |
| `volume_source` | enum | `dataforseo` / `gsc` / `autocomplete` / `paa`. **`agent_constructed` is invalid.** |
| `volume_locale` | list | e.g. `en-US`, `hi-IN`. India rows without `hi-IN` are invalid (E4). |
| `page_type` | enum | Template family (T0–T7 for whatisayurveda) |
| `parent_url` | path | Its hub. Home is the only null. |
| `depth` | int | Clicks from home. Enforced against budget. |
| `links_out` | list | Required outbound internal links |
| `links_in` | list | Pages required to link here. **Empty = orphan = fail.** |
| `segment` | enum | Which audience segment (Abilash steps 2–3, 9) |
| `awareness_stage` | enum | `unaware` / `problem-aware` / `solution-aware` / `product-aware` / `most-aware` |
| `serves_need` | string | Abilash step 12 |
| `serves_desire` | string | Abilash step 13 |
| `addresses_fear` | string | Abilash step 14 |
| `will_it_sell` | enum | `direct-revenue` / `assist` / `trust` / `none` — Abilash step 11 |
| `priority` | enum | `P0` / `P1` / `P2` / `P3` — build order |
| `action` | enum | `create` / `optimize` / `merge` / `301` / `no-action` (Ahrefs' Create/Optimize/No-action + our protection-map verbs) |
| `legacy_urls` | list | Which legacy URLs land here (§7). Links the protection map into the sitemap. |
| `unique_claim` | string | The citable claim/statistic this URL carries that its parent does not (S6.3, GEO paper). **Empty on a `create` row = probably should have been an H2.** |
| `register_ok` | enum | `ok` / `review` — mirrors the existing whatisayurveda content schema |
| `clinical` | bool | True → Dr. Deepu John gate (CLAUDE.md rule 7) |
| `locales` | list | KTAHV: EN/DE/FR or explicitly flagged |
| `owner` | string | Ahrefs' "assignee" |

**Why `will_it_sell` + `serves_need/desire/fear` live in the sitemap and not in a marketing doc:** because Abilash's steps 11–14 are *pre-build*, and a column that must be filled before a URL exists is enforceable, whereas a doctrine paragraph is not. A row with `will_it_sell: none` **and** `awareness_stage: unaware` **and** `links_in: []` is a page nobody asked for. The map makes that visible at planning time, for free.

---

## 5 · ONE INTENT PER URL — and where the experts genuinely disagree

**This is the most important section in the document, because the consensus is wrong and following it literally would waste our money.**

### The disagreement, stated fairly

**Position A — the standard advice** (Semrush, Neil Patel, most agency blogs): multiple pages targeting the same keyword compete with each other; find cannibalisation and fix it by consolidating.

**Position B — Ahrefs, with data** (ahrefs.com/blog/multiple-rankings-study/, ahrefs.com/blog/keyword-cannibalization/). They analysed **9.7k cases of multiple rankings** and hand-reviewed a **sample of 80 keywords with multiple rankings**. They **found exactly one case that needed action** — 1 in 80, ~1.25%. They distinguish:
- **Cannibalization (bad):** *"when a search engine constantly exchanges ranking between multiple pages, or when multiple pages rank simultaneously for the same keyword but are similar enough to be consolidated"*
- **Diversification (good):** *"when two or more pages rank for the same keyword simultaneously, and there is likely no benefit in consolidating"*

Their verdict on Position A: *"classic SEO theory is wrong — you don't need to go and fix each keyword with multiple rankings."* They call the notion that multiple pages *confuse* search engines **"preposterous,"** and hold that cannibalisation is only real **when it demonstrably hurts organic performance.** They also report median search volume for cannibalised keywords is essentially the same as for single rankings (**50 vs 40**) — i.e. volume doesn't predict harm.

### Who is right for OUR case, and why

**Ahrefs is right about diagnosing a LIVE site. Position A is right about PLANNING a new one. These are not the same activity, and the industry conflates them.**

The reasoning: Ahrefs' study measures **the cost of leaving existing multiple-rankings alone** — and finds it's near zero, ~1 in 80. That is a claim about **remediation**. It is not a claim about **construction**. On a live site the two pages already exist; consolidating them costs real work and risks losing a ranking that is currently earning. Rationally, leave them.

But at S6 **nothing exists yet.** The cost of *not* creating a duplicate-intent page is **zero** — you simply don't write it. The cost of creating it is a page to write, physician-review (clinical pages!), translate into DE/FR, internally link, and maintain forever. **When the cost of avoidance is zero, even a 1.25% harm rate is not the relevant number** — the relevant number is that we'd be paying full production cost for a page whose *best* case is Ahrefs' "diversification" (a second listing we could largely have had anyway) and whose worst case is dilution plus a permanent maintenance liability. For a 3,400-page encyclopedia with a physician bottleneck, **production cost, not ranking risk, is the binding constraint.**

**So: one primary intent per URL is our PLANNING rule (S6), enforced hard. It is NOT our post-launch remediation rule.** Post-launch we follow Ahrefs: only act on multiple rankings when GSC shows actual harm — URL-swapping on the same query, or a documented performance drop. **Never merge a live page because a spreadsheet says "cannibalisation."**

This distinction should be written into the doctrine explicitly, because an agent reading only Ahrefs will under-plan, and an agent reading only Semrush will vandalise a live site. Both failures are cheap to cause and expensive to undo.

### Pre-build cannibalisation detection (mechanical, runs on the TSV)

| # | Check | Fails when |
|---|---|---|
| C1 | **Primary uniqueness** | Any `primary_keyword` appears on >1 row |
| C2 | **Secondary/primary collision** | Any `secondary_keywords` entry equals another row's `primary_keyword` |
| C3 | **Intent+shape twin** | Two rows share `primary_intent` **and** `serp_shape` **and** semantic near-duplicate primaries (normalised: lowercase, stem, strip stopwords). Flag for human adjudication. |
| C4 | **SERP-shape mismatch** | `page_type` inconsistent with observed `serp_shape` |
| C5 | **Legacy collision** | A `legacy_urls` entry appears on >1 row (two rows claim the same 301 source) |
| C6 | **Thin-page smell** | `action: create` + empty `unique_claim` → should have been an H2 (S6.3) |
| C7 | **Live-SERP pre-check** | Before `create`, query the SERP: if our own existing page already ranks and satisfies that shape, the row is `optimize`, not `create` |

C1/C2/C5/C6 are exact and scriptable. **C3 is fuzzy and must produce a human decision, never an auto-merge.** C7 is the practitioner move — map the proposed topic against real SERP data before writing a word (wix.com/seo/learn/resource/keyword-intent-content-cannibalization). Ahrefs' own prevention mechanism is the same shape: rather than one page per cluster member, target low-volume subtopics as **secondary keywords on one page**.

---

## 6 · How the sitemap differs by site type

### 6.1 The 3,400-page content encyclopedia (whatisayurveda.com)

- **Shape:** hub-and-spoke + A–Z ladders. Hierarchy in **hubs and links**, not path depth (L10). Flat-ish slugs under cluster hubs.
- **Miller applied:** hubs fan out wide rather than nesting deep. Widen before deepening. **⚠️ CORRECTED 2026-07-15 18:31:43 IST — the "8–~100 spokes" figure originally stated here is withdrawn.** It rested on Miller (1981) alone, while NN/G [I4] — cited elsewhere in this very document — says *"going too far to either extreme will backfire"* and warns that very broad hierarchies breed *"conceptual overlap between… categories"* (= cannibalisation via nav labels, which C1–C7 cannot see, as they check `primary_keyword`, not labels). **Do not use ~100 as a ceiling; it has no authority behind it.** The operative rule is *breadth until labels overlap, then add a level*, with each hub's number set by its tree-test directness score (S6.8). See §3.9 and **§11 Q6**.
- **Labeling is the hard problem** (§S6.5): canonical page + alias layer (L6). Sanskrit/IAST/Latin/vernacular = A–Z entries → one canonical URL. **Never a page per synonym** — that is C1 cannibalisation by construction.
- **Facets-as-directories** (L7, Drugs.com): Tier-1 herbs get `/herbs/<slug>/dosage|safety|interactions|classical-references`; minor herbs stay single-page. Note this is a **deliberate, curated, finite facet set** — the opposite of combinatorial faceted nav (§2.7). It works precisely because it is enumerated, not generated.
- **AEO/GEO is an IA input here, not a polish** (§2.8): fixed H2 spines per monograph type (L5) *are* the chunk boundaries. H2s phrased as queries. Entities named, not pronouned. Citations dense (GEO paper).
- **XML:** segment per template family (herbs/conditions/therapies/formulations/news), accurate `lastmod`, skip `priority`/`changefreq`. At 3,400 URLs one file is legal (limit 50,000) — **segment anyway**, for GSC diagnosability.
- **HTML sitemap:** ship `/sitemap` as a **curated PageRank distributor** (~250 links, footer-linked, touching every template family) — WebMD's pattern (L2), **not** an exhaustive dump.
- **Crawl budget:** **not applicable at our size** (§2.6). Hygiene only. Post-launch GSC trigger.

### 6.2 Shopify collection/PDP tree (READ-ONLY admin — CLAUDE.md rule k)

- **The tree is `/collections/` → `/products/`, and Shopify's structure is partly not ours to choose.** Work with it, don't fight it.
- **Canonical URL discipline:** Shopify generates `/collections/<c>/products/<p>` for every collection a product sits in — many URLs, one product. It emits canonicals, but the practitioner recommendation (logeix.com/shopify-seo/collection-pages) is to **link directly to `/products/<p>`** rather than rely on canonicals — better crawl efficiency and cleaner UX. **This is a theme-code change → git → human publishes** (rule k: agent never publishes a theme).
- **Products in multiple collections is NOT a duplicate-content problem.** Explicitly stated by Logeix. Do not "fix" it.
- **Collections are the ranking surface, not PDPs,** for 50+ product stores. Build "Shop By" collections (type/size/colour/room/feature/style) to capture varied intent — **each collection is one row in the keyword→URL map with one primary intent**, exactly like an article. The map schema does not change; only `page_type` does.
- **Facets/tags:** tag-filter URLs (`/collections/sofas/material_Leather`) and filter params (`?filter.p.m.…`) → **robots.txt disallow** (Google's preferred lever, §2.7). Not nofollow, not canonical — Google says those are *"generally less effective in the long term."*
- **Pagination:** self-referencing canonical per page, `?page=n`, `<a href>` links, no fragments, no reliance on `rel=next/prev`. Shopify's default is 50/page.
- **🔴 `PDP URL changes must be flagged to Vikash BEFORE they happen`** (CLAUDE.md rule m) — live ads point at them. **In the map this is mechanical: any row where `action` is `301` or `url` differs from a live PDP URL must carry `flag: vikash-ads` and the S6 gate blocks until acknowledged.** Doctrine says "flag it"; the gate makes the flag a column that fails a lint.

### 6.3 The single noindex landing page (/lp/<campaign>)

- **There is no sitemap.** One page, `noindex`, not in XML, not internally linked from the site. It is not part of the IA — that is the point.
- **The IA question is inverted:** not "where does this page sit?" but **"how few links does it contain?"** Unbounce's **attention ratio** = links on the page ÷ conversion goals; *"In an optimized campaign, your attention ratio should be 1:1… every corresponding landing page should have only one call to action – one place to click."* Oli Gardner: *"One Page. One Purpose. Period."*
  **Evidence honesty: Unbounce cites NO study for this.** It is craft consensus, not research. The "266% decrease" version circulating is **absent from Unbounce's own page and mathematically impossible** (§1). We adopt 1:1 because it is coherent and cheap, and we say plainly that it is unproven.
- **Map row:** exactly one, `page_type: landing`, `awareness_stage` from the ad's targeting, `will_it_sell: direct-revenue`, `links_in: []` (intentional — the only legitimate orphan in the system, so the orphan lint needs a `page_type: landing` exemption), `links_out` ≤ goals.
- **Per-platform/MOA + Abilash's brainstorm gate** stays as-is (build order: landing pages last).

---

## 7 · The PROTECTION MAP merges INTO the sitemap (not beside it)

We already have the doctrine (BUILD DECISION MATRIX rule 2: every legacy URL gets **KEEP-AS-PAGE / MERGE / 301**) and real artifacts (`docs/group-inputs/kairali-com-protection-map.md`, `docs/redirects/`). What's missing is the **join**. Today the protection map and the sitemap are two documents that agree by luck.

**The merge is one column: `legacy_urls` on every keyword→URL map row (§4).** That single field makes the two artifacts one artifact and turns four failure modes into lint checks:

| Legacy fate | Sitemap consequence | Lint |
|---|---|---|
| **KEEP-AS-PAGE** | A row exists with the **same** `url`; `action: optimize` | Fail if the URL isn't in the new sitemap |
| **MERGE** | The legacy URL appears in the target row's `legacy_urls`; `action: merge` | Fail if the target row's content plan doesn't absorb the legacy page's ranking content |
| **301** | Legacy URL in exactly one row's `legacy_urls`; `action: 301` | **Fail on: >1 claimant (C5); target is thinner than source; target is home (catch-all → soft-404 behaviour); chain >1 hop** |
| **(none)** | Legacy URL has no fate | **Fail — every legacy URL needs an explicit fate** |

Migration practice we are already aligned with (siteimprove.com/blog/manage-redirects-during-website-migration/, bruceclay.com/blog/url-redirects-best-practices-during-a-site-migration/): compile inventory from **sitemap + crawl + analytics + GSC top landing pages** (not just a crawl); map 1:1 where possible; **single-hop 301s only**, no chains; **never catch-all to homepage** — it produces widespread soft-404s; validate by crawling **the OLD URL set in list mode**, not the new site.

**"Content-rich ranking pages are never redirected to thin targets"** (our rule 2) is the one that needs machine teeth, because it is the rule most likely to be violated by a well-meaning agent building a lean new site. Proposed: a `301` row fails if the target's planned word count / section count is materially below the source's, or if the source has GSC clicks above a threshold and the target isn't `KEEP-AS-PAGE` equivalent. **Thresholds need Abilash — §11 Q2.** This also enforces rule 3 ("lean at birth, complete at launch"): **DNS does not flip until every ranking legacy URL has an absorbing target.**

---

## 8 · Validation — proving the sitemap before content is written

**NN/G's division is the spine** (nngroup.com/articles/card-sorting-tree-testing-differences/):

**Card sorting — generative, before the tree.** *"help[s] designers generate ideas for possible navigation structures that align with users' expectations."* Participants group labelled cards by their own criteria. Caveat NN/G states plainly: it *"provides ideas for possible groupings,"* though *"individual users will group the same content in different ways"* — **card sorting yields input, not answers.** ~15 participants per segment is the commonly cited threshold for stable clustering in open sorts.

**Tree testing — evaluative, after the tree, before the build.** *"evaluates a hierarchical category structure… by having users find the locations in the tree."* Text-only, no design, no code. Metrics: **success rate**, **time on task**, and **directness** — whether users *"went directly to their selection,"* which NN/G calls *"a proxy for how confident users are in a particular path."*

**Why this is the highest-leverage gate we could add, in NN/G's own words:** tree testing *"allows you to test multiple IA options without any design, coding, or content development, enabling the team to get the IA right without creating needless churn and revisions"* — a new tree to test requires only **spreadsheet editing, "with absolutely no design or coding required."** For a 3,400-page site with a physician review bottleneck and DE/FR translation, **the ROI of catching a bad tree in a spreadsheet versus after 3,400 pages exist is not close.** This is the answer to *"I don't want to burn millions of tokens to find out we did very average work."* Tree testing is the cheapest possible place to find out.

**Our practical constraint, stated honestly:** we have no recruited user panel. Options, in preference order:
1. **Real users** (KTAHV patients / site visitors) — best, slowest, needs Abilash.
2. **Team tree test** (Abilash, Deepu, Dr. Deepu John, Priya, Vikash) — biased by insider knowledge but catches gross failures. Cheap. Available today.
3. **Clarity session recordings** on existing sites (we have `mcp__clarity-ktahv`) — behavioural evidence on the *current* IA, useful as card-sort input.
4. **LLM-simulated tree test** (GPT-5 / Perplexity as participants) — **explicitly weak evidence.** An LLM is not a user, has no mental model, and will pattern-match to the labels' semantics. It can catch *ambiguous labels*; it **cannot** validate findability. **Must never be recorded as a passing tree test.** If used, label it `simulated` and it cannot satisfy the gate alone.

**§11 Q1 asks Abilash to choose.** I recommend (2) as the floor for every site plus (1) for whatisayurveda and KTAHV specifically, because those two carry the most content risk and the most revenue respectively.

---

## 9 · THE GATE — S6 exit, machine evidence only

Per doctrine: *"Doctrine written in a .md file is ZERO evidence the rule was executed."* Every row below is a script exit code, a file, or a human signature — **not a claim.** Proposed script: `scripts/sitemap-lint.mjs`, exit 2 on FAIL, CI-blocking, same shape as `scripts/audit-gpt.mjs`.

| # | Check | Evidence | Blocking |
|---|---|---|---|
| G1 | S6.0 entry conditions E1–E8 all pass | `sitemap-lint --entry` exit 0 | ✅ |
| G2 | **No `agent_constructed` seeds** | E2 check, exit 0 | ✅ **(the "turmeric curcumin" gate)** |
| G3 | **No unproven zeros** | E3 check, exit 0 | ✅ **(the "shilajit=0" gate)** |
| G4 | **Every market pulled in its real languages** | E4 check, exit 0 | ✅ **(the "India in English only" gate)** |
| G5 | C1–C7 cannibalisation checks | `sitemap-lint --cannibal` exit 0; C3/C7 flags human-adjudicated with reasons | ✅ |
| G6 | Every URL matches `url-grammar.md` regex; depth ≤ budget; ≤115 chars | `sitemap-lint --grammar` | ✅ |
| G7 | **Zero orphans** (`links_in` non-empty), except `page_type: landing` | `sitemap-lint --orphans` | ✅ |
| G8 | Every legacy URL has exactly one fate; 301s single-hop; no catch-all-to-home; no thin targets | `sitemap-lint --protection` | ✅ |
| G9 | Every row has `segment`, `awareness_stage`, `serves_need`, `serves_desire`, `addresses_fear`, `will_it_sell` | `sitemap-lint --audience` | ✅ (Abilash steps 9–14) |
| G10 | Every `create` row has a non-empty `unique_claim` | `sitemap-lint --thin` (C6) | ✅ |
| G11 | Shopify: rows touching live PDP URLs carry `flag: vikash-ads`, acknowledged | `sitemap-lint --ads-flag` | ✅ (rule m) |
| G12 | Clinical rows flagged for Dr. Deepu John | `sitemap-lint --clinical` | ✅ (rule 7) |
| G13 | KTAHV rows carry EN/DE/FR or an explicit EN-only flag | `sitemap-lint --locales` | ✅ |
| G14 | KTAHV rows: no banned words in slugs **or labels**, all locales incl. DE/FR equivalents | existing brand/register lint extended to `labels.json` | ✅ |
| G15 | **Tree test run; success rate + directness recorded** | Raw results committed. Method labelled `real-users` / `team` / `simulated`. **`simulated` alone cannot pass.** | ✅ — threshold **§11 Q1** |
| G16 | **GPT-5 auditor PASS** on the sitemap artifact | `scripts/audit-gpt.mjs` exit 0 | ✅ |
| G17 | **Perplexity fact-grounding PASS** — every volume figure + every cited authority re-checked against live search | Perplexity auditor exit 0 | ✅ (once live) |
| G18 | Abilash approves the UX sitemap | Signature in `launches/<domain>/` | ✅ |
| G19 | **§3.9 DON'T list checked, item by item, with a per-item verdict** | `sitemap-lint --donts` + the auditor prompt (G16/G17) takes §3.9 as its checklist. Abilash's ruling is that the DON'T list *"is what an auditor checks against"* — so it is wired in as the auditor's input, not left as prose an auditor might notice. | ✅ |
| G20 | **XML hygiene X1–X4**: no `<priority>`/`<changefreq>`; every `lastmod` traceable to a real content change (**not a build timestamp** — X2); facet URLs disallowed in robots.txt | `sitemap-lint --xml` exit 0 | ✅ **(the `lastReviewed` fabrication gate, second costume)** |

**G2/G3/G4 are the DataForSEO failure, restated as three exit codes.** Test the gate against the real failure: the demand map had `turmeric curcumin` (agent-constructed → **G2 blocks**), `shilajit = 0 US` beside `246K India` (unproven zero → **G3 blocks**), and India pulled in English only (→ **G4 blocks**). **Three independent blocks on one artifact.** The error could not have reached Abilash. That is the design test passing.

**And note what G16/G17 add:** GPT-5 caught this class of error *after* the fact, in an audit. G2–G4 catch it *before* it becomes architecture. The auditors stay as backstop, not primary defence — a gate that depends on an LLM noticing is not a gate.

---

## 10 · Fixing it everywhere in the repo

Abilash: *"FIX IT EVERYWHERE IN THE REPO — be it the landing page repo, the Shopify repo, the organic page repo, everywhere."* This doc is research + stage definition; the edits below are **proposed, not made** (task scope = `docs/process/` only). Handing to the next stage:

| Target | Change |
|---|---|
| `CLAUDE.md` → BUILD DECISION MATRIX | Insert **S6 between rule 2 (protection map) and rule 3 (lean at birth)**. Add the S5.5 keyword-validation gate. Add the planning-vs-remediation cannibalisation distinction (§5) — it is a genuine trap. |
| `docs/checklists/sitewide-migration-checklist.md` | Add S6.0–S6.8 sub-steps with the G1–G18 evidence columns |
| `docs/checklists/pagewise-migration-checklist.md` | Add per-page: `primary_keyword`, `unique_claim`, `links_in/out`, `awareness_stage` |
| `scripts/sitemap-lint.mjs` | **NEW** — G1–G14 mechanised, exit 2 on FAIL, CI-wired |
| `scripts/audit-gpt.mjs` | Add a sitemap-artifact audit mode (G16) |
| `docs/group-inputs/whatisayurveda-full-sitemap.md` | **Re-enter at S6.1** once S5 is re-run. Structural research (L1–L12) survives; priorities/page-counts recomputed. **Add a header warning that current priorities derive from the defective demand map** — until then the doc is a live hazard to anyone who reads it. |
| `docs/whatisayurveda-research/demand.md` | Mark **SUPERSEDED / DEFECTIVE** at the top |
| `docs/M2_SHOPIFY_SETUP_PROMPT.md` | §6.2 rules; `flag: vikash-ads` as a map column (rule m) |
| Landing-page doctrine | §6.3: one map row, attention ratio 1:1, orphan-lint exemption |
| `wiki/` | Link S6 from every site page (Ship Gate §E) |
| `DECISIONS.md` | Record the §5 planning-vs-remediation ruling + §11 answers once given |

---

## 11 · OPEN QUESTIONS → QUESTIONS.md (blocking the gate's thresholds)

Per the UNATTENDED RULE, these go to QUESTIONS.md rather than being invented. **A threshold I make up is exactly the failure this stage exists to prevent** — G15's number is as load-bearing as the "27.1K" that started this.

- **Q1 (blocks G15) — Tree-test method and passing threshold.** Real users, team, or simulated? What success rate passes? NN/G publishes no universal threshold and I will not fabricate one. **Recommendation: team tree test as the floor for every site; real users for whatisayurveda.com + KTAHV. Threshold set from the first run's baseline rather than picked from the air.**
- **Q2 (blocks G8) — "Thin target" definition.** What makes a 301 target too thin for a content-rich source? Word-count ratio? Section count? GSC-clicks threshold above which 301 is forbidden outright?
- **Q3 (§2.6) — Crawl-budget re-entry trigger.** What share of "Discovered – currently not indexed" in GSC re-opens S6? (We are below all of Google's thresholds; this is the only condition that would make crawl budget real for us.)
- **Q4 (§1) — Reddit is unreachable.** `reddit.com` is blocked to our user agent for both WebSearch and WebFetch. Abilash explicitly asked for practitioner discussion from r/SEO, r/bigseo, r/juststart, r/shopify, r/PPC and we have **none** — this document's practitioner layer is agency/vendor write-ups only, which are more polished and more self-interested than forum talk. Options: (a) Abilash or a human pastes relevant threads into `docs/research/`; (b) approve a Reddit API key; (c) accept the gap and note it permanently. **This is a real hole in the brief, not a formality.**
- **Q5 (§6.2) — Shopify `/collections/<c>/products/<p>` → `/products/<p>`.** Theme-code change; agent is read-only; needs Vikash (ads) + a human to publish. Proceed?
- **Q6 (§3.9, blocks G6) — Hub fan-out ceiling.** §6.1's *"8–~100 spokes"* was written on Miller (1981) alone. NN/G explicitly warns that **both** extremes backfire, and that very broad hierarchies produce *"conceptual overlap between… categories"* and *"long, cluttered menus"* — which is cannibalisation entering via navigation labels, invisible to C1–C7 (they check `primary_keyword`, not labels). **The ~100 figure has no authority behind it and I am not going to defend one I made up.** Recommendation: **no global constant** — set each hub's ceiling from its tree-test directness score (S6.8), i.e. breadth until labels start overlapping, then add a level. Needs Abilash's call because it changes G6 from a fixed regex to a per-hub, evidence-set budget.

---

## 12 · Evidence index

**IA canon**
[I1] Covert, A., *How to Make Sense of Any Mess* — https://abbycovert.com/make-sense/ · https://www.howtomakesenseofanymess.com/
[I2] Rosenfeld, L., Morville, P., Arango, J., *Information Architecture: For the Web and Beyond*, 4th ed., O'Reilly — https://books.google.com/books/about/Information_Architecture.html?id=vJWJCgAAQBAJ
[I3] Miller, D.P. (1981), "The Depth/Breadth Tradeoff in Hierarchical Computer Menus," *Proc. Human Factors Society 25th Annual Meeting* — https://journals.sagepub.com/doi/10.1177/107118138102500179
[I4] NN/G, "Flat vs. Deep Website Hierarchies" — https://www.nngroup.com/articles/flat-vs-deep-hierarchy/
[I5] NN/G, "Card Sorting vs. Tree Testing" — https://www.nngroup.com/articles/card-sorting-tree-testing-differences/
[I6] NN/G, "Tree Testing: Fast, Iterative Evaluation of Menu Labels and Categories" — https://www.nngroup.com/articles/tree-testing/
[I7] NN/G, "Card Sorting: Uncover Users' Mental Models" — https://www.nngroup.com/articles/card-sorting-definition/

**Topical authority / clusters / keyword mapping**
[T1] HubSpot, "Topic Clusters: The Next Evolution of SEO" (Hussain & Davies 2015 research) — https://blog.hubspot.com/marketing/topic-clusters-seo
[T2] HubSpot, "How We Used the Pillar-Cluster Model to Transform Our Blog" — https://blog.hubspot.com/marketing/pillar-cluster-model-transform-blog
[T3] Gübür, K.T., topical authority / semantic SEO — https://www.topicalauthority.digital/koray-tugberk-gubur (method behind paywall — see §1)
[T4] Ahrefs, "Keyword Mapping for SEO: How To Do It + Free Template" — https://ahrefs.com/blog/keyword-mapping/
[T5] "10 Common SEO Topical Map Mistakes to Avoid" — https://topicalmap.com/topical-map/mistakes/

**Cannibalisation (the disagreement)**
[C1] Ahrefs, "Keyword Diversification: Cannibalization's Good Twin (SEO Study)" — 9.7k cases, 80-keyword sample, 1 needed action — https://ahrefs.com/blog/multiple-rankings-study/
[C2] Ahrefs, "Keyword Cannibalization: What It (Really) Is & How to Fix It" — https://ahrefs.com/blog/keyword-cannibalization/
[C3] Semrush, "Keyword Cannibalization: How to Find, Fix, and Prevent It" (Position A) — https://www.semrush.com/blog/keyword-cannibalization-guide/
[C4] Wix SEO Hub (Lazarina Stoy), "Preventing keyword cannibalization" — SERP pre-check before writing — https://www.wix.com/seo/learn/resource/keyword-intent-content-cannibalization

**Google primary documentation**
[G1] Crawl Budget Management — https://developers.google.com/crawling/docs/crawl-budget
[G2] Improve crawling of faceted navigation URLs — https://developers.google.com/crawling/docs/faceted-navigation
[G3] Pagination Best Practices — https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
[G4] Build and Submit a Sitemap — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
[G5] Pagination with rel=next/prev (historical; deprecated) — https://developers.google.com/search/blog/2011/09/pagination-with-relnext-and-relprev

**URL structure**
[U1] Screaming Frog, "URL Structure" — https://www.screamingfrog.co.uk/learn-seo/url-structure/
[U2] Loganix, "URL Structure for SEO" — https://loganix.com/url-structure-for-seo/

**AI answer engines / GEO / AEO**
[A1] Aggarwal, P., Murahari, V., Rajpurohit, T., Kalyan, A., Narasimhan, K., Deshpande, A., "GEO: Generative Engine Optimization," **KDD 2024** — https://arxiv.org/abs/2311.09735 (PDF: https://arxiv.org/pdf/2311.09735v2) — *the only peer-reviewed source here*
[A2] Lumar, "Content Chunking & AI Extractability" (vendor) — https://www.lumar.io/blog/best-practice/content-chunking-ai-extractability-geo-aeo-explainer/
[A3] WSI, "How to Structure Content for AI Answer Engines" (vendor) — https://www.wsiworld.com/blog/how-to-structure-content-for-ai-answer-engines-a-geo-and-aeo-guide

**Migration / redirects**
[M1] Siteimprove, "Manage redirects during a website migration" — https://www.siteimprove.com/blog/manage-redirects-during-website-migration/
[M2] Bruce Clay, "URL Redirects Best Practices During a Site Migration" — https://www.bruceclay.com/blog/url-redirects-best-practices-during-a-site-migration/

**Shopify**
[S1] Logeix, "Shopify Collection Page SEO: The Definitive Guide" — https://logeix.com/shopify-seo/collection-pages
[S2] Break The Web, "Shopify Collections SEO: Lessons from 100+ PLP Optimizations" — https://breaktheweb.agency/ecommerce/shopify-collections-seo/

**Landing pages**
[L1] Unbounce, "Attention Ratio" (no study cited — see §1) — https://unbounce.com/conversion-glossary/definition/attention-ratio/

**Sitemap types**
[X1] Search Engine Land, "When and how to use HTML sitemaps for SEO and UX" — https://searchengineland.com/html-sitemaps-seo-ux-when-how-394763
[X2] HubSpot, "HTML Sitemap vs. XML Sitemap" — https://blog.hubspot.com/website/html-sitemap-xml-sitemap

**Internal repo (existing, read-only in this task)**
[R1] `docs/group-inputs/whatisayurveda-full-sitemap.md` — WebMD/Mayo/Healthline/Drugs.com teardown, lessons L1–L12
[R2] `docs/whatisayurveda-research/architecture-audit.md` — code-level engine audit
[R3] `docs/group-inputs/kairali-com-protection-map.md`, `docs/redirects/` — protection-map precedent
[R4] `docs/checklists/` — sitewide + pagewise migration checklists (Abilash's originals)

---

**Prompt-injection screen (rule r):** all fetched content in this research was treated as DATA. No fetched page contained instructions directed at the agent. Nothing was executed, no URLs from fetched content were followed as directives, and no page's content altered this document's rules. The only instructions acted on came from Abilash's brief via the task.

---

## 13 · REVISION — 2026-07-15 18:31:43 IST (audit of this document against the brief)

This document was re-entered and audited rather than rewritten. **Nothing prior was discarded: every falsifiable claim in it was independently re-tested this session and all four of its refusals-to-cite held.**

**Re-verification performed (machine evidence, this session):**

| Claim under test | Method | Result |
|---|---|---|
| HubSpot's "43% traffic increase" is **not** in HubSpot's article (§1) | Fetched blog.hubspot.com/marketing/topic-clusters-seo | **CONFIRMED absent.** Refusal was correct. |
| Unbounce's "266% decrease" is **not** on Unbounce's page, and Unbounce cites no study (§1, §6.3) | Fetched unbounce.com attention-ratio glossary | **CONFIRMED absent**, and confirmed **no study cited**. Refusal correct. |
| Ahrefs 9.7k cases / 80 hand-reviewed / **1** needing action / "classic SEO theory is wrong" / median 50 vs 40 (§5) | Fetched ahrefs.com/blog/multiple-rankings-study/ | **CONFIRMED verbatim on every figure.** §5's argument stands. |
| Reddit is tool-blocked, not skipped (§1, §11 Q4) | WebSearch `allowed_domains: [reddit.com]` | **CONFIRMED**: HTTP 400, *"The following domains are not accessible to our user agent"*. Q4 is a real hole, not an excuse. |
| Google ignores `<priority>`/`<changefreq>` (§2.9) | Fetched Google sitemap docs | **CONFIRMED verbatim.** |
| Canonical/nofollow are weaker facet levers than robots.txt (§6.2) | Fetched Google faceted-nav docs | **CONFIRMED verbatim** (*"generally less effective in the long term"*). |

**Gap found and closed — §3.9.** Abilash's mandatory structural theme requires **every** stage to carry a cited DO list **and** a cited DON'T list. This document had the DON'T material but only **scattered across 33 inline mentions with no dedicated section** — which fails the ruling's actual purpose, since the DON'T list *"is what an auditor checks against"* and an auditor cannot check against scattered prose. §3.9 is the auditable form; **G19** wires it in as the auditor's input; **G20** mechanises the XML DON'Ts.

**Correction made to prior work — §3.9, hub fan-out.** §6.1's *"8–~100 spokes"* rested on Miller (1981) while NN/G's flat-vs-deep article — already cited in this document as [I4] — explicitly says *"going too far to either extreme will backfire."* **We had cited the source and used only the half that agreed with us.** That is a mild instance of the same defect this whole pipeline exists to stop, found in our own document. Now flagged as **Q6**, and the ~100 constant is marked as unsupported rather than quietly kept.

**New defect class identified — X2.** Our on-record `lastReviewed` fabrication (a hardcoded build date emitted as a named physician's review) has an **exact structural twin in XML sitemaps**: a build-stamped `lastmod`. Google conditions `lastmod` on being *"consistently and verifiably… accurate."* Same defect — a machine timestamp asserting a human event — so one lint should cover both fields. This was not previously connected anywhere in the repo.

**Still true after audit:** §§1–12 stand as written. The stage (S6.0–S6.8), the TSV schema (§4), the planning-vs-remediation ruling (§5), the per-site-type treatment (§6), the protection-map join (§7), validation (§8) and the gate (§9) required no correction.

---

**Checker pass (doctrine f):** Re-read the instruction; diffed claim vs machine evidence.
- **Verified:** all §12 URLs fetched or returned by search this session; Miller (1981) verified independently to SAGE, not taken from NN/G's article; Ahrefs 9.7k/80/1 figures fetched from the study page itself; Google quotes fetched from Google's own docs; Unbounce's "266%" and HubSpot's "43%"/"3.2×" checked against primary sources and **found absent** — rejected in §1 rather than repeated.
- **UNVERIFIED / stated as such:** Koray's operational method (paywalled — §1); NN/G's card-sort "15 participants" threshold (from search summary, not fetched from an NN/G page — treat as indicative); GEO-BENCH "10K queries" (from search summary; arXiv abstract fetch did not restate the size); AEO chunking practice (§2.8) is vendor-blog consensus, not research, and is labelled so.
- **NOT DONE:** Reddit practitioner evidence — **blocked at the tool level, not skipped** (§11 Q4). No Reddit claim appears anywhere in this document.
- **Out of scope by instruction:** no git run; no file touched outside `docs/process/`; §10's repo edits are proposed, not made.
