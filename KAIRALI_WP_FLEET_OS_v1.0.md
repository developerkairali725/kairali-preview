# KAIRALI WORDPRESS FLEET OS — v1.0
**Owner:** Abilash (approval gate) · **Infra/Security:** Ambuj · **WP Execution:** Deepu (web developer) · **Agent:** Claude Code
**Date:** 13 July 2026 · **Scope:** All WordPress properties of Kairali Ayurvedic Group
**Out of scope:** Shopify store (e-commerce — separate track), kairali.guru and Voyagent (Next.js on Vercel/Netlify — already Git-native)

**Standing rule reminders (apply throughout):**
- KTAHV = clinical register only (patient / physician / treatment / programme / Panchakarma). Banned on KTAHV: spa, resort, holiday, luxury, cure, journey, guests. Villa Raag = hospitality/wellness framing OK. KAPPL = product/pharma framing OK.
- Two Deepus: Deepu (web developer) executes WP changes. Dr. Deepu John (chief physician) signs off medical content. Never conflate.
- Public contact email everywhere: info@kairali.com. Priya's KTAHV WhatsApp: +91 92898 38797.

---

## 0. FLEET REGISTER (Week 1 — do this before anything else)

You cannot manage what isn't listed. Build one sheet (or Financial-OS-style tab) with one row per domain:

| Field | Why |
|---|---|
| Domain + registrar + renewal date | Ownership |
| Host + panel URL + SSH/WP-CLI available? (Y/N) | Determines if CI/CD is even possible |
| PHP version + WP core version | Upgrade risk |
| Theme + page builder + license owner | Builder-license trap (Elementor/Divi under vendor license = site degrades when it lapses) |
| Plugin count + payment/forms plugins flagged | Attack surface |
| Vendor of record + access status | Handover state |
| Backup system + last successful restore test date | Real recoverability |
| Analytics/GSC/pixel ownership | Marketing continuity |
| Monthly traffic + leads (from GSC/GA) | Tier decision input |
| **Tier (1/2/3)** | Everything below keys off this |

### Tiering rule
- **Tier 1 — Full stack** (repo + staging + CI/CD + agentic QA + MainWP): kairali.com, KTAHV site, kappl.co.in, Villa Raag. Criteria: revenue-bearing, team-edited, multilingual, or compliance-sensitive.
- **Tier 2 — Managed** (MainWP updates/backups/uptime/security + paste-file content edits; NO repo/CI): active microsites and landing properties with real traffic.
- **Tier 3 — Sunset queue**: defunct/brochure sites. Decision at each renewal date: if <threshold traffic/leads (set threshold in register, e.g. <200 sessions/mo and 0 leads/quarter) → retire, redirect, or Factory-rebuild as static Next.js/Astro. Do not pay maintenance on dead sites.

**Do not** apply Tier-1 machinery to Tier-2/3 sites. Thirty CI/CD pipelines on heterogeneous vendor hosting is a maintenance liability, not an asset.

---

## 1. VENDOR HANDOVER + OFFBOARDING SOP

### 1A. Handover checklist (before accepting any site)
1. Domain registrar login; renewal + billing moved to Kairali account.
2. Hosting panel login, SFTP/SSH, database access, PHP version visibility. **Record whether SSH/WP-CLI exists** — this gates the CI/CD decision.
3. WordPress admin (Administrator role) + full export of the users list.
4. DNS moved into Kairali-controlled Cloudflare account. CDN settings documented.
5. SSL status + issuer; auto-renew confirmed.
6. Backup system location + restore procedure + **one witnessed restore test**. A backup that has never been restored is a hope, not a backup.
7. SMTP/transactional email provider + SPF/DKIM/DMARC records ownership. (Losing this silently breaks enquiry forms — silent lead loss.)
8. Analytics (GA4), Search Console, Tag Manager, ad pixels — ownership transferred to Kairali accounts, vendor demoted.
9. Plugin + theme + page-builder licenses transferred into Kairali-owned accounts. If not transferable, record cost to relicense or rebuild.
10. Written list: cron jobs, custom code, third-party integrations, API keys, webhooks.
11. **IP assignment in writing** for any custom theme/plugin code.
12. Current full-site backup + DB export handed over and stored offsite.

### 1B. Offboarding (immediately after transfer — handover is NOT complete until the vendor cannot get back in)
1. Rotate every credential: registrar, hosting, WP admin, SFTP, DB, SMTP, Cloudflare, all API keys.
2. Delete vendor admin users; audit the full user table for unknown accounts; downgrade or remove anything unexplained.
3. Revoke all existing Application Passwords; reissue only what's needed.
4. One-time deep malware/backdoor scan (Patchstack/WP Umbrella scan + file-integrity check against WP core checksums via WP-CLI where available).
5. Enable 2FA on registrar, hosting, and all WP admin accounts.
6. Check wp-config.php, mu-plugins, and .htaccess for anything unexplained.
7. Log completion in the Fleet Register with date.

---

## 2. OPERATIONS LAYER — MainWP (self-hosted)

**Why MainWP:** self-hosted (your data, no SaaS lock-in — mitigates the WordPress.org single-point-of-control risk exposed by the Automattic/WP Engine litigation), ~$199/yr Pro for unlimited sites (~$220/yr all-in at 50 sites vs ~$1,200–1,800/yr ManageWP), Patchstack real-time vulnerability integration (Mar 2026), CLI + REST API (agent-friendly).

### Setup
1. Provision a **dedicated, hardened WP install** used ONLY as the MainWP Dashboard (its own subdomain/server, not on any brand site). Ambuj owns this box.
2. Connect every Tier 1 + Tier 2 site via the MainWP Child plugin.
3. Enable: uptime monitoring, Patchstack vulnerability alerts, update management, backups extension (or connect host-native backups), client tags per entity (KTAHV / KAPPL / Villa Raag / Corporate / Microsites).
4. **Version locking ON for all Tier 1 sites** — no plugin/theme/core updates outside the staged rollout below.

### Staged update rollout (weekly)
1. Patchstack alert review first — anything critical jumps the queue (see §3).
2. Push updates to a **canary batch of 3–5 Tier 2 sites** → wait 48h → check uptime/error logs.
3. Push to remaining Tier 2.
4. Tier 1: updates go to **staging first**, deterministic spec suite runs (§5), visual pass, then production **after a fresh backup**.
5. Log in MainWP report.

### Backups (GitHub is never the backup)
- Host-native daily backups + MainWP/offsite copy for Tier 1.
- **Monthly restore drill:** restore ONE fleet site (rotate through the fleet) to a scratch environment. Log pass/fail in register.

---

## 3. SECURITY LAYER

1. **Patchstack (via MainWP) on every site**; on Tier 1 and any site with forms (enquiry/consultation = personal data under DPDP), treat real-time CVE alerting as mandatory, not optional. Note: with e-commerce on Shopify, the WP fleet carries no PCI scope — its sensitive-data exposure is form-submitted personal data.
2. **Critical-CVE policy (Avada-class events):** patch within 24h fleet-wide via MainWP bulk; if no patch exists, disable the plugin on affected sites and note in register.
3. Least privilege everywhere: humans get the lowest role that does the job; **the agent gets an Editor-role user with an Application Password stored in an env var — never Admin, never in a file, never in a repo**.
4. 2FA on all Admin accounts. Quarterly user-table audit fleet-wide (MainWP bulk report).
5. Plugin hygiene during handover audits: remove abandoned/duplicate plugins (≈97% of WP vulnerabilities originate in plugins/themes — surface area is the risk).

---

## 4. TWO-LANE CHANGE MODEL (the code/content split)

WordPress pages live in the database; CI/CD only governs code. Never blur the lanes. **Never merge a staging database into production** — it overwrites live leads/form entries.

### Lane A — CODE (Tier 1 only)
- One repo per site. Versioned: child/custom theme, custom plugins, mu-plugins, ACF JSON, block code, workflow files. NOT versioned: WP core, uploads, DB dumps, vendor plugins.
- Shared repos only for genuinely reusable parts (base theme, snippets, deploy templates) — these become the Website Factory's standard parts.
- Branches: `main` = production, `staging` = testing, `feature/<task>` = one task per change.
- GitHub Actions deploy: push to `staging` → auto-deploy to staging; merge to `main` → backup → deploy to production. **Prerequisite per site: SSH/SFTP + (ideally) WP-CLI confirmed in the register.** No SSH = no Lane A for that site; it stays Lane-B-only.
- Git rule: `--force-with-lease` only; never `--force`.

### Lane B — CONTENT (all tiers)
- Content changes ship to production directly via the proven pipeline: Gutenberg paste files / REST push script / WP MCP adapter, **with a pre-change backup and a post-change QA pass**.
- **Commit every paste file to the site's repo** (`/content/` folder). The DB is the runtime; the repo is the content history. This is your content version control.
- Staging slugs (`/…-staging/`) remain the preview mechanism for high-stakes pages (the v1.3.x consultation-page pattern) before manual go-live.

---

## 5. AGENTIC QA/QC LAYER (Claude Code)

### Tooling
```bash
# Browser QA agent
claude mcp add playwright npx @playwright/mcp@latest
# WordPress backend channel (official WordPress MCP adapter, v0.5.x)
# → install mcp-adapter plugin on target site, connect with Editor app-password
```
- Persistent browser profile ONLY for authenticated test sessions (avoids re-auth rate-limits/lockouts); ephemeral profiles for everything else.
- `CLAUDE_FLEET.md` sits at the workspace root — every session starts with the rules pre-loaded.

### Roles (chain with gates — no single super-agent touching production)
1. **Auditor** (explore): Playwright MCP free-roam — broken links, visual/mobile issues, banned-word scan, schema presence, forms render, analytics events, mixed content. Output = findings file.
2. **Implementer**: produces fixes as code diffs (Lane A) or paste files (Lane B). Never applies to production itself.
3. **Checker**: verifies with machine evidence only — curl output, grep results, screenshots, spec-suite results. The A-series rules apply: no "done" without a real link + real output; never invent IDs; check **all three locales**, not one; wait for real command output.
4. **Human gate**: Abilash approves from preview/staging link → Deepu (or the staging-only push script) executes.

### Determinism rule
Agents explore; **scripts verify**. The revenue-critical flows are codified as fixed Playwright specs (`ktahv-critical-flows.spec.ts`) and run: (a) before any Tier-1 production deploy, (b) after any Lane-B change to a critical page, (c) weekly on schedule. Same tests, same way, every time. Extend the same spec pattern to kairali.com and Villa Raag once KTAHV is stable.

---

## 6. CADENCE

| Rhythm | Action | Owner |
|---|---|---|
| Daily (10 min) | MainWP dashboard: uptime, Patchstack alerts, backup status | Ambuj |
| Weekly | Staged update rollout (§2) · Agentic audit pass on a 5-site rotation · Spec suite on Tier 1 | Ambuj + Claude Code |
| Monthly | Restore drill (1 site, rotating) · Access/license audit (rotating slice of fleet) · MainWP report review | Ambuj, Abilash |
| Quarterly | Tier review: promote/demote/sunset · Register refresh · User-table audit fleet-wide | Abilash |
| Event-driven | Critical CVE → 24h patch · WP core major (7.0) → Tier 2 canary + Tier 1 staging first, never RC on production | Ambuj |

---

## 7. RISK REGISTER (standing)

1. **WordPress.org single point of control** (Automattic/WP Engine litigation ongoing, trial 2027; a 3-month access block already froze updates for 200k+ sites once). Mitigation: self-hosted MainWP, local + offsite backups, no reliance on a single update pipeline.
2. **Plugin economy pressure** (Envato fee restructuring, abandoned plugins). Mitigation: licenses in Kairali accounts; exit plan noted per page-builder in the register; prefer core/Gutenberg-native builds for new pages (already your pattern).
3. **Agent risk**: over-claiming, hallucinated IDs, production writes. Mitigation: harness (Editor role, staging-only script, spec suite, human gate) + CLAUDE_FLEET.md rules. No agent pushes to production without staging evidence and human approval — ever.
4. **Fleet sprawl**: Tier 3 sunset discipline at renewal dates. New micro-properties default to the Next.js Website Factory, not new WordPress installs.

---

## 8. ROLLOUT SEQUENCE

- **Week 1:** Fleet Register + tiering. Provision MainWP dashboard. Connect Tier 1.
- **Week 2:** Connect Tier 2. Patchstack on. First staged update rollout. Offboarding sweep on the 3 highest-risk vendor sites.
- **Week 3:** Playwright MCP + WP MCP adapter into Claude Code. KTAHV spec suite live and passing on staging.
- **Week 4:** First full cadence week end-to-end. Repo + Actions for the first Tier-1 site with confirmed SSH. Tier-3 sunset list to Abilash for decisions.

*v1.0 — locked 13 Jul 2026. Amendments via changelog only.*
