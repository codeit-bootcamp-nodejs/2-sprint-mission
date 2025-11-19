import os from "os";
import process from "process";

export const getIp = (req) => req.ip || "unknown";
export const getUrl = (req) => req.url || "unknown";
export const getMethod = (req) => req.method || "unknown";

export const getServerInfo = () => ({
    node: process.version,
    platform: os.platform(),
    arch: os.arch(),
    cpuCount: os.cpus().length,
});

export const getMemoryInfo = () => {
    const memory = process.memoryUsage();
    return {
        rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    };
};

export const getEnvInfo = () => ({
    nodeEnv: process.env.NODE_ENV || "development",
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3000,
});

export const getRuntimeInfo = () => ({
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
});
