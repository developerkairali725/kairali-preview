# Fleet QA/QC audit tail — routed fix-point summary (DRAFT for Abilash's morning review)

Compiled: 2026-07-16 19:52:00 IST · Source: the 9 tail audits in this folder (evidence-linked; findings only, per D-TWO-LANE — no fixes applied, nothing sent to the team without Abilash's confirm; batch-2 precedent).

This completes the whole-fleet sweep: every live content-bearing Kairali property now has a dated audit on record (batch 1: kairaliproducts.in · AHV · villaraag; batch 2: kairalicenters · kairali.guru; tail: the 9 below). Triage of the remaining ~32 live-but-parked domains is appended when the workflow completes.

## THE CROSS-FLEET FINDING — one delegation, many sites

**"© Kairali Ayurvedic Group Since 1908" is live sitewide on at least four more properties**, all ruled WRONG by the 16 Jul decision (1908 = family lineage only; the Group = 1989):

| Site | Where | Scale |
|---|---|---|
| whyayurveda.org | theme footer, every page ×2 (+ frozen "© 2021") | ~2,330 URLs, ONE theme edit |
| ayurvedafranchise.com | footer, 12/12 pages (+ "centenarian Ayurvedic brand" hero claim) | sitewide |
| arogyashala.co.in | footer ×14 pages | sitewide |
| kairali.com | logo/footer/3 pages, located precisely in its audit | sitewide |
| (healing.recipes legacy) | footer — replaced by the rebuild in PR #81 | dies at cutover |

Plus the same claim-class on kairaliproducts.com: THREE mutually inconsistent typed age values (100 / 111 / 115 years) on one store.

**Proposed single delegation:** one email to the WP/webmaster lane (Deepu + webmaster@) listing the exact footer strings per site and the approved replacement phrasing ("a family tradition since 1908" / drop the group claim), plus computed copyright years. Abilash approves wording first.

## PER-SITE HEADLINES + PROPOSED ROUTE

**kairaliproducts.com (intl Shopify store — top revenue surface of the tail)**
1. "Where to buy" page: all 9 marketplace logos broken (dead Magento hotlinks to .in), plus Amazon misspelled "Amazone", duplicate/mismatched labels → Deepu (upload to Shopify Files, repoint) + Anupam/Astha (labels).
2. 100/111/115-years contradictions → Anupam/Astha copy fix per PR #65 phrasing; Abilash sign-off.
3. Public email conflict (support@/info@kairaliproducts.com vs locked info@kairali.com) — same as .in store; ONE Abilash ruling covers both; no edits until then.
4. Rule-r note: `/agents.md` agentic-commerce file addresses AI agents (standard Shopify boilerplate; quarantined, not acted on).

**kairali.com (flagship, legacy ASP.NET)**
1. **"Cure your ailments … with No side effects" — sitewide on all 10 sampled pages.** A disease-cure + no-side-effects claim during the GST SCN, on the flagship. Highest-priority copy kill of the whole tail → Abilash decides owner (site is agency/legacy-managed); wording via compliance floor.
2. KTAHV sections carry clinical-lock banned words → same lane as the existing Anupam banned-word delegation (14 Jul).
3. "Since 1908" group claim located precisely (see cross-fleet item).
NOTE: the FACTORY rebuild in sites/kairali.com also still carries Since-1908/nine-countries/unconfirmed-name copy — flagged as a spin-off fix task this evening (pre-flip blocker, our side).

**whyayurveda.org (central blog, ~2,330 URLs)**
1. Footer: Since-1908 + frozen "© 2021" — one theme edit fixes all URLs → Deepu.
2. (Physician-schema Ashika/Ashikha contradiction — already a QUESTIONS item; audit adds evidence URL.)

**ayurvedafranchise.com (canonical franchise lead-gen)**
1. **Homepage `<title>` is "Kairali – Just another WordPress site"** — the default WP tagline on the lead-gen domain's SERP title; zero meta descriptions, zero OG, zero schema sitewide → Deepu (Yoast/RankMath basics), copy from Anupam.
2. FAQ answers the investment question with two links that both 404 → content fix rides Q-FR-MONEY (Abilash's gate-behind-form ruling still pending).
3. Royalty/area figures printed on the live site are now inventoried verbatim in the audit (Q-FR-ROYALTY evidence — publish/retract is Abilash's call).
4. Footer Since-1908 + "centenarian brand" hero (cross-fleet item).

**arogyakendra.com (legacy IIS, still live while our rebuild awaits DNS)**
1. Mixed content: homepage slider loads http:// third-party assets — broken for every HTTPS visitor → moot at DNS flip; flag to Abilash: flip the finished Factory rebuild instead of fixing the corpse.
2. Locked-facts register FAIL (see audit) — same recommendation: cutover beats repair.

**arogyashala.co.in**
1. **The store-locator page — the site's entire purpose — lists ZERO locations** → needs the canonical centres roster (blocked on Abishek, same as everything roster-shaped) or retirement into the forward farm.
2. Footer Since-1908 ×14 (cross-fleet item).

**theblushlounge.com (Sneha's business; restored, holding)**
1. Gallery-page nav links `http://localhost/ram/...` — dev-machine link leaked to production + username leak ('ram' is also a live WP account) → Sunaj (fix template variant, review WP accounts).

**whatisayurveda.org** — no change since the 14 Jul mine; locked facts PASS; replacement-queued (Wave-2 cutover); renewal (28 Sep) with Sunaj.

**ayurvedajournals.com** — frozen CodeIgniter magazine (~2018–22), locked facts PASS, no revenue path; PARK: Abilash to rule keep/redirect at leisure.

## WHAT WAS DELIBERATELY NOT AUDITED
kairali.ai + abhilashkr.com (our own CI-gated Vercel tenants) · healing.recipes (mined separately; rebuilt tonight in PR #81).

## NOT RUN (honest, fleet-wide)
Browser render/mobile visual checks (shared pane; HTTP-level only tonight) · Lighthouse/CWV field data (needs GSC/CrUX per property) · logged-in surfaces. Each audit carries its own NOT RUN list.
