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
