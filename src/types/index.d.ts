import { User } from '../config/db.ts';

declare global {
    namespace Express {
        interface User {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            nickname: string;
            image: string | null;
            password: string;
            refreshToken: string | null;
        }

        interface Request {
            user?: User;
        }
    }
}

export {};
