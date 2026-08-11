# Design QA — Abhilash EN/DE/FR pilot

- **Timestamp:** 2026-08-11 06:32 IST
- **Target:** final local Next.js production build
- **Viewports:** 1440px desktop and 375px mobile
- **Evidence:** `screens/2026-08-11-{en,de,fr}.png`, matching `-mobile`
  captures, and `screens/2026-08-11-og.png`
- **Nature of review:** internal structured QA. No external-AI score or human
  approval is claimed.

## Verdict: PASS for preview, human preview approval pending

| Area | Result | Evidence |
|---|---|---|
| Visual continuity | PASS | Existing Night Ledger direction retained; no redesign or fact-layer shift |
| EN/DE/FR typography | PASS | Self-hosted Instrument/IBM font set renders accents and long labels correctly |
| Mobile overflow | PASS | EN/DE/FR `scrollWidth=375`, viewport 375 after header reflow |
| Header controls | PASS | Mobile brand compresses to AKR; locale/theme/menu controls remain visible |
| Touch targets | PASS | Header, locale and mobile-nav controls use 44px minimum dimensions |
| Hierarchy | PASS | One clear H1; primary cards and contact action remain legible in all languages |
| Content density | PASS | Localized cards preserve whitespace and do not overrun the ledger grid |
| Accessibility proxy | PASS | Lighthouse accessibility 100 on EN home, article, DE home and FR home |
| Console/runtime | PASS | Zero browser console errors on EN/DE/FR captures; protected 404s are quiet |
| Social card | PASS | Endpoint PNG inspected at 1200×630; text is legible and within safe bounds |

## Design decisions

- Preserve the restrained personal-archive aesthetic; this release is an
  internationalization and trust hardening pass, not a visual rebrand.
- Use real semantic equivalents in the language switcher so the visitor remains
  on the same page family.
- Keep the published English essay English-only rather than display a partial or
  machine-only translation under a German/French URL.
- Use `AKR` only at the smallest header size to protect the primary navigation
  controls; the full name remains on wider screens and throughout content.

## Open, non-self-approvable items

- Deepu must test the immutable preview on a real phone and desktop.
- The owner must view the exact preview before protected production promotion.
- An external design critic, beauty audit and cross-model review were not run.

