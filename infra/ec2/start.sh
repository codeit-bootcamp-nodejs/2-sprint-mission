#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd $(dirname $0)

(cd ../../ && npm install && npx prisma migrate dev)

#pm2 설치
npm install -g pm2

# src/lib/constants.ts 참조
pm2 start ecosystem.config.js