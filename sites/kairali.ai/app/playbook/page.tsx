"use client";
// Kairali Playbook — the interactive "choose your path" SOP.
// One link for everything: pick WHO you are → WHAT you're doing → YOUR TOOL,
// and get the exact numbered path to a live page. Deep detail lives on the
// full-guide pages (/guide/workbook, /guide/deepu, /guide/voices, /guide/access);
// this wizard is the router. Source of truth: docs/sops/*.md in the repo.
import { useState } from "react";

// ---- Fleet Pulse palette (matches app/page.tsx) ---------------------------
const INK = "#1A2E1A";
const IVORY = "#FFFDF7";
const LINE = "#E6E0CF";
const MARIGOLD = "#F0BF3E";
const FOREST = "#003720";

// ---- shared prompt boxes (printed once, reused by every path) -------------
const P_PUBLISH_READY = `Please finish this [landing page / blog post] so it is ready to publish.
It is for: [which site + page — e.g. ayurvedichealingvillage.com weight-loss page]

Please:
1. ON-PAGE SEO: one clear H1, a good page title and meta description,
   and alt text on every image.
2. INTERNAL LINKS: add links ONLY to real pages on the same site or listed
   in the Playbook's Reference Library — never invent a link. If a page you
   want to link doesn't exist, write "FEATURE NEEDED: link target ___".
3. EXTERNAL LINKS: only to genuinely authoritative sources (official bodies,
   research, government health pages) and only when they help the reader.
   Never link to competitors or thin sites. When citing research on a health
   topic, name the source in the text.
4. Check it reads well and looks right on a phone.
5. COMPLIANCE (important):
   - Hospital site (ayurvedichealingvillage.com) = clinical words ONLY
     (patient, treatment, programme, Panchakarma, consultation); never
     "spa, resort, holiday, luxury, cure, journey, guests" — in any language.
   - Do NOT invent any fact, price, number, phone, date, or medical claim.
   - Flag every medical claim clearly so Dr. Deepu John can approve it.
6. If something I need doesn't exist yet, say "FEATURE NEEDED: ___".

Then give me a preview and a plain-English list of (a) what you did and
(b) anything I must decide or get approved. Do NOT publish — Deepu publishes.`;

const P_CREATE = `Build a new landing page in this folder that I can preview in my browser.

It is for: [which site — e.g. ayurvedichealingvillage.com, the Ayurveda hospital].
Topic: [from your Kitting Card]
Audience (MoA): [from your Kitting Card — who this page is for, and their
secret desire — the thing they want but rarely say out loud]

HEADLINE — write it the way Akshar Yadav's GO science teaches (the MCB):
  "How to [their secret desire] without [the painful effort they fear]"
  + 2–3 short big-promise phrases under it (the specific benefit they get)
  + one small, non-pressuring button (e.g. "Book a Consultation")
The headline must create CURIOSITY, not make claims. If you know the GO
science (MCB, MoA, NDFF), apply it; write like you are helping this exact
person, not "everyone".

Include: that headline (H1), a short intro, [sections you want], and ONE
main button.

Rules:
- Build it as a SINGLE self-contained HTML file (plus an images folder if
  needed) — no frameworks, no node_modules. Double-click must open it.
- Mobile-friendly, calm clean Kairali look. Missing a design piece we don't
  have? Say "FEATURE NEEDED: ___" — don't invent an off-brand look.
- Hospital site = clinical words only; never spa / resort / holiday / luxury /
  cure / journey / guests.
- Leave any price, phone, or medical claim BLANK — never invent one.
- Do NOT commit, push, or publish anything.

Then start the preview and give me the link that opens the page in my browser.`;

const P_UPDATE = `Please bring in this existing page so I can edit a copy of it:
[paste the full page link]

Save it in this folder and start a preview so I can see it. Keep everything the
same for now — I'll tell you the one change I want. Invent nothing.`;

const P_BLOG = `Write a blog post draft in this folder that I can preview in my browser.

Topic: [from your Kitting Card]
Audience (MoA): [who this post is for — and what they secretly want to solve]

The post MUST follow the author voice I pasted in the previous step — it has
to genuinely sound like that author, not generic AI.

Structure:
- a curiosity-creating title (GO/MCB thinking: their secret desire, no hype)
- an opening that speaks to the reader's real situation in 2-3 sentences
- clear H2 sections, short paragraphs
- one practical takeaway the reader can use today
- one gentle call-to-action at the end (no pressure, no fake urgency)

Rules:
- NEVER invent a statistic, study, price, date, or medical claim — write
  [NEEDS FACT] where one is missing and list them at the end.
- Health claims must stay conservative ("supports", "may help") and will be
  flagged for the doctor.
- Save as a simple HTML file I can open with a double-click, and give me the
  preview link.`;

const P_VOICE = `Please write this blog in the voice described below. Match the tone, sentence
length, vocabulary, and do's/don'ts exactly — it must genuinely sound like this
author, not generic AI. Keep every fact accurate; invent nothing.

[PASTE THE AUTHOR'S VOICE BLOCK FROM THE VOICES PAGE HERE]`;

const P_EXPRESS = `I have a REVIEWED marketing submission to push into the factory as a PR.
Submission: [Claude Design share link / path to page folder / blog draft]
Target site: [e.g. ayurvedichealingvillage.com]
Item name: [short-name — e.g. weight-loss-page]

Do exactly this, in order, and show me the real output of each step:
1. Sync: git fetch, checkout main, pull latest.
2. New branch: content/[item-name].
3. Turn the submission into a real page under sites/[target-domain]/ in the
   form that site uses. Do NOT change any wording, fact, price, or claim.
4. Commit and push the branch (--force-with-lease only, never --force).
5. Open the PR to main, with the Handoff Card below as the PR description.
6. Give me: the PR number, the PR link, and the Vercel preview link.
Do NOT merge the PR. Do NOT touch production. Deepu merges and publishes.

HANDOFF CARD (put this in the PR description):
[paste your filled Handoff Card here]`;

const P_RENDER = `Take the marketing submission I point you to (a Claude Design share link, a
page folder, or a blog draft) and turn it into a real page under
sites/<target-domain>/ in the form that site uses (its .tsx/.mdx/.md page).
- Do NOT change any wording, fact, price, or claim. Preserve them exactly.
- Wire it into the site so the existing gates can inspect it.
- Show me the new/changed files and the page route. Change nothing else.
- If a Claude Design share link won't open, do NOT rebuild from memory —
  tell me so the submitter drops an exported copy instead.`;

const P_WP_PUBLISH = `The PR for [page] is green and the manual medical checkpoint passed.

STEP 1 — SNAPSHOT FIRST (never skip, never reorder):
Run: node scripts/wp-snapshot.mjs [full live page URL]
Show me the exact saved file path, then commit the new file in backups/
on the current branch so the snapshot also lands in git history.
If the page does not exist live yet (a brand-new page), say so and continue.

STEP 2 — THEN IMPORT:
Using Novamira, import the page into [target-site] as EDITABLE WordPress
blocks, into STAGING / DRAFT only. Do NOT publish live.
After import, fetch the staging page and diff its visible text against the
sites/<domain> page — show me the diff. Give me the staging preview URL.`;

const KITTING = `FULL KITTING CARD — fill this BEFORE you build (5 minutes)
- WHY are we building it:      [leads / bookings / SEO traffic / information]
- WHO is it for (the MoA):     [the exact ideal reader — and their secret desire]
- WHAT exactly:                [new landing page / update / blog + one-line scope]
- WHERE it will live:          [site + the exact page address]
- WHEN it is needed:           [deadline + the task ID from the delegation sheet]
- FACTS PACK:                  [link to that site's FACTS doc in the Drive folder]
- Author voice (blogs only):   [from the Voices page — default: Abilash]
- Medical claims expected?     [yes/no — yes = plan Dr. Deepu John's sign-off NOW]
Not kitted = not started. A page built without kitting gets rebuilt.`;

const HANDOFF = `HANDOFF TO DEEPU
- What is it:            [new landing page / update / new blog / content fix]
- Built with:            [Claude Design / VS Code + Claude plugin / Antigravity / Claude Code]
- Which site + page:     [e.g. ayurvedichealingvillage.com — the weight-loss page]
- Where the work is:     [share link OR folder name in "2 — Ready for Deepu"]
- Author voice (blogs):  [name, or "n/a"]
- Must-be-exact facts:   [prices, phone, WhatsApp, dates — or "none"]
- Medical claim inside?  [yes / no]
- Dr. Deepu John sign-off: [signed on YYYY-MM-DD / n-a]
- If an UPDATE, what changed: [one line]
- Approved by:           [your name] + Abilash
- Ready to publish:      [leave BLANK — only write YES when every line is done]`;

// ---- types ---------------------------------------------------------------
type Step = { t: string; d: string; warn?: string; prompt?: string; copy?: { label: string; text: string }[]; link?: { href: string; label: string } };
type Path = { key: string; steps: Step[] };

// ---- the shared step fragments -------------------------------------------
const stepKitting: Step = {
  t: "Full Kitting — know why, who, what, where, when",
  warn: "Not kitted = not started. No delegation-sheet task ID on the card = the work does not officially exist.",
  d: "Fill the Kitting Card before anything else. The task itself should already be on the delegation sheet (Ritu logs it; the task ID goes on the card). For landing pages, use the GO marketing science for the audience + headline — type /go-science in Claude Code for help with the MoA and MCB.",
  prompt: KITTING,
};
const stepPublishReady: Step = {
  t: "Make it publish-ready (SEO + internal & external links + compliance)",
  warn: "Never link to a page that does not exist, and never invent a fact to fill a gap — blank + flag beats a guess, every time.",
  d: "One paste. This is your rehearsal for the machine checks — the real checks run at Deepu's stage.",
  prompt: P_PUBLISH_READY,
};
const stepApprove: Step = {
  t: "Approve — Abilash (+ the doctor first if medical)",
  warn: "A medical claim without the doctor's SAVED REPLY in the item folder = the page WAITS. Writing \"signed\" with nothing behind it is inventing a fact.",
  d: "Abilash approves in his two daily windows (~12:00 and ~17:00) — batch your asks. Any medical claim needs Dr. Deepu John's actual reply saved into the item's folder BEFORE handoff. Save Abilash's approving message (screenshot) in the folder too.",
};
const stepHandoff: Step = {
  t: "Hand off — folder + card + message",
  warn: "Moving the item to '2 — Ready for Deepu' LOCKS it. Never edit a handed-off item — pull it back to '1 — Drafts' and message Deepu first.",
  d: "Move the item's folder to YOUR '2 — Ready for Deepu' subfolder in the shared Drive, drop the filled Handoff Card (a Google Doc) + screenshots in it, add your row to the Pipeline Tracker, and message Deepu. Moving it LOCKS it — pull it back to '1 — Drafts' if you must change something.",
  prompt: HANDOFF,
  link: { href: "https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX", label: "Open the shared Drive folder ↗" },
};
const stepTrack: Step = {
  t: "Track it — you're done; the system takes over",
  warn: "A bounce-back is NORMAL — the machine caught it before the internet did. Fix, re-run publish-ready, re-drop. Never work around the pipeline.",
  d: "What happens next (you touch none of it): Deepu puts your work into GitHub — the company's version-control vault where every change is saved forever and checked by machines (banned words, invented facts, broken links, speed, brand). He reviews once and publishes. You'll see: a CHECKED-✅ note + the live link in your '3 — Published' folder, the Tracker row filled, and your delegation task closed with the live URL as proof. If it bounces back, you get a plain-English fix list — fix, re-run publish-ready, re-drop. That's git working FOR you without you ever opening it.",
};

// ---- the path matrix ------------------------------------------------------
const WARN_CREATE = "NEVER invent a price, phone, or medical claim — leave it BLANK and flag it. Hospital site: never spa / resort / holiday / luxury / cure / journey / guests.";
const WARN_UPDATE = "FIRST save a screenshot of the live page (your before-proof). Every price, phone, WhatsApp and date must match the live page EXACTLY.";
const buildToolSteps = (create: boolean): Record<string, Step[]> => ({
  design: [
    {
      t: create ? "Create it in Claude Design" : "Recreate the live page in Claude Design",
      warn: create ? WARN_CREATE : WARN_UPDATE,
      d: create
        ? "Open Claude Design, start a new design, paste the CREATE prompt (fill the brackets from your Kitting Card). Tweak in plain words until it's right."
        : "Paste the UPDATE prompt with the live page address. FIRST save a full screenshot of the original live page into your item folder (the before-proof). Then tell Claude the one change. Confirm every price/phone/date still matches the live page exactly.",
      prompt: create ? P_CREATE : P_UPDATE,
    },
  ],
  vscode: [
    {
      t: create ? "Create it in VS Code + Claude plugin ⭐" : "Bring the live page into VS Code + Claude plugin ⭐",
      warn: create ? WARN_CREATE : WARN_UPDATE,
      d: create
        ? "New empty folder named for the page → open in VS Code → Claude plugin panel → paste the CREATE prompt. Click the preview link, tweak in plain words. When Claude asks 'allow this command?' — click Allow; it only works inside your folder."
        : "New folder → Claude plugin → paste the UPDATE prompt with the live address. Save a screenshot of the original live page into your folder first. Tell Claude the one change, then confirm every price/phone/date matches the live page.",
      prompt: create ? P_CREATE : P_UPDATE,
    },
  ],
  antigravity: [
    {
      t: create ? "Create it in Antigravity" : "Bring the live page into Antigravity",
      warn: create ? WARN_CREATE : WARN_UPDATE,
      d: "Same shape as VS Code — open a new empty folder in Antigravity, open the Claude chat panel, and use the same prompt. Preview, tweak in plain words, screenshot (incl. a narrow/phone view).",
      prompt: create ? P_CREATE : P_UPDATE,
    },
  ],
  claudecode: [
    {
      t: create ? "Create it in Claude Code (terminal)" : "Bring the live page into Claude Code (terminal)",
      warn: create ? WARN_CREATE : WARN_UPDATE,
      d: "New empty folder → open terminal there → type claude → paste the same prompt. Preview, tweak, screenshot.",
      prompt: create ? P_CREATE : P_UPDATE,
    },
  ],
});

const stepGoScience: Step = {
  t: "Get your headline from the GO science (2 minutes)",
  warn: "The headline creates CURIOSITY — never claims. No \"best\", no \"guaranteed\", no \"cure\". Curiosity opens doors; claims close them (and break compliance).",
  d: "Before building, ask the Akshar (GO) skill for your MCB headline. In Claude Code (or ask Deepu/Abilash to run it), paste the line below — it returns headline options built on your audience's secret desire. Pick one, put it on your Kitting Card.",
  prompt: "/go-science generate MCB for [what the page sells — e.g. a 14-day Panchakarma weight-management programme] targeting [your MoA — e.g. stressed NRI professionals 35-55 who want to reset their health without a hospital feel]",
};

// ---- DAY 0: per-tool first-time setup, baby steps, zero assumptions -------
const day0Common: Step[] = [
  { t: "Check your Drive access", d: "Open the shared folder (button below). You should see a folder with YOUR NAME on it, containing '1 — Drafts', '2 — Ready for Deepu', '3 — Published'. Can't see it? Message Abilash: 'please share the Website - Staging - Marketing folder with me' — it takes him 30 seconds.", link: { href: "https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX", label: "Open the shared Drive folder ↗" } },
  { t: "Bookmark two pages", d: "This Playbook (the page you're on) and the Pipeline Tracker (button below). In your browser: press Cmd+D (Mac) or Ctrl+D (Windows) on each. These two links are your whole world.", link: { href: "https://docs.google.com/spreadsheets/d/1mS6WzRrZmQVnWjfg631uOFSRDD1raFTSLhjlYuQZIos/edit", label: "Open the Pipeline Tracker ↗" } },
  { warn: "Any other WhatsApp number or email you see anywhere is WRONG — fix on sight and flag it.", t: "Open your site's FACTS doc (button below)", d: "Click the button below — it opens the FACTS folder inside our shared Drive. Inside are docs named 'FACTS — [site]' (kept correct by Vikash/Abilash). Open the one for the site you'll work on, and bookmark it (Cmd+D / Ctrl+D). Every price, phone and address you ever use comes from that doc — never from memory. The two facts everyone must know by heart:", copy: [ { label: "Public email — the only one we publish", text: "info@kairali.com" }, { label: "WhatsApp — the only correct number", text: "+91 92898 38797" } ], link: { href: "https://drive.google.com/drive/folders/1T8_UUHxRft9OwPsWZaUxsvo_NPiv-OVo", label: "Open the FACTS folder ↗" } },
  { t: "Smoke test — prove your setup works (5 min)", d: "Five small moves: 1) On your Desktop, right-click → New Folder → name it: practice. 2) Open that folder in your tool (VS Code / Antigravity: File → Open Folder → pick 'practice' → click Trust if asked; Claude Design: just open the chat). 3) Click the Claude icon/panel. 4) Paste the line below and press Enter — Claude will ask permission once (click Allow), then give you a link. 5) Click the link: if your browser shows 'Hello Kairali', your setup WORKS. Then delete the practice folder from your Desktop. That's the whole test.", copy: [ { label: "Paste this into Claude (step 4)", text: "Build a one-line practice page that says Hello Kairali, and show me the preview." } ] },
  { t: "Watch the origin video this week (20 min)", d: "It shows the idea our whole system industrialises. Watch once, with chai. Then you're fully onboarded — go back to the Playbook and pick your first real task.", link: { href: "https://www.youtube.com/watch?v=Gt8tT-xf6g4", label: "Watch the origin video ↗" } },
];

const day0Tool: Record<string, Step[]> = {
  vscode: [
    { t: "Install VS Code (10 min, once)", d: "Go to code.visualstudio.com (button below) → click the big blue Download button. Mac: open the downloaded file and drag 'Visual Studio Code' into the Applications folder, then open it from Applications. Windows: run the downloaded installer and keep clicking Next until it finishes, then open VS Code from the Start menu.", link: { href: "https://code.visualstudio.com/", label: "Download VS Code ↗" } },
    { t: "Add the Claude plugin", d: "In VS Code, look at the LEFT sidebar and click the Extensions icon (four little squares). Paste the text below into the search box. Click the one by Anthropic → click Install. A new Claude icon appears in the left sidebar — click it.", copy: [ { label: "Type/paste in the Extensions search box", text: "Claude Code" } ] },
    { warn: "Clicking Trust on YOUR page folder is fine. But NEVER type a password into a chat, a doc, or a prompt — passwords only ever go into official login screens.", t: "Sign in to Claude", d: "The Claude panel asks you to sign in — click it, your browser opens, log in with the company Claude account (ask Abilash which email if you don't have it). Come back to VS Code: if the chat panel says hello, you're in. If anything asks 'Do you trust this folder?' — click Trust; it only ever works inside folders you open.", },
  ],
  antigravity: [
    { t: "Install Antigravity (10 min, once)", d: "Go to antigravity.google/download (button below) → find the 'Antigravity IDE' section. Mac with M1/M2/M3/M4 chip: choose Apple Silicon; older Mac: Intel. Windows: x64. Mac: open the downloaded file and drag Antigravity into Applications. Windows: run the installer.", link: { href: "https://antigravity.google/download", label: "Download Antigravity ↗" } },
    { t: "Sign in", d: "Open Antigravity → click 'Continue with Google' → choose your company Google account → when the success screen appears click Next. You should see the Agent (chat) panel. That panel is where all the prompts from this Playbook get pasted.", },
  ],
  design: [
    { t: "Nothing to install 🎉", d: "Claude Design runs in your browser. Sign in at claude.ai with the company Claude account (ask Abilash which email). Open Claude Design from the app — that's the whole setup. You describe pages in plain words; it designs them; you share a link.", },
  ],
  claudecode: [
    { t: "This one is technical — set it up WITH Deepu (10 min)", d: "Claude Code in the terminal needs Node.js installed first. Don't wrestle with it alone: sit with Deepu (or Abilash), who will run the installer with you and sign you in. If you'd rather self-serve, pick VS Code instead — same Claude, friendlier wrapping.", },
  ],
};

const day0Path = (tool: string): Step[] => [...(day0Tool[tool] ?? day0Tool.vscode), ...day0Common];

const deepuDay0: Step[] = [
  { warn: "Your GitHub account is YOURS — never share the password, never commit a secret or key to the repo.", t: "Accept the GitHub invite", d: "Check the email inbox tied to your GitHub account for an invite to the kairali-digital organisation (Abilash sends it — /guide/access shows him how). Click Accept. No invite? Ask him. Verify: github.com/kairali-digital opens and shows the repos.", },
  { t: "Install the basics (once)", d: "1) Node.js: nodejs.org → download the LTS installer → run it. 2) pnpm: open Terminal and paste the command below. 3) GitHub Desktop (the no-command way to clone/pull): desktop.github.com → install → sign in with your GitHub account.", copy: [ { label: "Install pnpm (paste in Terminal)", text: "npm install -g pnpm" } ], link: { href: "https://nodejs.org", label: "Download Node.js ↗" } },
  { t: "Get the factory on your machine", d: "GitHub Desktop → File → Clone repository → pick kairali-digital/kairali-web-factory → choose a folder → Clone. Then in Terminal, inside that folder, paste the command below (first time takes a few minutes).", copy: [ { label: "Install dependencies (Terminal, inside the repo folder)", text: "pnpm install" } ] },
  { t: "Install Claude Code + sign in", d: "Paste the install command in Terminal, then start it with the second command — it walks you through signing in with the company Claude account. From the repo folder, Claude Code auto-runs the session boot checks (boot-contract + doctor) on start.", copy: [ { label: "Install Claude Code (Terminal)", text: "npm install -g @anthropic-ai/claude-code" }, { label: "Start Claude Code", text: "claude" } ] },
  { t: "Now the pipeline one-time setup", d: "With your machine ready, do the 6-item pipeline setup (scaffolds, Novamira on staging, ledger, verify prompt) — it's your 'One-time setup' task in this wizard, and the Novamira install has its own 8-step guide.", link: { href: "/guide/deepu", label: "Open the Novamira install guide" } },
];

const TOOL_NAMES: Record<string, string> = {
  design: "Claude Design", vscode: "VS Code + Claude plugin", antigravity: "Antigravity", claudecode: "Claude Code",
};

const marketingPath = (task: string, tool: string): Step[] => {
  if (task === "day0") return day0Path(tool);
  if (task === "new-blog") {
    // Blogs are text-first: voice, then write — the tool is just where you type.
    const writeStep: Step = {
      t: `Write the post in ${TOOL_NAMES[tool] ?? "your tool"}`,
      warn: "Never invent a statistic, study, price, or date — write [NEEDS FACT]. And it must sound like the AUTHOR, not like AI.",
      d: tool === "design"
        ? "Claude Design is built for page layouts, not long text — for blogs, paste the voice block and this prompt into the chat and work on the words; the layout comes later in the pipeline."
        : "Open a new empty folder in your tool, paste the author voice block first (previous step), then this prompt. Preview, read it aloud once — does it sound like the author?",
      prompt: P_BLOG,
    };
    const voiceStep: Step = { warn: "Clinical / medical topic = a physician's voice AND Dr. Deepu John's sign-off. No exceptions, however small the post.", t: "Load the author voice FIRST", d: "Open the Voices page, copy the author's whole block (default: Abilash; food/lifestyle: Gita; clinical → a physician + doctor sign-off), and keep it ready to paste.", prompt: P_VOICE, link: { href: "/guide/voices", label: "Open the Voices page" } };
    return [stepKitting, voiceStep, writeStep, stepPublishReady, stepApprove, stepHandoff, stepTrack];
  }
  const create = task === "new-lp";
  const toolStep = buildToolSteps(create)[tool] ?? buildToolSteps(create).vscode;
  const goScience: Step[] = create ? [stepGoScience] : [];
  return [stepKitting, ...goScience, ...toolStep, stepPublishReady, stepApprove, stepHandoff, stepTrack];
};

const deepuPublish: Step[] = [
  { warn: "Incomplete Handoff Card = bounce WITHOUT import. Thirty seconds of \"fill lines X and Y\" beats laundering it through the machine.", t: "Pick up + verify the card", d: "Take the item from the sender's '2 — Ready for Deepu' folder. Incomplete Handoff Card = bounce WITHOUT import ('fill lines X and Y, re-drop'). No card = not a submission.", },
  { warn: "The gates only inspect pages under sites/ — skip the render and the machine checks NOTHING while looking green.", t: "Render it INTO the factory", d: "Every submission becomes a real page under sites/<domain>/ BEFORE the PR — the gates only inspect sites/. One paste in Claude Code:", prompt: P_RENDER },
  { warn: "Green CI never means a doctor approved anything — the medical checkpoint is yours, by hand, every time.", t: "Open the PR — the machine checks run", d: "Branch, commit, push, open the PR. CI runs everything: compliance (banned words + locked facts), banned-string (fabricated claims), content-lint (35 YMYL rules), cta-label, brand-lint, Lighthouse, the Playwright suite, front-gate, security review, gitleaks. Ask Claude to summarise the CI report into DEV-FIX vs BOUNCE items.", link: { href: "/guide/workbook", label: "Full gate table — Workbook Part 4" } },
  { warn: "NEVER rewrite a fact, claim, price, or date yourself — those words belong to marketing and the doctor. Bounce them.", t: "Fix or bounce", d: "Dev things (tokens, paths, config, banned word in a URL) → fix on the branch. Content things (any fact, claim, visible banned word, price, date) → BOUNCE with a plain-English list + drop NEEDS-FIX-❌.txt in the item's folder + set the Tracker cell. Keep the branch open. Two bounces = third time you pair with the author (Deepu-solo).", },
  { warn: "SNAPSHOT FIRST — no backup, no publish. And a HUMAN clicks Publish. Never the agent, never on production via Novamira.", t: "Publish — WordPress route (Novamira) or Vercel route", d: "WordPress: the snapshot-first publish prompt below (backup is inside the prompt — the only way to skip it is to not publish), then staging eyeball → verify the doctor's saved reply exists if medical → write the ledger row → snapshot the live page again → YOU click Publish. Vercel: an approver merges the green PR; confirm production loads.", prompt: P_WP_PUBLISH },
  { warn: "No CHECKED-\u2705.txt in the folder = not checked, whatever anyone remembers. The marker is the only proof.", t: "Stamp + close the loop", d: "Drop CHECKED-✅.txt (date, PR#, gates green, sign-off line, live URL) in the item's folder → move it to '3 — Published' → update the Tracker + content/ledger.yaml → the delegation task closes with the live URL as proof. No marker = not checked.", },
];

const PATHS: Record<string, { label: string; tasks: { key: string; label: string; tools?: boolean; steps?: Step[] }[] }> = {
  marketing: {
    label: "Marketing (Vikash · Anupam · Astha · Rohan · Gaurav · Eeshal)",
    tasks: [
      { key: "day0", label: "Day 0 — set me up (first time here)", tools: true },
      { key: "new-lp", label: "Create a NEW landing page", tools: true },
      { key: "update", label: "UPDATE an existing page", tools: true },
      { key: "new-blog", label: "Write a NEW blog post", tools: true },
    ],
  },
  roshni: {
    label: "Content — Roshni (fast blog flow)",
    tasks: [
      { key: "day0", label: "Day 0 — set me up (first time here)", tools: true },
      {
        key: "blog",
        label: "Ship blogs at pace (single or batch)",
        steps: [
          stepKitting,
          { t: "Voice first, always", d: "Open the Voices page, copy the author block (clinical topic → a physician + doctor sign-off; food/lifestyle → Gita; brand news → your own voice; else → Abilash).", prompt: P_VOICE, link: { href: "/guide/voices", label: "Open the Voices page" } },
          { t: "Write fast, finish properly", d: "Draft in your tool (VS Code + Claude plugin is great for cadence), then the publish-ready paste. Never invent a statistic, study, or date — that's where fast blogs slip.", prompt: P_PUBLISH_READY },
          stepApprove,
          { warn: "Speed never skips safety — every post in the batch passes the same machine checks and the same doctor gate.", t: "Batch the handoff", d: "Drop several finished posts into '2 — Ready for Deepu' together, one Handoff Card each, one message to Deepu. One PR can carry the batch — and one red post never holds the rest hostage (Deepu severs it).", prompt: HANDOFF },
          stepTrack,
        ],
      },
    ],
  },
  abilash: {
    label: "Abilash (review · approve · Express Lane)",
    tasks: [
      {
        key: "express",
        label: "Express Lane — push reviewed work as a PR myself",
        steps: [
          { warn: "The Express Lane skips the QUEUE, never the REVIEW. Doctor sign-off saved BEFORE the push.", t: "Only push REVIEWED work", d: "The 4-question gut check passed and any medical claim already has the doctor's saved reply in the item's Drive folder. The Express Lane skips the queue, never the review.", },
          { warn: "Do NOT merge the PR — not you-in-a-hurry, not Claude, ever. Merging is the reviewed, deliberate last click.", t: "One paste in Claude Code (in the factory folder)", d: "Open Terminal, paste the first block to get into the factory and start Claude, then paste the big prompt.", copy: [ { label: "Open the factory + start Claude (Terminal)", text: "cd ~/Claude/Kairali-Digital/kairali-web-factory\nclaude" } ], prompt: P_EXPRESS },
          { t: "Preview → confirm → hand to Deepu", d: "Open the Vercel preview link, one look (words, facts, phone view). Paste the preview back to whoever built it. Add the Tracker row. Message Deepu: 'PR #N is green-pending, over to you.' He merges/publishes exactly as always — WordPress targets still go via his Novamira publish prompt with the snapshot backup, version control (the PR) and rollback (the Undo Book) unchanged.", link: { href: "/guide/deepu", label: "Deepu's publish + undo book" } },
        ],
      },
      {
        key: "approvals",
        label: "My approval windows & what I check",
        steps: [
          { warn: "Approve WITH evidence — your approving reply (screenshot) goes into the item's folder, same rule as the doctor's.", t: "Two windows a day (~12:00 and ~17:00)", d: "Everything batches to these. One-word approvals from the phone are fine — the evidence (screenshot of your reply) goes into the item's folder.", },
          { t: "What you're actually approving", d: "Facts real (vs the FACTS doc) · right words for the site · looks right on a phone · kitting matches what got built · medical claims carry the doctor's reply. The machine catches the rest at Deepu's stage.", },
        ],
      },
    ],
  },
  deepu: {
    label: "Deepu (developer — import · check · publish · undo)",
    tasks: [
      { key: "day0", label: "Day 0 — set up my machine (first time)", steps: deepuDay0 },
      { key: "publish", label: "Publish an item (the full chain)", steps: deepuPublish },
      {
        key: "setup",
        label: "One-time setup + install Novamira",
        steps: [
          { warn: "Until the scaffolds exist, KTAHV and blog items are HELD — never published \"just this once\" around the gates.", t: "The 6-item one-time setup", d: "Scaffold sites/ayurvedichealingvillage.com (entity ktahv) + signed approvals.yaml · scaffold sites/whyayurveda.org content home · install Novamira on WP STAGING · create content/ledger.yaml · bookmark the Drive folder + Tracker · run the verify prompt below and record PASS in the Tracker. Until #1–2 exist, KTAHV/blog items are HELD — never published around the gates.", copy: [ { label: "The verify prompt (paste into Claude Code when done)", text: "Verify one-time setup: confirm sites/ayurvedichealingvillage.com/site.config.json says entity ktahv; sites/whyayurveda.org exists; launches/ayurvedichealingvillage.com/approvals.yaml exists with signed rows; content/ledger.yaml parses; then ask Novamira to list installed plugins on staging. Report PASS/FAIL per item." } ], link: { href: "/guide/workbook", label: "Workbook Part 4 — the exact list" } },
          { warn: "Novamira on STAGING only, ever. Active on a live site = an incident: deactivate first, explain second.", t: "Novamira: 8 steps, settings, smoke test", d: "The full nothing-assumed install guide — download from novamira.ai only, AI Abilities on only while working, editable-Gutenberg mode NEVER the locked PHP mode, staging only, ever.", link: { href: "/guide/deepu", label: "Open the install guide" } },
        ],
      },
      {
        key: "undo",
        label: "Something's wrong — roll back / restore",
        steps: [
          { warn: "Emergency? Take it OFF the internet first (Instant Rollback / Switch to draft), undo calmly second. And NEVER fix silently — every rollback gets a ledger note + a message to Abilash.", t: "Which undo do I need?", d: "Factory page wrong → revert the PR (Recipe 1). Factory site broken NOW → Vercel Instant Rollback (Recipe 2), then still revert. One file → git restore (Recipe 3). WordPress bad edit → Gutenberg Revisions (Recipe 4). Must come DOWN now → Switch to draft with your own hand (Recipe 5). Revisions can't help → rebuild from the backups/ snapshot (Recipe 6). EVERY undo ends with Recipe 7: ledger note + message Abilash. Never fix silently.", copy: [ { label: "Can't remember the PR number? (Terminal)", text: "gh pr list --state merged --limit 10" } ], link: { href: "/guide/deepu", label: "Open the full Undo Book (Recipes 1–7)" } },
        ],
      },
      {
        key: "solo",
        label: "Deepu-Solo — marketing gave me something rough",
        steps: [
          { warn: "A WhatsApp message is not a pipeline state — folder + Tracker row BEFORE you touch the work.", t: "Intake first, work second", d: "Create the item's folder in the sender's '2 — Ready for Deepu' (or your Inbox) + a Tracker row. A WhatsApp message is not a pipeline state.", },
          { t: "Run their steps, then yours", d: "Build/recreate the page in Claude Code, run the publish-ready paste, apply the voice for blogs — then your normal import → checks → publish chain. Nothing about the checks changes. First few times, do it on screen in front of Abilash/the team: the demo IS the training.", },
        ],
      },
    ],
  },
};

// ---- UI -------------------------------------------------------------------
function Copy({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const flash = () => { setOk(true); setTimeout(() => setOk(false), 1400); };
  const fallback = () => {
    // Older/locked-down browsers: temporary textarea + execCommand still works.
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); flash(); } finally { document.body.removeChild(ta); }
  };
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text).then(flash).catch(fallback) ?? fallback(); }}
      style={{ position: "absolute", top: 10, right: 10, background: MARIGOLD, color: "#3A2E0A", border: "none", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 6, cursor: "pointer", letterSpacing: ".05em" }}
    >
      {ok ? "Copied ✓" : "Copy"}
    </button>
  );
}

const chip = (active: boolean) => ({
  display: "inline-block", padding: "10px 16px", margin: "0 8px 8px 0", borderRadius: 10, cursor: "pointer",
  border: `1.5px solid ${active ? FOREST : LINE}`, background: active ? FOREST : "#fff", color: active ? "#EAF3EA" : INK,
  fontWeight: 600, fontSize: 14.5, fontFamily: "inherit",
}) as const;


// One step at a time — baby steps. A big card, a big Next button, nothing else
// to think about. "Show all" exists for people who want the overview.
function StepWalker({ steps }: { steps: Step[] }) {
  const [idx, setIdx] = useState(0);
  const [all, setAll] = useState(false);
  const last = idx === steps.length - 1;

  const Card = ({ s, i }: { s: Step; i: number }) => (
    <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "18px 22px", margin: "14px 0" }}>
      <p style={{ fontWeight: 800, margin: 0, fontSize: 17 }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: FOREST, color: "#EAF3EA", fontSize: 14, marginRight: 10 }}>{i + 1}</span>
        {s.t}
      </p>
      <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.65 }}>{s.d}</p>
      {s.warn && (
        <div style={{ marginTop: 10, background: "#FBE9E7", border: "1px solid #E8B4AC", borderLeft: "5px solid #B3261E", borderRadius: 10, padding: "10px 14px" }}>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "#7A1F16", fontWeight: 700 }}>⚠️ DON'T MISS: <span style={{ fontWeight: 700 }}>{s.warn}</span></p>
        </div>
      )}
      {s.link && <p style={{ margin: "10px 0 0" }}><a href={s.link.href} style={{ color: FOREST, fontWeight: 600 }}>{s.link.label}</a></p>}
      {s.copy?.map((c, j) => (
        <div key={j} style={{ marginTop: 10 }}>
          <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#6B6350", textTransform: "uppercase", letterSpacing: ".04em" }}>{c.label}</p>
          <div style={{ position: "relative" }}>
            <pre style={{ background: "#1f2724", color: "#e9ede9", borderRadius: 10, padding: "12px 90px 12px 14px", overflowX: "auto", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap", margin: 0 }}>{c.text}</pre>
            <Copy text={c.text} />
          </div>
        </div>
      ))}
      {s.prompt && (
        <div style={{ position: "relative", marginTop: 12 }}>
          <pre style={{ background: "#1f2724", color: "#e9ede9", borderRadius: 12, padding: "16px 18px", overflowX: "auto", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>{s.prompt}</pre>
          <Copy text={s.prompt} />
        </div>
      )}
    </div>
  );

  const finish = (
    <div style={{ background: "#DBE2C1", border: "1px solid #C4D4A2", borderRadius: 14, padding: "14px 20px", marginTop: 18, fontSize: 15 }}>
      <b>✅ The finish line:</b> a live URL, a CHECKED-✅ note in the item's folder, the Tracker row filled, and the delegation task closed with the link as proof. Stuck? The <a href="/guide/workbook" style={{ color: FOREST }}>Workbook troubleshooting table</a> says who to ping.
    </div>
  );

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${LINE}`, paddingTop: 18, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: 22, margin: 0 }}>{all ? `Your path — all ${steps.length} steps` : `Step ${idx + 1} of ${steps.length}`}</h2>
        <button type="button" onClick={() => setAll(!all)} style={{ background: "none", border: `1px solid ${LINE}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, color: "#6B6350", fontFamily: "inherit" }}>
          {all ? "One step at a time" : "Show all steps"}
        </button>
      </div>

      {!all && (
        <div style={{ display: "flex", gap: 6, margin: "12px 0 0" }}>
          {steps.map((_, i) => (
            <span key={i} onClick={() => setIdx(i)} style={{ width: 26, height: 8, borderRadius: 4, cursor: "pointer", background: i < idx ? "#8BB275" : i === idx ? FOREST : LINE }} />
          ))}
        </div>
      )}

      {all ? (
        <>{steps.map((s, i) => <Card key={i} s={s} i={i} />)}{finish}</>
      ) : (
        <>
          <Card s={steps[idx]} i={idx} />
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {idx > 0 && (
              <button type="button" onClick={() => setIdx(idx - 1)} style={{ background: "#fff", border: `1.5px solid ${LINE}`, borderRadius: 10, padding: "12px 22px", cursor: "pointer", fontWeight: 700, fontSize: 15, fontFamily: "inherit", color: INK }}>
                ← Back
              </button>
            )}
            {!last && (
              <button type="button" onClick={() => setIdx(idx + 1)} style={{ background: FOREST, color: "#EAF3EA", border: "none", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontWeight: 800, fontSize: 15, fontFamily: "inherit" }}>
                Done — next step →
              </button>
            )}
          </div>
          {last && finish}
        </>
      )}
    </section>
  );
}

export default function Playbook() {
  const [role, setRole] = useState<string | null>(null);
  const [task, setTask] = useState<string | null>(null);
  const [tool, setTool] = useState<string | null>(null);

  const roleDef = role ? PATHS[role] : null;
  const taskDef = roleDef && task ? roleDef.tasks.find((x) => x.key === task) : null;
  const needsTool = !!taskDef?.tools;
  const steps: Step[] | null = taskDef ? (taskDef.steps ?? (needsTool && tool ? marketingPath(task!, tool) : null)) : null;

  return (
    <main style={{ background: IVORY, minHeight: "100vh", color: INK, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 24px 100px" }}>
        <p style={{ letterSpacing: ".16em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "#6B6350", margin: 0 }}>Kairali Web Factory</p>
        <h1 style={{ fontSize: 32, margin: "6px 0 2px", letterSpacing: "-.5px" }}>The Playbook</h1>
        <p style={{ color: "#6B6350", marginTop: 4 }}>
          Answer the questions. Get your exact path to a live page. Nothing to memorise.{" "}
          <a href="/guide/access" style={{ color: FOREST }}>New here? Start with Access &amp; Day 0 →</a>
        </p>

        <div style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "18px 22px", margin: "22px 0" }}>
          <p style={{ fontWeight: 800, margin: "0 0 10px" }}>1 · Who are you?</p>
          {Object.entries(PATHS).map(([k, v]) => (
            <button key={k} type="button" style={chip(role === k)} onClick={() => { setRole(k); setTask(null); setTool(null); }}>{v.label}</button>
          ))}
          {roleDef && (<>
            <p style={{ fontWeight: 800, margin: "16px 0 10px" }}>2 · What are you doing today?</p>
            {roleDef.tasks.map((t) => (
              <button key={t.key} type="button" style={chip(task === t.key)} onClick={() => { setTask(t.key); setTool(null); }}>{t.label}</button>
            ))}
          </>)}
          {needsTool && (<>
            <p style={{ fontWeight: 800, margin: "16px 0 10px" }}>3 · Which tool are you building with?</p>
            {[["vscode", "VS Code + Claude plugin ⭐ (recommended)"], ["design", "Claude Design"], ["antigravity", "Antigravity"], ["claudecode", "Claude Code (terminal)"]].map(([k, l]) => (
              <button key={k} type="button" style={chip(tool === k)} onClick={() => setTool(k)}>{l}</button>
            ))}
          </>)}
        </div>

        {steps && <StepWalker key={`${role}/${task}/${tool}`} steps={steps} />}

        <section style={{ marginTop: 40, borderTop: `1px solid ${LINE}`, paddingTop: 18 }}>
          <h2 style={{ fontSize: 20 }}>The full guides (when you want the detail)</h2>
          <ul style={{ lineHeight: 2, fontSize: 15 }}>
            <li><a href="/guide/access" style={{ color: FOREST, fontWeight: 600 }}>Access &amp; Day 0</a> — accounts, permissions, the image bank &amp; brand docs, the delegation system</li>
            <li><a href="/guide/workbook" style={{ color: FOREST, fontWeight: 600 }}>The complete Workbook</a> — every rule, every prompt, troubleshooting, the Reference Library</li>
            <li><a href="/guide/voices" style={{ color: FOREST, fontWeight: 600 }}>Author Voices</a> — the 10 blog voices</li>
            <li><a href="/guide/deepu" style={{ color: FOREST, fontWeight: 600 }}>For Deepu</a> — Novamira install + the Rollback &amp; Backup Undo Book</li>
            <li><a href="https://www.youtube.com/watch?v=Gt8tT-xf6g4" style={{ color: FOREST, fontWeight: 600 }}>The origin video</a> — watch once in your first week</li>
            <li><a href="/" style={{ color: FOREST, fontWeight: 600 }}>Fleet Pulse</a> — the live status dashboard</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
