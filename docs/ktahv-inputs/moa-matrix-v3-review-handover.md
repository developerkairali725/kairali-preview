---
source_fileId: 1dzl4L9v3x90eIYhbc4PgQzvZjVUFCyVtzwKdAX2HsSg
source_title: KTAHV_MOA_Review_Handover
source_type: Google Doc (owner director@kairali.com, built 19 May 2026)
ingested: 2026-07-13 18:59:02 IST
ingested_by: agent (Drive corpus sweep, D-delegation 13 Jul 2026)
note: Full text as returned by Drive export. This is the MOA Matrix v3.0 framework + refresh protocol — the locked target-audience definition gating all KTAHV work.
---

# KTAHV MOA Matrix v3.0 — Review & Refresh Handover for Next AI

*Owner: Abilash K. Ramesh, Executive Director, Kairali Ayurvedic Group · Built: 19 May 2026*

**WHAT THIS DOCUMENT IS** — This is NOT a project-completion handover (build the next thing). **This IS a recurring-task handover (audit, refresh, surface what's changed).** The v3.0 MOA framework is locked. Your job, next AI, is to keep it accurate against fresh data — not to redesign it. The framework took six rounds of iteration and three datasets to lock; do not relitigate the structure unless evidence forces it.

## 1. Read this first — the locked framework

Before you do anything else, internalise these as premises. Each one is the result of an active correction during the project. Reversing any of them silently is the failure mode.

### 1.1 MOA means "Market of Acquisition"

Abilash's usage. Not Akshar Yadav's "Most Obvious Avatar" (one face). Not a CRM segmentation. An MOA is the target-audience definition sharp enough that every marketing rupee can be designed for them. Could be one MOA, could be five. The discipline is that each MOA has its own journey, message, channel, KPI.

### 1.2 The five core MOAs (locked)

| # | MOA | Definition | 2026 Share | Priority |
|---|---|---|---|---|
| 1 | India Domestic — Male (self + parents-care) | Diagnosed allopathic-failure case OR adult son booking for ageing parent. Tier-1 metro, 40-60. | ~35% | P1 Volume |
| 2 | India Domestic — Female (self) | Hormonal / autoimmune / chronic-pain / burnout / menopause / post-illness. Self-decision. | ~25% | P1 Volume |
| 3 | NRI Diaspora | Punjabi / Gujarati / UP-NRI / South-Indian / Ismaili households 2-3 decades in US/UK/Canada. | ~10-12% | P3 Leverage |
| 4a | DACH End-User (via European Specialist Agency) | German woman 45-65, chronic stress/menopause, 14+n Panchakarma via German-language agent. | ~2-7% | P2 UNDER REVIEW |
| 4b | France End-User (via French Specialist Agency) | French wellness-curious, often group tour, premium ticket. | ~2-5% | P2 Stable |
| 5a | B2B European Specialist Agency (partner-as-customer) | The agency itself is the buyer. Decision: list, push, renew. | 26 partners | P2 Engine |
| 5b | B2B Indian DMC + Other (partner-as-customer) | Indian TAs, yoga teachers, Ayurvedic doctors, retreat organisers, HNI concierges. | 23+ partners | P3 Support |
| 6 | GCC | Jariri's family-office network + future expansion 2027. | ~3-5% | Park to 2027 |

### 1.3 The critical corrections embedded in v3.0

*Each of these was wrong in earlier versions of the analysis. Do not undo them.*

- **Parent-brand rollup.** Fit Reisen + Lotus Travel + AyTour + SpaDreams = ONE parent (Fit Reisen Group). Treating these as separate top-10 partners (which the raw data does) hides the fact that 43% of all B2B revenue depends on ONE parent company. Insight Reisen is INDEPENDENT (Swiss). Gecco / Idee Globus / Incentive Destinations are INDEPENDENT (German).
- **NRI reclassification.** Country=India + foreign billing address → NRI Diaspora MOA, not India Domestic. About 10-12% of arrivals are miscoded this way in raw data. Always reapply this fix to fresh exports.
- **Decision-maker, not arrival.** One booking = one decision = one MOA. Spouses and family arriving as Secondary rows in legacy data inflated female share to ~65% (artefact). Real India female-decision-maker share is ~34%, matching v2.0 historical.
- **France is its own sub-MOA, not "Other Europe".** 10 active French TAs, ₹1.23 Cr revenue, highest avg ticket in the entire B2B portfolio (₹5.6L). Group bookings common. Different from German specialist channel.
- **Channel decides repeat, not demographic.** Caucasian-via-Anglo-direct = one-and-done. Caucasian-via-DACH-agency = repeats. Same demographic, different acquisition channel = different MOA economics.
- **Caucasian-direct-Anglo is NOT MOA.** Yoga-curious one-trip-of-a-lifetime travellers won't return. Don't spend to acquire. They arrive via SEO and word-of-mouth — service them well, don't market to them.
- **Corporate Wellness India is NOT MOA.** KTAHV pricing doesn't fit corporate HR budgets. Route to KAC at the group level. Confirmed dropped from MOA set.
- **B2B = ~135 entities in cleaned master, 59 active bookers, 30 no-booking universe.** If you see "125" used loosely, it's directionally right but operationally 59 is the working number.

### 1.4 The known landmines — do NOT re-derive these

**Things earlier AIs (and I) got wrong. Do not repeat.**

1. **Repeat rate is NOT 5%.** The v2.0 README and Sheet 9 contradict v2.0 Sheet 6 (which says 13.7%). Abilash's current operational figure is ~11.8% and declining. Use 11.8% as overall, treat segment-level repeat as unknown until Ambuj re-runs.
2. **The B2B partner count is NOT 9 (the DACH list in v2.0).** The full universe is 59 active parent-partners across 14 countries. The v2.0 9-agency list was a DACH-only subset.
3. **"DACH" is not synonymous with "Fit Reisen".** Insight Reisen, Gecco, Idee Globus, AyTour-as-original-brand (now in Fit Reisen Group), Incentive Destinations are all separately German/Swiss/Austrian. Fit Reisen Group dominates but doesn't equal DACH.
4. **"Caucasian" is too narrow for non-diaspora-non-NRI internationals.** Tier-A direct list includes Africans (Henry Brunson Nigeria, Carolyne Muthumah Kenya), Levantines (Randa Hilal Lebanon), Japanese (Shiori Watanabe). Don't compress them all into "Caucasian wellness-seeker".
5. **India female-decision-maker share is ~34%, NOT 65%.** If you see 60%+ female in India data, you're counting arrivals (Secondary rows inflate). Reapply the booking-level deduplication.

## 2. Verification test — prove you read section 1

Before producing any analysis, state these 5 facts in your first reply. If you cannot state them accurately, re-read section 1. Do not guess.

1. Which four brands consolidate into Fit Reisen Group?
2. What percentage of 3-FY B2B revenue does Fit Reisen Group represent?
3. What is the current overall repeat rate Abilash cited, and what's the trend (up/flat/declining)?
4. Why is Caucasian-via-Anglo-direct NOT an MOA, while Caucasian-via-DACH-agency IS part of MOA #4a?
5. What is the difference between "arrivals" and "decisions" in the data, and why does it matter for female-share calculations?

### Correct answers (for self-check after answering)

- **Q1:** Fit Reisen + Lotus Travel + AyTour + SpaDreams. All one parent company.
- **Q2:** 43% of 3-FY B2B revenue and 49% of bookings. Single-largest concentration risk.
- **Q3:** ~11.8% overall, declining. Doubling it next year is the strategic goal driving this whole project.
- **Q4:** Acquisition channel decides repeat behaviour. Direct-Anglo Caucasian guests are one-and-done; agency-curated DACH guests repeat because the agency does relationship-management work. Same demographic, different economics because of channel.
- **Q5:** An arrival is a person who shows up. A decision is a person who chose KTAHV and paid. Spouses, dependents, parents arrive as Secondary rows in legacy data but the decision was made by the Primary booker. Counting arrivals inflates female share because women often arrive as companions; counting decisions reflects who marketing needs to reach.

## 3. The review protocol — what to check every cycle

This is a recurring task. Each time Abilash gives you fresh data (new month, new quarter, new FY), run these checks in order. Each one has a specific output.

### 3.1 Refresh-cycle expectations

| Cadence | Trigger | What the next AI should do |
|---|---|---|
| Monthly (light) | Fresh PMS/FMS export | Re-classify origin + MOA on new bookings. Compare share-by-MOA to prior month. Flag deviations >20%. |
| Quarterly (deep) | End of Q1/Q2/Q3 | Full Sheet 3 rebuild. Compare Tier-A%, female%, repeat% by MOA against prior quarter. Update Sheet 7 scorecard. |
| FY (full audit) | End of FY (31-Mar) | Add new FY to Sheet 6 YoY. Recompute B2B Pareto. Audit single-booking-partner tail. Reconcile against Anupam's updated TA ledger. |
| Ad-hoc | Major channel event (e.g. Fit Reisen incident) | Targeted single-MOA deep-dive. Don't trigger full refresh. |

### 3.2 The 7-step audit checklist for each refresh

Run in order. Each step produces a checkpoint — if a step surfaces an alarm, document it but continue; do not stop the audit early.

**Step 1 — Re-classify origin.** For each new booking, run the NRI heuristic: if Country=India AND billing address contains a foreign country marker (USA, UK, Singapore, Germany, France, Netherlands, Canada, Australia, Jordan, Mauritius), reclassify as NRI Diaspora with the appropriate suffix. The MOA Matrix v3.0 workbook's Sheet 3 has the working classifier code.

**Step 2 — Re-classify product (programme).** Map the Programme field to: Panchakarma / Rejuvenation-Detox / Preventive / Joint-Spine / Stress-Mental / Sinus-Migraine / Neuro / Addiction / Sleep / Weight / Cardio / Unspecified / Other. Empty Programme fields stay as "Unspecified" — do NOT infer them.

**Step 3 — Apply gender quality fix.** Title (MR./MRS./MS.) overrides gender field. If title is absent, apply Indian first-name lookup. Document any rows where the gender field contradicts both. Do not silently change — flag them in the data-quality summary.

**Step 4 — Compute MOA share + sub-stats.** For each MOA: bookings count, bookings %, Tier-A% (14+n), female-decision-maker%, repeat%, top 3 products. Compare to v3.0 baseline (Sheet 7) and prior-cycle snapshot. Anything moving >5 percentage points is worth surfacing; >15 points is an alarm.

**Step 5 — Update B2B parent-brand rollup.** New B2B partners go through the same rollup logic. Fit Reisen Group consolidation MUST be reapplied to any fresh data. Check for new variations (e.g., "FIT Reisen GmbH", "Fitreisen.de") — these are the same parent. Asha Experience reconciliation may resolve into an existing entity or stay independent — ask Abilash if unclear.

**Step 6 — YoY trajectory update.** For each parent partner with bookings in the new period, compare to the same period in the previous FY (not previous quarter — seasonality distorts QoQ for some segments). Flag any partner with >25% YoY decline or any "DORMANT" partner that has resumed bookings.

**Step 7 — Open-questions update.** Move resolved items from "Open" to "Closed". Add new items surfaced this cycle. Re-prioritise (P0/P1/P2/P3). The Sheet 9 "Open Questions" is the canonical to-do list — every audit produces an updated version.

### 3.3 What to surface vs what to absorb

| Signal | Surface to Abilash | Absorb silently |
|---|---|---|
| MOA share change | >15 percentage points OR new MOA appearing | <5 percentage points |
| B2B partner YoY | >25% decline for top-15 partner OR any top-5 going to zero | <10% drift, or movements in the long tail |
| Repeat rate | Material change in segment-level repeat (>3 percentage points) | Overall noise from small samples |
| Data quality | New systematic miscoding pattern | Individual one-off typos |
| Channel mix | Any channel collapsing >50% OR new channel emerging >5% | Normal seasonal fluctuation |
| Cancellation rate | Doubling or halving on a segment | Single-percentage-point movement |

## 4. Patterns to watch for — and what each one means

### 4.1 Channel-shift patterns

**Pattern A — Fit Reisen Group decline continues.** Current alarm. FY23-24 → FY24-25 → FY25-26 bookings: 39 → 56 → 22 (Fit Reisen Group consolidated). If FY26-27 shows further decline, this is structural, not seasonal. Options to surface: (1) competitive switch — Soukya/Niraamaya/Lanserhof/Sri Lankan competitors gaining share; (2) channel shift — Fit Reisen routing leisure clients to Villa Raag, KTAHV losing share of parent's pipeline; (3) market softness — German wellness travel down across the board.

**Pattern B — Villa Raag siphons KTAHV long-stay.** Look for: KTAHV Tier-A% dropping among DACH while Villa Raag DACH bookings appear in cross-property data. This would be portfolio-rational but needs to be visible. If KTAHV Tier-A% drops below 60% for DACH (currently ~69% in 2026 data, historically 74%), investigate Villa Raag's DACH numbers.

**Pattern C — Wellness Loka scaling.** Bright spot. Wellness Loka Kerala FY23-24 → FY24-25 → FY25-26: 1 → 4 → 12 bookings. If this continues to 20+ next FY, Wellness Loka has become a major Indian B2B partner and deserves dedicated account-management attention.

**Pattern D — Single-booking partner reactivation.** 33 of 59 B2B partners booked once and never returned. If any of the high-value one-shots (Far Beyond ₹20L, Namaskar Inde ₹6.2L, Travel Experiences Journey ₹5.7L, My Trip My Travel ₹5.7L, Gecco ₹4.4L) returns, surface it. These are pre-existing relationships, not cold acquisitions.

### 4.2 Demographic-shift patterns

**Pattern E — India shifting shorter-stay.** 2026 data shows India Tier-A% at 24%, lower than v2.0 32%. India C-tier (<8n) at 63% vs historical 54%. If this continues, India is positioning more as wellness break than clinical destination — could be: (1) price sensitivity, (2) Villa-Raag-style leisure preference rising, (3) target audience moving younger. Confirm with Anupam before drawing conclusions.

**Pattern F — NRI undercounted growth.** NRI 2026 share is 12% in clean data vs 6% in v2.0. Some of this is just better classification (the address-based heuristic), some may be real growth. Distinguish by comparing NRI bookings using consistent classification across years. If NRI is growing by 30%+ YoY even on consistent classification, this is the strongest evidence yet for prioritising NRI as a P2 not P3 MOA.

**Pattern G — Diaspora sub-community concentration.** Watch for Punjabi vs Gujarati vs South-Indian vs UP-NRI vs Ismaili sub-shares. Currently roughly even-ish based on name patterns. If one sub-community starts dominating (e.g. >50% of NRI bookings become Punjabi), the campaign needs more vernacular-specific work. If they stay diverse, the 80% same campaign + 20% vernacular variant strategy holds.

### 4.3 Behavioural patterns

**Pattern H — Group-booking inflation.** French TAs frequently send groups of 5-13 people on one booking. One group-booking inflates a country's apparent share. In 2026 data, two French/Portuguese group tours alone moved Other-Europe from 4% to 14%. When sizing future cycles, distinguish single-individual decisions from group-organised tours. Group bookings are MOA #5a behaviour (B2B partner sending a tour), not MOA #2 behaviour (individuals discovering the property directly).

**Pattern I — Repeat-customer concentration.** 17% of 2026 arrivals are repeaters per the data flag. Top repeaters (Sat Kartar Singh Bird, Uma Rao, Dimple Duggal, Preeti Bhathal, Herman Haan) tend to be a small set making multiple visits each. If repeater concentration becomes top 10 repeaters = 50% of repeat-volume, the loyalty programme is over-dependent on too few names. Healthy distribution = top 10 repeaters under 25% of all repeats.

**Pattern J — Cancellation-rate divergence.** Track cancellations by MOA, not just overall. In 2026 data, 5 of 58 = 8.6% cancellation. If any single MOA shows >15% cancellation rate, that segment has either pricing/product or service-promise misalignment. If DACH cancellation jumps (currently effectively 0% in 2026 data but very small sample), investigate Fit Reisen-mediated experience.

## 5. Escalation — who handles what

| Finding type | Owner | What to write in the surface-up |
|---|---|---|
| Fit Reisen Group health | Harpal | YoY booking count, revenue trend, sub-brand mix shift. Specific account-management questions for the next call. |
| Repeat rate decomposition | Ambuj | Request: re-run repeat rate segmented by MOA, with first-time-cohort vs returning-cohort distinguished. |
| B2B partner reconciliation | Anupam | New entities, duplicates, parent-brand questions, country corrections. |
| India PMS data hygiene | Sales team (via Vikash) | Specific row-level errors: gender flips, country misspellings, missing programmes, NRI miscoding. |
| Strategic MOA shift / framework change | Abilash | If the data forces a structural change to the 5-MOA framework, escalate. Otherwise stay within the framework. |
| Marketing channel response | Anupam + Akshar | Once a pattern is confirmed, the marketing-implications work is theirs. Don't write campaign briefs unsolicited. |
| Operational alarms (DACH collapse, etc.) | Abilash + Harpal jointly | Concise alarm with data, two-line implication, one specific question to investigate. |

**How to surface, in one paragraph:** Lead with the finding (one sentence). Show the data (one chart or table). State the implication (one sentence). Name one specific action by the owner (one sentence). That's it. Four sentences plus a table. Anything longer dilutes the signal. Example: "Fit Reisen Group FY25-26 bookings are 22, down 61% from FY24-25's 56. Three sub-brands (Lotus, AyTour, SpaDreams) are at or near zero. Either the Fit Reisen Group portfolio strategy shifted (Villa Raag onboarding may be siphoning leisure clients) or the relationship has cooled. Recommend Harpal asks Barbara Rupp specifically about KTAHV's share-of-pipeline in their 2026 catalogue."

## 6. The files you need + how to use them

### 6.1 Must-attach files (Abilash should provide each refresh)

| File | Format | What it contains / How to use |
|---|---|---|
| KTAHV_MOA_Matrix_v3_0.xlsx | .xlsx | The current framework. 9 sheets. Use as baseline. Update Sheets 3, 4, 5, 6, 7, 8, 9 each cycle. Sheets 1 and 2 are stable. |
| KTAHV_MOA_Review_Handover.docx | .docx | This document. Read first. |
| Fresh booking data (PMS or FMS V3 export) | .xlsx / .tsv | 2026 arrivals (or subsequent year). Must include: arrival date, country, billing address, programme, nights, gender, booking status, repeat flag, invoice. |
| Updated B2B ledger (Anupam) | .xlsx | Anupam's TA facilitator data — refreshed each FY-end. Contains Sheet13 ranking and per-FY clean sheets. |

### 6.2 Optional files (helpful but not required)

- Akshar Yadav marketing consultation outputs (when relevant)
- Soul Forest / Villa Raag cross-property data (for portfolio analysis)
- ITB Berlin / trade show calendar (for B2B timing context)
- Competitor pricing data (Soukya, Ananda, Niraamaya, Heritance Sri Lanka, Lanserhof Germany)

### 6.3 DO NOT attach

- Raw 2,621-stay legacy data from v2.0 (superseded; v3.0 is current reality)
- v1.0 or v2.0 of the handover document (this v3.0 supersedes)
- Unrelated Kairali Group projects (Wikipedia, gardens, GST, Soul Forest, chatbot prompts, etc.)
- Pre-2025 booking datasets (out of scope for MOA review; FY23-24 forward only)

## 7. How Abilash works — and what he expects from you

### 7.1 Tone + register

- **He types casually.** Lowercase, abbreviations, typos. This is NOT a signal to be casual back. Match his thinking depth, not his typing register.
- **He values data honesty.** Name your judgment calls explicitly ("this is inference, not data"). Do not pretend to know what you do not.
- **He expects pushback.** When he disagrees with you, ask why. When you disagree with him, say so with evidence. Both happened repeatedly in the project that produced v3.0.
- **Density matters more than length.** He'll read a long answer if every paragraph carries weight. He'll call out padding immediately.
- **Operational specificity is non-negotiable.** Who owns it, when does it ship, what does it cost, what does success look like in numbers. "Just be more strategic" gets called out as fluff.

### 7.2 What earned trust during the v3.0 build

1. Conceding mistakes explicitly when caught. "I was wrong because X; the corrected position is Y." Three concessions made the conversation productive: (1) accepting NRI is not Kerala-NRI but Punjabi/Gujarati/UP-NRI; (2) accepting Caucasian-DACH-via-agency IS MOA (I'd dismissed it); (3) accepting the B2B segment was missing from my analysis entirely.
2. Reading the actual data rather than the documents about the data. The v2.0 README and Sheet 9 said "5% repeat rate". Sheet 6 said 13.7%. Always go to the row-level data.
3. Distinguishing what's evidence-supported from what's inference. "This is what the data shows" vs "This is what I'd guess given X."
4. Quantitative specificity. Never "DACH is declining"; always "DACH bookings 41 → 22, a 46% YoY drop on Fit Reisen Group consolidated."
5. Surfacing limitations alongside findings. "The 2026 sample is 58 bookings; directional findings are robust but exact percentages are not."

### 7.3 What failed during the v3.0 build (avoid these)

1. Propagating an unchecked number across replies (the 5% repeat rate). Always re-derive numbers from source; do not trust prior synthesis.
2. Eyeballing diaspora share at 75% without doing the heuristic-based count. Real number was 58%. Lazy estimates get caught.
3. Initially treating the B2B agency as just a "channel" not a customer in its own right. Abilash pushed back. The B2B Trusted Intermediary MOA is real and structural.
4. Treating Fit Reisen and Lotus and AyTour as separate top-10 partners. Cost a full conversation cycle. Always ask about parent-brand affiliations before sizing concentration.

### 7.4 Team — who's who

| Person | Role + how to engage |
|---|---|
| Abilash K. Ramesh | Executive Director. The user. Strategic decisions, framework changes, escalations land here. |
| Anupam | Head of Marketing. Owner of B2B partner data + MOA marketing implementation. Most reconciliation questions go here. |
| Harpal Singh | B2B sales — DACH/European specialist channel. Owner of Fit Reisen Group relationship. |
| Sadik Rehman | B2B sales — particularly The Loft Project / retreat-organiser channel. |
| Ambuj | AI/tech infrastructure. Owner of data pipelines + tracker rebuilds. Repeat-rate decomposition lives here. |
| Vikash | Digital marketing manager. Operational execution + sales-team data hygiene. |
| Ritu | Executive Assistant — calendar/diary, not technical. |
| Akshar Yadav | External marketing consultant (Overbooked Academy). Brings the "is this campaign sharp enough" pressure-test. |
| Gita Ramesh / Dr. K.V. Ramesh | Founding figures. Brand assets, not operational. |

## 8. Opening prompt — for Abilash to use when starting a new chat

(Prompt block for recurring MOA-review sessions: attach the four must-attach files from 6.1; the AI must read Sections 1-4, pass the Section 2 verification test, confirm the review cycle, and wait for go-ahead before producing the audit. Style expectations: match thinking depth not typing register; name judgment calls; operational specificity; push back with evidence.)

### 8.1 If things go wrong

- AI skips the verification test → stop it, demand the 5 facts.
- AI changes the framework without permission → "The 5-MOA framework is locked... State your evidence or revert."
- AI quotes numbers contradicting the workbook → "Section 1.4 names 5 landmines. You just hit one. Re-derive from source data."
- Generic "how can I help" reply → files didn't load; re-attach.
- Audit too generic → "Tell me what changed since the v3.0 baseline."

## 9. Project memory — what's been done

### 9.1 What v3.0 replaced

v2.0 (KTAHV_MOA_Matrix_v2_0.xlsx) was a 4.5-year aggregate view across 2,621 stays. Sound foundation but had: a repeat-rate contradiction (5% in README/Sheet 9, 13.7% in Sheet 6); DACH framing that treated agency-as-channel only; geography-only segmentation; NRI buried inside Anglo; no France break-out; Fit Reisen Group not consolidated.

### 9.2 The shape of the work

Six rounds of MOA refinement: (1) "who is NOT MOA" exercise — eliminated F_GCC, I_Asia_Other, Z_Other_intl from MOA candidates; (2) Caucasian = not MOA corrected when Abilash pointed out Fit Reisen sends repeating Germans; (3) "agency is channel not MOA" corrected; (4) 5 MOAs + product overlay grid accepted with refinements; (5) deep data dive on 2026 arrivals — caught the propagated 5% repeat-rate error, corrected diaspora % from 75% to 58%, identified Other-Europe inflation by group bookings; (6) Fit Reisen + Lotus + AyTour + SpaDreams = one parent — the biggest single structural fix (43%-of-B2B-revenue parent).

### 9.3 What's still open

- **P0:** Fit Reisen Group FY25-26 decline root cause (Harpal investigating)
- **P1:** Repeat-rate-by-MOA decomposition (Ambuj pending)
- **P2:** Asha Experience reconciliation in Anupam's ledger
- **P2:** Pranjal Sharma / Loft Project / Vacation Experts entity-resolution
- **P2:** France TA grouping — confirm 10 distinct parents vs hidden duplication
- **P2:** 33 single-booking-partner reactivation outreach (Anupam + Harpal)
- **P3:** Russia market (2 partners, 3% revenue) — strategic position?
- **P3:** NRI sub-community campaign breakdown (80% same or split deeper)

### 9.4 What the next deliverable likely is

One-page persona docs for each MOA (Akshar Yadav-influenced format): named avatar with age/household/income/profession; specific trigger; trust signals; channels; message hooks; sales conversation; programme fit; one KPI. *Don't start writing persona docs unprompted.*

## 10. Self-check before sending any reply

Pre-send checklist: re-derive numbers from source; distinguish data vs inference; name owners; quantitative specificity; surface limitations; no new MOA without evidence; don't change parent-brand rollup; use "NRI" not "Indo-Western"; treat agency as both channel AND customer; keep "who is NOT MOA" clarity intact.

*— End of handover —*
