//게시글 생성, 수정 요청 등
//게시글 생성 요청
export interface CreateArticleDTO {
    title: string;
    content: string;
    image?: string;
}
// 게시글 목록 조회
export interface listArticleDTO {
    title?: string;
    content?: string;
    image?: string;
}
// 게시글 상세 조회
export interface listArticleDetailDTO {
    title: string;
    content: string;
    image?: string;
    comments: ArticleCommentDTO[];
    createdAt: Date;
}
export interface ArticleCommentDTO {
  id: number;
  content: string;
  authorName: string;
  createdAt: Date;
}

