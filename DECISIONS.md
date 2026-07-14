# DECISIONS.md — append-only

## 2026-07-13 18:28:44 IST — Abilash, in-session rulings
- D6: theblushlounge.com = PRIMARY (live domain); snehachowdhary.com = secondary/forward.
- D3: Kairali Organics and KAIR are TWO brands. Organics = 100% chemical-free products; KAIR = soaps/shampoos/moisturizing cream/body wash (not fully chemical-free).
- D2: whatisayurveda.com = canonical; .org (older) forwards to it. Context in historical chats.
- D1 (forward strategy): delegated to agent — research best-ROI, Google-compliant approach (Reddit/expert consensus) and decide; Runbook §2D semantic map is the starting recommendation.
- Drop list: balanceglow, mobistorr, tourdenight, trueinstantloan → DROP. kagapp = KEEP as placeholder (future app). All .in centre variants = plain forwards.
- kairali.guru: intern (Eeshal) repo github.com/Eeshal27/kairali-guru- confirmed as her latest; plan = evaluate as baseline, migrate into monorepo, Eeshal continues work in the Factory repo via PRs.
- Launch evidence: filled sitewide+pagewise checklists committed per launch in launches/<domain>/ (CLAUDE.md rule).
- Team: Eeshal, Deepu, Ambuj, Sunaj, Satyam join via GitHub org invites (Abilash executes); PR + Vercel-preview review flow; only Abilash merges main.

## 2026-07-13 18:51:36 IST — Abilash, evening rulings
- INTERIM chat: use the existing Priya/Chatbase bot (chatbotId rpNt_uRW6W8EDiTf6AvYJ, extracted from live kairali.guru) on new sites NOW; replace with the four entity bots later. Compliance caveat noted: clinical-register bot on non-clinical surfaces is temporary by owner's order.
- INTERIM WhatsApp: chat-first CTAs on all sites (email alone is not enough — most clients won't write email). Use Priya's +91 92898 38797 until a group number is provided; swap later.
- kairali.guru upgrade: blend the LIVE site's design + Eeshal's repo design, improve both — neither is the ceiling.

## 2026-07-13 18:55:39 IST — agent research per D1 delegation
- D1 CLOSED (forward strategy): SEMANTIC MAP adopted — every surplus domain 301s (Cloudflare Bulk Redirects, single hop, no chains, never in Ads final URLs) to the topically nearest LIVE Kairali site, never all→one; full findings, citations and per-family mapping rules in docs/research/forward-strategy-D1.md.

## 2026-07-14 11:59:06 IST — agent, stale-fact correction per SPRINT_STATE gap #14 (standing instruction: register-table amendments via DECISIONS)
- kairali.guru LIVE-site locale fact corrected: the live site is EN-ONLY (verified 13 Jul — /de/ 404s, no hreflang, dead UA analytics). The EN/DE/FR/AR/RU build exists ONLY in Eeshal's repo and becomes real at the Wave-2 migration. SITE_DESIGN_LOCALE_REGISTER.md row amended this commit. PROJECT_CONTEXT.md §1/§3/§7 carry the same stale claim but the file is being replaced wholesale by PR #2 (mentor doc-sync, same stale lines) — patching those three lines is queued in BACKLOG for immediately after PR #2 merges, so the fix isn't lost in a merge conflict.

## 2026-07-14 11:59:06 IST — agent, design-critic gate formalized (BACKLOG NOW item; SPRINT_STATE action #10)
- The ad-hoc arogyakendra design pass is now LAW for every Factory site: scripts/design-review/PROMPT.md (skeptical-marketer persona, 5 criteria, mobile-first method, computed-style audit, average ≥9.0/10 + no criterion <7, max 3 iterations) + Ship Gate B-14 in SITE_LAUNCH_CHECKLIST_v1.0.md. Evidence contract: launches/<domain>/design-review.md with an Honest-limitations section. Criteria amendments only via LEARNINGS-driven PR.
