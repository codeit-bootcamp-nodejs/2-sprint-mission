FROM node:22


WORKDIR /app

# package.json 복사
COPY package*.json tsconfig.json ./

# devDependencies 포함 설치
RUN npm ci

# 코드 복사
COPY . .


# 빌드
RUN npm run build


# 서버 시작
CMD ["npm", "run", "start"]
