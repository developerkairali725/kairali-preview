# KAIRALI — FOR DEEPU: PUBLISHING, NOVAMIRA & THE UNDO BOOK
## Companion to the Team Workbook (Part 4). Developer-facing, nothing assumed.

> **ℹ️ Read order for your first week:** (1) Workbook Part 4 (the pipeline), (2) Novamira install below, (3) the Undo Book below — then run the one-time setup and do the first publish as a demo in front of Abilash.

---

## INSTALLING NOVAMIRA — STEP BY STEP, NOTHING ASSUMED

> **This section is Deepu's only.** Marketing never installs anything, never sees WP admin. This is One-time Setup item #3 from Part 4 — do it once per staging site.

> **✅ THE HONEST VERDICT — was Novamira the right pick? (4 lines)**
> **Yes — for THIS role.** Our research compared the options, and for the Deepu-only, admin-level, staging-first job — importing pages as **editable Gutenberg blocks** — Novamira is the tool.
> The caveats the research found are real: it is **admin-only and all-or-nothing**, and it does **not** block itself on production — its own docs say staging is *"a recommendation, not enforced."*
> Those caveats are solved by **our architecture** — staging-only, full backup first, you supervising every session — **not by the plugin**. Never rely on Novamira to protect a live site. It won't.
> **Optional hardening later:** add **Block MCP** as a limited Editor account for everyday content edits (Track B in `wordpress-gutenberg-setup.md`), so admin power comes out only for big jobs.

---

### STEP 0 — Prerequisites (tick all four before touching anything)

| # | Check | How you know it's true |
|---|---|---|
| 1 | **A staging copy of the site exists** | The URL is a staging URL. Not the live domain. Look at the address bar and say it out loud. |
| 2 | **A full backup was taken today** | Host-level backup of files + database, dated today. Not last week's. |
| 3 | **Claude Code is installed** | Needs Node.js 18+. You can run `claude` from the site's project folder. |
| 4 | **You have WP admin login for the STAGING site** | You can reach `/wp-admin` on the staging URL right now. |

> **ℹ️ Backups, two layers.** The full backup above is the install-time safety net. Later, at publish time, per-page snapshots come from `scripts/wp-snapshot.mjs` — it fetches the page and saves timestamped HTML into `backups/<domain>/` before every WordPress publish, automatically as part of the publish prompt. Different jobs; you need both.

> **⚠️ If any box is unticked, stop.** Novamira has no rollback of its own changes. The backup and the staging copy ARE the rollback.

---

### THE INSTALL — 8 numbered steps, exactly what to click

**1. Download the plugin — from ONE place only.**
Go to **novamira.ai/download** and download the ZIP. (The source code lives on GitHub at `use-novamira/novamira` if you want to read it.)

> **⚠️ Novamira is NOT on wordpress.org.** If you find something with that name in the WordPress plugin directory, it is not this plugin. Do not install it. Official download only.

**2. Upload it.**
Staging WP admin → **Plugins → Add New → Upload Plugin → Choose File** → pick the ZIP → **Install Now** → **Activate**.

**3. Turn on "AI Abilities".**
Left sidebar → **Novamira → Configuration** → enable **"AI Abilities"**. It is **off by default** and asks for explicit confirmation.

> **⚠️ Read that confirmation before clicking.** This is the moment you hand an AI admin-level power over this site. That is fine on staging with a backup. It is never fine on production.

**4. Create an Application Password.**
**Users → Profile → scroll to Application Passwords** → type a descriptive name (see the settings table below) → **Add New Application Password** → **copy the generated password now**. WordPress shows it once and never again.

> **⚠️ No "Application Passwords" section on your Profile?** A security plugin (Wordfence is the usual suspect) is blocking the feature. Open that plugin's settings, re-enable application passwords, then come back and create it.

**5. Connect Claude Code.**
**Novamira → Configuration → "Copy prompt"** — this copies a setup prompt to your clipboard.

**6. Paste it into Claude Code.**
Open the terminal in the site's project folder, run `claude`, paste the prompt. Claude Code writes its own `.mcp.json` — you do not edit config files by hand. (OAuth sign-in exists as a newer alternative; the copy-prompt path is the one we use.)

**7. Verify the connection.**

> **PROMPT BOX — paste into Claude Code once:**
> ```
> Check the Novamira connection and list installed plugins.
> ```

If Claude answers with the real plugin list from the staging site, the connection is live.

**8. Do the smoke test below. Then turn AI Abilities OFF until the first real job.**

---

### THE SETTINGS THAT MATTER

| Setting | What to set | Why |
|---|---|---|
| **AI Abilities** | **ON only while actively working. OFF the moment you stop.** | It is all-or-nothing admin power. Off = the plugin is inert. There is no half-open. |
| **Which site it points at** | **The staging URL. Only. Ever.** | The plugin does not enforce staging — *we* do. Pointing it at production breaks HARD GATE 1. |
| **Import / build mode** | **Editable Gutenberg blocks — NEVER the "pixel-perfect PHP page" mode.** | The PHP-page mode is locked forever; nobody can ever edit it in the editor again. Editable blocks + Gutenberg revisions = every change restorable. |
| **Application Password name** | Descriptive: `Claude Code – staging – Deepu` | So "Last Used" means something and you know exactly what to revoke. One password per person/machine. |
| **Idle app passwords** | **Revoke them.** Users → Profile → Application Passwords → Revoke. | A live credential nobody is using is pure risk. Check "Last Used" when in doubt. |
| **Leaving it running** | **Never.** Session ends = AI Abilities off. | Novamira's `execute-php` bypasses its own safety sandbox. Not a thing to leave plugged in overnight. |
| **Production** | **Never point Novamira at a live site. No exceptions.** | It has no rollback of its own changes and no production block. Staging + backup is the only protection that exists. |

---

### ✅ SMOKE TEST — prove it works, 5 minutes, do it right now

> **PROMPT BOX — paste into Claude Code once:**
> ```
> Using Novamira, create ONE dummy page on the STAGING site titled
> "NOVAMIRA SMOKE TEST — DELETE ME", as EDITABLE Gutenberg blocks:
> one heading, one paragraph, one button. Save as DRAFT only.
> Do NOT publish. Give me the edit link.
> ```

1. Open the page in Gutenberg (staging WP admin → **Pages** → find "NOVAMIRA SMOKE TEST — DELETE ME" → **Edit**).
2. Click the heading. **Can you type in it?** Click the paragraph. **Can you edit it?** Open the list view — do you see separate, normal blocks (Heading, Paragraph, Buttons)?
3. **All editable = pass.** One giant locked block you can't click into = fail — wrong mode; see troubleshooting.
4. Delete the dummy page: **Pages → hover the title → Trash.**
5. **Novamira → Configuration → AI Abilities → OFF.**

> **✅ Passed all five? Setup is done and safe.** The publish flow that uses this lives in Part 4, Stage 4, Route A — Novamira imports the green-lit page to staging as editable blocks, you eyeball it, and *you* click Publish. A human makes it live, always.

---

### TROUBLESHOOTING

| Symptom | What it means | What to do |
|---|---|---|
| No "Application Passwords" section under Users → Profile | A security plugin (e.g. Wordfence) is blocking the feature | Re-enable application passwords in that plugin's settings, then create the password |
| Connection check fails / Claude can't see the site | Stale or broken `.mcp.json` config | **Novamira → Configuration → "Copy prompt"** again → paste into Claude Code fresh — it rewrites its own config. Then re-run the verify prompt |
| Imported page opens as one locked block — nothing is clickable or editable | Wrong mode: the "pixel-perfect PHP page" path was used | Delete that page. Redo the import telling Claude explicitly: **editable Gutenberg blocks**. The locked mode can never be converted back — rebuild, don't rescue |

---

## ROLLBACK & BACKUP — DEEPU'S UNDO BOOK

> **This section is Deepu's only.** Marketing never rolls anything back. If marketing spots something wrong on a live page, they message you — the undo is yours.

### WHY this section exists (read once)

The machine checks catch ~99% of problems **before** publish. Rollback exists for everything else — and "everything else" is almost always a **human** slip in a long chain: the wrong page imported, an old draft published over a new one, a good-looking change that broke something nobody predicted. **Humans make more mistakes than the machine in a complex chain.** So the undo path must be **one paste, not archaeology**. Every recipe below is exactly that: you paste one prompt (or click one button), and the old version is back. No digging, no guessing, no "I think it was Tuesday's version."

Two facts make this possible — keep them in your head:

> **ℹ️ Fact 1 — for factory sites, GIT IS THE BACKUP.** Every change is a commit with a second-precision timestamp (`git log --format=%ci`). There is no separate backup system to maintain, because the history *is* the backup. Any file, any page, any moment — restorable.

> **ℹ️ Fact 2 — for WordPress, the backup is two layers.** Gutenberg keeps a restorable **revision** for every edit, and (Section C below) the machine saves a **pre-publish snapshot** into `backups/` before every publish — automatically, baked into the publish prompt itself. You never have to remember it.

> **⚠️ THE ONE RULE — never fix silently.** Every rollback, however small, gets **(a)** a note in the item's `content/ledger.yaml` row and **(b)** a message to Abilash. No exceptions, no "it was tiny." A silent fix hides the lesson; a logged fix teaches the whole pipeline. The paper-trail recipe (Recipe 7) closes **every** other recipe in this section.

---

### 🧭 WHICH UNDO DO I NEED? (start here)

| Symptom | Use |
|---|---|
| **Factory (Vercel) page** — a merged PR was wrong; the whole change must go | **Recipe 1** — revert the PR |
| **Factory site is broken RIGHT NOW** — seconds matter, fix the live site first, think later | **Recipe 2** — Vercel instant rollback (then Recipe 1) |
| **Factory page** — only ONE file went bad; the rest of the merge is fine | **Recipe 3** — restore one file from history |
| **WordPress page** — yesterday's version was fine; today's edit broke it | **Recipe 4** — Gutenberg Revisions |
| **WordPress page must come DOWN NOW** — wrong medical claim, wrong price, legal risk | **Recipe 5** — unpublish to draft (then fix via the pipeline) |
| **WordPress page** — Revisions can't help (import scrambled it / history unusable) | **Recipe 6** — restore from the `backups/` snapshot |
| Not sure which | Take it off the internet first (**Recipe 2** for factory, **Recipe 5** for WordPress), then undo calmly |

> **✅ After ANY recipe → Recipe 7 (the paper trail).** Always. That is the One Rule.

---

### SECTION A — FACTORY / VERCEL PAGES (git is the backup)

#### Recipe 1 — Undo a whole merged PR (git revert, via a new PR)

**When:** a PR merged to `main`, Vercel deployed it to production, and the whole change was a mistake.

1. Find the PR number. If you don't remember it, run in the repo:
   ```
   gh pr list --state merged --limit 10
   ```
2. Paste this into Claude Code:

   > **PROMPT BOX — "Revert a merged PR"**
   > ```
   > PR #[number] was merged but must be undone.
   >
   > 1. git fetch origin, then create a new branch from origin/main.
   > 2. Find the commit that PR put on main
   >    (git log --format='%h %ci %s' origin/main — the timestamps are
   >    second-precision; match them to the PR's merge time from gh pr view [number]).
   > 3. git revert that commit (use -m 1 only if it is a true merge commit).
   >    Change NOTHING else — no cleanups, no improvements, a pure revert.
   > 4. Push the branch and open a PR titled "Revert #[number]: [one-line reason]".
   >    If you ever need to re-push, --force-with-lease only.
   > 5. Show me the diff and the PR link. Do NOT merge — merging is not yours.
   > ```

3. The revert PR runs through **the same CI gates as everything else**. That is a feature, not friction — even the undo gets checked.
4. An **approver merges** it (main is branch-protected; you and the agent cannot). Vercel auto-builds production on merge.
5. Open the production URL and confirm the old version is back.
6. **Recipe 7.**

> **⚠️ Site actively broken while the revert PR waits for review?** Do Recipe 2 first — it fixes the live site in seconds — then land this revert calmly. Never skip the revert just because the rollback "fixed it" (see the warning in Recipe 2).

#### Recipe 2 — Vercel instant rollback (the fastest fix on Earth)

**When:** the factory site is wrong or broken **right now** and every minute is a minute of visitors seeing it.

1. Open **vercel.com** → the site's project → **Deployments**.
2. Find the previous **Production** deployment — the one just *before* the bad one. The timestamps make this unambiguous.
3. Open its **⋯ menu → Instant Rollback** → confirm.
4. Reload the production URL. The old version is live within seconds.
5. **Recipe 7.**

> **⚠️ Rollback fixes the LIVE SITE, not the CODE.** `main` still contains the bad change. If you stop here, the **very next merge re-ships the bug**. An instant rollback must always be followed by Recipe 1 (revert the PR) or a proper fix-forward PR. Rollback buys time; it is never the fix.

#### Recipe 3 — Restore ONE file from history

**When:** the merge was mostly fine, but one file (one page, one component) went bad — you want *that file* back at an earlier state, without touching the rest.

1. Find the right commit **fast** — this is the one-liner that makes it archaeology-free:
   ```
   git log --format='%h %ci %s' -- sites/[domain]/[path-to-file]
   ```
   Every line is `short-hash · timestamp-to-the-second · message`, newest first, **only for that file**. Pick the last commit where the file was good — the second-precision timestamps mean "the state at 14:32:07, before the 14:35 merge" is a fact, not a guess.
2. Paste this into Claude Code:

   > **PROMPT BOX — "Restore one file from history"**
   > ```
   > One file must go back to an earlier version. Everything else stays as it is.
   >
   > File:   sites/[domain]/[path-to-file]
   > Run:    git log --format='%h %ci %s' -- [that path]
   > and show me the list. I will pick the commit — or if I already know it,
   > it is [short-hash].
   >
   > Then:
   > 1. Create a new branch from origin/main.
   > 2. git checkout [commit] -- [path]   (restore ONLY that file).
   > 3. Commit with message "Restore [file] to [short-hash] ([reason])",
   >    push, open a PR. --force-with-lease only, ever.
   > 4. Show me the diff and the PR link. Do NOT merge.
   > ```

3. CI runs, an approver merges, Vercel deploys. Confirm the page on production.
4. **Recipe 7.**

> **✅ Checkpoint for Section A:** the undo went through a PR · CI was green · an approver merged it · production shows the old version · ledger note + Abilash message done. You never pushed to `main` directly, never force-pushed, never merged your own PR — the undo obeys the same laws as the do.

---

### SECTION B — WORDPRESS PAGES

#### Recipe 4 — Gutenberg Revisions (the normal WordPress undo)

**When:** a WordPress page or post was edited and the earlier version was better.

1. WP admin → **Pages** (or Posts) → open the page in the editor.
2. In the settings sidebar, click **Revisions**.
3. Drag the slider left until the compare view shows the version you want. The changes are highlighted side-by-side — read them, don't assume.
4. Click **Restore This Revision**.
5. Click **Update**. The old version is live.
6. **Recipe 7.**

> **ℹ️ You cannot lose anything here.** Restoring a revision creates a *new* revision — even the bad version stays in history. Revisions are the reason we always publish in the editable-Gutenberg mode and never the locked "pixel-perfect PHP page" mode: locked pages have nothing to slide back to.

#### Recipe 5 — Unpublish to draft (it must come down NOW)

**When:** a live WordPress page is dangerous — an unsigned medical claim, a wrong price, anything with legal exposure. Getting it *off the internet* beats getting it *right*.

1. WP admin → open the page in the editor.
2. Top bar → **Switch to draft** → confirm.
3. Reload the public URL and confirm the page is no longer served.
4. Fix the content **through the normal pipeline** (marketing fix → gates → your one review), then republish. Never patch it live "just this once."
5. **Recipe 7** — and for this recipe the Abilash message is **immediate**, not end-of-day.

> **⚠️ This click is YOURS and only yours.** The agent is never allowed to unpublish, delete, or change the status of any page or post — that is a hard gate. Do not paste a prompt for this. Log in, click Switch to draft, with your own hand. Thirty seconds, human, done.

#### Recipe 6 — Restore from the pre-publish snapshot in `backups/`

**When:** Revisions can't save you — the import scrambled the block tree, the history is unusable, or you need the page *exactly* as it was before the last publish.

1. Every publish saved a snapshot first (Section C explains how). Find it:
   ```
   ls backups/[domain]/
   ```
   Files look like `[page]--YYYY-MM-DDTHH-MM-SS.html` — IST, to the second. Pick the newest one **from before** the bad publish. The timestamp tells you; no guessing.
2. Paste this into Claude Code:

   > **PROMPT BOX — "Rebuild a WordPress page from its snapshot"**
   > ```
   > The live WordPress page [URL] is wrong and Gutenberg Revisions cannot fix it.
   >
   > Open backups/[domain]/[page]--[timestamp].html — that file is the page
   > exactly as it was before the publish.
   >
   > Using Novamira, rebuild the page from that snapshot as EDITABLE Gutenberg
   > blocks, on STAGING, as a DRAFT only. Do NOT publish. Do NOT change any
   > wording, fact, price, or claim — the snapshot is the truth, reproduce it.
   > Give me the staging preview URL.
   > ```

3. Open the staging preview. Compare it against the snapshot file in your browser. Same page? Good.
4. **You** click Publish. A human makes it live — same as always.
5. **Recipe 7.**

> **ℹ️ Snapshot deleted or overwritten? It can't be.** Every snapshot has a to-the-second filename (two can never collide), and `backups/` is committed — so every snapshot ever taken also lives in git history forever. Worst case, Recipe 3 recovers the snapshot file itself.

---

### SECTION C — THE AUTOMATIC BACKUP RULE (the machine remembers so you don't)

Here is the design decision that makes Recipe 6 always work: **the backup is not a habit, it is a step inside the publish prompt.** Humans forget habits — especially on the fifth publish of a busy day. So the snapshot runs *inside* the same paste that does the publishing. The only way to skip the backup is to not publish at all.

**The rule:** before **every** WordPress publish, `scripts/wp-snapshot.mjs` fetches the live page and saves a timestamped copy. It is baked into the publish prompt — this is the **only** publish prompt you use from now on (it replaces the Stage 4 Route A box):

> **PROMPT BOX — "Publish to WordPress staging via Novamira — WITH SNAPSHOT" (the only WordPress publish prompt)**
> ```
> The PR for [page] is green and the manual medical checkpoint passed.
>
> STEP 1 — SNAPSHOT FIRST (never skip, never reorder):
> Run: node scripts/wp-snapshot.mjs [full live page URL]
> It saves the current live page to
>   backups/[domain]/[page]--YYYY-MM-DDTHH-MM-SS.html
> Show me the exact saved file path, then commit the new file in backups/
> on the current branch so the snapshot also lands in git history.
> If the page does not exist live yet (a brand-new page), say so and
> continue — there is nothing to snapshot on a first publish.
>
> STEP 2 — THEN IMPORT:
> Using Novamira, import the page into [target-site] as EDITABLE WordPress
> blocks, into STAGING / DRAFT only. Do NOT publish live.
> Give me the staging preview URL.
> ```

Then, as always: open the staging URL, do your one human review, and click **Publish** yourself.

**How the snapshot name works — learn to read it once:**

```
backups/ayurvedichealingvillage.com/weight-loss--2026-07-18T14-32-07.html
        └────────── domain ───────┘ └── page ──┘ └── IST, to the second ──┘
```

1. **`[domain]`** — which site. One folder per site, nothing ever mixed.
2. **`[page]`** — which page (the slug).
3. **`YYYY-MM-DDTHH-MM-SS`** — when, in **IST, to the second**. Two publishes on the same day can never collide, and the timestamp lines up with git's own second-precision commit stamps (`git log --format=%ci`) — so "which snapshot came before which commit" is always a fact you read, never a mystery you reconstruct.
4. **`backups/` is committed.** Every snapshot doubles into git history. Two independent copies of every pre-publish state, forever, for free.

> **✅ What this buys you:** every WordPress page now has the same guarantee factory pages get from git — a known-good copy of the moment before every change, findable in one `ls`, restorable in one paste (Recipe 6). Nobody remembered anything. The machine did.

> **⚠️ If you ever catch yourself pasting a publish prompt WITHOUT Step 1 in it, stop.** That prompt is outdated — the snapshot step is not optional garnish, it is the backup system. Fix the prompt, then publish.

---

### Recipe 7 — THE PAPER TRAIL (closes every rollback, no exceptions)

**When:** always. After Recipes 1 through 6, every single time.

1. Paste this into Claude Code:

   > **PROMPT BOX — "Log the rollback in the ledger"**
   > ```
   > Open content/ledger.yaml and find the row for [page/item].
   > Append to its notes: field:
   >   "ROLLBACK [YYYY-MM-DD HH:MM:SS IST] — [what was wrong, one line]
   >    — undone with Recipe [1-6] — proper fix coming via [PR #n / the pipeline]."
   > Timestamp to the second, IST. Change nothing else in the file.
   > Commit on a branch and open a PR.
   > ```

2. Message Abilash (WhatsApp or email), one plain-English line: *what* was wrong, *what* you rolled back to, *how* the real fix is coming. For Recipe 5 (a safety take-down), send this message the moment the page is down.
3. If the item's Drive folder says **3 — Published** but the page is now down or reverted, update the item's row in the **Pipeline Tracker** sheet too — the trackers must never claim a state the internet contradicts.

> **⚠️ Why the One Rule is a hard rule:** a rollback nobody logged is a mistake nobody learns from — and three months later someone "fixes" the page back to the broken version, because the record said everything was fine. The ledger note costs one paste. The silence costs a repeat of the whole incident.

---

> **✅ DEEPU'S UNDO CHECKPOINT (the whole section in five lines)**
> 1. Factory page → git is the backup: revert the PR (1), instant-rollback Vercel (2), or restore one file (3).
> 2. WordPress page → Revisions (4), Switch-to-draft with your own hand (5), or the `backups/` snapshot (6).
> 3. Emergency? Take it down first (2 or 5), undo properly second.
> 4. Every WordPress publish snapshots itself first — because it's inside the publish prompt, not inside your memory.
> 5. Every rollback ends with Recipe 7: ledger note + message to Abilash. **Never fix silently.**

---

*Kairali — For Deepu v1.0 (18 Jul 2026). Companion: `wordpress-gutenberg-setup.md` (the full research + two-track security model) · the Team Workbook (the pipeline) · `scripts/wp-snapshot.mjs` (the automatic backup, built + tested 18 Jul).*
