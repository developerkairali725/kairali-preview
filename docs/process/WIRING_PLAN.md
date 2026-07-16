# WIRING PLAN — making `MASTER_PIPELINE.md` govern EVERYWHERE

**Written 2026-07-15 19:30:47 IST · as of commit `a206791` on `feat/wia-content-engine-research`.**
**Companion to `docs/process/MASTER_PIPELINE.md` v1.0. Executable as ONE PR.**

> **Abilash's instruction, verbatim:** *"Then come back with the revised plan, and **FIX IT EVERYWHERE IN THE REPO** — be it the landing page repo, the Shopify repo, the organic page repo, everywhere."*
>
> **What this document is.** A file-by-file edit list, so that after one PR: **the pipeline is the single source of process truth**, every other document either **points at it** or is **retired**, and **no stale contradicting process survives**. Every file below was **opened or grepped at `a206791`** — no file is listed from memory.

---

## §1 · THE PRINCIPLE — pointers, not copies

**We have already proved that duplicated doctrine diverges.** Three demonstrations on the record:

1. `inventory-existing-rules.md` **went stale in 27 minutes** — five material changes landed between 18:04 and 18:31.
2. `MASTER_PIPELINE_DRAFT.md` **dropped SP-9 silently** while claiming complete absorption; its own grep found it.
3. **Verified at `a206791`:** `M2_SHOPIFY_SETUP_PROMPT.md` exists at **root (191 lines)** *and* **`docs/` (117 lines)**, and they **DIVERGE** — while `CLAUDE.md` rule (j–s) cites it as the **source of binding doctrine**. *Two copies of a doctrine source, already drifted, one of them cited as authority.*

**Therefore the wiring rule, and it is not negotiable:**

> **A rule lives in exactly ONE file. Every other file that needs it POINTS at it by stage ID (`S0`–`S12`, `SΔ`, `SX`) or gate ID (`G<n>-<type>`). No file restates a rule it does not own.**

**And its corollary, from `MASTER_PIPELINE.md` §14's own recommendation:** *"this pipeline's rule-set should be **GENERATED from the repo**, not transcribed by hand."* Every hand-copied table in the list below is a future divergence. **Where I cannot generate today, I point.**

---

## §2 · ★ FILES WHOSE CURRENT CONTENT CONTRADICTS THE PIPELINE

**Read this section first. These are not tidying tasks — each is a live false statement in a governing document.**

| # | File | The contradiction — **verified by command at `a206791`** | Severity |
|---|---|---|---|
| **C1** | `SITE_LAUNCH_CHECKLIST_v1.0.md:8` | Header: ***"A · AUTOMATED CI GATES (merge-blocking; no human judgment involved)"***, and the section note *"A site physically cannot merge unchecked."* **FALSE for A5 (Lighthouse), A9 (OG render), A10 (alt text + favicons), A11 (link crawl) — four of thirteen have no machine.** | 🔴 **The document that certifies launches misstates what it certifies** |
| **C2** | `docs/seo/SEO_PLAYBOOK.md:63` | ***"✅ A10 — every image has alt text"*** — the legend defines ✅ as *"mechanically enforced (CI/spec/build-time throw)."* **No alt-text assertion exists among the factory spec's 12 tests.** | 🔴 **A ✅ that is not true — the exact class of claim `G9`'s DON'T #2 forbids** |
| **C3** | `M2_SHOPIFY_SETUP_PROMPT.md` (root, 191 ln) **vs** `docs/M2_SHOPIFY_SETUP_PROMPT.md` (117 ln) | **Two copies, DIVERGENT** (verified by `diff`), while `CLAUDE.md` (j–s) cites *"M2_SHOPIFY_SETUP_PROMPT v2 Phases 1.5 + 8"* as its **binding source**. **Which copy is v2?** | 🔴 **A doctrine citation pointing at an ambiguous target** |
| **C4** | `CLAUDE.md` rules **(n)–(s)** | Declares six sub-agents **binding**. **Verified: the six files exist at `shopify-agents/` and `.claude/agents/` DOES NOT EXIST. They have never executed.** Rule (q) is worse: *"the logger sub-agent is invoked by the PostToolUse hook — every change lands in `agent-log.jsonl`"* — **`post-edit.sh` runs a compliance lint only, never a logger, and `agent-log.jsonl` does not exist. The rule describes behaviour that has never occurred.** | 🔴 **Failure #9, live in our constitution** |
| **C5** | `CLAUDE.md` § *"STANDARD WORKFLOWS · Lane B"* | *"push to staging slug → run relevant specs + **19-gate check**"*. **No 19-item gate has ever existed** (Ship Gate A has 13). **An orphan reference in the workflow that governs every content change.** | 🔴 **Points at nothing** |
| **C6** | `CLAUDE.md` § *"TEST SUITE"* | *"`ktahv-critical-flows.spec.ts` is **the deterministic gate**… All tests green or the change does not ship."* **`playwright.config.ts` explicitly EXCLUDES it. The deterministic gate does not run.** | 🔴 **A gate declared, never executed** |
| **C7** | `docs/ENGINEERING_STANDARDS.md:33` | *"touch targets ≥ 44 px"* as the accessibility standard. **The standard we are legally held to is WCAG 2.5.8 = 24×24 CSS px** (`C4-TARGET`). 44px is a *design preference*; **stating it as the WCAG bar misdescribes the obligation** — and `G7-PRE` was checking the preference, not the standard. | 🟠 **Wrong threshold in the binding standards file** |
| **C8** | `docs/ENGINEERING_STANDARDS.md:17` | *"Performance budgets (**Checklist A5 gates these**)"*. **A5 is Lighthouse CI. It does not exist** — an explicit `# TODO` in `gate.yml`. **The budgets are gated by nothing.** | 🟠 **A budget with no enforcer, claiming one** |
| **C9** | `docs/design/DESIGN_DOCTRINE.md` §1.4 **vs** `DECISIONS.md` 15 Jul 14:30 | Doctrine **bans** *"needy patterns: please-don't-go exit popups"* outright, all registers, citing NN/g. **The Director commissioned exit-intent as a YES-candidate for lead-gen.** **Doctrine says never; the Director says yes-for-some.** | 🟠 **Unresolved — pipeline #9** |
| **C10** | `docs/design/LANDING_PAGE_DOCTRINE.md:3` | ***"DRAFT v0.9 — DO NOT SHIP ANY LP AGAINST THIS DOCUMENT YET"*** — while `CLAUDE.md` FR-5 and OP-4 both treat LPs as a **real, scheduled track**. **The track is scheduled and ungoverned.** | 🟠 **Pipeline #7** |
| **C11** | `docs/checklists/pagewise-migration-checklist.md` | **Assumes indexable pages.** There is **no LP pagewise checklist** (LP-11) — *"DOES NOT EXIST. OWNER UNASSIGNED."* | 🟠 **Track C cannot pass `G9`** |
| **C12** | `docs/checklists/*` | Both are **verbatim ingests of Abilash's Google Docs**, declared *"Source of truth"*. **They are pre-pipeline artifacts with no stage IDs and no gates** — and `LE-1` makes filling them a launch requirement. **Two sources of truth for what a launch owes.** | 🟠 **Ownership collision** |
| **C13** | `SITE_LAUNCH_CHECKLIST_v1.0.md` SG-G1 | Says **four** entity bots. **DECISIONS 14 Jul 17:35 says ~3 + Aarika separate.** | 🟡 **Superseded, still printed** |
| **C14** | `docs/checklists/pagewise-migration-checklist.md` (MC-P7) | **"FID reduced"** — **FID was replaced by INP in 2024**, and `docs/seo/SEO_PLAYBOOK.md` §1.2 **says so explicitly**. **The master checklist teaches a retired metric that our own playbook retires.** | 🟡 **Internally contradictory** |
| **C15** | `CLAUDE.md` § *"LAUNCH EVIDENCE"* | *"Before building any revenue site: research the niche's competitors"* — and **nothing anywhere warns against importing their IA**, which encodes *their* register and *their* legal exposure. **The rule supplies the input; no rule guards the hazard.** *(Our competitors are legally free to say "spa".)* | 🟡 **AP-29** |
| **C16** | Root duplicates | `PHASE0_STABILIZE_PLAYBOOK.md` (91 ln) and `KAIRALI_WP_FLEET_OS_v1.0.md` (168 ln) exist **identically at root and in `docs/`**. **Identical today; C3 proves what happens next.** | 🟡 **Divergence pending** |

---

## §3 · `CLAUDE.md` — the constitution

**`CLAUDE.md` stays the constitution. It does NOT absorb the pipeline — it points at it.** Rationale: it is loaded into every agent's context; a 2,181-line pipeline cannot live there, and a summary of it would be a second copy that drifts (§1).

| Section | Action | Exact edit |
|---|---|---|
| **NEW — at the very top, above "WHO I AM WORKING FOR"** | **ADD** | > **THE PIPELINE IS `docs/process/MASTER_PIPELINE.md`.** Every build, rebuild, content change and landing page executes its labelled stages **`S0`–`S12`, `SΔ`, `SX`, one at a time**, and the agent **announces the stage ID before doing the work**. This file holds the **hard gates and locked facts**; the pipeline holds **the order, the gates and the evidence contract**. Where they disagree, **the pipeline wins on process; CLAUDE.md wins on safety and facts.** |
| **HARD GATES 1–8** | **KEEP VERBATIM** | Absorbed to `SX`/`S10`. **They are safety, not process — no edit.** |
| **KTAHV LANGUAGE LOCK** | **KEEP + one line** | Append: *"The lock binds at **`S1`** (bound to the register), is **SCREENED at `S3` (`G3-PRE` #8) and `S5` (`G5-PRE` #9)**, written at `S6`, linted at `S8`. **⚠️ The DE/FR lists are SEEDS, unvalidated by native/legal review, and they gate CI today** — pipeline #12."* **This is D1 made real: the lock previously bound at S1 and was consumed by nothing until S6.** |
| **LOCKED FACTS** | **KEEP VERBATIM** | Absorbed to `S1`. |
| **PROOF-OF-WORK RULES** | **KEEP + one line** | Append: *"**A verdict is evidence only if it satisfies the `MASTER_PIPELINE.md` §0.2 VERDICT CONTRACT** — command, exit code, CI run URL, artifact hash, control probe. **A hash is not evidence of execution. A hand-written JSON is a .md file in a different costume.**"* |
| **★ STANDARD WORKFLOWS — Lane A / Lane B** | **🔴 REPLACE ENTIRELY** | Delete both lanes. Replace with: *"**Lane A and Lane B are superseded by `MASTER_PIPELINE.md`.** A new site or rebuild walks **`S0`→`S12`**. **Any change to a live site enters `SΔ` (§0.3), which routes it to the stage that OWNS the decision it changes** — copy → `S6`; new URL → `S5`; new cluster → `S3`; template → `S7`. **The '19-gate check' is RETIRED: no 19-item gate has ever existed.**"* **Reason: Lane B mapped content changes to a pre-launch proof gate — under which publishing herb monograph #5 required a 9-stage walk no domain has ever run.** *(C5 resolved.)* |
| **QA audit pass (weekly rotation)** | **UPDATE** | Point to `S11`. **ADD the injection/defacement screen** — *the rotation had 10 items and no check for the exact class we found live on a Kairali property on 14 Jul.* **ADD the monthly access review with a named owner** and **`G11-FLEET`**. |
| **TEST SUITE** | **🔴 CORRECT THE FALSE CLAIM** | *"`ktahv-critical-flows.spec.ts` **is excluded by `playwright.config.ts` and therefore does not run**. Per KD-g the fix is to **wire it (build #17)** — not to keep calling it a gate. Until then it is **NOT** the deterministic gate."* *(C6 resolved. **KD-g forbids weakening; it does not forbid telling the truth about what runs.**)* |
| **ESCALATION** | **KEEP** | `SX`. |
| **UNATTENDED RULE** | **KEEP** | `SX`. |
| **KNOWLEDGE & VERIFICATION DOCTRINE (a)–(i)** | **KEEP + map** | Append stage IDs: (a)→`S0`/`SX` · (b)→`S12` · (c)→`S11` · (d)→`S7` · (e)→`S8` · (f)→`SX` · (g)→`SX` · (h)→`S8` *(⚠️ **no code-review job exists in either workflow — build #17**)* · (i)→`S8`. |
| **★ SHOPIFY TRACK DOCTRINE (j)–(s)** | **🔴 KEEP (j)–(m), CORRECT (n)–(s)** | **(j)–(m) keep verbatim** — they are safety. **(j) gains:** *"and `G5-EXEC`'s **post-execution admin diff** is what makes this a check rather than a slogan. **Un-diffed execution is an unverified claim.**"* **(k) gains:** *"`guard.sh` **must** block `*.myshopify.com/admin/api/*` on mutating verbs — build #5. **The DNS API is already blocked by URL pattern on line 26; this is a copy of that line.** Until it ships, (k) is prose."* **(n)–(s): REPLACE the word "binding" with the truth** — *"**Status, verified at `a206791`: the six agent files EXIST at `shopify-agents/`. `.claude/agents/` DOES NOT EXIST. They have never executed. This is a WIRING task (build #8), not an authoring task.** Rule **(q) is FALSE as written**: `post-edit.sh` runs a compliance lint only, never a logger; `agent-log.jsonl` does not exist. **(q) is SUSPENDED until the logger exists.**"* **Reason: (n)–(s) are failure #9 — declaring a rule binding whose enforcement was never built — live in our own constitution.** *(C4 resolved.)* |
| **CRASH RESILIENCE** | **KEEP** | `SX`. |
| **LAUNCH EVIDENCE & COMPETITIVE RESEARCH** | **KEEP + one line** | Append: *"Competitor research feeds **`S4`** (difficulty) — **never `S5`.** **DON'T import a competitor's IA:** it encodes *their* offer, *their* register and *their* legal exposure. Our competitors are legally free to say 'spa'. Competitor structure is logged in `<domain>-ia-conflict-log.md` as **an instrument to be resisted**, never a fourth source of truth."* *(C15 resolved.)* |
| **OPERATING PRINCIPLES** | **KEEP + one line** | OP-4's *"early-wave speed builds"* → *"now a mechanism, not a note: the **TIER** model (FULL/LITE/MIN), declared at `S1`. **Machine gates bind on all three tiers — they are free.** Only prose and human attention scale."* |
| **★ BUILD DECISION MATRIX (1–4)** | **🔴 REPLACE with a pointer + the two rulings it lacked** | Delete 1–4. Replace with: *"**Superseded by `MASTER_PIPELINE.md`.** Its four rulings are absorbed: **(1) MINE FIRST** → `S0`, with a gate. **(2) PROTECTION MAP** → `S0` deliverable, **merged into `S5`**. **(3) Lean at birth, complete at launch** → `S10` (BM-3). **(4) PACE** → the tier model + the 3-sitting Director budget. **TWO RULINGS ADDED, both absent here: ① On a relaunch the protection map IS A PROVISIONAL ARCHITECTURE, and for KEEP-AS-PAGE verdicts backed by measured legacy signal, `S0` OUTRANKS `S4` — you cannot 'kill' equity you already own, you can only discard it. ② Archetype `R` (relaunch) exists alongside {E,L,N}: its verdicts are relaunch now / later / leave as-is / retire, and its criterion is equity at risk — not a reverse income statement for a site that has been trading for years.**"* |
| **CHANGELOG** | **APPEND** | `v1.5 (15 Jul 2026): MASTER_PIPELINE.md ratified as the process source of truth. Lane A/B and BUILD DECISION MATRIX superseded. (n)-(s) corrected to their verified state; (q) suspended. 19-gate reference retired. Test-suite claim corrected.` |

---

## §4 · `SITE_LAUNCH_CHECKLIST_v1.0.md` — the Ship Gate

**Verdict: RETAIN as the launch evidence pack. RETIRE as an independent rule source.** It is the `S9`/`S10` **artifact**, not a parallel process.

| Section | Action | Exact edit |
|---|---|---|
| **Header** | **ADD** | > **This checklist is the `S9` + `S10` evidence pack of `docs/process/MASTER_PIPELINE.md`. It is not an independent process. Every item maps to a stage; nothing new enters here without a gate or a `NOT-YET-AUTOMATED` mark (X-6).** |
| **★ §A header** | **🔴 CORRECT THE FALSE CLAIM** | Replace *"AUTOMATED CI GATES (merge-blocking; no human judgment involved)"* and *"A site physically cannot merge unchecked"* with: **"§A · GATES — 9 of 13 automated, 4 NOT. Verified."** Then mark **A5, A9, A10, A11** individually: **🔴 NOT-YET-AUTOMATED — builds #15, #18.** *(C1. **Per KD-g the fix is to BUILD the machines. But the claim must stop asserting they run today** — a false ✅ is worse than an honest 🔴, because it stops anyone building it.)* |
| **A4** | **UPDATE** | *"touch targets ≥44px"* → *"**`C4-TARGET`: WCAG 2.5.8 — 24×24 CSS px is the GATE. 44px remains the design preference.**"* Add **`C4-AXE`** (axe-core, every template) and **`C4-CONTRAST`** — **the accessibility tributary has no gate at any stage today.** *(C7.)* |
| **SG-B1** | **🔴 MOVE OUT** | *"**SUPERSEDED.** The keyword→URL map is produced at **`S3`**, consumed at **`S5`**, and **`G9-PRE`'s conformance check proves the build honoured it**. **It cannot live at launch: with no IA stage to feed, a keyword map has nowhere to go but into frontmatter after the pages already exist.** ★ **This single item is the inversion Abilash is correcting.**"* |
| **SG-B2** | **UPDATE** | **Name AEO explicitly** (X-16 ruled 15 Jul 15:46; *this checklist still does not name it*) → `S6` + `S9`, **rank-calibrated per pipeline #3**. |
| **SG-B3…B12** | **UPDATE** | Point the event/CRM/UTM schema at **`S5.10`**: *"designed at `S5`, **verified** here — not invented here."* SG-B8 keeps its ★. |
| **SG-C1/C2/C3** | **REPLACE** | *"**Abilash's gates are now 3 per site**, defined in `MASTER_PIPELINE.md` §10.6: **`G4`** (GO/KILL + comprehension) · **`G5-HUMAN`** (the tree) · **`G-LIVE`** (preview + DNS, merged). Each arrives as a **one-page brief with a stated recommendation**."* |
| **SG-G1** | **🔴 RETIRE** | *"Four entity bots"* → **superseded** by DECISIONS 14 Jul 17:35 (~3 + Aarika separate). *(C13.)* |
| **NEW — §A0** | **ADD** | **"THE MATRIX WALK (`G9-PRE`) RUNS FIRST.** Every `S0`–`S8` verdict exists, PASSed, satisfies the §0.2 verdict contract, and its artifact hash still matches — **and the built site IS the `S5` map** (set equality). **Absence of artifact = FAIL. A verdict with `exit_code != 0` and `status: PASS` = FAIL. A verdict whose git-blame author is not a CI job = FAIL.**" |
| **NEW — §A-LP** | **ADD** | **"LP LAUNCHES USE `docs/checklists/lp-pagewise-checklist.md`"** — *which does not exist; owner unassigned* (C11, pipeline #7). |

---

## §5 · `docs/checklists/*`

| File | Action | Exact edit |
|---|---|---|
| `README.md` | **UPDATE the "source of truth" claim** | *"These are **Abilash's originals, ingested verbatim** — a **historical source**, retained unedited. **The operative process is `docs/process/MASTER_PIPELINE.md`;** the filled checklists are its `S9` evidence (LE-1). **Where a checklist item has no stage and no gate, it is a NOT-YET-AUTOMATED note, not a rule (X-6).**"* *(C12: two sources of truth for what a launch owes.)* |
| `sitewide-migration-checklist.md` | **KEEP VERBATIM + a header map** | **Do not edit the body** — it is Abilash's ingested original and editing it destroys the provenance. **Add a header table** mapping each section → stage: *Pre-Migration Planning → `S0`+`S4` · benchmarking → `S0` · redirects → `S0`→`S5`→`S10` · post-launch → `S11`.* |
| `pagewise-migration-checklist.md` | **KEEP VERBATIM + header map + one correction note** | Same treatment. **ADD:** *"⚠️ **MC-P7's 'FID reduced' is RETIRED — FID was replaced by INP in 2024**, and `docs/seo/SEO_PLAYBOOK.md` §1.2 says so. **This checklist currently teaches a retired metric our own playbook retires.** Use **INP ≤200ms** (SP-2)."* *(C14.)* **ADD:** *"MC-P3 (UTM naming) and the event schema are **`S5.10` decisions**, verified here."* |
| **`lp-pagewise-checklist.md`** | **🔴 CREATE — or record the block** | **DOES NOT EXIST (LP-11). Owner unassigned.** Needs: **noindex verified · message-match verified against the LIVE ad · attention-ratio audit · D&MR/healthcare copy scan · thank-you page exists and is noindex · CRM field arrival · offline conversion loop.** **Blocked on pipeline #7 (ratify the LP track). Until then Track C has no `G9` and cannot legally ship.** *(C11.)* |

---

## §6 · `docs/design/DESIGN_DOCTRINE.md`

| Action | Exact edit |
|---|---|
| **ADD a header** | *"Design executes at **`S7`** of `docs/process/MASTER_PIPELINE.md` — **against real `S6` content, never lorem ipsum.** `S7`'s entry criterion is `G6` PASS. **Brand tokens win over every skill and plugin (KD-d).**"* |
| **KEEP the legend** | Its ✅/🔍/⚠️ legend is **exactly the STATUS discipline the pipeline now mandates on every DON'T row (§0.4).** **This file got it right before the pipeline did — say so, and copy it, not the reverse.** |
| **★ §1.4 exit-intent** | **🔴 FLAG, do not resolve** | *"⚠️ **UNRECONCILED.** This doctrine bans exit popups outright, all registers, citing NN/g. **DECISIONS 15 Jul 14:30 commissions exit-intent as a YES-candidate for lead-gen.** **Doctrine says never; the Director says yes-for-some.** → pipeline #9. **Per OP-1 (pushback duty) this needs a plain 'this contradicts our own doctrine' conversation — not silent compliance, and not a silent doctrine edit.**"* *(C9. **The agent must not resolve this by editing the doctrine.**)* |
| **★ ADD to the DON'T set** | **The accessibility rows the repo has nowhere:** *"**DON'T close an accessibility gap with an overlay widget** — the FTC fined accessiBe **$1M (Jan 2025)** for claiming a widget makes any site WCAG-compliant, and ~25% of 2024 ADA suits cite overlays **as the barrier**. **Also a KD-g gate-weakening move.** ⚠️ *carried from `research-compliance.md`; not re-fetched — a lead, not a `[P]`.*"* · *"**DON'T report 'axe clean' as 'accessible'** — machines cover ~30–40% of WCAG; screen-reader pass, focus order and alt-text quality are `G7-HUMAN`."* · *"**DON'T ship a consent banner whose reject path is longer than its accept path** (CNIL €150M/€60M) — `G7-PRE` asserts click-depth."* · *"**DON'T publish an identifiable person without a release, or a patient without documented consent** — **[J]**, route to counsel."* |
| **DD-17 `soul.md`** | **UPDATE** | *"→ `S1`. **`G1-PRE` now asserts it exists and its glossary terms resolve.** Previously: adopted in doctrine, **built for ZERO sites.**"* |

---

## §7 · `docs/design/LANDING_PAGE_DOCTRINE.md`

| Action | Exact edit |
|---|---|
| **KEEP the DRAFT v0.9 warning** | ***"DO NOT SHIP ANY LP AGAINST THIS DOCUMENT YET"* stays until Abilash ratifies (pipeline #7).** **Do not quietly promote it.** *(C10.)* |
| **ADD a header map** | Mandate → **`S1`(C)** · VoC → **`S2`(C)** · **seeds → `S3`(C)** · break-even → **`S4`(C)** · **conversion map → `S5`(C)/`S5.10`** · compliance-before-build → **`S6`(C)** · attention ratio → **`S7`(C)** · `/lp/` noindex → **`S8`(C)** · **`SΔ`: a variant under an approved campaign mandate re-enters at `S6` and needs NO new Director gate.** |
| **★ §on keywords** | **🔴 RESTORE ALL THREE SOURCES — this is the finding that unblocks the track** | *"**SEED PROVENANCE RULE.** A keyword may enter an LP brief only if it is **(a)** a row in the account's search-terms report, **or (b)** a verbatim VoC quote, **or (c)** an explicit Abilash/Vikash **bid decision recorded in the brief**. **HALT IF: no live campaign exists yet** → the list comes from Vikash/Abilash's bid decision, explicitly recorded, and the page is built to the VoC. **It does not come from the agent's imagination, and it does not come from a third-party volume tool presented as fact.**"* **Reason: the draft kept only (a) — and a net-new campaign has no search-terms report, because the report is an OUTPUT of spend. The pipeline's only legal path to a new campaign was to have already run it.** |
| **LP-4** | **UPDATE** | *"★ *"the only place in the repo where audience psychology is bound to page structure"* — **now generalized to every track at `S2`.**"* |
| **LP-6 vs SG-F1** | **FLAG** | *"⚠️ Field minimization vs the exact-schema freeze **collide on LPs**. **LP doctrine is unratified, so the freeze wins by default — silently.** → pipeline #10. **Silent defaults are how average work happens.**"* |
| **LP-11** | **FLAG** | *"🔴 The LP pagewise checklist **does not exist. Owner unassigned.** Track C has no `G9`."* |
| **Human gates** | **ADD** | *"**Per CAMPAIGN, not per VARIANT.** A six-ad-group campaign owes **3 Director sittings, not 24.** *(Message-matched per-ad-group variants are the highest-ROI LP practice; a per-variant gate would make them the most expensive activity in the system.)*"* |

---

## §8 · `docs/M2_SHOPIFY_SETUP_PROMPT.md` + the root copy + `SHOPIFY_TRACK_CONTEXT.md`

| File | Action | Exact edit |
|---|---|---|
| **★ `M2_SHOPIFY_SETUP_PROMPT.md` (root, 191 ln)** | **🔴 RESOLVE THE DIVERGENCE — ASK FIRST** | **Two copies exist and they DIVERGE** (`diff` verified). `CLAUDE.md` (j–s) cites *"M2_SHOPIFY_SETUP_PROMPT **v2** Phases 1.5 + 8"* as binding doctrine. **Neither copy is labelled v2.** **→ ASK ABILASH which is canonical, then delete the other and leave a pointer.** **Do not guess: this file is the cited source of a doctrine that governs a live store with live ads.** *(C3. **HG-6: if a fact is missing, ASK.**)* |
| **The canonical copy** | **ADD a header** | *"Phases map to `MASTER_PIPELINE.md`'s Track B: **B0**→`S0` · **B1**→`S1` · **B2**→`S2` · **B3**→`S3` · **B4**→`S5` · **B5**→`S6` · **B6**→`S8` · **B7**→`S9` · **B8**→`S10` · **B9**→`S11`. **★ NEW: `G5-EXEC` — after a human applies B4's spec, the agent re-reads the admin and diffs applied-vs-spec. Un-diffed execution is an unverified claim.**"* |
| **★ Both copies — the Phase 8 agent claims** | **🔴 CORRECT** | Every statement that the six sub-agents run → *"**Verified `a206791`: the files exist at `shopify-agents/`; `.claude/agents/` does not exist; they have never executed. Build #8 is `mkdir` + `mv`.**"* |
| `SHOPIFY_TRACK_CONTEXT.md` (D8) | **KEEP + one line** | Moby Autopilot OFF stays verbatim. Append: *"→ `S11`(B). **Status: prose. Dormant — Triple Whale is free-tier, so Moby does not exist yet.** When it does, this needs a mechanism, not a sentence."* |
| **NEW in the canonical copy** | **ADD** | *"**`guard.sh` MUST block `*.myshopify.com/admin/api/*` on mutating verbs (build #5).** The Cloudflare DNS API is already blocked by URL pattern at `guard.sh:26`; **this is a copy of that line.** **Until it ships, doctrine (k) — the hardest safety constraint on this track — is prose.**"* |
| **`B-L1`–`B-L14`** | **POINT** | *"`shopify-catalog-lint.mjs` (build #19) is built to **`research-shopify-playbook.md`'s `B-L1`–`B-L14` spec, which already exists.** **Do not re-specify it.** *(The draft budgeted an M-sized build for a phantom while its specification sat finished in a sibling file.)*"* |

---

## §9 · `docs/ENGINEERING_STANDARDS.md`

| Section | Action | Exact edit |
|---|---|---|
| **Header** | **ADD** | *"Binding on every Factory site (CLAUDE.md rule i). **Executes at `S8` of `docs/process/MASTER_PIPELINE.md`; the accessibility and performance items are DECIDED at `S1`/`S7` and merely verified here — that is the whole point of the re-order.**"* |
| **★ Performance budgets** | **🔴 CORRECT + RE-STAGE** | *"(**Checklist A5 gates these**)"* → *"**⚠️ A5 (Lighthouse CI) DOES NOT EXIST — an explicit `# TODO` in `gate.yml`. These budgets are gated by nothing today (build #15).** **Re-staged: DECLARED at `S1` · BOUND at `S7`** (every hero video, font stack, carousel and motion decision cites the budget it spends) **· ASSERTED at `S8`** (a **bundle check** — cheap, deterministic, no browser needed) **· FIELD-VERIFIED at `S11`.** **INP is dominated by main-thread JS, and the route budget is spent by whoever ships the component** — gating it at S9 was the one place we failed to apply our own cost-curve argument."* *(C8.)* |
| **★ Accessibility** | **🔴 CORRECT** | *"touch targets ≥ 44 px"* → *"**`C4-TARGET`: WCAG 2.5.8 — 24×24 CSS px is the standard we are held to and the `G7-PRE` gate threshold. 44px remains our design preference and the B-14 probe.** Add **`C4-AXE`** (axe-core on every template, CI, `S7`) and **`C4-CONTRAST`** (token-level, at build). **⚠️ EAA/EN 301 549 scope is UNRESOLVED — enforcement began 28 Jun 2025 and it binds on where you SELL, not where you are based** (pipeline #21/#22). **And never report 'axe clean' as 'accessible' — `G7-HUMAN` is a named person.**"* *(C7.)* |
| **Images** | **UPDATE** | ES-8's source hierarchy gains: *"**every asset row carries `licence`, `rights_holder`, `release_on_file`, `expiry`.** `G7-PRE` asserts it. **[J] — route to counsel.**"* |
| **Amendments** | **APPEND** | `2026-07-15: re-staged per MASTER_PIPELINE.md. ES-4 → S1/S7/S8/S11. ES-7 → 24×24 as the gate.` |

---

## §10 · `docs/seo/SEO_PLAYBOOK.md`

| Action | Exact edit |
|---|---|
| **★ Line 63** | **🔴 CORRECT THE FALSE ✅** | *"✅ A10 — every image has alt text"* → *"**🔴 A10 — NOT ENFORCED. No alt-text assertion exists among the factory spec's 12 tests. Build #18.**"* **This file's own legend defines ✅ as *"mechanically enforced (CI/spec/build-time throw)"*.** *(C2. **This is exactly the claim class `G9`'s DON'T #2 forbids — and this file is where an agent goes to learn what is enforced.**)* |
| **Header** | **ADD** | *"SEO/AEO decisions are made at **`S3`** (demand + question harvest), **`S5`** (architecture — where keywords become URLs) and **`S6`** (answer shape). **This playbook is the reference, not the process.**"* |
| **★ §on answer-first / AEO lifts** | **🔴 RETIRE THE NUMBERS (SP-15)** | Any *"+32.8% / +30.6% / +25.5% / +22.9%"*-shaped claim → **DELETE.** Replace: *"**Answer-first, one-idea-per-section writing is kept — for HUMANS, for featured snippets, and for our own reviewers. It is NOT a proven AI-citation lever and is never scored as one.** `research-aeo-geo-first.md` §122 grades content structure/formatting **'A — proven ineffective'** across 252k trials: *'Formatting choices had **no impact**'*; Google, scoped to Search: *'you can ignore tactics like chunking content.'* **The four percentages have no source in any research file; the register marks them GAP #12.**"* |
| **★ §on mentions vs links (SP-17)** | **🔴 RETIRE THE NUMBERS** | *"0.664 vs 0.218 (~3×)"* → **DELETE.** *"**Our own fetched figures are backlinks ~0.194 and branded web mentions 0.656–0.709 — a RANGE, not a point estimate — and the study's authors state TWICE that correlation isn't causation.** Big brands have more of everything. **Directionally useful, causally worthless. It belongs to PR and YouTube, not to this pipeline, and we do not promise it as a build outcome.**"* |
| **§on freshness (SP-19)** | **🔴 RETIRE THE NUMBERS** | *"~25.7% / 76.4% within 30 days"* → **DELETE** (register: GAP #13, no source). Keep the direction: *"refresh money pages meaningfully; a build-time `lastmod` bump is the fabricated-review defect in another costume."* |
| **§1.2 INP** | **KEEP + point** | *"**This section is right and the master pagewise checklist contradicts it (MC-P7, 'FID reduced'). The checklist is wrong; fix it there.**"* *(C14.)* |
| **X-16 / AEO** | **UPDATE** | *"AEO+GEO = a **universal CHECK** on every site, built and future. **NOT a universal TREATMENT** — Cite Sources measured **−30.3% at rank-1** vs **+115.1% at rank-5** **[P]**. **Treatment is rank- and domain-calibrated at `S6`.** → pipeline #3 (amendment pending)."* |

---

## §11 · Per-site docs

| File | Action | Exact edit |
|---|---|---|
| **`docs/whatisayurveda-research/BUILD_PLAN.md`** | **★ PROMOTE — it is better than the draft was** | **Three of its constructs are ADOPTED into the pipeline and must be cross-referenced, not duplicated:** **§2.7's 35-rule content lint → `G6-LINT`, build #2** *(the machine layer at 3,400-page scale for ~$0 — and it was not on the draft's build list)*; **§3.4's phase table → the model for `SΔ`** *(better than anything the draft contained)*; **§4.1/4.2's institutional review line + dated roster → `S6`**. **ADD a header:** *"This plan executes `MASTER_PIPELINE.md`. **whatisayurveda is ALREADY LIVE — its work is `SΔ`, not S0→S10.** ⚠️ **Blocked on #1: where does 3,400 come from?** It is not derived from any ontology we hold; API Part I holds **621 drugs / 393 species**."* |
| **`docs/group-inputs/kairali-com-protection-map.md`** | **★ RE-LABEL** | *"**This is `S0`'s deliverable AND, on a relaunch, the PROVISIONAL ARCHITECTURE** (pipeline D4). Its §3's 13-route priority list — ranked by inbound-link mass × lead value × equity at risk — **is correct work and `S5` REFINES it; `S5` does not redraw it. For KEEP-AS-PAGE verdicts backed by measured signal, `S0` outranks `S4`.** ⚠️ **Its sibling-site 301s (12 → the live Shopify store, 6 → kairalicenters mid-rebuild, 3 → whatisayurveda) are a FLEET INVARIANT: they go in `docs/redirects/inbound-register.tsv` and are re-checked monthly by `G11-FLEET`. No per-domain gate can see a target die.**"* |
| **`docs/group-inputs/*-org-inventory.md`, `*-niche-brief.md`** | **UPDATE** | Header: *"`S0` (inventory) / `S4` (niche + competitor difficulty) input. **Competitor IA is an instrument to RESIST at `S5`, never a source of truth.**"* |
| **`docs/group-inputs/whatisayurveda-full-sitemap.md`, `-IA-roadmap.md`** | **★ RE-LABEL** | *"**These are `S5` artifacts produced BEFORE `S5` existed.** They must be **re-validated against `G5-PRE`** — locale coverage, 1:1 per locale, register scan, templated-set uniqueness — **before any further wave ships.** → pipeline #6 (the backfill contract)."* |
| **`docs/group-inputs/kairali-physician-roster.md`** | **UPDATE** | *"`S1`/`S6` input. **Reviewers are config/roster, never hard-coded; the head can change** — hence `headFrom`/`headTo`. **`resolveReview()` reads this. ⚠️ Blocked on #2 (Roshni's full name) and #17 (the staleness threshold N — Dr. Deepu John's call).**"* |
| **`docs/strategy/POSITIONING_AND_MOA.md`** | **★ RE-LABEL — the biggest unlock in the repo** | *"**This is `S2`'s primary input — a PIPELINE INPUT, not a library book.** POS-7/POS-8's per-stage buyer emotion **IS Abilash's needs/desires/fears layer, already written, consumed by nothing.** ⚠️ **POS-3/POS-6 bind at `SX` now: every ratio names its denominator; every percentage carries its n. The MOA numbers rest on a 58-booking sample — directional findings robust, exact percentages not.** ⚠️ **The DACH/France L4–5 sophistication score is `INFERRED-FROM-SECONDARY` and must not be treated as final** → #13."* |
| **`docs/rates/RATES_RECKONER.md`** | **ADD** | *"**The ONLY source of prices** (X-11). `S1` reads it; `S8` uses it; **price lint (build #16) enforces it. Abilash alone decides rates.**"* |

---

## §12 · Root-level docs

| File | Action |
|---|---|
| `QUESTIONS.md` | **APPEND all 26 open decisions** from `MASTER_PIPELINE.md` §13 + §13.1, **second-precision IST**, each naming its owner. **The 15 compliance/threshold questions have never been in QUESTIONS.md.** |
| `DECISIONS.md` | **APPEND on ratification:** the pipeline is in force · the AEO amendment (#3) · the tier model · the 3-sitting Director budget · the backfill contract (#6) · archetype `R` · `S0 > S4` for KEEP verdicts · the retirements (19-gate, SG-A-note, MC-P7's FID, SG-G1's four bots, SP-15/SP-17/SP-19's numbers, "AEO first" as a literal stage). |
| `BACKLOG.md` | **ADD builds #1–#21** in the §12.2 order. **#1, #2, #4, #5, #8 are the pipeline; everything after #14 is hygiene.** **Plus the two deferrals: replace the `[TM]` vendor-listicle evidence base; build a labelled corpus for Cohen's κ.** |
| `LEARNINGS.md` | **APPEND the meta-learning**, because it is the most transferable thing in this exercise: *"**A document written to prevent average work can itself be average, well-formed and false.** The draft claimed all four keyword failures were caught; three independent critiques traced our own failure through its gate, row by row, and it **passed**. **The claim was prose; the trace was a machine-shaped read.** Both `inventory-existing-rules.md` and the draft found real defects in themselves **only when tested against themselves.** → **Never accept an absorption/coverage claim without running it.**"* |
| `PROJECT_CONTEXT.md`, `START_HERE.md`, `NEW_DEVELOPER_PACKET.md`, `NEW_ENGINEER_DAY1.md`, `DEVELOPER_RUNBOOK_DAY1.md` | **ADD one line each:** *"**Process = `docs/process/MASTER_PIPELINE.md`. Read §A (one page) first.**"* **Do not summarize the stages in five onboarding docs** — that is five copies that drift (§1). |
| `MORNING_BRIEF.md` | **NO EDIT.** It is a **generated view** (BS-2). `scripts/brief-snapshot.sh` is its source. |
| **Root duplicates** — `PHASE0_STABILIZE_PLAYBOOK.md`, `KAIRALI_WP_FLEET_OS_v1.0.md` | **DEDUPE:** keep `docs/`, replace root with a one-line pointer. **Identical today (91/91, 168/168) — and C3 is what happens next.** |
| `SITE_DESIGN_LOCALE_REGISTER.md` | **UPDATE:** *"Locales are declared at `S1` and **ARCHITECTED at `S5.9` (the locale tree)** — mirror / diverge / out-of-scope per section, with a reason. **The hreflang cluster is derivable from the S5 map BEFORE build.** ⚠️ POS-18: German before Hindi on tourism/reference sites."* |
| `docs/MIGRATION_PLAYBOOK.md` | **RETIRE AS PROCESS → POINT:** *"Superseded by `MASTER_PIPELINE.md` `S0`/`S5`/`S10`. **Retained for its per-platform mechanics only.**"* **Grep it for any Lane A/B or 19-gate reference and delete those.** |
| `docs/KAIRALI_30DAY_BUILD_RUNBOOK_v1.0.md` | **★ FLAG:** *"⚠️ **The 30-day sprint and the FULL-tier pipeline are in tension** — S2 alone at 5.5–7.5 days × 28 sites is 7–10 months. **The TIER model (FULL/LITE/MIN) is the reconciliation, and it is Abilash's call at `S1` per site.** **Machine gates bind on every tier — they are free.**"* |
| `docs/DELEGATION_PROTOCOL.md`, `docs/delegation-log.md` | **UPDATE:** *"A delegated task **names its stage ID**. A sub-agent returns **a §0.2-compliant verdict, not a claim.**"* |
| `docs/SPRINT_STATE.md` | **UPDATE:** track per-site **stage ID + tier**, not free-text status. |
| **`wiki/`** | **ADD:** each site's wiki page carries its **current stage ID, tier, archetype, and open gate**. KD-b: pages **link to sources, never duplicate**. |

---

## §13 · New files this PR creates

| Path | Why |
|---|---|
| `docs/process/MASTER_PIPELINE.md` | ✅ **written** |
| `docs/process/WIRING_PLAN.md` | ✅ **this file** |
| `docs/process/rubrics/<gate-id>.md` | **The rubric layer §11.4 describes and §0.5 admits does not exist.** Build #5. **Until these exist, the DON'T tables are prose and `rubric_sha256` is a reserved field.** |
| `docs/redirects/inbound-register.tsv` | **The fleet invariant** (`G-FLEET`). No per-domain gate can express it. |
| `docs/checklists/lp-pagewise-checklist.md` | **LP-11. Blocked on #7.** |
| `.claude/agents/` | **`mkdir` + `mv shopify-agents/*.md`.** Build #8. **The authoring is DONE.** |
| `packages/ontology/` | **Built once, hashed, human-signed.** Build #21. **One audited artifact replaces 28 unaudited ones.** |

---

## §14 · PR SEQUENCE — and why it is two PRs, not one

**Abilash asked for "one PR". I am recommending two, and here is the reason:**

**PR-1 · THE TRUTH PR — merge this week, independent of ratification.**
Every 🔴 in §2 that is **a false statement about what runs today**: C1 (Ship Gate's automated claim), C2 (SEO_PLAYBOOK's ✅ A10), C4 ((n)–(s) + (q)), C5 (19-gate), C6 (the test-suite claim), C8 (A5 gates nothing), C14 (FID).
**These are not process changes. They are corrections of false claims, and they are true whether or not Abilash ratifies anything.** Every day they stay is a day an agent reads *"A10 is enforced"* and doesn't build it. **This PR needs no decision.**

**PR-2 · THE RATIFICATION PR — after Abilash's approval.**
Everything else: the CLAUDE.md pointer, Lane A/B → `SΔ`, the BUILD DECISION MATRIX replacement, the tier model, the 3-sitting budget, the new files, the per-site re-labels.
**Blocked on decisions #1, #3, #5, #6.**

**Neither PR ships a machine.** **Build #1 is a separate PR and it is the only one that changes what the repo can catch.**

---

## §15 · THE HONEST WARNING — read this before merging either PR

> **This wiring plan is a .md file describing edits to other .md files.**
>
> **Per the doctrine it wires in, it protects nothing.** After both PRs merge, the score in `MASTER_PIPELINE.md` §0.7 is still **1 of 9**. Every stage is still enforced by prose. The only difference is that **the prose no longer lies about which prose is enforced** — which is worth doing, and is not the same as being safe.
>
> **The thing that changes the number is `scripts/keyword-validate.mjs` + `scripts/seed-lint.mjs` (build #1).** Ten assertions, a four-state type, and Rule B. **Six greps and a type check, and our headline failure becomes structurally impossible for the first time since it happened.**
>
> **If only one thing in this exercise ships, it should be that — not this.**

---

## §16 · CHECKER PASS (doctrine (f))

**Verified by command at `a206791`:** every file path in this plan exists (or is marked as not existing, deliberately); `SITE_LAUNCH_CHECKLIST_v1.0.md:8`'s header text; `docs/seo/SEO_PLAYBOOK.md:63`'s `✅ A10` claim and its line-5 legend; `docs/ENGINEERING_STANDARDS.md:17`'s A5 claim and `:33`'s 44px; the **divergence** of the two `M2_SHOPIFY_SETUP_PROMPT.md` copies; the **identical** duplication of `PHASE0_STABILIZE_PLAYBOOK.md` and `KAIRALI_WP_FLEET_OS_v1.0.md`; `scripts/hooks/guard.sh:26`'s Cloudflare pattern and the **absence** of any Shopify pattern; the six agent files at `shopify-agents/`; the **absence** of `.claude/agents/`, `docs/process/rubrics/` and a code-review job; the three workflow files.

**NOT verified — stated as unverified:**
- **I did not read every listed file in full.** `MIGRATION_PLAYBOOK.md`, `DELEGATION_PROTOCOL.md`, `SPRINT_STATE.md`, the onboarding docs and `wiki/` were **listed from `ls` and targeted greps, not read end to end.** **They may contain further contradictions this plan does not name.** *(The completeness critique's lesson applies to me: treat this list as **a lower bound, not a census.**)*
- **I did not grep every file for Lane A/B or 19-gate references.** §12 instructs it for `MIGRATION_PLAYBOOK.md`; **it should be run repo-wide before PR-1 merges.**
- **`origin/main` was not consulted** (BS-1). This is `feat/wia-content-engine-research` @ `a206791`. **Rules present only on main are missed. Re-verify before merging.**
- **I ran no lint, build, spec or auditor. This plan is zero evidence that anything works.**
- **The two-PR split is my judgement** (§14), not a ruling.
- **C3's resolution requires Abilash** — I will not guess which `M2_SHOPIFY_SETUP_PROMPT.md` is v2 when it governs a live store with live ad spend behind its PDP URLs. **HG-6: if a fact is missing, ASK.**

---

*WIRING_PLAN.md v1.0 · 2026-07-15 19:30:47 IST · `a206791` · companion to MASTER_PIPELINE.md v1.0 · NOT RATIFIED.*
