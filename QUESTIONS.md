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

## 2026-07-13 16:55:59 IST · Org + Vercel resolution
- Org kairali-digital created by Abilash (16:36:11 IST). Repo transferred in, then BACK to AbhilashKairali: Vercel Hobby cannot deploy private org-owned repos (paywall discovered 16:49 IST). Pipeline reconnected and verified green (deploy of dfd7887 completed, 16:55 IST).
- **DECISION PENDING (Abilash): Vercel Pro (~$20/user/mo).** Needed to (a) host the repo under the org and (b) be properly licensed — Hobby is non-commercial and this is a revenue fleet. When purchased: transfer repo to org + reconnect (5 min, documented here). Branch protection (Q9) also becomes worth revisiting then via GitHub Pro/Team.

## 2026-07-13 17:18:44 IST · First tenant + lint scope
- Q10 RESOLVED by Abilash: portfolio-website = abhilashkr.com. Imported to sites/abhilashkr (original repo untouched); builds green in turbo (2/2 tasks).
- SCOPE DECISION (ratify or veto, Abilash): entity "personal" is now EXEMPT from the Kairali banned-filler rule only — your portfolio's "Curated Speeches" isn't Kairali brand copy. Cure-claims + locked-facts checks still apply to it. Also: dot-directories (.agents etc.) excluded from lint scans, and the old repo's agent docs moved to docs/tenants/.

## 2026-07-13 17:53:12 IST · Wave 1 kickoff rulings (from Abilash)
- Personal-site exemption VETOED — banned filler applies to all sites incl. abhilashkr.com; copy fixed ("Curated" → "Selected").
- Language locks are ALL-LOCALE: every locale a site targets needs its own native-reviewed banned list before that locale ships (rules.js updated). Applies beyond DE/FR: AR, RU, CS, etc.
- KTAHV inputs exist OUTSIDE this repo: Abilash has the competitor comp set and extensive target-audience work (MOA Matrix v3.0, European Buyer Journey, competitor dossiers — PROJECT_CONTEXT §7) from previous Claude chats. ACTION (Abilash): export/drop these into the repo (suggest: docs/ktahv-inputs/ — any format) or share the Drive folder BEFORE any KTAHV or KTAHV-related work begins. Agent rule: no KTAHV surface gets built without ingesting these first.

## 2026-07-13 18:19:34 IST · Brand-manual ingest (Kairali rev. 2 + Villa Raag 2026) — values the PDFs do NOT give
Both 2026 manuals ingested from Drive (text layers: docs/brand/). All eight Kairali hexes in brand-tokens.css verified against rev. 2 — but the PDFs defer the 10-step ramps to "the design-system library", so these token TODOs remain and need the library export (or the exact hexes) from you/the design team:
14. **Kairali ramp steps + ink** — exact hexes for: **ink** (manual only gives "15.6:1 on ivory"), **forest-800** (named for dark surfaces, ch.08), **leaf-700** (body-capable leaf, ch.10), **bronze-600** (body-capable bronze, ch.10), **marigold-300** (descriptors/accents on dark, ch.08). None are printed in rev. 2.
15. **Villa Raag ramps** — Raag manual ch.04 says "digital ramps follow the group's ten-step method in the shared design system" but prints only the four anchors + Gold 600 (#8F6D49) + the gradient ends. Need the blush/tan/gold/forest ramp hexes (raag-tokens.css hover-deepen states depend on the forest ramp). Raag "ink" wordmark colourway shares the group's missing ink hex (Q14).
16. **Villa Raag web type scale** — ch.05 gives the hierarchy in print points only (overline Vonca 9–11 · body Miller 10–12 pt, leading 1.6 · caption 8–9 pt) and "tracked wide" without a tracking value. Confirm the px scale + letterspacing for villaraag.com, or confirm we derive from the group's component library when it ships.
17. **Logo/wordmark/emblem asset files** — neither manual ships vector assets, and both forbid recreating the marks. Need: Kairali lockups (full/wordmark/icon, light+dark) and Villa Raag wordmark (ink/gold/white, ± descriptor) + emblem + roundels as SVG. Where do these live in Drive?

## 2026-07-13 18:43:16 IST · Forms v1 verified
- packages/forms BUILT + LIVE-TESTED against Satyam's test webhook (success, rows 2-4 in test sheet). Ask Satyam: (a) PRODUCTION webhook URL when ready, (b) should payload carry an explicit consent field (DPDP evidence), (c) he can delete the 3 test rows.

## 2026-07-13 19:22:05 IST · Drive corpus sweep — two source docs missing
Corpus sweep landed 28 docs in docs/ktahv-inputs/ (incl. all 20 competitor dossiers). Two referenced sources could NOT be found in Drive and gate full fidelity of the MOA/KTAHV work:
- **European Buyer Journey (the 8-stage DACH/FR document, PROJECT_CONTEXT §7).** Only its condensed cohorts (DA1–DA3, FR1–FR3) and moments (M1 "90-second first impression" = Stage 4; M2 "pre-booking physician video consult" = Stage 5) survive inside Harmony_Content_Brief_Pack; KTAHV_B2B_Landscape cross-references it by name. Abilash: where does the full doc live (chat export? xlsx? another account)?
- **KTAHV_MOA_Matrix_v3_0.xlsx** — the workbook the MOA Review Handover names as must-attach (9 sheets, classifier code in Sheet 3, baseline in Sheet 7, open questions in Sheet 9). Only the handover DOC is in Drive. Abilash: export/drop the xlsx into Drive or docs/ktahv-inputs/.
Also reconfirmed: folders "KTAHV New Shoot 2025 HO centre" (1LlD59bSNYYcgddcVkYG5oPVFLtnA1xxk) and "Villa Raag- Images" (1WTBf-LIiA3YPnFYb5NWNeIm6l9WKf0_R) show metadata but list zero children to director@kairali.com — the sharing fix is still pending (matches the media-catalog pass).

## 2026-07-13 19:23:46 IST · Media catalog + guides follow-ups
- Two Drive folders show their name but their CONTENTS aren't shared with director@kairali.com: "KTAHV New Shoot 2025 HO centre" (owner mkt@ktahv.com) and "Villa Raag- Images" (owner ho.mkt@kairaliproducts.com). Ask both owners to share folder contents — these hold the photos for placeholder swaps.
- "Link secrets" resolved: it's "Healing Secrets of Kairali" — ingested (2 Jul version) with the Nakshatra guide + villa spec.
- Two data conflicts inside the Nakshatra materials need Abilash's ruling: (a) villa 212 — Classic (guide) vs Royal (inventory)? (b) Maharaja Suite names for 1001/1002 are swapped between the guide and the website archive — which is correct?

## 2026-07-13 19:38:12 IST · theblushlounge.com mining (D6) — outage + facts to confirm
- **theblushlounge.com origin is DOWN**: DNS resolves (A 64.227.129.189, DigitalOcean; www→apex) but ports 80/443/22 all filtered — live mine timed out; content mined from Wayback instead (latest homepage capture 2025-11-24, so it died within the last ~8 months). Abilash: revive the old droplet/hosting, or accept downtime until the Factory rebuild ships? (The snehachowdhary.com 301 flip is gated on the new site being LIVE either way — D1 rule 8.)
- **WhatsApp number conflict on the old site**: api.whatsapp links carry BOTH +91 88269 21110 (matches the contact-page phone) and +91 88260 21114. Which is Sneha's real number for the rebuild's chat-first CTA? (Priya's interim number is Kairali-only — wrong for a personal brand.)
- **Blush Lounge brand assets**: only a low-res logo.png + Allura/Montserrat type mined. Does Blush Lounge get its own token file (like raag-tokens.css) and is there any brand material / does Sneha have Instagram (@blushlounge_sneha) originals for portfolio imagery? Old gallery is 2018-era low-res.
- **Wave placement**: personal site isn't on the Wave map — when should sites/theblushlounge.com be built?

## 2026-07-13 19:44:30 IST · kairali.guru baseline evaluation — rulings needed
- **student-hub**: Eeshal's repo has a fake client-side login (hardcoded email+password committed to her PUBLIC repo). Drop the page for launch, or is a real student portal (auth, noindex) wanted in Wave 2/3?
- **Course prices**: her repo hardcodes prices (e.g. OAP ₹15,500 / $260 Kerala, ₹9,000 / $150 Delhi-Mumbai) that do NOT appear on the live site. Who confirms current programme pricing before the rebuild ships? (Rule 6: verify or leave empty + flag.)
- **Supabase**: her enquiry form writes to a Supabase project from the client. Plan is to replace with packages/forms → Satyam webhook; does anything in that Supabase table need exporting first?
- **Register-table correction**: SITE_DESIGN_LOCALE_REGISTER.md says kairali.guru live = EN/DE/FR/AR/RU, but the live site is EN-only (no hreflang, /de/ 404s) — the 5 locales exist only in Eeshal's repo. Amend the table via DECISIONS at next edit.
