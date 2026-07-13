# BACKLOG.md — the sprint's calendar + scratchpad (single source of "what and when")

**Rules (binding on every session, human or agent):** every task lives here in exactly
one section. Finishing work = move the line to DONE with a second-precision IST
timestamp. New/future work = add under SCHEDULED with its trigger date or condition.
The 07:05 morning brief reads this file daily and surfaces anything due. Nothing is
deleted — history is the point.

## NOW (this week — Wave 0 / Days 1–6)
- [ ] Mine image sources per image-library/README registry (KTAHV video folder CONFIRMED; folder 1LlD59… needs sharing fix; albums via browser) → image-library/ + per-site IMAGE_MANIFEST swaps
- [ ] Design-critic gate: formalize as scripts/design-review prompt + Ship Gate step
- [ ] Write arogyakendra retro into LEARNINGS.md (Ship Gate §E — file is empty; learning loop not running) [gap: SPRINT_STATE #10]
- [ ] Build packages/seo + schema + i18n for REAL (2-line stubs today): meta/canonical/robots/sitemap/llms.txt, reciprocal hreflang, JSON-LD templates — extract from arogyakendra [gap #4]
- [ ] Brand lint (Ship Gate A4: rogue hex, marigold-as-body, focus rings, 44px) mechanized into CI [gap #2]
- [ ] Factory per-site spec-suite template (Ship Gate A2: locked facts, forms+consent render, locale switcher, mixed content) [gap #3]
- [ ] packages/consent (banner + Google Consent Mode v2) + packages/analytics (GA4/GTM loader, data-cta events) — code with env-var IDs [gap #4/#5]
- [ ] Lighthouse CI vs Vercel preview in gate.yml (A5 TODO) + /security-review CI step (A-13; needs ANTHROPIC_API_KEY secret) [gap #1/#7]
- [ ] Forms v1.1: Cloudflare Turnstile (Checklist FORMS v1 freeze names it; absent from packages/forms) [gap #6]
- [ ] Forward-farm artifacts per D1 rules 5/7: in-repo Cloudflare bulk-redirect mapping CSV + curl verification script + audits/ dir (flips = human, timing-guarded) [gap #8]
- [ ] Register-table + PROJECT_CONTEXT §3 correction via DECISIONS: kairali.guru LIVE site is EN-only (verified 13 Jul); 5 locales exist only in Eeshal's repo [gap #14]

## SCHEDULED (date- or condition-triggered)
- [ ] Wave 1 product microsites (Days 7–13, from 20 Jul): kairalitea, kairalioil, kairaliherbals, kairaliorganic(+kairorganics/kairproducts per D3 two-brand ruling), kairaliequipment, bulk×2 — needs Shopify Storefront token (Ambuj/Abilash)
- [ ] arogyakendra richer version (multi-section) — AFTER image library lands; single-pager is deliberate v1
- [ ] Wave 2 (Days 13–19): franchise, centers, yoga, whatisayurveda (.com canonical per D2, .org 301s), healing.recipes
- [ ] Wave 2: kairali.guru migration into sites/ per docs/site-briefs/kairali-guru-migration.md (~5.5–6 d; first step = mine.py kairali.guru + repo freeze) — gate: Eeshal org invite + her final push
- [ ] Per-wave SEO baselines (MIGRATION_PLAYBOOK §4): docs/baselines/<site>/ GSC Performance/Index + GA4 + crawl exports BEFORE each wave's cutover — gate: GSC/GA access (see WAITING ON, Vikash)
- [ ] Chatbase per-entity KB pipeline (Ship Gate B9: MDX export per entity on merge + scheduled recrawl) — after the four entity bots replace the interim Priya bot (DECISIONS 18:51)
- [ ] Interim uptime monitoring for launched sites (Ship Gate B10) until Fleet Pulse lands in Wave 3
- [ ] sites/theblushlounge.com build (E register, personal brand, per docs/site-briefs/theblushlounge.md) — gates: Abilash wave-slot ruling + WhatsApp-number/brand-assets answers (QUESTIONS 19:38); snehachowdhary 301 flips only when it is LIVE
- [ ] Wave 3 (Days 19–25): Fleet Pulse dashboard on kairali.ai (internal dashboards home), corporate/brand sites, MainWP
- [ ] Wave 4 (Days 25–29): kairali.com flagship (content preload starts Day 14)
- [ ] Monday ritual (every Mon, first: 20 Jul): wiki lint + pnpm audit + Dependabot triage + hook self-test
- [ ] KTAHV migration (POST-sprint, own 3–4 week plan) — gate: docs/ktahv-inputs/ corpus ingested + Dr. Deepu John sign-off lane
- [ ] Locale expansions (DE for kairali.com/hospitality, RU/CS etc.) — gate: native-reviewed banned lists per locale

## WAITING ON (people)
- [ ] Abilash: group WhatsApp number (non-KTAHV CTAs) · ink hex + 10-step ramps + logo SVG pack (Q14–17) · Raag web type scale · KTAHV auditor GPT prompt export · GitHub org invites (emails below) · historical-chat corpus if Drive sweep misses it · ANTHROPIC_API_KEY repo secret (security-review CI) · theblushlounge rulings (hosting outage, WhatsApp number, brand assets, wave slot — QUESTIONS 19:38) · kairali.guru rulings (student-hub, course prices — QUESTIONS 19:44)
- [ ] Vikash (digital marketing): GA4 + GTM + Google Ads + GSC + Bing Webmaster access/handover — gates Ship Gate B3–B7 for EVERY launch (measurement lane; currently nobody owns this)
- [ ] Satyam (dme@kairali.com): PRODUCTION webhook URL · consent-field answer · delete 3 test rows
- [ ] Sunaj (sysadmin@kairali.com): arogyashala.in DNS/registrar (message drafted 13 Jul)
- [ ] Ambuj (dme@kairaliproducts.com): registrar access sheet · Chatbase inventory · server audit · Semrush key · Shopify Storefront API token
- [ ] Deepu (developer@kairali.com): KTAHV WP tech-fix spec execution (sitemap_index 404 etc.)
- [ ] Eeshal (github.com/Eeshal27): stop standalone repo, move to Factory PRs after org invite

## DONE (most recent first)
- [x] 2026-07-13 19:47:20 IST — Governing-docs re-read (Abilash order): ALL of CLAUDE.md, PROJECT_CONTEXT, Ship Gate, Register, ENGINEERING_STANDARDS, MIGRATION_PLAYBOOK, both checklists, both brand manuals, all wiki pages, BACKLOG/QUESTIONS/DECISIONS + repo mechanization audit → docs/SPRINT_STATE.md (15 gaps, top-10 next actions with gates); missing items added to NOW/SCHEDULED/WAITING ON above
- [x] 2026-07-13 19:44:30 IST — Eeshal repo (kairali-guru-) evaluated vs live kairali.guru → docs/site-briefs/kairali-guru-migration.md (verdict: usable baseline — keep architecture/i18n/redirect map, replace forms/analytics/consent/palette with Factory packages; ~5.5–6 d Wave-2 plan; live site is EN-only + dead UA analytics; security finding: hardcoded student-hub credential in her public repo)
- [x] 2026-07-13 19:38:12 IST — theblushlounge.com mined (primary per D6; origin DOWN — Wayback provenance, latest capture Nov 2025) + docs/site-briefs/theblushlounge.md (E-register single-site structure, snehachowdhary.com→theblushlounge.com 301 plan per D1; snehachowdhary.com = GoDaddy parking lander, no content); outage + number-conflict + brand-asset questions → QUESTIONS.md
- [x] 2026-07-13 19:22:05 IST — Drive sweep for KTAHV strategy corpus: 28 documents ingested to docs/ktahv-inputs/ (MOA Matrix v3.0 handover, MOA marketing action points, B2B Landscape FY26, Villa Raag buyer journey, Harmony content brief pack, agency SEO proposal pack SALT+Delante+SmartSites, clinical-framing audit summary (316/471 pages flagged), competitor-intelligence programme W1–W6 + Tier 1A/1B universe, strategic language targeting matrix, + 20 competitor dossiers in competitor-dossiers/). NOT FOUND (ask Abilash): standalone European Buyer Journey doc (only DA1–DA3/FR1–FR3 cohort summaries + M1/M2 moments embedded in Harmony pack; 8-stage source doc absent from Drive) · KTAHV_MOA_Matrix_v3_0.xlsx workbook (handover's must-attach; only the handover doc is in Drive) · folders 1LlD59… (KTAHV New Shoot 2025) and 1WTBf-… (Villa Raag Images) still list no children to director@kairali.com (sharing fix pending, matches media-catalog finding)
- [x] 2026-07-13 19:22:05 IST — D1 forward-strategy research + decision: SEMANTIC MAP adopted (docs/research/forward-strategy-D1.md; DECISIONS.md appended); Cloudflare bulk-redirect implementation rules incl. 301-only, no chains, never in Ads final URLs, timing guard on unbuilt targets
- [x] 2026-07-13 19:21:40 IST — KTAHV content guides ingested to docs/ktahv-inputs/ (verbatim, with source fileIds): Stars-of-Kairali-Nakshatra-Guide, Kairali-Nakshatra-Villa-Spec (all 5 sheets via xlsx), Healing-Secrets-of-Kairali (= what Abilash called "link secrets"), EXTRACTED-villa-nakshatra-mapping (carries 212-category + suite-name conflicts)
- [x] 2026-07-13 19:21:40 IST — Media catalog v1 committed (docs/media/MEDIA_CATALOG.csv): 26 rows — 19 KTAHV 2023 pro-shoot videos (metadata-cataloged, needs-visual-pass), 5 Shopify launch-pack docs, 2 folders access-pending ("KTAHV New Shoot 2025 HO centre" 1LlD59…, "Villa Raag- Images" 1WTBf-…: children not shared with director@kairali.com); 0 images viewable this pass; image-library/README.md pointer added
- [x] 2026-07-13 19:17:20 IST — arogyakendra v2 shipped + live-verified (HTTP 200, new h1, WhatsApp CTA live): brand-manual design pass (Kurale/Asap/Lato via next/font, placeholders + IMAGE_MANIFEST, sticky mobile WhatsApp bar), interim Priya WhatsApp + Chatbase per DECISIONS, sitemap/robots/OG/JSON-LD conformance, design-critic pass 9.2/10 (launches/arogyakendra.com/design-review.md)
- [x] 2026-07-13 19:16:54 IST — launches/arogyakendra.com/ retro-filled: sitewide + pagewise checklists committed with curl/build/lint evidence; GSC/Bing/GA4/DNS items marked pending honestly
- [x] 2026-07-13 18:47:18 IST — BACKLOG system created; team emails recorded
- [x] 2026-07-13 18:42:22 IST — packages/forms v1 built + LIVE-verified against Satyam's test webhook (B8 evidence in docs/integrations/crm-forms-spec.md)
- [x] 2026-07-13 ~18:30 IST — brand manuals ingested (text + PDFs), raag-tokens.css created (D8 closed); comp set ingested; checklists ingested + made law; plugins installed
- [x] 2026-07-13 ~17:30 IST — Wave 0: arogyakendra.com built+deployed; estate sweep (87 domains, 40 RED); Wave-0 mining done
- [x] 2026-07-13 (day) — Factory stood up end-to-end: repo→org→Vercel Pro, hooks, CI, wiki, morning brief, migration playbook, Vercel deploy pipeline verified
