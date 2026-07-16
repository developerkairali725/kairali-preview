#!/usr/bin/env bash
# DataForSEO authenticated POST helper.
#   Usage: scripts/dfs.sh <endpoint-path-after-v3/> '<json-payload>'
# Reads creds from ~/.secrets/dataforseo.env (login+password). Never echoes creds.
set -euo pipefail
ENDPOINT="${1:?endpoint required}"; PAYLOAD="${2:?json payload required}"
set -a; . "$HOME/.secrets/dataforseo.env"; set +a
curl -s --max-time 90 -u "$DATAFORSEO_LOGIN:$DATAFORSEO_PASSWORD" \
  -H "Content-Type: application/json" \
  -X POST "https://api.dataforseo.com/v3/${ENDPOINT}" -d "$PAYLOAD"
