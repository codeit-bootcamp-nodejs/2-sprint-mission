import express, { NextFunction, Request, Response } from "express";
import likeRouter from "./like.router";
import commentRouter from "./comment.router";
import authenticate from "../middlewares/authenticate";
import { validateProduct, validateParamId } from "../middlewares/validators";
import { withAsync } from "../utils/error";
import ProductController from "../controllers/product.controller";

const router = express.Router();
router.route("/")
  .get(withAsync(ProductController.getProduct))
  .post(authenticate, validateProduct, withAsync(ProductController.postProduct));

router.route("/:id")
  .all(validateParamId)
  .get(withAsync(ProductController.getProductById))
  .patch(authenticate, withAsync(ProductController.patchProduct))
  .delete(authenticate, withAsync(ProductController.deleteProduct));

// product 관련 comment router
router.use(
  "/:id/comments",
  validateParamId,
  withAsync((req: Request, res: Response, next: NextFunction) => { req.relationType = "products"; next(); }),
  commentRouter
);

// product 관련 like router
router.use(
  "/:id/like",
  validateParamId,
  withAsync((req: Request, res: Response, next: NextFunction) => { req.relationType = "products"; next(); }),
  likeRouter
);

export default router;
