import { Router } from 'express';
import * as chatController from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateChat } from '../middleware/validate.js';

const router = Router();

router.use(authMiddleware);

router.get('/:sessionId', chatController.getMessages);
router.post('/:sessionId', validateChat, chatController.sendMessage);

export default router;
