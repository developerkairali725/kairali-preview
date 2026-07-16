# ADVERSARIAL REVIEW — the DO/DON'T lists of `MASTER_PIPELINE_DRAFT.md`

**Written 2026-07-15 19:22:18 IST · reviewing `MASTER_PIPELINE_DRAFT.md` v0.1 · repo at commit `a206791`, branch `feat/wia-content-engine-research`.**
**Angle:** Abilash's mandatory structural theme — *"what we should NOT do is also equally important… an ongoing theme throughout the entire master plan."*
**Verdict: the theme is present at every stage and load-bearing at almost none.** Findings below are ranked by severity. No praise. Every finding names a stage ID and, where possible, cites machine evidence.

---

## 0 · The mechanical baseline (run, not asserted)

Every number below was produced by command against the draft, not by reading impression.

```
DON'T rows total       : 117
  check marked ✅ LIVE  : 13
  check marked 🔴 NOT   : 11
  NO STATUS AT ALL     : 93     <-- reader cannot tell rule from wish
  marked ⚠️ ("a wish")  : 10     <-- §0.4's own discipline, applied to 9% of rows
```

```
$ ls docs/process/rubrics/          -> No such file or directory   (§11.4 says rubrics live here, hashed into every verdict)
$ for s in <13 scripts named in the gate tables>; do ...
ABSENT  scripts/keyword-gate.mjs        ABSENT  scripts/dossier-lint.mjs
ABSENT  scripts/matrix-walk.mjs         ABSENT  scripts/brief-lint.mjs
ABSENT  scripts/sitemap-gate.mjs        ABSENT  scripts/protection-map-lint.mjs
ABSENT  scripts/cite-resolve.mjs        ABSENT  scripts/business-case-lint.mjs
ABSENT  scripts/claims-lint.mjs         ABSENT  scripts/log-lint.mjs
EXISTS  scripts/audit-gpt.mjs           EXISTS  scripts/audit-perplexity.mjs   (both ungated)
EXISTS  scripts/brief-snapshot.sh
```

```
$ grep -ic doorway|near-duplicate|pre-ticked|CNIL|cargo|"copy a competitor"|PMID|retracted  MASTER_PIPELINE_DRAFT.md
0 for every one of them.
```

**Coverage of the theme (Q1 of the brief):** all 14 stages (`SX`, `S0`–`S12`) carry both an `(e) DO` and an `(f) DON'T` section. The theme was **not** forgotten structurally. Every one of the nine named `[OURS]` failures appears in a DON'T list somewhere. **The defect is not coverage. It is that the DON'T lists are graded on presence and were never tested against the failures they name** — which is precisely the criticism §0.4 makes of DO lists.

---

## FINDING 1 — 🔴 CRITICAL · `S3` / `§0.5` · **The acceptance test's row 2 is false. `G3-PRE` would NOT catch the summed zeros.**

§0.5 is declared *"the acceptance test for the whole document."* Row 2 claims failure #2 (**summed implausible zeros** — shilajit/shatavari/gokshura = 0 US) is *"Caught at S3 by `G3-PRE` zero challenge + no-blind-sums."* **Trace the actual rows through the actual assertions and it is not.**

`G3-PRE` assertion #3, verbatim (line 566):

```
3. ZERO CHALLENGE  ∀ row where volume == 0 AND seed ∈ S2 corpus ⇒ FAIL.
```

But `K3` defines `seeds = K1 ∪ K2` — **ontology ∪ audience language**. The quantifier `seed ∈ S2 corpus` covers only the K2 half. Shilajit, shatavari and gokshura are **ontology entities** (K1 — Ayurvedic Pharmacopoeia Part I, the very list `K1` mandates). They are Sanskrit drug names; there is no reason to expect them verbatim in a dossier §11 mined from customer reviews and forums, where the audience says *"energy booster"* and *"ashwagandha ke fayde"*. **A zero on an ontology-only seed does not fire assertion #3.**

Then assertion #5:

```
5. NO BLIND SUMS   No aggregate may be emitted unless every summand passed 1–4.
```

Walk the shilajit `0` row through 1–4: **#1 seed provenance** — origin `ontology`, resolves, passes. **#2 locale × script** — the row is a US row; passes. **#3 zero challenge** — does not fire (above). **#4 row provenance** — `source`/`retrieved_at`/`locale` present; passes. **All summands pass 1–4 ⇒ the aggregate MAY be emitted.** Failure #2 reproduces end-to-end through a gate written specifically to stop it.

**The second net is admitted non-blocking.** `V3` (HIGH-PRIOR ENTITY LIST) is described in the draft's own words as shipping *"report-only with unsourced floors."* So the only instrument that would flag an implausible ontology zero **does not block**, by design.

**Worse — §11.3's regression corpus hides this.** *"The DataForSEO demand map, unmodified, must FAIL `G3-PRE`. If it ever passes, the gate is broken."* That map **will** fail — on assertion **#1**, because it is full of compound seeds (`turmeric curcumin`). **The suite goes green while the zero-challenge hole is untested.** A regression corpus that passes for the wrong reason is worse than none: it is the *"burn millions of tokens to find out we did very average work"* outcome, automated.

**Fix:** `∀ row where volume == 0 ⇒ FAIL` (seeds are K1 ∪ K2; there is no third kind), waivable only by the named-human waiver file already specified. If genuinely-obscure API drugs make that noisy, the waiver file is the pressure valve — **not a quantifier that silently excludes the exact class that failed**. And the regression corpus needs a **second fixture**: a demand map with clean seeds and one implausible zero. If `G3-PRE` passes it, the gate does not do what §0.5 says it does.

---

## FINDING 2 — 🔴 CRITICAL · `S3` / `S5` · **D1 — the document's flagship structural argument — has no DON'T and no check at either stage it was invented for.**

§1.3 D1 is the draft's lead pushback on Abilash's order, and its worked example is explicit (line 146):

> *"If we research the audience and draw the sitemap before establishing that KTAHV is under a clinical-language lock, we will produce a sitemap full of banned words — because **"spa", "resort", "luxury", "journey" are exactly the words a wellness audience uses and a keyword tool will happily recommend at high volume.** … generate a **GST/SCN legal exposure** — a tax liability, not a style nit."*

Now grep the two stages where that would happen:

- **`S3` (f)** — *"the most important table in the document"*, 11 rows: **zero rows about the register lock.** `S3` (e) mentions the C2 compliance keyword screen, but scoped to *Schedule-disease terms (D&MR s.3(d))* and *"cure/treatment for X"* — **the D&MR family, not the GST/SCN banned-word family.** They are different lists with different legal owners.
- **`S5` (f)** — 13 rows: **zero rows about the register lock.** `G5-PRE` asserts *"1:1 keyword→URL · no dupes · every S0 KEEP URL has a home · every 301 single-hop · zero orphans · every cluster adjudicated with a reason · URL grammar regex."* **No banned-word scan over `keyword-url-map.tsv`, over `labels.json`, or over the URL slugs themselves.**

The register lock is *declared* at `G1-PRE` (*"banned-word list bound to the register"*) and then **nothing consumes it until the S6/S8 compliance lint runs over page copy.** So `/spa-treatments/` can be validated at S3, minted at S5, approved by `G5-HUMAN`, and the first machine to object is a lint on the body text of a page that already has the banned word in its URL — at which point §1.6's own cost asymmetry has fully triggered: *"cost = a site migration."*

**The register-lock conflict is mentioned at S5 — as prose, in the "reconcile three instruments" paragraph**, with the rule *"the conflict goes in the sitemap doc with an explicit ruling."* That is a DO. It is not in the DON'T table, it has no check, and `G5-PRE` cannot see it. **The pipeline argues for D1 in §1.3 and then does not encode it.**

**Fix:** one DON'T row + one assertion at each stage. `G3-PRE` #7: *∀ keyword row: slug-normalised term ∉ register banned list, or carries a `register_conflict` ruling id.* `G5-PRE`: *∀ URL, label, and alias: banned-word scan under the S1 register ⇒ FAIL.* Both are `grep` against a list that `G1-PRE` already binds. This is the cheapest high-stakes check in the document and it is missing.

---

## FINDING 3 — 🔴 CRITICAL · `S6` · **Fabricated citations are absent from every DON'T list — while the DO lists reward citation density, and the flagship evidence tier is structurally uncheckable.**

`grep -ic`: `PMID` = **0**. `retracted` = **0**. `"cite a source"` = **0**. `DOI` = 2 (neither in a DON'T). **No stage forbids citing a source nobody opened.**

Three things make this the next `resolveReview()`-class incident rather than a gap:

1. **The DO list creates the incentive.** `S6` (e): *"Statistics (~+41%), expert quotations and source citations boost generative visibility 30–40%."* An agent drafting health pages is told, with numbers, that citations raise the score it is graded on.
2. **The highest-prestige evidence tier cannot be checked by the gate assigned to it.** The four-tier Evidence Display's top tier is **Classical/Samhita (chapter:verse)** — e.g. *"Charaka Samhita, Sūtrasthāna 27:196."* `G6-CITE` is specified as *"script — resolve every citation"*, and §11.2 L0 defines citation resolution as *"every URL → HTTP 200 + quoted string present on page."* **A chapter:verse has no URL.** The one tier that confers the most authority is the one tier that is, by construction, unresolvable by the only mechanism proposed — and it is trivially emittable by a model. This is **failure #5's exact shape**: a prestigious, human-sounding assertion with no backing event, machine-emitted, on every page.
3. **The document practises the anti-pattern it does not name.** §14, honestly: *"I did not re-fetch a single source."* Every external statistic in this pipeline (−30.3%/+115.1%, 70/30/15%, ~37%, +41%, 4×/−2) is carried forward from sibling docs unverified. The draft's own §0.4 requires each DON'T be *cited*; the citations behind its DO lists are inherited, and this is disclosed only in §14 — not beside the numbers where a reader acts on them.

**Documented precedent §0.4 asks for and this stage has none of:** *Mata v. Avianca Inc.* (S.D.N.Y., 2023) — an LLM produced case citations that were perfectly well-formed, internally consistent, and entirely fictitious; the failure survived because the reviewer checked the *shape* of the citations, not their existence. **That is `G6-CITE` as currently specified.**

**Fix:** a DON'T row at `S6` — *"DON'T emit a citation, DOI, PMID or chapter:verse that was not resolved by a machine at draft time"* — plus the classical-text tier gets a **typed, closed reference table** (text · edition · chapter · verse, resolved against a committed corpus file) and `resolveClassicalRef()` **throws** exactly like `resolveReview()`. Per the draft's own stated pattern (`S6` ★): *"make the false claim unrepresentable, THROW rather than warn."* A free-text `citation:` field on a health page is maximally representable.

---

## FINDING 4 — 🔴 HIGH · `§0.4` · **The DO/DON'T contract is itself a policy describing a process that does not exist — failure #6, committed by the document that promises to make failure #6 impossible.**

§0.4 makes three commitments. All three are false as written:

| §0.4 commitment | Machine evidence |
|---|---|
| *"A DON'T with no check is a **wish**, marked ⚠️, and is an open question — not a rule."* | **10 of 117** DON'T rows carry ⚠️ (9%). **10 of the 13** enforcing scripts named in the gate tables **do not exist**. §12.1 puts the true machine coverage at *~26 of ~190 rules*. By §0.4's own definition the overwhelming majority of these 117 rows are wishes. They are not marked, and **not one of them reaches §13's open-decision list** — §13 has 12 items and none is *"N DON'Ts have no check."* |
| *"The DON'T tables in this document are also the auditor rubrics (§11) — the same text, read in the opposite direction."* | §11.4: *"Rubrics live at `docs/process/rubrics/<gate-id>.md`, are **hashed into every verdict**."* → `ls docs/process/rubrics/` → **No such file or directory.** The DON'T tables are markdown prose in a stage section; they are not keyed by gate id, not hashed, not consumable. **The rubric layer described in §11.4 does not exist and nothing in §12.2's build list creates it.** |
| *"Every DON'T is **concrete**, **cited**, and **checkable by an auditor against an artifact**."* | **93 of 117 rows carry no status mark at all** — a reader of the DON'T table cannot distinguish a live gate from an aspiration without cross-referencing the (h) gate table two screens down. The (h) tables are scrupulously honest (🔴 NOT BUILT everywhere). **The (f) tables — the ones §0.4 declares to be the rubrics — are not.** |

**This is exactly MR-4.** *"Wrote a policy describing a process that does not exist… plausible, well-formed, and false."* §0.4 is a policy page. It describes a rubric pipeline (marked wishes, gate-keyed rubric files, hashed rubrics) that nobody built. It is listed in §0.5 as failure #6, assigned to `S6`, *"caught by `G6-PRE` process-claim register 🔴 NOT BUILT."* **The process-claim register would have caught §0.4 — if it existed. The draft's own most-cited live defect is reproduced in the draft's own contract section, four screens above the table that names it.**

**Fix, ordered:** (a) add a **STATUS** column to every DON'T table with the same vocabulary as the (h) tables (✅ / 🟡 / 🔴 / ⚠️-wish) — one mechanical pass, and it makes the 93 honest; (b) generate the DON'T tables **from** `docs/process/rubrics/<gate-id>.md`, not beside them, so §11.4's hash binding has something to hash — this is §14's own recommendation (*"this pipeline's rule-set should be GENERATED from the repo… not transcribed by hand"*) applied to the rubrics; (c) every ⚠️-wish row gets a §13 line or a §12.2 build item. Until (a) ships, **§0.4 should be struck**, not softened — it currently launders 93 aspirations as rules.

---

## FINDING 5 — 🔴 HIGH · `S3 K5` · **The AEO question harvest has zero provenance assertions, and its DON'T row points at an unrelated check.**

Abilash: *"AEO should technically be the FIRST."* D3 answers him by making the **question harvest at `K5` the first thing that touches search at all.** It is therefore the AEO layer's foundation. Its DON'T row (line 534):

> **K5** | **DON'T write the questions you assume people ask** · **DON'T treat one PAA snapshot as the question set** | ⚠️ `G3-PRE` #6 — **check not yet specified**

**`G3-PRE` #6 is the ESTIMATE LABEL assertion** (*"∀ volume figure… carries the string 'modelled estimate'"*). It is about volumes. **It has nothing to do with questions.** The row points at a check that exists and does something else — which reads, at a glance, as coverage. Grepping the whole `G3-PRE` block for `question|paa|autocomplete` returns **nothing**: **none of the six assertions touches `questions.json`.**

The asymmetry is stark and self-evidently wrong:

| Artifact | Provenance assertion |
|---|---|
| `seeds.json` | `G3-PRE` #1 — verbatim in the S2 corpus or the K1 ontology; **`source: "agent_constructed"` is FORBIDDEN**, by name |
| `questions.json` | **none** |

**"DON'T write the questions you assume people ask" is failure #1 verbatim, one artifact over.** `turmeric curcumin` was an agent-constructed seed. *"What are the benefits of Ashwagandha for stress?"* is an agent-constructed question — same mechanism, same plausibility, same absence of a falsification loop, and now it is the thing the answer-shape at `S6` is built around and the thing `S5.3` adjudicates URLs from. `K5`'s own exit criterion (*"≥1 harvested question per cluster, or explicitly `no-questions-found` with the empty response captured"*) is **exactly the right check** — it is simply not in `G3-PRE`, so nothing runs it.

**Fix:** `G3-PRE` #7 — *∀ question ∈ `questions.json`: `source` ∈ {paa, autocomplete, gsc, inbox, forum} **with a raw-response hash**; `agent_constructed` FORBIDDEN; ∀ cluster with a planned page: ≥1 question OR an `no-questions-found` record carrying the captured empty response.* The draft already wrote this rule at `K5`. It just never made it into the gate.

---

## FINDING 6 — 🔴 HIGH · `S8` / `S9` · **The hash binding proves the artifacts didn't change. Nothing proves the build implements them.**

`S9`'s hash binding is presented as the mechanism that answers Abilash's #1 ask (line 1003–1005): *"Hash mismatch ⇒ the artifact changed after it passed ⇒ that gate is VOID… This single mechanism is what converts the matrix walk from a ritual into a proof."*

It proves one thing: **the artifact a gate judged is byte-identical to the artifact on disk at S9.** It does not prove **the site is the artifact.** `G9-PRE`, verbatim: *"every S0–S8 verdict exists, PASSed, and its artifact hash still matches."* Re-hash the map; never compare it to the built pages.

Search both DON'T lists for a row forbidding divergence:
- **`S8` (f)**, 5 rows: cart/checkout · silent missing locale · publish-before-canary · hardcoded reviewer/price/ID · test outside the CI glob. **None.**
- **`S9` (f)**, 7 rows: .md-as-evidence · gate-claimed-automated · softening · bandwagon · averaging verdicts · staging robots.txt · per-page auditing. **None.**

And the draft knows the link is unchecked. §10.4, on FR-2: *"`keywords[]` frontmatter is **the only structural keyword→page link, and it is unchecked** → now fed by **S5**."* **"Fed by" is not a check.** That sentence is the same move as *"declared binding in a .md file"* — failure #9, which §0.5 assigns to `S9`, *"caught by `G9-PRE` hash-bound matrix walk."* **`G9-PRE` cannot catch it: the divergence it would need to see is between two things it never compares.**

Consequence: `S5` — *"the hinge"*, the stage that gets the most auditing because *"being wrong here is most expensive"* — can be approved by `G5-HUMAN`, hashed, and then **ignored by the build**, and the entire matrix walk goes green. Every URL could differ from the approved tree. That is not a hypothetical for a 3,400-page programmatic build where URLs are generated by a template.

**Fix:** `G9-PRE` conformance assertion — *set(URLs in the built sitemap/route manifest) == set(URLs in `keyword-url-map.tsv` where `decision == URL`)*, and *∀ page: `frontmatter.keywords[]` ⊆ the keywords the map binds to that URL, and no keyword is bound to two URLs in the build.* Set arithmetic; deterministic; the draft's own §0.2 argues an LLM would be *"strictly worse"* at exactly this shape. Add the matching DON'T at `S8`: *"DON'T ship a URL the S5 map does not contain, or a `keywords[]` the map does not bind."*

---

## FINDING 7 — 🟠 MEDIUM-HIGH · `S5.3` · **Doorway and near-duplicate pages are named nowhere, and the URL-or-H2 rule licenses them for the exact site family we have already built.**

`grep -ic doorway` = **0**. `near-duplicate` = **0**. `duplicate page` = **0**.

`S5.3` is billed as *"the single check standing between '3,400 valuable pages' and '3,400 thin pages'"*:

> **Give it a URL when ≥2 hold:** independent validated demand · its SERP shape differs from the parent's · it needs independent linking (nav/hub/external) · it can carry ≥1 unique, citable claim not in the parent.

Apply it to **kairalicenters.com — an 18-centre network across 9 countries** (already built; task #15), and to the franchise site:

- *"Panchakarma centre in Bangalore"* — **independent validated demand** ✅ (it is a real query with real volume)
- *"it needs independent linking"* — ✅ (every centre needs a nav entry and a hub link, trivially)
- **That is 2 of 4. The rule says: give it a URL.**

The two criteria that would have stopped it — *SERP shape differs* and *≥1 unique citable claim not in the parent* — are **not required**, because the rule is `≥2`, not `≥2 including the substantive ones`. **So eighteen near-identical city pages, differing only in an address and a map pin, pass the hinge's flagship check.** That is Google's **doorway pages** policy almost verbatim — a named spam policy, not a style opinion — and it is the single most common way a multi-location health business gets flattened. `S4`'s scaled-content-abuse test asks *"information gain per URL"* at the template level, which is the right question at the wrong grain: a location template can have real information gain and its 18 instances still be doorways.

The `S5` DON'T table has 13 rows about cannibalisation, orphans, depth, `<priority>`, facets and card sorts. **It has nothing about the thing that actually kills location-page networks.**

**Fix:** (a) DON'T row at `S5`: *"DON'T mint a page whose only differentiators are a name, an address and a map pin"* — cited to Google's doorway policy, which names *"multiple pages… to funnel users into the actual usable portion of your site"*; (b) harden `S5.3`: for any **templated set ≥5 instances**, the *"≥1 unique citable claim not in the parent"* criterion becomes **mandatory, per instance**, and `G5-PRE` asserts the field is non-empty and **unique across the set** (string-equality across 18 rows is a `sort | uniq -d`); (c) since kairalicenters is already live, this is a retroactive finding, not just a future rule.

---

## FINDING 8 — 🟠 MEDIUM-HIGH · `S6` / `S7` · **Consent dark patterns: absent from every DON'T list, on a fleet with DE/FR locales and an open Art-27 question.**

`grep -ic`: `pre-ticked` = 0 · `pre-checked` = 0 · `consent dark` = 0 · `CNIL` = 0.

What the draft has:
- **`S7` (f) row 1** — *"DON'T ship a dark pattern. No fake urgency, no fabricated stock/viewer counts, no countdown resets."* Scope: **urgency mechanics only.**
- **`S6` (d) 6** — *"Consent copy written — not lorem, not 'we value your privacy' (C1)."* Scope: **tone.**

Neither touches the consent-UI failure mode that regulators actually fine, and which every default CMP ships with: **refusal asymmetry** (Accept = one click, Reject = two clicks and a toggle screen), **no Reject button on the first layer**, **pre-ticked non-essential boxes**, **legitimate interest asserted for advertising**, **deceptive contrast on the reject control**, **consent walls**.

**The named, documented enforcement record §0.4 explicitly asks for — and this stage cites none of:**
- **CNIL, Dec 2021/Jan 2022** — **€150M (Google)** and **€60M (Facebook)**, on a single finding: *refusing cookies required more clicks than accepting them.* Not a claim about copy; a claim about **click counts**, which is a machine-checkable property of the banner.
- **EDPB Cookie Banner Taskforce report, Jan 2023** — enumerates the pattern set (no first-layer reject, pre-ticked boxes, legitimate-interest-for-ads, deceptive link design, misleading colour contrast).

**Why this stage and not another:** `S1` already declares **lawful basis per form** and **EU Art-27 rep applicability** (C1/C7). KTAHV ships **EN/DE/FR** — the DE and FR locales are the GDPR surface, and the FR one is CNIL's jurisdiction specifically. `S7` (f) already forbids stacking a 4th floating overlay and counts *"consent banner + Chatbase bubble + sticky WhatsApp CTA = already 3"* — so the draft is thinking about the consent banner **as a layout object and not as a legal instrument.** The dark-pattern row lives at `S7` (design), where a designer will read it; the consent decision lives at `S6` (copy) and `S1` (lawful basis). **No stage owns the interaction.**

**Fix:** DON'T rows at **`S6`** (*"DON'T write a consent notice whose reject path is longer than its accept path; DON'T pre-tick; DON'T assert legitimate interest for advertising"* — cited CNIL/EDPB) and a machine check that is genuinely trivial and genuinely load-bearing: **`G7-PRE`: click-depth(reject) ≤ click-depth(accept) on the rendered banner, and zero `checked` attributes on non-essential consent inputs.** `packages/consent` already exists (task #3 completed) — this is a spec assertion against a package we own, not new infrastructure.

---

## Secondary findings — real, below the top 8

**S-1 · `S5` — the hinge's DON'T table rests on a vendor listicle, with a legend the document doesn't carry.**
5 of `S5`'s 13 DON'T rows cite **[TM #1/#3/#4/#5/#7/#9/#10]**. `[TM]` is defined **only in `research-sitemap-ia.md:232`** — `topicalmap.com/topical-map/mistakes/`, *"10 Common SEO Topical Map Mistakes to Avoid"*. Two problems. (a) **The legend is not in `MASTER_PIPELINE_DRAFT.md`.** §0.4 defines only `[P]/[S]/[R]/[OURS]/[J]`; `[TM]`, `[AH]`, `[NNG-D]`, `[NNG-C]`, `[G-SM]`, `[G-FN]` are used and never defined. §0.4 says these tables **are the auditor rubrics** — an auditor handed this rubric cannot resolve its most-used citation. (b) **Abilash asked for *"GUIDES and RESEARCH PAPERS published by successful people"*.** The evidence base for the pipeline's most expensive stage is a tool vendor's lead-gen listicle, graded `[S]` and set in the same table as Google's own documentation (`[G-SM]`, `[G-FN]`, graded `[P]`) with identical visual weight. `[TM #1]`'s claim — *"weaker rankings, higher bounce rates, and thin engagement usually follow"* — is an **unevidenced vendor causal assertion**. The draft is scrupulous about the three-click rule (*"it is folklore, and we do not cite folklore"*) and then leans on a listicle for five rows of the hinge.

**S-2 · `S7` — "never lorem ipsum" is the stage's own tagline, and it is a DO with no check.**
§1.2 names the stage *"Design it — **with real words in it** · Never lorem ipsum, never AI-generic."* `S7` (e): *"Design against real S6 content, never lorem ipsum."* **`S7` (f) has no such row** (9 rows: dark patterns, overlays, labels, prices, carousels, raster assets, Raag tokens, score-grinding, exit-intent). `S7`'s **entry criterion** is *"G6 PASS — representative real content exists for every template"* — and **`G6-PRE` does not check it** (it checks banned words, banned strings, process claims, schema, citations). So the stage's defining constraint is a DO, guarded by an entry criterion that no gate evaluates. `grep -c lorem` = 3, none of them a DON'T.

**S-3 · `G3-PRE` #6 — the estimate-label check is a laundering ritual, not a gate.**
*"∀ volume figure in any human-facing artifact: carries the string `"modelled estimate"` and a confidence."* **A string-presence lint.** Pasting *"all figures are modelled estimates"* once in a header satisfies it while the body still reports **27.1K** as fact — which is exactly what the failure was. Failure #4 is *"treating modelled estimates as measured ground truth"*: a **usage** failure, not a **labelling** failure. The draft's own prescribed pattern (`S6` ★) is *"make the false claim unrepresentable, THROW rather than warn"* — the instrument that matches is a **type**: volumes are never bare integers, they carry `{bucket, confidence, retrieved_at}`, and **arithmetic on them throws**. That would also close Finding 1's assertion-#5 hole and S-4 below, in one move.

**S-4 · `S3` (e) and `S4` (f) contradict each other on cluster totals, and `V8` says both are wrong.**
`S3` (e): *"**Score at cluster level.** The unit is the cluster, not the keyword."* `G3-PRE` #5 permits aggregates whose summands pass 1–4. `S4` (f): *"**DON'T sum bucketed volumes into cluster totals**"* → `MM-5`: *grep for summed totals ⇒ **zero***, and `G4-PRE` blocks on *"no cluster sums."* **So S3 is instructed to produce the artifact S4's gate rejects on sight.** And `V8` settles it against both: *"every volume we hold is a **label**, not a count."* You cannot sum labels — provenance does not make the arithmetic valid. **Failure #2's real lesson is not "the zeros were fake"; it is "the sum was meaningless."** The draft encoded the shallower lesson at S3 (#5: sums are fine if the parts are clean) and the deeper one at S4 (no sums), and never reconciled them. In practice the contradiction resolves the way silent defaults always resolve: whoever hits the deadlock drops the assertion.

**S-5 · `S11` (4 rows) and `S12` (3 rows) are the thinnest DON'T lists, and `S11` is where "did we help or hurt" is decided.**
`S11`'s purpose is *"Know whether it worked, **against the S0 benchmark**. (This is why S0 exists.)"* Its DON'T list: fake-bump dates · auto-fix catalog lint · Moby Autopilot · stale absolutes. **Nothing about the actual failure mode of a measurement stage:** attributing a traffic change to our work without controlling for seasonality, algorithm updates, or a shifted denominator. We have the in-house precedent already cited at `S2` — **POS-6**, *"DON'T count arrivals when you mean decisions… ~34%, not ~65%"*, described in the draft as *"a data-integrity rule of exactly the DataForSEO class."* **That rule is applied to audience data at S2 and not to performance data at S11**, where it will decide whether a migration is called a success.

**S-6 · Cargo-culting a competitor's structure is forbidden nowhere — while a ratified rule mandates the input that causes it.**
`grep -ic cargo` = 0; `"copy a competitor"` = 0. CLAUDE.md's launch directive requires competitor research **before building any revenue site** and names the KTAHV comp-set as *"the model"*; §10.4 re-scopes **LE-2** to `S4` (difficulty). **No DON'T at `S5` forbids importing a competitor's IA** — and a competitor's IA encodes *their* offer, *their* register and *their* legal exposure, none of which are ours (the register lock is the sharpest case: our competitors are legally free to say "spa"). The stage that reconciles *"three instruments"* (mental model / search demand / register lock) does not list **competitor structure** as a fourth instrument to be resisted.

---

## Stages whose DON'T list would NOT have prevented a real failure we already had

Per the brief's closing instruction. **"Named" = the failure or its exact mechanism is in scope for that stage and the stage's DON'T list does not stop it.**

| Stage | The failure it would not have prevented |
|---|---|
| **`S3`** | **Failure #2** — the summed implausible zeros, *its own headline failure*. Assertion #3's quantifier excludes ontology seeds; #5 then permits the sum (**Finding 1**). Also: **failure #1's mechanism at the question layer** — `agent_constructed` is forbidden for seeds, unconstrained for questions (**Finding 5**). |
| **`S5`** | **The GST/SCN banned-word sitemap** that D1 exists to prevent — no register-lock row, no check (**Finding 2**). **Doorway location pages** — `S5.3` licenses them at ≥2 (**Finding 7**). |
| **`S6`** | **Fabricated citations** — the exact shape of failure #5 (fabricated physician review), one field over, on the tier no resolver can check (**Finding 3**). |
| **`S7`** | **Lorem/placeholder design** — the thing the stage is named for; a DO, not a DON'T, with an unenforced entry criterion (**S-2**). **Consent dark patterns** — the banner is treated as a layout object, not a legal instrument (**Finding 8**). |
| **`S8`** | **The build silently diverging from the approved S5 map** — the hinge's output has no conformance check anywhere in the pipeline (**Finding 6**). |
| **`S9`** | **Failure #9 (a rule declared binding whose enforcement was never built)** — which §0.5 assigns to `G9-PRE`. The hash binding checks that artifacts are unmutated, not that anything implements them (**Finding 6**). |
| **`S11`** | **POS-6's denominator error applied to performance data** — the rule exists in the repo, at the wrong stage (**S-5**). |
| **`§0.4` itself** | **MR-4 (a policy describing a process that does not exist)** — committed by the contract section, four screens above the table that names MR-4 as failure #6 (**Finding 4**). |

**`SX`, `S0`, `S1`, `S2`, `S4`, `S10`, `S12`** are not named above. `S2`'s DON'T list is the strongest in the document — every row has an artifact-checkable assertion and `G2-PRE`/`G2-CITE` are correctly specified as machine, not model. It is the model the other thirteen should be rewritten against. **That is the only unqualified thing in this review.**

---

## What I did NOT verify — stated as unverified (KD-f)

- **I ran greps and file-existence checks against this worktree, not `origin/main`** (BS-1). The 10 ABSENT scripts and the missing `docs/process/rubrics/` are true **here, at `a206791`**. If they exist on `main`, Findings 4 and 0's baseline change.
- **I did not run `audit-gpt.mjs` or `audit-perplexity.mjs`** against the draft. This review is a human-shaped read plus greps — **it is not an auditor verdict and must not be recorded as one.**
- **The external precedents I cite (CNIL €150M/€60M Dec 2021; EDPB Cookie Banner Taskforce Jan 2023; *Mata v. Avianca* 2023; Google's doorway-pages policy) are cited from my own knowledge and were NOT re-fetched.** They are named so they can be verified — **treat them as leads pending resolution, not as `[P]`.** Citing unverified precedent in a review complaining about unverified precedent would be the joke writing itself; they are flagged rather than dressed up.
- **Finding 1's claim that shatavari/gokshura are API Part I entities and absent from a dossier §11 is reasoning, not measurement** — the S2 dossier for whatisayurveda does not exist yet, so the exclusion cannot be demonstrated against a real corpus. **The quantifier gap in assertion #3 is textual and certain; the specific rows it lets through are inference.**
- **I did not check whether the six sibling research docs already contain any of these fixes** and were dropped in transcription — §14 found exactly that class of loss once (SP-9). **Some of these findings may be re-discoveries of text that exists upstream and did not survive the compile**, which would make them transcription defects rather than thinking defects — a different fix (generate, don't transcribe) and §14's own recommendation.

---

*Review v1.0 · 2026-07-15 19:22:18 IST · `a206791` · adversarial pass on the DO/DON'T theme only. Not a gate verdict. Not evidence anything ran.*
