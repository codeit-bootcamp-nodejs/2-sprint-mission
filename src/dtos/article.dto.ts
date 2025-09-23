import { object, size, string } from 'superstruct';

export var CreateArticleDtoStruct = object({
  title: size(string(), 1, 30),
  content: size(string(), 1, 100)
});

export interface CreateArticleDto {
  title: string;
  content: string;
}

export type UpdateArticleDto = Partial<CreateArticleDto>;

export interface ArticleListQueryDto {
  offset?: number;
  limit?: number;
  order?: 'recent' | 'oldest';
  search?: string;
}
