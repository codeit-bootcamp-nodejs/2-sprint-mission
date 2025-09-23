module.exports = {
  apps: [
    {
      name: "panda-market",
      script: "./dist/app.js",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
