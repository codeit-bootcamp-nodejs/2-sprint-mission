# ===================================================================
#  Builder Stage
# ===================================================================
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY gateway/package*.json ./
RUN npm install

COPY gateway/ ./
COPY chat/ ./chat/
COPY game/ ./game/

RUN npm run build

# ===================================================================
#  Runner Stage
# ===================================================================
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache postgresql-client netcat-openbsd

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/drizzle.config.js ./
COPY --from=builder /app/db/migrations ./db/migrations  

COPY --from=builder /app/entrypoint.sh /entrypoint.sh
COPY --from=builder /app/seed.sh ./seed.sh
COPY --from=builder /app/seed.sql ./seed.sql
COPY --from=builder /app/wait-for-postgres.sh /wait-for-postgres.sh

RUN chmod +x /entrypoint.sh ./seed.sh /wait-for-postgres.sh

EXPOSE 3000
ENTRYPOINT ["/wait-for-postgres.sh", "db", "/entrypoint.sh"]
