import fetch, { Response } from 'node-fetch';
import { API_HOST } from '../constant/constant';

// 게시글 데이터 타입
export interface Article {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  // 필요하면 추가
}

// 에러 응답 타입
interface ErrorPayload {
  message?: string;
  [key: string]: unknown;
}

// fetch 표준화 타입
interface NormalizedFetchResult<T = unknown, E = ErrorPayload> {
  isSuccessful: boolean;
  status: number;
  payload: T | E | null; // null 허용
}

/** 타입가드: payload가 message 속성을 갖는지 확인 */
function hasMessage(payload: unknown): payload is { message: string } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof (payload as { message?: unknown }).message === 'string'
  );
}

/** 게시글 목록 조회 */
export function getArticleList(
  page: number,
  pageSize: number,
  keyword: string
): Promise<Article[]> {
  return fetch(`${API_HOST}/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
    .then((fetchResult: Response) => normalizeFetchResult<Article[]>(fetchResult))
    .then(handleNormalizedFetchResult)
    .catch(handleError);
}

/** 게시글 단건 조회 */
export function getArticle(articleId: number): Promise<Article> {
  return fetch(`${API_HOST}/articles/${articleId}`)
    .then((fetchResult: Response) => normalizeFetchResult<Article>(fetchResult))
    .then(handleNormalizedFetchResult)
    .catch(handleError);
}

/** 게시글 생성 */
export function createArticle(
  title: string,
  content: string,
  image?: string
): Promise<Article> {
  return fetch(`${API_HOST}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, image }),
  })
    .then((fetchResult: Response) => normalizeFetchResult<Article>(fetchResult))
    .then(handleNormalizedFetchResult)
    .catch(handleError);
}

/** 게시글 수정 */
export function patchArticle(
  articleId: number,
  title: string,
  content: string,
  image?: string
): Promise<Article> {
  return fetch(`${API_HOST}/articles/${articleId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, image }),
  })
    .then((fetchResult: Response) => normalizeFetchResult<Article>(fetchResult))
    .then(handleNormalizedFetchResult)
    .catch(handleError);
}

/** 게시글 삭제 */
export function deleteArticle(articleId: number): Promise<void> {
  return fetch(`${API_HOST}/articles/${articleId}`, {
    method: 'DELETE',
  })
    .then((fetchResult: Response) => normalizeFetchResult<void>(fetchResult))
    .then(handleNormalizedFetchResult)
    .catch(handleError);
}

/** fetch 결과 표준화 */
function normalizeFetchResult<T>(response: Response): Promise<NormalizedFetchResult<T>> {
  if (response.status === 204) {
    // payload: null로 설정 (undefined 금지)
    return Promise.resolve({ isSuccessful: response.ok, status: response.status, payload: null });
  }
  return response
    .json()
    .then((payload) => ({
      isSuccessful: response.ok,
      status: response.status,
      payload: payload as T,
    }));
}

/** 표준화된 fetch 결과 처리 */
function handleNormalizedFetchResult<T, E = ErrorPayload>(fetchResult: NormalizedFetchResult<T, E>): T {
  if (!fetchResult.isSuccessful) {
    let message = '';
    if (hasMessage(fetchResult.payload)) {
      message = fetchResult.payload.message;
    }
    const errorMessage = `[StatusCode ${fetchResult.status}] ${message}`;
    throw new Error(errorMessage);
  }
  // payload가 null이면 void 타입 Promise를 기대 (삭제 등)
  return fetchResult.payload as T;
}

/** 에러 핸들링 */
function handleError(error: unknown): never {
  if (error instanceof Error) {
    console.error(error.message);
    throw error;
  } else {
    console.error(error);
    throw new Error('Unknown error occurred');
  }
}
