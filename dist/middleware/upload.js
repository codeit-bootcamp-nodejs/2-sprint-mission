"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const ext = path_1.default.extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'uploads/' + file.fieldname + '-' + uniqueSuffix + ext);
        }
    })
});
exports.default = upload;
