# @kairali/i18n

Keyed strings with locale gates: EN always; other locales only with a per-locale MOA brief (Register file rules). A page missing a declared locale is flagged, never silently EN-only. hreflang complete and reciprocal (Checklist A7). RTL tokens for AR exist in kairali.guru — the donor codebase.

## API (v0.2, 14 Jul 2026)
`declaredLocales` (EN mandatory), `localePath` (EN bare, others /<locale>/…),
`hreflangLanguages` (complete + reciprocal + x-default by construction),
`dictionaryGaps` / `createTranslator` (a declared locale missing a key THROWS
at build — never silently EN-only), `isRtl` (AR family). Locale word-lock
lists remain in @kairali/compliance. Tests: `pnpm --filter @kairali/i18n test`.
