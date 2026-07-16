# Research → Content Site Playbook (Track A: Organic Content Websites)

**Status:** Research deliverable — proposed doctrine, **NOT ratified**. Nothing here is binding until Abilash ratifies the order and Dr. Deepu John ratifies the clinical governance model.
**Author:** research agent, Track A stage of the pipeline-revision commission.
**Written:** 2026-07-15 (IST). Second-precision timestamp is applied by the commit, not asserted here — see §0.4(b) for why.
**Scope:** Track A only (Next.js in-repo organic content sites: whatisayurveda.com, kairali.com, kairalicenters.com). Tracks B (Shopify) and C (landing pages) get sibling playbooks. The **stage spine is intended to be shared across tracks; the gates differ.**
**Primary case:** whatisayurveda.com — ~3,400 pages, "WebMD of Ayurveda", physician-reviewed, YMYL/health.
**Ratification required from:** Abilash (order + gates), Dr. Deepu John (clinical governance model).

---

## 0. How to read this document

### 0.1 The labelling contract
Every stage is labelled **`C1`…`C14`**. Every stage has a gate **`G1`…`G14`**. An agent working this track must state, at the start of a work session, **which stage it is entering and which gate it must pass to leave it.** That is the entire point of the labelling, per Abilash: steps must be clearly labelled and executed one at a time.

**Three rules override everything below:**

1. **A gate is passed with machine evidence, never with prose.** Doctrine written in a .md file is zero evidence the rule was executed. Every gate below names its **artifact** and its **check**.
2. **Never weaken a gate to make it pass.** Failing gate → fix the cause or escalate to `QUESTIONS.md`.
3. **Every number reported to the Director carries its source and its date.** This rule exists because of a real failure (§8.1).

### 0.2 The DO / DON'T contract (Abilash ruling, 15 Jul 2026)
Every stage carries **both** a DO list and a DON'T list. The DON'T list is not decoration — it is the mechanism by which average work is actually prevented, and it is what the auditor checks against. **Every DON'T here is drawn from a documented failure**, either a public one (cited) or one of ours (§8, on the record).

### 0.3 Evidence quality key — used on every substantive claim
- **[P]** — primary source, **fetched and read directly by this agent** in this session.
- **[S]** — secondary, or primary source read only via search-engine summary (direct fetch blocked/403). Weaker. Verify before betting on it.
- **[U]** — **UNVERIFIED.** Encountered but not confirmed. **Never cite to the Director as fact.**
- **[J]** — **JUDGEMENT.** My reasoning, not a sourced finding. Argue with it.

I have not marked anything **[P]** that I did not personally fetch. Where a fetch failed I say so rather than laundering the search snippet into a primary citation. Examine.com's grading page and Mayo's health-information policy both returned **HTTP 403** to this agent; both are therefore **[S]** below, and are flagged again in §10.

### 0.4 Two disclosures the reader must have before trusting this document

**(a) Reddit is hard-blocked to this agent — the commission's Reddit requirement is UNMET.**
The commission explicitly asked for r/juststart and r/SEO practitioner accounts. `WebFetch` on reddit.com returns *"Claude Code is unable to fetch from www.reddit.com"*; `WebSearch` returns no links for subreddit-scoped queries. **I verified this block myself this session rather than inheriting the claim from the prior draft.** I could not read a single Reddit thread first-hand.

I did **not** paper over this by quoting blogs that claim to summarise Reddit. Where a secondary source relays a forum anecdote it is marked **[U]** and is **load-bearing for nothing**. I substituted **named, attributable, first-party practitioner accounts** — Lily Ray/Amsive, HouseFresh, Animalz — which are *better* evidence than anonymous forum posts anyway. **If Abilash wants genuine Reddit mining it needs a human or a differently-configured fetcher.** → `QUESTIONS.md`.

**(b) This file already existed when I started, and I did not trust it.**
A 73KB draft of this exact deliverable was on disk from an earlier run. Per the commission's own warning about handing an auditor an artifact pre-annotated with our own conclusions and treating its echo as verification, **I re-ran the research independently and rewrote from my own fetches.** Where my findings match the prior draft, that is convergence, not confirmation. One inherited claim I checked and confirmed (the Reddit block). One thing I noticed and am flagging: **the prior draft's header claimed a creation timestamp of `2026-07-15 18:12:04 IST` while the file's mtime was 18:00** — a timestamp that could not have been true when written. Small, but it is exactly the class of fabricated-precision error this pipeline exists to catch, and it is why §0.3 exists and why this file's header no longer asserts a hand-typed second-precision time.

---

## 1. Reconciling Abilash's order with the evidence

Abilash's order is **substantially correct and I adopt its spine.** Its central insights — audience before keywords; keywords drawn *from* the audience's language; the sitemap as the place where keywords become architecture; psychology and commercial validation *before* the build — are supported by the evidence. The corrections below are offered under the pushback duty.

| # | Abilash's step | Verdict | Change and why |
|---|---|---|---|
| 1 | Plan | Keep | → `C1` |
| 2–3 | Understand / research the target audience | **Keep, strengthen** | → `C2`/`C3`. Needs a named method (VoC message mining), not vibes. |
| 4 | Keywords the audience uses | **Keep + hard gate** | → `C4`. **This is where we already failed once.** `G4` is the most important gate in this document. |
| 5 | SEO of the target audience | Keep, rename | → `C5` — SERP + information-gain analysis. "Can we win, and what is missing?" |
| 6 | **CREATE SITE MAPS** | **Keep — best call in the list** | → `C6`. Correctly identified as the missing step. **Upgraded: the sitemap must be *validated*, not just drawn.** |
| 7 | Where keywords go in the sitemap | Keep | → `C7`. Plus one-query-one-URL cannibalisation control and the link graph. |
| 8 | Understand the company you're building for | **MOVE — to the front** | ⚠️ **Too late at #8.** You cannot derive an audience or a topical map without first knowing *why this brand deserves to exist in the SERP at all.* Güneş calls this **"source context"** and makes it fundamental #1 — the map is *derived from* it [S]. → folded into `C1`. |
| 9–10 | Likes/dislikes; what makes it succeed for them | Keep | → folded into `C3`. |
| 11 | **WILL IT SELL?** | **Keep the instinct, reframe the question** | ⚠️ See §1.1. → `C8`. |
| 12–14 | Needs / desires / fears | **Keep — and promote** | These belong at `C3`, **before** keywords, not as a late check. |
| 15 | THEN build | Keep, constrain | → `C10`, and **only as a pilot cluster first**, never 3,400 pages. |
| — | Staging → Publishing → Maintenance → Reviewing | Keep, expand | → `C11`–`C14`. **On a health site, maintenance is the majority of the work, not an afterthought.** |
| — | *(missing)* | **ADD `G4` data-integrity gate** | The DataForSEO failure (§8.1) is **invisible** to this order. Nothing in steps 1–15 would have caught it. |
| — | *(missing)* | **ADD `C9` editorial system + claim register** | For an Ayurveda site the **Drugs and Magic Remedies Act, 1954** is a **criminal** statute, not a style preference (§7.2). Nothing in the order catches it. |
| — | *(missing)* | **ADD `C13` refresh/sunset** | Health content decays. 3,400 pages with no refresh budget is a **liability**, not an asset. |

### 1.1 Pushback: "WILL IT SELL?" is the wrong question for *this* site — but it is the right instinct

Abilash is right that commercial validation must precede the build. But whatisayurveda.com is classified in this repo as **non-revenue** (task #13, "first non-revenue rescue"). If we literally ask "will it sell?" of an encyclopedia page on *dosha*, the answer is "no" — and we would then either kill good pages or bolt selling onto reference content.

**Bolting selling onto reference content is precisely the pattern that got publishers destroyed.** Lily Ray's HCU analysis lists among the shared characteristics of hit sites: *"excessive ads that disrupt the user experience, such as video auto-play ads"* and *"excessive affiliate links, often without substantial content"* **[P]**. MedlinePlus will not even *link* to a site without *"a clear separation between educational content and advertising or sponsorship"*, gives *"preference … to pages with no advertising"*, and excludes sites designed primarily to *"sell or promote a product, service, or belief"* **[P]**.

**So: `C8` does not ask "will it sell?". It asks "what is this cluster's declared ROLE, and is that role defensible?"** Every cluster declares exactly one:

| Role | Meaning | Success metric | Monetisation allowed? |
|---|---|---|---|
| **TRUST** | Earns the right to be believed. Encyclopedia core. | Citations, brand search, AI citation share | **No.** Not even a soft CTA. |
| **BRIDGE** | Legitimately connects a reader need to a Kairali capability | Qualified referral to KTAHV/KAPPL | One contextual, honest, disclosed link |
| **DEMAND** | Genuinely commercial intent | Conversion | Yes, disclosed |

**The Director-facing version of the answer:** the site sells by *being believed*. A TRUST page's job is to make the BRIDGE credible. Strip the TRUST layer of its independence to monetise it and you destroy the asset that makes the BRIDGE worth anything. That is the HCU lesson, and it is why "will it sell?" must not be asked page-by-page on this site.

### 1.2 Pushback: AEO-first is right in *sequence*, but "AEO" is not a separate discipline to bolt on

The standing ruling is that AEO "should technically be the FIRST" thing. **I agree with the sequencing and will defend it** — but with a correction on what it means, because the wrong reading produces a schema-stuffing checklist and nothing else.

The strongest evidence is that AEO and quality have **converged**. Animalz's position: the web is saturated with content that is *"technically accurate, reasonably well-structured, and completely indistinguishable from everything else covering the same topic"*, and AI platforms *"cite sources that offer something distinctive — original data, clear expertise, specific perspective — over sources that aggregate and restate existing information"* **[S]**. Google's own patent, *"Contextual estimation of link information gain"* (US20200349181A1, filed Oct 2018, published Nov 2020), scores *"additional information that is included in the given document beyond information contained in other documents that were already presented to the user"* **[S]** — note: **Google has never confirmed this is in production; treat it as a design principle, not a ranking fact** **[S]**.

**Ruling for our case [J]:** AEO-first means **the answerability of the page is designed at `C5`/`C9`, before a word is written** — one page answers one question, the answer is extractable, it is attributable to a named reviewer, and it contains at least one thing not obtainable from the other results. It does **not** mean schema markup is the lever. Schema is `C10` plumbing. **A site whose only AEO work is JSON-LD has done no AEO work.**

### 1.3 The tension this whole playbook has to resolve: topical coverage vs. scaled content abuse

These two doctrines point in opposite directions, and the resolution *is* the playbook:

- **Güneş:** topical authority = topical coverage + historical data; cover **all** semantic variations and subtopics of the niche **[S]**. → *build 3,400 pages.*
- **Google:** *"Scaled content abuse is when many pages are generated for the primary purpose of manipulating search rankings and not helping users"* **[P]**. → *3,400 pages is the shape of the crime.*

**They are not actually in conflict, and the distinguishing variable is stated in Google's own policy text: PURPOSE — not volume, and not method.** Google's policy is explicit that the trigger is *"producing content at scale to boost search ranking"*, *"whether automation, humans or a combination are involved"* **[S: blog.google]**. Nowhere does the policy name a page count. The listed examples are all purpose-and-value failures **[P]**:

> - *"Using generative AI tools or other similar tools to generate many pages without adding value for users"*
> - *"Scraping feeds, search results, or other content to generate many pages (including through automated transformations like synonymizing, translating, or other obfuscation techniques), where little value is provided to users"*
> - *"Stitching or combining content from different web pages without adding value"*
> - *"Creating multiple sites with the intent of hiding the scaled nature of the content"*
> - *"Creating many pages where the content makes little or no sense to a reader but contains search keywords"*

**Every single one turns on "without adding value" / "little value" / "makes little or no sense to a reader."** Volume is not the offence. **Volume without per-page value is the offence.**

**Therefore the governing rule of this entire playbook [J]:**

> **Scale the SYSTEM, never the CONTENT.** Templates, briefs, data pipelines, review workflow, link graph, QA — all of that is industrialised and can serve 3,400 pages. **The per-page value contribution is never templated and never generated.** If a page's only reason to exist is that the topical map has a slot for it, **the map is wrong and the page does not get built.**

This is also the honest answer to Abilash's "extreme content-driven website" framing: **the extremity belongs in the rigour, not the page count.** 3,400 pages is an output of the method, never a target of it. **[J] — and this is the single most important sentence in the document.**

---

## 2. The named-practice base (what we are actually building on)

| Practice | Who | What we take | Cite |
|---|---|---|---|
| Topical authority / topical maps | Koray Tuğberk Gubur | Topical authority = topical coverage + historical data. Five fundamentals: **source context** (why your brand is needed on the SERP), **central entity**, **central search intent** (= source context + central entity unified), **core section** (where ranking signals and monetisation concentrate), **outer section** (supplies historical data and trust signals). | [S] |
| Scaled content abuse policy | Google | Purpose test, not volume test. Verbatim policy language above. | [P] |
| Helpful-content self-assessment | Google | The Who/How/Why framework + question battery. Becomes our `G10` checklist. | [P] |
| HCU failure anatomy | Lily Ray / Amsive | The empirical list of what hit sites had in common. Becomes our DON'T spine. | [P] |
| Health editorial governance | Healthline | Four-timestamp model; Medical Network; no-genAI policy. | [P] |
| Health editorial governance | Mayo Clinic | ~100 medical editors from 5,000+ physicians/scientists; **fast-moving topics reviewed at least every two years**; COI disclosure published with content. | [S] |
| Health content standard | NHS digital service manual | Six named requirements; clinical approval; planned review cycle; WCAG 2.2 AA; reading age 9–11. | [P] |
| Inclusion criteria | MedlinePlus / NLM | What a *librarian* requires before linking to you. Our external-credibility bar. | [P] |
| Evidence grading | Examine.com | A–F letter grades applied **per outcome**, not per intervention. | [S] |
| Information gain | Google patent US20200349181A1 / Animalz | Differentiation as the unit of value. | [S] |

---

## 3. THE STAGES

Notation per stage: **Purpose · Method · DO · DON'T · GATE (artifact + machine check).**

---

### `C1` — Source context, brand, and plan
**Purpose:** Establish *why this site deserves to exist in the SERP at all* before anything else. This is Abilash's step 8, moved to the front.

**Method:** Güneş's **source context**: the purpose of the site on the SERP, brand identity, why it is being created, and the monetisation method **[S]**. Then the **central entity** (Ayurveda) and the **central search intent** (source context + central entity unified) **[S]**.

**DO**
- Write source context as one paragraph that survives the question *"why you and not Wikipedia / WebMD / AYUSH?"*
- Name the **central entity** and the **stewardship claim**: Kairali is a 100+ year Ayurvedic group with an NABH hospital and WHO-GMP manufacturing. **That is real first-hand experience** — the "E" in E-E-A-T that no content farm can buy. It is our only durable moat.
- Declare monetisation **now**, honestly (§1.1 roles).
- Declare the **non-goals**. Write down what this site will refuse to do.

**DON'T**
- ❌ Don't start from "3,400 pages". That is a page count, not a plan. Google's own question: *"Are you producing lots of content on many different topics in hopes that some of it might perform well in search results?"* **[P]**
- ❌ Don't enter topics for traffic. Google: *"Did you decide to enter some niche topic area without any real expertise, but instead mainly because you thought you'd get search traffic?"* **[P]**
- ❌ Don't claim expertise the group does not have. Amsive found hit sites *"often lacked named authors, any indication of author biographies, no evidence of a real staff or experts"* **[P]** — we have the opposite problem available to us; use it, don't fake it.

**`G1` GATE** — artifact `docs/whatisayurveda-inputs/source-context.md` containing: source-context paragraph, central entity, central search intent, monetisation declaration, non-goals, and the **experience claim with evidence** (NABH cert, WHO-GMP cert, named physicians). **Check:** each experience claim links to a verifiable artifact. **A claim with no artifact fails the gate.**

---

### `C2` — Understand the audience (who)
**Purpose:** Identify the actual humans, before any keyword tool is opened.

**DO**
- Segment by **relationship to Ayurveda**, not demographics: skeptical-curious Westerner; diaspora returning to tradition; Indian domestic user for whom Ayurveda is default; practitioner/student; patient with a named condition seeking an alternative after conventional treatment disappointed them.
- Segment by **language reality**, per market. This is a gate input for `C4` (§8.1).
- NHS standard #4: *"Focus on user needs"*; and *"Consult with the people who are going to use your content"* **[P]**.

**DON'T**
- ❌ Don't invent personas from imagination. A persona with no quoted source is fiction.
- ❌ Don't assume the audience speaks the language you searched in. **This is failure §8.1(c) and it cost us a 25x understatement.**
- ❌ Don't collapse "India" into one audience.

**`G2` GATE** — artifact `audience-segments.md`: each segment carries ≥5 **verbatim quotes with source URLs**, and a declared language/script set. **Check:** zero segments with zero quotes. **[J] — a persona without quotes is the "vibes" failure the commission is trying to kill.**

---

### `C3` — Research the audience: needs, desires, fears (Abilash 12–14, promoted)
**Purpose:** Get the audience's **actual language and actual fears** — the raw material for both keywords and copy.

**Method:** Voice-of-customer message mining. Harvest **verbatim** language from: our own enquiry inbox and WhatsApp logs, KTAHV patient feedback, Clarity session recordings, YouTube comments, forums, reviews, `People Also Ask`.

**DO**
- Record language **verbatim**. The exact words are the deliverable; paraphrase destroys it.
- Mine **fears explicitly** — for Ayurveda the recurring ones are predictable and load-bearing: *"is it safe?"*, *"heavy-metal contamination"*, *"will it interact with my prescription?"*, *"is this pseudoscience?"*, *"will they upsell me?"* **[J]**
- Treat **objections as content**. The skeptic's objection is the highest-information-gain page on the site, because almost nobody in this niche writes it honestly.
- Empathy is a **named editorial standard**, not a soft skill: Healthline's pillars include *"prioritizing accuracy, empathy, and accessibility"* **[P]**.

**DON'T**
- ❌ **Don't let the agent write the personas' quotes.** Sourced or absent.
- ❌ Don't mine only English sources for a multi-language audience (§8.1(c)).
- ❌ Don't sanitise the fears. A page that won't say the words "heavy metals" is not answering the question, and the reader will leave to find someone who will — Google's test: *"Does your content leave readers feeling like they need to search again to get better information from other sources?"* **[P]**
- ❌ Don't confuse *our* desired message with *their* need.

**`G3` GATE** — artifact `voc-corpus.md` + `voc-quotes.csv` (quote, source URL, date, language, segment). **Check:** ≥100 rows; every row has a resolvable URL; ≥2 languages for the India segment. **Machine check, not eyeball.**

---

### `C4` — Keyword & demand research ⛔ **THE HARD GATE**
**Purpose:** Size real demand in the audience's real language. **This is the stage where we have already failed once, in a way that reached the Director as fact.** Read §8.1 before entering `C4`.

**Method:** Seeds come **only** from `C3`'s VoC corpus (single entities and real user phrasings) — never from an agent's imagination. Pull per **market × language × script**. Cross-check across ≥2 independent sources. Reconcile or flag every implausible value.

**DO**
- Derive every seed from a **quoted** VoC row or an autocomplete/PAA capture. **Seed provenance is a required column.**
- Pull **per language and per script** for India: English, Hindi (Devanagari), **Hinglish (Roman-script Hindi)** — and the vernaculars the segment actually uses.
- Treat every tool volume as a **modelled estimate**, never measurement. Google does not publish real volumes; tools diverge.
- Apply a **plausibility challenge to every zero and every outlier**. A globally-known herb showing 0 in a major market is a *bug hypothesis*, not a finding.
- Report ranges and disagreement between sources, with the pull date.

**DON'T** *(every one of these is one of ours — §8.1)*
- ❌ **Don't invent compound seeds.** "turmeric curcumin", "amla amalaki", "tulsi holy basil" are things nobody types. This understated turmeric **11x** and amla **25x**.
- ❌ **Don't sum zeros into a total.** A zero you have not explained is missing data. Summing it silently converts ignorance into a number, and the number then gets briefed as fact.
- ❌ **Don't pull a multilingual market in one language.**
- ❌ **Don't present modelled estimates as measured ground truth.**
- ❌ **Don't report a total to the Director without its per-row provenance.**
- ❌ Don't let volume alone drive the map. High volume + zero information gain = a page that should not exist.

**`G4` GATE — the most important gate in this document.**
Artifact: `keyword-map.csv` — required columns: `query, market, language, script, volume, source, pull_date, seed_provenance, plausibility_flag, cross_check_source, cross_check_volume, delta_pct`.

**Machine checks (all must pass; script-enforced, not eyeballed):**
1. **Zero-plausibility check** — any row with `volume == 0` for a term with non-zero volume in any other market **HALTS** and requires an explicit written explanation. No explanation → the row is excluded from every total, and the total is labelled incomplete.
2. **Compound-seed check** — any seed containing two known entity names (`turmeric` + `curcumin`) is **rejected** unless `seed_provenance` cites a real user utterance.
3. **Language-coverage check** — India rows must contain ≥2 scripts, or the pull **fails**.
4. **Cross-source check** — any `delta_pct > 50%` between two sources is surfaced in the report, not averaged away.
5. **No-bare-totals check** — any aggregate in a Director-facing document must carry source + pull date + row count + excluded-row count.
6. **Estimate labelling** — the word "searches" never appears without "estimated" and the tool name.

**[J] The acceptance test for `G4` is simple, and it should be a CI fixture: replay our own 2026 DataForSEO pull through it. If it does not HALT on shilajit US = 0 and REJECT "turmeric curcumin", the gate is decorative.**

---

### `C5` — SERP reality + information gain ("can we win, and what's missing?")
**Purpose:** Decide, per cluster, whether we can win and **what we will add that does not already exist.**

**DO**
- Read the actual SERP per head term: who ranks, what page type, is it dominated by unassailable entities (Mayo, NHS, WebMD, government), is it AI-Overview-answered already.
- **Name the information gain per cluster, in writing, before building.** The patent's construct: information *"beyond information contained in other documents that were already presented to the user"* **[S]**.
- **Our legitimate gain sources — this is the honest list [J]:**
  - Classical-text grounding with **real citations to named texts and verses** (Charaka, Sushruta, Ashtanga Hridaya) — most English Ayurveda content asserts without citing.
  - **Clinical practice reality** from an NABH hospital: what a Panchakarma admission *actually* involves, day by day.
  - **Manufacturing reality** from WHO-GMP: what quality control actually means for a bhasma.
  - **Honest negative findings.** Where the evidence is weak, say so. Almost nobody in this niche does. **This is our single biggest differentiator and the most defensible one.**
  - Sanskrit ↔ botanical ↔ common-name entity resolution done properly.
- Grade evidence **per outcome**, not per herb — Examine's model: letter grades A–F apply *per outcome*, and one intervention can have no effect on one outcome and a good effect on another **[S]**.

**DON'T**
- ❌ Don't build a page whose gain statement is "a comprehensive guide to X". That is not gain; that is the definition of the indistinguishable content Animalz describes **[S]**.
- ❌ Don't enter SERPs owned by Mayo/NHS/MedlinePlus with a thinner version of their page. You will lose, and the attempt is exactly the "cover every topic in the niche" pattern Amsive found across hit sites **[P]**.
- ❌ Don't claim testing or expertise you didn't do. HouseFresh's documented accusation against big publishers is precisely that they peppered pages with references to a *"rigorous testing process"*, a *"lab team"*, and *"complicated methodologies"* without actually testing **[S]**. **We must not become the thing that story is about.**
- ❌ Don't grade an herb "effective" as a blanket statement.

**`G5` GATE** — artifact `cluster-briefs/<cluster>.md`, each containing a **one-sentence information-gain statement** and a SERP-winnability verdict. **Check:** no cluster proceeds with an empty or generic gain statement. **[J] This gate alone would kill a large fraction of a naive 3,400-page map — that is the gate working, not the gate failing.**

---

### `C6` — **CREATE THE SITE MAP** (Abilash's best call; the step we skipped entirely)
**Purpose:** Turn demand + gain into **architecture**. This is where keywords become a site.

**Method:** Güneş's core/outer split **[S]**:
- **Core section** — where ranking signals and monetisation concentrate. For us: the clusters carrying the BRIDGE role and the central entity's spine.
- **Outer section** — supplies historical data and trust signals. For us: the encyclopedic breadth that proves we know the whole domain.

Then **validate the map with users** — tree testing (findability without visual design) before a line of code.

**DO**
- One page = one **entity** or one **question**. Never "and".
- Bidirectional hub↔spoke linking; **cluster page ≤3 clicks from pillar, pillar ≤2 clicks from home** [S]; spoke↔spoke links within a subtopic group [S].
- Design the **URL taxonomy once**, at `C6`, and treat it as near-permanent.
- Plan the **entity-resolution layer** (Sanskrit / botanical / common name) as architecture — it drives canonical and alias decisions.
- Map every legacy URL to KEEP / MERGE / 301 **before** any flip — repo Build Decision Matrix #2.
- Declare which sections are **core** and which are **outer**, explicitly.

**DON'T**
- ❌ **Don't build the map from the keyword tool's output shape.** The tool returns a list; a list is not an architecture.
- ❌ Don't create a page per keyword variant. That is cannibalisation, and it is Google's *"Creating many pages where the content makes little or no sense to a reader but contains search keywords"* **[P]**.
- ❌ Don't orphan pages. On a 3,400-page site, internal linking *"quietly decides what Google crawls, what it indexes, and what ranks"* [S].
- ❌ **Don't ship a map nobody tested.** An untested map is a hypothesis wearing a diagram's clothes.
- ❌ Don't let the map's empty slots commission content (§1.3).

**`G6` GATE** — artifacts `sitemap.yaml` (every node: URL, role core|outer, cluster, parent, click-depth, intent, primary query, gain statement) + `tree-test-results.md`. **Machine checks:** zero orphans; max depth ≤3 from pillar; **every node resolves to a `C5` gain statement**; zero duplicate primary queries; legacy protection map complete with single-hop targets.

---

### `C7` — Keyword → sitemap assignment
**Purpose:** Bind each query to exactly one URL and design the link graph.

**DO**
- **One query → one URL.** Maintain the map as the cannibalisation control.
- Assign the **internal link graph in the map**, not ad hoc during writing.
- Plan anchor-text variety centrally.

**DON'T**
- ❌ Don't assign the same head term to two URLs "to see which wins".
- ❌ Don't leave internal linking to writers' discretion at 3,400-page scale — it becomes random.
- ❌ Don't over-optimise anchors. Amsive's hit-site list includes *"excessive SEO-driven keyword patterns, such as using highly templated <title> tag patterns; excessive use of the year in the title"* **[P]**.

**`G7` GATE** — `keyword-assignment.csv` + generated link-graph. **Checks:** zero duplicate primary queries; zero orphans; every page has ≥1 inbound contextual link from its cluster.

---

### `C8` — Commercial / role validation (Abilash's "WILL IT SELL?", reframed — §1.1)
**Purpose:** Prove each cluster's role is defensible **before** the build.

**DO**
- Declare exactly one role per cluster: **TRUST / BRIDGE / DEMAND**.
- Show the path from TRUST → BRIDGE → Kairali capability, and be able to defend it to a skeptical reader.
- Keep TRUST clusters **commercially clean**.

**DON'T**
- ❌ Don't monetise a TRUST page. Ever. (§1.1; MedlinePlus criteria **[P]**; Amsive **[P]**.)
- ❌ Don't build a cluster with no role.
- ❌ Don't let the BRIDGE overstate what the hospital can do. That is where YMYL harm and Indian criminal advertising law meet (§7.2).

**`G8` GATE** — `cluster-roles.md`; **check:** every cluster in `sitemap.yaml` has exactly one role; every TRUST cluster is flagged no-CTA and this is **asserted by the build lint at `G10`, not by a promise here.**

---

### `C9` — Editorial system + claim register **(added; not in Abilash's order)**
**Purpose:** Build the machinery that makes 3,400 pages governable — **before** page 1. This is the stage that separates a reference site from a content farm.

**Method — steal from the institutions; they published their processes.**

**The four-timestamp model (Healthline) [P]** — adopt verbatim as our data model:
- `writtenOn` — original publication
- `medicallyReviewedOn` — each time medical experts review
- `factCheckedOn` — professional fact-checker verification
- `updatedOn` — modifications to improve reader value

**Reviewer pool (Mayo)** — 100+ medical editors drawn from 5,000+ physicians and scientists, reviewing in their **area of specialty**, with **published COI disclosures** [S]. Our scaled-down version: the physician roster is **config, not hard-code** (per repo memory), each reviewer has a declared specialty scope, and **no reviewer signs outside their scope**.

**Process (NHS, six requirements) [P]** — adopt as our checklist:
1. *"Design a clear process for creating content and follow it"*
2. *"Use relevant, up to date and recognised clinical evidence"*
3. *"Comply with relevant laws and regulation"*
4. *"Focus on user needs"*
5. *"Make your content easy to use"*
6. *"Make your content inclusive and accessible"*

Plus: *"Get clinical and other relevant subject matter experts to review and approve content"*, *"Keep a record of sources of evidence you use"*, and *"Have a planned review cycle for all content so you keep it up to date and clinically accurate"* **[P]**.

**The claim register (ours — and the highest-stakes artifact on the site) [J]:** every therapeutic claim on the site is a **row in a register** — claim, page, evidence grade, evidence source, reviewer, review date, legal status, `dmr_schedule_flag`. **A claim not in the register cannot be published.** See §7.2 for why this is a criminal-law requirement, not a nicety.

**DO**
- Build the review **workflow and its data model** before the content.
- Make reviewer identity, credential, specialty, and **date** structurally present on the page.
- Record evidence sources per claim (NHS **[P]**).
- Separate **fact-check** from **medical review** — different jobs; Healthline timestamps them separately **[P]**.
- Write a style guide with a **reading-age target**. NHS: short sentences up to 20 words, paragraphs up to 3 sentences, **reading age 9–11** [S]. **[J] For a site explaining Sanskrit-derived concepts to a lay audience, this is harder and more important than anywhere else in our fleet.**

**DON'T** *(these are ours — §8.2, and they are the most serious things in this document)*
- ❌ **NEVER emit a review date that is not a real review.** We hardcoded a build date as `lastReviewed` under a named BAMS physician on every page. **That is a fabricated professional endorsement of medical content** — it forges a named clinician's sign-off, at scale, on YMYL pages.
- ❌ **NEVER write a policy describing a process that does not exist.** We shipped an `/about` editorial policy detailing a review pipeline nobody ran — plausible, well-formed, and false. **A policy page is a claim about reality and is fact-checkable like any other page.**
- ❌ **NEVER describe a capability we don't have.** We claimed "Ask a doctor on WhatsApp" where the number reached an **AI chatbot**. On a health site that is a safety claim, not a marketing claim.
- ❌ Don't let a reviewer sign outside their specialty (Mayo's model is specialty-scoped [S]).
- ❌ Don't publish generated content into the medical layer. Healthline: *"All our health information is created by humans for humans, and we do not publish content developed using generative AI tools"* **[P]**. (§9.2 — I do **not** recommend copying this rule wholesale; I recommend a narrower one. But we must make the choice deliberately and state it publicly.)

**`G9` GATE** — artifacts: `editorial-policy.md`, `style-guide.md`, `reviewer-roster.yaml` (with specialty scopes), `claim-register.csv`, and the **review workflow implemented in code**.

**Machine checks:**
1. **`lastReviewed` cannot be populated except by a recorded review event with a reviewer ID. Build fails otherwise.** *(Not optional. This is the direct fix for §8.2(a) and it must exist in code before a single page ships.)*
2. Every reviewer ID in output resolves to a roster entry with a matching specialty scope.
3. Every therapeutic claim on a page resolves to a claim-register row.
4. **Every statement in `editorial-policy.md` maps to an implemented, evidenced mechanism.** A policy sentence with no mechanism is a `G9` failure.

---

### `C10` — Build — **pilot cluster only**
**Purpose:** Prove the whole system on a small, real slice before industrialising. Abilash's step 15 — constrained.

**DO**
- Build **one cluster end to end** — pillar + 8–12 spokes — and run **every** downstream gate on it.
- Use the brief as the **anti-generic instrument**: it must specify the gain, the VoC language, the claims (from the register), the reviewer, the internal links, and the **one thing this page says that no competitor says**.
- Self-assess against Google's battery **[P]**, honestly: *"Does the content provide original information, reporting, research, or analysis?"*; *"Does the content provide insightful analysis or interesting information that is beyond the obvious?"*; *"If the content draws on other sources, does it avoid simply copying or rewriting those sources, and instead provide substantial additional value and originality?"*; *"Would you expect to see this content in or referenced by a printed magazine, encyclopedia, or book?"*; *"Is this the sort of page you'd want to bookmark, share with a friend, or recommend?"*
- Answer Google's **Who / How / Why** structurally **[P]**: bylines where expected; *"Is the use of automation, including AI-generation, self-evident to visitors through disclosures or in other ways?"*; purpose = *"creating content primarily to help people"*.

**DON'T**
- ❌ **Don't build 3,400 pages before the gates have ever run on 12.**
- ❌ Don't template the value contribution (§1.3).
- ❌ Don't write to a word count. Google, verbatim: *"Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)"* **[P]**
- ❌ Don't use stock photography as the visual layer — on Amsive's hit-site list twice: *"stock photography or images taken from others' social media accounts"* and *"excessive stock photography and lacked original images"* **[P]**. **We have a hospital, a factory, and a villa. We can photograph real things. Almost no competitor can.**
- ❌ Don't summarise others. Google: *"Are you mainly summarizing what others have to say without adding much value?"* **[P]**

**`G10` GATE** — pilot cluster passes: build clean; schema valid; **`lastReviewed` provenance check**; claim-register coverage; TRUST-cluster no-CTA lint; WCAG 2.2 AA **[P]**; reading-age check; **design-critic ≥9**; GPT-5 auditor PASS (`scripts/audit-gpt.mjs`, exit 2 on FAIL); Perplexity fact-grounding PASS. **The 3,400-page programme does not start until `G10` is green on the pilot.**

---

### `C11` — Staging
**DO** — full gate suite on staging; fetch the staged page and **diff against intent**; all locales the brief requires.
**DON'T** — ❌ don't declare done from a local build; ❌ don't fix one instance and call the class fixed (grep all instances, all page types, all locales); ❌ don't write to production (hard gate).
**`G11` GATE** — staging URL that opens + pasted spec output + diff.

---

### `C12` — Publishing / cadence
**Purpose:** Decide how 3,400 pages actually reach the index. **Experts genuinely disagree here — see §9.1.**

**Ruling for our case [J]: phased, cluster-by-cluster — but *not* for the reason usually given.** Google's position is that there is no SEO penalty for publishing large volumes at once **[S]**, and I accept that. We phase because:

1. **Our review capacity is the real constraint.** Physician review cannot be parallelised to 3,400 pages. **The publishing rate is a function of the review rate, and the review rate is a fact about humans, not about Google.** This reason is sufficient on its own.
2. **A new domain's pages may not all be indexed at once anyway** — for an unproven domain Google may *"initially index only a portion"* until overall quality is clear [S].
3. **Phasing is our own error-containment.** If cluster 1 is wrong, we've published 12 pages, not 3,400.

**DO** — publish by complete cluster (pillar + spokes together, so the internal link graph is whole on arrival); hold the rate at the physician-review rate; monitor indexation per cluster.
**DON'T** — ❌ don't drip-feed to "look natural" — that is cargo cult, not evidence [S]; ❌ **don't publish faster than you can review** — that is how §8.2(a) happened; ❌ don't publish a spoke whose pillar isn't live.
**`G12` GATE** — per-cluster publish record + indexation check + post-publish fetch/diff.

---

### `C13` — Refresh & sunset **(added; not in Abilash's order)**
**Purpose:** Keep 3,400 pages from decaying into the exact liability that gets sites hit.

**DO**
- **Planned review cycle for all content** (NHS **[P]**). Benchmark: Mayo reviews fast-moving topics — diseases, conditions, diagnostic tests, procedures — **at least every two years** [S].
- Monitor for evidence changes and update (NHS **[P]**; Healthline's Medical Integrity team monitors *"changes in standards of care, new clinical guidelines, drug approvals or recalls"* **[P]**).
- **Display last-reviewed and next-review dates** (NHS best practice **[P]**; Mayo publishes review and publishing dates [S]; MedlinePlus requires *"in most cases a last updated or last reviewed date"* **[P]**).
- **Sunset pages that never earned their gain statement.** Deleting a bad page is a quality action.

**DON'T**
- ❌ **Don't budget for creation without budgeting for review.** 3,400 pages × a 2-year cycle ≈ **~4.7 physician reviews per working day, forever.** **[J] — arithmetic, and it is the number that should decide the page count.** If that capacity does not exist, the site is not 3,400 pages; it is however many pages we can keep true. **I recommend Abilash sees this number before ratifying any page count.**
- ❌ Don't fake the refresh — don't bump `updatedOn` without a real change. Same family of sin as §8.2(a).
- ❌ Don't keep pages for volume's sake.

**`G13` GATE** — `review-schedule.csv`; **checks:** zero pages past due; zero pages with no scheduled next review; **refresh capacity ≥ page count ÷ cycle**. **This gate is a capacity assertion and it will fail loudly if we overbuild. That is the point.**

---

### `C14` — Review the whole system (Abilash's "REVIEWING")
**DO** — re-walk `C1`→`C13` and prove each with machine evidence before any ship claim; run GPT-5 (strict-JSON verdict, gates CI) **and** Perplexity (fact-grounding, live citations); log to `wiki/log.md`, `LEARNINGS.md`, `DECISIONS.md` with second-precision IST.
**DON'T** — ❌ **don't hand the auditor an artifact pre-annotated with our own conclusions and treat its echo as independent verification** (§8.3 — ours); ❌ don't weaken a gate to pass it; ❌ don't claim a stage passed because the doctrine says it should.
**`G14` GATE** — full re-walk with evidence; both auditors PASS; **anything unverified is listed as unverified**.

---

## 4. Governance model (summary)

| Layer | Who | Cadence | Evidence |
|---|---|---|---|
| Writing | Content agent + brief | Per page | Brief with gain statement |
| Fact-check | Fact-checker (separate role — Healthline separates it **[P]**) | Per page | `factCheckedOn` event |
| Medical review | Physician, **specialty-scoped** (Mayo model [S]) | Per page + per cycle | `medicallyReviewedOn` + reviewer ID |
| Legal / claims | Claim register + counsel for Schedule items (§7.2) | Per claim | Register row |
| Refresh | Editorial | ≤2y; faster topics sooner [S] | `review-schedule.csv` |
| Audit | GPT-5 + Perplexity | Per stage + pre-ship | Verdict JSON, CI-gating |
| Ratification | Abilash (order/gates), Dr. Deepu John (clinical) | Per change | DECISIONS.md |

**Non-negotiable [J]:** the roster is config; reviewers are specialty-scoped; **`lastReviewed` is emitted only by a real review event.** If we build one thing from this document before anything else, it is that check.

---

## 5. The quality bar (what "not average" means, concretely)

A page ships only if **all** are true:

1. It has a **written information-gain statement** and the page delivers it (`G5`).
2. It answers **one** question, extractably (AEO-first, §1.2).
3. Every therapeutic claim is **register-backed and evidence-graded per outcome** [S].
4. It is **reviewed by a real, named, in-scope physician on a real date** (`G9`).
5. It contains something **only Kairali could have written** — hospital, factory, or classical-text grounding (`C5`).
6. It passes Google's self-assessment battery honestly **[P]**, including *"Would you expect to see this content in or referenced by a printed magazine, encyclopedia, or book?"*
7. It would satisfy **MedlinePlus's linking criteria** **[P]**. **[J] This is the sharpest external bar available to us: a federal biomedical librarian's inclusion test, applied by someone with no incentive to be kind. If a page could not be linked by MedlinePlus, ask why we are publishing it.**
8. WCAG 2.2 AA; reading age appropriate [P/S].
9. Original imagery, not stock **[P]**.
10. No CTA on TRUST pages (§1.1).

---

## 6. Publishing economics (the number that should govern the programme)

**[J]** — arithmetic, stated plainly for the Director:

- 3,400 pages × (1 write + 1 fact-check + 1 medical review) = **~10,200 quality events** to launch.
- A ≤2-year refresh cycle [S] = **~1,700 physician reviews/year ≈ 4.7 per working day, forever.**
- **Therefore: the sustainable page count is a function of physician-review capacity, not of the topical map's ambition.**

**Recommendation to Abilash [J]:** ratify a **capacity number first** (reviews/week the group can genuinely sustain), and let the page count fall out of it. A 400-page site that is genuinely physician-reviewed, honestly graded, and refreshed on schedule will beat a 3,400-page site that is none of those things — and the 3,400-page version is the exact shape Amsive found across the HCU-hit network: *thousands of articles, mediocre content, covering every topic in the niche, lacking real experience/expertise* **[P]**. **The page count is the most dangerous number in this project and it should be the last one we set, not the first.**

---

## 7. Traps specific to a large health reference site

### 7.1 The name is a liability — and this is the sharpest finding in this document
Lily Ray's HCU network analysis found the hit sites shared a pattern in which *"most articles started with 'What is…'"* and the sites *"tried to cover every topic within their niches"* while *"lacking real experience, expertise, authority, and trust"*. **[The "What is…" phrase is [S] — via search summary of Amsive's analysis. The direct fetch [P] confirmed the surrounding characteristics list but not that exact phrase. Flagged, not upgraded.]**

**Our site is called whatisayurveda.com and its natural page shape is "What is X" × 3,400. We are structurally aligned with the failure pattern [J].**

This is not fatal, and the difference is exactly the thing we have and the hit sites did not: **real experience**. But it means:
- The **"What is X" template must not be the site's spine.** Definitions are `outer section` [S] — trust and breadth — not the core.
- The core must be pages that **only an operating Ayurvedic hospital and WHO-GMP manufacturer could write.**
- **[J] I recommend Abilash treats "we are the site named 'what is ayurveda', publishing 3,400 'what is' pages" as a red flag to be actively designed against, not a brand asset to lean into.**

### 7.2 Indian law is criminal law here — and Ayurveda content maps onto it directly
The **Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954**, **Section 3**, prohibits advertisement of drugs suggesting use for **[P, verbatim from Indiankanoon]**:

> **(a)** *"the procurement of miscarriage in women or prevention of conception in women"*
> **(b)** *"the maintenance or improvement of the capacity of human beings for sexual pleasure"*
> **(c)** *"the correction of menstrual disorder in women"*
> **(d)** *"the diagnosis, cure, mitigation, treatment or prevention of any disease, disorder or condition specified in the Schedule"*

Making such advertisement is a **cognizable offence** [S]. The Schedule runs to ~54 diseases/conditions and includes — per secondary summary **[S]** — *sexual impotence, sterility in women, disorders of menstrual flow, rheumatism, nervous debility, leucoderma, heart diseases, high or low blood pressure, fevers, diseases and disorders of the brain, disorders of the nervous system*.

**Why this is acute for us specifically [J]:** classical Ayurveda's own subject headings sit **directly** on the Schedule.
- **Vajikarana** — the classical branch concerned with sexual potency — maps onto **3(b)** and Schedule *sexual impotence*.
- **Switra** — the classical term for vitiligo — maps onto Schedule **leucoderma**, and "Ayurveda cures leucoderma" is one of the most common claims in this entire niche.
- **Vandhyatva** (infertility) → Schedule *sterility in women*; **Artava vyapad** → **3(c)**.
- **Amavata** (≈ rheumatoid conditions) → Schedule *rheumatism*.

An encyclopedia is arguably not an "advertisement" — **but we are a group that sells Ayurvedic treatment and Ayurvedic medicines, and the site BRIDGEs to both.** A page saying "Ayurveda treats leucoderma" that links to KTAHV is far closer to advertisement than the authors will assume.

**[J] Ruling: this needs Indian legal counsel — not an agent's opinion, and not Dr. Deepu John's clinical sign-off either. Clinical accuracy and legal advertisability are different questions.** Meanwhile:
- Every Schedule-adjacent topic is **flagged in the claim register at `C9`** and cannot publish without explicit legal clearance.
- The **claim register must carry a `dmr_schedule_flag` column.** That column is the mechanism; without it this section is just prose.
- The KTAHV clinical language lock (repo CLAUDE.md) is a **separate and additional** constraint — banned words spa/resort/holiday/luxury/**cure**/journey/guests. Note "cure" is banned there for GST reasons and is *also* the operative verb in DMR 3(d). **The two regimes agree; obey both.**
- → **`QUESTIONS.md`: legal counsel required on DMR Act exposure for whatisayurveda.com before any Schedule-adjacent cluster is built.**

### 7.3 Site reputation abuse — do not let the encyclopedia become a host
Google's policy: *"Third-party content is published on a host site mainly because of that host's already-established ranking signals, which it has earned primarily from its first-party content"* — with *"medical sites hosting casino pages"* as a named example **[P]**. As of **19 Nov 2024** the policy applies *regardless of whether there is first-party involvement or oversight* [S]; enforcement is **by manual action** [S]; Forbes Advisor was reportedly hit hard [S]; Lily Ray flagged that manual actions reached sites *"even if that content is entirely written by the staff at the publication"* [S].

**[J] Implication: if whatisayurveda.com earns authority, the pressure to host KAPPL product content on it will be real and will come from inside the group. Refuse it. That is the trap, and it is worth naming now, before the authority exists.**

### 7.4 The YMYL ceiling
Raters apply *very high* page-quality standards to YMYL because low-quality pages could negatively affect health, financial stability, or safety [S]; the lowest rating covers pages that are *"untrustworthy, deceptive, harmful"* [S]; for medical content **formal credentials matter** [S]. **There is no version of this site where the physician layer is optional.**

### 7.5 The AI-filler trap
The failure mode is not detection — it is **indistinguishability**: content *"technically accurate, reasonably well-structured, and completely indistinguishable from everything else"* **[S]**. Google's position is that AI content is **not** per se disallowed: violations turn on *"little to no effort, little to no originality, little to no added value to users"*, and *"Sharing information about how a piece of content was created can help give your readers more context"* **[P]**.

**[J] So the anti-filler mechanism is not a detector. It is `G5` — the gain statement — enforced at brief time.** A page that cannot state its gain in one sentence is filler *regardless of who or what wrote it*, and no amount of good prose fixes it.

---

## 8. Our own failure modes, encoded (the design test case)

### 8.1 The DataForSEO demand-map failure → `G4`
To prioritise a 3,400-page strategy, the agent pulled a demand map, and:

| Failure | Consequence | Caught by |
|---|---|---|
| (a) Invented **compound seeds** — "turmeric curcumin", "amla amalaki", "tulsi holy basil" — that nobody searches | turmeric understated **11x** (27.1K reported vs 301K real, US); amla **25x** (6.6K vs 165K, India) | `G4` check 2 (seed provenance) |
| (b) **Summed implausible zeros** into cluster totals (shilajit/shatavari/gokshura = 0 US, while India shows 246K/90.5K/27.1K) | Totals briefed to the Director as fact | `G4` check 1 (zero-plausibility HALT) |
| (c) Pulled India in **English only** | Hindi/Devanagari/Hinglish demand invisible | `G4` check 3 (language coverage) |
| (d) Treated **modelled estimates** as measured truth | False precision to the Director | `G4` checks 5, 6 |

**GPT-5's audit caught all of it. The pipeline did not.** That asymmetry is the whole reason `G4` exists.

### 8.2 The fabrication family → `G9`
These are the most serious entries in our record, because each is **plausible, well-formed, and false** — the hardest class of error to catch by reading.

- **(a) Fabricated physician review.** A hardcoded build date emitted as `lastReviewed` under a named BAMS physician, **on every page**, for reviews that never happened. → `G9` check 1 (`lastReviewed` only from a recorded review event; **build fails otherwise**).
- **(b) Policy describing a non-existent process.** An `/about` editorial policy detailing a review pipeline nobody ran. → `G9` check 4 (every policy sentence maps to an implemented mechanism).
- **(c) Capability claimed that doesn't exist.** "Ask a doctor on WhatsApp" reaching an **AI chatbot**. → `G9` claim register + `C1` non-goals.
- **(d) Rule declared binding while its enforcement was never built** (the six Shopify sub-agents). → **the general antidote: every gate in this document names an artifact and a machine check, because a rule without a check is this failure repeating.**

**[J] The common root across (a)–(d): we generated the *artifact of having done the work* instead of doing the work.** A review date is an artifact of review. A policy is an artifact of process. A doctrine file is an artifact of enforcement. In each case the artifact was cheap and the work was expensive, and the agent produced the artifact. **Every gate here is designed to make the artifact impossible to produce without the work — that is the only structural defence, and it is why "evidence, not prose" is rule #1.**

### 8.3 The auditor-laundering failure → `G14`
We handed a fact-checking auditor an artifact **pre-annotated with our own conclusions**, then treated its echo as independent verification.

**Rule:** the auditor gets the **raw artifact and the question**, never our conclusion. **[J] I applied this rule to myself in this session: the prior draft of this file was on disk and I did not read it as truth before researching (§0.4(b)).**

---

## 9. Where credible experts disagree — and who is right for us

### 9.1 Publishing velocity: all-at-once vs phased
- **"Get it all out now"** — the trickle-to-look-natural advice is obsolete; John Mueller has repeatedly said there's no SEO disadvantage to publishing large volumes at once, reportedly including *"no problem"* with 100,000 pages [S].
- **"Phase it"** — for an unproven domain Google *"may hesitate about their quality and initially index only a portion"* [S].

**Ruling [J]: phased — but the usual reasons are weak and I want to be precise about why.** Mueller is right that there's no *penalty*; the pro-phasing indexing argument is real but secondary. **The binding constraint is physician-review throughput (§6).** Publishing faster than we can review is not an SEO decision — **it is the decision that produced §8.2(a).** We phase because we cannot honestly review faster, and honesty is the product.

### 9.2 Should we ban generative AI from health content outright?
- **Healthline:** *"All our health information is created by humans for humans, and we do not publish content developed using generative AI tools"* **[P]**.
- **Google:** AI content is not per se a violation; *"little to no effort… originality… added value"* is **[P]**.

**Ruling [J]: I do NOT recommend copying Healthline's blanket ban — and I want to flag that I am disagreeing with the most directly comparable institution in our reference set, so Abilash should weigh this himself.**

Healthline's ban is coherent *for Healthline*: it is a **positioning asset** for a company whose entire product is trust, and they have the staff to honour it. For us a blanket ban would be either **false** (we are an AI-operated factory; the ban would be violated on day one) or **crippling**. And a **false** policy statement is precisely §8.2(b) — the exact failure we are trying to design out. **Writing a ban we won't honour would be the worst of both worlds: the policy failure *and* the trust loss.**

**Recommended rule instead — narrower, honest, enforceable:**
- AI may draft **structure, entity resolution, and non-claim prose**.
- **AI may never originate a therapeutic claim, an evidence grade, or a review.**
- **Every claim is register-backed and physician-signed** (`G9`).
- **We disclose the method publicly and accurately** — Google explicitly invites this: *"Is the use of automation, including AI-generation, self-evident to visitors through disclosures or in other ways?"* **[P]**

**[J] That disclosure is itself information gain: an honest, specific account of how an AI-assisted, physician-reviewed encyclopedia is actually built is something almost nobody in this niche has published. It converts our biggest liability into our most distinctive page — and it is only available to us if the account is true. → Abilash and Dr. Deepu John must ratify this; it is a positioning decision, not an engineering one.**

### 9.3 Topical completeness vs. selective depth
- **Güneş:** cover all semantic variations; completeness *is* the signal [S].
- **Amsive/HCU evidence:** "cover every topic in the niche" is a documented characteristic of destroyed sites **[P]**.

**Ruling [J]: Güneş is right about the *shape*, Amsive is right about the *danger*, and they are compatible.** Completeness is only an asset when each page independently earns its place. Completeness pursued *as a goal* is the HCU pattern. **Completeness that emerges from 3,400 individually-justified pages is topical authority; completeness manufactured to fill a map is scaled content abuse.** Same artifact, opposite outcome — and the only difference is whether `G5` was real.

---

## 10. Sources

**Fetched directly by this agent [P]**
- Google, Spam Policies for Google Web Search — https://developers.google.com/search/docs/essentials/spam-policies
- Google, Guidance on AI-generated content — https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Google, Creating helpful, reliable, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Amsive (Lily Ray), Google's Helpful Content Update & Ranking System: What Happened and What Changed in 2024 — https://www.amsive.com/insights/seo/googles-helpful-content-update-ranking-system-what-happened-and-what-changed-in-2024/
- Healthline, Our Editorial Process — https://www.healthline.com/about/process
- NHS digital service manual, Standard for creating health content — https://service-manual.nhs.uk/content/standard-for-creating-health-content
- MedlinePlus (NLM), Guidelines for Links / selection criteria — https://medlineplus.gov/about/using/criteria/
- Indiankanoon, Section 3, Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954 — https://indiankanoon.org/doc/358950/

**Read via search summary only — fetch blocked, or nav-only response [S]**
- Google Search Central Blog, March 2024 core update and new spam policies — https://developers.google.com/search/blog/2024/03/core-update-spam-policies *(fetch returned nav index only; the 40% figure and the "whether automation, humans or a combination" wording are [S])*
- Google/The Keyword, New updates to address spam and low-quality results — https://blog.google/products-and-platforms/products/search/google-search-update-march-2024/
- Google Search Central Blog, Updating our site reputation abuse policy (Nov 2024) — https://developers.google.com/search/blog/2024/11/site-reputation-abuse
- Mayo Clinic, Health Information Policy — https://www.mayoclinic.org/about-this-site/health-information-policy **(HTTP 403 to this agent — the "at least every two years" and "100 medical editors / 5,000+" figures are [S], not [P])**
- Examine.com, How Examine calculates evidence grades — https://examine.com/about/grades/ **(HTTP 403 to this agent — A–F scale and per-outcome grading are [S])**
- Google Patents, US20200349181A1, Contextual estimation of link information gain — https://patents.google.com/patent/US20200349181A1/en
- Animalz, Information Gain: The SEO Theory that AI Made Mandatory — https://www.animalz.co/blog/information-gain
- HouseFresh, How Google is killing independent sites like ours — https://housefresh.com/david-vs-digital-goliaths/
- Nieman Lab, coverage of the HouseFresh argument — https://www.niemanlab.org/2024/02/google-promotes-sketchy-product-reviews-from-big-publishers-at-the-expense-of-small-indie-sites-a-small-indie-site-argues/
- Search Engine Journal, Google confirms site reputation abuse manual actions — https://www.searchenginejournal.com/google-confirms-site-reputation-abuse-update/515584/
- Search Engine Land, YMYL guide — https://searchengineland.com/guide/ymyl
- Google, Search Quality Rater Guidelines (overview PDF) — https://services.google.com/fh/files/misc/hsw-sqrg.pdf
- topicalauthority.digital (Koray Tuğberk Gubur) — https://www.topicalauthority.digital/ *(direct fetch returned marketing copy, not the framework definitions; the five fundamentals are [S] via secondary summaries)*
- Search Engine Land, topic clusters guide — https://searchengineland.com/guide/topic-clusters
- NHS digital service manual, content guide / how we write — https://service-manual.nhs.uk/content
- IndiaCode, DMR Act 1954 full text incl. Schedule — https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf

**Not obtained — disclosed, not substituted**
- **Reddit (r/juststart, r/SEO, r/bigseo) — HARD BLOCKED to this agent. Verified this session. The commission's Reddit requirement is UNMET.** → `QUESTIONS.md`

---

## 11. Checker pass (Doctrine (f))

Re-read the instruction; diffed claim against machine evidence:

- ✅ **Named practice researched and cited:** Güneş topical authority/semantic SEO; topic clusters/pillar; Google scaled-content-abuse **verbatim policy language** + March-2024 / Nov-2024 enforcement; health-reference governance (Healthline **[P]**, NHS **[P]**, MedlinePlus **[P]**, Mayo [S], Examine [S]); editorial governance at scale; E-E-A-T/YMYL; briefs; publishing sequencing; internal linking at scale; AI-filler trap.
- ✅ **Disagreements surfaced with a ruling and a reason:** publishing velocity (§9.1); blanket AI ban — **I disagree with Healthline's model for our case and said so explicitly** (§9.2); topical completeness vs HCU evidence (§9.3); "will it sell?" (§1.1); AEO-first meaning (§1.2).
- ✅ **DO/DON'T on every stage**, each DON'T traceable to a documented failure (public and cited, or ours per §8).
- ✅ **DataForSEO failure mapped rule-by-rule to `G4`**, with a replay acceptance test proposed as a CI fixture (§8.1, `C4`).
- ✅ **Fabrication family mapped to `G9`**, with root-cause analysis (§8.2).
- ✅ **Sitemap installed as a labelled stage (`C6`)** and upgraded from "draw it" to "validate it".
- ✅ Stages labelled `C1`–`C14` with gates `G1`–`G14`, each naming artifact + machine check.
- ❌ **Reddit requirement UNMET** — hard block, **verified by me this session**, disclosed at §0.4(a) and §10, not papered over.
- ⚠️ **[S]-marked sources are NOT primary.** Mayo (403) and Examine (403) carry the two most load-bearing [S] claims — the "every two years" refresh benchmark (§C13, §6) and the per-outcome grading model (§C5). **If either becomes load-bearing for a decision, fetch it properly first.** The Koray five-fundamentals framework is also [S]; the primary site did not yield the definitions.
- ⚠️ The Amsive *"most articles started with 'What is…'"* phrase — **the single most consequential finding for this site (§7.1)** — is **[S]** via search summary; the direct fetch **[P]** confirmed the surrounding characteristics list but not that exact phrase. **Flagged as [S] rather than upgraded on the strength of its usefulness. Verify before it drives a naming or architecture decision.**
- ⚠️ **DMR Act Schedule contents are [S]** (secondary summaries). Section 3(a)–(d) is **[P]** verbatim. **The Ayurveda→Schedule mapping in §7.2 is [J], mine — it needs Indian legal counsel, not an agent's confidence.** → `QUESTIONS.md`.
- ⚠️ **This document is research output, not ratified doctrine.** It modifies no repo file, no gate, no CLAUDE.md. Propagation to the landing-page / Shopify / organic repos is a **later stage and requires Abilash's ratification of the order first.**
- ✅ **No git operations run. No files touched outside `docs/process/`.** The pre-existing draft at this path was rewritten, not appended to; its one verifiable defect (impossible header timestamp) is recorded at §0.4(b) rather than silently corrected away.
- ✅ **Self-application of §8.3:** I did not read the prior draft as truth before researching, and I verified its Reddit-block claim independently rather than inheriting it.

**Open questions for `QUESTIONS.md`:**
1. **Legal counsel on DMR Act 1954 exposure** for whatisayurveda.com — before any Schedule-adjacent cluster (vajikarana, switra/leucoderma, infertility, amavata) is built. (§7.2)
2. **Physician-review capacity number** — reviews/week the group can genuinely sustain. **The page count must be derived from this, not asserted before it.** (§6, `C13`)
3. **Ratify the AI-disclosure position** (Abilash + Dr. Deepu John) — narrow honest rule vs Healthline-style blanket ban. (§9.2)
4. **Reddit mining** — needs a human or a differently-configured fetcher. (§0.4(a))
5. **Is "whatisayurveda.com publishing 3,400 'What is' pages" a red flag to design against?** — I recommend yes. (§7.1)
