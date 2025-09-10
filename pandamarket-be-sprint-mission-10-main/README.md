# Panda Market API

## 환경 변수 설정
`.env.example` 파일을 참고해서 `.env`와 `.env.test`에 필요한 환경 변수를 설정해 주세요.

## 설치

의존성 패키지를 설치합니다.

```
npm install
```

Prisma와 데이터베이스를 준비합니다.
```
npx prisma generate
npx prisma migrate dev
```

## 실행

`npm dev`로 개발 모드로 실행할 수 있습니다.

## 스프린트 미션 10 관련 설명

### 이미지 업로드 구현

- multer-s3는 유지보수가 되고 있지 않아, 편의상 multer에서 제공하는 메모리 스토리지를 사용해 form-data를 처리하고, @aws-sdk/client-s3로 저장하도록 구현했습니다. (`src/services/imagesService.ts` 파일)
- 여기서는 편의상 multer 미들웨어를 사용했지만, 더 나은 이미지 업로드 구현 방식도 고민해 보시면 좋을 것 같습니다!

### 배포 관련 설정들

- `/infra` 폴더에 참고할 수 있는 파일들을 올려두었습니다.
