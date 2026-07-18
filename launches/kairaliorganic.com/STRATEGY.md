# STRATEGY — kairaliorganic.com (Kairali Organics)

**Drafted 2026-07-18 18:16:30 IST · front gate 2 of 4 (strategy — the FAT gate: ONE approval covers sitemap + per-page keywords + competitor-keyword map + integrations plan + the kairorganics.com 301 plan) · status: AWAITING APPROVAL.**
**Inputs: BRIEF.md (gate 1) · docs/kappl-inputs/kair-pair-brand-mining.md · docs/kappl-inputs/kair-pair-comp-set.md.**

## 1 · Sitemap (14 URLs, lean shell — "lean at birth, complete at launch")

```
/                       Home (golden page)
/products               Range overview (the nine, as cards)
/products/kaircin       ┐
/products/kairoil       │
/products/kairbal       │  one page per proprietary product —
/products/kairpack      │  brand-navigational landing + hand-off
/products/kairwash      │  (mined descriptor, library photography,
/products/kairheal      │  where-to-buy links, enquiry CTA)
/products/kairkare      │
/products/kairkare-plus │
/products/kairbossom    ┘
/about                  Story + brand definition + manufacturing trust (absorbs legacy about-us.aspx + kairali-ayurvedic-group.aspx)
/contact                Enquiry form + where-to-buy + WhatsApp
/privacy                Privacy policy
```

Home section order: brand-definition hero → the nine (range grid) → chemical-free philosophy + ingredient-transparency block → where-to-buy hand-off → manufacturing trust (WHO-GMP / lineage lines) → sister ranges → enquiry band.
Kairtis gets `/products/kairtis` ONLY if the owner rules it into the range (brief Q1) — the slug is reserved, not built.

## 2 · Keywords per page (primary · secondary)

| Page | Primary | Secondary |
|---|---|---|
| / | kairali organic products | kairali organics · kairali chemical free products |
| /products | kairali proprietary organic products | kairali ayurvedic proprietary products |
| /products/kaircin | kaircin | kaircin kumkumadi facial oil · kairali facial oil serum |
| /products/kairoil | kairoil | kairali hair oil · kairoil ayurvedic hair oil |
| /products/kairbal | kairbal | kairali body cleansing powder · herbal body wash powder |
| /products/kairpack | kairpack | kairali face pack · ayurvedic herbal face pack |
| /products/kairwash | kairwash | kairali hair cleansing powder |
| /products/kairheal | kairheal | kairali oil for sprains |
| /products/kairkare | kairkare | kairali body massage oil |
| /products/kairkare-plus | kairkare plus | kairali pain relief massage oil |
| /products/kairbossom | kairbossom | kairali bosom massage oil |
| /about | kairali organics brand | kairali ayurvedic products manufacturer |
| /contact | kairali organics contact | kairali products enquiry |

Rules (comp-set §3): brand + brand-plus-category phrasings ONLY — generic category heads ("ayurvedic facial oil") stay with the Shopify stores; the shell must not cannibalize commerce pages. Every product page canonicalizes to itself and links OUT to its live PDP as the transactional surface.

## 3 · Competitor-keyword-to-page map (who holds the term today → which page takes it)

| Term cluster | Holds it today (18 Jul recon) | Our page | Intent play |
|---|---|---|---|
| "kairali organic(s)" | Legacy kairaliorganic.com (stale) · kairbykairali.com · kairali.com | / | Navigational: rebuilt home + Organization schema + sameAs owns the SERP; sitelinks from clean IA |
| Product brand terms (kaircin, kairoil…) | kairaliproducts.in PDPs · Amazon brand store · third-party pharmacies (sushainclinic etc.) | /products/<slug> | Shell ranks as the BRAND authority; PDP/marketplaces keep transactional rank — page links straight to them (complementary, not competing) |
| "kairali chemical free / natural products" | Fragmented (marketplaces + old pages) | / + /about | Definition + philosophy blocks carry the phrasing (with substantiation pairing per brief Q4) |
| "kairali products where to buy / online" | kairaliproducts.in/.com + marketplaces | /contact + home hand-off block | Hand-off block is the answer surface; outbound events measure it |
| Generic "organic skincare india" etc. | Juicy Chemistry, SoulTree, Kama, Forest Essentials | — | DELIBERATELY NOT CONTESTED (comp-set §1b — certified players own it; we hold no cert) |

## 4 · Integrations plan (which events fire, which forms, chat)

- **Enquiry form** (/contact + home band): fields name · email · phone · message · consent checkbox + privacy link; store-first with consent boolean, delivery → **info@kairali.com** (locked fact). Event: `data-cta="enquiry-submit"`.
- **data-cta events:** `hero-primary` (hero CTA) · `buy-online-in` / `buy-online-com` / `buy-bigbasket` / `buy-flipkart` / `buy-amazon` (hand-off block, one event per outbound target) · `pdp-out-<product>` (product-page store links) · `whatsapp-click` · `enquiry-submit` · `sister-range-kair` (cross-brand block). Outbound hand-off clicks are THE funnel metric for a shell.
- **WhatsApp:** chat-first CTA, interim number per standing rule (Priya +91 92898 38797) until a products number is ruled; swap is a token change.
- **Chat bubble:** Chatbase per D-20260718-05 (@kairali/chat ChatbaseLoader, interim Priya bot rpNt_uRW6W8EDiTf6AvYJ) — placement/behaviour per docs/design/chat-bubble-placement.md (bottom-right, facade-loaded, consent-yield, no proactive popups on load). Entity-bot swap rides the fleet-wide Chatbase consolidation, not this build.
- **Schema:** Organization (+ logo, sameAs → the real socials mined in the brand-mining doc §2 + kairali.com) on / · Product schema (no offers/price — offers live on the stores) on product pages · BreadcrumbList.
- **Analytics/monitoring:** fleet standard (Vercel + data-cta wiring per checklist); uptime + Fleet Pulse row at ship gate.

## 5 · kairorganics.com 301 plan (+ the sibling forward)

- **kairorganics.com** (registrar parking today, zero content, zero URLs to protect): **plain domain-level 301 → kairaliorganic.com**, single hop, preserve query strings, subdomains included. Config rows are PREPARED in `docs/redirects/forward-farm.csv` + `docs/redirects/cloudflare-upload.csv` (this PR). Because the target is live TODAY (legacy site) and stays live through the rebuild, the redirect is safe to execute at any time — **execution (registrar/Cloudflare/DNS) is a HUMAN action, never the agent's**.
- **kairaliorganics.com** (the "ali" spelling): already mapped in forward-farm.csv — interim → kairaliproducts.in, final → kairaliorganic.com at Wave-1 launch (D1 rule 8). No change needed; noted here so ONE approval covers the whole redirect picture.
- **Legacy-URL protection map** (rebuild, same domain — these become our own 301s/rebuilds at DNS flip):

| Legacy URL | Fate |
|---|---|
| /default.aspx | KEEP-AS-PAGE → / |
| /about-us.aspx | MERGE → /about |
| /kairali-ayurvedic-group.aspx | MERGE → /about (group section) |
| /contact-us.aspx · /enquire-now.aspx | MERGE → /contact |
| /free-online-consultation.aspx | → /contact (pending brief Q3) |
| /career.aspx · /apply-now.aspx | 301 → kairali.com careers surface (owner confirms) |

## 6 · Ship shape

EN only · organic site class (gates/registry.yaml; checklist generated at build) · Lighthouse ≥90/100 SEO · compliance lint zero · asset step: run the image-library download (one human command, docs/media/kairali-product-images/README.md) before the golden page so real photography lands from day one.

---
**Approval line:** this ONE approval signs sitemap + keywords + competitor map + integrations + the 301 plan above.
