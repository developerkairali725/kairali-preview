# STRATEGY — bulkayurvedaproducts.com (front gate 2 of 4 — the fat gate)

**Drafted 2026-07-18 18:07:00 IST · for the `strategy` row of `approvals.yaml`. ONE approval covers: sitemap · primary+secondary keywords per page · competitor-keyword-to-page map · integrations plan. Evidence basis: `docs/kappl-inputs/bulk-b2b-niche-brief.md` [Sn]/[OWN-n] citations.**

## 1 · Sitemap (13 indexable pages day one + graduating long-tail)

| # | URL | Page | Phase |
|---|---|---|---|
| 1 | `/` | Home — manufacturing-desk statement, cert wall, engagement models, capability grid, project-intake RFQ | Golden page |
| 2 | `/services/private-label` | Family-B head service page — white/private label end-to-end (formulation → packaging → QA) | 1 |
| 3 | `/services/third-party-manufacturing` | Contract/third-party lane — the two published Third-Party models | 1 |
| 4 | `/services/loan-licence` | The two published Loan-Licence models (your brand / your concept + our R&D) — a lane most competitors bury | 1 |
| 5 | `/products/` | What we manufacture hub — oils · ayurvedic/herbal cosmetics · ayurvedic & herbal medicines · shampoos & soaps [OWN-5] | 1 |
| 6 | `/products/<category>` ×4 | Category capability pages (written to real depth; dosage forms mapped per category) | 1 |
| 7 | `/facility` | Pollachi, Tamil Nadu — plant, in-house laboratories, herb-extraction unit, R&D [OWN-5]; real photography only (asset-mine kappl.co.in 3D/pictures at build) | 1 |
| 8 | `/quality` | Cert strip as published + GMP certificate artefacts [OWN-3/4] | 1 |
| 9 | `/how-it-works` | Process + MOQ guide/AEO page — enquiry → formulation discussion → sampling → production → dispatch; "Launch Your Own Brand in Just 30 Days" as published; FAQ | 1 |
| 10 | `/start-your-project` | Project-intake RFQ page (form embedded on all service/category pages too) | 1 |
| 11 | `/about` + `/contact` | KAPPL story (1908/1989 as published), locked contact | 1 |
| — | `/products/<dosage-form-slug>` (capsules, tablets, syrups, churnam, lehyam…) | Dosage-form long-tail ("ayurvedic capsules third party manufacturing") — graduate only when written to depth | 2 |

EN only. No `/lp/` this weekend. Legal/consent from `@kairali/legal`.

## 2 · Keywords per page (P = primary · S = secondary)

| Page | P | S |
|---|---|---|
| Home | private label ayurvedic products | ayurvedic products manufacturer India · bulk ayurvedic products |
| services/private-label | private label ayurvedic products manufacturer | white label ayurveda · private label herbal products India |
| services/third-party | third party manufacturing ayurvedic | ayurvedic contract manufacturing · third party ayurvedic manufacturer India |
| services/loan-licence | loan licence ayurvedic manufacturing | ayurvedic manufacturing unit on loan licence |
| /products/ | ayurvedic products manufacturing | herbal products manufacturer · ayurvedic product categories |
| products/oils | ayurvedic oil manufacturer private label | private label hair oil / massage oil manufacturer |
| products/cosmetics | ayurvedic cosmetics manufacturer | herbal cosmetics private label India |
| products/medicines | ayurvedic medicine manufacturer third party | classical ayurvedic medicines manufacturing |
| products/shampoos-soaps | herbal shampoo private label | ayurvedic soap manufacturer bulk |
| /facility | WHO-GMP ayurvedic manufacturing facility | ayurvedic factory Tamil Nadu · in-house herb extraction |
| /quality | GMP certified ayurvedic manufacturer | ayurvedic manufacturer certifications |
| how-it-works | how to launch an ayurvedic brand | ayurvedic private label MOQ · third party manufacturing process |

## 3 · Competitor-keyword-to-page map

| Competitor + the keyword ground they hold | Our page that contests it | Angle that wins |
|---|---|---|
| Herbal Hills — "ayurvedic third party manufacturer", 400+ formulations, services grid, MOQ FAQ [S9] | Home + services/third-party + how-it-works | Match the furniture; beat with the published engagement-model table + 30-day claim + heritage the mid-tier lacks |
| Aadhunik — "best private labeling", cost/MOQ guide content [S13] | how-it-works | Same guide play with pharma-manufacturer depth (facility, labs, extraction) |
| Neutragen/Phytovends/Ayubal/Asli — "third party ayurvedic manufacturer company" mid-tier [S10, S12] | services pages | Real certificates + real facility vs badge-brandishing; "verifiable on request" framing [S3] |
| Cultivator/Biofrank — "top 10 contract manufacturers" listicles [S11, S13] | how-it-works + Home | Be the site the listicles describe; consider a later honest comparison page (owner call) |
| Alicanto social — WHO-GMP-badge creative [S14] | /quality | The credential rendered as artefact (certificates), not decoration |
| r/Entrepreneur + YouTube "start third party manufacturing" demand [S18, S21] | how-it-works (AEO answers) | Answer-capsule FAQs under question-form H2s — the query the buyer actually types |

## 4 · Integrations plan (the whole stack, one approval)

- **Project-intake RFQ form → info@kairali.com** (locked fact). packages/forms store-first spec (persist → Satyam CRM handoff); visible boolean consent via `@kairali/legal`; guest-only. Fields: name · company/brand · business email · phone/WhatsApp (country code) · country · engagement model (select: private label / third party / loan licence / not sure — pre-filled from page) · product category (multiselect from the four) · project scale/quantity (free text) · message · consent. Low-friction anti-spam (standard honeypot/turnstile; humans configure keys).
- **data-cta on every primary control:** `rfq-submit`, `rfq-open`, `model-select`, `whatsapp-click`, `call-click`, `catalogue-download`, `presentation-download`, `storefront-handoff`, per-category `category-rfq`.
- **Chat bubble — interim Priya/Chatbase bot** (chatbotId `rpNt_uRW6W8EDiTf6AvYJ`) per the standing 13-Jul interim-chat ruling, under the chat-bubble law: single slot, facade-loaded, consent-yield, no auto-open, hidden on the intake-form page. Replaced when the entity bots land.
- **WhatsApp CTA** — sticky mobile bar + header, reference behaviour; interim number +91 92898 38797 per the 13-Jul ruling, **flagged for swap** (B2B desk number = niche brief §7 ask #3).
- **Catalogue/presentation downloads** — the two documents the live contract page already offers [OWN-5]; served as direct downloads with `data-cta`, no email-gate this phase (gating is an owner call later).
- **Schema:** Organization/Manufacturer + WebSite + BreadcrumbList sitewide; Service schema on the three service pages; FAQPage on how-it-works + service pages; no Product-with-price anywhere (quote model).
- **Analytics/consent:** GA4 + Factory consent banner (decline-non-essential default); GSC at flip time (HUMAN action). **No voice integration**; nothing else fires.

## 5 · Honest limitations

Real MOQ ladder, lead times, client/brand references, export-market list and the desk's WhatsApp number are UNVERIFIED (niche brief §7) — until answered, pages carry only the published claims ("Low MOQs", 30-day launch) verbatim. The "95% Testified Results" line is NOT carried (ask #5). SEM observations directional only.
