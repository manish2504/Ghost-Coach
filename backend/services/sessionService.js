import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase.js';
import { uploadStanceImage } from './storageService.js';
import { analyzeStanceImage } from './geminiService.js';
import { getUserById } from './authService.js';

export async function createSession(userId, filePath, originalName) {
  const user = await getUserById(userId);
  const analysis = await analyzeStanceImage(filePath, user);
  const imageUrl = await uploadStanceImage(filePath, originalName);

  const sessionId = uuidv4();
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      id: sessionId,
      user_id: userId,
      image_url: imageUrl,
      overall_score: analysis.overallScore,
      strengths: analysis.strengths,
      areas_to_improve: analysis.areasToImprove,
      priority_fix: analysis.priorityFix,
      drill_suggestion: analysis.drillSuggestion,
      confidence_level: analysis.confidenceLevel,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return formatSession(data);
}

export async function getSessionsByUser(userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(formatSession);
}

export async function getSessionById(sessionId, userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  return formatSession(data);
}

export async function getProgressStats(userId) {
  const sessions = await getSessionsByUser(userId);

  if (!sessions.length) {
    return { averageScore: 0, bestScore: 0, totalSessions: 0, trend: [] };
  }

  const scores = sessions.map((s) => s.overallScore);
  const averageScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  const bestScore = Math.max(...scores);

  const trend = [...sessions]
    .reverse()
    .map((s) => ({
      date: new Date(s.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: s.overallScore,
      id: s.id,
    }));

  return { averageScore, bestScore, totalSessions: sessions.length, trend };
}

function formatSession(row) {
  return {
    id: row.id,
    userId: row.user_id,
    imageUrl: row.image_url,
    overallScore: row.overall_score,
    strengths: row.strengths,
    areasToImprove: row.areas_to_improve,
    priorityFix: row.priority_fix,
    drillSuggestion: row.drill_suggestion,
    confidenceLevel: row.confidence_level,
    createdAt: row.created_at,
  };
}
