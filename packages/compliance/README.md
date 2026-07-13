# @kairali/compliance

Machine gate for the language locks in `CLAUDE.md` — Launch Checklist item A3.

```bash
pnpm compliance                        # lint every site under sites/
pnpm compliance sites/<domain>         # one site (entity from site.config.json)
pnpm compliance <dir> --entity=kappl   # any directory, explicit entity
```

Exit 1 on any error → merge-blocking in CI.

## What it enforces

| Rule | Scope | Source |
|---|---|---|
| KTAHV clinical lock (spa/resort/holiday/luxury/cure/journey/guests/getaway/escape + DE/FR seeds) | entity `ktahv` only | CLAUDE.md + PROJECT_CONTEXT §4.1 |
| Banned filler (bespoke, curated, …, unique) | all entities | PROJECT_CONTEXT §4.2 |
| No cure promises (cure/guaranteed/miracle/100%/permanent) | all entities | PROJECT_CONTEXT §4.2–4.3 |
| Locked facts (info@kairali.com only; …38777 flagged in any format) | all entities | PROJECT_CONTEXT §3 |
| Headings: no `!`, no emoji | markdown/MDX | Brand Manual ch.11 |

Entity comes from `sites/<domain>/site.config.json`; a page can override with
`entity:` in MDX frontmatter. Missing config fails safe to the strictest lock
(ktahv) and reports an error. `<!-- compliance-allow: word -->` suppresses one
word on one line and is always reported as info.

## Known v1 limits (tracked in QUESTIONS.md)
- DE/FR banned lists are seeds pending native/legal confirmation.
- Claims-jurisdiction matrix (DMR/ASCI · MHRA · FDA/FTC · EU) needs per-market
  phrase lists; v1 gates only the universal no-cure floor.
- Code files (`.ts/.tsx/.js/.jsx`) report warnings, not errors, to avoid
  false positives on technical terms ("unique key").
