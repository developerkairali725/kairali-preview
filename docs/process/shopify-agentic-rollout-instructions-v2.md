# Shopify Agentic Cleanup Rollout Instructions

This document is a single operating note for the developer and Astha. It covers the setup required to use Claude Code with the Shopify AI Toolkit, a staging-first workflow with GitHub, backup and rollback expectations, batch-based approvals, and the exact order in which the current Kairali issues should be tackled. Shopify officially supports the AI Toolkit for Claude Code and documents Node.js 18+ and supported AI tooling as prerequisites.[cite:1] Shopify also supports connecting Shopify themes to GitHub repositories and branches so theme work can be versioned and reviewed.[cite:46] Current community and merchant-facing feedback in 2026 also supports this workflow for advanced users when used with staging, Git, and human approval.[cite:5][cite:24][cite:27][cite:67]

## Objective

The objective is to solve the current Kairali Shopify issues quickly, but only through a controlled workflow: local development, staging theme testing, GitHub versioning, backup before changes, review in small batches, approval from Astha, and then publish. Community and tutorial workflows for Shopify theme development with Claude Code consistently show preview-first and branch-based development rather than uncontrolled live-theme editing.[cite:30][cite:33][cite:41]

The current issue set already falls into clear workstreams: compliance-sensitive disease-page content and disclaimer problems, large-scale catalog text and metafield cleanup, mobile and theme conversion issues, and structural theme/data hygiene issues such as duplicate metafields and custom code inside vendor theme files.[cite:16][cite:17][cite:18]

## Learning links and videos to review first

The developer should review these before starting work so the setup and workflow are clear:

- Shopify AI Toolkit official docs: https://shopify.dev/docs/apps/build/ai-toolkit [cite:1]
- Shopify AI Toolkit GitHub repository: https://github.com/Shopify/Shopify-AI-Toolkit [cite:3]
- Shopify GitHub integration for themes: https://shopify.dev/docs/storefronts/themes/tools/github [cite:46]
- GitHub guide to creating a pull request: https://docs.github.com/articles/creating-a-pull-request [cite:48]
- GitHub beginner guide to pull requests: https://github.blog/developer-skills/github/beginners-guide-to-github-creating-a-pull-request/ [cite:52]

Recommended video examples:

- New Shopify AI Toolkit: Claude Code Setup + Demo: https://www.youtube.com/watch?v=ptnWksC9TXY [cite:41]
- [Shopify AI Toolkit Tutorial] - Build Themes & Automate SEO in Shopify: https://www.youtube.com/watch?v=pom070QQgpQ [cite:9]
- Build Shopify Themes in MINUTES - [Claude Code & MCP]: https://www.youtube.com/watch?v=0tEkfZ4vtcs [cite:30]
- How to Build Shopify Themes Faster with Claude Code: https://www.youtube.com/watch?v=rNiw_9OO9ts [cite:33]
- Claude Just Changed Shopify Forever: https://www.youtube.com/watch?v=YatPsQlGM3g [cite:29]
- Shopify GitHub Integration beginner video: https://www.youtube.com/watch?v=kH4ltsaTHgo [cite:59]
- How to create a pull request in 4 min: https://www.youtube.com/watch?v=nCKdihvneS0 [cite:58]

## Why this workflow

Shopify’s AI Toolkit gives Claude Code access to Shopify-aware developer context such as documentation, schemas, and related capabilities, which makes it suitable for theme edits, store operations, and structured cleanup work when used with review gates.[cite:1][cite:11] Tutorials and community discussions around Claude Code and Shopify also show that people are using it for theme editing, SEO work, and store optimization with local preview and controlled deployment.[cite:29][cite:30][cite:33][cite:37]

This project should not be done as one large live edit. The correct model is:

- Backup first.
- Work locally.
- Use GitHub branches.
- Sync to a staging or unpublished theme.
- Review changes in approval batches.
- Publish only after approval.
- Keep rollback available at both the theme and code level.[cite:34][cite:46]

## Validation for power users in July 2026

This workflow is valid for power users in July 2026. Merchant-facing guides and forum discussions describe Claude Code plus Shopify AI Toolkit as a practical stack for technically strong merchants and developers doing theme work, store optimization, app scaffolding, and structured content operations, as long as the workflow includes staging, Git, and human review.[cite:5][cite:22][cite:24][cite:27][cite:63][cite:67] Reddit and forum commentary also shows that advanced users see this stack as a force multiplier rather than a replacement for good development discipline.[cite:27][cite:66][cite:68][cite:69]

## Day 0 setup

### 1. Install prerequisites

Install Node.js 18 or higher because Shopify’s official AI Toolkit documentation lists Node.js 18+ as a requirement.[cite:1]

Install Shopify CLI because tutorials for the Shopify AI Toolkit workflow use Shopify CLI for local theme operations, preview, and push.[cite:9][cite:33][cite:60]

Install Claude Code and update it to the latest version before installing the Shopify plugin, because setup guidance and forum troubleshooting indicate the plugin flow should be done in Claude Code with the correct version and marketplace/plugin configuration.[cite:6][cite:41][cite:42]

### 2. Install Shopify AI Toolkit for Claude Code

Use the official Shopify AI Toolkit install flow for Claude Code. Shopify documents the toolkit on Shopify.dev, and the Shopify GitHub repository provides the Claude plugin installation path.[cite:1][cite:3][cite:15]

After installation, authenticate access to the correct Shopify store and confirm the environment can reach the store and theme context. Setup demos show this as part of the initial workflow validation.[cite:41]

### 3. Pull the theme locally

Pull the current theme(s) locally using Shopify CLI. The local theme files become the working copy that Claude Code will inspect and modify with Shopify-aware context.[cite:33][cite:57][cite:60]

For this project, local copies should be created for the Wonder theme on the `.in` storefront and the Prestige theme on the `.com` storefront, because the technical audit identifies issues across both stores and specifically calls out Wonder-theme problems on the `.in` storefront.[cite:18]

### 4. Create theme backups before edits

Duplicate the current live theme in Shopify before any edits are made. Backup-oriented Shopify tooling and backup workflows are important because theme rollback should not depend on code history alone.[cite:34]

Also export products and relevant metafields before bulk catalog changes. A Shopify community workflow around data operations describes export-edit-import loops as a practical safety layer for large-scale changes.[cite:19]

### 5. Set up GitHub for version control

GitHub is required here because every theme change should be tracked, reviewable, and reversible. Shopify officially supports theme connections to GitHub repositories and branches through the Shopify GitHub app.[cite:46]

If GitHub is new to the developer, the basic terms for this project are:

- A **repository** is the main folder that stores the theme code and history.[cite:46]
- A **branch** is a separate lane of work so one set of changes does not interfere with another until approved.[cite:48][cite:52]
- A **commit** is a checkpoint with a message that records a specific change set.[cite:46]
- A **pull request** is the review step used to merge a branch into another branch after review and approval.[cite:48][cite:52]

### 6. Create the GitHub repository and branches

Create one repository per theme project or one carefully managed repository for the store theme work, then push the pulled theme code to GitHub. Shopify community examples show creating a repository, pushing the theme code, and then connecting the theme branch back to Shopify.[cite:47][cite:51][cite:59]

Use this branch structure:

- `main` = approved stable version only.
- `staging` = testing branch connected to an unpublished Shopify theme.
- `compliance-cleanup`
- `catalog-cleanup`
- `mobile-theme-fixes`
- `performance-assets`
- `policy-sync`

This structure keeps risk separated by workstream and allows faster approvals in batches.[cite:48][cite:52]

### 7. Connect Shopify to GitHub

In Shopify admin, go to Online Store, then Themes, then Add Theme, then Connect from GitHub. Shopify’s GitHub integration guide explains that the store can be connected to a specific repository and branch so theme code can sync with GitHub.[cite:46]

For this project, connect the unpublished or staging theme to the `staging` branch, not `main`, because testing and approval should happen on staging first.[cite:46]

### 8. Confirm GitHub workflow works

Make one safe test change after connecting Shopify to GitHub, then verify the change appears as a commit on the expected branch. Shopify notes that theme and branch connections can be verified from the theme card and branch-linked workflow.[cite:46]

Also create one pull request successfully so the developer becomes comfortable with the review and merge process. GitHub’s own beginner documentation explains that pull requests are the standard review layer for branch-based work.[cite:48][cite:52]

## GitHub quick guide for this exact use case

The minimum GitHub workflow for every task in this project is:

1. Pull the latest code from GitHub.
2. Switch to the correct branch or create a new feature branch.
3. Make changes locally with Claude Code.
4. Preview in local development or on the staging Shopify theme.
5. Commit the changes with a clear message.
6. Push the branch to GitHub.
7. Create a pull request.
8. Get review/approval.
9. Merge into `staging` for testing or into `main` only after approval and release readiness.[cite:48][cite:52]

The basic commands the developer should learn are:

- `git clone <repo-url>` = download the repository locally.
- `git checkout -b branch-name` = create and switch to a branch.
- `git status` = see changed files.
- `git add .` = stage changes.
- `git commit -m "message"` = create a checkpoint.
- `git push origin branch-name` = upload the branch to GitHub.

Shopify community workflows for GitHub-connected themes and staging branches follow this general model.[cite:47][cite:51]

Commit messages should be descriptive, such as:

- `fix mobile header visibility on wonder theme`
- `rewrite disease page sections batch 1`
- `clean 25 product metafields batch 2a`
- `move stock urgency custom code out of vendor file`

## What should be done today after setup

Once the environment is ready, work should begin in three immediate approval batches because the current reports already identify the high-priority problem areas.[cite:16][cite:17][cite:18]

### Batch 1: Compliance and health-claim content review

The compliance report identifies a high-risk content pattern where disease pages are structured as disease name, symptoms, doctors recommendation, named product, and dosage, which the report says should be removed or fully rewritten.[cite:16]

Today’s goal is not to publish final compliance edits immediately. Today’s goal is to identify all risky sections and produce approval-ready rewrite proposals. Use Claude Code to scan relevant pages and produce a structured list including:

- Page or section name.
- Risk type, such as prohibited disease claim, dosage-linked recommendation, cure language, anti-allopathy wording, or misleading phrasing.[cite:16]
- Original problematic snippet.
- Recommended action: remove or replace.
- Proposed neutral educational rewrite using the safer format described in the report.[cite:16]

The report already provides examples of phrases that should be deleted outright and makes clear that disclaimers alone do not neutralize disease-treatment claims.[cite:16]

This batch must be shown to Astha for approval before publishing because it involves compliance-sensitive language.[cite:16]

### Batch 2: Catalog content and metafield cleanup

The listing error file contains repeated patterns across many Shopify fields: encoding artifacts, repeated words, spelling issues, spacing issues, field duplication, and poorly normalized content across title, SEO fields, body HTML, benefits, directions, and metafields.[cite:17]

Start with a manageable product group, such as 20 to 25 SKUs, and prepare a cleanup batch. For each SKU, Claude Code should help produce:

- Corrected text for Title, SEO Title, SEO Description, Short Description, Body HTML, Benefits, Direction, and related metafields where needed.[cite:17]
- Identification of duplicate or overlapping fields that need a canonical source of truth, especially where the technical audit already confirmed duplicate metafield pairs on product pages.[cite:18]
- Preservation of legally neutral phrasing; no new medical or cure claims should be introduced.[cite:16][cite:17]

The batch shown to Astha should contain the product handle, the field, the original snippet, the proposed corrected snippet, and whether the fix is a simple formatting/grammar correction or a compliance-sensitive wording change.[cite:17]

### Batch 3: Staging theme fixes for mobile and conversion issues

The technical audit identifies several high-value storefront issues that affect conversion and should be addressed quickly on a staging theme. These include the mobile header not being visible, sections overlapping on mobile, the sticky Buy Now button being improperly structured on mobile, a duplicated homepage H1, placeholder labels such as “Category Image,” and missing or misleading alt text in several places.[cite:18]

Use Claude Code on the local theme copy and staging theme to inspect the relevant Liquid, CSS, and HTML structures, then implement fixes only on staging. The developer should validate at mobile breakpoints that:

- The header is visible.
- Sections no longer overlap.
- The sticky Buy Now CTA is readable and tappable.
- The homepage H1 appears once and correctly.
- Placeholder labels are replaced with meaningful text.
- Important alt text issues are corrected.[cite:18]

This batch should be shown to Astha with screenshots before and after, along with a list of touched theme sections.[cite:18]

## Fix order after Day 0

After the first three batches begin, continue in this order because it aligns with risk and business impact:

1. Compliance rewrite/removal work for risky disease and medical-claim content.[cite:16]
2. Catalog text and metafield cleanup in grouped batches.[cite:17]
3. Mobile and conversion-critical theme fixes on staging.[cite:18]
4. Theme code hygiene, including moving custom code out of vendor files, reducing hardcoding, and clarifying which metafields are canonical.[cite:18]
5. Performance and asset cleanup, including oversized PNG banners, duplicated markup, and verification of whether the current image-optimization tooling is actually working.[cite:18]
6. Legal-policy consistency work between `.in` and `.com`, including page URL and content alignment where required.[cite:18]

## Batch review format for Astha

Every review batch should be small, clear, and structured so approval is fast. Each batch should include:

- Batch name.
- Exact pages, products, or theme sections affected.
- Before and after snippets or screenshots.
- Risk type: compliance/legal, content/SEO, or theme/UX.
- Whether the batch is already implemented on staging or is still only a proposal.
- Whether it is safe to publish immediately after approval or should be grouped into a later release.[cite:16][cite:17][cite:18]

Example batch naming:

- Batch 1 – Disease page rewrite proposals.
- Batch 2A – Product content cleanup group 1.
- Batch 3 – Mobile header and sticky CTA fixes on staging.

## Guardrails

The developer should follow these guardrails throughout the project:

- Do not edit the live theme first; use staging or unpublished themes.[cite:30][cite:33][cite:34]
- Do not work directly in the `main` branch; use feature branches and pull requests.[cite:48][cite:52]
- Do not mix all fixes into one branch or one release.
- Do not publish compliance-sensitive content changes without approval.[cite:16]
- Keep Git commits small and descriptive.
- Keep export-based rollback files for bulk product and metafield changes.[cite:19]
- Keep the previous theme available in Shopify so theme rollback can happen quickly if needed.[cite:34]

## End-of-day Day 0 checklist

By the end of Day 0, the developer should be able to demonstrate all of the following:

- Node.js, Shopify CLI, Claude Code, and Shopify AI Toolkit are installed and working.[cite:1][cite:6][cite:41]
- Local theme files have been pulled successfully.[cite:33][cite:60]
- GitHub repository exists and the theme code is in it.[cite:46][cite:47]
- A `staging` branch exists and is connected to an unpublished Shopify theme.[cite:46]
- One test change has been committed and pushed to GitHub.[cite:46]
- One pull request has been created successfully.[cite:48][cite:52]
- Theme backups exist before edits.[cite:34]
- Product/metafield backup exports exist before bulk catalog edits.[cite:19][cite:17]
- Batch 1, Batch 2A, and Batch 3 are prepared for Astha review.[cite:16][cite:17][cite:18]

## Implementation summary

This project can move fast, but only if speed is created through parallel controlled workstreams, not uncontrolled production edits. The reports already provide enough information to begin immediately with compliance drafting, catalog cleanup, and high-impact mobile/theme fixes.[cite:16][cite:17][cite:18] Claude Code with Shopify AI Toolkit is suitable for this work when used inside a staging-first, GitHub-versioned, approval-based operating model.[cite:1][cite:11][cite:30][cite:33]
