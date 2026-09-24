# AHV release checks — current findings

Task WOPS-AHV-FINAL-DRAFT-20260924-001. Source snapshot: PR309 head `12743836786790efc8d6d1b05bfc5cb8d27caa6d`, GitHub runs `36002687913` and `36002687979`, 24 September 2026. Recheck current head after the final push; this is not a claim that earlier results apply to changed code.

| Check | Finding | Action / ownership |
|---|---|---|
| Brand lint | New native feedback/review/sightseeing CSS used unapproved colour literals | Replaced with existing shared brand tokens; local lint passes |
| Banned strings | Snapshot footer years lacked their computed markers; one runtime computed expression was misread; exact quoted review had a physician-name case variant; two human-consultation phrases hit the chatbot rule; private source typo leaked into served provenance | Repaired computed footer markers in batches ≤25, refreshed SSR year at build, kept original review in private evidence and used an explicitly abbreviated authentic excerpt, clarified consultation wording, removed erroneous source-only email field; local lint passes without gate changes |
| Compliance | Ten wording errors in four new internal site documents | Editorial wording corrected; local compliance passes with pre-existing warnings (not a clean warning-free audit) |
| Front gate | Missing authenticated AbhilashKairali approval on current head; 23 guarded files inherited in cumulative PR | Owner review after final push; no admin bypass or impersonation |
| Factory: metadata | Homepage title 91 characters exceeded 60; description also exceeded budget | Homepage title/description shortened in source view and manifest; verify hydrated result and fresh CI |
| Factory: forms | Generic test requires checkbox/privacy in every form, including GET search; guide delivery form also awaits real integration | Reconcile search-vs-lead test contract with engineering owner; Deepu completes actual data-collection forms; do not add marketing consent to search |
| Factory: social | Test expects exact group social set and data-social attributes; approved property footer uses property profiles | Verify current approved social source and reconcile contract; do not silently replace property profiles to satisfy inherited group test |
| Factory: CTAs | No visible data-cta target; conversion wiring depends on it | Complete real CTA instrumentation with accessible targets during Deepu's forms/measurement work; staging tracking stays off |
| AHV Lighthouse | Attempts /lp/panchkarma-treatment, which intentionally returns 404 under staging lock | Production-equivalent isolated QA needed for preserved LPs, plus actual English templates; do not lower budgets or disable staging safety |
| Other site Lighthouse | kairaliyoga.com failed in the cumulative monorepo run | Separate site owner/scope; cannot claim fixed by AHV changes |
| Other site Vercel | kairaliherbals-com deployment failed | Separate project owner/configuration; cannot claim AHV release resolves it |

Main remains protected and unchanged. One stable staging URL exists independently of merge readiness. Older PR284/285 are historical migration work with unique commits, not alternate final English staging releases; do not merge them over the final candidate without a separate reviewed reconciliation.

## Follow-up found after the handoff push

The refreshed `brand-lint` job at head `37ae9a85` passes its colour/copy stages but then exposes **87 evidence-manifest findings** in three inherited 22 September AHV design-intake bundles. Their legacy array manifests lack the required version/timestamps/run/producer/files schema. This is an evidence-registration issue, not 87 broken pages. The files are historical append-only evidence; do not silently rewrite their provenance or invent the original producer. A reviewed, provenance-preserving manifest migration remains a release dependency.

Authenticated Dependabot and the package registry identified critical advisories affecting AHV's Next.js 15.5.23. AHV alone is updated to **15.5.24**, resolving to **sharp 0.35.4** in its dependency graph. No other site's dependency importer is changed. The patched local production build and 86 unit tests pass. A fresh production-dependency audit reports no AHV paths; it still reports 16 advisories in other sites' production dependency graphs. This is scoped remediation, not a fleet-wide clean security claim.

Sources: the repository's authenticated Dependabot alerts 64/65 and the [official Next.js 15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15). The final release must rerun checks at its exact head; default-branch alerts may remain until the protected merge is completed.
