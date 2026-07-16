# arogyashala.in — build brief: mine, protection map, dual-SEO (D-SEO-DUAL)

Built: 2026-07-16 20:55:00 IST · Design brief: docs/design-research/arogyashala-2026-07-16.md · Audit: audits/arogyashala.co.in-2026-07-16.md · Purpose ruling: wiki/entities/arogya-brands.md (LOCKED).

## Mine (step zero, done)
14 legacy pages banked verbatim → `content-mined/arogyashala.co.in/` (injection screen CLEAN). Canonical domain = **arogyashala.in** (register row 44); .co.in currently serves the legacy site and its forward to .in is HELD in the farm precisely until .in serves content — **this build lifts that HOLD**.

Key legacy facts recovered: Arogya Shala = a Kairali Ayurvedic Products initiative; agency programme supplying the Kairali range + "help and update you with the information about the usage of all our products" (→ the staff-guidance promise, sourced). Group founded 1989 by K.V. Ramesh + Gita Ramesh. **Deliberately NOT carried over:** the legacy cure-claims ("Ayurvedic cures", "without any side effects", "relieve … from diseases"), the "Since 1908" group footer, "guests" register, and the empty locator.

## Protection map (all single-hop; implemented in next.config.ts)
| Legacy URL (.co.in, forwards to .in at flip) | Fate |
|---|---|
| / and /default.aspx | new one-pager / |
| /pirvacy-policy.aspx (sic — real misspelled slug) | 301 → /privacy |
| the other 12 .aspx pages (about-us, apply-now, awards, career, company-profile, contact-us, enquire-now, free-ayurvedic-consultation, our-locations, our-products, sitemap, why-arogyashala) | 301 → / |
No GSC property exists; the site's search value is branded-query capture (register row 44), fully preserved by the wholesale forward + map. A `guards.test.js` test asserts the map covers every mined page.

## D-SEO-DUAL (two named steps, per the 16 Jul ruling)
**DEFEND (what we already hold):** branded queries only — "arogya shala", "arogyashala", "arogyashala kairali" (no GSC data available pre-flip; legacy titles are generic). Defence = the domain forward + this page's exact-brand title/H1 + Organization/FAQ JSON-LD + llms.txt. Add the GSC property AT FLIP (we control DNS then) — logged in BACKLOG's cutover pattern.
**ATTACK (what the niche searches):** trade-intent phrases worked naturally into title/meta/H2/FAQ copy — "ayurvedic retail counter", "kairali products for my shop", "ayurvedic products for chemist shop", "become a kairali retailer". AEO: the FAQ block answers the five realistic first questions verbatim (FAQPage schema + visible accordion); GEO: llms.txt states the programme + verification path in plain facts.
**MUST-NOT (ROI protection):** no cure claims (DMR/ASCI), no invented counts/locations/fees (rule 6 + gates), no franchise-commercial keywords we cannot honour ("franchise cost", "investment") — those queries belong to ayurvedafranchise.com's lane once its commercials are ruled.

## Contact interim
WhatsApp = Priya interim number (DECISIONS 2026-07-13 18:51, arogyakendra precedent) + info@kairali.com. Swap when the group WhatsApp ruling lands (BACKLOG, Abilash).

## Post-build gates run on this site
compliance lint · brand-lint · guards.test.js · build · design-qa + seo-aeo-geo (rule n) · B-14 design-critic · **D-DESIGN-DIFF similarity comparison vs arogyakendra.com (external AI judge)** — results in launches/arogyashala.in/.
