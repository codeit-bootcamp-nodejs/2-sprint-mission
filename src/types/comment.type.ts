export interface CommentParamType {
  userId: number | null;
  relationId: number;
  content: string;
  relationType?: 'articles' | 'products';
}

export interface CommentResponseType {
  id: number;
  content: string;
  userId: number | null;
  relationId: number;
  createdAt: Date;
  updatedAt: Date;
}