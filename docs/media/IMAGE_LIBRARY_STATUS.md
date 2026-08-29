# Image Library — current location and catalog status

_Verified 2026-08-29 13:28:36 IST. This is the same library that was moved on
2026-08-07, not a new source. Originals remain outside Git; this file records their
current physical location, compatibility paths, catalog coverage and review limits._

## Authority and relocation

- **Canonical originals:** `/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library`
- **Repository-adjacent compatibility path:**
  `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/image-library`
- **Historical compatibility path:**
  `/Users/kairalimacmini/Claude/Kairali-Digital/image-library`
- **Move-time evidence:** `Kairali-Image-Library/_MANIFEST.txt` records 2,433 files
  and 74,397,255,186 bytes verified identical to the former internal copy.
- **2026-08-29 delta check:** no moved media is missing and no post-move media was
  added. The only added file is `_MANIFEST.txt` itself; `README.md` was updated during
  path reconciliation.

The two compatibility paths are pointers to the same canonical originals. They are
not additional copies or independent sources.

## Healing Village / KTAHV originals now present

| Folder | Current files | Bytes | Catalog handling |
|---|---:|---:|---|
| `ahv-edited/` | 352 stills | 5,914,508,960 | All described; professional Palakkad shoot |
| `ktahv/` | 50 stills | 513,109,638 | All described; original non-therapy set |
| `ktahv-shoot-2025/` | 265 stills | 2,073,307,887 | 264 described; `Shirodhara 7.jpg` is unindexed |
| `influencers/` | 29 stills | 652,932,324 | 12 described; 17 unindexed; rights review required |
| `legacy-ktahv-site/` | 83 stills + `manifest.tsv` | 6,019,825 | Legacy only; identity/consent review required |
| `video/ktahv/` | 103 videos | 21,840,115,566 | Covered by the local KTAHV subset of `VIDEO_CATALOG.csv` |
| `video/ktahv-2025-extra/` | 173 videos | 40,688,455,290 | Local originals present; not described in `VIDEO_CATALOG.csv` |

## Relocated supplements outside the canonical library

These were already in the older local collection but were not incorporated into the
canonical bank. They are discovery candidates, not approved additions:

- `Laptop Download files/Kairali- Interior 2/` — three genuine Royal Villa room JPGs
  (109 Moolam and 304 Rohini), 5,910,192 bytes total. They are absent from
  `IMAGE_CATALOG.csv`; exact duplicates also exist under `Laptop Download files/Duplicates/`.
- `Older Files - Old Desktop/Desktop/Palakkad/KTAHV images - Karan Das 3D, Uniforms/`
  — 61 mixed archival files: 20 real Supriya photographs, 13 identifiable-staff
  uniform files, 27 architectural renders and database junk. Keep renders separate
  from factual photography and require staff consent review.
- `Older Files - Old Desktop/Desktop/The Forgotten Cure - Kairali Healing Village
  Movie by Emily Spurling - 19th Nov 2020 - Full HD 1080p.mp4` — preferred source
  among five local encodes of the same archival film. None is in `VIDEO_CATALOG.csv`;
  confirm rights before reuse.
- `Laptop Download files/drive-download-20230426T100239Z-001/Swimming Pool.mp4`
  — unique official 4K KTAHV source candidate (44.278 seconds; 254,089,065 bytes),
  absent from the canonical library. The indexed Drive source is file
  `1q2nDPjrIuawUiaF_oEinL5mIUvFFBWmr`; a likely public counterpart is the 0:44
  swimming-pool YouTube row in `VIDEO_CATALOG.csv`. Model/usage-rights review is
  required.

The three `drive-download-20230426T105012Z-*` folders under `Laptop Download files/`
are a split near-duplicate of `ahv-edited/`; do not give both sets to a reviewer.

## Current Mac Downloads — official-site video encodes

Four KTAHV website clips were downloaded to `/Users/kairalimacmini/Downloads/` on
2026-08-29 and verified through Finder's `kMDItemWhereFroms` metadata against the
official `ayurvedichealingvillage.com` WordPress upload URLs:

| File | Website source | Duration | Bytes | Review note |
|---|---|---:|---:|---|
| `Therapy.mp4` | `/wp-content/uploads/2025/02/Therapy.mp4` | 7.700 s | 729,940 | Identifiable guest; treatment/consent review |
| `villa.mp4` | `/wp-content/uploads/2025/02/villa.mp4` | 8.900 s | 1,310,777 | Room label and continuing rights review |
| `Yoga.mp4` | `/wp-content/uploads/2025/02/Yoga.mp4` | 7.067 s | 648,537 | Identifiable model; consent review |
| `Consultation.mp4` | `/wp-content/uploads/2025/02/Consultation.mp4` | 8.067 s | 1,165,538 | Two identifiable people; role/consent review |

All four are silent H.264, 1280×720 web encodes totalling 3,854,792 bytes and
31.734 seconds. They are not byte/size matches for files in the external image
library. Their scenes align with the longer 2023 KTAHV professional footage, so treat
them as website derivatives/reference encodes rather than new masters. `villa.mp4`
visually matches the canonical accommodation-room-2 footage; the other edit-level
relationships remain probable, not proven.

The four source URLs returned HTTP 200 `video/mp4`; fresh downloads matched the local
SHA-256 hashes. The live English, German and French homepages each reference all four
once in their desktop hero slider. They remain absent from `VIDEO_CATALOG.csv`,
`MEDIA_CATALOG.csv` and the current repository site build.

Use `KTAHV_SITE_VIDEO_DOWNLOADS.csv` for their URLs, exact local paths, hashes,
descriptions and rights notes. Give Claude only these four named files—not the whole
Downloads folder, which contains unrelated personal material.

## Other KTAHV video candidates in relocated Laptop Downloads

`KTAHV_LOCAL_VIDEO_SUPPLEMENTS.csv` records seven unique/probable KTAHV clips outside
the canonical library: 1,978,576,341 bytes total. Give Claude the following only as
review-gated supplements:

- `Swimming Pool.mp4` — offer for pool/property review; official 4K source.
- `video_20230407.mp4` — offer as a long outdoor Om/yoga-session source.
- `video_20230409_173144.mp4` — offer as a long staff-led guest-session source.
- `video_20230407_173823.mp4` — optional shorter take of the Om/yoga session.

Keep the two low-resolution vertical guest-event clips reference-only, and reject the
2.78-second grass/accidental-lead-in clip. All identifiable guest/model/staff footage
requires rights and consent review.

The 2023 professional-shoot download set is otherwise duplication/revision evidence,
not another bank: 18 files in `drive-download-20230426T100239Z-*` plus root-level
`Kairali Overview_Final.mp4` are SHA-256-identical to canonical videos 01–19. Root
`Drone.mp4`, `Pharmacy and Consultation.mp4`, and `Quite Room & Therapy Area.mp4` are
alternate revisions of canonical scenes; prefer the canonical copies and do not give
both to a reviewer.

## Committed descriptor status

### `IMAGE_CATALOG.csv` — primary still-image descriptor

- 1,468 data rows across Kairali entities.
- Healing Village review set: **678 described stills**, filtered as:

  ```text
  entity == "ktahv" OR source == "ahv-edited"
  ```

- The 678 rows comprise 352 `ahv-edited`, 264 `ktahv-shoot-2025`, 50
  `vision-pass*`, and 12 `gphotos:influencer-iceland` records.
- `register_ok` is a review field, not blanket publication approval: 405 `yes`, 49
  `True`, 211 `review`, and 13 blank within this set.
- Quality labels in the same set: 534 `pro`, 131 `high`, and 13 `medium`.

Source-to-folder resolution:

| Catalog `source` | Local originals |
|---|---|
| `ahv-edited` | `Kairali-Image-Library/ahv-edited/` |
| `ktahv-shoot-2025` | `Kairali-Image-Library/ktahv-shoot-2025/` |
| `vision-pass` / `vision-pass-backfill` | `Kairali-Image-Library/ktahv/` |
| `gphotos:influencer-iceland` | `Kairali-Image-Library/influencers/` |

The entity value `ahv-illustrations` on the 352 `ahv-edited` rows is a legacy catalog
label; the files are real professional photography, not generated illustrations.

### Other committed catalogs

- `IMAGE_INVENTORY.csv` is the earlier download register and includes only the
  original 50 KTAHV stills. It is not a complete KTAHV inventory.
- `VIDEO_CATALOG.csv` has 458 data rows overall and maps the 103 files under
  `video/ktahv/`; it does not cover `video/ktahv-2025-extra/`, the four current-site
  encodes, the seven local supplements or all 15 Drive-only items in the official
  `Ayurvedic Health Resort` source folder.
- `KTAHV_SITE_VIDEO_DOWNLOADS.csv` describes the four current Mac Downloads website
  encodes. It is a supplemental provenance descriptor, not a rights clearance or a
  replacement for the higher-quality canonical 2023 footage.
- `KTAHV_LOCAL_VIDEO_SUPPLEMENTS.csv` describes the seven unique/probable KTAHV local
  clips, including offer/reference/reject decisions and consent gates.
- `MEDIA_CATALOG.csv` is a historical 2026-07-13 discovery snapshot. Its
  `access-pending` notes are superseded by the verified local status above.
- `legacy-ktahv-site/manifest.tsv` is the file/URL record for the 83 legacy stills.

## Drive mirrors and status pages

Read the status page before the private catalog mirrors:

1. Catalog status v2 —
   `https://docs.google.com/document/d/1eUqF3Y9KIdylw4wlVekSSM4FosxfW2qtPWLH0UwGxXo/edit`
2. KTAHV image catalog mirror (326-row KTAHV entity subset) —
   `https://docs.google.com/spreadsheets/d/1hBJaIcx8Ebk31mEO-_7qH3A-3XZ0S_crUK_ZT1zZGeU/edit`
3. Image inventory mirror —
   `https://docs.google.com/spreadsheets/d/1NIEgNb6S2kEVTwja0HdYldxGNkt3GRuWcILkpJeVXiw/edit`
4. KTAHV video catalog mirror (103 rows) —
   `https://docs.google.com/spreadsheets/d/1TZThGxtOqBXBfBMRFdnogiptRzOh2XLFHIisTF6cr2g/edit`
5. Complete Ambuj/Claude handoff folder —
   `https://drive.google.com/drive/folders/1Lk9-vjgOV8AWQ2K4wBpBW50DMA5j09UW`
6. Official `Ayurvedic Health Resort` video source folder —
   `https://drive.google.com/drive/folders/1XY2zZBzH84fvnhDGAu1FNvCClycHU0Lp`
   (35 MP4 files; 20 local name/size matches and 15 Drive-only items; review/index
   only—do not bulk-copy for this handoff).

## Publication and caption rules

- KTAHV uses real photography only; never generate or substitute AI people,
  patients or physicians.
- Prefer rows marked `register_ok=yes` or `True`; `review` and blank require manual
  approval.
- `ahv-edited/` is the Palakkad professional shoot.
- `ktahv-shoot-2025/` is recorded as the 2025 HO-centre shoot. Do not caption it as
  Palakkad unless an owner resolves the location.
- Do not publish identifiable patients, clients or influencers without verified
  consent and usage rights.
- Keep KTAHV, Villa Raag, KAPPL and other entity banks partitioned.
