import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  testMatch: [
    '**/?(*.)+(spec|test).ts',      
    '**/src/tests/**/*.test.ts'     
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js}',
    '!src/server.ts',
    '!src/socket.ts',
    '!src/**/*.d.ts',
    "!src/**/dto.ts",
    "!src/**/index.ts",
    "!src/**/types.ts"
  ],
};

export default config;