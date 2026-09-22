# AHV families 6–18 — handoff package

Generated 2026-09-22T07:31:59.190Z from the Kairali Healing Village Redesign project.
44 files, 1,574,176 bytes. Paths below are relative to this folder and mirror the project layout exactly.

## How to open a page

Every `.dc.html` is a self-contained Design Component: open it directly in a browser. It loads `./support.js` (included at the root of this package) as its runtime — keep that file next to the pages or nothing renders.

Two pages additionally load data/render modules from `assets/`, which are included:

- `AHV Template Index Directory *.dc.html` → `assets/packages-index-data.js`
- `AHV Page Policy Reader *.dc.html` → `assets/policy-family-data.js`, `assets/policy-family-render.js`

## What is NOT in this package

**All images, fonts and binaries are excluded** by request. Several pages reference `assets/img/**` (hero banners, logos, gallery stills, the `hist9/` set). Those pages render with empty image boxes here. The references are intact in the markup, so dropping the real `assets/img/` tree alongside this folder restores them.

Nothing from other page families is included.

## Known shape of the set

- **27 `.dc.html` files, not an even number.** `Slug Mismatch Check.dc.html` is a desktop-only review page with no mobile view.
- **U-5 has two complete pairs** — "Cancer Supportive Care" and "Supportive Care Cancer". Both are included as found; one likely supersedes the other, but that was not judged here.
- **T13 has two complete pairs** — "Template Legal Policy" and "Page Policy Reader". Policy Reader is the pair carrying the `policy-family-*` assets.
- **No sidecar exists for T9 (Index Directory) or for Slug Mismatch Check.** They were never written; every other page/template here has its `notes/*.md`.

## Integrity

`ahv-families-6-18-manifest.json` (in the parent `handoff/` folder) carries a SHA-256 and byte count for each file. Every file in this package was verified byte-identical against those hashes at generation time.

## Contents

| path | family | view | bytes |
|---|---|---|---|
| `AHV Page FAQs and Downloads Desktop.dc.html` | U-2 | desktop | 88,040 |
| `AHV Page FAQs and Downloads Mobile.dc.html` | U-2 | mobile | 88,245 |
| `AHV Page Sitemap Desktop.dc.html` | U-3 | desktop | 52,528 |
| `AHV Page Sitemap Mobile.dc.html` | U-3 | mobile | 57,151 |
| `AHV Page Defence and Paramilitary Forces Desktop.dc.html` | U-4 | desktop | 20,765 |
| `AHV Page Defence and Paramilitary Forces Mobile.dc.html` | U-4 | mobile | 19,709 |
| `AHV Page Cancer Supportive Care Desktop.dc.html` | U-5 | desktop | 38,422 |
| `AHV Page Cancer Supportive Care Mobile.dc.html` | U-5 | mobile | 38,122 |
| `AHV Page Supportive Care Cancer Desktop.dc.html` | U-5 | desktop | 95,926 |
| `AHV Page Supportive Care Cancer Mobile.dc.html` | U-5 | mobile | 99,740 |
| `AHV Template Index Directory Desktop.dc.html` | T9 | desktop | 12,713 |
| `AHV Template Index Directory Mobile.dc.html` | T9 | mobile | 13,235 |
| `AHV Page No Preservatives Desktop.dc.html` | T4 | desktop | 25,214 |
| `AHV Page No Preservatives Mobile.dc.html` | T4 | mobile | 34,590 |
| `AHV Template Product Family Desktop.dc.html` | T6 | desktop | 16,146 |
| `AHV Template Product Family Mobile.dc.html` | T6 | mobile | 16,692 |
| `AHV Template Course and Fees Desktop.dc.html` | T10 | desktop | 35,427 |
| `AHV Template Course and Fees Mobile.dc.html` | T10 | mobile | 34,579 |
| `AHV Template Legal Policy Desktop.dc.html` | T13 | desktop | 62,615 |
| `AHV Template Legal Policy Mobile.dc.html` | T13 | mobile | 70,042 |
| `AHV Page Policy Reader Desktop.dc.html` | T13 | desktop | 6,315 |
| `AHV Page Policy Reader Mobile.dc.html` | T13 | mobile | 6,541 |
| `AHV Template Past Retreat Record Desktop.dc.html` | T7 | desktop | 32,986 |
| `AHV Template Past Retreat Record Mobile.dc.html` | T7 | mobile | 39,272 |
| `AHV Template Offers Deals and Gift Vouchers Desktop.dc.html` | T8 | desktop | 51,039 |
| `AHV Template Offers Deals and Gift Vouchers Mobile.dc.html` | T8 | mobile | 61,541 |
| `Slug Mismatch Check.dc.html` | slug-check | desktop | 9,731 |
| `assets/packages-index-data.js` | T9 | asset | 10,325 |
| `assets/policy-family-data.js` | T13 | asset | 216,401 |
| `assets/policy-family-render.js` | T13 | asset | 8,968 |
| `notes/faqs-downloads-page.md` | U-2 | notes | 3,807 |
| `notes/sitemap-page.md` | U-3 | notes | 8,051 |
| `notes/defence-and-paramilitary-forces-page.md` | U-4 | notes | 3,452 |
| `notes/revitalizing-and-strengthening-treatment-for-cancer-patients-page.md` | U-5 | notes | 3,507 |
| `notes/no-preservatives-page.md` | T4 | notes | 7,623 |
| `notes/product-range-page.md` | T6 | notes | 5,347 |
| `notes/course-and-fees-template-page.md` | T10 | notes | 3,974 |
| `notes/policy-family-page.md` | T13 | notes | 10,093 |
| `notes/past-retreat-record-template-page.md` | T7 | notes | 8,468 |
| `notes/offers-page.md` | T8 | notes | 8,518 |
| `uploads/knowledge-explainer-8-routes.json` | explainer | data | 121,889 |
| `notes/knowledge-explainer-8-routes-dataset.md` | explainer | notes | 18,014 |
| `notes/codex-ask-explainer-8-routes.md` | explainer | notes | 6,897 |
| `sitemap/redirects-knowledge-explainers.json` | explainer | data | 1,516 |
