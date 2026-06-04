import express from "express";

import {
  updateLikes,
  uploadVideoController,
  getAllVideos,
  getVideoById,
  searchController,
  downloadVideoByVideoId
} from "../controllers/video.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";



const router = express.Router();

router.post(
  "/upload",

  authMiddleware,

  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },

    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),

  uploadVideoController
);

router.put("/like/:vid",authMiddleware, updateLikes);
router.get("/", getAllVideos);
router.get("/search", searchController);
router.get("/:vid", getVideoById);
router.get("/download/:videoId",authMiddleware, downloadVideoByVideoId);

export default router;