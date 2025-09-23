export interface ArticlePagination {
  where: object;
  order: 'recent' | 'oldest';
  skip: number;
  take: number;
}

export interface ArticleWithUser {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  userId: number | null;
  user?: {
    id: number;
    nickname: string;
    image?: string | null;
  } | null;
  _count: {
    isLiked: number;
  };
}

export interface ArticleResponseType {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  nickname: string| undefined;
  likeCount: number;
  isLiked: boolean;
}