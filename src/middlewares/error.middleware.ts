import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    const statusCode = (err as any).status || 500;
    const message = (err as any).message || 'Internal Server Error';

    switch (statusCode) {
        case 400:
            res.status(400).json({ error: message });
            break;
        case 401:
            res.status(401).json({ error: message });
            break;
        case 403:
            res.status(403).json({ error: message });
            break;
        case 404:
            res.status(404).json({ error: message });
            break;
        default:
            res.status(statusCode).json({ error: message });
            break;
    }
};

export default errorHandler;
