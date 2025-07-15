import express from 'express';
import passport from '../lib/middlewares/passport';
import commentController from '../controllers/comment/commentController';

const commentRouters = express.Router();

commentRouters.get(
    '/:kind/:id',
    commentController.getRootCommentsListHandler
);

commentRouters.get(
    '/:kind/:id/:cid',
    commentController.getCommentsOfRootCommentHandler
);

commentRouters.post(
    '/:kind/:id{/:cid}/create',
    passport.authenticate('accessToken', { session: false }),
    commentController.createCommentHandler
);

commentRouters.patch(
    '/:cid/update',
    passport.authenticate('accessToken', { session: false }),
    commentController.updateCommentHandler
);

commentRouters.delete(
    '/:cid/delete',
    passport.authenticate('accessToken', { session: false }),
    commentController.deleteCommentHandler
);


export default commentRouters;