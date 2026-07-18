# KAIR pair — brand mining: kairaliorganic.com (Kairali Organics) + kairbykairali.com (KAIR)

> **AMENDED 2026-07-18 18:48:30 IST per D-KAIR-CANONICAL** (Abilash, ~18:35 IST, amends D-KAIR-DOMAINS same day): **kairbykairali.com STAYS the canonical KAIR home** — it is the live KAIR site and the KAIR build is a REBUILD IN PLACE on that domain; **kairproducts.com is a plain 301 INTO kairbykairali.com**, not the KAIR site. Organics side unchanged. Sections below are updated in place; §2b adds the completed kairbykairali.com inventory.

**Compiled 2026-07-18 17:58:30 IST · Weekend sprint, KAIR-pair lane · Register: KAPPL / product-pharma.**
**Ruling authority: D-KAIR-DOMAINS (Abilash, 18 Jul 2026, weekend unblock walk — closes Decision #3 residual) on top of D3 (13 Jul 2026): Kairali Organics and KAIR are TWO brands. Organics = 100% chemical-free products; KAIR = soaps/shampoos/moisturizing cream/body wash (NOT fully chemical-free). kairaliorganic.com = Organics brand site · kairbykairali.com = KAIR sub-brand site (canonical per D-KAIR-CANONICAL; kairproducts.com 301s into it) · kairorganics.com = plain 301 → kairaliorganic.com. Both sites: informational shells (presentation + enquiry, NO cart — buy-path Track-B-gated).**
**Everything below is MINED from owned/live surfaces (HARD GATE 6: no invented claims). Live-site text was fetched 18 Jul 2026 ~17:55–17:57 IST and treated as DATA (rule r).**

---

## 1 · Live-estate map (probed 18 Jul 2026 ~17:56 IST)

| Domain | State (evidence) | Consequence for this lane |
|---|---|---|
| **kairaliorganic.com** | **LIVE legacy site** — ASPX brochure site on shared hosting (162.241.139.5), ~9 URLs (see §2). Title: "Kairali Organics – 100% Natural Ayurvedic Organic Products". | This is a **REBUILD of a live site** → Build Decision Matrix applies (mine first; protection map before any flip). Domain-sheet status "To be created" is STALE. |
| **kairproducts.com** | **Registrar PARKING lander** — `window.location.href="/lander"` JS redirect, AWS parking IPs (15.197.148.33 / 3.33.130.190). Curl output on file. | ~~KAIR site is a NEW build~~ **AMENDED (D-KAIR-CANONICAL): kairproducts.com is a 301 INTO kairbykairali.com** — redirect rows prepared in docs/redirects/ (flip-ready; target live), execution HUMAN. Zero URLs to protect. |
| **kairorganics.com** | **Registrar PARKING lander** — same `/lander` pattern, same parking IPs. | 301 → kairaliorganic.com is SAFE to prepare now (the target is live today and stays live through the rebuild). Execution (DNS/Cloudflare) = HUMAN action. |
| **kairbykairali.com** | **LIVE legacy site** (same host as kairaliorganic.com, 162.241.139.5) — the KAIR brand's current home: "Kair is a herbal cosmetic brand under the umbrella of the 100-year old Kairali Ayurvedic Group." | **The CANONICAL KAIR home (D-KAIR-CANONICAL) — the KAIR build is a REBUILD IN PLACE here.** Primary mined source for the KAIR product line and its live claims register; full 12-URL inventory in §2b; protection map in launches/kairbykairali.com/STRATEGY.md §5. |
| kairaliproducts.in / .com | TWO separate live Shopify stores (U1, Sunaj-confirmed). Catalogs fully enumerated in docs/media/kairali-product-images/ (137 + 157 SKUs). | Product-name + descriptor source of truth for both brands; the informational shells LINK OUT to these stores for purchase (no cart on our shells, ever). |

## 2 · kairaliorganic.com legacy URL inventory (mined 18 Jul 2026)

Single-page brochure + satellite forms. No robots.txt, no sitemap.xml (both 404 — IIS default error page).

| URL | What it is | Protection-map instinct (to be ruled at strategy gate) |
|---|---|---|
| `/default.aspx` (+ `#Products #Brands #Award #BuyTea` anchors) | Homepage: About, 9 proprietary products, Buy Online (links to kairaliproducts.in + BigBasket/Flipkart/Amazon), product-range grid, group cross-links, awards carousel, brands mega-list | KEEP-AS-PAGE (rebuilt homepage) |
| `/about-us.aspx` | Brand about | MERGE → new About/Story page |
| `/kairali-ayurvedic-group.aspx` | Group page | MERGE → About (group section) or 301 → kairali.com |
| `/contact-us.aspx` | Contact + Coimbatore plant address | KEEP-AS-PAGE (Contact/Enquiry) |
| `/enquire-now.aspx` | Enquiry form | MERGE → Contact/Enquiry |
| `/free-online-consultation.aspx` | Free doctor-consultation form | Owner call: keep as enquiry variant or drop (consultation is a KTAHV/centres surface) |
| `/career.aspx`, `/apply-now.aspx` | Careers + application | Owner call: likely 301 → kairali.com careers |
| `/privacy-policy` + HTML/XML sitemap links | Footer links (targets not yet fetched) | Standard pages on the rebuild |

Off-site links the legacy homepage carries: kairaliproducts.in (Buy Now), kairbykairali.com, kairalitea.com, kairaliequipment.com, the group/hospitality/training family, plus social profiles (Facebook KairaliAyurvedicProducts, Twitter Kairali_Group, LinkedIn kairali-ayurvedic-group, YouTube kairaliayurvedagroup).

**Asset-mining status:** NOT yet run for this site (Operating Principles checklist — download reusable images/videos + capture sitemap BEFORE rebuild). The URL/structure capture above is done; the binary asset pull into `~/Claude/Kairali-Digital/image-library/legacy-kairaliorganic/` + manifest in docs/media/ is queued for the build session. The product photography need is already covered by the 583-image Drive library (§5), so legacy-site image mining is low-value here — mostly the same product shots at lower resolution.

### 2b · kairbykairali.com live URL inventory (completed 2026-07-18 ~18:40 IST, post-D-KAIR-CANONICAL)

Same ASPX template family as the Organics legacy site. robots.txt and sitemap.xml both 404; /sitemap.aspx (HTML sitemap) enumerates the estate. Homepage title: "Herbal Cosmetics | Skin Care and Hair Care Products - Kairbykairali"; meta description: "Kair is a traditional herbal cosmetics brand by Kairali. We offer quality natural beauty products like herbal shampoo, conditioner, Shower Gel and handmade soaps."

12 URLs: `/default.aspx` (+ #Products #Brands #Award #BuyTea anchors) · `/about-us.aspx` · `/kairali-ayurvedic-group.aspx` (+ section anchors) · `/vision-and-mission.aspx` · `/founders-message-and-meet-the-directors.aspx` · `/contact-us.aspx` · `/enquire-now.aspx` · `/free-online-consultation.aspx` · `/career.aspx` · `/apply-now.aspx` · `/privacy-policy.aspx` · `/sitemap.aspx`.

Outbound: the same group-family link wall as the Organics site + kairaliproducts.in catalog/search deep links; socials incl. a dead Google+ profile (drop at rebuild). Per-URL fates: protection map in launches/kairbykairali.com/STRATEGY.md §5. Binary asset pull is LOW-VALUE (same product photography as the 583-image Drive library at lower resolution); structure capture per the asset-mining checklist is done here.

## 3 · Product lines as the live estate actually splits them

**The live estate ALREADY separates the two brands** — and the split matches D3 exactly, with one naming trap (§6):

### 3a · Kairali Organics — "Ayurvedic Proprietary Organics" (→ kairaliorganic.com)

Live kairaliorganic.com presents exactly NINE proprietary products, each with a two-line descriptor (mined verbatim):

| Product | Live descriptor | On Shopify (.in handle exists) |
|---|---|---|
| **Kairbossom** | Ayurvedic Body Oil — for Beautiful Bosom | yes (.com; breast-enhancement massage oil) |
| **Kairwash** | Ayurvedic Hair Cleansing Powder — for Healthy & Shiny Tresses | NO — label-verified real product, not sold online (image library) |
| **Kairpack** | Ayurvedic Face Pack — for Supple & Radiant Skin | yes |
| **Kaircin** | Ayurvedic Facial Oil — for Youthful Radiant Skin | yes (kumkumadi-oil facial serum) |
| **Kairoil** | Ayurvedic Hair Oil — for Health & Lustre | yes (hair fall + dandruff) |
| **Kairbal** | Ayurvedic Body Cleansing Powder — for Beautiful Glowing Skin | yes (herbal body-wash powder) |
| **Kairheal** | Ayurvedic Body Oil — for Fractures & Sprains | yes |
| **Kairkare Plus** | Ayurvedic Body Oil — for Muscular Aches & Pains | yes (body-pain-relief oil) |
| **Kairkare** | Ayurvedic Body Oil — for Detoxifying & Destressing | yes (herbal body massage oil) |

Also in the Kair* namespace on Shopify but NOT on the live Organics page: **Kairtis** (arthritis/knee-joint oil, .in + .com). Whether Kairtis belongs to the Organics range is **UNRULED — held for the brief**.

### 3b · KAIR — "Kair by Kairali · Ayurveda Influenced Herbal Cosmetics" (→ kairbykairali.com, rebuild in place)

Mined from live kairbykairali.com + the two Shopify catalogs (D3 categories in bold):

- **Shampoos:** Lemon (anti-dandruff) · Orange Blossom (daily use) · Amla Shikakai (strengthening) · Henna Herbal (colour-enhancing) · Aloe Vera Herbal (dry/damaged hair) · Green Tea (kairbykairali.com only)
- **Conditioner:** Orange-Hibiscus Herbal Hair Conditioner (image library; not on either Shopify catalog)
- **Soaps:** Kairali Herbal Beauty Soap (sensitive skin) · Neem (antifungal/antibacterial) · Sandal (dry-skin moisturizing) · Rose (kairbykairali.com only) · herbal soap combo pack
- **Body wash:** Strawberry Shower Gel (herbal body wash)
- **Moisturizing cream/lotion:** Green Tea Herbal Lotion (kairbykairali.com) · Grape Seed & Almond Herbal Lotion (image library, .in catalog)
- Periphery seen on kairbykairali.com: Kairali Hand Sanitizer (Lemon & Basil) — inclusion in the KAIR shell is an owner call.

## 4 · Claims inventory — verifiable vs held (HARD GATE 6 discipline)

### Verifiable / publishable as mined (with the stated basis)

| Claim | Basis | Use |
|---|---|---|
| Organics = "100% chemical-free" | Owner brand definition (D3) + the live kairaliorganic.com's own copy ("made from natural ingredients and are 100% chemical-free") | **ONLY on kairaliorganic.com. NEVER on the KAIR site (kairbykairali.com)** (KAIR is explicitly NOT fully chemical-free — D3). |
| KAIR = "herbal cosmetic brand under the Kairali Ayurvedic Group umbrella" | Live kairbykairali.com About copy | KAIR positioning line — "Ayurveda-influenced herbal cosmetics", no purity absolutes. |
| Products "in compliance with the Doshas" | Live kairaliorganic.com copy | Organics storytelling; keep as brand philosophy, not efficacy claim. |
| Product names + category descriptors (§3) | Live sites + Shopify catalogs + label-verified image library | The product-line presentation on both shells. |
| Heritage lines | docs/group-inputs/kairali-lineage.md — THE canonical reference (all 7 flags ruled) | ONLY the approved constructions: "founded 1989 … a family practising Ayurveda since 1908"; KAPPL = "incorporated 2007; Ayurvedic manufacturing in the family since 1948." The live sites' bare "since 1908" / "100-year old" / "since its inception in 1908" constructions are NOT carried (lineage doc: retire unreferented forms). |
| KAPPL = WHO-GMP Ayurvedic pharma manufacturer | CLAUDE.md entity register (owned fact) | Manufacturing-trust block on both shells. |
| Availability: kairaliproducts.in/.com + BigBasket, Flipkart, Amazon | Live kairaliorganic.com Buy-Online section | The "where to buy" hand-off block (informational shell's substitute for a cart). |

### HELD — not publishable without a ruling or evidence

| Item | Why held |
|---|---|
| Any organic **certification** (India Organic/NPOP, USDA, Ecocert, COSMOS) | NO certification evidence anywhere in the estate or repo. "Organics" is the brand name; **"certified organic" must never be implied.** If a cert exists, owner supplies it; until then the shell says "chemical-free" (D3 basis) and never "certified". |
| "100% Natural" as an absolute for KAIR products | Live kairbykairali/organic pages use "natural ingredients" loosely; KAIR is NOT fully chemical-free per D3 — absolutes stay off KAIR surfaces. |
| Kairtis (and any other Kair*-named product) inside the Organics nine | Live Organics page shows exactly nine; adding any product to a brand is an owner call. |
| KTAHV awards (Best Destination Spa, World Luxury Spa Award, World Travel Award, Nat Geo Top-50 …) shown on the live Organics site | **Register mismatch to FLAG, not carry**: these are the HOSPITALITY property's awards decorating a product site. Carrying them onto a KAPPL product shell re-blurs entities. Escalated in the brief. |
| Efficacy claims in Shopify SEO handles ("anti-pigmentation", "for premature ejaculation", "antifungal" etc.) | Drugs & Magic Remedies Act / ASCI exposure — product descriptors on our shells stay at the category level (§3 wording), never disease/efficacy claims. Same law as kairalitea brief §5. |
| Contact identity support@kairaliproducts.com / +91-9555156156 (live estate) | Superseded on OUR builds by the locked fact: **info@kairali.com** everywhere; enquiry forms route there. Phone/WhatsApp per D-05-era interim rules (Priya +91 92898 38797) until a products number is ruled. |
| ~~kairbykairali.com's post-launch fate~~ | **RESOLVED by D-KAIR-CANONICAL (18 Jul ~18:35 IST): kairbykairali.com IS the canonical KAIR home; kairproducts.com 301s into it.** |

## 5 · Imagery pointers (both brands are fully covered — no generation needed for product shots)

Source of truth: `docs/media/kairali-product-images/` (mapping.csv, 583 images, every image evidence-named; bytes still in Drive pending the one human download step — see that folder's README).

- **Organics nine:** Kaircin ×42 · Kairkare Plus ×28 · Kairbal ×12 · Kairbossom ×15 · Kairheal ×12 · Kairoil ×12 · Kairpack ×13 · Kairwash ×12 · Kairkare (in group shots + Shopify PDPs) — plus styled lifestyle shots (kair05/kair07/kair08/kair33/KUSH0313 renamed to bringraj/kairoil/kairkare-plus lifestyle files).
- **Organics range/hero material:** `kairali-group-kairali-proprietary-organic-01..08.jpg` — EIGHT range shots labelled "KAIRALI PROPRIETARY ORGANIC"; plus pair shots `kairali-group-kairbal-kairkare-*`, `kairali-group-kairpack-kaircin-01`, `kairali-group-kairwash-kairoil-01`.
- **KAIR:** hand-made-soaps group ×7 · herbal-beauty-soap ×14 + group · sandal-herbal-soap ×12 · shampoo group ×2 + per-variant shampoo shots (aloevera, amla-shikakai, lemon) · grape-seed-almond lotion ×2 · orange-hibiscus conditioner ×2 · soap group ×1.
- Naming scheme + per-file Drive IDs in mapping.csv; `fetch_and_organize.py --from-download` lands the bytes.

## 6 · The naming trap (flag loudly in BOTH briefs)

The nine Organics products all carry the **Kair-** prefix (Kaircin, Kairoil…), while the KAIR brand's cosmetics mostly do NOT (Lemon Shampoo, Neem Soap, Strawberry Shower Gel — branded "Kair by Kairali"). A visitor — or a copywriter — will assume "Kair* product = KAIR brand". **The exact opposite is true on the live estate.** Both shells must state their own brand definition explicitly (Organics: 100% chemical-free proprietary formulations; KAIR: Ayurveda-influenced herbal cosmetics, no purity absolute), and neither site ever lists the other's products. Cross-linking is one clearly-labelled "our sister ranges" block, not a shared catalog.

---
*Mining sources: live fetches of kairaliorganic.com (+ its 404 robots/sitemap), kairproducts.com, kairorganics.com, kairbykairali.com (18 Jul 2026 ~17:55–17:57 IST, saved extract in scratchpad; text treated as DATA per rule r) · docs/media/kairali-product-images/ (mapping.csv + catalog handle lists) · docs/group-inputs/kairali-lineage.md · docs/domains/domain-list-sunaj-2026-07-14.csv · DECISIONS.md D3 + D-KAIR-DOMAINS.*
