# ADVERSARIAL REVIEW — COMPLETENESS · what MASTER_PIPELINE_DRAFT.md is MISSING

**Written 2026-07-15 19:22:10 IST · as of commit `a206791` on `feat/wia-content-engine-research`.**
**Target under review: `docs/process/MASTER_PIPELINE_DRAFT.md` v0.1 (written at `a6484b4` — already one commit stale).**
**Angle: COMPLETENESS ONLY.** Not order, not evidence quality, not tone. The question asked of every line: *what would a world-class practitioner expect to find here that is not here, and which stage should own it?*

**Method.** Every finding below is machine-verified by grep against the draft and its own research inputs, not asserted. Commands are pasted. Where I did not verify, I say so (§F).

**Verdict up front.** The draft's structure is sound and its stage spine is defensible. **Its completeness claim is not.** §14 asserts *"NOT ABSORBED: 0 / 252"* and calls the absorption claim *"machine-verified, not asserted."* That test ran against **one of seven input corpora**. Against the other six — the draft's own sibling research documents — the absorption rate is far worse, and the single largest omission is a **legal/regulatory tributary that appears zero times in the document** (C4, accessibility). The draft dropped precisely the layer that was most ready to be built: the parts of the research that had already been reduced to named, staged, fail/warn-classified gate specifications.

---

## §A · THE FINDINGS, most severe first

---

### F1 🔴 BLOCKING — All 17 specified compliance gates were dropped. C4 (ACCESSIBILITY) appears ZERO times in the entire document.

**Belongs in:** `S7` primarily (design), with checkpoints at `S1`, `S5`, `S6`, `S8`, `S9`, `S10`, `S11`. Build list `§12.2`.

`research-compliance.md` §7 is the most build-ready artifact in the whole research corpus: **17 gate IDs, each with a stage assignment, an implementation note, and a fail/warn verdict already decided.** It is a specification, not an essay.

```
$ for g in C2-SCHEDULE C2-TIER C2-MARKET C1-FORM C1-ART9 C1-PRECONSENT C1-BANNER \
           C3-REVIEW C3-SCHEMA C3-STALE C4-AXE C4-TARGET C4-CONTRAST C5-PDP \
           C5-POLICY C6-LP C7-LOCK; do
    printf "%-16s draft=%s\n" "$g" "$(grep -c "$g" MASTER_PIPELINE_DRAFT.md)"; done

C2-SCHEDULE draft=0   C2-TIER draft=0   C2-MARKET draft=0   C1-FORM draft=0
C1-ART9     draft=0   C1-PRECONSENT draft=0   C1-BANNER draft=0
C3-REVIEW   draft=0   C3-SCHEMA draft=0   C3-STALE draft=0
C4-AXE      draft=0   C4-TARGET draft=0   C4-CONTRAST draft=0
C5-PDP      draft=0   C5-POLICY draft=0   C6-LP draft=0   C7-LOCK draft=0
```

**Zero of seventeen.** The draft says at `S9`: *"Re-walk compliance C1–C7 — every tributary's artifact exists"* — a range reference to checkpoints it never names, never stages and never puts on the build list. `§12.2`'s 18-item build list contains **none** of them.

**And C4 is worse than dropped — it is quoted and then deleted.** The tributary letter itself is absent:

```
$ grep -o -E "\bC[1-7]\b" MASTER_PIPELINE_DRAFT.md | sort | uniq -c
   7 C1    7 C2    2 C3    1 C5    2 C6    4 C7
$ grep -c "C4" MASTER_PIPELINE_DRAFT.md
0
$ grep -c -i "axe-core" MASTER_PIPELINE_DRAFT.md
0
```

C1, C2, C3, C5, C6, C7 all survive. **C4 alone is gone** — while `§1.5` of the draft cites *C4's argument* to justify the whole re-ordering thesis: *"Accessibility alone: 1× at S7 vs 30× at S10."* The draft kept the rhetorical payload and discarded the mechanism. That is the exact shape of `MR-4` — **a document describing a process that does not exist** — committed by the document written to make `MR-4` impossible.

**What is concretely lost, all of it already specified and none of it in the draft:**
- `C4-AXE` — axe-core on every template in CI (S7/S8, **fail**). The draft's `G7-PRE` is *"brand-lint, 44px targets, focus visible"* — it does not run an accessibility engine at all.
- `C4-TARGET` — WCAG 2.5.8 target size **24×24 CSS px**. The draft's `G7-PRE` checks **44px** (the old ES-7 number) and never names 2.5.8 as a gate.
- `C4-CONTRAST` — token-level contrast validation at build.
- **The overlay ban.** `research-compliance.md` §5.4: the **FTC fined accessiBe $1M (Jan 2025)** for claiming a widget makes any site WCAG-compliant; 25% of 2024 ADA suits cite overlays *as the barrier*. The research pre-emptively flags that someone will propose a one-line widget to close the gate before launch, and rules it **no — also a doctrine (g) gate-weakening move**. The draft has no DON'T against it. This is a named, cited, foreseeable failure mode with a regulator's action behind it, and the DO/DON'T contract dropped it.
- **The honesty rule:** *"Never report 'axe clean' as 'accessible'"* — machines cover ~30–40% of WCAG at best; screen-reader pass, focus-order judgement and alt-text *quality* are human. The draft has no accessibility human gate anywhere, and `§10.6 FOREVER-HUMAN` does not list one.
- **EAA / EN 301 549 scope.** `grep -ci "EAA\|European Accessibility" MASTER_PIPELINE_DRAFT.md` → **0**. Enforcement began 28 June 2025; it binds on **where you sell, not where you are based**; the research calls the Shopify store's EU-consumer status *"the single highest-value unknown in this document."* Not in the draft, not in `§13`.

**Why this is F1 and not a nitpick.** `S7`'s gate is the one place the draft claims accessibility is decided (*"Accessibility is decided HERE — 1× vs 30× at S10"*), and the gate it specifies cannot decide it. Meanwhile the real accessibility machine (`SG-A5` Lighthouse a11y ≥95) is one of the four Ship-Gate items the draft itself proves is **not in CI**, and it sits at build-list #10. **Net effect: accessibility has no gate at S7, no gate at S8, a non-existent gate at S9, and no human anywhere. It is the one tributary with no defence at any stage**, in a fleet that ships DE/FR to EU consumers.

---

### F2 🔴 BLOCKING — The absorption acceptance test ran against 1 of 7 corpora. "Nothing silently dropped" is scoped to the register only.

**Belongs in:** `§14` (the Checker pass) and `§10` (the absorption map's contract).

`§14` is the draft's proudest section. It says the absorption claim *"is machine-verified, not asserted"*, greps 252 rule IDs out of `inventory-existing-rules.md`, reports **`=== NOT ABSORBED: 0 / 252 ===`**, and draws the lesson: *"An 'I absorbed everything' claim is a checklist item. Ungated, it was 99.6% true, which is the most dangerous kind of wrong."*

**The lesson was right and the test was under-scoped.** The draft has **seven** substantive inputs: the register plus six research documents. The grep tested the register. Three of the six research docs define their own deliverable IDs, and those were never absorption-tested:

| Corpus | IDs defined | In draft | Dropped |
|---|---|---|---|
| `inventory-existing-rules.md` | 252 rules | 252 | **0** ✅ (the tested one) |
| `research-compliance.md` | 17 gates (`C*-*`) | **0** | **17** 🔴 |
| `research-shopify-playbook.md` | 14 lints (`B-L1`–`B-L14`) | **0** | **14** 🔴 |
| `research-commercial-validation.md` | 15 checks (`MM-1`–`MM-15`) | 8 | **7** 🔴 |

```
$ for g in B-L1 ... B-L14; do grep -c -- "$g" MASTER_PIPELINE_DRAFT.md; done   # all 0
$ for i in $(seq 1 15); do grep -c "MM-$i\b" MASTER_PIPELINE_DRAFT.md; done
MM-1=1 MM-2=0 MM-3=0 MM-4=1 MM-5=1 MM-6=0 MM-7=0 MM-8=1 MM-9=0 MM-10=0
MM-11=1 MM-12=1 MM-13=1 MM-14=0 MM-15=1
```

**Real absorption: 260 of 298 IDs. 38 dropped — every one of them from a document the draft itself commissioned.**

**The compounding defect — the draft re-committed the exact error §14 says it fixed.** §14 records that 23 IDs falsely appeared absorbed *"caused by my own range notation (`SG-A1, A2, A3…` — where `SG-A2` never appears as a literal string)"*, and that they were **rewritten as explicit IDs so that this grep remains a valid check rather than a lucky one.** The draft then writes `G4-PRE` as **"MM-1…MM-15"** and `S9` as **"C1–C7"** — range notation, hiding 7 dropped MM checks and 17 dropped C gates behind a literal string that greps clean. The fix was applied to one corpus and the anti-pattern re-introduced for two others in the same document.

**`B-L1`–`B-L14` deserves its own line.** Build-list item **#15 is `scripts/shopify-catalog-lint.mjs`** — sized **M**, with no specification. **`B-L1`–`B-L14` *is* that specification** (Schedule-condition scan; hedge-word scan; substantiation coverage; canonical linking; filter-URL *function*; robots.txt tripwire; schema completeness; disclosure metafields; taxonomy coverage; orphan path; T5 stat leak; spec drift; harness-tag leakage; unsourced dates). It sits finished in a sibling file. The draft budgeted to build the phantom without noticing its spec already existed — the mirror image of handoff note 12 (*"the six sub-agents are a wiring task, not an authoring task"*), which the draft correctly caught for agents and missed for lints.

**Fix:** the acceptance grep must run over **all seven inputs**, range notation must be banned in gate cells, and `§10` needs a fourth table: research-document deliverable → stage.

---

### F3 🔴 BLOCKING — `S5`, the hinge, is completely locale-blind. The flagship ships EN/DE/FR.

**Belongs in:** `S5` (sub-steps, deliverables, `G5-PRE`).

`S5` is 107 lines and the draft calls it *"the hinge of the whole pipeline"*, *"his best call"*, *"the stage he correctly identified as missing."*

```
$ sed -n '686,792p' MASTER_PIPELINE_DRAFT.md | grep -i -E "locale|hreflang|DE|FR|german|french|language|translat|x-default"
E4 | Every target market pulled in its real languages | India = en + hi + Hinglish...   ← S3 entry criterion, inherited
Landing pages (C): 🔴 TRANSLATED — ...                                                  ← the word, unrelated sense
```

**Two hits, neither of them about the tree.** Not one sub-step (`5.1`–`5.8`), not one deliverable, not one `G5-PRE` assertion covers the multi-locale architecture. `G5-PRE` asserts *"1:1 keyword→URL · no dupes · every S0 KEEP URL has a home · every 301 single-hop to a non-thin target · zero orphans · every cluster adjudicated · URL grammar regex"* — **no locale dimension at all.** `keyword-url-map.tsv`'s named columns are `segment`, `awareness_stage`, `needs/desires/fears`, `will_it_sell`, `evidence provenance` — **no `locale` column.**

**Everything the pipeline knows about locales points at S5 and then stops:**
- `LF-3`: KTAHV = EN/DE/FR, *"every content change ships in all three or is explicitly flagged."*
- `POS-18`: **German before Hindi** on tourism/reference sites — a ranked, ratified locale priority.
- `S2`: DACH/France are **awareness Level 4–5**, India **Level 2–3** — *"a site whose sophistication level is misjudged will look generic no matter how good the design is."* **Different awareness levels mean different pages.** The draft argues this itself and then draws one tree.
- `S3` `G3-PRE` #2 gates demand by **locale × script**, producing per-locale demand — which `S5` then consumes into a locale-free map.
- `LF-4`: FR consultation slugs live under `/fr/…` — a **URL-grammar** fact, mapped to `S8`.
- `LL-2`: the banned-word lock binds **in DE and FR** (Kur/Urlaub/Luxus, cure/vacances/luxe) — and `S5`'s own ruling says the register lock can **override the sitemap**. It cannot override a tree that has no DE nodes in it.

**Consequence, stated in the draft's own terms.** The unanswered questions are: does DE/FR mirror EN 1:1 or legitimately diverge (Level 4–5 vs Level 2–3 says diverge)? What is the per-locale URL grammar? Which German keyword owns which German URL? How are hreflang clusters constructed *from the map*? **All of them get answered at `S8` by whoever writes the MDX** — and verified at `S8` by factory spec A7, which checks reciprocity of whatever was built. That is decisions locked at build and audited after: **`§1.5`'s "deepest flaw in our current process", reproduced inside the stage written to abolish it.** `SP-9`'s own warning — *"missing return links = the WHOLE CLUSTER is ignored"* — is a fact about an artifact `S5` never produces.

*Sharpening the irony:* `SP-9` is the one rule §14 caught itself dropping and restored. It restored the **row in the map**, not the **stage that would honour it**.

**Fix:** `S5.4` URL grammar gains a per-locale regex; `S5.6` gains a `locale` column and a per-locale keyword→URL binding; a new `S5.9` LOCALE TREE decides mirror-vs-diverge per section **with a reason**; `G5-PRE` asserts every declared locale has a tree, every EN node has a declared DE/FR fate (mirror / diverge / out-of-scope), and the hreflang cluster is **derivable from the map before build**.

---

### F4 🔴 BLOCKING — `G5-PRE` asserts three checks that are undefined, and the draft resolved three blocking research questions by silent default.

**Belongs in:** `S5` / `G5-PRE` / `§13`.

`G5-PRE` is the draft's flagship machine gate at the hinge. Three of its assertions cannot be implemented as written, because the sibling research **explicitly refused to invent the thresholds and escalated them as blocking**:

| `G5-PRE` asserts | Threshold defined? | Research says |
|---|---|---|
| *"every 301 single-hop to a **non-thin** target"* | 🔴 **No.** `grep -i "thin"` → 8 hits, **zero definitions** | `research-sitemap-ia.md` **Q2 (blocks G8)**: *"What makes a 301 target too thin? Word-count ratio? Section count? GSC-clicks threshold?"* |
| tree test at `S5.8` | 🔴 **Opt-out by construction** | **Q1 (blocks G15)**: *"Real users, team, or simulated? What success rate passes? NN/G publishes no universal threshold and I will not fabricate one."* |
| depth/fan-out budget (`5.7`) | 🔴 **No** | **Q6 (blocks G6)**: *"Hub fan-out ceiling. §6.1's '8–~100 spokes' was written on Miller (1981) alone. NN/G explicitly warns both extremes backfire"* |

**The tree test is the sharpest case.** `S5.8` is the only user-validation step in the entire pipeline. Its DON'T reads: *"DON'T record an LLM-simulated tree test as passing | **Tree test has named human participants or is marked NOT RUN**."* **"Marked NOT RUN" is a passing exit.** No gate requires it to run; no owner is named; no participant pool exists; no escalation fires. The research flagged the threshold as *blocking a gate*; the draft shipped an opt-out and stopped calling it blocked.

This is `§13` item 6 — *"LP doctrine is unratified, so the freeze wins by default, **silently**. Silent defaults are how average work happens"* — happening three times inside `S5`, unrecorded. Per the DO/DON'T contract (`§0.4`): *"A DON'T with no check is a **wish**, marked ⚠️, and is an open question — not a rule."* These three are wishes printed as machine assertions in a **BLOCK** row.

**Fix:** either define the three thresholds (an Abilash/named-human call, added to `§13`), or mark the assertions ⚠️ and downgrade the `G5-PRE` rows that depend on them. `§12.2` #8 (`sitemap-gate.mjs`, sized **M**) cannot be built until this is done — the estimate is currently against an unimplementable spec.

---

### F5 🔴 — No rollback plan. `S10` flips DNS on ranked legacy domains with no restorable-backup gate, no revert trigger, and no owner.

**Belongs in:** `S10` (deliverable + `G10-PRE`), `S11` (trigger), `§10.6` (owner).

```
$ sed -n '1052,1098p' MASTER_PIPELINE_DRAFT.md | grep -i -E "rollback|backup|revert|restore"
(d) The work. Backup → deploy → redirects live and tested...          ← one word, no artifact
Shopify (B): ... rollback = previous theme kept unpublished           ← the only real one
$ grep -ci "revert" MASTER_PIPELINE_DRAFT.md → 0
```

**"Backup" is a single word in a work-list arrow, with no deliverable, no gate assertion and no restore test.** `S10`'s deliverables are `publish-pack.md`, the post-publish diff and a CRM screenshot. `G10-PRE` asserts *"redirect tests, robots verified, post-publish fetch + diff"* — **nothing asserts that a backup exists, or that it restores.** Only the Shopify track has a real rollback, and it got one because Shopify's own irreversibility forced it.

**What this pipeline does at `S10`, without a way back:** flips DNS on domains carrying 12+ months of ranking value; deploys a 301 map that discards authority if wrong; files a Change of Address (a one-way signal to Google); cuts over Ads final URLs with live spend behind them; and on WordPress properties, touches a live production DB (`HG-8` forbids merging staging→prod, but **nothing requires a verified restorable backup before go-live**).

**And the loop that would catch a bad launch is advisory.** `S11` Day-1/Day-7 measure *"lead count vs baseline"* and *"pages indexed"* against the `S0` benchmark — **with no threshold at which anything happens.** `G11-PRE` is ***advisory***. So: no rollback artifact, no trigger, no owner, no time-box, and the only stage that could detect the need can't block. `MC-S1` (*"full backup"*) is absorbed to `S0/S1` in `§10.4` and never appears in a stage body. `SH-3` — *"pull the LIVE published theme, commit as rollback baseline; **say so in the commit if this is the store's only theme backup**"* — is the correct shape, and it exists for exactly one track.

**Fix:** `S10` deliverable `rollback-plan.md` — what is backed up, where, **the restore verified by a test restore**, the named human who executes, the revert trigger, and the decision time-box. `G10-PRE` asserts it exists and the restore test passed. `S11` gets a named regression trigger that escalates to that plan. Add the rollback executor to `§10.6 FOREVER-HUMAN`.

---

### F6 🔴 — `§13` drops 9 of 10 compliance questions for Abilash/counsel — including one that makes `§12.1`'s "✅ LIVE" ledger false.

**Belongs in:** `§13` (open decisions) and `§12.1` (the honest ledger).

`research-compliance.md` §8 escalates **10 questions**, headed *"Facts I do not have, that change the answer — I am not guessing at any of these."* `§13` carries **one** (D&MR Act verification, as item 9). Dropped:

1. **Does the Shopify store sell/ship to EU consumers?** — *"the single highest-value unknown in this document"*; decides **EAA** scope, strengthens **Art 27**.
2. **Do we have an Article 27 EU representative?** — targeting DE/FR without one is *"an open exposure at **€10M / 2% turnover**."* The draft mentions "EU Art-27 rep applicability" once, at `S1`, as a task — never as the **open, unanswered, quantified exposure** the research escalated.
3. **Is KTAHV registered under the Clinical Establishments Act 2010?** — material to the **GST characterisation**. The draft treats the GST/SCN exposure as fully handled by the word lint (`C7`). The register lock is the *language* half; **registration status is the other half**, and it is unanswered.
4. **Does KTAHV's enquiry form capture condition/ailment?** → decides the **GDPR Art 9 explicit-consent rebuild** (`C1-ART9`, also dropped per F1).
6. **DE/FR banned-word lists — native + legal review. Currently seeds, currently gating CI.** ← **see below**
7. **`lastReviewed` staleness threshold (N months)?** — *"Dr. Deepu John's call, not mine."*
8. **Retention periods per form** — *"needs a decision to be enforceable."* The draft's `S5` DO requires *"a retention period — in the sitemap"*; the decision that makes it writable is unmade.
9. **Grievance Officer + Nodal Officer** — real named people, per DPDP rule 6. `S5` lists "grievance officer" as a policy **node**; nobody has named the human.
10. **Do we advertise KAPPL products in the US/UK/EU today?** — decides whether FTC/CAP/NHCR analysis is live remediation or a future guardrail.

**Item 6 is the one that corrupts the ledger.** `§12.1 ✅ LIVE today (verified against source, not doctrine)` lists the compliance lint as live, and `S6`/`G6-PRE` marks the banned-word scan **✅ LIVE**. The research's `C7-LOCK` row says: *"Entity-scoped banned words, all locales (**exists**) | **DE/FR native+legal review outstanding**"*, and §5 is blunter: *"the DE/FR seed lists are **unconfirmed by native/legal review** … and **that gap is a live risk**."*

```
$ grep -i "native.*review\|seeds, currently" MASTER_PIPELINE_DRAFT.md   → (no hits)
```

**So the GST/SCN gate — the one with a tax liability behind it — is enforced in CI, in two languages, against an unvalidated seed list, and the draft records it as ✅ LIVE with no caveat.** That is a false-confidence entry in the section whose entire job is to prevent false confidence. `§0.5`'s failure #9 is *"declared rules 'binding' while enforcement was never built."* This is its sibling: **enforcement built on an unverified rule-set, reported as verified.** The draft's honesty discipline is applied to *whether a machine exists* and never to *whether the machine's inputs are correct*.

**Fix:** all 10 questions into `§13` and `QUESTIONS.md`. `§12.1` gains a **"validated inputs?"** column — a lint is only as live as its wordlist.

---

### F7 🟠 — `MM-14` (primary-source verification) was dropped by a document that admits it re-fetched zero sources. `MM-6` (maintenance in the cost ceiling) went with it.

**Belongs in:** `S4` (`G4-PRE`), `SX` (the general rule).

Seven of the 15 `MM-*` checks are absent (F2). Two matter beyond bookkeeping.

**`MM-14`** — *"Second-source cross-check on every number reaching Abilash **AND primary-source text verification of every `[P]` quotation and attributed procedure** — fetch/extract the source and **string-match the quoted words**."*

`research-commercial-validation.md` §13 records **why** it exists: during the research session, a fabricated procedural detail was added and *"dressed in the phrase **'Klein is explicit'**, which converts an invention into an authority's instruction"* — *"the July failure mode reproduced in a different tool, in this very research session, while researching how to prevent it."*

Now read the draft's own `§14`: *"**I did not re-fetch a single source.**"* The draft carries **[P]** primary-verified markers on the GEO paper's −30.3%/+115.1%, MT-Bench's 70/30/15%, Baymard, Google's docs and Klein's premortem — and `§0.4` defines **[P]** as *"artifact fetched and read."* **It was not fetched and read by this document.** The draft is honest about this in `§14`, and it dropped the one check designed to make the honesty unnecessary. **The `[P]` markers in `MASTER_PIPELINE_DRAFT.md` are currently unearned by the document's own definition** — inherited, not verified — and `MM-14` is the mechanism that would have caught it. `§12.2` has **`cite-resolve.mjs` at #9** for `G2-CITE`/`G6-CITE` (audience dossiers and page citations); **no gate resolves the pipeline document's own citations.**

**`MM-6`** — *"Reverse income statement present; **cost ceiling includes maintenance** | field 7 non-empty, **maintenance ≠ 0**."* The draft's `S4` requires the reverse income statement and never requires maintenance to be in it. This is not a bookkeeping loss:

> `S4` catches *"no single physician can genuinely review 3,400 pages"* — **content capacity, arithmetically tested, correctly promoted to a blocking question.**
> Nothing anywhere tests **maintenance capacity across ~28 sites**: `S11`'s weekly QA rotation (10 checks/site), `S12`'s retro-within-48h, the Monday ritual, redirects held ≥1 year, and a refresh cadence — **per site, forever.** `S4`'s capacity confirmation is scoped to *"every gating role"* **for the build**. `MM-6` is the field where the ongoing cost lands, and it was dropped.

**The identical arithmetic failure, one axis over, and the check that would find it is the one that got cut.**

---

### F8 🟠 — The pipeline is a one-way linear walk. There is no re-entry model, and the `S9` hash binding makes wave-2 content structurally impossible to ship.

**Belongs in:** `§0.2` (the stage contract), `S9` (`G9-PRE`), `S11`/`S12`.

```
$ grep -i -E "re-enter|reenter|partial walk|scope of change|which stage does|minor change" MASTER_PIPELINE_DRAFT.md
(no hits)
```

**Every site is modelled as a single greenfield-to-launch walk.** `S12` *"feeds learnings back to S1"* for **the next site**. Nothing says what happens when **this** site changes — and every site changes constantly:

- `S8` mandates **canary batches**: *"ship a few hundred highest-demand pages, confirm indexation and ranking, **then expand**."* Wave 2 enters at… which stage? New pages need new clusters (`S3`), new tree nodes (`S5`), new claims (`S6`). **The pipeline has no entry point for them and no partial-walk rule.**
- `S11` mandates *"refresh money pages meaningfully"* — a content change to a page whose `G6` verdict is hash-bound.
- `WF-B` (Lane B content changes, any tier) is absorbed to `S9→S10` — implying content changes skip `S3`–`S6` entirely. Nothing says so explicitly, and nothing forbids it.

**And the hash binding turns this from a gap into a contradiction.** `S9`'s central mechanism: *"Every verdict is bound to the SHA-256 of the artifact it judged… **Hash mismatch ⇒ the artifact changed after it passed ⇒ that gate is VOID ⇒ FAIL.** No exceptions."* Adding wave-2 pages changes `keyword-map.json`, `keyword-url-map.tsv` and the sitemap. **Their hashes move. Every dependent gate voids. `G9-PRE` fails — correctly, per its own rule — and there is no specified way to re-pass it short of re-walking S0–S8 for the whole site.** The mechanism the draft calls *"what converts the matrix walk from a ritual into a proof"* has no incremental mode, on a site whose plan is 3,400 pages shipped in waves.

**The unaddressed sibling: `C3-STALE` — review expiry.** `research-compliance.md` specifies `C3-STALE`: *"`lastReviewed` > N months → **warn**"* at `S11`, with *"N = ? (Abilash)"*. Dropped with the other 16 (F1). It matters because **`MR-1` is the repo's only working anti-fabrication gate and it has no time dimension**: `resolveReview()` throws on a named reviewer with no `reviewedOn`, a non-ISO date, or an off-panel reviewer — it does **not** throw on a review from four years ago. A page genuinely reviewed in 2026 still displays the physician's badge and `MedicalWebPage` JSON-LD in 2030. **`MR-1`'s own principle — *"the badge stays meaningful because it is never free"* — decays to false through time, not through fabrication.** The commercial-validation research even flags **Mayo's 2-year re-review cadence** as a claim needing live verification. On a YMYL health surface, this is the same defect as the fabricated review, arriving slowly.

**Fix:** `§0.2` gains a **change-scope model** — *"a change of class X re-enters at stage Y and re-walks gates Z"* (content edit → `S6`; new cluster → `S3`; new URL → `S5`; template change → `S7`). `G9-PRE` gains **scoped re-validation**: hashes are bound per-artifact, and an appended-to artifact re-passes only its own gate chain. `S11` gets `C3-STALE` with a physician-set `N`, and `resolveReview()` gains an expiry throw.

---

## §B · FURTHER REAL GAPS — smaller, still load-bearing

### F9 🟠 — Imagery has no rights, consent or licence layer. `S7` mandates photographing patients at a NABH hospital.

`S7` DO: *"**Real, art-directed photography of actual people/places.** Users ignore decorative stock but scrutinize real photos as content."* `ES-8`'s source hierarchy: *"Kairali library → manual galleries → **licensed stock** → AI-gen last (**never people on KTAHV**)."*

Nothing in any stage requires: a **model release** for an identifiable person; **patient consent** for imagery shot at a clinical facility (under GDPR, a photograph of an identifiable patient in a treatment context is Art 9 health data — the same category `C1-ART9` was written for; under DPDP it is personal data requiring notice + consent); or a **licence record** per asset. `docs/media/<domain>-manifest.md` (S0) and `IMAGE_MANIFEST.md` (S7) have no licence, rights-holder, release or expiry field specified. `DD-16` (C2PA/SynthID never stripped, IPTC labels at ingest) is marked **⚠️ prose** and there is no ingest gate.

The pipeline gates the **words** a physician says with `resolveReview()` and `G6-HUMAN`, and does not gate whether we have the right to publish **his photograph, or his patient's**. `S0` mines assets off legacy sites *"for reuse"* — inheriting whatever rights problem the legacy site had, with the same *"a 301 does not launder it"* logic the draft already applies to claims. **Fix:** licence/release/expiry columns in both manifests; an `S0` DON'T (*"don't re-use a mined asset with no licence record"*); an `S7` DON'T (*"don't publish an identifiable person without a release; don't publish a patient without documented consent"*); `G7-PRE` asserts every manifest row has a rights field.

### F10 🟠 — The measurement plan is provisioned after the build, and nothing ever scores the `S4` prediction.

`S4` DO correctly pre-sets success metrics (*"≥1 lagging + ≥2 leading, targets fixed, review date fixed"*) — **the best measurement content in the draft.** Then:
- The **event taxonomy** (`data-cta` names), GA4 conversion mapping, UTM naming (`MC-P3`) and the CRM field schema (`SG-B8`) are all at **`S10`** — provisioned at publish, i.e. `data-cta` names are invented at build time and conversions retrofitted onto them. That is the audit-after-build inversion, un-fixed for measurement. The **LP track already fixes this** (`S5`(j)'s conversion map: LP → thank-you → CRM schema → named human + SLA → offline conversion loop) — *"everything downstream of the button is architecture, and we have been discovering it after the build."* **The insight is written, on one track, and not generalized.**
- **Nothing closes the loop.** `S11` measures against the **`S0` benchmark**; it never mentions `S4`'s targets or its fixed review date. `S12`'s retro is about *what broke and what was manual* — process, not commercial outcome. `G11` is advisory. `§10.6` gives Abilash `G4-HUMAN` ("will it sell?") and **no stage ever tells him whether it did.** Cooper's stage-gate — the draft's own authority for `S4` — has a post-launch review against the business case. `MM-9`'s *"review date fixed"* is dropped (F2), so even the date has no gate.

**Fix:** `S5`/`S6` own the event + conversion schema (it is architecture); `S12` gains a **prediction-vs-outcome scorecard** against `business-case.md`, on `MM-9`'s fixed review date, with Abilash as owner.

### F11 🟡 — Live-site security stops at launch.

`S0` security-screens the **legacy** site — and earned it: a live gambling injection was found that way. `SX`/`SD-r` injection-screen scraped content. `G8-SEC` scans the **release diff**. **Nothing watches our own live sites.** `S11`'s weekly QA rotation is 10 items — broken links, 4xx/5xx, mixed content, mobile render, banned words, schema, forms+consent, `data-cta`, images, hreflang — **no defacement/injection check**, the exact class we found on a Kairali property on 14 Jul. `SD-s`'s *"security-auditor… monthly for the access review"* is absorbed to `S8`/`S11` and marked **🔴 PHANTOM** — noted, unscheduled, not on the build list. **Fix:** add an injection/defacement screen to the `S11` rotation; put the monthly access review on a calendar with a named owner.

### F12 🟡 — Performance budgets are the one cost-curve argument the draft doesn't apply to itself.

The draft's thesis is that a decision is cheapest at the stage that makes it. It applies this to accessibility (1×/30×), claims, and URLs — and **not to performance.** `ES-4`'s budgets (**first-load JS ≤130 KB/route**, video poster-first **≤4 MB** + reduced-motion, immutable caching) are absorbed to `S9` and marked *"depends on A5 (not in CI)"*. But a **hero video** is an `S7` design decision; a **font stack** is `S7`; a **carousel** is `S7`; the 130 KB route budget is an `S8` architecture constraint. None appear in `S7`'s DO/DON'T or `G7-PRE`. `grep "130 KB"` → **0 in the draft**. So performance is: not a design constraint, not a build constraint, and gated at `S9` by a Lighthouse job that does not exist (build-list #10). **`SP-2`'s "test INP, not FID"** is correctly captured as a *metric* — and INP is dominated by main-thread JS, which is a budget nobody sets at the stage that spends it. **Fix:** declare the budget at `S1`, bind it at `S7` (video/motion/font decisions cite it), assert it at `S8` (bundle check — cheap, deterministic, no Lighthouse needed), field-verify at `S11`.

### F13 🟡 — Two smaller silent drops worth naming.

- **Backlink outreach.** `MC-S5`: *"identify high-value backlinks to old URLs + **outreach to update**"* — absorbed to "S8/S9/S10" in `§10.4` and present in **no stage's work list**. `S0` does a *"backlink audit"*; nothing acts on it. On a migration of ranked domains this is a real, human, ownable task with no owner. → `S10`/`S11`, named human.
- **`S2`'s dossier has no locale requirement, and it is the only legal seed source.** `G2-PRE` asserts *"source URL + verbatim quote + date; §15 non-empty; segments ⊆ MOA set"* — **no per-locale coverage.** But §11 THEIR LANGUAGE is declared *"the ONLY legitimate source of non-ontology seeds at S3"*, `K3` says `seeds = K1 ∪ K2` and *"nothing else may enter"*, and `G3-PRE` #1 forbids `agent_constructed` seeds. **A dossier with zero Hindi/Hinglish verbatim passes `G2` cleanly and then leaves `G3-PRE` #2's Hinglish requirement with no legitimate upstream supply.** The `S2`→`S3` chain is gated at both ends and unbound in the middle. → `G2-PRE` asserts §11 carries verbatim material **per declared locale × script**, or names the gap in §15.

---

## §C · WHAT I CHECKED AND FOUND GENUINELY COVERED

Reported so the negative findings are calibrated, not padded.

- **Sitemap/IA as a real stage** — `S5` is real, not lip service: 9 entry criteria, 8 sub-steps, the `S5.3` URL-or-H2 adjudication with a stated decision procedure, an IA-conflict log, a linking law, real deliverables, three gates. It is the strongest stage in the document. (Its defects are F3/F4 — locale-blindness and undefined thresholds — not absence.)
- **Audience psychology** — `S2` `A2.4` unifies needs/desires/**fears**/likes/dislikes/objections; `A2.5` scores awareness × sophistication; the frozen-dossier-hash check against shoehorning is a genuinely good mechanism. `POS-7`/`POS-8` correctly promoted from library book to stage input.
- **Commercial validation** — `S4` is real: archetype E/L/N, reverse income statement, premortem, Cooper's four outputs, `G4-HUMAN` as FOREVER-HUMAN. (Gap: `MM-6` maintenance, F7.)
- **Internal linking** — `S5.7` + zero-orphan graph check in `G5-PRE`. Covered.
- **Migration/301 protection** — `S0` protection map → merges into `S5` → tested live at `S10` → held ≥1 year. Genuinely strong. (Gap: "thin" undefined, F4; backlink outreach, F13.)
- **Asset mining of legacy sites** — `S0` `(d)`5–6, `OP-3`, `X-17`, manifest with binaries outside git. Covered. (Gap: rights, F9.)
- **Brand/design gates** — `S7` + B-14 + brand-lint + the `X-6` lesson (*"items a machine can measure MUST be machine gates"*). Covered.
- **Security of the build** — `G8-SEC` zero-findings, gitleaks, `guard.sh`. Covered. (Gap: live sites, F11.)
- **Handover/ownership** — `§10.6 FOREVER-HUMAN` names every human gate. Covered for launch. (Gaps: rollback executor F5, backlink outreach F13, monthly access review F11, accessibility human F1 — the pattern is that *ongoing* owners are missing while *gate* owners are named.)

---

## §D · THE PATTERN BEHIND F1, F2, F6 AND F7

Four findings share one mechanism, and it is worth naming because a fix to any one of them will not fix the others.

**The draft absorbed the research corpus's *arguments* and dropped its *specifications*.** Every citation, statistic and rhetorical frame from `research-compliance.md` survives — the 1×/30× curve, *"not one of them is cheapest at S9"*, the tributary letters in prose. **The 17-row gate table did not.** Same for `B-L1`–`B-L14`, same for the 7 missing `MM-*` checks, same for the 10 escalated questions.

**This is a legible failure mode, not carelessness.** Prose absorbs into prose; a gate table has to be re-keyed, re-staged and put on a build list, which is work. The result is a document that reads complete and builds incomplete — and it is precisely the shape the draft warns about in `§0.4`: *"It had the shape of good work, and it shipped."*

**It also means the draft's central promise is unmet where it matters most.** `§12.2` is titled *"THE BUILD LIST — ranked by (stakes × mechanizability)"*. **38 already-specified, already-staged, already-fail/warn-classified checks were sitting in sibling files and did not make the list** — while list items #15 (`shopify-catalog-lint.mjs`, sized M) and #18 (process-claim register, sized M) are budgeted to build things whose specs are among the 38. The list is not ranked wrong; **it is drawn from the wrong universe.**

---

## §E · RECOMMENDED DISPOSITION

| # | Finding | Action | Blocking ratification? |
|---|---|---|---|
| **F1** | 17 compliance gates dropped; **C4 = 0 mentions** | Absorb the `C*` table into stage bodies; C4 into `S7` + `G7-PRE` (axe-core, 24×24, contrast, overlay ban, human a11y pass); all 17 onto `§12.2` | **YES** |
| **F2** | Absorption test ran on 1 of 7 corpora | Re-run the grep over all seven; ban range notation in gate cells; add `§10.5` research→stage table | **YES** |
| **F3** | `S5` locale-blind | `S5.9` LOCALE TREE; `locale` column; per-locale URL grammar; `G5-PRE` locale assertions | **YES** |
| **F4** | `G5-PRE` asserts undefined thresholds; 3 blocking questions silently defaulted | Define or mark ⚠️; add all three to `§13` | **YES** |
| **F5** | No rollback plan | `rollback-plan.md` + verified restore test in `G10-PRE`; `S11` trigger; named executor | **YES** |
| **F6** | 9 of 10 compliance questions dropped; DE/FR wordlist gates CI unvalidated | All 10 → `§13` + `QUESTIONS.md`; `§12.1` gains a "validated inputs?" column | **YES** |
| **F7** | `MM-14` primary-source verification, `MM-6` maintenance dropped | Restore both to `G4-PRE`; resolve this document's own `[P]` markers or downgrade them to `[S]` | High |
| **F8** | No re-entry model; hash binding blocks wave-2; no review expiry | Change-scope model in `§0.2`; scoped re-validation in `G9-PRE`; `C3-STALE` + `resolveReview()` expiry | High |
| **F9** | No imagery rights/consent/licence | Rights fields in both manifests; `S0`+`S7` DON'Ts; `G7-PRE` assertion | Medium |
| **F10** | Measurement provisioned after build; `S4` prediction never scored | Event/conversion schema → `S5`/`S6`; prediction-vs-outcome scorecard → `S12` | Medium |
| **F11** | Live-site security stops at launch | Injection screen into `S11` rotation; monthly access review scheduled + owned | Medium |
| **F12** | Performance budgets bound to no stage | Declare `S1`, bind `S7`, assert `S8` (bundle check), verify `S11` | Medium |
| **F13** | Backlink outreach unowned; `S2` dossier locale-unbound | Owner at `S10`/`S11`; `G2-PRE` per-locale assertion | Medium |

---

## §F · CHECKER PASS ON THIS REVIEW (doctrine (f))

*Re-read the instruction; diff claim vs machine evidence; list anything unverified AS unverified.*

**Verified by command, pasted above, reproducible:** the 17 `C*` gate IDs at 0 hits; `C4` at 0 and `axe-core` at 0 while C1/C2/C3/C5/C6/C7 are present; `B-L1`–`B-L14` at 0; the `MM-*` per-ID counts (7 dropped); `S5`'s locale grep over lines 686–792 (2 hits, neither about the tree); `S10`/`S11`'s rollback grep; `revert` at 0; `thin` never defined across 8 hits; no re-entry/change-scope language anywhere; the DE/FR-wordlist caveat present in `research-compliance.md` and absent from the draft; `130 KB`, `EAA`, `DPDP`, `model release`, `handover`, `refresh rota`, `expiry`, `decay` all at 0 in the draft.

**Verified by reading:** `MASTER_PIPELINE_DRAFT.md` in full (1,548 lines); `inventory-existing-rules.md` §§0–1.21 and §§5–7 in full, §1.14–§1.20 via extraction; `research-compliance.md` §§3–5.4, §7, §8; targeted sections of `research-commercial-validation.md`, `research-shopify-playbook.md`, `research-sitemap-ia.md`.

**NOT verified — stated as unverified:**
- **I did not read `research-aeo-geo-first.md`, `research-audience-and-psychology.md`, `research-auditor-gates.md`, `research-content-site-playbook.md`, `research-keyword-rigor.md`, `research-landing-page-playbook.md` or `research-practitioner-sequencing.md` in full** — only greps and targeted sections. **Given the F2 pattern (specifications dropped, arguments kept), those seven docs very likely contain further dropped specifications that this review did not find.** `research-keyword-rigor.md` alone raises **12** open questions by my grep and I did not check them against `§13`. **Treat F1/F2 as a lower bound, not a census.**
- **I did not re-fetch a single external source.** Every external claim here (Deque's 1×/5×/15×/30×, the FTC/accessiBe $1M settlement, EAA's 28 June 2025 enforcement, GDPR Art 27's €10M/2%, DPDP Rules' 13 May 2027, NN/g's thresholds, Mayo's 2-year cadence) is **`research-compliance.md`'s or its siblings' claim, carried forward as such** — the same limitation the draft declares in `§14`, and the same one `MM-14` (F7) exists to close. **This review does not independently establish any regulatory fact.**
- **I ran no build, lint, spec or auditor.** Where I call a check "not built", that is the inventory's verified claim inherited, not re-tested by me.
- **`origin/main` was not consulted** (BS-1). This is `feat/wia-content-engine-research` at `a206791`; the draft was written at `a6484b4`, so **the draft is already one commit stale and this review may be reviewing a superseded artifact.**
- **F9 (imagery rights) is the one finding with no repo or research citation behind it** — no source document raises it. It is **my judgement [J]** from the entity facts (a NABH hospital, `S7`'s "photograph actual people" mandate, GDPR Art 9). It should be checked with counsel, not accepted from me.
- **The severity ranking is judgement.** F1 is ranked above F2 because a missing accessibility gate is a live legal exposure while F2 is a process defect — but F2 *caused* F1, and an argument that F2 ranks first is reasonable.

**What this review is:** a completeness critique of a draft, produced by grep and reading. **It is a .md file. Per the doctrine it is written to defend, it protects nothing** — it is worth only the fixes it causes.

---

*critique-completeness.md · 2026-07-15 19:22:10 IST · `a206791` · adversarial review, completeness angle · findings only, no fixes applied.*
