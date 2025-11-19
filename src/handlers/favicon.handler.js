import { NotFoundError } from "../types/error.type.js";

export const faviconHandler = (req, _res, next) => {
    if (req.url === "/favicon.ico") {
        next(new NotFoundError());
    }
    next();
};