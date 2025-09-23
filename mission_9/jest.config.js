export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }], // TypeScript + ESM 지원
  },
  extensionsToTreatAsEsm: [".ts"], // TS를 ESM으로 처리
}