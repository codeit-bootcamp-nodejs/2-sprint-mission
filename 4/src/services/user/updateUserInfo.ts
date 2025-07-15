import db from "../../model/prisma";

const updateUserInfo = async function(
    userId: string,
    nickname: string,
    email:string
){
    const updatedUserInfo = await db.user.update({
        where:{
            id:userId
        },

        data:{
            nickname,
            email
        },

        select:{
            nickname:true,
            email: true
        }
    });

    return updatedUserInfo;
};

export default updateUserInfo;