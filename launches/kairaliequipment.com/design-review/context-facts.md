# Canonical-facts context — kairaliequipment.com (gate-battery post-build review, compiled 2026-07-18 21:55:00 IST)

Compiled for the golden-gate battery from DECISIONS.md owner rulings + the pass-4 fixed rulings
(launches/kairaliequipment.com/design-review/pass4-fixed-rulings.md — binding, not re-litigable).

**BINDING POLICY — D-EXTREVIEW-OWNER-FACTS (Abilash, 2026-07-18 18:55:33 IST):** owner-confirmed
facts are AUTHORITY; reviewer doubt about a fact below is ADVISORY, never a blocking FAIL.

## Owner rulings (verbatim anchors)

> D-EQ-CATALOG (DECISIONS.md 17:46:09 IST): build the FULL catalog structure with UNMISTAKABLE
> placeholders — lorem-ipsum-style ₹/$ values, obviously-fake SKU IDs, placeholder/stock/generated
> images "so the team knows what goes where". Real catalog data swaps in on arrival. Placeholder
> pages NEVER go live — preview only. HARD GATE 6 note: owner-directed explicit placeholders,
> never data presented as real.

> D-EQ-CLAIMS: carry the live site's cert/export/manufacturing/heritage claims AS-IS (same trust
> basis as D-FR-MONEY).

Consequences for this review:
- "₹X,XXX / $X,XXX" prices, "SKU-PLACEHOLDER-0NN" ids and PLACEHOLDER-badged imagery are BY OWNER
  ORDER and preview-locked (a lint blocks the DNS flip while any placeholder remains). Their
  presence is NOT a defect; only a placeholder masquerading as real data would be.
- Certifications/awards/export/alliance claims carried as-is from the live-site record, scoped
  "— group" where they belong to the group; badge chips are TEXT until official artwork lands
  (demanding logo artwork now = demanding fabrication; the NABH fact itself is portal-verified).
- No commissioned product photography exists; stock and AI-generated product imagery are BANNED.
  The dimensioned technical drawing (real mined 8.5 ft × 3 ft / 3 in spec) is the honest interim
  hero asset; legacy catalogue photographs appear as captioned reference thumbnails with a flagged
  dependency note.

## Fixed design rulings (pass-4 file, owner option-c)

- WhatsApp appears EXACTLY TWICE in the system: hero pill + mobile sticky utility bar (desktop
  once, mobile twice). Header carries none. Do not re-flag the count.
- Full-page screenshot artifact: position:fixed chrome renders at first-viewport bottom in
  full-page captures and can appear "inline" mid-page — not an extra button.
- The utility-bar Call slot stays dark until a verified equipment phone number exists; the live
  site's +91-9555156156 is NOT in LOCKED FACTS for this entity and is never printed.

## Heritage + register facts

- "Founded in 1989" = group founding (canonical). 1908 = FAMILY LINEAGE ONLY ("A family practising
  Ayurveda since 1908"); never "est. 1908". Four generations per kairali-lineage.md §0b.
- Group affiliation claim (reworded, binding): "built in our own facility by the Kairali Ayurvedic
  Group, the family group behind the NABH-accredited Kairali — The Ayurvedic Healing Village."
  No equipment-identity equivalence ("we treat on what we sell") is asserted anywhere.
- Quote-first B2B: NO real prices, no cart — RFQ to info@kairali.com (locked fact) is the
  conversion; catalogue-PDF is the soft CTA.
- Register: B2B product-pharma/manufacturer. KTAHV clinical lock does not bind this domain;
  "spa" is correct in hotel/resort/spa-developer lanes.

## ADDENDUM for post-build pass 2 — full-site build lane [2026-07-18 23:20:00 IST]

State changes since pass 1 (all committed on PR #131's branch; judge the design WITHIN these):

1. **The banned equivalence sentence is REMOVED** (pass-1 blocking catch): the Manufacturing band now ends at the owner-approved affiliation claim; the sweep also removed two further constructions the auditors did not flag ("the spec our own therapists treat on"; section head "from the people who use it" → canonical "from a family practising Ayurveda since 1908"). A guard test (sites/kairaliequipment.com/test/guards.test.js) FAILS CI if any equivalence construction returns.
2. **STRATEGY.md §6b now declares** the signature MCB / anchor secret desire (post-ruling wording), the NDFF source corpus, the MoA duplicate, per-page SBJ stages, and the Twelve-Questions block (dated note; lifted from the build-time self-check).
3. **Mobile sticky bar + chat consent-yield are MACHINE-EVIDENCED** (pass-1 "needs evidence"): screens/2026-07-18-fullsite-mobile-postconsent-viewport.png shows the sticky quote+WhatsApp bar visible with the chat bubble stacked above it after the banner is answered; DOM assertions recorded (stickyVisible=true, bubbleAboveBar=true, overflowX=false). The chat loader is now CONSENT-GATED (opt-in @kairali/chat prop): the Chatbase embed injects ONLY after the banner is answered — verified live (no chat script pre-choice; injects post-choice). This also keeps the consent banner's "Nothing is stored until you choose." literally true for this site's own surfaces (Consent Mode v2 default-denied; choice in localStorage only on click).
4. **WhatsApp count law held STRICTLY site-wide** (pass4 §1): hero pill + sticky mobile bar remain the ONLY WhatsApp entries on the entire site; the guard test fails any file adding a third. The scope question is logged for the owner (QUESTIONS.md Q-EQ-WA-COUNT-SCOPE) — an auditor demand for more WhatsApp links contradicts the fixed ruling and is out-of-scope, not a defect.
5. **Commercial terms (beauty B18) are answered at the record's granularity**: a "What we share at quote stage" band (MOQs & lead-times · territories & margins · packaging & export terms · certifications & documents) defers each item to its named page (/faq, /trade/distributors-importers, /manufacturing, /certifications — all BUILT and live on this preview). Publishing MOQ figures, lead-time numbers, Incoterms tables, CAD/DWG downloads or per-model spec-sheet PDFs would require data that does NOT exist in the owner's record (D-EQ-CATALOG: no real model data yet) — demanding them now is demanding fabrication (HARD GATE 6); they land with the real catalogue.
6. **The full site now exists behind the golden page** (29 routes per the signed STRATEGY sitemap): 5 category pages (verbatim-mined specs, FAQPage schema, Product schema WITHOUT offers), 10 placeholder PDPs (noindex, OUT of sitemap.xml, NO Product schema), 4 trade-lane pages, /about (canonical lineage), /manufacturing, /certifications (3 verified group-scoped credentials, text chips), /request-a-quote (full structured RFQ per the signed integrations plan), /faq, /contact (email-only per HARD GATE 6 — no unverified phone/address; gaps flagged to owner). Trust chips and hero chips now LINK their pages; every internal href machine-verified 200.
7. **Preview**: this pass's screenshots are from the freshly deployed Vercel preview (deployment dpl_HD3sBXEPcdxKthPohe3SUUZmoHFw, all routes 200). The site remains PREVIEW-ONLY under D-EQ-CATALOG (placeholder-lint: 62 expected hits blocking go-live, not the preview).

## ADDENDUM for post-build pass 3 [2026-07-18 23:55:00 IST]

Pass-2 findings judged; state for pass 3 (fresh screenshots 2026-07-18-pass3-*):

1. **HERO five-line coverage (pass-2 GPT item 2): FIXED** — the lede now enumerates all five lines ("Pathi massage beds in medicated wood, Shirodhara stands, teak steam chambers, bell-metal urlis and the treatment-room accessories"), plus the five chips.
2. **Machine evidence file** `design-review/post-build/2026-07-18-machine-evidence.md` closes the evidence-class items with DOM/network truth screenshots cannot carry: §1 consent-gated chat (ZERO chatbase requests pre-choice, localStorage empty; injects only post-choice — checklist 24), §2 mobile overflow/sticky/stacking assertions (checklist 13/24), §3 the trust-chip/hero-chip/lane link map with all targets 200 (checklist 23), §4 route + noindex + sitemap sweep. Judge those items on that file — a static screenshot cannot prove an href or a network absence.
3. **Grid captions (pass-2 GPT item 22):** the five per-card captions WERE removed — the catalogue grid carries the single disclaimer above it ("Photography: from the legacy catalogue…"). What remains under the two MANUFACTURING-band figures ("Brass Shirodhara pot — legacy catalogue." / "Shirodhara equipment set — legacy catalogue.") are two DISTINCT figure captions, kept deliberately per the beauty-audit advisory (B14/B15 keep brass/wood imagery with captions); they are not grid duplicates.
4. **OWNER-FACT set for the truth lane (D-EXTREVIEW-OWNER-FACTS — reviewer doubt on these is ADVISORY, never a blocking FAIL):** the mined category specs (8.5 × 3 ft / 3 in slab / medicated wood · brass work / teak · steel tank / brass & bell metal — verbatim from the owner's legacy-catalogue record, org-inventory §4); the interim WhatsApp line +91 92898 38797 (fleet LOCKED FACT, owner-configured, loud swap flag); info@kairali.com routing (LOCKED FACT); D-EQ-CATALOG placeholder honesty (owner-ordered); the preview-lock (scripts/placeholder-lint.mjs, 62 expected findings blocking go-live). Implementation-behaviour claims (consent storage, RFQ consent requirement) are machine-verified in the evidence file — they are not web-searchable and cannot be expected to be.
5. **1908/1989 wording:** the site NEVER claims a 1908 corporate founding — "A family practising Ayurveda since 1908" (family lineage, owner-ruled canonical form) + "Founded in 1989" (group founding). Both forms are guard-tested (test/guards.test.js: 'est. 1908'/'established 1908'/'company since 1908' are banned strings). A finding that treats the lineage line as a corporate-founding claim contradicts the owner's FLAG-3 / D-LIN-1989-WORDING ruling and is out-of-scope.

## ADDENDUM for post-build pass 4 [2026-07-19 00:06:00 IST]

1. Machine-evidence §5 now closes pass-3 GPT items 7/20/13 with DOM truth (trust-chip scoping strings incl. "— group" badges, the four terms-card hrefs all 200, and a 62-element tap-target audit: every data-cta primary control meets the 44px bar; the consent checkbox's click surface is its wrapping full-width label).
2. **D-EXTREVIEW-OWNER-FACTS, quoted verbatim (owner ruling, DECISIONS.md 2026-07-18 18:55:33 IST):** "OWNER-CONFIRMED FACTS ARE AUTHORITY in external AI design reviews. Every review run attaches a canonical facts sheet (relevant DECISIONS rulings + @kairali/facts); reviewer doubt on owner-confirmed facts is ADVISORY, never a blocking FAIL; the owner's signature remains the deciding judgment." The pass-3 truth-lane data_faults fall ENTIRELY in that class: the interim WhatsApp line (fleet LOCKED FACT; swap flag loud), the mined category specs (owner's legacy-catalogue record, D-EQ-CLAIMS carried as-is), the "manufacturing division"/"worldwide alliances" register (verbatim carry of the owner's live-site record: kairaliequipment.com/about-us.aspx "manufacturer, exporter and supplier"; the legacy Worldwide Alliances page), and the legacy-photograph provenance (image-library manifest, mined 15 Jul). Under the ruling these are ADVISORY findings for the owner's eyes — not blockers.
3. **Consistency note for the truth lane:** pass-1 (this same gate, same site) rated "A family practising Ayurveda since 1908 correctly represents Kairali's heritage (family lineage only, not company founding)" as SUPPORTED with citations; pass-3 flags the same wording MISLEADING. The site's copy has not changed on this point and is guard-tested against every corporate-1908 form. The pass-1 verdict is the externally-cited one.
4. The consent-banner behaviour claim is machine-verified (machine-evidence §1: zero third-party requests and empty localStorage pre-choice on the deployed origin) — it is an implementation fact, not a web-searchable one; UNVERIFIABLE-by-search is expected and does not make it false.
