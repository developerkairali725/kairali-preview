# FULL GATE BATTERY — golden pages · per-site × per-gate verdicts

*Live battery report, 2026-07-18 23:10:00 IST — supersedes the 22:14:32 IST salvage compilation
(commit a590d66): the battery lane did NOT die, it was cut by the credits outage and resumed;
coverage marked PARTIAL/NONE there is now FULL for kairaliorganic, villaraag and the bulk pair
(bulk audited at the post-numbering-fix lane commit 8d77b2a). The salvage report's §2 owner-
feedback log and §4 loose ends are carried forward below unchanged in substance.*

Owner order (in-chat, after viewing the golden pages: "they all look good at first glance"):
**apply ALL the gates and let me know** — he re-reviews on this report, especially the Akshar
(go-science) and beauty results. Report-only battery: **no fixes applied**; findings route to
the lanes. Every audit is hash-bound to FRESH screenshots of the LIVE previews (desktop
1440×900 + mobile 390×844, viewport + full-page) captured this session and committed.

Gates run per page:
- **G2** — `scripts/design-review.mjs --stage post` (element-by-element vet, CLAUDE.md v1.11;
  checklist seeded per site from the generated checklists; ChatGPT gpt-5 + Perplexity
  sonar-pro, both SEEING the images).
- **GS** — `scripts/go-science-audit.mjs` (D-GO-SCIENCE-GATE + look/ROI amendment; 16 criteria,
  content AND look blocking; evaluating agent: this battery session, vision, findings
  hash-bound).
- **BEAUTY** — `scripts/beauty-audit.mjs` against BEAUTY_DOCTRINE **v2** (owner What-is-Beauty
  paper; PR #161 branch merged into this battery branch BEFORE any beauty verdict; entity +
  page-type declared per doctrine; unmapped domains use the closest chapter, declared loudly).

Advisory lane (D-EXTREVIEW-OWNER-FACTS) applied throughout: reviewer doubt on owner-ruled facts
is ADVISORY, never blocking. Canonical facts sheets attached to every run (NEW sheets compiled
from DECISIONS for ayurvedafranchise + kairaliequipment; committed).

## THE TABLE

| Site (entity · page-type) | G2 post-build | GO-science (Akshar) | Beauty v2 | Most actionable finding |
|---|---|---|---|---|
| **theblushlounge.com** (villa-raag closest · homepage) | **FAIL** | **FAIL** (14/16 criteria PASS) | **FAIL** | G2: consent banner hides the four trust marks at desktop first paint + mobile hero overlay CTA drops the number · GS: no signature-MCB/SBJ-stage declarations in STRATEGY.md, NDFF inferred (needs owner/Sneha ratification) · Beauty: B9 trust-before-ask at first paint. Perception + authenticity (B1/B6) judged strong. |
| **ayurvedafranchise.com** (corporate closest · partner) | **FAIL** | **FAIL** (14/16 PASS) | **FAIL** | G2: chat bubble visible while consent banner open (consent-yield defect, screenshot-proven); royalty-cadence fine print needs provenance · GS: declaration gaps only — NDFF via the cited competitor-set research PASSES · Beauty: B18 corporate must-answer routes not deferred-by-name; hero "hospital behind it" phrasing = ADVISORY wording call for the owner. |
| **kairaliequipment.com** (kappl-b2b · homepage) | **FAIL** | **FAIL** (14/16 PASS) | **FAIL** | **REAL CATCH:** the build reasserts the equipment-identity equivalence the pass-4 owner ruling §6 removed — page.tsx:66 ("the spec our own therapists treat on") and :401–402 ("the equipment we ship is the equipment our own physicians and therapists work on every day"). Delete/replace with the ruled wording + guard test. Mobile sticky utility bar exists in code but is consent-banner-occluded in captures (needs post-consent evidence). |
| **kairaliorganic.com** (kappl · homepage) | **FAIL** | **FAIL** (14/16 PASS) | **FAIL** | YMYL: the nine ledger descriptors ("for Fractures & Sprains" etc.) must be confirmed label-verbatim or softened; B18: ledger entries neither link to their (approved-sitemap) PDPs nor state deferral. Chemical-free-absolute doubts are owner-ruled D3 → advisory. |
| **villaraag.com** (villa-raag · homepage) | *not re-run — existing Gate-1 evidence referenced: pass-4 dual FAIL on record; lane owes a passing design pass* | **FAIL** (14/16 PASS — cleanest page of the battery; MoA/NDFF fully declared via the buyer-journey doc) | **FAIL** | Beauty B9: hero CTAs precede visible trust proof (press line below CTA row / under consent banner at first paint); GS: only the two fleet-wide declaration criteria fail. |
| **bulkayurvedaoils.com** (kappl-b2b · homepage) — POST-fix @8d77b2a; step numbering verified single (pixels + deployed CSS) | **FAIL** | **FAIL** (14/16 PASS) | **FAIL** | G2: RFQ form lacks the destination/company qualification fields the strategy names; form-routing + ledger-to-register match need machine evidence. Hero/certs/heritage/steps judged done-to-standard by the auditors. |
| **bulkayurvedaproducts.com** (kappl-b2b · homepage) — same post-fix commit | **FAIL** | **FAIL** (14/16 PASS) | **FAIL** | G2: engagement-model rows + counters vetted clean; consent banner overlaps the counter labels at first paint (fleet class); machine-evidence items (form routing, consent-yield) outstanding. |
| **KTAHV LP batch** (healing-village · landing) — golden LP /lp/panchkarma-treatment, audited from a LOCAL build (preview is team-SSO-gated; owner toggle outstanding) | *G2 not in battery scope for LPs — Gate-1 sits on the LP lane (7 recorded passes + Q-GATE1-LP-GOLDEN conduct question); Gate-2 lands with the lane's ship pass* | **FAIL** (14/16 PASS — nearest-to-compliant strategy of the battery) | **FAIL** | GS: the strategy table already carries awareness labels for LPs #1/#3/#9 — row 2 just needs its one-word stage label ("product-aware") + the per-LP MCB anchors lifted from the self-check · Beauty: B18 — international patients' practical answers (stay/routine/travel/after-booking) neither on-page nor deferred to named pages; judge PRAISED the clinical framing (B1) and register hold. |

**Verdict legend:** strict script verdicts (exit 0 = PASS · 2 = FAIL); ADVISORY items live inside
the evidence files' recommendation lanes. **Bottom line: all 8 targets audited — every audited
gate is a pass-1 FAIL with an itemized fix list.** That is the loop working as designed
(critique → judge → revise, iterate to dual PASS); no gate was weakened (rule g).

**LP spot-checks (report-note scope, per the extension order — golden LP got the formal gates):**
- **/lp/weight-loss** — the DMR-conflict resolution holds on the rendered page: hook promises the
  METHOD never a number ("a programme, not a promise"), the how-much-will-I-lose FAQ answers with
  the law's honesty, no outcome badges anywhere. Register clean. Residual: proof density is low
  (legacy patient photos withheld pending consent — correct under the rules; disclaimed video is
  the one proof leg).
- **/lp/behandlung-in-kerala (DE)** — certificate-forward short page as the DE strategy row
  declares (product-aware); NABH/Clinical-Establishment chips render in German; banned-sense DE
  words (Kur/Urlaub/Luxus) absent from the rendered page. Residuals already flagged by the lane:
  EN form labels (i18n gap) + native-DE review required before any DNS-live moment (D-DEFR-AI-REVIEW).

**LP battery harness note (honesty):** the golden-LP beauty run's --facts flag was mistakenly
pointed at the kairaliequipment facts sheet (copy-paste error, recorded in the evidence file's
metadata). The verdict is unaffected — both blocking findings (B17 strategy readiness, B18
must-answer deferral) are doctrine-derived and cite nothing from that sheet — but the lane's
pass-2 should attach a proper KTAHV-LP facts sheet (compile from DECISIONS: D-LP-LIST, LP-system
laws, Vikash URL freeze).

## Cross-site structural finding — one fix moves every GS cell

**Every strategy stack predates D-GO-SCIENCE-GATE** (gate landed ~19:56 IST; strategies approved
~18:00–19:05). No bound STRATEGY.md declares a **signature MCB / anchor secret desire**
(GS-MCB-6: no declaration = FAIL) or an **SBJ/awareness stage** (GS-VIS-3: same law); NDFF
sources are declared only for villaraag (buyer-journey doc) and, via research citations,
franchise/equipment/bulk. The built pages themselves pass 13–14 of 16 criteria each — **the
failure lives in the strategy layer, not the pages.**

**Fix now (minutes per lane):** add a "GO-science declarations" block to each
`launches/<site>/STRATEGY.md` — signature MCB/secret desire · avatar block (copy from BRIEF) ·
SBJ stage · NDFF source (owner-ratified where inferred, e.g. blush) — then re-run pass 2. The
LP batch is nearest to compliant: its STRATEGY already carries awareness labels for LPs #1/#3/#9;
the golden LP's row needs its label ("product-aware") added.

## External-auditor reliability note (judge-the-critique duty)

Both external auditors produced findings **refuted by page source + live HTML** in this battery:
- theblushlounge: BOTH auditors reported a footer email + working-hours block. The footer has
  neither (chrome.tsx source; live-HTML grep: zero hits). Their #1 "blocking" finding is false.
- ayurvedafranchise: Perplexity attributed "35 healing centers in eight countries" to the page —
  the string exists nowhere on the page or in the live HTML (its own web-search context leaked
  into the page audit).
Verdicts stand as recorded (the enum is the verdict), but these findings are marked
FALSE-POSITIVE for the lanes. Recommendation to the gate owner: post-build asks should require
auditors to quote the pixels/DOM they saw; source-refuted findings become a tracked
auditor-defect class.

## Fix now vs full-build split

**FIX NOW (blocking, cheap, before owner sign-off):**
1. kairaliequipment — delete/replace the two equivalence sentences (page.tsx:66, :401–402) with
   the pass-4 ruled affiliation wording; add a guard test so it cannot return.
2. ALL sites — the GO-science declarations block per STRATEGY.md + go-science pass 2.
3. theblushlounge — mobile hero overlay CTA → full approved string with the number; evergreen
   (or date-managed) academy creative.
4. Fleet-wide first-paint class — consent banner must not cover hero trust elements, and chat
   surfaces must stay hidden while the banner is open (blush trust bar · franchise bubble ·
   organic bubble · villaraag press line · bulk-products counter labels). One shared fix in the
   consent/loader stack, then post-consent evidence captures for the "needs evidence" items.
5. bulkayurvedaoils — add destination/company fields to the RFQ form per the strategy spec.
6. kairaliorganic — confirm the nine descriptors label-verbatim or soften (YMYL surface).

**FULL-BUILD lane (next build phase, not tonight):**
- Machine-evidence pack per site: store-first form submission proof, consent-yield network log,
  Lighthouse/CWV evidence (beauty R1) — the whole "needs evidence" class.
- franchise: corporate must-answer routes (leadership/governance/company architecture) are
  planned pages — state the deferral on-page or in strategy until they exist.
- organic: the nine PDP links (routes are in the approved sitemap).
- blush: verified-testimonial block on Sneha's confirmation; hi-res shoot swap (D-BL-INTERIM).
- villaraag: design-review pass-5 to dual PASS, then Gate-2 post-build.
- equipment: commercial-terms deferral block above the RFQ; real-catalog swap remains the
  preview-lock condition (D-EQ-CATALOG).
- bulk pair: RFQ/intake qualification fields (destination/company · engagement model/category/
  scale) — the shared G2+beauty catch on both poles; products also owes the visible counters
  provenance line and the founded-1989 separation next to "since 1908" in the rendered footer.
- KTAHV LP batch: the B18 "practical details" module (stay/routine/travel/after-booking, linked
  to named sibling pages) before the form; Gate-2 post-build with the ship pass; loaded-state
  capture of the patient-voices embed (lazy iframe renders blank in full-page captures).

## Owner feedback on record, applied (carried from the salvage compilation)

- "All look good at first glance" (in-chat ~22:00 IST) — recorded; the battery's element-level
  verdicts complement, not contradict, his read.
- Akshar (go-science) + beauty verdicts wanted especially — both columns above are those gates.
- Bulk step-strip double-numbering (owner report) — FIXED pre-battery (8d77b2a); this battery
  re-audited the bulk pair AT that commit and verified single numbering in pixels + deployed CSS.
- kairaliorganic vetoed hero copy line — fixed at build, guarded (merged #156).
- D-20260718-16 (blush Instagram full-res re-mine) — outstanding owner-session task; interim
  640px set per D-BL-INTERIM.
- LP preview SSO toggle — owner dashboard action; the reason the LP battery ran local-build.

## Loose ends routed (carried from the salvage compilation)

- ayurvedafranchise `design_source` row: pending in the pre-#153 ledger while design_direction
  was approved — mechanical omission from the waiver-night signing; the build lane verifies the
  live #130 stack and signs with the same signature basis if still pending, citing this report.
- Reviewer-conduct issue (Q-GATE1-LP-GOLDEN, goalpost-moving across 7 LP passes) — awaits owner
  ruling; D-18 scoped-rubric implementation queued.
- Two-writer note: the salvage session committed to this branch (a590d66, bcef84b) while the
  battery lane was outage-paused; histories reconciled linearly, nothing clobbered.

## Evidence index (append-only, this branch)

- `launches/<site>/screens/2026-07-18-battery-{desktop-1440x900,desktop-full,mobile-390x844,mobile-full}.png` — fresh live-preview captures (blush · franchise · equipment · organic · villaraag · bulk×2)
- `launches/<site>/post-build-checklist.md` — seeded element checklists (v1.11; incl. bulk pair)
- `launches/<site>/design-review/post-build/2026-07-18-pass1.md` — G2 evidence (blush · franchise · equipment · organic · bulk×2)
- `launches/<site>/go-science/2026-07-18.md` — formal GS evidence, hash-bound (blush · franchise · equipment · organic · villaraag · bulk×2)
- `launches/<site>/beauty/2026-07-18.md` — beauty v2 evidence (same seven)
- `launches/{ayurvedafranchise,kairaliequipment}.com/design-review/context-facts.md` — new canonical facts sheets (DECISIONS-sourced)
- villaraag design gate referenced, not re-run: `launches/villaraag.com/design-review/2026-07-18-pass4.md` + `pass4-facts-sheet.md`
- KTAHV LP batch (LOCAL-build captures): `launches/ktahv-lp-batch/screens/2026-07-18-battery-{panchkarma,weightloss,behandlung-de}-*.png` + `launches/ktahv-lp-batch/go-science/2026-07-18.md` + `launches/ktahv-lp-batch/beauty/2026-07-18.md`

*Battery branch: feature/golden-gate-battery (base origin/main 87bb77e + origin/feature/beauty-owner-paper-merge merged pre-beauty). Report-deliverable rule satisfied; evidence trees are the authority; this table is a generated view of them.*
