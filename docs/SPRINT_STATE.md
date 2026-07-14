# SPRINT_STATE.md — one-screen state of the sprint

**2026-07-14 12:01:30 IST · Day 2 of 30 (13 Jul → 12 Aug 2026) · updated after the Wave-0 mechanization session (branch claude/vigorous-swanson-7a2b7c, PR pending — merge AFTER PR #2).**
**Refresh: rewrite this file whenever the picture changes materially (each wave gate at minimum); history via git.**

## Closed 14 Jul (mechanization session — evidence in the six commits 11:29–11:59 IST)
- Gap #4 (packages are stubs): **seo / schema / i18n / consent / analytics are REAL** and arogyakendra consumes them (A6 limits throw at build; reciprocal hreflang by construction; Consent Mode v2 default-denied verified in-browser; data-cta events queue until measurement IDs land). product-card still a stub (Wave-1, Shopify token gate).
- Gap #2 (brand lint) + #3 (spec template): **merge-blocking in .github/workflows/factory-gate.yml** — packages/ui/bin/brand-lint.js (static A4) + tests/factory/factory-site.spec.ts (A2 + browser A4, mobile-first). Caught and fixed two real 44px violations the 9.2/10 human review missed.
- Gap #8 (D1 artifacts): docs/redirects/forward-farm.csv (43 rows; 36 uploadable, 7 HELD with gates) + export + verify scripts + audits/. Finding: ktahv.com already 301s correctly; arogyashala.co.in flip BLOCKED (target DNS-dead, source live — Sunaj).
- Gap #10 (LEARNINGS empty): arogyakendra retro written; learning loop running.
- Gap #13 (design-critic gate): scripts/design-review/PROMPT.md + Ship Gate B-14.
- Gap #14 (stale locale fact): register row fixed + DECISIONS; PROJECT_CONTEXT patch queued post-PR#2.

## What is LIVE / DONE (evidence in git)
- Factory end-to-end: monorepo → kairali-digital org → Vercel Pro; CI gate (build + compliance lint + pnpm audit + gitleaks); hooks; wiki; morning brief; Migration Playbook.
- **arogyakendra.com v2** shipped to Vercel + design-critic 9.2/10 + retro-filled launch checklists (DNS/GSC/GA4 honestly pending — C-items).
- sites/kairali.ai (deploy-chain placeholder) · sites/abhilashkr (imported).
- Estate truth: sweep of 87 domains (47 live, 40 RED). Wave-0 mining done + theblushlounge.com (Wayback — origin DOWN, see QUESTIONS 19:38).
- Corpus: brand manuals ingested + tokens built (incl. raag-tokens.css — D8 delivered); 28 KTAHV strategy docs + 20 competitor dossiers; checklists law; D1 forward strategy CLOSED (semantic map); forms v1 built + live-tested against Satyam's TEST webhook.
- Briefs: theblushlounge.com (D6) + kairali.guru migration evaluation (Wave 2) in docs/site-briefs/.

## GAPS — what the governing docs demand that is NOT yet mechanized
1. **Ship Gate A5 Lighthouse budgets** — gate.yml TODO; no Lighthouse CI vs Vercel previews.
2. **Ship Gate A4 brand lint** — ENGINEERING_STANDARDS says "brand lint fails the build"; no rogue-hex/marigold-body/focus/44px lint exists anywhere.
3. **Ship Gate A2 spec suite** — only tests/ktahv-critical-flows.spec.ts; no per-Factory-site spec template (locked facts, forms+consent render, locale switcher, mixed content).
4. **packages/seo · schema · i18n · consent · analytics · product-card · ui/src are 2-line STUBS** (charters only). Everything A6–A9 + A12 (meta/canonical/sitemap/llms.txt, hreflang reciprocal, JSON-LD, OG render, consent banner + Google Consent Mode v2) was hand-rolled for arogyakendra, not extracted into packages — the Factory premise ("sites built ONLY from packages/*") is not yet true.
5. **Measurement lane (B3–B7) has NO access and no wiring**: GA4/GTM/Ads/Meta/LinkedIn/Bing/GSC/Bing-WMT — "a site without this does not launch," and nobody owns handing over access (Vikash not in WAITING ON).
6. **Forms v1 incomplete vs its own freeze spec**: Turnstile absent, production webhook pending (Satyam), consent-field question open.
7. **Ship Gate A-13 /security-review** — not in CI (needs ANTHROPIC_API_KEY secret).
8. **D1 execution artifacts missing**: in-repo Cloudflare bulk-redirect CSV (rule 5), curl verification script + audits/ dir (rule 7).
9. **MIGRATION_PLAYBOOK §4 baselines**: docs/baselines/<site>/ (GSC/GA/crawl exports) — none exist; gated on §5 access.
10. **LEARNINGS.md is EMPTY** — Ship Gate §E demands a retro after every launch; arogyakendra launched without one. The learning loop is not running.
11. **Chatbase entity-bot KB pipeline** (per-entity MDX export on merge + recrawl, B9) — not built; interim single-bot ruling (DECISIONS 18:51) is live policy.
12. **B10 uptime monitoring** — nothing until Fleet Pulse (Wave 3); no interim monitor.
13. **Design-critic gate** — run ad hoc for arogyakendra; not scripts/design-review + Ship Gate step (BACKLOG NOW item, still open).
14. **Register-table stale fact**: kairali.guru live site is EN-only (verified today); table says "EN/DE/FR/AR/RU — live" (locales exist only in Eeshal's repo). PROJECT_CONTEXT §3 carries the same claim. Amend via DECISIONS.
15. **Monday ritual + weekly QA audit rotation** — no automation/calendar hook yet (first due 20 Jul).

## TOP 10 NEXT ACTIONS (Wave 0/1 leverage order, with gates)
1. **Build packages/seo + schema + i18n for real** (meta/canonical/robots/sitemap/llms.txt, hreflang, JSON-LD templates) — extract from arogyakendra. Gate: none. Every Wave-1 site consumes these.
2. **Brand lint (A4) + factory spec-suite template (A2)** into CI. Gate: none.
3. **packages/consent (Consent Mode v2 banner) + packages/analytics (GA4/GTM loader, data-cta events)** — code first with env-var IDs. Gate: none for code; IDs need action 4.
4. **Measurement access handover** — GA4/GTM/Ads/GSC/Bing (Vikash/Abilash): add to WAITING ON, blocks B3–B7 for every launch. Gate: humans.
5. **Lighthouse CI vs Vercel preview + security-review step in gate.yml.** Gate: ANTHROPIC_API_KEY secret (Abilash) for the latter only.
6. **Write arogyakendra retro into LEARNINGS.md** (start the loop; feeds actions 1–3). Gate: none. Overdue.
7. **Forms v1.1**: add Turnstile; chase production webhook + consent-field answer (Satyam). Gate: Satyam + Turnstile keys.
8. **Forward-farm CSV + verification script committed** (D1 rules 5/7; audits/ dir). Gate: flips are human (Abilash/Ambuj) and per-family timing-guarded on live targets.
9. **Wave-1 prep**: mine the product-microsite domains + Shopify Storefront token chase (Ambuj) — token gates packages/product-card and all of Wave 1 (starts Day 7).
10. **Design-critic gate formalized** (scripts/design-review + Ship Gate step) + register-table/PROJECT_CONTEXT locale-fact correction via DECISIONS. Gate: none.

**Standing human blockers (unchanged, see BACKLOG WAITING ON):** image-folder sharing fixes (media for placeholder swaps) · ink hex + ramps + logo SVGs (Q14–17) · GitHub org invites (unblocks Eeshal→Factory PRs, gates kairali.guru Wave-2 freeze) · registrar/Cloudflare consolidation (Ambuj/Sunaj) · group WhatsApp number.
