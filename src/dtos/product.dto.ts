import { object, size, string, number, array, optional } from 'superstruct';

export var CreateProductDtoStruct = object({
  name: size(string(), 1, 30),
  description: size(string(), 1, 100),
  price: number(),
  tags: array(string()),
  imageUrl: optional(string()),
})

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string;
} 

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductListQueryDto {
  offset?: number;
  limit?: number;
  order?: 'recent' | 'oldest';
  search?: string;
}