# Pre-audit known-gaps scan — 8 preview sites (2026-07-18 17:08:30 IST)

**Context.** Human-audit round B–E emails for the 8 preview sites went out today 16:40 IST. Abilash's directive: the sites were built under the older workflow and carry known-obvious gaps — fix them proactively so reviewers see corrected previews (D-20260718-04 footer social-links parity · D-20260718-05 chat bubble mandatory). This report is the machine-checkable scan that accompanied the fleet-amendment PR (branch `feature/fleet-social-links-chat-bubble`). Fixes made in that PR are marked; everything else is FINDINGS ONLY (no scope creep beyond the two directives).

## Per-site table

Chat bubble = shared `@kairali/chat` ChatbaseLoader (interim Priya bot, DECISIONS.md 2026-07-13 18:51 IST) rendered from the root layout, ConsentScripts denied-defaults first. Social links = Kairali-group social profile links in the site footer.

| Site | Socials before | Socials after | Chat bubble before | Chat bubble after | favicon.ico | og.jpg | /privacy · robots · sitemap · llms.txt |
|---|---|---|---|---|---|---|---|
| kairali.com (reference) | none | none — **BLOCKED, see below** | yes (local copy) | yes (shared pkg) | absent (404) | yes | all present |
| kairalicenters.com | none | none — blocked | yes (local copy) | yes (shared pkg) | absent (404) | yes | all present |
| kairalihospitality.com | none | none — blocked | **no** | **yes — added** | absent (404) | yes | all present |
| kairaliyoga.com | none | none — blocked | **no** | **yes — added** | absent (404) | yes | all present |
| whatisayurveda.com | none | none — blocked | yes (local copy) | yes (shared pkg) | absent (404) | yes | all present |
| healing.recipes | none | none — blocked | **no** | **yes — added** (flag: Gita's imprint, group Priya bot may be off-brand) | absent (404) | yes | all present |
| arogyakendra.com | none | none — blocked | yes (local copy) | yes (shared pkg) | absent (404) | **no — missing** | all present |
| arogyashala.in | none | none — blocked | **no** | **yes — added** (flag: launch evidence said "no chatbot BY DESIGN" — Q-CHAT-PILOT-BY-DESIGN) | absent (404) | yes | all present |

## What the PR fixed (D-20260718-05)

- Chat bubble added to the 4 sites missing it: kairalihospitality.com, kairaliyoga.com, healing.recipes, arogyashala.in — same slot as the existing sites (end of `<body>`, before `<ConsentBanner/>`), ConsentScripts default-denied stays first in `<head>` (denied-before-loaders, the pilot security-audit contract).
- The 4 existing per-site `app/chatbase-loader.tsx` copies hoisted into ONE `packages/chat` component (Factory rule: sites build only from packages/*); load mechanics and bot ID unchanged.
- New registry gate `chat-bubble-present` (gates/registry.yaml) + merge-blocking `scripts/chat-bubble-lint.mjs` in factory-gate.yml — the absence can never again be silent.

## What was NOT fixed, and why (findings only)

1. **Footer social links (D-20260718-04) — BLOCKED, deliberately.** The directive's source set does not exist: kairali.com's own footer in the repo has no social links (sites/kairali.com/app/page.tsx), and no Kairali-group social profile URL exists anywhere in sites/ or packages/ (full-repo grep; the only hits are abhilashkr's personal LinkedIn and Gita Ramesh's LinkedIn inside healing.recipes book data). HARD GATE 6: never invent URLs — STOPPED and asked instead (QUESTIONS.md Q-SOCIAL-LINKS-SOURCE). The registry's existing `social-press-links` gate (B12) already covers this check — no duplicate row was added; D-20260718-04 tightens that gate's expected state once the canonical URL set arrives.
2. **favicon.ico is absent on ALL 8 sites** — the pilot nit is fleet-wide. Every site serves `/icon.svg` + `/icon.png` via `faviconIcons()` (@kairali/seo) and app/ icon files, but nothing serves `/favicon.ico`, which browsers and crawlers still request directly → 404 on every site. One shared fix (e.g. an `app/favicon.ico` per site, or a redirect) is a candidate follow-up; not touched here (outside the two directives).
3. **arogyakendra.com has no og.jpg** — decided absence (layout comment: "pass `ogImage` here when the asset lands"), the only one of the 8 without a real OG image. Social/OG cards for it will render without an image until the asset lands.
4. **arogyashala.in chat-bubble tension** — its filled pagewise checklist says "no chatbot ... BY DESIGN (WhatsApp/email routing for a trade audience)". The newer fleet-wide D-20260718-05 was followed; the conflict is flagged for Abilash's ruling (QUESTIONS.md Q-CHAT-PILOT-BY-DESIGN), not silently resolved either way.
5. **healing.recipes brand fit** — Gita Ramesh's imprint now carries the group's interim Priya bot per the fleet mandate; flagged for Abilash's eye (entity-bot mapping is the standing fix — registry gate `chatbase-entity-bot`).

Positive scan results (no gap): all 8 sites have /privacy, robots.ts, sitemap.ts, llms.txt route, and app/ icon files; consent banner + denied-before-loaders ordering present in every root layout (now also machine-asserted by chat-bubble-lint).
