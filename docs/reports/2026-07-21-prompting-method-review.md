---
report_id: RPT-20260721-PROMPTING-METHOD
date: "2026-07-21 14:20:26 IST"
task: D-20260720-05 — prompting-method review leg ("review how I prompt/communicate with other AIs — method + efficiency")
project: "OS v2 / web factory"
source_tool: "claude-code workflow (4 evidence readers + writer + adversarial verifier) over DIRECTIVES.md, review-b evidence, director@ sent mail, report corpus"
type: review
supersedes: null
---

# Prompting-Method Review — how the owner communicates with AIs (and where it costs)

Ordered by the owner under D-20260720-05 (DIRECTIVES.md:80). Scope: METHOD and EFFICIENCY of the owner's prompting/communication style. This report reviews method, never competence — the headline finding is that the method is measurably strong and the losses are locatable and fixable. Every claim below carries a file+line or Gmail message-id citation (HARD GATE 6). No quote in this report is invented; all quoted fragments are verbatim from the cited sources.

---

## 1. What was reviewed + evidence base

Four independent evidence readers ran over four corpora; this report synthesizes their findings.

| Corpus | Contents | Counts |
|---|---|---|
| A. Directive ledger | `DIRECTIVES.md` (full, 134 lines) + owner-ANSWERED rows of `QUESTIONS.md` (733 lines, grep-targeted) | 116 directive rows, D-20260717-01 → D-20260721-08, 17–21 Jul 2026; 96 acked `[x]`, 20 open |
| B. Review-B conformance corpus | `docs/reports/2026-07-20-os-deep-review-b-owner-inputs.md` + `.../2026-07-20-os-deep-review-b-findings-index.md` (conclusions taken as given, not re-litigated) | 523 raw owner inputs → 430 canonical → 462 verdict rows (13–20 Jul, ~54/day); 118 findings |
| C. Sent mail (human baseline) | Gmail `in:sent newer_than:7d` (~201 threads; first page covered fully, 6 threads read in full body) | 30 threads surveyed; ~20 messages cited by id |
| D. Cross-artifact prompt record | `DIRECTIVES.md` verbatim-prompt rows; deep-review A/B/C reports + `2026-07-21-os-deep-review-c-evidence.json`; `2026-07-20-silent-failure-audit.md`; banked Perplexity chat digest `docs/research/perplexity-shopify-cleanup-chat-2026-07-20.md` (6 verbatim owner turns); `docs/research/emitter-lane-external-consult-2026-07-21.md`; 3 handovers | — |

Headline numbers up front (all derived in §3–§4): 98.9% understood-PASS across 462 verdict rows; one true intake miss in 430 canonical inputs (~0.2%); ~5% self-correction rate; ~2.6% explicit ambiguity-flag rate on the ledger.

---

## 2. METHOD INVENTORY — the owner's actual prompting patterns

Each pattern is what the record shows he actually does, with citation.

**M1. Voice-first burst dictation.** 58 of 116 directive rows are source-labeled voice, 29 explicitly Wispr (grep counts on DIRECTIVES.md; DIRECTIVES.md:26–40 — D-20260718-03..-17 all "(voice)"). ~49% of rows arrive in multi-directive bursts sharing one capture timestamp — 20 bursts of 2–6, max six rows stamped "2026-07-21 10:45:42 IST" (DIRECTIVES.md:128–133) and five stamped "2026-07-19 13:22:44" (DIRECTIVES.md:55–59).

**M2. One-word ruling vocabulary against agent-pre-staged decision cards.** Single tokens decide: "(one word: local)" (DIRECTIVES.md:60), "(one word: send)" (:62), "one word 'ruleset'" (:126), "the word UNFREEZE" (:123), "'Approve Card-1'" (:97), "reduce" → CARD-5 RULED (:110); plus 7 rulings via structured AskUserQuestion options (reader-A tally; e.g. QUESTIONS.md:459 "One word decides: RULESET (recommended) | PR-LANE | BOT-ADMIN"). DECISIONS.md:477 records "(Abilash, in-chat, one word)".

**M3. Asymmetric protocol engineering — batched outbound, strictly serialized inbound.** He batches his own dictation (M1) but ruled his inbound tasks arrive "ONE AT A TIME, short — no long checklist walls" (DIRECTIVES.md:91, D-20260720-16), after first ruling it in D-20260719-12 (:54); companions D-20260720-04 "one small task at a time" (:79) and D-20260720-06 checklist items never clubbed (:81). Honored in practice: "The whole queue was worked ONE TASK AT A TIME per the session prompt" (2026-07-21-handover-afternoon-close.md:14–15).

**M4. Batch answer-walks on the question backlog.** QUESTIONS.md cleared in sittings — "Answered today by Abilash (in-chat)" 7+-answer batch (QUESTIONS.md:87–88), a "night batch" (:130), and the 25-question walk "completed 18:55 IST" (DIRECTIVES.md:37).

**M5. Exact routing data dictated verbatim.** Names, addresses, CCs, Gmail thread/message ids, full URLs: "Shadab Ali (developer6@kairali.com), CC Sunaj (sysadmin@kairali.com) ... (thread 19f7478c2e493a9d)" (DIRECTIVES.md:32); thread+msg ids at :26; full Pinterest search URL at :31.

**M6. Multi-modal single-burst delivery.** Voice + file drops + photographed printouts + pasted secrets in one message: "Wispr voice + photos + file drops ... 5 docx in ~/Downloads ... 2 printouts photographed in chat" (DIRECTIVES.md:86, D-20260720-11); "files + Wispr" (:103); "PAT pasted in-session" (:116). Caveats travel with the payload ("good teachings but improve-on, not use-as-is", :86).

**M7. Standing rules minted once, amended by pre-declared reversal tokens.** ULTRACODE standing default (DIRECTIVES.md:55), draft-only sends with a scoped per-case override 16 minutes later (D-12→D-15, :87→:90), "the word UNFREEZE" (:123), "One word (INSTA-RESTORE) reverses" (:125). Same reflex in human mail: "Standing rule from today: nothing on a price table changes except from a list I send" (msg 19f82f30e7d236eb); "it becomes our standing rule for all the new sites: one tag path per site" (msg 19f83541bd98cb9e).

**M8. Session-posture prompts — autonomy boundary set in one sentence.** "do it yourself, I'll press" (DIRECTIVES.md:66, D-20260719-24); "'do these yourself with browser'; one-word rulings, PR reviews/merges and anything credential/payment stay owner-only" (:92, D-20260720-17); owner-away full autonomy with a quality bar — "build methodically and slowly, excellent results over speed" (:48, D-20260719-06).

**M9. Micro-status prompts relying on agent-held queue context.** "billing done remind me to verify" (DIRECTIVES.md:69) — offloads his own memory to the agent's scheduler; "task 5 A" + "key done" (:95).

**M10. Decision delegation to AI consensus.** "ask GPT and Perplexity... and decide on that" (DIRECTIVES.md:94, D-20260720-19, superseding his own KEEP-NARROW of ~6–15 minutes prior, :93); the D-20260720-05 adoption rule "implement when Claude+ChatGPT+Perplexity ALL agree" (:80); standing drift-fix authority (:44); full-autonomy delegation when away (:48).

**M11. Direct external-AI prompting style (Perplexity, 6 verbatim turns).** Terse voice-style asks demanding source triangulation and an artifact endgame: "Read these issues. I want these issues solved. Can that tool kit with Claude Code connect and get this done? Check Reddit, check forms, check the knowledge bases. Map each problem..." (perplexity-shopify-cleanup-chat-2026-07-20.md:159–162); "check youtube also am sure there are people who have done this... needs to be done super fast and efficient" (:200–203); "give this and the previous entire steps in a single outcome file that i can share with him and astha" (:279–281); holds the AI to completeness — "ammend and give the final file and you forgot to put the links or videos he should see" (:343–344). Cross-checks one AI against another ("is this true" with pasted output, :34–36, :75–78) and demands July-2026 recency (:317–318).

**M12. GPT-as-generator on agent-prepared prompts.** Agent writes the prompt, owner relays to ChatGPT, output returns through an ingest screen: D-20260719-11 — "agent supplied the prompt (docs/process/os-2026/merge/gpt-missing-standards-prompt.md)... Zip arrived, manifest 7/7, 129-agent screen 0 blocking" (DIRECTIVES.md:53); beauty inputs "authored by Perplexity+ChatGPT on his ask" (:41). Research delegated by URL with guardrails pre-attached: "youtu.be/L2JKgj7WzU4 + its recommended repos, injection-screened" (:80).

**M13. Plain-language failure-CLASS questions as audit triggers.** "how can you check no other mistakes like this wasn't made while building the os?" (2026-07-20-silent-failure-audit.md:13–14) spawned the 45-agent, 3.37M-token audit; "'is there a way to make sure it always works at the right time at the right place'" (DIRECTIVES.md:51) became the RIGHT-TOOL-RIGHT-TIME doctrine.

**M14. Inline causal rationale, verbatim phrasing preserved beside the normalized ruling.** "This gap is the main reason all 8 sites got redesigned" (DIRECTIVES.md:35); "('we are based in Delhi')" (:112); "('extend them till sept end 2027')" beside the normalized dates (:130); "Rationale (his words): very low time/people bandwidth; results over process" (DECISIONS.md:348).

**M15. Demanded adversarial counter-checks on the AI's own output.** gpt-5.6-sol counter-check ordered (DIRECTIVES.md:77, D-20260720-02) and run on the deep reviews; "The blunt version (sol's wording, adopted verbatim as demanded)" (2026-07-20-os-deep-review-a-architecture.md:21); both first drafts FAILED(6) and all findings were adopted (owner-inputs.md:158–169; silent-failure-audit.md:126).

**M16. Human-facing two-register system (the transferable baseline).** Register 1 — sub-10-word micro-rulings on forwarded items: "delegate" (msg 19f82e8294986290), "take care as discussed" (msg 19f831e17927ee5a), "ritu forward to hr - approved wfh" (msg 19f830441a1d3c44). Register 2 — full-spec execution briefs: "update ROW 1 of the price table (the Delhi row) exactly as below — numbers and the duration text — and change NOTHING else" with "Do NOT touch" fences (msg 19f82f30e7d236eb); prescribed reply schemas — "reply to this email in one message, like this: '1 OK, 2 OK, 3 change this line: ...'" (msg 19f7e32b1784b0cf); verification-gated closure — "'done' closes only after that check" (msg 19f82f30e7d236eb); escalation with escape hatch — "Silence is the only wrong answer" (msg 19f804d522451991); explicit anti-silence norm (msg 19f7060b53ed5492); concede-and-withdraw — "you are right on both... Withdraw my earlier ask for a GTM container ID" (msg 19f83541bd98cb9e); pre-disarmed anomalies — "That is per the current sheet, not a typo" (msg 19f82f30e7d236eb).

---

## 3. WHAT WORKS (keep doing)

**W1. The one-decision one-word card protocol is the highest-throughput channel on record.** Six one-decision cards closed a review of 19.3M tokens and 462 verdict rows in an afternoon (owner-inputs.md:105–139; all six resolved same day, 2026-07-20-handover-cardwalk-close.md:35–41); card 1 was approved and executed (PR #184) the same day (owner-inputs.md:145). The format was itself forced by his own ordered counter-check killing bundled dispositions (sol B4, owner-inputs.md:164–165). Payoff: ~6 owner words per multi-million-token review, minutes of decision latency, phone-compatible.

**W2. His dictation transmits intent reliably — understanding is NOT the loss channel.** 457/462 understood-PASS (98.9%); all 3 understood-FAILs are record-loss cases where "main's surviving record says the OPPOSITE of what the owner ruled" (owner-inputs.md:36, :42–46). One true intake miss (B-172) in 430 canonical inputs (~0.2%, owner-inputs.md:47–48). Payoff: phrasing fixes would buy little; the efficiency lever is downstream plumbing (§4).

**W3. Fully-specified per-item rubrics eliminate scope churn.** "The question, fixed by the owner: for every input I ever gave — was it captured, did you understand it as I meant it, was it implemented, and is it still honored on main today?" (owner-inputs.md:13–14) ran a 462-row review to completion with zero scope re-asks — his most efficient single prompt in the corpus.

**W4. Exact dictated facts become machine guards — the zero-drift channel.** Exact BAMS/RMO title encoded at medical-review.ts:76–82 (findings-index.md:87, B-137); exact live-table guard at test/guards.test.js:163–173 (:111, B-291); verbatim ruling blocks timestamped to the second (:34, B-Y09). Payoff: precise values survive; second-precision capture is what made the 462-row audit possible at all.

**W5. Standing rules + pre-declared reversal tokens amortize instruction cost.** The D-12 (safe default) → D-15 (explicit scoped override, 16 minutes later) pair worked exactly as designed (DIRECTIVES.md:87, :90); UNFREEZE and INSTA-RESTORE make future changes one token (:123, :125). Payoff: rules paid for once, changed for one word.

**W6. Plain-language failure-class questions have extreme leverage-per-word.** One question (M13) uncovered that the entire hook layer had never fired for six days (silent-failure-audit.md:13–14 and the resulting 45-agent audit). Naming the CLASS ("mistakes like this") lets the agent generalize.

**W7. Flag-don't-guess on Wispr noise works — flagged ambiguity is cheap.** 3/116 rows carried explicit flags; the two needing a ruling resolved same-day — "sole High" in ~16 minutes the same morning (DIRECTIVES.md:43→:46), the send-authority ambiguity in 16 minutes (:87→:90); the third (motionsites.ai spelling, :82) is deferred into its own research task by design, per its capture line. No wrong side-effectful action is traced to a mishear (reader-D). The expensive cases are the UNflagged ones (§4, C4).

**W8. Demanded adversarial checks convert self-graded "done" into corrected output.** Two FAIL(6) counter-checks, all 12 findings adopted (owner-inputs.md:158–169; silent-failure-audit.md:126); the 3-way rule caught RPT-20260719-M3A contradicting its own table (owner-inputs.md:96–97); GPT+Perplexity convergence overturned Claude's option B on the emitter lane (emitter-lane-external-consult-2026-07-21.md:11). Bounded rework cost, real defects caught. Also low ego-cost: he delegated the bakeoff verdict rather than defend his own ruling from minutes earlier (DIRECTIVES.md:93–94).

**W9. The human-facing Register-2 discipline is literally good prompting.** Numbered asks + negative fences + reply schemas + verification-gated closure (M16) closed an 8-point medical review with a non-technical reviewer in one round trip (msg 19f7e32b1784b0cf) and fully specified five pages in one email with no content follow-ups (msg 19f82f30e7d236eb — that mail's send-pipeline trouble is C6's finding, not a spec gap). The escalation formula got a two-days-silent developer to reply before deadline (msg 19f804d522451991 → msg 19f8320ac0682082). Payoff: these habits transfer to AI work unchanged — keep demanding artifacts (screenshots, diffs, URLs) over assertions.

**W10. Preemptive anomaly disarming saves guaranteed round-trips.** "Yes — three of the USD figures go DOWN... That is per the current sheet, not a typo" (msg 19f82f30e7d236eb) — pre-answering the recipient's certain objection. Directly transferable: it prevents hedged or are-you-sure AI outputs.

**W11. The aggregate correction overhead is low for a 50%-voice channel.** ~6/116 rows (~5%) are corrections/supersessions of his own directives, 3/116 (~2.6%) carried ambiguity flags, 96/116 acked with landing evidence (reader-A grep counts; correction set at DIRECTIVES.md:25, 67, 89, 94, 103, 112). Cheap owner time converts to precise directives with little rework.

**W12. Brainstorm-first, when he demands it, prevents build-first drift.** The "brainstorm first" element of D-20260719-32 was performed and surfaced in-chat before the build (findings-index.md:126, B-387).

---

## 4. WHAT COSTS — method + efficiency findings, each with a same-day fix

Findings are about method mechanics, not competence. Ordered by measured cost.

**C1. Compound multi-clause directives lose their trailing clause — the dominant structural loss.** ≥10 of 118 review-B findings, including 2 P1s: B-119 "only half-landed" (findings-index.md:26), B-295 second clause "left no draft, send record, or tracker item" (:49), B-300 (:50), B-383 (:57), B-415 (:58), B-154 (:91). First clauses land almost always; trailing clauses drop silently. **Cost:** 2 P1s + ~8 P2s of rework/erosion. **Fix (today):** end each multi-clause dictation with "count the clauses back"; the agent must echo N numbered clauses and mint one tracked item per clause before acking. One clause = one row becomes a capture-script invariant, not owner discipline.

**C2. Rider directives ("do X in/with pass Y") drop silently when the host pass ships without them.** B-103: DECISIONS.md:141 committed the tel: CTA "in the vector-logo swap pass" and that pass executed (PR #63) without it (findings-index.md:42); B-073 is the only wholly untracked P1 drop in the corpus (:25). **Cost:** invisible drops — riders inherit no tracker. **Fix (today):** ban piggybacking at capture — every rider gets its own directive id and open-item row the moment it is spoken, decoupled from its host pass.

**C3. Approvals without a bound executor decay into non-execution.** B-115: explicit approval to download the agency PDFs, with a stated teardown-loss risk, "was captured but never executed in the 5 days to 4acb3f3" (findings-index.md:43). Related: "Your Merge is the authorization" strands rulings when the merge never fires — PR #175 sat with failing checks, four ratified answers + the AEO lane parked as a P0 (findings-index.md:18 B-X06, :139 B-Y07). **Cost:** approval throughput wasted; a "yes" produced zero output. **Fix (today):** the agent refuses to close an approval capture without a named executor + queue entry in the same row; and merge-as-authorization is replaced with an explicit one-word ruling when the PR has failing checks the owner never sees.

**C4. Wispr transcription noise — flagged is cheap, unflagged is not; and raw dictation reaches humans.** Known factor, handled honestly: flagged garbles resolved same-day at near-zero cost (W7). The costs sit in the unflagged tail: the ChatGPT image-model name ("Sol 5.6" as heard) re-asked across two batches (QUESTIONS.md:89, :94); the "Slaget" phantom entity closed 14 Jul but still listed OPEN on DELEGATION_PROTOCOL.md five days later — propagation lag, not the mishear, was the expensive part (findings-index.md:80 B-075, :84 B-104); raw transcription reached recipients unreviewed — "in duction" in msg 19f7df61b6299717. **Cost:** re-ask cycles, one phantom entity on a standing conduct surface, transcription noise in outbound mail. **Fix (today):** keep flag-don't-guess; add a proper-noun/number read-back rule (agent echoes any name, tool, or figure it will act on); nothing dictated goes to a human recipient without one consolidation-and-review pass (see C6).

**C5. Burst-batching outbound vs one-at-a-time inbound — the asymmetry leaks into human channels as dictation drip.** The batching itself is efficient (M1, W11) and the one-at-a-time inbound rule fixed the 25-question-wall era (DIRECTIVES.md:37, :91) — but the rule had to be issued twice (D-20260719-12, then D-20260720-16 reaffirms; :54, :91), and the outbound side drips when aimed at humans: three micro-mails to one recipient inside 3 minutes (msgs 19f7df446db55941 05:16:07Z, 19f7df5264512693 05:17:18Z, 19f7df61b6299717 05:18:17Z) plus a "This is better ignore that" self-correction pair 4 minutes apart (msgs 19f74e43d6ac7284, 19f74e7ca7e7b36b) — while he demands others "reply in one email" (msg 19f7e32b1784b0cf). **Cost:** recipients reassemble intent across fragments; with AIs, drip costs extra turns and risks acting on mis-transcribed commands. **Fix (today):** dictate drips to the agent as a staging buffer; one consolidated send per recipient per sitting. To AIs, keep bursting — the capture script already segments bursts correctly.

**C6. The AI-draft-to-send pipeline is the weak stage — composing is not.** Two incidents, five repair emails: (a) an internal annotation "[NOTE TO Anupam: TAP's USD figure (495) looks off...]" leaked into a sent mail, which also went out twice, requiring a third repair mail (msgs 19f82f30e7d236eb 01:54Z, 19f82aa4a075c4e7 03:13Z; repair 19f831e7eb6ca65d); (b) triplicate HIGH PRIORITY sends 25 seconds apart with an inconsistent deadline ("by Monday evening, 21 July" — Monday was the 20th), correction mail 19f7a43c75b50c74 did not contain the damage — recipients replied "Duplicate email" and answered on deprecated threads anyway (msgs 19f7a25e39a55512, 19f7a25f90a9223d, 19f7a2645238baf3, 19f7e3804f4e2a6b, 19f7e69e9a2f17c4, 19f7e369b461625d). **Cost:** one task consumed three emails; internal decision notes exposed to a cc list; record fragmented across threads. **Fix (today):** a mandatory pre-send gate on every AI-drafted mail — strip bracketed annotations, dedupe against drafts, verify weekday/date agreement — run by the agent before the owner presses send.

**C7. Re-supply waste when inputs are not durably filed — and re-asks flip answers.** The 10 KTAHV LP URLs were "supplied for the 3rd/4th time" before the file-as-authority ruling (DIRECTIVES.md:34, D-20260718-11) — the largest single documented communication waste. Worse: re-asking an already-answered question produced the OPPOSITE ruling (D-RATE-927 17 Jul, orphaned → re-asked 18 Jul → D-RATE-PDFS; owner-inputs.md:50–52), consuming decision CARD-2 and closing only by supersession (D-20260720-23, DIRECTIVES.md:103). Main's process would still re-ask ≥6 already-answered questions (owner-inputs.md:62–66, B-X10/B-X06). Root cause is repo-side (squash-orphaned records — 27 of 28 capture failures, owner-inputs.md:42–46), but the cost lands on his time. **Fix (today):** any AI re-asking him anything must display the prior ruling in the ask; his own counter-habit — answer "what did I rule before?" first. File-as-authority on FIRST supply for every list, not after the third.

**C8. Snap one-line rulings on irreversible technical parameters.** The BigQuery dataset-region call — "('we are based in Delhi')" — was ruled against the prepared runbook on an irreversible setting and reversed same-day to Mumbai (D-20260720-28 → D-31; DIRECTIVES.md:112, :115), costing a full redo cycle (stop export → delete dataset → re-setup), undone only because the agent had documented the constraint. **Fix (today):** the agent tags every irreversible parameter IRREVERSIBLE in the decision card; the owner's rule — on that tag, ask for the runbook line before ruling, or answer "CHECK" to make the agent restate the constraint first.

**C9. Approximate quantities and memory-stated facts create standing conflicts.** "~3-bot" left a four-vs-three conflict "explicitly registered as a known unr[esolved]" (findings-index.md:77, B-049); the dictated fact "kairalipharma.com: owned (Abilash)" was cast into doubt by the committed 16 Jul audit — "OWNERSHIP UNVERIFIED, likely an unrelated Kottakkal wholesaler" (findings-index.md:75, B-044). **Fix (today):** exact figures in rulings (say "3", not "~3"); ownership/registry facts stated from memory get an automatic verify-before-ledger tag rather than entering DECISIONS as truth.

**C10. Parallel-session dictation and free-text clock times pollute the record.** Two directives claim D-20260719-33 (owner-inputs.md:73–74, B-Y06); ~20 directive rows carry owner-chat timestamps POST-dating their own capture stamps by +2 to +95 minutes — one capture stamped 3.7h before the chat it captures (os-deep-review-c-evidence.json:149, :185); and when capture itself broke, a whole directive had to be RE-CAPTURED after the first capture was lost to a poisoned-branch checkout — "the 'uncommitted directive is a dropped directive' failure mode, live" (DIRECTIVES.md:122; id collision note at :105). **Fix (today):** one capture session at a time when dictating rulings; stop dictating clock-times entirely — the capture stamp is the authority.

**C11. Throughput exceeds landing bandwidth — more dictation now converts to queue, not output.** ~54 canonical inputs/day; capture 94% PASS and understanding 98.9% PASS, but implementation is 347 PASS / 53 PARTIAL / 14 FAIL / 37 OPEN — 104/462 (~25%) not fully implemented (owner-inputs.md:25, :33–38; fifteen directives minted in one session, findings-index.md:66 B-X16). **Cost:** the bottleneck is execution capacity, not his communication. **Fix (today):** a WIP signal on the decision cards — when open-unlanded count exceeds a threshold, the agent says so before accepting new build directives, and he spends the next one-worders on landing, not minting. Related exposure to note: chat one-worders currently "execute money/installs outside any authenticated lane" (review-A F22, os-deep-review-a-architecture.md:55–56).

**C12. Assumed gates nobody probed — fresh finding from this session's verification.** The 21-Jul repo-sweep register carried the ChatGPT leg of D-05 as "owner/API-gated" (2026-07-21-handover-afternoon-close.md:64–65, :88–90) — but `~/.secrets/openai.env` has existed with a VALID OpenAI key since 14 Jul 2026, verified HTTP 200 by this session's check today (2026-07-21). The gate was assumed, never probed; two D-05 legs idled for a day on a blocker that did not exist. **Cost:** one day of standing-OPEN status on work that was runnable. **Fix (today):** every "gated/blocked/awaiting-X" label must carry a probe timestamp; the agent re-probes all currently-'gated' labels at session open, and no leg may be parked as gated without a failed probe on record.

---

## 5. RECOMMENDED PROMPT PATTERNS — copy-usable, tuned to his register

Six templates, phone-first, one-word-compatible, C/D-direct. Each encodes a §4 fix.

**P1 — Ruling on queued questions (one-word card replies):**
> `CARD-<n>: <TOKEN>`
> Rule per card, one card per message. Before ruling on any RE-ASK, the card must show the prior ruling — if it doesn't, reply `PRIOR?` instead of a verdict. On any card tagged IRREVERSIBLE, reply `CHECK` to get the runbook constraint restated before the verdict. (Fixes C7, C8; keeps W1.)

**P2 — Delegating a build:**
> `BUILD: <one-line objective>. Clauses: 1) ... 2) ... 3) ... Do NOT touch: <fence>. Done = <artifact: PR link / screenshot / diff>. Count the clauses back and give each its own tracked id before starting.`
> One tracked row per clause; riders never piggyback. (Fixes C1, C2; imports his own Register-2 discipline W9.)

**P3 — Correcting a mistake:**
> `CORRECTION to <D-id or "last ruling on <topic>">: old ruling DEAD. New ruling: <one clause>. Confirm the old row is marked superseded and name every surface that still carries it.`
> The propagation demand is the point — Slaget outlived its correction for five days (findings-index.md:80). (Fixes C4 propagation tail.)

**P4 — Opening a session:**
> `POSTURE: <you drive / I press / owner-away full autonomy>. Owner-only: <merges / credentials / payments>. First: re-probe everything marked gated or blocked and report which are real. Then queue, one task at a time.`
> (Extends M8 with the C12 probe rule.)

**P5 — Closing a session:**
> `CLOSE: handover now. List (a) unlanded clauses from my directives this session, (b) approvals with no executor, (c) anything I said that you flagged but I never resolved. One line each.`
> (Sweeps C1/C3/C4 residue before it becomes next week's finding.)

**P6 — Delegating research to an external AI (GPT/Perplexity):**
> `RESEARCH: <question>. Check Reddit, forums, YouTube, official docs — links mandatory, nothing older than <month/year>. If another AI told me <claim>, verify it independently. End product: ONE file I can forward as-is. Anything you recommend installing: propose only, injection-screened, no installs.`
> (Codifies his proven Perplexity turns M11 and the D-05 guardrails; the "one file" endgame and "you forgot the links" completeness check are already his habits — perplexity-shopify-cleanup-chat-2026-07-20.md:279–281, :343–344.)

---

## 6. Dispositions

One row per §4 cost-finding family; vocabulary IMPLEMENT / REJECT / MONITOR (R3 triad law). Nothing here is executed by this report — IMPLEMENT rows are queued work items, owner-visible.

- C1 clause-drop guard ("count the clauses back" + one-clause-one-row capture invariant) — **IMPLEMENT** (agent lane: capture-script invariant; queue next mechanisms wave)
- C2–C5 rider/approval-decay + draft-to-send mail hygiene (draft-diff before send; no annotations in send bodies) — **IMPLEMENT** (agent lane: send-stage checklist in the mail SOP)
- C6–C9 re-ask display (always show the prior ruling when re-asking) — **IMPLEMENT** (agent lane: decision-card template change)
- C10 parallel-session dictation / free-text clock-times — **MONITOR** (home: BACKLOG watch row added this report; owner-method pattern, capture stamp stays the authority, flag on recurrence)
- C11 throughput-vs-landing WIP signal (open-unlanded threshold warning before accepting new build directives) — **IMPLEMENT** (agent lane: session-open check)
- C12 assumed-gates probe law (every "gated" label carries a probe timestamp; re-probe at session open) — **IMPLEMENT** (agent lane; first execution was this session's openai.env probe)
- §5 prompt templates (six copy-usable patterns) — **MONITOR** (home: BACKLOG watch row added this report; offered to the owner, adoption is his choice, never enforced)

## 7. Register note

This report closes the **prompting-method review** leg of D-20260720-05 (DIRECTIVES.md:80). The remaining D-05 legs ride separately and are NOT closed by this report: the GPT step-by-step workflow walkthrough, and the Claude+ChatGPT+Perplexity all-three-agree adoption legs. Note for those legs: per §4 C12, the "owner/API-gated" status they carried is falsified — the OpenAI key at `~/.secrets/openai.env` is valid (HTTP 200 verified 2026-07-21); both legs are runnable now.

*Compiled 2026-07-21 14:20:26 IST from the four reader corpora listed in §1. All quotes verbatim from cited sources; no invented quotes, dates, or facts (HARD GATE 6).*
