import db from '../config/db.ts';
import { Prisma } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { CreateProduct, UpdateProduct, ProductQuery } from '../types/product.ts';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const productRepository = {
    getAllProducts: async (query: ProductQuery) => {
        const skip = Number(query.skip) || 0;
        const limit = Number(query.limit) || 10;
        const keyword = String(query.keyword || '');

        if (skip < 0 || limit < 0 || isNaN(skip) || isNaN(limit)) {
            const error = new Error('요청한 페이지 정보 유효하지 않음');
            (error as any).status = 400;
            throw error;
        }

        const where = keyword ?
            {
                OR:
                [
                    { name: { contains: keyword, mode: 'insensitive' as const } },
                    { description: { contains: keyword, mode: 'insensitive' as const } }
                ],
              } 
            : {};

        return await db.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            select: { id: true, name: true, price: true, createdAt: true },
        });
    },

    getProductById: async (userId: number, productId: number) => {
        const uid = Number(userId);
        const pid = Number(productId);

        if (isNaN(pid)) {
            const error = new Error('유효하지 않은 상품 ID');
            (error as any).status = 400;
            throw error;
        }

        const product = await db.product.findUnique({
            where: { id: pid },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                updatedAt: true,
                userId: true,
            },
        });

        if (!product) {
            const error = new Error('조회할 상품 없음');
            (error as any).status = 404;
            throw error;
        }

        let isLiked = false;

        if (!isNaN(uid)) {
            const like = await db.productLike.findFirst({
                where: {
                    productId: pid,
                    userId: uid,
                },
            });
            isLiked = !!like;
        }

        return { ...product, isLiked };
    },

    createProduct: async (data: CreateProduct & { userId: number }) => {
        const { name, description, price, tags, userId } = data;
        return await db.product.create({ data: { name, description, price, tags, userId } });
    },

    updateProduct: async ({ id, data, file }: UpdateProduct) => {
        const product = await db.product.findUnique({ where: { id: Number(id) } });

        if (!product) {
            const error = new Error('수정할 상품 없음');
            (error as any).status = 404;
            throw error;
        }

        const dataToUpdate: Prisma.ProductUpdateInput = {
            name: data.name,
            description: data.description,
            price: data.price,
            tags: data.tags,
        };

        if (file) {
            const { originalname, filename } = file;
            const ext = path.extname(originalname);
            const newName = filename + ext;
            const newPath = path.join(uploadDir, newName);
            fs.renameSync(file.path, newPath);
            dataToUpdate.imageUrl = `/product/files/${newName}`;
        }

        return await db.product.update({ where: { id: Number(id) }, data: dataToUpdate });
    },

    deleteProduct: async (id: number) => {
        const product = await db.product.findUnique({ where: { id: Number(id) } });
        if (!product) {
            const error = new Error('삭제할 상품 없음');
            (error as any).status = 404;
            throw error;
        }
        return await db.product.delete({ where: { id: Number(id) } });
    },

    likeProduct: async (userId: number, productId: number) => {
        const likeProduct = await db.productLike.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });

        if (likeProduct) {
            const error = new Error('이미 좋아요 했지~♥️');
            (error as any).status = 400;
            throw error;
        }

        return await db.productLike.create({
            data: { userId, productId },
        });
    },

    unlikeProduct: async (userId: number, productId: number) => {
        const unlikeProduct = await db.productLike.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });

        if (!unlikeProduct) {
            const error = new Error('아직 좋아요 안했지~♥️');
            (error as any).status = 400;
            throw error;
        }

        await db.productLike.delete({
            where: {
                userId_productId: { userId, productId },
            },
        });

        return { productId };
    },
};

export default productRepository;
