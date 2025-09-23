#!/bin/bash
cd /home/ubuntu/2-sprint-mission

# 의존성 설치 (필요시)
npm install

# 빌드
npm run build

# pm2로 서버 실행
pm2 start "npm run start" --name pandamarket

# 현재 실행 상태 저장 (재부팅 후에도 유지)
pm2 save

# pm2를 systemd에 등록 (최초 1회만 필요)
pm2 startup systemd -u ubuntu --hp /home/ubuntu
