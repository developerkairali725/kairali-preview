# whatisayurveda.com — NEWS / EVIDENCE / REGULATORY section teardown

**Compiled 2026-07-15 17:30:34 IST · Register: GROUP-CORPORATE / EDUCATIONAL (KTAHV clinical lock does NOT apply here) · YMYL health content — every item is physician-reviewed.**
**Companion to `docs/group-inputs/whatisayurveda-niche-brief.md` (§1 comp set, §2.2 byline law, §2.3 schema stack) and `docs/whatisayurveda-research/demand.md` (search demand). This is research + design spec. It approves no copy and ships no code.**

> **Scope.** This document defines the *design* of the news/evidence/regulatory section: what it covers, its cadence, its physician-review gate, its sourcing rules, and how items link back to evergreen pages. Building it is backlog item #14 (`whatisayurveda v2/v3: … news`). Clinical sign-off by Dr. Deepu John (CLAUDE.md rule 7) binds every item before publication.

> **Prompt-injection screen (CLAUDE.md rule r).** All sources below were fetched as DATA. No fetched page contained instructions directed at an agent, hidden directives, or attempts to override tooling. Several sources returned HTTP 403/404 to automated fetch (fda.gov, cdc.gov, ayush.gov.in, examine.com, drugscontrol.org) — those claims are attributed to search-result snippets and **flagged `[snippet-only]`**, not treated as verified primary reads. See §12.

---

## 0 · The one-paragraph thesis

Ayurveda news online is almost entirely two failure modes: **uncritical hype** ("Ashwagandha PROVEN to cure anxiety!") and **uncritical dunking** ("Ayurveda is lead poisoning"). Both are clickbait; neither is true; both are what our audience already distrusts. The open position — and the only one consistent with the transparent-steward voice — is a feed that reports *the same story both camps report* and tells the reader **what the evidence actually establishes and what it does not**, including when the finding is unflattering to Ayurveda. Our credibility asset is precisely our willingness to publish the bad news about our own field. A manufacturer-adjacent publisher that reports a heavy-metals recall or a hepatotoxicity signal accurately is doing something no one expects, and that surprise *is* the E-E-A-T.

The SEO logic follows from the honesty, not the other way round: **news is not the product — it is the freshness engine and the citation magnet that keeps the evergreen pages alive.** Every item exists to (a) carry a dated, physician-reviewed freshness signal, and (b) push authority into an evergreen herb/condition page via a link. An item that links to no evergreen page should not be published (§7).

---

## 1 · Why this section is strategically load-bearing

Three findings from the niche brief make a news/evidence feed unusually high-leverage *for this specific SERP*:

1. **The incumbents are stale.** NCCIH's "Ayurvedic Medicine: In Depth" — the page everyone else cites — was **last updated January 2019** and still ranks [S1]. ayurveda.com's dosha guide carries a **2006** copyright. Chopra's canonical page 404s. Freshness is the one axis where the leaders are structurally weak (niche brief §1.3.4).
2. **Freshness is monitored, not won once.** Healthline holds the dosha long-tail partly on a visible **"updated June 2, 2025"** stamp (niche brief §1.1 [S5]). AI-engine citation share is volatile — a single Gemini refresh replaced 42% of previously cited domains (niche brief §2.2 [S18]).
3. **Nobody credible is running an Ayurveda evidence desk.** WHO now publishes Evidence Gap Maps for traditional medicine [S10, S11]; PubMed carries a steady trickle of Ayurveda RCTs and meta-analyses [S6, S7]; AYUSH issues pharmacopoeial amendments and essential-medicines lists [S14, S15]; FDA/CDC issue heavy-metal alerts [S2, S3, S4, S8, S9]. **These streams exist and nobody aggregates them honestly for a lay reader.** That is a genuinely unoccupied slot, not a keyword gap.

The counter-argument, which we should hold onto: **a news section is a permanent liability.** It creates a recurring physician-review obligation, and a stale news feed ("Latest: March 2026") is *worse* than no news feed — it advertises abandonment on the exact axis we claim to win. §5 sizes the cadence to what the review gate can actually sustain, deliberately low. **If the review capacity is not committed, do not build this section.** That is a real go/no-go, not a formality (§13, Q1).

---

## 2 · The source landscape — what we monitor

Four streams, tiered by how much weight an item may carry.

### 2.1 Tier A — Regulators & standards bodies (highest weight; quotable as fact)

| Source | What it emits | Cadence | URL |
|---|---|---|---|
| **US FDA** — heavy-metal / unapproved-product warnings | Consumer warnings, named-product alerts, warning letters | Episodic | `https://www.fda.gov/drugs/fraudulent-products/fda-warns-about-heavy-metal-poisoning-associated-certain-unapproved-ayurvedic-drug-products` [S2] |
| **US FDA Import Alert 99-42** — DWPE, heavy-metal contamination | Firm/product additions & removals; **revised 21 Apr 2025** | Rolling | `https://www.accessdata.fda.gov/cms_ia/importalert_1167.html` [S3] |
| **US CDC (MMWR)** | Case clusters, Notes from the Field | Episodic | `https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6133a1.htm` [S8]; `.../mm6432a6.htm` [S9] |
| **WHO** — strategy, benchmarks, TM Global Library | Strategy, technical benchmarks, evidence maps | Slow | `https://www.who.int/publications/i/item/9789240113176` [S10] |
| **Ministry of AYUSH / PCIM&H** | API amendments, formulary, NLEAM, GMP rules | Slow | `https://pcimh.gov.in/` [S14]; `https://ayush.gov.in/` |
| **AYUSH Suraksha / APvPI** (National Pharmacovigilance Centre = AIIA New Delhi) | ADR reporting, misleading-ad surveillance | Rolling | `https://suraksha.ayush.gov.in/` [S16] |
| **TGA (Australia)**, **ANSES (France)**, **DTU/Danish FVST** | Non-US/non-India safety alerts and bans | Episodic | [S17], [S19] |

**Why non-Indian regulators matter and must not be filtered out:** a steward publisher that reports only AYUSH and skips FDA/TGA/ANSES is a PR desk. The Danish ashwagandha ban (Apr 2023) and France's ANSES precautionary warning (2024) are contested [S19] — and *reporting the contest honestly*, including the Indian-side critique that DTU's risk assessment was methodologically weak [S19], is exactly the transparent-steward move. We report the ban, the reasoning, **and** the critique — with the critique labelled as what it is (a position, published in an Ayurveda journal, i.e. not disinterested).

### 2.2 Tier B — Evidence (highest weight for effect claims; never quotable as "proven")

- **PubMed / MEDLINE** — Ayurveda RCTs, meta-analyses, systematic reviews.
- **Cochrane Library** — the ceiling of methodological rigour. Note: Cochrane's Ayurveda coverage is **thin and old** — e.g. *Ayurvedic medicine for schizophrenia* (Agarwal, Abhijnhan & Raviraj, Cochrane Database Syst Rev, 2007): 3 trials, 250 participants total, and the honest conclusion that Ayurvedic medication "may have some effects … but has been evaluated only in a few small pioneering trials," with herbal arms showing **greater risk of no improvement in mental state** vs chlorpromazine [S5]. *We publish that finding as-is.*
- **LiverTox (NIDDK)** — the authoritative herb-hepatotoxicity reference [S13].
- **WHO Traditional Medicine Global Library (TMGL)** — launched Dec 2025 at the 2nd WHO Global Summit, New Delhi; **1.6M resources**, Evidence Gap Maps, and "TMGL GPT" [S11, S12]. **Ayurveda and yoga evidence maps were still in development as of the Sep 2025 announcement** [S12] — worth monitoring; when the Ayurveda map lands it is a major item *and* a permanent citation asset for `/is-ayurveda-scientific`.
- **CTRI (Clinical Trials Registry–India)** — registration mandatory since **15 Jun 2009**; AYUSH trials are in scope; 3,632 AYUSH trials registered as of 30 Jul 2020, of which Ayurveda 2,054 (56.55%) [S18]. **Use CTRI as a screening tool** (§6.4): a trial that was never prospectively registered is a red flag we state out loud.

### 2.3 Tier C — Institutional health publishers (context, never our source of fact)

NCCIH [S1], Cleveland Clinic, WebMD, Healthline. We read them to see how a story is being framed for lay readers; we cite the primary source they cite, not them. NCCIH is the exception — it is quotable as an institutional position, and its own canonical statistics (≈40% of Ayurvedic users with elevated blood lead; ~25% of supplements with high lead; ~50% with high mercury [S1]) are legitimately citable **with its 2019 date shown**.

### 2.4 Tier D — Never a source

Press releases from supplement brands (including KAPPL's), trade PR, "study finds" aggregator sites, Instagram/YouTube practitioners, and — **explicitly** — our own group's marketing claims. If Kairali/KAPPL is the subject of an item, §9.3 governs.

---

## 3 · What a credible item actually covers — three item types

The feed is **not** a blog. It has exactly three item types, each with a fixed skeleton. Fixed skeletons are what make 20 → 3,400 pages survivable as content rather than code, and they are what make the physician review fast enough to be real.

### 3.1 Type `STUDY` — a new trial, meta-analysis, or review

**Skeleton (mandatory fields, in order):**

1. **Headline** — descriptive, never a verdict. *"A 10-trial meta-analysis found no significant blood-pressure reduction from Ayurvedic interventions"* — not *"Ayurveda fails hypertension test."*
2. **Answer capsule** (40–60 words, matches existing `answerCapsule` convention) — the finding + its main limit, in one breath.
3. **What the study did** — design, n, duration, comparator, funder, registration ID.
4. **What it found** — effect size with CI, in plain language and in numbers.
5. **What it does NOT show** — *mandatory, never omitted, never empty.* This is the section that distinguishes us.
6. **Where this sits in the evidence** — does it agree with the existing body? Does it change the evergreen page? (→ §7)
7. **Our take** — 2–3 sentences, physician-reviewed, explicitly hedged.
8. **Citations** — numbered, primary, with URLs (existing `citations` field).

**Worked example — the exact item we would publish today:**

> **A 44-study review of Ayurveda for high blood pressure found no statistically significant effect**
> *What it did:* Systematic review with meta-analysis, *Frontiers in Pharmacology*, 2025; 44 studies reviewed, 10 RCTs pooled, 524 participants total.
> *What it found:* Vs placebo (n=118), systolic BP fell by 2.63 mmHg — not statistically significant (95% CI −6.04 to 0.79; p=0.13). Vs standard antihypertensives (n=396), differences were also non-significant. No significant adverse effects were reported in any study.
> *What it does NOT show:* This does not show Ayurveda "works as well as" BP drugs — a non-significant difference in small, heterogeneous trials is not evidence of equivalence. The authors report **very high heterogeneity (I² > 90%)**, small samples, lack of allocation concealment and blinding, short durations, selective reporting, mostly single-centre studies, and non-uniform outcome measures. They state the overall certainty of evidence is **limited**. [S7]
> *Our take:* The honest reading is that the trials done so far are too small and too methodologically weak to answer the question either way. That is a statement about the research, not about the medicine — and it is why we do not present Ayurveda as a substitute for antihypertensive treatment. If you are being treated for high blood pressure, do not stop or change that treatment.
> → *Evergreen:* `/is-ayurveda-scientific` (evidence section)

That item is unflattering, accurate, useful, and cites a real 2025 paper. It is also a natural AEO answer for "does ayurveda lower blood pressure" — a question currently answered online by nobody credible.

**Evidence grade.** Each `STUDY` item carries a visible grade. **Do not clone Examine's A–F letter scale** — it is theirs, it is calibrated to supplements, and a letter grade invites decontextualised screenshotting. Use a four-step verbal ladder mapped to GRADE vocabulary, which is the standard the sources themselves use [S7]:

| Grade | Means | Typical trigger |
|---|---|---|
| **Preliminary** | 1–2 small trials, or animal/in-vitro only | Most Ayurveda herb findings |
| **Limited** | Several small trials, inconsistent or high heterogeneity | The hypertension meta-analysis [S7] |
| **Moderate** | Multiple adequately-powered RCTs, mostly consistent | Rare in this field |
| **Strong** | Consistent, well-powered, replicated | **Currently applies to nothing in Ayurveda — and we say so** |

That last row is a feature. A grading scale whose top rung is honestly empty is more credible than one that flatters. (Examine's approach — RCT/meta-analysis-only inclusion, explicit COI ban, grades reflecting consistency + study count + effect magnitude — is a sound model for *process*, and we follow the process, not the letters. `[snippet-only]` [S20].)

### 3.2 Type `REGULATORY` — a rule, standard, list, or pharmacopoeia change

Covers: API/PCIM&H amendments, NLEAM, GMP (Schedule T / Schedule M-I), WHO strategy and benchmarks, DMR Act enforcement, import alerts, EU/UK/AU novel-food and TMP rules.

**Skeleton:** What changed → Who it binds → From when → What it means for a patient/consumer (the *only* reason a lay reader is here) → What it does not change → Citations.

**Why this type earns links no herb page can.** Nobody has written a plain-English page explaining that **compliance with API quality standards is mandatory for Ayurvedic drugs manufactured in India under the Drugs & Cosmetics Act 1940/Rules 1945, and that manufacturers must meet GMP under Schedule T and Schedule M-I** `[snippet-only]` [S15]. That single fact reframes the entire heavy-metals conversation — not by denying it, but by explaining what the regulatory floor actually is, where it applies (India), and where it does not (a product bought from a US website is outside it, which is precisely the population the FDA and CDC alerts describe [S2, S4, S8, S9]). Journalists and AI engines need that explainer and there isn't a good one.

**Standing regulatory items worth building on day one** (these are evergreen-ish but live in the news section as dated explainers):
- *What the Ayurvedic Pharmacopoeia of India is, and what it does and doesn't guarantee.* API Part I = 7 volumes of single-drug monographs (Vol-VII = Minerals & Metals); Part II = formulations; latest amendment **Amendment List-1 (2023), notified 21.12.2023** `[snippet-only]` [S14].
- *WHO's Global Traditional Medicine Strategy 2025–2034* — agreed by Member States **26 May 2025**, published **30 Oct 2025**; four objectives: strengthen evidence; ensure safety and regulation; integrate TCIM into health systems; optimize cross-sectoral value [S10].
- *WHO benchmarks for the practice of Ayurveda* (11 Feb 2022) and *for the training of Ayurveda* — minimum reference standards for safety and quality; basic-level practitioners must identify safety issues and **report them through pharmacovigilance systems** [S6].
- *How to report a suspected adverse reaction* — APvPI's three-tier network (National PvC = All India Institute of Ayurveda, New Delhi; 5 intermediary + 99 peripheral centres), reporting form for ASU&H drugs, causality analysis pathway, and its explicit mandate to surveil **misleading advertisements** `[snippet-only]` [S16].
- *The DMR Act, 1954* — what may not be advertised, and the Supreme Court's enforcement directions in the IMA v. Patanjali line of cases `[snippet-only]` [S21].

That last one is a nerve to touch deliberately. **We publish an honest explainer on misleading Ayurveda advertising, including the Patanjali contempt proceedings.** A group-owned site that explains the law its own industry keeps breaking is making the single strongest trust claim available to it. It also inoculates us: the DMR/FSSAI claims doctrine (niche brief §5) already governs our own copy, so we are describing a standard we visibly meet.

### 3.3 Type `SAFETY` — an alert, recall, contamination finding, or ADR signal

The highest-stakes type. Skeleton: What was found → In which named product/batch → What harm → **Who should act and how** (concrete: stop use, see a clinician, poison centre **1-800-222-1222** in the US [S2] `[snippet-only]`) → How to avoid the risk class → What this does and does not imply about Ayurveda generally → Citations.

**The permanent safety corpus** these items hang from — all real, all citable, all already partly cited in `herbs__ashwagandha.json`:

- **Saper RB et al., JAMA 2008;300(8):915–923** — the landmark. 230 medicines randomly sampled from 673 found via 5 search engines; 193 analysed by XRF. **20.7% (95% CI 15.2–27.1) contained lead, mercury or arsenic.** US-manufactured 21.7% vs Indian-manufactured 19.5% — **no significant difference** (a fact that cuts against the lazy "Indian products are the problem" framing). **Rasa shastra 40.6% vs non-rasa shastra 17.1% (p=.007)** [S4].
- **CDC MMWR 61(33), 2012** — 6 lead-poisoning cases in **pregnant women** in NYC, 2011–2012; products included **Vatvidhwansan Ras (2% lead)** and one product ("Ovarian") at **up to 1.2% lead**; some also contained mercury and arsenic. Recommendation: providers should consider foreign supplements/traditional remedies as a risk factor in lead poisoning, especially among foreign-born populations and pregnant women. `[snippet-only]` [S8]
- **CDC MMWR 64(32), 2015** — lead poisoning and anemia from Ayurvedic medications **purchased on the internet**, Wisconsin. `[snippet-only]` [S9]
- **FDA** — "There are no FDA-approved ayurvedic products." Harms listed: high blood pressure, kidney injury, fatigue, GI distress, neurologic symptoms; chronic exposure → burning/tingling in fingers/toes, limb weakness, dizziness, agitation, confusion. Products typically **not labelled** as containing lead/mercury/arsenic. FDA has concluded consumption of **any one of 10 Ayurvedic dietary supplements** would likely be injurious from mercury and/or lead exposure, and adds firms to **Import Alert 99-42** (DWPE, revised 21 Apr 2025). Named actions include **Balguti Kesaria** (lead + arsenic + mercury) and **Rheumacare** (lead, mercury, strychnine, brucine, arsenic). `[snippet-only]` [S2, S3]
- **LiverTox (NIDDK) on ashwagandha** — **likelihood score B (likely cause of clinically apparent liver injury)**; ~23 cases in the literature, increasing since first reported 2017; onset **2–12 weeks**; usually **cholestatic or mixed** pattern with jaundice and pruritus; most cases mild-to-moderate and self-limited with recovery in **1–4 months** after stopping; **but fatal acute liver failure has been described**, particularly with pre-existing cirrhosis or advanced liver disease [S13].
- **Denmark (Apr 2023)** banned ashwagandha; **ANSES (France, 2024)** issued a precautionary warning; Sweden and Finland considering action — largely citing DTU's 2020 assessment (abortifacient / sex-hormone / thyroid concerns), which is contested in the Ayurveda literature. `[snippet-only]` [S19]

**⚠️ A methodological finding worth institutionalising.** While researching this document, a **search-result snippet asserted LiverTox grades ashwagandha likelihood "C"**. Fetching the LiverTox page directly returned **"B"**. The snippet was wrong. This is not a curiosity — it is the argument for §6.1 (primary-source rule) in a single data point, and it is exactly the class of error that would end our credibility if it shipped inside a physician-reviewed safety item. **Every grade, number, percentage and date in this section is read from the primary source, never from a snippet, never from an aggregator, never from memory.**

---

## 4 · Voice — transparent steward, zero hype

The register is `docs/group-inputs/whatisayurveda-niche-brief.md` (group-corporate/educational), **not** the KTAHV clinical lock. But YMYL rules bind harder than register here.

**Banned, without exception:** cure, proven, breakthrough, miracle, game-changer, "science finally confirms", "what doctors won't tell you", "ancient wisdom validated", "Big Pharma", detox (as a physiological claim), "clinically proven". Also banned: hedging so heavy it says nothing ("some studies suggest it may possibly help some people").

**Required moves:**
- **Name the limit in the same breath as the finding.** Never a finding in paragraph 1 and caveats in paragraph 9.
- **Report against interest.** When the finding is bad for Ayurveda, publish it plainly. The Cochrane schizophrenia result [S5] and the hypertension null [S7] are *assets*, not problems.
- **Never let gratitude become advocacy.** The voice is duty to a science the family owes much to — and the way you honour a science is by holding it to the standard of a science. Defending it from evidence would be the betrayal, not the loyalty.
- **Distinguish "no evidence of effect" from "evidence of no effect."** Almost every Ayurveda null is the former. Say which one it is.
- **Distinguish the tradition, the product, and the market.** Heavy metals in an unregulated product bought from a website is a *market and manufacturing* failure. It is neither an indictment of the tradition nor excusable by it. Both halves of that sentence are mandatory.
- **Always route to a clinician, never to a purchase.** This site never sells (niche brief). News items route to `/herbs/*`, `/is-ayurveda-scientific`, or "talk to a physician" — never to a KAPPL product.

---

## 5 · Cadence and the physician-review gate

### 5.1 Cadence (deliberately, defensibly low)

| Type | Target cadence | Hard rule |
|---|---|---|
| `SAFETY` | As it happens | A Tier-A safety alert naming a product class we cover is published within **7 days** or we explain why not |
| `REGULATORY` | ~Monthly | Never rushed — rules don't expire in a week |
| `STUDY` | **2 per month, maximum** | Quality gate, not a quota |
| Evergreen re-review sweep | **Quarterly** | Every `clinical: true` page's `lastReviewed` refreshed or re-affirmed |

**~2–4 items/month, ~30/year.** That is small on purpose. It is roughly one physician-hour per week, which is a commitment a working chief physician can actually keep — and a promise we keep is worth more than a schedule we miss. **We publish nothing rather than publish unreviewed.** If a month has nothing worth saying, the correct output is nothing; the quarterly evergreen sweep still refreshes site-wide freshness signals.

This mirrors the standard the leaders set: Cleveland Clinic re-reviews articles "at least every few years" (niche brief §2.2 [S26]); Healthline stamps separate *medically reviewed*, *fact-checked*, and *updated on* dates `[snippet-only]` [S22]. Our quarterly sweep beats both.

### 5.2 The review gate (blocking, no exceptions)

```
 (1) SCAN        Tier A/B monitors → candidate queue          [agent]
 (2) TRIAGE      Does it link to an evergreen page? (§7)      [editor]
                 NO → reject. No orphan news items.
 (3) DRAFT       Fixed skeleton (§3). Every number read from  [content-geo-writer]
                 the PRIMARY source. Snippets never suffice.
 (4) CLAIMS LINT DMR/FSSAI + banned-words + "cure" scan       [automated, blocking]
                 + every citation URL resolves 200
 (5) PHYSICIAN   Dr. Deepu John (or current reviewer per      [BLOCKING — CLAUDE.md r7]
     REVIEW      MEDICAL_REVIEW config) signs:
                   · the finding is stated accurately
                   · "What it does NOT show" is complete
                   · the grade (§3.1) is right
                   · nothing reads as medical advice
 (6) PUBLISH     reviewedAt + reviewedBy stamped from config  [Lane B]
 (7) BACKLINK    Evergreen page's "Latest evidence" block     [same PR — §7.2]
                 updated in the SAME change
 (8) QA          Fetch live, diff vs intent (CLAUDE.md)       [proof-of-work]
```

**Step 5 is the product.** Everything else is logistics. A `SAFETY` item may never be published on a reviewer's absence — it waits. If a safety alert is genuinely urgent and the reviewer is unreachable, the escalation is to Abilash (CLAUDE.md ESCALATION), not to publishing unreviewed.

**Reviewer identity is config, not copy** — `sites/whatisayurveda.com/app/lib/medical-review.ts` is already the single source of truth, with institutional framing ("the registered physicians of the Kairali Ayurvedic Group") plus one named current physician. News items **must** read `MEDICAL_REVIEW.current` and must never hard-code "Dr. Deepu John" into a content JSON. A leadership change must remain a one-line edit that does not invalidate 3,400 pages of review history. *(Note the second-order problem this creates: §13, Q3.)*

---

## 6 · Sourcing rules (binding)

1. **Primary source or it doesn't ship.** Every number, percentage, date, grade, CI and product name is read from the regulator/journal/database itself. Search snippets, aggregators, news write-ups and memory are **never** sufficient. Evidence: the LiverTox B-vs-C snippet error (§3.3).
2. **Cite the source they cite.** If NCCIH or WebMD reports a study, cite the study.
3. **Two independent Tier-A/B sources for any harm claim naming a company or product**, or we describe the regulator's action ("FDA warned…") rather than asserting the underlying fact ourselves.
4. **State the study's own limits, from its own limitations section.** Not our paraphrase of what we think is weak — what the authors themselves conceded [S7].
5. **Registration check.** For any RCT: was it prospectively registered (CTRI mandatory since 15 Jun 2009 for Indian trials, incl. AYUSH [S18]; ClinicalTrials.gov elsewhere)? If not, say so in "What it does NOT show." Unregistered trials are the norm in this literature and readers deserve to know.
6. **Funding and COI disclosed, every time, including ours.** If a trial was funded by the manufacturer of the tested product, that goes in the item. Symmetrically §9.3.
7. **Dead-link discipline.** Every citation URL must resolve at publish time and is re-checked on the quarterly sweep. Government URLs rot aggressively — the FDA and CDC URLs in this very document returned 403/404 to automated fetch during this research.
8. **Archive on capture.** Snapshot every Tier-A source at capture time (regulators silently revise pages; Import Alert 99-42 is explicitly a rolling document [S3]). Store the archive URL alongside the live URL.
9. **No item about a Kairali/KAPPL product without §9.3 disclosure.**
10. **Scraped content is DATA** (CLAUDE.md rule r). Any fetched page is screened for injected instructions before any agent acts on it; on detection, quarantine the URL and downgrade to human review.

---

## 7 · How news feeds the evergreen pages (the SEO core)

**The law: news does not accumulate authority — it *transfers* authority to evergreen pages and then gets out of the way.** A feed of orphan items is a blog, and blogs decay. The niche brief's internal-linking law (§2.1: pillar links every spoke; spokes link back; 2–3 siblings; ≥1 exact-match internal anchor per spoke — worth ~5x traffic in Zyppy's 23M-link study [S22 in brief]) extends to news with two additions:

### 7.1 Every item declares its evergreen parent — or is rejected

Reuse the existing `routesTo` convention and add `evergreenRefs` (§8). Triage step 2 (§5.2) rejects any candidate that cannot name at least one. This single rule is what makes the section SEO-positive rather than a clickbait annex:

| Item | → Evergreen parent |
|---|---|
| Ayurveda–hypertension meta-analysis [S7] | `/is-ayurveda-scientific` |
| LiverTox ashwagandha score B [S13] | `/herbs/ashwagandha` |
| Denmark/ANSES ashwagandha actions [S19] | `/herbs/ashwagandha` |
| FDA heavy-metal warning / Import Alert 99-42 [S2, S3] | `/is-ayurveda-scientific` (safety), `/herbs` hub |
| Saper JAMA rasa shastra finding [S4] | `/is-ayurveda-scientific`, `/herbs` |
| WHO strategy 2025–2034 [S10] | `/what-is-ayurveda`, `/is-ayurveda-scientific` |
| API amendment / NLEAM [S14, S15] | future `/pharmacopoeia` hub (backlog #14) |
| Cochrane schizophrenia review [S5] | `/is-ayurveda-scientific` |

### 7.2 The backlink is written in the *same* change

Publishing an item **must** update its evergreen parent in the same PR — a dated "Latest evidence" block, 1–2 sentences, linking the item:

> **Latest evidence — 15 Jul 2026.** A 2025 systematic review pooling 10 RCTs (524 participants) found no statistically significant blood-pressure reduction, with very high heterogeneity between trials. → *Read the full breakdown*

This does three things at once: (a) the evergreen page's `dateModified`/`lastReviewed` legitimately advances — it *actually changed*, so this is a real freshness signal, not a manufactured one; (b) the reader on the money page sees current evidence; (c) internal links flow news → evergreen, which is the direction that compounds. **If the evergreen page has nothing to add, the item was not worth publishing.**

### 7.3 The evidence-history pattern (the moat)

Each evergreen `clinical: true` page eventually carries a compact, dated **evidence history** — every item ever published about it, newest first. Cheap to render from `evergreenRefs` (no new data), and it produces something no competitor has: *a visible, auditable record of how the evidence on ashwagandha changed over time, including when it got worse.* NCCIH's page is a 2019 snapshot; ours would be a ledger. That is the durable asset this whole section exists to build.

### 7.4 URL, index and canonical rules

- **`/news/<yyyy-mm-dd>-<slug>`** — date in the URL is honest about age, and makes staleness legible rather than hidden. (Trade-off: dated URLs can suppress CTR on older items. Accepted — for an evidence desk, *pretending* an item is current is the worse failure.)
- **`/news`** — reverse-chronological index; **`/news/safety`**, **`/news/regulatory`**, **`/news/evidence`** — filtered indexes, each with a short evergreen intro so they are real pages, not thin archives.
- **Canonical is the item**; evergreen pages link to it, never duplicate its text.
- **Indexable** (not `noindex`) — these are the freshness and citation engine. But **items are never `/lp/*`** and never carry a sales CTA (Factory Rules).
- **RSS/JSON feed** at `/news/feed.xml` — cheap, and the exact surface journalists and AI crawlers consume.
- **No pagination-thin archives.** If a month has 1 item, there is no month archive.

---

## 8 · Content-JSON schema extension (fits the existing architecture, minimal code)

The current loader (`app/lib/content.ts`) globs `content/*.json`, skips `_`-prefixed files, and maps `__` → `/` in slugs; `app/[...slug]/page.tsx` is already a catch-all. **A news item is therefore just another content JSON** — `content/news__2026-07-15-ayurveda-hypertension-meta-analysis.json` with `slug: "/news/2026-07-15-ayurveda-hypertension-meta-analysis"` renders through the existing route with **zero loader changes**. That is the 20 → 3,400 architecture working as designed: news scales as *content*, not code.

Only the `/news` index pages and the item-header component are new.

Extend the `Page` type (all new fields optional, so the existing 20 pages are untouched):

```ts
export type NewsType = "STUDY" | "REGULATORY" | "SAFETY";
export type EvidenceGrade = "preliminary" | "limited" | "moderate" | "strong";

export type NewsMeta = {
  type: NewsType;
  publishedAt: string;          // ISO — "2026-07-15"
  reviewedAt: string;           // ISO — physician sign-off date (§5.2 step 5)
  // NB: reviewer NAME is NOT stored here — it renders from
  // app/lib/medical-review.ts (MEDICAL_REVIEW.current). See §13 Q3.
  sourceTier: "A" | "B";        // Tier C/D can never be an item's basis (§2)
  evidenceGrade?: EvidenceGrade;      // STUDY only (§3.1)
  studyMeta?: {                       // STUDY only
    design: string;                   // "systematic review with meta-analysis"
    participants?: number;            // 524
    trialsPooled?: number;            // 10
    comparator?: string;              // "placebo; standard antihypertensives"
    registrationId?: string;          // CTRI/NCT — absence is REPORTED (§6.5)
    funding?: string;                 // disclosed always (§6.6)
  };
  regulator?: string;                 // REGULATORY/SAFETY — "US FDA", "Ministry of AYUSH"
  jurisdiction?: string;              // "United States", "India", "EU"
  affectedProducts?: string[];        // SAFETY — named products only, primary-sourced
  doesNotShow: string;                // MANDATORY, non-empty (§3.1 item 5)
  evergreenRefs: string[];            // MANDATORY, ≥1 slug — enforced at build (§7.1)
  archivedSources?: { url: string; archived: string }[];  // §6.8
  disclosure?: string;                // §9.3 — set whenever a KAG entity is involved
};
```

`news?: NewsMeta` joins `Page`. **Two build-time asserts (blocking, in the factory spec suite):**

1. `slug.startsWith("/news/")` ⟹ `news` present, `news.doesNotShow` non-empty, `news.evergreenRefs.length >= 1`, and **every ref resolves to a real page** (no dangling links).
2. Every slug in `evergreenRefs` has a reciprocal "Latest evidence" block referencing this item (§7.2) — the backlink cannot be silently skipped.

These asserts are the design. A gate that can be forgotten is not a gate — and per CLAUDE.md (g), a failing gate is never fixed by weakening it.

---

## 9 · Schema, AEO/GEO, and disclosure

### 9.1 JSON-LD per item

- **`MedicalWebPage`** with **`reviewedBy`** (Person, from `MEDICAL_REVIEW.current`, with credentials) + **`lastReviewed`** — the field the niche brief flags as significantly strengthening YMYL E-E-A-T (§2.3 [S14]).
- **`NewsArticle`** (not `BlogPosting`) for `datePublished`/`dateModified`/`headline` — plus `ReportageNewsArticle` where it is straight reportage of a regulator action.
- **`citation`** → the primary source (DOI/PubMed/regulator URL). This is the field that makes the item machine-verifiable and is disproportionately why an AI engine will cite us.
- **`ClaimReview` — considered and rejected.** It is built for adjudicating claims true/false; our whole position is that these questions are *unsettled*. Forcing a rating would misrepresent the evidence. Rejecting it is the honest call, and it should be recorded as a decision, not left to be re-litigated.
- **`BreadcrumbList`**, **`Organization`** (publisher = Kairali Ayurvedic Group, disclosed) as standard.

### 9.2 AEO/GEO (Ship-Gate universal check, per DECISIONS)

Every item leads with an `answerCapsule` that directly answers the query an engine would ask — *"Does ayurveda lower blood pressure?"* → the honest two-sentence answer. The `doesNotShow` field is, in practice, our highest-value AEO surface: it is the thing an LLM cannot get from a press release, and it is what makes us the safest source to quote on a YMYL topic. Add each item to `llms.txt` (the route already exists).

### 9.3 Publisher disclosure — non-negotiable

The site is published by the Kairali Ayurvedic Group and **says so** (that is the brief's whole premise). For the news section specifically:

- A standing disclosure line renders on **every** news item, not just an `/about` page: who publishes this, that the group manufactures Ayurvedic products (KAPPL) and runs a hospital (KTAHV), and that items are reviewed by the group's registered physicians.
- **If an item concerns a Kairali/KAPPL product, a Kairali study, or a Kairali physician's research, the disclosure is inline, above the fold, in the item's own words** — not a footer.
- **We do not publish `SAFETY` items about competitors' products** unless a Tier-A regulator has already acted publicly and named the product. Reporting an FDA action is journalism; being the first to name a competitor's product as unsafe from a manufacturer-owned site is a lawsuit and a credibility fire. Report the regulator's action, cite the regulator, add nothing.

That third rule is the one most likely to be argued with internally and is the one most worth holding.

---

## 10 · Anti-patterns (the things that would kill this section)

1. **Publishing on a schedule instead of on merit.** A quota manufactures hype. Cadence is a ceiling, not a target (§5.1).
2. **Cheerleading by selection.** Reporting only favourable studies is a lie told with true statements. **Track it:** the published mix must be auditable, and a quarter with zero unflattering items is a review finding, not a success.
3. **Burying the caveat.** `doesNotShow` is mandatory and never empty (§8 assert).
4. **Orphan items.** No evergreen link = no publish (§7.1).
5. **Letting news outrank the pillar.** News is the engine; evergreen pages are the product.
6. **Stale feed.** Worse than no feed. If cadence cannot be met, sunset the section deliberately with a dated note — do not let it rot.
7. **Selling.** One product CTA on a news item destroys the entire premise (Factory Rules: this site never sells).
8. **Trusting a snippet.** §3.3's LiverTox B-vs-C error, shipped, is the end of the section's credibility.
9. **Cloning Examine's letter grades.** Theirs, and decontextualises (§3.1).
10. **Treating heavy metals as a PR problem.** It is a real, documented, ongoing harm to real people — including pregnant women [S8]. Our WHO-GMP manufacturing is a legitimate *answer* to a legitimate *question*, never a reason to soften the question.

---

## 11 · Ship Gate for the news section (proposed, additive to the standard gate)

| # | Check | Evidence |
|---|---|---|
| N-1 | Build-time asserts pass (§8) — `doesNotShow` non-empty, ≥1 resolving `evergreenRefs`, reciprocal backlink | Spec-suite output |
| N-2 | Every citation URL resolves 200 + archive URL stored | Link-check script output |
| N-3 | Claims lint zero findings (DMR/FSSAI + banned-words + "cure") | Lint output |
| N-4 | Physician sign-off recorded for every item | `reviewedAt` present; sign-off logged |
| N-5 | `MedicalWebPage.reviewedBy` + `NewsArticle` + `citation` validate | Rich Results Test |
| N-6 | Reviewer name appears **nowhere** in content JSON (config-only) | `grep -rL` across `content/news__*.json` |
| N-7 | AEO/GEO auditor PASS (universal Ship-Gate check per DECISIONS) | Auditor report |
| N-8 | No sales CTA on any news item | Automated scan |
| N-9 | design-qa PASS | Report |

---

## 12 · Verification status (honest ledger — CLAUDE.md (f))

**Verified by direct primary fetch:** WHO strategy 2025–2034 four objectives + 30 Oct 2025 date [S10]; WHO benchmarks practice, 11 Feb 2022 [S6]; NCCIH evidence/safety framing + Jan 2019 date [S1]; Saper JAMA 2008 full figures incl. rasa shastra 40.6% vs 17.1%, p=.007 [S4]; Cochrane schizophrenia 2007 (3 trials, 250 participants, chlorpromazine comparison) [S5]; *Frontiers in Pharmacology* 2025 hypertension meta-analysis full figures incl. I²>90% and "certainty of evidence is limited" [S7]; LiverTox ashwagandha **score B**, ~23 cases, 2–12wk latency, cholestatic/mixed, fatal cases described [S13]; WHO Global Summit Dec 2025 / TMGL 1.6M resources / TMGL GPT / STAG-TM / Delhi Declaration [S11]; TMGL Sep 2025 pre-launch detail incl. **Ayurveda evidence map still in development** [S12].

**`[snippet-only]` — search-derived, NOT verified by primary fetch (these hosts returned 403/404 to automated fetch and MUST be re-verified by a human or authenticated fetch before any of these facts appears on the live site):** FDA heavy-metal warning page details, "no FDA-approved ayurvedic products", the 10-supplements conclusion, Balguti Kesaria, Rheumacare, poison-centre number [S2]; Import Alert 99-42 title/scope/21 Apr 2025 revision [S3]; both CDC MMWR reports incl. the 2% / 1.2% lead figures and product names [S8, S9]; API structure + Amendment List-1 (2023) 21.12.2023 [S14]; D&C Act / Schedule T / Schedule M-I mandatory-compliance framing [S15]; APvPI three-tier / AIIA / 5 + 99 centres [S16]; DMR Act + Patanjali proceedings [S21]; Denmark/ANSES/Sweden/Finland ashwagandha actions [S19]; Examine research process and grading [S20]; Healthline review-date practice [S22]; CTRI mandatory-since-2009 + 3,632 AYUSH trials [S18]; TGA alert [S17].

**Not verified at all:** whether ayush.gov.in / pcimh.gov.in expose RSS or stable dated listing pages for automated monitoring (§13 Q2) — ayush.gov.in returned effectively no content to fetch.

**Unverified assumption flagged:** that physician review capacity for ~2–4 items/month exists. Nothing in this research establishes it (§13 Q1).

---

## 13 · Open questions → QUESTIONS.md (blocking design decisions)

- **Q1 (BLOCKING — go/no-go).** Does Dr. Deepu John (or the reviewing roster) commit to ~1 physician-hour/week for review, sustained? **If no, this section should not be built.** A stale evidence desk actively damages the credibility the whole site is built on. This is a genuine no, not a negotiating position.
- **Q2.** Do ayush.gov.in / pcimh.gov.in / suraksha.ayush.gov.in publish RSS or stable dated listings? If not, the AYUSH monitor is a manual weekly check (adds to Q1's cost) or a scraper (adds fragility + rule-r screening load).
- **Q3 (second-order, worth raising now).** `MEDICAL_REVIEW.current` renders the *current* reviewer's name on *historical* items — so a leadership change would silently re-attribute a 2026 review to a 2028 physician. That is factually wrong and, on YMYL content, corrosive. Options: (a) freeze `reviewedByName` into each item's JSON at publish (breaks the one-line-edit property and the §11/N-6 gate); (b) keep a dated roster in config and resolve name-at-review-date (preserves both properties; more code). **Recommend (b).** Flagging because the existing `medical-review.ts` comment shows this case was not considered, and news is where it first bites.
- **Q4.** Legal review of §9.3 rule 3 (never first to name a competitor's product) — confirm with counsel that reporting a regulator's public action is safe as scoped.
- **Q5.** Do we cover **Ayurveda-adjacent** stories (yoga trials, AYUSH policy, TM broadly) or Ayurveda strictly? Recommend strict, with a narrow WHO/AYUSH policy exception — scope creep is how an evidence desk becomes a blog.
- **Q6.** DE/FR locales: KTAHV ships EN/DE/FR. whatisayurveda's locale policy is not settled in this research. If DE/FR are in scope, the cadence in §5.1 triples in cost — likely forcing EN-only news with an explicit flag.

---

## 14 · Source index

| # | Source | URL | Fetch status |
|---|---|---|---|
| S1 | NCCIH, *Ayurvedic Medicine: In Depth* (last updated Jan 2019) | https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth | ✅ primary |
| S2 | FDA, *FDA warns about heavy metal poisoning associated with certain unapproved ayurvedic drug products* | https://www.fda.gov/drugs/fraudulent-products/fda-warns-about-heavy-metal-poisoning-associated-certain-unapproved-ayurvedic-drug-products | ⚠️ 404 to fetch — snippet-only |
| S3 | FDA Import Alert 99-42 (DWPE, heavy-metal contamination; rev. 21 Apr 2025) | https://www.accessdata.fda.gov/cms_ia/importalert_1167.html | ⚠️ 404 to fetch — snippet-only |
| S4 | Saper RB, Phillips RS, Sehgal A, et al. *Lead, Mercury, and Arsenic in US- and Indian-Manufactured Ayurvedic Medicines Sold via the Internet.* JAMA. 2008;300(8):915–923 | https://pmc.ncbi.nlm.nih.gov/articles/PMC2755247/ · https://pubmed.ncbi.nlm.nih.gov/18728265/ | ✅ primary |
| S5 | Agarwal V, Abhijnhan A, Raviraj P. *Ayurvedic medicine for schizophrenia.* Cochrane Database Syst Rev. 2007 | https://pubmed.ncbi.nlm.nih.gov/17943922/ | ✅ primary |
| S6 | WHO, *WHO benchmarks for the practice of Ayurveda* (11 Feb 2022) | https://www.who.int/publications/i/item/9789240042674 | ✅ primary |
| S6b | WHO, *WHO benchmarks for the training of Ayurveda* (2022) | https://www.who.int/publications/i/item/9789240042711 | ⚠️ snippet-only |
| S7 | *Effectiveness and safety of Ayurvedic intervention in essential hypertension: a systematic review with meta-analysis.* Front Pharmacol. 2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12757693/ | ✅ primary |
| S8 | CDC MMWR 61(33), 2012. *Lead Poisoning in Pregnant Women Who Used Ayurvedic Medications from India — New York City, 2011–2012* | https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6133a1.htm | ⚠️ 403 to fetch — snippet-only |
| S9 | CDC MMWR 64(32), 2015. *Notes from the Field: Lead Poisoning and Anemia Associated with Use of Ayurvedic Medications Purchased on the Internet — Wisconsin, 2015* | https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6432a6.htm | ⚠️ 403 to fetch — snippet-only |
| S10 | WHO, *Global traditional medicine strategy 2025–2034* (pub. 30 Oct 2025; agreed WHA78, 26 May 2025) | https://www.who.int/publications/i/item/9789240113176 | ✅ primary |
| S11 | WHO, *WHO Global Summit charts a bold future for traditional medicine* (22 Dec 2025) | https://www.who.int/news/item/22-12-2025-who-global-summit-charts-a-bold-future-for-traditional-medicine | ✅ primary |
| S12 | WHO, *Traditional Medicine Global Library to launch in 2025* (25 Sep 2025) | https://www.who.int/news/item/25-09-2025-traditional-medicine-global-library-to-launch-in-2025 | ✅ primary |
| S13 | LiverTox (NIDDK), *Ashwagandha* — likelihood score **B** | https://www.ncbi.nlm.nih.gov/books/NBK548536/ | ✅ primary |
| S14 | PCIM&H — Ayurvedic Pharmacopoeia of India; Amendment List-1 (2023), notified 21.12.2023 | https://pcimh.gov.in/ · https://ccras.nic.in/documents/amendment-list-1-2023-to-ayurvedic-pharmacopoeia-of-india-api-part-i-ii/ | ⚠️ snippet-only |
| S15 | Ministry of AYUSH — Drugs & Cosmetics Act 1940 / Rules 1945; Schedule T, Schedule M-I GMP | https://ayush.gov.in/resources/pdf/quality_standards/Drugs-and-Cosmetics-Act-Rules.pdf | ⚠️ snippet-only |
| S16 | Ayush Suraksha / APvPI — National Pharmacovigilance Centre (AIIA, New Delhi) | https://suraksha.ayush.gov.in/ · https://aiia.gov.in/pharmacovigilance/ | ⚠️ TLS/404 — snippet-only |
| S17 | TGA (Australia), *Imported Ayurvedic products found to contain dangerous heavy metals* | https://www.tga.gov.au/safety/safety-monitoring-and-information/safety-alerts/imported-ayurvedic-products-found-contain-dangerous-heavy-metals | ⚠️ timeout — snippet-only |
| S18 | CTRI — mandatory since 15 Jun 2009; AYUSH trials in scope; *Analysis of AYUSH studies registered in CTRI 2009–2020* | https://ctri.nic.in/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC8185998/ | ⚠️ snippet-only |
| S19 | Danish ashwagandha ban (Apr 2023) + critique; ANSES (France, 2024) | https://pmc.ncbi.nlm.nih.gov/articles/PMC11403136/ · https://www.mcgill.ca/oss/article/critical-thinking-health-and-nutrition/why-did-denmark-ban-ashwagandha | ⚠️ snippet-only |
| S20 | Examine.com — research process & editorial policy (model for process, not grades) | https://examine.com/about/research-process/ · https://examine.com/research-feed/ | ⚠️ 403 to fetch — snippet-only |
| S21 | DMR (Objectionable Advertisements) Act 1954; IMA v. Patanjali, SC directions | https://www.drishtiias.com/daily-updates/daily-news-analysis/supreme-court-warns-patanjali-ayurved-on-misleading-claims | ⚠️ snippet-only (secondary) |
| S22 | Healthline editorial process (medically-reviewed / fact-checked / updated-on dates) | https://www.healthline.com/about/process | ⚠️ snippet-only |
| S23 | Ministry of AYUSH, *National List of Essential Ayush Medicines* (NLEAM) | https://drugscontrol.org/news-detail.php?newsid=32223 | ⚠️ 403 to fetch — snippet-only |

**Internal:** `docs/group-inputs/whatisayurveda-niche-brief.md`; `docs/whatisayurveda-research/demand.md`; `sites/whatisayurveda.com/app/lib/medical-review.ts`; `sites/whatisayurveda.com/app/lib/content.ts`; `sites/whatisayurveda.com/content/_manifest.json`; CLAUDE.md (rules 6, 7, g, r; ESCALATION); DECISIONS.md (AEO+GEO universal Ship-Gate check).
