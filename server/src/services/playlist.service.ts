import { isValidObjectId } from "mongoose";
import Playlist from "../model/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";

export const addVideoToPlaylistService = async (userId: string, vid: string, type: "watchLater" | "like") => {
  if (!vid || !type) {
    throw new ApiError(400, "All fields are required");
  }

  if (!isValidObjectId(vid)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const playlist = await Playlist.create({
    videoId: vid as any,
    userId: userId as any,
    type,
  });

  if (!playlist) {
    throw new ApiError(400, "Playlist not created");
  }

  return playlist;
};

export const getAllPlaylistVideoService = async (userId: string, type: "watchLater" | "like") => {
  if (!type) {
    throw new ApiError(400, "All fields are required");
  }

  const playlists = await Playlist.find({
    userId: userId as any,
    type,
  })
    .populate("videoId")
    .limit(10)
    .lean();

  if (!playlists) {
    throw new ApiError(404, "Playlist not found");
  }

  return playlists;
};
