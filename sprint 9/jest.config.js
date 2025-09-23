/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest', 
  testEnvironment: 'node', 
  rootDir: './src', 
  testMatch: ['**/*.test.ts'], 
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '../coverage', 
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/node_modules/**',
    '!tests/**',
    '!**/dist/**',
  ],
  clearMocks: true,
};