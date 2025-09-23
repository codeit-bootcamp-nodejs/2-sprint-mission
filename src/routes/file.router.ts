import express, { Request, Response } from "express";
import upload from "../middlewares/imageUpload";

const router = express.Router();

// POST /files/image
router.post("/image", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "이미지 업로드 실패" });
    return;
  }
  // storage에서 파일명과 확장자까지 이미 처리했으므로 rename 불필요
  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

export default router;