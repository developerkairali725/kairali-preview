# MORNING BRIEF — 2026-07-17 08:04:12 IST

_Sprint Day 5 of 30 (13 Jul → 12 Aug 2026). **As of `origin/main` @ e1c1651 (16 Jul 21:08:10 IST).** Main clean + in sync. Busy overnight: 5 PRs merged, 2 new sites banked to open PRs. Flags in durable logs: 22 BLOCKED / 27 SECURITY / 8 HACKED (historical — grep base for the snapshot script, not new incidents)._

## Finished overnight
One build session, ~18:30 → 23:16 IST. **5 merged to main + 2 new sites banked to open PRs:**
- **[PR #84](https://github.com/kairali-digital/kairali-web-factory/pull/84)** merged — sites/arogyashala.in v1, two-door retail-trust one-pager (B-14 **9.1 PASS**, first D-DESIGN-DIFF build).
- **[PR #81](https://github.com/kairali-digital/kairali-web-factory/pull/81)** merged — sites/healing.recipes v1, the four Gita Ramesh books (launch site, preview-ready, 9.2). *The build step of the end-of-July launch item is now DONE.*
- **[PR #82](https://github.com/kairali-digital/kairali-web-factory/pull/82)** merged — Fleet QA/QC audit tail complete (21 audits, 32-domain triage). **[PR #83](https://github.com/kairali-digital/kairali-web-factory/pull/83)** merged — Phase B enablement (3 design-research briefs + agentic-memory deep-research report).
- **[PR #86](https://github.com/kairali-digital/kairali-web-factory/pull/86)** (OPEN, preview-ready) — sites/kairalihospitality.com v1, cinematic multi-property umbrella. B-14 **9.4 PASS — fleet's highest**. Not merged.
- **[PR #85](https://github.com/kairali-digital/kairali-web-factory/pull/85)** (OPEN, preview-ready) — sites/kairaliyoga.com v1, Sanskrit-forward E-register. B-14 **9.2 PASS**. Not merged.

## Due today (Day 5 · Wave 0)
No SCHEDULED item date-triggers today or tomorrow. What the BACKLOG pass surfaced:
1. **Wave 1 (product microsites, Days 7–13) starts Mon 20 Jul** — 3 days out. Its one hard gate is Ambuj's Shopify Storefront token; confirm it lands before Monday (below).
2. **Two preview-ready PRs awaiting your review** — #86 (9.4) and #85 (9.2), each carrying a short list of fact/brand rulings before merge (see decisions).
3. **healing.recipes** — build merged (#81); remaining is your preview well before ~28 Jul + launch-event details when they exist (placeholder shipped, not chased).
4. **Self-contained factory work continues while the build queue is data-blocked** — packages/ui floating-stack, mechanization triage into packages/checklist (Ship Gate §E, due Day 6), Lighthouse CI wiring [gap #1], Forms v1.1 Turnstile [gap #6].

## Blocked / waiting on people
- **Deepu (developer)** — WP tech fixes on AHV (incl. sitemap_index 404). Asked 14 Jul; **3 days, STALE as of today — chase now.** Pairs with Vikash's AHV indexing fix.
- **Ambuj** — Shopify Storefront token (gates all of Wave 1, Mon 20 Jul) + registrar access sheet. In daily contact, not silent — confirm the token lands before Monday.
- **Vikash** — kairali.com GSC property + AHV indexing (3/125) fix. Email sent 16 Jul; **status was requested by today.**
- **Abishek** — canonical centres/physician roster: still the one item the whole non-revenue build queue waits on.
- **Abhishek + Gaurav Saraswat** — kairalicenters.com GSC access; you ask them directly (your 16 Jul ruling, not an agent chase).
- **SECURITY (open, for you)** — plaintext credentials in director@ Gmail "passwords" drafts. Move to a manager, delete, rotate the important ones.

## Needs your decision (Abilash)
1. **Merge #86 kairalihospitality (9.4) and #85 kairaliyoga (9.2)?** (Y/N each)
2. **Q-KH-JV-NAME** — the card prints "Resort Svatá Kateřina" (your dictated "Swatak Katrina" is verified to this; the misspelling is guarded from shipping). Confirm the spelling stands, and rule whether any ownership / "part of the group" claim may ship at all. (confirm / hold)
3. **Q-KH-2008 + Q-KH-PHONE** — print "established 2008 as a subsidiary of the group"? And should the legacy sitewide line **+91 9555156156** return anywhere on this site? (Y/N each)
4. **Q-YOGA-IAST** — Kurale (the manual's display face) can't set IAST macrons; interim ships romanized display names + exact IAST on the support face. **(a)** keep interim / **(b)** scoped face-mix / **(c)** replace the display face fleet-wide (a Brand Manual ch.04 amendment). *Recommend (a) now.*
5. **Q-YOGA-PRIVATE + Q-YOGA-GUESTBOOK** — are 2026-27 yoga sessions **private or group** (reckoner contradicts itself)? And keep the late Pramod Mahajan guestbook entry (historical-archive register) or drop to 2 entries?
6. **SECURITY** — approve moving the director@ "passwords" drafts into a password manager, deleting them, and rotating Supabase / GitHub / DB? (Y/N)
