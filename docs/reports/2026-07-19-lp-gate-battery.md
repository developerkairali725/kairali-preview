# LP GATE BATTERY — KTAHV 10-LP set, FIRST battery (PR #145 lane)

*Compiled: 2026-07-19 00:12:00 IST · branch feature/ktahv-lp-front-gates, final battery tip 63ccc64.
The overnight golden-gate battery (docs/reports/2026-07-18-golden-gate-battery.md) recorded this set as
NONE coverage (previews behind SSO); the owner disabled Deployment Protection ~22:45 IST and this lane ran
the set's first battery. The PR #145 body carries the authority copy of the verdict table + the Dr-Deepu
sign-off list; this report is the committed record.*

## Result in one line

Machine layer ALL-GREEN ×10 · GO-science strict PASS ×10 · Beauty v2 strict PASS ×10 (two at pass 2
after real fixes) · Gate-2 external-AI blocked-pending-human on the recorded verdict-alternation ruling
(Q-GATE2-LP-BATTERY) — six real defects caught and fixed in-lane; every clinical item flagged, none
rewritten.

## Coverage

- Route reconciliation vs D-LP-LIST: 10/10, no extras (slug mappings + the wellness-resort slug-vs-lock
  tension flagged to Vikash in STRATEGY.md — deliberately unresolved here).
- Fresh preview-only deploys of the branch tip at each fix step (c7df440 → 2711105 → 63ccc64); screenshots
  always match the serving tip for the pages they evidence; 32 full-page screenshots committed under
  launches/ktahv-lp-batch/screens/.
- Machine checks on SERVED HTML + live browser (dom-evidence-2026-07-18.md §§1–10): noindex,nofollow ×10 ·
  sitemap excludes /lp/ · banned-word scan CLEAN (EN + DE senses) · exactly one conversion goal
  (2×whatsapp_click + 1×enquiry_submit) · events verified FIRING via live gtag capture · consent checkbox
  required + privacy links · one H1 per route · +91 92898 38797 everywhere, …38777 nowhere · clinical
  schema family only (MedicalClinic/Organization/PostalAddress/WebSite).

## What the battery caught (real defects, fixed in-lane — 6 fixes)

1. **Two legacy campaign-banner heroes with marketing text baked into PIXELS** — invisible to every text
   lint: "25% Summer Special Off on all packages" + a World Luxury Spa Awards badge
   (therapy-south-india.jpg) and "Your Journey to Wellness Begins Here" + a painted BOOK-NOW
   pseudo-button (kairali-brand-header.jpg). Unverified offer claims (HARD GATE 6) + banned words in
   pixels. Swapped for clean mined photographs (commit 2711105).
2. **STRATEGY.md carried no GO-science declarations** — the exact root cause of the sibling battery's
   three FAILs (GS-MCB-6/GS-MOA-3). §1b lift added from the committed self-check (c7df440); nothing
   invented.
3. **"International patients usually start by email"** — unverified behavioural-majority claim, softened.
4. **weight-loss B2/B6 (beauty)** — the only LP with zero Kerala/place imagery + a generic Panchakarma
   cred chip on the weight-loss avatar's page → place band + page-specific creds; beauty pass-2 PASS.
5. **cleansing-centre B2 (beauty)** — same place-band gap, same fix; beauty pass-2 PASS.
6. **treatment-in-kerala duplicate hero photo** — surfaced by a disproved "wrong hero" claim; the
   duplication was real, band re-led with the other campus photograph.

## Reviewer conduct (Gate 2) — Q-GATE1 pattern reproduced and ruled

Golden LP: 4 recorded passes on identical bytes — p1 dual-FAIL on legitimate image-pipe evidence gaps
(ALL answered with machine evidence), then GPT PASS/PPX FAIL → GPT FAIL/PPX PASS → GPT PASS/PPX FAIL.
Both auditors individually PASSed the artifact; no page-defect claim survived scrutiny. Ruling (3-pass
convergence rule, rule g intact): loop stopped, gate recorded blocked-pending-human, remaining nine LPs
one recorded pass each. Full text: launches/ktahv-lp-batch/panchkarma-treatment/design-review/post-build/
GATE2-VERDICT-REVIEW.md · owner question: QUESTIONS.md Q-GATE2-LP-BATTERY (extends Q-GATE1-LP-GOLDEN).

## Blocked-pending-human (recorded honestly, never weakened)

- Gate-2 dual-PASS mechanics → owner ruling (Q-GATE1-LP-GOLDEN / Q-GATE2-LP-BATTERY).
- HARD GATE 7 → Dr. Deepu John sign-off list, 8 clusters (PR #145 body): pain-management therapy cards +
  FAQs · golden five-folds + FAQs · weight-loss DMR frame + video · cleansing sequence · programme-family
  descriptions (packages/treatment-in-kerala) · DE therapy copy (+ native/legal check, D-DEFR-AI-REVIEW) ·
  cross-page process claims ("every programme…", "never self-selected") · comparative-modality lines.
- Vikash per-URL redirect/slug plan (incl. wellness-resort-kerala slug-vs-lock; A/B twin inventory).
- Owner-gated facts left EMPTY not invented: tariffs, 300K+/87% stats, patient photos (consent),
  28-award wall, "TripAdvisor Hall of Fame" phrasing verification, GA4/GTM IDs.

## ERRORed production-target deployment — cause (briefed per lane mandate)

dpl_5FUnpJfwAmnTkaFcRXNavw9XPwCy (18 Jul ~20:53 IST, earlier LP lane, commit 17c366f, dirty tree):
a CLI `--prod` deploy whose upload lacked the monorepo root/pnpm lockfile → Vercel ran `npm install` →
`EUNSUPPORTEDPROTOCOL: Unsupported URL Type "workspace:"` → build died; **nothing went live**. The lane's
preview retry 81s later uploaded repo-root (pnpm detected, 1549 files) and succeeded. Lessons banked:
deploys run from repo root; LPs stay preview-only (the `--prod` flag violated that rule and failed
harmlessly — this battery deployed preview-only throughout).

## Auto-merge

Left UNARMED: D-AUTOMERGE-TIERS is cited once in DECISIONS.md (18 Jul 19:47 block) but its tier
definition exists nowhere in the repo — unverifiable coverage is no coverage. The agent never merges its
own PR regardless (HARD GATE 9).

## Unverified / residual (Checker pass, doctrine f)

- Lighthouse/CWV per-LP: NOT run this battery (registry row lighthouse-budgets rides the CI matrix at
  host-site level; the beauty gate's R1 asks are recorded as advisory) — next lane item.
- factory-spec suite + compliance-lint + brand-lint: enforced in CI on the PR, not re-run locally here.
- The lazy YouTube iframes render blank in full-page captures (embed verified in served HTML §2) — a
  capture artifact, on record.
- Desktop hero crop on consultation-pulse.webp favours the room over the subjects at 1440px — advisory,
  logged in evidence, no fix shipped (photo-crop polish is sub-threshold per POLISH TIME-BOX).
