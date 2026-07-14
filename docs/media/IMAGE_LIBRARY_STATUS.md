# Image Library — download status

_Updated 2026-07-14 09:40 IST. Originals live locally in `~/Claude/Kairali-Digital/image-library/<entity>/` (outside git — binaries). This file + `IMAGE_INVENTORY.csv` are the committed record; per-image descriptions land in `IMAGE_CATALOG.csv` (vision pass)._

## Downloaded & deduped — 769 images, 2.4 GB
| Entity | Count | Sources |
|---|---|---|
| products | 561 | Drive "Pictures" folder `1gfJ33…` (link-shared; 583 → 561 after byte-dedup) |
| ktahv | 50 | Drive "KTAHV New Shoot 2025 → Non-Therapy Images" `14ygl…` |
| raag | 158 | villaraag.com/photo-gallery (102) + Google Photos album `Bn7z…` (30) + Drive "Villa Raag Images" `1WTBf…` (50), byte-deduped |

**Method note:** "anyone-with-link" Drive folders don't appear in the Drive *search* API, so file IDs were scraped from the folder web UI and fetched by ID via `curl uc?export=download`. Google Photos pulled at full-res via `=d`. This is the repeatable pipeline for any future folder once it's link-shared.

## Pending
- **KTAHV clinical/therapy stills** — the "Non-Therapy Images" folder is done; a therapy-images set was not present as a separate shared folder (only "2025 Video Shoot" alongside).
- **Videos** (KTAHV 2023 shoot `12H2lk…` + 2025 shoot `1365…`) — many GB; **awaiting Abilash's yes/no** before download.
- **2 Google Photos albums** (`9UCcY3…`, `cj74qC…`) from the old registry — to browser-mine.
- **Descriptor catalog** — vision pass running (per-image category, description, tags, semantic name, best-use; KTAHV clinical-register enforced) → `IMAGE_CATALOG.csv`.

## Not images (checked, excluded)
3 loose Drive file links in the packet resolved to: 2× HTML/inaccessible, 1× a 4-page PDF — none are library images.
