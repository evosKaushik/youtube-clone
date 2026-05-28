import { Request, Response } from "express";
import Comment from "../model/comment.model.js";


const addComment = async (
    req: Request,
    res: Response
) => {
    try {
        const { videoId, body } = req.body;

        if (!videoId || !body) {
            return res.status(400).json({
                message: "Missing fields",
            });
        }

        const comment = await Comment.create({
            videoId,
            userId: req.user?._id,
            body,
        });

        return res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
        });
    }
};

const getCommentsByVideo = async (
    req: Request,
    res: Response
) => {
    try {
        const { vid } = req.params;
        
        const comments = await Comment.find({
            videoId: vid,
        }).sort({
            createdAt: -1,
        }).populate("userId", "name profilePicture username"); //add username also
      
      

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
        });
    }
};

export { addComment, getCommentsByVideo }