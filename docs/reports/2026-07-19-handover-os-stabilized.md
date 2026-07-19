# HANDOVER — OS stabilized, awaiting new workflow (written 2026-07-19 11:00 IST)

Read this first, then `STATUS.yaml` + `state/boot.json` as always. Run `node scripts/boot-contract.mjs` + `node scripts/doctor.mjs` if the SessionStart hook didn't.

## THE ONE THING TO KNOW
Abilash is **developing a new/improved website-OS workflow** and will hand over **process files**. This session's job was to make the current state **stable + sorted** so the new workflow builds on a clean base and the gaps are visible. **That is done.** Do **NOT** start new design/build work. **Designs are FROZEN** until the new workflow lands. When the process files arrive, ingest them first; until then, the correct posture is: hold, keep the base clean, and surface anything that drifts.

## CURRENT STATE (verified this session)
- **`main` is the clean base — tip `676d619`**, core CI green (`gate` + `factory-gate`). State-of-truth is always `origin/main`.
- **Open PRs: 11, every one labelled** (down from 18). Nothing is unlabelled or ambiguous.
- **Worktrees: 6** (down from 35). 5 dirty ones retained on purpose (uncommitted state tied to parked/held PRs; committed state is safe on origin).
- Already on `main` from the weekend sprint: 8 golden homepages + 2 full sites (kairaliequipment #131, theblushlounge #154) + the OS machinery (beauty gate, go-science gate, design external-AI review gates, gate registry).

## OPEN-PR LEDGER (frozen — do not merge/build without the new workflow)
- **PARKED — design freeze (7)** `parked-design-freeze`: #164 kairaliorganic full-site · #163 golden-gate battery · #157 villaraag full-site · #146 design-review advisory lane · #145 KTAHV 10-LPs · #132 kairalicenters rebrief · #130 ayurvedafranchise full-site.
- **DEFERRED — new workflow (3)** `deferred-to-new-workflow`: #139 fleet footer-socials (drifted, 16-file conflict vs the newer `@kairali/chat` pkg) · #143 sweep-rulings docs · #150 session-close 18 Jul + CLAUDE v1.13 auto-merge doctrine.
- **HELD — owner go-live (1)** `held-owner-golive`: #144 abhilashkr.com publish = production domain cutover; awaits Abilash's explicit publish word (HARD GATE — DNS/go-live is human).

Full record: BACKLOG.md ⏸ ledger (in NOW) + DONE entry `2026-07-19 10:55:25 IST`.

## GAPS SURFACED FOR THE NEW WORKFLOW (Abilash wants these visible)
1. **Doc-vs-reality gap:** repo settings are already flipped to **auto-merge ON / required-approvals 0**, but `main`'s CLAUDE.md doesn't document it (the v1.13 text is stuck in unmerged #150). Resolve deliberately in the new workflow — don't just force-merge #150.
2. **~160 remote branches** need cleanup by **content-diff**, NOT `git branch --merged` (squash-merges hide as unmerged — the [[squash-merge-strands-commits]] trap). Deferred to a careful pass.
3. **Dependabot:** moderate vuln alert **#2** still open; the 4 major bumps (#9–#12) were **closed/deferred** — needs a deliberate dependency-upgrade pass (not piecemeal auto-merge).
4. **`uptime` monitor** flapped on kairalicenters.com + kairalifranchise.com at 10:06 IST (both 200/301 on recheck). Monitor is working as designed; **watch kairalicenters** — it's on the recently-hacked shared origin.
5. **5 dirty worktrees** remain; they clear when their parked/held PRs resolve under the new workflow.

## STANDING PROTOCOL (unchanged)
One ask at a time · explicit PR merge order always · HARD GATE 9 (agent never self-merges; armed auto-merge = owner's standing merge only) · no production/DNS while unattended · `--force-with-lease` only · every session ends with STATUS.yaml + auto-handover · fresh session when heavy · pushback duty.

## PASTE THIS TO START THE NEXT SESSION
> Read docs/reports/2026-07-19-handover-os-stabilized.md first, then STATUS.yaml. The OS is stabilized and designs are FROZEN pending my new workflow. If I've given you the new process files, ingest them and tell me the plan before doing anything. If not, hold — don't start design/build work; just confirm the base is still clean (origin/main green, 11 labelled PRs, no drift) and wait for my files. Standing protocol as always.
