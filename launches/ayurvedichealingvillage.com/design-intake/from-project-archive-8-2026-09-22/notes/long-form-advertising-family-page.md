# Long-form advertising landing family — desktop template
File: `AHV Template Long-Form Advertising Desktop.dc.html` (one DC, two real routes behind a review switcher)
Status: DESKTOP DRAFT — awaiting owner approval. Mobile not started (standing rule 4).
Source: local source kits, `AHV-ENGLISH-ALL-PAGE-KITS-CLAUDE-READY-2026-09-01/phases/phase-02-tier-1-campaign-ppc-offer-16-pages/pages/` (16-wellness-resort-kerala-html, 07-offers--defence-paramilitary-personnel-get-upto-30-off). No live fetch needed — kits are COMPLETE and carry `content/body.html` verbatim plus `assets/current-by-url/`.

## Family and why the two bound routes
368,721 impressions across the family — the biggest search surface on the site.

| Route | Words | Live shape | Rendered state |
|---|---|---|---|
| /wellness-resort-kerala.html | 3,506 | 67 images, 53 headings, 184,480 impressions | default tab |
| /offers/defence-paramilitary-personnel-get-upto-30-off/ | 189 | no images, 1 list, 1 CTA | tab 2 |
| /weight-loss.html | 2,772 | **116 images, 110 headings** | NOT YET BOUND |
| /preventive-rejuvenation-detoxification.html | — | **117 headings** | NOT YET BOUND |

The two bound routes are the length extremes. The two 110+ heading routes are the next stress test and need their own pass (see Open gaps).

## The system — navigation of length
- **Chaptering.** 53 live headings collapse into 14 numbered chapters. Every chapter opens the same way: number + role label (bronze, 11.5px, 2.4px tracking) → Marcellus 34px H2 → optional 17px sub-line → body. The rhythm is strict and identical 14 times, so a 100-heading page reads as a list of 14 places, not noise.
- **Persistent index.** Sticky 264px left rail, numbered 01–14, scroll-spied (active item gets a bronze left rule, white ground, 700 weight). The rail scrolls internally, so it never pushes the consultation card off-screen. It renders only when the route has ≥3 chapters — the 189-word route gets no rail at all, which is why the short page does not feel padded.
- **Persistent CTA.** The consultation card is pinned below the rail and never scrolls away: heading, one line of reassurance, marigold "Request a consultation" (jumps to chapter 14), phone number. No fixed bottom bar, no interstitial, no timer. Persuasion is by specificity — NABH accreditation, 103 countries, 3 lakh treatments, 87% satisfaction, 27 dated awards, named patients with dates and cities. Nothing on the page implies scarcity or deadline.
- **Repeating rhythm below chapter level.** Three card shapes only: plain white card (features, post-treatment care, reviews), 96px-image + text card (awards, press), and full-width image + text + tariff table (villas). Statements of price or claim always sit in the same bronze-left-rule white band with the CTA on its right.
- **Measure and scale.** Body 18px / 1.75, prose capped at 68ch; lists and grids use the full column. Ink #2A2118 on ivory #F7F4EA. Section rules #EAE3D2 above every chapter — same metronome as the knowledge-explainer family.
- **Long-page relief.** Two full-bleed-ish moments only: the Hannah pull-quote (bronze rule) in chapter 01 and the Thomas Paul account on ink ground in chapter 03. Everything else is on ivory.
- **Short-page strategy** (189 words): hero band + 21px lead paragraphs + T&C as a hairline list + a sticky right-hand "discount by length of stay" card built from the T&C numbers already in the copy. No invented body copy.

## Register handling — the "resort" rule
The URL /wellness-resort-kerala.html is legacy and unchangeable. **The word does not appear in any copy written for this page.** Every occurrence on screen comes from verbatim live body copy, which stays for SEO. Breadcrumb reads "Wellness in Kerala"; the review switcher labels the route by filename only.

## Copy handling
Body copy below the hero is VERBATIM from the source kits on both routes — including "resort", "spa", "luxury", the "Read More" hidden text (now shown in full: rule 9 bans hover/click-only disclosure), the doubled sentences, and the typos ("Last Visted", "quite and peaceful mind", "therapeuts", "wellness.Kairali's").

Live interactions removed, content preserved: the two "Read More" toggles (text inlined), the currency tabs on each villa (all three currencies shown as a table), the awards carousel (grid of 7 + a hairline `<dl>` of the remaining 20), the testimonial carousel (5 cards), the image slideshow (single hero band).

Written by me, marked for approval:
1. Standfirst on both routes (Hero C requires one; live has none).
2. Chapter role labels ("01 · Setting", "02 · The hospital" …) and rail labels — navigation furniture, not body copy.
3. Chapter 09 H2 "In their words", chapter 11 H2 "Testimonials and press" — the live page has no heading over these blocks.
4. Enquiry-form field labels and the line "Send your details and a physician will review them before replying. No payment is taken at this stage."
5. Credential strip under the hero (NABH / 103 countries / 3 lakh treatments / 87%) — all four figures are verbatim claims from the page body, re-stated once at the top.

## Register-violation flags (brand §12.2 — all inherited from verbatim live copy, do not fix without owner sign-off)
- "resort" / "WELLNESS RESORT" / "Ayurveda Resort" / "health resort" / "luxury resort in kerala" — banned word, ~15 occurrences, all verbatim.
- "spa", "Ayurvedic spa services", "AYURVEDA WELLNESS SPAS", "Best Destination Spa" (award titles) — banned register.
- "retreat" / "Ayurvedic Healing Village is a genuine Ayurvedic healing retreat" / "Book My Ayurvedic Retreat" / "Villas at the Retreat" — leisure register.
- "getaway", "transformative getaway", "Hip Getaway" — banned.
- "opulent", "elite", "world-class", "finest", "the best in this field", "India's Safest, Most Trusted" — superlatives / absolute claims.
- "relax", "unwind", "rejuvenation", "pamper"-adjacent verbs throughout.
- "Let us head towards a disease-free world, hand in hand!" and "This explains why our former clients continue to return!" — exclaiming copy, banned.
- "clients" used for patients throughout.
- "Kairali has performed more than 3 Lacs Treatments with an 87% satisfactory rate" — unsourced outcome claim; needs a citation or a qualifier before publication.
- My own added copy uses the clinical register only (patient, physician, programme, consultation, treatment).

## Head contract (verbatim from the kits, for Codex)
- /wellness-resort-kerala.html — title "Best Wellness Resort in Kerala for Ayurveda & Holistic Healing"; description "Experience the best wellness resort in Kerala with Ayurvedic therapies, yoga, and holistic healing at Kairali Ayurvedic Healing Village in Palakkad."; robots index, follow; **canonical: none emitted by live**; og:type website, og:url self, og:image `ppc/web/Layer%208-min.jpg`, og:locale en_US; twitter summary_large_image. Note: the page's JSON-LD @graph describes **/ayurvedic-treatments/**, not this URL — a live bug, flagged, do not copy forward without a decision.
- /offers/defence-paramilitary-personnel-get-upto-30-off/ — title "Ayurvedic Wellness for Defence & Paramilitary Forces – Kairali"; **robots noindex, follow**; canonical none; og:type article, og:title "Defence &amp; Paramilitary Personnel get upto 20% OFF" (note: og says 20%, the slug says 30%, the body caps at 20%), og:image `/wp-content/uploads/2024/10/army-2.jpg` 600×380; modified 2026-07-03.

## Codex asks
1. **Confirm the enquiry endpoint.** The live form posts through page JS; the record does not expose an action URL. The template posts to the route URL with the exact live field names preserved — `fname`, `rdogender` (Male/Female), `phone`, `email`, `country`, `message`, `result` (captcha answer), `chkAgree`. Supply the real handler and the captcha source before build (rule 8).
2. **Download the offer hero.** `/wp-content/uploads/2024/10/army-2.jpg`; the offer route currently shows the wellness banner as a substitute. Self-host, never hotlink.
3. **Remaining images.** 22 of the route's 67 assets are self-hosted in `assets/img/ppc/`. Still needed if the owner wants full parity: the 9 feature icons, the 3 post-treatment icons, the 20 remaining award badges, the mobile step diagram, the tripadvisor/google review lockups, and the 6 slideshow frames. Everything on screen today is real and local.
4. **Resolve the 30% / 20% discrepancy** in the offer slug vs og:title vs body before porting.
5. **JSON-LD:** the wellness route emits schema for a different URL (see head contract). Decide: correct it to self, or drop it.
6. Bind /weight-loss.html and /preventive-rejuvenation-detoxification.html against this template and QA the rail at 110 and 117 headings.
7. QA at 1280 / 1440 / 1920 and 200% browser zoom (rail collapse point).

## Open gaps
- Breadcrumb chains are provisional (URL hierarchy) pending `sitemap/sitemap-final.json`. Wellness sits under /ayurvedic-treatments/, the offer under /offers/.
- The two 110+ heading routes are unbound. The 14-chapter rail is designed to absorb them, but the chapter map for each has to be written by hand from their headings.json.
- The live page's WhatsApp pulse button, the Google Maps iframe and the PPC-only footer are not carried over — frozen Home chrome is used instead (rule 5). Confirm the owner wants the standard footer on advertising routes, where the live page deliberately strips navigation.
- Video testimonials link out to YouTube as on live; no embedded autoplay (rule 9).

## Done-bar
- SEO head contract captured verbatim above · link set taken from the kits' body (tripadvisor, whyayurveda.org ×3, youtube ×4, cloudinary film, privacy/terms/cookie, tel:, /awards-and-accreditations.aspx, /enquiry-form/) · WCAG 2.2 AA: body 18px, line-height 1.75, every target ≥44px, no hover-only disclosure, no carousel, no autoplay, visible focus ring, tariff data in real `<table>` with scope, form fields labelled, marigold CTA 8.3:1 on ink text · register flags listed above.
