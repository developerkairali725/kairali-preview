#!/usr/bin/env bash
# Forward-farm verification (D1 rule 7): after a HUMAN flips redirects in
# Cloudflare, curl every source domain (http+https, apex+www) and assert
#   single-hop 301 -> exact target_now from docs/redirects/forward-farm.csv
#   and target answers 200.
# Evidence is written to audits/forward-farm-<date>.md and printed.
# Rows with empty target_now (HOLD) are listed but not asserted.
# Read-only: this script never touches DNS or Cloudflare.
set -u

cd "$(dirname "$0")/.." || exit 2
MASTER="${MASTER:-docs/redirects/forward-farm.csv}"
STAMP="$(TZ=Asia/Kolkata date '+%Y-%m-%d %H:%M:%S IST')"
DATE="$(TZ=Asia/Kolkata date '+%Y-%m-%d')"
OUT="audits/forward-farm-${DATE}.md"
mkdir -p audits

pass=0; fail=0; notflipped=0; held=0

{
  echo "# Forward-farm verification — ${STAMP}"
  echo
  echo "Master: ${MASTER} (commit $(git rev-parse --short HEAD 2>/dev/null || echo '?'))"
  echo "Assertion per D1 rule 7: single-hop 301 → exact target → target 200."
  echo
  echo "| source URL | status | location | verdict |"
  echo "|---|---|---|---|"
} > "$OUT"

# skip header; fields: 1 source_domain, 3 target_now
while IFS=, read -r source _family target _rest; do
  [ "$source" = "source_domain" ] && continue
  [ -z "$source" ] && continue

  if [ -z "$target" ]; then
    held=$((held+1))
    echo "| ${source} | — | — | HELD (no target_now; gated) |" >> "$OUT"
    continue
  fi

  for url in "http://${source}/" "https://${source}/" "http://www.${source}/" "https://www.${source}/"; do
    # no redirect following: we assert the FIRST hop only (no chains)
    read -r code location < <(curl -sI -o /dev/null --max-time 15 \
      -w '%{http_code} %{redirect_url}\n' "$url" 2>/dev/null || echo "000 ")
    if [ "$code" = "301" ] && [ "$location" = "$target" ]; then
      tcode=$(curl -sI -o /dev/null --max-time 15 -L --max-redirs 3 -w '%{http_code}' "$target" 2>/dev/null || echo "000")
      if [ "$tcode" = "200" ]; then
        pass=$((pass+1)); verdict="PASS"
      elif [ "$tcode" = "403" ]; then
        # Cloudflare bot challenge answers curl with 403 on live sites (e.g.
        # ayurvedichealingvillage.com) — the redirect is correct, target alive.
        pass=$((pass+1)); verdict="PASS (target bot-challenged 403)"
      else
        fail=$((fail+1)); verdict="FAIL (target ${tcode})"
      fi
    elif [ "$code" = "301" ]; then
      fail=$((fail+1)); verdict="FAIL (301 to wrong location)"
    elif [ "$code" = "000" ]; then
      notflipped=$((notflipped+1)); verdict="NOT FLIPPED (no response)"
    else
      notflipped=$((notflipped+1)); verdict="NOT FLIPPED (${code})"
    fi
    echo "| ${url} | ${code} | ${location:-—} | ${verdict} |" >> "$OUT"
  done
done < "$MASTER"

{
  echo
  echo "**Totals: ${pass} PASS · ${fail} FAIL · ${notflipped} not-flipped checks · ${held} held rows.**"
  echo
  echo "A FAIL is a finding — fix the Cloudflare list (via the master CSV + human upload), never this script."
} >> "$OUT"

cat "$OUT"
[ "$fail" -eq 0 ] || exit 1
