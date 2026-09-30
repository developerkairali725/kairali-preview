## Round 10 (2026-09-28 18:43:14 IST): current staging for parent QA

This round covers WOPS-AHV-FINAL-DRAFT-20260924-001, run by the Claude CLI (claude-opus-5-5).

**Status:** a candidate on protected staging for parent QA. It is **not** release-ready: the open items are listed below.

### Where it is

| | |
|---|---|
| Staging alias | https://ahv-final-staging.vercel.app |
| Deployment | `dpl_ARAk9QnGkHawYAABzU95a7iphoy1` (preview), built from `94b9765b`. `vercel build` produced 2,857 static pages. |
| Aliased | 2026-09-28 18:43:14 IST |
| Read-back on the alias | Anonymous requests get a 302 to SSO. Pages carry `x-robots-tag: noindex, nofollow, noarchive, noimageindex`. `/privacy-policy/` returns 301 to `/new-privacy-policy/`. `/enquiry-form/?programme=treatment` returns 301 to `/contact-us/?programme=treatment`. `/prav-simona-yoga-retreat/` returns 200. |
| PR #309 | Fast-forward `a8907186..94b9765b`. No force push and no bypass. The authenticated owner review is still required. |
| Rollback | r9 `dpl_BCSkEEp3gnhnkpTDQFFq3X2XqyXs`, then r8 `dpl_62HRMitbzQDHPEPomhVaM4gszhpR` |

**Evidence** (in the deliverable folder):

- `hosted-ef-sweep-r10-prealias/`: **58/58 PASS**, run against the deployment URL before aliasing. Every row checks:
  - the HTTP status;
  - broken images;
  - every internal link, fetched in-page;
  - fix-proof text or landing paths.
- `local-r10/` contains:
  - the local sweep, 58/58;
  - the footer click-through, 4/4 local and 4/4 hosted (`footnav-hosted-r10.json`);
  - the OPD/CSR screenshots.

The old 44-row sweep does not cover the latest owner decisions. These rows were added this round:

- **MERGE rows (8):** the six merges plus `/enquiry-form-old/`, EN and DE.
- **DUP-012 (2):** two distinct retreat pages. This replaces the superseded EF-24 301 assertion.
- **TF-18 through the merge:** a final path of `/contact-us/`, with the select index at 1 for `treatment` and 0 for `bogus`.
- **FOOTER-13 (6):** home, native, OPD, `/de/`, `/ar/` and `/ja/all-programs/`. Each checks 13 visible items with one current language.

### Per item: honest status

1. **CSR-MAP-ASPECT and PRODUCTS-IMAGE-NAV: done in source, deployed, hosted row PASS** (`96578052`).
   - **Root cause:**
     - A broad `!important` column-image rule stretched every column image.
     - 78 figures had no recorded width, so they rendered at `max-width:0px`, which the stretch rule masked.
   - **Fix:**
     - The broad rule was removed.
     - Real widths and heights were read from the file headers.
     - The renderer falls back to the column width.
     - The maps section is bounded.
   - **Legacy navigation:** the unlabelled WordPress family navs were retired on 19 routes. Their provenance is kept under non-display keys.
   - **Measured:** 108 routes × 1440/1920/2560, plus a 390 regression check.
     - No image was enlarged beyond its designed or natural size. Remaining exceptions are designed elements only: lotus watermarks, heroes and cover crops.
     - Resort map: 1220×686 at 1920.
     - Product photo: 450×320.
     - 0 visible legacy navs. 0 overflow.
2. **Image batch 2: all 8 approved items applied** (`8768f772`, assets `f1c3c89d`).
   - The rejections 032, 035 and 036 are untouched. Batch 1 was not revisited.
   - Each source is verified by SHA-256 against the mapped decisions. Alt text and captions use the approved caption.
   - Crop focus is set on 029, 030, 031 and 034. The walk-in hero uses a 3.14:1 banner crop.
   - The captions are translated in b-0619 (12 locales).
3. **FOOTER-13: done** (`d6258a3d`, `6eb1ea1e`). Every footer lists the 13 released languages. This covers:
   - the home desktop and mobile views;
   - the shared chrome;
   - the native pages' stored chrome;
   - the generated locale pages.

   How it works:
   - The list is built from the page's own switcher: native names, this page's equivalent deep link for each language, and the current language named (`aria-current`) rather than linked.
   - A footer variant that hides the label on phones gets the list on its bottom bar.
   - A list carried in a stale snapshot is rebuilt from a signature.
   - The footer now has one privacy link.

   Verified:
   - The raw served HTML (no JS) carries the 13-item list on EN, native, DE, AR and JA pages.
   - In the hydrated page, exactly one list is visible after reload.
   - Clicking a language in the footer lands on the right path and `lang` (ar→de, en→ar, OPD→ja, de→en).
   - RTL mirrors correctly. No overflow at 390 or 1440.
4. **Merge queue: done** (`32eebf11`).
   - **AHV-DUP-012:** the EF-24 merge is reverted. Both Prav/Simona retreats are served, each with its own photographs and archive title.
   - **Six approved 301s**, each compared with its destination before redirecting:
     - `/privacy-policy/` and `/privacy-statement/` → `/new-privacy-policy/` (identical text).
     - `/enquiry-form/` → `/contact-us/`. It is the same form: same fields, consent, transport and query preselection.
     - `/enquiry-form-old/` → `/contact-us/`, so there is no chain.
     - `/ayurveda-training-programs/` → `/ayurveda-training-programme/`.
     - `/our-story/` → `/about-us/`.
     - `/things-to-do-in-property/` → `/things-to-do/`. The activity pages are re-parented, and the card that now pointed back to the same page is retired.
   - The 12 locale 301s are regenerated, all single-hop.
   - **Flagged for the owner:**
     - `/ayurveda-training-programs/` had 48 July clicks against 19 for its destination. The 301 carries them, and the owner's choice stands.
     - The owner made `/new-privacy-policy/` the governing privacy URL.
5. **Desktop secondary families: bounded pass only, on the two owner examples** (`6eb1ea1e`).
   - On 28 Sep the owner ruled that further family polish is post-launch.
   - **OPD:** the timings are an at-a-glance panel, "How it works" is a two-column band, and "Consult For" and "Why Choose" are card grids.
   - **CSR:** the introduction is side by side, and themes with three or more items are card grids.
   - Same content and wording. Forms are untouched. Nothing changes below 1180px.
   - Checked at 390, 1440, 1920 and 2560, including RTL. The `/experience/` breadcrumb label now leads with the H1.
6. **STAFF-01: NOT done.**
   - The owner is downloading the five original portraits.
   - Per the parent's instruction, there were no independent downloads and no request to Rana. Private CV and consent material is not published.
7. **CI copy violations: 9 of 75 fixed** (`f0a931ee`). The physician is now written "Dr. Deepu John" in 7 AR/FR units and in 1 tool provenance string. `revalidate`: 7404/7404.

   The other 66 are approved content the lint cannot place:
   - 52 × `career@` in translations of approved recruitment and privacy sources;
   - 13 × `© 1908 — [[VAR_1]]` (the computed-year placeholder);
   - 1 × the frozen glossary.

   A precision patch to the lint was refused by the safety classifier as a CI bypass. It was **not** retried by any other route. This is now an owner ruling, `QUESTIONS.md` Q-AHV-L10N-LINT-SCOPE, with options.

   The factory-spec failures on `/` are pre-existing contract conflicts with consent, analytics and marketing facts:
   - the group social set versus the approved property footer;
   - the consent assertion applied to GET search and newsletter forms;
   - `data-cta` hooks, which belong to form wiring in PR #315/#317.

   These are recorded, not changed (HARD GATES 6/11). The LP Lighthouse budgets are Vikash's LPs and outside this scope.
8. **Translation delta:**
   - b-0618 and b-0619 add 35 units × 12 locales, done by four disjoint workers.
   - All 24 jobs were accepted after three language-neutral units had their `unchangedReason` recorded.
   - 7428/7428 outputs validate.
   - The English prerender covers 229/229 routes; the locale prerenders cover 12 × 215. Both had 0 failures.
   - The only untranslated units in the build are the held clinical-claim passages (clinical hold).
   - **Flag:** earlier es/it/pt/nl/ru/ar batches render two retreat names differently from the Latin form used now.

### Not done, not touched

- The clinical claim batches: the denied path, left untouched. The untracked `tools/repair-clinical-batches-20260928.mjs` was not run.
- Production and DNS.
- Tracking and emails.
- Paid credits.
- `STATUS.yaml`: the branch copy is a July snapshot, so task status lives in the deliverable `STATUS.json`.
