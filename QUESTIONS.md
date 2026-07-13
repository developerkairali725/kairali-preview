# QUESTIONS.md — append-only; unattended sessions log here and continue

## 2026-07-13 · Day-0 scaffold session (Claude Code)

1. **DE/FR clinical-lock word lists are SEEDS.** CLAUDE.md gives examples (Kur/Urlaub/Luxus; cure/vacances/luxe); I extrapolated a fuller list in `packages/compliance/src/rules.js`. Needs native + legal confirmation before the DE/FR gate is treated as authoritative. Note: FR "séjour" and "hôtes" may be legitimate in clinical contexts (séjour = hospital stay) — flagging may over-fire; review wanted.
2. **kairali.com mixed register.** The clinical lock applies only to KTAHV sections/links on kairali.com. v1 convention implemented: MDX frontmatter `entity: ktahv` overrides the site entity per page. Confirm this convention or specify another.
3. **packages/forms is BLOCKED** on the canonical CRM form schema + webhook endpoint + test-mode flag from Ambuj (START_HERE §3-B item 9). Charter and v1-freeze rules are documented in the package; no code until the schema arrives.
4. **Claims-jurisdiction matrix** (India DMR/ASCI · UK MHRA · US FDA/FTC · EU): v1 lint enforces only the universal no-cure-claims floor. Per-market regulated-phrase lists needed to gate the full matrix — who supplies these (legal counsel? Semrush competitor scans?)?
5. **START_HERE §3-E:** DE/FR slugs in `tests/ktahv-critical-flows.spec.ts` still need confirmation against the live sitemap (Abilash, 2 min).
6. **GitHub org/repo do not exist yet** (`kairali-digital/kairali-web-factory` → 404 on 13 Jul). Local repo is committed and remote is preconfigured; push blocked until Step 1 (accounts) is done and this machine gets GitHub credentials (`gh auth login` or a PAT). Vercel import also pending.
7. **"unique" and similar filler in code files:** technical usages ("unique key") would false-positive, so `.ts/.tsx/.js/.jsx` violations report as warnings, content files as errors. Confirm this severity split.
8. **Site scaffolds not created yet.** No `sites/<domain>` apps exist; Step 4 expects the already-built abhilashkr.com Next.js code to be dropped in — that code is not on this machine. Where does it live (Drive/other repo)?

## 2026-07-13 · Evening update (same session)
- Item 6 RESOLVED: repo live at github.com/AbhilashKairali/kairali-web-factory (private); Vercel project `kairali-web-factory-kairali-ai` deployed from sites/kairali.ai → https://kairali-web-factory-kairali-ai.vercel.app (chain proven per START_HERE Step 4 intent).
- NEW: GitHub org creation via automated browser was refused by GitHub ("You can't perform that action at this time") — Abilash creates the org manually at github.com/account/organizations/new?plan=free, then the repo gets transferred (Vercel's GitHub app will need org access re-granted after transfer).

## 2026-07-13 · M2 master-setup session (post-crash)
9. **Branch protection needs GitHub Pro or a public repo** (API returned 403 on this private free-plan repo). Options: (a) upgrade to Pro (~$4/mo, E5 payment — your call), (b) make repo public (not advised — client work), (c) rely on hooks + CI only for now. Dependabot alerts + security updates ARE enabled. Which option?
10. **E4 — first-tenant repo name.** gh repo list shows candidates: portfolio-website (likely abhilashkr.com), kairali-guru-website, voyagent, voyagent-pulse, voyagent-prototype, ayurvedic-treatment-packages. Confirm which is the abhilashkr.com personal site to import into sites/abhilashkr.
11. **pmset sudo batch (E1)** — run in Terminal when convenient:
    `sudo pmset -c sleep 0 disksleep 0 displaysleep 15; sudo pmset -a autorestart 1; pmset -g`
    `autorestart 1` = auto power-on after outage — the single best crash mitigation until the UPS arrives. Interim: caffeinate process runs while the machine is up.
12. **OAuth-gated MCPs pending an interactive session** (run /mcp in the repo to authenticate): Vercel, GitHub, Cloudflare. Sentry org + Clarity token + Semrush/Composio deferred (E2) — say when.
13. **Vercel deploy block RESOLVED**: commit author now uses the GitHub no-reply address. If you'd rather commits show director@kairali.com, verify that address on GitHub (Settings → Emails) and I'll switch git config.
