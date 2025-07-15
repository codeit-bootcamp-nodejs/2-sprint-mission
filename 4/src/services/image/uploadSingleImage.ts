import db from '../../model/prisma';
import { createEncryptor } from 'simple-encryptor';
import { ENCRYPT_KEY } from '../../lib/staticConsts';
import base64url from 'base64url';

const uploadSingleImage = async function (
    userId: string,
    file: MulterFile
) {
    return db.$transaction(async (tx) => {

        const encryptor = createEncryptor(ENCRYPT_KEY);

        const {
            mimetype,
            originalname,
            filename,
            path
        } = file;

        const createdFiles = await tx.image.create({
            data: {
                id: crypto.randomUUID(),
                mimetype,
                originalname,
                filename,
                path:base64url.encode(encryptor.encrypt(path)),
                userId
            }
        })

        return createdFiles;
    });
};

export default uploadSingleImage;