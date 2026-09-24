# English search and crawl release follow-up — 24 September 2026

Task: WOPS-AHV-FINAL-DRAFT-20260924-001. Base: 616837cc. English only.

The owner requested every English search interface be battle-tested with Claude and a live release only if improved and agreed. Claude's second independent review approves SEARCH; full domain cutover remains withheld for unverified form delivery and authenticated GitHub owner review. This change is a candidate release, not a domain flip.

## Changes

- Full results actually render every match rather than limiting each group to 12.
- Family questions prefer the children FAQ; unknown words plus a duration do not silently recommend unrelated programmes.
- Redirected, duplicate, internal and confirmation pages are excluded from search.
- Build regenerates the index and synchronizes the 12 finder data literals without rewriting designs or removing the yoga film. `npm run search:check` detects stale index/data.
- Prices respect validFrom/validTo at rendering and sorting, including without a rebuild. Expired rates become Request a quote. Builds after expiry remain possible using explicit price-less generation; no new rate is invented. Budget options disappear when no current totals exist.
- All six finders offer relevant condition/duration/budget controls, including 10- and 20-night durations. Category changes clear incompatible filters. Travel handoff no longer recommends medical consultation for airport searches.
- FAQ 1001/1002 layouts and hairdryers reflect the owner's facts. Search includes up to 1,500 characters per existing FAQ answer instead of 400; gzip index remains about 33 KB under its 35 KB cap.
- Server and rendered robots now use one explicit policy, retaining recorded owner overrides and canonical consolidation. Search/confirmation/internal pages remain noindex; sitemap omits them. Production no longer inherits import-time staging noindex.
- Older campaign pages require their own `AHV_LP_LIVE=1` switch as well as `AHV_STAGING=0`. An English cutover does not implicitly publish them.

## Verification

78 unit tests and 258 acceptance examples pass. Production-mode build and TypeScript pass. Local desktop 1280/mobile390 verification covers all six finders, FAQ, global search, homepage suggestions, full results and sitemap filter. All six finder travel handoffs at both widths show the correct link, no irrelevant medical fallback and no horizontal overflow. Production HTML audit: 241 nonredirect static routes have H1 content, zero conflicting robots values; native reviews/feedback use implicit indexability. Production utility noindex, canonical consolidation and closed campaign route checked.

Google's current guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide . Indexable, accessible, useful content is the foundation; no special AI schema or llms.txt is required for Google. This is technical readiness testing, not a guarantee of indexing/rankings or an AI answer-engine integration. Search results stay noindex.

## Release boundaries

Main requires authenticated owner review and passing required checks. Actual form receipt is not verified; changing AHV_STAGING also enables its production handler. Clinical FAQ approvals and future tariff source remain external content dependencies. Raw-query analytics remains inactive in staging and requires privacy-safe handling before production analytics activation. Non-English routes, third-party chatbot, external booking search and country autocomplete are not certified by this search audit.

Do not rerun the entire design import for these fixes. If a full finder design regeneration is separately needed, run the existing yoga-film reapplication after it; the ordinary build only synchronizes data and preserves the design.

Rollback: revert this scoped commit, or restore exact original files from the control workspace's `search-release-backup`; remove the added robots policy, sync tool and tests/docs. Original backups verified against 616837cc. No production mutation was performed.
