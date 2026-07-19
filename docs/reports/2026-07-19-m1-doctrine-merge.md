---
report_id: RPT-20260719-M1
date: "2026-07-19 20:35:00 IST"
task: "M1 — doctrine merge (plan §10) on feature/os-v2-architecture + external review passes 2–3"
project: "OS v2 architecture merge (feature/os-v2-architecture, PR #167)"
source_tool: "claude-code ultracode (workflow 1: 15 agents 1.49M tok · workflow 2: 13 agents 1.09M tok · 1 focused agent 149k tok) + audit-gpt/audit-perplexity externals"
type: milestone-build
supersedes: null
---

# M1 DOCTRINE MERGE — COMPLETE; external passes recorded; owner merge word is the remaining gate

## 1. What landed (commits 0d6b118 → ec34c2e + final unit)

| Unit | Deliverable |
|---|---|
| M1(a) 0d6b118 | CLAUDE.md v2: HARD GATES 10–15 (strict union, §2.6) · lifecycle Phases 0–8 with v1 gate homes · issue state machine + CONDITIONAL_GO/ACCEPTED_RISK constraints · evidence law v2 · agent operating contract (ASSUMPTION-still-asks) · external-AI checkpoints (D-08) · right-tool-right-time (D-09) · escalation ladder + missing-asset protocol (D-28/29) · Gate-1 design-direction altitude · M0(a) §5 checklist complete. Append-only: all 121 CM sentence pins intact. |
| M1(b) 276d555 | gates/registry.yaml +7 rows (axe-core-a11y · zap-baseline · redirect-map-tests · rollback-verification · scaled-content · baseline · launch-certificate; 76 gates, honest planned/partial statuses) · gates/class-map.yaml (32 properties, 5 overlays, project\|change scope_map, 24 workflow test vectors) · class-map-lint (never-weakens structural) |
| M1(c) 4a1a017 | Rule-9 neutralization (PKG-043): deterministic generator + 24 adopted workflow copies + README; --check proves byte-fidelity, zero reintroductions, source layer untouched |
| M1(d) 1e302f1 | authenticated-approval.mjs (D-10 scope: front gates + doctrine PRs only; owners.yaml = AbhilashKairali, evidence PR #113 mergedBy) |
| M1(e) e33c6b1 | work-item-boundary.md · gap-list.yaml (directive-current) · frozen-PR dispositions (11 PRs, RPT-20260719-M1-PRLEDGER) |
| M1(f) 711373e | merge-continuity 300 rows (76/76 GR coverage) · strict-residues.yaml allowlist (7 rows, M2/M3, review_by) · lint rule 8 · CI armed: both --strict flips + class-map + neutralize --check + authenticated-approval step |
| Pass-2 fixes ec34c2e | Auth hardening (base-trusted owner register · rename-aware guards · latest-effective-review · workflow-derived tamper-evident enforcer guards, 13 net-new) · change_triggers (additive diff-keyed gates + fail-closed unknowns ×4 → Q-CLASSMAP-UNKNOWNS) · review_by expiry machine-enforced · CLAUDE.md v2.0.1 (HG9×automerge reconciliation citing D-AUTOMERGE-TIERS + D-20260719-10 · activation semantics · Lane-B 19-gate resolution) · scaled-content risk-basis correction |
| Final unit (this commit) | CODEOWNERS extended to the doctrine surface (base-trusted, closes pass-3 circularity) · m1-bootstrap-runbook.md · this report · pass-3 evidence |

## 2. Machine evidence (head ec34c2e + final unit)

- Full suite: **735/735 pass** (`find packages sites scripts -path '*/test/*.test.js' … | node --test` — the exact CI discovery command).
- merge-continuity-lint: PASS plain AND --strict (300 rows · CM-121 · GR-76 · PKG-85 · STD-7 · REJ-8 · DEF-3; 7 residues ALLOWED loud, all M2/M3 with machine-enforced review_by expiry).
- standards-acceptance --strict: ACCEPTED ×7 · class-map-lint: PASS (56 vectors; every B5 surface trigger-carried; fail-closed pinned) · neutralize --check: 24/24 · gate-registry-lint: 76 gates × 3 classes.
- CI at head: run 29688705626 — front-gate STEP passed; the ONLY red is the authenticated-approval step failing closed on its own birth PR (job 88197491865), the designed bootstrap (runbook committed).
- Branch protection (verified via API): `require_code_owner_reviews: true`, 19 required contexts, admin bypass owner-only (enforce_admins false = HARD GATE 9 owner lane).

## 3. External review record (the deploy-gate law: dispositions, not obedience)

- **Pass 2** (both auditors, highest modes, on the M1 diff): gpt-5.6-sol FAIL (8 blocking) · sonar-reasoning-pro FAIL (1 misleading + 1 data fault). Full dispositions: `2026-07-19-os-v2-evidence/pass2-dispositions.md`. Adopted findings became the ec34c2e fix round (the sharpest: mutable trust root, rename bypass, revocation semantics, subtraction channel, allowlist expiry). Refuted with evidence: sonar's baseline "data fault" (overlay adds ≠ scope_map — orthogonal axes, now documented in-file).
- **Pass 3** (on the fixed head): **sonar-reasoning-pro PASS** — corrections verified, refutation confirmed, only residual an UNVERIFIABLE-by-construction note on private-repo tooling (covered by in-repo tests). **gpt-5.6-sol FAIL (6)**, dispositioned:

| Pass-3 finding | Disposition |
|---|---|
| Workflow guard "circular" (PR-head workflow can remove the auth call) | **REFUTED with platform evidence + depth added**: CODEOWNERS has covered `/.github/` since before M1 and branch protection enforces `require_code_owner_reviews: true` FROM THE BASE BRANCH — a PR editing the workflow cannot merge without the owner's review. This commit extends CODEOWNERS to `/gates/`, `/docs/process/os-2026/`, and every enforcement script (defense in depth). |
| Required-context activation deferred | **OWNER ACTION by nature** (branch protection is admin-only) — step 3 of the bootstrap runbook; same one-click as the 10 pre-existing drifted contexts. A check cannot make itself required; asking the owner to do so IS the mechanism. |
| change_triggers not executed against real diffs | **M2-SCOPED by the plan itself** (§10 M2 mechanisms; the resolver exists, is exported and tested; CI execution + job-spec envelope wiring is M2 plumbing). Governed by the ACTIVATION SEMANTICS law: declared, binding on conduct, machine gate at M2 — never citable as a passed gate meanwhile. |
| Bootstrap not a controlled procedure | **ADOPTED** → `m1-bootstrap-runbook.md` committed (owner sequence, logged-bypass law, post-merge negative/positive demonstrations). |
| Proof bundle not independently auditable | **PARTIALLY ADOPTED**: this report carries run/job ids, the exact test command, and check states; the audience (the owner) has direct repo/CI access, which an external API reviewer inherently does not. |
| NABH/WHO-GMP need third-party provenance | **REFUTED by standing ruling** D-EXTREVIEW-OWNER-FACTS: owner-confirmed business facts are ADVISORY for external auditors, never blocking (precedents: Q-EQ-GATE2-TRUTH-LANE, Q-BL-GATE2-PERPLEXITY-DEADLOCK). |

Pass-3 GPT's own verdict: "better for audience: true"; four of eight pass-2 blockers "substantially addressed in implementation."

## 4. What M1 leaves open, honestly

- 7 strict residues (M2: decisions/index.json, evidence-manifest.mjs, evolution/radar.yaml · M3: seo-baseline.mjs) — allowlisted, loud, expiry-enforced.
- change_triggers execution wiring + job-spec generator + evidence-manifest validator = **M2**.
- Owner one-worders riding (non-blocking): Q-CLASSMAP-UNKNOWNS (4 dimension vectors) + kairaliyoga entity bucket + Shopify-LP platform vector.
- Frozen-PR ledger: dispositioned in RPT-20260719-M1-PRLEDGER — merge word and order stay the owner's.

## 5. The gate that remains

Per plan §10: **owner merge word on PR #167**, executed via the bootstrap runbook (review-approve → merge via owner lane → required-contexts click → dual post-merge demonstration). Then M2 mechanisms → M3 tools/data → M4 pilot (theblushlounge.com).
