# ISSUE REGISTER FORMAT — the work-item law (M2 mechanism)

**Written:** 2026-07-19 19:41:07 IST · M2 mechanisms session, feature/os-v2-m2-mechanisms
**Authority:** merge plan §2.3 + §2.7 (docs/plans/2026-07-19-os-v2-architecture-merge-plan.md) ·
CLAUDE.md §OS v2 DOCTRINE (ISSUE STATE MACHINE + AGENT OPERATING CONTRACT) · M0(a) report
`docs/reports/2026-07-19-m0a-paper-dryrun.md` §2 (the CH-1 walk defines the row fields) +
dispositions 4, 6, 11 · D-20260719-09 (right-tool-right-time enforcement starts here).
**Rule g applies:** nothing here weakens an obligation; this doc declares the machine format the
obligations already bind to.

## 1. Where rows live

Issue rows live in **`launches/<domain>/issues.yaml`** — one register per property, inside the
evidence root the law already owns ("if it isn't in the repo, it didn't happen"). Fleet-internal
work that has no domain (repo/OS work) lives in `launches/_fleet/issues.yaml`, same format.

This register is the ONE home for **work items** (docs/process/os-2026/merge/work-item-boundary.md):
issue register = work items · QUESTIONS.md = owner questions · BACKLOG.md = deferred polish ·
DIRECTIVES.md = owner rulings. One item, one home, cross-referenced by id. BACKLOG.md's interim
work-item duty (boundary doc §1) ends per property the moment that property's `issues.yaml`
exists: existing BACKLOG work items migrate with back-pointers per the boundary doc's migration
rule; new work items open here, never there.

## 2. File shape (narrow grammar — machine-parsed, fail-loud)

The file is deliberately NARROW YAML, parsed by `scripts/job-spec-generate.mjs` with the house
no-dependency stance (registry/class-map parser style): top-level scalars, `issues:` rows opened
by `  - id:`, row fields at 4 spaces, ONE nesting level for named sub-maps (6 spaces) and lists
(6-space `- ` items), inline `[a, b]` lists for short enums. An unparseable line is an ERROR,
never a skip.

```yaml
version: 1
domain: ayurvedichealingvillage.com
issues:
  - id: ISS-ayurvedichealingvillage-com-0001
    state: EVIDENCED
    severity: P2
    site: ayurvedichealingvillage.com
    class: organic
    entity: ktahv-clinical
    locales: [en, de, fr]
    scope: change
    title: "Hero swap + H1/meta retitle on /consultation (impressions −32% QoQ)"
    causal_hypothesis: "Title CTR decay + dated hero imagery; primary keyword unchanged"
    opportunity_economics:
      value: "+38k impressions/quarter recovered to baseline"
      label: ESTIMATED
    evidence_refs:
      - "launches/ayurvedichealingvillage.com/evidence/2026-07-19-consultation-gsc/ sha256:6b1f…"
    spec_intent: "Replace hero image; sharpen H1 + meta within the approved keyword map; EN/DE/FR"
    spec_change_paths:
      - "sites/ayurvedichealingvillage.com/app/consultation/page.tsx"
    spec_change_kinds: [content-only]
    spec_requested_tools: []
    spec_output_schema: "PR diff + evidence bundle + manifest (launches/<domain>/evidence/<run-id>/)"
    definition_of_done: "All three locales shipped or flagged; Dr. Deepu John sign-off (HG-7); gate subset green; post-publish QA fetch diff clean"
    retry_max_attempts: 2
    timeout_minutes: 45
    cost_budget:
      tokens_max: 400000
      usd_max: 6
    builder_session: "session-2026-07-20-a"
    verifier_session: "session-2026-07-20-b"
    gate_subset_ref: "gates/class-map.yaml scope=change resolution for this row (generator resolves + records)"
    approvals_ref: "launches/ayurvedichealingvillage.com/approvals.yaml"
    monitoring_ref: "launches/ayurvedichealingvillage.com/monitoring.yaml#ISS-ayurvedichealingvillage-com-0001"
    closure_grep: "grep -ri 'dated-hero pattern + old title strings' sites/ayurvedichealingvillage.com — ALL pages, ALL page types, ALL three locales; paste full output"
    state_log:
      - "2026-07-19 18:59:41 IST OPEN→EVIDENCED evidence:launches/ayurvedichealingvillage.com/evidence/2026-07-19-consultation-gsc/"
```

## 3. Field law

| Field | Law |
|---|---|
| `id` | `ISS-<domain-slug>-NNNN`. `<domain-slug>` = the domain with `.` → `-` (fleet-internal: `fleet`). `NNNN` = zero-padded, monotonically increasing per register, never reused, never renumbered. The id is the cross-reference handle every other home points at. |
| `state` | One of the 10 states, VERBATIM from CLAUDE.md §OS v2 DOCTRINE 2: `OPEN → EVIDENCED → APPROVED → IMPLEMENTING → STAGING_QA → READY_FOR_RELEASE → DEPLOYED → LIVE_VERIFIED → MONITORED → CLOSED` — **no skips**; a failed live test REGRESSES the state (§4). |
| `severity` | `P0`–`P3` (plan §2.3). P0/P1 evidence is never self-approved (CLAUDE.md, explicit HARD GATE 9 form). |
| `site` | The domain (must match a `properties:` row in `gates/class-map.yaml` — the generator resolves the property vector from it). |
| `class` | `commerce` \| `organic` \| `landing` — mirrors the property's registry site_class; a mismatch with class-map is a validation error. |
| `entity` | The entity register (`ktahv-clinical`, `villa-raag-hospitality`, `kappl-product`, `kappl-b2b`, `group-corporate`, `personal`, `internal`, `education`) — carries the language lock into every consumer. |
| `locales` | The locale set this item ships in. A KTAHV row missing any of `[en, de, fr]` is a finding, not a default (LOCKED FACTS). |
| `scope` | `project` \| `change` (M0(a) disposition 3). `project` = full composed battery; `change` = diff-relevant subset via class-map `scope_map` + `change_triggers`; a change the triggers cannot classify runs the FULL battery (fail-closed law). |
| `title` | One line, specific, with the triggering number where one exists. |
| `causal_hypothesis` | Why we believe the problem has this cause (plan §2.1 Phase 2). Never empty at EVIDENCED. |
| `opportunity_economics` | `{value, label}` where `label` ∈ `OBSERVED` \| `CALCULATED` \| `ESTIMATED` \| `ASSUMED` (plan §2.4). An `ASSUMED` label on a fact-gap still triggers an ASK (HARD GATE 6 supremacy rule) — labels never launder an assumption. P2/P3: point estimate suffices (§7.1.13). |
| `evidence_refs` | **Pointer-only** (M0(a) dispositions 10+11): each entry is `<repo path> sha256:<manifest hash>`. ONE evidence bundle per change; every consumer references by path + manifest hash; corrections = a NEW run-id, never overwrite. Restating evidence content in the row is a violation. |
| `spec_*` fields | M0(a) disposition 6: **the per-change spec lives IN the row** — there is no separate per-change brief/spec doc. `spec_intent` (what), `spec_change_paths`/`spec_change_kinds` (the diff surface the class-map resolver consumes; kinds from class-map `change_kinds`), `spec_requested_tools` (agent tools beyond the gate battery — the risk-tier T1 scan runs on exactly this list), `spec_output_schema` (what the finished work looks like as an artifact). Site-level specs remain the FAT strategy payload, not issue rows. |
| `definition_of_done` | The generator copies this into the envelope verbatim. Must be checkable, not aspirational. |
| `retry_max_attempts` / `timeout_minutes` | Retry/timeout envelope fields (CLAUDE.md §OS v2 DOCTRINE 4). |
| `cost_budget` | `{tokens_max and/or usd_max, optional wall_clock_minutes}` — **REQUIRED, no default.** A row without a budget cannot generate a job spec; `scripts/job-spec-generate.mjs` REFUSES it (cost budgets are a first-class gate — the one failure class v1 had no gate for). |
| `builder_session` / `verifier_session` | EX-3 verifier separation (plan §5): the session that BUILT never signs its own gate pass. Both required by generation time; **builder == verifier is refused** by the generator and by `--check`. May be supplied via generator flags instead of the row. |
| `gate_subset_ref` | Where the resolved diff-relevant gate subset for this row is recorded (the generated envelope records the actual resolution; this field names it). |
| `approvals_ref` | The approvals ledger governing this item (`launches/<domain>/approvals.yaml`). The approval EVENT lives there, per its risk tier (`gates/risk-tiers.yaml`): T2 owner word → signed row; T3 → authenticated approval artifact. Never restated here. |
| `monitoring_ref` | The monitoring row (path#id) carrying the 24h/72h/7d/28d thresholds. Required before DEPLOYED → LIVE_VERIFIED can progress to MONITORED. |
| `closure_grep` | **MANDATORY before CLOSED** — the fix-one ≠ done precondition (v1 PROOF-OF-WORK, kept as closure precondition per plan §2.3): the exact grep/audit command + scope (ALL instances, ALL page types, ALL locales) whose full pasted output proves the pattern is gone everywhere, not just where it was found. An empty or vague `closure_grep` blocks CLOSED. |
| `state_log` | Append-only transition lines: `<IST-to-the-second> <FROM>→<TO> evidence:<pointer>`. Date-only entries are a lint finding (CLAUDE.md crash-resilience law). |

## 4. State-transition law

Transitions are legal ONLY between adjacent states (forward), or backward on regression. Every
transition appends a `state_log` line with IST-to-the-second timestamp and an evidence pointer.

| Transition | Precondition (what the evidence pointer proves) |
|---|---|
| OPEN → EVIDENCED | `evidence_refs` non-empty (path + manifest hash) · `causal_hypothesis` written · `opportunity_economics` labelled |
| EVIDENCED → APPROVED | Approval recorded at `approvals_ref` per the item's risk tier (`gates/risk-tiers.yaml`): T2 = owner word, signed row; T3 = authenticated approval event. P0/P1: never self-approved (HARD GATE 9 explicit form) |
| APPROVED → IMPLEMENTING | Generated job-spec envelope exists (`scripts/job-spec-generate.mjs`, budget present, builder ≠ verifier) — the right-tool-right-time enforcement start (D-20260719-09) |
| IMPLEMENTING → STAGING_QA | Work on staging only (HARD GATE 1) · evidence bundle + SHA-256 manifest committed |
| STAGING_QA → READY_FOR_RELEASE | Resolved gate subset green (envelope `authorized_gates` + `human_gates`) · verifier session (≠ builder) signed the pass (EX-3) |
| READY_FOR_RELEASE → DEPLOYED | Release approval per lane (Lane B: owner preview approval = the one owner touch; Deepu publishes) · deploy-log POINTER row (ref + hash + timestamp, never a copy) |
| DEPLOYED → LIVE_VERIFIED | Post-publish QA fetch + diff against intent, shown (v1 law) |
| LIVE_VERIFIED → MONITORED | `monitoring_ref` row live with 24h/72h/7d/28d thresholds against the Phase-1 baseline |
| MONITORED → CLOSED | `closure_grep` executed with FULL output pasted into the evidence bundle (fix-one ≠ done) · monitoring window clean or findings spawned as NEW issues |
| any → regression | A failed live test/gate REGRESSES the state to the stage that must re-run (typically IMPLEMENTING or STAGING_QA); the regression is a `state_log` line citing the failure evidence — never a silent re-edit |

Constraint carry-overs (CLAUDE.md §OS v2 DOCTRINE 2, verbatim law): **CONDITIONAL_GO never
releases a CI merge-block** — conditions become tracked issues (new rows here). **ACCEPTED_RISK is
owner-only**: a DECISIONS.md ruling + an expiry that auto-reopens the issue (the row regresses to
OPEN at expiry), and it can NEVER apply to a HARD GATE or a registry gate.

## 5. What consumes this format

- **`scripts/job-spec-generate.mjs`** — generates the per-task job-spec envelope FROM the row
  (one authoring surface, two views; M0(a) disposition 4 deleted the hand-written spec). Refuses:
  missing budget · builder == verifier · any T1 forever-human action in the authorized surface
  (`gates/risk-tiers.yaml`).
- **`gates/class-map.yaml` resolver** — `site` + `scope` + `spec_change_paths`/`spec_change_kinds`
  drive the diff-relevant gate-subset resolution the envelope records.
- **doctor / Monday lint** (boundary doc §4) — duplication, wrong-home, dangling-migration checks
  gain exact ids from this register.

## 6. Boundary

This register holds WORK ITEMS only. Owner questions → QUESTIONS.md. Deferred polish →
BACKLOG.md. Owner rulings → DIRECTIVES.md. The full law, including migration between homes, is
**docs/process/os-2026/merge/work-item-boundary.md** — this doc does not restate it.
