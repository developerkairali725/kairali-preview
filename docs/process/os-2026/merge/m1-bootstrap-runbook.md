# M1 BOOTSTRAP RUNBOOK — the one-time owner sequence that deploys the authenticated-approval gate

**Why this exists (external pass 3, gpt-5.6-sol):** the M1 PR (#167) mints `gates/owners.yaml`.
The gate resolves owner identities from the TRUSTED MERGE-BASE revision — never the PR checkout —
so on its own birth PR the register is unreadable and the gate FAILS CLOSED by design. The
mechanism therefore cannot authenticate the PR that installs it; the OWNER'S OWN AUTHORITY is the
one-time trust anchor. This runbook is that procedure, committed BEFORE the merge so the bootstrap
is a documented, auditable deployment step, not an improvisation.

## The owner sequence (Abilash, in order)

1. **Review PR #167 at its final head and press Approve** (GitHub review, state APPROVED).
   This is the authenticated intent record — immutable, identity-bound, timestamped by GitHub.
2. **Merge the PR.** The `front-gate` context is red solely on the bootstrap fail-closed step
   (verified: the front-gate STEP passed; only "Authenticated approval" failed — job
   88197491865, run 29688705626). If branch protection blocks the merge, the **owner admin
   bypass is the documented owner lane** (HARD GATE 9): log the bypass + reason in wiki/log.md
   the same session, per the gate's own text.
3. **Required-contexts one-click (after merge):** run the command `scripts/launch-scaffold.mjs`
   prints to make the front-gate context (which now carries the authenticated-approval step)
   and the strict lints required on main — together with the 10 matrix contexts already listed
   as drift in the boot contract.
4. **Post-merge verification (agent runs, owner watches — both directions):**
   - NEGATIVE: a scratch PR touching a guarded path (e.g. a whitespace line in
     `docs/process/os-2026/merge/gap-list.yaml`) must be BLOCKED until an owner-identity
     APPROVED review exists at its head; an approval by any other identity must not satisfy it.
   - POSITIVE: a scratch routine PR (site page tweak) must classify "out of scope — routine
     lane" and remain eligible for D-AUTOMERGE-TIERS auto-merge, proving the routine lane
     survived intact.
   Both results are committed as evidence under `docs/reports/2026-07-19-os-v2-evidence/`.
5. From this point `gates/owners.yaml` is readable at base for every future PR: additions to
   the owner register require an ALREADY-registered owner's authenticated review (the
   self-addition attack is structurally dead).

## The base-trusted enforcement stack after bootstrap (defense in depth)

| Layer | Control | Trust root |
|---|---|---|
| GitHub CODEOWNERS | `/.github/`, `/gates/`, `/docs/process/os-2026/`, `/CLAUDE.md`, enforcement scripts → @AbhilashKairali review required | BASE branch (`require_code_owner_reviews: true`, verified in branch protection) — a PR cannot edit away its own guard |
| authenticated-approval.mjs | owner-identity APPROVED review at head SHA on guarded diffs; latest-effective-review semantics; artifact hash binding; workflow-derived enforcer guards | merge-base revision (`git show BASE:`) |
| Branch protection | required status contexts + code-owner reviews; admin bypass = owner-only, logged (HARD GATE 9) | GitHub repo settings (owner-administered) |
