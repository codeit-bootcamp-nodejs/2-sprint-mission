#Base Image 선택
FROM node:22.14.0

ENV SERVER_PORT=3000

WORKDIR /app
COPY . /app
RUN rm -rf /app/.env /app/node_modules

RUN npm install
RUN npm run build && chmod +x /app/docker-entrypoint.sh

EXPOSE ${SERVER_PORT}

ENTRYPOINT ["/app/docker-entrypoint.sh"]