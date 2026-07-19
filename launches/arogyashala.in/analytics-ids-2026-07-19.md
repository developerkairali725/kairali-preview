# GA4 IDs received from Vikash — 2026-07-19 19:0x IST (DEFECTIVE, correction drafted)

Thread `19f7550795ad2d32` (director@ ↔ seo@ktahv.com), reply received 19 Jul 15:00 IST.

## What Vikash sent

| Field | Value |
|---|---|
| Stream Name / URL | `http://www.arogyashala.co.in` ⚠️ |
| Stream ID | 5490777071 |
| Measurement ID | `G-HS6BP7Z17Z` |
| Snippet | plain gtag.js (no GTM) |

## Three defects (correction draft `r-5248514252598516664` in director@, owner clicks send)

1. **Wrong domain**: stream created on `www.arogyashala.co.in` — that is the LIVE LEGACY site
   (`content-mined/arogyashala.co.in`). The rebuild launches on `arogyashala.in`; .co.in
   forwards at cutover (forward-farm, currently HELD on the DNS gate). Asked him to edit the
   stream URL to `https://arogyashala.in`.
2. **No GTM container ID** — he sent the raw gtag snippet; we asked for GTM-XXXXXXX. The factory
   wires tags through GTM.
3. **Structure question unanswered** — per-site vs group-level GA4/GTM; his answer patterns the
   whole fleet (~15+ sites).

Also asked: director@ = Administrator on the GA4 account holding this property (rides the
Monday Sunaj/Vikash access order).

## Status for STATUS.yaml

arogyashala.in pre-launch pending "GA4/GTM IDs" = **PARTIAL**: Measurement ID exists
(G-HS6BP7Z17Z) but is not wireable until the stream-URL fix + GTM container arrive. Do NOT
hardcode the gtag snippet; factory analytics package + GTM remains the wiring lane.
