import express from "express";
import { addComment, getCommentsByVideo } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post("/", authMiddleware, addComment);

router.get("/:vid", getCommentsByVideo);

export default router;