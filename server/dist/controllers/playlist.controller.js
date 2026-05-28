import Playlist from "../model/playlist.model.js";
import { isValidObjectId } from "mongoose";
const addVideoToPlaylistController = async (req, res) => {
    const { vid, type } = req.body;
    console.log(vid, type);
    if (!vid || !type)
        return res.status(400).json({
            error: "All fields are required",
        });
    if (!isValidObjectId(vid)) {
        return res.status(400).json({
            success: false,
            error: "Invalid video ID",
        });
    }
    try {
        const userId = req?.user?._id;
        const playlist = await Playlist.create({
            videoId: vid,
            userId,
            type,
        });
        if (!playlist)
            return res.status(400).json({ error: "playlist not created" });
        return res.status(201).json({
            success: true,
            playlist,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getAllPlaylistVideo = async (req, res) => {
    const { type } = req.query;
    if (!type)
        return res.status(400).json({
            error: "All fields are required",
        });
    try {
        const userId = req?.user?._id;
        const playlists = await Playlist.find({
            userId,
            type: type,
        }).populate("videoId", "-_id").limit(10);
        if (!playlists)
            return res.status(404).json({ error: "Playlist not found" });
        res.status(200).json({
            videos: playlists,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { addVideoToPlaylistController, getAllPlaylistVideo };
