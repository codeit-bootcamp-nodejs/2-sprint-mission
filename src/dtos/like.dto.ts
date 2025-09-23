export interface LikeDto {
  userId: number | null;
  relationId: number;
  relationType: 'articles' | 'products';
}
