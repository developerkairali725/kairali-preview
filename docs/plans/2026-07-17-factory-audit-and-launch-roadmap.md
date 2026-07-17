# Website Factory — Process Audit, Tools Register & Launch Roadmap
**17 Jul 2026 · Report only — no fixes executed · Paste-prompts at the end**

## 0. How to read this

Last night's builds ran in Claude Code on the M2. From this chat I cannot open the repo, session logs, or PRs — so this report does not guess at what happened. It gives you: (1) the canonical pipeline every site must pass, (2) the last independently verified checkpoint (14 Jul deployment verification) plus everything you've confirmed since, (3) the exact evidence Claude Code must show to turn each row green for last night's sites, and (4) paste-ready prompts that produce that evidence. Any row marked **VERIFY** means "Prompt 1 proves it" — not "it failed."

---

## 1. The canonical per-site pipeline — step-by-step status

| # | Step | What it must produce (evidence) | Run by | Status for last night's sites |
|---|------|-------------------------------|--------|------------------------------|
| 1 | Intake & brief | Site brief in repo; entry in the per-site design & locale register; correct entity register locked (KTAHV clinical / Villa Raag hospitality / KAPPL product) | You + Claude Code | ⚠️ VERIFY (Prompt 1) |
| 2 | Brand & design tokens | Brand-tokens-as-code file applied (Villa Raag tokens were still pending manual delivery at last checkpoint) | Factory config | ⚠️ VERIFY |
| 3 | Build in Factory | Next.js monorepo tenant; clean build log; no secrets in code | Claude Code | 🟡 PRs passed per you — build/gitleaks evidence via Prompt 1 |
| 4 | Content & localisation | Register-compliant copy, banned-words pass, locales as scoped (EN/DE/FR pattern) | content-geo-writer agent + gates | ⚠️ VERIFY |
| 5 | Compliance gates | Ship-gate checklist run; page-level gate suite transcripts printing **ALL GATES PASS** (the 19-gate pattern) | Verifier scripts | ⚠️ VERIFY — ask for gate transcripts |
| 6 | Subagent audit round | SEO/AEO/GEO auditor, design-QA, catalog-compliance (KAPPL), security-auditor screening of any scraped/external content, logger writing lessons to the wiki | Subagents | ⚠️ VERIFY |
| 7 | Cross-model audit | Independent GPT-5.5-via-Codex audit note at the phase boundary | Codex | ⚠️ VERIFY — was one run for this wave? |
| 8 | PR & human review | PR opened, checks green, your approval | GitHub | ✅ DONE (you passed the PRs) |
| 9 | Preview deploy | Vercel preview URL per site; Playwright screenshots mobile/tablet/desktop; full link check | Vercel + Playwright MCP | ❌ NOT YET — Prompt 2 does this next |
| 10 | Human audit gate | Marketing, Deepu, Satyam (forms), Sunaj (servers) sign off on the preview | Team | ❌ NOT YET — new gate defined today, formalised in §5 |
| 11 | OK-to-publish + role emails | Logged decision; emails to Sunaj (server prep), Satyam (forms cutover), Deepu (publish + touch-up + old-site backup + new tracking codes) | You + Claude (Gmail) | ❌ NOT YET |
| 12 | Go live + monitoring | DNS/host cutover, old site archived, GA4/GSC/Ads wired, dashboard row flips to *Monitoring* | Deepu/Sunaj + analytics OS | ❌ NOT YET |

**Reading:** steps 1–8 are the "was the build done right" question — Prompt 1 answers it with evidence. Steps 9–12 are simply not reached yet; that's sequence, not shortfall.

---

## 2. Known gaps at the last verified checkpoint (14 Jul) — confirm which are now closed

You said most bugs are fixed — likely several of these are closed. Prompt 1 reconciles each with proof; until then they stay on the board.

| Item | Status on 14 Jul | Risk if still open |
|------|------------------|--------------------|
| Plugins | 1 of 7 installed | Fleet-management and QA holes |
| MCP connections | 4 of 7 connected (Context7, Playwright, GitHub, Triple Whale scoped; Firecrawl planned as Phase-10 swap) | Agents blind to some surfaces |
| Branch protection | Blocked (403) — needs GitHub Team purchase | Un-reviewed pushes possible |
| gitleaks | 89 findings classified non-secret; formal allowlist pending | Noise can hide a real leak |
| Track B (Shopify) | NOT RUN — staff access + tokens pending from Ambuj | Shopify rigor can't start (§7) |
| Villa Raag brand tokens | Pending manual delivery | VR sites blocked on brand |
| Cloudflare / Clarity / Semrush | Browser logins only — not MCP connections | Manual-only data pulls |
| Shipping platform names | Asked 3×, unanswered | Blocks KAPPL shipping/policy pages |

---

## 3. Tools & auditors register

**Build & deploy:** Claude Code on the M2, with your standing model-routing doctrine (Sonnet for scaffolding, Opus for critical drafting, Fable for audits, Haiku for extraction only) · Next.js monorepo Factory on Vercel · GitHub (private, Kairali org) · WordPress fleet for legacy (Polylang EN/DE/FR; MainWP + Patchstack/WP Umbrella hardening plan) · Shopify dual-store for KAPPL with Storefront API as the bridge to Factory microsites.

**MCPs inside Claude Code:** Context7, Playwright (QA + screenshots), GitHub, Triple Whale (Moby Autopilot permanently OFF; its landing-page builder banned). Firecrawl is the planned Phase-10 swap-in.

**Secondary / external auditors:** GPT-5.5 via Codex — independent cross-model audit at every phase boundary. ChatGPT and Perplexity — external review passes under the standing triangulation rule: load-bearing claims need both verifiers; "verified by one only" is never a valid final state; unavailable verifier → pending-triangulation queue, never skipped.

**Data & analytics:** GA4, Search Console, Google Ads (the Ads/GSC/Analytics OS you're building — §9), Semrush, Ahrefs, Microsoft Clarity, Triple Whale (commerce), Chatbase — exactly four entity bots (never one group bot, never per-site).

**DataForSEO:** named by you for the stack; **no integration record in my notes as of 14 Jul** — Prompt 1 verifies whether it's wired. Its natural slot is the keyword/SERP data feed inside the analytics OS. → VERIFY.

**Image generation:** **no confirmed tool in the records.** Images have so far been human-supplied and have acted as production blockers (the P-04/05/06 pattern on the KTAHV builds). Decide the image pipeline (tool + brand governance) before the next wave; Prompt 1 reports if anything was added in-repo. → OPEN DECISION.

---

## 4. Pending questions & parking lot

**Resolved today.** Centres & countries count: your brother confirms the figures published on his Kairali Centres (KAC) website are correct → they are now the **canonical anchor for every property**. Prompt 1 logs this in PROJECT_CONTEXT.md and lists (does not edit) every page/claim across the estate stating a centre or country count, with current value vs canonical — propagation happens on your go.

**Needs you now.**
1. **Shipping platform names** (3rd+ ask) — which couriers/aggregators actually ship KAPPL orders. Blocks shipping & policy pages.
2. **TARIFF_MODE** and **BOOKING_ROUTE** — the two machine-enforced blockers on the KTAHV WordPress track.
3. **Sprint-1 confirmation** for the analytics OS — is lead-source trust the true binding constraint?

**Lives in the repo.** The Vault's pending-questions tab and the parking lot are on the M2, not readable from here. Prompt 1 prints the entire list verbatim, each item tagged *needs-Abilash / needs-team / stale-close?* — then we clear them one by one, as you asked.

---

## 5. Launch gate — your process, formalised

| Gate | Owner | Checks | Rule |
|------|-------|--------|------|
| A. Preview up | Claude Code + Vercel | Preview URLs, device screenshots, link check clean | Automatic, before any human sees it |
| B. Marketing audit | Marketing team | Copy, brand, offers, imagery | **Challengeable** — we push back if we disagree, or gate the point to you for accept/change |
| C. Deepu audit | Deepu | Code sanity, publish readiness | Tech feedback — taken seriously |
| D. Satyam audit | Satyam | Forms: v1-freeze parity with the CRM schema, test submissions land | Tech feedback — taken seriously |
| E. Sunaj audit | Sunaj | Servers, DNS, SSL, redirect plan | Tech feedback — taken seriously |
| F. OK to publish | You | Final call | Logged in the repo decision log |
| G. Role emails | Claude (Gmail connected) | Sunaj: server prep · Satyam: forms cutover · Deepu: publish + code touch-up + **old-site backup procedure** + **new tracking codes** | Drafted the moment F is logged |

I can draft the four Gate B–E audit-request emails as soon as Prompt 2 gives us preview URLs.

---

## 6. Roadmap & visibility dashboard (your idea — spec)

Two views, one data file:

- **System view** — each workstream: status, next milestone, deadline, and budget burn (tokens, ₹, hours) vs plan, so the build never runs perpetual.
- **Site view** — every site with stage chips: Ideation → Research → Build → Gates → Preview → Human audits → OK-to-publish → Live → Monitoring, plus owner and current blocker.

**Mechanics:** a `STATUS.yaml` at repo root is the single source of truth; a CLAUDE.md rule makes every session end by updating it (the logger agent already exists — extend it); a small static page in the Factory renders both views and deploys to the **kairali.ai** Vercel project (that domain needs nothing else), with **spalabs.in** as fallback. Prompt 3 builds all of it and prints the live URL.

---

## 7. Shopify — same rigor as the Factory

Prerequisite: unblock Track B (staff access + tokens from Ambuj). Then mirror the gates one-for-one: Shopify theme-check + Lighthouse + Playwright scripts on the five or six revenue-critical flows (checkout above all) · catalog-compliance agent enforcing the KAPPL register · security-auditor screening all scraped content · staging **theme preview links** feeding the same human audit round B–F · Triple Whale for post-launch commerce metrics. The locked two-store architecture stands: kairaliproducts.in (Razorpay/UPI/COD) and kairaliproducts.com (Razorpay International + PayPal).

**One gate registry, three site classes (your rule, 17 Jul).** The rigorous checks are not three parallel lists — they are **one registry** applied to three profiles: **commerce** (Shopify stores), **organic** (Factory + WordPress content sites), and **landing** (single-pagers / campaign pages). Every gate is defined once and must carry an explicit tag for each class — *required*, *adapted* (with how), or *N/A* (with reason). A gate can never exist for one class and simply be absent from the others: a missing tag fails validation, and per-site ship checklists are **generated** from the registry by class, never hand-written. That is the guarantee nothing gets missed between site types.

Shared core (all three): performance/Core Web Vitals · mobile rendering · link integrity · SEO/AEO/GEO + schema · entity register & banned words · analytics + consent tags · forms parity where forms exist · security screening · accessibility · legal pages · redirects. **Commerce adds:** checkout flows, payment gateways per store, catalog compliance, price/inventory integrity. **Organic adds:** hreflang/multilingual, internal linking, E-E-A-T signals, content freshness. **Landing adds:** message-match with the ad, single conversion goal, ad-policy compliance, stricter speed budget. Prompt 5 builds the registry.

---

## 8. Amazon — next channel once Shopify is stable

Your targets: **minimum 2× ROAS** on ad spend, **≥30% month-on-month growth**, category-top ranking. The track: listing SEO + A+ content written to the KAPPL register → structured PPC (exact/phrase/auto with a weekly search-term harvest loop and bid rules holding the 2× ROAS floor) → review-velocity programme → all metrics flowing into the analytics OS. One honest note: 30% MoM compounds to roughly 23× in a year — keep it as the stretch target, but set a 90-day review so budgets follow evidence rather than the slogan.

**After Amazon — third-party channels & agents (basic audits, monitor-only).** These aren't our sites, so we can't gate them — we audit them and send correction requests. Two lists:

1. **Third-party e-commerce sites selling KAPPL products** — listing accuracy vs canonical product data, claims held within the KAPPL register (no non-compliant medical claims under our brand), current brand imagery, price/MAP consistency against our own stores, availability, review health, unauthorized-seller and counterfeit signals.
2. **Top agents selling KTAHV and Villa Raag online** (the Fit Reisen / SpaDreams tier of partners) — correct entity framing above all: **KTAHV must read clinical on agent pages too** — an agent page calling it a spa resort is a live compliance exposure, not a cosmetic issue; Villa Raag stays hospitality-framed. Then: rate parity vs direct, accurate imagery and awards, the canonical centres-and-countries count, a working booking path, and correct contact details (info@kairali.com).

**Mechanics:** the gate registry (§7, Prompt 5) gains a fourth applicability column — `external (monitor-only)` — so the no-miss guarantee covers these channels with different enforcement: each sweep outputs a discrepancy table plus a ready-to-send partner-correction email per channel. Cadence: quarterly basic sweep across the full list; monthly for the top three channels by revenue. This becomes its own workstream row in STATUS.yaml, scheduled after the Amazon track.

---

## 9. How future updates and the feedback loop work (plain language)

You say the change (chat, voice note, WhatsApp) → Claude Code opens a branch and edits → a PR opens with a fresh Vercel preview → all gates re-run automatically on that PR → the relevant auditor (or you) approves → merge → Vercel auto-deploys → the Ads/Search Console/Analytics OS keeps watching rankings, Core Web Vitals, conversions and ROAS → it flags "this page is slipping" or "this campaign is beating 2×" → those flags, plus client/user/internal feedback, become the next change requests. The same loop handles a typo and a redesign — only the size of the PR changes. Nothing is ever edited live on a server, which is what keeps 80+ sites safe.

---

## 10. Paste-ready prompts — run in this order

### PROMPT 1 — Retro-audit of last night's builds (report only)

```
ROLE: Auditor. REPORT ONLY — make no code, content, or config changes except the single log entry in step 5.
SCOPE: the sites completed and PR-merged on 16 Jul 2026.

1. Read CLAUDE.md, PROJECT_CONTEXT.md, the ship-gate checklist, the per-site design & locale register, and the wiki/decision log.
2. For each completed site, output a table: pipeline step (intake → brief → tokens → build → content → gates → subagent audits → cross-model audit → PR → merge) | evidence found (file / commit / log / gate transcript) | PASS / PARTIAL / MISSING | note.
3. Reconcile the 14-Jul open items and print current state WITH evidence: 7 plugins, 7 MCP connections, branch protection, gitleaks allowlist, Track B prerequisites, Villa Raag brand tokens.
4. Print the ENTIRE pending-questions list and parking lot verbatim, each tagged: needs-Abilash / needs-team / stale-close?
5. Append to PROJECT_CONTEXT.md: "Centres & countries count: the figures published on the Kairali Centres (KAC) website are canonical for all Kairali properties — confirmed by owner's brother, 17 Jul 2026." Then LIST (do not edit) every page/claim across the estate that states a centre or country count, with current value vs canonical.
6. Report yes/no with evidence: is DataForSEO integrated anywhere? Is any image-generation tool configured?
7. Finish with: GREEN items, AMBER items, RED items, and the top 5 process fixes that would prevent repeat misses. Execute no fixes.
```

### PROMPT 2 — Host previews for the review round

```
For each site merged on 16 Jul: confirm the Vercel preview/production URL (create a preview deployment if none exists). Then per site: run a full internal + external link check; run Playwright screenshots at 390×844, 768×1024, and 1440×900 for every top-level page; run Lighthouse (mobile) and report LCP / CLS / INP. Output one table: site | URL | links OK? | worst Lighthouse score | screenshot folder. Make NO production DNS changes. These URLs feed the human audit round.
```

### PROMPT 3 — Roadmap dashboard

```
Build /status. 1) Create STATUS.yaml at repo root with schema: workstreams[{name, status, next_milestone, due, tokens_spent, cost_inr, hours}] and sites[{name, entity, stage: ideation|research|build|gates|preview|human_audit|ok_to_publish|live|monitoring, owner, blocker, updated}]. Backfill it from the site register and PR history. 2) Build one static, mobile-friendly dashboard page in the Factory rendering both views (system table + per-site stage chips). 3) Deploy it to the kairali.ai Vercel project (fallback: spalabs.in). 4) Add a CLAUDE.md rule: every session must end by updating STATUS.yaml. Print the live URL.
```

### PROMPT 4 — Single-pager pilot launch (pipeline test)

```
Pick the simplest completed single-pager site. Run it through the ENTIRE gate chain end-to-end as a pipeline test: gates → subagent audits → preview checks (as in Prompt 2) → prepare four human-audit packets (exactly what Marketing, Deepu, Satyam [forms], and Sunaj [servers] each need to check, with the preview URL) → STOP before publish. Log every step's duration and token cost into STATUS.yaml so we have a real per-site baseline for the roadmap timelines.
```

### PROMPT 5 — Unified gate registry across all three site classes

```
Build ONE gate registry so no rigorous check is ever missed between site classes. No site-code changes.
1) Inventory every existing check: the ship-gate checklist, the 19-gate page suites, all subagent audit criteria, Playwright/Lighthouse/link checks, and the planned Shopify checks (theme-check, checkout flows, catalog compliance).
2) Create gates/registry.yaml — every gate defined ONCE with: {id, name, what_it_verifies, severity, automated|human, script_or_agent_ref, applicability: {commerce, organic, landing} where each class = required | adapted:"how" | n_a:"reason"}.
3) Add a CLAUDE.md rule: every gate MUST carry an explicit entry for all three classes — a gate with a missing class entry fails validation; per-site ship checklists are GENERATED from the registry by site class, never hand-written.
4) Output the full matrix as a table (gates × commerce/organic/landing) and flag every gate that today exists for one class but is unmarked for the others — those are the misses this rule closes.
```

**Sequence:** Prompt 1 → Prompt 2 → (I draft the four audit emails) → Prompt 3 → **Prompt 5** → Prompt 4 → human feedback → OK-to-publish → role emails → go live. Prompt 5 runs before the pilot so the single-pager launches against the unified matrix.
