# whatisayurveda.com — CONTENT ENGINE BUILD PLAN

**2026-07-15 18:42:11 IST · Lead content architect pass · Decision-ready master plan.**
**Status:** PROPOSAL. Sections marked 🔴 need Abilash ratification or Dr. Deepu John sign-off before the code they govern is written. Everything else a builder may execute without re-deciding.
**Inputs read in full:** `demand.md` (+ `demand-raw.json`), `architecture-audit.md`, `teardown-herb-monograph.md`, `teardown-condition.md`, `teardown-interactions.md`, `teardown-texts-concepts.md`, `teardown-regulatory-news.md`, `teardown-eeat.md`, `teardown-aeo-geo.md`, plus the live code (`app/lib/content.ts`, `app/lib/medical-review.ts`, `app/_components/article.tsx`, `site.config.json`, all 20 `content/*.json`).
**No git run. No code changed. This document decides; it does not build.**

---

## 0 · READ THIS FIRST — the demand data underneath this plan is quarantined

I was briefed to justify the first cluster with "HERBS cluster dominates at 2.57M/mo US+India." **I am not going to do that, because the file that number comes from says not to.**

`docs/whatisayurveda-research/demand.md` opens with its own quarantine banner (added 2026-07-15, after a GPT-5 audit returned FAIL and was verified correct against `demand-raw.json`):

> "**Therefore the cluster totals below (e.g. "herbs 2.57M/mo") are NOT trustworthy and must not be cited.** The directional read (herbs dominate — ashwagandha 673K US, turmeric 301K US, moringa 201K US are real) survives, but the numbers do not."

Four verified faults: (1) fake compound seeds (`turmeric curcumin` understates `turmeric` by 11×; `amla amalaki` by 25×); (2) implausible zeros summed into totals (shilajit/shatavari/gokshura return 0 US — a data fault, not a finding); (3) India pulled in English only, missing Hindi/Devanagari/Hinglish entirely; (4) ~80 ad-hoc seeds, no ontology, no intent/difficulty/AEO layer.

**The contamination is wider than one file.** Every teardown in this directory was written against the pre-quarantine artifact and repeats the bad number as its own premise:

| Doc | Repeats the quarantined figure |
|---|---|
| `teardown-herb-monograph.md` §0, §4.1, §6 | "2,568,670/mo US+India"; "formulations cluster (344,640/mo)"; "moringa (447K/mo)" |
| `teardown-aeo-geo.md` §2 | "herbs 2.57M/mo US+India, per demand.md" |
| `teardown-condition.md` §7.5 | "Let the *herbs* cluster carry the 2.57M/mo volume" |
| `reusable-content-map.md` §2.2 | "the 344,640/mo formulations cluster" |

**What this changes, and what it does not.**

- ❌ **Does not survive:** every cluster total; the herbs-vs-concepts ranking (concepts' 1.54M is 97% `ojas` 1.5M India, which the brief itself says is brand-name noise — strip it and the cluster is ~43K, so the *ranking* was right for the wrong reason); the ~3,400-page target (`reusable-content-map.md` §5.2 shows it derives from easyayurveda.com/ayurvedahub.in blog arithmetic, not primary sources); "moringa 447K/mo" (a sum of two unreliable pulls).
- ✅ **Survives:** the individual single-term volumes the quarantine note explicitly re-verified — **ashwagandha 673,000 US / 301,000 IN**, **turmeric 301,000 US**, **moringa 201,000 US**, **amla 165,000 IN**, **shilajit 246,000 IN**, **shatavari 90,500 IN**, **gokshura 27,100 IN**. Those are re-tested single terms, not compounds, and they are enough to decide the first cluster.
- ✅ **Survives:** every structural finding in every teardown. The page anatomies, the API field order, the First Schedule serial numbers, the LiverTox score, Saper 2008, the E-E-A-T checklist, the AEO evidence base — none of that depends on search volume. **~95% of the research pass is unaffected.** This is a keyword problem, not a research problem.

**Ruling for this plan:** herbs go first, justified **only** by the seven re-verified single-term volumes above (§3.1). No cluster total appears anywhere in this document. The `MASTER_PIPELINE.md` keyword re-pull (entity ontology → real single-term seeds → multi-locale incl. Hindi/Devanagari → automated plausibility validation → intent/difficulty scoring) is a **prerequisite for Phase 2, not for Phase 1** — the top ~18 herbs are unambiguous under any plausible re-pull, and blocking the seed batch on a re-pull would waste the window. It **is** a hard gate on any decision about cluster *sequencing* after herbs (§3.4, 🔴 Q1).

**Pushback, stated plainly:** the brief I was given asked me to cite a number my own inputs had already condemned. I'd rather hand back a plan with seven defensible numbers than one with a headline figure that dies on first contact with a re-pull. If the herbs-first call needed 2.57M to stand up, it would be a weak call. It doesn't — ashwagandha alone at 673K US is larger than every condition head term in the corpus combined.

---

## 1 · CONTENT TAXONOMY

### 1.1 The page types

Ten types. `type` is a **required discriminant with no default** (`architecture-audit.md` §5.1: "a silent default is how 3,400 pages end up mistyped"). `clinical` stops being the template switch and becomes what it always should have been — the physician-gate flag.

| # | `type` | URL shape | What it is | Count today | Phase |
|---|---|---|---|---|---|
| 1 | `herb` | `/herbs/<slug>` | Single dravya monograph. Reader-facing, evidence-led, safety-first. **The scaling unit.** | 4 | 1 |
| 2 | `formulation` | `/formulations/<slug>` (+ legacy `/herbs/triphala`) | Multi-dravya preparation (churna/arishta/taila/leha). Educational only — never commerce. | 1 (triphala, mistyped as herb) | 2 |
| 3 | `condition` | `/conditions/<slug>` | "Ayurveda for X". **Highest-risk type.** Fixed DMR-safe spine, risk-tiered, capped. | 0 | 3 |
| 4 | `concept` | `/doshas/<x>`, `/concepts/<x>` | Vata, agni, ojas, prakriti, **rasa/guna/virya/vipaka/karma**. | 3 doshas + 4 loose | 1 (pharmacology) / 2 (rest) |
| 5 | `classical-text` | `/texts/<slug>` | Charaka, Sushruta, AH, Bhavaprakasha. Licence-constrained. | 0 | 2 |
| 6 | `pharmacopoeia` | `/api/<iast-slug>` | API monograph as a **standards record**, verbatim + structured. | 0 | 2 |
| 7 | `therapy` | `/panchakarma/<x>`, `/therapies/<x>` | Abhyanga, shirodhara, the five karmas. | 2 | 2 |
| 8 | `hub` | `/herbs`, `/doshas`, `/formulations` | Cluster index. Children **derived from the manifest**, never hand-typed. | 4 | 1 |
| 9 | `pillar` | `/what-is-ayurveda` | The one T0 page. Own static route. | 1 | shipped |
| 10 | `reference` | `/about`, `/editorial-policy`, `/medical-disclaimer`, `/evidence-grades` | Trust furniture. Not health content. | 1 | **0 (blocking)** |

Plus two **capabilities that are not page types**:

| Capability | Surface | Why not a type |
|---|---|---|
| **Interactions** | `data/interactions/<herb>.json` → rendered as a block **inside** the herb page; later `/interactions/<herb>-and-<drug-class>` pages where evidence ∈ {A,B,C} | It is a **dataset joined into pages**, not a page. `teardown-interactions.md` §2.1: ship the per-herb block, **do not ship a consumer checker** — its default output ("no interactions found") is systematically misread as "safe", and MSKCC, the institution with the best data and the best reason to build one, publishes monographs instead. 🔴 **Backlog task #14 says "interactions checker" — recommend re-scoping to dataset + per-herb block. Abilash.** |
| **News / evidence feed** | `/news/<yyyy-mm-dd>-<slug>`, types `STUDY`/`REGULATORY`/`SAFETY` | Renders through the existing catch-all with **zero loader changes** — it is a content JSON with a `news` payload. But it is a *freshness engine*, not a content cluster: every item must name ≥1 `evergreenRefs` parent or be rejected. 🔴 **Go/no-go on committed physician capacity (~1 hr/week). If not committed, do not build it** — a stale evidence desk advertises abandonment on the one axis where the incumbents are weak (NCCIH's in-depth page: last updated Jan 2019). |

**Retyping the existing 20** (`architecture-audit.md` §5.1): `herbs/*` → `herb` (except `triphala` → `formulation`, keeping its URL); `herbs`/`doshas`/`panchakarma`/`diet` → `hub`; `what-is-ayurveda` → `pillar`; `about` → `reference`; `faq` → `question`; `doshas/*`, `lifestyle/*`, `is-ayurveda-scientific`, `history-of-ayurveda`, `diet/eating-by-dosha` → `concept`.

> **Triphala is a formulation, not a herb.** It ships today at `/herbs/triphala` and ranks (14.8K US / 74K IN). Per BUILD DECISION MATRIX rule 2 — content-rich ranking pages are never redirected — **keep the URL, change the type**, render with the formulation template, and list it on both `/herbs` and `/formulations`. Its three components (amla, haritaki, bibhitaki) become its `ingredients[]` spokes. This is the cleanest hub-and-spoke demo in the corpus and it costs one field.

### 1.2 The interlink model — derived, not hand-typed

Today there is **no related-links renderer at all**. `article.tsx`'s header comment claims "sibling links"; in reality siblings are hand-typed Markdown inside `body` prose (ashwagandha §4 links triphala/brahmi/turmeric by hand). At 18 pages that is fine. At 500 it is link-rot, the #1 failure mode of a large corpus.

**Law: an edge is either derived from data or it is a lint failure.** Three of the six edge classes are derivable from primary sources (`teardown-texts-concepts.md` §6), which means they regenerate instead of rotting:

```
                        ┌──────────────── PILLAR /what-is-ayurveda ────────────────┐
                        │                                                          │
                   HUB /herbs                                              HUB /formulations
                        │  (children[] ← manifest)                                 │  (children[] ← manifest)
                        ▼                                                          ▼
              HERB /herbs/ashwagandha ◄──── ingredients[].slug ────── FORMULATION /formulations/ashwagandhadyarishta
                    │       ▲                                                      ▲
    apiRef          │       │ crossLinks.herbPage                                  │ API field 9
    (1:1)           │       │                                                      │ IMPORTANT FORMULATIONS
                    ▼       │                                                      │
         PHARMACOPOEIA /api/asvagandha ──────────────────────────────────────────┘
                    │
                    │ API field 8 "PROPERTIES AND ACTION"  ── derived edge ──►  CONCEPT /concepts/rasa#tikta
                    │                                                            CONCEPT /concepts/virya#usna
                    │                                                            CONCEPT /concepts/karma#rasayana
                    │
                    │ API Appendix-7 "Classical Ayurvedic References" ── derived edge ──►  TEXT /texts/charaka-samhita
                    │                                                                            │
                    │                                                                            │ firstSchedule.serialNo
                    │                                                                            ▼
                    │                                                                     Drugs & Cosmetics Act 1940
                    │
              CONDITION /conditions/anxiety ── interventions[].href ──► HERB /herbs/ashwagandha
                    │                                                   (evidence grade + harmNote per row)
                    │
              NEWS /news/2026-07-15-... ── evergreenRefs[] ──► HERB /herbs/ashwagandha
                                                                (reciprocal "Latest evidence" block, SAME PR)
```

| Edge | Source | Derived? |
|---|---|---|
| hub → children | `_manifest.json` (generated + CI-validated) | ✅ |
| pharmacopoeia → concept | **API field 8** (Rasa/Guna/Virya/Vipaka/Karma) | ✅ — this is the single highest-value structural insight in the whole research pass |
| pharmacopoeia → text | **API Appendix-7** | ✅ |
| text → statute | **First Schedule serial no.** | ✅ |
| herb ↔ formulation | `ingredients[].slug` / API field 9 | ✅ |
| herb ↔ herb (siblings) | `related[]`, authored, **bounded 2–4** | ❌ authored, lint-checked |
| condition → herb | `interventions[].href` | ❌ authored, **must resolve or block** |
| news → evergreen | `evergreenRefs[]` + reciprocal backlink | ❌ authored, **both directions asserted at build** |

**`crossLinks.derivedFrom` records provenance on every edge** so the graph is auditable and regenerable. `_manifest.json` — today "a lie waiting to happen" (read by no code, filtered out by the loader) — becomes the generated, CI-validated index the loader actually uses, and the source for hub children, A–Z ladders, and nav. That kills the hard-coded home/nav problem (`architecture-audit.md` §2.5) and makes "new clusters are content, not code" true instead of aspirational.

### 1.3 The one split that must not be merged

**`/herbs/ashwagandha` and `/api/asvagandha` are different pages and stay different pages.** The herb page is reader-facing, evidence-led, NCCIH-shaped. The API page is the statutory standards record — verbatim field order, ash limits, assay, `THERAPEUTIC USES` in Sanskrit under its own label. Merging them is exactly how an ash-limit ends up next to a "benefits" list and a statutory list of traditional indications becomes a health claim. They cross-link 1:1; they never merge. This split is also what makes volume tractable: the API side is largely mechanical transformation of a fixed source; the evidence side is where physician review is spent.

---

## 2 · PER-TYPE JSON SCHEMA

### 2.0 Grounding — today's complete schema, verbatim

`app/lib/content.ts` lines 8–26. This is the entire schema; nothing else defines a field.

```ts
export type Citation = { n: number; text: string; url?: string };
export type Section = { h2: string; capsule: string; body: string };
export type Faq = { q: string; a: string };
export type Crumb = { name: string; url: string };

export type Page = {
  slug: string;
  title: string;
  metaDescription: string;
  h1?: string;
  breadcrumb?: Crumb[];
  answerCapsule: string;
  sections: Section[];
  faqs?: Faq[];
  citations?: Citation[];
  routesTo?: string[];
  clinical: boolean;
  register_ok: "ok" | "review";
};
```

**Design rule for every delta below: EXTEND, NEVER FORK.** Every new block is optional at the type level so the 20 live files stay valid; enforcement moves to lint, per-type (§2.7). The catch-all route, `pageMetadata`, `sitemap.ts` and `llms.txt` keep working throughout.

**Rule 6 corollary:** a missing block is **absent**, never guessed. Absence is honest; a fabricated field is not.

### 2.1 🔴 Four conflicts in the research pass, resolved here

The teardowns were written in parallel and disagree. A builder cannot execute four scales. Resolving now, as lead architect:

| # | Conflict | Ruling |
|---|---|---|
| **C1** | **Four different evidence scales.** herb-monograph §1.5(a): `strong/moderate/preliminary/traditional-only/evidence-of-no-effect/evidence-of-harm`. condition §4.2: `traditional-only/insufficient/preliminary/mixed/promising-limited/no-benefit/harmful`. aeo-geo §9.1: `no-human-trials/preliminary/mixed/moderate/strong`. regulatory-news §3.1: `preliminary/limited/moderate/strong`. | **ONE scale, `wia-evidence-v1`, 8 values, grading the EVIDENCE not the efficacy** (§2.2). Superset of all four. Published in full at `/evidence-grades` **before any grade renders**. |
| **C2** | **Discriminant field name.** herb-monograph + condition + texts-concepts say `pageType`; architecture-audit says `type`. | **`type`.** Shorter, and it is the audit's recommendation — the audit is the doc that read the loader. |
| **C3** | **Review-date field name.** `reviewedOn` (aeo-geo, condition, eeat) vs `review.lastReviewed` (herb-monograph) vs `reviewed_on` (interactions, snake_case). | **`review: { reviewerKey, reviewedOn, nextReviewDue, signOff, scope }`** — camelCase, nested, on the **base** type. Matches the repo's existing camelCase (`answerCapsule`, `metaDescription`). |
| **C4** | **Reviewer name on historical items.** `MEDICAL_REVIEW.current` renders the *current* reviewer's name on *past* reviews — a 2028 head silently re-attributed to a 2026 review. (`teardown-regulatory-news.md` §13 Q3 raises this; `medical-review.ts`'s comment shows it was not considered.) | **Dated roster; resolve name-at-review-date.** `MEDICAL_REVIEW.reviewers[key]` + `currentHeadKey`. `review.reviewerKey` freezes *which* physician, config supplies *who that is* — both properties preserved (one-line head change AND honest history). This is option (b) in that doc; adopting it. |

### 2.2 Shared sub-types (used by every page type)

```ts
// ─── THE EVIDENCE SCALE — C1 resolution ────────────────────────────────
/** wia-evidence-v1. Grades the EVIDENCE, not the efficacy.
 *  Rationale (teardown-herb-monograph §1.5): Examine's A–F efficacy grades are
 *  defensible because they run a research team and a documented composite.
 *  We cannot credibly clone that at volume, and pretending to would be exactly
 *  the dishonesty this site opposes. Grading the evidence is verifiable from
 *  study counts and designs, is not a clinical judgement, and states its own
 *  limit IN THE GRADE NAME. `traditional-only` is a label no competitor has and
 *  most of the pharmacopoeia honestly needs.
 *  MUST be published at /evidence-grades before any grade renders. */
export type EvidenceGrade =
  | "traditional-only"   // classical use recorded; no human trials worth citing
  | "insufficient"       // trials exist; too few/small/poor to conclude ← the honest default
  | "preliminary"        // small RCTs suggest possible benefit; not settled
  | "mixed"              // trials disagree
  | "moderate"           // multiple adequately-powered RCTs, mostly consistent
  | "strong"             // consistent, well-powered, replicated
  | "no-benefit"         // adequately studied; does not work — WE PUBLISH THESE
  | "harmful";           // evidence of harm; rendered as a warning, never an option

// ─── CITATIONS — extended from {n,text,url} ────────────────────────────
export type SourceType =
  | "meta-analysis" | "systematic-review" | "rct" | "cohort" | "observational"
  | "case-report" | "in-vitro" | "animal" | "narrative-review"
  | "guideline" | "gov-authority"     // NCCIH, ODS, WHO, FDA, AYUSH, LiverTox
  | "pharmacopoeia"                    // API
  | "classical-text"                   // authoritative for what the TRADITION claims, never for efficacy
  | "regulatory";

export type Citation = {
  n: number;
  text: string;
  url?: string;
  type: SourceType;          // NEW, required — enables grading + "2023 RCT, n=60" rendering
  primary: boolean;          // NEW, required — primary literature vs secondary summary
  year?: number;
  n_participants?: number;   // kills "missing specifications" (Tier-A OR 8.63–243)
  publisher?: string;        // "NCCIH" | "JAMA" | "NIDDK"
  pmid?: string;
  doi?: string;
  industryFunded?: boolean;  // honesty field — surfaced in prose, never hidden
  accessed?: string;         // ISO — when we last resolved this URL
  archived?: string;         // archive.org snapshot (gov URLs rot aggressively)
};

export type Cite = { ref: number; note?: string };   // ref → Citation.n; note = locator, e.g. "API Vol I, p.20"
export type Sourced = { value: string; cites: Cite[]; confidence?: "established" | "contested" | "single-source" };

// ─── PROVENANCE — C3 + C4 resolution ───────────────────────────────────
export type Review = {
  reviewerKey: string;       // → MEDICAL_REVIEW.reviewers — NEVER a literal name
  reviewedOn: string;        // ISO. A REAL review event. NEVER the build date.
  nextReviewDue: string;     // ISO. 12mo default; 6mo for high-traffic/high-risk
  signOff: "approved" | "pending";   // "pending" ⇒ page CANNOT ship
  scope?: string;            // what was actually checked
};

export type UpdateEntry = {
  date: string;
  kind: "major" | "minor" | "correction";   // `correction` is a trust signal BECAUSE it admits error in public
  note: string;
  byKey?: string;
};

export type Author = { key: string; anchor: string };   // → roster config; NEVER free text

// ─── AEO/GEO — mandatory on every type, see §4b ─────────────────────────
export type Entity = {
  canonicalName: string;                 // "Withania somnifera"
  sameAs: string[];                      // ≥1 Wikidata URI. THE disambiguation lever.
  kind: "herb" | "formulation" | "condition" | "therapy" | "concept" | "text";
  alsoKnownAs?: string[];
  notToBeConfusedWith?: { name: string; why: string }[];   // brahmi = Bacopa OR Centella. State it.
};

export type Section = {
  h2: string;
  capsule: string;              // GATED: 40–80 words, self-contained, no anaphora
  body: string;
  anchor?: string;              // stable ("evidence", "medical-reviewer") — NOT `s-${i}`
  kind?: SectionKind;           // undefined ⇒ "generic" (back-compat for the 20 live files)
  answersQuestion: string;      // NEW, REQUIRED. The query-fan-out target. Must end "?".
  citationRefs?: number[];      // ≥1 per section making an efficacy claim on a clinical page
};
```

### 2.3 The BASE page type — delta from today

```ts
export type PageType =
  | "pillar" | "hub" | "index" | "herb" | "formulation" | "therapy"
  | "condition" | "concept" | "classical-text" | "pharmacopoeia"
  | "glossary" | "question" | "reference" | "news";

export type BasePage = {
  // ─── UNCHANGED from today ──────────────────────────────────────────
  slug: string;
  title: string;
  metaDescription: string;
  breadcrumb?: Crumb[];
  answerCapsule: string;        // now GATED: 40–80 words, self-contained, names the entity in sentence 1
  sections: Section[];
  faqs?: Faq[];
  routesTo?: string[];
  clinical: boolean;            // MEANING CHANGES → see below

  // ─── CHANGED ────────────────────────────────────────────────────────
  h1: string;                   // was h1? — 19/20 today; herbs__ashwagandha.json has none and
                                //   silently renders the 60-char SEO title as its H1. Optionality
                                //   is ALREADY causing a defect. Make it required.
  citations: Citation[];        // was citations? — required; ≥3 when healthTopic==="clinical", ≥1 primary
  register_ok: "ok" | "review"; // was DEAD (grep: only the type declaration). MUST gate the build.

  // ─── NEW: the keystone ──────────────────────────────────────────────
  type: PageType;               // REQUIRED. NO DEFAULT. Never inferred from filename.

  // ─── NEW: healthTopic splits the overloaded `clinical` boolean ──────
  /** `clinical` today means BOTH "is this a health claim?" AND "does this need
   *  a physician?" — one boolean cannot carry both questions (teardown-eeat F10).
   *  Consequence today: /diet/eating-by-dosha and /lifestyle/dinacharya carry
   *  NO review furniture at all, though dietary + daily-regimen advice is YMYL
   *  Health under QRG §2.3.
   *    none     → Article, no review furniture        (/about, /history-of-ayurveda)
   *    wellness → dated review + disclaimer, no physician sign-off required
   *               (/doshas/*, /lifestyle/*, /diet/*)
   *    clinical → full furniture + physician sign-off + citation minimum
   *               (/herbs/*, /formulations/*, /conditions/*, /panchakarma/*) */
  healthTopic: "none" | "wellness" | "clinical";
  /** `clinical` is RETAINED for back-compat but its meaning narrows to the
   *  physician-gate flag (CLAUDE.md rule 7): `clinical: true` mechanically means
   *  "the reviewing physician signed THIS file." It no longer selects the
   *  template — `type` does, via SCHEMA_BY_TYPE. */

  // ─── NEW: provenance (fixes the site's worst defect — §4 F1) ────────
  review?: Review;              // REQUIRED when healthTopic !== "none"
  author: Author;               // REQUIRED — kills the anonymous byline (F2)
  publishedOn: string;          // ISO, real, per page
  updatedOn: string;            // ISO, real, per page
  updateHistory?: UpdateEntry[];

  // ─── NEW: AEO/GEO (§4b) ─────────────────────────────────────────────
  entity?: Entity;              // REQUIRED for herb|formulation|condition|therapy|concept|classical-text
  comparedWith?: { name: string; slug?: string; difference: string }[];

  // ─── NEW: linking ───────────────────────────────────────────────────
  related?: { slug: string; label: string; derivedFrom?: string }[];   // bounded 2–4; every slug must resolve
  children?: string[];          // hub/index only — GENERATED from _manifest.json, never hand-typed
  aliases?: string[];
  locale: string;               // "en". Site is locales:["en"]; inLanguage is hard-coded today. 🔴 Q6.
  noindex?: boolean;
  tags?: string[];

  // ─── NEW: disclosure (§4 F5) ────────────────────────────────────────
  commercialInterest?: "kappl" | "ktahv" | "villa-raag" | null;
  disclaimer: "general" | "herb-safety" | "therapy-safety" | "condition-safety";
};

export type Page =
  | HerbPage | FormulationPage | ConditionPage | ConceptPage
  | ClassicalTextPage | PharmacopoeiaPage | TherapyPage
  | HubPage | PillarPage | ReferencePage | NewsPage;
```

**Delta summary — base type:**

| | Field | Change |
|---|---|---|
| ➕ | `type` | NEW, required, no default — **the keystone** |
| ➕ | `healthTopic` | NEW, required — splits the overloaded `clinical` |
| ➕ | `review{}` | NEW — fixes the hard-coded `REVIEWED` constant (the #1 defect, flagged by 4 of 8 teardowns independently) |
| ➕ | `author` | NEW, required — `/about` promises named authors; no page can have one today |
| ➕ | `publishedOn` / `updatedOn` / `updateHistory[]` | NEW, real per-page dates |
| ➕ | `entity{}` | NEW — Wikidata `sameAs`; the cheapest unclaimed AEO win on the board |
| ➕ | `related[]` / `children[]` | NEW — no related-links renderer exists today |
| ➕ | `commercialInterest` / `disclaimer` | NEW — drives the COI disclosure block |
| ➕ | `locale` / `aliases[]` / `noindex` / `tags[]` | NEW |
| 🔄 | `h1` | `h1?` → `h1` (required) |
| 🔄 | `citations` | `citations?: {n,text,url}[]` → required, `+type +primary +year +pmid +doi +industryFunded +archived` |
| 🔄 | `register_ok` | dead field → **build gate** |
| 🔄 | `clinical` | template switch → physician-gate flag only |
| 🔄 | `Section` | `{h2,capsule,body}` → `+anchor +kind +answersQuestion +citationRefs` |
| 🔄 | `answerCapsule` | ungated → gated 40–80w, self-contained, entity-first |
| ✅ | `slug`, `title`, `metaDescription`, `breadcrumb`, `sections`, `faqs`, `routesTo` | unchanged |

### 2.4 `herb` — the scaling unit

```ts
export type HerbPage = BasePage & {
  type: "herb";
  herb: {
    // §1.1 Overview
    oneLiner: string;                    // ≤15 words — cards, hubs, llms.txt, schema description
    mainBenefits: Sourced[];
    mainDrawbacks: Sourced[];            // REQUIRED, NON-EMPTY. The structural guarantee we cannot
                                         //   ship a puff page. Peer of mainBenefits, not a caveat.
    bottomLine: string;                  // NIH ODS "Implications for use" — the honest so-what,
                                         //   INCLUDING why we can't tell you more

    // §1.2 Botanical + nomenclature (entity disambiguation + India long-tail)
    botanical: {
      latin: string;                     // incl. authority: "Withania somnifera (L.) Dunal"
      family: string;
      synonymsLatin?: string[];
      partsUsed: ("root"|"leaf"|"fruit"|"seed"|"bark"|"whole-plant"|"resin"|"rhizome")[];  // REQUIRED
                                         //   — drives everything else; root ≠ leaf pharmacology
      description?: string;
      nativeRange?: string[];
      cultivatedIn?: string[];
    };
    names: {
      sanskrit: { iast: string; devanagari: string; meaning?: string; cites?: Cite[] }[];
      regional?: { lang: "ml"|"hi"|"ta"|"te"|"kn"|"bn"|"mr"|"gu"|"or"|"pa"|"ks"|"as"|"ur";
                   script: string; roman: string }[];
      english?: string[];
      misleadingNames?: { name: string; whyMisleading: string }[];   // "Indian ginseng — not a ginseng"
    };
    chemistry?: { keyConstituents?: { name: string; class: string; cites: Cite[] }[];
                  markerCompound?: string };

    // §1.3 Traditional Ayurvedic profile — THE MOAT
    ayurveda: {
      rasa: { iast: string; gloss: string; conceptRef: string }[];
      guna: { iast: string; gloss: string; conceptRef: string }[];
      virya: { iast: string; gloss: string; conceptRef: string };
      vipaka: { iast: string; gloss: string; conceptRef: string };
      prabhava?: Sourced | null;         // NULLABLE — most dravyas have none. DO NOT INVENT ONE.
      doshaKarma: { vata: "↓"|"↑"|"—"; pitta: "↓"|"↑"|"—"; kapha: "↓"|"↑"|"—"; cites: Cite[] };
      karma: { iast: string; gloss: string; conceptRef: string; cites: Cite[] }[];   // gloss REQUIRED —
                                         //   untranslated Sanskrit is not authority, it's fog
      classicalSources: { textId: string; locus: string; ref: number }[];
      apiListed: boolean;
      apiRef?: { part: string; volume: string; monographNo: number; page: string; slug: string };
      epistemicNote: string;             // REQUIRED, NON-EMPTY. The standing caveat. See §2.4.1.
      cites: Cite[];
    };

    // §1.4 Traditional uses
    traditionalUses: { use: string; context: string; cites: Cite[];
                       testedModernly: boolean; evidenceRef?: string; neverTested?: boolean }[];
    formulationsContaining?: { name: string; slug: string; role: "principal"|"adjuvant"|"anupana" }[];
    traditionalContext: string;          // REQUIRED. Examine's own concession, which they cannot fill:
                                         //   single-herb use is a WESTERN SUPPLEMENT pattern, not how
                                         //   Ayurveda prescribes. Saying so is honest AND differentiating.

    // §1.5 Modern evidence — graded PER OUTCOME, never per herb
    evidence: {
      snapshot: { referenceCount: number; trialCount?: number; metaAnalysisCount?: number;
                  participantsTotal?: number; largestTrialN?: number; longestTrialWeeks?: number;
                  asOf: string };
      gradeScaleVersion: "wia-evidence-v1";           // → /evidence-grades, public before any grade renders
      outcomes: {
        id: string;
        outcome: string;
        category: "stress"|"sleep"|"cognition"|"hormonal"|"fitness"|"cardiometabolic"|"immune"|"other";
        grade: EvidenceGrade;
        direction: "decrease"|"increase"|"mixed"|"none";
        magnitude?: "small"|"moderate"|"large"|"unclear";
        interpretation?: "improvement"|"detriment"|"context-dependent";
        studyCount?: number; participants?: number;
        designs: SourceType[];
        consistency?: "consistent"|"mostly-consistent"|"inconsistent";
        durationRangeWeeks?: [number, number];
        populations?: string;
        industryFunded: "some"|"all"|"none"|"unclear";   // ← OUR SHARPEST HONEST EDGE. Nobody surfaces
                                         //   funding per outcome row, in the table, on the page.
                                         //   Costs us nothing — we fund no studies.
        limits: string;                  // REQUIRED
        cites: Cite[];                   // REQUIRED, ≥1
      }[];
      notStudiedFor: string[];           // REQUIRED — publishing the ABSENCE of evidence as content
      evidenceCaveat: string;            // REQUIRED
    };

    // §1.6 Mechanisms
    mechanisms?: { claim: string; evidenceType: "human"|"animal"|"in-vitro"|"hypothesis";
                   translationCaveat?: string;   // REQUIRED when evidenceType !== "human"
                   cites: Cite[] }[];

    // §1.7 Forms & dosage — descriptive, NEVER prescriptive
    forms: { form: string; tradition: "classical"|"modern"; description: string }[];
    dosage: {
      studiedRanges: { form: string; amount: string; unit: string; frequency?: string;
                       durationWeeks?: number; outcomeId?: string; cites: Cite[] }[];
      classicalDosage?: Sourced;         // SEPARATE FIELD, separately labelled. NEVER merged with
                                         //   studiedRanges — that fusion is the #1 sin of supplement copy.
      standardization?: { marker: string; rangeStudiedPct: [number, number]; note: string; cites: Cite[] };
      anupana?: Sourced[];               // the traditional vehicle. Nobody else has this.
      noRecommendation: string;          // REQUIRED — we report what was studied; we do not dose you
      disclaimerRef: string;             // rendered INLINE in the dosage H2 (Examine's placement), not in a footer
    };

    // §1.8 Safety
    safety: {
      summary: string[];                                                        // REQUIRED, ≥1
      sideEffects: { effect: string; frequency: "common"|"less-common"|"case-report";
                     route: string; severity: "mild"|"moderate"|"severe";
                     notes?: string; cites: Cite[] }[];
      contraindications: { condition: string; strength: "avoid"|"caution"|"monitor";
                           reason: string; cites: Cite[] }[];
      pregnancy: { status: "avoid"|"insufficient-data"|"likely-safe"; rationale: string; cites: Cite[] };  // REQUIRED
      lactation: { status: "avoid"|"insufficient-data"|"likely-safe"; rationale: string; cites: Cite[] };  // REQUIRED
      preSurgery: { stopBeforeDays: number | null; reason: string; cites: Cite[] };                        // REQUIRED
      populations?: { group: string; guidance: string; cites: Cite[] }[];
      longTermSafety: "unknown"|"limited"|"established";                        // REQUIRED
      wadaStatus?: "not-prohibited"|"prohibited"|"unknown";
      seriousRiskFlags?: { risk: string; frequency: string; signs: string;      // `signs` + `action` is the
                           action: string; cites: Cite[] }[];                  //   field that could protect someone
    };

    // §1.9 Interactions — joined from data/interactions/<herb>.json, NOT authored inline
    interactionsRef: string;             // "ashwagandha" → data/interactions/ashwagandha.json
    absenceStatement: string;            // REQUIRED, VERBATIM on every herb page. See §2.4.2.

    // §1.10 Quality / adulteration / heavy metals — the Ayurveda-specific section
    quality: {
      standardizationVariance?: { marker: string; observedRangePct: [number, number];
                                  note: string; cites: Cite[] };
      heavyMetalRisk: { level: "documented"|"theoretical"|"none-documented";
                        metals: string[]; evidence: string; cites: Cite[] };    // REQUIRED
      productClassRefs: string[];        // → data/product-classes.json. Contamination is a PRODUCT
                                         //   property, not a HERB property (teardown-interactions §0.3).
                                         //   Modelling it on the herb makes every page inherit a scary,
                                         //   imprecise, WRONG warning and loses the one useful thing we
                                         //   can say: WHICH CLASS OF PRODUCT TO AVOID.
      adulterants?: { substance: string; why: string; howToAvoid: string; cites: Cite[] }[];
      whatToLookFor: string[];           // REQUIRED. VENDOR-NEUTRAL — must be usable to evaluate a
                                         //   Kairali product AND REJECT IT.
      regulatoryStatus: { region: "US"|"EU"|"IN"; status: string; note: string; cites: Cite[] }[];
      commercialDisclosure?: string;     // REQUIRED when routesTo includes KAPPL. 🔴 §4 F5.
    };
  };
};
```

**§2.4.1 — the `epistemicNote` rule (the field that lets us publish the full traditional profile without it becoming a health claim).** Classical attributes are reported as **what the tradition says, attributed to a named text** — never as biomedical fact, never fused with the evidence section. The renderer **must** visually separate the `ayurveda` block from `evidence` (different container, explicit label: *"What the classical tradition says"*). Fusing tradition and evidence is what every low-quality Ayurveda site does; separating them cleanly is why we would be trusted.

**§2.4.2 — the `absenceStatement`, verbatim on every herb page, non-negotiable:**

> Most herb–drug combinations have never been studied. If a medicine is not listed here, that means we have no reliable record of it — not that the combination is safe.

Drugs.com's honest answer for ashwagandha interactions is literally *"None well documented."* — which means **not studied**, not **safe**. Conflating those two is dangerous. This field forces the distinction, and it is the load-bearing sentence of the entire interactions capability.

### 2.5 The remaining types (delta only)

```ts
export type FormulationPage = BasePage & {
  type: "formulation";
  formulation: {
    kalpanaClass: "churna"|"kwatha"|"arishta"|"asava"|"taila"|"ghrita"|"leha"|"vati"|"bhasma"|"rasa"|"other";
    classicalSource: { textId: string; locus: string; ref: number };
    ingredients: { herb: string; slug: string; part?: string; proportion?: string; role: "principal"|"adjuvant"|"anupana" }[];
    manufacture?: string;
    apiRef?: { part: string; volume: string; monographNo: number; slug: string };
    evidence: HerbPage["herb"]["evidence"];     // same shape — per-outcome, never per-formulation
    safety: HerbPage["herb"]["safety"];         // same shape
    quality: HerbPage["herb"]["quality"];       // same shape — bhasma/rasa classes are HIGH RISK here
    absenceStatement: string;
    traditionalContext: string;
  };
  // Educational ONLY. Buy → Shopify, NEVER on-site. No cart, no price, no CTA. (Factory Rules)
};

export type ConditionPage = BasePage & {
  type: "condition";
  condition: string;                  // "Generalized anxiety disorder" → about: MedicalCondition
  conditionAliases?: string[];
  riskTier: 1 | 2 | 3;                // gates review depth AND publishability — §2.5.1
  bottomLine: {                       // NCCIH trio — STRUCTURAL, not prose. Section 2, above everything.
    howMuchWeKnow: string;
    whatWeHaveLearned: string;
    whatWeKnowAboutSafety: string;
  };
  redFlags: { text: string; urgency: "emergency"|"same-day"|"soon" }[];   // ≥2. MUST render above interventions.
  conventionalCare: {
    summary: string;                  // ≤40 words, neutral — the standard of care we are NOT replacing
    outboundLinks: { label: string; url: string; publisher: string }[];   // ≥1, allowlisted publisher, 200
  };
  interventions: {
    name: string; botanical?: string;
    category: "herb"|"therapy"|"diet"|"lifestyle";
    href?: string;                    // REQUIRED for herb|therapy; MUST resolve
    traditionalUse: string;           // ≤40 words
    evidenceGrade: EvidenceGrade;
    evidenceNote: string;             // ≤60 words, cites [n]
    harmNote: string;                 // REQUIRED, NON-EMPTY — Mayo's benefit-and-harm-in-one-breath.
                                      //   Never a benefits list followed by a safety section.
    citations?: number[];
  }[];
  doNotRelyAlone: { body: string; delayHarm: string };   // ≤25 words. THE LAST CONTENT WORD.
  askYourDoctor?: string[];
  // NO DOSAGES ANYWHERE. Examine carries them; Examine does not sell the supplement. We do.
  // The COI asymmetry means we are stricter than our model.
};

export type ConceptPage = BasePage & {
  type: "concept";
  concept: {
    iast: string; devanagari: string;
    conceptClass: "dosha"|"dhatu"|"srotas"|"agni"|"ama"|"ojas"|"prakriti"|"pharmacology";
    oneLineGloss: string;
    traditionalView: { summary: string; attributes?: { name: string; gloss: string }[];
                       governs?: string[]; voice: "tradition" };    // renderer applies tradition-voice container
    classicalBasis: { textId: string; locus: string; quote?: string | null;
                      translationId?: string;   // lint L1: quote non-null ⟹ GREEN register entry
                      note?: string }[];        // REQUIRED ≥1 — a concept with no locus is not a concept
    contemporaryUse?: { summary: string; namasteCode?: string | null;
                        icd11Tm2?: { code: string; uri: string } | null;
                        icd11Caveat: "auto" };  // TM2 classifies TERMINOLOGY, not efficacy. Lint L3.
    evidence: {
      confidence: { level: "very-low"|"low"|"moderate"|"high"; statement: string; asOf: string };
      byOutcome: { outcome: string; direction: "supports"|"mixed"|"no-effect"|"against"|"untested";
                   grade: EvidenceGrade; summary: string; designs: SourceType[]; citationRefs: number[] }[];
      untestedNote?: string;          // lint L8: byOutcome non-empty OR untestedNote present
    };
    scientificReception: {            // REQUIRED — see §2.5.2
      summary: string;
      criticisms: { position: string; attributedTo: string; url: string; ourResponse: string }[];  // ≥1
      steelmanned: true;              // lint: strongest form of the criticism, never a strawman
    };
    weDoNotClaim: string[];           // the steward-voice signature block
    safety?: { redFlags: string[]; interactionsNote?: string | null };   // REQUIRED where the concept
                                      //   drives ingestion/therapy advice
    crossLinks: { concepts?: string[]; herbs?: string[]; treatments?: string[]; derivedFrom?: string };
  };
};

export type ClassicalTextPage = BasePage & {
  type: "classical-text";
  text: {
    commonName: string; iast: string; devanagari: string;
    statutoryName: string;            // VERBATIM from the First Schedule — incl. its misspellings
    statutorySpellingNote?: string | null;   // AH → "Statute prints 'Ashtanga Haridaya'." Footnote it;
                                      //   silently correcting a statute is a small lie.
    firstSchedule: {                  // REQUIRED — the differentiating fact nobody else publishes
      listed: boolean; serialNo: number | string; part: string;
      act: "Drugs and Cosmetics Act, 1940"; section: string;
      sourceUrl: string; note: string; scheduleHistory?: string;
    };
    authorship: { attributedTo: string; contested: boolean;
                  positions: { claim: string; attributedTo: string; citationRef: number }[] };
    dating: { compositionRange: string; redactionRange?: string; finalRecension?: string;
              basis: string; citationRef: number };                    // RANGES, never a single date
    structure: { unit: "sthana"|"khanda"; totalChapters: number;
                 divisions: { n: number; name: string; chapters: number; subject: string }[] };
    recension: { summary: string; variantNote: string; citationRef: number };   // REQUIRED — the
                                      //   anti-devotional field. A text page presenting a Samhita as a
                                      //   single stable authored book is FACTUALLY WRONG, and its
                                      //   wrongness is the exact tell of devotional-marketing content.
    commentaries?: { name: string; author: string; year: string; note?: string }[];
    translations: { translationId: string; translator: string; language: string; years: string;
                    licence: "public-domain"|"in-copyright"|"cc-by"|"cc-by-nc"|"cc-by-sa"|"cc-by-nc-nd"|"unknown";
                    licenceEvidence?: string; url?: string | null;
                    mayQuote: boolean; note?: string }[];              // licence is FIRST-CLASS
    relatedTexts?: { textId: string; relation: string; note?: string }[];
    whatItIsNot: string[];
    crossLinks: { concepts?: string[]; herbs?: string[]; pharmacopoeia?: string[] };
  };
};

export type PharmacopoeiaPage = BasePage & {
  type: "pharmacopoeia";
  // Mirrors the API's OWN field order 1:1. Fidelity to the source's field order and labels IS the design.
  pharmacopoeia: {
    standard: { name: string; part: string; volume: string; monographNo: number; publisher: string;
                firstScheduleSerialNo: string; legalNote: string; sourceUrl: string;
                sourceCaveat: string; licence: "govt-of-india-copyright";
                reproductionPolicy: "facts-and-limited-quotation" };
    officialName: string;             // Sanskrit = the OFFICIAL/LEGAL name (API General Notices)
    plantPart: string; botanicalName: string; family: string; legalNameNote: string;
    definition: string;
    synonyms: Record<"sanskrit"|"assamese"|"bengali"|"english"|"gujrati"|"hindi"|"kannada"|"kashmiri"
                    |"malayalam"|"marathi"|"oriya"|"punjabi"|"tamil"|"telugu"|"urdu", string[] | null>;
    description?: { macroscopic?: string; microscopic?: string };
    identityPurityStrength: { renderAs: "quality-control";
                              tests: { test: string; limit: string; appendix: string; note?: string }[];
                              explainerNote: string };   // QC spec — an ash-limit is NOT a health claim
    assay?: { requirement: string; methodSummary?: string };
    constituents: string[];
    propertiesAndAction: {            // API field 8 — THE CROSS-LINK SPINE
      rasa: { iast: string; conceptRef: string }[];
      guna: { iast: string; conceptRef: string }[];
      virya: { iast: string; conceptRef: string }[];
      vipaka: { iast: string; conceptRef: string }[];
      karma: { iast: string; conceptRef: string }[];
    };
    importantFormulations: { iast: string; ref: string | null }[];
    therapeuticUses: {                // ⚠️ THE SITE'S BIGGEST YMYL TRAP
      renderAs: "statutory-traditional-indications";
      renderUnderHeading: "Therapeutic uses (as listed in the API)";
      forbiddenHeadings: ["Benefits", "What it treats", "Uses", "Health benefits"];
      items: { iast: string; englishEquivalent: string | null; equivalentSource: string }[];
      qualifier: "REQUIRED"; qualifierText: string;      // non-dismissible. Lint L2.
    };
    dose: { text: string; note: string };
    classicalReferences: { textId: string; locus: string; source: string }[];   // ← API Appendix-7
    crossLinks: { herbPage: string; concepts: string[]; texts: string[] };
  };
};

export type NewsPage = BasePage & {
  type: "news";
  news: {
    newsType: "STUDY" | "REGULATORY" | "SAFETY";
    sourceTier: "A" | "B";            // Tier C/D can NEVER be an item's basis
    evidenceGrade?: EvidenceGrade;    // STUDY only — same wia-evidence-v1 scale (C1)
    studyMeta?: { design: string; participants?: number; trialsPooled?: number; comparator?: string;
                  registrationId?: string;   // absence is REPORTED, not hidden
                  funding?: string };        // disclosed always, including ours
    regulator?: string; jurisdiction?: string; affectedProducts?: string[];
    doesNotShow: string;              // MANDATORY, NON-EMPTY. The section that distinguishes us, and
                                      //   in practice our highest-value AEO surface — an LLM cannot
                                      //   get it from a press release.
    evergreenRefs: string[];          // MANDATORY, ≥1, every ref resolves. No orphan news items.
    archivedSources?: { url: string; archived: string }[];
    disclosure?: string;              // whenever a KAG entity is involved — inline, above the fold
  };
};

export type HubPage      = BasePage & { type: "hub"; children: string[] };   // GENERATED from _manifest.json
export type TherapyPage  = BasePage & { type: "therapy"; therapy: { /* Phase 2 */ } };
export type ReferencePage= BasePage & { type: "reference" };
export type PillarPage   = BasePage & { type: "pillar" };
```

**§2.5.1 — condition risk tiering** (gates review depth AND publishability):

| Tier | Conditions | Rule |
|---|---|---|
| **1 — low** | dandruff, mild dry skin, occasional constipation, general fatigue | Standard review. Harm of delay ≈ 0. |
| **2 — moderate** | anxiety, insomnia, hair fall, joint pain, IBS, acne, PCOS, migraine, mild hypertension | Named-physician review + `redFlags` + `doNotRelyAlone` mandatory. |
| **3 — high** | T1/T2 diabetes, heart disease, asthma, depression, thyroid, autoimmune, epilepsy, pregnancy-related, paediatric | **Sign-off logged as a file in the repo**, not a badge. `doNotRelyAlone` leads. **`routesTo` empty — no pathway module at all.** Interventions capped at `insufficient` unless a meta-analysis is cited. |
| **DO NOT PUBLISH** 🔴 | cancer, HIV, TB, fertility "treatment", COVID/infectious, "immunity boosting" as disease prevention, anything paediatric-dosing | **No page.** "Ayurvedic cure for cancer" is the highest-volume, highest-harm query in this niche. A page saying "there is no evidence, please do not delay oncology" is *ethically* the best page on the internet for that query — and it is *legally* a page owned by a company that sells Ayurvedic products, which changes how every regulator, journalist and plaintiff reads it. **Abilash + legal. Never part of a content sprint.** |

**§2.5.2 — why `scientificReception` is REQUIRED on every concept page.** Wikipedia's *Dosha* article says, bluntly: *"As the tenets of ayurvedic medicine have no basis in science, using the concept of dosha to diagnose or treat disease is pseudoscientific."* We cannot adopt that voice — we'd be a publisher asserting our own subject is pseudoscience. We equally cannot omit it: it is the highest-ranking neutral treatment of "dosha", it is what an informed reader has already read, and a page that dodges it is transparently a vendor's marketing arm. The steward voice is not "we rebut this" and not "we ignore this" — it is *"here is what the tradition holds, here is precisely what has and hasn't been tested, here is who disputes it and why, and here is what we, who make our living from this, will not claim."* **That last clause is the only thing on the site a competitor structurally cannot copy.** It is also the AEO play: an LLM asked "are doshas scientifically valid?" synthesises from sources that *engage* the question. Pages that dodge it are not retrieved for the query that actually gets asked.

### 2.6 Engine changes the schema forces (all in `architecture-audit.md` §6 order)

| # | Change | Why now |
|---|---|---|
| 1 | **Loader cache + slug index.** Module-level `Map<slug,Page>`; `pageBySlug` O(1). | `allPages()` runs 2N+3 times per build → **~2N² file reads**. 20 pages = ~860 reads (invisible). 500 = ~500,000. 3,400 = **~23,000,000** → multi-hour or OOM. **Blocks every scale plan. Cheap today, expensive later.** The one genuinely urgent item. |
| 2 | **`_manifest.json` becomes real** — generated by script, CI-validated (slug↔file↔type↔clinical agree), and the **source** for the loader index, hub `children[]`, A–Z ladders, and nav. | Today it is read by no code and filtered OUT by the loader (`!f.startsWith("_")`). Kills the hard-coded home/nav problem; makes "content, not code" true. |
| 3 | **Split `article.tsx`** → `ArticleShell` (breadcrumbs, byline, JSON-LD, FAQ, citations, pathway, sticky CTA — type-agnostic) + `TEMPLATES: Record<PageType, Component>`. | 184 lines is the only template. Every later cluster depends on this. |
| 4 | **New renderers:** `<NamesBlock>` `<DravyagunaTable>` `<EvidenceTiers>` `<SafetyBlock>` `<InteractionsTable>` `<ClassicalRefs>` `<IngredientList>` `<RelatedLinks>` `<HubChildren>` `<AZLadder>` `<EvidenceBox>` `<DisclosureBlock>` `<UpdateHistory>` `<BottomLineTrio>` `<RedFlagCallout>`. | Typed blocks render as components, not hand-typed Markdown tables — today's dravyaguna-style tables would be prose: unqueryable, unlintable, un-schema-able. |
| 5 | **`SCHEMA_BY_TYPE` map** replaces the `clinical ?` ternary. | §4b.3. |
| 6 | **New `packages/schema` builders:** `collectionPage`, `itemList`, `definedTerm`, `newsArticle`, `substance`, `dietarySupplement`, `book`. Extend `medicalWebPage()` with `author`, `publisher`, `datePublished`, `dateModified`, `citation[]`, `medicalAudience`, `about`, and `reviewedBy` as an **array**. | Factory rule: built only from `packages/*`. `medicalWebPage()` today emits **no author, no publisher, no dates** — on the 11 clinical pages that need them most. |
| 7 | **Stable anchors.** `<h2 id={section.anchor ?? \`s-${i}\`}>`. | `#s-4` is meaningless to a human, a citation, or an answer engine; inserting a section silently repoints every deep link below it. |
| 8 | **Citation anchors + numbering.** Render `<ol>` with explicit `value={c.n}`; body markers link to `#ref-{n}`. | Today the `<ol>` uses browser numbering and ignores `c.n`. Contiguous today, so it matches — but `n: [1,3,5]` would render 1,2,3 and **silently mis-map every marker**. |
| 9 | **Sitemap:** priority by `type` (pillar 1.0 > hub 0.9 > monograph 0.7 > facet 0.5); `lastModified` from per-page `updatedOn`, **not `new Date()`**. | Today every URL claims "modified now" on every deploy — a real freshness-signal defect, on the one factor that is a *universal gatekeeper*. |
| 10 | **llms.txt curation** — hubs + pillar + top monographs, or per-cluster. | Today it lists *every* page with its full metaDescription. Unusable at volume. (Low priority — §4b.6.) |
| 11 | **Citations: drop `rel="nofollow"`.** | `article.tsx:170` nofollows outbound links to nccih.nih.gov / PubMed / JAMA. Buys nothing; slightly undercuts "we cite real sources". Free to fix. |

### 2.7 Content lint — the honest-YMYL gate (today: zero)

`packages/compliance` (`src/lint.js`, `src/rules.js`) is the natural home. **CI-blocking. Per doctrine (g), a failing gate is NEVER fixed by weakening it.**

**Structural**
1. JSON conforms to its `type`'s schema. `type` present and ∈ enum.
2. `h1` present. `slug` unique. Every `related[]`/`breadcrumb`/`children[]`/internal Markdown link resolves to a real slug. **Link-rot is the #1 failure mode of a large corpus.**
3. `citations[].n` contiguous; every body `[n]` marker resolves and vice versa; every `citations[].url` returns 200 (weekly QA rotation).
4. `routesTo` values ∈ `PATHWAYS` keys (today an untyped `string[]` — a typo silently renders nothing).

**Herb / formulation**
5. `mainDrawbacks[]` non-empty. `notStudiedFor[]` present. **Not every outcome `moderate`/`strong`** — a monograph where everything works is a lint failure.
6. Every `outcomes[]`, `mechanisms[]`, `interactions.*`, `safety.*` row has ≥1 `cites`. **No uncited health claims, ever.**
7. `safety.pregnancy` / `lactation` / `preSurgery` / `longTermSafety` present. Explicit `insufficient-data` allowed; **silence is not.**
8. `dosage.studiedRanges[]` never rendered without form + marker % + duration + population.
9. `ayurveda.epistemicNote` non-empty; every `ayurveda.karma[].gloss` non-empty.
10. `routesTo` ⊇ KAPPL ⟹ `quality.commercialDisclosure` non-empty.

**Condition**
11. Sections of kind `bottom-line`, `what-is`, `red-flags`, `ayurvedic-view`, `evidence`, `safety`, `do-not-rely-alone` ALL present.
12. **DOM order: `red-flags` index < every `interventions` index.** The guardrail outranks the content it guards.
13. `do-not-rely-alone` is the last non-generic content section; pathway renders after it.
14. `redFlags.length ≥ 2`; ≥1 `emergency`|`same-day` for riskTier ≥ 2.
15. Every `Intervention.harmNote` non-empty; every herb/therapy `href` resolves.
16. **Distribution check:** if no intervention is graded `traditional-only`|`insufficient`|`no-benefit` → **warn loudly → human review. A page where everything works is a page that is selling.**
17. **No dose patterns** `/\d+\s?(mg|g|ml|tsp|tbsp)/i` in any condition-page field.
18. riskTier 3 ⟹ sign-off file exists at `docs/whatisayurveda-research/signoffs/<slug>.md` **and** `routesTo` empty.
19. Slug not on the DO-NOT-PUBLISH list.

**Claims (YMYL + Indian law)**
20. **DMR Schedule list × cure/treat/prevent/remedy verbs → hard fail.** The Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954 prohibits advertising a remedy for any Schedule disease — cancer, diabetes, heart disease, BP, epilepsy, paralysis, obesity, TB, sterility, insanity, rheumatism, fever (general), female diseases (general)… Cognizable; up to 6 months' imprisonment on first conviction. **The site is educational, not advertising — that is the defence, and F5 (§4) is exactly what erodes it.**
21. Banned verbs near any condition noun: `cure`, `cures`, `treats`, `heals`, `prevents`, `reverses`, `permanent relief`, `guaranteed`, `miracle`, `remedy for`, `root cause` (as biomedical causation), `no side effects`, `completely safe`, `100% natural therefore safe`, `detox` (as a physiological claim), `clinically proven`, `breakthrough`, `science finally confirms`, `ancient wisdom validated`.
22. 🔴 **The lint MUST be negation-aware.** `reusable-content-map.md` §3.3: the Healing Secrets booklet contains *"is not a cure for cancer; it is designed to work alongside the care of your treating medical team"* — **exemplary honest drafting that a naive lint flags.** Train reviewers to click past the one lint that matters most and the lint is worse than nothing. Negation-aware, or an allowlist with a recorded reason. Never weakened.
23. 🔴 **Every banned-word scan MUST validate against a known-present control word before its zero is believed.** Same doc §3.4: the first scan returned **0 hits — a false negative**; `[[:<:]]` word-boundary syntax silently fails under this machine's `grep` (it is `ugrep`). The control word "ayurveda" also returned 0, which is what exposed it. A second attempt over-matched, counting "**spa**sm" as "spa". **A silently-broken banned-word lint reporting "clean" is worse than no lint.**
24. **No Kairali entity named in main content** (KAPPL / Kairali Ayurvedic Products / WHO-GMP / KTAHV / Healing Village) — allowed **only** inside the `pathway` aside. §4 F5.
25. **NCCIH non-endorsement:** no NCCIH citation inside, or in the block immediately adjacent to, any commercial CTA module. NCCIH's own policy forbids using its information to suggest endorsement of a commercial product; we are a commercial publisher. 🔴 Ratify.
26. Vagueness lint: fail on `may possibly`, `some people find`, `more research is needed` **unless** a specific number appears in the same section. **Bans vagueness, not honesty.** §4b.2.

**Governance**
27. `review.reviewedOn` present on every `healthTopic !== "none"` page; ISO; **not in the future**; **not equal to the build date** unless a real review happened that day; ≤365 days old (warn at 300); ≤24 months = hard fail on clinical.
28. `review.signOff === "approved"` and `register_ok === "ok"` or the page does not ship.
29. **No literal physician name anywhere in content JSON** (`grep -rL` across `content/`). Reviewer is config. Today: `about.json` hardcodes "Dr. Deepu John" **6×**, `faq.json` **1×**, and `llms.txt/route.ts` **1×**.
30. `classicalBasis[].quote` non-null ⟹ `translationId` resolves to a **GREEN** licence-register entry. **Block otherwise.**
31. `therapeuticUses` present ⟹ `qualifier: "REQUIRED"` and heading ∉ `forbiddenHeadings`.
32. `icd11Tm2` present ⟹ `icd11Caveat` rendered; no page asserts WHO/ICD endorsement of efficacy.
33. `type: "concept"` ⟹ `scientificReception.criticisms.length ≥ 1` **and** `steelmanned: true`.
34. `slug.startsWith("/news/")` ⟹ `news.doesNotShow` non-empty, `news.evergreenRefs.length ≥ 1`, every ref resolves, **and** each ref carries a reciprocal "Latest evidence" block referencing this item. Both directions asserted at build.
35. **Source denylist:** no citation to WebMD/RxList supplement monographs, supplement retailers, `actizeet.in`, `supersonicfood.com`, `nutrawiki.org`, `droracle.ai`, or similar. **The failure mode for this site is not fabrication — it is *laundering* a supplement blog's claim into a cited-looking safety statement.** (This is how the triphala-antiplatelet myth propagates.)

> **Note the lint scope boundary.** This is *additive to*, not a replacement for, the KTAHV clinical-lock — and **the KTAHV banned-word list does NOT apply here.** whatisayurveda is group/educational register per CLAUDE.md. Do not cross-apply. ("spa", "resort", "luxury", "journey", "guests" are not banned on this site; "cure"/"treats"/"heals" are, for different reasons.)

---

## 3 · PRIORITIZED BUILD ORDER

### 3.1 THE FIRST CLUSTER IS **HERB MONOGRAPHS**

**Justified only by the seven single-term volumes the quarantine note explicitly re-verified.** No cluster totals — see §0.

| Verified single-term (DataForSEO, 2026-07-15, re-tested after the audit) | US/mo | India/mo |
|---|---:|---:|
| **ashwagandha** | **673,000** | **301,000** |
| **turmeric** (NOT "turmeric curcumin" — that seed understated it **11×**) | **301,000** | — |
| **moringa** | **201,000** | — |
| **shilajit** | 0 *(data fault — US pull unreliable for this term)* | **246,000** |
| **amla** (NOT "amla amalaki" — understated **25×**) | — | **165,000** |
| **shatavari** | 0 *(data fault)* | **90,500** |
| **gokshura** | 0 *(data fault)* | **27,100** |

**Demand.** Ashwagandha alone at 673,000 US/mo is larger than every condition head term in the entire pull combined (the whole conditions cluster, even at its inflated total, is 13,630). Turmeric at 301,000 US is second. These are re-tested single terms; they do not depend on any arithmetic the audit condemned. **Under any plausible re-pull, herbs are first.** The re-pull will change the *ordering within* the cluster and the *tail depth* — it cannot change which cluster leads.

**Effort.** Lowest per-page cost of any type. One schema × N herbs, mechanically repeatable, and the reference implementation (§5.2) is written. Contrast: condition pages need per-page red-flag sets, conventional-care links, and tier-3 sign-off files; classical-text pages are **licence-blocked** on 2 of 4 launch texts.

**Strategic value.** Four independent reasons herbs lead, all from the research:

1. **Review genuinely scales here.** `teardown-condition.md` §7.5 is emphatic: "Let the *herbs* cluster carry the volume — herb pages are lower-harm and their review genuinely scales… Never let a condition page ship on the same pipeline as an ingredient stub." Condition pages are where a wrong sentence sends someone off their metformin.
2. **The moat is per-herb.** rasa/guna/virya/vipaka + API listing + classical sources + Sanskrit/regional names + `anupana` + `traditionalContext`. Examine, WebMD, Drugs.com, MSK and NIH ODS all compress Ayurveda into one clause — *"used in Ayurveda as an adaptogen"* — and move on. They are not lazy; **they have no source competence for it. We do.** Nobody credible occupies *Ayurveda-literate* ∩ *evidence-honest*.
3. **Herbs are the entity-clarity hole.** The demand core has **no `sameAs`, no `Substance`/`DietarySupplement` typing, no binomial linkage**. Nothing tells any engine our "ashwagandha" **is** Wikidata's *Withania somnifera*. `teardown-aeo-geo.md` §8: "the cheapest unclaimed win on the board."
4. **The AI-answer quality bar in this niche is on the floor.** Health AI Overviews cite "less reliable sources" **65.55%** of the time; government + academic ≈ **1% combined** (SE Ranking, 50,807 prompts). And only **36%** of AI-cited health URLs sit in organic top-10 — **citation is decoupled from rank**, which is exactly why a new site that cannot outrank Healthline on domain authority can still win here. It is close to an open goal.

**What we are NOT doing and why:**

| Cluster | Not first, because |
|---|---|
| **Concepts** | Its apparent 1.54M is **97% `ojas` at 1.5M India — brand-name noise the brief itself says to discount.** Strip it: ~43K. *Exception:* the **rasa/guna/virya/vipaka/karma** pages ship in Phase 1 anyway — not for demand, but because **every herb monograph deep-links into them** (API field 8). They are the legend for a field in India's statutory drug standard; a monograph whose `conceptRef`s 404 is broken. |
| **Formulations** | **Blocked on the KAPPL catalog**, which is not in this repo. Also skews India-only. `reusable-content-map.md` §2.2. |
| **Conditions** | Highest-risk type, long-tail-only head terms, needs Dr. Deepu John's phrase-bank sign-off + the DO-NOT-PUBLISH ruling **before authoring**. Capped at 15–25 forever. |
| **Classical texts** | **Licence-blocked**: 2 of 4 launch texts (Ashtanga Hridaya, Bhavaprakasha) have **no confirmed licence-clear English translation**. Charaka + Sushruta are GREEN and ship first, proving the quote-bearing renderer while AH/BP prove the quote-free path. |
| **News** | 🔴 Go/no-go on committed physician capacity. Build nothing until that is a yes. |

### 3.2 PHASE 0 — BLOCKING. No herb page ships until these are done.

**This is not preamble. Four of eight teardowns independently identified the same defect as their single most serious finding, without coordinating. That is as strong a signal as this research pass produced.**

| # | Item | Evidence | Why blocking |
|---|---|---|---|
| **0.1** | **Delete `const REVIEWED = "2026-07-14"`.** Per-page `review.reviewedOn`, populated **only on real review**. No date → no `lastReviewed` in schema, no review byline rendered. **Build fails if `clinical && !review.reviewedOn`.** | `article.tsx:23`, feeding `:70` `lastReviewed`, `:79-80` `datePublished`/`dateModified`, `:124` the visible byline. `grep -c "dateModified\|lastReviewed\|reviewedOn" content/herbs__ashwagandha.json` → **0** | It is **a build date wearing a physician's byline**. schema.org defines `lastReviewed` as a *review event*; ours is a deploy. Every rebuild silently re-dates 20 YMYL pages as freshly physician-reviewed. A page authored in Nov 2026 asserts it was reviewed in Jul 2026 — **before it existed**. Separate from Google, **it is a false statement about a doctor's professional act, auto-generated on every deploy.** QRG §5.6 ("exaggerated or mildly misleading" → **Low**); CLAUDE.md gate 7 + rule 6. At 3,400 pages it becomes mass-fabrication of review events. **I would stop shipping the constant before I'd ship a new page.** |
| **0.2** | **🔴 Fix F2: `/about` promises named authors; no page can have one.** Either ship named authors or rewrite `/about`. **Recommend: ship named authors.** | `about.json` states **twice**: *"Every page has a named author, shown on the page. We do not publish anonymous health content."* / *"Each page shows who wrote it and who reviewed it."* `article.tsx:122` renders `By the Kairali Editorial Team` on every page. **The `Page` type has no `author` field.** | **The worst finding, because the dishonesty is in the honesty section.** A rater starts at `/about` (QRG §3.4 says so explicitly), clicks any health page, and sees the contradiction immediately. QRG §5.5 + §5.6 → **Low**. Blocks on the author roster — Abilash's call. |
| **0.3** | **Fix the dead anchors.** `Section.anchor`; `/about` sections set `anchor:"medical-reviewer"` / `"editorial-team"`; byline becomes a `<Link>`. | `article.tsx:24-25` builds `@id`s → `/about#medical-reviewer` and `/about#editorial-team`. `article.tsx:132` renders `id="s-0"`, `id="s-1"`… — **the only ids on /about.** Both anchors dead. Byline is a `<span>`, not a link. | Google asks literally: *"Do bylines lead to further information about the author?"* → **No.** Every page's `reviewedBy`/`author` `@id` resolves to a dead fragment. Cheap fix; real credibility cost. |
| **0.4** | **Fix the reviewer leak.** `llms.txt/route.ts:17` and `about.json` (6×) + `faq.json` (1×) hardcode "Dr. Deepu John". Route both through `MEDICAL_REVIEW`. Adopt the **dated roster** (C4). | `medical-review.ts` header promises: *"a leadership change is a ONE-LINE edit"*. Verified: it is a **7+ line edit across content plus config.** | The abstraction is right; it is **half-wired**. A header that promises a one-line edit, in the file whose whole purpose is that promise, while 7 hardcoded names sit in content, rots quietly. Directly contradicts the MEMORY ruling (reviewer is config, not a literal). |
| **0.5** | **🔴 Fix F5: move ALL sourcing/where-to-buy out of main content into the marked `pathway` aside. Add lint rule 24.** | `herbs__ashwagandha.json` §4 *"Where can I find quality ashwagandha?"* is **main content**, and recommends the publisher's own pharmacy inside the article body: *"Kairali's ashwagandha is manufactured at a **WHO-GMP-certified Ayurvedic pharmacy (KAPPL)**…"* | **QRG §3.4 p.27's own worked example of a conflict of interest** (the manufacturer reviewing its own product). It is also the strongest *practical* DMR argument: the site's legal defence is "educational, not advertising" — and MC recommending our own pharmacy for an ingestible is exactly what erodes it. The page hedges well (*"a statement about quality control, not a claim that the herb treats any condition"*) — right instinct, wrong location. **The `pathway` aside already exists and already does this correctly. We are one edit from Examine's rule: cover ingredients, never products.** |
| **0.6** | **Ship `/editorial-policy`, `/medical-disclaimer`, `/evidence-grades`, `/corrections` as real routes.** | Routes today: `/`, `/privacy`, `/cookie-policy`, `/terms`, `/what-is-ayurveda`, `[...slug]`. Disclaimer = footer prose only. Editorial policy = §5 of `/about`, no anchor. | Every reference publisher gives both a stable URL — a rater, a journalist, or an LLM needs something to **cite**. `llms.txt` already asserts "not medical advice" **with no URL to back it**. And **`/evidence-grades` must be public BEFORE any grade renders** — Examine's authority rests on publishing its methodology; a grade without a published scale is a decoration. |
| **0.7** | **Loader cache + slug index; `_manifest.json` generated + CI-validated.** | §2.6 items 1–2. | O(N²) build. Cheap at 20 files; the fix is expensive to retrofit. |
| **0.8** | **Content lint (§2.7) written and GREEN before the first new page**, incl. the negation-aware + control-word-validated banned-word scanner. | `register_ok` is dead (grep: only the type declaration). Two files say `"review"` and ship identically to `"ok"`. | Doctrine (g): a gate that does not gate is worse than no gate — **it manufactures false assurance.** Must exist *before* volume, not after. |
| **0.9** | **Retype the existing 20** (§1.1) + backfill real dates. 🔴 Blocks on Q3. | | Migrate 20 files now vs 500 later. |
| **0.10** | **🔴 Replace the 11 off-strategy citations** (healthline ×6, ayurveda.com ×3, britannica ×2) with primary equivalents. | Citation-host histogram across `content/*.json`: `20 nccih.nih.gov · 14 pubmed · 7 hopkinsmedicine · 6 healthline · 4 who.int · 3 ayush.gov.in · 3 clevelandclinic · 3 ayurveda.com · 2 britannica…` | The NCCIH/PubMed backbone is exactly right. But Healthline is the commerce model **the site's own strategy defines itself against** — citing it as an authority undercuts the E-E-A-T that is the entire moat. **The pattern gets cloned into every future monograph. Cheap now, 3,400× expensive later.** |

**No spec file exists for this site** (`find` for `*.spec.*`/`*.test.*` matching ayurveda/wia → **zero hits**). Phase 0 also ships `wia-content.spec.ts` — the deterministic gate. Never edit a spec to make it pass.

### 3.3 PHASE 1 — the seed batch (§5)

18 herb monographs + 5 pharmacology concept pages + `/herbs` hub regenerated from the manifest. Detailed in §5.

### 3.4 PHASED ROADMAP — "lean at birth, complete at launch"

**On the ~3,400 target.** `reusable-content-map.md` §5.2 verified that the number derives from **easyayurveda.com and ayurvedahub.in — commercial blogs**, not primary sources. The counts may be right, but a five-year plan resting on blog arithmetic should be re-based on the API / AFI / the samhitas themselves before it drives budget. **I am treating ~3,400 as a direction of travel, not a commitment**, and the phase table below is sized by *what can be honestly reviewed*, not by a count. 🔴 Q4.

| Phase | Adds | Cumulative | Gate | Blocked on |
|---|---|---:|---|---|
| **0** | Trust furniture + engine + lint. **No new content.** | 20 | §3.2 all green; spec suite exists and passes | 🔴 Q2 (author roster), Q3 (true review dates) |
| **1** | **18 herb monographs** (4 rebuilt + 14 new) · 5 pharmacology concepts (rasa/guna/virya/vipaka/karma) · `/herbs` hub · `data/interactions/*.json` for all 18 · `data/product-classes.json` · `data/drug-classes.json` | ~44 | Per-herb physician sign-off; lint green; AEO/GEO auditor PASS; design-qa PASS | Dr. Deepu John capacity |
| **1.5** | `/safety/heavy-metals-in-ayurvedic-products` pillar · `/interactions/<herb>-and-<drug-class>` **only where evidence ∈ {A,B,C}** | ~60 | **Never auto-generate an E-level interaction page** — that manufactures fear at scale and is how "3,400 pages" quietly becomes a content farm | — |
| **2** | Herbs → ~60–80 (re-pull-ordered) · `/texts/charaka-samhita` + `/texts/sushruta-samhita` (GREEN) · `/api/<slug>` for the shipped herbs · remaining concepts · therapies from the Healing Secrets booklet | ~180 | **Keyword re-pull per `MASTER_PIPELINE.md` is a HARD GATE on this phase** — Phase 2 ordering cannot be decided on quarantined data | 🔴 Q1; licence for AH/BP |
| **3** | **Conditions, capped at 15–25**, tier 1–2 only, highest-demand first · news desk *if* Q5 is a yes | ~210 | Phrase bank + red-flag sets + `doNotRelyAlone` copy signed by Dr. Deepu John **before authoring**; DO-NOT-PUBLISH list ratified | 🔴 Q5, Q7, Q8 |
| **4** | Formulations (KAPPL catalog) · classical-text expansion (First Schedule has **85 books**) · A–Z ladders · full API transformation | 🔴 re-based | Re-based census; sitemap index sharding >50,000 URLs | KAPPL catalog; 🔴 Q4 |

**"Lean at birth, complete at launch" — what it means operationally.** whatisayurveda.com **is already live**; there is no DNS flip pending. So the rule reads: *a cluster may start with few pages, but no page ships until it is complete on its own type's schema.* An 18-page herbs cluster where every page carries real dates, real citations, `mainDrawbacks`, pregnancy/lactation/preSurgery/longTermSafety, and a published grade scale **beats** 200 pages that each promise physician review they did not get. **PACE: slow and easy beats fast** (BUILD DECISION MATRIX rule 4).

**🔴 The strategic risk, flagged hard (pushback duty).** The site promises **every health page is physician-reviewed**. At 20 pages that is true and verifiable. **At 3,400 it is arithmetically not, unless the review is nominal — and a nominal review attached to a named, credentialed physician on YMYL content is a WORSE position than no review claim at all.** It converts a content problem into a personal-credibility and potentially regulatory problem for Dr. Deepu John and for KAG. This is a **business-model question, not a technical one**, and it constrains the whole roadmap. The honest answer must be stated on `/about`: is "physician-reviewed" per-page, or per-template-with-spot-check? 🔴 Q6. **I would not scale past Phase 2 without an answer.**

---

## 4 · E-E-A-T MODEL

### 4.0 The governing fact

Google's rater guidelines, **General Guidelines, 11 Sep 2025**, §3.4 p.27:

> "Trust is the most important member of the E-E-A-T family because **untrustworthy pages have low E-E-A-T no matter how Experienced, Expert, or Authoritative they may seem.**" · "**If a page is untrustworthy for any reason, it has low E-E-A-T.**"

And §5.1 p.60: *"No other considerations such as positive reputation or the type of website can overcome a lack of E-E-A-T."* **Kairali's 1908 heritage does not buy us out of page-level furniture.**

Our site is clear YMYL Health (§2.3 p.11) → "the most scrutiny for Page Quality rating."

> **The one-paragraph thesis, from `teardown-eeat.md` §0:** *"The gap is not substance; it is that our trust furniture currently makes claims the code does not keep."* We already have unusually strong raw ingredients — a real NABH hospital, a real WHO-GMP pharmacy, real BAMS physicians, real citations to NCCIH/JAMA/LiverTox, and a genuinely honest voice. Three of our defects are, **by Google's own written criteria, Low-quality signals — and they are self-inflicted, because our own `/about` promises more than the template renders.** Fixing them is cheap. **Not fixing them makes the honesty itself look like marketing.**

**The bar, stated once:** every reference publisher's trust claim and rendered artifact are **the same object**. Examine's "we update with the latest research" is backed by a public revision history you can click. A promise without a rendered artifact is, in QRG §5.6 terms, *"exaggerated or mildly misleading information about the website."* Every row below is a claim wired to an artifact.

### 4.1 THE TRUST FURNITURE CHECKLIST — every `healthTopic: "clinical"` page

| # | Item | Schema field | Rendered artifact | Hook |
|---|---|---|---|---|
| **P1** | **Named author** + credentials, hyperlinked to their bio | `author{key,anchor}` | `By <a href="/about#author-…">Name, Creds</a>` | QRG §5.5; *"Do bylines lead to further information?"* |
| **P2** | **Named medical reviewer** + credentials, hyperlinked | `review.reviewerKey` → `MEDICAL_REVIEW.reviewers[key]` | `Medically reviewed by <a href="/about#medical-reviewer">Dr. …, BAMS</a>` | QRG §3.4.1 *"must come from experts"* |
| **P3** | **Institutional review line** | `MEDICAL_REVIEW.institution` | "Reviewed under the medical-review policy of **the registered physicians of the Kairali Ayurvedic Group**" → `/editorial-policy` | Authoritativeness that **survives a head change** |
| **P4** | **Real per-page `Last medically reviewed: <date>`** — a recorded event, never the build date | `review.reviewedOn` | visible date **identical** to `lastReviewed` in JSON-LD | schema.org `lastReviewed`; Google: dates must "match between the equivalent user-visible and structured values" and must not be "the date of the action described on the page" |
| **P5** | Next review due | `review.nextReviewDue` | internal min.; public optional | cadence parity |
| **P6** | **Publisher disclosure + interest statement** | `commercialInterest` | "Published by the Kairali Ayurvedic Group, which also operates an Ayurvedic hospital and pharmacy. This site sells nothing; see our editorial policy." | **QRG §3.4 p.27 — conflict of interest** |
| **P7** | **Medical disclaimer above the fold** on herb/therapy pages, linking `/medical-disclaimer` | `disclaimer` | inline in the Dosage H2 (**Examine's placement — at the point of risk**), not a footer | QRG §2.3 |
| **P8** | **≥3 citations, ≥1 primary/government**, numbered, resolvable, anchor-linked | `citations[]` + `primary` + `type` | `<ol>` with `value={c.n}` + `citation` in JSON-LD | QRG §5.2 accuracy |
| **P9** | **Evidence-limits statement in the MC**, not a footnote | `evidence.evidenceCaveat`, `notStudiedFor[]`, `outcomes[].limits` | `<EvidenceBox>` above the fold | §3.4.1 consensus alignment |
| **P10** | **Safety block** on any ingestible/therapy: contraindications, interactions, pregnancy | `safety{}` + `interactionsRef` | `<SafetyBlock>` + `<InteractionsTable>` | §2.3 harm prevention |
| **P11** | **Zero disease-cure claims**; DMR-Schedule lint | — | lint 20–23 | §5.2 *"harmful inaccuracies… Lowest"*; Indian law |
| **P12** | **No Kairali entity in MC** — commercial routing only in the marked `pathway` aside | `routesTo` | lint 24 | §3.4 p.27 COI |
| **P13** | **Corrections route** — `info@kairali.com` + "tell us if this is wrong" | — | `/corrections` | Trust; §2.5.3 |
| **P14** | **JSON-LD parity** — every visible byline/date/citation also in structured data | — | — | *"all the authors presented as authors on the web page are also included in markup"* |
| **P15** | **AI-authorship disclosure**, if applicable | — | 🔴 Q9 | *"Is the use of automation… self-evident?"* |
| **P16** | **Public update history** incl. a `correction` class | `updateHistory[]` | `<UpdateHistory>` | **Examine's `correction` type is a trust signal BECAUSE it admits error in public.** Converts "medically reviewed on X" from a decoration into an auditable record. |

**Every page (incl. non-health):** publisher in footer · contact ≤1 click (`info@kairali.com`, WhatsApp **+91 92898 38797**) · footer disclaimer + `/medical-disclaimer` link · links to `/about`, `/editorial-policy`, `/medical-disclaimer`, `/privacy`, `/terms` · `Organization` JSON-LD with `@id`/`url`/`logo`/`sameAs` · breadcrumbs visible + `BreadcrumbList`.

**The site must have:** `/about` ✅ · `/about#medical-reviewer` ❌ **anchor must exist** · `/about#editorial-team` ❌ · `/editorial-policy` ❌ · `/medical-disclaimer` ❌ · `/evidence-grades` ❌ **before any grade renders** · `/corrections` ❌ · per-author bios ❌ · publisher-interest disclosure ❌ · `llms.txt` pointing at the policy URLs ⚠️ (asserts a stance, cites no URL) · **review-provenance record — the artifact behind the claim** ❌.

### 4.2 Wiring to `medical-review.ts` — the institutional reviewer

The current shape is **directionally correct and must be preserved**: institutional framing + one named current head + a stable anchor is exactly right for E-E-A-T-that-survives-turnover. Two changes — grow it into a **dated roster** (C4), and give it a `url`:

```ts
export const MEDICAL_REVIEW = {
  institution: "the registered physicians of the Kairali Ayurvedic Group",
  policyUrl: "/editorial-policy",
  reviewers: {
    "deepu-john": {
      name: "Dr. Deepu John",
      credentials: "BAMS",
      title: "Chief Physician, Kairali — The Ayurvedic Healing Village",
      anchor: "medical-reviewer",
      url: "/about#medical-reviewer",   // Google "strongly recommend[s] using the type and url (or sameAs)"
      sameAs: [],                        // council/registry profile when available
      bio: "…",
      registration: null,                // 🔴 Q10 — CCIM/state council no. = a VERIFIABLE credential (QRG §5.6)
      headFrom: "2026-01-01",            // C4: dated roster
      headTo: null,
    },
  },
  currentHeadKey: "deepu-john",          // ← THE one-line edit the header comment promises
} as const;
```

**Why the dated roster (C4).** `review.reviewerKey` freezes **which physician** reviewed a given page; config supplies **who that person is**. A 2028 head change updates `currentHeadKey` (one line) without silently re-attributing a 2026 review to a physician who was not there. Both properties preserved. Without it, `MEDICAL_REVIEW.current` renders the *current* name on *historical* reviews — factually wrong, and on YMYL, corrosive.

**Why `reviewedBy` becomes an array.** schema.org `reviewedBy` accepts an **Organization** as well as a Person — which is the schema-level expression of our institutional model. Emit both:

```jsonc
"reviewedBy": [ { "@id": ".../about#medical-reviewer" }, { "@id": ".../#organization" } ]
```

**One named physician, institutionally backed** — the cleanest expression available in the vocabulary, and it degrades gracefully when the head changes.

**Also:** `article.tsx` must **never** drift into `name: "Dr. Deepu John, BAMS"` — Google is explicit: *"In the `author.name` property, only specify the name of the author. Don't add any other piece of information."* Today's `physician()` call correctly packs title+credentials into `jobTitle`. Keep it that way.

### 4.3 Citations — the source-tier policy (write into `/editorial-policy`)

| Tier | Sources | Use |
|---|---|---|
| **1** | Systematic reviews / meta-analyses · Cochrane · NIH ODS · NCCIH · LiverTox · CDC MMWR · FDA · WHO · AYUSH expert-committee reports | Cite freely; the backbone |
| **2** | Individual RCTs · pharmacopoeias (API) · MSK / Drugs.com monographs | Cite with design + n + year |
| **3** | **Classical texts — authoritative for what the TRADITION claims, NEVER for efficacy** | `classical-text` type only, never in `evidence` |
| **Never** | Supplement-vendor blogs · press releases · WebMD/RxList supplement monographs · aggregators · **our own group's marketing claims** | Lint 35 |

**Two sourcing rules that are not negotiable:**

1. **Primary source or it doesn't ship.** Every number, percentage, date, grade, CI and product name is read from the regulator/journal/database itself. **Evidence this is real:** during the research pass, a search snippet asserted LiverTox grades ashwagandha likelihood **"C"**. Fetching the LiverTox page returned **"B"**. Shipped inside a physician-reviewed safety item, that error ends the section's credibility. Snippets, aggregators, and memory are never sufficient.
2. **Cite the source they cite.** If NCCIH or WebMD reports a study, cite the study.

**The bridge only we can walk.** NIH ODS's own ashwagandha reference list includes *"Ministry of Ayush, Government of India. Safety of Ashwagandha, Withania somnifera. Report of the Expert Committee. 2024."* **The US government cites the Indian government on Ayurvedic safety.** That citation type belongs on our pages, and it is a bridge we can cross in both directions.

### 4.4 The disclosure problem — 🔴 the decision that defines the site

Examine's authority is **purchased with independence**: *"100% of our revenue comes from subscriptions… we don't sell supplements, run advertisements, or accept sponsorships"*, plus a contractual staff ban on industry ties. **Kairali manufactures and sells ashwagandha.** We can never make that claim, and imitating its tone without its substance would be exactly the hype the brief forbids.

**The only honest substitute is disclosure at the point of interest, not in a footer.** `quality.commercialDisclosure`, rendered inline in the quality section wherever a Kairali pathway appears:

> *Disclosure: the Kairali Ayurvedic Group publishes this site and manufactures ashwagandha products. That is a reason to read this page sceptically. We have stated the evidence limits and the contamination risks for this herb as strongly as the independent sources we cite — see our sources above, and check them. Nothing on this page recommends buying anything.*

**Recommendation (🔴 Q7):** `routesTo` pathway modules sit **below** the safety and quality sections, **never adjacent to an efficacy claim**, and **the herb monograph never links to a product page for the herb it is about** — only to the pharmacy's quality standards. Costs a little traffic; buys the only asset this site has.

**The review criterion that a conversion-optimising reviewer would not catch, and which must therefore be explicit:**

> **The safety content must read identically had a competitor written it.** Never let the KAPPL/WHO-GMP mention become the *payoff* of a safety section. It appears once, factually, as the answer to "what should I demand of any manufacturer" — **never as the resolution of a fear the page just raised.** Manufacturing fear and selling the cure is precisely the "never charity, never hype" line, and it is the failure mode a Kairali-published safety page is most exposed to.

**Section §1.10 (quality/heavy metals) is where the voice is proved real.** If our heavy-metal section were softer than Examine's *because we sell ashwagandha*, **the whole site is worthless.** It must be the most rigorous version on the internet, and **it must be written so that a reader could use it to decide against buying from us.** An Ayurveda publisher volunteering the strongest version of the contamination evidence — against its own commercial interest — is the highest-trust move available to us.

**And it must explain, not just alarm.** In rasa shastra, metals are **intentional**, not contamination. Only an Ayurveda-literate publisher can make that distinction instead of leaving a reader frightened of turmeric. Explaining it honestly, without defensiveness, is a top-tier trust move — and it is the reason contamination is modelled as a **`product_class` property, not a herb property** (§2.4). Model it on the herb and every page inherits a scary, imprecise, wrong warning, and we lose the one genuinely useful thing we can say: **which class of product to avoid.**


---

## 4b · AEO/GEO MODEL

**Abilash standing ruling (15 Jul 2026, DECISIONS.md): AEO + GEO are a mandatory Ship-Gate check on EVERY Kairali site, built and future — retroactive. Not just SEO.**

### 4b.0 The honest headline — three briefed tactics the evidence does not support

Per the pushback duty, this first: **several tactics I was briefed to implement are weakly supported or null, and one is actively contradicted by the strongest study available.** Building the schema around all of them uncritically would bake folklore into every page.

| Received wisdom | What the evidence says | Verdict |
|---|---|---|
| **Formatting/structure drives citation** (direct-answer-first, self-contained chunks, question-shaped H2s) | The largest controlled study available (**252,000 trials, 6 models**, arXiv 2605.25517) found **content structure and visual organisation among 7 of 18 factors with NO RELIABLE EFFECT.** What won was *substance*: evidence-backed claims, comprehensive coverage, recency, topic relevance. | **Weak/null as a citation lever.** Keep it — for chunk-extractability, the honest reason — **never report it as an AEO win.** |
| **FAQPage / structured data drives citation** | Google states plainly: *"There's also no special schema.org structured data that you need to add."* FAQ rich results fully deprecated (May 2026). Microsoft says the opposite for Copilot. A Dec-2024 study found no correlation between schema coverage and citation rates. | **Contested; real but modest and engine-specific.** Do it for Copilot + entity clarity, **not as the centrepiece.** |
| **llms.txt is table stakes** | Ahrefs, **137,210 domains**: **97% of llms.txt files received zero requests.** AI *retrieval* bots were **1.1%** of the (tiny) fetch traffic. Google does not support it, no plans to. Mueller compared it to the meta keywords tag. | **Near-worthless for AI search.** We already ship one; it costs nothing; **do not count it as a win, do not build tooling for it.** |

> **The single highest-leverage correction: AEO is won on SUBSTANCE and EVIDENCE DENSITY, not on formatting ritual.** That is extremely good news for this specific site, because substance and evidence honesty are already its reason to exist. **We do not need to become something else to win here. We need to be more rigorously ourselves** — and to fix §3.2.

**⚠️ A number to stop repeating:** *"statistics and citations improve AI visibility by 30–40%"* traces to the Princeton GEO paper's headline "up to 40%", which is the **best-case lift across the whole framework, not a per-method effect**. Do not cite per-method percentages as fact. The directionally-safe claim, independently supported by the 252k study's odds ratios: **evidence density raises citation odds materially; the exact multiplier is unestablished.**

### 4b.1 Why citation ≠ ranking (the model everything hangs on)

1. **The unit of retrieval is the passage, not the page.** Engines chunk documents into semantic passages and evaluate each independently. A brilliant page with one strong section is cited for that section alone; a page whose value only emerges cumulatively is cited for **nothing**. → **Each section must be independently valuable, because each section is independently retrieved.**
2. **One user query becomes many machine queries (fan-out).** AI Mode/ChatGPT/Perplexity decompose a query into ~8–12 sub-queries, each its own retrieval. → **Coverage of the sub-questions beats optimising for the head term.** "Is ashwagandha safe in pregnancy?" is a fan-out target of "ashwagandha" and must be answered **on the page, in its own addressable section**. This is why `answersQuestion` is required.
3. **Citation is decoupled from rank.** Only **36%** of AI-cited health URLs sit in organic top-10; 74% are somewhere in the top 100. → **Genuinely winnable for a new site that cannot outrank Healthline on domain authority.**
4. **The failure mode is silence, not position 11.** ~43% of *topically relevant* pages get no citation at baseline. → **Measure citation PRESENCE, binary, per query — not average position.**

**The strategic read:** health AI Overviews cite "less reliable sources" **65.55%** of the time; government + academic ≈ **1%**. The quality bar in this niche's AI answers is on the floor and the demand is enormous. **The constraint is not our quality — it is being chunkable, current, and entity-clear enough to be retrieved at all.**

### 4b.2 🔴 THE HEDGING CONFLICT — the decision that changes every page

**The strongest study we have says hedged language loses to confident claims — odds ratios 2.67 to 754.**

**This site's entire voice is honest hedging.** From the live `herbs__ashwagandha.json`: *"Evidence is early and limited."* — **that is exactly the hedge the study says gets you dropped.**

This is a direct, load-bearing conflict between "what wins citations" and "what this site is for", on a YMYL topic. **I will not quietly optimise toward confident health claims** — that would be a DMR/ASCI/YMYL hazard, would betray the transparent-steward voice, and would make us the 65.55% rather than the 34.45%. Nor should we ignore a 754-OR finding.

**Proposed resolution — distinguish CONFIDENCE OF ASSERTION from CERTAINTY OF CLAIM.** The study's "hedged" condition is *vague, non-committal prose*. It is **not** the same as *decisively stating a limitation*. We can be **grammatically confident about uncertainty**:

| ❌ Hedged — loses citations AND says nothing | ✅ Decisive about uncertainty — citable AND honest |
|---|---|
| "Ashwagandha may possibly help with stress, though more research is needed." | "**Eleven randomised trials have tested ashwagandha for stress. The largest enrolled 60 people for 8 weeks. None establish an effect size reliable enough to guide dosing.**" |
| "It might not be safe in pregnancy." | "**Ashwagandha is contraindicated in pregnancy.** Classical texts and modern toxicology agree; there is no safe-dose evidence." |
| "Evidence is early and limited." *(← our live copy)* | "**The evidence base is 14 small trials, median n=58, median duration 8 weeks, 6 of 14 industry-funded.** No trial exceeds 12 weeks." |

The right-hand column is **more honest, more specific, AND** hits the study's actual winners simultaneously: evidence-backed claims, missing-specifications (fixed), comprehensive coverage, confident language. **Specificity is the bridge between our ethics and our citation odds. Vagueness — not honesty — is what loses.**

**🔴 QUESTION FOR ABILASH:** ratify *"decisive about uncertainty, never vague; specific numbers replace soft qualifiers; never confident about clinical benefit"* as the site's binding voice rule? **This changes how every page is written and needs Dr. Deepu John's clinical concurrence (hard gate 7)** — it materially changes how clinical evidence is stated. **The `wia-evidence-v1` grade scale (§2.2) is the mechanism**: a grade is decisive *and* honest.

**A second, quieter conflict:** the 252k study lists **price transparency** as a *universal gatekeeper*. This site is deliberately non-commercial and has no prices. **We do not invent commerce to game this.** My read: price transparency proxies for *"answers the concrete practical question the user actually asked"* — the specificity gatekeeper wearing a commercial hat. Our equivalents: dose studied, duration, contraindication, "where this is practised". **Satisfy the mechanism, never the literal field.** Flagged as interpretation, not fact.

### 4b.3 The per-page AEO fields — enforced BY CONSTRUCTION

**Design principle: every AEO property that CAN be enforced by the schema MUST be enforced by the schema. At volume, anything left to reviewer discipline is a defect with a delay timer. If the JSON validates, the page is answer-engine-ready — that is the whole bet.**

**Every page type in §2 carries these** (they live on `BasePage`/`Section`, so all ten types inherit them):

| Field | Type | Gate | Evidence justification |
|---|---|---|---|
| `answerCapsule` | string | **40–80 words. Self-contained. NO ANAPHORA** — regex-ban `as (mentioned\|noted\|discussed) above`, `this article`, `see below`, leading bare `It `/`This `/`They `. **Must name the entity in sentence 1.** | Passage-level retrieval. *Honest framing: structure had null effect in the 252k study — this is justified by chunk-extractability, not a proven citation lift.* |
| `sections[].capsule` | string | Same gates. Must independently answer `answersQuestion`. | Query fan-out |
| `sections[].answersQuestion` | string | **REQUIRED. Must end `?`. Should match a real query** from the (re-pulled) demand file. | Fan-out targeting — one sub-query, one section |
| `sections[].anchor` | string | Stable, semantic. Never `s-${i}`. | Deep-linkable by engines |
| `sections[].citationRefs` | number[] | ≥1 per section making an efficacy claim on a clinical page | Per-chunk evidence density |
| `review.reviewedOn` | ISO | **REQUIRED if clinical. ≤ today. MUST NOT equal the build date** unless a real review happened that day. | **Recency = one of only four UNIVERSAL gatekeepers** (all 6 models, 252k trials) + honesty |
| `updatedOn` | ISO | REQUIRED, per page, real. Warn >12mo; **FAIL >24mo on clinical.** | Universal gatekeeper |
| `entity.canonicalName` + `entity.sameAs` | string, string[] | **REQUIRED for herb/formulation/condition/therapy/concept/text. ≥1 Wikidata URI.** | Cross-engine entity resolution. **The cheapest unclaimed win on the board.** |
| `entity.notToBeConfusedWith` | array | Required where a real collision exists | **Ayurveda is full of collisions — `brahmi` = *Bacopa monnieri* OR *Centella asiatica*. State it explicitly.** |
| `citations[]` | Citation[] | **≥3 for clinical, ≥1 `primary: true`.** Every `type:"rct"` needs `year` + `n_participants`. | **Evidence-backed claims — OR 2.09 to >>10k. The single highest-value factor.** |
| `evidence.outcomes[].grade` | EvidenceGrade | REQUIRED if clinical; `gradeScaleVersion` → public `/evidence-grades` | §4b.2 honest-confidence bridge |
| `evidence.snapshot` | object | trialCount, largestTrialN, longestTrialWeeks, participantsTotal | **Missing specifications — OR 8.63–243.** Countable authority ("132 references · 8,803 participants in 29 trials") is falsifiable, scannable, instantly credible, and **cheap to compute from our own `citations[]`.** |
| `safety` / `contraindications` | object | REQUIRED, non-empty, if clinical | YMYL + specifications |
| `comparedWith[]` | array | Where meaningful | **Comparisons with alternatives — OR 1.61–7.45. We have none today.** Compare the SUBSTANCE, never sell. |
| `faqs[]` | Faq[] | Must render **visibly in HTML**, never schema-only | Visible Q&A does the work, not the JSON-LD |
| **Vagueness lint** | — | **FAIL** on `may possibly`/`some people find`/`more research is needed` **unless** a specific number appears in the same section | §4b.2 — **bans vagueness, not honesty** |
| **Claim lint** | — | **FAIL** on `cure`/`treats`/`heals`/`guaranteed`/`miracle` in clinical context | **Outranks the vagueness lint in every conflict** |

**`SCHEMA_BY_TYPE`** replaces the `clinical ?` ternary:

| type | JSON-LD |
|---|---|
| `herb` | `MedicalWebPage` + **`DietarySupplement`** + `Substance` + `sameAs` + `FAQPage` + `BreadcrumbList` |
| `formulation` | same as herb |
| `condition` | `MedicalWebPage` + **`about: MedicalCondition`** ← the **existing-but-never-passed** builder finally fires |
| `therapy` / `question` | `MedicalWebPage` |
| `concept` | `DefinedTerm` in a `DefinedTermSet` + `MedicalWebPage` where health content is present |
| `classical-text` | `Book` (+ `hasPart` for sthanas); `Legislation` reference for the First Schedule fact |
| `pharmacopoeia` | `MedicalWebPage` + `Substance`. **NEVER `indication`** — it asserts a medical indication and would encode the exact misrepresentation the API's `THERAPEUTIC USES` field forbids |
| `hub`/`index` | `CollectionPage` + `ItemList` |
| `news` | `NewsArticle` (not `BlogPosting`) + `MedicalWebPage` + `citation` |
| `reference` | `Article`; `Person` for bios |

**Honesty rules in the markup itself:**
- **Never `Drug` + `AggregateRating`** — no UGC, and fabricated ratings violate rule 6.
- **Never `recommendedIntake`** on `DietarySupplement` — deliberately omitted; **we make no recommendation.**
- **Never `ClaimReview`** — built for adjudicating claims true/false; our whole position is that these questions are *unsettled*. Forcing a rating would misrepresent the evidence. **Considered and rejected; recorded as a decision so it is not re-litigated.**
- **`medicalWebPage()` must gain `citation[]`** — today our single strongest factor (evidence density) is **invisible to machines that read JSON-LD**.
- **`medicalWebPage()` must gain `datePublished`/`dateModified`** — today it emits neither, so **the clinical pages, where freshness matters most, are the ones missing the freshness fields.** Article pages get them; medical pages don't.
- **`lastReviewed` emits ONLY if a real `review.reviewedOn` exists.** Never a build date. **Absence must be honest, not defaulted.**
- `DietarySupplement` mapping (`activeIngredient` ← markerCompound; `nonProprietaryName` ← botanical.latin; `dosageForm` ← forms[]; `safetyConsideration` ← safety.summary; `legalStatus` ← regulatoryStatus) is **designed from the type definition but NOT yet validated against Google's Rich Results Test — do that before shipping.**
- **`interactingDrug` and `contraindication` are NOT properties of `DietarySupplement`** — they belong to `Drug`. Verified. Do not emit them on herb pages; interactions go in `safetyConsideration`.

### 4b.4 🔴 AI-crawler policy — allow all, deliberately

**The distinction most sites get wrong: training bots and citation bots are different bots.** You can refuse to be training data and still be cited — or, catastrophically, block the citation bot while intending only to block training.

| User-agent | Purpose | Blocking costs | Call |
|---|---|---|---|
| `Googlebot` | **Everything** — organic AND AI Overviews AND AI Mode | **Your entire Google presence** | **ALLOW — never block** |
| `OAI-SearchBot` | ChatGPT search retrieval → **citation** | All ChatGPT citations | **ALLOW** |
| `PerplexityBot` | Retrieval → **citation** | All Perplexity citations | **ALLOW** |
| `Claude-User` / `Claude-SearchBot` | User fetch / search retrieval | Claude citations | **ALLOW** |
| `Bingbot` | Bing organic + **Copilot** | Bing + Copilot entirely | **ALLOW** |
| `ChatGPT-User` | User-triggered fetch | User lookups | **ALLOW** |
| `OAI-AdsBot` | Ad-page safety; explicitly not training | Nothing we use | ALLOW (harmless) |
| `GPTBot` | Foundation-model **training** | Training inclusion only | **ALLOW** (see below) |
| `ClaudeBot` | Training | Training inclusion only | **ALLOW** |
| `Google-Extended` | **Gemini training ONLY.** Does *not* affect AI Overviews (those run on Googlebot) and does *not* affect organic rank. | Gemini training inclusion | **ALLOW** |

**Recommendation: allow everything, including training bots. Deliberately** — the reasoning matters because the default industry advice is now "block training, allow retrieval":

- **The whole point of this site is to be the source of truth for Ayurveda.** A model trained on an evidence-honest corpus carries our framing into every **ungrounded** answer it ever gives — including the majority of answers involving no retrieval and no citation. That is the *deepest* possible distribution for a corpus whose purpose is to correct a misinformed field. Blocking training to protect content we give away for free anyway would be strategically incoherent.
- **It is the "duty and gratitude" voice made operational.** A site whose stated posture is stewardship of a science that has given the family much does not paywall that science against machines. Blocking GPTBot would be the charity-flavoured, brand-protective move the voice explicitly rejects.
- **There is no revenue to cannibalise.** The zero-click objection does not bind on a site with no conversion to lose. Its KPI is **reach of correct framing**, and training maximises exactly that.
- **The counter-argument, stated fairly:** allowing training gives away the corpus with no attribution and no link. If Abilash's view is that the corpus is a group asset that should not train competitors' models for free, the trade is: block `GPTBot`/`ClaudeBot`/`Google-Extended`, keep every retrieval bot. **This costs us nothing in citations** — it forfeits only training inclusion. Legitimate, cheap, reversible. **I want it consciously chosen rather than defaulted into.**

**Machine-verified:** `packages/seo/src/index.js:135` `buildRobots()` emits a single `{ userAgent: "*", allow: "/" }`. **Every AI bot is already allowed — implicitly, by silence, with no recorded decision.** Whatever we choose, the robots policy must be **explicit and commented**, so the next agent does not "tidy" it into a block.

**🔴 Site-specific, NOT a fleet default.** The reasoning above (no revenue, corpus-is-the-mission) does **not** transfer to kairaliproducts/Shopify or KTAHV, where the trade is genuinely different and training-blocks may be right.

### 4b.5 llms.txt — keep it, stop believing in it

97% never fetched. AI retrieval bots = 1.1% of the traffic to the 3% that were. Google refuses to support it. It is a site-operator-controlled file, therefore trivially gameable, therefore ignorable. We already ship one (`app/llms.txt/route.ts`), it is accurate, it costs nothing. Its one *real* audience is coding agents that do fetch it.

**Call: KEEP. Do not extend. Do not count it in any AEO report. Do not build tooling for it.** If it ever appears in an audit as a "pass", the audit is measuring the wrong thing — hence its position in §4b.6 as an **INFO line, not a gate**. (One exception, and it is a *correctness* fix not an AEO one: `llms.txt/route.ts:17` hardcodes the reviewer's name — that is Phase 0.4.)

### 4b.6 THE REUSABLE PASS/FAIL AUDIT CHECKLIST

**This is the specification for the `seo-aeo-geo-auditor` sub-agent that CLAUDE.md's doctrine (n)/(o) promises but which DOES NOT EXIST in the repo (verified — no such agent found). Lift this section wholesale. Runnable against ANY Kairali site.**

**Rules of engagement:**
- Every check is **PASS / FAIL / N-A / INFO**. **No scores, no "partial"** (doctrine f: unverified is reported unverified).
- **A FAIL is never fixed by weakening the check** (doctrine g).
- Evidence — URL, grep output, JSON-LD dump — is **pasted, never summarised** (proof-of-work rules).
- **INFO checks never gate.** They exist to stop us reporting folklore as a win.
- **Register-aware:** KTAHV clinical-lock ≠ Villa Raag ≠ KAPPL ≠ group. Do not cross-apply.

**A. Access & retrievability — GATING** *(a failure here zeroes everything downstream)*

| # | Check | PASS criterion |
|---|---|---|
| A1 | `Googlebot` not blocked in robots.txt | Blocking = total loss of organic AND AI Overviews AND AI Mode. Never. |
| A2 | `OAI-SearchBot`, `PerplexityBot`, `Claude-User`/`Claude-SearchBot`, `Bingbot` not blocked | These are the **citation** bots |
| A3 | Training-bot posture (`GPTBot`, `ClaudeBot`, `Google-Extended`) is **explicit and matches a recorded DECISIONS.md ruling** | **Either stance passes. SILENCE FAILS.** Per-site, not fleet-default |
| A4 | `Google-Extended` block (if present) is not believed to affect AI Overviews | It doesn't. Fails only if docs/comments claim otherwise |
| A5 | Primary content in **server-rendered HTML**, not JS-only | `curl` + grep the answer text. Renderers ≠ crawlers |
| A6 | No `nosnippet` / `max-snippet:0` / `data-nosnippet` on answer content | Directly suppresses AI-feature inclusion (Google, primary) |
| A7 | Canonical + sitemap present; page reachable ≤3 clicks | Retrieval floor |
| A8 | HTTP 200, no redirect chains, no mixed content | Retrieval floor |

**B. Extractability — GATING**

| # | Check | PASS criterion |
|---|---|---|
| B1 | Direct answer in the **first 40–80 words**, before context | Passage retrieval |
| B2 | **No anaphora** in any capsule: `as mentioned above`, `this article`, `see below`, bare leading `It`/`This` | Chunks are retrieved **alone** |
| B3 | Every section independently answers a **stated** question | Query fan-out |
| B4 | H2/H3s question-shaped **and mapped to a real query** in the site's demand file | Real queries, not invented ones |
| B5 | Answer content in **text**, not baked into images/video | Google, primary |
| B6 | FAQs visible in **rendered HTML**, not schema-only | Visible Q&A > JSON-LD |

**C. Substance — GATING** *(the factors the 252k study says actually decide it)*

| # | Check | Odds ratio / note |
|---|---|---|
| C1 | **Evidence-backed claims** — every efficacy/benefit claim carries a citation | **OR 2.09 – >>10k. THE single highest-value check in this list.** |
| C2 | **Comprehensive, not shallow** — covers the fan-out sub-questions, not just the head term | OR 3.98 – >>10k |
| C3 | **No missing specifications** — dose, duration, n, contraindications where applicable | OR 8.63–243 |
| C4 | **No internal contradictions** across the page/site | OR 1.74–4.09 |
| C5 | **No keyword gaps** — the concepts a user would search are present | OR 5.99–40.0. **Coverage, NOT density** |
| C6 | **Comparison with alternatives** present where meaningful | OR 1.61–7.45 |
| C7 | **Decisive, not vague** — no `may possibly`/`some find`/`more research needed` without a specific number alongside | §4b.2. **Bans vagueness. NEVER construe as licence for confident health claims — C8 outranks it.** |
| C8 | **YMYL claim safety** — no `cure`/`treats`/`heals`/`guaranteed`; clinical pages carry safety + contraindications | Hard gate 6/7. **OUTRANKS C7 in every conflict.** |

**D. Freshness & trust — GATING**

| # | Check | Note |
|---|---|---|
| D1 | Real, per-page `dateModified` — **not a shared build constant** | **Universal gatekeeper.** This is the check that catches the `REVIEWED` defect |
| D2 | Clinical pages carry `lastReviewed` **tied to an actual review event** | Honesty + gate 7. **A build date here is a FAIL, not a warning** |
| D3 | Named, credentialed reviewer, resolvable to an `/about` anchor; reviewer from **config/roster, not hard-coded** | E-E-A-T + the roster ruling |
| D4 | Content ≤12mo (warn) / ≤24mo (**FAIL on clinical**) | Recency gatekeeper |
| D5 | Publisher disclosure visible — who publishes, **and their commercial interest** | Trust; the site's own stated voice |

**E. Entity clarity — GATING**

| # | Check |
|---|---|
| E1 | Canonical entity named + `sameAs` → Wikidata/authoritative ID |
| E2 | Ambiguous entities **explicitly disambiguated** (brahmi = *Bacopa monnieri* vs *Centella asiatica*) |
| E3 | `Organization` schema with consistent NAP + `sameAs`, `@id`-linked across the site |
| E4 | Entity naming consistent across **every locale** (fleet rule: all locales or flagged) |

**F. Structured data — correctness GATES; presence does NOT**

| # | Check | Status |
|---|---|---|
| F1 | JSON-LD parses; no schema.org validator errors | **GATING** — broken markup is a defect |
| F2 | Types match content (MedicalWebPage/Substance/Article/FAQPage) | **GATING** on correctness |
| F3 | `@id` graph internally resolvable | **GATING** on correctness — *catches the dead `#medical-reviewer` anchor* |
| F4 | **Schema claims match visible page content** — no date/reviewer/claim in JSON-LD the page doesn't show | **GATING.** This is a **lying-to-machines** check, not an SEO check |
| F5 | FAQPage present where FAQs exist | **INFO** — rich results dead since May 2026; helps Copilot; expect nothing |
| F6 | Schema presence as an AI-citation lever | **INFO ONLY. NEVER GATE.** Google: *"no special schema.org structured data that you need to add"* |

**G. Known-null — INFO ONLY, MUST NEVER GATE** *(this section exists to stop future agents reporting folklore as wins)*

| # | Check | Status |
|---|---|---|
| G1 | `llms.txt` present | **INFO.** 97% never fetched. Not a win. Do not build for it |
| G2 | Visual organisation / formatting polish | **INFO.** No reliable effect (7/18 null factors, 252k trials) |
| G3 | Promotional tone | **INFO.** No reliable effect — **but register locks still apply as brand/legal rules, independent of AEO** |
| G4 | Keyword density | **INFO.** Coverage matters (C5); density does not |

**H. Outcome measurement — INFO** *(the only checks that measure reality)*

| # | Check |
|---|---|
| H1 | **Binary citation presence**, per priority query, per engine (ChatGPT / Perplexity / AI Overviews / AI Mode / Copilot). Cited = yes/no. **Not average position — the failure mode is silence** |
| H2 | AI-bot hit log: is `OAI-SearchBot`/`PerplexityBot` **actually fetching us**? No fetches = no citations, and the A-section checks are then **UNVERIFIED, not passing** |
| H3 | Citation **accuracy** — when cited, is our framing preserved or distorted? |
| H4 | Rank⊥citation sanity: expect ~36% overlap with organic top-10. **Large divergence is normal, not a bug** |

**Audit output contract:**

```
audits/<site>-aeo-geo-<YYYY-MM-DD-HHMMSS-IST>.md
├── Verdict: PASS / FAIL          (any GATING failure ⇒ FAIL)
├── Gating failures               — pasted evidence per finding
├── INFO observations             — explicitly marked non-gating
├── Unverified                    — checks that could not be run, listed as UNVERIFIED, never as PASS  ← doctrine (f)
└── Escalations                   → QUESTIONS.md
```

**🔴 Q11: the `seo-aeo-geo-auditor` sub-agent does not exist.** §4b.6 is its spec. Who builds it, and does it gate CI or run as a Monday ritual (doctrine l/p)?

---

## 5 · SEED BATCH SPEC

### 5.1 The first 18 pages

**Selection rule:** demand from the **re-verified single terms only** (§3.1); where a term's number is known-unreliable, the page is still included **on structural grounds** (triphala's components; the brahmi/gotu-kola collision) and the demand column says so honestly. **No page is justified by a fake compound seed or a summed total.**

| # | Slug | Botanical | Demand basis | Status | Why |
|---|---|---|---|---|---|
| 1 | `/herbs/ashwagandha` | *Withania somnifera* | **673,000 US · 301,000 IN** ✅ re-verified | **REBUILD** | The reference implementation (§5.2). Largest single term in the corpus. Best-evidenced herb. Live liver + thyroid signals to model honestly. |
| 2 | `/herbs/turmeric` | *Curcuma longa* | **301,000 US** ✅ re-verified | **REBUILD** | 2nd largest US term. The pull's `turmeric curcumin` seed understated it **11×** — this page exists because the audit caught that. |
| 3 | `/herbs/moringa` | *Moringa oleifera* | **201,000 US** ✅ re-verified | NEW | 3rd largest US term. |
| 4 | `/herbs/shilajit` | *Asphaltum punjabianum* | **246,000 IN** ✅ re-verified (US pull faulty) | NEW | Largest verified India term after ashwagandha. **Not a plant — a mineral exudate.** Forces `partsUsed`/`Substance` correctness early, and it is a heavy-metals-adjacent product class. |
| 5 | `/herbs/amla` | *Phyllanthus emblica* | **165,000 IN** ✅ re-verified | NEW | The `amla amalaki` seed understated it **25×**. Also **triphala component 1/3**. |
| 6 | `/herbs/shatavari` | *Asparagus racemosus* | **90,500 IN** ✅ re-verified (US pull faulty) | NEW | Verified India volume. Women's-health register → forces the pregnancy/lactation fields to be real. |
| 7 | `/herbs/gokshura` | *Tribulus terrestris* | **27,100 IN** ✅ re-verified (US pull faulty) | NEW | Verified. `tribulus terrestris` is a large *US* term the pull never seeded — **flag for re-pull.** |
| 8 | `/herbs/brahmi` | *Bacopa monnieri* | 49,500 IN · 5,400 US ⚠️ | **REBUILD** | **The entity-collision demo.** `brahmi` = *Bacopa* OR *Centella* depending on region. `notToBeConfusedWith` earns its place here. Currently ships with only **2 citations** — thin for a YMYL page carrying interaction warnings. |
| 9 | `/herbs/gotu-kola` | *Centella asiatica* | 22,200 US · 9,900 IN ⚠️ | NEW | The other half of the collision. Ships **with** #8 or neither ships. |
| 10 | `/herbs/neem` | *Azadirachta indica* | 49,500 IN · 22,200 US ⚠️ | NEW | Large in both markets. |
| 11 | `/herbs/bhringraj` | *Eclipta prostrata* | 110,000 IN ⚠️ | NEW | Large India term; maps to the hair-fall long-tail (the top condition query, 4,400 IN). |
| 12 | `/herbs/punarnava` | *Boerhavia diffusa* | 60,500 IN ⚠️ | NEW | Large India term. |
| 13 | `/herbs/haritaki` | *Terminalia chebula* | 27,100 IN · 12,100 US ⚠️ | NEW | **Triphala component 2/3.** |
| 14 | `/herbs/bibhitaki` | *Terminalia bellirica* | 4,400 IN ⚠️ low | NEW | **Triphala component 3/3.** Included for *structure*, not demand — completes the cleanest hub-and-spoke demo in the corpus. Honest about its low volume. |
| 15 | `/herbs/manjistha` | *Rubia cordifolia* | 22,200 IN ⚠️ | NEW | India term. |
| 16 | `/herbs/guggul` | *Commiphora wightii* | 14,800 IN ⚠️ | NEW | **Carries the `contested: true` interaction demo** (§5.1.1). A resin — forces `partsUsed: ["resin"]`. |
| 17 | `/herbs/fenugreek` | *Trigonella foenum-graecum* | ⚠️ **NUMBER UNUSABLE** — the pull's `fenugreek methi` is a fake compound. Single-term `fenugreek` **not re-tested**. | NEW | Include on the strength of the compound seed still returning **135,000/135,000** (a fake compound scoring that high implies a large real term), but **flag: number must be re-pulled before it informs any further decision.** |
| 18 | `/herbs/triphala` | *(formulation — Amalaki + Haritaki + Bibhitaki)* | 74,000 IN · 14,800 US ⚠️ | **REBUILD → `type: "formulation"`** | **Keep the URL** (ranked; BUILD DECISION MATRIX rule 2). Retype. Ingredients → #5, #13, #14. Currently **2 citations** — thin. |

**Deliberately NOT in the seed batch, with reasons:**

| Excluded | Why |
|---|---|
| `tulsi` / holy basil | Pull used the fake compound `tulsi holy basil` (1,300/880). The real single term is certainly far larger. **Cannot rank it honestly until the re-pull.** Phase 2 — likely high. |
| `giloy` / guduchi | Same fault (`giloy guduchi`, 590/12,100). Real `giloy` is a large India term. **Re-pull first.** |
| `boswellia` / shallaki | Same fault (`boswellia shallaki`). Re-pull. |
| `yashtimadhu` / licorice | Same fault. Re-pull. |
| `kapikacchu` / mucuna | Returned 0/0 — same data fault class as shilajit/shatavari. **Re-pull before deciding.** |
| `arjuna` | 590/880 on a possibly-valid seed, but cardiac register = **riskTier-3 adjacency.** Not in the first batch. |

> **This exclusion list is itself the argument for the re-pull.** Six probable top-20 herbs are unrankable **only** because the seed was malformed. The seed batch is safe because its top 7 were re-verified as single terms — **the tail is not, and Phase 2 must not be ordered on this data.** 🔴 Q1.

**Phase 1 also ships (not herb pages, but the batch is broken without them):**

| Slug | Type | Why it is in Phase 1 |
|---|---|---|
| `/concepts/rasa`, `/concepts/guna`, `/concepts/virya`, `/concepts/vipaka`, `/concepts/karma` | `concept` (`conceptClass: "pharmacology"`) | **Every one of the 18 monographs deep-links into these** via `ayurveda.*.conceptRef`. They are **the legend for API field 8 — a field that appears on every herb entry in India's statutory drug standard.** That reframes them from "explainers" into *schema documentation for a legal standard*. **A monograph whose conceptRefs 404 is broken.** Ship them first or the batch has 90 dead links. |
| `/herbs` | `hub` | Regenerated from `_manifest.json` — proves "content, not code". |
| `data/interactions/*.json` ×18 · `data/product-classes.json` · `data/drug-classes.json` | data | The interactions block joins into every herb page. **`drug-classes.json` is not optional — without a controlled target vocabulary, the dataset becomes unqueryable within months.** |
| `/evidence-grades`, `/editorial-policy`, `/medical-disclaimer`, `/corrections` | `reference` | Phase 0. **`/evidence-grades` must be public BEFORE any grade renders.** |

**5.1.1 — three honesty demos deliberately built into the seed batch.** These are not filler; each one proves a schema capability we would otherwise discover we lack at page 200:

1. **`no_interaction_found` (ginger/warfarin class).** The model must be able to say *"studied, and probably NOT an interaction."* A dataset that records only *presence* must either omit ginger (reader concludes nothing is known) or list it (reader concludes there is a risk). **Both are false.** `finding: "no_interaction_found"` + evidence B is a genuinely valuable, publishable, **reassuring** record — and **nobody in this niche publishes reassurance with citations.**
2. **`contested: true` (guggul, #16).** Guggul's human evidence is **one small 1994 crossover** (Dalvi SS et al., *J Assoc Physicians India* 1994;42(6):454–455, **PMID 7852226**): gugulipid 1 g significantly reduced Cmax and AUC of propranolol 40 mg (n=10) and diltiazem 60 mg (n=7), P<.01. **And the direction is contested** — in-vitro work on guggulsterone reports *inhibitory* activity toward CYP3A4, the opposite of the induction implied by that bioavailability drop. The honest entry: *"may alter blood levels of CYP3A4-metabolised drugs in **either** direction; one small human study; mechanism contested; do not combine without your doctor's knowledge."* **Calling it "St John's-type" would be scaremongering — inaccuracy in the opposite direction from the usual, but still inaccuracy.**
3. **The triphala myth, corrected (#18).** 🔴 **The brief asked for a "triphala/ginger antiplatelet" interaction. It is largely not real and we must not publish it.** Ginger: the PLOS ONE systematic review (Marx et al. 2015) found the evidence **equivocal** — of eight clinical trials, **four reported reduced platelet aggregation and four reported no effect**; the single ginger+warfarin trial found **no significant change to INR**. Triphala: **no human evidence of an antiplatelet or anticoagulant interaction exists.** The claim propagates through supplement-retailer blogs citing each other. The real peer-reviewed finding is different and more interesting: **reversible CYP1A/CYP3A inhibition raising oral bioavailability of phenacetin and midazolam — in rats.** The honest record is *"CYP inhibition shown in rats; human relevance unknown; no human bleeding data either way"* — a real, defensible, differentiating entry. **If we published "triphala thins your blood" we would be repeating exactly the unsourced supplement-marketing folklore the site exists to correct — in the safety section, where being wrong is most expensive.**

> **Two of the four interactions I was briefed to design around do not survive contact with the evidence.** Correcting the brief is the job.

### 5.2 WORKED EXAMPLE — `/herbs/ashwagandha`, complete, in the NEW schema

**Provenance discipline:** every value below traces to a source verified in the research pass (see the `_provenance` block at the end). **Where a fact was `[snippet-only]` or unretrieved, it is marked `null` with a note — never guessed** (rule 6). This file is **`signOff: "pending"` and CANNOT SHIP** until Dr. Deepu John reviews it and a real `reviewedOn` is recorded (hard gate 7) — that is the point: the schema makes the gate mechanical.

```jsonc
{
  "type": "herb",
  "slug": "/herbs/ashwagandha",
  "locale": "en",
  "title": "Ashwagandha: Evidence, Safety & Traditional Use | Ayurveda",
  "h1": "Ashwagandha (Withania somnifera)",
  "metaDescription": "Ashwagandha: what 29 trials actually found, the classical Ayurvedic profile, and the real safety limits — liver, thyroid, pregnancy. Physician-reviewed.",

  "healthTopic": "clinical",
  "clinical": true,
  "register_ok": "ok",
  "disclaimer": "herb-safety",
  "commercialInterest": "kappl",
  "routesTo": ["KAPPL", "KTAHV"],

  "author": { "key": "TBD-ROSTER", "anchor": "/about#author-TBD" },
  "review": {
    "reviewerKey": "deepu-john",
    "reviewedOn": null,
    "nextReviewDue": null,
    "signOff": "pending",
    "scope": "Full: evidence grades, safety block, interaction severities, classical attributions."
  },
  "publishedOn": "2026-07-14",
  "updatedOn": null,
  "updateHistory": [],

  "entity": {
    "canonicalName": "Withania somnifera",
    "kind": "herb",
    "sameAs": [
      "https://www.wikidata.org/wiki/Q1051579",
      "https://en.wikipedia.org/wiki/Withania_somnifera",
      "https://pubchem.ncbi.nlm.nih.gov/taxonomy/1001729"
    ],
    "alsoKnownAs": [
      "ashwagandha", "asvagandha", "aswagandha", "ashvagandha", "asgand", "asgandh",
      "winter cherry", "Indian ginseng", "Indian winter cherry",
      "Ajagandha", "Amangura", "Amukkirag", "Asundha", "Kanaje Hindi", "Kuthmithi", "Samm al ferakh"
    ],
    "notToBeConfusedWith": [
      { "name": "Ginseng (Panax ginseng)",
        "why": "Ashwagandha is often sold as 'Indian ginseng'. It is not a ginseng and is unrelated to Panax — it is a nightshade (Solanaceae). The two share no pharmacology." },
      { "name": "Physalis alkekengi (winter cherry)",
        "why": "'Winter cherry' is also a common name for Physalis alkekengi, a different plant." }
    ]
  },

  "answerCapsule": "Ashwagandha is the root of Withania somnifera, a nightshade used in Ayurveda as a rasayana. Twenty-nine trials and seven meta-analyses have studied it, mostly for stress, sleep and exercise capacity; the trials are small and short, and extracts vary from 0.2% to 35% withanolides, so doses are not comparable. It is contraindicated in pregnancy and has been linked to liver injury.",

  "comparedWith": [
    { "name": "Brahmi (Bacopa monnieri)", "slug": "/herbs/brahmi",
      "difference": "Brahmi's trials target memory and cognition; ashwagandha's target stress, cortisol and sleep. They are not interchangeable, and the tradition classes them differently — brahmi is medhya (mind-directed), ashwagandha balya and rasayana." },
    { "name": "Panax ginseng",
      "difference": "Frequently confused because of the 'Indian ginseng' trade name. Unrelated botanically (Solanaceae vs Araliaceae), different constituents, separate evidence bases. Nothing established about one transfers to the other." }
  ],

  "related": [
    { "slug": "/herbs/brahmi", "label": "Brahmi", "derivedFrom": "authored" },
    { "slug": "/herbs/shatavari", "label": "Shatavari", "derivedFrom": "authored" },
    { "slug": "/api/asvagandha", "label": "Ashwagandha in the Ayurvedic Pharmacopoeia of India", "derivedFrom": "apiRef" },
    { "slug": "/formulations/ashwagandhadyarishta", "label": "Ashwagandhadyarishta", "derivedFrom": "api-field-9" }
  ],

  "breadcrumb": [
    { "name": "What is Ayurveda", "url": "/what-is-ayurveda" },
    { "name": "Ayurvedic Herbs", "url": "/herbs" },
    { "name": "Ashwagandha", "url": "/herbs/ashwagandha" }
  ],

  "herb": {
    "oneLiner": "The root of a nightshade, used in Ayurveda as a rejuvenative; studied mainly for stress.",

    "mainBenefits": [
      { "value": "Cortisol: the most consistently reported outcome across trials, with a reduction reported in multiple randomised trials.",
        "cites": [{ "ref": 5 }], "confidence": "established" },
      { "value": "Perceived stress and anxiety scores: reduced in several small randomised trials over 4–12 weeks.",
        "cites": [{ "ref": 1 }, { "ref": 4 }], "confidence": "contested" },
      { "value": "Sleep quality: modest improvements reported, on subjective scales, in short trials.",
        "cites": [{ "ref": 4 }], "confidence": "contested" }
    ],
    "mainDrawbacks": [
      { "value": "Long-term safety is not known. NIH ODS states it appears well tolerated for up to about 3 months of use, and that its long-term safety is not established.",
        "cites": [{ "ref": 4 }], "confidence": "established" },
      { "value": "Liver injury is a real, documented signal. LiverTox assigns likelihood score B — a likely cause of clinically apparent liver injury — with roughly 23 published cases since 2017, and fatal acute liver failure described.",
        "cites": [{ "ref": 3 }], "confidence": "established" },
      { "value": "Trial extracts were standardised from 0.2% to 35% withanolides, and many trials did not disclose the figure. A dose in milligrams is close to meaningless without it.",
        "cites": [{ "ref": 5 }], "confidence": "established" },
      { "value": "Much of the research is manufacturer-funded, frequently around proprietary extracts.",
        "cites": [{ "ref": 5 }], "confidence": "established" },
      { "value": "It may raise thyroid hormone levels; case reports describe thyrotoxicosis and painless thyroiditis.",
        "cites": [{ "ref": 4 }, { "ref": 6 }, { "ref": 7 }], "confidence": "established" }
    ],
    "bottomLine": "Ashwagandha is the most-studied herb in Ayurveda, and the evidence still cannot tell you how much to take. The trials are small, short, use extracts that differ by more than a hundredfold in withanolide content, and are often funded by the companies selling them. The most consistent finding is a reduction in cortisol — which is a hormone measurement, not a life outcome. Its safety is reasonably characterised for about three months and unknown beyond that, and it carries a real liver signal. If you are pregnant, do not take it. If you have thyroid or liver disease, or take sedatives, do not take it without telling the doctor who manages that condition.",

    "botanical": {
      "latin": "Withania somnifera (L.) Dunal",
      "family": "Solanaceae (nightshade)",
      "partsUsed": ["root"],
      "description": "A perennial shrub. The Ayurvedic Pharmacopoeia of India defines the drug as the dried mature roots, collected in winter, washed and cut into short pieces.",
      "nativeRange": ["India"],
      "cultivatedIn": ["India (notably parts of Madhya Pradesh and Rajasthan)"]
    },
    "names": {
      "sanskrit": [
        { "iast": "aśvagandhā", "devanagari": "अश्वगन्धा",
          "meaning": "'smell of a horse' — aśva (horse) + gandha (smell), for the odour of the fresh root",
          "cites": [{ "ref": 4 }] },
        { "iast": "hayagandhā", "devanagari": "हयगन्धा", "meaning": "API-listed Sanskrit synonym", "cites": [{ "ref": 2, "note": "API Part I Vol I, monograph 10, SYNONYMS" }] },
        { "iast": "vājigandhā", "devanagari": "वाजिगन्धा", "meaning": "API-listed Sanskrit synonym", "cites": [{ "ref": 2, "note": "API Part I Vol I, monograph 10, SYNONYMS" }] }
      ],
      "regional": [
        { "lang": "ml", "script": "അമുക്കുരം",  "roman": "Amukkuram" },
        { "lang": "hi", "script": "असगंध",       "roman": "Asgandh" },
        { "lang": "ta", "script": "அமுக்கரா கிழங்கு", "roman": "Amukkaramkizangu" },
        { "lang": "te", "script": "పెన్నేరుగడ్డ",  "roman": "Pennerugadda" },
        { "lang": "kn", "script": "ಅಂಗಾರಬೇರು",   "roman": "Angarberu" },
        { "lang": "bn", "script": "অশ্বগন্ধা",    "roman": "Ashvagandha" },
        { "lang": "mr", "script": "असगंधा",       "roman": "Asagandha" },
        { "lang": "gu", "script": "અસગંધ",        "roman": "Asgandha" },
        { "lang": "or", "script": "ଅଶ୍ୱଗନ୍ଧା",   "roman": "Aswagandha" },
        { "lang": "pa", "script": "ਅਸਗੰਧ",       "roman": "Asgandh" },
        { "lang": "as", "script": "অশ্বগন্ধা",    "roman": "Ashvagandha" },
        { "lang": "ur", "script": "اسگند",       "roman": "Asgand" }
      ],
      "english": ["winter cherry", "Indian ginseng", "Indian winter cherry"],
      "misleadingNames": [
        { "name": "Indian ginseng",
          "whyMisleading": "It is not a ginseng. Ginseng is Panax (Araliaceae); ashwagandha is Withania (Solanaceae, the nightshade family). The name is a trade convenience and implies a pharmacology the plant does not share." }
      ]
    },
    "chemistry": {
      "keyConstituents": [
        { "name": "Withanolides", "class": "steroidal lactone", "cites": [{ "ref": 2 }] },
        { "name": "Alkaloids", "class": "alkaloid", "cites": [{ "ref": 2 }] }
      ],
      "markerCompound": "Withanolides"
    },

    "ayurveda": {
      "rasa": [
        { "iast": "Tikta",  "gloss": "bitter",     "conceptRef": "/concepts/rasa#tikta" },
        { "iast": "Kaṣāya", "gloss": "astringent", "conceptRef": "/concepts/rasa#kasaya" }
      ],
      "guna":  [{ "iast": "Laghu",   "gloss": "light",  "conceptRef": "/concepts/guna#laghu" }],
      "virya":  { "iast": "Uṣṇa",    "gloss": "heating", "conceptRef": "/concepts/virya#usna" },
      "vipaka": { "iast": "Madhura", "gloss": "sweet post-digestive effect", "conceptRef": "/concepts/vipaka#madhura" },
      "prabhava": null,
      "doshaKarma": { "vata": "↓", "pitta": "—", "kapha": "↓",
                      "cites": [{ "ref": 2, "note": "API Karma: Vātakaphāpaha — 'removes vata and kapha'" }] },
      "karma": [
        { "iast": "Rasāyana",      "gloss": "rejuvenative; a category of preparations the tradition holds to restore vitality", "conceptRef": "/concepts/karma#rasayana",      "cites": [{ "ref": 2 }] },
        { "iast": "Vātakaphāpaha", "gloss": "reduces vata and kapha",                                                            "conceptRef": "/concepts/karma#vatakaphapaha", "cites": [{ "ref": 2 }] },
        { "iast": "Balya",         "gloss": "strength-giving",                                                                   "conceptRef": "/concepts/karma#balya",         "cites": [{ "ref": 2 }] },
        { "iast": "Vājīkaraṇa",    "gloss": "aphrodisiac; the classical category concerned with sexual and reproductive vitality","conceptRef": "/concepts/karma#vajikarana",    "cites": [{ "ref": 2 }] }
      ],
      "classicalSources": [
        { "textId": "charaka-samhita", "locus": "Cited in API Appendix-7 (Classical Ayurvedic References) for this monograph", "ref": 2 }
      ],
      "apiListed": true,
      "apiRef": { "part": "I", "volume": "I", "monographNo": 10, "page": "19–20", "slug": "/api/asvagandha" },
      "epistemicNote": "Rasa, guna, virya, vipaka and karma are categories of Ayurvedic pharmacology, recorded here from India's statutory drug standard and the classical texts cited. They describe how the tradition classifies this plant. They are not measurements, and they are not claims that the plant has these effects in the body as modern science defines them. The evidence section below is a separate question with separate sources.",
      "cites": [{ "ref": 2, "note": "API Part I Vol I, monograph 10, PROPERTIES AND ACTION" }]
    },

    "traditionalUses": [
      { "use": "Śotha", "context": "Listed under THERAPEUTIC USES in the Ayurvedic Pharmacopoeia of India. This is a statutory record of traditional indications, not a finding of clinical efficacy. The English equivalent should be taken from the API's own index of English equivalents of Ayurvedic clinical conditions — we have not translated it ourselves.", "cites": [{ "ref": 2 }], "testedModernly": false, "neverTested": true },
      { "use": "Kṣaya",     "context": "API THERAPEUTIC USES. See the note above on translation.", "cites": [{ "ref": 2 }], "testedModernly": false, "neverTested": true },
      { "use": "Daurbalya", "context": "API THERAPEUTIC USES. See the note above on translation.", "cites": [{ "ref": 2 }], "testedModernly": false, "neverTested": true },
      { "use": "Vātaroga",  "context": "API THERAPEUTIC USES. See the note above on translation.", "cites": [{ "ref": 2 }], "testedModernly": false, "neverTested": true },
      { "use": "Klaibya",   "context": "API THERAPEUTIC USES. See the note above on translation. Translating this freehand is exactly how a reference site invents a claim.", "cites": [{ "ref": 2 }], "testedModernly": false, "neverTested": true }
    ],
    "formulationsContaining": [
      { "name": "Aśvagandhādyariṣṭa",          "slug": "/formulations/ashwagandhadyarishta",        "role": "principal" },
      { "name": "Aśvagandhādi Leha",           "slug": "/formulations/ashwagandhadi-leha",          "role": "principal" },
      { "name": "Balāśvagandha Lākṣādi Taila", "slug": "/formulations/balashwagandha-lakshadi-taila","role": "adjuvant" }
    ],
    "traditionalContext": "Almost every trial on this page tested ashwagandha alone, as a capsule. That is a Western supplement pattern, not how Ayurveda prescribes. In classical practice the dravya appears inside formulations — the API lists three for this root — chosen against a particular person's constitution and state, with a specified vehicle. Examine's own dosage section concedes the point: when ashwagandha is used as part of the Ayurvedic system, it usually involves more than the herb alone. This matters for reading the evidence honestly in both directions: the trials do not test Ayurveda, and Ayurveda cannot claim their results.",

    "evidence": {
      "snapshot": {
        "referenceCount": 132,
        "trialCount": 29,
        "metaAnalysisCount": 7,
        "participantsTotal": 8803,
        "largestTrialN": null,
        "longestTrialWeeks": 12,
        "asOf": "2026-05-28"
      },
      "gradeScaleVersion": "wia-evidence-v1",
      "outcomes": [
        {
          "id": "cortisol",
          "outcome": "Cortisol",
          "category": "hormonal",
          "grade": "moderate",
          "direction": "decrease",
          "magnitude": "unclear",
          "interpretation": "context-dependent",
          "studyCount": null,
          "participants": null,
          "designs": ["rct", "meta-analysis"],
          "consistency": "mostly-consistent",
          "durationRangeWeeks": [4, 12],
          "populations": "adults with self-reported stress",
          "industryFunded": "some",
          "limits": "This is the outcome with the most consistent signal, and it is a blood measurement rather than a life outcome. A fall in cortisol is not, by itself, evidence that anyone felt or functioned better. Trials are small and none exceeds 12 weeks.",
          "cites": [{ "ref": 5 }]
        },
        {
          "id": "perceived-stress",
          "outcome": "Perceived stress and anxiety scores",
          "category": "stress",
          "grade": "preliminary",
          "direction": "decrease",
          "magnitude": "unclear",
          "interpretation": "improvement",
          "designs": ["rct"],
          "consistency": "mostly-consistent",
          "durationRangeWeeks": [4, 12],
          "populations": "adults with self-reported stress; not diagnosed anxiety disorders",
          "industryFunded": "some",
          "limits": "Trials typically enrol a few dozen people, run 4–12 weeks, and use different extracts at incomparable withanolide concentrations. NCCIH's position is that the evidence is limited and that larger, higher-quality studies are needed. NIH ODS reports it is challenging to develop recommendations precisely because the studies used various preparations and doses. Almost all trials are in self-reported stress, not in a diagnosed anxiety disorder.",
          "cites": [{ "ref": 1 }, { "ref": 4 }]
        },
        {
          "id": "sleep",
          "outcome": "Sleep quality",
          "category": "sleep",
          "grade": "preliminary",
          "direction": "decrease",
          "magnitude": "small",
          "interpretation": "improvement",
          "designs": ["rct"],
          "consistency": "mostly-consistent",
          "durationRangeWeeks": [6, 12],
          "populations": "adults, some with insomnia",
          "industryFunded": "some",
          "limits": "Improvements are modest and measured on subjective scales. NIH ODS's own fact sheet is titled as a question — 'Is it helpful for stress, anxiety, or sleep?' — and does not answer it in the affirmative.",
          "cites": [{ "ref": 4 }]
        },
        {
          "id": "aerobic-exercise",
          "outcome": "Aerobic exercise capacity",
          "category": "fitness",
          "grade": "preliminary",
          "direction": "increase",
          "magnitude": "unclear",
          "interpretation": "improvement",
          "designs": ["rct"],
          "consistency": "mostly-consistent",
          "industryFunded": "unclear",
          "limits": "Examine grades this outcome B on its own scale, below its A-tier. Trials are small and in varied populations. We report Examine's grade as their finding, not ours; our scale grades the evidence, not the effect.",
          "cites": [{ "ref": 5 }]
        },
        {
          "id": "testosterone",
          "outcome": "Testosterone in men",
          "category": "hormonal",
          "grade": "insufficient",
          "direction": "mixed",
          "magnitude": "unclear",
          "interpretation": "context-dependent",
          "designs": ["rct"],
          "consistency": "inconsistent",
          "industryFunded": "unclear",
          "limits": "Small trials report modest increases; the evidence is early and mixed. Direction of benefit is not universal — a hormonal change that is desirable in one population is not in another. This is not a proven fertility or performance treatment.",
          "cites": [{ "ref": 5 }]
        },
        {
          "id": "other-outcomes-distribution",
          "outcome": "The other 33 outcomes in Examine's database",
          "category": "other",
          "grade": "insufficient",
          "direction": "mixed",
          "magnitude": "unclear",
          "designs": ["rct"],
          "consistency": "inconsistent",
          "industryFunded": "unclear",
          "limits": "This row exists because the distribution is the honest headline. Examine grades 4 outcomes at A, 8 at B, 27 at C and 6 at D. Nearly all of the evidence on ashwagandha sits at C or below. Any page that shows you only the A-tier rows is showing you 4 outcomes out of 45.",
          "cites": [{ "ref": 5 }]
        }
      ],
      "notStudiedFor": [
        "Śotha, Kṣaya, Daurbalya, Vātaroga and Klaibya — the five indications India's statutory drug standard records for this root. We are not aware of human trials adequate to judge any of them as the API frames them.",
        "Ashwagandha as prescribed in Ayurveda — inside a formulation, matched to a constitution, with an anupana. Every trial cited here tested an isolated extract in a capsule.",
        "Any use beyond 12 weeks. No trial on this page runs longer."
      ],
      "evidenceCaveat": "Every claim in this section describes what has been studied, not what the herb does for you. Ashwagandha is studied for these outcomes; it is not proven to treat any condition, and nothing here is a basis for treating a diagnosed illness. The single most useful fact on this page is that trial extracts ranged from 0.2% to 35% withanolides — a more than hundredfold difference — which is why a milligram figure copied from a study cannot be applied to a bottle on a shelf."
    },

    "mechanisms": [
      { "claim": "Frequently described as an 'adaptogen', a modern term for substances claimed to help the body cope with stress.",
        "evidenceType": "hypothesis",
        "translationCaveat": "'Adaptogen' is a marketing and research convenience, not a proven pharmacological category, and NIH ODS itself describes it as loosely defined. It explains nothing; it names a hope.",
        "cites": [{ "ref": 4 }] }
    ],

    "forms": [
      { "form": "Churna (root powder)",       "tradition": "classical", "description": "The dried root, powdered. The form the API's dose refers to." },
      { "form": "Arishta (Aśvagandhādyariṣṭa)","tradition": "classical", "description": "A fermented preparation listed in the API's IMPORTANT FORMULATIONS for this root." },
      { "form": "Leha (Aśvagandhādi Leha)",   "tradition": "classical", "description": "A confection, API-listed." },
      { "form": "Taila (Balāśvagandha Lākṣādi Taila)", "tradition": "classical", "description": "A medicated oil, API-listed." },
      { "form": "Standardised extract, capsule","tradition": "modern",  "description": "The form used in nearly all clinical trials. Standardisation varies enormously and is often undeclared." }
    ],
    "dosage": {
      "studiedRanges": [
        { "form": "Standardised root extract, capsule", "amount": "see note", "unit": "mg",
          "durationWeeks": 12, "outcomeId": "perceived-stress",
          "cites": [{ "ref": 5, "note": "Examine, Dosage Information — 'Range of dosages studied'. We have deliberately NOT extracted a single milligram figure here: trial extracts were standardised from 0.2% to 35% withanolides and many did not disclose it, so a bare mg number would be misinformation. The withanolide content, not the capsule weight, is the dose. Populate this field per-trial with form + marker % + duration or leave it as this note." } ]
        }
      ],
      "classicalDosage": {
        "value": "3–6 g of the drug in powder form.",
        "cites": [{ "ref": 2, "note": "API Part I Vol I, monograph 10, DOSE" }],
        "confidence": "established"
      },
      "standardization": {
        "marker": "Withanolides",
        "rangeStudiedPct": [0.2, 35],
        "note": "Trials used extracts standardised anywhere from 0.2% to 35% withanolides, and many did not label the intended amount. This is a more than hundredfold range. It means '300 mg of ashwagandha' is very close to meaningless as a dose, and it is the main reason no one can responsibly tell you how much to take. Separately, the API's own assay standard for the raw drug is not less than 0.2% total alkaloids — a different measure, for a different purpose.",
        "cites": [{ "ref": 5 }, { "ref": 2 }]
      },
      "anupana": [
        { "value": "Classical practice specifies a vehicle (anupana) — commonly milk or ghee for this dravya. We have not sourced a specific classical locus for ashwagandha's anupana and are not going to assert one from memory. This field stays empty until a cited primary source is read.",
          "cites": [], "confidence": "single-source" }
      ],
      "noRecommendation": "We report what was studied. We do not tell you how much to take. A dose without the extract's withanolide percentage, the form, the duration and the population it was tested in is not information — and the trials on this page disagree with each other on all four.",
      "disclaimerRef": "/medical-disclaimer"
    },

    "safety": {
      "summary": [
        "NIH ODS: ashwagandha appears to be well tolerated for up to about 3 months of use, but its long-term safety is not known.",
        "Common side effects — loose stools, nausea, drowsiness — are usually mild.",
        "There are a few reports of more serious effects, including adverse effects on liver function.",
        "It might also affect thyroid function and interact with some medications.",
        "Some experts advise against its use by women who are pregnant and by men with hormone-sensitive prostate cancer."
      ],
      "sideEffects": [
        { "effect": "Loose stools", "frequency": "common", "route": "oral", "severity": "mild", "notes": "Usually mild, per NIH ODS.", "cites": [{ "ref": 4 }] },
        { "effect": "Nausea",       "frequency": "common", "route": "oral", "severity": "mild", "notes": "Usually mild, per NIH ODS.", "cites": [{ "ref": 4 }] },
        { "effect": "Drowsiness",   "frequency": "common", "route": "oral", "severity": "mild", "notes": "Appears mild and transient; relevant to the sedative interaction below.", "cites": [{ "ref": 4 }] },
        { "effect": "Clinically apparent liver injury", "frequency": "case-report", "route": "oral", "severity": "severe",
          "notes": "Roughly 23 cases in the literature since first reported in 2017. Onset typically 2–12 weeks. Usually cholestatic or mixed, with jaundice and itching. Most cases mild to moderate and self-limited, resolving 1–4 months after stopping — but fatal acute liver failure has been described, particularly with pre-existing cirrhosis or advanced liver disease.",
          "cites": [{ "ref": 3 }] },
        { "effect": "Thyrotoxicosis / painless thyroiditis", "frequency": "case-report", "route": "oral", "severity": "moderate",
          "notes": "Case reports include thyrotoxicosis presenting with supraventricular tachycardia, and painless thyroiditis. Dechallenge positive.",
          "cites": [{ "ref": 6 }, { "ref": 7 }] }
      ],
      "contraindications": [
        { "condition": "Pregnancy", "strength": "avoid",
          "reason": "NIH ODS reports that some experts advise against use by women who are pregnant. The tradition has long regarded it as capable of causing miscarriage. There is no safe-dose evidence in pregnancy — not reassurance, an absence.",
          "cites": [{ "ref": 4 }] },
        { "condition": "Hormone-sensitive prostate cancer", "strength": "avoid",
          "reason": "NIH ODS reports that some experts advise against use by men with hormone-sensitive prostate cancer.",
          "cites": [{ "ref": 4 }] },
        { "condition": "Liver disease, especially cirrhosis or advanced liver disease", "strength": "avoid",
          "reason": "LiverTox describes fatal acute liver failure particularly in this group.",
          "cites": [{ "ref": 3 }] },
        { "condition": "Thyroid disease, or taking thyroid medication", "strength": "caution",
          "reason": "May raise thyroid hormone levels; case reports of thyrotoxicosis and thyroiditis. Use only with the knowledge of the doctor managing your thyroid.",
          "cites": [{ "ref": 4 }, { "ref": 6 }, { "ref": 7 }] },
        { "condition": "Taking immunosuppressants", "strength": "avoid",
          "reason": "A kidney-transplant rejection case is recorded in MSK's adverse-reaction listing for this herb.",
          "cites": [{ "ref": 8 }] }
      ],
      "pregnancy": { "status": "avoid",
        "rationale": "NIH ODS: some experts advise against use by women who are pregnant. The classical tradition and modern toxicological concern point the same way, and there is no safe-dose evidence. This is one of the few places on this site where the tradition and the regulators agree, and where we state a limit without hedging.",
        "cites": [{ "ref": 4 }] },
      "lactation": { "status": "avoid",
        "rationale": "Safety during breastfeeding is not established. Absence of evidence, not evidence of safety.",
        "cites": [{ "ref": 4 }] },
      "preSurgery": { "stopBeforeDays": 14,
        "reason": "NIH ODS states ashwagandha is not recommended for people about to have surgery; its sedative effects are the concern. Fourteen days is the conventional margin. Tell your surgeon and anaesthetist regardless of when you stopped.",
        "cites": [{ "ref": 4 }] },
      "populations": [
        { "group": "hormone-sensitive-cancer", "guidance": "NIH ODS reports expert advice against use in men with hormone-sensitive prostate cancer.", "cites": [{ "ref": 4 }] },
        { "group": "thyroid", "guidance": "Only with the knowledge of the doctor managing your thyroid; thyroid function may need monitoring.", "cites": [{ "ref": 4 }] },
        { "group": "hepatic", "guidance": "Avoid with existing liver disease. Stop and seek advice at the first sign of jaundice, dark urine or unusual fatigue.", "cites": [{ "ref": 3 }] },
        { "group": "children", "guidance": "We have no adequate paediatric safety data and will not extrapolate an adult position to children.", "cites": [] }
      ],
      "longTermSafety": "unknown",
      "wadaStatus": "not-prohibited",
      "seriousRiskFlags": [
        { "risk": "Drug-induced liver injury", "frequency": "rare but real — roughly 23 published cases since 2017",
          "signs": "yellowing of the eyes or skin, dark urine, itching, unusual fatigue, pain under the right ribs",
          "action": "Stop taking it and seek medical advice the same day. Tell the doctor you have been taking ashwagandha and, if you can, bring the bottle.",
          "cites": [{ "ref": 3 }] },
        { "risk": "Thyrotoxicosis", "frequency": "case-report",
          "signs": "palpitations, unexplained weight loss, heat intolerance, tremor, anxiety, fast heartbeat",
          "action": "Stop and contact the doctor who manages your thyroid.",
          "cites": [{ "ref": 6 }, { "ref": 7 }] }
      ]
    },

    "interactionsRef": "ashwagandha",
    "absenceStatement": "Most herb–drug combinations have never been studied. If a medicine is not listed here, that means we have no reliable record of it — not that the combination is safe.",

    "quality": {
      "standardizationVariance": {
        "marker": "Withanolides",
        "observedRangePct": [0.2, 35],
        "note": "Supplements contain widely ranging amounts of withanolides, generally without labelling the intended amount. Two bottles both saying '300 mg' can differ by more than a hundredfold in the compound the research is about.",
        "cites": [{ "ref": 5 }]
      },
      "heavyMetalRisk": {
        "level": "documented",
        "metals": ["lead", "mercury", "arsenic", "cadmium"],
        "evidence": "This is a property of manufactured products, not of the plant. Saper et al. bought 193 Ayurvedic medicines over the internet and found 20.7% (95% CI 15.2–27.1) contained detectable lead, mercury or arsenic. The finding that matters most is the split: rasa shastra products 40.6% versus non-rasa shastra 17.1% (P=.007), with median mercury of 20,800 µg/g against 34.5 µg/g. Ashwagandha churna is not a rasa shastra preparation. The other finding worth stating, because it cuts against a lazy assumption: US-manufactured products were 21.7% versus Indian-manufactured 19.5% — no significant difference. This is a manufacturing and market failure, not a geography.",
        "cites": [{ "ref": 9 }]
      },
      "productClassRefs": ["single-herb-churna", "rasa-shastra-bhasma"],
      "adulterants": [
        { "substance": "Leaf material substituted for root", "why": "Root and leaf are not pharmacologically equivalent, and the API defines the drug as the root.",
          "howToAvoid": "Check the label declares the plant part.", "cites": [{ "ref": 2 }] }
      ],
      "whatToLookFor": [
        "The plant part, declared. The API defines ashwagandha as the dried mature root. A label that will not say root or leaf is telling you something.",
        "The withanolide percentage, declared. Without it, the milligram figure is decoration.",
        "A certificate of analysis you can actually obtain, with third-party heavy-metal testing — not a claim on the box.",
        "A recognised manufacturing standard, and the ability to name it.",
        "If any of these is missing, that is a reason to reject the product. That test applies to every manufacturer, including ours."
      ],
      "regulatoryStatus": [
        { "region": "US", "status": "Not FDA-reviewed",
          "note": "Sold as a dietary supplement. It has not been reviewed by the FDA and is not subject to the quality standards and safety-information collection standards applicable to most prescription drugs. There are no FDA-approved Ayurvedic products.",
          "cites": [{ "ref": 4 }] },
        { "region": "IN", "status": "Listed in the Ayurvedic Pharmacopoeia of India, Part I, Vol. I, monograph 10",
          "note": "The API is listed in the First Schedule to the Drugs and Cosmetics Act, 1940. Compliance with its quality standards is the regulatory floor for Ayurvedic drugs manufactured in India. That is a statement about manufacturing standards, not about efficacy — and it does not reach a product bought from a website outside that jurisdiction, which is precisely the population the FDA and CDC contamination reports describe.",
          "cites": [{ "ref": 2 }] },
        { "region": "EU", "status": "Contested — DO NOT PUBLISH UNTIL VERIFIED",
          "note": "Research flagged a Danish ban (April 2023) and an ANSES precautionary warning (France, 2024), with the underlying risk assessment contested in the Ayurvedic literature. Both were captured as [snippet-only] and are NOT verified against a primary source. Rule: primary source or it does not ship. This entry stays null-in-effect until a human reads the primary documents.",
          "cites": [] }
      ],
      "commercialDisclosure": "Disclosure: the Kairali Ayurvedic Group publishes this site and manufactures ashwagandha products. That is a reason to read this page sceptically. We have stated the evidence limits and the contamination risks for this herb as strongly as the independent sources we cite — see the references above, and check them. Nothing on this page recommends buying anything, and the checklist above is written so you can use it to reject our products as easily as anyone else's."
    }
  },

  "sections": [
    { "h2": "What is ashwagandha?",
      "anchor": "what-is-it",
      "answersQuestion": "What is ashwagandha?",
      "capsule": "Ashwagandha is the dried root of Withania somnifera, a nightshade shrub native to India. Ayurveda classes it as a rasayana — a rejuvenative — and India's statutory drug standard lists it under monograph 10 of the Ayurvedic Pharmacopoeia. Its Sanskrit name means 'smell of a horse', for the odour of the fresh root. It is not a ginseng, despite the trade name.",
      "body": "…renders from `herb.botanical`, `herb.names`, `herb.chemistry` via <NamesBlock>. Prose here covers only what the typed fields cannot hold.",
      "citationRefs": [2, 4] },
    { "h2": "What does the classical tradition say about ashwagandha?",
      "anchor": "tradition",
      "answersQuestion": "What does Ayurveda say about ashwagandha?",
      "capsule": "The Ayurvedic Pharmacopoeia of India records ashwagandha as tikta and kashaya in rasa, laghu in guna, ushna in virya, madhura in vipaka, with karma of rasayana, vatakaphapaha, balya and vajikarana. These are the tradition's categories for classifying the plant. They are not measurements, and they are not claims about what it does in the body.",
      "body": "…renders from `herb.ayurveda` via <DravyagunaTable> + <ClassicalRefs>, in a visually distinct container labelled 'What the classical tradition says', with `epistemicNote` displayed, never collapsed.",
      "citationRefs": [2] },
    { "h2": "What does the evidence actually say about ashwagandha?",
      "anchor": "evidence",
      "answersQuestion": "Does ashwagandha work?",
      "capsule": "Twenty-nine trials and seven meta-analyses, about 8,803 participants. The most consistent finding is reduced cortisol — a blood measurement, not a life outcome. Stress, anxiety and sleep results are preliminary: small trials, none longer than 12 weeks, extracts ranging from 0.2% to 35% withanolides, several manufacturer-funded. Of the 45 outcomes Examine grades, 33 sit at C or D.",
      "body": "…renders from `herb.evidence` via <EvidenceTiers> + <EvidenceBox>. Every row shows grade, design, duration, population, industry funding and limits.",
      "citationRefs": [1, 4, 5] },
    { "h2": "How much ashwagandha was used in the studies?",
      "anchor": "dosage",
      "answersQuestion": "What dose of ashwagandha was studied?",
      "capsule": "We are not going to give you a number, and here is why that is the honest answer. Trial extracts were standardised from 0.2% to 35% withanolides — a more than hundredfold range — and many trials never disclosed the figure. The API's classical dose for the root powder is 3–6 g, which is a different preparation entirely. A milligram figure without the withanolide percentage is not a dose.",
      "body": "…renders from `herb.dosage`. The medical disclaimer renders INSIDE this H2, at the point of risk.",
      "citationRefs": [2, 5] },
    { "h2": "Is ashwagandha safe? Side effects, liver and thyroid",
      "anchor": "safety",
      "answersQuestion": "Is ashwagandha safe?",
      "capsule": "It appears well tolerated for up to about three months; beyond that, its safety is not known. Common effects — loose stools, nausea, drowsiness — are mild. Two signals are not: LiverTox rates it a likely cause of clinically apparent liver injury, with fatal cases described; and case reports describe thyrotoxicosis. Avoid in pregnancy. Stop 14 days before surgery.",
      "body": "…renders from `herb.safety` via <SafetyBlock>. `seriousRiskFlags` render first, with signs and actions.",
      "citationRefs": [3, 4, 6, 7] },
    { "h2": "Does ashwagandha interact with any medicines?",
      "anchor": "interactions",
      "answersQuestion": "Does ashwagandha interact with medications?",
      "capsule": "There are documented concerns with thyroid medication, sedatives, immunosuppressants and hepatotoxic drugs, each with a severity and an evidence level shown separately. Most herb–drug combinations have never been studied: if a medicine is not listed, we have no record of it — that is not the same as safe.",
      "body": "…renders from `data/interactions/ashwagandha.json` via <InteractionsTable>. `absenceStatement` renders verbatim beneath the table, always.",
      "citationRefs": [3, 4, 6, 7, 8] },
    { "h2": "How do I judge the quality of an ashwagandha product?",
      "anchor": "quality",
      "answersQuestion": "How do I know if an ashwagandha product is good quality?",
      "capsule": "Contamination is a property of products, not plants. Of 193 Ayurvedic medicines bought online, 20.7% contained lead, mercury or arsenic — and the risk concentrates sharply in rasa shastra preparations, 40.6% versus 17.1%. Ashwagandha churna is not one of those. Demand the plant part, the withanolide percentage, and a third-party heavy-metal certificate you can actually read.",
      "body": "…renders from `herb.quality` + `product-classes.json`. `commercialDisclosure` renders inline here. NO Kairali entity appears in this section (lint 24); the pathway aside renders BELOW it.",
      "citationRefs": [2, 4, 9] }
  ],

  "faqs": [
    { "q": "Is ashwagandha safe to take every day?",
      "a": "For up to about three months, it appears to be well tolerated in most healthy adults, per NIH ODS. Beyond three months, its safety is not known — no trial on this page runs longer than 12 weeks. Avoid it entirely in pregnancy and breastfeeding, and do not take it without medical advice if you have liver or thyroid disease.",
      "intent": "safety", "cites": [{ "ref": 3 }, { "ref": 4 }] },
    { "q": "Does ashwagandha help with anxiety and sleep?",
      "a": "Several small trials report reduced stress and anxiety scores and modestly better sleep over 4 to 12 weeks. Nearly all enrolled people with self-reported stress, not a diagnosed anxiety disorder, and the extracts are not comparable to each other. NCCIH's position is that the evidence is limited and larger, higher-quality studies are needed. Persistent anxiety or insomnia deserves assessment by a clinician; anxiety disorders have treatments with far stronger evidence than anything here.",
      "intent": "efficacy", "cites": [{ "ref": 1 }, { "ref": 4 }] },
    { "q": "Who should not take ashwagandha?",
      "a": "Do not take it if you are pregnant or breastfeeding, or if you have liver disease. NIH ODS reports expert advice against use by men with hormone-sensitive prostate cancer. Do not take it alongside immunosuppressants — a transplant-rejection case is on record. Take it only with the knowledge of your doctor if you have thyroid disease or take sedatives. Stop 14 days before surgery.",
      "intent": "safety", "cites": [{ "ref": 3 }, { "ref": 4 }, { "ref": 8 }] },
    { "q": "Can ashwagandha damage your liver?",
      "a": "Rarely, and it is a documented risk rather than a theoretical one. LiverTox gives it likelihood score B — a likely cause of clinically apparent liver injury — with roughly 23 published cases since 2017. Onset is typically 2 to 12 weeks, usually with jaundice and itching, and most cases resolve within 1 to 4 months of stopping. Fatal acute liver failure has been described, particularly in people with existing cirrhosis. If your eyes or skin yellow, your urine darkens, or you become unusually tired, stop and seek advice the same day.",
      "intent": "safety", "cites": [{ "ref": 3 }] },
    { "q": "How much ashwagandha should I take?",
      "a": "We do not give doses, and in this case the reason is unusually concrete: the extracts used in trials ranged from 0.2% to 35% withanolides, and many trials did not say which. A figure in milligrams copied from a study cannot be applied to a bottle whose withanolide content you do not know. The Ayurvedic Pharmacopoeia of India lists 3 to 6 grams of the root powder — a different preparation from a capsule extract. Dosing needs a physician who has examined you.",
      "intent": "dosage", "cites": [{ "ref": 2 }, { "ref": 5 }] },
    { "q": "Is ashwagandha the same as ginseng?",
      "a": "No. Ashwagandha is often sold as 'Indian ginseng', but it is Withania somnifera, a nightshade in the family Solanaceae. Ginseng is Panax, in the family Araliaceae. They are unrelated plants with different constituents and separate evidence bases. Nothing established about one carries over to the other.",
      "intent": "identity", "cites": [{ "ref": 4 }] },
    { "q": "What should I tell my doctor before taking ashwagandha?",
      "a": "Say: I am taking ashwagandha, this dose, for this long. Bring the actual bottle — the label lists the ingredients, and many Ayurvedic products are multi-herb formulations you cannot recite from memory. Mention it specifically if you take thyroid medication, sedatives, immunosuppressants, or anything that lowers blood sugar or blood pressure. If you are having surgery, tell the surgeon and the anaesthetist too.",
      "intent": "safety", "cites": [{ "ref": 4 }] }
  ],

  "citations": [
    { "n": 1, "text": "National Center for Complementary and Integrative Health (NCCIH). Ashwagandha.",
      "url": "https://www.nccih.nih.gov/health/ashwagandha",
      "type": "gov-authority", "primary": true, "publisher": "NCCIH", "industryFunded": false },
    { "n": 2, "text": "The Ayurvedic Pharmacopoeia of India, Part I, Volume I, monograph 10 (Aśvagandhā, Rt.), pp. 19–20. Government of India, Ministry of Health and Family Welfare, Department of AYUSH.",
      "url": "https://www.ayurveda.hu/api/API-Vol-1.pdf",
      "type": "pharmacopoeia", "primary": true, "year": 1989, "publisher": "Government of India",
      "industryFunded": false,
      "accessed": "2026-07-15" },
    { "n": 3, "text": "LiverTox: Clinical and Research Information on Drug-Induced Liver Injury — Ashwagandha. Bethesda (MD): National Institute of Diabetes and Digestive and Kidney Diseases.",
      "url": "https://www.ncbi.nlm.nih.gov/books/NBK548536/",
      "type": "gov-authority", "primary": true, "publisher": "NIDDK", "industryFunded": false },
    { "n": 4, "text": "NIH Office of Dietary Supplements. Ashwagandha: Is it helpful for stress, anxiety, or sleep? Fact Sheet for Health Professionals. Updated 2 May 2025.",
      "url": "https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/",
      "type": "gov-authority", "primary": true, "year": 2025, "publisher": "NIH ODS", "industryFunded": false },
    { "n": 5, "text": "Examine.com. Ashwagandha. Last updated 28 May 2026.",
      "url": "https://examine.com/supplements/ashwagandha/",
      "type": "narrative-review", "primary": false, "year": 2026, "publisher": "Examine.com",
      "industryFunded": false,
      "accessed": "2026-07-15" },
    { "n": 6, "text": "Ashwagandha as a Unique Cause of Thyrotoxicosis Presenting With Supraventricular Tachycardia. Cureus.",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9035336/",
      "type": "case-report", "primary": true, "industryFunded": false },
    { "n": 7, "text": "Painless Thyroiditis by Withania somnifera (Ashwagandha).",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10981964/",
      "type": "case-report", "primary": true, "industryFunded": false },
    { "n": 8, "text": "Memorial Sloan Kettering Cancer Center, About Herbs: Ashwagandha. Last updated 24 April 2024.",
      "url": "https://www.mskcc.org/cancer-care/integrative-medicine/herbs/ashwagandha",
      "type": "narrative-review", "primary": false, "year": 2024, "publisher": "MSKCC", "industryFunded": false },
    { "n": 9, "text": "Saper RB, Phillips RS, Sehgal A, et al. Lead, Mercury, and Arsenic in US- and Indian-Manufactured Ayurvedic Medicines Sold via the Internet. JAMA. 2008;300(8):915–923.",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2755247/",
      "type": "observational", "primary": true, "year": 2008, "n_participants": 193,
      "publisher": "JAMA", "doi": "10.1001/jama.300.8.915", "pmid": "18728265", "industryFunded": false }
  ],

  "_provenance": {
    "note": "NOT a schema field. Kept here for the reviewer; strip before commit or move to a sidecar.",
    "verifiedByDirectFetchInResearchPass": [
      "API monograph 10 field order, synonyms, properties/action, formulations, therapeutic uses, dose, assay, constituents — pypdf extraction, verbatim (teardown-texts-concepts §2.4)",
      "NIH ODS safety paragraph + 'Implications for use' + question-shaped H1 + AYUSH citation (teardown-herb-monograph §2.3)",
      "LiverTox score B, ~23 cases, 2–12wk latency, cholestatic/mixed, fatal cases (teardown-interactions §4; teardown-regulatory-news §12 — verified PRIMARY, and a snippet claiming 'C' was WRONG)",
      "Examine: 132 refs / 8,803 participants / 29 trials / 7 meta-analyses / A 4 · B 8 · C 27 · D 6 / 0.2–35% withanolides / WADA not-prohibited / Last Updated 28 May 2026 (teardown-herb-monograph §2.1)",
      "Drugs.com common-name list + Solanaceae + 'Withania somnifera (L.) Dunal' (teardown-herb-monograph §2.2)",
      "Saper 2008 full figures incl. rasa shastra 40.6% vs 17.1% P=.007, US 21.7% vs IN 19.5% (teardown-interactions §0.3, §4; teardown-regulatory-news §3.3)",
      "Thyroid case reports PMC9035336, PMC10981964 (teardown-interactions §1.3)",
      "MSK transplant-rejection adverse reaction (teardown-interactions §1.5)"
    ],
    "deliberatelyNullOrOmitted": [
      "review.reviewedOn / nextReviewDue / updatedOn — NO REAL REVIEW HAS OCCURRED. The whole point of Phase 0.1. signOff: pending ⇒ cannot ship.",
      "author.key — blocked on the roster (Q2). 'TBD-ROSTER' must fail lint, not ship.",
      "dosage.studiedRanges[].amount — a bare mg figure without the withanolide % would be misinformation. Populate per-trial or leave the note.",
      "anupana — no cited classical locus was read. NOT asserted from memory (rule 6).",
      "evidence.snapshot.largestTrialN / per-outcome studyCount+participants — Examine's Research Snapshot gives corpus totals, not per-outcome breakdowns. Needs a source read.",
      "traditionalUses[].englishEquivalent — MUST come from the API's own index of English equivalents. Translating Klaibya freehand is exactly how a YMYL site invents a claim.",
      "regulatoryStatus EU (Denmark ban / ANSES) — [snippet-only], NOT primary-verified. Does not ship until a human reads the primary documents.",
      "entity.sameAs Wikidata/PubChem IDs — plausible but NOT verified against the live entries this session. VERIFY BEFORE COMMIT.",
      "classicalSources locus — API Appendix-7 was identified as the source of this edge but the specific Charaka locus for this monograph was not extracted. Do not invent a chapter/verse."
    ],
    "openBeforeShip": [
      "Dr. Deepu John: ratify every evidence grade, every interaction severity, the classical attributions, and the pregnancy/liver/thyroid language (hard gate 7).",
      "Abilash: Q7 (disclosure wall) — this file assumes routesTo renders BELOW quality, and that no Kairali entity appears in MC.",
      "Validate the DietarySupplement mapping against Google's Rich Results Test before shipping."
    ]
  }
}
```

### 5.3 The same page in TODAY'S schema — buildable immediately

**Purpose:** if Phase 0 slips, this ships against the **current, unmodified** `Page` type. It drops in over `content/herbs__ashwagandha.json` today.

**Three things it fixes even without an engine change** — (a) adds the missing `h1` (the file is the 1-in-20 with none, so the 60-char SEO title currently renders as the H1); (b) **removes the COI violation** — the old §4 named KAPPL inside main content; the `routesTo` pathway aside already carries that correctly; (c) replaces vague hedges with specific numbers (§4b.2).

**What it still cannot express, and why this is not a substitute for Phase 0:** no per-page review date (the byline will still print the hard-coded `REVIEWED` constant — **the page will still claim a review that did not happen**), no `entity`/`sameAs`, no typed evidence grades, no `answersQuestion`, no `citations[].type`. **Ship this only as an interim; it does not close the honesty defect.**

```jsonc
{
  "slug": "/herbs/ashwagandha",
  "title": "Ashwagandha: Evidence, Safety & Traditional Use | Ayurveda",
  "h1": "Ashwagandha (Withania somnifera)",
  "metaDescription": "Ashwagandha: what 29 trials actually found, the classical Ayurvedic profile, and the real safety limits — liver, thyroid, pregnancy. Physician-reviewed.",
  "answerCapsule": "Ashwagandha is the root of Withania somnifera, a nightshade used in Ayurveda as a rasayana. Twenty-nine trials and seven meta-analyses have studied it, mostly for stress, sleep and exercise capacity; the trials are small and short, and extracts vary from 0.2% to 35% withanolides, so doses are not comparable. It is contraindicated in pregnancy and has been linked to liver injury.",
  "breadcrumb": [
    { "name": "What is Ayurveda", "url": "/what-is-ayurveda" },
    { "name": "Ayurvedic Herbs", "url": "/herbs" },
    { "name": "Ashwagandha", "url": "/herbs/ashwagandha" }
  ],
  "sections": [
    {
      "h2": "What is ashwagandha?",
      "capsule": "Ashwagandha is the dried root of Withania somnifera, a nightshade shrub native to India. Ayurveda classes it as a rasayana — a rejuvenative — and India's statutory drug standard lists it as monograph 10 of the Ayurvedic Pharmacopoeia. Its Sanskrit name means 'smell of a horse', for the odour of the fresh root. It is not a ginseng, despite the trade name.",
      "body": "The medicinal part is the root. The [Ayurvedic Pharmacopoeia of India](https://www.ayurveda.hu/api/API-Vol-1.pdf) defines the drug precisely: the dried mature roots of *Withania somnifera* Dunal, collected in winter, washed and cut into short pieces [2]. That precision matters — root and leaf are not pharmacologically equivalent, and a label that will not tell you which one it contains is telling you something.\n\nThe plant is a member of the Solanaceae, the nightshade family. **It is not a ginseng.** It is frequently sold as 'Indian ginseng', but ginseng is *Panax*, in the family Araliaceae — an unrelated plant with different constituents and a separate evidence base. Nothing established about one carries over to the other. It is also sold as 'winter cherry', a name shared with *Physalis alkekengi*, a different plant again.\n\nThe API records twelve regional names for it, which is a fair indication of how long and how widely it has been used: Amukkuram (Malayalam), Asgandh (Hindi and Punjabi), Amukkaramkizangu (Tamil), Pennerugadda (Telugu), Angarberu (Kannada), Ashvagandha (Bengali and Assamese), Asagandha (Marathi), Asgandha (Gujarati), Aswagandha (Oriya), Asagandh (Kashmiri), Asgand (Urdu) [2]. Its Sanskrit synonyms in the API are *hayagandhā* and *vājigandhā* — both, like *aśvagandhā* itself, referring to horses [2].\n\nIn the West it is usually called an 'adaptogen'. That is a marketing and research convenience, not a proven pharmacological category — NIH's Office of Dietary Supplements describes the term itself as loosely defined [4]. It names a hope rather than a mechanism, and it is worth knowing that when you read confident health-shop copy."
    },
    {
      "h2": "What does the classical tradition say about ashwagandha?",
      "capsule": "The Ayurvedic Pharmacopoeia of India records ashwagandha as tikta and kashaya in rasa, laghu in guna, ushna in virya, madhura in vipaka, with karma of rasayana, vatakaphapaha, balya and vajikarana. These are the tradition's categories for classifying the plant. They are not measurements, and they are not claims about what it does in the body.",
      "body": "India's statutory drug standard structures every monograph the same way, and this is what it records for ashwagandha root [2]:\n\n| Field | Value | In plain English |\n|---|---|---|\n| **Rasa** (taste) | Tikta, Kaṣāya | bitter, astringent |\n| **Guna** (quality) | Laghu | light |\n| **Virya** (potency) | Uṣṇa | heating |\n| **Vipaka** (post-digestive effect) | Madhura | sweet |\n| **Karma** (action) | Rasāyana, Vātakaphāpaha, Balya, Vājīkaraṇa | rejuvenative; reduces vata and kapha; strength-giving; concerned with sexual and reproductive vitality |\n\nThe API also lists five **therapeutic uses** for the root — *Śotha, Kṣaya, Daurbalya, Vātaroga, Klaibya* — and three formulations built on it: *Aśvagandhādyariṣṭa*, *Aśvagandhādi Leha*, and *Balāśvagandha Lākṣādi Taila* [2]. We have deliberately left those five Sanskrit terms untranslated here. The API publishes its own index of English equivalents for Ayurvedic clinical conditions, and that is the mapping to use; translating *Klaibya* freehand is exactly how a reference site quietly invents a medical claim.\n\n**What this section is and is not.** *Rasa*, *guna*, *virya*, *vipaka* and *karma* are categories of Ayurvedic pharmacology. They are recorded here from India's statutory drug standard, and they describe how the tradition classifies this plant. **They are not measurements, and they are not claims that the plant has these effects in the body as modern science defines them.** The next section is a separate question with separate sources, and the two should not be blended.\n\nOne more piece of honest context. Almost every trial in the next section tested ashwagandha alone, as a capsule. **That is a Western supplement pattern, not how Ayurveda prescribes.** In classical practice the root appears inside formulations — the API lists three — chosen against a particular person's constitution, with a specified vehicle. This cuts both ways: the trials do not test Ayurveda, and Ayurveda cannot claim their results."
    },
    {
      "h2": "What does the evidence actually say about ashwagandha?",
      "capsule": "Twenty-nine trials and seven meta-analyses, about 8,803 participants. The most consistent finding is reduced cortisol — a blood measurement, not a life outcome. Stress, anxiety and sleep results are preliminary: small trials, none longer than 12 weeks, extracts ranging from 0.2% to 35% withanolides, several manufacturer-funded. Of the 45 outcomes Examine grades, 33 sit at C or D.",
      "body": "Ashwagandha is the most-researched herb in Ayurveda. Here is the actual shape of that research, rather than the headline.\n\nThe corpus is roughly **8,803 participants across 29 trials and 7 meta-analyses**, drawn from 132 references [5]. That sounds substantial. The distribution is the honest part: of the 45 outcomes Examine grades, **4 reach A, 8 reach B, 27 sit at C and 6 at D** [5]. Nearly all of the evidence on this herb is weak evidence. **Any page that shows you only the A-tier rows is showing you four outcomes out of forty-five.**\n\n**Cortisol** is the most consistently reported finding, across multiple randomised trials [5]. It is worth being precise about what that means: cortisol is a hormone measurement, not a life outcome. A number falling in a blood test is not, by itself, evidence that anyone felt or functioned better.\n\n**Stress and anxiety scores** fell in several small randomised trials over four to twelve weeks [1][4]. Nearly all enrolled people with *self-reported stress*, not a diagnosed anxiety disorder. NCCIH's position is that the evidence is limited and larger, higher-quality studies are needed [1].\n\n**Sleep quality** improved modestly, on subjective scales, in short trials [4]. Note that NIH's Office of Dietary Supplements titles its own ashwagandha fact sheet as a question — *'Is it helpful for stress, anxiety, or sleep?'* — and does not answer it in the affirmative [4].\n\n**Testosterone in men**: small trials report modest increases; the evidence is early and mixed [5]. It is not a proven fertility or performance treatment.\n\n**The four limits that apply to all of it:**\n\n1. **The trials are small.** Most enrol a few dozen people.\n2. **The trials are short.** None on this page exceeds 12 weeks. There is no trial evidence at all for what happens after three months.\n3. **The extracts are not comparable.** Trials used extracts standardised anywhere from **0.2% to 35% withanolides** — a more than hundredfold range — and many never disclosed the figure [5].\n4. **Much of it is manufacturer-funded**, frequently around proprietary extracts [5].\n\nNIH ODS states the consequence plainly: it is challenging to develop recommendations for using ashwagandha, because the studies that have evaluated it used various preparations and doses [4]. That is the accurate position. It is studied for these outcomes; **it is not proven to treat any condition, and none of this is a basis for treating a diagnosed illness.**\n\nFor how this fits the wider question, see [Is Ayurveda scientific?](/is-ayurveda-scientific)."
    },
    {
      "h2": "How much ashwagandha was used in the studies?",
      "capsule": "We are not going to give you a number, and the reason is concrete. Trial extracts were standardised from 0.2% to 35% withanolides — a more than hundredfold range — and many trials never disclosed the figure. The API's classical dose for the root powder is 3–6 g, a different preparation entirely. A milligram figure without the withanolide percentage is not a dose.",
      "body": "**This section carries a [medical disclaimer](/) deliberately, right here, next to the numbers, rather than in a footer.** Nothing below is a dosing instruction.\n\nTwo separate figures exist, and merging them is the single commonest error in supplement copy:\n\n- **The classical dose.** The Ayurvedic Pharmacopoeia of India records **3–6 g of the drug in powder form** [2]. That is the dried root, powdered — *churna*. It is not a capsule extract, and the figure does not transfer to one.\n- **The studied doses.** Trials used standardised extracts. And here the honest answer is that **the number on its own is meaningless**: extracts in the trial literature range from **0.2% to 35% withanolides**, with many trials not disclosing which they used [5]. Two capsules both labelled '300 mg' can differ by more than a hundredfold in the compound the research is actually about.\n\n**So: we report what was studied. We do not tell you how much to take.** A dose without the extract's withanolide percentage, the form, the duration and the population it was tested in is not information — and the trials disagree with each other on all four. Dosing needs a physician who has examined you."
    },
    {
      "h2": "Is ashwagandha safe? Side effects, liver and thyroid",
      "capsule": "It appears well tolerated for up to about three months; beyond that its safety is not known. Common effects — loose stools, nausea, drowsiness — are mild. Two signals are not: LiverTox rates it a likely cause of clinically apparent liver injury, with fatal cases described; and case reports describe thyrotoxicosis. Avoid in pregnancy. Stop 14 days before surgery.",
      "body": "NIH's Office of Dietary Supplements states the position directly: ashwagandha appears to be well tolerated for up to about **3 months** of use, but **its long-term safety is not known**. Common side effects — loose stools, nausea, drowsiness — are usually mild. There are a few reports of more serious effects, including adverse effects on liver function. It might also affect thyroid function and interact with some medications [4].\n\n**Liver — the signal that matters most.**\nLiverTox, the NIH's drug-induced-liver-injury reference, assigns ashwagandha **likelihood score B: a likely cause of clinically apparent liver injury**. Roughly **23 cases** are in the literature, rising since first reported in 2017. Onset is typically **2 to 12 weeks**. The pattern is usually cholestatic or mixed, with jaundice and itching. Most cases are mild to moderate and resolve **1 to 4 months** after stopping — **but fatal acute liver failure has been described**, particularly with pre-existing cirrhosis or advanced liver disease [3].\n\n> **Stop taking it and seek medical advice the same day** if you notice yellowing of the eyes or skin, dark urine, itching, unusual fatigue, or pain under the right ribs. Tell the doctor you have been taking ashwagandha, and bring the bottle.\n\n**Thyroid.** It may raise thyroid hormone levels [4]. Case reports describe thyrotoxicosis presenting with supraventricular tachycardia [6] and painless thyroiditis [7]. If you have thyroid disease or take thyroid medication, do not start it without the knowledge of the doctor who manages that; thyroid function may need monitoring. Watch for palpitations, unexplained weight loss, heat intolerance or tremor.\n\n**Who should avoid it entirely:**\n\n- **Pregnancy — avoid.** NIH ODS reports that some experts advise against use by women who are pregnant [4]. The classical tradition has long regarded it as capable of causing miscarriage. There is no safe-dose evidence in pregnancy — that is an absence, not a reassurance. **This is one of the few places on this page where the tradition and the regulators agree, and we state it without hedging.**\n- **Breastfeeding — avoid.** Safety is not established [4].\n- **Existing liver disease — avoid** [3].\n- **Men with hormone-sensitive prostate cancer** — NIH ODS reports expert advice against use [4].\n- **Anyone taking immunosuppressants — avoid.** A kidney-transplant rejection case is on record [8].\n\n**Use only with your doctor's knowledge if you take:** sedatives, sleep aids or alcohol (additive drowsiness); thyroid medication; or drugs that lower blood sugar or blood pressure.\n\n**Surgery.** NIH ODS states it is not recommended for people about to have surgery, because of its sedative effects [4]. Stop at least **14 days** before, and tell the surgeon and the anaesthetist regardless of when you stopped.\n\n**And the sentence that governs this whole section:** most herb–drug combinations have never been studied. **If a medicine is not listed here, that means we have no reliable record of it — not that the combination is safe.**"
    },
    {
      "h2": "How do I judge the quality of an ashwagandha product?",
      "capsule": "Contamination is a property of products, not plants. Of 193 Ayurvedic medicines bought online, 20.7% contained lead, mercury or arsenic — and the risk concentrates sharply in rasa shastra preparations, 40.6% versus 17.1%. Ashwagandha churna is not one of those. Demand the plant part, the withanolide percentage, and a third-party heavy-metal certificate you can actually read.",
      "body": "**Disclosure first, because you should read the rest of this section knowing it: the Kairali Ayurvedic Group publishes this site and manufactures ashwagandha products. That is a reason to read this page sceptically.** We have stated the evidence limits above and the contamination risks below as strongly as the independent sources we cite. Check them. Nothing on this page recommends buying anything, and the checklist at the end is written so you can use it to reject our products as easily as anyone else's.\n\n**What the evidence on contamination actually says.** Saper and colleagues bought 193 Ayurvedic medicines over the internet and analysed them. **20.7% (95% CI 15.2–27.1) contained detectable lead, mercury or arsenic** [9].\n\nTwo findings inside that number matter more than the headline:\n\n1. **The risk concentrates in a specific class.** **Rasa shastra products: 40.6%. Non-rasa shastra: 17.1% (P=.007)** — with median mercury of **20,800 µg/g** against 34.5 µg/g [9]. Rasa shastra is the branch of the tradition in which **metals and minerals are added on purpose**, processed through prescribed steps. In those preparations the metals are *intentional*, not contamination. That is a real and serious safety question, and it is a different question from whether a root powder is contaminated. **Ashwagandha churna is not a rasa shastra preparation.**\n2. **It is not a geography.** US-manufactured products were **21.7%** versus Indian-manufactured **19.5%** — no significant difference [9]. This is a manufacturing and market failure, and it does not care where the factory is.\n\n**The regulatory floor, stated honestly.** In India, compliance with the API's quality standards is the floor for Ayurvedic drugs manufactured there — the API is listed in the First Schedule to the Drugs and Cosmetics Act, 1940 [2]. **That is a statement about manufacturing standards, not about efficacy — and it does not reach a product bought from a website outside that jurisdiction, which is precisely the population those contamination reports describe.** In the US, ashwagandha is sold as a dietary supplement: it has not been reviewed by the FDA and is not subject to the quality standards applicable to most prescription drugs [4].\n\n**What to demand of any manufacturer, including ours:**\n\n- **The plant part, declared.** The API defines ashwagandha as the dried mature *root* [2]. A label that will not say root or leaf is telling you something.\n- **The withanolide percentage, declared.** Without it the milligram figure is decoration.\n- **A certificate of analysis you can actually obtain**, with third-party heavy-metal testing — not a claim printed on the box.\n- **A recognised manufacturing standard**, and the ability to name it.\n\n**If any of those is missing, that is a reason to reject the product.** That test applies to every manufacturer without exception.\n\nTo see where ashwagandha sits among other herbs, see [brahmi](/herbs/brahmi) and [triphala](/herbs/triphala)."
    }
  ],
  "faqs": [
    { "q": "Is ashwagandha safe to take every day?",
      "a": "For up to about three months, it appears to be well tolerated in most healthy adults, per NIH's Office of Dietary Supplements. Beyond three months its safety is not known — no trial runs longer than 12 weeks. Avoid it entirely in pregnancy and breastfeeding, and do not take it without medical advice if you have liver or thyroid disease." },
    { "q": "Does ashwagandha help with anxiety and sleep?",
      "a": "Several small trials report reduced stress and anxiety scores and modestly better sleep over 4 to 12 weeks. Nearly all enrolled people with self-reported stress, not a diagnosed anxiety disorder, and the extracts are not comparable to each other. NCCIH's position is that the evidence is limited and larger, higher-quality studies are needed. Persistent anxiety or insomnia deserves assessment by a clinician; anxiety disorders have treatments with far stronger evidence than anything here." },
    { "q": "Who should not take ashwagandha?",
      "a": "Do not take it if you are pregnant or breastfeeding, or if you have liver disease. NIH ODS reports expert advice against use by men with hormone-sensitive prostate cancer. Do not take it alongside immunosuppressants — a transplant-rejection case is on record. Take it only with the knowledge of your doctor if you have thyroid disease or take sedatives. Stop 14 days before surgery." },
    { "q": "Can ashwagandha damage your liver?",
      "a": "Rarely, and it is a documented risk rather than a theoretical one. LiverTox gives it likelihood score B — a likely cause of clinically apparent liver injury — with roughly 23 published cases since 2017. Onset is typically 2 to 12 weeks, usually with jaundice and itching, and most cases resolve within 1 to 4 months of stopping. Fatal acute liver failure has been described, particularly in people with existing cirrhosis. If your eyes or skin yellow, your urine darkens, or you become unusually tired, stop and seek advice the same day." },
    { "q": "How much ashwagandha should I take?",
      "a": "We do not give doses, and here the reason is concrete: the extracts used in trials ranged from 0.2% to 35% withanolides, and many trials did not say which. A figure in milligrams copied from a study cannot be applied to a bottle whose withanolide content you do not know. The Ayurvedic Pharmacopoeia of India lists 3 to 6 grams of the root powder — a different preparation from a capsule extract. Dosing needs a physician who has examined you." },
    { "q": "Is ashwagandha the same as ginseng?",
      "a": "No. Ashwagandha is often sold as 'Indian ginseng', but it is Withania somnifera, a nightshade in the family Solanaceae. Ginseng is Panax, in the family Araliaceae. They are unrelated plants with different constituents and separate evidence bases. Nothing established about one carries over to the other." },
    { "q": "What should I tell my doctor before taking ashwagandha?",
      "a": "Say: I am taking ashwagandha, this dose, for this long. Bring the actual bottle — the label lists the ingredients, and many Ayurvedic products are multi-herb formulations you cannot recite from memory. Mention it specifically if you take thyroid medication, sedatives, immunosuppressants, or anything that lowers blood sugar or blood pressure. If you are having surgery, tell the surgeon and the anaesthetist too." }
  ],
  "citations": [
    { "n": 1, "text": "National Center for Complementary and Integrative Health (NCCIH). Ashwagandha.", "url": "https://www.nccih.nih.gov/health/ashwagandha" },
    { "n": 2, "text": "The Ayurvedic Pharmacopoeia of India, Part I, Volume I, monograph 10 (Aśvagandhā, Rt.), pp. 19–20. Government of India, Ministry of Health and Family Welfare, Department of AYUSH.", "url": "https://www.ayurveda.hu/api/API-Vol-1.pdf" },
    { "n": 3, "text": "LiverTox: Clinical and Research Information on Drug-Induced Liver Injury — Ashwagandha. Bethesda (MD): National Institute of Diabetes and Digestive and Kidney Diseases.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK548536/" },
    { "n": 4, "text": "NIH Office of Dietary Supplements. Ashwagandha: Is it helpful for stress, anxiety, or sleep? Fact Sheet for Health Professionals. Updated 2 May 2025.", "url": "https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/" },
    { "n": 5, "text": "Examine.com. Ashwagandha. Last updated 28 May 2026.", "url": "https://examine.com/supplements/ashwagandha/" },
    { "n": 6, "text": "Ashwagandha as a Unique Cause of Thyrotoxicosis Presenting With Supraventricular Tachycardia. Cureus.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9035336/" },
    { "n": 7, "text": "Painless Thyroiditis by Withania somnifera (Ashwagandha).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10981964/" },
    { "n": 8, "text": "Memorial Sloan Kettering Cancer Center, About Herbs: Ashwagandha. Last updated 24 April 2024.", "url": "https://www.mskcc.org/cancer-care/integrative-medicine/herbs/ashwagandha" },
    { "n": 9, "text": "Saper RB, Phillips RS, Sehgal A, et al. Lead, Mercury, and Arsenic in US- and Indian-Manufactured Ayurvedic Medicines Sold via the Internet. JAMA. 2008;300(8):915–923. doi:10.1001/jama.300.8.915", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2755247/" }
  ],
  "clinical": true,
  "register_ok": "review",
  "routesTo": ["KAPPL", "KTAHV"]
}
```

> **`register_ok: "review"` is deliberate.** The field is dead today (nothing reads it), but this file **must not ship until Dr. Deepu John signs off** (hard gate 7). Setting it to `"review"` records that fact in the artifact itself, and the moment lint rule 28 exists it will block automatically. Marking it `"ok"` would be the exact self-reported success the proof-of-work rules forbid.

---

## 6 · 🔴 OPEN QUESTIONS → QUESTIONS.md

Deduplicated from ~40 across the eight teardowns. Ordered by what they block.

| # | Question | Owner | Blocks |
|---|---|---|---|
| **Q1** | **Re-run the keyword stage per `MASTER_PIPELINE.md`** (entity ontology → real single-term seeds → multi-locale incl. Hindi/Devanagari → automated plausibility validation → intent/difficulty scoring). §0. | Abilash / research | **Phase 2 ordering.** NOT Phase 1 — the top 7 are re-verified. Six probable top-20 herbs (tulsi, giloy, boswellia, yashtimadhu, kapikacchu, arjuna) are unrankable until this runs. |
| **Q2** | **Who are the named authors, with what credentials?** `/about` promises named per-page authors twice; the `Page` type has no `author` field, so no page can have one. Ship named authors, or rewrite `/about`. **Recommend: ship named authors.** | Abilash | **Phase 0.2 → all content** |
| **Q3** | **What are the TRUE review dates for the existing 20 pages?** Has Dr. Deepu John reviewed all 20, and on what dates? **If he has not, those pages must not claim it** — which is a content decision, not an engineering one. | Dr. Deepu John | **Phase 0.1/0.9 backfill** |
| **Q4** | **Re-base the ~3,400 census on primary sources** (API / AFI / the samhitas) before it drives budget. It currently derives from easyayurveda.com + ayurvedahub.in — commercial blogs. | Abilash | Phase 4 sizing |
| **Q5** | **Is the ~3,400-page target compatible with a genuine physician-review promise?** At 3,400 it is arithmetically not, unless the review is nominal — **and a nominal review attached to a named physician on YMYL is worse than no review claim at all.** Does "physician-reviewed" mean per-page, or per-template-with-spot-check? **The honest answer must be stated on `/about`.** Business-model question. | Abilash + Dr. Deepu John | **Everything past Phase 2** |
| **Q6** | **Ratify the voice rule:** *"decisive about uncertainty, never vague; specific numbers replace soft qualifiers; never confident about clinical benefit."* §4b.2. Changes how every page is written; needs clinical concurrence (gate 7). | Abilash + Dr. Deepu John | All authoring |
| **Q7** | **How hard is the wall between monograph and commerce?** Recommend: no Kairali entity in MC ever (lint 24); pathway modules below safety/quality, never adjacent to an efficacy claim; **the herb monograph never links to a product page for the herb it is about** — only to the pharmacy's quality standards. §4.4. | Abilash | **Phase 0.5** |
| **Q8** | **Ratify the DO-NOT-PUBLISH condition list** (cancer, HIV, TB, fertility, infectious, "immunity boosting" as prevention, paediatric dosing). Needs a legal view. §2.5.1. | Abilash + counsel | Phase 3 |
| **Q9** | **AI-authorship disclosure** — is it applicable, and what does it say? Google asks: *"Is the use of automation, including AI-generation, self-evident to visitors through disclosures?"* Healthline's answer is a flat *"we do not publish content developed using generative AI tools."* **Ours cannot be that sentence.** | Abilash | P15; `/editorial-policy` |
| **Q10** | **Is Dr. Deepu John's council registration number publishable?** QRG §5.6 wants *"verifiable credentials"*, not claims of expertise. | Dr. Deepu John | P2 strength |
| **Q11** | **`seo-aeo-geo-auditor` does not exist** (verified — no such agent in the repo), though doctrine (n)/(o) promises it. §4b.6 is its spec. Who builds it; does it gate CI or run Mondays? | Abilash / engineering | Ship Gate on every site |
| **Q12** | **AI crawlers: allow-all including training bots?** §4b.4. Site-specific — must NOT become a fleet default. Silence currently = allow-all with no recorded decision. | Abilash | A3 audit check |
| **Q13** | **Re-scope backlog #14's "interactions checker"** → structured dataset + per-herb block. Recommend removing the checker. Separately: **does a consumer-facing checker attract clinical-decision-support / medical-device / health-data obligations in US/EU/India?** Needs counsel, not a web search. | Abilash + counsel | Blocks any checker work |
| **Q14** | **News desk go/no-go:** does the reviewing roster commit ~1 physician-hour/week, sustained? **If no, do not build it.** A stale evidence desk damages the exact credibility the site is built on. **This is a genuine no, not a negotiating position.** | Dr. Deepu John | Phase 3 news |
| **Q15** | **Chaukhambha licence** for Srikantha Murthy's Ashtanga Hridaya + Bhavaprakasha English translations — obtainable? A one-time permission unlocks 2 of the 4 launch texts. | Abilash | Phase 2/4 texts |
| **Q16** | **NCCIH non-endorsement adjacency rule** (§2.7 lint 25) — ratify. NCCIH's policy forbids using its information to suggest endorsement of a commercial product; **we are a commercial publisher.** | Abilash | Lint 25 |
| **Q17** | **Approve replacing the 11 off-strategy citations** (healthline ×6, ayurveda.com ×3, britannica ×2) with primary equivalents. §3.2 item 0.10. | Abilash | Phase 0.10 |
| **Q18** | **Correct the brief:** triphala/ginger antiplatelet is **not supportable**; guggul "St John's-type" **overstates by an order of magnitude**. §5.1.1. | Abilash | Interactions dataset |
| **Q19** | **Locale policy.** `site.config.json` is `locales: ["en"]`; `inLanguage` is hard-coded `"en"`; `targetMarkets` includes DE. Is DE a real second locale, and when? **Flag, do not assume.** If yes, the news cadence triples in cost. | Abilash | `locale` field; hreflang |
| **Q20** | **Is the Healing Secrets booklet cleared for reuse as public web content?** First-party, but **print/Drive provenance is not a publication licence.** It is the strongest seed we own (§below). | Abilash | Phase 2 therapies |
| **Q21** | **Dr. Deepu John's ruling on the booklet's 4 banned-token hits** — specifically: keep *"not a cure for cancer"* **verbatim** (recommended; deleting the word deletes the safety statement), and how to treat the "World Luxury Award" proper noun. | Dr. Deepu John | Phase 2 |
| **Q22** | **Re-mine + commit the 2,261-slug whyayurveda list** as `docs/group-inputs/whyayurveda-post-slugs.tsv`. Per-post triage is blocked without it (the list was written to `/tmp` and lost). Cheap to regenerate; expensive to keep losing. | Abilash | Cross-link planning |

**A finding worth surfacing here rather than burying:** `reusable-content-map.md` §5.3 establishes that **the 2,261-post whyayurveda blog is a weak seed for this site** — its biggest clusters are yoga (~452) and press/awards (~189, "DROP"), while the site's biggest target cluster has **~30 blog posts**. Meanwhile **S1, a 594-line KTAHV booklet nobody flagged as a content asset, cleanly seeds four clusters** (concepts, branches, therapies, conditions) in the right register, and its therapy descriptions already use the hedged, DMR-safe language. **Reset the expectation: the booklet is the seed; the blog is a cross-link partner. Herbs must be authored against primary sources, not migrated** (Q20 gates this).

---

## 7 · VERIFICATION LEDGER (Doctrine (f) — claim vs machine evidence)

**Verified by reading files in this worktree, 2026-07-15 18:42 IST:**
- The complete current schema (`app/lib/content.ts` lines 8–26) — quoted verbatim in §2.0.
- `MEDICAL_REVIEW` shape and its header comment promising a one-line edit (`app/lib/medical-review.ts`).
- `site.config.json`: `{domain, entity:"group", register:"A", locales:["en"], targetMarkets:["IN","US","GB","DE"], video:"none", brand:"kairali"}`.
- The 20 content files by name; `herbs__ashwagandha.json` in full — including its missing `h1`, its `register_ok:"ok"`, and its §4 "Where can I find quality ashwagandha?" naming KAPPL inside main content (the F5 COI violation §3.2/0.5 fixes).
- The quarantine banner on `demand.md` and the seven re-verified single-term volumes it names.

**Taken from the teardowns, which state their own verification status — NOT independently re-verified by me:**
- All competitor structures, the API monograph extraction, the First Schedule serial numbers, LiverTox's score B, Saper 2008's figures, Examine's Research Snapshot, NIH ODS's safety paragraph, the QRG quotations and page numbers, the 252k-trial GEO study's odds ratios, the Ahrefs llms.txt figures, the SE Ranking health-AIO figures.
- **Every teardown carries its own `[snippet-only]` / unverified list, and those flags travel with the facts into this plan.** The EU/Denmark/ANSES ashwagandha position is the clearest case: `[snippet-only]`, so §5.2 marks it *"DO NOT PUBLISH UNTIL VERIFIED"* rather than stating it.
- `article.tsx` line numbers (`:23`, `:70`, `:79-80`, `:122`, `:124`, `:132`, `:170`) and `packages/schema`/`packages/seo` line numbers are quoted from the teardowns; **I read `content.ts`, `medical-review.ts`, `site.config.json` and the ashwagandha JSON directly, but did not re-read `article.tsx` or the packages line-by-line.**

**Explicitly UNVERIFIED — do not treat as fact:**
- **The O(N²) build table is arithmetic from the call graph, not a measured benchmark.** No build was run at any N.
- **Wikidata/PubChem IDs in §5.2 `entity.sameAs` are plausible but were NOT checked against the live entries this session.** Flagged in the file's own `_provenance`. **Verify before commit.**
- The `DietarySupplement` schema.org mapping is designed from the type definition, **not validated against Google's Rich Results Test.**
- Whether `medical-review.ts` is merged to `origin/main` (no git run, per instruction).
- Every licence call in the register is a research finding for human ratification, **not legal advice**.
- Search volumes: **only the seven single terms in §3.1 are trustworthy.** Every other number in `demand.md` is quarantined.

**Not done, by instruction:** no git operations; no code changed; nothing built; no files touched outside `docs/whatisayurveda-research/BUILD_PLAN.md`.

**Checker pass (Doctrine (f)) — claim vs instruction, re-read:**
- Asked for a taxonomy incl. interactions + news → §1. **Both are deliberately NOT page types**, with reasons. That is a deviation from the literal ask and it is argued, not assumed.
- Asked for per-type schemas grounded in and extending the current schema, showing the delta → §2, with the verbatim current type at §2.0 and an explicit delta table. **Four inter-teardown conflicts resolved (C1–C4)** — a builder cannot execute four evidence scales.
- Asked to name the first cluster and justify with the demand numbers → §3.1. **Justified with seven re-verified single terms. The briefed 2.57M figure is NOT cited, because its own source file forbids it (§0).** This is the largest deviation from the brief and the one I most want read.
- Asked for a ~3,400-page roadmap → §3.4, **with the target flagged as blog-derived and re-based to "what can be honestly reviewed"**. Q4/Q5.
- Asked for the E-E-A-T model wired to `medical-review.ts` → §4, incl. the **dated roster** (C4) which the existing file's design did not anticipate.
- Asked for the AEO/GEO model + a liftable PASS/FAIL checklist → §4b, incl. §4b.0 (three briefed tactics the evidence does not support) and §4b.6 (the auditor spec, verbatim-liftable).
- Asked for 15–20 seed pages + one fully-worked ashwagandha monograph in both schemas → §5.1 (18 pages), §5.2 (new schema), §5.3 (current schema, drop-in today).
- **Unverified in my own output:** the ashwagandha JSONs are hand-authored against the teardowns' cited facts; they have **not** been schema-validated, lint-run, or built. `_provenance.deliberatelyNullOrOmitted` lists every field left empty rather than guessed.
