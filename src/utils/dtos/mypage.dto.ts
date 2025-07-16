// 내 정보 조회
export interface MyPageResponseDto {
  id: number;
  email: string;
  nickname: string;
  image?: string | null;
  createdAt: Date;
}

// 내 정보 수정
export interface UpdateMyPageDto {
  nickname: string;
  image?: string | null;
}

// 비밀번호 변경
export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// 내가 등록한 상품 목록
export interface MyProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  createdAt: Date;
}

// 내가 작성한 게시글 목록
export interface MyArticleDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

// 내가 작성한 댓글(상품) 목록
export interface MyProductCommentDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  userId: number;
}

// 내가 작성한 댓글(게시글) 목록
export interface MyArticleCommentDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  articleId: number;
  userId: number;
}

export interface MyCommentListResponseDto {
  productComments: MyProductCommentDto[];
  articleComments: MyArticleCommentDto[];
}

// 좋아요 한 상품 목록
export interface MyLikedProductDto {
  id: number;
  name: string;
  description: string
  price: number
  imageUrl?: string | null;
  createdAt: Date;
}

// 좋아요 한 게시글 목록
export interface MyLikedArticleDto {
  id: number;
  title: string;
  content: string
  createdAt: Date;
}