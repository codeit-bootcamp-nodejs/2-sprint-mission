import express from 'express';
import fileService from '../service/file/file-service';

const fileController = express.Router();

fileController.post('', fileService.uploadFile);
fileController.get('', fileService.getFile);

export default fileController;
