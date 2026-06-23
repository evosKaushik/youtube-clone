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
  getAllHistory,
  getAllDownloads,
  getDownloadCount,
  getTodayStats,
  searchSuggestionsController
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
router.get("/downloads", authMiddleware, getAllDownloads)
router.get("/downloads/count", authMiddleware, getDownloadCount)
router.get("/today-stats", authMiddleware, getTodayStats)
router.put("/like/:vid", authMiddleware, updateLikes);
router.get("/", getAllVideos);
router.get("/search", searchController);
router.get("/suggestions", searchSuggestionsController);
router.get("/:vid", getVideoById);
router.get("/download/:videoId", authMiddleware,checkIsWatchLimitOver, downloadVideoByVideoId);
router.post("/heartbeat", authMiddleware,checkIsWatchLimitOver, heartbeatController);
router.post("/stop", authMiddleware,checkIsWatchLimitOver, stopWatchController);

export default router;