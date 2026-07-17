# kairaliyoga.com — build brief: mine, protection map, dual-SEO (D-SEO-DUAL), provenance flags

Built: 2026-07-16 21:40:00 IST · Design brief: docs/design-research/kairaliyoga-2026-07-16.md · Audit: audits/kairaliyoga.com-2026-07-16.md · Facts source: docs/rates/RATES_RECKONER.md (26–27 yoga lists + Ayurveda Training Courses V2) + content-mined/kairaliyoga.com/.

## Mine (step zero, done)

9 legacy pages banked verbatim → `content-mined/kairaliyoga.com/` (audit injection screen CLEAN): home, about-us, retreat-programs, testimonials, yoga-teachers, yoga-and-ayurveda, media-center, competition-form, free-consultation-form. Key recoveries: the five published testimonials (see provenance below); the "five points of yoga — postures, breathing, relaxation, meditation, and diet" teaching frame (yoga-teachers.aspx); group facts (founded 1989, four-generation lineage — about-us.aspx). **Deliberately NOT carried over:** "Kairali Ayurvedic Group Since 1908." footer (audit #1 / PR #65), the broken `mailto:in@kairali.com` (audit #2 — guards regression-test it), the 2013–2018 feed/calendar content (audit #8), the mojibake feed text (#9), hospitality-register copy ("It's a unique resort…", "Ayurvedic Spa" titles — audit #14), the chatbot force-open + push-prompt double interruption (#15), and the legacy claim that Yoga Teacher Training courses are offered — **no YTT exists in the rates reckoner**; the training section presents the real Ayurveda Training Courses and refers YTT researchers to enquiry honestly (guarded).

## Register note (for Abilash's #14 ruling)

site.config.json says `register: "E"` per SITE_DESIGN_LOCALE_REGISTER.md row 39 (the build task's scaffold line said "A" — treated as a typo; the same task names the site E-register). Copy keeps the KTAHV clinical register wherever the hospital is named (physician, admission, treatment, programme; zero banned words in our copy). The word "retreat" appears exactly ONCE, as the visitor's own word in the FAQ question "Is this a yoga retreat or a hospital?", where the answer re-registers it to the hospital's terms — flagged for the audit-#14 register ruling; trivially removable if ruled against.

## Protection map (all single-hop; implemented in next.config.ts, guarded)

| Legacy URL | Fate |
|---|---|
| / and /default.aspx | new one-pager / |
| /about-us.aspx | 301 → / (about copy folded into the page) |
| /retreat-programs.aspx | 301 → /#programmes |
| /testimonials.aspx | 301 → /#voices |
| /yoga-teachers.aspx | 301 → /#teachers |
| /yoga-and-ayurveda.aspx | 301 → / (philosophy essay retired) |
| /media-center.aspx | 301 → / (2013 feed retired) |
| /competition-form.aspx | 301 → /#enquire |
| /free-consultation-form.aspx | 301 → /#enquire |

The live site's sitemap has 65 URLs; the 9 mined pages are the value-bearing set banked tonight. The remaining legacy paths (yoga-therapy.aspx, kairali-retreats.aspx, calendar.aspx, resource pages, etc.) 404 on the new origin until the pre-flip pass — **flag: extend the redirect map to the full 65-URL sitemap before DNS flip** (same wholesale-forward pattern; listed in BACKLOG's cutover checklist lane). No GSC property data was available to rank them (audit NOT-RUN list).

## D-SEO-DUAL (two named steps)

**DEFEND (what the domain already holds):** branded queries — "kairali yoga", "kairali yoga retreat" (legacy title tokens). Defence = exact-brand wordmark + og siteName "Kairali Yoga", H1/hero overline carrying Kairali + Healing Village, Organization/WebSite/FAQ JSON-LD, llms.txt, and the anchor-true redirect map above. Add the GSC property AT FLIP (we control DNS then).

**ATTACK (what the niche searches):** "yoga programmes Kerala" (title), "residential yoga programme India", "yoga and meditation Kerala", "ayurveda and yoga Palakkad", "yoga therapy for digestive wellness / stress reset" (the programmes' own printed English names are the attack phrases — they ARE search language), "ayurveda training course India" (training section). AEO: the FAQ answers the six realistic first questions verbatim (FAQPage schema + visible details/summary); GEO: llms.txt carries programme names/durations/inclusions as plain facts.

**MUST-NOT (ROI protection):** no prices or per-night figures (rates = approved surfaces only; reckoner FLAGS gate bundled figures); no batch dates (none exist — honest "enquire for upcoming dates" strip, guarded by month-day regex); no "yoga teacher training" offer claims (guarded); no cure/treat claims (guards + compliance floor); no "Since 1908" on the Group (guarded, computed years only).

## Testimonial provenance (verify-at-flip flag)

The 3 testimonials in `content/testimonials.json` are **verbatim excerpts of the legacy site's testimonials page** (content-mined/kairaliyoga.com/testimonials.html), attributed exactly as the legacy site printed them: Amitabh Kant (Joint Secretary, Ministry of Tourism), Late Pramod Mahajan, Mrs. & Mr. Ajitabh Bachhan. `guards.test.js` re-reads the mined HTML at test time and fails if any quote/attribution drifts from the legacy text. Excerpts were chosen to contain zero KTAHV-banned register words (the full Kant quote says "resort"/"Spa" — excerpt stops before). The page carries a visible carry-over note. **Abilash verifies at flip** that these decade-old attributed quotes may stay (public figures; published by us before).

## Teacher provenance (verify-at-flip flag)

The legacy yoga-teachers.aspx page publishes **no named roster** — its body copy is anonymous ("Kairali Yoga has some of the best yoga teachers…"; the nav's guest-teacher names, Jason Dean etc., belong to expired 2013–2018 guest-retreat profiles, not a current roster). Per the task rule, the teachers section ships **without names**, built on the page's real "five points of yoga" frame + the reckoner's daily-physician fact. **Roster as published on the legacy site is anonymous — Abilash confirms whether current teachers should be named at flip.**

## Facts trace (rule 6)

- Programme names, Sanskrit diacritics, minimum nights: RATES_RECKONER.md Grids 1–2 (26–27 yoga lists) — Dhyāna-Yoga Shibiram 07N · Agni Dīpanam Yoga Chikitsa 14N · Prāna Sāmya Yoga Chikitsa 07N.
- Inclusions (private sunrise yoga, private guided evening mindfulness, one therapy/day incl. herbal steam baths, three vegetarian organic-ingredient meals, mineral/herbal detox water, weekly workshops/cooking classes/farm tours/village walks/nature trails, pool/library/gym, daily doctor check-ins): reckoner Yoga & Meditation Package Inclusions + Facilities block, re-registered to clinical vocabulary (source PDF's "Luxury Stay" heading NOT copied — reckoner FLAGS).
- Training courses (names, durations, descriptions, certifying institute, doctor-led theory + senior-therapist practice): reckoner Ayurveda Training Courses V2.
- Arrival facts (check-in 12:00, check-out 10:00, transfer distances 25/75/125 km, no-smoking/no-alcohol campus, physician-prescription-only extras): reckoner T&C + transfer tables (distances only, NO transfer prices).
- Group 1989 / lineage 1908 / four generations: about-us.aspx + PR #65 licensed phrasing; rolling numbers computed.
- Contacts: info@kairali.com + wa.me/919289838797 (DECISIONS 2026-07-13 18:51 interim).

## Media

8 real photos from the KTAHV campus shoot (IMAGE_MANIFEST.md; all catalog `register_ok: yes`, sips ≤1600px q82). **Beauty-pass upgrade flagged:** the design brief's HF-AMB dawn *video* hero — no brand-graded video asset exists tonight; the dawn photo + 400ms fade stands in.

## Post-build gates run on this site

pnpm build · brand-lint · compliance · guards.test.js (8 tests) · full discovered suite · Playwright evidence screenshots (desktop/mobile/first-paint/focus-ring) + og.jpg → launches/kairaliyoga.com/screens/. design-qa + seo-aeo-geo (rule n) + B-14 critic queued next.
