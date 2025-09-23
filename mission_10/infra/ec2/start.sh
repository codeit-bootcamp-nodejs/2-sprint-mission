#!/bin/bash
# /infra/ec2/start.sh

cd /home/ubuntu/2-sprint-mission/mission_10

npm install
npm run build

npx pm2 start /home/ubuntu/2-sprint-mission/mission_10/infra/ec2/ecosystem.config.js --env production
npx pm2 save
npx pm2 startup
npx pm2 status

