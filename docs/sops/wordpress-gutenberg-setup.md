# KAIRALI — WORKING ON EXISTING WORDPRESS SITES (Gutenberg)
## How Claude helps on our live WordPress sites — QA/QC, content updates, on-page SEO — without rebuilding from scratch.

This is the **light-touch WordPress path** (the "existing site just needs a fix / update / SEO" case). It is **not** the from-scratch factory rebuild — that stays the git/Next.js flow in the main SOP. Everything here lands as **editable Gutenberg blocks**, never locked HTML.

---

## ⚠️ READ THIS FIRST — the honest headline

The plugin from the video, **Novamira**, is real and genuinely powerful. **But on its own it breaks our core safety rule** ("Claude *prepares*, humans *publish*, never touch production"):

- It is **admin-only and all-or-nothing** — no "read-only" or "drafts-only" mode.
- It can **run arbitrary code and database commands** (`execute-php` bypasses its own safety sandbox).
- Contrary to some blog posts, it does **NOT** block itself on the live site — *"staging is a recommendation, not enforced by the plugin"* (Novamira's own security docs).

So we do **not** just "install Novamira and point it at the live sites." We use **two tracks**: a powerful tool for supervised staging jobs, and a safe, limited tool for everyday team work.

> **Decision for Abilash / the developer:** approve the two-track setup below. The actual install happens **on a staging copy, with the developer** — Claude does not (and should not) install plugins or grant access on the live WordPress sites. That's a human action.

---

## THE TWO TRACKS (plain English)

**🛠️ Track A — the "workshop" (STAGING ONLY): Novamira.**
For big one-time developer jobs: importing an existing site and converting old pages into editable Gutenberg blocks, large clean-ups, database-level fixes. Always on a **copy** of the site (staging), with the developer, after a **full backup**. **Never on the live site.**

**✅ Track B — the "everyday safe" path (RECOMMENDED for the team): a block-aware connector logged in as a limited Editor.**
Recommended: **Block MCP** (free, by GravityKit) — or Respira, or Automattic's official WordPress MCP. Claude connects as a **dedicated "Editor" WordPress account** (not admin) and can draft posts, fix content, and do on-page SEO — **as drafts**. A human clicks **Publish**. It **cannot** install plugins, edit themes, or change any settings, even if asked. *This is the track that actually enforces our rule.*

Why block-aware matters: these tools edit the real Gutenberg **block tree**, so changing one heading doesn't scramble the page. Plain REST-API tools flatten everything to locked HTML and break the editor — the difference between "editable Gutenberg" and "a locked blob."

---

## WHAT TRACK B IS FOR (operated by Deepu — optionally Abilash — ONLY)

> **⚠️ Correction (18 Jul audit):** Track B is NOT a marketing lane. Marketing hands off through the Drive folders per the Team Workbook; **only Deepu (or Abilash as the named backup) operates any WordPress connector.** Track B is the light-touch execution lane for small existing-page edits — same operator, smaller wrench.

Same idea as the main SOP loop, on WordPress:

1. Tell Claude the job (a content fix, a new blog post, an on-page-SEO pass) on the **staging** WordPress site.
2. Claude drafts it as **editable Gutenberg blocks** (in your chosen author voice for blogs — see `author-voices`).
3. You **preview the draft** in WordPress.
4. A human (developer/Abilash) clicks **Publish**. Done.

Use the same **master handoff prompt** and **author-voice prompt** from the main SOP — they work here too; just tell Claude it's the WordPress site.

---

## SETUP (for the developer / Abilash to authorize — on STAGING)

**Prerequisites (both tracks):**
1. **Never point any of this at the live site.** Stand up a **staging or local copy** (WordPress Studio — free, Mac/Win — or a host staging environment).
2. Install **Claude Code** (needs Node.js 18+); run it from the site's project folder.
3. Take a **full backup** before enabling any agent access.

**Track A — Novamira (staging, developer-supervised):**
1. Download the ZIP from **novamira.ai/download** (or its GitHub — `use-novamira/novamira`). It is **not** on wordpress.org; only use the official source.
2. WP admin → Plugins → Add New → Upload → activate.
3. Novamira → Configuration → enable **"AI Abilities"** (off by default).
4. Create a **WordPress Application Password** named e.g. "Claude Code – staging". (If missing, a security plugin is blocking it — re-enable there.)
5. Novamira → Configuration → **"Copy prompt"** → paste into Claude Code; it writes its own `.mcp.json`.
6. Verify: ask Claude to "check the Novamira connection and list installed plugins."

**Track B — Block MCP (the safe everyday path):**
1. Install `gk-block-mcp` (GravityKit GitHub) → Plugins → Add New → Upload → activate.
2. Create a **dedicated WordPress user** with the **Editor** role (NOT admin), e.g. `claude-editor`.
3. Generate an **Application Password** for that user.
4. Register it in Claude Code (`claude mcp add`) with the site URL, the `claude-editor` user, and the app password.
5. (Recommended) also add `wp-blockmarkup-mcp` so generated blocks are schema-valid.

**Import an existing site / run QA-SEO — gotchas:**
- Convert legacy HTML → blocks **in batches** on staging; back up each page's content before editing; keep everything as drafts for human review.
- When reading a post to edit it, use **`?context=edit`** — without it, the API returns flattened HTML, not editable blocks.
- **Rank Math / Yoast SEO fields are ignored by the standard REST API** — the connector must use the SEO plugin's own endpoint or those SEO edits won't stick. Confirm this before an SEO pass.
- **Elementor** pages can't be edited reliably by these tools (they're a JS app) — those stay a developer job.

---

## SECURITY GUARDRAILS (the rules — non-negotiable)

1. **Staging/local only for Novamira. Full backup before every session.** Production is untouchable by any agent.
2. **Everyday content work runs as a dedicated non-admin Editor user** (Track B) so Claude physically cannot install plugins, edit themes, or change settings.
3. **Draft-only + human publishes.** Always.
4. **Prefer tools with rollback** (Block MCP creates a WordPress revision on every change; Respira snapshots).
5. **One Application Password per person/machine, named, revoked when idle.** Check "Last Used".
6. **Lock `/wp-json/` to known office IPs** at the server level.
7. **Don't leave the connector running** when not in active use — especially Novamira.
8. **Novamira active on any LIVE site = an incident** — deactivate first, explain second. The monthly access review (CLAUDE.md rule s) checks production plugin lists for exactly this.
9. **Never use "skip-permissions" / bypass mode** on a real project. Plan mode + approvals.
10. In the video's two build modes, **always choose the editable Gutenberg/block path, never the "pixel-perfect PHP page" (it's locked and can't be edited later).**

---

## HOW THIS FITS THE MAIN SOP

- This is **Lane 2 for WordPress** — *"update an existing website / existing WordPress pages"* — done the light-touch way (QA/QC, content, on-page SEO), not a rebuild.
- **From-scratch new sites / full rebuilds** stay the **git + Next.js factory** flow (the four lanes in the main SOP).
- The **author-voice system** (`author-voices`) and the **master handoff prompt** apply unchanged.

---

*Kairali — WordPress + Gutenberg setup v1.0. Researched 18 Jul 2026. Recommendation: two-track (Novamira staging-only + Block MCP dedicated-Editor for everyday). Do a small pilot on staging before rollout. Do NOT rely on Novamira to protect production — it won't. Install is a developer/human action on staging; Claude does not install on live sites.*
