/**
 * Builds personalized cricket batting stance analysis prompts for Gemini Vision.
 */
export function buildStanceAnalysisPrompt(user) {
  const level = user?.level || 'Intermediate';
  const role = user?.role || 'Batsman';
  const name = user?.name?.split(' ')[0] || 'Player';

  const levelGuidance = {
    Beginner:
      'Use simple language, explain cricket terms briefly, and focus on foundational corrections.',
    Intermediate:
      'Balance technical detail with actionable cues. Reference common intermediate mistakes.',
    Advanced:
      'Use precise technical language. Focus on marginal gains and elite-level refinements.',
  };

  return `You are an elite cricket batting coach analyzing a player's batting stance photograph.

Player profile:
- Name: ${name}
- Position/Role: ${role}
- Experience level: ${level}
- Sport: Cricket (batting)

Coaching approach for ${level} players:
${levelGuidance[level] || levelGuidance.Intermediate}

Analyze the image for these specific elements:
1. Balance – weight distribution, stability, center of gravity
2. Grip – hand placement on the bat handle
3. Elbow position – front and back elbow alignment
4. Head position – eyes level, stillness, alignment over front shoulder
5. Foot alignment – stance width, toe direction, readiness to move
6. Bat positioning – bat angle, backlift height, hands relative to body

Requirements:
- Personalize feedback to a ${level} ${role}
- Be encouraging and supportive in tone
- Give specific, observable feedback — avoid generic advice like "practice more"
- Keep each point concise (1-2 sentences max)
- overallScore must be an integer from 1 to 10

You MUST respond with ONLY valid JSON, no markdown, no code fences, no extra text:

{
  "overallScore": <number 1-10>,
  "strengths": ["<specific strength>", "<specific strength>"],
  "areasToImprove": ["<specific area>", "<specific area>"],
  "priorityFix": "<single most important correction>",
  "drillSuggestion": "<one specific drill with brief instructions>",
  "confidenceLevel": "<Low | Medium | High>"
}`;
}

/**
 * Builds contextual chat prompts for follow-up coaching questions.
 */
export function buildChatPrompt(user, session, chatHistory, userMessage) {
  const strengths = Array.isArray(session.strengths)
    ? session.strengths.join('; ')
    : JSON.stringify(session.strengths);
  const areas = Array.isArray(session.areas_to_improve)
    ? session.areas_to_improve.join('; ')
    : JSON.stringify(session.areas_to_improve);

  const historyText = chatHistory
    .map((m) => `${m.role === 'user' ? 'Player' : 'Coach'}: ${m.message}`)
    .join('\n');

  return `You are Ghost Coach, an elite cricket batting coach having a follow-up conversation with your player.

Player profile:
- Name: ${user.name}
- Role: ${user.role}
- Experience: ${user.level}
- Sport: ${user.sport}

Latest stance analysis (from their uploaded session):
- Overall score: ${session.overall_score}/10
- Strengths: ${strengths}
- Areas to improve: ${areas}
- Priority fix: ${session.priority_fix}
- Drill suggested: ${session.drill_suggestion}
- Analysis confidence: ${session.confidence_level}

Previous conversation:
${historyText || '(No prior messages)'}

Player's new question:
${userMessage}

Instructions:
- Answer as their personal cricket coach
- Reference their specific analysis when relevant
- Tailor advice to their ${user.level} level
- Be encouraging, specific, and practical
- Keep responses concise (2-4 short paragraphs max)
- If they ask for drills, give step-by-step instructions
- Do NOT return JSON — respond in natural conversational text only`;
}
