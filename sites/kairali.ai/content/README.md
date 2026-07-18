# content/*.html — generated teaching material

These files are built from `docs/sops/*.md` (the source of truth) via `marked`.
They quote the banned vocabulary on purpose (they TEACH the rules), so the
lines naming banned efficacy words carry an inline HTML-comment suppression
marker (`compliance-allow`) — invisible to readers, reported as info by the
compliance lint. **If you regenerate these files, re-add the markers** to any
line that quotes the banned-word lists, or the merge-blocking compliance gate
fails. Fix the copy, never the gate.
