import { Router } from 'express';
import * as sessionController from '../controllers/sessionController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(authMiddleware);

router.post('/upload', upload.single('image'), sessionController.uploadSession);
router.get('/', sessionController.getSessions);
router.get('/:id', sessionController.getSession);

export default router;
