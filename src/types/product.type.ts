// 상품 데이터 구조
// 상품 수정
export interface UpdateProductDTO {
     name: string;
     description: string;
     price: number;
     tags: string[];
     images: string[];
}
// 상품 삭제
export interface DeleteProductDTO {
     name: string;
     description: string;
     price: number;
     tags: string[];
     images: string[];
}