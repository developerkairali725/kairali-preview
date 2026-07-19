# go-science skill — provenance & install record

- Vendor zip: `go-science-skill.zip` SHA-256 `7563df1d13349a2830fc6fa04af52dd8525847dbc2710653e6b33008eb06bb9d`
  (downloaded by owner 18 Jul 2026; committed 2026-07-19 11:45:45 IST).
- Repo working copy `docs/marketing/go-science/` is hash-identical to the zip EXCEPT
  `marketplace/.claude-plugin/marketplace.json`: an `owner` object was ADDED 2026-07-19 11:45:45 IST — current
  Claude Code marketplace schema requires it (vendor manifest fails `claude plugin validate`
  without it). No other change.
- Machine install (properly, 2026-07-19 11:45:45 IST): vendor setup.sh had written a `pluginMarketplaces` key that
  current Claude Code ignores — the skill never loaded. Fixed: `claude plugin marketplace add`
  + `claude plugin install go-science@go-science` → installed_plugins.json v1.0.0, enabled,
  knowledge path verified (SHA 8d84a968…). Loads from the next session onward.
- Gate coupling: scripts/go-science-audit.mjs reads knowledge/ay-science-knowledge.md from THIS
  directory (fail-closed on drift) — the gate and the skill share one undiluted source of truth.
