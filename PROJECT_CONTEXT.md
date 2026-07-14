# PROJECT_CONTEXT.md — Kairali Web Rebuild
**v1.0 · 13 Jul 2026 · Owner: Abilash (Executive Director)**
**Read this first. You (the agent) have NO access to past chats or memories. This file + the Standing Docs Index (§10) are your entire institutional memory. If a fact is not here or in a referenced doc, ASK — never guess.**

---

## 1 · WHO WE ARE
Kairali Ayurvedic Group — a 118-year family business (since 1908; founders' family: K.V. Ramesh & Gita Ramesh; Executive Director: Abilash). Tagline: *health through ayurveda* (always lowercase). Three entities with DIFFERENT rules:
- **KTAHV** — Kairali, The Ayurvedic Healing Village (ayurvedichealingvillage.com): NABH-accredited Ayurvedic **hospital**-retreat, Kodumbu/Olassery, Palakkad, Kerala. Clinical register ALWAYS.
- **KAPPL** — Kairali Ayurvedic Products Pvt. Ltd.: WHO-GMP-certified Ayurvedic pharma/products manufacturer. Product/pharma register. E-commerce runs on **Shopify** (checkout/payments live there and ONLY there).
- **Villa Raag** — boutique wellness property, Agonda, South Goa. Hospitality/wellness register is CORRECT here.
Also: ~18 Ayurvedic Centres across 9 countries (kairalicenters.com), training arm (kairali.guru, live Next.js, EN-only today), franchise arm.

## 2 · PEOPLE & ROUTING
- **Abilash** — decisions, approvals, DNS flips. The only production gate.
- **Ambuj** — infra/access/security/MainWP/servers.
- **Deepu (web developer)** — executes WordPress specs. **Dr. Deepu John (chief physician)** — clinical sign-off on medical content. TWO DIFFERENT PEOPLE. Never conflate. Medical pages need Dr. Deepu John, not Deepu.
- **Anupam** — head of marketing. **Vikash** — digital marketing/Google Ads/GSC. **Ritu** — EA.
- **New engineer (joined 13 Jul 2026; name TBD — update)** — daily ops, QA, Shopify catalog hygiene, Monday lint triage; onboarding: NEW_ENGINEER_DAY1.md.
- **Gita Ramesh** — co-founder, cookbook author, central brand & clinical authority (bylines, E-E-A-T anchor, healing.recipes).
- Content team — writes/edits words only; publishes nothing directly.

## 3 · LOCKED FACTS (grep-verifiable; wrong values are bugs)
- Public contact email everywhere: **info@kairali.com**
- Priya's KTAHV WhatsApp: **+91 92898 38797** (…38777 is a known-bad value — remove on sight)
- KTAHV locales: EN/DE/FR. kairali.guru LIVE site: EN-only (verified 13 Jul 2026 — DECISIONS 14 Jul; EN/DE/FR/AR/RU exist only in Eeshal's repo, Wave-2 target). Others per SITE_DESIGN_LOCALE_REGISTER.md.
- Group heritage: since 1908. KTAHV: NABH-accredited. KAPPL: WHO-GMP.

## 4 · COMPLIANCE STACK (all machine-gated where possible)
1. **KTAHV GST clinical lock** (KTAHV surfaces only): say patient/physician/treatment/programme/Panchakarma/consultation. NEVER: spa, resort, holiday, luxury, cure, journey, guests, getaway, escape (all locales — check DE/FR equivalents). Name conditions and programmes; no cure claims.
2. **Brand voice, group-wide** (Brand Manual 2026 ch.11): warm, precise, unhurried; "our"/"you"; Title Case headings, sentence-case body; botanical names italic; no emoji; no exclamation in headings; no cure promises anywhere. **Banned filler on ALL entities:** bespoke, curated, discerning, unparalleled, nestled, indulge, pamper, exquisite, world-class, unique.
3. **Claims jurisdiction matrix** (health claims are gated by TARGET MARKET, not site language): India → DMR Act + ASCI; UK → MHRA; US → FDA/FTC; EU (DE/FR/CZ) → EU health-claims regime. A page targeting DACH obeys the EU lens even in English.
4. **Privacy**: India DPDP 2023 baseline; GDPR posture on EU-facing pages; cookie consent + Google Consent Mode v2 via `packages/consent`. No PII in repos, logs, or prompts.
5. **Accessibility**: WCAG 2.2 AA (Brand Manual ch.10 is the contrast law — e.g., marigold is never text on white; leaf-500 only ≥24px; forest & ink unrestricted). Touch targets ≥44px; `prefers-reduced-motion` honored.
6. **Imagery/video policy**: professional photography per Brand Manual ch.05. **NO AI-generated humans, patients, physicians, or treatment scenes on KTAHV — ever** (YMYL + the site was already audit-flagged for AI content). AI video (Higgsfield) is permitted per-site per the Register file, ambient/product only, brand-graded, performance-budgeted.

## 5 · INFRASTRUCTURE MAP
- **Cloudflare = control plane for ALL domains** (DNS + registrar consolidation target). Two-plane rule:
  - Factory sites on **Vercel** → Cloudflare records **DNS-only (grey cloud)** — Vercel provides its own edge/CDN; do not proxy.
  - Legacy/WP sites on our origins → **proxied (orange cloud)** + WAF + caching + bot rules.
- **Origin servers: one Windows + one Linux** (host the legacy/WP estate). Rules: audit & harden in Phase 0 (what runs where, exposed ports/RDP/SSH, patch level, backups); **no new site ever deploys to them**; their load shrinks to KTAHV + holdouts, then to zero.
- **Vercel** — all Factory sites; preview deployments = human review surface.
- **Shopify** — the ONLY cart/checkout/payment surface. Product microsites use Storefront API cards → buy on Shopify. Never build checkout elsewhere.
- **GitHub monorepo `kairali-web-factory`** — all new code. Legacy sites are NOT uploaded to GitHub: they are archived (Drive) and mined (crawl → 301 inventory + content markdown).
- **M2 Mac (office, 24/7)** — night-shift build machine: Claude Code + Desktop, Remote Control on, Dispatch paired, Agent View, 7AM morning-brief scheduled task. Unattended sessions end at commits/PRs/previews — never DNS, never production.

## 6 · ARCHITECTURE
- **Monorepo**: `sites/<domain>` apps + shared `packages/`: `ui` (brand-tokens.css + components per Manual ch.07), `seo` (meta, sitemaps, OG/Twitter cards, llms.txt, GEO/Q&A structure), `schema` (Organization, LocalBusiness/MedicalClinic, Physician/Person, BreadcrumbList, FAQPage, Article, MedicalWebPage condition template), `i18n` (keyed strings + gates; transcreation not translation), `compliance` (lint: §4.1–4.3 word/claims gates per entity+market), `consent`, `analytics` (GA4 + Ads conversions + Meta/LinkedIn/Bing pixels from data-cta), `forms` (ONE webhook standard → lead-classification/CRM), `product-card` (Shopify Storefront).
- **Two-lane change model**: code via Git→staging→prod; content via MDX merge (paste files committed = content history). Never DB-merge on the WP tail.
- **PPC lane**: `/lp/<campaign>` routes, noindex default, single CTA; a live Google Ads final URL never 404s; cutover per campaign with tracking templates intact.
- **KPI framework** (the gap every agency proposal had): every site row in the Register carries baseline → 90-day outcome targets (enquiries/leads/added-to-cart-on-Shopify), tracked in Fleet Pulse (kairali.ai). Activity is not success; outcomes are. ROI is the standing priority on every site.
- **Ship Gate**: SITE_LAUNCH_CHECKLIST_v1.0.md is the definition of done for EVERY site — CI gates + evidenced agent tasks (keywords, GA4/GTM/Ads/pixels, GSC, cards, Chatbase, forms-to-CRM test lead) + 3 human items. The agent runs it unprompted per site.
- **Forms v1 freeze**: all sites replicate the CURRENT production CRM form schema + endpoint exactly (get canonical schema from Ambuj); only consent + Turnstile + data-cta added. Chat-style forms and enrichment are v2 backlog — never in-sprint.
- **Chatbots (Chatbase, WhatsApp-integrated)**: FOUR entity bots (KTAHV-Clinical/Priya · Products · Group · Franchise-B2B), never one group bot and never per-site bots. Bot KBs sync from per-entity MDX exports on merge + scheduled recrawl; bot prompts inherit §4 compliance verbatim.
- **Learning loop**: LEARNINGS.md retro after every launch; anything recurring becomes package/checklist code within the week; agents read it before every new site build.
- **Villa Raag brand exception**: Raag has its own brand manual (updated version pending from Abilash) → `raag-tokens.css`. Kairali tokens are never applied to Raag surfaces.
- **KTAHV migration method** (post-sprint): rewrite-vs-**deindex** triage per page (prune thin/AI pages instead of rewriting all 376), 301 map from mined inventory, condition-page template (doctor-bylined), Dr. Deepu John sign-off lane.

## 7 · ALREADY BUILT (don't rebuild; reuse)
KTAHV consultation/enquiry/contact/how-to-reach pages v1.3.x (EN/DE/FR) + Python transform pipeline + 19 compliance gates + staging-only push script (`push_to_wp.py`) · kairali.guru live Next.js (EN-only live; 5-locale build in Eeshal's repo) — the component/i18n donor · Financial OS (₹18.96 Cr FY25-26 verified) · Saanvi voice agent + Call Analysis + Scheduling prompts · Lead classification v4.3 (5 verticals) · Agent Alex email + Priya chatbot · MOA Matrix v3.0 + European Buyer Journey (8 stages, DACH/FR MOAs) · 18+ competitor dossiers · Brand Manual 2026 (tokens now in code) · Vendor-evaluator prompt (use it on any future agency) · Fleet OS / Runbook / Phase-0 / sweep.sh / ktahv spec suite (see §10).

## 8 · CURRENT MISSION
30-day sprint (13 Jul → 12 Aug 2026): stabilize the live estate (Phase 0), stand up the Factory, ship ~28 sites in 5 waves (pilots → product microsites → business lines → corporate/brand → kairali.com), forward-farm ~35 domains, Fleet Pulse on kairali.ai, hand over to one IT person + content team. KTAHV stays WP this sprint (tech fixes only; incl. **sitemap_index 404 in robots.txt** from the Delante findings) and migrates first afterward.

## 9 · DECISIONS LOG
**Locked:** semantic architecture as default recommendation (variants 301 to nearest live site) · Shopify-only checkout · Tier discipline · registrar-first access · no AI humans on KTAHV · two-plane Cloudflare.
**Pending (Abilash):** 1 forward strategy final word · 2 whatisayurveda .org vs .com canonical · 3 Kairali Organic vs KAIR consolidation · 4 ayurvedafranchise merge-or-satellite · 5 drop-list confirmation · 6 snehachowdhary/theblushlounge primary · 7 ayurvedajournals intent ("Believe it") · 8 updated Raag brand manual delivery (gates villaraag.com visual finalization) · 9 canonical CRM form schema + endpoint from Ambuj (gates packages/forms v1) · 10 Shopify Stage-0 (one store w/ Markets vs two stores — resolved during Shopify setup) + staff account for the new engineer via Ambuj.

## 10 · STANDING DOCS INDEX (source-of-truth order on conflict: newest version wins; this file arbitrates)
`CLAUDE.md` (fleet rulebook + factory addendum — conduct & gates) · `PROJECT_CONTEXT.md` (this) · `SITE_LAUNCH_CHECKLIST_v1.0.md` (definition of done, every site) · `LEARNINGS.md` (append-only; read before every build) · `wiki/` + index.md + log.md (Karpathy LLM-Wiki compiled memory; Monday lint; feeds Chatbase KBs) · `SITE_DESIGN_LOCALE_REGISTER.md` (per-site audience/register/locales/video/KPI) · `SHOPIFY_TRACK_CONTEXT.md` (KAPPL e-commerce brain; live admin overrides it) · `NEW_ENGINEER_DAY1.md` (onboarding) · `packages/ui/brand-tokens.css` (visual law; `raag-tokens.css` pending) · `KAIRALI_30DAY_BUILD_RUNBOOK_v1.0.md` (+PHASE0 amendment) · `KAIRALI_WP_FLEET_OS_v1.0.md` (WP tail ops) · `ktahv-critical-flows.spec.ts` (deterministic gate) · `sweep.sh` + `sweep_results.csv` (estate truth) · `DECISIONS.md` (append-only) · `QUESTIONS.md` (unattended-session questions) · Content KB & MOA docs (content direction).

## 11 · AGENT CONDUCT (summary; CLAUDE.md is binding)
Staging first, human gate for production and DNS. Editor-role WP credentials from env only. Proof-of-work: no "done" without a live link/real output/passing spec; check ALL locales. Never invent facts/IDs/prices — ask. Medical content → Dr. Deepu John lane. When blocked unattended → QUESTIONS.md and continue. `--force-with-lease` only. If this file and reality disagree, say so loudly and update via Abilash.
