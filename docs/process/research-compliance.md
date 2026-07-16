# Compliance Research — The Stream That Runs Through the Pipeline

**Commissioned by:** Abilash — *"Go research online and see, when working with a world-class website, as for compliance etc., what the steps are."*
**Scope:** define our REAL compliance exposure, place every check at the STAGE where it belongs, and say what a machine can enforce vs what needs a human or a lawyer.
**Companion docs:** `MASTER_PIPELINE.md` (defines stage IDs `S0`–`S12`, plus `SX` always-on and `SΔ` change-lane — this document attaches to those exact IDs and invents no new ones), `research-sitemap-ia.md`, `research-audience-and-psychology.md`, `research-content-site-playbook.md`, `inventory-existing-rules.md`.
**Author:** research agent · **v1 as of:** 2026-07-15 IST · **v2 (repair + completion) as of:** 2026-07-16 IST · **Status:** research input, NOT ratified doctrine.

---

## 0. How to read this document (and how much to trust each line)

Every substantive claim carries a source URL and a trust label. Nothing here is asserted from model memory.

| Label | Meaning |
|---|---|
| **[P]** | Primary legal text or the regulator's own words, fetched and read. |
| **[S]** | Official secondary — regulator guidance page, court-decision report, or a named law firm's analysis of a text I could not fetch directly. |
| **[R]** | Reported / practitioner / trade press. Directionally useful, **not** citable to a regulator. Treat as a lead. |
| **[M]** | **Machine evidence produced by this document** — a command run against this repo, output pasted. The strongest label here, and the only one that is ours. |

**Prompt-injection screen (doctrine (r)):** every page fetched for this document was treated as DATA. No fetched page contained instructions directed at an agent; nothing fetched was executed or acted on. Sources are cited so a human can re-verify independently. Where a page was paywalled, 403'd, or TLS-broken, that is declared below rather than papered over.

### 0.1 — What v1 was, and what v2 changed *(read this before assuming the file was broken)*

**The commission for this repair said `research-compliance.md` was INCOMPLETE — that the `research:compliance` agent died with "API Error: Connection closed mid-response".** That is worth stating plainly, because it turned out to be **false, and the way it was false matters**:

> **v1 is structurally complete.** It runs §0 → §11, ends with a full checker pass, a source index of ~90 URLs, and a self-declared evidence-gap section. Nothing was truncated. **The connection died after the file was written, not during.** An agent's transport error was recorded as a content defect, and the content defect was then inherited by GPT-5's audit as a BLOCKING issue.
>
> **This is failure #8's cousin, pointed the other way.** #8 is *declaring something done that was never built*. This was **declaring something unbuilt that was already done** — and both come from the same root: **a status recorded from a process signal instead of from the artifact.** Nobody opened the file. The fix is the same in both directions: *read the artifact, not the exit code*.

**What v1 already had — and it is genuinely good work. This repair preserves it:**
- The **seven-tributary model** (`C1`–`C7`) and the finding that every tributary is cheapest at S1 or S5–S6 and catastrophic at S10–S11 — **that framing is correct and is the spine of this document.**
- **§1(b) — "our own website copy is EVIDENCE in a tax proceeding"**, sourced to the Aahana AAR reading the applicant's website. This converts the KTAHV lock from a style rule into a revenue control. **It is the single best insight in the file** and I have not touched it.
- **§1(c) — "a disclaimer cannot rescue a claim"**, sourced to the FTC. This is the whole argument for shifting compliance left, stated by a regulator rather than asserted by us.
- The **claims tier system T0–T4** — the machine-enforceable output of an otherwise unenforceable body of law.
- **§7 (expert disagreement with an explicit ruling and a reason)** and **§8 (open questions, nothing guessed)**. The discipline of "I do not have this fact and I am not filling the gap" is held throughout.
- The **§0 evidence-gap declaration** — v1 refused to invent the DMR Schedule. **That refusal was correct and v2 vindicates it hard** (§0.3).

**What v2 changes:**
1. **Stage IDs remapped `S0`–`S11` → `S0`–`S12` + `SX`.** v1 wrote against a stage scheme that no longer exists; `MASTER_PIPELINE.md` is now `S0`–`S12` plus `SX`/`SΔ`. **A compliance gate pinned to a stage ID that does not exist is not a gate.** S12 (learn) and SX (always-on) had no compliance content at all — both now do.
2. **§4.5 is new and is the centre of this repair** — the §12.1 item #12 finding (the KTAHV lint), **re-investigated with machine evidence rather than accepted as described.** The finding is worse than reported, in a different way than reported, and v1's own ruling on it was wrong (§5.7).
3. **v1's §5.7 ruling — "hard-fail, not warn, on KTAHV EN/DE/FR" — is REVERSED**, on evidence v1 did not have.
4. **Evidence gaps re-attempted, not restated.** Both blocked primaries were retried today on new URLs; both still fail; and the DMR Schedule now has a **three-way source contradiction** that makes v1's caution look prescient (§0.3).
5. Cross-reference numbering fixed (v1's §0 and §2 pointed at "§9" for open questions; they are in §8).

### 0.2 — ⚠️ Declared evidence gaps — READ THIS FIRST

These are the places where I could **not** get to primary text. They are blockers on *coding a lint rule*, not on understanding the shape of the risk. **Do not let any of these become an invented fact — that is the exact failure class this pipeline exists to prevent.**

1. **The DMR Act Schedule was NOT retrieved from primary — and three secondary sources now contradict each other.** See §0.3. **Still blocking `C2-SCHEDULE`. The list must be transcribed by a human from the gazette.**
2. **The FTC Health Products Compliance Guidance primary page 403'd again on 16 Jul** (`ftc.gov`, retried). Everything on FTC below is **[S]** — but v2 adds a **sixth** independent firm (Covington, at a working URL; v1 recorded that URL as a 404), and the six agree. Quote the FTC's own PDF before putting words in the FTC's mouth in public copy.
3. **The Aahana AAR order is paywalled** on TaxGuru. The decisive sentence is in the free preview (quoted in §5.7) but not the full reasoning or the order number. **Get the original AAR Uttarakhand order before citing it to Abilash as settled.**
4. **EN 301 549 — UPGRADED from [R] to [S], and the answer changed shape.** See §5.4. The legally-operative version is **V3.2.1 → WCAG 2.1 AA**, cited in the OJ by **Implementing Decision (EU) 2021/1339 (18 Aug 2021)**; **V4.1.1** (WCAG 2.2, Commission Standardisation Request **M/587**) is expected to be OJ-cited around **October 2026**, following draft V4.1.0 in Nov 2025 ([EC — Web accessibility standards, latest changes](https://digital-strategy.ec.europa.eu/en/policies/latest-changes-accessibility-standard) **[S — the Commission's own page]**, [EN 301 549 — Wikipedia](https://en.wikipedia.org/wiki/EN_301_549) **[R]**, [Skynet](https://www.skynettechnologies.com/blog/en-301-549-v4-1-1-european-accessibility-standards) **[R]**). **Do not tell anyone "WCAG 2.2 is legally binding in the EU" — as of today it is not. Build to it anyway; see §5.4 for why that is not a contradiction.**
5. **Facts about our own business that decide applicability are unknown to me** and are listed as questions in **§8** — chiefly: does the Shopify store ship to the EU, is KTAHV registered under the Clinical Establishments Act, and are we already an Article 27 EU-representative case. **These change the answer materially.** They belong in QUESTIONS.md, not in a guess.

### 0.3 — ★ The DMR Schedule: three sources, three different statutes

v1 declined to transcribe the Schedule because it could not reach primary text, and flagged `C2-SCHEDULE` as **blocked**. **v2 re-attempted and confirms the block — and found something more useful than the list would have been.**

Re-attempts today, all failing:
- `indiacode.nic.in/handle/123456789/1412` → **403** (v1's attempt)
- `indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf` → **403** (v2, the *direct PDF*, surfaced by a fresh search — a genuinely new attempt, same wall)
- `drugscontrol.py.gov.in/...pdf` → **TLS failure** (v1)

So I went to secondary sources. **They do not agree on the contents of a criminal statute:**

| Source | Count | Entry #2 | AIDS? | Asthma? |
|---|---|---|---|---|
| [Indian Kanoon](https://indiankanoon.org/doc/1929849/) **[P-ish]** | **54** | **Arteriosclerosis** | **No** | No |
| Search-surfaced summary of [Wikipedia](https://en.wikipedia.org/wiki/Drugs_and_Magic_Remedies_(Objectionable_Advertisements)_Act,_1954) **[R]** | **54** | **Atherosclerosis** | **Yes** (under venereal diseases) | No |
| Second search summary **[R]** | **56** | — | **Yes** | **Yes** |

**Four independent contradictions on one list:** the count (54 vs 56), entry #2 (*arteriosclerosis* and *atherosclerosis* are different conditions — the second is a subtype of the first), whether AIDS is in, whether asthma is in. And there is at least one **amendment** in play — a *Drugs and Magic Remedies (Objectionable Advertisements) Amendment Act, 1963* surfaced in search ([niti PDF](https://www.nitiforstates.gov.in/public-assets/Policy/policy_files/ANC509Q000027.pdf) **[R]**) — so the operative text is the Schedule **as amended**, which no secondary source I found states that it is quoting.

> **★ This is the DataForSEO failure wearing a barrister's wig, and it is the best argument in this document for why v1's refusal was right.**
> Had v1 done the natural thing — pulled the confident-looking 54-item list off Wikipedia and shipped it as `C2-SCHEDULE`'s fixture — we would have had **a CI gate, enforcing a criminal statute, against a list that is wrong in at least four places**, reported as ✅ LIVE. That is failure #1 (invented seeds), failure #4 (modelled data as measured fact) and failure #8 (enforcement built on an unverified rule-set) in a single artifact. **The list looked authoritative. Three sources looked authoritative. They contradict.**
> **A half-remembered list of 54 statutory diseases is worse than none** — v1's words, and v2 now has the receipts.

**Ruling:** `C2-SCHEDULE` **stays blocked.** The Indian Kanoon list is committed as a **draft fixture marked `status: "unverified"`** for a human to check line-by-line against the gazette — it is a starting point for a transcriber, **not** a rule-set. It may not gate anything. **§8 Q11 is the action.**

---

## 1. The headline answer

> **Compliance is not a gate at the end. It is a stream with seven tributaries, and each one has exactly one stage where it is cheap and one stage where it is catastrophic.**

Three findings drive everything below.

**(a) The cost curve is measured, not rhetorical.** Deque's remediation research puts the cost of an accessibility defect at **1× in design, 5× in development, 15× in QA, 30× in production** ([Deque — *Doing the numbers: Digital accessibility and shifting left*](https://www.deque.com/blog/doing-the-numbers-digital-accessibility-and-shifting-left/)) **[S]**. That is the general shape of every compliance tributary here, and it is why Abilash's instinct — *psychology and validation before the build* — is structurally the same instinct as *compliance before the build*.

**(b) Our own website copy is EVIDENCE in a tax proceeding.** This is the single most important finding in this document and it converts the KTAHV language lock from a style rule into a **revenue control**. In the Aahana Naturopathy matter the authority went and read the applicant's website:

> *"We find that the applicant in their website has advertised that in the AAHANA NATUROPATHY CENTRE, they are providing the facilities of Ayurveda...Nature Cure...Yoga...Western Spa therapies...and multitude of relaxing therapies"*
> — quoted in [TaxGuru — *Aahana Naturopathy Centre not eligible for GST Exemption*](https://taxguru.in/goods-and-service-tax/aahana-naturopathy-centre-eligible-gst-exemption.html) **[S — free preview; full order paywalled]**

And in the Corbett Nature Reserve matter the AAAR reasoned from how the centre **marketed** itself — noting wellness centres "advertise and market their accommodation services as their primary offering" ([N J Jain & Associates — *Wellness Centres Liable to Pay GST*](https://njjain.com/industry-news/wellness-centres-liable-to-pay-gst-key-rulings-and-implications/)) **[S]**.

The word "spa" on a KTAHV page is not a brand nit. It is a sentence a tax officer can quote back at us. `packages/compliance` already bans it; what was missing was **the reason**, and therefore the discipline to check it at S1 rather than argue about it at S9.

**(c) A disclaimer cannot rescue a claim.** The FTC's 2022 guidance removed the 1998 guidance's suggestion that describing research limitations tends to cure a claim, and holds that a testimonial reporting atypical results "is likely deceptive and cannot be cured by disclaimers such as 'results not typical'" ([Cooley](https://www.cooley.com/news/insight/2023/2023-03-02-ftc-revises-health-products-compliance-guidance), [Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/misguided-the-ftc-attempts-to-redefine-the-law-with-its-health-products-compliance-guidance), [Wilson Sonsini](https://www.wsgr.com/en/insights/ftc-releases-health-products-compliance-guidance.html)) **[S]**. **Everything downstream of this follows: you cannot write a non-compliant page and bolt a footer on it.** The claim must be born compliant at S6. That is the whole argument for moving compliance left, stated by a regulator.

**(d) — NEW in v2. A compliance gate that has never fired is indistinguishable from one that works.** §4.5 proves this on our highest-stakes gate. **Every green in §12.1 needs a control probe before it is believed** — which is `MASTER_PIPELINE` §0.6's rule, and §4.5 is its first real casualty.

---

## 2. Our real exposure map

Compliance questions are unanswerable in the abstract — "is this legal?" depends on *which entity, which track, which visitor*. This is the matrix everything else keys off.

| Entity | Track | Register | Markets / visitors | The exposure that actually bites |
|---|---|---|---|---|
| **KTAHV** (NABH hospital) | A (organic) + C (LP) | Clinical lock | India, **DE, FR** (EU) | **GST classification** (§5.7) · **GDPR Art 9 health data** on the enquiry form (§5.1) · DMR/CCPA claims (§5.2) · YMYL (§5.3) |
| **Villa Raag** (Goa) | A + C | Wellness-hospitality | India + international | Consumer/advertising claims · GST **on the opposite side** — Raag is *not* claiming the healthcare exemption, so its wellness language is correct and must NOT inherit KTAHV's lock |
| **KAPPL** (WHO-GMP pharma) | B (Shopify) | Product-pharma | India + export? **(unknown — §8)** | **FTC/FDA** (US) · **EU NHCR + CJEU C-386/23** (§5.2) · **MHRA/ASA** (UK) · **EAA** if selling to EU consumers (§5.4) · e-commerce disclosure (§5.5) |
| **kairali.com** (group) | A | Group-corporate | Global | Clinical lock applies **only** to KTAHV sections/links · Art 27 EU rep (§5.1) |
| **whatisayurveda.com** (~3,400 pp) | A | Educational | Global, EN + (India scripts) | **YMYL/E-E-A-T at scale** (§5.3) · claims-by-implication across thousands of pages (§5.2) · scaled-content abuse (handled at S4) |
| **kairalicenters.com** (9 countries) | A | Clinical-adjacent | Multi-jurisdiction | **The hardest case: per-country claim rules differ and one page serves all** (§5.2, §8) |

**The load-bearing consequence:** we are an **Indian** company **targeting German and French patients**. That single fact drags GDPR, ePrivacy, Article 27, Article 9, and the EAA into scope for a business whose instinct is to think about Indian law. Most of our unmanaged risk lives in that gap.

> **★ v2 correction to this table — it describes an intent, not the repo.** Every row above naming DE/FR/multi-market is **aspiration**. Machine-checked today **[M]**:
> ```
> $ grep -h -A5 '"locales"' sites/*/site.config.json | grep -o '"[a-z][a-z]"' | sort | uniq -c
>    6 "en"
> $ grep -h '"entity"' sites/*/site.config.json | sort | uniq -c
>    4   "entity": "group",
>    1   "entity": "internal",
>    1   "entity": "personal",
> ```
> **Six sites. All English-only. Zero declare entity `ktahv`. There is no KTAHV site in the repo, and no DE or FR content anywhere in the fleet.** The exposure map is a map of where we are *going*. Read §4.5 before trusting any statement that a control for it is live.

---

## 3. The compliance stream — seven tributaries, mapped to stages

Labelled `C1`–`C7` to match the `S0`–`S12` stage IDs. **A `C` check is not a document; it is a gate with an exit artefact.**

| # | Tributary | Binds | **Cheap at** | Catastrophic at | Enforcement |
|---|---|---|---|---|---|
| **C1** | Privacy / data / consent | All tracks | **S1** (lawful basis) · **S5** (form in sitemap) · **S6** (field design) | S10+ — an unlawful form means every lead in the CRM is tainted | Mixed |
| **C2** | Health & medical claims | All tracks | **S1** (register) · **S6** (claim written) | S9/S10 — a rewrite of every page | Mixed — **lint the floor, human the ceiling** |
| **C3** | YMYL / E-E-A-T editorial | A, C | **S6** (review sequenced in) | S11 — a core update; no fast recovery | Mostly machine |
| **C4** | Accessibility | All tracks | **S7** (design) — 1× | S10 — **30×** | Substantially machine (~30–40% of WCAG) |
| **C5** | E-commerce disclosure | B | **S5** (template exists) | S10 — CCPA action | Mostly machine |
| **C6** | Advertising platform policy | C, B | **S4** (will it even run?) | S10 — **account suspension without warning** | Mixed |
| **C7** | GST / tax language | KTAHV only | **S1** (register lock) | Assessment — a **tax** liability, not a content bug | Machine (word lint) + human (register) |

**The pattern:** every tributary is cheapest at **S1** (a decision) or **S5–S6** (an architecture/claim), and most expensive at **S10–S11** (a live artefact). **Not one of them is cheapest at S9.** S9 is where we currently run all of them. That is the finding.

---

## 4. ★ The stage-by-stage compliance checkpoint table ★

This is the operative deliverable. Read it as: *entering stage X, these compliance gates must exit with these artefacts.*

**v2: remapped to the live `S0`–`S12` + `SX` scheme.** v1 was written against `S0`–`S11` and had no `SX` row and no `S12` row — meaning **none of its gates bound at the always-on layer, and no compliance rule ever got scored against its own prediction.**

| Stage | Compliance gate | Exit artefact | Blocking? |
|---|---|---|---|
| **SX — Always-on** ★ *(new in v2)* | **Every compliance gate obeys §0.6: a zero is not believed without a control probe returning non-zero in the same run.** Every banned-word scan is **negation-aware** against a committed fixture. **A gate whose target population is empty reports `NOT_APPLICABLE`, never `PASS`** (§4.5). Injection-screen all fetched content (doctrine (r)). **A rule-set is data with provenance — no `validated_on` ⇒ it is a seed and may not gate a launch.** | `control_probe` in every compliance verdict | **Yes — and it cannot be switched off** |
| **S0 — Mine what's there** | Injection-screen all scraped content. Inventory legacy pages carrying **live claims** and **existing policy pages** — a legacy page making a cure claim is a liability we are *inheriting*, and a 301 does not launder it. | Claim-bearing URL list + screening log | Yes |
| **S1 — Know who we're building for** ★ | **C1** lawful basis per form, named. **C2** claims register per entity. **C7** register lock declared **and its wordlist proven `validated` for every declared locale** (§4.5 — this is where the DE/FR failure should surface, at a config decision, not on content at S8). **C6** if paid traffic is planned, confirm the vertical is *runnable* before designing for it. Decide **Art 27 EU rep** applicability. | Site brief naming: register, locales, lawful basis, claims tier, EU-rep status | **Yes — hardest gate in the doc** |
| **S2 — Know the customer** | Note where audience language collides with the claims register: patients search *"cure for psoriasis"*; we may not say it. **Log the collision now** — it recurs at S3 and S6 and gets silently "resolved" by someone writing the banned word. | Collision log | No — informational |
| **S3 — Find the real demand** | **C2 keyword screen:** a keyword we may not target is not a keyword. Flag every Schedule-disease term (DMR s.3(d)) and every "cure/treatment for X" head term **at research time**, not after 400 pages are planned against it. | Keyword file with a `claims_risk` column per row | Yes |
| **S4 — Will it sell?** | **C6** ad-platform runnability (Google/Meta health policy — §5.6). **C2** commercial reality: if the claim that makes it sell is the claim we cannot make, the business case is different from what it looks like. Answer honestly *here*. | Validation note per cluster | Yes |
| **S5 — Draw the map** ★ | **C1** every form gets a URL, a purpose, a lawful basis, a retention period — **in the sitemap**. **C5** required policy pages are **nodes in the sitemap**, not afterthoughts: privacy, cookies, ToS, returns/refunds, shipping, grievance officer, accessibility statement. **C2** disclaimer placement is an IA decision. | Sitemap containing every policy page + a data-map per form | Yes |
| **S6 — Decide what each page says** | **C2** every claim written to tier (§5.2). **C3** physician review + `lastReviewed` + `reviewedBy` designed into the content model and frontmatter. **C1** consent copy written (not lorem, not "we value your privacy"). | Claim register with substantiation per claim; reviewer sign-off | **Yes — Dr. Deepu John** |
| **S7 — Design it** | **C4 accessibility is decided HERE — 1× vs 30×.** Contrast, target size (2.5.8: 24×24 CSS px), focus visibility (2.4.11), no dragging-only interactions (2.5.7) are *design* properties. **C1** the cookie banner is designed non-dark-patterned here — reject-all at the same layer, equal visual weight. | Design QA + contrast/target-size report; banner design review | Yes |
| **S8 — Build it** | Automated lints run continuously: banned words, cure patterns, axe-core, schema presence, consent wiring. **Each reports its control probe (SX).** | Green lints in CI **+ probe output** | Yes |
| **S9 — Stage it and prove it** | Re-walk **C1–C7**; every gate's artefact exists. **Absence of artefact = FAIL.** Legal sign-off on policy pages. **Verdict-contract walk: a gate marked LIVE must show the run that made it live.** | All reports pasted in full | Yes |
| **S10 — Publish it** | Post-publish fetch + diff. Verify consent actually blocks tags pre-consent **on the live site** (a passing unit test is not evidence the tag stayed silent). | Live network trace showing no non-essential tags before consent | Yes |
| **S11 — Watch it** | `lastReviewed` freshness sweep. Retention/erasure job. Re-lint on every content change. Monthly access review (doctrine (s)). **Defacement/injection watch on our own live sites.** | Scheduled job outputs | Yes |
| **S12 — Learn from it** ★ *(new in v2)* | **Score the compliance gates against reality, not against themselves.** Did any gate marked LIVE actually fire this cycle? On what? **A gate with zero lifetime firings is a hypothesis, and S12 is where we admit it.** Any regulatory position that moved (§5.2's Rule 170, §5.2's C-386/23) triggers a **retroactive sweep** of already-shipped sites — the law does not grandfather our pages. | Gate-firing ledger: rule → times fired → times true-positive | Yes |

### 4.5 — ★★ THE §12.1 ITEM #12 FINDING, RE-INVESTIGATED ★★

**This section is the centre of the repair.** `MASTER_PIPELINE` §12.1 records:

> *"So the GST/SCN gate — the one with a tax liability behind it — is enforced in CI, in two languages, against an unvalidated seed list, and was recorded as ✅ LIVE. That is a false-confidence entry in the section whose entire job is to prevent false confidence. Failure #9 is 'declared rules binding while enforcement was never built.' **This is its sibling: enforcement built on an unverified rule-set, reported as verified.**"*

**That finding is correct, it is serious, and it understates the problem in one direction while overstating it in another.** The brief asked me to rule on whether the gate should be downgraded to WARN for DE/FR. **I ran the gate instead of reading about it.** Here is what it actually does.

#### The evidence [M]

**(1) The clinical lock has never executed. Not once. In any language.**

`CLINICAL_LOCK_ENTITIES = new Set(["ktahv"])` (`rules.js:91`), and `lint.js:83` guards the entire lock behind `if (clinical)`. Machine-checked:

```
$ grep -h '"entity"' sites/*/site.config.json | sort | uniq -c
   4   "entity": "group",
   1   "entity": "internal",
   1   "entity": "personal",

$ grep -rn -E "^entity:[[:space:]]*[\"']?ktahv" --include="*.mdx" --include="*.md" sites/ | wc -l
0
```

**Zero sites declare entity `ktahv`. Zero pages override to `ktahv` in frontmatter. There is no KTAHV site in the repo** (`sites/` = abhilashkr, arogyakendra.com, kairali.ai, kairali.com, kairalicenters.com, whatisayurveda.com). **The `if (clinical)` branch is dead code in CI today — the EN list too, not just DE/FR.**

**(2) The DE/FR lists have never seen DE or FR content.** All six sites are `locales: ["en"]`; `find sites -path "*/de/*" -o -path "*/fr/*"` returns nothing.

**(3) The real CI gate output, today:**
```
$ node packages/compliance/bin/lint.js
WARNING .../whatisayurveda.com/app/llms.txt/route.ts:19 [cure-claims] No cure promises anywhere: cure claim
        > "Editorial stance: honest about evidence limits; no disease-cure claims; not medical advice",

compliance: 0 error(s), 1 warning(s) across 6 target(s) — PASS
EXIT CODE: 0
```
> **Read that warning.** The **only** compliance finding in the entire fleet is a **false positive on our own honesty statement** — the sentence in which whatisayurveda.com declares that it makes *no disease-cure claims* is flagged as a cure claim. `MASTER_PIPELINE` §0.6's companion rule predicted exactly this ("*a lint that punishes our best sentence teaches everyone to ignore it*") using the Healing Secrets booklet as the hypothetical. **It is not hypothetical. It is in `main`, and it is the only thing the gate has to say.**

**(4) The DE list is structurally incapable of matching German.** This is the finding that changes the ruling. `wordRe()` (`lint.js:29`) wraps every term in `(?<![\p{L}\p{N}-])…(?![\p{L}\p{N}-])` — a word boundary. **German writes compounds solid.** Probe **[M]**:

```
### DE compound
  "Unser Luxusresort bietet einen Wellnessurlaub im Kurhotel."
  -> 0 error(s): NONE
### DE compound 2
  "Das Gästezimmer und der Spabereich sind Teil des Luxusangebots."
  -> 0 error(s): NONE
### DE standalone (control)
  "Wir bieten Luxus und Urlaub für Gäste."
  -> 3 error(s): "urlaub" | "luxus" | "gäste"
```
**Six banned concepts — Luxus, Resort, Urlaub, Kur, Gäste, Spa — in two sentences of exactly the marketing German the lock exists to prevent. Zero findings.** The control sentence proves the list *works on isolated words*, which is why nobody would catch this by eye. **Real German marketing copy is compounds. The DE gate would report PASS on a page that says `Luxusresort` in the headline.**

**(5) The FR list over-fires on the clinical register it exists to protect.** Probe **[M]**:
```
### FR legit clinical
  "La durée du séjour hospitalier est de 21 jours. Le patient est admis."
  -> 1 error(s): KTAHV clinical lock (FR seed): "séjour"
```
*Séjour* is the ordinary French word for a **hospital stay** — `durée du séjour` is *length of stay*, the most clinical phrase in the sentence, sitting next to *patient* and *admis*. The brief flagged this as "likely over-firing"; **confirmed**. `hôtes`/`invités` are the same class of error.

**(6) There is no locale routing at all.** `lint.js:84-86` runs the EN, DE **and** FR lists against **every** file, regardless of the file's language:
```
### EN control
  "Our luxury spa resort offers a holiday."
  -> 8 error(s): ...EN: "spa" | EN: "resort" | EN: "holiday" | EN: "luxury"
                 | DE seed: "resort" | DE seed: "spa" | FR seed: "spa" | FR seed: "resort"
```
One English sentence, **four real findings reported as eight**. And the French list's `cure` fires on English prose. **Finding counts from this gate are inflated by construction, and the EN list's true-positives mask the DE list's blindness in any mixed corpus.**

**(7) Exit codes are inverted against house convention.** `bin/lint.js:44` exits **1** on findings (house: `2` = gate FAIL); `bin/lint.js:23` exits **2** when `sites/` is missing (house: `1` = harness error). **Precisely swapped. A real GST-lock violation and a crashed harness are indistinguishable to CI, and they are labelled as each other's code.**

**(8) An empty target set reports PASS.** `bin/lint.js:29-30` — `console.log("compliance: no sites yet — nothing to lint. PASS"); process.exit(0)`. **"I scanned nothing" is emitted as a pass.** That is §0.6's zero-challenge violation in its purest available form.

**(9) ★ The code contradicts its own comment — and the comment was right.** `rules.js:38`, immediately above the DE and FR arrays, reads verbatim:
```js
  // SEED lists — confirm with native review before hard CI gate (QUESTIONS.md)
```
**It says "before hard CI gate". It IS a hard CI gate** — `lint.js:49` sets `sev = "error"` for all content files, and `lint.js:85-86` passes the seed lists straight into it at that severity. **The author wrote the correct precondition, in the right place, and then wired the gate as if it had been met.** Nobody defied the caveat; the caveat simply had no way to *do* anything — it is a comment, and CI does not read comments. **This is the strongest possible argument for §4.5 step 3 (`C7-PROV`): the intent to gate on validation already exists in this repo, in English, six lines above the arrays it governs. It just was not expressible in code.** Make it a field and it enforces itself.

#### The ruling

**On the brief's question — "should DE/FR be downgraded to WARN until validated?" — my answer is no, and I want to push back on the question itself.**

**WARN vs FAIL is a false choice here, because the gate does not fire at all.** Downgrading a dead branch from `error` to `warning` changes nothing that runs, resolves nothing that is wrong, and would produce a DECISIONS.md entry recording that we *acted* on item #12. **That is the same disease as the original defect: a status derived from a document rather than from a run.** It would be worse than doing nothing, because doing nothing is at least honestly recorded as nothing.

**And when DE content does land, WARN is affirmatively dangerous.** The failure mode is not "DE fires on the wrong word" — it is **"DE reports clean on `Luxusresort`"** (evidence 4). A false negative downgraded to WARN is a false negative nobody reads. **On the one gate with a tax liability behind it, an advisory verdict is exactly the "gate as theatre" that doctrine (g) and §0.2's verdict contract exist to forbid.**

**What must happen before this gate can be trusted — in dependency order. Steps 1–3 are prerequisites to step 4; validating a wordlist before fixing the matcher is validating the wrong artifact.**

| # | Action | Why it is first | Owner |
|---|---|---|---|
| **1** | **Fix the matcher for DE**: substring match (or a compound-aware matcher) for German, not `wordRe`. Commit the compound corpus in evidence (4) as a **fixture that must fire**. | Native review of a list the matcher cannot match is wasted expert time. **This is the bug; the list is downstream of it.** | Engineer |
| **2** | **Route lists by locale.** A file's locale selects its list. Ends the EN-fires-FR contamination and makes DE coverage measurable instead of masked. | Until this lands, no coverage number from this gate means anything. | Engineer |
| **3** | **Make the rule-set's provenance representable in code** — the `resolveReview()` pattern, applied to wordlists: each locale carries `{ terms, status: "seed" \| "validated", validated_by, validated_on }`. **No `validated_on` ⇒ `status: "seed"` ⇒ the list may not gate a launch — and the code, not a comment, says so.** Today the caveat lives in a `//` comment (`rules.js:38`) that CI cannot read; that is precisely how it got recorded ✅ LIVE. | **Makes the false-confidence state unrepresentable rather than merely documented.** | Engineer |
| **4** | **Native + legal review of the DE and FR lists.** FR: remove `séjour`/`séjours`, `hôte`/`hôtes`, `invité`/`invités` (evidence 5) — but a native must rule, not me. DE: confirm `Kur` (a *Kur* is a legitimate physician-prescribed course of treatment in German — banning it outright may strip the clinical register the lock is meant to protect, the mirror of the `séjour` error). | The actual §12.1 ask — **but fourth, not first.** | **Native speaker + Indian GST counsel** |
| **5** | **Fix the entity plumbing**: no KTAHV surface exists to lock. Until one does, the gate reports `NOT_APPLICABLE`, **never `PASS`** (SX). | Stops the dead branch from reading as a working control. | Engineer |
| **6** | **Negation-awareness + committed negation corpus**, starting with the live false positive in evidence (3). | The gate's only current output is a false positive on our best sentence. | Engineer |
| **7** | **Invert the exit codes** to house convention (2 = FAIL, 1 = harness error). | A gate CI can't distinguish from a crash is not a gate. | Engineer |

**The honest one-line status for §12.1 item #12, replacing "✅ LIVE":**

> **`C7-LOCK` — 🔴 NOT ENFORCING. Zero lifetime firings; no `ktahv` entity exists in the fleet. EN list untested in production; DE list structurally cannot match German compounds; FR list over-fires on clinical register; no locale routing; exit codes inverted; empty scan reports PASS.** Blocked on: matcher fix → locale routing → provenance in code → native/legal review. **The tax exposure this gate is believed to control is currently uncontrolled.**

> **★ The generalizable lesson, which is bigger than this gate.** §12.1's honesty discipline asked *"does a machine exist?"* and the answer was yes, so it wrote ✅ LIVE. It never asked the two questions that decide whether a machine matters: **"has it ever fired?"** and **"are its inputs correct?"** — and this one had **never fired in its life**. **Every ✅ in §12.1 needs a lifetime-firing count and a control probe next to it before it is believed.** That is §0.6 generalized from keyword volumes to gates themselves, and it is the `S12` row I added to §4.

---

## 5. The seven tributaries in detail

### 5.1 — C1 · Privacy, data & consent

#### India — DPDP Act 2023 + DPDP Rules 2025

The Rules were **notified 13 November 2025 (G.S.R. 846(E))** with an **18-month phased runway**: Data Protection Board provisions immediate; consent-manager provisions **13 Nov 2026**; **substantive obligations 13 May 2027** ([PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014&reg=3&lang=2), [EY](https://www.ey.com/en_in/insights/cybersecurity/transforming-data-privacy-digital-personal-data-protection-rules-2025), [India Briefing](https://www.india-briefing.com/news/dpdp-rules-2025-india-data-protection-law-compliance-40769.html/)) **[S]**.

**Pushback on the obvious reading:** the 2027 date invites "we have time." We do not, for two reasons. (i) Every site we ship between now and then will still be live in 2027 — building non-compliant now means a **retrofit across ~28 sites**, which is the 30× curve. (ii) GDPR already binds our DE/FR traffic **today** and is stricter. **Build to the stricter standard once.** The DPDP runway is a runway for *paperwork*, not for form design.

Requirements that touch what we build:
- **Consent must be free, specific, informed, unconditional, unambiguous, with clear affirmative action** (s.6) — no pre-ticked boxes, no bundling unrelated purposes ([Taxmann](https://www.taxmann.com/post/blog/lawful-processing-and-consent-under-dpdp-act), [K&K](https://ksandk.com/data-protection-and-data-privacy/dpdp-act-consent-rules/)) **[S]**.
- **Standalone notice in plain language**, with availability in the **22 scheduled languages** ([DPO India](https://www.dpo-india.com/Blogs/consent-management-india-dpdp-act/), [EY](https://www.ey.com/en_in/insights/cybersecurity/decoding-the-digital-personal-data-protection-act-2023)) **[S]**. → *This is an i18n requirement, which makes it an S5/S6 architecture decision, not a legal-page decision.*
- **Withdrawal as easy as giving** ([DPO India](https://www.dpo-india.com/Blogs/consent-management-india-dpdp-act/)) **[S]**.
- **Retention:** the Third Schedule's 3-year rule (+48h pre-erasure notice) bites at **≥2 crore registered Indian users** for e-commerce — **we are far below that**, so the *general* principle governs: erase when the purpose is served ([Seclore](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/), [Medianama](https://www.medianama.com/2025/11/223-dpdp-rules-2025-data-fiduciary-obligations/)) **[S]**. **Do not copy the 3-year number into our policy as if it applied to us** — that is a fact we would be inventing.
- **DPDP has no "sensitive personal data" category** — health data gets no special tier, unlike GDPR ([DPDP vs GDPR — consent.in](https://www.consent.in/blog/dpdp-vs-gdpr), [Protecto](https://www.protecto.ai/blog/dpdp-vs-gdpr-compliance-guide/)) **[S]**. **India is the looser regime. The EU visitor governs our design.**

#### EU — GDPR: the two provisions that actually decide our form

**(i) Article 9 — the enquiry form collects special-category data.** Art 9(1) prohibits processing "data concerning health" unless a 9(2) condition applies ([gdpr-info.eu Art 9](https://gdpr-info.eu/art-9-gdpr/)) **[P]**.

The tempting escape is **9(2)(h)** ("provision of health or social care or treatment"). **It is not available to a marketing lead form**, because **Art 9(3)** restricts 9(2)(h) to data processed *"by or under the responsibility of a professional subject to the obligation of professional secrecy"* **[P]**. A KTAHV enquiry landing in a marketing inbox is not that.

> **Ruling for our case: a KTAHV/Villa Raag enquiry form that asks "which condition do you want treated?" is processing Art 9 health data and must rely on Art 9(2)(a) EXPLICIT consent — a separate, unbundled, affirmative opt-in with its own purpose statement.** Not the same tick as the newsletter. Not the same tick as the privacy policy. **This is a form-design decision, which means it is an S5/S6 decision.** Discovering it at S9 means rebuilding the form and re-consenting the database.

There is a cheaper alternative worth putting to Abilash: **do not collect the condition at all in the web form.** If the field is dropped, the Art 9 problem largely disappears and the form falls back to ordinary Art 6 processing. A field that creates a special-category obligation to capture information a physician will re-take on the call anyway is a **bad trade**. That is a business decision, and it belongs at **S1**.

**(ii) Article 27 — we probably need an EU representative and probably do not have one.** A non-EU controller targeting EU data subjects (localised sites, EU-specific marketing) must designate an EU representative; the "occasional processing" exemption is narrow and explicitly unavailable where processing includes large-scale special-category data. Fines: **up to €10M or 2% of global turnover** (Art 83(4)(a)) ([gdpr-info.eu Art 27](https://gdpr-info.eu/art-27-gdpr/), [IAPP](https://iapp.org/news/a/eu-representative-on-how-to-operationalize-article-27-of-the-gdpr), [GDPR Local](https://gdprlocal.com/gdpr-art-27-requirements-explained/)) **[S]**.

We run **DE and FR locales for an Indian hospital and route EU patients to it**. That is textbook Art 3(2) targeting. **→ QUESTIONS.md for Abilash + counsel. This is not an agent decision.**

> **v2 timing note — this is now urgent in the useful direction.** §2 **[M]** shows we have **no DE/FR content yet**. **Art 27 designation is therefore a decision we can still make *before* the exposure exists, at S1, for the price of a conversation** — rather than discovering it after German patient enquiries are already in the CRM. **The gap between the exposure map and the repo is, for once, a window rather than a debt. It closes the day the first DE page ships.**

#### Cookies — ePrivacy, prior consent, and banners that are legal

- **Art 5(3) ePrivacy requires consent BEFORE storing/accessing anything on the device**, and applies **regardless of whether the data is personal**. Pre-ticked boxes are not consent — **CJEU C-673/17 *Planet49*** ([Osborne Clarke](https://www.osborneclarke.com/insights/planet49-cjeu-rules-consent-requirements-cookies), [Bird & Bird](https://www.twobirds.com/en/insights/2019/global/planet49-cjeu-rules-on-cookie-consent), [IAPP](https://iapp.org/news/a/cjeu-clarifies-cookie-consent-requirements)) **[S]**. → **Consequence: no GA4/GTM/Meta pixel may fire before consent. This is testable on the live site and must be tested there (S10), not asserted from a unit test.**
- **Reject-all must sit on the same layer as accept-all**, at equal weight. The EDPB Cookie Banner Taskforce found the absence of a same-layer "Reject all" is "not in line with the requirement for a valid consent and thus constitutes an infringement"; deceptive colour/contrast on the reject button and highlighting "Accept all" against "Refuse all" are "problematic" ([Syrenis](https://syrenis.com/resources/8-most-common-cookie-banner-mistakes-as-highlighted-by-the-edpb/), [Orrick](https://www.orrick.com/en/Insights/2023/01/5-Things-You-Need-to-Know-About-the-EDPBs-Cookie-Report), [WSGR](https://www.wsgrdataadvisor.com/2023/03/edpb-issues-guidance-on-cookie-banners/)) **[S]**. EDPB **Guidelines 03/2022** on deceptive design patterns adopted Feb 2023 **[S]**.
- **Google Consent Mode v2** adds `ad_user_data` and `ad_personalization` to `ad_storage`/`analytics_storage`; required for EEA traffic since **March 2024**, with staged degradation through **March 2025** (conversion modelling disabled without it) ([Google Ads Help](https://support.google.com/google-ads/answer/13695607?hl=en), [Usercentrics](https://usercentrics.com/knowledge-hub/googles-march-deadline-for-consent-mode-and-ads-privacy-compliance/), [Cookiebot](https://www.cookiebot.com/en/googles-consent-mode-deadline-ads-privacy-compliance/)) **[S]**. `packages/consent` already exists — **the gate is proving it denies by default and that no tag fires pre-consent.**

> **v2 — apply §4.5's lesson here before it repeats.** `packages/consent` "exists" the same way the clinical lock "was LIVE". **Existence is not enforcement.** Before `C1-PRECONSENT` is marked green: has it ever fired? What is its control probe — i.e. a fixture page that deliberately fires a tag pre-consent and **must** be caught? **A consent gate that has never rejected anything is a hypothesis.** This is the one place we can pay §4.5's lesson forward instead of re-learning it.

**India dark patterns:** CCPA's *Guidelines for Prevention and Regulation of Dark Patterns, 2023* name **13 dark patterns** (false urgency, confirm shaming, basket sneaking, drip pricing, forced action, subscription trap, interface interference, bait-and-switch, disguised ads, nagging, trick wording, SaaS billing, rogue malware), with a self-audit advisory issued to platforms ([Guidelines PDF](https://www.nls.ac.in/wp-content/uploads/2021/04/Dark-Patterns.pdf), [PIB advisory](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2134765), [IndusLaw](https://induslaw.com/publications/pdf/alerts-2023/induslaw-shedding-light-on-dark-patterns-in-india-final-version.pdf), [IAPP](https://iapp.org/news/a/india-s-ccpa-guidelines-on-dark-patterns-welcome-signal-but-law-is-still-soft)) **[S]**. **Note the convergence: the EU bans dark patterns via consent law, India via consumer law, and both land on the same banner.** One design satisfies both. Design it once, at S7.

**Machine-enforceable:** banner denies by default · reject-all present at layer 1 · button contrast/size parity · no pre-ticked inputs in any MDX/JSX form · every form has a consent checkbox + privacy link · policy pages exist and resolve in every locale · live pre-consent network trace clean.
**Human/lawyer:** lawful-basis determination · Art 27 designation · policy text · retention schedule sign-off.

---

### 5.2 — C2 · Health & medical claims *(the big one)*

**The governing principle across every jurisdiction below is the same: the claim must be true, substantiated, and within a permitted class BEFORE it is written. No disclaimer, footer, or asterisk repairs a claim that fails that test.**

#### India — DMR Act 1954

Sections, from [Indian Kanoon](https://indiankanoon.org/doc/1929849/) **[P-ish — Indian Kanoon transcription; India Code PDF 403'd twice, §0.3]**:

- **s.3** — no advertisement of a drug suggesting use for: **(a)** procuring miscarriage / preventing conception; **(b)** maintaining or improving sexual pleasure capacity; **(c)** correcting menstrual disorders; **(d)** **diagnosis, treatment, or prevention of any disease/condition specified in the Schedule**.
- **s.4** — no advertisement containing matter that **(a)** gives a false impression of the drug's true character, **(b)** makes a false claim, **(c)** is otherwise false or misleading in a material particular.
- **s.5** — magic remedies.
- **s.7** — **up to 6 months** imprisonment (first conviction), **up to 1 year** (subsequent); where the offender is a company, members can be deemed guilty.
- **s.2 "advertisement"** — *"any notice, circular, label, wrapper, or other document, and any announcement made orally or by any means of producing or transmitting light, sound or smoke."*
- **The Schedule** — **§0.3. Three secondary sources, three different lists. NOT usable as a rule-set. `C2-SCHEDULE` blocked.**

> **Open legal question, flagged not guessed:** the s.2 definition is a **1954 definition** and does not name websites. Whether website copy is an "advertisement" under it — via "other document" or "transmitting light" — is an **interpretive question for counsel**, not for me. **I am not asserting that it does.** But note the risk is not hypothetical either: the CCPA route (below) plainly reaches digital advertising for services, so the practical answer is *behave as if it applies*.

**Rule 170 — a live trap for anyone reading blog posts.** Rule 170 of the Drugs & Cosmetics Rules (state pre-approval + unique ID for AYUSH drug ads) was **deleted by the AYUSH Ministry on 1 July 2024**. The Supreme Court (Nagarathna & Viswanathan JJ) **vacated its 27 August 2024 interim stay**, so **the omission stands — there is currently no prior-approval requirement for AYUSH drug ads** ([Medical Dialogues](https://medicaldialogues.in/news/health/misleading-medical-ads-case-sc-disposes-ima-plea-lifts-stay-on-ayush-ad-pre-approval-rule-153283), [The South First](https://thesouthfirst.com/health/ayush-ads-get-green-light-supreme-court-lifts-ban-on-pre-approval-rule/)) **[S]**.

**Do not over-read this as deregulation.** The same Court on **26 March 2025** directed states to *implement* the DMR Act — appoint officers, build grievance mechanisms, and the Union to run a misleading-ads dashboard **[S]**. **Pre-approval went away; liability did not.** A confident agent could easily write "Rule 170 requires approval" (most blogs still say so) or "AYUSH ads are now unregulated" (the trade press implies it). Both are wrong.

#### India — CCPA Guidelines 2022: the regulator that reaches SERVICES

This is the instrument that most directly threatens KTAHV/Villa Raag/kairalicenters copy, because it is not limited to drugs.

*Guidelines for Prevention of Misleading Advertisements and Endorsements for Misleading Advertisements, 2022*, notified **9 June 2022**: duties on **manufacturers, service providers, advertisers and ad agencies**; claims must be **assessed, substantiated, verified or supported by relevant data**; penalties **up to ₹10 lakh**, **up to ₹50 lakh** for subsequent contraventions; endorser bans **1 year / 3 years**; applies across TV, radio, print **and social media** ([PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1832906), [ELP](https://elplaw.in/leadership/guidelines-on-misleading-advertisements-in-india/), [Mondaq](https://www.mondaq.com/india/social-media/1312524/ccpa-guidelines-for-misleading-advertisements-and-endorsements-2022)) **[S]**.

**ASCI:** all advertisements must be truthful and **all descriptions, claims and comparisons capable of substantiation**; no claim so exaggerated as to cause grave or widespread disappointment. ASCI signed an **MoU with the Ministry of AYUSH (2017)** specifically on misleading Ayurveda/AYUSH advertising ([ASCI Code](https://www.ascionline.in/wp-content/uploads/guidelines/ASCI_Codes_Guidelines_Book.pdf), [ASCI](https://www.ascionline.in/the-asci-code/)) **[S]**.

#### UK — ASA/CAP: the most pointed finding in this document

CAP's advice page on **Ayurvedic medicine** says, in terms:

> CAP **"has not seen evidence for the efficacy or benefits of this discipline"** and consequently **advises marketers against making claims for Ayurvedic Medicine**. It also notes *"No regulatory body seems to exist for this discipline."*
> — [ASA/CAP — *Health: Ayurvedic medicine*](https://www.asa.org.uk/advice-online/health-ayurvedic-medicine.html) **[P — the regulator's own page]**

And the general rule: a **medicinal claim** is *"a claim that a product or its constituent(s) can be used with a view to making a medical diagnosis or can treat or prevent disease"*, and **medicinal claims can only be made for a licensed medicinal product** (**CAP rule 12.1**); **rule 12.2** guards against discouraging essential medical treatment; **rule 12.3** requires CAM practitioners offering significant or invasive treatments to encourage consumers to take **independent medical advice** ([ASA/CAP — *Healthcare: Medicinal claims*](https://www.asa.org.uk/advice-online/healthcare-medicinal-claims.html)) **[P]**. Substantiation for health claims normally needs **at least one experimental human study, ideally double-blind and placebo-controlled** ([ASA/CAP — *Substantiation for health, beauty and slimming claims*](https://www.asa.org.uk/advice-online/substantiation-for-health-beauty-and-slimming-claims.html)) **[S]**.

**MHRA/THR:** a registered traditional herbal medicine is indicated as *"a traditional herbal medicinal product used for the temporary relief of symptoms of [X] **based on traditional use only**"*; ads must reflect the approved indication **in its entirety**, must carry "based on traditional use only", and **must not state or imply that registration is based on clinical trials** ([GOV.UK THR guidance](https://www.gov.uk/guidance/apply-for-a-traditional-herbal-registration-thr), [MHRA THR mark guidance PDF](https://assets.publishing.service.gov.uk/media/5fef1924e90e0776aa141302/The_Traditional_Herbal_Registration__THR__Certification_Mark_Guidance_for_Business.pdf), [ASA/CAP — herbal](https://www.asa.org.uk/advice-online/health-herbal-medicine.html)) **[S]**.

> **This is a strategy fact, not a legal footnote, and it belongs at S1/S4:** in the UK we can describe **what Ayurveda is and what we do**; we essentially cannot advertise **that it works**. Any UK-facing plan whose commercial engine is an efficacy claim **does not have a business model** — it has a compliance incident with a launch date. Surface that at **S4 ("will it sell?")**, because "it would sell if we could say the thing we can't say" is the honest answer and it changes the plan.

#### US — FDA + FTC

- **FDA:** structure/function claims ("supports", "maintains", "promotes") are permitted with the **DSHEA disclaimer** — *"This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease."* **Disease claims** (treat/mitigate/cure/prevent) are drug claims and are not available to supplements ([FDA — Structure/Function Claims](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/structurefunction-claims), [FDA — Label Claims](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements), [FDA — Small Entity Compliance Guide](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/small-entity-compliance-guide-structurefunction-claims)) **[S]**. The line is narrow — *"promotes good brain health"* ok; *"...and prevents the onset of dementia"* not ([CHPA](https://www.chpa.org/news/2021/11/understanding-dietary-supplement-claims)) **[S]**.
- **FTC (Health Products Compliance Guidance, 20 Dec 2022 — replaced the 1998 supplements guide).** **v2 adds Covington** at a working URL (v1 recorded it 404) — a **sixth** independent firm, and the first to give the definition verbatim **[S]**:
  - *"competent and reliable scientific evidence"* = **"tests, analyses, research, or studies that (1) have been conducted and evaluated in an objective manner by experts in the relevant disease, condition, or function to which the representation relates; and (2) are generally accepted in the profession to yield accurate and reliable results,"** and must be **"sufficient in quality and quantity based on standards generally accepted in the relevant scientific fields"** ([Covington](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide)).
  - RCTs are **generally necessary**, but **"FTC does not require a specific number of RCTs to meet that standard; the quality of the research is more important than the quantity"**; high-quality epidemiologic evidence is accepted only where experts consider it an acceptable substitute and **"RCTs are not otherwise feasible"** ([Covington](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide), [MWE](https://www.mwe.com/insights/after-almost-25-years-ftc-issues-new-health-products-compliance-guidance/), [Reed Smith](https://www.reedsmith.com/articles/ftc-issues-significant-updated-guidance-for-health-related-claims/)) **[S]**.
  - **Does NOT qualify:** animal studies, in vitro studies, epidemiological/observational studies, anecdotal evidence, public health recommendations; consumer surveys are **"nothing more than a collection of anecdotal experiences"**; **"a dietary supplement approved under a foreign monograph does not constitute substantiation"** ([Covington](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide)) **[S]**.
  - Disclosures must be **"clear and conspicuous"** — **"difficult to miss (i.e., easily noticeable) and easily understandable by ordinary consumers"**; **"vague qualifying terms, such as 'may' or 'helps,' are inadequate"** ([Covington](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide)) **[S]**. Hedges like *"promising," "preliminary," "initial," "pilot"* are read by consumers as **positive attributes, not disclaimers**; atypical testimonials **cannot be cured** by "results not typical" ([Cooley](https://www.cooley.com/news/insight/2023/2023-03-02-ftc-revises-health-products-compliance-guidance), [Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/misguided-the-ftc-attempts-to-redefine-the-law-with-its-health-products-compliance-guidance), [Wilson Sonsini](https://www.wsgr.com/en/insights/ftc-releases-health-products-compliance-guidance.html), [BBB National Programs](https://bbbprograms.org/media/insights/blog/ftc-health-claims-guidance)) **[S — FTC primary 403'd twice, §0.2]**.

> **★ Two of those lines are aimed straight at us, and they are new in v2.**
> **"A dietary supplement approved under a foreign monograph does not constitute substantiation."** The **Ayurvedic Pharmacopoeia of India is a foreign monograph** to the FTC. **Our single best substantiation asset — classical and pharmacopoeial authority, the thing a WHO-GMP Ayurvedic manufacturer would naturally lead with — is worth zero as US substantiation.** That is not a gap in our evidence; it is a **category mismatch**, and no amount of better sourcing inside the Ayurvedic tradition closes it.
> **"Vague qualifying terms, such as 'may' or 'helps,' are inadequate."** This kills the instinctive fix. When a claim fails, the reflex is to soften it — *"may help support…"*. **The FTC has pre-refused the hedge.** Softening language does not lower the substantiation bar; it just makes the same unsubstantiated claim quieter. **This is §1(c) applied to the specific escape hatch our writers will actually reach for**, and it belongs in the S6 writers' brief verbatim.

**Note the disagreement, honestly:** Kelley Drye's piece is titled *"Misguided: The FTC Attempts to Redefine the Law…"* — the defence bar contends the FTC's RCT-for-everything posture **overstates** the case law **[S]**. **Who is right for us?** Irrelevant to our decision. We are a foreign company with no appetite to be the test case that resolves it, and our substantiation for most claims is *classical text*, not RCTs. **We plan to the FTC's stated standard.** The argument is only worth having if we intend to litigate, and we do not.

#### EU — Nutrition & Health Claims Regulation + the 2025 CJEU ruling

- **Art 10(1)** — only **authorised** claims may be used; **Art 10(3)** — any reference to **general, non-specific** health benefits must be **accompanied by a specific authorised health claim** ([Mills & Reeve](https://www.mills-reeve.com/publications/on-hold-botanical-claims-eu-challenge/), [PGEU](https://www.pgeu.eu/botanicals-and-health-claims/)) **[S]**.
- **CJEU Case C-386/23 *Novel Nutriology* (2025), ECLI:EU:C:2025:304** — Art 10(1) contains a **"fundamental ban" on health claims**; botanical health claims **cannot be used in commercial advertising without prior authorisation, even during the Commission's prolonged suspension** of botanical assessment. Only claims **timely submitted by Member States in 2008** qualify as protected "on-hold" claims; the Court rejected the fundamental-rights challenge ([King & Spalding](https://www.kslaw.com/news-and-insights/european-court-of-justice-restricts-advertising-for-food-with-botanicals), [Cambridge — EJRR case note](https://www.cambridge.org/core/journals/european-journal-of-risk-regulation/article/health-claims-on-botanical-substances-prohibited-pending-commission-evaluation-case-c38623-novel-nutriology-2025-eclieuc2025304/A905507541D9DB8FA629BA9FF103C903), [Food Compliance International](https://foodcomplianceinternational.com/industry-insight/news/5368-the-cjeu-clarifies-use-of-health-claims-on-botanicals)) **[S]**.

> **This is a 2025 ruling and it closes the door the industry had been walking through.** Any KAPPL/Shopify plan that assumed "on-hold botanical claims are usable in the EU pending assessment" is **out of date as of 2025**. If our EU copy leans on ashwagandha/turmeric health claims, that is a **live problem now**, on already-built pages — which is exactly the retroactive sweep the `S12` row now mandates.

#### The claims tier system (the machine-enforceable output of all the above)

Assign every claim a tier at **S6**; the tier determines the lint and the reviewer.

| Tier | Example | Permitted where | Gate |
|---|---|---|---|
| **T0 — Descriptive** | "Panchakarma is a five-action cleansing procedure described in the classical texts." | Everywhere | Lint only |
| **T1 — Traditional-use, attributed** | "Traditionally used in Ayurveda to support digestion." | India, UK (THR framing), US (structure/function + DSHEA disclaimer). **EU: NOT for foods/supplements post-C-386/23 without an authorised claim.** | Lint + reviewer |
| **T2 — Structure/function** | "Supports healthy joints." | US w/ DSHEA disclaimer; India w/ substantiation. **UK: CAP says no for Ayurveda. EU: authorised claims only.** | **Dr. Deepu John** + market check |
| **T3 — Therapeutic / disease** | "Treats psoriasis." | **KTAHV clinical pages only**, as a description of *care provided under physician supervision* — **never** as a product claim, **never** for a DMR Schedule disease in an ad | **Physician + legal** |
| **T4 — Prohibited** | "Cures diabetes." · "Guaranteed results." · anything against a **DMR Schedule** disease | **Nowhere. Ever.** | **Hard CI fail** |

**Why "cure" is banned — the actual reasons, stacked (Abilash asked):** (1) **DMR s.3(d)** — advertising a drug for treatment/prevention of a Schedule disease is a criminal offence, s.7 imprisonment; (2) **CCPA 2022** — unsubstantiated service claims, ₹10–50 lakh; (3) **CAP 12.1** — medicinal claims need a licensed product; (4) **FTC/FDA** — a disease claim converts a supplement into an unapproved drug; (5) **EU Art 10(1)** — fundamental ban; (6) **GST** — "cure" pulls toward the treatment/therapy framing the AAR reads off our website (§5.7); (7) **YMYL** — a cure claim is the fastest route to a low-quality rating. **Seven independent regimes converge on one word.** `CURE_CLAIM_PATTERNS` in `packages/compliance/src/rules.js` already gates it — this section is the *why* that was missing.

> **v2 caveat, from §4.5 evidence (3): the cure lint's only live finding is a false positive on our own honesty statement.** *"no disease-cure claims"* is flagged as a cure claim. **The seven regimes above all converge on banning the CLAIM "we cure X" — not on banning the DENIAL "we do not cure X", which is the sentence every one of them would want us to write.** A lint that cannot tell those apart is not enforcing the seven regimes; it is enforcing a substring. **Negation-awareness is not a nicety here — it is the difference between the gate implementing the law and merely resembling it.**

**Machine-enforceable:** T4 pattern lint (exists, **negation-blind — fix first**) · Schedule-disease term × claim-verb proximity (**BLOCKED — §0.3**) · DSHEA disclaimer present on US-facing supplement pages making structure/function claims · "based on traditional use only" on UK THR pages · every T1+ claim carries a `substantiation` frontmatter key · **`substantiation: "classical-text"` + US/EU market → FAIL** (the foreign-monograph rule, above — this one is newly machine-checkable and worth building) · EU locale + botanical claim → fail unless `authorised_claim_id` present.
**Human/lawyer:** whether a specific claim is substantiated · T2/T3 sign-off · the DMR "is a website an advertisement" question · anything novel.

---

### 5.3 — C3 · YMYL / E-E-A-T editorial duty

Not law — but for a 3,400-page health encyclopedia it is the **commercial** equivalent, and it is a **prerequisite**, not a polish step.

- Google's **Search Quality Rater Guidelines** (latest revision **11 September 2025**) treat health/safety content as **YMYL**, where an error can cause real harm ([SQRG PDF](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf), [Search Engine Land — YMYL guide](https://searchengineland.com/guide/ymyl), [SEOZoom](https://www.seozoom.com/google-search-quality-rater-guidelines/)) **[S]**. For health/medical/wellness, **assume everything is YMYL.**
- **Lowest** quality rating attaches to content copied/paraphrased, **AI-generated in a "low-effort way"**, lacking originality, or filler created at scale to inflate length **[S]**. → **This is the direct threat to a 3,400-page programme** and is why the scaled-content test sits at **S4**.
- **E-E-A-T is not a checkbox.** Lily Ray (Jan 2026): *"Really wild to see authoritative health publishers who have dominated in SEO for many years get hit so hard by this last core update"* — Healthline, Medical News Today and WebMD all reportedly dropped after the **December 2025** core update ([Lily Ray — E-E-A-T](https://lilyray.nyc/e-a-t-expertise-authoritativeness-trustworthiness/)) **[R]**. **Read that correctly:** it does **not** mean E-E-A-T stopped mattering — it means *having a physician byline is not sufficient*. Byline + no information gain still loses. Do not let this become an excuse to skip review; do not let it become a promise that review guarantees rankings. **[R] — treat as a lead, not a strategy.**
- **Machine-representable via schema:** `MedicalWebPage` with **`reviewedBy`** and **`lastReviewed`** ([schema.org/MedicalWebPage](https://schema.org/MedicalWebPage), [schema.org med docs](https://schema.org/docs/meddocs.html)) **[P]**. **Honest caveat:** Google has **no dedicated rich result** for `MedicalWebPage` — this is a trust/credentialing signal, not a SERP feature **[R]**. Claim it as hygiene, not as a growth lever.

> **★ C3 is the one tributary where our enforcement is real, and it is worth naming why — it is the template for everything §4.5 says is missing.** `resolveReview()` (`sites/whatisayurveda.com/app/lib/medical-review.ts`) is the **only** gate in this document that has both fired and been proven. It works because of three properties the clinical lock lacks:
> 1. **It throws, it does not warn.** `reviewedBy` without `reviewedOn` is a build-stopping error.
> 2. **It states the honest absence in code, not in a comment.** No `reviewedOn` ⇒ no byline, no `lastReviewed`, no Physician node. The unreviewed state is **representable and safe**; the false-claim state is **unrepresentable**. Compare `rules.js:38`, where "these lists are unvalidated" is a `//` comment CI cannot read — **which is exactly how it got recorded ✅ LIVE.**
> 3. **Its data carries provenance.** The roster names who is on the panel *and* explicitly lists who is NOT usable and why (Dr. Ashika/Ashikha's contradictory spellings; Dr. Anagha's unpublished surname). **It refuses to guess a real doctor's name.** That is §0.3's discipline, in code, shipped.
>
> **Step 3 of §4.5's remediation is literally "do what `resolveReview()` did, to the wordlists."** The pattern is in the repo. It has not been copied.

**Machine-enforceable (this is the easy win — nearly all of it):** frontmatter requires `reviewedBy` + `reviewerCredentials` + `lastReviewed` + `citations[]` on every health page · `lastReviewed` older than N months → warn (S11 sweep) · reviewer must resolve against the roster in config (per MEMORY: the roster is config, **not hard-coded** — the head can change) · `reviewedBy` must emit into `MedicalWebPage` JSON-LD · author page exists with credentials + `sameAs`.
**Human:** Dr. Deepu John's actual review. **A schema field asserting review that did not happen is worse than no field — it is a false trust signal about medical content.** Bind the frontmatter key to a real sign-off artefact, or don't ship the key.
**Open YMYL gap (from the roster file, unresolved):** **no medical-council registration numbers are published for any of our five physicians.** That is the first thing a quality rater — or a regulator — looks for on health content. → §8.

---

### 5.4 — C4 · Accessibility

**Why this is a design-stage decision — with numbers.** Deque: **1× design / 5× dev / 15× QA / 30× production**; accessibility left to final QA consumes ~**20% of project budget** (~$75k on a $500k refresh) vs ~**5%** (~$25k) when moved into design reviews, pre-commit automation and CI ([Deque](https://www.deque.com/blog/doing-the-numbers-digital-accessibility-and-shifting-left/), [Deque shift-left calculator](https://www.deque.com/accessibility-roi-calculator/)) **[S]**.

**Why overlays are not an option — and the evidence is now a regulator's.** In **January 2025 the FTC announced a $1M settlement with accessiBe** for claiming its widget could make any site WCAG-compliant; the FTC found the claims *"false, misleading, or unsubstantiated"*; final order approved **April 2025**, running **20 years**. Per UsableNet's 2024 year-end report, of **4,000+** ADA digital lawsuits filed in 2024, **~25% cited accessibility widgets/overlays as barriers** rather than solutions ([Accessibility.Works](https://www.accessibility.works/blog/avoid-accessibility-overlay-tools-toolbar-plugins/), [TestParty](https://testparty.ai/blog/accessibility-widget-lawsuits), [Charles Jones](https://charlesjones.dev/blog/accessibility-overlays-not-wcag-compliance-legal-risk)) **[S/R]**.

> **Pushback, pre-emptively:** when someone proposes a one-line accessibility widget to close the gate before launch, the answer is **no**, and the reason is not purism — **the FTC fined the biggest vendor for the exact claim being made to us**, and overlays are now *cited as the barrier* in a quarter of US suits. It is a gate-weakening move (doctrine (g)) that also *increases* risk.

**Standard.** **WCAG 2.2 AA.** New AA criteria over 2.1: **2.4.11 Focus Not Obscured (Minimum)** (sticky headers/footers are the usual culprit), **2.5.7 Dragging Movements**, **2.5.8 Target Size (Minimum) — 24×24 CSS px**, **3.3.8 Accessible Authentication (Minimum)** (no cognitive-function test; must allow password managers and paste) ([W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/), [W3C — What's New in 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/), [Deque University](https://dequeuniversity.com/resources/wcag-2.2/)) **[P]**.

**The legally-operative EU standard is 2.1 AA, not 2.2 — say this accurately (v2, §0.2 gap #4 upgraded [R] → [S]).** **EN 301 549 V3.2.1** is the version cited in the Official Journal, by **Implementing Decision (EU) 2021/1339 (18 Aug 2021)**, and it references **WCAG 2.1 AA**. **V4.1.1** (incorporating WCAG 2.2, developed under Commission Standardisation Request **M/587**) followed a draft **V4.1.0 in Nov 2025** and is expected to be OJ-cited around **October 2026** — **and only an OJ citation gives a standard legal effect** ([EC — Web accessibility standards, latest changes](https://digital-strategy.ec.europa.eu/en/policies/latest-changes-accessibility-standard) **[S]**, [EN 301 549 — Wikipedia](https://en.wikipedia.org/wiki/EN_301_549) **[R]**, [Skynet](https://www.skynettechnologies.com/blog/en-301-549-v4-1-1-european-accessibility-standards) **[R]**).

> **Build to 2.2 AA anyway — and note this is NOT the usual "exceed the standard" hand-wave.** The delta is four AA criteria, all of which are **design properties we are choosing at S7 regardless** (target size, focus visibility, no drag-only, no cognitive-test auth). Choosing 2.1 over 2.2 does not save us work — **it just means choosing the smaller target-size number while drawing the same button.** And V4.1.1 lands ~Oct 2026, inside the life of every site in this sprint; retrofitting then is the 30× curve for a saving of zero. **The one thing we must not do is tell anyone — a client, a regulator, or ourselves — that 2.2 is currently legally required in the EU. It is not. We build to it because it is free, not because we are made to.**

**European Accessibility Act — does it bind us?** Enforcement began **28 June 2025**; all 27 Member States have transposed. It covers **e-commerce services** (plus banking, telecoms, transport ticketing, AV media) and applies based on **where you sell, not where you are based** — a non-EU operator offering covered services to EU consumers is in the same position as an EU one. **Microenterprise exemption: fewer than 10 employees AND turnover/balance sheet ≤ €2M — both conditions**, and it applies **only to services**, not to products ([Greenberg Traurig](https://www.gtlaw.com/en/insights/2025/7/european-accessibility-act-compliance-what-businesses-in-the-eu-market-need-to-know), [Accessible.org — EAA e-commerce](https://accessible.org/eaa-ecommerce-services-requirements/), [Barrierenlos](https://barrierenlos.com/en/accessibility-hub/legal/bfsg-exceptions/microenterprise/)) **[S]**. Germany's BFSG allows fines **up to €100,000** **[S]**.

> **Applicability ruling for us — with the uncertainty stated, not hidden.**
> - **Kairali Group is nowhere near a microenterprise → no exemption is available to us.**
> - **The Shopify store, IF it sells to EU consumers, is an "e-commerce service" and is in scope.** **Whether it does is a fact I do not have → §8.** This is the single highest-value unknown in this document: it flips the EAA and Art 27 from "probably" to "definitely".
> - **Purely informational sites** (whatisayurveda, hospital brochureware) are **not clearly** covered — the EAA lists services, and none of the sources I fetched addressed informational sites; Greenberg Traurig's piece is silent on it **[S]**. **I am not asserting they're in scope.** But since we ship them from `packages/ui`, and the accessible component costs 1× at design, **the cheapest policy is a single accessible component library** — then the applicability question stops being load-bearing. **Solve it with architecture, not with legal analysis.**

**Machine-enforceable (~30–40% of WCAG at best — say so honestly):** axe-core/Lighthouse in CI on every template · contrast tokens validated in `brand-tokens.css`/`raag-tokens.css` at build · target-size lint on interactive components (2.5.8) · every image has alt · form inputs have labels · heading order · lang attribute per locale · keyboard-trap test in the spec suite.
**Human:** screen-reader pass · focus-order judgement · alt-text *quality* (a machine confirms alt exists; only a human confirms it says something useful) · cognitive load. **Never report "axe clean" as "accessible."**

---

### 5.5 — C5 · E-commerce (Shopify track)

Under the **Consumer Protection (E-Commerce) Rules, 2020** ([Rules PDF](https://thc.nic.in/Central%20Governmental%20Rules/Consumer%20Protection%20(E-Commerce)%20Rules,%202020.pdf), [PSL Advocates](https://www.pslchambers.com/psl-release/an-overview-of-the-consumer-protection-e-commerce-rules-2020/), [TeamLease RegTech](https://www.teamleaseregtech.com/blogs/134/e-commerce-compliance-in-india-understanding-the-consumer-protection-e-commerce-rules-2020/)) **[S]**:

- **Country of origin** on listings; importer details for imported goods.
- **Total final price** including all taxes and delivery charges, shown upfront.
- **Return, refund, exchange, warranty, shipping terms** disclosed.
- **No refusal to refund** for goods/services that are defective, deficient, delivered late, or not as advertised.
- **Grievance Officer** — acknowledge in **48 hours**, resolve within **one month**; resident **Nodal Officer**.
- **Consent by explicit affirmative action only — no pre-ticked boxes, no automatic recording.** *(Note the convergence with DPDP s.6 and Planet49 — same rule, three regimes.)*

**Claims substantiation on PDPs is C2, not C5** — a PDP is an advertisement. Everything in §5.2 applies to product copy, and for a WHO-GMP Ayurvedic manufacturer the PDP is the **highest-risk page type we own**: it is where a T4 claim is most tempting and most consequential.

**Shopify-track doctrine interlock:** agent is **READ-ONLY** in the admin (doctrine (k)) — we **audit and prepare; humans publish**. **PDP URL changes must be flagged to Vikash BEFORE they happen** (doctrine (m)) — and note the compliance angle: **a compliance-driven PDP takedown or slug change is still a live-ads event.** A URL changed for a good legal reason still breaks a paid campaign. `scripts/shopify-catalog-lint.mjs` runs Mondays (doctrine (l)); **claims linting belongs in that same pass.**

**Machine-enforceable:** required policy pages exist and resolve · PDP frontmatter requires `country_of_origin`, `price_includes_tax`, `returns_policy_url` · grievance-officer block present · no pre-ticked inputs · claims lint over product copy per destination market.
**Human:** the grievance officer is a **real named person** (never invent one — rule 6) · returns terms · pricing.

---

### 5.6 — C6 · Advertising platform policy (landing pages)

Platform policy is **stricter and faster than law** — no due process, no appeal worth the name, and the penalty lands on the account, not the page.

- **Google Ads healthcare & medicines:** some content cannot be advertised at all; some only in certain locations by **certified** advertisers. **Unapproved pharmaceuticals and supplements** are prohibited "regardless of any claims of legality", explicitly including **herbal and dietary supplements with active pharmaceutical or dangerous ingredients**. Enforcement language is unusually blunt: violations are **"egregious"**, accounts are **suspended upon detection and without prior warning**, and the advertiser is **not allowed to advertise with Google Ads again** ([Google — Healthcare and medicines](https://support.google.com/adspolicy/answer/176031?hl=en), [Google — Unapproved pharmaceuticals and supplements](https://support.google.com/adspolicy/answer/2423645?hl=en), [Google — Unapproved substances](https://support.google.com/adspolicy/answer/15595718?hl=en), [Google Merchant Center — Healthcare](https://support.google.com/merchants/answer/6150151?hl=en)) **[P — Google's own policy pages]**.
- **Meta:** the **Personal Attributes** policy forbids ads that **assert or imply** knowledge of a person's attributes **including medical conditions**, and covers **indirect implication**, not just explicit statements ([Meta Transparency Center — Privacy Violations and Personal Attributes](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/), [Meta — Health and Wellness](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness/), [Meta Business Help — Personal Health](https://www.facebook.com/business/help/2489235377779939)) **[P]**. The practical tell: **the word "you."** *"Struggling with your arthritis?"* implies we know the reader has arthritis → violation. *"Ayurvedic care for arthritis"* does not. **Before/after imagery** is a standard failure mode **[R]**.

> **Why this belongs at S4, not S10:** an LP whose entire hook is *"Cure your psoriasis"* is not a page that gets rejected — **it is an account that gets banned without warning, permanently**. That is not a content defect, it is **losing the channel**. So the ad-platform question — *can this offer legally be advertised at all, in this market?* — must be answered **before** anyone designs the landing page. Landing pages are built last (per the sprint build order) precisely because they carry the most concentrated claim risk; **but their compliance question is asked first.**

**Machine-enforceable:** LP claims lint (T4 hard-fail) · second-person + condition-noun proximity check ("your arthritis") for Meta · `noindex` on `/lp/*` · `data-cta` present.
**Human:** Google certification · the appeal · the judgement call on implied attributes.

---

### 5.7 — C7 · GST / tax language (KTAHV only)

**The rule.** **Entry 74 of Notification 12/2017-Central Tax (Rate)** (28 June 2017) exempts **health care services** provided by a **clinical establishment**, an **authorised medical practitioner** or **paramedics**. Ayurveda, Yoga, Naturopathy, Siddha, Unani and Homeopathy **are recognised systems** and qualify **at par with allopathy** ([TaxGuru](https://taxguru.in/goods-and-service-tax/gst-applicable-naturopathy-ayurveda-yoga-siddha-unani-homeopathy-based-medical-treatments.html), [ClearTax](https://cleartax.in/s/yoga-physical-mental-spiritual-practices-taxability-under-gst), [AMLEGALS](https://amlegals.com/taxability-of-supply-of-wellness-or-therapy-services-under-gst/)) **[S]**.

**The exemption is won or lost on characterisation — and the authorities read the website.**

| Ruling | Outcome | What decided it |
|---|---|---|
| **Devaaya (AAR Goa)** | **Exempt** | Diagnosis, medicines, consumables **under supervision of qualified doctors** → clinical establishment ([Taxscan](https://www.taxscan.in/naturopathy-yoga-ayurveda-health-care-services-no-gst-aar/37798)) **[S]** |
| **Ayushya Ayurvedic Centre (AAR Kerala)** | **Split** | **Inpatient** care exempt incl. medicines; **outpatient** medicines **taxable** even on prescription ([Studycafe](https://studycafe.in/ayurvedic-healthcare-services-to-inpatients-entitled-for-gst-exemption-aar-kerala-421116.html)) **[S]** |
| **Aahana Naturopathy** | **Denied** | **The authority quoted the applicant's own website**: *"Western Spa therapies…multitude of relaxing therapies"*; legislative intent is **not** to exempt *"western spa and relaxing therapies"*; framed as a **"five star luxury wellness package"** ([TaxGuru](https://taxguru.in/goods-and-service-tax/aahana-naturopathy-centre-eligible-gst-exemption.html)) **[S — preview only, §0.2 gap #3]** |
| **Oswal Industries / Nimba Nature Cure (AAAR Gujarat)** | **Denied** | **Accommodation = principal supply** in a composite package; no outdoor patients; indoor stays < 7 days → not a clinical establishment ([AAAR order PDF](https://gstcouncil.gov.in/sites/default/files/2024-02/guj_aaar_03_2022_oswal.pdf), [Taxmann](https://www.taxmann.com/post/blog/no-gst-exemption-on-providing-package-comprising-of-accommodation-food-different-types-of-health-therapy-aaar/)) **[S]** |
| **Corbett Nature Reserve (AAAR Uttarakhand)** | **Denied** | Wellness services inside a resort = part of **accommodation**; the centre **marketed accommodation as the primary offering** ([SCC Online](https://www.scconline.com/blog/post/2022/05/06/applicability-of-gst-on-service-of-naturopathy-provided-with-accommodation-service/), [N J Jain](https://njjain.com/industry-news/wellness-centres-liable-to-pay-gst-key-rulings-and-implications/)) **[S]** |

> **This is why the KTAHV lock exists, stated properly at last:** the difference between an exempt hospital and a taxable resort is **substance first — physician supervision, admission/discharge, real clinical process — and characterisation second.** Our website is the most public, most permanent, most quotable evidence of that characterisation. **"Luxury spa package" on a KTAHV page is a sentence drafted for the other side's brief.**

**Two honest boundaries, so this doesn't get over-applied:**
1. **The lock cannot save a business that is actually a resort.** Aahana and Nimba lost on **substance** (accommodation as principal supply), not vocabulary. Word-linting a resort into a hospital is not a strategy, and if anyone proposes the lock as a *substitute* for clinical substance, that is a pushback moment. The lint protects a true clinical operation from **mischaracterising itself**. It does not manufacture one.
2. **Do NOT cross-apply.** Villa Raag **is** hospitality; wellness/resort language there is **correct** and the lock must never leak onto it (CLAUDE.md is explicit; `CLINICAL_LOCK_ENTITIES = new Set(["ktahv"])` already encodes this). **Over-applying the lock is also a failure**, and a costlier one than it looks — it would strip Raag of the exact language that sells it.

#### ★ v2 — REVERSING v1's enforcement ruling

**v1 wrote:** *"Machine-enforceable: `CLINICAL_LOCK_BANNED` per locale, entity-scoped (**exists**) · **hard-fail, not warn, on KTAHV EN/DE/FR**."*

**That ruling is withdrawn. It was reasoned from the source comments rather than from a run, and §4.5 shows every clause of it is wrong:**

| v1 said | Actually **[M]** |
|---|---|
| "entity-scoped (**exists**)" | Exists and **has never executed** — no `ktahv` entity anywhere in the fleet |
| "**hard-fail** on EN/DE/FR" | Hard-fails on **nothing**; and `bin/lint.js` exits **1**, not the house's **2** |
| "per locale" | **No locale routing** — all three lists run against every file |
| (implicit) the DE list enforces German | **Cannot match German compounds at all** |
| (implicit) the FR list protects clinical register | **Fires on `séjour hospitalier`** — it attacks the clinical register |

**The corrected ruling is §4.5's seven-step table.** The short form: **fix the matcher → route by locale → put provenance in the code (the `resolveReview()` pattern) → then native + legal review → and keep it at FAIL, never WARN, because an advisory verdict on a tax-liability gate is theatre.** The gate does not become trustworthy by changing its severity; it becomes trustworthy by firing correctly once.

**Machine-enforceable:** `CLINICAL_LOCK_BANNED` per locale, entity-scoped — **🔴 present but not enforcing, §4.5** · a locale whose list is `status: "seed"` blocks at **S1**, not S8 · new locale with no banned-list = launch blocker (already doctrine, and **the one part of this that is genuinely sound**).
**Human:** **native + legal review of DE/FR** — the actual §12.1 ask, and **step 4 of 7, not step 1**. A German page saying *"Kur"* or *"Luxus"* carries exactly the risk the EN list is designed to stop; we are guessing at the list AND cannot match it. **Both must be fixed, in that order.**

---

## 6. Machine enforcement — concrete spec against the real repo

`packages/compliance/src/rules.js` already carries `CLINICAL_LOCK_BANNED`, `CURE_CLAIM_PATTERNS`, `BANNED_FILLER`, `LOCKED_FACTS`, `CLINICAL_LOCK_ENTITIES`. **It already declares the gap this document fills**, in its own comment:

> *"The full claims-jurisdiction matrix (DMR/ASCI, MHRA, FDA/FTC, EU) needs per-market phrase lists — v1 gates the universal floor only. See QUESTIONS.md."*

**And that is the shape of the whole problem: the honesty is in a comment.** `rules.js:5-6` says the DE/FR lists "await native/legal confirmation" — **a `//` comment, which CI cannot read, which §12.1 did not read, and which is why the gate was recorded ✅ LIVE.** Every rule below is a proposal for Abilash's ratification, not a change I am making.

**Rule 0 — the precondition for all of them:** *a caveat that lives in a comment is not a caveat; it is a decoration.* **Any constraint that must hold at CI time is a field, not a sentence.** That is `resolveReview()`'s whole lesson (§5.3) and this repo has exactly one instance of it.

| ID | Rule | Stage | Data needed | Verdict |
|---|---|---|---|---|
| **`C7-PROV`** ★ | **Wordlists carry `{status, validated_by, validated_on}`; `status:"seed"` ⇒ may not gate a launch, enforced in code** | **S1** | — | **fail — build first (§4.5 step 3)** |
| **`C7-MATCH`** ★ | **DE matcher is compound-aware; committed compound fixture must fire** | S8 | fixture in §4.5(4) | **fail — build first** |
| **`C7-ROUTE`** ★ | **File locale selects its wordlist; no cross-locale firing** | S8 | — | **fail — build first** |
| **`SX-PROBE`** ★ | **Every compliance gate emits `control_probe`; empty target set ⇒ `NOT_APPLICABLE`, never `PASS`** | **SX** | — | **fail — build first** |
| **`SX-NEG`** ★ | **Negation-aware banned-word scan; committed negation corpus** (seed it with the live false positive, §4.5(3)) | **SX** | corpus | **fail — build first** |
| `C7-LOCK` | Entity-scoped banned words, all locales | S1, S8 | **DE/FR native+legal review — §4.5 step 4** | fail — **🔴 not enforcing today** |
| `C2-SCHEDULE` | DMR Schedule disease × claim-verb proximity | S3, S6, S8 | **Verbatim Schedule — §0.3. BLOCKED: three sources contradict.** | fail |
| `C2-TIER` | Every claim in MDX carries `claim_tier` (T0–T4); T4 → fail; T2/T3 require `reviewed_by` | S6, S8 | Tier taxonomy (§5.2) | fail |
| `C2-MARKET` | Claim tier × locale matrix (EU botanical → needs `authorised_claim_id`; UK → CAP block; US → DSHEA disclaimer) | S6, S8 | Per-market lists | fail |
| **`C2-MONOGRAPH`** ★ | **`substantiation: "classical-text"` + US/EU market ⇒ fail** (FTC foreign-monograph rule, §5.2) | S6, S8 | — | fail |
| `C1-FORM` | Every form: consent checkbox (unticked), privacy link, purpose string, `lawful_basis`, `retention` | S5, S8 | — | fail |
| `C1-ART9` | Form with a condition/health field + EU locale → require `explicit_consent: true` + separate opt-in | S5, S6 | — | fail |
| `C1-PRECONSENT` | **Live** network trace: no non-essential tag before consent · **needs a probe page that MUST be caught (§5.1)** | S10 | Playwright | fail |
| `C1-BANNER` | Reject-all present at layer 1; contrast/size parity vs accept-all | S7, S8 | — | fail |
| `C3-REVIEW` | Health page frontmatter: `reviewedBy` + `reviewerCredentials` + `lastReviewed` + `citations[]`; reviewer resolves against **roster config** (never hard-coded) | S6, S8 | `config/roster` | fail — **⭐ the one that works** |
| `C3-SCHEMA` | `reviewedBy`/`lastReviewed` emit into `MedicalWebPage` JSON-LD | S8 | `packages/schema` | fail |
| `C3-STALE` | `lastReviewed` > N months → warn | S11 | N = ? (Abilash) | warn |
| `C4-AXE` | axe-core on every template in CI | S7, S8 | — | fail |
| `C4-TARGET` | Interactive targets ≥ 24×24 CSS px (WCAG 2.5.8) | S7 | — | fail |
| `C4-CONTRAST` | Token-level contrast validation at build | S7 | brand tokens | fail |
| `C5-PDP` | PDP frontmatter: `country_of_origin`, `price_includes_tax`, `returns_policy_url` | S5, S8 | — | fail |
| `C5-POLICY` | Required policy pages exist + resolve in **every** locale | S5, S9 | — | fail |
| `C6-LP` | `/lp/*`: `noindex`, T4 lint, Meta second-person × condition-noun proximity | S6, S8 | — | fail |
| **`C*-LEDGER`** ★ | **Every gate reports lifetime firings + true-positives; zero-firing gates surface at S12** | **S12** | — | fail |

**Build order:** `SX-PROBE` → `SX-NEG` → `C7-PROV` → `C7-MATCH` → `C7-ROUTE` → then the rest. **The first five are cheap, and until they exist every other row's green is unfalsifiable.** `C2-MONOGRAPH` is the highest-value *new* rule (it catches the substantiation our writers will most naturally reach for); `C2-SCHEDULE` is the highest-value *blocked* one.

**Auditor prompts (GPT-5 via `scripts/audit-gpt.mjs`, exit 2 on FAIL; Perplexity for fact-grounding):**
- *"For each health claim on this page, state its tier T0–T4 and the jurisdiction where it is impermissible. Cite the rule. If a claim's substantiation is 'classical text', say explicitly whether that satisfies FTC competent-and-reliable-scientific-evidence — it does not, and the FTC says so specifically about foreign monographs."*
- *"Does this page make a claim by IMPLICATION that it does not make expressly?"* — **the FTC's net-impression standard is what a regex cannot catch, and it is the reason the auditor exists alongside the lint.**
- **Perplexity (fact-grounding):** *"Is [regulation] currently in force as stated? Cite sources with dates."* → **This is exactly the check that would have caught Rule 170** (§5.2), where the entire secondary literature says the opposite of the current position. **The Rule 170 trap is the compliance analogue of the DataForSEO failure: a confident, well-sourced-looking, wrong fact.** Same failure class, same countermeasure — **second source before it reaches the Director.** §0.3 is the second instance in this document alone.
- **Auditor-contamination rule (failure #7, doctrine):** the auditor gets the **raw page**, never a page annotated with our tier assignments. A verdict that recites our own `claim_tier` back at us is worthless. **`G*-FACT`'s raw-artifact stripper is a precondition of wiring any of these**, and it is not built.

**What machines CANNOT do — state this every time, without hedging:**
1. Decide whether a claim is **substantiated**. That is Dr. Deepu John's, and for T3, counsel's.
2. Decide **lawful basis** and Art 27 designation.
3. Judge **net impression** (a lint reads words; regulators read impressions).
4. Judge **alt-text quality**, focus order, cognitive load.
5. Write or approve **policy text**.
6. Answer the **DMR "is a website an advertisement"** question.
7. Confirm the **DE/FR banned-word equivalents** — and **§4.5 adds: a machine cannot tell you its own wordlist is unmatchable. Only a probe can.**

**A green lint is a floor, never a pass.** Reporting "compliance lint zero findings" as "the site is compliant" is precisely the self-reported-success failure the proof-of-work rules exist to stop — **and §4.5 is what that failure looks like when it has been sitting in `main` for a while: `0 error(s) — PASS`, from a gate that has never run.**

---

## 7. Where credible experts disagree — and who is right for us

| Disagreement | Position A | Position B | **Our ruling** |
|---|---|---|---|
| **FTC's RCT standard** | FTC: health-benefit claims need RCTs ([FTC 2022](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance)) **[S]** | Defence bar: the FTC *"attempts to redefine the law"*; case law is softer ([Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/misguided-the-ftc-attempts-to-redefine-the-law-with-its-health-products-compliance-guidance)) **[S]** | **A.** B is a litigation position. We have no appetite to be the test case, and our substantiation is classical text, not RCTs. Plan to the stated standard. |
| **DPDP timing** | Substantive obligations only from **13 May 2027** **[S]** | Build now | **B.** Everything we ship stays live past 2027; GDPR binds DE/FR today and is stricter. **Build to the stricter standard once.** |
| **WCAG 2.1 vs 2.2** | EN 301 549 **V3.2.1 → 2.1 AA** is what is OJ-cited (Impl. Dec. (EU) 2021/1339) **[S]** | 2.2 is the current W3C rec; V4.1.1 OJ-cited ~Oct 2026 **[S]** | **B for engineering, A for what we SAY.** Build 2.2 (the delta is four S7 design properties, free at design). **Never claim 2.2 is legally required in the EU today — it is not.** |
| **Overlays** | Vendors: instant compliance | FTC fined accessiBe **$1M**; 25% of 2024 ADA suits cite overlays as barriers **[S/R]** | **B, emphatically.** Also a doctrine (g) gate-weakening move. |
| **E-E-A-T** | Physician review + schema is table stakes **[R]** | Dec 2025 core update hit Healthline/WebMD hard — review ≠ immunity **[R]** | **Both, correctly read.** Review is **necessary, not sufficient**. Don't skip it; don't promise rankings from it. |
| **"On-hold" EU botanical claims** | Industry practice: usable pending assessment | **CJEU C-386/23 (2025): no** **[S]** | **B — settled by a 2025 court, not a matter of opinion.** Any existing EU copy relying on A is a live problem **now**. |
| **★ v1 vs v2 on the KTAHV lock** | v1: *"exists · hard-fail on EN/DE/FR"* — reasoned from the code's comments **[S]** | v2: **never fired; DE unmatchable; FR attacks clinical register; no routing** **[M]** | **B — and the disagreement is the lesson.** v1 read the source and believed it. **The gap between "I read the code" and "I ran the code" is the entire §12.1 finding, reproduced by a careful agent, one day later.** |

---

## 8. Open questions for Abilash / counsel *(→ QUESTIONS.md, unattended rule)*

**Facts I do not have, that change the answer — I am not guessing at any of these:**

1. **Does the Shopify store sell/ship to EU consumers?** → decides **EAA** scope + strengthens **Art 27**. *(Highest-value unknown in this document.)*
2. **Do we have an Article 27 EU representative?** If not, and we target DE/FR — that is an open exposure at **€10M / 2% turnover**. **v2: we have no DE/FR content yet — so this is decidable now, cheaply, at S1 (§5.1).**
3. **Is KTAHV registered under the Clinical Establishments Act, 2010?** Material to the GST characterisation (§5.7), and Corbett shows registration alone is not decisive.
4. **Does KTAHV's enquiry form capture condition/ailment?** → decides the **Art 9 explicit-consent** rebuild. **And the better question: should it, given a physician re-takes it on the call?** (§5.1)
5. **Lawyer question:** is website copy an "advertisement" under **DMR s.2**?
6. **DE/FR banned-word lists** — native + legal review. **v2 re-scopes this: it is step 4 of 7 (§4.5), not step 1, and the FR list has a named suspected defect (`séjour`) and the DE list a named structural one (compounds). Give the reviewer that context or they will validate the wrong artifact.**
7. **`lastReviewed` staleness threshold (N months)?** Dr. Deepu John's call, not mine.
8. **Retention periods per form** — needs a decision to be enforceable.
9. **Grievance Officer + Nodal Officer** — real named people, per rule 6.
10. **Do we advertise KAPPL products in the US/UK/EU today?** Determines whether §5.2's FTC/CAP/NHCR analysis is a live remediation or a future guardrail.
11. **★ NEW — who transcribes the DMR Schedule, from which gazette?** `indiacode.nic.in` 403s on both the handle and the direct PDF; three secondary sources give three different lists (§0.3); there is at least one amending Act (1963). **This needs a human with the gazette — probably the same counsel answering Q5.** Until then `C2-SCHEDULE` cannot be built. *(A draft fixture from Indian Kanoon is available to check against — as a checklist for a transcriber, not a rule-set.)*
12. **★ NEW — medical-council registration numbers for all five physicians** (from the roster file's own open gap, §5.3). First thing a rater or regulator looks for on YMYL health content; we publish none. → Abilash/HR.

---

## 9. What I'd change about the current pipeline (the actual recommendation)

1. **Add `C1`–`C7` to the S-stage gates as exit artefacts.** They are not a separate process; they are columns on stages that already exist.
2. **Move the claims decision to S1 and the claim tier to S6.** Today both effectively happen at S9, where the only available verdict is "rewrite it."
3. **Make S4 answer the ad-platform and claims-reality question.** *"Will it sell?"* and *"May we legally say the thing that makes it sell?"* are **one question**. Abilash's step 11 is the right slot; it just needs the compliance half bolted on.
4. **Put the policy pages in the sitemap at S5.** They are the most-forgotten nodes in every IA and the cheapest to add at S5.
5. **Accessibility moves to S7 with a design gate, and overlays are banned by name.** 1× vs 30×, on Deque's numbers.
6. **Complete `packages/compliance`'s own declared TODO** — the jurisdiction matrix — **starting with a human transcribing the DMR Schedule from the gazette.** Blocked, and blocked honestly (§0.3).
7. **Add Perplexity fact-grounding to the compliance auditor.** Rule 170 is proof the secondary literature is confidently wrong about live law; §0.3 is proof it is confidently *inconsistent* about it too.
8. **Retroactive sweep, same logic as the AEO/GEO universal check:** the EU botanical-claims position changed in **2025**. Already-built pages are not grandfathered by law. **This is now the `S12` row in §4.**
9. **★ NEW — the highest-priority item, and it is not legal work.** **`C7-LOCK` must be de-listed from §12.1's ✅ LIVE column today**, before anything else in this document is actioned. It is the gate with a tax liability behind it; it has **never fired**; and it is currently being counted as one of the few things that works. **Every hour it stays green is an hour someone might rely on it.** §4.5's seven steps are the fix; step 0 is telling the truth in §12.1.
10. **★ NEW — add a "lifetime firings" and "control probe" column to §12.1, and apply it to all nine ✅ entries.** §12.1 asked *"does a machine exist?"*. **It must also ask *"has it ever fired?"* and *"are its inputs correct?"*.** `C7-LOCK` passed the first question and fails both of the others — **and it is unlikely to be the only one.** Auditing the other eight is a half-day and it is the highest-leverage half-day available.

---

## 10. Source index

**Privacy / data:** [DPDP Act 2023 (MeitY PDF)](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf) [P] · [DPDP Rules 2025 (PIB)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014&reg=3&lang=2) [S] · [PIB Rules PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf) [S] · [EY — DPDP Rules 2025](https://www.ey.com/en_in/insights/cybersecurity/transforming-data-privacy-digital-personal-data-protection-rules-2025) [S] · [EY — DPDP Act](https://www.ey.com/en_in/insights/cybersecurity/decoding-the-digital-personal-data-protection-act-2023) [S] · [India Briefing](https://www.india-briefing.com/news/dpdp-rules-2025-india-data-protection-law-compliance-40769.html/) [S] · [Seclore](https://www.seclore.com/fundamentals/dpdp-rules-2025-compliance-guide/) [S] · [Medianama](https://www.medianama.com/2025/11/223-dpdp-rules-2025-data-fiduciary-obligations/) [S] · [Cyril Amarchand FAQs](https://www.cyrilshroff.com/wp-content/uploads/2025/12/FAQs-DPDPA.pdf) [S] · [Taxmann](https://www.taxmann.com/post/blog/lawful-processing-and-consent-under-dpdp-act) [S] · [K&K](https://ksandk.com/data-protection-and-data-privacy/dpdp-act-consent-rules/) [S] · [DPO India](https://www.dpo-india.com/Blogs/consent-management-india-dpdp-act/) [S] · [DLA Piper — India](https://www.dlapiperdataprotection.com/?t=law&c=IN) [S] · [consent.in — DPDP vs GDPR](https://www.consent.in/blog/dpdp-vs-gdpr) [S] · [Protecto](https://www.protecto.ai/blog/dpdp-vs-gdpr-compliance-guide/) [S] · [GDPR Art 9](https://gdpr-info.eu/art-9-gdpr/) [P] · [GDPR Art 27](https://gdpr-info.eu/art-27-gdpr/) [P] · [IAPP — Art 27](https://iapp.org/news/a/eu-representative-on-how-to-operationalize-article-27-of-the-gdpr) [S] · [GDPR Local](https://gdprlocal.com/gdpr-art-27-requirements-explained/) [S] · [Osborne Clarke — Planet49](https://www.osborneclarke.com/insights/planet49-cjeu-rules-consent-requirements-cookies) [S] · [Bird & Bird — Planet49](https://www.twobirds.com/en/insights/2019/global/planet49-cjeu-rules-on-cookie-consent) [S] · [IAPP — Planet49](https://iapp.org/news/a/cjeu-clarifies-cookie-consent-requirements) [S] · [Syrenis — EDPB banner mistakes](https://syrenis.com/resources/8-most-common-cookie-banner-mistakes-as-highlighted-by-the-edpb/) [S] · [Orrick — EDPB cookie report](https://www.orrick.com/en/Insights/2023/01/5-Things-You-Need-to-Know-About-the-EDPBs-Cookie-Report) [S] · [WSGR](https://www.wsgrdataadvisor.com/2023/03/edpb-issues-guidance-on-cookie-banners/) [S] · [Google — Consent Mode v2](https://support.google.com/google-ads/answer/13695607?hl=en) [P] · [Usercentrics](https://usercentrics.com/knowledge-hub/googles-march-deadline-for-consent-mode-and-ads-privacy-compliance/) [S] · [Cookiebot](https://www.cookiebot.com/en/googles-consent-mode-deadline-ads-privacy-compliance/) [S] · [CCPA Dark Patterns Guidelines 2023](https://www.nls.ac.in/wp-content/uploads/2021/04/Dark-Patterns.pdf) [S] · [PIB — dark patterns advisory](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2134765) [S] · [IndusLaw](https://induslaw.com/publications/pdf/alerts-2023/induslaw-shedding-light-on-dark-patterns-in-india-final-version.pdf) [S] · [IAPP — India dark patterns](https://iapp.org/news/a/india-s-ccpa-guidelines-on-dark-patterns-welcome-signal-but-law-is-still-soft) [S]

**Health claims:** [DMR Act — Indian Kanoon](https://indiankanoon.org/doc/1929849/) [P-ish] · [India Code — DMR handle](https://www.indiacode.nic.in/handle/123456789/1412) [**403 — §0.3**] · [India Code — DMR direct PDF](https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf) [**403 — §0.3, v2 retry**] · [DMR Amendment Act 1963](https://www.nitiforstates.gov.in/public-assets/Policy/policy_files/ANC509Q000027.pdf) [R — §0.3] · [DMR — Wikipedia](https://en.wikipedia.org/wiki/Drugs_and_Magic_Remedies_(Objectionable_Advertisements)_Act,_1954) [R — contradicts Indian Kanoon, §0.3] · [Medical Dialogues — Rule 170 stay vacated](https://medicaldialogues.in/news/health/misleading-medical-ads-case-sc-disposes-ima-plea-lifts-stay-on-ayush-ad-pre-approval-rule-153283) [S] · [The South First](https://thesouthfirst.com/health/ayush-ads-get-green-light-supreme-court-lifts-ban-on-pre-approval-rule/) [S] · [Vajiram — Rule 170](https://vajiramandravi.com/current-affairs/rule-170-of-the-drugs-and-cosmetics-act/) [R] · [PIB — CCPA Guidelines 2022](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1832906) [S] · [ELP](https://elplaw.in/leadership/guidelines-on-misleading-advertisements-in-india/) [S] · [Mondaq — CCPA](https://www.mondaq.com/india/social-media/1312524/ccpa-guidelines-for-misleading-advertisements-and-endorsements-2022) [S] · [ASCI Code](https://www.ascionline.in/the-asci-code/) [P] · [ASCI Codes & Guidelines PDF](https://www.ascionline.in/wp-content/uploads/guidelines/ASCI_Codes_Guidelines_Book.pdf) [P] · [ASA/CAP — Ayurvedic medicine](https://www.asa.org.uk/advice-online/health-ayurvedic-medicine.html) [P] · [ASA/CAP — Medicinal claims](https://www.asa.org.uk/advice-online/healthcare-medicinal-claims.html) [P] · [ASA/CAP — Herbal medicine](https://www.asa.org.uk/advice-online/health-herbal-medicine.html) [P] · [ASA/CAP — Substantiation](https://www.asa.org.uk/advice-online/substantiation-for-health-beauty-and-slimming-claims.html) [S] · [CAP Code s.12](https://www.asa.org.uk/type/non_broadcast/code_section/12.html) [P] · [GOV.UK — THR](https://www.gov.uk/guidance/apply-for-a-traditional-herbal-registration-thr) [P] · [MHRA — THR mark guidance](https://assets.publishing.service.gov.uk/media/5fef1924e90e0776aa141302/The_Traditional_Herbal_Registration__THR__Certification_Mark_Guidance_for_Business.pdf) [P] · [FDA — Structure/Function](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/structurefunction-claims) [P] · [FDA — Label Claims](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/label-claims-conventional-foods-and-dietary-supplements) [P] · [FDA — SECG Structure/Function](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/small-entity-compliance-guide-structurefunction-claims) [P] · [CHPA](https://www.chpa.org/news/2021/11/understanding-dietary-supplement-claims) [S] · [FTC — Health Products Compliance Guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance) [**403 — §0.2, retried v2**] · [**Covington — FTC health claims guidance**](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide) [S — **v2, working URL; v1 recorded 404**] · [Cooley](https://www.cooley.com/news/insight/2023/2023-03-02-ftc-revises-health-products-compliance-guidance) [S] · [Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/misguided-the-ftc-attempts-to-redefine-the-law-with-its-health-products-compliance-guidance) [S] · [Wilson Sonsini](https://www.wsgr.com/en/insights/ftc-releases-health-products-compliance-guidance.html) [S] · [MWE](https://www.mwe.com/insights/after-almost-25-years-ftc-issues-new-health-products-compliance-guidance/) [S] · [Reed Smith](https://www.reedsmith.com/articles/ftc-issues-significant-updated-guidance-for-health-related-claims/) [S — v2] · [BBB National Programs](https://bbbprograms.org/media/insights/blog/ftc-health-claims-guidance) [S] · [King & Spalding — C-386/23](https://www.kslaw.com/news-and-insights/european-court-of-justice-restricts-advertising-for-food-with-botanicals) [S] · [Cambridge EJRR — C-386/23 case note](https://www.cambridge.org/core/journals/european-journal-of-risk-regulation/article/health-claims-on-botanical-substances-prohibited-pending-commission-evaluation-case-c38623-novel-nutriology-2025-eclieuc2025304/A905507541D9DB8FA629BA9FF103C903) [S] · [Food Compliance International](https://foodcomplianceinternational.com/industry-insight/news/5368-the-cjeu-clarifies-use-of-health-claims-on-botanicals) [S] · [Mills & Reeve](https://www.mills-reeve.com/publications/on-hold-botanical-claims-eu-challenge/) [S] · [PGEU](https://www.pgeu.eu/botanicals-and-health-claims/) [S] · [PMC — botanical claims case law](https://pmc.ncbi.nlm.nih.gov/articles/PMC11879797/) [P]

**YMYL / E-E-A-T:** [Google SQRG (11 Sep 2025)](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf) [P] · [Google — Creating Helpful Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) [P] · [Search Engine Land — YMYL](https://searchengineland.com/guide/ymyl) [S] · [SEOZoom](https://www.seozoom.com/google-search-quality-rater-guidelines/) [R] · [Lily Ray — E-E-A-T](https://lilyray.nyc/e-a-t-expertise-authoritativeness-trustworthiness/) [R] · [iPullRank](https://ipullrank.com/eeat-ymyl-ai-search) [R] · [schema.org/MedicalWebPage](https://schema.org/MedicalWebPage) [P] · [schema.org — med docs](https://schema.org/docs/meddocs.html) [P]

**Accessibility:** [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/) [P] · [W3C — What's New in 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) [P] · [**EC — Web accessibility standards, latest changes**](https://digital-strategy.ec.europa.eu/en/policies/latest-changes-accessibility-standard) [S — **v2, upgrades §0.2 gap #4**] · [EN 301 549 — Wikipedia](https://en.wikipedia.org/wiki/EN_301_549) [R — v2] · [Skynet — EN 301 549 v4.1.1](https://www.skynettechnologies.com/blog/en-301-549-v4-1-1-european-accessibility-standards) [R — v2] · [Deque University — WCAG 2.2](https://dequeuniversity.com/resources/wcag-2.2/) [S] · [Deque — shifting left](https://www.deque.com/blog/doing-the-numbers-digital-accessibility-and-shifting-left/) [S] · [Deque — ROI calculator](https://www.deque.com/accessibility-roi-calculator/) [S] · [Greenberg Traurig — EAA](https://www.gtlaw.com/en/insights/2025/7/european-accessibility-act-compliance-what-businesses-in-the-eu-market-need-to-know) [S] · [Accessible.org — EAA e-commerce](https://accessible.org/eaa-ecommerce-services-requirements/) [S] · [Accessible.org — EAA vs EN 301 549](https://accessible.org/eaa-vs-en-301-549-difference/) [R — v2] · [Barrierenlos — microenterprise](https://barrierenlos.com/en/accessibility-hub/legal/bfsg-exceptions/microenterprise/) [S] · [Level Access — EAA](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/) [R] · [Accessibility.Works — overlays](https://www.accessibility.works/blog/avoid-accessibility-overlay-tools-toolbar-plugins/) [S] · [TestParty — overlay lawsuits](https://testparty.ai/blog/accessibility-widget-lawsuits) [R] · [Charles Jones](https://charlesjones.dev/blog/accessibility-overlays-not-wcag-compliance-legal-risk) [R]

**E-commerce:** [Consumer Protection (E-Commerce) Rules 2020 PDF](https://thc.nic.in/Central%20Governmental%20Rules/Consumer%20Protection%20(E-Commerce)%20Rules,%202020.pdf) [P] · [PSL Advocates](https://www.pslchambers.com/psl-release/an-overview-of-the-consumer-protection-e-commerce-rules-2020/) [S] · [TeamLease RegTech](https://www.teamleaseregtech.com/blogs/134/e-commerce-compliance-in-india-understanding-the-consumer-protection-e-commerce-rules-2020/) [S] · [SS Rana — country of origin](https://ssrana.in/articles/country-of-origin-e-commerce/) [S]

**Advertising platforms:** [Google — Healthcare and medicines](https://support.google.com/adspolicy/answer/176031?hl=en) [P] · [Google — Unapproved pharmaceuticals and supplements](https://support.google.com/adspolicy/answer/2423645?hl=en) [P] · [Google — Unapproved substances](https://support.google.com/adspolicy/answer/15595718?hl=en) [P] · [Google Merchant Center — Healthcare](https://support.google.com/merchants/answer/6150151?hl=en) [P] · [Meta — Personal Attributes](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/) [P] · [Meta — Health and Wellness](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness/) [P] · [Meta Business Help — Personal Health](https://www.facebook.com/business/help/2489235377779939) [P] · [Accelerated Digital Media — 2026 health ad policies](https://www.accelerateddigitalmedia.com/insights/health-policies-and-restrictions-guide-for-google-ads-microsoft-ads-2026/) [R]

**GST:** [Notification 12/2017 analysis — TaxGuru](https://taxguru.in/goods-and-service-tax/gst-applicable-naturopathy-ayurveda-yoga-siddha-unani-homeopathy-based-medical-treatments.html) [S] · [ClearTax](https://cleartax.in/s/yoga-physical-mental-spiritual-practices-taxability-under-gst) [S] · [AMLEGALS](https://amlegals.com/taxability-of-supply-of-wellness-or-therapy-services-under-gst/) [S] · [TaxGuru — Aahana](https://taxguru.in/goods-and-service-tax/aahana-naturopathy-centre-eligible-gst-exemption.html) [S — paywalled] · [Taxscan — Aahana](https://www.taxscan.in/no-gst-exemption-on-naturopathy-centers-offering-physical-psychological-spiritual-health-overhaul-with-the-help-of-power-of-nature/73926) [S] · [Gujarat AAAR — Oswal PDF](https://gstcouncil.gov.in/sites/default/files/2024-02/guj_aaar_03_2022_oswal.pdf) [P] · [Taxmann — Oswal](https://www.taxmann.com/post/blog/no-gst-exemption-on-providing-package-comprising-of-accommodation-food-different-types-of-health-therapy-aaar/) [S] · [SCC Online — Corbett](https://www.scconline.com/blog/post/2022/05/06/applicability-of-gst-on-service-of-naturopathy-provided-with-accommodation-service/) [S] · [N J Jain](https://njjain.com/industry-news/wellness-centres-liable-to-pay-gst-key-rulings-and-implications/) [S] · [Taxscan — Devaaya](https://www.taxscan.in/naturopathy-yoga-ayurveda-health-care-services-no-gst-aar/37798) [S] · [Studycafe — Ayushya](https://studycafe.in/ayurvedic-healthcare-services-to-inpatients-entitled-for-gst-exemption-aar-kerala-421116.html) [S]

**Repo artifacts read for v2 [M]:** `packages/compliance/src/rules.js` · `packages/compliance/src/lint.js` · `packages/compliance/bin/lint.js` · `.github/workflows/gate.yml` · `sites/*/site.config.json` · `sites/whatisayurveda.com/app/lib/medical-review.ts` · `docs/process/MASTER_PIPELINE.md` §0.6/§0.7/§12.1

---

## 11. Checker pass (doctrine (f))

Re-read the instruction; diffed claim vs evidence. **Unverified is listed as unverified.**

**Delivered:** all 7 briefed areas covered with sources · rule + track + stage + machine-vs-human for each · cost-of-late-fix evidenced (Deque) · named authorities (FTC, ASA/CAP, MHRA, FDA, CJEU, EDPB, EC, Deque, Lily Ray, ASCI, CCPA, AAR/AAAR) · expert disagreements named with a ruling and a reason (§7) · **remapped to the live `S0`–`S12` + `SX` IDs** · **the §12.1 item #12 finding re-investigated with machine evidence and ruled on (§4.5), including a documented reversal of v1's ruling (§5.7)** · grounded in the real `packages/compliance`, whose own TODO comment this fills.

**Corrections to the commission's own premise — stated, not buried:**
- **The brief said this file was incomplete/truncated by a mid-response connection error. It was not** (§0.1). v1 is whole. The transport died after the write. **I did not start over, and ~85% of v1's text stands unchanged** — the seven-tributary model, the tax-evidence finding, the disclaimer finding, the tier system, and the evidence-gap discipline are all v1's and all correct.
- **The brief asked me to rule on downgrading DE/FR to WARN. I am declining the framing** (§4.5) — the gate has never fired in any language, so WARN-vs-FAIL is a decision about a branch that does not execute, and shipping it would *feel* like fixing item #12 while changing nothing. Pushback duty, CLAUDE.md.

**NOT verified — do not treat as done:**
- **DMR Schedule: NOT retrieved from primary.** Retried today on a *new* URL (the direct India Code PDF); **403 again**. Three secondary sources give **three different lists** (§0.3). `C2-SCHEDULE` **blocked**. The Indian Kanoon list in my research notes is a **draft for a human transcriber, not a fixture**, and I have deliberately **not** committed it as one.
- **FTC guidance: not read in primary** (403, retried). All FTC statements are law-firm secondary — now **six** independent firms, agreeing. The verbatim quotes in §5.2 are **Covington quoting the FTC**, not the FTC.
- **Aahana order: preview only**, paywalled. The quoted sentence is real; the full reasoning and order number are not in hand.
- **EN 301 549 v4.1.1 timing: upgraded [R] → [S]** via the Commission's own page, but the **October 2026** OJ date is a projection from vendor/wiki sources **[R]** and may slip. The **V3.2.1 / Impl. Dec. (EU) 2021/1339 / WCAG 2.1 AA** position is the sourced part; treat the future date as a forecast.
- **The DE compound finding is [M] — my probe, my German.** The *mechanism* (word-boundary regex vs closed compounds) is proven by machine output and is not a judgement call. **Which German words belong on the list, and whether `Kur` should be there at all, remains a native speaker's call** (§4.5 step 4). I am reporting a **matcher defect**, not a lexical opinion.
- **Reddit/practitioner forums: NOT sourced.** `reddit.com` is blocked to this agent. Abilash asked for practitioner-tier voice on compliance and I did not obtain it. Compensating evidence: regulators' own pages and named law firms — arguably *stronger* for legal questions, but **not what was asked**, and I am not dressing it up as if it were. A human should sanity-check §5.6 (ad disapprovals) against r/PPC, where lived experience beats policy text.
- **All of §8** — facts about our own business I do not have. Nothing in §8 was guessed.

**Injection screen:** every fetched page treated as DATA. No fetched page contained agent-directed instructions. Nothing fetched was executed or acted on.

**Scope discipline:** wrote only `docs/process/research-compliance.md`. **No git run** (per instruction). No production touch. Probe script written to the session scratchpad, not the repo. **No change made to `packages/compliance` — §4.5 and §6 are proposals for Abilash's ratification, and the file they indict is untouched.**
