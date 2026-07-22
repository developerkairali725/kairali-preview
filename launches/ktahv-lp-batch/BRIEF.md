# BRIEF — KTAHV landing-page batch (front gate 1 of the D-LP-LIST lane)

Drafted: 2026-07-18 19:05:00 IST · weekend-sprint session · branch feature/ktahv-lp-front-gates.
Authorities: DECISIONS.md D-LP-LIST (18 Jul 2026 17:46 IST) · docs/ktahv-inputs/live-lp-list.md (canonical URL list)
· docs/design/LANDING_PAGE_DOCTRINE.md (draft v0.9 — where this brief and that draft disagree, the owner's ruling
at this gate wins and the doctrine gets the amendment) · CLAUDE.md KTAHV clinical register + banned-word lock.

## What this batch is

**Priority 1 — rebuild the 10 LIVE ad-serving legacy LPs** on ayurvedichealingvillage.com
(full HTML + signals mined 18 Jul: docs/ktahv-inputs/lp-mining/). These pages take paid traffic
TODAY; their replacement is revenue-path work, mine-first law already satisfied.

**Priority 2 — build 3 NEW LPs after the ten:** KTAHV consultation · franchise lead-gen ·
healing.recipes launch (briefs in §2 of STRATEGY.md).

## Who it is for

Paid-click patients (Google Search high-intent + city PPC + brand-defence + DE market), not organic
readers. Every LP obeys: message match to its ad/keyword · ~1:1 attention ratio · single CTA ·
noindex · `data-cta` events (Factory /lp law).

## What it must achieve

1. Replace resort-register pages that are a live GST-SCN liability (worst pages: 45–54 banned-word
   hits each; two slugs carry banned words in the URL) with clinical-register LPs — patient,
   physician, treatment, programme, Panchakarma — without losing the conversion architecture that
   makes them earn (forms with UTM attribution, WhatsApp-first for India-geo, proof walls, pricing).
2. Survive Google Healthcare policy + India DMR Act review: no cure claims, no scheduled-disease
   promises, no quantified outcome badges ("9 kgs / 14 days" goes; programme description + disclaimed
   testimonial stays). Medical copy gets Dr. Deepu John's sign-off before staging→production (HARD GATE 7).
3. Zero ad downtime: **no live URL changes or redirects without Vikash's confirmation FIRST** —
   his ads point at these exact URLs (STRATEGY.md carries the prominent section).

## Golden page (named — overrides the homepage default)

**LP #2 /panchkarma-treatment.html** — highest-value single treatment query, richest authority
content, and the page with Clarity session-recording evidence. Built first, STOP for approval;
the other nine (then the three new LPs) match it.

## Constraints and blockers acknowledged

- TARIFF_MODE + BOOKING_ROUTE (roadmap §4) gate the FULL KTAHV WordPress rebuild — **not this LP lane**.
  Interim LP conversion routing per locked facts: WhatsApp **+91 92898 38797** (Priya) primary for
  India-geo, **info@kairali.com** + form for EU/US; forms keep the live UTM hidden-field contract and
  store-first CRM intent (Satyam spec §4 of the LP doctrine — verify before build).
- Locale law: #9 is DE; rebuild ships EN/DE/FR or is explicitly flagged EN-only-pending-translation.
- Build platform: Factory (`/lp/<campaign>` on the rebuilt KTAHV site's repo home, sites/ktahv or the
  ayurvedichealingvillage.com rebuild) — final host/URL plan is a strategy-gate item, Vikash-gated.
- The live pages are under ACTIVE edit (copy changed between 14 and 18 Jul snapshots) — re-diff at build.

> reply APPROVE brief or CHANGES <notes>
