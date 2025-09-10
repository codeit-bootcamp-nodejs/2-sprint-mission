import { Request, Response } from 'express';
import { s3 , bucketName } from "../config/s3"
import { PutObjectCommand } from '@aws-sdk/client-s3';


class UploadController {
  async uploadFile(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json({ message: "파일 없음" });
      return;
    }

    const filename = Date.now() + '-' + req.file.originalname;
    try { 
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });
    
      await s3.send(command);

      res.json({
        message: 'file 업로드 성공',
        filename,
        url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
      });
    } catch (err){
      console.error(err);
      res.status(500).json({message : 'upload 실패', err});
    }
  }
}

export default new UploadController();

