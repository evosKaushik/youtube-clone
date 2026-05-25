import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videoURL: {
            type: String,
            required: true
        },
        creatorId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
    },
);

const Video = mongoose.model(
    "Video",
    videoSchema,
);

export default Video;