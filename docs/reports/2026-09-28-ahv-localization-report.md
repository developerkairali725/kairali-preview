# AHV localization + English feedback — worker report (round 6)

Task WOPS-AHV-FINAL-DRAFT-20260924-001. Worker: Claude CLI (claude-opus-5-5). Updated 2026-09-28 14:15 IST.
- Branch `codex/ahv-final-draft-20260924` @ `bd7ac80b`, pushed fast-forward to `codex/ahv-english-staging-20260915` (PR #309) at 14:11:34 IST (`04917cb1..bd7ac80b`, 25 commits). PR #309 remains subject to its protected review gate; no bypass.
- Round 4 report preserved in git history; interim report at `logs/REPORT-interim-20260925.md`.

**Status: candidate on protected staging, for parent QA — NOT release-ready.**

## Protected staging (for parent independent QA)
- **Alias:** https://ahv-final-staging.vercel.app → **dpl_D3xDxk1vnTZVmTUY1cs7F8u9pcFM**, target preview, aliased 2026-09-28 13:59:22 IST. Built from `bd7ac80b` (vercel build: 2,917 static pages; logs `logs/vercel-build-20260928-r6.log`, `logs/vercel-deploy-20260928-r6.json`).
- **Protection (read back):** anonymous → 302 to Vercel SSO; `x-robots-tag: noindex, nofollow, noarchive, noimageindex` on pages; robots.txt `Disallow: /`.
- **Rollback (previews):** dpl_HEZxY3oq7fFM1cA2wXfhJH3nU743 (r4) → dpl_6UHi7gcLA1mbsq7AVsrvh263FAfs → …
- **Hosted evidence:** `hosted-ef-sweep-r6-prealias/` (deployment URL) and `hosted-ef-sweep-r6-alias/` (alias) — **42/42 PASS** on each. Each row checks status, broken images, every internal link fetched in-page, and fix-proof text: EF items, TF-08/19, the owner-decision rows (BDM, facilities, training, defence, all offers), EF-21 and EF-24 final landing paths (EN + DE), TF-18 select index (treatment 1, bogus 0), and the search notice.
- **Redirects on the alias:** /ayurveda-gallery/ → 301 /treatments-gallery/; /de/ayurveda-gallery/ → 301 /de/behandlungsgalerie/; /prav-simona-yoga-retreat/ → 301 /prav-simona-monsoon-yoga-retreat/ (single hop).

## Round 9 (2026-09-28 16:18:33 IST) — CURRENT staging for parent QA
- **Alias** https://ahv-final-staging.vercel.app → **dpl_BCSkEEp3gnhnkpTDQFFq3X2XqyXs** (preview), built from **`e5b72188`** (pushed to PR #309). Pre-alias hosted sweep **44/44 PASS** (`hosted-ef-sweep-r9-prealias/`); /experience/ hosted at 1440/1920/2560/390 in `hosted-layout-r9/`.
- **Adds over r8:** /experience/ — the row was laid out for article + sidebar and the sidebar is retired. Its nine image cards now form a 3-column grid on large desktops (68% → 17% left-only; only /experience/ changed among 108 routes; 0 overflow).
- **Still ≥40% left-only at 1440:** /ayurveda-treatment/ and /special-offers/ (already on the new grid; the remainder is image/list sizing), /givefeedback/ (native form page — form lane), /karkidaka…html.

## Round 8 update (2026-09-28 15:47:44 IST)
- **Alias** https://ahv-final-staging.vercel.app → **dpl_62HRMitbzQDHPEPomhVaM4gszhpR** (preview), built from **`241d14d8`**, pushed to PR #309 (`3702baa7..241d14d8`). Pre-alias hosted sweep **44/44 PASS** (`hosted-ef-sweep-r8-prealias/`). Hosted layout screenshots at 1440/1920/2560/390: `hosted-layout-r8/` (and `hosted-layout-r7/`).
- **/packages/ owner regression:**
  - The lotus motif is no longer stretched into two fragments; three sibling pages had the same bug and are fixed too.
  - The duplicate WordPress category toggle is removed; it held 5 links that duplicate the family header, and one returned 404.
  - Commits 9f1d8020, 06700183. /packages/ keeps its original layout (241d14d8).
- **Large-desktop composition for secondary families (owner: "on large desktop screens… make sure it is done"),** measured with `tools/desktop-space-audit.mjs`:
  - **article-reader** (108 routes): routes with ≥40% of their height as left-only bands went from 65 to 5, none worse, 0 overflow at 1440/1920/2560 (3702baa7, 241d14d8).
  - **OPD:** 54% → 10% (f27e7420).
  - **Retreats:** Ananda Lahari 64 → 4, Ashtanga 61 → 14, Back to Roots 67 → 0 (47c687b2).
  - **Defence:** the aside is now sticky (fa45aa9b).
  - **Offers:** two-card grid (82e42b6e).
  - Mobile is unchanged (every rule applies at ≥1180px only).
  - Still ≥40% and not yet reworked: /ayurveda-treatment/, /experience/, /givefeedback/, /karkidaka…html, /special-offers/ (different structures). Photo collections (29%) are left as designed.
- **Offers hub:** "Minimum stay: No minimum stay" contradicted the owner's rule and now reads "3 nights"; translated in b-0617 (82e42b6e, e0424dac).
- **Flags (not changed; owner/facts):**
  - The defence page's legacy "Kerala retreat in 1997" conflicts with the locked 1999.
  - OPD: "over 35 centres worldwide" and reception number +91-75938 61015 are unverified.

## This round (owner decisions, OWNER-DECISIONS-LATEST.md)
Details per decision: `owner-decisions-implementation-20260928/LEDGER.md`. Per-EF audit: `EF-AUDIT-20260928.md`.
- **Done:**
  - BDM vacancy closed (4544b9af);
  - facilities facts (b1f0a8d8);
  - training format and dates (a2c8e42e);
  - defence terms (26d7cea4, 697167dd);
  - staggered bands and rules on all duration offers (153e99a0);
  - design-review notes off served pages (26f6e8fd);
  - EF-21 (4be56c9f);
  - EF-24 (9963ea47);
  - TF-18 treatment preselect (7709c59a).
- **Localized:** 57 new EN units (including image batch-1 alt/captions) → b-0614..b-0616 × 12 locales, 36/36 accepted, 0 blocked, revalidate 7392/7392 (8bdd28f6, 299fd816).
- **SSR:** EN 234/234 and 12 × 220/220, 0 failed; defence page re-snapshotted in 13 languages after the prop-default fix (02684760, bd7ac80b). The EN snapshots reference no replaced batch-1 image file.

## Not done, with the exact reason
1. **Clinical batches 1–3 and the cancer-page internal notes:** the edit was refused by this session's auto-mode safety classifier ("Modify Shared Resources"). Per its instruction the worker did not route around it. Prepared but not run: `tools/repair-clinical-batches-20260928.mjs` (uncommitted). It writes per file, so run `--check` first. Mapping and the exact one-line cancer change are in LEDGER.md. Owner wording approval ≠ Dr. Deepu John's sign-off (HARD GATE 7).
2. **STAFF-01 portraits:**
   - Consents read for 5 doctors.
   - This Drive connector cannot list folder 1PvekaZE41_zDKwgRrJeRjwWdrGN5m_xB, so the 26 Sep uploads can't be found by ID. Needed: portrait files or their IDs.
   - Dr. Adhina U.B. and Dr. Aashitha P.S. are not yet on the site.
3. **TF-18 training buttons:** the enquiry form has no training option; adding one changes the lead form (Deepu).
4. **Owner/clinical items unanswered:**
   - EF-08 "12+ years geriatrics" claim;
   - EF-19 batch-02;
   - villa sizes (placeholders kept in staging by owner ruling);
   - EF-05 physical iPhone check.

## Tests, gates, lint
- Site unit tests **165/165**.
- **Test intent changes, flagged, not self-approved:** redirect-map test now expects 20 redirects, with explicit EF-21/EF-24 owner-ruling branches.
- **Release gate:** FAIL only on the 11 clinically held units (unchanged).
- **banned-string-lint:** exits 2 on pre-existing findings in 72 tracked files (l10n outputs, units.json, glossary — unchanged since the 04917cb1 push). This round introduced 0 new findings; the one it caused, in chrome.js, was fixed.
- **No production/DNS action, no emails, no credits, no tracking activation.** Deepu's form transport untouched; only view template lines were changed where his branch edits the logic line.
