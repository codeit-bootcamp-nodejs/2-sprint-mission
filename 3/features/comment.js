const express = require('express');
const db = require('../utils/db.js');
const {commentsDto} = require('../dtoVerify/verifyStruct.js');
const {assert} = require('superstruct');
const prismaErrorhandler = require('../utils/prismaErrorhandler.js');

// const { v4:uuidv4 } = require('uuid');
// const cron = require('node-cron');

const router = express.Router();

// 댓글 목록 조회 API
router.get('/list/:postId', prismaErrorhandler( async (req, res, next) => {
    
    const postId = req.params.postId;
    const orderSelects = {
        'recent':{'createdAt':'desc'},
        'oldest':{'createAt':'acs'},
        'highestprice':{'price':'desc'},
        'lowestprice':{'price':'acs'},
    };

    const limit = parseInt(req.query.limit) || 10;
    const orderBy = orderSelects[req.query.orderBy] || {'createdAt':'desc'};

    const titleSearch = req.query.title;
    const contentSearch = req.query.content;

    const where = {
        articleId:postId,
        ...(titleSearch !== undefined && {title: {contains:titleSearch, mode:'insensitive'}}),
        ...(contentSearch !== undefined && {content:{contains:contentSearch,mode:'insensitive'}})
    };

    const lastCursor = req.query.lastCursor;

    const getObj = {
        take:limit,
        ...(lastCursor && {
            skip:1,
            cursor:{
                id:lastCursor
            }
        }),
        where,
        // select: {
        //     id: true,
        //     title: true,
        //     content: true,
        //     createdAt: true,
        // },
        orderBy,
    };

    const commentList = await db.comment.findMany(getObj);
    const metadata = {
        lastCursor: null,
        hasNextPage: false,
    }

    if(commentList.length === 0){
        return res.status(200).json({
            commentList, 
            metadata
        });
    }

    const lastCursorResult = commentList[commentList.length - 1];
    const lastCursorId = lastCursorResult.id;
    const nextPage = await db.comment.findMany({
        where,
        take:limit,
        skip:1,
        cursor:{
            id: lastCursorId
        },
        orderBy
    });

    // console.log(nextPage);

    metadata.lastCursor = lastCursorId;
    metadata.hasNextPage = nextPage.length > 0;

    res.status(200).json({
        commentList,
        metadata
    });
}));

// 댓글 등록 API
// aboutToReplyCommentId: comment id to answer(답변할 댓글의 아이디)
router.post('/create/:postId{/:aboutToReplyCommentId}', prismaErrorhandler( async (req, res, next) => {
    assert(req.body, commentsDto);
    const postId = req.params.postId;
    const aboutToReplyCommentId = req.params.aboutToReplyCommentId;
    const {title, content} = req.body;

    // data is comment to reply post or comment
    const data = {
        content,
        articleId:postId,
        ...(title !== undefined && {title}),
        parentId:null,
        replyId:null,
    }

    if(aboutToReplyCommentId){

        const replyComment = await db.comment.findUniqueOrThrow({
            where:{
                articleId:postId,
                id:aboutToReplyCommentId
            }
        });

        data.replyId = aboutToReplyCommentId;
        // assign after verify the replying comment really exist
        // replyId is root or child commentId that the comment you want to create replys to.(난 이 댓글에 답글을 달겠다.)
        
        const parentId = replyComment.parentId;

        if(parentId === null){
            data.parentId = aboutToReplyCommentId;
            // if parentId is null, aboutToReplyCommentId is root. so creating comment's parent is root.
        } else {
            data.parentId = parentId;
            // if parentId is not null, aboutToReplyCommentId is not root and root's child comment. but comment's parent must be root comment.(내가 속한 댓글은 이 루트 댓글이다.)
        }
    }

    const createdCommentToPostId = await db.comment.create({
        data
    });

    res.status(201).json(createdCommentToPostId);
    
}));

// 댓글 수정 API
router.patch('/update/:postId/:commentRealId', prismaErrorhandler( async (req, res, next) => {
    assert(req.body, commentsDto);
    const postId = req.params.postId;
    const commentRealId = req.params.commentRealId;
    const {title, content} = req.body;

    const updatedCommentToPostId = await db.comment.update({
        where:{
            id: commentRealId,
            articleId: postId
        },

        data:{
            ...(title !== undefined && {title}),
            content
        }
    });

    res.status(200).json(updatedCommentToPostId);
}));

// 댓글 삭제 API
router.delete('/delete/:postId/:commentRealId', prismaErrorhandler( async (req, res, next) => {
    const postId = req.params.postId;
    const commentRealId = req.params.commentRealId;

    // // soft delete comment
    // const deletedCommentByPostIdAndCommentRealId = await db.comment.update({
    //     where:{
    //         id: commentRealId,
    //         articleId: postId
    //     },

    //     data:{
    //         isDeleted: true
    //     }
    // });

    // const findCommentByIdAndArticleId = await db.comment.findUniqueOrThrow({
    //     where: {
    //         id: commentRealId,
    //         articleId:postId
    //     }
    // });

    // const parentId = findCommentByIdAndArticleId.parentId;
    
    // if(parentId === null){
    // }

    const deleteCommentByIdAndArticleId = await db.comment.delete({
        where: {
            id: commentRealId,
            articleId: postId
        }
    });

    res.status(200).json({deleteCommentByIdAndArticleId});
}));

module.exports = router;