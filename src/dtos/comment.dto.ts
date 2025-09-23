import { z } from 'zod';

// 댓글 생성 DTO
export const CreateCommentDto = z.object({
  content: z.string().min(1, '댓글 내용을 입력하세요.'),
});

// 댓글 수정 DTO
export const UpdateCommentDto = z.object({
  content: z.string().min(1, '댓글 내용을 입력하세요.'),
});

// 타입 추론
export type CreateCommentInput = z.infer<typeof CreateCommentDto>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentDto>;
