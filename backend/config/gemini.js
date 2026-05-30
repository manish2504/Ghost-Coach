import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY not set');
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
export const VISION_MODEL = 'gemini-2.5-flash';
export const CHAT_MODEL = 'gemini-2.5-flash';
