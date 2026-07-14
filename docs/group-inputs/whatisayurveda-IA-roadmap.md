# whatisayurveda.com — Full Information Architecture Roadmap ("The Ayurveda Bible")

**2026-07-14 22:15:00 IST · Abilash vision directive (in-chat).**
Abilash: whatisayurveda.com is NOT a 20-page site — it is to become the **WebMD / bible of Ayurveda**. This doc captures the full ambition, confirms the v1 architecture already scales to it, and flags the two pillars that need new engineering beyond "add a content file". Build small now, grow continuously.

> **Foundation already supports this.** The v1 build renders every page from a per-page JSON file in `sites/whatisayurveda.com/content/` through ONE catch-all route (`app/[...slug]/page.tsx`). Adding 20 → 2,000 pages is **content, not code** — new clusters are new subfolders of JSON + a nav/hub entry. The hub-and-spoke model, MedicalWebPage/Person/FAQPage schema, answer-capsule template, and physician-review byline all apply unchanged to every new monograph type. So the seed we shipped is the correct foundation; the roadmap below is additive.

---

## Status of the six Abilash-named pillars vs the current build

| Pillar | In v1? | Architecture fit | Notes |
|---|---|---|---|
| **Individual INGREDIENT monographs** (single herbs/minerals/oils, botanical + Sanskrit names, rasa/virya/vipaka, evidence, cautions) | Partial — 4 herb pages exist as the seed | ✅ Fits catch-all + content JSON directly | Becomes `/ingredients/<name>` — a standardized monograph template (NCCIH fact-sheet skeleton the herbs already use). Target: the ~50-monograph proven sustained set, then A–Z. This is the single biggest cluster. |
| **PRODUCT monographs** (Kairali's own formulations, described educationally — what's in it, classical basis, how it's made) | No | ✅ Fits catch-all + content JSON | `/formulations/<name>`. EDUCATIONAL register only (what it is / classical reference / ingredients) — NEVER e-commerce or cure claims; "buy" routes to the Shopify store. Ties to KAPPL catalog + the 561 product images already in the library. Clinical → Dr. Deepu John gate. |
| **CLASSICAL TEXTS** (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Bhava Prakasha, Madhava Nidana) | Partial — `/history-of-ayurveda` touches them | ✅ Fits catch-all + content JSON | Promote to a dedicated `/classical-texts/` hub + one deep page per samhita (authorship, structure, what it covers, why it matters). Our real Experience edge — physicians who read the source. |
| **PHARMACOPOEIAS** (Ayurvedic Pharmacopoeia of India / API, its volumes, what a monograph contains, quality standards, WHO/AYUSH context) | No | ✅ Fits catch-all + content JSON, but needs a REFERENCE register | `/pharmacopoeia/` hub. Explains the API, GMP, standardization — the regulatory-trust layer that makes the site authoritative on quality. Pairs with the heavy-metals/quality story already on the skeptic page. |
| **INTERACTIONS** (herb–drug, herb–herb, herb–condition — e.g. ashwagandha × thyroid meds, turmeric × anticoagulants) | No | ⚠️ NEEDS ENGINEERING — a structured dataset + lookup UI, not prose | Highest-value WebMD feature AND highest AEO value (interaction queries almost always trigger AI Overviews). Phase-2 design: a curated `interactions.json` dataset (ingredient × substance × severity × evidence × source) → a filterable checker component + per-pair static pages for SEO. Claims-sensitive → physician + pharmacist review mandatory. Start read-only + honest ("informational, consult your doctor/pharmacist"). |
| **NEWS** (Ayurveda drug news, regulatory updates, research news, general Ayurveda news) | No | ⚠️ NEEDS ENGINEERING — a DATED, refreshing content lifecycle (news ages; monographs are evergreen) | Different model from everything above. Options, cheapest→richest: (a) hand-curated dated posts as content JSON with `datePublished` + `/news/<slug>` (works with current architecture, manual cadence); (b) a lightweight headless CMS (Sanity/Contentful) so non-devs post; (c) a scheduled ingestion pipeline (agent-assisted digest from AYUSH/PIB/PubMed feeds) → drafts for physician review → publish. Recommendation: start (a), graduate to (c). News carries YMYL + misinformation risk → every item physician-checked before publish; NewsArticle schema; clear dateline. |

---

## Proposed full sitemap (v1 shipped ✓ · roadmap ▢)

```
/ (home)                                   ✓
/what-is-ayurveda (pillar)                 ✓
/doshas + /doshas/{vata,pitta,kapha}       ✓
/panchakarma + /the-five-therapies + /what-to-expect   ✓ (clinical)
/herbs (→ becomes /ingredients seed)       ✓ (clinical)
  /herbs/{ashwagandha,triphala,brahmi,turmeric}         ✓
/diet + /diet/eating-by-dosha              ✓
/lifestyle/dinacharya                      ✓
/is-ayurveda-scientific                    ✓ (the trust anchor)
/faq · /about (+editorial policy) · /history-of-ayurveda   ✓

── ROADMAP (build small, grow) ──
/ingredients/ (hub) + /ingredients/<a–z>   ▢  ~50 then A–Z  · evergreen monograph template
/formulations/ (hub) + /formulations/<name> ▢  educational product monographs · → Shopify for purchase
/classical-texts/ (hub) + per-samhita       ▢  Charaka · Sushruta · Ashtanga Hridaya · Bhava Prakasha · Madhava Nidana
/pharmacopoeia/ (hub) + API + standards     ▢  regulatory/quality reference register
/interactions/ (checker + per-pair pages)   ▢  NEEDS DATASET + UI · physician+pharmacist review
/news/ (index + dated posts)                ▢  NEEDS DATED LIFECYCLE · start manual, graduate to feed-assisted
/glossary/ (Sanskrit terms A–Z)             ▢  Banyan two-tier model · supports entity SEO
/therapies/ (abhyanga, shirodhara, …)       ▢  procedure monographs beyond panchakarma
/philosophy/ (Samkhya, Nyaya, Vedanta)      ▢  .org topic seeds · our depth edge
/seasonal/ (ritucharya)                     ▢
```

## Build cadence recommendation

1. **v1 (shipped tonight):** the 20-page seed — pillar + core clusters + the trust anchor. Proves the architecture, earns the first citations, is the credible foundation. Ships as a preview for Abilash + Dr. Deepu John review.
2. **v2 (evergreen scale, no new engineering):** ingredients A–Z, formulations, classical-texts, pharmacopoeia, glossary, therapies, philosophy — all pure content on the existing template. This is where it starts to look like the bible. Physician sign-off batched per cluster.
3. **v3 (new engineering):** the interactions dataset + checker UI, and the news lifecycle. Each is its own scoped build (task-tracked). Both are claims-sensitive and need physician/pharmacist review baked into their pipeline.

## Non-negotiables that scale with it
- Every health/clinical page: Dr. Deepu John medical review before go-live (CLAUDE.md rule 7) — batched per cluster as volume grows.
- Claims law unchanged at any scale: no cure/treat/prevent-disease; honest evidence framing; interactions + news get EXTRA scrutiny.
- Answer-capsule + question-form H2 + MedicalWebPage schema on every page (the AEO engine).
- No fabricated data — ingredient/interaction facts cite real pharmacopoeia/PubMed sources or are left flagged.
