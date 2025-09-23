import express, { NextFunction, Request, Response } from "express";
import authenticate from "../middlewares/authenticate";
import { validateComment, validateParamId } from "../middlewares/validators";
import { withAsync } from "../utils/error";
import CommentController from "../controllers/comment.controller";

const router = express.Router();

router.route("/")
  .get(withAsync((req:Request, res:Response, next:NextFunction) => {
    if (req.relationType === "articles") return CommentController.getArticleComments(req, res);
    if (req.relationType === "products") return CommentController.getProductComments(req, res);
    next();
  }))
  .post(authenticate, validateComment, withAsync((req:Request, res:Response, next:NextFunction) => {
    if (req.relationType === "articles") return CommentController.postArticleComment(req, res);
    if (req.relationType === "products") return CommentController.postProductComment(req, res);
    next();
  }));

router.route("/:commentId")
  .all(authenticate, validateParamId)
  .patch(validateComment, withAsync(CommentController.patchComment))
  .delete(withAsync(CommentController.deleteComment));

export default router;
