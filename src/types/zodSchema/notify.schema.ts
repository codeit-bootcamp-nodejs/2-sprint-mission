import { z } from "zod";

export const NotifyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  isRead: z.enum(["true", "false"]).optional(), // 존재하면 문자열 true/false
});

export const MarkReadBodySchema = z
  .object({
    ids: z.array(z.number().int().positive()).min(1),
    all: z.boolean().optional(),
  })
  .refine((v) => v.all === true || (v.ids && v.ids.length > 0), {
    message: "ids 또는 all 중 하나는 반드시 필요합니다.",
  });
