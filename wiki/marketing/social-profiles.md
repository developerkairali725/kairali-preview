# Canonical social profiles — all Kairali entities (permanent reference)

Source of truth: **Anupam Singh Molpha's reply, 2026-07-20 17:26:39 IST** (mkt@ktahv.com,
cc ho.mkt@kairaliproducts.com; Gmail thread `19f7528b5b9fc4ab`), answering the owner's
18 Jul canonical-list request ("this list will be stored in our records as the permanent
reference for all current and future websites"). Attribution truth-up: the reply is
Anupam's — the 20 Jul evening chase sheet credited Astha.

The FLEET FOOTER set (D-20260718-04 parity = the KAG set) lives in
`packages/social/src/config.ts` — that file is the one place footers read from. This page
is the full per-vertical record for future vertical-entity sites.

## KAG (group — the fleet footer set)

| Platform | Canonical URL | Note |
|---|---|---|
| Instagram | **N.A** | KAG has no Instagram (the pre-true-up footers borrowed KTAHV's) |
| Facebook | https://www.facebook.com/KairaliGroup/ | |
| X/Twitter | https://x.com/Kairali_Group | the UNDERSCORE account — settles the 18 Jul two-accounts question |
| LinkedIn | https://www.linkedin.com/in/kairaliayurvedicgroup | ⚠ personal-profile FORM, bot-blocked (HTTP 999); footers ship the content-verified company page /company/kairali-ayurvedic-group — Q-SOCIALS-CANONICAL-WARTS |
| YouTube | https://www.youtube.com/@kairaliayurvedagroup | |
| Owned blog | https://whyayurveda.org/ | |

## KTAHV (Kairali – The Ayurvedic Healing Village)

| Platform | Canonical URL |
|---|---|
| Instagram | https://www.instagram.com/kairaliayurvedichealingvillage/ |
| Facebook | https://www.facebook.com/KairaliTheAyurvedicHealingVillage/ |
| X/Twitter | uses KAG account |
| LinkedIn | uses KAG account |
| YouTube | uses KAG account |
| Tumblr | https://www.tumblr.com/ayurvedichealingvillage |
| Substack | https://substack.com/@kairaliayurvedichealingvillage |
| Medium | https://medium.com/@ayurvedichealingvillage |
| Dailyhunt | ⚠ delivered as https://dhcreator.dailyhunt.in/ — a CREATOR-DASHBOARD login URL, not a public profile; never ship in a footer (Q-SOCIALS-CANONICAL-WARTS) |

## KAPPL (Kairali Ayurvedic Products)

| Platform | Canonical URL |
|---|---|
| Instagram | https://www.instagram.com/kairali_ayurvedic_products/ (delivered with `?hl=en`, stripped here as a UI param) |
| Facebook | https://www.facebook.com/KairaliAyurvedicProducts |
| X/Twitter | uses KAG account |
| YouTube | uses KAG account |

## Villa Raag

| Platform | Canonical URL |
|---|---|
| Instagram | https://www.instagram.com/Villaraag |
| Facebook | ⚠ delivered as a share-redirect: https://www.facebook.com/share/1CJoP2DggD/?mibextid=wwXIfr — resolve to the page URL before shipping in a footer (Q-SOCIALS-CANONICAL-WARTS) |
| LinkedIn | https://www.linkedin.com/company/villaraag/ |
| Pinterest | http://www.pinterest.com/villaraag (delivered as http — normalize to https when shipped) |
| YouTube | https://youtube.com/@villaraag (delivered with a `?si=` share-tracking param, stripped here) |
| X/Twitter | https://x.com/raagvilla |

## Change law

Footer changes happen in `packages/social/src/config.ts` ONLY (one-file true-up,
`footer-socials-lint.mjs` enforces). This page changes only on a new written marketing
true-up; log the thread id and date when it does.
