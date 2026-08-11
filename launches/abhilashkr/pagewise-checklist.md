# Pagewise checklist — abhilashkr.com

**Run:** final local production build, 2026-08-11 06:32 IST  
**Method:** every sitemap URL fetched in batches no larger than 25. For each row:
HTTP 200, title 1–60, description 1–155, self-canonical, correct `html lang`, one
H1, at least one parseable JSON-LD block and no image missing an `alt` attribute.
`PASS` means all of those checks cleared.

## Batch 1 — URLs 1–25

| # | Route | Lang | Locale alternates | Result |
|---:|---|:---:|:---:|:---:|
| 1 | `/` | en | EN/DE/FR/x-default | PASS |
| 2 | `/de` | de | EN/DE/FR/x-default | PASS |
| 3 | `/fr` | fr | EN/DE/FR/x-default | PASS |
| 4 | `/about` | en | EN/DE/FR/x-default | PASS |
| 5 | `/de/ueber-mich` | de | EN/DE/FR/x-default | PASS |
| 6 | `/fr/a-propos` | fr | EN/DE/FR/x-default | PASS |
| 7 | `/work` | en | EN/DE/FR/x-default | PASS |
| 8 | `/de/arbeit` | de | EN/DE/FR/x-default | PASS |
| 9 | `/fr/travail` | fr | EN/DE/FR/x-default | PASS |
| 10 | `/investing` | en | EN/DE/FR/x-default | PASS |
| 11 | `/de/investitionen` | de | EN/DE/FR/x-default | PASS |
| 12 | `/fr/investissements` | fr | EN/DE/FR/x-default | PASS |
| 13 | `/writing` | en | EN/DE/FR/x-default | PASS |
| 14 | `/de/texte` | de | EN/DE/FR/x-default | PASS |
| 15 | `/fr/ecrits` | fr | EN/DE/FR/x-default | PASS |
| 16 | `/media` | en | EN/DE/FR/x-default | PASS |
| 17 | `/de/medien` | de | EN/DE/FR/x-default | PASS |
| 18 | `/fr/medias` | fr | EN/DE/FR/x-default | PASS |
| 19 | `/recognition` | en | EN/DE/FR/x-default | PASS |
| 20 | `/de/auszeichnungen` | de | EN/DE/FR/x-default | PASS |
| 21 | `/fr/distinctions` | fr | EN/DE/FR/x-default | PASS |
| 22 | `/speaking` | en | EN/DE/FR/x-default | PASS |
| 23 | `/de/vortraege` | de | EN/DE/FR/x-default | PASS |
| 24 | `/fr/conferences` | fr | EN/DE/FR/x-default | PASS |
| 25 | `/contact` | en | EN/DE/FR/x-default | PASS |

## Batch 2 — URLs 26–37

| # | Route | Lang | Locale alternates | Result |
|---:|---|:---:|:---:|:---:|
| 26 | `/de/kontakt` | de | EN/DE/FR/x-default | PASS |
| 27 | `/fr/contact` | fr | EN/DE/FR/x-default | PASS |
| 28 | `/faq` | en | EN/DE/FR/x-default | PASS |
| 29 | `/de/fragen` | de | EN/DE/FR/x-default | PASS |
| 30 | `/fr/questions` | fr | EN/DE/FR/x-default | PASS |
| 31 | `/now` | en | EN/DE/FR/x-default | PASS |
| 32 | `/de/aktuell` | de | EN/DE/FR/x-default | PASS |
| 33 | `/fr/maintenant` | fr | EN/DE/FR/x-default | PASS |
| 34 | `/privacy` | en | EN/DE/FR/x-default | PASS |
| 35 | `/de/datenschutz` | de | EN/DE/FR/x-default | PASS |
| 36 | `/fr/confidentialite` | fr | EN/DE/FR/x-default | PASS |
| 37 | `/writing/panchakarma-clinical-protocol-not-a-holiday` | en | English-only by content decision | PASS |

## Additional route assertions

- 40 unique internal targets: 40 HTTP 200; batches 25 + 15.
- Draft locks: `/writing/running-ayurveda-house-ai-ops`,
  `/writing/family-business-succession-systems`,
  `/writing/german-wellness-travellers-ayurveda` and
  `/writing/palakkad-beppu-ayurveda-japan` each return 404 and generate no server
  error.
- Unknown essay slug returns 404.
- `/api/og` returns `image/png`; `/manifest.json` and all three PNG icons return
  200.

