---
report_id: RPT-20260719-M0A
date: "2026-07-19 13:05:11 IST"
task: "M0(a) — paper dry-run of one representative change through every phase/gate/register (merge plan §10)"
project: "OS v2 architecture merge (feature/os-v2-architecture, PR #167)"
source_tool: "claude-code (single-writer session)"
type: dry-run
supersedes: null
---

# M0(a) — PAPER DRY-RUN: one change through the whole merged OS

**Purpose (external review §12, adopted into plan §10):** walk ONE representative hypothetical
change through every phase, gate, and register of the merged architecture ON PAPER — count owner
touches, files produced, duplicate data — and DELETE machinery that earns nothing BEFORE any of it
is coded. Authority: D-20260719-06 (decisions taken autonomously, each reversible, each recorded).

**Why a CHANGE and not a site build:** the pilot (M4) already exercises the per-project walk
end-to-end on a real site. The inflation risk the reviewer flagged lives in the OTHER class — the
small change the OS will process hundreds of times. If a hero swap produces 16 artifacts and 8
owner signatures, the OS dies of its own paperwork in a month. So the dry-run walks the smallest
representative unit that touches every subsystem.

## 1. The hypothetical change (CH-1)

> **KTAHV — ayurvedichealingvillage.com `/consultation`: replace the hero image and retitle
> H1 + meta description (EN/DE/FR), triggered by a Phase-8 scorecard flag: impressions −32% QoQ
> on that URL.** Severity P2. Primary keyword unchanged (title sharpened within the approved map).

Representative because it touches: existing live site (rebuild-class machinery) · clinical entity
(register lock + HARD GATE 7 sign-off) · three locales (locked fact) · visual change (beauty +
design gates) · marketing surface (go-science) · SEO surface (baseline/monitoring) · a Phase-8
trigger (closes the full loop 8→2→…→8).

## 2. The walk (merged architecture, plan §2.1)

| Phase | What actually happens for CH-1 | Artifacts produced | Owner touches |
|---|---|---|---|
| 0 Classify | Classification rides the ISSUE ROW fields (site, class=organic, entity=KTAHV-clinical, locales). No new charter — the site's charter already exists. | 0 | 0 |
| 1 Baseline | READ the existing baseline register row for `/consultation` (GSC 16m series); freshness cited in the issue. No new baseline. | 0 | 0 |
| 2 Diagnose | Issue row ISS-nnnn: OPEN→EVIDENCED. GSC series hash-cited. Causal hypothesis (title CTR + dated hero). Opportunity economics: point estimate, labelled ESTIMATE (P2 → no sensitivity ranges, §7.1.13). | 1 (issue row) | 0 |
| 3 Strategy/spec | Keyword UNCHANGED → the signed FAT strategy still covers the page; no re-approval. Spec fields live IN the issue row. (If the primary keyword changed → strategy DELTA row → one owner word. Not this case.) | 0 | 0 |
| 4 Build | Feature branch, staging only (HG 1). Job spec GENERATED from the issue row (scope, tools, prohibited actions from HARD GATES + registry, cost budget). Golden page N/A (per-site gate). All three locales or flagged. **Clinical page content → Dr. Deepu John sign-off (HG 7)** — a v1 law, not new machinery. | 2 (PR, generated job spec) | 0 (+1 Dr. Deepu) |
| 5 QA | Diff-relevant gate subset: build-clean · factory-spec (consultation flow — mandatory for this page class) · compliance/banned-word lint incl. DE/FR equivalents · brand-lint · beauty-conformance (page) · go-science (content AND look — the hero is exactly its territory) · design Gate 2 element pass on the changed page · a11y. ONE evidence bundle + SHA manifest; state → STAGING_QA. | 2 (evidence bundle, manifest) | 0 |
| 6 Launch | Lane B (live WordPress): preview link → **Abilash approves (the ONE owner touch)** → Deepu publishes. Deployment-log row = pointer + hash, never a copy. READY_FOR_RELEASE→DEPLOYED. | 1 (deploy-log row) | **1** (+1 Deepu executes) |
| 7 Stabilize | Post-publish QA fetch + diff (v1 law) → LIVE_VERIFIED. Monitoring row: CTR/impressions vs baseline at 24h/72h/7d/28d, alert thresholds. Automated. | 1 (monitoring row) | 0 |
| 8 Monitor | Scorecard watches the metric. Closure precondition: **fix-one ≠ done grep** — same dated-hero/title pattern checked across ALL pages, ALL locales → MONITORED→CLOSED at day 28. | 0 | 0 |
| ADR | "Why this image / this title" is a stakeholder-questionable choice → ONE site-scoped decision record (decision altitude, §7.1.13). | 1 (ADR) | 0 |

**Totals: 8 durable artifacts · 1 owner touch · 2 other-human touches (both existing v1 law:
Dr. Deepu John sign-off, Deepu publish execution) · 0 reports (a change is not a research task).**

**The counterfactual (literal package reading, no scoping rules):** charter Gates 0–5 +
stabilisation-exit signed per engagement applied per change = 7 owner signatures · separate page
brief + page spec docs · design review Gate 1 on the new hero · full 69-gate battery (~28 min
measured in the PROMPT-4 pilot) · launch certificate · before/after PDF · a report with
dispositions. **≈ 16 artifacts, 8–9 owner touches, ~40 min machine time — for a hero swap.**
That delta is what this dry-run exists to delete.

## 3. Dispositions (R3 triad — every finding rowed)

| # | Finding | Disposition | Reason / rule issued |
|---|---|---|---|
| 1 | Charter gate events (Gates 0–5 + stabilisation-exit) applied per change would cost 7 owner sigs each | **IMPLEMENT** (M1 doctrine line) | **SCOPE RULE: phase-gate events bind PER PROJECT ENGAGEMENT (site build / rebuild / campaign), never per change. Changes ride the issue state machine + diff-relevant gates.** |
| 2 | Design external AI review Gate 1 (pre-content, image-seen) re-fired per asset swap duplicates Gate 2 + beauty + go-science on the same rendered artifact | **IMPLEMENT** (M1 doctrine line) | **SCOPE RULE: Gate 1 binds at design-DIRECTION altitude (new site, redesign, new LP template). Asset-level changes are judged by the Phase-5 battery, which sees the rendered page.** Not a weakening: no artifact class loses external-AI eyes; one duplicate pass per change is removed. |
| 3 | Full 69-gate battery per change (~28 min) vs diff-relevant subset | **IMPLEMENT** (M1: class-map dimension) | `gates/class-map.yaml` gains a **scope dimension: project vs change**; per-change gate set = diff-relevant subset resolved by policy composition (formalizing what severity classes already imply). Full battery stays per-site pre-launch + scheduled sweeps. Gates are not weakened; their BINDING SCOPE is declared, linted, and owner-visible. |
| 4 | Hand-authored job-spec YAML duplicates the issue row | **IMPLEMENT** (M2 generator spec) | **DELETE the standalone hand-written job spec.** The envelope is GENERATED from the issue row (one authoring surface, two views). Cost budget survives — it rides the generated envelope. |
| 5 | Launch certificate for a content change | **IMPLEMENT** (M1 registry row wording) | Launch certificate binds to Phase-6 SITE launches / DNS flips only; `n_a` for change-class work. |
| 6 | Package page-brief/spec templates per change | **IMPLEMENT** (M1) | **DELETE as separate per-change docs** — spec fields fold into the issue row; site-level specs remain the FAT strategy payload. |
| 7 | Before/after PDF per change | **IMPLEMENT** (M1) | PDF is the PER-SITE post-flip proof artifact (R6). Changes get the monitoring row only. |
| 8 | Opportunity-economics sensitivity ranges on P2/P3 | **IMPLEMENT** (already §7.1.13) | Point estimate + ESTIMATE label below high-value threshold. Confirmed by walk; no new rule needed. |
| 9 | Issue register vs QUESTIONS.md/BACKLOG.md overlap risk | **MONITOR** (M1 boundary doc, plan §7.1.7) | Walk confirms the boundary doc is needed: state-machine work items ≠ owner questions ≠ deferred polish. One item, one home, cross-referenced by id. |
| 10 | Deployment log could duplicate git/Vercel/WP history | **IMPLEMENT** (M2 format rule) | Log rows are POINTERS (ref + hash + timestamp), never copies. |
| 11 | Evidence referenced from both state machine and registry outputs | **IMPLEMENT** (M2 format rule) | ONE evidence bundle per change; every consumer references by path + manifest hash. Corrections = new run-id (§2.5). |
| 12 | Machinery that EARNS its keep for even a P2 change | **IMPLEMENT** (build as planned) | Issue state machine (the change gets a spine that today lives in chat) · monitoring row + baseline comparison (closes the loop v1 never closed) · ADR at decision altitude (answers "why this image" forever) · evidence manifest (cheap, scripted) · cost budget (the one failure class v1 had no gate for). |
| 13 | Metric dictionary vs baseline register duplication | **REJECT** (no change needed) | Clean by construction: dictionary holds DEFINITIONS (formula/source/red-flag), registers hold VALUES citing metric ids. No copying observed on the walk. |

**Nothing in rows 1–7 removes a v1 gate.** Every scoping rule above declares WHERE an obligation
binds; none weakens WHAT it obliges (rule g). Each becomes a `decisions/` record at M2; until then
this report + merge-continuity.yaml rows carry them.

## 4. Numbers the reviewer asked for

- **Owner touches per P2 change: 1** (Lane-B publish approval — identical to v1 today).
- **Durable artifacts per P2 change: 8** (issue row · PR · generated job spec · evidence bundle ·
  manifest · deploy-log row · monitoring row · 1 ADR). Counterfactual without scope rules: ~16.
- **Duplicate-data instances found: 4** (dispositions 4, 6, 10, 11) — all deleted/ruled before code.
- **Machine time per change: bounded by the diff-relevant gate subset** (minutes), not the full
  battery (~28 min, PROMPT-4 measured). Exact per-change timing gets measured on the M4 pilot.

## 5. What M1 must carry from this report (checklist)

- [ ] Doctrine line: phase-gate events bind per project engagement (disposition 1).
- [ ] Doctrine line: Gate 1 at design-direction altitude (disposition 2).
- [ ] `gates/class-map.yaml` scope dimension project|change (disposition 3).
- [ ] Registry wording: launch-certificate row `n_a` for changes (disposition 5).
- [ ] Issue-row spec fields replace per-change brief/spec templates (disposition 6).
- [ ] Boundary doc: issue register / QUESTIONS.md / BACKLOG.md (disposition 9).
- [ ] M2: job-spec generator (disposition 4) · pointer-only log rows (10) · single-bundle
  evidence rule (11).
