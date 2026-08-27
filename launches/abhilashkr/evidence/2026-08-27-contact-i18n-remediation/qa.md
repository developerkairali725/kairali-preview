# Abhilashkr contact and localized-image remediation — local QA

Collected: 2026-08-27 17:34:00 IST  
Task: WOPS-ABHILASHKR-CONTACT-I18N-REMEDIATION-001  
Builder session: `codex-2026-08-27-abhilash-contact-i18n`

## Passing checks

- `git diff --check` — PASS.
- `pnpm --dir sites/abhilashkr lint` — PASS.
- `pnpm --dir sites/abhilashkr build` — PASS; 42 static/dynamic routes generated successfully.
- `node packages/ui/bin/brand-lint.js --help` — the command executed the repository brand lint: PASS, 0 errors and 0 warnings; Abhilash is recorded as a personal-surface token exemption.
- `node packages/compliance/bin/lint.js --help` — the command executed the repository compliance lint: PASS, 0 errors. Its 23 warnings are pre-existing findings in other sites/files and none is in the Abhilash diff.
- Isolated focused run on port 4397: `CI=1 PORT=4397 SITE=sites/abhilashkr pnpm exec playwright test tests/factory/abhilash-contact-i18n.spec.ts` — 8/8 PASS across mobile 375 and desktop 1280.
- Broader Abhilash run on port 4399 — the 8 focused remediation tests and all 6 privacy-minimal analytics tests passed across both breakpoints. This verifies that the contact wording/link change did not alter consent or analytics behavior.
- Browser visual QA at desktop and 375px mobile — DE home rendered 2/2 images, FR work rendered 7/7 images, every image had a positive natural width, no horizontal overflow or framework error overlay was present, and the contact view showed the linked ledger plus the email-draft disclosure.
- Source closure check — no plain-string `LedgerRow` remains for Primary Email, Phone (IVR), or LinkedIn in the English contact page; no `Send Message` or `Draft Prepared` copy remains in that contact route.
- React quality review — static media remains in Server Components, the only client state is form interaction state, no fetch/effect/waterfall was introduced, static objects are module-scoped, `next/image` carries `fill` + `sizes`, and controls have labels, focus rings, and 44px minimum height.

## Harness observations kept separate from this change

- The first focused run used the suite's default port 4310 with `reuseExistingServer`; a stale unrelated service already occupied it, so all requests hit the wrong app and returned 404. The run was rejected as invalid evidence and repeated with `CI=1` on the unique port 4397, where all 8 tests passed.
- The broader generic factory suite finished 28 passed, 10 skipped, 4 failed. The four failures are two pre-existing conditions repeated across both viewports: its raw-string hreflang assertion searches for lowercase `hreflang=` while Next.js renders valid React `hrefLang=` markup, and the existing English home meta description is 157 characters against the generic suite's 155-character preference. Neither surface was changed by this task. They remain findings; they are not presented as passes and are not silently edited into this contact/image PR.

## Release boundary

Local candidate QA is complete. The branch may proceed to protected Preview and PR CI. Production publish/merge remains outside this agent session and requires the recorded human preview/release action.
