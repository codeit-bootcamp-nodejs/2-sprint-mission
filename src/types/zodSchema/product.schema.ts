import { z } from "zod";

const safeJsonArray = z.preprocess((val) => {
  if (Array.isArray(val)) return val; // 이미 배열이면 그대로
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return undefined;
    }
  }
  return val;
}, z.array(z.string()).optional());

export const createProductSchema = z.object({
  name: z.string().min(1, "상품명을 입력해주세요"),
  description: z.string().min(1, "상품 설명을 입력해주세요"),
  price: z.coerce.number().min(0, "가격은 0 이상이어야 합니다"),
  tags: safeJsonArray,
  imageUrl: z.string().url("이미지 URL 형식이 올바르지 않습니다").optional(),
});

export const updateProductSchema = createProductSchema.partial();
