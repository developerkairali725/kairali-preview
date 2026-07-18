# HANDOVER — next session pickup (written 18 Jul 2026, end of the marathon session)
Read this + docs/reports/2026-07-18-content-pipeline-architecture.md first. PR #109 MERGED — the Playbook is live on kairali.ai.

## THE LINK (one link for everything)
https://kairali-web-factory-kairali-ai.vercel.app — Fleet Pulse (home) · /playbook (wizard) · /guide/access · /guide/voices · /guide/deepu

## TO-DOS (priority order)
1. **Retire old Vercel projects** (after Abilash reviews the merged site): delete project `kairali-team-workbook` (team `kairali`) — superseded. Check for any other stale dashboard projects.
2. **Custom SOP: Vikash — 11 legacy HTML landing pages, QA/QC only, post immediately.** Design: a batch Deepu-solo run — wp-snapshot each live page → import all 11 into sites/ayurvedichealingvillage.com (needs one-time setup #1 FIRST) → one PR → CI catches issues → fix trivia → publish batch via Novamira → CHECKED markers. Add as a wizard task ("QA/QC a batch of existing pages"). Vikash's role: supply the 11 URLs + facts verification; Deepu executes; ~1-2 days total.
3. **Custom SOP: Roshni — 600 whyayurveda posts** (internal links, external links, content to compliance + author voice). **Verdict on "all 600 in a day": NO — and it's Google-risky.** Editing (not new posting) has NO Google rate limit, BUT mass AI-rewriting 600 YMYL posts in days is the scaled-content-abuse fingerprint (March 2026 core update — see the Google News research earlier in the session report). Recommended: priority batches by GSC traffic (top 50 first), 30–60 posts/day, 2–3 weeks total, every batch through the pipeline gates, monitor GSC weekly. PREREQ: the sitewide internal-link map (Q-PLAYBOOK-V4 item 3) + sites/whyayurveda.org scaffold (one-time setup #2). Build her a wizard task ("Update old posts in batches").
4. **Deepu one-time setup** (Workbook Part 4, 6 items) — still the hard blocker before any KTAHV/blog item flows.
5. **FACTS docs**: Vikash fills the [TO FILL] gaps (assign on delegation sheet). Later: auto-generate FACTS from repo @kairali/facts so Drive + code never drift.
6. **Vikash follow-ups**: transcripts email unanswered (thread 19f7394d19130949); 2 UNREAD replies on GSC thread 19f6a1348e3f5d73 (Sunaj already gave kairali.com admin; live URL clarification).
7. **whyayurveda sitewide link map** — build after first content item ships (needs GSC data).
8. **Old workbook site removal + docs/sops/*.html cleanup already done in repo; STATUS.yaml session-end update on each session.**

## OPEN QUESTIONS FOR ABILASH (asked in the session, still unanswered)
- Q-PLAYBOOK-V4 #2: confirm "ChatGPT notes" = the Control SOP docx (or point at the real file).
- Dr. Ashika vs Ashikha Raj spelling — settle from her registration (blocks that byline).
- Akshar voice for yoga content: GO skill ingested; apply to a yoga author voice when yoga content starts?
- Old ChatGPT once-over reconciliation is DONE if the docx interpretation is confirmed.

## ANSWERS GIVEN AT HANDOVER (so the new session doesn't re-litigate)
- **Team↔git**: marketing NEVER touches git (by design; their work enters git at Deepu's Stage 1 or Abilash's Express Lane). Git appears only in: Deepu Day 0 step 3 (clone via GitHub Desktop), Deepu publish Stage 2 (branch/PR), Express Lane prompt step 1-2. Repo: github.com/kairali-digital/kairali-web-factory. Access grants: /guide/access section 2 (org invite → repo Write). Marketing Day 0 contains NO git — correct, not a gap.
- **FACTS (Drive) vs repo**: complementary, not duplicates. REPO (for Claude+devs): brand tokens packages/ui/brand-tokens.css + docs/brand/, image manifests docs/media/ + per-site IMAGE_MANIFEST.md (incl. CSV descriptions), @kairali/facts computed counts. DRIVE FACTS (for non-git humans): business facts (prices/phones/addresses). Claude reads the repo automatically when building; marketing reads Drive. Sync idea in to-do #5.
