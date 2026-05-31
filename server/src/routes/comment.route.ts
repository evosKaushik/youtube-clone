import express from "express";

import {
  addComment,
  getComments,
  toggleLikeComment,
  toggleDislikeComment
} from "../controllers/comment.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addComment);

router.get("/:targetId", getComments);
router.post("/like/:commentId",authMiddleware, toggleLikeComment)
router.post("/dislike/:commentId", authMiddleware, toggleDislikeComment)

export default router;