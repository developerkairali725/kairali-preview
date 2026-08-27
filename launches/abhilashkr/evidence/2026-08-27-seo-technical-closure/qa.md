# Abhilashkr technical SEO and security closure — local QA

Collected: 2026-08-27 20:39:11 IST

Task: WOPS-ABHILASHKR-SEO-TECHNICAL-CLOSURE-001
Builder session: `codex-2026-08-27-abhilash-seo-technical-closure`

## Passing checks

- `git diff --check` — PASS.
- `pnpm --dir sites/abhilashkr lint` — PASS.
- `pnpm --dir sites/abhilashkr build` — PASS; the production build compiled, typechecked, and generated all 42 static/dynamic routes.
- Focused release run on port 4498: `CI=1 PORT=4498 SITE=sites/abhilashkr pnpm exec playwright test tests/factory/abhilash-seo-security.spec.ts tests/factory/abhilash-contact-i18n.spec.ts tests/factory/abhilash-analytics-consent.spec.ts` — 18/18 PASS across mobile 375 and desktop 1280.
- The new SEO/security crawl parsed the sitemap and verified exactly 37 public routes: every route returned 200, exposed the correct language, one `main`, one `h1`, alt text on every image, sequential heading levels, no horizontal overflow, stable Person/WebSite/Organization IDs, and a URL-exact page node. Every non-home route also exposed a localized visible breadcrumb with a 44px minimum touch target and a linked, 1-based `BreadcrumbList` ending at the exact canonical URL.
- Browser policy coverage verified that the CSP and complementary headers are present and cause no CSP console or page errors on representative English, German, and French pages. Existing contact behavior and consent-gated analytics remained green in the same run.
- Generic factory browser suite — 18 passed, 10 documented skips, 0 failed across mobile and desktop. Its hreflang harness now parses React's valid `hrefLang` serialization case-insensitively instead of falsely rejecting it.
- Local Lighthouse release sample — `/` 97 performance / 100 accessibility / 100 SEO; the English article 91/100/100; `/de` 98/100/100; `/fr` 99/100/100. All four URLs passed the configured budgets.
- `pnpm test` — PASS; all 13 discovered workspace test tasks completed successfully.
- `pnpm audit --prod --audit-level high` — PASS; no known production dependency vulnerabilities.
- Scoped secret scan of the complete current diff through the repository gitleaks configuration — PASS; no secrets detected.
- Repository compliance lint — PASS with 0 errors. Its 23 warnings are pre-existing findings outside the Abhilash diff.
- Repository brand lint — PASS with 0 errors and 0 warnings.
- Footer-social and factory-matrix lints — PASS with the existing documented Abhilash personal-site exemptions.
- Directive uniqueness check — PASS; 131 live directive rows are unique.
- React/Next quality review — schema and breadcrumb rendering remain Server Component work; static graph values are module-scoped; no client fetch, effect, or async waterfall was added; JSON-LD serialisation escapes `<`; no new client bundle was introduced.

## Honest limitations and unrelated observations

- The whole-tree gitleaks scan reports 14 historical/pre-existing fingerprints elsewhere in the repository. This release claims only the scoped diff pass and does not relabel those repository findings.
- The standalone `node --test scripts/test/*.test.js` CLI-e2e invocation is not valid evidence from this mounted workspace path because several pre-existing test launchers compare an unescaped `file://` URL with a path containing spaces; representative change-gate and class-map CLI cases fail before exercising this site diff. The package test suite passes, the relevant commands were exercised directly, and GitHub CI runs in a conventional space-free checkout.
- `axe-core`, OWASP ZAP, and Docker are not installed in this controlled workspace. The release therefore claims deterministic semantic browser checks plus Lighthouse accessibility 100 on the sampled routes, not a full manual WCAG certification or ZAP penetration assessment. No package or tool was installed to conceal that boundary.
- Legal-policy adequacy still requires qualified human/legal review. Technical publication does not certify legal compliance.
- GTmetrix remains account/quota-gated in the browser. PageSpeed and local Lighthouse results are recorded without substituting them for GTmetrix.

## Release boundary

The local candidate gates are complete. The candidate may proceed to a protected Vercel Preview and GitHub PR. The agent will not self-merge or use an owner-only branch-protection bypass; production promotion must use the exact reviewed artifact after the required human merge.
