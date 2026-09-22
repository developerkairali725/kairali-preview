# package-overlay — Claude Design families applied over the sealed package (2026-09-22)

The read-only package is never written. `tools/import-english-candidate.mjs` reads a file from
here when it exists, else from the package (`AHV_CANDIDATE_OVERLAY` to relocate). `routes.json`
here is the package's route table with the rows in `ROUTES-REPOINTED.json` repointed.

Phase A (this folder): routes whose new design carries its own content, or whose dataset is real:
U-1 how-to-reach · U-2 faqs-downloads · U-3 sitemap · U-4 defence · U-5 cancer supportive care ·
T4 /no-preservatives/ · T6 /product-range/ · T10 /training-course-fees/ · T13
/terms-and-conditions/ · T7 /karma-being-retreat-2019/ · T8 /offers/ · Knowledge Centre hub ·
T18 /attractions-above-50kms/ · T12 the eight *-gallery routes (photo-collections dataset).

Phase B (not here yet): sibling routes of the baked templates (house rules, products, training,
legal, retreats, offers), T3/T2 (their datasets are stand-in copy — real datasets to be built from
the record), T9 index routes (needs per-route tile datasets), T1 explainer (desktop is the older
three-page build; mobile is dataset-driven), T5 facilities (route prop is a/b/c/d, not a path),
T17 campaign-short (content by contentState, not route). Source files for all of these are in
launches/ayurvedichealingvillage.com/design-intake/.

## Run order (2026-09-22) — after `node tools/import-english-candidate.mjs --no-binaries`
The documented chain (docs/reports/2026-09-19-ahv-session-close-handover.md §5) unchanged, plus
the 21-Sep repair set, then `repair-claude-design-chrome` (board unwrap, placeholder header/footer
→ chrome imports, mockup widths), then `convert-images-webp`, then prerender the repointed routes
(`ROUTES-REPOINTED.json`), `repair-snapshot-links`, build.
