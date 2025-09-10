import { Request, Response } from 'express';
import * as imagesService from '../services/imagesService';

export const upload = imagesService.upload;

export async function uploadImage(req: Request, res: Response) {
  const url = await imagesService.uploadImage(req.file);
  res.send({ url });
}
