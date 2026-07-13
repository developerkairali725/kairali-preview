# START HERE — Kairali Web Rebuild Launch Pack
**13 Jul 2026 · You are Abilash. This file tells you exactly what to do, in order, and what only you can provide. Everything else, the system does.**

---

## 1 · THE 11 FILES AND WHERE THEY GO

| File | Goes | Purpose |
|---|---|---|
| START_HERE.md | Repo root (keep) | This guide |
| PROJECT_CONTEXT.md | **Repo root** | The agent's brain — read first by every session |
| CLAUDE_FLEET.md | Repo root **renamed to `CLAUDE.md`**, then paste the Factory Addendum (Runbook §7) below its content | Binding agent rulebook |
| SITE_LAUNCH_CHECKLIST_v1.0.md | Repo root | Definition of done, every site |
| SITE_DESIGN_LOCALE_REGISTER.md | Repo root | Per-site register/locales/video/KPI |
| KAIRALI_30DAY_BUILD_RUNBOOK_v1.0.md | `/docs/` | The 30-day plan + waves + Day-0 detail |
| PHASE0_STABILIZE_PLAYBOOK.md | `/docs/` | Point −1→5 ladder + M2 night-shift setup |
| KAIRALI_WP_FLEET_OS_v1.0.md | `/docs/` | WordPress-tail operations (MainWP etc.) |
| brand-tokens.css | `packages/ui/` | Brand Manual as code |
| ktahv-critical-flows.spec.ts | `tests/` | Deterministic KTAHV gate |
| sweep.sh | Repo root (or run from anywhere) | 15-min estate recon |
| *(created empty on day 0)* DECISIONS.md · QUESTIONS.md · LEARNINGS.md | Repo root | Append-only logs |

## 2 · DO THIS NOW, IN ORDER (first sitting, ~3–4 hours)

**Step 0 — Sweep (15 min, needs nothing).** On any Mac/Linux terminal: `bash sweep.sh`. While it runs: `curl -sI https://spalabs.in/migration/` and Google `site:spalabs.in` — if KTAHV copies are live/indexed there, WhatsApp Deepu to kill/noindex today.

**Step 1 — Accounts (30 min).** GitHub org `kairali-digital` + private repo `kairali-web-factory` · Vercel team connected to the org · confirm/create the Cloudflare account (future home of all DNS).

**Step 2 — Machine (30 min).**
```bash
curl -fsSL https://claude.ai/install.sh | bash
claude            # log in (Max plan)
claude doctor
claude mcp add playwright npx @playwright/mcp@latest
```
Install VS Code + Git if missing.

**Step 3 — Seed the repo (30 min).** Clone the empty repo → drop all files per the §1 map → create empty DECISIONS.md, QUESTIONS.md, LEARNINGS.md → commit → push → import repo into Vercel. Then open Claude Code in the repo, `/model fable`, and give it its first task verbatim:
> "Read PROJECT_CONTEXT.md, CLAUDE.md, SITE_LAUNCH_CHECKLIST_v1.0.md and SITE_DESIGN_LOCALE_REGISTER.md fully. Confirm your understanding in 10 bullets, list anything ambiguous into QUESTIONS.md, then scaffold the Turborepo monorepo per PROJECT_CONTEXT §6 (sites/, packages/ui with brand-tokens.css, seo, schema, i18n, compliance, consent, analytics, forms, product-card) and build the compliance lint from CLAUDE.md's language locks. Plan first, then execute."

**Step 4 — First site live today.** Drop the already-built abhilashkr.com Next.js code into `sites/abhilashkr`, deploy on Vercel, point DNS (grey-cloud). Proves the whole chain at zero risk.

**Step 5 — Feed it the sweep.** Give Claude Code `sweep_results.csv`: "Triage RED/AMBER/GREen per PHASE0 Step 0 and re-cut the runbook waves."

**Step 6 — Delegate (WhatsApp, 15 min).** Ambuj → §3-B list. Vikash → §3-C list. Deepu → KTAHV fix spec incoming tomorrow (incl. sitemap_index 404, /fr-fr/ redirects, wp-includes + /cpanel blocks).

**Step 7 — M2 night shift (30 min, at office or when next there).** PHASE0 Playbook §M2: Claude Desktop + Code on the M2, keep-awake settings, Remote Control default ON, pair Dispatch on your phone, create the 7 AM morning-brief scheduled task.

**Then daily:** ~45 min — morning brief + Fleet-Pulse glance, approve preview links, answer QUESTIONS.md. The waves run per the Runbook.

## 3 · PENDING FROM YOUR SIDE (the only blockers; send one by one, any order)

**A — Decisions (10 min of typing into DECISIONS.md):**
1. Forward strategy: semantic map (my recommendation, table in Runbook §2D) or all→one (name the domain).
2. whatisayurveda canonical: .org (aged) or .com (fresh).
3. Kairali Organic vs KAIR family — two brands or consolidate.
4. ayurvedafranchise.com — merge into kairalifranchise or SEO satellite.
5. Drop list confirm (balanceglow, kagapp, mobistorr, tourdenight, trueinstantloan; .in centre variants → keep as cheap forwards?).
6. snehachowdhary.com vs theblushlounge.com — which is primary.
7. ayurvedajournals.com — clarify "Believe it".
8. Tier-3 sunset threshold (default proposed: <200 sessions/mo AND 0 leads/quarter).

**B — Via Ambuj:**
9. **Canonical CRM form schema + webhook endpoint + test-mode flag** (gates packages/forms — highest priority).
10. Access harvest sheet, registrar column FIRST (Fleet OS §0 / PHASE0 Step −1).
11. Windows + Linux server audit (what runs where, exposed ports, patch state, backups).
12. Chatbase account inventory — which bots exist today, and admin access.
13. Semrush API key (or confirm plan level).

**C — Via Vikash:**
14. Google Ads landing-pages/final-URL export by campaign + tracking templates.
15. GSC + GA4 admin access list for the live domains.

**D — Assets (design team / you):**
16. Logo SVG pack (full lockup, wordmark, icon; light + dark) — the manual forbids recreating it.
17. Full 10-step color ramps (5 families) + exact ink hex from the design-system library.
18. Updated **Raag brand manual** (gates villaraag.com visual pass only — structure proceeds).

**E — Confirmations (2 min):**
19. DE/FR slugs in ktahv-critical-flows.spec.ts match the live sitemap.

Nothing in §3 blocks Steps 0–5 today. Items 9, 14 and 1 unblock the most, fastest.

## 4 · WHAT HAPPENS WITHOUT YOU
The agent builds template v1 and pilots (Days 1–6), the sweep re-orders waves, Deepu executes the KTAHV spec, overnight sessions end at PRs and preview links, and every site walks the Launch Checklist automatically. You approve, flip DNS, and decide. That's the whole job.

*Go run Step 0.*
