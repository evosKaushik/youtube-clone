import Comment from "../model/comment.model.js";
import { ApiError } from "../utils/ApiError.js";

export const addCommentService = async (userId: string, targetId: string, targetType: string, body: string) => {
    if (!targetId || !targetType || !body) {
        throw new ApiError(400, "Missing fields");
    }

    const trimmedBody = body.trim();

    if (!trimmedBody) {
        throw new ApiError(400, "Comment cannot be empty");
    }

    if (trimmedBody.length > 500) {
        throw new ApiError(400, "Comment too long");
    }

    const allowedTypes = ["Video", "User"];

    if (!allowedTypes.includes(targetType)) {
        throw new ApiError(400, "Invalid target type");
    }

    const comment = await Comment.create({
        targetId,
        targetType,
        userId,
        body: trimmedBody,
    });

    const populatedComment = await Comment.findById(comment._id)
        .select("-__v -isDeleted -updatedAt -targetType")
        .populate("userId", "name username profilePicture city");

    return populatedComment;
};

export const getCommentsService = async (targetId: string, targetType: string) => {
    if (!targetType || !targetId) {
        throw new ApiError(400, "Target type required");
    }

    const comments = await Comment.find({
        targetId,
        targetType,
        isDeleted: false,
    })
        .select("-__v -isDeleted -updatedAt -targetType")
        .sort({ createdAt: -1 })
        .populate("userId", "name username profilePicture city")
        .lean();

    return comments;
};

export const toggleLikeCommentService = async (commentId: string, userId: string) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const alreadyLiked = comment.likes.includes(userId);

    let isLike = false;

    if (alreadyLiked) {
        comment.likes = comment.likes.filter((id: any) => id?.toString() !== userId?.toString());
        isLike = true;
    } else {
        comment.likes.push(userId);
        comment.dislikes = comment.dislikes?.filter((id: any) => id?.toString() !== userId?.toString());
        isLike = false;
    }

    await comment.save();

    return isLike;
};

export const toggleDislikeCommentService = async (commentId: string, userId: string) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const alreadyDisliked = comment.dislikes.includes(userId);

    if (alreadyDisliked) {
        comment.dislikes = comment.dislikes.filter((id: any) => id.toString() !== userId.toString());
    } else {
        comment.dislikes.push(userId);
        comment.likes = comment.likes.filter((id: any) => id.toString() !== userId.toString());
    }

    if (comment.dislikes.length >= 2) {
        comment.isDeleted = true;
    }

    await comment.save();

    return true;
};
