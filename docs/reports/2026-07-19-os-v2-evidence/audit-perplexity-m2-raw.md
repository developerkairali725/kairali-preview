# M2 external review — auditor 2: sonar-reasoning-pro (raw, 2026-07-19 ~23:2x IST) — FAIL(4), all dispositioned in RPT-20260719-M2

```

=== PERPLEXITY FACT AUDIT (pass 1) — FAIL ===

Fact lane verdict: FAIL.

Findings for the owner:
1) The SHA‑256/append‑only evidence design in scripts/evidence-manifest.mjs is technically sound and aligns with standard tamper‑evident logging practice, and the implemented CI checks do match the comments about EV‑4 append‑only behavior.
2) The channels register’s external sources (Anthropic, Next.js, Vercel, DataForSEO, Google Search Central, Shopify, OpenAI, Perplexity, ThoughtWorks Radar, Simon Willison, HN, named subreddits) are real and correctly characterized as vendor channels vs forums; using ThoughtWorks Radar as a tier2‑research source is appropriate.
3) The SICA description (self‑improving coding agent editing its own codebase) is accurate, but the specific "$7k/loop" cost for SICA/DGM‑style loops is not supported by readily verifiable primary sources and should not be stated as fact.
4) The claim that "the agent never modifies its own evaluation criteria — the one bound every surviving self‑improving system keeps" overreaches: it turns a design rule for this OS and a heuristic opinion into a universal empirical law. That is MISLEADING and should be reframed as a local doctrine, not a statement about all surviving systems.
5) High‑stakes gating invariants are asserted but not proven from the artifacts shown: (a) that CONDITIONAL_GO can never release a CI merge block, and (b) that editing gates/risk-tiers.yaml cannot weaken T1 "forever‑human" actions because a separate script enforces the FOREVER_HUMAN_FLOOR. Without the enforcement code and tests, these are design intentions, not guaranteed properties, yet they are written as hard facts the owner is expected to rely on.

Because there is at least one MISLEADING claim and several unverified but safety‑critical invariants presented as guaranteed behavior, the fact lane does not clear the bar for an owner deciding the merge; the YAML around SICA costs and gate hardening needs correction or explicit evidence before shipping.

claims checked: 16 | problems: 4

[UNVERIFIABLE] (risk:medium) "SICA/DGM-style full self-modification loops" cost approximately "$7k/loop".
   evidence: The SICA paper on arXiv describes utility functions including cost and sets per‑problem cost caps, but in the public text does not state an aggregate cost of approximately $7k per self‑modification loop.[8] Secondary commentary varies on total experiment costs and does not converge on a single, well‑sourced ~$7k/loop number. Without a directly cited, verifiable primary source, this number cannot be treated as a factual external claim.
   correction: Treat the dollar figure as an internal estimate or remove it unless you can explicitly cite a published cost analysis; current public SICA materials detail per‑problem caps and budgets but do not report a clear ~$7k/loop headline figure.

[MISLEADING] (risk:medium) "The agent never modifies its own evaluation criteria — the one bound every surviving self-improving system keeps (plan §3.1)."
   evidence: The statement asserts a universal empirical law about "every surviving self‑improving system" but cites no theory or survey demonstrating that all real‑world self‑improving systems share this property. Existing work on self‑improving agents such as SICA describes specific safety constraints and evaluation schemes for that system, not a general law governing all surviving self‑improving systems.[8] This is at best an opinion or heuristic, not an established fact.
   correction: Rephrase this as a normative design rule for this system ("In this OS, the agent never modifies its own evaluation criteria"), and remove or soften the universal empirical claim about "every surviving self‑improving system" unless you can back it with explicit theoretical or empirical citations.

[UNVERIFIABLE] (risk:medium) The claim that "CONDITIONAL_GO never releases a CI merge-block — conditions become tracked issues" correctly reflects the system’s behavior.
   evidence: In evolution/anti-patterns.yaml this is framed as doctrine and a rejection reason, but this review does not include the CI configuration or code that would actually prevent a CONDITIONAL_GO label from unblocking merges. Without inspecting that implementation, the statement that it "never releases" a merge block is unverified. For gating semantics that owners will rely on, design intent should not be presented as a guaranteed fact absent enforcement and tests.
   correction: You need an explicit cross‑check against the actual CI/gating implementation and the referenced plan/CLAUDE.md text. In this artifact alone, this is a design intent, not a verified fact; either add a mechanical enforcement (tested script) or weaken language to "is intended to" until enforcement exists.

[UNVERIFIABLE] (risk:high) The FOREVER_HUMAN_FLOOR behavior in gates/risk-tiers.yaml ("NOTHING MAY MAP A T1 ACTION LOWER"; job‑spec generator refuses any config that weakens these) is mechanically enforced so that editing this YAML cannot weaken a gate.
   evidence: The comments in gates/risk-tiers.yaml describe a strong invariant and reference enforcement in scripts/job-spec-generate.mjs, but that script is not included in this artifact. Without directly verifying the implementation and its tests, it is not possible to confirm that arbitrary edits to the YAML truly cannot weaken gates. For an owner relying on this, presenting it as a guaranteed property without enforcement evidence is unsafe.
   correction: Until you show and test the enforcement code, rephrase to "is enforced by scripts/job-spec-generate.mjs" and ensure that script actually refuses all weakening edits; otherwise, this should be documented as a design goal, not an invariant fact.

DATA FAULTS:
  ✗ The "$7k/loop" figure for SICA/DGM‑style self‑modification loops is presented as a concrete external cost but is not backed by a clearly identifiable primary source or calculation. It should be treated as an internal estimate or removed until supported.
  ✗ The assertion that YAML edits "cannot weaken a gate" (FOREVER_HUMAN_FLOOR) is treated as a hard invariant, but no enforcement code or tests are shown here. For an owner relying on it, treating it as guaranteed without mechanical proof is a data/assurance fault.

SOURCES (9):
  - https://www.thoughtworks.com/radar
  - https://www.techinterview.org/post/3233468938/lld-audit-logging/
  - https://zedly.ai/blog/openclaw-immutable-audit-log
  - https://os.moda/audit-and-compliance/tamper-evident-audit-log
  - https://auditbuffet.com/patterns/ab-001387
  - https://www.linkedin.com/posts/gyaansetu-webdev_%3F%3F%3F-%3F%3F%3F%3F%3F%3F%3F%3F%3F%3F%3F%3F-%3F%3F%3F%3F%3F%3F-activity-7438519821769633792-5Y2D
  - https://arxiv.org/html/2605.00065v1
  - https://arxiv.org/html/2504.15228v2
  - https://dev.to/veritaschain/building-a-tamper-evident-audit-log-with-sha-256-hash-chains-zero-dependencies-h0b
```
