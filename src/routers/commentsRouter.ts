import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { updateComment, deleteComment } from '../controllers/commentsController.js';

const commentsRouter = express.Router();

commentsRouter.patch('/:id', withAsync(updateComment));
commentsRouter.delete('/:id', withAsync(deleteComment));

export default commentsRouter;
