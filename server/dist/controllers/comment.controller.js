import { addCommentService, getCommentsService, toggleLikeCommentService, toggleDislikeCommentService } from "../services/comment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const addComment = async (req, res, next) => {
    try {
        const { targetId, targetType, body } = req.body;
        const userId = req.user?._id;
        const populatedComment = await addCommentService(userId, targetId, targetType, body);
        return res.status(201).json(new ApiResponse(201, populatedComment, "Comment added successfully"));
    }
    catch (error) {
        next(error);
    }
};
const getComments = async (req, res, next) => {
    try {
        const targetId = req.params.targetId;
        const targetType = req.query.targetType;
        const comments = await getCommentsService(targetId, targetType);
        return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
    }
    catch (error) {
        next(error);
    }
};
const toggleLikeComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user?._id;
        const isLike = await toggleLikeCommentService(commentId, userId);
        return res.status(200).json(new ApiResponse(200, { isLike }, "Like toggled"));
    }
    catch (error) {
        next(error);
    }
};
const toggleDislikeComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user?._id;
        await toggleDislikeCommentService(commentId, userId);
        return res.status(200).json(new ApiResponse(200, null, "Dislike toggled"));
    }
    catch (error) {
        next(error);
    }
};
export { addComment, getComments, toggleLikeComment, toggleDislikeComment };
