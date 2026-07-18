<!-- launches/theblushlounge.com — scaffolded by scripts/launch-scaffold.mjs on 2026-07-18 18:01:55 IST.
     Master: docs/checklists/pagewise-migration-checklist.md (Abilash's originals — every item mandatory unless a
     stricter Launch Checklist gate covers it). FILLED 2026-07-19 01:20:00 IST (full-site build session, PR #154).
     Applies to all six pages: / · /portfolio · /services · /academy · /about · /contact. -->
# Page-Specific Migration Checklist (Abilash's original — verbatim, ingested 2026-07-13)

## Content Management
- [x] Content review — every page in HER first-person voice (register E, BRIEF); legacy duplicate boilerplate killed (five 2018 pages → one anchored /services); outdated blog dropped per signed BRIEF; primary/secondary keywords per STRATEGY §2 worked into titles/H1s/copy naturally.
- [x] Proofreading — copy passes read on every page this session; truth-register enforced (three external-reviewer copy catches fixed: longevity claim → "made to last", one-on-one delivery absolute → conversation claims ×2).
- [x] Internal linking — header nav (current page marked), footer nav, section hand-offs (home teasers → inner pages; services ↔ contact; portfolio → IG). All routes 200, factory spec green.
- [x] Multimedia optimization — sips-derived web JPGs (w800–w1400, q72–80) from full-res captures; descriptive alt text on EVERY image (A5 a11y 100 ×4 includes image-alt audit).
- [x] Canonical tags — self-referencing per page via buildMetadata (factory spec A6 asserts).
- [x] Breadcrumb navigation — N/A BY DESIGN: 6-page flat IA; header nav with aria-current is the orientation layer (a breadcrumb on a one-level site is noise, stated not silent).
- [x] Structured data — Person / BeautySalon / Course / ImageGallery per page (STRATEGY §4); serialized via @kairali/schema.
- [x] Analytics/tracking per page — data-cta on every conversion control (whatsapp_click, enquiry_open, enquiry_submit, ig_profile_click, academy_enquiry, portfolio_filter). No FB pixel (no ad account lane for this brand yet — nothing invented).
  - [x] Marketing URLs/UTM — the forms package captures utm_*/gclid/fbclid via trackingFromLocation into the frozen CRM payload; LP lane out of scope this launch (signed BRIEF).
- [x] hreflang — N/A: EN-only site per signed BRIEF (single locale declared in site.config).
- [x] Third-party integrations — EnquiryForm (store-first Supabase route) wired at /contact with event-date + Blush-brand consent; backend awaits env keys (loud open item); NO chatbot BY OWNER RULING (D-BL-BUBBLE-EXEMPT), WhatsApp is the chat surface.
- [x] Accessibility — Lighthouse a11y 100 on all four gated templates after the honest 94→100 fix trail (contrast token, heading order, label/name matches); factory spec keyboard-focus + touch-target checks green. WAVE = optional human spot-check post-flip.
- [x] Page-specific 301s — the ten legacy .php/blog rules, machine-verified (evidence note).
- [x] Metadata — unique title ≤60ch + description ≤155ch per page (A6 gate THROWS at build — the clean build is the proof); per-page OG/Twitter incl. og.jpg.

## Technical Checks
- [x] Clean descriptive URLs — /portfolio /services /academy /about /contact per signed STRATEGY.
- [x] All links functional — all 6 routes 200; redirects 308; factory spec link layer green; inner-page hand-offs resolve (the golden page's teasers no longer point at 404s).
- [x] Forms/interactive tested — portfolio filter (client), consent banner choices, EnquiryForm validation (consent required, honeypot) — factory spec + manual browser pass; form POST awaits env keys (loud).

## Mobile-Friendliness (per page)
- [x] All six pages captured at 390×844 with zero horizontal overflow machine-asserted; images scale; touch targets ≥44px asserted by factory spec.

## Performance (per page)
- [x] A5 gate (mobile emulation): / 92 · /portfolio 96 · /services 97 · /contact 99 — all ≥90; LCP driven by hero images (interim-IG ceiling, improves at the hi-res swap); CLS negligible (static layout, dimensioned images). GTmetrix/PSI-web + SEOptimer = post-DNS human spot-checks.

## Post-Migration Monitoring
- [x] Plan stated: post-flip GSC property + the data-cta event stream (once GA4 lands via Vikash) are the monitors; STATUS.yaml carries the pipeline stage.

## Individual Page Optimization
- [x] Unique keyword-rich titles/descriptions (table in fullsite-evidence-note.md) · H1→H2→H3 order (heading-order a11y audit clean) · compressed images with alt text · internal links · validated structured data · clean URLs.

## Priority Pages
- [x] High-priority (/, /services, /portfolio, /contact): gated by A5 + the full battery; keyword targets per STRATEGY §2; rankings monitoring begins post-flip.
- [x] Low-priority (/about, /academy): same standards applied; periodic review joins the fleet Monday ritual once live.
