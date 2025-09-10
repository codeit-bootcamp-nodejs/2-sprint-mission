# build 
FROM node:24 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# runtime
FROM node:24 AS runner
WORKDIR /app
ENV NODE_ENV=production

# prod deps 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 산출물/스키마 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Prisma Client 생성 (런타임 node_modules 기준)
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# 서버만 실행 (migrate는 compose의 migrate 서비스가 담당)
ENTRYPOINT ["node","dist/src/server.js"]
