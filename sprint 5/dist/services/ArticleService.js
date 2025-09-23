"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticleList = getArticleList;
exports.getArticle = getArticle;
exports.createArticle = createArticle;
exports.patchArticle = patchArticle;
exports.deleteArticle = deleteArticle;
const node_fetch_1 = __importDefault(require("node-fetch"));
const constant_1 = require("../constant/constant");
/** 타입가드: payload가 message 속성을 갖는지 확인 */
function hasMessage(payload) {
    return (typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof payload.message === 'string');
}
/** 게시글 목록 조회 */
function getArticleList(page, pageSize, keyword) {
    return (0, node_fetch_1.default)(`${constant_1.API_HOST}/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
        .then((fetchResult) => normalizeFetchResult(fetchResult))
        .then(handleNormalizedFetchResult)
        .catch(handleError);
}
/** 게시글 단건 조회 */
function getArticle(articleId) {
    return (0, node_fetch_1.default)(`${constant_1.API_HOST}/articles/${articleId}`)
        .then((fetchResult) => normalizeFetchResult(fetchResult))
        .then(handleNormalizedFetchResult)
        .catch(handleError);
}
/** 게시글 생성 */
function createArticle(title, content, image) {
    return (0, node_fetch_1.default)(`${constant_1.API_HOST}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, image }),
    })
        .then((fetchResult) => normalizeFetchResult(fetchResult))
        .then(handleNormalizedFetchResult)
        .catch(handleError);
}
/** 게시글 수정 */
function patchArticle(articleId, title, content, image) {
    return (0, node_fetch_1.default)(`${constant_1.API_HOST}/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, image }),
    })
        .then((fetchResult) => normalizeFetchResult(fetchResult))
        .then(handleNormalizedFetchResult)
        .catch(handleError);
}
/** 게시글 삭제 */
function deleteArticle(articleId) {
    return (0, node_fetch_1.default)(`${constant_1.API_HOST}/articles/${articleId}`, {
        method: 'DELETE',
    })
        .then((fetchResult) => normalizeFetchResult(fetchResult))
        .then(handleNormalizedFetchResult)
        .catch(handleError);
}
/** fetch 결과 표준화 */
function normalizeFetchResult(response) {
    if (response.status === 204) {
        // payload: null로 설정 (undefined 금지)
        return Promise.resolve({ isSuccessful: response.ok, status: response.status, payload: null });
    }
    return response
        .json()
        .then((payload) => ({
        isSuccessful: response.ok,
        status: response.status,
        payload: payload,
    }));
}
/** 표준화된 fetch 결과 처리 */
function handleNormalizedFetchResult(fetchResult) {
    if (!fetchResult.isSuccessful) {
        let message = '';
        if (hasMessage(fetchResult.payload)) {
            message = fetchResult.payload.message;
        }
        const errorMessage = `[StatusCode ${fetchResult.status}] ${message}`;
        throw new Error(errorMessage);
    }
    // payload가 null이면 void 타입 Promise를 기대 (삭제 등)
    return fetchResult.payload;
}
/** 에러 핸들링 */
function handleError(error) {
    if (error instanceof Error) {
        console.error(error.message);
        throw error;
    }
    else {
        console.error(error);
        throw new Error('Unknown error occurred');
    }
}
