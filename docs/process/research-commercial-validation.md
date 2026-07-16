# Research → Commercial Validation (Stage `S4` — "WILL IT SELL?")

**Status:** Research deliverable — proposed doctrine, NOT yet ratified.
**Author:** research agent (commercial-validation stage of the pipeline-revision commission)
**Created:** 2026-07-15 20:41:07 IST
**Revised:** 2026-07-15 21:38:41 IST — **independent verification pass 2** by a second agent (§18.1). All load-bearing primaries re-fetched and text-verified. **Three defects found and corrected, one of them a fabricated attribution to Klein (`silently`) that had survived a GPT-5 audit** — see §3.4 and §18.1. **Last machine verdict on this file remains GPT-5 pass-1 FAIL; §18.1 is not a PASS.**
**Covers:** Abilash's steps **10** ("what makes the website succeed for them") and **11** ("WILL IT SELL?").
**Stage ID:** `S4` in the canonical spine (`docs/process/research-practitioner-sequencing.md` §5). Equivalent to `C8` in the Track-A content playbook. **Applies to all three tracks** (A organic / B Shopify / C landing pages) — the gate is shared, the *criteria* differ by archetype (§9).
**Ratification required from:** Abilash (the gate, the kill criteria, the archetype definitions). **Dr. Deepu John** — but only for §8.3, which is a finding about *his* capacity, not a process preference.

---

## 0. How to read this document

### Evidence quality key (house convention, same as sibling docs)
- **[P]** — primary source, fetched and read directly by this agent.
- **[S]** — secondary source, or primary read via search-engine summary (fetch blocked/403). Weaker.
- **[U]** — **UNVERIFIED**. Encountered but not confirmed from a source I trust. **Never cite to the Director as fact.**
- **[J]** — **JUDGEMENT**. My reasoning, not a sourced finding. Argue with it.

### Research limitations — read before trusting anything below

1. **Reddit is hard-blocked to this agent — now proven at the API level, not inferred.** The commission asked for r/SEO, r/bigseo, r/juststart, r/Entrepreneur, r/shopify, r/PPC practitioner discussion. Three independent failures, two passes:
   - `WebFetch` on `https://www.reddit.com/r/juststart/` → **"Claude Code is unable to fetch from www.reddit.com"** (reproduced in pass 2).
   - `WebSearch` on a targeted r/juststart query → **zero links**.
   - **Pass 2, the definitive one:** `WebSearch` with `allowed_domains:["reddit.com"]` → **`API Error: 400 — "The following domains are not accessible to our user agent: ['reddit.com']"`**, citing <https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler>. **This is a categorical block, not a flaky fetch.** No amount of retrying or rephrasing will produce Reddit evidence for this agent.

   **I did not paper over this by quoting blogs that claim to summarise Reddit.** I substituted named, first-party, attributable practitioner sources (Cooper, McGrath, Cagan, Klein, Kaushik, Binet & Field, Soulo, Allsopp, O'Toole). These are strictly *better* evidence than anonymous forum posts. **Genuine Reddit mining needs a human or a differently-configured fetcher** → `QUESTIONS.md`.

   > **⚠ The tooling demonstrated this document's thesis, live.** On the zero-link Reddit search, `WebSearch` returned **no sources** and then produced a fluent paragraph asserting that r/juststart *"frequently discusses"* niche validation, competition analysis and search-volume assessment, and that the community *"shares practical frameworks"*. **Every word of that was generated from zero retrieved links.** It is plausible, on-topic, unfalsifiable, and **evidence of nothing** — a summary of a search that returned nothing. An agent in a hurry would have cited it as "practitioner consensus (r/juststart)" and satisfied the commission's Reddit requirement with **pure confabulation**.
   > **This is the July failure mode reproduced in a different tool, in this very research session, while researching how to prevent it.** It is the strongest argument in this document for `MM-3` (every claim traces to a retrievable source): **fluency is not evidence, and the absence of links is invisible in the presence of good prose.** Rule, stated plainly: **a search summary with zero underlying links is not a source — it is the model talking to itself.**

2. **I excluded the SEO-agency "ROI benchmark" literature deliberately.** A search for content-site unit economics returned claims like *"content marketing delivers 748% ROI with 7–9 month breakeven"* **[U]** — unsourced, uncited, self-serving vendor filler of exactly the kind Abilash said he does not want. **None of it is load-bearing here.** §8 derives our economics from *our own* cost structure instead, which is knowable, rather than from someone else's marketing copy, which is not.

3. **One number I could not verify, and the failure is instructive.** See §6.3. I could not obtain an absolute position-1 CTR figure from Advanced Web Ranking's own tool page. The ~28–40% figure "everyone knows" is marked **[U]** throughout. That I *could not verify the single most widely-cited number in SEO forecasting* is not a gap in this research — **it is the central finding of §6.**

---

## 1. The headline answer

**Abilash is right that commercial validation must precede the build, and the evidence for that is stronger and older than SEO.** But the research produces three findings he did not ask for, and they change the shape of the stage:

1. **We cannot forecast our way to a GO decision using borrowed numbers** (§6). Search volume is *bucketed*, not measured — a reported "1,000" means roughly 880–1,300 [P]. There is **no such thing as "the CTR curve" to look up**: published figures describe specific cohorts wearing the same name, and the most-cited figure of all (~28–40% at position 1) is **untraceable to any primary source** [P/§6.3]. Chain four such terms together and the product's error is not merely large — it is **unbounded and undetectable**. A pipeline that demands a revenue forecast before build will get a *fabricated* one. That is how the DataForSEO failure happened, and a naive S4 would **repeat** it (§14).
   → **The stage is built on McGrath's reverse income statement ("what would have to be true?") rather than a forward projection from vendor data ("what will we get?").** This is **not** a licence to avoid numbers: where the terms are **ours** — our close rate, our capacity — banded arithmetic is *required* (§7, `MM-4`).

2. **Our binding constraint is not money or tokens — it is Dr. Deepu John's signature** (§8.3). CLAUDE.md hard gate 7 requires physician sign-off on clinical content. whatisayurveda is 3,400 pages. Nobody has multiplied those two numbers together. **On illustrative assumptions [J] the plan consumes between ~9 and ~38 working weeks of one chief physician's undivided time.** He runs a working NABH hospital. This is a capacity-feasibility wall that S4 exists to hit *before* the build, and it is invisible to every SEO metric we currently collect.

3. **S4 already exists — informally, undocumented, and too late.** Abilash has already made GO/HOLD/KILL calls by instinct: franchise **HELD** pending commercials (`DECISIONS.md:247`), equipment **not built** for lack of truthful product data (`DECISIONS.md:196`), kairalitea **gated** pending store facts (`DECISIONS.md:66`), and four domains **DROPPED** outright (`DECISIONS.md:8`). **We are not inventing a stage. We are naming a judgement Abilash already makes, giving it an artifact, and moving it earlier** — because all four of those calls landed *after* mining effort was spent (`DECISIONS.md:197` is the honest record of that cost).

> **The one-line doctrine:** *S4 does not ask "what will we get?" It asks "what would have to be true for this to be worth building, and do we believe it?"*

---

## 2. Where this stage sits

| | |
|---|---|
| **Entry condition** | `S3` (DEMAND) exit evidence exists and passed its provenance gate. **S4 cannot run on unvalidated demand data** — that inverts into fabrication (§14). |
| **Exit condition** | A committed **one-page business case** (§11) carrying a **GO / HOLD / KILL / RECYCLE** decision (§12). |
| **Owner** | Agent prepares. **Abilash decides.** Gate outputs are a Director call, never an agent call (§12.4). |
| **Rework prevented** | Building a site nobody needed; discovering a capacity or commercial wall after the design is locked; and — per `DECISIONS.md:197` — spending mining effort on three consecutive sites to discover they were blocked. |

---

## 3. What the named authorities actually say

### 3.1 Robert Cooper & Scott Edgett — *Stage-Gate and the Critical Success Factors for New Product Development* **[P]**
Source: <https://bptrends.info/wp-content/publicationfiles/07-06-ART-Stage-GateForProductDev-Cooper-Edgett1.pdf> (adapted from Cooper, *Winning at New Products*, 3rd ed., Perseus, 2001).

This is the single most relevant document found, because it describes **our exact failure mode by name**:

- **The base rate:** *"Only one out of four development projects succeed commercially, and one-third of all new-product launches fail."* Our prior should not be optimistic.
- **"Ready, fire, aim":** *"Too many new-product projects move from the idea stage right into development with little or no up-front homework. The results of this 'ready, fire, aim' approach are usually disastrous."* → This is the literal description of "we build because a site is on a list."
- **The artifact we are missing:** up-front homework *"lead[s] to the preparation of a full business case prior to beginning serious development work."* → §11.
- **Why projects don't get killed:** *"Many projects move too far into development without serious scrutiny. In fact, once a project begins, there is very little chance that it will ever be killed. The result is that many ill-conceived projects continue to move forward and scarce resources are allocated improperly."*
- **The motto:** *"Build tough Go/Kill decision points into your process — a funnel, not a tunnel."* Gates *"provide for the funnelling of projects, in which mediocre projects are culled out at each successive gate."*
- **Gate anatomy — adopt this verbatim (§12):** every gate has **Inputs** (deliverables, from a standard menu), **Criteria** (*"can include must-meet (mandatory) as well as should-meet (desirable) criteria"*), and **Outputs** (*"a decision (Go/Kill/Hold/Recycle); a prioritization level; resource commitments and action plan approved; and date and deliverables for next gate agreed on"*).
- **Incremental commitment:** *"Each stage costs more than the preceding one, so that the game plan is one of incremental commitment. As uncertainties decrease, expenditures are allowed to mount."*
- **The trap:** *"the technical solution in search of a market"* — an engineer *"building a monument to himself."*
- **Leverage as a criterion:** fit with existing strengths *"become checklist items in a scoring or rating model… If your leverage score is low, then there must be other compelling reasons to proceed."*

> **Direct hit:** Cooper's canonical output set is **Go / Kill / Hold / Recycle** — it *already contains* the legitimate HOLD outcome the commission asked for, plus a fourth (RECYCLE = send back for rework) we did not know we needed. We should adopt all four rather than invent our own vocabulary.

### 3.2 Rita McGrath & Ian MacMillan — *Discovery-Driven Planning*, HBR, 1995 **[S]**
Sources: <https://hbr.org/1995/07/discovery-driven-planning> · <https://en.wikipedia.org/wiki/Discovery-driven_planning> · <https://hbr.org/2017/02/a-refresher-on-discovery-driven-planning>
*(Caveat: the 1995 primary is paywalled; a mirrored PDF returned 403. Wikipedia's article carries a conflict-of-interest flag. Treated as **[S]**, and I have not quoted figures from it.)*

The framework built for exactly our epistemic situation: ventures where **assumptions vastly outnumber knowledge**. Five tools:

1. **Reverse income statement** — invert the arithmetic. Start from *required* profit, derive the revenue needed, then derive **allowable cost**. You do not forecast what you'll get; you state what would have to be true.
2. **Allowable costs** — cost becomes a *constraint deduced from the goal*, not an estimate summed upward.
3. **Pro forma operations specification** — what the operation must physically do to hit that.
4. **Key assumptions checklist** — every assumption documented *as an assumption*, ranked by how much rides on it.
5. **Milestone planning** — *"Postpone major commitments of resources until evidence from a previous milestone signals that taking the next step is justified."* Funding releases on milestone achievement.

**Why this matters more than anything else in the document:** §6 proves we cannot forecast. DDP is the named, published, credible method for deciding **without** a forecast. It converts "will it sell?" — unanswerable — into "what would have to be true for this to sell, which of those do we believe, and which can we test for £0 before building?" — answerable.

### 3.3 Marty Cagan (SVPG) — *The Four Big Risks*, 4 Dec 2017 **[P]**
Source: <https://www.svpg.com/four-big-risks/>

Cagan's exact definitions:
- **Value risk** — *"whether customers will buy it or users will choose to use it"*
- **Usability risk** — *"whether users can figure out how to use it"*
- **Feasibility risk** — *"whether our engineers can build what we need with the time, skills and technology we have"*
- **Business viability risk** — *"whether this solution also works for the various aspects of our business"*

Teams must *"tackle the big risks **early**"* — value and business risks especially — **before** delivery. **[S]** commentary notes the pathology: teams gravitate to the risk they know how to test (usability, because prototypes are tangible) while value and viability go unexamined.

> **[J] Our pipeline tests exactly the wrong risks.** Every gate we own today — build clean, compliance lint, brand lint, factory spec, design critic ≥9, Lighthouse — tests **feasibility and usability**. We have **zero** gates on **value** and **viability**. Cagan predicts this failure mode precisely, and our own record confirms it: kairaliequipment passed nothing because it never got built — it died on *viability* (no product data), which no lint could ever have caught. **S4 is the value+viability gate we do not have.**

### 3.4 Gary Klein — *Performing a Project Premortem*, HBR, September 2007 **[P]**
Source: <http://homepages.se.edu/cvonbergen/files/2013/01/Performing-a-Project-Premortem.pdf> · <https://www.gary-klein.com/premortem>

- **Evidence base (verified from the primary):** research by **Deborah J. Mitchell (Wharton), Jay Russo (Cornell), and Nancy Pennington (University of Colorado), 1989**, found that *"prospective hindsight — imagining that an event has already occurred — increases the ability to correctly identify reasons for future outcomes by 30%."*
- **The mechanism:** *"A premortem in a business setting comes at the beginning of a project rather than the end, so that the project can be improved rather than autopsied."* Unlike a critique session asking what *might* go wrong, the premortem *"operates on the assumption that the 'patient' has died, and so asks what **did** go wrong."*
- **The method — quotes are Klein's, labels in [brackets] are ours [P, text-verified]:** team is *"briefed on the plan"* → the leader *"starts the exercise by informing everyone that the project has failed spectacularly"* → *"those in the room **independently write down** every reason they can think of for the failure – especially the kinds of things they ordinarily wouldn't mention as potential problems, for fear of being impolitic"* → *"the leader asks each team member, starting with the project manager, to read one reason from his or her list; everyone states a different reason until all have been recorded"* [we label this **round-robin**; the word is not Klein's] → *"the project manager reviews the list, looking for ways to strengthen the plan."*

> **⚠ Correction (verification pass 2, 2026-07-15 21:38:41 IST) — a fabricated attribution, caught in the section that polices fabricated attribution.**
> An earlier draft of this line read *"each person **independently and silently** writes"* and §13 asserted *"Klein is explicit"* about writing **silently**. **He is not.** The full text of the primary was extracted with `pypdf` (3 pages, 7,653 chars) and searched: **`silently` = 0 hits; `silent` = 1 hit, in an unrelated sentence** — *"a team member who had been silent during the previous lengthy kickoff"*, which describes one person's behaviour in a **prior meeting**, not an instruction to the group. `round-robin` = **0 hits** (the mechanism is real and accurately paraphrased; the *label* is ours). Klein's actual words are *"independently write down"*.
> **Why this is worth the ink:** the addition was tiny, plausible, procedurally sensible, and **false** — and it was dressed in the phrase *"Klein is explicit"*, which converts an invention into an authority's instruction. That is the exact species of our own logged failure *"WRITING A POLICY THAT DESCRIBES A PROCESS THAT DOES NOT EXIST"*. It survived a GPT-5 audit pass, because **an LLM auditor reading a plausible paraphrase has no way to know the word is absent from a PDF it never opened.** Only fetching the primary and grepping it found this. **Finding: `MM-14`-class verification must include text-extraction of primary sources, not just a second model's opinion of the prose.** See §18.1.
> *(The recommendation to write independently **before** speaking is still sound and still Klein's — the anchoring-prevention rationale is ours, and is now labelled as ours in §13.)*
- **Why it works organisationally:** *"too many people are reluctant to speak up about their reservations during the all-important planning phase."*

> **[J] Note the "impolitic" clause — that is the load-bearing part for us.** An agent has no career risk and no reluctance to offend, which should make it a *good* premortem participant. But it has the mirror-image failure: it is trained to be agreeable to the Director. The DataForSEO incident was an agent reporting a confident number *upward* rather than flagging that shilljit=0 was obviously broken. **The premortem's job here is to license the agent to say the unwelcome thing** — and Abilash's standing pushback duty already demands exactly this. §13 makes it procedural rather than a matter of the agent's temperament.

### 3.5 Avinash Kaushik — *Digital Marketing & Measurement Model* **[P]**
Source: <https://www.kaushik.net/avinash/digital-marketing-and-measurement-model/>

Five steps, in order: **Business Objectives → Goals → KPIs → Targets → Segments.**
- **Business Objectives:** *"Why does your website/campaign exist?"*
- **Goals:** *"specific strategies you'll leverage to accomplish the business objectives"*
- **KPIs:** *"a metric that helps you understand how you are doing against your objectives"*
- **Targets:** *"numerical values you've pre-determined as indicators of success or failure"* — note **pre-determined**.
- **Segments:** *"a group of people, their sources, onsite behavior, and outcomes"*

**On timing — the part that matters:** *"Winners, well before they think data or tool, have a well structured Digital Marketing & Measurement Model."* The failure he names: *"The lack of structured thinking about what the real purpose of the campaign is and a lack of an objective set of measures with which to identify success or failure."*

> This is the published, named authority for Abilash's demand that success metrics be defined **before** building. Kaushik's **Targets** step — *pre-determined* numbers that define failure — is the specific thing we have never done for any site.

### 3.6 Les Binet & Peter Field — *The Long and the Short of It*, IPA, 2013 **[S]**
Sources: <https://ipa.co.uk/knowledge/effectiveness-research-analysis/les-binet-peter-field> · <https://www.alexmurrell.co.uk/summaries/les-binet-and-peter-field-the-long-and-the-short-of-it>

Based on ~1,000 IPA Databank case studies. Relevant findings: brand-building produces **slow, durable, compounding** effects; activation produces **sharp, short-lived** uplift. Measuring the former with the latter's metrics is a category error. Share of voice vs share of market predicts growth.

> **This is the authority for the non-revenue case (§9.3).** whatisayurveda is a brand-building asset. Binet & Field's evidence says: it will look like a failure on activation metrics *even if it is working perfectly*. If we judge it on 90-day conversions we will kill a compounding asset at its trough. **The measurement window must be set before the build, or the site will be killed by the wrong ruler.**

### 3.7 Amazon — *Working Backwards* / PR-FAQ **[S]**
Sources: <https://www.aboutamazon.com/news/workplace/an-insider-look-at-amazons-culture-and-processes> · Bryar & Carr, *Working Backwards* (2021) · <https://commoncog.com/putting-amazons-pr-faq-to-practice/>

Write the **press release and FAQ before any design or engineering work**. *"Instead of starting with a technology or a feature and hunting for a market, you start with the customer problem"* **[S]**. Forces the value proposition into plain language while it is still free to change.

> **[J] Adopted in spirit, not in form.** Our §11 one-pager *is* a PR-FAQ analogue: a short narrative artifact written before the build, in plain language, that a non-technical Director can read and reject. Abilash is non-technical — a document he can argue with is worth more than a dashboard he cannot. But we should **not** add a mock press release on top of the one-pager; that is ceremony for a 28-site factory. One artifact, not two.

---

## 4. Where the experts genuinely disagree — and who is right for us

**The conflict is real and direct.** McGrath & MacMillan explicitly critique stage-gate models as *"not well suited for the uncertainty of innovation-oriented projects"* **[S]**. Cooper's entire thesis is that tough gates *"strongly correlated to the profitability of new-product efforts"* are what separate winners **[P]**.

| | Cooper (Stage-Gate) | McGrath (Discovery-Driven) |
|---|---|---|
| **Core claim** | Discipline via formal Go/Kill gates and a business case | Discipline via documented assumptions tested at milestones |
| **Assumes** | You *can* build a credible business case up front | You *cannot* — assumptions outnumber knowledge |
| **Fails when** | Uncertainty is high → the business case becomes **fiction with decimal places** | Gates are absent → nothing ever gets killed |
| **Right about** | Organisational behaviour (projects never die on their own) | Epistemology (you do not know what you claim to know) |

### The resolution — take Cooper's *structure* and McGrath's *epistemology* **[J]**

They are answering different questions, and we have both problems at once:

- **We have Cooper's organisational problem.** `DECISIONS.md:197` is the evidence: three sites mined in a row before anyone said stop. Nothing kills a site on this list because it is *on the list*. → **Adopt Cooper's gate machinery**: Inputs / must-meet / should-meet / **Go-Kill-Hold-Recycle**, with named gatekeepers and incremental commitment.
- **We have McGrath's epistemic problem, and worse than she imagined.** §6 shows our borrowed inputs are bucketed and cohort-ambiguous. A Cooper business case built on those inputs is **exactly the artifact that produced the DataForSEO failure** — a confident number with a decimal point and no truth behind it. → **Fill Cooper's gate with McGrath's contents**: a reverse income statement and an assumptions checklist, **never a projection chained off vendor volumes**.

> **Verdict for Kairali: Cooper's gate, McGrath's business case.** The gate is where the discipline lives; the reverse income statement is what passes through it. Anyone who proposes putting a forecasted traffic number in the business case is proposing to repeat July's failure with a nicer template.

---

## 5. Difficulty realism — "can we actually win?"

Opportunity is worthless if we cannot rank. The honest evidence:

- **Glen Allsopp / Detailed (2024)** **[S]** — of 10,000 terms analysed where affiliates rank, **16 media companies appeared on page 1 of 8,421 (84%)**; in **3,999 of 10,000** they held **five or more of the top 10**. Dotdash Meredith appeared in 6,788; Hearst 5,144; Future 4,408; Condé Nast 3,734. Sources: <https://detailed.com/q3/> · <https://ppc.land/google-search-monopoly-16-media-companies-control-what-you-see/>
  - **Scope caveat, stated honestly [J]:** this dataset is **affiliate/product-review terms**, *not* health/YMYL. Citing it as "16 companies own Ayurveda SERPs" would be a scope error of the same family as the DataForSEO failure. Our actual competitors are WebMD/Healthline/Mayo/NIH-class YMYL publishers **[U — not measured by this agent]**. **The general lesson (consolidated SERPs, incumbents entrenched) transfers; the specific numbers do not.** → S4 must measure *our* SERPs, not borrow someone else's.
- **AI Overviews are eating the click before we compete for it** (§6.4). A #1 ranking is no longer a traffic guarantee.

**[J] The difficulty test for S4 is therefore not a tool's "Keyword Difficulty" score** — that is a link-based proxy, and no vendor's KD number knows whether an AI Overview sits above the fold. **It is a manual read of the live SERP for the cluster's head terms**, answering: *who holds the top 5, are they YMYL incumbents, does an AI Overview render, and what information gain do we have that they do not?* If the answer to the last question is nothing, the cluster is a KILL regardless of its volume.

---

## 6. ★ The measurement reality — why we must not forecast ★

**This section is the reason the stage is designed the way it is.** The commission asked me to research CTR-by-position curves and *"be honest about how unreliable these models are."* They are worse than unreliable. They are unusable for the arithmetic we want.

### 6.1 Search volume is not measured — it is bucketed

**Authoritas, Laurence O'Toole, 12 Nov 2024** **[P — re-verified pass 2]** — analysed *"60 million keywords, across multiple languages and countries from our keyword database"*: <https://www.authoritas.com/blog/understanding-googles-search-volume-buckets-a-deep-dive-into-how-search-volumes-really-work>

> *(Pass-2 correction: an earlier draft said "**over** 60 million keywords across **all** countries". The source says "60 million", not "over 60 million", and "multiple languages and countries", not "all countries" — a database sample, not a census. Both edits inflated the source's own claim. Small, but it is the same reflex that produced the July failure: **rounding a source upward in the direction that suits the argument.** The corrected figures are quoted verbatim above and every bucket number in this section was re-fetched and matched exactly.)*

- Google's API reports into **~60 discrete buckets**, from 0 to 7,480,000+.
- **Bucket width scales with volume.** At the 1,000 bucket: a **30% increase** (to 1,300) is needed to move up a bucket; an **18% decrease** (to 880) to move down. At 110,000: **23%**. At 1,830,000: **50%**.
- *"Keywords in the same broad range may have very different actual volumes."*

> **A reported "1,000" means "somewhere in roughly 880–1,300."** It is a bucket label, not a measurement.

### 6.2 The tool vendors say so themselves

**Tim Soulo (Ahrefs), *There's No Such Thing as "Accurate" Search Volume*, 18 Mar 2024** **[P]**: <https://ahrefs.com/blog/accurate-search-volume/>

- GKP numbers are *"rounded annual averages… assigned to 'volume buckets.' Keywords with similar meaning are often grouped together and their search volume summed up."*
- GSC impressions are polluted by **rank-tracker bots and scrapers** — which inflates impressions and therefore *deflates* measured CTR (remember this for §6.3).
- Volume is **historical**, but pages take *"anywhere from two months to a year"* to rank — you are forecasting a future market with a past number.
- A page ranks for **~1,000 related keywords**, not one — so per-keyword volume understates a page and summing keywords double-counts.
- **His recommendation:** treat volume as *"directionally accurate"* — for **comparing relative demand**, explicitly **not** for *"calculating exact traffic predictions."*

> When the vendor selling the number tells you not to multiply with it, and we multiplied with it anyway and reported the product to the Director as fact — that is the July failure in one sentence.

### 6.3 CTR-by-position: the number everyone cites cannot be traced

Requested: "credible CTR-by-position curves and their caveats." Here is what I actually found, and the *gap in provenance* is the point.

> **Correction applied after GPT-5 audit (pass 1, FAIL).** An earlier draft of this section headlined "two credible sources, ~8× apart." **The auditor was right to attack it and I withdrew it.** That framing used an **[U]** number (~28–40%) as one leg of a quantified headline claim — i.e. it manufactured a precise-sounding spread out of a figure I had just admitted I could not verify. That is the *exact* sin this document exists to prevent, committed inside the section warning against it. The honest claim is narrower and is stated below. **This correction is left visible on purpose: it is evidence the auditor gate does real work, and evidence of what the failure mode looks like when it is subtle.**

| Source | Position-1 CTR | Method / cohort |
|---|---|---|
| **Ahrefs**, Law & Guan, 4 Feb 2026 **[P]** | **0.039 (3.9%)** — no-AIO, Dec 2025 | *"aggregated Google Search Console data"*, `sum(clicks)/sum(impressions)`, **desktop only**, **150k informational-intent keywords** |
| **Advanced Web Ranking**, ongoing **[P — methodology only]** | **Could not retrieve an absolute value** | GSC data, *"thousands of sites and millions of keywords"*, weighted by SERP-feature combination, top 20, since Sept 2015 |
| "Everyone knows position 1 gets ~28–40%" | **[U] — UNTRACEABLE** | I could not trace this to any primary source I read. **Do not use it. Do not repeat it.** |

Sources: <https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/> · <https://www.advancedwebranking.com/free-seo-tools/google-organic-ctr>

**AWR's own caveats [P]:** their tool page states the data is a *"weighted CTR curve for each combination of the SERP features,"* not individual-site performance, and that CTR varies substantially by branded vs unbranded, industry, SERP features and season. Their Q3-2025 report **publishes only percentage-point *changes*, never absolute CTRs** — and states plainly: *"your specific performance may vary significantly. There's no one-size-fits-all benchmark."* (<https://www.advancedwebranking.com/blog/ctr-google-2025-q3>)

**The two defensible findings — and only these two:**

1. **The universally-cited comparator is untraceable.** I could not source the ~28–40% position-1 figure to any primary document, and AWR — the most-cited curve publisher — **declines to publish absolute values at all**, reporting only percentage-point *changes* and stating *"there's no one-size-fits-all benchmark"* **[P]**.
2. **Published CTR figures describe cohorts, not universals.** Ahrefs' 3.9% is desktop-only, informational-intent, `sum(clicks)/sum(impressions)` — depressed by the bot-inflated impressions Soulo documents (§6.2) and by impressions never scrolled into view **[P]**. AWR's is weighted by SERP-feature combination across branded-inclusive data **[P]**. **These are different measurements wearing the same name.** Neither is wrong; neither is portable to our SERPs.

> **The finding, stated at the width the evidence supports [J]:** *there is no such thing as "the CTR curve" to look up.* An agent that takes a CTR figure from a blog, applies it to a **bucketed** volume (§6.1) for a cohort it did not measure, produces a number whose error it **cannot characterise or bound**. Not "off by X" — *unknowably off*, in an undetermined direction. And this happens with clean data, correct arithmetic, and **zero hallucination**.
>
> **That is the lesson July should have taught and didn't: you do not need to hallucinate to produce a catastrophic number. You only need to multiply two honest numbers that were never meant to be multiplied.** The DataForSEO failure is usually told as a story about invented seeds. It is *also* a story about multiplication — and the invented seeds were the part we caught.

### 6.4 The ground is moving underneath the curves anyway

**Pew Research Center, 22 July 2025** **[P]** — the strongest evidence available, because it is real observed browsing behaviour, not vendor data: <https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/>

- **Method:** 900 US adults from KnowledgePanel Digital who shared browsing data; **68,879 unique Google searches** in **March 1–31 2025**, of which **12,593** produced AI summaries.
- Users clicked a traditional result in **8%** of searches with an AI summary vs **15%** without — **roughly half**.
- Clicks on links *inside* the AI summary: **1%**.
- Session ended entirely: **26%** with AI summary vs **16%** without.
- **18%** of all searches produced an AI summary — but **60%** of question-format searches did.
- **Pew's own caveat [P]:** *"The AI summary for any given search may change over time, and the results of this analysis reflect how search results appeared at the time they were collected."*

**Ahrefs, 4 Feb 2026 [P]** (300k keywords; 150k AIO / 150k informational non-AIO; GSC-aggregated; Dec 2023 vs Dec 2025):

| Condition | Dec 2023 | Dec 2025 | Change |
|---|---|---|---|
| No AI Overview | 0.076 | 0.039 | **−49%** |
| AI Overview | 0.073 | 0.016 | **−78%** |

**Ahrefs' acknowledged limitation [P]:** Dec-2025 "AIO keywords" did not trigger AIOs in Dec 2023, so they are *"comparing different keyword sets across time periods."* They do not address GSC completeness by feature type or selection bias in which queries trigger AIOs. Corroborating **[U]**: Seer Interactive (−49.4% to −65.2%), Kevin Indig (>50%), Authoritas (−47.5%).

> **The most alarming line in the table is the control row.** Position-1 CTR fell **49% even without AI Overviews**. **Both baselines collapsed.** Any curve calibrated before 2024 — which is most of them — is describing a SERP that no longer exists.
>
> **[J] Direct consequence for whatisayurveda:** Pew shows AI summaries appear on **60% of question-format searches**. An Ayurveda encyclopedia is *made of* question-format searches ("what is ashwagandha", "what is a dosha"). **This site's entire query surface is the exact surface where AI Overviews are densest and clicks are scarcest.** That is not an argument against building it — but it *is* decisive proof that judging it by clicks would be judging it by a metric its own market is deleting. It reinforces §9.3 and the standing AEO/GEO-first ruling: **being the cited source is the goal; the click is not coming back.**

### 6.5 Error propagation — the arithmetic nobody does

The standard opportunity model is `volume × CTR × conversion rate × value`. Compounding the *documented, sourced* uncertainties above **[J]**:

| Term | Honest uncertainty | Source |
|---|---|---|
| Volume | bucketed; ±~20–30% at the bucket edge *before* any seed/locale error | Authoritas [P] |
| CTR | no portable curve exists; published figures are cohort-specific; −49% to −78% trend | §6.3, Ahrefs [P] |
| Conversion | unmeasured for an unbuilt site | — |
| Value | often unknown pre-commercials (franchise!) | `DECISIONS.md:247` |

> **Multiply four numbers like that and you get a range spanning more than an order of magnitude — wider than the GO/KILL decision it exists to inform.** A model whose output range exceeds its decision threshold **contains no information**. Reporting its midpoint as a forecast is not analysis; **it is laundering uncertainty into false confidence** — and it is *exactly* what we did in July, when four invented seeds and a locale bug were summed into a cluster total and reported upward as fact.
>
> **This is why `MM-4` (§12.1) bans *this specific chain* — not numeracy.** Not because forecasting is hard, but because *our pipeline has already proven it converts uncertainty into confident fiction*, and a stage that demands a number will always be given one. Where the terms are **ours and banded** (our close rate, our response capacity), the arithmetic is sound and **required** — the corruption lives in the *borrowed* terms, so that is exactly where the ban falls.

---

## 7. The model we use instead: the reverse income statement

Per McGrath & MacMillan **[S]**, inverted for a website. **Do not ask "how much traffic will we get?" Ask "what would have to be true?"**

> **Scope correction after GPT-5 audit (pass 1).** An earlier draft banned *all* forward numerics. **The auditor called that a numbers-avoidance loophole and it was right** — for E and L sites we hold **real observed conversion and close rates**, and refusing to use them would be hiding behind epistemology to dodge accountability. **The ban is now narrow and precise**, and falls where the evidence actually falls: **on tool-volume-derived point estimates, not on numeracy.** Nothing here excuses anyone from committing to a number they can be held to.

**BANNED (`MM-4`) — point estimates derived from tool volumes:**
> "Cluster has 301K volume × 3.9% CTR × 2% conversion × ₹X = **₹Y/month**." ← fiction with decimal places. Every term is a borrowed cohort or a bucket label (§6); the product's error is unbounded and undetectable.

**REQUIRED where we have observed data — bounded scenario bands, labelled:**
> "At our **observed** KTAHV enquiry→admission rate of **R%** (source: our CRM, date), **100 enquiries/month → N admissions**. Low/base/high: __/__/__. **Assumption: enquiry quality matches current channels — weakest link, tested by [cheapest test].**"

**The distinction that makes this enforceable [J]:** a number is admissible if its **provenance is ours and its uncertainty is stated as a band**. It is inadmissible if it **launders a vendor's bucket or a borrowed cohort into a single figure**. *Use your own numbers, state your bands, name your assumptions. Do not multiply strangers' numbers and present the product as a fact.*

**Reverse (REQUIRED):**
> "For this site to be worth ₹C of build cost + ₹M/yr of maintenance, it must produce **N qualified enquiries/month**. At our *observed* enquiry→patient rate (from KTAHV's real data, not a benchmark), that needs **T sessions/month** on the money pages. Given the SERP in §5 and the CTR collapse in §6.4, **that requires ranking top-3 for [named terms] AND being AIO-cited.** → **Is that credible? What would have to be true? Which assumption is weakest? Can we test it for free before building?**"

**Why this is strictly better [J]:**
1. It **cannot be faked by bad volume data** — the required number is derived from *our* costs, which we know, not from a vendor's bucket.
2. It **surfaces the assumption**, which is the thing to argue about, instead of burying it in a product.
3. It **fails loudly**: when the required top-3 is implausible, that is visible to a non-technical Director in one sentence. A forecast fails silently.
4. It **has a defined test**: assumptions checklist → cheapest test first → milestone before further spend.

**Allowable cost:** the reverse statement yields a **cost ceiling**. If projected build+maintenance exceeds it, the response is *reduce scope* or **KILL** — never "revise the forecast upward."

### 7.1 Zero-build tests — the cheapest test first
*(Added on GPT-5's recommendation, pass 1. Without this, §7's assumptions checklist is a list of worries rather than a plan — the auditor was right that "name the cheapest test" is meaningless unless the menu of tests is concrete.)*

McGrath's milestone discipline **[S]** demands the assumption be **tested before the resource is committed**. Concrete tests we can actually run **[J]**, cheapest first:

| Assumption at risk | Zero/low-build test | Evidence produced |
|---|---|---|
| **Can we rank/be cited at all?** | **Pilot cluster**: 3–5 exemplar pages, fully physician-reviewed, shipped and left for one indexing cycle. Cooper's incremental commitment, exactly. | real GSC impressions + AIO citation checks — **our** cohort, not a borrowed curve |
| **Will AI engines cite us?** | **AIO/LLM citation smoke test**: ask the live engines the cluster's head questions today; record who is cited. | baseline citation share, pre-build |
| **Is the enquiry real, and can we answer it?** | **Pre-LP + small PPC spend** to the *existing* enquiry path. Tests offer, enquiry quality **and response capacity** (§9.2) without building a site. | real enquiries, real close rate — feeds `MM-4`'s "our data" requirement |
| **Does the offer land?** | **The commercials on one page**, shown to a real prospect. (Franchise: this is precisely what "HELD pending commercials" is waiting for.) | a human reaction |
| **Physician capacity (§8.3)** | **Time 10 real pages** end-to-end with Dr. Deepu John. | the missing number in §8.3, in one afternoon |

> **[J] Note what the pilot-cluster test does that no amount of research can:** it replaces every borrowed number in §6 with **our own measured cohort**. After one pilot we stop arguing about whose CTR curve to use and start reading our own. **That is the cheapest route out of the epistemic hole in §6** — and it costs 3–5 pages, not 3,400.
>
> **The last row is the highest-value test in the table.** One afternoon of timing 10 pages resolves the constraint that may invalidate the entire 3,400-page plan. **It should happen before anything else in this document is ratified.**

---

## 8. Unit economics — our real cost structure

**Ignore the agency benchmarks (§0.2).** Our costs are not freelancer invoices. They are:

### 8.1 Marginal cost per page (agent era)
Token cost per page is **real but small and knowable**. The dangerous conclusion — *"pages are nearly free, so build 3,400"* — is precisely the scaled-content-abuse trap flagged at `S4` in the sequencing doc, and it is wrong for reasons that have nothing to do with tokens. **[J]** Cheap generation raises volume against a *fixed* review capacity (§8.3) and a *fixed* domain-quality budget. **The marginal cost of a page is not its token cost; it is the review capacity it consumes and the domain-level risk it adds.**

### 8.2 Maintenance is the real liability, not the build
Health content decays; the Track-A playbook already notes Mayo re-reviews fast-moving topics at least every two years **[S]**. **[J]** 3,400 pages on a 2-year re-review cycle = **~1,700 page-reviews/year, forever**. A cost model that counts only the build is understating the commitment by an unbounded factor. **Maintenance must be in the reverse income statement or the business case is a lie by omission.**

### 8.3 ★ THE BINDING CONSTRAINT: physician sign-off capacity ★

**This is the most important operational finding in the document, and no SEO metric can see it.**

- **CLAUDE.md hard gate 7:** *"Medical/clinical content changes require Dr. Deepu John's sign-off before staging→production."*
- **`DECISIONS.md:258`:** review is institutional, but *"a specific named, credentialed physician is still shown per page for Google E-E-A-T."*
- **whatisayurveda: ~3,400 pages** (`QUESTIONS.md:190`, `LEARNINGS.md:85`).

**Illustrative arithmetic [J] — these are ASSUMED inputs, not facts. Per CLAUDE.md rule 6, the real per-page review time must come from Dr. Deepu John. I am not inventing it; I am showing why the question must be asked.**

| Assumed review time/page | Total physician-hours | Working weeks @ 6 productive h/day, 5 d/wk |
|---|---|---|
| 5 min | 283.3 h | **9.4 weeks** |
| 10 min | 566.7 h | **18.9 weeks** |
| 20 min | 1,133.3 h | **37.8 weeks** |

*(Arithmetic machine-verified, not mental: `3400 × mins ÷ 60` hours, `÷ 6 ÷ 5` weeks. Re-review load in §8.2 = `3400 ÷ 2 = 1,700/yr` — also machine-verified.)*

> **Even the most optimistic assumption consumes roughly a quarter of a year of one chief physician's undivided working time — and he runs a working NABH-accredited hospital.** The pessimistic end is most of a year. **Then §8.2 adds ~1,700 re-reviews/year in perpetuity.**
>
> **The 3,400-page plan is very likely capacity-infeasible under the current sign-off rule.** Not commercially unattractive — *physically unbuildable* as specified. This is Cagan's **feasibility + viability risk**, invisible to every gate we own, and it would have surfaced only when Dr. Deepu John's queue hit four figures — i.e. after the architecture was locked and the pages generated.

**This does not kill the site.** It forces a **RECYCLE** (§12.3) — the plan returns for rework with real options:
- **(a) Tiered review** — full sign-off only for YMYL-critical claim pages; a lighter attestation for definitional/non-claim pages. **Needs Dr. Deepu John's ruling on where the clinical line falls.**
- **(b) Expand the reviewer roster** — standing memory: *reviewers are config/roster, not hard-coded; the head can change*, and `DECISIONS.md:258` already frames review institutionally. **This is live and probably the real answer.**
- **(c) Cut the page count** — 3,400 was never validated as a *requirement*; it is an aspiration ("WebMD of Ayurveda") that acquired a number.
- **(d) Phase it** — Cooper's incremental commitment: pilot cluster, milestone, then scale.

→ **`QUESTIONS.md`: what is the real per-page clinical review time, and where is the clinical line?** One number from Dr. Deepu John turns this from speculation into a plan. **Until it exists, any 3,400-page schedule is fiction** — and that is an S4 finding, delivered before the build, which is exactly what the stage is for.

---

## 9. Archetypes — "will it sell?" is the wrong question for two of our three site types

The commission is right that "will it sell?" must be asked. **[J] But asked literally of every site it produces nonsense**, and worse — it invites bolting commerce onto reference content, which is the documented HCU death pattern (Track-A playbook §1.1). **The question must be archetype-specific. Every site declares its archetype at `S1` and is validated against that archetype's criteria only.**

### 9.1 Archetype **E — E-COMMERCE** (Track B: Shopify)
- **Question:** *Will it sell?* — literally. Revenue is the metric.
- **Validate:** real catalog exists (`DECISIONS.md:196` — equipment had **5 categories, 0 SKUs**); price/stock truthful (`DECISIONS.md:66` — the ₹20 suspect price; "Yuvan tea" not found on either store); margin ≥ allowable cost; **PDP URL impact flagged to Vikash** (doctrine (m)).
- **Reverse statement:** units/month × margin ≥ build + maintenance.
- **Hard rule:** **no catalog, no build.** Equipment is the precedent and it was called correctly.

### 9.2 Archetype **L — LEAD-GEN** (kairalicenters, franchise, KTAHV enquiry)
- **Question:** *Will it produce qualified enquiries that the business can actually convert?* Revenue happens offline — **the site cannot be judged on it.**
- **Validate:** is there a human who answers? (Priya's WhatsApp is a *real* verified capacity constraint.) Is the enquiry→customer rate known **from our own data**, not a benchmark? **Are the commercials decided?** — franchise proves this is decisive: you cannot validate an offer whose price does not exist (`DECISIONS.md:247`).
- **Reverse statement:** required enquiries/month = cost ÷ (our observed close rate × value).
- **[J] Lead-gen's real failure mode is not traffic — it is unanswered enquiries.** A site that generates leads nobody calls back has negative value: it burns the brand. **Validate the response capacity before the traffic.**

### 9.3 Archetype **N — NON-REVENUE / BRAND-AUTHORITY** (whatisayurveda, kairali.com)
**"Will it sell?" → "What is it FOR, and how will we know it worked?"**

This is where Kaushik and Binet & Field carry the weight. Per Kaushik: **Business Objective → Goals → KPIs → Targets**, *pre-determined* **[P]**. Per Binet & Field: brand effects are slow, durable, compounding — activation metrics will mis-read them **[S]**.

**[J] Every non-revenue cluster must declare a defensible role, and "educational" is not a role — it is a genre.** Legitimate roles:
- **Citation/authority asset** — be the source AI engines and journalists cite (AEO/GEO-first; §6.4 says this is the *only* durable read of this surface).
- **Demand creation** — grow branded search for KTAHV/KAPPL. **Branded search volume is our single best leading indicator**: it is measurable, attributable, hard to fake, and directly downstream of the asset's job.
- **Trust/objection handling** — the page a patient reads before enquiring. Measured by *assisted* conversion, never last-click.
- **Defensive** — own the SERP for terms where a competitor or bad information currently ranks.

**The kill test for N [J]:** *if this cluster never existed, what would we lose?* If the answer is "nothing measurable," it is a KILL — no matter how much volume it has. **Volume is not a reason to build. A role is.**

**Mandatory for N — set the measurement window BEFORE the build.** Per Binet & Field, a brand asset judged at 90 days looks like failure even when working. **Pre-commit the review date and the target at S4** (Kaushik's "Targets"), or the site will be killed at its trough by the wrong ruler. **This is a decision Abilash must make once, in writing, per N-site.**

---

## 10. Success metrics: leading vs lagging

Kaushik's Targets step, made concrete. **Defined at S4, before the build — never retrofitted.**

| | Lagging (the truth, too late to steer by) | Leading (steerable, but proxies) |
|---|---|---|
| **E** | revenue, margin, repeat rate | add-to-cart rate, PDP→cart, stock truth |
| **L** | patients admitted, franchises signed | qualified enquiries, **response time**, enquiry quality |
| **N** | branded search volume, citation share, assisted conversions | **AIO/LLM citation rate**, pages physician-approved, referring domains earned, returning readers |

**Rules [J]:**
1. **Every site declares ≥1 lagging and ≥2 leading metrics at S4**, with **pre-determined targets** and a **review date**.
2. **A leading metric with no lagging metric behind it is vanity.** Traffic is not a success metric for any archetype here — it is an input to one.
3. **Name the number that would mean failure.** Kaushik: targets are *"indicators of success **or failure**."* An unfalsifiable target is decoration. **If no number could disappoint us, we are not measuring — we are decorating.**
4. **N-sites: the review date is a commitment**, per §9.3.

---

## 11. The artifact — one-page business case (`launches/<domain>/business-case.md`)

Cooper's *"full business case prior to beginning serious development work"* **[P]**, filled with McGrath's contents. **One page. If it needs two, the thinking isn't done.**

```markdown
# Business Case — <domain>
As of commit <hash> · <YYYY-MM-DD HH:MM:SS IST> · Stage S4 · Decision: GO | HOLD | KILL | RECYCLE

## 1. Archetype        E (e-commerce) | L (lead-gen) | N (non-revenue/brand)   ← sets the criteria
## 2. What is it FOR   One sentence. If archetype N, the ROLE (§9.3), not "educational".
## 3. Audience         From S2. Verbatim language, not personas invented here.
## 4. Demand           From S3 ONLY. Every row: source + retrieval date + locale.
                       Bucketed → state as RANGES, never point values. NO cluster sums. [§6.1]
## 5. Difficulty       Manual SERP read of head terms: who holds top-5? YMYL incumbents?
                       AI Overview present? Our information gain vs them? [§5]
## 6. Offer            E: catalog+price+margin · L: the commercials + who answers
                       N: the role + why we can hold it
## 7. Reverse income statement          ← required outcome, not a vendor projection [§7]
   Cost ceiling: build ₹__ + maintenance ₹__/yr (incl. re-review [§8.2])
   Therefore requires: __ enquiries|units|citations per month
   Which requires: __ (ranking / capacity / spend)
   Any forward numeric here: OUR source + date, low/base/high band, assumption named [MM-4]
   Credible? YES/NO + why
## 8. Key assumptions checklist                    ← the heart of the document
   | # | Assumption | Confidence | If wrong, impact | Cheapest test | Tested? |
   Ranked by how much rides on it. The weakest load-bearing one is the milestone.
## 9. Capacity         Physician review [§8.3] · enquiry response [§9.2] · translation (EN/DE/FR)
                       Name the human. Confirm they have the hours.
## 10. Success metrics ≥1 lagging + ≥2 leading, pre-determined targets, REVIEW DATE [§10]
                       "We will call this a failure if ___ by ___."
## 11. Premortem       Top 5 reasons it failed, written in past tense [§13]
## 12. Decision        GO | HOLD (blocked on: __, owner: __) | KILL (reason) | RECYCLE (rework: __)
                       Decided by: Abilash · Date: __
```

**[J] Why one page:** Abilash is non-technical and time-poor. Cooper's gates fail when they become paperwork rituals; a 20-page case gets rubber-stamped, which is worse than no gate because it *manufactures the appearance of scrutiny*. One page can actually be read, argued with, and rejected.

---

## 12. The gate — `G4` / `S4-EXIT`

Cooper's structure **[P]**, our criteria.

### 12.1 Must-meet criteria (any single NO ⇒ cannot GO)

| ID | Criterion | Machine evidence |
|---|---|---|
| **MM-1** | `business-case.md` exists at `launches/<domain>/`, all 12 fields non-empty | file exists; no `TODO`/empty headers (grep) |
| **MM-2** | Archetype declared; validated against **that** archetype's criteria (§9) | field 1 ∈ {E,L,N} |
| **MM-3** | **Every demand number traces to S3 evidence** with source + date + locale | each row in field 4 resolves to the S3 keyword file |
| **MM-4** | **No point-estimate forecast derived from tool volumes.** Forward numerics are **allowed and encouraged** *only* when (a) anchored to **our own observed rates** (named source + date), (b) expressed as a **low/base/high band**, and (c) carrying the assumption they rest on. **Banned:** `volume × CTR × CR × value = ₹Y`. | grep for `volume ×`/`CTR ×`-shaped chains → zero; every numeric in field 7 has a source + a band [§6.3, §7] |
| **MM-5** | Demand stated as **ranges**; **no cluster sums** of bucketed volumes | grep for summed totals → zero [§6.1] |
| **MM-6** | Reverse income statement present; **cost ceiling includes maintenance** | field 7 non-empty, maintenance ≠ 0 [§8.2] |
| **MM-7** | Assumptions checklist ≥5 rows, each with a **named cheapest test** | field 8 |
| **MM-8** | **Capacity confirmed by a named human** for every gating role | field 9 — physician [§8.3], responder [§9.2] |
| **MM-9** | Success metrics: ≥1 lagging + ≥2 leading, **targets pre-set**, review date fixed | field 10 |
| **MM-10** | Premortem run; top-5 failure reasons recorded | field 11 [§13] |
| **MM-11** | **E only:** real catalog with SKUs, truthful price+stock | `DECISIONS.md:196` precedent |
| **MM-12** | **L only:** commercials decided AND a named human answers enquiries | `DECISIONS.md:247` precedent |
| **MM-13** | **N only:** cluster role declared (not "educational"); kill test answered | §9.3 |
| **MM-14** | Second-source cross-check (Perplexity fact-grounding) on every number reaching Abilash **AND primary-source text verification of every `[P]` quotation and attributed procedure** — fetch/extract the source and **string-match the quoted words**. PDF primaries must be **text-extracted**, never fetched-and-summarised. **A second model's agreement is not verification of a quote.** [§18.1] | audit output committed; each `[P]` quote names a retrievable artifact; extraction log |
| **MM-15** | **GPT-5 audit PASS** (`scripts/audit-gpt.mjs`, exit 0) on the business case | CI exit code |

### 12.2 Should-meet criteria (scored; prioritise, don't block)
Strategic fit with the group · **leverage** (Cooper: existing strengths — NABH, WHO-GMP, 8 verified centres, real physicians; *"if your leverage score is low, then there must be other compelling reasons to proceed"* **[P]**) · information gain vs incumbents · AEO/GEO defensibility (§6.4) · locale reach (EN/DE/FR) · reuse of existing packages · **absence of a legal claim surface** (Drugs and Magic Remedies Act, 1954 — a criminal statute).

### 12.3 Outputs — adopt Cooper's four verbatim **[P]**

| Output | Meaning | Our precedent |
|---|---|---|
| **GO** | Proceed to S5. Resources committed; next gate + deliverables agreed. | kairali.com |
| **KILL** | Stop. Not "later" — **stop**, with the reason recorded. | `DECISIONS.md:8` — balanceglow, mobistorr, tourdenight, trueinstantloan **DROPPED** |
| **HOLD** | Sound idea, **blocked on an external input**. Named blocker + named owner. Work **banked**, not lost. | `DECISIONS.md:247` — franchise HELD pending commercials; `:66` — kairalitea gated pending store facts |
| **RECYCLE** | Idea survives, **plan doesn't**. Return for rework, re-enter the gate. | **§8.3 — the 3,400-page plan against physician capacity** |

> **HOLD is legitimate and must not become a graveyard [J].** Cooper's warning — *"once a project begins, there is very little chance that it will ever be killed"* — applies doubly to HOLD, which is where projects go to avoid being killed. **Every HOLD carries a named blocker, a named owner, and a review date. A HOLD with no owner is a KILL that nobody had the nerve to make.** Franchise (`:247`) is a *correct* HOLD: blocker named (commercials), owner named (Abilash), work banked. Follow that shape exactly.

### 12.4 Gatekeeper
Cooper: gates are staffed by *"senior managers… who own the resources"* **[P]**. **Here: Abilash.** The agent prepares the case, runs the premortem, and **states a recommendation** — per the pushback duty, including *"I recommend KILL."* **The agent never decides.** For clinical capacity (§8.3), **Dr. Deepu John** is a co-gatekeeper — his hours are the resource being committed.

---

## 13. Killing and deferring — the premortem, procedurally

**Run before the decision, never after.** Klein's method, adapted **[P]**:

1. **Assume total failure.** "It is <review date + 12 months>. This site failed badly."
2. **Write independently first, read out after.** Klein's words: participants *"independently write down every reason they can think of"*, and only then does the leader ask each member *"to read one reason from his or her list"* **[P, text-verified]**. **The anti-anchoring rationale is ours [J], not Klein's** — he gives the ordering, not that justification. *(Earlier drafts said "and silently — Klein is explicit". The word `silently` does not occur in the primary; see §3.4's correction box.)* When the participants include GPT-5 and Perplexity as auditors, the ordering matters for the same reason: **collect verdicts independently, then compare** (the practice already followed with `scripts/audit-gpt.mjs`).
3. **Say the impolitic thing.** Klein's whole point. Ours: *"the Director wanted this site"* is a legitimate premortem entry. So is *"we built it because it was on a list."*
4. **Round-robin, one reason each, until exhausted.**
5. **Top 5 → business case field 11.** Any reason that is *already true today* is not a risk — **it is a KILL or HOLD finding**, and must be escalated, not filed.

**Standing kill criteria [J] — these are ready-made premortem answers, each drawn from a real case:**
- **No offer** — the thing being sold does not exist yet (franchise commercials, `:247`) → **HOLD**.
- **No data** — cannot build truthfully (equipment: 5 categories, 0 SKUs, `:196`; CLAUDE.md rule 6) → **HOLD/KILL**.
- **No capacity** — a named human cannot supply the hours (§8.3) → **RECYCLE**.
- **No role** — an N-cluster whose absence costs nothing (§9.3) → **KILL**.
- **No gain** — nothing the top-5 incumbents don't already say better (§5) → **KILL**.
- **No answer** — lead-gen with nobody to respond (§9.2) → **HOLD**.

**Escalation of commitment is the enemy.** Cooper **[P]**: *"once a project begins, there is very little chance that it will ever be killed."* → **The S4 decision must be made before mining/design effort accumulates, because sunk cost is what kills gates.** `DECISIONS.md:197` records this happening to us in real time — three sites mined before someone said stop. **That paragraph is the strongest argument in this repo for S4's existence, and it was written by an agent that had already paid the cost.**

---

## 14. ★ Does this catch the DataForSEO failure? ★

The commission requires every stage to be tested against the real July failure. **Honest answer: S4 alone does NOT catch it — and pretending otherwise would be the same sin.**

**The seed/locale/zero errors are caught at `S3`/`G4`** (provenance, zero-challenge, no-sums, second-source) — that is where they belong, and the sequencing doc already places them there. **S4's job is different and complementary: S4 catches what S3 misses, and prevents S4 from becoming a new venue for the same failure.**

| July's error | Caught here? | By what |
|---|---|---|
| Invented compound seeds | **No** — S3/G4 | S4 depends on S3; it inherits, never re-derives |
| Zeros summed into totals | **Partly** | **MM-5** bans cluster sums of bucketed volumes outright [§6.1] |
| English-only India | **No** — S3/G4 | — |
| **Reported to Director as fact** | **YES** | **MM-3** (every number traces), **MM-14** (second-source), **MM-15** (GPT-5 PASS) |
| **Volume → strategy without a viability question** | **YES** | The whole stage. 2.57M/mo would have hit **MM-4** (no vendor-chained point estimate), **MM-8** (physician capacity, §8.3), **MM-13** (declare a role) — and **§8.3 would have stopped the 3,400-page plan on capacity before a single page existed.** |

> **The deeper protection is negative, and it is the point of §6.** A naive S4 — "prove the ROI before we build" — would have *demanded* exactly the fabricated number that caused the failure. **A gate that demands a forecast will always be given one.** `MM-4` bans the vendor-chained point estimate *specifically so that S4 cannot become the place where the next fabrication is laundered into a decision.* **This stage is designed against its own most likely failure mode.**

### 14.1 The honest limit of this claim

**GPT-5 (pass 1) called the "would have caught it" table above unproven, and it is right.** Stated plainly for the Director:

- **Nothing in this document has stopped anything yet.** MM-1…MM-15 are **words in a .md file** — which is, by Abilash's own standard, **zero evidence**. They become real when `scripts/business-case-lint.mjs` (§15.8) runs in CI and **blocks a build**, and not one second earlier.
- **The gate has never been exercised on a live candidate.** No `launches/<domain>/business-case.md` exists. The §8.3 physician-capacity RECYCLE is a *predicted* outcome, not a demonstrated one.
- **This file is scoped to `docs/process/` and cannot ship its own enforcement.** That is a scope boundary, not an alibi: **the stage is not real until someone writes the lint and fills one business case.** Those are the two blocking prerequisites to ratification (§16.0) — **not follow-ups**.

> **The one sentence a reader should take from §14:** *this document argues the gate would have caught July; it does not prove it. Believe it only after the lint fails a real case.*

---

## 15. Recommended changes to the repo (for ratification — NOT yet applied)

Per the commission, S4 must be fixed **everywhere**, all three tracks:

1. **`CLAUDE.md`** — add S4 to the Build Decision Matrix: *no site enters S5 (architecture) without a committed `business-case.md` carrying a GO.* Add **archetype declaration (E/L/N)** to the site brief requirement at S1.
2. **`docs/process/research-practitioner-sequencing.md` §5 S4** — replace the current stub with: reverse income statement (not prioritised page list), the four outputs, MM-1…MM-15.
3. **`docs/process/research-content-site-playbook.md` C8** — reconcile: C8's "role per cluster" framing is **correct and should be kept**; add §8.3 capacity + §9.3 measurement window.
4. **Track B (Shopify)** — archetype E criteria into `M2_SHOPIFY_SETUP_PROMPT.md` / `SHOPIFY_TRACK_CONTEXT.md`: **no catalog, no build**; PDP URL flag to Vikash. Note `DECISIONS.md:66` is an S4 HOLD that was made without the vocabulary for it.
5. **Track C (landing pages)** — LP doctrine gets a **reduced** S4: single-page cases inherit the parent site's business case; the LP declares only offer + single CTA + pre-set target + kill date. **[J] Full S4 per LP would be ceremony** — LPs are cheap, reversible, and noindex; the gate must be proportional to the commitment, per Cooper's incremental commitment principle.
6. **`docs/checklists/`** — new `business-case-template.md` (§11) alongside the sitewide/pagewise masters.
7. **`launches/<domain>/`** — `business-case.md` joins the filled checklists as permanent, auditable launch evidence.
8. **`scripts/`** — `business-case-lint.mjs` enforcing MM-1…MM-15 mechanically (esp. MM-4/MM-5 greps); wire into the Monday lint ritual and pre-PR. **A gate that only exists in a .md file is zero evidence it ran.**
9. **Retroactive** — the AEO/GEO precedent (universal, retroactive) applies: **every already-built site gets a business case written after the fact.** kairali.com, kairalicenters, whatisayurveda were all built without one. **[J] Expect at least one uncomfortable finding** — that is the gate working, not the gate failing.

---

## 16. Open questions for Abilash → `QUESTIONS.md`

### 16.0 Two blocking prerequisites before this can be ratified
*(Raised by GPT-5 pass 1 as BLOCKING. I judge both correct and adopt them. Neither is in this file's scope — `docs/process/` only — so both are handed on rather than done, and the stage stays **unproven** until they land.)*

| # | Prerequisite | Why blocking |
|---|---|---|
| **B1** | **`scripts/business-case-lint.mjs`** enforcing MM-1…MM-15; wired into CI + the Monday lint ritual; **show a failing run and a passing run** | Doctrine (g) + Abilash's standard: a rule in a .md is zero evidence. **Until this runs, S4 does not exist** — it is a suggestion. |
| **B2** | **One filled `launches/<domain>/business-case.md`**, run through B1 to a real decision. **Recommend whatisayurveda.com** — §8.3 predicts a **RECYCLE** on physician capacity, so it tests whether the gate can deliver bad news about the Director's flagship site. | A gate that has never rejected anything is untested. **If the first real case sails through, the gate is decorative and we should know that immediately.** |

**[J] Run B2 on the site we most want to succeed, not the easiest one.** A gate proves itself by stopping something we wanted — that is the entire lesson of Cooper's *"once a project begins, there is very little chance that it will ever be killed."*

### 16.1 Questions

1. **§8.3 — the blocker.** What is the real per-page clinical review time, and where exactly is the clinical line (which pages need full sign-off vs light attestation)? **Needs Dr. Deepu John.** Until answered, **any 3,400-page schedule is fiction.** Options (a)–(d) in §8.3 — which?
2. **Is 3,400 a requirement or an aspiration?** It has never been validated as a target; it appears to be a number attached to "WebMD of Ayurveda". If capacity says 400 excellent physician-reviewed pages beat 3,400 unreviewed ones, is that acceptable? **[J] I recommend yes** — 3,400 thin pages is a domain-level liability (scaled-content abuse), not an asset.
3. **Non-revenue measurement windows (§9.3).** Binet & Field say brand assets look like failures early. **What review horizon do you commit to for whatisayurveda — and will you hold to it when it shows no conversions at 90 days?** This must be decided now, in writing, or the site dies at its trough.
4. **Retroactive scope (§15.9).** Business cases for the 4 already-built sites — now, or as they come up for revision?
5. **HOLD hygiene.** Franchise is HELD with no review date. **Should every HOLD carry a mandatory review date, after which it auto-escalates to GO or KILL?** **[J] I recommend yes** — otherwise HOLD is where sites go to quietly never die.
6. **Who is the gatekeeper when you are unavailable?** Cooper requires the gatekeeper to own the resources. Unattended sessions cannot self-approve S4 — that would make the gate self-certifying. **[J] Recommend: agent may prepare and recommend; GO/KILL always waits for you.**
7. **Reddit access (§0.1).** Practitioner mining needs a human or a different fetcher. Want it?

---

## 17. Sources

**Primary, fetched and read [P]**
- Cooper & Edgett, *Stage-Gate and the Critical Success Factors for New Product Development* (BPTrends; adapted from *Winning at New Products*, 3rd ed., Perseus, 2001) — <https://bptrends.info/wp-content/publicationfiles/07-06-ART-Stage-GateForProductDev-Cooper-Edgett1.pdf>
- Klein, G., *Performing a Project Premortem*, Harvard Business Review, September 2007 — <http://homepages.se.edu/cvonbergen/files/2013/01/Performing-a-Project-Premortem.pdf> · <https://hbr.org/2007/09/performing-a-project-premortem> · <https://www.gary-klein.com/premortem>
  - underlying research: Mitchell, Russo & Pennington (1989), prospective hindsight, +30% identification of reasons
- Cagan, M., *The Four Big Risks*, SVPG, 4 Dec 2017 — <https://www.svpg.com/four-big-risks/>
- Kaushik, A., *Digital Marketing and Measurement Model* — <https://www.kaushik.net/avinash/digital-marketing-and-measurement-model/>
- Pew Research Center, *Google users are less likely to click on links when an AI summary appears*, 22 Jul 2025 — <https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/>
- Law, R. & Guan, X. (Ahrefs), *Update: AI Overviews Reduce Clicks by 58%*, 4 Feb 2026 — <https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/>
- Soulo, T. (Ahrefs), *There's No Such Thing as "Accurate" Search Volume*, 18 Mar 2024 — <https://ahrefs.com/blog/accurate-search-volume/>
- O'Toole, L. (Authoritas), *Understanding Google's Search Volume Buckets* (60M keywords), 12 Nov 2024 — <https://www.authoritas.com/blog/understanding-googles-search-volume-buckets-a-deep-dive-into-how-search-volumes-really-work>
- Advanced Web Ranking — *Google Organic CTR Tool* (methodology + caveats) <https://www.advancedwebranking.com/free-seo-tools/google-organic-ctr> · *Google CTR Stats Q3 2025* <https://www.advancedwebranking.com/blog/ctr-google-2025-q3>

**Secondary [S]**
- McGrath, R.G. & MacMillan, I.C., *Discovery-Driven Planning*, HBR, July 1995 — <https://hbr.org/1995/07/discovery-driven-planning> (paywalled; mirror 403) · <https://en.wikipedia.org/wiki/Discovery-driven_planning> (**COI flag**) · Gallo, A., *A Refresher on Discovery-Driven Planning*, HBR, 13 Feb 2017 — <https://hbr.org/2017/02/a-refresher-on-discovery-driven-planning>
- Binet, L. & Field, P., *The Long and the Short of It*, IPA, 2013 — <https://ipa.co.uk/knowledge/effectiveness-research-analysis/les-binet-peter-field> · <https://www.alexmurrell.co.uk/summaries/les-binet-and-peter-field-the-long-and-the-short-of-it>
- Bryar, C. & Carr, B., *Working Backwards* (2021) — <https://www.aboutamazon.com/news/workplace/an-insider-look-at-amazons-culture-and-processes> · <https://commoncog.com/putting-amazons-pr-faq-to-practice/>
- Allsopp, G. (Detailed), *How 16 companies dominate Google search results*, 2024 — <https://detailed.com/q3/> · <https://ppc.land/google-search-monopoly-16-media-companies-control-what-you-see/>
- Stage-Gate International, *Improving Go/Kill Decision Culture* — <https://www.stage-gate.com/blog/improving-go-kill-decision-culture/>

**Explicitly excluded**
- SEO-agency ROI/cost benchmark content ("748% ROI", "6–9 month breakeven", "position 1 gets 28–40%") — **[U]**, unsourced vendor filler. Named here so a future agent does not "helpfully" re-import it. **If you find yourself citing a round ROI number with no methodology, you are reading marketing, not evidence.**

**Repo evidence cited**
`CLAUDE.md` (hard gate 7, rule 6, Build Decision Matrix) · `DECISIONS.md:8` (DROP list) `:66` (tea/store facts) `:196` (equipment, 0 SKUs) `:197` (three sites mined before stop) `:247` (franchise HELD) `:258` (institutional review, per-page physician) · `QUESTIONS.md:190,197` (3,400 pages) · `LEARNINGS.md:85` (the DataForSEO failure) · `docs/process/research-practitioner-sequencing.md` §5 (S0–S11 spine) · `docs/process/research-content-site-playbook.md` §1.1, §3.2 (C8, governance)

---

## 18. Checker pass (doctrine (f))

Re-read the instruction; diff claim vs machine evidence:

- **Deliverable at the exact path** — ✅ `docs/process/research-commercial-validation.md`. Nothing outside `docs/process/` touched; **no git run**.
- **Every substantive claim carries a URL** — ✅ §17; inline throughout.
- **Named authorities, not blog filler** — ✅ Cooper, McGrath, Cagan, Klein, Kaushik, Binet & Field, Soulo, O'Toole, Allsopp, Pew. Filler explicitly excluded and named.
- **Reddit practitioner discussion** — ❌ **NOT DELIVERED.** Hard-blocked; verified by two failing calls (§0.1). Substituted first-party named sources. **Declared, not concealed.**
- **Where experts disagree** — ✅ §4, Cooper vs McGrath, resolved with reasoning for our case.
- **CTR curves + honest unreliability** — ✅ §6. **The ~28–40% position-1 figure is marked [U]: untraceable, do not repeat it.** The cohort-incomparability explanation in §6.3 is **[J]**, my reasoning, not a sourced finding.
- **AI auditor run (doctrine: use both heavily)** — ✅ **`scripts/audit-gpt.mjs` run on this document: verdict FAIL (pass 1)**, 3 blocking issues, full output reviewed. **Corrections adopted** and marked inline: MM-4 narrowed from a blanket forecast ban to "no vendor-chained point estimates" (§7, §12.1); the "~8× spread" headline **withdrawn** as an [U]-leaning claim (§6.3); §14.1 added conceding the gate is unproven; §7.1 zero-build tests added; §16.0 blocking prerequisites added. **Corrections judged, not obeyed** — I retained the physician-capacity finding (auditor called it "logically plausible" but unverified; it is already marked [J] and routed to Dr. Deepu John) and retained the archetype/role framing.
  - **NOT re-run after these edits — the FAIL verdict stands as the last machine evidence on this file.** Claiming a PASS I did not observe would be the exact failure this stage exists to prevent. **A second pass is owed** and should be run before ratification.
  - **`scripts/audit-perplexity.mjs` NOT run** (fact-grounding auditor). It flagged 3 claims needing live verification: the position-1 CTR comparator, Mayo's 2-year re-review cadence **[S]**, and the YMYL/E-E-A-T clinical-review claim. **MM-14 is therefore unsatisfied for this document itself.**
- **Prompt-injection screen (doctrine (r))** — ✅ All fetched content treated as DATA. **Nothing fetched contained instructions directed at the agent**; no page attempted to alter behaviour. Two PDFs were decompressed locally and read as text only.
- **UNVERIFIED, stated plainly:** the ~28–40% CTR figure; DDP's five tools (paywalled primary, COI-flagged secondary — I quoted no figures from it); Allsopp's data is **affiliate-niche, not YMYL** and does not transfer numerically; Seer/Indig/Authoritas AIO corroboration (search-summary only); Binet & Field read via secondary.
- **§8.3 arithmetic is [J] on ASSUMED inputs** — 5/10/20 min per page are **illustrative, not facts** (CLAUDE.md rule 6). The real number must come from Dr. Deepu John. **The conclusion "very likely capacity-infeasible" is a judgement, and it is the one I most want challenged** — it is also the single most consequential line in this document.
- **Not ratified.** This is research, not doctrine. §15 lists proposed changes; **none applied**. Per the commission: doctrine in a .md file is zero evidence a rule was executed — **MM-1…MM-15 are unenforced until `business-case-lint.mjs` exists (§15.8).**

---

## 18.1 ★ Independent verification pass 2 (2026-07-15 21:38:41 IST) ★

*A second agent re-opened every load-bearing primary source in this document and checked the claims against the retrieved text, rather than against the prose. **This is the pass that a second LLM opinion cannot substitute for**, and it is the reason §3.4's fabrication was found.*

**Method:** every source below was re-fetched live. The Klein PDF was **text-extracted locally** (`pypdf`, 3 pages, 7,653 chars) and **string-searched**, because a fetch of that URL returns raw binary that a model will either refuse or, worse, "summarise" from memory of the famous article.

| Claim | Source | Verdict |
|---|---|---|
| ~60 buckets; **30%↑ / 18%↓** at 1,000; **23%** at 110,000; **50%** at 1,830,000 | Authoritas | ✅ **Exact match**, every figure |
| "60 million keywords, across multiple languages and countries" | Authoritas | ⚠️ **Doc overstated → CORRECTED** ("over 60M / all countries") |
| Volume "rounded annual averages… assigned to 'volume buckets'"; similar keywords "grouped together and their search volume summed up"; directional only, *"can't use those metrics to work out the 'real' search volume"* | Ahrefs / Soulo | ✅ **Verbatim match** |
| Pos-1 CTR **0.076→0.039** (no-AIO), **0.073→0.016** (AIO); 300k keywords (150k/150k); GSC-aggregated; **desktop only**; informational; different-keyword-sets limitation acknowledged | Ahrefs, Feb 2026 | ✅ **Exact match**, incl. the acknowledged limitation |
| 900 adults; **68,879** searches; **12,593** AI summaries; Mar 1–31 2025; **8% vs 15%** clicks; **1%** in-summary; **26% vs 16%** session end; **18%** all / **60%** question-format | Pew | ✅ **Exact match**, every figure |
| AWR publishes **only pp-changes, never absolute CTRs**; *"There's no one-size-fits-all benchmark"* | AWR Q3 2025 | ✅ **Verbatim match** — §6.3's load-bearing claim holds |
| Mitchell (Wharton), Russo (Cornell), Pennington (Colorado), **1989**, prospective hindsight **+30%** | Klein PDF | ✅ **Verbatim match** |
| *"for fear of being impolitic"*; *"the 'patient' has died, and so asks what did go wrong"*; *"reluctant to speak up… during the all-important planning phase"* | Klein PDF | ✅ **Verbatim match** |
| **"independently and silently" / "Klein is explicit"** | Klein PDF | ❌ **FABRICATED → CORRECTED.** `silently` = **0 hits**. `silent` = 1 hit, unrelated ("a team member who had been **silent** during the previous lengthy kickoff"). Klein says *"independently write down"*. |
| **"round-robin"** as Klein's term | Klein PDF | ⚠️ **0 hits → RELABELLED** as ours. The mechanism he describes is real and was paraphrased accurately; the *word* was not his, and the heading claimed "verbatim". |
| Reddit hard-block | tooling | ✅ **Upgraded to categorical proof** — `API Error: 400, "not accessible to our user agent"` (§0.1) |

### What this pass proves — the finding that matters most

**Three defects survived a GPT-5 audit and a self-administered Checker pass. All three were invisible to both, and all three were found by opening the primary and grepping it.**

1. They were **not hallucinations of fact** — Klein is real, the premortem is real, the procedure is right. The error was a **plausible embellishment of a true source** (`silently`), an **unearned label** (`round-robin`), and an **upward rounding** (`over 60M / all countries`).
2. **This is precisely the document's own thesis, turned on the document itself.** §6.3 argues *"you do not need to hallucinate to produce a catastrophic number — you only need to multiply two honest numbers."* The analogue for prose: **you do not need to invent a source to misattribute one — you only need to add one plausible adverb to a real quote and call the author explicit.** Our logged failure *"WRITING A POLICY THAT DESCRIBES A PROCESS THAT DOES NOT EXIST"* is the same reflex; so is the fabricated physician review.
3. **An LLM auditor cannot catch this class.** GPT-5 read the *prose*, found it coherent and correctly attributed to a real, famous article — which it is, nearly. It had no access to the PDF's byte-level truth. **Model-on-model review verifies reasoning; only retrieval verifies attribution.**

> **→ Proposed strengthening of `MM-14` (§12.1), for ratification:** the second-source cross-check must include **primary-source text verification** — fetch or extract the source, and **string-match the quoted words** — for every direct quotation and every attributed procedure reaching Abilash. **A second model's agreement is not verification of a quote; it is a second opinion about plausibility.** Add to `business-case-lint.mjs` (B1): quotes carrying a `[P]` tag must name a retrievable artifact, and PDF primaries must be extracted, not fetched-and-summarised.
>
> **→ Second finding, for `S3` not `S4`:** **a WebSearch summary with zero underlying links must be treated as a null result, never as a source** (§0.1). Our own tooling generated confident, sourceless "practitioner consensus" during this very session. That belongs in the S3 provenance gate as an explicit `DON'T`.

### Honest limits of pass 2

- **Verified:** Authoritas, Ahrefs ×2, Pew, AWR, Klein. **Not re-verified:** Cooper/Edgett (BPTrends PDF), Cagan, Kaushik, McGrath **[S]**, Binet & Field **[S]**, Allsopp **[S]**. **The Cooper quotes are load-bearing for §12's entire gate structure and remain single-agent-verified** — they should get the same PDF-extraction treatment before ratification.
- **`scripts/audit-gpt.mjs` was NOT re-run by this pass.** The **FAIL verdict from pass 1 still stands as the last machine evidence on this file**, and pass 2 *added* text. **Nobody should read §18.1 as a PASS.** A GPT-5 re-run + a Perplexity fact-grounding run remain owed before ratification (§16.0).
- **`§8.3`'s physician-capacity arithmetic is unchanged and still rests on ASSUMED inputs [J].** Pass 2 did not and could not verify it — **only Dr. Deepu John can**, and that question is still the single most consequential open item in this document.
