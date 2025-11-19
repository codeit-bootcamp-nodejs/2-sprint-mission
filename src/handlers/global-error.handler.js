import {
    isErrorInstanceOfHttp,
    isErrorInstanceOfNode,
} from '../utils/error.util.js';
import { getIp, getMethod, getUrl } from '../utils/from.util.js';

export const globalErrorHandler = async (error, req, res, _next) => {
    let status = 500;
    let message = '서버 내부 오류가 발생했습니다.';

    if (isErrorInstanceOfHttp(error)) {
        status = error.status;
        message = error.message;
    } else if (isErrorInstanceOfNode(error)) {
        status = 500;
        message = error.message;
    }

    const log = {
        ip: getIp(req),
        method: getMethod(req),
        url: getUrl(req),
        status: String(status),
        createdAt: new Date(),
    };

    console.error(log);

    const response = {
        message,
    };

    res.status(status).json(response);
};