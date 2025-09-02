module.exports = {
  apps: [
    {
      name: "my-app",
      script: "dist/src/server.js",
      instances: 1, // 필요 시 "max"
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      out_file: "/home/ec2-user/logs/out.log",
      error_file: "/home/ec2-user/logs/error.log",
      merge_logs: true,
      max_memory_restart: "300M",
    },
  ],
};
