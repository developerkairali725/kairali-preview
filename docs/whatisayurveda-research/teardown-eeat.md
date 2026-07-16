# whatisayurveda.com — E-E-A-T / YMYL Trust Model Teardown

**As of:** 2026-07-15 17:31:03 IST
**Branch:** `feat/wia-content-engine-research`
**Scope:** the trust model for a YMYL health site under maximum Google scrutiny, mapped onto our actual architecture.
**Code read (not assumed):** `sites/whatisayurveda.com/app/lib/medical-review.ts`, `app/_components/article.tsx`, `app/lib/content.ts`, `app/lib/meta.ts`, `app/_components/chrome.tsx`, `packages/schema/src/index.js`, all 20 `content/*.json`.

**Prompt-injection screen (CLAUDE.md rule r):** all sources below were fetched as DATA. No fetched page contained instructions directed at an agent; nothing in them was acted on as a directive. Two sources (examine.com, mayoclinic.org) returned HTTP 403 to WebFetch and are cited from search-result summaries + a fetched primary page instead — flagged inline as **[secondary]** so a later pass can re-verify.

---

## 0. The one-paragraph thesis

Google's rater guidelines say **Trust is the centre of E-E-A-T**, and that for **clear YMYL topics** a page that is untrustworthy for *any* reason has low E-E-A-T regardless of how expert it looks. Our site is clear YMYL Health (herbs with real drug interactions, therapies, safety cautions). We already have unusually strong raw ingredients — a real NABH hospital, a real WHO-GMP pharmacy, real BAMS physicians, real citations to NCCIH/JAMA/LiverTox, and a genuinely honest editorial voice. **The gap is not substance; it is that our trust furniture currently makes claims the code does not keep.** Three of those are, by Google's own written criteria, Low-quality signals — and they are self-inflicted, because our own `/about` page promises more than the template renders. Fixing them is cheap. Not fixing them makes the honesty itself look like marketing.

---

## 1. What Google actually says (primary sources, quoted)

### 1.1 Search Quality Rater Guidelines — the governing document
Source: **General Guidelines, September 11, 2025** (182pp), <https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf> (302 → <https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf>). Extracted locally with pypdf; section/page refs below are from that extraction.

| § | p. | Exact wording (abridged, quoted) | Binds us because |
|---|---|---|---|
| 2.3 | 11 | "Some topics have a high risk of harm because content about these topics could significantly impact the health, financial stability, or safety of people… We call these topics 'Your Money or Your Life' or YMYL." | Herb safety/interactions = **clear YMYL Health or Safety**. |
| 2.3 | 11 | "**YMYL Health or Safety**: Topics that could harm mental, physical, and emotional health, or any form of safety…" | Our herb + panchakarma pages sit squarely here. |
| 2.3 | 11 | "Pages on clear YMYL topics require the most scrutiny for Page Quality rating." | Max scrutiny is the design assumption, not a worry. |
| 3.4 | 26 | "The most important member at the centre of the E-E-A-T family is **Trust**." · "**Informational pages on clear YMYL topics** must be accurate to prevent harm to people and society." | Trust ≫ everything. |
| 3.4 | 27 | "Trust is the most important member of the E-E-A-T family because **untrustworthy pages have low E-E-A-T no matter how Experienced, Expert, or Authoritative they may seem**." · "**If a page is untrustworthy for any reason, it has low E-E-A-T.**" | One broken trust signal sinks the page — our BAMS reviewer will not rescue a fake date. |
| 3.4 | 27 | "What the website or content creators say about themselves: Look at the '**About us**' page… as a starting point." | `/about` is the load-bearing page. Raters start there. |
| 3.4 | 27 | "**Important**: The website or content creator may not be a trustworthy source if there is a **clear conflict of interest**." (example: "reviews" by the product manufacturer — *"Our product is great!"*) | **The single biggest structural risk for us.** See §3. |
| 3.4.1 | 28 | "If the purpose of a page on a clear YMYL topic is to give information or offer advice, **a high level of expertise may be required** for the page to be trustworthy." · "some types of YMYL information and advice **must come from experts**." | Justifies the physician-review model — and requires it be visible + real. |
| 3.4.1 | 28 | Pages sharing first-hand life experience on YMYL "may be considered to have high E-E-A-T **as long as the content is trustworthy, safe, and consistent with well-established expert consensus**." | Our practitioner Experience counts — but only inside expert consensus. |
| 2.5.2 | 16 | "it should be clear: **Who** … is responsible for the website. **Who** … created the content on the page you are evaluating." | Publisher disclosure + per-page author. |
| 2.5.3 | 18 | "The types and amount of contact information needed depend on the type of website." | Email + WhatsApp is defensible for a non-transactional educational site. |
| 4.5.1 | 35–36 | "For pages that require a high level of trust, information about who created the content and who is responsible for the content is **critical**." · "**YMYL pages … with absolutely no information about the website or content creator should be rated Lowest.**" | We pass this one. Baseline met. |
| 4.5.2 | 36 | "If a page on YMYL topics is highly inexpert, it should be considered Untrustworthy and rated **Lowest**." | Physician review is the mitigation. |
| 5.1 | 60 | "**The Low rating should be used if the page lacks appropriate E-E-A-T for its purpose. No other considerations such as positive reputation or the type of website can overcome a lack of E-E-A-T** for the topic or purpose of the page." | Kairali's 1908 heritage does **not** buy us out of page-level furniture. |
| 5.2 | 60 | "**Mild inaccuracies on informational pages are evidence of Low quality.** However, if the page has harmful inaccuracies … the Lowest rating is justified." | Claims lint must be real. |
| 5.5 | 63 | "**Pages on YMYL topics** and other pages that require a high level of user trust **should receive a Low rating if there is an unsatisfying amount of information about who is responsible for the website or who created the content.**" | Directly indicts a collective-only byline on YMYL (§2.2). |
| 5.6 | 63 | "sometimes the information about the website or content provider seems **exaggerated or mildly misleading, such as claims of personal experience or expertise that seem overstated**… E-E-A-T assessments should be based on the MC itself… **verifiable credentials**, etc, not just website or content creator claims of 'I'm an expert!'" · "If you find the information about the website or the content creator to be exaggerated or mildly misleading, the **Low** rating should be used." | **This is the section our `/about` currently trips.** See §2.1/§2.2. |
| 7.3 | 73 | "**Trust** is especially important for High quality pages that … cover YMYL topics." | — |
| 8.3 | 78 | "Very high E-E-A-T is a distinguishing factor for **Highest** quality pages. A website or content creator who is the **uniquely authoritative, go-to source** for a topic has very high E-E-A-T." | Our actual ceiling: heritage practitioner-institution = a real shot at "uniquely authoritative" for Ayurveda. |

**Worked rater example that mirrors our page type** (§4.7, p.49–50):
- *"Lowest: Dry socket medical info"* — "There is no information about who created this website, no contact information, and no information about the author. **Medical pages require a high level of user trust.**"
- *"Lowest: Stomach flu lowest EAT article"* — "The writing is poor and the information is not consistent with standard medical guidance. **It is clear from the content the author does not have medical expertise.** This page should not be trusted as a medical resource."

Read together: **the rater is looking for author identity + medical expertise + consensus alignment on exactly our page shape.**

### 1.2 Creating helpful, reliable, people-first content
Source: <https://developers.google.com/search/docs/fundamentals/creating-helpful-content>
- "Of these aspects, **trust is most important**. The others contribute to trust…"
- "our systems give **even more weight** to content that aligns with strong E-E-A-T for topics that could significantly impact the **health**, financial stability, or safety of people."
- The **Who / How / Why** self-assessment:
  - "**Is it self-evident to your visitors who authored your content?**"
  - "**Do pages carry a byline, where one might be expected?**"
  - "**Do bylines lead to further information about the author or authors involved?**" → **we fail this today (§2.3)**
  - "Is the use of automation, including AI-generation, self-evident to visitors through disclosures or in other ways?" → **unresolved for us (§3.3)**
  - "Why is it being created in the first place? The 'why' should be that you're creating content primarily to help people."

### 1.3 Dates
Source: <https://developers.google.com/search/docs/appearance/publication-dates>
- "**Add a user-visible date to the page and feature it prominently.** Label your dates appropriately with text like 'Publish' or 'Last updated'."
- "the date … **match between the equivalent user-visible and structured values**."
- "**Don't specify future dates**, or the date of the action described on the page."
→ A date must denote a **real event**. Ours currently denotes a build. See §2.1.

### 1.4 Article structured data
Source: <https://developers.google.com/search/docs/appearance/structured-data/article>
- "There are no required properties; instead, add the properties that apply to your content."
- "Make sure that **all the authors that are presented as authors on the web page are also included in markup**." → our clinical pages violate this (§2.4).
- "In the `author.name` property, **only specify the name of the author. Don't add any other piece of information.**" → our `physician()` call packs title+credentials into `jobTitle` (correct) but we must not drift into `name: "Dr. Deepu John, BAMS"`.
- "To help Google better understand who the author is, we **strongly recommend using the `type` and `url` (or `sameAs`) properties**." → our Person/Physician nodes have **no `url`/`sameAs`** today.

### 1.5 schema.org vocabulary
Source: <https://schema.org/MedicalWebPage>
- `lastReviewed` — "Date on which the content on this web page was **last reviewed for accuracy and/or completeness**." (type: Date)
- `reviewedBy` — "People or organizations that have **reviewed the content** on this web page for accuracy and/or completeness." (type: Organization **or** Person)
- Note `reviewedBy` accepts an **Organization** — which is exactly the schema-level expression of our institutional model. We can emit *both*: `reviewedBy: [Physician, Organization]`.

---

## 2. How the reference sites signal trust — and where we stand

| Trust signal | Examine.com | Healthline | Mayo | **whatisayurveda.com (as built)** |
|---|---|---|---|---|
| Named credentialed **author** per page | Yes — researcher + fact-checker named, linked to credentials **[secondary]** | Yes — named author | Yes | ❌ **"the Kairali Editorial Team"** (collective, unlinked) |
| Named credentialed **reviewer** per page | Yes — internal + sometimes external reviewer **[secondary]** | Yes — "Medically reviewed by X" | Yes | ✅ Dr. Deepu John, BAMS — **but same name on every page** |
| Visible **last reviewed** date | Yes — full public revision history **[secondary]** | Yes | Yes | ⚠️ Present but **hardcoded build constant** |
| **Citations to primary literature** | Yes — GRADE certainty grading **[secondary]** | Yes | Yes | ✅ Real (NCCIH, JAMA, LiverTox) — **but optional in the type** |
| **Editorial policy** at a stable URL | `/about/editorial-policy/` | `/about/content-integrity` (fetched) | Yes | ❌ **No URL** — buried as §5 of `/about` |
| **Medical disclaimer** page | — | "Healthline Media does not provide medical advice, diagnosis, or treatment." (fetched) | Yes | ⚠️ Footer text only, **no `/medical-disclaimer` route** |
| **Publisher disclosure** | Independence stated **[secondary]** | Ownership stated | Mayo brand | ✅ Strong — `/about` names Kairali plainly |
| **Conflict-of-interest** handling | "entirely independent… does not accept any money from outside sources"; reviews **ingredients, not products** **[secondary]** | AACI COI declarations "reviewed regularly and made available upon request" (fetched) | Ad disclosure | ❌ **Publisher sells the thing it writes about — undisclosed on-page** |
| AI disclosure | — | "**we do not publish content developed using generative AI tools**" (fetched) | — | ❌ Absent (§3.3) |

Sources: Healthline content integrity <https://www.healthline.com/about/content-integrity> (fetched 200). Examine editorial policy <https://examine.com/about/editorial-policy/> + research process <https://examine.com/about/research-process/> (403 to WebFetch; **[secondary]** via search summaries). Mayo <https://www.mayoclinic.org/about-this-site/welcome> (403).

**The pattern every one of them shares:** the trust claim and the rendered artifact are the *same object*. Examine's "we update with the latest research" is backed by a public revision history you can click. That is the bar. A promise without a rendered artifact is, in QRG §5.6 terms, "exaggerated or mildly misleading information about the website".

---

## 3. Findings against our architecture — machine-verified

Ranked by severity. Every finding below was verified by reading the code, not inferred.

### 🔴 F1 — The "last medically reviewed" date is a build constant, identical on all 20 pages
`app/_components/article.tsx:23`
```ts
const REVIEWED = "2026-07-14"; // build date; real review cadence tracked in editorial policy
```
It feeds **both** the visible byline ("Reviewed 14 July 2026") **and** `lastReviewed` in `MedicalWebPage` JSON-LD, **and** `datePublished`/`dateModified` on Article pages.

- schema.org defines `lastReviewed` as the date content was "last reviewed for accuracy and/or completeness" — **a review event**. Ours is a deploy.
- Google: dates must "match between the equivalent user-visible and structured values" (they do — both wrong) and must not be "the date of the action described on the page".
- QRG §5.6: information about the content creator that is "exaggerated or mildly misleading" → **Low**.
- The comment's own defence ("real review cadence tracked in editorial policy") does not hold: the editorial policy is prose that says re-review happens; nothing records *when* any page was actually reviewed.

**Consequence:** every rebuild silently re-dates 20 YMYL health pages as freshly physician-reviewed. That is the mechanism of a Low rating, and — separate from Google — it is a false statement about a doctor's professional act. **Fix: `reviewedOn` moves into per-page content JSON as a recorded fact; the build must never synthesise it.**

### 🔴 F2 — `/about` promises named per-page authors; the template renders a collective byline
`content/about.json` states, twice:
> "Every page has a named author, shown on the page. **We do not publish anonymous health content.**"
> "Each page shows who wrote it and who reviewed it, so you always know whose judgement you are reading."

`article.tsx:122` renders, on every page:
```tsx
<span>By <span …>the Kairali Editorial Team</span></span>
```
and `article.tsx:91` emits `person({ id: AUTHOR_ID, name: "The Kairali Editorial Team" })`.

There is no `author` field in the `Page` type (`app/lib/content.ts:13-26`) — **no page can have a named author.**

- QRG §5.5: "Pages on YMYL topics … should receive a **Low** rating if there is an unsatisfying amount of information about who is responsible for the website or **who created the content**."
- QRG §5.6 (the sharper hit): the site *claims* named authorship it does not deliver → "exaggerated or mildly misleading information about the website or content creator" → **Low**.
- Google helpful-content: "Is it self-evident to your visitors who authored your content?"

**This is the worst finding, because the dishonesty is in the honesty section.** A rater who reads `/about` (§3.4 says they start there) and then clicks any health page sees the contradiction immediately. Either ship named authors, or rewrite `/about` to describe the collective model truthfully. **Recommendation: ship named authors** — it is the stronger signal and it is what the voice claims.

### 🟠 F3 — `#medical-reviewer` and `#editorial-team` anchors do not exist; bylines link nowhere
`article.tsx:24-25` builds `@id`s pointing at `…/about#medical-reviewer` and `…/about#editorial-team`. `article.tsx:132` renders section headings as `id="s-0"`, `id="s-1"`… — **the only ids on `/about`**. Both anchors are dead, and the byline is a `<span>`, not a link.

- Google helpful-content asks literally: "**Do bylines lead to further information about the author or authors involved?**" → **No.**
- The `medical-review.ts` comment calls the anchor "stable #anchor on /about (not the person's name)" — the *design* is right (anchor survives a head-physician change); the *render* is missing.

**Fix:** content sections need an optional `anchor` field; `/about` sections set `anchor: "medical-reviewer"` / `"editorial-team"`; byline becomes `<Link href={/about#…}>`.

### 🟠 F4 — `medicalWebPage()` emits no author and no publisher — on precisely the pages that need them most
`packages/schema/src/index.js:158-169` emits only `@type/@id/name/url/about/lastReviewed/reviewedBy/inLanguage`. No `author`, no `publisher`, no `datePublished`/`dateModified`.

`article.tsx:64-83` branches: `clinical: true` → `medicalWebPage()`, else → `article()`. **11 of 20 pages are `clinical: true`** — i.e. every health page carries a visible "By the Kairali Editorial Team" byline that **does not exist in its structured data**, and names no publisher.

- Google Article guidance: "Make sure that **all the authors that are presented as authors on the web page are also included in markup**."
- The `Person`/`Physician` nodes also carry **no `url`/`sameAs`**, which Google "strongly recommend[s]".

**Fix:** extend `medicalWebPage()` with `author`, `publisher`, `datePublished`, `dateModified`, `citation`, `medicalAudience`; add `url`/`sameAs` to the reviewer node.

### 🟠 F5 — Conflict of interest is structural, real, and currently undisclosed on-page
QRG §3.4 p.27 is explicit: "The website or content creator **may not be a trustworthy source if there is a clear conflict of interest**," illustrated by the manufacturer reviewing its own product.

Kairali **publishes** this site and **sells** Ayurvedic products (KAPPL) and treatments (KTAHV). `/about` handles this with real integrity ("We separate education from selling… The body of an article is claim-free and independent. Where it is genuinely relevant, a **clearly marked box** may note where a therapy is practised"). The `PATHWAYS` module (`article.tsx:29-48`, rendered as a marked `<aside className="pathway">`) honours that promise.

**But `content/herbs__ashwagandha.json` breaks it.** Section 4 — *"Where can I find quality ashwagandha?"* — is **main content, not a marked box**, and it recommends the publisher's own pharmacy inside the article body:
> "Kairali's ashwagandha is manufactured at a **WHO-GMP-certified Ayurvedic pharmacy (KAPPL)**…"

and the answer capsule for that section steers sourcing to Kairali. The page hedges well ("That is a statement about *quality control*, not a claim that the herb treats any condition") — but it is still the manufacturer, inside the MC of a YMYL page, telling you where to buy. That is the QRG's own worked example of a COI.

**This is a `register_ok` judgement Abilash should make, not me. My recommendation:** (a) move all sourcing/where-to-buy content out of MC into the marked `pathway` aside without exception; (b) add a standing, visible **publisher-interest disclosure** on every health page ("Published by the Kairali Ayurvedic Group, which also operates an Ayurvedic hospital and pharmacy. This site sells nothing; see our editorial policy."); (c) treat "no Kairali entity named in MC" as a lint rule. Examine's answer to this exact problem — **cover ingredients, never products** — is the model, and we are one edit away from it.

### 🟡 F6 — `medical-review.ts` promises a one-line reviewer swap; content hardcodes the name
The file's own header:
> "So a leadership change is a **ONE-LINE edit** and never invalidates the site's institutional review process."

Verified: **`content/about.json` hardcodes "Dr. Deepu John" 6×; `content/faq.json` 1×.** A head-physician change is a 7+ line edit across content plus the config — and if any is missed, the site contradicts itself about who signed off on medical content. The abstraction is right; it is only half-wired.

**Fix:** content JSON gets `{{reviewer.name}}` / `{{reviewer.credentials}}` token substitution at render (the `Markdown` renderer already sits in the path), or `/about`'s reviewer section is generated from `MEDICAL_REVIEW` rather than authored. Then the header comment becomes true.

### 🟡 F7 — Citations are optional in the type; no minimum, no grading, and `nofollow` to NIH
`content.ts:22` → `citations?: Citation[]`, and `Citation = { n, text, url? }` — no source type, no year, no PMID/DOI, no primary-vs-secondary flag. Nothing blocks a `clinical: true` page shipping with zero citations. (Today all 11 clinical pages *do* cite — 2 to 11 each — but that is authorial discipline, not a gate.)

Also `article.tsx:170` renders citations with `rel="nofollow noopener"`. Outbound `nofollow` to nccih.nih.gov / pubmed / JAMA buys nothing and slightly undercuts the "we cite real sources" signal — reference links to authoritative primary literature should be followed. (Low impact; free to fix.)

Two pages sit at the floor: `/herbs/brahmi` (2), `/herbs/triphala` (2), `/panchakarma/the-five-therapies` (2), `/herbs` (2). For YMYL herb pages carrying interaction and pregnancy warnings, 2 citations is thin.

### 🟡 F8 — No `/medical-disclaimer`, no `/editorial-policy` route
Routes present: `/`, `/privacy`, `/cookie-policy`, `/terms`, `/what-is-ayurveda`, `[...slug]`. The disclaimer exists **only** as footer prose (`chrome.tsx:80-87`, which is good prose); the editorial policy exists **only** as §5 of `/about` with no linkable anchor.

Every reference publisher gives both a stable URL — because a rater, a journalist, or an LLM needs something to *cite*. `llms.txt` already asserts "Editorial stance: … not medical advice" with no URL to back it.

### 🟡 F9 — `register_ok: "ok" | "review"` is declared but never gates anything
`content.ts:25`. Nothing reads it. A page marked `"review"` ships identically to one marked `"ok"`. Per CLAUDE.md doctrine (g) — a gate that does not gate is worse than no gate, because it manufactures false assurance.

### 🟢 F10 — Non-clinical pages carry no review furniture at all
`/about`, `/history-of-ayurveda`, `/diet`, `/doshas*`, `/lifestyle*` are `clinical: false` → `Article` schema, no `lastReviewed`, no `reviewedBy`. Defensible for `/about` and `/history-of-ayurveda`. **Not defensible for `/diet`, `/diet/eating-by-dosha`, `/doshas/*`, `/lifestyle/dinacharya`** — dietary and daily-regimen advice is YMYL Health under QRG §2.3 ("Advice about an activity — could significant harm result from poor advice?"). The `clinical` boolean is being used to mean two different things: *"is this a health claim?"* and *"does this need a physician?"* Those must split.

---

## 4. THE TRUST FURNITURE CHECKLIST

### 4.1 Every health page (`clinical: true`) MUST render
| # | Item | Rendered artifact | QRG / Google hook |
|---|---|---|---|
| P1 | **Named author** with credentials, hyperlinked to their `/about#…` bio | `By <a href="/about#author-…">Name, Creds</a>` | §5.5; "Do bylines lead to further information?" |
| P2 | **Named medical reviewer** with credentials, hyperlinked to `/about#medical-reviewer` | `Medically reviewed by <a>Dr. …, BAMS</a>` | §3.4.1 "must come from experts" |
| P3 | **Institutional review line** | "Reviewed under the medical-review policy of the registered physicians of the Kairali Ayurvedic Group" → `/editorial-policy` | §3.4 Authoritativeness; survives a head change |
| P4 | **Real, per-page `Last medically reviewed: <date>`** — a recorded review event, never the build date | visible + `lastReviewed` identical | schema.org `lastReviewed`; publication-dates |
| P5 | **Next review due** (internal min.; public optional) | — | Examine/Healthline cadence parity **[secondary]** |
| P6 | **Publisher disclosure + interest statement** | "Published by the Kairali Ayurvedic Group, which also operates an Ayurvedic hospital and pharmacy. This site sells nothing." | §3.4 p.27 **conflict of interest** |
| P7 | **Medical disclaimer**, above the fold on herb/therapy pages, linking `/medical-disclaimer` | — | §2.3 YMYL Health |
| P8 | **≥3 citations, ≥1 to primary literature or a government/authority body**, numbered, resolvable | `<ol class="citations">` + `citation` in JSON-LD | §5.2 accuracy; "consistency with well-established expert consensus" |
| P9 | **Evidence-limits statement in the MC** (not a footnote) — what is known, what is not | — | §3.4.1 consensus alignment; our own editorial promise #2 |
| P10 | **Safety block** on any ingestible/therapy page: contraindications, interactions, pregnancy | — | §2.3 harm prevention |
| P11 | **Zero disease-cure claims**; DMR-Schedule claims lint (§5) | lint | §5.2 "harmful inaccuracies… Lowest"; Indian law |
| P12 | **No Kairali entity named in MC** — commercial routing lives only in the marked `pathway` aside | lint | §3.4 p.27 COI |
| P13 | **Corrections route** — `info@kairali.com` + "tell us if this is wrong" | — | Trust; §2.5.3 |
| P14 | **JSON-LD parity**: every visible byline/date/citation also in structured data | — | Article guidance: "all the authors… also included in markup" |
| P15 | **AI-authorship disclosure**, if applicable (§3.3 below) | — | helpful-content: "Is the use of automation… self-evident?" |

### 4.2 Every page (including non-health) MUST render
| # | Item |
|---|---|
| S1 | Publisher identified in footer — "Published by the Kairali Ayurvedic Group" |
| S2 | Contact reachable in ≤1 click (`info@kairali.com`, WhatsApp **+91 92898 38797**) |
| S3 | Footer medical disclaimer + link to `/medical-disclaimer` |
| S4 | Links to `/about`, `/editorial-policy`, `/medical-disclaimer`, `/privacy`, `/terms` |
| S5 | `Organization` JSON-LD with `@id`, `url`, `logo`, `sameAs` |
| S6 | Breadcrumbs, visible + `BreadcrumbList` |

### 4.3 The SITE MUST have
| # | Item | Status |
|---|---|---|
| W1 | `/about` — publisher identity, heritage, accreditations (NABH, WHO-GMP), why-we-exist | ✅ strong |
| W2 | `/about#medical-reviewer` — **anchor must exist**, reviewer bio + credentials | ❌ F3 |
| W3 | `/about#editorial-team` — **anchor must exist**, author bios | ❌ F3 |
| W4 | **`/editorial-policy`** — standalone URL: pipeline, reviewer roster, cadence, corrections, COI, AI stance | ❌ F8 |
| W5 | **`/medical-disclaimer`** — standalone URL | ❌ F8 |
| W6 | `/corrections` or a logged corrections section | ❌ |
| W7 | Per-author bio pages/anchors with real credentials | ❌ F2 |
| W8 | **Publisher-interest disclosure** — Kairali's commercial arms, stated plainly, linked from every health page | ❌ F5 |
| W9 | `/privacy`, `/terms`, `/cookie-policy` | ✅ |
| W10 | `llms.txt` pointing at W4/W5 by URL | ⚠️ asserts stance, cites no URL |
| W11 | Review-provenance record (who reviewed what, when) — the artifact behind the claim | ❌ F1 |

---

## 5. DATA FIELDS — the concrete schema change

### 5.1 `app/lib/content.ts` — extend `Page`
```ts
export type SourceType =
  | "systematic-review" | "rct" | "cohort" | "case-report"
  | "guideline" | "gov-authority"      // NCCIH, WHO, FDA, AYUSH
  | "classical-text"                    // Charaka, Sushruta — tradition, NOT evidence
  | "narrative-review" | "lab";

export type Citation = {
  n: number;
  text: string;
  url?: string;
  type: SourceType;
  primary: boolean;        // primary literature vs secondary summary
  year?: number;
  publisher?: string;      // "NCCIH" | "JAMA" | …
  pmid?: string;
  doi?: string;
  accessed?: string;       // ISO — when we last resolved this URL
};

export type Author = {
  key: string;             // → roster config; NEVER a free-text name
  anchor: string;          // "/about#author-<key>"
};

export type MedicalReview = {
  reviewerKey: string;     // → MEDICAL_REVIEW roster (institutional model)
  reviewedOn: string;      // ISO — a REAL review event. Never the build date.
  nextReviewDue: string;   // ISO
  signOff: "approved" | "pending";   // "pending" ⇒ page cannot ship (F9)
  scope?: string;          // what was checked
};

export type Safety = {
  contraindications: string[];
  interactions: string[];
  pregnancy: string;
  stopBeforeSurgery?: boolean;
};

export type Section = {
  h2: string;
  capsule: string;
  body: string;
  anchor?: string;         // F3 — stable anchors ("medical-reviewer")
};

export type Page = {
  // …existing…
  author: Author;                       // REQUIRED — kills the anonymous byline (F2)
  datePublished: string;                // ISO
  dateModified: string;                 // ISO
  medicalReview?: MedicalReview;        // REQUIRED when healthTopic !== "none"
  citations?: Citation[];               // REQUIRED ≥3 when healthTopic === "clinical"
  evidenceGrade?: "insufficient" | "preliminary" | "mixed" | "supported";
  safety?: Safety;                      // REQUIRED for ingestibles/therapies
  disclaimer: "general" | "herb-safety" | "therapy-safety";
  healthTopic: "none" | "wellness" | "clinical";   // replaces the `clinical` boolean (F10)
  commercialInterest?: "kappl" | "ktahv" | "villa-raag" | null;  // drives P6/F5 disclosure
  register_ok: "ok" | "review";         // MUST gate the build (F9)
};
```

**Why `healthTopic` replaces `clinical: boolean` (F10):** `none` → Article, no review furniture (`/about`, `/history-of-ayurveda`). `wellness` → dated review, disclaimer, no physician sign-off required (`/doshas/*`, `/lifestyle/dinacharya`, `/diet/*`). `clinical` → full furniture + physician sign-off + citation minimum (`/herbs/*`, `/panchakarma/*`). One boolean cannot carry both questions.

### 5.2 `app/lib/medical-review.ts` — grow the roster, keep the institution
Current shape is **directionally correct and should be preserved** — institutional framing + one named current head + a stable anchor is exactly right for E-E-A-T-that-survives-turnover. Two changes:
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
      url: "/about#medical-reviewer",   // Google: "strongly recommend… url or sameAs"
      sameAs: [],                        // registry/council profile when available
      bio: "…",
      registration?: "…",                // CCIM/state council no. — VERIFIABLE credential (§5.6)
    },
  },
  currentHeadKey: "deepu-john",          // the one-line edit the header promises
} as const;
```
`MedicalReview.reviewerKey` resolves here, so a **past** page keeps naming the physician who actually reviewed it after the head changes — which is both honest and what §5.6's "verifiable credentials" wants. The one-line edit stays true only if `/about` + `/faq` stop hardcoding the name (**F6**).

### 5.3 `packages/schema` — extend `medicalWebPage()`
Add `author`, `publisher`, `datePublished`, `dateModified`, `citation[]`, `medicalAudience`, and allow `reviewedBy` to be an **array** (`[Physician, Organization]`) — schema.org permits Organization, which encodes the institutional model natively:
```jsonc
"reviewedBy": [ { "@id": ".../about#medical-reviewer" }, { "@id": ".../#organization" } ]
```
This is the cleanest expression of "one named physician, institutionally backed" available in the vocabulary — and it degrades gracefully when the head changes.

---

## 6. Claims lint — the legal layer nobody has scoped yet

Kairali is an **Indian** publisher that also sells Ayurvedic products. The **Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954** ([India Code PDF](https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf), [overview](https://en.wikipedia.org/wiki/Drugs_and_Magic_Remedies_(Objectionable_Advertisements)_Act,_1954)) prohibits advertising a remedy for any disease in its **Schedule**, which includes: *cancer, diabetes, heart disease, high/low blood pressure, epilepsy, paralysis, obesity, leprosy, glaucoma, cataract, blindness, deafness, TB, sexual impotence, sterility in women, insanity, nervous debility, rheumatism, kidney/gall-bladder stones, fever (in general), female diseases (in general)…* — plus prohibitions on claims about conception, miscarriage and sexual pleasure. Cognizable offence; up to 6 months' imprisonment on first conviction.

The site is **educational, not advertising**, which is the defence — **and that defence is exactly what F5 erodes.** The moment MC recommends Kairali's own pharmacy for an ingestible (as `/herbs/ashwagandha` §4 does), the education/advertising line gets blurry, and a Schedule disease named nearby becomes a live exposure. This is the strongest *practical* argument for F5's fix, independent of Google.

**Recommended lint (`clinical` + `wellness` pages):**
1. **DMR Schedule list** × cure/treat/prevent/remedy verbs → hard fail.
2. Banned claim verbs near any condition noun: `cure`, `cures`, `treats`, `prevents`, `permanent relief`, `guaranteed`, `miracle`, `remedy for`.
3. **No Kairali entity named in MC** (KAPPL / Kairali Ayurvedic Products / WHO-GMP / KTAHV / Healing Village) — allowed **only** inside the `pathway` aside (F5/P12).
4. Ingestible page without `safety.pregnancy` → fail.
5. `clinical` page with <3 citations or 0 `primary: true` → fail.
6. `medicalReview.signOff !== "approved"` or `register_ok === "review"` → fail (F9).
7. `reviewedOn` in the future, or equal to build date, or >18 months stale → fail (F1).

Note this lint is *additive to*, not a replacement for, the KTAHV clinical-lock — **the KTAHV banned-word list does not apply here** (whatisayurveda is group/educational register per CLAUDE.md). Do not cross-apply.

---

## 7. What I recommend Abilash decide (pushback duty)

1. **F1 is not a nitpick — it is a false statement about a physician's professional act, auto-generated on every deploy.** I'd stop shipping the constant before I'd ship a new page. Cheapest honest fix: `reviewedOn` per page, backfilled to the date Dr. Deepu John actually reviewed each one. If he has not yet reviewed all 20, then the pages that lack review must not claim it — which is a content decision, not an engineering one.
2. **F2 forces a choice: ship named authors, or stop claiming them.** I recommend named authors — the voice ("we would rather be trusted than be loud") only survives if the furniture matches. But that needs real people with real credentials willing to be named, which is Abilash's call and blocks on the roster.
3. **F5 is the one I'd argue hardest.** The site's entire strategic premise is *the honest one*. Recommending your own pharmacy inside the body of a YMYL herb page is the QRG's own textbook COI example, and it is the thing that converts "duty and gratitude" into "content marketing" in a rater's eyes. Examine's ingredients-not-products rule is right there, and we are one edit from it. The `pathway` aside already exists and already does this correctly — `/herbs/ashwagandha` §4 just needs to move into it.
4. **F6:** either finish the abstraction or delete the comment. A header that promises a one-line edit, in a file whose whole purpose is that promise, while 7 hardcoded names sit in content, is the kind of thing that rots quietly.

**Open questions for QUESTIONS.md:** (a) has Dr. Deepu John reviewed all 20 pages, and on what dates? (b) who are the named authors, with what credentials? (c) is his council registration number publishable (§5.6 "verifiable credentials")? (d) does F5's fix get approved — no Kairali entity in MC, ever?

---

## 8. Sources

**Primary (fetched, 200):**
- Google, *General Guidelines* (Search Quality Rater Guidelines), 11 Sep 2025, 182pp — <https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf> → <https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf>
- Google, *Creating helpful, reliable, people-first content* — <https://developers.google.com/search/docs/fundamentals/creating-helpful-content>
- Google, *Article structured data* — <https://developers.google.com/search/docs/appearance/structured-data/article>
- Google, *Publication and modification dates* — <https://developers.google.com/search/docs/appearance/publication-dates>
- schema.org, *MedicalWebPage* — <https://schema.org/MedicalWebPage>
- Healthline, *Content integrity* — <https://www.healthline.com/about/content-integrity>
- NCCIH, *Ayurvedic Medicine: In Depth* — <https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth>
- Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954 — <https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf>

**Secondary (403 to WebFetch — re-verify via browser in a later pass):**
- Examine.com, *Editorial policy* — <https://examine.com/about/editorial-policy/>
- Examine.com, *Research process* — <https://examine.com/about/research-process/>
- Examine.com — <https://en.wikipedia.org/wiki/Examine.com>
- Mayo Clinic, *About this site* — <https://www.mayoclinic.org/about-this-site/welcome>

**Repo (read):** `sites/whatisayurveda.com/app/lib/medical-review.ts`, `app/lib/content.ts`, `app/lib/meta.ts`, `app/_components/article.tsx`, `app/_components/chrome.tsx`, `app/llms.txt/route.ts`, `content/*.json` (20 files), `packages/schema/src/index.js`.
