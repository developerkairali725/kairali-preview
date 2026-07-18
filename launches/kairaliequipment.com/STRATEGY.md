# kairaliequipment.com — STRATEGY (front gate 2 of 4 — the FAT gate)

- Written: 2026-07-18 17:59:30 IST · covers, in ONE approval: sitemap · keywords per page · competitor-keyword-to-page map · integrations plan (CLAUDE.md "Stop at each gate").
- Evidence base: `docs/group-inputs/kairaliequipment-org-inventory.md` (INV) · `kairaliequipment-niche-brief.md` (NB) · `kairaliequipment-competitor-research.md` (CR) · `kairaliequipment-protection-map.md` (PM).
- Rulings: D-EQ-CATALOG (placeholder catalog, preview-only) · D-EQ-CLAIMS (claims as-is) · quote-first / no prices (CR §3.1, INV §5).

---

## 1 · Sitemap (full catalog structure, placeholder-populated)

```
/                               Home (GOLDEN PAGE)
/equipment/                     Catalog hub — 5 category cards + trust strip + RFQ CTA
/equipment/pathi                Category: Pathi / Droni wooden massage beds
/equipment/shirodhara-stand     Category: Shirodhara stands (+ pot, kindi context)
/equipment/steam-box            Category: Steam boxes / swedana chambers
/equipment/urlis                Category: Urlis (brass + bell metal vessels)
/equipment/accessories          Category: Accessories (Shirodhara pot · equipment set · Droni step + placeholder rows)
/equipment/<category>/<sku>     Product detail TEMPLATE — 2 placeholder products per category
                                (10 pages: sku-placeholder-001 / -002 under each category)
/about                          Group story · four-generations heritage · past & present (PM §2b merge)
/manufacturing                  Own factory · materials · QC · R&D · green commitment (claims as-is, D-EQ-CLAIMS)
/certifications                 Certifications & awards (as-is claims; badge artwork = labelled placeholders until scans land)
/trade                          B2B lanes hub + export / worldwide-alliances section
/trade/contract-manufacturing   Lane: OEM / contract manufacturing
/trade/hotel-resort-spa-supply  Lane: hotels · resorts · spa developers
/trade/spa-consultancy          Lane: end-to-end spa setup + planner (PM §2c merge)
/trade/distributors-importers   Lane: become a distributor / importer
/request-a-quote                RFQ form (THE money page)
/contact                        Contact + map + info@kairali.com
/faq                            Procurement FAQ (AEO surface; absorbs legacy customer-query-faq)
/privacy · /terms · /cookie-policy   @kairali/legal
robots.txt · sitemap.xml · llms.txt  (legacy had NONE of these — day-one wins, INV §1)
```

- **Placeholder product template (the D-EQ-CATALOG deliverable):** each of the 10 PDPs renders name "Placeholder Product — <Category>", SKU "SKU-PLACEHOLDER-0NN", price "₹X,XXX / $X,XXX", a spec table with real category-level rows (material, verified dimensions where mined) and placeholder rows visibly marked "— awaiting catalog —", one clearly-badged placeholder image, quote CTA. The team sees exactly what goes where; nothing reads as real data (HARD GATE 6, owner-directed).
- **Graduation path:** real catalog swaps in per-SKU under the same routes (`/equipment/pathi/<real-model-slug>`) — no IA restructuring (NB §2.1).
- 19 content routes + 10 template PDPs = 29 pages; every one reachable from the hub + global nav (hub-and-spoke, NB §2.4).

## 2 · Keywords per page (primary → secondary)

| Page | Primary keyword | Secondary keywords |
|---|---|---|
| `/` | ayurveda equipment manufacturer | ayurvedic spa equipment, Kairali equipment, panchakarma equipment India |
| `/equipment/` | ayurvedic spa equipment | panchakarma equipment supplier, ayurveda hospital equipment, spa equipment India |
| `/equipment/pathi` | wooden massage table ayurveda (droni) | dharapathi, pathi massage bed, panchakarma table manufacturer, abhyanga table |
| `/equipment/shirodhara-stand` | shirodhara stand | shirodhara equipment, brass shirodhara pot, shirodhara table + stand set |
| `/equipment/steam-box` | ayurvedic steam bath chamber | steam box ayurveda, swedana yantra, sitting steam bath wooden |
| `/equipment/urlis` | brass urli (uruli) vessels | bell metal urli, ayurvedic bronze vessels, treatment vessels |
| `/equipment/accessories` | ayurveda treatment accessories | shirodhara pot, droni step, panchakarma set |
| `/about` | Kairali ayurvedic group heritage | four generations ayurveda, Kairali founded 1989, family Ayurveda lineage since 1908* |
| `/manufacturing` | ayurveda equipment factory India | medicated wood equipment, teak steam box manufacturer, equipment quality control |
| `/certifications` | certified ayurvedic equipment manufacturer | ayurveda equipment certifications, awards |
| `/trade` | ayurveda equipment exporter | worldwide ayurveda equipment supply, export spa equipment India |
| `/trade/contract-manufacturing` | contract manufacturing ayurveda equipment | OEM spa equipment India, private label ayurveda equipment |
| `/trade/hotel-resort-spa-supply` | spa equipment for hotels and resorts | resort spa setup India, wellness hotel equipment supplier |
| `/trade/spa-consultancy` | ayurveda spa setup consultant | spa equipment planner, panchakarma centre setup requirements |
| `/trade/distributors-importers` | ayurveda equipment distributor | import ayurvedic equipment, spa equipment importer partnership |
| `/request-a-quote` | ayurveda equipment quote | panchakarma equipment price enquiry, bulk order ayurvedic equipment |
| `/faq` | (AEO long-tails) | what is a droni made of, ayurveda steam bath vs sauna, panchakarma centre equipment list, MOQ/lead time† |
| PDP template | (noindex until real SKUs — see §6) | — |

\* Heritage copy on NEW pages is written strictly from the canonical lineage document (`docs/group-inputs/kairali-lineage.md` §0/§0b — all seven flags ruled 17 Jul): **"founded 1989"** is canonical for the group (FLAG-3 / D-LIN-1989-WORDING); **1908 = family lineage only** ("a family practising Ayurveda since 1908"), never "est. 1908" or "company since 1908". This scopes D-EQ-CLAIMS: qualitative claims (own manufacturing, certs, export) carry as-is; heritage PHRASING follows the lineage ruling.
† MOQ/lead-time FAQ entries ship as questions WITHOUT invented figures — answer copy says "shared at quote stage" until real figures land (rule 6).

**Vernacular rule (CR §2.2):** every category H1 pairs the vernacular term with the English gloss ("Pathi — the wooden Panchakarma massage bed (Droni/Dharapathi)"); spelling variants (droni/dhroni, pathi/patti, urli/uruli) covered in body copy, not doorway pages.

## 3 · Competitor-keyword-to-page map

| Keyword battlefield | Who owns it today (CR §1) | Our page that takes it | How we win |
|---|---|---|---|
| panchakarma equipment manufacturer/supplier | Ayurveda Panchakarma Equipments (Aluva) + IndiaMART | `/equipment/` + `/` | Schema-complete hub, real manufacturer story vs brochure site |
| droni / dharapathi / wooden massage table | dhroni.com, dhroniayurvedas.com | `/equipment/pathi` | Deeper spec table + verified 8.5×3 ft heritage spec + photography |
| shirodhara stand / machine / pot | Esteem Services, marketplace listings | `/equipment/shirodhara-stand` | Vernacular+gloss content, FAQ schema, quote CTA |
| ayurvedic steam bath / swedana | Keral Dhara (Nilambur-teak story) | `/equipment/steam-box` | Match the material story (teak, steel tank — mined verbatim), beat the presentation |
| ayurveda equipment exporter / export markets | Dhroni Ayurvedas (Govt-of-Kerala approval claim) | `/trade` + `/trade/distributors-importers` | As-is export/alliance claims + Gharieni-style proof layout |
| spa equipment for hotels/resorts | Gharieni (global), nobody in India | `/trade/hotel-resort-spa-supply` | The open lane — premium presentation + we-run-our-own-resort proof |
| ayurveda spa setup / consultancy / planner | fragmented, no clear owner | `/trade/spa-consultancy` | Consolidated consultancy+planner page, the four-generations angle |
| panchakarma equipment price / price list | IndiaMART / TradeIndia / Atmiya | **conceded** — marketplace commodity lane | We take quote-intent, not price-shoppers (CR §1b, §3.1) |
| ayurvedic therapy equipment + city | IndiaMART city pages | conceded (GMB/profile lane later, not this site) | — |

## 4 · Integrations plan (which events fire, which forms, chat)

**RFQ form (`/request-a-quote`, also embedded compact on category pages):**
- Fields (NB §4 + CR §3.2): Name · Company/organisation · Business email · Phone with country code · Country · **Category of interest** (multi-select of the 5; hidden pre-fill when opened from a category page) · **Project type** (hospital/clinic · resort/hotel spa · wellness centre · distributor/importer · other) · Quantity/project scale (free text) · Message · **visible consent checkbox** (@kairali/legal wiring).
- Handling: store-first per the forms-package spec (packages/forms — Task #12; the build implements against that spec), then notification to **info@kairali.com** (LOCKED FACT) and Satyam CRM handoff when wired. Labels above fields, correct mobile keyboards, no captcha wall (invisible anti-spam), guest-only.
- Soft CTA: **"Download catalogue (PDF)"** — placeholder catalogue clearly watermarked PLACEHOLDER until the real one lands (CR §3.4).

**data-cta events (Ship Gate A4 — every primary control, ≥44px):**
`quote-request-submit` · `quote-open` (per-category, carries category id) · `whatsapp-click` · `call-click` (only when a verified number exists) · `email-click` · `catalogue-download` · `chat-open` · `trade-lane-click` · `consent-accept/decline`. GA4 via the factory analytics package — the legacy site's dead UA-53596178-1 is retired (INV §1).

**Chat bubble (mandatory — D-20260718-05):** the fleet **`@kairali/chat`** package (ChatbaseLoader hoisted in PR #127; interaction-gated + 6s idle, defer; interim Priya bot `rpNt_uRW6W8EDiTf6AvYJ` per DECISIONS 13 Jul), same slot as the fleet (end of `<body>`, before `<ConsentBanner/>`, denied-defaults first in `<head>`) — satisfies the `chat-bubble-present` gate-registry row. Future ~3-bot consolidation per the Q7 plan: this surface joins the PRODUCT-side bot when trained. Replaces the legacy unsanctioned Chatbase embed. Counts inside the **three-overlay cap**: consent banner + chat bubble + sticky WhatsApp CTA — no fourth overlay, chat yields while the consent banner is open (DESIGN_DOCTRINE §1.4).

**WhatsApp CTA:** sticky, chat-first (DECISIONS 13 Jul: email alone is not enough). Number = fleet interim **+91 92898 38797** until an equipment number is verified — the live site's +91-9555156156 is NOT in LOCKED FACTS and is never printed (Q-EQ-CLAIMS/NB §0.3). **LOUD SWAP FLAG: pre-filled WhatsApp message text identifies the equipment site so Priya's line can triage until the swap.**

**Schema (all day-one, legacy has zero — INV §1):** Organization/Manufacturer + WebSite + BreadcrumbList sitewide · ItemList on `/equipment/` · Product on category pages at honest granularity (no price, no invented sku/mpn — offers omitted) · FAQPage on categories, trade lanes, `/faq`. PDP placeholders carry NO Product schema (nothing fake enters the graph).

## 5 · Not in scope (decided)

No cart/checkout/payment (Factory Rules) · no clinical intake form (PM §2d) · no DE/FR locales (EN-only, flagged) · no per-city doorway pages · no published prices ever on this surface (quote-first; marketplace lane conceded) · no phone number printed until verified.

## 6 · The placeholder law, mechanized (D-EQ-CATALOG)

1. Placeholder formats are EXACT: prices `₹X,XXX / $X,XXX` · SKUs `SKU-PLACEHOLDER-0NN` · images badged "PLACEHOLDER" visibly in-frame · placeholder copy rows read "— awaiting catalog —".
2. **PDP placeholder pages ship `noindex`** and are excluded from sitemap.xml until real SKUs replace them (category pages ARE indexable — their content is real and mined).
3. **Proposed placeholder-lint** (built with the site, run in CI + launch checklist): greps `sites/kairaliequipment.com` for `SKU-PLACEHOLDER|₹X,XXX|\$X,XXX|awaiting catalog|PLACEHOLDER` — while any hit exists the site is **preview-only; DNS flip is BLOCKED**. Wired as a LOUD line in `launches/kairaliequipment.com/sitewide-checklist.md` + proposed as a gates/registry.yaml row (added, never weakening an existing gate — rule g).
4. Real-catalog swap-in is its own PR: replaces placeholders route-for-route, deletes the lint findings, unlocks the flip.

## 6b · GO-science declarations (appended 2026-07-18 22:33:00 IST — battery pass-1 fix)

> **Dated note:** appended after the strategy gate was signed, per the battery
> pass-1 findings (go-science GS-MCB-6 + GS-VIS-3, beauty B17; evidence:
> `go-science/2026-07-18.md`, `beauty/2026-07-18.md`) and the battery report's
> §1 fix directive ("lift the self-check declarations into each STRATEGY.md").
> Content is LIFTED from the build-time self-check
> (`go-science/2026-07-18-selfcheck.md`), reworded ONLY where the self-check
> used the equivalence framing later superseded by the owner's pass-4 fixed
> ruling §6. These are DECLARATIONS — the signed sitemap, keywords, competitor
> map and integrations plan above stand unchanged.

**Signature MCB / anchor secret desire (GS-MCB-6):**
- **Anchor secret desire of the MoA:** to equip a centre with the *authentic
  article* — traditional-spec Ayurveda equipment from inside a credible
  Ayurveda house — without the spec roulette, provenance doubt and
  supplier-vanishing risk of generic fabricators.
- **Signature MCB (mechanism form; literal "How to X without Y" syntax is the
  ads/LP layer, ambiguity A1):** *how to equip your treatment rooms with the
  authentic, traditional-spec article — without gambling on a generic
  fabricator.* On-page manifestation: H1 "The equipment beneath the
  treatment." + the affiliation lede (built in our own facility by the family
  group behind the NABH-accredited Healing Village) + the specimen sheet.
- **Superseded-wording reconciliation:** the BRIEF §3 positioning tail
  ("we manufacture what we treat on") is superseded by pass4-fixed-rulings §6
  (no equipment-identity equivalence anywhere); the anchor above is the
  ruling-compliant form and BRIEF.md carries a dated reconciliation note.

**MoA declaration (GS-MOA-1 — duplicated from BRIEF §2 so the bound artifact
carries it):** 1. Ayurveda hospital / clinic / college procurement
(spec-driven; needs materials + dimensions + institutional credibility) ·
2. Resort, hotel and spa developers (highest-ticket; buys capability,
aesthetics and a partner who can also consult) · 3. Overseas distributors /
importers (export terms, alliance history, catalogue depth) · 4. Spa-setup
consultancy clients (equip-my-new-centre end-to-end).

**NDFF source (GS-MOA-3):** the owner-supplied research corpus ONLY —
`docs/group-inputs/kairaliequipment-niche-brief.md` ·
`kairaliequipment-competitor-research.md` · `kairaliequipment-org-inventory.md`
· `kairaliequipment-protection-map.md` + BRIEF §2's declared per-avatar needs.
No MoA interview corpus exists yet; NDFF beyond these documents may NOT be
asserted (HARD GATE 6) — any new needs/desires/fears/frustrations claim
requires a new declared source added here first.

**SBJ / awareness stage per page (GS-VIS-3; A4 interim declaration — the
canonical fleet page-type→SBJ map still awaits the owner/Akshar ruling in
QUESTIONS.md Q-GO-SCIENCE-RUBRIC):**
- `/` (homepage): **solution-aware, supplier-evaluation stage** — the buyer
  knows this equipment class exists; the page's job is supplier evaluation →
  hand-raise. Right emotions: institutional credibility, material sobriety,
  quiet confidence, curiosity about provenance.
- `/equipment/*` categories: product-aware comparison (spec emotions: rigour,
  material truth).
- `/trade/*` lanes: solution-aware partnership evaluation (capability,
  reliability).
- `/request-a-quote`: most-aware action stage (safety, no-pressure clarity).
- `/about` · `/manufacturing` · `/certifications`: trust accumulation
  (supporting stages, warmth + credibility).
- `/faq`: problem/solution-aware research (clarity, honesty).

**Twelve-Questions readiness (beauty B17):**
1. *Primary visitor:* procurement decision-maker at an Ayurveda
   hospital/clinic/college; secondary: resort/spa developer, distributor,
   consultancy client (BRIEF §2 order).
2. *Arrival context:* organic search on §2 keywords or group-site referral;
   actively evaluating suppliers.
3. *Required perception:* capability · clarity · commercial confidence — "a
   real manufacturer inside a credible Ayurveda house."
4. *Dominant idea:* "The equipment beneath the treatment." —
   provenance-first manufacturing.
5. *Evidence list:* real mined specs + dimensioned drawing · own-facility
   claim (D-EQ-CLAIMS, as-is) · NABH group affiliation (AH-2024-0250, scoped
   "— group") · 1908/1989 heritage ledger · legacy-catalogue photography with
   honest captions.
6. *Objections pre-answered:* authenticity → provenance + specs · price
   opacity → quote-stage transparency + no-obligation line · supplier
   longevity → four generations, group record · process → "what happens next"
   block · MOQ/lead-time/territories → commercial-terms block (shared at
   quote stage; nothing invented).
7. *Single next step:* Request a Quote (global + per-line).
8. *Always-accessible info:* header quote CTA · sticky mobile bar · footer
   contact · info@kairali.com at every ask.
9. *Uniquely-Kairali element:* the family group behind a NABH-accredited
   Ayurveda hospital; the specimen-sheet/foundry-ledger motif.
10. *Success measures:* `quote-request-submit` (money metric) ·
    `quote-open` (per category) · `whatsapp-click` · `catalogue-download` ·
    `trade-lane-click` (GA4 per §4).

## 7 · Legacy value protection

`docs/group-inputs/kairaliequipment-protection-map.md` — all 40 legacy URLs mapped KEEP/MERGE/301/410; single-hop; the 410 (`asdfghjkl.aspx`) and three cross-domain targets await sign-off. GSC data re-rank pending property access.

## 8 · Risks (named, not hidden)

1. **Photography** — 9 mined thumbnails (≤520px) are interim-grade; the commissioned-shoot dependency stands (NB §6-D1).
2. **kairali.com duplicate catalog copy** — cannibalizes until the kairali.com lane sets its fate (CR §2.5).
3. **Claims carried as-is** are the owner's trust basis (D-EQ-CLAIMS) — if any cert/heritage claim later proves stale, content is edited in one place per claim (trust-strip + its page).
4. **Interim WhatsApp number is a KTAHV clinical line** answering B2B equipment chats — mitigated by pre-filled message context; swap tracked loudly.

---

> reply **APPROVE strategy** or **CHANGES <notes>**
