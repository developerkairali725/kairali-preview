# SITE LAUNCH CHECKLIST — v1.0 (the Ship Gate)
**13 Jul 2026 · Amends: PROJECT_CONTEXT.md §6/§10, Runbook §5 per-site gates.**
**Rule zero: no site moves forward until every A-item passes in CI, every B-item has pasted evidence, and the three C-items are done by a human. The agent runs A and B automatically for EVERY site — Abilash never has to ask.**
**Standard: everything a top agency's fixed workstreams would do — technical SEO, schema, keywords, GEO/AI-readiness, cards, tags, tracking — executed per site, every site, with machine evidence.**

---

## A · AUTOMATED CI GATES (merge-blocking; no human judgment involved)
1. `pnpm build` clean; zero console errors on key templates.
2. Spec suite green — locked facts (info@kairali.com, +91 92898 38797, …38777 absent), forms render + consent, locale switcher, no mixed content.
3. Compliance lint zero findings: entity register rules (KTAHV clinical lock incl. DE/FR equivalents) + group-wide banned filler + claims-jurisdiction lens for the site's declared target markets.
4. Brand lint: only brand-token colors (no rogue hex), marigold-as-body-text = fail, focus rings present, touch targets ≥44px.
5. Lighthouse budgets on home + one content template + one LP: Performance ≥90 · Accessibility ≥95 · SEO = 100. Hero video (if register allows) passes poster-first LCP + reduced-motion fallback.
6. Meta title (≤60ch) + description (≤155ch) present on every page; canonical set; robots.txt sane; sitemap.xml + llms.txt + AI-crawler files generated.
7. hreflang complete and reciprocal for every declared locale; no orphan locales.
8. Schema JSON-LD parses and validates per template: Organization + entity type (MedicalClinic/LocalBusiness/Product/Article), BreadcrumbList, FAQPage where Q&A exists, Person for bylines.
9. OG/Twitter/Meta cards render for every page type (1200×630 per Brand Manual ch.08) — validated render, not just tags present.
10. Every image has alt text; favicons exported 16/32/180/512 per ch.08.
11. Internal link crawl: zero 4xx/5xx; 301 map from the mined legacy inventory deployed and spot-checked (10 random old URLs → correct new targets).
12. `packages/consent` active: banner + Google Consent Mode v2 + privacy/terms pages per entity.
13. `/security-review` (built into Claude Code) run on the release diff: zero high/critical findings, evidence pasted.

## B · AGENT LAUNCH TASKS (run per site; paste evidence into `launches/<domain>.md`)
**Search & content intelligence**
1. Keyword map: Semrush MCP + GSC (+DataForSEO fallback) → keywords per page written into frontmatter; one-paragraph competitor snapshot for the niche. Evidence: the map file.
2. GEO/AI-readiness pass: entity clarity block, Q&A structuring on money pages, llms.txt populated with the site's canonical facts.
**Measurement (ROI wiring — a site without this does not launch)**
3. GA4 property + web data stream created; site ID in `packages/analytics` config.
4. GTM container published: GA4 tag + conversion events mapped from `data-cta` (form_submit, whatsapp_click, call_click, add_to_cart_assist).
5. Google Ads: conversion actions created + linked (import from GA4 or GTM tag); if campaigns exist for this domain → final-URL cutover per PPC protocol.
6. Meta pixel installed + domain verified in Business Manager (C/E register consumer sites); LinkedIn Insight Tag (A-register B2B: franchise, bulk, kappl, equipment); Bing UET where Ads run there; **Triple Whale Pixel on every C-register site** (headless install; UTM `ms_<site>` standard) so microsite-assisted Shopify revenue attributes correctly.
7. GSC property verified (domain property via Cloudflare DNS) + sitemap submitted; Bing Webmaster verified + sitemap submitted.
**Integrations**
8. Forms v1: EXACT current CRM field schema + endpoint (per FORMS section below); send one live test lead → screenshot it arriving in CRM with consent flag + source attribution. This is the single most important evidence item.
9. Chatbase: site mapped to its ENTITY bot (see CHATBOT section); bot KB updated with this site's content export; widget installed (unless register says none); WhatsApp handoff verified to +91 92898 38797 for KTAHV-related bots; 5 test questions answered in-register (no banned words, no cure claims).
10. Uptime monitor added; Fleet Pulse row created with KPI baseline (from GSC/GA where legacy data exists) + 90-day target.
**Housekeeping**
11. Redirect the domain's forward-family variants at Cloudflare (per semantic map).
12. Social profile links verified; press/author pages linked where register = A/ED.
13. Runtime monitoring live: Vercel Speed Insights + Analytics enabled on the project; Sentry project created and DSN wired (errors flow to the shared Kairali Sentry org, alert rule → email).

> **Enforcement note:** Gate A is not a memory exercise — it is enforced twice mechanically: Claude Code hooks re-run the fast gates after every edit and before every push, and GitHub branch protection makes the full CI gate a required check on main. A site physically cannot merge unchecked. (Created in Setup Phase 8: scripts/hooks/ + .github/workflows/gate.yml + branch protection.)

## C · HUMAN GATE (the only three things Abilash does)
1. Approve the Vercel preview (section-by-section for A-register flagships).
2. Flip DNS at Cloudflare (grey-cloud for Vercel, per two-plane rule).
3. Approve Ads final-URL cutover where live spend exists.

## D · POST-LAUNCH (Day 1 & Day 7 — agent runs, reports in Fleet Pulse)
Day 1: pages indexed check · GSC coverage errors = 0 · analytics events firing live (real-time report screenshot) · first live lead traced to CRM · Chatbase answering correctly on-site.
Day 7: CWV field sample · keyword indexing spot-check · lead count vs baseline · broken-link recrawl · retro written (see E).

## E · THE LEARNING LOOP (the "keeps learning from previous sites" mechanism)
After every launch: 15-minute retro appended to `LEARNINGS.md` — what broke, what was manual, what should become template/package code. Anything appearing twice gets a PR into `packages/*` or this checklist within the same week. The mined legacy data (top pages, top queries from GSC history) is recorded per site so the next similar site starts from evidence, not zero. This file is read by the agent at the start of every new site build. That is how site #12 is built with everything learned on sites #1–11.
**Wiki layer (Karpathy LLM Wiki pattern):** mined legacy content = immutable raw sources; the agent compiles/updates `wiki/` pages (one page per domain, entity, integration; navigated by `wiki/index.md` + `wiki/log.md`) at every launch; a **weekly lint pass** checks the wiki for contradictions, stale facts, and gaps, and proposes fixes. Wiki pages are also the export source for the Chatbase entity KBs.

## FORMS — v1 FREEZE / v2 BACKLOG
**v1 (speed + CRM continuity):** replicate the CURRENT production form structure exactly — field names, hidden fields, source tags, and endpoint — so the CRM/database ingests without any migration work. Additions allowed in v1 only where compliance demands: consent checkbox + privacy link (DPDP), Cloudflare Turnstile anti-spam (invisible; doesn't change the payload), `data-cta` events. **Needed from Ambuj once: the canonical form schema + webhook/endpoint + a test-mode flag.** That becomes `packages/forms` v1 for all 28 sites.
**v2 backlog (post-sprint, do NOT build now):** chat-style conversational forms · conditional fields per MOA · progressive profiling · WhatsApp-first flows with pre-filled context · server-side enrichment + lead scoring hook into classification v4.3 · A/B form variants · CRM write-back status page. Logged so nothing is forgotten; nothing slows the sprint.

## CHATBOT ARCHITECTURE (Chatbase)
**Not one bot, not 28 — FOUR entity bots**, because the language locks differ by entity and a group-wide bot would leak resort-language into hospital conversations:
1. **KTAHV Clinical** (Priya persona) — clinical register enforced in the bot's system prompt (same §4 rules verbatim); escalates to WhatsApp +91 92898 38797; KB = KTAHV site content + programme/condition pages.
2. **Products/Shopify** — product Qs, links to Shopify PDPs; KB = product microsites + Shopify catalog export.
3. **Group/Corporate** — kairali.com, hospitality, education; KB = corporate + guru + whatisayurveda content.
4. **Franchise/B2B** — franchise, bulk, equipment; lead-capture oriented.
**KB pipeline (the "always up to date" mechanism):** every site's MDX exports to a per-entity knowledge pack on merge; entity bots re-sync from these packs + a scheduled recrawl of live URLs. New site launches = checklist item B9 adds it to the right bot automatically. Bot answers are a content surface: same compliance gates, same locked facts, tested with 5 register-compliant questions at every launch and every KB update.

## STANDING NOTE — VILLA RAAG / RAAG BRAND
Villa Raag runs its OWN brand system (separate manual, being updated by Abilash to the new design-system format). The Factory supports per-site token files: villaraag.com (and the raag forward family) builds structure/content on schedule but its visual pass finalizes only when the updated Raag manual arrives → `packages/ui/raag-tokens.css`. Kairali tokens are never applied to Raag surfaces as a "temporary" skin.

*v1.0 — this file is the definition of done. Amendments via LEARNINGS.md-driven PRs only.*
