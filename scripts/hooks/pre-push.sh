#!/usr/bin/env bash
# Pre-push gate: compliance lint + package tests + build. Fail = push blocked.
set -e
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"

echo "pre-push gate: compliance lint…" >&2
node packages/compliance/bin/lint.js >&2

echo "pre-push gate: package tests…" >&2
node --test packages/compliance/test/*.test.js >/dev/null 2>&1 || { echo "compliance tests failed" >&2; exit 1; }

if [ -d node_modules ]; then
  echo "pre-push gate: build…" >&2
  pnpm build >/dev/null 2>&1 || { echo "pnpm build failed — run pnpm build for details" >&2; exit 1; }
else
  echo "pre-push gate: node_modules missing, skipping build (CI will catch it)" >&2
fi
echo "pre-push gate: PASS" >&2
