// types/comment.ts

export interface CreateProductComment {
    content: string;
    userId: number;
    productId: number;
}

export interface UpdateProductComment {
    content: string;
    userId: number;
    productId: number;
    commentId: number;
}

export interface CreateArticleComment {
    content: string;
    userId: number;
    articleId: number;
}

export interface UpdateArticleComment {
    content: string;
    userId: number;
    articleId: number;
    commentId: number;
}

export interface ProductCommentQuery {
    limit?: string;
    cursor?: string;
}

export interface ArticleCommentQuery {
    limit?: string;
    cursor?: string;
}
