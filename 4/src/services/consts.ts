import { Prisma } from "../../generated/prisma";

type OrderMapping<T extends string> = Record<T, Prisma.ProductOrderByWithRelationInput>;

const productOrderBySelector: OrderMapping<ProductOrderByKey> = {
    recent: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    highestprice: { price: "desc" },
    lowestprice: { price: "asc" },
};

const articleOrderBySelector: OrderMapping<ArticleOrderByKey> = {
    recent: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
};

const commentOrderBySelector: OrderMapping<CommentOrderByKey> = {
    recent: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
};

export {
    productOrderBySelector,
    articleOrderBySelector,
    commentOrderBySelector
}