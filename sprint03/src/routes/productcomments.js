import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";

import {
  createProductComment,
  getProductComments,
  updateProductComment,
  deleteProductComment,
} from "../controllers/product.comment.controller.js";

const router = Router();

router
  .route("/:productId")
  .get(getProductComments)
  .post(authenticate, createProductComment);

router
  .route("/:productId/:commentId")
  .patch(updateProductComment)
  .delete(deleteProductComment);

export default router;
