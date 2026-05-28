import * as sessionService from '../services/sessionService.js';
import { success } from '../utils/apiResponse.js';

export async function uploadSession(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error('No image file provided');
      err.statusCode = 400;
      throw err;
    }

    const session = await sessionService.createSession(
      req.userId,
      req.file.path,
      req.file.originalname
    );

    return success(res, { session }, 201);
  } catch (err) {
    next(err);
  }
}

export async function getSessions(req, res, next) {
  try {
    const sessions = await sessionService.getSessionsByUser(req.userId);
    const progress = await sessionService.getProgressStats(req.userId);
    return success(res, { sessions, progress });
  } catch (err) {
    next(err);
  }
}

export async function getSession(req, res, next) {
  try {
    const session = await sessionService.getSessionById(req.params.id, req.userId);
    return success(res, { session });
  } catch (err) {
    next(err);
  }
}
