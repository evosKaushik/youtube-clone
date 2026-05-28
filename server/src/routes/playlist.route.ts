import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addVideoToPlaylistController,
  getAllPlaylistVideo,
} from "../controllers/playlist.controller.js";

const router = express.Router();

router.post("/", authMiddleware, addVideoToPlaylistController);
router.get("/", authMiddleware, getAllPlaylistVideo);

export default router;
