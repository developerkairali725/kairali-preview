# WORK-ITEM BOUNDARY — one item, one home (M1 doctrine; plan §7.1.7 · M0(a) disposition 9)

**Written:** 2026-07-19 17:31:03 IST · M1 doctrine-merge session, feature/os-v2-architecture
**Carried by:** merge-continuity row CM/PKG per plan §7.1.7 · M0(a) report
`docs/reports/2026-07-19-m0a-paper-dryrun.md` disposition 9 (MONITOR → this doc is the rule).
**Rule g applies:** nothing here weakens any obligation; this doc only declares WHERE items live.

## 1. The four homes (normative)

| Home | Carries | Nothing else |
|---|---|---|
| **Issue register** (M2 mechanism; **until it exists, BACKLOG.md carries work items** in its NOW/SCHEDULED sections) | **WORK ITEMS** — anything that rides the issue state machine: a change, build, fix, or task with a lifecycle (open → in-progress → verified → closed) and evidence | not questions, not rulings |
| **QUESTIONS.md** | **OWNER QUESTIONS** — anything blocked on an answer only Abilash (or a named human) can give | not tasks; a question is not a work item until answered |
| **BACKLOG.md** | **DEFERRED work** — polish, parked items, and approved-risk deferrals (the deferral's ACCEPTED_RISK ruling itself lives in DECISIONS.md, owner-only per plan §2.3; the BACKLOG line points to it) — plus, interim only, the work items above until the M2 issue register lands | not open questions, not rulings |
| **DIRECTIVES.md** | **OWNER RULINGS** — append-only; the only permitted edit is the `[ ]`→`[x]` ack flip via `scripts/directive-capture.mjs` | never a task list; execution of a ruling is a work item elsewhere |

## 2. One item, ONE home

Every item lives in **exactly one** home and carries a stable id (issue id, `Q-*`, BACKLOG line,
`D-YYYYMMDD-NN`). Other homes may **reference** it by id — a reference is a pointer line, never a
restated copy of the item's content, status, or acceptance criteria. Status is updated only at the
item's home.

## 3. Migration rule (an item that changes nature MOVES)

- **Question answered → work item:** the QUESTIONS.md entry is closed in place with the answer +
  date; the resulting work is opened as a NEW item in the issue register (interim: BACKLOG.md) with
  a **back-pointer** to the question id. The question is never silently edited into a task.
- **Ruling requires execution → work item:** the DIRECTIVES.md entry is acked (flip-only) once the
  work item that lands it exists; the work item cites the directive id. The directive line itself is
  never extended with task state.
- **Work item deferred → BACKLOG:** the item moves to BACKLOG.md DEFERRED with its id and, where
  the deferral accepts a risk, the DECISIONS.md ruling reference. The originating register entry is
  closed as DEFERRED, pointing forward.
- Every migration leaves a closed entry at the old home pointing to the new id — history is the
  point; nothing is deleted.

## 4. What the lint checks (doctor + Monday ritual)

`scripts/doctor.mjs` (session boot) and the Monday wiki-lint pass check, as findings (never
auto-fix):

1. **Duplication:** the same item (matched by id, or by near-identical text without a pointer)
   open in two homes at once — **a lint finding**; the fix is collapsing to one home + pointer.
2. **Wrong-home:** a task-shaped line in QUESTIONS.md, an open question in BACKLOG.md, task state
   prose-edited onto a DIRECTIVES.md line.
3. **Dangling migration:** a closed question/directive whose promised follow-on work item does not
   exist, or a back-pointer to a missing id.
4. **Append-only violations:** any DIRECTIVES.md edit other than the ack flip.

Findings route to QUESTIONS.md or a fix PR per the existing Monday rule (CLAUDE.md (c)); the M2
issue register adds machine ids that make check 1 exact rather than heuristic.
