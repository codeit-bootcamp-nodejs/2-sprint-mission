export type createProduct = {
  userId: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface CreateOrUpdateProduct {
  name: string; 
  description: string; 
  price: number;
  tags: string[]
};
