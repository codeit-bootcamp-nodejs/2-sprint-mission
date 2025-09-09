# --- Build stage ---
  FROM node:20-alpine AS builder
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm ci
  
  COPY . .
  # TS 빌드 산출물은 dist/ 로 생성
  RUN npm run build
  
  # --- Runtime stage ---
  FROM node:20-alpine
  WORKDIR /usr/src/app
  
  # 프로덕션 의존성만
  COPY package*.json ./
  RUN npm ci --omit=dev
  
  # 빌드 결과 및 필요한 소스만 복사
  COPY --from=builder /usr/src/app/dist ./dist
  COPY --from=builder /usr/src/app/prisma ./prisma
  COPY --from=builder /usr/src/app/package*.json ./
  
  # 업로드 디렉토리(볼륨 마운트 대상)
  RUN mkdir -p /usr/src/app/uploads
  
  ENV NODE_ENV=production
  EXPOSE 3000
  
  # package.json: "start": "node dist/server.js"
  CMD ["npm", "run", "start"]
  