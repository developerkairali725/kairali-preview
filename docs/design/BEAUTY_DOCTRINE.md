# BEAUTY DOCTRINE — the completed "What is Beauty?" paper, Kairali Web Factory

**Status: LAW.** Executed 2026-07-18 per D-20260718-21 (Abilash in-chat, ~20:45 IST).
**Immutable input layer:** `docs/design/beauty-doctrine-inputs-2026-07-18.md` — the owner-supplied
16 additions + four-pillar structure + the Kairali Definition of Beauty, verbatim. This doctrine is
built FROM that file and cites it per section as **(inputs §N)**. The owner's supplied text is never
silently reworded: wherever his text appears it is a verbatim blockquote; everything outside a
blockquote is factory commentary that operationalises it.
**Enforced by:** `scripts/beauty-audit.mjs` (gate row `beauty-conformance`, `gates/registry.yaml`) —
the machine-readable rubric this gate parses is §R below. Evidence: `launches/<domain>/beauty/`,
append-only.
**Amendments:** LEARNINGS.md-driven PRs only (same rule as DESIGN_DOCTRINE.md); the input file
itself is never edited.

---

## Provenance — where the "75–80%" lives (honest note)

The inputs describe themselves as the missing 20–25% of an internal **"What is Beauty?" paper**
assessed as 75–80% complete. That paper, under that title, **does not exist in this repository** —
searched verbatim and by synonym (beauty / aesthetic / NN-g) across `docs/design/`, `docs/research/`,
`wiki/`, every remote branch, and full git history on 2026-07-18. What DOES exist, and what
functionally IS the 75–80% (the science-of-beauty layer the critique says was already done), is:

- **`docs/design/DESIGN_DOCTRINE.md`** — the evidence-based design law: NN/g, Baymard, web.dev,
  Gestalt; mistakes-to-avoid, high-end levers, timeless principles, the B-14 scoring instrument.
- **`docs/design/LANDING_PAGE_DOCTRINE.md`** — the LP-specific law.
- **`packages/ui/brand-tokens.css` + `raag-tokens.css`** — the brand manuals (doctrine (d): they win).
- **`docs/ENGINEERING_STANDARDS.md`** — performance/accessibility engineering law.

This doctrine therefore completes the paper by MERGING that existing corpus (as Pillar 1 and the
mechanical layer of Pillar 4) with the owner's 16 additions — exactly the integration the inputs
prescribe. If the original "What is Beauty?" prose paper surfaces (e.g. in Drive), it merges into
Pillar 1 by amendment PR; nothing here blocks on it.

---

## The organising law (inputs §1)

> **Beauty is Not the Goal. Desired Perception is.** People don't buy beauty. People buy
> what beauty communicates. A beautiful website should immediately answer: Can I trust this
> company? Is this premium? Is this authentic? Is this worth paying more for? Do people like
> me come here? Will this solve my problem? Does this feel calming? Is this luxurious? Is
> this scientific? Is this safe? Beauty is therefore a communication tool. Not decoration.

Everything below is machinery for that sentence. A page is beautiful **only** relative to the
perception it must create, for its entity, for its page type. "Sexy sells" (CLAUDE.md Operating
Principles, design bar) resolves to THIS doctrine: sexy = the desired perception achieved with
restraint, not decoration added.

---

# PILLAR 1 — THE SCIENCE OF BEAUTY

*(inputs, four-pillar structure §1: "UX research, psychology, accessibility, NN/g principles.")*

The science layer is **already law** in this repo and is INCORPORATED here by reference rather than
duplicated (duplicating law forks it):

- **`docs/design/DESIGN_DOCTRINE.md`** is Pillar 1's body: the 50ms aesthetic-usability effect,
  F-pattern scanning, visual hierarchy, the four properties of "looks good" (consistent typography ·
  clear hierarchy · refined limited palette · strict grid), carousel/popup/dark-pattern bans, form
  science, touch targets, contrast law, motion law. Every claim there carries its NN/g / Baymard /
  web.dev citation.
- **Multi-sensory scope** (inputs §4, verbatim):

  > **Beauty is Multi-Sensory.** Visual, motion, typography, writing, photography, video,
  > loading experience, scrolling experience, animation, micro-interactions, sound (where
  > appropriate). Every one contributes.

  Operationally: the beauty gate judges the page as an EXPERIENCE — the screenshots carry visual +
  typographic + photographic evidence; the page source carries motion, loading and interaction
  evidence; performance evidence carries the loading experience (see Pillar 2, §14).
- **Accessibility is beauty's floor, not its rival**: WCAG AA contrast tiers, focus rings,
  `prefers-reduced-motion`, touch targets — all mechanically gated (brand-lint A4, Lighthouse A5,
  factory spec). A page that excludes is not beautiful, whatever it looks like.

**Gate consequence:** the beauty gate does NOT re-litigate Pillar 1 mechanics. They are owned by the
existing instruments (B-14 design-critic scorecard, brand-lint, Lighthouse, factory spec) and the
rubric REFERENCES their evidence (§R, `referenced` lane).

---

# PILLAR 2 — THE BUSINESS OF BEAUTY

*(inputs, four-pillar structure §2: "ROI, conversions, positioning, luxury branding, SEO, performance.")*

## §2 · Beauty depends on business goals — the four entity definitions (inputs §2)

> **Beauty Depends on Business Goals.** Every website has a different definition of beauty.
> - **Healing Village** — beauty should communicate: healing, calm, trust, authenticity,
>   expertise, nature, safety, luxury without intimidation.
> - **Villa Raag** — beauty should communicate: exclusivity, scarcity, architecture,
>   craftsmanship, privacy, aspiration, elegance, emotional storytelling.
> - **KAPPL Products** — beauty should communicate: purity, efficacy, authenticity, premium
>   quality, trust, clinical credibility, Ayurveda.
> - **Blog** — beauty should disappear. The content should become the hero. (Medium,
>   Substack, Apple Newsroom, NN/g all understand this.)

These communicate-lists are the **per-entity acceptance criteria** — expanded into full chapters in
Pillar 4, and machine-readable in §R. A page is judged against ITS entity's list, never a generic
one.

## §3 · ROI changes what beauty means — the per-page-type framework (inputs §3)

> **ROI Changes What Beauty Means.** A landing page exists to convert. A blog exists to
> educate. A homepage exists to position. An About page exists to build trust. A product
> page exists to reduce buying anxiety. Beauty changes accordingly — its own framework.

The framework, operationalised — every page is judged FOR ITS JOB:

| Page type | The job (ROI definition of beauty) | Beauty succeeds when… | Beauty fails when… |
|---|---|---|---|
| **Landing page** | **Converts.** | Nothing competes with the one CTA; trust evidence is staged before the ask; the ad promise is visually honoured (message match). | Decoration adds friction; beauty admires itself instead of selling. ROI-first: on an LP, beauty SERVES conversion — this is the registry's landing-class adaptation. |
| **Blog / article** | **Educates.** | The design disappears; typography, measure and rhythm make long reading effortless; the content is the hero (inputs §2, Blog). | The frame outshines the words; ornament interrupts reading. |
| **Homepage** | **Positions.** | Ten seconds in, the visitor knows what this is, for whom, at what level — the entity's communicate-list answered above the fold and proven below it. | It's pretty but positionless; it could be anyone's wellness site. |
| **About page** | **Builds trust.** | Real people, real credentials, real place — named physicians, heritage, NABH, the campus. Convergent, verifiable specifics. | Corporate boilerplate with stock-feeling imagery. |
| **Product page (PDP)** | **Reduces buying anxiety.** | Every anxiety met in order: what it is, what's in it, is it authentic, is it safe, what it costs, what happens next. | Beauty hides the answers a buyer needs before paying. |
| **Other** | The brief must state the page's ONE job; the gate judges against that stated job. | — | A page with no stated job cannot be judged beautiful (inputs §1: beauty is a communication tool). |

## §9 · Beauty must match price — the price-perception ceiling (inputs §9)

> **Beauty Must Match Price.** A ₹500 product tolerates average design; a ₹5 lakh healing
> programme cannot. The website's perceived quality sets the CEILING for perceived value —
> a ₹50,000-feeling website makes the visitor question a ₹5 lakh offering.

Operationally: every page is judged against **the most expensive thing its entity asks the visitor
to believe in** — a multi-week residential programme (Healing Village), a private-villa stay (Villa
Raag), a premium formulation (KAPPL). "Good enough for a website" is not the bar; "does not cap the
offering's perceived value" is.

## §10 · Trust before beauty — the staging order (inputs §10)

> **Trust Before Beauty.** Not Beauty→Trust but Beauty→Attention→Trust→Conversion.
> Beauty opens the door. Trust closes the sale.

Operationally: beauty earns the first 50ms and the first scroll; from there the page must HAND OVER
to trust evidence (credentials, real photography, specifics, transparent costs) before any
conversion ask. A page that asks before it proves fails this criterion regardless of how it looks.
(This compounds with DESIGN_DOCTRINE.md's trust-signal law and CLAUDE.md rule 6: trust evidence is
locked facts only, never invented.)

## §14 · Beauty through performance (inputs §14)

> **Beauty Through Performance.** A beautiful website that takes six seconds to load
> isn't beautiful. Core Web Vitals, image optimisation, responsive images, caching,
> accessibility, semantic HTML, SEO — engineering quality IS perceived quality.

Operationally: performance is a beauty criterion, but its NUMBERS are owned by the existing
`lighthouse-budgets` gate (Perf ≥90 · A11y ≥95 · SEO 100 — Ship Gate A5). The beauty gate **reads
that existing evidence; it never re-measures** (gate-duplication law, §G below). Missing performance
evidence is a finding ("needs evidence"), not a re-run.

---

# PILLAR 3 — THE PHILOSOPHY OF BEAUTY

*(inputs, four-pillar structure §3: "timelessness, authenticity, emotional design, storytelling, restraint, craftsmanship.")*

## §5 · The emotional journey arc (inputs §5)

> **Emotional Journey.** Luxury websites are emotional journeys, not page collections:
> Arrival → Curiosity → Calm → Discovery → Trust → Aspiration → Evidence → Desire →
> Confidence → Action. Every page intentionally guides visitors through these emotions.

Operationally: a page is a SEGMENT of that arc, not the whole of it. The gate asks: which stages
does this page own, and does its section order actually walk them? (A homepage typically owns
Arrival→Curiosity→Calm→Discovery and hands off; a PDP owns Evidence→Desire→Confidence→Action; an
About page owns Trust; a blog post owns Discovery→Trust.) A page whose sections are a pile rather
than a sequence fails the arc even if each section is individually fine — this is inputs §13's
storytelling law applied structurally:

> **Storytelling.** Narrative design: great luxury websites unfold like documentaries —
> every section answers one question before moving to the next. Visitors uncover a story,
> not scroll a brochure.

## §7 · Beauty is invisible (inputs §7)

> **Beauty is Invisible.** The best websites make users notice the EXPERIENCE, not the
> design (Apple, Hermès, Aman, Ritz-Carlton, Airbnb). Users simply feel "this is nice."
> That's mastery.

Operationally: any element whose primary effect is "look at this design" — gratuitous motion, novel
layout for novelty's sake, decorative flourish that serves no perception on the entity's list — is a
finding. The compliment we build for is about the place, the treatment, the product; never the
website.

## §8 · Luxury means editing — the restraint law (inputs §8)

> **Luxury Means Editing.** Premium improves by REMOVING. Luxury is restraint: less text,
> fewer buttons, fewer colors, fewer animations, more confidence.

Operationally, the gate's restraint probe: **name what could be removed from this page without
losing any item on the entity's communicate-list.** If the honest answer is "several things", the
page is not edited yet. This is the same subtraction law as NN/g heuristic #8 (DESIGN_DOCTRINE §3)
raised from usability to brand: restraint IS the luxury signal.

## §11 · Authenticity is beauty — the authenticity law (inputs §11)

> **Authenticity is Beauty.** Especially for Ayurveda: don't imitate Bali, Japanese spas,
> or generic wellness resorts. Show Kerala. Show craftsmanship. Show doctors. Show real
> therapies. Show heritage. Show nature. Authenticity creates beauty.

This is a HARD aesthetic law for the whole fleet: **show Kerala, never imitate Bali / Japanese spas /
generic wellness.** Positive markers the gate looks for: real Kairali photography (the group's own
library — DESIGN_DOCTRINE §5.2 source priority), Kerala architecture and landscape, named physicians
and real therapies, heritage specifics, craftsmanship detail. Negative markers: stock-tropical
"resort minimalism", zen-garden/Japanese-spa visual language, interchangeable wellness-brand
aesthetics, AI-generic imagery (and never AI humans on KTAHV — standing law). An inauthentic
beautiful page fails: authenticity is not one ingredient of beauty here, it is a precondition.

## §12 · Time — the timelessness law (inputs §12)

> **Time.** Great design ages well — still elegant five years later. Avoid trends that
> date quickly; build timelessness.

Operationally: the gate flags trend-coupled choices (this season's gradient/glassmorphism/scroll
gimmick) that will date the page, versus the timeless materials the system is built on (type
discipline, whitespace, real photography, restrained palette). The five-year question: would this
page embarrass us in 2031?

## §15 · Beauty through copywriting (inputs §15)

> **Beauty Through Copywriting.** Design and writing cannot be separated — Apple is
> beautiful because every sentence feels deliberate. Typography and copy create beauty
> together.

Operationally: the gate reads the copy IN the screenshots as a design element — is every visible
sentence deliberate, load-bearing, in the entity's register? Filler copy, redundant headings and
lorem-adjacent genericness are beauty failures, not "content issues for later". (Truth of claims is
the Perplexity lane of the design-external review — referenced, not re-run; deliberateness is
owned here.)

## §6 · Craftsmanship & consistency (inputs §6 — bridges to Pillar 4)

> **Brand Consistency.** Premium brands repeat, they don't reinvent. Photography,
> illustration, spacing, margins, buttons, animation, icons, writing, voice, colors, white
> space — consistency creates subconscious trust.

---

# PILLAR 4 — THE KAIRALI STANDARD OF BEAUTY

*(inputs, four-pillar structure §4, verbatim: "consistent application across Healing Village,
Villa Raag, KAPPL, blogs, and every future digital property: one coherent premium digital
ecosystem, not isolated websites.")*

The fleet system IS the consistency mechanism (inputs §6): `packages/ui` brand tokens, the
three-font hierarchy, the 4px rhythm, pill buttons, the one-accent-per-view law, shared components
only (Factory Rules). A page that reinvents instead of repeats breaks the ecosystem even if it is
individually lovely — the fleet reads as ONE premium group or it reads as nothing.

## Chapter: Healing Village (KTAHV — ayurvedichealingvillage.com)

**Communicate-list (inputs §2, exact):** healing, calm, trust, authenticity, expertise, nature,
safety, **luxury without intimidation**.

- **Register nuance (binding):** KTAHV copy operates under the LANGUAGE LOCK — the WORDS
  spa/resort/holiday/luxury/cure/journey/guests are banned. "Luxury without intimidation" is
  therefore a PERCEPTION delivered by pixels, photography, restraint and pacing — never by the
  banned vocabulary. The design says luxury; the copy says clinical. Both at once, always.
- The desired-perception questions weighted here (inputs §1): *Does this feel calming? Is this
  safe? Is this scientific? Can I trust this company?* — a NABH hospital's beauty is calm clinical
  authority in a real Kerala setting.
- Price ceiling (§9): the page must carry a multi-week residential programme's perceived value.
- Authenticity (§11) at maximum strength: the actual campus, actual physicians, actual therapies.
  No AI humans, ever.

## Chapter: Villa Raag (villaraag.com)

**Communicate-list (inputs §2, exact):** exclusivity, scarcity, architecture, craftsmanship,
privacy, aspiration, elegance, emotional storytelling.

- Hospitality register is CORRECT here (no clinical lock). Emotional storytelling (§5/§13) carries
  the page: the villa unfolds as a narrative of place and craft, not a room-list.
- Scarcity is shown honestly (one villa, its reality) — never fabricated urgency (dark-pattern
  zero-tolerance, DESIGN_DOCTRINE §1.7).
- Own brand manual: `raag-tokens.css` — never the Kairali tokens as a skin.

## Chapter: KAPPL Products (kairaliorganic.com · kairbykairali.com · bulk B2B sites)

**Communicate-list (inputs §2, exact):** purity, efficacy, authenticity, premium quality, trust,
clinical credibility, Ayurveda.

- PDP job (§3): reduce buying anxiety — composition, provenance, WHO-GMP credibility, honest claims
  (the claims ceiling is the owner-ruled fact base; certification never implied where none exists —
  D-EXTREVIEW-OWNER-FACTS context files carry these rulings into every review).
- Product photography discipline: real product, real texture, in-scale/in-context shots
  (DESIGN_DOCTRINE §2.2 gallery law).

## Chapter: Blog & knowledge properties (whyayurveda.org · whatisayurveda.com · healing.recipes)

**The definition (inputs §2, exact):** "beauty should disappear. The content should become the
hero. (Medium, Substack, Apple Newsroom, NN/g all understand this.)"

- The rubric inverts here: ornament is a defect class. Measure, rhythm, type scale, restrained
  figures/diagrams, effortless long-form reading — the design succeeds by not being noticed (§7 at
  maximum strength).
- Author voice and E-E-A-T presence (real bylines, credentials) are the trust layer (§10).

## Every future property

New entities/domains inherit this doctrine by declaring their entity chapter (or adding one by
amendment PR with an explicit communicate-list) BEFORE their beauty gate can run — the gate refuses
to guess an unmapped domain's entity. One coherent premium digital ecosystem, by construction.

---

## §G · The gate — beauty-conformance (what it owns, what it references)

**Instrument:** `scripts/beauty-audit.mjs`. Inputs per run: rendered **desktop AND mobile
screenshots** (the judge sees pixels — same image law as D-20260718-12), the **page source**, the
page's **strategy artifact** (BRIEF/STRATEGY/build-plan — the stated job it is judged against), the
entity + page type, and any owner-facts context. Output: findings per pillar, one strict
**PASS/FAIL** verdict + an **advisory lane** (D-EXTREVIEW-OWNER-FACTS: doubt about an
owner-confirmed fact is ADVISORY, never a blocking FAIL — the owner's signature stays the deciding
judgment). Evidence: `launches/<domain>/beauty/<date>.md`, append-only (a rerun is the next pass,
never an overwrite).

**Gate-duplication law (binding):** where an existing gate already owns a criterion, this gate
REFERENCES that gate's evidence instead of re-running it. The division:

| Criterion | Owner | Beauty gate's role |
|---|---|---|
| Is the design good / boring / templated (external eyes) | design-external-ai-review Gate 1/2 (`scripts/design-review.mjs`) | Reference evidence file |
| Are visible claims TRUE (live-verified) | audit-perplexity lane of Gate 1/2 | Reference evidence file |
| Performance / CWV numbers | lighthouse-budgets (Ship Gate A5) | READ existing evidence, never re-measure (§14) |
| Usability mechanics, token conformance | B-14 design-critic + brand-lint A4 + factory spec | Reference scorecard/lint |
| Conversion-science frameworks (MCB/MoA/look) | go-science-conformance (`scripts/go-science-audit.mjs`) | Reference `launches/<domain>/go-science/` evidence |
| **Entity-perception fit · restraint · timelessness · fleet consistency · authenticity · price-perception ceiling · emotional arc · trust-before-beauty staging · copy deliberateness** | **THIS GATE — nothing else checks these** | Judge directly |

---

## §R · THE RUBRIC (machine-readable — parsed by scripts/beauty-audit.mjs)

The JSON block below is the gate's single source of truth for entities, page types and criteria.
Editing it IS editing the gate (rule g applies: never weakened without a logged ruling).

```json
{
  "version": 1,
  "source": "docs/design/beauty-doctrine-inputs-2026-07-18.md (owner-supplied, verbatim)",
  "entities": {
    "healing-village": {
      "label": "Kairali - The Ayurvedic Healing Village (KTAHV)",
      "domains": ["ayurvedichealingvillage.com"],
      "communicates": ["healing", "calm", "trust", "authenticity", "expertise", "nature", "safety", "luxury without intimidation"],
      "register_note": "KTAHV LANGUAGE LOCK binds: the luxury PERCEPTION is delivered by design, the WORD luxury (and spa/resort/holiday/cure/journey/guests) never appears in copy. No AI humans, ever."
    },
    "villa-raag": {
      "label": "Villa Raag (Agonda, Goa)",
      "domains": ["villaraag.com"],
      "communicates": ["exclusivity", "scarcity", "architecture", "craftsmanship", "privacy", "aspiration", "elegance", "emotional storytelling"],
      "register_note": "Hospitality register is correct here. Scarcity shown honestly, never fabricated urgency. raag-tokens.css is the manual."
    },
    "kappl": {
      "label": "KAPPL Products",
      "domains": ["kairaliorganic.com", "kairbykairali.com", "bulkayurvedaproducts.com", "bulkayurvedaoils.com"],
      "communicates": ["purity", "efficacy", "authenticity", "premium quality", "trust", "clinical credibility", "Ayurveda"],
      "register_note": "Product-pharma register. Claims ceiling = owner-ruled facts; certification never implied where none exists."
    },
    "blog": {
      "label": "Blog & knowledge properties",
      "domains": ["whyayurveda.org", "whatisayurveda.com", "healing.recipes"],
      "communicates": ["beauty should disappear", "the content becomes the hero"],
      "register_note": "Ornament is a defect class here. Measure, rhythm, effortless long-form reading; real bylines carry trust."
    }
  },
  "page_types": {
    "landing": { "job": "converts", "roi_focus": "Nothing competes with the one CTA; trust staged before the ask; message match with the ad promise. ROI-first: beauty serves conversion (doctrine §3)." },
    "blog": { "job": "educates", "roi_focus": "The design disappears; reading is effortless; the content is the hero." },
    "homepage": { "job": "positions", "roi_focus": "Ten seconds in: what this is, for whom, at what level - the entity communicate-list answered above the fold, proven below it." },
    "about": { "job": "builds trust", "roi_focus": "Real people, credentials, place; convergent verifiable specifics; zero boilerplate." },
    "pdp": { "job": "reduces buying anxiety", "roi_focus": "Every buying anxiety met in order: what, contents, authenticity, safety, cost, next step." },
    "other": { "job": "as stated in the strategy artifact", "roi_focus": "The strategy artifact must state the page's ONE job; judge against that stated job." }
  },
  "criteria": [
    { "id": "B1", "pillar": "business", "lane": "owned", "question": "Desired perception: does the page immediately answer the inputs-§1 questions that matter for THIS entity (trust / premium / authentic / worth paying more / people-like-me / solves-my-problem / calming / luxurious / scientific / safe)?" },
    { "id": "B2", "pillar": "kairali-standard", "lane": "owned", "question": "Entity communicate-list: is every item on this entity's list served by something visible on the page (or consciously deferred to a named sibling page)?" },
    { "id": "B3", "pillar": "business", "lane": "owned", "question": "ROI fit (doctrine §3): does the page do ITS page-type job - convert / educate / position / build trust / reduce buying anxiety - rather than a generic 'look nice' job?" },
    { "id": "B4", "pillar": "philosophy", "lane": "owned", "question": "Restraint (§8): name what could be removed without losing any communicate-list item. Is the page edited - less text, fewer buttons, fewer colours, fewer animations, more confidence?" },
    { "id": "B5", "pillar": "kairali-standard", "lane": "owned", "question": "Fleet consistency (§6): does the page repeat the system (tokens, type hierarchy, spacing rhythm, button language, voice) rather than reinvent it? Would it sit beside its sibling sites as ONE premium group?" },
    { "id": "B6", "pillar": "philosophy", "lane": "owned", "question": "Authenticity (§11): does it SHOW Kerala - real place, real people, real therapies, heritage, craftsmanship - and avoid Bali/Japanese-spa/generic-wellness imitation and AI-generic imagery?" },
    { "id": "B7", "pillar": "business", "lane": "owned", "question": "Price-perception ceiling (§9): does perceived quality support the most expensive thing this entity asks the visitor to believe in - or does the page cap the offering's value?" },
    { "id": "B8", "pillar": "philosophy", "lane": "owned", "question": "Emotional arc (§5/§13): which stages of Arrival→…→Action does this page own, and does its section order actually walk them - a story, not a brochure pile?" },
    { "id": "B9", "pillar": "business", "lane": "owned", "question": "Trust before beauty (§10): is trust evidence (credentials, real photography, specifics, transparent costs) staged BEFORE every conversion ask?" },
    { "id": "B10", "pillar": "philosophy", "lane": "owned", "question": "Copy deliberateness (§15): read the visible copy as a design element - is every sentence deliberate, load-bearing, in register? Filler and generic headings are beauty failures." },
    { "id": "B11", "pillar": "philosophy", "lane": "owned", "question": "Timelessness (§12): flag trend-coupled choices that will date the page. Would it still be elegant in five years?" },
    { "id": "B12", "pillar": "philosophy", "lane": "owned", "question": "Invisibility (§7): does anything exist primarily to be admired as design? The experience, not the design, should be what's noticed." },
    { "id": "R1", "pillar": "science", "lane": "referenced", "question": "Performance as beauty (§14): READ the supplied Lighthouse/CWV evidence (Ship Gate A5) - never re-measure. Missing evidence is a finding ('needs evidence'), not a re-run.", "evidence": "lighthouse-budgets (scripts/lighthouse-gate.mjs), Ship Gate A5" },
    { "id": "R2", "pillar": "science", "lane": "referenced", "question": "External design quality + truth of claims: reference the design-external-ai-review Gate 1/2 evidence for this site if supplied; do not re-run those reviews.", "evidence": "launches/<domain>/design-review/ per D-20260718-12 / D-20260718-15" },
    { "id": "R3", "pillar": "science", "lane": "referenced", "question": "Usability mechanics + token conformance: reference the B-14 design-critic scorecard and brand-lint/factory-spec results; do not re-audit computed styles here.", "evidence": "launches/<domain>/design-review.md (B-14) + brand-lint A4 + factory spec" },
    { "id": "R4", "pillar": "business", "lane": "referenced", "question": "Conversion-science frameworks (MCB/MoA/look): reference the go-science-conformance evidence where it exists; do not re-derive it.", "evidence": "launches/<domain>/go-science/ (scripts/go-science-audit.mjs, D-GO-SCIENCE-GATE)" }
  ]
}
```

---

## THE CLOSE — The Kairali Definition of Beauty (inputs §16, verbatim)

> Beauty is the harmonious integration of authenticity, simplicity, craftsmanship,
> usability, trust, emotional resonance, and timeless elegance, designed to communicate
> healing, luxury, and credibility while guiding the visitor effortlessly toward the
> desired outcome. Beauty is not decoration; it is the visible expression of quality.
> Every element—visual, written, technical, and experiential—should reinforce the
> perception that Kairali delivers premium Ayurvedic care rooted in tradition and
> elevated by modern excellence.
