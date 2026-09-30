# /offers/ — Offers, deals and gift vouchers (template family)

File: `AHV Template Offers Deals and Gift Vouchers Desktop.dc.html` (desktop, 1440)
Family: current offers, deals, gift vouchers. Extremes: `/the-baoli-special-deal/`, `/the-baoli-advert-box-deal/` (~64 words, 5 short lists each).
Status: desktop APPROVED 22 Sep 2026. Mobile built — `AHV Template Offers Deals and Gift Vouchers Mobile.dc.html`, two screens: /offers/ at 808 words, and the single-offer extreme (~64 words) modelled on The Baoli Special Deal.

## Register-violation flags — PRESENT IN SOURCE, ported verbatim, do not fix
- "guest" ×3 — "each guest is received with the same quiet respect"; "Every guest is assessed by a qualified physician"; "No two guests receive the same treatment".
- "Journeys" / "The Journey" ×3 — "Three Journeys. One Commitment." (eyebrow); "Three Journeys. One Commitment to Healing." (h3); "The Journey" (eyebrow above How Healing Begins).
- "wellness" — throughout ("Elderly & Senior Wellness Care", "Defence & Paramilitary Wellness", "select wellness packages", "Long-term wellness programs for veterans").
- "Luxury" — only in the fixed closing block, "World Luxury Award Winner" (award proper noun, permitted).
- None introduced by me. All new copy uses patient / physician / treatment / programme / admission.

## [TO CONFIRM] inventory (every figure slot — the record holds exactly one figure)
1. Hero rail: number of offers listed; reviewed-on date.
2. Featured offer: name, description, offer value, valid-until, minimum stay.
3. Deal-detail panels: inclusions ×3, who-it-applies-to ×2, how-to-claim ×2, conditions ×2.
4. Other current offers ×3: name, summary, validity.
5. Gift vouchers: three denominations, validity window, what they redeem against.
6. "Discover Elderly Wellness Care" — destination URL.
7. "Call Us For Program Details" ×2 — telephone number (none supplied; WhatsApp +91 92898 38797 is the only number I hold and the label says Call, so it is not substituted).
8. Baoli deals' figures — all.
The only figure carried from the record: "Up to 20% off on select wellness packages", inside the Senior Citizens list, in place.

## Drafted content inventory (marked "DRAFT — approve or replace" in page)
- Hero standfirst.
- "Current offers and deals" section intro line.
- Gift vouchers intro line.
- Structural labels I authored, not marked individually (they are scaffolding, not prose): section headings "Current offers and deals", "Other current offers", "Gift vouchers"; panel headings "What the offer includes", "Who it applies to", "How to claim", "Conditions"; "Featured offer" / "Offer" eyebrows; dl labels "Offer value", "Valid until", "Minimum stay".

## Ported-verbatim decisions worth recording
- Record copy reproduced word-for-word, emoji included, from "🌿 A Note from Kairali" to "No discounts. No urgency. Just honest guidance from people who care."
- Tag order normalised: the record lists "- For Senior Citizens" before the senior block and "- For Athletes" / "- For Defence & Paramilitary" after the athlete block. Each tag is rendered on its own initiative card. Placement only — no word changed.
- Emoji kept as decorative; every emoji span is `aria-hidden="true"` so screen readers get the text alone.
- ADJACENCY FLAG (owner ruling, 22 Sep 2026: leave both in place). The record's own closing section "Not Sure Which Program Applies?" sits immediately above the fixed closing block's "Not sure which programme fits?". Two near-identical invitations run back to back, on desktop and on mobile. Both are mandatory — the record copy is verbatim and the closing block is fixed — so neither is cut. On mobile the two are separated by the sand-filled panel and the white hairline band, which is the only device available to distinguish them. Carry this flag forward to any page in this family whose record ends on a similar invitation.

## Breadcrumb
Provisional (URL hierarchy): Home / Special Offers. Marked provisional in the page. Replace from `sitemap/sitemap-final.json` when it lands.

## Head contract
Verbatim from the record at apply — not yet transcribed into this file.

## Images
All image slots are labelled placeholders: hero banner 1440×300; featured offer 520×420; three offer cards; three initiative cards 300×260; gift voucher 380×280. Record assets go in at apply, downloaded and self-hosted under `assets/img/` — never hotlinked.

## Codex asks
- Confirm whether the three initiative blocks become individual landing pages; if so this template's featured-offer band is the single-offer layout to reuse.
- QA horizontal scroll at 360–1440 and the four-column grids at tablet widths.
- Supply the telephone number used by "Call Us For Program Details", or approve swapping the label to WhatsApp.

## Content-extremes note (asked for in the brief)
At the thin end — a Baoli page, ~64 words and five short lists — the featured-offer band plus the four deal-detail panels carry the page alone; the "Other current offers" grid, the jump-chip row and the record narrative all drop out, and the page still reads as a finished page rather than a stub. At the fat end the risk is the reverse: the four-across grids ("One Healing Philosophy", "How Healing Begins") and the two-across inclusion lists assume short card copy, so a page whose cards run to four or five lines each will make those rows tall and ragged — cap card body copy at roughly 160 characters or let those grids fall to two columns.

## Mobile layout — how it differs from desktop (not a squeeze)
- Hero rail (a 320px sidebar card on desktop) becomes a two-cell fact strip spanning the full width under the banner image.
- An action strip sits directly under that strip: Free Doctor Consultation + WhatsApp Patient Care, full-bleed and stacked, so the two live contact routes are reachable without scrolling the page.
- Desktop's jump-chip row becomes a plain "On this page" list, always visible, 48px rows. Built as a disclosure first; changed to always-visible so the in-page nav cannot start hidden, which also suits the 45+/55+ audience.
- The four deal-detail panels (a 2x2 grid on desktop) become a stack: "What the offer includes" is always visible, the rest are click-toggled disclosures with 56px summary rows. This is the main scroll saving on the thin-content pages, while the inclusions — the part patients look for first — are never behind a tap.
- The featured offer's three-cell `dl` becomes stacked label/value rows with the value right-aligned.
- "Other current offers" cards go from a three-across image-top grid to 110px-thumbnail list rows with a full-width Enquire Now bar underneath each.
- Initiative cards stack image-over-text; their two-column inclusion lists go single column.
- "How Healing Begins" goes from four cards across to a vertical numbered rail with a sand left rule.
- Closing block buttons go full-width stacked; the four trust items stay two-up at 15px.

## Mobile strain note (asked for in the brief)
The single-offer extreme holds because the accordion gives five titled rows of structure to a page with only sixty words of prose — but that same accordion is the strain point at the fat end: a page with more than about six panels turns the screen into a wall of closed 56px bars with no visible content between the hero and the closing block, at which point the first two panels should be forced open or the panels split under a second h2.

## Done-bar
- [ ] SEO head verbatim from record
- [ ] Link audit vs record
- [x] WCAG 2.2 AA: one h1, h1→h2→h3→h4 unskipped, 44px targets, 52px buttons, body 17–18px / lh 1.6+, no hover-only disclosure, no motion
- [x] Register-violation flag list (above)
- [x] Mobile view (390, two screens)
- [x] Self-checks 22 Sep 2026 — desktop and both mobile screens: one h1 each, h1->h2->h3->h4 with no skipped level, zero elements overflowing the page box (scrollWidth == width), zero tap targets under 44px, zero body-copy runs under 16px, no prose column over 700px. Only sub-16px text is the 13px uppercase image-placeholder label, which is scaffolding and does not ship.
- [x] Re-check after verifier fix, 22 Sep 2026 — three default-open disclosures were rendering closed; replaced with always-visible blocks. Both screens re-probed: inclusions panel visible, five in-page nav links visible on screen 1, one h1 each, no skipped heading levels, scrollWidth 390 == width, zero overflow, zero sub-44px targets.
- [ ] Codex checker pass
