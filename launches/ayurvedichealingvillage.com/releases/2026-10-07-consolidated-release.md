# AHV consolidated release — candidate evidence

Recorded 2026-10-07 20:30:03 IST. Task: WOPS-AHV-CONSOLIDATED-RELEASE-20261007-001.
**CANDIDATE-COMPLETE for capture/archive preparation; production publication and final served acceptance PENDING.**

## Authority and scope

Owner authority is D-20261007-01 in [DIRECTIVES.md](../../../DIRECTIVES.md), sourced to the 7 October owner chat recorded in the control workspace's RELEASE-AUTHORITY.json. Scope is the approved 93-page plus five staging-decision release: programme/campaign enquiries and content, navigation, homepage/share image, catalogue/course availability, ranking-based mergers and airport guidance in English plus twelve languages. Owner road-distance guidance is approximately Coimbatore 66 km, Cochin 114 km and Calicut 116 km. Programme tariffs and approved campaign price hiding remain as approved. Already-live consent/tag fixes and enquiry diagnostics remain inherited; no additional tracking/settings change is authorized by this record. The separately maintained document hub, unconfirmed Baoli terms and Q03 downstream acknowledgement keep separate evidence/status.

The [6 October maintenance policy](../../../docs/ci/maintenance-policy-20261006.md) supersedes historical global/front-gate/approval/continuity/report-ledger merge enforcement. Required merge contexts remain gate, brand-lint, security-review and factory-complete. No new signature, owner decision, unrelated-site readiness or external model call is implied.

## Candidate evidence

| Field | Recorded value |
| --- | --- |
| Rendering content commit | 5cbe5cd80ad1dd5ca2a3a5124e7ba5e1f842e5ed |
| Final validation commit | be43236536accc46aa942667118aae1b96f336e9 |
| Validation signature | 1404f6bbf5cde62a01162888f8fbfd22f31189a2a816b3e6c32e219129f2b81d |
| Archive artifact commit | 6fdafc01b5574facf70e109ce995c70ec0057689 |
| Archive | ahv-locale-prerenders-20261007-be4323653.tar.gz |
| Archive SHA-256 | 88a7e53b8debf201b217a9e762d8a3d3c096ba817e2ffe8d8736756af01e134e |
| Archive bytes / members | 43,874,426 / 2,424 |
| Completed bodies | 201 English / 2,412 localized |
| Restoration / upload | Archive and exact member restoration PASS; release owner verified unique remote upload and matching SHA-256. |
| Final artifact unit rerun | 663 tests / 663 pass / 0 fail / 0 cancelled / 0 skipped / 0 todo; duration 15547.2575 ms. |

Evidence root in the control workspace is deliverables/WOPS-AHV-CONSOLIDATED-RELEASE-20261007-001/ (local references, not public URLs):
- locales-preparation/final-E/PACKAGE-HANDOFF.json and locales-preparation/final-E/locale-capture/archive-restoration-proof.json: archive/candidate proof.
- locales-preparation/final-E/source-freeze.json and locales-preparation/final-D/VALIDATOR-CORRECTION/validator-transition.json: retained original receipts and reviewed seven-Chinese-neutral-page transition; no stale rendering input reuse.
- release/final-E-artifact-unit-authorized.log: final artifact 663/663 result. Original release/final-E-artifact-unit.log sandbox listen 127.0.0.1 EPERM is retained; the identical authorized loopback rerun resolved that environment-only failure.
- release/validator-provenance-final-unit.log: earlier frozen-source 663/663 result; distinct from the final artifact rerun.
- release/package-readiness/peer-review/INDEPENDENT-REVIEW.json: 21 synthetic tests and five independent canaries PASS; actual production payload sizing/application remains pending.

## Current release dispositions

| Area | Disposition |
| --- | --- |
| Redirects | 169 changed approved routes: 13 English + 156 localized. Existing 26 merger cases are a subset; 143 additional routes covered by prepared verifier. Seven batches 25/25/25/25/25/25/19; 17 offline tests PASS. Hosted/public single-hop 301 → 200, canonical and applicable query preservation pending. Unchanged M014 excluded. |
| Locale metadata/switcher | 48 offline tests PASS. Two real clusters × 13 languages, raw/hydrated metadata and desktop/mobile switching prepared; served runs pending. Factory A7 is skipped by current locale declaration, so does not close this gap. |
| Design/functional/SEO | Final artifact visual/desktop/mobile, campaign/consultation/Chat, airport/currency, canonical/hreflang/sitemap and metadata checks pending. September FAQ/search reports remain historical limited evidence, not current-release PASS. |
| Documents | Final actual website/locale-alias → current maintained hub/property → current PDF journeys pending; standalone hub publication is insufficient. Direct PDF URLs preserved. |
| Production/CI | Explicit production build, safe package/full payload accounting, prebuilt production skip-domain deployment, browser/Lighthouse and four required PR checks pending. Capture runtime remains disabled in production. |
| Merge/publication | Normal tested-head merge, exact merged-main tree, applicable main checks, tested-artifact promotion and ordinary apex/www checks pending. Exact-URL cache purge only on demonstrated stale public content, followed by ordinary public-host recheck. |
| Forms/consent | Approved baseline retained; final scoped regressions pending. Safe QA sends no real lead/message/conversion; critical-flow delivery remains NOT-PROVEN, Q03 separate. |

[Sitewide](../sitewide-checklist.md) and [pagewise](../pagewise-checklist.md) current dispositions supplement their preserved historical text.

## Pending triangulation and closeout

**PENDING-TRIANGULATION:** scoped independent agent reviews exist for provenance/capture guard, redirects, packaging and locale verification. No new GPT+Perplexity pair ran; no dual-model PASS is claimed. This record does not revive retired audit/ledger merge gates.

Root owns final build/deployment/CI/hosted/public receipts and exact PR/commit links. STATUS/dashboard and LEARNINGS remain unchanged during this prerelease pass; reconcile reached status and append retro after actual launch. Existing monitor remains separate; no duplicate created. Rollback baseline dpl_AKKP4gNR78VxZ7Yuajda5iGvdg1U retains live consent/tag/diagnostics; re-read production immediately before promotion. Hub rollback stays separate.
