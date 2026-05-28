export function getScoreBadgeClass(score) {
  if (score >= 8) return 'score-badge-green';
  if (score >= 5) return 'score-badge-yellow';
  return 'score-badge-red';
}

export function getScoreLabel(score) {
  if (score >= 8) return 'Excellent';
  if (score >= 5) return 'Good';
  return 'Needs Work';
}

export function getScoreColor(score) {
  if (score >= 8) return '#34d399';
  if (score >= 5) return '#fbbf24';
  return '#f87171';
}
