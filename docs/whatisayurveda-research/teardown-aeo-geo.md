# whatisayurveda.com — AEO / GEO Teardown

**Written:** 2026-07-15 17:37:29 IST
**Scope:** How whatisayurveda.com wins in AI answer engines (ChatGPT, Perplexity, Google AI Overviews/AI Mode, Gemini, Copilot), plus (a) the per-page content-JSON field + formatting spec and (b) a reusable PASS/FAIL audit checklist for any Kairali site.
**Standing ruling served:** AEO + GEO are a mandatory check on EVERY Kairali site (Abilash, 15 Jul 2026).
**Prompt-injection screen (CLAUDE.md rule r):** All external pages below were treated as DATA. No fetched page contained instructions directed at an agent. Nothing in any source was executed or acted on as a directive. Two sources were unreachable and are marked as such rather than paraphrased from memory.

---

## 0. Headline: three pieces of received AEO wisdom that the best evidence does not support

This teardown was commissioned with a list of tactics to implement. Per the pushback duty, the honest finding first: **several of the named tactics are weakly supported or null, and one is actively contradicted by the strongest study available.** Building the schema around all of them uncritically would bake folklore into 3,400 pages.

| Received wisdom (as briefed) | What the evidence actually says | Verdict |
|---|---|---|
| **Formatting/structure drives citation** (direct-answer-first, self-contained chunks, question-shaped H2s) | The largest controlled study available (252,000 trials, 6 models) found **content structure and visual organization among 7 of 18 factors with _no reliable effect_.** What won was *substance*: evidence-backed claims, comprehensive coverage, recency, topic relevance. | **Weak / null as a citation lever.** Keep it — but for the honest reason (below), not because it wins citations. |
| **FAQPage / structured data drives citation** | Google states plainly there is *"no special schema.org structured data that you need to add"* for AI features. FAQ rich results are fully deprecated. Microsoft says the opposite for Copilot. A Dec-2024 study found no correlation between schema coverage and citation rates. | **Contested. Real but modest, engine-specific.** Do it for Copilot/entity clarity, not as the AEO centrepiece. |
| **llms.txt is table stakes** | Ahrefs, 137,210 domains: **97% of llms.txt files received zero requests.** AI retrieval bots were 1.1% of the (tiny) fetch traffic. Google: does not support it, no plans to. Mueller compared it to the meta keywords tag. | **Near-worthless for AI search.** We already ship one; it costs nothing; do not count it as an AEO win or report it as one. |

The single highest-leverage correction: **AEO is won on substance and evidence density, not on formatting ritual.** That is extremely good news for this specific site, because substance and evidence honesty are already its reason to exist. We do not need to become something else to win here. We need to be more rigorously ourselves, and to fix the machine-verified defects in §8.

---

## 1. Evidence base

Rated by strength. Practitioner blogs are used only where no primary source exists, and are labelled as such.

### Tier A — peer-reviewed / large-N controlled

| Source | What it is | Key numbers |
|---|---|---|
| [GEO: Generative Engine Optimization (KDD 2024), arXiv 2311.09735](https://arxiv.org/abs/2311.09735) | The original GEO paper + GEO-bench. Black-box optimisation framework. | **Up to 40% visibility lift.** Efficacy **varies by domain** — "underscoring the need for domain-specific optimization methods." (Per-method breakdown could not be retrieved from the abstract page; the widely-repeated "statistics +30–40%, keyword stuffing hurts" figures are downstream restatements — see caveat below.) |
| [What Gets Cited: Competitive GEO in AI Answer Engines, arXiv 2605.25517](https://arxiv.org/html/2605.25517v1) | **The most useful study for us.** 252,000 trials; 6 LLMs (Gemini-2.5-Flash, GPT-5-Nano/Mini/5.2, Claude-3.5-Sonnet, Kimi-K2-Thinking); 1,440 scenarios × 3 query variants × 5 runs. Two-document RAG testbed varying exactly one of 18 factors; brands/publishers anonymised to kill familiarity bias; source order counterbalanced. | **4 universal gatekeepers (all 6 models agree):** topic relevance · price transparency · **recency (2026 vs 2019)** · list position. **7 secondary (4+ models):** evidence-backed claims (OR 2.09–>>10k) · comprehensive vs shallow coverage (OR 3.98–>>10k) · **hedged vs confident language (OR 2.67–754)** · missing specifications (OR 8.63–243) · keyword gaps (OR 5.99–40.0) · internal contradictions (OR 1.74–4.09) · comparisons with alternatives (OR 1.61–7.45). **7 of 18 factors had no reliable effect — including content structure and visual organisation.** |
| [Diagnosing and Repairing Citation Failures in GEO, arXiv 2603.09296](https://arxiv.org/pdf/2603.09296) | Taxonomy of citation failure (missing citation, incorrect attribution, incomplete citation, context mismatch). | Framing insight: **the binding constraint is non-citation, not low-ranked citation.** Reported elsewhere: ~43% of *topically relevant* pages get no citation at baseline. |
| [Information Diversity and Authority Shifts in Google's AI Overviews: An Audit of Health Queries (ACM Web Science 2026)](https://dl.acm.org/doi/10.1145/3795513.3807429) | Audit of health queries in AI Overviews. | **NOT RETRIEVED — dl.acm.org returned HTTP 403.** Listed as a pointer for a human to pull; no findings claimed from it. |

### Tier B — large-N vendor studies (methodology published, incentives noted)

| Source | Key numbers |
|---|---|
| [Ahrefs: We Analyzed 137K Sites — 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/) | 137,210 domains, May 2026 server logs. 28% publish a valid llms.txt; **97% of those got zero requests.** Of the fetches that existed: SEO audit tools 21.7%, general crawlers 13.1%, tech profilers 11.6%, AI agents 10.5%, AI *training* crawlers 5.3%, **AI retrieval bots 1.1%.** Recommends against implementing for AI visibility. |
| [SE Ranking: Health AI Overviews Trust YouTube Over Medical Platforms](https://seranking.com/blog/health-ai-overviews-youtube-vs-medical-sites/) | 50,807 health prompts, Dec 2025, German-language/Berlin. **82%+ of health searches trigger an AI Overview.** Top cited: YouTube 4.43% (20,621), NDR.de 3.04%, MSDManuals 2.08%, NetDoktor 1.61%. **Reliable medical sources = 34.45%; less reliable = 65.55%. Government + academic ≈ 1% combined.** **Only 36% of AI-cited URLs appear in Google's top 10 organic; 54% in top 20; 74% in top 100.** |

⚠️ **Caveat on a number everyone repeats:** "statistics and citations improve AI visibility by 30–40%" is quoted constantly by SEO vendors and traces to the Princeton GEO paper's *headline* "up to 40%" figure, which is the best-case lift across the whole framework, not a per-method effect. **Do not cite the per-method percentages as fact.** The directionally-safe claim, independently supported by the 252k-trial study's evidence-backed-claims odds ratios, is: *evidence density raises citation odds materially; the exact multiplier is unestablished.*

### Tier C — official vendor positions (primary, authoritative on their own product)

| Source | Position |
|---|---|
| [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) | *"There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."* · *"You don't need to create new machine readable files, AI text files, or markup to appear in these features."* · **"There's also no special schema.org structured data that you need to add."** Controls: robots.txt, `nosnippet` / `data-nosnippet` / `max-snippet` / `noindex`, and Google-Extended for training only. |
| [OpenAI: bots documentation](https://developers.openai.com/api/docs/bots) | Four agents, and the split is the whole strategic ballgame: **`OAI-SearchBot`** = surfaces sites in ChatGPT search (**citation**); **`GPTBot`** = crawls for **training** foundation models; **`OAI-AdsBot`** = ad-page safety, explicitly *"not used to train generative AI foundation models"*; **`ChatGPT-User`** = user-triggered fetch, *"not used for crawling the web in an automatic fashion."* |
| [Microsoft / Fabrice Canel, SMX Munich (via Search Engine Land)](https://searchengineland.com/microsoft-bing-copilot-use-schema-for-its-llms-453455) | Bing/Copilot **does** use schema markup to help its LLMs understand content. Also: gen-AI values fresh content as a reference check against training data; push updates via [IndexNow](https://www.indexnow.org/). |
| [Google: Changes to HowTo and FAQ rich results (Aug 2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes) | **NOT RETRIEVED — the blog archive page rendered without article body.** Secondary reporting ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/), [Search Engine Land](https://searchengineland.com/faq-schema-rise-fall-seo-today-463993)) consistently states: Aug 2023 restricted FAQ rich results to authoritative government/health sites; **May 2026 FAQ rich results stopped appearing entirely**; Search Console reporting removed Jun–Aug 2026. FAQPage remains a valid schema.org type that Google still parses. Treat the timeline as well-corroborated secondary, not primary. |

---

## 2. How being cited differs from ranking blue links

This is the mental model the whole spec hangs on. Four structural differences:

1. **The unit of retrieval is the passage, not the page.** Engines chunk documents into semantic passages (~200–500 tokens, per practitioner consensus) and evaluate each independently. A brilliant page with one strong section can be cited for that section alone — and a page whose value only emerges cumulatively can be cited for *nothing*. **Consequence: each section must be independently valuable, because each section is independently retrieved.**
2. **One user query becomes many machine queries (query fan-out).** AI Mode/ChatGPT/Perplexity decompose a query into ~8–12 synthetic sub-queries and run each as its own retrieval. **Consequence: coverage of the *sub-questions* beats optimisation for the head term.** "Is ashwagandha safe in pregnancy?" is a fan-out target of "ashwagandha" and must be answered *on the page*, in its own addressable section.
3. **Citation is decoupled from rank.** Only **36%** of AI-cited health URLs sit in the organic top 10; 74% are somewhere in the top 100 (SE Ranking, 50,807 prompts). Being on page 3 is not a disqualification from citation — being *unchunkable* or *evidence-thin* is. **Consequence: this is a genuinely winnable channel for a new site that cannot outrank Healthline on domain authority.**
4. **The failure mode is silence, not position 11.** Non-citation, not low-citation, is the binding constraint (~43% of topically-relevant pages cited zero times at baseline). **Consequence: measure citation *presence*, binary, per query — not average position.**

**Strategic read for whatisayurveda.com:** health AI Overviews currently cite "less reliable sources" 65.55% of the time and government+academic ~1%. The quality bar in this niche's AI answers is *low* and the demand is *enormous* (herbs 2.57M/mo US+India, per `demand.md`). A physician-reviewed, citation-dense, evidence-honest corpus is not a nice-to-have differentiator here — it is close to an open goal. The constraint is not quality; it is **being chunkable, current, and entity-clear enough to be retrieved at all.**

---

## 3. ⚠️ ESCALATION: the hedging conflict (Abilash decision required)

**The strongest study we have says hedged language loses to confident claims — odds ratios 2.67 to 754.**

**This site's entire voice is honest hedging.** From the live `herbs__ashwagandha.json`: *"Evidence is early and limited."* — that is exactly the hedge the study says gets you dropped.

This is a direct, load-bearing conflict between "what wins citations" and "what this site is for," on a YMYL health topic. I am not going to quietly optimise toward confident health claims — that would be a GST/ASCI/YMYL hazard, would betray the "transparent steward" voice, and would make us the 65.55% rather than the 34.45%. But nor should we ignore a 754-OR finding.

**My proposed resolution — for ratification, not assumed:**

Distinguish **confidence of assertion** from **certainty of claim**. The study's "hedged" condition is *vague, non-committal prose* ("may possibly help some people in some cases, more research is needed"). It is not the same as *decisively stating a limitation*. We can be **grammatically confident about uncertainty**:

| ❌ Hedged (loses citations, and says nothing) | ✅ Decisive about uncertainty (citable AND honest) |
|---|---|
| "Ashwagandha may possibly help with stress, though more research is needed." | "**Eleven randomised trials have tested ashwagandha for stress. The largest enrolled 60 people for 8 weeks. None establish an effect size reliable enough to guide dosing.**" |
| "It might not be safe in pregnancy." | "**Ashwagandha is contraindicated in pregnancy.** Classical texts and modern toxicology agree; there is no safe-dose evidence." |
| "Evidence is early and limited." | "**The evidence base is 14 small trials, median n=58, median duration 8 weeks, 6 of 14 industry-funded.** No trial exceeds 12 weeks." |

The right-hand column is *more* honest, *more* specific, **and** hits the study's actual winners simultaneously: evidence-backed claims, missing-specifications (fixed), comprehensive coverage, confident language. **Specificity is the bridge between our ethics and our citation odds.** Vagueness — not honesty — is what loses.

**QUESTION FOR ABILASH (route to QUESTIONS.md):** Ratify the rule *"decisive about uncertainty, never vague; specific numbers instead of soft qualifiers; never confident about clinical benefit"* as the site's binding voice rule? This changes how every one of ~3,400 pages is written and needs Dr. Deepu John's clinical concurrence (CLAUDE.md hard gate 7) since it materially changes how clinical evidence is stated.

**A second, quieter conflict:** the 252k study lists **price transparency** as a *universal gatekeeper*. whatisayurveda is deliberately non-commercial and has no prices. We should not invent commerce to game this. My read: price transparency is a proxy for *"answers the concrete practical question the user actually asked"* — the specificity gatekeeper wearing a commercial hat. Our equivalents are dose, duration, contraindication, cost-of-treatment ranges where honestly known, and "where this is practised." Satisfy the *mechanism*, not the literal field. Flagged as interpretation, not fact.

---

## 4. The strategic call on AI crawlers

The critical distinction most sites get wrong: **training bots and citation bots are different bots.** You can refuse to be training data and still be cited — or, catastrophically, block the citation bot while intending only to block training.

| User-agent | Operator | Purpose | Blocking it costs you | **Call** |
|---|---|---|---|---|
| `OAI-SearchBot` | OpenAI | ChatGPT search retrieval → **citation** | All ChatGPT citations | **ALLOW** |
| `GPTBot` | OpenAI | Foundation-model **training** | Training inclusion only | **ALLOW** (see reasoning) |
| `ChatGPT-User` | OpenAI | User-triggered fetch | User-initiated lookups | **ALLOW** |
| `OAI-AdsBot` | OpenAI | Ad-page safety; explicitly not training | Nothing we use | ALLOW (harmless) |
| `PerplexityBot` | Perplexity | Retrieval → **citation** | All Perplexity citations | **ALLOW** |
| `ClaudeBot` | Anthropic | Training | Training inclusion only | **ALLOW** |
| `Claude-User` / `Claude-SearchBot` | Anthropic | User fetch / search retrieval | Claude citations | **ALLOW** |
| `Googlebot` | Google | **Everything** — organic AND AI Overviews AND AI Mode | **Your entire Google presence** | **ALLOW — never block** |
| `Google-Extended` | Google | **Gemini training ONLY.** Does *not* affect AI Overviews (those run on Googlebot) and does *not* affect organic rank. | Gemini training inclusion | **ALLOW** (see reasoning) |
| `Bingbot` | Microsoft | Bing organic + **Copilot** | Bing + Copilot entirely | **ALLOW** |

**Recommendation: allow everything, including the training bots. Deliberately.**

The reasoning, which is worth stating because the default industry advice is now "block training, allow retrieval":

- **The whole point of this site is to be the source of truth for Ayurveda.** A model trained on Kairali's evidence-honest corpus carries our framing into every ungrounded answer it ever gives — including the majority of answers that involve no retrieval and no citation at all. That is the *deepest* possible distribution for a corpus whose purpose is to correct a misinformed field. Blocking training to protect content we are *giving away for free anyway* would be strategically incoherent.
- **This is the "duty and gratitude" voice made operational.** A site whose stated posture is stewardship of a science that has given the family much does not paywall that science against machines. Blocking GPTBot would be the charity-flavoured, brand-protective move the voice explicitly rejects.
- **There is no revenue to cannibalise.** whatisayurveda is non-commercial. The zero-click objection ("AI answers steal my traffic") does not bind on a site with no conversion to lose. Its KPI is *reach of correct framing*, and training maximises exactly that.
- **The counter-argument, stated fairly:** allowing training gives away the corpus with no attribution and no link. If Abilash's view is that the corpus is a group asset that should not train competitors' models for free, the trade is: block `GPTBot`/`ClaudeBot`/`Google-Extended`, keep every retrieval bot. **This costs us nothing in citations** — it only forfeits training inclusion. That is a legitimate, cheap, reversible position and I want it consciously chosen rather than defaulted into.

**QUESTION FOR ABILASH:** Ratify allow-all-including-training for whatisayurveda? Note this is a **site-specific** call, not a fleet default — the reasoning above (no revenue, corpus-is-the-mission) does **not** transfer to kairaliproducts/Shopify or KTAHV, where the trade is genuinely different and training-blocks may be right.

**Machine-verified repo state:** `packages/seo/src/index.js:135` `buildRobots()` emits a single `{ userAgent: "*", allow: "/" }` rule. Every AI bot is *already* allowed — but **implicitly, by silence, with no recorded decision.** Whatever we choose, the robots policy should be explicit and commented, so the next agent does not "tidy" it into a block.

---

## 5. Structured data: the honest position

Google says no special schema is needed. Microsoft says schema helps Copilot. Both are primary sources about their own products, and **they are both telling the truth about different systems.** The resolution is not to pick a side:

- **Schema is not a citation lever for Google.** Stop treating it as one. Google's own documentation forecloses the claim.
- **Schema is a citation aid for Copilot** (Microsoft, on the record) — a real, if smaller, channel.
- **Schema's real job for us is entity clarity**, which is a genuine cross-engine citation factor. `sameAs` → Wikidata/Wikipedia is how an engine knows our "ashwagandha" page and its "Withania somnifera" concept are the same entity. That is worth doing for its own sake.
- **FAQPage: keep, expect nothing.** Rich results are gone (May 2026). Google still parses it. Unused structured data is harmless. But **the visible Q&A formatting does the work, not the JSON-LD** — so never let a page's FAQ exist *only* in schema.

**Net:** ship correct, rich, entity-linked schema — because it is cheap, it is honest metadata, it helps Copilot, it aids entity resolution, and it costs one function call in a template we already have. Do **not** report it as an AEO win, and do **not** let it substitute for substance.

---

## 6. llms.txt: keep it, stop believing in it

97% never fetched. AI retrieval bots = 1.1% of the traffic to the 3% that were. Google refuses to support it. Mueller's meta-keywords comparison is apt: it is a site-operator-controlled file, therefore trivially gameable, therefore ignorable.

We already ship one (`sites/whatisayurveda.com/app/llms.txt/route.ts`, via `buildLlmsTxt` at `packages/seo/src/index.js:184`). It is already built, already accurate, and costs nothing to keep. Its one *real* audience is coding agents (Cursor, Claude Code, Copilot) that do fetch it.

**Call: KEEP. Do not extend. Do not count it in any AEO report. Do not build tooling for it.** If it ever appears in an audit as a "pass," the audit is measuring the wrong thing — hence its position in §10 as an INFO line, not a gate.

---

## 7. What Examine / Mayo / NHS / Wikipedia actually do (and what transfers)

I could not obtain a controlled study isolating *why* these specific domains get cited, so this is structural analysis of their observable properties against the Tier-A factor list — labelled as inference, not measurement.

| Property | Examine | Mayo/NHS | Wikipedia | Transfers to us? |
|---|---|---|---|---|
| **Claim → citation density** (near every sentence sourced) | ✅ extreme | ✅ | ✅ | **YES — our single biggest lever.** Maps directly to "evidence-backed claims" (OR 2.09–>>10k). |
| **Per-claim evidence *grading*** (Examine's strength-of-evidence tiers) | ✅ unique | partial | ✗ | **YES — and it is the specificity that resolves §3's hedging conflict.** A grade is decisive *and* honest. |
| **Stable entity identity + disambiguation** | ✅ | ✅ | ✅ definitional | **YES — `sameAs` Wikidata. Cheap, currently missing.** |
| **Explicit, visible review date + named reviewer** | ✅ | ✅ | ✗ (history) | **YES — currently broken, see §8.** Recency is a *universal gatekeeper*. |
| **Sub-question sections addressable independently** | ✅ | ✅ | ✅ | **YES — feeds query fan-out.** Partly built (`sections[].capsule`). |
| **Institutional authority / brand familiarity** | ✅ | ✅✅ | ✅✅ | **NO — not purchasable.** The 252k study *anonymised publishers precisely to strip this out* and still found substance factors decisive. This is the encouraging part: their citation advantage is not purely their name. |
| Massive backlink/domain authority | ✅ | ✅✅ | ✅✅ | NO — and 36%-in-top-10 says it matters less here than in organic. |

**The transferable core: cite everything, grade the evidence, name the reviewer, date the review, answer the sub-question in its own section, disambiguate the entity.** Every one of those is content-schema work — i.e. achievable by construction across 3,400 pages, which is exactly what §9 specifies. The one thing we cannot copy (being Mayo) is also the one thing the evidence says we need least.

---

## 8. Repo reality check — machine-verified

Read from the working tree at `sites/whatisayurveda.com` and `packages/`. Every claim below is grep/read-verified, not assumed.

### ✅ Already right (better than most of the industry)

| Finding | Evidence |
|---|---|
| **Answer-first is structural, not editorial.** `answerCapsule` on every page + `capsule` on every section. The schema *cannot* express a page that buries its answer. | `app/lib/content.ts` — `Page.answerCapsule`, `Section.capsule` |
| **Question-shaped H2s in practice.** | `content/herbs__ashwagandha.json` — `"h2": "What does the science say about ashwagandha?"` |
| **Rich JSON-LD graph already shipping.** MedicalWebPage/Article + Physician + Person + Organization + BreadcrumbList + FAQPage, `@id`-linked. | `app/_components/article.tsx:64-97`; `packages/schema/src/index.js` |
| **Reviewer is config, not hard-coded** — survives a change of chief physician; institutional framing. | `app/lib/medical-review.ts` |
| **Citations are first-class in the schema.** | `content.ts` — `Citation = { n, text, url? }` |
| **llms.txt shipped** (worth little, but correct and free). | `app/llms.txt/route.ts` |

### 🔴 Defects — ranked by citation impact

**1. `REVIEWED` is a hard-coded build-date constant. This is the most serious finding in this teardown.**

```
sites/whatisayurveda.com/app/_components/article.tsx:23
const REVIEWED = "2026-07-14"; // build date; real review cadence tracked in editorial policy
:70  lastReviewed: REVIEWED,      // → MedicalWebPage.lastReviewed
:79  datePublished: REVIEWED,
:80  dateModified: REVIEWED,
:124 <span>Reviewed {new Date(REVIEWED)...}</span>   // rendered to users
```
`grep -c "dateModified\|lastReviewed\|reviewedOn" content/herbs__ashwagandha.json` → **0**. No page carries its own date.

Three compounding problems:
- **Citation:** recency is one of only four *universal gatekeepers* (all 6 models, 252k trials). Every page sharing one frozen date is a self-inflicted wound on the highest-tier factor we have.
- **Honesty — and this is the real issue:** the page tells a reader, in prose, *"Reviewed 14 July 2026,"* and tells a machine `lastReviewed: 2026-07-14` via `MedicalWebPage` — **for a review event that is not tied to any actual review of that page.** It is a build-date wearing a physician's byline. On a YMYL medical site whose entire proposition is transparent stewardship, an unearned review date is not a technical debt item; it is the exact class of claim the site exists to oppose. It also touches CLAUDE.md hard gate 7 (clinical sign-off) and rule 6 (never invent facts).
- **Scale:** at 3,400 pages this is unmaintainable *and* becomes a mass-fabrication of review events.

**Fix: `reviewedOn` + `reviewedBy` become REQUIRED per-page fields in the content JSON, populated only when a physician actually reviewed that page. No date → no `lastReviewed` in schema and no review byline rendered.** Absence must be honest, not defaulted. This is the one item I would not ship v2 without.

**2. Herbs — the entire demand core (2.57M/mo) — have no entity disambiguation.** `medicalWebPage()` (`packages/schema/src/index.js:158`) supports `about` only as `MedicalCondition`. There is no `sameAs`, no `Substance`/`DietarySupplement` typing, no binomial linkage. Nothing tells any engine that our "ashwagandha" **is** Wikidata's *Withania somnifera*. Entity clarity is a cross-engine citation factor and this is the cheapest unclaimed win on the board.

**3. `citations[]` never reaches the structured data.** We render citations visually but `medicalWebPage()` has no `citation` property, and `article()` has no `citation` either (`grep -n "citation" packages/schema/src/index.js` → no matches in builders). Our single strongest factor — evidence-backed claims — is invisible to machines that read JSON-LD.

**4. `medicalWebPage()` drops dates entirely.** It emits `lastReviewed` but **not** `datePublished`/`dateModified` — so clinical pages (`page.clinical: true`), the ones where freshness matters most, are the ones missing the freshness fields. Article pages get them; medical pages don't.

**5. AI-bot policy is implicit.** `buildRobots()` → `{ userAgent: "*", allow: "/" }`. Correct outcome, zero recorded intent (§4).

**6. No `Citation.date`/`Citation.type`.** `Citation = { n, text, url? }` cannot express "2023 RCT, n=60" vs "classical text." Evidence *grading* (§7's Examine lever, §3's hedging bridge) is unrepresentable in the current schema.

---

## 9. DELIVERABLE (a) — the per-page AEO/GEO content-JSON spec

**Design principle: every AEO property that can be enforced by the schema MUST be enforced by the schema.** At 3,400 pages, anything left to reviewer discipline is a defect with a delay timer. If the JSON validates, the page is answer-engine-ready — that is the whole bet.

Fields are ranked by the evidence tier that justifies them. **Nothing here is justified by "AEO best practice" alone** — where a field has no evidentiary backing, it says so.

### 9.1 Schema delta — `app/lib/content.ts`

```ts
// ─── EXISTING (keep) ────────────────────────────────────────────────
export type Crumb = { name: string; url: string };
export type Faq   = { q: string; a: string };

// ─── CHANGED ────────────────────────────────────────────────────────
export type Citation = {
  n: number;
  text: string;
  url?: string;
  /** NEW. Lets us grade evidence + render "2023 RCT, n=60" — the
   *  specificity that satisfies "evidence-backed claims" (Tier A, OR 2.09–>>10k)
   *  AND resolves the §3 hedging conflict honestly. */
  type?: "rct" | "meta-analysis" | "systematic-review" | "observational"
       | "review" | "classical-text" | "pharmacopoeia" | "regulatory";
  year?: number;
  /** Sample size where applicable — kills "missing specifications" (OR 8.63–243). */
  n?: number;
  /** Honesty field. Surfaced in prose, not hidden. */
  industryFunded?: boolean;
};

export type Section = {
  h2: string;
  capsule: string;   // ALREADY answer-first. Now GATED: 40–80 words, self-contained.
  body: string;
  /** NEW, REQUIRED. The real user question this section is the answer to.
   *  This is the query-fan-out target (§2.2) — one sub-query, one section. */
  answersQuestion: string;
  /** NEW. Citation indices supporting THIS section. Enforces per-section
   *  evidence density and lets the auditor find unsourced claims per chunk. */
  citationRefs?: number[];
};

export type Page = {
  slug: string;
  title: string;
  metaDescription: string;
  h1?: string;
  breadcrumb?: Crumb[];
  answerCapsule: string;     // GATED: 40–80 words, self-contained, no anaphora
  sections: Section[];
  faqs?: Faq[];
  citations?: Citation[];
  routesTo?: string[];
  clinical: boolean;
  register_ok: "ok" | "review";

  // ─── NEW: FRESHNESS + REVIEW (fixes §8 defect 1 — the priority item) ───
  /** ISO date. REQUIRED when clinical:true. Populated ONLY on real review.
   *  Never defaulted to a build date. No date → no lastReviewed emitted,
   *  no review byline rendered. Absence is honest; a fake date is not. */
  reviewedOn?: string;
  /** Roster key → app/lib/medical-review.ts. NEVER a hard-coded name. */
  reviewedBy?: string;
  /** ISO. Real content dates, per page. */
  publishedOn: string;
  updatedOn: string;

  // ─── NEW: ENTITY CLARITY (fixes §8 defect 2) ───
  entity?: {
    /** Canonical name: "Withania somnifera" */
    canonicalName: string;
    /** Wikidata/Wikipedia/PubChem → schema.org sameAs. The disambiguation lever. */
    sameAs: string[];
    /** Drives schema @type selection. */
    kind: "herb" | "formulation" | "condition" | "therapy" | "concept" | "text";
    /** "ashwagandha", "asvagandha", "Indian ginseng", "winter cherry" */
    alsoKnownAs?: string[];
    /** Explicit NEGATIVE disambiguation. Ayurveda is full of collisions
     *  (brahmi = Bacopa monnieri OR Centella asiatica). State it. */
    notToBeConfusedWith?: { name: string; why: string }[];
  };

  // ─── NEW: EVIDENCE POSTURE (§3 — the honest-confidence bridge) ───
  evidence?: {
    /** Decisive statement of evidence STRENGTH. Confident about uncertainty. */
    grade: "no-human-trials" | "preliminary" | "mixed" | "moderate" | "strong";
    /** Machine-readable specificity — the "missing specifications" killer. */
    trialCount?: number;
    largestTrialN?: number;
    longestTrialWeeks?: number;
    /** REQUIRED when clinical:true. Non-negotiable on YMYL. */
    safetyNotes: string[];
    contraindications: string[];
  };

  // ─── NEW: COMPARISON (Tier A secondary, OR 1.61–7.45) ───
  /** "Comparisons with alternatives" is a real citation factor and we have
   *  none. Non-commercial framing: compare the SUBSTANCE, never sell. */
  comparedWith?: { name: string; slug?: string; difference: string }[];
};
```

### 9.2 Field-level gates (the auditor enforces these; CI fails on breach)

| Field | Gate | Evidence justification |
|---|---|---|
| `answerCapsule` | 40–80 words. Self-contained. **No anaphora** — regex-ban `as (mentioned|noted|discussed) above`, `this article`, `see below`, leading `It `/`This `/`They `. Must name the entity in sentence 1. | Passage-level retrieval (§2.1). *Note: structure had null effect in the 252k study — this is justified by chunk-extractability, not by a proven citation lift. Honest framing.* |
| `sections[].capsule` | Same gates. Must independently answer `answersQuestion`. | Query fan-out (§2.2) |
| `sections[].answersQuestion` | REQUIRED. Must end `?`. Should match a real query from `demand.md`. | Fan-out targeting |
| `reviewedOn` | REQUIRED if `clinical`. **ISO date. Must be ≤ today. Must NOT equal build date unless a real review happened that day.** | **Recency = universal gatekeeper** + honesty |
| `updatedOn` | REQUIRED, per page, real. Staleness warn >12mo, FAIL >24mo on clinical. | Universal gatekeeper |
| `entity.sameAs` | REQUIRED for `kind: herb\|formulation\|condition`. ≥1 Wikidata URI. | Entity clarity |
| `citations[]` | **≥3 for `clinical` pages.** Every `type:"rct"` needs `year` + `n`. | Evidence-backed claims (OR 2.09–>>10k) |
| `sections[].citationRefs` | ≥1 per section on clinical pages making an efficacy claim. | Per-chunk evidence density |
| `evidence.grade` | REQUIRED if `clinical`. | §3 honest-confidence |
| `evidence.safetyNotes` / `contraindications` | REQUIRED, non-empty if `clinical`. | YMYL + specifications (OR 8.63–243) |
| **Vagueness lint** | **FAIL** on `may possibly`, `some people find`, `more research is needed` **unless** accompanied by a specific number in the same section. | **§3 — the hedging bridge.** Bans vagueness, not honesty. |
| **Claim lint** | **FAIL** on `cure`, `treats`, `heals`, `guaranteed`, `miracle` in clinical context. | YMYL / ASCI / hard gate 6 |
| `faqs[]` | Must render **visibly** in HTML, not schema-only. | Visible Q&A > JSON-LD (Tier B) |

### 9.3 Schema-package delta — `packages/schema/src/index.js`

```js
// medicalWebPage(): ADD — currently missing, per §8 defects 3 & 4
  datePublished: m.datePublished,     // MISSING TODAY on clinical pages
  dateModified:  m.dateModified,      // MISSING TODAY on clinical pages
  citation: m.citations?.map(c => clean({
    "@type": "ScholarlyArticle", name: c.text, url: c.url, datePublished: c.year?.toString(),
  })),                                // evidence → machine-visible
  about: m.entity && clean({
    "@type": m.entity.kind === "herb" ? "Substance" : "MedicalCondition",
    name: m.entity.canonicalName,
    sameAs: m.entity.sameAs,          // THE disambiguation lever
    alternateName: m.entity.alsoKnownAs,
  }),
  // lastReviewed: emit ONLY if a real reviewedOn exists. Never a build date.

// NEW builder — herbs are the demand core (2.57M/mo) and have no proper type
export function substance({ id, name, sameAs, alternateName, activeIngredient }) { … }
```

### 9.4 Template delta — `app/_components/article.tsx`

- **Delete `const REVIEWED = "2026-07-14"`.** Read `page.reviewedOn` / `page.reviewedBy`. If absent → render no review byline and emit no `lastReviewed`. **Fail the build if `clinical && !reviewedOn`.**
- Pass `page.citations` → `medicalWebPage({ citations })`.
- Pass `page.entity` → `about` + `sameAs`.
- Render an **evidence box** (grade, trial count, largest n, funding) above the fold — the §3 bridge, visible to humans and extractable by machines.
- Render `notToBeConfusedWith` as a visible disambiguation line.

### 9.5 Explicitly NOT doing

| Not doing | Why |
|---|---|
| Extending llms.txt | 97% never fetched (Ahrefs, 137k domains). Keep the free one; build nothing. |
| Chasing FAQ rich results | Fully deprecated May 2026. Keep markup, expect nothing. |
| Adding a `priceRange` to satisfy the price gatekeeper | Non-commercial site. Satisfy the *mechanism* (specificity), never invent commerce. §3. |
| Confident efficacy claims to beat the hedging penalty | YMYL. Contradicts the site's reason to exist. §3 resolves this honestly instead. |
| Keyword stuffing / `keywords[]` density targets | The 252k study found keyword *gaps* matter (OR 5.99–40.0) — i.e. cover the concept. That is a coverage instruction, not a density one. |

---

## 10. DELIVERABLE (b) — reusable PASS/FAIL AEO/GEO audit checklist

**Purpose:** the specification for the `seo-aeo-geo-auditor` sub-agent that CLAUDE.md's Shopify doctrine (rules n, o) promises but which **does not exist in the repo** (verified: no such agent found). Runnable against ANY Kairali site.

**Rules of engagement:**
- Every check is **PASS / FAIL / N-A / INFO**. No scores, no "partial." (Doctrine f: unverified is reported unverified.)
- **A FAIL is never fixed by weakening the check** (doctrine g).
- Evidence — URL, grep output, JSON-LD dump — is pasted, never summarised (proof-of-work rules).
- **INFO checks never gate.** They exist to stop us reporting folklore as a win.
- Register-aware: KTAHV clinical-lock ≠ Villa Raag ≠ KAPPL ≠ group.

### A. Access & retrievability — GATING (a failure here zeroes everything downstream)

| # | Check | PASS |
|---|---|---|
| A1 | `Googlebot` not blocked in robots.txt | Blocking = total loss of organic AND AI Overviews AND AI Mode. Never. |
| A2 | `OAI-SearchBot`, `PerplexityBot`, `Claude-User`/`Claude-SearchBot`, `Bingbot` not blocked | These are the **citation** bots. |
| A3 | Training-bot posture (`GPTBot`, `ClaudeBot`, `Google-Extended`) is **explicit and matches a recorded DECISIONS.md ruling** | Either stance passes. **Silence fails.** Per-site, not fleet-default (§4). |
| A4 | `Google-Extended` block (if present) is not believed to affect AI Overviews | It doesn't. Fails only if docs/comments claim otherwise. |
| A5 | Primary content in server-rendered HTML (not JS-only) | `curl` + grep the answer text. Renderers ≠ crawlers. |
| A6 | No `nosnippet` / `max-snippet:0` / `data-nosnippet` on answer content | Directly suppresses AI-feature inclusion (Google, primary). |
| A7 | Canonical + sitemap present; page reachable ≤3 clicks | Retrieval floor. |
| A8 | HTTP 200, no redirect chains, no mixed content | Retrieval floor. |

### B. Extractability — GATING

| # | Check | PASS |
|---|---|---|
| B1 | Direct answer in the **first 40–80 words**, before context | Passage retrieval (§2.1). |
| B2 | **No anaphora** in any capsule: `as mentioned above`, `this article`, `see below`, bare leading `It`/`This` | Chunks are retrieved *alone*. |
| B3 | Every section independently answers a stated question | Query fan-out (§2.2). |
| B4 | H2/H3s are question-shaped **and map to a real query** in the site's demand file | Real queries, not invented ones. |
| B5 | Answer content in text, not baked into images/video | Google, primary. |
| B6 | FAQs visible in rendered HTML, not schema-only | Visible Q&A > JSON-LD (Tier B). |

### C. Substance — GATING (the factors the 252k study says actually decide it)

| # | Check | PASS |
|---|---|---|
| C1 | **Evidence-backed claims** — every efficacy/benefit claim carries a citation | OR 2.09–>>10k. **The single highest-value check in this list.** |
| C2 | **Comprehensive, not shallow** — covers the fan-out sub-questions, not just the head term | OR 3.98–>>10k. |
| C3 | **No missing specifications** — dose, duration, n, contraindications where applicable | OR 8.63–243. |
| C4 | **No internal contradictions** across the page/site | OR 1.74–4.09. |
| C5 | **No keyword gaps** — the concepts a user would search are present | OR 5.99–40.0. Coverage, **not density.** |
| C6 | **Comparison with alternatives** present where meaningful | OR 1.61–7.45. |
| C7 | **Decisive, not vague** — no `may possibly`/`some find`/`more research needed` without a specific number alongside | §3. **Bans vagueness. Never construe as licence for confident health claims — C8 outranks it.** |
| C8 | **YMYL claim safety** — no `cure`/`treats`/`heals`/`guaranteed`; clinical pages carry safety + contraindications | Hard gate 6/7. **Outranks C7 in every conflict.** |

### D. Freshness & trust — GATING

| # | Check | PASS |
|---|---|---|
| D1 | Real, per-page `dateModified` — **not a shared build constant** | **Universal gatekeeper.** This is the check that catches §8 defect 1. |
| D2 | Clinical pages carry a `lastReviewed` **tied to an actual review event** | Honesty + gate 7. A build date here is a **FAIL**, not a warning. |
| D3 | Named, credentialed reviewer, resolvable to an `/about` anchor; reviewer from **config/roster, not hard-coded** | E-E-A-T + the roster ruling. |
| D4 | Content ≤12mo (warn) / ≤24mo (FAIL on clinical) | Recency gatekeeper. |
| D5 | Publisher disclosure visible (who publishes, and their commercial interest) | Trust; the site's own stated voice. |

### E. Entity clarity — GATING

| # | Check | PASS |
|---|---|---|
| E1 | Canonical entity named + `sameAs` → Wikidata/authoritative ID | Cross-engine entity resolution. |
| E2 | Ambiguous entities explicitly disambiguated | e.g. brahmi = *Bacopa monnieri* vs *Centella asiatica*. |
| E3 | Organization schema with consistent NAP + `sameAs`, `@id`-linked across the site | Entity consolidation. |
| E4 | Entity naming consistent across every locale | Fleet rule: all locales or flagged. |

### F. Structured data — NON-GATING (correctness gates; presence does not)

| # | Check | Status |
|---|---|---|
| F1 | JSON-LD parses; no schema.org validator errors | **GATING** — broken markup is a defect. |
| F2 | Types match content (MedicalWebPage/Substance/Article/FAQPage) | **GATING** on correctness. |
| F3 | `@id` graph internally resolvable | **GATING** on correctness. |
| F4 | Schema claims **match visible page content** (no date/reviewer/claim in JSON-LD that the page doesn't show) | **GATING** — this is a *lying-to-machines* check, not an SEO check. |
| F5 | FAQPage present where FAQs exist | **INFO** — rich results dead since May 2026; helps Copilot; expect nothing. |
| F6 | Schema presence as an AI-citation lever | **INFO ONLY. Never gate.** Google: *"no special schema.org structured data that you need to add."* |

### G. Known-null — INFO ONLY, MUST NEVER GATE

*This section exists to stop future agents reporting folklore as wins.*

| # | Check | Status |
|---|---|---|
| G1 | `llms.txt` present | **INFO.** 97% never fetched. Not a win. Do not build for it. |
| G2 | Visual organisation / formatting polish | **INFO.** No reliable effect (7/18 null factors, 252k trials). |
| G3 | Promotional tone | **INFO.** No reliable effect — but register locks still apply as *brand/legal* rules, independent of AEO. |
| G4 | Keyword density | **INFO.** Coverage matters (C5); density does not. |

### H. Outcome measurement — INFO (the only check that measures reality)

| # | Check |
|---|---|
| H1 | **Binary citation presence**, per priority query, per engine (ChatGPT / Perplexity / AI Overviews / AI Mode / Copilot). Cited = yes/no. **Not average position** — the failure mode is silence (§2.4). |
| H2 | AI-bot hit log: is `OAI-SearchBot`/`PerplexityBot` actually fetching us? (No fetches = no citations, and A-section checks are then unverified, not passing.) |
| H3 | Citation *accuracy* — when cited, is our framing preserved or distorted? |
| H4 | Rank⊥citation sanity: expect ~36% overlap with organic top-10. Large divergence is normal, **not a bug.** |

### Audit output contract

```
audits/<site>-aeo-geo-<YYYY-MM-DD-HHMMSS-IST>.md
├── Verdict: PASS / FAIL (any GATING failure ⇒ FAIL)
├── Gating failures — with pasted evidence per finding
├── INFO observations (explicitly marked non-gating)
├── Unverified — checks that could not be run, listed as UNVERIFIED, never as PASS   ← doctrine (f)
└── Escalations → QUESTIONS.md
```

---

## 11. Open questions → QUESTIONS.md

1. **§3 hedging.** Ratify *"decisive about uncertainty, never vague; specific numbers replace soft qualifiers; never confident about clinical benefit"* as the binding voice rule? Needs Dr. Deepu John's concurrence (hard gate 7) — it changes how clinical evidence is stated on every page.
2. **§4 AI crawlers.** Allow-all including training bots (`GPTBot`/`ClaudeBot`/`Google-Extended`) for whatisayurveda, on the "the corpus is the mission" reasoning? Site-specific — must NOT become a fleet default.
3. **§8 defect 1.** Confirm `reviewedOn` is populated **only on real review**, and that pages without one render no review byline. This means most pages ship with **no** review date until physicians actually review them — visibly less impressive, and correct. Confirm that trade.
4. **Review capacity at scale.** ~3,400 pages × physician review is the real bottleneck. Does "physician-reviewed" mean per-page, or per-template-with-spot-check? The honest answer must be stated on `/about`, and it constrains the whole 3,400-page plan. **This is a business-model question, not a technical one.**
5. **`seo-aeo-geo-auditor` does not exist.** §10 is its spec. Who builds it, and does it gate CI or run as a Monday ritual (per doctrine l/p)?
6. **IndexNow** (Microsoft, primary: gen-AI values freshness; push updates via indexnow.org) is unimplemented fleet-wide. Worth a spike?

---

## 12. Sources

**Primary — vendor:** [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) · [OpenAI: bots](https://developers.openai.com/api/docs/bots) · [Google: crawlers overview](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers) · [IndexNow](https://www.indexnow.org/)

**Primary — research:** [GEO: Generative Engine Optimization (KDD 2024), arXiv 2311.09735](https://arxiv.org/abs/2311.09735) · [What Gets Cited: Competitive GEO in AI Answer Engines, arXiv 2605.25517](https://arxiv.org/html/2605.25517v1) · [Diagnosing and Repairing Citation Failures in GEO, arXiv 2603.09296](https://arxiv.org/pdf/2603.09296)

**Large-N vendor studies:** [Ahrefs: 137K sites — 97% of llms.txt never read](https://ahrefs.com/blog/llmstxt-study/) · [SE Ranking: Health AI Overviews Trust YouTube Over Medical Platforms](https://seranking.com/blog/health-ai-overviews-youtube-vs-medical-sites/)

**Secondary reporting (labelled as such):** [Search Engine Land: Microsoft Bing/Copilot use schema for its LLMs](https://searchengineland.com/microsoft-bing-copilot-use-schema-for-its-llms-453455) · [SEJ: Google Drops FAQ Rich Results](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/) · [Search Engine Land: rise and fall of FAQ schema](https://searchengineland.com/faq-schema-rise-fall-seo-today-463993) · [SEJ: Google says llms.txt is purely speculative](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/)

**Attempted, NOT retrieved (no findings claimed):** [ACM Web Science 2026: Information Diversity and Authority Shifts in Google's AI Overviews — audit of health queries](https://dl.acm.org/doi/10.1145/3795513.3807429) (HTTP 403 — worth a human pull; most on-point academic source found) · [Google: Changes to HowTo and FAQ rich results, Aug 2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes) (archive page rendered without article body) · [OpenReview GEO PDF](https://openreview.net/pdf/d7aef3973d67b5dcaf1b84b76042e9ff6a705d3b.pdf) (bot verification wall)

**Repo evidence (machine-verified this session):** `sites/whatisayurveda.com/app/lib/content.ts` · `app/_components/article.tsx:23,70,79,80,124` · `app/lib/medical-review.ts` · `app/llms.txt/route.ts` · `content/herbs__ashwagandha.json` · `packages/schema/src/index.js:105,133,138,158` · `packages/seo/src/index.js:135,184` · `sites/whatisayurveda.com/site.config.json`
