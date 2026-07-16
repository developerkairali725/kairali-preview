# Teardown: the single-herb / single-ingredient monograph page type

**whatisayurveda.com — page-type design spec**
As of 2026-07-15 17:30:59 IST · researcher: agent · status: PROPOSAL (needs Abilash sign-off on §4 disclosure policy; needs Dr. Deepu John sign-off before any herb page ships)

**Why this page type first.** Herbs are the #1 demand cluster at **2,568,670/mo US+India** (`docs/whatisayurveda-research/demand.md`), led by ashwagandha (673K US / 301K IN) and moringa (201K/246K). This is also the page type that scales: one schema × ~200 herbs is the bulk of the 20 → ~3,400 page path, as CONTENT not code.

**Prompt-injection screen (CLAUDE.md rule r).** All pages below were fetched as DATA. Every fetched page was screened for text directed at an automated agent; **none was found**. No fetched content was treated as instruction. Two sources (examine.com, drugs.com, mountsinai.org, ods.od.nih.gov) 403'd WebFetch and were read via the Playwright browser instead — see §5 Evidence log for capture conditions, including one capture that had to be re-taken because a shared browser session navigated away mid-call.

---

## 0. The core finding, up front

The best reference sites do not win on prose quality. They win on **four structural moves**:

1. **Two-tier depth.** A short, honest, machine-readable summary that *mirrors the deep sections key-for-key* (Drugs.com "Clinical Overview"; MSK's patient/professional split; Examine's "Research Snapshot"). The skim reader and the clinician read the same claims at different resolutions — never different claims.
2. **Evidence is graded per OUTCOME, not per herb.** "Ashwagandha is good" is unrankable and dishonest. "Cortisol: Grade A / Aerobic exercise metrics: Grade B / 27 outcomes at C / 6 at D" is both. Examine's grade is a composite of *magnitude × consistency × number of studies*.
3. **Limits are stated as content, not as a disclaimer footer.** NIH ODS's *entire* "Implications for use" section is an admission of difficulty. That admission is the authority signal.
4. **Provenance furniture is structured data**: named+credentialed reviewer, dated review, versioned update history, counted citations.

Our current `content/herbs__ashwagandha.json` does #3 well in prose (it is honest and well written) but does **none of #1, #2, #4 structurally** — it uses the same generic `sections[{h2, capsule, body}]` shape as `/doshas/vata`. Everything authoritative about it is trapped in Markdown strings: unqueryable, un-gradeable, un-lintable, invisible to schema.org. **This spec promotes the herb monograph from generic prose to a typed schema.**

---

## 1. Recommended section list + per-section field spec

### 1.0 Envelope

Keep the existing `Page` contract (`slug`, `title`, `metaDescription`, `answerCapsule`, `breadcrumb[]`, `faqs[]`, `citations[]`, `clinical`, `register_ok`, `routesTo[]`) so the catch-all route and `Article` template keep working. Add a discriminator and a typed payload:

```jsonc
{
  "pageType": "herb-monograph",   // discriminator; generic pages omit or use "article"
  "slug": "/herbs/ashwagandha",
  "herb": { /* everything in §1.1–§1.13 */ },
  "sections": [ /* OPTIONAL free prose, only for what the schema can't hold */ ]
}
```

**Rule:** if a fact fits a typed field, it MUST live in the typed field, not in `sections[].body`. `sections[]` becomes the exception, not the default. This is what makes 3,400 pages lintable.

Shared sub-types used throughout:

```jsonc
// Every non-obvious assertion carries its own provenance. This is the spine of the whole spec.
"Cite":   { "ref": 3, "note": "optional locator, e.g. 'API Vol I, p.20'" }

"Sourced": { "value": "…", "cites": [Cite], "confidence": "established|contested|single-source" }
```

---

### 1.1 Overview / answer capsule

**Purpose.** Win the featured snippet and the AI answer; tell a scared or hopeful reader the truth in 4 sentences.
**Modelled on.** Examine's 3-sentence hero + WebMD's `Overview:` paragraph; MSK "What is it?".

| Field | Type | Notes |
|---|---|---|
| `answerCapsule` | string, 40–75 words | Already exists. MUST contain: what it is · what it's *studied* for · the honesty qualifier · the single biggest safety fact. |
| `herb.oneLiner` | string, ≤ 15 words | For cards, hub pages, `llms.txt`, schema `description`. |
| `herb.mainBenefits` | `Sourced[]` | Examine: "What are ashwagandha's main benefits?" |
| `herb.mainDrawbacks` | `Sourced[]` | Examine: "What are ashwagandha's main drawbacks?" — **a required field**. A monograph with an empty `mainDrawbacks` fails lint. |
| `herb.bottomLine` | string | NIH ODS "Implications for use" equivalent — the honest so-what. |

**E-E-A-T/YMYL.** `mainDrawbacks` being *required and non-empty* is the structural guarantee that we cannot ship a puff page. Lint enforces it.

---

### 1.2 Botanical + nomenclature block

**Purpose.** Entity disambiguation for Google/LLMs (this is *Withania somnifera*, not "Indian ginseng" the ginseng), plus large India-language long-tail.
**Modelled on.** Drugs.com's `Scientific Name(s):` / `Common Name(s):` header pair (12 common names listed for ashwagandha); MSK "Scientific Name"; NIH ODS's etymology paragraph.

| Field | Type | Notes |
|---|---|---|
| `herb.botanical.latin` | string | `Withania somnifera (L.) Dunal` — include the authority. |
| `herb.botanical.family` | string | `Solanaceae (nightshade)` |
| `herb.botanical.synonymsLatin` | string[] | Accepted synonyms; guards against species substitution claims (§1.10). |
| `herb.botanical.partsUsed` | enum[] | `root \| leaf \| fruit \| seed \| bark \| whole-plant \| resin \| rhizome` — **drives everything else**; root ≠ leaf pharmacology. |
| `herb.botanical.description` | string | Habit/height/habitat. |
| `herb.botanical.nativeRange`, `.cultivatedIn` | string[] | |
| `herb.names.sanskrit[]` | `{ iast, devanagari, meaning, cites }` | e.g. `{ "iast": "aśvagandhā", "devanagari": "अश्वगन्धा", "meaning": "smell of a horse" }`. Classical texts often name one herb 10+ ways — each is a real query. |
| `herb.names.regional[]` | `{ lang: "ml\|hi\|ta\|te\|kn\|bn\|mr\|gu", script, roman }` | Malayalam matters (Kairali's home register); Hindi/Tamil are volume. |
| `herb.names.english[]` | string[] | Incl. misleading trade names. |
| `herb.names.misleadingNames[]` | `{ name, whyMisleading }` | **Our honesty move.** "Indian ginseng — not a ginseng; unrelated to *Panax*." NIH ODS makes exactly this point in prose; we make it a field. |
| `herb.chemistry.keyConstituents[]` | `{ name, class, cites }` | `withanolides`, class `steroidal lactone`. |
| `herb.chemistry.markerCompound` | string | The compound extracts are standardized to — ties to §1.10. |

**Schema.org.** Feeds `DietarySupplement.activeIngredient` + `nonProprietaryName`, and `Substance`. `sameAs` → Wikidata/Wikispecies/PubChem/USDA GRIN for entity consolidation.

---

### 1.3 Traditional Ayurvedic profile — *the section no competitor has*

**Purpose.** This is our moat (§4). Examine, WebMD, Drugs.com and NIH ODS all gesture at "used in Ayurveda as an adaptogen" and stop. The Ayurvedic Pharmacopoeia of India (API) — a legal standards document under the Drugs and Cosmetics Act, 1940 — structures every monograph as **Rasa, Guna, Virya, Vipaka, Karma, Formulations, Therapeutic uses**. We render that structure, honestly.

| Field | Type | Notes |
|---|---|---|
| `herb.ayurveda.rasa[]` | enum[] + cites | `madhura\|amla\|lavana\|katu\|tikta\|kashaya` — store the Sanskrit enum, render with gloss ("tikta / bitter"). |
| `herb.ayurveda.guna[]` | enum[] + cites | `laghu\|guru\|snigdha\|ruksha\|ushna\|shita\|…` |
| `herb.ayurveda.virya` | enum + cites | `ushna \| shita` |
| `herb.ayurveda.vipaka` | enum + cites | `madhura \| amla \| katu` |
| `herb.ayurveda.prabhava` | string? + cites | Nullable — most dravyas have none. Don't invent one. |
| `herb.ayurveda.doshaKarma` | `{ vata: "↓\|↑\|—", pitta: …, kapha: … }` + cites | The tridosha action. Render as a small matrix. |
| `herb.ayurveda.karma[]` | `{ term, iast, gloss, cites }` | `rasayana`, `balya`, `medhya`. **`gloss` is required** — untranslated Sanskrit is not authority, it's fog. |
| `herb.ayurveda.classicalSources[]` | `{ text, chapter, verse, ref }` | `Charaka Samhita`, `Sushruta Samhita`, `Bhavaprakasha Nighantu`, `Ashtanga Hridaya`, `API Part I Vol I`. Ties into the `texts` cluster (27,590/mo). |
| `herb.ayurveda.apiListed` | boolean + `{ volume, part, page }` | Is it in the official Ayurvedic Pharmacopoeia of India? A hard, checkable authority fact. |
| `herb.ayurveda.epistemicNote` | string, **REQUIRED, non-empty** | See below. |

**E-E-A-T/YMYL — the critical rule.** Classical attributes are reported as **what the tradition says, attributed to a named text** — never as biomedical fact and never fused with the evidence section. The renderer MUST visually separate this block from §1.5 (different background, explicit label: *"What the classical tradition says"*). `epistemicNote` carries the standing caveat, e.g.:

> *Rasa, virya and vipaka are categories of Ayurvedic pharmacology, recorded in the classical texts cited here. They describe how the tradition classifies this plant. They are not measurements, and they are not claims that the plant has these effects in the body as modern science defines them.*

This is precisely the honesty that lets us publish the full traditional profile *without* it becoming a health claim. Fusing tradition and evidence is what every low-quality Ayurveda site does; separating them cleanly is why we'd be trusted.

---

### 1.4 Traditional uses

| Field | Type | Notes |
|---|---|---|
| `herb.traditionalUses[]` | `{ use, context, cites, testedModernly: bool, evidenceRef?: outcomeId }` | |
| `herb.traditionalUses[].neverTested` | bool | **Our honesty move.** Explicitly surface traditional uses that modern research has *never looked at*. Examine's one traditional FAQ can't do this. |
| `herb.formulationsContaining[]` | `{ name, slug, role: "principal\|adjuvant\|anupana" }` | Links to the `formulations` cluster (344,640/mo — chyawanprash 74K IN, etc.). Internal-link engine. |
| `herb.traditionalContext` | string | **Required.** Examine itself concedes: *"When ashwagandha is used as part of the Ayurvedic system, it usually involves more than just the herb alone."* They flag the gap; we fill it — single-herb use is a *Western supplement* pattern, not how Ayurveda prescribes. Saying so is honest AND differentiating. |

---

### 1.5 Modern evidence, graded per outcome

**Purpose.** The hardest and most valuable section. This is where we either earn or forfeit YMYL trust.
**Modelled on.** Examine's per-outcome A–F grades (composite of magnitude × consistency × study count); NIH ODS's per-outcome H3s (`Stress and anxiety`, `Sleep`); Drugs.com's `Uses and Pharmacology` per-indication H3s.

```jsonc
"herb.evidence": {
  "snapshot": {                     // Examine "Research Snapshot" pattern
    "referenceCount": 132,
    "trialCount": 29, "metaAnalysisCount": 7, "participantsTotal": 8803,
    "asOf": "2026-07-15"
  },
  "gradeScaleVersion": "wia-evidence-v1",   // versioned + publicly documented at /evidence-grades
  "outcomes": [
    {
      "id": "cortisol",
      "outcome": "Cortisol",
      "category": "stress|sleep|cognition|hormonal|fitness|cardiometabolic|immune|other",
      "grade": "A|B|C|D|F|insufficient",
      "direction": "decrease|increase|mixed|none",
      "magnitude": "small|moderate|large|unclear",
      "interpretation": "improvement|detriment|context-dependent",
      "studyCount": 5, "participants": 400,
      "designs": ["RCT","meta-analysis"],
      "consistency": "consistent|mostly-consistent|inconsistent",
      "durationRangeWeeks": [4, 12],
      "populations": "adults with self-reported stress",
      "industryFunded": "some|all|none|unclear",   // ← see below
      "limits": "Trials are small (n≈40–60), short, and use different extracts.",
      "cites": [Cite]
    }
  ],
  "notStudiedFor": ["…"],           // traditional claims with no human trials at all
  "evidenceCaveat": "…"             // REQUIRED standing caveat
}
```

**Grading honesty — the part we must not fake.** Examine's grades are defensible because they run a large research team and a documented, automated composite (magnitude × consistency × study count), funded solely by subscriptions. **We cannot credibly clone an A–F efficacy grade at 3,400-page scale, and pretending to would be exactly the dishonesty this site exists to oppose.** Two options for Abilash:

- **(a) RECOMMENDED — grade the EVIDENCE, not the efficacy.** Our scale describes *how much and how good the research is*, which is verifiable from study counts and designs and is not a clinical judgement:
  `strong` (multiple consistent RCTs + ≥1 meta-analysis) · `moderate` (several RCTs, some inconsistency) · `preliminary` (few/small/short trials) · `traditional-only` (no human trials) · `evidence-of-no-effect` · `evidence-of-harm`.
  This is honest, cheap to maintain, hard to attack, and states the limits *in the grade name itself*. `traditional-only` is a label no competitor has and most Ayurveda content desperately needs.
- **(b)** Clone A–F efficacy grades. Higher ceiling, needs a real research team + published methodology + per-outcome effect sizes. Not affordable now.

Whichever ships, `gradeScaleVersion` points at a public `/evidence-grades` page defining every level — Examine publishes its methodology at `/about/research-process/` and that transparency *is* the authority.

**`industryFunded` is our sharpest honest edge.** Much ashwagandha research is manufacturer-funded (frequently around proprietary extracts). Examine discusses conflicts in policy; nobody surfaces funding **per outcome row, in the table, on the page**. We should. It costs us nothing — we don't fund studies — and it is the single most useful thing a reader can know.

**E-E-A-T/YMYL.** Never "treats"; use *studied for*. `notStudiedFor` and `evidenceCaveat` are required. `insufficient` and `traditional-only` must be usable and used — a monograph where every outcome is `strong` is a lint failure.

---

### 1.6 Mechanisms

| Field | Type | Notes |
|---|---|---|
| `herb.mechanisms[]` | `{ claim, evidenceType: "human\|animal\|in-vitro\|hypothesis", cites }` | MSK has a dedicated `Mechanism of Action`; Drugs.com folds it into `Uses and Pharmacology`; WebMD asks *"How does ashwagandha work (mechanism of action)?"*. |
| `herb.mechanisms[].translationCaveat` | string | Required when `evidenceType` ≠ `human`. |

**E-E-A-T/YMYL.** The `evidenceType` tag is the whole point. Drugs.com is explicit that for ashwagandha *"many in vitro and animal experiments"* underpin claims while human trials are *"limited"* — the commonest way herb marketing misleads is quoting a petri dish as if it were a person. Tagging every mechanism makes that impossible for us. Render in-vitro/animal claims in a visually demoted style.

---

### 1.7 Forms & dosage

**Modelled on.** Examine's `Dosage Information` → `Formulation:` / `Range of dosages studied:` / `Other Considerations:` + an inline **Medical disclaimer**; Drugs.com's per-indication `Dosing` (Anxiety / Sleep quality).

| Field | Type | Notes |
|---|---|---|
| `herb.forms[]` | `{ form, tradition: "classical\|modern", description }` | `churna`, `kwatha`, `taila`, `ghrita`, `arishta`, `capsule`, `standardized-extract`, `tea`, `tincture`. |
| `herb.dosage.studiedRanges[]` | `{ form, amount, unit, frequency, durationWeeks, outcomeId, cites }` | **"Range of dosages studied"** — descriptive, never prescriptive. |
| `herb.dosage.classicalDosage` | `Sourced?` | What the texts/API say — **separate field**, separately labelled. Never merged with the studied range. |
| `herb.dosage.standardization` | `{ marker, rangeStudiedPct: [0.2, 35], note }` | Real Examine finding: trials used extracts standardized from **0.2% to 35% withanolides**, and many don't disclose it — so "300 mg" is nearly meaningless without the marker %. This field is how we make that legible. |
| `herb.dosage.anupana[]` | `Sourced[]` | The traditional vehicle (milk/ghee/honey/warm water). Nobody else has this. |
| `herb.dosage.noRecommendation` | string, **REQUIRED** | Standing text: we report what was studied; we do not dose you. |
| `herb.dosage.disclaimerRef` | string | Inline near the numbers — Examine puts "Medical disclaimer" *in the dosage H2 itself*, not in the footer. Copy that placement. |

**E-E-A-T/YMYL.** A dosage number without form + marker % + duration + population is misinformation; the schema makes those fields structurally inseparable from the number. `classicalDosage` and `studiedRanges` never merge — that fusion is the #1 sin of Ayurveda supplement copy.

---

### 1.8 Safety / side effects / contraindications

**Modelled on.** Examine's `Safety Summary` (bulleted) → `Side Effects` (table: Effect | Route | Notes | refs) → `Pregnancy and Lactation` → `Precautions` → `Precautions for specific demographics` → WADA status; MSK's `Warnings` / `Contraindications` / `Adverse Reactions` (split into *commonly reported* / *less common* / *case reports*); NIH ODS's blunt `Safety` paragraph.

```jsonc
"herb.safety": {
  "summary": ["Generally well tolerated…", "…"],       // required, ≥1
  "sideEffects": [
    { "effect": "Drowsiness", "frequency": "common|less-common|case-report",
      "route": "oral", "severity": "mild|moderate|severe",
      "notes": "Appears mild and transient.", "cites": [Cite] }
  ],
  "contraindications": [ { "condition": "…", "strength": "avoid|caution|monitor", "reason": "…", "cites": [Cite] } ],
  "pregnancy":  { "status": "avoid|insufficient-data|likely-safe", "rationale": "…", "cites": [Cite] },  // required
  "lactation":  { "status": "…", "rationale": "…", "cites": [Cite] },                                    // required
  "preSurgery": { "stopBeforeDays": 14, "reason": "sedative effects", "cites": [Cite] },                 // required (nullable w/ reason)
  "populations": [ { "group": "children|elderly|hormone-sensitive-cancer|autoimmune|thyroid|hepatic", "guidance": "…", "cites": [Cite] } ],
  "longTermSafety": "unknown|limited|established",     // required
  "wadaStatus": "not-prohibited|prohibited|unknown",
  "seriousRiskFlags": [ { "risk": "hepatotoxicity", "frequency": "rare", "signs": "jaundice, dark urine, unusual fatigue", "action": "stop and seek medical advice", "cites": [Cite] } ]
}
```

**E-E-A-T/YMYL.** `pregnancy`, `lactation`, `preSurgery`, `longTermSafety` are **required on every herb page** — absence is a lint failure, forcing an explicit `insufficient-data` rather than a silent omission. `longTermSafety: "unknown"` is the honest default and matches NIH ODS verbatim on ashwagandha: *"appears to be well tolerated for up to about 3 months of use, but its long-term safety is not known."* `seriousRiskFlags[].signs` + `.action` is the field that could actually protect someone (ashwagandha–liver injury is a live, real signal — Examine, NIH ODS and LiverTox all carry it).

---

### 1.9 Herb–drug interactions

**Modelled on.** MSK's dedicated `Herb-Drug Interactions` **and** `Herb Lab Interactions` (a category everyone else misses — herbs that skew *lab tests*); Examine's dual-axis classification.

**Adopt Examine's taxonomy directly — it is public, documented, and excellent** (verbatim from `examine.com/about/research-process/`):

- `evidenceLevel`: **probable** (strong clinical evidence — multiple trials/case reports) · **possible** (single trial or case report) · **theoretical** (in vitro or animal only)
- `severity`: **severe** (life-threatening or permanent harm) · **moderate** (worsens a condition; needs monitoring/adjustment) · **minor** (unlikely to cause harm) · **unknown** (insufficient evidence)

```jsonc
"herb.interactions": {
  "drugs": [ { "drug": "…", "drugClass": "immunosuppressants",
               "effect": "…", "mechanism": "…",
               "evidenceLevel": "probable|possible|theoretical",
               "severity": "severe|moderate|minor|unknown",
               "guidance": "…", "cites": [Cite] } ],
  "herbs":  [ { … } ],     // herb–herb (matters in polyherbal Ayurveda — nobody else needs this field)
  "foods":  [ { … } ],     // WebMD asks it explicitly
  "labTests": [ { "test": "TSH", "effect": "may alter thyroid panel", "cites": [Cite] } ],  // MSK "Herb Lab Interactions"
  "noneDocumentedNote": "…"  // required when arrays are empty
}
```

**E-E-A-T/YMYL.** `noneDocumentedNote` exists because Drugs.com's honest answer for ashwagandha interactions is literally *"None well documented."* — which means *not studied*, **not** *safe*. Conflating those two is dangerous; the required note forces the distinction. Long-term this powers the v3 interactions checker (BACKLOG #14) — but a checker must never output "safe", only "no documented interaction found".

---

### 1.10 Quality, adulteration & heavy metals — *the Ayurveda-specific section*

**Purpose.** The most important section on any Ayurvedic herb page, and the one where our commercial position is most exposed (§4). Examine buries a `Caution: Quality concerns` sub-block; for Ayurveda specifically it deserves top-level treatment because the risk is documented and material.

| Field | Type | Notes |
|---|---|---|
| `herb.quality.standardizationVariance` | `{ marker, observedRangePct, note, cites }` | Examine on ashwagandha: supplements contain *"widely ranging amounts"* of withanolides, *"generally without labeling the intended amounts."* |
| `herb.quality.heavyMetalRisk` | `{ level: "documented\|theoretical\|none-documented", metals: ["lead","mercury","arsenic","cadmium"], evidence: "…", cites }` | Examine: studies *"occasionally found levels of cadmium and lead… that exceed allowed levels, but this isn't found consistently."* |
| `herb.quality.rasaShastraNote` | string? | **Critical and unique.** Saper 2008 (JAMA): of 193 internet-bought Ayurvedic medicines, **20.7%** contained detectable lead/mercury/arsenic; **rasa shastra products 40.6% vs non-rasa-shastra 17.1%** (P=.007), with median mercury 20,800 µg/g vs 34.5 µg/g; *"All metal-containing products exceeded 1 or more standards for acceptable daily intake of toxic metals."* In rasa shastra, metals are **intentional**, not contamination — and only an Ayurveda-literate publisher can explain that distinction instead of just alarming people. Explaining it honestly, without defensiveness, is a top-tier trust move. |
| `herb.quality.adulterants[]` | `{ substance, why, howToAvoid, cites }` | Species substitution, leaf-for-root, undeclared fillers. |
| `herb.quality.whatToLookFor[]` | string[] | COA, third-party heavy-metal testing, marker %, part-of-plant declared, GMP. **Vendor-neutral** — must be usable to evaluate a Kairali product *and reject it*. |
| `herb.quality.regulatoryStatus` | `{ region: "US\|EU\|IN", status, note, cites }` | US: not FDA-reviewed (Drugs.com's disclaimer language). IN: API/AYUSH listing. |
| `herb.quality.commercialDisclosure` | string, **REQUIRED when `routesTo` includes KAPPL** | See §4. |

**E-E-A-T/YMYL.** This section is where the site proves the "transparent steward" voice is real. If our heavy-metal section were softer than Examine's *because we sell ashwagandha*, the whole site is worthless. It must be the **most rigorous** version on the internet, and it must be written so that a reader could use it to decide against buying from us.

---

### 1.11 FAQs

**Modelled on.** Examine's 10 FAQ H3s (all question-shaped: *"Does ashwagandha affect hormone health?"*); WebMD's entire new template is question-shaped H3s (*"Who should not use ashwagandha?"*, *"What should I tell my health care provider before using ashwagandha?"*).

| Field | Type | Notes |
|---|---|---|
| `faqs[]` | `{ q, a, cites?, evidenceRef?: outcomeId }` | Exists. **Add `cites`** — an uncited FAQ answer is our weakest current artefact. |
| `faqs[].intent` | `"safety"\|"efficacy"\|"dosage"\|"identity"\|"comparison"` | Coverage lint: every herb page needs ≥1 `safety` FAQ. |

**AEO/GEO (Ship-Gate universal check).** Question-shaped H2/H3 + a ≤40-word direct answer in the first sentence + `FAQPage` JSON-LD is the highest-leverage AEO pattern available, and both Examine and WebMD have converged on it independently. Mirror the `mainDrawbacks`/safety fields into FAQ answers so an LLM quoting us **cannot** quote only the upside.

---

### 1.12 Citations

| Field | Type | Notes |
|---|---|---|
| `citations[]` | `{ n, text, url, type, year?, design?, pmid?, doi? }` | Exists as `{n, text, url}` — **extend**. |
| `citations[].type` | enum | `rct \| meta-analysis \| systematic-review \| observational \| in-vitro \| animal \| case-report \| classical-text \| pharmacopoeia \| regulatory \| review`. |
| `citations[].authority` | enum? | `nih \| nccih \| ods \| ayush \| who \| cochrane \| journal`. |

**Source-tier policy (write into `/about`).** Tier 1: systematic reviews/meta-analyses, Cochrane, NIH ODS/NCCIH, LiverTox, AYUSH expert-committee reports. Tier 2: individual RCTs, pharmacopoeias (API), MSK/Drugs.com monographs. Tier 3: classical texts — **authoritative for what the tradition claims, never for efficacy**. Never: supplement-vendor blogs, press releases.

NIH ODS's ashwagandha reference list includes *"Ministry of Ayush, Government of India. Safety of Ashwagandha, Withania somnifera. Report of the Expert Committee. 2024."* — i.e. the US government's own fact sheet cites AYUSH. That citation type belongs on our pages too, and it is a bridge only we are positioned to walk across in both directions.

---

### 1.13 Provenance: reviewer, dates, update history

**Modelled on.** Examine: `Written by: Daryl Nault, BA, MS • Katie Jantz, RPh, MSc +1`, `Fact-checked by: Nick Milazzo, MSc, MPH • Bill Willis, PhD +3`, `Last Updated: May 28, 2026`, plus a full **Update History** log tagged `major`/`minor`/`correction` with per-update *Research written by / Edited by / Reviewed by*. WebMD: `Reviewed by Beth Johnston, BCPS, PharmD on Jul 27, 2025`. Drugs.com: `Medically reviewed by Drugs.com. Last updated on Dec 3, 2025.` MSK: `Last Updated: Wednesday, April 24, 2024`. NIH ODS: `Updated: May 2, 2025` + *"History of changes to this fact sheet"*.

| Field | Type | Notes |
|---|---|---|
| `herb.review.reviewerKey` | string | Resolves against `app/lib/medical-review.ts` — **config, not a literal**, per the memory rule (the head physician can change). |
| `herb.review.lastReviewed` | ISO date, **REQUIRED, per page** | See defect below. |
| `herb.review.nextReviewDue` | ISO date | Cadence: 12 months, or 6 for high-traffic/high-risk herbs. |
| `herb.review.updateHistory[]` | `{ date, type: "major\|minor\|correction", note, by }` | Examine's `correction` type is a trust signal *because* it admits error publicly. Adopt all three. |
| `herb.author` | string | Editorial team ID. |

**DEFECT FOUND (flagging, not fixing — out of scope per instructions).**
`sites/whatisayurveda.com/app/_components/article.tsx:22`:

```ts
const REVIEWED = "2026-07-14"; // build date; real review cadence tracked in editorial policy
```

A single hardcoded constant stamps **every page** with the same "reviewed" date, and the comment concedes it's the *build* date. On a YMYL site that publishes `MedicalWebPage.lastReviewed` and a named physician's byline, this asserts that Dr. Deepu John reviewed every page on 2026-07-14 — and worse, it will silently re-date on any future edit, claiming reviews that never happened. This is exactly the dishonesty the site is positioned against, and it's the kind of thing that fails a manual quality rater. **`lastReviewed` must be per-page data, set only when a physician actually signs off.** Recommend: `lastReviewed` required in each content JSON; build fails if a `clinical: true` page lacks it. Route to QUESTIONS.md / a fix PR.

**E-E-A-T.** Named + credentialed + dated + linked-to-a-real-bio reviewer is the single strongest YMYL signal, and the institutional framing already built into `medical-review.ts` (`"the registered physicians of the Kairali Ayurvedic Group"`) is the right architecture — keep it, but the date must be real.

---

### 1.14 Schema.org / JSON-LD

Emit a `@graph`:

- **`MedicalWebPage`** — `lastReviewed` (from real per-page data), `reviewedBy` → `Physician`, `specialty`, `audience`.
- **`DietarySupplement`** (schema.org has this type and it fits almost perfectly): `activeIngredient` ← `chemistry.markerCompound`; `nonProprietaryName` ← `botanical.latin`; `dosageForm` ← `forms[]`; `mechanismOfAction` ← `mechanisms[]` (human-evidence only); `recommendedIntake` — **deliberately omit**, we make no recommendation; `safetyConsideration` ← `safety.summary`; `targetPopulation`; `legalStatus` ← `quality.regulatoryStatus`.
- **`Substance`** + `sameAs` → Wikidata / PubChem / USDA GRIN.
- **`FAQPage`** ← `faqs[]`.
- **`BreadcrumbList`** ← `breadcrumb[]`.

**Honesty rule in schema too:** never emit `recommendedIntake` or a `Drug`-typed node with treatment indications. The structured data must make exactly the claims the prose makes — no more.

---

## 2. Annotated competitor structure breakdowns

### 2.1 Examine.com — `examine.com/supplements/ashwagandha/`
*Captured 2026-07-15 via browser (WebFetch 403). Page `Last Updated: May 28, 2026`.*

**Actual heading tree (verbatim, in order):**
```
H1 Ashwagandha
H2 Overview
   H3 What is ashwagandha?
   H3 What are ashwagandha's main benefits?
   H3 What are ashwagandha's main drawbacks?
   H3 How does ashwagandha work?
H2 Dosage Information  [+ inline "Medical disclaimer"]
   H3 Formulation:
   H3 Range of dosages studied:
   H3 Other Considerations:
H2 Examine Database: Ashwagandha
H2 Safety Information  [New]
   H3 Safety Summary
      H4 Caution: Quality concerns
   H3 Side Effects        [table: Effect | Details (Route, Notes) + refs]
   H3 Interactions
   H3 Pregnancy and Lactation
   H3 Precautions
   H3 Precautions for specific demographics, populations, and/or conditions
   H3 World Anti-Doping Agency — Not Prohibited
H2 Research Feed
H2 Frequently Asked Questions   [10 × question-shaped H3]
H2 Update History               [major/minor/correction, per-update bylines]
H2 Research Breakdown
H2 References
H2 Examine Database References
```

**Provenance furniture (verbatim):** `Written by: Daryl Nault, BA, MS • Katie Jantz, RPh, MSc + 1 other` · `Fact-checked by: Nick Milazzo, MSc, MPH • Bill Willis, PhD + 3 others` · `Last Updated: May 28, 2026`.

**Research Snapshot (verbatim):** `132 references on this page` · `8,803 participants in 29 trials and 7 meta-analyses` · `Examine Evidence Grades: A — Cortisol +3 more · B — Aerobic Exercise Metrics +7 more · C — 27 outcomes · D — 6 outcomes`.

**Steal:**
- **Per-outcome grading.** The A/B/C/D distribution *is* the honesty: only 4 outcomes reach A, 27 sit at C, 6 at D. Nothing communicates "mostly weak evidence" better than showing the whole distribution rather than the best row.
- **Countable authority.** "132 references · 8,803 participants in 29 trials" is falsifiable, scannable, and instantly credible. Cheap to compute from our own `citations[]`.
- **`main drawbacks` as a peer of `main benefits`**, structurally — not a caveat paragraph.
- **Disclaimer inline in the Dosage H2**, at the point of risk.
- **Update History with a `correction` class** and per-update reviewer bylines.
- **Documented methodology** at `/about/research-process/`: grades = magnitude × consistency × study count, auto-calculated; effect magnitudes hand-entered by researchers assessing *the body of evidence, not single trials*; direction arrows (↑/↓/—/↕) with an `improvement | detriment | context-dependent` gloss — their own example being that falling testosterone is good in PCOS and bad elsewhere. That nuance is exactly our register.

**Don't copy:**
- **The paywall.** `"Full safety information is available to Examine Clinicia…"` and `"Try Examine+ … to unlock these insights"` truncate the *safety* section. We are non-revenue: our safety content should be **complete and free**. That is a real, ownable competitive advantage on the exact content that matters most.
- **Their conflict-of-interest posture is not available to us.** Examine's authority rests on: *"100% of our revenue comes from subscriptions… we don't sell supplements, run advertisements, or accept sponsorships"* and a contractual staff ban on industry ties. **Kairali manufactures and sells ashwagandha.** We cannot claim independence — so we must substitute *disclosure* for *independence* (§4). Any attempt to imitate Examine's neutrality claim would be a lie.

**The gap they name and leave open (our whole thesis):** in their own Dosage section — *"When ashwagandha is used as part of the Ayurvedic system, it usually involves more than just the herb alone."* Examine knows single-herb framing misrepresents Ayurveda, and has no way to fix it. We do.

---

### 2.2 Drugs.com Natural Products — `drugs.com/npp/ashwagandha.html`
*Captured 2026-07-15 via browser (WebFetch 403). `Medically reviewed by Drugs.com. Last updated on Dec 3, 2025.`*

**Actual heading tree (verbatim, in order):**
```
[header]  Scientific Name(s): Withania somnifera (L.) Dunal.
          Common Name(s): Ajagandha, Amangura, Amukkirag, Asgand, Ashvagandha, Asundha,
                          Asvagandha, Aswaganda, Indian ginseng, Kanaje Hindi, Kuthmithi,
                          Samm al ferakh, Winter cherry …
H2 Clinical Overview
   H3 Use · H3 Dosing · H3 Contraindications · H3 Pregnancy/Lactation
   H3 Interactions · H3 Adverse Reactions · H3 Toxicology
H2 Scientific Family        (Solanaceae (nightshade))
H2 Botany
H2 History
H2 Chemistry
H2 Uses and Pharmacology
   H3 Anti-inflammatory effects · Cancer · CNS effects · Fatigue and stress
   H3 Immune system effects · Performance · Other uses
H2 Dosing        H3 Anxiety · H3 Sleep quality
H2 Pregnancy / Lactation
H2 Interactions
H2 Adverse Reactions
H2 Toxicology
H2 References
H2 Disclaimer
```

**The key structural move — two-tier mirroring.** `Clinical Overview`'s H3s are *the same keys* as the deep H2s (Use/Dosing/Contraindications/Pregnancy/Interactions/Adverse Reactions/Toxicology). Summary and detail are the same object at two resolutions. **This is the single most copyable pattern in this teardown** and maps perfectly to a `summary` object mirroring `herb.*` keys.

**Honest-limits language, verbatim** — note how terse and unhedged the admissions are:
- *"Trials supporting its clinical use are limited; however, many in vitro and animal experiments suggest effects…"* ← the in-vitro/animal vs human distinction, in the very first sentence.
- *"Dosing information is limited."*
- *"Contraindications have not been identified."* ← not *"there are none"*.
- *"None well documented."* (interactions)
- *"Acute toxicity of W. somnifera is modest; at reasonable doses, ashwagandha is nontoxic."*

**Steal:** the mirrored two-tier structure; the `Scientific Name(s)/Common Name(s)` header pair (13 common names = 13 entity aliases); a **separate `History` section** (we can do this far better); the regulatory disclaimer, which for the US is a real fact worth stating plainly — *"This product has not been reviewed by the FDA… is not subject to the quality standards and safety information collection standards that are applicable to most prescription drugs."*

**Beat them on:** `Uses and Pharmacology` mixes in-vitro, animal and human evidence under one indication heading with no visual tiering — the reader can't tell a mouse from a person without reading every sentence. Our `mechanisms[].evidenceType` + per-outcome `designs[]` fixes exactly that. Their `History` is three sentences; ours is a linked, cited classical-texts cluster.

---

### 2.3 NIH ODS — `ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/`
*Captured 2026-07-15 via browser (WebFetch 403). `Updated: May 2, 2025` + "History of changes to this fact sheet". 82 PubMed-linked references.*

**Actual heading tree (verbatim, in order):**
```
H1 Ashwagandha: Is it helpful for stress, anxiety, or sleep?   ← the H1 is a QUESTION
H2 Table of Contents
H2 Introduction
H2 Efficacy
   H3 Stress and anxiety
   H3 Sleep
H2 Safety
H2 Implications for use
H2 References
H2 Disclaimer
[banner] "This is a fact sheet intended for health professionals. For a general overview, see our consumer fact sheet."
```

**Why this minimal structure is the most authoritative page of the five.** It scopes itself honestly in the H1 — a *question*, not a promise. It grades nothing and claims nothing it can't support. Its `Safety` section, verbatim:

> *"Ashwagandha appears to be well tolerated for up to about 3 months of use, but its long-term safety is not known. Common side effects (e.g., loose stools, nausea, drowsiness) are usually mild. However, there are a few reports of more serious side effects, including adverse effects on liver function. Ashwagandha might also affect thyroid function and interact with some medications. Some experts advise against the use of ashwagandha by women who are pregnant and by men with hormone-sensitive prostate cancer."*

And `Implications for use` — an entire section whose content is an admission:

> *"…it is challenging to develop recommendations for using ashwagandha, because the studies that have evaluated it have used various preparations and doses. Ashwagandha appears to be well tolerated during short-term use, but the long-term safety of ashwagandha is not known. In addition, ashwagandha may not be safe for certain people."*

**Steal:**
- **Question-shaped H1** for high-intent pages — perfect AEO, and it scopes the claim.
- **`Implications for use` as a required field** (`herb.bottomLine`): the honest so-what, including *why we can't tell you more*.
- **Etymology in the intro** (*"ashwa" for horse, "gandha" for smell*) — reader-delighting, entity-disambiguating, and native territory for us.
- **The dual consumer/professional fact sheet** — a v3 consideration (MSK does the same split via patient/professional sections on one page). Our register is general-audience, so: one page, plain language, with the professional depth *available* rather than hidden.
- **They cite AYUSH** (*"Ministry of Ayush, Government of India. Safety of Ashwagandha, Withania somnifera. Report of the Expert Committee. 2024."*). The US government cites the Indian government on Ayurvedic safety — that bridge is ours to walk in both directions.

**Beat them on:** coverage (ODS has fact sheets for a handful of botanicals; we can do ~200 Ayurvedic dravyas), the traditional dimension (they compress 2,000 years into one clause: *"used in the traditional Ayurvedic and Unani medicine systems of India as an adaptogen, which is loosely defined as…"*), and freshness.

---

### 2.4 MSK "About Herbs" — `mskcc.org/cancer-care/integrative-medicine/herbs/ashwagandha` *(brief)*
*Captured 2026-07-15 via WebFetch. `Last Updated: Wednesday, April 24, 2024`. No named reviewer.*

```
[For Patients & Caregivers]  What is it? · What are the potential uses and benefits? ·
                             What are the side effects? · What else do I need to know?
[For Healthcare Professionals] Scientific Name · Clinical Summary · Purported Uses and Benefits ·
                             Mechanism of Action · Warnings · Contraindications · Adverse Reactions ·
                             Herb-Drug Interactions · Herb Lab Interactions · Dosage (OneMSK Only) · References
```
**Steal:** the word **"Purported Uses"** — one adjective doing enormous honesty work; the **`Herb Lab Interactions`** category (herbs that skew lab tests — a real clinical risk nobody else surfaces); adverse reactions split by *commonly reported / less common / case reports*. **Note:** MSK ships **no named reviewer** — a genuine E-E-A-T weakness we should beat, and can, via `medical-review.ts`.

### 2.5 WebMD — `webmd.com/vitamins-supplements/ashwagandha` *(brief)*
*Captured 2026-07-15 via browser. `Reviewed by Beth Johnston, BCPS, PharmD on Jul 27, 2025`. "6 mins read". "Reviews (447)".*

Every H3 is a **question**: *"What is ashwagandha used for?"* · *"How does ashwagandha work (mechanism of action)?"* · *"What are the most common side effects…?"* · *"What are the serious side effects…?"* · *"Who should not use ashwagandha?"* · *"What should I tell my health care provider before using ashwagandha?"* · *"Does ashwagandha interact with medicines (drug interactions)?"* · *"What should I do if I accidentally use too much ashwagandha?"*

**Steal:** the fully question-shaped template (WebMD has A/B-tested AEO harder than anyone); *"What should I tell my health care provider…"* — a genuinely useful, uniquely un-gamed FAQ intent; separating **common** from **serious** side effects into distinct questions; the reading-time chip. Note their old 5-point Effectiveness scale is **gone** from this template — they retreated from grading; Examine advanced into it. That divergence tells us grading is expensive but defensible only if you resource it (§1.5).

---

## 3. Field-spec summary table

| # | Section | Required fields (fail lint if missing) |
|---|---|---|
| 1 | Overview | `answerCapsule`, `oneLiner`, `mainBenefits[]`, **`mainDrawbacks[]`**, `bottomLine` |
| 2 | Botanical/names | `botanical.latin`, `.family`, **`.partsUsed[]`**, `names.sanskrit[]` |
| 3 | Ayurvedic profile | `rasa[]`, `guna[]`, `virya`, `vipaka`, `doshaKarma`, `karma[].gloss`, `classicalSources[]`, **`epistemicNote`** |
| 4 | Traditional uses | `traditionalUses[].cites`, **`traditionalContext`** |
| 5 | Modern evidence | `evidence.snapshot`, `outcomes[].grade/.cites/.limits/.industryFunded`, `notStudiedFor[]`, **`evidenceCaveat`** |
| 6 | Mechanisms | `mechanisms[].evidenceType` (+ `translationCaveat` if non-human) |
| 7 | Forms & dosage | `forms[]`, `dosage.studiedRanges[]`, `dosage.standardization`, **`dosage.noRecommendation`** |
| 8 | Safety | `safety.summary[]`, **`pregnancy`**, **`lactation`**, **`preSurgery`**, **`longTermSafety`** |
| 9 | Interactions | `interactions.drugs[]` or **`noneDocumentedNote`**; `evidenceLevel` + `severity` on every row |
| 10 | Quality/adulteration | `quality.heavyMetalRisk`, `quality.whatToLookFor[]`, **`quality.commercialDisclosure`** (if `routesTo` ⊇ KAPPL) |
| 11 | FAQs | `faqs[].cites`, ≥1 `intent: "safety"` |
| 12 | Citations | `citations[].type`, `.url` |
| 13 | Provenance | **`review.lastReviewed`** (real, per-page), `review.reviewerKey`, `review.updateHistory[]` |

**Proposed lint rules** (extend the existing `register_ok` / compliance lint — `scripts/`):
1. Banned claim verbs on any herb page: `cure`, `treats`, `heals`, `guaranteed`, `miracle`, `proven to treat`.
2. `mainDrawbacks[]` non-empty · `notStudiedFor[]` present · not every outcome `strong`/A.
3. Every `outcomes[]`, `mechanisms[]`, `interactions.*`, `safety.*` row has ≥1 `cites` — **no uncited health claims, ever**.
4. `pregnancy` / `lactation` / `preSurgery` / `longTermSafety` present (explicit `insufficient-data` allowed; silence is not).
5. `dosage.studiedRanges[]` never rendered without form + marker % + duration.
6. `ayurveda.epistemicNote` non-empty; `ayurveda.karma[].gloss` non-empty.
7. `review.lastReviewed` present on every `clinical: true` page and **not** derived from build date (see §1.13 defect).
8. If `routesTo` includes `KAPPL`, `quality.commercialDisclosure` non-empty.
9. Every `citations[]` URL resolves (200) — run in the weekly QA rotation.

---

## 4. What WE do better

### 4.1 The Ayurvedic dimension Examine structurally cannot have
Examine, WebMD, Drugs.com, MSK and NIH ODS all compress Ayurveda into a single clause — *"used in Ayurveda as an adaptogen"* — and move on. They aren't being lazy; they have no source competence for it. We have: a WHO-GMP pharmacy, an NABH hospital, registered physicians, and 2,000 years of primary literature. **Nobody credible occupies the intersection of *Ayurveda-literate* and *evidence-honest*.** One side has the tradition and sells you things; the other has the rigour and treats the tradition as a footnote.

Concretely, §1.3/§1.4/§1.7 give us, cited: rasa/guna/virya/vipaka/prabhava with classical references · API pharmacopoeial status · dosha action · Sanskrit + regional names (India long-tail nobody targets) · `formulationsContaining` linking herbs → the 344,640/mo formulations cluster · `anupana` · classical dosage *separated from* studied dosage · rasa shastra explained rather than feared. And the field Examine's own text calls for and cannot fill: **`traditionalContext`** — that single-herb capsule framing is a Western supplement construct, not Ayurvedic practice.

### 4.2 Radical honesty — the concrete, shippable moves
1. **`industryFunded` per outcome row.** Nobody does this on the page, in the table. It's free for us and it's the most useful fact a reader can have about ashwagandha research.
2. **`traditional-only` as a first-class evidence grade.** The honest label for most of the pharmacopoeia. Most Ayurveda sites imply evidence that doesn't exist; most science sites omit the tradition entirely. We say plainly: *the texts describe this; nobody has tested it.* That's not a weakness — it's the most trustworthy sentence on the internet about most herbs.
3. **`notStudiedFor` / `neverTested`.** Publishing the *absence* of evidence as content.
4. **Free, complete safety content.** Examine paywalls part of its safety section (`"Full safety information is available to Examine Clinicia…"`). We're non-revenue. Safety must never be gated — and saying so is a positioning statement.
5. **Best-in-class heavy-metal honesty (§1.10).** Saper 2008 in full, including that rasa shastra metals are *intentional*. An Ayurveda publisher volunteering the strongest version of the contamination evidence — against its own commercial interest — is the highest-trust move available to us.
6. **Public `correction` update log.** Examine's `correction` type admits error in public. Adopt it.
7. **Real per-page `lastReviewed`.** Fix the build-date defect (§1.13). If we're going to publish a physician's name against a review date, the date must be true. This one is non-negotiable — it's the site's whole thesis in miniature.

### 4.3 The disclosure problem — **needs Abilash's decision**
Examine's authority is purchased with independence: *"we don't sell supplements, run advertisements, or accept sponsorships"*, plus a contractual staff ban on industry ties. **We sell ashwagandha.** We can never make that claim, and imitating its tone without its substance would be the exact hype the brief forbids.

The only honest substitute is **disclosure at the point of interest, not in a footer**. Proposal — `quality.commercialDisclosure`, rendered inline in §1.10 wherever a Kairali pathway appears:

> *Disclosure: Kairali Ayurvedic Group publishes this site and manufactures ashwagandha products. That is a reason to read this page sceptically. We've stated the evidence limits and the contamination risks for this herb as strongly as the independent sources we cite — see our sources above and check them. Nothing on this page recommends buying anything.*

The current `herbs__ashwagandha.json` already reaches for this instinct — *"That is a statement about quality control, not a claim that the herb treats any condition"* — which is exactly right and should be promoted from a prose sentence to an enforced field.

**Open question for Abilash (→ QUESTIONS.md):** how hard is the wall between monograph and commerce? Recommendation: `routesTo` pathway modules stay **below** the safety and quality sections, never adjacent to an efficacy claim, and the herb monograph never links to a product page for the herb it's about — only to the *pharmacy's quality standards*. Costs a little traffic; buys the only asset this site has.

### 4.4 Why this ranks
- **AEO/GEO (universal Ship-Gate check).** Question H1/H2/H3 (WebMD/ODS converged), ≤40-word capsules, `FAQPage` + `MedicalWebPage` + `DietarySupplement` JSON-LD, `llms.txt` (already built). Typed fields mean an LLM can lift our *structure*, and `mainDrawbacks`/`safety` mirrored into FAQs means it cannot quote only the upside.
- **E-E-A-T.** Named credentialed physician + real dated review + `correction` log + typed citations + a public source-tier policy + a published grade scale at `/evidence-grades` + honest commercial disclosure.
- **Scale.** ~200 herbs × one enforced schema, lint-gated. Content, not code — exactly the architecture the site was built for.
- **Moat.** The Ayurvedic block cannot be copied by Examine (no source competence) or by Ayurveda sites (no honesty). It's a genuinely defensible position, and it's ours mostly for free.

---

## 5. Evidence log (capture conditions)

| Source | URL | Method | Captured | Notes |
|---|---|---|---|---|
| Examine | `https://examine.com/supplements/ashwagandha/` | Playwright (WebFetch 403) | 2026-07-15 | `Last Updated: May 28, 2026`. Headings + Research Snapshot + Dosage + Safety captured verbatim. First capture re-taken: a **shared browser session navigated the tab to mayoclinic.org mid-call**; re-navigated and guarded every subsequent `evaluate` with a `location.href` origin check. |
| Examine methodology | `https://examine.com/about/research-process/` | Playwright | 2026-07-15 | Grade inputs; interaction evidence/severity taxonomy; COI policy — all verbatim. |
| Drugs.com NPP | `https://www.drugs.com/npp/ashwagandha.html` | Playwright (WebFetch 403) | 2026-07-15 | `Medically reviewed by Drugs.com. Last updated on Dec 3, 2025.` |
| NIH ODS | `https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/` | Playwright (WebFetch 403) | 2026-07-15 | `Updated: May 2, 2025`. 82 PubMed-linked refs. |
| MSK About Herbs | `https://www.mskcc.org/cancer-care/integrative-medicine/herbs/ashwagandha` | WebFetch | 2026-07-15 | `Last Updated: Wednesday, April 24, 2024`. |
| WebMD | `https://www.webmd.com/vitamins-supplements/ashwagandha` | Playwright | 2026-07-15 | `Reviewed by Beth Johnston, BCPS, PharmD on Jul 27, 2025`. Redirects from `/vitamins/ai/ingredientmono-953/…`. |
| Saper 2008 (heavy metals) | `https://pmc.ncbi.nlm.nih.gov/articles/PMC2755247/` | WebFetch | 2026-07-15 | JAMA 2008;300(8):915-923. doi:10.1001/jama.300.8.915. n=193; 20.7% metal-containing; rasa shastra 40.6% vs 17.1%, P=.007. |
| API format | search (ayurveda.hu API PDFs, Vol I–VII) | WebSearch | 2026-07-15 | API monograph order: Synonyms, Rasa, Guna, Virya, Vipaka, Karma, Formulations, Therapeutic uses. Legal standard under Drugs and Cosmetics Act, 1940. |

**Negative result:** `mountsinai.org/health-library/herb/ashwagandha` and `/herb/turmeric` both **301 to `/care`** as of 2026-07-15 — Mount Sinai's "About Herbs" library appears retired. It should be dropped from the comp set (and is a small opportunity: those pages ranked and are now gone).

**Unverified / assumptions (per Doctrine (f)):**
- Examine's paywall boundary was observed from a logged-out session; the *full* extent of gated safety content is unverified.
- `DietarySupplement` schema.org property mapping (§1.14) is designed from the type definition but **not yet validated** against Google's Rich Results Test — do that before shipping.
- The evidence-grade scale in §1.5(a) is a **proposal**, not a ratified decision. Needs Abilash (resourcing) + Dr. Deepu John (clinical defensibility).
- Search volumes are quoted from `demand.md` (DataForSEO, 2026-07-15); not re-pulled here.

---

## 6. Recommended next actions
1. **Abilash decision** — §4.3 disclosure wall + §1.5 grade scale (a) vs (b). → QUESTIONS.md.
2. **Fix the `REVIEWED` build-date defect** (`article.tsx:22`) — separate PR, blocks any herb page shipping. → QUESTIONS.md / fix PR.
3. Ratify this spec → `DECISIONS.md`; add the lint rules (§3) to the compliance lint.
4. Build `herb-monograph` type + renderer; **rewrite `herbs__ashwagandha.json` as the reference implementation**; Dr. Deepu John signs off before staging→production.
5. Publish `/evidence-grades` + extend `/about` with the source-tier policy — the grade scale must be public before any grade is displayed.
6. Then scale: moringa (447K/mo) → turmeric → triphala → fenugreek → brahmi, by demand order.
