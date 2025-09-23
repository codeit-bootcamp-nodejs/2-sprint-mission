"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ElectronicProduct_1 = require("./models/ElectronicProduct");
const Product_1 = require("./models/Product");
const ProductService = __importStar(require("./services/ProductService"));
const ArticleService = __importStar(require("./services/ArticleService"));
// Product 객체 배열 타입 명시
async function getProductListAndInstantiate() {
    const rawProducts = await ProductService.getProductList(1, 20, '');
    const products = [];
    for (const rawProduct of rawProducts) {
        if (rawProduct.tags.includes('전자제품')) {
            products.push(new ElectronicProduct_1.ElectronicProduct(rawProduct.name, rawProduct.description, rawProduct.price, rawProduct.tags, rawProduct.images, rawProduct.favoriteCount ?? 0, rawProduct.manufacturer ?? ''));
        }
        else {
            products.push(new Product_1.Product(rawProduct.name, rawProduct.description, rawProduct.price, rawProduct.tags, rawProduct.images, rawProduct.favoriteCount ?? 0));
        }
    }
    console.log(products);
}
async function testProductService() {
    const getProductListResponse = await ProductService.getProductList(1, 20, '');
    if (getProductListResponse.length === 0) {
        console.log('No products found');
        return;
    }
    const getProductResponse = await ProductService.getProduct(getProductListResponse[0].id);
    const createProductResponse = await ProductService.createProduct('포토카드', '액자 포함', 10000, undefined, ['소품'], ['https://picsum.photos/200/300']);
    const patchProductResponse = await ProductService.patchProduct(createProductResponse.id, createProductResponse.name, '액자 미포함', 10000, createProductResponse.tags, createProductResponse.images);
    await ProductService.deleteProduct(createProductResponse.id);
    console.log(getProductListResponse);
    console.log(getProductResponse);
    console.log(createProductResponse);
    console.log(patchProductResponse);
    // 삭제 함수는 반환값이 없으므로 별도 출력 X
}
async function testArticleService() {
    const getArticleListResponse = await ArticleService.getArticleList(1, 20, '');
    if (getArticleListResponse.length === 0) {
        console.log('No articles found');
        return;
    }
    const getArticleResponse = await ArticleService.getArticle(getArticleListResponse[0].id);
    const createArticleResponse = await ArticleService.createArticle('안녕하세요', '내용입니다', 'https://picsum.photos/200');
    const patchArticleResponse = await ArticleService.patchArticle(createArticleResponse.id, createArticleResponse.title, '앞으로 잘 부탁드립니다.', createArticleResponse.image);
    await ArticleService.deleteArticle(createArticleResponse.id);
    console.log(getArticleListResponse);
    console.log(getArticleResponse);
    console.log(createArticleResponse);
    console.log(patchArticleResponse);
    // 삭제 함수는 반환값이 없으므로 별도 출력 X
}
async function main() {
    await getProductListAndInstantiate();
    await testProductService();
    await testArticleService();
}
main();
