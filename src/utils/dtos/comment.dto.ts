// 상품 댓글 생성 : URL에서 productId를 받으므로 DTO에서는 content만 작성
export interface CreateProductCommentDto {
  content: string;
}

// 상품 댓글 수정
export interface UpdateProductCommentDto {
  content: string;
}

// 게시글 댓글 생성
export interface CreateArticleCommentDto {
  content: string;
}

// 게시글 댓글 수정
export interface UpdateArticleCommentDto {
  content: string;
}

// 상품 댓글 응답 DTO
export interface ProductCommentResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  userId: number;
}

// 게시글 댓글 응답 DTO
export interface ArticleCommentResponseDto {
  id: number
  content: string
  createdAt: Date
  updatedAt: Date
  articleId: number
  userId: number
}