---
report_id: RPT-20260919-AHV-CI-DIAGNOSIS
date: "2026-09-19 15:42:33 IST"
task: "PR #309 — establish why all five required checks fail, and what the code-level findings underneath them are"
project: "AHV English staging rebuild (codex/ahv-english-staging-20260915, PR #309)"
source_tool: "claude-code (single-writer session)"
type: audit
supersedes: null
title: PR #309 — why the five checks fail, and what is really underneath them
status: complete
topic: ci
site: ayurvedichealingvillage.com
---

# PR #309 — why the five checks fail, and what is really underneath them

Written 2026-09-19 16:12:04 IST. The previous session could not read the CI logs and deliberately
declined to guess. This session read them. The answer is short, and then it opens out.

## 1. The five failing checks are one cause, and it is not code

`changes`, `gate`, `brand-lint`, `security-review`, `front-gate` all failed in **1–2 seconds** with
`runner_id: 0`, `runner_name: ""` and an **empty `steps` array** — no step ever executed. Every one of
the five carries the identical failure annotation, retrieved from the check-run annotations API:

> The job was not started because recent account payments have failed or your spending limit needs to
> be increased. Please check the 'Billing & plans' section in your settings

This is account-level, not branch-level. Repo-wide, **the last 200 workflow runs are 200/200 failures**
back to 2026-09-17 22:51 UTC — including scheduled `uptime` runs on `main`, which touch none of this
branch's code. The last green run of any workflow: `gate` on 2026-09-12, `factory-gate` on 2026-08-29.

Org `kairali-digital` is on the **team** plan, 8/8 seats. The org billing endpoint now requires
`admin:org`, which this session's token does not carry, so the exact figure was not read from here.

**Only the owner can clear this** — GitHub → Organization settings → Billing & plans. Until then no
check on #309 can run, and the PR cannot legitimately be taken out of draft: "green" would mean
"never executed". Tracked as `Q-AHV-CI-BILLING`.

## 2. Because the jobs never ran, nobody had seen what was underneath

Every gate was therefore re-run locally against the same commit. Three real failures were hiding
behind the billing block. One is fixed; two are the owner's to rule on.

### 2a. `brand-lint` — FIXED (commit 7d3e55d3)

17 errors, all in AHV, all in three files that are **new on this branch**, so this branch caused them.

- **Two were not colours at all.** `#418` is the React hydration error code, quoted in prose in
  `boot.ts` and `design-view.tsx`. Reworded — a fix, not a suppression.
- **Fifteen are the approved design's own palette.** Verified present in 79–157 files of the vendored
  payload under `public/ahv/`. They cannot be re-pointed at `packages/ui` tokens: the `(english)`
  route group is a second root layout that deliberately imports no token sheet, so `var(--ivory)`
  would resolve to nothing; and re-colouring is the re-theming MODE A forbids. They now carry the
  linter's own `brand-allow: rogue-hex` directive with the reason attached, so all fifteen report as
  **INFO** — visible on every run, never silent.

Every edit is a trailing comment; no runtime expression changed. `brand-lint` now reports
**0 errors, 0 warnings across 17 targets — PASS**.

The underlying tension — brand manual (doctrine d) versus an approved design with its own palette —
is genuinely the owner's and is raised, not resolved.

### 2b. `chat-bubble-lint` — REAL, and the most consequential finding of the session

Fails on this branch, **passes on `origin/main`** (verified at both commits). It is a step in the
merge-blocking `brand-lint` job.

`app/layout.tsx` is **deleted** on this branch. On `main` that single root layout rendered
`<ConsentScripts/>`, `<ChatbaseLoader/>`, `<ConsentBanner/>`, `<SocialLinks/>` and `<Analytics/>` for
the whole site. It was replaced by two route-group root layouts — the only way Next.js permits two
independent roots. `app/(lp)/layout.tsx` kept the consent scripts and the chat bubble in the correct
order. **`app/(english)/layout.tsx`, which serves all 252 approved routes, has neither.**

Consent is instead re-implemented locally in `_families/boot.ts`
(`localStorage["ktahv-consent"]`, accept/decline), and the chat affordance is the approved design's
own "Chat with Priya" link.

That collides with three standing rules at once: **D-20260718-05** (the bubble is mandatory and is
"always the ONE shared component, never a local copy"), **HARD GATE 11** (never change consent,
analytics or payment logic), and **MODE A** (the obvious fix puts a Chatbase bubble on 252
owner-approved pages, including the benchmark ones). Nothing was changed. Tracked as
`Q-AHV-CHAT-BUBBLE-ENGLISH-LANE`.

### 2c. `banned-string-lint` — REAL, 1,182 violations, all in AHV

Measured by **distinct file**, because the raw count is inflated by large JSON payloads matching many
times over:

| rule | violations | distinct files | verdict after checking the bytes |
|---|---|---|---|
| `group-attached-1908` | 563 | **255** | REAL, effectively site-wide |
| `wrong-contact-email` | 601 | 10 | one real, one false positive |
| `deepu-name-conflation` | 16 | 7 | REAL — HARD GATE 7 |
| `ask-a-doctor` | 2 | 2 | REAL — false medical claim, YMYL page |

The site-wide one: nearly every footer renders `© Kairali Ayurvedic Group Since 1908.` and hero
eyebrows render `… · Since 1908`. DECISIONS.md 16 Jul rules that 1908 is the FAMILY lineage origin
and the GROUP was founded 1989, with `· A family tradition since 1908` as the ruled form. The same
footer also types the copyright year, which D-ROLLING-NUMBER bans.

`infoo@kairali.com` is a **false positive** — it exists only inside an import provenance annotation
recording a typo on the *old* live site, and nothing renders it. `career@kairali.com` on the jobs page
is real and rendered; `boot.ts:506` records a prior session's judgment that it is an approved
departmental address, which the lint cannot know.

Items 1, 4 and 5 are clinical- or fact-register changes on a hospital site. Nothing was changed.
Tracked as `Q-AHV-BANNED-STRINGS`.

### 2d. What actually passes

`front-gate` PASS (silent, exit 0) · `authenticated-approval` PASS (no guarded path in the diff, so
correctly out of scope — the routine-PR lane of D-20260719-10) · `changes` is a diff detector and
cannot fail on this diff · `pnpm build` **16/16 tasks successful** · `packages/compliance` tests
**71/71** · compliance lint **0 errors** · **gitleaks: 1,601 commits, 699 MB, no leaks, exit 0** ·
full discovered suite **1,085 of 1,088 passing** (the 3 are a symlinked-`node_modules` artifact of the
test harness, not the branch).

`pnpm audit` fails with 16 vulnerabilities (4 critical Next.js RCE, 7 high). **Not caused by this PR**:
`pnpm-lock.yaml` is byte-identical to the merge base, and the only `package.json` change adds two npm
scripts and no dependency. It is fleet-wide and pre-existing, and doctrine (c) already routes audit
findings to a Monday triage or a separate fix PR — not to a rider on an AHV staging branch.

## 3. A trap that made every earlier local run untrustworthy

This worktree lives at `/Volumes/Extreme SSD - Blue 2nd/…`. Scripts that derive paths from
`import.meta.url` never decode the `file://` URL, so the path arrives containing `%20`, the read
fails, and **the lint finds nothing and exits 0**.

Run from the spaces path, the `brand-lint` job's 17 steps reported "17 passed, 0 failed". Re-run from
a space-free checkout of the identical commit, the same 17 steps reported **2 real failures** — both
merge-blocking. A green local run on this machine is not evidence unless it was run from a clean path.
Tracked as `Q-AHV-PATH-SPACES`.

## 4. Corrections to the 2026-09-19 handover

- **"7 single-route templates never audited" is wrong — it is 14.** An exact-string compare against
  the audit evidence was hiding them: the evidence keys templates without the `-desktop` suffix, and
  one key carries an appended note. Routes on unaudited templates: **#1, #4, #27, #43, #92, #120,
  #142, #197, #228, #240, #247, #248, #249, #251** (numbering per the route register below). #1 is the
  homepage, which is the owner's benchmark and out of scope for change.
- **"five failing checks … fix the causes"** — four of the five have no cause to fix. Only
  `brand-lint` had a real failure, and two further real failures were hiding in jobs nobody could see.

## 5. Delivered this session

- `brand-lint` green, honestly (commit 7d3e55d3).
- `sites/ayurvedichealingvillage.com/tools/build-sitemap-tree.mjs` + `english-candidate/sitemap-tree.json`
  — all 252 routes numbered stably by path order, each carrying facts (template, sitemap status,
  canonical, duplicate ruling, header/footer placement, design-audit coverage) kept separate from the
  tool's own derived 19-section grouping, which carries no approval.
- **Route register (owner-facing):** https://claude.ai/artifact/SVycnfoPYcz71hdo2nAPx7 — searchable,
  filterable, numbered; tap a number to copy `#N /path`.
- Confirmed from the approved chrome components that **every header and footer link resolves to an
  approved route** — no broken chrome links. 237 of 252 routes enter the sitemap at go-live; 15 are
  deliberately excluded by the owner's page-by-page overrides.

## 6. What the owner needs to decide, in order

1. **GitHub billing.** Nothing else about #309 can move until this clears.
2. **`Q-AHV-CHAT-BUBBLE-ENGLISH-LANE`** — shared bubble + consent on the English lane, or a written
   exemption for the design's own.
3. **`Q-AHV-BANNED-STRINGS`** — the site-wide `Since 1908` correction, the `career@` address, and the
   clinical items, which additionally need Dr. Deepu John (HARD GATE 7).
4. **`Q-AHV-PATH-SPACES`** — decode `import.meta.url`, or move the working copy off a path with spaces.

The PR stays a **draft**. Taking it out of draft while no check can execute would present an unrun
pipeline as a passed one.

## Dispositions (R3 triad — every finding rowed)

_Added 2026-09-21, with what actually became of each finding. Two were fixed the same week; one is
still the single thing blocking everything._

| # | Finding | Disposition | Reason / outcome |
|---|---|---|---|
| 1 | All five required checks fail in 1–2s with `runner_id: 0` and an empty `steps` array — an account-level billing block, not a code fault | **MONITOR** | Re-measured 2026-09-21: still failing, and traced to the actual cause — **no payment method on file** (`Payment method: you have not added a payment method`), with $77.67 metered Actions usage and automatic recurring payments disabled. The Actions budget is fine ($57.85 of $500). Owner-only; `Q-AHV-CI-BILLING`, and carried in **BACKLOG** as the single blocking dependency. Everything below it in the proof chain is blocked, because `scripts/lib/verdict.mjs` refuses any verdict not committed by a CI job. |
| 2 | `brand-lint` — 17 rogue-hex findings, 2 of them the React error code #418 quoted in prose | **IMPLEMENT** | Done: all 17 now carry the linter's own `brand-allow` marker with a stated reason, so each reports INFO rather than passing silently. |
| 3 | `chat-bubble-lint` fails here and passes on `main` — the English lane had neither the bubble nor the shared consent scripts | **IMPLEMENT** | Done 2026-09-21 on the owner's ruling: bubble on every English route, plus the Consent Mode v2 bridge it required. The lint itself had **two** bugs — it could not see route-group roots, and it exited 0 on any path containing a space. Both fixed; `chat-bubble-lint` now PASSES for real. |
| 4 | `banned-string-lint` — 1,182 violations, three of them real | **IMPLEMENT** (partial) | `group-attached 1908` fixed. `deepu-name-conflation` (16) and `ask-a-doctor` (2) remain — both HARD GATE 7, Dr. Deepu John's, not the agent's. |
| 5 | On a path containing spaces, 17 lint steps report "17 passed" while a space-free checkout of the same commit reports 2 merge-blocking failures | **IMPLEMENT** | Root-caused and fixed 2026-09-21 in **28 scripts**: `import.meta.url` percent-encodes the space, `process.argv[1]` does not, so `main()` never ran. Normalising through `URL()` fixed it. Fixing it immediately exposed two gates that had been silently passing on this machine. |
