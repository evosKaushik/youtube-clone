import Subscription from "../model/subscription.model.js";
import User from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "mongoose";

export const subscribeToChannel = async (subscriberId: string, channelId: string) => {
  if (!isValidObjectId(subscriberId) || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (subscriberId === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const channel = await User.findById(channelId).lean();
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const existing = await Subscription.findOne({ subscriber: subscriberId, channel: channelId });
  if (existing) {
    throw new ApiError(400, "Already subscribed to this channel");
  }

  await Subscription.create({ subscriber: subscriberId, channel: channelId });

  // Increment subscriber count on the channel owner
  await User.findByIdAndUpdate(channelId, { $inc: { subscriberCount: 1 } });

  const newCount = (channel.subscriberCount || 0) + 1;
  return { subscribed: true, subscriberCount: newCount };
};

export const unsubscribeFromChannel = async (subscriberId: string, channelId: string) => {
  if (!isValidObjectId(subscriberId) || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const existing = await Subscription.findOne({ subscriber: subscriberId, channel: channelId });
  if (!existing) {
    throw new ApiError(400, "Not subscribed to this channel");
  }

  await Subscription.deleteOne({ _id: existing._id });

  // Decrement subscriber count, but not below 0
  await User.findByIdAndUpdate(channelId, { $inc: { subscriberCount: -1 } });

  const channel = await User.findById(channelId).select("subscriberCount").lean();
  const newCount = Math.max(0, (channel?.subscriberCount || 0));
  return { subscribed: false, subscriberCount: newCount };
};

export const getSubscriptions = async (userId: string) => {
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const subscriptions = await Subscription.find({ subscriber: userId })
    .populate("channel", "_id channelName channelUsername profilePicture subscriberCount")
    .sort({ createdAt: -1 })
    .lean();

  return subscriptions.map((sub) => ({
    _id: sub._id,
    channel: sub.channel,
  }));
};

export const checkSubscription = async (subscriberId: string, channelId: string) => {
  if (!isValidObjectId(subscriberId) || !isValidObjectId(channelId)) {
    return { subscribed: false };
  }

  const existing = await Subscription.findOne({ subscriber: subscriberId, channel: channelId });
  return { subscribed: !!existing };
};

export const getSubscriberCount = async (userId: string) => {
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const count = await Subscription.countDocuments({ channel: userId });
  return { subscriberCount: count };
};
