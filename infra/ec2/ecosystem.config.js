module.exports = {
  apps: [{
    name: "panda-app",
    script: "src/server.ts",
    interpreter: "/home/ec2-user/2-sprint-mission/node_modules/.bin/ts-node",
    env_production: {
      NODE_ENV: "production",
      "PM2_SERVE_ENV": "production",
      "NODE_PATH": "src",
      "PM2_SERVE_STATIC_OPTIONS": "--from production.env",
      "DATABASE_URL": process.env.DATABASE_URL
    },
  }],
  env: {
    NODE_ENV: "development",
    ...require('dotenv').config().parsed
  }
};




