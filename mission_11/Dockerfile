ARG NODE_VERSION=22
FROM node:$NODE_VERSION-alpine

COPY . /app

WORKDIR /app

RUN npm ci \
    && npm run build

ENV PORT=3000

ENTRYPOINT [ "npm", "run", "start" ]
