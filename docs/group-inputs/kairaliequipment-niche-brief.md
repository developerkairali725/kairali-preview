# kairaliequipment.com — Pre-Build Niche & Architecture Brief

**Compiled 2026-07-15 00:13:01 IST · Register: Group / B2B Ayurvedic-equipment manufacturer-exporter (Register A, group-equipment). NOT a KTAHV clinical surface — "spa / luxury / resort / retreat" are PERMITTED here; the KTAHV clinical lock does NOT cross-apply (see §7). The one shared red line is medical-claim language ("cure") on any clinical adjunct (§7).**
**Model for this document: `docs/kappl-inputs/kairalitea-niche-brief.md`. Verified source data: `docs/group-inputs/kairaliequipment-org-inventory.md` (live-site + Wayback mining, read-only, 2026-07-15). Design authority: `packages/ui/brand-tokens.css` + `docs/design/DESIGN_DOCTRINE.md` (the brand manual wins — CLAUDE.md Doctrine (d)). Every claim is cited to the inventory [INV §n] or an external source [Ln/Cn]; source index at the foot.**

> **Scope note.** This is a research/architecture brief that precedes design decisions (CLAUDE.md, 13 Jul 2026 Abilash directive: research the niche BEFORE design decisions are made). It does NOT approve copy or ship code. It surfaces facts and flags gaps; it invents nothing (rule 6). Two hard ESCALATIONS block parts of the build: (a) the catalog is verified only at CATEGORY level — zero per-SKU model numbers/prices/photos are recoverable (§1); (b) live-site security failures (public HTTP 500 + verbose-error info-disclosure) need Deepu + Abilash before any migration touches the legacy install (§0, §7).

---

## 0 · Blockers to resolve before a single page is designed

1. **CATALOG IS CATEGORY-ONLY, NOT SKU-LEVEL (hard build constraint).** The real product catalog was DB-driven into an `itemlist` gallery that is **empty in every capture** (live renders one fake placeholder record; Wayback archived an empty container) [INV §4]. We can verify **5 equipment categories** with category-level descriptions, and **3 named accessory sub-products**, but **no individual SKU names, model numbers, dimensions-per-model, prices, or product photos** survive in any public source [INV §4, §7]. → The build ships category pages, NOT per-SKU product pages, until Abilash/Deepu supply the real product database (rule 6 forbids inventing SKUs). **Do not print any model number or price.**
2. **LIVE SITE IS DOWN + LEAKING (security escalation).** `GET /` and `/default.aspx` return **HTTP 500** (ASP.NET `CS0103` — markup and code-behind out of sync; homepage non-functional); `Category.aspx` also 500s [INV §2.1–2.3]. `customErrors` is **Off in production**, so the 500 page leaks full Windows server paths (`c:\inetpub\vhosts\kairaligroups.com\…`), .NET versions, the full `csc.exe` compile command, and source snippets — an information-disclosure issue [INV §2.2]. → Flag to Deepu (web dev) + Abilash BEFORE any migration reads the legacy markup. Read-only scope here; no remediation applied.
3. **PHONE NUMBER UNVERIFIED.** Live site prints **+91-9555156156** in the header/contact, but it is **NOT in CLAUDE.md LOCKED FACTS** and no equipment number is on file [INV §6]. → Do not reproduce on any page or in schema until Abilash confirms. (Email `info@kairali.com` DOES match the locked fact ✓ [INV §6].)
4. **CERT / EXPORT / MANUFACTURING CLAIMS ARE UNVERIFIED.** Legacy nav carries `certifications-and-awards.aspx`, `quality-and-safety.aspx`, `research-and-development.aspx`, `facilities-and-row-material.aspx`, `worldwide-alliances.aspx`, and `become-our-distributers-importers.aspx` [INV §3] — i.e. the site *asserts* own-manufacturing, certifications, and export/alliances, but the **actual cert names, accreditation bodies, and export markets were not captured** and cannot be quoted. → These are the site's core trust levers (§5) and every one must be confirmed by Abilash before it is printed (rule 6). Reuse the "since 1908" heritage line ONLY after §0.5 is reconciled.
5. **FOUNDING-YEAR (heritage) — reconcile before the trust-strip is written.** CLAUDE.md context + group wiki say "since 1908" (118-year family business); the kairalicenters mining surfaced a conflicting "formally founded 1989 / 10 decades" on a sister site [kairalicenters-org-inventory / centers-brief §0.3]. The equipment inventory did not independently capture a founding date. → Confirm the canonical heritage year before it anchors the trust-strip (§5).
6. **CROSS-ENTITY CLINICAL PII FORM on a B2B domain.** `consult-a-doctor.aspx` is a **full clinical patient-intake form** (blood pressure, weight, height, present/past health problems, current medications, pregnancy/marital status, family history) living on the equipment domain [INV §5]. → Data-governance flag: a B2B equipment site should not collect medical PII. Decide (Abilash + Dr. Deepu John for any clinical-register concern) whether this belongs here at all, or routes to KTAHV. Do NOT carry it into the rebuild by default.

---

## 1 · The VERIFIED product catalog (the real data we build from)

Source: Wayback capture 2015-09-07, quoted verbatim; the live DB gallery is empty so nothing below the category line is recoverable [INV §4]. **This is the entire verifiable catalog — 5 categories, category-level specs only.**

| # | Category (nav-locked) | Verified description (verbatim from source) | Photo asset | Verifiable at SKU level? |
|---|---|---|---|---|
| 1 | **Pathi** (wooden massage bed / Droni) | "8.5 X 3 feet with 3 inches thickness. These massage beds are made of Medicated wood and have brass decorative works and rose wood finish. Every massage bed we supply includes a stand and steel support for complete stability." | `images_droni-step.jpg` ✓ (68 KB, 400×239) [INV §8] | **NO** — per-model sizes/prices absent |
| 2 | **Shirodhara Stand** | "We offer a wide range of Shirodhara Stands. Precisely designed and developed, these stands are available in various attractive designs and finish following the exact demands and specifications of clients." | DB gallery empty | **NO** |
| 3 | **Steam Box** | "Sitting-style steam box with foot rest. These aesthetically designed Steam Box are available in Teak wood with stainless steel bottom and tank and have automatic controls." | DB gallery empty | **NO** |
| 4 | **Urlis** (Uruli vessels) | "Beautiful and aesthetically designed Urlis in traditional brass and bell metal." | DB gallery empty | **NO** |
| 5 | **Accessories** | "We also have a wide range of other Ayurveda Spa Equipment like Shirodhara pot, Shirodhara equipment set, Droni step and much more." | DB gallery empty (`droni-step.jpg` covers "Droni step") | **NO** |

**Named accessory sub-products (mentioned in copy; no individual pages, no specs):** Shirodhara pot · Shirodhara equipment set · Droni step [INV §4].

**PRODUCT COUNT: 5 verified categories + 3 named accessory items. Verified SKUs = 0.** The catalog is therefore **verifiable at category level only — NOT fully verifiable**. The live-site "SubCategory1 / We are the only organization that offers and delivers / 4,999" record is a **placeholder, not real data — do not migrate** [INV §4]. The nav's hardcoded "Patti With Stand" is a spelling variant of Pathi, not a distinct product [INV §4].

**→ ASK Abilash / Deepu (append to QUESTIONS.md, rule 6 + UNATTENDED RULE):** (a) the real per-SKU catalog (model names, dimensions per model, materials, and whether quote-only or priced) — the single biggest gap; (b) whether additional categories exist beyond the 5 (the legacy nav locked exactly these five); (c) product photography for all SKUs (only 2 usable legacy images exist — §6); (d) confirm "Pathi" vs "Patti" as the public spelling. **Until (a) lands, this site cannot have per-product pages — only category pages.**

---

## 2 · Information architecture — B2B catalog + category pages + quote funnel

### 2.1 The one non-negotiable structural decision
Ship **category pages, not per-SKU product pages, until a verified SKU database exists (§1).** Each of the 5 categories gets one uniquely-written, indexable page at `kairaliequipment.com/equipment/<category-slug>`; when Abilash supplies real SKUs, per-product pages nest under their category (`/equipment/pathi/<model-slug>`) — the IA is built to graduate without restructuring. Subdirectories (never subdomains, never ccTLDs) concentrate link authority on one domain — Google's recommended multi-section pattern [L1]. This is the core SEO structure and it is locked.

### 2.2 Thin-content landmine (the day-one risk)
Five short category descriptions (one to three sentences each — §1) are **not enough unique content to rank or to avoid a thin-content flag.** A B2B catalog page needs genuine depth: materials and construction detail, use-context (which therapy each item serves — Pizhichil/Abhyanga on the Pathi, Shirodhara on the stand/pot, Swedana in the Steam Box), specification tables, manufacturing/QC narrative, and a clear quote CTA. → **Every category page must be written to real depth from verified facts** (materials, dimensions where known, own-manufacturing story) — never padded with invented specs (rule 6). This is why §1's SKU gap matters: depth must come from true manufacturing/material facts, not fabricated model lists.

### 2.3 Slug plan (proposed — verify each resolves before linking, CLAUDE.md FR)
- Catalog hub: `/equipment/` (replaces legacy `spa-equipments.aspx`; 301 old → new).
- Categories: `/equipment/pathi` (droni / massage beds), `/equipment/shirodhara-stand`, `/equipment/steam-box`, `/equipment/urlis`, `/equipment/accessories`.
- Why-Kairali / manufacturing cluster: `/about` (the-ayurvedic-group + past-and-present + core-values consolidated), `/manufacturing` (facilities-and-raw-material + quality-and-safety + R&D + green-commitment), `/certifications` (**pending §0.4 — build only with verified certs**).
- B2B trade lanes: `/trade` hub → `/trade/contract-manufacturing`, `/trade/hotel-resort-spa-supply`, `/trade/spa-consultancy`, `/trade/distributors-importers`, `/trade/spa-equipment-planner` [INV §3].
- Conversion: `/request-a-quote` (rebuilt `enquire-now.aspx` — §4).
- 301-map every legacy `.aspx` to its clean slug; **drop** `asdfghjkl.aspx` (orphan junk page [INV §2.4]) and do NOT carry `consult-a-doctor.aspx` without a §0.6 decision.

### 2.4 Hub-and-spoke internal linking
A central `/equipment/` hub links to all 5 category pages; each category links back to the hub, to the relevant `/trade` lane, and to `/request-a-quote`. Contextual links (a category → the therapy it serves, `/manufacturing` → the categories it makes) carry more weight than nav links [L10]. Every page reachable from at least the hub and the global nav.

### 2.5 Schema
Legacy site has **zero structured data on any page** [INV §1] — a clean-slate opportunity. Day-one JSON-LD: **Organization** (manufacturer; `Organization`/`Manufacturer` with real address once §0.3 phone/address confirmed), **WebSite**, **BreadcrumbList** sitewide; **ItemList** on the `/equipment/` hub; **Product** on category pages ONLY at the granularity we can honestly fill — with no price (quote model) and no invented `sku`/`mpn`, use `Product` with `name`, `category`, `description`, `brand`, `image`, and `offers` as `AggregateOffer`/`priceSpecification`-absent + `businessFunction` quote, or omit `offers` entirely rather than fake a price. **FAQPage** on category + trade pages. Do NOT assert `Product` reviews/ratings that don't exist (rule 6).

---

## 3 · B2B / export SEO & AEO plan

The site's job is **qualified B2B enquiries (quotes), not retail sales** — no cart, no checkout (Factory Rules; and the legacy model is already quote-based with no published prices [INV §5]). The buyer is an Ayurveda hospital/clinic procurement lead, a spa/resort/wellness-hotel developer, or an overseas distributor/importer — a considered, spec-driven, relationship purchase. SEO targets that intent.

- **Keyword clusters (product + buyer intent):** "ayurveda equipment manufacturer," "panchakarma equipment / droni massage table," "shirodhara stand / shirodhara equipment," "ayurveda steam box / steam chamber," "wooden massage bed (droni) supplier," "ayurveda spa equipment exporter India," plus buyer-lane terms "ayurveda spa setup / spa equipment planner," "contract manufacturing ayurveda equipment," "ayurveda equipment for hotels & resorts." Each maps to a category or trade page (§2). The heritage manufacturer angle ("made in India / Kerala since 1908" — pending §0.5) is the differentiator against generic exporters.
- **Export / international structure:** the site targets a global B2B buyer (legacy `worldwide-alliances`, `distributors-importers`, `hotel-resort-and-spa-supply` [INV §3]). Keep everything on **one `.com` domain**; if language variants are ever added, subfolders + correct hreflang, never IP/browser auto-redirect (Google warns against it) [L1, L9]. Legacy is EN-only [INV §5] — ship EN day one; DE/FR are not required for this surface (KTAHV tri-locale lock does NOT apply [INV §5]) but flag if Abilash wants an export-market locale.
- **Technical SEO fixes the legacy site fails:** **robots.txt 404** and **XML sitemap 404** [INV §1] — ship both day one. Migrate off dead **Universal Analytics UA-53596178-1** (dead since GA4 cutover [INV §1]) to the Factory GA4/`data-cta` stack. Add the missing schema (§2.5). Ensure a real per-category `<title>`/H1 (legacy shares a template with **keralaequipments.com** and even leaks "Kerala Equipments Contacts" in a `<title>` [INV §1] — scrub all cross-brand title bleed).
- **AEO layer:** B2B buyers and AI assistants ask procurement questions — add a question-form FAQ block per category and per trade lane ("What is a droni / Pathi made of?", "Do you export ayurveda equipment / to which markets?", "Do you offer contract manufacturing?", "What is the lead time / MOQ?") with a concise answer capsule under each question-form H2 + `FAQPage` schema, feeding both AI extraction and rich results. **Only mark up genuinely answerable questions** — leave lead-time/MOQ out until Abilash provides real figures (rule 6).

---

## 4 · The RFQ / request-a-quote form (store-first + consent + Satyam CRM)

The conversion is a **qualified quote request** routed to the equipment sales team. The legacy `enquire-now.aspx` already exists but is over-long and text-captcha-gated; the rebuild uses the Factory forms package.

- **Forms package (to be built — Task #12).** `packages/forms/src` is currently a stub (`export {};`) [verified]; the production spec is **store-first submissions + boolean consent → Satyam CRM**. Every quote request: persists server-side FIRST, then hands to the CRM; a **visible boolean consent checkbox on every form** (legacy `enquire-now.aspx` already has `chkAgree` — keep it, wire it to `@kairali/legal` [INV §5]); labels always visible above fields; correct mobile keyboards; no forced accounts; guest-only.
- **Minimal RFQ fields (trim the legacy 12-field form to what a B2B quote needs):** Name · Company / organisation · Business email · Phone (with country code) · Country · **Category of interest** (multiselect: Pathi / Shirodhara Stand / Steam Box / Urlis / Accessories — hidden `category` field pre-filled when the form is opened from a category page, mirroring the legacy `pr`/`location` routing pattern used on kairalicenters [centers-brief §7]) · Quantity / project scale (free text) · Message · **consent checkbox**. **Drop** the legacy gender radio, age, full postal address, and cascading Country/State/City dropdowns [INV §5] — irrelevant friction for a B2B quote (collect address later in the sales conversation). Replace the legacy text-captcha with an invisible/low-friction anti-spam that doesn't fail bot-detection rules.
- **Analytics.** `data-cta` on every primary control (Request a Quote, Call, Email, Download spec, each category CTA) — legacy has none [INV §1]; Ship Gate A4 / factory-site.spec asserts ≥44px touch targets + `data-cta`.
- **Consent + legal.** Factory consent banner (decline-non-essential default), privacy link, `@kairali/legal` pages. Reserve layout space to avoid CLS. Floating-stack cap = three (consent + chat + sticky CTA); no fourth overlay (DESIGN_DOCTRINE §1.4). **Replace the legacy sitewide Chatbase bot** [INV §1] with the sanctioned chat slot if chat is kept, so it counts inside the three-overlay cap.
- **PII decision (§0.6):** the clinical `consult-a-doctor.aspx` intake does NOT belong on the B2B forms surface — exclude by default pending Abilash + Dr. Deepu John [INV §5].

---

## 5 · Trust furniture (heritage · own manufacturing · export · certifications)

For B2B equipment procurement, trust IS the conversion lever — a buyer commissioning treatment-room fit-out is buying reliability, manufacturing capability, and longevity. Reuse the **trust-strip pattern** (a single row of hard credentials) and the `@kairali/legal` package.

- **Heritage trust-strip (top of home + repeated).** Lead with **"since 1908" family-business heritage** (pending §0.5 reconciliation) + **own manufacturing** + **export / worldwide alliances** — all three are the legacy site's own asserted positioning [INV §3] and are stronger than a generic exporter's. **Do NOT print a specific "N years / N countries / N clients" figure until each is verified (rule 6, §0.4/§0.5)** — use the verified qualitative claims (heritage + own-manufacturing + export capability) until Abilash supplies numbers.
- **Own manufacturing / facilities.** The legacy `facilities-and-row-material`, `quality-and-safety`, `research-and-development`, `green-commitment` pages [INV §3] establish in-house manufacturing + QC + R&D — the category's key differentiator vs. traders/resellers. → Rebuild `/manufacturing` from the REAL facility facts once confirmed; the 1 usable facility/context image (`images_about-equipment.jpg`, 40 KB [INV §8]) is thin — flag a photography gap (§6).
- **Certifications & awards.** Legacy `certifications-and-awards.aspx` exists [INV §3] but **no cert names/bodies were captured** — render certs as visible **badges** (the premium-trust convention) ONLY after Abilash confirms which are real (§0.4). Do not invent ISO/GMP/CE/export-council marks.
- **Export capability / worldwide alliances.** `worldwide-alliances.aspx` + `become-our-distributers-importers.aspx` + `hotel-resort-and-spa-supply.aspx` [INV §3] position Kairali as an exporter with a distributor network — a strong B2B signal. → Surface as a trust element and a `/trade` lane, but name specific markets/partners only when verified (§0.4).
- **Legal / consent trust.** Ship `@kairali/legal` (real package — `PrivacyPolicy`, `TermsOfService`, `CookiePolicy`; locked email `info@kairali.com`, controller "Kairali Ayurvedic Group" [verified in `packages/legal/src/index.tsx`]). Legacy has Terms + Privacy pages [INV §5]; the rebuild wires consent into every form (§4) and replaces the legacy text-captcha + dead-analytics stack.

---

## 6 · Design direction (brand tokens + real product photography)

Authority: `packages/ui/brand-tokens.css` + `DESIGN_DOCTRINE.md` (the brand manual wins — Doctrine (d)). Register = group/B2B-equipment: credible, industrial-warm, manufacturer-confident. Spa/luxury/resort framing is permitted (this is NOT a KTAHV clinical surface [INV §5]) — but the tone is *capability and craftsmanship*, not consumer-wellness.

- **D1 — Real product & manufacturing photography, never stock — but the library is CRITICALLY THIN.** The mine recovered only **2 usable legacy images** (`images_droni-step.jpg` 68 KB, `images_about-equipment.jpg` 40 KB) to `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-kairaliequipment/` (`manifest.tsv`) — the DB product gallery was never publicly archived [INV §8]. The shared `docs/media/IMAGE_CATALOG.csv` (1,468 rows) is almost entirely **KTAHV clinical people-photos** (patients/therapists) which are **register-locked to KTAHV and must NOT be cross-applied** here. A handful of KTAHV *object/prop* still-lifes (brass urulis, wooden droni/therapy tables, steam chambers) exist but are shot as clinical-treatment context with people — reuse only genuine equipment-object crops, and only after a register review. → **Real product photography is the #1 design lever (DESIGN_DOCTRINE §2.1) and it is the biggest asset gap.** Flag a product-photography commission (all 5 categories + facility/manufacturing) to Abilash as a build dependency.
- **D2 — Ivory ground + forest interactive + single marigold accent (60/30/10).** `--ivory` (#F7F4EA) ground; `--forest-500` (#006038) actions/links/headers; `--marigold-400` (#EEB41E) the single accent per view — **never body text** (A4 lint fails marigold body text); `--bronze-400` for taglines/overlines suits the heritage-manufacturer voice [verified `brand-tokens.css`].
- **D3 — Three-font hierarchy.** `Kurale` display (h1–h3, ALWAYS weight 400, never bold) for the heritage voice · `Asap` body/UI · `Lato` captions/overlines/numerals — including spec-table numerals [verified `brand-tokens.css`].
- **D4 — The category catalog + spec table is the signature UI.** A B2B buyer scans capability: ivory category cards on the `/equipment/` hub, each with a real product photo (pending D1), a one-line material summary, and a "Request a Quote" affordance; category pages carry a clean spec table (materials, dimensions where verified, use-context) — the conversion is the quote click, so quote CTAs are always in reach.
- **D5 — Craftsmanship via photography + pacing, not motion gimmicks.** No auto-rotating carousels, no scrolljacking (DESIGN_DOCTRINE §1.1); motion is purposeful feedback only; "nothing bounces." Hero `fetchpriority="high"`, LCP <2.5s, CLS ~0, Lighthouse ≥90 (Ship Gate A5) — a hard upgrade over the legacy HTTP-500 homepage [INV §2.1].

---

## 7 · Design decisions + open questions for Abilash

**Five design decisions this brief locks in:**

1. **Category pages, not per-SKU product pages, until a verified SKU database exists** — the catalog is verifiable only at 5-category granularity (0 SKUs, 0 prices, 0 model photos recoverable), and rule 6 forbids inventing products (§1, §2.1). The IA is built to graduate to per-product pages the moment Abilash supplies real SKUs, with no restructuring.
2. **Every category page ships genuine manufacturing/material depth or it does not ship** — five one-line legacy descriptions are thin-content; depth comes from true own-manufacturing, material, and use-context facts, never invented specs (§2.2, rule 6).
3. **Trust furniture leads with verified heritage + own-manufacturing + export capability — NOT any number** — the "since 1908" year (§0.5), cert names (§0.4), and any "N countries/clients" figure are all unconfirmed, so the trust-strip uses verified qualitative claims until Abilash supplies the specifics (§5, rule 6).
4. **The RFQ form is minimal and B2B-scoped** — Name/Company/Business-email/Phone/Country/Category/Quantity/Message + consent, store-first → Satyam, with hidden category routing; the legacy gender/age/postal-address/cascading-dropdown fields and the clinical `consult-a-doctor` intake are dropped (§4, §0.6).
5. **Design = ivory ground + forest interactive + single marigold accent, Kurale/Asap/Lato, real product photography, category-catalog + spec-table as signature UI; group/B2B register with spa/luxury permitted but NO medical-cure language** — no stock, no carousels, no new palette; and a **product-photography commission is a flagged build dependency** because the library holds only 2 usable equipment images (§6).

**KTAHV clinical-lock note (do not cross-apply):** this is a group/B2B-equipment site, so "spa," "luxury," "resort," "retreat" are **permitted** (the register that bans them applies to KTAHV pages ONLY) [INV §5]. BUT: (a) any clinical-adjunct copy (e.g. anything migrated from `consult-a-doctor.aspx`) must avoid medical-claim verbs — "cure" is a group-wide red line and clinical concerns route to Dr. Deepu John; (b) do not cross-apply KTAHV clinical people-photography to this surface (§6).

**Open questions → QUESTIONS.md (blockers first):**
1. **[BLOCKER] The real per-SKU catalog** — model names, dimensions per model, materials, quote-only vs priced, and any categories beyond the locked 5. Without it the site has category pages only (§1).
2. **[BLOCKER] Live-site security** — homepage + `Category.aspx` HTTP 500 and `customErrors=Off` info-disclosure: confirm Deepu remediates before any migration reads the legacy install (§0.2). Also remove the orphan `asdfghjkl.aspx` [INV §2.4].
3. **Certifications / awards** — which certs and accreditation/export-council marks are real and current? (Render as badges only when confirmed — §0.4.)
4. **Export markets / worldwide alliances** — which specific countries/distributors/partners can be named? (§0.4)
5. **Phone number** — is **+91-9555156156** the authoritative public equipment number? It is not in LOCKED FACTS (§0.3).
6. **Founding year** — canonical heritage date for the trust-strip: 1908 vs the sister-site "1989 / 10 decades" conflict (§0.5).
7. **Clinical PII form** — does `consult-a-doctor.aspx` belong on the equipment domain at all, or route to KTAHV? Data-governance + Dr. Deepu John (§0.6).
8. **Product & manufacturing photography** — commission for all 5 categories + facility (only 2 usable legacy images exist — §6, §0-D1).
9. **Cross-brand template bleed** — confirm the rebuild fully separates from `keralaequipments.com` (shared codebase; "Kerala Equipments" title leak) [INV §1].

---

## Source index

**Verified internal source (primary — the real build data):**
- INV — `docs/group-inputs/kairaliequipment-org-inventory.md` (live-site + Wayback org mining, 2026-07-15, read-only). Platform/infra §1; security findings §2; URL inventory §3; product catalog §4; forms/CTAs/consent §5; locked-fact reconciliation §6; unverifiable flags §7; images §8.
- Group facts — `wiki/entities/group.md` (heritage/1908); brand tokens — `packages/ui/brand-tokens.css` (verified: forest-500 #006038, marigold-400 #EEB41E, ivory #F7F4EA, bronze-400, Kurale/Asap/Lato); legal — `packages/legal/src/index.tsx` (verified: `PrivacyPolicy`/`TermsOfService`/`CookiePolicy`, `info@kairali.com`, controller "Kairali Ayurvedic Group"); forms stub — `packages/forms/src` (verified `export {};`); design law — `docs/design/DESIGN_DOCTRINE.md`; image library — `image-library/legacy-kairaliequipment/manifest.tsv` (verified 2 files).
- Cross-references — `docs/group-inputs/kairalicenters-niche-brief.md` (trust-strip pattern, store-first/Satyam forms spec §7, 1908-vs-1989 founding conflict §0.3, register-A scoping).

**Multi-section / B2B SEO doctrine (L-series):**
- L1 / L9 — Managing multi-regional & multilingual sites (subfolders over subdomains/ccTLDs; no IP auto-redirect) — Google Search Central: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- L10 — Hub-and-spoke internal linking (contextual > nav links) — Search Engine Journal: https://www.searchenginejournal.com/hub-spoke-internal-links/442005/

**Model & register authority:** `docs/kappl-inputs/kairalitea-niche-brief.md` (structure/model); CLAUDE.md Factory Rules (Register A = group; KTAHV clinical lock scoped to KTAHV ONLY, not cross-applied); 13 Jul 2026 Abilash directive (research the niche BEFORE design decisions).
