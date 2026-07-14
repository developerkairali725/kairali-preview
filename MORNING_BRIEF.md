# MORNING BRIEF — 2026-07-14 08:23:27 IST

_Sprint Day 2 of 30 (13 Jul → 12 Aug 2026). Working tree clean, in sync with origin/main. No open PRs._

## Finished overnight
No commits landed after **13 Jul 19:50 IST** — machine off overnight (M2 has no power backup). The evening session (since the 17:04 brief) closed a large batch, all already in BACKLOG DONE:
- **arogyakendra.com v2** shipped + live-verified (HTTP 200, new h1, WhatsApp CTA), design-critic 9.2/10 → [launches/arogyakendra.com/](launches/arogyakendra.com/) (filled sitewide + pagewise checklists).
- **packages/forms v1** built + live-tested against Satyam's test webhook (rows 2–4).
- **KTAHV corpus sweep** — 28 strategy docs + 20 competitor dossiers → [docs/ktahv-inputs/](docs/ktahv-inputs/); Nakshatra guides + media catalog v1 committed.
- **D1 forward strategy CLOSED** — semantic map adopted → [docs/research/forward-strategy-D1.md](docs/research/forward-strategy-D1.md) + DECISIONS.
- **Briefs:** theblushlounge.com mined via Wayback (origin down) + kairali.guru baseline eval → [docs/site-briefs/](docs/site-briefs/).
- **Sprint-state synthesis** — 15 gaps + top-10 next actions → [docs/SPRINT_STATE.md](docs/SPRINT_STATE.md).

## Due today (Day 2 · Wave 0, Days 1–6)
No SCHEDULED item date-triggers today or tomorrow (Wave 1 starts Day 7 / 20 Jul; Monday ritual first 20 Jul). Ungated Wave-0 leverage work in play (SPRINT_STATE top-10, gate: none):
1. **packages/seo + schema + i18n for real** — extract meta/canonical/robots/sitemap/llms.txt, hreflang, JSON-LD from arogyakendra (every Wave-1 site consumes these).
2. **Brand lint (A4) + factory spec-suite template (A2)** into CI.
3. **packages/consent + packages/analytics** — code with env-var IDs (IDs gated on Vikash).
4. **arogyakendra retro → LEARNINGS.md** — file is empty; learning loop overdue.
5. **Forward-farm CSV + curl verification script + audits/ dir** (D1 rules 5/7; flips stay human).
6. **Design-critic gate** formalized (scripts/design-review + Ship Gate step) + register-table/PROJECT_CONTEXT locale-fact fix via DECISIONS.

## Blocked / waiting on people
_None stale yet — all logged 13 Jul (1 day old); 3-day stale threshold hits 16 Jul._
- **Measurement access** (GA4/GTM/Ads/GSC/Bing) — **Vikash** — gates Ship Gate B3–B7 for EVERY launch; nobody owns this lane.
- **Shopify Storefront token** — **Ambuj** — gates packages/product-card + all of Wave 1 (Day 7).
- **GitHub org invites** — **Abilash** — unblocks Eeshal→Factory PRs + kairali.guru Wave-2 freeze.
- **Image-folder sharing fix** (KTAHV New Shoot / Villa Raag Images, contents unshared) — **mkt@ktahv.com + ho.mkt@kairaliproducts.com** — gates placeholder image swaps.
- **ANTHROPIC_API_KEY repo secret** — **Abilash** — gates the /security-review CI step (A-13).
- **Production webhook URL + consent-field answer + delete 3 test rows** — **Satyam**.
- **Ink hex + 10-step ramps + logo SVG pack (Q14–17), group WhatsApp number, Raag type scale** — **Abilash/design team** — gate raag-tokens + brand visual finalization.
- **theblushlounge.com droplet owner** — **Sunaj or Ambuj** — origin down on all ports (see decisions).

## Needs your decision (Abilash)
1. **theblushlounge.com is DOWN** (Sneha's live business site, dead since ~Nov 2025) — restore the DigitalOcean droplet, or accept downtime until the Factory rebuild ships? And who owns it — Sunaj or Ambuj?
2. **Security:** Eeshal's PUBLIC repo `kairali-guru-` has a hardcoded student-hub password. Direct her to rotate it + make the repo private now? (Y/N)
3. **Nakshatra data conflicts** — ruling: (a) villa 212 = Classic (guide) or Royal (inventory)? (b) Maharaja Suite 1001/1002 names are swapped between guide and archive — which is correct?
4. **kairali.guru** — drop the fake student-hub login for launch, or build a real noindex portal in Wave 2/3? And who confirms current course pricing (repo hardcodes prices absent from the live site)?
5. **Branch protection (Q9):** (a) GitHub Pro/Team, (b) make repo public — not advised, or (c) hooks + CI only?
6. **Vercel Pro / power config** — Vercel Pro confirmed (org hosting live). Still pending: run the one-line `sudo pmset` (Q11, `autorestart 1`) — best crash mitigation until the UPS lands.
