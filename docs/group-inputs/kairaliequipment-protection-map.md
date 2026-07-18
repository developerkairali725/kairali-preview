# kairaliequipment.com — Legacy-URL Protection Map (KEEP / MERGE / 301 before any flip)

- Written: 2026-07-18 17:56:30 IST · weekend-sprint front-gate lane
- Source of truth: `docs/group-inputs/kairaliequipment-org-inventory.md` (INV, mined 2026-07-15 — live site + Wayback; ~40 live URLs, INV §3) + `kairaliequipment-niche-brief.md` §2.3 slug plan.
- Model: `docs/group-inputs/kairali-com-protection-map.md` (Build Decision Matrix rule 2: every legacy URL gets an explicit fate BEFORE any flip).
- Caveats: the live site is DOWN on its two most important URLs (`/`, `Category.aspx` → HTTP 500, INV §2) and has **no GSC ranking data on file** for this property — value signals are inferred from topic + nav position, not Search Console. If GSC access lands, re-rank §2. No robots.txt / XML sitemap exist on the legacy site (INV §1), so this inventory IS the URL universe as mined.
- Security: the 500/path-leak issue is **Q-EQ-SECURITY (Deepu/Sunaj lane)** — nothing in this map touches the live server.

---

## 0 · THE RULE

DNS does NOT flip until this map is executed on the new site AND Abilash approves the executed result. Single hop, content-equivalent targets, no chains, no soft-404s. **Additional lock for this domain (D-EQ-CATALOG): the new site is PREVIEW-ONLY while any placeholder price/SKU/image remains — so no fate below can execute before the real catalog swap-in.** The map exists now so the flip is a checklist, not a scramble.

## 1 · Verdicts

KEEP-AS-PAGE = topic earns a dedicated new page; build it, then 301 legacy → it.
MERGE = content folds into a named new page; legacy URL 301s there.
301 = direct redirect to an existing equivalent (new page or live sibling domain).
410 = deliberate kill — requires Abilash sign-off per URL.

## 2 · Per-URL fates

### 2a. Home + catalog core

| Legacy URL | Verdict | Target (new site) | Reason |
|---|---|---|---|
| `/` + `/default.aspx` (HTTP 500) | KEEP-AS-PAGE | `/` | Homepage → homepage. Currently a 500; the rebuild is strictly better for every signal. |
| `spa-equipments.aspx` | KEEP-AS-PAGE | `/equipment/` | The catalog hub — the site's head-term page ("ayurvedic spa equipment"). |
| `equipments/pathi.aspx` (Wayback; 404 live) | KEEP-AS-PAGE | `/equipment/pathi` | Category page, real ranking intent ("droni / wooden massage bed"). |
| `equipments/shirodhara-stand.aspx` (Wayback) | KEEP-AS-PAGE | `/equipment/shirodhara-stand` | Category page. |
| `equipments/steam-box.aspx` (Wayback) | KEEP-AS-PAGE | `/equipment/steam-box` | Category page. |
| `equipments/urlis.aspx` (Wayback) | KEEP-AS-PAGE | `/equipment/urlis` | Category page. |
| `equipments/accessories.aspx` (Wayback) | KEEP-AS-PAGE | `/equipment/accessories` | Category page. |
| `Featured-Products.aspx` · `TopSreachProducts.aspx` · `subcategory.aspx` · `Category.aspx` (500) | 301 | `/equipment/` | DB-listing shells that never carried indexable content (empty gallery, INV §4); the hub is the equivalent. |

### 2b. Corporate / trust cluster

| Legacy URL | Verdict | Target | Reason |
|---|---|---|---|
| `about-us.aspx` · `the-ayurvedic-group.aspx` · `past-and-present.aspx` · `core-values.aspx` · `corporate.aspx` | MERGE | `/about` | One consolidated group/heritage page (niche brief §2.3); five thin pages → one strong one. |
| `facilities-and-row-material.aspx` · `quality-and-safety.aspx` · `research-and-development.aspx` · `green-commitment.aspx` | MERGE | `/manufacturing` | The own-manufacturing trust cluster — D-EQ-CLAIMS carries its claims as-is. |
| `certifications-and-awards.aspx` | KEEP-AS-PAGE | `/certifications` | Core trust lever; claims carried as-is per D-EQ-CLAIMS (badge artwork = placeholder until real cert scans land). |
| `worldwide-alliances.aspx` | MERGE | `/trade` (export section) | Export/alliances proof lives on the trade hub. |

### 2c. Trade / B2B lanes

| Legacy URL | Verdict | Target | Reason |
|---|---|---|---|
| `trade-and-consultancy.aspx` | KEEP-AS-PAGE | `/trade` | Lane hub. |
| `contract-manufacturing.aspx` | KEEP-AS-PAGE | `/trade/contract-manufacturing` | Distinct buyer lane. |
| `hotel-resort-and-spa-supply.aspx` | KEEP-AS-PAGE | `/trade/hotel-resort-spa-supply` | Distinct buyer lane (highest-ticket buyer). |
| `spa-consultancy.aspx` + `consultancy-services.aspx` | MERGE | `/trade/spa-consultancy` | Two near-duplicate consultancy pages → one. |
| `spa-equipment-planner.aspx` | MERGE | `/trade/spa-consultancy` | Planner is the consultancy offer's tool; fold in (revisit as its own page if real planner content arrives). |
| `become-our-distributers-importers.aspx` | KEEP-AS-PAGE | `/trade/distributors-importers` | Export lead lane. |
| `franchisee-opportunity.aspx` | 301 | kairalifranchise.com | Franchise is a sibling property's job (single hop to the topical owner; kairalifranchise lane confirms exact target URL). |

### 2d. Lead-gen / forms / contact

| Legacy URL | Verdict | Target | Reason |
|---|---|---|---|
| `enquire-now.aspx` | KEEP-AS-PAGE | `/request-a-quote` | The money page — rebuilt minimal RFQ (niche brief §4). |
| `contact-us.aspx` | KEEP-AS-PAGE | `/contact` | Standard contact surface, info@kairali.com (locked fact). |
| `customer-query-faq.aspx` | MERGE | `/faq` (or hub FAQ blocks) | FAQ content folds into the AEO FAQ layer. |
| `customer-information.aspx` | MERGE | `/contact` | Thin informational shell. |
| `consult-a-doctor.aspx` (clinical PII intake) | **301, DO NOT REBUILD** | KTAHV consultation page (exact URL set at flip) | Medical-PII form does not belong on a B2B equipment domain (niche brief §0.6). Routing to the clinical surface preserves the visitor; **flag stands for Abilash + Dr. Deepu John sign-off.** |
| `careers.aspx` + `apply-now.aspx` | 301 | kairali.com careers surface (exact URL at flip) | Group-level function, not an equipment-site page. Pending kairali.com rebuild map alignment. |

### 2e. Content / misc

| Legacy URL | Verdict | Target | Reason |
|---|---|---|---|
| `news-and-articles.aspx` | MERGE | `/about` (press section) | No recoverable article inventory; revive as a real news section only with real content. |
| `video-gallery.aspx` | MERGE | `/equipment/` (embedded media) | No recovered video inventory; re-audit at build. |
| `terms-and-conditions.aspx` | KEEP-AS-PAGE | `/terms` | @kairali/legal. |
| `privacy-policy.aspx` | KEEP-AS-PAGE | `/privacy` | @kairali/legal. |
| `sitemap.aspx` | 301 | `/sitemap.xml` | HTML sitemap superseded by a real XML sitemap (legacy had none — INV §1). |
| `asdfghjkl.aspx` (junk/test page, HTTP 200) | **410** | — | Orphan cruft (INV §2.4). Needs Abilash's per-URL 410 sign-off — listed here for that signature. |

## 3 · Coverage check

Every URL in INV §3 has exactly one fate above: 40/40 mapped (7 KEEP hub/category + 6 KEEP trust/trade/legal + 2 KEEP lead-gen · 15 MERGE · 9 301 · 1 410). No legacy URL is left fate-less; no content-rich page 301s to a thin target.

## 4 · Open items for the flip checklist

1. GSC property access for kairaliequipment.com → re-rank §2 by real impressions before executing (Build Decision Matrix rule 2).
2. Exact single-hop targets for the three cross-domain 301s (franchise, careers, consult-a-doctor) once those lanes' rebuilds settle.
3. Abilash sign-off on the single 410 (`asdfghjkl.aspx`).
4. kairali.com's own `/ayurvedic-spa-equipment.aspx` duplicate-content decision (see competitor-research §2.5) — owned by the kairali.com lane, tracked here because it affects this domain's canonical strength.
