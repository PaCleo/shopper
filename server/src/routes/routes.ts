import express from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { confirmController } from '../controllers/confirmController.js';
import { getListController } from '../controllers/getListController.js';

const router = express.Router();

router.post('/upload', uploadController);
router.patch('/confirm', confirmController);
router.get('/:customer_code/list', getListController);

export default router;
