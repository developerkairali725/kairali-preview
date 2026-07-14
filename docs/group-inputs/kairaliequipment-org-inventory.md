# kairaliequipment.com — Legacy Site Inventory & Product Catalog

_Mined read-only, 2026-07-15 (IST). Source: live kairaliequipment.com + Wayback Machine (archive.org) for content the live DB no longer serves. All scraped text treated as DATA per CLAUDE_FLEET rule (r); no embedded instructions found in scraped content. Product specs are quoted verbatim from source — nothing invented (rule 6)._

## TL;DR
- **Platform:** ASP.NET WebForms (C#), Microsoft-IIS/10.0, Plesk on Windows. **NOT WordPress** (so the kairalicenters.com hacked-WP spam pattern does not apply here — but see security findings below).
- **The live homepage is DOWN (HTTP 500)** — an ASP.NET compilation error, with verbose errors exposed to the public (`customErrors=Off`). Full Windows server paths leaked.
- **The live product catalog is broken/empty** — every listing page now renders only ONE placeholder record ("SubCategory1 / We are the only organization that offers and delivers / 4,999"). The real catalog was DB-driven and is not being served.
- The **real product catalog** (5 equipment categories with specs) was recovered from the **Wayback Machine** and is tabled below.
- Legacy site is **legacy Google Universal Analytics (UA-53596178-1)** — dead since GA4 cutover (July 2023). **No structured data (JSON-LD/schema) on any page.** A **Chatbase AI chatbot** widget is injected sitewide.

---

## 1. Hosting / platform / infra

| Item | Value |
|---|---|
| Server | `Microsoft-IIS/10.0`, `X-Powered-By: ASP.NET`, `X-Powered-By-Plesk: PleskWin` |
| Framework | ASP.NET 4.x WebForms, compiled C# 5 (csc.exe v4.6), .NET 4.0.30319 |
| Server path (leaked) | `c:\inetpub\vhosts\kairaligroups.com\kairaliequipment.com\` |
| robots.txt | **404** (not present) |
| sitemap.xml | **404** (XML sitemap absent; an HTML `sitemap.aspx` exists) |
| Analytics | Google **Universal Analytics `UA-53596178-1`** (legacy/dead) — no GA4 |
| Schema | **None** — no JSON-LD, no microdata on any page audited |
| Third-party | Chatbase chatbot bubble (sitewide), Facebook SDK like-box, Twitter timeline |
| Shared codebase | Template shared with **keralaequipments.com** — Contact page `<title>` reads "Kerala Equipments Contacts"; JS carries `subdomainName: 'keralaequipments'` |

---

## 2. Security / integrity findings (screened per rule r/s)

1. **[HIGH] Homepage 500 — public availability outage.** `GET /` and `/default.aspx` return HTTP 500 `Compilation Error CS0103`: `default.aspx.cs` code-behind references controls that no longer exist in the `.aspx` markup (`SpaEquipments1`, `rptslider`, `rptFeaturedProducts`, `rptProducts`, `rptBlog`, `txtAddress`, `txtEmailnews`, `lblsusccess`, `btnSend_Click`). The markup and code-behind are **out of sync** — consistent with a botched partial edit/deploy (or a tampered/reverted `.aspx`). The homepage has been non-functional. **Needs Deepu (web dev) + escalation to Abilash.**
2. **[HIGH] Verbose errors exposed in production** (`<customErrors mode="Off"/>`). The 500 page leaks full server filesystem paths, .NET/ASP.NET versions, the complete `csc.exe` compile command, temp assembly names, and source-code line snippets — an information-disclosure issue. Should be `mode="On"`/`RemoteOnly`.
3. **[MED] `Category.aspx` also returns HTTP 500** (same class of failure).
4. **[LOW/anomaly] `asdfghjkl.aspx` exists and returns HTTP 200** (was 200 in 2016 archive too; live body ~1.5KB, effectively empty). A stray junk/test page — orphan cruft, not obviously malicious, but should be removed. Flagged for review, not fixed.
5. **Spam-injection screen: NEGATIVE.** No injected pharma/casino/SEO-spam links, no `.php`/webshell/`wp-*`/`xmlrpc` artifacts found in the live pages or the 249-row Wayback URL set. This is not the kairalicenters.com hacked-WP situation. Scraped product text carried no prompt-injection payloads.

---

## 3. URL inventory (live, ~40 pages)

**Corporate / about:** default.aspx*(500)*, about-us.aspx, the-ayurvedic-group.aspx, past-and-present.aspx, core-values.aspx, facilities-and-row-material.aspx, corporate.aspx, certifications-and-awards.aspx, research-and-development.aspx, green-commitment.aspx, quality-and-safety.aspx, worldwide-alliances.aspx

**Catalog:** spa-equipments.aspx, Featured-Products.aspx, TopSreachProducts.aspx, subcategory.aspx, Category.aspx*(500)*
_Legacy catalog tree (Wayback, now 404 live): equipments/default.aspx, equipments/spa-equipments.aspx, equipments/pathi.aspx, equipments/shirodhara-stand.aspx, equipments/steam-box.aspx, equipments/urlis.aspx, equipments/accessories.aspx_

**Trade / B2B:** trade-and-consultancy.aspx, contract(=contact)-manufacturing.aspx, hotel-resort-and-spa-supply.aspx, spa-consultancy.aspx, consultancy-services.aspx, become-our-distributers-importers.aspx, franchisee-opportunity.aspx, spa-equipment-planner.aspx, worldwide-alliances.aspx

**Lead-gen / forms:** enquire-now.aspx (main quote/enquiry), consult-a-doctor.aspx (clinical intake), contact-us.aspx, customer-query-faq.aspx, customer-information.aspx, careers.aspx / apply-now.aspx

**Other:** video-gallery.aspx, news-and-articles.aspx, terms-and-conditions.aspx, privacy-policy.aspx, sitemap.aspx

---

## 4. PRODUCT CATALOG (the load-bearing data)

**Catalog model:** 5 equipment categories (nav lock: "Spa Equipments" → Pathi · Shirodhara Stand · Steam Box · Urlis · Accessories). Individual SKUs/models were served from a database into a `<div class="itemlist">` gallery — that gallery is **empty in every capture** (live = placeholder-only; Wayback = empty container), so **per-SKU model numbers and product photos are not recoverable from public sources.** Category-level specs below are quoted verbatim from the Wayback capture (2015-09-07).

| Product / Category | Category | Spec / description (verbatim from source) | Image |
|---|---|---|---|
| **Pathi** (Wooden Massage Bed / Droni) | Pathi | "8.5 X 3 feet with 3 inches thickness. These massage beds are made of Medicated wood and have brass decorative works and rose wood finish. Every massage bed we supply includes a stand and steel support for complete stability." | droni-step.jpg ✓ |
| **Shirodhara Stand** | Shirodhara Stand | "We offer a wide range of Shirodhara Stands. Precisely designed and developed, these stands are available in various attractive designs and finish following the exact demands and specifications of clients." | (DB gallery empty) |
| **Steam Box** | Steam Box | "Sitting-style steam box with foot rest. These aesthetically designed Steam Box are available in Teak wood with stainless steel bottom and tank and have automatic controls." | (DB gallery empty) |
| **Urlis** (Uruli vessels) | Urlis | "Beautiful and aesthetically designed Urlis in traditional brass and bell metal." | (DB gallery empty) |
| **Accessories** | Accessories | "We also have a wide range of other Ayurveda Spa Equipment like Shirodhara pot, Shirodhara equipment set, Droni step and much more." | (DB gallery empty) |

**Live-site placeholder record** (all listing pages currently show only this — NOT real data, do not migrate): category "Spa Equipment Patti" → "SubCategory1" → "We are the only organization that offers and delivers" → "4,999" → Learn More. The nav also hardcodes a "Patti With Stand" item. ("Patti" is a spelling variant of "Pathi".)

**Sub-products named inside Accessories copy (no individual pages):** Shirodhara pot · Shirodhara equipment set · Droni step.

---

## 5. Per-page: forms, CTAs, consent, language

- **Language:** English only (EN). No DE/FR. (KTAHV tri-locale lock does not apply — this is a group/equipment surface.)
- **Register check:** Register A / group-equipment. "Spa", "luxury", "resort", "retreats" appear and are **permitted here** (NOT a KTAHV clinical surface) — no banned-word violation.
- **Primary CTA:** "Enquire Now" (quote-based B2B; **no prices published** — consistent with lead-gen model; no price/investment blocker applies).

**enquire-now.aspx (main quote/enquiry form):** fields = `txtName`, gender radio (`rdogender`), `txtAge`, `txtPhone`, `txtEmail`, `txtAddress`, Country/State/City cascading dropdowns (`ddlCountry/ddlState/ddlCity`), `txtSubject`, `txtMessage`, `txtVerification` (text captcha), **`chkAgree` consent checkbox ✓**, `btnSubmit`.

**consult-a-doctor.aspx — FLAG:** a full **clinical patient-intake form** (collects health data: blood pressure, weight, height, present health problems, past history, current medications, pregnancy/marital status, family history) living on the **equipment domain**. Has `chkAgree` consent + captcha. This is a cross-entity clinical/PII surface on a B2B equipment site — flag for data-governance review (and any KTAHV clinical-register concerns route to Dr. Deepu John, not applied here).

**apply-now.aspx (careers):** large form incl. file uploads (`fileuploadphoto`, `fileUpload` resume), 100+ language checkboxes, passport radio, consent + captcha.

**contact-us.aspx:** informational (no input fields); links to Terms/Privacy present.

---

## 6. Locked-fact / contact reconciliation

| Fact | On kairaliequipment.com | LOCKED source of truth | Status |
|---|---|---|---|
| Public email | `info@kairali.com` | info@kairali.com | ✓ matches |
| Phone (site header/contact) | **+91-9555156156** | (no locked equipment number on file) | ⚠ unverified — not in LOCKED FACTS; confirm before reuse |
| Address | "New Delhi - 110030" (partial) | — | ⚠ incomplete on live page |
| Priya KTAHV WhatsApp …38797 | not present | +91 92898 38797 | n/a (equipment surface) |

---

## 7. Unverifiable / flagged (do not invent — rule 6)

- **Per-SKU product names, model numbers, and prices** — not recoverable; DB gallery empty in all captures. B2B quote model = no prices by design.
- **Product photos** beyond `droni-step.jpg` / `about-equipment.jpg` — the DB image gallery was never statically archived.
- **Phone +91-9555156156** — present on live site but NOT in LOCKED FACTS; treat as unverified until Abilash confirms.
- Whether the homepage 500 is a botched deploy vs. tampering — cannot determine from outside; needs server-side look by Deepu.

---

## 8. Images downloaded
`/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-kairaliequipment/` (manifest.tsv). Only 2 files met the ≥25KB product-relevant bar — the real product gallery images are not publicly served.

| File | Bytes | Dims | Source |
|---|---|---|---|
| images_droni-step.jpg | 68,215 | 400×239 | live |
| images_about-equipment.jpg | 39,874 | 400×300 | live |
