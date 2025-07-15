import { Prisma } from '../../../generated/prisma';
import db from '../../model/prisma';
import { productOrderBySelector } from '../consts';

const getProductsList = async (
    query: QueryType<ProductOrderByKey>,
    userId?: string
) => {
    
    const offset = query.offset ? Number(query.offset) : 0;
    const limit = query.limit ? Number(query.limit) : 10;
    const orderBy = query.orderBy == null ? productOrderBySelector['recent'] : productOrderBySelector[query.orderBy];

    const nameSearch = query.name;
    const descriptionSearch = query.description;

    const productsList = await db.product.findMany({
        where: {
            ...(userId !== undefined && {
                userId
            }),
            ...(nameSearch !== undefined && {
                name: {
                    contains: nameSearch,
                    mode: Prisma.QueryMode.insensitive
                }
            }),
            ...(descriptionSearch !== undefined && {
                description: { 
                    contains: descriptionSearch, 
                    mode: Prisma.QueryMode.insensitive 
                }
            })
        },

        select: {
            id: true,
            name: true,
            price: true,
            createdAt: true,
            description: true,
            tags:{
                select:{
                    tag: true
                }
            }
        },

        orderBy,

        skip: offset,
        take: limit
    });

    return productsList;
};

export default getProductsList;