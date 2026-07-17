# Triangulation note — arogyashala.in (BACKFILLED 2026-07-17)

**2026-07-17 12:20:00 IST · Session 2B evidence backfill · Standing triangulation rule (docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md, "Secondary / external auditors") + D-DESIGN-DIFF post-build external comparison (DECISIONS.md 2026-07-16 19:40).**

The 16 Jul wave shipped without its cross-model pass — the 17 Jul retro-audit (docs/reports/2026-07-17-prompt1-retro-audit.md §1) marked it MISSING and placed the wave in the pending-triangulation queue. This note clears that state for arogyashala.in: both external verifiers ran 17 Jul 2026, full raw outputs committed in `triangulation-evidence/`.

## What ran
- `scripts/audit-gpt.mjs` (GPT-5 · reasoning/process/end-result) — artifact: `sites/arogyashala.in/app/page.tsx` + `app/llms.txt/route.ts`; prior (old-vs-new): `content-mined/arogyashala.co.in/home.html` + `company-profile.html`. Verdict **FAIL** (exit 2), pass 1.
- `scripts/audit-perplexity.mjs` (sonar-pro · live fact-grounding, artifact auto-stripped per the contamination rule) — same artifact + legacy home as prior. Verdict **FAIL** (exit 2), pass 1.
- Scope note: this is the TEXT/copy/claims-level old-vs-new comparison (the scripts bundle text). The VISUAL similarity comparison ran in-build via the B-14 critic + similarity gate ("not mistakable for a recolor of arogyakendra", five devices no fleet build uses — design-review.md, PR #84).

## Verdicts
- **D-DESIGN-DIFF old-vs-new: PASS** — GPT-5 `vs prior — better for audience: true`; regressions it names are adjudicated below.
- **GPT-5: FAIL** — conversion/ops readiness (WhatsApp channel unproven operationally, no self-serve verification, English-only/no phone) + unsourced certification claims.
- **Perplexity: FAIL** — WHO-GMP/lineage presented without external corroboration; several programme-definition claims are internal policy framed as fact; the interim WhatsApp number is not externally visible.

## Adjudication (standing ruling: auditors are advisors — judge the critique)

**CONFIRMED — routed to owner attention (no fixes in this report-honest session):**
1. **"{LINEAGE_YEARS} years of unbroken practice in the same family" (page.tsx:260).** The 16 Jul 1908 ruling licenses *"a family practising Ayurveda since 1908"* — it does not license **"unbroken"**, and the lineage research marks generation-by-generation continuity as UNVERIFIED. Both auditors flagged it. Needs an owner ruling: drop "unbroken" or license it as primary source. (Same phrasing also on kairaliyoga.com:653 and kairalihospitality.com:289.)
2. **NABH / WHO-GMP shown without proof links.** NABH is externally corroborated (NABH portal, AYUSH Hospitals list AH-2024-0250 — surfaced by Perplexity in the sibling audits); WHO-GMP is consistently claimed in group materials but no certificate is linked. Fix-lane candidate: cite the NABH listing on-page; attribute or link WHO-GMP.
3. **Programme-promise claims (staff product training, counter verification service) are policy statements, not yet operational facts.** They describe the intended programme; the commercials/ops gate (Decision #59 family) should confirm them before any DNS flip.

**REFUTED (with evidence):**
- "Legal links likely 404": `/privacy`, `/terms`, `/cookie-policy` routes exist (`sites/arogyashala.in/app/{privacy,terms,cookie-policy}/page.tsx`, @kairali/legal). The auditor only received page.tsx + llms.txt.
- Several Perplexity findings ("complete range", "cures" language) attach to the LEGACY .co.in content supplied as prior, not to the new page — grep-verified absent from the artifact (the only "cure" match is a code comment recording that legacy cure-claim copy was deliberately dropped).
- "Facts law as protection while publishing unsourced claims": the facts law is CI-enforced (6 guard tests, PR #84 checks green), and it is precisely why NO outlet counts/locations/fees appear.

**ALREADY-RULED / LOCKED (no action):**
- WhatsApp +91 92898 38797 + info@kairali.com are CLAUDE.md locked facts (interim Priya number per DECISIONS 13 Jul). External invisibility is expected. The auditor's *operational* question (is the channel staffed/verified for this NEW brand, what SLA) is fair and folds into attention item 3.
- Tier-2/3 chemist/retail programme definition = Abilash's ruling (DECISIONS/log 2026-07-16 15:31), not an invention.

**DESIGN CONSIDERATIONS (owner's call, iteration-2 candidates, not defects):**
- Hindi/Hinglish CTA cues and click-to-call for a phone-first audience; a self-serve verification flow (shop name + pincode + board photo, or QR/registry when the roster is ruled); a published reply-time promise.

## Disposition
**pending-triangulation: CLEARED for arogyashala.in** — pass 1 ran on both verifiers, was adjudicated, and the evidence is committed. The standing ruling's passes 2–3 (fix → re-run) belong to the fix lane after the owner rules on the confirmed items above; this session is report-honest by instruction.
