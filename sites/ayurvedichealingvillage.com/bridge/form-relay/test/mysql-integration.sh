#!/usr/bin/env bash
# Test-only: starts a THROWAWAY MySQL server (socket only, no TCP, temp datadir),
# creates the relay nonce table plus synthetic lead-table fixtures, runs
# mysql-integration.php against the real relay core, then deletes everything.
# Needs local mysqld + mysql + php (pdo_mysql). Never points at a real database.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d /tmp/ahv-relay-it.XXXXXX)"
SOCK="$TMP/mysql.sock"
cleanup() {
  if [ -f "$TMP/mysqld.pid" ]; then mysqladmin --socket="$SOCK" -uroot shutdown >/dev/null 2>&1 || kill "$(cat "$TMP/mysqld.pid")" 2>/dev/null || true; fi
  sleep 1; rm -rf "$TMP"
}
trap cleanup EXIT
mysqld --no-defaults --initialize-insecure --datadir="$TMP/data" --log-error="$TMP/init.err" >/dev/null 2>&1
mysqld --no-defaults --datadir="$TMP/data" --socket="$SOCK" --skip-networking --pid-file="$TMP/mysqld.pid" --log-error="$TMP/mysqld.err" --mysqlx=OFF >/dev/null 2>&1 &
for _ in $(seq 1 60); do [ -S "$SOCK" ] && mysql --socket="$SOCK" -uroot -e 'SELECT 1' >/dev/null 2>&1 && break; sleep 0.5; done
mysql --socket="$SOCK" -uroot -e 'CREATE DATABASE `ktahv_ayurvedic_healing_village` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
mysql --socket="$SOCK" -uroot < "$HERE/../relay-tables.sql"
mysql --socket="$SOCK" -uroot -e 'SELECT VERSION() AS mysql_version'
AHV_RELAY_TEST_SOCKET="$SOCK" php "$HERE/mysql-integration.php"
