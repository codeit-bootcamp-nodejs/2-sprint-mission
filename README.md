# 📌 스프린트 미션 11

# **미션 목표**

- Github Actions로 테스트, 배포 자동화
- Docker 이미지 만들기

# **요구사항**

### **Github Actions 활용**

- 브랜치에 pull request가 발생하면 테스트를 실행하는 액션을 구현해 주세요.
- `main` 브랜치에 push가 발생하면 AWS 배포를 진행하는 액션을 구현해 주세요.
- 개인 Github 리포지터리에서 Actions 동작을 확인해 보세요.

### **Docker 이미지 만들기**

다음을 만족하는 Dockerfile과 docker-compose.yaml을 작성해 주세요.

- Express 서버를 실행하는 Dockerfile을 작성해 주세요.
- Express 서버가 파일 업로드를 처리하는 폴더는 Docker의 Volume을 활용하도록 구현해 주세요.
- 데이터베이스는 Postgres 이미지를 사용해 연결하도록 구현해 주세요.
- 실행된 Express 서버 컨테이너는 호스트 머신에서 3000번 포트로 접근 가능하도록 구현해 주세요.

# **제출 안내**

**주의**

AWS 인증 정보들을 제출 코드에 포함하지 마세요!

- Github actions는 `.github/workflows/` 폴더에 저장해서 제출합니다.
- Docker 관련 파일들은 프로젝트 폴더 최상위에 저장합니다.

# **미션 목표**

- 판다마켓 서비스를 AWS로 배포하기
- AWS S3 적용 => 생성 완료
- AWS RDS 적용 => 생성 완료 
- AWS EC2에 Express 서버 배포하기
- (심화) 프로세스 매니저 적용
- (심화) 리버스 프록시 적용

## 🛠 실행 방법
```bash
npm install
npx prisma migrate dev
npm run dev   # 서버 실행
npm run test  # 테스트 실행
```