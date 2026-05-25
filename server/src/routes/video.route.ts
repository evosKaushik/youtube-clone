import express from 'express';
import { updateLikes, uploadVideo } from '../controllers/video.controller.js';

const router = express.Router();

router.post("/", uploadVideo)
router.put("/like", updateLikes)

export default router;