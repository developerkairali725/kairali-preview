# @kairali/ui

Brand Manual as code. `brand-tokens.css` is the visual law — only token colors, ever (Launch Checklist A4). Components built per Manual ch.07 and shared by every site; no site ships its own copies.

Standing rules: marigold is never body text on white; leaf-500 only ≥24px; one marigold accent moment per view; focus rings present; touch targets ≥44px; `prefers-reduced-motion` honored. Villa Raag uses its OWN `raag-tokens.css` (pending updated Raag manual — Decision #8); Kairali tokens are never applied to Raag surfaces.

## Brand lint (Ship Gate A4 — static layer, 14 Jul 2026)
`node packages/ui/bin/brand-lint.js [sites/<domain>]` — merge-blocking in
.github/workflows/factory-gate.yml. Rules: rogue-hex, rogue-color (raw
rgb/hsl in CSS), marigold-text (400 = error; 300 = warning, dark surfaces
only per ch.08), focus-strip (outline removed without replacement),
tokens-import. Suppress a line with `brand-allow: <rule>` — reported as info,
never silent. Scope from site.config.json `brand`: "kairali" (default) |
"raag" | "none" (exempt; exemption list is Abilash's to ratify). The BROWSER
layer of A4 (computed ≥44px touch targets, visible focus rings) lives in
tests/factory/factory-site.spec.ts. Tests: `pnpm --filter @kairali/ui test`.
