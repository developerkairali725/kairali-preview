# AHV near-final draft — Deepu forms handoff

2026-09-24 10:43:28 IST

Task: WOPS-AHV-FINAL-DRAFT-20260924-001. Project: ayurvedichealingvillage.com only.
PR: https://github.com/kairali-digital/kairali-web-factory/pull/309

## Candidate changes

- Sitemap corrections retained: wellness/treatment entry, campaign pages removed from the visitor directory only, corrected grammar and Reviews destination.
- Claude's final gallery design integrated with nine optimized real photographs and all 11 gallery destinations. Current shared header/footer and section navigation retained.
- Maharaja 1001: king bedroom plus separate living room, each with its own wardrobe and bathroom. Maharaja 1002: king bedroom plus twin bedroom, each with its own wardrobe and bathroom.
- Amenity sections refreshed across Maharaja, Deluxe, Royal and Classic. Hairdryers available in all four categories, per owner. Unconfirmed refrigerator/coffee-maker status and old area/capacity facts not invented or expanded.
- Desktop consent banner now horizontal and up to 880px; mobile remains stacked below 700px. Search now uses the same consent runtime and storage choice. Existing consent signals, analytics activation conditions and staging restrictions retained.
- Stable /ahv/ asset URLs now revalidate instead of claiming one-year immutability. Existing browser caches with the old immutable response may persist until cleared/expired; this does not retroactively purge those devices.
- Search uses shared brand tokens; outdated schema assertion updated to verify the existing real /search/ endpoint.

## What Deepu needs to finish

This is a design candidate, not working lead capture. No employee task assignment or outbound message has been made by this handoff.

1. Inventory and wire enquiry, contact, consultation, feedback, application, subscriber and campaign forms. The current capture-phase submit guard in app/(english)/_families/boot.ts blocks all non-search native submissions. Review each template's own event handlers too; removing that guard alone does not wire the forms.
2. Keep the preview safe: app/api/enquiry/route.ts deliberately returns 503 without reading/storing the body unless AHV_STAGING=0. Use an explicitly approved test environment and synthetic data for end-to-end submissions. Do not enable production simply to pass a preview test.
3. Use the existing @kairali/forms store-first server contract: validation and explicit form consent, successful durable storage before CRM/notification steps, server-only credentials, spam controls, truthful errors and success only after the server confirms acceptance. Existing lead-conversion tests cover success/error and cookie-consent gating but are not proof that every form is wired.
4. Verify mobile/desktop keyboard use, validation, duplicate submissions, server failure/retry, acknowledgements, thank-you routes and actual designated delivery. Keep GET search usable; it is navigation and should not acquire a marketing-consent checkbox just to satisfy a generic form assertion.
5. Resolve required factory checks on the current PR without weakening them. Previous CI identified form/privacy assertions, footer social data attributes, missing data-cta hooks, homepage metadata length, and LP Lighthouse failures. Review exact latest logs after this candidate push.

## Validation and remaining launch gates

- 412 sitemap-route banner checks (206 each at desktop 1280px and mobile 390px), plus 96 extra route/redirect checks. No unresolved route/banner failure. Tested 320/699/700/1280px breakpoints and remembered Accept/Decline across navigation/reload.
- 56 site tests pass; TypeScript passes; brand lint has zero errors/warnings; production build passes. All 2,053 pinned runtime binaries verified by SHA-256; nine new gallery images are versioned separately.
- Required authenticated owner GitHub review on the final PR head remains necessary because the inherited migration changes guarded files. Codex cannot impersonate that review or use an admin bypass.
- Existing content issues remain recorded in docs/reports/2026-09-24-ahv-site-tree.md and QUESTIONS.md: offer placeholders, training-fee source facts, tariff conflicts, clinical copy review, and deferred DE/FR. Forms are not the only remaining domain-flip gate.
- No DNS/domain cutover, production activation, tracking activation, form delivery claim or clinical approval is part of this candidate.

## Reproduce and rollback

Restore pinned binaries with `node tools/restore-runtime-assets.mjs` from the AHV site. After the general approved-design import, run `node tools/apply-gallery-room-final.mjs`, then `python3 tools/refresh-gallery-room-snapshots.py`. The original final design export hash is `06ffccea534bf57627f9f222a99be1996da0992ef6f7c9b3efd712a817e60c21`.

The integration starts from remote c4ff09609e8089098a9ac45c51f61341016eb931, with sitemap cherry-pick 043aeb66. Reverting only the final integration commit restores that site's previous presentation without resetting other work. Exact boot/snapshot backups are in the control workspace task deliverable; source revision files remain versioned. No shared or unrelated worktree was reset.
