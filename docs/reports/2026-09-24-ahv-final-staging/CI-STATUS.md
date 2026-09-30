# AHV consolidation checks — 25 September 2026

Task WOPS-AHV-FINAL-DRAFT-20260924-001. This supersedes the 24 September check snapshot. Status is scoped: successful local/staging checks do not mean all protected merge checks or production gates have passed.

| Check | Current evidence / disposition |
|---|---|
| Approved content and FAQ | 31 programme FAQ sets complete; 62 desktop/mobile checks pass, including visible-answer and structured-data parity. Removed duplicate legacy FAQ graph on personalised yoga. Approved names, amenities, consultation and privacy/CV copy preserved. |
| Footer | Online-consultation footer email and Subscribe controls have identical top coordinates and 48px heights at 390px and 1440px. |
| AHV unit/build/search | 116 unit tests, AHV production build, and 258 search cases pass. Policies and approved-content suites each pass 20 responsive checks. |
| Hosted staging | The same ahv-final-staging.vercel.app address serves the verified candidate: 31 FAQ SSR checks, 3 exact data files and 6 approved-content pages pass. Noindex remains enabled. |
| Shared dependency integration | Included reviewed fleet commit 37f189b without editing PR314's branch; regenerated the shared lockfile. All16 app builds pass. Fresh full dependency audit reports zero advisories. React19.2.4 is retained. |
| Asset restoration | Clean restoration verified2053 runtime +465 gallery files against archive/member hashes. Private GitHub staging artifact is a prerelease so read-only CI can read it; GH_TOKEN passes through Turbo; bounded retries handle transport-only failures. Missing releases, access and integrity errors still fail. |
| Brand/copy/evidence | Brand and banned-string checks pass. Three original design-package manifests are retained byte-for-byte under source-package-manifest.json, with valid current integrity wrappers; append-only evidence check passes. Shared path tests correctly decode workspace paths containing spaces. |
| Factory browser integration | Latest AHV run:20 pass,2 intentional locale skips,6 failures across desktop/mobile. Remaining contracts: canonical group versus approved property social links; consent expectations on GET search versus lead forms; missing CTA instrumentation. Do not alter approved profiles or add misleading consent solely to satisfy a generic test. Real forms and measurement remain integration work. |
| Lighthouse | Legacy AHV URL list targets intentionally disabled staging LPs. Production-equivalent isolated QA and actual English template coverage remain necessary; do not disable staging safety or lower budgets. |
| Production deployment holds |13 tracked app-root configurations disable automatic Git deployments on main. KairaliHerbals, whose app root is absent, has automatic Git deployments disabled in the Vercel project API with saved rollback state. Current production deployments must remain unchanged through merge. |
| Authenticated owner review | PR309 is authored by AbhilashKairali, the same identity required to review its final head. GitHub forbids self-review. A real different authorized collaborator must create a replacement PR, then the owner reviews; no agent impersonation, fabricated review or admin bypass. |

CI at the final head must complete and its actual failures remain blocking. These notes do not mark pending CI as passed. Operational report retention/deletion, real lead delivery, rates/Healing Secrets, offer details, translations and clinical approval retain their named owners. No production promotion or DNS change is authorized by this staging consolidation.

Dependency evidence: the current registry audit plus GitHub advisories GHSA-5jgf-p345-68v8 (fast-uri), GHSA-rgj7-g3m4-5g8c (sharp), GHSA-2883-xcg3-v3hh (js-yaml), GHSA-4mjr-xmp4-gh2g (qs), and the Hono4.13.5 advisory set. Exact logs, original state and restoration evidence are retained in the task's merge-readiness-20260925 package in the website-operations workspace.
