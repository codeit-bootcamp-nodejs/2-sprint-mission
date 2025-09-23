export interface ProductPagination {
  where: object;
  order: 'recent' | 'oldest';
  skip: number;
  take: number;
}

export interface ProductWithUser {
  userId: number | null;
  id: number;
  name: string;
  description: string | null;
  price: number;
  tags: string[];
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    nickname: string;
    image: string | null;
  } | null;
  _count: {
    isLiked: number;
  };
}

export interface ProductResponseType {
  id: number;
  name: string; // title -> name으로 수정
  description: string | null; // content -> description으로 수정  
  price: number; // 추가
  imageUrl: string | null; // 추가
  createdAt: Date;
  nickname: string | undefined;
  likeCount: number;
  isLiked: boolean;
}