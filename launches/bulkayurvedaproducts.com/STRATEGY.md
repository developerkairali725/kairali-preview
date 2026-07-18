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

## 6 · GO-science declaration block (MoA · NDFF · signature MCB · stage)

**Declared 2026-07-18 22:23:58 IST** — lifted from the build-lane self-check (`launches/bulkayurvedaproducts.com/go-science/2026-07-18-selfcheck.md`, 18 Jul 2026) into this strategy artifact per D-GO-SCIENCE-GATE, so the declarations live where the audit reads them (sibling sites FAILed GS-MCB-6/GS-MOA-3 for leaving this in the self-check only). Content unchanged from the self-check; NDFF source unchanged (see honesty note below).

- **MoA (Market of Avatar — Market-2.0 specificity):** the **brand founder / D2C or e-commerce seller** launching an Ayurvedic or herbal line (the r/Entrepreneur "looking for a contract manufacturer" buyer); secondarily the established brand/exporter adding an India manufacturing base (incl. MLM/direct-selling companies) and the loan-licence seeker with their own products/approvals needing a licensed WHO-GMP facility. Niche: white-label / private-label / contract (third-party) manufacturing of Ayurvedic and herbal products across the published dosage forms. Type: B2B partnership decision (not procurement). Size: project-scale engagements (formulation → packaging → QA). Misfits excluded: bulk restock buyers (routed to bulkayurvedaoils.com), retail consumers (routed to the store).
- **NDFF (declared source: `docs/kappl-inputs/bulk-b2b-niche-brief.md` §3 signal set + BRIEF §Who it is for — owner-supplied research; NOT MoA interviews, see honesty note):** **Need** — a licensed, certified line and a compliant path to market. **Desire** — their own branded range without capex. **Fear** — being one of a contract manufacturer's forgotten small clients; quality that embarrasses their brand. **Frustration** — "flexible MOQs" teasers and gated portals that waste weeks. **Secret desire** — *being known as a brand owner* — their name on the shelf (the MCB is rooted here).
- **Signature MCB (the ONE anchor for this site):** *how to own your Ayurvedic brand — without building a factory or holding licences.* On-page form: hero "**Your brand. Our WHO-GMP line.**" + lede "Contract manufacturing of Ayurvedic and herbal products without building your own plant — formulation, sourcing, production, packaging and QA." Every page of this site anchors to this MCB.
- **SBJ / awareness stage:** **solution-aware** founder comparing manufacturing partners; SBJ Stage 1→2 (CMA → Strong Foundation) on the homepage, Stage 3 (TC) carried by the Phase-1 guide pages (how-it-works). Right emotions: desire ("Your brand." leads the page), curiosity (the four-model ledger), trust (published counters + certs with provenance); no pressure devices.
- **Honesty note (GS-MOA-3 / HARD GATE 6):** NDFF depth is inferred from the owner-supplied niche research, not from real MoA interviews — MoA interviews remain an owner-side ask before the NDFF is treated as validated. Declared here so the trace is explicit, never assumed.
