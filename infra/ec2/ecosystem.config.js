module.exports = {
  apps: [
    {
      name: "used-shop",           
      script: "dist/server.js",    
      instances: 1,                
      autorestart: true,          
      watch: false,               
      max_memory_restart: "200M",  
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
