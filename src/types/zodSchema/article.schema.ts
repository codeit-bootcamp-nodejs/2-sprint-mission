import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  content: z.string().min(1, "내용은 필수입니다"),
});

export const updateArticleSchema = createArticleSchema.partial(); 
