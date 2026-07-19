# Regional, Domain and Location Framework

**Version:** 1.0  
**Issued:** 2026-07-19  
**Scope:** This standard governs country, region, language, currency, legal-entity, fulfilment and physical-location architecture. It defines the market matrix, domain-architecture decision record, localization workflow, hreflang rules, market routing and Google Business Profile/local workflow assumed by the International manual and `REGIONAL_DOMAIN_LOCATION_MATRIX.csv`.  
**Referenced by:** `B2C-NEW-WEBSITE`, `B2C-EXISTING-WEBSITE`, `B2C-NEW-ORGANIC`, `B2C-EXISTING-ORGANIC`, `B2C-NEW-LANDING`, `B2C-EXISTING-LANDING`; `B2B-NEW-WEBSITE`, `B2B-EXISTING-WEBSITE`, `B2B-NEW-ORGANIC`, `B2B-EXISTING-ORGANIC`, `B2B-NEW-LANDING`, `B2B-EXISTING-LANDING`; `D2C-NEW-WEBSITE`, `D2C-EXISTING-WEBSITE`, `D2C-NEW-ORGANIC`, `D2C-EXISTING-ORGANIC`, `D2C-NEW-LANDING`, `D2C-EXISTING-LANDING`; `SHOPIFY-NEW-STORE`, `SHOPIFY-EXISTING-STORE`, `SHOPIFY-NEW-ORGANIC`, `SHOPIFY-EXISTING-ORGANIC`, `SHOPIFY-NEW-LANDING`, `SHOPIFY-EXISTING-LANDING`, and the corresponding manual-embedded workflows.

> **Precedence note:** Where local workflow wording conflicts, the Master OS gate names, evidence hierarchy and human approval authority control.

## 1. Market matrix before architecture

Create one row per:

`country/region × language × currency × legal entity × fulfilment model × location`

Each row must record:

- addressable customers and commercial priority;
- products/services available and excluded;
- price, tax, duty, shipping, returns and payment methods;
- local legal, claims and privacy requirements;
- support hours, phone/WhatsApp/email and response SLA;
- local inventory, booking, practitioner or location capacity;
- domain/subdomain/subfolder and canonical policy;
- language-locale code and hreflang relationship;
- acquisition sources and exact landing destinations;
- Business Profiles, local listings and review platforms;
- translation owner, glossary, style guide and reviewer;
- fallback experience when an offering is unavailable.

Unknowns are recorded as `UNKNOWN` with owner and next evidence. They are not filled by assumption.

## 2. Domain Architecture Decision Record

For every market structure decision, compare:

- country-code domains;
- generic domain with country/language subfolders;
- subdomains;
- separate brands/domains.

The decision record must include:

| Field | Required content |
|---|---|
| Decision ID | Stable ID and version |
| Markets | Countries, languages, currencies and locations covered |
| Candidate architectures | ccTLD, subfolder, subdomain, separate brand/domain |
| SEO equity | Existing links, rankings, URL/history and consolidation risk |
| Governance | Owners, release control, content and support model |
| Technical platform | CMS, Shopify Markets, deployment, feeds, analytics and identity constraints |
| Legal entity | Contracting entity, privacy, claims, tax and local requirements |
| Customer trust | Local expectations, brand recognition and domain clarity |
| Local operations | Inventory, fulfilment, practitioners/locations, service areas and support |
| Paid/measurement | Campaign routing, cross-domain tracking, click-ID and consent implications |
| Merchant/marketplace | Feed, currency, availability, shipping and policy implications |
| Long-term cost | Build, localization, maintenance, security and operational overhead |
| Chosen architecture | Approved future state |
| Rejected architectures | Reason each was rejected |
| Risks and mitigations | Migration, cannibalisation, duplication, routing and compliance |
| Accountable approver | Human business owner and approval date |

No domain change, DNS change or geo architecture may be implemented without human approval and rollback authority.

## 3. Localization workflow

1. Write source content that is factually approved and localization-ready.
2. Create terminology/glossary, prohibited claims, names, units, dates, addresses and tone rules.
3. Translate with context, not strings alone.
4. Localize keyword demand and search intent; do not directly translate keyword lists.
5. Adapt examples, proof, imagery, offers, payment, shipping, support and legal text.
6. Run linguistic, functional, SEO, accessibility and visual QA.
7. Validate URLs, canonicals, hreflang, language selectors and analytics dimensions.
8. Obtain market-owner and legal/clinical approval where applicable.
9. Monitor wrong-market landings, switchbacks, local conversion and support issues.

## 4. URL and canonical rules

- Use stable, crawlable locale-specific URLs.
- Use self-canonical pages unless a deliberate cross-locale canonical is justified and approved.
- Do not canonicalize translated or regional equivalents to one language merely to avoid duplication.
- Every locale URL must resolve to its intended 200 canonical page or have an approved redirect/fallback decision.
- Locale selectors must use crawlable links and persist the user's choice.
- Avoid opaque forced IP redirection. A clear recommendation may be offered, but users and crawlers must be able to reach the selected locale.
- Local XML sitemaps and Search Console properties are created as needed.
- Metadata, structured data, product/feed data, availability and organization/location details must match the visible locale.

## 5. Hreflang standard

For each alternate set:

- use valid language or language-country codes;
- point only to equivalent pages, never unrelated pages;
- require reciprocal return annotations;
- use the same method consistently: HTML or XML sitemap, with deliberate exceptions documented;
- use optional `x-default` only for the genuine default/selector experience;
- each hreflang URL must be crawlable, canonical, indexable when intended and return 200;
- do not point hreflang to redirects, `noindex`, 4xx/5xx or noncanonical URLs;
- include the current page itself in the alternate set;
- validate with a crawler and sample live pages before release;
- monitor `INT-001 Hreflang validity` as valid reciprocal annotations divided by intended locale URLs, with a HARD target of 100% for intended URLs.

## 6. Market-routing controls

Test all of the following by market, language and device:

- direct entry and deep links from ads, email and social;
- language and currency selection;
- displayed price versus charged currency;
- product/service availability;
- inventory, shipping, duties, returns and payment methods;
- forms, phone, WhatsApp, booking and support routing;
- validation, error, confirmation and email messages;
- analytics dimensions and consent state;
- legal pages and regulated claims;
- feed and structured-data consistency;
- user fallback when an offering is unavailable.

Track wrong-market session rate, locale switching, unavailable-offer landings, shipping/payment failures and support contacts by language.

## 7. Real-location and Google Business Profile workflow

For every real physical location or legitimate service area, record and verify:

- Business Profile owner and verification state;
- exact NAP: name, address and phone;
- primary and secondary categories;
- opening and special hours;
- booking/order/service links;
- products/services and availability;
- authentic photos and update cadence;
- reviews, response ownership and response SLA;
- local landing page and canonical URL;
- directions, landmarks, parking/accessibility and service area;
- local staff, credentials and proof;
- applicable organization/location schema;
- calls, directions, bookings and local rank grid;
- citations and authoritative local links.

Do not create fake locations, virtual offices represented as staffed sites, or doorway location pages. Every location page must contain genuinely useful local information and an operational conversion path.

## 8. Local and regional metrics

Monitor:

- local organic, paid and AI share of visibility;
- local-pack grid share;
- GBP calls, directions and bookings;
- local-page conversion;
- wrong-market session rate;
- locale switching;
- hreflang validity;
- translation defects;
- unavailable product/service landings;
- review health;
- shipping/payment failures;
- support contacts by language.

## 9. Release blockers

Do not launch when:

- a target market receives wrong language, currency, price, availability, shipping or contact route;
- hreflang points to redirects, `noindex`, noncanonical or failed URLs;
- the selector is non-crawlable or traps users;
- local legal/claims/privacy approval is absent;
- the Business Profile or local page represents a location inaccurately;
- analytics cannot segment or reconcile critical markets;
- no accountable human market owner is available.

## 10. Change control

An AI may identify a market or architecture issue and draft alternatives, but it may not create a new domain, move a market, alter hreflang, change Business Profile facts or publish localized claims. It must **propose the change to the owner for approval**.

---

# Kairali adoption appendix (OS v2)

**Adopted:** 2026-07-19 14:09:19 IST per D-20260719-11/-12 (owner-delivered GPT standards zip).
**Source integrity:** everything above the horizontal rule is the owner's GPT-authored file, byte-verbatim (SHA-256 `9b8c2e485d7707640f50ee89a77a7ed8aab49dadfba4764157172355d30852e3`, zip manifest verified 7/7; immutable copy at docs/process/os-2026/source/00_SHARED_STANDARDS/02_REGIONAL_DOMAIN_LOCATION_FRAMEWORK.md).
**Supremacy:** Kairali v1 doctrine (CLAUDE.md, the merge plan's §2.6 strict union) is SUPREME over this file wherever they conflict (plan §0). The notes below subordinate specific passages; silence subordinates nothing — v1 always wins by default.
**Screen:** ingest screen per doctrine rule (r) + D-20260719-11 — 21-lens multi-agent screen + adversarial verify + completeness critic + first-party read; findings dispositioned in docs/reports/2026-07-19-standards-ingest-screen.md.

## Subordination notes (v1 supreme)

- **DNS/domain execution:** under v1, DNS and domain changes are HUMAN-EXECUTED, full stop — the agent prepares, Abilash/Ambuj flip. "Human approval and rollback authority" never authorizes agent execution.
- **"Created as needed" is not standing permission:** GSC property creation/verification is an OWNER action (mind the documented two-account trap); sitemaps ship through the normal PR lane.
- **Actor map:** "market-owner and legal/clinical approval" resolves to Abilash (business/market) and Dr. Deepu John (clinical). HARD GATE 7 binds INSIDE this framework: KTAHV clinical content in ANY locale needs Dr. Deepu John's sign-off, and the KTAHV banned-word lock applies to DE/FR equivalents (carried below).
- **Package artifacts:** the International manual is docs/process/os-2026/package/06_SPECIALIST_MANUALS/INTERNATIONAL_LOCALIZATION_DOMAIN_LOCATION_MANUAL_2026.md and the matrix is docs/process/os-2026/package/07_TEMPLATES/REGIONAL_DOMAIN_LOCATION_MATRIX.csv. Full International activation stays DEFERRED (DEF-003) — scoped per-site at the next multilingual rebuild.

## Obligations carried

This standard carries the following merge-continuity.yaml obligations. Each is quoted verbatim — the quote, not this file's paraphrase of it, is the binding text (validated by scripts/standards-acceptance.mjs).

- **CM-018**
  > KTAHV locales: **EN / DE / FR**. Every content change ships in all three or is explicitly flagged as EN-only pending translation.
- **CM-060**
  > Locales: EN always; DE/FR where the site brief says so. A page missing a locale is flagged, never silently EN-only.
- **DEF-003**
  > Create one row per country/region x language x currency x legal entity x fulfilment model x location … correct reciprocal hreflang or sitemap annotations … linguistic, functional, SEO, accessibility and visual QA.
