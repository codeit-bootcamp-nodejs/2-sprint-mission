const e = require("express");

module.exports = {
  // Jest를 위한 TypeScript 설정
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/middlewares/*.ts', // 미들웨어는 별도로 테스트 가능
  ],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = {
  testMatch: [
    "**/src/tests/**/*.test.js",
    "**/src/tests/**/*.test.ts"
  ],
};