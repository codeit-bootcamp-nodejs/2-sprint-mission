# --- Build stage ---
  FROM node:20-alpine AS builder
  WORKDIR /usr/src/app
  
  # 1) 의존성
  COPY package*.json ./
  RUN npm ci
  
  # 2) 소스/셰마만 먼저 복사 (캐시 효율)
  COPY prisma ./prisma
  COPY tsconfig.json ./
  COPY src ./src
  
  # 3) Prisma Client 생성
  ENV DATABASE_URL=postgresql://user:pass@localhost:5432/db
  RUN npx prisma generate
  
  # 4) TS 빌드
  RUN npm run build
  
  # --- Runtime stage ---
  FROM node:20-alpine
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm ci --omit=dev
  
  COPY --from=builder /usr/src/app/dist ./dist
  COPY --from=builder /usr/src/app/prisma ./prisma
  
  ENV NODE_ENV=production
  EXPOSE 3000
  CMD ["npm", "run", "start"]