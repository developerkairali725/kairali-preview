---
report_id: RPT-20260719-M2
date: "2026-07-19 23:45:00 IST"
task: "M2 — mechanisms build (plan §10 M2) + external review round + adopted fixes"
project: "OS v2 (feature/os-v2-m2-mechanisms, PR #172)"
source_tool: "claude-code ultracode (build wf 15 agents 1.87M tok · fix wf 11 agents 1.03M tok) + audit-gpt/audit-perplexity"
type: milestone-build
supersedes: null
---

# M2 MECHANISMS — COMPLETE; external round adopted; owner Merge click is the gate

## 1. What landed (commits 07f3cf5…a35eab7 + the fix unit)

evidence-manifest (write/verify/ci; append-only entries; corrections = new file + appended entry
+ strictly-newer run_id; EV-4 CI law; producer field) · decisions/ store (15 records seeded at
decision altitude; dual-hash immutability; Guardian mode; boot hook) · report-store lint
(frontmatter + IMPLEMENT|REJECT|MONITOR triad, loud grandfather boundary 2026-07-19) · evolution/
(radar + channels [pending owner ratification] + anti-patterns + candidate card + data-only scout
schema; SE-6 continuity guard) · issue-register format + job-spec generator (prohibitions ⊇ HARD
GATES 1–15; cost budget mandatory; builder≠verifier) + gates/risk-tiers.yaml ·
change-gates-resolve (real-diff resolver, informational in CI, blocking at M4) · CI wiring (5
steps) · boot/doctor hooks · strict residues down to seo-baseline (M3) only.

## 2. Machine evidence (post-fix head)

Full suite **923/923** · merge-continuity --strict PASS (300 rows, 2 ALLOWED M3 residues) ·
decisions-index --check OK (15) · evolution-lint PASS · class-map-lint PASS (56 vectors) ·
adversarial fixtures for every fix (tmp git repos, both directions) pasted in the workflow record.

## 3. External review round (both auditors, highest modes) — FAIL → adopt → verified

**gpt-5.6-sol FAIL(7)** · **sonar-reasoning-pro FAIL(4)** (raw verdicts filed in
2026-07-19-os-v2-evidence/). The round found the same defect class it found at M1 — mutable,
caller-controlled representations used as proof — and every real finding was adopted same-session:

## Dispositions

| Finding | Disposition | Reason / what shipped |
|---|---|---|
| decisions immutability provable only against working tree (same-commit edit+reindex launders) | IMPLEMENT | base-trusted --check: prior index from merge-base via git show; edit + deletion caught (fixtures verified); bootstrap loud, corruption fails closed |
| evidence CI skips newly added bundles (false hashes pass) | IMPLEMENT | ci verifies EVERY touched bundle fully at HEAD; any changed path inside a manifested bundle triggers full verification |
| correction model incoherent (write allows what CI forbids) | IMPLEMENT | one law both checkpoints: entries append-only; correction = new file + appended entry + newer run_id + set-once superseded_by; documented flow proven write→ci green |
| job-spec --check doesn't prove envelope ≡ issue row | IMPLEMENT | canonical regeneration + deep compare on every generated field; absent issue_row_hash fails |
| T1 control is an evadable keyword denylist | IMPLEMENT | default-deny action vocabulary in risk-tiers.yaml; unknown action ⇒ T1 ⇒ refused ("forever-human until the owner tiers it"); keyword scan demoted to second net |
| content-only caller assertion suppresses fail-closed | IMPLEMENT | assertion honored only when path-PROVEN (all changed files in declared content globs); else ignored loudly, fail-closed runs |
| review package incomplete vs diff | PARTIAL | inherent to external API review of a private repo; the owner (the audience) has direct access; key files included in the round, raw verdicts + this table are the record |
| "$7k/loop" SICA figure unverifiable | IMPLEMENT | relabelled internal ESTIMATE with the primary-source honesty note |
| "every surviving self-improving system" universal claim | IMPLEMENT | reframed as local doctrine (design rule of THIS OS) |
| CONDITIONAL_GO "never releases" stated as fact | IMPLEMENT | reworded to doctrine + enforcement status (transition lint PLANNED, merge-continuity partial) |
| FOREVER_HUMAN_FLOOR enforcement unverifiable from artifact | REJECT (with remedy) | enforcement exists and is tested (job-spec-generate T1 refusal); the auditor's bundle simply lacked the script — risk-tiers.yaml now names the enforcing exports + tests so the invariant is checkable |

## 4. Honest residuals

seo-baseline.mjs (M3, review_by 2026-08-09) · transition lint + Guardian CI step + EX-2 session
budgets + scout isolation scaffold = PLANNED, stated as partial in merge-continuity · channels.yaml
awaits the owner's ratification word · resolver becomes blocking via job-spec at the M4 pilot.

## 5. The gate that remains

Owner **Merge click on PR #172** (front-gate auth step stays red by design — author==owner blocks
Approve; the bot-account fix is the queued ask). Then M3 tools/data → M4 pilot.
