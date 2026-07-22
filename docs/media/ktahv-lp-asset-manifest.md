# KTAHV live-LP asset manifest — the 10 D-LP-LIST pages

Compiled: 2026-07-18 18:55:00 IST · weekend-sprint LP front-gates session.
Binaries live OUTSIDE git per the asset-mining rule; this manifest is the committed index.

## Images

- **Primary store:** `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-ktahv-site/`
  — 83 files, 5.9 MB, downloaded 14 Jul 2026 (0 fetch failures; Cloudflare challenges HTML only, not image GETs).
  Machine manifest: `manifest.tsv` in that directory (status / local name / source URL / bytes / page slug, incl.
  121 SKIP records for <25KB tiles). Narrative index + hero-grade shortlist:
  `docs/ktahv-inputs/legacy-lp-inventory.md` §"Image manifest" + §"Reusable asset shortlist".
- **Tonight's snapshots reference 468 unique image URLs across the 10 pages** (union of the
  `images` arrays in `docs/ktahv-inputs/lp-mining/*.signals.json` — the per-page source of truth for
  which images each rebuild needs). The delta vs the 14 Jul download set is dominated by <25KB tiles
  (deliberately skipped), the DE wp-content treatment/condition cards, and page-1's new safety-banner art.
  **Action at build time (per LP, not tonight):** re-run the image pull for that LP's URL list against
  manifest.tsv; download only missing content-grade files into the same image-library folder.
- **Consent caution (unchanged):** testimonial/client photos (panchakarma pic-1…5, weight-loss client-1…5)
  show identifiable patients — confirm consent status with Deepu before reuse. Physician portraits
  (Dr. Deepu John hod-image-1.png; "ashika-raj.png" — that byline spelling is known-wrong per the 18 Jul
  D-ASHIKA ruling; the corrected name ships via the content pipeline, take it from there, never from this file)
  reusable pending their OK.

## Videos (all YouTube-hosted — nothing to download; embed IDs are the asset)

| ID / URL | Used on | Content |
|---|---|---|
| CcDPOeSR67E | 2, 3 | corporate/testimonial film (autoplay embed on panchakarma) |
| JztT26hwdnA · D3QLxKpwtJs · 3vWviQfW1Ug | 3 | weight-loss transformation testimonials |
| ExM6_gMdRHs · iPARaMRASUs · nwCIY-19BRE · 07tVC2oXd8g · 4x01PtWfNnk · vkVNhtPxO2Y · 2YsKiE7pESY · yszqmZecFig | 1, 6, 7, 4/5/10 template | corporate video + video-testimonial sliders |
| 1s1gMtcpTME · Z64LLGvQMfY | 9 (DE) | DE-page embeds |
| Channel: youtube.com/@KairaliAyurvedaGroup (+ legacy /user/kairaliayurvedagroup) | all | channel links — attention-ratio leak on a paid LP; rebuild keeps embeds, drops channel links |

Exact per-page embed lists: `youtubeLinks` + `videosIframes` arrays in each `*.signals.json`.

## Other reusable non-image assets

- Google Maps embed (pages 1/4/5/10 template).
- Chatbase agent ("Priya Sharma - Kairali") — on all 10; keep/drop is a strategy-gate call (attention ratio vs India-geo WhatsApp-first).
- submitContactForm.php UTM hidden-field contract (utm_source/medium/campaign/keyword/content + lead_source_url + hdntrackid + hdncampionname) — the attribution schema the rebuilt forms/CRM handoff must preserve.
