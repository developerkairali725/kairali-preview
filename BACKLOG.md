# BACKLOG.md — the sprint's calendar + scratchpad (single source of "what and when")

**Rules (binding on every session, human or agent):** every task lives here in exactly
one section. Finishing work = move the line to DONE with a second-precision IST
timestamp. New/future work = add under SCHEDULED with its trigger date or condition.
The 07:05 morning brief reads this file daily and surfaces anything due. Nothing is
deleted — history is the point.

## NOW (this week — Wave 0 / Days 1–6)
- [ ] Re-read ALL governing docs + both brand manuals + checklists + comp set before further building (Abilash order, 13 Jul)
- [ ] Forward-strategy research + decision D1 (delegated to agent; Google-compliant, best ROI) — DONE 2026-07-13 19:22:05 IST, see DONE section
- [ ] Mine theblushlounge.com (primary per D6) + build plan; snehachowdhary.com = forward
- [ ] Evaluate Eeshal repo (kairali-guru-) vs live kairali.guru → migration plan into sites/
- [ ] Mine image sources per image-library/README registry (KTAHV video folder CONFIRMED; folder 1LlD59… needs sharing fix; albums via browser) → image-library/ + per-site IMAGE_MANIFEST swaps
- [ ] Design-critic gate: formalize as scripts/design-review prompt + Ship Gate step

## SCHEDULED (date- or condition-triggered)
- [ ] Wave 1 product microsites (Days 7–13, from 20 Jul): kairalitea, kairalioil, kairaliherbals, kairaliorganic(+kairorganics/kairproducts per D3 two-brand ruling), kairaliequipment, bulk×2 — needs Shopify Storefront token (Ambuj/Abilash)
- [ ] arogyakendra richer version (multi-section) — AFTER image library lands; single-pager is deliberate v1
- [ ] Wave 2 (Days 13–19): franchise, centers, yoga, whatisayurveda (.com canonical per D2, .org 301s), healing.recipes
- [ ] Wave 3 (Days 19–25): Fleet Pulse dashboard on kairali.ai (internal dashboards home), corporate/brand sites, MainWP
- [ ] Wave 4 (Days 25–29): kairali.com flagship (content preload starts Day 14)
- [ ] Monday ritual (every Mon, first: 20 Jul): wiki lint + pnpm audit + Dependabot triage + hook self-test
- [ ] KTAHV migration (POST-sprint, own 3–4 week plan) — gate: docs/ktahv-inputs/ corpus ingested + Dr. Deepu John sign-off lane
- [ ] Locale expansions (DE for kairali.com/hospitality, RU/CS etc.) — gate: native-reviewed banned lists per locale

## WAITING ON (people)
- [ ] Abilash: group WhatsApp number (non-KTAHV CTAs) · ink hex + 10-step ramps + logo SVG pack (Q14–17) · Raag web type scale · KTAHV auditor GPT prompt export · GitHub org invites (emails below) · historical-chat corpus if Drive sweep misses it
- [ ] Satyam (dme@kairali.com): PRODUCTION webhook URL · consent-field answer · delete 3 test rows
- [ ] Sunaj (sysadmin@kairali.com): arogyashala.in DNS/registrar (message drafted 13 Jul)
- [ ] Ambuj (dme@kairaliproducts.com): registrar access sheet · Chatbase inventory · server audit · Semrush key · Shopify Storefront API token
- [ ] Deepu (developer@kairali.com): KTAHV WP tech-fix spec execution (sitemap_index 404 etc.)
- [ ] Eeshal (github.com/Eeshal27): stop standalone repo, move to Factory PRs after org invite

## DONE (most recent first)
- [x] 2026-07-13 19:21:40 IST — KTAHV content guides ingested to docs/ktahv-inputs/ (verbatim, with source fileIds): Stars-of-Kairali-Nakshatra-Guide, Kairali-Nakshatra-Villa-Spec (all 5 sheets via xlsx), Healing-Secrets-of-Kairali (= what Abilash called "link secrets"), EXTRACTED-villa-nakshatra-mapping (carries 212-category + suite-name conflicts)
- [x] 2026-07-13 19:21:40 IST — Media catalog v1 committed (docs/media/MEDIA_CATALOG.csv): 26 rows — 19 KTAHV 2023 pro-shoot videos (metadata-cataloged, needs-visual-pass), 5 Shopify launch-pack docs, 2 folders access-pending ("KTAHV New Shoot 2025 HO centre" 1LlD59…, "Villa Raag- Images" 1WTBf-…: children not shared with director@kairali.com); 0 images viewable this pass; image-library/README.md pointer added
- [x] 2026-07-13 19:17:20 IST — arogyakendra v2 shipped + live-verified (HTTP 200, new h1, WhatsApp CTA live): brand-manual design pass (Kurale/Asap/Lato via next/font, placeholders + IMAGE_MANIFEST, sticky mobile WhatsApp bar), interim Priya WhatsApp + Chatbase per DECISIONS, sitemap/robots/OG/JSON-LD conformance, design-critic pass 9.2/10 (launches/arogyakendra.com/design-review.md)
- [x] 2026-07-13 19:16:54 IST — launches/arogyakendra.com/ retro-filled: sitewide + pagewise checklists committed with curl/build/lint evidence; GSC/Bing/GA4/DNS items marked pending honestly
- [x] 2026-07-13 18:47:18 IST — BACKLOG system created; team emails recorded
- [x] 2026-07-13 18:42:22 IST — packages/forms v1 built + LIVE-verified against Satyam's test webhook (B8 evidence in docs/integrations/crm-forms-spec.md)
- [x] 2026-07-13 ~18:30 IST — brand manuals ingested (text + PDFs), raag-tokens.css created (D8 closed); comp set ingested; checklists ingested + made law; plugins installed
- [x] 2026-07-13 ~17:30 IST — Wave 0: arogyakendra.com built+deployed; estate sweep (87 domains, 40 RED); Wave-0 mining done
- [x] 2026-07-13 (day) — Factory stood up end-to-end: repo→org→Vercel Pro, hooks, CI, wiki, morning brief, migration playbook, Vercel deploy pipeline verified
