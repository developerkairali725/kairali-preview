# Canonical-facts context — theblushlounge.com Gate-1 pre-content review (fed to both auditors via --context)

Compiled 2026-07-18 19:03:04 IST for design-review batch 2. Template: the kairalicenters context-rulings file.

**BINDING POLICY — D-EXTREVIEW-OWNER-FACTS (DECISIONS.md, Abilash, 2026-07-18 18:55:33 IST, verbatim):**

> OWNER-CONFIRMED FACTS ARE AUTHORITY in external AI design reviews. Every review run attaches a canonical facts sheet (relevant DECISIONS rulings + @kairali/facts); reviewer doubt on owner-confirmed facts is ADVISORY, never a blocking FAIL; the owner's signature remains the deciding judgment.

If your only concern with an element is doubt about a fact listed below, record it as an ADVISORY note (recommendations), not a blocking finding. Note also: this is a PERSONAL-BRAND site for a private professional — several facts (press features, collaborations) live in her IG bio and press coverage, not in corporate registries; failure to find them in public databases is not evidence of falsity.

## 1 · Owner rulings (DECISIONS.md, 18 Jul 2026, verbatim)

> D-BL-INTERIM: theblushlounge BUILDS THIS WEEKEND using images from IG @blushlounge_sneha as interim assets (owner-authorized); hi-res originals of the two sets replace them later. Scraped assets pass rule-(r) security screening.

> D-BL-WHATSAPP: theblushlounge chat CTA number = +91 88269 21110 (the contact-page match; the ...21114 variant is wrong).

> D-BL-BUBBLE-EXEMPT: theblushlounge.com is EXEMPT from the fleet chat bubble — Sneha's own WhatsApp (+91 88269 21110) is the chat CTA; loud registry exemption, not a silent skip.

Consequences for this review:
- The hero portrait is an **owner-authorized INTERIM IG-sourced image** (a 640px reel poster upscaled ~1.2× at desktop — the artifact flags this itself). Resolution/watermark notes are ADVISORY: the hi-res shoot sets replace it by ruling, and the swap is already planned. Judge the composition and direction.
- Do NOT demand a chatbot/group chat bubble — the exemption is an owner ruling. "WhatsApp Sneha" (+91 88269 21110) IS the chat lane.

## 2 · The /academy discovery (mined 18 Jul — new since the legacy site)

Sneha now runs an education arm that did not exist when the old site was built: **Blush School of Beauty** (IG @blushschoolofbeauty — online classes, PRO courses, masterclasses). The STRATEGY sitemap gives it a dedicated **/academy** page (Course schema, separate academy_enquiry funnel). The hero mockup is the HOMEPAGE hero only — academy presence lands in nav/teaser at build per the approved sitemap; its absence from the hero frame is not a gap.

## 3 · Locked facts for this site (BRIEF table, provenance mined 18 Jul + owner rulings)

- Sneha Chowdhary — Blush Lounge, "Makeup by Sneha": Beauty, Bridal & SFX artist, Delhi + worldwide (her bio's words). Studio address: Shivalik, New Delhi.
- Verified IG **@blushlounge_sneha, 65.2K followers** (captured 18 Jul).
- **Internationally certified: Cinema Makeup School, Los Angeles** (IG bio); **MAC Bridal collaboration**; **Femina + Grazia features** — the press trust bar in the mockup (MAC Bridal · Femina · Grazia · Cinema Makeup School LA) carries exactly these owner-trusted mined credentials; destination work across Bali, Budapest, London, Bodrum, Hong Kong, Cannes.
- Headline "Soft glamour, precise drama." is DERIVED FROM HER OWN captions ("soft glamour with just the right amount of drama"; "softness takes just as much precision as drama").
- **NO prices anywhere by design** (no trusted price source exists; HARD GATE 6) — price-on-enquiry until Sneha supplies figures. Do not demand a price list.
- Email makeoverbysneha@gmail.com and hours 10:00–22:00 carry CONFIRM-before-launch flags in the brief — they are deliberately absent from the mockup.

## 4 · What the mockup is (and is not)

- HTML mockup rendered to committed real pixels: desktop 1440×900 + mobile 375×812 (zero horizontal overflow verified at 375). This is the MODE B design_direction approval object — the golden page (homepage) is built only after the owner signs.
- Register E (Expressive personal brand — SITE_DESIGN_LOCALE_REGISTER.md): no KTAHV clinical lock, no banned-word list. Champagne/ivory/ink tokens are sampled from HER existing brand assets (gold-foil logo, studio-wall photography); Fraunces/Montserrat/Allura echo her press register, wordmark, and monogram. Google-Fonts delivery in the mockup; production self-hosts.
- The logo lockup is a TYPE STAND-IN (only a 499×401 raster logo exists; vector is an open owner ask).
- Conversion design: WhatsApp-first (the niche funnel is IG discovers → Google captures → WhatsApp closes). No cart/checkout ever — enquiry + WhatsApp only.

## 5 · GATE-2 PASS-2 ADDENDUM (2026-07-18 23:05:00 IST — facts for the post-build re-vet; vet against PIXELS)

- **The footer ships NO email and NO hours — BY DESIGN** (the §3 confirm-before-launch flags). Pass-1 claims that the footer showed makeoverbysneha@gmail.com and working hours were **false against the bound screenshots** (verified pixel-level; on record in QUESTIONS.md Q-BL-BATTERY-HALLUCINATION). The footer contact lanes are: WhatsApp +91 88269 21110, @blushlounge_sneha, @blushschoolofbeauty, plus the Shivalik, New Delhi address line.
- **Consent banner truth (implementation evidence, not a guess):** Google Consent Mode v2 with default-DENIED inline snippets rendered BEFORE any tag loader (@kairali/consent ConsentScripts); NO GA4/GTM measurement IDs are configured for this site yet, so no analytics loader ships at all; localStorage is written only when the visitor chooses. "Nothing is stored until you choose" is accurate for this deployment.
- **Pass-1 fixes now in the pixels:** the layout reserves the banner's height while it is open (consent package's data-consent-open hook) — the four trust marks AND the photo credit are visible pre-choice on desktop; the mobile over-image CTA carries the full number "WhatsApp Sneha · +91 88269 21110"; the services lede reads "Your enquiry goes straight to Sneha — one conversation to plan everything…" (the prior one-on-one-delivery absolute was replaced with the verifiable conversation-with-her claim — her own number, D-BL-WHATSAPP); the hero credit is a tappable IG link.
- **Academy poster date fact:** the baked-in date reads **"30th August 2026"** — a real, FUTURE masterclass at review time (both pass-1 auditors misread it). A post-event swap flag is logged in the site's IMAGE_MANIFEST.md. An upcoming-event poster inside the academy section is accurate content, not staleness.
- **WhatsApp prefill evidence:** wa.me/918826921110?text=Hi%20Sneha%20—%20I'd%20like%20to%20enquire%20for%20my%20date. (chrome.tsx WHATSAPP_URL — code-verifiable).
- **Lighthouse A5 evidence now exists:** perf 92 · a11y 100 · seo 100 (launches/theblushlounge.com/lighthouse-2026-07-18.md; contrast/heading/label fixes documented there).
- **STRATEGY.md §6 now declares** the signature MCB + anchor secret desire, the avatar block, the NDFF source (declared inference pending Sneha ratification — riding item), and the page's SBJ stage.
- **Mobile CTA architecture is a judged, on-record resolution** (QUESTIONS.md Q-BL-MOBILE-CTA-CONTRADICTION): over-image action + in-flow pair, no third sticky bar. Re-litigating this axis without new evidence is a conduct finding, not a design finding.

### Pass-3 additions (2026-07-18 23:20:00 IST)

- **Longevity copy is intent-register, not a performance guarantee** (pass-2 truth fix): the hero lede reads "a look **made to last** from the first photograph to the last dance"; the bridal card reads "looks **made to** photograph true and hold". Design-intent claims in her own caption voice — no wear-hour or guaranteed-outcome claim anywhere.
- **Pass-2's mobile gray-placeholder finding was an EVIDENCE defect, not a page defect:** the full-page capture was stitched before `loading="lazy"` images loaded. The pass-3 captures scroll the full page and wait for every image's `complete` flag before shooting. The rendered tiles are in the pass-3 pixels.
- **ADVISORY-LANE REMINDER (binding, D-EXTREVIEW-OWNER-FACTS — quoted at the top of this file):** press features (MAC Bridal · Femina · Grazia), Cinema Makeup School LA training, destination-city list, and the WhatsApp number are OWNER-LOCKED facts in §1/§3. Doubt about them is ADVISORY BY POLICY and may not ground a blocking FAIL. A verdict that blocks on owner-locked facts contradicts the attached binding policy.
- **Link behaviour is code-verified evidence** (this sheet §5): wa.me prefill URL and the credit's IG href with data-cta events are in sites/theblushlounge.com source. Screenshots cannot show hrefs; the source is the artifact of record for them (checklist scope: elements vettable from screenshots; link plumbing is vetted from source + the A5/factory spec runs).

### Pass-5+ additions (2026-07-18 23:45:00 IST)

- **"PRO certification course" is HER OWN mined vocabulary, verbatim:** her IG bio line reads "Pro Certification @blushschoolofbeauty" and her highlights carry "PRO Course'26 / PRO Course" (content-mined/theblushlounge.com/instagram-2026-07-18/profile-capture.md, captured 18 Jul 2026). The academy bullet mirrors the subject's own product naming — it invents no accrediting body and claims none. Doubt about her own product's name is advisory-lane by policy.
- **Copy truth-fixes landed after pass 4:** services H2 now "One conversation, your whole occasion." and the closing line "One conversation, no forms to fight." — the absolute-delivery reading two reviewers flagged is gone; every involvement claim on the page is now a conversation claim (verifiable: her own number, D-BL-WHATSAPP).
- **Mobile trust-bar + banner evidence:** the capture set includes a dedicated mobile viewport frame scrolled to the trust-mark row WITH the consent banner open, proving non-occlusion on mobile (the checklist-15 pixel proof GPT requested at pass 5).
- **The footer carries NO Kairali credit of any kind** — its full contents, pixel-verifiable: brand lockup, artistry + address lines, Explore nav (Portfolio/Services/Blush School of Beauty/About Sneha/Contact), Say-hello lanes (WhatsApp number + the two IG handles), and the bottom line "© 2026 Blush Lounge — Makeup by Sneha. All rights reserved." + "Delhi · Worldwide". The beauty pass-4 claim of a visible "Built by Kairali" footer credit was FALSE against the audited screenshots and the source (which explicitly forbids Kairali entity claims on this personal brand). A finding that re-asserts a nonexistent element is a conduct finding.
