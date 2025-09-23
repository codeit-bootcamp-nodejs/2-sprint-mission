import { z } from 'zod';

// 상품 생성 DTO
export const CreateProductDto = z.object({
  name: z.string().min(1, '상품명을 입력하세요.'),
  description: z.string().min(1, '상품 설명을 입력하세요.'),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val) : val),
    z.number({ invalid_type_error: '숫자여야 합니다.' }).min(0, '가격은 0원 이상이어야 합니다.')
  ),
  tags: z.array(z.string()).min(1, '태그를 하나 이상 입력하세요.'),
  imageUrl: z.string().optional(),
});

// 상품 수정 DTO
export const UpdateProductDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z
    .union([
      z.number(),
      z.string().transform((val) => parseInt(val)),
    ])
    .optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
});

// 타입 추출
export type CreateProductInput = z.infer<typeof CreateProductDto>;
export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
