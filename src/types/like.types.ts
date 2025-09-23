export interface LikeResponseType {
  id: number;
  userId: number | null;
  articleId: number | null;
  productId: number | null;
}

export interface LikeParams {
  userId: number | null;
  relationId: number;
  relationType: 'articles' | 'products';
}
