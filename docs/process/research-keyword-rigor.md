# Stage S4–S5 — KEYWORD & DEMAND (the stage that must make our real failure impossible)

**Status:** **SPECIFICATION ONLY — the gate is designed, NOT yet enforced.** See "Scope boundary" below.
**Covers:** Abilash steps 4 ("understand the keywords that the target audience uses") and 5 ("understand the SEO of the target audience")
**Consumes:** S2–S3 audience dossier (`docs/process/research-audience-and-psychology.md`)
**Feeds:** S6 sitemap/IA (`docs/process/research-sitemap-ia.md`) — the output contract in §8 is that stage's input
**Written:** 2026-07-15 · **rev 3** · all live-API evidence generated 2026-07-15, reproducible
**Evidence cost of writing this document:** **$0.51616** of DataForSEO credit — 14 live calls, raw responses committed byte-for-byte to `docs/process/evidence/keyword-rigor-2026-07-15/`, ledger computed from those files by script, never typed (§12)

**What rev 3 changed (all from live evidence, not re-reading):**
- **Two NEW silent-corruption mechanisms found and gated (V9, V10)** — and one of them sits *inside rev 2's own remedy*. §6.9, §6.10.
- **Q5, Q6, Q7 CLOSED by experiment. Q7's rev-2 premise was REFUTED** — and the correction invalidates rev 2's `serp_risk` design, not just its weights. §7.5.
- **The mandatory DO/DON'T spine added (§4.0)** — Abilash's 15 Jul structural ruling, which rev 2 did not carry at all.
- **An expert disagreement adjudicated:** Ahrefs' published seed method contradicts our Rule C. §2.3a.
- **A near-miss by this author recorded** (§12.1) — I nearly shipped a fabricated finding into a document about fabricated findings.

> ### ⚠️ SCOPE BOUNDARY — read before trusting any "gate" language in this document
>
> This document **specifies** V1–V10 and G1–G17. **It does not implement them.** `scripts/keyword-validate.mjs` and `scripts/seed-lint.mjs` do not exist yet; S6 is not wired to refuse on FAIL; nothing here is in CI. This task's scope was research + specification, writing only to `docs/process/`.
>
> **GPT-5's rev-2 audit returned FAIL principally on this point, and on that point I push back:** it judged a spec against the standard for a shipped gate, not knowing the task's boundary. The finding is nonetheless *directionally right and worth keeping visible* — **doctrine (f): a .md file is zero evidence a rule was executed.** Until the validators exist and run, this document protects nothing.
>
> **Therefore the honest status is: the failure is not yet impossible — it is now specified, empirically grounded, and cheap to make impossible.** The next task is implementation, and it is the only thing standing between this spec and the claim in its title:
> 1. `scripts/seed-lint.mjs` — Rules A/B/C (§4.2)
> 2. `scripts/keyword-validate.mjs` — **V1–V10**, exit 2 (§6)
> 3. Regression fixture from the real failure (§9) — **must FAIL on `demand-raw.json`**
> 4. Wire G14 (`audit-gpt.mjs`) + S6 refusal-on-non-PASS into CI
> 5. Close Q1/Q3/Q8/Q10/Q12 before `opportunity` or V3 are trusted
>
> **Rev 3 raises the stakes on this boundary rather than lowering it.** V9 and V10 are not refinements — they are two *additional* live silent-corruption paths, found in an afternoon of testing, that rev 2 did not know existed and that no amount of re-reading rev 2 would have surfaced. **The count of known ways to silently produce a wrong number went 1 → 3 by running experiments.** The honest inference is not "the spec is now complete"; it is **"the spec's completeness is unknown and only experiment moves it."** Nothing here is safe until the validators run in CI.
>
> Anyone citing this document as evidence that our keyword data is safe **has made the exact error the document is about**.

---

## 0 · PUSHBACK FIRST — the brief is right about the failure and wrong about the mechanism

The commission says: *"a zero/near-zero for a known-major entity is a DATA FAULT not a finding (shilajit US=0)."* The instinct is correct. The diagnosis is wrong, and the difference decides where the gate goes.

**I re-ran the failing pull live against the same endpoint. DataForSEO never returned 0 for shilajit. It returned `null`.**

```
keywords_data/google_ads/search_volume/live · location_code=2840 (US) · language_code=en · 2026-07-15
  shilajit    vol=None   comp=None   cpc=None
  shatavari   vol=None   comp=None   cpc=None
  gokshura    vol=None   comp=None   cpc=None
```

And the quarantined artifact `docs/whatisayurveda-research/demand-raw.json` records:

```json
{ "us": { "kapikacchu mucuna": 0, "shilajit": 0, "shatavari": 0, "gokshura": 0 } }
```

**The zero was manufactured inside our own capture layer.** `null` (Google Ads holds no data for this keyword group) was coerced to `0` (nobody searches this), and `0` is a number, so it summed cleanly into "herbs 2.57M/mo" and was reported to the Director as fact. Three distinct facts — *no demand*, *no data*, and *not queried* — were collapsed into one integer, and the collapse was silent.

This reframes the entire stage. Three consequences:

1. **A plausibility check on zeros is necessary but insufficient**, because it is a *downstream* patch on a value that was already destroyed upstream. A high-prior list would have caught `shilajit`; it would not have caught the next entity we have no prior for. **The primary defence is a type rule, not a list rule: `null` must remain `null` all the way to the artifact, and any arithmetic over a set containing `null` must refuse to run.** The high-prior list is the second net, not the first.

2. **The file named `demand-raw.json` is not raw.** It is a pre-digested `{keyword: number}` map. The actual API response — `null`s, `competition`, `cpc`, `monthly_searches`, the task cost, the request payload — was discarded at write time. So the coercion is *undetectable by inspection of our own evidence*. This is why §7 mandates byte-for-byte response capture: not as filing hygiene, but because a lossy evidence layer made a wrong number unfalsifiable. Our audit trail could not have caught this bug. GPT-5 caught it by reasoning about Ayurveda, not by reading our data.

3. **The truth is worse than "understated".** Cross-checked against a second DataForSEO endpoint, same keyword, same market, same day:

   | keyword | `google_ads/search_volume` US | Labs `keyword_overview` US | artifact reported |
   |---|---:|---:|---:|
   | shilajit | `null` | **201,000** | `0` |
   | shatavari | `null` | **14,800** | `0` |
   | gokshura | `null` | **1,900** | `0` |
   | turmeric | 301,000 | 301,000 | 27,100 (as "turmeric curcumin") |

   Shilajit is not a zero and not a rounding error. It is a **201,000/month US head term that we recorded as nonexistent** and would have declined to build a page for. The prior-list rule as briefed would have flagged it as "suspicious"; it took a second endpoint to produce the actual number.

### 0.1 · REV 3 — the mechanism is a *class*, not a bug, and rev 2 found only one member of it

Rev 2 concluded: *"the primary defence is a type rule — `null` must remain `null`."* That is right and it is not enough. **I tested the endpoints adversarially and found two more paths to the identical wrong artifact, neither involving `null` at all.** Both are live, both are silent, both return `status: "Ok."`

**Path 2 — the row that never comes back (V9).** Labs `keyword_overview` **silently omits keywords it doesn't know.** Requested 3, returned 2, no error:

```
dataforseo_labs/google/keyword_overview/live · US 2840 · en · ["turmeric","zzqx nonexistent herb term","shilajit"]
  → status "Ok." · cost $0.01224 · 2 items returned
     turmeric  301000
     shilajit  201000
  → "zzqx nonexistent herb term"  ABSENT ENTIRELY — no row, no null, no warning
```

Build `{kw: vol}` from that response, then look up a missing key with the idiom every engineer reaches for — `d.get(kw, 0)` — and **you get `0`**. That is the original incident, arriving through a door rev 2 left wide open. `null → 0` was gated; **`absent → 0` was not**, and it produces a byte-identical artifact.

**And it is worse than a parallel bug: it is inside rev 2's own cure.** Rev 2's V2 says *"for every `no_data` row, re-query Labs."* **The remedy for mechanism 1 routes every one of our nulls through the endpoint that silently drops rows.** A keyword that is null in Google Ads *and* unknown to Labs comes back from the fix as nothing at all — and nothing, unreconciled, becomes zero.

**Path 3 — the response is not in the order you asked (V10).** Verified, same day, same account:

```
Labs keyword_overview   · 56 keywords → returned ALPHABETIZED (returned == sorted(returned): True)
                          requested[0]="ashwagandha benefits" → returned[0]="abhyanga massage"
google_ads/search_volume· 3 keywords  → returned in REQUEST order (turmeric, zzqx…, shilajit)
```

**The two endpoints we use have opposite ordering contracts, and neither documents it at the point of use.** Any positional join — `zip(seeds, response)`, `response[i]` — misattributes **every volume to the wrong keyword** on one endpoint and works fine on the other. It cannot fail loudly: you get plausible numbers against plausible keywords, all wrong. This is strictly nastier than the original bug, which at least produced an implausible zero for a famous herb.

**Path 4 — `null` is not even decidable (why V6 is mandatory, not thorough).** The same call returned:

```
google_ads/search_volume · US · turmeric=301000 · shilajit=null · "zzqx nonexistent herb term"=null
```

**Google Ads gives the identical representation to a 201,000/month head term and to a string that is not a query at all.** `null` therefore carries *zero* information about the world — it cannot even distinguish "real topic, no coverage" from "gibberish". Rev 2 argued cross-endpoint checking was affordable ($11) and therefore obligatory. The real argument is stronger: **without a second source, a `null` is not interpretable at all**, and any rule that reads meaning into a bare `null` is reading noise.

**The synthesis rev 3 forces:**

> **Three distinct silent mechanisms — `null→0`, `absent→0`, `positional misjoin` — produce the same wrong artifact, and rev 2 gated one.** They share a single root: **we treat an API response as data, when it is a *reply to a specific request* that is only meaningful when reconciled against that request.** Hence the shape of V9/V10: never consume a response alone — always consume `(request, response)` as a pair, joined by key, reconciled as sets.

The generalisation matters more than the three fixes. Rev 2 believed it had found "the" bug. **Two hours of adversarial testing tripled the count.** The correct posture is not "we have now found them all" — it is that **the failure count is a function of testing effort, and ours had been near zero.**

**Two further corrections to the brief, both verified:**

- **The cost model in the commission is wrong.** The brief states `search_volume/live ≈ $0.011/keyword`. Observed: **$0.09 per task, flat, independent of keyword count** (14 keywords → $0.09; 8 keywords → $0.09; 10 keywords → $0.09). DataForSEO's docs confirm: *"the price for 1 or 1000 keywords will be the same."* At the 1,000-keyword maximum that is $0.00009/keyword — **122× cheaper than the brief assumes**. The budget was never the constraint. There was never a cost reason to skimp on the seed set, and "~80 ad-hoc seeds" cannot be excused by credit. (§3)

- **The cheaper endpoint is also the better one.** Labs `keyword_overview/live` cost **$0.0126 for 5 keywords** and returned volume **+ keyword difficulty + search intent + SERP info** in a single call — the exact metrics the brief asks for in §(4) "beyond volume". `google_ads/search_volume` returned volume alone, for $0.09, with coverage holes. We used the worse endpoint.

**Where I disagree with Abilash's ordering — mildly, and in his favour on intent.** His steps 4 and 5 separate "keywords the audience uses" from "the SEO of the audience", and the standing ruling says AEO "should technically be the FIRST". Split across two stages this is unbuildable: you cannot harvest questions (AEO) without a seed set, and you cannot score a seed set without SERPs. **I merge 4 and 5 into one stage, S4–S5, with AEO/question harvesting as sub-step K5 — inside the stage, before scoring, not after.** This keeps his intent (questions are first-class, not an afterthought bolted on post-build) while making it executable. The one thing I will not do is let "AEO first" mean "AEO before we know who the audience is" — that reintroduces the invented-seed failure in a new costume.

---

## 1 · Research base — what I read, and what I could not get

**Primary/authoritative (weighted heavily):**
- DataForSEO API docs — endpoint contracts, limits, caveats (docs.dataforseo.com)
- DataForSEO pricing page — per-task/per-item economics
- Google Ads Help — the definition of "Average monthly searches"
- Tim Soulo (CMO, Ahrefs) — *"There's No Such Thing as 'Accurate' Search Volume"*, 18 Mar 2024
- Ahrefs — *Keyword Search Volume: 5 Things You Need to Know*
- Ahrefs Help Center — search-volume accuracy vs GSC impressions
- Ahrefs Academy / Help — Parent Topic method, seed-keyword practice
- Aleyda Solís — keyword-mapping cheatsheet, #CrawlingMondays ep. 9 (criteria & tools)
- Moz — Keyword Explorer metric model (volume / difficulty / opportunity / priority)
- Yao, Heinrich, Zhang, Wei, Qi & Gao, *"Single botanical drugs in the Ayurvedic Pharmacopoeia of India — a quantitative ethnobotanical analysis"*, **Frontiers in Pharmacology, 2023** (PMC10213908)
- PCIM&H (Pharmacopoeia Commission for Indian Medicine & Homoeopathy, Ministry of AYUSH) — pcimh.gov.in

**Live machine evidence (generated for this document, §12):** 4 DataForSEO calls across 2 endpoints × 3 locales, US + India, en/hi.

**What I could not get — stated plainly rather than faked.** The commission explicitly asks for Reddit practitioner voice (r/SEO, r/bigseo, r/juststart, r/PPC…). **reddit.com is not accessible to this agent's user agent** — the search API returns `400: The following domains are not accessible to our user agent: ['reddit.com']`. I will not paraphrase Reddit threads I could not open, and there are no Reddit citations in this document. Where I would have used practitioner consensus, I substitute (a) named authorities who publish their method, and (b) our own live API evidence, which is stronger than anecdote anyway. **If Abilash wants the Reddit layer, it needs a human paste or a different fetch path — logged to QUESTIONS.md (§11, Q4).**

**Source-quality note.** Searches for "zero volume keywords" surface a large body of SEO content-marketing blogs (SEOmator, TheHOTH, rellify, et al.) making the same unsourced claims. I have deliberately **not** built rules on them. Where they agree with Ahrefs I cite Ahrefs; where they don't, I ignore them. One widely-repeated figure — "70% of traffic is long-tail, per Ahrefs research" — I could not trace to a primary Ahrefs publication and therefore **do not rely on**.

---

## 2 · What the authorities actually say

### 2.1 Google itself tells you the number is aggregated

Google Ads Help, *About Keyword Planner forecasts*: "Average monthly searches" is the average number of times people searched for **"a keyword and its close variants"** for your chosen locations, network and date range. This is not a tool bug being exposed by critics — **it is the documented contract**. The unit of the number is *a keyword group*, not *a keyword*.

### 2.2 Ahrefs: the number is directional, and the keyword is the wrong unit

Tim Soulo (18 Mar 2024) lists three structural defects in Keyword Planner volume:
- "The numbers are rounded annual averages"
- averages are "assigned to 'volume buckets'"
- **"Keywords with similar meaning are often grouped together and their search volume summed up"**

The companion piece shows six variants of *pc games free download* carrying **identical** volume, and reports GKP volumes as roughly accurate in **45%** of cases vs Ahrefs' **60%**, benchmarked against GSC impressions for top-ranking pages. Both numbers are bad; neither tool is a measurement instrument.

Soulo's deeper point matters more than the error bars: **"Pages don't rank for a single keyword"** — a top-ranking page ranks for ~1,000 related keywords. Volume ≠ clicks (*elon musk age*: 37k searches → 6.3k clicks, because Google answers it inline). And volume is an **annual average**, so it lies about seasonality (*content marketing* steady 12–17k vs *NFT* near-zero → 2.3M in March → 374k in June).

**A correction to my own draft, caught by the GPT-5 audit.** I originally wrote "two-thirds of 2020 searches ended without a click" sourced to Ahrefs. **That attribution was wrong.** The primary is **Rand Fishkin / SparkToro (22 Mar 2021)**, analysing ~5.1 trillion searches via SimilarWeb: **64.82%** of 2020 Google searches ended without a click to another property (desktop+mobile; 77.22% on mobile). Ahrefs repeats it; Ahrefs did not produce it.

**And it is contested — which matters more than the number.** Google publicly disputes the zero-click framing, and Search Engine Journal has argued the statistic is routinely misused. **Ruling for our pipeline: cite SparkToro as the primary with its methodology, treat zero-click rates as directional, and never let a contested third-party statistic become a gate threshold.** It informs §7.5 `serp_risk`; it does not set it. *(This is the same class of error as the one this whole stage exists to prevent — a plausible number, confidently repeated, whose provenance nobody checked. It got into a document about not doing that. §12 now records the primary.)*

**Consequence for us:** ranking a 3,400-page encyclopedia by *keyword* volume is a category error even if every number is right. The unit is the **cluster/parent topic** (§6.1).

### 2.3 Ahrefs: Parent Topic — the clustering primitive

Ahrefs computes Parent Topic by taking the #1 page for a keyword and finding the query sending that page the most traffic. It answers: *is this a page, or a section of someone else's page?* Ahrefs' own guidance is that seeds should be **specific** ("how to plant flowers", not "gardening"). Note this cuts against a naïve reading of our failure: the fix for "turmeric curcumin" is not "always use the shortest term" — it is "use terms that **exist**". (§4.2)

### 2.3a Ahrefs contradicts our Rule C — and the resolution is the whole thesis of this stage

**This is a real disagreement with a named authority, not a strawman.** Ahrefs' *Seed Keywords: What Are They & 7 Actionable Ways to Find Them* lists, as **method #1**: *"Brainstorm variations of your target keyword"* — create lists of synonyms and industry terminology from your own head. Our Rule C (§4.2) bans exactly that: `seeds = ontology ∪ audience`, nothing else. **Ahrefs, the most-cited keyword-research authority in the industry, sanctions the practice that produced our worst artifact.** That has to be faced, not finessed.

**Who is right for our case: we are — but only because of *who is holding the tool*, and that distinction is the point.**

1. **Ahrefs is writing for a human inside a tool UI, and the UI is a correction loop.** A human who brainstorms *turmeric curcumin*, types it into Keywords Explorer, and sees `27,100` sitting next to `turmeric 301,000` **self-corrects in the same glance**. The brainstorm is a *hypothesis* that the interface immediately falsifies. Ahrefs can safely recommend brainstorming because the next screen grades it.
2. **Our agent had no such loop, and the asymmetry is total.** It generated the same string, queried it *alone*, received `27,100`, and wrote it into a strategy document as the demand for turmeric. **Nothing in the path compared the invention against the real term, because the real term was never queried.** An LLM produces fluent plausible strings and — unlike the human — has no felt surprise at a wrong number. The brainstorm was never falsified because nothing was positioned to falsify it.
3. **Read precisely, Ahrefs does not authorise what we did anyway.** Method #1 is *"variations and synonyms **of the term you are researching**"* — variations of a **real term already in hand**. That is our K1→K3 expansion, and it is legitimate. `turmeric curcumin` is not a variation of a term; it is **two different entities welded together** (§4.2 Rule B). No reading of Ahrefs licenses it. Ahrefs' own caveat is the epitaph: **"The output is often only as good as the input."**
4. **Ahrefs' remaining six methods are, without exception, provenance-based** — competitors' ranking keywords, SERPs/PAA, **communities and forums (Reddit, Quora)**, product/brand lists, navigation menus, Search Console. **Six of seven derive seeds from an external artifact; only #1 comes from the head.** Our doctrine keeps six of seven and restricts the one that requires a human's falsification reflex to survive.

> **Ruling: Rule C stands, and Ahrefs is not overruled — it is *scoped*.** Brainstorming is a legitimate human method inside a correction loop and an illegitimate agent method outside one. **We are the outside-one.** Where Abilash's order says "keywords come FROM the audience's actual language," it is not a stylistic preference — it is the only seed source that survives having no human in the loop.

**A consequence that raises Q4 from a nicety to a method gap.** Ahrefs' method #4 is *"Review communities and forums"* — **Reddit and Quora, named**. That is precisely our K2. It is also precisely what this agent **cannot reach**: `reddit.com` and `old.reddit.com` are both blocked to this user agent (re-verified in rev 3 — see §11 Q4). **We have banned the head-brainstorm and are simultaneously locked out of the authority-endorsed substitute for it.** For an encyclopedia whose audience speaks in forums, that is a hole in K2's supply, not a missing footnote. Until Q4 closes, K2's verbatim layer rests on whatever non-Reddit sources the dossier reached — and the stage should say so out loud rather than present K2 as fully sourced.

### 2.4 Aleyda Solís: mapping, not listing

Solís's contribution is that keyword research does not end at a list — it ends at a **map**: each query bound to a page of the right *nature* for that journey stage and intent, which is simultaneously how you detect **cannibalisation** and how you decide what to build first. Her stated pipeline is Gather → Analyse → Hypothesise → **Prioritise**, with client/business validation filtering out queries that are popular but meaningless. This is the direct ancestor of our §8 output contract, and it is exactly the artifact the failed pull never produced.

### 2.5 Moz: the metric model

Moz Keyword Explorer's Volume / Difficulty / **Opportunity** / **Priority** split is the cleanest published statement that a single blended score should fold demand, achievability and CTR — and that relevance is a *separate* axis a tool cannot supply. Our §6.5 score follows this shape, with Moz's own caveat: prioritisation must align to intent, not to volume.

### 2.6 SERP-overlap clustering: the practitioner default

The published consensus for grouping keywords onto one page is shared-URL overlap in the top 10: **3–4 shared URLs = same cluster** (moderate), **7+ = definitely one page**, ~40% overlap being the common line. Google's own results are the arbiter of whether two queries are one intent — which is why this beats semantic similarity, and why it is the only clustering method that would have caught "turmeric" and "turmeric curcumin" as *not* two independent demand pools.

### 2.7 AEO: questions are a first-class harvest

The AEO literature converges on a method: harvest **People Also Ask** trees and question-format autocomplete ("how do I", "what is the best", "why does"), building a two-level map of primary and follow-up questions. This is a *harvest*, not a vibe — which is why it is a numbered sub-step (K5) with an artifact, not a principle.

### 2.8 The ontology backbone exists, and it is a legal document

For Ayurveda we are unusually lucky: the entity list is not a judgement call.
- **The Ayurvedic Pharmacopoeia of India (API)** is a legalised Government of India standard for drugs manufactured and sold in India (PCIM&H, Ministry of AYUSH, an autonomous body est. 2010).
- **API Part I = 9 volumes (1986–2016)** containing (Frontiers in Pharmacology, 2023) **621 single botanical drugs from 393 species, 323 genera, 115 families**; monographs carry **Sanskrit and botanical names**.

**621 pharmacopoeial drugs with official Sanskrit + Latin names is the seed backbone.** The failed pull used ~80 seeds, some invented. There was no reason to guess: the list is published, free, and legally canonical.

---

## 3 · The API we actually hold — VERIFIED, not assumed

`scripts/dfs.sh <endpoint-path> '<json>'` POSTs authed to `https://api.dataforseo.com/v3/…`, creds from `~/.secrets/dataforseo.env`. Everything in this table marked ✅ was executed live on 2026-07-15.

| Endpoint | Cost (documented) | Cost (**observed**) | Returns | Verified |
|---|---|---|---|---|
| `keywords_data/google_ads/search_volume/live` | flat/task, "1 or 1000 keywords same" | **$0.09/task** (14kw, 8kw, 10kw all $0.09) | volume, competition, cpc, monthly_searches | ✅ ×3 |
| `dataforseo_labs/google/keyword_overview/live` | $0.012/task + $0.00012/item | **$0.0126** (5 kw) · **$0.01872** (56 kw) · **$0.01224** (3 kw, **2 returned**) — formula exact, priced on **returned** items | volume, **keyword_difficulty**, **search_intent**, serp_info | ✅ ×4 — **⚠️ silently drops unknown keywords (V9) and returns ALPHABETIZED (V10)** |
| `dataforseo_labs/google/keyword_ideas/live` | $0.012 + $0.00012/item | not run | ideas in same category as seeds; ≤200 seeds; limit 700 default/1000 max | doc only |
| `dataforseo_labs/google/keyword_suggestions/live` | $0.012 + $0.00012/item | not run | seed + words before/after/within | doc only |
| `dataforseo_labs/google/related_keywords/live` | $0.012 + $0.00012/item | not run | "searches related to" SERP element; depth → ≤4,680 ideas | doc only |
| `dataforseo_labs/google/bulk_keyword_difficulty/live` | $0.012 + $0.00012/item (≈$0.025/1k cited) | not run | KD 0–100 log scale, ≤1,000 kw | doc only |
| `dataforseo_labs/google/search_intent/live` | $0.012 + $0.00012/kw | not run | informational/navigational/commercial/transactional + secondary + probability; ≤1,000 kw; **35+ langs incl. Hindi** | doc only |
| `dataforseo_labs/google/historical_search_volume/live` | **$0.12/task + $0.0012/item** (10× the others) | not run | volume since 2019 → seasonality | doc only |
| `dataforseo_labs/google/serp_competitors/live` | $0.012 + $0.00012/item | not run | who owns the SERP for a keyword set | doc only |
| **`serp/google/organic/live/advanced`** | per request, depth-dependent | **$0.002/task** (depth=10) | **`people_also_ask` · `organic` URLs · `featured_snippet` · `ai_overview` · `paid` · `related_searches` · `knowledge_graph`** — 31+ item types, depth ≤200 | ✅ ×1 |

**Rate limits (documented):** Google Ads live endpoints **12 req/min**; Labs up to 2,000 calls/min. The Google Ads limit is the real throughput ceiling — 12 tasks/min × 1,000 kw = 12k keywords/min, still ample.

### 3.0 The SERP endpoint is the instrument for K5, clustering, and serp_risk

GPT-5's audit flagged that §7's promises (PAA harvesting, SERP-overlap clustering, AI-Overview risk) named no instrument — a fair hit: an ungated promise is doctrine, not engineering. **One endpoint supplies all three, verified live at $0.002:**

```
serp/google/organic/live/advanced · keyword="shilajit" · US 2840 · en · depth=10 · $0.002
  item_types: {featured_snippet:1, people_also_ask:1, organic:6,
               short_videos:1, video:1, related_searches:1, knowledge_graph:1}
  PAA →  "What does Shilajit do to your body?"      ← K5 harvest, real questions
         "What happens if I take Shilajit daily?"
         "What is the side effect of Shilajit?"
  organic → webmd.com/vitamins-supplements/shilajit  ← SERP-overlap clustering input
            en.wikipedia.org/wiki/Shilajit
            bannerhealth.com/…/shilajit
            amazon.com/Pure-Shilajit-…               ← commercial intent leaking in
            health.clevelandclinic.org/shilajit-benefits
```

- **K5 (AEO):** `people_also_ask` items are the harvest. No third-party tool needed.
- **§7.1 (clustering):** `organic[].url` at depth=10 is the shared-URL set for overlap scoring.
- **§7.5 (serp_risk):** `ai_overview`, `featured_snippet`, `paid` presence are directly observable item types. **Caveat:** AI Overview may require `load_async_ai_overview` (+$0.002); this SERP returned none, so I have **not** verified AI-Overview capture — flagged as **Q7**, and `serp_risk` must not be scored as if it were verified.
- **Cost:** 3,400 entities × $0.002 = **$6.80** for the entire SERP layer.

**A finding worth escalating to strategy, not just to this stage:** the #1 US organic result for `shilajit` (201,000/mo) is **WebMD**, with Cleveland Clinic and Wikipedia alongside. We are building "the WebMD of Ayurveda" and WebMD is *already* the WebMD of Ayurveda in the US SERP. That is a competitive fact the demand map should have surfaced on day one and didn't — it belongs in S6's difficulty picture and in the comp-set doctrine (`docs/ktahv-inputs/comp-set.md` is the model).

### 3.1 The two endpoints disagree, and the disagreement is the product

`google_ads/search_volume` is Google's own aggregate. Labs `keyword_overview` is DataForSEO's database. **Where Google has data they agree exactly** (turmeric: 301,000 = 301,000). **Where Google has a coverage hole, Google returns `null` and Labs still has the number** (shilajit: `null` vs 201,000). DataForSEO documents the hole in its own caveat: *"Google Ads may return no data for certain groups of keywords."*

This is the single most important operational fact in this document:

> **A `null` from `google_ads/search_volume` is a statement about Google Ads' data coverage. It is not a statement about the world. The second endpoint frequently knows the answer.**

Every `null` is therefore not merely "flag it" — it is **an unfinished query**. The stage is not complete while a `null` remains unresolved.

### 3.2 Budget — the constraint that never existed

Full-ontology pull, both endpoints, ~50,000 keywords across locales:
- `google_ads`: 50 tasks × $0.09 = **$4.50**
- Labs `keyword_overview`: 50 tasks × $0.132 = **$6.60**
- **Total ≈ $11** for volume + difficulty + intent, both sources, every locale.

Against ~$50 credit. **The rigorous method costs about $11 and the sloppy one cost $0.18.** Cost is never again an argument for a thin seed set. (Live credit balance not checked — asserting only per-call costs I observed.)

---

## 4 · THE STAGE — S4–S5, labelled, one sub-step at a time

Each sub-step has an **entry condition**, an **artifact**, and an **exit test**. No sub-step may start before its predecessor's exit test passes. The agent announces which K-step it is entering.

### 4.0 · THE DO / DON'T SPINE — mandatory, and the DON'T column is the load-bearing one

**Abilash's ruling (15 Jul 2026):** *"Whenever we do research, what we should do and what we should not do… best practices AND worst practices have to be checked."* Rev 2 did not carry this at all. It is added here as the stage's spine, not an appendix.

**Why the DON'T column is the one that does the work — stated precisely, because "list both" is otherwise just symmetry for its own sake.** Every DO in this stage was *already satisfied* by the failed pull. It used a real API, real endpoints, real locations, and produced a real, well-formed, internally consistent artifact. **The failure passed every DO and shipped.** Nothing on a best-practice list would have stopped it, because best-practice lists describe the shape of good work and the artifact had the shape of good work. **What it violated were DON'Ts — and only DON'Ts.** That is the empirical case for the column, from our own record.

**Each DON'T below is (a) concrete, (b) traced to a real documented failure — ours or a cited authority's, and (c) mapped to the check that catches it.** A DON'T with no check is a wish; those are marked ⚠️ and are open questions, not rules.

| K-step | ✅ DO | ⛔ DON'T — and whose real failure it is | Caught by |
|---|---|---|---|
| **K0** Entry | Refuse to start without the S2–S3 audience dossier. | **DON'T start keyword work because the deadline says so.** *Ours:* the demand map was pulled with no audience dossier in existence — so seeds could only come from the agent's head. **Every downstream failure is downstream of this.** | G1 |
| **K1** Ontology | Derive entities from authoritative published lists (API Part I: 621 drugs / 393 species, Sanskrit + Latin). Cite every row. | **DON'T let the agent decide what an entity is.** *Ours:* ~80 ad-hoc seeds, some invented, while a free, legally canonical, 621-drug list existed. **DON'T merge `synonyms[]` and `constituents[]`** — that collapse *is* the `turmeric curcumin` hole (§4.2 Rule B). | G2 |
| **K2** Audience language | Take verbatim query-shaped phrasing from the dossier; each phrase carries its source quote. Ahrefs method #4: communities/forums. | **DON'T paraphrase the audience into tidy marketing English** — the register *is* the keyword (`ke fayde`, not "benefits of"). **DON'T fabricate the forum layer you couldn't reach** — Reddit is blocked (Q4); say so rather than quote threads you never opened. | G3 · Q4 |
| **K3** Seeds | `seeds = ontology ∪ audience`, nothing else. Every seed tagged with origin. | **DON'T brainstorm seeds** — legitimate for a human in a tool UI, *illegitimate for an agent with no falsification loop* (§2.3a). **DON'T concatenate two names for one thing** (Rule A) **or a parent with its constituent** (Rule B). *Ours: all 8 offenders.* | G4 |
| **K4** Expansion | Programmatic only — `keyword_ideas`, `keyword_suggestions`, `related_keywords`. Reproducible by re-running. | **DON'T hand-type "just a few more" candidates into the expansion set.** Machine-generated is auditable; hand-added is indistinguishable from invented once it's in the file. | G3 |
| **K5** AEO/questions | Harvest real PAA trees from the SERP endpoint ($0.002/query). | **DON'T write the questions you assume people ask.** **DON'T treat one PAA snapshot as the question set** — SERP composition is unstable run-to-run (§7.5, verified). | G5a ⚠️ |
| **K6** Locale pull | A market is `(location_code, language_code)` **and a script/register**. India = en + Devanagari + Hinglish. | **DON'T pull a market in English only.** *Ours: India, en-only.* **DON'T assume "Hindi" means Devanagari** — Hinglish is the *bigger* channel for our entities (verified twice, §5.2/§5.3). **DON'T let `language_code` stand in for register** — it doesn't affect volume at all (§5.1a). | G5 |
| **K7** Validation | Run V1–V10 before any number is seen by a human. Nulls are unfinished queries. | **DON'T coerce `null`→0** *(ours)*. **DON'T coerce absent→0** — `d.get(k,0)` on Labs *(V9, new)*. **DON'T positionally zip request→response** — Labs alphabetizes *(V10, new)*. **DON'T sum a set containing a non-measured row.** **DON'T read meaning into a bare `null`** — it's identical for a 201k head term and for gibberish. | G6–G11 · G16 · G17 |
| **K8** Scoring | Score at cluster level; report inputs beside any composite. | **DON'T ship a blended score with invented weights** — that is a new authoritative-looking number with nothing under it (Q3/Q8 keep `opportunity` non-blocking). **DON'T report volume beyond 2 s.f.** — the ladder is ~±11% buckets (V8). **DON'T prioritise on an annual average** for seasonal entities. | G13 · V8 |
| **K9** Handoff | Emit `keyword-map.json`; S6 refuses on non-PASS. | **DON'T let a keyword stage decide URLs** — S6 owns architecture and the PROTECTION MAP outranks it. **DON'T hand an auditor an artifact pre-annotated with your conclusions** *(our own recorded failure — it turns verification into echo)*. | G13 · G14 |

**Three DON'Ts that bind at every K-step, not one:**

- ⛔ **DON'T report a number without its provenance and date.** (V7 — the rule that makes `demand-raw.json` structurally impossible.)
- ⛔ **DON'T let a .md file stand as evidence a rule ran.** (Doctrine (f) — the reason this document's own header says it protects nothing yet.)
- ⛔ **DON'T weaken a check to make the stage pass.** (Doctrine (g) — V3 ships *report-only* with unsourced floors rather than shipping with invented ones. Report-only-with-a-reason is rigour; a fabricated threshold is the original sin one level up.)

> **The DON'T list's real function.** A DO list is graded on whether you *did* something; an agent can satisfy it and still be catastrophically wrong, as ours was. A DON'T list is the only artifact an auditor can run *against a finished output* and get a verdict from. **This table is therefore also the auditor's rubric (§9, G14) — the same text, read in the opposite direction.**

> **K0 · ENTRY GATE** — refuse to start without the S2–S3 audience dossier. If `docs/<site>-research/audience.md` is absent, **stop**. Seeds derive from audience + ontology; with no audience, seeds can only be invented — which is precisely how this failed. *Exit: dossier path printed and its verbatim-language section is non-empty.*

> **K1 · ONTOLOGY** — build the canonical entity list from authoritative sources **before touching any API**.
> - Ayurveda: API Part I (621 drugs / 393 species, Sanskrit + Latin per monograph), AYUSH/CCRAS lists, classical text indices.
> - Every entity gets: `canonical_id` · `preferred_term` · `sanskrit_term` (Devanagari + IAST) · `latin_binomial` · `common_en[]` · `synonyms[]` · **`constituents[]`** · `source_url` · `source_type`.
> - **`synonyms[]` vs `constituents[]` is a load-bearing distinction, not bookkeeping.** `amalaki` is a *synonym* of amla (same referent, Rule A). `curcumin` is a *constituent* of turmeric (different referent, Rule B). Collapsing them into one list re-opens the exact hole that produced `turmeric curcumin`. Both lists are sourced from the API monograph.
> - **Every entity must cite its source.** An entity with no source is not an entity.
> - *Artifact:* `docs/<site>-research/ontology.json`. *Exit:* 100% of rows carry a resolvable `source_url`; count reported; **zero terms appear in both `synonyms[]` and `constituents[]`** of the same entity.

> **K2 · AUDIENCE LANGUAGE** — extract **verbatim** query-shaped language from the dossier (forum/review/interview phrasing). This is the only legitimate source of non-ontology seeds. *Artifact:* `audience-language.json`, each phrase carrying its source quote. *Exit:* every phrase traceable to a dossier line.

> **K3 · SEED SET** — `seeds = K1 canonical/synonym terms ∪ K2 verbatim phrases`. **Nothing else may enter.**
> - **THE COMPOUND BAN (§4.2)** runs here as code, not vibes.
> - *Artifact:* `seeds.json`, each seed tagged `origin: ontology|audience` + provenance.
> - *Exit:* `seed-lint` passes with zero violations; every seed's origin resolves.

> **K4 · EXPANSION** — programmatic only: Labs `keyword_ideas` (category-mates), `keyword_suggestions` (seed + affixes), `related_keywords` (SERP "related searches"). Machine-generated candidates are legitimate; *hand-typed* ones are not. *Exit:* expansion is reproducible from `seeds.json` by re-running the script.

> **K5 · AEO / QUESTION HARVEST** — People Also Ask trees + question-format autocomplete per cluster; two-level primary→follow-up map. Questions are candidates in their own right and carry into the output contract as answer targets. *Artifact:* `questions.json`. *Exit:* every cluster with ≥1 page has ≥1 harvested question, or is explicitly marked `no-questions-found` with the empty response captured.

> **K6 · MULTI-LOCALE PULL (§5)** — the locale matrix, both endpoints, raw capture.

> **K7 · DATA-INTEGRITY VALIDATION (§6)** — **the gate. Blocking. Automated. No number leaves this stage un-validated.**

> **K8 · ENRICHMENT & SCORING (§7)** — difficulty, intent, SERP features, seasonality, opportunity score.

> **K9 · OUTPUT CONTRACT (§8)** — emit the artifact S6 consumes. *Exit:* schema-valid, and every row's numbers carry a `confidence` and a source.

### 4.2 THE COMPOUND BAN — as an executable rule

The brief bans "compound concatenations". Stated that way it is unenforceable (is *bacopa monnieri* a compound? It's a Latin binomial. Is *ashwagandha benefits* a compound? It's a real modifier query). Here is the rule that actually distinguishes our failures from legitimate multi-word terms:

**A seed is BANNED when it juxtaposes two names for the same referent.** But — as GPT-5's audit of this document correctly caught — *that single rule does not catch our flagship offender*, and the near-miss is instructive enough to keep on the record. **Three rules are required, not one.**

The eight real offenders are not one failure mode. They are two:

| Seed | `<a>` | `<b>` | Relationship | Caught by |
|---|---|---|---|---|
| `tulsi holy basil` | tulsi | holy basil | **synonym** | Rule A |
| `amla amalaki` | amla | amalaki | **synonym** | Rule A |
| `giloy guduchi` | giloy | guduchi | **synonym** | Rule A |
| `fenugreek methi` | fenugreek | methi | **synonym** | Rule A |
| `boswellia shallaki` | boswellia | shallaki | **synonym** | Rule A |
| `yashtimadhu licorice` | yashtimadhu | licorice | **synonym** | Rule A |
| `kapikacchu mucuna` | kapikacchu | mucuna | **synonym** | Rule A |
| **`turmeric curcumin`** | turmeric | curcumin | **parent → constituent** ⚠️ | **Rule B** |

**Curcumin is not a synonym of turmeric — it is a chemical constituent of it.** They are genuinely different entities with different demand and different CPC (verified: 301,000/$0.86 vs 60,500/$2.48). Rule A, which fires only on two names for *one* entity, would have waved `turmeric curcumin` straight through. The rule that was supposed to prevent our headline failure did not cover our headline failure. Hence:

**RULE A — self-juxtaposition (catches 7/8).** Decidable because K1 built synonym sets from the pharmacopoeia:
```
for seed in seeds:
    toks = tokens(seed)
    if ∃ entity E, ∃ a,b ∈ synonyms(E) ∪ {preferred, sanskrit, latin, common}:
           a ⊆ toks and b ⊆ toks and a ≠ b:
        FAIL(seed, "SELF-JUXTAPOSITION: '{a}' and '{b}' both name {E.canonical_id}")
```
Passes `bacopa monnieri` (one binomial = one name). Passes `ashwagandha benefits` ("benefits" is not a synonym).

**RULE B — parent/constituent juxtaposition (catches `turmeric curcumin`).** Requires a new K1 field, **`constituents[]`** (turmeric → curcumin; boswellia → boswellic acid), sourced from the API monograph:
```
if ∃ E, ∃ c ∈ constituents(E): name(E) ⊆ toks and c ⊆ toks:
    FAIL(seed, "PARENT-CONSTITUENT: '{c}' is a constituent of '{E}', not a query.
                Test '{E}' and '{c}' SEPARATELY — they are different queries.")
```
This is a supplement-**label** pattern ("Turmeric Curcumin 1500mg"), not a search pattern — which is exactly why it looked plausible to an agent reading product copy and why it must be caught by structure rather than by taste.

**RULE C — provenance backstop (catches everything, including modes we haven't imagined).** K3's rule is that `seeds = ontology ∪ audience`, **nothing else**. `turmeric curcumin` is not an API monograph and no human ever said it — so it cannot enter a K3-compliant seed set *regardless of Rules A and B*. **Rule C is the actual guarantee; A and B are the fast, legible failures that tell you which specific mistake you made.** A pure-provenance rule alone would reject the seed with "no provenance", which is true but unhelpful; A and B name the error.

**Design note worth keeping:** it took an external auditor to notice that my own anti-hallucination rule didn't catch the hallucination it was written for. That is the strongest possible argument for G14 (§9) — and for never letting a stage grade its own homework.

**Corollary rule — SYNONYMS ARE TESTED SEPARATELY, NEVER CONCATENATED.** `turmeric` and `curcumin` are different queries with different demand and different intent, and we now know it precisely:

```
turmeric  = 301,000 US   comp=HIGH  cpc=0.86   ← the herb
curcumin  =  60,500 US   comp=HIGH  cpc=2.48   ← the isolated compound (2.9× the CPC)
"turmeric curcumin" = 27,100  ← a supplement-label artifact, not the topic
```

Three different things. The old artifact recorded only the third and called it the herb — understating the real head term **11.1×** (301,000 → 27,100), exactly as GPT-5 alleged. **Confirmed live, not taken on trust.** The CPC gap (0.86 vs 2.48) is itself the signal that `curcumin` is a commercially distinct, supplement-buyer query — a fact the concatenation destroyed.

---

## 5 · MULTI-LOCALE — the matrix, and a live surprise

**The rule:** a market is `(location_code, language_code)` — **never a country alone**. The failed pull requested India in `en` only and called the result "India". India is not an English-language market.

### 5.1 Verified locale matrix

| Market | location_code | language_code | Script/register | Status |
|---|---|---|---|---|
| US | 2840 | `en` | English | ✅ mandatory |
| India | 2356 | `en` | English (huge, real) | ✅ mandatory |
| India | 2356 | `hi` | **Devanagari** (देवनागरी) | ✅ mandatory |
| India | 2356 | `en` | **Hinglish / romanized** (`… ke fayde`) | ✅ mandatory — see §5.2 |
| DE / FR | per site brief | `de` / `fr` | KTAHV locales | per brief |

**Treating "Hindi" as a synonym for "Devanagari" loses Hinglish entirely** — the trap one layer below the trap we already fell into.

### 5.1a Hinglish enforcement — a register, not a locale (how G5 is actually checked)

**I got this wrong in rev 1 and my own evidence caught me.** I asserted that "Hinglish must be queried under `language_code=en`, not `hi`" — while my own call #3 had measured `ashwagandha ke fayde` = 33,100 under `language_code=hi`. GPT-5's audit flagged the contradiction. I tested it rather than argue:

```
keyword                 IN/en     IN/hi     verdict
ashwagandha ke fayde    33,100    33,100    IDENTICAL
amla ke fayde            4,400     4,400    IDENTICAL
shilajit ke fayde         null      null    IDENTICAL
```

**`language_code` does not affect the returned volume at all.** The verdict is better than either position: **the register is carried by the keyword STRING, not by the locale code.** `शिलाजीत`, `shilajit`, and `shilajit ke fayde` are three different *strings* — three different queries — and `language_code` is close to decorative for volume lookup. This is why `शिलाजीत` returned `null` while `shilajit` returned 246,000 in the same call region (§5.2): not a language setting, just a different string.

**Consequence:** Hinglish cannot be gated by a locale code — there is no field to assert on. It is enforced by **construction and coverage of the seed strings**, which is what the validator below actually does. (The rule survived; my stated reason for it was wrong.)

**The pattern list (maintained, version-controlled, sourced from the audience dossier — not invented):**
```
ke fayde        (benefits)     ke nuksan     (side effects)    kaise use kare  (how to use)
ki taseer       (hot/cold)     kya hai       (what is)         ke upay         (remedies)
ke fayde aur nuksan            dosage kitna  (how much)        kab lena chahiye (when to take)
```
**Construction rule (K3):** for every priority entity, `IN/en` seeds must include `{preferred_term} + p` for each pattern `p`, generated programmatically from the list.

**Validation rule (V-H, wired into G5):**
```
FOR every priority entity E:
    hinglish_seeds = seeds where locale=IN/en and matches(seed, pattern_list) and contains(seed, E)
    FAIL if |hinglish_seeds| == 0
    FAIL if none were actually queried (no response row in raw/)
```
This is checkable against our own artifacts (did we *ask*?) rather than against a field the API does not expose — which is the only honest way to gate it. The pattern list is a **living file**, and Q5 blocks its ratification: `shilajit ke fayde` returned `null` while `ashwagandha ke fayde` returned 33,100, and I do not yet know whether that is coverage or reality.

### 5.2 The live result that overturns the intuitive rule

```
INDIA (2356) · language_code=hi                    INDIA (2356) · language_code=en
  ashwagandha ke fayde   33,100  (Hinglish!)         ashwagandha    301,000
  अश्वगंधा                22,200                       shilajit       246,000
  हल्दी                   18,100                       amla           165,000
  आंवला                    8,100                       shatavari       90,500
  त्रिफला                  8,100                       gokshura        27,100
  amla ke fayde           4,400  (Hinglish)
  शिलाजीत                  None  ← Devanagari null…   …while en shilajit = 246,000
  शतावरी                   None
  गोक्षुर                  None
  shilajit ke fayde        None
```

Two findings that no amount of doctrine would have produced:

1. **`ashwagandha ke fayde` (33,100, Hinglish) outranks `अश्वगंधा` (22,200, Devanagari).** For our entities, **romanized Hinglish is the bigger Hindi-language channel** — consistent with the published observation that Hinglish is easier to type than Devanagari. A "we'll add Devanagari" fix would have captured the *smaller* half and declared the locale problem solved.

2. **`शिलाजीत` returns `null` while `shilajit` returns 246,000 in the same location.** Same entity, same country, same day — the `null` is a **query-configuration artifact**. This is the §3.1 rule proven twice over: a `null` describes our request, not the world.

**Therefore:** an entity is only "covered" for India when **all three registers** (en, Devanagari, Hinglish) have been queried and their results reconciled. Devanagari-only or en-only India is a **gate failure**, not a partial result.

### 5.3 · Q5 CLOSED — the Hindi nulls were a coverage hole, and Labs had the numbers all along

Rev 2 left **Q5 blocking**: *"`शिलाजीत` and `shilajit ke fayde` both null while `shilajit` IN/en = 246,000. Is this DataForSEO's Hindi coverage or genuine query behaviour?"* It is neither — it is **Google Ads' coverage hole, on a third axis**. I put the identical Hindi keywords through Labs `keyword_overview`:

```
dataforseo_labs/google/keyword_overview/live · IN 2356 · hi · $0.0126

keyword                google_ads      Labs      kd   intent
ashwagandha ke fayde   33,100          33,100     0   informational   ← agree exactly
अश्वगंधा                22,200          22,200     0   informational   ← agree exactly
शिलाजीत                 null            9,900     0   informational   ← null RESOLVED
शतावरी                  null            5,400     0   informational   ← null RESOLVED
shilajit ke fayde       null           27,100     6   informational   ← null RESOLVED
```

**Three findings, none of which existed before the call:**

1. **The §3.1 rule now holds on every axis we've tested** — US English, Devanagari, and Hinglish. Where Google Ads has data the two sources agree *exactly* (33,100 = 33,100; 22,200 = 22,200); where Google Ads is blind it returns `null` and **Labs simply knows the answer**. A `null` has now been shown to describe our request rather than the world in *three separate registers*. V2 is not a nicety; it is the difference between 0 and 27,100.

2. **`shilajit ke fayde` = 27,100 — recorded by rev 2 as `null`, and in the original artifact's logic it would have been a `0`.** Our highest-volume Hindi-language shilajit query was invisible to the endpoint we used.

3. **Hinglish > Devanagari confirmed on a second, independent entity — and the gap widened.** Rev 2 had one data point (`ashwagandha ke fayde` 33,100 > `अश्वगंधा` 22,200, a 1.5× gap). Shilajit is far starker: **`shilajit ke fayde` 27,100 vs `शिलाजीत` 9,900 — 2.7×**. The romanized register is not marginally bigger; for our entities it is *the* Hindi channel. **A "we'll add Devanagari" fix would have captured 27% of shilajit's Hindi demand and declared the locale problem solved.**

**Corroboration, and an honest limit on it.** Wikipedia's *Hinglish* article reports (attributing Palakodety et al.) a YouTube-comment split of **52% Romanised Hindi / 46% English / 1% Devanagari**. **I could not verify this to primary** — the IJCAI PDF would not render to text — so it is **[R] REPORTED, not [P]**, and **nothing in this document rests on it**. It is noted only because it points the same way as our own measurements. **Our live data is the better evidence for our case anyway**: it is about *our entities*, in *our markets*, on *the platform we are optimising for*, measured today. *(A vendor-blog figure — "73% of Indian internet users prefer regional languages" — recurred throughout the search results and is **excluded**: I could not trace it to the KPMG/Google primary it seems to derive from. Untraceable statistics are exactly what §1's source-quality rule exists to keep out, and their being convenient to my argument is a reason for more suspicion, not less.)*

> **Q5 verdict: CLOSED. Hindi-locale prioritisation is unblocked — via Labs, never via `google_ads` alone.** The gate consequence: **for IN/hi and IN/en-Hinglish, Labs is the primary source and `google_ads` is the cross-check** — the reverse of the US default. Rev 2's Q9 (native-speaker ratification of the pattern list) **remains open and is now more urgent, not less**: our own numbers now show the romanized register carrying the majority of the demand, and the pattern list that generates those strings is still unvalidated by a Hindi speaker.
>
> **Honest limit on the "Labs is primary for IN/hi" ruling — GPT-5 flagged this as an unreasoned assumption and it is.** It rests on **five keywords**. What is *established* is narrow and solid: where both sources have data they agree exactly, and Labs resolved 3 nulls that google_ads could not. What is *assumed* is the general policy that Labs is reliably better in Hindi across entities and time. **Five keywords is a strong reason to always ask both (V6) and a weak reason to trust one over the other.** The ruling is therefore **operational, not epistemic**: it says *which source to try second*, and V6 still requires both and still marks any >2× disagreement `confidence: low`. **It must not harden into "Labs is the Hindi truth" without a calibration pull against GSC data on a site we own** (the same evidence Q2 needs — one job, both questions).

---

## 6 · K7 · DATA-INTEGRITY VALIDATION — the blocking gate

**No number may be reported, summed, ranked, or shown to Abilash until every check below has run and passed.** Implemented as `scripts/keyword-validate.mjs`, exit 2 on FAIL, wired into CI exactly like `audit-gpt.mjs`.

### V1 · NULL IS NOT ZERO — the type gate (catches the actual bug)

```
ASSERT  no coercion of null → 0 anywhere in the capture path
ASSERT  no coercion of ABSENT → 0 anywhere in the capture path      ← rev 3, see V9
ASSERT  every keyword row is exactly one of:
          {volume: <int>, status: "measured"}
          {volume: null,  status: "no_data"}      ← endpoint returned a row, no number
          {volume: null,  status: "not_returned"} ← we asked; NO ROW CAME BACK   ← rev 3
          {volume: null,  status: "not_queried"}  ← we never asked
FAIL    if any aggregate (sum/mean/rank) is computed over a set containing status != "measured"
FAIL    if a "raw" file's schema is not the API's response schema
FAIL    if any lookup of a keyword's volume uses a defaulting accessor
        (d.get(k, 0), d[k] ?? 0, COALESCE(vol,0)) — the default MUST be an error
```

**`status: "not_returned"` is new in rev 3 and it is not a pedantic fourth case.** Rev 2's three states assumed every requested keyword comes back in some form. **Labs `keyword_overview` disproves that: it silently omits keywords it doesn't know** (§0.1 Path 2, verified — requested 3, returned 2, `status: "Ok."`). A row that never arrives cannot be `no_data`, because *nothing said so*. Collapsing "the endpoint told us it has no number" into "the endpoint never mentioned it" is the identical category error as collapsing `null` into `0` — one level up, and it defeats V1 by never presenting a row for V1 to type-check.

**The `d.get(k, 0)` clause is the whole of V9 compressed into a lint.** The original incident was one defaulting accessor. **Every defaulting accessor is a loaded gun**; in this stage the correct default is an exception.

**V1 would have prevented the entire incident**, independent of any knowledge of Ayurveda. It is first because it is the only check that does not depend on us already suspecting something. **But rev 3 demotes it from "the" defence to "the first of three": V1 alone is defeated by a row that never arrives (V9) and blind to a row attributed to the wrong keyword (V10).**

### V2 · NULL RESOLUTION — an unfinished query, not a finding

```
FOR every row with status = "no_data":
    → re-query Labs keyword_overview (different data source)
    → if Labs has a volume:  status = "measured_secondary", source = "labs", confidence = "medium"
    → if both null:          re-query in every locale in the matrix (§5.1)
    → if still null:         Perplexity grounding (V5) MANDATORY before "no_demand" may be written
FAIL if any row exits K7 with status "no_data" and no resolution attempt logged
```

Proven to work: shilajit `null` → **201,000** (US), shatavari → 14,800, gokshura → 1,900.

### V3 · HIGH-PRIOR ENTITY LIST — the second net

A curated list of entities that **cannot** plausibly be near-zero in a given market — for Ayurveda: ashwagandha, turmeric, shilajit, triphala, amla, neem, tulsi, brahmi, moringa, chyawanprash, shatavari, giloy, panchakarma. Each carries a **market-specific floor with a source**.

```
FAIL if a high-prior entity reports volume < floor(market) with status "measured"
FAIL if a high-prior entity reports null after V2 resolution
```

Deliberately the *third* check, not the first: it only catches entities we already suspect. V1 catches the ones we don't. **A high-prior list is a safety net under a method, never the method.**

**What runs on day one, before floors exist (Q1)?** A fair question from the audit — a gate listed as "mandatory" whose thresholds are unratified is a gate that silently does nothing.

| Check | v1 status | Why |
|---|---|---|
| V1 (null≠0), V2 (null resolution), V6 (cross-endpoint), V7 (provenance), V8 (quantization) | **HARD-BLOCK from day one** | Zero unratified inputs. They are type and provenance rules, not judgement calls. **V1 alone would have stopped the incident.** |
| V4 (outliers) | **HARD-BLOCK** | Thresholds are relative (10× cluster median), needing no external list. |
| V3 (high-prior floors) | **REPORT-ONLY until Q1 closes** | Floors are unsourced; a fabricated floor is the original sin one level up. |
| V5 (Perplexity grounding) | **HARD-BLOCK on V4 flags; report-only on V3** | Follows whatever fires it. |

**This is deliberate and it is not a weakened gate** (doctrine (g)): the checks that catch our actual failure are all in the hard-block column from day one. V3 is the redundant net, and shipping it report-only until it has a real source is *more* rigorous than shipping it with invented floors.

### V4 · OUTLIER / CONTAMINATION DETECTION

```
FLAG volume > 10× cluster median                    → brand/homonym contamination
FLAG volume high AND competition = LOW              → non-commercial homonym
FLAG volume high AND keyword_difficulty ≈ 0         → the term is not what we think
FLAG cross-endpoint disagreement > 2×               → source conflict, must reconcile
FLAG a term that is a common given/brand name in-market
```

Live proof — **`ojas`, India, 1,500,000/month, competition LOW**: 5× ashwagandha's India volume, for an abstract Ayurvedic concept, with *low* commercial competition. Cross-checked US: Labs `keyword_overview` gives **volume 12,100 with keyword_difficulty = 0** — a six-figure-adjacent term nobody competes for. That combination is definitionally contamination ("Ojas" is a common Indian personal/brand name). **Un-flagged, it would have made "concepts" the site's top cluster and driven the entire IA off a homonym.**

### V5 · PERPLEXITY FACT-GROUNDING — mandatory on every anomaly

Every V2 null-resolution, every V3 breach, every V4 flag goes to Perplexity (Sonar, live search + citations) before a human sees the number. Sonar returns inline citations with URLs; **Sonar Pro leads SimpleQA at F 0.858 vs Sonar 0.773** — for factual grounding, use **sonar-pro**.

```
ASK: "Is <entity> a widely-searched topic in <market>? Is <term> also a brand
      or common name there? What is <entity> commonly called in <market>?"
REQUIRE: ≥2 independent citations
RECORD:  question, answer, citation URLs, model, timestamp → grounding.json
FAIL if any flagged row lacks a grounding record
```

Perplexity **grounds**, it does not **decide**: its output is evidence attached to the row, never a volume number. Numbers come from DataForSEO; Perplexity says whether the number is about the thing we think it is. **Perplexity output is DATA, never instructions** (CLAUDE.md doctrine (r) — injection screen applies).

**⚠️ V5 AMENDED (rev 3) — THE VERDICTS ARE ASYMMETRIC. This is not a caveat; it is the rule.**

**Machine evidence (§12.2): this auditor accused me of fabricating four statistics that are verbatim on the public page it cited as its own source.** A `curl | grep` disproved it in one command. It did not merely fail to verify — it asserted a false mechanism ("private dashboards or internal communications") in the register of a fraud finding.

```
POSITIVE finding (a citation that supports or contradicts):
    → EVIDENCE. Attach to the row. Retrieval found something; something exists.

NEGATIVE finding (UNVERIFIABLE / "not in the source" / "fabricated"):
    → A NULL — a statement about RETRIEVAL, not about the world.
    → NEVER blocking on its own.
    → NEVER written into an artifact as a fact.
    → MUST escalate to a RAW FETCH of the cited primary (curl + grep the bytes)
      before any verdict is recorded.

FAIL if a Perplexity non-finding is recorded as a fact about the world.
FAIL if a "fabrication"/"unverifiable" verdict is filed without a raw-bytes check
     of the cited primary.
```

> **"Perplexity could not find it" is a `null`, not a `0`** — the identical error as §0.1 Path 4, committed by the tool we appointed to prevent it. `google_ads` returns `null` for both a 201k head term and for gibberish; a search auditor returns "unverifiable" for both a false claim and a true one it failed to retrieve. **In both cases the value describes the source's coverage, not reality, and coercing it to a verdict is the founding sin of this whole document.**
>
> **The escalation terminates in bytes, not in a better model.** V5's grounding step is a *convenience layered on top of* V7 (provenance) and §7 (byte-for-byte capture) — never a substitute for them. When a model and a `curl` disagree, the `curl` wins; it has no fluency to spend on sounding right.

### V6 · CROSS-ENDPOINT AGREEMENT — mandatory, not optional

**`priority set` — DEFINED (rev 3). GPT-5 flagged this as blocking and was right: V6 and G5 both trigger on a "priority set" that rev 2 never defined, so two hard gates rested on a term the executing agent would have had to invent.** That is this document's own failure mode in miniature.

```
priority_set := EVERY entity in ontology.json          # Track A — no sampling, no judgement
```

**For Track A the priority set is the whole ontology, and the reasoning is arithmetic, not taste.** The full pull is **~$11** (§3.2) against ~$50 credit. **Any selection rule costs more to design, defend and re-run than querying everything**, and every selection rule is a place for an agent to quietly decide an entity is unimportant — which is how `shilajit` became a zero. **When the complete population is affordable, sampling is not rigour; it is an unforced opportunity to be wrong.**

```
Track B (Shopify)   : priority_set := every live SKU/collection in the catalog (doctrine (j))
Track C (landing)   : priority_set := every keyword with a bid, i.e. the campaign's target set
Retroactive audits  : priority_set := every keyword that appears in ANY shipped artifact
                                      (this is what quarantines whatisayurveda's demand map)
```

**Exception, narrowly drawn:** if an ontology ever exceeds ~50,000 keywords × locales such that a full pull breaches budget, the priority set may be restricted **only** by a rule committed to the repo *before* the pull, with the excluded set enumerated and its exclusion reason recorded per row. **"We didn't get to it" must be a written `status: "not_queried"` (V1), never an absence.**

```
FOR every keyword in the priority set:
    pull BOTH google_ads/search_volume AND labs/keyword_overview
    agreement (±20%)  → confidence = "high"
    disagreement >2×  → confidence = "low", V5 grounding required
    one null          → V2, confidence = "medium"
```

Costs ~$11 for the full ontology (§3.2). There is no budget argument against it.

**⚠️ Contract-drift warning (rev 3, from GPT-5's "assumed" list — a fair hit).** The flat $0.09/task, the per-returned-item Labs pricing, the alphabetized Labs ordering and the request-order `google_ads` ordering are **behaviours I observed on our account on 2026-07-15**, not contracts DataForSEO documents at the point of use. **They can change without notice and our evidence would not notice.** Two consequences: (a) **V10 is deliberately written so we never depend on them** — "key-join only" is correct under *any* ordering, including one that changes tomorrow; a rule that said "reverse the alphabetization" would be a time bomb. (b) The cost assertions in §3.2 must be **re-derived from the response `cost` field on every run** (as §12's ledger now is), never read from this table. **A documented observation is a fact about a day, not a law.**

### V7 · PROVENANCE COMPLETENESS

```
FAIL if any number in any artifact cannot name: endpoint · request payload ·
     response file · timestamp · cost · locale · status · confidence
```

If a number cannot say where it came from, it does not ship. This is the check that makes `demand-raw.json`'s failure mode structurally impossible.

### V8 · BUCKET QUANTIZATION — every volume we hold is a label, not a count

**Measured, not assumed.** Across 160+ keywords spanning US + India, `google_ads/search_volume` returned only **47 distinct values**, with a **median ratio of 1.224 between consecutive distinct values**:

```
10, 20, 40, 50, 70, 90, 110, 170, 210, 260, 320, 390, 480, 590, 720, 880, 1000,
1300, 1600, 1900, 2400, 2900, 3600, 4400, 5400, 6600, 8100, 9900, 12100, 14800,
18100, 22200, 27100, 33100, 40500, 49500, 60500, 74000, 90500, 110000, 135000,
165000, 201000, 246000, 301000, 673000, 1500000
        ratios: … 1.222, 1.227, 1.222, 1.222, 1.223, 1.223, 1.227, 1.221 …
```

This is a **geometric ladder of ratio ≈1.22** — Soulo's "volume buckets", confirmed against our own data rather than taken on faith. **No volume DataForSEO gives us is a measurement. Every one is the label of a bucket ~±11% wide**, and the true value sits anywhere inside it.

```
FAIL if any volume is reported to >2 significant figures
FAIL if a cluster sum is presented without its quantization band
WARN that cluster sums inherit ~±11% per term, compounding with cluster size
```

**"herbs 2.57M/mo" was fake precision to six significant figures, built from a 47-value ladder.** Even had every seed been real and every null resolved, that number was never knowable to better than ~±11% per term. The old artifact was wrong twice over: wrong inputs *and* a precision claim the instrument cannot support.

**A rule I nearly wrote, and why it is WRONG — recorded so nobody re-adds it.** The Hinglish test produced `ashwagandha benefits` = `ashwagandha ke fayde` = **33,100 exactly**, which looks like Google's documented close-variant grouping (§2.1) and tempted me toward a rule: *"identical volumes across similar keywords = grouping artifact, don't sum."* Then the failed artifact showed `moringa` = `ashwagandha benefits` = 201,000 — two **completely unrelated** terms. And `neem` = `bacopa monnieri` = `gotu kola` = 22,200.

**On a 47-value ladder, collisions are expected, not evidence.** 80 keywords produced 16 colliding values in the US set — that is the pigeonhole principle, not Google grouping. **A "duplicate volume ⇒ grouping" check would be a false-positive machine**, flagging arithmetic that is fine and training the team to click through warnings. Grouping is real and documented, but **identical volume is not a usable detector of it** — the only sound detector is SERP overlap (§7.1), which asks Google directly.

*Kept in the spec because a rejected rule with a reason is worth more than a rule nobody questioned — and because this one would have passed review on plausibility, which is precisely the failure mode this stage exists to stop.*

### V9 · REQUEST/RESPONSE SET RECONCILIATION — the row that never came back *(rev 3, NEW)*

**Verified live (§0.1 Path 2): Labs `keyword_overview` silently omits keywords it does not know. `status: "Ok."`, no warning, and the cost drops to match — you are billed per *returned* item, so even the invoice conceals the loss.**

```
FOR every API call:
    requested := set(payload.keywords)
    returned  := set(response.keyword for each item)
    ASSERT returned ⊆ requested          # unrequested rows = wrong response, hard fail
    FOR k in (requested − returned):
        emit {keyword: k, volume: null, status: "not_returned"}   # NEVER omit, NEVER 0
    FAIL if any consumer indexes the response by keyword with a default value
    FAIL if |requested| ≠ |returned| + |not_returned|
```

**Endpoint asymmetry — this is why one rule cannot be written for "the API":**

| behaviour | `google_ads/search_volume` | Labs `keyword_overview` |
|---|---|---|
| keyword it has no data for | **returns the row, `volume: null`** | **omits the row entirely** |
| billing | flat $0.09 regardless | **per returned item** — silence is *cheaper* |
| what a naive consumer gets | `null` → (V1 catches) | `KeyError` → `.get(k,0)` → **`0`** |

**The finding that makes V9 urgent rather than tidy: rev 2's V2 remedy routes every null through the dropping endpoint.** "For every `no_data` row, re-query Labs" means our fix for mechanism 1 runs through mechanism 2. **A keyword null in Google Ads *and* unknown to Labs returns from the repair as absence** — and absence, unreconciled, becomes zero. **Rev 2's cure could re-create rev 2's disease.** V9 must therefore run *inside* V2's loop, not merely after it.

### V10 · KEY-JOIN ONLY — never positional *(rev 3, NEW)*

**Verified live (§0.1 Path 3): the two endpoints have opposite ordering contracts.** Labs returns **alphabetized** (`returned == sorted(returned)` → `True`); `google_ads` returns **request order**. Neither documents this where you'd read it.

```
FAIL if any code joins request→response by index
     (zip(seeds, items), items[i], enumerate over the payload, pandas concat on position)
ASSERT every volume is attached to a keyword by STRING KEY read from the response item itself
ASSERT round-trip: for each item, item.keyword ∈ requested
```

**Why this outranks the bug that started all this.** `shilajit = 0` was *implausible* — GPT-5 caught it by knowing Ayurveda. A positional misjoin produces **plausible numbers against plausible keywords**: `ashwagandha benefits → 1,300` (really *abhyanga massage*'s volume) looks entirely reasonable, would pass V1, V3, V4, V8, and would pass a human read. **It is silent, total, and undetectable by inspection.** With 56 keywords sorted alphabetically against a request in thematic order, **essentially every row is wrong**, and nothing in the artifact says so.

> **V9 and V10 exist because I attacked the endpoints instead of re-reading the doctrine.** Neither is inferable from rev 2; both took a deliberately hostile payload (a nonsense keyword, a 56-item batch) and a check nobody would run on a passing call. **The lesson is the method, not the two rules: the way to find silent corruption is to try to cause it.** Doctrine review cannot produce V9 or V10 — only adversarial testing can, and the count of known mechanisms will rise again the next time someone bothers.

---

## 7 · BEYOND VOLUME

### 7.1 The unit is the cluster, not the keyword — and here the experts disagree

**The disagreement:** Moz's model implies keyword-level prioritisation (Volume/Difficulty/Opportunity/Priority *per keyword*). Ahrefs (Soulo) argues the keyword is the wrong unit entirely — pages rank for ~1,000 keywords, and the *submit website to search engines* page out-earns the higher-volume *local SEO* target because it rank-covers 1,400 keywords vs 311.

**Who is right for us: Ahrefs, decisively, and it's not close.** We are building a **3,400-page encyclopedia** where one entity page will rank for a long tail of *what is / benefits / dosage / side effects / for X* around its head term. Keyword-level ranking would let 30 `ashwagandha *` variants each claim a page and shatter one strong entity page into thirty thin ones — a Google-visible quality problem at our scale. Moz's model is built for picking *the next post*; ours is picking *an architecture*. **We prioritise at the cluster/parent-topic level and treat keyword volume only as a within-cluster signal.**

Clustering method: **SERP overlap** — Google arbitrates, not our semantics. This is also what kills the residual "turmeric vs curcumin" question empirically instead of by argument, and (per V8) it is the *only* sound grouping detector we have.

**Threshold honesty.** The ≥3 / ≥7 shared-URL figures in §2.6 come from **SEO agency blog posts, not a primary study** — I could not trace them to a published methodology, and the audit was right to flag them as asserted consensus. They are a **starting default, explicitly uncalibrated (Q10)**, not a law. Calibration plan: run overlap at depth=10 across ~50 known entity pairs where we already know the right answer (`turmeric`/`curcumin` should split; `amla`/`amalaki` should merge), and fit the threshold to those. **Until calibrated, cluster boundaries are advisory to S6 and a human reviews any merge.**

### 7.2 Difficulty
Labs `keyword_difficulty`, 0–100 **logarithmic** — never average KD values linearly. Verified: turmeric KD=66, shilajit KD=12, shatavari KD=12, gokshura KD=8. **shilajit: 201,000 volume at KD 12** — the highest-value opportunity in the set, and the one we recorded as zero.

### 7.3 Intent
Labs `search_intent` — informational/navigational/commercial/transactional + secondary + probability, ≤1,000 kw, **Hindi supported**. All five test entities: `informational` — consistent with an encyclopedia thesis, and a *falsifiable* check on it. Intent decides **template** (§8), and it is the field that keeps KTAHV clinical-register pages from being scored against commercial queries.

### 7.4 Seasonality
`monthly_searches` (12 mo, free in the volume response) covers most needs; `historical_search_volume` (since 2019) is **10× the price** — reserve for entities where a build decision turns on the trend. **Rule: never prioritise on an annual average alone for any entity with >2× peak-to-trough variance** — the *NFT* lesson (§2.2).

### 7.5 SERP features — Q7 CLOSED, its premise REFUTED, and `serp_risk` is not what rev 2 thought

Whether the SERP is AI-Overview'd, PAA-heavy, or ad-stacked changes the *value* of rank 1, and volume cannot see this. Ahrefs data: AI Overview presence correlates with **-34.5% CTR** across 300k keywords. A high-volume, AI-Overview-saturated informational query may be worth **less** than a mid-volume one with a clean SERP — a fact that flips priority order and which our old model was blind to.

**Rev 2 raised Q7:** the `shilajit` SERP returned no `ai_overview` item, so *"AI-Overview capture is unverified; `load_async_ai_overview` (+$0.002) may be required."* **I ran the 2×2 it asked for. The hypothesis is refuted, and the true answer is worse.**

```
serp/google/organic/live/advanced · US 2840 · en · depth=10 · $0.002 each (flag adds NO cost)

keyword                flag ON              flag OFF             asynchronous_ai_overview
ashwagandha benefits   ai_overview PRESENT  ai_overview PRESENT  false
shilajit               ai_overview PRESENT  ai_overview PRESENT  false
                       ↑ rev 2, hours earlier, same endpoint, same params: NO ai_overview
```

1. **Capture was never broken.** AI Overviews arrive in the standard `$0.002` response with no flag. `load_async_ai_overview` changed nothing on either query and cost nothing extra.
2. **The SERP itself moved.** `shilajit` had no AI Overview this morning and has one this afternoon — **flag OFF both times**. Rev 2's observation was *true when made* and false hours later. It was never a capture bug; **it was a snapshot of something that flickers.**
3. **Composition is unstable too** — across two `shilajit` pulls minutes apart: `organic` 8→7, `short_videos` appeared, `video` and `knowledge_graph` moved.

**This is published, not a local anomaly.** Semrush ([URL volatility in AI Overviews](https://www.semrush.com/blog/url-volatility-ai-overviews/), 1,500 desktop + 1,500 mobile US keywords that triggered an AIO on ≥20 of 31 days, Oct 2024): a URL survives inside an AIO an average of **3.87 consecutive days (desktop) / 3.33 (mobile)**; **91% of URLs were removed at some point**; only **43% ever reappeared**; **96% of keywords saw a domain change**. Authoritas reports ~**70%** of AIO-ranking pages changing over 2–3 months **[R]**.

> **Consequence — and it is a design fault, not a weight problem.** Rev 2 defined `serp_risk = 0.35·ai_overview + 0.25·featured_snippet + …` with `ai_overview` as a **0/1 read from one call**. **That term is not measurable that way.** A single pull samples a process that changes daily; our own two pulls of one keyword disagree. Rev 2 blocked `serp_risk` on Q7 ("is capture working?") — the *right* block for the *wrong* reason. **Capture works; the measurement design is invalid.** Fixing Q7 does not unblock `serp_risk`; it replaces the blocker with a harder one.

**The rule that follows (→ Q12, new):** SERP features are **probabilities, not booleans**. `ai_overview` must be `P(AIO)` estimated from **repeated sampling over ≥7 days** (Semrush's own criterion was ≥20/31 days before a keyword was even admitted to the study), or sourced from a provider that tracks it longitudinally. At $0.002/pull, 7 daily samples × 3,400 entities = **$47.60** — affordable, but it is a *cron job and a time series*, not a field in a one-shot pull, and nothing in our pipeline does that today.

```
FAIL if serp_risk is computed from a single SERP snapshot
FAIL if any SERP-feature boolean is stored without its observation timestamp
WARN that any AIO observation older than ~4 days is likely stale (Semrush: 3.87-day URL half-life)
```

### 7.5a A GEO finding the demand map should have surfaced on day one

The `ashwagandha benefits` AI Overview cites, in its own markdown: **truemed.com, verywellhealth.com, nm.org** (+ `references`: nm.org, truemed.com, verywellhealth.com). The organic top-10 for the identical query: **ods.od.nih.gov (#3), webmd.com (#4), nyp.org (#5), mskcc.org (#6), verywellhealth.com (#7), truemed.com (#9), nm.org (#10), pmc.ncbi.nlm.nih.gov (#11)**.

**Google's AI Overview cited the pages at #7, #9 and #10 — and ignored #3 (NIH) and #4 (WebMD).**

- **AIO citation is not a function of organic rank.** The highest-authority results on the page were not cited; three mid-page results were. Being #1 does not get you quoted.
- **This is a direct, live corroboration of the AEO stage's core finding** ([`research-aeo-geo-first.md`](./research-aeo-geo-first.md) §0, arXiv 2605.25517: content structure had *no* reliable effect on citation) — and a warning that "rank #1 and the AIO follows" is false.
- **It changes our competitive picture.** Rev 2 flagged that WebMD owns the `shilajit` SERP and we are trying to be "the WebMD of Ayurveda". **On `ashwagandha benefits`, WebMD ranks #4 and gets no AI citation at all, while truemed.com — a small commerce blog — is quoted in the answer.** The AI surface is *not* a rank-ordered reprint of the organic one, and it is demonstrably winnable by sites with a fraction of WebMD's authority.
- **This belongs in S6's difficulty picture and the comp-set doctrine, not buried in a keyword doc.** It is the sort of fact a demand map exists to find and ours never did. **Two SERP calls, $0.004.**

*Honest limit: two queries, one market, one day — against a surface we have just proven flickers. This is a lead worth $47.60 of sampling to confirm, not a finding to build an IA on. Filed as **Q13**, not asserted.*

### 7.6 The opportunity score

```
opportunity = cluster_volume_measured        # nulls EXCLUDED, never zeroed
            × intent_fit                     # 0–1, vs audience segment + site register
            × (1 − serp_risk)                # AI Overview / PAA / ad saturation
            × winnability(KD, our authority)
            × confidence                     # V6: high=1.0, medium=0.7, low=0.3
            × commercial_fit                 # "will it sell?" — S-later, carried here
```

Two deliberate design choices:

- **`confidence` is a multiplier, not a footnote.** A number we half-trust must *rank lower*, automatically. Under this rule the old artifact's cluster totals would have scored near zero and could never have reached Abilash as "herbs 2.57M/mo".
- **The score is reported with its inputs visible, never as a bare number.** A single blended figure is exactly the kind of authoritative-sounding artifact that caused this incident.

**The inputs, defined operationally** (GPT-5 flagged these as hand-waved — correctly; a factor nobody can compute is decoration):

| Input | Definition | Source | Status |
|---|---|---|---|
| `cluster_volume_measured` | Σ of `status="measured*"` rows only; `null` **excluded**, never zeroed | V1/V2 | ✅ defined |
| `intent_fit` | `P(main_intent)` from Labs × register-match matrix (informational→1.0 for whatisayurveda; →0.3 for a Shopify PDP; KTAHV clinical register scores commercial queries 0) | Labs `search_intent` + site brief | ✅ defined |
| `serp_risk` | ~~`0.35·ai_overview + …`, each 0/1 from one pull~~ **→ must be `P(feature)` from ≥7-day sampling** | SERP endpoint (§3.0) × time series | 🛑 **DESIGN INVALID (rev 3, §7.5).** Q7 closed — capture works; the *one-shot boolean is unmeasurable* (our own two pulls of one keyword disagree). Blocked on **Q12**, not Q7. |
| `winnability` | `1 − (KD/100)` adjusted by our domain authority vs the top-10's | Labs `keyword_difficulty` + **"our authority" undefined** | ⚠️ **blocked — Q8** |
| `confidence` | V6 cross-endpoint: high=1.0, medium=0.7, low=0.3 | V6 | ✅ defined |
| `commercial_fit` | CPC × competition, normalised per market; carried from the later "will it sell?" step | `google_ads` cpc/competition | ✅ defined (weighting deferred) |

**Precision honesty — and a hard rule that follows from it.** The weights are not empirically derived and I will not pretend otherwise. They are a defensible starting shape (Moz's Priority concept, made explicit); calibration is **Q3**. Two of six inputs are not yet computable at all (`winnability` needs an authority metric we have not chosen — Q8; `serp_risk` needs verified AI-Overview capture — Q7).

> **THEREFORE: `opportunity` is NOT gate-blocking in v1 and MUST NOT be quoted to Abilash as a number until Q3/Q8/Q12 close.** Until then the stage ranks by `cluster_volume_measured × confidence × intent_fit` (all three fully defined and verified) and reports opportunity as *inputs only*. Shipping a blended score whose weights are guesses would be a new version of the same crime: an authoritative-looking number with no evidence under it. A score that isn't ready ships as its components, or not at all.

**Rev 3 — the two undefined factors are REMOVED from the formula, not left in it marked "stub".** GPT-5's audit pushed for a decision rather than a deferral, and on this it is right: **a factor sitting in a printed formula gets computed.** Someone downstream fills the stub with 1.0, or 0.5, or whatever makes the code run, and the guess becomes a number with no one's name on it. **The honest form of "we don't know" is absence, not a placeholder.**

```
v1 RANKING FORMULA — the whole of it, no stubs:

    rank_score = cluster_volume_measured × confidence × intent_fit

  ✗ serp_risk    REMOVED — design invalid (§7.5). Not "uncalibrated": UNMEASURABLE as
                 specified. Returns only when Q12 chooses a sampling strategy and
                 P(feature) is computed from a ≥7-day series.
  ✗ winnability  REMOVED — requires an authority metric we have not bought (Q8).
  ✗ commercial_fit DEFERRED to the "will it sell?" stage, which owns it.

  serp_features and cpc/competition are still CAPTURED and REPORTED per cluster —
  as qualitative notes with observation timestamps. They inform the human reading
  the map. They do not enter a computed score until they are measurable.
```

**This is the §6 V3 logic applied to the score:** report-only-with-a-reason is rigour; a fabricated input is the original sin one level up. **A formula with two invented factors is not 60% right — it is an authoritative-looking number, which is exactly the artifact class this stage exists to stop producing.**

---

## 8 · OUTPUT CONTRACT — what S6 (sitemap) consumes

`docs/<site>-research/keyword-map.json` — the sole handoff. S6 may read **nothing else** from this stage.

```jsonc
{
  "meta": {
    "site": "whatisayurveda.com",
    "generated_at": "2026-07-15T18:40:00+05:30",   // IST, second precision
    "ontology_source": "docs/whatisayurveda-research/ontology.json",
    "audience_dossier": "docs/whatisayurveda-research/audience.md",
    "locales": [
      {"location_code": 2840, "language_code": "en", "register": "english"},
      {"location_code": 2356, "language_code": "en", "register": "english"},
      {"location_code": 2356, "language_code": "hi", "register": "devanagari"},
      {"location_code": 2356, "language_code": "en", "register": "hinglish"}
    ],
    "validation": {
      "script": "scripts/keyword-validate.mjs",
      "verdict": "PASS",                   // S6 MUST refuse to run on FAIL/absent
      "checks": {"V1":"pass","V2":"pass","V3":"report_only","V4":"pass","V5":"pass",
                 "V6":"pass","V7":"pass","V8":"pass","V9":"pass","V10":"pass"},
      "nulls_unresolved": 0,
      "rows_not_returned": 0,              // V9 — requested but never came back; NOT zero
      "flags_ungrounded": 0,
      "set_reconciliation": "requested=1247 returned=1244 not_returned=3 not_queried=0"
    },
    "evidence_dir": "docs/whatisayurveda-research/raw/",
    "total_api_cost_usd": 11.10
  },
  "clusters": [
    {
      "cluster_id": "herb.shilajit",
      "entity": {
        "canonical_id": "API-I-shilajit",
        "preferred_term": "shilajit",
        "sanskrit_term": "शिलाजतु",
        "latin_binomial": null,                       // mineral-pitch drug, not a species
        "synonyms": ["shilajeet", "asphaltum", "mumijo"],
        "source_url": "https://…API-Vol-…pdf",
        "source_type": "ayurvedic_pharmacopoeia_of_india_part_I"
      },
      "parent_topic": "shilajit",
      "cluster_method": "serp_overlap>=3",
      "audience_segment": "us_supplement_researcher",  // ← from S2–S3 dossier
      "intent": {"main": "informational", "probability": 0.93, "secondary": ["commercial"]},
      "demand": [
        {"locale":"US/en","volume":201000,"status":"measured_secondary","source":"labs_keyword_overview",
         "cross_check":{"endpoint":"google_ads_search_volume","volume":null,"status":"no_data"},
         "confidence":"medium","grounded_by":"grounding.json#shilajit-us"},
        {"locale":"IN/en","volume":246000,"status":"measured","source":"google_ads_search_volume",
         "confidence":"high"},
        {"locale":"IN/hi-deva","volume":null,"status":"no_data","resolution":"labs+perplexity",
         "note":"Devanagari null while IN/en=246000 → query artifact, NOT absence of demand"},
        {"locale":"IN/en-hinglish","volume":null,"status":"no_data","note":"shilajit ke fayde → null; re-query pending"}
      ],
      "difficulty": {"kd": 12, "scale": "log_0_100", "source": "labs_keyword_overview"},
      "seasonality": {"peak_to_trough": 1.4, "source": "monthly_searches", "stable": true},
      "serp_features": {"ai_overview": true, "paa": true, "ads": "high", "serp_risk": 0.35},
      "questions": [                                   // ← K5 AEO harvest; answer targets
        {"q": "what is shilajit", "source": "paa", "level": 1},
        {"q": "is shilajit safe", "source": "paa", "level": 2}
      ],
      "target_url": "/herbs/shilajit",                 // ← S6 may REVISE; S4–S5 PROPOSES
      "template": "entity-monograph",
      "opportunity": {"score": 0.71, "inputs": {"volume":201000,"intent_fit":0.95,"serp_risk":0.35,
                                                "winnability":0.88,"confidence":0.7,"commercial_fit":0.6}},
      "priority": 1,
      "provenance": {"request":"raw/req_labs_us_001.json","response":"raw/res_labs_us_001.json",
                     "endpoint":"dataforseo_labs/google/keyword_overview/live",
                     "timestamp":"2026-07-15T18:12:04+05:30","cost_usd":0.0126}
    }
  ]
}
```

**Contract rules (binding on S6):**
1. **S6 must refuse to run** unless `meta.validation.verdict == "PASS"` — doctrine (g): a failing gate is never fixed by weakening it.
2. **`target_url` is a proposal, not a decision.** S4–S5 knows demand; S6 owns architecture, and the PROTECTION MAP (legacy KEEP/MERGE/301, Build Decision Matrix §2) can override any proposed URL. Naming it `target_url` here would let a keyword stage silently overrule a redirect obligation.
3. **`volume: null` is a legal, expected value.** Any consumer that treats it as 0 is a bug. Ranking must use `status == "measured*"` rows only.
4. **Every cluster carries `audience_segment`** — the structural proof that keywords descended from the audience (Abilash's order: 2–3 → 4–5) rather than from the agent's imagination.
5. **No row without `provenance`.**
6. **A keyword that was requested and never returned MUST appear as a row with `status: "not_returned"`** (V9). **An absent row is not a zero and not a "no".** `meta.validation.set_reconciliation` must balance: `requested == returned + not_returned + not_queried`. **S6 refuses if it does not balance** — an unbalanced ledger means the map is silently incomplete and nobody can tell which rows are missing.
7. **Every `demand[]` row's `volume` was key-joined from its own response item** (V10), never taken by position. **A consumer may not assume the order of anything in this file.**
8. **`serp_features` is qualitative and timestamped, not scored.** It carries `observed_at` and does **not** feed `rank_score` (§7.6). **A consumer that computes with it is using an invalid measurement** (§7.5, Q12). The example row's `serp_risk: 0.35` in this contract is **illustrative of the shape only and must not be computed in v1**.

---

## 9 · THE GATE — S4–S5 exit, machine evidence only

Doctrine (f): *"Doctrine written in a .md file is ZERO evidence the rule was executed."* Every exit condition below is a command with an exit code.

| # | Exit condition | Machine evidence |
|---|---|---|
| G1 | Audience dossier exists, non-empty verbatim section | `test -s docs/<site>-research/audience.md` |
| G2 | Ontology 100% sourced | `keyword-validate --check ontology` → count, 0 unsourced |
| G3 | Every seed traceable to ontology or audience | `seed-lint` exit 0 |
| G4 | **Zero banned seeds — Rules A (synonym), B (parent-constituent), C (provenance)** (§4.2) | `seed-lint --compound` exit 0 |
| G5 | Locale matrix complete; **India = en + Devanagari + Hinglish** | `keyword-validate --check locales` exit 0 — **HARD-BLOCK** (a locale either was queried or wasn't; no judgement, no unratified input) |
| G5a | Hinglish **pattern coverage** (§5.1a) | `keyword-validate --check hinglish` — **REPORT-ONLY until Q9 closes.** *Rev 3, conceding GPT-5's finding:* rev 2 hard-blocked G5 on a pattern list that Q9 admits is **unratified by any Hindi speaker**. That is the same defect as V3's invented floors, which the doc already ships report-only for exactly this reason (§6 V3). **Blocking on an unratified list is not rigour — it enforces our guess.** The locale-coverage half (G5) stays hard-blocking; only the pattern half waits. |
| G6 | **V1: no null→0 coercion; no aggregate over non-measured** | `keyword-validate --check V1` exit 0 |
| G7 | **V2: zero unresolved nulls** | `nulls_unresolved == 0` |
| G8 | **V3: no high-prior entity below floor** | `keyword-validate --check V3` exit 0 |
| G9 | **V4/V5: every flag has ≥2-citation Perplexity grounding** | `flags_ungrounded == 0` |
| G10 | **V6: priority set cross-checked on both endpoints** | coverage report = 100% |
| G11 | **V7: every number has full provenance** | `keyword-validate --check V7` exit 0 |
| G12 | Raw responses committed byte-for-byte, costs recorded | `ls raw/` + cost ledger reconciles to sum |
| G13 | `keyword-map.json` schema-valid | `ajv validate` exit 0 |
| G14 | **GPT-5 audit PASS** — rubric = the **DON'T column of §4.0**, read as a checklist | `node scripts/audit-gpt.mjs --step "S4–S5 · Keyword & demand" --artifact …/keyword-map.json` exit 0 |
| G15 | Open questions filed | QUESTIONS.md entries, IST second-precision |
| **G16** | **V9: request/response sets reconcile; no defaulting accessor in the capture path** (rev 3) | **RUNTIME (authoritative):** `keyword-validate --check V9` exit 0 — reconciles `set(request)` vs `set(response)` on the committed raw pairs, and asserts `|requested| == |returned| + |not_returned|`. **STATIC (advisory only):** `grep -nE '\.get\([^,]+, *0\)|\?\? *0|COALESCE\([^,]+,0\)'` over the demand path |
| **G17** | **V10: no positional join; every volume key-joined from the response item** (rev 3) | **RUNTIME (authoritative):** `keyword-validate --check V10` exit 0 — asserts every emitted row's keyword was read from `item.keyword` and round-trips into the request set. **Canary:** re-run the `res_12` fixture through the capture path and assert `ashwagandha benefits → 33,100`, **not** `abhyanga massage`'s volume. **STATIC (advisory only):** `grep -nE 'zip\((seeds|keywords)|items\[i\]'` |

**⚠️ A grep is not a gate (rev 3 — GPT-5's finding, conceded).** The audit flagged that static greps *"will [not] reliably catch all defaulting/misjoin paths; dynamic validation is required too."* **Correct, and the point is sharp enough to state as doctrine:** `grep '\.get([^,]*, *0)'` misses `d.get(k, default)` where `default` is a variable, misses `dict.setdefault`, misses `pandas.reindex(fill_value=0)`, misses `df.fillna(0)`, misses a positional join laundered through a DataFrame, and misses any of it written in a language nobody thought to grep. **A grep proves the presence of a mistake, never its absence** — which is the same asymmetry as V5 and as `null`, appearing for the third time in this document. **Therefore G16/G17's authoritative check is the runtime assertion over the committed request/response pairs; the greps are a cheap advisory tripwire and must never be the thing that passes the gate.**

**G14 is non-negotiable and load-bearing: GPT-5 is the only thing that caught this failure.** It caught it by knowing Ayurveda well enough to disbelieve "shilajit = 0" — no schema check would have. V1–V7 exist to make the machine catch it *before* the auditor has to; G14 remains the backstop for the class of error we haven't imagined yet. Keep both.

**Regression test — this stage must catch its own history.** `keyword-validate` ships with a fixture built from the real failure: `demand-raw.json`'s `{"shilajit": 0}` plus the eight self-juxtaposition seeds plus en-only India.

```
EXPECT: V1 FAIL (null→0 coercion; lossy "raw" schema)
        G4 FAIL — Rule A × 7 (tulsi holy basil, amla amalaki, giloy guduchi,
                              fenugreek methi, boswellia shallaki,
                              yashtimadhu licorice, kapikacchu mucuna)
               — Rule B × 1 (turmeric curcumin)      ← the one Rule A missed
               — Rule C × 8 (none have provenance)
        G5 FAIL (India en-only; Devanagari + Hinglish patterns absent)
        V3 FAIL (shilajit/shatavari/gokshura below floor)
        V4 FLAG (ojas 1.5M, LOW competition, KD 0)

rev 3 — fixtures from LIVE responses, not hand-written (evidence §12):
        V9 FAIL  · res_13_labs_bogus_drop.json — 3 requested, 2 returned, status "Ok."
                   the validator must emit {"zzqx…": status:"not_returned"} and REFUSE to
                   aggregate. If it reports 2 rows and a clean sum, V9 is not implemented.
        V9 FAIL  · synthetic: null-in-google_ads + absent-in-Labs → V2's remedy must not
                   silently yield absence. This is the cure re-creating the disease (§0.1).
        V10 FAIL · res_12_labs_batch56.json — response is ALPHABETIZED; a positional join
                   maps "ashwagandha benefits" → abhyanga massage's volume.
                   ⚠️ This fixture FAILS SILENTLY under a naive validator: every row is
                   well-formed, non-null, plausible. The test asserts the JOIN, not the values.
        V1 PASS  · res_14_google_ads_bogus_null.json — 3 requested, 3 returned, 2 null.
                   The NEGATIVE control: proves V1 sees rows google_ads returns, and proves
                   the drop in res_13 is an endpoint contract difference, not a fluke.
```
**`turmeric curcumin` is an explicit, separately-asserted fixture case** — because Rule A alone passed it, and a regression suite that only tests the rule you remembered to write is not a regression suite.

**The rev-3 fixtures are real API responses, committed.** They are not mock JSON expressing what we believe the API does — they are what it *did*, on 2026-07-15, with the cost recorded. **A fixture we wrote ourselves would encode our assumptions, and our assumptions are the thing under test.** The `res_14` negative control matters as much as the failures: without it, a validator could pass V9 by rejecting *every* response with fewer rows than requested, including the ones that are correct.

**If the validator ever passes that fixture, the validator is broken.** The failure is now a test, not a memory — which is the only form in which a lesson survives an agent restart.

---

## 10 · FIXING IT EVERYWHERE IN THE REPO

Abilash: *"FIX IT EVERYWHERE IN THE REPO — be it the landing page repo, the Shopify repo, the organic page repo, everywhere."* The stage is universal; the **shape** differs per track. What never differs: V1–V7, the compound ban, the locale matrix, the evidence contract.

### Track A — organic content sites (whatisayurveda, kairali.com, kairalicenters)
Full stage, all K0–K9. Ontology is the backbone (API/AYUSH). Cluster-level prioritisation (§7.1). **whatisayurveda's demand map must be re-run from K0** — it is quarantined and cannot be repaired, because its `raw` file lost the data needed to repair it. ~$11, one afternoon.

### Track B — Shopify (agent READ-ONLY in admin — doctrine (k))
Same K0–K9 with three deltas:
- Ontology = **the live product catalog**, not the pharmacopoeia (doctrine (j): live admin overrides docs).
- Intent skews commercial/transactional — `intent_fit` weights invert vs Track A. High-volume informational terms are usually *not* PDP targets.
- **`target_url` proposals touching existing PDPs are advisory only, and any PDP URL change is flagged to Vikash BEFORE it happens (doctrine (m) — live ads point at them).** A keyword stage must never silently propose a PDP slug change.
- Feeds `scripts/shopify-catalog-lint.mjs` (Monday ritual, doctrine (l)).

### Track C — landing pages (/lp/<campaign>, noindex)
The stage is **not skipped, it is inverted**. LPs are noindex, so organic volume is irrelevant — but **CPC, competition and commercial intent are the whole point**, and they come from the same endpoints. Run K0–K3 + K6–K8 with `commercial_fit` and CPC dominant, `opportunity` scored on paid economics. Skip K5 (AEO) — no organic surface. Skip K9's `target_url` (single CTA, fixed URL). *This is the reason the CPC gap we found (curcumin $2.48 vs turmeric $0.86) is a Track-C asset, not trivia.*

### Retroactive — AEO/GEO is a universal check on built sites too
Standing ruling: AEO + GEO apply to **every site, already-built and future** (DECISIONS, 15 Jul 2026). Already-shipped sites (kairali.com, kairalicenters.com, whatisayurveda v1) get **K5 + K7 retroactively**: harvest questions, validate any demand number ever quoted, quarantine anything failing V1–V7. **Any site whose IA was built on un-validated numbers must have that fact recorded in its `launches/<domain>/` evidence** rather than quietly corrected — the launch record is permanent, auditable history.

### Files to change (proposed — this stage does not edit outside docs/process/)
| Path | Change |
|---|---|
| `docs/process/MASTER_PIPELINE.md` | Insert S4–S5 with K0–K9; wire G1–G15 |
| `scripts/keyword-validate.mjs` | **NEW** — **V1–V10**, exit 2 on FAIL. Ships with the §9 fixtures built from **real committed responses** (`res_12`/`res_13`/`res_14`) |
| `scripts/seed-lint.mjs` | **NEW** — §4.2 Rules A/B/C |
| `scripts/dfs.sh` | Wrapper writing raw req+res+cost to `raw/` automatically **and reconciling the request set against the response set on every call (V9)** — make the right thing the default, at the only layer that sees both |
| `scripts/perplexity-ground.mjs` | **NEW** — sonar-pro, ≥2 citations, injection-screened |
| `docs/checklists/` | Sitewide checklist: S4–S5 gate row |
| `CLAUDE.md` | Doctrine: **"null is not zero; an absent row is not zero; a response is not in the order you asked; a `raw` file is the API's bytes"** |
| `docs/process/research-aeo-geo-first.md` | Cross-link §7.5a (AIO cites #7/#9/#10, ignores NIH #3 and WebMD #4) as live corroboration of its arXiv finding; and §7.5 volatility as a constraint on any AEO measurement |
| `docs/process/research-sitemap-ia.md` | S6 must refuse on non-PASS (§8 contract rule 1) and must treat `volume: null` as legal (rule 3) |
| `docs/whatisayurveda-research/demand.md` | Stays quarantined until a K0 re-run replaces it |

---

## 11 · OPEN QUESTIONS → QUESTIONS.md (blocking)

- **Q1 — High-prior floors (blocks V3).** Who sets the market-specific floor per entity, and from what source? A floor pulled from the agent's intuition rebuilds the original sin one level up. *Proposal: floor = 10% of the cross-checked measured value at first successful validated pull, then frozen and version-controlled.* **Needs Abilash/Dr. Deepu John input on the entity list itself.**
- **Q2 — Which source wins on cross-endpoint conflict?** Live: Labs 201,000 vs Google Ads `null` for shilajit US. I default to *Labs when Google Ads is null* (Google's coverage hole is documented) but I have **no evidence for which wins on a >2× numeric disagreement**. Currently: `confidence=low` + grounding. Needs a calibration pull against GSC data on a site we own.
- **Q3 — Opportunity-score weights are uncalibrated (§7.6).** Defensible shape, invented weights. Calibrate against actual ranking outcomes on the first shipped cluster before the score is quoted to anyone as a number.
- **Q4 — Reddit practitioner layer is missing. ESCALATED in rev 3 from "gap" to "method gap".** `reddit.com` **and** `old.reddit.com` are both blocked to this agent (re-verified rev 3: `400 … not accessible to our user agent`; `unable to fetch`). This is no longer only Abilash's request going unmet: **Ahrefs' published seed method lists "review communities and forums — Reddit, Quora" as one of seven legitimate seed sources (§2.3a), and we have banned the head-brainstorm precisely because provenance is the only defence.** We removed method #1 and cannot reach method #4. For an encyclopedia whose audience argues in forums, K2's supply is genuinely thin. Options: human paste of key threads, an alternate fetch path (Pushshift-style mirror, an MCP with a different UA), or a documented ruling that named-authority + live-API evidence substitutes. **Decision needed — and K2 should declare its verbatim layer partial until it lands.**
- ~~**Q5 — Devanagari/Hinglish nulls.**~~ **CLOSED, rev 3 (§5.3).** Google Ads coverage hole, not query behaviour: Labs returns `शिलाजीत` 9,900 · `शतावरी` 5,400 · `shilajit ke fayde` **27,100** where google_ads returned `null`; the two agree exactly where both have data. **Gate consequence: for IN/hi and IN/en-Hinglish, Labs is PRIMARY and google_ads is the cross-check** — inverted from the US default. Hinglish > Devanagari now confirmed on a second entity at **2.7×**. *(Q9 — native-speaker ratification of the pattern list — remains open and is more urgent given the romanized register carries the majority of demand.)*
- ~~**Q6 — Batch limits unverified.**~~ **CLOSED, rev 3.** Labs `keyword_overview` accepted a **56-keyword** batch, `status: "Ok."`, cost **$0.01872** = `0.012 + 56×0.00012` **exactly** — pricing confirmed **per returned item**, so a silent drop makes the call *cheaper* (§6 V9). The documented 1,000/task ceiling is still untested at the limit; §3.2's ~$11 budget math is unchanged in shape and remains an estimate at the top end. **Not blocking.**
- ~~**Q7 — AI-Overview capture unverified.**~~ **CLOSED, rev 3 (§7.5) — and its premise REFUTED.** Capture was never broken: AIO arrives in the standard $0.002 response with **no flag**; `load_async_ai_overview` changed nothing and cost nothing. Rev 2's "no AIO on shilajit" was a **true observation of a surface that flickers** — the same query, same params, flag off, returned an AIO hours later. **This does not unblock `serp_risk`; it re-blocks it harder → Q12.**
- **Q12 — `serp_risk` is a design fault, not a calibration gap (rev 3, BLOCKING; supersedes Q7).** SERP features are **probabilities over time**, not booleans from one pull — our own two pulls of one keyword disagree, and Semrush measures a **3.87-day** desktop URL half-life inside AIOs with **91%** of URLs removed at some point and **96%** of keywords seeing a domain change. **Decision needed:** do we (a) stand up a ≥7-day SERP sampling cron (**$47.60** for 3,400 entities × 7 daily pulls at $0.002 — cheap, but it is infrastructure we do not have), (b) buy a longitudinal AIO-tracking source, or (c) drop `serp_risk` from the score and treat SERP features as qualitative notes? **Until this closes, `serp_risk` is not computable and `opportunity` stays non-blocking** (with Q3/Q8).
- **Q14 — The fact-grounding auditor produced a false fabrication accusation (rev 3, §12.2). BLOCKING on V5's design, not on the stage.** `audit-perplexity.mjs` asserted that four Semrush statistics were *"drawn from private dashboards or internal communications"* and were *"misrepresentation"* — while citing, as its own source, the public page on which all four appear verbatim. A `curl | grep` disproved it in one command. **V5 is amended (§6 V5) so a negative Perplexity verdict is a `null`, never a `0`.** Open: (a) does this reproduce, and at what rate? — a non-finding rate is the single number that decides how much V5 is worth; (b) **should `audit-perplexity.mjs` itself be changed to REQUIRE a raw-fetch citation before it may emit a "fabricated"/"unverifiable" verdict** — the fix belongs in the script, not only in this doc's prose (`scripts/` is outside this task's scope → hand-off); (c) rev 2's justification for `sonar-pro` (**SimpleQA F 0.858 vs 0.773**) is **unverified** — the Perplexity blog returns **HTTP 403** to a raw fetch and Perplexity could not source its own benchmark. **Do not quote that figure to Abilash.** Needs a decision on which model, on evidence we can actually open.
- **Q13 — AIO citation ≠ organic rank: a lead, not a finding (rev 3).** On `ashwagandha benefits`, Google's AIO cited **#7, #9, #10** and ignored **NIH (#3) and WebMD (#4)**; a small commerce blog (truemed.com) was quoted while WebMD was not (§7.5a). If it generalises, it reshapes our competitive thesis — the AI surface may be winnable at authority levels far below WebMD's. **It is two queries, one market, one day, against a surface we have just proven unstable.** Confirming costs the same $47.60 sampling job as Q12 and should ride with it. **Do not let this reach a strategy deck as a fact before then** — a plausible, convenient, under-sampled number is exactly this stage's cautionary tale.
- **Q8 — "Our authority" is undefined (blocks `winnability`).** The score needs our domain strength vs the top-10's. We have no chosen metric (Ahrefs DR? Moz DA? own GSC?) and no subscription confirmed for one. **Needs Abilash: which authority source do we buy/use?** Until answered, `winnability` is a stub and opportunity stays non-blocking.
- **Q9 — Hinglish pattern list needs a native-speaker ratification (§5.1a).** The list is drafted from published sources, not from our audience dossier. It must be validated by a Hindi speaker against real Kairali customer language before it gates anything. Overlaps Q5.
- **Q10 — SERP-overlap thresholds are uncalibrated (§7.1).** ≥3/≥7 shared URLs traces to agency blogs, not a primary study. Calibrate against ~50 known pairs (turmeric/curcumin must split; amla/amalaki must merge) before clustering is anything but advisory.
- **Q11 — Where does "3,400 pages" come from?** The brief treats it as given, but API Part I has **621** single drugs / 393 species. 3,400 is not derived from any ontology we hold. **If the page count was chosen before the entity list existed, that is the same error as choosing keywords before the audience — a target invented, then rationalised.** S6 must derive page count *from* the ontology × template matrix, and reconcile it with 3,400 or replace it. **Needs Abilash.**

---

## 12 · EVIDENCE INDEX

**Live API calls — 2026-07-15, reproducible. Raw responses COMMITTED byte-for-byte to `docs/process/evidence/keyword-rigor-2026-07-15/`.** Cost ledger **computed from the committed files, never typed**: **$0.51616 total** across **14 calls** (rev 2: 6 · rev 3: +8).

```
$ python3 -c "import json,glob; print(sum(json.load(open(f))['cost'] for f in glob.glob('docs/process/evidence/keyword-rigor-2026-07-15/res_*.json')))"
0.51616
```

*(Rev 1 of this document stated $0.2826 in the header while its own ledger said $0.2846 — a two-cent contradiction inside a document about numerical integrity. The audit caught it; it is now computed from the committed files by script rather than typed by hand, which is the only durable fix. Small, but exactly the genre of error at issue.)*

*Practising §7 on this document rather than only prescribing it — GPT-5's audit correctly noted that a spec citing live numbers with the responses left in a scratchpad is the very failure it legislates against. They are now in-repo and auditable. (Placed under `docs/process/evidence/` because this task's scope is `docs/process/` only; a real stage run writes to `docs/<site>-research/raw/` per §7.)*

| # | File | Endpoint | Params | Cost | Key result |
|---|---|---|---|---|---|
| 1 | `res_01_google_ads_us_en.json` | `keywords_data/google_ads/search_volume/live` | US 2840, en, 14 kw | $0.09 | turmeric 301,000 vs "turmeric curcumin" 27,100 (**11.1×** understatement confirmed); shilajit/shatavari/gokshura = **`null` not 0**; curcumin 60,500 @ cpc 2.48 vs turmeric @ 0.86 |
| 2 | `res_02_google_ads_in_en.json` | `keywords_data/google_ads/search_volume/live` | IN 2356, en, 8 kw | $0.09 | shilajit **246,000**, shatavari 90,500, gokshura 27,100 — all `null` in US; **ojas 1,500,000 comp=LOW** (contamination) |
| 3 | `res_03_google_ads_in_hi.json` | `keywords_data/google_ads/search_volume/live` | IN 2356, hi, 10 kw | $0.09 | `ashwagandha ke fayde` **33,100 > अश्वगंधा 22,200**; `शिलाजीत` **null** while IN/en shilajit = 246,000 |
| 4 | `res_04_labs_keyword_overview_us_en.json` | `dataforseo_labs/google/keyword_overview/live` | US 2840, en, 5 kw | $0.0126 | **shilajit 201,000, KD 12, informational** where google_ads = `null`; turmeric 301,000 both (agreement); ojas KD **0** |
| 5 | `res_05_serp_organic_shilajit_us.json` | `serp/google/organic/live/advanced` | US 2840, en, depth 10 | $0.002 | PAA + organic URLs + featured_snippet verified (§3.0); **WebMD ranks #1 for shilajit US**; no `ai_overview` item (→ Q7) |
| 6 | `res_06_google_ads_in_en_hinglish.json` | `keywords_data/google_ads/search_volume/live` | IN 2356, **en**, 4 kw | $0.09 | **`language_code` does not change volume** — `ashwagandha ke fayde` = 33,100 under both en and hi → refuted my own rev-1 claim (§5.1a) |
| **7** | `res_07_serp_aio_ashwagandha_flagon.json` | `serp/google/organic/live/advanced` | US, `ashwagandha benefits`, **flag ON** | $0.002 | `ai_overview` PRESENT, `asynchronous_ai_overview:false`; **flag adds no cost**; AIO cites truemed/verywellhealth/nm.org (§7.5a) |
| **8** | `res_08_serp_aio_ashwagandha_flagoff.json` | `serp/google/organic/live/advanced` | US, same kw, **flag OFF** | $0.002 | **AIO present WITHOUT the flag** → Q7's premise refuted; the control that made #7 interpretable |
| **9** | `res_09_serp_shilajit_flagon.json` | `serp/google/organic/live/advanced` | US, `shilajit`, flag ON | $0.002 | AIO present — where rev 2 (call #5) found none |
| **10** | `res_10_serp_shilajit_flagoff.json` | `serp/google/organic/live/advanced` | US, `shilajit`, **flag OFF** | $0.002 | **AIO present, flag off** → isolates flag from time: **the SERP moved, capture never broke.** `organic` 8→7 between pulls (§7.5) |
| **11** | `res_11_labs_in_hi_devanagari.json` | `dataforseo_labs/google/keyword_overview/live` | IN 2356, hi, 5 kw | $0.0126 | **Q5 CLOSED**: `शिलाजीत` **9,900**, `शतावरी` **5,400**, `shilajit ke fayde` **27,100** — all `null` in google_ads; exact agreement where both have data (§5.3) |
| **12** | `res_12_labs_batch56.json` (+ `req_12_…_payload.json`) | `dataforseo_labs/google/keyword_overview/live` | US, **56 kw** | $0.01872 | **Q6 CLOSED**: cost = `0.012 + 56×0.00012` exactly. **V10**: `returned == sorted(returned)` → **True** — response is ALPHABETIZED, request order discarded |
| **13** | `res_13_labs_bogus_drop.json` | `dataforseo_labs/google/keyword_overview/live` | US, 3 kw incl. 1 nonsense | $0.01224 | **V9**: 3 requested → **2 returned**, `status:"Ok."`, **no error**. Nonsense keyword vanished. Billed for 2 → **silence is cheaper** |
| **14** | `res_14_google_ads_bogus_null.json` | `keywords_data/google_ads/search_volume/live` | US, **same 3 kw** | $0.09 | **The negative control + the asymmetry**: 3 requested → **3 returned**, request order preserved, `zzqx…`=`null` **identical to `shilajit`=`null`** → a bare `null` cannot distinguish a 201k head term from gibberish (§0.1 Path 4) |

### 12.1 · A near-miss by the author of rev 3 — recorded because it is the same disease

**While testing V9 I nearly shipped a fabricated finding into the document about fabricated findings.**

My batch script built a keyword list, sliced it `kws[:60]`, and printed:

```python
print('items_returned:', len(items), 'of 60 requested')     # ← "60" HARDCODED
→  items_returned: 56 of 60 requested
```

I read that and wrote, in my working notes, that **"4 keywords silently vanished — a major finding."** It was false. **The list only ever contained 56 keywords**; the slice was a no-op and the `60` was a literal I typed into a format string. The API returned everything it was asked for. I caught it only because I went looking for *which* four vanished — and found none.

**Anatomy, because it is worth more than the apology:**

| the real failure (Jul 2026) | my near-miss (today) |
|---|---|
| `null` coerced to `0` in our own capture layer | `len(req)` replaced by a typed `60` in my own print |
| the artifact *looked* clean and summed cleanly | the output *looked* like a finding and read cleanly |
| plausible → reported to the Director as fact | plausible → nearly written into the spec as a verified V9 case |
| caught by an external auditor reasoning about Ayurveda | caught by asking the follow-up question ("*which* four?") |

**The mechanism is identical: a number I generated, describing my own process, that I did not verify against its source before believing it.** Not an API bug — a *reporting-layer* bug, which is exactly what `demand-raw.json` was. **The document's own rules caught it: V7 (every number names its source) and the §4.0 DON'T "don't report a number without its provenance."** Applied to my own scratch output, they worked.

**And the finding survived — that is the point, not a consolation.** V9 is real, evidenced by `res_13` (3 requested, 2 returned, `status: "Ok."`). But the version I nearly shipped was *right for a reason I invented*. **A true conclusion reached through a fabricated observation is not a finding; it is luck**, and it fails the moment someone checks the number instead of the conclusion.

> **Two rules follow, and they cost nothing:**
> 1. **Never hardcode a count, a total, or a label into an output line — derive it** (`len(req)`, not `60`). Every literal in a print statement is an unverified assertion wearing the costume of an observation.
> 2. **When a finding is exciting, that is the cue to verify it harder, not to write it up.** "4 keywords silently vanished" was *more* interesting than the truth, which is precisely why it got past me for several minutes. **Convenience to my argument is evidence of nothing except my motive to believe it.**

*This section exists because the alternative — quietly fixing the script and presenting V9 as a clean discovery — would have made this document another artifact whose evidence layer hides its own defects. That is the failure this stage exists to prevent, and it does not stop applying to the person writing the stage.*

### 12.2 · THE FACT-GROUNDING AUDITOR ACCUSED ME OF FABRICATION — AND WAS ITSELF FABRICATING

**This is the single most important finding in rev 3, and it lands on V5 — the check that makes Perplexity mandatory.**

I ran `audit-perplexity.mjs` over the external claims, stripped of my reasoning per the script's own contamination rule. It returned, under a heading reading **⚠ FABRICATED / MISREPRESENTED SOURCES**:

> *"Semrush AI Overviews volatility study figures in claims 1–4 appear to be drawn from **private dashboards or internal communications** rather than the public article; presenting them as if they are directly supported by Semrush's published blog is **misrepresentation**."*
> *"…the public article does not expose the sample sizes, inclusion criteria, or exact percentages/durations."*

It listed `https://www.semrush.com/blog/url-volatility-ai-overviews/` **as its own source [1]** while saying the figures are not in it.

**I did not argue with it. I fetched the page and grepped the bytes:**

```
$ curl -s -A "Mozilla/5.0 …" https://www.semrush.com/blog/url-volatility-ai-overviews/ -o semrush_raw.html
HTTP 200 · 176210 bytes
   3.87  : 3 hits    91%   : 8 hits    1,500 : 10 hits
   3.33  : 5 hits    43%   : 8 hits    96%   : 6 hits

"Google keeps the same URL within them an average of just 3.87 consecutive days on desktop and 3.33 days on mobile."
"96% of AI Overviews saw a domain change · 91% of URLs studied were removed from the AIOs at some point
 · Just 43% of removed URLs returned to the AIO later in the month"
"Methodology: We studied a sample of 1,500 keywords from a US mobile database and 1,500 keywords from a US desktop database."
```

**Every disputed figure is verbatim, in plain text, on the public page the auditor cited.** The auditor did not fail to verify — **it asserted a specific false mechanism** ("private dashboards or internal communications") for a fabrication that never happened, in the register of a fraud finding.

**Read the structure of that failure, because we have seen it before:** *a confident, fluent, well-formed, plausible claim, with an invented causal story, that nobody checked against the source.* **That is our own July failure exactly** — and it arrived from the tool we appointed to prevent it. **The fact-grounding auditor hallucinated an absence.**

#### The rule this forces — and it is the document's own central rule, turned on its own auditor

> **"Perplexity could not find it" is a `null`, not a `0`.**

The isomorphism is exact and it is not a rhetorical flourish. `google_ads` returns `null` for a 201,000/month head term *and* for gibberish (§0.1 Path 4) — the `null` describes **the coverage of the source**, not the world. A search-grounded auditor returning UNVERIFIABLE/CONTRADICTED is making a statement about **what its retrieval surfaced**, not about what is true. **Coercing that to "the claim is false" is the same category error as coercing `null` to `0`** — and V5, as rev 2 wrote it, does exactly that: it lets Perplexity's silence block a number.

**V5 is therefore amended (rev 3) — the auditor's verdicts are asymmetric:**

```
Perplexity returns a CITATION that supports/contradicts a claim
    → EVIDENCE. Attach it. It found something; something exists.

Perplexity returns UNVERIFIABLE / "not in the source" / "fabricated"
    → A NULL. It is a statement about retrieval, NOT about the world.
    → NEVER blocking on its own. NEVER recorded as "claim is false".
    → MUST escalate to a raw fetch of the primary (curl + grep the bytes)
      before any verdict is written.
FAIL if any artifact records a Perplexity non-finding as a fact about the world.
FAIL if a "fabrication" verdict is filed without a raw-bytes check of the cited primary.
```

**And the operational rule that saved this document, generalised:** *when an auditor says a source does not say X, fetch the source and grep for X.* It cost one `curl`. Had I deferred to the auditor — the reflex its authority invites — I would have **deleted four true, correctly-cited, load-bearing statistics** from the one section that establishes why `serp_risk` cannot be a boolean, and I would have recorded a false confession of fabrication in a document whose subject is fabrication.

#### Both auditors are now on the record failing, in opposite directions — and neither is dispensable

| | GPT-5 (`audit-gpt.mjs`) | Perplexity (`audit-perplexity.mjs`) |
|---|---|---|
| **Its win** | Caught the original incident (invented seeds, implausible zeros) by *reasoning about Ayurveda*. Caught Rule A not catching `turmeric curcumin` (§4.2). Caught my rev-1 self-contradiction. | Real catches here: Palakodety 52/46/1 **is** unsourceable (agreeing with my own hedge); Authoritas 70% unverifiable; "Hinglish is the dominant form of Hindi online" **is** overstated for a Wikipedia-sourced claim; "rounded annual averages" overstates Google's wording. |
| **Its failure** | Cannot check a fact. Could only *suspect* shilajit ≠ 0. | **Asserted fabrication about text on the page it cited.** Invented a mechanism for the fabrication. |
| **Its `null`** | "This looks wrong" | "I could not retrieve it" |
| **What it must never do** | Be trusted as a fact-checker | **Be trusted as proof of absence** |

**The conclusion is not "drop Perplexity" — it is that we now have machine evidence for the division of labour `audit-perplexity.mjs`'s own header asserts.** Its real catches above are *exactly* the ones where retrieval succeeded and found *something*. Its catastrophic catch is the one where retrieval found *nothing* and it filled the gap with confident prose. **The tool is sound in the positive direction and unsound in the negative direction, and the amended V5 encodes precisely that.**

> **The recursion is the lesson, and it is worth more than the four statistics it saved.** This document argues that no stage may grade its own homework (§4.2). Rev 3 demonstrates the sharper form: **no auditor may be trusted unaudited either.** The escalation does not terminate in a smarter model — **it terminates in bytes.** `curl | grep` has no opinion, no fluency, and no incentive to sound authoritative. **That is why V7 (provenance) and §7's byte-for-byte capture are the foundation of this stage and every model in it is a convenience layered on top.**

#### Two corrections to the document that came out of this exchange, and one claim downgraded

1. **§2.1 stands, verbatim-verified.** Google Ads Help, fetched raw: *"**Average monthly searches** ('Avg. monthly searches'): The average number of times people have searched for **a keyword and its close variants** based on the month range as well as the location and Search Network settings you selected."* — The unit is a keyword *group*. Confirmed from the bytes, not from a model. *(Nuance Perplexity was right about: the range is **user-selected** and defaults to 12 months — so "annual average" is a default, not a definition. §2.2 attributes that phrasing to Soulo, which is correct; but it is Soulo's characterisation, not Google's wording.)*
2. **§5.3's Hinglish corroboration is downgraded further and it doesn't matter.** "Romanised Hindi is the dominant form of Hindi online" is a Wikipedia-sourced overstatement; Perplexity is right that no cross-platform authority establishes it. **Struck as support.** Our own measurements (33,100 > 22,200; 27,100 > 9,900) are about our entities in our market and remain the sole basis for the Hinglish rule — which is how it should have been written in the first place.
3. **The Sonar Pro benchmark claim is DOWNGRADED to unverified.** Rev 2 justified `sonar-pro` for V5 with *"Sonar Pro leads SimpleQA at F 0.858 vs Sonar 0.773."* **I could not verify it: `https://www.perplexity.ai/hub/blog/introducing-the-sonar-pro-api` returns HTTP 403 to a raw fetch, and Perplexity itself could not source its own benchmark.** The figure is **[R] REPORTED, unverified** and must not be quoted to Abilash as fact. *A benchmark we cannot open is a weak reason to prefer a model — and given §12.2's finding, the model choice is a second-order question anyway: **the direction of the verdict matters more than the model producing it**.* → **Q14**.

**Derived analyses (reproducible from the committed files):**
- **Bucket ladder (V8):** 160+ keywords → **47 distinct values**, median consecutive ratio **1.224**. Confirms Soulo's "volume buckets" against our own data; establishes ~±11% quantization and kills the "duplicate volume ⇒ grouping" rule (§6 V8).
- **Collision census:** the failed artifact's 80 US keywords share 16 volume values (`moringa` = `ashwagandha benefits` = 201,000; `neem` = `bacopa monnieri` = `gotu kola` = 22,200) — pigeonhole on a 47-value ladder, **not** evidence of grouping.

**Reproduce:**
```bash
./scripts/dfs.sh keywords_data/google_ads/search_volume/live \
  '[{"location_code":2840,"language_code":"en","keywords":["turmeric","curcumin","turmeric curcumin","shilajit"]}]'
./scripts/dfs.sh dataforseo_labs/google/keyword_overview/live \
  '[{"location_code":2840,"language_code":"en","keywords":["shilajit"]}]'
./scripts/dfs.sh serp/google/organic/live/advanced \
  '[{"language_code":"en","location_code":2840,"keyword":"shilajit","depth":10}]'
```

**Audit trail of this document (G14 applied to itself):**

**Pass 1 — `audit-gpt.mjs` → PASS** (quality: strong; expert-would-respect: true; AI-filler: low), with 7 missed steps + 3 hallucination risks. Six were valid and fixed in rev 2: the compound-ban parent/constituent hole (§4.2 Rule B), the SparkToro misattribution (§2.2), missing K5/clustering/serp_risk instrumentation (§3.0), Hinglish enforceability (§5.1a), undefined `intent_fit`/`winnability` (§7.6), uncommitted raw evidence (this section). Two became Q7/Q8.

**Pass 2 — `audit-gpt.mjs` on rev 2 → FAIL.** Triaged rather than obeyed:
- **Valid, fixed:** Hinglish self-contradiction (my own call #3 refuted my rule → tested it, rule corrected, §5.1a); cost ledger $0.2826↔$0.2846 (now script-computed); SERP thresholds asserted as consensus without primary source (→ Q10); V3 undefined day-one behaviour (→ report-only table, §6); "3,400 pages" underived (→ Q11).
- **Rejected, with reason:** "validators not implemented / S6 not wired / no commit hash" — the auditor judged a specification against a shipped-gate standard, not knowing this task's scope was `docs/process/` and no git. The *substance* is right and is now the loudest thing in the header (Scope boundary) rather than being argued away.

**Two things the auditor caught that no self-review would have:** a logic bug in my anti-hallucination rule (Rule A passed `turmeric curcumin`, the very seed it existed to catch), and a claim contradicted by my own committed evidence. **That is the case for G14, made twice, on this document.** A stage that grades its own homework is the failure mode; the external auditor is not a formality.

**Pass 3 — `audit-gpt.mjs` on rev 3 → FAIL.** Verdict: **quality: strong · "expert would respect it": true · AI-filler risk: low · weakest point: "No enforcement… nothing runs; by doctrine this protects nothing."** Triaged, not obeyed — and the split is instructive:

- **Rejected, with the same reason as pass 2 (and the finding kept loud in the header):** all 4 primary BLOCKING items are *"implement `keyword-validate.mjs` / `seed-lint.mjs` / wire CI / show a failing run"*. **`scripts/` is outside this task's scope** (docs/process/ only, no git). The auditor cannot see a task boundary and correctly refuses to grade a spec as a shipped gate. **It is right on doctrine (f) and I am not arguing it away — the Scope Boundary now states the consequence more sharply than the auditor did.** Its own line — *"the count of known corruption paths increased (good), but enforcement remains zero"* — is the fairest summary of rev 3 available, and it is in the header.
- **Conceded and fixed in rev 3, all in-scope:**
  · **`priority set` undefined** while V6 *and* G5 gate on it (§6 V6) — a term the executor would have had to invent, which is this document's own failure mode. Now: *the whole ontology*, with the arithmetic for why.
  · **G5 hard-blocked on the unratified Hinglish pattern list** while Q9 admits it is unvalidated — the identical defect the doc already ships V3 report-only to avoid. **Split into G5 (hard) + G5a (report-only until Q9).**
  · **"A grep is not a gate"** — G16/G17 now make the runtime assertion authoritative and demote the greps to advisory (§9).
  · **`serp_risk` / `winnability` left in the formula as stubs** → **removed outright** (§7.6). A printed stub gets filled with a guess by someone downstream.
  · **Contract-drift**: the observed pricing/ordering are facts about one day, not laws (§6 V6).
  · **"Labs knows where Google Ads is null" assumed** → hedged to an operational rule resting on 5 keywords (§5.3).
- **Deferred with a reason:** Q12 (SERP sampling) and Q8 (authority metric) are **Abilash-facing spend decisions**, not things an agent should quietly pick. The auditor's *"decide Q12 now"* is right that a deferral is not free — so rev 3 pays the cost by **removing the factors from the score entirely** rather than leaving them pending.

**Pass 3 — `audit-perplexity.mjs` → the auditor failed, and the failure is §12.2.** It accused this document of fabricating four verbatim-accurate, correctly-cited statistics. It was disproved by `curl | grep` in one command. **It also made four genuinely good catches** (Palakodety unsourceable — agreeing with my own hedge; Authoritas 70% unverifiable; "dominant form of Hindi online" overstated; "rounded annual averages" overstates Google's wording). **Both facts are in the record because both are true**: the tool is sound where retrieval succeeds and dangerous where it doesn't, and V5 is now written to that asymmetry rather than to its marketing.

> **The honest three-pass ledger.** Pass 1: PASS with 7 real findings. Pass 2: FAIL, 5 valid + 1 rejected on scope. Pass 3: FAIL on scope again, 6 valid in-scope findings, **plus the fact-checker itself producing the exact failure class the document is about.** **Three passes, and every one found something real. The auditors have never once been decorative** — and the one time an auditor was catastrophically wrong, the thing that caught it was not another model but a raw fetch of the bytes.

**In-repo evidence:**
- `docs/whatisayurveda-research/demand-raw.json` — the lossy "raw" file; `{"shilajit": 0}` — the coercion, preserved
- `docs/whatisayurveda-research/demand.md` — quarantine header (the 11× / 25× claims, now independently confirmed by calls 1–2)
- `audits/gpt5-audit_whatisayurveda-demand_2026-07-15.json` — the FAIL verdict that started this
- `scripts/dfs.sh` · `scripts/audit-gpt.mjs`

**Sources cited:**
- Google Ads Help — About Keyword Planner forecasts · https://support.google.com/google-ads/answer/3022575
- Tim Soulo / Ahrefs — There's No Such Thing as "Accurate" Search Volume (18 Mar 2024) · https://ahrefs.com/blog/accurate-search-volume/
- Ahrefs — Keyword Search Volume: 5 Things You Need to Know · https://ahrefs.com/blog/keyword-search-volume/
- Ahrefs Help — How accurate is keyword search volume in Ahrefs? · https://help.ahrefs.com/en/articles/72571-how-accurate-is-keyword-search-volume-in-ahrefs
- Ahrefs — The Great Decoupling (AI Overview CTR) · https://ahrefs.com/blog/the-great-decoupling/
- **Rand Fishkin / SparkToro — In 2020, Two Thirds of Google Searches Ended Without a Click (64.82%, ~5.1T searches via SimilarWeb)** · https://sparktoro.com/blog/in-2020-two-thirds-of-google-searches-ended-without-a-click/
- *Contra* — Search Engine Journal, "Stop Sharing Debunked Zero-Click Search Statistics" · https://www.searchenginejournal.com/stop-quoting-zero-click-search-studies/403763/ · and Google's refutation · https://www.socialmediatoday.com/news/google-refutes-data-on-zero-click-searches-and-the-role-it-plays-in-guidi/597289/
- DataForSEO — serp/google/organic/live/advanced · https://docs.dataforseo.com/v3/serp/google/organic/live/advanced/
- Ahrefs Academy — Keywords Explorer / related terms · https://ahrefs.com/academy/how-to-use-ahrefs/keywords-explorer/related-terms
- Ahrefs — Keyword Research: The Beginner's Guide · https://ahrefs.com/seo/keyword-research
- **Ahrefs — Seed Keywords: What Are They & 7 Actionable Ways to Find Them** · https://ahrefs.com/blog/seed-keywords/ — *the 7 methods; method #1 "brainstorm" contradicts our Rule C and is scoped, not overruled, in §2.3a; method #4 "review communities and forums" is the Reddit layer we cannot reach (Q4); "The output is often only as good as the input."*
- **Semrush — Exploring URL Volatility in Google's AI Overviews** · https://www.semrush.com/blog/url-volatility-ai-overviews/ — *[P] 1,500 desktop + 1,500 mobile US keywords, Oct 2024, AIO on ≥20/31 days: **3.87-day** desktop / 3.33-day mobile average URL tenure; **91%** removed at some point; **43%** reappeared; **96%** of keywords saw a domain change. The primary evidence that `serp_risk` cannot be a one-shot boolean (§7.5, Q12).*
- Semrush — We Studied 200,000 AI Overviews · https://www.semrush.com/blog/ai-overviews-study/ · Semrush AI Overviews Study (10M keywords) · https://www.semrush.com/blog/semrush-ai-overviews-study/ — **[R]**, not load-bearing here
- Ahrefs — Keyword Cannibalization: What It (Really) Is & How to Fix It · https://ahrefs.com/blog/keyword-cannibalization/ — *"cannibalisation is only a problem when it negatively impacts overall organic performance"; same-intent overlap is the test, not same-keyword overlap — supports cluster-level prioritisation (§7.1)*
- Wikipedia — *Hinglish* · https://en.wikipedia.org/wiki/Hinglish — **[R] REPORTED ONLY, NOT VERIFIED TO PRIMARY.** Reports a 52% Romanised / 46% English / 1% Devanagari YouTube-comment split attributed to Palakodety et al.; the IJCAI PDF (https://www.ijcai.org/proceedings/2020/0602.pdf) **would not render to text**, so the figure is unverified. **Nothing in this document rests on it** — our own live measurements (§5.2/§5.3) are the evidence for the Hinglish rule. *Excluded entirely: the recurring vendor-blog claim "73% of Indian internet users prefer regional languages" — untraceable to the KPMG/Google primary it appears to derive from (§1 source-quality rule).*
- Aleyda Solís — Keyword Mapping Cheatsheet · https://www.aleydasolis.com/en/search-engine-optimization/keyword-mapping-cheatsheet/
- Aleyda Solís — #CrawlingMondays 9: initial keyword research criteria & tools · https://www.aleydasolis.com/en/crawling-mondays/doing-an-initial-keyword-research-in-an-seo-process-criteria-and-tools-crawlingmondays-9th-episode/
- Aleyda Solís — Keyword research tools functionality matrix · https://www.aleydasolis.com/en/search-engine-optimization/keywords-research-tools-comparison/
- DataForSEO — google_ads/search_volume/live · https://docs.dataforseo.com/v3/keywords_data/google_ads/search_volume/live/
- DataForSEO — labs/google/keyword_overview/live · https://docs.dataforseo.com/v3/dataforseo_labs-google-keyword_overview-live/
- DataForSEO — labs/keyword_ideas/live · https://docs.dataforseo.com/v3/dataforseo_labs-keyword_ideas-live/
- DataForSEO — labs/google/keyword_suggestions/live · https://docs.dataforseo.com/v3/dataforseo_labs-google-keyword_suggestions-live/
- DataForSEO — labs/google/related_keywords/live · https://docs.dataforseo.com/v3/dataforseo_labs-google-related_keywords-live/
- DataForSEO — labs/google/bulk_keyword_difficulty/live · https://docs.dataforseo.com/v3/dataforseo_labs-google-bulk_keyword_difficulty-live/
- DataForSEO — labs/google/search_intent/live · https://docs.dataforseo.com/v3/dataforseo_labs-google-search_intent-live/
- DataForSEO — labs/google/historical_search_volume/live · https://docs.dataforseo.com/v3/dataforseo_labs-google-historical_search_volume-live/
- DataForSEO — Labs Google API pricing · https://dataforseo.com/pricing/dataforseo-labs/dataforseo-google-api
- Moz — Keyword Explorer metric model (volume/difficulty/opportunity/priority) · https://moz.com/explorer
- Yao, Heinrich, Zhang, Wei, Qi, Gao — Single botanical drugs in the Ayurvedic Pharmacopoeia of India, *Frontiers in Pharmacology* (2023) · https://pmc.ncbi.nlm.nih.gov/articles/PMC10213908/
- PCIM&H, Ministry of AYUSH · https://pcimh.gov.in/ · API Part I Vol. IX · https://cdn.ayush.gov.in/wp-content/uploads/2021/03/Ayurvedic-Pharmacopoeia-of-India-part-1-volume-IX.pdf
- Perplexity — Sonar API docs · https://docs.perplexity.ai/docs/sonar/quickstart · Sonar Pro (SimpleQA F 0.858) · https://www.perplexity.ai/hub/blog/introducing-the-sonar-pro-api

**Not obtained:** Reddit (r/SEO, r/bigseo, r/juststart, r/PPC, r/shopify) — blocked to this user agent (Q4). No Reddit claims appear in this document.

---

## 13 · THE ONE-LINE SUMMARY

**A `null` is not a `0`, an absent row is not a `0`, a response is not in the order you asked, a `raw` file is the API's bytes, a seed that names one thing twice is not a query, and India is not an English-language market — enforced by `keyword-validate.mjs` exit-2, regression-tested against real committed responses from our own worst day, with GPT-5 as the backstop for the failure we haven't imagined yet.**

**And the rev-3 sentence underneath it:** rev 2 believed it had found *the* bug and gated it. **Eight hostile API calls and $0.14 later, the count of known silent-corruption paths is three, one of them living inside rev 2's own remedy.** The number of ways to quietly produce a wrong number is not a property of the API — **it is a function of how hard we tried to break it, and until today we had never tried at all.** Every DO on our list was satisfied by the artifact that failed; only the DON'Ts would have stopped it. **That is the whole argument for §4.0, and it is made by our own record, not by a framework.**
