import { NextFunction, Request, Response } from "express";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
  getSubscriptions,
  checkSubscription,
} from "../services/subscription.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const channelId = req.params.channelId as string;
    const result = await subscribeToChannel(userId, channelId);
    return res.status(200).json(new ApiResponse(200, result, "Subscribed successfully"));
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const channelId = req.params.channelId as string;
    const result = await unsubscribeFromChannel(userId, channelId);
    return res.status(200).json(new ApiResponse(200, result, "Unsubscribed successfully"));
  } catch (error) {
    next(error);
  }
};

export const getMySubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const subscriptions = await getSubscriptions(userId);
    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscriptions fetched"));
  } catch (error) {
    next(error);
  }
};

export const check = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const channelId = req.params.channelId as string;
    const result = await checkSubscription(userId, channelId);
    return res.status(200).json(new ApiResponse(200, result, "Subscription status checked"));
  } catch (error) {
    next(error);
  }
};
