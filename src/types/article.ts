export interface CreateArticle {
    title: string;
    content: string;
}

export interface UpdateArticle {
    id: number;
    data: UpdateArticleData;
}

export interface UpdateArticleData {
    title: string;
    content: string;
}

export interface ArticleQuery {
    skip?: string;
    limit?: string;
    keyword?: string;
}
