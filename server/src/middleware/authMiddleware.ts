import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import User from "../model/user.model.js";
import VideoHistory from "../model/videoHistory.model.js";

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.headers?.userid;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        // Check if premium subscription is expired
        const subscription = user.subscription;
        const isSubExpired =
            subscription?.expiresAt &&
            Date.now() > new Date(subscription.expiresAt).getTime();

        if (isSubExpired) {
            await User.updateOne(
                { _id: userId },
                {
                    $set: {
                        "subscription.plan": "Free",
                        "subscription.status": "expired",
                        "subscription.watchTimeInMinutes": 5, // Default Free limit
                        "subscription.noOfDownloads": 0,
                        "subscription.expiresAt": null,
                        "isCurrentWatchTimeExcised": false,
                    }
                }
            );
            if (!user.subscription) {
                user.subscription = {
                    plan: "Free",
                    status: "expired",
                    watchTimeInMinutes: 5,
                    noOfDownloads: 0,
                    expiresAt: null,
                };
            }
        }

        const history = await VideoHistory.findOne({ userId }).sort({
            updatedAt: -1,
        });

        if (history) {
            const now = Date.now();
            const lastTime = new Date(history.lastHeartbeatAt).getTime();

            const isExpired = now - lastTime > SESSION_TIMEOUT;

            if (isExpired) {
                await User.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            isCurrentWatchTimeExcised: false,
                        },
                    }
                );
                user.isCurrentWatchTimeExcised = false;
            }
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Server error",
        });
    }
};