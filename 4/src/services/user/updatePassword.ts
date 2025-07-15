import db from "../../model/prisma";
import bcrypt from "bcrypt";

const updatePassword = async function(
    userId: string,
    newPassword: string
){

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await db.user.update({
        where:{
            id: userId
        },

        data:{
            password: hashedPassword
        }
    });

    return {message: "success get new password!"};
};

export default updatePassword;