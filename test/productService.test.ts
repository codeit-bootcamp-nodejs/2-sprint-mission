import { ProductLikeRepository } from "../src/repositories/productLikeRepository";
import { ProductRepository } from "../src/repositories/productRepository";
import { NotificationService } from "../src/services/notification";
import { ProductService } from "../src/services/productService";
import { Server as SocketIOServer } from "socket.io";
import { type MockProxy, mock } from "jest-mock-extended";
import { ProductListOptions } from "../src/dtos/products.dto";

jest.mock("../src/repositories/productRepository");
jest.mock("../src/repositories/productLikeRepository");
jest.mock("../src/services/notification");

describe('productService.unit.test', () => {
    let productRepository: MockProxy<ProductRepository>;
    let productLikeRepository: MockProxy<ProductLikeRepository>;
    let notificationService: MockProxy<NotificationService>;
    let io: MockProxy<SocketIOServer>;

    let productService: ProductService;

    const userId = 1;
    const productId = 1;

    beforeEach(() => {
        productRepository = mock<ProductRepository>();
        productLikeRepository = mock<ProductLikeRepository>();
        notificationService = mock<NotificationService>();
        io = mock<SocketIOServer>();

        productService = new ProductService(
            io,
            productRepository,
            productLikeRepository,
            notificationService
        );

        jest.clearAllMocks();
    });
    let productsFromRepo: any[];
    let existingProduct: any;

    describe('product-services', () => {
        beforeEach(() => {
            existingProduct = {
                id: productId,
                name: "아이폰 16",
                description: "신형 아이폰 팝니다.",
                price: 100,
                tags: ["old", "product"],
                userId: userId,
                likeCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            productsFromRepo = [
                {
                    id: 1,
                    name: "Product 1",
                    description: "This is product 1",
                    price: 100,
                    tags: ["tag1", "tag2"],
                    userId: 1,
                    likeCount: 0,
                    createdAt: new Date("2023-01-01T00:00:00Z"), // Consistent dates for comparison
                    updatedAt: new Date("2023-01-01T00:00:00Z")
                },
                {
                    id: 2,
                    name: "Product 2",
                    description: "This is product 2",
                    price: 200,
                    tags: ["tag3", "tag4"],
                    userId: 2,
                    likeCount: 0,
                    createdAt: new Date("2023-01-02T00:00:00Z"),
                    updatedAt: new Date("2023-01-02T00:00:00Z")
                }
            ];
        });
        // --- Create Product ---
        test('create-should create a new product', async () => {
            const productData = {
                name: "Test Product",
                description: "This is a test product",
                price: 100,
                tags: ["test", "product"]
            };
            const createdProduct = {
                id: 1,
                ...productData,
                userId: userId,
                likeCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            productRepository.create.mockResolvedValue(createdProduct);

            const result = await productService.createProduct(userId, productData);
            
            expect(productRepository.create).toHaveBeenCalledWith({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                tags: productData.tags,
                user: { connect: { id: userId } },
            });
            expect(result).toEqual(createdProduct);
        });
        // --- Update Product ---
        test('updateProduct - should update an existing product', async () => {
            const productId = 1;
            const productData = {
                name: "Updated Product",
                description: "This is an updated product",
                price: 150,
                tags: ["updated", "product"]
            };
            const updatedProduct = {
                ...existingProduct,
                ...productData,
                updatedAt: new Date()
            };
            productRepository.findById.mockResolvedValue(existingProduct);
            productRepository.update.mockResolvedValue(updatedProduct);
            productLikeRepository.findUsersByProductId.mockResolvedValue([]);

            const result = await productService.updateProduct(userId, productId, productData);
            
            expect(productRepository.findById).toHaveBeenCalledWith(productId);
            expect(productRepository.update).toHaveBeenCalledWith(productId, {
                name: productData.name,
                description: productData.description,
                price: productData.price,
                tags: productData.tags,
            });
            expect(result).toEqual(updatedProduct);
            expect(productLikeRepository.findUsersByProductId).toHaveBeenCalledWith(productId);
            expect(notificationService.createNotification).not.toHaveBeenCalled();

        });

        test('updateProduct - should throw an error if the product is not found', async () => {
            productRepository.findById.mockResolvedValue(null);
            await expect(productService.updateProduct(userId, productId, { price: 200 }))
                .rejects.toThrow("Product not found");
        });
        test('updateProduct - should throw an error if the user is unauthorized', async () => {
            const anotherUserProduct = { ...existingProduct, userId: 2 };
            productRepository.findById.mockResolvedValue(anotherUserProduct);
            await expect(productService.updateProduct(userId, productId, { price: 200 }))
                .rejects.toThrow("Unauthorized to update this product");
        });

        // --- Delete Product ---
        test('deleteProduct - should delete an existing product', async () => {
            productRepository.findById.mockResolvedValue(existingProduct);
            productRepository.delete.mockResolvedValue(existingProduct);

            const result = await productService.deleteProduct(userId, productId);
            
            expect(productRepository.findById).toHaveBeenCalledWith(productId);
            expect(productRepository.delete).toHaveBeenCalledWith(productId);
            expect(result).toEqual({ message: "Product deleted successfully" });
        });
        
        test('deleteProduct - should throw an error if the product is not found', async () => {
            productRepository.findById.mockResolvedValue(null);
            await expect(productService.deleteProduct(userId, productId))
                .rejects.toThrow("Product not found");
        });

        test('deleteProduct - should throw an error if the user is unauthorized', async () => {
            const anotherUserProduct = { ...existingProduct, userId: 2 };
            productRepository.findById.mockResolvedValue(anotherUserProduct);
            await expect(productService.deleteProduct(userId, productId))
                .rejects.toThrow("Unauthorized to delete this product");
        });

        // --- Get Product List ---
        test('getProductList - should return a list of products', async () => {
            const loggedInUserId = userId;
            const options: ProductListOptions = { offset: 0, limit: 10, order: "newest" };

            // Simulate the user liking product with id 1
            const myLikedProducts: { productId: number }[] = [{ productId: 1 }];

            productRepository.findManyProducts.mockResolvedValue(productsFromRepo as any);
            // `findManyByUserId` Mock을 추가하여 `undefined.map` 오류 방지
            productLikeRepository.findManyByUserId.mockResolvedValue(myLikedProducts);

            const result = await productService.getProductList(loggedInUserId, options);

            expect(productRepository.findManyProducts).toHaveBeenCalledWith({
                skip: options.offset,
                take: options.limit,
                orderBy: { createdAt: "desc" }
            });
            expect(productLikeRepository.findManyByUserId).toHaveBeenCalledWith(loggedInUserId);
            // `isLiked` 상태가 올바르게 반영된 결과를 예상해야 함
            expect(result).toEqual([
                { ...productsFromRepo[0], isLiked: true }, // Product 1 is liked
                { ...productsFromRepo[1], isLiked: false }, // Product 2 is not liked
            ]);
            expect(result).toHaveLength(2);
        });

        test('getProductList - should return a list of products with isLiked false when user is not logged in', async () => {
            const loggedInUserId = null;
            const options: ProductListOptions = { offset: 0, limit: 10, order: "newest" };
            productRepository.findManyProducts.mockResolvedValue(productsFromRepo as any);

            const result = await productService.getProductList(loggedInUserId, options);

            expect(productRepository.findManyProducts).toHaveBeenCalledWith({
                skip: options.offset,
                take: options.limit,
                orderBy: { createdAt: "desc" }
            });
            expect(productLikeRepository.findManyByUserId).not.toHaveBeenCalled();
            // 모든 제품의 `isLiked`가 false여야 함
            expect(result).toEqual(productsFromRepo.map(product => ({ ...product, isLiked: false })));
            expect(result).toHaveLength(2);
        });

        test('myProducts - should return a list of my products', async () => {
            const options: ProductListOptions = { offset: 0, limit: 10, order: "newest" };
            const userOwnedProducts = productsFromRepo.filter(p => p.userId === userId);
            productRepository.findManyByUserId.mockResolvedValue(userOwnedProducts as any);

            const result = await productService.myProducts(userId, options);

            expect(productRepository.findManyByUserId).toHaveBeenCalledWith(userId, {
                skip: options.offset,
                take: options.limit,
                orderBy: { createdAt: "desc" }
            });
            expect(result).toEqual(userOwnedProducts);
            expect(result).toHaveLength(userOwnedProducts.length);
        });
    });
});