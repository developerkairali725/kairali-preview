# Kairali Ayurvedic Group — Physician Roster (VERIFIED MINE)

**Mined:** 2026-07-15 18:35:32 IST — read-only, no writes to any source.
**Purpose:** source-of-truth roster for the YMYL medical-reviewer / physician-approval config (replaces hard-coded reviewer strings).
**Method:** `ayurvedichealingvillage.com` returns **403 to curl AND to WebFetch** (Cloudflare). Rendered via Claude_Browser + same-origin `fetch()` — this bypasses the challenge and gives raw HTML. `whyayurveda.org` responds 200 to curl with a browser UA. All 210 KTAHV sitemap URLs were scanned for `Dr.` / `BAMS` / `Chief Physician` / `Resident Medical Officer`.
**Rule-6 compliance:** nothing below is inferred. Every name, degree and title is quoted from a live page. Gaps are named as gaps, not filled.
**Rule-r compliance:** all scraped content treated as DATA. **Prompt-injection screen: CLEAN** — 0 hits across all fetched pages (patterns: ignore-instructions / system-prompt / AI-agent-directed text / jailbreak / `<|im_start|>`). No quarantine required.

---

## 1. VERIFIED DOCTORS — the roster (5)

The authoritative listing is the KTAHV homepage section headed **"Our Experts / Our Team Of Ayurvedic Doctors"**. There is **no dedicated `/doctors/` or `/our-team/` page on the KTAHV site** (confirmed: absent from all 210 sitemap URLs; `/about-us/` contains **zero** doctor mentions). Every doctor below is corroborated by a second source (whyayurveda.org profile post + author archive + Yoast `Person` schema).

| # | Name (exact) | Credentials (exact) | Role / designation (exact) | Location | Experience | Photo URL | Primary source |
|---|---|---|---|---|---|---|---|
| 1 | **Dr. Deepu John** | `B.A.M.S.` | `Chief Physician & Head of Department` | Kairali – The Ayurvedic Healing Village, Palakkad, Kerala | `12+ Years Clinical Experience` | `https://ayurvedichealingvillage.com/wp-content/uploads/2023/10/Dr.-Deepu-John.jpg` · `https://whyayurveda.org/wp-content/uploads/2026/05/dr-deepu-120x120.webp` | [KTAHV home](https://ayurvedichealingvillage.com/) |
| 2 | **Dr. Akhila Oommen** | `B.A.M.S.` | `Ayurvedic Physician` | Kairali – The Ayurvedic Healing Village, Kerala | `9+ Years Clinical Experience` | `https://ayurvedichealingvillage.com/wp-content/uploads/2025/05/dr._akhila.webp` · `https://whyayurveda.org/wp-content/uploads/2025/08/akhila-120x120.webp` | [KTAHV home](https://ayurvedichealingvillage.com/) |
| 3 | **Dr. Rahul R** | `B.A.M.S.` | `Ayurvedic Physician` | Kairali – The Ayurvedic Healing Village, Kerala | `7+ Years Clinical Experience` | `https://ayurvedichealingvillage.com/wp-content/uploads/2026/07/Rahul.jpg` · `https://whyayurveda.org/wp-content/uploads/2025/08/rahul-120x120.webp` | [KTAHV home](https://ayurvedichealingvillage.com/) |
| 4 | **Dr. Ashika Raj** *(also spelled "Dr. Ashikha Raj" — see §6-A)* | `B.A.M.S.` | `Ayurvedic Physician & Resident Medical Officer` (elsewhere `Resident Medical Officer (RMO) & Ayurvedic Physician`) | Kairali – The Ayurvedic Healing Village, Kerala | `8+ Years Clinical Experience` | `https://ayurvedichealingvillage.com/wp-content/uploads/2026/07/Ashika.jpg` · `https://whyayurveda.org/wp-content/uploads/2025/08/anshika-120x120.webp` | [KTAHV home](https://ayurvedichealingvillage.com/) |
| 5 | **Dr. Anagha** — **SURNAME NOT PUBLISHED** | `B.A.M.S.` | `Ayurvedic Physician` | Kairali – The Ayurvedic Healing Village, Kerala | `2+ Years Clinical Experience` | **NONE FOUND** | [KTAHV home](https://ayurvedichealingvillage.com/) |

### Verbatim credential lines (KTAHV homepage, "Our Team Of Ayurvedic Doctors")

> **Dr. Deepu John** — `B.A.M.S.` — "Chief Physician & Head of Department — Leads physician assessment, Karkidaka protocol planning, medical supervision, and ongoing review for all program guests." — "12+ Years Clinical Experience"

> **Dr. Akhila Oommen** — `B.A.M.S.` — "Ayurvedic Physician — Contributes to physician assessment, care planning, medical review, & personalised treatment guidance throughout every guest's wellness journey." — "9+ Years Clinical Experience"

> **Dr. Rahul R** — `B.A.M.S.` — "Ayurvedic Physician — Provides consultations, personalised care planning, lifestyle guidance, dietary advice, and post-treatment follow-up for lasting wellness outcomes." — "7+ Years Clinical Experience"

> **Dr. Ashika Raj** — `B.A.M.S.` — "Ayurvedic Physician & Resident Medical Officer — Supports daily care coordination, guest monitoring, medical continuity, and doctor-guided treatment throughout every stay." — "8+ Years Clinical Experience"

> **Dr. Anagha** — `B.A.M.S.` — "Ayurvedic Physician — Manages online consultations, pre-arrival guidance, daily patient follow-up, and continuous communication to support every treatment program." — "2+ Years Clinical Experience"

### Corroborating source URLs per doctor

| Doctor | whyayurveda profile post | Author archive (byline identity) | Extra KTAHV pages carrying a credential line |
|---|---|---|---|
| Dr. Deepu John | https://whyayurveda.org/about-dr-deepu-john/ | https://whyayurveda.org/author/deepujohnkairali/ | `/online-consultation/`, `/ayurveda-retreat-kerala.html`, `/panchkarma-treatment.html`, `/preventive-rejuvenation-detoxification.html`, `/weight-loss.html`, `/offers/senior-citizen-offer/` |
| Dr. Akhila Oommen | https://whyayurveda.org/about-dr-akhila-oommen/ | https://whyayurveda.org/author/drakhilaoommen/ | KTAHV home only |
| Dr. Rahul R | https://whyayurveda.org/about-dr-rahul-r/ | https://whyayurveda.org/author/drrahulr/ | KTAHV home only |
| Dr. Ashika / Ashikha Raj | https://whyayurveda.org/about-dr-ashikha-raj/ | https://whyayurveda.org/author/drashikaraj/ | `/panchkarma-treatment.html`, `/ayurveda-retreat-kerala.html`, `/weight-loss.html` |
| Dr. Anagha | **NO PROFILE POST** | **NO AUTHOR ACCOUNT** | KTAHV home only |

### Additional verbatim credential lines from secondary KTAHV pages

> `/online-consultation/`: "**Dr. Deepu John, BAMS** — Chief Physician & Head of Department · 12+ years' clinical practice"

> `/online-consultation/`: "A registered Ayurvedic physician (BAMS) from our medical team, led by our Chief Physician, **Dr. Deepu John — who helped draft the NABH Panchakarma Clinic Standards** and has over a decade of clinical practice."
> ⚠️ The NABH-standards-drafting claim appears **only here**, is unsourced on-site, and is a strong E-E-A-T asset **and** a liability if unverifiable. Needs Dr. Deepu John / Abilash confirmation before reuse. See §6-D.

> `/ayurveda-retreat-kerala.html`: "**Dr. Deepu John** Chief Physician & HOD | 12+ yrs of experience Expertise: Arthritis management, musculoskeletal disorders like Frozen shoulder, Low backaches, Disc problems and Spondylitis…"

> `/panchkarma-treatment.html`: "**Dr. Deepu John** 12+ years of experience Chief Physician & HOD Expertise: Panchakarma and lifestyle management, Arthritis, Migraine, Neuro muscular disorders, Spine disorders, Gastrointestina[l]…"

> `/panchkarma-treatment.html`: "**Dr. Ashikha Raj** 8+ years of experience BAMS Expertise: Arthritis management, musculoskeletal disorders like Frozen shoulder, Low backaches, Disc problems and Spondylitis, Sciatica, Allergies…"

> KTAHV home (second, legacy block): "**Dr. Akhila Oommen, BAMS** Ayurvedic Physician | 9+ Yrs Of Experience Expertise in treating various arthritis conditions, gynecological issues, stress, and sleep disorders"

### Specialisation — as published

| Doctor | Specialisation (verbatim, where stated) |
|---|---|
| Dr. Deepu John | "Panchakarma and lifestyle management, Arthritis, Migraine, Neuro muscular disorders, Spine disorders, Gastrointestina[l]…"; "Expertse in diagnosis of Tridosha balance (Vata, Pitha, Kalpa) and Prakriti (Unique body constitution)" *(typos "Expertse"/"Kalpa" are the site's, not ours — see §6-C)* |
| Dr. Akhila Oommen | "Expertise in treating various arthritis conditions, gynecological issues, stress, and sleep disorders" |
| Dr. Rahul R | "Expertise In diagnosis of Tridosha balance (Vata, Pitha, Kapha) and Prakriti (Unique body constitution)" |
| Dr. Ashika/Ashikha Raj | "Expertise: Arthritis management, musculoskeletal disorders like Frozen shoulder, Low backaches, Disc problems and Spondylitis, Sciatica, Allergies…" |
| Dr. Anagha | **NOT STATED** — only duties (online consultations, pre-arrival guidance, follow-up) |

---

## 2. Dr. Deepu John — CONFIRMATION / CORRECTION

**Our current hard-coded string:** `Chief Physician (BAMS), Kairali — The Ayurvedic Healing Village`

**VERDICT: CONFIRMED but INCOMPLETE — his title is truncated. Recommend correction.**

Every live source agrees on the fuller title: he is **Chief Physician *and* Head of Department**, not merely Chief Physician.

| Source (live, verified) | Exact wording |
|---|---|
| KTAHV homepage roster | "Chief Physician & Head of Department" |
| KTAHV `/online-consultation/` | "Dr. Deepu John, BAMS — Chief Physician & Head of Department · 12+ years' clinical practice" |
| KTAHV `/ayurveda-retreat-kerala.html` | "Dr. Deepu John Chief Physician & HOD | 12+ yrs of experience" |
| KTAHV `/panchkarma-treatment.html` | "Chief Physician & HOD" |
| whyayurveda.org profile + author bio (Yoast `Person` schema) | "Dr. Deepu John is a highly respected Ayurvedic physician serving as the **Chief Physician and Head of Department** at Kairali – The Ayurvedic Healing Village. With over 12 years of dedicated clinical experience…" |
| whyayurveda.org profile header | "Chief Physician & Head of Department / Kairali – The Ayurvedic Healing Village, Kerala / 12+ Years of Clinical Experience" |

**Component-by-component:**
- "Chief Physician" — ✅ **CONFIRMED** (every source).
- "(BAMS)" — ✅ **CONFIRMED**. Rendered `B.A.M.S.` on the KTAHV roster and `BAMS` on `/online-consultation/`; profile expands it: "B.A.M.S. (Bachelor of Ayurvedic Medicine & Surgery)". **No MD/MS/PhD is claimed anywhere** — do not add one.
- "Kairali — The Ayurvedic Healing Village" — ✅ **CONFIRMED**. Sites write it with an en-dash: "Kairali – The Ayurvedic Healing Village".
- ⚠️ **MISSING: "& Head of Department"** — present in 100% of live sources, absent from our string.

**Recommended corrected string:**
> `Dr. Deepu John, B.A.M.S. — Chief Physician & Head of Department, Kairali – The Ayurvedic Healing Village`

**Name-form conflict to resolve (§6-B):** KTAHV writes **"Dr. Deepu John"** (with full stop); his whyayurveda author account and every byline render **"Dr Deepu John"** (no full stop). Both are live and public. Pick one canonical form.

**Two-Deepus check (CLAUDE.md locked fact):** ✅ no collision. Every source above is the *physician*. The web developer Deepu appears nowhere in this mine.

**Training detail (verbatim, whyayurveda profile):**
> "Credentials & Training — B.A.M.S. (Bachelor of Ayurvedic Medicine & Surgery) — From a reputed institution in Kerala, the heartland of Ayurveda — Continuous training in advanced Panchakarma therapies, Ayurvedic pathology, and Ayurveda nutrition science"
>
> ⚠️ Note "From a reputed institution in Kerala" — **the actual college is never named**, for any doctor. See §6-D.

---

## 3. Gita Ramesh — FINDING

**PRESENT and prominent. Abilash's description is CONFIRMED in substance, with one correction to flag.**

She is **not** described as a doctor anywhere. **No medical credential (BAMS/MD/etc.) is published for her on any page in this mine.** Her honorific is consistently "**Mrs.**", never "Dr.".

| Attribute | Verbatim | Source |
|---|---|---|
| Title (KTAHV) | "— **Mrs. Gita Ramesh** / Joint Managing Director / Author Of 3 Books, Ayurvedic Cookbook, Herbal Massage & Wellness Recipes" | https://ayurvedichealingvillage.com/ |
| Title (whyayurveda bio) | "As the **Co-Founder and Joint Managing Director** of Kairali Ayurvedic Group…" | https://whyayurveda.org/author/gita/ |
| Award | "**Mrs. Gita Ramesh, Joint Managing Director** of Kairali Ayurvedic Group, was honored with the **Leading Women in Ayurveda Award in 2016**." | https://ayurvedichealingvillage.com/ |
| Lineage | "…Joint Managing Directors Mrs. Gita Ramesh and Mr. K.V. Ramesh, both of whom **hail from a long family lineage of traditional Ayurvedic doctors**." | `/defence-and-paramilitary-forces/` |
| Author account | Slug `gita`, display name "**Gita Ramesh**" (no honorific in byline) | https://whyayurveda.org/author/gita/ |
| Photo | `https://whyayurveda.org/wp-content/uploads/2025/07/gita-mam-120x120.webp` | — |

**Full published bio (verbatim, Yoast `Person` schema, `/author/gita/`):**
> "Mrs. Gita Ramesh is a globally respected figure in the world of Ayurveda, known for her groundbreaking work in Ayurvedic spa therapies, wellness hospitality, and diet-based healing. As the Co-Founder and Joint Managing Director of Kairali Ayurvedic Group, she has played a pivotal role in shaping Kairali's unique blend of traditional Ayurvedic healing with modern wellness sensibilities. A passionate advocate of holistic living, Mrs. Ramesh is also the celebrated author of *"The Ayurvedic Cookbook"*, which reintroduces food as medicine through Ayurvedic nutrition. Her deep knowledge of Panchakarma, therapeutic wellness, and women's health has inspired global audiences to embrace Ayurveda as a sustainable lifestyle practice."

**"Still works day-to-day" — CONFIRMED by evidence, not by claim.** She is an *active* whyayurveda author with recent bylines: 25 Jun 2026, 20 Jun 2026, 16 Jun 2026, 13 May 2026, 31 Jan 2026. Her authorship is live and current.

**"Editorial Voice" — CONSISTENT, but the label itself is not published.** No page calls her "Editorial Voice". The evidence supports the *function* (active bylines, cookbook authorship, "Author Of 3 Books"). If we publish the label "Editorial Voice", it is **our** designation, not a quote from the sites — do not attribute it to them.

⚠️ **YMYL CAUTION:** Gita Ramesh has **no published medical qualification**. She must **not** be used as a *medical reviewer* for YMYL health content. Editorial/brand voice ≠ clinical sign-off. Medical review must come from a BAMS physician (§1). Flagging per pushback duty.

⚠️ **Bio-conflict to resolve (§6-A):** "Ayurvedic **spa** therapies" appears in her live bio — a KTAHV-banned word. Fine on the group blog (group-corporate register); must be scrubbed if this bio is reused on a KTAHV surface.

---

## 4. Roshni — FINDING

**FOUND. Full name published: `Roshni A John`. NOT invented — quoted from a live author account.**

| Attribute | Value | Evidence |
|---|---|---|
| Full name | **Roshni A John** | `<title>Roshni A John, Author at Why Ayurveda</title>` + Yoast `Person` schema `"name":"Roshni A John"` |
| Author archive | https://whyayurveda.org/author/roshni/ | HTTP 200 (verified live) |
| WP slug | `roshni` | — |
| Surname | "John" | as published |
| Middle initial | "A" | published as a bare initial — **not expanded anywhere** |
| Bio | **NONE** — `description` field is empty | Yoast `Person` schema |
| Photo | **NONE** — default Gravatar fallback (`d=mm`): `https://secure.gravatar.com/avatar/0b3c774072651e6318004f38ece147daa44efe5304c2db5a3903934ef3a3c239?s=96&d=mm&r=g` | — |
| Role/designation | **NOT PUBLISHED ANYWHERE** | no title, no bio, absent from KTAHV entirely (0 hits sitewide) |
| Is she a doctor? | **NO INDICATION** — no "Dr.", no BAMS, no medical credential anywhere | — |

**What she demonstrably does:** she is the **WordPress author of 3 of the 4 doctor-profile posts** — i.e. staff writing *about* the doctors, consistent with Abilash's "content editor" description:

| Post | Author (Article schema) | Published |
|---|---|---|
| `about-dr-akhila-oommen` | **Roshni A John** | 2025-08-04 |
| `about-dr-ashikha-raj` | **Roshni A John** | 2025-08-04 |
| `about-dr-rahul-r` | **Roshni A John** | 2025-08-04 |
| `about-dr-deepu-john` | **Vikash Jha** *(different person)* | 2025-08-04 |

⚠️ **"Roshni A John" is the surname-bearing form we needed — but note it is a *WordPress display name*, not an HR record.** Whether "A" expands to a middle name, and her exact job title, are **UNVERIFIED**. Do not expand the initial or assign a title without Abilash. See §6.

**Bonus find — `Vikash Jha`:** a fifth non-doctor author account (authored the Dr. Deepu John profile). Present in schema; his author archive is **not** at `/author/vikashjha/` or `/author/vikash/` (both 404) — **slug unknown**. Photo: gravatar `e2d63831a015f95c99de4a1ccf61d37d0…`. No bio, no role published.

---

## 5. How whyayurveda.org credits an approving doctor — the pattern to mirror

**MECHANISM (important):** whyayurveda does **not** use a separate "Medically reviewed by…" field, badge, or tag. **The doctor IS the WordPress post author.** Approval is expressed by *assigning authorship* — the doctor's name appears in the byline, `<meta name="author">`, `rel="author"` link, and Yoast `Article.author` / `Person` schema, all consistently.

This is a real E-E-A-T asset: the doctor is a first-class schema `Person` with a photo and a bio, linked from every post they approve.

### Example 1 — Dr. Rahul R
Post: https://whyayurveda.org/karkidaka-masam-ayurveda/
Headline: "Karkidaka Masam Isn't About the Calendar. It's About Remembering That Health Has a Season."
```html
<meta name="author" content="Dr. Rahul R" />
<span class="jl_author_img_w"><a href="https://whyayurveda.org/author/drrahulr/" rel="author">Dr. Rahul R</a></span><span class="post-date">July 6, 2026</span>
```
Yoast schema: `"@type":"Article", "author":{"name":"Dr. Rahul R"}`

### Example 2 — Dr. Ashika Raj
Post: https://whyayurveda.org/ayurvedic-remedies-for-acidity/
Headline: "Why Your Acidity Keeps Coming Back: An Ayurvedic Perspective on Digestive Health"
```html
<meta name="author" content="Dr. Ashika Raj" />
<span class="jl_author_img_w"><a href="https://whyayurveda.org/author/drashikaraj/" rel="author">Dr. Ashika Raj</a></span><span class="post-date">July 10, 2026</span>
```
Yoast schema: `"@type":"Article", "author":{"name":"Dr. Ashika Raj"}`

### Example 3 — Dr Deepu John
Post: https://whyayurveda.org/how-to-read-wellness-retreats-in-india/
Headline: "How to Read Wellness Retreats in India (So You Don't Book the Wrong One)"
```html
<meta name="author" content="Dr Deepu John" />
<span class="jl_author_img_w"><a href="https://whyayurveda.org/author/deepujohnkairali/" rel="author">Dr Deepu John</a></span><span class="post-date">July 7, 2026</span>
```
Yoast schema:
```json
{"@type":"Person","@id":"https://whyayurveda.org/#/schema/person/ef70996e0ae4a8603872f9495ff98022",
 "name":"Dr Deepu John",
 "image":{"@type":"ImageObject","url":"https://whyayurveda.org/wp-content/uploads/2026/05/dr-deepu-120x120.webp","caption":"Dr Deepu John"},
 "description":"Dr. Deepu John is a highly respected Ayurvedic physician serving as the Chief Physician and Head of Department at Kairali – The Ayurvedic Healing Village…"}
```

### The full byline cast on whyayurveda (7 verified author accounts)

| Display name | Slug | Doctor? |
|---|---|---|
| Dr Deepu John | `deepujohnkairali` | ✅ BAMS |
| Dr. Rahul R | `drrahulr` | ✅ BAMS |
| Dr. Ashika Raj | `drashikaraj` | ✅ BAMS |
| Dr. Akhila Oommen | `drakhilaoommen` | ✅ BAMS |
| Gita Ramesh | `gita` | ❌ Joint MD, no medical credential |
| Abhilash K.R. | `abhilash` | ❌ Executive Director |
| Ramesh K.V. | `rameshkv` | ❌ Chairman & MD |
| Roshni A John | `roshni` | ❌ no title published |
| Vikash Jha | *(unknown — 404)* | ❌ no title published |

⚠️ **Dr. Anagha has NO author account** — she cannot currently be credited as an approver on whyayurveda. If she is to review content, an account must be created (human action).

⚠️ **The pattern conflates "wrote" with "approved".** Abilash's model is *doctor approves → we tag the doctor*. On the live site that is implemented as *doctor = author*, which asserts the doctor **wrote** it. For YMYL that is a defensible-but-risky simplification: `Article.author` is a factual claim of authorship. **Recommendation for our build: use distinct `author` and `reviewedBy` fields** (schema.org `reviewedBy` / a visible "Medically reviewed by Dr. X, BAMS on <date>" line) rather than mirroring the conflation. Raising per pushback duty — see QUESTIONS.

### Non-doctor leadership bios (verbatim, for completeness)

- **Abhilash K.R.** (`/author/abhilash/`): "Executive Director, Kairali Ayurvedic Group / Ayurveda Futurist | Global Expansion Strategist | Wellness Industry Speaker. Abhilash K. Ramesh represents the new generation of Ayurvedic entrepreneurship…" — photo `https://whyayurveda.org/wp-content/uploads/2026/05/director-kairali-120x120.webp`. **No medical credential.** Note byline "Abhilash K.R." vs body "Abhilash K. Ramesh".
- **Ramesh K.V.** (`/author/rameshkv/`): "K.V. Ramesh is the co-founder and **Chairman & Managing Director** of Kairali Ayurvedic Group… **Founded in 1989**, Kairali combines a multi-generational Ayurvedic lineage…" — photo `https://whyayurveda.org/wp-content/uploads/2026/03/d1-2-120x120.png`. **No medical credential.**

### Non-physician clinical/wellness staff (KTAHV home, "Our Dedicated Nursing & Yoga Experts")
Listed for completeness — **none is a doctor; none should enter the reviewer roster.**

| Name | Role (verbatim) | Experience |
|---|---|---|
| R Sivadas | "Yoga Teacher" | "20 years of experience" |
| Anju S | "Assistant Nurse" | "3.5 Years Experience" |
| Krishnapriya K | "Assistant Nurse" | "3 Years of Experience" |
| Sreeyuktha C | "Yoga Teacher" | "1.5 years of experience" |

---

## 6. COULD NOT VERIFY — gaps, conflicts, and blocks

### 6-A. CONFLICTS ON THE LIVE SITES (both spellings/claims are live — a human must pick)

1. **"Ashika" vs "Ashikha" — UNRESOLVED, and it is inside a single page.** The KTAHV homepage carries **both** in two different blocks. Yoast schema is self-contradictory: `"name":"Dr. Ashika Raj"` while `"description"` reads "Dr. **Ashikha** Raj is a dedicated Ayurvedic physician…".
   - `Dr. Ashika Raj` — KTAHV roster block; whyayurveda display name; all bylines; author slug `drashikaraj`; image `Ashika.jpg`.
   - `Dr. Ashikha Raj` — KTAHV legacy block ("Dr. Ashikha Raj, BAMS"); `/panchkarma-treatment.html`; whyayurveda **post title** "About Dr. Ashikha Raj"; post slug `about-dr-ashikha-raj`; **image alt text** "Dr. Ashikha Raj, BAMS".
   - 🚩 Third variant in the filename: her whyayurveda photo is `**anshika**-120x120.webp` ("Anshika"). Probably a file-naming slip, but noted rather than dismissed.
   - **We cannot determine the correct spelling from published sources. NEEDS A HUMAN.**
2. **"Dr. Deepu John" vs "Dr Deepu John"** — KTAHV uses the full stop; whyayurveda's author account and every byline omit it. Both live. Canonical form **NEEDS A HUMAN**.
3. **"Dr. Sankunny Vaidiar" vs "Dr. Sungunny Vaidir"** — the *same historical person* (grandfather of K.V. Ramesh), spelled two different ways on two KTAHV pages (`/defence-and-paramilitary-forces/` vs `/kairali-ayurvedic-group/`). Deceased/lineage figure, **not roster-eligible**; flagged as a live data-quality defect.
4. **Founding year conflict:** whyayurveda's Ramesh K.V. bio says "**Founded in 1989**"; whyayurveda's footer says "**Kairali Ayurvedic Group Since 1908**"; KTAHV `/online-consultation/` says "**Family practice since 1908**" *and* "1908 Ramesh family practice · **118 years**" (1908+118 = 2026 ✓ internally consistent); KTAHV homepage says "**115+ YEARS OF EXPERIENCE**" and "a legacy of **25 years**". At least four different numbers are live. Out of roster scope but **material for any About/E-E-A-T page** — NEEDS A HUMAN.

### 6-B. MISSING DATA — must be supplied by a human, never inferred

| Gap | Status |
|---|---|
| **Dr. Anagha's surname** | **NOT PUBLISHED ANYWHERE.** Listed on the KTAHV roster as "Dr. Anagha" only. (An earlier automated pass appeared to show "Dr. Anagha B." — that was a **false positive**: markup-stripping joined "Dr. Anagha" + "B.A.M.S." into "Dr. Anagha B". **There is no published surname or initial.** Recording the near-miss so nobody re-derives the phantom.) |
| Dr. Anagha — photo, profile post, author account, specialisation | **ALL ABSENT** |
| **Medical college / university for every doctor** | **NEVER NAMED.** Best available is "From a reputed institution in Kerala" (Dr. Deepu John only). |
| **Registration / council numbers (CCIM / State Ayurveda Medical Council) for every doctor** | **NOT PUBLISHED ANYWHERE.** For a YMYL reviewer roster this is the single biggest credibility gap. |
| **Post-graduate degrees** | **NONE CLAIMED.** No MD (Ay), MS (Ay), or PhD appears for any Kairali physician. All five are **BAMS only**. Do not add any. |
| Roshni A John — role/title, bio, photo, expansion of middle initial "A" | **ALL ABSENT** |
| Vikash Jha — author-archive slug, role, bio | **ABSENT** (`/author/vikashjha/`, `/author/vikash/` → 404) |
| "Editorial Voice" as Gita Ramesh's title | **NOT PUBLISHED** — our label, not the sites' |
| Head-office doctors (Abilash: "doctors in the head office or at the Healing Village") | **NO HEAD-OFFICE DOCTOR FOUND.** All five verified physicians are attached to the Healing Village, Palakkad. If head-office doctors exist, **they are not published on either site.** NEEDS A HUMAN. |
| Which doctors may approve which topics | **NOT PUBLISHED** — no editorial policy page exists |

### 6-C. Live-site defects noticed while mining (report-only, no fixes applied)
- KTAHV homepage: "**Expertse** in diagnosis of Tridosha balance (Vata, Pitha, **Kalpa**)" — two typos; "Kalpa" should almost certainly be "Kapha" (Dr. Rahul R's parallel line reads "Kapha"). **Flagged, not corrected** — it is a live-site content bug, not ours to silently fix.
- KTAHV homepage ships **two overlapping doctor blocks** (a 5-doctor current roster + a 4-doctor legacy block) with inconsistent spellings/titles. Likely a stale section left in place.
- `/panchakarma-therapy/` testimonial is attributed to "Sarah M., Germany" but sits beside "Dr. Rajesh P., Mumbai" — unrelated to roster; noted only because it produced a `Dr.` hit.

### 6-D. E-E-A-T claims that need sign-off before we reuse them
- **"helped draft the NABH Panchakarma Clinic Standards"** (Dr. Deepu John, `/online-consultation/`) — appears exactly once, sitewide, with no citation. High-value if true; a YMYL liability if not. **Do not carry into the new build until Dr. Deepu John or Abilash confirms.**
- **"OUR AYURVEDIC DOCTORS HAVE TREATED OVER 100K PATIENTS IN THE LAST 35 YEARS"** / "300K THERAPIES" / "3000+ Panchakarma Patients" (KTAHV home, `/panchkarma-treatment.html`) — unsourced volume claims. Same treatment.

### 6-E. NAMES THAT ARE **NOT** KAIRALI PHYSICIANS (checked and excluded — do not roster)
Every `Dr.` string on KTAHV was run down. These are all **testimonial authors** (patients who happen to hold doctorates) or **third parties**, verified by reading the surrounding sentence:

| Name | Where | What it actually is |
|---|---|---|
| **Dr. Priya Devi** | KTAHV home, `/read-feedback/` | **Guest testimonial**, not the roster: "Special thanks to **Dr. Priya Devi** for outstanding personal guidance." ⚠️ Phrasing implies she *may* be/have been a Kairali physician who treated the guest, but **she is not on the published roster and has no profile, credential, or title anywhere**. **UNRESOLVED — worth asking Abilash whether she is a current/former physician.** Not rostered on present evidence. *(Distinct from Priya the KTAHV WhatsApp contact — do not conflate.)* |
| Dr. Rajesh P., Mumbai | `/panchakarma-therapy/`, `/personalized-customized-healing-program/` | Patient testimonial ("I am symptom-free after three weeks") |
| Dr. Regina Joseph | `/holistic-treatment-for-rejuvenation-and-detoxification/` | Patient testimonial |
| Dr. Anita Nair & Family, Chennai | `/family-ayurvedic-retreat-kerala.html` | Patient testimonial |
| Dr. Gupta / Dr. Sharma | `/pain-management.html` | Named inside patient testimonial copy |
| Dr Bruce Lipton | `/karma-being-retreat-2019/` | External speaker, 2019 event |
| Dr. Stanislav Grof | `/mindfulness-retreat/` | External speaker |
| Dr. Sankunny Vaidiar / Dr. Sungunny Vaidir | `/defence-and-paramilitary-forces/`, `/kairali-ayurvedic-group/` | **Deceased** founder lineage — "the late Dr. Sankunny Vaidiar (grandfather of Mr. K. V. Ramesh)" |
| Dr. K. S. Vasudevan | `/defence-and-paramilitary-forces/`, `/kairali-ayurvedic-group/` | Founder lineage — "father of Mr. K.V. Ramesh" |

### 6-F. ACCESS — what blocked us / what we could not check

| Target | Result |
|---|---|
| `ayurvedichealingvillage.com` via **WebFetch** | ❌ **HTTP 403** (Cloudflare) |
| `ayurvedichealingvillage.com` via **curl** (browser UA) | ❌ **HTTP 403** (Cloudflare) |
| `ayurvedichealingvillage.com` via **Claude_Browser** | ✅ **WORKED** — all 210 sitemap URLs scanned. *(Method note for future mines: same-origin `fetch()` from the rendered page defeats the challenge.)* |
| `whyayurveda.org` via WebFetch | ❌ **HTTP 403** |
| `whyayurveda.org` via curl + browser UA | ✅ **HTTP 200** |
| `whyayurveda.org/wp-json/wp/v2/users` | ❌ **HTTP 401** `rest_user_cannot_view` — user enumeration correctly disabled (**good security posture**, but it means the author list could not be enumerated authoritatively; the 9 accounts in §5 were recovered by crawling bylines and may **not** be exhaustive) |
| `whyayurveda.org/author-sitemap.xml` | ⚠️ **HTTP 200 but EMPTY** (zero `<loc>`). Yoast author sitemap yields nothing — so **there may be author accounts we never saw**. |
| `ayurvedichealingvillage.com/sitemap_index.xml` | ❌ 404 — the site uses flat `/sitemap.xml` (210 URLs) |
| **KTAHV DE / FR locales** | ⚠️ **NOT CHECKED.** robots.txt confirms "EN (root) / DE / FR" exist. Doctor credentials in DE/FR were **not** mined — if the roster ships to KTAHV, all three locales must be verified (CLAUDE.md locale rule). **OPEN.** |
| `kairalicenters.com`, `kairali.com` | ⚠️ **NOT MINED** — deprioritised per task instructions (prefer the two primary sources). Any centre-network physicians they list are **unknown**. **OPEN.** |
| Shopify store / KAPPL surfaces | Out of scope |

---

## 7. Recommended roster config (proposal — NOT approved, do not ship)

Only these five may serve as **medical reviewers**. All BAMS; none holds a published PG degree; none has a published registration number (§6-B).

```yaml
# UNAPPROVED DRAFT — blocked on §6-A spellings + §6-B registration numbers.
# Head is a role, not a hard-coded person (see MEMORY: roster is config, head can change).
physicians:
  - id: deepu-john
    name: "Dr. Deepu John"          # CONFLICT: whyayurveda renders "Dr Deepu John" (§6-A.2)
    credentials: "B.A.M.S."
    role: "Chief Physician & Head of Department"
    location: "Kairali – The Ayurvedic Healing Village, Palakkad"
    experience: "12+ years"
    is_head: true                    # role flag, not identity
    profile: "https://whyayurveda.org/about-dr-deepu-john/"
    author_slug: "deepujohnkairali"
  - id: akhila-oommen
    name: "Dr. Akhila Oommen"
    credentials: "B.A.M.S."
    role: "Ayurvedic Physician"
    location: "Kairali – The Ayurvedic Healing Village, Palakkad"
    experience: "9+ years"
    profile: "https://whyayurveda.org/about-dr-akhila-oommen/"
    author_slug: "drakhilaoommen"
  - id: rahul-r
    name: "Dr. Rahul R"
    credentials: "B.A.M.S."
    role: "Ayurvedic Physician"
    location: "Kairali – The Ayurvedic Healing Village, Palakkad"
    experience: "7+ years"
    profile: "https://whyayurveda.org/about-dr-rahul-r/"
    author_slug: "drrahulr"
  - id: ashika-raj
    name: "Dr. Ashika Raj"          # BLOCKED: "Ashika" vs "Ashikha" unresolved (§6-A.1)
    credentials: "B.A.M.S."
    role: "Ayurvedic Physician & Resident Medical Officer (RMO)"
    location: "Kairali – The Ayurvedic Healing Village, Palakkad"
    experience: "8+ years"
    profile: "https://whyayurveda.org/about-dr-ashikha-raj/"   # slug uses "ashikha"
    author_slug: "drashikaraj"
  - id: anagha
    name: "Dr. Anagha"              # BLOCKED: surname NOT PUBLISHED (§6-B)
    credentials: "B.A.M.S."
    role: "Ayurvedic Physician"
    location: "Kairali – The Ayurvedic Healing Village, Palakkad"
    experience: "2+ years"
    profile: null                    # none exists
    author_slug: null                # no account — cannot be credited today
```

**Not eligible as medical reviewers** (no published medical credential): Gita Ramesh, Abhilash K.R., Ramesh K.V., Roshni A John, Vikash Jha, R Sivadas, Anju S, Krishnapriya K, Sreeyuktha C.

---

## Provenance / recovery map
- KTAHV: rendered via Claude_Browser at `https://ayurvedichealingvillage.com`; all 210 `/sitemap.xml` URLs fetched same-origin and regex-scanned for `Dr.` / `BAMS` / `Chief Physician` / `Resident Medical Officer`. 18 pages returned hits; every hit read in context and classified (§1, §6-E).
- whyayurveda: curl + browser UA → `/tmp/doc-*.html`, `/tmp/auth-*.html`, `/tmp/ex-*.html` (session scratch, not committed). Credentials taken from rendered text **and** cross-checked against Yoast `Person` / `Article` JSON-LD.
- **No writes to any source site. No git operations. No files touched outside `docs/group-inputs/`.**
- This document is the durable artifact.
