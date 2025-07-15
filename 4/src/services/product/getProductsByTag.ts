import db from '../../model/prisma';

const getProductsByTag = async function(
    tagName: string
){
    const ProductsByTag = await db.tag.findMany({
        where: { name: tagName },
        select:{
            productTags:{
                select:{
                    product: true
                }
            }
        }
    });

    return ProductsByTag;
};

export default getProductsByTag;