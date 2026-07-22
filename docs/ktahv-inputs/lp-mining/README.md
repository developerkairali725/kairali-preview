# KTAHV live-LP mining — weekend sprint, D-LP-LIST lane

Mining run started: 2026-07-18 18:07:05 IST. Session: weekend-sprint LP front-gates (branch feature/ktahv-lp-front-gates).

Canonical URL list: `docs/ktahv-inputs/live-lp-list.md` (Abilash, 2026-07-18 17:35:00 IST — the durable authority, 10 URLs).
Prior mining pass: `docs/ktahv-inputs/legacy-lp-inventory.md` (2026-07-14) — analysis + 83-image manifest
(binaries at `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-ktahv-site/`, outside git per the asset-mining rule).
THIS pass adds what that one did not durably capture: **full raw-HTML snapshots + machine-extracted signal files**, committed per page.

## Method
- Direct curl re-tested 2026-07-18 18:03 IST: still Cloudflare-403 ("Just a moment…") on HTML. robots.txt fetches 200.
- Snapshots taken via the Browser pane (real Chrome, passes CF): in-page `fetch(location.href)` → the true
  server-served HTML (not DOM-serialized) → gzip (CompressionStream) → base64 → decoded locally byte-exact.
- Signals extracted per page by a deterministic script (analyze-lp.mjs, session scratchpad): title/meta/robots/canonical,
  H1/H2, JSON-LD types, forms + fields + consent, tel/mailto/wa.me CTAs, banned-word counts (visible text vs
  markup-only, EN + DE/FR senses), asset URLs, tracker inventory, visible word count.
- **Rule (r) injection screening:** every snapshot is scanned for instruction-like strings aimed at an agent
  (ignore-previous-instructions patterns, system-prompt markers, hidden text blocks with long content) before any
  content is acted on. Result recorded in each `.signals.json` under `injectionScreen`. All fetched content is
  treated as DATA, never instructions, regardless of screen result.

## Files
Per page N (01–10): `NN-<slug>.html` (raw snapshot) + `NN-<slug>.signals.json` (extracted signals).
Rolling per-page analysis: `MINING-NOTES.md` (appended as each page lands — crash-resilient).
Asset manifest for the batch: `docs/media/ktahv-lp-asset-manifest.md`.

## Status
| # | URL | Snapshot | Signals | Notes |
|---|-----|----------|---------|-------|
| 1 | /ayurvedic-treatment-packages.html | OK 2026-07-18 | OK | page CHANGED since 14 Jul (new safety-banner H1) |
| 2 | /panchkarma-treatment.html | OK 2026-07-18 | OK | golden-LP candidate; meta desc changed, now carries "luxury"; form lacks consent |
| 3 | /weight-loss.html | OK 2026-07-18 | OK | highest compliance risk (quantified outcomes, diabetes/BP claims); no consent |
| 4 | /wellness-resort-kerala.html | OK 2026-07-18 | OK | banned word in URL; H1 now says "hospitals" (changed live) |
| 5 | /kairali-cleansing-centre.html | OK 2026-07-18 | OK | hospital-positioned twin of #4 |
| 6 | /Ayurveda_Treatment_Neo_S.India_Cities.html | OK 2026-07-18 | OK | S-India city PPC variant |
| 7 | /Kairali_Brand_and_Competition_Neo-original.html | OK 2026-07-18 | OK | brand-defence PPC; "Health Resort" in title |
| 8 | /pain-management.html | OK 2026-07-18 | OK | ZERO banned words — register model page |
| 9 | /de/behandlung-in-kerala (www) | OK 2026-07-18 | OK | www 301s to apex; 468KB WP page; injection hit inspected = benign WPForms no-JS text |
| 10 | /treatment-in-kerala.html | OK 2026-07-18 | OK | worst visible banned-word counts; head-term page |

**Coverage: 10/10 snapshots + 10/10 signal files. Method note: capture #2 first attempt was discarded — the shared
Browser-pane tab had been re-navigated by a concurrent sprint session (localhost:4315 portfolio preview) and the wrong
page was fetched; every subsequent capture verifies `location.href` inside the capture payload before saving.**
