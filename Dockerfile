FROM node:22-alpine

# 소스코드의 최상위 디렉토리로 이동한다. 
WORKDIR /usr/src/app

# package.json과 package-lock.json 파일을 복사한다. 
COPY package*.json ./

# 소스코드를 실행할 떄 필요한 파일을 다운로드한다. 
RUN npm ci

# 소스코드를 복사한다. 
COPY . .

# 애플리케이션을 빌드한다. 
RUN npm run build

# 컨테이너가 사용할 포트 노출   
EXPOSE 3000

# 서버를 실행한다. 
CMD ["npm", "run", "start"]
