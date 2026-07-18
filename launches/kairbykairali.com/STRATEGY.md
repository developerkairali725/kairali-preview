# STRATEGY — kairbykairali.com (KAIR)

**Drafted 2026-07-18 18:18:30 IST · re-targeted 2026-07-18 18:44:30 IST per D-KAIR-CANONICAL · front gate 2 of 4 (strategy — the FAT gate: ONE approval covers sitemap + per-page keywords + competitor-keyword map + integrations plan + this domain's redirect picture) · status: AWAITING APPROVAL.**
**Inputs: BRIEF.md (gate 1) · docs/kappl-inputs/kair-pair-brand-mining.md · docs/kappl-inputs/kair-pair-comp-set.md.**

## 1 · Sitemap (10 URLs, lean shell — rebuild in place of the live 12-URL brochure)

```
/                        Home (golden page)
/range                   Range overview (five categories as cards)
/range/shampoos          Lemon · Orange Blossom · Amla Shikakai · Henna · Aloe Vera (· Green Tea per brief Q1)
/range/soaps             Herbal Beauty · Neem · Sandal (· Rose per brief Q1) · combo pack
/range/body-wash         Strawberry Shower Gel
/range/hair-conditioner  Orange-Hibiscus Herbal Hair Conditioner (per brief Q1)
/range/lotions           Green Tea Herbal Lotion · Grape Seed & Almond Herbal Lotion
/about                   Brand story ("Kair by Kairali") + manufacturing trust
/contact                 Enquiry form + where-to-buy + WhatsApp
/privacy                 Privacy policy
```

Category pages (not per-variant pages): KAIR's search demand is category-shaped ("kairali shampoo") rather than per-variant navigational — variants are sections with mined descriptors, photography, and a store link where a PDP exists / enquiry CTA where none does (brief Q1). Home section order: brand-definition hero → category grid → natural-ingredients philosophy → where-to-buy hand-off → manufacturing trust → sister ranges → enquiry band.

## 2 · Keywords per page (primary · secondary)

| Page | Primary | Secondary |
|---|---|---|
| / | kair by kairali | kair products · kairali herbal cosmetics |
| /range | kair herbal cosmetics range | kairali personal care products |
| /range/shampoos | kairali herbal shampoo | kairali aloe vera shampoo · kairali lemon shampoo · amla shikakai shampoo kairali |
| /range/soaps | kairali herbal soap | kairali neem soap · kairali sandal soap · kairali beauty soap |
| /range/body-wash | kairali body wash | kairali strawberry shower gel |
| /range/hair-conditioner | kairali hair conditioner | orange hibiscus herbal conditioner |
| /range/lotions | kairali herbal lotion | kairali moisturizing lotion · grape seed almond lotion |
| /about | kair by kairali brand | kair kairali ayurvedic group |
| /contact | kair products contact | kairali cosmetics enquiry |

Rules (comp-set §3): brand-plus-category phrasings only; generic heads ("herbal shampoo india") stay with the Shopify stores. **"chemical-free"/"organic" appear NOWHERE in titles, headings, metadata, or copy on this site** (D3 boundary — lint-checkable at build). The live homepage's title/description already target "Herbal Cosmetics | Skin Care and Hair Care Products — Kairbykairali" — the rebuild keeps that scent (herbal cosmetics + brand) while sharpening per-page targeting.

## 3 · Competitor-keyword-to-page map

| Term cluster | Holds it today (18 Jul recon) | Our page | Intent play |
|---|---|---|---|
| "kair by kairali" / "kair products" | THIS domain (live, stale: KTAHV spa awards, tea copy) — it already ranks #1-adjacent for its own brand terms | / | Rebuild in place KEEPS the equity and fixes the message; Organization schema/sameAs + the kairproducts.com 301 consolidate the SERP |
| "kairali shampoo / soap / body wash" | kairaliproducts.in PDPs · Amazon · marketplaces | /range/<category> | Brand-category authority page linking OUT to PDPs (complementary) |
| Variant terms ("kairali neem soap") | Marketplace listings | /range/soaps §neem etc. | Section anchors + Product schema (no offers) |
| Generic "herbal shampoo/soap india" | Mamaearth, Khadi, Biotique, WOW etc. | — | DELIBERATELY NOT CONTESTED — mass-market head terms are an ads/commerce game, not a shell's |
| "kairali organic …" | (Organics estate) | — | NOT this site's terms, ever (D3) — the sister-ranges block hands the visitor across instead |

## 4 · Integrations plan (which events fire, which forms, chat)

- **Enquiry form** (/contact + home band): name · email · phone · message · consent checkbox + privacy link; store-first with consent boolean, delivery → **info@kairali.com** (locked fact — replaces the live site's support@kairaliproducts.com). Event: `data-cta="enquiry-submit"`.
- **data-cta events:** `hero-primary` · `buy-online-in` / `buy-online-com` / `buy-amazon` / `buy-flipkart` / `buy-bigbasket` (hand-off block) · `pdp-out-<variant>` (per store-linked variant) · `variant-enquire-<variant>` (variants without a PDP, per brief Q1) · `whatsapp-click` · `enquiry-submit` · `sister-range-organics`.
- **WhatsApp:** chat-first CTA, interim number per standing rule; swap is a token change.
- **Chat bubble:** Chatbase per D-20260718-05 (@kairali/chat ChatbaseLoader, interim Priya bot) — placement law per docs/design/chat-bubble-placement.md; entity-bot swap rides the fleet consolidation.
- **Schema:** Organization (+ sameAs → the real socials from the live footer, brand-mining doc) on / · Product schema without offers on range sections · BreadcrumbList.
- **Analytics/monitoring:** fleet standard; uptime + Fleet Pulse row at ship gate.

## 5 · Redirect picture + legacy protection map (rebuild in place — D-KAIR-CANONICAL)

- **kairproducts.com** (registrar parking today, zero content, zero URLs to protect): **plain domain-level 301 → kairbykairali.com**, single hop, preserve query strings, subdomains included. Config rows PREPARED in `docs/redirects/forward-farm.csv` + `docs/redirects/cloudflare-upload.csv` (this PR). Because the target is live TODAY and stays live through the rebuild, the redirect is safe to execute at any time — **execution (registrar/Cloudflare/DNS) is a HUMAN action, never the agent's**.
- **Legacy-URL protection map** — the live site's 12 URLs (mined 18 Jul 2026 ~18:40 IST: homepage links + sitemap.aspx enumeration; robots.txt and sitemap.xml both 404):

| Legacy URL | Fate |
|---|---|
| /default.aspx (+ #Products #Brands #Award #BuyTea anchors) | KEEP-AS-PAGE → / |
| /about-us.aspx | MERGE → /about |
| /kairali-ayurvedic-group.aspx (+ section anchors) | MERGE → /about (group section) |
| /vision-and-mission.aspx | MERGE → /about |
| /founders-message-and-meet-the-directors.aspx | MERGE → /about (heritage per lineage doc) — or 301 → kairali.com founders surface (owner confirms) |
| /contact-us.aspx · /enquire-now.aspx | MERGE → /contact |
| /free-online-consultation.aspx | → /contact (consultation is a centres/KTAHV surface — owner confirms) |
| /career.aspx · /apply-now.aspx | 301 → kairali.com careers surface (owner confirms) |
| /privacy-policy.aspx | KEEP-AS-PAGE → /privacy |
| /sitemap.aspx | replaced by sitemap.xml on the rebuild |

## 6 · Ship shape

EN only · organic site class (registry checklist at build) · Lighthouse ≥90/100 SEO · compliance lint zero (including the site-level "chemical-free/organic absent" check from §2) · asset step: image-library download (one human command, docs/media/kairali-product-images/README.md) before the golden page; legacy-site binary asset pull is LOW-VALUE here (same product shots at lower resolution) but the sitemap/structure capture required by the asset-mining checklist is done (this doc + mining doc §2b).

---
**Approval line:** this ONE approval signs sitemap + keywords + competitor map + integrations + the kairproducts.com 301 + protection map above.
