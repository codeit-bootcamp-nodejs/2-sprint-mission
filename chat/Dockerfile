# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["/entrypoint.sh"]
