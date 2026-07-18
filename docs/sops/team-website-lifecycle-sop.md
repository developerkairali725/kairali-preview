# Kairali Web Factory — The Complete Team Workbook
## Build it → hand it over → the machine checks it → Deepu publishes it once

---

## PART 0 — START HERE (NO CODING NEEDED)

You are about to learn the **one and only way** we put pages and blogs online. It is written like a workshop workbook. If you can fill in a form and paste a block of text, you can do every marketing step in this guide. You will **never** touch GitHub. You will **never** touch WordPress.

Whenever you see a **PROMPT BOX**, copy the whole block, fill in the `[brackets]`, and paste it into Claude **once**. Claude does the technical work. You look at a preview and pass it on.

### The big-picture flow (the whole journey on one page)

```
  YOU (marketing)                    DEEPU (our one developer)          THE INTERNET
  ─────────────────                  ─────────────────────────          ────────────
  1. Build the page/blog             4. Picks it up from the             6. It's LIVE
     in your chosen tool                shared folder
            │                                  │
  2. Run the "Make it                5. Turns it into a factory
     publish-ready" prompt              page, opens a request, and
            │                            the MACHINE CHECKS run by
  3. Get it approved, move it          themselves (catch ~99%)
     to "2 — Ready for Deepu"                 │
     folder + fill the                 ┌───────┴────────┐
     Handoff Card                    GREEN ✅         RED ❌ ──┐
                                       │                        │
                                  He reviews ONCE      He sends you a plain-
                                  and publishes        English "please fix"
                                                       list → you fix → resend
```

### ⏱️ THE TIME BUDGET (what "fast" means here)

| Stage | Target |
|---|---|
| You build + make publish-ready | **20–40 min** of active work |
| Approvals (Abilash windows ~12:00/17:00 · doctor same-business-day) | the **controlled human gate** |
| Deepu: import + machine checks | **30–60 min** |
| Publish + marker + tracker | **~15 min** |

> **✅ The promise:** your *active* work is about an hour. Handed off before ~11:00 with approvals answered → **live the same day**. The guaranteed worst case is **next business day**. If something sits longer, a human gate is stuck — the Troubleshooting table says who to ping.

### WHY we work this way (read this once — it is the whole point)

> **ℹ️ The bottleneck has a name: Deepu.**
> Deepu is our **only** developer. For years, every page waited on him checking it by hand, line by line. He physically could not keep up — which is *exactly* why our old landing pages sat for months, never updated. This system fixes that with one idea: your work is pushed **through the GitHub factory**, where **automatic checks** catch about **99%** of problems (banned words, made-up facts, fake medical claims, broken links, slow pages, off-brand design). Deepu stops being the checker. He does only the two things a machine cannot: **one human look**, then **press publish**. That is how one developer can finally keep up with all of you.

> **⚠️ Two people are called "Deepu". Never mix them up.**
> - **Deepu** (the developer) — imports your work, runs the checks, publishes. No "Dr.", no "John".
> - **Dr. Deepu John** (the chief physician) — a *different person*. He signs off **medical claims** before a hospital page can go live. Deepu-the-developer can never approve a medical claim himself.
> - (Dr. Deepu John also appears as a **blog author voice** on the Voices page — that is the same physician, writing. Still not the developer.)

### 📁 THE SHARED FOLDER (where all handoffs live)

Everything moves through **one Google Drive folder**: **[Website - Staging - Marketing](https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX)**. Inside it, **every team member has their own folder** with three subfolders:

```
Website - Staging - Marketing/
├── Roshni/    ├── 1 — Drafts (working on it)
├── Vikash/    ├── 2 — Ready for Deepu (approved)   ← the handoff spot
├── Abilash/   └── 3 — Published (done)
└── _TEMPLATE — copy me for a new person/
```

- While you work → keep the item's folder in **1 — Drafts**.
- Approved and ready → move it to **2 — Ready for Deepu** and message Deepu.
- Deepu publishes → **he** moves it to **3 — Published**, with the live link and the ✅ CHECKED note inside.

One glance at anyone's folder tells you (and management, and Deepu) exactly what state everything is in. **New team member?** Right-click `_TEMPLATE` → Make a copy → rename to their name.

---

## PART 1 — THE 4 HARD RULES (keep this open while you work)

These four rules are not opinions. The machine checks enforce them, and breaking one gets your page sent back.

### 🚫 Rule 1 — Right words for the right site
The hospital site — **ayurvedichealingvillage.com (KTAHV)** — is a medical site. It must sound clinical. On that site these words are **BANNED**, in any language:

> ❌ spa · resort · holiday · luxury · cure · journey · guests

Use these instead:

> ✅ patient · treatment · programme · Panchakarma · consultation

> **ℹ️ The exception:** Villa Raag (**villaraag.com**) is a hospitality place, so resort / holiday / luxury are perfectly fine **there**. The ban is only for the hospital site. You do not have to memorise any of this — the machine knows each site's rules and will flag a wrong word. Quick map:

| Site | Word rules |
|---|---|
| **ayurvedichealingvillage.com** (KTAHV — the hospital) | **Clinical only.** The banned list above applies. |
| **villaraag.com** (Villa Raag, Goa) | Hospitality — resort / luxury / holiday are fine. |
| **whyayurveda.org** (the blog) · kairali.com · kairaliyoga.com · kairalicenters.com · healing.recipes · the other group sites | Normal, honest tone. No hype words, no invented facts — but no clinical lock. |

### 🚫 Rule 2 — Never make anything up
Do not invent a fact, price, phone number, date, distance, statistic, or medical claim. If you were not given it, leave it **blank** and flag it. Guessing gets caught and bounced.

### 🚫 Rule 3 — A real doctor signs off every health claim, BEFORE handoff
Any sentence that makes a **medical or health claim** must be approved by **Dr. Deepu John** *before* you hand the page to Deepu. You hold the page until the doctor has signed. Deepu should never receive a page that still needs a medical approval — his one review must stay a review, not a chase.

> **ℹ️ What counts as "signed":** his actual reply — an email or WhatsApp message saying he approves — **saved into the item's folder** (screenshot or forwarded email is fine). Writing "signed" on the Handoff Card with nothing behind it is Rule 2 (making something up).

> **ℹ️ What counts as a medical claim? Five examples:** "Panchakarma helps manage weight" = **claim**. "Reduces stress" = **claim**. "Supports digestion" = **claim**. "NABH-accredited hospital" = *not a claim* (verified fact). "14-day residential programme" = *not a claim* (a description). When unsure, treat it as a claim — a needless sign-off costs a day; a missed one costs much more.

**How to ask (copy-paste, WhatsApp):**
```
Dr. Deepu John — sign-off request.
Page: [name + which site]
The health claims are: [paste the exact flagged lines]
Preview/screenshot attached. Please reply "approved" or tell me what to change.
```
**SLAs so nothing rots in Drafts:** doctor sign-off — same business day is the ask; if silent by next morning, escalate to Abilash. **Abilash approvals happen in two daily windows (~12:00 and ~17:00)** — batch your asks to those, don't drip them.

### 🚫 Rule 4 — You don't publish. Deepu does.
That is the safety gate. Your job ends at "approved, handed to Deepu."

> **✅ CHECKPOINT — the 4-question gut check before every handoff**
> 1. Right site, right words? (No banned words on the hospital site?)
> 2. Did I invent any fact, price, or number? (I must not have.)
> 3. Any health claim in here? If yes — has **Dr. Deepu John already signed off**?
> 4. Honest channels? (Right WhatsApp number, no fake "reviewed by a doctor" line.)
> Four yeses (or "not applicable") = clear to hand off.

---

## PART 2 — MARKETING: BUILD IT IN YOUR TOOL

### 🧰 DAY 0 — GET SET UP (30 minutes, once, with an owner)

Before your first page, these five things must be true. **Owner: Deepu (or Abilash) sets you up — you never hunt for installs alone.**

1. **VS Code installed** with the **Claude plugin** signed in (or Antigravity, if that's your tool).
2. **Drive access:** you can open the [shared folder](https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX) and see **your own name folder** with its three subfolders.
3. **The Tracker & this workbook bookmarked** (links in the Reference Library at the bottom).
4. **The facts pack:** every site has a **FACTS doc** in the Drive folder (prices, phone numbers, WhatsApp, addresses — maintained by Vikash/Abilash). Facts come from there, never from memory. The two locked facts everyone must know: public email is **info@kairali.com**, WhatsApp is **+91 92898 38797** (any other number is wrong — flag it).
5. **Smoke test:** build a one-line practice page with Claude, see it in the preview, delete it. If that works, you're set.

> **ℹ️ When Claude asks permission** ("allow this command?", "trust this folder?") while building or previewing — click **Allow/Trust**. It only ever works inside your page folder. This is normal, not a warning sign.

Every tool ends the same way. No matter which one you pick, you always do these three things:

```
1. BUILD / CHANGE   → make the page in your tool (per-tool steps below)
2. MAKE IT PUBLISH-READY → paste ONE shared prompt (same for every tool)
3. HAND TO DEEPU    → drop it in the shared folder + fill the Handoff Card + message him
```

Steps 2 and 3 are printed **once**, right here. Keep them open while you work.

### ⭐ Step 2 — THE "MAKE IT PUBLISH-READY" PROMPT (same for every tool)

Paste this into your tool **once**, after you've built or changed the page.

```
Please finish this [landing page / blog post] so it is ready to publish.
It is for: [which site + page — e.g. ayurvedichealingvillage.com weight-loss page]

Please:
1. ON-PAGE SEO: one clear H1, a good page title and meta description,
   and alt text on every image.
2. INTERNAL LINKS: add links ONLY to real pages listed on the workbook's
   Reference Library / the site itself — never invent a link. If a page you
   want to link doesn't exist, write "FEATURE NEEDED: link target ___".
3. Check it reads well and looks right on a phone.
4. COMPLIANCE (important):
   - If this is the hospital site (ayurvedichealingvillage.com),
     use ONLY clinical words (patient, treatment, programme, Panchakarma,
     consultation) and NEVER "spa, resort, holiday, luxury, cure, journey,
     guests" — in any language.
   - Do NOT invent any fact, price, number, phone, date, or medical claim.
   - Flag every medical claim clearly so Dr. Deepu John can approve it.
5. If something I need doesn't exist yet, say "FEATURE NEEDED: ___"
   instead of inventing an off-brand look or a fact.

Then give me a preview (a link that opens the page in my browser, OR the
on-screen design if I'm in Claude Design), plus a plain-English list of
(a) what you did and (b) anything I must decide or get approved.
Do NOT publish — Deepu publishes.
```

### 📋 Step 3 — THE HANDOFF CARD (same for every tool)

When your page is approved, copy this into the item's folder and move the whole item folder to your **2 — Ready for Deepu** subfolder.

```
HANDOFF TO DEEPU
- What is it:            [new landing page / update / new blog / content fix]
- Built with:           [Claude Design / VS Code + Claude plugin / Antigravity / Claude Code]
- Which site + page:     [e.g. ayurvedichealingvillage.com — the weight-loss page]
- Where the work is:     [Claude Design share link  OR  folder name in "2 — Ready for Deepu"]
- Author voice (blogs):  [name, or "n/a"]
- Must-be-exact facts:   [prices, phone, WhatsApp, dates — or "none"]
- Medical claim inside?  [yes / no]
- Dr. Deepu John sign-off: [signed on YYYY-MM-DD  /  n-a]     ← if "Medical claim = yes", this MUST say "signed"
- If an UPDATE, what changed: [one line — e.g. "new price block + 2 new photos"]
- Approved by:           [your name] + Abilash
- Ready to publish:      [leave BLANK — only write YES after everything above is done]
```

> **⚠️ You may only write "Ready to publish: YES" after every line above it is filled AND any medical claim shows "signed".** "YES" is a deliberate act, not a default. If a medical claim is unsigned, the card is **not** ready — hold it.

Three habits that make the handoff bulletproof:
- **The card is a Google Doc** named `HANDOFF CARD` inside the item folder — and paste **Abilash's approving message (screenshot)** into the folder too, same rule as the doctor's. An approval with no evidence is Rule 2.
- **Add your row to the [Pipeline Tracker](https://docs.google.com/spreadsheets/d/1mS6WzRrZmQVnWjfg631uOFSRDD1raFTSLhjlYuQZIos/edit)** (Item, Site+page, Who, Tool, Handed off = today). Deepu owns the rest of the row.
- **🧊 The freeze rule:** moving an item to **2 — Ready for Deepu** LOCKS it. Never edit a handed-off item — if you must change something, pull it back to **1 — Drafts** and message Deepu "pulled back". Editing under him is how versions diverge and work gets lost.

> **ℹ️ Where the shared folder lives:** **2 — Ready for Deepu** is the middle subfolder inside *your own name folder* in the shared Drive — the **Shared Folder ↗** link is in the top bar of this page. That folder — plus a WhatsApp/email message to Deepu — is the **only** way work reaches him. You never open GitHub to hand anything over.

### Which tool should I use?

| Tool | Best when you want to… | You hand Deepu |
|---|---|---|
| **A. Claude Design** | Design the look fast, by describing it. No files. | A **share link** |
| **B. VS Code + Claude plugin** ⭐ | The **recommended** all-rounder (the video's method). Build, preview, tweak in one window. | A **page folder** |
| **C. Antigravity** | Same as B, if Antigravity is the editor you prefer. | A **page folder** |
| **D. Claude Code** | You're comfortable in the terminal and want it quick. | A **page folder** |

> **⭐ Not sure? Use B (VS Code + Claude plugin).** It's the method the training video is built around and it hands off most cleanly.

---

### PART A — CLAUDE DESIGN
*You end with a share link. Nothing to install.*

**A1 · CREATE a new landing page**

1. Open **Claude Design** and start a new design.
2. Paste this **once** (fill the brackets):
   ```
   Design a new landing page for [which site — e.g. ayurvedichealingvillage.com,
   the Ayurveda hospital in Kerala].

   The page is about: [topic — e.g. a 14-day weight-management Panchakarma programme].
   Include: one headline (H1), a short intro, [the sections you want], and ONE main
   button that says [e.g. "Book a Consultation"].

   Rules:
   - Clean, calm Kairali look — not loud or generic.
   - Hospital site = clinical words ONLY (patient, treatment, programme,
     Panchakarma, consultation); never spa / resort / holiday / luxury / cure /
     journey / guests.
   - Leave any price, phone number, or medical claim BLANK — never invent one.
   ```
3. Look at the design on screen. Want changes? Tell Claude in plain words ("make the button bigger", "add a second photo") until it's right.
4. Paste **⭐ Step 2 (Make it publish-ready)**.
5. Click **Share** and copy the **share link**.

> **✅ Checkpoint before handoff:** words match the site, no invented facts, looks right on a phone. Get **Abilash's approval** — and **Dr. Deepu John's** first if there's any medical claim.

**🎯 Hand Deepu:** the **share link** in the Handoff Card, dropped in **2 — Ready for Deepu**, then message him: "[page name] is ready — link is in the folder."

**A2 · UPDATE an existing landing page**

1. In Claude Design, paste this **once** with the live page address:
   ```
   Please recreate this existing page so I can edit it:
   [paste the full page link — e.g. https://ayurvedichealingvillage.com/weight-loss]

   Bring in the same content and layout as closely as you can. Then STOP and wait —
   I'll tell you the one change I want. Do not invent anything new.
   ```
2. Tell Claude the one change in plain words.
3. Paste **⭐ Step 2**. Then **Share** → copy the new link.

> **⚠️ UPDATE fact-check (do this before Step 2):** the recreate step can silently drop or alter a price, phone, WhatsApp number, or date. **First, save a full screenshot (or copy) of the original live page into your item folder** — that's the before-proof Deepu and the doctor check against. Then compare the recreated page against the live page and confirm **every** price, phone, WhatsApp number, and date matches exactly. If you cannot confirm one, blank it and write it under "Must-be-exact facts". Do not trust the machine to catch a wrong-but-not-banned number.

> **⚠️ Banned word on a hospital page?** If it's in the **visible text** (e.g. the word "resort" in a sentence), fix it yourself: tell Claude *"This is the hospital site — remove [word] and use a clinical word instead."* Only **flag** things you genuinely cannot change — like the page's short web address if it contains a banned word (e.g. `.../wellness-resort-kerala`) — on the Handoff Card for Deepu.

---

### PART B — VS CODE + THE CLAUDE PLUGIN ⭐ (recommended)
*You end with a folder of files. Build, preview, and tweak in one window.*

**B1 · CREATE a new landing page**

1. Make a **new empty folder** named for the page (e.g. `weight-loss-page`). Open it in **VS Code** (File → Open Folder).
2. Open the **Claude plugin** chat panel (the Claude icon in the sidebar).
3. Paste this **once**:
   ```
   Build a new landing page in this folder that I can preview in my browser.

   It is for: [which site — e.g. ayurvedichealingvillage.com, the Ayurveda hospital].
   Topic: [e.g. a 14-day weight-management Panchakarma programme].
   Include: one headline (H1), a short intro, [sections you want], and ONE button
   that says [e.g. "Book a Consultation"].

   Rules:
   - Build it as a SINGLE self-contained HTML file (plus an images folder if
     needed) — no frameworks, no node_modules, nothing to install. The folder
     I hand over must open with a double-click.
   - Mobile-friendly, calm clean Kairali look. If you'd need a design piece we
     don't have, say "FEATURE NEEDED: ___" — don't invent an off-brand look.
   - Hospital site = clinical words only (patient, treatment, programme,
     Panchakarma, consultation); never spa / resort / holiday / luxury / cure /
     journey / guests.
   - Leave any price, phone, or medical claim BLANK — never invent one.
   - Do NOT commit, push, or publish anything.

   Then start the preview and give me the link that opens the page in my browser.
   ```
4. Click the **preview link** Claude gives you — the page opens in your browser. Ask for tweaks in plain words until it's right.
5. Paste **⭐ Step 2**. Preview again.
6. Take a **screenshot** of the preview (and one with the window made narrow, to see the phone view).

> **✅ Checkpoint:** facts correct, right words for the site, looks good narrow (phone). Get Abilash's approval (+ Dr. Deepu John first for any medical claim).

**🎯 Hand Deepu:** copy the **whole page folder** into your **2 — Ready for Deepu** subfolder (as `[page-name]/`), drop the screenshot(s) in it, add the filled Handoff Card, and message him.

**B2 · UPDATE an existing landing page**

1. In a new folder, open the Claude plugin and paste **once**:
   ```
   Please bring in this existing page so I can edit a copy of it:
   [paste the full page link — e.g. https://ayurvedichealingvillage.com/weight-loss]

   Save it in this folder and start a preview so I can see it. Keep everything the
   same for now — I'll tell you the one change I want. Invent nothing.
   ```
2. Tell Claude the one change. Let it update the copy.
3. Do the **UPDATE fact-check** (same as A2 — confirm every price/phone/WhatsApp/date matches the live page).
4. Paste **⭐ Step 2**. Preview and screenshot.

> **⚠️ Banned word in the visible text?** Fix it yourself (tell Claude to swap it for a clinical word). Only flag the page's short web address if *that* contains a banned word.

---

### PART C — ANTIGRAVITY
*Same shape as VS Code — only the window is different. You end with a folder of files.*

**C1 · CREATE:** Open **Antigravity**, open a **new empty folder**, open the **Claude chat panel**, and paste the **same CREATE prompt from B1**. Click the preview link, tweak in plain words, paste **⭐ Step 2**, preview again, screenshot (including a narrow/phone view).

**C2 · UPDATE:** New folder in Antigravity, open the Claude panel, paste the **same "bring in this existing page" prompt from B2**. Tell Claude the one change, do the **UPDATE fact-check**, paste **⭐ Step 2**, preview + screenshot.

> **✅ Checkpoint & 🎯 Handoff:** identical to Part B — folder + screenshot + Handoff Card into **2 — Ready for Deepu**, then message Deepu.

---

### PART D — CLAUDE CODE
*You end with a folder of files. Same job, in the terminal.*

**D1 · CREATE:** Make a **new empty folder**, open it in the terminal, type `claude`, and paste the **same CREATE prompt from B1**. Open the preview link, ask for changes in plain words, paste **⭐ Step 2**, preview again, screenshot (including a narrow/phone view).

**D2 · UPDATE:** New folder, run `claude`, paste the **same "bring in this existing page" prompt from B2**. Tell Claude the one change, do the **UPDATE fact-check**, paste **⭐ Step 2**, preview + screenshot.

> **✅ Checkpoint & 🎯 Handoff:** identical to Part B — folder + screenshot + Handoff Card into **2 — Ready for Deepu**, then message Deepu.

---

### IF DEEPU SENDS IT BACK (the fix-it loop)

Sometimes the machine finds something after handoff. Deepu will send you a **plain-English list** of what to fix (WhatsApp/email — never a code report). This is normal; it means the machine caught a real problem before it went live.

1. Read his list. Each item says exactly what to change, in plain words.
2. Re-open the page in the same tool you built it in.
3. Paste a short fix-it prompt naming each item:
   ```
   Please fix these on the page, and change nothing else:
   1. [paste Deepu's item 1]
   2. [paste Deepu's item 2]
   Keep every fact exactly as it is. Invent nothing.
   ```
4. Paste **⭐ Step 2** again. Preview and check.
5. Re-hand it off the same way, with "what changed" updated on the Handoff Card. Tell Deepu it's the corrected version of the same page (don't start a brand-new folder name — keep the same page name so he can match it to his open work).

---

## PART 3 — ROSHNI'S FAST BLOG FLOW

Roshni ships blogs at a **quick pace**. This is the fast path — but it runs through the **exact same checks and the same one-time Deepu review** as everything else. Speed does not skip safety.

> **ℹ️ Blogs go through the machine too.** Every post, however fast, is checked automatically before it goes live — so Roshni's volume never lands on Deepu as a pile of manual reading. He reviews once and publishes. To help his single review scale, **batch** posts: drop several finished posts into the **2 — Ready for Deepu** folder together and message him once, rather than pinging per post.

### Step 1 — Pick the author voice FIRST
Every blog publishes in a named author's voice.

| The blog is about… | Use this voice |
|---|---|
| Anything clinical / medical | the physician voice (and Dr. Deepu John must sign off — see Step 4) |
| Food, cooking, lifestyle | **Gita Ramesh** |
| Brand news, awards, centre updates | **Roshni** |
| Anything else / not sure | **Abilash** (default) |

Open the **Voices page** of this workbook site, copy the author's whole voice block, then load it with this prompt **once**:
```
Please write this blog in the voice described below. Match the tone, sentence
length, vocabulary, and do's/don'ts exactly — it must genuinely sound like this
author, not generic AI. Keep every fact accurate; invent nothing.

[PASTE THE AUTHOR'S VOICE BLOCK FROM THE VOICES PAGE HERE]
```
> **ℹ️** If the author you want isn't on the Voices page yet, use the **Abilash** (default) block and write "FEATURE NEEDED: author voice for [name]" on the Handoff Card.

### Step 2 — Write the post in your tool
Use whichever tool you like (VS Code + Claude plugin is great for a quick cadence). Write the draft, then paste **⭐ Step 2 (Make it publish-ready)** — it adds SEO and internal links and *prepares* the post to pass the machine checks first time. (The **real** checks run later, at Deepu's stage — Step 2 is your rehearsal, not the exam.)

> **⚠️ Blogs on hospital pages (ayurvedichealingvillage.com) carry the clinical word-lock too.** No spa / resort / holiday / luxury / cure / journey / guests. And never invent a statistic, study result, or date — Rule 2 is where fast blogs slip most.

### Step 3 — Proofread and approve
Roshni proofreads → **Abilash approves**. Nothing moves without approval.

### Step 4 — Medical gate (only if there's a health claim)
If the post makes any medical or health claim, **Dr. Deepu John signs off before handoff**. Mark it on the Handoff Card ("Dr. Deepu John sign-off: signed on …"). No sign-off = the post waits.

### Step 5 — Hand to Deepu
Drop the post in **2 — Ready for Deepu**, fill the **same Handoff Card** as landing pages (set "Author voice"), and message Deepu — or add it to today's batch.

> **✅ Roshni's checkpoint:** voice set · facts real · hospital word-lock respected (if applicable) · Abilash approved · doctor signed (if medical) · Handoff Card filled. Then it's Deepu's.

---

## PART 4 — DEEPU'S IMPORT → CHECK → REVIEW-ONCE → PUBLISH PIPELINE

> **This Part is Deepu's only.** Marketing never runs any of it. Everything below is technical on purpose.

> **ℹ️ Deepu's two companion guides live on the [For Deepu page](deepu.html):** the **Novamira install (step by step, nothing assumed)** and the **Rollback & Backup undo book** (every go-back-to-old use case, with the automatic pre-publish snapshot system). Read both before your first publish.

### ⚙️ ONE-TIME SETUP (Deepu, day 1 — the pipeline doesn't fully work until these exist)

Honest status: some targets of this pipeline are **not in the factory yet**. These five setup items make everything below true — do them once, tick them off:

1. **Scaffold `sites/ayurvedichealingvillage.com`** with `site.config.json` set to `entity: "ktahv"` — that single line is what switches on the clinical word-lock in `pnpm compliance` (the lock is already coded in `packages/compliance/src/rules.js`; it just needs a site folder to bite on). Also create `launches/ayurvedichealingvillage.com/approvals.yaml` and get Abilash to sign the front-gate rows. *Until this exists, no KTAHV landing page can flow through CI — this is the very first task.*
2. **Scaffold a minimal `sites/whyayurveda.org` content home** (blog/editorial entity) so Roshni's posts render there and the content gates fire on them, even though publishing still goes out via WordPress.
3. **Install Novamira on the WordPress *staging* sites** (per `wordpress-gutenberg-setup.md` — staging only, backup first, admin stays with you).
4. **Create `content/ledger.yaml`** (Part 5) in the repo.
5. **Bookmark the Drive folder** ([Website - Staging - Marketing](https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX)) and the Pipeline Tracker sheet in it.
6. **Prove it done** — paste into Claude Code: *"Verify one-time setup: confirm sites/ayurvedichealingvillage.com/site.config.json says entity ktahv; sites/whyayurveda.org exists; launches/ayurvedichealingvillage.com/approvals.yaml exists with signed rows; content/ledger.yaml parses; then ask Novamira to list installed plugins on staging. Report PASS/FAIL per item."* Record the PASS in the Tracker.

> **⚠️ Until setups #1–2 exist:** incoming KTAHV / blog submissions are **HELD** in **2 — Ready for Deepu** with a `WAITING-ON-SETUP.txt` note — never published "just this once" around the gates. The 99% is a lie for exactly the site with legal exposure if this rule bends.
> **ℹ️ Git is the source; WordPress is the render target.** Once a page flows through this pipeline, WP-side edits outside the pipeline are banned — every change re-enters at Stage 1, so git and the live page never diverge.

### The one rule that makes the checks real
> **⚠️ The gates only inspect pages under `sites/<domain>/`.** Every check (`pnpm compliance`, `banned-string-lint`, `content-lint`, `cta-label-lint`, `brand-lint`, `lighthouse-gate`, the Playwright factory suite, `front-gate`) is scoped to `sites/`. A raw `.html`, a Google-Doc blog, or a loose project folder that is *not* rendered into `sites/<domain>/` is inspected by **nothing** — a green PR would mean the machine read zero words. So **Stage 1 is a real build/transform step**: every submission must become a page under `sites/<domain>/` *before* the PR, or the "99%" is a lie for that item.

### Stage 1 — Pick up and render INTO the factory
1. Take the submission from the **2 — Ready for Deepu** shared folder (share link, page folder, or blog draft).
2. Render it into the site it belongs to, as a real page:
   > **PROMPT BOX — "Render a submission into its site" (paste into Claude Code once)**
   > ```
   > Take the marketing submission I point you to (a Claude Design share link, a
   > page folder, or a blog draft) and turn it into a real page under
   > sites/<target-domain>/ in the form that site uses (its .tsx/.mdx/.md page).
   > - Do NOT change any wording, fact, price, or claim. Preserve them exactly.
   > - Wire it into the site so the existing gates can inspect it.
   > - Show me the new/changed files and the page route. Change nothing else.
   > - If a Claude Design share link won't open, do NOT rebuild from memory —
   >   tell me so the submitter drops an exported copy instead.
   > ```
3. The clinical word-lock is applied **automatically** once the page sits under `sites/ayurvedichealingvillage.com/` — because that site's `site.config.json` says `entity: "ktahv"`, and `pnpm compliance` reads the config (One-time setup #1 creates this). Do not rely on a metadata line to switch it on; put the page under the correct site and the correct rules apply.

> **✅ Stage 1 checkpoint:** the work is a real page under `sites/<domain>/`; wording is byte-for-byte the marketing copy; the Handoff Card's "Medical claim?" and "Dr. Deepu John sign-off" lines are captured for later.

### Stage 2 — Open a PR; the machine checks run
Branch, commit, push, open the PR. CI (`.github/workflows/gate.yml` + `factory-gate.yml`) runs the gates automatically.

**Which gate runs on which format — be honest about coverage:**

| Gate (exact command) | What it stops | Runs on |
|---|---|---|
| `pnpm compliance` *(`packages/compliance/bin/lint.js`)* | banned filler words + facts that don't match locked facts — **MERGE-BLOCKING** | any page under `sites/` (all formats, once rendered) |
| `node scripts/banned-string-lint.mjs` | fabricated medical claims, wrong WhatsApp number, false "reviewed by physician", fake review dates | any text under `sites/` |
| `node scripts/content-lint.mjs` | dishonest / unsafe / legally-exposed YMYL content (35 rules) | rendered article/page under `sites/` |
| `node scripts/cta-label-lint.mjs` | a button promising a human/clinician that goes to a bot channel | any page under `sites/` |
| `node packages/ui/bin/brand-lint.js` | off-brand tokens, colour, spacing | any page under `sites/` |
| `node scripts/lighthouse-gate.mjs` | Performance <90 / Accessibility <95 / SEO <100 | **built factory pages only** (needs a route + dev server) |
| `pnpm exec playwright test tests/factory` | broken links, render, mobile, forms+consent, schema | **built factory pages only** |
| `node scripts/front-gate.mjs` | any page shipping **ahead of a signed approval file** in `launches/<domain>/approvals.yaml` | sites that are launch-armed |
| Claude security review · `gitleaks` · `pnpm audit` | leaked secrets/keys, vulnerable deps | whole PR |

> **⚠️ Lighthouse and the Playwright factory suite cannot run on a raw `.html` or a blog draft that has no route.** That is *why* Stage 1 renders everything into a built `sites/<domain>/` page — only then do those two gates physically fire. If an item is not yet a built page, do not claim those gates protected it.

> **⚠️ `front-gate` is NOT the medical enforcer.** It only checks that a signed *design* approval row exists (brief → strategy → design_source → golden_page) in `launches/<domain>/approvals.yaml`. Its own comment says it does not judge the brief, the strategy, or any medical claim. Green CI never means a doctor approved anything.

> **ℹ️ Front-gate approval for a `sites/<domain>` (Vercel) page.** A brand-new site page with no approval rows will fail `front-gate` by design. The site **owner** signs the `brief → strategy → design_source → golden_page` rows in `launches/<domain>/approvals.yaml`. **Careful — the gate only bites when `launches/<domain>/approvals.yaml` EXISTS; a missing file silently disarms it.** So setup #1 must both create the file AND get its rows signed — a scaffold without its approvals ledger looks green while the front gate is actually off. That is a deliberate launch step, not something this SOP skips past.

Turn the red into an action list:
> **PROMPT BOX — "Summarise the CI report" (paste into Claude Code once)**
> ```
> Read the latest CI run for this PR (gh pr checks; gh run view --log-failed).
> For EVERY failed check, give a table: Gate | file+line | one-line reason |
> Verdict (TRIVIAL DEV FIX or BOUNCE TO MARKETING).
> Verdict rule:
>   - formatting, brand tokens, image size, config, broken internal path = DEV FIX
>   - a banned word in a ROUTE/SLUG/URL = DEV FIX (rename the route)
>   - any banned word in VISIBLE TEXT, fact, medical claim, health promise,
>     CTA wording, date = BOUNCE
> Change no files yet.
> ```

### Stage 3 — Fix trivial dev things; BOUNCE content problems
> **⚠️ The line Deepu never crosses:** fix developer things (tokens, image compression, a broken path, config). **Never** rewrite a health claim, price, fact, CTA promise, or date yourself — those are marketing's words (and Dr. Deepu John's call). Bounce them.

- **Dev fixes:** fix on the branch, commit, push, let CI re-run.
- **Bounces:** send marketing the plain-English item and **keep the branch open**. **Stamp the bounce:** drop a **`NEEDS-FIX-❌.txt`** (date, PR #, the fix list) into the item's Drive folder and set its Tracker "Checks" cell to **❌ bounced <date>** — a bounced item must be visible in the folder system, not buried in a chat thread.
- **Two-bounce cap:** the third red on the same item stops the ping-pong — switch to **Deepu-Solo with the author beside you** (desk or screen-share) and finish it together. The loop is more expensive than the pairing.
- **Incomplete Handoff Card = bounce WITHOUT import.** Thirty seconds of "fill lines X and Y, re-drop" beats laundering a half-filled card through the whole machine.

> **⚠️ On a bounce, do NOT discard the branch.** When marketing resends the corrected content, re-import it into the **same branch** so your dev fixes survive. Never redo the whole import from scratch — that quietly reloads work onto you.

Bounce message channel = the same **2 — Ready for Deepu** shared folder + WhatsApp/email. **Never tell marketing to "resend to the inbox"** — they have no such place. Say: "Fix these and drop the new version back in your **2 — Ready for Deepu** folder; everything else passed."

### Stage 4 — Publish (with the hard medical checkpoint)
Only here when the PR is **fully green** AND the manual medical checkpoint passes.

> **⚠️ MANUAL MEDICAL CHECKPOINT — Deepu cannot skip this.** No gate can verify a real doctor reviewed a claim. Before publishing any page, check the Handoff Card + the page: if it contains **any** medical claim, `medical_signoff` in the ledger must show `drdeepujohn:<date>`. If "Medical claim = yes" but sign-off is missing — even if CI is fully green — **stop and route it to Dr. Deepu John.** A wrong "no medical claim" is caught here, by a human, not by the machine.

**Route A — WordPress site via Novamira** (existing sites, e.g. ayurvedichealingvillage.com):
> **PROMPT BOX — "Publish to WordPress staging via Novamira" (Claude Code, once)**
> ```
> FIRST: run  node scripts/wp-snapshot.mjs <live page URL>  and show me the
> saved backup file path. If it exits non-zero, STOP — do not import anything.
>
> Refuse to continue unless I paste BOTH: the PR number AND its green CI run
> link. (PR: #___  CI: ___)
>
> Then: using Novamira, import the page into <target-site> as EDITABLE
> WordPress blocks, into STAGING / DRAFT only. Do NOT publish live.
> After import, fetch the staging page and diff its visible text against the
> sites/<domain> page — show me the diff (it should be empty or cosmetic).
> Give me the staging preview URL.
> ```
Novamira lives **only** with Deepu. Then the human part, in this exact order:
1. Open the staging URL — the **one human review** (reads right, mobile, on-brand).
2. Open the item's Drive folder and **verify the sign-off evidence**: if the Handoff Card says a medical claim is "signed", the doctor's actual saved reply must be in the folder with a sane date. Card says signed but no evidence = **bounce to the submitter** (the submitter chases Dr. Deepu John — never you).
3. Write the ledger row first (`status: ok_to_publish`, PR, sign-off) — durable BEFORE the click.
4. Run `node scripts/wp-snapshot.mjs` against the **live** page one more time (the promotion backup), then **push the staged content live yourself** (Publish/Update in WordPress). A human makes it live — never the agent.

**Route B — Factory site via Vercel** (pages under `sites/`): an **approver merges** the PR (`main` is protected — if you don't hold approver rights for content PRs, post the green PR link to Abilash for his one-word merge). Vercel deploys automatically. Confirm the production URL loads.

> **✅ Stage 4 checkpoint:** CI green · medical checkpoint passed (signed or n-a) · WordPress: eyeballed staging then published yourself · Vercel: production URL loads · you have the final URL for the ledger.

### Stage 5 — Stamp the ✅ CHECKED marker and close the loop

The marker is how anyone — Abilash, marketing, you in three weeks — can tell **at a glance** whether an item actually went through the machine:

1. Drop a **`CHECKED-✅.txt`** file into the item's Drive folder containing: the date, the PR number, "all gates green", the medical sign-off line (signed / n-a), and the live URL.
2. **Move the item's folder** from that person's **2 — Ready for Deepu** into their **3 — Published**.
3. Update the item's row in the **Pipeline Tracker sheet** and in `content/ledger.yaml` (Part 5).

> **⚠️ No marker = not checked.** If you ever find published-looking work with no `CHECKED-✅.txt`, treat it as unchecked: run it through the pipeline yourself before touching it further. The marker is the only proof the machine ever saw it.

### 🚑 IF DEEPU IS AWAY (the named backup)

> **⚠️ The pipeline must never halt on one person's leave.** The named backup is **Abilash** — he already runs Claude Code and git, and he runs Stages 1–5 **exactly as written** (same gates, same markers, same medical checkpoint; the Express Lane section is his fast path). Nobody else publishes. If both are away, items wait in **2 — Ready for Deepu** — waiting is safe; bypassing is not.

### 🦸 DEEPU-SOLO MODE (when marketing can't drive the system)

The team is new to this. Some will hand you a perfect folder; some will hand you a WhatsApp message and a Word file. **The pipeline works either way** — because you can run *every* stage yourself, start to finish:

0. **Intake first, work second:** before touching it, create the item's folder in the sender's **2 — Ready for Deepu** (or your own Inbox) and add its Tracker row — a WhatsApp message is not a pipeline state.
1. Take whatever raw input exists — a rough doc, a Claude Design link, even just "update the weight-loss page" — or, for the legacy pages, **fetch the live page yourself** (the old `.html` landing pages count as raw input; nobody needs to hand them to you).
2. Run the marketing steps on their behalf in Claude Code: build/recreate the page, paste the **⭐ Step 2** prompt, apply the voice (from the Voices page) if it's a blog.
3. Then run your own Stages 1–5 exactly as above. Nothing about the checks changes.
4. First few times: **do it on screen in front of Abilash / the team** — that demo *is* the training. Then publish.

> **ℹ️ This is the bottleneck-killer's backstop:** even at marketing's worst, the flow never stalls — it just starts at your desk instead of theirs. As they learn, work arrives more finished and your share shrinks back to "review once, publish."

### 🔙 IF SOMETHING'S WRONG AFTER IT'S LIVE (rollback)

- **WordPress:** open the page in Gutenberg → **Revisions** → restore the previous version (or switch the post back to Draft if it must come down *now*). Fix through the normal pipeline, republish.
- **Factory site (Vercel):** use Vercel's **instant rollback** to the previous deployment (or revert the PR and merge). Fix forward through a new PR.
- Either way: note it in the ledger row (`notes:`) and tell Abilash. No silent fixes.

---

## THE EXPRESS LANE — GitHub for Abilash (and trained members)

*Marketing hands work to Abilash. He reviews it. Then — instead of forwarding it to Deepu's queue, where it waits — he pushes it into the factory himself. Deepu only publishes.*

---

### 1 · The answer up front: YES — and it is safe by construction

This lane exists because the question was asked: *"If I've already reviewed the work, why does it sit in a folder waiting for Deepu to import it? Can I push it in myself?"*

**Yes.** And nothing about the safety changes, because the safety was never in *who types* — it is in the machine:

1. **`main` is branch-protected.** Nobody — not Abilash, not Claude, not a trained member — can merge without an approving review. A pushed branch can never touch the live site by itself.
2. **Every PR runs the full machine checks automatically** — `pnpm compliance`, banned-string-lint, content-lint, cta-label-lint, brand-lint, the Lighthouse gate, the Playwright factory suite, front-gate, the security review, gitleaks. The same 99% that protects Deepu's imports protects yours.
3. **Every pushed branch of a registered factory site gets a Vercel PREVIEW link automatically.** You see the real page, on a real URL, before anyone merges anything.

> **✅ The worst case of this lane is a red PR that never merges.** That is the whole point of the factory: pushing a branch risks nothing.

---

### 2 · Who may use it

1. **Abilash — now.** He runs Claude Code and git already.
2. **A marketing member — only after Abilash explicitly certifies them.** Certified means: Abilash watched them run the full flow, start to finish, and said so. Not "watched the video". Not "seems comfortable".

> **⚠️ Untrained git use is how work gets lost — the normal Drive lane is always available.** Nobody is ever *required* to use the Express Lane. **2 — Ready for Deepu** keeps working exactly as before.

---

### 3 · The flow (Abilash's steps, one prompt)

**Before you start:** the work must already be *reviewed* — the 4-question gut check passed, and if there is any medical claim, **Dr. Deepu John's sign-off is already saved in the item's Drive folder**. The Express Lane skips the queue, never the review.

1. Give the item a short name, e.g. `weight-loss-page`. Keep its Drive folder — that is still where the doctor's sign-off proof and, later, the `CHECKED-✅.txt` marker live.
2. Fill the **Handoff Card** (the same one from Part 2, Step 3). You will paste it into the prompt below — it travels inside the PR description.
3. Open the factory folder in the terminal and start Claude Code:
   ```
   cd ~/Claude/Kairali-Digital/kairali-web-factory
   claude
   ```
4. Paste this **once** (fill the brackets):

   > **PROMPT BOX — "Push a reviewed submission into the factory as a PR"**
   > ```
   > I have a REVIEWED marketing submission to push into the factory as a PR.
   > Submission: [Claude Design share link / path to page folder / blog draft]
   > Target site: [e.g. ayurvedichealingvillage.com]
   > Item name: [short-name — e.g. weight-loss-page]
   >
   > Do exactly this, in order, and show me the real output of each step:
   > 1. Sync to the source of truth: git fetch, checkout main, pull latest.
   > 2. Create a new branch: content/[item-name].
   > 3. Take the submission and turn it into a real page under
   >    sites/[target-domain]/ in the form that site uses (its .tsx/.mdx/.md page).
   >    - Do NOT change any wording, fact, price, or claim. Preserve them exactly.
   >    - Wire it into the site so the existing gates can inspect it.
   >    - Show me the new/changed files and the page route. Change nothing else.
   > 4. Commit and push the branch (--force-with-lease only, never --force).
   > 5. Open the PR to main, with the Handoff Card below as the PR description.
   > 6. Give me: the PR number, the PR link, and the Vercel preview link for
   >    this branch (wait for the preview deployment if you need to).
   > Do NOT merge the PR. Do NOT touch production. Deepu merges and publishes.
   >
   > HANDOFF CARD (put this in the PR description):
   > [paste your filled Handoff Card here]
   > ```

5. **Open the Vercel preview link yourself.** One look: right words, right facts, right on a phone.
6. **Paste the preview link back to the reviewer** (the marketing member who built it). They confirm it is their page, unchanged.
7. **Add the item's row to the Pipeline Tracker sheet** — same as any other item. (Deepu still fills the Checks and Published columns; he still owns `content/ledger.yaml`.)
8. **Message Deepu:** *"PR #N is green-pending, over to you."* Done. Your part is over.

> **ℹ️ Steps 1–6 of the prompt are the workbook's own Stage-1 render prompt plus the git bookends.** You are not inventing a new pipeline — you are doing Deepu's Stage 1 and Stage 2 for him, on one item, so his queue is one item shorter.

---

### 4 · What Deepu does differently: NOTHING

That is the design. Deepu opens the PR and it looks exactly like one he imported himself:

1. The **Handoff Card is in the PR description** — same card, new address.
2. The checks have already run. Green → his **one human review**, then he merges (**factory site: Vercel deploys production automatically**) or publishes (**WordPress target: Novamira into staging/draft, eyeball, then he clicks Publish** — Stage 4, Route A, unchanged).
3. Red on a content gate → he **bounces** with the plain-English list, same as always, and the branch stays open.
4. He stamps `CHECKED-✅.txt` into the item's Drive folder, moves it to **3 — Published**, updates the tracker row and the ledger. Stage 5, unchanged.

> **ℹ️ WordPress-target items still ride this lane.** The page still gets rendered under `sites/<domain>/` so every gate can inspect it — the PR is the checkpoint, Novamira is only Deepu's delivery van afterwards.

---

### 5 · The one warning that matters

> **⚠️ The Express Lane changes WHO types, never WHAT is checked.** Every machine gate still runs. Dr. Deepu John still signs every medical claim **before** the push — and Deepu's manual medical checkpoint still stands even on a green PR. Deepu's one human review still happens. The `CHECKED-✅.txt` marker still gets stamped. The item still gets its Pipeline Tracker row. If you ever feel the lane letting you *skip* one of those, stop — you are off the road.

---

### 6 · Where this fits

```
Normal lane:   Marketing → Drive → Deepu
Express lane:  Marketing → Abilash → GitHub PR → Deepu
```

Same machine, same gates, same publisher. The Express Lane only deletes the wait between *"Abilash approved it"* and *"Deepu imported it"* — because by the time Deepu opens the PR, the import already happened.

---

## PART 5 — THE TRACKING LEDGER

Tracking lives in **two layers**, each for the people who actually use it. Neither invents a status the other contradicts:

**Layer 1 — for marketing & management: the Drive folders + the Pipeline Tracker sheet.**
Marketing never edits a repo file. Their status *is* which subfolder the item sits in — **1 Drafts → 2 Ready for Deepu → 3 Published** — mirrored in one Google Sheet (the **Pipeline Tracker**, in the same Drive folder) with plain-words columns: *Item · Site + page · Who · Tool · Handed off · Checks (✅/❌/–) · Doctor sign-off · Published date · Live link*. One glance = the whole pipeline. Deepu fills the Checks/Published columns; nobody else touches those.

**Layer 2 — for Deepu & the machine: `content/ledger.yaml`, committed in the repo.**
This is the durable, auditable record that answers "did this go through the factory, when was it last checked, and is it live?" — the exact question the old static pages could never answer. **Deepu owns every field** (marketing can't see CI or live URLs, so they write none of it).

> **ℹ️ Status words.** The ledger's `status` reuses the fleet's real `STATUS.yaml` values — `build | gates | human_audit | ok_to_publish | live` — it does **not** invent new ones. An item Deepu hasn't imported yet simply isn't in the ledger (it's visible in Layer 1's "2 — Ready for Deepu" folder). A bounce is recorded as `ci_status: red` + a `needs_fix` note while `status` stays `gates`. Green + Deepu's review = `human_audit` → `ok_to_publish`; published = `live`.

> **ℹ️ This ledger does not replace `STATUS.yaml`.** `STATUS.yaml` tracks whole **sites** (one row per site, session-end rule); `content/ledger.yaml` tracks individual **content items** flowing through the pipeline. Different granularity, no overlap — never copy statuses between them.

> **ℹ️ Batches.** Roshni's batched blogs can share **one PR**: each post still gets its own ledger row and tracker row; the rows simply carry the same `pr:` number, and one green run + one review clears them all. **Batches are severable:** if one post goes red, Deepu moves *that post* off the branch (own row, own follow-up PR) and the green rest merge on time — one bad post never holds a batch hostage.

> **ℹ️ If the Tracker and the ledger ever disagree, the ledger wins** (it travels with the code). Reconciling the two is part of the existing **Monday lint ritual** — same pass as the wiki lint.

> **ℹ️ Brand rules come from each site, not a two-value tag.** Only `ayurvedichealingvillage.com` carries the clinical lock; only Villa Raag is hospitality; yoga, blog, and corporate sites each have their own ruleset in their `site.config.json`. Never tag a yoga or blog site "clinical" — that would wrongly ban words like "journey" on a page where they're fine.

**Example rows:**
```yaml
# content/ledger.yaml — one entry per submission.
# status uses STATUS.yaml values only: ideation|research|build|gates|preview|
# human_audit|ok_to_publish|live|monitoring
items:
  - title: "Panchakarma programme — landing page"
    target_site: ayurvedichealingvillage.com     # clinical lock comes from its site.config.json
    format: landing-page
    publish_route: wordpress-novamira
    author_voice: null
    submitted_by: "Anu (marketing)"
    submitted_date: 2026-07-18
    has_medical_claims: yes
    pr: 142
    last_checked: 2026-07-21
    ci_status: green
    medical_signoff: "drdeepujohn:2026-07-20"     # human step, recorded here — NOT judged by CI
    reviewed_by: "Deepu (developer)"
    status: live
    published_url: "https://ayurvedichealingvillage.com/panchakarma"
    published_date: 2026-07-21
    notes: "Legacy .html rebuilt into sites/ then imported to WordPress via Novamira."

  - title: "Monsoon diet tips (blog)"
    target_site: whyayurveda.org                  # blog/editorial ruleset — NOT clinical
    format: blog
    publish_route: wordpress-novamira
    author_voice: gita-ramesh
    submitted_by: "Roshni"
    submitted_date: 2026-07-18
    has_medical_claims: no
    pr: 143
    last_checked: 2026-07-18
    ci_status: red
    medical_signoff: na
    reviewed_by: null
    status: gates
    published_url: null
    published_date: null
    notes: "needs_fix: 2 health-promise lines to soften; bounced to Roshni via the shared folder. Branch kept open."

  - title: "Yoga programme hero refresh"
    target_site: kairaliyoga.com                  # yoga ruleset — 'journey'/'luxury' NOT banned here
    format: landing-page
    publish_route: vercel
    author_voice: null
    submitted_by: "Anu (marketing)"
    submitted_date: 2026-07-17
    has_medical_claims: no
    pr: 138
    last_checked: 2026-07-18
    ci_status: green
    medical_signoff: na
    reviewed_by: "Deepu (developer)"
    status: human_audit
    published_url: null
    published_date: null
    notes: "Green; awaiting Deepu's staging eyeball before Vercel merge."
```

---

## PART 6 — TROUBLESHOOTING

| Symptom | What it means | What to do |
|---|---|---|
| **(Marketing) Deepu sent it back** | The machine caught something before it went live | Read his plain-English list, fix each item in your tool, re-run Step 2, re-hand-off with "what changed" updated |
| **(Marketing) No price/phone/date to put in** | Missing fact | Leave it blank, list it under "Must-be-exact facts". Never guess (Rule 2) |
| **(Marketing) Claude wrote a health claim** | Needs a doctor | Get **Dr. Deepu John** to sign **before** handoff; only then write "Ready: YES" |
| **(Marketing) Banned word on a hospital page** | Rule 1 | Fix visible text yourself (tell Claude to swap for a clinical word). Only flag things you can't change, like the page's short web address |
| **(Marketing) "FEATURE NEEDED: ___"** | Claude refused to fake something — good | Put that exact line on the Handoff Card so Deepu builds it properly |
| **(Marketing) Blog with no voice set** | Missing author voice | Run the author-voice prompt first (default Abilash; food/lifestyle Gita; brand news Roshni), then Step 2 |
| **(Deepu) CI red, all cosmetic** | The 99% caught dev issues | Fix on branch, push, re-run (Stage 3) |
| **(Deepu) CI red on compliance / content / banned-string / cta-label** | Words/facts/claims — not yours to edit | Bounce with the plain-English item; keep the branch open |
| **(Deepu) `front-gate` fails, content clean** | No signed approval file yet | The **front-gate blocks until the signed approval file exists** — get the site owner to sign the `brief→strategy→design_source→golden_page` rows in `launches/<domain>/approvals.yaml`, then re-run. (The doctor's medical sign-off is a *separate* human step in Stage 4.) |
| **(Deepu) Green but page has a medical claim** | CI can't sign for a physician | Manual checkpoint — route to Dr. Deepu John, record `medical_signoff`, then publish |
| **(Deepu) Lighthouse / performance red** | Should be rare (checked at build) | If marketing can rebuild, bounce; if it's a dev-side fix, log it on the row (`ci_status: red`, note who owns it) so it's visible, not silent |
| **Item sitting in "2 — Ready for Deepu" for days** | Not imported yet | Ping Deepu; intake target is next-business-day. Batch blogs so one review clears many |
| **Published-looking work with no `CHECKED-✅.txt` in its folder** | It never went through the machine | Treat as unchecked — Deepu runs it through the pipeline before anything else touches it |

---

## REFERENCE LIBRARY — every link in one place

Lost a link? It is here. Bookmark this page. Every link the whole system uses, one line each.

| # | Link | What it is | When to open it |
|---|---|---|---|
| 1 | [The origin video (Jono Catliff, YouTube)](https://www.youtube.com/watch?v=Gt8tT-xf6g4) | "How I Built INSANE WordPress Websites In 20 Minutes (Claude Code)" — the method this whole factory industrialises | **Once**, in your first week. It shows the *idea*; this workbook shows *our* version of it |
| 2 | [Team Workbook (this page)](https://kairali-team-workbook.vercel.app) | The one and only way we put pages and blogs online | Every time you build, hand off, or get a bounce-back |
| 3 | [Voices page](https://kairali-team-workbook.vercel.app/voices.html) | The 10 blog author voices and how to pick one | Before writing **any** blog (default Abilash; food/lifestyle Gita) |
| 4 | [Shared Drive folder — Website - Staging - Marketing](https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX) | Where all handoffs live: your folder with **1 Drafts / 2 Ready for Deepu / 3 Published** | Daily. Your item's subfolder *is* its status |
| 5 | [Pipeline Tracker sheet](https://docs.google.com/spreadsheets/d/1mS6WzRrZmQVnWjfg631uOFSRDD1raFTSLhjlYuQZIos/edit) | One Google Sheet mirroring the whole pipeline — one glance = everything in flight | When you hand off (add your row) and when you want to know "where is my page?" |
| 6 | [START HERE doc](https://docs.google.com/document/d/1ilwWTz-8h6PrHslKgTrbQO9yIuDYorsXzhmEwS8QEj8/edit) | The short Drive-side orientation doc sitting inside the shared folder | Day one, before anything else — then come back to this workbook |
| 7 | GitHub repo: `kairali-digital/kairali-web-factory` | The factory itself — code, checks, ledger. **Developers only** | Deepu (and Abilash) only. Marketing **never** opens GitHub — that is the whole point |
| 8 | `docs/sops/` (inside the repo) | The source files these pages are built from — `team-website-lifecycle-sop.md` (this workbook) and `wordpress-gutenberg-setup.md` (Deepu's Novamira/WordPress setup) | Deepu, when he needs the WordPress steps; anyone editing the workbook itself |

> **ℹ️ Which one do I need?** Marketing lives in links **2–6**. Deepu adds **7–8**. Everyone watches **1** once.

> **⚠️ Don't pass links around in chat.** If someone asks "where's the tracker?", send them to this page — one place, always current.

---

*Kairali Web Factory — Team Workbook v3.0 (18 Jul 2026, audited). You build → Step 2 → hand to Deepu → the machine checks → he reviews once and publishes → the marker + tracker show it live. Marketing never touches GitHub or WordPress. When unsure: stop and ask Abilash. Companions: the **Voices page** (author voices) · `wordpress-gutenberg-setup.md` (Deepu's Novamira setup) · the Drive folder [Website - Staging - Marketing](https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX).*