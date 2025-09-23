FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 파일 업로드 폴더 생성
RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"]