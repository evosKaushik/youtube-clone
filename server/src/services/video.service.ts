import { isValidObjectId } from "mongoose";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Video from "../model/video.model.js";
import Playlist from "../model/playlist.model.js";
import DownloadModel from "../model/download.model.js";
import User from "../model/user.model.js";
import VideoHistory from "../model/videoHistory.model.js";
import { getDownloadUrl } from "./downloadVideos.js";
import { ApiError } from "../utils/ApiError.js";

export const cleanupUploadedFiles = (
  videoFile?: Express.Multer.File,
  thumbnailFile?: Express.Multer.File
) => {
  if (videoFile?.path && fs.existsSync(videoFile.path)) {
    fs.unlinkSync(videoFile.path);
  }

  if (thumbnailFile?.path && fs.existsSync(thumbnailFile.path)) {
    fs.unlinkSync(thumbnailFile.path);
  }
};

export const uploadVideoService = async (
  userId: string,
  title: string,
  description: string,
  videoFile?: Express.Multer.File,
  thumbnailFile?: Express.Multer.File
) => {
  if (!title?.trim()) throw new ApiError(400, "Title is required");
  if (!description?.trim()) throw new ApiError(400, "Description is required");
  if (!videoFile) throw new ApiError(400, "Video is required");

  let uploadedVideo, uploadedThumbnail;

  try {
    uploadedVideo = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
      folder: "videos",
    });

    if (thumbnailFile) {
      uploadedThumbnail = await cloudinary.uploader.upload(thumbnailFile.path, {
        folder: "thumbnails",
      });
    }
  } catch (error) {
    throw new ApiError(500, "Failed to upload to Cloudinary");
  } finally {
    cleanupUploadedFiles(videoFile, thumbnailFile);
  }

  const videoURL = uploadedVideo.secure_url;
  const thumbnailURL = uploadedThumbnail?.secure_url || "";
  const duration = Math.round(uploadedVideo.duration || 0);

  const video = await Video.create({
    name: title.trim(),
    description: description.trim(),
    videoURL,
    thumbnailURL,
    creatorId: userId,
    likes: 0,
    views: 0,
    duration,
  });

  return video;
};

export const updateLikesService = async (videoId: string, userId: string) => {
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  const existingPlaylist = await Playlist.findOne({
    videoId,
    userId,
    type: "like",
  });

  if (existingPlaylist) {
    throw new ApiError(400, "You already like the video");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.likes += 1;
  await video.save();

  await Playlist.create({
    videoId: videoId as any,
    userId: userId as any,
    type: "like",
  });

  return video.likes;
};

export const getAllVideosService = async () => {
  const videos = await Video.find()
    .populate("creatorId", "channelName channelUsername profilePicture")
    .limit(10)
    .select("-__v -updatedAt")
    .lean();

  if (!videos || videos.length === 0) {
    throw new ApiError(404, "No Video Found");
  }

  return videos;
};

export const getVideoByIdService = async (vid: string) => {
  if (!isValidObjectId(vid)) throw new ApiError(400, "Not valid Video Id");

  const video = await Video.findByIdAndUpdate(
    vid,
    { $inc: { views: 1 } },
    { returnDocument: "after" }
  )
    .populate(
      "creatorId",
      "channelName channelUsername channelDescription profilePicture"
    )
    .lean();

  if (!video) throw new ApiError(404, "Video not found");

  return video;
};

export const searchVideosService = async (q: string) => {
  if (!q) throw new ApiError(400, "Search query is required");

  const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const results = await Video.find({
    $or: [
      { name: { $regex: escapedQuery, $options: "i" } },
      { description: { $regex: escapedQuery, $options: "i" } },
    ],
  })
    .populate("creatorId", "channelName channelUsername profilePicture")
    .limit(10)
    .lean();

  return results;
};

export const downloadVideoService = async (videoId: string, userId: string) => {
  if (Array.isArray(videoId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const user = await User.findById(userId).select("subscription").lean();

  if (!user) throw new ApiError(404, "User not found");

  let subscription = user.subscription;

  const isExpired =
    subscription?.expiresAt &&
    Date.now() > new Date(subscription.expiresAt).getTime();

  if (isExpired) {
    await User.updateOne(
      { _id: userId },
      {
        "subscription.plan": "Free",
        "subscription.status": "expired",
        "subscription.watchTimeInMinutes": 5,
        "subscription.noOfDownloads": 0,
        "subscription.expiresAt": null,
      }
    );

    subscription = {
      ...subscription,
      plan: "Free",
      status: "expired",
      watchTimeInMinutes: 5,
      noOfDownloads: 0,
      expiresAt: null,
    };
  }

  const downloadLimit = subscription?.noOfDownloads ?? 1;
  const ONE_DAY_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const downloadsInLast24h = await DownloadModel.countDocuments({
    userId,
    createdAt: { $gte: ONE_DAY_AGO },
  });

  if (downloadsInLast24h >= downloadLimit) {
    const latestDownload = await DownloadModel.findOne({ userId })
      .select("createdAt")
      .sort({ createdAt: -1 })
      .lean();

    let remainingHours = 24;

    if (latestDownload?.createdAt) {
      const timeDiff = Date.now() - latestDownload.createdAt.getTime();
      remainingHours = Math.ceil(
        (24 * 60 * 60 * 1000 - timeDiff) / (1000 * 60 * 60)
      );
    }

    throw new ApiError(
      400,
      `Download limit reached. Try again in ${remainingHours} hour(s).`
    );
  }

  const downloadUrl = await getDownloadUrl(videoId);

  await DownloadModel.create({
    userId,
    videoId,
  });

  return downloadUrl;
};

export const getAllDownloadsService = async (userId: string) => {
  if (!isValidObjectId(userId)) throw new ApiError(400, "Not valid User Id");

  const downloads = await DownloadModel.find({ userId })
    .populate("videoId", "_id name thumbnailURL videoURL creatorId views duration createdAt")
    .sort({ createdAt: -1 })
    .lean();

  if (!downloads || downloads.length === 0) {
    throw new ApiError(404, "No downloads found");
  }

  return downloads;
};

export const getDownloadCountService = async (userId: string) => {
  if (!isValidObjectId(userId)) throw new ApiError(400, "Not valid User Id");

  const count = await DownloadModel.countDocuments({ userId });
  return count;
};

export const getTodayStatsService = async (userId: string) => {
  if (!isValidObjectId(userId)) throw new ApiError(400, "Not valid User Id");

  const ONE_DAY_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Downloads in last 24 hours
  const todayDownloads = await DownloadModel.countDocuments({
    userId,
    createdAt: { $gte: ONE_DAY_AGO },
  });

  // Watch time in last 24 hours (in seconds)
  const watchHistories = await VideoHistory.find({
    userId,
    lastHeartbeatAt: { $gte: ONE_DAY_AGO },
  })
    .select("totalWatchedSeconds")
    .lean();

  const todayWatchSeconds = watchHistories.reduce(
    (sum, h) => sum + (h.totalWatchedSeconds || 0),
    0
  );

  // Total downloads (all time)
  const totalDownloads = await DownloadModel.countDocuments({ userId });

  return {
    todayDownloads,
    todayWatchSeconds,
    totalDownloads,
  };
};

export const getAllHistoryService = async (userId: string) => {
  if (!isValidObjectId(userId)) throw new ApiError(400, "Not valid User Id");

  const historyVideos = await VideoHistory.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "videoId",
      select: "_id name description thumbnailURL videoURL creatorId views duration likes createdAt",
      populate: {
        path: "creatorId",
        select: "channelName channelUsername profilePicture subscriberCount",
      },
    })
    .select("_id videoId totalWatchedSeconds createdAt")
    .lean();

  if (!historyVideos || historyVideos.length === 0) {
    throw new ApiError(404, "History videos not found");
  }

  return historyVideos;
};
