#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"

# Netcat(nc)을 사용하여 DB_HOST의 DB_PORT가 열릴 때까지 1초마다 확인합니다.
until nc -z "$host" "$DB_PORT"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
# 데이터베이스가 준비되면, 원래 실행하려 했던 명령(entrypoint.sh의 나머지 부분)을 실행합니다.
exec $cmd
