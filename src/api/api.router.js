import { Router } from 'express';
import sorts from '../sorts/sorts.router.js';
import { handleHealthCheck } from './api.controller.js';

const api = Router();

api.get('/', handleHealthCheck);
api.use('/sorts', sorts);

export default api;