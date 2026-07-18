# @kairali/chat

The Factory chat bubble — a single `ChatbaseLoader` client component every
site renders from its root layout (D-20260718-05: chat bubble is mandatory
fleet-wide). Hoisted 2026-07-18 from four identical per-site
`app/chatbase-loader.tsx` copies (Factory rule: packages/* only, no
copy-pasted components); load mechanics unchanged.

- **Bot:** interim Priya bot `rpNt_uRW6W8EDiTf6AvYJ` (DECISIONS.md
  2026-07-13 18:51 IST) — the default until the entity bots land
  (gates/registry.yaml `chatbase-entity-bot`). Pass `chatbotId` to override
  per-site when that day comes.
- **Performance:** the embed injects after first user interaction
  (pointerdown/keydown/scroll/touchstart) or a 6s idle fallback — never in
  the LCP window.
- **Consent:** layouts must render `<ConsentScripts/>` (default-denied
  Consent Mode v2) in `<head>` BEFORE this loader appears at the end of
  `<body>` — the denied-before-loaders order from the pilot's security
  audit. `scripts/chat-bubble-lint.mjs` asserts both presence and order.

Usage (root layout):

```tsx
import { ChatbaseLoader } from "@kairali/chat";
// …
<body>
  {children}
  <ChatbaseLoader />
  <ConsentBanner privacyHref="/privacy" />
</body>
```

Add `"@kairali/chat": "workspace:*"` to the site's dependencies and
`"@kairali/chat"` to `transpilePackages` (it ships TSX source, same as
consent/analytics).
