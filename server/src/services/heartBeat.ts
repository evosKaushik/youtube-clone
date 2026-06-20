import User from "../model/user.model.js";
import VideoHistory from "../model/videoHistory.model.js";

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const INCREMENT = 10;

export const updateHeartbeat = async (userId: string, videoId: string) => {
  try {
    const user = await User.findById(userId).select("subscription").lean();

    if (!user) throw new Error("User not Found!");

    const userWatchLimit = Number(user?.subscription?.watchTimeInMinutes ?? 0) * 60;

    let history = await VideoHistory.findOne({ userId, videoId });

    const now = Date.now();

    if (!history) {
      const activeThreshold = new Date(now - SESSION_TIMEOUT);
      const otherHistories = await VideoHistory.find({
        userId,
        lastHeartbeatAt: { $gte: activeThreshold },
      });
      const totalWatchedBefore = otherHistories.reduce(
        (sum, h) => sum + h.totalWatchedSeconds,
        0
      );

      if (userWatchLimit > 0 && totalWatchedBefore + INCREMENT >= userWatchLimit) {
        await User.findByIdAndUpdate(userId, { isCurrentWatchTimeExcised: true });
        throw new Error("Your watch limit is completed");
      } else {
        await User.findByIdAndUpdate(userId, { isCurrentWatchTimeExcised: false });
      }

      return await VideoHistory.create({
        userId,
        videoId,
        totalWatchedSeconds: INCREMENT,
        lastHeartbeatAt: now,
      });
    }

    const lastTime = new Date(history.lastHeartbeatAt).getTime();

    if (now - lastTime > SESSION_TIMEOUT) {
      history.totalWatchedSeconds = INCREMENT;
      history.lastHeartbeatAt = new Date(now);
      await history.save();

      const activeThreshold = new Date(now - SESSION_TIMEOUT);
      const allHistories = await VideoHistory.find({
        userId,
        lastHeartbeatAt: { $gte: activeThreshold },
      });

      const otherWatched = allHistories
        .filter((h) => h.videoId.toString() !== videoId)
        .reduce((sum, h) => sum + h.totalWatchedSeconds, 0);

      const totalWatched = otherWatched + history.totalWatchedSeconds;

      if (userWatchLimit > 0 && totalWatched >= userWatchLimit) {
        await User.findByIdAndUpdate(userId, { isCurrentWatchTimeExcised: true });
        throw new Error("Your watch limit is completed");
      } else {
        await User.findByIdAndUpdate(userId, { isCurrentWatchTimeExcised: false });
      }

      return history;
    }

    const activeThreshold = new Date(now - SESSION_TIMEOUT);
    const allHistories = await VideoHistory.find({
      userId,
      lastHeartbeatAt: { $gte: activeThreshold },
    });

    const otherWatched = allHistories
      .filter((h) => h.videoId.toString() !== videoId)
      .reduce((sum, h) => sum + h.totalWatchedSeconds, 0);

    const currentWatched = history.totalWatchedSeconds;
    const totalWatched = otherWatched + currentWatched;

    if (userWatchLimit > 0 && totalWatched + INCREMENT >= userWatchLimit) {
      await User.findByIdAndUpdate(userId, { isCurrentWatchTimeExcised: true });
      history.totalWatchedSeconds += INCREMENT;
      history.lastHeartbeatAt = new Date(now);
      await history.save();
      throw new Error("Your watch limit is completed");
    } else {
      await User.findByIdAndUpdate(userId, { isCurrentWatchTimeExcised: false });
    }

    history.totalWatchedSeconds += INCREMENT;
    history.lastHeartbeatAt = new Date(now);
    await history.save();

    return history;
  } catch (error) {
    throw error;
  }
};

export const finalizeWatch = async (userId: string, videoId: string) => {
  try {
    const history = await VideoHistory.findOne({ userId, videoId });

    if (!history) return;

    history.sessionEndedAt = new Date();
    await history.save();

    return history;
  } catch (error) {
    throw error;
  }
};