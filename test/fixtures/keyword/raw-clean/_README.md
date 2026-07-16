# raw-clean/ — a CLEAN committed capture, for the end-to-end green path

One real, byte-for-byte DataForSEO response: `res_14_google_ads_bogus_null.json`, copied
unmodified from `docs/process/evidence/keyword-rigor-2026-07-15/`.

**Why this response.** It is the research's own NEGATIVE CONTROL. google_ads was asked for
3 keywords and returned 3 rows — two of them `volume: null`. So:

- **V9 PASSES**: `requested == returned`, nothing silently dropped. This proves the
  validator does not "pass V9" by rejecting every response with fewer rows than requested,
  including the correct ones.
- **V10 PASSES**: google_ads returns rows in REQUEST order, so no alphabetization hazard.
  (Labs is the opposite — see `res_12`/`res_13` in the evidence dir.)

The main evidence dir deliberately contains `res_13`, where Labs silently drops a row.
Pointing `--raw` there correctly FAILS V9. That directory is the adversarial corpus; this
one is the clean control. Both are tested.

Not generated at runtime. Not hand-written. These are the bytes the API actually returned
on 2026-07-15, cost `$0.09` recorded in the file — because a fixture we wrote ourselves
would encode our assumptions, and our assumptions are the thing under test.
