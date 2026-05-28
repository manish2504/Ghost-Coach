import { Link } from 'react-router-dom';
import ScoreBadge from './ScoreBadge';

export default function SessionCard({ session, onExpand }) {
  const date = new Date(session.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="gradient-card group overflow-hidden transition-all hover:border-ghost-500/30 hover:shadow-lg hover:shadow-ghost-500/5">
      <div className="relative aspect-video overflow-hidden bg-black/30">
        <img
          src={session.imageUrl}
          alt="Stance session"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <ScoreBadge score={session.overallScore} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{date}</p>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-gray-300">
          <span className="font-medium text-ghost-400">Priority: </span>
          {session.priorityFix}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onExpand(session)}
            className="btn-secondary flex-1 py-2 text-xs"
          >
            View Details
          </button>
          <Link
            to={`/sessions/${session.id}`}
            className="btn-primary flex-1 py-2 text-center text-xs"
          >
            Coach Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
