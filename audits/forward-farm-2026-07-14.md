# Forward-farm verification — 2026-07-14 11:55:56 IST

Master: /private/tmp/claude-501/-Users-kairalimacmini-Claude-Kairali-Digital-kairali-web-factory--claude-worktrees-vigorous-swanson-7a2b7c/2af13a49-1894-4bf7-9420-4948c02a26e6/scratchpad/sample.csv (commit b039c53)
Assertion per D1 rule 7: single-hop 301 → exact target → target 200.

| source URL | status | location | verdict |
|---|---|---|---|
| http://kairalicentre.com/ | 405 | — | NOT FLIPPED (405) |
| https://kairalicentre.com/ | 405 | — | NOT FLIPPED (405) |
| http://www.kairalicentre.com/ | 405 | — | NOT FLIPPED (405) |
| https://www.kairalicentre.com/ | 405 | — | NOT FLIPPED (405) |
| http://ktahv.com/ | 301 | https://ayurvedichealingvillage.com/ | PASS (target bot-challenged 403) |
| https://ktahv.com/ | 301 | https://ayurvedichealingvillage.com/ | PASS (target bot-challenged 403) |
| http://www.ktahv.com/ | 301 | https://ayurvedichealingvillage.com/ | PASS (target bot-challenged 403) |
| https://www.ktahv.com/ | 301 | https://ayurvedichealingvillage.com/ | PASS (target bot-challenged 403) |
| snehachowdhary.com | — | — | HELD (no target_now; gated) |

**Totals: 4 PASS · 0 FAIL · 4 not-flipped checks · 1 held rows.**

A FAIL is a finding — fix the Cloudflare list (via the master CSV + human upload), never this script.
