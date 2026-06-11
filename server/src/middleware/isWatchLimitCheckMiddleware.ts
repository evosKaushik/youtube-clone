import { NextFunction, Request, Response } from "express";

export const checkIsWatchLimitOver = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    try {
        if (user.isCurrentWatchTimeExcised) return res.status(403).json({ error: "Your Daily watch Time excised!" })
            console.log("Current Watch Time Excised:", user.isCurrentWatchTimeExcised)
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Server error",
        });
    }
}