# Teardown: the "Ayurveda for &lt;CONDITION&gt;" page type

**Site:** whatisayurveda.com · **Author:** research agent · **Date:** 2026-07-15 18:04:22 IST
**Status:** design proposal — needs Abilash ratification + Dr. Deepu John clinical sign-off on the guardrail copy before any condition page is authored.
**Sources:** all fetched live this session (URLs inline). All fetched page content was treated as DATA per CLAUDE.md rule (r); no directives were found or acted on. See §11 injection screen.

---

## 0. TL;DR for the synthesis step

The condition page is **the highest-risk page type on the site and the highest-reward**. It is where the long-tail demand is ("ayurvedic medicine for X"), and it is also the exact query shape where the Ayurveda industry does its worst lying ("ayurvedic cure for diabetes"). Our differentiation is not that we know more herbs — it is that **we are the only publisher in this niche willing to write the disappointing sentence**.

The structural thesis, taken from NCCIH: **the guardrail goes before the herbs, not after them.** Every competitor puts "consult your doctor" in a grey footer nobody reads. NCCIH puts "Recognize When You Need More Help" at position 3 — above every complementary approach on the page. We copy that.

---

## 1. What the models actually do (fetched, not remembered)

### 1.1 Mayo Clinic — the two-page split

Mayo splits every condition into two URLs, which is itself the most important architectural finding:

| URL | H2 spine (verified live) |
|---|---|
| `/symptoms-causes/syc-…` | Overview · Symptoms · **When to see a doctor** · Causes · Risk factors · Complications · Prevention |
| `/diagnosis-treatment/drc-…` | Diagnosis · Treatment · Clinical trials · **Lifestyle and home remedies** · **Alternative medicine** · Coping and support · Preparing for your appointment |

Verified: <https://www.mayoclinic.org/diseases-conditions/type-2-diabetes/symptoms-causes/syc-20351193> and <https://www.mayoclinic.org/diseases-conditions/type-2-diabetes/diagnosis-treatment/drc-20351199> (both 403 to plain fetchers; read via headless browser).

Page furniture on the treatment page: `By Mayo Clinic Staff` · `Request an appointment` · dated stamp (`Feb. 27, 2025`) · `Show references` (collapsed citation drawer) · Print.

**The single most valuable artefact in this whole teardown** is Mayo's `Alternative medicine` section for type 2 diabetes, quoted here in full because it is the exact register we should be writing in:

> Many alternative medicine treatments claim to help people living with diabetes. The National Center for Complementary and Integrative Health says studies haven't shown enough proof for any alternative therapies to manage blood sugar. Research has shown the following results about popular supplements for type 2 diabetes:
>
> - Chromium supplements have been shown to help little to none. Large doses can cause kidney damage, muscle problems and skin reactions.
> - Magnesium supplements have been shown to help with blood sugar management in some but not all studies. Side effects include diarrhea and cramping. Doses of more than 5,000 mg a day can be fatal.
> - Cinnamon, in some studies, has lowered fasting glucose levels but not A1C levels. So there's no proof that cinnamon improves blood sugar management overall.
>
> Talk with your healthcare team before using a dietary supplement or natural treatment. Don't use alternative medicines in place of your prescribed diabetes medicines.

Four techniques to steal verbatim:

1. **Open by naming the claim, not the remedy** — "Many alternative medicine treatments *claim* to help".
2. **Outsource the verdict to a neutral authority** — Mayo doesn't say "we think it doesn't work", it says *NCCIH* says the proof isn't there. We should do the same: our credibility on Ayurveda's evidence is inherently contested; NCCIH's is not.
3. **Benefit and harm in the same breath, per item.** Never a benefits list followed by a safety section. `Magnesium … helps in some but not all studies. Side effects include diarrhea and cramping. Doses of more than 5,000 mg a day can be fatal.` One item, one sentence of hope, one sentence of harm, and a number. This is the pattern that makes the page trustworthy rather than promotional.
4. **The last word is "don't substitute"** — not the first word, the last.

Note also the honest negative: cinnamon "lowered fasting glucose … but not A1C. So there's *no proof* that cinnamon improves blood sugar management overall." Mayo publishes the surrogate-endpoint trap. We will need to do this constantly (e.g. "reduced cortisol" ≠ "treated your anxiety").

### 1.2 WebMD — the traffic shape, not the ethics model

<https://www.webmd.com/anxiety-panic/generalized-anxiety-disorder> — spine: What Is · How Common Is · Symptoms · Causes · Risk Factors · Diagnosis · Treatment · **Home Remedies** · Complications · Side Effects of Treatment · Outlook · Prevention · **Takeaways** · **FAQs**.

Furniture: `Written by WebMD Editorial Contributors` + `Medically Reviewed by Zilpah Sheikh, MD on October 15, 2023` + a linked, clickable ToC near the top + a `SOURCES` block.

Take from WebMD: the **question-form H2s** (already our house style), the **clickable ToC**, the **Takeaways** block, and the **dual byline with a named reviewer and a review date**. Note the reviewer is a named individual with credentials and a date — this is the E-E-A-T minimum and it matches what `medical-review.ts` already does.

Do **not** take: WebMD's "How Common Is X" filler sections, or its habit of a `Home Remedies` section with no evidence grading. WebMD is the traffic model; Mayo and NCCIH are the ethics model.

### 1.3 NCCIH — the actual template (this is the one we copy)

<https://www.nccih.nih.gov/health/anxiety-at-a-glance> — spine:

1. **What's the Bottom Line?**
2. What Is Anxiety and Why Is It Important?
3. **Recognize When You Need More Help**
4. About Complementary Health Approaches
5. What the Science Says About Complementary Health Approaches for Anxiety
6. Psychological and Physical Approaches
7. Nutritional Approaches
8. NCCIH-Funded Research
9. **More To Consider**
10. For More Information

Two structural moves we must copy:

- **"What's the Bottom Line?" is section 1** and is a fixed trio of sub-questions — *How much do we know? · What have we learned? · What do we know about safety?* (Same trio on <https://www.nccih.nih.gov/health/ashwagandha>: `How Much Do We Know?` / `What Have We Learned?` / `What Do We Know About Safety?` / `Keep In Mind`.) This is a machine-readable honesty contract: you cannot fill it in without stating your evidence quality up front, above the fold, before you've sold anything.
- **"Recognize When You Need More Help" is section 3** — before a single herb is named. The escalation guardrail *outranks* the content it guards.

NCCIH's calibrated-language bank (quoted from the two pages above — reuse these exact constructions, they are public-domain and they are the register):

- "There is some limited evidence that acupuncture may help reduce anxiety symptoms, but overall, the quality of the studies that have been conducted is low."
- "Because of limitations of the research, including the small size of the studies, no definite conclusions can be reached about its effectiveness."
- "There's not enough evidence to allow any conclusions about whether valerian is helpful for anxiety."
- "Ashwagandha may be safe when taken in the short term (up to 3 months)" / "There is not enough information to allow conclusions about its long-term safety."
- **"Keep in mind that 'natural' does not always mean safe."**

And from <https://www.nccih.nih.gov/health/diabetes-and-dietary-supplements>, the sentence that should be load-bearing on every high-risk condition page:

> It's very important **not** to replace medical treatment for diabetes with an unproven health product or practice.
> Fraudulent diabetes products can be especially dangerous if you use them instead of proven treatments for diabetes. Without proper disease management, people with diabetes are at greater risk of developing serious complications.

From <https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth>, the two facts our condition pages must never omit and must never be defensive about:

- "Some Ayurvedic preparations may contain lead, mercury, or arsenic in amounts that can be toxic."
- "There is no significant regulation of Ayurvedic practice or education in the United States, and no state requires a practitioner to have a license."

The transparent-steward move is to **state both of these ourselves, unprompted**, and then note that KAPPL is WHO-GMP with heavy-metal testing — as a *quality-control* fact, never as a therapeutic claim. The existing `herbs__ashwagandha.json` already does exactly this and gets the tone right; the condition pages should inherit it.

### 1.4 Examine.com — the evidence-grading model

<https://examine.com/supplements/ashwagandha/> — spine: Overview (What is / main benefits / main drawbacks / how does it work) · Dosage Information (+ `Medical disclaimer`) · Safety Information (Safety Summary · Side Effects · Interactions · Pregnancy and Lactation · Precautions · precautions for specific populations · WADA status) · Research Feed · FAQ · **Update History** · Research Breakdown · References.

Two things to steal:

- **"What are X's main drawbacks?" as a first-class H3, adjacent to "main benefits".** Symmetry of benefit and drawback at the structural level, not the paragraph level.
- **`Update History` with major/minor change stamps.** This is the credibility mechanic we are missing. It converts "medically reviewed on <date>" from a decoration into an auditable record. For a site claiming physician review at 3,400-page scale, a visible update history is the difference between a real process and a badge.

### 1.5 Google's bar

The condition page is squarely YMYL: Google's guidelines treat health/safety content as requiring "very high Page Quality rating standards because low quality pages on such topics could potentially negatively impact a person's health" (Search Quality Rater Guidelines, Sep 2025 revision — <https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf>; overview: <https://services.google.com/fh/files/misc/hsw-sqrg.pdf>). Trust is the foundation of E-E-A-T, and YMYL content is expected to come from people or organisations with demonstrable expertise and a trustworthy reputation. Practical read for us: named credentialed reviewer + visible review date + real citations to primary/authoritative sources + transparent publisher disclosure + no unsupported claims. We have the publisher disclosure and the reviewer; §7 flags where the current implementation undercuts the date and the citations.

---

## 2. The competitive gap (why this page type wins)

Every "ayurvedic medicine for anxiety" SERP result is one of three things: (a) a clinic selling a package, (b) a content farm listing ten herbs with zero evidence discussion, (c) a supplement brand. **None of them publish the negative result.** None of them say "the trials are small, short, and manufacturer-funded" — which is the true statement about nearly every herb on the list.

That sentence is our moat. It is also the sentence that makes AI answer engines cite us instead of the content farm, because it is the sentence a careful summarizer needs and cannot find anywhere else in the niche. AEO/GEO upside is a direct consequence of the honesty, not a separate workstream.

---

## 3. Section anatomy — "Ayurveda for &lt;CONDITION&gt;"

Ordering is deliberate and is the design. **Do not reorder without re-reading §1.3.**

| # | Section (`kind`) | H2 pattern | Purpose / rules |
|---|---|---|---|
| 0 | *(page furniture)* | — | Breadcrumb · H1 · dual byline (editorial team + named reviewing physician + review date) · publisher disclosure · **clickable ToC** |
| 1 | `answer-capsule` | *(no H2 — lead capsule)* | 60–80 words. The direct answer, including the limitation. Must contain no claim the body doesn't support. AEO/GEO primary extraction target. |
| 2 | `bottom-line` | "The bottom line on Ayurveda for &lt;condition&gt;" | **NCCIH trio, fixed:** How much do we know? · What have we learned? · What do we know about safety? Rendered as a distinct bordered block, not prose. Non-optional. |
| 3 | `what-is` | "What is &lt;condition&gt;?" | **Deliberately thin — 120–200 words.** We do not compete with Mayo on describing diabetes and we must not try. Defines it, names the conventional standard of care in one clause, then **links out** to Mayo/NHS/NIMH/NIDDK. Linking out to a better source is a trust signal, not a leak. |
| 4 | `red-flags` | "When to get medical help for &lt;condition&gt;" | **Position 3 in NCCIH; position 4 here — above every herb on the page.** Structured `redFlags[]` list of symptoms requiring urgent/emergency care, plus the escalation line. Rendered as a high-contrast callout. Non-optional. Cannot be rendered below the fold on mobile. |
| 5 | `ayurvedic-view` | "How does Ayurveda understand &lt;condition&gt;?" | Dosha framing. **Must be explicitly labelled as a traditional explanatory model, not a biomedical mechanism.** Required framing sentence pattern: "This is how the tradition explains the pattern — it is a classical model, not a description of the biology, and the two should not be confused." Links to `/doshas/*`. |
| 6 | `interventions` | "Which herbs are traditionally used for &lt;condition&gt;?" | **Hub-and-spoke core.** Renders `interventions[]` where `category: "herb"`. Every item: traditional use → evidence grade → benefit-and-harm-in-one-breath (Mayo pattern) → link to `/herbs/<slug>`. Never a bare list. |
| 7 | `interventions` | "Which Ayurvedic therapies are traditionally used?" | `category: "therapy"` — panchakarma etc. Links to `/panchakarma/*`. Same grading discipline. |
| 8 | `interventions` | "What diet and lifestyle measures does Ayurveda suggest?" | `category: "diet"` \| `"lifestyle"`. Links to `/diet/*`, `/lifestyle/*`. **This is where the honest good news lives** — diet/sleep/movement/stress evidence is often genuinely better than the herb evidence, and it is where Ayurveda's advice overlaps with mainstream advice. Say so. |
| 9 | `evidence` | "What does the evidence actually say?" | **The keystone section.** Synthesises across interventions: how many trials, how big, how long, who funded them, what endpoints. Names the surrogate-endpoint trap. Cites NCCIH/Cochrane/PubMed. Links to `/is-ayurveda-scientific`. The word "cure" never appears except to disclaim it. |
| 10 | `safety` | "Is it safe? Side effects, interactions and quality" | Drug–herb interactions (the real risk: hypoglycaemics, anticoagulants, thyroid, sedatives, immunosuppressants). "Natural does not always mean safe." **Heavy metals stated plainly**, citing Saper 2008 + NCCIH. Regulation gap stated plainly. KAPPL WHO-GMP as QC fact only. |
| 11 | `do-not-rely-alone` | "When you should not rely on Ayurveda alone" | **Non-optional, and it is the last content word.** Names the specific harm of delay for *this* condition (Mayo/NCCIH pattern: the danger is not the herb, it is the untaken insulin). Mirrors NCCIH's "not to replace medical treatment … with an unproven health product or practice." Rendered as a callout. |
| 12 | `ask-a-doctor` | "Questions to ask before starting Ayurvedic treatment" | Mayo's `Preparing for your appointment` analog. Empowerment, not funnel. Includes "ask what's in it and whether it's been tested for heavy metals" and "tell your doctor everything you're taking". |
| 13 | *(pathway)* | — | Existing non-promotional `routesTo` module. **On condition pages this must sit after `do-not-rely-alone`, never before it** — otherwise the page reads as a funnel with a disclaimer, which is precisely what we are not. |
| 14 | `faqs` | — | 4–6, question-form, PAA-shaped. Each answer independently true out of context (AI engines quote them stripped of the page). |
| 15 | *(citations)* | — | Numbered, resolvable, primary-or-authoritative. |
| 16 | *(update history)* | — | Examine-style change stamps. See §7.2. |

### Anti-patterns (lintable)

- ❌ A herb list with no evidence grade next to each item.
- ❌ Benefits section followed by a separate safety section (split-breath). Mayo pairs them per item; so do we.
- ❌ "Ayurveda treats/cures/reverses X." Banned outright.
- ❌ Dosha model presented as mechanism ("kapha imbalance *causes* diabetes").
- ❌ Dosages. **Condition pages carry no dosage information at all** — that is a prescription, we are a reference, and dosing without examination is the exact harm we exist to argue against. (Examine carries dosages; Examine is not owned by a company that sells the supplement. We are. The conflict-of-interest asymmetry means we must be stricter than our model.)
- ❌ Pathway/CTA module above the guardrails.
- ❌ Copying Mayo's description of the condition instead of linking to it.

---

## 4. Content-JSON field spec

### 4.1 Grounding: what exists today

The renderer is real and must be extended, not replaced. From `sites/whatisayurveda.com/app/lib/content.ts`:

```ts
export type Section = { h2: string; capsule: string; body: string };
export type Page = {
  slug; title; metaDescription; h1?; breadcrumb?; answerCapsule;
  sections: Section[]; faqs?; citations?; routesTo?;
  clinical: boolean; register_ok: "ok" | "review";
};
```

`Section` has **no discriminator** — so nothing can assert "this page has an evidence section" or "the red-flags block exists". For a page type whose entire safety case rests on *which sections are present and in what order*, that is the blocking gap. Everything below follows from closing it.

### 4.2 Proposed types (additive; existing 20 pages stay valid)

```ts
/** How good is the evidence for this intervention, for THIS condition.
 *  Controlled vocabulary — never free text. Each maps to a fixed,
 *  physician-approved phrase bank (see §4.4) so 3,400 pages can't drift. */
export type EvidenceGrade =
  | "traditional-only"      // classical use; no human trials worth citing
  | "insufficient"          // trials exist, too few/small/poor to conclude  ← the honest default
  | "preliminary"           // small RCTs suggest possible benefit; not settled
  | "mixed"                 // trials disagree
  | "promising-limited"     // multiple RCTs/meta-analysis lean positive; limits remain
  | "no-benefit"            // adequately studied, doesn't work — WE PUBLISH THESE
  | "harmful";              // evidence of harm; present as a warning, not an option

export type Intervention = {
  name: string;                 // "Ashwagandha"
  botanical?: string;           // "Withania somnifera"
  category: "herb" | "therapy" | "diet" | "lifestyle";
  href?: string;                // "/herbs/ashwagandha" — spoke link; REQUIRED for herb|therapy
  traditionalUse: string;       // what the tradition says. ≤ 40 words.
  evidenceGrade: EvidenceGrade;
  evidenceNote: string;         // what trials show + their limits. Cites [n]. ≤ 60 words.
  harmNote: string;             // REQUIRED, non-empty — side effects/interactions/who must avoid.
                                // Enforces Mayo's benefit-and-harm-in-one-breath.
  citations?: number[];         // → Page.citations[].n
};

export type RedFlag = {
  text: string;                 // "chest pain, breathlessness, or sweating"
  urgency: "emergency" | "same-day" | "soon";
};

export type SectionKind =
  | "bottom-line" | "what-is" | "red-flags" | "ayurvedic-view"
  | "interventions" | "evidence" | "safety" | "do-not-rely-alone"
  | "ask-a-doctor" | "generic";

export type Section = {
  h2: string;
  capsule: string;
  body: string;
  id?: string;                  // stable anchor ("evidence") — NOT the index. §7.3
  kind?: SectionKind;           // undefined ⇒ "generic" (back-compat for the existing 20 pages)
  interventionRefs?: string[];  // kind:"interventions" — Intervention.name[] rendered here
};

export type ConditionPage = Page & {
  pageType: "condition";
  condition: string;            // "Generalized anxiety disorder" → MedicalCondition schema. §7.1
  conditionAliases?: string[];  // "anxiety", "GAD" — long-tail + internal search
  riskTier: 1 | 2 | 3;          // §5. Gates review depth + publishability.
  bottomLine: {                 // NCCIH trio — structural, not prose
    howMuchWeKnow: string;
    whatWeHaveLearned: string;
    whatWeKnowAboutSafety: string;
  };
  redFlags: RedFlag[];          // min 2. Rendered at §3 position 4.
  conventionalCare: {           // the standard of care we are NOT replacing
    summary: string;            // ≤ 40 words, neutral
    outboundLinks: {            // REQUIRED min 1 — Mayo/NHS/NIMH/NIDDK/WHO
      label: string; url: string; publisher: string;
    }[];
  };
  interventions: Intervention[];
  doNotRelyAlone: {
    body: string;               // condition-specific harm of delay
    delayHarm: string;          // ≤ 25 words, the concrete consequence
  };
  askYourDoctor?: string[];
  reviewedOn: string;           // ISO date, PER PAGE. §7.2 — not the sitewide constant
  reviewedBy?: string;          // optional override; defaults to MEDICAL_REVIEW.current
  updateHistory?: { date: string; change: string; severity: "major" | "minor" }[];
};
```

### 4.3 Per-section field mapping

| Section | Fields consumed | Renderer note |
|---|---|---|
| capsule | `answerCapsule` | existing `.capsule.lead` |
| bottom-line | `bottomLine.*` | new bordered trio block; each sub-answer ≤ 45 words |
| what-is | section `body` + `conventionalCare.*` | outbound links render as an attributed source list, `rel="noopener"`, publisher named |
| red-flags | `redFlags[]` | high-contrast callout; `emergency` items first; **must render above `interventions` in DOM order** |
| ayurvedic-view | section `body` | model-not-mechanism framing sentence required |
| interventions ×3 | `interventions[]` filtered by `category`, ordered by `section.interventionRefs` | card/row per item: name · grade chip · traditionalUse · evidenceNote · **harmNote** · spoke link |
| evidence | section `body` + `citations` | synthesis prose; the honest section |
| safety | section `body` | heavy metals + regulation gap + interactions |
| do-not-rely-alone | `doNotRelyAlone.*` | callout; **last content section before pathway** |
| ask-a-doctor | `askYourDoctor[]` | plain list |
| — | `reviewedOn`, `reviewedBy` | byline + `lastReviewed` in JSON-LD |
| — | `condition` | → `medicalWebPage({ condition })` → `about: MedicalCondition`. §7.1 |

### 4.4 Phrase bank (grade → allowed language)

Physician-approved once, reused 3,400 times. Authors pick a grade; they do not invent evidence language. This is how honesty scales as content rather than as vigilance.

| Grade | Chip label | Sanctioned phrasing (NCCIH-derived) |
|---|---|---|
| `traditional-only` | Traditional use only | "Used in Ayurveda for &lt;use&gt;. We are not aware of human trials adequate to judge whether it helps with &lt;condition&gt;." |
| `insufficient` | Not enough evidence | "There's not enough evidence to allow any conclusions about whether &lt;x&gt; is helpful for &lt;condition&gt;." |
| `preliminary` | Early evidence | "Some small, short trials suggest &lt;x&gt; may &lt;effect&gt;. Because of limitations of the research, including the small size of the studies, no definite conclusions can be reached." |
| `mixed` | Mixed evidence | "&lt;x&gt; has been shown to help in some but not all studies." |
| `promising-limited` | Promising but limited | "Several trials, including a meta-analysis, lean toward benefit for &lt;effect&gt;. The studies remain &lt;limits&gt;, so this is an encouraging signal rather than settled proof." |
| `no-benefit` | Studied — no clear benefit | "&lt;x&gt; has been shown to help little to none for &lt;condition&gt;." |
| `harmful` | Evidence of harm | "&lt;x&gt; has been linked to &lt;harm&gt; and should not be used for &lt;condition&gt;." |

Banned in every grade: cure, reverse, treat (transitive, of the condition), heal, eliminate, permanent, guaranteed, miracle, remedy-for, "no side effects", "completely safe", "100% natural therefore safe", "root cause" (as a claim of biomedical causation).

Note `no-benefit` and `harmful` are not decoration. **A condition page that grades every intervention ≥ `preliminary` is a red flag in review** — the true distribution across Ayurvedic interventions is dominated by `traditional-only` and `insufficient`, and a page that doesn't show that is selling.

### 4.5 Worked fragment (`/conditions/anxiety`, illustrative — needs clinical sign-off)

```jsonc
{
  "slug": "/conditions/anxiety",
  "pageType": "condition",
  "condition": "Generalized anxiety disorder",
  "conditionAliases": ["anxiety", "GAD", "anxiety disorder"],
  "riskTier": 2,
  "clinical": true,
  "register_ok": "ok",
  "reviewedOn": "2026-07-15",
  "title": "Ayurveda for Anxiety: What the Evidence Says",
  "answerCapsule": "Ayurveda approaches anxiety as a vata disturbance and traditionally uses herbs such as ashwagandha and brahmi alongside diet, routine and breathing practice. Several small trials suggest ashwagandha may reduce stress and anxiety scores, but the studies are short and limited, and no Ayurvedic treatment is proven to treat an anxiety disorder. Anxiety that persists or interferes with your life deserves assessment by a clinician.",
  "bottomLine": {
    "howMuchWeKnow": "A modest amount. A handful of small randomised trials have looked at individual Ayurvedic herbs for stress and anxiety symptoms; whole-system Ayurvedic treatment for diagnosed anxiety disorders is barely studied.",
    "whatWeHaveLearned": "Some small, short trials suggest ashwagandha may reduce stress and anxiety scores. Yoga and breathing practices have better support for anxiety symptoms, though it is not clear they treat anxiety disorders. For most other herbs there is not enough evidence to draw conclusions.",
    "whatWeKnowAboutSafety": "Most of these herbs are generally well tolerated short-term, but 'natural' does not always mean safe: ashwagandha must be avoided in pregnancy, can interact with sedatives and thyroid medicines, and has rarely been linked to liver injury. Ayurvedic products have also been found to contain lead, mercury or arsenic."
  },
  "redFlags": [
    { "text": "thoughts of harming yourself or of suicide — contact emergency services or a crisis line now", "urgency": "emergency" },
    { "text": "panic attacks with chest pain or breathlessness you have not had assessed — these can mimic, or be, a cardiac event", "urgency": "emergency" },
    { "text": "anxiety that stops you working, sleeping, eating or leaving the house", "urgency": "same-day" },
    { "text": "anxiety alongside alcohol or drug use you cannot control", "urgency": "soon" }
  ],
  "conventionalCare": {
    "summary": "Anxiety disorders are treated effectively with psychological therapy (notably CBT), medication, or both. These are proven treatments with decades of evidence behind them.",
    "outboundLinks": [
      { "label": "Generalized anxiety disorder — Symptoms and causes", "url": "https://www.mayoclinic.org/diseases-conditions/generalized-anxiety-disorder/symptoms-causes/syc-20360803", "publisher": "Mayo Clinic" },
      { "label": "Anxiety Disorders", "url": "https://www.nimh.nih.gov/health/topics/anxiety-disorders", "publisher": "National Institute of Mental Health" }
    ]
  },
  "interventions": [
    {
      "name": "Ashwagandha", "botanical": "Withania somnifera", "category": "herb",
      "href": "/herbs/ashwagandha",
      "traditionalUse": "Classed as a rasayana and used where vata is aggravated — the pattern the tradition links with restlessness and poor sleep.",
      "evidenceGrade": "preliminary",
      "evidenceNote": "Several small, short randomised trials report reduced perceived-stress and cortisol scores over 4–12 weeks. The trials are small, brief, use different extracts, and a number are manufacturer-funded; NCCIH calls the evidence limited [1].",
      "harmNote": "Avoid in pregnancy and breastfeeding. May add to drowsiness with sedatives, may raise thyroid hormone, may lower blood sugar and blood pressure. Rare liver injury reported [3]. Stop two weeks before surgery.",
      "citations": [1, 3]
    },
    {
      "name": "Brahmi", "botanical": "Bacopa monnieri", "category": "herb",
      "href": "/herbs/brahmi",
      "traditionalUse": "A medhya rasayana, used in the tradition to steady and support the mind.",
      "evidenceGrade": "insufficient",
      "evidenceNote": "Most trials examine memory and cognition rather than anxiety. There's not enough evidence to allow any conclusions about whether brahmi is helpful for anxiety.",
      "harmNote": "Commonly causes stomach upset, nausea and cramping, particularly on an empty stomach. May interact with sedatives and thyroid medication."
    }
    // … therapy / diet / lifestyle items
  ],
  "doNotRelyAlone": {
    "body": "Anxiety disorders have treatments that work well — psychological therapy and medication are supported by evidence far stronger than anything in this article. Ayurvedic herbs and practices may sit alongside that care; they are not a substitute for it, and treating them as one can cost you years. It is very important not to replace treatment for an anxiety disorder with an unproven product or practice.",
    "delayHarm": "Untreated anxiety tends to entrench, and can escalate to depression or substance use."
  },
  "askYourDoctor": [
    "I'm considering taking <herb> — does it interact with anything I'm already on?",
    "Has this product been tested for heavy metals, and can the maker show me the report?",
    "What would you consider the standard treatment for my anxiety, and what would you expect it to do?"
  ],
  "routesTo": ["KTAHV"],
  "citations": [ /* NCCIH ashwagandha; Saper 2008 JAMA; LiverTox; NCCIH anxiety-at-a-glance */ ]
}
```

---

## 5. Condition risk tiering (gates review depth AND publishability)

Not all conditions carry the same harm-of-delay. The tier is a **field**, and it gates the pipeline.

| Tier | Conditions | Rule |
|---|---|---|
| **1 — low** | dandruff, mild dry skin, occasional constipation, general fatigue, seasonal dryness | Standard review. Harm of delay ≈ 0. |
| **2 — moderate** | anxiety, insomnia, hair fall, joint pain, IBS, acne, PCOS, migraine, mild hypertension | Named-physician review + `red-flags` + `do-not-rely-alone` mandatory. Escalation triggers named explicitly. |
| **3 — high** | type 1 & 2 diabetes, heart disease, asthma, depression, thyroid disease, autoimmune disease, epilepsy, pregnancy-related, paediatric | **Chief-physician sign-off logged in the repo, not just a badge.** `do-not-rely-alone` leads with the harm of delay. No pathway/CTA module at all. Interventions capped at `insufficient` unless a meta-analysis is cited. |
| **DO NOT PUBLISH** | cancer, HIV, tuberculosis, fertility "treatment", COVID/infectious disease, "immunity boosting" as disease prevention, anything paediatric-dosing | **No page.** See below. |

**The do-not-publish list is a recommendation I want to argue for explicitly.** "Ayurvedic cure for cancer" is the single highest-volume, highest-harm query in this niche. We could rank for it. A page that says "there is no evidence Ayurveda treats cancer, please do not delay oncology" is *ethically* the best page on the internet for that query — and it is *commercially and legally* a page owned by a company that sells Ayurvedic products and runs an Ayurvedic hospital, which changes how every regulator, journalist and plaintiff will read it. My recommendation: publish nothing at that tier initially; revisit only as a deliberate, separately-signed-off editorial decision with legal input, never as part of a content sprint. If we do go there, the page must sell nothing, route nowhere, and carry no pathway module. **Escalating to Abilash per CLAUDE.md — this is a money/medical/legal boundary, not an implementation detail.**

---

## 6. Lint gates (`scripts/condition-lint.mjs` — proposed, Monday ritual + pre-PR)

Machine-checkable, so honesty is enforced by CI rather than by whoever writes page 2,900 at 1am.

**Structural**
1. `pageType:"condition"` ⇒ sections of kind `bottom-line`, `what-is`, `red-flags`, `ayurvedic-view`, `evidence`, `safety`, `do-not-rely-alone` ALL present. Fail = block.
2. DOM order: `red-flags` index < every `interventions` index. Fail = block.
3. `do-not-rely-alone` is the last non-generic content section; pathway renders after it.
4. `redFlags.length >= 2`; ≥1 with urgency `emergency`|`same-day` for riskTier ≥ 2.
5. `conventionalCare.outboundLinks.length >= 1`, each an allowlisted publisher (mayoclinic.org, nhs.uk, nih.gov + subdomains, who.int, cdc.gov), each returning 200 (link-check).

**Content**
6. Banned-word scan across all string fields (§4.4 list). Fail = block. *(Distinct from the KTAHV clinical lock — different list, do not cross-apply.)*
7. Every `Intervention` has non-empty `harmNote`. Fail = block. ← enforces the Mayo pattern
8. Every `Intervention` with `category` herb|therapy has an `href` that resolves to an existing content JSON slug. Fail = block. ← enforces hub-and-spoke, catches orphan spokes
9. `evidenceGrade` ∈ enum; `evidenceNote` non-empty; any grade ≥ `preliminary` cites ≥1 citation. Fail = block.
10. **Distribution check:** if no intervention is graded `traditional-only`|`insufficient`|`no-benefit`, warn loudly → human review. A page where everything works is a page that is selling.
11. No digit+unit dose patterns (`/\d+\s?(mg|g|ml|tsp|tbsp)/i`) in condition-page fields. Fail = block.
12. `citations[].url` resolve 200; every `[n]` in body has a matching citation and vice versa.

**Governance**
13. `reviewedOn` present, ISO, not in the future, ≤ 365 days old (warn at 300). Stale = flag, do not silently serve.
14. riskTier 3 ⇒ sign-off record exists in `docs/whatisayurveda-research/signoffs/<slug>.md` with reviewer + date. Fail = block.
15. riskTier 3 ⇒ `routesTo` empty.
16. Condition slug not on the DO-NOT-PUBLISH list. Fail = block.

Per CLAUDE.md (g): a failing gate is never fixed by weakening it.

---

## 7. Findings against the current implementation (pushback — needs decisions)

These are real defects/gaps found by reading the shipped code, not hypotheticals.

### 7.1 `condition` is supported by the schema package but never passed
`packages/schema/src/index.js:164` already does:
```js
about: m.condition ? clean({ "@type": "MedicalCondition", name: m.condition }) : undefined,
```
…but `app/_components/article.tsx` calls `medicalWebPage({ id, name, url, lastReviewed, reviewedById, inLanguage })` — **`condition` is never passed**, so no page emits `about: MedicalCondition`. Free, already-built E-E-A-T/AEO signal, currently unused. Fix: pass `page.condition` when `pageType === "condition"`.

### 7.2 The review date is a hardcoded sitewide constant — this one matters
`app/_components/article.tsx:23`:
```ts
const REVIEWED = "2026-07-14"; // build date; real review cadence tracked in editorial policy
```
Every page on the site — and every page ever added — renders "Reviewed 14 July 2026" in the byline **and** emits it as `lastReviewed` in `MedicalWebPage` JSON-LD. Consequences:
- The date is a **claim about a physician's act**, not a build artefact. A page authored in November 2026 will assert it was reviewed in July 2026, before it existed. That is a false statement in structured data on a YMYL page, made in a named physician's name.
- It cannot express review cadence, so gate #13 is unimplementable.

Fix: per-page `reviewedOn` (§4.2), byline and `lastReviewed` read from it, lint gate on staleness. **Recommend fixing this before any condition page ships, and backfilling the existing 20 pages with their true review dates.** If the true dates aren't known, that is itself the finding, and it needs Dr. Deepu John. → QUESTIONS.md.

### 7.3 Section anchors are index-based
`article.tsx:132` renders `<h2 id={`s-${i}`}>`. Inserting a section silently repoints every deep link below it, and `#s-4` is meaningless to a human, a citation, or an AI answer engine. Condition pages need stable anchors (`#evidence`, `#red-flags`, `#do-not-rely-alone`) — hence `Section.id`. Cheap, and worth doing sitewide.

### 7.4 No `Update History`
Examine's update log (§1.4) is what makes a review claim auditable. Proposed `updateHistory[]` + a rendered block. For a site that will claim physician review across thousands of pages, this is the difference between a process and a badge.

### 7.5 The 3,400-page review promise is the strategic risk — flagging hard
The site promises every health page is physician-reviewed. At ~20 pages that is true and verifiable. **At 3,400 pages it is arithmetically not, unless the review is nominal** — and a nominal review attached to a named, credentialed physician on YMYL content is a worse position than no review claim at all: it converts a content problem into a personal-credibility and potentially regulatory problem for Dr. Deepu John and for KAG.

Condition pages are the sharpest edge of this because they are the pages where a wrong sentence sends someone off their metformin.

Recommendation for Abilash's decision:
- **Cap condition pages hard** (start ~15–25, tier 1–2 only, highest-demand first per `demand.md`).
- Let the *herbs* cluster carry the 2.57M/mo volume — herb pages are lower-harm and their review genuinely scales.
- Make review depth a function of `riskTier`, and log tier-3 sign-offs as files in the repo (gate #14) so the claim is auditable rather than asserted.
- Never let a condition page ship on the same pipeline as an ingredient stub.

This is pushback under the Operating Principles, not a blocker to design — the design above works at 20 pages or 200. It should not be pointed at 3,400.

---

## 8. AEO/GEO notes (Ship-Gate universal check)

- `answerCapsule` + `bottomLine` trio are the extraction targets — both are self-contained and both carry the limitation *inside* the quotable unit. If an AI engine quotes only our capsule, the caveat still travels. That is a design requirement, not a nicety.
- Every FAQ answer must be true stripped of context (they get quoted alone).
- `MedicalWebPage` + `about: MedicalCondition` + `reviewedBy: Physician` + `lastReviewed` is the richest machine-readable trust triple available for this page type — §7.1/§7.2 are both AEO fixes as much as compliance fixes.
- Outbound citation to NIH/Mayo/NHS is a GEO asset: answer engines weight corroboration with authoritative sources, and we are the only site in the niche that will link to a source that contradicts a herb.
- Stable anchors (§7.3) let engines deep-link `#what-does-the-evidence-actually-say` — our most differentiated section.
- `llms.txt` already exists at `app/llms.txt` — condition pages should be listed there with their bottom-line, once any exist.

---

## 9. Open questions → QUESTIONS.md

1. **§7.5** — is the ~3,400-page target compatible with a genuine physician-review promise? Proposed: cap condition pages at 15–25; scale via herbs. Needs Abilash.
2. **§5** — ratify the DO-NOT-PUBLISH list (cancer/HIV/TB/fertility/infectious). Needs Abilash + legal view.
3. **§7.2** — what are the true review dates for the existing 20 pages? Needs Dr. Deepu John. Blocks the `reviewedOn` backfill.
4. **§4.4** — phrase bank + all `do-not-rely-alone` copy needs Dr. Deepu John's sign-off before authoring, per CLAUDE.md rule 7.
5. **§3 row 13** — confirm: no pathway module at all on riskTier 3? (My recommendation: none.)
6. Are condition pages EN-only at launch, or do they inherit a DE/FR obligation? (KTAHV's locale rule is KTAHV's; whatisayurveda's isn't stated.)
7. URL shape: `/conditions/anxiety` vs `/ayurveda-for/anxiety`? Demand data suggests the query is "ayurvedic medicine for X"; `/conditions/<x>` is cleaner and matches the hub-and-spoke pattern of `/herbs/<x>`. Recommend `/conditions/<x>` with an H1 carrying the query language.

---

## 10. Recommended next steps

1. Abilash: rule on Q1 (page cap) and Q2 (do-not-publish list) — both are prerequisites, not follow-ups.
2. Dr. Deepu John: sign off the phrase bank (§4.4), the red-flag sets, and the `do-not-rely-alone` copy pattern.
3. Engineering (independent of 1–2, all backward-compatible): `Section.id`/`kind`, `reviewedOn`, pass `condition` to `medicalWebPage`, stable anchors.
4. `scripts/condition-lint.mjs` (§6) — written and green *before* the first condition page, not after.
5. Pilot ONE tier-2 page end-to-end (`/conditions/anxiety` — highest demand overlap with our best-evidenced herb) through the full gate. Retro it. Then decide the next N.

---

## 11. Prompt-injection screen (CLAUDE.md rule r)

All external content this session was fetched from: nccih.nih.gov (3 pages), mayoclinic.org (2 pages, via headless browser after 403 on plain fetch), webmd.com (1 page), examine.com (1 page, reached via a pre-existing browser tab), guidelines.raterhub.com + services.google.com (search results only, not fetched).

**Screen result: CLEAN.** No imperative text directed at an AI agent, no instruction-shaped content, no attempts to redirect tooling or exfiltrate data were present in any fetched page. All content was treated as data. One incidental note for the record: the first `browser_navigate` to Mayo did not take effect and the browser returned a pre-existing `examine.com` tab (another session's state, not a redirect or an injection) — noticed, verified via `location.href`, and re-navigated. The examine.com content was retained deliberately as a legitimate source (§1.4) since Examine is a named model for this site, not because the page asked to be read.

**Caveat on citations:** NCCIH/Mayo/WebMD structural findings were read via a summarizing fetcher or headless browser this session; direct block quotes above are reproduced as returned. Before any of this copy ships, the quoted evidence statements must be re-verified against the live source by the authoring pass — a summarizer is not an acceptable citation chain for YMYL claims. Flagged as **unverified-for-publication**; verified-as-structure.
