import { z } from 'zod';

// 게시글 생성 DTO
export const CreateArticleDto = z.object({
  title: z.string().min(1, '제목을 입력하세요.'),
  content: z.string().min(1, '내용을 입력하세요.'),
  imageUrl: z.string().url('유효한 이미지 URL을 입력하세요.').optional().or(z.literal('')),
});

// 게시글 수정 DTO
export const UpdateArticleDto = z.object({
  title: z.string().min(1, '제목을 입력하세요.').optional(),
  content: z.string().min(1, '내용을 입력하세요.').optional(),
  imageUrl: z.string().url('유효한 이미지 URL을 입력하세요.').optional().or(z.literal('')),
});

// 타입 추론
export type CreateArticleInput = z.infer<typeof CreateArticleDto>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleDto>;