import db from "../../model/prisma";

const imageDelete = async function(
    userId: string,
    encryptedString: string
){
    const deletedImage = await db.image.delete({
        where: {
            userId,
            path: encryptedString
        }
    });

    return deletedImage;
};

export default imageDelete;