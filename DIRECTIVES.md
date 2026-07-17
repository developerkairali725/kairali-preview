# DIRECTIVES.md — same-session directive inbox

Every directive Abilash gives in chat is appended here THE SAME SESSION, with
source and timestamp — an unlogged directive is a dropped directive (his 16-Jul
ruling; mechanism per docs/research/agentic-memory-and-state-2026-07-16.md,
MVP item 3). Entries are append-only; the ONLY permitted edit to an existing
line is flipping `[ ]` to `[x]` via `scripts/directive-capture.mjs ack`
(flip-only fields — agents must never prose-edit a directive). The session
boot contract (scripts/boot-contract.mjs) surfaces every unacknowledged entry
at every session start until it is explicitly acked. Ack = the directive
LANDED in durable state (PR / QUESTIONS / DECISIONS / BACKLOG / sent artifact),
never merely "read it".

- [x] D-20260717-01 · 2026-07-17 14:54:40 IST · chat (Abilash, 17 Jul 2026 session prompt) — Session 2C-hardening (owner prompt): make the wave's misses structurally impossible — self-registering CI matrix, launch-scaffold + evidence gate, PR-template triangulation line, Lighthouse A5 job, drift-killer scripts, report-deliverable rule; MDX + admin-bypass rule text UNTOUCHED pending rulings · acked 2026-07-17 14:54:40 IST: executed in the session-2C hardening PR (this branch)
- [x] D-20260717-02 · 2026-07-17 14:54:40 IST · chat (Abilash, 17 Jul 2026 session prompt) — Apply Abilash's ruling on the 'every page is MDX' factory rule when given — draft amendment (TSX-as-standard) printed in the session-2C-hardening PR + QUESTIONS.md; until ruled, the rule text stays as written · acked 2026-07-17 15:29:47 IST: APPROVED as drafted — CLAUDE.md v1.7 Factory rule amended (D-RULE-MDX)
- [x] D-20260717-03 · 2026-07-17 14:54:40 IST · chat (Abilash, 17 Jul 2026 session prompt) — Apply Abilash's ruling on the admin-bypass policy when given — draft amendment (owner-only, never the agent, logged when used) printed in the session-2C-hardening PR + QUESTIONS.md; until ruled, current practice stands · acked 2026-07-17 15:29:47 IST: APPROVED as drafted — CLAUDE.md HARD GATE 9 added (D-RULE-ADMIN-BYPASS)
- [x] D-20260717-04 · 2026-07-17 15:29:47 IST · chat (Abilash, 17 Jul 2026 ~15:25 IST) — Matrix exemptions ruled STANDING: abhilashkr + kairali.ai stay out of the CI matrices; keep exemptions loud and paper-trailed (D-RULE-MATRIX-EXEMPT) · acked 2026-07-17 15:29:48 IST: applied same session: lint EXEMPT reasons + workflow comment cite the ruling
