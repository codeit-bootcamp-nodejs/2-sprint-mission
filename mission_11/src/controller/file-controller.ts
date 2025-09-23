import express from 'express';
import fileService from '../service/file/file-service';

const fileController = express.Router();

fileController.post('', fileService.uploadFile);
fileController.get('', fileService.getFile);
fileController.post('/local', fileService.localUploadFile);
fileController.get('/local/:fileKey', fileService.localGetFile);

export default fileController;
