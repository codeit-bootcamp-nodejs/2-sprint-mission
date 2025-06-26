const commentService = require('../services/comment.service');

exports.getAllProductComments = async (req, res, next) => {
    try {
        const result = await commentService.getAllProductComments(req.params.productId, req.query);
        res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
};

exports.createProductComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const content = req.body.content;

        const result = await commentService.createProductComment(productId, content, userId);

        console.log(`✅ 댓글 작성 완료:`, result);

        res.status(201).json({ message: 'Successfully created', result });
    } catch (error) {
        return next(error);
    }
};

exports.updateProductComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const commentId = req.params.commentId;
        const content = req.body.content;

        // console.log('productId', productId);
        // console.log('commentId', commentId);
        // console.log('userId', userId);

        const result = await commentService.updateProductComment(productId, commentId, content, userId);

        console.log(`✅ 댓글 수정 완료:`, result);

        res.status(200).json({ message: 'Successfully updated', result });
    } catch (error) {
        return next(error);
    }
};

exports.deleteProductComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const commentId = req.params.commentId;

        console.log('productId', productId);
        console.log('commentId', commentId);
        console.log('userId', userId);

        const result = await commentService.deleteProductComment(userId, productId, commentId);

        console.log('✅ 댓글 삭제 완료:', result);

        res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
        return next(error);
    }
};

exports.getAllArticleComments = async (req, res, next) => {
    try {
        const result = await commentService.getAllArticleComments(req.params.articleId, req.query);
        res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

exports.createArticleComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;
        const content = req.body.content;

        const result = await commentService.createArticleComment(userId, articleId, content);

        res.status(201).json({ message: 'Successfully created', result });
    } catch (error) {
        return next(error);
    }
};

exports.updateArticleComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;
        const commentId = req.params.commentId;
        const content = req.body.content;

        const result = await commentService.updateArticleComment(userId, articleId, commentId, content);

        res.status(200).json({ message: 'Successfully updated', result });
    } catch (error) {
        return next(error);
    }
};

exports.deleteArticleComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.articleId;
        const commentId = req.params.commentId;

        const result = await commentService.deleteArticleComment(userId, articleId, commentId);
        res.status(200).json({ message: 'Successfully deleted', result });
    } catch (error) {
        return next(error);
    }
};
