import multer from "multer";
import path from "path";
import dotenv from "dotenv";

import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

// S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  // },
});

let storage: multer.StorageEngine;

if (isProd) {
  // S3에 저장
  storage = multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    cacheControl: "public, max-age=31536000",
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `uploads/${basename}-${uniqueSuffix}${ext}`);
    },
  });
} else {
  // 로컬 디스크에 저장
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // 서버 uploads 폴더
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${basename}-${uniqueSuffix}${ext}`);
    },
  });
}

// 업로드 필터 (이미지 파일만 허용)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  fileFilter,
});

export default upload;
