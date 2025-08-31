import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }]
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/tests/**/*.(spec|test).ts'],
    roots: ['<rootDir>/tests'],
    setupFiles: ['dotenv/config'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
    coverageThreshold: { global: { lines: 50, branches: 40, functions: 50, statements: 50 } },
    // moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' } // 경로 별칭 쓴다면 추가
};

export default config;
