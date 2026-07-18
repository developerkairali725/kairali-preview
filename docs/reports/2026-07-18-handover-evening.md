# HANDOVER — evening session pickup (18 Jul 2026, written ~14:15 IST)

Read this + `STATUS.yaml` + the open items in `QUESTIONS.md` first. Previous reports today: `2026-07-18-batch-sops-and-setup-walk.md` (PM session) · `2026-07-18-handover-next-session.md` (AM).

## STATE (verified, as of main @ d18d2a7)

- **Merged today:** #109 (Playbook v4) · #110 (Vikash batch QA/QC + Roshni 600-post batch wizard SOPs) · #111 (one-time setup walk). #94/#95/#96 (bronze rescue, merge=union, leaf-700) all merged 17 Jul — nothing from that arc is open.
- **Old `kairali-team-workbook` Vercel project DELETED** (URL verified 404; Playbook 200). No other stale dashboards (`voyagent-pulse` = unrelated Voyagent app; `portfolio-website` = old personal site, Abilash's call pending; `kairali-guru-website` = live, keep).
- **Scaffolds exist on main:** `sites/ayurvedichealingvillage.com` (entity ktahv) + `sites/whyayurveda.org`, both with ARMED `launches/<domain>/approvals.yaml` — **all 8 rows `pending`**. `content/ledger.yaml` created. Matrix EXEMPT ×2 TEMPORARY (Q-SCAFFOLD-MATRIX): exit = first-page PR adds the matrix entries.
- **Honest verification status of the Playbook:** every wizard path is click-through verified (25/25 permutations on the v4 audit + the 4 new/changed paths on 18 Jul: chips → numbered baby-step cards → warnings → working copy-paste prompt buttons → finish line). **No real content item has flowed end-to-end yet** — the novice-proof proof is the "first item through the pipeline" demo, deliberately queued AFTER Abilash's signatures + Deepu's Novamira install.
- **GitHub Actions burn (the 90% warning):** July usage is **11,444 Linux minutes** against the Team plan's 3,000 included — **$50 net overage already** (data: billing usage API, 18 Jul). Cause: 16 matrix jobs (8 sites × factory-spec + lighthouse) run on every PR push. Fix is TWO-part: Abilash raises the budget (steps in his queue below) AND the next session cuts the burn (session queue #4).
- **Open PRs: only dependabot** (#5, #6, #7 = GitHub Actions majors · #9 Next 16 · #10 eslint 10 · #11 TS 7 · #12 types/node 26 · #93 minor+patch group). **Merge NONE of them by hand** — session queue #5 triages them one at a time.

## ABILASH'S ONE-AT-A-TIME QUEUE (strict order — the session asks ONE at a time)

1. **Merge PR #112** (this handover — docs-only, one click, after CI green).
2. **Raise the GitHub Actions budget** (~2 min, exact clicks): github.com → profile photo (top-right) → **Your organizations** → **kairali-digital** → **Settings** → left sidebar **Billing & Licensing → Budgets and alerts** → find the **Actions** budget → **Edit** → set a higher monthly amount (recommendation: **$100** for now — July is at $50 with 13 days left; the engineering fix below will pull the real burn down) → make sure alerts stay ON → Save. If no budget exists there, click **New budget** → product **Actions** → scope: this organization → amount → Save.
3. **Sign the 8 front-gate rows** (in-session, one domain at a time; reply one word each: `APPROVE brief` · `APPROVE strategy` · `APPROVE design_source` · `APPROVE golden_page` — first ayurvedichealingvillage.com, then whyayurveda.org; context notes are inside each approvals.yaml). Blocks: Vikash's 11-page batch, Roshni's batches.
4. **Ratify Q-SCAFFOLD-MATRIX** (one word) — the temporary matrix exemptions for the two page-less scaffolds.
5. **Required-checks one-click** (15 matrix contexts not yet required on main — boot warns every session; the exact `gh api` command is printed by `node scripts/launch-scaffold.mjs` output block / in PR #92's body).
6. **Q-PLAYBOOK-V4 #2:** confirm "ChatGPT notes" = the Control SOP v1.0 docx (or point at the real file). *Answering this auto-closes the "old ChatGPT once-over reconciliation" item from the AM handover — nothing else is pending on it.*
7. **Dr. Ashika vs Ashikha Raj spelling** — settle from her registration (blocks that byline).
8. **Akshar yoga voice — one word: GO or WAIT.** The GO science itself is DONE (ingested at docs/marketing/go-science/, wired into the Kitting Card + landing-page prompt + /go-science). The only open decision: build a yoga AUTHOR VOICE from Akshar's teachings now, or when yoga content actually starts? (Q-POS-MCB in QUESTIONS.md gets marked resolved either way — MCB is defined by the ingested material.)
9. **Read the 2 unread GSC-thread replies** (Gmail thread 19f6a1348e3f5d73) + **chase Vikash on transcripts** (thread 19f7394d19130949 — still unanswered).
10. **portfolio-website Vercel project** — keep or retire? (One word.)

**Deepu, in parallel (his wizard task "One-time setup + install Novamira"):** Novamira on WP STAGING → bookmarks → run the verify prompt → record PASS in the Tracker.

## SESSION QUEUE (agent work, strict order; blockers noted)

1. **Roadmap PROMPT 2** — host previews for the review round: Vercel preview URLs per built site + Playwright screenshots 390/768/1440 + full link check + Lighthouse vs previews; then draft the four Gate B–E audit-request emails (drafts only). Source: `docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md` §PROMPT 2. No blockers.
2. **PROMPT 5** — unified gate registry across the three site classes (commerce/organic/landing + external monitor-only column).
3. **PROMPT 4** — single-pager pilot launch: one completed single-pager through the ENTIRE chain as a pipeline test, four human-audit packets, STOP before publish; log duration/token cost into STATUS.yaml (the per-site baseline).
4. **Actions-burn engineering fix** — factory-gate.yml: add `concurrency` (cancel-in-progress per ref) + path-filter the 16 matrix jobs so sites/packages changes trigger them, docs-only PRs don't. This is what makes the $100 budget durable.
5. **Dependabot triage** (Monday ritual, early): merge #93 (minor+patch) then #5/#6/#7 (actions majors) ONE AT A TIME after each CI green; **DEFER #9 (Next 16) / #10 (eslint 10) / #11 (TS 7) / #12 (types/node 26) to a dedicated migration session** — majors, real risk, not click-merges.
6. **First item through the pipeline demo** (BLOCKED on Abilash queue #3 + Deepu's Novamira) — Vikash's 11-URL list is the natural first batch; the demo in front of the team IS the training.
7. **Ack directives** D-20260717-08 (verify Lighthouse median-of-5 actually landed), D-20260717-10 (front gates — v1.8 built, verify then ack), D-20260718-01 (merged today, ackable) — only after verifying each mechanism on main.
8. **Later:** whyayurveda sitewide link map (after first content item; needs GSC) · FACTS auto-sync from @kairali/facts · FACTS [TO FILL] assignment to Vikash via delegation sheet.

## PARKING LOT & OPEN QUESTIONS (the durable record — chat history is NOT a source)

Per repo law, anything from past chats that mattered is in these files; anything not in them was dropped by definition (directive-capture law). **The AM handover's open questions (2026-07-18-handover-next-session.md) are fully absorbed into the queue above** — ChatGPT-notes (#6), Ashika spelling (#7), Akshar yoga voice (#8); nothing from it remains outside this file. QUESTIONS.md is append-only since project start (13 Jul) — it IS the historical record of every chat's open items:
- **QUESTIONS.md** — open: Q-PLAYBOOK-V4 (3 items) · Q-SCAFFOLD-MATRIX · Q-FRONT-GATE-BACKFILL · plus older open items (DE/FR banned-word list confirmation, forms schema from Ambuj, claims-jurisdiction matrix, MDX-frontmatter entity convention, severity split). First session task when idle: print every still-open item verbatim, tagged needs-Abilash / needs-team / stale-close — then feed Abilash's queue one at a time.
- **IDEAS.md** (append-only parking lot): Kairali herb list as content source · periodic external-model repo review · physician-review flip pass · Kerala Towels launch · Ayurveda Academy launch.
- **BACKLOG.md**: NOW / SCHEDULED / WAITING-ON sections current as of this commit (incl. DEFERRED polish items).
- **state/boot.json**: surfaces unacked directives + required-checks drift every boot — trust it over memory.

## STANDING SESSION PROTOCOL (Abilash's 18 Jul directive — also saved to Claude memory)

1. **One ask at a time** to Abilash, ordered by priority/blockers — he's human, non-technical, and will do them one by one.
2. **Always state PR merge order explicitly**, including "do not merge X yet" — he clicks merge himself and must not be able to make a mistake.
3. **Every session ends with an auto-generated handover** (repo file + memory + paste-prompt) WITHOUT being asked — and recommend a fresh session whenever context grows heavy.
4. Exact click paths for anything he does in a UI. Approvals arrive as one-word replies.

## PASTE THIS TO START THE NEXT SESSION

> Read docs/reports/2026-07-18-handover-evening.md, then STATUS.yaml. Work the SESSION QUEUE in order (roadmap PROMPT 2 → 5 → 4, then the Actions-burn fix, then dependabot triage). Run my ONE-AT-A-TIME queue with me in parallel — one question at a time, starting with the front-gate signatures. Follow the standing session protocol: merge order for every PR, auto-handover at the end, fresh session when heavy.

*Timestamped per repo law: 2026-07-18 14:15:00 IST.*
