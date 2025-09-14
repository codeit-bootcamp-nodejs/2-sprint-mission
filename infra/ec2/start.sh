#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd $(dirname $0)

# DB 및 AWS 환경 변수 들
cp "$HOME/config/.env" ../../.env

(cd ../../ && npm install && npx prisma migrate dev)

#pm2 설치
npm install -g pm2

# ../../.env 파일에 있는 환경 변수가 production일 때 사용됨.
# src/lib/constants.ts 참조
pm2 start ecosystem.config.js