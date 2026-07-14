# DEVELOPER RUNBOOK — DAY 1
**For the new developer. You can start today. No AI knowledge needed — this document IS the knowledge. Read Parts 0–2 (15 minutes), then execute Part 3. NEW_ENGINEER_DAY1.md tells you the who and why; this tells you the how.**

Fill in at kickoff: Your name: ______ · Shipping aggregator (Abilash confirms): ______ · Courier(s) to integrate: ______

---

## PART 0 — THE FOUR QUESTIONS, ANSWERED FIRST

**Q: Do I have to write plugin code?**
**A: No.** There is no plugin coding in this entire system. The websites are NOT WordPress-with-plugins — they are built by an AI agent (Claude Code) on a modern framework. The Shopify stores use apps you *install and configure by clicking* (never by coding), and even installing an app needs Abilash's approval first.

**Q: Then what "plug" work exists?**
**A: Two kinds, both clicking:** (1) configuring approved Shopify apps in the admin (Part 4 — the shipping project), and (2) approving things when the AI pauses (Part 3's table).

**Q: What is the architecture?**
**A: One picture:**
```
Cloudflare (all DNS)
 ├── grey-cloud → VERCEL: ~28 new websites, built from ONE GitHub
 │                repo ("the Factory") by Claude Code on the M2 Mac
 ├── orange-cloud → old Windows/Linux servers: legacy WordPress
 │                (shrinking to zero; KTAHV hospital site last)
 └── Shopify ×2 stores (the ONLY places money moves):
      kairaliproducts.in  → Razorpay (UPI/cards/COD)
      kairaliproducts.com → Razorpay International + PayPal
Forms on every site → one webhook → CRM.  Chatbase = 4 chatbots.
GitHub CI + hooks = automatic checks; nothing merges unchecked.
```

**Q: How is it executed?**
**A: You paste prepared prompts into Claude Code and handle its pauses.** The AI does the building, testing, and checking. You are the operator, reviewer, and the human hands in the Shopify admin. Exact steps below.

## PART 1 — WHAT CLAUDE CODE IS (60 seconds)
It's a program in the Terminal on the M2 Mac. You type instructions in plain English; it writes the code, runs the tests, and shows evidence. It asks permission before commands, and it is *physically blocked* (by hooks and GitHub rules) from dangerous things. It cannot: change DNS, touch payments, publish a Shopify theme, or push unchecked code. So you cannot break production by talking to it. When it doesn't know something, it writes the question into a file called QUESTIONS.md instead of guessing.

## PART 2 — YOUR RULES (the only five you must memorize)
1. Never share passwords; you'll get your own accounts (ask Ambuj today: GitHub, Vercel, Shopify staff, Sentry).
2. Forever-human (only Abilash): DNS · publishing Shopify themes · Settings/Payments/prices · installing apps · Google Ads · deleting anything.
3. Two Deepus: Deepu = WordPress developer; Dr. Deepu John = doctor. Different people.
4. Locked facts: email is always info@kairali.com; Priya's WhatsApp is +91 92898 38797 (if you ever see …38777, it's a bug — report it).
5. If a check fails, we fix the cause — never the check.

## PART 3 — EXECUTE TODAY (the copy-paste sequence)
**Where:** the M2 Mac, Terminal app. **If Abilash already ran a step, skip to the next.**

**Step 1.** Open Terminal. Type: `cd ~/work` then `claude` then `/model fable`
**Step 2.** Open the file `M2_MASTER_SETUP_FINAL_v2.md` (in the launch pack). Copy everything below its dashed line. Paste into Claude Code as one message. Press Enter.
**Step 3.** It now works for ~60–90 minutes. It will pause a few times. Use this table:

| It says / shows | You do |
|---|---|
| macOS popup "Install command line developer tools?" | Click Install, wait, tell it "done" |
| Asks for a password (sudo/Homebrew) | Type the M2's password (get from Abilash once) |
| Opens a browser for GitHub / Semrush / Sentry / Shopify login | Log in with the COMPANY account (Abilash/Ambuj provide), then tell it "done" |
| Asks "confirm the repo name abhilashkr…" | Read the name to Abilash on WhatsApp, reply yes/no |
| Prints "STOP" at the end of a phase | Send Abilash the summary it printed; wait for go-ahead |

**Step 4.** When the master setup stops: paste the "Step-3 scaffold prompt" from `START_HERE.md` (it's written out verbatim there). Let it run.
**Step 5.** When that stops: open `M2_SHOPIFY_SETUP_PROMPT.md`, copy below the dashed line, paste. Same pause table applies. It ends by producing a Shopify **audit document with a fix table** — the column "who clicks: engineer" is your task list for the week.
**Step 6.** In the Claude Code session type `/config` and turn ON "Remote Control for all sessions" (this lets Abilash watch progress from his phone).

That's the whole Day-1 execution. Three pastes, one table of pauses.

## PART 4 — THE SHIPPING PROJECT (W1 — your first real ownership; ~2–3 days)
This has been pending for a long time. It is **admin configuration, not coding.** Do it AFTER Step 5's audit exists (the audit tells us the current shipping state).
1. **Confirm names with Abilash** (fill the blanks at the top): the shipping aggregator app and the courier(s) — e.g., a Shiprocket-class aggregator and Ecom Express/Xpressbees-class couriers. Write them into SHOPIFY_TRACK_CONTEXT.md §9B.
2. **Abilash installs the app** (app installs are his click, Rule 2). You do everything after.
3. **Configure on the .in store:** connect the aggregator account (Ambuj has/creates credentials) → add pickup address(es) → connect the courier(s) → enable **live rates at checkout by pincode** → enable **COD with verification** (order-confirm flow) → set weight/dimensions defaults on top products → enable the **branded tracking page** + SMS/email notifications → set the returns flow.
4. **Configure on the .com store:** international shipping methods and zones aligned to how Razorpay International/PayPal checkout is set up; customs/export fields (the audit doc lists what exists today); clear delivery-time promises per zone.
5. **Ask the AI to build your test plan.** Paste into Claude Code:
   > Read SHOPIFY_TRACK_CONTEXT.md §9B. Generate a shipping test matrix for kairaliproducts.in (prepaid + COD across 5 pincodes: metro, tier-2, tier-3, Northeast, Kerala local) and kairaliproducts.com (2 international test orders, one Razorpay International, one PayPal). For each: exact product to use, expected rate behavior, what screenshot to capture. Then, read-only, verify via browser that rates actually appear at checkout for each case and give me a pass/fail table.
6. **Run the matrix** (place the test orders Abilash authorizes, screenshot each), paste results into the audit doc, and get Abilash's sign-off. **Definition of done:** every matrix row passes, tracking notifications received on a real phone, one COD order verified end-to-end.

## PART 5 — YOUR RHYTHM AFTER DAY 1
Daily (~30 min): open Fleet Pulse (kairali.ai) — anything red, ask the AI "investigate X and report"; answer factual items in QUESTIONS.md; check any new preview links against the launch checklist's B-evidence.
Monday (~1 hr): review the two automatic reports (wiki lint + Shopify catalog lint) — apply the approved catalog fixes in the admin; that's it, the reports tell you exactly what and where.
Monthly: export the catalog CSV backup from both stores; review the access register with Ambuj.

## PART 6 — WHEN STUCK
Technical question → ask Claude Code itself ("explain X to me simply"). Factual/business question → QUESTIONS.md. Anything on the forever-human list → WhatsApp Abilash. Never guess, never improvise on live stores — the system is built so that the honest answer "I don't know, logging it" is always the right move.

*You can genuinely start within the hour. Step 1 is opening Terminal.*
