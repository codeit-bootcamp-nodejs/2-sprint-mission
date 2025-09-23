import express from "express";
import authenticate from "../middlewares/authenticate";
import { withAsync } from "../utils/error";
import { LikeController } from "../controllers/like.controller";

const router = express.Router();

router.route("/").post(authenticate, withAsync(LikeController.toggleLike));

export default router;