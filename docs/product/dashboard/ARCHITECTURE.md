# Kairali Fleet Dashboard — ruled architecture (D-20260722-04, GPT-consulted 22 Jul 2026)

The owner's product: log in → fleet pulse → amend a site / add a site → KB — connected to GitHub.
Operators: owner + marketing team, phone-first, never a terminal. Old sites are REPLACED, never tweaked.
Consult: Claude's position attacked layer-by-layer by GPT (verbatim in session transcript); rulings below are the merged result.

## Layers (ruled)

- **App:** extend `sites/kairali.ai` (same repo, Next.js App Router, Vercel). No new backend, NO database — the GitHub repo is the source of truth ("connected to GitHub" literally). Vercel Edge Config / generated JSON allowed as cache snapshots only, never truth.
- **Auth:** NextAuth + Google, restricted to the Workspace domain; roles in `config/access/roles.json` under CODEOWNERS (owner review required to change roles — no self-escalation via PR). Roles v1: **Owner / Editor (marketing) / Viewer**. Every action route re-checks the role server-side.
- **Fleet pulse:** the existing status page upgraded — per-site cards (stage, live + preview links, what-changed-this-week from git log, "last sync" badge). Data refreshed by scheduled Action + webhook → revalidate; ISR 60–120s. NEVER live GitHub API calls per request (rate/latency is what breaks first at this scale — GPT Q1).
- **Amend a site:** per-site `site.settings.json` (banners, offers, headlines, contacts, socials, CTAs; images via an asset picker later — v1 fields are text-level). Dashboard renders a form from the JSON schema → Save = bot-authored commit + PR via GitHub API **with file-SHA precondition** (two editors can't silently overwrite; stale save → diff + reapply UI; an open settings PR for a site blocks/warns new edits) → Vercel preview link surfaces in the UI → **Publish = Owner-only merge on green CI** (v1 has NO auto-merge; revisit after trust builds). Guarded fields (prices, clinical/legal text, locked facts) are marked in the schema: Editors propose, only Owner publishes — enforced by CODEOWNERS + required reviews, CI stays the single enforcement layer.
- **Add/build a site (v1):** a wizard that files a strictly-typed build request (GitHub issue template): business goal/KPI, personas + locales/markets, **3 reference sites with steal/avoid notes** (the 100x design bar — references-first, ruled 22 Jul), prioritized sitemap (P0/P1), brand assets, content sources, constraints (legal/clinical/banned words), success definition. The agent picks it up and runs the factory build; the site appears in the pulse as previews. Generation-from-wizard automation is v2.
- **KB:** read-only render of `docs/` + `wiki/` — list + article view + client-side filter. Full-text search v2. The KB is READ here; the machine stops authoring process records (D-20260722-02).
- **Monitoring v1:** pulse + what-changed-this-week only. Uptime/GA4/GSC panels land when the access lanes do.
- **What the UI shows of "the essence":** PR status, CI green/red, lighthouse summary, clinical-lock hits, and a plain-English "why publish is blocked". Logs stay behind a click.

## 48h v1 — the five phone tests (acceptance bar)

1. From a phone, log in with a @kairali.com Google account.
2. See pulse cards for the 4 pilot sites (arogyakendra, arogyashala, theblushlounge, kairali.guru-when-built) with live/preview links + last-sync time.
3. Open a site, change "Hero headline" and "Primary CTA label", Save → a PR appears with its Vercel preview link.
4. Owner taps Publish → merges on green CI → change is live on the preview/live URL.
5. Open KB, see the docs list, read an article.

Cut from the 48h scope (deliberately): add-site generation, analytics panels, uptime, full search, auto-merge, image uploads, role granularity beyond the three.

## Build order

Phase A (now): app shell + auth + roles file · pulse v2 with ISR + sync badge · settings schema + `site.settings.json` extraction for the 4 pilots · settings form → PR write path with SHA precondition · KB reader. Phase B: publish flow + guarded-field enforcement + wizard issue template. In parallel, never blocked by this: the 3 ready pilot sites' DNS cutover packs (replace-ASAP ruling).
