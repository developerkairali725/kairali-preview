# THE AI AUDITOR GATE SYSTEM — research + design

**Compiled 2026-07-15 18:12:08 IST · Citations independently re-verified 2026-07-15 (§16.1) · Research + proposed design · NOT ratified · Nothing outside `docs/process/` was touched; no git was run.**

**Commission:** design the AI auditor gate system that runs THROUGH the pipeline — where gates sit, the rubric each applies, anti-rubber-stamp design, evidence persistence, cost discipline, failure protocol, and where a human is irreplaceable.

**Parent spine:** this document does **not** invent a stage order. It attaches gates to the `S0–S11` spine defined in [`docs/process/research-practitioner-sequencing.md`](./research-practitioner-sequencing.md) §5. If that spine changes, the gate IDs here move with it.

**Auditors as they exist today:**
- [`scripts/audit-gpt.mjs`](../../scripts/audit-gpt.mjs) — GPT-5, strict-JSON verdict, `exit 2` on FAIL, already gating.
- [`scripts/audit-perplexity.mjs`](../../scripts/audit-perplexity.mjs) — Sonar, live search + citations, `exit 2` on FAIL. Present in-repo.

---

## 0 · How to read this document

Every substantive claim carries a source URL. Confidence labels:

- **[P] PRIMARY** — I read the paper/page content myself via fetch and the numbers below are quoted from it.
- **[S] SECONDARY** — the source is authoritative but I read it through a summarising fetch layer, not raw. Numbers are as reported by that layer.
- **[D] DERIVED** — my own arithmetic or reasoning. Shows its working. Not a citation.
- **[R] REPORTED** — a real source exists but I could not fetch it directly; treat as a lead, verify before relying.

### Declared evidence gaps — READ THIS FIRST

Per the standing rule that doctrine must not launder guesses into fact:

1. **Reddit was not reachable.** The commission explicitly asked for r/SEO, r/bigseo, r/juststart, r/PPC, r/shopify practitioner threads. Our search tool refuses the domain outright — verbatim error: `API Error: 400 The following domains are not accessible to our user agent: ['reddit.com']`. I did **not** substitute half-remembered Reddit consensus for the real thing. Named practitioners with published, attributable method ([Hamel Husain](https://hamel.dev/blog/posts/llm-judge/), [Eugene Yan](https://eugeneyan.com/writing/llm-evaluators/)) carry the practitioner load below. **If Abilash wants genuine Reddit evidence, it needs a human copy-paste or a different fetch path — this is an open request, not a solved one.**
2. **The Search Quality Rater Guidelines PDF could not be parsed** (8.6 MB binary; local render failed — `pdftoppm is not installed`). YMYL claims below are cited to Google's public HTML developer documentation instead, which I did read. The rater-guidelines-specific claims are marked **[S]**.
3. **Two arXiv PDFs would not parse** (2306.05685, 2405.01724). For MT-Bench I re-fetched the ar5iv HTML and got the numbers **[P]**. For Stureborg et al. 2405.01724 I did **not** get the paper — it is cited as **[R]** only, and no number from it is load-bearing here.
4. **Pricing numbers are as-reported by a summarising fetch of vendor pages.** Prices change. §9 requires the harness to record *actual* billed usage rather than trust these figures — the design does not depend on them being current.
5. **One thing this research could not establish:** whether our two specific auditors, on *our* artifacts, agree with *Abilash's and Dr. Deepu John's* judgement. That is not knowable from literature. §7.9 defines how to measure it, and §14 flags that until it is measured, every "the gate will catch X" claim in this document is a *design intention*, not a demonstrated fact. The single exception is the DataForSEO failure, where GPT-5 demonstrably did catch it ([`audits/gpt5-audit_whatisayurveda-demand_2026-07-15.json`](../../audits/gpt5-audit_whatisayurveda-demand_2026-07-15.json), `"verdict": "FAIL"`).

---

## 1 · PUSHBACK FIRST — the commission's framing is 80% right and the missing 20% is the important part

Duty of pushback (CLAUDE.md Operating Principles). Three corrections, before any design is built on the premise.

### 1.1 ⚠️ The auditors are not the primary defence, and designing them as if they are will fail again

The commission reads: *"A stage+gate must make this class of error impossible to pass."* An LLM gate **cannot** make anything *impossible*. It is a probabilistic reviewer with a measured tendency to be lenient when it is unsure (§2.3). If the only thing standing between an invented keyword and a 3,400-page build is a model's opinion, we have bought comfort, not safety.

Look closely at what actually happened in the DataForSEO failure:

| The error | What class of check catches it | Needs an LLM? |
|---|---|---|
| Seeds `turmeric curcumin`, `amla amalaki`, `tulsi holy basil` invented by the agent | Every seed must appear **verbatim** in the S2 audience-language corpus. `grep` | **No** |
| India pulled `language_code=en` only | Every locale in the S1 brief must have ≥1 row per required script. Set comparison | **No** |
| `shilajit US = 0` summed into a cluster total | Any `volume == 0` for a seed present in the S2 corpus = fail-closed. Integer test | **No** |
| Cluster totals reported upward from unverified rows | Every row must carry `source` + `retrieved_at` + `locale`. Column presence test | **No** |
| Is 27.1K plausible for turmeric in the US? | Live search against reality | **Perplexity** |
| Was the whole method out of order / is the plan generic? | Reasoning over process | **GPT-5** |

**Four of the six are regexes.** They are free, deterministic, cannot be sycophantic, cannot be talked out of it, and cannot have a bad day. The reason the failure shipped is not that we lacked an AI auditor — GPT-5 *caught it*. The reason is that **nothing cheap and deterministic ran first**, so a broken artifact was allowed to become expensive before anyone looked at it.

**Design consequence, and it is the spine of this whole document:** every gate is **layered**, and the LLM is never layer 0. See §4. If we build the LLM gate and skip the boring machine layer, we will reproduce this failure with a bigger token bill.

### 1.2 ⚠️ "Never telling an auditor that a previous auditor passed it" is right, but the bigger danger is *arguing with* an auditor

The commission asks for this rule, and the evidence supports it (bandwagon bias, §2.4). But the more dangerous and more likely behaviour is the one that follows a FAIL: the agent explains to the model why it is actually fine.

The numbers here are alarming. When challenged, Claude 1.3 **wrongly admitted a mistake on 98% of questions**; models revised answers after a challenge between **32% (GPT-4) and 86% (Claude 1.3)** of the time [[Sharma et al., Anthropic, arXiv:2310.13548]](https://arxiv.org/abs/2310.13548) **[S]**. A gate you can talk to is not a gate.

**Design consequence:** the fix-and-rerun loop is **stateless and non-conversational**. Fix the artifact, throw the context away, re-run from a clean process. The agent may never reply to an auditor. Ever. (§10.2)

### 1.3 ⚠️ "AEO should technically be the FIRST" cannot be implemented as a first gate — and the sibling doc is right about why

I agree with the sequencing doc's §6.2 and will not re-litigate it: GEO treatments are rank- and domain-calibrated (Cite Sources measured **−30.3% at rank 1 vs +115.1% at rank 5**), so no AEO gate can fire before we know domain, query, and rank. What I add from the gate side: **an AEO/GEO gate at S9 is structurally incapable of doing its job**, because by S9 the only remedy it can prescribe is "rewrite the page". A gate whose only fix is "redo the stage" is not a gate — it is a bereavement notice. Hence `G6-PROC` (§6.6) is where AEO/GEO binds, and `G9` merely *confirms* it. This is what Abilash actually wants when he says "first": *binding early*, not *sequenced first*.

---

## 2 · Is LLM-as-a-judge reliable? The honest evidence

The commission asks for this explicitly, and the answer decides how much weight the gates may bear.

### 2.1 The case FOR — it works well enough to be worth the money

[Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, NeurIPS 2023](https://arxiv.org/abs/2306.05685) **[P]** (read via [ar5iv](https://ar5iv.labs.arxiv.org/html/2306.05685)):

> "The agreement under setup S2 (w/o tie) between GPT-4 and humans reaches 85%, which is even higher than the agreement among humans (81%)."

Also: when humans disputed GPT-4's judgements, they deemed its reasoning **reasonable in 75% of cases** and **changed their own vote 34% of the time** after reading it **[P]**.

For fact-checking specifically — the Perplexity gate's job — the evidence is stronger still. Google DeepMind's **SAFE** (Search-Augmented Factuality Evaluator) decomposes a long response into atomic facts and search-checks each one. On ~16k facts it **agreed with crowdsourced human annotators 72% of the time**, and on a random subset of 100 disagreements **SAFE was judged correct 76% of the time — it beat the humans** — while being **>20× cheaper** [[Wei et al., arXiv:2403.18802]](https://arxiv.org/abs/2403.18802) **[P — abstract re-fetched and quoted verbatim, 2026-07-15 18:5x IST; all four figures confirmed exactly]**. That architecture — *decompose → search each atom → judge each atom* — is exactly what `audit-perplexity.mjs` already does, which is a genuine point in its favour.

### 2.2 The case AGAINST — the biases are real, measured, and some are aimed straight at us

| Bias | Measured effect | Source | Does it hit us? |
|---|---|---|---|
| **Position** | GPT-4 consistent only **65.0%** of the time when two answers are swapped (30% first-position, 5% second) | [Zheng et al.](https://ar5iv.labs.arxiv.org/html/2306.05685) **[P]** | **Rarely.** Our gates are *pointwise* (judge one artifact), not pairwise. Only bites on A/B design comparisons — §7.6 |
| **Position (adversarial)** | Reordering alone let Vicuna-13B "beat" ChatGPT on **66 of 80** queries, *with ChatGPT itself as the evaluator* | [Wang et al., ACL 2024, arXiv:2305.17926](https://arxiv.org/abs/2305.17926) **[P — verified]** | Same as above |
| **Verbosity** | "Repetitive list" attack fooled Claude-v1 and GPT-3.5 **91.3%** of the time; GPT-4 **8.7%** | [Zheng et al.](https://ar5iv.labs.arxiv.org/html/2306.05685) **[P]** | **Yes.** Our artifacts are long strategy docs. Length must not buy credit |
| **Self-enhancement** | GPT-4 favours its own output by **~10%** win rate; Claude-v1 by **~25%** | [Zheng et al.](https://ar5iv.labs.arxiv.org/html/2306.05685) **[P]** | **Yes — and it is why the auditors are external.** Self-recognition ability correlates linearly with self-preference strength [[Panickssery et al., NeurIPS 2024, arXiv:2404.13076]](https://arxiv.org/abs/2404.13076) **[P — verified; abstract states a "linear correlation between self-recognition capability and the strength of self-preference bias", and the authors argue the link is causal]** |
| **Authority** | Inserting **automatically generated fake references** causes judges to rate inferior answers as superior — *and cite the fabricated sources as justification* | [Ye et al., *Justice or Prejudice?* (CALM), arXiv:2410.02736](https://arxiv.org/html/2410.02736v1) **[P]** | **Yes, severely. See §2.5** |
| **Bandwagon** | Judges shift toward stated majority opinion regardless of correctness | [CALM](https://arxiv.org/html/2410.02736v1) **[P]** | **Yes** — this is why no auditor is told another passed it |
| **Leniency** | Judges mark **incorrect** answers correct at rates **> 0.50** when their criteria are not fully aligned; smaller models worse | [Thakur et al., *Judging the Judges*, arXiv:2406.12624](https://arxiv.org/html/2406.12624v1) **[P]** | **Yes — the single most dangerous one for us. See §2.3** |
| **Sycophancy** | 32%–86% of answers revised under challenge; Claude 1.3 wrongly admits error **98%** of the time | [Sharma et al.](https://arxiv.org/abs/2310.13548) **[S]** | **Yes — see §1.2** |
| **Self-inconsistency** | Same input, different verdicts across runs at temperature > 0 | [Stureborg et al., arXiv:2405.01724](https://arxiv.org/abs/2405.01724) **[R]** — *not fetched, not load-bearing* | Probably. Mitigated by temp 0 + §7.8 |

CALM's own conclusion, from a paper that tested 12 bias families: even the best judges show *"significant room for improvement in achieving more robust decision-making"* **[P]**.

### 2.3 The finding that most changes our design: judges are LENIENT when uncertain

[Thakur et al.](https://arxiv.org/html/2406.12624v1) **[P]** found judge models' probability of marking an incorrect response as correct was *"significantly higher than 0.50"*, and attribute it directly to *"a tendency of the judge models to evaluate responses as correct when their evaluation criteria are not completely aligned."*

Read that again in our context. **When the rubric is vague, the judge says PASS.** Not "I don't know" — PASS. Our current `SYSTEM` prompt already says "Default to FAIL when a blocking issue or an unproven step exists", which is the right instinct, but an instruction to be strict is a weak counterweight to a measured behavioural prior. It needs a *mechanical* backstop, not a politer prompt (§7.3).

Also from the same paper, two findings that cut against naive cost-saving:
- Best judges reached **κ = 84 (GPT-4 Turbo)** and **κ = 79 (Llama-3 70B)** against a **human alignment score of 96**. Good, not human.
- Judges detect blatant errors well but are **poor at under-specification**. Table 2 **[P]**, per judge — **GPT-4 Turbo: 98.3% recall on "incorrect entity" vs 33.9% on "under-specified"; Llama-3 70B: 96.6% vs 23.3%.** **This is us.** A thin, hedging, under-specified Ayurveda monograph is precisely the failure mode our judges are *worst* at spotting — and note the collapse is ~65 points on the *strongest* judge, i.e. it is not fixable by buying a better model. It is structural, and §7.10's `thin-but-fluent/` fixture exists because of exactly this number.
- **Smaller judges degrade substantially with longer, more detailed prompts.** Our gate prompts are enormous. → §9.3.

### 2.4 High agreement is a misleading metric — use Cohen's κ

Thakur et al. **[P]** found a **30-point** gap on percent agreement corresponding to a **53-point** gap in Cohen's κ; a model with *higher* percent agreement had *the lowest κ in the ensemble*. Eugene Yan makes the same practitioner point: κ *"provides a more precise and conservative measurement of alignment compared to percentage agreement"* [[eugeneyan.com](https://eugeneyan.com/writing/llm-evaluators/)] **[S]**.

**Consequence:** when we validate our gates (§7.9), "the auditor agreed with Abilash 9 times out of 10" is *not* evidence. If Abilash passes 90% of artifacts, a judge that blindly says PASS scores 90% agreement and **κ ≈ 0**. Report κ or report nothing.

### 2.5 The authority-bias finding is a loaded gun pointed at our own doctrine

We are about to build a pipeline whose core defence is *"cite your sources"*. CALM **[P]** shows that judges credit fabricated references and **quote them back as justification**. So an artifact stuffed with plausible-looking, non-existent citations is not just uncaught — it scores **better** than an honest one.

This is corroborated in the wild. The Tow Center tested 1,600 queries across eight AI search tools and found they were wrong **more than 60%** of the time; **more than half of Gemini and Grok-3 responses cited fabricated or broken URLs**; Grok-3 produced **154 error-page citations out of 200 queries** [[Jaźwińska & Chandrasekar, CJR, Mar 2025]](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php) **[P]**.

**Consequence — non-negotiable:** *no LLM is ever allowed to be the thing that decides whether a citation is real.* Citations are resolved by **HTTP + string match**, by a script, at layer 0. §4, §12.6.

### 2.6 And the uncomfortable one: our fact-grounding auditor is itself wrong ~37% of the time

Same Tow Center study **[P]**: **Perplexity answered incorrectly 37% of the time** — best in the test, and still more than a third wrong. Worse for our purposes:

> Premium models "paradoxically also demonstrated higher error rates" — answering more prompts but with **"higher confidence"** in wrong answers rather than declining.

And ChatGPT *"signaled a lack of confidence just fifteen times out of its two hundred responses, and never declined to provide an answer"* **[P]**.

**This is the most important honest statement in this document.** We are proposing Perplexity as the gate that protects a **YMYL medical encyclopedia**. It is wrong roughly a third of the time and rarely says so. It is therefore:

- **Excellent as a screen** — it disproved `shilajit US = 0` with real sources, which GPT-5 could only *suspect*. That is enormous value.
- **Categorically unfit as a signer-off of medical claims.** Dr. Deepu John is not a formality we route around when he is busy. §11.

Perplexity's job is to **reduce what reaches the physician to a reviewable set**, never to replace him.

### 2.7 Verdict on the method

**LLM-as-judge is reliable enough to be a NET, not a JUDGE.** It is worth building because (a) a different model family has no stake in our work being right — the structural fix recommended across this literature is *use a different model family for judging than for generating*, which our Claude→GPT-5/Perplexity split already satisfies; (b) MT-Bench-level agreement with humans is real; (c) SAFE shows search-grounded fact-checking beats crowdworkers at 1/20th the cost. It is **not** reliable enough to be the last word on anything that can hurt a patient, cost money, or create legal exposure.

---

## 3 · WHERE THE GATES SIT

Gate ID = `G<stage>-<type>`. Types: **`PRE`** machine precondition (no LLM) · **`FACT`** Perplexity · **`PROC`** GPT-5 · **`HUMAN`** named person.

A gate **cannot be entered** until the previous stage's gate emitted a committed PASS verdict bound to that artifact's hash (§8.3).

| Stage | Gate | Auditor | Blocking? | Why this auditor | Est. cost |
|---|---|---|---|---|---|
| **S0** Legacy mine | `G0-PRE` | machine (crawl diff, protection-map completeness) | **BLOCK** | URL coverage is set arithmetic. An LLM would be strictly worse and slower | ~$0 |
| | `G0-FACT` | Perplexity | advisory | Sanity-check benchmark claims ("we ranked #3 for X") against reality | ~$0.05 |
| **S1** Align | `G1-PRE` | machine (register/locales/sign-off owners present; banned-word list bound) | **BLOCK** | Pure presence checks. **Do not audit trivia** | ~$0 |
| **S2** Audience | `G2-PRE` | machine (every claim row has source URL + verbatim quote + date) | **BLOCK** | Column presence | ~$0 |
| | `G2-CITE` | script: HTTP-resolve every URL + grep the quote | **BLOCK** | §2.5 — a model may not validate citations | ~$0 |
| | `G2-PROC` | GPT-5 | **BLOCK** | "Is this evidenced audience research or invented personas?" is a reasoning call | ~$0.40 |
| **S3** Demand ★ | `G3-PRE` | machine: **seed provenance · locale/script coverage · zero-volume challenge · no unverified sums** | **BLOCK** | ★ **The DataForSEO gate. Four regexes. §1.1** | ~$0 |
| | `G3-FACT` | **Perplexity** | **BLOCK** | ★ Is 27.1K real for turmeric US? Only live search can say | ~$0.10 |
| | `G3-PROC` | GPT-5 | **BLOCK** | Order violations, missed steps, method soundness | ~$0.70 |
| **S4** Validate | `G4-PROC` | GPT-5 | **BLOCK** | Information-gain-per-URL and scaled-content-abuse exposure are judgement | ~$0.70 |
| | `G4-HUMAN` | **Abilash** | **BLOCK** | "Will it sell?" is a commercial call. §11 | — |
| **S5** Sitemap ★ | `G5-PRE` | machine: 1:1 keyword→URL, no dupes, every S0 KEEP URL has a home, every 301 single-hop | **BLOCK** | ★ Graph/set problems. Deterministic | ~$0 |
| | `G5-PROC` | GPT-5 | **BLOCK** | ★ The hinge. Mental model vs demand vs register-lock conflicts | ~$0.70 |
| **S6** Content+AEO | `G6-PRE` | machine: banned-word scan (KTAHV), schema present, every claim has a citation | **BLOCK** | Grep beats judgement, and the register lock is a legal exposure | ~$0 |
| | `G6-CITE` | script: resolve every citation | **BLOCK** | §2.5 | ~$0 |
| | `G6-FACT` | **Perplexity** | **BLOCK** | ★ Every medical claim fact-grounded. Its highest-value use | ~$0.15/pg |
| | `G6-PROC` | GPT-5 | **BLOCK** | AEO/GEO answer-shape designed in; "is this generic AI filler" | ~$0.70 |
| | `G6-HUMAN` | **Dr. Deepu John** | **BLOCK** | ★ **Clinical sign-off. No AI may substitute. §11** | — |
| **S7** Design | `G7-PROC` | design-qa + design-critic (existing) | **BLOCK** | Existing gate; keep | — |
| | `G7-ADV` | GPT-5 | *advisory* | Text judgement of visual work is weak. Advisory only, honestly labelled | ~$0.30 |
| **S8** Build | `G8-PRE` | machine: `pnpm build`, spec suite, lints, Lighthouse | **BLOCK** | Deterministic. **No LLM** | ~$0 |
| **S9** Pre-launch | `G9-PRE` | machine: **every S0–S8 verdict exists, PASSed, and its artifact hash still matches** | **BLOCK** | ★ Makes the matrix walk mechanical. §8.3 | ~$0 |
| | `G9-FACT` | Perplexity | **BLOCK** | Final fact sweep on the built pages | ~$1 |
| | `G9-PROC` | GPT-5 | **BLOCK** | Final re-walk + `/security-review` | ~$1 |
| | `G9-HUMAN` | **Abilash** | **BLOCK** | Preview approval | — |
| **S10** Launch | `G10-PRE` | machine: redirect tests, robots, post-publish fetch+diff | **BLOCK** | Deterministic | ~$0 |
| | `G10-HUMAN` | **Abilash / Ambuj** | **BLOCK** | DNS is a human action, always | — |
| **S11** Measure | `G11-ADV` | Perplexity, batched monthly | *advisory* | Drift/fact-rot on live claims | ~$2/mo |

**Note the shape of that table.** The blocking work is overwhelmingly machine. LLM gates sit at exactly the five points where judgement is genuinely required: *is the audience real* (S2), *is the number real* (S3), *is the method sound* (S3/S4), *is the architecture right* (S5), *is the content good and true* (S6). That is the design answering Abilash's "don't burn millions of tokens" — **not by making the auditors cheaper, but by not calling them for things a regex can decide.**

---

## 4 · THE FOUR-LAYER MODEL (the actual design)

Every gate runs layers in order and **stops at the first failure**. This is both the correctness design and the cost design.

```
L0  MACHINE PRECONDITION   deterministic, free, un-arguable
    ├─ artifact exists? committed? non-empty?
    ├─ required columns/fields present?
    ├─ set/graph invariants (locale coverage, 1:1 URL binding, single-hop 301)
    └─ CITATION RESOLUTION: every URL → HTTP 200 + quoted string present on page
    ↓ FAIL here = exit 2, ZERO tokens spent.        ← where the DataForSEO failure dies

L1  FACT GROUNDING (Perplexity)   "is this claim TRUE?"
    ├─ decompose to atomic claims (SAFE architecture)
    ├─ live-search each; SUPPORTED / CONTRADICTED / MISLEADING / UNVERIFIABLE
    └─ plausibility challenge on every number
    ↓ its own citations are re-resolved at L0 rules — Perplexity is 37% wrong (§2.6)

L2  PROCESS + QUALITY (GPT-5)   "is this GOOD, and did we skip a step?"
    ├─ understanding · step location · order violations · missed steps
    └─ quality: expert-respect · weakest point · AI-filler risk
    ↓ never told what L0/L1 concluded (bandwagon bias, §7.2)

L3  HUMAN   accountable sign-off. Cannot be delegated to L0–L2. §11
```

**The rule that makes this work: a higher layer may never overturn a lower one.** Perplexity cannot argue a broken citation into existence; GPT-5 cannot decide a 404 is fine. Layers only *add* findings.

---

## 5 · AUDITOR ASSIGNMENT DOCTRINE — they are not interchangeable

The commission is emphatic and correct here. Making it enforceable:

| | **GPT-5 (`audit-gpt.mjs`)** | **Perplexity (`audit-perplexity.mjs`)** |
|---|---|---|
| **Question it answers** | "Is this GOOD, and is the process sound?" | "Is this TRUE, and where's the proof?" |
| **Genuinely good at** | Reasoning over long context; order violations; missed steps; distinguishing craft from AI filler; noticing what is *absent* | Live retrieval; contradicting confident nonsense with sources; plausibility of numbers against reality |
| **Structurally incapable of** | Knowing anything that happened after training. **It cannot check a fact.** On `shilajit US = 0` it could only ever say "this looks odd" | Judging craft, taste, structure, or whether a step was skipped. It has no model of our pipeline and should never be shown one |
| **Its characteristic failure** | Confident, plausible, unfalsifiable process commentary | Confidently wrong with a real-looking citation (§2.6) |
| **Never ask it** | "Is this number correct?" | "Is this good?" / "Did we skip a step?" |

**Enforced mechanically, not by convention:** `audit-perplexity.mjs` already gets this right — its context bundle is labelled *"for understanding only — do NOT fact-check our own internal rules"*. Strengthen to: **the Perplexity gate is never passed the pipeline doctrine at all.** It does not need to know we have stages, and a model that knows our process will start commenting on it — which is authority-laundering our own doctrine back at us as if it were evidence.

**Cross-check rule (S3, S6):** where both run, **disagreement is not averaged — it escalates.** If Perplexity says CONTRADICTED and GPT-5 says PASS, the artifact FAILS. Two auditors are a union of findings, never a vote. (Bandwagon/majority logic is exactly what CALM shows judges get wrong.)

---

## 6 · THE RUBRICS

Rubrics live at `docs/process/rubrics/<gate-id>.md`, are hashed into every verdict (§8.2), and are **doctrine, not code** — changing one requires the §10.4 procedure.

**Why rubrics at all — the single highest-leverage finding in this research:** MT-Bench measured GPT-4's grading failure rate on problems it could itself solve at **70%** with a default prompt, **30%** with chain-of-thought, and **15% with reference-guided grading** [[Zheng et al.]](https://ar5iv.labs.arxiv.org/html/2306.05685) **[P]**. Giving the judge a *reference* — what a correct answer looks like — cut failures **~4.7×**. That is nearly free and larger than any model upgrade we could buy. **Every rubric below therefore ships with: the stage's exit-artifact spec, a worked golden example, and the known failure cases.**

### 6.1 `G3-PRE` — the machine gate (NO LLM). Write this first; it matters most.

Not a prompt. Assertions, run before a single token is spent:

```
1. SEED PROVENANCE   ∀ seed ∈ keyword file: seed appears VERBATIM in the S2
                     audience-language corpus, with its source id.
                     → "turmeric curcumin" absent from corpus ⇒ FAIL, name the seed.
2. LOCALE × SCRIPT   ∀ locale ∈ S1 brief: rows exist for EVERY required
                     language_code. India ⇒ {en, hi-Deva, hi-Latn(Hinglish)}.
                     → India rows all language_code=en ⇒ FAIL.
3. ZERO CHALLENGE    ∀ row where volume == 0 AND seed ∈ S2 corpus ⇒ FAIL.
                     A zero for a mainstream term is a tool/locale error until
                     proven otherwise. Override requires a committed, named
                     human waiver file — never an agent's judgement.
4. ROW PROVENANCE    ∀ row: source, retrieved_at, locale, language_code non-empty.
5. NO BLIND SUMS     No aggregate may be emitted unless every summand passed 1–4.
                     Cluster totals are DERIVED artifacts and carry the ids they sum.
```

Every one of these is `grep`/`set`/`int`. Every one would have stopped the failure **for free**.

### 6.2 `G3-FACT` — Perplexity, demand plausibility (BLOCKING)

Passed to `--ask`; the artifact is the keyword file. **No pipeline doctrine in context.**

```
You are fact-checking a search-demand dataset that will decide what a
3,400-page health encyclopedia builds first. If these numbers are wrong,
years of work go to the wrong pages.

For EVERY term, independently establish approximate real monthly search
demand in the stated market from live sources. Then compare to the claimed
figure and judge:
  SUPPORTED     within a plausible band of reality
  CONTRADICTED  reality differs materially — give the correct approximate figure
  MISLEADING    defensible in isolation, false in impression
  UNVERIFIABLE  no authoritative basis found

MANDATORY CHECKS — you must answer each explicitly:
1. ZEROS. For every term reported as 0 or absent: is this a globally traded,
   widely consumed, or widely searched substance? If yes, say so plainly and
   state the approximate real figure. A zero for a popular supplement is a
   DATA FAULT, not a finding about the world.
2. IS THIS A REAL QUERY? For every multi-word term, do people actually type
   it? Distinguish real compounds from concatenations of two synonyms that
   no human searches ("<herb> <sanskrit-name-of-same-herb>" is an invented
   seed, not a keyword).
3. LANGUAGE. For any non-English-majority market reported in English only:
   state what the dominant query language and script actually are and whether
   English-only capture materially understates demand.
4. RATIO SANITY. Flag any figure that is implausibly small relative to the
   substance's real-world prominence, and estimate the true order of magnitude.

Cite a source for every judgement. Never assert from memory — you have search.
Report a DATA FAULT as a fault; do not repeat it as a finding.
```

### 6.3 `G3-PROC` — GPT-5, method + order (BLOCKING)

Uses the existing `SYSTEM` (good; keep) plus a reference block:

```
REFERENCE — a PASSING S3 artifact has ALL of:
  · seed list traceable, item by item, to the S2 audience corpus
  · every locale × script the S1 brief requires
  · per-row source + retrieval date + locale
  · a plausibility pass whose output is committed
  · a second-source cross-check performed BEFORE any number was reported upward
  · intent classification + entity/topic map (not a flat keyword list)

KNOWN FAILURE CASES (real; from this project; do not repeat):
  · agent-invented compound seeds understated turmeric 11× and amla 25×
  · zeros for shilajit/shatavari/gokshura (US) summed into cluster totals
    while India showed 246K/90.5K/27.1K — a locale bug reported as a fact
  · India pulled in English only
  · totals reported to the Executive Director as fact

ASK: Is this artifact a repeat of any known failure case? Name it if so.
     Are the prerequisites (S1 brief, S2 corpus) genuinely complete, or
     assumed? A rule existing in a document is ZERO evidence it ran.
```

### 6.4 `G5-PROC` — GPT-5, the sitemap hinge (BLOCKING)

```
This is the most expensive decision in the project. Wrong URLs here become
301 chains, lost equity, and a year of redirect maintenance. Cheap now,
a project after launch.

REFERENCE — a PASSING S5 artifact has ALL of:
  · a sitemap derived from an IA derived from the S3 topic map — in that order
  · 1:1 keyword→URL binding; no two URLs target one primary intent
  · every S0 KEEP URL has a home; every 301 is single-hop to an EQUIVALENT
    page (never to a thin page, never to the homepage)
  · a tree-test result, not just a card sort
  · a conflict log: every place the audience's mental model, search demand,
    and the register lock disagreed — with the ruling and who made it

ASK, and be specific:
 1. Is the sitemap actually derived from the topic map, or was it drawn first
    and back-justified? Cite the evidence either way.
 2. Name every cannibalisation risk: two URLs, one intent.
 3. For a KTAHV site: does any URL, slug, breadcrumb or nav label use the
    register-locked vocabulary? This is a legal exposure, not a style nit.
 4. Where is this sitemap organised for OUR convenience rather than the
    user's task?
 5. What is the single URL most likely to be wrong, and why?
```

### 6.5 `G6-FACT` — Perplexity, YMYL medical (BLOCKING; gates the physician, does not replace him)

```
This text will be published to the public as health information about
Ayurvedic herbs, formulations and treatments. A reader may act on it.

Extract EVERY health claim as an atomic, checkable statement. Verify each
against authoritative sources, preferring primary evidence: peer-reviewed
literature, PubMed/Cochrane, NIH/NCCIH/ODS, drug regulators, official
pharmacopoeias. Blogs, supplement retailers and SEO content are NOT sources.

Judge each: SUPPORTED / CONTRADICTED / MISLEADING / UNVERIFIABLE.

APPLY THESE STRICTLY:
· In-vitro, animal, or preliminary evidence written as if it applies to
  humans is MISLEADING, not SUPPORTED. Say which it is.
· Any dose, duration, contraindication, pregnancy/paediatric statement, or
  drug-herb interaction claim: verify SEPARATELY and mark is_health_claim.
  These carry the highest harm.
· Traditional/classical usage is a legitimate claim ONLY if framed as
  traditional use. Traditional use written as clinical efficacy is
  CONTRADICTED — flag the framing, not just the fact.
· A claim you cannot source is UNVERIFIABLE, and for health that is
  BLOCKING. It must not be published as fact.
· Heavy-metal, safety, and toxicity claims about Ayurvedic preparations must
  be checked against regulator positions, not tradition.

For every claim, output the exact source URL. Do not assert from memory.
Do NOT judge writing quality, structure, or process. Only truth.
```

**And then a human reads it.** This rubric's output is *the packet Dr. Deepu John reviews*. §11.

### 6.6 `G6-PROC` — GPT-5, AEO/GEO + is-it-actually-good (BLOCKING)

```
REFERENCE — a PASSING S6 artifact has ALL of:
  · a message hierarchy traceable to S2 research, not to the agent's taste
  · GEO treatment chosen PER TEMPLATE and justified by domain and expected
    rank — not applied blanket. Cite Sources measured -30.3% at rank 1 and
    +115.1% at rank 5; blanket application is a measured negative.
  · citations/statistics/quotations as PROPERTIES OF THE PROSE — if these
    could be bolted on later, they were not designed in and this FAILS
  · real representative content for EVERY template (never lorem, never
    "content TBD")
  · E-E-A-T: named author, named reviewer, credentials, review date
  · schema planned per template

QUALITY — answer without diplomacy:
 · Would a practising Ayurvedic physician and a discerning SEO both respect
   this page, or is it competent-looking filler?
 · What is the INFORMATION GAIN here versus the top 3 pages already ranking?
   If a reader could get this from any of them, that is a FAIL, not a nit.
 · Name the single weakest paragraph and say why.
 · Length is not merit. Volume is not merit. Effort is not merit. Judge the
   marginal value of the page to a real person with a real problem.
```

### 6.7 `G9-PROC` — the matrix walk (BLOCKING)

Runs **only after** `G9-PRE` has mechanically confirmed every prior verdict exists, PASSed, and still hash-matches its artifact (§8.3). GPT-5's job here is *not* to re-audit everything — that would be a token bonfire and it would be lenient about it. It is narrow:

```
You are shown: the stage ledger (which gates ran, when, on which artifact
hashes) and the final built site's key templates.

You are NOT shown, and must not ask for, any previous auditor's verdict text.

ASK:
 1. Does the LEDGER tell a coherent story, or does the sequence of timestamps
    and hashes show stages were run out of order, or re-run until they passed?
 2. Does the built site actually reflect the S5 sitemap and S6 content model,
    or did the build drift from the plan? Name every drift.
 3. What in this site would embarrass us in front of a domain expert?
 4. If you had to bet on one thing being wrong here, what is it?
```

Note item 1: **the ledger itself is auditable.** Re-running a gate until it passes leaves a trail of hashes and timestamps, and we point GPT-5 straight at it.

---

## 7 · ANTI-RUBBER-STAMP DESIGN

Each countermeasure names the bias it defends against and the source.

### 7.1 Different model family from the generator — already true, keep it
Claude generates; GPT-5 and Sonar judge. Self-preference correlates with self-recognition [[Panickssery]](https://arxiv.org/abs/2404.13076) **[S]**; self-enhancement measured at ~10% (GPT-4) and ~25% (Claude-v1) [[Zheng]](https://ar5iv.labs.arxiv.org/html/2306.05685) **[P]**. **Corollary — a rule we do not yet have: Claude must never be asked to audit its own artifact, and no gate may be "temporarily" swapped to Claude because a key is missing.** A missing key is a FAIL (exit 1), never a fallback.

### 7.2 An auditor is never told another auditor passed it — and never sees a prior verdict
Bandwagon bias: judges shift toward stated majority opinion regardless of correctness [[CALM]](https://arxiv.org/html/2410.02736v1) **[P]**. Enforcement: the harness refuses to include any path matching `audits/**` in `--context` or `--artifact`. A hard check in the script, not a convention.

### 7.3 Default-to-FAIL, enforced by the harness rather than the prompt
Leniency: P(mark incorrect as correct) **> 0.50** when criteria are not fully aligned [[Thakur]](https://arxiv.org/html/2406.12624v1) **[P]**. An instruction cannot be trusted to beat a behavioural prior. Mechanical rules:

- **`context_sufficient === false` ⇒ exit 2, regardless of the stated verdict.** *This is a live bug today:* the GPT-5 schema collects `context_sufficient` and the harness ignores it. Our one real audit returned `"context_sufficient": false` — the model told us it could not properly judge, and only a separate FAIL saved us. A judge that says "I couldn't see enough" and PASSes must be treated as a FAIL by the harness.
- **Any `missed_steps[].severity == "blocking"`, or any non-empty `blocking_issues`, ⇒ exit 2** even if `verdict == "PASS"`. Never trust the summary field over the findings.
- **Perplexity: any `CONTRADICTED`/`MISLEADING`, or any `UNVERIFIABLE` where `is_health_claim`, ⇒ exit 2.**
- **Empty findings + PASS on a large artifact ⇒ SUSPECT.** A "no findings" verdict is the signature of a lenient judge. Rerun once at a higher tier; if still clean, record `"clean_pass_unconfirmed": true` in the ledger so the S9 walk can see it.

### 7.4 Adversarial framing — with a deliberate brake
The rubrics are hostile by design ("name the weakest point", "what would embarrass us"). But adversarial framing manufactures false positives, and false alarms destroy the gate's credibility until someone starts ignoring it — which is how gates die in practice. Brake: **every gate must also report what it checked and found sound.** A gate that never passes anything is as broken as one that never fails anything, and §7.9's κ measurement will show it.

### 7.5 Citations resolved by machine, never judged by model
Fake references flip judges and get quoted back as justification [[CALM]](https://arxiv.org/html/2410.02736v1) **[P]**; >50% of some tools' citations are fabricated or broken [[CJR]](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php) **[P]**. `scripts/resolve-citations.mjs` (§12.6) HTTP-resolves every URL in the artifact **and every URL Perplexity returns**, and greps for the quoted string. Unresolvable ⇒ L0 FAIL. **This also means the artifact's own claims about its rigour ("verified against 13 sources") earn zero credit** — the rubric says so explicitly, and the resolver checks.

#### 7.5.1 ★ A live demonstration of why, produced while verifying this very document

During the citation-verification pass on this document (2026-07-15, §16), the claim *"98% recall on incorrect entity"* was re-checked against Thakur et al. The **summarising model layer that reads fetched pages returned "~97%"** and attributed it to "both judges" — so the checker was one keystroke away from "correcting" a **true** number to a **false** one, and committing that correction as diligence. Going back to the paper's **Table 2** settled it: **GPT-4 Turbo 98.3% / Llama-3 70B 96.6%** — the original was right, and the summariser had silently averaged two models into a number that appears in neither.

Three things follow, and they are the entire argument of this section in miniature:

1. **A model between us and the source is a mutation, not a lookup.** It was not hallucinating wildly; it produced a *plausible, close, confidently-stated* number — exactly the failure class that is hardest to catch and that §2.6 measures at 37%.
2. **Verification that runs through the same lossy layer is theatre.** `resolve-citations.mjs` must fetch **raw bytes** and `grep` the literal quoted string. It must never ask a model *"does this page support the claim?"* — that reintroduces the defect it exists to catch. This is now a build requirement on §12.6, not a stylistic preference.
3. **Precision beats approximation for a reason that is not pedantry.** Had the doc said "~97%, both judges", the §2.3 finding would have lost its actual teeth: the collapse is **98.3 → 33.9 on the single strongest judge**. Rounding blurs the very asymmetry the design rests on.

**The uncomfortable generalisation:** every **[S]** label in this document was produced by that same summarising layer. Four **[S]** items were re-fetched and upgraded to **[P]** (SAFE, Panickssery, Wang, and the Thakur table); the rest — notably **all pricing** and the **YMYL/rater-guidelines** claims — were not, and §16 keeps them honestly labelled. **[S] means "a model told us what the page says." It is a lead, not a citation.**

### 7.6 Position bias — mostly not our problem, handled where it is
Our gates are pointwise, so the 65% swap-consistency figure **[P]** largely does not apply. Where we do compare options (A/B design at S7): run both orders and accept only consistent verdicts — the conservative approach in [Zheng] **[P]**, and Balanced Position Calibration in [[Wang et al.]](https://arxiv.org/abs/2305.17926) **[S]**.

### 7.7 Verbosity bias — length must not buy a pass
Repetitive-list attack: 91.3% success against Claude-v1/GPT-3.5, 8.7% against GPT-4 **[P]**. GPT-5 is likely more robust still, but our artifacts are long strategy documents and the failure mode is *reward for bulk*. The existing SYSTEM already says "Do not award credit for effort or volume" — keep, and add to every rubric: **"Judge marginal information gain per section, not length."**

### 7.8 Determinism and flaky verdicts
Perplexity already runs `temperature: 0` — correct, keep. Reasoning-model APIs may not honour temperature, so instead: **record the resolved model id returned by the API (`data.model`), not the alias we requested.** An alias silently re-pointing to a new snapshot changes the judge underneath us with no diff, no commit, and no way to explain why last week's PASS is this week's FAIL. On borderline artifacts, best-of-3 with **FAIL winning any disagreement** (never majority vote — a union of findings, per §5).

### 7.9 Validate the judges — with κ, on our own labels
Per Hamel Husain: the judge must be aligned against a **principal domain expert** — *"In most organizations there is usually one (maybe two) key individuals whose judgment is crucial"* — and the expert gives a **binary PASS/FAIL plus a written critique**, because *"It's not actionable: People don't know what to do with a 3 or 4"* [[hamel.dev]](https://hamel.dev/blog/posts/llm-judge/) **[P]**.

- Abilash is the principal expert for process/quality (GPT-5 gates). Dr. Deepu John for clinical (Perplexity/YMYL gates).
- Collect labels as we go: **every time a human overrules a gate, that is a labelled example.** Free data; we currently throw it away.
- Report **Cohen's κ**, never raw agreement (§2.4). Target κ ≥ 0.6 before a gate is trusted to block unattended; below that it is advisory.
- **Note for honesty:** the current `quality.rating` enum (`world-class`/`strong`/`average`/`weak`/`unacceptable`) is exactly the 1–5 Likert Hamel warns against. Recommendation: **keep it as diagnostic colour, never let it gate.** The binary `verdict` + `blocking_issues` gate. This is already how the script behaves — make it explicit so nobody later builds a threshold on "≥ strong".

### 7.10 The regression corpus — the acid test, and the answer to "how do we know the gate works?"
**A gate that cannot catch a known failure is not a gate.** We have a real, quarantined failure sitting in the repo: `docs/whatisayurveda-research/demand.md` + `demand-raw.json`.

`audits/regression/` holds golden fixtures with expected verdicts:

| Fixture | Gate | Expected |
|---|---|---|
| `dataforseo-demand-2026-07-15/` (the real failure) | `G3-PRE` | **FAIL** — seed provenance + locale + zeros |
| same | `G3-FACT` | **FAIL** — shilajit/turmeric contradicted |
| same | `G3-PROC` | **FAIL** — order violations, unverified sums |
| `fabricated-citations/` (real doc, plausible dead URLs) | `G6-CITE` | **FAIL** — proves we don't have authority bias |
| `clean-monograph/` (physician-approved) | `G6-FACT` | **PASS** — proves we don't cry wolf |
| `thin-but-fluent/` (well-written, zero information gain) | `G6-PROC` | **FAIL** — the 34%-recall under-specification blind spot (§2.3) |

Runs **monthly**, and on **any** change to `scripts/audit-*.mjs` or `docs/process/rubrics/**`. This is the mechanical detector for gate-weakening (§10.4): you cannot loosen a rubric without a fixture going green, and a fixture going green is a CI failure.

---

## 8 · EVIDENCE PERSISTENCE — making "prove every gate ran" mechanical

### 8.1 Paths
```
audits/
  <site>/
    S3-demand/
      G3-PRE_2026-07-15-181208-IST.json
      G3-FACT_2026-07-15-181545-IST.json
      G3-PROC_2026-07-15-182011-IST.json
    S6-content/
      ...
    LEDGER.jsonl          ← append-only, one line per gate run, never rewritten
  regression/             ← §7.10 golden fixtures
```
Existing files (`audits/gpt5-audit_whatisayurveda-demand_2026-07-15.json`) migrate; the flat naming does not survive multi-site.

### 8.2 Verdict envelope — the verdict JSON is wrapped, not replaced

```jsonc
{
  "gate_id": "G3-FACT",
  "stage": "S3",
  "site": "whatisayurveda.com",
  "run_at": "2026-07-15 18:15:45 IST",
  "git_commit": "842c21e…",
  "artifacts": [
    { "path": "docs/whatisayurveda-research/demand.md",
      "sha256": "9f2c…", "bytes": 48213 }
  ],
  "rubric": { "path": "docs/process/rubrics/G3-FACT.md", "sha256": "1a77…" },
  "auditor": {
    "script": "scripts/audit-perplexity.mjs",
    "model_requested": "sonar-pro",
    "model_resolved": "sonar-pro-2026-05",   // ← from the API, not the alias
    "temperature": 0
  },
  "usage": { "prompt_tokens": 38221, "completion_tokens": 9110,
             "cost_usd_estimated": 0.25 },
  "exit_code": 2,
  "verdict": "FAIL",
  "harness_overrides": ["health_claim_unverifiable_forces_fail"],
  "verdict_body": { /* the auditor's strict-JSON, verbatim, unedited */ }
}
```

`harness_overrides` records where §7.3 turned a stated PASS into a FAIL — so we can later measure *how often the model rubber-stamped and the harness caught it*. That number is itself a finding about the auditor.

### 8.3 ★ The hash binding — the idea that makes the S9 walk real

**A PASS is bound to the exact bytes it judged.**

`G9-PRE` recomputes the SHA-256 of every artifact named in every prior verdict. Any mismatch = the artifact changed after it was approved = **that gate is STALE and the site does not ship** until it is re-run.

This converts Abilash's *"re-walk the ENTIRE matrix and prove every step with machine evidence"* from an act of diligence — which decays under deadline pressure, every time — into a script that exits 2. It also closes the obvious cheat: pass the gate on a clean artifact, then edit the artifact.

`LEDGER.jsonl` gives the walk a second property: **it makes gate-shopping visible.** Five `G3-PROC` runs in twenty minutes with five different hashes is a legible pattern, and §6.7 points GPT-5 at it deliberately.

---

## 9 · COST & LATENCY DISCIPLINE

> *"I don't want to burn millions of tokens to find out we did very average work."*

### 9.1 The rule that saves the most: don't audit trivia
L0 machine preconditions run first and cost nothing. A missing artifact, a missing column, a dead URL, a `0` volume — all die before the API call. §3's table shows most blocking gates never call an LLM at all.

### 9.2 Tier by consequence and context length — *not* by convenience
As-reported prices (verify at runtime, §0 gap 4): [OpenAI pricing](https://developers.openai.com/api/docs/pricing) **[S]** — GPT-5.5 $5/$30 per 1M in/out; GPT-5.4 $2.50/$15; 5.4-mini $0.75/$4.50; 5.4-nano $0.20/$1.25; **cached input at 10%**; **Batch at 50%**. [Perplexity pricing](https://docs.perplexity.ai/docs/getting-started/pricing) **[S]** — sonar $1/$1; sonar-pro $3/$15; sonar-reasoning-pro $2/$8; plus a per-1K-request search fee ($5–$14 by context size).

| Gate | Tier | Why |
|---|---|---|
| `G3-PROC`, `G5-PROC`, `G6-PROC`, `G9-PROC` | **top tier** | Blocking, long context, expensive to be wrong |
| `G2-PROC`, `G4-PROC` | mid tier | Blocking but shorter artifacts |
| `G7-ADV`, `G11-ADV` | low tier / **Batch (50%)** | Advisory, latency-tolerant |
| `G3-FACT`, `G6-FACT` | `sonar-pro` | Needs real retrieval quality |
| `G0-FACT` | `sonar` | Cheap sanity check |

**Do not cheap out on long-context gates.** [Thakur et al.](https://arxiv.org/html/2406.12624v1) **[P]**: *"smaller judges degrade substantially with longer, more detailed prompts"* and are more lenient. Our gate prompts are ~40K tokens of doctrine + artifact. A nano model on `G5-PROC` would be worse than no gate — it would emit a PASS.

### 9.3 Prompt caching — free money, and we already have the ordering right
Cached input bills at ~10% **[S]**. Our stable prefix (SYSTEM + CLAUDE.md + pipeline doctrine + rubric) is ~30K tokens and identical across every gate run; only the artifact varies. `audit-gpt.mjs` already builds `user` as context-then-artifact — **keep that order and never interleave**, since a cache prefix breaks at the first differing byte. **[D]** At $5/1M vs $0.50/1M cached, a 30K stable prefix costs $0.15 uncached vs $0.015 cached — ~$0.135 saved per run, ~90% of the input bill on a run whose variable part is small.

### 9.4 Never audit 3,400 pages individually
For whatisayurveda: audit the **template** and a **stratified sample** (highest-demand, highest-YMYL-risk, plus random). Machine-check the rest (schema, citations resolve, banned words, reviewer present). **[D]** 3,400 pages × ~$0.15 ≈ **$510 per full sweep**, per rerun, for a check that is ~90% redundant because the pages share templates. Template + 40-page sample ≈ **$6**. The saving is not from a cheaper model; it is from not asking a stupid question 3,360 times.

### 9.5 What the whole thing costs
**[D]** From §3's column: ~$5–6 of LLM gates per site pass, ~$12–15 including a realistic two rounds of fix-and-rerun. Against the alternative — a 3,400-page build on 11×-understated demand — this is not a cost conversation. **The expensive thing is not the auditor. The expensive thing is being wrong for three months.**

### 9.6 Latency
L0 is instant. Blocking LLM gates are ~1–3 min — fine, they run at stage boundaries, not per commit. Advisory sweeps go to Batch (50%, slower) and never block a human. **Only the gates listed BLOCK in §3 may block.**

---

## 10 · FAILURE PROTOCOL

### 10.1 A FAIL is `exit 2` and it stops the stage
Both scripts already do this. Correct. The stage does not advance; no downstream gate may run; CI is red.

### 10.2 ★ The fix-and-rerun loop is stateless — never argue with an auditor
Given §1.2's numbers (32–86% of answers revised under challenge; Claude 1.3 wrongly conceding **98%** of the time), a conversation with a judge is a way to obtain the verdict you want.

```
FAIL
 ├─ 1. Read the findings. Do not reply to them. There is nobody to reply to.
 ├─ 2. Fix the ARTIFACT. Never the rubric. Never the prompt. Never the threshold.
 ├─ 3. Re-run the gate from a FRESH process — no prior context, no prior verdict,
 │     no "you said X last time", no "note that we fixed Y".
 └─ 4. New verdict, new hash, new ledger line. The old FAIL is never deleted.
       The audit trail is the point.
```

**Max 3 cycles on the same finding.** A third consecutive FAIL means we are guessing at what the auditor wants — which is how a team ends up writing to please a model. Stop, escalate (§10.3).

### 10.3 Escalation
- **3rd FAIL on one finding** → stop, append to `QUESTIONS.md` (timestamped to the second, IST), move to the next queued task per the Unattended Rule. Do not grind tokens.
- **Agent disagrees with a verdict** → it may commit a **rebuttal file** stating the disagreement with evidence. It may **not** flip the verdict, and it may **not** proceed. Abilash rules. The rebuttal is a durable artifact; a chat argument is not.
- **The two auditors disagree** → automatic FAIL, escalate. Never average, never vote (§5).
- **Auditor unavailable** (no key, API down) → `exit 1` = **harness error = the gate did not run = the stage does not advance.** A gate that cannot run is never a gate that passed. No fallback model, no skip, no "we'll do it after launch".

### 10.4 ★ A gate is NEVER weakened to make it pass
Doctrine (g), made mechanical. Distinguish honestly:

- **Fixing a broken gate** (crashes, malformed JSON, wrong file path, an assertion that is factually incorrect) — legitimate. Requires: the regression corpus (§7.10) still fully green.
- **Weakening a gate** (loosening a threshold, deleting an assertion, softening a rubric, adding an exemption, downgrading blocking→advisory, switching to a cheaper model on a blocking gate) — **this is a doctrine change, not a code change.**

Procedure for any diff touching `scripts/audit-*.mjs` or `docs/process/rubrics/**`:
1. Regression corpus runs; **every fixture must still produce its expected verdict**. A fixture flipping FAIL→PASS blocks the PR.
2. The PR states, in words, which rule is being changed and why the *cause* could not be fixed instead.
3. **Abilash approves.** Not the agent. Not a reviewer. Not "it was blocking the sprint".
4. Ratified in `DECISIONS.md` with an IST timestamp.

The tell to watch for, in ourselves: *"the auditor is being pedantic"* is what it feels like from the inside every single time the auditor is right.

---

## 11 · WHERE A HUMAN IS IRREPLACEABLE

Being honest here is the whole value of this section. The commission asked for it directly.

### 11.1 Dr. Deepu John — clinical sign-off. Not negotiable, not routable around.
**Why no AI may sign this off, stated plainly:**
- Our fact-grounding auditor is **wrong ~37% of the time** and is **more confident when premium**, and *"never declined to provide an answer"* was measured of a peer tool [[CJR]](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php) **[P]**.
- Judges are **lenient when their criteria are not fully aligned** [[Thakur]](https://arxiv.org/html/2406.12624v1) **[P]** — and "is this dose safe in pregnancy" is exactly where criteria are hardest to align.
- Judges have **34% recall on under-specification** **[P]** — the exact shape of a dangerous medical page: not false, just missing the contraindication.
- Google's own standard for health content asks *"Does the content have any easily-verified factual errors?"* and whether it shows *"clear sourcing, evidence of the expertise involved"* [[Google, Creating helpful content]](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) **[P]**; YMYL medical content is expected to involve licensed practitioners **[S]**.
- **And the real reason, which has nothing to do with any of the above: accountability cannot be delegated to a process that cannot be held accountable.** If a reader is harmed, "the model marked it SUPPORTED" is not an answer to a regulator, a court, or a family. A named physician taking responsibility is not a bureaucratic step we optimise away — it is the only thing on the page that is actually load-bearing.

**What the AI gates legitimately do for him:** cut the packet down. `G6-PRE` + `G6-CITE` + `G6-FACT` remove the junk, resolve the sources, and hand him a claim-by-claim sheet with citations and flags. That is a genuine multiplier on scarce physician time — and it is the *entire* extent of the claim we should make for it.

### 11.2 Abilash — money, commercials, and go-live
"Will it sell?" (`G4-HUMAN`), prices, offers, discounts, preview approval (`G9-HUMAN`), and every ruling in §10.4. GPT-5 can tell us whether the *reasoning* about selling is coherent. It cannot know what Kairali can deliver, what a treatment is worth, or what the group is willing to promise.

### 11.3 Legal / register-lock language
The KTAHV clinical lock exists because of a **GST SCN** — it is a legal exposure wearing a style-guide costume. `G1-PRE`/`G6-PRE` grep the banned list (which is genuinely mechanical and should absolutely be automated). But a *novel* phrasing that is legally equivalent to "resort" without using the word is a legal judgement. No gate here. Escalate.

### 11.4 Production, DNS, publishing
Unchanged and correct: DNS flips are human (Abilash/Ambuj). WP publication is Deepu. Shopify admin is human-only (doctrine (j)–(s)); the agent is read-only. **PDP URL changes flag to Vikash before they happen** — live ads point at them, and no auditor can know that from the repo.

### 11.5 The general principle
**An AI auditor can prove a thing is wrong. It cannot prove a thing is right.**
A FAIL is strong evidence (something specific and checkable is broken). A PASS is weak evidence — it means *no configured check fired*, which given measured leniency is not the same as "this is good". This asymmetry should be printed on the gate output, because the temptation to read PASS as certification will be constant and permanent:

> `PASS = no configured check fired on these bytes. It is not a certification of quality, truth, or safety.`

---

## 12 · HARNESS CHANGES REQUIRED (concrete, ordered by value)

1. **`G3-PRE` and the L0 assertion library** — the four regexes in §6.1. **Build this first.** It is the cheapest and it is the one that would have prevented the failure that caused this commission.
2. **`--gate <id>`** → loads `docs/process/rubrics/<id>.md`, hashes it into the verdict, writes to `audits/<site>/<stage>/`, appends to `LEDGER.jsonl`.
3. **Harness-side FAIL overrides (§7.3)** — `context_sufficient === false` ⇒ exit 2; any blocking finding ⇒ exit 2 regardless of stated verdict. **This is a live bug.**
4. **Artifact + rubric SHA-256 in every verdict** (§8.2) — the precondition for §8.3.
5. **`G9-PRE` ledger walker** — recompute hashes, fail on stale/missing verdicts. This is what makes the pre-launch walk real.
6. **`scripts/resolve-citations.mjs`** — HTTP-resolve every URL in the artifact and in Perplexity's returned citations; grep the quoted string; unresolvable = FAIL (§7.5).
7. **Record `model_resolved` from the API response, not the requested alias** (§7.8). Related and worth verifying: `audit-gpt.mjs` defaults to `--model gpt-5`, but the current [OpenAI pricing page](https://developers.openai.com/api/docs/pricing) **[S]** lists GPT-5.5 / 5.4 / 5.4-mini / 5.4-nano and **no standalone `gpt-5`**. The alias evidently still resolves (our audit ran), but *we do not know what it resolves to* — which is precisely the drift this item exists to catch. **Pin it explicitly.**
8. **`audits/**` banned from `--context`/`--artifact`** (§7.2) — hard check.
9. **`scripts/audit-regression.mjs`** + fixtures (§7.10); wire to CI on any `audit-*.mjs` or rubric diff.
10. **κ tracking** (§7.9) — log every human override as a labelled example.

---

## 13 · DOES THIS CATCH THE DATAFORSEO FAILURE? (the design test case)

Walked honestly, in order, with what each layer costs:

| # | Check | Layer | Result | Cost |
|---|---|---|---|---|
| 1 | `turmeric curcumin` ∈ S2 audience corpus? | `G3-PRE` L0 | **FAIL — stage stops here** | **$0** |
| 2 | India rows for `hi-Deva` / Hinglish? | `G3-PRE` L0 | FAIL | $0 |
| 3 | `shilajit US = 0` while seed ∈ corpus? | `G3-PRE` L0 | FAIL | $0 |
| 4 | Cluster totals from unverified rows? | `G3-PRE` L0 | FAIL | $0 |
| 5 | Is turmeric US really 27.1K? | `G3-FACT` L1 | FAIL — real ≈ 301K, cited | ~$0.10 |
| 6 | Is `shilajit US = 0` plausible? | `G3-FACT` L1 | FAIL — data fault named | — |
| 7 | Were prerequisites (ontology, S2 corpus) real? | `G3-PROC` L2 | FAIL — order violations | ~$0.70 |
| 8 | Reported to the Director as fact? | `G3-PROC` L2 | FAIL — blocking | — |
| 9 | Would totals ever reach Abilash? | — | **No. Stage never exits.** | — |

**It dies at step 1, for free, before any model is called.** Steps 5–8 are the backstop, and GPT-5 has *already demonstrated* it catches this class ([the real verdict](../../audits/gpt5-audit_whatisayurveda-demand_2026-07-15.json), `"verdict": "FAIL"`).

**But the honest caveat, and it must not be buried:** this walkthrough is a *design* claim for L0 (which does not exist yet) and a *demonstrated* claim only for L2 (which ran). Until `G3-PRE` is built and the regression fixture goes red on demand, **the table above is a promise, not evidence.** Per doctrine (f), it is listed as unverified in §16.

---

## 14 · OPEN QUESTIONS FOR ABILASH

1. **κ threshold to trust a gate unattended.** Proposal: κ ≥ 0.6 blocks, below is advisory. Needs labelled data we do not yet have. Do we block on gates we have not validated? **My recommendation: yes** — an unvalidated blocking gate is still better than none, and leniency means it will under-block, not over-block.
2. **Who is the principal domain expert for `G6-PROC` quality** (not clinical — that is Dr. Deepu John)? Hamel's method needs exactly one. Is that Abilash?
3. **Zero-volume waiver (§6.1 rule 3):** a genuine zero must be overridable by a named human. Who?
4. **Reddit evidence (§0 gap 1):** blocked to our tooling. Want it? It needs a human paste or a different fetch path.
5. **Sample size at §9.4** for 3,400 pages — 40 is my judgement, not a statistic. Want a real confidence calculation?
6. **The `gpt-5` alias (§12.7)** may not be a listed model. Pin to an explicit snapshot?

---

## 15 · SOURCE INDEX

**Academic — LLM-as-judge reliability and bias**
- Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, NeurIPS 2023 — https://arxiv.org/abs/2306.05685 · read via https://ar5iv.labs.arxiv.org/html/2306.05685 **[P]**
- Panickssery, Bowman & Feng, *LLM Evaluators Recognize and Favor Their Own Generations*, NeurIPS 2024 — https://arxiv.org/abs/2404.13076 **[P] — abstract re-fetched and verified (§16.1)**
- Sharma et al. (Anthropic), *Towards Understanding Sycophancy in Language Models* — https://arxiv.org/abs/2310.13548 **[S] — NOT re-verified; the 32–86% and 98% figures remain summariser-reported leads**
- Wang et al., *Large Language Models are not Fair Evaluators*, ACL 2024 — https://arxiv.org/abs/2305.17926 **[P] — abstract re-fetched and verified (§16.1)**
- Ye et al., *Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge* (CALM) — https://arxiv.org/html/2410.02736v1 **[P]**
- Thakur et al., *Judging the Judges: Evaluating Alignment and Vulnerabilities in LLMs-as-Judges* — https://arxiv.org/html/2406.12624v1 **[P]**
- Stureborg et al., *Large Language Models are Inconsistent and Biased Evaluators* — https://arxiv.org/abs/2405.01724 **[R] — not fetched; nothing here depends on it**

**Academic — search-grounded fact-checking**
- Wei et al. (Google DeepMind), *Long-form factuality in large language models* (SAFE) — https://arxiv.org/abs/2403.18802 **[P] — abstract re-fetched and verified (§16.1); 72% / ~16k / 76% / >20× all exact**

**Journalism / independent testing**
- Jaźwińska & Chandrasekar, *AI Search Has a Citation Problem*, Tow Center / CJR, Mar 2025 — https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php **[P]**

**Named practitioners**
- Hamel Husain, *Creating a LLM-as-a-Judge That Drives Business Results* — https://hamel.dev/blog/posts/llm-judge/ **[P]**
- Eugene Yan, *Evaluating the Effectiveness of LLM-Evaluators* — https://eugeneyan.com/writing/llm-evaluators/ **[S]**

**Official / vendor**
- Google, *Creating helpful, reliable, people-first content* — https://developers.google.com/search/docs/fundamentals/creating-helpful-content **[P]**
- Google, *Search Quality Rater Guidelines* — https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf **[S] — could not parse (§0 gap 2)**
- OpenAI API pricing — https://developers.openai.com/api/docs/pricing **[S]**
- Perplexity API pricing — https://docs.perplexity.ai/docs/getting-started/pricing **[S]**

**In-repo**
- `scripts/audit-gpt.mjs`, `scripts/audit-perplexity.mjs`, `audits/gpt5-audit_whatisayurveda-demand_2026-07-15.json`, `docs/whatisayurveda-research/demand.md` (quarantined failure / regression fixture), `docs/process/research-practitioner-sequencing.md` (S0–S11 spine)

**Prompt-injection screen (doctrine (r)):** every page above was treated as DATA. None contained instructions directed at an agent. Nothing in this document was authored at the direction of fetched content.

---

## 16 · CHECKER PASS (doctrine (f))

Re-read the instruction; diffed claim against machine evidence.

### 16.1 Independent citation re-verification pass — 2026-07-15, second sitting

The document's own §2.5 warns that fabricated citations score *better* than honest ones, and §7.5 forbids a model from being the thing that validates a citation. A document making that argument while resting on unverified **[S]** leads would be self-refuting. So every load-bearing figure was re-fetched from the primary source and compared to what this document claims.

**Result: zero fabrications, zero misattributions. Six of six sources confirmed; one claim sharpened.**

| Claim as written | Source | Outcome |
|---|---|---|
| SAFE: 72% human agreement · ~16k facts · 76% on disagreements · >20× cheaper | arXiv:2403.18802 | ✓ **all four exact** — upgraded **[S] → [P]** |
| MT-Bench: 85% vs 81% human-human · 65.0% swap consistency (30.0/5.0) · verbosity 91.3% vs 8.7% · self-enhancement 10%/25% · 75% reasonable / 34% vote change | ar5iv 2306.05685 | ✓ **all exact**, confirms **[P]** |
| Leniency P+ *"significantly higher than 0.50"* · κ 84 / 79 vs human 96 | arXiv:2406.12624 | ✓ **quotes verbatim**, confirms **[P]** |
| Perplexity 37% wrong · 1,600 queries / 8 tools · >60% · Grok 154/200 error pages · premium-confidence paradox | CJR Tow Center | ✓ **all exact**, confirms **[P]** |
| Self-recognition ↔ self-preference is *linear* | arXiv:2404.13076 | ✓ verified verbatim — upgraded **[S] → [P]** |
| Vicuna-13B beats ChatGPT on 66/80 by reordering | arXiv:2305.17926 | ✓ verified — upgraded **[S] → [P]**; evaluator was ChatGPT, now stated |
| "98% recall on incorrect entity / 34% under-specification" | arXiv:2406.12624 Table 2 | ✓ **true, and sharpened** — GPT-4 Turbo 98.3%/33.9%, Llama-3 70B 96.6%/23.3%. **A summarising fetch returned "~97%, both judges" — false. Table 2 vindicated the original.** → §7.5.1 |

**The pass produced a real finding, not just a tick-list:** the last row is a live, in-session instance of the exact defect this document is designed to stop — a plausible, close, confidently-wrong number from a model standing between us and a source, which nearly got committed *as a correction*. It is written up in **§7.5.1** and converts §12.6 from "resolve citations" into a hard requirement that the resolver read **raw bytes and grep literal strings**, never ask a model whether a page supports a claim.

**Still NOT verified, and deliberately still labelled [S]:** Sharma et al. sycophancy figures (32–86%, 98%); **all OpenAI/Perplexity pricing**; the YMYL/rater-guidelines claims; Eugene Yan's κ commentary. Nothing structural rests on them — §9's design requires the harness to record *actual* billed usage rather than trust the quoted prices — but they are leads, not citations, and must not be quoted onward as fact.

### 16.2 Original checker pass

**Verified:**
- `scripts/audit-gpt.mjs` read in full — GPT-5, strict JSON, exit 2 on FAIL, context-then-artifact ordering, `max_completion_tokens: 16000`. ✓
- `scripts/audit-perplexity.mjs` read in full — `temperature: 0`, SAFE-shaped claim decomposition, exit 2 on FAIL. ✓
- The real audit returns `"verdict": "FAIL"` **and** `"context_sufficient": false` (grep output in-session) — the basis for the §7.3 harness bug. ✓
- Regression fixtures `docs/whatisayurveda-research/demand.md` + `demand-raw.json` exist (`ls`). ✓
- S0–S11 spine read from `research-practitioner-sequencing.md` §5. ✓
- All **[P]** numbers quoted from content I fetched this session. ✓

**Unverified — stated as unverified:**
- **§13's table is a design claim, not a test result.** `G3-PRE` does not exist. Only the L2 GPT-5 catch is demonstrated.
- **No gate in this document has been validated against Abilash's or Dr. Deepu John's actual judgement.** κ is unmeasured. Every "this gate will catch X" is an intention (§0 gap 5).
- Cost figures are **[D]** arithmetic over **[S]** vendor prices read through a summarising layer. Directionally right; not billing.
- **[S]** items were read through a summarising fetch, not raw — including all pricing and the YMYL/rater-guidelines claims.
- Reddit practitioner evidence: **absent**, tool-blocked, not substituted (§0 gap 1).
- Whether `gpt-5` is a currently-listed model id: **unresolved** (§12.7).

**Scope:** only `docs/process/research-auditor-gates.md` was written. No git. Nothing outside `docs/process/`.

**Status:** RESEARCH + PROPOSED DESIGN. Gate assignments, blocking/advisory splits, κ thresholds, and §14 require Abilash's ratification before they bind.
