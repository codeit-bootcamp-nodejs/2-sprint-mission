## 🌕 SPRINT MISSION 10 (25 / 09 / xx)  
> **NB 2기 강시연**  

## 1️⃣ Docker 환경 구성  

- **Dockerfile 작성**  
  - Node 20-alpine 기반 이미지  
  - `npm install` → `npx prisma generate` → `npm run build` 단계 분리  
  - 컨테이너 내에서 Express 서버 실행  

- **docker-compose.yaml 작성**  
  - `api` (Express 서버) + `db` (PostgreSQL) 서비스 구성  
  - API 컨테이너 → `depends_on: db` 설정  
  - 업로드 폴더는 Volume으로 마운트 → 컨테이너 재시작에도 파일 유지  
  - API 서버 3000번 포트 → 호스트 3000번 포트 매핑  

- **Prisma 적용**  
  - `.env` → 컨테이너 환경 변수로 전달  
  - `DATABASE_URL` 올바르게 설정 후 `prisma migrate deploy` 실행  

## 2️⃣ GitHub Actions 설정  

- **워크플로우 파일 작성 (`.github/workflows/pr-test.yml`)**  
  - main 브랜치 PR 생성 시 자동 테스트 실행  
  - Node.js 20 환경에서 `npm install` + `npm test`  
  - PR에서 바로 테스트 결과 확인 가능  

- **배포 워크플로우 준비 (`deploy.yml`)**  
  - main 브랜치 push 발생 시 AWS EC2 배포 (추가 예정)  
  - AWS Secrets → GitHub Secrets로 관리  

## 3️⃣ 테스트 실행 및 확인  

- **로컬 테스트**  
  - `docker compose up --build` 성공 → 컨테이너 정상 기동  
  - DB 초기화 후 서버에서 3000번 포트로 접근 가능 확인  

- **GitHub Actions 테스트**  
  - 테스트 브랜치 생성 → PR 생성 → Actions 탭에서 실행 확인  
  - 빌드/테스트 모두 통과  


## 4️⃣ 오늘 주요 파일  

- `Dockerfile` – Node.js 빌드 및 실행 환경  
- `docker-compose.yaml` – API + DB + 볼륨 설정  
- `.github/workflows/pr-test.yml` – PR 테스트 자동화  
