import productRepository from '../repositories/product.repository.ts';
import { CreateProduct, UpdateProduct, ProductQuery } from '../types/product.ts';

const productService = {
    getAllProducts: async (query: ProductQuery) => {
        return await productRepository.getAllProducts(query);
    },

    getProductById: async (userId: number, productId: number) => {
        return await productRepository.getProductById(userId, productId);
    },

    createProduct: async (data: CreateProduct & { userId: number }) => {
        return await productRepository.createProduct(data);
    },

    updateProduct: async (data: UpdateProduct) => {
        return await productRepository.updateProduct(data);
    },

    deleteProduct: async (productId: number) => {
        return await productRepository.deleteProduct(productId);
    },

    likeProduct: async (userId: number, productId: number) => {
        return await productRepository.likeProduct(userId, productId);
    },

    unlikeProduct: async (userId: number, productId: number) => {
        return await productRepository.unlikeProduct(userId, productId);
    },
};

export default productService;
