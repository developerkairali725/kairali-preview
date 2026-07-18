# Session report — Content Pipeline Architecture & Team Workbook (18 Jul 2026)

**The anchor doc for this workstream.** Any future session touching the marketing→publish pipeline starts by reading this. Everything below happened in one working session (Abilash + Claude, 18 Jul 2026, morning→afternoon IST).

## What was built and why (the arc)

**The problem, in Abilash's words:** marketing constantly needs pages/blogs created and changed; everything queued on Deepu (the one developer) hand-checking; the old KTAHV `.html` landing pages sat unupdated for exactly this reason. The trigger was Jono Catliff's video (link below) showing a Claude-Code→WordPress posting flow; the ask evolved into: *marketing builds with their tools → the factory's machine checks catch ~99% → Deepu reviews once and publishes → everything tracked.*

**Three SOP generations in one day (each correcting a real misunderstanding):**
1. **v1 (git-for-everyone):** four-lane GitHub SOP for the whole team. *Wrong* — routed marketing through the dev pipeline, recreating the bottleneck the video removes.
2. **v2 (no-git-for-marketing):** marketing builds → Drive handoff → Deepu publishes via Novamira. Right shape, but Deepu still hand-checked.
3. **v3 (the machine checks):** Abilash's insight — route imports **through the factory CI** so the existing gates do the QA; Deepu reviews once. Designed via a 10-agent workflow (4 parallel drafts → adversarial reviews → synthesis → completeness critic), fixed, and **published**.

## The live system (as of end of session)

- **Team Workbook (published):** https://kairali-team-workbook.vercel.app · voices at `/voices.html` — Vercel project `kairali-team-workbook`, team `kairali`, static deploy via the Vercel MCP.
- **Source of truth:** `docs/sops/team-website-lifecycle-sop.md` (the workbook), `docs/sops/author-voices.md`, `docs/sops/wordpress-gutenberg-setup.md`, `docs/sops/LIVE-DEMO-team-training.md`, `docs/sops/email-vikash-transcripts.md`. **NONE committed yet — Abilash review pending.**
- **Drive infrastructure** (folder `Website - Staging - Marketing`, id `1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX`, owner director@kairali.com):
  - Member folders, each with `1 — Drafts / 2 — Ready for Deepu / 3 — Published`: **Roshni, Vikash, Abilash, Anupam, Astha, Rohan, Gaurav (PPC), Eeshal, _TEMPLATE** — plus **Deepu (developer)** with Inbox / In-the-machine / Published.
  - **PIPELINE TRACKER** sheet: id `1mS6WzRrZmQVnWjfg631uOFSRDD1raFTSLhjlYuQZIos` · **START HERE** doc: id `1ilwWTz-8h6PrHslKgTrbQO9yIuDYorsXzhmEwS8QEj8`.
- **Backup system (built + tested this session):** `scripts/wp-snapshot.mjs` — pre-publish snapshot of any WP page to `backups/<domain>/<slug>--YYYY-MM-DDTHH-MM-SS.html` (IST, second precision, provenance header, hard-fails to block publishing without a backup). Test run archived whyayurveda.org home (346 KB). Baked into the Workbook's publish prompt so the machine, not memory, does it.
- **STATUS.yaml** updated (new workstream "Marketing content pipeline (Team Workbook)"; KTAHV + whyayurveda rows) + dashboard regenerated via `scripts/status-build.mjs`. Uncommitted.

## The pipeline in one paragraph

Marketing builds with **Claude Design / VS Code + Claude plugin (recommended; the video's method) / Antigravity / Claude Code** → runs the shared **"Make it publish-ready"** prompt (SEO, internal links, compliance pre-check) → approval (Abilash; **Dr. Deepu John** for any medical claim, artifact = his saved reply) → item moves to the member's **2 — Ready for Deepu** folder with a **Handoff Card** → **Deepu** renders it into `sites/<domain>/`, opens a PR, the **real CI gates** run (`pnpm compliance`, `banned-string-lint`, `content-lint`, `cta-label-lint`, `brand-lint`, `lighthouse-gate`, Playwright factory suite, `front-gate`, security review, gitleaks) → trivial dev fixes vs plain-English bounces → publish (**Novamira → editable Gutenberg** for WordPress after a `wp-snapshot` backup; Vercel merge for factory sites) → **`CHECKED-✅.txt` marker** + folder move to `3 — Published` + tracker + `content/ledger.yaml` row. **Deepu-Solo Mode**: he can run the whole chain from any raw input (incl. fetching the legacy `.html` pages himself) — the backstop that removes the bottleneck entirely. **Express Lane** (new, this session): Abilash (or a certified member) pushes the reviewed work as a git branch himself — auto Vercel preview, CI runs, Deepu only merges/publishes.

## Key decisions & findings (with the why)

- **Novamira verdict:** the right tool *for Deepu's role* (admin, staging-first, imports as editable Gutenberg). Research caveats (admin-only, all-or-nothing, does NOT self-block on production) are handled by architecture: Deepu-only, staging-only, backup-first, never left running. Optional hardening: Block MCP as a dedicated Editor. Full research in `wordpress-gutenberg-setup.md`.
- **Author voices:** 10 real whyayurveda.org bylines; **Abilash = primary default, Gita Ramesh = second**; Abilash + Gita calibrated from real published material (his ~30 bylined posts + interviews; honesty caveat: posts likely part house-written → "target house voice"). **Unresolved: "Dr. Ashika vs Ashikha Raj" spelling** — settle from her registration before using that byline.
- **Critic-driven honesty:** `sites/ayurvedichealingvillage.com` and `sites/whyayurveda.org` DON'T EXIST yet — Deepu's **one-time setup** (Workbook Part 4) creates them; until then KTAHV items can't flow through CI. Clinical lock mechanism verified real (`entity: "ktahv"` in `packages/compliance/src/rules.js`, keyed off `site.config.json`).
- **Tracking = two layers:** Drive folders + Tracker sheet (humans) and `content/ledger.yaml` (machine, STATUS.yaml stage values). `STATUS.yaml` = sites; ledger = content items. Never cross-copy.

## External comms log

- **Vikash email SENT 18 Jul 2026 04:59:52 UTC** (director@kairali.com → seo@ktahv.com, subject "Please get these videos transcribed today — for our content system"; Gmail thread `19f7394d19130949`). **No reply as of this session** — next session: search that thread for the reply; the transcripts feed (a) the exact video method and (b) Abilash + Gita voice calibration.

## Reference links (mirrored on the workbook site)

- Origin video (the method): https://www.youtube.com/watch?v=Gt8tT-xf6g4 — Jono Catliff, "How I Built INSANE WordPress Websites In 20 Minutes (Claude Code)"
- Workbook: https://kairali-team-workbook.vercel.app · Voices: /voices.html
- Drive folder: https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX
- Tracker: https://docs.google.com/spreadsheets/d/1mS6WzRrZmQVnWjfg631uOFSRDD1raFTSLhjlYuQZIos/edit
- START HERE: https://docs.google.com/document/d/1ilwWTz-8h6PrHslKgTrbQO9yIuDYorsXzhmEwS8QEj8/edit

## Open items (the pickup list for any future session)

1. **Commit everything** (docs/sops/*, scripts/wp-snapshot.mjs, backups/, STATUS.yaml + status-data.json, this report) once Abilash approves — via PR, never a direct-main push.
2. **Deepu one-time setup** (Workbook Part 4): scaffold `sites/ayurvedichealingvillage.com` (`entity: "ktahv"`) + `launches/.../approvals.yaml`; scaffold `sites/whyayurveda.org` content home; install Novamira on WP staging; create `content/ledger.yaml`.
3. **Vikash reply** → ingest transcripts → deepen Abilash + Gita voices; lift the video's exact method steps if anything's missing.
4. **Dr. Ashika/Ashikha spelling** — settle from registration.
5. **Abilash's ChatGPT once-over** of the architecture — reconcile when he brings it.
6. **Akshar's teachings (via Pawan)** → yoga voice, later session.
7. First real item through the pipeline + Deepu-solo demo in front of Abilash/team.

*Timestamped per repo law: report written 2026-07-18 ~11:05:00 IST. Chat-only output is not evidence; this file is the evidence.*

## v3 addendum (18 Jul, afternoon session — ultracode consolidation)

- **Workbook v3 published** (7-agent workflow: 4 drafters + 3 adversarial auditors → 16 audited patches applied): TIME BUDGET, DAY 0 setup, sign-off SLAs + request template, medical-claim examples, facts pack, freeze rule, NEEDS-FIX-❌ bounce marker, two-bounce cap, Deepu-away backup (=Abilash), hardened Route A (wp-snapshot + green-PR requirement + promotion step), front-gate disarm warning, EXPRESS LANE (Abilash pushes reviewed work as PRs — kills the marketing→Deepu stall), REFERENCE LIBRARY (origin video + all links).
- **New page live: /deepu.html** — Novamira install (8 steps, settings table, smoke test, verdict: right tool for this role) + the Undo Book (Recipes 1–7, automatic snapshot rule). Source: `docs/sops/deepu-publishing-guide.md`.
- **Backup system**: `scripts/wp-snapshot.mjs` built + tested (whyayurveda.org, 346KB, IST-to-the-second); baked into the only WordPress publish prompt.
- **Drive:** member folders now also Anupam, Astha, Rohan, Gaurav (PPC), Eeshal, Deepu (developer: Inbox/In-machine/Published).
- **Vikash email CONFIRMED SENT** (thread 19f7394d19130949); no reply yet — check next session.
- **Incident log (Recipe-7 honesty):** during the v3 deploy I (Claude) shipped placeholder strings instead of two files' content — production workbook was broken for ~3 minutes; caught by post-deploy verification, redeployed with real content, all pages verified. Lesson: the pipeline's own verify-after-publish rule applies to the workbook itself.
- **Bottleneck verdict (audited):** active machine+human work ≈ 1 hour/item. The three controlled human gates: (1) Abilash approvals — fixed 12:00/17:00 windows; (2) Dr. Deepu John sign-off — pre-handoff, submitter chases, batch weekly; (3) Deepu single-threaded — Express Lane + Deepu-solo + Abilash-as-backup. CURRENT HARD BLOCKER: one-time setup #1–2 (KTAHV + whyayurveda scaffolds) — nothing KTAHV can flow through CI until done.

## v4 addendum (18 Jul, midday — ONE LINK: the Playbook merges into kairali.ai)

- **The workbook site and the Fleet Pulse dashboard are now ONE site** (branch `content/team-playbook-v4`): kairali.ai gains `/playbook` (interactive 3-question wizard: who → what → tool → exact numbered path with copy-paste prompts), `/guide/access` (permission map + how Abilash grants each access click-by-click + image bank/brand docs/FACTS + delegation-system integration), `/guide/workbook`, `/guide/voices`, `/guide/deepu` (all rendered from docs/sops sources), + a site-wide nav. **After merge, the old kairali-team-workbook.vercel.app is superseded — one link for everything: the kairali.ai URL.**
- **Full Kitting** is step 1 of every build path (why/who-MoA/what/where/when + delegation task ID + FACTS + medical-claim planning). **GO marketing science (Akshar Yadav)** ingested: repo copy at `docs/marketing/go-science/` + installed locally (`/go-science` command) — MCB/MoA wired into the Kitting Card and landing-page prompt. Closes the pending "Akshar teachings" item.
- **External-linking policy added** to the publish-ready prompt (authoritative sources only, named citations on health topics, never competitors/thin sites) alongside the internal-link rules.
- **Battle test:** dev-server walkthrough of the wizard (Marketing → new LP → VS Code = 6-step path with kitting/prompts/copy buttons rendering), all 5 routes 200 with correct content, chips fixed span→button (accessibility), production `next build` clean (all routes static).
- **Permissions decided (documented on /guide/access):** marketing = Drive only (NO GitHub — by design); Deepu = repo Write + WP staging admin + Vercel member; certified members = Write after Abilash watches a full run; nobody below Abilash merges.
- **Delegation integration:** tasks live on the existing sheet (Ritu); task ID travels on the Kitting Card; the response-form proof line = the live URL + CHECKED ✅. No new system built.
- Vikash: transcripts still unanswered; 2 unread replies on the GSC/indexing thread (see Q-PLAYBOOK-V4).

## Final pre-merge audit (18 Jul, afternoon)
- **Permutation battle test: 19/19 paths PASS** (driven live in the browser): Marketing 3 tasks × 4 tools (12), Roshni, Abilash ×2, Deepu ×4. Every path: correct steps, correct prompts, no undefined, ends at the finish line.
- **Bugs found & fixed in the audit:** (1) new-blog path wrongly reused the update-a-page prompt → dedicated P_BLOG write prompt + voice-first ordering; (2) stale v1/v2 files contradicting the system (LIVE-DEMO git-flow training, old html mirrors) removed/superseded; (3) stepper UX: one card at a time + progress dots + show-all toggle; (4) GO/MCB science written INTO the landing-page prompt + dedicated /go-science step.
- Production build: clean, all routes static. Branch ready for Abilash's merge (PR open). After merge: the kairali.ai URL is the ONE LINK; old kairali-team-workbook.vercel.app to be retired.
- **Day 0 added to the wizard (final pre-merge addition):** "Day 0 — set me up" is now a baby-steps path per role AND per tool — Marketing/Roshni × (VS Code install→plugin→sign-in / Antigravity / Claude Design / Claude Code-with-Deepu) + Drive check, bookmarks, FACTS, smoke test, origin video; Deepu gets his machine setup (GitHub invite → Node/pnpm/GitHub Desktop → clone → Claude Code → pipeline setup). 6/6 Day-0 paths verified live; total verified permutations now 25/25.
