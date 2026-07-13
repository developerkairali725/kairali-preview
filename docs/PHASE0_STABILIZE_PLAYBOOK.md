# PHASE 0 — STABILIZE WHAT EXISTS (Runbook v1.1 Amendment)
**Scope:** Days 0–5, runs IN PARALLEL with the Factory template build. Nothing in the 30-day runbook is delayed; the sweep data re-orders the waves.
**Principle:** Get everything that is live today clean, correct, and safe THIS WEEK — then upgrade one by one. Never spend more than 2 hours patching an old site; past that, it goes straight to the Factory queue.

---

## THE GITHUB TRUTH (read this first — it dissolves the "how do I upload 30 sites" problem)

**You do not upload the old sites to GitHub.** GitHub holds the NEW factory code only. Old sites get three treatments, none of which is "push to GitHub":

1. **ARCHIVE** — a full snapshot for safety: hosting-panel full backup where access exists, plus an SFTP mirror of files, plus a DB export if there's a database. Zipped, dated, stored in Google Drive (and one offline copy). GitHub is the wrong tool for this — media-heavy binary snapshots don't belong in Git (Fleet OS rule: GitHub is never the backup).
2. **MINE** — a public crawl of every live site extracts two assets even where we have NO hosting access: the **URL inventory** (feeds the 301 map when the new site launches) and the **content** (converted to markdown drafts for the content team to rework — 2010 copy is raw material, not final copy).
3. **BUILD FRESH** — the replacement is built in the monorepo from the template. The only legacy code that ever gets its own repo is KTAHV's custom WordPress theme/plugins, during its post-30-day migration.

So the team never "uploads sites to GitHub." Ambuj archives, the agent mines, the Factory builds.

---

## THE LADDER — POINT −1 TO 5

### STEP −1 · ACCESS HARVEST (starts today, Ambuj, runs all week)
One sheet, one row per domain, four columns: **Registrar login? · Hosting/panel login? · SFTP/FTP? · CMS admin?** (Y/N/Unknown + where credentials live).
Priority order: **registrar first.** Registrar access alone lets us move DNS to Cloudflare and cut over to a new site even where hosting access is lost forever — it is the master key. Hosting access is only needed for archiving and quick fixes.
Rule: a domain with registrar access but no hosting access skips the quick-fix lane and goes straight to the Factory queue.

### STEP 0 · RECON SWEEP (today, 15 minutes, zero access needed)
Run `sweep.sh` (companion file) on the M2 or your laptop. It hits all ~85 domains from the outside and writes `sweep_results.csv`: HTTP status, redirect target, SSL validity + certificate days remaining, server/CMS fingerprint, page title, mobile viewport tag, analytics presence, whether the **wrong WhatsApp number (…38777)** or the correct one appears, whether info@kairali.com appears, and a last-modified signal.
Then hand the CSV to Claude Code (`/model fable`): *"Triage sweep_results.csv into RED (down/broken/expired SSL/wrong facts), AMBER (live but stale/thin), GREEN (live and presentable). Cross-reference the runbook waves and propose a re-ordered queue."*
**Manual add-on checks (5 min):** `curl -sI https://spalabs.in/migration/` and a `site:spalabs.in` search — the 2024 migration left full KTAHV page copies there; if any are live or indexed, they are duplicating the hospital's content (kill or noindex, Deepu/Ambuj, this week). Same check for any other old staging URLs Ambuj knows of.

### STEP 1 · ARCHIVE (Ambuj, Days 1–4, only where access exists)
Per site: hosting full backup → download · SFTP mirror (`wget -m ftp://…` or FileZilla) · DB export if any (phpMyAdmin/WP export). One dated zip per domain → Drive folder `Legacy-Archives/<domain>/2026-07/`. Log completion in the register. No analysis, no cleanup — just capture.

### STEP 2 · MINE (Claude Code, Days 1–4, needs no access)
For every live domain: `wget --mirror --convert-links --adjust-extension -P mined/<domain> https://<domain>` → agent extracts every URL to `301-inventory/<domain>.csv` and converts page text to markdown in `content-mined/<domain>/`. The content team receives these as rewrite raw material; the 301 inventories feed each launch.

### STEP 3 · TRIAGE BOARD (you, Day 2, 30 minutes)
From the sweep + access sheet, every domain gets one of four stamps:
- **QUICK-FIX** — live, we have access, fixable in ≤2h → Step 4 this week
- **FACTORY-NOW** — RED or pre-mobile-era or no hosting access → jumps the wave queue
- **FACTORY-SCHEDULED** — GREEN/AMBER, holds its runbook wave slot
- **FORWARD/DROP** — as per runbook §2 decisions
Honest rule for 2010-era sites: if it has no mobile viewport and table-based layout, patching costs more than a same-day template rebuild — stamp it FACTORY-NOW, don't polish a fossil.

### STEP 4 · QUICK-FIX LANE (Deepu + agent specs, Days 2–5, ≤2h per site, hard timebox)
The checklist, applied only to QUICK-FIX sites:
1. SSL valid + forced HTTPS
2. Contact facts correct sitewide: info@kairali.com, Priya WhatsApp +91 92898 38797, any …38777 removed, current address
3. Top-nav and footer links: no 404s (fix or remove)
4. Forms: submit somewhere real (see lead-routing addition below) or replaced with a WhatsApp CTA
5. Mobile viewport meta present; nothing catastrophically broken on a phone screen
6. Copyright year, dead badges/widgets, obvious spam/malware injections removed
7. robots.txt sane; site indexed/noindexed as intended; no exposed /cpanel or server files
8. Analytics tag present (GA4)
Agent generates the per-site fix spec from the sweep + a Playwright pass; Deepu (or you) applies; agent verifies with a re-crawl. Evidence or it didn't happen.

### STEP 5 · RE-CUT THE WAVES (Day 5, 15 minutes)
Claude Code merges the triage stamps into the runbook wave tables → runbook v1.2. FACTORY-NOW sites take the earliest open slots; GREEN sites may slide later. The 30-day end date does not move.

---

## M2 MAC — THE NIGHT SHIFT (one-time setup, ~30 min at the office)

The M2 becomes the always-on build machine; your phone becomes its remote control.

1. On the M2: install **Claude Desktop** (gives you the Code and Cowork tabs) + **Claude Code** (native installer, §4 of the runbook). Sign in with your Max plan. Clone `kairali-web-factory`; run `claude` once in the repo folder and accept the workspace trust prompt; add the MCPs (Playwright, Semrush).
2. Keep it awake: System Settings → Energy → **Prevent automatic sleeping when the display is off** ON, **Wake for network access** ON. Display may sleep; the machine must not (Remote Control and scheduled tasks require it awake with the app open).
3. Turn on remote access by default: in Claude Desktop → Settings → Claude Code → **Enable remote control by default** (or `/config` → Enable Remote Control for all sessions). Sessions now appear in your phone's Claude app → **Code tab** with a green dot, from anywhere — the session keeps running on the M2 with its full local environment; the phone is just a window into it.
4. Pair **Dispatch** once: Claude Desktop → Cowork tab → Dispatch setup → pair your phone. Remote Control = *continue* a running session from your phone; **Dispatch = *create* a new task from your phone** that executes on the M2.
5. Parallel work: start background tasks (`claude --bg "…"`), monitor them all with `claude agents` (Agent View) on the M2 or from the phone's Code tab; approve/answer awaiting-input sessions from wherever you are.
6. Morning brief: in Cowork on the M2, create a **scheduled task** — every day 07:00: "Read QUESTIONS.md and overnight session outputs in the repo; write MORNING_BRIEF.md: what finished, what's blocked, what needs my decision." Note the documented limitation: scheduled tasks run only while the computer is awake and the Desktop app is open — which is exactly what steps 2 covers.
7. Add to CLAUDE.md (the unattended rule): *"When blocked on a question during unattended work, append it to QUESTIONS.md and move to the next queued task — do not stall. Unattended sessions end at commits, PRs, and preview links. Never DNS changes, never production pushes, never destructive commands while unattended."*

**Honest caveats:** Remote Control is a research preview — occasional reconnect jank is normal; if the M2 loses network ~10 minutes the session process exits (restart it); closing the terminal ends the session; heavy nightly audits belong in GitHub Actions, not on the Mac; parallel sessions all draw from the same plan's usage pool. Fallback for full machine control from anywhere: Tailscale + macOS Screen Sharing — set it up once as insurance, use the Claude app day-to-day.

---

## ADDITIONS ADOPTED FROM OTHER AGENCY / CONSULTANT INPUTS (now in scope)

| # | Source (from our history) | Addition | Lands in |
|---|---|---|---|
| A1 | 2024 SPA Labs migration file | **Stale-copy kill:** spalabs.in/migration KTAHV duplicates — verify, kill/noindex; sweep any other staging copies | Step 0, this week |
| A2 | Jul 2025 kairali.com migration review | **Consent & privacy layer:** cookie consent (CMP) + Google Consent Mode v2 + privacy/terms templates per entity — DPDP 2023 for India, GDPR posture for DE/FR/CZ pages (replaces that review's misapplied HIPAA/SOC2 framing) | New `packages/consent` — template v1, Days 2–3 |
| A3 | Same review | **Conversion infrastructure as code:** GA4 + Google Ads conversion tags + Meta pixel + LinkedIn Insight (franchise/B2B sites) + Bing UET where relevant, mapped from data-cta events | `packages/analytics` config, Days 2–3 |
| A4 | Same review | **Social cards:** auto OG/Twitter cards per page from frontmatter, generated OG images | `packages/seo`, template v1 |
| A5 | 2025 CRM/WhatsApp plans (Sunaj/Ambuj) | **One lead pipe:** every form on all sites POSTs to a single webhook standard → lead-classification v4.3/CRM; WhatsApp CTAs carry tracking. 28 sites, one pipeline, zero orphan leads | New `packages/forms`, before Wave 1 |
| A6 | MOA v3.0 (DACH ₹8–12L / France ₹15–25L envelopes) | **Condition-page template** (doctor-bylined, Person+MedicalWebPage schema, Q&A blocks) built into the Factory now — the 30–40-condition-pages-per-market pattern becomes template + content cost only | Template v1; used at KTAHV migration + DE/FR builds |
| A7 | DE PR/media plan (Ayurveda Journal etc.) | **E-E-A-T infrastructure:** author/byline pages with Person schema for Dr. Deepu John & Gita Ramesh + a press/media-kit page on kairali.com (the citation programmes need bylined pages to cite) | kairali.com scope (Wave 4) + shared author component |
| A8 | 2024 agency negatives list + Jul 2025 Ads audit | **PPC hygiene standing task:** negatives refresh + landing-page↔campaign map maintenance | Vikash, monthly, from the §3 PPC register |

*v1.1 — 13 Jul 2026. Amends KAIRALI_30DAY_BUILD_RUNBOOK_v1.0 (§5 Days 1–5) without moving the end date.*
