# Drafted lines across the eleven new templates — for the owner's approve/replace (D-20260922-03)

Extracted by Claude Design on 2026-09-22 ~08:25 IST, no files edited. D = Desktop file, M =
Mobile file, L = line. Everything marked [TO CONFIRM] is an EMPTY SLOT (no text drafted); the
lines marked "Draft — approve or replace" are the tool's own sentences.

## Sentences the tool DRAFTED (the ones to approve or replace)

| Template | Where | Exact text |
|---|---|---|
| Past Retreat Record (D L40, M L44) | Karma Being Retreat 2019 standfirst | A record of a retreat held at the hospital in November 2019, kept for reference. |
| Past Retreat Record (M L267) | Archive variant standfirst | A record of past events at the hospital, kept for reference. |
| Past Retreat Record (M L276) | Archive banner | This page records past events. Its programmes, inclusions and notes are historical and must not be used for current bookings or travel planning. |
| Past Retreat Record (hero record card) | PAST RETREAT / 2019 / 14–24 November 2019 | Concluded. Not open for admission. |
| Offers (D L39, M L41) | Special Offers standfirst | Current care initiatives, deals and gift vouchers at the hospital. Every amount and validity window is confirmed by the patient care team before it is published here. |
| Offers (D L68, M L81) | Current offers and deals intro | Offer slots below. Each amount, inclusion and validity window is supplied by the patient care team. |
| Offers (D L170, M L180) | Gift vouchers intro | Voucher denominations, what they may be redeemed against, and how long they remain valid are supplied by the patient care team. |
| Offers (M L412) | The Baoli Special Deal standfirst | A single current deal at the hospital. Amount, inclusions and validity window are confirmed by the patient care team before publication. |
| Sitemap (D L36, M L37) | standfirst | (text being quoted by Claude Design — appended below when received) |
| Index Directory (D L55, M L52) | section heading | "Browse all packages" (per its desktop comment; exact quote pending) |
| Product Family (D L40, M L41) | Product Range standfirst + "Products are not sold on this site" line | (exact quote pending) — OWNER NOTE 2026-09-22: "we sell medicines on site" → this line must be reviewed against that before approval |
| Course and Fees (D L42, M L37; D L72, M L73) | standfirst; fees-table intro | (exact quotes pending) |
| Legal Policy (D L45, M L52) | Terms and Conditions standfirst | (exact quote pending) |

## Empty [TO CONFIRM] slots (no drafted text — facts to arrive)
- FAQs and Downloads: 3 download slots × (document title · file size · last updated · file link) per view.
- Sitemap: Media Gallery link broken in source; four Villa Gallery sub-entries have no destination.
- Defence: which forces; retired/ex-servicemen; family relationships; accepted proof; proof for family; checked at enquiry/booking/admission; how to claim; valid until; "Click Here" link target.
- Cancer Supportive Care: physician-wording standfirst; EUR/USD tariff tabs.
- Course and Fees: hero banner image; every fee/duration/schedule cell (being filled from the record's tariff dataset now — six courses, KAHR/AY-TRG/2026-2027/04/GBL); daily schedule sessions.
- Legal Policy (Mobile short-extreme frame only): H1, standfirst, last-updated, section count, 4 section titles + bodies (the record holds payment-policy-compliance — filled at apply).
- Offers: hero meta (prices/validity; reviewed on); 4 offer card titles/descriptions/validity; gift-voucher validity/redeemable-against; Elderly destination; two telephone numbers; bare list/chip slots (being filled from the record's offer pages now).

Claude Design's two scope notes: "No Preservatives has zero markers in either view — worth checking
that is genuinely complete rather than unmarked." and "Legal Policy's Desktop view carries only the
hero draft label; the full [TO CONFIRM] section skeleton exists in the Mobile file only, so the two
views are out of sync."

## Exact quotes received (Claude Design, 2026-09-22 ~08:50 IST, verbatim)

| Where | Exact text |
|---|---|
| Sitemap — standfirst | "Every page on this site, in one list. Sections follow the order of the main navigation. Type a word to narrow the list to the pages that match it." |
| Index Directory — section heading | Prop-driven, two drafted defaults: "Browse all collections" (sparse state) and "Browse all" (fallback when no sectionHeading is supplied) |
| Product Family — standfirst | "The medicines, organics, teas, books and equipment manufactured by the Kairali Ayurvedic Group. Each range is described here and ordered separately." |
| Product Family — not-sold line | "Products are not sold on this site. Each range links onward to its own page." — OWNER NOTE: "we sell medicines on site" |
| Course and Fees — standfirst | "Course structure, duration, schedule and fees for study at the Kairali Institute of Ayurveda and Panchakarma Therapy, with accommodation rates listed separately." — Claude Design flags "with accommodation rates listed separately" as contradicting the record (the rate IS the accommodation; no separate course fee) |
| Course and Fees — fees intro | WAS "Fees are quoted per course and cover tuition only. Accommodation is charged separately at the villa rates below." — REPLACED by Claude Design with the record's own basis note (per night, Deluxe Villa, single occupancy, all-inclusive) because it contradicted the tariff; draft label removed |
| Legal Policy — standfirst | "These terms govern bookings, admission, treatment and use of this website. Please read them before confirming a reservation or beginning a programme." |

## Slot fill from the record (D-20260922-04) — Claude Design's report, verbatim
> A. Course and Fees — all six courses filled, both views. Per-night INR 18,410 / USD 263 / EUR
> 230 shown as held, with duration, validity window and the KAHR source reference per row. No
> totals calculated. Hub row carries its umbrella note. Schedule cells and the daily timetable stay
> [TO CONFIRM] — the record holds no schedule.
>
> B. Offers — filled from the record's own pages, both views. Senior Wellness as the featured
> offer (title, description, "Up to 20% off", inclusions, who it applies to, conditions). Olympics
> and Defence as cards with their verbatim discount tiers and T&Cs. Baoli Special Deal shown as the
> record has it — body is a single dash, so the description is [TO CONFIRM] with the page's email
> and phone. Gift vouchers carry both record paragraphs plus the email and Call/WhatsApp number.
>
> Checks: block tags balanced in all four (69/69, 56/56, 230/230, 273/273); no expressions in
> template holes; no console output. Remaining markers — Course and Fees 8 each view, Offers 15
> desktop / 31 mobile, all genuinely uncovered by the record.
>
> Still open: offer validity windows and minimum stay (no record page states them), voucher
> denominations, the two telephone numbers on the Olympic and Defence journey cards, and the
> senior offer's claim procedure. The "Offers listed" counter now reads 4, reflecting what the page
> shows rather than a record figure — say if you'd rather it counted the six offer pages.

Explainer nav (D-20260922-01) — its decision, verbatim: "the injected nav moves below the article
on all eight routes, replaced by one consistent always-open 'More in the Knowledge Center' block
(no accordion — collapsing fails the same 45+ readers rule 9 protects), current page marked not
linked, plus prev/next. Everything live is retained verbatim underneath." Its veto ask: "reusing
the Knowledge Center list onto the four routes that lack it moves existing content between pages."
