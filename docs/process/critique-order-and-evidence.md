# ADVERSARIAL REVIEW — ORDER + EVIDENCE

**Written 2026-07-15 19:24:43 IST · as of commit `a206791` on `feat/wia-content-engine-research`.**
**Target: `docs/process/MASTER_PIPELINE_DRAFT.md` v0.1 (written against `a6484b4`).**
**Angle: (1) is the ORDER real, with entry criteria that cannot be waved through? (2) is the EVIDENCE base real, or did the architect assert?**

> **Method note.** I re-fetched two load-bearing external sources rather than trusting the draft's `[P]`/`[S]` markers, and diffed the draft against the six sibling research files it was compiled from. Four of the eight findings below are **draft-vs-its-own-research diffs** — the research is right and the draft is wrong. That is the most important structural fact in this review, and it is F6.

---

## §A · VERIFICATION RESULTS — the citations I actually re-fetched

Stated first so the findings below are not read as blanket distrust. Both of the draft's most load-bearing external citations **check out**:

| Claim | Draft location | Verdict |
|---|---|---|
| NN/g — *"The IA comes first, the sitemap follows"* | §1.4, `S5` preamble | ✅ **REAL, correctly represented.** Verbatim section heading in *"Information Architecture vs. Sitemaps: What's the Difference?"* (Samhita Tankala, NN/g). Supporting quotes (*"IA is the foundation…"*, *"The IA is an abstraction, while the sitemap is an artifact"*) also present verbatim. **Abilash's sitemap call has a real authority behind it.** |
| GEO paper — Cite Sources **−30.3 @ rank-1 / +115.1 @ rank-5** | §1.3 D3, `S6`(f), §10.5, §13 #3 | ✅ **REAL, correctly represented.** Aggarwal et al., *GEO: Generative Engine Optimization*, KDD 2024. **Table 2**, *"Visibility changes through GEO methods for sources with different Rankings in Search Engine"*; Cite Sources row verbatim: `-30.3 | 2.5 | 20.4 | 15.5 | 115.1`. *(Sibling doc calls it Table 3; it is Table 2 in the v3 HTML — trivial.)* **D3 and the X-16 rank-calibration amendment are evidentially sound. Ratify them.** |

**No hallucinated citation was found among the sources I re-fetched.** The evidence failures below are of a different and more interesting class: **real research, correctly done, then degraded in transcription into the draft.**

---

## §B · FINDINGS — most severe first

### F1 🔴 `S6`(e) line 829 — the AEO stage's FIRST "DO" is the claim our own AEO research classified as PROVEN INEFFECTIVE and explicitly forbade us from claiming

**The draft, `S6`(e), first bullet — the lead instruction of the stage D3 calls the place where Abilash's "AEO first" instinct *"actually cashes out"*:**

> **"Answer-first is the strongest AI-citation separator (+32.8%)**, then E-E-A-T (+30.6%), Q&A formatting (+25.5%), section structure (+22.9%)."

**`research-aeo-geo-first.md` §122 — the file commissioned to settle exactly this question — grades that same claim:**

> **"Content structure / visual organisation / formatting** | **NULL. No reliable effect** across 252k trials: *'Formatting choices (Content Structure, Scattered Information) had no impact, suggesting LLMs parse content regardless of visual organization.'* Google (scoped to Google Search): *'For Google Search, you can ignore tactics like "chunking" content…'* | **A — proven ineffective** | ⚠️ **Keep answer-first writing — for HUMANS and for snippet extraction. Never claim it as a citation lever.**"

And §142, the resolution, verbatim:

> **"we keep answer-first, one-idea-per-section writing … but for the honest reason: it serves humans, featured snippets, and our own reviewers. It is not an AEO lever and will not be scored as one.** This is precisely the kind of folklore-vs-evidence call this stage exists to make."

**The draft calls it "the strongest AI-citation separator."** That is the exact sentence the research forbade, in the exact stage the research was written for.

**Where do +32.8 / +30.6 / +25.5 / +22.9 come from?** Nowhere. `grep -rn "32\.8"` across `docs/process/` returns **two hits: the draft, and `inventory-existing-rules.md:343` (SP-15)** — a legacy repo rule the register itself marks **"❌ GAP #12"**. The numbers appear in **no research file, carry no source, no n, no study, no URL.** They are four significant-looking percentages with nothing under them — **the DataForSEO error class, in the document written to prevent it, reported as the lead instruction of a stage.**

**And the research file predicted this failure by name** (`research-aeo-geo-first.md` §26, verbatim):

> *"if 'AEO first' is implemented as 'add FAQ schema, chunk the content, ship an llms.txt, write answer-first paragraphs' — we will have moved a ritual to the front of the pipeline and called it strategy. **That is exactly the failure mode Abilash is trying to prevent.**"*

`S6`(e)+(d) is: answer-first paragraphs, Q&A formatting, section structure, schema-per-template. **The draft built the ritual the research named.**

> **Tell:** the draft absorbed *one* of the research's null findings into its DON'T table — *"DON'T sell schema internally as GEO. Schema is NOT a proven AI-citation lever"* — and dropped the twin null finding (structure/formatting), promoting it instead to the top of the DO list. **The DON'T list got the research. The DO list got the folklore.** See F6.

**Fix:** delete the four percentages. Restate as the research ruled: *keep answer-first for humans and snippets; it is not an AEO lever and is never scored as one.* Any surviving number cites a study or dies.

---

### F2 🔴 §1.3 D2 — the quantitative proof for the single most important reordering is fabricated arithmetic, forbidden by the source's authors AND by our own research file

**The draft, §1.3 D2 (the departure that moves Abilash's steps 9/10/12/13/14 before the sitemap — the pipeline's central structural claim):**

> "**MECLABS [S]** — **quantitatively**: motivation is the **4× term** and anxiety a **−2 term** in the Conversion Sequence Heuristic. Building before the audience is understood **loses 4m + 3v = 7 of 11 weighted points, unrecoverable by any later CRO.**"

And §1.4 doubles it: *"Needs/desires/fears before build — correct, and **quantitatively so** (MECLABS [S])."*

**`research-audience-and-psychology.md` §172, verbatim:**

> "MECLABS are explicit that it **'is not an equation to solve. Rather, it is a heuristic, or thought tool'** (ibid.) — **we cite the weights, not a false arithmetic.**"

**The draft performs the false arithmetic its own source file explicitly refused, and labels the result "quantitatively."** The heuristic's authors say it is not an equation; our researcher recorded that and drew the line; the architect crossed it.

**The arithmetic is also incoherent on its own terms — three separate defects:**
1. **`4m + 3v = 7` silently sets m = v = 1.** m and v are the *variables*. The draft substitutes unity without saying so and reports the coefficients as if they were the score.
2. **The denominator 11 (= 4+3+2+2) counts `−2a` as `+2`.** A negative term is being summed into a positive total to manufacture a "of 11" fraction.
3. **"unrecoverable by any later CRO" is invented.** Nothing in the heuristic says so, and it is false on the model's own reading: i, f and a are page properties you can change later. m is the term you cannot — which is a *weaker and true* claim that would have supported D2 perfectly well.

**This matters beyond pedantry.** D2 is the reordering Abilash is most likely to challenge (it moves five of his numbered steps). Its "quantitative" leg is the one an auditor will pull. `S3`(f) K8 forbids precisely this: ***"DON'T ship a blended score with invented weights — that is a new authoritative-looking number with nothing under it."***

**Fix:** D2 survives without it. Delete the arithmetic; keep the qualitative reading the research file already wrote: *"Motivation (4) is the heaviest term — and motivation is a property of the visitor, not the page. You cannot write it; you can only match it."* That is the argument, it is honest, and it is stronger.

---

### F3 🔴 §0.2 / `S9`(d)2 / `G9-PRE` — a verdict JSON is hand-writable. Nothing binds a PASS to an execution. The mechanism assigned to catch failure #9 is defeated by failure #9

**The stage contract (§0.2):** *"A stage is ENTERED only when the previous stage's exit evidence exists as a **committed artifact**."*
**The matrix walk (`S9`(d)2), called "the idea that makes the walk real":** every verdict is bound to the **SHA-256 of the artifact it judged**; re-hash at S9; mismatch ⇒ gate VOID.
**`G9-PRE`:** *"every S0–S8 verdict exists, PASSed, and its artifact hash still matches."*

**The hash binds verdict → artifact. Nothing binds verdict → execution.** Forging a clean matrix walk requires no more than:

```json
{ "gate": "G3-PRE", "status": "PASS", "artifact_sha256": "<sha256sum keyword-map.json>" }
```

The hash is computable by anyone holding the artifact. `audits/<domain>/G*-verdict.json` has **no field for** the command that ran, its exit code, the CI run id/URL, the runner, or a signature. `scripts/matrix-walk.mjs` therefore cannot distinguish *"the gate ran and passed"* from *"an agent wrote a file saying so."*

**This is failure #9 exactly** — §0.5: *"Declared rules 'binding' in a .md file while enforcement was never built"* — **assigned to S9, and S9 is the stage that cannot detect it.** A JSON file asserting a gate ran is epistemically identical to a .md file asserting a rule binds. The draft's own SX DON'T states the standard and the verdict schema fails it: ***"DON'T let a .md file stand as evidence a rule ran… Gate verdict exists in `audits/` with a hash, or the rule did not run."*** A hash is not evidence of execution.

§11.3 states the correct principle and does not implement it: ***"Default-to-FAIL, enforced by the HARNESS, not the prompt — a prompt can be talked out of a verdict; an exit code cannot."*** **The exit code is never captured into the verdict.**

**Fix (cheap, and it is the difference between a proof and a ritual):** a verdict is only valid if emitted **by the enforcing command itself**, and carries `{command, argv, exit_code, started_at, finished_at, runner, ci_run_url, rubric_sha256, artifact_sha256}`. `matrix-walk.mjs` rejects any verdict lacking them, and any verdict whose git-blame author is a human/agent edit rather than a CI job. Without this, **§12.2 item #4 — "Answers Abilash's #1 ask" — does not answer it.**

---

### F4 🔴 `S11`(e) — the KPI directive reports numbers that contradict our own fetched source, drops the authors' twice-stated disclaimer, and converts an explicitly non-causal correlation into an instruction

**The draft, `S11`(e):**

> "**KPI shift: earn MENTIONS, not links.** Unlinked brand mentions correlate with AI visibility at **0.664 vs backlinks 0.218 (~3×)**; **YouTube mentions are the strongest single correlate (0.737)**; **~82% of citations are earned media.**"

**`research-aeo-geo-first.md` §62 — which actually fetched the Ahrefs 75k-brand study:**

> "**Spearman correlations with AI brand mentions:** YouTube mentions **~0.737** · branded web mentions **0.656–0.709** · branded anchors 0.511–0.628 · branded search volume 0.352–0.466 · Domain Rating 0.266–0.326 · **backlinks ~0.194** · site pages ~0.194. | **Correlational only — and the authors say so, twice.** Verbatim: *'Correlation isn't causation… We've spotted patterns between search metrics and AI mentions, but that doesn't mean improving these metrics will automatically boost your AI visibility.'* Obvious confound: big brands have more of everything. **Directionally useful, causally worthless.**"

And §120: *"**B — correlational only.** Real, but **not a site-build lever.** Belongs to PR/YouTube, not to this pipeline. **Do not promise it as a build outcome.**"

**Four defects in one bullet:**
1. **`backlinks 0.218` contradicts our own fetched figure of `~0.194`.** `grep` proves the provenance: 0.664 and 0.218 appear **only** in the draft and in `inventory-existing-rules.md:345` (SP-17, marked **"❌ GAP #17"**) — **not in the research file that read the study.** The draft copied the legacy repo rule and discarded the verified number.
2. **A range reported as a point estimate.** Researched: `0.656–0.709`. Draft: `0.664`.
3. **The disclaimer the authors stated twice, and our researcher captured verbatim, is gone.**
4. **"earn MENTIONS, not links" is a causal directive** built on a correlation the source disclaims and the research file rules is *"not a site-build lever… do not promise it as a build outcome."*

**Same mechanism as F1: where fresh research contradicts a legacy repo rule (SP-15, SP-17), the draft silently reproduced the legacy rule and dropped the refutation.** Two instances is a pattern, not a slip. **The research was commissioned to correct the repo; the draft re-imported the repo's errors on top of it.**

---

### F5 🔴 D3 is not delivered: `questions.json` never reaches `S5`. AEO is harvested early, consumed late — which is the defect D3 was written to fix

The brief asks whether AEO is *"genuinely EARLY research that SHAPES the build, or has it quietly become a late audit again."* **Mechanically: the latter.**

D3's promise: AEO is *"(a) the first thing that touches search at all — the question harvest at S3… (b) a binding design input at S6… (c) a gate at S9. **Early and binding.**"*

**Trace the artifact.** `grep -n "questions.json"` on the draft returns **exactly two hits**:
- line 546 — an `S3` deliverable
- line 803 — an `S6` input

**It is absent from `S5` in every position that could make it bind:**

| `S5` slot | Contains `questions.json`? |
|---|---|
| `S5`(c) Inputs | ❌ |
| `S5`(b) entry criteria **E1–E9** | ❌ (E1 requires only `keyword-map.json` + `validation.status == "PASS"`) |
| `G5-PRE` assertions | ❌ |
| `S5.3` — *"URL-OR-H2 ADJUDICATION (**the AEO decision**; the heart of S5)"* | ❌ — its four criteria are demand, SERP shape, linking need, unique claim. **A harvested question is not among them.** |

**So the harvest lands at `S6`, whose entry criterion is `G5` PASS — "sitemap frozen."** AEO's only remaining expression is wording inside pages whose existence, URL and scope are already committed. **That is D3's own stated defect** — *"citations, statistics and quotations are properties of how a page is written. You cannot audit them in afterwards; you can only rewrite"* — **reproduced one stage later.** "Early and binding" is, in the machine layer, "early and inert, then binding after the tree is frozen."

**Two corroborating breaks in the same seam:**

- **`K5`'s exit criterion is unevaluable at `K5`.** It reads: *"Every cluster with **≥1 planned page** has ≥1 harvested question."* **At S3 no pages are planned — pages are planned at S5.** The stage that fixes ordering contains an exit criterion that can only be evaluated two stages downstream. It will therefore be evaluated by nobody.
- **`K5`'s only gate reference is dangling.** `S3`(f) K5 says: *"Caught by: ⚠️ `G3-PRE` #6 — **check not yet specified**."* But `G3-PRE` #6 **is** specified — it is **ESTIMATE LABEL** (the X-21 "modelled estimate" string check). The AEO harvest points at a check that exists and does something else entirely. **AEO has zero machine enforcement anywhere before S9.**

**Fix:** add `questions.json` to `S5`(c); add **E10 — every cluster carries its harvested questions or an explicit `no-questions-found` with the captured empty response**; make a harvested question a **named input to the `S5.3` URL-or-H2 decision** (a cluster with real PAA/autocomplete demand is evidence *for* a URL; a cluster with none is evidence for an H2). Then AEO shapes architecture, which is what "early and binding" has to mean. Renumber the `G3-PRE` reference.

---

### F6 🔴 §0.4 — the evidence discipline binds ONLY the DON'T lists. The DO lists — which are what the agent actually executes — are exempt. This is the structural cause of F1 and F4

**§0.4, the DO/DON'T contract, in full rigour:**

> "Every DON'T is **concrete**, **cited** (an authority's documented failure or **[OURS]**), and **checkable by an auditor against an artifact**. **A DON'T with no check is a wish, marked ⚠️, and is an open question — not a rule.** The DON'T tables in this document are also the auditor rubrics."

**There is no counterpart sentence for DO.** Not one. And it shows — the DO lists carry precise, unmarked, unsourced statistics throughout:

| Location | Unmarked precise claim | Provenance on inspection |
|---|---|---|
| `S6`(e) | "+32.8% / +30.6% / +25.5% / +22.9%" | **None in repo.** SP-15, "GAP #12" (F1) |
| `S11`(e) | "0.664 vs 0.218 (~3×)", "0.737", "~82%" | **Contradicts our fetched source.** SP-17, "GAP #17" (F4) |
| `S11`(e) | "~25.7% fresher; 76.4%… within 30 days" | SP-19, marked **"GAP #13"**, no source |
| `S7`(e) | "~80% of traffic is mobile" | X-7, no source |
| `S2`(d) | "Level 4–5 market" | **INFERRED-FROM-SECONDARY** (F7) |
| §1.5 | "1× at S7 vs 30× at S10", *"proves this arithmetically"* | **Deque vendor blog, marked [S] by the research** |

The draft's own §0.4 rationale explains why this is fatal: *"A DO list is graded on whether you **did** something; an agent can satisfy it completely and still be catastrophically wrong."* **True — and the draft's response was to harden the DON'T list and leave the DO list ungoverned.** But the DO list is the **instruction set**. The DON'T list is the **audit set**. **We hardened what the auditor reads and left unsourced folklore in what the agent executes** — and the auditor's rubric contains no assertion that would catch a bad DO, because the rubrics *are* the DON'T tables.

**Fix:** extend §0.4 verbatim to DO: *every DO carries a source marker; every statistic in a DO carries a source URL, an n, and a date; a DO with a number and no source is a wish, marked ⚠️, and is an open question — not a rule.* Then run it over every stage. On the table above that is a same-day pass and it deletes ~6 fabricated-looking numbers before Abilash ever reads one.

---

### F7 🟠 `S2`(d) line 416 — a self-flagged UNVERIFIED judgement was promoted to an unqualified finding, and its blocking escalation was lost in transcription

**`research-audience-and-psychology.md` §603 and §724 — the researcher's own escalation, unambiguous:**

> "**Schwartz is cited entirely from secondary blogs — and the sophistication levels are where they disagree.** *Breakthrough Advertising* (1966) is not legitimately online. The **awareness ladder** is safe… **The sophistication levels are not**: our L5 reading and an alternative retrieved reading **are different instructions**, and §1.2 scores DACH/France Ayurveda as **L4–5** — a judgement that directly drives whether those sites lead with mechanism or with identification. **Marked `INFERRED-FROM-SECONDARY`.** → QUESTIONS.md: **buy the primary text before any site's sophistication score is treated as final.** **Four blogs agreeing is not four sources; it may be one source copied four times.**"

**The draft, `S2`(d) line 416 — no marker, no caveat, no hedge:**

> "**The awareness × sophistication finding that matters most for us:** Ayurveda in DACH and France is a **Level 4–5** market… **Plain claims ('authentic', 'traditional', 'holistic') are dead on arrival there** — lead with **mechanism**. India domestic (M1/M2) is **Level 2–3**… **This is the single most useful lever this stage hands the design bar.**"

`grep -n "INFERRED-FROM-SECONDARY\|Breakthrough Advertising" MASTER_PIPELINE_DRAFT.md` → **zero hits.** **§13 OPEN DECISIONS — twelve items — does not contain it**, despite §13's header promising these go to QUESTIONS.md.

**So:** the one thing the researcher said must not be treated as final is the one thing the draft calls *"the single most useful lever."* It drives the DE/FR messaging strategy — mechanism vs identification — i.e. real money on our highest-value locales. **The escalation existed, was written down correctly, and evaporated in transcription.**

**Same defect, same stage — the Schwartz quote.** Draft §1.3 D2: *"**Schwartz [S]** — awareness stage *'determines everything — your headline, your opening hook, your proof points, your call to action.'*"* — presented in quotation marks as Schwartz's words. **`research-audience-and-psychology.md` §29 attributes that string to a [leadgen-economy blog summary](https://www.leadgen-economy.com/blog/five-stages-awareness-lead-generation/), not to Schwartz.** A blog's gloss, in quotation marks, under a 1966 author's name. (The phrase *"call to action"* as a listed item is anachronistic to *Breakthrough Advertising* on its face.)

**The bite:** `research-audience-and-psychology.md`'s **v1.1 changelog** records that the file audited itself, found **four defects of exactly this class** — *"true ideas wearing fabricated citations"* — fixed them, and instituted a rule: ***"a quotation mark is a machine-checkable assertion; unread is uncited."*** **The draft re-committed the defect the research file had just fixed in itself, one document downstream.**

**Fix:** restore `INFERRED-FROM-SECONDARY` on line 416; add "buy the primary text before any sophistication score is final" to §13 as a blocking item; attribute the quote to the blog or delete it.

---

### F8 🟠 `S3` `K7` — V1–V10 are declared "blocking, automated" with no enforcing command, no build-list line, and a self-reported PASS that `S5`'s E1 trusts on sight

**The draft, `K7`:** *"**DATA-INTEGRITY VALIDATION (V1–V10)** — **blocking, automated. No number leaves this stage un-validated.**"* Called *"the ten checks that make failure #2 impossible."*

**Automated by what?** No script is named. The only enforcing command in `G3`'s table is `scripts/keyword-gate.mjs`, and §12.2 item #1 scopes it explicitly to *"`G3-PRE`'s six assertions"* — **not V1–V10.** `grep -oE "scripts/[a-z0-9-]+\.mjs"` over the draft returns 15 scripts; **none is a V-suite runner.** **§12.2 — the document's own statement of what will be built — has no line for V1–V10.** The ten checks that "make failure #2 impossible" are unfunded prose. Per the draft's own SX DON'T, that means they will not run.

**Worse, the artifact they produce is self-reported and trusted downstream.** `S3`(g) emits `validation.json` with `status: PASS|FAIL`. `S5`'s entry criterion **E1** reads: `keyword-map.json` + **`validation.status == "PASS"`**. **E1 — the first condition of the anti-laundering gate — is a string comparison against a file the agent wrote.** An agent that ran nothing and emitted `{"status":"PASS"}` clears E1. (This is F3 at a second site; the same fix closes both.)

**Two more holes in the same gate, worth naming because §11.3 nominates the DataForSEO map as the regression corpus:**

- **`G3-PRE` #3's zero challenge is scoped to the wrong seed set.** It reads: *"∀ row where volume == 0 **AND seed ∈ S2 corpus** ⇒ FAIL."* **Our actual zeros were on ontology-class entities — shilajit, shatavari, gokshura** — herbs a verbatim audience-language corpus may well never quote. **The K1 ontology (621 drugs) is the bulk of the seed set and is exempt from the zero challenge as written.** Failure #2's zero half is therefore only conditionally caught. (Its *summing* half is caught by #5, and #1 catches the compound seeds — so §11.3's acid test still passes overall, on a different assertion than §0.5 credits.) **Fix: drop the `AND seed ∈ S2 corpus` conjunct.** A zero for any *sourced* seed is a tool/locale error until a named human waives it — which is what the prose already says.
- **`K1`–`K9`'s exits are prose in a table with no enforcing command** (ontology `source_url` resolution, K4 reproducibility, K6 raw capture, K9 schema validity). `G3-PRE`'s seven assertions do not cover them. These are the "hand-wavy prose an eager agent would wave through" — in the stage the pipeline was commissioned for.

---

## §C · SECONDARY FINDINGS

**S1 — `S6` contradicts itself, and the contradiction gates `S7`.** `G6-HUMAN` is **BLOCK**, *"not negotiable, not routable around"*, and `S6`(g) requires `physician-signoff.md` — **"named approving doctor per page."** `S7`'s entry criterion is `G6` PASS. **Read literally: no design work may begin on whatisayurveda until 3,400 pages each have a named approving physician** — the thing `S4` establishes is *"arithmetically false."* Meanwhile the same stage carries **MR-1 tiered trust**, whose whole point is that un-reviewed pages ship honestly without a badge. **Both cannot be true.** Either `G6-HUMAN` blocks only the *reviewed-tier* subset (and says so), or the tiered model is dead. Unresolved, this is the gate most likely to be waived — and a waived gate teaches the team that gates are theatre (§G1's own warning).

**S2 — `S0` is skippable by unevidenced assertion.** `S1`'s entry: *"`G0` PASS committed — **or an evidenced greenfield declaration**."* `S0`'s header defines the evidence (*no DNS record, no GSC property, no backlinks*) — but **no artifact path, no deliverable, no lint, no gate, and no §12.2 line exists for it.** The one stage skippable on an agent's say-so is the one the draft calls *"step zero"* and OP-3 calls *"the highest-ROI rule in the repo by demonstrated value"* — the rule that caught a **live gambling injection**. Give the declaration a file and a lint, or `S0` is optional in practice.

**S3 — the draft's `[P]` markers are inherited, not earned; the pipeline fails its own `G2-CITE`.** §0.4 defines **[P]** as *"primary-verified (**artifact fetched and read**)"*. §14 admits: *"**I did not re-fetch a single source.**"* Every `[P]` in the body therefore asserts a verification act that did not occur **in this document** — while `G2-CITE`/`G6-CITE` mandate exactly that act (HTTP-resolve + string-match) for every claim row in every artifact the pipeline governs. §14's disclosure is honest but sits 1,370 lines from the markers. **`docs/process/evidence/` contains captures for keyword-rigor only** — no captured artifact exists for the GEO paper, Halvorson, Cooper, Klein, NN/g or the Google docs. **Fix:** either re-mark inherited claims (`[P→S]`, or `[P:sibling]`), or run `cite-resolve.mjs` over this document first. **The pipeline document should be `G2-CITE`'s first customer.** *(F1, F4 and F7 are all what that gate would have caught.)*

**S4 — §1.5's "proves this arithmetically" rests on a vendor blog.** *"The compliance research proves this arithmetically… Accessibility alone: **1× at S7 vs 30× at S10**."* `research-compliance.md` §40 sources this to **Deque's own marketing blog**, honestly marked **[S]** — a vendor selling shift-left accessibility, restating the classic (and famously untraceable) defect-cost curve. The research marked it [S]; the draft escalated it to *"proves this arithmetically"* and hung §1.5 — *"The structural finding, stated once"* — on it. **The finding is right; the word "proves" is not.** Same escalation pattern as F1/F4: sibling docs mark honestly, the draft promotes.

---

## §D · WHAT I DID NOT VERIFY — stated as unverified

- **I re-fetched two sources** (NN/g IA-vs-sitemaps; GEO paper via `arxiv.org/html/2311.09735v3`). **Both check out.** The `arxiv.org/pdf` and `/html/…v5` routes 404'd or failed extraction; the v3 HTML resolved and carried Table 2 verbatim.
- **I did not re-fetch:** MT-Bench (70/30/15%), Perplexity's ~37% error rate, Cooper, Klein, Halvorson, Covert, Strategyzer, Moesta, Lumar, Baymard, Google's sitemap/faceted-nav docs, Deque, or the Ahrefs studies. **My F4 finding is a draft-vs-`research-aeo-geo-first.md` diff, not a claim about what Ahrefs says** — the research file read the study; I read the research file; **they disagree with the draft, and the draft agrees with an unsourced legacy rule.**
- **Two known scope-inflations I did not chase to ground truth, flagged as leads for a fact-grounding pass:** (i) **MT-Bench's 70/30/15%** is, to my recollection, GPT-4's grading failure rate **on math/reasoning questions specifically** — the draft (§11.3) presents it as *"GPT-4's grading failure rate"* flat and calls reference-guided grading *"the single highest-leverage finding in the auditor research."* (ii) **Perplexity's "~37% wrong"** traces to the CJR/Tow Center news-attribution study — an error rate for *identifying the source of news excerpts*, not for *fact-checking claims*, which is what we use it for. Both are **real numbers doing work outside the scope they were measured in.** → Perplexity `G*-FACT`, or a human.
- **I did not run any gate, script, build or auditor.** Consistent with the draft's own §14: **this critique is zero evidence that anything works.**
- **`origin/main` not consulted** (BS-1). Worktree `feat/wia-content-engine-research`, HEAD `a206791`; the draft was compiled against `a6484b4`. Drift assumed.

---

## §E · THE ONE-LINE VERDICT

**The order is right. The evidence discipline is one-sided, and the enforcement is forgeable.**

- **Order:** the spine (S0→S12) is sound and Abilash's two best calls — *sitemap as a stage*, *audience before keywords* — are correctly placed and, where I checked them, **correctly sourced** (NN/g verbatim). **The one order defect that matters is F5:** AEO is harvested at S3 and never reaches S5, so D3's "early and binding" is, mechanically, "early and inert." **Three lines of E-criteria fix it.**
- **Entry criteria:** structurally complete and mostly machine-shaped — **but every one of them terminates in a `PASS` string that an agent can type** (F3, F8). The hash binding proves the artifact did not change; **nothing proves the gate ran.** Until a verdict carries its exit code, §12.2 #4 does not answer Abilash's #1 ask.
- **Evidence:** **no hallucinated citation found** — the two load-bearing sources I re-fetched are real and correctly represented. **The failure is downstream of the research, not in it.** Four sibling files did rigorous, self-auditing work (`research-audience-and-psychology.md` v1.1 found four fabricated citations *in itself*; `research-aeo-geo-first.md` graded AEO tactics A/B/C and killed the folklore by name). **The draft then, at four separate sites, reproduced the legacy repo rule the research had just refuted and dropped the refutation** (F1, F4, F7, and S4). **`inventory-existing-rules.md`'s "GAP" rules — SP-15, SP-17, SP-19 — leaked into the draft's DO lists as bare, sourceless numbers, and §0.4 has no rule that would stop them** (F6).

> **The pipeline's own thesis, turned on the pipeline:** §11.1 says *"put the weight on the machine layer"* and §14 says *"this pipeline's rule-set should be **GENERATED from the repo**, not transcribed by hand."* **F1, F4 and F7 are precisely transcription failures — the research was right and the retyping was wrong.** The draft diagnosed its own defect in §14 and then shipped 1,548 hand-transcribed lines. **Extend §0.4 to the DO lists, run `cite-resolve.mjs` over this document, and make F5's three E-criteria real, before ratification.**

---

*Adversarial review · 2026-07-15 19:24:43 IST · `a206791` · order + evidence angle · 8 primary + 4 secondary findings · 2 external sources re-fetched, both sound.*
