// 상품 생성
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string;
}

// 상품 수정
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  imageUrl?: string;
}

// 상품 응답 DTO
export interface ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  tags?: string[];
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;

  likeCount: number;
  isLiked: boolean;
}
