# pm2 설치
npm install -g pm2
# pm2로 앱 실행
pm2 start dist/app.js --name panda-market
# pm2 상태 확인
pm2 status
# pm2 설정 파일 수정
nano infra/ec2/ecosystem.config.js
# pm2 설정 파일로 앱 실행
pm2 start infra/ec2/ecosystem.config.js
# pm2가 서버 재부팅 후에도 자동으로 실행되게 설정하기
pm2 startup
# pm2 설정 저장
pm2 save