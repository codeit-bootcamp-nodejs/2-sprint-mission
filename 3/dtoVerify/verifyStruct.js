const s = require('superstruct');
const isUuid = require('is-uuid');

const Uuidv4 = () => define('Uuid', (v) => isUuid.v4(v));
const NotCreatedAtFuture = () => define('NotCreatedAtFuture', (date) => date < new Date())

const ProductTagsDto = s.object({
    id: s.optional(Uuidv4),
    name: s.string(),
    productId: s.optional(Uuidv4)
});

const ProductDto = s.object({
    id: s.optional(Uuidv4),
    name: s.string(),
    description: s.string(),
    price: s.number(),
    tags: s.size(s.array(ProductTagsDto), 1, 15),
    createdAt: s.optional(NotCreatedAtFuture)
});

const commentsDto = s.object({
    id: s.optional(Uuidv4),
    parentId: s.optional(s.nullable(Uuidv4)),
    replyId: s.optional(s.nullable(Uuidv4)),
    title: s.optional(s.string()),
    content: s.string(),
    isDeleted: s.optional(s.boolean()),
    createdAt: s.optional(NotCreatedAtFuture),
});

const ArticleDto = s.object({
    id: s.optional(Uuidv4),
    title: s.string(),
    content: s.string(),
    createdAt: s.optional(NotCreatedAtFuture),
    comments: s.optional(s.array(commentsDto))
});

module.exports = {
    ProductDto,
    ArticleDto,
    commentsDto
};