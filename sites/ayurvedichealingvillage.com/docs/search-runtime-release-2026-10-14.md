# Shared multilingual search runtime

The production `/search/?lang=de&q=ayurveda` failure was an ENOENT for `public/ahv/l10n/de/design/search.js`. The deployment packager classified `/search/` as English and removed other languages. Normal English search and even the literal search template returned 200.

The build now copies each accepted locale engine, index, translation catalogue and about-us chrome into `search-runtime/<locale>.json`. Only the shared search function traces these server-only files. Their location survives the existing locale narrowing; no new translation, public route, permission or paid service is introduced. Catalogue lookup retains the existing normalization and fallback behavior.

`npm run build` generates the runtime after validated locale restoration and checks its Next.js trace. Before uploading a prebuilt release, run the following from this site directory **after** the Vercel adapter and existing packager have finished:

```sh
node tools/check-search-runtime.mjs --package ../../.vercel/output/functions/search.func/.vc-config.json
```

This must pass for all 13 registered languages. Verify staged and public normal, empty and literal-template queries, unknown-language fallback, noindex, localized navigation and contact links. Keep all current production flags and other release checks unchanged. Preserve the currently served deployment as rollback; revert this scoped source change through normal integration if necessary.

The English homepage photo descriptions come from direct image inspection. Only audited assets with empty or generic Photo text are changed. Existing meaningful descriptions and decorative aria-hidden lotus graphics are preserved.
