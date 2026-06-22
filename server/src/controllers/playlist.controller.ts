import { NextFunction, Request, Response } from "express";
import {
  addVideoToPlaylistService,
  getAllPlaylistVideoService,
} from "../services/playlist.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addVideoToPlaylistController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vid, type } = req.body;
    const userId = req.user?._id;
    const playlist = await addVideoToPlaylistService(userId, vid, type as "watchLater" | "like");
    return res.status(201).json(new ApiResponse(201, { playlist }, "Added to playlist successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllPlaylistVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const userId = req.user?._id;
    const playlists = await getAllPlaylistVideoService(userId, type as "watchLater" | "like");
    return res.status(200).json(new ApiResponse(200, { videos: playlists }, "Playlists fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export { addVideoToPlaylistController, getAllPlaylistVideo };
