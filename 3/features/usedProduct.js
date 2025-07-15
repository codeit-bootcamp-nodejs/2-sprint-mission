const db = require('../utils/db.js');
const express = require('express');
const {ProductDto} = require('../dtoVerify/verifyStruct.js');
const {assert} = require('superstruct');
const prismaErrorhandler = require('../utils/prismaErrorhandler.js');

const router = express.Router();

// 상품 목록 조회 API
router.get('/list', prismaErrorhandler( async (req, res, next) => {
    const orderSelects = {
        'recent': { 'createdAt': 'desc' },
        'oldest': { 'createAt': 'acs' },
        'highestprice': { 'price': 'desc' },
        'lowestprice': { 'price': 'acs' },
    };

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = orderSelects[req.query.orderBy] || { 'createdAt': 'desc' };

    const nameSearch = req.query.name;
    const descriptionSearch = req.query.description;

    const where = {
        ...(nameSearch !== undefined && {name : {contains: nameSearch,mode: 'insensitive'}}),
        ...(descriptionSearch !== undefined && {description: {contains: descriptionSearch, mode: 'insensitive'}})
    };

    // res.json({offset, limit, orderBy, where});

    const productsList = await db.product.findMany({
        where,

        select: {
            id: true,
            name: true,
            price: true,
            createdAt: true,
        },

        orderBy,

        skip: offset,
        take: limit,

        // include:{
        //     productTags:true
        // }
    });

    res.status(200).json(productsList);
}));

// 상품 태그 이름별 상품 조회 API
router.get('/tags/:name', prismaErrorhandler( async (req, res, next) => {
    const name = req.params.name;
    const productByTagName = await db.productTags.findMany({
        where: { name },
        include: {
            product: true,
        },
    });

    res.status(200).json(productByTagName);
}));

// 상품 상세 조회 API
router.get('/list/:id', prismaErrorhandler( async (req, res, next) => {
    const id = req.params.id;
    const productById = await db.product.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            createdAt: true,
            tags: true,
        },
    });

    res.status(200).json(productById);
}));

// 상품 등록 API
router.post('/create', prismaErrorhandler( async (req, res, next) => {
    assert(req.body, ProductDto);
    const { name, description, price, tags } = req.body;

    // res.json({name, description, price, tags});
    const createdProduct = await db.product.create({
        data: {
            name,
            description,
            price,
            tags: {
                create: tags,
            },
        },
        include: {
            tags: true,
        }
    });

    res.status(201).json(createdProduct);
}));

// 상품 수정 API
router.patch('/update/:id', prismaErrorhandler( async (req, res, next) => {
    assert(req.body, ProductDto);
    const id = req.params.id;
    const { name, description, price, tags } = req.body;
    const updateObj = {
        where: { id }, 
        data: {
            ...(name !== undefined && {name}),
            ...(description !== undefined && {description}),
            ...(price !== undefined && {price}),
        }
    };

    const updateProduct = function(){
        return db.$transaction(async (dbi) => {
            const updatedProduct = await dbi.product.update(updateObj);
            if (tags) {
                const deletedTags = await dbi.productTags.deleteMany({ where: { productId: id } });
        
                tags.forEach((v, i, self) => {
                    self[i] = {
                        name: v.name,
                        productId: id,
                    }
                });
        
                // const tagsWithProductId = tags.map(
                //     (tagV) => ({name:tagV.name, productId:id})
                // );
        
                const newProductTags = await dbi.productTags.createMany({
                    data: tags
                });
        
                updatedProduct.deletedTags = deletedTags;
                updatedProduct.newProductTags = newProductTags;
            }
            
            return updatedProduct;
        });
    }

    const updateProductWithTransaction = await updateProduct();

    res.status(200).json(updateProductWithTransaction);
}));

// 상품 삭제 API
router.delete('/delete/:id', prismaErrorhandler( async (req, res, next) => {
    const id = req.params.id;
    const deletedProduct = await db.product.delete({
        where: { id },
        include: {
            tags: true
        }
    });
    res.status(200).json(deletedProduct);
}));

module.exports = router;