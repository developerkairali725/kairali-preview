# External review pass 2 — auditor 2: sonar-reasoning-pro (raw verdict, run 2026-07-19 ~19:4x IST)

```

=== PERPLEXITY FACT AUDIT (pass 2) — FAIL ===

Most of the external, environment-level claims in the M0+M1 doctrine diff are factually sound: the authenticated GitHub approval mechanism correctly relies on review `state` and `commit_id` semantics, and the description of Google Search Console’s 16‑month data retention window and the non‑backfilling nature of BigQuery export matches current authoritative guidance. The mapping to OWASP’s Agentic Top 10 2026 is also accurate.

There is one load-bearing claim that overreaches: presenting "scaled-content enforcement" as site-wide penalties *specifically* for "velocity+thinness" implies a formally documented algorithmic factor that Google has not stated. Google’s public documentation supports site-wide signals based on helpfulness and quality, and industry experience supports caution around rapidly scaling thin content, but framing this as "velocity+thinness" as such is stronger and more precise than the evidence. That claim should be toned down to an observed risk pattern, not asserted as Google’s mechanism.

Internally, gates/class-map.yaml asserts that each registry gate id appears exactly once in `change_relevant` or `project_only`, yet the example shows `baseline` in both lists, so the comment and the data are inconsistent. That needs to be reconciled to avoid silent scope drift. Given the MISLEADING scaled-content claim and the internal scope-map inconsistency, this diff should not be treated as fully trustworthy without revision.

claims checked: 8 | problems: 1

[MISLEADING] (risk:medium) Scaled‑content enforcement in Google’s systems consists of site‑wide penalties specifically for "velocity+thinness" (high publication speed plus thin content).
   evidence: Google Search Central and public communications about the "helpful content" system emphasize content quality and "people‑first" intent, and describe the classifier as operating at site level, but they do not identify content velocity itself as a ranking factor. Industry analyses consistently report site‑wide drops when sites publish large amounts of low‑value content, but these are empirical observations, not formal disclosure of a "velocity+thinness" signal. Treating velocity as an explicit, documented penalty driver therefore goes beyond authoritative sources.
   correction: Google’s documented "helpful content" and related systems apply site‑wide signals based on whether content is helpful, people‑first, and not primarily created for search engines, but official documentation does not state that sheer content velocity is a direct ranking factor or penalty trigger. It is accurate to say that large volumes of low‑quality or unhelpful content can lead to site‑wide demotion, but describing enforcement as explicitly targeting "velocity+thinness" overstates the specificity of Google’s published mechanisms. The doctrine should frame this as an observed risk pattern (rapid scaling of thin or low‑quality pages) rather than as a formally documented algorithmic factor.

DATA FAULTS:
  ✗ `scope_map` in gates/class-map.yaml claims that `change_relevant ∪ project_only = every registry gate id, exactly once`, but the YAML as shown includes `baseline` in both `change_relevant` and `project_only`. Either the comment or the mapping is wrong, and the current text misstates the actual partitioning of gates.

SOURCES (9):
  - https://docs.github.com/en/rest/pulls/reviews
  - https://untweeps.com/seo/google-search-console-historical-data/
  - https://improvado.io/blog/google-search-console-analytics
  - https://docs.github.com/articles/reviewing-proposed-changes-in-a-pull-request
  - https://media.licdn.com/dms/document/media/v2/D561FAQFC7Zqi0W6Iag/feedshare-document-pdf-analyzed/B56ZsNZXmhI8AY-/0/1765456318710?e=1775088000&v=beta&t=CQaW87ZGYTX0VysAp4mHjxoCYXRf0Ff7kSAs-62OcCI
  - https://accuroai.co/blog/owasp-agentic-top-10-2026-annotated-for-enterprises
  - https://www.seo-stack.io/blog/why-does-google-search-console-have-a-16-month-data-limit
  - https://seotesting.com/google-search-console/how-long-does-gsc-keep-my-data/
  - https://docs.glean.com/tools/connector/github/create-review-comment-for-a-pr
```
