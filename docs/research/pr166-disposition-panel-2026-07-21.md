# Panel decision — PR #166 disposition: fully-superseded ladder PR closed unmerged (all-three-agree, recorded)

- **When:** 2026-07-21 ~23:05 IST · **Lane:** D-20260721-14 (panel decides, owner told).
- **Method:** GPT attacked Claude's disclosed position over the full brief; Perplexity verified the external-practice premises on a facts-only variant. Verbatim outputs in the session transcript.

## The question

The owner's ruled merge order (#145 → #166 → #163 → #157 → #164 → #146 → #144 → #150) assumed the idle PRs carry unlanded content. #166's content-diff vs main @ 76e75db (the squash-strand test — content, never topology): its ENTIRE diff is +2 DIRECTIVES.md lines — D-20260719-02 byte-identical on main, D-20260719-01 on main in a strictly newer (acked) form. Honest conflict resolution yields an empty diff. Close unmerged with evidence, merge empty, or route back to the owner?

## Verdicts

- **Claude:** close unmerged with the evidence bundle; treat the ruled order as an order of content landing, not an order to perform empty merges.
- **GPT: adopt close-unmerged, with conditions** — machine evidence posted on the PR; a pre-close checklist (no unique hunks · no automation keys on merged-state · no downstream PR depends on the merge commit); the standing rule shipped as TEXT for owner ratification, never self-enacted; the PR title's promised harness enforcement tracked separately so closing does not silently drop it.
- **Perplexity:** no codified community standard exists for superseded-PR disposition (Claude's "standard practice" framing over-claimed — corrected); clean-linear-trunk principles support close-with-evidence over deliberate no-op squash commits, as an inference from principles.
- **All three agree ⇒ closed.**

## Executed

- Evidence comment posted on #166 (content-diff, both-lines-on-main proof, automation/downstream checks, reopen path) and the PR closed unmerged — reversible by reopen; owner can say MERGE to land a merge commit instead.
- **Tracked, not dropped:** the harness deny-rule as titled (`Bash(gh pr merge*)`) never rode the PR and would also block the owner-ruled arming command `gh pr merge <n> --auto --squash` (D-AUTOMERGE-TIERS). A scoped redesign (deny plain/interactive merges; allow `--auto` arming) is a BACKLOG row this close.

## Standing rule — PROPOSED, awaiting owner ratification (not in force)

> If a PR in an owner-ruled merge ladder has zero unique content vs current main (machine-proven: no unique hunks; every added line present on main byte-identical or in newer form; honest conflict resolution yields an empty diff), the agent closes it unmerged with a posted evidence bundle and a records entry — never a deliberate empty merge — unless the owner mandates merge commits or an automation provably keys on merged state.

One-word ratification (YES/NO) rides the owner queue; on YES it lands as a DIRECTIVES capture.
