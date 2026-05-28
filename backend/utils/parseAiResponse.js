/**
 * Parses Gemini JSON response, handling markdown fences if present.
 */
export function parseStanceAnalysisResponse(text) {
  let cleaned = text.trim();

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  const required = [
    'overallScore',
    'strengths',
    'areasToImprove',
    'priorityFix',
    'drillSuggestion',
    'confidenceLevel',
  ];

  for (const field of required) {
    if (parsed[field] === undefined || parsed[field] === null) {
      throw new Error(`AI response missing required field: ${field}`);
    }
  }

  const score = Math.round(Number(parsed.overallScore));
  if (isNaN(score) || score < 1 || score > 10) {
    throw new Error('Invalid overallScore from AI');
  }

  const validConfidence = ['Low', 'Medium', 'High'];
  if (!validConfidence.includes(parsed.confidenceLevel)) {
    parsed.confidenceLevel = 'Medium';
  }

  return {
    overallScore: score,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [String(parsed.strengths)],
    areasToImprove: Array.isArray(parsed.areasToImprove)
      ? parsed.areasToImprove
      : [String(parsed.areasToImprove)],
    priorityFix: String(parsed.priorityFix),
    drillSuggestion: String(parsed.drillSuggestion),
    confidenceLevel: parsed.confidenceLevel,
  };
}
