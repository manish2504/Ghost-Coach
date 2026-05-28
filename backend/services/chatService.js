import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase.js';
import { getUserById } from './authService.js';
import { getSessionById } from './sessionService.js';
import { generateChatResponse } from './geminiService.js';

export async function sendChatMessage(sessionId, userId, message) {
  const user = await getUserById(userId);
  const session = await getSessionById(sessionId, userId);

  const { data: history, error: histError } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (histError) throw new Error(histError.message);

  const userMsgId = uuidv4();
  await supabase.from('chat_messages').insert({
    id: userMsgId,
    session_id: sessionId,
    role: 'user',
    message: message.trim(),
  });

  const dbSession = {
    overall_score: session.overallScore,
    strengths: session.strengths,
    areas_to_improve: session.areasToImprove,
    priority_fix: session.priorityFix,
    drill_suggestion: session.drillSuggestion,
    confidence_level: session.confidenceLevel,
  };

  const aiResponse = await generateChatResponse(
    user,
    dbSession,
    history || [],
    message.trim()
  );

  const assistantMsgId = uuidv4();
  const { data: assistantMsg, error } = await supabase
    .from('chat_messages')
    .insert({
      id: assistantMsgId,
      session_id: sessionId,
      role: 'assistant',
      message: aiResponse,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    userMessage: { id: userMsgId, role: 'user', message: message.trim() },
    assistantMessage: formatMessage(assistantMsg),
  };
}

export async function getChatMessages(sessionId, userId) {
  await getSessionById(sessionId, userId);

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(formatMessage);
}

function formatMessage(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    role: row.role,
    message: row.message,
    createdAt: row.created_at,
  };
}
