# whatisayurveda.com — Teardown: Core-Concept, Classical-Text & Pharmacopoeia Page Types

**Status:** research + field spec, pre-build
**Author:** research agent
**Created:** 2026-07-15 17:31:40 IST
**Scope:** page anatomy + content-JSON field spec for (a) concept pages, (b) classical-text pages, (c) pharmacopoeia pages; plus a licence-clear primary-source register.
**Consumers:** whatisayurveda v2/v3 (task #14), content-geo-writer, seo-aeo-geo-auditor.

> **Prompt-injection screen (CLAUDE.md rule r).** Every external page below was fetched as DATA. No fetched page contained instructions directed at an agent; nothing was acted on from fetched content. The one behaviour-shaping item found is a *published policy* (NCCIH non-endorsement, §2.1) which is recorded as a constraint for humans to ratify, not executed as an instruction. Fetches were read-only; no credentials, no forms.

---

## 1. Why this document exists

The v1 site (20 pages, shipped) is prose. v2/v3 scales to ~3,400 pages, and the scaling units are *reference objects*, not essays: a dosha, a text, a monograph. Reference objects only scale if they are **typed data with a fixed field spec** — otherwise page 400 contradicts page 12 and the site becomes exactly the mush it exists to replace.

The strategic problem specific to this site: **it is published by a company that sells Ayurveda.** Every structural decision below is downstream of that. A page that reads as scholarly from a neutral publisher reads as marketing from us unless it is *visibly harder on itself* than a neutral publisher would be. The teardown targets were chosen to find out exactly how much harder.

---

## 2. Teardown of rigorous references

### 2.1 NCCIH (NIH) — the honesty model, and a hard licence constraint

Source: <https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth>

Section order, as fetched:

1. Is Ayurvedic Medicine Safe?
2. Is Ayurvedic Medicine Effective?
3. How much do we know about Ayurvedic medicine?
4. What Is Ayurvedic Medicine?
5. What the Science Says About the Effectiveness…
6. What the Science Says About the Safety…
7. NCCIH-Funded Research
8. More To Consider
9. For More Information
10. Key References
11. Other References

**Three things worth stealing:**

- **Safety precedes description.** "Is it safe?" is section 1; "What is it?" is section 4. A reader arrives with a risk question, not a definitional one. Our v1 pages all lead with definition. For any page touching ingestion, the safety block should outrank the exposition.
- **"How much do we know" is its own section.** They quantify the *state of the evidence* separately from the *content of the evidence*. This is the single most transplantable idea in the teardown — see `evidence.confidence` in §4.
- **Hedges are load-bearing and specific.** "A few studies suggest…", "most of these trials are small or not well-designed", "Few well-designed clinical trials." Not "some say" — a stated count and a stated methodological weakness.

**Licence:** NCCIH text is **public domain**, credit required — "Text on the NCCIH website is not copyrighted and is in the public domain… you should credit the National Center for Complementary and Integrative Health as the source, and include the publication title and date." Images are mostly purchased and **not** reusable.
Source: <https://www.nccih.nih.gov/tools/privacy>

> ⚠️ **CONSTRAINT — non-endorsement.** The same policy states: *do not use NCCIH's information in a way that suggests NCCIH endorses any commercial product or service.* whatisayurveda.com is published by a group that sells Ayurvedic products and treatments. Citing NCCIH **adjacent to** a Kairali product/treatment CTA is a plausible implied-endorsement reading.
> **Ruling proposed (needs Abilash ratification):** NCCIH citations are permitted in `evidence` and `citations` blocks; **no NCCIH citation may appear inside, or in the block immediately adjacent to, any commercial CTA module.** Enforce as a lint (§8, L4), not a convention.

### 2.2 Wikipedia — steal the skeleton, refuse the voice

Sources: <https://en.wikipedia.org/wiki/Dosha> · <https://en.wikipedia.org/wiki/Charaka_Samhita>

*Dosha* sections: Role in disease (Roga) → Principles → Prana, tejas, ojas → **Criticism** → See also → References.

Its framing is blunt: *"As the tenets of ayurvedic medicine have no basis in science, using the concept of dosha to diagnose or treat disease is pseudoscientific."* It also quotes Harriet Hall's "superstition mixed with a soupçon of practical health advice."

**This is the central design tension of the whole site, so state it plainly:**

We cannot adopt that voice — we'd be a publisher asserting our own subject is pseudoscience, which is neither our honest position nor a coherent product. But we equally cannot *omit* it: this is the highest-ranking neutral treatment of "dosha," it is what an informed reader has already read, and a page that doesn't acknowledge it is transparently the marketing arm of a vendor.

**Ruling: `scientificReception` is a REQUIRED field on every concept page, and it must name and link the strongest criticism, not a strawman of it.** The steward voice is not "we rebut this" and not "we ignore this" — it is *"here is what the tradition holds, here is precisely what has and hasn't been tested, here is who disputes it and why, and here is what we, who make our living from this, will not claim."* That last clause is the only thing on the site a competitor structurally cannot copy. It is the moat. Treat it as such.

The mandatory-criticism rule is also the AEO/GEO play: an LLM asked "are doshas scientifically valid?" will synthesise from sources that *engage* the question. Pages that dodge it are not retrieved for the query that actually gets asked.

*Charaka Samhita* sections: Authorship → Date → Contents → Commentaries → Comparison with Sushruta Samhita → A source for socio-cultural and ecological history → See also → References.

The scholarly moves worth copying:
- **Authorship and Date are separate top-level sections** — because the honest answer to both is a *range with contested attribution*, not a fact. Meulenbeld: composition 4th c. BCE – 2nd c. CE; Charaka's revision c. 100 BCE – 200 CE; Dṛḍhabala's revision 6th c. CE.
- **Recension history is stated as damage.** Dṛḍhabala "had to write one-third of the book himself because this portion had been lost"; "text exists in many versions and entire chapters are missing in some versions." A text page that presents a Samhita as a single stable authored book is *factually wrong*, and its wrongness is the exact tell of devotional-marketing content.
- **Commentary lineage is first-class** (Chakrapani Datta's *Āyurveda Dīpikā*, 1066).

### 2.3 Examine.com — per-outcome grading

Source: <https://examine.com/about/grades/> (page returned HTTP 429 on direct fetch; scale below is from search-result extraction and is marked **UNVERIFIED** pending a re-fetch — do not encode the letter definitions until confirmed.)

The structural principle *is* confirmed and is the one that matters: **grades attach to an (intervention × outcome) pair, never to a substance.** "A single intervention may have no effect on one outcome, and a good effect on another." They grade the *body* of evidence, not single trials, and weigh effect magnitude and clinical significance.

Consequence for us: `evidence` must be an **array keyed by outcome**, never a scalar page-level verdict. "Is ashwagandha effective?" is a malformed question and our schema should make it unaskable.

### 2.4 Ayurvedic Pharmacopoeia of India — the field spec, verbatim

Source PDF (mirror): <https://www.ayurveda.hu/api/API-Vol-1.pdf> — *The Ayurvedic Pharmacopoeia of India*, Part I, Vol. I, Government of India, Ministry of Health and Family Welfare, Dept. of AYUSH. Official host `cdn.ayush.gov.in` failed DNS at fetch time (2026-07-15); mirror used and text extracted locally with pypdf. **Verify against the official PDF before the monograph pipeline goes live** — the e-book itself warns that computer-generated monographs "may be shuffled" in ordering vs. the official book.

Publisher's own General Notices confirm the legal weight of the *name*: "The name given on the top of each monograph… is in Sanskrit as mentioned in the Ayurvedic classics and/or in the Ayurvedic Formulary of India… will be considered official… The official name will be the main title of the drug and its scientific name will also be considered as legal name."

**A monograph's complete field order, extracted verbatim (Aśvagandhā, Vol. I, book p. 19–20):**

| # | Field (verbatim) | Content in the Aśvagandhā monograph |
|---|---|---|
| 1 | *Title* | `10. Asvagandha (Rt.)` / `AŚVAGANDHĀ` — Sanskrit official name + plant part |
| 2 | *Introductory para* (definition) | "consists of dried mature roots of **Withania somnifera** Dunal. (Fam. Solanaceae), a perennial shrub, found in waste land… roots collected in winter, washed and cut into short pieces." — definition + family + habit + distribution + collection method |
| 3 | `SYNONYMS` | Sanskrit, Assamese, Bengali, English, Gujrati, Hindi, Kannada, Kashmiri, Malayalam, Marathi, Oriya, Punjabi, Tamil, Telugu, Urdu (15 language slots; English may be `--`) |
| 4 | `DESCRIPTION` | `a) Macroscopic` · `b) Microscopic` |
| 5 | `IDENTITY, PURITY AND STRENGTH` | Foreign matter NMT 2% (App. 2.2.2); Total Ash NMT 7% (2.2.3); Acid-insoluble ash NMT 1% (2.2.4); Alcohol-soluble extractive NLT 15% (2.2.6); Water-soluble extractive Nil (2.2.7) |
| 6 | `ASSAY` | "not less than 0.2 per cent of total alkaloids" + full method |
| 7 | `CONSTITUENTS` | "Alkaloids and withanolides." |
| 8 | `PROPERTIES AND ACTION` | `Rasa`: Tikta, Kaṣāya · `Guna`: Laghu · `Virya`: Uṣṇa · `Vipaka`: Madhura · `Karma`: Rasāyana, Vātakaphāpaha, Balya, Vājīkaraṇa |
| 9 | `IMPORTANT FORMULATIONS` | Aśvagandhādyariṣṭa, Aśvagandhādi Leha, Balāśvagandha Lākṣādi Taila |
| 10 | `THERAPEUTIC USES` | Śotha, Kṣaya, Daurbalya, Vātaroga, Klaibya |
| 11 | `DOSE` | "3-6 g of the drug in powder form." |

**Four findings that shape the architecture:**

1. **Field 8 is the cross-link spine.** `PROPERTIES AND ACTION` is literally Rasa/Guna/Virya/Vipaka/Karma. The *rasa-virya-vipaka* concept page is therefore not an essay — it is the **legend for a field that appears on every herb page in India's statutory drug standard.** This is the single highest-value structural insight in the teardown: it converts our concept pages from "explainers" into *schema documentation for a legal standard*, and it means concept↔herb cross-links are derivable from data, not hand-authored. (Build implication: the concept pages for rasa/virya/vipaka/guna/karma should ship *before* the monograph pipeline, because every monograph page links into them.)
2. **`THERAPEUTIC USES` is in Sanskrit disease terms** (Śotha, Kṣaya…), and the API ships its own resolution table: the Index includes *"English equivalents of Ayurvedic clinical conditions and diseases."* Use that mapping — do not translate these ourselves. Translating `Klaibya` freehand is exactly how a YMYL site invents a claim.
3. **`Appendix-7: Classical Ayurvedic References`** — the API cites the Samhitas per monograph. That appendix *is* the pharmacopoeia→classical-text edge, pre-built by the Government of India. Our cross-link graph should mirror it rather than invent one.
4. **Fields 5 + 6 are quality-control specifications, not therapeutics.** They must render as such. An ash-limit is not a health claim, and a page that blurs them ("clinically standardised!") is misrepresenting a statutory test.

> ⚠️ **`THERAPEUTIC USES` is the site's biggest YMYL trap.** It is a *statutory list of traditional indications*, not a clinical efficacy claim. Rendering `Śotha, Kṣaya, Daurbalya…` under a heading like "What it treats" would convert a legal citation into a medical claim we cannot support and would breach the no-cure rule. **Ruling: this field renders under its own verbatim label with a mandatory, non-dismissible qualifier**, and never inside a "Benefits" module. See `pharmacopoeia.therapeuticUses.qualifier` (§4c), lint L2.

### 2.5 Drugs and Cosmetics Act, 1940 — First Schedule (the fact nobody else puts on the page)

Extracted from the statute itself: <https://www.indiacode.nic.in/bitstream/123456789/15278/1/drug_cosmeticsa1940-23.pdf> (p. 39–40).

§3(a) defines an "Ayurvedic, Siddha or Unani drug" as one manufactured "exclusively in accordance with the formulae described in, the authoritative books… specified in the First Schedule."

**The First Schedule, Part A (Ayurvedic and Siddha Systems), is a numbered list of 85 books.** All four of our target texts are in it — with statutory serial numbers:

| S.No. | Name of book *as printed in the statute* | Our common name |
|---|---|---|
| 4 | **Ashtanga Haridaya** *(sic — statute's spelling)* | Ashtanga Hridaya |
| 11 | **Bhava Prakasha** | Bhavaprakasha |
| 13 | **Charaka Samhita** | Charaka Samhita |
| 34 | **Sushruta Samhita** | Sushruta Samhita |
| 54C | **"Aurvedic Pharmacopoeia of india"** *(sic)* — ins. by G.S.R. 423(E), 11-6-2002 | Ayurvedic Pharmacopoeia of India |
| 54D | **"Ayurvedic Pharmacopoeia of India and its Parts"** — ins. by G.S.R. 337(E), 15-4-2010 | API and its Parts |
| 54A | Ayurvedic Formulary of India and its Parts | AFI |

Also relevant: Part A was substituted by Act 13 of 1964 s.31 (First Schedule in force w.e.f. 1-2-1969); heading substituted by Act 68 of 1982 s.41.

**Why this matters more than it looks:** every competitor's Charaka Samhita page says "ancient text, foundation of Ayurveda." **None of them say "Serial No. 13 of the First Schedule to the Drugs and Cosmetics Act, 1940 — i.e. a book with current legal force in Indian drug regulation."** That is a checkable, citable, *non-mystical* fact that instantly separates scholarly from devotional. It is also precisely the kind of atomic, sourced fact LLMs retrieve and quote. Make `firstSchedule` a required field on the classical-text type.

Nice precision detail worth preserving rather than silently fixing: the statute misspells *Hridaya* as **"Haridaya"** and *Ayurvedic* as **"Aurvedic"**. Store `statutoryName` verbatim **and** `commonName`; render the statutory spelling with a footnote. Silently "correcting" a statute is a small lie; footnoting it is scholarship — and it demonstrates we read the primary source rather than a summary of it.

### 2.6 WHO ICD-11 TM Module 2 — Ayurveda has real codes now

- ICD-11 TM Module 2 (Ayurveda, Siddha, Unani morbidity codes) launched **10 January 2024, New Delhi** (Ministry of AYUSH + WHO). PIB: <https://www.pib.gov.in/PressReleasePage.aspx?PRID=1994614> *(direct fetch returned HTTP 403; facts below are from search extraction + the IJAR roadmap paper — re-verify before encoding.)*
- **1,941 national AYUSH morbidity codes** mapped; TM2 officially released on the WHO ICD-11 Browser **February 2025**. Source: *India's roadmap for ICD-11 TM2 implementation*, International Journal of Ayurveda Research, 2025 — <https://journals.lww.com/ijar/fulltext/2025/10000/india_s_roadmap_for_icd_11_tm2_implementation_.18.aspx>
- **NAMASTE portal** (National AYUSH Morbidity and Standardized Terminologies Electronic), launched 17 Oct 2017, maintained by the National Institute of Indian Medical Heritage, Hyderabad (CCRAS): <https://namaste.ayush.gov.in/about-namaste-portal> — standardised terminologies + national morbidity codes with **dual coding** against ICD-10/11.

**Implication:** Ayurvedic concepts now have *controlled vocabulary identifiers from the WHO and the Government of India*. Optional `namasteCode` / `icd11Tm2` fields on concept pages let us cite an international standard instead of asserting a definition. This is the strongest available answer to "you're just a vendor defining your own terms."

Caution — and this one is easy to get wrong: **TM2 is a classification of *terminology*, not a WHO validation of *efficacy*.** WHO classifying "Bhramaha" is WHO recording that practitioners use the term. Any page implying "WHO recognises dosha theory" would be a serious misread and hands critics a free hit. Lint L3.

---

## 3. Cross-cutting rulings (apply to all three types)

| # | Ruling | Rationale |
|---|---|---|
| R1 | **Evidence is per-outcome, never per-entity.** | Examine §2.3 |
| R2 | **`scientificReception` is required on concept pages** and must link the strongest published criticism. | §2.2; the moat |
| R3 | **"How much do we know" is a distinct field** (`evidence.confidence`) from "what do we know." | NCCIH §2.1 |
| R4 | **Safety outranks exposition** on any ingestion-touching page. | NCCIH §2.1 |
| R5 | **Statutory/standards facts are quoted verbatim with their label**, never paraphrased into benefit language. | §2.4.4, §2.5 |
| R6 | **Tradition-voice and evidence-voice are structurally separated**, never blended in a sentence. v1 already does this well ("These are traditional descriptions, not medically proven facts") — promote it from prose habit to schema: `traditionalView` vs `evidence` are different fields and render in visually distinct containers. | YMYL |
| R7 | **Reviewer is config, not a literal** — `reviewerId` resolves against `config/roster`. | MEMORY: physician roster |
| R8 | **Dating/authorship are ranges with attribution**, never single dates. | §2.2 |

---

## 4. Page anatomy + content-JSON field spec

### 4.0 Compatibility with the shipped v1 schema

The live loader is `sites/whatisayurveda.com/app/lib/content.ts`, type `Page`:

```ts
slug, title, metaDescription, h1?, breadcrumb?, answerCapsule,
sections[{h2, capsule, body}], faqs?, citations?[{n,text,url}],
routesTo?, clinical, register_ok
```

Conventions in force (from `content/doshas__vata.json`): slug carries a leading `/`; filenames use `__` for path separators; `body` is markdown with inline links and `[1]`-style citation refs; `_manifest.json` mirrors slug/clinical/register_ok.

**Proposal: extend, do not fork.** Add a discriminated `pageType` (`"prose"` default | `"concept"` | `"text"` | `"pharmacopoeia"`) plus one typed payload object per type. Existing 20 pages stay valid with `pageType` absent → `"prose"`. The catch-all route switches renderer on `pageType`.

> 🔴 **Gap found in the shipped v1 — flag to Abilash.** The stated policy is *"every health page is physician-reviewed (one named per page)"*, but **the `Page` type has no reviewer field and no content JSON carries one.** The policy is currently unenforced in code and unexpressed on the page. Before v2 adds 3,000 pages, add `reviewer` to the **base** type (all page types) and lint it. Also worth a decision: `content/doshas__vata.json` carries `clinical: false` while `what-is-ayurveda.json` is `clinical: true` — if dosha pages are non-clinical, what *is* the review trigger? Recommend `clinical` be derived from content class, not hand-set. → QUESTIONS.md.

### 4.0.1 Base fields (added to every page type)

```jsonc
{
  "pageType": "concept",            // "prose" | "concept" | "text" | "pharmacopoeia"
  "reviewer": {                     // REQUIRED on every health page (fixes the v1 gap)
    "reviewerId": "roster:chief-physician",   // resolves via config/roster — never a literal name
    "reviewedOn": "2026-07-20",
    "reviewScope": "full" ,          // "full" | "evidence-only" | "pending"
    "institutionalLine": "Reviewed by the registered physicians of the Kairali Ayurvedic Group"
  },
  "publisherDisclosure": "auto",    // renders the Kairali disclosure block; never omittable
  "lastFactCheck": "2026-07-20",
  "sourceTier": ["primary-classical", "statutory", "peer-reviewed"]
}
```

### 4.a — CONCEPT page

Covers: vata/pitta/kapha, dhatu, srotas, agni, ama, ojas, prakriti, rasa-virya-vipaka.

**Anatomy (render order):**

1. H1 + `answerCapsule` (v1 pattern — keep; it's the AEO extraction target)
2. **What the tradition holds** — `traditionalView`
3. **Where it comes from** — `classicalBasis` (text + locus citations) → links to 4.b
4. **How the term is used today** — `contemporaryUse` (incl. `namasteCode`/`icd11Tm2` if any)
5. **What the evidence says** — `evidence[]`, per-outcome (R1)
6. **How much do we know** — `evidence.confidence` (R3)
7. **Scientific reception & criticism** — `scientificReception` (R2, REQUIRED)
8. **What we do not claim** — `weDoNotClaim[]` ← the steward-voice signature block
9. Related concepts / herbs / treatments — `crossLinks`
10. FAQs · Citations · Reviewer · Disclosure

```jsonc
{
  "pageType": "concept",
  "slug": "/doshas/vata",
  "concept": {
    "iast": "Vāta",                          // diacritics, per API convention
    "devanagari": "वात",
    "translit": "vata",
    "conceptClass": "dosha",                 // dosha|dhatu|srotas|agni|ama|ojas|prakriti|pharmacology
    "alsoKnownAs": ["Vayu"],
    "notToBeConfusedWith": [                 // disambiguation — high AEO value
      { "term": "Vata (banyan)", "note": "Unrelated; vaṭa = Ficus benghalensis." }
    ],
    "oneLineGloss": "The Ayurvedic principle of movement, composed of space and air.",

    "traditionalView": {
      "summary": "…",
      "attributes": [ { "name": "Rūkṣa (dry)", "gloss": "…" } ],
      "governs": ["breathing", "circulation", "elimination"],
      "voice": "tradition"                   // renderer applies tradition-voice container (R6)
    },

    "classicalBasis": [                      // REQUIRED ≥1 — a concept with no locus is not a concept
      {
        "textId": "charaka-samhita",         // FK → 4.b page
        "locus": "Sūtrasthāna 12",           // sthana + chapter (+ verse if known)
        "quote": "…",                        // ONLY from licence-clear translations (§5)
        "translationId": "kaviratna-1890",   // FK → §5 register; lint blocks non-GREEN
        "note": "Dṛḍhabala recension; see text page for recension caveat."
      }
    ],

    "contemporaryUse": {
      "summary": "…",
      "namasteCode": null,                   // NAMASTE controlled vocab, if mapped
      "icd11Tm2": null,                      // { "code": "...", "uri": "..." } — terminology ONLY (L3)
      "icd11Caveat": "auto"                  // renders the TM2 ≠ efficacy-endorsement note
    },

    "evidence": {
      "confidence": {                        // NCCIH "how much do we know" (R3)
        "level": "very-low",                 // very-low|low|moderate|high
        "statement": "There are no validated biomarkers for dosha classification. Studies are small, heterogeneous, and mostly not independently replicated.",
        "asOf": "2026-07-20"
      },
      "byOutcome": [                         // per-outcome, never a page-level verdict (R1)
        {
          "outcome": "Reproducibility of prakriti classification between assessors",
          "direction": "mixed",              // supports|mixed|no-effect|against|untested
          "strength": "low",
          "summary": "…",
          "studyTypes": ["cross-sectional"],
          "citationRefs": [2, 3]
        }
      ],
      "untestedNote": "Most of this concept has not been formulated as a testable hypothesis."
    },

    "scientificReception": {                 // REQUIRED (R2)
      "summary": "Mainstream scientific reference works classify dosha-based diagnosis as lacking a scientific basis.",
      "criticisms": [
        {
          "position": "Dosha-based diagnosis is pseudoscientific; the model is not supported by experimental approaches.",
          "attributedTo": "Wikipedia, 'Dosha' (citing Hall and others)",
          "url": "https://en.wikipedia.org/wiki/Dosha",
          "ourResponse": "We do not dispute that dosha categories lack validated biomarkers. We present them as a traditional pattern language for tailoring routine — not as diagnosis."
        }
      ],
      "steelmanned": true                    // lint: strongest form of the criticism, not a strawman
    },

    "weDoNotClaim": [                        // steward-voice signature
      "That vata classification can diagnose or exclude any medical condition.",
      "That dosha assessment substitutes for medical investigation."
    ],

    "safety": {                              // REQUIRED where the concept drives ingestion/therapy advice (R4)
      "redFlags": ["Persistent symptoms require a qualified doctor, not dosha self-management."],
      "interactionsNote": null
    },

    "crossLinks": {
      "concepts": ["/doshas/pitta", "/concepts/agni"],
      "herbs": ["/herbs/ashwagandha"],       // derivable from API Karma field (§2.4.1)
      "treatments": ["/panchakarma"],
      "derivedFrom": "api-karma"             // provenance of the edge: data, not hand-authored
    }
  }
}
```

**Note on `rasa-virya-vipaka`:** it is not a peer of "vata" — it is the **legend for API field 8** (§2.4.1). Give it `conceptClass: "pharmacology"` and render it with a live example monograph (Aśvagandhā: Rasa Tikta/Kaṣāya · Guna Laghu · Virya Uṣṇa · Vipaka Madhura · Karma Rasāyana…). Every monograph page deep-links each of its five values back to this page's anchors. Ship it early.

### 4.b — CLASSICAL-TEXT page

Covers: Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Bhavaprakasha (+ ~50 more First Schedule books later).

**Anatomy:** H1 + capsule → What it is → **Legal status (First Schedule)** → Authorship (contested) → Date (range) → Structure (sthanas/chapters) → Recension & transmission → Commentaries → Translations (with licence status) → Relation to other texts → What it is *not* → Cross-links → Citations → Reviewer.

```jsonc
{
  "pageType": "text",
  "slug": "/texts/charaka-samhita",
  "text": {
    "commonName": "Charaka Samhita",
    "iast": "Caraka Saṃhitā",
    "devanagari": "चरक संहिता",
    "statutoryName": "Charaka Samhita",      // verbatim from the First Schedule (§2.5)
    "statutorySpellingNote": null,           // e.g. Ashtanga Hridaya → "Statute prints 'Ashtanga Haridaya'."

    "firstSchedule": {                       // REQUIRED — the differentiating fact (§2.5)
      "listed": true,
      "serialNo": 13,
      "part": "A — Ayurvedic and Siddha Systems",
      "act": "Drugs and Cosmetics Act, 1940",
      "section": "3(a)",
      "sourceUrl": "https://www.indiacode.nic.in/bitstream/123456789/15278/1/drug_cosmeticsa1940-23.pdf",
      "note": "Formulations made exclusively per formulae in First Schedule books are regulated as Ayurvedic drugs in India.",
      "scheduleHistory": "First Schedule subs. by Act 13 of 1964, s.31; in force w.e.f. 1-2-1969."
    },

    "authorship": {                          // contested by default (R8)
      "attributedTo": "Agniveśa (as Agniveśa Tantra), redacted by Caraka, completed by Dṛḍhabala",
      "contested": true,
      "positions": [
        { "claim": "'Charaka' denotes a lineage or sect, not one person.", "attributedTo": "Chattopadhyay", "citationRef": 1 }
      ]
    },

    "dating": {                              // ranges, never a single date (R8)
      "compositionRange": "4th c. BCE – 2nd c. CE",
      "redactionRange": "c. 100 BCE – 200 CE",
      "finalRecension": "Dṛḍhabala, 6th c. CE",
      "basis": "Meulenbeld, A History of Indian Medical Literature",
      "citationRef": 1
    },

    "structure": {
      "unit": "sthana",
      "totalChapters": 120,
      "divisions": [
        { "n": 1, "name": "Sūtrasthāna",   "chapters": 30, "subject": "General principles and prevention" },
        { "n": 2, "name": "Nidānasthāna",  "chapters": 8,  "subject": "Causes of disease" },
        { "n": 3, "name": "Vimānasthāna",  "chapters": 8,  "subject": "Physician training and medical ethics" },
        { "n": 4, "name": "Śārīrasthāna",  "chapters": 8,  "subject": "Anatomy and embryology" },
        { "n": 5, "name": "Indriyasthāna", "chapters": 12, "subject": "Diagnosis and prognosis" },
        { "n": 6, "name": "Cikitsāsthāna", "chapters": 30, "subject": "Therapeutics" },
        { "n": 7, "name": "Kalpasthāna",   "chapters": 12, "subject": "Pharmaceutics and toxicology" },
        { "n": 8, "name": "Siddhisthāna",  "chapters": 12, "subject": "Successful treatment and hygiene" }
      ]
    },

    "recension": {                           // REQUIRED — the anti-devotional field (§2.2)
      "summary": "The extant text descends from Dṛḍhabala's recension. Dṛḍhabala states that roughly one-third of the work had been lost and that he wrote that portion himself; he added 17 chapters of Cikitsāsthāna and the whole of Kalpa and Siddhi sthanas.",
      "variantNote": "The text exists in many versions; entire chapters are absent from some.",
      "citationRef": 1
    },

    "commentaries": [
      { "name": "Āyurveda Dīpikā", "author": "Chakrapāṇi Datta", "year": "1066", "note": "Most celebrated commentary." }
    ],

    "translations": [                        // licence status is a FIRST-CLASS field (§5)
      {
        "translationId": "kaviratna-1890",
        "translator": "Kaviraj Avinash Chandra Kaviratna (and Pareshnath Sarma, later parts)",
        "language": "en",
        "years": "1890–1911",
        "licence": "public-domain",
        "licenceEvidence": "Internet Archive item; no visible notice of copyright.",
        "url": "https://archive.org/details/BIUSante_47357",
        "mayQuote": true
      },
      {
        "translationId": "sharma-pv",
        "translator": "P. V. Sharma",
        "language": "en",
        "years": "1981–1994",
        "licence": "in-copyright",
        "url": null,
        "mayQuote": false,
        "note": "Widely regarded as the best modern complete English translation. Cite bibliographically; DO NOT reproduce."
      }
    ],

    "relatedTexts": [
      { "textId": "sushruta-samhita", "relation": "contemporary-complement", "note": "Charaka is weighted to internal medicine; Sushruta to surgery." }
    ],

    "whatItIsNot": [                         // steward voice on a text page
      "It is not a single-author book with a fixed date.",
      "Its First Schedule listing is a regulatory fact about drug formulae — not a state endorsement of efficacy."
    ],

    "crossLinks": { "concepts": ["/doshas/vata"], "herbs": [], "pharmacopoeia": ["/api/asvagandha"] }
  }
}
```

### 4.c — PHARMACOPOEIA (API monograph) page

Mirrors §2.4's field order 1:1. **Fidelity to the source's own field order and labels is the design.**

```jsonc
{
  "pageType": "pharmacopoeia",
  "slug": "/api/asvagandha",
  "pharmacopoeia": {
    "standard": {
      "name": "The Ayurvedic Pharmacopoeia of India",
      "part": "I", "volume": "I", "monographNo": 10,
      "publisher": "Government of India, Ministry of Health and Family Welfare, Dept. of AYUSH",
      "firstScheduleSerialNo": "54C/54D",
      "legalNote": "API is listed in the First Schedule to the Drugs and Cosmetics Act, 1940 (ins. G.S.R. 423(E), 11-6-2002; 'and its Parts' ins. G.S.R. 337(E), 15-4-2010).",
      "sourceUrl": "https://www.ayurveda.hu/api/API-Vol-1.pdf",
      "sourceCaveat": "Mirror of the AYUSH e-book. Verify against the official PDF; the e-book notes generated monographs may reorder Synonyms/Rasa/Guna/Virya/Vipaka/Karma/Formulations/Therapeutic uses.",
      "licence": "govt-of-india-copyright",  // NOT public domain — §5
      "reproductionPolicy": "facts-and-limited-quotation"
    },

    "officialName": "AŚVAGANDHĀ",           // Sanskrit = the official/legal name (General Notices)
    "plantPart": "Rt.",
    "botanicalName": "Withania somnifera Dunal.",
    "family": "Solanaceae",
    "legalNameNote": "The Sanskrit name is official; the scientific name is also a legal name (API General Notices).",

    "definition": "Aśvagandhā consists of dried mature roots of Withania somnifera Dunal. (Fam. Solanaceae), a perennial shrub, found in waste land, cultivated field and open grounds throughout India, widely cultivated in certain areas of Madhya Pradesh and Rajasthan, roots collected in winter, washed and cut into short pieces.",

    "synonyms": {                            // 15 API language slots; "--" preserved as null
      "sanskrit": ["Hayagandhā", "Vājigandhā"], "assamese": ["Ashvagandha"], "bengali": ["Ashvagandha"],
      "english": null, "gujrati": ["Asgandha"], "hindi": ["Asgandh"],
      "kannada": ["Angarberu", "Hiremaddina-gida"], "kashmiri": ["Asagandh"], "malayalam": ["Amukkuram"],
      "marathi": ["Asagandha", "Askagandha"], "oriya": ["Aswagandha"], "punjabi": ["Asgandh"],
      "tamil": ["Amukkaramkizangu"], "telugu": ["Pennerugadda"], "urdu": ["Asgand"]
    },

    "description": { "macroscopic": "…", "microscopic": "…" },

    "identityPurityStrength": {              // QC spec — render as QC, never as therapeutics (§2.4.4)
      "renderAs": "quality-control",
      "tests": [
        { "test": "Foreign matter",              "limit": "Not more than 2 per cent",  "appendix": "2.2.2" },
        { "test": "Total Ash",                   "limit": "Not more than 7 per cent",  "appendix": "2.2.3" },
        { "test": "Acid-insoluble ash",          "limit": "Not more than 1 per cent",  "appendix": "2.2.4" },
        { "test": "Alcohol-soluble extractive",  "limit": "Not less than 15 per cent", "appendix": "2.2.6", "note": "(25 per cent)" },
        { "test": "Water-soluble extractive",    "limit": "Nil",                       "appendix": "2.2.7" }
      ],
      "explainerNote": "These are identity and purity specifications for the raw drug. They describe material quality, not clinical effect."
    },

    "assay": { "requirement": "Not less than 0.2 per cent of total alkaloids", "methodSummary": "…", "methodFull": "…" },
    "constituents": ["Alkaloids", "Withanolides"],

    "propertiesAndAction": {                 // API field 8 — the cross-link spine (§2.4.1)
      "rasa":  [{ "iast": "Tikta",  "conceptRef": "/concepts/rasa#tikta" },
                { "iast": "Kaṣāya", "conceptRef": "/concepts/rasa#kasaya" }],
      "guna":  [{ "iast": "Laghu",  "conceptRef": "/concepts/guna#laghu" }],
      "virya": [{ "iast": "Uṣṇa",   "conceptRef": "/concepts/virya#usna" }],
      "vipaka":[{ "iast": "Madhura","conceptRef": "/concepts/vipaka#madhura" }],
      "karma": [{ "iast": "Rasāyana",       "conceptRef": "/concepts/karma#rasayana" },
                { "iast": "Vātakaphāpaha",  "conceptRef": "/concepts/karma#vatakaphapaha" },
                { "iast": "Balya",          "conceptRef": "/concepts/karma#balya" },
                { "iast": "Vājīkaraṇa",     "conceptRef": "/concepts/karma#vajikarana" }]
    },

    "importantFormulations": [
      { "iast": "Aśvagandhādyariṣṭa", "ref": null },
      { "iast": "Aśvagandhādi Leha", "ref": null },
      { "iast": "Balāśvagandha Lākṣādi Taila", "ref": null }
    ],

    "therapeuticUses": {                     // ⚠️ highest-risk field (§2.4)
      "renderAs": "statutory-traditional-indications",
      "renderUnderHeading": "Therapeutic uses (as listed in the API)",
      "forbiddenHeadings": ["Benefits", "What it treats", "Uses", "Health benefits"],
      "items": [
        { "iast": "Śotha",     "englishEquivalent": "…", "equivalentSource": "API Index: English equivalents of Ayurvedic clinical conditions and diseases" },
        { "iast": "Kṣaya",     "englishEquivalent": "…", "equivalentSource": "API Index" },
        { "iast": "Daurbalya", "englishEquivalent": "…", "equivalentSource": "API Index" },
        { "iast": "Vātaroga",  "englishEquivalent": "…", "equivalentSource": "API Index" },
        { "iast": "Klaibya",   "englishEquivalent": "…", "equivalentSource": "API Index" }
      ],
      "qualifier": "REQUIRED",               // non-dismissible; lint L2
      "qualifierText": "This is the list of traditional indications recorded in India's statutory drug standard. It is a regulatory and textual record, not a statement that the drug has been shown effective for these conditions in clinical trials. See 'What the evidence says' below."
    },

    "dose": { "text": "3-6 g of the drug in powder form.", "note": "As stated in the API. Not a self-medication instruction." },

    "classicalReferences": [ { "textId": "charaka-samhita", "locus": "…", "source": "API Appendix-7: Classical Ayurvedic References" } ],

    "evidence": { "confidence": { "level": "…", "statement": "…" }, "byOutcome": [ /* R1 */ ] },

    "safety": {                              // R4 — safety before exposition
      "position": "above-fold",
      "heavyMetalsNote": "auto",             // renders the NCCIH-sourced contamination caveat
      "pregnancyLactation": "…", "interactions": [ /* → interactions checker */ ], "redFlags": [ "…" ]
    },

    "crossLinks": { "herbPage": "/herbs/ashwagandha", "concepts": ["/concepts/rasa"], "texts": ["/charaka-samhita"] }
  }
}
```

**Herb page vs API page — keep them separate.** `/herbs/ashwagandha` is the reader-facing page (evidence-led, NCCIH-style, safety-first). `/api/asvagandha` is the **standards record** (verbatim, structured, statutory). Merging them is how the ash-limit ends up next to a "benefits" list. They cross-link; they do not merge. This split is also what makes ~3,400 pages tractable: the API side is largely transformation of a fixed source, while the evidence side is where physician review is spent.

---

## 5. Licence-clear primary-source register

**GREEN** = may quote with attribution · **AMBER** = cite/link only, verify before quoting · **RED** = do not reproduce.

| ID | Source | Year | Licence finding | Evidence | Status |
|---|---|---|---|---|---|
| `nccih-ayurveda` | NCCIH, *Ayurvedic Medicine: In Depth* | current | **Public domain** (US Gov). Credit NCCIH + title + date. Images NOT reusable. **Non-endorsement clause applies.** | <https://www.nccih.nih.gov/tools/privacy> | 🟢 **GREEN** (with §2.1 constraint) |
| `dc-act-1940` | Drugs and Cosmetics Act, 1940 — First Schedule | 1940 (amd.) | Indian statute; India Code official text. Reproduction of bare statute is standard practice. | <https://www.indiacode.nic.in/bitstream/123456789/15278/1/drug_cosmeticsa1940-23.pdf> | 🟢 **GREEN** |
| `bhishagratna-sushruta` | *An English Translation of the Sushruta Samhita*, tr. Kaviraj Kunja Lal Bhishagratna, Calcutta | 1907–1916 | Archive.org: **NOT_IN_COPYRIGHT**; "no visible notice of copyright; stated date is 1911" (US). | <https://archive.org/details/englishtranslati00susruoft> | 🟢 **GREEN** |
| `kaviratna-charaka` | *Charaka-Samhita*, tr. Kaviraj Avinash Chandra Kaviratna; later parts pub. Pareshnath Sarma | 1890–1911 | Pre-1929 publication; PD in US. | <https://archive.org/details/BIUSante_47357> · plain text: <https://archive.org/stream/BIUSante_47357/BIUSante_47357_djvu.txt> | 🟢 **GREEN** |
| `api-part1-vol1` | *Ayurvedic Pharmacopoeia of India*, Part I Vol. I | 1989 | **Government of India copyright — 60 years from publication (Copyright Act 1957). NOT public domain (~2049).** Specifications (ash limits, dose, assay values) are **facts** and not protectable expression; monograph *prose* is. | <https://www.ayurveda.hu/api/API-Vol-1.pdf> · <https://www.indiacode.nic.in/handle/123456789/1367> | 🟡 **AMBER** — reproduce **facts/values**; quote prose only in short attributed extracts |
| `api-vol9` | API Part I Vol. IX (official AYUSH CDN) | — | Same as above. **Official host `cdn.ayush.gov.in` failed DNS 2026-07-15** — retry before pipeline. | `https://cdn.ayush.gov.in/wp-content/uploads/2021/03/Ayurvedic-Pharmacopoeia-of-India-part-1-volume-IX.pdf` | 🟡 **AMBER** (unreachable) |
| `joshi-2017-api` | Joshi VK, Joshi A, Dhiman KS. *The Ayurvedic Pharmacopoeia of India, development and perspectives.* J Ethnopharmacol. 2017;197:32–38. | 2017 | In copyright. Cite bibliographically. | PMID 27404231 · doi:10.1016/j.jep.2016.07.030 | 🟡 **AMBER** — cite only |
| `namaste-portal` | NAMASTE Portal (Ministry of AYUSH / CCRAS / NIIMH) | 2017– | Gov portal; terms not yet reviewed. **Check ToU before ingesting codes.** | <https://namaste.ayush.gov.in/about-namaste-portal> | 🟡 **AMBER** |
| `icd11-tm2` | WHO ICD-11 TM Module 2 | 2024/2025 | WHO content is licensed (typically CC BY-NC-SA for ICD) — **NC likely incompatible with a commercially-published site.** Must review WHO ICD licence before use. | PIB PRID 1994614 (403 on fetch) · <https://journals.lww.com/ijar/fulltext/2025/10000/india_s_roadmap_for_icd_11_tm2_implementation_.18.aspx> | 🟡 **AMBER** — link/cite; **do not ingest code text** pending licence review |
| `wikipedia-dosha` / `-charaka` | Wikipedia | current | CC BY-SA 4.0 — **share-alike would infect our content.** Use as *structural model* and as a citable source for the criticism position. **Never copy text.** | <https://en.wikipedia.org/wiki/Dosha> | 🟡 **AMBER** — cite/link only, zero text reuse |
| `wisdomlib-charaka` | Charaka Samhita (Shree Gulabkunverba Ayurvedic Society tr., 1949) on wisdomlib | 1949 | **No licence stated** on site. 1949 translation — likely still in copyright. "Free to read" ≠ free to reuse. | <https://www.wisdomlib.org/hinduism/book/charaka-samhita-english> | 🔴 **RED** — do not reproduce |
| `sharma-pv-charaka` | Charaka Samhita, tr. P. V. Sharma (1981–1994) | 1981–94 | In copyright (Chaukhambha). Archive.org copies appear to be **unlicensed uploads.** | — | 🔴 **RED** — cite bibliographically only |
| `srikantha-murthy-ah` | Ashtanga Hridaya, tr. K. R. Srikantha Murthy (Chowkhamba) | modern | In copyright; in print and sold. Archive.org copy is an unlicensed upload. | <https://archive.org/details/ashtangahridayavagbhattaenglishtranssrikanthamurthyk.r.vol1chowkambha_413_P> | 🔴 **RED** |
| `srikantha-murthy-bp` | Bhavaprakasha Nighantu (English), Chaukhambha | modern | In copyright; currently sold by Chaukhambha. | <https://www.chaukhambha.com/product/bhavaprakasa-nighantu-of-bhavamisra/> | 🔴 **RED** |
| `paradkar-ah` | Ashtangahrdaya (Sanskrit, ed. Bhishagacharya Harishastri Paradkar Vaidya, Nirnay Sagar Press) | 1939 | Archive.org states **CC BY-NC-ND 3.0**. **NC blocks our commercial publisher context; ND blocks derivatives.** | <https://archive.org/details/ashtangahrdaya> | 🔴 **RED** for us |
| `sengupta-ah` | Ashtanga Hridaya, tr. Upendranath & Debendranath Sengupta, Kolkata | 1916 | Archive.org: **"In Public Domain"** — but item metadata describes a **Bengali-language** work. **Language and edition unverified.** | <https://archive.org/details/in.ernet.dli.2015.336695> | 🟡 **AMBER** — verify language before relying on it |

> 🔴 **Two of our four launch texts have no confirmed licence-clear English translation.**
> - **Ashtanga Hridaya:** Srikantha Murthy = RED; Paradkar Sanskrit ed. = CC BY-NC-ND = RED for a commercial publisher; Sengupta 1916 = PD but possibly Bengali.
> - **Bhavaprakasha:** no public-domain English translation identified.
>
> **This is the binding constraint on the text page type, and it should shape the build order.** Consequences: (1) the AH and BP pages must launch **quote-free** — `classicalBasis.quote: null`, citing locus + edition without reproducing translated text (this is legitimate scholarship: cite the verse, don't reprint someone's rendering); (2) **`quote` must be nullable and the renderer must be graceful without it** — if quotes are assumed present, these two pages will be built wrong; (3) Charaka and Sushruta, which *have* GREEN translations, should ship **first** — they prove the quote-bearing renderer while AH/BP prove the quote-free path.
> **Ask (→ QUESTIONS.md):** does the Kairali Group hold, or can it obtain, licence/permission from Chaukhambha for Srikantha Murthy's AH and BP translations? A one-time permission would unlock two of the four launch texts. Abilash decision.

**Two traps worth naming loudly, because both are one careless step away:**
1. **Archive.org availability ≠ licence.** The same site hosts genuine PD scans (Bhishagratna) *and* unlicensed uploads of in-print Chaukhambha books. Every archive.org source needs its item-level copyright field read individually.
2. **CC-NC is a real blocker for us specifically.** Because whatisayurveda.com is published by a commercial group, NC-licensed material (Paradkar; likely WHO ICD) is off-limits even though a university site could use it. The site's honesty position does not create a licence exemption.

---

## 6. Cross-link graph (derive, don't hand-author)

```
CONCEPT (rasa/guna/virya/vipaka/karma)
   ▲  derived edge: API field 8 "PROPERTIES AND ACTION"
   │
PHARMACOPOEIA /api/<drug>  ──── API Appendix-7 ────►  TEXT /texts/<samhita>
   │                                                       ▲
   │ crossLinks.herbPage                                   │ classicalBasis.textId
   ▼                                                       │
HERB /herbs/<name>  ────────────────────────────────►  CONCEPT /doshas/<x>
```

Three of these edges are **derivable from source data** rather than authored: concept↔monograph from API field 8; monograph→text from API Appendix-7; text→statute from the First Schedule. At 3,400 pages, hand-authored cross-links rot; derived ones don't. `crossLinks.derivedFrom` records provenance so the link graph is auditable and regenerable.

## 7. Schema.org / AEO-GEO notes

- Concept → `DefinedTerm` within a `DefinedTermSet` ("Ayurvedic concepts"); `MedicalWebPage` where health content is present. `inDefinedTermSet` + `termCode` (NAMASTE code) if licence clears.
- Text → `Book` (+ `Chapter`/`hasPart` for sthanas); `Legislation` reference for the First Schedule fact.
- Pharmacopoeia → `MedicalWebPage` + `Drug`/`Substance` (`activeIngredient`, `nonProprietaryName`). **Do not use `indication`** for `therapeuticUses` — schema.org `indication` asserts a medical indication and would encode the exact misrepresentation §2.4 forbids. Use plain descriptive markup.
- `reviewedBy` (`Person`/`Organization`) — resolved from roster config (R7), and now finally expressible once the reviewer field exists.
- `answerCapsule` stays the extraction target; `weDoNotClaim` and `scientificReception` are the differentiated retrieval surfaces (nobody else has them).

## 8. Lints to add to the content pipeline

| ID | Rule |
|---|---|
| L1 | `classicalBasis[].quote` non-null ⟹ `translationId` resolves to a **GREEN** register entry. Block otherwise. |
| L2 | `therapeuticUses` present ⟹ `qualifier: "REQUIRED"` and heading ∉ `forbiddenHeadings`. |
| L3 | `icd11Tm2` present ⟹ `icd11Caveat` rendered; no page asserts WHO/ICD endorsement of efficacy. |
| L4 | No NCCIH citation inside or adjacent to a commercial CTA module (§2.1). |
| L5 | `pageType: "concept"` ⟹ `scientificReception.criticisms.length ≥ 1` **and** `steelmanned: true`. |
| L6 | Every page ⟹ `reviewer.reviewerId` resolves against roster; no literal physician names in content JSON. |
| L7 | Banned-claim scan: "cure", "proven", "treats" in `traditionalView`/`therapeuticUses` bodies. |
| L8 | `evidence.byOutcome` non-empty **or** `evidence.untestedNote` present. No silent evidence gaps. |

## 9. Open questions → QUESTIONS.md

1. **Reviewer field missing from the shipped v1 schema** despite the stated per-page physician-review policy. Add to base type + lint before v2 scales. Also: what triggers `clinical: true`? (`doshas/vata` is `false`.) — *Abilash + Dr. Deepu John*
2. **Chaukhambha licence** for Srikantha Murthy's Ashtanga Hridaya + Bhavaprakasha English translations — obtainable? Unblocks 2 of 4 launch texts. — *Abilash*
3. **NCCIH non-endorsement vs. commercial CTAs** — ratify the §2.1 adjacency rule. — *Abilash*
4. **WHO ICD-11 licence** (likely CC BY-NC-SA) — confirm before ingesting any TM2 code text. — *legal/Abilash*
5. **NAMASTE portal ToU** — review before ingesting codes.
6. **`cdn.ayush.gov.in` unreachable** (DNS, 2026-07-15) — re-verify API monographs against the official host before the pipeline runs; mirror is not an acceptable long-term citation for a statutory standard.
7. **Sengupta 1916 Ashtanga Hridaya** — verify language (metadata suggests Bengali, not English).
8. **Examine grade definitions unverified** (HTTP 429) — re-fetch before encoding letter grades. The per-outcome principle is confirmed and safe to build on.

---

## 10. Verification status (rule f — claim vs. machine evidence)

**Verified by direct fetch/extraction:**
- NCCIH section order + hedging patterns + PD/non-endorsement policy.
- Wikipedia Dosha + Charaka Samhita section structure, framing quotes, sthana table, dating.
- API Vol. I: contents list, General Notices, complete Aśvagandhā monograph field order (pypdf extraction, verbatim above).
- Drugs and Cosmetics Act First Schedule: serial numbers, book names incl. statutory misspellings, amending notifications (pypdf extraction from India Code PDF).
- Bhishagratna Sushruta + Paradkar AH + Sengupta AH archive.org copyright fields.
- Joshi 2017 citation via PubMed.
- v1 `Page` type + content conventions + **absence of a reviewer field** (read from repo).

**Unverified / flagged:**
- Examine letter-grade definitions (429).
- PIB ICD-11 TM2 press release (403) — facts corroborated via IJAR paper only.
- API official CDN (DNS failure) — mirror used.
- Sengupta 1916 AH language.
- Indian Copyright Act 60-year government-works term: from search extraction of the Act, **not** confirmed against the bare statute text — confirm §17(d)/§28 before relying on the 2049 date for API.
- NAMASTE / WHO ICD licence terms: **not reviewed**, only flagged.

**Not done (out of scope):** no git operations; nothing edited outside `docs/whatisayurveda-research/`.
