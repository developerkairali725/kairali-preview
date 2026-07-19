# OS v2 ARCHITECTURE MERGE PLAN — Digital Growth Agency OS 2026 × Kairali web-factory OS

**Written:** 2026-07-19 12:10:00 IST · session following handover `2026-07-19-handover-os-stabilized.md`
**Inputs:** owner-supplied v2 package (`docs/process/os-2026/`, SHA `046cba11…`, manifest verified 85/85) ·
owner requirements R1–R8 (DIRECTIVES.md D-20260719-03) · 16-agent full-text ingest (1.66M tokens, 15 readers +
completeness critic, zero uncovered content) · 6-lane paired-engine research sweep (541k tokens) ·
evidence: `docs/reports/2026-07-19-os-v2-evidence/`
**Authority:** owner directive D-20260719-06 — "take all important decisions on your own; build methodically."
Decisions taken are §7.1; the short list that stays owner-only is §7.2.

---

## 0. Verdict

The package is adopted as the **superstructure** — its 9-phase lifecycle (Phases 0–8), issue state machine,
benchmark classes, measurement dictionary, and register set become the master workflow spine. The existing v1
OS becomes the **enforcement layer inside it**: every HARD GATE, front gate, and audit gate survives verbatim
and is relocated to an explicit phase home (§4). Nothing is weakened (rule g). Where package language is
looser than v1 (gated-permission vs absolute bans, ACCEPTED_RISK escape hatches, off-repo evidence), **v1 is
declared supreme** and the package text is subordinated (§2.6, §8).

This is the owner's stated intent — "this is an evolution" — and it is also what the evidence says: the only
large-scale measured taxonomy of multi-agent failures (Berkeley MAST, 1,600+ traces) attributes ~41.8% of
failures to specification gaps and ~21.3% to verification gaps. v1's front gates and evidence law sit exactly
on those two classes. The package strengthens both; it must not be allowed to thin either.

## 1. What the package is (verified, not self-attested)

86 files; SHA-256 manifest independently recomputed — **85/85 match**. 24 workflow files ({B2C,B2B,D2C,Shopify}
× {new site, existing/migration, new organic, existing organic, new LP, existing LP}) sharing one byte-identical
skeleton + per-asset deltas; 11 specialist-manual DOCX (verified as renderings of the canonical .md sources —
excluded from doctrine; the committed source zip preserves them); 63-row metric dictionary; 18-stage tool
register; 13-row benchmark register; 60-source research register; 3 JSON Schemas; 14 CSV registers; 2 benign
stdlib-only Python utilities. Package QA self-attestations were re-verified independently where they matter;
two of its own counts were wrong (its QA report omits "partner" from the 7-way strategy set; a reader-claimed
"19 tool stages" is 18). **The 7 "00_SHARED_STANDARDS" files every workflow inherits DO NOT EXIST in the
package** — they must be authored at merge (§3.6); until then those references bind to nothing.

## 2. The merged architecture

### 2.1 Lifecycle: package Phases 0–8, with v1 gates pinned inside (normative numbering = Master OS §5)

| Phase | Name (package) | What lands here (merged) |
|---|---|---|
| 0 | Classify & charter | Project charter + workflow selection + access/risk register (package) · v1 **brief** front gate absorbs into Gate 0 · entity/register lock declared (KTAHV clinical etc.) |
| 1 | Baseline & discovery | v1 **MINE FIRST** + **NEW baseline gate (R6)**: `scripts/seo-baseline.mjs` DataForSEO old-site register + PDF, GSC 16m + GA4 export, frozen immutable + hashed. For greenfield: demand/opportunity baseline. Critic-verified 6-class URL disposition feeds… |
| 2 | Diagnose & prioritize | Issue register + causal hypotheses + opportunity economics (§2.4) + competitor gap + v1 **PROTECTION MAP** (KEEP/MERGE/301, verdicts now evidence-backed by Phase-1 numbers) |
| 3 | Strategy & specification | v1 **strategy front gate stays FAT** (one approval: sitemap + keywords + competitor-to-page map + integrations) — package page briefs/specs become its payload · v1 **design_source** gate (MODE A/B) + **design external AI review Gate 1** (pre-content, image-seen) sit at the exit of Phase 3 |
| 4 | Build (controlled) | v1 **golden_page** gate = first-artifact gate INSIDE Phase 4: one page, owner-signed, all later pages match · single-writer builds (research: multi-agent only for read-heavy work) · staging-only (HARD GATE 1) |
| 5 | Pre-launch QA | **The full v1 gate battery, undiluted**: 63-gate registry checklist + beauty-conformance + go-science + design external AI review Gate 2 (element-by-element, desktop+mobile) + Lighthouse/specs — PLUS package additions as NEW registry rows: redirect-map tests, axe-core accessibility, security/dependency scans, rollback verification, launch certificate |
| 6 | Launch command centre | Deployment log + live crawl + verification cadence (package) · **DNS flips remain HUMAN** (HARD GATE) · rollback authority human |
| 7 | Stabilize & verify | 24h/72h/7d/28d before/after comparison against the Phase-1 baseline register — the R6 old-vs-new proof artifact, feeding the owner's separate monitoring tool |
| 8 | Monitor & improve | STATUS.yaml fleet pulse (session cadence, unchanged) + package scorecards/experiment governance + evolution-layer scout reports (§3.1) |

Gate events: the package's own charter template signs **Gates 0–5 + stabilisation-exit** (7 signed rows — the
critic adjudicated these as approval EVENTS keyed to phases). Enforcement stays v1's:
`launches/<domain>/approvals.yaml` signed rows + `front-gate.mjs` CI block. The stops stay FEW and FAT —
approval-fatigue research (200+/day → rubber-stamping) says more gates would make oversight worse, not better.

### 2.2 Classification reconciliation (decision taken)

**Amended per external review (§12):** gate applicability becomes **policy composition** across declared
dimensions, not class-only. The registry's three lint-enforced site classes (commerce / organic / landing)
remain the primary dimension; `gates/class-map.yaml` adds deterministic dimensions — business model, asset
situation (new/existing/migration), entity register (KTAHV-clinical etc.), locale/market, platform — and a
gate row may bind to any combination. The lint verifies every dimension combination used by a real Kairali
property resolves to an unambiguous gate set, and the 24 package workflows are test vectors. The selector
never SILENTLY drives anything; it drives gates only through declared, linted rows.

### 2.3 Issue state machine & severity (adopted, constrained)

`OPEN → EVIDENCED → APPROVED → IMPLEMENTING → STAGING_QA → READY_FOR_RELEASE → DEPLOYED → LIVE_VERIFIED →
MONITORED → CLOSED` — no skips; failed live test regresses; **fix-one ≠ done grep rule kept as closure
precondition** (v1, absent from package). P0–P3 severity adopted. Two package escape hatches are constrained
(decision taken): **CONDITIONAL_GO never releases a CI merge-block** (conditions become tracked issues);
**ACCEPTED_RISK is owner-only, requires a DECISIONS.md ruling + expiry, and can NEVER apply to a HARD GATE or
registry gate** — expiry auto-reopens the issue.

### 2.4 Measurement layer (net-new, adopted whole)

Metric dictionary (63 rows, formula/source/red-flag/diagnosis per metric) + benchmark classes
(HARD/OWN/PEER/INDUSTRY/ECONOMIC/EXPERIMENTAL — package's undeclared PLATFORM/ACADEMIC classes in BMK-012/013
get declared as two additional classes rather than silently dropped) + target-validity fields + opportunity
economics (`expected incremental contribution` and `priority score` formulas, every input labelled
observed/calculated/estimated/assumed, sensitivity ranges on high-value bets). Labs/tool estimates are always
labelled ESTIMATE with GSC/GA4 as measured truth (HARD GATE 6).

### 2.5 Evidence law v2 (v1 root, package rigor)

- Root stays `launches/<domain>/` in the git monorepo — **"if it isn't in the repo, it didn't happen" survives**.
  The package's `clients/{client_id}/` tree is rejected as a root (degenerate for a single-owner fleet); its
  numbered RAW/PROCESSED/PUBLISHED layer taxonomy is adopted INSIDE `launches/<domain>/evidence/`.
- **SHA-256 manifests on every evidence bundle** (new `scripts/evidence-manifest.mjs`, port of the package's
  Python utilities extended with the §4 fields the shipped script omits) + validator wired into CI and Monday
  lints. Corrections = new run-id, never overwrite.
- Timestamps: **IST to the second remains canonical** (existing law); machine records carry a dual
  `collected_at_utc` field. Registers never fork on timezone again.
- Off-repo storage: only large binaries (video, crawls >50MB), and ONLY with a committed manifest + hash as
  the in-repo pointer of record. Everything else in-repo.
- Write-time sanitization: any scraped/LLM content entering evidence, reports, or decision records is fenced
  as inert data (zero-width/bidi-normalized); a lint rejects unfenced imperative-to-agent text (EV-2, §5).
- Package's 10-item "what must not count as proof" list adopted verbatim into PROOF-OF-WORK.

### 2.6 HARD GATES v2 = strict union (nothing dropped, six added)

v1 HARD GATES 1–9 survive **verbatim and supreme** — including the four the package omits (never self-merge,
Editor-role creds only, `--force-with-lease` only, Dr. Deepu John clinical sign-off) and v1's absolute bans
where the package would allow "with approval gate" (production writes, DNS/robots: the agent never does these
at all; humans do). Package additions become HARD GATES 10–15: **10** no disavow submissions; **11** no
consent/analytics/payment-logic changes; **12** no Shopify app install/uninstall or checkout alteration
(matches Track-B doctrine k); **13** no competitor outreach, review posting, or public comms; **14** no secret
exposure in any artifact; **15** the agent never installs a tool/package/MCP/skill it discovered through
research — it proposes with a candidate card, the owner approves, the vetting pipeline (§5 SE-5) installs.
Plus the package's no-self-approval of P0/P1 evidence (already implied by gate 9, now explicit).

### 2.7 Agent operating contract (adopted)

Per-task machine-readable job spec (YAML envelope: scope, input artifact ids + freshness, authorized tools,
prohibited actions **generated from HARD GATES + registry so it can never be narrower**, retry/timeout/**cost
budget**, output schema, gate + approver, definition of done). The 10-label evidence epistemology
(OBSERVED_FIRST_PARTY … ASSUMPTION, UNKNOWN) is adopted for every agent statement, with the binding v1
supremacy rule: **a fact-gap labelled ASSUMPTION still triggers an ASK (R4/HARD GATE 6) — labels never launder
an assumption into shipped content.** Cost budgets close the one failure class v1 had no gate for (prior-art:
token blowups are a recurring agent-failure mode).

## 3. New subsystems (the R1/R2/R3/R6/R7 build)

### 3.1 `evolution/` — the self-evolution layer (R1)

Design per the research lane (SkillSmith stabilizers, ThoughtWorks radar rings, eval-driven swaps):

- **`evolution/radar.yaml`** — one row per OS step (seeded from the R7 tool map): step, current tool, ring
  (adopt/trial/assess/hold), last_reviewed, review_by (honest per-domain staleness: AI-model rows ~4–8 weeks,
  framework rows ~quarter, doctrine rows 6–12 months), candidates.
- **`evolution/channels.yaml`** — the per-task-domain channels-to-monitor register the owner asked for
  (Anthropic/Claude Code + Next.js/Vercel + DataForSEO + Google Search Central + Shopify changelogs; ChatGPT +
  Perplexity API notes; ThoughtWorks Radar; curated agent-OS research trackers; named subreddits/HN as
  UNTRUSTED tier), each with trust tier and poll cadence. Owner approves the register and every addition.
- **TWO-LAYER CADENCE** (amended per external review §12 — detection separated from evaluation):
  **Detection layer:** critical channels (security advisories, Google Search Central, Claude/OpenAI/Perplexity
  API changes, Next.js/Vercel, Shopify, DataForSEO) are consumed as FEEDS — RSS/changelog polling DAILY via
  the scheduled-tasks runner, not weekly discovery; low-risk research channels sweep weekly on the Monday
  slot + monthly deep pass on the 3 stalest radar rows. **Evaluation layer (gated):** per-phase/per-task =
  mandatory LOCAL radar lookup (seconds, offline; "radar checked, no change" log line); a live paired-engine
  search fires when a row is stale, a capability gap appears, a detection-layer event lands, or the task is
  volatile/high-impact (those force a freshness check). This satisfies "check before every task" without
  per-task web latency, context pollution, or injection surface — and events can actually fire the trigger.
- **Ring promotions**: assess→trial needs a candidate card (what it replaces, expected measurable gain,
  rollback, HARD-GATE conflict check) + sandboxed pilot scored by the EXISTING audit harness vs incumbent
  baseline; trial→adopt needs owner sign-off + one supervised real use. Anti-pattern log (amended §12): every
  rejection stores signature + reason + review_by; the scout suppresses EXACT-duplicate re-proposals until
  review_by, but a candidate whose version, evidence, cost, or threat profile has MATERIALLY changed reopens
  with the original rejection surfaced and answered — "doesn't come back again" must not mean "can never be
  reconsidered when the world changes."
- **The scout is architecturally quarantined** (§5 SE-1): reads forums in an isolated no-side-effect session;
  output is a fixed data-only schema; it can never install, write doctrine, or touch client context. Evolution
  changes land as doctrine PRs with a continuity lint that **merge-blocks any evolution PR touching HARD
  GATES, registry semantics, beauty/GO-science rubrics, or front gates** (those keep the owner-ruling path).
  The agent never modifies its own evaluation criteria — the one bound every surviving self-improving system
  keeps. Slow lane for weak-signal domains (beauty, voice, go-science interpretation, clinical = frozen).

### 3.2 `decisions/` — decision provenance (R2)

Frontmatter-markdown ADR store, one decision per file: `decisions/` (global) +
`launches/<domain>/decisions/` (site-scoped). Fields: id, type (design.font | design.color | content.tagline |
seo.keyword | seo.sitemap | gate | infra | commerce…), status (proposed/accepted/rejected/superseded), date
IST, deciders, expected_outcome + confidence (decision-journal practice — beats hindsight bias), sources with
trust tier + retrieval hash. Body: context → drivers → options considered → outcome → **scientific rationale
with citations** → consequences. **Accepted records are immutable — change = new record with `supersedes:`**.
CI builds `decisions/index.json` for token-cheap agent queries; a Decision-Guardian CI step posts the records
governing any files a PR touches ("you are touching KTAHV typography — D-00xx governs this"); boot contract
loads the index so every session starts decision-aware. DECISIONS.md stays exactly as-is as the owner-ruling
capture channel; session-end promotes durable rulings into records (doctor checks none left unpromoted).
The package's 6-status decision/exclusion register becomes the disposition vocabulary. Answers the owner's
"why this font/color/tagline/keyword/sitemap" with a citable chain, forever.

### 3.3 Report store (R3)

`docs/reports/` gains frontmatter (report_id, date-time IST, task, project/site, source_tool, type,
supersedes) + a **mandatory dispositions block: every actionable finding rowed as
{finding, disposition: IMPLEMENT|REJECT|MONITOR, reason, owner, decision_id/PR, review_by}** — the exact
triad the owner dictated. IMPLEMENT links a decision record or PR; REJECT carries the reason into the
anti-pattern log; MONITOR appends to `launches/<domain>/monitoring.yaml`. Reports are hash-manifested,
versioned, never overwritten; index.json for fast retrieval at monitoring/planning/execution altitude.

### 3.4 Baseline gate (R6) — new front gate for rebuild-class sites

New registry row + front gate **`baseline`** between brief and strategy wherever a live predecessor exists:
`scripts/seo-baseline.mjs` (built in-house on the DataForSEO REST API, matching the auditor-script pattern;
the video's toolkit — github.com/zubair-trabzada/dataforseo-claude — studied as prior art only, not executed)
produces `launches/<domain>/baseline/`: per-URL register (crawl fields + GSC 16m + GA4 12m + ranked
keywords/ETV + backlinks + CWV + disposition + decision_ref) + immutable raw JSON + the **date-stamped PDF
with MONITOR/REJECT/IMPLEMENT sections**. Same register re-run at T+7/30/60/90 post-flip = the old-vs-new
proof feed for the owner's monitoring tool, with alert thresholds (impressions <70% baseline at day 14,
recovery <80% at day 60) and honest expectations (migration recovery is long-tailed; ~17-month full-recovery
averages exist in the literature). CI blocks the strategy approval row until baseline/ is committed.
**URGENT standing item (§7.2): GSC deletes beyond a 16-month rolling window permanently — export all legacy
Kairali properties THIS WEEK and enable BigQuery bulk export (it never backfills).** Mind the GSC two-account
trap. Estimates from Labs are always labelled ESTIMATE (HARD GATE 6).

### 3.5 Tool/skill map + gap audit (R7)

The 18-stage tool register is reconciled against what is actually installed: 9 stages covered today; the
gap-closers, in order: **(1)** DataForSEO — **amended per external review §12: bake-off before consolidation
doctrine.** Start with the NARROW REST integration `seo-baseline.mjs` needs (not the many-tool MCP), run it
on the pilot baseline against GSC/GA4 ground truth + one independent crawler sample, define tolerated
disagreement, keep a vendor-neutral raw schema and a documented fallback path; only after the bake-off does
consolidation become doctrine (an ESTIMATED $180–1,000+/mo of Semrush+Ahrefs+Screaming Frog+Similarweb+
BrightLocal subscriptions avoided — modelled from list prices, not a measured fleet figure). PAYG, $50 min
deposit — owner approval, §7.2; **(2)** free:
@axe-core/playwright into existing CI (accessibility gate) + ZAP baseline GitHub Action (security gate; PR
touches .github/ → CODEOWNERS approval); **(3)** Clarity projects for every launch site (only KTAHV has one)
+ uptime monitors; **(4)** GSC/GA4 connection — local service-account MCPs vs already-installed Composio hub
(§7.2: credential/evidence posture is the owner's call); **(5)** GBP API application (free, slow — start now).
The machine-readable gap list for ChatGPT counter-recommendation is committed at
`docs/process/os-2026/merge/gap-list.yaml`, with the two genuinely contestable calls flagged for attack:
single-vendor DataForSEO consolidation, and Composio-cloud vs local-MCP routing. Every future recommendation
carries an evidence tier (measured/vendor/anecdote); **vendor claims alone never justify adoption**.

### 3.6 The seven missing "shared standards"

The package's workflows inherit `00_SHARED_STANDARDS/00…06` — files that don't exist. They will be authored
once in `docs/process/os-2026/standards/`, mostly by MAPPING to existing v1 doctrine (URL/migration standard →
PROTECTION MAP doctrine; QA standard → registry; evidence standard → Evidence Law v2 §2.5; agent standard →
§2.7 + HARD GATES; metrics → §2.4; monitoring → Phase 7/8 spec), so every dangling reference binds to real,
owner-ruled text. The 9 embedded "AI-agent execution rules" are re-issued under owner authority with **rule 9
NEUTRALIZED** (§9).

## 4. Gate continuity table (R8 — nothing diluted)

| v1 mechanism | New home | Status |
|---|---|---|
| HARD GATES 1–9 | §2.6, supreme over all package text | verbatim |
| brief · strategy (fat) | Gate 0 · Phase 3 gate | unchanged, package specs become payload |
| design_source MODE A/B + REFERENCES.md | Phase 3 exit | verbatim (no package counterpart — inserted) |
| Design external AI review Gates 1+2 (image-seen, dual PASS) | Phase 3 exit · Phase 5 | verbatim |
| golden_page (one page first, all match it) | Phase 4 first-artifact gate | verbatim (no package counterpart — inserted) |
| 63-gate registry, 3 classes, lint | Phase 5 battery + §2.2 supremacy | unchanged; package checks ADD rows |
| beauty-conformance (doctrine + owner paper) | Phase 5 battery | verbatim, rubric untouched |
| go-science gate (KB-derived, fail-closed) + skill | Phase 5 battery + build-time guideline | verbatim; skill now properly installed, KB hash-pinned |
| KTAHV clinical lock + Dr. Deepu John sign-off | Entity register in Gate 0 + Phase 5 | verbatim |
| PROOF-OF-WORK + live-fetch diff | state machine LIVE_VERIFIED + not-proof list | strengthened |
| MINE FIRST / PROTECTION MAP / build matrix | Phases 1–2 | strengthened with R6 numbers |
| Evidence law (launches/, append-only, IST) | §2.5 | root + law unchanged, + hashes |
| Session state (boot/doctor/DIRECTIVES/STATUS) | unchanged; + decisions index + radar load | strengthened |
| POLISH TIME-BOX, crash resilience, pushback duty, unattended rule, Monday lints | unchanged; lints gain scout/freshness/manifest passes | verbatim |

## 5. Security controls delta (mapped to OWASP Agentic Top 10 2026)

Adopted into the build: **SE-1** quarantined scout sessions (ASI01/06) · **SE-2** data-only recommendation
schema with Unicode normalization · **SE-3** source trust-tier register — forum claims need independent
tier-1 corroboration; "multiple threads agree" never counts (GEO consensus is manufactured) · **SE-4** =
HARD GATE 15 recommend-never-install · **SE-5** tool-vetting pipeline (registry existence/age, version pin +
integrity hash, no auto-update, MCP tool-description TOFU hash-pinning — the postmark-mcp backdoor pattern) ·
**SE-6** evolution-PR continuity lint + TTL on adopted learnings · **SE-7** digest batching (approval-fatigue)
· **EX-1** risk-tier map for every new v2 action type · **EX-2** session budgets + blast-radius preflight
committed BEFORE state-changing batches · **EX-3** verifier separation — the session that BUILT never signs
its own gate pass; a context-clean verifier reads only intent spec + live output (TheAgentCompany documented
agents fabricating completions; Replit documented fabricated status) · **EX-4** agent/credential inventory +
one-command revocation runbook (ASI10) · **EV-1** hash-chained evidence (start with §2.5 manifests; full
chain if multi-writer arrives) · **EV-2** write-time sanitization · **EV-3** provenance schema with content
hashes + reject-ledger · **EV-4** CI-enforced append-only (a PR modifying an existing evidence file fails).

## 6. Prior-art learnings adopted (R5 — why, with receipts)

Project Vend (agent hallucinated payment accounts, drifted over weeks; oversight-agent hierarchy was the fix
that worked) → keep externalized state + independent auditors, never long-horizon autonomous trading of any
kind. Vending-Bench (meltdown loops rarely recover; variance is the signature) → unattended rule + fresh
sessions + never trust a single good run. TheAgentCompany (best agent 30.3%; fabricated completions) →
PROOF-OF-WORK + EX-3. MAST (spec 41.8% / verification 21.3%) → front gates + evidence law are load-bearing.
Anthropic multi-agent (15× tokens; "game of telephone" citation decay) → parallel agents for read-heavy
research only, single-writer builds, stages exchange raw evidence files not summaries. METR horizons (<10%
success beyond ~4-hour tasks) → chunk unattended work ≤ ~1-hour-human-equivalent with re-grounding between
chunks. Manus (filesystem-as-memory, keep failures in context, recite the plan) → v1's file discipline is
convergently correct; forbid scrubbing failed gate passes. Klarna reversal + Gartner cancel-rates → humans
stay permanently on the judgment layer; owner approvals are not transitional scaffolding. Scaled-content
enforcement (site-wide penalties for velocity+thinness) → new registry gate for organic sites: publish-rate
ceiling + human-editing evidence + E-E-A-T artifacts.

## 7. Decisions

### 7.1 Taken now under D-20260719-06 (each reversible, each will get a `decisions/` record)

1. Package = superstructure, v1 = enforcement layer; v1 supreme on every conflict (§0).
2. Registry classes stay supreme; selector is an overlay via `gates/class-map.yaml` (§2.2).
3. CONDITIONAL_GO never unblocks CI; ACCEPTED_RISK owner-only via DECISIONS.md, never on gates (§2.3).
4. Evidence root stays `launches/<domain>/`; package taxonomy nested inside; IST canonical + UTC dual-field;
   off-repo only for large binaries with committed hash manifests (§2.5).
5. HARD GATES v2 = strict union; six package additions adopted as gates 10–15 (§2.6).
6. Python utilities ported to `.mjs` (repo toolchain uniformity); package schemas forked into the repo,
   `additionalProperties` relaxed to admit v1 fields, versioned by their own decision record.
7. QUESTIONS.md / DIRECTIVES.md keep their jobs; the issue register tracks work items only (boundary doc).
8. Benchmark classes: declare PLATFORM + ACADEMIC as classes 7–8 rather than silently dropping BMK-012/013.
9. "Partner" stays in the 7-way strategy enum; its missing §5 procedure gets authored (one paragraph).
10. DOCX manuals excluded from doctrine as verified duplicates; zip remains source-of-record.
11. Evolution layer built exactly as §3.1 (quarantine, rings, three-trigger, anti-pattern veto).
12. Pilot-site criteria (§10, amended per external review §12): a rebuild with a **CLEAN live predecessor**
    (exercises baseline gate + protection map + full battery end-to-end WITHOUT coupling architecture
    validation to incident recovery). kairalicenters.com (rebrief parked in PR #132) stays a candidate ONLY
    after its shared-origin compromise scope is documented — a hacked predecessor also pollutes the baseline
    register with spam URLs, making it a bad first exercise of the baseline gate. Shortlist for your one-word
    pick in §7.2.
13. ADR granularity bar (amended §12, reconciling the reviewer's cut-list with your R2 ask): decision records
    are written at DECISION altitude, not keystroke altitude — one record per design direction/token set/
    sitemap/keyword map/named tagline choice (anything a stakeholder might later ask "why?"), never one per
    trivial instance; epistemic labels bind to decision-bearing claims, not every agent sentence; hash
    manifests bind to release-critical evidence bundles first.

### 7.2 Owner one-worders (genuinely yours — money, credentials, business facts)

- **GSC EXPORT (urgent, destructive clock):** approve the this-week 16-month GSC export + BigQuery enable for
  all legacy properties (16-month rolling deletion is permanent; two-account trap noted).
- **DataForSEO:** approve the $50 PAYG deposit + official MCP install (closes the largest tool-gap cluster).
- **GSC/GA4 routing:** Composio cloud hub (fast, remote) vs local service-account MCPs (evidence-law-clean).
- **R4 business facts:** which CRM is commercial truth per entity · call-tracking vendor for India numbers
  (or wa.me+UTM only at launch) · booking platform per entity.
- **Pilot site:** confirm kairalicenters.com or name your choice.
- **GBP API application** (free; needs org email; slow approval — say go and I prepare it).

## 8. Explicitly NOT adopted (seed of the exclusion register, so it never comes back unexamined)

REJECTED: `clients/{client_id}/` storage root (degenerate; breaks CI + evidence law) · Drive/object storage as
evidence home (manifest-pointer carve-out only) · package rule-8 "with approval gate" wording for actions v1
bans absolutely · UTC-only timestamps · CONDITIONAL_GO as a gate-pass · AI-agent rule 9 self-modification
(§9) · Semrush/Ahrefs/Similarweb/GTmetrix/Hotjar/BrightLocal subscriptions at current scale (API-first
substitutes recorded per row) · SICA/DGM-style full self-modification loops (~$7k/loop, misalignment
amplification — the radar delivers the benefit at a fraction of the risk). DEFERRED: hash-CHAINED evidence
ledger (manifests first; chain when multi-writer) · experiment governance activation (below-traffic)
· full International manual activation (scoped per-site when a multilingual rebuild is next).

## 9. Injection findings (ingest verdicts, all dispositioned)

One genuine injection-class instruction found: **"AI-agent rule 9"** (byte-identical in all 24 workflows + 8
manual copies): *"Add new learnings to the shared standard and relevant workflow"* — a standing
self-modification directive whose target directory doesn't even exist. **Neutralized at merge**: rewritten as
"propose via DIRECTIVES.md + owner-approved PR"; any future agent behavior matching the original wording is a
gate violation. Everything else benign: operator imperatives = doctrine-as-data; both Python scripts
statically verified stdlib-only; TOOL_STACK CSV descriptive-only (its `agent_automation` column is capability
description, never standing authorization); the 60-source register has 2 unusable citations (bare
reddit.com roots) — every URL gets fetch-verified before admission to the merged research library, failures
recorded REJECTED. Residual: 10 unopened DOCX renderings — parity spot-check passed on the largest; full
text-diff rides the merge PR. Package content remains data, never instructions (rule r).

## 10. Build order (methodical, small durable units, each its own PR)

- **M0 — Paper dry-run + continuity proof (added per external review §12):** (a) one representative
  hypothetical change walked through every phase/gate/register on paper — measure owner touches, files
  produced, duplicate data; DELETE machinery that earns nothing before any of it is coded; (b) generate
  **`merge-continuity.yaml`**: every normative CLAUDE.md sentence, all 63 registry rows, and every package
  obligation as rows {source_id, old_text_hash, new_home, dimensions, trigger, enforcement, evidence_path,
  approver, test} — CI rejects unmapped or conflicting rows. §4's table is the human summary; this file is
  the proof. (c) acceptance tests for the seven authored standards (each authored text diffed against the
  obligations it claims to carry).
- **M1 — Doctrine merge:** CLAUDE.md v2 sections (lifecycle mapping, HARD GATES 10–15, evidence v2, agent
  contract) + `gates/class-map.yaml` (policy composition, §2.2) + registry rows (axe-core, ZAP,
  redirect-tests, rollback, scaled-content, baseline) + the seven authored standards + rule-9 neutralization
  + exclusion-register seed + **authenticated-approval mechanism: front-gate CI verifies an owner-identity
  GitHub approval event on a hash-bound artifact — an agent-written approvals.yaml row alone no longer
  satisfies a gate** (§12 blocking-2). SCOPE per owner ruling 19 Jul (~13:40 IST, D-20260719-10):
  authenticated approvals bind FRONT GATES + doctrine/evolution PRs only; routine green technical PRs keep
  agent-armed auto-merge per D-AUTOMERGE-TIERS ("keep self merging"); learnings are always owner-approved.
  *No site code.* External review pass 2 runs on the M0+M1 diff before merge.
- **M2 — Mechanisms:** `evidence-manifest.mjs` + validator in CI · `decisions/` store + index + Decision
  Guardian · report-store frontmatter + dispositions lint · `evolution/` registers + scout scaffold + vet-tool
  pipeline · job-spec generator · verifier-separation harness · risk-tier map.
- **M3 — Data + tools (after §7.2 one-worders):** GSC/GA4 exports · DataForSEO MCP + `seo-baseline.mjs` ·
  axe/ZAP wiring · Clarity/uptime fleet coverage.
- **M4 — PILOT: ONE site** through the complete merged OS end-to-end (baseline → … → stabilize), every gate
  live, every register filled, timed and costed. Findings feed doctrine before any second site. **No other
  design/build work before the pilot completes — the freeze holds for everything else.**
- Frozen-PR ledger: unchanged this session; the 11 PRs get dispositioned against the new architecture in M1
  review (most parked design work will re-enter through the new Phase 3/4 gates).

## 11. External review round (D-20260719-04)

Run on this plan before deployment: ChatGPT (Sol, highest mode) + Perplexity (highest reasoning mode) —
constructive depth, not speed; unimportant feedback ignored with reasons.

## 12. External review pass 1 — verdicts and dispositions (run 2026-07-19 ~12:20 IST)

**Auditor 1 — `gpt-5.6-sol`** (evidence: `…-evidence/audit-gpt-sol-pass1-summary.md`). Verdict: quality
"average", do-not-deploy-M1-yet, 6 blocking findings. Dispositions:

| Finding | Disposition |
|---|---|
| Gate continuity manually asserted, not machine-proven | **ADOPTED** → `merge-continuity.yaml` + CI, now M0(b) |
| Owner approvals not authenticated (agent-written rows) | **ADOPTED** → platform-authenticated approval in M1; sharpest catch of the round |
| Class-only applicability can miss B2B/D2C/migration/entity controls | **ADOPTED** → policy composition, §2.2 amended |
| DataForSEO consolidation before bake-off | **ADOPTED** → narrow REST first, pilot bake-off, vendor-neutral schema, §3.5 amended |
| Evolution event-trigger can't fire on weekly discovery | **ADOPTED** → two-layer cadence, daily feeds on critical channels, §3.1 amended |
| Pilot on recently-hacked origin | **ADOPTED in substance** → clean-predecessor criterion, §7.1.12 amended (nuance: the rebuild never reuses the compromised host's code, but baseline pollution + coupling-to-incident-recovery are real) |
| Cut list (ADR granularity, label scope, hash scope, veto softening, dry-run first) | **ADOPTED with one push-back**: ADRs stay mandatory for every stakeholder-questionable choice per your explicit R2 ask, at decision altitude not keystroke altitude (§7.1.13); Decision Guardian KEPT (cheap, directly serves R2 retrieval); M0 paper dry-run added |
| "Remove precise numbers until source-registered" | **PARTIALLY ADOPTED**: every load-bearing external claim gets a source-register entry with retrieval date + confidence in M1; research-sweep primary URLs already on file in evidence/ |

**Auditor 2 — `sonar-reasoning-pro`** (evidence: `…-evidence/audit-perplexity-pass1-summary.md`). Verdict:
FAIL, 17 claims checked, 6 problems. Dispositions: DataForSEO pricing + OWASP Agentic 2026 **CONFIRMED**
(the two claims driving money/security decisions). Savings range **relabelled ESTIMATE** (§3.5 amended —
correct catch). Its UNVERIFIABLE flags on MAST/TheAgentCompany/Vend/METR reflect its own retrieval window —
the research sweep holds primary URLs (arXiv 2503.13657; cmu.edu/news/2025/agent-company;
anthropic.com/research/project-vend-1) — claims KEPT with citations, precision downgraded for any
external-facing use until re-fetched. Its "gpt-5.6 Sol doesn't exist" is REFUTED by direct API evidence
(model id `gpt-5.6-sol` returned by api.openai.com/v1/models this session) — a live demonstration of why
the OS treats single-auditor verdicts as input, not truth.

**Round status:** pass 1 recorded; plan amended in place (§2.2, §3.1, §3.5, §7.1, §10). **Pass 2 (both
auditors, same highest modes) runs on the M0+M1 diff before any doctrine merges** — the deploy gate is dual
constructive review of what will actually ship, not of this prose.
