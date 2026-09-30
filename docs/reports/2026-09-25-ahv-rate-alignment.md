# AHV rate alignment — 20260925-R1

Task WOPS-AHV-FINAL-DRAFT-20260924-001. Owner authorized rate alignment and existing staging publication. Production/DNS unchanged.

The finder and programme pages still carried 2026 expiries and conflicting payment terms despite the final PDF family being available. Imported the five approved rate source JSONs byte-for-byte and aligned 37 priced programme/finder records, existing villa tables in all three published currencies, effective dates and minimum nights. Ayurveda and daily admission end30September2027; yoga/training start1October2026; OPD has no published end date. Training remains per-night pricing with explicitly derived course totals, not an invented standalone tuition fee.

Corrected the older foundational yoga page’s INR table. Personalized yoga has no independent tariff entry in the final source and now requests a quotation, linking the separately priced standard package. Preserved the existing foundational yoga-training mapping and existing currency controls; full translated website/currency-by-language release is separate.

Aligned programme inclusions/exclusions and payment/cancellation wording with the approved English PDF source:40%deposit, balance no later than30days before admission, full refund more than30days out,50%of amount paid less applicable transaction fees/taxes at15–30days, no refund below15days or date changes during stay. Specific-villa full-payment condition remains explicit. Corrected policy data and the actual terms-page templates together. Unapproved promotional offers/discount bands were not invented.

Verification:120unit/content/date-boundarytestsPASS;258searchcasesPASS;1392villa/currency/occupancy cells compared with independent imported sources;92Chromiumdesktop/mobile route cases across46routesPASS (390/1440width,nohorizontaloverflow/noJSerrors);46refreshedSSR snapshots. Approved FAQ schema and unchanged footer markup preserved after snapshot capture; regression testsPASS. Site brandlintPASS; local and Vercel preview buildsPASS. Five imported rate JSONs byte-identical to final owner sources.810tracked source files backed up and checksum-verified in batches<=25. Existing protected staging deployment dpl_ApiQ1G6xrh6tTUWVjWr345QaK14Z remains rollback target.

Deployment/readback and exact release identity are recorded in the workspace rate-alignment-20260925/VERIFICATION.json. Main merge and all-production approval are separate; no all-CI-green claim.
