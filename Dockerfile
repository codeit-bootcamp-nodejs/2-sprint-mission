FROM node:24 AS builder

WORKDIR /app

COPY sprint03/package*.json ./
RUN npm ci
COPY sprint03/ ./

RUN npm run build


FROM node:24 AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY sprint03/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate --schema=/app/prisma/schema.prisma

EXPOSE 3000

ENTRYPOINT ["node","dist/server.js"]