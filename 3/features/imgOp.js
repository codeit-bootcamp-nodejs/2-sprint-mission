const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../utils/db.js');
const prismaErrorhandler = require('../utils/prismaErrorhandler.js');
const { Prisma } = require('../generated/client/index.js');

const imgDir = path.join(__dirname, '../uploads/images');

try {
    fs.accessSync(imgDir, fs.constants.F_OK);
} catch {
    fs.mkdirSync(imgDir, { recursive: true });
}

const imgUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, done) => {
            done(null, imgDir);
        },
        filename: (req, file, done) => {
            const extension = path.extname(file.originalname);
            done(null, path.basename(file.originalname, extension) + Date.now() + extension);
        }
    }),
    limits: {
        fieldNameSize: 50,
        fieldSize: 1024 * 1024,
        fields: 3,
        fileSize: 5 * 1024 * 1024,
        files: 2,
        parts: 5,
        headerPairs: 1000
    },

    fileFilter(req, file, done) {
        if (file.mimetype.startsWith('image/')) {
            done(null, true);
        } else {
            done(null, false);
        }
    }
});

router.get('/list', prismaErrorhandler(async (req, res, next) => {

    const orderSelects = {
        'recent': { 'createdAt': 'desc' },
        'oldest': { 'createAt': 'acs' },
        'highestprice': { 'price': 'desc' },
        'lowestprice': { 'price': 'acs' },
    };

    const limit = parseInt(req.query.limit) || 10;
    const orderBy = orderSelects[req.query.orderBy] || { 'createdAt': 'desc' };
    const mimetype = req.query.mimetype;
    const encoding = req.query.encoding;
    const lastCursor = req.query.lastCursor;

    const where = {
        mimetype,
        ...(encoding !== undefined && { encoding })
    };



    const allImagesWithCursor = await db.image.findMany({
        where,
        take: limit,
        ...(lastCursor && {
            skip: 1,
            cursor: {
                id: lastCursor
            }
        }),
        orderBy
    });

    const metadata = {
        lastCursor: null,
        hasNextPage: false,
    }

    if (allImagesWithCursor.length === 0) {
        return res.status(200).json({
            allImagesWithCursor,
            metadata
        });
    }

    const lastCursorResult = allImagesWithCursor[allImagesWithCursor.length - 1];
    const lastCursorId = lastCursorResult.id;
    const nextPage = await db.image.findMany({
        where,
        take: limit,
        skip: 1,
        cursor: {
            id: lastCursorId
        },
        orderBy
    });

    metadata.lastCursor = lastCursorId;
    metadata.hasNextPage = nextPage.length > 0;

    res.status(200).json({
        allImagesWithCursor,
        metadata
    });
}));

router.post('/upload', imgUpload.array('images', 3), prismaErrorhandler(async (req, res, next) => {
    if (req.files.length === 0) {
        return res.status(400).json({ message: 'need one file at least' });
    }

    const result = await db.$transaction(async (tx) => {
        const result = [];
        for (const file of req.files) {
            const { originalname, encoding, mimetype, size, destination, filename, path } = file;
            result.push(await tx.image.create({
                data: {
                    originalname,
                    mimetype,
                    size,
                    destination,
                    filename,
                    path,
                    ...(encoding !== undefined && { encoding })
                }
            }));
        }
        return result;
    });

    if (result.length !== 0) res.status(201).json({ message: 'upload success:' + result.length });
    else res.sendStatus(500);
}));

router.delete('/delete', prismaErrorhandler(async (req, res, next) => {
    const { filenames } = req.body;

    console.log(filenames);

    if (!Array.isArray(filenames)) {
        return res.status(400).json({ message: 'filenames must be array!' });
    }

    try {
        for (const filename of filenames) {
            const fullPath = path.join(imgDir, filename)
            await fs.promises.access(fullPath);
            const deltedImages = [];
            deltedImages.push(await db.$transaction(async (tx) => {
                const deltedImage = await tx.image.delete({
                    where: { filename }
                });
                await fs.promises.unlink(fullPath);
                return deltedImage;
            }));
            if (deltedImages.length !== 0) res.status(200).json({ message: 'delete success:' + deltedImages.length });
            else res.sendStatus(500);
        }

    } catch (err) {
        console.error('DB 트랜잭션 실패:', err.message);
        return res.status(500).json({ message: 'DB 삭제 실패', error: err.message });
    }
}));

module.exports = router;