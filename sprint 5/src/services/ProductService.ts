import axios, { AxiosError } from 'axios';
import { API_HOST } from '../constant/constant';

// 상품 타입 정의 (필요에 따라 확장)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  manufacturer?: string;
  tags: string[];
  images: string[];
  favoriteCount?: number;
  // createdAt, updatedAt 등 필요시 추가
}

// 에러 응답 타입
interface ErrorPayload {
  message?: string;
  [key: string]: unknown;
}

// 에러 타입가드
function isAxiosError(error: unknown): error is AxiosError<ErrorPayload> {
  return (error as AxiosError).isAxiosError === true;
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as ErrorPayload;
    return `[StatusCode ${error.response.status}] ${data.message ?? ''}`;
  }
  return (error instanceof Error) ? error.message : String(error);
}

/** 상품 목록 조회 */
export async function getProductList(
  page: number,
  pageSize: number,
  keyword: string
): Promise<Product[]> {
  try {
    const response = await axios.get<Product[]>(`${API_HOST}/products`, {
      params: { page, pageSize, keyword },
    });
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

/** 상품 단건 조회 */
export async function getProduct(productId: number): Promise<Product> {
  try {
    const response = await axios.get<Product>(`${API_HOST}/products/${productId}`);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

/** 상품 생성 */
export async function createProduct(
  name: string,
  description: string,
  price: number,
  manufacturer: string | undefined,
  tags: string[],
  images: string[]
): Promise<Product> {
  try {
    const response = await axios.post<Product>(`${API_HOST}/products`, {
      name,
      description,
      price,
      manufacturer,
      tags,
      images,
    });
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

/** 상품 수정 */
export async function patchProduct(
  productId: number,
  name: string,
  description: string,
  price: number,
  tags: string[],
  images: string[]
): Promise<Product> {
  try {
    const response = await axios.patch<Product>(`${API_HOST}/products/${productId}`, {
      name,
      description,
      price,
      tags,
      images,
    });
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

/** 상품 삭제 */
export async function deleteProduct(productId: number): Promise<void> {
  try {
    await axios.delete<void>(`${API_HOST}/products/${productId}`);
    // 삭제 후 반환값이 없으면 아무것도 return 하지 않아도 됨
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}
