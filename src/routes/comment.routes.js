import { Router } from "express";
import {
  addComment,
  deleteComment,
  getTweetComments,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/video/:videoId")
  .get(verifyJWT, getVideoComments)
  .post(verifyJWT, addComment);
router
  .route("/tweet/:tweetId")
  .get(verifyJWT, getTweetComments)
  .post(verifyJWT, addComment);
router
  .route("/c/:commentId")
  .delete(verifyJWT, deleteComment)
  .patch(verifyJWT, updateComment);

export default router;
