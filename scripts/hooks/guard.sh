#!/usr/bin/env bash
# PreToolUse guard on Bash — CLAUDE.md hard gates, mechanically enforced.
# Exit 2 blocks the command and feeds stderr back to the agent.
# Never weaken this file to make something pass (CLAUDE.md rule g).

INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null)
[ -z "$CMD" ] && exit 0

block() { echo "BLOCKED by guard.sh: $1" >&2; exit 2; }

# Gate 5 MANDATES the leased form, and the substring test below matched it —
# "--force-with-lease" contains "--force" — so the guard blocked the exact command its own
# message demands, and then blocked the commit that documented the bug.
# Neutralise the leased spelling first, then test what is left: a leased push
# passes, and a bare flag still blocks even when a leased one sits beside it.
CMD_UNLEASED=${CMD//--force-with-lease/--LEASED}
case "$CMD_UNLEASED" in
  *"git push --force"*|*"git push -f "*|*"git push -f"$'\n'*) block "force push — use --force-with-lease only (CLAUDE.md gate 5)";;
esac
case "$CMD" in
  *"rm -rf /"*|*"rm -rf ~"*|*"rm -rf \$HOME"*) block "rm -rf outside the repo";;
esac
case "$CMD" in
  *"curl "*"| bash"*|*"curl "*"|bash"*|*"wget "*"| sh"*) block "piping downloads to a shell — review scripts before running";;
esac
# Production WordPress / DNS surfaces — HUMAN actions only (CLAUDE.md gates 1,3)
# The rule protects PRODUCTION, and production is only reachable over the wire
# or through wp-cli. Matching the bare word blocked reading, grepping and even
# WRITING DOCUMENTATION about it — this guard refused a grep of its own rule,
# twice, while patching it. Every real operation is still blocked; what is no
# longer blocked is talking about one. Narrowing a false positive is not
# weakening the gate (same argument as the chat-bubble-lint detection fix).
case "$CMD" in
  *curl*|*wget*|*ssh*|*scp*|*rsync*|*"wp db"*|*"wp plugin"*|*"wp theme"*|*"wp user"*|*"wp option"*|*"wp post"*|*"wp core"*)
    case "$CMD" in
      *"wp-admin"*|*"wp-config"*|*"/xmlrpc.php"*) block "production WordPress surface — Lane B via Deepu/Abilash only";;
    esac
  ;;
esac
# The config file stays protected against LOCAL edits too (gate 3), by naming
# the write rather than the word.
case "$CMD" in
  *"sed -i"*"wp-conf"*|*"> wp-conf"*|*">> wp-conf"*|*"rm "*"wp-conf"*|*"mv "*"wp-conf"*) block "config edit — ask first (CLAUDE.md gate 3)";;
esac
case "$CMD" in
  *"api.cloudflare.com/client"*"dns_records"*) block "DNS change — FOREVER-HUMAN action (Abilash/Ambuj flip)";;
esac

# Shopify Admin API — the agent is READ-ONLY (CLAUDE.md rule k: it audits, builds
# in git and prepares; HUMANS click). Same shape as the Cloudflare block above,
# plus a verb test: GET must still pass so the admin CAN be audited, because an
# agent that cannot read the admin cannot check the docs against it (rule j).
#
# Lowercased + quote-stripped copy for the URL and verb words, so `-X 'POST'` and
# `-XPOST` cannot slip through. Body flags are matched against the ORIGINAL case
# on purpose: curl's `-F` is --form (a write) but `-f` is --fail (a harmless GET),
# and folding case would block every `curl -f`.
CMD_LC=$(printf '%s' "$CMD" | tr '[:upper:]' '[:lower:]' | tr -d "\"'")
case "$CMD_LC" in
  *myshopify.com/admin/api*)
    SHOPIFY_WRITE=""
    case "$CMD_LC" in
      *graphql.json*)
        # The GraphQL Admin API is POST even for reads, so the verb proves
        # nothing. The `mutation` keyword is what separates a write from a query.
        case "$CMD_LC" in *mutation*) SHOPIFY_WRITE="a GraphQL mutation";; esac
        ;;
      *)
        case "$CMD_LC" in
          *" -x post"*|*" -x put"*|*" -x patch"*|*" -x delete"*|\
          *" -xpost"*|*" -xput"*|*" -xpatch"*|*" -xdelete"*|\
          *" -x=post"*|*" -x=put"*|*" -x=patch"*|*" -x=delete"*|\
          *"--request post"*|*"--request put"*|*"--request patch"*|*"--request delete"*|\
          *"--request=post"*|*"--request=put"*|*"--request=patch"*|*"--request=delete"*|\
          *"--method post"*|*"--method put"*|*"--method patch"*|*"--method delete"*|\
          *"--method=post"*|*"--method=put"*|*"--method=patch"*|*"--method=delete"*|\
          *"method: post"*|*"method:post"*|*"method: put"*|*"method:put"*|\
          *"method: patch"*|*"method:patch"*|*"method: delete"*|*"method:delete"*)
            SHOPIFY_WRITE="an explicit mutating verb";;
        esac
        case "$CMD" in
          *" -d "*|*" -d'"*|*' -d"'*|*" -d{"*|*"--data"*|*" -F "*|*"--form"*|*" -T "*|*"--upload-file"*)
            SHOPIFY_WRITE="a request body (curl sends POST/PUT)";;
        esac
        ;;
    esac
    if [ -n "$SHOPIFY_WRITE" ]; then
      block "Shopify Admin API write — $SHOPIFY_WRITE. FOREVER-HUMAN action (CLAUDE.md rule k: the agent is READ-ONLY in the Shopify admin). Reads (GET, GraphQL queries) are allowed; a human clicks the write."
    fi
    ;;
esac

# Pre-push gate: build + tests + compliance must pass before any push
case "$CMD" in
  *"git push"*)
    bash "$(dirname "$0")/pre-push.sh" || block "pre-push gate failed — fix the cause, never the gate";;
esac

exit 0
