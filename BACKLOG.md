# BACKLOG.md — the sprint's calendar + scratchpad (single source of "what and when")

**Rules (binding on every session, human or agent):** every task lives here in exactly
one section. Finishing work = move the line to DONE with a second-precision IST
timestamp. New/future work = add under SCHEDULED with its trigger date or condition.
The 07:05 morning brief reads this file daily and surfaces anything due. Nothing is
deleted — history is the point.

## NOW (this week — Wave 0 / Days 1–6)
- [ ] **Abilash: merge PR #2 (Docs sync v2 + Shopify track)** — all checks green as of 11:15 IST; governing files, needs his one-click
- [ ] **Abilash: relink Vercel project kairali-web-factory-abhilashkr** → Settings→Git→connect kairali-digital/kairali-web-factory (still points at pre-transfer personal repo; site can't deploy until relinked; does NOT block PR #2)
- [ ] Per-site IMAGE_MANIFEST swaps using IMAGE_CATALOG.csv (library is downloaded + described — see DONE 14 Jul)
- [ ] Compliance triage: 158 YouTube titles flagged as possible health claims (VIDEO_CATALOG.csv) — vet before any embed on KTAHV surfaces
- [ ] Chase: Google Photos album 9UCcY3jv4zi6byq48 is DEAD (HTTP 500) — Abilash to reshare if its contents matter
- [ ] **Abilash: merge PR #3 (Wave-0 mechanization, branch claude/vigorous-swanson-7a2b7c) AFTER PR #2** — it adopts PR #2's checklist/gate.yml as base; merging it first would conflict PR #2
- [ ] Lighthouse CI vs Vercel preview in gate.yml (A5 TODO) + /security-review CI step (A-13; needs ANTHROPIC_API_KEY secret) [gap #1/#7] — also gated on the Vercel relink above
- [ ] Forms v1.1: Cloudflare Turnstile (Checklist FORMS v1 freeze names it; absent from packages/forms) [gap #6]
- [ ] Abilash rulings from 14 Jul QUESTIONS: brand-lint exemptions (abhilashkr/kairali.ai) + CI-matrix membership · kairaliproduct.com forward family · raagcasa/raagvilla/theraagvilla ownership · whyayurveda interim target · where ktahv.com's existing 301 is configured · consent-banner × Chatbase bubble overlap

## SCHEDULED (date- or condition-triggered)
- [ ] Immediately after PR #2 merges: patch PROJECT_CONTEXT.md §1/§3/§7 kairali.guru locale lines to EN-only-live (DECISIONS 2026-07-14 11:59:06 IST; register row already fixed) + re-read PROJECT_CONTEXT/Checklist per handoff instruction
- [ ] At each Wave-1 product-microsite launch: re-point its forward-farm rows target_now→target_final in docs/redirects/forward-farm.csv + regenerate cloudflare-upload.csv + human re-upload + scripts/verify-forwards.sh (same-edit rule, never chain)
- [ ] Wave-2 whatisayurveda.com cutover: re-point whyayurveda.com/.in/.org AND whatisayurveda.org in ONE list edit (D2; forward-farm.csv notes)
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
- [x] 2026-07-14 11:59:46 IST — Design-critic gate formalized: scripts/design-review/PROMPT.md + Ship Gate B-14 (checklist edit on PR #2's base) + kairali.guru EN-only-live correction (register row + DECISIONS; PROJECT_CONTEXT patch queued post-PR#2) [gaps #13/#14 closed]
- [x] 2026-07-14 11:56:45 IST — Forward farm per D1 rules 5/7: docs/redirects/forward-farm.csv (43 rows, sweep-verified spellings, LIVE-verified canonical targets — kairalicenters + AHV are apex) + forward-farm-export.mjs (36 CF rules; 7 HELD w/ gates) + verify-forwards.sh + audits/. Findings: ktahv.com ALREADY correctly 301s (4/4 PASS); arogyashala.co.in flip BLOCKED (target DNS-dead, source live) [gap #8 closed]
- [x] 2026-07-14 11:48:53 IST — arogyakendra retro → LEARNINGS.md (learning loop running; headline: human 9.2/10 review missed two 44px violations that machine gates caught) [gap #10 closed]
- [x] 2026-07-14 11:47:34 IST — packages/consent + analytics REAL: Consent Mode v2 default-denied → banner → stored re-apply (browser-verified order default→update, event capture, zero loaders w/o env IDs); data-cta delegation queues events until Vikash's measurement handover [gaps #4/#5 code side closed]
- [x] 2026-07-14 11:38:48 IST — Ship Gate A4+A2 mechanized: packages/ui brand lint (rogue-hex/rogue-color/marigold-text/focus-strip/tokens-import) + tests/factory spec suite (locked facts, consent, hreflang, mixed content, 44px, focus, meta limits, JSON-LD) + factory-gate.yml CI (NEW file — no PR #2 conflict). Caught + fixed 2 real A4 bugs on arogyakendra (16px footer CTAs, 40px header pill) [gaps #2/#3 closed]
- [x] 2026-07-14 11:29:33 IST — packages/seo + schema + i18n built for REAL and arogyakendra refitted to consume them (Factory premise now true for seo/schema/i18n): A6 limits THROW at build, /lp noindex default, reciprocal hreflang by construction, locked-facts-fed JSON-LD builders, NEW /llms.txt; 42 tests; curl-diffed against previous output [gap #4 closed]
- [x] 2026-07-14 11:12:43 IST — Gate CI fixed on PR #2: gitleaks-action requires paid license for org repos → replaced with pinned gitleaks CLI (full-history scan, strength unchanged) + .gitleaks.toml allowlisting 88 verified non-secrets (expired Perplexity S3 presigned URLs in ingested docs + public acobot widget key in mined legacy HTML); canary-tested real keys still trip; run 29309257932 green ("69 commits scanned, no leaks found"). Vercel abhilashkr failure root-caused: project git-linked to pre-transfer personal repo (NOT commit email — same commit deployed green on 2 other projects); relink is a NOW item for Abilash
- [x] 2026-07-14 10:48:35 IST — PR #2 "Docs sync v2 + Shopify track" opened per mentor's UPDATE TASK: synced PROJECT_CONTEXT/Checklist/START_HERE from kairali-launch-pack, added SHOPIFY_TRACK_CONTEXT + 6 shopify-agents + people docs; CLAUDE.md/DECISIONS/QUESTIONS/LEARNINGS/wiki untouched; awaiting Abilash approval
- [x] 2026-07-14 10:45:50 IST — IMAGE_CATALOG.csv complete: 798 rows, every image vision-described (category/description/tags/semantic-name/best-use, KTAHV clinical register enforced); library = products 561 + ktahv 50 + raag 158 + influencers 29 (~2.4GB originals in ~/Claude/Kairali-Digital/image-library/, outside git)
- [x] 2026-07-14 10:36:13 IST — VIDEO_CATALOG.csv complete: 458 rows all described — 355 YouTube (EMBED decision; enriched w/ upload date/age/duration/views/description via yt-dlp android client; 158 health-claim flags) + 19 KTAHV 2023 shoot (hosted, 5.9GB) + 84 KTAHV 2025 raw clips (hosted, 15GB; poster-frame vision pass: 37 bridal-model, 19 yoga, 22 grounds/nature B-roll, largely NOT clinical footage)
- [x] 2026-07-14 09:42:10 IST — Image mining executed end-to-end (the "dispatch" gap): Drive link-shared folders via web-UI ID scrape + curl-by-id (Drive search API can't list anyone-with-link folders), Google Photos via =d full-res, villaraag.com gallery crawl; dispatch's 583-row product mapping rescued from local-agent-mode outputs/ into docs/media/kairali-product-images/
- [x] 2026-07-14 ~09:20 IST — Secret purge: kairali1908 removed from ALL git history (filter-branch + force-with-lease; old SHAs dead), verified clean across every ref; Eeshal repo still public w/ live credential — rotation + private flip on her, chase-up pending
- [x] 2026-07-14 08:23:27 IST — Morning brief Day 2 committed (98ee03f)
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
