import express from "express";

import {
  updateLikes,
  uploadVideoController,
  getAllVideos,
  getVideoById,
  searchController,
  downloadVideoByVideoId,
  heartbeatController,
  stopWatchController,
  getAllHistory
} from "../controllers/video.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import { checkIsWatchLimitOver } from "../middleware/isWatchLimitCheckMiddleware.js";



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

router.get("/history", authMiddleware, getAllHistory)
router.put("/like/:vid", authMiddleware, updateLikes);
router.get("/", getAllVideos);
router.get("/search", searchController);
router.get("/:vid", authMiddleware, checkIsWatchLimitOver, getVideoById);
router.get("/download/:videoId", authMiddleware,checkIsWatchLimitOver, downloadVideoByVideoId);
router.post("/heartbeat", authMiddleware,checkIsWatchLimitOver, heartbeatController);
router.post("/stop", authMiddleware,checkIsWatchLimitOver, stopWatchController);

export default router;