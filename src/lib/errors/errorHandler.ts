import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './BadRequestError';
import { ForbiddenError } from './ForbiddenError';
import { NotFoundError } from './NotFoundError';
import { UnauthorizedError } from './UnauthorizedError';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err instanceof BadRequestError) {
        return res.status(400).json({ message: err.message });
    }
    if (err instanceof UnauthorizedError) {
        return res.status(401).json({ message: err.message });
    }
    if (err instanceof ForbiddenError) {
        return res.status(403).json({ message: err.message });
    }
    if (err instanceof NotFoundError) {
        return res.status(404).json({ message: err.message });
    }

    // 위에 해당 안 되면 500
    res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
}
