import ScoreBadge from './ScoreBadge';
import StanceOverlay from './StanceOverlay';

export default function SessionModal({ session, onClose }) {
  if (!session) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-pitch-800 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-pitch-800 px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Session Analysis</h2>
            <p className="text-sm text-gray-400">
              {new Date(session.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBadge score={session.overallScore} showLabel />
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <StanceOverlay imageUrl={session.imageUrl} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald-500/10 p-4 ring-1 ring-emerald-500/20">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-400">
                <span>✓</span> Strengths
              </h3>
              <ul className="space-y-2">
                {session.strengths?.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-400">
                <span>↑</span> Areas to Improve
              </h3>
              <ul className="space-y-2">
                {session.areasToImprove?.map((a, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    • {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-ghost-500/10 p-4 ring-1 ring-ghost-500/20">
            <h3 className="font-semibold text-ghost-400">Priority Fix</h3>
            <p className="mt-2 text-sm text-gray-300">{session.priorityFix}</p>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <h3 className="font-semibold text-white">Recommended Drill</h3>
            <p className="mt-2 text-sm text-gray-300">{session.drillSuggestion}</p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-sm text-gray-400">Analysis Confidence</span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                session.confidenceLevel === 'High'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : session.confidenceLevel === 'Medium'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-red-500/20 text-red-400'
              }`}
            >
              {session.confidenceLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
