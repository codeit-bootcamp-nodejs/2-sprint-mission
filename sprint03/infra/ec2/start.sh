npm install -g pm2
pm2 -v
pm2 start npm --name "app" -i max -- run start
pm2 list
pm2 logs app
pm2 delete app
nano ecosystem.config.js
pm2 start ecosystem.config.js
pm2 restart panda-market