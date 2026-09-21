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

## 2026-09-21 — "30%" → "20%" on the defence/paramilitary offer (owner-authorised, resolves a parked gate)

- **Authority:** Abilash, in-chat, 2026-09-21, answering a direct question: *"20% is real — fix the
  30s in the copy"*, slug untouched.
- **What made it answerable without guessing:** the two SIBLING offer pages were measured first.
  `/offers/senior-citizen-offer/` reads "Up to 20% Off"; `/offers/olympics-and-paralympics-offer/`
  reads "Up to 20% OFF" with tiers 10% / 15% / 20% by nights; the defence offer page's own H1 reads
  "upto 20% OFF" with the identical tiers. **All three destination pages say 20 with the same
  structure.** The 30% survived only in the defence long-form body and in the shared offer band.
- **Strings changed (8):**
  - `article-family-data.js` ×2 — `Kairali is offering 30% discount enchantingly on all our
    treatment packages` → `… offering up to 20% discount …`
  - `article-family-data.js` ×2 — `Kairali will provide up to 30% discount on Booking amount only.`
    → `… up to 20% …`
  - `campaign-family-data.js` ×2 — the offer band figure `"30%"` → `"20%"` (desktop + mobile)
  - `campaign-family-data.js` ×2 — `Up to 30% Off for Senior Citizen, Olympic and Paralympics
    Athlete, Defence and Paramilitary Personnel` → `Up to 20% Off …` (and the `Upto` variant)
- **Rendered on:** `/defence-and-paramilitary-forces/` and `/ayurveda-retreat-kerala.html`. Both
  prerendered snapshots re-rendered — the payload alone would have left crawlers reading 30%.
- **A PARKED GATE, now closed.** `article-family-data.js` carried its own governance record of this
  exact discrepancy: `discountWording.ruling` preserving both phrasings, and a privateGate reading
  *"30% body and up-to 30% terms differ; preserve both exact source statements pending current
  business confirmation."* Today's ruling **is** that business confirmation. The metadata itself is
  left byte-identical: it describes the LIVE SOURCE, which still says 30, and that remains true.
- **NOT changed, deliberately:** the slug `/offers/defence-paramilitary-personnel-get-upto-30-off/`
  (a live ranking URL — changing it is a redirect, not an edit, and the owner ruled it stays); the
  `30%` non-refundable deposit in `hist9-family-data.js` (a deposit is not a discount); a CSS
  `min(112px,30%)`; and the 9 `Get Upto 30% OFF` strings on `/testing/`, a noindex placeholder page
  carrying Études boilerplate — reported every run, and whether that page ships at all is its own
  question.
- **LIVE WILL DISAGREE UNTIL SOMEONE UPDATES IT.** The WordPress site still says 30% on both
  surfaces. Until Deepu changes it, the rebuild and live differ on a discount figure — that is the
  intended direction of travel, not a defect, but it is worth knowing before the flip.
- **Verification:** sweep over the two changed routes plus two sibling offer pages, 8/8 states pass
  the accepted-baseline bar (0 errors, 0 overflow, 0 broken images, 0 iframes); 0 snapshots left
  carrying a 30% discount claim. The computed-style benchmark was NOT run and should not be: its
  own documentation excludes text from the fingerprint and assigns body text to the sweep, and
  reflow risk is covered by the sweep's overflow check at four widths.
