# Node.js 경량 이미지
FROM node:20-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# Prisma Client 생성
COPY prisma ./prisma
RUN npx prisma generate

# 앱 소스 복사 & 빌드
COPY . .
RUN npm run build

# 업로드 폴더 (Volume으로 관리)
VOLUME ["/app/uploads"]

EXPOSE 3000
CMD ["node", "./build/main.js"]
