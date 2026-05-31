import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        targetId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "targetType",
        },

        targetType: {
            type: String,
            enum: ["Video", "User"],
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        body: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        dislikes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


const Comment = mongoose.model("Comment", commentSchema);
export default Comment