import { Request, Response } from "express";

import { isValidObjectId } from "mongoose";

import Video from "../model/video.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import Playlist from "../model/playlist.model.js";

const uploadVideoController = async (req: Request, res: Response) => {
  try {

    const { title, description } = req.body;

    const files = req.files as {
      [fieldname: string]:
      | Express.Multer.File[]
      | undefined;
    };

    const videoFile =
      files?.video?.[0];

    const thumbnailFile =
      files?.thumbnail?.[0];

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        error:
          "Description is required",
      });
    }

    if (!videoFile) {
      return res.status(400).json({
        success: false,
        error: "Video is required",
      });
    }

    const uploadedVideo =
      await cloudinary.uploader.upload(
        videoFile.path,
        {
          resource_type: "video",

          folder: "videos",
        }
      );

    let uploadedThumbnail = null;

    if (thumbnailFile) {
      uploadedThumbnail =
        await cloudinary.uploader.upload(
          thumbnailFile.path,
          {
            folder: "thumbnails",
          }
        );
    }



    if (fs.existsSync(videoFile.path)) {
      fs.unlinkSync(videoFile.path);
    }

    if (
      thumbnailFile &&
      fs.existsSync(thumbnailFile.path)
    ) {
      fs.unlinkSync(
        thumbnailFile.path
      );
    }

    const videoURL = uploadedVideo.secure_url;

    const thumbnailURL = uploadedThumbnail?.secure_url || "";


    const userId = req.user?._id;

    const video = await Video.create({
      name: title.trim(),
      description: description.trim(),
      videoURL,
      thumbnailURL,
      creatorId: userId,
      likes: 0,
    });



    return res.status(201).json({
      success: true,

      message:
        "Video uploaded successfully",

      video,
    });
  } catch (error) {
    console.error(
      "Upload Video Error:",
      error
    );

    return res.status(500).json({
      success: false,

      error: "Internal server error",
    });
  }
};

const updateLikes = async (req: Request, res: Response) => {
  try {
    const { vid: videoId } = req.params;
      const userId = req?.user?._id

    if (!isValidObjectId(videoId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid video ID",
      });
    }

    const existingPlaylist = await Playlist.findOne({
      videoId,
      userId,
      type: "like"
    })
    
    if(existingPlaylist) return res.status(400).json({error: "You already like the video"})
    
    const video = await Video.findById(
      videoId
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        error: "Video not found",
      });
    }



    video.likes += 1;

    await video.save();
    
    
    await Playlist.create({
      videoId: videoId as any,
      userId: userId as any,
      type: "like"
    })

    return res.status(200).json({
      success: true,

      message:
        "Likes updated successfully",

      updatedLikes: video.likes,
    });
  } catch (error) {
    console.error(
      error
    );

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const getAllVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find().populate("creatorId", "channelName channelUsername profilePicture").limit(10).select("-_v -updatedAt").lean()
    if (!videos) return res.status(404).json({
      error: "no Video Found"
    })

    res.status(200).json(videos)
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

const getVideoById = async (req: Request, res: Response) => {
  try {
    const { vid } = req.params

    if (!isValidObjectId(vid)) return res.status(400).json({ error: "Not valid Video Id" })

    const video = await Video.findById(vid).populate("creatorId", "channelName channelUsername channelDescription profilePicture").lean()

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }

    res.status(200).json(video)

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
const searchController = async (req: Request, res: Response) => {
  try {

    const { q } = req.query;

    // validation
    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // regex search
    const results = await Video.find({
      $or: [
        {
          name: {
            $regex: escapedQuery,
            $options: "i", // case insensitive
          },
        },
        {
          description: {
            $regex: escapedQuery,
            $options: "i",
          },
        },
      ],
    }).populate("creatorId", "channelName channelUsername profilePicture").limit(10).lean();

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  uploadVideoController,
  updateLikes,
  getAllVideos,
  getVideoById,
  searchController
};
