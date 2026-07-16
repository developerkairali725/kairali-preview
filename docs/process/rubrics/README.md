# `docs/process/rubrics/` — the criteria a gate applies, in one hashable file

> **Status, stated honestly (this is the whole point of the directory).**
> This directory now **exists** — MASTER_PIPELINE §0.5 said it did not, and that
> was true when it was written (verified at `a206791`). **One gate has a rubric**
> (`G6-PRE-STRINGS.md`). **The rubric LAYER is still not built.** Specifically:
>
> | Piece | State |
> |---|---|
> | the directory | ✅ exists |
> | a worked rubric for a gate that really runs | ✅ `G6-PRE-STRINGS.md` |
> | rubrics for the other ~13 gates | 🔴 not written |
> | §11.4's `rubric_sha256` bound into every verdict | 🔴 **still a reserved field** — no verdict emitter exists yet (§0.2 is a separate build) |
> | the DON'T tables GENERATED from these files | 🔴 not built — §1552's index is still 1,548 hand-transcribed lines |
>
> **Do not read the existence of this directory as the rubric contract being
> satisfied.** §0.5's "NOT BUILT" verdict stands for the layer; only the two
> ticked rows above are real. Whoever owns `MASTER_PIPELINE.md` should update
> §0.5 to this table rather than to "done" — *that* substitution is the exact
> failure (#8) this corpus exists to prevent: **doctrine declared binding whose
> enforcement was never built.**

## What a rubric is

**A rubric is the criteria a gate applies, written down once, in a file a machine
can hash — so that "what the gate checks" and "what the gate is documented to
check" cannot drift apart.**

It is not a policy. It is not a style guide. It is the *answer key* for one
gate, and it exists to serve three consumers:

1. **The machine** — the enforcing command implements exactly these rules and
   nothing else. A rule not in the rubric is not enforced.
2. **The auditor** (human or model) — grading against a reference is measurably
   more reliable than grading from taste. §11.3, the highest-leverage finding in
   the auditor research: *reference-guided grading cut a judge's failure rate
   several-fold — nearly free, and larger than any model upgrade we could buy.*
   That is why **every rubric ships with a worked golden example.**
3. **The next engineer** — who needs the *why*, or will delete the rule the first
   time it is inconvenient. Our own record: the "ask a doctor" ban survived only
   as a code comment for a day, and the blanket physician-review promise it was
   ruled to remove **is still live in two files right now**. A rule that lives
   only in prose is a rule that is already dying.

## Naming

`docs/process/rubrics/<gate-id>.md`, where `<gate-id>` is the gate's id in
MASTER_PIPELINE §11 (`G3-PRE`, `G6-CITE`, `G7-PRE`, …).

**Composite gates get component ids.** `G6-PRE` is not one check — it is a
banned-word scan **and** a banned-string list **and** a process-claim register
**and** schema presence **and** citation resolution. Most of those are 🔴 not
built. Writing a single `G6-PRE.md` today would describe a gate that does not
exist — **failure #8 committed inside the rubric layer built to prevent it.** So
the file that exists is `G6-PRE-STRINGS.md`, scoped to the component that really
runs. `G6-PRE.md` may exist when `G6-PRE` as a whole does.

## Required sections

Every rubric carries, in this order:

| Section | Why it is mandatory |
|---|---|
| **Gate id · enforcing command · exit contract** | A rubric with no command is a wish. The command must be runnable verbatim. |
| **Provenance** | Where the rule came from: `[OURS]` (our documented failure), `[P]`, `[P:sib]`, `[J]`… per §0.4's source key. **A rule with a number and no source is a wish, marked ⚠️, and is an open question — not a rule.** |
| **The rules** | One row per rule: id, what fails, why, the incident it closes. |
| **Golden example — VIOLATING** | Real text that must FAIL, ideally lifted from the actual incident. |
| **Golden example — LEGITIMATE** | Real text that must PASS. **This half is load-bearing** (see below). |
| **Control probe** | What proves the gate ran (§0.6). No control probe ⇒ the gate did not run. |
| **Known limits** | What it does *not* catch, stated rather than discovered later. |
| **Change procedure** | §11.4, restated with this gate's specifics. |

### The LEGITIMATE example is the half people skip

§0.6's companion rule, from our own record: the Healing Secrets booklet contains
*"is not a cure for cancer; it is designed to work alongside the care of your
treating medical team"* — **exemplary honest drafting that a naive lint flags.**

> **A lint that punishes our best sentence teaches everyone to ignore it.**

So a rubric that lists only what must fail is half a rubric. The negation corpus
is committed as fixtures and runs on every invocation. During the build of
`G6-PRE-STRINGS`, the negation corpus caught a false positive in the gate's own
regex against live site copy (*"each page states honestly whether a physician has
reviewed it yet"*) **before the gate was ever wired to CI.** That is the section
earning its place.

## Changing a rubric (§11.4)

**A failing gate is NEVER fixed by weakening it** (CLAUDE.md rule g). Changing a
rubric or a threshold requires:

1. a **named reason**,
2. a **DECISIONS.md entry**, timestamped to the second in IST,
3. **Abilash's approval** (§10.6 — rubric changes are on his always-list).

> **A rubric diff inside a PR that also makes the gate pass is, by default, a
> finding.** If the rule was wrong, say so in DECISIONS and change it on its own
> merits — never as a side effect of wanting a build to go green.

Adding a rule (tightening) follows the same procedure minus the approval, because
gates are added, never weakened.

## Computing the hash

`rubric_sha256` is a **reserved field** until the verdict emitter (§0.2) exists.
When it does, it is computed over the rubric file's bytes:

```bash
shasum -a 256 docs/process/rubrics/G6-PRE-STRINGS.md
```

No hash is transcribed into these files: a hash written inside the file it hashes
is stale the moment it is saved, and a stale hash that nobody checks is worse
than none.

## Index

| Rubric | Gate | Enforcing command | Status |
|---|---|---|---|
| [`G6-PRE-STRINGS.md`](./G6-PRE-STRINGS.md) | `G6-PRE` (strings component) | `node scripts/banned-string-lint.mjs` | ✅ **LIVE** — 6 rules, control-probed, 19 tests |
| *(unwritten)* | `G6-PRE` (CTA component) | `node scripts/cta-label-lint.mjs` | 🟡 **gate LIVE, rubric unwritten** — 16 tests; the rules are documented in the script header and its fixtures |
| *(unwritten)* | `G6-PRE` (banned words) | `packages/compliance/bin/lint.js` | 🟡 gate live, ⚠️ **unvalidated DE/FR wordlist (open #12)** |
| *(unwritten)* | `G6-BUILD` | `pnpm build` → `resolveReview()` throws | ✅ gate live, rubric unwritten |
| *(unwritten)* | `G3-PRE`, `G5-PRE`, `G6-CITE`, `G6-FACT`, `G6-PROC`, `G7-PRE`, `G8-PRE`, `B-L*` | various | 🔴 mostly not built — see §12 |

**This index is hand-maintained, and that is a defect, not a feature.** §14's own
recommendation is *generate, don't transcribe*. When the generator ships, this
table and the DON'T tables both come **from** the rubric files.
