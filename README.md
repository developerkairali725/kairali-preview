# kairali-web-factory

Monorepo for the Kairali web rebuild (30-day sprint, 13 Jul → 12 Aug 2026).

New here? Read in this order: `START_HERE.md` → `PROJECT_CONTEXT.md` →
`CLAUDE.md` (binding rulebook) → `SITE_LAUNCH_CHECKLIST_v1.0.md` →
`SITE_DESIGN_LOCALE_REGISTER.md`. Deep docs live in `docs/`.

```bash
pnpm install
pnpm compliance     # language-lock lint (Checklist gate A3)
pnpm test           # all package tests
```

Sites go in `sites/<domain>` (see `sites/README.md` for the required
`site.config.json`). Shared code lives in `packages/*` only.
