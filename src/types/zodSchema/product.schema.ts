import {z} from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, "상품명을 입력해주세요"),
  description: z.string().min(1, "상품 설명을 입력해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url("이미지 URL 형식이 올바르지 않습니다").optional(),
});

export const updateProductSchema = createProductSchema.partial();