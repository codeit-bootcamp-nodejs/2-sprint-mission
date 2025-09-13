#!/bin/bash

#pm2 설치
npm install -g pm2

# ../../.env 파일에 있는 환경 변수가 production일 때 사용됨
# src/lib/constants.ts 참조
pm2 start ecosystem.config.js