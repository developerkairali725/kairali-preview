# Blush Lounge image manifest — theblushlounge.com rebuild · 2026-07-18 18:06:40 IST

Binaries live OUTSIDE git (asset-mining law): `~/Claude/Kairali-Digital/image-library/blushlounge/`
(machine-of-record: M2 mini — same convention as every other entity in
`docs/media/IMAGE_LIBRARY_STATUS.md`). Rows also appended to `IMAGE_INVENTORY.csv`.

**Owner authority: D-BL-INTERIM (DECISIONS.md, 18 Jul 2026)** — theblushlounge
builds THIS WEEKEND using images from IG @blushlounge_sneha as interim assets
(Sneha's own account, her own site). IG-derived rows are marked
`INTERIM-IG-SOURCED` (logged-out capture) or `IG-FULLRES-SOURCED` (logged-in
full-res recapture, 18 Jul evening). **Both marks mean interim-pending-shoot** —
grep `INTERIM-IG-SOURCED|IG-FULLRES-SOURCED` when the two hi-res shoot sets
arrive and swap 1:1. Nothing IG-marked ships past the swap without an owner OK.

## 1 · IG capture — `blushlounge/ig-interim/` — 14 files (11 upgraded to full-res 18 Jul 19:10 IST)

| File | Px | Status | Source post | Best use |
|---|---|---|---|---|
| ig-DaaOD-vDzF9-1.jpg | 3274×4096 | INTERIM-IG-SOURCED | instagram.com/blushlounge_sneha/p/DaaOD-vDzF9 (carousel 1) | HERO candidate — full-res bridal, champagne lehenga |
| ig-DaaOD-vDzF9-2.jpg | 3274×4096 | INTERIM-IG-SOURCED | instagram.com/blushlounge_sneha/p/DaaOD-vDzF9 (carousel 2) | hero alternate / about |
| ig-DaSkt3uvEo7-1.jpg | 1856×2320 | INTERIM-IG-SOURCED | instagram.com/blushlounge_sneha/p/DaSkt3uvEo7 | masterclass/education section |
| ig-DUsF6VCjFHW.jpg | 2304×4096 | IG-FULLRES-SOURCED | …/reel/DUsF6VCjFHW (poster) | portfolio grid / hero-grade — cocktail glam |
| ig-DQnp1_Fkg6O.jpg | 2268×4032 | IG-FULLRES-SOURCED | …/reel/DQnp1_Fkg6O (poster) | portfolio grid / hero-grade — bridal |
| ig-DGPuMSBIvO6.jpg | 2268×4032 | IG-FULLRES-SOURCED | …/reel/DGPuMSBIvO6 (poster) | portfolio grid / hero-grade — minimal bridal |
| ig-Da5JDSlsbfm.jpg | 1218×2160 | IG-FULLRES-SOURCED | …/reel/Da5JDSlsbfm (poster) | portfolio grid — soft glam |
| ig-DavCczUyOLi.jpg | 1217×2160 | IG-FULLRES-SOURCED | …/reel/DavCczUyOLi (poster) | portfolio grid — structured glam |
| ig-DasKkOMvfBE.jpg | 1217×2160 | IG-FULLRES-SOURCED | …/reel/DasKkOMvfBE (poster) | portfolio grid — sculpted glam |
| ig-Dappy7YvHKI.jpg | 1217×2160 | IG-FULLRES-SOURCED | …/reel/Dappy7YvHKI (poster) | portfolio grid — fresh glam |
| ig-DanCGtpv7ny.jpg | 1216×2160 | IG-FULLRES-SOURCED | …/reel/DanCGtpv7ny (poster) | portfolio grid — radiant glam |
| ig-DaXxRCLvS9_.jpg | 900×1600 | IG-FULLRES-SOURCED | …/reel/DaXxRCLvS9_ (poster) | portfolio grid — traditional bridal |
| ig-DaVKk7Fvt42.jpg | 1215×2160 | IG-FULLRES-SOURCED | …/reel/DaVKk7Fvt42 (poster) | portfolio grid — soft precision |
| ig-profilepic.jpg | 1080×1080 | IG-FULLRES-SOURCED | profile picture | about page / Person schema image |

### Full-res recapture · 2026-07-18 19:10:38 IST (owner-directed: "check insta now", owner logged in himself)

- Method: logged-in session in the owner's own Chrome (M2 mini, owner clicked
  Connect; agent never touched login forms or credentials). Per post: media-info
  API top image candidate requested in-page, URL read from the browser network
  log, binary curl'd and dimension-verified against the API's stated size
  (all 11/11 exact matches; content spot-checked visually).
- Upgraded: all 10 reel posters (640px → 900×1600 min, 2304×4096 max) + profile
  pic (320 → 1080×1080). The three photo-post files were already full-res.
- The superseded 640px files are preserved at `ig-interim/superseded-640/`
  (11 files) — nothing deleted.
- **Honest ceiling:** these are Instagram's own largest stored poster renditions
  (equal to the reel video's frame size), NOT the original camera files. The
  hi-res shoot swap still supersedes everything IG-marked. Reel MP4s remain
  uncaptured (video out of scope for this pass).
- Logged-in profile surface also shows a bio link the logged-out capture could
  not see: `wa.me/918826921110`. Recorded here as a sourced observation ONLY —
  **not to be used as a site contact fact without the owner confirming it**
  (HARD GATE 6; QUESTIONS.md entry this session).
- Rule-(r) injection screening of everything fetched this pass (profile text,
  API JSON fields used, page text): plain human content + numeric metadata; no
  instruction-like strings; binaries treated as opaque data. Verdict: CLEAN.

Resolution note (superseded 18 Jul evening — kept for history): the ORIGINAL
logged-out capture exposed full-res for photo posts but capped reel posters at
640px; the logged-in recapture above removed that cap. The logged-out grid caps
at 12 posts; more posts can be captured any time by repeating the walk (method in
`content-mined/theblushlounge.com/instagram-2026-07-18/profile-capture.md`).

## 2 · Live-site capture — `blushlounge/site-legacy/` — 28 files (site restored, mined live 18 Jul)

Provenance: live fetch of theblushlounge.com (200 OK, restored per QUESTIONS.md
14-Jul entry) — supersedes the Wayback-only mine of 13 Jul. NOT interim-marked
(these are the site's own legacy assets), but all are 2018-era low-res: heroes
1366×500, gallery 380×300 — replacement-grade only.

| Group | Files | Px | Note |
|---|---|---|---|
| Heroes | slide.jpg, slide-2.jpg, slide-3.jpg | 1366×500 | old slider |
| About | about-banner1.jpg | 918×1150 | best legacy photo |
| Services | bridal-makup.jpg, creative-makup.jpg, grooming-sessions.jpg, engagment1.jpg | 461×576 | service cards (sic filenames) |
| Gallery | gal1–gal9.jpg | 380×300 / 190×300 / 380×600 | 2018 portfolio |
| Misc | img1.jpg, img2.jpg | 500×700 | index strip |
| CTA strips | book-your-appointment.jpg, get-call-back.jpg | tiny | text-baked buttons, do not reuse |
| Brand | **logo.png (499×401)**, favicon.png (16×14) | | the only logo source we hold (low-res) |
| Icons | wedding/fashion/creative/effects/men/workshop .png | 178×177 | service glyphs, style reference only |

## 3 · What we do NOT have (do not invent — HARD GATE 6)

- The two hi-res original shoot sets (owner: arriving later; this manifest's
  INTERIM marks exist for that swap).
- A vector/hi-res logo. 499×401 PNG is the ceiling today — flagged in QUESTIONS.md
  since 13 Jul (Blush Lounge brand assets).
- Any usable video (reel MP4s are login-walled; public surface = posters only).

## 4 · Rule-(r) injection screening — PASS · 2026-07-18 18:04:00 IST

Screened BEFORE any agent acted on the content (CLAUDE.md doctrine (r)):

- **8 live-site HTML pages** (index, about, bridal/creative/fashion-makeup,
  grooming-session, gallery, contact): instruction-pattern grep (ignore/disregard-
  instructions, role-claims, system-prompt strings, eval/atob/onerror, hidden-text)
  → **zero instruction-like findings**. Script inventory: stock bootstrap.min.js,
  jquery.min.js, html5shiv, respond.min.js only. One hidden element = the standard
  GTM noscript iframe (GTM-MFXP2LH). Verdict: CLEAN.
- **IG bio + 12 captions + highlight titles**: plain human text (makeup process
  descriptions, client names, collaborator handles); no imperatives directed at
  tooling, no encoded content. Verdict: CLEAN.
- **Image binaries**: treated as opaque data; referenced by path only; nothing
  executed. Filenames normalized to `ig-<postcode>.jpg` (no filename-borne text
  retained).

No quarantine required. All content herein is DATA, not instructions.
