## 요구사항

### 기본
#### 1. 프로젝트 초기 세팅
- [ ] tsconfig.json 생성
- [ ] outDir, rootDir, esModuleInterop, strict, moduleResolutions, target 등 설정
- [ ] .ts 확장자 도입을 위한 설정 완료
- [ ] @types/node, @types/express 등 타입 패키지 설치
- [ ] .gitignore에 dist/ 등 빌드 결과물 추가

#### 2. npm 스크립트 구성
- [ ] npm run build: tsc 명령어로 Typescript 빌드
- [ ] npm run dev: ts-node + nodemon 으로 개발용 서버 실행
  
#### 3. 타입스크립트 마이그레이션 구성
- [ ] 기존 파일을 .ts 파일로 변환
- [ ] express, req, res, next 등 타입 명시
- [ ] any 사용 최소화
- [ ] 복잡한 객체에 interface 또는 type 정의
- [ ] req.user 확장을 위해 declare global 사용 또는 타입 모듈 확장

#### 4. 코드 구조 리팩토링(심화)
- [ ] 기존 라우터 핸들러 -> controller 디렉토리로 분리
- [ ] 비즈니스 로직 -> services로 분리
- [ ] DB 처리 로직 -> repositories 로 분리
- [ ] 각 계층 간 의존성 분리 확인
  
#### 5. DTO 및 타입 별칭 정의
- [ ] 요청/응답 데이터 구조를 위한 DTO 파일 생성 
- [ ] 공통 타입은 types/ 디렉토리에 정의

#### 6. 기타
- [ ] 빌드 후 dist/ 결과물이 잘 나오는지 확인
- [ ] 서버 실행 시 타입 에러가 없는지 확인
- [ ] 미션 4에서 구현 못한 기능 있으면 추가 구현 

## 멘토님에게
- 매운맛🔥: 뒤는 없습니다. 그냥 필터 없이 말해주세요. 책임은 제가 집니다.