# Lint fixtures — the regression corpus for `G6-PRE-STRINGS` and `G6-PRE-CTA`

These files **deliberately contain strings that must never ship.** They are the
committed regression corpus for `scripts/banned-string-lint.mjs` and
`scripts/cta-label-lint.mjs`, exercised by:

- `packages/compliance/test/banned-string-lint.test.js`
- `packages/compliance/test/cta-label-lint.test.js`

They live under `scripts/`, **not** under `sites/`, precisely so the default lint
run (`--root sites`) never reads them. A fixture is not a shipped surface.

| Directory | What it is | Expected verdict |
|---|---|---|
| `violating/` | every rule's failure shape, reproduced from the real incident | **FAIL** — one finding per rule |
| `legitimate/` | the negation corpus: our honest copy, verbatim from the live repo, plus code comments that explain the bans | **PASS** — zero findings |
| `cta-violating/` | the "Ask a doctor on WhatsApp" CTA exactly as it shipped, pointing at the Priya bot | **FAIL** |
| `cta-legitimate/` | the honest CTAs that replaced it, plus clinical language on a genuinely clinical channel | **PASS** |

**`legitimate/` is the load-bearing half.** MASTER_PIPELINE §0.6: the Healing
Secrets booklet's *"is not a cure for cancer"* is exemplary honest drafting that a
naive lint flags — **a lint that punishes our best sentence teaches everyone to
ignore it.** Every line in `legitimate/` is real copy from this repo. If a rule
change makes any of it fail, the rule is wrong, not the copy.
