# MORNING BRIEF — 2026-07-18 07:05:44 IST

_Sprint Day 6 of 30 (13 Jul → 12 Aug 2026). **As of `origin/main` @ d3b55cd (18 Jul 00:56:19 IST).** Main clean + in sync; the `factory/status-dashboard` branch is fully merged (verified by content diff — a squash-merge, so `git log` shows phantom "unmerged" commits). Busy evening/overnight: 6 PRs merged to main, no new site builds (governance + design-ramp + dashboard night)._

## Finished overnight
One session ~18:00 → 00:56 IST — **6 merged to main, no open build PRs added:**
- **[#108](https://github.com/kairali-digital/kairali-web-factory/pull/108)** merged — **Fleet Pulse `/status` dashboard** (STATUS.yaml = single source of truth, kairali.ai render). The Wave-3 dashboard item was **pulled forward and shipped early.**
- **[#104](https://github.com/kairali-digital/kairali-web-factory/pull/104)** merged — **Session 2D FRONT gates** (CLAUDE.md v1.8): design-source / golden-page / stop-at-each-gate / polish-time-box; an unapproved build is now CI-un-mergeable.
- **[#101](https://github.com/kairali-digital/kairali-web-factory/pull/101)** + **[#99](https://github.com/kairali-digital/kairali-web-factory/pull/99)** merged — **design RAMP work COMPLETE** (forest-800 `#003720`, marigold-300 `#F0BF3E` locked); ink inconsistency parked to rev.3 errata ([#100](https://github.com/kairali-digital/kairali-web-factory/pull/100)).
- **[#107](https://github.com/kairali-digital/kairali-web-factory/pull/107)** merged — **U1 resolved:** Ambuj confirmed `.in` and `.com` are **two separate Shopify stores** → two Storefront tokens. (Tokens themselves still pending — see below.)
- **[#105](https://github.com/kairali-digital/kairali-web-factory/pull/105)** + **[#106](https://github.com/kairali-digital/kairali-web-factory/pull/106)** merged — mailbox reconciliation + SOP v1.0 coverage map (docs only).

## Due today (Day 6 · Wave 0)
1. **Dependabot [#93](https://github.com/kairali-digital/kairali-web-factory/pull/93) clears at 13:58 IST today** — after 14:00, re-run the failed jobs and merge (no code change, merges clean). The only date-triggered SCHEDULED item today.
2. **Wave 1 (product microsites) starts Mon 20 Jul — 2 days out.** Its one hard gate is Ambuj's **two** Storefront tokens (per U1); confirm both land before Monday.
3. **healing.recipes** — build merged (#81); still needs your preview well before ~28 Jul + launch-event details when they exist (placeholder shipped, not chased).
4. Self-contained factory work continues while the build queue is data-blocked (Ship Gate §E mechanization triage due ~Day 6, Lighthouse CI wiring [gap #1], Forms v1.1 Turnstile [gap #6]).

## Blocked / waiting on people
- **Deepu (developer)** — the **14 Jul AHV compliance mail** (DPDP consent checkbox on 3 forms, Resort→Hospital schema on 4 pages, DE meta/alt) is **4 days unacknowledged — STALE, chase today.** (The indexing crisis itself is RESOLVED — 646 pages indexed; do not re-raise that.)
- **Ambuj** — the **two** Shopify Storefront tokens (gates Wave 1, Mon 20 Jul). First ask sent by you 17 Jul 19:08; he answers same-day, so a reply is expected today — **not stale yet.**
- **Abhishek + Gaurav Saraswat** — kairalicenters.com GSC access; **you ask them directly** (your 16 Jul ruling, not an agent chase).
- **Abishek** — per-centre NAP detail for the richer centres build (canonical count already resolved; can wait for that build).
- **~~Vikash~~ — CLOSED overnight (D-VIKASH-GSC):** 646 pages indexed, he was right; kairali.com access already existed via Sunaj. Reconciled off the chase list.

## Needs your decision (Abilash)
1. **Merge the two preview-ready site PRs?** [#86 kairalihospitality (9.4)](https://github.com/kairali-digital/kairali-web-factory/pull/86) and [#85 kairaliyoga (9.2)](https://github.com/kairali-digital/kairali-web-factory/pull/85) — each still carries the fact/brand rulings below. (Y/N each)
2. **[#87 canonical-count propagation](https://github.com/kairali-digital/kairali-web-factory/pull/87)** is open awaiting your review (14 centres / 5 countries across the estate). Merge? (Y/N)
3. **Q-KH-JV-NAME / Q-KH-2008 / Q-KH-PHONE** (kairalihospitality) — confirm "Resort Svatá Kateřina" spelling stands and rule whether any "part of the group / established 2008 subsidiary" ownership claim may ship; and whether legacy **+91 9555156156** returns anywhere. (confirm / hold)
4. **Q-YOGA-IAST / PRIVATE / GUESTBOOK** — keep the romanized-display interim for IAST macrons *(recommend yes)*; are 2026-27 yoga sessions private or group (reckoner self-contradicts)?; keep the Pramod Mahajan guestbook entry or drop to 2?
5. **SECURITY** — approve moving the director@ Gmail "passwords" drafts into a password manager, deleting them, and rotating Supabase / GitHub / DB / Shopify? (Y/N)
