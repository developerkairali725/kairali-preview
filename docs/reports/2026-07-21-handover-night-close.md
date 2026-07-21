---
report_id: RPT-20260721-HANDOVER-NIGHT
date: "2026-07-21 16:50:00 IST"
task: "Night close — owner away from ~16:20 IST (family evening). Unattended block: Ambuj asset folder built+verified · Shadab reply reconciled (3 questions) · kairalicenters FAQ schema root-caused · directive-capture id-collision fixed with tests · 7 PRs merged"
project: "OS v2 / web factory"
source_tool: "claude-code session (unattended after 16:20 IST)"
type: handover
supersedes: RPT-20260721-HANDOVER-EVENING
---

# HANDOVER — night close (21 Jul, ~16:50 IST)

Read this first, then STATUS.yaml + state/boot.json. Branch of record: main.
Designs FROZEN; pilot = theblushlounge.com; ULTRACODE default.

**The owner left at ~16:20 IST for his mother's birthday** with four one-word questions unanswered
(below). Everything after that point was unattended work inside the stated lane: no DNS, no
production, nothing needing his ruling.

## OWNER QUEUE — the four one-worders, still open (reply on one line)

1. **Q-D05-GPT-LANE** — STAND / RE-RUN. The GPT walkthrough ran on the stored API key rather than
   his live-GPT lane. Artifacts (50 findings + transcript) held UNCOMMITTED in the session scratchpad
   pending this word. *Rec: STAND.*
2. **D-05 Card A** (anti-slop rules as blocking design checks) — APPROVE / SKIP. *Rec: SKIP —
   Perplexity disagreed, so the all-three-agree bar failed on the evidence.*
3. **D-05 Card B** (karpathy "flag dead code, don't auto-delete") — APPROVE / SKIP. *Rec: APPROVE —
   all three agreed; it is a one-line SOP addition, no install.*
4. **D-07 design-source matrix** — GO / HOLD, plus confirm motionsites.ai is the tool he meant.

Plus the standing set: the 9 Astha one-worders + Q-KAG-LOCKUP, the REVE-awards word, **four email
drafts waiting on his send** (see below), and **five Drive files to delete** — the superseded v1 status page, the three
"YouTube 1/2/3 of 3" sheets (their durations are coerced; the full 355-row sheet is exact and covers
the same videos), and the semicolon-broken AHV 3-of-3 sheet. All named in the folder's v2 READ FIRST
page. The agent has no delete capability, so those are genuinely his hands.

## FOUR DRAFTS WAITING ON HIS CLICK

The Gmail connector in this session exposes **create_draft only — there is no send capability**.
That is a tooling limit, not the draft-only rule; his instruction to "send" Ambuj's mail could not be
executed. Registered as a second instance of the C12 pattern from today's prompting review, pointed
the other way: an authority granted that the tooling cannot exercise.

1. **Ambuj** (`r4362572329399210941`) — the media/catalog folder handover. **Send this one**; it
   supersedes the earlier `r-3799592384089923504`, which predates the corruption findings and does
   not point him at the READ FIRST page.
2. **Ritu** (`r1292003270237150588`) — the printable pending-items checklist.
3. **Shadab** (`r2516274248010011845`) — repos to the org, declare connector permissions before any
   live theme, add director@ on .in, create the read-only agent account.
4. **Deepu** (`r641942033202879366`) — the kairalicenters FAQ schema fix, in plain English.

## MERGED THIS SESSION (7 PRs)

#216 mailbox reconcile · **#230 emitter fix** · #231 prompting review + D-06 close · #232 D-07 matrix
· #233 evening close · #234 Ambuj asset access · #235 Shadab reconcile.
Open and armed: **#236** (FAQ diagnosis), **#237** (directive-capture fix).

**The emitter fix is PROVEN, not merely merged**: its first guarded run wrote verdict commit
`d21f8e0` to main, healing the stale-verdict lane that had been silently broken since wave A. Later
main pushes correctly SKIP emit-verdicts (docs-only diffs) — that is the design, not a regression.

## WORK DONE UNATTENDED

### 1. Ambuj asset folder — built, and verified rather than trusted
Drive `1Lk9-vjgOV8AWQ2K4wBpBW50DMA5j09UW`, owner-shared. Answer to his "GitHub or Drive?": **Drive** —
binaries were never in git; only the catalogs were, so those were exported as Sheets. Binaries stay
single-source in Anupam's/Astha's folders and are reached by link, never duplicated.

**The verification earned its keep — and then corrected itself, which matters more.** At 11:13 the
355-row YouTube sheet exported as header-only and was written up as silently truncated. It was not
abandoned: a concurrent agent was still filling it by another route and finished later. See the
CORRECTION below — that sheet is now the single best copy in the folder. The lesson stands and
sharpened: nothing in Drive metadata reveals content state, AND a check that races its subject can
publish a confident wrong answer.

Threshold learned: ~112KB and ~140KB payloads upload intact; ~160KB silently truncates. Catalogs were
therefore split into ≤~56KB parts, each export-diffed against source.

**CORRECTION, 17:45 IST — the picture changed after the first verification pass, and the correction
matters more than the original finding.** The 355-row YouTube sheet was NOT abandoned empty: a
concurrent agent, unable to push 160KB through the inline-content tool, created the sheet with a
header and then wrote all 355 rows through the Sheets API with **type-guessing switched off (RAW)**,
finishing AFTER the verification pass had already read it as header-only. Re-verified: **355/355 rows,
id column exact in order, ZERO duration coercions, normalized md5 identical to source** — the only
difference is one non-breaking space rendered as a plain space. **That sheet is the BEST copy of the
YouTube catalog, not the worst**, and the three split "YouTube 1/2/3 of 3" sheets that replaced it are
the inferior ones (14 coerced durations between them).

The first status page therefore told Ambuj to delete exactly the sheet he should use. It was written
before the last check finished — a snapshot published as a conclusion, which is the same failure the
BRIEFS & STATE-TRUTH rule exists to prevent, committed by the agent this time. A **v2 status page**
now supersedes it inside the folder, and the v1 page is on the delete list.

**Verification found FOUR corruption modes in total, none visible from a success response or a title:**

1. **Silent truncation** — a sheet uploaded, reported success, kept a title advertising 355 rows, and
   contained only the header.
2. **Type coercion on `duration`** — CSV import read `MM:SS` as a clock time wherever minutes >= 24
   and rewrote it as `HH:MM:SS`. `29:54` (29 min 54 s) became `29:54:00` (29 HOURS). 14 cells across
   the three split YouTube sheets. Worse than a uniform error: shorter durations look untouched but
   are time-typed too, so the column is internally inconsistent and cannot be repaired by reformatting.
3. **Delimiter mis-guess** — AHV illustrations 3 of 3 imported on SEMICOLON: 19 jumbled columns
   instead of 11, the whole header stuffed into cell A1. All 116 rows present; unusable as a
   filterable catalog.
4. **A verification that raced its subject** — the check ran while the upload was still in flight and
   published a confident wrong answer. Timing is part of the method now, not an assumption.

**The working method, proven:** create the sheet, then write rows through the Sheets API with RAW
input. That is the only route today that produced a byte-faithful catalog. CSV-import via
`create_file` guesses types and delimiters and cannot be trusted for data.

Clean and verified: **YouTube 355** · products 561 · KTAHV 326 · Villa Raag 226 · AHV 2 of 3 118 ·
other 3 · IMAGE_INVENTORY 812. KTAHV and Villa Raag carry only the benign `True`->`TRUE` display
coercion in `register_ok` — fold it back and the source md5 reproduces exactly, so match
case-insensitively downstream. Not round-tripped: VIDEO_CATALOG (Drive shoots), AHV 1 of 3.

**Owner deletes (5 — the agent has no delete, rename or update):** the v1 status page · YouTube
1/2/3 of 3 · AHV illustrations 3 of 3. All named in the v2 page inside the folder.

**Methodology finding worth keeping:** parallel verifier agents sharing the scratchpad with generic
filenames (`export.csv`, `src.norm`) **contaminated each other mid-run** — one nearly reported a
false TRUNCATED after reading a sibling's export. Two agents caught it, re-ran isolated, and flagged
it. Any future parallel verification must use unique per-agent paths.

### 2. Shadab's 15:04 reply — reconciled, 3 questions minted (#235)
He delivered well: backups in three places, live themes untouched, no tokens over email. His reply
discloses three things needing rulings, none a discipline problem — **Q-SHOPIFY-REPO-HOME** (both
theme repos live in his personal GitHub account: a continuity risk, no org policy reaches them;
rec TRANSFER), **Q-SHOPIFY-TOOLKIT-SUB** (the prescribed Shopify AI Toolkit plugin does not exist in
the marketplace; he substituted connectors — right-tool-right-time says the declared capability must
be the one that fired; rec ASSESS then ACCEPT-SUB), and **Q-SHOPIFY-IN-ACCESS** (owner is Admin on
.com but **absent** from the .in staff list — same shape as the 20-Jul partial-access gap).

### 3. kairalicenters FAQ schema — root-caused (#236)
Gaurav escalated the GSC *Unparsable structured data* error at 15:00 with no cause named. Cause found:
**`wpautop` is rewriting the newlines inside the JSON-LD as `<br />` tags**, 41 of them, starting
before the opening brace — so the block is not valid JSON at all. The markup itself is correct; the
CMS corrupts it on output, which is why the reported symptom misdirects toward a schema field. Scope
confirmed as ONE page (`/` and `/about-us/` clean). Fix is Deepu's hands (production is never ours):
repaste as a single line in a Custom HTML block.

### 4. directive-capture id collision — root-caused and fixed (#237)
**D-20260721-09 is held by two captures**: GO-DOCTOR-FIX (11:11 IST, PR #220, still open) and AMBUJ
ASSET ACCESS (16:15 IST, merged). Two causes, both closed: `nextId()` used COUNT+1 (so any gap
reissued a live id — the mechanism behind BOTH earlier collisions on record), and it could not see a
capture on an unmerged branch (today's case). Now MAX+1 plus an advisory cross-ref check that WARNS
after a successful capture — never blocks, because a capture that fails on a slow git is the exact
dropped directive the mechanism exists to prevent. 14 tests; live-verified against the real repo.
**DIRECTIVES.md gets an ID-COLLISION NOTE only — no row mutated**, per the file's own precedent.
Note for whoever merges #220: it also carries D-20260721-10, which main has not issued yet.

## WATCH LANES

**Deepu's AHV read-confirm was due EOD today — check first next session.** No reply as of 16:50.
Sunaj guru publish (wordings with him since 10:50) · Dr. Deepu John's final "confirmed" (his 8 fixes
are now really in the #145 stack as c160274, after #219 was closed unmerged) · Vikash GA4 items +
the GA4-Admin gap · Satyam CRM auth lock (endpoints still HOT).

## STANDING CAUTIONS (delta from evening)

Records PRs conflict on `docs/reports/index.json` almost every time now — resolve by regenerating,
and prefer ONE records PR per wave · Drive uploads over ~150KB fail SILENTLY with a success response
and a truthful-looking title; always export-diff · the Drive toolset here is create+read only (no
delete, rename, or in-place update), so mistakes cannot be cleaned up by the agent · the Gmail
connector cannot send · guard.sh still bites on stale branch lineages (push from a main checkout) ·
CRM endpoints HOT until Satyam's written lock.

## Dispositions

- A Drive upload that returns success and keeps a truthful-looking title is indistinguishable from a good one by metadata alone, and four distinct corruption modes (silent truncation, duration type-coercion, semicolon delimiter mis-guess, and a check that raced its own subject) were found only because every sheet was exported back and diffed — the proven-good route is create-then-write-rows via the Sheets API with RAW input, never CSV-import — **IMPLEMENT** (done: export-and-diff is now the standing rule for any repo→Drive export, and the folder carries a READ FIRST status page naming file-by-file what is verified; the two unrepairable files need the owner's delete because this toolset has none)
- Parallel verifier agents sharing a scratchpad with generic filenames read each other's intermediate files mid-run, and one nearly reported a false TRUNCATED off another agent's export — a verification that can be silently contaminated is worse than none, because it launders a wrong answer as a checked one — **IMPLEMENT** (done: unique per-agent paths are mandatory in any future parallel verification; two agents caught this themselves and re-ran isolated, which is the only reason the batch is trustworthy)
- The Gmail connector exposes create_draft with no send, so an explicit owner instruction to send could not be executed — the same class as the prompting review's C12 finding (an assumed capability state) pointed the other way: an authority granted that the tooling cannot exercise — **MONITOR** (home: BACKLOG watch row added this report — if send capability appears, the doctor-lane direct-send ruling D-20260720-15 becomes executable for team mail too and the owner should be told it changed)
