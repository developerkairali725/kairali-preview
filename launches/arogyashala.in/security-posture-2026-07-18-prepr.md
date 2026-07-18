# SECURITY-AUDITOR — PRE-PR PASS · PROMPT 4 single-pager pilot (arogyashala.in)

*Filed by the PROMPT 4 pilot session (docs/reports/2026-07-18-prompt4-single-pager-pilot.md §4); subagent ran 16:13:14–16:17:03 IST, 18 Jul 2026; verbatim report below. Subagent telemetry (machine-reported): 99,045 tokens · 36 tool uses · 296s.*

**Run: 2026-07-18 16:13:14 → 16:17:03 IST · gate ids: security-posture-audit + injection-screening (both `blocker`/`required` for organic) · CLAUDE.md rule (s) · branch `feature/prompt4-single-pager-pilot` @ f17903c · merge-base 049db17 · origin/main @ 22ed292**
**Mode: REPORT ONLY — zero files written by the subagent, zero commits, zero third-party network calls.**

## N/A sections (with reasons)
- **Shopify-track security checks: N/A this pass** — no store surface touched; PR is docs/report/packets-only for an organic Factory/Vercel site.
- **Live-ops checklist items (MFA on panels, backups, WAF, malware scans, admin logging, incident plan): N/A-this-pass / UNVERIFIED** — live-operations checks belonging to the monthly access-review lane, not repo-verifiable in a report-only pre-PR pass. Listed as unverified per HARD GATE 6, not claimed.

## 1. Pilot site posture — sites/arogyashala.in/

| Check | Category | Command/evidence | Status | Fix needed |
|---|---|---|---|---|
| Secrets in source/config | Website | `grep -rniE "(token\|secret\|password\|api[_-]?key\|Bearer \|AKIA[0-9A-Z]{16}\|sk-…\|ghp_…\|-----BEGIN)"` over site source (excl. .next/node_modules/.turbo) | **PASS** — only hits are `brand-tokens.css` design terminology (layout.tsx:7, page.tsx:85, globals.css:3) | none |
| `process.env` / server actions | Website | `grep -rn "use server\|process\.env"` app/ + next.config.ts + site.config.json → zero hits | **PASS** — fully static, no env consumption | none |
| dangerouslySetInnerHTML | Website | One occurrence: `app/page.tsx:162` — `serializeJsonLd(jsonLd)`. Traced: `packages/schema/src/index.js:32-34` escapes `<` → `<`; graph built solely from build-time constants. No external/user input in the chain | **PASS** | none |
| External links rel/target | Website | `grep -rn 'target="_blank"'` → zero; external anchors all same-tab | **PASS** — no reverse-tabnabbing surface | none |
| next.config.ts headers/config | Website | Read in full: `transpilePackages` + 14 legacy-path 301s only. No `headers()` block; no vercel.json, no middleware.ts anywhere in sites/ — same across the whole fleet | **ADVISORY** (pre-existing, fleet-wide, not this PR) | Backlog: fleet decision on security headers (X-Content-Type-Options, Referrer-Policy, CSP) — Vercel platform defaults only today. Low severity for a static no-input site |
| Consent/privacy surfaces | Website | layout.tsx:32–37: `ConsentScripts` before `Analytics` (verified `packages/consent/src/core.js:29`: all consent keys default **denied** except security_storage), `ConsentBanner privacyHref="/privacy"`; 3 legal pages exist | **PASS** — Consent Mode v2 default-denied, Ship Gate A12 pattern | none |
| Locked facts | Website | `EMAIL = info@kairali.com`, `wa.me/919289838797` — matches locked +91 92898 38797; no …38777 anywhere | **PASS** | none |

## 2. Repo hygiene — this PR's diff-to-be

- **Branch diff at audit time (merge-base 049db17..f17903c):** exactly the 4 audit packets. The report + STATUS.yaml edits land after this pass — same markdown/YAML content classes; sweep them at PR-final.
- **Credential sweep of the branch's added lines:** zero hits (password/Bearer/AKIA/sk-/ghp_/xox/BEGIN-KEY/JWT patterns).
- **Contacts added:** org-domain work emails only + the locked WhatsApp number. No personal PII, no credentials.
- **Existing launches/arogyashala.in/ + PROMPT 2 report sweep:** high-signal patterns → zero hits; long-base64 sweep → 1 false positive (slash-joined banned-word list, seo-aeo-geo-report.md:37).
- **Ignore hygiene:** `.next/`, `node_modules/`, `.turbo/`, `.env*` all git-ignored (verified `git check-ignore -v`); no .env files exist in the worktree.
- **Note:** branch is behind origin/main by #121 (22ed292, email-capture log commit — BACKLOG/DIRECTIVES/wiki only). No conflict surface with this PR.

## 3. Preview URL exposure — 4 human auditors

- **Route surface (repo-verified):** exactly one route handler — `app/llms.txt/route.ts` (`force-static`, locked public facts only) — plus metadata routes robots.ts/sitemap.ts/icon. No app/api, no middleware, no server actions, no process.env. Nothing non-public can leak; the preview is a static render of audited source.
- Packets link only to the preview URL + arogyashala.in — no third-party links.
- **UNVERIFIED (needs live fetches, not performed by this subagent):** Vercel deployment-protection state, preview noindex header, live HSTS. *(Parent-session note: the parallel seo-aeo-geo audit DID fetch live headers same hour — HSTS present; no X-Robots-Tag on preview, canonical-to-production is the mitigation.)*

## 4. Injection screening (rule r)

- **Session fetch surface:** own Vercel preview + github.com CI status only — first-party/trusted operational origins, not third-party scraped content. **No rule-r screening required; verdict: CLEAN, no quarantine.**
- The four packets (the only content this PR ships beyond the report) were read in full — instructions addressed to human auditors, no instruction-like patterns aimed at agents.
- **MCP scope note:** no repo-scoped MCP config exists (no .mcp.json; .claude/settings.json holds only permissions+hooks).

## Unverified list (HARD GATE 6)
Live preview deployment-protection · live-ops checklist items (monthly lane) · Vercel project member/access list · the post-audit report/STATUS.yaml additions (sweep at PR-final).

## VERDICT
**PASS** — pre-PR gate for `feature/prompt4-single-pager-pilot` (security-posture-audit + injection-screening). Zero blockers, zero secrets, zero injection findings. One advisory carried to backlog (fleet-wide absence of explicit security-headers config — pre-existing, not introduced or touched by this docs-only PR).
