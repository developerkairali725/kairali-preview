# Campaign v2 performance: pre-done, keep it that way

The /lp-v2 pages ship tuned for Lighthouse and PageSpeed Insights (PSI). A new campaign is a content change, so it
shouldn't need performance work. If it does, something below was broken.

## Targets (mobile, PSI's default preset, median of 3)

| Metric | Target | Spec budget (build spec §8) |
|---|---|---|
| Performance | ≥ 95 | — |
| Accessibility | 100 | — |
| Best Practices | ≥ 95 | — |
| LCP (simulated) | ≤ 2.0 s (warns above it) | ≤ 2.5 s (hard fail above it) |
| CLS | ≤ 0.05 | ≤ 0.1 |
| TBT | ≤ 150 ms | INP ≤ 200 ms |
| v2 JS above the fold | — | ≤ 90 KB compressed (hard fail; the Next.js/React runtime is excluded) |
| `/design/*.js` on v2 routes | none | none (hard fail) |

- **SEO is not a target.** It scores 66 because /lp-v2 is `noindex, nofollow` on purpose (the `is-crawlable` audit). Never remove noindex to raise it.
- **`bf-cache` warning on A:** expected. The pages are `Cache-Control: private, no-store` on purpose (per-visitor geo and language), and a no-store page can't enter the back/forward cache. Lighthouse doesn't score this audit.

## How to check: `pnpm lp:perf <slug>` (pre-publish, NOT CI)

```
pnpm lp:perf panchakarma                       # builds into .next-lp-perf, starts on a spare port, audits, stops
pnpm lp:perf panchakarma --base http://localhost:3471   # audit a production server that is already running
```

- Lighthouse runs on A–D with the mobile preset, plus A with the desktop preset. Each runs 3 times and the table shows the median. The script exits 1 if any mobile median misses a gate (LCP only above 2.5 s; 2.0–2.5 s prints a warning). Ctrl-C or SIGTERM stops the server, proxy and Chrome and restores `tsconfig.json`.
- **Build directory.** It builds into its own `distDir` (`LP_DIST_DIR=.next-lp-perf`, gitignored). A dev server's `.next` is never touched. Afterwards it restores the `tsconfig.json` and `next-env.d.ts` edits that `next build` makes.
- **HTTP/2.** Production (Vercel) serves over HTTP/2, but `next start` speaks HTTP/1.1. Lighthouse's simulation charges HTTP/1.1 for six TCP connections, which alone adds about 1 s of mobile LCP on the same build. So the audit goes through a local HTTP/2 + TLS proxy by default (a self-signed cert from `openssl`; Chrome is told to accept it). Pass `--h1` to audit the raw server.
- **Never audit `next dev`.** Dev bundles are unminified, so the numbers mean nothing.
- **Before publishing, also run the contrast check:** `node tools/lp-contrast.mjs --base <server> --slug <slug>`, then again with `--white`. See authoring guide §6.7.
- It doesn't run in CI because it needs a production build, a real Chrome and about 3 minutes.

## What is already done (don't undo it)

### LCP image
- The hero `<img>` is the LCP element. It is plain HTML in a `<picture>`, never a CSS background.
- It has `fetchPriority="high"` and `loading="eager"`.
- Each art-directed source is preloaded for its own media query (`ReactDOM.preload` in `Hero.tsx`), so a phone fetches only the phone image.
- `sizes` matches the rendered width per variant and breakpoint (`LAYOUT` in `Hero.tsx`).
- B and D phones show a short landscape strip, so they use the landscape hero, not the portrait `mobileImage`.

### Exactly one priority image
- The hero is the only image marked priority.
- The header logo is `loading="eager"` with `fetchPriority="low"`. It is visible, but it must not compete with the hero.
- Everything else uses `next/image` with `loading="lazy"` (the default) and its true `width`/`height`, so nothing shifts.

### Fonts
- Fonts are self-hosted by `next/font` with `display: swap` and size-adjusted fallbacks (`adjustFontFallback`), so the swap doesn't shift layout.
- There is one preload: Marcellus latin, the hero heading font of A and C. Mulish, Instrument Serif and Plus Jakarta Sans are `preload: false`.
- Why only one: next/font preloads per route, not per variant. Preloading all four families put 12 files (~213 KB) ahead of the LCP image.
- Non-latin subsets are still declared (`unicode-range`) and load only on pages that use them.

### Below the fold
- Below-the-fold photos are `loading="lazy"` with width, height and `sizes`.
  - `content-visibility: auto` was tried on phones and removed (Task 19 review). Safari has no scroll anchoring, so the height estimates could make `#enquiry` jumps land off target, and `scroll_depth` is measured against `scrollHeight`, which the estimates distort. `node tools/lp-enquire-check.mjs` guards the jumps in Chromium and WebKit.
- YouTube is a facade: no iframe or YouTube request until the visitor presses play.
- The gallery renders its photos only while it is open.
- The chat vendor script loads only when the visitor asks for chat.
- The integrations loader is inline. It loads nothing while the master switch is off or a slot is empty.

### JS
- v2's own JS is about 30 KB compressed (page, layout and two shared chunks).
- The rest of the about 128 KB is Next.js + React (about 99 KB), which every App Router page pays.
- No `/design/*.js` is loaded on v2 routes.

### Layout stability
- The consent banner and the mobile bar are `position: fixed` overlays, so they never push content.
- The locale/currency switcher has a fixed-size chip.
- Measured CLS: 0 on A and C. D is 0.025, from the Plus Jakarta Sans heading swap; this is within target.

### Accessibility
These are the ones Lighthouse checks:
- Text over photos has a scrim (authoring guide §6.7).
- Step numerals meet 4.5:1.
- Every button's accessible name contains its visible label: the locale chip and the film facades complete it with `.lp-sr` text.
- Tap targets are ≥ 48px.
- `lang`/`dir` are set per request.

## Rules for the next campaign or section

1. **Image size.** Hero sources are at most 1600px on the long edge; other images are at most 1200px. Larger masters go through the registry's derivatives. `lp:check` enforces the minimums.
2. **Exactly one priority image: the hero.** Never add `priority`, `fetchPriority="high"` or `loading="eager"` to another image.
3. **No new third-party scripts outside `campaign-v2/integrations/`.** Tags, pixels and chat go into an integrations slot, behind consent and the master switch. Never add a `<script>` or `next/script` to a section.
4. **No client components in sections without need.** A section is a server component unless it has state or handlers. Put the interactive part in `sections/interactive/`, give it plain data (not the whole config), and keep anything heavy (dialogs, players, vendors) unloaded until it is used.
5. **No new font families or weights.** A skin uses the four families above. A new one goes in `Document.tsx` with `preload: false`.
6. **Don't remove a scrim or the hero preload** to "fix" a look. Change the photo instead.
7. **Run `pnpm lp:perf <slug>` and the contrast check before publishing.** Paste the table into the campaign's change log.
