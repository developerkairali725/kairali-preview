# Deepu QA handoff — Abhilash 77-gate pilot

**Task:** `WOPS-ABHILASHKR-LAUNCH-001`  
**Target:** protected Vercel preview
`https://kairali-web-factory-abhilashkr-b0xj4l7oi-kairali.vercel.app`
(`dpl_CSUCMWcPCSi6m4srfeheBAZQno2t`), never edit live DNS. Sign into Vercel team
`kairali` when prompted.  
**Supporting evidence:** `gate-status-2026-08-11.md`, `sitewide-checklist.md`,
`pagewise-checklist.md`, `design-qa-report.md`, `seo-aeo-geo-report.md`.

## Batch A — public experience (1–25)

1. Open EN home at desktop and phone widths; confirm the Night Ledger design is
   intact and no horizontal scrolling appears.
2. Repeat on `/de` and `/fr`; verify accents render and text is not clipped.
3. On each home, use EN/DE/FR and confirm it stays on the equivalent page.
4. Repeat language switching on About, Work, Investing, Writing, Media,
   Recognition, Speaking, Contact, FAQ, Now and Privacy.
5. Confirm the mobile AKR header shows locale, theme and menu controls.
6. Open and close the mobile menu using touch and keyboard.
7. Tab through header and primary links; confirm visible focus.
8. Switch theme on EN/DE/FR and reload once.
9. Confirm all visible content images load and make sense with images disabled.
10. Confirm the sole public essay opens from `/writing`.
11. Confirm the public essay title, description and publication information are
    truthful and “Reviewer” reads “Not listed” when no reviewer exists.
12. Confirm the four protected draft URLs in `pagewise-checklist.md` return 404.
13. Confirm `/writing/does-not-exist` returns 404.
14. Open English contact, enter test-only values and press Send; confirm the
    device's email composer opens addressed to `info@kairali.com`.
15. Do not send the test email unless the owner asks for a live lead.
16. Open German and French contact; confirm the direct email route is clear.
17. Check FAQ expand/read behavior in all languages.
18. Check LinkedIn opens the verified profile in a new tab.
19. Check all Media links and record any third-party 4xx separately.
20. Check Recognition and Speaking facts against the visible source material;
    do not strengthen or rewrite claims during QA.
21. Confirm there is no chatbot, checkout, price, ad pop-up or false form-success
    message.
22. Confirm no analytics banner appears on the preview while the measurement ID
    is absent.
23. View source on EN/DE/FR and confirm `html lang` matches.
24. Share-preview `/api/og` and confirm the 1200×630 card is legible.
25. Add device/browser, time, route, screenshot and reproduction steps for every
    finding.

## Batch B — release and evidence (26–50)

26. Read the PR diff; confirm only Abhilash source/evidence and the required
    repo log/learning entries are in scope.
27. Confirm lint and build checks are green on the current commit.
28. Confirm factory matrix, compliance, brand, banned-string and CTA-label jobs
    are green.
29. Confirm full-history secret scan is green.
30. Confirm dependency audit is green.
31. Confirm automated security review has no unresolved high/critical finding.
32. Confirm Lighthouse budgets on `/`, public essay, `/de`, `/fr`.
33. Confirm the factory locale reciprocity test passes against the deployed
    preview/production target, not stale production.
34. Confirm 37 sitemap entries and correct locale alternates.
35. Confirm `robots.txt`, `sitemap.xml`, `llms.txt`, RSS and manifest are 200.
36. Confirm icon assets are 32, 180 and 512px.
37. Confirm all 37 sitemap URLs have one H1, canonical, metadata and schema.
38. Confirm all 40 internal targets return 200.
39. Confirm no four-draft slug appears in sitemap, feed or command menu.
40. Confirm the old production deployment ID in `rollback.md` still reads Ready.
41. Confirm preview deployment `dpl_CSUCMWcPCSi6m4srfeheBAZQno2t` belongs to project
    `kairali-web-factory-abhilashkr` and team `kairali`.
42. Confirm `abhilashkr.com` and `www.abhilashkr.com` still point only to the
    protected production deployment until merge.
43. Confirm no DNS mutation is included.
44. Confirm no GA4/GTM/pixel ID is included.
45. Confirm no CRM endpoint or data-storage backend is included.
46. Confirm no paid-service/API output is claimed without attached evidence.
47. Read `gate-status-2026-08-11.md`; challenge every PASS lacking named evidence.
48. Mark gate 43 `human-audit-round` only after your checks are complete and add
    your name, timestamp and finding count.
49. Do not mark owner preview approval for the owner.
50. Do not merge around a red or missing required check.

## Batch C — after production (51–77)

51. Verify the deployed commit/PR matches the approved preview.
52. Verify apex 200 and `www` canonical redirect/alias behavior.
53. Re-run EN/DE/FR home and language switching on production.
54. Re-run all four draft 404 checks on production.
55. Re-run sitemap count and locale alternates on production.
56. Re-run OG card, icons and manifest on production.
57. Re-submit the existing `https://abhilashkr.com/sitemap.xml` in Search
    Console once.
58. Do not create a duplicate Search Console property.
59. Record Bing Webmaster as pending unless it is actually verified.
60. Record GA4 as blocked until the owner accepts Google's terms.
61. Do not add GTM or pixels while GA4/privacy approval is blocked.
62. Do not create a Google Business Profile without eligibility facts.
63. Confirm Vercel production status and runtime logs are quiet.
64. Record Day-1 GSC coverage/indexing observation; do not call propagation
    complete immediately.
65. Record Day-7 coverage/CWV/query/broken-link observation when due.
66. Keep the immutable prior deployment available for rollback.
67. If rollback is needed, owner/admin executes the exact command in
    `rollback.md`; record the result.
68. Keep external design and cross-model audits pending unless actually run.
69. Keep axe-core pending unless an axe report exists.
70. Keep ZAP pending unless a real scan exists.
71. Catalog audit — registry N/A for organic sites.
72. Shopify theme check — registry N/A.
73. Payment gateways — registry N/A.
74. Store settings drift — registry N/A.
75. `myshopify` noindex — registry N/A.
76. Landing-page noindex/single CTA — registry N/A.
77. Landing-page ad message-match — registry N/A.

## Sign-off row

`Deepu · timestamp: __________ · device/browser: __________ · findings: ____ · verdict: PASS / FAIL · notes/evidence paths: ____________________`
