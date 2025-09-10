import { object, string, number, array } from "superstruct";

const CreateDto = object({
  name: string(),
  description: string(),
  price: number(),
  tags: array(string()),
});

interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

interface ProductUpdateDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
}
interface GetProductsQuery {
  page?: number | string;
  pageSize?: number | string;
  sort?: "recent" | "oldest";
  search?: string;
}

export { CreateDto, ProductCreateDto, ProductUpdateDto, GetProductsQuery};
