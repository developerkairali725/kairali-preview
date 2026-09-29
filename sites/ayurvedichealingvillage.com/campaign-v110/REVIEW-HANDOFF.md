# AHV integrated design review — 29 September 2026

Project: KTAHV / AHV website. Workspace: 10x WordPress and Websites.
Task: WOPS-AHV-FINAL-DRAFT-20260924-001. Vikash: MID-16763 / SF-23-DID-16763.

## Source and return workflow

Use kairali-digital/kairali-web-factory, branch codex/ahv-english-staging-20260915 (PR309). Fetch this baseline and create your own review branch. Do not replace this integrated project with the standalone ahv-lp project. Node >=22 and pnpm 11.13.1; from repository root run `pnpm install --frozen-lockfile`, then `AHV_STAGING=1 pnpm --filter ayurvedichealingvillage.com dev -- --port 4472`. No production credentials are required for layout work. Use the existing forms; actual backend receipt remains Deepu's verification.

Primary site source: sites/ayurvedichealingvillage.com. Supplier pages: campaign-v110/pages; shared supplier components: campaign-v110/components. Native layouts and styles: app/(english)/_families and public/design. Do not edit generated .next output. Preserve approved content, rates, offer rules, metadata, forms, consent, Priya/WhatsApp and the shared footer.

Return a scoped PR to this integration branch, or a git diff/ZIP containing only changed source/assets, with baseline commit, route list, desktop/mobile before-and-after screenshots, test results and remaining issues. No node_modules, .next, .vercel, .env or credentials. Never push main, deploy production, change DNS/Ads or merge Deepu's unreviewed work. Cody integrates the reviewed changes.

## Review order and acceptance

1. Main pages first: homepage, treatment listing and treatment details, villas, yoga/training, tariff/document paths, enquiry/contact. Improve visible readability, spacing, responsive hierarchy, obvious navigation and CTA clarity before decorative changes.
2. Virtual tour and careers: verify improved alignment and tour button contrast. All page families should keep readable cream footer languages and the shared footer.
3. Campaign pages: compare against the approved baseline and retain the stronger design. Air India explicitly keeps our prior design and member-specific form; supplier proposal remains available in campaign-v110/pages but is not active. Do not overwrite it without a demonstrably better reviewed proposal.
4. Lower-priority visual polish after main pages. Include 390px and 1440px checks, keyboard focus, no horizontal overflow, working internal links, and contact/consent controls clear of CTAs. Use the existing enquiry component, never a second backend or WhatsApp-only fake success.

This is a staging review candidate, not production acceptance. routes.json is the full28 supplier inventory; retained-original-routes.json records explicit design selections. offers/new retains its existing redirect. Detailed content-delta acceptance and actual lead receipts remain separate outstanding checks. Existing deadline2October2026 retained; report first main-page batch ETA now and any source/staging access blocker in the original email thread.
