"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
    constructor(io, productRepository, productLikeRepository, notificationService) {
        this.io = io;
        this.productRepository = productRepository;
        this.productLikeRepository = productLikeRepository;
        this.notificationService = notificationService;
    }
    createProduct(userId, productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const createData = {
                name: productData.name,
                description: productData.description,
                price: productData.price,
                tags: productData.tags,
                user: {
                    connect: { id: userId },
                },
            };
            const newProduct = yield this.productRepository.create(createData);
            return Object.assign({}, newProduct);
        });
    }
    updateProduct(userId, productId, productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }
            if (product.userId !== userId) {
                throw new Error("Unauthorized to update this product");
            }
            const isPriceChanged = productData.price && productData.price !== product.price;
            const productUpdateData = {
                name: productData.name,
                description: productData.description,
                price: productData.price,
                tags: productData.tags,
            };
            const updateProduct = yield this.productRepository.update(productId, productUpdateData);
            if (!updateProduct) {
                throw new Error("Product update failed");
            }
            if (isPriceChanged) {
                const likedUsers = yield this.productLikeRepository.findUsersByProductId(productId);
                console.log(`상품 가격 변경 감지. 좋아요 한 사용자 ${likedUsers.length}명에게 알림 전송.`);
                for (const user of likedUsers) {
                    const notificationMessage = `${updateProduct.name} 상품의 가격이 ${updateProduct.price}원으로 변경되었습니다.`;
                    console.log(`알림 전송 대상: 사용자 ID ${user.id}`);
                    yield this.notificationService.createNotification(user.id, {
                        message: notificationMessage,
                        type: "PRODUCT_PRICE_CHANGE",
                        isRead: false,
                    });
                }
            }
            return Object.assign({}, updateProduct);
        });
    }
    deleteProduct(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }
            if (product.userId !== userId) {
                throw new Error("Unauthorized to delete this product");
            }
            yield this.productRepository.delete(productId);
            return { message: "Product deleted successfully" };
        });
    }
    myProducts(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderBy;
            switch (options.order) {
                case "oldest":
                    orderBy = { createdAt: "asc" };
                    break;
                case "newest":
                default:
                    orderBy = { createdAt: "desc" };
                    break;
            }
            const myProducts = yield this.productRepository.findManyByUserId(userId, {
                skip: options.offset,
                take: options.limit,
                orderBy: orderBy,
            });
            return myProducts.map((product) => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                tags: product.tags,
                likeCount: product.likeCount,
                userId: product.userId,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            }));
        });
    }
    getProductList(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderBy;
            switch (options.order) {
                case "oldest":
                    orderBy = { createdAt: "asc" };
                    break;
                case "newest":
                default:
                    orderBy = { createdAt: "desc" };
                    break;
            }
            const getProductList = yield this.productRepository.findManyProducts({
                skip: options.offset,
                take: options.limit,
                orderBy: orderBy,
            });
            let myLikedProduct = [];
            if (userId) {
                myLikedProduct = yield this.productLikeRepository.findManyByUserId(userId);
            }
            ;
            const likedProductIds = new Set(myLikedProduct.map((like) => like.productId));
            const productsWithLikedStatus = getProductList.map((product) => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                tags: product.tags,
                likeCount: product.likeCount,
                userId: product.userId,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                isLiked: likedProductIds.has(product.id),
            }));
            return productsWithLikedStatus;
        });
    }
    myProductsLiked(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderBy;
            switch (options.order) {
                case "oldest":
                    orderBy = { createdAt: "asc" };
                    break;
                case "newest":
                default:
                    orderBy = { createdAt: "desc" };
                    break;
            }
            const likedProducts = yield this.productLikeRepository.findLikedProductsByUserId(userId, {
                skip: options.offset,
                take: options.limit,
                orderBy: orderBy,
            });
            const productsWithLikedStatus = likedProducts.map((item) => ({
                id: item.product.id,
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                tags: item.product.tags,
                likeCount: item.product.likeCount,
                userId: item.product.userId,
                createdAt: item.product.createdAt,
                updatedAt: item.product.updatedAt,
                isLiked: true,
            }));
            return productsWithLikedStatus;
        });
    }
}
exports.ProductService = ProductService;
