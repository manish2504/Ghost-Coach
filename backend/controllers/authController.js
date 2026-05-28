import * as authService from '../services/authService.js';
import { success, error } from '../utils/apiResponse.js';

export async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    return success(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.userId);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
}
