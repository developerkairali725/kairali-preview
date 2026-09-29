# Landing-page check on the combined site — 29 September 2026

Branch `ktahv/ahv-landing-fixes`, based on PR309 head `40f43a98`. Checked on the combined site run locally
(`AHV_STAGING=1 next dev`, the documented review command) with Chrome at 390×844 (mobile) and 1440×900.

## Priority pages, latest head plus this fix (16/16 pass)

| Route | Width | Horizontal overflow (px) | Broken images | Asset errors | Enquiry form | Chat (Priya/WhatsApp) | Cookie consent | H1 font |
|---|---|---|---|---|---|---|---|---|
| /ayurvedic-treatment-packages.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /ayurvedic-treatment-packages.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/treatment-packages/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/treatment-packages/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /preventive-rejuvenation-detoxification.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /preventive-rejuvenation-detoxification.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /panchkarma-treatment.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /panchkarma-treatment.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/panchkarma-treatment/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/panchkarma-treatment/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /pain-management.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /pain-management.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/pain-management/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/pain-management/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /weight-loss.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /weight-loss.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |

## All 28 campaign routes, head `184699d0` (56/56 pass)

Taken while the fix was being applied (the dev server reloads on save), so the first pages still show the
old Marcellus headings; the table above re-checks them on the final state. `/offers/new/` follows its
retained redirect. Air India keeps its retained design (Marcellus there is intended).

| Route | Width | Horizontal overflow (px) | Broken images | Asset errors | Enquiry form | Chat (Priya/WhatsApp) | Cookie consent | H1 font |
|---|---|---|---|---|---|---|---|---|
| /ayurvedic-treatment-packages.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /ayurvedic-treatment-packages.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/treatment-packages/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/treatment-packages/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /preventive-rejuvenation-detoxification.html | 390 | 0 | 0 | 0 | yes | yes | yes | Marcellus |
| /preventive-rejuvenation-detoxification.html | 1440 | 0 | 0 | 0 | yes | yes | yes | Marcellus |
| /panchkarma-treatment.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /panchkarma-treatment.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/panchkarma-treatment/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/panchkarma-treatment/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /pain-management.html | 390 | 0 | 0 | 0 | yes | yes | yes | Marcellus |
| /pain-management.html | 1440 | 0 | 0 | 0 | yes | yes | yes | Marcellus |
| /lp/pain-management/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/pain-management/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /weight-loss.html | 390 | 0 | 0 | 0 | yes | yes | yes | Marcellus |
| /weight-loss.html | 1440 | 0 | 0 | 0 | yes | yes | yes | Marcellus |
| /lp/weight-loss/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/weight-loss/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /family-ayurvedic-retreat-kerala.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /family-ayurvedic-retreat-kerala.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /ayurveda-retreat-kerala.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /ayurveda-retreat-kerala.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /kairali-cleansing-centre.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /kairali-cleansing-centre.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/kairali-cleansing-centre/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/kairali-cleansing-centre/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /Ayurveda_Treatment_Neo_S.India_Cities.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /Ayurveda_Treatment_Neo_S.India_Cities.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /Kairali_Brand_and_Competition_Neo-original.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /Kairali_Brand_and_Competition_Neo-original.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /kairali-air-india-maharaja-club.html | 390 | 0 | 0 | 0 | yes | yes | yes | Marcellus |
| /kairali-air-india-maharaja-club.html | 1440 | 0 | 0 | 0 | yes | yes | yes | Marcellus |
| /karkidaka-chikitsha-or-monsoon-wellness.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /karkidaka-chikitsha-or-monsoon-wellness.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /offers/defence-and-paramilitary/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /offers/defence-and-paramilitary/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /offers/new/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /offers/new/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /offers/olympics-and-paralympics-offer/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /offers/olympics-and-paralympics-offer/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /offers/senior-citizen-offer/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /offers/senior-citizen-offer/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /treatment-in-kerala.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /treatment-in-kerala.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /wellness-resort-kerala.html | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /wellness-resort-kerala.html | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/ayurvedic-hospital-kerala/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/ayurvedic-hospital-kerala/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/ayurveda-treatment-south-india/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/ayurveda-treatment-south-india/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/kairali-brand/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/kairali-brand/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/treatment-in-kerala/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/treatment-in-kerala/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/behandlung-in-kerala/ | 390 | 0 | 0 | 0 | yes | yes | yes | cormorant |
| /lp/behandlung-in-kerala/ | 1440 | 0 | 0 | 0 | yes | yes | yes | cormorant |

## Before/after images

`*-before-after.jpg`: first screen of the four pages whose headings changed, at 390 and 1440 px.
Evidence only; drop this folder before merging if it should not ship.
