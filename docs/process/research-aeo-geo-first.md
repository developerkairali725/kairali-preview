# AEO-FIRST — What It Concretely Means as an Early Stage

**v1: 2026-07-15 18:05:45 IST — research + stage definition.**
**v2: 2026-07-15 19:02:11 IST — independent verification pass by a second agent. 7 defects found and fixed (Appendix B). No code changed. No git run. Nothing edited outside `docs/process/`.**

**Commission:** Abilash, 15 Jul 2026 — *"AEO should technically be the FIRST"* and is currently missing. Define what AEO-FIRST concretely means as an EARLY stage.

**Status:** RESEARCH + PROPOSED STAGE DEFINITION. **Not ratified.** Gate thresholds in §6 and §7 bind only after Abilash signs off (§13).

**Verification status (doctrine f).** Every load-bearing citation was **re-fetched from its primary source** by a second agent and diffed against the text as written. **Both arXiv papers are real** and their findings match. **Seven defects were found in v1** — one corrupted file tail, three misquotations (one of which *materially overstated Google*), one false claim about our own repo, one **incomplete crawler table that would have cost citation visibility**, and one unverifiable date. All are listed in **Appendix B**, kept visible rather than quietly patched, because a document arguing that unaudited claims decay into folklore should show its own audit. **§0's thesis survived verification intact.**

**Prompt-injection screen (CLAUDE.md rule r):** every external page below was treated as DATA. No fetched page contained instructions directed at an agent; nothing fetched was executed or acted upon as a directive. Sources that failed to fetch are marked NOT RETRIEVED rather than paraphrased from memory. Reddit is **inaccessible to this agent's user agent** — independently re-confirmed 15 Jul 2026: `WebSearch` returns **HTTP 400 — "The following domains are not accessible to our user agent: ['reddit.com']"**. See §12 for what that costs us and how to fix it. **This gap is real and is not papered over: Abilash explicitly asked for Reddit practitioner evidence and we do not have it.**

---

## 0 · PUSHBACK FIRST — Abilash is right about the slot and wrong about the content

Duty of pushback (CLAUDE.md Operating Principles) applies before doctrine is built on the premise.

**What is right, and it is the important part.** AEO belongs early. Not because AI engines need special treatment, but because **the question inventory is the only artifact that tells you what a page must exist to answer.** Today we produce a keyword map, draw a sitemap from it, build pages, and *then* run an AEO audit. That audit can only report damage. Abilash's instinct — that the check must move to the front — is structurally correct and is the single most valuable idea in the brief.

**What is wrong, and it must be corrected before it becomes a rule.** "AEO first" cannot mean "do AEO tactics first," because **the strongest available evidence says the famous AEO tactics do almost nothing.** The largest controlled study in existence (252,000 trials, six models — [arXiv 2605.25517](https://arxiv.org/abs/2605.25517), SIGIR '26) found **formatting had no reliable effect on citation**: *"Formatting choices (Content Structure, Scattered Information) had no impact, suggesting LLMs parse content regardless of visual organization."* Google says the same in its own documentation, bluntly: *"For Google Search, you can ignore tactics like 'chunking' content, creating unnecessary AI text files (like llms.txt), or pursuing inauthentic mentions"* ([Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)).

> ⚠️ **Read Google's scope qualifier, do not delete it.** Google wrote **"For Google Search,"** and meant it. That sentence is authoritative for Google surfaces and carries **no authority over ChatGPT, Perplexity or Copilot**, which are separate retrieval systems with separate crawlers (§4, §8). An earlier draft of this very document quoted the sentence *without* its opening scope and thereby turned a scoped vendor statement into a universal law — while §4 of the same document was busy proving Bing/Copilot *does* use schema. **The 252k-trial null is the general claim; Google's sentence is a Google claim.** They agree here, which is why the conclusion holds — but they are not the same evidence and must never be merged into one.

So if "AEO first" is implemented as *"add FAQ schema, chunk the content, ship an llms.txt, write answer-first paragraphs"* — we will have moved a ritual to the front of the pipeline and called it strategy. That is exactly the failure mode Abilash is trying to prevent ("I don't want to burn millions of tokens to find out we did very average work").

**The correction.** AEO-first is a **research stage, not a formatting stage.** Its output is not markup. Its output is *a validated inventory of the real questions our real audience asks, in their real words, in every market and language we serve, with the answer-surface and evidence requirement for each.* That inventory then **shapes the keyword map, the sitemap, and the content briefs.** The formatting stuff is real but it is small, it is late, and it is an audit — not a strategy.

**Therefore this document defines TWO separate things that our current doctrine confuses into one word:**

| | **AEO-R — AEO as up-front RESEARCH** | **AEO-A — AEO/GEO as a late AUDIT** |
|---|---|---|
| **What Abilash means by "AEO first"** | ✅ this | ❌ not this |
| When | Early — feeds keywords, sitemap, briefs | Late — on built pages, pre-ship |
| Question it answers | *What must exist, and why?* | *Did what we built actually work?* |
| Output | Question/entity/answer-surface inventory | PASS/FAIL report per page + per site |
| Failure cost if skipped | **Architectural. Unwindable only at the cost of URLs, redirects, rankings.** | Cosmetic-to-moderate. Fixable in place. |
| Status in repo today | **Does not exist.** | **Promised, does not exist** (`seo-aeo-geo-auditor` is named in `CLAUDE.md` rule (n), `M2_SHOPIFY_SETUP_PROMPT.md`, `SHOPIFY_TRACK_CONTEXT.md` — no implementation anywhere). |

Both are defined below. **AEO-R is the answer to the commission. AEO-A is the debt we already owe.**

---

## 1 · Evidence base — what I read, rated by how much to trust it

Abilash asked for named authorities, published research, and what practitioners actually say. Honesty about strength is the point of the exercise, so every source is tiered and every weakness is stated.

### Tier A — peer-reviewed / large-N controlled experiments

| Source | What it actually is | What it actually measured | How much to trust it |
|---|---|---|---|
| **[GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735)** — Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande. **KDD 2024.** arXiv 2311.09735, submitted 16 Nov 2023, rev. 28 Jun 2024. | The paper that coined GEO. **GEO-BENCH: 10K queries** (8K/1K/1K train/val/test) drawn from MS Marco, ORCAS-1, Natural Questions, AllSouls, LIMA, Davinci-Debate, Perplexity.ai Discover, ELI5, GPT-4-generated. Each query carries the cleaned text of Google's top-5 results. | 9 methods × visibility. Metrics: **Position-Adjusted Word Count** (word count of citing sentences, exponentially decayed by citation position) and **Subjective Impression** (7 GPT-3.5-judged sub-metrics). Engine: a **custom gpt-3.5-turbo harness** over Google's top 5, temp 0.7, 5 samples; plus a real-world check on Perplexity.ai. | **Foundational but dated and narrow.** Evaluated on GPT-3.5 in 2023 — two-plus generations behind what actually answers queries today. Authors' own limitations: methods *"may need to adapt over time as GEs evolve"*; *"We didn't evaluate how GEO methods affect search rankings"*; efficacy *"varies across domains, underscoring the need for domain-specific optimization methods."* **Use for direction, never for the per-method percentages.** |
| **[What Gets Cited: Competitive GEO in AI Answer Engines](https://arxiv.org/abs/2605.25517)** — Vishwakarma, Kumar, Jamidar. **SIGIR '26.** arXiv 2605.25517, 25 May 2026. **Independently verified to exist** (abstract + full HTML + search corroboration). | **The most decision-useful study we have.** Controlled two-document RAG testbed: inject exactly 2 candidate sources, measure which gets the *first* citation marker. **252,000 trials · 6 LLMs** (Gemini-2.5-Flash, GPT-5-Nano, GPT-5-Mini, GPT-5.2, Claude-3.5-Sonnet, Kimi-K2-Thinking). Sources differ in **exactly one of 18 factors**. Brand-anonymised; source order counterbalanced. | Causal-ish isolation of 18 content factors, mixed-effects models, odds ratios. | **Highest. This is the best experimental design in the field** — one-factor-at-a-time, anonymised brands, counterbalanced position. Authors' own limits: *"Production RAG often retrieves five to ten or more pages, so real citation pools are larger than our testbed"*; brand anonymisation means it cannot tell us *"how much residual preference remains"* for genuinely trusted domains; GPT-4o generated the corpus (3 authors stratified-reviewed 300 scenarios). **Believe its nulls especially** — nulls from a 252k-trial design are strong evidence of absence. |
| **[Diagnosing and Repairing Citation Failures in Generative Engine Optimization](https://arxiv.org/abs/2603.09296)** — Tian, Chen, Tang, Liu, Jia. arXiv 2603.09296, 10 Mar 2026. **Verified to exist.** | First taxonomy of citation failure modes across the citation pipeline; proposes AgentGEO. | AgentGEO: **>40% relative citation-rate improvement** while modifying **only 5% of content** (baselines modified 25%). | **Moderate.** Method paper with a self-proposed system — expect author-favourable results. **The framing is what's valuable, not the number:** the binding constraint is *non-citation*, not low-position citation. It also warns generic optimisation can *harm* long-tail content. |

### Tier B — large-N vendor studies (real data, published method, but the vendor sells the solution)

| Source | Sample | Findings | Trust |
|---|---|---|---|
| **[Ahrefs: We Analyzed 137K Sites — 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/)** | 137K domains, **server logs + live traffic**, May 2026 | **97% of llms.txt files received zero requests.** Of the 3% with any traffic: SEO audit tools 21.7%, other/unidentified 14.9%, general crawlers 13.1%, tech profilers 11.6%, and **12% was the industry studying itself** (GEO tools, llms.txt checkers, researchers). *"Zero requests came from AI bots for llms.txt files that don't exist. They never go looking."* | **High for this claim.** Server logs are hard evidence, and the finding is *against* Ahrefs' commercial interest in AI-visibility hype. |
| **[Ahrefs: Top Brand Visibility Factors in ChatGPT, AI Mode, and AI Overviews (75k brands)](https://ahrefs.com/blog/ai-brand-visibility-correlations/)** | 75,000 brands (DR>40, top keyword ≥800 vol), via Ahrefs Brand Radar, across ChatGPT + Google AI Mode + AI Overviews | **Spearman correlations with AI brand mentions:** YouTube mentions **~0.737** · branded web mentions **0.656–0.709** · branded anchors **0.511–0.628** · branded search volume **0.352–0.466** · Domain Rating **0.266–0.326** · backlinks **~0.194** · site pages **~0.194**. | **Correlational only — and the authors say so, twice.** Verbatim: *"Correlation isn't causation… We've spotted patterns between search metrics and AI mentions, but that doesn't mean improving these metrics will automatically boost your AI visibility."* Obvious confound: big brands have more of everything. **Directionally useful, causally worthless.** |
| **[SE Ranking: Health AI Overviews Trust YouTube Over Medical Platforms](https://seranking.com/blog/health-ai-overviews-youtube-vs-medical-sites/)** | **50,807 health prompts**, one-time snapshot **Dec 2025**, **German-language, Berlin geo** | **>82% of German health searches trigger an AI Overview.** Top cited: YouTube **4.43%** (20,621), ndr.de 3.04%, msdmanuals.com 2.08%, netdoktor.de 1.61%, praktischarzt.de 1.53%. **Reliable medical sources = 34.45%; not-designed-for-medical-accuracy = 65.55%. Government + academic ≈ 1%.** **Only 36% of AI-cited URLs are in Google's top 10; 54% top 20; 74% top 100.** | **High relevance, narrow generality.** Single market, single language, single snapshot, vendor-run. **But it is the closest study to our actual situation** — health YMYL, and KTAHV ships DE. The 36%-top-10 figure is the load-bearing one: **you cannot rank your way to citation.** |
| **[Profound: AI Platform Citation Patterns](https://www.tryprofound.com/blog/ai-platform-citation-patterns)** | 680M citations tracked; 27M analysed by category | Per-platform source skew: ChatGPT → **Wikipedia 47.9% of its top-10 sources**; Perplexity → Reddit-heavy; AI Overviews + Perplexity cite **7+ sources/response**, ChatGPT + Copilot **2–5**. | **Moderate.** Vendor sells AEO tooling. Numbers reported second-hand via search summary; **the underlying report was not fetched directly** — treat the specific percentages as indicative, not citable. |

### Tier C — official vendor positions (primary and authoritative *about their own product*)

| Source | Position — quoted |
|---|---|
| **[Google: AI Features and Your Website](https://developers.google.com/search/docs/appearance/ai-features)** | *"There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."* · *"You don't need to create new machine readable files, AI text files, or markup to appear in these features. There's also no special schema.org structured data that you need to add."* · **AI is built into Search**, so *"robots.txt directives for Googlebot is the control for site owners."* Display controls: `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex`. |
| **[Google: Guide to Optimizing for Generative AI Features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)** | *"Prioritize effective SEO strategies over 'AEO/GEO hacks'"* · **"For Google Search,** *you can ignore tactics like 'chunking' content, creating unnecessary AI text files (like llms.txt), or pursuing inauthentic mentions"* ← **the opening scope is part of the quote; do not drop it (§0)** · *"There's no requirement to break your content into tiny pieces for AI to better understand it"* · *"Don't just recycle what others on the internet have already said, or could easily be produced by a generative AI model"* · *"Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add."* (but keep it for SEO) · Measure with the **Generative AI performance report in Search Console**; *"Be wary of third-party tools that promise ranking success or claim to use 'internal' Google metrics."* |
| **[Google: Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)** | Controls whether crawled content trains **Gemini** and grounds Gemini Apps / Vertex AI. **Critical:** *"Google-Extended does not impact a site's inclusion in Google Search nor is it used as a ranking signal in Google Search."* *(Verified 15 Jul 2026. Note: this statement is **not** on the `overview-google-crawlers` page — cite `google-common-crawlers`.)* |
| **[OpenAI: bots documentation](https://developers.openai.com/api/docs/bots)** *(`platform.openai.com/docs/bots` now **301s** here — update stale links)* | **`OAI-SearchBot`** → surfaces sites in ChatGPT search. *"Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers."* **`GPTBot`** → **training only**; blocking *"doesn't affect search results."* **`OAI-AdsBot`** → ad landing-page validation; *"the data collected by OAI-AdsBot is not used to train generative AI foundation models."* **`ChatGPT-User`** → user-triggered fetch. |
| **[Perplexity: bots documentation](https://docs.perplexity.ai/guides/bots)** *(Perplexity's help-centre mirror returns **HTTP 403** to this agent; quotes below corroborated via search, primary docs page)* | **`PerplexityBot`** → *"designed to surface and link websites in search results on Perplexity. It is not used to crawl content for AI foundation models."* *"To ensure your site appears in search results, we recommend allowing PerplexityBot."* **`Perplexity-User`** → user-triggered page visit. |
| **[Anthropic: crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)** — *added 15 Jul 2026; v1 marked this UNVERIFIED, the gap is now closed* | **Three independently-controlled bots.** **`ClaudeBot`** → *"helps enhance the utility and safety of our generative AI models by collecting web content that could potentially contribute to their training."* (**training**) · **`Claude-SearchBot`** → *"navigates the web to improve search result quality for users. It analyzes online content specifically to enhance the relevance and accuracy of search responses."* (**search**) · **`Claude-User`** → *"supports Claude AI users. When individuals ask questions to Claude, it may access websites using a Claude-User agent."* (**user-triggered**) · All three: *"Anthropic's Bots respect 'do not crawl' signals by honoring industry standard directives in robots.txt."* **Blocks are discrete — blocking `ClaudeBot` does not block `Claude-SearchBot`.** ⚠️ **Honest limit:** unlike OpenAI, Anthropic does **not** explicitly state that blocking `Claude-SearchBot` removes you from Claude's answers. Treat it as a citation door **by inference, not by vendor statement** (§8). |
| **Microsoft / Fabrice Canel (Principal PM, Bing), SMX Munich, Mar 2025** — *primary source [searchengineland.com/…-453455](https://searchengineland.com/microsoft-bing-copilot-use-schema-for-its-llms-453455) returned **HTTP 403**; corroborated via [Search Engine Roundtable](https://www.seroundtable.com/schema-llms-copilot-bing-microsoft-39093.html)* | **Bing/Copilot DOES use schema markup** to help its LLMs understand content. Also: gen-AI *"value fresh content in particular, partly as a reference check of their LLM training data"*; push updates via **[IndexNow](https://www.indexnow.org/)**. **This directly contradicts Google's position — see §4.** Flagged as **well-corroborated secondary**, not primary. |

### Tier D — named practitioners (opinion, but from people with the receipts)

| Practitioner | Position | Use |
|---|---|---|
| **[Aleyda Solis — AI Search Optimization Checklist](https://www.aleydasolis.com/en/ai-search/ai-search-optimization-checklist/)** | 12 sequential steps, and **the order is itself the argument**: (1) define prompts & journeys → (2) measure current AI presence → (3) diagnose gaps → (4) ensure retrievability/extractability → (5) build decision-support content → (6) earn citations → (7) align entity signals → (8) audit third-party sources → (9) clarify commercial data → (10) **localize by market, not just language** → (11) report without overclaiming → (12) recurring validation loops. Extractability rule: *"The heading describes the question; the first sentence answers it directly; each section covers one idea and can stand alone."* Measurement discipline: *"Observed AI traffic, owned proxy signals, third-party proxy signals and modelled estimates are reported separately."* | **The single best practitioner template for AEO-R.** Steps 1–3 and 8 and 10 are research; they come before build. §6 borrows her spine and adds evidence gates. |
| **[Mike King / iPullRank — relevance engineering & query fan-out](https://ipullrank.com/how-ai-mode-works)** | AI Mode uses **query fan-out**: one query is expanded into a constellation of sub-queries ("prompted expansion") and answered from *passages*, not documents. *"LLMs retrieve and reason over small chunks of text, not whole documents."* Patent lineage: **US20240289407A1 "Search with Stateful Chat"** (Rofouei, Shukla, Liang et al., 29 Aug 2024), per [Search Engine Land's patent analysis](https://searchengineland.com/how-ai-mode-ai-overviews-work-patents-456346). | **Take the fan-out model; discount the chunking prescription.** Fan-out is the strongest argument for AEO-R: *your page is retrieved against sub-queries the user never typed*, so you must inventory the sub-questions in advance. But "therefore chunk your content" is contradicted by Google's docs *and* by the 252k-trial null. |
| **Patrick Stox (Ahrefs)** — [interview](https://unscriptedseo.com/patrick-stox-on-building-in-the-geo-era/) | Influencing AI systems is *"more than SEO"* — if an LLM says something wrong about your product, the fix usually isn't on-page, it's **the underlying product/reputation**, because these systems echo what people genuinely say online. | Supports putting **third-party source auditing** (Aleyda step 8) inside AEO-R. |
| **Rand Fishkin (SparkToro)** | Zero-click reality: **traffic is a bad goal.** | Directly relevant to how we measure — see §7.5 and §13 Q4. |

---

## 2 · The mental model — how answer engines actually pick and cite

Four structural facts, each carrying a design consequence. This is the "why" the whole stage hangs on.

**(1) Retrieval is per-passage; the unit competing is not your page.** Dense retrieval surfaces candidate passages, a ranking step picks among them, a synthesis model writes the answer ([iPullRank](https://ipullrank.com/how-ai-mode-works)). → *Consequence: a question with no addressable home does not compete.* This is an **IA decision**, which is exactly why AEO-R must precede the sitemap.

**(2) The query you optimise for is not the query the user typed.** Query fan-out expands one question into many sub-queries, including *"topics the user never explicitly mentioned"* ([Search Engine Land](https://searchengineland.com/guide/query-fan-out)). → *Consequence: keyword lists are the wrong primitive. **Question sets** are the right primitive.* A "keyword" is a string; a fan-out is a tree.

**(3) Ranking does not buy citation.** In German health queries only **36% of AI-cited URLs were in Google's top 10** ([SE Ranking](https://seranking.com/blog/health-ai-overviews-youtube-vs-medical-sites/)). Engines disagree with each other, hard: ChatGPT skews Wikipedia, Perplexity skews Reddit ([Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)). → *Consequence: "we rank #1" is not evidence of AEO success, and per-engine reality must be measured per-engine.*

**(4) The binding constraint is non-citation, not bad-position citation** ([arXiv 2603.09296](https://arxiv.org/abs/2603.09296)). → *Consequence: the audit's primary metric is a binary — cited / not cited — not a rank.*

---

## 3 · What actually drives citation — the evidence table

Ranked by evidence strength, not by how often SEO blogs repeat it. **This table is the technical heart of the document.**

| Factor | Evidence | Strength | What we do |
|---|---|---|---|
| **Topical relevance** (page is genuinely about the question) | Universal gatekeeper, all 6 models, **OR >>10k** ([2605.25517](https://arxiv.org/html/2605.25517v1)) | **A — proven** | One question-cluster → one addressable surface. **AEO-R decision.** |
| **Recency / recent timestamp** (recent vs old) | Universal gatekeeper, **OR 14.4–>>10k** ([2605.25517](https://arxiv.org/html/2605.25517v1)); Canel: gen-AI *"value fresh content… as a reference check"* | **A — proven** | Visible `dateModified` + real review cadence. Note the nuance below.† |
| **List position in the retrieval pool** | Universal gatekeeper, **pos-1 vs pos-2 OR 1,795–>>10k** ([2605.25517](https://arxiv.org/html/2605.25517v1)) | **A — proven** | Mostly *not* in our control. Classic SEO is the lever. **Honest limit.** |
| **Explicit commercial data** (price/terms stated vs absent) | Universal gatekeeper, **OR 6.26–>>10k** ([2605.25517](https://arxiv.org/html/2605.25517v1)) | **A — proven** | Huge for KAPPL/Shopify and Villa Raag. **Constrained for KTAHV — see §8.** |
| **Evidence-backed claims** (citations, data, specifics) | Secondary (4+ models), **OR 2.09–>>10k**; converges with GEO paper's *Cite Sources* / *Statistics Addition* | **A/B — strong, converging** | Evidence density is the #1 controllable lever. |
| **Comprehensive vs shallow coverage** | **OR 3.98–>>10k** ([2605.25517](https://arxiv.org/html/2605.25517v1)) | **A — strong** | Depth per surface beats page count. Argues **against** thin 3,400-page inflation. |
| **Confident vs hedged language** | **OR 2.67–754** ([2605.25517](https://arxiv.org/html/2605.25517v1)) | **A — strong, but DANGEROUS for us** | ⚠️ **Conflict.** Confidence wins citations; medical honesty requires hedging. **KTAHV/whatisayurveda: honesty wins. Do not chase this.** Escalated as §13 Q3. |
| **Missing specifications** | **OR 8.63–243** | **A — strong** | Complete spec/attribute coverage per entity. |
| **Keyword gap** (query terms absent) | **OR 5.99–40.0** | **A — strong** | The audience's *actual words* must appear. **This is the AEO-R ↔ keyword-map bridge.** |
| **Internal contradictions** | **OR 1.74–4.09** | **A — moderate** | Cross-page fact consistency. Our LOCKED FACTS discipline already serves this. |
| **Comparisons with alternatives** | **OR 1.61–7.45** | **A — moderate** | Comparison surfaces earn citation. |
| **Brand/entity strength off-site** (web mentions, YouTube) | Correlation **0.66–0.74** ([Ahrefs 75k](https://ahrefs.com/blog/ai-brand-visibility-correlations/)) — *authors: "correlation isn't causation"* | **B — correlational only** | Real, but **not a site-build lever.** Belongs to PR/YouTube, not to this pipeline. Do not promise it as a build outcome. |
| **Schema / structured data** | **Contested.** Google: *"no special schema.org structured data that you need to add."* Microsoft/Bing: **yes, Copilot uses it.** | **C — engine-specific** | Ship it — for Bing/Copilot, entity clarity, and classic rich results. **Never report it as an AEO win.** §9. |
| **Content structure / visual organisation / formatting** | **NULL. No reliable effect** across 252k trials: *"Formatting choices (Content Structure, Scattered Information) had no impact, suggesting LLMs parse content regardless of visual organization."* Google (**scoped to Google Search**): *"For Google Search, you can ignore tactics like 'chunking' content…"* | **A — proven ineffective** | ⚠️ **Keep answer-first writing — for HUMANS and for snippet extraction. Never claim it as a citation lever.** §11. |
| **`llms.txt`** | **97% get zero requests**; AI retrieval bots ~1.1% of a tiny fetch volume ([Ahrefs 137K](https://ahrefs.com/blog/llmstxt-study/)); Google does not support it; Mueller compared it to the **meta keywords tag** | **A — proven near-worthless** | Costs nothing, already shipped. **Not an AEO deliverable. Never counted as a gate pass.** §10. |
| **Keyword stuffing** | **−8%** — actively harmful ([GEO paper](https://arxiv.org/html/2311.09735v3)) | **A — proven harmful** | Banned. Already banned. |

**† The freshness nuance everyone misses.** The 252k study found *recent-vs-old timestamp* is a universal gatekeeper — **but "no timestamp vs old timestamp" and "recent vs no timestamp" were both NULL.** Read carefully: the win comes from a **visible recent date beating a visible stale date**, not from having a date at all. **Implication: a fake or cosmetic `dateModified` bump is not just dishonest, it is not even the mechanism.** Real review cadence with real changes, or nothing.

**⚠️ The number everyone repeats, which we will not.** *"Statistics and citations improve AI visibility 30–40%"* is quoted endlessly by vendors and traces to the GEO paper's **best-case framework-level "up to 40%"** headline — measured on **GPT-3.5 in 2023** via a **proxy metric** (Position-Adjusted Word Count), not per-method truth in production engines today. Per-method figures do exist in the paper (Quotation Addition +41%, Statistics Addition +33%, Fluency +29%, Cite Sources +28%, Keyword Stuffing **−8%**) but they are **PAWC deltas on a 2023 GPT-3.5 harness** and must never be restated as "X% more citations." The defensible claim, which the 252k-trial odds ratios independently support: **evidence density materially raises citation odds; the multiplier is unestablished.**

---

## 4 · Where credible experts disagree — and who is right for us

**Disagreement 1 — Google vs the GEO industry: "does AEO exist?"**
Google says no special optimisation exists; do good SEO. The GEO camp says citation is a distinct objective with distinct drivers.
**Who is right for us: BOTH, and the split is clean.** Google is right *about Google* — AI Overviews and AI Mode run on core Search systems and Googlebot; there is no separate door. The GEO camp is right *about everything else* — ChatGPT (`OAI-SearchBot`), Perplexity (`PerplexityBot`), and Copilot are separate retrieval systems with separate crawlers, separate source preferences, and separate opt-outs, and Google's documentation has no authority over them. **And the 36%-top-10 health finding proves the objectives genuinely diverge even on Google.** Our doctrine: *treat Google's guidance as binding for Google surfaces; treat GEO evidence as binding for non-Google engines; never let either camp's marketing set our gates.*

**Disagreement 2 — schema: Google says unnecessary, Microsoft says used.**
**Who is right for us: both, so we ship schema.** It is cheap, it is Bing/Copilot-positive on Microsoft's own record, it disambiguates entities, and Google says it's harmless-and-useful-for-SEO even while denying it's an AI requirement. **But it is a hygiene item, not a strategy, and it must never appear in a report as the reason we won.**

**Disagreement 3 — structure/chunking: iPullRank says structure for retrieval; Google + the 252k study say it doesn't matter.**
**Who is right for us: the study and Google — on the citation question.** iPullRank's *mechanism* (passage retrieval, fan-out) is correct and valuable; the *inference* ("therefore format for the machine") is not supported. **Resolution: we keep answer-first, one-idea-per-section writing — Aleyda's rule — but for the honest reason: it serves humans, featured snippets, and our own reviewers. It is not an AEO lever and will not be scored as one.** This is precisely the kind of folklore-vs-evidence call this stage exists to make.

**Disagreement 4 — Abilash vs the evidence: "AEO should technically be FIRST."**
**Who is right: Abilash on the slot, the evidence on the content.** See §0. His instinct identifies a real architectural gap; the correction is that the early stage is *research*, not *tactics*. **Intent preserved exactly; method corrected by proof.** That is what he asked for ("keep his INTENT, refine with proof").

---

## 5 · Where AEO-R lands in the stage order — and a conflict that must be resolved

⚠️ **Two sibling documents in this same directory number the stages differently, and both were written today:**

- `docs/process/research-practitioner-sequencing.md` → **S0** LEGACY MINE · **S1** ALIGN · **S2** AUDIENCE · **S3** DEMAND · **S4** VALIDATE · **S5** ARCHITECTURE/SITEMAP · **S6** CONTENT MODEL · **S7** DESIGN · **S8** BUILD · **S9** EVIDENCE GATE · **S10** LAUNCH · **S11** MEASURE
- `docs/process/research-sitemap-ia.md` → sitemap is **S6**, keywords are **S5**, with a new **S5.5 KEYWORD DATA VALIDATION**

**These cannot both be right, and Abilash's whole commission is "LABEL THEM CLEARLY so you understand which step to enter."** A pipeline whose own stage IDs collide fails that requirement on day one. **This document therefore refuses to pick a number** and anchors to **named** stages. Reconciling the numbering is a blocking task for whoever assembles the final matrix. Escalated as §13 Q1.

**AEO-R's position, stated in names, not numbers:**

```
LEGACY MINE  →  ALIGN  →  AUDIENCE  →  ┌─────────────────┐  →  DEMAND      →  KEYWORD DATA   →  ARCHITECTURE  →  …
 (existing      (company)  (who they    │     AEO-R       │     (keywords,     VALIDATION       (SITEMAP)
  domains)                  are)        │ question/entity │      volumes)       (blocking)
                                        │ answer-surface  │           ▲                              ▲
                                        │   inventory     │           │                              │
                                        └────────┬────────┘     shapes it                     shapes it
                                                 └──────────────────────┴──────────────────────────────┘
```

**AEO-R sits AFTER audience research and BEFORE keyword research.** This is the precise, load-bearing claim of this document, and the reasoning is:

- **It cannot precede audience.** A question inventory requires knowing whose questions. Aleyda's step 1 is *"define prompts and journeys that matter to the business"* — that presupposes the audience work. Putting AEO literally first would produce questions from nowhere.
- **It must precede keywords.** This is the correction that catches our real failure (§9). Keyword tools take **seeds**. If the seeds come from an agent's imagination, everything downstream is fiction. **AEO-R's question inventory IS the seed list** — harvested from real surfaces (PAA, autocomplete, forums, our own inbox), never invented. *You cannot invent a People-Also-Ask result; the engine either returned it or it didn't.*
- **It must precede the sitemap.** Whether a question earns a URL or becomes an H2 inside a parent is an AEO decision made at architecture time, because retrieval is per-passage and addressability is set by the sitemap.

**So Abilash's "AEO first" becomes, precisely: AEO-R is the first stage that touches search at all — it comes before keywords, and keywords no longer start the pipeline.** That is a genuine and large change from how we work today, and it is his idea.

---

## 6 · **AEO-R** — AEO as up-front research *(this is what "AEO first" means)*

### 6.1 Purpose (one sentence)

**Produce a validated inventory of the real questions our real audience asks — in their real words, in every market and language we serve — mapped to the answer surface that must exist and the evidence that surface must carry; and hand that inventory to keyword research, the sitemap, and the content briefs as their binding input.**

### 6.2 Inputs (entry conditions — AEO-R may not start without these)

| # | Input | Source | Hard? |
|---|---|---|---|
| I1 | Entity + register declaration (KTAHV clinical / Villa Raag wellness-hospitality / KAPPL product-pharma / group-corporate) | `CLAUDE.md` | **BLOCKING** |
| I2 | Audience definition + research output | AUDIENCE stage |  **BLOCKING** |
| I3 | Market × locale matrix (e.g. KTAHV = EN/DE/FR; India = EN **+ Hindi + Devanagari + Hinglish**) | site brief | **BLOCKING** |
| I4 | Legacy mine + protection map (existing domains only) | LEGACY MINE stage | BLOCKING if domain exists |
| I5 | Commercial goal / what the site must sell | ALIGN stage | **BLOCKING** |
| I6 | Named human fact-owner (for KTAHV/whatisayurveda: **Dr. Deepu John**) | roster config | **BLOCKING for medical** |

### 6.3 Method — six sub-steps, executed one at a time, each with its own exit evidence

Adapted from Aleyda Solis's steps 1–3, 8, 10, hardened with evidence gates that our own failure history demands.

---

#### **AEO-R.1 — PROMPT & JOURNEY DEFINITION**
*"What questions decide whether this business wins?"*

- Enumerate the **decision prompts** — not topics. A decision prompt is a question whose answer moves someone toward or away from us (*"is Panchakarma safe for hypertension?"*, *"how long is an authentic Panchakarma programme?"*).
- Map each to a journey position: unaware → problem-aware → solution-aware → provider-aware → decision.
- **Register lock applies from the first line.** KTAHV prompts are written and answered in the clinical register — patient, physician, treatment, programme, admission. Banned words (spa, resort, holiday, luxury, cure, journey, guests) must not enter via a mined question, **in any locale** (DE: Kur/Urlaub/Luxus; FR: cure/vacances/luxe in the banned senses). ⚠️ **Mined questions are user language — users will absolutely ask "is it a luxury spa?". We answer the intent in the compliant register; we never adopt the banned word.** Flag such prompts explicitly rather than silently dropping them — dropping them loses the demand signal.
- **Exit evidence:** prompt list, each tagged journey-position + business-impact, committed to `docs/<entity>-inputs/aeo-r/prompts.md`.

---

#### **AEO-R.2 — QUESTION MINING AT SCALE (harvest, never invent)** ★ **the anti-hallucination stage** ★

**The rule that makes this stage worth having: every question must carry a provenance record proving a real surface returned it.** An invented question is a defect, not a draft.

| Surface | Method | Provenance artifact |
|---|---|---|
| **People Also Ask** | [AlsoAsked](https://alsoasked.com/) — automates PAA expansion into a branching tree. Its questions *"are not algorithmically generated — they represent actual searches Google has deemed contextually related."* PAA regenerates on expansion, so manual capture is unreliable. | raw export + timestamp + geo + language |
| **Autocomplete** | Per-locale, per-geo suggest scrape | raw export + timestamp + geo + language |
| **Question-cluster discovery** | [AnswerThePublic](https://answerthepublic.com/en) — who/what/where/when/why/how + preposition + comparison clusters | raw export |
| **Communities in the audience's own words** | Reddit / forums / Quora / YouTube comments. **Perplexity is Reddit-heavy** ([Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)), so this is both a language source *and* a citation-surface source. ⚠️ **This agent cannot reach reddit.com** (§12) — needs a human or a tool. | thread URLs + quoted text |
| **YouTube** | Question-shaped titles + transcripts in our topics. Ahrefs' **highest** AI-visibility correlate (0.737) — correlational, but cheap to mine. | video URLs + transcript excerpts |
| **Our own reality** | Sales/enquiry inbox, WhatsApp enquiries (Priya's KTAHV line **+91 92898 38797**), call logs, on-site search | anonymised extracts — **PII stripped; no patient data leaves the source system** |
| **Live answer engines** | Run the prompts through ChatGPT / Perplexity / AI Overviews / Gemini / Copilot and record who gets cited **today**. This is Aleyda's steps 2, 3 and 8 combined, and it doubles as the AEO-A baseline. | screenshots or logged responses + date |

- **Locale discipline (Aleyda step 10: *"localize by market, not just language"*):** every market is mined **in its own languages and scripts**. India means **English + Hindi + Devanagari + Hinglish**, separately. Germany means German, from a German geo. **This is the exact control that catches our amla failure.**
- **Exit evidence:** `questions.csv` — one row per question, columns: `question` · `source_surface` · `source_url_or_export` · `locale` · `script` · `geo` · `captured_at_IST` · `provenance_file`. **A row without provenance is a lint failure.**

---

#### **AEO-R.3 — ENTITY & ONTOLOGY BUILD**

- Extract the entities the questions are *about*: conditions, treatments, herbs, formulations, texts, centres, physicians, programmes, products.
- **Disambiguate.** Ayurveda is an entity-disambiguation minefield: *amla / amalaki / Indian gooseberry / Phyllanthus emblica / आंवला* are one entity with five names; *Kairali* is a brand, a language-adjacent word, and other businesses. **This is the same defect as the compound fake seeds, seen from the ontology side** — the agent that wrote "amla amalaki" was fusing two names of one entity into a string nobody types. **An entity table would have made that impossible.**
- **Give every entity an Entity Home** — [Jason Barnard / Kalicube](https://kalicube.com/learning-spaces/faq-list/brand-serps/entity-home-in-seo-explainer/): *"You need to give every entity a home… one single point of reference for Google to cross-check all the information about you that it finds around the web."* Barnard: *"Structured data gives you the closest you will ever get to control of your entity in Google's mind."* Use `sameAs` for parsable authority sources (Wikipedia, Wikidata), `url` for pages about the entity.
- **Ontology, not just a list:** parent/child, synonym/alias (per script), related-entity edges. This becomes the internal-link graph and the schema `about`/`mentions` graph.
- **Exit evidence:** `entities.csv` — `canonical_name` · `aliases[]` (per locale + script) · `type` · `parent` · `entity_home_url` · `sameAs[]` · `disambiguation_note`.

---

#### **AEO-R.4 — ANSWER-SURFACE MAPPING** *(the handoff to the sitemap)*

For each question cluster, decide **one** fate — this is the AEO decision that is really an IA decision:

| Fate | Meaning | Test |
|---|---|---|
| **OWN-URL** | Deserves its own addressable page | Distinct intent + enough substance for comprehensive coverage (**OR 3.98–>>10k**) + real search/prompt demand |
| **SECTION** | H2 inside a parent page | Same intent family; would be thin alone |
| **HUB** | A parent that organises children | ≥N children with shared intent |
| **OFF-SITE** | Won on a third-party surface (YouTube, a community, a directory) | We will not be the cited source no matter what we publish — **say so honestly** |
| **DECLINE** | We will not answer it | Out of register, out of scope, or **clinically unsafe to answer** |

- ⚠️ **The anti-inflation rule.** Comprehensive coverage beats shallow coverage by **OR 3.98–>>10k**; the citation-repair paper warns generic optimisation can *harm long-tail content*. **Therefore OWN-URL requires evidence, and "we planned 3,400 pages" is not evidence.** A page count is an output of this step, never an input to it. *(This directly disciplines the whatisayurveda 3,400-page target, which was set from the corrupted demand map.)*
- **Exit evidence:** `answer-surfaces.csv` — `question_cluster` · `fate` · `rationale` · `parent` · `provisional_url` · `locales[]`.

---

#### **AEO-R.5 — EVIDENCE & AUTHORITY REQUIREMENT PER SURFACE**

Because evidence density is the top controllable lever (§3), and because we are YMYL:

- Per surface, specify: what **claims** it makes · what **evidence** each claim requires (classical text, clinical study, pharmacopoeia, NABH/WHO-GMP fact, internal fact) · **author** · **reviewer** · **review cadence**.
- **YMYL/E-E-A-T:** Google's Quality Rater Guidelines require, for medical topics, identifiable authors with real credentials and expert review ([General Guidelines, 11 Sep 2025](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)). Reviewer identity comes from **config/roster, never hard-coded** (existing ruling) — head physician can change.
- **`MedicalWebPage` + `reviewedBy` + `lastReviewed`**: no dedicated Google rich result exists for it ([schema.org/MedicalWebPage](https://schema.org/MedicalWebPage)), so **ship it for credentialing/freshness signalling and entity clarity — never claim a rich result.**
- ⚠️ **The confidence trap.** Confident language beats hedged language (**OR 2.67–754**). **We do not take this trade.** For KTAHV and whatisayurveda, false confidence about a health claim is a clinical, legal and GST-language risk that dwarfs a citation gain. **Doctrine: hedge where the evidence hedges. Accept the citation cost. Say so out loud in reports rather than quietly optimising it away.** (§13 Q3 asks Abilash to ratify this trade explicitly, because it is a decision to lose something measurable.)
- **Exit evidence:** `evidence-plan.csv` + **Dr. Deepu John's named sign-off on the claim list** for any clinical surface, *before content is written* — not after.

---

#### **AEO-R.6 — AI-CRAWLER POLICY DECISION** *(per site, decided once, early, by a human)*

Must be decided **before** build, because it is a business/legal decision with a visibility price, and because it changes what we can promise. See §7 for the full analysis and the recommended default.

- **Exit evidence:** signed policy row per site in `docs/infra/ai-crawler-policy.md` + the `robots.txt` diff it implies. **Robots.txt is a CLAUDE.md rule-3 file — agent prepares, human approves.**

### 6.4 AEO-R exit gate (all must be machine-verifiable)

| # | Gate | Evidence | Fail → |
|---|---|---|---|
| G1 | **Every question has provenance** — real surface, real timestamp, real locale | `questions.csv` provenance columns 100% populated; spot-check N rows against raw exports | BLOCK |
| G2 | **Every market mined in its own languages + scripts** | per-locale row counts > 0 for every locale in I3; **India shows Devanagari rows** | BLOCK |
| G3 | **Zero invented/compound seeds** | every seed traces to a harvested surface; **compound multi-name strings flagged and killed via `entities.csv` aliases** | BLOCK |
| G4 | **Zero-volume / zero-result claims are verified, not assumed** | any "no demand" conclusion carries a second-source check; **an unexplained zero is a BLOCKING finding, never a summable number** | BLOCK |
| G5 | **Every entity has a home + disambiguated aliases** | `entities.csv` complete | BLOCK |
| G6 | **Every question cluster has exactly one fate** | `answer-surfaces.csv` complete; no unassigned clusters | BLOCK |
| G7 | **Clinical claim list signed by Dr. Deepu John** *(medical sites)* | named sign-off, timestamped IST | BLOCK |
| G8 | **Crawler policy signed by a human** | `ai-crawler-policy.md` row + robots diff | BLOCK |
| G9 | **Register-compliant** | banned-word scan over the prompt list, **all locales** | BLOCK (KTAHV) |
| G10 | **Adversarial audit passed** | `scripts/audit-gpt.mjs` PASS + **`scripts/audit-perplexity.mjs` fact-grounding PASS** on the inventory | BLOCK |

**G10 is the one that would have caught the DataForSEO disaster.** GPT-5 caught it once already — after the fact. Wiring both auditors into the *entry* gate for keyword research is how we stop paying for that lesson twice. Perplexity is the right auditor here specifically because it has **live search + citations** and can check "does anyone actually search this / does this entity exist under this name" against the live web — which is precisely the check "turmeric curcumin" failed.

---

## 7 · **AEO-A** — AEO/GEO as a late audit *(the `seo-aeo-geo-auditor` we already promised)*

**Debt notice — restated from machine evidence (Appendix B.4).** `CLAUDE.md` rule (n) requires `seo-aeo-geo-auditor` to run *"after EVERY build/visual change… and attach both PASS/FAIL reports as evidence."* It is referenced in `M2_SHOPIFY_SETUP_PROMPT.md`, `SHOPIFY_TRACK_CONTEXT.md`, `QUESTIONS.md` and `CLAUDE.md`.

**The precise state, verified 15 Jul 2026:** a **specification exists** at `shopify-agents/seo-aeo-geo-auditor.md` (alongside `content-geo-writer.md`, `design-qa.md`, `logger.md`). **There is no `.claude/agents/` directory**, so none of them is wired as an invocable sub-agent, and **no executable implements any of them** (`grep -rln "seo-aeo-geo-auditor" --include="*.mjs" --include="*.js" --include="*.ts" --include="*.json"` → no matches). Per doctrine (f) — *"doctrine written in a .md file is ZERO evidence the rule was executed"* — **rule (n) is unexecutable as written, and every claim of compliance with it to date is unverified.**

> 🔍 **The v1 draft of this section said "Grep confirms no implementation exists anywhere in the repo." That was false** — `shopify-agents/seo-aeo-geo-auditor.md` exists. The **conclusion** was right; the **stated evidence** was wrong. Logged as defect **V5** (Appendix B.2), and worth pausing on: the sentence that mis-stated its own grep was the sentence condemning *"declaring a rule binding in a .md file while its enforcement was never built."* **The failure mode in the commission is not a story about a past agent. It is live, it is recursive, and it caught this document too.** That is the strongest possible argument for the adversarial gate in §6.4 G10 — an unaudited claim decays into folklore *inside a single working day*, even in a document whose entire subject is not doing that.

This section specifies the auditor so it can actually be built. **`scripts/audit-gpt.mjs` and `scripts/audit-perplexity.mjs` both already exist**, so the G10 adversarial gate is buildable today.

### 7.1 Design principles

1. **Binary primary metric.** Cited / not cited — not rank (per [2603.09296](https://arxiv.org/abs/2603.09296): non-citation is the binding constraint).
2. **Per-engine, because engines disagree.** One aggregate "AI visibility score" is a lie by construction.
3. **Score only what evidence supports.** Formatting checks are **hygiene (unscored)**, not levers. **Refusing to score folklore is the point.**
4. **Never weaken a gate to pass it** (doctrine g).
5. **Report tiers separately** (Aleyda step 11): observed AI traffic · owned proxy signals · third-party proxy signals · modelled estimates. **Never blend them into one number.**

### 7.2 PER-PAGE audit checklist — runnable against ANY Kairali site

Machine-checkable unless marked 👤. **Scored** items are evidence-backed; **hygiene** items are required but never credited as AEO wins.

**A · Retrievability (BLOCKING — a page that can't be fetched can't be cited)**
- [ ] A1 Returns 200; not `noindex`; canonical self-referential — *blocking*
- [ ] A2 Primary content in server-rendered HTML (not JS-only) — *blocking*
- [ ] A3 Allowed for the crawlers our §6.3.6 policy says we allow — verify **actual `robots.txt` parse**, per user-agent, not intent — *blocking*
- [ ] A4 No `nosnippet` / restrictive `max-snippet` on pages we want cited — Google: *"More restrictive permissions will limit how your content is featured in our AI experiences"* — *blocking*
- [ ] A5 `data-nosnippet` used **only** where deliberate — *blocking*
- [ ] A6 In XML sitemap with accurate `lastmod` — *blocking*

**B · Content-match & substance (SCORED — this is where citations are actually won)**
- [ ] B1 Page answers its assigned AEO-R question cluster — **topical relevance, OR >>10k**
- [ ] B2 The audience's actual query terms appear (from `questions.csv`, per locale) — **keyword gap, OR 5.99–40.0**
- [ ] B3 Claims carry evidence — citation, data, or named source — **OR 2.09–>>10k**
- [ ] B4 Coverage is comprehensive vs competitor set, not shallow — **OR 3.98–>>10k**
- [ ] B5 Specifications/attributes complete for the entity — **OR 8.63–243**
- [ ] B6 Comparison with alternatives present where the intent is comparative — **OR 1.61–7.45**
- [ ] B7 No internal contradictions; consistent with LOCKED FACTS + sibling pages — **OR 1.74–4.09**
- [ ] B8 Commercial data explicit where lawful and applicable — **OR 6.26–>>10k**. ⚠️ **KTAHV: treatment pricing is a GST/clinical-language question — human ruling required (§13 Q2). Do not auto-fail KTAHV on B8.**
- [ ] B9 Non-commodity: *"Don't just recycle what others… have already said, or could easily be produced by a generative AI model"* — 👤 **human/AI-judge, and this is our AI-filler gate**

**C · Freshness (SCORED)**
- [ ] C1 Visible `dateModified` **and** it reflects a real substantive change — **recent-vs-old is a universal gatekeeper**; ⚠️ **cosmetic date bumps are banned — "no date vs old date" and "recent vs no date" were both NULL, so the trick doesn't even work**
- [ ] C2 Review cadence met per `evidence-plan.csv`; overdue → flag
- [ ] C3 `lastReviewed` + `reviewedBy` present and current *(medical pages)*
- [ ] C4 IndexNow ping on publish/update *(Bing/Copilot — Canel)*

**D · Authority & E-E-A-T (SCORED for YMYL)**
- [ ] D1 Named author with real, verifiable credentials
- [ ] D2 Named reviewer from roster config *(medical)* — **never hard-coded**
- [ ] D3 Author/reviewer have entity homes + `sameAs`
- [ ] D4 Sources cited are authoritative and resolve (200)

**E · Entity clarity (HYGIENE + entity-scored)**
- [ ] E1 Entity present in `entities.csv`; page is or links to its Entity Home
- [ ] E2 Aliases/synonyms handled per locale + script
- [ ] E3 `Organization` / `Person` / `MedicalWebPage` / `Product` schema valid and **matching visible content**
- [ ] E4 `sameAs` → parsable authorities (Wikipedia/Wikidata); `url` → pages about the entity

**F · Structured data (HYGIENE — never scored as an AEO win)**
- [ ] F1 Schema validates (Rich Results Test / schema.org validator)
- [ ] F2 Type appropriate — **see §9 table**
- [ ] F3 **No FAQPage shipped expecting a rich result** — deprecated **May 2026** (docs removed 15 Jun 2026); harmless to keep, **must not be counted**
- [ ] F4 Schema never contradicts visible content

**G · Extractability (HYGIENE — for humans and snippets, explicitly NOT an AEO lever)**
- [ ] G1 Heading describes the question; first sentence answers it (Aleyda)
- [ ] G2 One idea per section; sections stand alone
- [ ] G3 ⚠️ **Reported as UX/snippet hygiene. NEVER reported as a citation lever** — *"Formatting choices (Content Structure, Scattered Information) had no impact"* (252k trials); Google, scoped to its own surfaces: *"For Google Search, you can ignore tactics like 'chunking' content…"*

**H · Register & compliance (BLOCKING)**
- [ ] H1 Register correct for entity (KTAHV clinical / Villa Raag wellness-hospitality / KAPPL product-pharma / group-corporate)
- [ ] H2 Banned-word scan clean — **all locales, DE/FR equivalents included** *(KTAHV only; never cross-applied)*
- [ ] H3 Locked facts correct — `info@kairali.com`; **+91 92898 38797** (…38777 is a fix-on-sight defect)
- [ ] H4 All required locales shipped, or explicitly flagged EN-only-pending-translation
- [ ] H5 No invented facts — IDs, prices, distances, phones, emails all trace to env/content files

### 7.3 PER-SITE audit checklist

**S · Site-level**
- [ ] S1 `robots.txt` matches the signed crawler policy — **parsed per user-agent, not eyeballed**
- [ ] S2 XML sitemap complete, `lastmod` honest, no orphans vs `answer-surfaces.csv`
- [ ] S3 Every AEO-R OWN-URL exists; every OFF-SITE/DECLINE is still deliberate
- [ ] S4 hreflang complete and reciprocal across locales
- [ ] S5 Entity graph: every entity has exactly one home; no duplicates/cannibalisation
- [ ] S6 No fact contradicts across pages (cross-page LOCKED-FACTS scan)
- [ ] S7 `llms.txt` — **if present, listed as neutral. Never a pass criterion.** (97% never read)
- [ ] S8 Search Console **Generative AI performance report** connected *(Google's own recommended measurement)*
- [ ] S9 Legacy protection map honoured: every legacy URL KEEP/MERGE/301, single-hop, no rich→thin redirects

**M · Live-engine measurement (the only real AEO evidence)**
- [ ] M1 Run the AEO-R priority prompts against **ChatGPT · Perplexity · Google AI Overviews · Google AI Mode · Gemini · Copilot**
- [ ] M2 Record per engine: **cited? (binary)** · position · what was said about us · **who got cited instead**
- [ ] M3 Diff against the AEO-R.2 baseline (that baseline is why AEO-R captured it)
- [ ] M4 Third-party sources shaping our answers audited (Aleyda step 8) — because Stox is right that the fix is often off-page
- [ ] M5 Report tiers **separately**; **no blended "AI visibility score"**
- [ ] M6 ⚠️ Sampling honesty: engines are non-deterministic. **N runs, report variance, never a single-run claim.** A one-shot screenshot is not evidence.

### 7.4 Verdict rules

- Any **BLOCKING** item fails → **FAIL**, page does not ship.
- **SCORED** items → per-page score with the *evidence tier printed next to each* so nobody mistakes hygiene for a lever.
- **HYGIENE** items → required, listed, **contribute zero to the AEO score**. *This is deliberate: it makes it structurally impossible to report "we added FAQ schema and an llms.txt" as an AEO win.*
- Exit code **2 on FAIL** — matching `scripts/audit-gpt.mjs` so it gates CI.

### 7.5 What AEO-A must never claim

- ❌ "AI visibility up X%" from a correlational study.
- ❌ "+30–40% from statistics" — that number is a 2023 GPT-3.5 PAWC delta (§3).
- ❌ Any citation win credited to llms.txt, FAQ schema, or chunking.
- ❌ A single-run engine screenshot as proof (M6).
- ❌ Traffic as the success metric — Fishkin's point stands: in a zero-click world, traffic is a bad goal. **Cited/not-cited + what was said about us are the real metrics.**

---

## 8 · AI-crawler policy — the trade-off, and the recommended default

**The strategic fact that most write-ups get wrong: training access and citation access are different doors, and you can take one without the other.**

| Bot | Door | Blocking costs us | Blocking gains us |
|---|---|---|---|
| **`OAI-SearchBot`** | **Citation** in ChatGPT search | ⚠️ *"Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers"* | nothing |
| **`GPTBot`** | **Training** only | nothing for search — *"doesn't affect search results"* | content not used to train OpenAI foundation models |
| **`ChatGPT-User`** | User-triggered fetch | user can't pull our page into a chat | little |
| **`OAI-AdsBot`** | Ad landing-page validation | ChatGPT ads (if ever used) | nothing (explicitly not training) |
| **`PerplexityBot`** | **Citation** — *"not used to crawl content for AI foundation models"* | Perplexity visibility | nothing |
| **`Perplexity-User`** | User-triggered | user-initiated visits | little |
| **`ClaudeBot`** | **Training** (Anthropic) — *"collecting web content that could potentially contribute to their training"* | nothing for citation | training opt-out |
| **`Claude-SearchBot`** | **Search** — *"navigates the web to improve search result quality… relevance and accuracy of search responses"* | ⚠️ **likely Claude citation visibility** — see the honest limit below | nothing |
| **`Claude-User`** | User-triggered fetch when a Claude user asks | user can't pull our page into a chat | little |
| **`Google-Extended`** | **Gemini training + Gemini/Vertex grounding ONLY** | ⚠️ **NOT Search. NOT AI Overviews.** Google: *"Google-Extended does not impact a site's inclusion in Google Search nor is it used as a ranking signal in Google Search."* | Gemini training opt-out **at zero Search cost** |
| **`Googlebot`** | **Everything Google, including AI Overviews & AI Mode** | ☠️ **all of Google Search.** *"AI is built into Search… which is why robots.txt directives for Googlebot is the control."* **There is no AI-Overviews-only opt-out.** | nothing sane |

**Recommended default for all Kairali revenue and lead-gen sites — ALLOW the citation bots, DECIDE on the training bots:**

```
ALLOW:  Googlebot, Bingbot,
        OAI-SearchBot, PerplexityBot, Claude-SearchBot,     ← the citation door
        ChatGPT-User, Perplexity-User, Claude-User          ← user-triggered fetches
DECIDE: GPTBot, ClaudeBot, CCBot, Google-Extended           ← training. business/legal call, not a technical one
```

**Reasoning:** blocking a citation bot is a pure loss for a business that wants to be found. The training bots are a genuine trade with no measurable short-term visibility cost — **and `Google-Extended` is the cleanest case in the whole table: opting out of Gemini training costs us literally nothing in Search or AI Overviews on Google's own written record.** If Abilash has any view at all on Kairali's proprietary content (clinical protocols, formulation knowledge, KTAHV's NABH-accredited method) being absorbed into foundation models, `Google-Extended` is a free "no."

> 🔧 **Correction, 15 Jul 2026 (defect V6).** The v1 table listed a single Anthropic bot — `ClaudeBot`, marked "training", policy unverified — and parked it in DECIDE. **Anthropic actually runs three bots with discrete robots.txt controls**, and one of them (`Claude-SearchBot`) is a *search* bot. A "block ClaudeBot" instinct that swept up the search bot would have **silently closed a citation door while believing it was only declining training** — the precise mistake this table exists to prevent, sitting inside the table itself. **Blocks are independent: blocking `ClaudeBot` does not block `Claude-SearchBot`.** The training/citation split is therefore available across *all three* major non-Google engines, not two.

⚠️ **Honest limits.** (a) `robots.txt` is a request; non-compliant crawlers exist and only a WAF/server rule actually stops them. (b) **Anthropic does not publish an OpenAI-style guarantee.** OpenAI states plainly that opted-out sites *"will not be shown in ChatGPT search answers"*; Perplexity *"recommend[s] allowing PerplexityBot"* to appear in results. **Anthropic says only that `Claude-SearchBot` improves "search result quality" — it does not state that blocking it removes you from Claude's answers.** So `Claude-SearchBot`'s ALLOW is **reasoned inference from its stated purpose, not a vendor promise.** It is still the right default (allowing costs nothing), but **do not tell Abilash that blocking it provably costs citations — that claim is not on Anthropic's record.** (c) A large practitioner claim in circulation — *"sites that unblocked GPTBot+PerplexityBot+ClaudeBot saw +186% AI-attributed traffic in 90 days"* — surfaced in search results from vendor blogs of **unknown methodology**; **not verified, not relied upon, and not to be repeated to Abilash as fact.**

**This is a HUMAN decision** (CLAUDE.md rule 3: robots.txt is never touched without asking). Agent prepares the diff; Abilash approves. → §13 Q5.

---

## 9 · Structured data — what still earns rich results after the deprecations

| Type | Google rich result? | AI citation value? | Verdict for Kairali |
|---|---|---|---|
| **FAQPage** | ❌ **Deprecated.** Announced in Google's changelog **May 2026**; FAQ rich-result documentation **removed 15 Jun 2026**: *"The FAQ rich result feature is no longer shown in Google Search results, as announced in the changelog entry in May 2026."* Restricted to gov/health authorities Aug 2023, then killed. Still a **valid schema.org type**; Google doesn't require removal. *(v1 asserted "8 May 2026" twice; the exact day could not be verified — defect V7. Search Console reporting/Rich Results Test support ends Jun 2026, API Aug 2026.)* | Google: no. Bing/Copilot: parses schema generally. | **Keep if already shipped (harmless). NEVER count as a win. NEVER build new pages around it.** |
| **HowTo** | ❌ Removed from desktop 2023 | none claimed | Deprioritise |
| **Article / NewsArticle** | ✅ Supported | entity + author + freshness signalling | **Ship** |
| **Product** | ✅ Fully supported, increasingly central to AI shopping surfaces | **B8 commercial-data effect is a universal gatekeeper (OR 6.26–>>10k)** — schema *matching* explicit on-page price | **Ship — KAPPL/Shopify priority** |
| **Review / AggregateRating** | ✅ Supported (star ratings) | social proof was **NULL** in the 252k study | Ship for SEO; don't oversell |
| **Organization / Person** | ✅ (knowledge-panel eligibility) | **Entity home + `sameAs` disambiguation — Barnard** | **Ship everywhere** |
| **MedicalWebPage** | ❌ no dedicated rich result | `reviewedBy` / `lastReviewed` / `specialty` signal credentialing + freshness — the two things YMYL and the freshness gatekeeper both want | **Ship on KTAHV + whatisayurveda — for E-E-A-T, not for a rich result** |
| **QAPage** | Limited (genuine Q&A/forum pages only) | — | Only if genuinely a Q&A page |
| **Retired Jun 2025** | Book Actions *(un-deprecated Nov 2025)*, Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing | — | N/A |

**Doctrine: schema is hygiene + Bing/Copilot + entity clarity. It is not the AEO strategy, and F-block items score zero (§7.4).**

---

## 10 · llms.txt — the honest answer

**Do not build strategy on it. Do not report it as an AEO deliverable. Do not remove what we already ship.**

- **97% of llms.txt files got zero requests** in May 2026 across **137K domains** with real server logs ([Ahrefs](https://ahrefs.com/blog/llmstxt-study/)). Of the 3% with traffic, **12% was the industry studying itself.** *"Zero requests came from AI bots for llms.txt files that don't exist. They never go looking."*
- **Google:** *"You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search (including its generative AI capabilities), as Google Search itself doesn't use them."* *(Verified verbatim 15 Jul 2026. v1 rendered the tail of this as "…Google Search ignores them" inside quotation marks — a paraphrase, now corrected.)* Gary Illyes: no support, no plans. **John Mueller compared it to the meta keywords tag** — operator-controlled, therefore manipulable, therefore ignored ([SEJ](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/), [SER](https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html)).
- Adoption ~10% of domains (SE Ranking, 300K domains) — **adoption is not usage.**

**Verdict: neutral artifact. Zero cost, zero evidence. Checklist item S7 exists solely to stop anyone counting it as a pass.**

---

## 11 · The formatting question, settled

Because this will come up every single time someone reads an AEO blog post:

> **Q: Should we write answer-first, self-contained, one-idea-per-section chunks?**
> **A: Yes — and not for AEO.**
>
> - **Not for citation.** 252,000 trials: *"Formatting choices (Content Structure, Scattered Information) had no impact, suggesting LLMs parse content regardless of visual organization."* The paper's own prioritisation section is blunter still: *"Formatting changes showed minimal return and can be deprioritized."* Google: *"There's no requirement to break your content into tiny pieces for AI to better understand it."*
> - **Yes for humans** — Aleyda's rule is good writing, and good writing is why anyone stays.
> - **Yes for featured snippets** — a classic-SEO surface that *does* extract passages.
> - **Yes for our own reviewers** — Dr. Deepu John can sign off a claim that sits in one place far more reliably than one smeared across a page. **That is a real, unglamorous, operational win.**
>
> **The doctrine: do it, and never take credit for it in an AEO report.** Every honest thing in this document costs us a talking point. That is what makes it honest.

---

## 12 · What I could not verify — stated as unverified (doctrine f)

| Gap | Status | Fix |
|---|---|---|
| **Reddit — completely inaccessible to this agent.** `WebSearch` rejects `reddit.com` (HTTP 400, user-agent blocked); `WebFetch` returns "unable to fetch". | ⚠️ **Material gap.** Abilash explicitly asked for r/SEO, r/bigseo, r/juststart, r/Entrepreneur, r/shopify, r/PPC, r/marketing. **I have ZERO direct Reddit evidence.** Practitioner voice here is from named blogs (Aleyda, iPullRank, Ahrefs, Stox) + second-hand summaries. **This matters twice over: Perplexity is Reddit-heavy, so Reddit is both an evidence source and a citation surface we're blind to.** | Human pulls threads, **or** a browser/Firecrawl tool fetches them (then rule (r) injection screening applies before any agent acts on them). |
| Search Engine Land (Canel/Bing schema) | **HTTP 403.** Corroborated via Search Engine Roundtable. Labelled **well-corroborated secondary**, not primary. | Human fetch |
| Profound's 680M-citation report | Numbers via **search summary only**; report page not fetched directly | Fetch before any Profound number is quoted to Abilash |
| ACM Web Science 2026 health AI Overviews audit (`10.1145/3795513.3807429`) | **NOT RETRIEVED** — noted in the sibling teardown as HTTP 403. **No findings claimed from it.** | Human/institutional access — **high value, it's health + AI Overviews** |
| ~~ClaudeBot policy~~ | ✅ **CLOSED 15 Jul 2026.** Verified from [Anthropic's primary doc](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). Found **three** bots, not one; `Claude-SearchBot` added to ALLOW (defect V6, §8). **Residual limit:** Anthropic does not state that blocking `Claude-SearchBot` removes you from Claude answers — our ALLOW is inference, not vendor promise. | Done. Residual limit stated in §8. |
| **Exact FAQ deprecation day** | Announcement month (**May 2026**) and doc-removal date (**15 Jun 2026**) verified; **the precise day in May could not be pinned** across Google's changelog or SEJ. | Low value. Do not assert a day. |
| **Per-factor odds ratios in §3** | The paper, its abstract, its **nulls** and its limitations were re-verified from primary. **The individual OR figures were not re-read cell-by-cell from the paper's tables** (Appendix B.5). | Re-read the source tables before any OR is quoted to Abilash as a number. |
| *"+186% AI-attributed traffic from unblocking bots"* | **Unverified vendor claim, unknown methodology.** Not relied upon. | Do not repeat |
| Stage numbering (S-IDs) | **Actively contradictory across two sibling docs written today** (§5) | §13 Q1 — blocking for the final matrix |
| Whether AEO-R survives contact with a real site | **Untested. This document is a proposal, not a proven process.** | Pilot on one site (§13 Q6) |

---

## 13 · Open questions for Abilash *(per UNATTENDED RULE — also to be appended to QUESTIONS.md by whoever assembles the matrix)*

1. **Stage numbering is contradictory across two docs written today (§5).** Who reconciles S0–S11 into one labelled spine? Until then no agent can reliably "know which step it is entering" — which is the literal thing you asked for. **Blocking.**
2. **KTAHV and explicit commercial data (B8).** Stating prices is a universal citation gatekeeper (OR 6.26–>>10k). Does the GST/SCN language position allow treatment/programme pricing on KTAHV pages? **Until you rule, AEO-A will not auto-fail KTAHV on B8.**
3. **The confidence/hedging trade (§6.3.5).** Confident language beats hedged (OR 2.67–754). **I recommend we deliberately lose this one** on KTAHV/whatisayurveda — hedge where the evidence hedges. Confirm you accept a measurable citation cost in exchange for clinical honesty.
4. **Success metric.** I propose **cited/not-cited per engine + what was said about us**, not traffic (Fishkin; zero-click). This changes what "winning" looks like in reports. Confirm.
5. **Crawler policy (§8).** ALLOW all citation bots is a clear yes — **now including `Claude-SearchBot`, which the first draft of this document missed entirely (defect V6).** **`Google-Extended` is a free opt-out of Gemini training at zero Search cost** — do you want Kairali's clinical/formulation knowledge excluded from foundation-model training? Same question for `GPTBot`/`ClaudeBot`, which cost nothing in citations either. The training/citation split is now confirmed available across **all three** major non-Google engines, so this is a genuinely free choice, not a trade. **Human decision; robots.txt is rule-3.**
6. **Pilot before fleet-wide.** AEO-R is unproven. Run it end-to-end on **one** site first — **whatisayurveda is the obvious candidate**, since its demand map is known-corrupt and must be re-run anyway. Rolling an unpiloted stage across 28 sites would repeat the exact mistake this stage exists to prevent.
7. **Retroactive scope.** AEO+GEO are a universal check on **already-built** sites too. AEO-A can run on the four built sites now. **AEO-R cannot be run retroactively without re-opening their architecture.** How far back do you want to go? *(kairali.com, whatisayurveda.com, kairalicenters.com are built.)*

---

## 14 · How this stage catches the failure it was designed for

The DataForSEO demand-map disaster, walked through the proposed gates. **This is the acceptance test for the design — if it doesn't stop this, it isn't worth adding.**

| What went wrong | Which gate stops it | How |
|---|---|---|
| Invented compound seeds *"turmeric curcumin"*, *"amla amalaki"*, *"tulsi holy basil"* | **G1 provenance + G3 no-invented-seeds + AEO-R.3 entity aliases** | Seeds no longer come from an agent's imagination — they come from `questions.csv`, where every row names the surface that returned it. **"turmeric curcumin" cannot acquire provenance because no PAA or autocomplete surface returns it.** And the entity table already knows *curcumin* is a constituent of *turmeric* and *amalaki* is an alias of *amla* — so the compound string is a schema violation, not a keyword. |
| Turmeric understated **11×** (27.1K vs 301K US), amla **25×** (6.6K vs 165K India) | **G3 + G10** | The error was caused by querying fictional strings. Fix the seeds, the volumes fix themselves. **G10's Perplexity fact-grounding check (live search + citations) independently asks "does anyone search this?" — the exact check that failed.** |
| Summed implausible **zeros** (shilajit/shatavari/gokshura = 0 US while India shows 246K/90.5K/27.1K) into cluster totals | **G4 unexplained-zero rule** | **A zero is now a BLOCKING finding requiring a second-source check, never a summable number.** Shilajit at 0 US searches is not data; it is a symptom. The old process added it up. The new process stops. |
| India pulled in **English only** — missing Hindi/Devanagari/Hinglish | **G2 locale × script gate** | AEO-R.2 mandates per-market, per-script mining (Aleyda: *"localize by market, not just language"*). **India cannot exit AEO-R with zero Devanagari rows.** |
| Totals reported to the Director **as fact** | **G10 + §7.5** | Both auditors gate the inventory *before* it becomes a keyword map. GPT-5 caught this after the fact once; wiring it to the entry gate means it cannot reach Abilash uncaught. |
| Sitemap + 3,400-page target built **on top of** the bad map | **AEO-R.4 anti-inflation rule + the ordering itself** | OWN-URL requires evidence; a page count is an **output**, never an input. And because AEO-R precedes keywords which precede the sitemap, **the corrupted number never becomes architecture** — which was the truly expensive part. |

**The structural claim, in one line: the failure was not carelessness — it was that an agent was allowed to invent the input to a stage nobody was gating. AEO-R gates the input.**

---

## 15 · Summary — the answer to "what does AEO-FIRST concretely mean?"

**AEO-first means: before anyone touches a keyword tool, we produce a provenance-backed inventory of the real questions our real audience asks — in their real words, in every market and script — mapped to entities with homes and aliases, to the answer surface that must exist, and to the evidence each answer must carry. That inventory is the seed list for keyword research, the skeleton of the sitemap, and the spec for every content brief. It is gated by ten machine-verifiable exit conditions and audited adversarially by GPT-5 and Perplexity before it is allowed to become architecture.**

**AEO-first does NOT mean doing AEO tactics first.** The tactics are mostly folklore: formatting is null across 252,000 trials, llms.txt is read 3% of the time and never by AI bots, FAQ rich results are dead, and the famous "+30–40%" is a 2023 GPT-3.5 proxy metric. **What actually wins citations is being genuinely, verifiably, currently right about a question someone actually asked** — relevance, evidence, completeness, recency.

Which is a very good thing for Kairali, because that is not a trick we have to learn. **It is a standard we have to meet — and, for a WHO-GMP manufacturer and an NABH-accredited hospital with real physicians and 300 years of real practice, it is the one standard we should find easiest to meet and hardest for anyone else to fake.**

---

## Appendix — full source list

**Peer-reviewed / arXiv**
- [GEO: Generative Engine Optimization — KDD 2024, arXiv 2311.09735](https://arxiv.org/abs/2311.09735) · [full text](https://arxiv.org/html/2311.09735v3)
- [What Gets Cited: Competitive GEO in AI Answer Engines — SIGIR '26, arXiv 2605.25517](https://arxiv.org/abs/2605.25517) · [full text](https://arxiv.org/html/2605.25517v1)
- [Diagnosing and Repairing Citation Failures in Generative Engine Optimization — arXiv 2603.09296](https://arxiv.org/abs/2603.09296)

**Google (primary)**
- [AI Features and Your Website](https://developers.google.com/search/docs/appearance/ai-features)
- [Guide to Optimizing for Generative AI Features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Top ways to ensure your content performs well in Google's AI experiences (May 2025)](https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search)
- [Google common crawlers — Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
- [FAQPage structured data (deprecation notice)](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Changes to HowTo and FAQ rich results (Aug 2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Search Quality Rater General Guidelines, 11 Sep 2025 (PDF)](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)

**Other vendors (primary)**
- [OpenAI bots documentation](https://developers.openai.com/api/docs/bots)
- [Perplexity bots documentation](https://docs.perplexity.ai/guides/bots)
- [IndexNow](https://www.indexnow.org/)
- [schema.org/MedicalWebPage](https://schema.org/MedicalWebPage) · [schema.org health & medical types](https://schema.org/docs/meddocs.html)

**Vendor studies**
- [Ahrefs — 137K sites: 97% of llms.txt files never get read](https://ahrefs.com/blog/llmstxt-study/)
- [Ahrefs — Top brand visibility factors (75k brands)](https://ahrefs.com/blog/ai-brand-visibility-correlations/) · [AI Overview brand correlation](https://ahrefs.com/blog/ai-overview-brand-correlation/)
- [SE Ranking — Health AI Overviews trust YouTube over medical platforms](https://seranking.com/blog/health-ai-overviews-youtube-vs-medical-sites/)
- [Profound — AI platform citation patterns](https://www.tryprofound.com/blog/ai-platform-citation-patterns)

**Practitioners**
- [Aleyda Solis — AI Search Optimization Checklist](https://www.aleydasolis.com/en/ai-search/ai-search-optimization-checklist/)
- [iPullRank — How AI Mode works](https://ipullrank.com/how-ai-mode-works) · [Query fan-out](https://ipullrank.com/expanding-queries-with-fanout) · [AI Search Manual](https://ipullrank.com/ai-search-manual) · [E-E-A-T, YMYL and AI search](https://ipullrank.com/eeat-ymyl-ai-search)
- [Search Engine Land — How AI Mode and AI Overviews work, based on patents](https://searchengineland.com/how-ai-mode-ai-overviews-work-patents-456346) · [Query fan-out guide](https://searchengineland.com/guide/query-fan-out)
- [Patrick Stox on building in the GEO era](https://unscriptedseo.com/patrick-stox-on-building-in-the-geo-era/)
- [Kalicube / Jason Barnard — Entity Home explainer](https://kalicube.com/learning-spaces/faq-list/brand-serps/entity-home-in-seo-explainer/) · [Building your Entity Home](https://jasonbarnard.com/digital-marketing/the-kalicube-process/courses/knowledge-panel-course/the-knowledge-panel-course-building-your-entity-home/)
- [AlsoAsked](https://alsoasked.com/) · [AnswerThePublic](https://answerthepublic.com/en)

**Industry reporting**
- [SEJ — Google says llms.txt is purely speculative for now](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/)
- [SEJ — 97% of llms.txt files got no requests](https://www.searchenginejournal.com/97-of-llms-txt-files-got-no-requests-ahrefs-data-shows/579478/)
- [SEJ — Google drops FAQ rich results from search](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)
- [SER — Google does not endorse llms.txt](https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html)
- [SER — Schema helps Microsoft's LLMs (Copilot) understand your content](https://www.seroundtable.com/schema-llms-copilot-bing-microsoft-39093.html)
- [Search Engine Land — Microsoft Bing/Copilot use schema for its LLMs](https://searchengineland.com/microsoft-bing-copilot-use-schema-for-its-llms-453455) *(403 — corroborated secondary)*

**Sibling repo docs (read, reconciled, conflicts flagged)**
- `docs/process/research-practitioner-sequencing.md` · `docs/process/research-sitemap-ia.md` · `docs/process/inventory-existing-rules.md` · `docs/whatisayurveda-research/teardown-aeo-geo.md`

---

## Appendix B — Independent verification pass (second agent, 2026-07-15)

**Why this exists.** Doctrine (f): *"Every task ends with a Checker pass: re-read the instruction, diff claim vs machine evidence, list anything unverified as unverified."* The v1 draft of this document asserted verbatim quotations and a repo-state claim that had not been re-checked against primary sources. A document whose entire thesis is *"do not trust an unverified claim"* cannot itself ship unverified. Every load-bearing citation below was re-fetched from the primary source by a second agent and diffed against the text as written.

### B.1 Verified TRUE — re-fetched from primary sources

| Claim | Primary source re-fetched | Result |
|---|---|---|
| GEO paper exists; KDD 2024; "up to 40%"; efficacy *"varies across domains, underscoring the need for domain-specific optimization methods"* | [arXiv 2311.09735](https://arxiv.org/abs/2311.09735) | ✅ verbatim, authors + dates confirmed |
| 2605.25517 exists; 252,000 trials; 6 LLMs; 18 factors; brand-anonymised; counterbalanced; SIGIR '26 | [arXiv 2605.25517](https://arxiv.org/abs/2605.25517) abstract + [full text](https://arxiv.org/html/2605.25517v1) | ✅ confirmed — **this paper is real**, abstract matches |
| *"Production RAG often retrieves five to ten or more pages…"* | [arXiv 2605.25517 full text](https://arxiv.org/html/2605.25517v1) | ✅ verbatim |
| Ahrefs: 97% zero requests; *"Zero requests came from AI bots for llms.txt files that don't exist. They never go looking."* | [ahrefs.com/blog/llmstxt-study](https://ahrefs.com/blog/llmstxt-study/) | ✅ verbatim; **137,210 domains**, ~38K publishing llms.txt, May 2026 |
| Google: *"Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add."* | [ai-optimization-guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) | ✅ verbatim |
| Google: *"Be wary of third-party tools that promise ranking success or claim to use 'internal' Google metrics."* | same | ✅ verbatim |
| Google: *"There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."* | [ai-features](https://developers.google.com/search/docs/appearance/ai-features) | ✅ verbatim |
| OpenAI: *"Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers."* · *"the data collected by OAI-AdsBot is not used to train generative AI foundation models."* | [developers.openai.com/api/docs/bots](https://developers.openai.com/api/docs/bots) — note `platform.openai.com/docs/bots` now **301s** here | ✅ verbatim |
| Google-Extended: *"does not impact a site's inclusion in Google Search nor is it used as a ranking signal in Google Search."* | Google crawler docs, corroborated [SER](https://www.seroundtable.com/google-extended-seo-36865.html) / [SEJ](https://www.searchenginejournal.com/google-updates-gemini-vertex-ai-user-agent-documentation/545409/) | ✅ confirmed (not on the *overview-google-crawlers* page — cite the **google-common-crawlers** page) |
| FAQ rich results dead; markup may stay | [Google FAQPage docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage) | ✅ *"The FAQ rich result feature is no longer shown in Google Search results"* — **date corrected, see B.2** |

### B.2 Corrected — defects found and fixed in this pass

| # | Defect | Severity | Fix |
|---|---|---|---|
| **V1** | **File was corrupted:** lines 577–578 contained leaked tool-call tags (`</content>`, `</invoke>`) — the v1 write was truncated and shipped without a read-back. | **Process defect.** Proof-of-work rules require fetching the artifact and diffing against intent; that was not done. | Removed. |
| **V2** | **Misquote of arXiv 2605.25517.** v1 quoted *"Content Structure had no impact, suggesting LLMs parse content regardless of visual organization."* The paper actually says *"**Formatting choices (Content Structure, Scattered Information)** had no impact, suggesting LLMs parse content regardless of visual organization."* | Meaning survives; **the quotation does not.** A quotation mark is a promise of verbatim. | Corrected at all 4 occurrences (§0, §3, §7.2 G3, §11). |
| **V3** | **Materially misquoted Google — scope qualifier dropped.** v1: *"you can ignore tactics like 'chunking' content…"*. Google actually wrote: ***"For Google Search,** you can ignore tactics like 'chunking' content, creating unnecessary AI text files (like llms.txt), or pursuing inauthentic mentions."* | **Material.** Google scoped the claim **to Google Search**. Unscoped, it reads as a universal law over all AI engines — which **this document's own §4 disproves** (Bing/Copilot *does* use schema). The misquote silently overstated the strongest evidence in the document. | Scope restored at all occurrences. |
| **V4** | **Paraphrase inside quotation marks** (§10): *"…Google Search ignores them."* Actual: *"…as Google Search itself doesn't use them."* | Minor, same class as V2. | Corrected. |
| **V5** | **False repo claim** (§7): *"Grep confirms no implementation exists anywhere in the repo."* **`shopify-agents/seo-aeo-geo-auditor.md` exists.** | **Ironic and material** — the paragraph condemning *"declaring a rule binding in a .md file while its enforcement was never built"* mis-stated its own evidence. The **conclusion is correct** (nothing is wired or executable); the **evidence was wrong**. | Rewritten to the precise machine-verified state (B.4). |
| **V6** | **§8 crawler table incomplete — a real visibility cost.** v1 listed one Anthropic bot (`ClaudeBot`, "training", unverified) and placed it in DECIDE. **Anthropic runs three independently-controlled bots**, one of which is a **search** bot. | **Substantive.** By this document's own ALLOW-citation-bots logic, omitting `Claude-SearchBot` risks silently blocking a citation surface. | §8 rebuilt from [Anthropic's primary doc](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). |
| **V7** | **Unverifiable precise date.** v1 twice asserted FAQ deprecation *"8 May 2026"*. Sources confirm the changelog announcement was **May 2026** and the documentation removal **15 Jun 2026**; the exact day could not be pinned. | Minor, but the document's ethos forbids asserting a day it cannot prove. | Replaced with the two verified dates. |

### B.3 Verified-and-KEPT — honest limits that survived scrutiny

- **Reddit is genuinely inaccessible.** Independently re-tested: `WebSearch` on `reddit.com` returns **HTTP 400 — "The following domains are not accessible to our user agent: ['reddit.com']"**. The v1 flag was accurate and is **not** papered over. Abilash explicitly asked for r/SEO, r/bigseo, r/juststart, r/Entrepreneur, r/shopify, r/PPC, r/marketing; **we still have zero direct Reddit evidence.** This remains a **material, open gap** (§12) — it needs a human or a browser/Firecrawl tool, then rule (r) injection screening.
- **`ClaudeBot` gap now CLOSED** — see §8 and B.4.
- Every other §12 gap (Profound, ACM 3795513.3807429, Search Engine Land 403) re-confirmed as still unretrieved. **No findings are claimed from any of them.**

### B.4 Repo state — machine-verified, 2026-07-15

```
$ grep -rln "seo-aeo-geo-auditor" --include="*.mjs" --include="*.js" --include="*.ts" --include="*.json"
  → (no matches)
$ ls .claude/agents/
  → no such directory
$ ls shopify-agents/
  → seo-aeo-geo-auditor.md   content-geo-writer.md   design-qa.md   logger.md   (specs only)
$ ls scripts/ | grep -E "audit"
  → audit-gpt.mjs   audit-perplexity.mjs        ← both EXIST
```

**Reading:** the four Shopify sub-agents exist **as markdown specifications only**. There is no `.claude/agents/` directory, so **none of them is wired as an invocable sub-agent**, and no executable implements them. CLAUDE.md rule (n) — *"after EVERY build/visual change, run design-qa AND seo-aeo-geo-auditor in parallel and attach both PASS/FAIL reports as evidence"* — is therefore **unexecutable as written, and every past claim of compliance with it is unverified.** This is the exact "declared binding in a .md, never built" failure named in the commission, and it is now confirmed by machine evidence rather than asserted.

**Good news:** `scripts/audit-gpt.mjs` **and** `scripts/audit-perplexity.mjs` both exist — so **§6.4 G10 is buildable today**, not aspirational.

### B.5 What this pass did NOT verify

- The per-factor **odds ratios** in §3 are transcribed from the v1 draft's reading of 2605.25517's tables. The paper, its abstract, its headline nulls and its stated limitations were re-verified; **the individual OR figures were not re-read cell-by-cell from the paper's tables.** They are directionally sound (and the paper's own abstract independently confirms the ranking: *"topical relevance and list position are the biggest drivers"*, price + recent timestamp *"also helps consistently"*, *"formatting-only edits have little impact"*) — **but any OR quoted to Abilash as a number should be re-read from the source table first.**
- SE Ranking's 50,807-prompt German health study and Ahrefs' 75k-brand correlations were **not** re-fetched in this pass; v1's tiering of them (vendor, correlational, single-market) already discounts them appropriately.
- **AEO-R remains untested on a real site.** This document is a proposal. §13 Q6 (pilot on whatisayurveda first) is the correct next move and is unchanged by this verification pass.
