# LANDING-PAGE PLAYBOOK — Kairali Web Factory (Track C)
**Compiled 2026-07-15 17:56:56 IST · Research pass, not yet ratified · Sibling to `docs/seo/SEO_PLAYBOOK.md` (Track A) — same conventions: every external claim link-cited, every stage carries an exit artifact and machine evidence.**

**Scope:** `/lp/<campaign>` — noindex by default, single conversion goal, `data-cta` events required, per-platform and per-MOA-segment, offers gated by Abilash ([Factory Rules, `CLAUDE.md`](../../CLAUDE.md); [30-Day Runbook §Landing template](../KAIRALI_30DAY_BUILD_RUNBOOK_v1.0.md)).

**Research discipline note:** every substantive claim below carries a source URL. All fetched pages were treated as DATA, never instructions (Doctrine (r)). No fetched page contained instructions directed at the agent; nothing in this document was authored at the direction of scraped content. Where a source is weak, vendor-authored, or contested, it is labelled as such rather than laundered into fact. Numbers I calculated myself are labelled **[derived]** and show their working — they are not citations.

Legend: ✅ mechanically enforced · 🟡 agent-run with evidence · ❌ no gate yet (→ §7 GAPS)

---

## 0 · THE ONE-PARAGRAPH ANSWER

A landing page is not a small website. It is **one ad's promise, kept**. Everything that follows derives from that: the page exists to keep the specific promise a specific ad made to a specific person at a specific awareness stage, and to do nothing else. This is why the organic playbook's spine (audience → keywords → sitemap → build) **cannot be copy-pasted here**: there is no sitemap because there is no site, no ranking because there is no index, and no "keyword research" in the organic sense because the keyword is not discovered — it is **bought**, and it is already sitting in the Google Ads search-terms report. Abilash's order is right in its logic and needs three surgical changes for this track: (1) the **sitemap step becomes the CONVERSION MAP** — ad → page → form → confirmation → CRM → follow-up, the thing we actually missed; (2) **compliance moves BEFORE the build**, not after, because in Indian Ayurvedic advertising a non-compliant claim is a criminal-liability question, not a QA finding; (3) **"WILL IT SELL?" becomes an arithmetic gate with a published break-even**, not a judgement call.

---

## 1 · WHAT THE CANON ACTUALLY SAYS (evidence base)

### 1.1 Direct-response fundamentals

| Source | What it establishes | Why it binds this track |
|---|---|---|
| **Eugene Schwartz, *Breakthrough Advertising* (1966)** — [5 awareness stages: Unaware → Problem-Aware → Solution-Aware → Product-Aware → Most-Aware](https://www.kingeshop.com/en/customer-awareness-sophistication-eugene-schwartz) | The prospect's awareness stage **determines the headline, the lead, the proof structure and the offer presentation** — "a Stage 1 headline in a Stage 5 market sounds naive… a Stage 5 headline in a Stage 1 market is unnecessarily complex" ([LeadGen Economy summary](https://www.leadgen-economy.com/blog/five-stages-awareness-lead-generation/)) | This is the **diagnosis that must precede writing**. A KTAHV Google Search ad on "panchakarma treatment kerala" buys a Solution-Aware click; a Meta interest ad on "ayurveda wellness" buys a Problem-Aware (or Unaware) click. **Same offer, structurally different page.** This is what "per-platform" means mechanically. |
| **Schwartz, market sophistication (5 levels)** — [levels 1–5; level 3 requires a *unique mechanism*; level 5 shifts "from the promise and the mechanism… to identification with the prospect himself"](https://www.kingeshop.com/en/customer-awareness-sophistication-eugene-schwartz), [mechanism defined](https://www.motiveinmotion.com/market-sophistication/) | Sophistication ≠ awareness. Awareness = what *this person* knows. Sophistication = how many claims *this market* has already heard. | Indian Ayurveda/wellness is a **Level 4–5 market** (every competitor claims authenticity, heritage, "traditional Kerala Panchakarma"). Therefore: bare benefit claims are dead on arrival; we compete on **mechanism + identification**. Our defensible mechanism is documented and unusual: **NABH accreditation + physician-led admission + WHO-GMP in-house pharmacy**. That is the LP's spine in a Level 4–5 market — not "authentic Kerala Ayurveda", which is Level 2 copy in a Level 5 market. |
| **Claude Hopkins, *Scientific Advertising* (1923)** — [key-coded coupons; "traced returns"; ads are salesmanship, not entertainment; specificity over superlatives](https://www.scientificadvertising.com/authors/hopkins/), [summary](https://growthsummary.com/book-summary/scientific-advertising/) | Advertising is only justified by measured response. The measurement instrument must be built **into** the ad. | Our `data-cta` requirement **is** Hopkins' coupon. An LP shipped without working conversion tracking is not a landing page — it is a brochure. This makes `data-cta` a **ship-blocker**, not a nice-to-have. |
| **David Ogilvy, *Confessions of an Advertising Man* (1963)** — ["On the average, five times as many people read the headline as read the body copy. When you have written your headline, you have spent eighty cents out of your dollar."](https://www.goodreads.com/quotes/191457-on-the-average-five-times-as-many-people-read-the) | Headline is ~80% of the leverage. | Budget the effort accordingly: the headline gets the VoC research, the physician review, and the variant set. **Caveat, honestly stated:** this is a 1963 print-era estimate from Ogilvy's own experience, not a controlled study, and it is quoted far more often than it is verified. Treat it as a *priority heuristic*, not a measured constant. |

### 1.2 Modern conversion practice

| Source | Finding | Evidence quality |
|---|---|---|
| **Joanna Wiebe / Copyhackers — review mining** ([method](https://copyhackers.com/2014/10/amazon-review-mining/)) | The **Beachway rehab** case: mined 500+ Amazon reviews from six addiction books in 2–3 hours. Control headline "Your Addiction Ends Here" → winner **"If you think you need rehab, you do."** Result: **">400% more clicks on the orange button… and >20% more lead-gen form submits on the next page."** Method: "You'll take what they say, and mirror it back to them"; use "as few 'summaries' or abstractions as possible". | **Strongest single analogue we have.** A health-treatment-centre lead-gen page, high-consideration, emotionally loaded, family-influenced decision — structurally identical to KTAHV. Single case study, self-reported by the practitioner (not independently replicated) — but the *method* (copy comes from the prospect, not the copywriter) is the durable lesson, not the 400%. |
| **Oli Gardner / Unbounce — attention ratio** ([glossary](https://unbounce.com/conversion-glossary/definition/attention-ratio/), [Conversion-Centred Design](https://unbounce.com/conversion-centered-design/)) | Definition: **"The ratio of links on a landing page to the number of campaign conversion goals."** "In an optimized campaign, your attention ratio should be 1:1." "One Page. One Purpose. Period." "If your ad copy doesn't match the message on your landing page, you're disrespecting the click." | **Asserted best practice.** The glossary page cites **no study**. The CCD page cites an analysis of 20,000+ lead-gen pages showing more links correlate with lower conversion, plus vendor case studies (Twillory 46.86% CR at 1:1). Correlational and vendor-sourced. See §4.1 — we adopt it *partially and deliberately*. |
| **Unbounce Conversion Benchmark Report (Q4 2024 data)** ([report](https://unbounce.com/average-conversion-rates-landing-pages/)) | **Median LP conversion rate 6.6% across all industries**, from **41,000 landing pages / 464M visits / 57M conversions**. Median by industry ranges **3.8%–12.3%**; ["a conversion rate of 10% or above is considered 'good' in general"](https://unbounce.com/landing-pages/whats-a-good-conversion-rate/). Uses **median, not mean**, to resist outliers. | Large N, but it is **Unbounce customers only** (self-selected, tool-using marketers) — a biased sample for absolute benchmarking. Use as a **planning input for sample-size math** (§3, LP-8), never as a target we claim to have hit. |
| **CXL / Michael Aagaard — form fields** ([CXL](https://cxl.com/blog/reduce-form-fields/)) | Reducing 9 fields → 6 **decreased** conversions, because the removed fields were the ones visitors engaged with most. Keeping all 9 and **rewriting the label copy** produced **+19.2%**. A counter-case: 11 fields → 4 produced **+160% submissions**. | **This is the important disagreement.** See §4.2. |
| **Fernbach, Sloman, St. Louis & Shube — "Explanation Fiends and Foes"**, *Journal of Consumer Research* 39(5), Feb 2013 ([Oxford Academic](https://academic.oup.com/jcr/article-abstract/39/5/1115/1794983), [PDF](http://bear.warrington.ufl.edu/brenner/mar7588/Papers/fernbach-jcr-2012.pdf)) | **Peer-reviewed.** "Explanation fiends" are dissatisfied with surface understanding and **pay more** after detailed mechanistic explanation; "explanation foes" **downgrade** products explained in detail — detail "shatters their illusion of understanding". Predicted by the **cognitive reflection test**. | The academic answer to the long-vs-short page war (§4.3). It says the war is unwinnable as posed: **your audience contains both types.** Design for both. |
| **CXL — best practices** ([myths](https://cxl.com/blog/conversion-optimization-myths/), [long vs short](https://cxl.com/blog/long-form-or-short-form/)) | "When we talk about best practices, we are generally speaking of someone's solution to the problem they had." Crazy Egg **+30%** by making a page **20× longer**; Aagaard found a gym chain converted better **shorter**; Pipedrive **+300%** signups from a **shorter** homepage. | Correctly destroys universal rules. But CXL's remedy (test everything) assumes traffic we do not have — see §4.4 and §3 LP-8. |

### 1.3 Message match / scent

| Claim | Source | Status |
|---|---|---|
| Message match = "a measure of how well your landing page copy matches the phrasing of the ad or link that brought the visitor there"; for PPC, match **ad copy to landing page headline** | [Unbounce glossary](https://unbounce.com/conversion-glossary/definition/message-match/) | Definitional, vendor. |
| "Information scent" — users hunt information like animals follow a scent; popularised in this context by **Bryan Eisenberg** | [KlientBoost](https://www.klientboost.com/cro/message-match/), [CXL on maintaining scent](https://cxl.com/blog/give-your-advertising-roi-a-serious-boost-by-maintaining-scent/) (403 to our fetcher; cited via search index) | Concept is well-established in HCI (information foraging theory); the marketing operationalisation is practitioner lore. |
| Specific lift numbers circulating for message match (">200%", "66%") | Secondary blogs citing a Moz case study and a "Chat Support" test | **REJECTED as evidence.** I could not reach a primary source for either. **Do not put these numbers in front of Abilash.** Message match is justified below on *policy* and *definitional* grounds, which are solid, not on these unverifiable lifts. |

**The honest justification for message match** does not need those numbers. It has a harder one: **Google enforces it as an approval matter.** The Destination Requirements policy prohibits ["Destinations or content that are unnecessarily difficult or frustrating to navigate"](https://support.google.com/adspolicy/answer/6368661?hl=en), and Google's Misrepresentation/Destination rules disallow ["promising products, services, or promotional offers in the ad that are unavailable or aren't easily found from the destination"](https://support.google.com/adspolicy/answer/6020955?hl=en). Message match is not a growth hack here. **It is the licence to keep running the ad.**

### 1.4 Speed and mobile

| Finding | Source | Quality |
|---|---|---|
| Google-commissioned study by **55 and Deloitte**: **37 European and American brand sites, 30M+ user sessions**, mobile load times monitored **hour-by-hour for 30 days at the end of 2019**. A **0.1s** improvement produced: **Retail +8.4% conversion, +9.2% consumer spend; Travel +10.1% conversion; Luxury +40.1% product-detail→add-to-basket; Lead Generation +21.6% form-step-1→submission, +7% page views.** | ["Milliseconds Make Millions" — web.dev case study](https://web.dev/case-studies/milliseconds-make-millions), [report PDF](https://www.thinkwithgoogle.com/_qs/documents/9757/Milliseconds_Make_Millions_report_hQYAbZJ.pdf), [Deloitte](https://www.deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions.html) | Large, named, methodology published. **Caveat we must state:** it is **observational and Google-commissioned** — the speed improvements were *natural*, not randomised, so this is correlation with a vested interest attached. The **lead-gen row (+21.6% on form-step-1 → submission)** is our row and it is the strongest argument in this playbook for the performance budget. |

### 1.5 Testing discipline — and why our tests will mostly be underpowered

| Finding | Source |
|---|---|
| **The peeking problem.** Significance math "makes a critical assumption… that the sample size was fixed in advance." If you check after every observation and stop at p<0.05, the real false-positive rate is **26.1%**, not 5%. To hold a true 5% while peeking: 1 peek → report at 2.9%; 2 → 2.2%; 5 → 1.4%; 10 → 1.0%. Remedy: **"Decide on a sample size in advance and wait until the experiment is over before you start believing the 'chance of beating original' figures."** Fixed-sample rule of thumb: **n = 16σ²/δ²**. | [Evan Miller — How Not To Run An A/B Test](https://www.evanmiller.org/how-not-to-run-an-ab-test.html), [sample size calculator](https://www.evanmiller.org/ab-testing/sample-size.html) |
| **Most ideas fail.** Kohavi (Microsoft/Bing/Amazon/Airbnb): roughly **1/3 of ideas positive, 1/3 flat**, rest negative; at Airbnb, **20 of 250** tested ideas moved key metrics. | [AB Tasty interview with Ronny Kohavi](https://www.abtasty.com/blog/1000-experiments-club-ronny-kohavi/), [Kohavi, *Trustworthy Online Controlled Experiments*](https://www.researchgate.net/publication/339914315_Trustworthy_Online_Controlled_Experiments_A_Practical_Guide_to_AB_Testing) |

**[derived] The arithmetic that decides whether we may A/B test at all.** Using Miller's published rule of thumb n = 16σ²/δ² (fixed sample, ~80% power / 5% significance) with the Unbounce median baseline p = 6.6%, so σ² = p(1−p) = 0.0616:

| Minimum detectable effect | δ (absolute) | **n per variant** | **Total clicks needed** |
|---|---|---|---|
| +20% relative (6.6% → 7.9%) | 0.0132 | **≈ 5,660** | **≈ 11,300** |
| +10% relative (6.6% → 7.3%) | 0.0066 | **≈ 22,600** | **≈ 45,200** |

*Working: 16 × 0.0616 / 0.0132² = 0.9863 / 0.00017424 ≈ 5,660. This is my calculation from Miller's formula, not a quoted figure — it is an approximation and should be re-run with the campaign's real baseline before use.*

**The consequence, stated plainly for Abilash:** a KTAHV campaign would need **roughly 11,300 clicks to detect even a 20% swing** — a swing far larger than most real copy changes produce. At any realistic CPC that is a large spend to answer one question. **Therefore: for this track, A/B testing is not the default method. Research is.** We buy certainty with voice-of-customer evidence up front (LP-3), because we cannot afford to buy it with traffic afterwards. This is the direct, evidence-based reconciliation of Abilash's instinct ("research before build") with CXL's ("test everything"): **CXL is right for companies with traffic; Abilash is right for us.** See §4.4.

---

## 2 · THE QUESTION THAT DEFINES THIS TRACK: what do "keywords", "SEO" and "AEO" mean on a noindex page?

This section is the deliverable's core. It is answered from primary platform documentation.

### 2.1 "Keywords" — bought, not discovered; and this is where the DataForSEO-class error dies

On an organic page, a keyword is a **hypothesis about demand** you go and research. On an LP, a keyword is **a line item you are paying for**, and the truth about what people actually type is already sitting in your own account.

| Organic meaning | LP meaning | Source of truth |
|---|---|---|
| Discover demand via third-party volume tools | **Bid keyword list** (what we chose to buy) | The live Google Ads account |
| Estimate what users type | **Search-terms report** (what users *actually typed*, verbatim) | The live Google Ads account |
| Optimise for ranking | **On-page keyword presence** feeding *ad relevance* + *landing page experience* | Google Ads Quality Score diagnostics |

**This is the LP-track answer to the DataForSEO failure.** That failure was: invented compound seeds nobody searches ("turmeric curcumin", "amla amalaki"), implausible zeros summed into cluster totals, India pulled English-only (missing Hindi/Devanagari/Hinglish), reported to the Director as fact. On this track that class of error is **structurally impossible if and only if we enforce the provenance rule** (LP-4 gate):

> **SEED PROVENANCE RULE.** A keyword may enter an LP brief only if it is (a) a row in the account's **search-terms report** (a real human typed it), or (b) a verbatim **VoC quote** (a real human wrote it), or (c) an explicit Abilash/Vikash bid decision recorded in the brief. **A keyword invented by the agent, or synthesised by concatenating two words, is a fabrication and is a ship-blocker.** Every volume/CPC figure must trace to a raw API/CSV response committed under `docs/<entity>-inputs/` with its query, locale, language and timestamp. **A zero is a finding to investigate, never a value to sum.** India pulls MUST declare language coverage (en-IN + hi-IN Devanagari + Hinglish transliteration) or be labelled incomplete on the face of the document.

### 2.2 "SEO" — Quality Score and Ad Rank, with a precision most blogs get wrong

**Quality Score has three components** ([Google Ads Help](https://support.google.com/google-ads/answer/6167118?hl=en)):
- **Expected clickthrough rate** — "The likelihood that your ad will be clicked when shown."
- **Ad relevance** — "How closely your ad matches the intent behind a user's search."
- **Landing page experience** — **"How relevant and useful your landing page is to people who click your ad."**

Each is rated "Above average / Average / Below average" against other advertisers who showed for **the exact same search over the last 90 days**.

**The precision point — read this before writing any Quality Score claim in a report.** Google states explicitly:

> **"Quality Score is not an input in the ad auction. It's a diagnostic tool to identify how ads that show for certain keywords affect the user experience."** ([Google Ads Help](https://support.google.com/google-ads/answer/6167118?hl=en))

But separately, **Ad Rank** — which *is* the auction mechanic — is calculated from your bid, **"the quality of your ads and landing page"**, Ad Rank thresholds, auction competitiveness, and user context; and Google notes *"even if your competition has higher bids than yours, you can still win a higher position at a lower price by using highly relevant keywords and ads"* ([Ad Rank](https://support.google.com/google-ads/answer/1752122?hl=en)).

**So the correct statement is:** the 1–10 Quality Score number is a *diagnostic*, not an auction input — but **ad and landing-page quality genuinely is an auction input**, computed live at auction time. Landing page work lowers CPC and raises eligibility *through Ad Rank*. Any agent report that says "Quality Score determines your CPC" is wrong on Google's own documentation and will be marked as a hallucination at the audit gate.

**Technical hygiene on an LP is therefore an *approval and cost* matter, not a ranking matter** ([Destination Requirements](https://support.google.com/adspolicy/answer/6368661?hl=en)): destinations must be "functional, useful, and easy to navigate"; not allowed are destinations returning "an HTTP error code for Google AdsBot web crawlers", display-URL/final-URL domain mismatch, "redirects from the final URL that take the user to a different domain", content "replicated from another source without adding value", and destinations "unnecessarily difficult or frustrating to navigate". Note this last one already binds us on the ~35 forwarded domains: **no ad may use a forwarded domain as its final URL** (already captured in [`MIGRATION_PLAYBOOK.md` §Ads](../MIGRATION_PLAYBOOK.md)).

### 2.3 "AEO" — the answer is NO, with two exceptions, and it is evidence-based

Abilash's standing ruling is that **AEO + GEO are mandatory on every site** and AEO "should technically be the FIRST" thing. **This is the one place that ruling must be consciously varied — and here is the proof.**

Google's own documentation:

> **"To be eligible to be shown as a supporting link in AI Overviews or AI Mode, a page must be indexed and eligible to be shown in Google Search with a snippet, fulfilling the Search technical requirements."** ([Google — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features))

And `noindex` means: *"Google will drop that page entirely from Google Search results, regardless of whether other sites link to it"* ([Google — Block indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing)).

**Therefore: a `noindex` LP is categorically ineligible for Google AI Overviews and AI Mode. There is no separate AI index and no separate submission step. AEO work on an LP is spend with a documented zero return.** Doing it anyway would be exactly the "ran a rule without checking whether it applies" failure Abilash is trying to eliminate.

**Exception 1 — the LP is still readable by AI assistants, so compliance still applies.** `noindex` is an *indexing* directive, not a *crawl* directive. OpenAI documents three distinct agents, and the third is decisive ([OpenAI — Overview of crawlers](https://developers.openai.com/api/docs/bots)):
- **GPTBot** — training. Blocking it "indicates a site's content should not be used in training".
- **OAI-SearchBot** — ChatGPT search surfacing.
- **ChatGPT-User** — live fetch on a user action. **"Because these actions are initiated by a user, robots.txt rules may not apply."**

So: **a `noindex` LP can still be fetched, read and quoted back to a user by an AI assistant on request.** The operational consequence is not "do AEO" — it is **"every claim on an LP must survive being quoted out of context by a machine to a stranger."** That is a compliance requirement (§5), not an optimisation.

**Exception 2 — the AEO surface for a paid campaign is the ORGANIC site, not the LP.** Users who see an ad frequently search the brand before converting. The entity that must win the AI answer for *"is Kairali NABH accredited?"* or *"what is Kairali Ayurvedic Healing Village"* is **ktahv / kairali.com**, which is indexed and governed by the Track A playbook. **The campaign's AEO work belongs upstream, on the organic site — and it must be scheduled there, not skipped.** An LP that borrows trust from an organic entity that has not done its AEO work is an LP with a hole in it.

**GEO note:** LP content must **not** be listed in `llms.txt` and must not be sitemapped. `packages/seo` already defaults `/lp/*` to noindex ([SEO_PLAYBOOK §2.1](../seo/SEO_PLAYBOOK.md)); the sitemap/llms.txt exclusion needs an explicit test (→ §7 GAPS).

### 2.4 The verdict table

| Discipline | Applies to `/lp/*`? | What it becomes |
|---|---|---|
| Organic keyword research | **No** | Search-terms report + VoC mining (LP-3/LP-4) |
| Ranking / backlinks / topical authority | **No** | — |
| Technical SEO (speed, mobile, HTTPS, working destination, no chains) | **YES — harder** | Ad approval + Ad Rank + measured conversion (§1.4) |
| Message match / keyword-on-page | **YES** | Ad relevance + landing page experience + policy compliance |
| Schema markup | **Mostly no** | No rich-result surface exists on a noindex page. Ship only what a *rendering* consumer uses. **Do not ship schema theatre.** |
| **AEO (AI Overviews / AI Mode)** | **NO — proven ineligible** | Redirect the budget to the organic entity (Exception 2) |
| **GEO** | **No** — but AI assistants can still fetch it (Exception 1) | Claim discipline, not optimisation |

---

## 3 · THE NUMBERED LP STAGE PLAYBOOK

**Execution rule (Abilash's, binding):** stages are entered **one at a time**, in order. Each stage has an **EXIT ARTIFACT** committed to the repo and **MACHINE EVIDENCE**. An agent may not begin stage N+1 until stage N's artifact exists in git. **"Doctrine written in a .md file is ZERO evidence the rule was executed"** — the artifact is the evidence.

Stages carry a **[gate]** marker where the stage can HALT the campaign, and **[human]** where a named person must sign.

---

### PHASE A — MANDATE (do not touch a keyboard before this exists)

#### **LP-1 · CAMPAIGN MANDATE** [gate] [human: Abilash]
*Abilash's "Plan" + "Understand the company you are building for", collapsed — for an LP these are one question: what are we selling, to whom, for what money?*

- Entity (KTAHV / Villa Raag / KAPPL / group) → **fixes the language register immediately.** KTAHV = clinical lock: banned words *spa, resort, holiday, luxury, cure, journey, guests* in all locales incl. DE/FR equivalents (`CLAUDE.md`). **On an LP this lock is doubly load-bearing:** the GST SCN register risk and the DMR Act advertising risk (§5) point the same direction — "cure" is both a banned word *and* a criminal-liability word.
- Platform (Google Search / Meta / other) → **fixes the awareness stage** (LP-5).
- MOA segment → fixes the audience (LP-2).
- **The offer, in one sentence** — and offers are gated by Abilash (Factory Rules). **No offer, no page.** The agent never invents an offer, a price, a discount, or an inclusion (`CLAUDE.md` Hard Gate 6).
- Single conversion goal, named: *qualified enquiry* / *booked consultation* / *WhatsApp thread*. **One.**
- **EXIT ARTIFACT:** `sites/<domain>/content/lp/<campaign>/00-mandate.md`, signed line: `Approved by Abilash — <YYYY-MM-DD HH:MM:SS IST>`.
- **HALT IF:** offer unapproved, goal plural, or entity/register unclear → QUESTIONS.md, next task (Unattended Rule).

#### **LP-2 · AUDIENCE DEFINITION** [gate]
*Abilash's steps 2, 3, 9 — one segment per page.*

- One page = **one segment**. Two segments = two pages. This is the mechanical meaning of "per-platform + per-MOA-segment".
- Named: who, where, what language, what they are trying to get away from, who else is in the decision (for KTAHV, **usually a family member, often the payer, often in a different country** — the German daughter booking for the Indian mother is a different reader from the patient).
- **EXIT ARTIFACT:** `01-audience.md` — segment, locale(s), device mix (from GA4), decision unit.
- **HALT IF:** the segment is "everyone interested in Ayurveda". That is not a segment; that is an absence of a decision.

---

### PHASE B — RESEARCH (the stage that buys the certainty we cannot afford to buy with traffic)

#### **LP-3 · VOICE-OF-CUSTOMER MINING** [gate]
*Abilash's step 3, done Wiebe's way. **This is the highest-leverage stage in the playbook** and the one we have historically skipped.*

Method, per [Copyhackers](https://copyhackers.com/2014/10/amazon-review-mining/): identify prospects and their goals → identify the solutions they use today → find where those are reviewed → **extract prospect language verbatim into a table** → cluster into themes. Rule: **"as few 'summaries' or abstractions as possible."**

Our sources, ranked by value:
1. **Our own inbox and WhatsApp** — real enquiries in the prospect's own words. Free, unmined, best.
2. **Our own reviews** — TripAdvisor / Google reviews of KTAHV, and competitor reviews from the comp set (`docs/ktahv-inputs/comp-set.md`).
3. **Sales/reception staff** — what do people actually ask on the phone? What are they afraid of?
4. Public forums, YouTube comments on Panchakarma videos, Amazon reviews of Ayurveda books (Wiebe's exact Beachway move, and it worked on a treatment centre).

- **EXIT ARTIFACT:** `02-voc.md` — **minimum 50 verbatim quotes**, each with source + date, clustered into: **NEEDS / DESIRES / FEARS / OBJECTIONS / THE WORDS THEY USE FOR US** (Abilash's steps 12/13/14 — they are not a separate stage, they are the *output schema* of this one).
- **MACHINE EVIDENCE:** quote count; every quote has a source URL or a dated internal reference.
- **HALT IF:** fewer than 50 verbatims, or any quote is paraphrased/synthesised. **A quote the agent wrote is a fabrication.** Same rule, same severity, as an invented keyword.
- **[human] for KTAHV:** if a quote names a disease or an outcome, Dr. Deepu John sees it before it can become copy.
- **PRIVACY:** VoC from our own enquiries must be **de-identified before it enters the repo** — no names, no emails, no phone numbers. Quote the language, never the person.

#### **LP-4 · KEYWORD + SEARCH-TERMS RECONCILIATION** [gate]
*Abilash's steps 4 and 5 — but on this track they invert. We do not research the keyword; we **read** it.*

- Pull the **search-terms report** for the target campaign/ad group: what people actually typed.
- Reconcile against LP-3: **do the search terms and the VoC use the same words?** Where they diverge, the VoC usually holds the emotional truth and the search term holds the intent. The headline serves the VoC; the ad relevance serves the search term.
- Apply the **SEED PROVENANCE RULE** (§2.1) in full. Commit the raw export.
- **EXIT ARTIFACT:** `03-keywords.md` + the raw CSV/JSON export with query, locale, language, timestamp.
- **MACHINE EVIDENCE:** every keyword traces to a row in the committed export or a quote in `02-voc.md`. **Zero invented seeds. Zero unexplained zeros. Language coverage declared.**
- **HALT IF:** no live campaign exists yet (new campaign, no history) → then the keyword list comes from **Vikash/Abilash's bid decision**, explicitly recorded as such, and the page is built to the VoC. **It does not come from the agent's imagination, and it does not come from a third-party volume tool presented as fact.**

#### **LP-5 · AWARENESS + SOPHISTICATION DIAGNOSIS** [gate]
*Not in Abilash's list — **this is the addition the canon demands**, and it is the step that makes the page's structure a derivation instead of a preference.*

| Input | Determines |
|---|---|
| Platform + search term | **Awareness stage** (Schwartz): Search on "panchakarma kerala cost" = Solution/Product-Aware → lead with the offer and proof. Meta interest targeting = Problem-Aware or Unaware → lead with the problem, in their words, and earn the right to the offer. |
| Comp-set claim audit | **Sophistication level**: Indian Ayurveda/wellness = **Level 4–5** → mechanism + identification, never bare benefit claims. |

- **EXIT ARTIFACT:** `04-diagnosis.md` — declared awareness stage + sophistication level, **with the reasoning and the evidence**, and the resulting structural prescription (what the headline must do, what the lead must do, what proof is required).
- This artifact is the **input to LP-9 (wireframe) and LP-10 (copy)**. It is why the page is shaped the way it is. **If a design review asks "why is the page structured like this?", the answer is this file — not taste.**

---

### PHASE C — ARCHITECTURE (contains the step we missed)

#### **LP-6 · THE CONVERSION MAP** [gate]
*🔴 **This is Abilash's "CREATE SITE MAPS" step, translated. It is the thing we missed, and on this track it is not a sitemap — it is a conversion map.***

An LP has no sitemap because it has no site: one page, noindex, no internal navigation. **But the thing a sitemap actually does — force you to decide the architecture before you build it — is exactly as necessary here, and its object is the funnel.** Map every node end-to-end **before a line of code**:

```
AD (headline + description + display URL + extensions)
  └─→ /lp/<campaign>            ← message match verified here
        ├─→ FORM submit  ──→ /lp/<campaign>/thank-you  ──→ CRM  ──→ human follow-up (who? SLA?)
        ├─→ WHATSAPP click ─→ +91 92898 38797 (Priya, KTAHV — verify, …38777 is WRONG)
        └─→ EXIT (no other links — see §4.1)
```
Every node needs: **owner, URL, `data-cta` id, consent state, locale variants, failure mode.**

**Nodes we have historically forgotten, each of which silently zeroes a campaign:**
- **The thank-you page** — also noindex; it is where the conversion event fires and where the next step is set. A missing thank-you page = a missing conversion signal = Ads optimising blind.
- **The CRM landing point and the human on the other end.** An LP that generates enquiries nobody answers within the SLA is worse than no LP — Hopkins' traced return with nobody to trace it to.
- **The offline conversion loop** — for KTAHV the real conversion is an *admission*, weeks later, not a form submit. If that never returns to Ads, we are optimising for form-fills, which is how a hospital ends up buying junk leads at scale. **This is the single most valuable box on the map and the one most likely to be skipped.**
- **Locale variants.** KTAHV = EN/DE/FR. **Every locale ships or the page is explicitly flagged EN-only pending translation** (`CLAUDE.md`). Note the German LP inherits the strictest consent regime (§5.3).
- **Consent state at each node** — a `data-cta` that fires before consent in DE/FR is a compliance incident, not a tracking bug.

- **EXIT ARTIFACT:** `05-conversion-map.md` containing the diagram + the node table.
- **HALT IF:** any node lacks an owner, or the offline loop is undefined for a high-ticket entity.

#### **LP-7 · OFFER + RISK REVERSAL** [gate] [human: Abilash]
*Abilash's steps 10 and 11a — the offer, not the page, is usually the thing that is broken.*

- The offer is Abilash's to set. The agent's job is to **state it precisely** and to name what makes it worth more than the click's alternative.
- **Mechanism** (Level 4–5 market, per LP-5): what is the *unique method* — NABH-accredited protocol, physician-led admission, in-house WHO-GMP pharmacy? **Specific, verifiable, ours.** Not "authentic".
- **Risk reversal — and here the popular canon must be overruled.** The circulating evidence for money-back guarantees ("+21% sales") is vendor blog content with no reachable primary source ([example](https://abmatic.ai/blog/role-of-money-back-guarantees-on-landing-page-conversion)) — **I could not verify it and it does not go in front of Abilash.** More importantly it is **inapplicable and hazardous**: Google requires that advertisers *guaranteeing results* provide "a clear and easily accessible refund (money-back) policy" and that testimonials carry "a visible disclaimer stating that there is no guarantee of specific results" ([Unreliable claims](https://support.google.com/adspolicy/answer/15936857?hl=en)) — and in India, guaranteed-outcome claims for an Ayurvedic treatment run straight into the DMR Act (§5.2). **Our risk reversal is therefore structural, not financial:** free no-obligation physician consultation; transparent published pricing; a published cancellation policy; NABH accreditation as third-party proof; a named physician. That is a stronger risk reversal for a hospital than a refund promise, and it is legal.
- **EXIT ARTIFACT:** `06-offer.md`, Abilash-signed with timestamp.

#### **LP-8 · WILL IT SELL? — THE ARITHMETIC GATE** [gate]
*Abilash's step 11, converted from a judgement into a calculation. **This gate can kill the page, and it is supposed to.***

Before build, compute and commit:

| Input | Where it comes from |
|---|---|
| Expected CPC | Ads account / Keyword Planner **for these exact terms** — cited, not guessed |
| Expected LP conversion rate | **Our own GA4 history first.** Only if none exists, the Unbounce median 6.6% ([source](https://unbounce.com/average-conversion-rates-landing-pages/)) as an explicitly-labelled *placeholder* — never as a forecast |
| Enquiry → admission/sale rate | Sales/reception reality, from a human |
| Value per sale | Finance. **The agent never invents a price** (Hard Gate 6) |
| **→ Break-even CPA and required conversion rate** | **[derived] — show the working** |
| **→ Sample size, if a test is proposed** | §1.5 arithmetic, re-run on the real baseline |

- **EXIT ARTIFACT:** `07-will-it-sell.md` — every input cited to a source or marked **UNKNOWN — ASK**. Explicit verdict: **BUILD / DON'T BUILD / FIX-THE-OFFER-FIRST**.
- **HALT IF:** break-even requires a conversion rate above the industry *top* decile. That is not a landing page problem — that is an **offer or a targeting problem**, and building a beautiful page will not fix it. Say so, in writing, to Abilash. **(Pushback duty.)**
- **HALT IF** the plan includes an A/B test whose required sample exceeds the campaign's realistic click volume → the correct answer is **"we cannot test this; we will research it instead"**, not a test we will misread (§1.5).

#### **LP-9 · COMPLIANCE PRE-CLEARANCE** [gate] [human: Dr. Deepu John for anything clinical]
*🔴 **Moved BEFORE the build. This is the second structural change to Abilash's order, and it is not negotiable.*** Full detail in §5. Every claim, on paper, cleared, **before it is written into a page** — because in Indian Ayurvedic advertising a bad claim is not a QA finding to fix in staging, it is a **cognizable offence** (§5.2), and because a claim cleared after the design is built creates pressure to keep the claim.

- **EXIT ARTIFACT:** `08-claims.md` — a **claims register**: every claim | its substantiation | its source | verdict PASS/FAIL/REWORD | reviewer + timestamp.
- **HALT IF:** any claim is unsubstantiated or touches the DMR Act Schedule (§5.2). No exceptions, no "we'll soften it later".

---

### PHASE D — BUILD (only now)

#### **LP-10 · WIREFRAME + ATTENTION DISCIPLINE**
- Structure is **derived from LP-5**, not chosen. Solution-Aware page ≠ Problem-Aware page.
- **Attention discipline (see §4.1 for the reasoning and the honest caveat):**
  - ✅ **Hard rule: no navigation, no footer link farm, no blog links, no exits.** This is the well-supported part of Gardner's principle and the part Google's Destination Requirements independently rewards.
  - ✅ **Hard rule: one conversion GOAL.**
  - 🟡 **Not a hard rule: one button.** Form + WhatsApp + phone all firing the *same* goal is permitted for Indian and diaspora audiences. **Stated honestly: by [Unbounce's literal definition](https://unbounce.com/conversion-glossary/definition/attention-ratio/) ("the ratio of links… to the number of campaign conversion goals") that is 3:1, not 1:1 — we are knowingly deviating.** Rationale in §4.1.
- **Both reader types served** (Fernbach et al. 2013): CTA above the fold for the *foe*; full mechanism, protocol detail, physician credentials, pricing below for the *fiend*. **The page is long AND the path is short.**
- Trust furniture: NABH accreditation, named physicians with Person schema, real photography from the 798-image library (**never AI humans on KTAHV — standing law**), real reviews.
- **EXIT ARTIFACT:** `09-wireframe.md` + design-critic pass.

#### **LP-11 · COPY — FROM `02-voc.md`, NOT FROM THE AGENT**
- **The rule, and it is the whole point of Phase B:** every headline, subhead and CTA traces to a line in `02-voc.md` or `03-keywords.md`. Wiebe's Beachway headline was *found*, not written.
- **Headline gets the 80% of the effort** (Ogilvy) and must carry message match to the ad (§1.3).
- Register lock applies (KTAHV clinical; Villa Raag wellness-hospitality; KAPPL product-pharma). Human-Authorship Standard applies ([SEO_PLAYBOOK §6](../seo/SEO_PLAYBOOK.md)).
- **EXIT ARTIFACT:** `10-copy.md` — a two-column table: **copy line | its VoC source line**. Any line with an empty right-hand cell is the agent talking to itself. **That cell is the gate.**

#### **LP-12 · BUILD**
- MDX + `packages/*` only (Factory Rules). Never a cart/checkout/payment form — checkout is Shopify, always.
- `noindex` (default in `packages/seo`), excluded from sitemap + `llms.txt`, thank-you page also noindex.
- `data-cta` on every conversion mechanism (Hopkins' coupon — **ship-blocker**).
- Consent Mode v2 via `packages/consent`; consent checkbox + privacy link on the form (§5.3).
- Performance budget: the lead-gen row of the Deloitte study (**+21.6% form-step-1 → submission from 0.1s**) is the justification — LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75 mobile.
- All declared locales, or explicitly flagged EN-only.

---

### PHASE E — SHIP

#### **LP-13 · PRE-FLIGHT GATE — MACHINE EVIDENCE ONLY** [gate]
No self-reported success. Paste real output.

| # | Check | Evidence |
|---|---|---|
| 1 | `pnpm build` clean | terminal output |
| 2 | `curl -sI <lp-url>` → 200; `curl -s <lp-url> \| grep -i noindex` → present | pasted |
| 3 | LP **absent** from `sitemap.xml` and `llms.txt` | pasted |
| 4 | Thank-you page noindex + reachable | pasted |
| 5 | **Message match:** ad headline vs LP H1 — diffed, side by side | pasted |
| 6 | Every `data-cta` fires (incl. WhatsApp) | GA4 DebugView screenshot |
| 7 | Attention ratio: **zero** nav/exit links | link-count output |
| 8 | Lighthouse ≥90 perf mobile | report |
| 9 | Form renders + consent checkbox + privacy link | screenshot |
| 10 | Banned-word scan, all locales incl. DE/FR equivalents (KTAHV) | lint output |
| 11 | **Claims on page == `08-claims.md`, exactly** | diff |
| 12 | WhatsApp = **+91 92898 38797** (…38777 is WRONG) | grep |
| 13 | `info@kairali.com` where an email appears | grep |
| 14 | All declared locales ship | file list |
| 15 | Every stage artifact `00`–`10` exists in git | `ls` |
| 16 | `/security-review` pass | output |
| 17 | **GPT-5 audit** (`scripts/audit-gpt.mjs`) PASS | strict-JSON verdict |
| 18 | **Perplexity fact-grounding audit** on every external claim | citations |

**Check 11 is the anti-hallucination gate.** A claim that appears on the page but not in the cleared register means copy drifted after clearance. **That is exactly the DataForSEO failure mode — a number that entered a document without provenance — and it fails the page.**

#### **LP-14 · STAGING → APPROVAL → PUBLISH** [human: Abilash]
- Vercel preview → Abilash. Ad and page go live **together** (a live ad pointing at a dead/unmatched page is a Destination Requirements violation).
- **If an LP URL ever changes: flag Vikash BEFORE it happens — live ads point at it** (Doctrine (m), and [Destination mismatch](https://support.google.com/adspolicy/answer/16428020?hl=en) disapproves cross-domain redirects). Edit the final URL in Ads at cutover; do not lean on a redirect. Editing final URLs resets ad review — do it at a low-traffic hour ([MIGRATION_PLAYBOOK §Ads](../MIGRATION_PLAYBOOK.md)).
- **Post-publish fetch and diff against intent. Show the diff.** (Proof-of-Work rule.)

---

### PHASE F — LEARN

#### **LP-15 · MEASURE**
- Watch: CTR, LP conversion rate, **cost per *qualified* enquiry** (not per form-fill), **enquiry → admission**, Quality Score components as a **diagnostic** (§2.2 — never reported as an auction input).
- **Feed offline conversions back to Ads**, or accept that we are optimising for the wrong event.

#### **LP-16 · TEST — ONLY IF THE ARITHMETIC ALLOWS**
- **Fix the sample size in advance. Do not peek.** Peeking after every observation turns a 5% false-positive rate into **26.1%** ([Evan Miller](https://www.evanmiller.org/how-not-to-run-an-ab-test.html)). If a mid-flight look is unavoidable, use sequential design with checkpoints declared up front — not eyeballing a dashboard.
- If the required N exceeds realistic volume (§1.5 — and for us it usually will), **do not run a test and call it evidence.** Run more VoC research, or a qualitative session-recording review (Clarity MCP is connected), or ship the better-researched page. **An underpowered test is worse than no test: it manufactures false confidence, and it costs money to do it.**
- Expect most ideas to fail: ~1/3 positive, ~1/3 flat ([Kohavi](https://www.abtasty.com/blog/1000-experiments-club-ronny-kohavi/)).

#### **LP-17 · MAINTAIN / RETIRE**
- Campaign ends → **the page does not linger.** Retire or redirect; a stale offer on a live URL is an Unreliable-claims exposure.
- Any LP outliving its campaign, or whose offer has changed, is a **weekly QA audit finding**.
- Wins and losses → `LEARNINGS.md`. This playbook is amended by LEARNINGS-driven PR only (same rule as the SEO playbook).

---

## 3.5 · THE DON'T COLUMN — per-stage anti-patterns 🔴 MANDATORY THEME

**Abilash's ruling (15 Jul 2026), binding on every stage above:** *"what we should NOT do is also equally important… whenever we do anything — in terms of design, in terms of SEO — best practices AND worst practices have to be checked."*

**How to read this section.** The stage bodies in §3 are the **DO** list. This is the **DON'T** list, keyed stage-for-stage. It is not decoration: it is the column an auditor checks against, and it is how average work is actually prevented. **Provenance rule for this section itself:** every DON'T is traceable to (a) a cited source, (b) a platform policy, or (c) **our own logged failure**. A DON'T with no provenance is an opinion and does not belong here — the same standard this playbook imposes on keywords and quotes.

| Stage | 🚫 DON'T | Provenance |
|---|---|---|
| **LP-1 Mandate** | Invent or "reasonably assume" an offer, price, discount or inclusion — however plausible it looks | Hard Gate 6, `CLAUDE.md`. **Our own failure class:** plausible, well-formed, false |
| | Accept a plural goal ("enquiries *and* brand awareness"). Two goals = two pages | Gardner, one-goal principle ([CCD](https://unbounce.com/conversion-centered-design/)); KlientBoost mistake #1 "Too many conversion goals" ([17 mistakes](https://www.klientboost.com/landing-pages/landing-page-mistakes/)) |
| | Let the register drift on KTAHV. **"Cure" is a banned word *and* a criminal-liability word** | `CLAUDE.md` clinical lock + DMR Act §5.2 |
| **LP-2 Audience** | Write "everyone interested in Ayurveda". That is not a segment, it is an absence of a decision | §3 LP-2 HALT |
| | Assume the reader is the patient. For KTAHV the payer/decider is often a family member, often abroad | LP-2; comp-set reality |
| | Merge two segments onto one page to save build time | LP-2 |
| **LP-3 VoC** | **Write a quote.** A quote the agent composed is a fabrication — same severity as an invented keyword | **Our own failures:** fabricated physician review; `/about` policy describing a review pipeline nobody ran |
| | Paraphrase prospect language into tidy "customer-speak" | Wiebe: "as few 'summaries' or abstractions as possible" ([Copyhackers](https://copyhackers.com/2014/10/amazon-review-mining/)) |
| | Mine only 5-star reviews — **FEARS and OBJECTIONS live in the 2–3 star ones**, and they are half the output schema | Review-mining method, ibid. |
| | Put a real person's name, email or phone into the repo | GDPR/privacy; §5.3 |
| **LP-4 Keywords** | **Concatenate words into a compound seed.** "turmeric curcumin" understated turmeric **11×** (27.1K reported vs **301K** real US); "amla amalaki" **25×** (6.6K vs **165K** India) | **THE logged DataForSEO failure.** This row is the reason the Seed Provenance Rule (§2.1) exists |
| | **Sum a zero.** shilajit US=0 was reported while India showed 246K. **A zero is a finding to investigate, never a value to add up** | ibid. |
| | Pull India in English only — hi-IN Devanagari + Hinglish transliteration, or the document is **incomplete on its face** | ibid. |
| | Present a modelled tool estimate as measured ground truth. Google does not publish volumes; tools diverge | ibid. |
| **LP-5 Diagnosis** | Reuse the Search page for Meta. Different awareness stage = **structurally different page**, not a restyle | Schwartz ([awareness stages](https://www.kingeshop.com/en/customer-awareness-sophistication-eugene-schwartz)) |
| | Ship Level-2 copy ("authentic Kerala Ayurveda") into a **Level 4–5** market where every competitor says it | Schwartz sophistication ([mechanism](https://www.motiveinmotion.com/market-sophistication/)) |
| | Let page structure be taste. If a reviewer asks "why this shape?", `04-diagnosis.md` answers — or the stage was skipped | §3 LP-5 |
| **LP-6 Conversion map** | Ship without a thank-you page → no conversion signal → **Ads optimising blind** | KlientBoost mistake #6 "Forgetting your thank you page" ([ibid.](https://www.klientboost.com/landing-pages/landing-page-mistakes/)) |
| | Leave any node unowned, or an SLA unnamed. Enquiries nobody answers are worse than no LP | §3 LP-6 HALT |
| | **Optimise to form-fills on a high-ticket admission.** Without the offline loop returning to Ads, we buy junk leads at scale — efficiently | §3 LP-6; Hopkins' traced return ([Scientific Advertising](https://www.scientificadvertising.com/authors/hopkins/)) |
| | Fire `data-cta` before consent in DE/FR. That is a **compliance incident**, not a tracking bug | §5.3 |
| **LP-7 Offer** | Promise a guaranteed outcome, cure, or money-back cure | [Google — Unreliable claims](https://support.google.com/adspolicy/answer/15936857?hl=en) (refund policy + testimonial disclaimer required); **DMR Act = cognizable offence** (§5.2) |
| | Offer "authenticity/heritage" as the mechanism — it is the category's wallpaper | Schwartz L4–5; comp-set audit |
| | Reintroduce the "+21% money-back guarantee" figure | **No reachable primary source. Already excluded (§7 GAP 10) — do not reintroduce** |
| **LP-8 Will it sell** | Forecast using the Unbounce **6.6% median as if it were our number** — it is Unbounce customers, self-selected, tool-using marketers | [Unbounce CBR](https://unbounce.com/average-conversion-rates-landing-pages/); labelled placeholder only |
| | Convert an UNKNOWN into an estimate to complete the table. Write **UNKNOWN — ASK** | Hard Gate 6; §3 LP-8 |
| | Build a beautiful page to rescue a broken offer. **Say so, in writing** | Pushback duty, `CLAUDE.md` |
| **LP-9 Compliance** | Defer a claim to "soften later in staging" — clearance **before** it is written, or the design creates pressure to keep the claim | §3 LP-9 |
| | Name a DMR Schedule disease as something we treat | §5.2 |
| | Let "Deepu" (web developer) sign anything clinical. **Dr. Deepu John only. Never conflate** | `CLAUDE.md` |
| **LP-10 Wireframe** | Ship a nav menu or footer link farm | KlientBoost #3 "Including a navigation menu and footer"; Gardner |
| | Use **stock photography or AI-generated humans** on KTAHV | KlientBoost #16 "Stock photography"; **standing law** — real photography from the 798-image library |
| | Ship a **fake countdown / evergreen timer / fake scarcity**. Regulators fine this: **CMA v. Viagogo £400,000**; **AdoreMe $2.35M** multistate settlement; **Select Blinds $10M** for "fake slashed prices, perpetual discounts and fake countdown timers" | [Deceptive Patterns — Fake urgency](https://www.deceptive.design/types/fake-urgency) (Brignull). On a **health** page this is deception, platform violation *and* regulatory exposure simultaneously |
| | Bury the mechanism under adjectives | Schwartz L4–5; KlientBoost #11 "Burying your value proposition" |
| **LP-11 Copy** | Ship a line whose VoC cell is empty. **That cell is the gate** — an empty one is the agent talking to itself | §3 LP-11 |
| | Break message match to be clever | [Google — Misrepresentation](https://support.google.com/adspolicy/answer/6020955?hl=en): suspension **"upon detection and without prior warning"** |
| **LP-12 Build** | Ship without working `data-cta`. **A page without measurement is a brochure** | Hopkins' coupon; ship-blocker |
| | Sitemap or `llms.txt` an LP | §2.3; noindex asset |
| | Ship EN-only **silently**. Flag it, or ship all declared locales | `CLAUDE.md` |
| | Point an ad's final URL at a **forwarded domain** | [Destination requirements](https://support.google.com/adspolicy/answer/6368661?hl=en); `MIGRATION_PLAYBOOK.md` |
| **LP-13 Pre-flight** | Self-report success. No "done" without pasted machine output | Proof-of-Work rules, `CLAUDE.md` |
| | **Hand the GPT-5/Perplexity auditor an artifact pre-annotated with our own conclusions and treat its echo as independent verification** | **Our own logged failure.** The auditor must see the raw artifact |
| | Fix one instance and call it done — all locales, all templates, all page types | Proof-of-Work rules |
| **LP-14 Ship** | Change an LP URL without flagging **Vikash first** — live ads point at it | Doctrine (m) |
| | Publish the page and the ad on different days | Destination requirements (a live ad at a dead/unmatched page is a violation) |
| **LP-15 Measure** | Report **Quality Score as an auction input**. Google: *"Quality Score is not an input in the ad auction."* | [Google — Quality Score](https://support.google.com/google-ads/answer/6167118?hl=en). **Any report saying "QS determines CPC" is marked a hallucination at the audit gate** |
| | Report cost-per-form-fill as cost-per-lead | §3 LP-15 — the metric is **cost per *qualified* enquiry** |
| **LP-16 Test** | **Peek.** Checking after every observation turns a 5% false-positive rate into **26.1%** | [Evan Miller](https://www.evanmiller.org/how-not-to-run-an-ab-test.html) |
| | Run an underpowered test and call it evidence — **≈11,300 clicks** to detect even +20% on a 6.6% baseline **[derived, §1.5]** | Miller n=16σ²/δ². **An underpowered test manufactures false confidence and charges us for it** |
| | Expect most ideas to win — ~1/3 positive, ~1/3 flat | [Kohavi](https://www.abtasty.com/blog/1000-experiments-club-ronny-kohavi/); KlientBoost #17 "A/B testing without enough data" |
| **LP-17 Maintain** | Leave a dead campaign's page live — a stale offer on a live URL is an **Unreliable-claims exposure** | §3 LP-17 |
| | Amend this playbook by editing it quietly | LEARNINGS-driven PR only |

### 3.5.1 · OUR OWN FAILURES, MAPPED TO THE STAGE THAT NOW CATCHES THEM

**This is the design test case.** A pipeline that cannot demonstrate *which specific gate* stops a failure we have already committed is doctrine, not engineering. Each row names the catching gate and its **machine** evidence — because *"doctrine written in a .md file is ZERO evidence the rule was executed."*

| Our logged failure | Catching gate | Machine evidence that it ran |
|---|---|---|
| Invented compound seeds ("turmeric curcumin") — understated turmeric 11× | **LP-4** Seed Provenance Rule | Every keyword traces to a row in the committed raw export or a `02-voc.md` quote. **Unmatched seed = ship-blocker** |
| Summed implausible zeros (shilajit US=0) into cluster totals | **LP-4** | Zero-value assertion: any 0 halts and is investigated, never summed |
| Pulled India in English only | **LP-4** | Language-coverage declaration (en-IN + hi-IN + Hinglish) required on the face of `03-keywords.md` |
| Treated modelled estimates as measured fact | **LP-4 + LP-8** | Every volume/CPC figure carries query, locale, language, timestamp; forecasts label placeholders as placeholders |
| **Fabricated a physician review** (hardcoded build date as `lastReviewed` under a named BAMS physician) | **LP-9 + LP-13 check 11** | Claims register diffed against the live page; **Dr. Deepu John's signature + IST timestamp or the claim does not ship** |
| **Wrote a policy describing a process that does not exist** | **LP-9 + LP-13 check 15** | Every stage artifact `00`–`10` must exist in git. A described process with no artifact **is** the finding |
| **Claimed "Ask a doctor on WhatsApp" when the number reaches an AI chatbot** | **LP-6 + LP-9** | Conversion map names the **human owner and SLA** at every node; an unowned node halts the campaign |
| **Handed a fact-checker an artifact pre-annotated with our conclusions** | **LP-13 checks 17–18** | Auditors receive the raw artifact; **§3.5 DON'T (LP-13) is explicit** |
| **Declared a rule "binding" in a .md file whose enforcement was never built** | **§7 GAPS** | Gaps are listed as ❌ **with no gate**, not silently implied to exist. This document's own §7 is the instance |

---

## 4 · WHERE THE EXPERTS DISAGREE — AND WHO IS RIGHT FOR US

### 4.1 Attention ratio: Gardner's 1:1 vs. our WhatsApp reality
- **Gardner/Unbounce:** 1:1, "One Page. One Purpose. Period." ([glossary](https://unbounce.com/conversion-glossary/definition/attention-ratio/)).
- **The honest read of the evidence:** the glossary page cites **no study**. The CCD page offers a correlation across 20,000+ pages plus vendor case studies ([CCD](https://unbounce.com/conversion-centered-design/)). Correlational, vendor-published, with a product to sell.
- **CXL's counterpoint** applies with force: best practices are "someone's solution to the problem they had" ([CXL](https://cxl.com/blog/conversion-optimization-myths/)).
- **Independent corroboration found at re-verification (15 Jul 2026, §9).** KlientBoost's practitioner list of landing-page mistakes contains **both** *#1 "Too many conversion goals"* **and** *#7 "Using a single conversion path"* ([17 mistakes](https://www.klientboost.com/landing-pages/landing-page-mistakes/)). Those two coexist only under exactly the distinction we drew: **one GOAL, multiple PATHS to it.** A second named practitioner source therefore does not merely tolerate our deviation — it **prescribes** it, and treats a single forced path as a *mistake* in its own right.
- **Our ruling — split the principle from the dogma.** The *goal* discipline is well-supported and cheap to obey: **one goal, no navigation, no exits — hard rule.** The *button-count* dogma is weakly supported and, for an Indian and diaspora health audience where WhatsApp is the native channel, plausibly harmful. We permit multiple mechanisms serving one goal, and we **say out loud that this is a 3:1 attention ratio under Unbounce's own literal definition**, not a 1:1 we are pretending to hit. Honest deviation beats fake compliance — and hiding the deviation would be the exact "reported a comfortable number as fact" failure this pipeline exists to prevent. **Status upgrade:** with KlientBoost #7 on the record this is no longer a lone deviation requiring indulgence — it is a **contested best practice on which we have taken the better-evidenced side, in writing.** It still goes to Abilash for ratification (§6), but the burden of proof has moved.

### 4.2 Form fields: "fewer always" vs. Aagaard
- **Unbounce CCD:** "Reduce Friction" — optimise forms ([CCD](https://unbounce.com/conversion-centered-design/)).
- **Aagaard/CXL:** cutting 9 fields → 6 **hurt** conversions (the cut fields were the engaging ones); keeping 9 and **rewriting the labels** gave **+19.2%**. Elsewhere 11 → 4 gave **+160%** ([CXL](https://cxl.com/blog/reduce-form-fields/)). The two results are not reconcilable under a "fewer is better" rule — which is the finding.
- **Our ruling: Aagaard.** Field *count* is not the variable; the **friction of each ask** is. And our conversion goal is a **qualified enquiry**, not a form submit. A 3-field form on a KTAHV page maximises the metric we do not care about and floods reception with leads that cost salaried time. Ask what the physician actually needs to triage; write the labels so the ask feels reasonable; measure **cost per qualified enquiry**.

### 4.3 Page length: long vs. short
- **Practitioner evidence is genuinely contradictory:** Crazy Egg **+30%** from a **20× longer** page; Aagaard's gym chain won **shorter**; Pipedrive **+300%** signups **shorter** ([CXL](https://cxl.com/blog/long-form-or-short-form/)).
- **The academic resolution:** Fernbach, Sloman, St. Louis & Shube, *JCR* 39(5), 2013 — "explanation fiends" pay **more** after mechanistic detail; "explanation foes" **downgrade** products explained in detail, because detail "shatters their illusion of understanding"; the split tracks the cognitive reflection test ([JCR](https://academic.oup.com/jcr/article-abstract/39/5/1115/1794983)).
- **Our ruling: the question is malformed, and the peer-reviewed paper beats the case studies.** Our audience contains both types — and a ₹-lakh, 14–21-day residential medical decision recruits *maximum* deliberation, which skews us toward **fiends**. So: **long page, short path.** Full mechanism, protocol, physician credentials and pricing for the fiend; a decision-ready CTA above the fold for the foe. Length is not a variable to argue about; **awareness stage (LP-5) decides the structure and the paper tells us to serve both.**

### 4.4 "Test everything" (CXL) vs. "research before build" (Abilash)
- **CXL:** best practices are someone else's answer; test.
- **Abilash:** research the audience before you build.
- **Our ruling: Abilash — and the arithmetic proves it, which is why this is a finding and not a courtesy.** Detecting even a **+20% relative** lift on a 6.6% baseline needs **≈11,300 clicks** (§1.5 [derived]). CXL's advice is written for companies with that traffic; we do not have it per campaign. When you cannot buy certainty with traffic, **you buy it with research** — VoC mining (LP-3) is not a soft preliminary, it is our **substitute for statistical power**. This is also why underpowered "tests" are actively dangerous here: they hand us a number that feels like evidence and is not.

### 4.5 Abilash's AEO ruling vs. the noindex reality
- **Standing ruling:** AEO on every site, "should technically be the FIRST".
- **The documentation:** a page must be **indexed and snippet-eligible** to appear in AI Overviews/AI Mode ([Google](https://developers.google.com/search/docs/appearance/ai-features)); `noindex` drops it from Search entirely ([Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing)).
- **Our ruling: the ruling's *intent* is honoured by varying its *letter*.** Abilash's intent is that we never ship a site invisible to how people now find things. On a noindex LP, AEO work returns a documented zero — so **the AEO obligation transfers to the organic entity the campaign leans on** (Exception 2, §2.3) and must be scheduled there. **This variance is Abilash's to ratify** (→ DECISIONS.md; see §6). Doing AEO on an LP anyway would be running a rule without checking whether it applies — precisely the failure mode this pipeline was built to end.

---

## 5 · COMPLIANCE — HEALTH/WELLNESS CLAIMS ON PAID PAGES

**This is why LP-9 sits before the build.** Three regimes stack, and the strictest wins per locale.

### 5.1 Ad-platform policy (commercial risk: disapproval, suspension)

| Rule | Source |
|---|---|
| **Unreliable claims:** "Making inaccurate claims or claims that entice the user with an improbable result (even if this result is possible) as the likely outcome a user can expect is not allowed." Named examples include **"'Miracle cures' for medical ailments such as arthritis, diabetes, Alzheimer's disease, or cancer"**. Guaranteed results require "a clear and easily accessible refund (money-back) policy"; testimonials require "a visible disclaimer stating that there is no guarantee of specific results." Enforcement: **warning ≥7 days before suspension.** | [Google Ads — Unreliable claims](https://support.google.com/adspolicy/answer/15936857?hl=en) |
| **Healthcare & medicines:** prohibits products that "imply they're as effective as prescription drugs", and **non-government-approved products "marketed in a way that implies that they're safe or effective for use in preventing, curing, or treating a particular disease"**. Restricts **"Herbal and dietary supplements with active pharmaceutical or dangerous ingredients"** and "Products that have been subject to any government or regulatory action or warning." Speculative/experimental treatments banned. **Personalised-advertising restrictions apply to health topics** — no audience targeting on sensitive health interests. | [Google Ads — Healthcare and medicines](https://support.google.com/adspolicy/answer/176031?hl=en) |
| **Destination requirements:** landing page must be "functional, useful, and easy to navigate"; no AdsBot HTTP errors; no display/final URL domain mismatch; no cross-domain redirect from the final URL. | [Google Ads — Destination requirements](https://support.google.com/adspolicy/answer/6368661?hl=en) |
| **Misrepresentation:** ads must be "clear, honest"; do not promise things "unavailable or aren't easily found from the destination". **Suspension can occur "upon detection and without prior warning."** | [Google Ads — Misrepresentation](https://support.google.com/adspolicy/answer/6020955?hl=en) |
| **Meta:** ads "must not imply or attempt to generate negative self-perception or declare there is a perfect body type"; **side-by-side weight-loss comparisons prohibited**; weight-loss/cosmetic ads **restricted to 18+**; results must "reflect realistic outcomes over time". Meta's personal-attributes policy forbids implying knowledge of a user's health condition. | [Meta — Health and Wellness ad standards](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness/), [Meta — personal health](https://www.facebook.com/business/help/2489235377779939) |

**Practical consequence for KTAHV Meta ads:** no before/after Panchakarma imagery, no "struggling with your weight?" framing, no implying we know the reader's condition. **These are not stylistic preferences.**

### 5.2 India — the hard one 🔴

| Rule | Source |
|---|---|
| **Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954.** Prohibits advertisements of drugs/remedies claiming magical properties; **a cognizable offence**. The **Schedule lists 54 diseases/conditions** whose treatment may not be advertised — including **diabetes, cancer, tuberculosis, heart disease, high/low blood pressure, obesity, rheumatism, paralysis, epilepsy, sexual impotence, female sterility, leucoderma, glaucoma, cataract, deafness, blindness, tumours, gallstones/kidney/bladder stones, nervous debility, insanity, venereal diseases** and more. Penalty: **up to 6 months' imprisonment (with or without fine) on first conviction; up to 1 year on subsequent conviction.** Section 3 was amended to route Ayurvedic/Siddha/Unani claims through the Technical Advisory Board under s.33C of the Drugs and Cosmetics Act, 1940. | [Act text (India Code)](https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf) *(403 to our fetcher — schedule verified via [Wikipedia](https://en.wikipedia.org/wiki/Drugs_and_Magic_Remedies_(Objectionable_Advertisements)_Act,_1954), [Freyr](https://www.freyrsolutions.com/blog/the-significance-of-magical-drug-objectionable-indian-advertising-act-1954); **§7 GAPS: the Act text must be verified against the official PDF by a human before this playbook is ratified**)* |
| **ASCI:** all advertisements must be truthful; "all descriptions, claims and comparisons must be capable of substantiation"; ASCI Chapter 3 prohibits promoting products/services banned under Indian law. ASCI has an **MoU with the Ministry of AYUSH** and reports suspected DMR Act violations to it — **233 health ads flagged in one recent cycle**. | [PIB — AYUSH/ASCI MoU](https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=157548&reg=48&lang=2), [Medical Dialogues](https://medicaldialogues.in/news/industry/pharma/asci-flags-233-health-ads-for-dmr-act-violation-reports-to-ayush-ministry-149226) |
| **Rule 170, Drugs and Cosmetics Rules 1945** (pre-approval of ASU drug advertisements): **legally unsettled.** AYUSH notified its deletion 1 Jul 2024; the Supreme Court stayed that; the Court later **vacated the stay** and disposed of the IMA plea, with liberty to seek further relief. | [SCC Online](https://www.scconline.com/blog/post/2024/08/27/sc-stays-notification-omitting-rule-170-drug-rules-which-prohibited-ads-ayurvedic-drugs/), [LiveLaw](https://www.livelaw.in/top-stories/supreme-court-ministry-of-ayush-drugs-and-cosmetics-rules-1945-omission-of-rule-170-stayed-267763), [Medical Dialogues](https://medicaldialogues.in/news/health/misleading-medical-ads-case-sc-disposes-ima-plea-lifts-stay-on-ayush-ad-pre-approval-rule-153283) |

> 🔴 **ESCALATION — Rule 170.** Its status is contested and moving. **The agent must not decide whether pre-approval is currently required for a KAPPL/KTAHV ad claim.** This is a question for Indian counsel. → QUESTIONS.md. **Escalation rule: money, medical claims, legal/GST language → STOP and ask Abilash.**

**The operative KTAHV/KAPPL rule, and it is simple:** the DMR Act Schedule and the KTAHV banned-word list point at the same word — **"cure"**. The clinical register lock (patient, physician, treatment, programme, Panchakarma, admission, discharge, consultation) is not only GST-SCN hygiene; **on a paid page it is also DMR Act hygiene.** Describe the *programme*; never promise the *outcome*; **never name a Schedule disease as something we treat.**

### 5.3 US (FTC) and EU (GDPR)

| Rule | Source |
|---|---|
| **FTC Health Products Compliance Guidance (Dec 2022)** — replaces the 1998 Dietary Supplements guide. Health-benefit claims need **"competent and reliable scientific evidence"**: "tests, analyses, research, or studies… conducted and evaluated in an objective manner by experts… and generally accepted in the profession to yield accurate and reliable results." Generally this means **randomised, controlled human clinical trials**. **Animal and in vitro studies are not sufficient** without human RCT confirmation. Quality over quantity; no fixed number of RCTs. | [FTC](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance), [PDF](https://www.ftc.gov/system/files/ftc_gov/pdf/Health-Products-Compliance-Guidance.pdf), [Covington](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide) |
| **GDPR:** consent must be "freely given, specific, informed and unambiguous… by a statement or by a clear affirmative action." **No pre-ticked boxes.** Purposes must be **granular** — not bundled into one catch-all checkbox. Lawful basis for lead gen is typically consent or legitimate interests. | [DPO Centre](https://www.dpocentre.com/blog/lead-generation-and-the-gdpr-are-you-compliant/), [CNIL — consent](https://design.cnil.fr/en/concepts/consent/) |
| **Germany (DE locale):** the DSK's 2022 guidance established **double opt-in** as a requirement for email marketing, upheld in court. | [Dataships](https://learn.dataships.io/when-is-double-opt-in-required-for-compliance), [Suped](https://www.suped.com/knowledge/email-deliverability/compliance/which-countries-require-double-opt-in-for-email-marketing-according-to-gdpr-and-best-practices) |
| **France (FR locale):** CNIL requires consent to be "freely given, informed, specific, unambiguous, revocable and demonstratable"; CNIL now treats **email tracking pixels like cookies** — open-tracking generally needs prior consent. | [CNIL](https://design.cnil.fr/en/concepts/consent/), [CNIL recommendation summary](https://www.uniconsent.com/blog/cnil-email-tracking-pixels-recommendation) |

**Consequence:** the **German LP is the strictest build in the fleet** — granular consent, no pre-ticks, double opt-in on any follow-up email, Consent Mode v2 gating `data-cta`. Build the DE variant to the ceiling and the others inherit it.

### 5.4 The claims register (LP-9 artifact) — the compliance mechanism

| Claim (verbatim from page) | Substantiation | Source | DMR Schedule? | Google/Meta policy | Verdict | Reviewer + IST timestamp |
|---|---|---|---|---|---|---|

**Rules:** every claim is a row. Empty substantiation = **FAIL**. Any Schedule disease = **FAIL**. Anything clinical = **Dr. Deepu John signs** (never "Deepu" the web developer — never conflate). Pre-flight check 11 diffs the live page against this register.

---

## 6 · WHAT CHANGES IN ABILASH'S ORDER — THE RECONCILIATION

| Abilash's step | LP-track verdict |
|---|---|
| 1. Plan | **LP-1** — kept, sharpened to a signed mandate |
| 2–3. Understand + research the audience | **LP-2 + LP-3** — kept and **promoted**: VoC is the highest-leverage stage and our substitute for statistical power |
| 4. Keywords the audience uses | **LP-4 — INVERTED.** Not researched; **read** from the search-terms report. Governed by the Seed Provenance Rule |
| 5. SEO of the target audience | **§2.2 — REDEFINED.** Ad relevance + landing page experience → Ad Rank. Not ranking. (And QS is a *diagnostic*, not an auction input) |
| **6. CREATE SITE MAPS** | **LP-6 — TRANSLATED, and this is the fix for what we missed.** No sitemap exists on a one-page noindex asset; the thing it *does* — force architecture before build — becomes the **CONVERSION MAP**, incl. the thank-you page, CRM, human SLA, and the **offline conversion loop** |
| 7. Where keywords go in the sitemap | **LP-4 + LP-11** — message match: ad term → H1 → form |
| 8. Understand the company | **Folded into LP-1** — for an LP this is the offer + register + mechanism |
| 9. Likes/dislikes per audience | **LP-3 output schema** |
| 10. What makes it succeed | **LP-5 + LP-7** — awareness/sophistication diagnosis + mechanism |
| **11. WILL IT SELL?** | **LP-8 — PROMOTED to an arithmetic gate with a HALT.** Published break-even, not a judgement |
| 12–14. Needs / desires / fears | **LP-3 output schema** — not separate stages; the clusters the VoC table is written into |
| 15. Then build | **Phase D — but only after LP-9 compliance pre-clearance.** 🔴 **The one order change: compliance moves BEFORE the build**, because a bad claim in Indian Ayurvedic advertising is a cognizable offence (§5.2), not a QA finding |
| Staging → Publishing → Maintenance → Reviewing | **Phases E–F** — with Hopkins' rule enforced: no tracking, no page |
| *(AEO first, everywhere)* | **VARIED — §2.3/§4.5.** Proven inapplicable to a noindex page; obligation transfers upstream to the organic entity. **Needs Abilash's ratification** |

**Two decisions require Abilash's ratification before this playbook binds:**
1. **AEO is out of scope for `/lp/*`** (evidence: §2.3), and the campaign's AEO obligation transfers to the organic entity that the campaign borrows trust from.
2. **Attention ratio is enforced as "one goal / zero exits", not "one button"** (§4.1) — a knowing, documented deviation from Unbounce's literal 1:1.

---

## 7 · GAPS — no gate exists yet

| # | Gap | Proposed gate |
|---|---|---|
| 1 | **The Act text was not machine-verified.** India Code returned **403**; the TN mirror failed TLS. The DMR Schedule above is from secondary sources. | ❌ **A human must verify the DMR Act §3/§4/§7 + Schedule against the official PDF before ratification.** This document must not be treated as legal ground truth until then. → QUESTIONS.md |
| 2 | No test that `/lp/*` is absent from `sitemap.xml` and `llms.txt` | ❌ Add to factory spec |
| 3 | No test that a thank-you page exists and is noindex | ❌ Add to factory spec |
| 4 | No automated message-match diff (ad headline vs LP H1) | ❌ Needs an Ads export → script |
| 5 | No claims-register-vs-page diff (pre-flight check 11) | ❌ Build `scripts/lp-claims-lint.mjs` |
| 6 | No link-count/attention-ratio assertion | ❌ Add to factory spec |
| 7 | No gate that offline conversions return to Ads | ❌ Process, not code — needs a human owner |
| 8 | **Rule 170 status unsettled** — legal, not technical | 🔴 QUESTIONS.md → Indian counsel |
| 9 | CXL sources cited via search index (site 403s our fetcher) | 🟡 Re-verify via Perplexity auditor before ratification |
| 10 | Message-match "lift" numbers (>200%, 66%) unverifiable | ✅ Already excluded from this document — do not reintroduce |
| 11 | No Reddit primary sourcing | 🟡 **Stated honestly:** reddit.com is blocked to our user agent (`WebSearch`/`WebFetch` both refuse it), so **no r/PPC or r/marketing thread in this document is primary-sourced.** Practitioner voice here is Wiebe, Gardner, Aagaard, Laja, Miller and Kohavi — named, attributable, and better evidence than a thread. If Abilash wants Reddit specifically, it needs a human pull or a different tool. |

---

## 8 · SOURCES

**Canon:** [Schwartz — awareness + sophistication](https://www.kingeshop.com/en/customer-awareness-sophistication-eugene-schwartz) · [Schwartz — 5 stages applied](https://www.leadgen-economy.com/blog/five-stages-awareness-lead-generation/) · [Schwartz — unique mechanism](https://www.motiveinmotion.com/market-sophistication/) · [Hopkins — Scientific Advertising](https://www.scientificadvertising.com/authors/hopkins/) · [Hopkins — summary](https://growthsummary.com/book-summary/scientific-advertising/) · [Ogilvy — headline quote](https://www.goodreads.com/quotes/191457-on-the-average-five-times-as-many-people-read-the)

**Conversion practice:** [Copyhackers — review mining + Beachway](https://copyhackers.com/2014/10/amazon-review-mining/) · [Unbounce — attention ratio](https://unbounce.com/conversion-glossary/definition/attention-ratio/) · [Unbounce — Conversion-Centred Design](https://unbounce.com/conversion-centered-design/) · [Unbounce — message match](https://unbounce.com/conversion-glossary/definition/message-match/) · [Unbounce — Conversion Benchmark Report](https://unbounce.com/average-conversion-rates-landing-pages/) · [Unbounce — what's a good conversion rate](https://unbounce.com/landing-pages/whats-a-good-conversion-rate/) · [CXL — reduce form fields?](https://cxl.com/blog/reduce-form-fields/) · [CXL — long vs short](https://cxl.com/blog/long-form-or-short-form/) · [CXL — CRO myths](https://cxl.com/blog/conversion-optimization-myths/) · [CXL — maintaining scent](https://cxl.com/blog/give-your-advertising-roi-a-serious-boost-by-maintaining-scent/) · [KlientBoost — message match / Eisenberg](https://www.klientboost.com/cro/message-match/)

**Academic / research:** [Fernbach, Sloman, St. Louis & Shube — Explanation Fiends and Foes, *JCR* 39(5) 2013](https://academic.oup.com/jcr/article-abstract/39/5/1115/1794983) ([PDF](http://bear.warrington.ufl.edu/brenner/mar7588/Papers/fernbach-jcr-2012.pdf)) · [Evan Miller — How Not To Run An A/B Test](https://www.evanmiller.org/how-not-to-run-an-ab-test.html) · [Evan Miller — sample size](https://www.evanmiller.org/ab-testing/sample-size.html) · [Kohavi — Trustworthy Online Controlled Experiments](https://www.researchgate.net/publication/339914315_Trustworthy_Online_Controlled_Experiments_A_Practical_Guide_to_AB_Testing) · [Kohavi interview](https://www.abtasty.com/blog/1000-experiments-club-ronny-kohavi/) · [55/Deloitte/Google — Milliseconds Make Millions](https://web.dev/case-studies/milliseconds-make-millions) ([PDF](https://www.thinkwithgoogle.com/_qs/documents/9757/Milliseconds_Make_Millions_report_hQYAbZJ.pdf), [Deloitte](https://www.deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions.html))

**Platform primary docs:** [Google — Quality Score](https://support.google.com/google-ads/answer/6167118?hl=en) · [Google — Ad Rank](https://support.google.com/google-ads/answer/1752122?hl=en) · [Google — Destination requirements](https://support.google.com/adspolicy/answer/6368661?hl=en) · [Google — Destination mismatch](https://support.google.com/adspolicy/answer/16428020?hl=en) · [Google — Misrepresentation](https://support.google.com/adspolicy/answer/6020955?hl=en) · [Google — Unreliable claims](https://support.google.com/adspolicy/answer/15936857?hl=en) · [Google — Healthcare and medicines](https://support.google.com/adspolicy/answer/176031?hl=en) · [Google — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) · [Google — Block indexing (noindex)](https://developers.google.com/search/docs/crawling-indexing/block-indexing) · [Google — Robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) · [OpenAI — Overview of crawlers](https://developers.openai.com/api/docs/bots) · [Meta — Health and Wellness ad standards](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness/) · [Meta — personal health policy](https://www.facebook.com/business/help/2489235377779939)

**Compliance:** [FTC — Health Products Compliance Guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance) ([PDF](https://www.ftc.gov/system/files/ftc_gov/pdf/Health-Products-Compliance-Guidance.pdf)) · [Covington — FTC guidance analysis](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide) · [DMR Act 1954 — India Code](https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf) · [DMR Act — Schedule (secondary)](https://en.wikipedia.org/wiki/Drugs_and_Magic_Remedies_(Objectionable_Advertisements)_Act,_1954) · [Freyr — DMR Act analysis](https://www.freyrsolutions.com/blog/the-significance-of-magical-drug-objectionable-indian-advertising-act-1954) · [PIB — AYUSH/ASCI MoU](https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=157548&reg=48&lang=2) · [Medical Dialogues — ASCI flags 233 ads](https://medicaldialogues.in/news/industry/pharma/asci-flags-233-health-ads-for-dmr-act-violation-reports-to-ayush-ministry-149226) · [SCC Online — Rule 170 stay](https://www.scconline.com/blog/post/2024/08/27/sc-stays-notification-omitting-rule-170-drug-rules-which-prohibited-ads-ayurvedic-drugs/) · [LiveLaw — Rule 170](https://www.livelaw.in/top-stories/supreme-court-ministry-of-ayush-drugs-and-cosmetics-rules-1945-omission-of-rule-170-stayed-267763) · [Medical Dialogues — stay vacated](https://medicaldialogues.in/news/health/misleading-medical-ads-case-sc-disposes-ima-plea-lifts-stay-on-ayush-ad-pre-approval-rule-153283) · [DPO Centre — GDPR lead gen](https://www.dpocentre.com/blog/lead-generation-and-the-gdpr-are-you-compliant/) · [CNIL — consent](https://design.cnil.fr/en/concepts/consent/) · [CNIL email pixels](https://www.uniconsent.com/blog/cnil-email-tracking-pixels-recommendation) · [Dataships — double opt-in](https://learn.dataships.io/when-is-double-opt-in-required-for-compliance)

---

## 9 · INDEPENDENT RE-VERIFICATION LOG — 2026-07-15 18:41:07 IST

**Why this section exists.** This document was re-opened by a second agent pass and its load-bearing claims were **re-fetched from primary sources rather than accepted from the draft**. This is a direct application of our own logged failure — *"handing a fact-checking auditor an artifact pre-annotated with our own conclusions, then treating its echo as independent verification."* The correct antidote is not to ask an auditor whether the document is right; it is to **go back to the source and read it again.** What follows is the machine evidence of that re-read.

| Claim | Source re-fetched | Result |
|---|---|---|
| "a page must be indexed and eligible to be shown in Google Search with a snippet" — **the claim the entire AEO ruling (§2.3/§4.5) rests on** | [Google — AI features](https://developers.google.com/search/docs/appearance/ai-features) | ✅ **Verbatim match.** Page independently confirms `noindex` as a preview control |
| "Quality Score is not an input in the ad auction. It's a diagnostic tool…" + the three components | [Google — Quality Score](https://support.google.com/google-ads/answer/6167118?hl=en) | ✅ **Verbatim match**, all three component definitions |
| Peeking → **26.1%**; adjusted levels 2.9/2.2/1.4/1.0%; n=16σ²/δ² | [Evan Miller](https://www.evanmiller.org/how-not-to-run-an-ab-test.html) | ✅ **Verbatim match**, incl. the full peek table |
| Median **6.6%**; 41,000 pages / 464M visits / 57M conversions; **median not mean** | [Unbounce CBR](https://unbounce.com/average-conversion-rates-landing-pages/) | ✅ **Verbatim match**, incl. the stated reason for using median |
| Lead-gen **+21.6%** to form submission from 0.1s; 37 brands / 30M+ sessions / end-2019 | [web.dev — Milliseconds Make Millions](https://web.dev/case-studies/milliseconds-make-millions) | ✅ **Match.** Source independently confirms it is **observational, not randomised** — the caveat §1.4 already states |
| ChatGPT-User: "Because these actions are initiated by a user, robots.txt rules may not apply" | [OpenAI — crawlers](https://developers.openai.com/api/docs/bots) | ✅ **Verbatim match.** Exception 1 (§2.3) stands |
| Beachway: "If you think you need rehab, you do." → >400% clicks, >20% form submits; 500+ reviews in 2–3 hrs | [Copyhackers](https://copyhackers.com/2014/10/amazon-review-mining/) | ✅ **Verbatim match**, incl. the "as few 'summaries' or abstractions as possible" rule |
| Aagaard: 9→6 fields **decreased** conversions; label rewrite at 9 fields = **+19.2%** | CXL **403s our fetcher** — re-verified via independent search index | ✅ **Corroborated** (search also surfaces a −14% figure for the 9→6 cut, which this document does not claim). **§7 GAP 9 stands: still not primary-sourced** |

**⚠️ TWO CITATION-DRIFT CATCHES — recorded because they are the finding, not a footnote.**

1. **The "never send PPC traffic to your homepage" claim.** A search index attributed this to Unbounce and KlientBoost. **Both pages were fetched. Neither states it.** The Unbounce PPC-mistakes article covers keywords, budget, ad-to-page mismatch and buyer intent — **not** homepages; KlientBoost's 17 mistakes covers message match, **not** homepages. The claim is real practitioner lore and is probably true, but it **has no verified primary source in this document, so it is not in this document.** This is precisely the failure mode of the DataForSEO incident in miniature: *a plausible number/claim entering a document because a summary asserted it.* **Search-engine summaries are not sources. Fetch the page.**
2. **Attribution moved on the attention-ratio question.** §4.1's corroboration is cited to KlientBoost's list **as fetched**, not as summarised.

**What this log does NOT establish.** It verifies that this document's citations say what it says they say. It does **not** verify that the cited practitioners are *correct* — vendor-published and correlational evidence stays labelled as such throughout (§1.2, §4.1). And it does **not** touch the three ratification blockers below, none of which an agent can clear: **the DMR Act text is still unverified against the official PDF (§7 GAP 1), Rule 170 is still a live legal question (§7 GAP 8), and the two §6 variances are still Abilash's to ratify.** No amount of re-fetching converts those into green.

---

*Status: RESEARCH PASS — not ratified. Requires: (1) Abilash's ratification of the two variances in §6; (2) human verification of the DMR Act text (§7 GAP 1); (3) counsel on Rule 170 (§7 GAP 8). Amendments via LEARNINGS.md-driven PR only.*
*Re-verification pass 2026-07-15 18:41:07 IST — §3.5 DON'T column added (mandatory theme was missing); §4.1 upgraded on new evidence; §9 verification log added. Load-bearing claims re-fetched from primary sources; two citation-drift catches recorded in §9.*
