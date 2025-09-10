import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

export function validateDto<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToInstance(dtoClass, req.body);
        const errors: ValidationError[] = await validate(dtoInstance);

        if (errors.length > 0) {
            const formattedErrors = errors.flatMap(error =>
                Object.values(error.constraints || {})
            );
            return res.status(400).json({
                message: "Validation failed",
                errors: formattedErrors
            });
        }
        req.body = dtoInstance;
        next();
    };
}