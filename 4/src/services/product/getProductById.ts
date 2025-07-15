import db from "../../model/prisma";

const getProductById = async function(
    productId: string
){
    const productById = await db.product.findUniqueOrThrow({
        where: { id:productId },
        select: {
            id: true,
            name:true,
            description:true,
            price:true,
            tags:{
                select:{
                    tag:true
                }
            },
            // rootComments:{
            //     select:{
            //         comment: true
            //     }
            // }
        }
    });

    return productById;
};

export default getProductById;