# kairali.guru — course-page rates truth-up (Lane B paste file)

- **Prepared:** 2026-07-21 00:38:00 IST · phase-C session
- **Rates source (the ONLY numbers used):** docs/rates/RATES_RECKONER.md §"Kairali Ayurvedic Centre (Delhi NCR) — Non-Residential Ayurveda Training Programs V2" — Anupam Singh Molpha (mkt@ktahv.com), 2026-07-20 16:11 IST, msg `19f7f1e76d9dbda1`. HARD GATE 6: nothing below is invented; every open gap is a flagged OWNER DECISION, not a filled-in guess.
- **Live-state evidence:** all 5 pages fetched 2026-07-21 ~00:20 IST (HTTP 200 each). **The live pages do NOT match the 16-Jul audit any more:** the validity sentence on every course page now reads "Above rates applicable from 1st Jan, 2026 to 31st March, 2027." while every price remains the OLD (2019-window) figure. See §FINDING below.
- **Executor:** the site is legacy ASP.NET WebForms (no repo, no staging) — edits are applied by IT (Sunaj lane) after Abilash approves this file. Same template block on all five pages.

## FINDING — the 16-Jul fix instruction was executed wrong on the live site

The 16-Jul mail (thread `19f6aac017b6cac9`) instructed: *"Get the current rates and validity period from me, then update the price line and table on the five course pages."* Sunaj replied "Done" (20 Jul 17:09 IST). Machine truth (fetches above): only the validity **dates** were rewritten (2019→2026/2027); every price number is unchanged from the 2019 table, and no rates were ever obtained from Abilash (the V2 list only reached the mailbox 20 Jul 16:11 from Anupam, and the live tables do not carry it). Net effect: the site now **warrants 2019-era prices as valid through 31 March 2027** — e.g. it commits the 1-Day program at ₹9,000 while the current V2 rate is ₹13,500. This is a live pricing liability on the enquiry-conversion path, worse than the original stale-line defect.

## WHAT UPDATES NOW (confident blocks — V2 numbers verbatim)

Every course page's price table has two rows. **Row 1 (non-residential, currently labelled "Delhi, Mumbai" / "Delhi & Mumbai")** updates from V2. Row 2 (Kerala residential) and the validity sentence are OWNER DECISIONS below. Old text is verbatim from the live fetches; ordinals ("1st"/"31st") render with `<sup>` tags on the pages.

### Page 1 — /one-day-ayurveda-workshop-program.aspx (OAP)
| | Program Code | Duration | INR | USD |
|---|---|---|---|---|
| OLD row 1 | OAP - (Delhi, Mumbai) | 3 hours | 9000 | 150 |
| **NEW row 1** | OAP – (Delhi NCR centres — see D1 for label wording) | **3 Hours** | **13,500** | **160** |

### Page 2 — /three-day-short-term-ayurveda-certificate-program.aspx (TAP)
| | Program Code | Duration | INR | USD |
|---|---|---|---|---|
| OLD row 1 | TAP - (Delhi & Mumbai) | 3 hours sessions daily over 3 days (excluding Saturday & Sunday) | 25000 | 420 |
| **NEW row 1** | TAP – (Delhi NCR centres — D1) | **3-hour sessions for 3 days** | **37,000** | **495** ⚠ D4 |

### Page 3 — /intensive-ayurveda-training-program.aspx (WAP)
| | Program Code | Duration | INR | USD |
|---|---|---|---|---|
| OLD row 1 | WAP - (Delhi, Mumbai) | 3 hours sessions daily over 5 days (excluding Saturday & Sunday) | 42000 | 700 |
| **NEW row 1** | WAP – (Delhi NCR centres — D1) | **3-hour sessions for 5 Days** | **61,000** | **655** (USD decreases — correct per V2) |

### Page 4 — /level-one-advanced-ayurveda-training-program-for-wellness-professionals.aspx (AATP-1)
| | Program Code | Duration | INR | USD |
|---|---|---|---|---|
| OLD row 1 | AATP - 1 (Delhi, Mumbai) | 4 hours sessions daily over 10 days (excluding Saturday & Sunday) | 90000 | 1500 |
| **NEW row 1** | AATP - 1 (Delhi NCR centres — D1) | **3-hour sessions for 10 Days** (V2 changes 4hr→3hr) | **130,000** | **1,400** (USD decreases — correct per V2) |

### Page 5 — /advanced-ayurveda-lifestyle-consultant-and-therapist-training-program.aspx (AALCT)
| | Program Code | Duration | INR | USD |
|---|---|---|---|---|
| OLD row 1 | AALCT - Delhi & Mumbai | 4 hours sessions daily over 20 days (excluding Saturday & Sunday) | 180000 | 3000 |
| **NEW row 1** | AALCT (page code stays until D5 rules) – (Delhi NCR centres — D1) | **3-hour sessions for 20 Days** (V2 changes 4hr→3hr) | **250,000** | **2,700** (USD decreases — correct per V2) |

### Weekly-off note (all 5 pages, replaces "(excluding Saturday & Sunday)" in row 1 durations)
V2 states the centre weekly offs as: **Tuesday** — Mehrauli (New Delhi) and Gurugram (Haryana); **Monday** — Siri Fort Sports Complex Centre. The old "(excluding Saturday & Sunday)" fragment does not match V2 and comes out with the duration-cell rewrite above; the weekly-off sentence goes wherever the template's notes block sits.

### Also add (all 5 pages, from V2, replaces the old accommodation footnote *for row 1 only*)
"Accommodation & food facilities are not included in the package." (V2 wording; the old footnote "*This price includes accommodation and meals during the stay." belongs to the Kerala row — see D2.)

## OWNER DECISIONS (D1–D5) — nothing here ships until the word comes

- **D1 — Mumbai.** V2 prices ONLY the three Delhi-NCR centres (Mehrauli · Siri Fort · Gurugram). The live rows say "Delhi, Mumbai" and the T&C says "Other locations … are Delhi and Mumbai". V2 has NO Mumbai rate. Options: (a) row label becomes "Delhi NCR (Mehrauli · Siri Fort · Gurugram)" and Mumbai comes off the pages; (b) Mumbai stays at the V2 numbers — needs Anupam's written word that Mumbai charges the same; (c) hold the label edit, ask Anupam for a Mumbai table. Recommendation: **(c) ask Anupam, ship (a) if no Mumbai rates exist.**
- **D2 — Kerala residential rows (all 5 pages).** The live Kerala rows print bundled per-program prices (18400/307 · 55200/921 · 92000/1535 · 184000/3070 · 368000/6140) — all stale 2019 figures. The current V2 residential model is **per-night by villa type** (reckoner §KTAHV V2: "Do NOT publish a 'course price' that is not derivable from the tables… if a client needs a packaged number, ASK Abilash"). Options: (a) replace each Kerala row with a no-number line — "Residential format at Kairali – The Ayurvedic Healing Village, Palakkad: per-night villa rates, all-inclusive of stay, meals, training & taxes — enquire for your villa category and dates"; (b) remove the Kerala rows, link to KTAHV; (c) Abilash supplies bundled figures for the reckoner first. Recommendation: **(a)** — truthful, keeps the residential offer visible, publishes no non-derivable number.
- **D3 — validity sentence.** The live "1st Jan, 2026 to 31st March, 2027." was never ED-authorized (V2 gives no window; the instruction said the window comes from Abilash). Options: (a) delete the sentence until Abilash fixes a window; (b) Abilash fixes the window now and it ships with the numbers. The residential PDFs' Oct 2026–Sep 2027 window belongs to a different document and is NOT borrowed (HARD GATE 6).
- **D4 — TAP USD $495.** Implied ₹/$ ≈ 74.7 vs siblings ≈ 84–93 (reckoner FLAG). Confirm $495 with Anupam before it ships; the INR 37,000 is unambiguous.
- **D5 — AALC-2 vs AALCT.** V2 renames the 4-week code to AALC-2; the page (h1, table, URL slug) prints AALCT. Rates update does NOT need the rename; rename only on Anupam's confirmation (it touches the h1, URL and any certificates).

## EXECUTION (after approval)

One mail to the IT lane (draft staged for Abilash's send) carrying the approved blocks page-by-page: five row-1 rewrites + footnote/weekly-off swaps + whatever D1–D3 ruled. Post-publish QA fetch of all 5 pages diffs the price block against this file (Lane B post-publish rule) and the result lands in audits/.

## RULINGS — all five decisions closed (2026-07-21 10:46:10 IST, owner in-chat; captures D-20260721-03..06)

- **D1 RULED (D-20260721-03): Mumbai centre is SHUT DOWN** → option (a): row-1 label on all five
  pages = "Delhi NCR (Mehrauli · Siri Fort · Gurugram)"; Mumbai comes off the rows AND the T&C
  "Other locations … are Delhi and Mumbai" line.
- **D2 RULED (D-20260721-04): per-night villa rates** → option (a) verbatim: "Residential format at
  Kairali – The Ayurvedic Healing Village, Palakkad: per-night villa rates, all-inclusive of stay,
  meals, training & taxes — enquire for your villa category and dates." No numbers in the row.
- **D3 RULED (D-20260721-05):** validity sentence on all five pages = "Above rates applicable from
  1st Jan, 2026 to 30th September, 2027." (owner: "extend them till sept end 2027").
- **D4 RESOLVED by source:** TAP $495 is verbatim on Anupam's V2 sheet (19f7f1e76d9dbda1) — ships.
- **D5 RULED (D-20260721-06): AALCT stays** — no rename; h1/table/slug keep AALCT.

Follow-up mail to Sunaj staged with these wordings (owner sends); post-publish QA fetch diffs the
five live pages against THIS file including this section.

