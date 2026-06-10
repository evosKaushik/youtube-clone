import express from 'express';
import { translateToEnglishController } from '../controllers/translate.controller.js';
const router = express.Router();
router.post("/", translateToEnglishController);
export default router;
