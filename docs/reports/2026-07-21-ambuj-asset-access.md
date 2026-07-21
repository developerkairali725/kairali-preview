---
report_id: RPT-20260721-AMBUJ-ASSETS
date: "2026-07-21 16:35:00 IST"
task: "D-20260721-09 — one Drive folder Ambuj can use for another project: images/videos + which-is-what catalogs + author/doctor transcript files"
project: "OS v2 / web factory"
source_tool: "claude-code (Drive MCP folder + sheet creation, Gmail send) — owner shared the folder himself"
type: ops-plan
supersedes: null
---

# AMBUJ ASSET ACCESS — what was built and where it lives

Owner directive D-20260721-09 (chat, 21 Jul ~16:05 IST): Ambuj wants the images/videos, the
which-is-what CSVs, and the author/doctor files for a separate project. His question was *where* —
GitHub or Drive.

**Answer: Drive.** The binaries were never in git (repo policy: manifests in `docs/media/`,
binaries outside git). The catalogs were the only piece living in the repo, so those were exported
to Drive as Sheets; nothing was moved or copied out of the existing owner folders.

## What was created

**Folder:** "For Ambuj — Kairali media + catalogs"
`1Lk9-vjgOV8AWQ2K4wBpBW50DMA5j09UW` — created in director@kairali.com's Drive.
**Shared by the owner himself** (agent never grants access — HARD GATE lane), Viewer.

Contents:
- **START HERE** index doc (`1WYt5-iN9g6DeQWT-mE5TrWcZSP0MRK9q6uRZ-cFSquQ`) — links every asset
  folder + the three author transcripts, and carries the rules that travel with the assets.
- **IMAGE_CATALOG**, split per entity (products / KTAHV / Villa Raag / AHV illustrations / other) —
  1,468 described images. Split because the single 503 KB CSV exceeded the upload path.
- **IMAGE_INVENTORY** (`1NIEgNb6S2kEVTwja0HdYldxGNkt3GRuWcILkpJeVXiw`) — 812-row download register.
- **MEDIA_CATALOG** (`1fTEbPAM_FXXa2S39eMKVP3Ij__FBU32QS8PY74syv-0`) — per-video descriptions,
  2023 KTAHV pro shoot (19 videos, Drive file ids + suggested names).
- **VIDEO_CATALOG** — the wider video register.

## What was NOT copied (deliberately)

The image/video **binaries stay where they are** — the existing folders owned by mkt@ktahv.com and
ho.mkt@kairaliproducts.com, linked from the index. Duplicating ~2.4 GB into a second folder would
create a divergent second copy of the fleet's asset truth. If a link does not open for Ambuj, the
folder OWNER adds him; that is a one-click ask to Anupam/Astha, not a re-upload.

Author transcripts likewise stay as Vikash's docs (seo@ktahv.com): Abhilash K Ramesh
`1tuSqVGulKC8PG3FaxisbbMoK3loMtkvd` · Gita Ramesh `1JpAXaAWCx3XR7S2mLSqe-jqj5M9FFue0IwxafYfbezY` ·
Abhishek Ramesh `1PY7dViBE0rGRp7XRNjk6pXGgoIfVs8ZWgqCOooTSIz8`.

## Rules carried into the index (so they travel with the assets)

- KTAHV surfaces use **REAL media only** — never AI-generated.
- KTAHV register lock binds any KTAHV-facing use; several source FILENAMES contain banned words
  (e.g. a yoga clip titled with "Guests") — titles are not to be reused verbatim on KTAHV pages.
- Personal/author material (family + physicians) is view-only, internal use.

## Send lane — CAPABILITY LIMIT, not a policy choice

The owner instructed "send him an email" (which would have extended the D-20260720-15 direct-send
pattern beyond the doctor lane). **The agent could not comply: the connected Gmail connector in this
session exposes create_draft and read/label tools only — there is no send capability.** The mail was
therefore DRAFTED (`r-3799592384089923504`, to dme@kairaliproducts.com, cc ea.abhilash@) and the
owner clicks send — the draft-only default holds by mechanism rather than by rule.

Worth registering for the D-05 prompting-method finding set: this is a second instance of the C12
pattern (an assumed capability state) pointed the other way — a granted authority that the tooling
cannot execute. Send authority for team mail remains UNEXERCISED, not declined.

The folder SHARE itself was the owner's click, as it always is.

## Integrity note on the Drive copies

The catalog sheets were produced by relaying CSV text through model context (the Drive tool accepts
inline content only, no file-path upload). That path cannot offer a byte-exactness guarantee on its
own, so each sheet was verified by exporting it back as CSV and diffing against its source. **The
repo remains the source of truth for every catalog; the Drive sheets are a convenience copy.** If
the two ever disagree, `docs/media/` wins.

Verification pass (2026-07-21 ~17:00 IST), md5 after CRLF normalization:

| Sheet | Source rows | Uploaded rows | Verdict |
|---|---|---|---|
| IMAGE_CATALOG (products) | 562 | 562 | **FAITHFUL** — md5 identical `b90a51bc…` |
| IMAGE_INVENTORY | 813 | 813 | **FAITHFUL** — md5 identical `4b28e024…` |
| IMAGE_CATALOG (other) | 4 | 4 | **FAITHFUL** — md5 identical `1fb8ad81…` |
| IMAGE_CATALOG (Villa Raag) | 227 | 227 | **COSMETIC-ONLY** — see below |
| IMAGE_CATALOG (KTAHV) · (AHV illustrations) · VIDEO_CATALOG ×2 | — | — | verification queued (uploads landed after this pass) |

The Villa Raag drift is **Google Sheets boolean coercion, not a transcription slip**: all 158
`register_ok` values reading `True` export as `TRUE`, uniformly and with zero exceptions, while the
other values in the same column (`yes` ×50, empty ×14, `review` ×4) survive byte-perfect and no other
column moves at all. Decisive test: patching `TRUE`→`True` in the exported copy reproduces the source
md5 `f68ef9e7…` exactly. Information content is intact — but it IS a literal change, so anything
downstream that string-matches `register_ok == "True"` must compare case-insensitively. Fix at
ingest, never by re-uploading.

Method note worth keeping: the byte deltas are exactly −2 per file (sources end CRLF; Sheets exports
drop the final newline), and the comparison itself was run on disk via `jq | base64 -d` so the
content never round-tripped through model context — otherwise the check would have shared the exact
failure mode it was testing for.

## Dispositions

- A teammate asking for "the assets" has no single place to be pointed at — binaries sit in four owner-held Drive folders, descriptions live in the git repo, transcripts are a third person's docs, so every such ask has been answered ad hoc — **IMPLEMENT** (done: the folder-plus-START-HERE-index built here is the reusable answer shape — one shared folder that INDEXES the sources instead of gathering them, so the next requester costs an index edit, not a rebuild)
- Copying 2.4 GB of binaries into a per-requester folder would fork the fleet's asset truth into a second copy that drifts the moment either side is edited, with no lint able to catch the divergence — **IMPLEMENT** (done: binaries stay single-source in the owner folders and are reached by link; a requester who cannot open one gets access from that folder's owner, never a re-upload)
- The Drive tool accepts inline content only, so a 503 KB catalog cannot be uploaded whole and two upload attempts died mid-relay; the per-entity split (products / KTAHV / Villa Raag / AHV illustrations / other) was the workaround and is also the more useful cut for a consumer — **MONITOR** (home: BACKLOG watch row added this report — revisit only if a future export needs a different cut, or if the connector gains a file-path upload)
