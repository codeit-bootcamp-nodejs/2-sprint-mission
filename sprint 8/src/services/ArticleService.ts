// src/services/ArticleService.ts
import axios, { AxiosError } from 'axios';
import { API_HOST } from '../constant/constant';

/** 공용 axios 인스턴스 */
const api = axios.create({
  baseURL: API_HOST,
  timeout: 10_000,
});

/** 서버에서 내려오는 게시글 타입 */
export interface Article {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** 에러 페이로드 */
interface ErrorPayload {
  message?: string;
  [key: string]: unknown;
}

/** AxiosError 타입가드 */
function isAxiosError(error: unknown): error is AxiosError<ErrorPayload> {
  return axios.isAxiosError(error);
}

/** 에러 메시지 통합 */
function getErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as ErrorPayload;
    return `[StatusCode ${error.response.status}] ${data.message ?? ''}`;
  }
  return error instanceof Error ? error.message : String(error);
}

/** pageSize 안전 범위 */
function clampPageSize(size: number, min = 1, max = 100): number {
  if (!Number.isFinite(size)) return 20;
  return Math.min(Math.max(size, min), max);
}

/** 게시글 목록 조회 */
export async function getArticleList(
  page: number,
  pageSize: number,
  keyword: string
): Promise<Article[]> {
  try {
    const params = {
      page: Math.max(1, Math.floor(page) || 1),
      pageSize: clampPageSize(pageSize),
      ...(keyword ? { keyword } : {}), // 빈 키워드는 전송 생략
    };
    const { data } = await api.get<Article[]>('/articles', { params });
    return data;
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}

/** 게시글 단건 조회 */
export async function getArticle(articleId: number): Promise<Article> {
  try {
    const { data } = await api.get<Article>(`/articles/${articleId}`);
    return data;
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}

/** 게시글 생성 */
export async function createArticle(
  title: string,
  content: string,
  image?: string
): Promise<Article> {
  try {
    // image가 undefined면 필드 생략(서버 검증 충돌 방지)
    const payload = { title, content, ...(image ? { image } : {}) };
    const { data } = await api.post<Article>('/articles', payload);
    return data;
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}

/** 게시글 수정 */
export async function patchArticle(
  articleId: number,
  title: string,
  content: string,
  image?: string
): Promise<Article> {
  try {
    const payload = { title, content, ...(image ? { image } : {}) };
    const { data } = await api.patch<Article>(`/articles/${articleId}`, payload);
    return data;
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}

/** 게시글 삭제 */
export async function deleteArticle(articleId: number): Promise<void> {
  try {
    await api.delete<void>(`/articles/${articleId}`);
  } catch (error) {
    const msg = getErrorMessage(error);
    console.error(msg);
    throw new Error(msg);
  }
}
