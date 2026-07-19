---
id: D-20260719-evidence-root-launches
type: process
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "One evidence root, in-repo, IST-canonical, hash-manifested — 'if it isn't in the repo, it didn't happen' survives the merge intact."
confidence: high
governs:
  - launches/
  - scripts/evidence-manifest.mjs
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.4, §2.5"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "CLAUDE.md OS v2 DOCTRINE §3 (EVIDENCE LAW v2 — the landed doctrine text)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# Evidence root stays launches/<domain>/; package taxonomy nests inside; IST canonical with UTC dual-field

## Context

The package prescribed a `clients/{client_id}/` storage tree and UTC timestamps; v1 law is
`launches/<domain>/` in the git monorepo with IST-to-the-second timestamps. Record seeded at M2
(2026-07-19 19:26:00 IST).

## Drivers

- v1 evidence law is load-bearing: launch evidence, approvals.yaml, front-gate CI, and every
  audit path key off `launches/<domain>/`.
- A `clients/{client_id}/` root is degenerate for a single-owner fleet (every client_id would be
  the same owner) and breaks CI + evidence law (plan §8 REJECTED list).
- Registers must never fork on timezone again (plan §2.5).

## Options considered

1. Adopt the package's `clients/` tree (rejected — degenerate, breaks existing enforcement).
2. Keep v1 flat evidence with no package structure (rejected — loses the useful
   RAW/PROCESSED/PUBLISHED layer discipline).
3. **Root stays `launches/<domain>/`; the package's numbered RAW/PROCESSED/PUBLISHED taxonomy is
   adopted INSIDE `launches/<domain>/evidence/`; IST to the second stays canonical with a dual
   `collected_at_utc` field on machine records; off-repo storage only for large binaries
   (video, crawls >50MB) with a committed hash manifest as the in-repo pointer of record** (taken).

## Outcome

Plan §2.5/§7.1.4; landed M1(a) as CLAUDE.md OS v2 DOCTRINE §3. SHA-256 manifests on every
evidence bundle (`scripts/evidence-manifest.mjs`, M2 mechanism); corrections = a NEW run-id,
never overwrite.

## Scientific rationale

"If it isn't in the repo, it didn't happen" is the verification-gap countermeasure (MAST ~21.3%
of failures are verification gaps — plan §0): a single git-versioned root makes evidence
append-only, diffable, and CI-addressable, which object storage and per-client trees do not.
Dual-field timestamps resolve the measured failure (registers forked on timezone) without
breaking the human-canonical IST law.

## Consequences

- The RAW/PROCESSED/PUBLISHED taxonomy applies to new evidence bundles under
  `launches/<domain>/evidence/`.
- EV-4 (CI-enforced append-only) and the manifest validator ride M2.
- Off-repo pointers without a committed hash manifest are a lint finding.
