import axios, { AxiosError } from 'axios';
import { API_HOST } from '../constant/constant';

/** 공용 axios 인스턴스 (기본 URL/타임아웃 설정) */
const api = axios.create({
  baseURL: API_HOST,
  timeout: 10_000,
});

/** 서버가 반환하는 상품 타입 (필요 시 확장) */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  manufacturer?: string;
  tags: string[];
  images: string[];
  favoriteCount?: number;
}

/** 에러 응답 페이로드 형태 */
interface ErrorPayload {
  message?: string;
  [key: string]: unknown;
}

/** AxiosError 타입 가드 */
function isAxiosError(error: unknown): error is AxiosError<ErrorPayload> {
  return axios.isAxiosError(error);
}

/** 에러 메시지 통합 생성 */
function getErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as ErrorPayload;
    return `[StatusCode ${error.response.status}] ${data.message ?? ''}`;
  }
  return error instanceof Error ? error.message : String(error);
}

/** 페이지 사이즈 클램프 */
function clampPageSize(size: number, min = 1, max = 100): number {
  if (!Number.isFinite(size)) return 20;
  return Math.min(Math.max(size, min), max);
}

/** 상품 목록 조회
 * @throws Error 서버/네트워크 에러 시
 */
export async function getProductList(
  page: number,
  pageSize: number,
  keyword: string
): Promise<Product[]> {
  try {
    const params = {
      page: Math.max(1, Math.floor(page) || 1),
      pageSize: clampPageSize(pageSize),
      // 빈 문자열은 쿼리에서 생략(불필요한 필터 방지)
      ...(keyword ? { keyword } : {}),
    };
    const { data } = await api.get<Product[]>('/products', { params });
    return data;
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}

/** 상품 단건 조회
 * @throws Error
 */
export async function getProduct(productId: number): Promise<Product> {
  try {
    const { data } = await api.get<Product>(`/products/${productId}`);
    return data;
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}

/** 상품 생성
 * - manufacturer가 undefined이면 필드 자체를 보내지 않음(서버 검증 충돌 방지)
 * @throws Error
 */
export async function createProduct(
  name: string,
  description: string,
  price: number,
  manufacturer: string | undefined,
  tags: string[],
  images: string[]
): Promise<Product> {
  try {
    const payload = {
      name,
      description,
      price,
      tags,
      images,
      ...(manufacturer ? { manufacturer } : {}),
    };
    const { data } = await api.post<Product>('/products', payload);
    return data;
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}

/** 상품 수정(PATCH)
 * - 부분 업데이트 정책일 경우 서버 스펙에 맞춰 필드만 전송
 * @throws Error
 */
export async function patchProduct(
  productId: number,
  name: string,
  description: string,
  price: number,
  tags: string[],
  images: string[]
): Promise<Product> {
  try {
    const payload = { name, description, price, tags, images };
    const { data } = await api.patch<Product>(`/products/${productId}`, payload);
    return data;
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}

/** 상품 삭제
 * @throws Error
 */
export async function deleteProduct(productId: number): Promise<void> {
  try {
    await api.delete<void>(`/products/${productId}`);
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}
