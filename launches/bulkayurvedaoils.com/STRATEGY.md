# STRATEGY — bulkayurvedaoils.com (front gate 2 of 4 — the fat gate)

**Drafted 2026-07-18 18:07:00 IST · for the `strategy` row of `approvals.yaml`. ONE approval covers: sitemap · primary+secondary keywords per page · competitor-keyword-to-page map · integrations plan. Evidence basis: `docs/kappl-inputs/bulk-b2b-niche-brief.md` [Sn]/[OWN-n] citations.**

## 1 · Sitemap (12 indexable pages day one + graduating long-tail)

| # | URL | Page | Phase |
|---|---|---|---|
| 1 | `/` | Home — supply-desk statement, cert strip, segment lanes, featured bulk formulations, RFQ | Golden page |
| 2 | `/oils/` | Bulk catalog hub — thailams + proprietary oils + therapy powders, pack-size/MOQ table (verified packs only), ItemList schema | 1 |
| 3 | `/oils/classical-thailams` | Category — the live bulk collection's 4 thailams (5000 ml) with therapy-context framing | 1 |
| 4 | `/oils/proprietary-oils` | Category — Kairali proprietary oils in wholesale bulk packaging (store's published collection) | 1 |
| 5 | `/oils/therapy-powders-choornams` | Category — Udwarthanam/Kizhi/choornams (500–1000 g packs; adjacency the live collection carries) | 1 |
| 6 | `/for/spas-hotels-resorts` | Segment lane — provisioning treatment programmes; RFQ pre-filled `segment=spa` | 1 |
| 7 | `/for/panchakarma-centres-clinics` | Segment lane — therapeutic-volume buyers; RFQ pre-filled | 1 |
| 8 | `/for/distributors-importers` | Segment lane — KAPPL distribution lanes (retail/wholesale/exclusive) as published [OWN-4]; RFQ pre-filled | 1 |
| 9 | `/quality` | Cert strip as published + GMP certificate artefacts + Pollachi facility, labs, in-house extraction [OWN-3/4/5] | 1 |
| 10 | `/how-bulk-supply-works` | The guide/AEO page — enquiry→quote→dispatch process, pack formats, documentation, FAQ | 1 |
| 11 | `/request-a-quote` | RFQ page (form also embedded on 2–8) | 1 |
| 12 | `/about` + `/contact` | KAPPL story (1908/1989 framing as published), locked contact | 1 |
| — | `/oils/<formulation-slug>` ×11 | Per-formulation pages seeded from the live bulk SKUs [OWN-6] (e.g. `/oils/balaguluchyadi-kera-thailam`) — the rankable long-tail; graduate as content is written to depth, never thin stubs | 2 |

EN only. No `/lp/` this weekend (LP doctrine is its own lane). Legal/consent pages from `@kairali/legal`.

## 2 · Keywords per page (P = primary · S = secondary)

| Page | P | S |
|---|---|---|
| Home | bulk ayurvedic oils | ayurvedic oils wholesale · ayurvedic oil supplier India |
| /oils/ | ayurvedic oils wholesale bulk | bulk herbal oils · ayurvedic oil manufacturer |
| classical-thailams | ayurvedic thailam bulk | classical ayurvedic oils wholesale · kerala ayurvedic oils bulk |
| proprietary-oils | ayurvedic massage oil bulk | herbal massage oil wholesale · abhyanga oil supplier |
| therapy-powders | ayurvedic powder bulk (udwarthanam/kizhi) | herbal powder wholesale · choornam bulk supplier |
| for/spas-hotels | massage oil supplier for spas | ayurvedic oils for hotels resorts · spa supplies ayurvedic |
| for/panchakarma | ayurvedic oils for panchakarma centres | panchakarma oils bulk · clinic ayurvedic oil supply |
| for/distributors | ayurvedic oils distributor | ayurvedic products importer wholesale · become distributor ayurvedic |
| /quality | WHO-GMP ayurvedic manufacturer | GMP certified ayurvedic oils · ayurvedic oil manufacturer certifications |
| how-bulk-supply-works | how to buy ayurvedic oils in bulk | ayurvedic oil MOQ · bulk oil pack sizes 5 litre |
| formulation pages (2) | "<formulation> bulk/wholesale" (e.g. dhanwantharam thailam bulk) | "<formulation> supplier", "<formulation> 5 litre" |

## 3 · Competitor-keyword-to-page map

| Competitor + the keyword ground they hold | Our page that contests it | Angle that wins |
|---|---|---|
| Aadhunik — "manufacturer of natural oils", "body massage oils bulk", pack-size pages [S1, S2] | /oils/ + proprietary-oils | Actual WHO-GMP pharma manufacturer + classical thailam depth Aadhunik (skincare-led) lacks |
| Sivaroma — "massage oils wholesale suppliers India", MOQ-ladder + COA/SDS content [S3] | how-bulk-supply-works + /quality | Match the documentation transparency; beat with heritage + published cert artefacts |
| Natures Natural — "ayurvedic herbal oil" category B2B [S4] | /oils/ + classical-thailams | Formulation-true classical range vs generic "herbal oils" |
| IndiaMART dir pages — "herbal oil manufacturers" head terms [S7] | Home + /oils/ | A specialised manufacturer site outranks a directory when depth is real (the SERP already shows weak dedicated competition) |
| LinkedIn/list content — named-oil demand (dhanwantharam, mahanarayan, bala) [S20] | formulation pages (Phase 2) | Per-formulation pages with therapy context + RFQ, which list posts can't convert |
| Art of Vedas/Banyan — export wholesale portals [S15, S16] | for/distributors-importers | Public RFQ + manufacturer-direct positioning vs gated portals |

## 4 · Integrations plan (the whole stack, one approval)

- **RFQ/enquiry form → info@kairali.com** (locked fact). packages/forms store-first spec: persist server-side first, then CRM handoff (Satyam lane); visible boolean consent checkbox wired to `@kairali/legal`; labels above fields; guest-only. Fields (niche-normed, minimal): name · company · business email · phone/WhatsApp (country code) · country · interest (pre-filled category/segment from the page) · quantity/scale (free text) · message · consent. Low-friction anti-spam (no bot-detection bypassing; a standard honeypot/turnstile the HUMANS configure).
- **data-cta on every primary control** (Ship-Gate law): `rfq-submit`, `rfq-open`, `whatsapp-click`, `call-click`, `catalogue-download`, per-category `category-rfq`, `storefront-handoff`. These name the events the dashboard reads; no extra analytics surface invented.
- **Chat bubble — interim Priya/Chatbase bot** (chatbotId `rpNt_uRW6W8EDiTf6AvYJ`) per the standing 13-Jul interim-chat ruling (DECISIONS.md), deployed under the chat-bubble law (docs/design/chat-bubble-placement.md): single corner slot, facade-loaded, consent-yield, no auto-open, hidden on the RFQ form page (form-page hide state §4) and near any Storefront handoff. Replaced when the four entity bots land.
- **WhatsApp CTA** — sticky mobile bottom bar + header CTA, kairali.com/arogyakendra reference behaviour (single-slot law respected). Number: interim +91 92898 38797 per the 13-Jul ruling ("until a group number is provided") — **flagged loudly for swap**; the B2B desk number is niche-brief §7 ask #3.
- **Storefront product cards** (packages/product-card, Shopify Storefront API) for the 11 live bulk SKUs — display + handoff only, never a cart (D-BULK-B2B).
- **Schema:** Organization/Manufacturer + WebSite + BreadcrumbList sitewide; ItemList on /oils/; Product (quote-model, no invented sku/price) on formulation pages; FAQPage on lanes + guide.
- **Analytics/consent:** GA4 + Factory consent banner (decline-non-essential default), reserved layout space (no CLS). GSC property at flip time (HUMAN action).
- **No voice integration** on this surface; nothing else fires.

## 5 · Honest limitations

MOQ ladder, lead times, export-market list, documentation set and the B2B WhatsApp number are UNVERIFIED (asks §7 of the niche brief) — pages ship with published-claims-only until answered. SEM/ads observations were directional (US-geo tooling); paid is a later, data-led lane.

## 6 · GO-science declaration block (MoA · NDFF · signature MCB · stage)

**Declared 2026-07-18 22:23:58 IST** — lifted from the build-lane self-check (`launches/bulkayurvedaoils.com/go-science/2026-07-18-selfcheck.md`, 18 Jul 2026) into this strategy artifact per D-GO-SCIENCE-GATE, so the declarations live where the audit reads them (sibling sites FAILed GS-MCB-6/GS-MOA-3 for leaving this in the self-check only). Content unchanged from the self-check; NDFF source unchanged (see honesty note below).

- **MoA (Market of Avatar — Market-2.0 specificity):** the **procurement buyer** at (i) a spa/hotel/resort provisioning Ayurvedic treatment programmes (abhyanga, shirodhara — India + export), (ii) a panchakarma centre / Ayurvedic clinic / hospital / physiotherapy practice buying repeat therapeutic volume, or (iii) a distributor/importer/retailer/pharmacy on the KAPPL distribution lanes. Niche: bulk ready-made classical + proprietary Ayurvedic oils and therapy powders. Type: B2B repeat-restock procurement. Size: therapy-volume orders (the store's verified 5000 ml / 1000 g bulk formats). Misfits excluded: retail consumers (routed to the store), brand founders seeking private label (routed to bulkayurvedaproducts.com).
- **NDFF (declared source: `docs/kappl-inputs/bulk-b2b-niche-brief.md` §3 signal set + BRIEF §Who it is for — owner-supplied research; NOT MoA interviews, see honesty note):** **Need** — reliable therapy-volume restock with documentation. **Desire** — one certified manufacturer-direct line, no surprises. **Fear** — adulterated/repacked stock, unverifiable claims, being burned by a trader. **Frustration** — opaque quoting, fake precision ("flexible MOQs" that mean nothing). **Secret desire** — running a supply line so dependable it makes their own operation look best-in-class.
- **Signature MCB (the ONE anchor for this site):** *how to keep classical Ayurvedic oils in stock at therapy grade — without traders, repacking and provenance doubt.* On-page form: hero "**Classical Ayurvedic oils, by the batch.**" + lede "No trading layer, no repacking: every batch is quoted direct from our Pollachi facility." Every page of this site anchors to this MCB.
- **SBJ / awareness stage:** **problem-aware → solution-comparing** B2B buyer; SBJ Stage 1→2 (CMA → Strong Foundation) — the site's whole job is the non-pressured hand-raise (RFQ), never a purchase. Right emotions: curiosity, trust/warmth, calm confidence; zero false urgency.
- **Honesty note (GS-MOA-3 / HARD GATE 6):** secret-desire depth is inferred from the owner-supplied niche research, not from real MoA interviews — MoA interviews remain an owner-side ask before the NDFF is treated as validated. Declared here so the trace is explicit, never assumed.
