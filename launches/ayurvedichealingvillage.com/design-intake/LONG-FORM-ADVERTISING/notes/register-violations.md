# Register and verbatim deviations — long-form advertising

## 2026-09-20 — "3 Lacs" -> "300,000" (owner-authorised deviation from verbatim)

- **String:** `Kairali has performed more than 3 Lacs Treatments with an 87% satisfactory rate`
- **Changed to:** `... more than 300,000 Treatments with an 87% satisfactory rate`
- **Instances:** 6, all in `public/ahv/assets/campaign-nine-data.js`
- **Rendered on:** /wellness-resort-kerala.html, /kairali-cleansing-centre.html
- **Authority:** Abilash, long-form advertising handover item 3, 19 Sep 2026. The handover names
  the string as verbatim live copy under its standing rule 1 and records that the owner called it
  out anyway, so the deviation is authorised and logged here to keep the SEO diff explainable.
- **NOT changed:** the "87% satisfactory rate" in the same sentence. An unsourced outcome claim on
  a hospital page is a HARD GATE 7 item for Dr. Deepu John, not a copy edit, and rewriting around
  it would make the sentence read as freshly approved when it has not been.

## 2026-09-21 — two lapsed certificates RETAINED in chapter 06 (owner-authorised exposure)

- **Documents:** `ISO 9001:2015 certificate` (no. KDACQ202202073, printed valid through
  **2025-02-16**) and `Ayur Diamond certificate` (order M3-7700/2023, printed period *"3 years from
  24.07.2023"*, i.e. through **2026-07-24**). Both printed dates are past as of 2026-09-21.
- **Also on the record, from the dataset itself:** `accreditations-data.js` carries a
  `sourceConflicts` entry stating that the page body and metadata claim a current ISO and Green
  Leaf while the held document images do not prove either renewal.
- **Decision:** RETAIN both in chapter 06 of the long-form advertising route.
- **Authority:** Abilash, in-chat, 2026-09-21, answering a direct question that offered holding
  them out. His reasoning stands on the record: they are on the live site today, which makes this
  verbatim-live-copy territory, and the exposure is to be logged rather than silently removed.
- **The concern that was raised and overruled, recorded so it is not re-litigated:** an expired
  ISO badge leading a trust section on a NABH hospital's largest advertising surface is a claim
  class that can cost more than it earns, and it is a HARD GATE 7 item either way.
- **What would close it:** the renewal certificates. Neither has been produced to this repo. Until
  they are, `english-candidate/long-form-award-set.json` carries `lapsedToday: true` and
  `retainedByOwnerRuling: true` on both rows, and the tool re-evaluates the dates on every run.
- **Not affected:** NABH (AH-2024-0250, valid through 2027-04-24) and the clinical-establishment
  provisional registration (through 2028-05-02) are both current. The first run of the tool
  reported the 2028 registration as lapsed; that was a date-parsing fault in the tool, fixed and
  pinned, not a fact about the document.
