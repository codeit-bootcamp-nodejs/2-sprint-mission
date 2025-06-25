const { db } = require('../utils/db.js');

// 🚩 Product Comment
// Get : 특정 상품의 댓글 목록 조회
// baseurl/product/:productId/comment?skip=0&take=5
const getAllProductComments = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);
        const limit = parseInt(req.query.limit) || 10; // 한 번에 가져올 댓글 수, 없으면 기본값 10개
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : null; // cursor 페이지네이션에 사용될 기준 Id, cursor가 있으면 해당 Id 이후의 댓글부터 조회됨

        // 05.29 파라미터에 productId 입력했는지 확인하는 유효성 검증 추가
        if (!productId || isNaN(productId)) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        // 05.29 DB에 product 존재하는지 유효성 검증 추가
        const product = await db.product.findUnique({
            where: { id: productId },
        });

        // 05.29 에러 메시지 삭제 -> 에러 핸들러에서 메시지 출력하니까 삭제 해도 괜찮음
        if (!product) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const comments = await db.productComment.findMany({
            where: { productId },
            take: limit,
            skip: cursor ? 1 : 0, // cursor가 있을 경우, 기준 cursor Id에 해당하는 댓글은 건너뜀 (중복 방지)
            cursor: cursor ? { id: cursor } : undefined, // cursor를 기준으로 그 이후의 댓글들을 가져오도록 설정
            orderBy: { id: 'desc' },
            select: {
                // 필요한 필드만 선택
                id: true,
                content: true,
                createdAt: true,
            },
        });

        // 다음페이지 cursor 설정 -> 조회된 댓글이 있다면, 마지막 댓글의 ID를 다음 요청에 사용할 커서로 설정. 없다면 null (더 이상 댓글 없음)
        const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

        // const exists = await db.productComment.findUnique({ where: { id: 3 } });
        // console.log(exists);

        return res.status(200).json({ comments, nextCursor });
    } catch (error) {
        // console.error(error);
        return next(error); // 05.29 catch 블록에서 무조건 next(err)로 넘길 수 있게 return 추가
    }
};

// POST : 특정 상품에 대한 댓글 작성
/*
1. URL에서 productId 꺼내고
2. 어떤 상품에 댓글을 다는지 확인
3. 본문에서 댓글 내용 꺼냄
4. 유효성 검사 거치고
5. Prisma 이용해서 DB에 댓글 저장하고
6. 성공하면 201 상태코드로 응답, 오류나면 catch 문에서 처리
*/
const createProductComment = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);
        const { content } = req.body;

        // 댓글 내용이 없거나, `productId`가 숫자가 아니면 유효하지 않은 입력이므로 에러를 만들어서 에러처리 미들웨어로 넘김
        // 내용이 비었는지, productId가 숫자인지 확인
        if (!content || !productId || isNaN(productId)) {
            // 05.28 삭제된 porductId 입력했는데 디버깅 통과
            // console.log(`productId :`, productId);
            // 05.28 디버깅 해보니 productId는 params로 받아오는거니까 콘솔에 출력되는게 당연한거고, 해당 productId가 DB에 있는지 확인하는 유효성 검증 코드를 빠뜨림
            const error = new Error();
            error.status = 400;
            return next(error);
        }

        // 05.28 댓글 달고 싶은 상품 DB에 있는지 확인하는 유효성 검증 추가
        const product = await db.product.findUnique({
            where: { id: productId },
        });

        // 05.28 댓글 달고 싶은 상품 DB에 있는지 확인하는 유효성 검증 추가
        if (!product) {
            const error = new Error();
            error.status = 404;
            // 05.29 에러 응답 직접 보내지 않고 에러 핸들러로 넘기기
            return next(error);
        }

        const newComment = await db.productComment.create({
            data: {
                content,
                product: {
                    // 해당 productId에 연결된 댓글이라는 관계 설정
                    connect: { id: productId },
                },
            },
        });
        return res.status(201).json({ message: 'Successfully registered', comment: newComment });
    } catch (error) {
        // console.error(error);
        return next(error); // 05.29 추가
    }
};

// PATCH : 특정 상품에 달린 특정 댓글 내용 수정
const updateProductComment = async (req, res, next) => {
    /*
    1. 댓글 ID로 댓글 찾아서 수정
    2. 수정할 content 유효한지 확인 
    3. productId가 해당 댓글과 연결 되어있는지 확인
    4. 댓글 없으면 404에러 처리
    */
    try {
        // URL 파라미터 숫자로 변환
        const productId = Number(req.params.productId);
        const commentId = Number(req.params.commentId);
        // req.body로 넘어온 댓글 추출
        const { content } = req.body;

        // 입력값 1차 검증
        if (!content || isNaN(productId) || isNaN(commentId)) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }
        // 해당 commentId가 DB에 존재하는지 확인
        const existingComment = await db.productComment.findUnique({
            where: { id: commentId },
        });
        // 없으면 404에러
        if (!existingComment) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }
        // 존재하지만 다른 상품에 달린 댓글이면 403
        if (existingComment.productId !== productId) {
            const error = new Error();
            error.status = 403; // 05.29 추가
            return next(error);
        }
        // 검증 통과 -> DB 업데이트
        const updatedComment = await db.productComment.update({
            where: { id: commentId },
            data: { content },
        });

        return res.status(200).json({ message: 'Comment updated', comment: updatedComment });
    } catch (error) {
        // console.error(error);
        return next(error); // 05.29 추가
    }
};

// DELETE : 특정 상품에 달린 특정 댓글 삭제
const deleteProductComment = async (req, res, next) => {
    try {
        // URL 파라미터 숫자로 변환
        const productId = Number(req.params.productId);
        const commentId = Number(req.params.commentId);
        // 기본 입력 검증
        if (isNaN(productId) || isNaN(commentId)) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }
        // 해당 ID의 댓글 존재하는지 확인
        const comment = await db.productComment.findUnique({
            where: { id: commentId },
        });
        // 댓글 없으면 404에러
        if (!comment) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }
        // 존재하지만 다른 상품에 달린 댓글이면 403
        if (comment.productId !== productId) {
            const error = new Error();
            error.status = 403; // 05.29 추가
            return next(error);
        }

        await db.productComment.delete({ where: { id: commentId } });
        return res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        // console.error(err);
        return next(error); // 05.29 추가
    }
};

// 🚩 Article Comment
// Get : 특정 게시글의 댓글 목록 조회
const getAllArticleComments = async (req, res, next) => {
    try {
        const articleId = Number(req.params.articleId);
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

        // 05.29 파라미터에 articleId 입력했는지 확인하는 유효성 검증 추가
        if (!articleId || isNaN(articleId)) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        // 05.29 DB에 article 존재하는지 유효성 검증 추가
        const article = await db.article.findUnique({
            where: { id: articleId },
        });

        // 05.29 
        if (!article) {
            const error = new Error()
            error.status = 404
            return next(error)
        }

        const comments = await db.articleComment.findMany({
            where: { articleId },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { id: 'desc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
        });

        const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

        return res.status(200).json({ comments, nextCursor });
    } catch (error) {
        // console.error(error);
        return next(error); // 05.29 추가
    }
};

// POST : 특정 게시글에 대한 댓글 작성
const createArticleComment = async (req, res, next) => {
    try {
        const articleId = Number(req.params.articleId);
        const { content } = req.body;

        if (!content || !articleId || isNaN(articleId)) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const article = await db.article.findUnique({
            where: { id: articleId },
        });

        if (!article) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const newComment = await db.articleComment.create({
            data: {
                content,
                article: {
                    connect: { id: articleId },
                },
            },
        });
        return res.status(201).json({ message: 'Successfully registered', comment: newComment });
    } catch (error) {
        // console.error(error);
        return next(error); // 05.29 추가
    }
};

// PATCH : 특정 상품에 달린 특정 댓글 내용 수정
const updateArticleComment = async (req, res, next) => {
    try {
        const articleId = Number(req.params.articleId);
        const commentId = Number(req.params.commentId);
        const { content } = req.body;

        if (!content || isNaN(articleId) || isNaN(commentId)) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const existingComment = await db.articleComment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        if (existingComment.articleId !== articleId) {
            const error = new Error();
            error.status = 403;
            return next(error);
        }

        const updatedComment = await db.articleComment.update({
            where: { id: commentId },
            data: { content },
        });

        return res.status(200).json({ message: 'Comment updated', comment: updatedComment });
    } catch (error) {
        // console.error(error);
        return next(error); // 05.29 추가
    }
};

// DELETE : 특정 상품에 달린 특정 댓글 삭제
const deleteArticleComment = async (req, res, next) => {
    try {
        const articleId = Number(req.params.articleId);
        const commentId = Number(req.params.commentId);

        if (isNaN(articleId) || isNaN(commentId)) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const comment = await db.articleComment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        if (comment.articleId !== articleId) {
            const error = new Error();
            error.status = 403;
            return next(error);
        }

        await db.articleComment.delete({ where: { id: commentId } });
        return res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        // console.error(error);
        return next(error); // 05.29 추가
    }
};

module.exports = {
    getAllProductComments,
    getAllArticleComments,
    createProductComment,
    createArticleComment,
    updateProductComment,
    updateArticleComment,
    deleteProductComment,
    deleteArticleComment,
};
