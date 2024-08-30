import express from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { confirmController } from '../controllers/confirmController.js';

const router = express.Router();

router.post('/upload', uploadController);
router.patch('/confirm', confirmController);

export default router;
