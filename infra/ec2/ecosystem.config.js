module.exports = {
  apps: [
    {
      name: "pandamarket",                // 프로세스 이름
      script: "npm",                      // 실행할 명령어
      args: "run start",                  // 인자로 붙일 명령어 (npm run start)
      cwd: "/home/ubuntu/2-sprint-mission", // 앱 실행 경로
      interpreter: "/bin/bash",           // npm 실행 시 bash 사용
      env: {
        NODE_ENV: "production",           // 환경 변수 (개발용이면 development)
        PORT: 3000
      },
      instances: 1,                       // 인스턴스 개수 (1 = 싱글, "max" = CPU 코어만큼)
      autorestart: true,                  // 프로세스 죽으면 자동 재시작
      watch: false,                       // 코드 변경 시 자동 재시작 (개발용 true 가능)
      max_memory_restart: "500M"          // 메모리 초과 시 재시작
    }
  ]
}