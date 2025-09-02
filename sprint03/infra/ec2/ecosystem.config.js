module.exports = {
  apps: [
    {
      name: "panda-market",
      script: "npm",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "300M",
    },
  ],
};