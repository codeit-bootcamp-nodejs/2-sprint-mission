import db from '../../model/prisma';

const createProduct = async function (
    productUserId: string, 
    name: string, 
    description: string = "", 
    price: number, 
    tagNames?: { name: string }[]
) {
    return db.$transaction(async (tx) => {
        const productId = crypto.randomUUID();
        const createdProduct = await db.product.create({
            data: {
                id: productId,
                name,
                description,
                price,
                userId: productUserId,
                ...((tagNames !== undefined && tagNames.length !== 0) && {
                    tags: {
                        create: tagNames.map(tagNameObj => ({
                            id: crypto.randomUUID(),
                            tag: {
                                connectOrCreate: {
                                    where: { name: tagNameObj.name },
                                    create: {
                                        id: crypto.randomUUID(),
                                        name: tagNameObj.name
                                    }
                                }
                            }
                        }))
                    }
                })
            },

            select: {
                id: true,
                tags: {
                    select: {
                        tag: true
                    }
                }
            },

            // include: {
            //     tags: {
            //         include: {
            //             tag: true
            //         }
            //     }
            // }
        });

        return createdProduct;
    });
};

export default createProduct;