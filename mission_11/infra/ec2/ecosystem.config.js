module.exports = {
  apps: [
    {
      name: "my-app",        // PM2에서 관리할 앱 이름
      script: "dist/app.js", // 실행할 파일
      instances: 1,          // 실행할 인스턴스 개수 (0 → CPU 코어 수만큼)
      exec_mode: "fork",     // 실행 모드: fork(단일) / cluster(멀티코어 활용)
      watch: false,          // 코드 변경 시 자동 재시작 여부
      env: {                 // 기본 환경 변수
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {      // production 실행 시 환경 변수
        NODE_ENV: "production",
        PORT: 8080
      }
    }
  ]
};