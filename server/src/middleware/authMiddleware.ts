import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import User from "../model/user.model.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.headers?.userid


    if (!isValidObjectId(userId)) return res.status(400).json({ error: "Invalid userId" })
    try {

        const user = await User.findById(userId).lean()

        if (!user) return res.status(404).json({ error: "user not found" })

        req.user = user
        next()

    } catch (error) {

    }
}