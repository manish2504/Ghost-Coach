import { getScoreBadgeClass, getScoreLabel } from '../utils/scoreUtils';

export default function ScoreBadge({ score, showLabel = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className={getScoreBadgeClass(score)}>{score}/10</span>
      {showLabel && (
        <span className="text-xs text-gray-400">{getScoreLabel(score)}</span>
      )}
    </div>
  );
}
