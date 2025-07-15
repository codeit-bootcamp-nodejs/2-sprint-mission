const express = require('express');
const db = require('../utils/db.js');
const {ArticleDto} = require('../dtoVerify/verifyStruct.js');
const {assert} = require('superstruct');
const prismaErrorhandler = require('../utils/prismaErrorhandler.js');

const router = express.Router();

// 게시글 목록 조회 API

router.get( '/list', prismaErrorhandler( async (req, res, next) => {
    const orderSelects = {
        'recent': { 'createdAt': 'desc' },
        'oldest': { 'createAt': 'acs' },
        'highestprice': { 'price': 'desc' },
        'lowestprice': { 'price': 'acs' },
    };

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = orderSelects[req.query.orderBy] || { 'createdAt': 'desc' };

    const titleSearch = req.query.title;
    const contentSearch = req.query.content;

    const where = {
        ...(titleSearch !== undefined && { title: { contains: titleSearch, mode: 'insensitive' } }),
        ...(contentSearch !== undefined && { content: { contains: contentSearch, mode: 'insensitive' } })
    };

    const freeBoardList = await db.article.findMany({
        where,
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
        },

        orderBy,

        skip: offset,
        take: limit,

        // include:{
        //     comments:true
        // }
    });

    res.status(200).json(freeBoardList);
}));

// 게시글 상세 조회 API
router.get('/list/:id', prismaErrorhandler( async (req, res, next) => {
    const id = req.params.id;
    const articleById = await db.article.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            comments: true,
        },
    });
    res.status(200).json(articleById);
}));

// 게시글 등록 API
router.post('/create', prismaErrorhandler( async (req, res, next) => {
    assert(req.body, ArticleDto);
    const { title, content } = req.body;

    const createdArticle = await db.article.create({
        data: {
            title,
            content,
        },
    });

    res.status(201).json(createdArticle);
}));

// 게시글 수정 API
router.patch('/update/:id', prismaErrorhandler( async (req, res, next) => {
    assert(req.body, ArticleDto);
    const id = req.params.id;
    const { title, content } = req.body;
    const updateObj = {
        where: { id },
        data: {
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content }),
        }
    };
    const updatedArticle = await db.article.update(updateObj);

    res.status(200).json(updatedArticle);
}));

// 게시글 삭제 API
router.delete('/delete/:id', prismaErrorhandler( async (req, res, next) => {
    const id = req.params.id;
    const deletedArticle = await db.article.delete({
        where: { id },
        include: {
            comments: true,
        }
    });
    res.status(200).json(deletedArticle);
}));

module.exports = router;