# Baseline test run (before lp-v2 work)

- **Commit:** c85e51784
- **Command:** `pnpm test`, run in `sites/ayurvedichealingvillage.com`
- **Date:** 2026-10-07
- **Result:** 330 tests, 327 passed, 3 failed

The 3 failures were already present at this commit and lp-v2 did not touch them:

- `deferHeroFilm` rewrites the homepage film start in English and every built locale…
- every design view's logic compiles the way the runtime compiles it…
- `lazyImgFirst` over every approved view template…
