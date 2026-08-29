# Image Library — current location and catalog status

_Verified 2026-08-29 13:02:00 IST. This is the same library that was moved on
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

The three `drive-download-20230426T105012Z-*` folders under `Laptop Download files/`
are a split near-duplicate of `ahv-edited/`; do not give both sets to a reviewer.

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
  `video/ktahv/`; it does not cover `video/ktahv-2025-extra/`.
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
