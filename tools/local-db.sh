#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PG_BIN="${PG_BIN:-/usr/lib/postgresql/18/bin}"
PG_LOCAL_PORT="${PG_LOCAL_PORT:-55439}"
mkdir -p .local/pgsocket
if [ ! -f .local/pgsql/PG_VERSION ]; then
  mkdir -p .local/pgsql
  "$PG_BIN/initdb" -D .local/pgsql --username=resconate --auth-local=trust --auth-host=scram-sha-256 --pwfile=<(printf '%s' resconate_local)
fi
if ! "$PG_BIN/pg_ctl" -D .local/pgsql status >/dev/null 2>&1; then
  "$PG_BIN/pg_ctl" -D .local/pgsql -l .local/postgres.log -o "-h 127.0.0.1 -p $PG_LOCAL_PORT -k $PWD/.local/pgsocket" start
fi
for database in resconate resconate_test; do
 if ! "$PG_BIN/psql" -h "$PWD/.local/pgsocket" -p "$PG_LOCAL_PORT" -U resconate -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$database'" | rg -q 1; then
  "$PG_BIN/createdb" -h "$PWD/.local/pgsocket" -p "$PG_LOCAL_PORT" -U resconate "$database"
 fi
done
