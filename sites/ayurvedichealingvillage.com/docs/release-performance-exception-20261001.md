# AHV release performance acceptance — 1 October 2026

Task: WOPS-AHV-FINAL-DRAFT-20260924-001.

Owner instruction in the current Codex chat: “let it pass 89 it is fine ... take the site on the live staging ready for production ... once Vikash’s latest edit come we can flip the DNS”.

The owner accepts a minimum Lighthouse performance score of 89 for ayurvedichealingvillage.com. Accessibility remains at least 95; indexable main-page SEO remains exactly 100. Existing noindex landing-page rules remain unchanged. Other sites retain the standard minimum of 90. This is an explicit owner exception, not a claim that a score of 89 is 90.

Publish the verified release to the existing protected staging hostname. DNS cutover remains on hold until Vikash’s final edits are reconciled and the remaining production readiness checks are complete. No production promotion is authorized by the staging instruction.

Static render checks must include images with real source addresses, visible content throughout the page, mobile menu open/close, search, currency controls, forms and shared document routes. Do not bulk-convert other interactive page templates to static snapshots without preserving their interactions.
