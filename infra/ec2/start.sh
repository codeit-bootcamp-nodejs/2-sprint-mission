#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/ec2-user/app"   
cd "$APP_DIR"

npm ci --omit=dev
export NODE_ENV=production
export PORT=4000

pm2 start ecosystem.config.js --env production
pm2 save
