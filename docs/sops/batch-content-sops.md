# Batch Content SOPs — Vikash's legacy-page QA/QC batch · Roshni's 600-post update batches

**Status:** designed 18 Jul 2026 (handover to-dos #2–3), built into the Playbook wizard same day.
**Rendered at:** https://kairali-web-factory-kairali-ai.vercel.app/playbook — Marketing → "QA/QC a batch of existing pages", Deepu → "Batch QA/QC", Roshni → "Update OLD posts in batches".
**This file is the source of truth** (wizard header rule); the wizard is the router. Parent SOP: `team-website-lifecycle-sop.md` (the Workbook) — everything here reuses its stages, gates, and markers; nothing bypasses them.

---

## SOP 1 — Batch QA/QC of existing live pages (first user: Vikash's 11 KTAHV landing pages)

**The shape:** a batch **Deepu-solo run** (Workbook Deepu-Solo Mode, batched). Marketing's only inputs are the URL list and the facts verification — the two things only a human who knows the business can supply. Everything else is the machine + Deepu.

**Division of labour**
- **Vikash (or any submitter):** list the live URLs (template in the wizard) · verify every fact on every page against the FACTS doc (CORRECT / old → new) · one Handoff Card for the batch · answer bounce questions fast.
- **Deepu:** prereq check (target-site scaffold + signed front-gate rows) → `wp-snapshot` EVERY page first (committed to `backups/`) → import all pages as real pages under `sites/<domain>/` on ONE branch, applying only the fixes the facts notes name → ONE PR → CI reads the whole batch → DEV-FIX vs BOUNCE per page → publish page-by-page via Novamira (snapshot-first publish prompt, human clicks Publish) → CHECKED-✅ per page + ledger rows sharing the batch `pr:` number.

**Rules that make it safe**
1. **QA/QC ≠ redesign.** Same page, better. A redesign is a different task with its own front gates.
2. **Snapshot-first is absolute** — a page that fails to snapshot is held out of the batch.
3. **Banned words on legacy KTAHV pages are EXPECTED** (they're old). CI flags them; the wording fix is marketing's + Abilash's call — Deepu lists, never silently rewrites.
4. **Batches are severable** (Workbook Part 5): one red page moves off the branch; the green rest never wait.
5. **Prereq:** one-time setup #1 (`sites/ayurvedichealingvillage.com`, `entity: "ktahv"`, signed `approvals.yaml`). Until then the batch is HELD with `WAITING-ON-SETUP.txt` — never published around the gates.

**Honest budget:** ~1–2 days for an 11-page batch, end to end.

---

## SOP 2 — Updating old posts in batches (first user: Roshni, ~600 whyayurveda.org posts)

**The verdict on "all 600 in a day": NO — and it's Google-risky.** Editing (not new posting) has no Google rate limit, BUT mass AI-rewriting hundreds of YMYL health posts inside days is the scaled-content-abuse fingerprint the March 2026 core update sharpened (research: session report `docs/reports/2026-07-18-content-pipeline-architecture.md`). One demotion undoes years of ranking; the batch plan IS the fast way.

**The plan**
1. **Priority batches by GSC traffic:** top 50 posts first (Abilash/Vikash pull the list from Search Console), then 30–60 posts/day → the whole 600 in **2–3 weeks**.
2. **Prereqs before batch 1:** (a) `sites/whyayurveda.org` scaffold (one-time setup #2) so the content gates fire on posts; (b) the **sitewide internal-link map** (built from GSC data — handover to-do #7) so links come from the map, never from memory. Until both: HELD.
3. **Per post:** author voice block first → the batch-update prompt (wizard `P_POST_UPDATE`): improve-not-rewrite, 2–5 internal links from the map only, authoritative external links only, conservative claims, `[NEEDS FACT]` for gaps.
4. **Every batch through the full pipeline** — same gates, same doctor checkpoint for clinical topics, batch handoff per the Workbook (one PR can carry a batch; severable).
5. **Safety loop:** GSC weekly per shipped batch. Steady/up → next batch. Broad dip across updated posts → **PAUSE all batches, tell Abilash same day.**

---

*Timestamped per repo law: written 2026-07-18 (session: playbook batch SOPs + one-time setup walk). Wizard implementation: `sites/kairali.ai/app/playbook/page.tsx`.*
