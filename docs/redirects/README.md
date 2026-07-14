# Forward farm — Cloudflare bulk redirects (D1 rules 5/7)

**Source of truth: `forward-farm.csv` in this folder.** Every change is a
reviewed commit (D1 rule 5). Governing decision: DECISIONS.md 2026-07-13
18:55:39 IST (semantic map); implementation rules in
docs/research/forward-strategy-D1.md §3. Domain spellings come from
`sweep_results.csv` + Runbook §2D — never invented.

## Columns
- `source_domain` — the variant domain (apex; www/subdomains covered by the
  Cloudflare rule's include-subdomains flag).
- `family` / `target_now` / `target_final` — semantic family, the LIVE target
  it may point at today (empty = HOLD, do not upload), and the post-launch
  final target. When a gated site ships, edit `target_now` in the same commit
  as the Cloudflare list update — a re-point is always a list edit, never a
  chained redirect (D1 rule 2).
- `gate` — what must happen before `target_now` can become `target_final`
  (or before a HOLD row can be uploaded at all).

## Workflow
1. Edit the CSV (reviewed PR).
2. `node scripts/forward-farm-export.mjs` → emits
   `docs/redirects/cloudflare-upload.csv` (only rows with a `target_now`;
   Cloudflare bulk-redirect import format: 301, preserve query string,
   include subdomains, subpath matching ON, preserve path suffix OFF — D1
   rule 4: variant domains map whole-domain → target homepage).
3. **A HUMAN (Abilash/Ambuj) uploads the list in the Cloudflare dashboard**
   (Account → Bulk Redirects). The agent prepares; it never flips (CLAUDE.md).
4. After any flip: `scripts/verify-forwards.sh` → curls every source
   (http+https, apex+www), asserts single-hop 301 → correct target → 200,
   and writes evidence to `audits/forward-farm-<date>.md` (D1 rule 7).

## Standing rules (D1 §3, binding)
- 301 only; no chains; redirects never expire.
- A forwarded domain NEVER appears in Google Ads (final URL, display URL,
  tracking template) and never hosts content.
- Timing guard: a family flips only when its target is LIVE; interim
  forwards point at the nearest live parent and are re-pointed at launch.
- Drop list (DECISIONS 13 Jul): balanceglow, mobistorr, tourdenight,
  trueinstantloan = DROP (no forwards). kagapp = KEEP parked (future app),
  no forward.

## Open review items (QUESTIONS.md 14 Jul 2026)
- `kairaliproduct.com` (singular) is in the sweep but NOT in Runbook §2D —
  Abilash to rule whether it joins the products family.
- raagcasa/raagvilla/theraagvilla named in the docs but absent from the
  sweep — confirm registration/ownership before upload.
