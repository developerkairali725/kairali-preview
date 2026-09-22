# AHV FAQ content pass — 2026-09-23

**Author:** Content + GEO Writer sub-agent, session 2026-09-22 (dated 23 Sep to match the sibling docs' review-slot naming; the brainstorm doc itself notes the same convention for its own filename).
**Scope:** Part A — apply the F1–F38 proofread findings from `docs/research/2026-09-23-ahv-search-brainstorm.md` §5.4 to the 44 as-served FAQ Q&A (`docs/content/ahv-faq-as-served-2026-09-23.md`). Part B — draft the 25 missing questions from §5.3.
**Approval on record:** D-20260922-36 (owner approved both §5.3 and §5.4, 2026-09-23) — this pass applies the suggested fixes and drafts the additions as directed.
**Output:** `sites/ayurvedichealingvillage.com/english-candidate/faq-content-2026.json` (machine-readable edits + additions). This file is the human summary.
**Register lock:** KTAHV clinical register throughout — patient / physician / treatment / programme / Panchakarma / admission / discharge / consultation; "our physicians" and "the patient care team" are the only two people-names used.
**Facts:** drawn ONLY from the three designated scratchpad sources (rates reckoner + physician roster; programme/attraction/villa/accreditation/about-us/online-consultation datasets; policy/travel/article records) plus the pre-existing FAQ text itself where a finding did not require replacing a fact. Nothing invented (HARD GATE 6); every gap is flagged, not filled.

---

## 1. Part A — what happened to each finding

| # | Disposition | What was done |
|---|---|---|
| F1 | **applied** | Topic "Why Choose Kairali?" (Q1–Q7) fully rewritten with no competitor names and no comparative claims (HARD GATE 13). Rebuilt from confirmed facts only: NABH accreditation, ISO/Green Leaf certification, four-generation family lineage (confirmed in about-us-data.js, K.V. Ramesh bio), BAMS physician-led care, villa range, programme duration range. The original's "designed by Laurie Baker" claim was **dropped** — not found in any source, so not carried forward. |
| F2 | applied | Q1 summary reworded to "What makes Kairali different from other Ayurvedic hospitals and centres?" (plain, non-comparative). |
| F3 | applied | Covered by the F1 rewrite (Q3 replaced; "spa"/"luxury" language and the unverified "on-site herbal preparation" claim removed). |
| F4 | applied | Covered by the F1 rewrite (competitor name removed). |
| F5 | applied | Covered by the F1 rewrite ("international luxury wellness brands" phrasing removed). |
| F6 | applied | Q4: "Guests stay, eat, heal, and recover" → patient register, no competitor. |
| F7 | applied | Q5: "shorter wellness getaways" replaced; duration range aligned to the dataset (3–21 nights). |
| F8 | **applied-flagged** | Q8: "5,000-year-old" replaced with the task's advisory phrasing ("texts date back over two thousand years"). Flagged for Dr. Deepu John / owner final sign-off — the dating claim is contested and not independently sourced in the three fact files. |
| F9 | applied-flagged | Q9: list markup added, "wellness consultants" → "our physicians". Flagged: whether the live FAQ view actually renders `<ul><li>` is UNVERIFIED per the brainstorm — confirm in the build PR before shipping. |
| F10 | applied | Q11: unverifiable blog link replaced with the confirmed `/knowledge-centre/` route. |
| F11 | **applied-flagged, signoff: Dr. Deepu John** | Q13: every programme duration restated to the dataset/reckoner minimum-nights figures (the original day-ranges did not match — e.g. Panchakarma is 14 nights minimum, not "7-21"; "Women's Wellness" actually spans two programmes at 14 and 21 nights). Medicines/inclusions line aligned to the reckoner ("charged as needed"). |
| F12 | **applied-flagged, signoff: Dr. Deepu John** | Q14: restated using the dataset's actual minimum-night tiers (3/7/14/21); the original's "21 days for comprehensive Panchakarma" was wrong (Panchakarma's minimum is 14 nights). |
| F13 | applied | Q15: "guests" → "patients"; "our medical team" → "our physicians". |
| F14 | applied | Q16: "Royal Villa: Luxury accommodations..." → "larger villas with additional space and amenities". |
| F15 | applied-flagged | Q16: Maharaja Suite restated using confirmed facts (two rooms, one king-size bed, private lawn) instead of "Premium villas". Flagged: "Vastu" (used here, matches our-villas-data.js) vs "Vaastu Shastra" (about-us-data.js) — spelling still unresolved sitewide; pick one. |
| F16 | applied-flagged | Q18: "Access to all retreat facilities" → "the hospital's facilities"; cultural activities/cooking demos restated as weekly per the reckoner's inclusions. Flagged to confirm exact cadence with the programmes team. |
| F17 | applied-flagged | Q19: phone number was already in the locked format (+91 9555 156 156, no change needed); team-naming fixed; added a nod to the rate chart. Flagged: confirm where the public rate chart actually lives before this ships — the reckoner itself is an internal source, not a public page. |
| F18 | applied | Q22: "healing journey" → "your treatment". |
| F19 | applied | Q22: "alcohol and Caffeine-free" → "alcohol-free and caffeine-free"; "Our retreat" also fixed to "The campus" (register lock, not explicitly named in F19 but required). |
| F20 | **kept-flagged** | Q23: left unchanged (distances/times plausible and internally consistent with the reckoner's Cochin/Calicut row). Flagged to confirm exact drive times with the travel desk, per F20's own instruction. |
| F21 | applied-flagged | Q24: added the reckoner's exact validity wording ("valid 1 Oct 2026 – 30 Sep 2027, one way, inclusive of 5% GST"); "Luxury Sedan" renamed to "Sedan (premium)" because the printed tariff PDF's vehicle-class name itself uses the banned word "luxury" (RATES_RECKONER FLAGS already raised this unresolved register conflict) — flagged to the tariff owner rather than silently keeping banned copy. The pre-existing "48 hours advance booking" figure is carried over unverified against the reckoner — flagged. |
| F22 | applied | Q25: "our retreat" → "the hospital". |
| F23 | applied | Q27: en-dash spacing fixed throughout ("March–May" etc.). |
| F24 | applied | Q30: rewritten per the suggested fix (loincloths/bathrobes phrasing cleaned up). |
| F25 | applied | Q32: "guests" → "patients"; rest of the insurance-process text otherwise unchanged (already accurate). |
| F26 | **applied-flagged** | Q34: the advance-payment percentage was **removed entirely**, per the finding's own instruction ("Owner confirms the figure or the line goes") — three sources disagree (old FAQ 50%, reckoner 40% deposit, live cancellation-and-refund-policy page 100%). Flagged for the owner to settle before any percentage is restated. |
| F27 | applied | Topic heading "For International Guests" and the three questions' "guests" wording fixed at the question/summary level (Q35, Q36, Q38). **The topic heading itself is a dataset-level field, not a per-question field, and could not be changed inside this JSON's `edits` object — it needs a separate fix.** See §3. |
| F28 | applied | Q35: "Our retreat is designed with accessibility in mind" → "The campus is designed...". |
| F29 | applied-flagged | Q36: no date invented; instead points to the official Indian visa portal (indianvisaonline.gov.in) and removes the stale "4–6 weeks" estimate. Flagged: visa processing times change and should be revisited regularly. |
| F30 | applied-flagged | Q38: replaced the unconfirmed "special packages...cultural excursions" claim with the confirmed 5%-over-28-nights extended-stay discount from the reckoner. Flagged: owner/physician to confirm what an extended-stay programme concretely includes, if more detail is wanted. |
| F31 | **applied-flagged, signoff: Dr. Deepu John** | Q41: the 1/3/6-month follow-up cadence is **kept unchanged** (per the "anything the sources cannot settle: keep current wording and flag" rule) pending Dr. Deepu John's confirmation. Team-naming fixed. |
| F32 | applied | Q43: dropped "free e-books", "reading list on request" and "monthly webinars" (unconfirmed); linked only the three confirmed routes (`/knowledge-centre/`, `/books/`, `/video-gallery/`). |
| F33 | applied | Q44: the five governed training courses named in full (One-Day Workshop through the 20-day Advanced Ayurveda Lifestyle Consultant & Therapist Training), linked to `/ayurveda-training-programme/`. |
| F34 | applied-flagged | Q42: "Daily lectures"/"Intensive retreats" restated as weekly workshops per the reckoner's inclusions; cross-references the Q44 course list. Flagged to confirm exact cadence. |
| F35 | applied | US "programs" → UK "programmes" applied to Q13 and Q44 (as F35 named) **and** to Q42's summary, since the same US-spelling issue appears there too — extended beyond F35's two named rows for consistency with the register lock. **Q12 itself contains no "program(s)" string** — F35's Q12 citation most likely refers to the *topic heading* "Treatments & Programs" (which does contain it), not the Q12 answer text; no change was made to Q12's answer for this reason. See §3 for the heading-level fix still needed. |
| F36 | **kept-flagged** | Q17: left unchanged (plausible, no register violation). Flagged to confirm swimming pool filtration, gift shop and Wi-Fi claims with facilities, per F36's own instruction. |
| F37 | applied-flagged | Q26: rebuilt from the single live attractions dataset. Silent Valley National Park corrected 100 km → 80 km; Parambikulam corrected/renamed "Wildlife Sanctuary" at 100 km (was "Tiger Reserve" at 68.8 km); Malampuzha Dam (46 km) and Athirappilly Waterfalls (123 km) **dropped** — not found in, or contradicted by, the current dataset. "Palakkad Fort" (10.8 km) may be the dataset's "Tipu's Fort" (14 km) — flagged, not assumed. |
| F38 | applied | People-naming unified to "our physicians" / "the patient care team" across every edited answer that used one of the six prior names ("our doctors", "our medical team", "our wellness consultants", "reservations team", "administrative team", "medical team"). Touched: Q9, Q14, Q15, Q18, Q19, Q24, Q28, Q33, Q39, Q40, Q41, Q44 (Q9's "wellness consultants" already covered by F9; Q13's team language was already generic). |

---

## 2. Part B — the 25 additions

**14 drafted** (facts found in the three sources): #1, 5, 6, 7, 13, 14, 15, 17, 18, 20, 21, 23, 24, 25.
**11 marked `no-recorded-fact`** (answerHtml is `null`; a `needs` line names who must supply the fact): #2, 3, 4, 8, 9, 10, 11, 12, 16, 19, 22.

### No-recorded-fact list — who must answer

| # | Question | Needs |
|---|---|---|
| 2 | What happens on the day I arrive — is there an admission process? | Dr. Deepu John / patient care team |
| 3 | Should I send my medical reports before I come? | Dr. Deepu John / patient care team |
| 4 | Can I continue my current (allopathic) medicines during treatment? | Dr. Deepu John |
| 8 | Is a doctor available at night and on weekends? | Dr. Deepu John / hospital administration |
| 9 | What does NABH accreditation mean for me as a patient? | Dr. Deepu John / compliance owner |
| 10 | Which conditions do you NOT treat? | Dr. Deepu John |
| 11 | Can I take Panchakarma if I have diabetes or high blood pressure? | Dr. Deepu John |
| 12 | Can I have treatment during my period, or while pregnant? | Dr. Deepu John |
| 16 | Is the advance payment refundable if my visa is refused? | Owner / reservations policy owner |
| 19 | Can I work remotely during a treatment stay? | Owner / facilities |
| 22 | Do the doctors and therapists speak English, German or French? | Owner / HR |

### Clinical items requiring Dr. Deepu John's sign-off (Part B, items 4, 6, 7, 8, 10, 11, 12, 13, 25 — per task instruction, whether drafted or not)

- **#4** Continuing allopathic medicines — no-recorded-fact.
- **#6** Minimum/maximum age for treatment — drafted (booking-age and child-pricing policy from the reckoner); still routed to Dr. Deepu John per the task's clinical list.
- **#7** Can children be treated, or accompany a parent? — drafted (accompanying fact confirmed); the treatment-eligibility half is explicitly left to physician judgement in the answer text.
- **#8** Doctor availability at night/weekends — no-recorded-fact.
- **#10** Conditions not treated — no-recorded-fact (a draft exclusion list exists in `programme-search.js`'s `DECLINE` class, but that file sits outside this task's three designated fact sources, so it was not used).
- **#11** Panchakarma with diabetes/high BP — no-recorded-fact.
- **#12** Treatment during menstruation/pregnancy — no-recorded-fact.
- **#13** Is Panchakarma uncomfortable, what does a treatment day feel like? — drafted (therapy-frequency and detox-symptom facts only); routed for sign-off since it describes the clinical experience of treatment.
- **#25** Discharge summary — drafted (built from the existing, already-published Q32 language); routed for sign-off since it's a clinical-document claim.

### A note on one soft source (item #17)

Item 17's "Get Upto 30% OFF" figures (senior citizens, Olympics/Paralympics athletes) come from the `/testing/` record's metadata description in `faq-sources-datasets-2.md` — a page whose own governance notes mark it `noindex`, `"ownerAction":"Review duplicate"`. It is technically inside the designated fact-source file, so it was used and cited, but its low apparent reliability (a page literally named "testing") is flagged here — confirm these percentages are the live offer before shipping.

---

## 3. Outstanding fixes this JSON structure cannot carry (topic-level, not per-question)

These are dataset/topic fields, not individual Q&A fields, so they fall outside the `edits`/`additions` schema this task specified. Flagging them explicitly so they aren't lost:

1. Topic heading **"For International Guests"** → should become **"For International Patients"** (F27). The three questions under it were fixed at the summary/answer level; the heading string itself lives in the topic record, not a question record.
2. Topic heading **"Treatments & Programs"** → should become **"Treatments & Programmes"** (register lock, UK spelling; likely what F35's "Q12" reference actually meant, since Q12's own answer text has no "program(s)" string).

---

## 4. Self-check (rule f) — compliance scan

Banned-word scan run by hand across every `summary` and `answerHtml` string in the output JSON (edits + additions), checking for: **spa, resort, holiday, luxury, cure, journey, guests, getaway, retreat, wellness consultants**, plus the group filler list: **bespoke, curated, discerning, unparalleled, nestled, indulge, pamper, exquisite, world-class, unique**.

**Result: zero hits.** Specific fixes made to get there: "luxury" removed from Royal Villa (Q16) and renamed "Luxury Sedan"→"Sedan (premium)" (Q24, flagged as a source-PDF register conflict, not shipped as-is); "retreat" removed from Q4/Q18/Q22/Q25/Q35/Q42 and the whole Q1–Q7 topic; "guests"→"patients" throughout (Q4, Q9, Q13–15, Q32, Q35, Q36, Q38, additions #2, #5, #7, #17, #20); "journey" removed (Q22); "wellness consultants"→"our physicians" (Q9). Locked facts checked against source: `info@kairali.com` (not used in this pass — no question required it), WhatsApp `+91 92898 38797` (used once, addition #1, matches locked format), hospital phone `+91 9555 156 156` (Q19, Q24, unchanged from the already-correct original).

**Two words intentionally NOT touched, and why:** "wellness" (bare word) and "programme"/"Program" as part of an official governed course title (e.g. "Three-Day Ayurveda Certificate **Program**") — neither is on the KTAHV banned list (CLAUDE.md); the latter is a proper noun taken verbatim from `finder-additions.json` and was not respelled.

---

## 5. Counts for the record

- **Edits written:** 35 of 44 questions changed (Q1–Q9, Q11, Q13–Q16, Q18–Q19, Q22, Q24–Q28, Q30, Q32–Q36, Q38–Q44). 9 questions unchanged (Q10, Q12, Q17, Q20, Q21, Q23, Q29, Q31, Q37) — no finding required a change, or the finding explicitly said "keep and flag" (F20, F36).
- **Additions drafted (full answer):** 14 of 25.
- **Additions with no recorded fact:** 11 of 25.
- **Clinical items requiring Dr. Deepu John's sign-off:** 3 from Part A (Q13/F11, Q14/F12, Q41/F31) + 9 from Part B (items 4, 6, 7, 8, 10, 11, 12, 13, 25) = **12 total**.
- **Outstanding topic-level (non-question) fixes flagged:** 2 (§3).

## 6. Handoff

This draft is handed off to **seo-aeo-geo-auditor** for compliance/schema verification before it is considered final, per the mandatory gate. Recommended schema: **FAQPage** for the full Q&A set (question/acceptedAnswer pairs), consistent with the per-programme FAQ pattern already in use elsewhere on the site (`whoFor`/`faqs` blocks in the programme views). Logged via the logger sub-agent contract on handoff.
