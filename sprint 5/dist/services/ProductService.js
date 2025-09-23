"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductList = getProductList;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.patchProduct = patchProduct;
exports.deleteProduct = deleteProduct;
const axios_1 = __importDefault(require("axios"));
const constant_1 = require("../constant/constant");
// 에러 타입가드
function isAxiosError(error) {
    return error.isAxiosError === true;
}
function getErrorMessage(error) {
    if (isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
        const data = error.response.data;
        return `[StatusCode ${error.response.status}] ${data.message ?? ''}`;
    }
    return (error instanceof Error) ? error.message : String(error);
}
/** 상품 목록 조회 */
async function getProductList(page, pageSize, keyword) {
    try {
        const response = await axios_1.default.get(`${constant_1.API_HOST}/products`, {
            params: { page, pageSize, keyword },
        });
        return response.data;
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}
/** 상품 단건 조회 */
async function getProduct(productId) {
    try {
        const response = await axios_1.default.get(`${constant_1.API_HOST}/products/${productId}`);
        return response.data;
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}
/** 상품 생성 */
async function createProduct(name, description, price, manufacturer, tags, images) {
    try {
        const response = await axios_1.default.post(`${constant_1.API_HOST}/products`, {
            name,
            description,
            price,
            manufacturer,
            tags,
            images,
        });
        return response.data;
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}
/** 상품 수정 */
async function patchProduct(productId, name, description, price, tags, images) {
    try {
        const response = await axios_1.default.patch(`${constant_1.API_HOST}/products/${productId}`, {
            name,
            description,
            price,
            tags,
            images,
        });
        return response.data;
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}
/** 상품 삭제 */
async function deleteProduct(productId) {
    try {
        await axios_1.default.delete(`${constant_1.API_HOST}/products/${productId}`);
        // 삭제 후 반환값이 없으면 아무것도 return 하지 않아도 됨
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}
