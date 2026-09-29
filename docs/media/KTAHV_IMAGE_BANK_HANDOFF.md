# KTAHV / Healing Village image/video-bank handoff

_Verified 2026-08-29. This handoff points to the relocated copy of the existing
library; it does not define a second source._

## Files to give Claude

1. Original-media root:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library`
2. Primary semantic descriptor:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/kairali-web-factory/docs/media/IMAGE_CATALOG.csv`
3. Current library status and coverage:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/.codex-worktrees/external-drive-relocation-20260829/docs/media/IMAGE_LIBRARY_STATUS.md`
4. Library rules and source registry:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library/README.md`
5. Current website selection/provenance manifest:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/kairali-web-factory/sites/kairalihospitality.com/IMAGE_MANIFEST.md`
6. Kairali Group brand manual 2026 rev. 2:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/kairali-web-factory/docs/brand/Kairali Ayurvedic Group — Brand Manual, 2026 Edition (rev. 2).pdf`
7. Searchable Markdown layer for the same brand manual:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/kairali-web-factory/docs/brand/kairali-brand-manual-2026-rev2.md`
8. KTAHV landing-page design direction:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/kairali-web-factory/launches/ktahv-lp-batch/design-direction/DESIGN_DIRECTION.md`
9. Legacy-image URL and page map, if legacy assets are in scope:
   `/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library/legacy-ktahv-site/manifest.tsv`
10. Four official-site video encodes—upload these named files individually, not the
    entire Downloads folder:
    - `/Users/kairalimacmini/Downloads/Therapy.mp4`
    - `/Users/kairalimacmini/Downloads/villa.mp4`
    - `/Users/kairalimacmini/Downloads/Yoga.mp4`
    - `/Users/kairalimacmini/Downloads/Consultation.mp4`
11. Descriptor for those four website clips:
    `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/.codex-worktrees/external-drive-relocation-20260829/docs/media/KTAHV_SITE_VIDEO_DOWNLOADS.csv`
12. Descriptor and decisions for seven unique/probable KTAHV clips in relocated
    Laptop Downloads:
    `/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/.codex-worktrees/external-drive-relocation-20260829/docs/media/KTAHV_LOCAL_VIDEO_SUPPLEMENTS.csv`

`IMAGE_INVENTORY.csv` may be supplied as historical evidence, but it is incomplete
for KTAHV and must not replace `IMAGE_CATALOG.csv`.

The two status/handoff documents are on branch
`codex/external-drive-relocation-20260829`. After that branch is merged, their stable
path is `Kairali-Digital/kairali-web-factory/docs/media/`.

## Copy/paste review brief

```text
Review the Healing Village/KTAHV image library at:
/Volumes/Extreme SSD - Blue 2nd/Kairali-Image-Library

Use this semantic descriptor:
/Volumes/Extreme SSD - Blue 2nd/Kairali-Digital/kairali-web-factory/docs/media/IMAGE_CATALOG.csv

Filter the CSV to:
entity == "ktahv" OR source == "ahv-edited"

This yields 678 described Healing Village stills. Resolve source folders as:
- ahv-edited -> Kairali-Image-Library/ahv-edited
- ktahv-shoot-2025 -> Kairali-Image-Library/ktahv-shoot-2025
- vision-pass or vision-pass-backfill -> Kairali-Image-Library/ktahv
- gphotos:influencer-iceland -> Kairali-Image-Library/influencers

Read IMAGE_LIBRARY_STATUS.md, the library README, IMAGE_MANIFEST.md, the 2026 brand
manual and DESIGN_DIRECTION.md before selecting.

Also review these four official-site 720p encodes using
KTAHV_SITE_VIDEO_DOWNLOADS.csv:
- /Users/kairalimacmini/Downloads/Therapy.mp4
- /Users/kairalimacmini/Downloads/villa.mp4
- /Users/kairalimacmini/Downloads/Yoga.mp4
- /Users/kairalimacmini/Downloads/Consultation.mp4

Treat them as short website derivatives/reference encodes, not higher-quality
masters. Compare them with the longer canonical 2023 videos before recommending use.

Also inspect KTAHV_LOCAL_VIDEO_SUPPLEMENTS.csv. Offer only its rows marked
OFFER-REVIEW-ONLY, optionally consider OPTIONAL-SHORT-CUT, keep low-resolution rows
reference-only, and reject the technical scrap. Do not relax any consent gate.

Return a shortlist grouped by hero, treatments, physicians/people, facilities,
accommodation, food, gardens/grounds and detail shots. For every selection include:
filename, source folder, CSV description, best_use, quality, register_ok, selection
reason, location confidence, and consent/rights risk.

Rules:
- Use real KTAHV photography only; never generate AI patients or physicians.
- Prefer register_ok=yes or True. Treat review or blank as manual approval required.
- ahv-edited is the professional Palakkad shoot.
- ktahv-shoot-2025 is recorded as the HO-centre shoot; do not caption it Palakkad.
- Do not approve identifiable patients, clients or influencers without rights/consent.
- Website presence proves provenance, not continuing reuse rights. Apply the rights
  notes in KTAHV_SITE_VIDEO_DOWNLOADS.csv.
- Keep KTAHV separate from Villa Raag, KAPPL and other entity media.
- Do not move, rename, delete or edit originals.
```

## Known coverage gaps

- `ktahv-shoot-2025/Shirodhara 7.jpg` has no `IMAGE_CATALOG.csv` row.
- 17 of the 29 files in `influencers/` are unindexed.
- The 173 files in `video/ktahv-2025-extra/` are not in `VIDEO_CATALOG.csv`.
- The four current Downloads website encodes are outside the canonical library and
  `VIDEO_CATALOG.csv`; they are covered by `KTAHV_SITE_VIDEO_DOWNLOADS.csv`.
- Seven unique/probable Laptop Downloads clips are outside the canonical library and
  `VIDEO_CATALOG.csv`; use `KTAHV_LOCAL_VIDEO_SUPPLEMENTS.csv`. The strongest new
  source is the official 4K `Swimming Pool.mp4`.
- The private Drive catalog sheet contains only the 326 `entity=ktahv` rows; it does
  not include the 352 real Palakkad photographs catalogued under the legacy
  `ahv-illustrations` entity. The local filter above is the complete review set.

Optional unindexed supplements found elsewhere on the relocated drive:

- Three Royal Villa room photographs:
  `/Volumes/Extreme SSD - Blue 2nd/Laptop Download files/Kairali- Interior 2/`
- Mixed real photographs, staff-uniform files and 3D renders—archive/review only:
  `/Volumes/Extreme SSD - Blue 2nd/Older Files - Old Desktop/Desktop/Palakkad/KTAHV images - Karan Das 3D, Uniforms/`
- Five encodes of the 2020 film `The Forgotten Cure` under
  `/Volumes/Extreme SSD - Blue 2nd/Older Files - Old Desktop/Desktop/`; treat the
  Full HD 1080p file as the preferred source pending rights review.

Do not give Claude the `drive-download-20230426T105012Z-*` folders as a second bank;
they are a split near-duplicate of canonical `ahv-edited/`.

Do not give Claude the whole `/Users/kairalimacmini/Downloads/` folder. It contains
unrelated personal media; upload only the four named KTAHV clips above.

Do not give Claude the whole `Laptop Download files/` folder either. Its 150 videos
include unrelated movies, meetings, product training, CCTV, synthetic/stock clips and
personal media. Use only the exact paths and decisions in the supplemental CSV.

## Drive alternative

If Claude cannot access local paths, use the private handoff folder:
`https://drive.google.com/drive/folders/1Lk9-vjgOV8AWQ2K4wBpBW50DMA5j09UW`

Read first:
`https://docs.google.com/document/d/1eUqF3Y9KIdylw4wlVekSSM4FosxfW2qtPWLH0UwGxXo/edit`

The private catalog documents require an authorized Google account. A local path is
not accessible to browser-based Claude unless the relevant files are uploaded.

Official source folder for broader video discovery (review/index only; 35 MP4 files):
`https://drive.google.com/drive/folders/1XY2zZBzH84fvnhDGAu1FNvCClycHU0Lp`

Twenty local files match that official folder by name and size; 15 are Drive-only.
Do not bulk-download or treat all 35 as approved merely because the folder is official.
