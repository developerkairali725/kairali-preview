# MORNING BRIEF — 2026-07-16 08:56:46 IST

_Sprint Day 4 of 30 (13 Jul → 12 Aug 2026). `main` clean + in sync with origin (HEAD f84cfe3, 15 Jul 15:46). One human PR open (#64, green, waiting on you) + 8 Dependabot bumps parked for Monday. Machine idle since 20:12 IST._

## Finished overnight
One session, 18:04 → 20:12 IST, all banked to **[PR #64](https://github.com/kairali-digital/kairali-web-factory/pull/64)** — 14 commits, 73 files, **all 8 checks green, not merged** (needs your approval). Preview: [whatisayurveda](https://kairali-web-factory-whatisayurveda-com-git-feat-8a8a38-kairali.vercel.app).
- **It caught whatisayurveda about to publish four medical claims that were not true** — every page carried "Medically reviewed by Dr. Deepu John (BAMS)" with a hardcoded date, in `MedicalWebPage` structured data, under a real physician's credential, for reviews that never happened. Also: "ask a doctor on WhatsApp" (that number is the Priya chatbot), a footer review promise, and an invented editorial policy served as `FAQPage` schema. Nothing was live; no DNS flip had happened.
- **Replaced with verifiable numbers** — a live coverage count on /about ("none of our 11 health pages has been reviewed yet"), a stated conflict of interest, and a real 5-physician roster mined and double-sourced (2 doctors held off the panel rather than guess a spelling).
- **Machinery, not just fixes** — GPT-5 (`scripts/audit-gpt.mjs`) + Perplexity (`scripts/audit-perplexity.mjs`) auditors, `MASTER_PIPELINE.md` (S0–S12, 3 tracks), 9 content teardowns, and a finding that CLAUDE.md doctrine (n)–(s) mandates six sub-agents that did not exist (2 built overnight).

_Also now logged in BACKLOG DONE: yesterday's 19 merged PRs (#45–#63, 12:32 → 15:46 IST) were never recorded — the 15 Jul day session outran the brief that reported it._

## Due today (Day 4 · Wave 0, Days 1–6)
No SCHEDULED item date-triggers today or tomorrow (Wave 1 starts Day 7 / 20 Jul; Monday ritual first 20 Jul). What today's BACKLOG pass surfaced:
1. **The 3-day chase threshold hits today** — five people have been silent since 13 Jul (below). This is the day the sprint's measurement lane and Wave 1 either unblock or slip.
2. **PR #64 merge** — one click, then the whatisayurveda content engine can proceed on honest foundations.
3. **One SCHEDULED item retired** — the post-PR#2 PROJECT_CONTEXT patch turned out to be unnecessary; §1/§3/§7 already read kairali.guru = EN-only-live (grep-verified, moved to DONE).
4. **Self-contained work while the build queue is data-blocked** — packages/ui floating-stack (LEARNINGS #3), mechanization triage into packages/checklist (Ship Gate §E, "within the week" — due Day 6), Lighthouse CI wiring [gap #1], Forms v1.1 Turnstile [gap #6].

## Blocked / waiting on people
**Five items are stale today (3 days, logged 13 Jul) — chase all five:**
- **Vikash** — GA4/GTM/Ads/GSC/Bing handover. Gates Ship Gate B3–B7 on **every** launch; nobody owns this lane.
- **Ambuj** — Shopify Storefront token (gates **all of Wave 1, starts Monday**) + registrar access sheet.
- **Satyam** — prod webhook / consent field / 3 test rows. Re-scope first: forms went store-first (Supabase, #55), so the webhook ask may be moot.
- **Deepu** (web developer) — KTAHV WP tech fixes (sitemap_index 404).
- **Eeshal** — still a **live credential in a public repo**, plus the org-invite move. Security, not just process.

Not stale, still open: **Sunaj** — kairalicenters.com hacked-WP remediation (a live Kairali property is serving gambling spam right now) + whatisayurveda.org renewal (expires 28 Sep). **Abishek** — canonical roster, the one item the non-revenue build queue waits on.

## Needs your decision (Abilash)
1. **Approve PR #64?** (Y/N) — green on all 8 checks, blocked only on your approval since last night.
2. **The ~20-30 existing whatisayurveda pages** — (a) strip the review claim until Dr. Deepu John genuinely reviews them, (b) he reviews them now and we record true dates, or (c) label them "Kairali editorial team" with no physician assertion? *Recommend (a) now, (b) as he has time.*
3. **The ~3,400-page review promise is arithmetically false** — no single physician can honestly review 3,400 pages. Cap genuinely-reviewed pages (condition pages, ~15–25) and let the herb cluster carry traffic under a different, true trust label? (Y/N — this changes the site's core promise.)
4. **Factory sub-agent build order** — doctrine mandates six, none existed. Proposed: seo-aeo-geo-auditor (building regardless) → content-geo-writer → design-qa → security-auditor → logger. Confirm or drop any.
5. **Send the pending Sunaj email** on the hacked kairalicenters.com? It has been drafted since 14 Jul and the site is still compromised. (Y/N)
6. **Dependabot majors** (#9 next 15→16, #11 typescript 5→7, #10 eslint 9→10) — hold all 8 for Monday triage as planned? (Y = default)
