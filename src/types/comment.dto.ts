//댓글 작성, 수정 요청 등
//댓글 생성요청
export interface CreateCommentDTO {
    content: string;
    articleId: string;
}
// 댓글 수정 요청
export interface UpdateCommentDTO {
    id: number;
    content: string;
}
// 댓글 응답
export interface CommentResponseDTO {
    id: number;
    content: string;
    authorName: string;
    createdAt: Date;
}
//내부 타입 (선택) CommentEntity