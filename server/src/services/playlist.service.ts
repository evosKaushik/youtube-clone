import { isValidObjectId } from "mongoose";
import Playlist from "../model/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";

export const addVideoToPlaylistService = async (userId: string, vid: string, type: string) => {
  if (!vid || !type) {
    throw new ApiError(400, "All fields are required");
  }

  if (!isValidObjectId(vid)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const playlist = await Playlist.create({
    videoId: vid,
    userId,
    type,
  });

  if (!playlist) {
    throw new ApiError(400, "Playlist not created");
  }

  return playlist;
};

export const getAllPlaylistVideoService = async (userId: string, type: string) => {
  if (!type) {
    throw new ApiError(400, "All fields are required");
  }

  const playlists = await Playlist.find({
    userId,
    type: type as "watchLater" | "like",
  })
    .populate("videoId")
    .limit(10)
    .lean();

  if (!playlists) {
    throw new ApiError(404, "Playlist not found");
  }

  return playlists;
};
