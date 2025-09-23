#!/bin/sh
set -e

# 0. .env 로드
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 1. psql 비밀번호 자동 인식
export PGPASSWORD="$DB_PASSWORD"

# 2. DB 리셋
echo "Resetting database $DB_NAME..."
psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "CREATE DATABASE \"$DB_NAME\";"

# 3. 마이그레이션
echo "Syncing database schema..."
npm run drizzle:migrate

# 4. 시딩
echo "Running seed script..."
npm run seed

# 5. 서버 실행
echo "Starting application server..."
npm start
