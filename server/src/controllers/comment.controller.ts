import { Request, Response } from "express";
import Comment from "../model/comment.model.js";


const addComment = async (req: Request, res: Response) => {
    try {
        const { targetId, targetType, body } = req.body;

        if (!targetId || !targetType || !body) {
            return res.status(400).json({
                message: "Missing fields",
            });
        }

        const trimmedBody = body.trim();

        if (!trimmedBody) {
            return res.status(400).json({
                message: "Comment cannot be empty",
            });
        }

        if (trimmedBody.length > 500) {
            return res.status(400).json({
                message: "Comment too long",
            });
        }

        const allowedTypes = ["Video", "User"];

        if (!allowedTypes.includes(targetType)) {
            return res.status(400).json({
                message: "Invalid target type",
            });
        }

        const comment = await Comment.create({
            targetId,
            targetType,
            userId: req.user?._id,
            body: trimmedBody,
        });

        const populatedComment = await Comment.findById(
            comment._id
        )
            .select("-__v -isDeleted -updatedAt -targetType")
            .populate(
                "userId",
                "name username profilePicture city"
            );

        return res.status(201).json(populatedComment);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};
const getComments = async (req: Request, res: Response) => {
    try {
        const { targetId } = req.params;
        const targetType = req.query.targetType as "User" | "Video";



        if (!targetType || !targetId) {
            return res.status(400).json({
                message: "Target type required",
            });
        }

        const comments = await Comment.find({
            targetId,
            targetType,
            isDeleted: false,
        })
            .select("-__v -isDeleted -updatedAt -targetType")
            .sort({
                createdAt: -1,
            })
            .populate(
                "userId",
                "name username profilePicture city"
            ).lean();

        return res.status(200).json(comments);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};
const toggleLikeComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;


        const userId = req.user?._id;



        const comment = await Comment.findById(
            commentId
        );

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        const alreadyLiked =
            comment.likes.includes(userId);

        if (alreadyLiked) {
            comment.likes = comment.likes.filter(
                (id: any) =>
                    id?.toString() !==
                    userId?.toString()
            );
            await comment.save();
            return res.status(200).json({
                isLike: true
            });
        } else {
            comment.likes.push(userId);

            // remove dislike if exists
            comment.dislikes =
                comment.dislikes?.filter(
                    (id: any) =>
                        id?.toString() !==
                        userId?.toString()
                );
        }

        await comment.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};
const toggleDislikeComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;

        const userId = req.user?._id;

        const comment = await Comment.findById(
            commentId
        );

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        const alreadyDisliked =
            comment.dislikes.includes(userId);

        if (alreadyDisliked) {
            comment.dislikes =
                comment.dislikes.filter(
                    (id: any) =>
                        id.toString() !==
                        userId.toString()
                );
        } else {
            comment.dislikes.push(userId);

            // remove like if exists
            comment.likes = comment.likes.filter(
                (id: any) =>
                    id.toString() !==
                    userId.toString()
            );
        }

        // auto moderation
        if (
            comment.dislikes.length >= 2
        ) {
            comment.isDeleted = true;
        }

        await comment.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};
export { addComment, getComments, toggleLikeComment, toggleDislikeComment }