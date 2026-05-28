import fs from 'fs/promises';
import { genAI, VISION_MODEL, CHAT_MODEL } from '../config/gemini.js';
import { buildStanceAnalysisPrompt, buildChatPrompt } from '../utils/promptBuilder.js';
import { parseStanceAnalysisResponse } from '../utils/parseAiResponse.js';

function ensureGemini() {
  if (!genAI) {
    const err = new Error('Gemini API is not configured');
    err.statusCode = 503;
    throw err;
  }
  return genAI;
}

export async function analyzeStanceImage(imagePath, user) {
  const ai = ensureGemini();
  const model = ai.getGenerativeModel({ model: VISION_MODEL });

  const imageBuffer = await fs.readFile(imagePath);
  const base64 = imageBuffer.toString('base64');
  const ext = imagePath.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';

  const prompt = buildStanceAnalysisPrompt(user);

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: `image/${ext}`,
        data: base64,
      },
    },
  ]);

  const responseText = result.response.text();
  return parseStanceAnalysisResponse(responseText);
}

export async function generateChatResponse(user, session, chatHistory, userMessage) {
  const ai = ensureGemini();
  const model = ai.getGenerativeModel({ model: CHAT_MODEL });

  const prompt = buildChatPrompt(user, session, chatHistory, userMessage);
  const result = await model.generateContent(prompt);
  return result.response.text();
}
