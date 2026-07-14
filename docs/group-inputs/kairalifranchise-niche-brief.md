# kairalifranchise.com — Pre-Design Niche Research Brief

**Compiled 2026-07-14 23:59:10 IST · Register: GROUP / FRANCHISE lead-gen (register A — B2B investor audience, India + international). NOT KTAHV clinical-lock site-wide; see §5 for the register split.**
**Model for this document: `docs/kappl-inputs/kairalitea-niche-brief.md`. Legacy inventory (the offer source of truth): `docs/group-inputs/kairalifranchise-org-inventory.md` [INV]. Design authority: `packages/ui/brand-tokens.css` + `docs/design/DESIGN_DOCTRINE.md`. Every external claim is cited inline; source index at the foot.**

> **Scope note.** This brief precedes design decisions (CLAUDE.md, 13 Jul 2026 Abilash directive: competitor/niche research lands in `docs/<entity>-inputs/` BEFORE design). It does NOT approve copy or ship code. Two hard ESCALATIONS gate any build: (a) the **upfront investment / franchise-fee / ROI numbers are absent from every reachable Kairali surface** — they must come from Abilash, never be invented (§1, §8); and (b) the **contradictory heritage/scale figures** (1908 vs 1989 vs 1948; 35 vs 25 vs ~13 centres) must be reconciled by Abilash before any number is printed (§1, §8). Per CLAUDE.md rule 6, this brief flags gaps — it never fills them.

---

## 0 · Two blockers to resolve before a single page is designed

1. **THE CORE NUMBER IS MISSING.** A franchise investor's first question — "how much to invest?" — has **no answer on any Kairali-owned page.** The legacy FAQ's two investment links (`treatment-centre-franchise-india.aspx`, `spa-franchise-international.aspx`) both **404** [INV §2a]. Third-party portals *do* circulate a figure (**₹10–15 lakh**, "franchising since 2005, 6 company-owned + 19 franchises") [S16, S17] — but that is **unconfirmed third-party data that also contradicts the site's own scale claims**, so it CANNOT be published as fact. → **ESCALATE to Abilash: get the current investment band, franchise fee, technical-service fee, and a realistic payback range, in writing, before the Investment page is designed.** (CLAUDE.md rule 6 — never invent money.)
2. **THE DOMAIN ITSELF IS AN OPEN QUESTION.** `kairalifranchise.com` currently **301/302-redirects to `ayurvedafranchise.com`**, which is the live franchise site; a *third* franchise surface, `kairali.com/ayurveda-spa-franchise.aspx`, is also live [INV §0, S18]. Three surfaces, one offer. → **ESCALATE: which domain is canonical for the rebuild, and what redirects into it?** This decides the whole IA and the forward-farm row.

---

## 1 · The VERIFIED franchise offer (captured from the live site, flagged where unconfirmed)

Everything here is transcribed from the live franchise site (`ayurvedafranchise.com`, mined 2026-07-14) [INV §2]. **"Verified" = printed on Kairali's live site as of the mine — not the same as "confirmed still-current by Abilash."** Recurring/operational terms are on the public FAQ and are usable pending a currency check. The upfront-money terms are the ones that are missing (§1.C).

### 1.A The four franchise models (verified — on `/franchise-model-opportunity/`) [INV §2]

| # | Model | Market | Notes |
|---|-------|--------|-------|
| 1 | **Standalone Day-Care Centre — "Kairali Ayurvedic Centre"** | Domestic (India) | Full treatment centre; BAMS Ayurvedic Doctor + Kerala therapists; Panchakarma where advised. **Clinical register** — see §5. |
| 1b | **Standalone Day-Care Centre — "Kairali Ayurvedic Spa"** | International | Wellness spa; runs with or without an Ayurvedic consultant. **Hospitality/wellness register — "spa" is CORRECT here** (§5). |
| 2 | **Fusion / Shop-in-Shop** | Both | Investor houses several wellness brands under one roof; Kairali Ayurveda is one essential element. Sub-items: customised Ayurveda solution, tailor-made brand SOP, third-party brand association. |
| 3 | **Wellness Hotels & Resorts / Ayurvedic Hospitals** | Both | Kairali services placed inside 5-star resorts/hotels; also offered to Ayurvedic hospitals/clinics. |

### 1.B Operational & recurring-fee terms (verified — verbatim from `/faqs/`) [INV §2]

| Term | Value (verbatim from the live FAQ) | Status |
|------|-----------------------------------|--------|
| **Royalty — Domestic** | Rs. 25,000 **or** 5% of net service sales, whichever is higher; monthly + applicable tax | Published; **re-confirm currency with Abilash** |
| **Royalty — International** | USD 1,000 **or** 7% of net sales, whichever is higher; charged monthly, collected quarterly | Published; **re-confirm** |
| **Area — 2-treatment-room model** | 1,500 sq. ft. | Published |
| **Area — 4-treatment-room model** | 2,100 sq. ft. | Published |
| **Setup time** | ~90 days post licensing/admin (varies by location) | Published |
| **Territory protection** | Minimum 10–15 km between Kairali centres | Published |
| **Products** | Own manufacturing unit at Pollachi, Tamil Nadu; 150+ products (classical/patent/cosmetic) | Published; scale figure "150+" — reconfirm |
| **Franchise-fee discounts** | "can be discussed & negotiated" — **no figure** | Deliberately open |

**Support Kairali provides** (verified) [INV §2]: interior/ambience design + project consultants; Ayurveda equipment (massage beds, brass utensils, toiletries, towels); own product line; start-up + ongoing marketing (offline + online, fairs/exhibitions "at no extra cost") + SOP development; recruits/trains/places Ayurvedic doctors, consultants & therapists (on franchisee payroll); training with no prior spa/Ayurveda background required. **Eligibility**: entrepreneurs/investors in health/wellness + hoteliers; no stated net-worth or credential bar.

### 1.C UNVERIFIABLE / MISSING — FLAGGED, NEVER FILLED (CLAUDE.md rule 6) → ASK ABILASH

| Item | What we found | Why it's blocked |
|------|---------------|------------------|
| **Upfront investment / franchise fee / technical-service fee** | **Absent** from every Kairali surface (both FAQ links 404) [INV §2a]. Third-party portals float **₹10–15 lakh** [S16, S17] — unconfirmed and un-attributable. | The single most-asked franchise question has no citable answer. **Do NOT publish any figure until Abilash supplies it.** |
| **ROI / payback period** | Not stated anywhere [INV §2a]. | Investors expect it; inventing it is a hard-gate violation. |
| **Heritage year** | Footer "Since 1908" vs home/about "founded 1989" vs "over two decades ago, 1989" vs pharma "1948" vs "10 decades" [INV §2a]. | Cannot print a founding year until Abilash rules which is canonical. The rest of the fleet uses **"Since 1908"** (`sites/kairalicenters.com/app/page.tsx`) — confirm that is the group line. |
| **Scale (centres/countries)** | "35 centres in 9 countries" vs "25 centers" vs locations page lists ~13 [INV §2a]. Third-party listing says "6 company-owned + 19 franchises" [S17]. | Four different counts. Abilash must give one auditable number. |
| **Franchising-since year** | Third-party "since 2005" [S17] — not on Kairali's own site. | Unconfirmed; do not use. |
| **Canonical contact** | Site uses `franchise@kairali.com` + IVR +91-9555156156, NOT the locked `info@kairali.com` [INV §2a]. Locations page also exposes `delhi@kairalicentres.com`, `info@kairalihyd.com`, `kairalispa@ayus.co.jp`, `info@kairali.mu`. | Locked fact is `info@kairali.com` (CLAUDE.md). **Confirm which address routes franchise leads** before wiring the form. |
| **Lost secondary IA** | "Why Franchise / Support / Accreditation / Investment / Media / News" are linked but all 404 (.aspx migration debris) [INV §6]. | Confirm whether this content exists to recover, or is written fresh. |

---

## 2 · Information architecture + page map

Franchise lead-gen sites resolve to two jobs: **attract top-of-funnel "learning" research traffic, then convert bottom-of-funnel "ready-to-invest" intent** — learning-intent queries vastly outnumber buying-intent ones, so both must be served [S9]. The proven structure is a small, decisive set of pages, each with one clear CTA into a single qualifying form [S1, S3]. No cart, no e-commerce — this is a lead-capture site (Factory Rules).

| # | Page (slug) | Role | Must contain | Register |
|---|-------------|------|--------------|----------|
| 1 | `/` (Home) | The pitch + qualifier | Benefit-driven headline [S4], the 4 models as cards, trust strip (§5), "why now" wellness-demand hook (§3), one primary CTA to `/apply`, condensed FAQ teaser | Group A |
| 2 | `/opportunity` | The franchise offer | The 4 models in depth (§1.A), market/demand framing (§3), territory-protection promise (10–15 km), who it's for | Group A; model 1b = hospitality; model 1 = clinical |
| 3 | `/why-kairali` | Differentiation / trust | Since-1908 heritage (once reconciled), NABH accreditation, existing-centre proof, awards, own-pharmacy (150+ products), founder/leadership | Group A |
| 4 | `/investment` | The numbers page | **BLOCKED until Abilash supplies figures** (§1.C). Structure ready: investment band, franchise fee, royalty (verified §1.B), area/setup/timeline, "what's included." Transparency here pre-qualifies serious candidates [S1] | Group A |
| 5 | `/support` | What the franchisor delivers | The verified support list (§1.B) as a staged journey: design → equip → staff/train → market → operate | Group A |
| 6 | `/apply` (or `/enquire`) | The conversion page | The single qualifying form (§4), reassurance copy, response-time promise, privacy link | Group A |
| — | `/about`, `/locations`, `/success-stories`, `/faqs`, `/contact`, `/privacy`, `/terms`, `/cookies` | Support/legal | Locations = de-duplicated, verified addresses only; success stories = testimonials (Hyderabad master-franchise, Japan) [INV §3]; legal from `@kairali/legal` (§5) | Group A |

**Discipline:** clean subfolders, breadcrumbs everywhere, no query-string-dependent content, every "learning" page links to `/apply`. **Drop all Flatsome demo content** (hello-world, lookbook, t-shirt CPTs) — legacy junk, never migrate [INV §1]. **Fix the ~7 dead `.aspx` footer links** — do not reproduce a broken secondary nav.

---

## 3 · Franchise-intent SEO / AEO plan

### 3.1 Two keyword tiers (both required) [S9, S10, S11]
- **Buying-intent (bottom-funnel, few but decisive):** "kairali franchise cost / investment," "ayurveda franchise India," "ayurvedic spa franchise," "wellness centre franchise opportunity," "how to open an ayurveda centre." Brand-level franchisor SEO targets exactly these investor queries to build a qualified pipeline without ad spend [S10].
- **Learning-intent (top-funnel, high-volume):** "is an ayurveda franchise profitable," "cost to open a wellness centre in India," "best wellness franchise 2026," "ayurveda vs spa franchise." Far more people research than buy right now — capture them and nurture [S9].

### 3.2 The demand tailwind is real and citable (use it as market framing, not as an ROI promise)
India's wellness sector is projected toward **USD ~150 billion with ~10–12% CAGR**, with rising demand across urban, semi-urban and **Tier-2 cities** [S7, S8]; Ayurveda/wellness is repeatedly ranked among India's fastest-growing healthcare-franchise categories for 2026 [S6]. This is legitimate **opportunity framing** for `/opportunity` — it is NOT a substitute for Kairali's own (missing) ROI figure and must never be dressed up as one (§1.C, §5).

### 3.3 AEO — franchise buyers now research through AI + portals
- **Directory/portal usage is rising** (74.4% in 2025 → projected 78.8% in 2026) and **88%+ of franchise brands will use at least one AI tool in their lead-gen by end-2026** [S13, S14]. Buyers increasingly ask AI assistants to summarise FDD-style facts (fees, unit counts, obligations) in plain English [S13].
- **Practical rule:** every page opens with a concise, self-contained **answer capsule** under a question-form H2 ("What does a Kairali Ayurveda franchise cost?", "How much space do I need?", "What support is included?") backed by **FAQPage + Organization JSON-LD** — the legacy site had **zero schema** [INV §1], so this is pure upside. Keep the same facts consistent across the owned site and any third-party portal profiles so AI answers converge (and so third-party ₹10–15 lakh figures don't out-rank Kairali's own once reconciled).
- **Off-site:** claim/correct the Kairali listings on the major franchise portals so they carry the reconciled numbers, not stale ones [S16, S17].

### 3.4 Schema stack (day one, all JSON-LD): **Organization/Brand**, **FAQPage**, **BreadcrumbList**, **WebSite**. (No Product/Offer — nothing is sold. No fabricated aggregateRating — CLAUDE.md rule 6.)

---

## 4 · The qualifying enquiry form (`packages/forms`, store-first + consent, Satyam CRM)

**Package authority:** `@kairali/forms` is **v1-FROZEN and BLOCKED on Ambuj** — the charter is to *replicate the CURRENT production CRM form schema + endpoint EXACTLY* (field names, hidden fields, source tags); the only v1 additions allowed are a **consent checkbox + privacy link, invisible Cloudflare Turnstile, and `data-cta` events** (`packages/forms/README.md`). So this brief specifies *intent*, not final field names — those come from the live Satyam CRM schema (task #12).

- **Store-first submission** — post to the CRM/store endpoint first, then render success; boolean consent required before submit (Satyam spec, task #12). Guest-only, no account creation (DESIGN_DOCTRINE §1.5).
- **Collect only what's needed to qualify a franchise lead** (privacy — data minimisation; and short forms convert better [S2, S4]): **Name · Phone · Email · Country/State/City · Model of interest (the 4 from §1.A) · Investment readiness / timeframe · Message.** That "model + readiness" pair is the minimal qualifier that lets Satyam route and score — resist adding net-worth/PAN/finance fields at first touch [S2, S15].
- **Consent + privacy:** boolean consent checkbox + visible privacy-policy link — the **legacy CF7 form had NO consent field at all** [INV §4], a gap for an India + international lead form. Privacy/Terms/Cookie pages come from `@kairali/legal` (`PrivacyPolicy`, `TermsOfService`, `CookiePolicy`, `SiteFacts` — `packages/legal/src/index.tsx`).
- **Anti-spam:** invisible Turnstile (replacing the legacy reCAPTCHA v3 [INV §4]). **Labels always visible above fields; correct mobile keyboards** (tel/email) — 80% of franchise leads arrive on mobile [S1], DESIGN_DOCTRINE §1.5.
- **Proof-of-work:** one **live test lead screenshotted in the Satyam CRM** is the single most important launch evidence item (Checklist B8, `packages/forms/README.md`) — no "form works" claim without it.
- **Instrumentation:** `form_submit` `data-cta` event on the primary control (§7).

---

## 5 · Trust furniture (reuse, don't reinvent)

Franchise conversion is a trust sale: transparency about costs/fees and real franchisee proof pre-qualify serious candidates [S1]. Assemble from existing fleet components.

- **Trust strip — reuse the `sites/kairalicenters.com` pattern** (`app/page.tsx`): a `dt/dd` list already carrying **"Since 1908 — four generations of Ayurvedic physicians"** and **"NABH-Accredited — teaching hospital in Palakkad, Kerala."** Same component, franchise-framed: Since-1908 (pending §1.C reconciliation), NABH accreditation, existing-centre count (pending §1.C), own WHO-GMP-lineage pharmacy (150+ products).
- **Existing-centre proof:** real photography of live Kairali centres (§6) + verified testimonials — Mr. Shyam Sundar (Hyderabad master franchise) and Ms. Wakaba Nishida (Japan) [INV §3]. Video testimonials convert hardest in this niche [S2] — check the 355-video library (`docs/media/VIDEO_CATALOG.csv`) for existing franchisee footage before commissioning.
- **NABH / awards:** the NABH Panchakarma-clinic accreditation is a genuine trust asset; award logos are mined at `image-library/legacy-kairalifranchise/` [INV §7]. **De-couple KTAHV/hospital references from spa/resort/luxury framing** — the legacy awards page mixed "NABH Panchakarma Clinic" with "Best Luxury Destination Spa" [INV §3]; that cross-contamination must not carry over (register split below).
- **Legal furniture:** Privacy/Terms/Cookie via `@kairali/legal` — franchise lead forms need a real, linked privacy policy (the legacy site had none near the form [INV §4]).

**REGISTER SPLIT (important):** This is a register-A group site, so the KTAHV clinical lock does **not** apply site-wide. BUT the offer contains **both** registers: model 1 ("Kairali Ayurvedic Centre," domestic, BAMS + Panchakarma) and any NABH/hospital reference use **clinical language** (patient, physician, treatment, programme — never spa/resort/luxury/cure); model 1b ("Kairali Ayurvedic Spa," international) and the resort/hotel model legitimately use **wellness-hospitality** language where "spa" is correct. Keep them visually and verbally separated. Do not cross-apply either lock (CLAUDE.md).

---

## 6 · Design direction (brand tokens + real photography)

Authority: `packages/ui/brand-tokens.css` + `docs/design/DESIGN_DOCTRINE.md` (brand manual wins; skills/plugins never override tokens — CLAUDE.md Knowledge Doctrine (d)). Register: **credible, institutional, investor-facing** — closer to a corporate/B2B tone than a consumer wellness brand, because the reader is deciding to invest ₹-lakhs.

- **Palette (60/30/10):** ground on `--ivory` (#F7F4EA); `--forest-500` (#006038) as the interactive/action colour; `--marigold-400` (#EEB41E) as the single accent moment per view — **never body text** (A4 lint fails marigold body text); `--bronze-400` (#C1882C) for taglines/overlines, which suits the heritage voice. No new palette (the legacy gold `#b48231` is dropped).
- **Type:** three-font hierarchy from tokens — **Kurale** display (h1–h3, ALWAYS weight 400, never bold), **Asap** body/UI, **Lato** captions/overlines/numerals. `--measure-prose: 720px`. Replaces the legacy Georgia + Seaweed-Script pairing [INV §1].
- **Photography — real library only, never stock** (DESIGN_DOCTRINE §2.1 #1). Two sources: (a) **`docs/media/IMAGE_CATALOG.csv`** — 48 franchise-relevant rows incl. centre reception with the back-lit **"Kairali Ayurvedic Centre" brand emblem** and award shelves (`ktahv-reception-kairali-sign-01`, `ktahv-reception-awards-shelf-01/02`), NABH/awards displays, and pro **centre-exterior-at-dusk** stills from the `ktahv-shoot-2025` set (`centre-exterior-brick-cottage-dusk`); (b) **`image-library/legacy-kairalifranchise/`** — 35 mined content images (director portraits Ramesh/Gita/Abhilash/Abishek, award logos, healing-village banners, model tiles) with `manifest.tsv` [INV §7]. Filter on `register_ok`/`quality`; award/press scans are evidence for `/why-kairali`, not hero creative.
- **Motion/perf:** purposeful feedback only — no auto-rotating carousels, no scrolljacking (DESIGN_DOCTRINE §1.1; the legacy Flatsome hero carousel is dropped). Mobile-first is a conversion floor — 80% of franchise leads are on mobile [S1]; Lighthouse ≥90 perf / 100 SEO (Ship Gate A5).

---

## 7 · Measurement — LinkedIn Insight tag (the register-A KPI)

The `data-cta` event vocabulary (`form_submit`, `call_click`, `whatsapp_click`) maps to GA4 + Google Ads, and — because this is an **A-register B2B site** — to the **LinkedIn Insight Tag** (the B2B pixel), with Bing UET where Ads run; **site IDs live in per-site config, never hardcoded** (`packages/analytics/README.md`, Checklist B3–B6). LinkedIn is the register-appropriate channel here: franchise investors are a professional/B2B audience, so LinkedIn conversion tracking + audience-building is the primary paid-measurement KPI (whereas consumer C/E sites lead with the Meta pixel).

> **Flag:** the whole measurement lane currently has **NO access and no wiring** — GA4/GTM/Ads/**LinkedIn**/Bing/GSC are un-provisioned and unowned ("a site without this does not launch," `docs/SPRINT_STATE.md §5`). The build can scaffold the `data-cta` events and the config slot, but **the LinkedIn Insight partner ID must be obtained (Vikash/Abilash lane) before launch.** Add to QUESTIONS.md.

---

## 8 · Design decisions unlocked + open questions for Abilash

### Five decisions this research unlocks
1. **IA is a 6-page conversion funnel, not a brochure** — Home → Opportunity / Why-Kairali / Investment / Support → single Apply form, every learning page routing to `/apply` (§2). The dual learning/buying keyword tiers (§3.1) fix the page-to-intent map before visual design.
2. **The Apply form is the whole site's job** — minimal qualifier (contact + model + readiness), store-first to Satyam CRM, boolean consent + privacy link + Turnstile, one live-lead CRM screenshot as launch evidence (§4). Field names wait on the frozen `@kairali/forms` schema (Ambuj).
3. **Trust furniture is reused, not rebuilt** — the `kairalicenters.com` trust strip (Since-1908 / NABH) + `@kairali/legal` pages + real centre photography + existing-franchisee testimonials (§5), with a strict **clinical vs hospitality register split** so KTAHV/hospital references never inherit spa/luxury framing.
4. **Visual system = the existing token set** — ivory ground, forest interactive, single marigold accent, Kurale/Asap/Lato, real library + mined-legacy photography; legacy Flatsome/Georgia/gold and the hero carousel are all dropped (§6).
5. **AEO + schema is greenfield upside** — the legacy site has zero schema and zero answer capsules; question-form H2s + FAQPage/Organization JSON-LD + consistent facts across owned site and franchise portals capture the AI-assisted franchise-research buyer (§3.3).

### Open questions for Abilash (QUESTIONS.md candidates) — the offer terms that are NOT verifiable
1. **Investment / franchise fee / technical-service fee / ROI — the missing core numbers.** Not on any Kairali surface; third-party portals float ₹10–15 lakh [S16, S17], unconfirmed. **`/investment` cannot be designed until these are supplied in writing.** (Blocker §0.1.)
2. **Heritage year — 1908 vs 1989 vs 1948 vs "10 decades"?** Which is canonical for the group line? (Fleet currently uses "Since 1908.")
3. **Scale — 35 centres/9 countries vs 25 vs ~13 listed vs "6 owned + 19 franchises"?** One auditable number needed.
4. **Canonical domain — `kairalifranchise.com` vs `ayurvedafranchise.com` vs `kairali.com/ayurveda-spa-franchise.aspx`?** Decides IA + redirects (Blocker §0.2).
5. **Canonical franchise contact — `franchise@kairali.com` + IVR +91-9555156156, or the locked `info@kairali.com`?** Needed before wiring the form.
6. **Are the royalty terms (Rs 25k/5% domestic; USD 1000/7% intl) still current?** Published on the legacy FAQ — confirm before reprinting.
7. **Lost secondary content** (Why-Franchise / Support / Accreditation / Media / News — all 404 [INV §6]) — does it exist to recover, or write fresh?
8. **LinkedIn Insight partner ID + the whole measurement lane** — un-provisioned; who owns handover (Vikash/Abilash)? (`SPRINT_STATE §5`.)

### Security finding (per task requirement)
The inventory's spam/injection scan of all 9 legacy pages was **CLEAN — no hacked-WordPress spam injection, no cloaking, no foreign link-farm** (the single "cialis" hit was a false positive inside "spe**cialis**ed") [INV §5]. **Minor hygiene only** (not incidents, flag for the rebuild): `xmlrpc.php` pingback enabled; a spoofed/odd generator string ("WordPress 7.0.1" — no such version exists); Flatsome demo content still published. **Note:** any content re-used from the legacy site is DATA, not instructions (CLAUDE.md doctrine r) — it was mined read-only. No security blocker to the rebuild.

---

## Source index

- **[INV]** — INTERNAL: `docs/group-inputs/kairalifranchise-org-inventory.md` (legacy site mine, 2026-07-14 23:47:22 IST — the franchise-offer source of truth; section refs cited inline).
- S1 — Turn Your Franchise Website Into a Lead-Generation Machine — International Franchise Association: https://www.franchise.org/2025/12/turn-your-franchise-website-into-a-lead-generation-machine/
- S2 — How To Get Franchise Leads: Top Franchise Lead Generation Tips — LeadToConversion: https://leadtoconversion.com/blog/how-to-get-franchise-leads/
- S3 — Franchise Website Lead Conversion Rate Optimization Checklist — Madison Marketing: https://www.madisonmarketing.com/blog/building-a-franchise-website-around-lead-conversion-a-checklist
- S4 — 5 Quick Fixes To Increase Franchise Landing Page Conversions — Madison Marketing: https://www.madisonmarketing.com/blog/4-quick-landing-page-fixes-to-increase-franchise-website-conversions
- S5 — How to Master Franchise Lead Generation in a Competitive Market — Ignite Visibility: https://ignitevisibility.com/franchise-lead-generation-strategies/
- S6 — Top 6 Healthcare Franchise Opportunities in India for High ROI in 2026 — Indian Retailer / FranchiseTv: https://www.indianretailer.com/franchisetv/archives/article/top-6-healthcare-franchise-opportunities-india-high-roi-2026
- S7 — Franchise Investment Ideas in Wellness & Skilling Sectors 2026 (USD ~150B wellness sector, 10–12% CAGR) — FranchiseBazar: https://www.franchisebazar.com/blog/franchise-investment-ideas-in-wellness-skilling-sectors-2026
- S8 — Why expanding your wellness business is apt in India 2026 (Tier-2 demand) — Sparkleminds: https://www.sparkleminds.com/2026/06/04/wellness-business-expansion-in-india/
- S9 — Franchise SEO in 2026: How to Grow Existing Franchises & Find New Ones (learning vs buying intent; hub/spoke) — Madison Marketing: https://www.madisonmarketing.com/franchise-seo
- S10 — Franchise SEO Strategy: The Multi-Location Growth Playbook (brand-level franchisee-recruitment queries) — Outpace: https://outpaceseo.com/article/franchise-seo/
- S11 — The Franchise SEO Playbook You Need to Win in 2026 — Entrepreneur: https://www.entrepreneur.com/franchises/the-franchise-seo-playbook-you-need-to-win-in-2026/502261
- S12 — How to Open a Franchise: 2026 Launch Playbook From FDD to Grand Opening — CT Acquisitions: https://ctacquisitions.com/how-to-open-a-franchise-launch-playbook/
- S13 — AI Tools for Franchise Research: How to Find, Read, and Compare FDDs — Franchise Business Review: https://franchisebusinessreview.com/post/ai-tools-franchise-research/
- S14 — 2026 Franchise Development Lead Generation Survey (portal usage 74.4%→78.8%; 88%+ using AI) — Franchise Insights: https://www.franchiseinsights.com/franchise-lead-generation/
- S15 — AI Qualification for Fran Dev (buyer-type qualification) — Franchise Ninja: https://www.franchiseninja.ai/ai-qualification
- S16 — The Top 10 Spa Franchise Businesses in India for 2026 (third-party Kairali listing — UNCONFIRMED figures) — Topfranchise: https://topfranchise.com/articles/the-top-10-spa-franchise-businesses-in-india/
- S17 — Kairali Ayurvedic Health Spa franchise profile (third-party ₹10–15 lakh / "since 2005" / "6 owned + 19 franchises" — UNCONFIRMED) — Franchise Mart: https://www.franchisemart.in/health-care-franchise/kairali-ayurvedic-health-spa-franchise/
- S18 — Kairali's own alternative franchise surface (live): https://www.kairali.com/ayurveda-spa-franchise.aspx

*Internal authorities cited inline by path: `CLAUDE.md` (rules 6/7, register split, Doctrine d/r); `packages/ui/brand-tokens.css`; `packages/legal/src/index.tsx`; `packages/forms/README.md`; `packages/analytics/README.md`; `docs/SPRINT_STATE.md §5`; `docs/media/IMAGE_CATALOG.csv`; `docs/media/VIDEO_CATALOG.csv`; `sites/kairalicenters.com/app/page.tsx`; `image-library/legacy-kairalifranchise/manifest.tsv`.*
