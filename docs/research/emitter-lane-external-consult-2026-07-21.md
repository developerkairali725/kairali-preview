# External consult — emit-verdicts push lane (self-solve ladder step 2, recorded)

- **When:** 2026-07-21 ~09:00–09:20 IST · **Asked by:** phase-C session, on the owner's word ("ask gpt and perplexity if this is the right way")
- **Question put to both** (full brief: the scratchpad `emitter-consult-brief.md`, reproduced in essentials below): with the GitHub Actions app un-addable as a ruleset bypass actor on this org (API 422 + absent from the UI picker; org has no Actions installation record, only Vercel), which is the RIGHT lane for the CI job to commit §0.2 evidence to a ruleset-protected main — **B** dedicated write deploy key in ruleset bypass · **C** verdict PRs merged via merge commit, no bypass · **D** dedicated minimal GitHub App as the bypass actor with short-lived installation tokens?
- **Framing honesty:** the brief listed all three options neutrally including the one the agent had not recommended (D), and invited factual correction.

## Verdicts

- **Perplexity (is it true):** framing FAIL in two places worth keeping: (1) "Actions cannot be a bypass actor" must be qualified — it is an org-context limitation (missing installation/source prerequisite), not a universal GitHub rule; (2) the deploy-key design is not endorsed by primary documentation as standard practice. **Strongest documented route = D**: GitHub's ruleset docs explicitly allow installed apps in the bypass list. C workable but changes the model; B not to be sold as standard.
- **GPT (is it good):** explicit ranking **D > C > B**. D = first-class actor identity, short-lived tokens, scoping, auditable. C = safest (no bypass) but operationally heavy. B = acceptable only with environment-secret hardening, and it strains the "no standing agent power" intent. Additional hardening flagged (adopted/queued below): (a) store the app credentials as **Environment secrets** bound to a main-restricted environment, not plain repo secrets — a write-capable agent can otherwise exfiltrate a bypass credential through any workflow; (b) **author/email provenance is spoofable** — strengthen §0.2 long-term with signed commits and/or run-ID attestation linkage; (c) optionally scope a narrow `audits/**` path ruleset instead of a repo-wide bypass.
- **Claude (this session):** had proposed B as the lighter variant; **concedes to D** on the two externals' convergence — short-lived credentials and a first-class bypass actor beat a static key, and the setup delta is ~5 owner-minutes. **All three agree ⇒ D adopted** (the D-20260720-05 adoption rule, applied).

## Decision + execution plan (RULESET mechanism stands, actor = dedicated app)

1. Owner creates a minimal org GitHub App — name `kairali-verdict-writer`, permission **Repository → Contents: Read and write** ONLY, webhook off; generates its private key; installs it on `kairali-web-factory` only.
2. Secrets `VERDICT_APP_ID` + `VERDICT_APP_KEY` stored as **Environment secrets** on a `main-verdicts` environment (branch-restricted to `main`), per GPT hardening (a).
3. Owner adds the installed app to ruleset 19322788's bypass list (it becomes a valid Integration actor once installed — this closes the earlier 422 dead-end) · then retires the classic branch-protection rule (already-queued step 4; order preserved, no unprotected window).
4. Agent PR: emit-verdicts job gains an `actions/create-github-app-token` step + pushes with the minted token; commit author stays `github-actions[bot]` (provenance patterns untouched); `.github/` change ⇒ CODEOWNERS ⇒ owner approval.
5. Proof: first emit-affecting main push lands a CI-authored verdict commit; logged same session.

## Queued follow-ups (not blocking)

- §0.2 provenance hardening (GPT (b)): signed verdict commits or run-ID attestation in the checker — needs its own design pass; home: QUESTIONS.md next capture or the evolution register.
- Path-scoped `audits/**` ruleset (GPT (c)): evaluate when the app lane is proven; would narrow the bypass surface further.
