import db from '../../model/prisma';
import { createEncryptor } from 'simple-encryptor';
import { ENCRYPT_KEY } from '../../lib/staticConsts';
import base64url from 'base64url';

const uploadImages = async function(
    userId: string,
    files: MulterFile[]
){
    return db.$transaction(async (tx) => {
        const createdFiles = [];
        const encryptor = createEncryptor(ENCRYPT_KEY);
        
        for(const file of files){
            const {
                mimetype,
                originalname,
                filename,
                path
            } = file;

            createdFiles.push(
                {
                    [filename]: await tx.image.create({
                        data:{
                            id:crypto.randomUUID(),
                            mimetype,
                            originalname,
                            filename,
                            path:base64url.encode(encryptor.encrypt(path)),
                            userId
                        }
                    })
                }
            );
        }

        return createdFiles;
    });
};

export default uploadImages;