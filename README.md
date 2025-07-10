## 요구사항

### 기본
#### 1. 프로젝트 초기 세팅
- [x] tsconfig.json 생성
- [x] outDir, rootDir, esModuleInterop, strict, moduleResolutions, target 등 설정
- [x] .ts 확장자 도입을 위한 설정 완료
- [x] @types/node, @types/express 등 타입 패키지 설치
- [x] .gitignore에 dist/ 등 빌드 결과물 추가

#### 2. npm 스크립트 구성
- [x] npm run build: tsc 명령어로 Typescript 빌드
- [x] npm run dev: ts-node + nodemon 으로 개발용 서버 실행
  
#### 3. 타입스크립트 마이그레이션 구성
- [x] 기존 파일을 .ts 파일로 변환
- [x] express, req, res, next 등 타입 명시
- [x] any 사용 최소화
- [x] 복잡한 객체에 interface 또는 type 정의
- [x] req.user 확장을 위해 declare global 사용 또는 타입 모듈 확장

#### 4. 코드 구조 리팩토링(심화)
- [x] 기존 라우터 핸들러 -> controller 디렉토리로 분리
- [x] 비즈니스 로직 -> services로 분리
- [x] DB 처리 로직 -> repositories 로 분리
- [x] 각 계층 간 의존성 분리 확인
  
#### 5. DTO 및 타입 별칭 정의
- [x] 요청/응답 데이터 구조를 위한 DTO 파일 생성 
- [x] 공통 타입은 types/ 디렉토리에 정의

#### 6. 기타
- [x] 빌드 후 dist/ 결과물이 잘 나오는지 확인
- [x] 서버 실행 시 타입 에러가 없는지 확인
- [x] 미션 4에서 구현 못한 기능 있으면 추가 구현 

## 멘토님에게
#### 1. DTO(Data Transfer Object)와 유효성 검사의 통합

사용자 입력 값에 대해 신뢰성 있는 처리를 위해 **DTO 인터페이스를 정의하고**, 이를 기반으로 `Zod` 스키마를 연동해 **유효성 검사**를 적용했습니다.

`LoginUserDto`, `RegisterUserDto`와 같은 타입을 명시한 후, 해당 필드를 검증하는 `zod` 스키마를 만들어 `validateBody` 미들웨어에서 검증할 수 있게 구성했습니다.

#### 2. 도메인 모델과 API 응답 타입 정의

`Prisma` 모델과 응답 데이터를 연결할 때도 직접 `ResponseDto` 타입을 정의하여 **API 명세를 일관되게 유지**하려 했습니다.

`ProductResponseDto`, `MyPageResponseDto` 등을 정의하여 프론트엔드에서도 **예측 가능한 응답 구조**를 받을 수 있도록 구성했습니다.

- 매운맛🔥: 뒤는 없습니다. 그냥 필터 없이 말해주세요. 책임은 제가 집니다.