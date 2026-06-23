import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  subscribe,
  unsubscribe,
  getMySubscriptions,
  check,
} from "../controllers/subscription.controller.js";

const router = express.Router();

router.post("/:channelId/subscribe", authMiddleware, subscribe);
router.post("/:channelId/unsubscribe", authMiddleware, unsubscribe);
router.get("/my-subscriptions", authMiddleware, getMySubscriptions);
router.get("/:channelId/check", authMiddleware, check);

export default router;
