<!-- Kairali web factory PR ritual (17 Jul 2026, session 2C-hardening).
     Evidence rules are CLAUDE.md law: no "done" without machine evidence,
     pasted. Delete a section only if it is genuinely N/A — and say so. -->

## What & why

<!-- One paragraph. Link the DECISIONS/QUESTIONS/BACKLOG item this serves. -->

## Evidence (proof-of-work — paste, don't describe)

<!-- Gate transcripts, test output, screenshots, preview URLs, rendered-HTML greps. -->

## Ritual checklist

- [ ] **Cross-model audit note attached, or pending-triangulation logged.**
      (scripts/audit-gpt.mjs + scripts/audit-perplexity.mjs; the standing rule:
      load-bearing claims need both verifiers — "verified by one only" is never
      a final state; verifier unavailable ⇒ log the pending-triangulation item,
      never skip silently. The 16-Jul wave ran ZERO cross-model audits — this
      line exists so that can't recur unnoticed.)
- [ ] **wiki/log.md rollup appended (logger sub-agent, layer 2)** for this
      change — the committed log spine, not agent-log.jsonl (that's automatic).
- [ ] Directives given in-session are captured in DIRECTIVES.md
      (`node scripts/directive-capture.mjs add …`) — an unlogged directive is a
      dropped directive.
- [ ] **Site PRs only:** launches/<domain>/ evidence current — filled sitewide +
      pagewise checklists, design-qa + seo-aeo-geo reports, LEARNINGS retro
      (launch-evidence-gate enforces presence; you own the honesty of the fill).
- [ ] **New site?** Scaffolded via `node scripts/launch-scaffold.mjs <domain>`
      (registers the site in every CI matrix + creates the evidence set) and the
      owner's required-checks command from its output is quoted in this PR.

## Unverified / open

<!-- Anything claimed above that a human should re-check, stated honestly. -->
