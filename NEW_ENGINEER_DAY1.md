# NEW ENGINEER — DAY 1 (13 Jul 2026)
**For: the engineer who joined today (name: ______ — write it in, then update PROJECT_CONTEXT §2 and SHOPIFY_TRACK_CONTEXT §8).**
**From: Abilash. Read §1–2 before our sit-down; we'll walk §3 together.**

## 1 · WHAT YOU'VE JOINED (10-minute read)
Kairali Ayurvedic Group (since 1908) is rebuilding its entire digital estate in a 30-day sprint that started this weekend: ~28 websites rebuilt on a Next.js "Factory" (GitHub monorepo → Vercel), ~35 domains consolidated into redirects, one WordPress hospital site (KTAHV) stabilized then migrated after the sprint, and the Shopify store (KAPPL products — the group's only checkout) audited and brought under the same engineering system. The builder is Claude Code running on the office M2 Mac, day and night. The system is governed by documents in the repo, not by anyone's memory — including yours and Abilash's.

**Your reading order (about 2 hours, in the repo `kairali-web-factory`):**
1. START_HERE.md → 2. PROJECT_CONTEXT.md (the brain) → 3. CLAUDE.md (the law — it governs humans too) → 4. SITE_LAUNCH_CHECKLIST_v1.0.md (definition of done) → 5. SITE_DESIGN_LOCALE_REGISTER.md → 6. SHOPIFY_TRACK_CONTEXT.md → 7. docs/ (runbook, Phase-0, Fleet OS, engineering standards).

**Five rules that never bend (you'll be tested by reality, not by me):**
- Two Deepus: Deepu = WordPress developer; Dr. Deepu John = chief physician. Never conflate.
- Locked facts are grep-verifiable: info@kairali.com everywhere; Priya's WhatsApp is +91 92898 38797 (…38777 is a bug — kill on sight).
- Entity language locks: KTAHV = clinical register only (never spa/resort/holiday/cure); KAPPL = product/pharma with claims rules per buyer's country; Villa Raag = hospitality is fine, and it has its OWN brand system.
- Forever-human actions (no agent, and not you without Abilash): DNS, production WordPress, theme publishing, Shopify Settings/payments/prices, Google Ads changes, payments/plans, deletions.
- A failing gate is never fixed by weakening the gate.

## 2 · YOUR ACCESS (least privilege, own named accounts — never shared passwords)
Request today via Ambuj/Abilash: GitHub — collaborator with write (CODEOWNERS keeps the governing files behind Abilash's approval) · Vercel — team member · Shopify — STAFF account limited to themes, products, orders-view (NOT settings, NOT payments) · Sentry — member · Fleet Pulse (kairali.ai) — viewer · Cloudflare — none yet (read access comes later if needed). Set up 2FA on everything before end of day.

## 3 · THE SIT-DOWN — 90-minute agenda (Abilash + you, tomorrow 14 Jul)
1. **System tour (15 min):** the repo live on the M2; watch one Claude Code exchange; Remote Control on the phone; where preview links and QUESTIONS.md live.
2. **The unbendables (10 min):** the five rules above, out loud, with the why (GST notice history, the two-Deepus incident risk, the 38777 bug).
3. **Shopify track kickoff (20 min):** walk SHOPIFY_TRACK_CONTEXT.md together; the Stage-0 question (one store with Markets, or two? — known handle: kairali-products.myshopify.com); Triple Whale rules you must know (D8: Moby Autopilot stays OFF; Moby's landing-page builder is banned; its analytics/alerts are welcome); the W1 shipping project (Part 4 of your runbook) — fill the platform-name blanks together; the audit's "who clicks" column — most of those clicks become yours.
4. **Your ownership areas (20 min) — proposed, adjust in the meeting:**
   - Daily (~30 min): Fleet Pulse triage; answer factual items in QUESTIONS.md; QA new Vercel preview links against the Ship Gate B-evidence.
   - Weekly (Mondays): review the wiki lint + Shopify catalog-lint PRs; apply approved catalog fixes in the Shopify admin; hook self-test check.
   - Monthly: catalog CSV backup export; access-register review with Ambuj.
   - Project: complete the access harvest (registrar-first) with Ambuj; be the human hands for the Windows/Linux server audit.
5. **Working agreement (10 min):** you may (should) use Claude Code yourself — the same CLAUDE.md governs your sessions; everything through branches and PRs; you approve nothing into the governing files (that's CODEOWNERS = Abilash); when unsure, QUESTIONS.md, not guesswork.
6. **Week-1 plan (10 min):** Day 1–2 read + access + shadow; Day 3 run sweep.sh yourself and re-read the results against the runbook waves; Day 4 own the Shopify audit fix-table execution (the "engineer" rows); Day 5 first Monday-ritual dry run.
7. **Questions (5 min)** — anything unanswered goes in QUESTIONS.md, tagged #onboarding.

## 4 · HOW TO WORK WITH THE AGENT (the culture in one paragraph)
Claude Code is a tireless, extremely capable junior who must show evidence for everything and is physically blocked (hooks, CI, branch protection) from the dangerous stuff. Your job is not to compete with it — it's to be the judgment layer: review its previews like a customer would, answer its questions like an owner would, and catch the things only a human in Palakkad/Delhi context would know. When you teach it something twice, stop — put it in LEARNINGS.md or a wiki page so it's taught forever.

*Welcome aboard. — Abilash*
