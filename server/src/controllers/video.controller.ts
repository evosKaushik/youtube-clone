import { Request, Response } from "express";
import Video from "../model/video.model.js";
import { isValidObjectId } from "mongoose";

const uploadVideo = async (req: Request, res: Response) => {
    const { name, description, videoURL } = req.body

    // TODO: fetch the creatorId **auth Middleware
    try {
        if (!name || !description || !videoURL) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }
        const video = await Video.create({
            name,
            description,
            videoURL,
            // creatorId
        })

        res.status(201).json({
            success: true,
            message: "Video uploaded successfully",
            video,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Internal server error"
        })
    }
}

const updateLikes = async (req: Request, res: Response) => {
    const { vidId: videoId } = req?.params
    if (!isValidObjectId(videoId)) {
        return res.status(404).json({
            error: "Video not found"
        })
    }
    try {
        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({
                error: "Video not found"
            })
        }
        video.likes += 1

        await video.save()

        res.status(201).json({
            success: true,

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Internal server error",
            updatedLikes: video.likes
        })
    }
}

export { uploadVideo, updateLikes }