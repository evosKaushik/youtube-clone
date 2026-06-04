import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
const DownloadModel = mongoose.model(
    "Download",
    downloadSchema,
);

export default DownloadModel;