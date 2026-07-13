# CLAUDE_FLEET.md — Kairali WordPress Fleet Rulebook
<!-- Place at the root of the fleet workspace. Every Claude Code session reads this first. -->
<!-- v1.0 · 13 Jul 2026 · Owner: Abilash. Amendments only via Abilash, logged in CHANGELOG below. -->

## WHO I AM WORKING FOR
Kairali Ayurvedic Group. Three entities with DIFFERENT language rules:
- **KTAHV** (Kairali – The Ayurvedic Healing Village): NABH-accredited Ayurvedic hospital. CLINICAL REGISTER ONLY.
- **Villa Raag** (Agonda, Goa): boutique wellness property. Hospitality/wellness/resort framing is CORRECT here.
- **KAPPL**: WHO-GMP Ayurvedic pharma manufacturer. Product/pharma framing. (E-commerce runs on Shopify — out of scope for this workspace.)

## HARD GATES — NEVER VIOLATE
1. **Never write to production.** All pushes target staging slugs (`/…-staging/`) or the staging branch. Production go-live is a HUMAN action (Abilash approves, Deepu executes) or an explicitly approved script run.
2. **Never unpublish, delete, or change the status of any page or post.**
3. **Never touch robots.txt, .htaccess, wp-config.php, DNS, or permalink settings without asking first.**
4. **WordPress credentials:** Editor-role user only, Application Password from env var (`WP_APP_PASSWORD`). Never Admin. Never hardcode. Never commit.
5. **Git:** `--force-with-lease` only; never `--force`. Never commit secrets, DB dumps, or uploads.
6. **Never invent IDs, keys, prices, distances, phone numbers, emails, or facts.** Read from env/content files, or leave empty and flag. If a fact is missing, ASK — do not fill the gap.
7. **Medical/clinical content changes require Dr. Deepu John's sign-off** before staging→production. Flag them explicitly.
8. **Never merge or copy a staging database into production.**

## KTAHV LANGUAGE LOCK (GST SCN — applies to KTAHV pages ONLY)
- Required register: patient, physician, treatment, programme, Panchakarma, admission, discharge, consultation.
- **Banned words:** spa, resort, holiday, luxury, cure, journey, guests (any casing, all locales — check DE/FR translations for equivalents: e.g. Kur/Urlaub/Luxus, cure/vacances/luxe in banned senses).
- This lock does NOT apply to Villa Raag or KAPPL. Do not cross-apply.

## LOCKED FACTS (source of truth — grep against these)
- Public contact email everywhere: **info@kairali.com**
- Priya's KTAHV WhatsApp: **+91 92898 38797** (any occurrence of …38777 is WRONG — fix on sight, flag)
- KTAHV locales: **EN / DE / FR**. Every content change ships in all three or is explicitly flagged as EN-only pending translation.
- FR consultation-family slugs live under `/fr/…` — verify slug exists before linking.
- Two Deepus: "Deepu" = web developer (WP execution). "Dr. Deepu John" = chief physician (clinical sign-off). NEVER conflate in tasks, commits, or messages.

## PROOF-OF-WORK RULES (no self-reported success)
- No "done" without: a working URL that opens, or real terminal output, or a screenshot, or a passing spec run — pasted in full.
- Fixing one instance ≠ done. Grep/audit ALL instances, ALL page types, ALL three locales.
- Long/background commands: wait for and paste the real output. Never report before completion.
- After any content push: fetch the live/staging page and diff against intent. Show the diff.

## STANDARD WORKFLOWS
### Lane A — code change (Tier 1 sites only)
`feature/<task>` branch → edit → commit → push `staging` → Actions deploys → run spec suite → visual pass → PR to `main` → HUMAN approval → backup → deploy.

### Lane B — content change (any tier)
Generate paste file / REST payload → **commit paste file to `/content/`** → push to staging slug → run relevant specs + 19-gate check → preview link to Abilash → on approval, Deepu publishes (or approved script) → post-publish QA fetch.

### QA audit pass (weekly rotation)
Playwright MCP explore: broken links, 4xx/5xx, mixed content, mobile viewport render, banned-word scan (KTAHV only), schema presence, forms render + consent checkbox + privacy link, analytics `data-cta` firing, images loading, hreflang set. Output: `audits/<site>-<date>.md` with evidence links. No fixes applied in the same pass — findings only.

## TEST SUITE
`ktahv-critical-flows.spec.ts` is the deterministic gate. Run against `BASE_URL` (staging) before ANY Tier-1 deploy and after ANY Lane-B change to consultation/enquiry/contact/how-to-reach pages. All tests green or the change does not ship. Never edit a spec to make it pass — flag the failure.

## ESCALATION
Ambiguity about facts, money, medical claims, legal/GST language, or anything touching production → STOP and ask Abilash. A blocked task with a question beats a wrong task completed.

## UNATTENDED RULE (PHASE0 Playbook §M2.7)
When blocked on a question during unattended work, append it to QUESTIONS.md and move to the next queued task — do not stall. Unattended sessions end at commits, PRs, and preview links. Never DNS changes, never production pushes, never destructive commands while unattended.

## KNOWLEDGE & VERIFICATION DOCTRINE
- (a) `content-mined/` legacy content is an immutable raw-sources layer — never edited, only read.
- (b) Update the relevant `wiki/` page at every site launch (Ship Gate §E); pages link to sources, never duplicate them.
- (c) Wiki lint every Monday: contradictions, stale facts, gaps → fix PR. Same Monday pass: `pnpm audit` + Dependabot triage + hook self-test → findings to QUESTIONS.md or a fix PR.
- (d) Design skills/plugins NEVER override `packages/ui/brand-tokens.css` or `raag-tokens.css` — the brand manuals win.
- (e) `/security-review` must pass on every release diff (Ship Gate A-13).
- (f) Every task ends with a Checker pass: re-read the instruction, diff claim vs machine evidence, list anything unverified as unverified.
- (g) A failing gate/hook/CI is NEVER fixed by weakening it — fix the cause or escalate to QUESTIONS.md.
- (h) Tier-1 site PRs also run a code-review stage before Abilash's approval.
- (i) Engineering standards live in docs/ENGINEERING_STANDARDS.md and are binding on every site.

## CRASH RESILIENCE (M2 has no power backup until ~Sep 2026)
Work in small units and make state durable continuously: commit + push after every meaningful unit (never batch hours of work uncommitted); long research/build outputs stream to repo files as they progress, not only at the end; after any crash, `git status` + QUESTIONS.md + wiki/log.md are the recovery map. Slow and durable beats fast and lost.

Every log entry (QUESTIONS.md, LEARNINGS.md, DECISIONS.md, wiki/log.md, MORNING_BRIEF.md, audits/, launches/) is timestamped to the SECOND in IST: `YYYY-MM-DD HH:MM:SS IST` — date-only entries are a lint finding. Git commits carry second-precision timestamps automatically (`git log --format=%ci`).

## LAUNCH EVIDENCE & COMPETITIVE RESEARCH (Abilash directives, 13 Jul 2026)
- Every site launch produces `launches/<domain>/` containing: the FILLED sitewide checklist, FILLED pagewise checklist (docs/checklists/ are the masters), and Ship Gate evidence — committed to git as permanent, auditable history. A launch without its filled checklists in the repo is not a launch.
- Before building any revenue site: research the niche's competitors — their SEO strengths, SEM/ads behaviour, and practitioner insight from YouTube/Reddit/forums on what makes a high-ROI site in that niche. Findings go to `docs/<entity>-inputs/` or the site's wiki page BEFORE design decisions are made. The KTAHV comp set (docs/ktahv-inputs/comp-set.md) is the model.

## CHANGELOG
- v1.0 (13 Jul 2026): Initial lock.
- v1.1 (13 Jul 2026): Appended Factory Rules (Runbook §7) and Unattended Rule (PHASE0 §M2.7) per the launch-pack placement instructions.
- v1.2 (13 Jul 2026): Knowledge & Verification Doctrine (a–i), Crash Resilience rule, standards pointer.

## FACTORY RULES (monorepo)
- Every site lives in sites/<domain>, built ONLY from packages/* — no copy-pasted components.
- Every page is MDX with complete frontmatter: title, description, locale, keywords[], schemaType, cta.
- Locales: EN always; DE/FR where the site brief says so. A page missing a locale is flagged, never silently EN-only.
- Product cards use packages/product-card (Shopify Storefront API). NEVER build a cart, checkout, or payment form — checkout is the main Shopify store, always.
- Landing pages live at /lp/<campaign>, noindex by default, single CTA, data-cta events required.
- Entity register: KTAHV pages = clinical lock (see above). Villa Raag / hospitality = wellness-hospitality register. KAPPL/product sites = product-pharma register. kairali.com = group-corporate register (clinical lock applies ONLY to KTAHV sections/links).
- A site ships when: pnpm build clean · spec suite green · Lighthouse ≥ 90 perf / 100 SEO on key templates · compliance lint zero findings · Abilash approved the Vercel preview.
- DNS flips are HUMAN actions. The agent prepares; Abilash/Ambuj flip.
