# whatisayurveda.com — FULL Sitemap & Architecture ("The WebMD of Ayurveda")

**2026-07-15 14:11:13 IST · Supersedes the sitemap sketch in `whatisayurveda-IA-roadmap.md` (which remains the vision/pillar record). Continuity: that roadmap + `docs/strategy/POSITIONING_AND_MOA.md` §5 (whatisayurveda row) + `whatisayurveda-niche-brief.md`.**

**What this document is.** The complete, buildable information architecture for the Ayurveda repository: every hub, its URL grammar, template type, page-count target per phase, and the engineering + physician-review pipeline that gets it to 500+ pages and beyond. Grounded in a fresh structural teardown of WebMD itself (cited `[W1–W7]`), its peers Mayo Clinic / Healthline / Drugs.com (`[P1–P7]`), and a classical-corpus census of the Ayurveda knowledge universe (`[U-C1–U-C6]`). Evidence index at the foot.

**What this document is NOT.** Not copy, not code, not a launch approval. Every page-count figure below is a **planning target**, not a fact about the world; every clinical page still passes the Dr. Deepu John gate (CLAUDE.md rule 7) and the DMR/FSSAI claims doctrine (niche brief §5) before it exists in public.

> **Continuity notes (binding, from POSITIONING_AND_MOA §5):** this property serves top-funnel wellness tourists (UK/DE/GCC/US) and is the editorial→KTAHV-booking bridge. Phase-1 must-haves carried forward: four-tier Evidence Display, the 10 Programme Outcome themes, Sanskrit-IAST-English on Tier-1 claims, Sources blocks + "Medically Reviewed by", Policy B+ (no ads/affiliate, no UGC), German as priority second locale, luxury-grade visual identity, GEO/AI-citation standard. News/perspective content may later split to the WhyAyurveda property (register question Q2, still open) — the /news/ hub below is designed to be liftable.

---

## 1 · WebMD lessons: what transfers, what doesn't

### 1.1 Lessons that TRANSFER (adopt)

| # | WebMD/peer pattern | What we adopt | Evidence |
|---|---|---|---|
| L1 | **Internal linking IS the discovery engine.** WebMD's www domain has NO public XML sitemap at all — zero `Sitemap:` directives in robots.txt; /sitemap.xml 404s. Its entire consumer-SEO discovery runs on A–Z indexes + hub-spoke + crosslink modules. | Internal-linking law (§4) is a first-class build artifact, not an afterthought. Hubs, A–Z ladders and crosslink modules are engineered components, present on every template. | [W1] |
| L2 | **The curated HTML sitemap as a PageRank distributor.** /sitemap is a 252-link curated crawl hub — one link deep from the footer, touching every template family — not an exhaustive index. | Ship `/sitemap` (HTML, curated, footer-linked) as a template family the day cluster count passes ~5 hubs. AND keep our real XML sitemap (`app/sitemap.ts`, already shipped) — WebMD's missing XML is a free win for us, not a pattern to copy. | [W1, W2] |
| L3 | **A–Z index ladders.** Conditions: one index paginated by letter (26 letter pages, ~150–200 links each ≈ 4,000–5,000 entry points). Drugs: a 3-tier browse ladder (index → 27 letter pages → two-letter buckets, ~700 browse pages) that carries link equity to monographs. | /herbs/a-z/<letter> and /glossary/a-z/<letter> static letter-index pages, generated from `_manifest.json`. Cheap engineering, huge crawl surface. | [W3, W6] |
| L4 | **Hub-spoke with keyword-exact, shallow URLs.** No /conditions/ prefix at WebMD — major topics own top-level keyword directories, spokes are flat keyword children 1–3 segments deep; hub = magazine page with Guide TOC + "Suggested Reads" + "Top Search Terms" (an explicit keyword-anchor module) + latest dated posts; one hub fans PageRank to ~100 spokes, every spoke links back. | Hub template (§3 T2) gets exactly these four modules. URLs stay 1–3 segments, keyword-exact (already true of v1). | [W4, W5] |
| L5 | **Fixed monograph H2 spine.** Drug monographs run a fixed heading spine (Uses / Side Effects / Warnings / Interactions / Overdose) with Drug + BreadcrumbList + MedicalCondition schema, and a title formula. | Fixed H2 spines per monograph type (§3), title formulas per template, schema law (§4). | [W7] |
| L6 | **Canonical page + alias layer (Mayo).** ~1,192 canonical condition pages fronted by ~4,700 A–Z name entries — synonyms map many searchable names onto one monograph. | One canonical page per herb/formulation/therapy; Sanskrit + IAST + Latin-botanical + vernacular aliases as extra A–Z index entries pointing at the canonical URL. This is THE pattern for a bilingual-nomenclature corpus. | [P1] |
| L7 | **Facets-as-directories (Drugs.com).** One canonical substance page surrounded by parallel facet pages reusing the slug (/sfx/, /dosage/, /interactions/…) — each aspect ranks independently while the root stays canonical. | Tier-1 herbs (top ~250) get facet spokes: `/herbs/<slug>/dosage`, `/herbs/<slug>/safety`, `/herbs/<slug>/interactions`, `/herbs/<slug>/classical-references`. Minor herbs stay single-page. | [P6] |
| L8 | **Two registers per substance (Drugs.com).** Consumer page in plain-language Q&A headings; a parallel professional monograph structured Clinical Overview / Botany / Chemistry / Uses & Pharmacology / Dosing / Interactions / Toxicology / References — "the single best herbs=drugs model in the peer set." | Consumer register is the default. The professional register becomes the `/pharmacopoeia/monographs/<herb>` reference layer (v4) — API-style, for practitioners and AI citation. | [P7] |
| L9 | **Route/form baked into the slug (Mayo drg- pages); tabbed monograph grammar incl. a "care-at-Mayo" conversion tab.** | Formulation slugs carry the kalpana class (`/formulations/lehya/chyawanprash`); therapy monographs end with a "where this is administered" block → the KTAHV bridge (our care-at-Mayo tab). | [P2, P3] |
| L10 | **Flat-slug scale + medically-reviewed bylines (Healthline).** ~38.9k flat /health/<slug> articles; hierarchy expressed by hubs + interlinking, not URL depth; every page carries "Medically reviewed by <name, credentials>" + update date; the "X proven benefits of Y" format is the herb-traffic engine. | Long-tail question articles live flat under their cluster (`/herbs/ashwagandha-for-sleep` style) rather than deep paths; dual byline + dateModified everywhere (already law, niche brief §2.2). | [P4, P5] |
| L11 | **Dated content feeds hub freshness.** WebMD publishes dated news INSIDE condition directories; hubs show "Latest <topic> posts." | Our news stays under /news/ (one dated lifecycle to engineer, and liftable to WhyAyurveda), but every hub gets a "Latest on <topic>" module pulling tagged news — same freshness signal, cleaner separation. | [W5] |
| L12 | **UGC isolated from the medical monograph.** WebMD splits user reviews onto reviews.webmd.com. | We go further: **no UGC at all** (Policy B+, POSITIONING angle 7). No AggregateRating schema anywhere — nothing to rate. | [W7] |

### 1.2 Lessons that DO NOT transfer (deliberate divergences)

| # | WebMD pattern | Why we diverge | Our substitute |
|---|---|---|---|
| D1 | **Condition-treatment framing as the site's spine** (~100 condition hubs, "Guide to Type 2 Diabetes" with Treatment chapters) [W3–W5]. | The Drugs & Magic Remedies Act 1954 + FSSAI doctrine (niche brief §5) bars disease-treatment claims; KTAHV GST posture bars cure language. A condition-led IA would put our riskiest register at the centre. | **Herbs, therapies, classical texts and philosophy lead the IA.** Conditions exist only as `/conditions-and-ayurveda/` — "How Ayurveda approaches X," educational register, classical rogadhikara framing, never treat/cure/prevent. It is a mid-size cluster, not the spine. |
| D2 | **Client-side-rendered inventories** — WebMD's drug lists render from a Vue app; the monograph inventory is invisible to crawlers; /api/ robots-blocked [W6]. | Kills crawlability and AI-citability — the opposite of our GEO standard. | Everything server-rendered static from content JSON (already true of the catch-all route). |
| D3 | **Ad-funded utility design + affiliate pressure** (WebMD look; Healthline's commerce model — Wikipedia-blacklisted) [P4; POSITIONING §3]. | Policy B+ is the moat: no ads, no affiliate, luxury-grade visual identity (Phase-1 gate). | Editorial firewall; KAPPL formulations covered educationally with explicit disclosure; "buy" routes to Shopify, never on-site. |
| D4 | **Drug-monograph consumer framing applied to herbs** ("Uses" implying indications). | Same DMR exposure. | The herb spine (§3 T1) uses "What the science says" + the four-tier Evidence Display, NOT an indications list. |
| D5 | **Symptom checker / doctor directory tools** (symptoms.webmd.com, doctor.webmd.com) [W2]. | Diagnosis-adjacent tools are a regulatory and safety line we don't cross; our physician layer is KTAHV itself. | /tools/ limited to educational instruments: dosha quiz, glossary search, interaction checker (informational, "consult your doctor/pharmacist"). |
| D6 | **AggregateRating on monographs** [W7]. | No UGC (D-12 above); ratings without users would be fabricated data (CLAUDE.md rule 6). | Trust via reviewedBy + Sources block instead. |

---

## 2 · THE FULL SITEMAP TREE

Legend: **Priority** v1 = shipped 14 Jul 2026 · v2 = evergreen scale, content-only (M2–M9) · v3 = new-engineering wave (M10–M18) · v4 = 5-yr build-out. **Template** codes are defined in §3. Counts are cumulative targets per hub ("v2 60 → v4 700" = 60 pages live by end of v2, 700 by year 5). ⚕ = clinical, Dr. Deepu John gate.

```
/                                        ✓ v1   T2-hub (home)
/what-is-ayurveda                        ✓ v1   T0 pillar (3–5k words, links every hub)
/sitemap                                 ▢ v2   T3 curated HTML crawl hub (WebMD /sitemap model [W2]; footer-linked)

── CORE CONCEPTS ────────────────────────────────────────────────────────────
/doshas/                                 ✓ v1   T2 hub
  /doshas/{vata,pitta,kapha}             ✓ v1   T1 monograph            3
  /doshas/{prakriti,vikriti,dual-doshas} ▢ v2   T1                      v2 6 → v4 12
/principles/                             ▢ v2   T2 hub — tridosha, panchamahabhuta, agni, ama,
  /principles/<concept>                            dhatus, srotas, ojas-tejas-prana, and the
                                                   rasa/guna/virya/vipaka/prabhava taxonomy
                                                   (the dravyaguna taxonomy hub, ~25 pp [U-C1])
                                                   T1                    v2 8 → v4 25

── DRAVYAGUNA (single herbs/minerals — the biggest cluster) [U-C1 ≈1,310 pp] ──
/herbs/                                  ✓ v1   T2 hub  ⚕
  /herbs/<slug>                          ✓ 4    T1 herb monograph ⚕     v2 60 → v3 150 → v4 700
                                                   (tiered: ~250 major herbs deep, ~450 minor single-page [U-C1])
  /herbs/<slug>/{dosage,safety,          ▢ v3   T1f facet spokes ⚕      v3 60 → v4 750
    interactions,classical-references}             (Drugs.com facet model [P6]; top-250 herbs only)
  /herbs/groups/<mahakashaya-or-gana>    ▢ v3   T2 group hub ⚕          v3 12 → v4 87
                                                   (50 Charaka Mahakashayas + 37 Sushruta ganas [U-C1])
  /herbs/a-z/<letter>                    ▢ v2   T3 letter index          26 (aliases: Sanskrit/IAST/
                                                   botanical/vernacular names → canonical page [P1])
  /herbs/<long-tail-question-slug>       ▢ v3   T1q flat question articles ⚕ (Healthline format [P5])
                                                                         v3 30 → v4 150

── FORMULATIONS (kalpana) [U-C2 ≈654 pp] ────────────────────────────────────
/formulations/                           ▢ v2   T2 hub ⚕
  /formulations/<class>                  ▢ v2   T1 class explainer ⚕    14 (asava-arishta, kashayam,
                                                   choornam, ghritam, thailam, bhasma-rasa, rasayana,
                                                   lehya, gulika-vati, guggulu, lepa … [U-C2])
  /formulations/<class>/<name>           ▢ v2   T1 formulation monograph ⚕
                                                   slug carries the class (Mayo route-in-slug [P3])
                                                                         v2 25 → v3 120 → v4 600
                                                   (AFI Parts 1–3: 444+191+350 published formulations;
                                                    API-II holds 202 monographs [U-C2])
  /formulations/by-classical-indication/<index> ▢ v4  T3 index          ~40 (rogadhikara framing ONLY —
                                                   DMR-safe classical citation, never "for <disease>")

── THERAPIES [U-C5 ≈61 pp] ──────────────────────────────────────────────────
/panchakarma/                            ✓ v1   T2 hub ⚕ (kept at shipped URL)
  /panchakarma/{the-five-therapies,what-to-expect} ✓ v1  T1 ⚕
  /panchakarma/<karma>                   ▢ v2   T1 protocol monograph ⚕  5 (vamana, virechana, basti,
                                                   nasya, raktamokshana) + indications/contraindications
                                                   spokes v3 (+15) [U-C5]
  /panchakarma/{poorvakarma,paschatkarma}▢ v2   T1 ⚕                    6
/therapies/                              ▢ v2   T2 hub ⚕ — Kerala bahya therapies
  /therapies/<name>                      ▢ v2   T1 therapy monograph ⚕  v2 12 → v4 30
                                                   (abhyanga, shirodhara, njavarakizhi, pizhichil,
                                                   elakizhi, podikizhi, udwarthanam, kati/janu/greeva
                                                   vasti, talapothichil, gandusha … [U-C5]);
                                                   each ends with the "where administered" KTAHV
                                                   bridge block (care-at-Mayo pattern [P2])
  /therapies/which-therapy-guide         ▢ v3   T3 mapping index ⚕      ~10 (therapy↔goal, DMR-safe)

── CLASSICAL TEXTS [U-C3 ≈330 pp] ───────────────────────────────────────────
/classical-texts/                        ▢ v2   T2 hub — our Experience moat
  /classical-texts/<text>                ▢ v2   T1 text landing          8 (Brihat Trayi: Charaka 8
                                                   sthanas/120 ch · Sushruta 186 ch · Ashtanga Hridaya
                                                   6 sections/120 ch; + Laghu Trayi + nighantus [U-C3])
  /classical-texts/<text>/<sthana>       ▢ v3   T1 sthana guide          20
  /classical-texts/<text>/<sthana>/<chapter> ▢ v4  T1 chapter summary   ~180 (≈50% of the 360 Brihat
                                                   Trayi chapters over 5 yr [U-C3])
  /classical-texts/concepts/<verse-anchored> ▢ v4  T1                   ~120

── THE EIGHT BRANCHES [U-C4 ≈60 pp] ─────────────────────────────────────────
/branches/                               ▢ v2   T2 hub (ashtanga)
  /branches/<branch>                     ▢ v2   T1 pillar                8 (kaya-chikitsa, kaumarabhritya,
                                                   graha, shalakya, shalya, agada-tantra, rasayana,
                                                   vajikarana [U-C4])
  /branches/<branch>/<spoke>             ▢ v3   T1                       v3 16 → v4 48
  /branches/index-pages                  ▢ v4   T3                       ~4

── DIAGNOSTICS [U-C6] ───────────────────────────────────────────────────────
/diagnostics/                            ▢ v3   T2 hub ⚕ — EDUCATIONAL register only (what a
  /diagnostics/<method>                            pariksha is; never a self-diagnosis tool — D5)
                                                   T1 ⚕                  v3 6 → v4 ~30*
                                                   (nadi, trividha, ashtavidha, dashavidha pariksha …
                                                   [U-C6]; *count is an estimate — census pass pending,
                                                   see Q3)

── DIET & LIFESTYLE ─────────────────────────────────────────────────────────
/diet/                                   ✓ v1   T2 hub
  /diet/eating-by-dosha                  ✓ v1   T1
  /diet/<topic>                          ▢ v2   T1 (six tastes, food-by-dosha tables, viruddha-ahara,
                                                   agni-and-digestion …)  v2 8 → v4 40
/lifestyle/                              ✓ v1 (dinacharya)  T2 hub
  /lifestyle/ritucharya + /lifestyle/<topic> ▢ v2  T1 (seasonal guides absorb the roadmap's
                                                   /seasonal/ line)       v2 6 → v4 25

── CONDITIONS (careful register — NOT the spine, see D1) ────────────────────
/conditions-and-ayurveda/                ▢ v3   T2 hub ⚕⚕ (double gate: physician + claims lint)
  /conditions-and-ayurveda/<condition>   ▢ v3   T1c "How Ayurveda approaches X" ⚕⚕
                                                   educational-only; anchored on the 10 Programme
                                                   Outcome themes (stress, sleep, chronic pain,
                                                   detox, weight, ageing, women's health, mental
                                                   wellbeing, cardiac, digestive — POSITIONING angle 4)
                                                   v3 10 → v4 120
                                                   Each page = the editorial→KTAHV bridge surface.

── REFERENCE & TRUST LAYER ──────────────────────────────────────────────────
/pharmacopoeia/                          ▢ v2   T2 hub (reference register)
  /pharmacopoeia/<topic>                 ▢ v2   T5 reference page         v2 6 → v4 20 (API volumes,
                                                   what a monograph contains, WHO-GMP, AYUSH,
                                                   standardization, heavy-metals transparency report)
  /pharmacopoeia/monographs/<herb>       ▢ v4   T5 professional-register monograph (Drugs.com
                                                   dual-template [P7])     v4 ~50
/interactions/                           ▢ v3   T4 TOOL + T1i pair pages ⚕⚕ (physician + pharmacist)
  /interactions/checker                  ▢ v3   T4 filterable checker over interactions.json
  /interactions/<herb>-and-<substance>   ▢ v3   T1i static pair pages ⚕⚕  v3 50 → v4 300
/is-ayurveda-scientific                  ✓ v1   T5 trust anchor
/glossary/                               ▢ v2   T2 hub + T3 a-z/<letter> (26)
  /glossary/<term>                       ▢ v2   T6 DefinedTerm page       v2 60 → v4 400
                                                   (Banyan two-tier model; every Sanskrit term used
                                                   anywhere on the site must resolve here)
/philosophy/                             ▢ v2   T2 hub + T1 (Samkhya, Nyaya-Vaisheshika, Vedanta,
                                                   darshana context — .org topic seeds)  v2 4 → v4 15
/history-of-ayurveda                     ✓ v1   T1

── NEWS (dated lifecycle — liftable to WhyAyurveda if Q2 splits it) ─────────
/news/                                   ▢ v3   T2 news index (paginated)
  /news/<yyyy>/<slug>                    ▢ v3   T7 dated NewsArticle ⚕ (physician-checked pre-publish)
                                                   cadence ~2–3/wk once live → ~120/yr → v4 ~400
                                                   Topic tags feed every hub's "Latest on <topic>"
                                                   module (freshness signal per [W5], lesson L11)

── TOOLS ────────────────────────────────────────────────────────────────────
/tools/                                  ▢ v3   T2 hub
  /tools/dosha-quiz                      ▢ v3   T4 (the Banyan conversion-hinge pattern, minus commerce)
  /tools/glossary-search                 ▢ v3   T4
  (interaction checker lives at /interactions/checker)

── E-E-A-T / POLICY SPINE ───────────────────────────────────────────────────
/about · /editorial-policy · /how-we-work ✓/▢ v1–v2  T5
/reviewers/<physician>                   ▢ v2   T5 Person-schema bio pages (every author/reviewer)
/faq                                     ✓ v1   T1q
/privacy · /terms · /cookie-policy       ✓ v1   static
```

### 2.1 Total-page targets per phase (cumulative)

| Phase | Window | New engineering | Cumulative pages (target) | What lands |
|---|---|---|---|---|
| **v1 — shipped** | 14 Jul 2026 | none (catch-all + JSON) | **20** | pillar + doshas + panchakarma + 4 herbs + diet/lifestyle + trust anchor + faq/about/history |
| **v2 — evergreen scale** | M2–M9 | T2 hub child-index + T3 letter-index generators; extended monograph JSON schema (§3) | **≈230** | herbs→60 · glossary→60 (+2 letter-index sets, 52) · formulations 14 classes+25 · classical-texts 8 · therapies 12+panchakarma spokes 11 · principles 8 · branches 8 · diet/lifestyle +14 · pharmacopoeia 6 · philosophy 4 · reviewers+policy 4 · HTML /sitemap |
| **v3 — engineering wave** | M10–M18 | interactions dataset+checker (T4) · news lifecycle (T7) · dosha quiz · facet-spoke routing (T1f) · conditions cluster opens | **≈560** | herbs→150 (+60 facets, +30 question articles) · formulations→120 · interactions 50 pairs+checker · news live (~60 by M18) · conditions 10 POP-anchored pages · classical-texts sthanas 20 · branches spokes 16 · groups 12 · diagnostics 6 · therapy guide 10 |
| **v4 — the 5-yr bible** | Y2–Y5 | professional-register layer; chapter-summary programme; scale ops (see Q4) | **≈3,400** (honest range 3,000–3,900) | herbs 700+750 facets+87 groups+150 questions ≈ 1,690 [U-C1] · formulations 654 [U-C2] · classical texts 330 [U-C3] · branches 60 [U-C4] · therapies ~61 [U-C5] · diagnostics ~30* [U-C6] · conditions 120 · glossary 400 · interactions 300 · news ~400 · reference/diet/lifestyle/philosophy remainder ≈150 |

The **500+ page threshold is crossed inside v3 (~M16–M18)**. The binding constraint is not writing — it is the physician-review pipeline (§5).

---

## 3 · Template library → existing content-JSON architecture

The v1 engine: every page = one JSON file in `sites/whatisayurveda.com/content/` (slug encoded with `__` separators, indexed in `_manifest.json`), rendered by ONE catch-all route `app/[...slug]/page.tsx` via `app/lib/render.tsx`. Current page schema: `slug · title · metaDescription · answerCapsule · breadcrumb · sections[{h2,capsule,body}] · faqs · citations · clinical · register_ok · routesTo`. **Everything below is an extension of that schema, not a replacement.**

| Code | Template | H2 spine / content contract | Reuses today's JSON? | New engineering |
|---|---|---|---|---|
| **T0** | Pillar | Question-form H2s (What is / History / Doshas / Does it work / Is it safe / Is it right for you); links every hub in intro | ✅ as-is | none |
| **T1** | Evergreen monograph (herb / formulation / therapy / text / concept) | Herb spine: Names (Devanagari+IAST+botanical+English) → What it is → Rasa-guna-virya-vipaka table → What the science says (four-tier Evidence Display) → Safety & cautions → Classical references (chapter:verse) → More information. Formulation spine adds: kalpana class → classical source recipe → how it is made (KAPPL Experience content) → educational only, buy→Shopify. Therapy spine adds the KTAHV "where administered" bridge [P2]. | ✅ core; **extend schema** with optional typed blocks: `names{devanagari,iast,botanical,english,vernacular[]}`, `dravyaguna{rasa,guna,virya,vipaka,prabhava}`, `evidenceTiers[{tier,claim,source}]`, `classicalRefs[{text,sthana,chapter,verse}]`, `safety{cautions[],contraindications[]}`, `aliases[]` (feeds A–Z), `kalpanaClass`, `administeredAt` | Renderer blocks for each typed field (one-time, ~1 sprint); lint rule: tier-1 claims REQUIRE `evidenceTiers` + `classicalRefs` |
| **T1f** | Facet spoke (top-250 herbs) | Single-facet deep page (dosage / safety / interactions / classical refs) canonicalizing context to the root monograph [P6] | ✅ same JSON type, slug `herbs__<h>__dosage.json` | none beyond T1 blocks; internal-link module "part of the <herb> monograph" |
| **T1q** | Flat question article | Healthline "X and Y" / benefits format [P5]; answer capsule first | ✅ as-is | none |
| **T1c** | Condition-approach page | Fixed DMR-safe spine: What it is (neutral medical description, cited) → How Ayurveda frames it (classical, cited) → What the evidence says (tiered) → What a physician-led programme looks like (KTAHV bridge) → Talk to your doctor | ✅ + `evidenceTiers` | **double gate**: banned-claims lint (treat/cure/prevent list) runs in CI on this cluster |
| **T2** | Hub | Four modules per [W5]: (a) Guide/TOC of all spokes, (b) Suggested Reads crosslinks, (c) Top Search Terms keyword-anchor module, (d) Latest on <topic> (news tags) | ⚠️ partial | **v2 engineering**: hub JSON gains `children[]` auto-derived from `_manifest.json` at build; modules rendered from manifest + news tags |
| **T3** | Index (A–Z letter pages, HTML /sitemap, mapping indexes) | Letter pages list canonical entries + alias entries [P1, W3] | ⚠️ | **v2 engineering**: build-time generator over manifest `aliases[]`; /sitemap curated list is a hand-maintained JSON |
| **T4** | Tool (interaction checker, dosha quiz, glossary search) | Checker: curated `interactions.json` (ingredient × substance × severity × evidence × source) → filterable UI + static T1i pair pages for SEO; read-only, "informational — consult your doctor/pharmacist" | ❌ | **v3 engineering** (its own scoped, task-tracked build per the roadmap); dataset is physician+pharmacist gated |
| **T5** | Reference / policy / bio page | Pharmacopoeia register; Person bios; editorial policy | ✅ as-is (+`person{}` block for bios) | minor |
| **T6** | Glossary term | Two-tier: 40-word capsule definition + deeper Living-Ayurveda context; DefinedTerm | ✅ trimmed T1 | none; glossary-search tool is v3 |
| **T7** | Dated news article | Dateline + NewsArticle schema + topic tags; physician-checked pre-publish; starts hand-curated (option a), graduates to feed-assisted drafts (option c) per the roadmap | ⚠️ | **v3 engineering**: `datePublished/dateModified` lifecycle, /news/ pagination, tag→hub module feed |

**The load-bearing point:** v2 (20→230 pages) needs only the T1 schema extension + T2/T3 generators — content, not architecture. v3 adds exactly two real systems (interactions, news) + one component (quiz), each its own scoped build. Nothing in the 5-yr tree requires abandoning the catch-all + JSON engine; at v4 scale the only ops change is sharding content/ into per-cluster subfolders (already anticipated by the roadmap).

---

## 4 · Internal-linking + schema law (per template)

**Linking law (site-wide constants):**
1. Pillar links every hub in/near its intro; every hub links the pillar [niche brief S21].
2. Every spoke links its hub near the top (breadcrumb + in-prose) and 2–3 siblings — a bounded web, not exhaustive cross-linking.
3. Every spoke receives ≥1 exact-match internal anchor for its target phrase somewhere on the site (the Zyppy ~5× finding, niche brief S22) — the hub's **Top Search Terms module** [W5] is where those anchors live by design.
4. Every Sanskrit term anywhere on the site links its /glossary/ entry on first use (entity-SEO backbone).
5. Facet spokes ↔ root monograph bidirectional; alias index entries → canonical only (never alias→alias) [P1].
6. Hub fan-out ceiling ~100 spokes [W5]; past that, split the hub (e.g. /herbs/ splits by letter ladder + groups).
7. Every clinical page carries the conversion-bridge block (therapy→KTAHV "where administered"; condition→programme theme; formulation→Shopify educational pointer) — one block, standardized, `routesTo` field already exists in the JSON.
8. Footer: /sitemap (HTML), pillar, hubs, policy spine — the one-link-deep crawl-hub guarantee [W2].

**Schema law (all JSON-LD, emitted by the renderer per template — no fabricated fields, CLAUDE.md rule 6):**

| Template | Required schema | Notes |
|---|---|---|
| T0/T1/T1f/T1q/T1c | **MedicalWebPage** with `reviewedBy` (Person: Dr. Deepu John or named BAMS reviewer) + `lastReviewed` + `dateModified` | The E-E-A-T signal AI engines disproportionately cite (niche brief S14/S15) |
| T1 herb | + MedicalEntity/Substance where accurate | **Never Drug + AggregateRating** (divergence D6) — WebMD's Drug schema [W7] presumes a regulated drug + UGC ratings we don't have |
| T1c condition | + MedicalCondition ONLY for the neutral descriptive section | claims lint gates the rest |
| T2 hub | CollectionPage + ItemList + BreadcrumbList | |
| T3 index | CollectionPage + ItemList | |
| T4 tool | WebApplication + disclaimer block | |
| T5 bio | **Person** with credentials, registration no. | |
| T6 glossary | **DefinedTerm** in a DefinedTermSet | |
| T7 news | **NewsArticle** with datePublished + author + reviewedBy | dateline visible on-page |
| all | BreadcrumbList + Organization; FAQPage where `faqs[]` non-empty | already emitted in v1 |

**Every page keeps:** answer capsule first (~40 words), question-form H2s, numbered citations block, dual byline, Sanskrit-IAST-English on Tier-1 claims, the four-tier Evidence Display on any efficacy statement (POSITIONING angles 3/5/6).

---

## 5 · Build cadence to 500+ pages (the physician-gate pipeline)

**The constraint is review throughput, not writing.** Rule 7 makes Dr. Deepu John the gate on every ⚕ page; the niche-brief pipeline (Cleveland-style pre-publication specialist review) is one process satisfying both obligations. Design the cadence around the reviewer:

1. **Batch per cluster, not per page.** A review batch = 20–30 pages of ONE template type in ONE cluster (e.g. "herbs batch 3: 25 monographs"), delivered as a single preview link + a claims-summary sheet (every Tier-1 claim + its citation, extracted from `evidenceTiers[]` automatically). Same-template batches review 3–4× faster than mixed sets.
2. **Assumed sustainable throughput: ~25–30 clinical pages/month** through one reviewer (**assumption — confirm with Dr. Deepu John, Q1**). That yields: v2's ~180 clinical pages ≈ 7–8 months ✅ matches M2–M9; v3's additional ~250 ≈ 9 months ✅ matches M10–M18; **500+ total crossed ~M16–M18.**
3. **Non-clinical lanes run parallel, ungated:** glossary, philosophy, classical-text structure pages, history, principles-as-philosophy, policy/bio pages — roughly 30% of the corpus keeps shipping while clinical batches queue.
4. **Priority order within v2 (citation-earning order):** herbs (biggest AI-answer surface) → glossary (entity backbone) → formulation classes → classical texts (Experience moat) → therapies → the rest.
5. **Interactions + news get the EXTRA gate:** interactions = physician + pharmacist sign-off on the dataset itself, then per-pair pages inherit; news = pre-publish physician check per item, dated, NewsArticle schema (roadmap non-negotiables).
6. **Re-review cadence:** every clinical page carries `lastReviewed`; re-review at ≤24 months or on evidence change — surfaced by a monthly manifest query (pages sorted by stale `lastReviewed`), folded into the Monday lint ritual.
7. **v4 scale (≈60 pages/month sustained) exceeds a single reviewer** → requires a second BAMS/MD-Ayu reviewer + Dr. Deepu John as senior editor counter-signing batches. **Open question Q1/Q4 — do not plan v4 dates until answered.**
8. Standard Lane-B mechanics unchanged: content JSON committed to git, preview → Abilash, specs + lint green, crash-resilient small commits, launch evidence in `launches/whatisayurveda.com/`.

---

## 6 · Top 5 structural decisions (the ones that shape everything)

1. **Herbs/therapies/texts lead; conditions demoted to a mid-size, double-gated educational cluster.** The single biggest divergence from WebMD, forced by the DMR Act — and it happens to align with where our authority is genuinely unmatchable (D1).
2. **One canonical page + an alias layer** (Mayo model [P1]): Sanskrit, IAST, botanical, and vernacular names are index entries resolving to one canonical URL — the only sane architecture for a multi-nomenclature corpus, and it multiplies A–Z crawl surface ~4× without content duplication.
3. **Internal linking is engineered, not editorial** (WebMD's whole discovery model [W1, W5]): hub modules (Guide TOC / Suggested Reads / Top Search Terms / Latest), letter-index ladders, the curated HTML /sitemap, and the glossary-term auto-link — all build-time components over `_manifest.json`. Plus real XML sitemaps, which WebMD itself lacks — our cheap win.
4. **Facets-as-directories for the top-250 herbs, two registers per substance** (Drugs.com [P6, P7]): consumer monograph now, professional /pharmacopoeia/ register in v4 — each aspect ranks independently, the root stays canonical, and practitioners/AI get a citable clinical layer.
5. **The catch-all + content-JSON engine is the permanent architecture.** 20 → 3,400 pages is content + two scoped v3 systems (interactions dataset+checker, news lifecycle) + small build-time generators. No CMS migration, no re-platforming, ever, on this plan.

---

## 7 · Open questions for Abilash (→ QUESTIONS.md)

- **Q1 — Review throughput:** Is ~25–30 clinical pages/month a realistic sustained review load for Dr. Deepu John? (§5 cadence and the M16–M18 "500-page" date hang on this assumption.)
- **Q2 — WhyAyurveda split (carried from POSITIONING §6):** If the two-property build is confirmed, /news/ (T7) lifts out to WhyAyurveda — confirm before v3 news engineering starts, so we build it against the right domain.
- **Q3 — Diagnostics cluster census:** The knowledge-universe census for diagnostics (pariksha methods) is incomplete in the evidence set — the ~30-page target is an estimate, flagged not asserted. Approve a follow-up census pass before v3 opens that hub?
- **Q4 — v4 review board:** 5-yr scale needs a second named BAMS/MD-Ayu reviewer (§5.7). Recruit/nominate from the 10,000-practitioner network, or cap the corpus at what one reviewer sustains (~1,500 pages/5yr)?
- **Q5 — Formulation coverage vs KAPPL catalog:** Target ~600 formulation monographs is the classical-corpus number [U-C2]. Should KAPPL's own manufactured formulations be the priority subset within it (educational register, Shopify pointer), and roughly how many is that? (Needs the KAPPL catalog — no number invented here.)
- **Q6 — German locale sequencing:** POSITIONING mandates German as priority second locale. Does DE start with v2's herb/therapy clusters (highest DACH search value) or with the v1 twenty? Affects the v2 content budget materially (every DE page is a second physician-checkable artifact).
- **Q7 — Interaction checker scope at launch:** v3 plans 50 curated pairs. Confirm the starting substance list (e.g. the top-20 Western prescription classes × top-20 herbs) with Dr. Deepu John + a named pharmacist before dataset work begins.

---

## Evidence index

**WEBMD teardown (fetched live):**
- [W1] robots.txt has zero `Sitemap:` directives; /sitemap.xml, /sitemap_index.xml, /news-sitemap.xml all 404; legacy sitemap-index 301s to the HTML /sitemap page — discovery runs on internal linking. https://www.webmd.com/robots.txt
- [W2] /sitemap = curated 252-link HTML crawl hub touching every template family (condition hubs, 16 verticals, drugs index, ~22 supplement monographs, tools, 40+ blogs), footer-linked. https://www.webmd.com/sitemap
- [W3] Conditions A–Z: one index paginated ?pg=a..z; ~150–200 links/letter ≈ 4,000–5,000 entry points; entries → full directory hubs (major) or single /a-to-z-guides/ articles (long-tail). https://www.webmd.com/a-to-z-guides/health-topics
- [W4] URL taxonomy: no /conditions/ prefix; top-level keyword directories or 2-level organ-parent paths; hub = <dir>/default.htm; flat keyword children; 1–3 segments deep. https://www.webmd.com/diabetes/default.htm
- [W5] Hub template: Guide all-chapters TOC + Suggested Reads + Top Search Terms keyword-anchor module + latest dated posts inside the directory; 97 same-directory spoke links from the diabetes hub. https://www.webmd.com/diabetes/default.htm
- [W6] Drugs A–Z: 3-tier browse ladder (~700 pages); monograph lists render client-side (Vue, robots-blocked API) — only the ladder is crawlable and it carries the equity. https://www.webmd.com/drugs/2/index
- [W7] Drug monograph: fixed H2 spine (Uses/Side Effects/Warnings/Interactions/Overdose); Drug + AggregateRating + BreadcrumbList + MedicalCondition schema; title formula; UGC reviews isolated on reviews.webmd.com. (metformin monograph fetch)

**PEERS:**
- [P1] Mayo: ~1,192 canonical condition pages ÷ ~4,700 A–Z alias entries — synonym layer onto canonical monographs. https://www.mayoclinic.org/diseases-conditions/index?letter=A
- [P2] Mayo condition template: typed-ID tabbed grammar incl. the care-at-Mayo conversion tab. https://www.mayoclinic.org/diseases-conditions/atrial-fibrillation/symptoms-causes/syc-20350624
- [P3] Mayo drugs: ~2,864 drg- monographs with route baked into slug; supplements a small curated 28-page set; symptoms A–Z ~88 pages. https://www.mayoclinic.org/drugs-supplements
- [P4] Healthline: ~38.9k flat /health/ slugs + ~3.7k /nutrition/ corpus; hierarchy via hubs + interlinking, not URL depth. https://www.healthline.com/sitemap.xml
- [P5] Healthline condition hub + medically-reviewed bylines + "benefits of Y" herb-traffic format. https://www.healthline.com/health/psoriasis
- [P6] Drugs.com: canonical root substance page + parallel facet directories reusing the slug (24,000+ monographs claimed on-page). https://www.drugs.com/drug_information.html
- [P7] Drugs.com dual register: consumer Q&A template vs professional natural-product monograph (Clinical Overview → Toxicology → References) — the best herbs=drugs model in the set. (ashwagandha.html / metformin.html H2 extraction)

**UNIVERSE census (classical-corpus sizing):**
- [U-C1] Dravyaguna: Charaka Sutrasthana Ch.4 — 50 Mahakashayas × 10 dravyas = 500 plants; Sushruta Sutrasthana Ch.38 — 37 ganas; realistic monograph target ~700 (Bhavaprakasha/nighantu span); cluster ≈1,310 pages tiered. https://www.easyayurveda.com/2019/10/24/maha-kashayas-50-great-decoctions/
- [U-C2] Kalpana: ~14 dosage-form classes; Ayurvedic Formulary of India 444+191+350 formulations; API-II 202 monographs; cluster ≈654. https://naturalingredient.org/wp/wp-content/uploads/API-II-Vol-1.pdf
- [U-C3] Samhitas: Charaka 8 sthanas/120 ch; Sushruta 186 ch; Ashtanga Hridaya 6 sections/120 ch; + Laghu Trayi; cluster ≈330. https://ayurvedahub.in/pages/charaka-samhita
- [U-C4] Ashtanga: the eight branches per Ashtanga Hridaya; cluster ≈60. https://ayurvedahub.in/blogs/ayurvedic-wellness/ashtanga-hridaya-vagbhata-ayurveda-classical-text-guide
- [U-C5] Therapies: Panchakarma pentad + poorva/paschat karma + ~17 named Kerala bahya procedures; cluster ≈61. (same source)
- [U-C6] Diagnostics: nadi/trividha/ashtavidha/dashavidha pariksha — **census incomplete in the evidence set; counts flagged as estimates (Q3).**

**Continuity sources:** `docs/group-inputs/whatisayurveda-IA-roadmap.md` (superseded sitemap; vision + pillar table remain authoritative) · `docs/strategy/POSITIONING_AND_MOA.md` §3/§5/§6 · `docs/group-inputs/whatisayurveda-niche-brief.md` (S-numbered citations referenced above) · live v1 build: `sites/whatisayurveda.com/content/` (20 JSON pages + `_manifest.json`) and `app/[...slug]/page.tsx`.

---

*Checker pass (2026-07-15 14:11:13 IST): instruction re-read against output — all six requested sections present (WebMD lessons ±, full tree with URL/template/count/priority, template→JSON mapping, linking+schema law, cadence with batched physician gate, open questions) plus phase totals and top-5 decisions. Unverified items, listed honestly: all page counts are planning targets, not facts; the 25–30 pages/month reviewer throughput is an unconfirmed assumption (Q1); the diagnostics-cluster census is incomplete (Q3); KAPPL formulation-subset size unknown (Q5). No IDs, prices, contacts, or facts invented.*
