# Yoga film reuse — 24 September 2026

Task WOPS-AHV-FINAL-DRAFT-20260924-001. Owner reasserted reuse of the existing non-branded retreat film, with the Lakshya name removed from website labels.

Existing asset: https://www.youtube.com/watch?v=ExM6_gMdRHs. YouTube oEmbed confirms Kairali Ayurveda Group as publisher. The source YouTube title remains “Amazing Experience at Lakshya Yoga Retreat, June 2017”; this change relabels website presentation, not the external channel metadata or footage.

A reusable “Yoga at the Healing Village” film card is now in both desktop/mobile templates and initial HTML for:

- /yoga-meditation-training/
- /yoga-meditation-programs/
- /yoga-retreats/
- /yoga-meditation-program/
- /yoga-based-stress-energy-reset-program/
- /digestive-wellness-gut-health-yoga-therapy/

The existing exact video title was also neutralised in the old Ayurveda package pair, campaign dataset and their three affected initial snapshots. Historical retreat page names, dates and URLs remain unchanged. The poster is an existing Kairali yoga photograph, not presented as a frame extracted from the film. Both poster and visible watch link open the verified video in a separate tab with noopener/noreferrer. No autoplay, embedded third-party player, or new medical claim.

Twelve desktop/mobile route states passed: exactly one card, loaded image, no overflow, correct video target and neutral title. Actual click opened the correct separate YouTube tab. A mobile inherited link-padding/image rule was corrected within the card; final image and frame rectangles match. Initial HTML contains the same card, so it is available before hydration and to parsers.

Reapply after an approved design re-import with `python3 tools/apply-yoga-film.py --backup-dir /an/explicit/backup/directory`. It is idempotent and caps mutation batches at 25 files. The control workspace contains 25 exact backups verified against base 492d648f. Restore those files and remove the added application script/document for a full rollback. No production or main-release claim.
