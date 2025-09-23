#!/bin/bash
# Nginx와 Certbot을 사용하여 SSL 인증서를 발급/갱신하고 HTTPS를 설정하는 프로덕션용 스크립트
set -e

# --- 설정 변수 ---
EMAIL="gyunam.bark@gmail.com"
DOMAINS=(-d messagoom.online -d www.messagoom.online -d api.messagoom.online -d deploy.messagoom.online)
WEBROOT="/var/www/certbot"
CONF_DIR="./nginx/conf.d"
NGINX_SERVICE="nginx" 
CERT_PATH="/etc/letsencrypt/live/messagoom.online/fullchain.pem"

# --- 스크립트 시작 ---

echo "=== Step 0: 기존 설정 파일 백업 ==="
BACKUP_DIR="./nginx/conf.d/backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp $CONF_DIR/*.conf "$BACKUP_DIR"/ 2>/dev/null || true
echo "백업 위치: $BACKUP_DIR"

echo "=== Step 1: HTTP-01 챌린지용 Nginx 설정 작성 ==="
cat > $CONF_DIR/_main.conf <<'EOF'
EOF
cat > $CONF_DIR/www.conf <<'EOF'
server {
    listen 80;
    server_name messagoom.online www.messagoom.online deploy.messagoom.online;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}
EOF
cat > $CONF_DIR/api.conf <<'EOF'
server {
    listen 80;
    server_name api.messagoom.online;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}
EOF

echo "=== Step 2: Nginx 컨테이너 실행 ==="
docker compose up -d $NGINX_SERVICE

echo "Nginx 컨테이너가 준비될 때까지 5초 대기..."
sleep 5

echo "=== Step 3: 챌린지 테스트 파일 배치 및 확인 ==="
CHALLENGE_DIR="$WEBROOT/.well-known/acme-challenge"
TEST_FILE_URL="http://messagoom.online/.well-known/acme-challenge/test.txt"
EXPECTED_CONTENT="test-ok-$(date +%s)"

docker compose exec $NGINX_SERVICE mkdir -p $CHALLENGE_DIR
docker compose exec $NGINX_SERVICE rm -f $CHALLENGE_DIR/test.txt
docker compose exec $NGINX_SERVICE sh -c "echo \"$EXPECTED_CONTENT\" > $CHALLENGE_DIR/test.txt"

sleep 3
CONTENT=$(curl -s $TEST_FILE_URL)

if [ "$CONTENT" = "$EXPECTED_CONTENT" ]; then
    echo "챌린지 테스트 성공!"
else
    echo "ERROR: 챌린지 테스트 실패. Nginx 설정을 확인하세요."
    echo "기대했던 내용: $EXPECTED_CONTENT"
    echo "실제 수신된 내용: $CONTENT"
    exit 1
fi

echo "=== Step 4: Certbot으로 SSL 인증서 발급 또는 갱신 시도 ==="
if docker compose exec $NGINX_SERVICE test -f $CERT_PATH; then
    echo "기존 인증서 발견 → 갱신 시도"
    docker compose run --rm certbot renew \
      --webroot -w $WEBROOT \
      --preferred-challenges http-01 \
      --http-01-port 80 \
      --non-interactive \
      -v
else
    echo "기존 인증서 없음 → 새로 발급"
    docker compose run --rm certbot certonly \
      --webroot -w $WEBROOT \
      "${DOMAINS[@]}" \
      --preferred-challenges http-01 \
      --http-01-port 80 \
      --non-interactive \
      --agree-tos \
      -m "$EMAIL" \
      -v
fi

echo "=== Step 5: HTTPS 적용을 위한 Nginx 설정 작성 ==="
cat > $CONF_DIR/_main.conf <<'EOF'
EOF
cat > $CONF_DIR/www.conf <<'EOF'
server {
    listen 80;
    server_name messagoom.online www.messagoom.online deploy.messagoom.online;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl;
    http2 on;
    server_name messagoom.online www.messagoom.online deploy.messagoom.online;
    ssl_certificate /etc/letsencrypt/live/messagoom.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/messagoom.online/privkey.pem;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
EOF

cat > $CONF_DIR/api.conf <<'EOF'
server {
    listen 80;
    server_name api.messagoom.online;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl;
    http2 on;
    server_name api.messagoom.online;

    ssl_certificate /etc/letsencrypt/live/messagoom.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/messagoom.online/privkey.pem;

    resolver 127.0.0.11;

    location / {
        # ✅ CORS Preflight 처리
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://www.messagoom.online';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        # ✅ WebSocket 지원 프록시
        set $upstream gateway;
        proxy_pass http://$upstream:3000;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "=== Step 6: Nginx 설정 다시 불러오기 (Graceful Reload) ==="
docker compose exec $NGINX_SERVICE nginx -s reload

echo "=== Step 7: HTTPS 연결 및 인증서 유효성 확인 ==="
echo "Nginx가 새 설정을 적용할 때까지 3초 대기..."
sleep 3
curl -v --fail https://messagoom.online || { echo "ERROR: HTTPS check failed for messagoom.online"; exit 1; }
curl -v --fail https://www.messagoom.online || { echo "ERROR: HTTPS check failed for www.messagoom.online"; exit 1; }
curl -v --fail https://deploy.messagoom.online || { echo "ERROR: HTTPS check failed for deploy.messagoom.online"; exit 1; }

# API 서비스는 준비가 늦을 수 있으므로 최대 30초 재시도
echo "API 서비스 준비 대기 중..."
for i in {1..30}; do
  if curl -s https://api.messagoom.online >/dev/null; then
    echo "API 준비 완료!"
    break
  fi
  sleep 1
  if [ $i -eq 30 ]; then
    echo "ERROR: HTTPS check failed for api.messagoom.online (30초 대기 후에도 실패)"
    exit 1
  fi
done

echo "모든 도메인 HTTPS 연결 확인 완료."

echo "=== Step 8: Certbot 자동 갱신 서비스 활성화 ==="
docker compose up -d certbot

echo "SSL 인증서 발급/갱신 및 HTTPS 설정, 자동 갱신까지 완료되었습니다."