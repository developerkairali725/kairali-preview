# PR #309 — merge handover

**Written for whoever performs the merge (owner's hands, or Codex acting on the owner's instruction).**
The agent that produced this branch does NOT merge it and does NOT bypass branch protection —
HARD GATE 9: *"Admin bypass of branch protection is OWNER-ONLY — Abilash's hands, never the agent,
no exceptions."* This file is the instruction set, not the act.

## State, as of 2026-09-15

| | |
|---|---|
| PR | https://github.com/kairali-digital/kairali-web-factory/pull/309 |
| Head | `c20d3f4732d316a3cf8175e2bdb58b7435f00dee` (local == origin) |
| Base | `main` |
| Ahead / behind | **15 commits ahead, 0 behind** — no rebase needed |
| Mergeable | `MERGEABLE` · mergeStateStatus `BLOCKED` · draft **yes** |
| Diff | 307 files, +101,632 / −38 |
| Working tree | clean |

## Why it is BLOCKED

Five required checks report `failure` with **empty output**, which is what jobs that never started
look like. This matches the GitHub Actions billing/spending limit already recorded in
`deliverables/WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001/REPORT.md`.

    changes · gate · brand-lint · front-gate · security-review

**Read this before bypassing:** these are not checks that ran and disagreed. They are checks that did
not run. Bypassing merges 15 commits with `security-review` never having executed. That is a
different risk from overriding a known-failing test, and it is the owner's to accept.

Gates that DID run, locally, on this exact head:

- `node packages/compliance/bin/lint.js` → **0 errors** across the fleet
- `node --test packages/compliance/test/*.test.js` → **71 pass, 0 fail**
- `next build` → clean, 273 static pages
- Hosted verification on the protected preview, Chromium + WebKit, 390px + 1280px

## Option A — fix the cause (preferred)

Restore GitHub Actions billing, let the five checks run, then merge normally. No bypass, no log entry,
nothing to defend later.

## Option B — bypass, on the owner's explicit instruction

```sh
gh pr ready 309 --repo kairali-digital/kairali-web-factory
gh pr merge 309 --repo kairali-digital/kairali-web-factory --squash --admin
```

`--admin` is the bypass. It requires admin rights and it is the step HARD GATE 9 reserves to the owner.

**HARD GATE 9 also requires the bypass be logged the same session.** Append to `wiki/log.md`:

```
2026-09-15 HH:MM:SS IST — ADMIN BYPASS, PR #309 (AHV English staging, 15 commits).
Reason: five required checks (changes, gate, brand-lint, front-gate, security-review)
could not start due to the GitHub Actions billing limit, not due to failing. Local gates
green on the merged head: compliance lint 0 errors, 71 tests pass, next build clean,
hosted preview verified. Authorised by Abilash, executed by <who>. Follow-up: restore
Actions billing and re-run security-review against main.
```

## After the merge

1. **Re-run `security-review` against `main`** once Actions billing is restored. It was bypassed, not passed.
2. `sites/ayurvedichealingvillage.com/app/(english)/` had **0 files on main** before this merge — confirm
   all 252 routes are present afterwards.
3. Delete nothing: `sites/villaraag.com` still has **0 files on main** and 49 commits stranded across
   `feature/villaraag-golden` (+37) and `feature/villaraag-front-gates` (+12). Same failure mode, still open.
4. Staging stays staging. This merge does NOT release anything: `AHV_STAGING` still gates robots,
   sitemap and the enquiry handler, and `AHV_ANALYTICS` is unset so no measurement id reaches a browser.
   Go-live is `docs/reports/2026-09-15-ahv-go-live-checklist.md`.

## What is in the 15 commits

Build (pre-existing): the 252-route approved English design, preview auth fix, link localisation, 7 legacy aliases.

This session:
- homepage touch-scroll restored (`touch-action:none` on every homepage photo blocked scrolling)
- enquiry honeypot hidden (was a visible field labelled "Leave this empty")
- 85 Cloudflare `[email protected]` placeholders decoded and normalised to `info@kairali.com`
- locale control given real states (EN current, DE/FR "coming soon")
- cookie notice made site-wide (was on 2 of 136 templates)
- consent-gated measurement, **off** on staging, ids recorded in `analytics.config.json`
- enquiry form lifted 6,028px → 391px
- compliance lint given a vendored-payload scope (+4 tests)
- `scripts/directive-capture.mjs` fixed — it silently no-opped on paths containing spaces
- reports: SSR gap, full UI/UX sweep, owner-reported defects, go-live checklist
