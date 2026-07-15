# MORNING BRIEF — 2026-07-15 10:56:43 IST

_Sprint Day 3 of 30 (13 Jul → 12 Aug 2026). `main` clean + in sync with origin. No open human PRs (8 Dependabot bumps parked for the 20 Jul Monday triage). Machine idle since the 00:18 IST overnight-wrap — nothing merged after it._

## Finished overnight
A large autonomous evening/build session landed on `main` (PRs #24–#43, merged 19:19 IST → 00:18 IST); all now in BACKLOG DONE:
- **3 new sites built + evidenced** — [kairali.com](launches/kairali.com/) (design 9.2, real photography, PR #24), [whatisayurveda.com](launches/whatisayurveda.com/) (9.0, "Ayurveda authority" v1, greenfield, PR #36/#40), [kairalicenters.com](launches/kairalicenters.com/) (9.0, 14 verified centres, PR #38/#39). arogyakendra already live → 4 sites now carry legal + consent.
- **@kairali/legal** package → privacy/terms/cookie fleet-wide, Ship Gate A12 closed everywhere (PR #37).
- **Interim uptime monitor LIVE** (Ship Gate B10) — 10-min GitHub cron, CF-aware probe, auto-issue alert (PR #28). **[NOW item closed]**
- **SEO tooling verdict** — buy a $50 one-time DataForSEO deposit (~$3.60/mo at our usage) over Semrush/Ahrefs (PR #29). **MCP sitting closed** — Clarity connected + verified, GitHub skipped, Composio in, Semrush declined.
- **RATES_RECKONER** complete (26 tables, 6/6 PDFs, price-verified, PR #30); **LP doctrine draft** + KTAHV legacy mine (594-URL sitemap, PR #27); **whatisayurveda.org mine** — 1 page, 98 dead links, expiry 28 Sep flagged (PR #31).
- **Franchise + Equipment pre-builds BANKED but BLOCKED** — franchise needs figures + domain (PR #41); equipment legacy DB empty + live site 500/path-leak (PR #42). Build queue paused ~00:20 (no fabrication, rule 6).

## Due today (Day 3 · Wave 0, Days 1–6)
No SCHEDULED item date-triggers today or tomorrow (Wave 1 starts Day 7 / 20 Jul; Monday ritual first 20 Jul). Non-revenue build queue is paused on Abilash source-data — so today's ungated leverage:
1. **Self-contained factory work** — packages/ui floating-stack (LEARNINGS #3) + packages/forms store-first (needs Supabase creds); neither is gated on people.
2. **Mechanization triage** — SEO_PLAYBOOK §GAPS + DESIGN_DOCTRINE items (INP gate, title-uniqueness, orphan-page, AI-crawler policy) into packages/checklist (Ship Gate §E, "within the week").
3. **Compliance triage** — 158 YouTube titles flagged as possible health claims, vet before any KTAHV embed.
4. **Lighthouse CI** vs Vercel preview wiring [gap #1] · **Forms v1.1 Turnstile** [gap #6] — both self-contained.

## Blocked / waiting on people
_Nothing stale yet — the 13 Jul cluster is 2 days old; 3-day threshold hits **tomorrow, 16 Jul** (chase then)._
- **kairalicenters.com LIVE site is HACKED** (gambling-spam injection) — **Sunaj** — email drafted (bulk-sheet row 7); a live Kairali property is compromised right now.
- **Measurement access** (GA4/GTM/Ads/GSC/Bing) — **Vikash** — gates Ship Gate B3–B7 for every launch; still nobody owns this lane.
- **Shopify Storefront token** — **Ambuj** — gates packages/product-card + all of Wave 1 (Day 7).
- **Image-folder shares** (KTAHV New Shoot / Villa Raag Images) — **mkt@ktahv.com + ho.mkt@kairaliproducts.com** — gate placeholder image swaps.
- **Production webhook URL + consent-field + delete 3 test rows** — **Satyam**. **Supabase creds** (store-first forms) — **Abilash/Ambuj**.
- **Ink hex + 10-step ramps (Q14–17), group WhatsApp number, Raag type scale** — **Abilash/design team** — gate raag-tokens + brand visuals.
- **GitHub org invites** — **Abilash** — unblock Eeshal→Factory PRs + kairali.guru Wave-2 freeze.

## Needs your decision (Abilash)
1. **Send the pending Gmail drafts** — esp. the **URGENT Sunaj "kairalicenters.com is HACKED"** email (live property compromised) + Satyam · Astha (CC Ritu) · Anupam (banned-words). Send now? (Y/N)
2. **Canonical centres roster** — "X centres in Y countries" conflicts everywhere (18/9 vs 14/5 vs 35/25). One authoritative number unblocks kairali.com + kairalicenters + franchise. Which is correct?
3. **Franchise** — (a) gate investment behind enquiry, or give me the figures? (b) canonical domain — kairalifranchise 301s to ayurvedafranchise, or reverse?
4. **Equipment** — legacy product DB is empty (0 SKUs) and the live site is 500/broken + leaking server paths. Supply the real product list, and who routes the broken-site fix?
5. **Morning setup that unblocks automation** — Vercel imports (kairali.com + whatisayurveda + kairalicenters), create the Supabase project, and place the $50 DataForSEO deposit (doc: docs/seo/TOOLING_DECISION.md §5). Do these today?
6. **Dependabot majors** (#9 next 15→16, #11 typescript 5→7, #10 eslint 9→10) — hold all 8 for Monday triage as planned? (Y = default)
