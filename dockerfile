FROM node:22

WORKDIR /app
COPY . /app

# Dependencies 설치
RUN npm ci
RUN npm run build

ENTRYPOINT ["npm", "run", "start:prod"]