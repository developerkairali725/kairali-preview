# MORNING BRIEF — 2026-07-13 17:04:13 IST

_Sprint Day 1 of 30. First brief; captures the Day-0 stand-up. Working tree clean, in sync with origin/main._

## Finished overnight
- **Factory pipeline live & green** — deploy `dfd7887` completed 16:55 IST → https://kairali-web-factory-kairali-ai.vercel.app (repo→Vercel chain proven end-to-end).
- **PR #1 merged** — autonomy settings, enforcement hooks, CI gate, CODEOWNERS ([AbhilashKairali/kairali-web-factory#1](https://github.com/AbhilashKairali/kairali-web-factory/pull/1)).
- **Migration Playbook v1.0** committed (`59f37cb`, 21 sources) → `docs/MIGRATION_PLAYBOOK.md`.
- **Governance in code** — CLAUDE.md v1.2 (Knowledge Doctrine a–i, crash-resilience, timestamp-to-second rule), `docs/ENGINEERING_STANDARDS.md`, wiki entity/integration pages seeded (`c710bc8`).
- **Vercel/org resolution logged** — org `kairali-digital` created; repo currently back under `AbhilashKairali` because Vercel Hobby can't deploy private org repos (`1e8ddea`).

## Blocked
- **packages/forms (Q3)** — frozen until Ambuj supplies canonical CRM form schema + webhook endpoint + test-mode flag. Unblock: Ambuj hands over the schema.
- **Site scaffolds (Q8)** — no `sites/<domain>` apps yet; needs the abhilashkr.com Next.js donor code, not on this machine. Unblock: point me to its Drive/repo location.
- **DE/FR clinical-lock gate (Q1)** — word lists are agent-extrapolated seeds; may over-fire (e.g. FR "séjour"). Unblock: native + legal confirmation.
- **DE/FR spec slugs (Q5)** — `ktahv-critical-flows.spec.ts` slugs unverified vs live sitemap. Unblock: 2-min confirm from Abilash.
- **Claims-jurisdiction matrix (Q4)** — only the no-cure floor is enforced; per-market phrase lists missing. Unblock: name the source (legal counsel? competitor scans?).
- **Branch protection (Q9)** — 403 on private free-plan repo; Dependabot is on. Unblock: decision below.
- **pmset power config (Q11)** — one Terminal command (`sudo pmset …`) pending; biggest crash mitigation until the UPS arrives.

## Needs your decision (Abilash)
1. **Vercel Pro (~$20/user/mo)?** Y/N — needed to host the repo under the org and be commercially licensed (Hobby is non-commercial). On yes, I transfer repo to org + reconnect (~5 min).
2. **Branch protection (Q9):** (a) GitHub Pro/Team, (b) make repo public — not advised, or (c) hooks + CI only for now?
3. **abhilashkr.com donor repo (Q10):** which of `portfolio-website` / `kairali-guru-website` / `voyagent*` / `ayurvedic-treatment-packages` is the personal site to import into `sites/abhilashkr`?
4. **whatisayurveda canonical (§9-2):** `.org` or `.com`?
5. **Raag brand manual (§9-8):** when can you deliver the updated manual? It gates `raag-tokens.css` and villaraag.com visual finalization.
6. **Still open from §9:** forward strategy final word · Kairali Organic vs KAIR consolidation · ayurvedafranchise merge-or-satellite · drop-list confirmation · snehachowdhary/theblushlounge primary · ayurvedajournals intent.
