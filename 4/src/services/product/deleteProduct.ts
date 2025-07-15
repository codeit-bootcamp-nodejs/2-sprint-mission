import { devDebug } from '../../lib/debugs';
import db from '../../model/prisma';

const deleteProduct = async function (
    userId: string,
    productId: string
) {
    return db.$transaction(async (tx) => {

        // 더 좋은 방법이 있는가?
        const commentToProduct = await tx.rootCommentToProduct.findMany({
            where: { productId }
        });

        const deletedProduct = await tx.product.delete({
            where: {
                id:productId,
                userId
            },
            include: {
                tags: true
            }
        });

        const rootCommentIds = commentToProduct.map(obj => obj.commentId);

        await tx.comment.deleteMany({
            where:{
                id: {in: rootCommentIds}
            }
        });

        // tag 삭제
        const deletedTags = [];
        devDebug("deletedProduct.tags", deletedProduct.tags);
        for (const productTagObj of deletedProduct.tags) {
            // productTag에 태그가 남아 있으면, 삭제하지 말고 없어야 삭제할 수 있게 한다.
            const tagId = productTagObj.tagId;
            const productTagCount = await tx.productTag.count({
                where: {
                    tagId
                }
            });

            devDebug("productTagCount", productTagCount);

            if (productTagCount === 0) {
                const deletedTag = await tx.tag.delete({
                    where: { id: productTagObj.tagId }
                });

                deletedTags.push(deletedTag);
            }
        }

        return { deletedProduct, deletedTags };
    });
};

export default deleteProduct;