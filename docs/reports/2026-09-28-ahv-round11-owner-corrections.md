## Round 11 (2026-09-28 19:57:54 IST): three owner corrections, current staging for parent QA

This round covers WOPS-AHV-FINAL-DRAFT-20260924-001, run by the Claude CLI (claude-opus-5-5).

### Where it is

| | |
|---|---|
| Staging alias | https://ahv-final-staging.vercel.app |
| Deployment | `dpl_896RdocBsWfyoFsePEyy6MeNWZze` (preview), https://kairali-web-factory-ayurvedichealingvillage-lfz176w8d-kairali.vercel.app, built from `ff8483da` |
| Aliased | 2026-09-28 19:57:54 IST |
| Protection, read back on the alias | Anonymous requests get a 302 to SSO. Pages carry `x-robots-tag: noindex, nofollow, noarchive, noimageindex`. |
| PR #309 | Fast-forward `cc04f6e9..ff8483da`. The authenticated owner review is still required. No bypass. |
| Rollback | r10 `dpl_ARAk9QnGkHawYAABzU95a7iphoy1`, then r9 `dpl_BCSkEEp3gnhnkpTDQFFq3X2XqyXs` |

**Commits:** `adebf832` (OPD), `3bbdedb7` (Arogya), `2a363e97` (portraits), `8dbd785d` and `c1ac0390` (translations), `ff8483da` (snapshots).

**Evidence** is in the deliverable folder, `r11-owner-corrections/`, plus `hosted-ef-sweep-r11-prealias/`.

The generic sweep is **not** the closure evidence for these corrections. It ran 61/61 PASS, including the three new regression rows. Each correction below is closed on its own dedicated hosted check against the exact deployment.

### 1. OPD PDF link after hydration: fixed

**Root cause:**
- `enquiry-family-render.js` builds root-relative links as production-absolute (`A + href`).
- `boot.ts` `localizeLink` skipped all media.
- So the visible rates link became a production URL that returns 404, once hydration ran.
- Raw HTML and the EF sweep saw the correct relative link, which is why they missed it.

**Fix** (`adebf832`):
- First-party `/documents/…` links now stay on this deployment, with their exact path. Language and currency live in the path.
- Other media keeps its source URL.

**Hosted proof** (`opd-pdf-click-identity.json`):
- The visible hydrated link was clicked, then clicked again after a reload.
- Four cases, 4/4 PASS: EN at 1440 and 390, DE at 1440, AR at 390.
- In each case the click went to this deployment, returned 200 with `application/pdf` and the `%PDF` header, and the SHA-256 matched the approved manifest entry:

| Document | SHA-256 (prefix) |
|---|---|
| KTAHV/OPD/EN-INR/20260925-R1 | `20ff8f31…` |
| KTAHV/OPD/DE-EUR/20260925-R1 | `adfe628e…` |
| KTAHV/OPD/AR-USD/20260925-R1 | `832869ff…` |

**Site-wide:** `tools/hydrated-document-link-audit.mjs` checks hydrated links on every route.
- It covered 229 English routes and 645 de/ar/ja routes.
- It found 0 document links leaving the deployment, and all 7 and 19 distinct documents returned 200.

### 2. Arogya Kendra: the large images above the footer are fixed, and the content was reviewed

**Root cause** (my own round-7/8 regression): the large-desktop editorial grid set `display:grid` with a higher specificity than the designed `[data-ahv-maps]{display:none}` rule. That revealed the injected location block on 105 article routes:
- three maps plus a full-width grounds plan;
- 1,143px tall;
- sitting above the footer.

That block is the owner's "two large images".

**Fix** (`3bbdedb7`):
- The designed default is restored. `/how-to-reach/` keeps its maps.
- Hosted: 0 routes show the block at 1440, 390 and 1920. At 1440, 225 of 229 routes rendered the design root, so the zero is not vacuous.

**Page review.** No new facts were added and no paragraph text was changed:
- Three sub-headings summarise the existing paragraphs: "The Arogya Kendra idea", "Who it is for", "What Kairali provides".
- "Other ways to work with Kairali" is new onward navigation. It links the site tree's partner pages: Arogya Shala, franchise, consultancy, all partnerships, and contact.
- The patient-programme prompt is hidden on this partner page.
- Hosted screenshots at 1440, 1920 and 390 are in the evidence folder. There is no overflow at 390, 1440, 1920 or 2560.

**Held, not edited:** the legacy wording "remedies … performed miracles" is claim-like and left for the owner and Dr. Deepu John.

### 3. STAFF-01: Dr. Adhina U.B. and Dr. Aashitha P.S. integrated (`2a363e97`)

**Portraits:**
- Source: the parent's garden-background edits, SHA-256 verified against `MANIFEST.json`.
- Cropped to the team's 600×900 framing, WebP.
- The private originals were not published.

**Cards:**
- Placed on the homepage "Our Experts", desktop and mobile, using the existing card markup.
- Roles are source-supported only: "Resident Medical Officer · BAMS" and "Ayurvedic Physician · BAMS".
- No experience figure, no specialty, no claim.
- Translated in b-0620: 12 locales × 11 units, all validating 7440/7440.

**Hosted proof:**
- 1440 and 1920: one row of five cards, each 223×290.
- 390: two columns, cards 172×200.
- Both assets return 200 as `image/webp`.
- All 13 locale homepages carry both portraits in the raw served HTML.

**Remaining conditions:**
- Per-person consent for public use is recorded as owner-supplied. The consent documents themselves were not re-verified here.
- Neither doctor was added to the `/online-consultation/` physicians list, because no source says either takes online consultations. That needs an owner decision.
- The fr "Médecin résidente" and pt "Médica residente" titles can read as a trainee. They need native review.
- Name-prefix conventions vary slightly across older aria-labels (ar, ru, es, hi).

### Also rechecked on this deployment

- **Footer, raw HTML:** 13 of 13 homepages, 1 list each, 13 items each.
- **Parent-verified r10 fixes:** kept. Merges and redirects are unchanged; for example, `/privacy-policy/` still returns 301 to `/new-privacy-policy/`.

### Still open, not waived

- Brand-lint 66 findings and the factory-spec contract (`QUESTIONS.md` Q-AHV-L10N-LINT-SCOPE).
- Clinical holds (Dr. Deepu John).
- Form delivery (PR #315/#317).
- The authenticated owner PR review.
- Production and DNS are human actions.
