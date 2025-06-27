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
        const articleId = req.params.id;

        console.log('userId', userId);
        console.log('articleId', articleId);

        // 작성자 확인을 위해 userId 포함해서 조회
        const article = await articleService.getArticleById(userId, articleId);

        console.log('article', article);

        // 작성자만 수정 가능 (product.userId는 현재 select에 포함되어 있지 않으므로 포함시켜야 함!)
        if (article.userId !== userId) {
            return res.status(403).json({ message: '작성자 본인만 수정할 수 있습니다.' });
        }
        console.log('article.userId', article.userId);

        const result = await articleService.updateArticle(articleId, req.body);

        res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
};

exports.deleteArticle = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.id
        
        const article = await articleService.getArticleById(userId, articleId);

        if (Number(article.userId) !== Number(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await articleService.deleteArticle(articleId);
        res.status(200).json({ message: 'Successfully deleted', result });

    } catch (error) {
        return next(error);
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
