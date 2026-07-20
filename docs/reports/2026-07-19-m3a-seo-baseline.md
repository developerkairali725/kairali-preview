---
report_id: RPT-20260719-M3A
date: "2026-07-19 22:10:00 IST"
task: "M3(a) overnight unattended build — scripts/seo-baseline.mjs (plan §3.4 R6 + §3.5 bake-off doctrine) + tests + baseline registry row (D-20260719-33)"
project: "OS v2 (M1+M2 merged; M3 tools/data)"
source_tool: "claude-code overnight session + 32-agent adversarial review workflow (2.78M subagent tokens)"
type: milestone-build
supersedes: null
---

# M3(a) — seo-baseline.mjs built, live bake-off run, adversarially reviewed

Branch `feature/m3a-seo-baseline` (off main @ 4f6c1fe). Everything below is committed on it;
nothing touched main. Designs frozen, no site work, no DNS — unattended rule held.

## What shipped

1. **`scripts/seo-baseline.mjs`** — the R6 baseline mechanism (clears strict residues
   PKG-002/PKG-068). Four commands:
   - `verify-account` — the FREE DataForSEO check; mandatory first call of any billable run.
   - `pull` — narrow REST, exactly 3 endpoints (Labs ranked_keywords, Labs domain_rank_overview,
     backlinks summary; NOT the MCP, per §3.5 bake-off-before-consolidation). Immutable dated
     raw dirs, evidence-manifested, cost-metered (`--max-cost` default $2/run refuses mid-run),
     failed pulls QUARANTINED as `-FAILED` dirs that selection ignores.
   - `register` — the vendor-neutral `seo-baseline-register/1`: GSC UI-export adapter +
     vendor normalizers; per-URL rows with disposition/decision_ref columns for Phase-2;
     every number labelled (OBSERVED_FIRST_PARTY / THIRD_PARTY_ESTIMATE rendered "ESTIMATE" /
     CALCULATED / UNKNOWN-with-written-gap); sources cited path+sha256; output bundle manifested.
   - `bakeoff` — vendor vs GSC ground truth; proposed tolerances labelled RECOMMENDATION.
2. **43 mocked tests** (`scripts/test/seo-baseline.test.js`) — no network, both-directions rule
   throughout, including a live-tool manifest SUCCESS direction and an HG14 credential-leak
   negative scan. Repo suite 718/718; merge-continuity `--strict` PASS; gate-registry lint PASS.
3. **Live evidence x4 properties** — raw pulls + registers + bake-offs committed under
   `launches/<domain>/baseline/{raw,registers,bakeoff}/`, all manifested.
4. **Registry/doctrine** — `baseline` row status stays `partial` with the remainder loud;
   strict-residues row for the script REMOVED (mechanism landed); GR-075 enforcement text
   truthed-up to match.

## Account + spend (OBSERVED_FIRST_PARTY)

Account verified live before any billable call: **$49.83 of $51 funded** at session start.
Total session spend **≈ $0.50**: probes $0.049 · four pulls $0.357 · KTAHV corrective re-pull
$0.091. Every call's cost is from the API response, recorded in `pull-meta.json`.

## Bake-off results (GSC UI 16m = ground truth; vendor = DataForSEO Labs, India/en snapshot)

| property | GSC clicks 16m | GSC clicks covered by vendor | top-20-by-clicks covered | median \|Δpos\| (within ±5) | ETV/actual (16m · 90d) |
|---|---|---|---|---|---|
| kairaliproducts.in | 191,083 | **37.7%** | 11/20 | 2.69 (74.9%) | 6.81× · 6.4× |
| ayurvedichealingvillage.com (apex property) | 75,826 | **32.0%** | 10/20 | 2.51 (73.9%) | 4.34× · 4.35× |
| whyayurveda.org | 5,375 | **3.3%** | 2/20 | 12.45 (18.5%) | 1.38× · 2.16× |
| kairali.com (http-www property) | 572 | **39.1%** | 6/20 | 3.98 (54.5%) | 186.7× · 149.9× |

Declared caveats (in every report file): GSC positions are 16-month all-geo averages vs vendor
current single-geo snapshots; UI export caps tables at 1,000 rows (API lane supersedes at M3
remainder); kairali.com's ratio is a property-fragmentation artifact (http-www slice only —
the JOIN CAVEAT line in each bake-off declares this class of distortion).

**Honest verdict (RECOMMENDATION, owner adopts):** against the proposed tolerances
(clicks-covered ≥80% · top-20 ≥16/20 · median |Δpos| ≤5 · ETV within 0.33–3×), the vendor
**FAILS the coverage and ETV bars on every property** tonight; position agreement on covered
keywords is the one solid axis on the two big properties. Meaning: **single-vendor
consolidation is NOT yet justified (§3.5 doctrine holds)** — GSC/GA4 first-party stays the
baseline spine (the register is built exactly that way); DataForSEO earns its keep for what
GSC cannot see (backlink graph, vendor-only keyword discovery, competitor visibility) at
PAYG pennies per pull. Re-judge after the GSC API lane lands (the 1,000-row cap depresses
the denominator honestly measured here). One-worder filed in QUESTIONS.md (Q-BAKEOFF-VERDICT).

## Adversarial review (ultracode, D-13)

32-agent workflow (6 lenses → per-finding adversarial verify; 2.78M tokens): **26 raw findings
→ 25 CONFIRMED, 1 refuted.** All 25 fixed in-session (commit 23868f0). The two worst were both
real tonight-bugs the mocked tests could not have caught: `latestDir` silently choosing the
KTAHV `-www` property export over the 6×-larger apex export (now: ambiguity REFUSES and demands
`--gsc-dir`), and same-day `-r2` corrections losing to their base name under lexicographic sort
(now: numeric (date, run) selection everywhere).

### Dispositions (triad rule)

| finding (lens) | disposition | reason / where |
|---|---|---|
| -www sibling auto-picked as baseline source [blocker ×2] | IMPLEMENT | strict `selectLatestRun` refuses deviant siblings; tests both directions — 23868f0 |
| lexicographic -rN / '.json' stale-selection family [3 findings] | IMPLEMENT | numeric (date, run) parsing in one selector — 23868f0 |
| register/bakeoff outputs unmanifested; orphaned partial pulls; read-side verify absent [3] | IMPLEMENT | outputs manifested; -FAILED quarantine; `verifyBundleIfManifested` before consume — 23868f0 |
| HG6 label family: blanket OBSERVED on CALCULATED fields, silent nulls→0, fabricated 0s, GSC-only 0.0% [6] | IMPLEMENT | per-field labels; null-cell counts; null-preserving normalizers; vendor-absent UNKNOWN — 23868f0 |
| test-adequacy family: manifest success direction, quarantine state, CLI args, HG14 negative, call order, per-file gaps [8] | IMPLEMENT | 13 new tests; parseArgs exported + `assertDomainish` — 23868f0 |
| GR-075 enforcement drift; placeholder timestamp; overstated residues note [3] | IMPLEMENT | continuity row truthed-up; exact IST second; note reworded honestly — 23868f0 |
| pull-meta not pinned as a hashed source in the register | REJECT | refuted by the verifier: pull-meta.json is a hashed entry in the bundle's committed manifest; both claimed failure scenarios demonstrated unreachable |
| TOCTOU two-writer race on dated dirs | IMPLEMENT (mitigated) | atomic non-recursive mkdir claim loop (`claimDatedDir`/`claimDatedFile`); full file-locking judged out of scope for a single-operator tool — on record here |

Note for the wiki security log: one review subagent ran `rm -rf $TMPDIR/seo-baseline-test-*`
cleaning ITS OWN test tmp dirs — flagged by the harness as a shared-scratch wildcard delete.
No repo or evidence paths were touched; pattern noted to avoid in future workflow prompts.

## M3 remainder (NOT built tonight, on the record)

Front-gate strategy-row CI block (`scripts/front-gate.mjs` — the baseline gate's enforcement
tooth) · GSC API/BigQuery pull lane (supersedes the capped UI tables; grants land Monday) ·
GA4 12m lane (same grants) · crawl fields + CWV lanes · the date-stamped MONITOR/REJECT/
IMPLEMENT PDF · T+7/30/60/90 comparison mode (dated re-runs already supported by layout).
All carried in the `baseline` registry row (`status: partial`) — nothing dormant is cited as
passed anywhere (activation semantics §10).
