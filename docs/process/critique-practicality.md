# ADVERSARIAL CRITIQUE — PRACTICALITY & ANTI-BUREAUCRACY

**2026-07-15 19:21:09 IST · as of commit `a206791` · target: `docs/process/MASTER_PIPELINE_DRAFT.md` v0.1**

**Angle:** a pipeline nobody can run is worse than none — it gets quietly skipped, and quiet skipping IS the failure mode being fixed. Can ONE agent + ONE non-technical Director execute this across ~28 sites? Which gates are load-bearing and which are theatre? And the acid test: does it actually catch the DataForSEO failure?

**Method note:** I verified script existence, the V1–V10 specification in `research-keyword-rigor.md`, and the build-list contents by command. I did not run any gate (none exist). Everything below cites a line or a command.

---

## ★ THE ACID TEST — VERDICT: 1 of 3 legs cleanly caught. This is a fatal finding.

The commission names one concrete failure with three legs. Traced against the draft as literally written:

| Leg | Stage | Check | Verdict |
|---|---|---|---|
| Compound fake seed `turmeric curcumin` (turmeric understated 11×) | S3 | `G3-PRE` #1 seed provenance | 🟡 **PARTIAL** — see F1, F3 |
| Implausible zeros (shilajit US=0) summed into cluster totals | S3 | `G3-PRE` #3 zero challenge + #5 no-blind-sums | 🔴 **NOT CAUGHT** — see F2 |
| India pulled English-only | S3 | `G3-PRE` #2 locale × script | ✅ **CAUGHT** (presence-only; see F2b) |

The draft's §0.5 acceptance table asserts all four keyword failures are "Caught at S3 by `G3-PRE`". **That claim does not survive reading `G3-PRE`'s own assertion text.** Details in F1–F3.

---

## F1 — 🔴 FATAL: the build list omits the two scripts that catch the failure, and invents a third that does not exist in any research

**§12.2 item #1** is `scripts/keyword-gate.mjs` — "`G3-PRE`'s six assertions… *Six greps. The whole commission.*"

`research-keyword-rigor.md` — the draft's own source — names **two** scripts as the implementation (line 25):

> 2. `scripts/keyword-validate.mjs` — **V1–V10**, exit 2 (§6)

and line 503:

> **No number may be reported, summed, ranked, or shown to Abilash until every check below has run and passed.** Implemented as `scripts/keyword-validate.mjs`, exit 2 on FAIL, wired into CI exactly like `audit-gpt.mjs`.

Verified by command:

```
$ grep -n "keyword-validate" docs/process/MASTER_PIPELINE_DRAFT.md
>>> NOT MENTIONED ANYWHERE IN THE DRAFT <<<

$ grep -n "seed-lint" docs/process/MASTER_PIPELINE_DRAFT.md
492:| **K3** | ... | `seed-lint` zero violations; every seed's `origin: ontology\|audience` resolves |
```

`seed-lint` appears **exactly once**, as an exit criterion at K3 — and never on the build list. `keyword-validate.mjs` appears **zero times**. `keyword-gate.mjs` appears in the research **zero times**; it is a name this draft invented.

**Why this is fatal, not clerical.** §13 open decision #11 asks Abilash to "**Approve the §12.2 build list and its order**", and §12.2 is the only ledger of what gets built. Approve it as written and what ships is six greps. The research's own verdict on the script that is missing (line ~530):

> **V1 would have prevented the entire incident**, independent of any knowledge of Ayurveda.

And `seed-lint` is the component that contains **Rule A / Rule B** — the mechanism that specifically names `turmeric curcumin` as "a parent welded to its constituent" (`research-keyword-rigor.md` §4.2, lines 297–320). `G3-PRE` #1 does not encode Rule B; it is a set-membership test. **The check that names our headline failure by its actual defect class is not on the list of things to build.**

**Fix:** §12.2 item #1 becomes `scripts/keyword-validate.mjs` (V1–V10) + `scripts/seed-lint.mjs` (Rule A/B), per the research's own §6 and §4.2. Either fold `keyword-gate.mjs` into them or delete the name — a third script covering the same ground with weaker checks is how the strong version quietly doesn't get built.

---

## F2 — 🔴 FATAL: `G3-PRE` #3 does not catch the shilajit zero. The gate has a hole exactly on the case it was written for.

**Draft, lines 566–577:**

```
3. ZERO CHALLENGE  ∀ row where volume == 0 AND seed ∈ S2 corpus ⇒ FAIL.
5. NO BLIND SUMS   No aggregate may be emitted unless every summand passed 1–4.
```

**K3 (line 492):** `seeds = K1 ∪ K2` — ontology ∪ audience.

`seed ∈ S2 corpus` is the **audience** half only. It is strictly narrower than the seed set.

**Trace the actual failure through the actual gate.** Shilajit, shatavari and gokshura are classical dravyas — they enter via **K1, the Ayurvedic Pharmacopoeia ontology**, not via K2 (an English-language forum/review mine). So:

- #1 seed provenance → **PASS** (origin: ontology, source_url present)
- #2 locale × script → **PASS** (US/en is a required row)
- #3 zero challenge → **DOES NOT FIRE** — shilajit ∉ S2 corpus
- #4 row provenance → **PASS**
- #5 no blind sums → **PERMITS THE SUM** (every summand "passed 1–4")

**Result: implausible zeros are summed into cluster totals and the gate is green.** That is failure #2 from the commission, recurring verbatim, through the gate built to stop it.

**It is worse than a scoping bug — #3 is written against the broken data model.** The research's V1 specifies a four-state type system (line ~515):

```
{volume: <int>, status: "measured"}
{volume: null,  status: "no_data"}        ← endpoint returned a row, no number
{volume: null,  status: "not_returned"}   ← we asked; NO ROW CAME BACK
{volume: null,  status: "not_queried"}    ← we never asked
FAIL if any aggregate (sum/mean/rank) is computed over a set containing status != "measured"
```

Under that model **there is no `volume == 0` for an unmeasured row** — it is `null` + a status. So the draft's `#3 volume == 0` test is either:
- a **near-no-op** (if the four-state model ships — but per F1 it is not on the build list), or
- the **only net** (if it doesn't) — and it is scoped to the audience half.

Either way the hole is real. The research's rule is **unconditional and type-based**; the draft's is **conditional and value-based**. The draft weakened it in transcription.

**Fix (one line, no rigour lost):**
```
3. ZERO CHALLENGE  ∀ row where seed ∈ seeds AND status != "measured" ⇒ FAIL
                   unless a committed NAMED-HUMAN waiver names the row.
5. NO BLIND SUMS   No aggregate may be emitted unless ∀ summand: status == "measured".
```
Adopt the four-state model from the research verbatim. Do not paraphrase it again.

**F2b — #2 is presence-only.** "*rows exist for EVERY required language_code*" is satisfied by **one** `hi-Deva` row against 5,000 `en` rows. It catches our historical shape (zero Hindi rows) and misses the near-miss (token Hindi). Cheap hardening: assert **parity** — every seed pulled in every required locale, or the exclusion is named per seed.

---

## F3 — 🔴 The ontology is the seed chain's root of trust, and its exit criterion is satisfied by a constant

**K1 exit (line 490):** "*100% of rows carry a resolvable `source_url`*".

`G3-PRE` #1 accepts a seed whose origin is **ontology OR audience**. The audience half is genuinely grounded: `G2-CITE` "HTTP-resolve every URL **+ grep the quote**" (line 454). The ontology half has **no string-match requirement** — only that the URL resolves.

The source is PDFs. From the research's own citations (line 1256):
```
API Part I Vol. IX · https://cdn.ayush.gov.in/wp-content/uploads/2021/03/Ayurvedic-Pharmacopoeia-of-India-part-1-volume-IX.pdf
```
and its own worked example (line 879): `"source_url": "https://…API-Vol-…pdf"`.

**All 621 rows can point at the same 9 PDF URLs.** Each returns HTTP 200. The check passes. It proves nothing about any individual entity — and a quote-grep cannot rescue it, because the target is a PDF. **The ontology is therefore the soft flank of the provenance chain: an agent can launder an invented entity through K1 with a constant government URL and clear #1.** That is the `turmeric curcumin` defect class with better paperwork.

Note also that `turmeric curcumin` is a **real, high-volume US supplement product string** (it is on the label of bestselling SKUs). It appears verbatim on real pages. A naive cite-resolve chain through the *audience* half would validate it too. **The only check that actually kills it is Rule B — which per F1 is unbuilt.**

**Fix — simplification that strictly increases rigour.** The 621 API drugs do not vary by domain. The draft makes `ontology.json` a **per-domain** deliverable (`docs/<entity>-inputs/<domain>-research/ontology.json`) — so it is rebuilt for whatisayurveda, kairali.com, kairalicenters, KAPPL: **4+ unaudited regenerations, 4+ fresh fabrication opportunities, 4× the cost.** Instead: build it **once** as `packages/ontology/` — ingested from the named PDFs, committed as a hashed immutable artifact, signed off by a named human (Dr. Deepu John or Roshni's team), with a per-entity locator (volume + monograph page). Every site references it; no site regenerates it. **One audited artifact replaces 28 unaudited ones.**

---

## F4 — 🔴 `G6-HUMAN` makes the flagship site unshippable. The gate table and the content model contradict each other.

**Line 869:** `G6-HUMAN` — Dr. Deepu John or the named panel doctor — **BLOCK** — "*not negotiable, not routable around*".
**Line 858 deliverable:** `launches/<domain>/physician-signoff.md` — "***named approving doctor per page***".

whatisayurveda is ~3,400 pages. The draft quotes its own blocker (line 641):

> *"The ~3,400-page promise is **arithmetically false**. **No single physician can genuinely review 3,400 pages**."*

**MR-1's tiered trust** (line 819) resolves this at the content layer: no review ⇒ no badge, no `lastReviewed`, no Physician JSON-LD — honest absence ships. **But the gate table does not encode the tiering.** `G6-HUMAN` is written as an unqualified BLOCK with per-page sign-off. Read literally, **S6 has no exit for whatisayurveda, and S7–S12 are unreachable for the flagship.** Read charitably, the reader must infer that G6-HUMAN blocks only the reviewed tier — which is exactly the kind of inference the ID contract exists to eliminate ("*'I am in S4' must always have an answer*").

**This is the pipeline failing to execute its own flagship site.** Not a philosophical point — S6 is where whatisayurveda sits today.

**Fix:** split the gate. `G6-HUMAN-A` = per-page physician sign-off, **blocking for tier-1 (badged) pages only**. `G6-HUMAN-B` = per-**template** clinical sign-off, blocking for all health templates. Then the honest-absence tier is a documented exit, not an inferred one. And per `research-keyword-rigor.md` Q11 — "*3,400 is not derived from any ontology we hold… a target invented, then rationalised*" (line 1043) — §13 decision #1 should ask **where 3,400 came from**, not only whether a panel can review it. API Part I holds 621 drugs / 393 species.

---

## F5 — The pipeline is unbudgeted, untiered, and therefore guarantees the short-cutting it exists to prevent

**Exactly one of 14 stages carries effort numbers.** S2's sub-step table (lines 407–414) sums to **5.5–7.5 days**. Every other stage: nothing. There is **no per-site cost or duration anywhere in 1,548 lines** (verified by grep).

Abilash's #1 economic constraint is *"I don't want to burn millions of tokens."* **The document written to answer that brief contains no cost arithmetic.** §0.2 prices individual calls ($0.05–1 FACT, $0.30–1 PROC) and never multiplies by anything.

**Count what a site actually owes.** Committed deliverables in the (g) sections: S0=5, S1=3, S2=2 (one with **16 mandatory sections**), S3=7, S4=1 (12 fields), S5=**9**, S6=4, S7=2, S8=1, S9=3, S10=3, S11=2, S12=3 → **~45 artifacts**, plus 13 `G*-verdict.json` → **~58 per site. × 28 sites ≈ 1,600 artifacts.**

**Duration.** S2 alone at 5.5–7.5 days × 28 = **154–210 days — seven to ten months for stage 2 alone**, before S3's ten validators, S5's nine deliverables, or any human wait state. `CLAUDE.md` commits to a **30-day sprint**. The draft never mentions it. The gap is roughly an order of magnitude.

**And there is no tiering.** Every site gets all 13 stages. A 5-page centre microsite owes the same 16-section dossier, tree test, premortem and reverse income statement as a 3,400-page encyclopedia. `CLAUDE.md` already distinguishes Tier-1 sites, "*early-wave speed builds queued for a later beauty pass*", and revenue vs non-revenue — the pipeline ignores all of it. §10.1 maps OP-4 to S1 with a note and no mechanism.

**The predictable outcome is precisely the diagnosed disease.** Faced with 58 artifacts for a microsite, the agent runs S8 and backfills the paperwork — which is "building first and auditing after", now with 58 documents of forgeable evidence. **A pipeline that cannot be run is not a safe pipeline; it is a pipeline whose gates are optional and whose artifacts are fiction.**

**Fix — tier the pipeline; lose no rigour.** The rigour lives in the **free** checks (§11.1 is right about this). So:

| Tier | Sites | Stages | Machine gates |
|---|---|---|---|
| **FULL** | whatisayurveda, kairali.com, Shopify, KTAHV | S0–S12 as written | ALL |
| **LITE** | centre/franchise/lead-gen sites | S0, S1, S2-lite (**1-page evidenced brief: language, fears, segments — same `G2-PRE`/`G2-CITE` checks, fewer rows**), S3, S5, S6, S8, S9 | ALL |
| **MIN** | LPs, microsites | S1, S3, S5-as-conversion-map, S8, S9 | ALL |

**`G3-PRE`, `G5-PRE`, `G8-*`, `G9-PRE` bind on all three tiers — they are free.** What scales is prose and human attention, which are not. This is the single change that makes the document executable, and it costs nothing in rigour because **no machine check is ever relaxed.**

---

## F6 — The Director's gate load rises ~5× with zero anti-rubber-stamp design for humans

**§10.2 states what Abilash does today:** "*SG-C1, SG-C2, SG-C3 | **HUMAN — the only three things Abilash does***".

**The draft gives him, per site:** `G1-HUMAN` (6-bullet comprehension) · `G4-HUMAN` (will it sell) · `G5-HUMAN` (approves the tree) · `G9-HUMAN` (preview — "***section-by-section*** for A-register flagships") · `G10-HUMAN` (DNS). **Five per site × 28 = 140 Director decisions** — plus every `G3-PRE` #3 zero waiver (unbounded), every §11.4 rubric change, and §13's 12 open decisions. He is the non-technical Executive Director of a group with a hospital, a pharma plant and centres in 9 countries.

**§11.3 "Anti-rubber-stamp design" is 8 rows, and every one is about the LLM auditors.** There is not one line of anti-rubber-stamp design for the human gates — **which are the ones that will actually be rubber-stamped**, because they are the only ones with a busy human in the loop and no exit code.

This matters more than a stamped LLM gate: **a rubber-stamped HUMAN gate launders accountability.** It converts "nobody checked" into "the Director approved it", which is worse than the honest absence the draft demands everywhere else. The draft's own doctrine — *"an honest absence beats a false claim"* (line 820) — indicts it.

**Fix:** budget the Director explicitly. Cap at **3 gates per site**: `G4` (GO/KILL — fold `G1`'s comprehension confirm into the same sitting, it is the same conversation), `G5` (the tree — the highest-leverage thing he can look at, per §1.6's cost asymmetry), and one merged **go-live** approval (`G9`+`G10`). Give each a **fixed one-page decision brief with a stated recommendation** (§S4 already requires "*I recommend KILL*" — generalize it). A gate he can clear in 10 minutes with real information is a real gate; a gate that needs an afternoon is a signature.

---

## F7 — Theatre inventory: artifacts with no gate, indicted by the draft's own X-6

The draft quotes X-6 as "*the meta-rule that justifies this entire document*" (line 1329):

> *"A checklist item without a machine gate **silently rots**"* — proven: **llms.txt was "checklist A6" and entirely missing at launch.**

Then it ships these deliverables **with no gate that reads them**:

| Artifact | Gate that checks it | Verdict |
|---|---|---|
| `<domain>-ia-conflict-log.md` (S5) | `G5-PRE` list (line 775) does not include it | 🔴 **rots** |
| `sites/<domain>/soul.md` (S1) | `G1-PRE` checks register/locales/owners/archetype only | 🔴 **rots** — and §10.3 already admits DD-17 is "*adopted in doctrine, built for **ZERO sites***" |
| `tree-test-<date>.md` (S5.8) | not in `G5-PRE`; deliverable is "*named participants, **or marked NOT RUN***" | 🔴 **pre-authorized to be skipped, 28 times** |
| **Premortem** (S4) | `G4-PRE` = "*12 fields **non-empty***" | 🟡 **graded on existing** — five rows of anything passes |
| **Assumptions checklist ≥5 rows** (S4) | same | 🟡 **graded on counting** |
| Dossier "**16 mandatory sections**" (S2) | `G2-PRE` checks §15 non-empty + claim-row provenance | 🟡 **the checked part is good; the other 14 sections are a form** |

**The load-bearing set is small and should be stated as such:** `G3-PRE`(fixed per F1/F2) · `G5-PRE` (set/graph: 1:1 map, zero orphans, single-hop 301) · `G9-PRE` (**the hash binding — the best idea in the document**) · `G6-BUILD` `resolveReview()` (live, proven) · `G8-PRE`/`G8-SEC` (live) · `G7-PROC` design-critic (live, proven) · the CI glob fix (§12.2 #5) · the banned-string lint (#6). **Eight mechanisms, six of them free, four already running.** Say that out loud in §11.1 — it is the honest core of the document and it is currently buried under ~45 artifacts of equal apparent weight.

**And §14 diagnoses its own defect, then ships it anyway:**

> *"this pipeline's rule-set should be **GENERATED from the repo** (the `brief-snapshot.sh` pattern), **not transcribed by hand**. A pipeline document that must be hand-re-read to stay true **will be wrong by the time it is used.**"*

§10 is **190 rules transcribed by hand across four tables** — and §14's own grep already caught it dropping SP-9 silently. It was "99.6% true, which is the most dangerous kind of wrong" (its words). **Either generate §10 or delete it and keep the register as the single source.** Two hand-maintained rule tables in one repo will diverge, and the draft has already demonstrated the mechanism.

---

## F8 — Auditor wiring: the draft's own "makes it WORSE" scenario is one PR away; and the hash binding has no re-entry rule

**(a) Build items #2 and #3 are separable, and must not be.** §12.2:
- #2 = "Wire `audit-gpt.mjs` + `audit-perplexity.mjs` into CI"
- #3 = "The raw-artifact rule, wired **WITH** them" — annotated as "⚠️ **Wiring the auditors naively makes things WORSE** — a CI job piping an annotated doc to Perplexity **manufactures false assurance at scale**"

Two line items = someone ships #2 on Monday and #3 "next sprint". The draft **states** the hazard and then **structures the work so the hazard is the default path**. **Fix: one item. The raw-artifact stripper is a precondition of the wiring, not a follow-up.**

**(b) No trigger scope = token burn on trivia, against the explicit brief.** Nothing says *when* the auditors run. Wired into CI naively, every PR — README typos, dependency bumps, a `soul.md` comma — pays GPT-5 + Perplexity. §11.1's defence ("*NOT CALLING THEM for things a regex can decide*") is about **which checks**, not **which diffs**. **Fix: path-scoped triggers** — auditors fire only on `docs/*-inputs/**`, `keyword-map.json`, `*-keyword-url-map.tsv`, `content/**`. Never on code-only diffs. One `paths:` block in the workflow.

**(c) The hash binding has no re-entry procedure — so the best mechanism in the document is the one people will route around.** `G9-PRE` (line 1003): every verdict is bound to the SHA-256 of the artifact it judged; at S9 re-hash and compare; **mismatch ⇒ gate VOID ⇒ FAIL**. Correct, and it is what converts the walk from ritual to proof.

But real work loops. You discover at S5 that a cluster has no demand and go back to S3. **The draft has no loop rule at all** — 14 stages, strictly linear, `S5.0` alone gating on 9 committed preconditions (E1–E9). §11.5's stateless re-run covers *auditor* re-runs, not *stage* re-entry. So the first legitimate S5→S3 loop produces a hash mismatch at S9, and the options are: re-run everything (expensive, including the paid FACT/PROC gates) or fudge. **Given a 28-site queue, people fudge.**

**Fix — cheap and it makes the binding survivable:**
> **RE-ENTRY RULE.** Changing an artifact voids its verdict and every downstream verdict that consumed it. Re-running voided `PRE`/`CITE` gates is **mandatory and free**. Re-running voided `FACT`/`PROC` gates is mandatory unless a committed waiver names the reason and the human. `G9-PRE` prints the void chain. **A voided gate is a normal event, not a failure — an *unrepaired* voided gate is the failure.**

Without this, the honest response to a late fix is "don't touch the artifact", which is how S5 mistakes get built rather than corrected.

---

## SUMMARY — what to change

1. **F1/F2/F3 first, or the pipeline does not do the one job it was commissioned for.** Build list item #1 = `keyword-validate.mjs` (V1–V10, four-state type model) + `seed-lint.mjs` (Rule A/B). Rewrite `G3-PRE` #3/#5 in terms of `status == "measured"`. Ontology → `packages/ontology/`, built once, human-signed.
2. **Tier the pipeline (F5).** Machine gates universal because free; prose and human attention scale by stakes.
3. **Budget the Director to 3 gates/site (F6)** and give the human gates the same anti-rubber-stamp rigour §11.3 gives the models.
4. **Split `G6-HUMAN` per-page vs per-template (F4)** or the flagship cannot exit S6.
5. **Merge build #2+#3, path-scope the auditors, add the RE-ENTRY rule (F8).**
6. **Delete or gate the theatre (F7);** generate §10 rather than transcribing it.

**The draft's diagnosis is right and its §11.1 instinct — put the weight on the free machine layer — is right.** The problem is that the free machine layer, as specified, has a hole on the shilajit case, an unguarded flank at the ontology, and a build list that omits its own strongest scripts — while ~45 prose artifacts per site × 28 sites sit on top of it demanding attention the organisation does not have. **The rigour and the bureaucracy are currently inverted: the parts that are free are underspecified, and the parts that are expensive are mandatory everywhere.**

*Critique v1.0 · 2026-07-15 19:21:09 IST · `a206791` · no gate in the target document was executed, because none exists.*
