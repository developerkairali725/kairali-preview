# Bulk preview build skipping

Task WOPS-FACTORY-BUILD-SKIP-20261007-001. Candidate configuration; remote activation is pending separate owner approval. Merging this PR alone does not change Vercel settings.

On AHV-only PR351 (2b3f94bdbfb2aca1aeae23f2cde616cab1cbc342), GitHub factory CI correctly built only AHV. Vercel nevertheless built bulkayurvedaoils.com and bulkayurvedaproducts.com while skipping eleven other projects. Authenticated project reads found `enableAffectedProjectsDeployments: null` on both bulk projects, versus `true` on the skipping arogyakendra control. Neither bulk project has a custom ignore command. The manifest copied those null values, allowing the drift preflight to pass without requiring skipping.

Evidence: [AHV PR351](https://github.com/kairali-digital/kairali-web-factory/pull/351), [oils deployment](https://vercel.com/kairali/kairali-web-factory-bulkayurvedaoils/FKwPu2jwnNtzauXG5NQWTt6C4oKv), [products deployment](https://vercel.com/kairali/kairali-web-factory-bulkayurvedaproducts/4scpU85kVqhzSwQkfMZDC4cXnv9y). The two deployments reached READY in preview. Their build logs identify the exact AHV commit. PR350 repeated the same pattern. By contrast, [factory run 37516459799](https://github.com/kairali-digital/kairali-web-factory/actions/runs/37516459799) legitimately selected all sites: merge d4a56c3 changed pnpm-lock.yaml and pnpm-workspace.yaml.

The manifest now requires `affectedProjects: true` for both, and the read-only drift checker rejects a Git mapping that silently omits that requirement. No workflows, safety thresholds, application sources, domains, Git connections or production deployment controls change.

## Activation, only after explicit approval

Team `team_PcAcLkSAnWxQBKCjStgYNp4I`, repository `kairali-digital/kairali-web-factory`:

| Project ID | Expected name | Expected root |
| --- | --- | --- |
| prj_tx7gKtQrvXcGTvLzzhJ8UJNSVZZ6 | kairali-web-factory-bulkayurvedaoils | sites/bulkayurvedaoils.com |
| prj_1Uf5Mt3XTn3fbFgpf62v5IkJlRHM | kairali-web-factory-bulkayurvedaproducts | sites/bulkayurvedaproducts.com |

1. Re-read each project, verify team/ID/name/root/repository and preserve an allowlisted settings snapshot. Stop on drift; do not export environment values.
2. PATCH only `enableAffectedProjectsDeployments: true` on these two project IDs, or enable **Skip deployment** under each project's Root Directory settings. Do not alter other settings.
3. Re-read both; require explicit true and unchanged identity/root/Git/protection fields. Run the authenticated `node scripts/deployment-drift.mjs` preflight and distinguish unrelated drift from this repair.
4. Observe the next authorized AHV-only preview push: both should be skipped. Verify each site's own edit and a relevant shared dependency still build when those changes next occur; do not make artificial production edits. Until that evidence exists, record CONFIG-COMPLETE / MONITOR-OPEN, not verified runtime closure.
5. If native skipping omits a needed build, turn only these two switches off (`false`) to restore build-every-push behavior and investigate. The recorded original value is null; false restores behavior, not the exact serialized original. No remote rollback has been exercised because remote settings were not changed in this session. Source rollback is the PR revert.

[Vercel's native selector](https://vercel.com/docs/monorepos#skipping-unaffected-projects) retains builds for own source, internal dependencies and relevant lockfile changes. Root files outside workspaces can trigger global builds, including root documentation. Our GitHub planner's documentation-only empty matrix is a separate rule; do not promise native Vercel skips all documentation. Native skipping avoids occupying build slots, unlike an Ignored Build Step. Keep package dependency declarations complete. Missing evidence/history or shared build/config changes must never be converted into blanket skips.

Regression checks use the real repository graph for AHV-only changes, each bulk site's own changes, shared UI/consent, documentation-only GitHub selection and conservative full validation for unknown base/workspace/lockfile/safety inputs. Existing transitive dependency and completion tests cover cancellation, missing and failed required jobs. No test claims to execute Vercel's proprietary selector locally.
