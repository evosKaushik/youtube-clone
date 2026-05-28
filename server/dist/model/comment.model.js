import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema({
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
export default mongoose.model("Comment", commentSchema);
