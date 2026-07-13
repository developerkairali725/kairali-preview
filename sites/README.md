# sites/

One Next.js app per domain: `sites/<domain>` (e.g. `sites/kairalifranchise.com`).
Built ONLY from `packages/*` — no copy-pasted components (CLAUDE.md Factory Rules).

## Required: `site.config.json` at each site root

The compliance lint and shared packages read this file. Schema:

```json
{
  "domain": "ayurvedichealingvillage.com",
  "entity": "ktahv",
  "register": "A",
  "locales": ["en", "de", "fr"],
  "targetMarkets": ["IN", "DE", "FR"],
  "video": "REAL"
}
```

- `entity`: `ktahv` | `kappl` | `raag` | `group` | `franchise` | `personal` | `internal`
  — drives which language locks apply. `ktahv` = clinical lock (see CLAUDE.md).
- `register`: `A` | `E` | `C` | `ED` per SITE_DESIGN_LOCALE_REGISTER.md.
- `targetMarkets`: claims-jurisdiction lens (PROJECT_CONTEXT §4.3) — gated by
  TARGET MARKET, not site language.
- `video`: `REAL` | `HF-AMB` | `HF-FULL` per the Register.

Pages may override the site entity in MDX frontmatter with `entity:` (e.g. KTAHV
sections on kairali.com) — pending confirmation, see QUESTIONS.md.
