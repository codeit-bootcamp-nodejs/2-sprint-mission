const articleService = require('../services/article.service');

exports.getAllArticles = async (req, res, next) => {
    try {
        const result = await articleService.getAllArticles(req.query);
        res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
};

exports.getArticleById = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const articleId = req.params.id;

        console.log('userId', userId);
        console.log('articleId', articleId);

        const result = await articleService.getArticleById(userId, articleId);

        console.log('✅ 게시글 상세 조회', result);
        res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

exports.createArticle = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await articleService.createArticle({ ...req.body, userId });
        console.log(`✅ 게시글 등록 완료:`, result);
        res.status(201).json({ message: 'Successfully created', result });
    } catch (error) {
        console.error(`error:`, error);
        return next(err);
    }
};

exports.updateArticle = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const article = await articleService.getArticleById(req.params.id);

        console.log('로그인한 유저 ID:', userId);
        console.log('게시글 작성자 ID:', article.userId);

        if (Number(article.userId) !== Number(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await articleService.updateArticle(req.params.id, req.body);
        console.log(`✅ 업데이트 완료:`, result);
        res.status(200).json({ message: 'Successfully updated', result });
    } catch (err) {
        return next(err);
    }
};

exports.deleteArticle = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const article = await articleService.getArticleById(req.params.id);

        if (Number(article.userId) !== Number(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await articleService.deleteArticle(req.params.id);
        console.log(`✅ 삭제 완료:`, result);
        res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
        return next(err);
    }
};

exports.likeArticle = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = Number(req.params.articleId);

        console.log('userId', userId);
        console.log('articleId', articleId);

        const result = await articleService.likeArticle(userId, articleId);
        console.log('좋아요~', result);
        res.status(200).json({ message: '좋아요~♥️', result });
    } catch (error) {
        return next(error);
    }
};

exports.unlikeArticle = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = Number(req.params.articleId);

        console.log('userId', userId);
        console.log('articleId', articleId);

        const result = await articleService.unlikeArticle(userId, articleId);
        console.log('좋아요 취소~', result);
        res.status(200).json({ message: '좋아요 취소~♥️', result });
    } catch (error) {
        return next(error);
    }
};
