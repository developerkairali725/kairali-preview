# decisions/ — the decision provenance store (OS v2, plan §3.2)

**Why this store exists (owner requirement R2, D-20260719-03):** every stakeholder-questionable
choice — "why this font / this color / this tagline / this keyword / this sitemap" — must have a
scientific *why* that is historically retrievable, forever. This directory is that record.
Adopted per the merge plan (docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §3.2) and
seeded at M2 (2026-07-19). Clears strict residues CM-073/CM-076
(docs/process/os-2026/merge/strict-residues.yaml).

## Format law — one decision per file

Every decision record is one markdown file:

```
decisions/D-YYYYMMDD-<slug>.md              # global (OS/doctrine/fleet-wide)
launches/<domain>/decisions/D-YYYYMMDD-<slug>.md   # site-scoped, SAME format
```

- `<slug>` is kebab-case words (`[a-z0-9-]`, never a bare number — bare-number ids belong to the
  DECISIONS.md owner-ruling log and must not collide).
- The filename IS the id: frontmatter `id` must equal the basename without `.md`.

### Frontmatter (all fields required unless marked optional)

```yaml
---
id: D-20260719-example-slug
type: design.font          # enum below
status: accepted           # proposed | accepted | rejected | superseded
date: "2026-07-19 12:10:00 IST"   # when the decision was TAKEN — IST to the second
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "One sentence: what this decision is expected to produce (decision-journal practice — beats hindsight bias)."
confidence: high           # low | medium | high — at decision time, never edited in hindsight
supersedes: D-20260701-old-slug    # optional — only on a superseding record
superseded_by: D-20260801-new-slug # optional — only on a superseded record (the backlink)
governs:                           # optional — explicit repo paths this decision governs.
  - gates/class-map.yaml           # When present it REPLACES the Guardian's type-to-path
  - CLAUDE.md                      # heuristic for this record (precision channel).
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.1"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
---
```

**`type` enum:** `design.font` · `design.color` · `design.direction` · `content.tagline` ·
`seo.keyword` · `seo.sitemap` · `gate` · `infra` · `commerce` · `process`

**`trust_tier` enum** (SE-3 source trust tiers, plan §5): `owner_ruling` (Abilash's word, DIRECTIVES.md/DECISIONS.md/chat)
· `repo_artifact` (committed file — plan, report, register, evidence bundle) · `external_verified`
(external source independently corroborated at tier 1) · `external_unverified` (forum/anecdote —
never sufficient alone).

### Body — six sections, this order, all present

```
# <Title — the decision in one line>
## Context
## Drivers
## Options considered
## Outcome
## Scientific rationale
## Consequences
```

`Scientific rationale` carries the citations (research, measured evidence, doctrine passages) —
the R2 "scientific why". Quote sparingly; cite file + section.

## IMMUTABILITY LAW — accepted records are never edited

**An ACCEPTED record is immutable. A change of mind = a NEW record with `supersedes: <old-id>`,
and the two are linked both ways.** The ONLY permitted mutation of an accepted record is the
supersession flip itself: `status: accepted → superseded` plus the addition of the
`superseded_by: <new-id>` backlink — nothing else, ever. A superseded record is equally immutable
thereafter. `scripts/decisions-index.mjs` enforces this mechanically: the committed
`decisions/index.json` stores a content hash per record (with the two mutable fields excluded),
and a rebuild FAILS if an accepted/superseded record's content changed against the stored hash.
Records with `status: proposed` or `rejected` may still be edited (they have not entered history).

**Base-trust (CI):** in CI, `--check` reads the PRIOR ledger from the **merge base**
(`git show <merge-base>:decisions/index.json`, `BASE` env), never from the PR's working tree —
so a PR that edits an accepted record and re-hashes `index.json` in the same commit is judged
against the ledger it could not rewrite (edit-and-reindex and delete-and-deindex both FAIL).
Every accepted/superseded record indexed at base must exist at head with an unchanged
`immutable_sha256`; the supersession flip stays the only legal mutation. The one exception is
the bootstrap: the PR that MINTS the store has no base ledger, so the check runs working-tree-only
with a loud `BASE-TRUST UNAVAILABLE` line — fail-closed would break that very PR. Local runs
without `BASE` keep the working-tree comparison and print that CI enforces base-trust.

## ADR ALTITUDE LAW (plan §7.1.13)

Records are written at **DECISION altitude, not keystroke altitude**: one record per design
direction / token set / sitemap / keyword map / named tagline choice — anything a stakeholder
might later ask "why?" about — never one per trivial instance. A hero swap's "why this image"
is one site-scoped record; the twelve commits that implemented it are not.

## Relationship to DECISIONS.md

**DECISIONS.md stays exactly as-is: the owner-ruling CAPTURE channel** (append-only, in-session).
This store is the PROMOTION target: at session end, durable rulings are promoted from
DECISIONS.md/DIRECTIVES.md into full records here (doctor checks none is left unpromoted —
plan §3.2). A record never replaces the ruling it was promoted from; it cites it as an
`owner_ruling` source.

## Tooling

- `node scripts/decisions-index.mjs` — validates every record (global + site-scoped), enforces
  immutability against the committed index, rebuilds `decisions/index.json`.
- `node scripts/decisions-index.mjs --check` — CI mode: index up to date + no mutated
  accepted records; exit 1 on any finding.
- `node scripts/decisions-index.mjs guardian --base <sha>` — Decision Guardian: for a PR diff,
  prints which records GOVERN the touched files ("you are touching X — D-nnn governs").
  Matching: a record's explicit `governs:` paths when present; otherwise site scope
  (`launches/<domain>/decisions/` records govern their `launches/<domain>/` + `sites/<domain>/`
  trees) plus the type-to-path heuristics documented in the script header.
  Informational, exit 0 — **the Guardian informs, the owner rules.**

## Boot hook

The session boot contract loads `decisions/index.json` so every session starts decision-aware
(plan §3.2; continuity rows CM-073/CM-076: the index joins the durable-state set and the boot
load). The `scripts/boot-contract.mjs` wiring itself lands with the M2 integrator — until that
edit lands, loading the index at session start is declared doctrine (ACTIVATION SEMANTICS,
CLAUDE.md OS v2 §10).
