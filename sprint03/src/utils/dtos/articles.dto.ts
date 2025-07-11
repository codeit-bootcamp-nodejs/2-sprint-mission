import { object, string } from "superstruct";

const CreateDto = object({
  title: string(),
  content: string(),
});

interface ArticleCreateDto {
  title: string;
  content: string;
}

interface ArticleUpdateDto {
  title?: string;
  content?: string;
}

interface GetArticlessQuery {
  page?: number | string;
  pageSize?: number | string;
  sort?: "recent" | "oldest";
  search?: string;
}

export { CreateDto, ArticleCreateDto, ArticleUpdateDto, GetArticlessQuery };
