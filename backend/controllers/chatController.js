import * as chatService from '../services/chatService.js';
import { success } from '../utils/apiResponse.js';

export async function sendMessage(req, res, next) {
  try {
    const result = await chatService.sendChatMessage(
      req.params.sessionId,
      req.userId,
      req.body.message
    );
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const messages = await chatService.getChatMessages(
      req.params.sessionId,
      req.userId
    );
    return success(res, { messages });
  } catch (err) {
    next(err);
  }
}
