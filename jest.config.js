module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // 테스트 타임아웃 증가
  testTimeout: 30000,

  // 커버리지 설정
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/src/test/",
    "/src/types/",
  ],

  // 테스트 파일 패턴
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],

  // 변환 설정
  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  // 모듈 경로 매핑
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 글로벌 설정
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },

  // 테스트 실행 순서
  maxWorkers: 1, // 통합 테스트를 위해 순차 실행

  // 에러 출력 상세화
  verbose: true,
};
