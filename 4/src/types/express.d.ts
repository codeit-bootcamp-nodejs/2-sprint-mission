import Express from 'express';
import { Multer } from "multer";

declare global {
    namespace Express {
        interface User {
            id: string;
        }

        interface Request {
            user?: User;
            refreshToken?: string;
            files?: MulterFile[];
            file?: MulterFile;
        }

    }

    type addrType = AddressInfo | string | null;
    type portType = string | number | boolean;
}

// | {[fieldname: string]: MulterFile[]}