<!-- launches/theblushlounge.com — scaffolded by scripts/launch-scaffold.mjs on 2026-07-18 18:01:55 IST.
     Master: docs/checklists/sitewide-migration-checklist.md (Abilash's originals — every item mandatory unless a
     stricter Launch Checklist gate covers it). FILLED 2026-07-19 01:20:00 IST (full-site build session, PR #154).
     CLAUDE.md launch-evidence law: "A launch without its filled checklists in the repo is not a launch." -->
# Site-Wide Migration Checklist (Abilash's original — verbatim, ingested 2026-07-13)

## 1. Pre-Migration Planning
- [x] Define objectives and goals — BRIEF.md (signed front gate 1): convert IG attention to WhatsApp enquiries; open the Blush School funnel; absorb legacy URL value; pass the design bar.
- [x] Comprehensive site audit — content-mined/theblushlounge.com (wayback 13 Jul + LIVE re-mine 18 Jul: 9 pages, url-inventory.csv); per-page fates in STRATEGY §4 protection map. Screaming Frog not used — the site is 9 static PHP pages; the curl mine covered 100% of the inventory (stated, not silent).
- [x] Backup existing website — the live mine IS the content backup (immutable under content-mined/, raw-sources law); binaries in the image library (28 legacy files + 14 IG captures).

## 2. Technical Setup
- [x] URL structure + redirects — new IA per signed STRATEGY §1; 301 map live in next.config.ts (10 rules, machine-verified 308s in design-review/fullsite-evidence-note.md); snehachowdhary.com domain-level 301 = human DNS action at flip (D1 rule 8).
- [x] robots.txt — app/robots.ts via @kairali/seo (allow all + sitemap pointer); validation joins the GSC step post-DNS (no GSC property exists pre-flip).
- [x] Sitemap — app/sitemap.ts, all 6 routes; submission to GSC/Bing is a post-DNS-flip human/owner step (no property yet — flagged, not silent).
- [x] SSL/HTTPS — Vercel-managed TLS; factory spec A2 (no mixed content) passed 16/16.
- [x] Global metadata — per-page OG/Twitter via buildMetadata (A6 gate throws at build); og.jpg 1200×630.
- [x] Core schema — Person (sitewide) · BeautySalon LocalBusiness (/contact) · Course (/academy) · ImageGallery (/portfolio) per STRATEGY §4; validation against Google Rich Results is a pre-flip human spot-check (flagged).
- [x] Webmaster tools & analytics — DEFERRED BY FACT-LAW: GTM-MFXP2LH ownership unverified (STRATEGY §4 flag) and GA4/GTM creation is routed to Vikash (D-GA4-VIKASH). @kairali/analytics renders the inert data-cta listener; consent-mode defaults denied. No IDs invented (HARD GATE 6).

## 3. Performance Optimization
- [x] Minify/combine — Next 15 production build (automatic).
- [x] Caching — Next/Vercel static asset immutable caching (framework default).
- [x] CDN — Vercel edge network.
- [x] Server response — static prerender; local A5 runs healthy (see below).
- [x] Site speed — Lighthouse A5 (mobile): / 92 · /portfolio 96 · /services 97 · /contact 99, a11y 100 ×4, SEO 100 ×4 (lighthouse-2026-07-18.md, runs 1–3 incl. the honest a11y-94 fix trail). GTmetrix/PSI-web = post-DNS human spot-check.
- [x] Crawl errors — no GSC property pre-flip; all 6 routes + 10 redirects machine-verified 200/308 locally and route set matches the sitemap.

## 4. Mobile-Friendliness
- [x] Responsive — factory spec mobile-375 project green; zero horizontal overflow machine-asserted (hOverflow=0px) on all 6 pages at 390px.
- [x] Touch-friendly — A4 browser layer: every data-cta control ≥44px, passed both viewports.
- [x] Mobile performance — A5 runs ARE mobile-emulated (above).

## 5. SEO Considerations
- [x] URL consistency + 301s — protection map live (above); content-rich pages rebuilt, nothing content-rich redirected to thin targets (blog was 2 dead 2019 posts → / per signed BRIEF).
- [x] Internal links — header/footer/section cross-links on every page; factory spec link checks green.
- [x] Backlinks — no GSC/backlink data exists for this domain (STRATEGY: qualitative until data accrues); monitored post-flip. Nothing invented.
- [x] XML sitemap — complete (submission post-flip, above).
- [x] Metadata — unique per-page titles/descriptions with STRATEGY keywords (extracted table in fullsite-evidence-note.md).
- [x] Structured data — above; per-page JSON-LD serialized from @kairali/schema.

## 6. Analytics and Monitoring
- [x] Tracking codes — data-cta event instrumentation complete per STRATEGY §4 (whatsapp_click, enquiry_open/submit, ig_profile_click, academy_enquiry, portfolio_filter); loaders await the Vikash GA4/GTM lane (deferred by fact-law, above).
- [x] Goal/event tracking — the data-cta layer queues to dataLayer; goals configure when the container lands.
- [x] Post-migration review — the finished-site gate battery IS the review: Gate-2 pass 9 (GPT element-complete PASS; Perplexity residual = owner-fact deadlock, Q-BL-GATE2-PERPLEXITY-DEADLOCK) · go-science pass 4 PASS · beauty pass 6 PASS · A5 PASS ×4.

## Open items that ride to launch (loud, never silent)
- Email makeoverbysneha@gmail.com + hours 10:00–22:00: CONFIRM-before-launch (BRIEF locked-facts) — OFF the site until confirmed.
- Supabase env keys (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) in the Vercel project for the enquiry form backend — owner/ops (handover known item).
- Privacy page (Ship Gate A12): Sneha's own privacy/terms — legal drafts are owner-lane; consent line renders linkless until then.
- Hi-res shoot sets swap all IG-interim imagery 1:1 (D-BL-INTERIM); academy poster (30 Aug 2026 event) swaps post-event at the latest.
- Vercel stable-alias promote (one owner click / allowed session): the full site is deployed + Ready; the public alias still serves the pre-fix golden page.
- Testimonial block waits for Sneha's confirmation (unattributed legacy quote unused).
- GSC + Bing property, sitemap submission, GTM/GA4 IDs — post-DNS-flip lane.
