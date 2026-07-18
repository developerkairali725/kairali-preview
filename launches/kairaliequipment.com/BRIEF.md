# kairaliequipment.com — BRIEF (front gate 1 of 4)

- Written: 2026-07-18 17:58:40 IST · weekend-sprint lane · MODE B (see approvals.yaml)
- Rulings in force: **D-EQ-CATALOG** + **D-EQ-CLAIMS** (DECISIONS.md 2026-07-18 17:46:09 IST block, PR #129)
- Sources: `docs/group-inputs/kairaliequipment-org-inventory.md` (INV) · `kairaliequipment-niche-brief.md` · `kairaliequipment-competitor-research.md` · `kairaliequipment-protection-map.md`

---

## 1 · What this site is

The **B2B lead-gen site of Kairali's Ayurveda-equipment manufacturing business**: wooden Panchakarma tables (Pathi/Droni), Shirodhara stands, steam boxes, brass/bell-metal Urlis, and treatment accessories — made by the group, sold to institutions, quoted not carted. Register: **group / B2B equipment** (Register A). "Spa / luxury / resort" are PERMITTED here — the KTAHV clinical lock does NOT cross-apply. One red line: no medical-claim language ("cure") anywhere.

## 2 · Who it is for

1. **Ayurveda hospital / clinic / college procurement** — spec-driven, needs materials + dimensions + institutional credibility.
2. **Resort, hotel and spa developers** (India + overseas) — the highest-ticket buyer; buys capability, aesthetics and a partner who can also consult.
3. **Overseas distributors / importers** — export terms, alliance history, catalogue depth.
4. **Spa-setup consultancy clients** — the "equip my new centre end-to-end" buyer the legacy `/trade` pages already served.

## 3 · What it must achieve

**Primary conversion: a qualified quote request** (RFQ) reaching the sales team via **info@kairali.com** (locked fact) — plus WhatsApp-first contact for the chat-native buyer. Secondary: catalogue (PDF) download as the soft CTA for earlier-stage buyers. No cart, no checkout, no prices (quote-first is the premium-lane norm — competitor research §3.1).

**Positioning (the one-line):** the only Ayurveda-equipment maker whose family group runs its own NABH-accredited healing village — ~~*we manufacture what we treat on*~~. Trust levers carried **as-is from the live site per D-EQ-CLAIMS**: own manufacturing · certifications & awards · export / worldwide alliances · four-generations heritage.
> *(Reconciliation, 2026-07-18 22:33:00 IST: the struck tail is the equipment-identity equivalence the owner's pass-4 fixed ruling §6 removed — "No equipment-identity equivalence is asserted anywhere." The ruling postdates this signed brief; the affiliation-only form above is the ruling-compliant positioning, declared as the signature MCB in STRATEGY §6b. Battery evidence: beauty/2026-07-18.md B10/B9; guard: sites/kairaliequipment.com/test/guards.test.js.)*

## 4 · Scope under D-EQ-CATALOG (the placeholder law)

Real product data will NOT arrive in time, so the build ships the **FULL catalog structure with UNMISTAKABLE placeholders**:

- Prices render as **"₹X,XXX / $X,XXX"** — never a plausible number.
- SKU IDs render as **"SKU-PLACEHOLDER-001"** style — never a plausible model number.
- Product images are **clearly-labelled placeholder images** (stock/generated, badged "PLACEHOLDER" in the frame); the 9 mined legacy images (image-library manifest) may serve as interim real imagery where they fit.
- Category-level copy is REAL (verbatim-mined specs: 8.5×3 ft droni, teak steam box, brass/bell-metal urlis — INV §4); everything below category level is placeholder until the real catalog swaps in.
- **PREVIEW-ONLY LOCK: this site can never go live while any placeholder remains.** Encoded as a loud launch-checklist gate + proposed placeholder-lint (STRATEGY §6). HARD GATE 6 note: these are owner-directed explicit placeholders, never data presented as real.

Categories are derived from mined materials ONLY: **Pathi (wooden massage beds) · Shirodhara Stands · Steam Boxes · Urlis · Accessories** (+3 named accessory items). No sixth category is invented.

## 5 · Constraints & flags

- **Q-EQ-SECURITY** (live-site HTTP 500 + path leak) is the **Deepu/Sunaj lane** — this build never touches the legacy server.
- Phone **+91-9555156156** is UNVERIFIED (not in LOCKED FACTS) — not printed anywhere until confirmed; WhatsApp CTA uses the fleet interim number with a loud swap flag (STRATEGY §5).
- The legacy clinical PII form (`consult-a-doctor.aspx`) is **NOT rebuilt** — routed per protection map §2d, pending Abilash + Dr. Deepu John.
- Locale: **EN only** (site brief basis: legacy EN-only, export buyer reads EN; flag if Abilash wants an export locale later).
- Site class: **organic** (gates/registry.yaml) — no cart/checkout ever (Factory Rules).
- Duplicate-content flag: kairali.com's live `/ayurvedic-spa-equipment.aspx` carries the same catalog copy — fate owned by the kairali.com lane (research §2.5).

## 6 · Golden page

**The homepage** (default — no other page named). Built only after strategy + design gates are signed; every later page matches it.

## 7 · Ship bar

pnpm build clean · factory-spec green · Lighthouse ≥90 perf / 100 SEO · compliance lint zero findings · design-critic B-14 ≥9.0 · both checklists FILLED · **placeholder-lint: findings expected and listed (they BLOCK go-live, not the preview)** · Abilash approves the preview.

---

> reply **APPROVE brief** or **CHANGES <notes>**
