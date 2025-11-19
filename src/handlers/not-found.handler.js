import { NotFoundError } from '../types/error.type.js';

export const notFoundHandler = (_req, _res, next) => {
    const message = `요청된 페이지를 찾을 수 없습니다. :(`;

    next(new NotFoundError(message));
};