# @kairali/social

The Factory footer social links — ONE `SocialLinks` component + ONE
`src/config.ts` handle list, rendered by every fleet site's footer
(D-20260718-04: footer social-links parity, fleet-wide).

- **Single source of truth:** `src/config.ts` is the only file that knows a
  handle. The interim set is the director@ email-SIGNATURE set + Pinterest
  from the live kairali.com footer (D-SOCIALS-INTERIM, 18 Jul 2026); the
  Astha/Anupam email true-up is a ONE-FILE change here — no site edits.
- **Verified, never invented (HARD GATE 6):** every URL was HTTP-checked and
  content-fetched to a real matching profile before shipping. A dead handle
  is excluded and flagged, never shipped.
- **Plain links only:** no embed widgets, follow buttons, share SDKs, or
  tracking pixels (consent ruling). Server component — zero client JS.
- **Enforcement:** `scripts/footer-socials-lint.mjs` (merge-blocking) fails
  any non-exempt fleet site whose footer does not render this component, any
  local copy, and any hardcoded canonical profile URL in site code. Registry
  row: `footer-socials-present` (gates/registry.yaml) — presence companion
  to `social-press-links` (B12). Render layer: tests/factory.

Usage (in the site's footer component/JSX):

```tsx
import { SocialLinks } from "@kairali/social";
// inside <footer> … sites with .footer-nav styles:
<SocialLinks className="footer-nav footer-social" />
// sites without (kairali.com pattern): <SocialLinks /> + a .footer-social rule
```

Add `"@kairali/social": "workspace:*"` to the site's dependencies and
`"@kairali/social"` to `transpilePackages` (it ships TSX source, same as
consent/analytics).
