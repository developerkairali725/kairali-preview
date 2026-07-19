# M2 external review — auditor 1: gpt-5.6-sol (raw, 2026-07-19 ~23:2x IST) — FAIL(7), all dispositioned in RPT-20260719-M2

```

=== GPT-5 AUDIT (pass 1) — FAIL ===

Understood: PR #172 is intended to implement M2 of the OS v2 rollout: machine mechanisms that enforce the already-merged M1 doctrine, including evidence manifests, immutable decision provenance, report dispositions, evolution registers, issue-derived job specifications, risk tiers, and per-change gate resolution.
  for whom: The immediate audience is the owner deciding whether to click Merge on PR #172.
  context sufficient: false

--- END RESULT FOR THE AUDIENCE ---
serves audience: false | meets purpose: false
  where it loses them: The first decisive failure is `scripts/decisions-index.mjs` loading the mutable head index as its own historical authority. The same pattern recurs in evidence CI skipping additions and job-spec checking only a small subset of the generated contract. At that point, the headline claim that M2 mechanically enforces M1 is no longer credible.
  they would think: A careful merge owner should conclude: “The test count is high, but the tests have not protected the actual trust boundaries. I would be merging mechanisms whose success messages overstate what they enforce.”
  The owner needs reliable evidence that PR #172 turns M1 doctrine into enforcement. Several load-bearing mechanisms can be bypassed while reporting success: decision history can be rewritten, new evidence can evade CI validation, job specs can be weakened after generation, and content-only classification can buy a reduced gate set without proof. These are not polish defects; they invalidate the enforcement claims.

--- MY REASONING --- sound: false
  FLAWED: “Six adversarially verified parallel builds” and “895/895” are treated as confidence multipliers without demonstrating that the tests target cross-commit and caller-control attacks. The decision-index flaw is exactly what unit tests using a supplied `priorIndex` miss.
  FLAWED: The reasoning equates explicit partial-status prose with safety. Honest labelling is useful, but an informational resolver or self-asserted identity field does not enforce doctrine merely because its limitation is documented.
  FLAWED: The design repeatedly chooses narrow custom parsers and string matching, then claims fail-closed completeness. A parser can fail closed on syntax while the data model remains open-ended and bypassable.
  FLAWED: The implementation optimizes for generated prohibitions being a superset, but does not similarly protect the positive authorization and required-gate surfaces. Removing a required human gate is more dangerous than omitting a repeated prohibition string, yet the validator concentrates on the latter.
  FLAWED: The thought process appears to have tested mechanisms in isolation rather than following an adversarial PR through Git history: edit record plus ledger, add a brand-new false manifest, alter a generated envelope, and assert content-only. Those are the actual attacker and operator-error paths.
  ASSUMED (never reasoned): That the committed working-tree index is an independent historical ledger rather than attacker-controlled content in the same PR.
  ASSUMED (never reasoned): That all dangerous requested actions will use one of the manually anticipated `match_tokens`.
  ASSUMED (never reasoned): That a caller asserting `content-only` is trustworthy and has separately proved the assertion.
  ASSUMED (never reasoned): That generated artifacts will not be hand-edited or partially deleted after generation.
  ASSUMED (never reasoned): That producer session and role strings correspond to independent authenticated actors.
  ASSUMED (never reasoned): That passing unit tests imply workflow integration and required-check coverage.
  ASSUMED (never reasoned): That every omitted file in the 48-file diff is sound because the aggregate suite passed.

--- VS PRIOR --- better for audience: false
  REGRESSION: No measurable regression against a prior implementation can be established because none was supplied.
  REGRESSION: Relative to having no mechanism, misleading PASS signals are a new operational risk: they can convert visible absence of enforcement into falsely trusted enforcement.

Quality: unacceptable | expert would respect it: false | AI-filler risk: medium
  weakest point: The system uses mutable, caller-controlled representations as proof: the head decision index proves its own history, caller strings prove T1 safety and verifier identity, and a caller assertion proves a change is content-only.

Step — claimed: M2 mechanisms deploy review for merge of PR #172. | actual: Partial M2 implementation review before trustworthy CI integration. Some mechanisms are scaffolds or informational reporters rather than enforceable controls. | prereqs met: false
  ORDER VIOLATION: M2 is presented as M1 doctrine enforcement, but the supplied evidence does not include the M1 required-check configuration or complete PR workflow wiring needed to prove the mechanisms execute on every relevant change.
  ORDER VIOLATION: The review asks for a merge verdict on 48 changed files while supplying only selected files and aggregate test output; complete artifact review has not preceded the merge decision.
  ORDER VIOLATION: The change-gate resolver defers blocking consumption to M4, so enforcement is being declared before the enforcement path exists.
  ORDER VIOLATION: Authenticated producer/verifier separation is deferred to M4 while M2 manifests and job specs already expose fields that look like proof of separation.

MISSED STEPS (8):
  [blocking] Test the decision store against a real cross-commit history rewrite, not merely against an in-memory prior index.
     evidence: `scripts/decisions-index.mjs` compares records against the head working-tree index rather than retrieving the base index through Git. No adversarial test for editing both an accepted record and its ledger is shown.
  [blocking] Validate every new or changed head manifest against the head filesystem in CI before applying append-only comparisons.
     evidence: `ciFindings()` explicitly skips added files, and `collectCiFindings()` inventories only base manifests.
  [blocking] Prove generated job specs cannot be weakened or detached from their issue rows after generation.
     evidence: `validateEnvelope()` performs selected field checks instead of regenerating the canonical envelope and comparing all security-relevant fields.
  [blocking] Define and mechanically prove the classification that permits a reduced per-change gate set.
     evidence: `content-only` is accepted from `--kind` without a classifier, signed assertion, or evidence reference.
  [blocking] Review the complete PR diff and CI integration, not selected headline files.
     evidence: The provided artifact omits several files listed in `diff-summary.md`, including report-store and evolution linters and workflow wiring.
  [major] Bind producer/verifier identity to authenticated execution identity before treating the field as separation evidence.
     evidence: `evidence-manifest.mjs` records `producer.role` and session as caller-provided strings; it says EX-3 enforcement “matures at M4.”
  [major] Define which decision statuses are authoritative and test Guardian output against rejected and superseded records.
     evidence: `decisions-index.mjs` Guardian iterates all records without filtering status, so proposed, rejected, and superseded decisions may be reported as governing current work.
  [major] Enforce substantive decision provenance rather than structural headings alone.
     evidence: `decisions-index.mjs` requires only the `Scientific rationale` heading; it neither requires non-empty content nor validates citations or the retrieval hash required by plan §3.2.

NEEDS FACT-CHECK (6) → run audit-perplexity.mjs:
  - “895 pass 895 fail 0” and “merge-continuity-lint PASS (strict) — continuity machine-proven” in `scratchpad/m2rev/machine.md`.
  - `scripts/evidence-manifest.mjs` says its CI mode validates append-only evidence and the plan says the validator is wired into CI.
  - `gates/risk-tiers.yaml` says every v2 action type is mapped exactly once and unknown actions are treated as T1.
  - Operational claims in `evolution/radar.yaml`, including GSC grants and smoke 200, GA4 access, DataForSEO funding, Clarity being live, Lighthouse timing, and security checks being clean.
  - `evolution/channels.yaml` assertions that “GEO consensus is manufactured” and that a “postmark-mcp backdoor pattern” exists.
  - The fixture in `scripts/job-spec-generate.mjs` states consultation impressions fell 32% QoQ and estimates 38k quarterly impressions recovered.

BLOCKING (7):
  ✗ `scripts/decisions-index.mjs` does not actually enforce accepted-record immutability across commits. In `main()`, `prior` is loaded from the working-tree `decisions/index.json`, not from the merge base. A PR can edit an accepted decision and update its index hashes in the same commit; `checkImmutability()` then compares the edited record with the edited ledger and passes. Deleting both the record and its index entry is likewise laundered. This defeats the central promise in `decisions/README.md` under “IMMUTABILITY LAW.”
  ✗ `scripts/evidence-manifest.mjs` CI mode does not validate newly added evidence bundles. In `ciFindings()`, every status `A` is skipped, and `collectCiFindings()` loads only manifests from the base commit. Therefore a PR can add a new malformed manifest, false hashes, or unmanifested files and still pass `evidence-manifest ci`. The script’s header and success message falsely imply that CI validates every evidence bundle.
  ✗ The evidence correction model is internally contradictory. `writeManifest()` permits changed files to replace entries when the run ID increases, but `appendOnlyFindings()` and `ciFindings()` prohibit changing any previously manifested file or entry. A correction created through the documented write command cannot subsequently pass CI unless it is placed in a genuinely new bundle directory—a requirement the CLI neither enforces nor explains. The claimed “corrections = new run-id, never overwrite” mechanism is therefore not operationally coherent.
  ✗ `scripts/job-spec-generate.mjs --check` does not prove that an envelope still represents the issue row and current gate resolution. `validateEnvelope()` does not canonically regenerate and compare `authorized_tools`, `human_gates`, `gate_resolution`, site, entity, locales, intent, inputs, output schema, approver, definition of done, monitoring reference, or closure grep. Even `issue_row_hash` is checked only if present, so deleting it passes. A hand-edited envelope can remove required gates or materially alter the job while retaining a positive budget and prohibition IDs.
  ✗ The claimed T1 fail-closed authorization control is a keyword denylist, not a sound authorization boundary. `scanT1()` checks only `requested:` strings against manually selected `match_tokens`. Equivalent requests such as “release to live,” “modify checkout,” or an unknown state-changing tool can evade those tokens. Unknown actions are not actually treated as T1 despite `gates/risk-tiers.yaml` claiming they are. This is a direct mismatch between the documented security property and the implementation.
  ✗ `scripts/change-gates-resolve.mjs` allows `--kind content-only` as an unverified caller assertion. In `resolveDiff()`, that assertion can suppress the unmatched-change fail-closed path without any proof that the diff is content-only. This creates precisely the subset escape hatch the resolver claims to prevent. It is currently informational as well, so it cannot yet enforce that any resolved gate actually runs.
  ✗ The submitted review artifact is incomplete relative to `diff-summary.md`: core changed files such as `scripts/report-store-lint.mjs`, `scripts/evolution-lint.mjs`, their schemas/registers, issue-register implementation, scout/vet-tool mechanisms, workflow integration, and most tests are not supplied. Aggregate “895/895” output is not enough to inspect whether tests assert the right properties. The owner cannot responsibly merge all 48 changed files from this partial review package.

RECOMMENDATIONS:
  → Block merge until `decisions-index --check` reads the merge-base `decisions/index.json` and base records through Git. Add integration tests that modify an accepted record and update the head index, and that delete both the record and index row; both must fail.
  → Split evidence CI into two explicit checks: verify every head manifest/bundle, including newly added ones; then compare base versus head for append-only history. Require corrections to use a new bundle directory/run path, and make `write` refuse mutation of an existing manifested bundle.
  → Make job-spec validation canonical: regenerate the expected envelope from the current issue row, doctrine, class map, registry, radar, and authenticated identities, then byte-compare or compare every security-relevant field. Missing `issue_row_hash` must fail.
  → Replace requested-tool keyword scanning with structured action IDs from a closed enum. Every authorized operation must map to exactly one risk-tier row; unknown IDs, duplicate IDs, free-form authorization, and unmapped tools must fail closed.
  → Remove unauthenticated `--kind content-only`, or require a machine classifier plus a hash-bound classification artifact. Until that exists, unmatched changes must receive the full composed battery.
  → Do not call the change resolver enforcement while it is informational. Either wire its artifact into a blocking job-spec/gate executor in this PR or clearly scope PR #172 as observation-only and withhold the M2 enforcement claim.
  → Supply the complete PR diff, workflow files, exact CI logs, and omitted mechanism files for a second pass. The current review cannot clear report-store lint, evolution lint, issue-register generation, scout/vetting controls, or actual CI wiring.
  → Filter Decision Guardian to authoritative accepted records, follow supersession to the live heir, validate `governs` paths, and require substantive cited rationale including retrieval/content hashes where the plan requires them.

tokens: prompt 48527 · completion 5187 (reasoning 1761)
```
