import Comment from "../model/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
export const addCommentService = async (userId, targetId, targetType, body) => {
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
    // Block comments containing special characters
    const specialCharsRegex = /[^a-zA-Z0-9\s.,!?'"@#_\-:;()&]/;
    if (specialCharsRegex.test(trimmedBody)) {
        throw new ApiError(400, "Comments containing special characters are not allowed");
    }
    const allowedTypes = ["Video", "User"];
    if (!allowedTypes.includes(targetType)) {
        throw new ApiError(400, "Invalid target type");
    }
    const comment = await Comment.create({
        targetId: targetId,
        targetType,
        userId: userId,
        body: trimmedBody,
    });
    const populatedComment = await Comment.findById(comment._id)
        .select("-__v -isDeleted -updatedAt -targetType")
        .populate("userId", "name username profilePicture city");
    return populatedComment;
};
export const getCommentsService = async (targetId, targetType) => {
    if (!targetType || !targetId) {
        throw new ApiError(400, "Target type required");
    }
    const comments = await Comment.find({
        targetId: targetId,
        targetType,
        isDeleted: false,
    })
        .select("-__v -isDeleted -updatedAt -targetType")
        .sort({ createdAt: -1 })
        .populate("userId", "name username profilePicture city")
        .lean();
    return comments;
};
export const toggleLikeCommentService = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    const alreadyLiked = comment.likes.includes(userId);
    let isLike = false;
    if (alreadyLiked) {
        comment.likes = comment.likes.filter((id) => id?.toString() !== userId?.toString());
        isLike = true;
    }
    else {
        comment.likes.push(userId);
        comment.dislikes = comment.dislikes?.filter((id) => id?.toString() !== userId?.toString());
        isLike = false;
    }
    await comment.save();
    return isLike;
};
export const toggleDislikeCommentService = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    const alreadyDisliked = comment.dislikes.includes(userId);
    if (alreadyDisliked) {
        comment.dislikes = comment.dislikes.filter((id) => id.toString() !== userId.toString());
    }
    else {
        comment.dislikes.push(userId);
        comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
    }
    if (comment.dislikes.length >= 2) {
        comment.isDeleted = true;
    }
    await comment.save();
    return true;
};
