#!/bin/bash

# PM2 시작 명령어
pm2 start ecosystem.config.js --env production

# PM2 프로세스 리스트 확인
pm2 list

# PM2 로그 확인
pm2 logs

# PM2 모니터링
pm2 monit

# PM2 재시작
pm2 restart pandamarket-api

# PM2 중지
pm2 stop pandamarket-api

# PM2 삭제
pm2 delete pandamarket-api

# PM2 startup 설정 (시스템 재시작 시 자동 실행)
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save