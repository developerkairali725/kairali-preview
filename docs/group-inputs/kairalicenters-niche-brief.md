# kairalicenters.com — Pre-Build Niche & Architecture Brief

**Compiled 2026-07-14 23:03:16 IST · Register: Group / treatment-centres network (register A) — non-revenue lead-gen. KTAHV clinical lock applies ONLY to KTAHV / hospital references (see §5, §8).**
**Model for this document: `docs/kappl-inputs/kairalitea-niche-brief.md`. Verified source data: `docs/group-inputs/kairalicenters-org-inventory.md` (live-site mining, 2026-07-14). Design authority: `docs/design/DESIGN_DOCTRINE.md` + `packages/ui/brand-tokens.css` (the brand manual wins — CLAUDE.md Doctrine (d)). Every external claim is cited inline; source index at the foot.**

> **Scope note.** This is a research/architecture brief that precedes design decisions (per CLAUDE.md, 13 Jul 2026 Abilash directive: research the niche BEFORE design decisions are made). It does not approve copy or ship code. It maps to Task #15 (Build sites/kairalicenters.com). **One hard ESCALATION blocks the build's centre count: the 18-vs-14 roster discrepancy (§0, §1). Do not fill any "N centres / M countries" figure until Abilash confirms the canonical roster (CLAUDE.md rule 6).**

---

## 0 · Blockers to resolve before a single centre page is designed

1. **CENTRE-COUNT DISCREPANCY (hard escalation).** The register / task brief says **"18 centres, 9 countries"**; the live `/locations/` page enumerates **14 centres across 5 countries** (India ×8, Japan ×3, Mauritius ×1, Czech Republic ×1, Kuwait ×1) [INV §2, §3]. The build is short 4 centres and 4 countries. **Rule 6 forbids inventing the missing four.** → ASK Abilash for the canonical roster; until then the site ships with the 14 verified centres and NO hardcoded "18/9" headline number.
2. **EMAIL-DOMAIN CONFLICT.** Site domain is `kairalicenters.com` (no "r") but every per-centre mailbox is `@kairalicentres.com` (with "r") [INV §4]. Also, the group locked-fact contact is `info@kairali.com` (CLAUDE.md LOCKED FACTS) — which does not appear on the legacy site at all. → Confirm the authoritative public email before it is printed on any centre card or schema.
3. **FOUNDING-YEAR CONFLICT.** about-us says "formally founded in 1989" + "wellness legacy of more than 10 decades"; group wiki + CLAUDE context say "since 1908" (118-year family business) [INV §8.5; wiki/entities/group.md]. → The heritage line is a primary trust lever (§5) and must be reconciled before copy is written.
4. **LEGACY SITE IS COMPROMISED.** Every legacy page carries a hidden zero-width `<marquee>` gambling-link injection before `</body>` — a classic hacked-WordPress SEO-spam farm [INV §9]. Treated as DATA, quarantined, links not visited (CLAUDE.md rule r). → **Carry NO legacy footer/template markup into the rebuild.** Flag the live install to Abilash/Deepu for security remediation (outside this read-only scope).

---

## 1 · The VERIFIED centre list (the real data we build from)

Source: live `/locations/` page, captured verbatim, nothing invented [INV §2]. This is the roster the rebuild ships with **unless/until Abilash supplies the canonical 18**. Each row's "build?" column flags whether it has enough verified NAP to justify an indexable location page — because a centre with missing/unverifiable NAP should ship without a page (or noindexed) rather than with placeholder data, since inconsistent NAP actively suppresses local ranking [L3].

| # | Centre (as printed) | City / Area | Country | NAP complete? | build page? | flag |
|---|---|---|---|---|---|---|
| 1 | Kairali Ayurvedic Centre | New Delhi – Mehrauli | India | addr+phone+email+hours | **YES** | = corporate HQ address |
| 2 | Kairali Ayurvedic Centre | New Delhi – Sirifort | India | full | **YES** | two phones |
| 3 | Kairali Ayurvedic Centre | Gurgaon – Sector 46 | India | full | **YES** | phone printed "8800861733/34" — normalise |
| 4 | Surya Healthcare *(partner-branded)* | Patna – Boring Road | India | full, but gmail + partner brand | **ASK** | franchise vs owned? Non-Kairali brand name + gmail [INV §8.4] |
| 5 | Kairali Ayurvedic Centre — M/s "RETROFIT" | Vadodara – Race Course Rd | India | full | **ASK** | partner-operator suffix — confirm public-facing name |
| 6 | Kairali Ayurvedic Centre | Faridabad – Sector 15 | India | full | **YES** | phone "9650680900 / 0129-4873460" — normalise |
| 7 | Kairali Ayurvedic Centre — Hotel Ratnamouli Palace | Guwahati | India (Assam) | full | **YES** | co-located in a hotel — verify still active |
| 8 | Kairali Ayurvedic Centre — Yoga Tower | Raipur – Geeta Colony | India (Chhattisgarh) | addr+phone, **hours MISSING** | **YES (hours TBC)** | opening hours not stated [INV §8.3] |
| 9 | Kairali Ayurvedic Health Spa | Yokohama | Japan | full (partner domain ayus.co.jp) | **ASK** | independent partner op? [INV §8.4] |
| 10 | Kairali Ayurvedic Health Centre | Seijyo, Tokyo | Japan | full (ayus.co.jp) | **ASK** | partner op |
| 11 | Kairali Ayurvedic Health Centre | Minamiaoyama, Tokyo | Japan | full (ayus.co.jp) | **ASK** | partner op |
| 12 | Kairali Ayurvedic Health Spa | St. Phoenix | Mauritius | full (kairali.mu) | **ASK** | partner op |
| 13 | Kairali Ayurvedic Spa — Resort Svata Katerina | Prague – Vinohrady | Czech Republic | full, **domain printed 2 ways** | **ASK** | `katrinaresort.com` vs `katerinaresort.cz` typo [INV §8.6] |
| 14 | Kairali Ayurvedic Centre | Sabah Alsalem | Kuwait | full (hotmail + kuwait@) | **ASK** | partner op |

**Page grouping on the source:** "INDIA" (8) and "WORLD" (6).

**Verified centre count we can build against today: 14 (8 India-owned/near-owned candidates + 6 international partner-brand centres). 8 have clean, page-ready NAP; 6 need an owned-vs-franchise decision; Raipur needs hours; Patna/Czech carry data flags.**

**Facts flagged unverifiable → append to QUESTIONS.md (CLAUDE.md rule 6, UNATTENDED RULE):** (a) 18-vs-14 roster; (b) `kairalicenters.com` vs `kairalicentres.com` mailbox domain; (c) Raipur hours; (d) which centres are owned vs partner/franchise (affects schema `@type` and whether we claim them as "our centres"); (e) 1908 vs 1989 founding; (f) Czech resort domain spelling. **Do not print any of these until confirmed.**

---

## 2 · Information architecture — network hub + per-centre pages

### 2.1 The one non-negotiable structural decision
Ship **one uniquely-written page per verified physical centre, in a subdirectory** (`kairalicenters.com/centres/<city-slug>`) — never a subdomain, never a per-country ccTLD. Subdirectories concentrate all link authority on one domain and are Google's recommended, low-maintenance pattern for multi-location/multi-region sites; ccTLDs are "expensive," "can only target a single country," and split link equity that "does not transfer between them" [L1, L8]. This is the single biggest SEO decision and it is locked.

### 2.2 Doorway-page landmine (the day-one risk)
Near-duplicate location pages with only the city name swapped are a Google quality-guideline violation. John Mueller characterised mass "keyword + city" pages as doorway pages; a regional firm's templated suburb pages **lost 63% of organic traffic in 30 days** after the March 2024 Core Update and only recovered after consolidating into location pages with genuinely unique content and per-area reviews [L2]. → **Every centre page needs real unique content**: local intro, that centre's actual therapies/therapists/doctors, directions + landmark, local testimonials/reviews, local photos — NOT templated boilerplate with the city find-replaced. This is why the §1 owned-vs-partner flags matter: we can only write unique, truthful content for centres whose real details we have.

### 2.3 Slug plan (proposed — verify each slug resolves before linking, CLAUDE.md FR)
- Hub: `/centres/` (the network directory — replaces legacy `/locations/`; 301 `/locations/` → `/centres/`).
- India: `/centres/new-delhi-mehrauli`, `/centres/new-delhi-sirifort`, `/centres/gurgaon`, `/centres/faridabad`, `/centres/guwahati`, `/centres/raipur`, `/centres/patna` (pending), `/centres/vadodara` (pending).
- International (pending owned/partner decision): `/centres/yokohama`, `/centres/tokyo-seijo`, `/centres/tokyo-minamiaoyama`, `/centres/mauritius`, `/centres/prague`, `/centres/kuwait`.
- Country/region grouping surfaces (optional, contextual-link value, §3): `/centres/india`, `/centres/international` (or per-country hubs if the international set is confirmed owned).
- Preserve the legacy state-region enquiry pages as SEO landing pages, 301'd to clean slugs: Bihar, West Bengal, Gujarat, Uttar Pradesh, Delhi-NCR were WooCommerce "product" CPT pages [INV §1a] — rebuild as MDX regional landing pages that funnel to the nearest centre page (contextual internal link), not as centres.

### 2.4 Hub-and-spoke internal linking
A central `/centres/` hub links to every centre page; every centre page links back to the hub and is reachable from site nav. Authority earned by any one centre or the hub then flows across the whole cluster; add **contextual** links (a therapy page mentioning a city → that centre; a region guide → its centres) because contextual links carry more weight than nav links [L10]. Every centre page must be reachable from at least the hub and the global nav.

### 2.5 Schema per centre
Use **`MedicalClinic`** (a subtype of both `MedicalBusiness` and `LocalBusiness`) on each centre page — it inherits Maps/local-pack eligibility AND healthcare properties, which generic `LocalBusiness` lacks [L4]. **For any centre we cannot confirm is a clinical Ayurveda facility (the international "Health Spa" partner centres), fall back to `LocalBusiness`/`HealthAndBeautyBusiness` — do not assert `MedicalClinic` for a spa.** Required by Google: only `name` + `address`. Strongly add: `telephone`, `geo` (≥5 decimal places), `openingHoursSpecification`, `url` (the specific centre URL), and healthcare fields `medicalSpecialty` + `availableService` [L4]. **Caveat for the wiki:** Google documents LocalBusiness schema under *search appearance only* — it drives rich-result/Maps eligibility, **not ranking**; ranking comes from GBP, reviews, relevance and unique content. Do not over-claim schema as a ranking lever [L5]. Register note: any centre page that references the KTAHV hospital keeps the clinical register in prose regardless of schema type (§5, §8).

---

## 3 · Local-SEO / AEO plan — "<city> ayurveda centre" intent

The site's job is enquiries, not sales — so ranking for "ayurveda centre near me" and "ayurveda in <city>" IS the revenue mechanism. Two intents, two mechanisms:

- **"near me"** is served by **Google Business Profile + proximity**, which lives outside the website. One verified, complete, category-correct GBP per physical centre, with reviews turned on. Google's three named map-pack factors are **relevance, distance, prominence**; proximity is no longer sole — a better-optimised, higher-reputation centre can now outrank a geographically closer competitor [L6]. **GBP creation/verification is a HUMAN action** (needs a real visitable address; no virtual offices; healthcare allows one practitioner profile per provider under their real first+last name) — the site build prepares NAP, humans claim profiles [L6, L7].
- **"in <city>"** is served by the **unique city page + schema** (§2). Each centre page's H1/title carries centre + city; the page answers the local query with real local content.

**Day-one local-SEO must-haves:** (1) indexable, uniquely-written subfolder page per verified centre with centre+city in H1/title; (2) `MedicalClinic`/`LocalBusiness` schema per page with real NAP + geo; (3) a claimed, complete, category-correct GBP per centre with reviews on; (4) **byte-identical NAP** across the centre page, its GBP, and every citation/directory — even small variations "confuse Google's understanding of which location is which and reduce local ranking" [L3, L11]; (5) `/centres/` hub with hub-and-spoke links; (6) mobile-fast render.

**AEO layer:** add a question-form FAQ block per centre and on the hub ("Where is the Kairali Ayurvedic Centre in <city>?", "What therapies does the <city> centre offer?", "What are the opening hours?") with `FAQPage` schema — a concise answer capsule under each question-form H2, feeding both AI extraction and the map-pack. Only mark up genuinely present data (no invented hours/reviews — rule 6).

**Citation operations (flag as a dependency):** manual citation management "becomes unsustainable beyond four locations" — a 14-to-18-centre, multi-country network needs a listings-management tool (BrightLocal/Yext/Semrush) to push and monitor identical NAP to directories and per-country data aggregators [L13]. NAP must originate from verified live-site data, never be invented.

**International (if the 6 overseas centres are confirmed and kept on-domain):** stay on `kairalicenters.com` with country/language subfolders + correct hreflang, reinforced by local address, local phone, local language, and a country-specific GBP per centre [L8]. **Two hard cautions:** (a) ~75% of hreflang implementations contain errors and one bad tag makes Google ignore the entire cluster — validate hreflang at launch [L8]; (b) **do NOT auto-redirect visitors by IP/browser language** — Google explicitly warns against it and it breaks crawling of alternates; use hreflang + a manual country/language switcher instead [L9]. (Legacy site is EN-only with no hreflang despite EU/Japan/Kuwait centres — a gap the rebuild closes only if those centres are confirmed owned and in scope.)

---

## 4 · Day-one page map

| Page | Purpose | Schema | Notes |
|---|---|---|---|
| Home | Group-network overview; trust-strip; centre-finder entry; therapies + doctors; enquiry CTA | Organization, WebSite, WebPage, BreadcrumbList, FAQPage | Rebuild clean — drop legacy injected markup (§0.4) |
| `/centres/` (hub) | Filterable centre directory (by country/state/city), map, one card per verified centre | WebPage, ItemList, BreadcrumbList | Replaces `/locations/`; 301 old → new |
| `/centres/<city>` × verified centres | Unique per-centre page: local intro, NAP, hours, directions/landmark, therapies, named doctors, local reviews, quick-contact (call/WhatsApp/email/Maps), enquiry form | MedicalClinic **or** LocalBusiness (§2.5), FAQPage, BreadcrumbList | Only for centres with verified NAP; partner centres pending decision |
| `/centres/india`, `/centres/international` (or per-country) | Regional grouping hubs; contextual links to centres | WebPage, ItemList | Optional; strong internal-link value |
| Region enquiry landing pages (Bihar, WB, Gujarat, UP, Delhi-NCR) | Rebuilt from legacy Woo "product" pages; funnel to nearest centre | WebPage, FAQPage | 301 from `/product/*`; NOT centres |
| Therapies hub + per-therapy (Abhyangam, Shirodhara, Pizhichil, Panchakarma, Elakizhi, Navarakizhi, Udhwarthanam, Nasyam, Kadikizhi, Shirodhara) | Educational therapy pages; contextual links to centres offering them | WebPage / MedicalProcedure, FAQPage | Reuse legacy therapy pages [INV §1a]; scrub "cure" |
| Condition/programme pages (skin, hypertension, pain, weight, infertility, family-health, veda-diet) | Concern-led SEO; enquiry CTA | WebPage, FAQPage | Claims-gated — no cure/treat verbs (§5) |
| `/about` | Heritage (1908 vs 1989 — reconcile §0.3), NABH, founders | AboutPage, Organization | E-E-A-T anchor: Gita Ramesh byline |
| `/doctors` (+ profiles) | Named physicians w/ BAMS/qualifications, experience, specialty | Physician / Person | Trust lever (§5); 6 real portraits in library |
| `/franchise` | Partner/franchise recruitment (B2B track) | WebPage, FAQPage | Keep hospitality register scoped to centre network, NOT KTAHV (§5, §8) |
| `/online-consultation` | Multi-mode (video/phone/in-clinic) booking entry | WebPage, FAQPage | Category parity lever (§6) |
| `/contact` | Corporate contact + enquiry | WebPage, Organization | Consent checkbox (legacy has it here only) |
| Blog hub + posts | Ayurveda content marketing (66 legacy posts) | Blog, BlogPosting | Migrate selectively; refresh dates |
| Legal (privacy / terms / cookies) | `@kairali/legal` package | — | Consent gap fix (§5, §7) |

---

## 5 · Trust furniture (NABH · heritage · doctor credentials)

Trust signals are the category's dominant credibility device and a hospital-network's edge over spa-style sites. Reuse the **trust-strip pattern** (a single row of hard credentials) and the `@kairali/legal` package.

- **Scale/heritage trust-strip** (top of home + repeated) — the category leads with a hard-number row: Jiva shows "80+ Clinics / 500+ Doctors / 1.5M+ Successful Treatments" to establish scale [C2]; AVP headlines "120 years of Legacy" [C5]. **Kairali's differentiated version = heritage + accreditation**: since-1908 (pending §0.3 reconciliation) + NABH-accredited hospital backing + WHO-GMP pharmacy backing. This is a stronger claim than most competitors' and belongs above the fold, not buried in an about page [C5]. **Do not print a centre/country count in this strip until §0.1 is resolved** — use heritage + accreditation, which are verified, instead.
- **NABH accreditation** — foregrounded by competitors as a patient-safety/insurance trust signal [C3]. Applies to the KTAHV hospital; on centre-network pages, present it as the group's clinical backing (clinical register when referencing KTAHV — §8).
- **Named doctor credentials** — doctor-profile listings (name, BAMS/qualification, years of experience, specialty) are a core NABH-Ayurveda trust signal and an edge over anonymous-"therapist" spa sites [C3]. The image library holds **6 real physician portraits + the founder**: `Mrs-Gita-Ramesh-Founder.png`, `Dr-Arathi.png`, `Dr.-Arundhathi-Suresh.png`, `Dr-Pratibha.png`, `Dr.-Manjusha-Mohan.png`, `Dr-Shari-K.png` [INV §6]. Surface named physicians per centre where verified.
- **Reviews / social proof** — reviews are cited as the #1 map-pack prominence factor [L6]. Legacy `/locations/` already carries 11 video testimonials + Google-review quotes [C10] — migrate genuine ones only (rule 6; no invented counts, DESIGN_DOCTRINE §1.7).
- **Legal / consent trust** — ship `@kairali/legal` (real package: `PrivacyPolicy`, `TermsOfService`, `CookiePolicy`; locked email `info@kairali.com`, controller "Kairali Ayurvedic Group"). Legacy consent checkbox exists ONLY on `/contact-us/` and `/franchise/`; the sitewide enquiry + exit-intent popups have none — a **GDPR/DPDP gap** (matters for the Czech/EU + Japan/Kuwait/Mauritius traffic) that the rebuild closes by wiring consent into every form [INV §5].

---

## 6 · Design direction (brand tokens + real centre photography)

Authority: `packages/ui/brand-tokens.css` + `DESIGN_DOCTRINE.md` (the brand manual wins — Doctrine (d)). Register A (group/network) sits between KTAHV clinical restraint and KAPPL expressive warmth: calm, credible, hospitality-warm for the centre network, **but any KTAHV/hospital reference snaps to clinical register** (§8).

- **D1 — Real centre & therapy photography, never stock.** The mine saved **183 real legacy images (~41MB)** to `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-kairalicenters/` with `manifest.tsv` [INV §6]: therapy photos (Abhyangam, Shirodhara, Pizhichil), hero images, 6 doctor portraits + founder. Real, art-directed photography is DESIGN_DOCTRINE §2.1's #1 lever. Filter for register-appropriate, non-KTAHV-clinical images; do NOT cross-apply KTAHV hospital people-photos. Per-centre unique local photos are also a doorway-page defence (§2.2).
- **D2 — Ivory ground + forest interactive + single marigold accent (60/30/10).** `--ivory` (#F7F4EA) ground; `--forest-500` (#006038) actions/links/headers; `--marigold-400` (#EEB41E) the single accent per view — **never body text** (A4 lint fails marigold body text); `--bronze-400` for taglines/overlines suits the heritage voice.
- **D3 — Three-font hierarchy.** `Kurale` display (h1–h3, ALWAYS weight 400, never bold) for the heritage voice · `Asap` body/UI · `Lato` captions/overlines/numerals.
- **D4 — Centre-finder is the signature UI.** Competitors treat the clinic-locator as table stakes: Jiva runs a filter-by-state/city/locality locator with per-clinic open/closed status, direct phone, and map integration [C1]; Birla runs per-centre pages + "near me" landing pages [C6]. Kairali's finder = ivory cards on the hub, one per verified centre, each with quick-contact affordances (click-to-call, WhatsApp, email, Maps directions) — the legacy page already does this and it should be standardised, since for a lead-gen site **the enquiry click IS the conversion** [C9, C10].
- **D5 — Warmth via photography + pacing, not motion gimmicks.** No auto-rotating carousels, no scrolljacking (DESIGN_DOCTRINE §1.1); motion is purposeful feedback only; "nothing bounces." Perceived performance is the premium signal: hero `fetchpriority="high"`, LCP <2.5s, CLS ~0, Lighthouse ≥90 (Ship Gate A5).

---

## 7 · Enquiry flow (store-first forms + consent + Satyam CRM)

The centre network is **non-revenue lead-gen** — no cart, no checkout (Factory Rules). The conversion is a qualified enquiry routed to the right centre. Category parity to match: competitors offer **multi-mode consultation (video/phone/in-clinic) with a low flat entry fee** (Jiva's ₹299/3-month pass unlocks any clinic; separate video/phone/appointment funnels positioned as "same quality as in-clinic") [C3, C11] — for an international network, remote consultation is an edge worth prioritising over a domestic walk-in-only model.

- **Forms package (to be built — Task #12).** `packages/forms/src` is currently a stub (`export {}`); the production spec is **store-first submissions + boolean consent** (Satyam CRM). Every enquiry: persists server-side first, then hands to the CRM; a **visible boolean consent checkbox on every form** (closing the legacy gap where popups had none — §5); labels always visible above fields; correct mobile keyboards; no forced accounts; guest-only.
- **Centre-scoped routing.** Each centre page's enquiry form carries a hidden `centre`/`location` field so the lead reaches the correct centre team (legacy `/online-consultation/` already uses `pr`/`location` fields [INV §5]) — keep the routing, add consent + `data-cta`.
- **Analytics.** `data-cta` events on every primary control (Enquire, Call, WhatsApp, Book Consultation, Directions) — legacy has none [INV §5]; Ship Gate A4 / factory-site.spec asserts ≥44px touch targets + `data-cta`.
- **Consent + legal.** Factory consent banner (decline-non-essential default), privacy link, `@kairali/legal` pages. Reserve layout space to avoid CLS. Floating-stack cap: consent + chat + sticky CTA already = three; no fourth overlay (DESIGN_DOCTRINE §1.4; Task #11 floating-stack manager).

---

## 8 · Design decisions + open questions for Abilash

**Five design decisions this brief locks in:**

1. **Subdirectory, one-page-per-verified-centre architecture is a build requirement, not an option** — `kairalicenters.com/centres/<city>`, never subdomains or ccTLDs, with a hub-and-spoke link graph (§2). This is the network's core SEO structure and it determines the whole IA.
2. **Every centre page ships genuinely unique local content or it does not ship** — templated city-swapped pages are doorway-page violations that cost a comparable site 63% of traffic (§2.2). This gates the international/partner centres: no unique verified content → no indexable page (noindex or omit) rather than boilerplate (§1, L2, L3).
3. **Schema is `MedicalClinic` for clinical Ayurveda centres, `LocalBusiness`/`HealthAndBeautyBusiness` for the overseas "Health Spa" partner centres** — never assert MedicalClinic for a spa; schema drives appearance/Maps eligibility, not ranking, so it is necessary-but-not-sufficient (§2.5, L4, L5).
4. **Trust furniture leads with verified heritage + NABH/WHO-GMP accreditation + named-doctor credentials — NOT a centre/country count** — because the count is unresolved (§0.1) and rule 6 forbids printing an unverified figure. The trust-strip uses what is verified (§5).
5. **Design = ivory ground + forest interactive + single marigold accent, Kurale/Asap/Lato, real library photography, centre-finder as signature UI; register A with a hard clinical-register snap on any KTAHV/hospital reference** — no stock, no carousels, no new palette (§6, §8-note below).

**KTAHV clinical-lock note (do not cross-apply):** this is a centres/hospitality-register site, so "spa/resort" inside overseas partner *business names* (Japan/Mauritius "Health Spa", Czech "Resort Svata Katerina") is not a violation — preserve proper nouns, frame the entities as "centres." BUT: (a) the group word **"cure"** ("provide a comprehensive cure") on the legacy home is a medical-claim risk — remove from group copy; (b) `/ayurvedic-retreat/` references KTAHV ("The Ayurvedic Healing Village") and contains **"luxury" ×1 — a KTAHV clinical-lock violation candidate** to scrub if it describes KTAHV [INV §7]. Any centre page linking to or describing the KTAHV hospital uses the clinical register (patient/physician/treatment/programme; no spa/luxury/cure/resort/holiday/journey/guests).

**Open questions → QUESTIONS.md (blockers first):**
1. **[BLOCKER] Canonical roster:** 18 centres / 9 countries (register) vs 14 / 5 (live). Which is authoritative, and what are the missing 4 centres' full NAP? (Rule 6 — cannot invent.)
2. **Public email:** `kairalicenters.com` vs `kairalicentres.com` (with "r") for centre mailboxes; and does the group locked-fact `info@kairali.com` supersede both on the rebuild?
3. **Owned vs partner/franchise:** which of the 6 international centres + Patna (Surya Healthcare) + Vadodara (RETROFIT) are Kairali-owned vs independent partners? Determines schema `@type`, whether we claim them as "our centres," and whether they get indexable pages.
4. **Raipur (#8) opening hours** — missing on source.
5. **Founding year:** 1908 vs "founded 1989 / 10 decades" — reconcile for heritage copy.
6. **Czech resort domain** spelling: `katrinaresort.com` vs `katerinaresort.cz`.
7. **Legacy-site compromise:** confirm Deepu remediates the injected gambling-link marquee on the live WP before any migration touches its markup (§0.4).

---

## Source index

**Verified internal source (primary — the real build data):**
- INV — `docs/group-inputs/kairalicenters-org-inventory.md` (live-site org mining, 2026-07-14, read-only). Centre list §2; count reconciliation §3; contacts §4; forms/schema §5; images §6; banned-word scan §7; open questions §8; security §9.
- Group facts — `wiki/entities/group.md`; brand tokens — `packages/ui/brand-tokens.css`; legal — `packages/legal/src/index.tsx`; design law — `docs/design/DESIGN_DOCTRINE.md`.

**Local-SEO / multi-location doctrine (L-series):**
- L1 / L8 / L9 — Managing multi-regional & multilingual sites — Google Search Central: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- L2 — City landing pages can be doorway pages (Mueller; March 2024 Core Update case) — Local Search Forum: https://localsearchforum.com/threads/google-city-landing-pages-can-be-doorway-pages-against-guidelines.55438/
- L3 / L13 — Local SEO guide for multiple locations (NAP consistency; citation tooling) — Yuvgro: https://yuvgro.com/blog/local-seo-guide-for-multiple-locations/
- L4 / L5 — Local Business structured data (MedicalClinic subtype; required/recommended fields; appearance-not-ranking) — Google Search Central: https://developers.google.com/search/docs/appearance/structured-data/local-business
- L6 / L11 — How medical practices rank higher on Google Maps in 2026 (relevance/distance/prominence; reviews #1; per-location pages) — Adode Media: https://www.adodemedia.com/blog/how-medical-practices-can-rank-higher-on-google-maps-in-2026
- L7 — Google Business Profile eligibility / practitioner profiles — Google support: https://support.google.com/business/answer/3038177?hl=en
- L10 — Hub-and-spoke internal linking — Search Engine Journal: https://www.searchenginejournal.com/hub-spoke-internal-links/442005/

**Competitor / category doctrine (C-series):**
- C1 — Jiva Ayurveda clinic locator: https://clinics.jiva.com/
- C2 — Jiva Ayurveda homepage (scale trust-bar): https://www.jiva.com/
- C3 / C11 — Jiva treatment / multi-mode consultation funnels: https://www.jiva.com/treatment · https://www.jiva.com/treatment/appointment
- C3 (NABH/doctor credentials) — Sreedhareeyam accreditations: https://www.sreedhareeyam.com/accreditations
- C5 — AVP Ayurveda (heritage/legacy dating; branch network): https://avpayurveda.com/
- C6 — Birla Ayurveda treatment-centres / "near me" pages: https://birlaayurveda.co.in/treatment-centers-address/
- C7 — Kerala Ayurveda Centre franchise (B2B recruitment pattern): https://keralaayurvedacenter.com/franchise/
- C9 / C10 — kairalicenters.com/locations/ (live — quick-contact affordances, video testimonials): https://kairalicenters.com/locations/

*Model & register authority: `docs/kappl-inputs/kairalitea-niche-brief.md` (structure); CLAUDE.md Factory Rules (register A = group/network, clinical lock scoped to KTAHV only); 13 Jul 2026 Abilash directive (research before design).*
