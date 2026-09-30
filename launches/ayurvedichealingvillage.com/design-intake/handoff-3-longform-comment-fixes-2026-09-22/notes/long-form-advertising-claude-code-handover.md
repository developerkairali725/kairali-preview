# Long-form advertising landing family — Claude Code handover
Packaged 19 Sep 2026. Unpacks into `launches/ayurvedichealingvillage.com/design-intake/LONG-FORM-ADVERTISING/`.

## What this is
The template for the long-form advertising landing family — **368,721 impressions, the biggest search surface on the site**. One DC holds two real routes behind a review switcher in the top strip, chosen to bracket the family's length extremes: a 3,506-word / 53-heading page and a 189-word page with no images.

The design problem is navigation of length. The answer, and the thing to preserve through every change below:
- 53 live headings collapse into **14 numbered chapters**, each opening with the identical pattern — bronze number + role label → Marcellus 34px H2 → optional 17px sub-line → body.
- A **sticky scroll-spied index rail** (264px, numbered 01–14) with the **consultation card pinned beneath it**, so enquiry is one click from anywhere. The rail scrolls internally and never pushes the card off screen.
- The rail is **suppressed** when a route has fewer than 3 chapters. That is why the 189-word route does not read as padded. Design decision, not a missing element.
- Persuasion is by specificity only. **No urgency, no scarcity, no countdown, no interstitial.** This is a hospital.

## Files
```
AHV Template Long-Form Advertising Desktop.dc.html   the view
AHV Chrome Header.dc.html / AHV Chrome Footer.dc.html
support.js
assets/img/ppc/…                                      22 images, all referenced, all present
notes/long-form-advertising-family-page.md            sidecar: register flags, head contracts, open gaps
```

## Routes
| Route | Words | Live shape | State in the DC |
|---|---|---|---|
| /wellness-resort-kerala.html | 3,506 | 67 images, 53 headings, 184,480 impressions | default tab, built in full |
| /offers/defence-paramilitary-personnel-get-upto-30-off/ | 189 | no images, 1 list, 1 CTA | tab 2, built in full |
| /weight-loss.html | 2,772 | **116 images, 110 headings** | NOT BOUND — bind against this template |
| /preventive-rejuvenation-detoxification.html | — | **117 headings** | NOT BOUND — bind against this template |

Source of truth for both built routes: the local source kits at
`AHV-ENGLISH-ALL-PAGE-KITS-CLAUDE-READY-2026-09-01/phases/phase-02-tier-1-campaign-ppc-offer-16-pages/pages/{16-wellness-resort-kerala-html, 07-offers--defence-paramilitary-personnel-get-upto-30-off}/content/body.html`.

## THE REGISTER RULE — read before writing a single word
`/wellness-resort-kerala.html` contains a banned word. **The URL is legacy and cannot change. The word must never appear in any copy you write.** Every on-screen occurrence today comes from verbatim live body copy retained for SEO. The breadcrumb reads "Wellness in Kerala"; the switcher labels the route by filename only. Keep it that way in every new route you bind, every label, every alt text, every commit message that lands in user-visible copy.

## Owner comments to action (Abilash, 19 Sep 2026)
Numbered so you can tick them off. 1–4 are content updates and need the owner's current data — ask for it, do not invent.

**1 · Programmes list, chapter 08 (`#c8`) — "update the names and offering as per latest".**
The three columns currently carry the 27 programme names verbatim from the live page. They are stale. Replace with the current programme set and current naming, taken from the live `/treatment-programs/` hub or whatever list the owner supplies — not from this page. Keep the three-column hairline-list layout and the alphabetical-free, owner-given order. Every programme name must resolve to a real route; add hrefs while you are in there (today they are plain text, matching live).

**2 · Awards, chapter 06 (`#c6`) — "update them accordingly and reorder".**
27 awards are currently rendered: 7 as image cards (the badges we self-hosted), 20 as a hairline `<dl>`. Two jobs: refresh the set to current (2025/2026 additions, drop anything retired) and reorder — owner wants most recent and most credible first, which means **NABH accreditation leads**, then current-year awards, then the historic list. Keep the split: image cards for the ones with badges, `<dl>` rows for the rest. Badge images for anything new must be downloaded and self-hosted (rule 6, never hotlink).

**3 · "3 Lacs" → international numerals. — DONE 22 Sep 2026 (desktop + mobile).** Two places, and they are different cases:
- Credential strip under the hero: "3 lakh treatments performed". **This is our copy** — change it outright to "300,000 treatments performed".
- Chapter 05 band: "Kairali has performed more than 3 Lacs Treatments with an 87% satisfactory rate". **This is verbatim live copy**, protected by standing rule 1. Owner has called it out, so change it to "300,000" — but record it in `notes/register-violations.md` as an owner-authorised deviation from verbatim, with the date, so the SEO diff is explainable. Also note: the 87% figure is an unsourced outcome claim on a hospital page. Get it sourced or qualified before publication.

**4 · Tripadvisor link, credential strip — "should be a sales type tripadvisor, not vanilla".**
Today it is a plain text link. Replace with a real Tripadvisor rating lockup: owl/logo mark, numeric score, bubble rating, review count, "Read reviews" target. Pull the live score and review count at build time (or embed Tripadvisor's own widget if the owner accepts the third-party script — check the cookie/consent position first). It must stay ≥44px and keep AA contrast, and it must not autoplay or shift layout.

**5 · Hero image is too dark.** The banner is the live `ppc/web/Layer 8-min.jpg`, self-hosted at `assets/img/ppc/hero-layer8.jpg`. Do not solve this with a CSS brightness filter. Either grade the source file properly, or replace it with a brighter Kairali-Image-Library frame of the same subject. Same applies to the offer route, which is currently borrowing this banner (see ask 7).

**6 · The Lakshya yoga film is stellar — reuse it.**
`https://res.cloudinary.com/n2fdigital/video/upload/v1662979200/Lakshya_Yoga_Retreat_-_KAIRALI_VERSION_-_Final_full_film_w_changes_hylhha.mp4`, poster `assets/img/ppc/yoga-video.jpg`. Owner wants it in the yoga section of the main pages, not only here. Put it on: `AHV Page Yoga Retreats`, `AHV Page Yoga Meditation Program(s)`, `AHV Page Ayuryoga`, `AHV Page Lakshya Yoga`, `AHV Page Yoga Stress Reset`, and the yoga block of `AHV Page All Programs` — desktop and mobile. Same treatment everywhere: poster image, click-to-play, no autoplay, real `<video>` or a click-through, never an auto-loading embed (rule 9, audience 45+/55+).

**Status 22 Sep 2026.** Item 3 is applied in both views (`#c5` / `#m-c5` band and the credential strip) and logged in `notes/register-violations.md` as an owner-authorised deviation from verbatim. Items 1, 2, 4, 5 are still blocked on owner data or asset work and are unchanged on screen. Item 6 is a build ask for other pages, not this template.

## Codex / build asks carried from the sidecar
7. **Enquiry endpoint is unknown.** The live form posts through page JS; the record exposes no action URL. The template posts to the route URL as a placeholder with the **exact live field names preserved** — `fname`, `rdogender` (Male/Female), `phone`, `email`, `country`, `message`, `result` (captcha answer), `chkAgree`. Wire the real handler and captcha before build. Rule 8: real endpoints, exact names.
8. **Offer hero missing.** Download `/wp-content/uploads/2024/10/army-2.jpg` and self-host; the offer route is borrowing the wellness banner today.
9. **Remaining images.** 22 of the route's 67 assets are local. Still outstanding for full parity: 9 feature icons, 3 post-treatment icons, 20 award badges, the mobile step diagram, the tripadvisor/google lockups, 6 slideshow frames. Everything currently on screen is real and local.
10. **30% vs 20%.** The offer slug says 30%, og:title says 20%, the body caps at 20%. Resolve before porting.
11. **JSON-LD is wrong on the wellness route** — its `@graph` describes `/ayurvedic-treatments/`, not itself. Correct to self or drop it.
12. QA at 1280 / 1440 / 1920 and 200% zoom, specifically the rail collapse point and the rail's internal scroll at 110+ chapters.

## Head contracts
Verbatim in `notes/long-form-advertising-family-page.md`. Note: wellness route emits **no canonical**; offer route is **noindex, follow**.

## Live interactions deliberately removed
Two "Read More" toggles (text now shown in full), per-villa currency tabs (all three currencies in one `<table>`), awards carousel, testimonial carousel, hero slideshow. Rule 9: no hover-only disclosure, no autoplaying carousels, audience is 45+/55+. Do not reinstate them.

## Open owner decisions
1. Current programme list and current award list — blocking items 1 and 2.
2. Standard frozen footer on advertising routes, where live deliberately strips navigation — confirm.
3. Source or qualifier for the 87% satisfaction claim.
4. Register violations in the verbatim live copy ("resort", "spa", "retreat", "getaway", superlatives, exclaiming headings) — listed in the sidecar, not fixed without sign-off.

## Not in scope of this drop
Mobile view. Desktop is out for approval first, per standing rule 4.
