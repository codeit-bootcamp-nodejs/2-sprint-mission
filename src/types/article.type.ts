// src/types/article.type.ts
// 게시글 모델 (DB와 일치)
export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 게시글 목록 조회
export type ArticleListQuery = {
  page: number;
  pageSize: number;
  orderBy?: 'recent' | 'old';
  keyword?: string;
};

// 게시글 생성 입력값
export interface CreateArticleInput {
  title: string;
  content: string;
  tags?: string[];
}

// 게시글 수정 입력값
export type UpdateArticleInput = Partial<CreateArticleInput>;
