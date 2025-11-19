import { Router } from 'express';
import { handleGetSorts, handlePostInsertion, handlePostMerge, handlePostQuick, handlePostSelection } from './sorts.controller.js';

const sorts = Router();

sorts.get('/', handleGetSorts);
sorts.post('/selection', handlePostSelection);
sorts.post('/insertion', handlePostInsertion);
sorts.post('/merge', handlePostMerge);
sorts.post('/quick', handlePostQuick);

export default sorts;