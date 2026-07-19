# Google Business Profile access — verdict + owner runbook (D-20260719-19)

**Question asked (owner, 19 Jul):** is the API application still the way in 2026, or is there an
easier path via the web interface? **Answer (8-agent verified research, all claims re-fetched from
official Google/DataForSEO docs 19 Jul): BOTH, in parallel — nothing waits on Google.**

## The verdict in one paragraph

Everything the OS needs from GBP at 14-centre scale is READS: profile-facts audits, reviews,
calls/directions/bookings metrics, local rank grids. Three of the four need NO Google approval at
all — profile facts + reviews come from DataForSEO Business Data (public data, already funded:
~$0.0015/profile, ~$0.075 for a 1,000-review backfill), and rank grids come from DataForSEO Maps
coordinate calls (~$0.03 per 7×7 keyword scan) — never BrightLocal (rejected subscription). The
fourth — performance metrics — has a native web-UI export TODAY (Business Profile Manager →
checkboxes → Actions → Insights → Download Report). The API application is still worth filing NOW
because it is free, slow (official 14 days; real-world 2–4+ weeks, no confirmation email), and the
ONLY route to *automating* the performance pull later; one application covers all eight GBP APIs at
300 QPM — ample forever at our scale.

**⏰ The genuinely time-sensitive item is NOT the API:** the GBP dashboard effectively holds only
~6 months of performance history and nothing can backfill it (same disease as the GSC 16-month
clock). The first multi-profile export should happen THIS WEEK and then monthly.

## Owner actions (~5 minutes total)

1. **(2 min) Domain-email check — load-bearing:** Google's limits page says verbatim to "Ensure
   that your website domain matches your email domain when submitting the request form." Confirm
   **director@kairali.com** is an Owner/Manager on the Kairali/KTAHV Business Profiles (profile →
   People & access). If only a personal Gmail has access, add the director@ address as Owner first.
   Applications from mismatched/personal emails risk rejection.
2. **(1 min) One business group:** at business.google.com confirm all Kairali profiles sit in ONE
   business group (exports/imports are group-scoped). Then tick all profiles → **Actions →
   Insights → Download Report** — that's the first dated performance CSV (calls/directions/
   bookings). Repeat monthly (I'll remind via the Monday lane).
3. **(2 min) Submit the application** — signed in as director@: open
   https://support.google.com/business/contact/api_default → select **"Application for Basic API
   Access"** → paste the **Cloud project NUMBER** (not the ID — from the kairali-analytics-os
   project you create in the GSC/GA4 runbook part A; number shows on the project dashboard) → use
   the use-case text below → submit. Expect NO confirmation email; approval shows as the Business
   Profile API quota flipping **0 → 300 QPM** in Cloud Console (I watch it; follow-up at 3–4 weeks
   if silent).

**Use-case text to paste:**
> Kairali Ayurvedic Group (kairali.com) operates ~14 company-owned Ayurvedic treatment centres and
> wellness properties across 5 countries. We request Basic API Access to manage our OWN verified
> Business Profiles: read Business Information for profile-accuracy audits, read Performance
> metrics (calls, directions, bookings) for monthly reporting, and read/reply to reviews for
> customer service. Read-heavy, low volume (~14 locations, scheduled monthly + per-launch audits),
> no third-party data resale, no lead generation for other businesses.

**Eligibility (verified):** profile verified + active 60 days ✓ · website on the profile ✓ ·
organization account (business.google.com) — created in step 2 if not already.

## What I run without waiting on Google (all funded, no approval)

- DataForSEO **My Business Info** pulls per centre → the §7 facts register, pre-filled for your
  verification (I never edit profiles — propose-only, framework §10).
- DataForSEO **Reviews** snapshots (task-based) per location, dated, into the evidence tree.
- DataForSEO **Maps rank grids** (coordinate-targeted, 7×7) per priority keyword × location, dated.
- Monthly snapshot runbook: performance CSV (your step-2 export) + facts pull + review snapshot +
  rank grid → `launches/<domain>/evidence/` per location; T+7/30/60/90 re-runs post-flip.
- On approval (quota → 300 QPM): swap the manual CSV for Performance API pulls, add v4 review
  reads. Note: the Q&A API sunset (Nov 2025) doesn't touch anything we need.

**Sources:** developers.google.com/my-business — content/prereqs (updated 2025-08-28) ·
content/basic-setup (the 8 APIs) · content/faq ("standard default quota for all eight APIs";
"reviewed within 14 days") · content/limits (updated 2026-05-07; domain-match note; 300 QPM table)
· content/latest-updates (2026 review-tooling investment) · support.google.com/business
answer/9918094 (multi-profile Insights CSV export) + answer/4490296 (bulk verification) +
answer/9199701 (org accounts) · docs.dataforseo.com v3 business_data + serp/google/maps (pricing
re-verified live) · community threads Apr–Jul 2026 (real-world approval timelines; ~6-month
insights history window).
