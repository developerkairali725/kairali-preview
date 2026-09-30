## Round 12 (2026-09-28 20:10 IST): scoped visual check and release-requirement matrix

- **Task:** WOPS-AHV-FINAL-DRAFT-20260924-001.
- **Candidate:** the stable alias https://ahv-final-staging.vercel.app points to `dpl_896RdocBsWfyoFsePEyy6MeNWZze`, confirmed with `vercel inspect` at 20:02:54 IST.
- **What did not change:** no content, build or deployment changed this round. Nothing was redeployed and no passed sweep was repeated.

### 1. STAFF-01: Dr. Aashitha P.S. mobile card is now verified

Evidence is in `r11-owner-corrections/`:
- `aashitha-card-hosted-390.png` (full viewport);
- `aashitha-card-hosted-390-clip.png` (the card alone);
- `aashitha-card-hosted-390.json` (base, UTC time, status and measurements).

Captured on https://ahv-final-staging.vercel.app at 2026-09-28T14:32:54Z (20:02:54 IST), 390×844 at 2×, HTTP 200:
- The whole card (172×297) sits inside the viewport.
- The portrait is 172×200 using `team-aashitha-ps.webp` with `cover` at 50% 18%. The face, glasses and coat are fully visible and nothing covers them (checked with an element hit-test at the face).
- The label and role read "Dr. Aashitha P.S. / Ayurvedic Physician · BAMS / Kairali – The Ayurvedic Healing Village". The aria-label is "Dr. Aashitha P.S., Ayurvedic Physician".

**Still unresolved (native-review dependency):** the FR "Médecin résidente" and PT "Médica residente" titles for Resident Medical Officer can read as a trainee. Nothing here claims any training status, and the staff linguistic gates are **not** passed. Also open: the per-person consent documents and the question of the /online-consultation/ list (`QUESTIONS.md` Q-AHV-STAFF01-FOLLOWUPS).

### 2. Release-requirement matrix

Sources for this matrix:
- the feedback-master `REGISTER.json` (67 rows);
- the GO-LIVE checklist;
- `QUESTIONS.md`;
- the round 10 and 11 reports;
- PR #309 read live at 20:0x IST;
- the Deepu handoff and `deepu-reply-20260928/REPORT.md`.

"Now" means executable by this sole writer without an external input.

**PR #309 now** (head `e3df0711`, BLOCKED, no review):

| Checks | State |
|---|---|
| changes, security-review, Vercel Preview Comments | SUCCESS |
| brand-lint | **FAIL**, 66 errors. All are in `l10n/` and match Q-AHV-L10N-LINT-SCOPE exactly: 52 wrong-contact-email, 13 group-attached-1908, 1 hardcoded-centres-count. There are 0 deepu-name findings, so f0a931ee held. |
| front-gate | **FAIL**. "NO approval found at head … by any owner login". It needs the owner's own GitHub review at the head. |
| factory-spec and lighthouse | 29 still in progress at read time |
| emit-verdicts | SKIPPED |

#### Register rows whose status is stale (evidence now exists)

| Requirement | Current exact evidence | Next action | Who |
|---|---|---|---|
| EF-24 (register says "FAIL: still 301s Prav/Simona") | r10 `32eebf11`: both events served. Parent `R10-INDEPENDENT-SCOPED-RESULTS.json`: 79 redirect cases, 0 failed, on `dpl_ARAk9…`. r11 sweep DUP-012 rows PASS on `dpl_896Rd…`. | Update the register row | Parent (register owner) |
| OWNER-DUP-MERGES (register says "absent") | r10 `32eebf11`: six single-hop 301s. Parent MERGES-FINAL batches 0 failed. The r11 alias read back `/privacy-policy/` 301 → `/new-privacy-policy/`. | Update the row | Parent |
| FOOTER-13 (register says raw fails) | r11 raw served HTML: 13/13 locale homepages have 1 list and 13 items (`round11` report). Hydrated click-through 4/4. Parent: About Us 13 locales at 1440 and 390, 0 failed. | Update the row | Parent |
| CSR-MAP-ASPECT, PRODUCTS-IMAGE-NAV | `96578052` plus the r11 maps root cause `3bbdedb7`. Hosted: 0/229 routes show the block (225 loaded). | Parent independent recheck, if still wanted | Parent |
| AROGYA-LOWER-IMAGES | CONFIG-COMPLETE. Parent reviewed. | Owner review | Owner |
| EF-13 OPD PDF | r11 hosted click/reload identity 4/4. Parent SHA match. | Owner OPD source facts separately (reception number, "35 centres") | Owner |
| PACKAGES-MOTIF-NAV (register says "queued") | Stable alias at 20:07 IST (`packages-hosted-check.json` and screenshots): one lotus motif, whole, below the banner at 1440; no category toggle; 0 unlabelled navs; no overflow at 1440 or 390. | Parent visual confirmation | Parent |
| EF-21, TRAINING, ENQUIRY-CONTEXT, EF-11, EF-07, EF-17 BDM | Hosted sweep rows PASS on r10 and r11 deployments (EF-21 finalPath EN+DE, OD-TRN, TF-18 through `/contact-us/`, OD-FAC, OD-OFF, OD-BDM) | Update the rows. Backend acceptance for careers stays with FORMS. | Parent |
| LANGUAGES | b-0618/0619/0620 delivered. 7440/7440 accepted outputs validate. The only untranslated units are the held clinical-claim passages. | Native review of flagged terms (FR/PT RMO, mixed retreat names) | Owner / native reviewers |
| HOSPITAL-COPY (internal notes) | **Run this round** on the stable alias (`hospital-copy-leak-scan-en.json`, 226/229 loaded): 0 non-clinical leaks. The only hits are 2 ordinary prose phrases and 2 `[TO CONFIRM — physician wording]` chips on /revitalizing-and-strengthening-treatment-for-cancer-patients/, which are held clinical content. | Dr. Deepu John rules on those chips. English only; locales not scanned. | Dr. Deepu John |

#### Owner or external dependencies (not executable by this writer)

| Requirement | Exact evidence | Dependency |
|---|---|---|
| brand-lint 66 | CI log above. The gate precision patch was refused as a CI bypass and will not be retried. | Owner ruling Q-AHV-L10N-LINT-SCOPE (options A, B or C) |
| front-gate / PR review | CI log above | The owner's own GitHub "Approve" at the final head. The agent cannot and will not do this (HARD GATE 9). |
| factory-spec on `/` (social set, form consent/privacy, `data-cta`) | Pre-existing contract conflicts (GO-LIVE item 13) | Owner ruling plus Deepu's form wiring. Consent and analytics are HARD GATE 11. |
| LP Lighthouse budgets | Vikash's LPs, perf 68–82 | Vikash |
| FORMS / DATA-CONSENT | PR317 head `38e699ac`, mergeable UNKNOWN. Deepu reply: conflicting PR, insecure-transport override, upload controls, credentials handoff. | Deepu's corrected PR, then a synthetic end-to-end run on a protected preview |
| CLINICAL-COPY + 217 draft medical answers + cancer-page chips | Denied edit path untouched. Script not run. | Dr. Deepu John sign-off |
| VILLA-FACTS sizes, RATE-PARITY expiry | Placeholders are staging-only | Staff facts (Santhosh/Anoop); owner tariff decision |
| EF-12 knowledge therapy images | Route audit exists | Owner-approved context images |
| STAFF-01 remainder | This report, §1 | Consent documents; the consultation-list decision; FR/PT native review; the yoga and nurse profiles (Rana facts) |
| MEASUREMENT, CHATBASE, SEARCH-SEO final, PERFORMANCE (PSI/GTmetrix), CAMPAIGNS | Plans and inventories exist | Frozen release plus account access. Run after freeze. |
| PRODUCTION, DNS, DISCOVERY-POST, MONITOR-LIVE, ANNOUNCEMENT | Not executed. Staging is noindex and not promotable. | Human release (owner approves, Deepu executes) after all gates |
| DESKTOP-SECONDARY / AWARDS visual polish | The owner deferred it to after launch | Owner review after launch |

#### Safe authorized work still executable now

None beyond what was done this round (the Aashitha capture, the HOSPITAL-COPY scan, the packages verification). Every remaining item is gated on an owner ruling, clinical sign-off, a supplier (Deepu, Vikash, staff), or the frozen release. Anything else would reopen completed scope or the deferred desktop polish.

**Candidate for the next writer turn, once a ruling lands:** if the owner picks lint option A or C in Q-AHV-L10N-LINT-SCOPE, apply exactly that ruling. If the owner rules on the online-consultation list or the FR/PT titles, apply that scoped content change and translate the delta.
