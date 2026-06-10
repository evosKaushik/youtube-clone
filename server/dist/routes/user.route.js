import express from 'express';
import { createChannel, userLogin } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post("/login", userLogin);
router.post("/create-channel", authMiddleware, createChannel);
export default router;
