import {
    getServerInfo,
    getMemoryInfo,
    getEnvInfo,
    getRuntimeInfo,
    getIp,
    getUrl,
    getMethod,
} from "../utils/from.util.js";

export const handleHealthCheck = async (req, res, _next) => {
    const data = {
        status: "ok",
        request: {
            ip: getIp(req),
            url: getUrl(req),
            method: getMethod(req),
        },
        runtime: getRuntimeInfo(),
        server: getServerInfo(),
        memory: getMemoryInfo(),
        env: getEnvInfo(),
    };

    res.status(200).json(data);
};
