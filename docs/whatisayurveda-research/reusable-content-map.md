# whatisayurveda.com — Reusable-Content Map & Licence-Clear Source Register

**2026-07-15 17:39:40 IST · Research pass, read-only. No writes to any source. No git operations run.**

**What this document is.** A map of (a) EXISTING Kairali-owned material that can seed the content engine, cluster by cluster, with title + repo location; (b) the clinical-lock scrub queue for material that references KTAHV; (c) licence-clear external sources we may cite per cluster, with the licence finding **verified against the primary policy page**, not asserted from memory.

**What this document is NOT.** Not content, not approval to publish, not a licence opinion of record. Every licence call below is a research finding for a human to ratify; anything touching money, medical claims, or legal exposure escalates to Abilash (CLAUDE.md ESCALATION). No facts, counts, IDs, or sources invented (rule 6) — every count is quoted from its source doc and attributed.

**Scope boundary — this doc does NOT duplicate the peer register.** `docs/whatisayurveda-research/teardown-texts-concepts.md` §5 already holds a verified licence register for **classical texts, concepts, and pharmacopoeia**. That register is **authoritative for those clusters** and is cross-referenced, not restated, here (Knowledge Doctrine (b): link to sources, never duplicate). §4 below covers the clusters it does **not**: herbs, conditions, formulations, treatments. Where my independent checks touched the same sources, they **corroborated** it — noted in §4.4.

---

## 1 · The Kairali-owned seed corpus (what we already have)

| # | Source | Location | Size / shape | Register | Value |
|---|---|---|---|---|---|
| S1 | **Healing Secrets of Kairali** — group booklet, "An Introduction to Ayurveda & Our Treatment Programmes" | `docs/ktahv-inputs/healing-secrets-of-kairali.md` | 594 lines; 63× "Ayurveda", 32× "treatment", 8× "patient" | KTAHV booklet (clinical-adjacent) | **The single highest-value seed.** First-party, Kairali-authored, physician-shaped. Covers concepts → therapies → programmes end-to-end. |
| S2 | **whyayurveda.org blog mine** — 2,261 posts + 51 pages + 16 categories | `docs/group-inputs/whyayurveda-blog-inventory.md` | Inventory doc only — **theme counts + ~10 named slugs; NOT the full slug list** (see §2.7 gap) | Group-corporate blog | Volume + topical shape + a named KEEP shortlist. Security-screened CLEAN. |
| S3 | **whatisayurveda.org legacy** one-pager (2014 brochure) | `docs/group-inputs/whatisayurveda-org-inventory.md` | Single `.aspx` page; 98 blog teasers, all links dead | 2014 funnel copy | **Near-zero reuse.** Own inventory verdict: "there is almost nothing to migrate… This is a greenfield build." Yields title corpus + claim patterns to AVOID. |
| S4 | **arogyakendra.com** mined static capture | `content-mined/arogyakendra.com/` (`index.txt`, `default.aspx.txt`, `url-inventory.csv`) | 8 URLs, ~3.9 KB real text; brand-tile + enquiry-form copy | 2014 brand hub | **No usable Ayurveda prose.** Body is a brand/menu list ("Ayurvedic Centre / Ayurveda Spa / Treatment Centers…") + lead forms. Nil for the content engine. |
| S5 | **v1 shipped pages** (the live engine) | `sites/whatisayurveda.com/content/` | 20 JSON pages + `_manifest.json` | Educational/YMYL | The template of record + the existing citation practice (audited in §5.1). |
| S6 | Peer teardowns (concurrent, same dir) | `docs/whatisayurveda-research/teardown-*.md` | 6 docs, ~240 KB | Research | Page-type specs + the texts/concepts licence register. |

> **`content-mined/` verdict:** the directory holds three sites — `arogyakendra.com` (S4), `snehachowdhary.com`, `theblushlounge.com`. Only arogyakendra is Ayurveda-adjacent, and it yields nothing reusable. **`content-mined/` is not a seed source for this site.** (It remains immutable per Doctrine (a) — read-only, never edited.)

---

## 2 · Cluster-by-cluster map: what seeds what

Target clusters per `docs/group-inputs/whatisayurveda-full-sitemap.md` §2.

### 2.1 HERBS (`/herbs/` — v2 60 → v4 700)

| Existing material | Location | Usable as |
|---|---|---|
| 4 shipped herb monographs — ashwagandha, brahmi, triphala, turmeric | `sites/whatisayurveda.com/content/herbs__{ashwagandha,brahmi,triphala,turmeric}.json` | **The template of record.** Ashwagandha already carries NCCIH + LiverTox + the JAMA heavy-metals study — the correct spine to clone. |
| `immunity-boost-ayurvedic-herbs-and-practices-for-strengthening-resilience…` | whyayurveda (blog inventory §6 KEEP #5) | Raw prose for an immunity/rasayana herb set. |
| ~30 single-ingredient posts | whyayurveda (inventory §4 table, count only) | **Thinnest cluster in the blog** — the inventory itself calls it "thin coverage, expansion opportunity". |

> **Finding: the blog does NOT seed the biggest cluster.** ~30 herb posts against a v4 target of ~700 monographs. Herbs must be **authored against primary sources (§4.1), not migrated.** The blog's 2,261 posts are a poor fit for the site's largest surface — this is the single most important expectation to reset.

### 2.2 FORMULATIONS (`/formulations/` — v2 25 → v4 600)

| Existing material | Location | Usable as |
|---|---|---|
| **"Our Product World"** section | `docs/ktahv-inputs/healing-secrets-of-kairali.md` (§ heading L402) | First-party framing of Kairali's own product lines. |
| ~77 products/distribution posts | whyayurveda (inventory §4) | Inventory verdict: **"KAPPL/Shopify's lane, mostly drop."** Commercial register — wrong register for an educational monograph. |
| Kairali product image library (561 images referenced) | `docs/media/kairali-product-images/` (`mapping.csv`, `drive_manifest.csv`) | Imagery for formulation pages. |

> **Blocked:** the formulation cluster needs the **KAPPL catalog**, which is not in this repo. Sitemap Q5 already flags this ("no number invented here"). Nothing to seed from until the catalog lands.

### 2.3 CONCEPTS / PRINCIPLES / DOSHAS (`/doshas/`, `/principles/`, `/glossary/`)

| Existing material | Location | Usable as |
|---|---|---|
| **The Meaning of Ayurveda · Understanding Ayurveda in Brief · The Origin of Ayurveda · The Eight Branches · Diagnosis in Ayurveda · Dosha, Dhatu & Mala · The Tridosha (Vata/Pitta/Kapha) · Prakruti** | `docs/ktahv-inputs/healing-secrets-of-kairali.md` L83–L175 | **Direct seed for `/principles/`, `/doshas/`, `/branches/`, `/diagnostics/`.** First-party prose, already in an educational register, already structured as discrete concepts. |
| `understanding-doshas-a-comprehensive-guide-to-personalized-wellness…` (~2k words) | whyayurveda (inventory §6 KEEP #1) | Dosha pillar prose. **⚠ sampled body carries banned words** — see §3. |
| ~39 dosha/prakriti posts | whyayurveda (inventory §4) | Supporting material. |
| 3 shipped dosha pages | `sites/whatisayurveda.com/content/doshas__{vata,pitta,kapha}.json` | Template of record. |

> **S1 §"The Eight Branches of Ayurveda" (L99) maps 1:1 onto the `/branches/` cluster** (sitemap: 8 pillar pages, v2). Highest seed-to-target fit in the whole map.

### 2.4 TREATMENTS / THERAPIES (`/therapies/` v2 12 → v4 30 · `/panchakarma/` spokes)

**The strongest seed in the corpus.** S1 L186–L258 contains **~35 named therapies with first-party descriptions**, already grouped into the exact families the sitemap wants:

| S1 family (line) | Named therapies | → target |
|---|---|---|
| **Panchakarma — The Five Cleansing Therapies** (L186) | Vamanam, Virechanam, Asthapana/Niruham Vasti, Anuvasana Vasti, Nasyam | `/panchakarma/<karma>` (v2, 5 pages) — **exact match to target count** |
| Whole-Body Oil & Massage (L202) | Abhyangam, Pizhichil, Udwarthanam, Udgharshanam | `/therapies/<name>` |
| Shiro (Head) & Dhara (L209) | Sirodhara, Takradhara, Dhanyamala Dhara, Thalapotichil, Sirovasti, Thalam | `/therapies/<name>` |
| Kizhi (Herbal Poultice) (L218) | Elakizhi, Podikizhi, Manjalkizhi, Narangakizhi, Muttakizhi, Manalkizhi, Kadikizhi, Navarakizhi | `/therapies/<name>` |
| Vasti (Localised Oil-Pooling) (L231) | Kativasti, Greevavasti, Januvasti, Urovasti, Matravasti, Kashayavasti | `/therapies/<name>` |
| Eye, ENT, Oral & Facial (L242) | Netradhara, Netratharpanam, Karnapoornam, Nasyam, Dhoompanam, Kavalagraham & Gandoosham, Mukhalepam, Lepam | `/therapies/<name>` |

Plus from whyayurveda (inventory §6 KEEP): `the-science-of-panchakarma-kairalis-signature-detoxification-approach`, `how-long-does-panchakarma-take…` (high-intent), and ~208 panchakarma/detox/therapy posts (count only).

> **S1's therapy descriptions already use hedged, classical language** — "traditionally used for", "valued for" — not "cures". That is the DMR-safe register the sitemap's D1/D4 demand. **This corpus is closer to publishable than anything else we own.**

### 2.5 CLASSICAL TEXTS (`/classical-texts/` — v2 8 → v4 330)

| Existing material | Location | Usable as |
|---|---|---|
| S1 cites **Charaka Samhita** by name as the locus for Panchakarma (L188) | `docs/ktahv-inputs/healing-secrets-of-kairali.md` | A single first-party citation — **not a seed.** |
| `/history-of-ayurveda` shipped page | `sites/whatisayurveda.com/content/history-of-ayurveda.json` | Touches the texts; sitemap says "promote to dedicated hub". |

> **Effectively no internal seed.** This cluster is authored from primary sources — and is **licence-constrained**, per `teardown-texts-concepts.md` §5: two of four launch texts (Ashtanga Hridaya, Bhavaprakasha) have **no confirmed licence-clear English translation**. That doc's build-order ruling (Charaka + Sushruta first, AH/BP quote-free) governs. **Do not re-litigate it here.**

### 2.6 CONDITIONS (`/conditions-and-ayurveda/` — v3 10 → v4 120, double-gated)

| Existing material | Location | Usable as |
|---|---|---|
| **"Find Your Programme"** + 9 programme groups: Detox/Rejuvenation · Weight/Metabolic/Digestive/Heart · Joints/Spine/Back · Stress/Sleep/Mental Wellness · Neurological/Paralysis Rehab · Skin/Beauty · Respiratory/Sinus/Eye · Women's Health · Specialised & Supportive | `docs/ktahv-inputs/healing-secrets-of-kairali.md` L259–L365 (+ full list L460–L590) | **Maps closely onto the 10 Programme Outcome themes** the sitemap anchors this cluster on. First-party, goal-led (not disease-led) — already the DMR-safer framing. |
| `ayurveda-for-migraine`, `ayurveda-for-hypertension`, `ayurveda-for-better-sleep`, `ayurveda-for-back-pain` | whyayurveda (inventory §6 KEEP #6) | Condition prose, strong search intent. |
| ~373 "treatment-for"/ailment posts | whyayurveda (inventory §4) | Volume. **Highest-risk pool** — inventory flags "can-panchakarma-cure" style posts making health claims. |
| `/medical-disclaimer/` page exists on the blog | whyayurveda (inventory §7.2) | Carry the disclaimer pattern across. |

> **⚠⚠ This cluster carries the double gate** (physician + claims lint). S1 L361 contains an explicitly **negated** claim — *"is not a cure for cancer; it is designed to work alongside the care of your treating medical team"* — which is **exemplary honest drafting** and the model for the register, but it contains the token "cure" and will trip a naive lint. See §3.3.

### 2.7 Gap that blocks per-post mapping

The blog inventory gives **theme counts and ~10 named slugs**. The full 2,261-slug list was written to `/tmp/allposts.txt` — **session scratch, explicitly not committed** (inventory §"Recovery map"). So:

- **Per-post mapping beyond the ~10 named KEEP slugs is not currently possible from the repo.**
- Everything in §2 marked "count only" is quoted from the inventory's theme table, **not** verified post-by-post by me.
- **To do real per-post triage, the slug list must be re-mined and committed.** Recommend `docs/group-inputs/whyayurveda-post-slugs.tsv` (slug · category · lastmod · KTAHV-ref flag · banned-word flag) as a durable artifact. Cheap to regenerate from the Yoast sitemaps; expensive to keep losing.

---

## 3 · CLINICAL-LOCK caveat — the scrub queue (never auto find-replace)

**The lock's actual scope.** CLAUDE.md: the KTAHV language lock applies to **KTAHV pages ONLY** — "This lock does NOT apply to Villa Raag or KAPPL. Do not cross-apply." whatisayurveda.com is **group/educational register**, so banned words are **not per se banned on this site**. The caveat bites in two specific directions:

### 3.1 Direction A — material that references KTAHV
Blog inventory §7.1 (quoted): **843 of 2,261 slugs (37%) reference KTAHV**; **64 slugs combine a KTAHV reference with a banned word**; sampled KTAHV-referencing bodies "use banned words freely" (one dosha post: spa×7, resort×3, luxury×4, journey×5, guest×4). Any of this that lands on, or routes to, a **KTAHV surface** must be scrubbed to the clinical register.

### 3.2 Direction B — the Healing Secrets booklet (S1)
S1 is a **KTAHV-branded booklet**. I scanned it for exact banned tokens:

```
$ grep -oiE "\b(spa|spas|resort|resorts|holiday|holidays|luxury|cure|cures|cured|journey|journeys|guest|guests)\b" \
    docs/ktahv-inputs/healing-secrets-of-kairali.md | sort | uniq -c | sort -rn
   2 cure
   1 spa
   1 journeys
   1 Luxury
```
(control: `\b(ayurveda)\b` → 61 hits, confirming the regex matches.)

| Line | Token | Context | Judgment needed |
|---|---|---|---|
| L361, L564 | **cure** ×2 | *"is not a cure for cancer; it is designed to work alongside the care of your treating medical team"* | **DO NOT STRIP.** A negated cure-disclaimer is the honest, DMR-safe construction. Deleting the word would delete the safety statement. **Dr. Deepu John judgment.** |
| L375 | **Luxury** ×1 | *"multiple-time World Luxury Award winner"* | **Proper noun of a real award.** Same pattern the blog inventory flagged ("World Luxury Spa Award 2012") — factually accurate historical title. Abilash + Dr. Deepu John call. |
| L568 | **journeys** ×1 | *"…taken as standalone wellness journeys"* | Genuine register violation **if** used on a KTAHV page. Rewrite, don't find-replace. |
| L586 | **spa** ×1 | *"designed for spa therapists, wellness practitioners…"* | Describes the **training-course audience**, not a KTAHV service. Likely legitimate. |

> **This is exactly why rule "never auto find-replace" exists.** A blind `s/cure//` on S1 would strip a cancer-safety disclaimer — turning the single most responsible sentence in the corpus into a liability. **4 of 5 hits are defensible; 1 is a real violation.** A human reads all five.

### 3.3 Lint trap to fix before it bites
A naive banned-word lint will flag L361's *"not a cure for cancer"*. The claims lint on `/conditions-and-ayurveda/` (sitemap T1c, "double gate") **must handle negated claims** — or reviewers will be trained to click past the one lint that matters most. Per Doctrine (g), the fix is a smarter lint (negation-aware, or an allowlist with a recorded reason), **never a weakened one**.

### 3.4 Methodology warning for whoever automates this
My first banned-word scan returned **0 hits — a false negative**. The `[[:<:]]`/`[[:>:]]` word-boundary syntax silently fails under the `grep` on this machine (it is `ugrep`); the control word "ayurveda" also returned 0, which is what exposed it. A second attempt (`\bword[a-z]*\b`) **over-matched**, counting "**spa**sm" as "spa". **Any scan script must be validated against a known-present control word before its zero is believed.** A silently-broken banned-word lint reporting "clean" is worse than no lint.

---

## 4 · Licence-clear sources per cluster (verified against primary policy pages)

**GREEN** = may quote/adapt with attribution · **AMBER** = cite/link only · **RED** = do not reproduce.

### 4.1 HERBS

| Source | Licence finding (verified) | Status |
|---|---|---|
| **NCCIH herb pages** (`nccih.nih.gov/health/<herb>`) — ashwagandha, turmeric, valerian, milk thistle, fenugreek, black cohosh, bilberry… | Verified **in situ on the ashwagandha page**: *"This publication is not copyrighted and is in the public domain. Duplication is encouraged."* Section spine (Background / How Much Do We Know? / What Have We Learned? / Safety / Keep In Mind / Key References) is also a usable model. | 🟢 **GREEN** — attribute NCCIH; **non-endorsement clause applies** (per peer §5); images NOT covered |
| **NIH ODS fact sheets** (`ods.od.nih.gov/factsheets/`) | US Gov work; consumer + health-professional registers (the dual-register model the sitemap wants at [P7]). **Per-sheet notice not yet read in situ — verify before quoting.** | 🟡 **AMBER** → GREEN on verification |
| **LiverTox** (NCBI Bookshelf, NIDDK) | Already cited by our shipped ashwagandha page. NCBI Bookshelf items are **individually licensed** — Bookshelf copyright notice must be read per item. | 🟡 **AMBER** — verify per record |
| **PMC Open Access Subset** | Verified at PMC copyright notice: OA subset is *"made available under a Creative Commons or similar license that allows more liberal redistribution and reuse"*; some US-Gov items are PD. **Caveat quoted:** OA/PD articles *"may still contain photographs or illustrations copyrighted by other… individuals."* | 🟢 **GREEN** per-article — check the article's own CC licence (BY vs BY-NC vs BY-SA); **NC and SA variants are RED for us** (see 4.5) |
| **PMC — general collection** | Verified: *"Many articles in PMC are protected by U.S. and/or foreign copyright laws, even though PMC provides free access."* And: *"Systematic downloading of batches of articles from the main PMC web site, in any way, is prohibited."* | 🔴 **RED** for reproduction; 🟢 cite bibliographically. **The no-bulk-download rule binds any scripted ingestion.** |
| **PubMed abstracts** | Verified at NLM: NLM *does not* claim copyright on PubMed abstracts, **but publishers or authors may**; reusers must adhere to the copyright holder's terms. | 🟡 **AMBER** — cite bibliographically (PMID/DOI); **do not reproduce abstract text** |
| **WHO monographs on selected medicinal plants** (Vols 1–4) | **CC BY-NC-SA 3.0 IGO** — non-commercial + share-alike. | 🔴 **RED for us** — see 4.5 |

### 4.2 CONDITIONS
NCCIH condition/therapy pages (🟢 PD, as 4.1) · PMC OA reviews (🟢 per-article) · PubMed (🟡 cite-only). Neutral medical description for the T1c spine's first section should come from a **PD or clearly-licensed** source — NCCIH where it exists. **Do not** source it from Healthline/Britannica (see 5.1).

### 4.3 FORMULATIONS · TREATMENTS
- **Formulations:** governed by the **API** entry in `teardown-texts-concepts.md` §5 — 🟡 AMBER, Government of India copyright to ~2049; **specifications/values are facts and reusable, monograph prose is not.** Blocked on the KAPPL catalog regardless (§2.2).
- **Treatments/therapies:** our **strongest first-party position** — S1 (§2.4) is Kairali's own text, no external licence needed. External corroboration for efficacy claims via NCCIH (🟢) + PMC OA (🟢 per-article). This cluster can move **without** licence risk.

### 4.4 CLASSICAL TEXTS · CONCEPTS · PHARMACOPOEIA
**→ `docs/whatisayurveda-research/teardown-texts-concepts.md` §5 is authoritative.** Do not duplicate.

My independent checks **corroborate it on all four sources I touched**, reached separately:
- Bhishagratna *Sushruta* 1907–16 → PD (archive.org) — **agrees** (🟢).
- Kaviratna *Charaka* 1890–1911 → pre-1929, PD in US — **agrees** (🟢).
- Srikantha Murthy *Ashtanga Hridaya* → modern, Chaukhamba/Motilal, **in print and sold**; archive.org/Scribd copies are unlicensed uploads — **agrees** (🔴). I found **no pre-1929 English AH translation**, which independently supports that doc's "AH must launch quote-free" ruling.
- API → Government of India copyright, Ministry of AYUSH / PCIM&H — **agrees** (🟡).
- Its two named traps — *"Archive.org availability ≠ licence"* and *"CC-NC is a real blocker for us specifically"* — **both reproduced independently in my pass.** Two agents converging separately on these is meaningful corroboration; treat both as settled.

**One addition not in that register:** **TKDL** (Traditional Knowledge Digital Library, AYUSH+CSIR, 270+ texts) is **paid-subscription, phased access** — 🔴 **not licence-clear**, and not a citable public source. Do not plan any cluster around it.

### 4.5 The rule that catches people out: **NC and SA are both fatal for us**

whatisayurveda.com is published by the **Kairali Ayurvedic Group — a commercial entity** — and bridges to KTAHV booking. Therefore:
- **NonCommercial (NC)** material is **off-limits**, however educational our intent. *The site's honesty positioning does not create a licence exemption.* This kills **WHO monographs on medicinal plants** (CC BY-NC-SA 3.0 IGO) and, per the peer register, **WHO ICD-11 TM2** and the **Paradkar** Sanskrit AH edition.
- **ShareAlike (SA)** would **infect our own content** with a copyleft obligation. This kills **Wikipedia (CC BY-SA 4.0)** for text reuse, and the SA half of the WHO licence.
- **Both are always safe to _cite and link_.** Facts are not copyrightable; expression is. The whole corpus can *reference* WHO and Wikipedia freely — it just cannot *reproduce* them.

> **Disclosure note (voice):** the site is a disclosed Kairali property. The NC analysis above **depends on that commercial status being real and disclosed** — which it is, and which is the honest position. It is also precisely why "we're educational, not commercial" is not a licence argument we may make.

---

## 5 · Findings & pushback

### 5.1 ⚠ The shipped v1 pages cite sources the site's own strategy disavows
Audit of `sites/whatisayurveda.com/content/*.json` citation URLs by host:

```
20 nccih.nih.gov        14 pubmed.ncbi.nlm.nih.gov     7 hopkinsmedicine.org
 6 healthline.com        4 who.int                      3 ayush.gov.in
 3 clevelandclinic.org   3 ayurveda.com                 2 britannica.com
 2 ncbi.nlm.nih.gov      1 indiacode.nic.in             1 cdc.gov  …
```
The NCCIH/PubMed backbone is **exactly right**. But:
- **healthline.com ×6** — the full-sitemap teardown's own divergence **D3** cites Healthline's commerce model as *"Wikipedia-blacklisted"* and something we define ourselves against. **Citing it as an authority undercuts the E-E-A-T position that is the site's entire moat.**
- **ayurveda.com ×3** — a commercial Ayurveda school, not a primary source.
- **britannica.com ×2** — tertiary encyclopedia.

**Recommendation:** replace these 11 citations with primary equivalents (NCCIH / PMC OA / PubMed) before the corpus scales — the pattern gets cloned into every future monograph. **Cheap now, 3,400× expensive later.**

### 5.2 ⚠ The classical-corpus census rests on commercial blogs
`whatisayurveda-full-sitemap.md`'s universe census — **[U-C1] ≈1,310 herb pages, [U-C3] ≈330 text pages, [U-C4] ≈60, [U-C5] ≈61** — cites **easyayurveda.com** and **ayurvedahub.in**. These are commercial blogs, not authoritative or licence-clear. The **v4 ≈3,400-page target derives from them.** The counts may well be right, but a five-year plan resting on blog arithmetic should be re-based on the API / AFI / the samhitas themselves before it drives budget. (Consistent with that doc's own honest flag that all counts are planning targets.)

### 5.3 ✅ The seed is better than expected — but not where expected
The **2,261-post blog is a weak seed for this site**: its two biggest clusters are yoga (~452) and press/awards (~189, "DROP"), while the site's biggest target cluster — herbs (700) — has **~30 blog posts**. Meanwhile **S1, a 594-line booklet nobody flagged as a content asset, cleanly seeds four clusters** (concepts, branches, therapies, conditions) in the right register. **Reset: the booklet is the seed; the blog is a cross-link partner.**

### 5.4 Register check — S1 is a KTAHV booklet feeding a group-register site
S1's therapies are described **for KTAHV patients**. On whatisayurveda.com they must be re-registered as **educational/definitional** ("what abhyanga *is*"), not as service descriptions ("what *we* do"), with the KTAHV bridge confined to the standardized `routesTo` block (sitemap linking law #7). **Lift the knowledge, not the sales frame.**

---

## 6 · Open questions → QUESTIONS.md

- **Q-RCM1 (Dr. Deepu John):** S1's four banned-token hits (§3.2) — ruling on each? Specifically: keep *"not a cure for cancer"* verbatim (recommended), and how to treat the "World Luxury Award" proper noun.
- **Q-RCM2 (Abilash):** Re-mine + commit the 2,261-slug list as `docs/group-inputs/whyayurveda-post-slugs.tsv`? Per-post triage is blocked without it (§2.7).
- **Q-RCM3 (Abilash):** Approve replacing the 11 healthline/ayurveda.com/britannica citations in the shipped v1 pages with primary sources (§5.1)?
- **Q-RCM4 (Abilash):** Re-base the [U-C*] census on primary sources before the v4 target drives planning (§5.2)?
- **Q-RCM5 (engineering):** Negation-aware claims lint for the T1c double gate (§3.3) + control-word validation on every banned-word scan (§3.4).
- **Q-RCM6:** Is S1 (Healing Secrets) cleared for reuse as public web content? It is a first-party Kairali booklet, but its **print/Drive provenance is not a publication licence** — confirm intent before it seeds public pages.

---

## Provenance & verification (Doctrine (f) — claim vs machine evidence)

**Verified by machine evidence in this session:**
- S1 heading structure, therapy names, line numbers — `grep -n -E "^#{1,3} "`, `sed -n '186,260p'`.
- S1 banned-token counts (cure 2 · spa 1 · journeys 1 · Luxury 1) — exact-token grep, **validated against a control word** after two failed regex attempts (§3.4).
- v1 citation-host histogram (§5.1) — grep over `sites/whatisayurveda.com/content/*.json`.
- `content-mined/` contents and arogyakendra's nil value — `find` + reading `index.txt`, `url-inventory.csv`.
- NCCIH public-domain wording — **fetched in situ** from `nccih.nih.gov/health/ashwagandha`.
- PMC copyright / OA-subset distinction / systematic-download prohibition — fetched from `pmc.ncbi.nlm.nih.gov/about/copyright/`.
- Peer-register corroboration (§4.4) — read `teardown-texts-concepts.md` §5 directly.

**Explicitly UNVERIFIED (do not treat as fact):**
- **All whyayurveda post counts** (2,261 · 843 · 64 · the §4 theme table) are **quoted from `whyayurveda-blog-inventory.md`, not re-verified by me.** I did not fetch whyayurveda.org.
- **NIH ODS** per-sheet copyright notice — not read in situ (searched only). AMBER pending.
- **LiverTox / NCBI Bookshelf** per-item licences — not read.
- **WHO monographs** licence — from search results + WHO's general copyright page description, **not fetched from a monograph's own licence page.**
- **GODL-India** applies to data.gov.in datasets; whether it covers `ayush.gov.in` **website content** is **unresolved** — the shipped pages already cite ayush.gov.in ×3.
- **Sengupta 1916 AH** language question — left open by the peer register; I did not resolve it.
- No licence call here is legal advice. All are research findings for human ratification.

**Not done (out of scope / by instruction):** no git operations run; no writes to any source; no content authored; no fixes applied (findings-only pass, per the QA-audit convention).
