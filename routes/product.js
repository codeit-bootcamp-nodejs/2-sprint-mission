// routes/product.js
const { assert } = require('superstruct');
const { CreateDto } = require('../dtos/products.dtos.js');
const { db } = require('../utils/db.js');

// const multer = require('multer');      // 05.29 여기에서 필요하지 않음
const path = require('path');
const fs = require('fs');

// 파일 업로드 설정
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// GET /product : 제품 목록 검색하고 페이징 처리하여 응답 반환
// 클라이언트가 상품 목록 요청하면, 키워드 검색(keyword), 페이지(skip, limit) 기능을 반영해서 상품 리스트를 가져와서 응답
const getAllProducts = async (req, res, next) => {
    // Express 라우터 핸들러 함수, 비동기 처리 위해 async로 선언했고, next(err)를 통해 에러를 중앙 처리 미들웨어로 넘김
    try {
        // 페이지네이션을 위한 쿼리 파라미터 처리 -> 프론트에서 ?skip=0&limit=10 이렇게 넘겨받은 쿼리 문자열 처리
        // Number() 함수 사용해서 문자열 -> 숫자로 변환하고, 값이 없으면 기본값 사용
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || 10;
        // 검색기능을 위한 키워드 -> 프론트에서 ?keyword=삼성 이렇게 요청하면 keyword에 들어감. 없으면 빈 문자열 처리
        const keyword = req.query.keyword || '';

        // 05.29 페이지네이션 에러처리 추가
        // skip 또는 limit이 음수거나 NaN일 경우
        if (skip < 0 || limit < 0 || isNaN(skip || isNaN(limit))) {
            const error = new Error();
            error.status = 400;
            return next(error);
        }

        // 검색 조건 : 키워드가 있으면 상품 이름 혹은 설명에 해당하는 키워드가 포함되었는지 찾음
        // 키워드가 없다면 전체 목록 가져오기 위해 where: {} 문법 사용
        // contains 포함 여부,  mode: insensitive 대소문자 구분없이 검색
        const where = keyword
            ? { OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { description: { contains: keyword, mode: 'insensitive' } }] }
            : {};

        // db.product.findMany()`는 DB에서 다수의 상품을 가져오는 Prisma 쿼리
        // await를 사용해서 결과가 올 때까지 기다린다.
        const products = await db.product.findMany({
            where, // 아까 만든 조건 (검색어 기반 OR 조건)
            orderBy: { createdAt: 'desc' }, // createdAt으로 최신순 정렬
            skip, // 앞에서 몇 개 건너뛸지
            take: limit, // 몇 개 가져올지
            select: { id: true, name: true, price: true, createdAt: true }, // 어떤 필드만 응답에 포함시킬지
        });
        // 가져온 상품 리스트를 HTTP 200(성공) 응답으로 JSON 형식으로 클라이언트에 반환
        res.status(200).json(products);
    } catch (error) {
        return next(error); // 오류 발생하면 next(err) 호출해서 전역 에러 핸들러에 맡김
    }
};

// GET /product/:id  : Id로 특정 상품 조회
/*
1. URL 파라미터에서 상품 ID를 숫자로 추출
2. DB에서 해당 ID의 상품을 조회
3. 없으면 404, 있으면 원하는 필드만 골라 200 응답
4. 싪패 시 전역 에러 핸들러로 넘김
*/
const getProductById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await db.product.findUnique({ where: { id } });

        // 05.29
        if (!product) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        // 구조분해할당 시 변수 이름 충돌 주의
        const { id: pid, name, description, price, tags, createdAt } = product;
        res.status(200).json({ id: pid, name, description, price, tags, createdAt });
    } catch (error) {
        return next(error);
    }
};

// POST /product  : 상품 등록
const createProduct = async (req, res, next) => {
    try {
        assert(req.body, CreateDto);
        const { name, description, price, tags } = req.body;

        await db.product.create({ data: { name, description, price, tags } });
        res.status(201).json({ message: 'Successfully registered' });
    } catch (error) {
        if (error?.name === 'StructError') return res.status(400).json({ error: err.message });
        return next(error);
    }
};

// PATCH /product/:id  : 상품 수정 + 선택적 파일 업로드
/*
1. Id 확인
2. multer 준 임시 파일을 새 이름으로 이동 후 URL 저장
3. Prisma.update로 DB 수정
4. 예외는 next(err)
*/
const updateProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await db.product.findUnique({ where: { id } });

        // 05.29
        if (!product) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }
        // 수정할 데이터 묶음 : req.body로 넘어온 값들
        const dataToUpdate = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            tags: req.body.tags,
        };

        // 파일이 올라왔을 때만 처리
        if (req.file) {
            const { originalname, filename } = req.file;
            const ext = path.extname(originalname);
            const newName = filename + ext;
            const newPath = path.join(uploadDir, newName);

            fs.renameSync(req.file.path, newPath);
            dataToUpdate.imageUrl = `/product/files/${newName}`;
        }

        const updated = await db.product.update({ where: { id }, data: dataToUpdate });
        res.status(200).json({ message: 'Successfully updated', product: updated });
    } catch (error) {
        return next(error);
    }
};

// DELETE /product/:id : 상품 삭제
const deleteProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const product = await db.product.findUnique({ where: { id } });

        // 05.29
        if (!product) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        await db.product.delete({ where: { id } });
        res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
