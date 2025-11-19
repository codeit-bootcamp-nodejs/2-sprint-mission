export class HttpError extends Error {
    status;
    code;

    constructor(status, code, message) {
        super(`[${code}] ${message}`);
        this.status = status;
        this.code = code;
    }
}

export class BadRequestError extends HttpError {
    constructor(message = '요청 형식이 올바르지 않습니다.') {
        super(400, 'BAD_REQUEST', message);
    }
}

export class NotFoundError extends HttpError {
    constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
        super(404, 'NOT_FOUND', message);
    }
}

export class InternalServerError extends HttpError {
    constructor(message = '서버 내부 오류가 발생했습니다.') {
        super(500, 'INTERNAL_SERVER_ERROR', message);
    }
}
