# NEW DEVELOPER PACKET — meeting kit for tomorrow (14 Jul 2026)
**For Abilash. Everything the new developer needs is in this packet's zip. This file is your meeting script; the other files are his.**

---

## A · WHAT YOU HAND HIM (in this order)
1. **NEW_ENGINEER_DAY1.md** — who we are, his rules, the agenda (he reads §1–2 before the meeting; send it tonight).
2. **DEVELOPER_RUNBOOK_DAY1.md** — his execution manual: the three pastes, the pause table, the shipping project. This is his job description in document form.
3. **The cheat card (§D below)** — print it or he keeps it open; one page, everything he'll actually need hourly.
4. Reference copies (read, don't memorize): PROJECT_CONTEXT.md · SHOPIFY_TRACK_CONTEXT.md · SITE_LAUNCH_CHECKLIST_v1.0.md · START_HERE.md.

## B · TOMORROW'S AGENDA (90 min — follow NEW_ENGINEER_DAY1 §3; the beats)
1. System tour on the M2 (15) — show a live Claude Code exchange + Remote Control on your phone.
2. The five unbendable rules, out loud, with the war stories (10).
3. Shopify kickoff (20): Stage-0 question · Triple Whale D8 rules (Moby Autopilot OFF, LP-builder banned, analytics welcome) · **fill the W1 blanks together: shipping aggregator = ___, couriers = ___** (also write them into SHOPIFY_TRACK_CONTEXT §9B).
4. His ownership map (20) — daily triage, Monday lint reviews, audit "engineer" clicks, monthly backups, access-harvest with Ambuj.
5. Working agreement (10) — he uses Claude Code himself; same CLAUDE.md governs him; branches + PRs only; CODEOWNERS files are yours.
6. Week-1 plan (10) + questions (5) → QUESTIONS.md, tagged #onboarding.
**Two blanks to fill in the meeting:** his name (into NEW_ENGINEER_DAY1 header, PROJECT_CONTEXT §2, SHOPIFY_TRACK_CONTEXT §8 — make this his first commit) and the shipping platform names.

## C · ACCESS REQUEST SHEET (hand to Ambuj tomorrow; all accounts NAMED, never shared; 2FA same day)
| System | Access level | Notes |
|---|---|---|
| GitHub (kairali-web-factory + kairali-shopify-theme) | Collaborator, write | CODEOWNERS keeps governing files behind Abilash |
| Vercel | Team member | Preview review |
| Shopify (.in and .com stores) | STAFF: Themes, Products, Orders-view | NOT Settings, NOT Payments, NOT Apps |
| Triple Whale | Member/viewer | Dashboards + alerts; no Autopilot rights |
| Sentry | Member | Error triage |
| Fleet Pulse (kairali.ai) | Viewer | Daily board |
| M2 Mac | Standard user + its password (from Abilash, verbally) | For sudo pauses |
| Shipping aggregator (name TBD in meeting) | Operator | After W1 kickoff |
| Cloudflare | NONE yet | Read access later if needed |

## D · THE CHEAT CARD (print this section for him)
**THE 5 RULES:** ① Own accounts, never shared passwords ② Forever-human = DNS · theme publish · Shopify Settings/payments/prices/apps · Google Ads · deletions — only Abilash ③ Two Deepus: Deepu = web dev, Dr. Deepu John = doctor ④ Locked facts: info@kairali.com · WhatsApp +91 92898 38797 (…38777 = bug, report it) ⑤ Failing check → fix the cause, never the check.
**THE 3 PASTES (Terminal → `cd ~/work` → `claude` → `/model fable`):** 1️⃣ M2_MASTER_SETUP_FINAL_v2.md → 2️⃣ scaffold prompt (START_HERE Step 3) → 3️⃣ M2_SHOPIFY_SETUP_PROMPT.md.
**WHEN IT PAUSES:** popup → click Install · password → type M2 password · browser opens → log in with company account · "confirm repo name" → WhatsApp Abilash · "STOP" → send Abilash the summary, wait.
**DAILY (30 min):** Fleet Pulse reds → ask the AI to investigate · answer QUESTIONS.md facts · QA new preview links vs checklist B.
**MONDAY (1 hr):** wiki-lint PR + catalog-lint PR → apply approved fixes in Shopify admin.
**STUCK?** Technical → ask Claude Code to explain · Factual → QUESTIONS.md · Forever-human list → WhatsApp Abilash. "I don't know, logging it" is always a right answer.

## E · HIS WEEK 1 (agree tomorrow)
D1 (tomorrow): meeting → accounts + 2FA → read the four core docs → shadow one session. D2: run the three pastes (or resume wherever you left them) end to end. D3: run sweep.sh himself; read results against the runbook waves. D4: execute the Shopify audit's "engineer" rows; start W1 shipping config. D5: first Monday-ritual dry run + week retro into LEARNINGS.md.

## F · YOUR PREP TONIGHT (10 minutes)
☐ AirDrop/send him the packet zip (or just NEW_ENGINEER_DAY1 tonight, rest tomorrow) ☐ Decide the shipping platform answer, or accept deciding it live in item 3 ☐ Tell Ambuj the access sheet is coming ☐ Have the M2 password ready to give verbally ☐ Know his full name + email for the accounts ☐ Optional: print the cheat card.

*Everything else is already in the documents. Run the meeting off §B and you won't need notes.*
