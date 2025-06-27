const commentService = require('../services/comment.service');

// (상품) 댓글 전체 목록 조회
exports.getAllProductComments = async (req, res, next) => {
    try {
        const result = await commentService.getAllProductComments(req.params.productId, req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// 댓글 생성
exports.createProductComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const content = req.body.content;

        const result = await commentService.createProductComment(productId, content, userId);

        res.status(201).json({ message: '댓글 작성 완료', result });
    } catch (error) {
        next(error);
    }
};

// 댓글 수정
exports.updateProductComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const commentId = req.params.commentId;
        const content = req.body.content;

        const result = await commentService.updateProductComment(productId, commentId, content, userId);

        res.status(200).json({ message: '댓글 수정 완료', result });
    } catch (error) {
        next(error);
    }
};

// 댓글 삭제
exports.deleteProductComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const commentId = req.params.commentId;

        const result = await commentService.deleteProductComment(userId, productId, commentId);

        res.status(200).json({ message: '댓글 삭제 완료' });
    } catch (error) {
        next(error);
    }
};

// (게시글) 댓글 전체 목록 조회
exports.getAllArticleComments = async (req, res, next) => {
    try {
        const result = await commentService.getAllArticleComments(req.params.articleId, req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 댓글 생성
exports.createArticleComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;
        const content = req.body.content;

        const result = await commentService.createArticleComment(userId, articleId, content);

        res.status(201).json({ message: '댓글 작성 완료', result });
    } catch (error) {
        next(error);
    }
};

// 댓글 수정
exports.updateArticleComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;
        const commentId = req.params.commentId;
        const content = req.body.content;

        const result = await commentService.updateArticleComment(userId, articleId, commentId, content);

        res.status(200).json({ message: '댓글 수정 완료', result });
    } catch (error) {
        next(error);
    }
};

// 댓글 삭제
exports.deleteArticleComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;
        const commentId = req.params.commentId;

        const result = await commentService.deleteArticleComment(userId, articleId, commentId);

        res.status(200).json({ message: '댓글 삭제 완료', result });
    } catch (error) {
        next(error);
    }
};
