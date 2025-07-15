// 상품 관련 요청/응답
// 상품 등록 
export interface CreateProductDTO {
    name: string;
    price: number;
    description: string;
    tags: string[];
    images: string[];
}
// 상품 목록 조회
export interface listProductDTO {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    images?: string[];
}
// 상품 상세 조회
export interface listProductDetailDTO {
    name: string;
     description: string;
     price: number;
     tags: string[];
     images: string[];
}
 