import express from "express";
import { validateParamId } from "../middlewares/validators";
import { withAsync } from "../utils/error";
import UserController from "../controllers/user.controller";

const router = express.Router();

router.route("/:id")
  .all(validateParamId)
  .get(withAsync(UserController.getUserInfo))
  .patch(withAsync(UserController.patchUserInfo));

router.route("/:id/password")
  .all(validateParamId)
  .patch(withAsync(UserController.patchUserPassword));

router.route("/:id/products")
  .all(validateParamId)
  .get(withAsync(UserController.getProductByUser));

router.route("/:id/articles")
  .all(validateParamId)
  .get(withAsync(UserController.getArticleByUser));

router.route("/:id/like-products")
  .all(validateParamId)
  .get(withAsync(UserController.getLikeProductByUser));

router.route("/:id/like-articles")
  .all(validateParamId)
  .get(withAsync(UserController.getLikeArticleByUser));

export default router;