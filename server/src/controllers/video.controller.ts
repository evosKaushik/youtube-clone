import { NextFunction, Request, Response } from "express";
import {
  uploadVideoService,
  updateLikesService,
  getAllVideosService,
  getVideoByIdService,
  searchVideosService,
  downloadVideoService,
  getAllHistoryService,
  getAllDownloadsService,
  getDownloadCountService,
  getTodayStatsService,
} from "../services/video.service.js";
import { finalizeWatch, updateHeartbeat } from "../services/heartBeat.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] | undefined };
  const videoFile = files?.video?.[0];
  const thumbnailFile = files?.thumbnail?.[0];
  const { title, description } = req.body;
  const userId = req.user?._id;

  try {
    const video = await uploadVideoService(userId, title, description, videoFile, thumbnailFile);
    return res.status(201).json(new ApiResponse(201, { video }, "Video uploaded successfully"));
  } catch (error) {
    next(error);
  }
};

const updateLikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vid: videoId } = req.params;
    const userId = req?.user?._id;
    const updatedLikes = await updateLikesService(videoId, userId);
    return res.status(200).json(new ApiResponse(200, { updatedLikes }, "Likes updated successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const videos = await getAllVideosService();
    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getVideoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vid } = req.params;
    const video = await getVideoByIdService(vid);
    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const searchController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    const results = await searchVideosService(q as string);
    return res.status(200).json(new ApiResponse(200, { count: results.length, data: results }, "Search results fetched"));
  } catch (error) {
    next(error);
  }
};

const downloadVideoByVideoId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    const downloadUrl = await downloadVideoService(videoId, userId);
    return res.status(200).json(new ApiResponse(200, { downloadUrl }, "Download URL generated"));
  } catch (error) {
    next(error);
  }
};

const heartbeatController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { videoId } = req.body;

  try {
    await updateHeartbeat(userId, videoId);
    return res.status(200).json(new ApiResponse(200, null, "Heartbeat updated"));
  } catch (error: any) {
    // heartBeat.js throws Error objects, so we need to map them to next(error)
    if (error?.message === "Your watch limit is completed") {
      error.statusCode = 403;
    }
    next(error);
  }
};

const stopWatchController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { videoId } = req.body;

  try {
    await finalizeWatch(userId, videoId);
    return res.status(200).json(new ApiResponse(200, null, "Watch finalized"));
  } catch (error) {
    next(error);
  }
};

const getTodayStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const stats = await getTodayStatsService(userId);
    return res.status(200).json(new ApiResponse(200, stats, "Today stats fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const historyVideos = await getAllHistoryService(userId);
    return res.status(200).json(new ApiResponse(200, historyVideos, "History fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllDownloads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const downloads = await getAllDownloadsService(userId);
    return res.status(200).json(new ApiResponse(200, downloads, "Downloads fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getDownloadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const count = await getDownloadCountService(userId);
    return res.status(200).json(new ApiResponse(200, { count }, "Download count fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export {
  uploadVideoController,
  updateLikes,
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
};
