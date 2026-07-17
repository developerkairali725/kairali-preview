# Triangulation note — kairaliyoga.com (BACKFILLED 2026-07-17)

**2026-07-17 12:20:00 IST · Session 2B evidence backfill · Standing triangulation rule (docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md, "Secondary / external auditors") + D-DESIGN-DIFF post-build external comparison (DECISIONS.md 2026-07-16 19:40).**

The wave shipped without its cross-model pass — the 17 Jul retro-audit marked it MISSING (pending-triangulation queue). This note clears that state for kairaliyoga.com: both external verifiers ran 17 Jul 2026, full raw outputs in `triangulation-evidence/`.

## What ran
- `scripts/audit-gpt.mjs` (GPT-5) — artifact: `sites/kairaliyoga.com/app/page.tsx`; prior (old-vs-new): `content-mined/kairaliyoga.com/home.html` + `retreat-programs.html`. Verdict **FAIL** (exit 2), pass 1.
- `scripts/audit-perplexity.mjs` (sonar-pro, artifact auto-stripped) — same artifact. Verdict **FAIL** (exit 2), pass 1.
- Scope note: text/claims-level comparison; the visual pass ran in-build (B-14: 8.8 → 9.2 it.2; three twin-devices with arogyashala de-twinned — design-review.md, PR #85).

## Verdicts
- **D-DESIGN-DIFF old-vs-new: PASS** — GPT-5 `vs prior — better for audience: true` (vs a legacy site whose real defects, per audits/kairaliyoga.com-2026-07-16.md, are an 8-years-expired retreat calendar, a homepage feed frozen on 2013-era posts, a stale 2018 http-only sitemap, and 2013-vintage jQuery — see the correction below).
- **GPT-5: FAIL** — the "private sessions" contradiction (real — see below), unsourced accreditation/inclusion claims, price-discovery friction.
- **Perplexity: FAIL** — but it **externally CONFIRMED the load-bearing institutional facts**: NABH AYUSH accreditation (portal.nabh.co, AH-2024-0250), Kerala Clinical Establishment certificate, 1989 group founding. The FAIL is driven by internally-sourced programme-structure claims it cannot see (the reckoner is not public) and by the lineage phrasing.

## Adjudication

**CONFIRMED — routed to owner attention (no fixes this session):**
1. **THE REAL CATCH — the site takes the "private" side of an unresolved contradiction.** Q-YOGA-PRIVATE (QUESTIONS.md 2026-07-16 23:15) records the RATES_RECKONER contradicting itself (private vs group) and states "The site now claims NEITHER". **That record is wrong about the shipped state:** page.tsx asserts "private" throughout — lines 54 ("a private sunrise yoga session and a private guided mindfulness session"), 87 (FAQ: "Sessions are private, not group classes"), 175, 277–279, 358, 504. The owner's Q-YOGA-PRIVATE answer is now load-bearing: if the true 2026-27 delivery is group, the shipped copy misrepresents a sell-critical service detail. This is exactly what the cross-model pass exists to catch.
2. **"{LINEAGE_YEARS} years of unbroken lineage" (page.tsx:653)** — "unbroken" exceeds the licensed D-1908 phrasing (same finding on arogyashala.in:260, kairalihospitality.com:289). Owner ruling needed.
3. **Operational programme promises stated as universals** — daily therapy + herbal steam, daily physician check-in, all-organic meals, in-room detox water, weekly workshops, exact check-in/out times, strict alcohol/smoke-free. All are reckoner-sourced (internal); Perplexity found partial external support (e.g. 1-treatment/day on some packages) but no universal guarantees. Fix-lane candidates: per-programme phrasing or "typically", and NABH citation on-page. Precise distances (25/75/125 km) should read as approximate.

4. **PR #85's legacy-site description is partly unsupported — a cross-site claim transplant.** The PR body says the legacy kairaliyoga.com had "expired 2020 prices on every course page … no viewport meta". Verified today: the mined home.html HAS a viewport meta; no 2020 course prices exist in the 9-page mined corpus; and "expired 31-Mar-2020 course prices" is kairali.guru's audited defect (wiki/log 16 Jul 16:53), not this site's. The real audited defects are the 2018-expired calendar and 2013-frozen feed (audits/kairaliyoga.com-2026-07-16.md §6–7). Caught by the Session 2B checklist backfill agent and independently re-verified. Disclosure: the auditors' brief for THIS triangulation repeated the PR's wording in the thinking section — the old-vs-new verdict stands because both auditors also received the actual legacy HTML as the prior, but the correction is on record here. Retro lesson filed in LEARNINGS.md: PR evidence claims must trace to the site's own audit file.

**REFUTED (with evidence):**
- ""Reckoner-exact" is claimed but not evidenced": `test/guards.test.js` pins BOTH string sets (exact IAST spellings must remain on the page; display names must stay romanized) and programme names/durations; guards 8/8 in PR #85 CI. The auditor's meta-point is accepted — future triangulation bundles should include the guard files as evidence.
- "Legal pages not evidenced": `/privacy`, `/terms`, `/cookie-policy` routes exist (@kairali/legal).
- "~56 legacy URLs have no documented fates — cannot flip DNS": correct fact, wrong framing — it is already ON RECORD as the pre-flip blocker in PR #85 and the BACKLOG cutover lane; nobody is flipping DNS before it.
- "Testimonial provenance unproven": guestbook entries were carried verbatim with provenance flags and the historical-archive framing was queued to the owner (Q-YOGA-GUESTBOOK).

**ALREADY-RULED / LOCKED:**
- Price-free is doctrine (the legacy site's expired-2020-prices is the proof of why); locked contacts (info@kairali.com, interim WhatsApp per DECISIONS 13 Jul); Kurale IAST romanized-display interim is documented and queued (Q-YOGA-IAST).

**DESIGN CONSIDERATIONS:**
- GPT's price-anchor problem is real UX input for the owner: a quote-form + reply-time promise could offset the (correct) no-prices rule; a "how we staff your sessions" panel could offset the (correct) no-fabricated-roster rule.

## Disposition
**pending-triangulation: CLEARED for kairaliyoga.com** — pass 1 ran on both verifiers and was adjudicated; evidence committed. Item 1 (Q-YOGA-PRIVATE) has escalated in weight: the shipped site asserts the "private" side ~7 times, so the owner's answer now decides whether shipped copy must change before any flip. Passes 2–3 belong to the fix lane.
