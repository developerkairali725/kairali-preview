# Teardown: Herb–Drug Interactions & Safety capability — whatisayurveda.com

**Written:** 2026-07-15 17:29:24 IST
**Status:** Research + design proposal. Nothing built. No decisions ratified.
**Scope:** (1) data model, (2) checker vs lean-v1 UX at scale, (3) mandatory per-herb safety content, (4) authoritative sources.
**Register:** group/educational, YMYL health. NOT the KTAHV clinical lock.
**Source discipline:** every fetched page below was treated as DATA (CLAUDE.md rule r). No injection attempts detected in any fetched source. All figures are quoted from the cited primary source; where I could not verify a figure, it is marked **[UNVERIFIED]** rather than filled in.

---

## 0. Three findings that should change the brief before anything is built

I was asked to design around four named interactions. Two of them do not survive contact with the evidence. Flagging this first, because building a "trust us, we're honest" site on a claim that supplement blogs invented would be self-defeating.

### 0.1 "triphala/ginger antiplatelet" — this is largely not real, and we should not publish it

- **Ginger:** the PLOS ONE systematic review (Marx et al. 2015) found the evidence **equivocal** — of eight clinical trials, **four reported reduced platelet aggregation and four reported no effect**. The single clinical trial of ginger + warfarin (Jiang et al.) found **no significant change to INR** over seven days. The review's own conclusion is that evidence ginger affects platelet aggregation and coagulation is equivocal and further study is needed.
  <https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0141119> · <https://pmc.ncbi.nlm.nih.gov/articles/PMC4619316/>
- **Triphala:** I could find **no human evidence of a triphala antiplatelet or anticoagulant interaction**. The claim propagates through supplement-retailer blogs citing each other. The actual peer-reviewed triphala interaction finding is different and more interesting: **reversible inhibition of CYP1A and CYP3A**, raising oral bioavailability of phenacetin and midazolam **in rats**. <https://pmc.ncbi.nlm.nih.gov/articles/PMC9243172/>

**Consequence:** if whatisayurveda.com publishes "triphala thins your blood" it will be repeating exactly the unsourced supplement-marketing folklore the site exists to correct — and it will be doing so in the *safety* section, where being wrong is most expensive. The honest record for triphala is "CYP inhibition shown in rats; human relevance unknown; no human bleeding data either way." That is a real, defensible, differentiating entry. Recommend the brief be corrected.

### 0.2 "guggul & St John's-type CYP effects" — the analogy overstates by an order of magnitude

St John's wort is a potent CYP3A4/P-gp **inducer** with well-replicated, clinically catastrophic consequences (transplant rejection, contraceptive failure). Guggul's human evidence is **one small 1994 crossover study**: gugulipid 1 g significantly reduced Cmax and AUC of propranolol 40 mg (n=10) and diltiazem 60 mg (n=7), P<.01 — Dalvi SS et al., *J Assoc Physicians India* 1994;42(6):454–455, PMID 7852226. <https://pubmed.ncbi.nlm.nih.gov/7852226/>

And the direction is **contested**: in-vitro work on Maha-Yogaraj Guggulu and guggulsterone isomers reports **inhibitory** activity toward CYP3A4 — the opposite direction to the induction implied by the human bioavailability drop. <https://www.nature.com/articles/s41598-020-80595-5> · <https://pmc.ncbi.nlm.nih.gov/articles/PMC7803744/>

**Consequence:** the honest entry is "guggul may alter blood levels of CYP3A4-metabolised drugs in *either* direction; one small human study showed reduced drug levels; mechanism contested; do not combine without your doctor's knowledge." Calling it "St John's-type" would be hype in the opposite direction from the usual — scaremongering rather than boosterism — but it is still inaccuracy, and the site's voice forbids it. **This directly motivates a `contested` flag in the data model (§1.4).**

### 0.3 Heavy metals are a **product** property, not an **herb** property — and the model must reflect that

The heavy-metals story is not "ashwagandha contains lead." It is "*some manufactured products* contain lead, and the subset that intentionally contains metals (rasa shastra / bhasma) is the high-risk class." Saper 2008 is explicit: prevalence of metal-containing products was 20.7% overall, but **rasa shastra products 40.6% vs non-rasa shastra 17.1% (P=.007)**, with median mercury of **20,800 µg/g** in rasa shastra products vs 34.5 µg/g. <https://pubmed.ncbi.nlm.nih.gov/18728265/>

If contamination is modelled as a field on the herb, every herb page inherits a scary, imprecise, and *wrong* warning, and we lose the single most useful thing we can tell a reader: **which class of product to avoid**. Contamination belongs to a separate `product_class` entity (§1.2). This is the main architectural claim of this document.

---

## 1. Data model

### 1.1 The core design decision: severity and evidence are TWO axes, never one badge

Drugs.com collapses everything into one ordinal badge — **Major** ("highly significant; avoid, risks usually outweigh benefit"), **Moderate** ("moderately significant; usually avoid, use only under special circumstances"), **Minor** ("minimally significant; minimize risk, assess risk and consider alternative"). <https://www.drugs.com/drug_interactions.html> · <https://www.drugs.com/answers/interaction-checker-how-minor-moderate-major-3574223.html>

That collapse works for drugs, where the underlying evidence is uniformly regulatory-grade (FDA labels). **It fails for herbs**, where the evidence base ranges from a proper human PK crossover to one blogger's assertion. A single badge forces us to either (a) rate a theoretical in-vitro signal "Major" and become scaremongers, or (b) rate it "Minor" and imply safety we cannot vouch for. Both are dishonest.

So: **`severity` = how bad if it happens. `evidence` = how sure we are it happens.** Rendered as two chips, always together, never averaged.

This is the site's structural honesty advantage over Drugs.com and every supplement blog, and it is the thing worth building. A reader who sees `AVOID · evidence D (animal/in-vitro only)` is being told the truth in a way no competitor tells it.

### 1.2 Entities (three, not one)

```
herb          — botanical. Intrinsic pharmacology. Slug-keyed to existing content/herbs__*.json
product_class — how it's manufactured/sold. Where contamination + adulteration live.
interaction   — herb ↔ (drug | drug_class | condition | procedure | lab_test)
```

### 1.3 `interaction` record

Fits existing conventions in `sites/whatisayurveda.com/app/lib/content.ts` (flat JSON, kebab slugs, `{n, text, url}` citations).

```jsonc
{
  "id": "ashwagandha--thyroid-hormone",
  "herb": "ashwagandha",                    // joins content/herbs__ashwagandha.json
  "target": {
    "type": "drug_class",                   // drug | drug_class | condition | procedure | lab_test
    "name": "Thyroid hormone medication (e.g. levothyroxine)",
    "code": { "system": "ATC", "value": "H03AA" }   // null if none; never invent
  },
  "severity": "caution",                    // avoid | caution | discuss   (§1.4)
  "direction": "herb_affects_drug",         // herb_affects_drug | drug_affects_herb | additive | unknown
  "mechanism": "Ashwagandha may raise circulating thyroid hormone levels, adding to the effect of thyroid replacement.",
  "mechanism_certainty": "proposed",        // established | proposed | unknown
  "evidence": "C",                          // A–E ladder (§1.5)
  "evidence_basis": ["human_case_report", "animal"],
  "clinical_consequence": "Biochemical or symptomatic thyrotoxicosis: palpitations, weight loss, anxiety, tachycardia.",
  "onset": "weeks",                         // immediate | days | weeks | unknown
  "reversible": true,
  "contested": false,                       // §1.4 — conflicting evidence directions
  "population_flags": ["pregnancy", "pre_surgery"],
  "action": "Do not start without telling the doctor who manages your thyroid. Thyroid function may need monitoring.",
  "sources": [
    { "n": 1, "text": "NCCIH. Ashwagandha.", "url": "https://www.nccih.nih.gov/health/ashwagandha" },
    { "n": 2, "text": "Ashwagandha as a Unique Cause of Thyrotoxicosis Presenting With Supraventricular Tachycardia. Cureus.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9035336/" },
    { "n": 3, "text": "Painless Thyroiditis by Withania somnifera (Ashwagandha).", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10981964/" }
  ],
  "reviewed_by": "current",                 // resolves via app/lib/medical-review.ts — NEVER a literal name
  "reviewed_on": "2026-07-15",
  "review_due": "2027-07-15"
}
```

**`reviewed_by: "current"` is load-bearing.** `app/lib/medical-review.ts` already exists and already encodes Abilash's ruling that the reviewer is config, not a literal ("we have many doctors other than Dr. Deepu — he might be head now but not in future"). The interactions dataset must resolve through it, not hardcode a name. A leadership change must stay a one-line edit even across ~3,400 pages.

**Gap found in the existing code:** the `Page` type in `app/lib/content.ts` has **no `reviewed_on` / `lastReviewed` field**, and `MEDICAL_REVIEW` has no date. For YMYL + `MedicalWebPage.lastReviewed` (§2.5) we need a review date per page. That is a real hole to close in v1, not a v2 nicety.

### 1.4 `severity` — plain-language, action-shaped, deliberately NOT Drugs.com's labels

| Value | Meaning | Reader-facing chip |
|---|---|---|
| `avoid` | Do not combine. Plausible serious harm. | **Do not combine** |
| `caution` | Only with the prescribing clinician's knowledge + monitoring. | **Only under supervision** |
| `discuss` | Low expected consequence, but your doctor should know. | **Tell your doctor** |

Rationale for not reusing Major/Moderate/Minor: (a) they are Drugs.com's recognised house vocabulary and borrowing them borrows an implied clinical authority we have not earned; (b) they describe *significance*, not *what to do*; (c) they invite the severity/evidence collapse we are explicitly avoiding. Ours are verbs.

`contested: true` renders an explicit chip — **Evidence conflicts** — with a one-line "why" (guggul is the worked example, §0.2). No competitor does this. It is cheap, it is honest, and it is exactly the site's voice: *state the evidence AND its limits*.

### 1.5 `evidence` ladder A–E

| Level | Basis |
|---|---|
| A | Consistent human RCT / PK data, replicated |
| B | Single human PK study or RCT, **or** multiple concordant case reports with dechallenge/rechallenge |
| C | Isolated human case report(s) |
| D | Animal or in-vitro only |
| E | Theoretical / mechanism-inferred / classical-text only — **no human or animal data** |

Worked assignments from verified evidence gathered for this teardown:

| Interaction | Severity | Evidence | Note |
|---|---|---|---|
| Ashwagandha ↔ thyroid hormone / thyroid disease | caution | C | ≥4 case reports, dechallenge positive |
| Ashwagandha ↔ sedatives/benzodiazepines/alcohol | caution | D | additive sedation; MSKCC lists additive effects |
| Ashwagandha ↔ immunosuppressants | avoid | C | kidney-transplant rejection case (MSKCC adverse reactions) |
| Ashwagandha ↔ pregnancy | avoid | — | NCCIH: "should be avoided during pregnancy and should not be used while breastfeeding" |
| Ashwagandha ↔ surgery | avoid | D | NCCIH: not recommended for people about to have surgery |
| Ashwagandha ↔ hepatotoxic drugs / liver disease | caution | B | LiverTox Likelihood Score **B**, ~23 cases |
| Guggul ↔ propranolol / diltiazem / CYP3A4 substrates | caution | B | **contested: true** — Dalvi n=10/n=7, direction disputed |
| Triphala ↔ CYP3A4/CYP1A substrates | discuss | D | rat PK only; human relevance unknown |
| Triphala ↔ anticoagulants | **discuss** | **E** | **no human data — see §0.1. Do NOT publish as an established interaction** |
| Ginger ↔ warfarin/antiplatelets | discuss | B | B evidence of **no effect**; see §1.6 |

### 1.6 The model must be able to say "studied, and probably NOT an interaction"

Ginger/warfarin is the case that breaks a naive schema. A dataset that can only record *presence* of interactions must either omit ginger (reader concludes nothing is known) or list it (reader concludes there is a risk). **Both are false.** The truth is: it was studied and the interaction was not found.

So `severity` needs a fourth value, or a sibling field:

```jsonc
"finding": "interaction" | "no_interaction_found" | "insufficient_evidence"
```

`no_interaction_found` + evidence B is a genuinely valuable, publishable, *reassuring* record — and it is the single strongest proof that the site reports evidence rather than fear. Nobody in this niche publishes reassurance with citations. Recommend this field be in v1.

### 1.7 `product_class` record — where heavy metals actually live

```jsonc
{
  "id": "rasa-shastra-bhasma",
  "label": "Rasa shastra preparations (bhasmas)",
  "definition": "Traditional preparations that intentionally incorporate processed metals and minerals.",
  "intentional_metals": true,
  "risk": "high",
  "evidence": "A",
  "findings": [
    "Saper 2008: 40.6% of rasa shastra products contained detectable lead, mercury or arsenic vs 17.1% of non-rasa shastra products (P=.007); median mercury 20,800 µg/g vs 34.5 µg/g.",
    "CDC MMWR 2015;64(32):883 — Mahayogaraj Guggulu, purchased on the internet, measured 48,700 mg/kg (4.9%) lead; patient blood lead 85.8 µg/dL."
  ],
  "sources": [ /* … */ ]
}
```

Herbs reference product classes; they do not own contamination. `content/herbs__ashwagandha.json` says "ashwagandha churna is not a rasa shastra preparation, but market contamination is a manufacturing-quality question — here is the evidence and here is what to demand." That is precise, true, and — because KAPPL is WHO-GMP — quietly to our advantage without a word of hype. Note the existing ashwagandha page already does this correctly in prose; this proposal makes it structured and consistent across ~3,400 pages.

### 1.8 File layout (fits the existing repo, content-not-code)

```
sites/whatisayurveda.com/
  content/
    herbs__ashwagandha.json          # existing prose page (unchanged shape)
  data/
    interactions/
      ashwagandha.json               # array of interaction records
      guggul.json
      triphala.json
    product-classes.json
    drug-classes.json                # canonical target vocabulary, prevents "Xanax"/"alprazolam"/"benzo" drift
    safety-boilerplate.json          # §3 reusable blocks, single source of truth
```

Join at build time by `herb` slug in the existing catch-all (`app/[...slug]`). Content pages stay prose; safety becomes structured data; both render from one loader. Scales to 3,400 pages as content, per the site's architecture. `drug-classes.json` is not optional — without a controlled target vocabulary, a 3,400-page dataset becomes unqueryable within months and a future checker becomes impossible to build.

---

## 2. Checker vs lean v1

### 2.1 Recommendation: **ship the per-herb block. Do not ship a checker in v1.** Possibly not ever.

Reasons, in order of weight:

**(a) The null result is the dangerous output.** A checker's most common response, given a real dataset of ~dozens of documented herb–drug interactions against ~20,000 marketed drugs, is *"No interactions found."* A reader hears **"safe."** What we can honestly say is **"we have no record."** For herbs — where absence of evidence is overwhelmingly absence of *study*, not evidence of safety — that gap between what we output and what they hear is the single largest liability and honesty failure in the whole design. Drugs.com can tolerate a null because its corpus is near-complete for drugs. Ours never will be. **A tool whose default answer is systematically misread is a bad tool, however good the data.**

**(b) Personalisation crosses a line that a reference page does not.** A page that says "ashwagandha may interact with thyroid medication" is publishing. A tool that takes *your* medication list and returns a verdict about *you* is closer to advice — and it invites the reader to substitute it for the "tell your doctor" step the whole site is built to drive them toward. It also creates an input the user reasonably expects us to keep private (a medication list is health data). **Whether a consumer-facing interaction checker attracts clinical-decision-support/medical-device or health-data obligations in our target markets (US/EU/India) is a legal question I am not qualified to answer and must not guess at — flag to Abilash for counsel BEFORE any checker work is scoped. [UNVERIFIED — needs legal input, not a web search]**

**(c) With four herb pages live, there is nothing to check.** `content/herbs__*.json` currently holds ashwagandha, brahmi, triphala, turmeric. A checker over four herbs is a toy that inherits every liability above and returns "no interactions found" for essentially every query. The dataset must lead the tool by a wide margin.

**(d) MSKCC — the most authoritative herb resource in the set — has no consumer checker.** It publishes monographs with a dedicated `Herb-Drug Interactions` section, split into *For Patients & Caregivers* and *For Healthcare Professionals*, maintained by a pharmacist and botanicals expert with the Integrative Medicine Service, and it tells professionals that people in cancer treatment should not take supplements unless prescribed. <https://www.mskcc.org/cancer-care/diagnosis-treatment/symptom-management/integrative-medicine/herbs> · <https://www.mskcc.org/cancer-care/integrative-medicine/herbs/ashwagandha> — The institution with the deepest data and the best reason to build a checker publishes structured monographs instead. That is the model to copy.

**Pushback stated plainly, per the operating-principles pushback duty:** "interactions checker" is currently on the roadmap (task #14, whatisayurveda v2/v3). I think shipping one as a consumer tool would be a mistake on honesty grounds *before* it is a mistake on liability grounds — and I'd want it removed from the roadmap or explicitly re-scoped to the §2.4 professional variant. The structured dataset is the valuable asset; the checker is the least defensible way to surface it.

### 2.2 Lean v1: `Interactions & Safety` block on every herb page

Rendered from `data/interactions/<herb>.json`. Structure:

1. **One-line honest header** — e.g. *"What we know, and what nobody has studied."*
2. **Interaction rows** — target · severity chip · evidence chip · mechanism in one plain sentence · consequence · action · numbered citations.
3. **`no_interaction_found` rows** rendered in the same table, visually distinct (§1.6). Reassurance is content.
4. **The absence statement** (non-negotiable, verbatim on every page):
   > Most herb–drug combinations have never been studied. If a medicine is not listed here, that means we have no reliable record of it — not that the combination is safe.
5. **Tell-your-doctor block** with the concrete script (§3.5).
6. **Reviewer byline + review date**, resolving through `MEDICAL_REVIEW`.

Everything here is static, cacheable, indexable, AEO/GEO-friendly (per the universal AEO+GEO ship-gate check), and carries zero personalisation risk. It also directly feeds LLM answer engines — `app/llms.txt/route.ts` already exists — which is where a large share of "can I take X with Y" queries now land. **A structured, cited, two-axis dataset is far more extractable by an answer engine than a JS checker an LLM cannot execute.** The lean v1 is not a compromise; for GEO it is strictly the better artifact.

### 2.3 Scale path (v1 → 3,400 pages)

| Stage | Surface | Gate |
|---|---|---|
| v1 | Per-herb block, ~10–20 herbs | Physician review per herb |
| v1.5 | `/safety/heavy-metals-in-ayurvedic-products` pillar; `/interactions/<herb>-and-<drug-class>` pages for the ~30 combinations with real evidence, generated only where `evidence ∈ {A,B,C}` | Never auto-generate an E-level page — that manufactures fear at scale and is how a "3,400 pages" target quietly turns into a content farm |
| v2 | Drug-class index pages ("Ayurvedic herbs and blood thinners") — reverse join, no personalisation | Physician review per page |
| v3 | Checker — **only if** legal clears it, dataset is broad, and the null-result problem is solved | Abilash + counsel |

### 2.4 If a checker is ever built, the honest version

- Default output is **"We have no record of this combination"** — never "no interactions found", never a green tick, never the word "safe".
- Two-axis result, never a single score.
- No medication list stored, logged, or sent anywhere. Client-side only. No URL params (medication lists are personal data — CLAUDE.md privacy rule).
- Every result ends in the same place: **tell your doctor and pharmacist.**
- Consider the MSKCC split — a professional view with mechanism/PK detail, a patient view that is mostly "discuss this."

### 2.5 Schema.org (verified against schema.org, not assumed)

- `MedicalWebPage` with **`reviewedBy`** (Person/Physician → resolves from `MEDICAL_REVIEW`) and **`lastReviewed`**. Needs the `reviewed_on` field that `Page` currently lacks (§1.3).
- Herb entity: **`DietarySupplement`**, whose relevant properties are `activeIngredient`, `mechanismOfAction`, `safetyConsideration`, `maximumIntake`, `recommendedIntake`, `targetPopulation`, `legalStatus`, `nonProprietaryName`, `proprietaryName`, `isProprietary`. `safetyConsideration` is explicitly defined as "Any potential safety concern associated with the supplement. May include interactions with other drugs and foods." <https://schema.org/DietarySupplement>
- **`interactingDrug` and `contraindication` are NOT properties of `DietarySupplement`** — they belong to `Drug`. Verified. Do not emit them on herb pages; interactions go in `safetyConsideration`. (Recording this because it is exactly the kind of thing that gets invented from memory and then fails validation.)

---

## 3. Mandatory safety content — every herb page, no exceptions

Ten blocks. A herb page missing any of these is a lint failure, not an editorial preference. Boilerplate lives once in `data/safety-boilerplate.json`; per-herb specifics live in the interaction dataset.

1. **Adulteration & heavy metals.** Every page. Uses the `product_class` join so it is precise, not generic fear. Must carry: Saper 2008's 20.7% overall / 40.6% rasa shastra figures; the rasa shastra distinction; the actionable ask — *buy from a manufacturer that follows a recognised standard (e.g. WHO-GMP) and tests raw materials for heavy metals.* NCCIH's framing is usable directly: "Some Ayurvedic preparations may contain lead, mercury, or arsenic in amounts that can be toxic," and FDA cautions the presence of metals in some Ayurvedic products makes them potentially harmful. <https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth>
2. **Pregnancy & lactation.** Explicit per herb. Never "consult your doctor" as a dodge when the source says *avoid*. Must reference the CDC NYC finding — six cases of lead poisoning in **pregnant women** using Ayurvedic medications from India, one product (Vatvidhwansan Ras) at **2% lead**, another at 1.2% — because pregnancy is where the heavy-metals evidence is strongest and the stakes are highest. Fetal lead exposure can affect neurodevelopment, decrease fetal growth, and increase risk of premature birth and miscarriage. MMWR 2012;61(33):641–646. <https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6133a1.htm>
3. **Pre-surgery.** Standing block: tell your surgeon and anaesthetist about every herb; stop-before-surgery guidance per herb where a source supports it (NCCIH: ashwagandha not recommended for people about to have surgery).
4. **Hepatotoxicity**, where a source supports it. Ashwagandha: LiverTox **Likelihood Score B (likely cause of clinically apparent liver injury)**, ~23 reported cases since 2017, latency typically **2–12 weeks**, cholestatic or mixed pattern, mostly mild-to-moderate and self-limited **but fatal cases from acute liver failure described**, resolution usually 1–4 months after stopping. Red-flag symptoms must be named in reader language: jaundice, dark urine, unusual fatigue → stop and seek advice. <https://www.ncbi.nlm.nih.gov/books/NBK548536/>
5. **Interactions & conditions** — the §2.2 block.
6. **Who should not take this** — a plain list, not buried in prose.
7. **The absence-of-evidence statement** — §2.2 item 4. Verbatim, every page.
8. **Evidence honesty on benefits** — the existing ashwagandha page already models this well ("studied for these uses, not proven to treat any condition"; naming that trials are small, short, and sometimes industry-funded). Keep. NCCIH's own limit is quotable: ashwagandha may be safe short-term (up to 3 months); there is not enough information to draw conclusions about long-term safety. <https://www.nccih.nih.gov/health/ashwagandha>
9. **Reviewer byline + review date + review-due**, institutional framing, resolving through `MEDICAL_REVIEW`.
10. **Not-medical-advice + emergency signposting.** Not a footer cop-out — an actual line telling a reader with acute symptoms to seek urgent care rather than read on.

### 3.5 The "tell your doctor" block — make it operational, not decorative

"Tell your doctor" is the most-ignored sentence in health publishing because it gives the reader no way to comply. Give them a script:

> **Tell your doctor and your pharmacist.** Say: *"I am taking [herb], [dose], [how long]."* Bring the actual bottle — the label lists the ingredients, and many Ayurvedic products are multi-herb formulations. If you are having surgery, tell the surgeon and the anaesthetist too.

The "bring the bottle" instruction is doing real work: Saper 2008 and both MMWR reports turn on *products*, often multi-ingredient and internet-purchased, whose contents a patient cannot recite. This one line is more protective than any disclaimer on the page, and it is the kind of practical honesty that earns the reader's trust — which is the whole strategy.

### 3.6 Liability posture

- Never the word **cure**. Never "treats X". "Studied for X" only.
- Never imply completeness. The absence statement is the load-bearing sentence of the entire capability.
- **Never let the KAPPL/WHO-GMP mention become the payoff of a safety section.** It appears once, factually, as the answer to "what should I demand of any manufacturer" — never as the resolution of a fear the page just raised. Manufacturing fear and selling the cure is precisely the "never charity, never hype" line, and it is the failure mode a Kairali-published safety page is most exposed to. The disclosed-publisher framing only survives if the safety content would read identically had a competitor written it. **Recommend this be an explicit review criterion, since a reviewer optimising for conversion would not catch it.**
- Every safety claim carries a citation to a named authority. No uncited safety assertions — that is the triphala trap (§0.1).
- Physician review is per-page and dated, with a `review_due`. An undated review on a YMYL page decays into a liability.

---

## 4. Authoritative sources (all fetched and verified 2026-07-15)

**Tier 1 — cite freely, government/academic:**
| Source | URL | Use |
|---|---|---|
| NCCIH — Ashwagandha | <https://www.nccih.nih.gov/health/ashwagandha> | Safety statements, honest evidence limits. Section structure worth copying: Background / How Much Do We Know? / What Have We Learned? / What Do We Know About Safety? / Keep In Mind |
| NCCIH — Ayurvedic Medicine: In Depth | <https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth> | Heavy metals, FDA caution, US regulatory status |
| LiverTox (NIDDK) — Ashwagandha | <https://www.ncbi.nlm.nih.gov/books/NBK548536/> | Hepatotoxicity, Likelihood Score B. **Gold standard for the liver axis; use its Likelihood Score vocabulary** |
| CDC MMWR 2012;61(33):641–646 — Lead Poisoning in Pregnant Women Who Used Ayurvedic Medications from India, NYC 2011–2012 | <https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6133a1.htm> | Pregnancy + lead. (Page 403s to automated fetch; figures above via search result + Medscape/PDF mirrors — **verify against the PDF before publishing**: <https://www.cdc.gov/mmwr/pdf/wk/mm6133.pdf>) |
| CDC MMWR 2015;64(32):883 — Wisconsin | <https://pmc.ncbi.nlm.nih.gov/articles/PMC5779587/> | BLL 85.8 µg/dL; Mahayogaraj Guggulu at 4.9% lead; internet purchase |
| Saper RB et al. JAMA 2008;300(8):915–923 | <https://pubmed.ncbi.nlm.nih.gov/18728265/> | **The** heavy-metals citation. 193 products; 20.7% (95% CI 15.2–27.1); rasa shastra 40.6% vs 17.1%, P=.007 |
| Dalvi SS et al. J Assoc Physicians India 1994;42(6):454–455 (PMID 7852226) | <https://pubmed.ncbi.nlm.nih.gov/7852226/> | Guggul ↔ propranolol/diltiazem, human PK |
| Marx W et al. PLOS ONE 2015 — ginger & platelet aggregation | <https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0141119> | Ginger: equivocal; warfarin/INR negative |
| Triphala CYP inhibition (rat PK) | <https://pmc.ncbi.nlm.nih.gov/articles/PMC9243172/> | The *real* triphala interaction record |
| Guggulsterone/MYG CYP3A4 (Sci Rep 2020) | <https://www.nature.com/articles/s41598-020-80595-5> | The contested direction |
| Ashwagandha thyrotoxicosis + SVT (Cureus) | <https://pmc.ncbi.nlm.nih.gov/articles/PMC9035336/> | Thyroid case evidence |
| Painless thyroiditis by Withania somnifera | <https://pmc.ncbi.nlm.nih.gov/articles/PMC10981964/> | Thyroid case evidence |
| schema.org DietarySupplement | <https://schema.org/DietarySupplement> | Markup vocabulary |
| Public Health Ontario — Lead Exposure from Ayurvedic Medicines | <https://www.publichealthontario.ca/-/media/documents/f/2019/fact-sheet-lead-ayurveda.pdf> | Clean public-health framing to model |
| CDPH — Lead in Ayurvedic Remedies: A Warning to Clinicians | <https://www.cdph.ca.gov/Programs/CCDPHP/DEODC/OHB/OLPPP/Pages/ayurvedicforclinicians.aspx> | Clinician-facing framing |

**Tier 2 — structural models, cite sparingly:**
- **MSKCC About Herbs** <https://www.mskcc.org/cancer-care/diagnosis-treatment/symptom-management/integrative-medicine/herbs> — the monograph structure to emulate: Scientific Name / Clinical Summary / Purported Uses / Mechanism of Action / Warnings / Contraindications / Adverse Reactions / **Herb-Drug Interactions** / **Herb Lab Interactions** / Dosage, with patient and professional views. Note **Herb-Lab Interactions** is a category we would otherwise have missed — hence `target.type: "lab_test"` in §1.3.
- **Drugs.com** <https://www.drugs.com/drug_interactions.html> — the interaction-checker UX benchmark and the severity vocabulary we are deliberately *not* copying (§1.4).

**Not sources — do not cite:** WebMD/RxList supplement monographs, supplement retailers, `actizeet.in`, `supersonicfood.com`, `nutrawiki.org`, `droracle.ai`, and similar. These surfaced repeatedly during this research and are the origin of the triphala-antiplatelet claim (§0.1). Recommend an explicit **source denylist** in the content pipeline — the failure mode for this site is not fabrication, it is *laundering* a supplement blog's claim into a cited-looking safety statement.

---

## 5. Open questions → QUESTIONS.md

1. **Legal:** does a consumer-facing interaction checker attract clinical-decision-support / medical-device / health-data obligations in US, EU, or India? Needs counsel, not a search. Blocks any checker work. (§2.1b)
2. **Roadmap:** task #14 lists "interactions checker" for v2/v3. Recommend removing or re-scoping to structured dataset + professional view. Needs Abilash. (§2.1)
3. **Brief correction:** triphala/ginger antiplatelet is not supportable as written; guggul "St John's-type" overstates. Needs sign-off to correct. (§0.1, §0.2)
4. **Code gap:** `Page` type has no `reviewed_on`; `MEDICAL_REVIEW` has no date. Required for `MedicalWebPage.lastReviewed`. (§1.3, §2.5)
5. **Clinical sign-off:** the interaction dataset is medical content — Dr. Deepu John (as current reviewer per `MEDICAL_REVIEW`) must sign off severity/evidence assignments before any of it ships. Per CLAUDE.md gate 7. I have assigned §1.5's levels from published sources as a *starting proposal only*; they are not physician-ratified.
6. **CDC MMWR 2012 figures** were obtained via search snippet, not direct fetch (the page 403s). Verify against the PDF before publishing. (§4)

---

## 6. Checker pass (CLAUDE.md doctrine f)

- **Verified by direct fetch:** Saper 2008 abstract figures; LiverTox score/latency/case count; NCCIH ashwagandha safety statements + section structure; NCCIH Ayurvedic-medicine heavy-metals/FDA/regulatory statements; MSKCC monograph structure + About Herbs disclaimer; MMWR 2015 Wisconsin figures; schema.org DietarySupplement properties; repo architecture (`content/*.json`, `app/lib/content.ts`, `app/lib/medical-review.ts`, `app/[...slug]`, four live herb pages).
- **Verified by search result only, NOT direct fetch:** CDC MMWR 2012 NYC figures (page 403s); Drugs.com severity definitions (page 403s); Dalvi 1994 abstract details (PubMed page not fetched — citation and PMID 7852226 confirmed via search); ginger systematic-review numbers (confirmed via search of the PLOS/PMC record). Marked accordingly; verify before publication.
- **Corrected during research, not asserted:** I initially guessed PMID 7751123 for Dalvi 1994; the fetch returned a paper on ghost cell glaucoma. The real PMID is 7852226. Recorded because it is the exact failure mode this doctrine exists to catch — a plausible-looking invented ID would have shipped as a citation.
- **Unverified / out of scope:** all legal and regulatory conclusions (§2.1b, §5.1) — deliberately not guessed. Total addressable page count (~3,400) taken from the brief, not independently derived. Severity/evidence assignments in §1.5 are proposals pending physician review.
- **Nothing built, no git operations run, no files touched outside `docs/whatisayurveda-research/`.**
