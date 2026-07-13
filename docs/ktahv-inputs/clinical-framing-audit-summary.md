---
source_fileId: 16hoaNm5SAEkuS8EnMLzLjC3W-aaXoX3ZEoPvE8ep8ck
source_title: KTAHV_clinical_framing_audit
source_type: Google Sheet (owner director@kairali.com, created 29 Jun 2026, last modified 10 Jul 2026)
ingested: 2026-07-13 19:03:43 IST
ingested_by: agent (Drive corpus sweep, D-delegation 13 Jul 2026)
note: Drive export returned the Summary tab; the row-level "Framing Audit" tab (316 flagged pages with per-page severity, banned terms, current meta, suggested clinical rewrites, and fix directives) lives in the sheet itself — pull it via Sheets when the KTAHV migration rewrite-vs-deindex triage starts. Sample rows quoted below from the search snippet.
---

# Kairali — Clinical-Framing Content Audit (Summary)

| Field | Value |
|---|---|
| Source | WordPress export 2026-06-29 (471 published pages) |
| Purpose | Identify spa/resort/holiday framing and disease-cure claims that conflict with the active GST Show Cause Notice constraints (clinical language mandatory). |
| Pages flagged | **316 of 471 (67%)** |
| HIGH severity | 95 |
| MEDIUM severity | 166 |
| LOW severity | 55 |
| Most common spa/resort terms | resort (68), spa (64), luxury (52), indulge (16), tourist (11), getaway (8) |
| Most common cure-claim terms | cure (21), guarantee/guarantees/guaranteed (29), cures (10), no-side-effects (4) |
| Priority 1 (legal) | Pages with cure / guarantee claims in indexed meta — fix first. |
| Priority 2 | Core commercial pages (KTAHV, consultancy, awards, visit-kerala) — suggested rewrites provided. |
| Priority 3 | Legacy 'luxury retreat' archive pages — set noindex (already removed from HTML sitemap). |
| Priority 4 | Body-copy-only mentions — revise with copywriter. |
| Note | Suggested rewrites remove prohibited claims and apply clinical framing; drafts for team + counsel review, not final/approved copy. |

## Sample rows from the Framing Audit tab (per Drive search snippet; full 316-row table in the sheet)

Columns: # · Severity · Issue in · Page · URL · Cure/disease-claim terms · Spa/resort/holiday terms · Current meta title (Yoast) · Current meta description · Suggested clinical meta title · Suggested clinical meta description · Fix directive

1. HIGH · META · Apply Now · https://ayurvedichealingvillage.com/apply-now/ · terms: luxury, retreats · fix: remove luxury/retreats from meta; reframe clinical.
2. HIGH · META+BODY · Ashtanga Yoga & Ayurveda Retreat · https://ayurvedichealingvillage.com/ashtanga-yoga-and-ayurveda-retreat/ · terms: luxury, retreat(s) · fix: legacy retreat page — set NOINDEX (already removed from sitemap) or remove luxury/retreat framing.
3. HIGH · META+BODY · Attractions (15 Kms & Below) · /attractions-15kms-and-below/ · term: tourist · fix: remove tourist from meta.
4. HIGH · META+BODY · Attractions (25 to 50 Kms) · /attractions-25kms-to-50kms/ · term: tourist.
5. HIGH · META+BODY · Attractions (Above 50 Kms) · /attractions-above-50kms/ · terms: tourist, vacation.
6. HIGH · META+BODY · Auszeichnungen und Akkreditierungen (DE) · /de/auszeichnungen-und-akkreditierungen/ · terms: luxury, resort, retreat, spa (German-locale page — banned senses appear in DE too).

**Relevance to this repo:** this audit is the row-level input for the post-sprint KTAHV migration rewrite-vs-deindex triage (PROJECT_CONTEXT §6) and validates the compliance lint's banned-word list against real production pages, in all three locales.
