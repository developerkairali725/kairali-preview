# MID-15049 legacy document review — 5 October 2026

This is the separate review requested for the 72 preserved legacy downloads. It records technical disposition and the current portal collection that should be used for new journeys. It does not delete, redirect or declare an old business document current without an owner decision.

## Result

- 72/72 legacy direct files exist locally and match their recorded SHA-256 hashes.
- 71 are PDFs and 1 is a PPTX presentation.
- 46 contain prices or tariffs. They remain available only for legacy direct-URL continuity and are excluded from the current-document cards.
- 40 have an explicit period or year. They remain labelled as earlier files.
- 24 need an owner decision because they have no exact current collection or their undated content may still conflict with current facts.
- The maintained portal has 12 current collections with 100 editions.

## Group review

| Legacy group | Files | Price/tariff files | Current portal collection(s) |
|---|---:|---:|---|
| Ayurveda programme rates | 12 | 12 | ayurveda |
| Yoga & meditation programme rates | 12 | 9 | yoga |
| Admission & accommodation tariffs | 9 | 9 | accommodation |
| Villa Raag brochures & room tariffs | 5 | 3 | programme-rates, room-rates, dining |
| Product price lists | 6 | 6 | kappl-retail, kappl-wholesale |
| Product catalogues, manuals & lists | 11 | 0 | kappl-retail, kappl-wholesale, kappl-manufacturing |
| Healing Village profiles & brochures | 4 | 1 | healing-secrets |
| Treatment centre brochures & price card | 3 | 2 | none |
| Group profiles, awards, CSR & training | 10 | 4 | training, healing-secrets |

## Release rule

1. New page journeys use the maintained document portal and its current collections.
2. Old price/tariff files are not presented as current documents.
3. Exact legacy paths stay byte-identical until the owner approves a redirect or retirement list.
4. `centres-earlier` has no exact current document collection. Its three files require a specific owner disposition.
5. Undated brochures, catalogues and profiles marked `owner-review-currentness` require content-owner confirmation before they can be promoted, replaced or retired.

The complete per-file decision register is in `evidence/legacy-document-review-2026-10-05.csv`; machine-readable evidence, hashes and portal links are in `evidence/legacy-document-review-2026-10-05.json`.
