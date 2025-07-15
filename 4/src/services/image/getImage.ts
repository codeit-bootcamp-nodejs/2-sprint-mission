import db from "../../model/prisma";
import { createEncryptor } from 'simple-encryptor';
import { ENCRYPT_KEY } from '../../lib/staticConsts';
import base64url from 'base64url';

const getImage = async function(
    encodedEncryptedString: string
){

    const encodedEncryptedFilePath = await db.image.findUniqueOrThrow({
        where: {
            path: encodedEncryptedString
        }
    });

    const encryptor = createEncryptor(ENCRYPT_KEY);


    const encryptedFilePath = base64url.decode(encodedEncryptedFilePath.path);

    return encryptor.decrypt(encryptedFilePath);
};

export default getImage;