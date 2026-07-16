# Practitioner Sequencing Research — What World-Class Builders Say the ORDER Is

**Status:** Research findings + recommended canonical stage order. Input to the pipeline rewrite; not itself the pipeline.
**Scope of this document:** research only. It does not modify the Build Decision Matrix or any site. That is the next stage.
**Commissioned by:** Abilash — "Go research online and see, when working with a world-class website, as for compliance etc., what the steps are… I'm sure there are GUIDES and RESEARCH PAPERS published by successful people."
**Created:** 2026-07-15 17:58:41 IST
**Author:** research subagent (Claude Opus 4.8)
**Updated:** 2026-07-15 18:34:00 IST — **gap-closure pass** by a second research subagent (Claude Opus 4.8). Pass 1's findings were **re-tested, not rewritten**: 1 gap closed (Zeldman → **[P]**), 3 gaps re-confirmed as real (Indig 404, CXL/SEL 403, Reddit), 1 source narrowed (Koray — no linear order in his own text), 1 source added (Animalz **[S]**), and 1 dead source retained as a caution (UpBuild **[D]**). See the **GAP-CLOSURE PASS** block in §0 and the refreshed checker pass in §9. Substantive conclusions of pass 1 are **unchanged** — the re-test strengthened them.

---

## 0. How to read this document (and how much to trust each line)

Abilash's standing ruling: *"I don't want to burn millions of tokens to find out we did very average work because you hallucinated."* This document is therefore written so that **every substantive claim carries its evidence tier**. The tier is not decoration — it tells you how hard you may lean on the claim.

| Tier | Meaning |
|---|---|
| **[P]** Primary-verified | I fetched the actual artefact (PDF/paper/official doc) and read the text. Quotes are verbatim from the source. |
| **[S]** Secondary-verified | I fetched the named source's own page and read its text. |
| **[R]** Search-report only | The claim came back in a search-engine summary; I could **not** open the primary. Treat as a lead, not a fact. |
| **[X]** Gap | I could not access the evidence at all. Named explicitly, never filled with invention. |

### Declared evidence gaps — READ THIS FIRST

Abilash explicitly asked for **Reddit practitioner discussion (r/SEO, r/bigseo, r/juststart, r/web_design)**. I could not obtain it:

- `WebSearch` with `allowed_domains: ["reddit.com"]` → `API Error 400: The following domains are not accessible to our user agent: ['reddit.com']`
- `WebFetch` on a reddit.com thread → `Claude Code is unable to fetch from www.reddit.com`
- Headless browser (Playwright) on reddit.com → **HTTP 403** behind a JS bot-detection challenge.

**I stopped there and did not attempt to bypass the bot-detection challenge.** Circumventing bot detection is out of bounds regardless of who benefits from the result.

**Therefore: this document contains ZERO Reddit quotes.** Any future document in this repo that presents "what r/SEO says" without a working, openable citation should be treated as fabricated and rejected at gate. Fabricating a plausible-sounding Reddit consensus is *precisely* the DataForSEO failure class this pipeline exists to prevent — inventing inputs that feel right and reporting them upward as fact. The honest gap is worth more than a convincing fake.

**How to close this gap (recommended, human or authorised action):** the Reddit public API / Pushshift-style archives, or a human paste of relevant threads into `docs/process/`. Until then, practitioner sentiment below is sourced from **named, attributable practitioners** (Solis, Indig, Halvorson, Covert, NN/g, Ahrefs, CXL, MECLABS, Lumar) rather than anonymous forum consensus. This is arguably a *stronger* evidence base than Reddit anyway — but it is not what was asked for, so it is flagged, not glossed.

Two further gaps:
- **Kevin Indig's keyword-research article** — the URL surfaced by search (`kevin-indig.com/a-better-approach-to-keyword-research-for-content-marketing/`) returned **404**. His sequence below is **[R]**, not verified from primary.
- **CXL's landing-page anatomy guide** and **Search Engine Land's migration guide** both returned **403** to our fetcher. Marked **[R]**.

---

### GAP-CLOSURE PASS — 2026-07-15, second research agent

A second agent re-ran the declared gaps rather than rewriting the document. **Result: 1 gap closed, 3 confirmed as real, 1 source downgraded, 1 source added, and 1 live failure reproduced in-session.** Every claim below was re-tested, not assumed.

| Gap from pass 1 | Re-test result | Tier change |
|---|---|---|
| **Zeldman wording unresolved** | ✅ **CLOSED.** Primary found and fetched: `zeldman.com/2008/05/06/content-precedes-design/`, 6 May 2008 → **"in the absence of content"**. Corroborated same-day by `marco.org`. Goodreads' *"in advance of"* is a **misquote**. | **[R] → [P]** (§2.12) |
| **Kevin Indig 404** | ❌ **CONFIRMED.** Re-fetched → **HTTP 404**. Wayback API queried → `"archived_snapshots": {}` (no snapshot exists). Pass 1 was accurate. | **[R] stands** |
| **CXL 403** | ❌ **CONFIRMED.** Wayback also blocked (`Claude Code is unable to fetch from web.archive.org`). No route available. | **[R] stands** |
| **Reddit inaccessible** | ❌ **CONFIRMED** on two further independent attempts (see below). | **[X] stands** |
| **Koray topical authority** | ⚠️ **DOWNGRADED.** His own site (`holisticseo.digital`) was fetched: it **does not state a linear sequence**; the framework is contextual, not ordered. **Do not cite Koray as an authority on ORDER** — only on topical-map *composition*. | **claim narrowed** |
| — | ➕ **ADDED:** Animalz, *Technical SEO for Content Marketers* — fetched, verbatim, agency-practitioner evidence that **hierarchy precedes content**. | **new [S]** (§2.13) |

**Reddit — re-confirmed, still [X].** Two further attempts this pass returned nothing usable: a general web search for r/SEO / r/bigseo sequencing threads returned **"No links found"**, and a keyword search returned only unrelated SEO-vendor blogs with zero Reddit URLs. **The bot-detection challenge was again not bypassed.** The document therefore still contains **zero Reddit quotes**, and the brief remains materially unmet on that axis. This is stated, not glossed.

#### ⚠️ A live reproduction of our own failure mode — caught during this very pass

This is the single most useful thing the gap-closure pass produced, and it belongs in the pipeline design.

Searching for keyword-research sequencing surfaced **UpBuild, "Keyword Research Should Be Done Before Building Your Site"** (`upbuild.io/blog/keyword-research-site-architecture/`) — a title that is *almost exactly Abilash's question*. The search engine returned a confident, fluent, **directly quotable** summary of its argument, including specific claims about reconfiguring development work and backward-engineering SEO after launch.

**The page does not exist.** Fetching it redirects to UpBuild's homepage — the article is gone. The search engine had summarised an index of dead content into prose that read exactly like a verified citation.

**Had this agent trusted the search summary, it would have written a plausible, well-formed, perfectly-argued paragraph citing a URL that 404s — attributing quotes to an article nobody can open.** That is not a hypothetical: it is the *same class* as our catalogued failures — *"WRITING A POLICY THAT DESCRIBES A PROCESS THAT DOES NOT EXIST"* and the invented DataForSEO seeds. The output would have been indistinguishable from good work at review time.

**Three rules this hands the pipeline, drawn from a real event rather than theory:**
1. **A search-engine summary is never a citation.** It is a lead. `[R]` tier exists precisely because search summaries are fluent about sources that are dead, paywalled, or hallucinated. Confidence and fluency in a summary carry **zero** information about whether the primary exists.
2. **The most dangerous source is the one that agrees with you.** UpBuild's *title* confirmed Abilash's thesis. That is exactly when verification pressure drops and exactly when it must not. Compare our own catalogued failure of handing an auditor an artefact **pre-annotated with our own conclusions** — confirmation is the moment to check harder, not to relax.
3. **Every citation in a Director-facing artefact must be fetch-verified at write time**, not search-verified. If it cannot be opened, it is `[R]` or it is cut. No exceptions, including for sources that say what we want to hear.

---

## 1. The headline answer to Abilash's question

**Abilash is substantially right, and the evidence supports him more strongly than he probably expected.** The convergent finding across every credible discipline — content strategy, information architecture, SEO, and conversion optimisation — is:

> **Audience and intent precede language. Language precedes architecture. Architecture precedes content. Content precedes design. Design precedes build. Nothing ships without evidence.**

The sitemap is the **hinge**. It is the artefact where audience knowledge and search demand become *durable, expensive-to-change URLs*. Everything cheap happens before it; everything expensive happens after it. Abilash's instinct that we "MISSED building a sitemap" identifies the single highest-leverage defect in our current process.

**Three corrections to his proposed order** are argued in §6 (pushback duty). In summary:
1. **"Understand the company" (his step 8) must move to the front (~step 1)** — every authority puts stakeholder/business alignment *before* audience work, not after the sitemap.
2. **"AEO first" cannot be literally first** — but the underlying instinct is right and is currently being implemented wrongly (as a post-build audit). It belongs as a *content-model input*.
3. **His order describes a greenfield build.** We mostly rebuild *ranked legacy domains*. That needs a Stage 0 that his list has no slot for.

---

## 2. What each named authority actually says the order is

### 2.1 Kristina Halvorson & Melissa Rach — *Content Strategy for the Web*, 2nd ed. **[P]**

I extracted the book's own table of contents from the publisher's sample PDF. The book's spine *is* an order:

```
REALITY     1 NOW  ·  2 PROBLEM  ·  3 SOLUTION
DISCOVERY   4 ALIGNMENT  ·  5 AUDIT  ·  6 ANALYSIS
STRATEGY    7 CORE  ·  8 CONTENT  ·  9 PEOPLE
SUCCESS     10 PERSUASION  ·  11 ADVOCACY  ·  12 HERO
```
Source (verbatim, pp. viii–ix): https://ptgmedia.pearsoncmg.com/images/9780321808301/samplepages/0321808304.pdf

Two findings that matter enormously for us:

**(a) ALIGNMENT (ch. 4) comes before AUDIT (ch. 5) and ANALYSIS (ch. 6).** Chapter 4's subtitle is *"Down with silos, up with people."* Understanding the organisation you are building for is **the first act of discovery**, not the eighth step. This directly contradicts Abilash's placement of "understand the company" at step 8.

**(b) Chapter 8 is titled "CONTENT — Substance and structure: the stuff they come for."** The book's own index proves the internal order of that chapter:

| Concept | Page (from index) |
|---|---|
| **Substance:** audience, identifying | 104–106 |
| **Substance:** messaging | 106–108 |
| **Substance:** topics/topic maps | 108–110 |
| **Substance:** purpose | 110–111 |
| **Substance:** voice and tone | 111–113 |
| **Substance:** prioritizing | 117 |
| **Structure:** (begins) | 118 |
| **Structure:** **sitemaps** | **123–124** |
| **Structure:** **wireframes** | **124–125** |
| **Structure:** page tables | 125–126 |

**Audience (104) → messaging (106) → topics (108) → THEN sitemap (123) → THEN wireframes (124).**

This is Abilash's order, published in 2012, by the person who created the discipline. The sitemap sits at page 123 of a chapter that starts at 102 — it is the *output* of audience and topic work, never the input.

### 2.2 Abby Covert — *How to Make Sense of Any Mess* **[S]**

Her seven steps, in her own order (https://abbycovert.com/make-sense/):

1. Identify the Mess
2. **State Your Intent**
3. **Face Reality**
4. Choose a Direction
5. **Measure the Distance**
6. **Play with Structure**
7. Prepare to Adjust

**Structure is step 6 of 7.** Intent (2) and Reality (3) precede it; "Measure the Distance" (5) — defining how you'll know if it worked — *also* precedes structure. Covert: *"the decisions we make about language and structure impact whether we deliver our intended message to our intended users."*

**What we should steal:** step 5. We currently define success metrics *after* building, if at all. Covert makes measurement a precondition of structure. This is the same rule Lumar states for migrations (§5) and it is the rule that would have caught the DataForSEO fiasco — you cannot "measure the distance" against numbers you invented.

### 2.3 Nielsen Norman Group **[S]**

- **"The IA comes first, the sitemap follows."** — *"IA is the foundation that defines the overall structure and organization of content. Once the IA is well established, sitemaps are created to visually represent it."* … *"The IA is an abstraction, while the sitemap is an artifact."*
  https://www.nngroup.com/articles/information-architecture-sitemaps/
- **Card sorting vs tree testing** — *"Card sorting works best as a discovery method, uncovering user mental models and suggesting potential ways to organize content. Tree testing is used to evaluate an existing or proposed navigation structure."* Card sorting is *"typically conducted early in the design process"*; tree tests are *"usually conducted on an existing or proposed navigation structure."*
  https://www.nngroup.com/articles/card-sorting-tree-testing-differences/

**What we should steal:** the generate/evaluate pair. **Card sort generates the sitemap; tree test validates it — both before a line of code.** This gives us a *machine-checkable pre-build gate on IA*, which we currently do not have at all. NN/g explicitly warns card sorting alone is insufficient: *"card sorting provides ideas for possible groupings"* and requires further judgement — so tree testing is not optional polish.

### 2.4 Ahrefs — *How to Structure Your Website Architecture for SEO* **[S]**

Their stated order (https://ahrefs.com/blog/website-structure/):
1. Start with the basic/foundational pages
2. **Sketch out a plan** — *"Visualizing your website page structure is important if you work with a team"*
3. **Apply keyword research** — *"Once you've sketched out the structure of your website, you're ready to start improving it using keyword research"*
4. Analyse competitor structures
5. Implement technical elements

**Note the disagreement:** Ahrefs puts a *sketch* before keyword research. Reconciled in §4.
**Note the gap:** I checked specifically — **the Ahrefs guide does not address URL changes or redirects at all.** It is a greenfield document. Do not use it as a migration source.

### 2.5 Kevin Indig **[R] — primary 404'd, treat as a lead**

Reported sequence: find all keywords needed to dominate a vertical → group them → select topics on **intent-offer fit** → **arrange topics in an architecture** → use competitors for inspiration → visualise the structure (e.g. Miro).

This is the **inverse** of Ahrefs: keywords *produce* the architecture rather than refine it. Also reported: a *problem-driven* keyword approach starting from customer problems and pain points, distinguishing **immediate intent** from **greater intent**.

**Because the primary 404'd, do not quote Indig in any client- or Director-facing artefact on this basis.** The claim is used here only as corroboration of a pattern already established by [P]/[S] sources.

### 2.6 CXL — conversion research → message hierarchy → layout **[R] — 403 on fetch**

Reported: research (quant = *what/where*, qual = *why*) → **build a messaging hierarchy from the problems and benefits mentioned most often in research** → *then* lay out the page. *"The message is what you say; the copy is how you say it."* Use the customer's **"sticky language"** — *"feeding your prospect's words right back to them so they see themselves on the page."*

This is Abilash's steps 9–14 (likes/dislikes, needs, desires, fears) expressed as an operational method — and it lands **before layout**.

### 2.7 MECLABS / MarketingExperiments — the Conversion Sequence Heuristic **[S]**

**C = 4m + 3v + 2(i−f) − 2a**
(m = motivation, v = value proposition, i = incentive, f = friction, a = anxiety)
https://marketingexperiments.com/conversion-marketing/the-meclabs-conversion-index

Weighting: **motivation 4× (heaviest), value proposition 3×, incentive/friction 2×, anxiety −2×.** Derived from testing *"more than 10,000 sales paths over the past 20 years"* **[R]**.

**This is the most rigorous single argument for Abilash's ordering that I found, and it is quantitative.** Read the formula as a statement about *when decisions get made*:

- **m (motivation, weight 4)** is a property of **the audience you chose and the intent you targeted**. It is decided at audience/keyword stage. **No amount of design, copy polish or CRO can raise it.** Put the wrong person in front of the page and the largest term in the equation is already lost.
- **v (value proposition, weight 3)** is decided at **message/content-model stage**.
- **i, f, a (weights 2, −2, −2)** are the only terms **design and build can move**.

So **7 of the 11 weighted points in the conversion equation are already fixed before design begins.** "Build first, audit after" can only ever optimise the 2s. This is, in one line, why our current process produces average work — and it is Abilash's point, with a coefficient attached.

**Note also `a` = anxiety.** Abilash's step 14 ("their FEARS") is not soft branding language — it is a **negatively-weighted term in a tested conversion model**. His instinct is formally correct.

### 2.8 Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande — *GEO: Generative Engine Optimization* **[P]**

Princeton / Georgia Tech / Allen Institute for AI / IIT Delhi. arXiv 2311.09735; presented at **KDD '24**, Barcelona. I extracted the full PDF text. This is the paper that coined "GEO" and it is the research paper Abilash asked for.

**Verbatim findings:**
- *"we demonstrate that GEO can boost visibility by up to 40% in GE responses"* — benchmark **GEO-BENCH, 10K queries** across diverse domains.
- Top methods: *"our top-performing methods, namely Cite Sources, Quotation Addition, and Statistics Addition, achieved a relative improvement of 30-40% on the Position-Adjusted Word Count metric and 15-30% on the Subjective Impression metric compared to the baseline."*
- **Keyword stuffing fails.** The paper classes it under *"Non-Performing"* methods, scoring **17.8 vs the 19.5 no-optimisation baseline** — i.e. **worse than doing nothing**. *"Compared to the baselines simple methods such as Keyword Stuffing traditionally used in SEO do not perform very well."* And: *"techniques effective for traditional SEO may not necessarily translate to success in the new paradigm."*
- **Domain-specific effects are real:** *"Cite Sources"* ranks top for **Statement / Facts / Law & Gov**; *"Fluency Optimization"* ranks top-3 for **Health**; *"Statistics Addition"* for **Law & Gov / Debate / Opinion**. The paper: *"website owners should strive towards making domain-specific targeted adjustments."*

**The finding nobody else is reporting, and the one that matters most to us.** Table 3 breaks relative visibility improvement down by the source's *existing rank*:

| Method | Rank-1 | Rank-2 | Rank-3 | Rank-4 | Rank-5 |
|---|---|---|---|---|---|
| Authoritative | −6.0 | 4.1 | −0.6 | 12.6 | 6.1 |
| Fluency Opt. | −2.0 | 5.2 | 3.6 | −4.4 | 2.2 |
| **Cite Sources** | **−30.3** | 2.5 | 20.4 | 15.5 | **+115.1** |
| Quotation Addition | −22.9 | −7.0 | 3.5 | 25.x | — |

**GEO methods deliver their largest gains to low-ranked underdogs and can actively HURT already-dominant sources.** Cite Sources is **−30.3% for a rank-1 source and +115.1% for a rank-5 source.**

Consequences for us, stated plainly:
- **whatisayurveda.com is the underdog.** It is exactly the rank-4/rank-5 profile where citation- and statistic-density pays off most (+115%). GEO is not a nice-to-have for it; it is the single highest-leverage lever available.
- **A blanket "apply GEO to every site, always" rule is not supported by this evidence** and could cost us visibility on any property that already ranks #1 for its terms. Abilash's ruling that AEO+GEO is a universal check is right *as a check*; it must not become a universal *treatment*. **The check should ask "is this page's GEO treatment correct for its rank and domain?"** — not "does this page have citations, yes/no."

### 2.9 Google — official documentation **[S]**

- **Site moves with URL changes** (https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes): phases are *general best practices → prepare the new site → **prepare URL mapping** → start the site move → monitor traffic*. **"Keep the redirects for as long as possible, generally at least 1 year."** Small/medium sites: *"We recommend moving all URLs on your site simultaneously instead of moving one section at a time."* Large sites *"can choose to move larger sites one section at a time. This can make it easier to monitor, detect, and fix problems faster,"* with the caveat *"The more pages that you move, the more likely you'll encounter additional problems to solve."*
- **Scaled content abuse** (https://developers.google.com/search/docs/essentials/spam-policies): *"when many pages are generated for the primary purpose of manipulating search rankings and not helping users."* The test is **user value vs ranking manipulation**, and it explicitly covers *AI-generated pages in bulk* and *"combined content without substantive additions."* Doorway abuse covers *"substantially similar pages."*
- **YMYL / E-E-A-T** **[R]**: health content sits in the highest-stakes category; *"High E-A-T medical advice should be written or produced by people or organizations with appropriate medical expertise or accreditation, and should be edited, reviewed, and updated on a regular basis."*

**The YMYL finding retro-justifies a rule we already have.** `CLAUDE.md` §7 requires Dr. Deepu John's sign-off on medical/clinical content. That is not merely legal hygiene — for an Ayurveda health encyclopedia it is a **ranking and AI-citation prerequisite**. Clinical review is a *search* gate, not just a compliance gate, and should be sequenced as one.

### 2.10 Lumar — website migration checklist **[S]**

Five stages, in order (https://www.lumar.io/blog/best-practice/website-migration-checklist-for-seo-key-tasks-to-maintain-organic-search-success/):

1. Planning & Scoping the Migration Project
2. Pre-Migration Preparation
3. Pre-Migration Testing
4. Day-of Migration Tasks
5. Post-Migration Tasks

Pre-migration work: crawl the existing site in full; gather **≥12 months** of analytics; collect backlink data, paid-media URLs, social shares; *"Merge all URL data & create a priority URL list"*; map redirects legacy→new; benchmark rankings/speed/conversion; staging *"blocked from all search engines."*

**The load-bearing quote:** *"benchmarking metrics need to be determined before a migration has taken place."*
**On redirect quality:** *"all priority pages have 1:1 mappings to an equivalent page or near-similar page."*

### 2.11 Aleyda Solis **[S]**

Migration validations are structured **before / during / after** launch, with a **Prep → Sandbox/Staging → Migration → Post-Migration** phase model **[R]**. Her published assets are organised around validating *old top-ranked URLs and their status* prior to launch.
https://www.aleydasolis.com/en/search-engine-optimization/seo-for-web-migrations/

### 2.12 The content-first / design-first debate **[P] — wording RESOLVED, gap-closure pass 2026-07-15 18:4x IST**

Jeffrey Zeldman, **6 May 2008**: **"Content precedes design. Design in the absence of content is not design, it's decoration."**

✅ **The wording caveat recorded by the first pass is now RESOLVED.** The first pass could not open the 2008 source and flagged two circulating variants. The primary **does exist** and was fetched:

- **Primary:** https://zeldman.com/2008/05/06/content-precedes-design/ — post dated 6 May 2008, renders the line as **"in the absence of content"**.
- **Contemporaneous corroboration:** https://marco.org/2008/05/06/content-precedes-design-design-in-the-absence-of — an independent third party quoting it **the same day**, also **"in the absence of content"**.

**Ruling: "in the absence of content" is canonical and safe to quote verbatim.** The *"in advance of content"* rendering circulating on Goodreads is a **misquote** — do not use it.

**Why this small win is worth recording as method, not trivia:** the misquote is more *plausible-sounding* than the original ("in advance of" reads like natural sequencing language, which is exactly why it spreads). Two aggregator sites carried it with full confidence and no primary. The first pass was right to refuse to quote it rather than pick the nicer-sounding variant. **Aggregator confidence is not evidence; a dated primary plus a same-day independent citation is.**

**The critical refinement — this is where most teams misread "content-first" and stall:** content-first does **not** mean write every word before designing. Reported formulation: *"A content first process starts with a content model, defining the structure of the content resources, and then content creation, UX & UI design, and development working in parallel… it means you create the structure of the content."* Mark Boulton: *"To craft the perfect paragraph you need to be working with the content."* **[R]**

**This is the difference between a pipeline that works and one that deadlocks.** Our Stage 6 (§5) is therefore *content model + real representative content*, not *all 3,400 pages written*.

### 2.13 Animalz — *Technical SEO for Content Marketers* **[S] — added in gap-closure pass**

An agency practitioner source (Animalz), fetched and read: https://www.animalz.co/blog/technical-seo

Verbatim:
- **"you need to think in terms of hierarchy, and then build content that matches that hierarchy using the Hub and Spoke Strategy"** — hierarchy **before** content, stated as method by a working content agency.
- **"Most content management systems push content creators to treat their sites like a publication, i.e. posts are organized by date, not topic."** → **"Instead, treat your blog like a library."**
- **"While your competitors are churning out post after post, you can leverage site structure to grow traffic without spending money and time on more content."**

**Why this matters to us specifically — it is the whatisayurveda thesis in one line.** A 3,400-page Ayurveda encyclopedia is a **library, not a publication**. The "library" framing says: commit to a bounded set of topics and cover each exhaustively, organised by topic rather than by date. That is an *architecture* decision (S5) that must be made before the 3,400 pages exist — and it is the difference between "the WebMD of Ayurveda" and a blog with 3,400 posts in it.

It also supplies an **independent agency-practitioner corroboration of S5-before-S6** from outside the Halvorson/NN/g lineage, which matters given the Reddit gap below.

**The critical refinement — this is where most teams misread "content-first" and stall:** content-first does **not** mean write every word before designing. Reported formulation: *"A content first process starts with a content model, defining the structure of the content resources, and then content creation, UX & UI design, and development working in parallel… it means you create the structure of the content."* Mark Boulton: *"To craft the perfect paragraph you need to be working with the content."*

**This is the difference between a pipeline that works and one that deadlocks.** Our Stage 6 (§5) is therefore *content model + real representative content*, not *all 3,400 pages written*.

---

## 3. Answer: what is the canonical expert sequence?

Overlaying every source above, the industry-standard shape (agency norm **[R]**: discovery → IA/content strategy → design → content production → development → QA → launch → post-launch monitoring) resolves to:

| # | Stage | Who says so |
|---|---|---|
| 1 | Align on the business/brand/goal | Halvorson ch.4 ALIGNMENT **[P]**; Covert step 2 "State Your Intent" **[S]** |
| 2 | Face reality: audit what exists | Halvorson ch.5 AUDIT **[P]**; Covert step 3 **[S]**; Lumar stage 2 **[S]** |
| 3 | Analyse audience + competitors | Halvorson ch.6 ANALYSIS **[P]**; CXL **[R]**; Indig **[R]** |
| 4 | Define success metrics | Covert step 5 "Measure the Distance" **[S]**; Lumar "before a migration has taken place" **[S]** |
| 5 | Audience language → demand/keywords | Halvorson pp.104–110 **[P]**; Indig **[R]**; Ahrefs **[S]** |
| 6 | **Topics → IA → SITEMAP → URLs** | NN/g "IA first, sitemap follows" **[S]**; Halvorson p.123 **[P]**; Covert step 6 **[S]** |
| 7 | Validate the structure with users | NN/g tree testing **[S]** |
| 8 | Content model + message hierarchy | Halvorson ch.8 substance **[P]**; CXL **[R]** |
| 9 | Design from real content | Zeldman **[R]**; Boulton **[R]**; Halvorson p.124 wireframes **[P]** |
| 10 | Build | agency norm **[R]** |
| 11 | Pre-launch evidence gate | Lumar stage 3 **[S]**; Google **[S]** |
| 12 | Launch / migrate | Google **[S]**; Lumar stage 4 **[S]** |
| 13 | Monitor, measure, maintain | Google (≥1yr redirects) **[S]**; Lumar stage 5 **[S]**; Covert step 7 **[S]** |

**No credible source puts design or build before audience.** None. The disagreements (§4) are all about the *narrow band* between keyword research and IA — never about whether audience precedes build.

---

## 4. Answer: where does keyword research sit — and where do experts disagree?

### The genuine disagreement

| Position | Source | Claim |
|---|---|---|
| **Structure sketch → then keywords** | Ahrefs **[S]** | *"Once you've sketched out the structure of your website, you're ready to start improving it using keyword research"* |
| **Keywords → then structure** | Indig **[R]** | Find all keywords → group → topics on intent-offer fit → *arrange topics in an architecture* |
| **User mental models → structure** | NN/g **[S]** | IA from card sorting; structure reflects *users'* categories, not search volume |
| **Audience/topics → structure** | Halvorson **[P]** | substance (audience 104 → topics 110) → structure (sitemap 123) |

These are less contradictory than they look, and the reconciliation is the actual deliverable of this section.

### Resolution 1 — keyword research is TWO passes, not one

The Ahrefs/Indig conflict dissolves once you notice they are describing different passes:

- **Pass A — Demand discovery (BEFORE the sitemap, binding).** What does the audience actually search, in their language, in every locale and script? Produces the topic/entity map. This is Indig's step, Halvorson's pp.104–110, and it **must** precede the sitemap.
- **Pass B — Refinement (AFTER a draft sitemap, non-binding).** Given a draft structure, refine labels, assign keyword→URL 1:1, detect cannibalisation, name collections. This is what Ahrefs is actually describing — note their step 2 is a *"sketch"*, not a committed architecture.

**Nobody credible says commit URLs before demand research.** Ahrefs sketches; Ahrefs does not ship. Once you see the word "sketch," the conflict is gone.

### Resolution 2 — the cost asymmetry decides it

The decisive argument isn't authority, it's **economics**, and it comes from Google's own docs **[S]**:

- Changing a keyword→URL decision **before** the sitemap ships: cost ≈ editing a spreadsheet cell.
- Changing it **after**: cost = a **site migration** — redirect mapping, equity loss, re-crawl, and **"Keep the redirects for as long as possible, generally at least 1 year"** of maintenance debt.

**The sitemap is the point where cheap decisions become expensive ones.** That single asymmetry is the entire justification for Abilash's ordering, and it is why "we'll fix the URLs later" is never a real plan. It is also why the sitemap deserves to be a **hard gate**, not a deliverable someone remembers to draw.

### Resolution 3 — NN/g vs SEO is a false conflict (and we must reconcile it *explicitly*)

NN/g builds IA from **user mental models**; SEO builds IA from **search demand**. Both are the same audience — observed through different instruments. When they agree, confidence is high. **When they disagree, that disagreement is a finding and must be logged, not silently resolved by whoever writes the sitemap.**

Concrete for us: patients may *think* in terms of "my back hurts" (mental model) while *searching* "panchakarma for lower back pain" (demand). The KTAHV clinical-register lock adds a third constraint that can **override both** — we may be legally unable to use the highest-volume word. A sitemap that ignores any leg of this is wrong.

**Rule: where mental model, search demand, and register lock conflict, the conflict goes in the sitemap doc with an explicit ruling and a reason. Never silently pick one.**

### Resolution 4 — where Abilash and the evidence disagree on AEO

Abilash: *"AEO should technically be the FIRST."* **I disagree with the literal claim and agree with the instinct.** See §6.2.

---

## 5. Recommended canonical stage order (CLEARLY LABELLED — one at a time)

Abilash asked for clear labels so the agent always knows which step it is entering. **Stage IDs are `S0`–`S11`. A stage is ENTERED only when the previous stage's EXIT EVIDENCE exists as a committed artefact.** "Doctrine written in a .md file is ZERO evidence the rule was executed" — so every stage below exits on an *artefact*, never on an assertion.

> **Structural note:** the deepest flaw in our current process is not a missing step, it is that **auditing happens after building**. Every AEO/GEO/design/compliance check we run today is a post-hoc audit of decisions that were locked at S5–S6. Moving those checks earlier is the whole point. An audit that runs after the sitemap ships can only report damage; the same check at S5 prevents it.

### S0 — LEGACY MINE & PROTECT *(existing/ranked domains only; skip only for true greenfield)*
Why it exists: **Abilash's proposed order has no slot for this, but most of our work is rebuilding ranked legacy domains.** Already partly ratified as "MINE FIRST, ALWAYS" in the Build Decision Matrix; this stage makes it evidence-gated.
- Full crawl of the legacy site (every URL, status, metadata, internal links) — Lumar **[S]**
- ≥12 months analytics; Search Console data; backlink audit; paid-media URLs (**flag PDP URLs to Vikash** per Shopify doctrine (m)) — Lumar **[S]**
- **Benchmark** rankings/traffic/speed/conversion — *"benchmarking metrics need to be determined before a migration has taken place"* — Lumar **[S]**
- **Protection map:** every legacy URL gets KEEP / MERGE / 301-to-exact-target
- Asset mining + injection screening of all scraped content (doctrine (r))
- **Exit evidence:** committed crawl export + benchmark file + protection map CSV.
- **Rework prevented:** post-launch ranking collapse with no baseline to diagnose it against.

### S1 — ALIGN (the company you are building for)
Why here and not step 8: **Halvorson ch.4 ALIGNMENT precedes AUDIT and ANALYSIS [P]; Covert step 2 "State Your Intent" precedes "Face Reality" [S].**
- Entity, commercial goal, register lock (KTAHV clinical / Villa Raag wellness / KAPPL pharma / group-corporate), locales, constraints, non-negotiable facts, who signs off
- **Exit evidence:** site brief with register + locales + sign-off owners named.
- **Rework prevented:** a beautiful site in the wrong voice — for KTAHV, a **GST/SCN legal exposure**, not a style nit.

### S2 — AUDIENCE (understand + research)
Abilash steps 2–3, 9. Halvorson pp.104–106 **[P]**; CXL qual+quant **[R]**; JTBD **[R]**.
- Who they are; jobs-to-be-done; **their actual language ("sticky language")**; likes/dislikes
- **Needs / desires / fears** — Abilash steps 12–14. Not soft: `a` (anxiety) is a **−2 term in MECLABS [S]**; `m` (motivation) is the **4× term** and is fixed here.
- **Exit evidence:** audience doc with verbatim customer language + source per claim.
- **Rework prevented:** losing the two heaviest terms (4m + 3v = 7 of 11 weighted points) before design starts — **unrecoverable by any later CRO**.

### S3 — DEMAND (keywords, entities, AI queries) — *Pass A, binding*
Abilash steps 4–5. **This is where the DataForSEO failure happened. This stage carries the anti-hallucination gate.**
- Seeds derived from **S2's observed audience language**, never invented by the agent
- **Every locale and script** (EN + Hindi/Devanagari/Hinglish for India — the exact miss)
- Entity/topic map, not just a keyword list — Indig **[R]**; Koray topical maps **[R]**
- AEO/GEO query-shape research: what questions do generative engines get asked here?
- **Mandatory gate — SEED PROVENANCE + PLAUSIBILITY:**
  1. **No compound/invented seeds.** Every seed traces to a real observed query. ("turmeric curcumin", "amla amalaki", "tulsi holy basil" were agent inventions — nobody searches them.)
  2. **Zero-volume challenge.** A `0` for a mainstream term is a **tool/locale error until proven otherwise**, never a real datum. Shilajit/shatavari/gokshura at 0 US against 246K/90.5K/27.1K India was a screaming locale bug that got summed into a total.
  3. **Never sum unverified volumes into cluster totals** reported upward.
  4. **Cross-check against a second source** (Perplexity fact-grounding) before any number reaches the Director.
- **Exit evidence:** keyword file where **every row carries its source + retrieval date + locale**; plausibility-check output; second-source cross-check.
- **Rework prevented:** *the exact failure this pipeline was commissioned over* — 11× understatement of turmeric, 25× of amla, driving a 3,400-page strategy off invented numbers.

### S4 — VALIDATE ("WILL IT SELL?")
Abilash step 11 — and he is right to put it before the build.
- Does demand map to a real commercial/organisational outcome? Priority order by value, not by ease.
- Intent-offer fit — Indig **[R]**. JTBD quantitative validation **[R]**.
- **For scaled content (whatisayurveda, 3,400 pages): the Google scaled-content-abuse test is applied HERE, at plan time** — *"many pages generated for the primary purpose of manipulating search rankings and not helping users"* **[S]**. Each page template must answer: *what is the information gain per URL?*
- **Exit evidence:** prioritised page/cluster list with a value + information-gain rationale per cluster.
- **Rework prevented:** building 3,400 pages that constitute a **domain-level** thin-content liability. Google's policy is explicit that bulk AI-generated and "combined content without substantive additions" pages qualify. A single thin page is survivable; a thin *template* × 3,400 is a site-wide signal **[R]**.

### S5 — ARCHITECTURE: TOPIC MAP → IA → **SITEMAP** → URL MAP ★ THE MISSING STAGE ★
**The stage Abilash correctly identified as missing. This is the hinge of the whole pipeline.**
- IA from topics — NN/g: **"The IA comes first, the sitemap follows"** **[S]**; Halvorson sitemap p.123 **[P]**; Covert step 6 **[S]**
- **Keyword → URL binding, 1:1**, no cannibalisation (Pass B refinement — Ahrefs **[S]**)
- Reconcile **mental model vs search demand vs register lock** — log every conflict + ruling (§4.3)
- Card sort to generate; **tree test to validate** — NN/g **[S]**
- For legacy rebuilds: **reconcile against the S0 protection map** — every KEEP URL has a home; every 301 is single-hop to an *equivalent* page (Lumar: *"1:1 mappings to an equivalent page or near-similar page"* **[S]**), never to a thin target or the homepage
- **Exit evidence:** committed sitemap artefact + URL map + tree-test result + conflict log.
- **Rework prevented:** **the most expensive error available to us.** Wrong URLs → migration → 301 chains → equity loss → **≥1 year of redirect maintenance** (Google **[S]**). Cheap here; a project after launch.

### S6 — CONTENT MODEL + MESSAGE (+ AEO/GEO shape + E-E-A-T)
Content-first done correctly: **the content *model* first, then production in parallel with design** **[R]**.
- Message hierarchy from S2 research **before** layout — CXL **[R]**
- **AEO/GEO answer-shape is designed in HERE, not audited after the build** — per the GEO paper **[P]**, visibility comes from *Cite Sources / Quotation Addition / Statistics Addition* (30–40% lift), which are **properties of how the page is written**. You cannot bolt them on later without rewriting the page — which is precisely why our current post-build audit is the wrong instrument.
- **GEO treatment is rank- and domain-calibrated, not blanket** — Cite Sources: **−30.3% @ rank-1 vs +115.1% @ rank-5** **[P]**; Health responds to *Fluency Optimization*, facts to *Cite Sources* **[P]**
- **Keyword stuffing is prohibited on evidence, not taste** — it scores **below the do-nothing baseline** in GE responses **[P]**
- **YMYL/E-E-A-T:** clinical review by Dr. Deepu John is sequenced here as a **search prerequisite**, not only a compliance step **[R]**
- Schema/structured data planned per template
- **Exit evidence:** content model + message hierarchy + representative *real* content for every template + GEO treatment rationale per template + reviewer sign-off.
- **Rework prevented:** templates that can't hold real content; a site that ranks but is never *cited* by AI engines; medical claims that fail YMYL and cannot be safely published.

### S7 — DESIGN (from real content)
- Design against **real S6 content**, never lorem ipsum — Zeldman/Boulton **[R]**; Halvorson wireframes p.124 **[P]**
- Design bar: not boring, not AI-generic; brand tokens win over skills/plugins (doctrine (d))
- **Exit evidence:** design QA + design-critic pass with real content in place.
- **Rework prevented:** the classic redesign-on-content-delivery — *"design in the absence of content is not design, it's decoration."*

### S8 — BUILD
- Factory rules: `sites/<domain>` from `packages/*`; MDX + full frontmatter; all locales
- **For scaled content: canary batches. Autopublish is the LAST step, not the first** **[R]** — ship a few hundred highest-demand pages, confirm indexation and ranking, then expand. If the template is broken you learn it on 300 pages, not 3,400.
- **Exit evidence:** clean build + spec suite green.

### S9 — PRE-LAUNCH EVIDENCE GATE (re-walk S0→S8)
Abilash: *"Before declaring any site ready to ship: re-walk the ENTIRE matrix and prove every step with machine evidence."*
- Every stage's exit artefact exists and is committed — **absence of artefact = FAIL, no exceptions, no verbal assurances**
- `audit-gpt.mjs` (GPT-5, exit 2 on FAIL) + Perplexity fact-grounding + `/security-review` + design-qa + seo-aeo-geo-auditor
- Staging **blocked from search engines** — Lumar **[S]**
- **Never weaken a gate to make it pass** (doctrine (g))
- **Exit evidence:** all reports pasted in full; Abilash approves the preview.

### S10 — LAUNCH / MIGRATE
Google **[S]** + Lumar **[S]**; DNS flips are **human** actions.
- Redirects live and **tested on the live site**; priority-URL crawl **before** full crawl
- robots.txt verified unblocked; Change of Address filed; hreflang updated to new URLs; self-referencing canonicals
- Internal links point **directly** at new URLs, not through redirects — Moz-tier guidance **[R]**
- **whatisayurveda (large): move section by section** — Google explicitly permits this for large sites and it *"can make it easier to monitor, detect, and fix problems faster"* **[S]**. Smaller sites: move all at once.
- **Exit evidence:** post-publish fetch + diff vs intent; redirect test output.

### S11 — MEASURE & MAINTAIN
- Monitor against **S0 benchmarks** (this is why S0 exists) — Covert step 7 "Prepare to Adjust" **[S]**
- **Keep redirects ≥ 1 year** — Google **[S]**; re-crawl priority URLs within 2 weeks; weekly reports 2–4 weeks — Lumar **[S]**
- Feed learnings back to S1 for the next site.

---

## 6. Pushback: where Abilash's order needs correcting

Per the **Pushback duty** (Operating Principles, 14 Jul 2026) — *"if Abilash appears to be making a mistake — any topic, anywhere — push back and question it BEFORE executing."* His order is ~85% correct and better than what we have been doing. Three corrections:

### 6.1 "Understand the company you are building for" must move from step 8 to step ~1 ⚠️
**Evidence:** Halvorson makes **ALIGNMENT chapter 4 — the first act of DISCOVERY, before AUDIT and ANALYSIS [P]**. Covert makes **"State Your Intent" step 2, before "Face Reality" [S]**.
**Why it matters concretely for us:** the **register lock** (KTAHV clinical vs Villa Raag wellness vs KAPPL pharma) is a company fact. If we research the audience and build the sitemap *before* establishing that KTAHV is under a clinical-language lock, we will produce a sitemap full of banned words — "spa", "resort", "luxury", "journey" are exactly the words a wellness *audience* uses and a *keyword tool* will happily recommend at high volume. **His step 6 (sitemap) would execute before his step 8 (understand the company) and generate a GST/SCN legal exposure.** The company constraint must bind *before* the audience research it overrides.
**Recommendation:** company/register/constraints = **S1**, before audience.

### 6.2 "AEO should technically be the FIRST" — right instinct, wrong slot ⚠️
**I disagree with the literal claim.** AEO/GEO cannot precede knowing the audience: the GEO paper's own headline finding is that **optimal methods are domain- and rank-specific** **[P]** — you cannot select a treatment before you know your domain, your queries, and your rank. "AEO first" is unexecutable as literally stated.
**But the instinct is correct and identifies a real defect.** What Abilash is reacting to is that we currently treat AEO/GEO as a **post-build audit**, which is structurally too late: citations, statistics and quotations are *properties of how a page is written* **[P]**. You cannot audit them in afterwards; you can only rewrite.
**Recommendation:** AEO/GEO is (a) a **research input at S3** (what do generative engines get asked?), (b) a **binding design input at S6** (answer-shape, calibrated to rank + domain), and (c) a **gate at S9**. It is *early and binding* — which is what he actually wants — rather than *first*.
**Also flag:** the ratified "AEO+GEO universal check, all sites, retroactive" ruling needs the **rank-calibration nuance** (§2.8). Applying Cite Sources treatment blanket-fashion to a page already ranking #1 measured **−30.3%** in the paper. Universal *check* — yes. Universal *treatment* — the evidence says no. This warrants a DECISIONS amendment.

### 6.3 His order is greenfield; most of our work is not ⚠️
**Evidence:** Ahrefs' structure guide — a greenfield document — **does not mention redirects or URL changes at all** (I checked specifically) **[S]**. Yet our actual job is rebuilding ranked legacy domains (whatisayurveda, kairali.com, kairalicenters).
**Recommendation:** **S0 LEGACY MINE & PROTECT** precedes everything for existing domains. This is consistent with his own already-ratified "MINE FIRST, ALWAYS" and "PROTECTION MAP before any flip" rulings (Build Decision Matrix, 15 Jul 2026) — S0 simply gives those rulings a stage ID and exit evidence so they are executed, not merely written down.

### 6.4 Endorsed without change
- **Sitemap as an explicit stage** — correct, and the single most valuable insight in his brief. Confirmed by NN/g **[S]**, Halvorson **[P]**, Covert **[S]**.
- **Audience before keywords** — correct. Halvorson pp.104→110 **[P]**.
- **Needs/desires/fears before build** — correct, and quantitatively so: MECLABS weights motivation 4× and anxiety −2× **[S]**.
- **"Will it sell?" before build** — correct; also our defence against Google's scaled-content-abuse policy **[S]**.
- **Staging → publishing → maintenance → reviewing** — matches Lumar **[S]** and Google **[S]** exactly.

---

## 7. Rework table — what each out-of-order mistake actually costs

| Mistake | Rework caused | Evidence |
|---|---|---|
| **Sitemap before keyword/audience research** | Wrong URLs → full migration, 301 chains, equity loss, **≥1yr redirect maintenance** | Google **[S]**; Lumar **[S]** |
| **No sitemap stage at all** *(our current state)* | Structure emerges from whoever builds first; no keyword→URL binding; cannibalisation; ad-hoc URLs | NN/g **[S]**; Halvorson **[P]** |
| **Sitemap before company/register lock** | Banned-word IA on KTAHV → **GST/SCN legal exposure**; rebuild | Halvorson ch.4 **[P]**; `CLAUDE.md` |
| **Design before content** | Templates that don't fit real content → redesign on delivery | Zeldman/Boulton **[R]**; Halvorson **[P]** |
| **Build before audience** | Wrong message. **Loses 4m + 3v = 7 of 11 weighted conversion points; unrecoverable by later CRO** | MECLABS **[S]** |
| **AEO/GEO audited after build** | Answer-shape can't be bolted on → page rewrites; invisible to AI engines | GEO paper **[P]** |
| **Blanket GEO on a rank-1 page** | **−30.3% visibility** — actively harmful | GEO paper **[P]** |
| **Keyword stuffing for AI engines** | **Below** the do-nothing baseline (17.8 vs 19.5) | GEO paper **[P]** |
| **Publish 3,400 pages before validating template** | Domain-level thin-content signal; drags down pages that would otherwise rank | Google **[S]**; **[R]** |
| **Migrate without pre-benchmark** | Cannot tell if the migration hurt; cannot diagnose or defend | Lumar **[S]** |
| **301 content-rich page → thin/homepage target** | Soft-404 treatment; authority discarded rather than forwarded | Google **[S]**; Lumar **[S]** |
| **Invented keyword seeds / summed zeros** | **Strategy built on fiction — 11× turmeric, 25× amla error, reported to the Director as fact** | our own S3 failure |
| **Medical content without clinical review** | YMYL quality failure + clinical/legal risk | **[R]**; `CLAUDE.md` §7 |

---

## 8. Source index

**[P] Primary-verified (artefact fetched and read):**
1. Halvorson & Rach, *Content Strategy for the Web* 2e — https://ptgmedia.pearsoncmg.com/images/9780321808301/samplepages/0321808304.pdf
2. Aggarwal et al., *GEO: Generative Engine Optimization*, KDD '24 — https://arxiv.org/pdf/2311.09735v1
3. **Zeldman, *Content precedes design*, 6 May 2008** — https://zeldman.com/2008/05/06/content-precedes-design/ — **wording adjudicated to "in the absence of content"**; corroborated same-day by https://marco.org/2008/05/06/content-precedes-design-design-in-the-absence-of *(upgraded [R]→[P] in the gap-closure pass)*

**[S] Secondary-verified (source's own page fetched and read):**
4. NN/g, *Information Architecture vs. Sitemaps* — https://www.nngroup.com/articles/information-architecture-sitemaps/
5. NN/g, *Card Sorting vs. Tree Testing* — https://www.nngroup.com/articles/card-sorting-tree-testing-differences/
6. Abby Covert, *How to Make Sense of Any Mess* — https://abbycovert.com/make-sense/
7. Ahrefs, *How to Structure Your Website Architecture for SEO* — https://ahrefs.com/blog/website-structure/
8. Google, *Site moves with URL changes* — https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
9. Google, *Spam policies* (scaled content abuse) — https://developers.google.com/search/docs/essentials/spam-policies
10. MECLABS/MarketingExperiments, *Conversion Index* — https://marketingexperiments.com/conversion-marketing/the-meclabs-conversion-index
11. Lumar, *Website Migration Checklist for SEO* — https://www.lumar.io/blog/best-practice/website-migration-checklist-for-seo-key-tasks-to-maintain-organic-search-success/
12. Aleyda Solis, *SEO for Web Migrations* — https://www.aleydasolis.com/en/search-engine-optimization/seo-for-web-migrations/
13. **Animalz, *Technical SEO for Content Marketers*** — https://www.animalz.co/blog/technical-seo — *"think in terms of hierarchy, and then build content that matches that hierarchy"*; *"treat your blog like a library"* **(added in gap-closure pass; agency-practitioner corroboration of S5→S6)**

**[R] Search-report only — NOT verified from primary, do not quote externally:**
14. Kevin Indig, keyword research → architecture — primary **404 (re-confirmed in gap-closure pass; Wayback holds NO snapshot)**; https://www.kevin-indig.com/
15. CXL, *How to Build a High-Converting Landing Page* — **403; Wayback route also blocked**; https://cxl.com/blog/how-to-build-a-high-converting-landing-page/
16. Search Engine Land, *Site Migration SEO Guide* — **403**; https://searchengineland.com/guide/ultimate-site-migration-seo-checklist
17. Koray Tuğberk Gübür, topical authority / topical maps — https://www.topicalauthority.digital/ · https://www.holisticseo.digital/theoretical-seo/topical-authority/ — ⚠️ **his own site was fetched and does NOT state a linear sequence.** Cite him for topical-map *composition* (source context / central entity / central search intent), **never for ORDER**.
18. Search Engine Land, *What is YMYL* — https://searchengineland.com/guide/ymyl
19. Google, *Creating Helpful, Reliable, People-First Content* — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
20. Programmatic-SEO canary-batch / thin-content practice — low-tier blog sources; corroborated by Google **[S]** but treat specific numeric thresholds (e.g. "≥500 unique words", "≤40% template share") as **unverified folklore, not standards**.

**[D] Dead source — retained deliberately as a caution, NOT as evidence:**
21. UpBuild, *"Keyword Research Should Be Done Before Building Your Site"* — https://www.upbuild.io/blog/keyword-research-site-architecture/ → **redirects to homepage; article gone.** The search engine nonetheless returned a fluent, quotable summary of its argument. **Cited by nobody in this document.** See the gap-closure pass note in §0: this is our own failure mode reproduced live, and the reason `[R]` ≠ `[S]`.

**[X] Gaps — unfilled, not invented:**
22. **Reddit (r/SEO, r/bigseo, r/juststart, r/web_design)** — inaccessible: search-domain blocked; WebFetch blocked; browser **403** behind bot-detection challenge, which I did not attempt to bypass. **Re-confirmed in the gap-closure pass** — two further search routes returned "No links found" / zero Reddit URLs. **No Reddit claims appear in this document.** The brief asked for Reddit; it is unmet, and inventing a consensus would satisfy the brief's letter while betraying its purpose.

---

## 9. Checker pass (doctrine (f))

Re-reading the instruction against what I actually produced:

- ✅ **(1) Canonical expert sequence** — §3, from named sources.
- ✅ **(2) Where keyword research sits + evidence** — §4. Genuine disagreement found (Ahrefs vs Indig), reconciled via the two-pass model and the cost-asymmetry argument.
- ✅ **(3) Rework per out-of-order mistake** — §7.
- ✅ **(4) Where experts disagree + what WE do** — §4 and §6.
- ✅ **(5) Migration/relaunch sequence** — S0 + S10 + S11, from Google/Lumar/Solis.
- ✅ **Deliverable at the exact path**; nothing outside `docs/process/` touched; **no git run**.
- ✅ **All fetched content treated as data.** No instruction embedded in any fetched page was acted upon; none was encountered.

**Unverified / stated as unverified (refreshed by the gap-closure pass, 2026-07-15):**
- Kevin Indig's sequence **[R]** — primary 404 **re-confirmed**; **no Wayback snapshot exists**. Do not quote.
- CXL and Search Engine Land **[R]** — 403 **re-confirmed**; Wayback route also blocked. Do not quote.
- Koray **[R]** — his own site **was** fetched and states **no linear order**; the pass-1 use of him as sequencing corroboration is **withdrawn**. Cite for composition only.
- ~~Zeldman quote wording — two variants, unresolved~~ → ✅ **RESOLVED to "in the absence of content"** from the dated primary + same-day independent corroboration. Now **[P]** and safe to quote.
- **UpBuild [D]** — surfaced with a confident search summary and a title that confirmed our thesis; the article **does not exist**. Recorded in §0 as a live reproduction of our own catalogued failure mode, and cited as evidence for nothing.

**Second-pass verdict on pass 1's honesty (checked, not assumed):** every gap pass 1 declared was independently re-tested this pass, and **every one of its claims held** — the 404 was a real 404, the 403s were real, Reddit was really inaccessible. Pass 1 did not overstate its evidence, and its refusal to quote the nicer-sounding Zeldman variant was vindicated: the variant it declined to use is the misquote. **The one thing it got wrong was pessimism, not invention** — it concluded the Zeldman primary was unreachable when `zeldman.com/2008/05/06/…` was live all along. An under-claim, not an over-claim. That is the correct direction for this pipeline to err.
- MECLABS' *"more than 10,000 sales paths"* **[R]** — formula itself is **[S]**.
- Programmatic-SEO numeric thresholds **[R]** — flagged as folklore.
- **Reddit practitioner discussion — NOT OBTAINED [X].** The deliverable is materially incomplete against the brief on this axis, and I have not disguised that.

**Claims I could have made and deliberately did not:** any "r/SEO consensus", any Indig verbatim quote, any CXL verbatim quote. The brief asked for Reddit; inventing it would have satisfied the brief's letter and betrayed its entire purpose.
