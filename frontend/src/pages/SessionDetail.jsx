import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sessionsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ScoreBadge from '../components/ScoreBadge';
import StanceOverlay from '../components/StanceOverlay';
import ChatPanel from '../components/ChatPanel';

export default function SessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await sessionsAPI.getById(id);
        setSession(data.data.session);
      } catch {
        setError('Session not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="text-center">
        <p className="text-red-400">{error || 'Session not found'}</p>
        <Link to="/history" className="btn-secondary mt-4 inline-flex">
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="mb-6">
        <Link to="/history" className="text-sm text-gray-400 hover:text-ghost-400">
          ← Back to History
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-white">Session Details</h1>
          <ScoreBadge score={session.overallScore} showLabel />
        </div>
        <p className="text-sm text-gray-500">
          {new Date(session.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="gradient-card p-4">
            <StanceOverlay imageUrl={session.imageUrl} />
          </div>

          <div className="gradient-card space-y-4 p-5">
            <div>
              <h3 className="text-sm font-semibold text-emerald-400">Strengths</h3>
              <ul className="mt-2 space-y-1">
                {session.strengths?.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-400">Areas to Improve</h3>
              <ul className="mt-2 space-y-1">
                {session.areasToImprove?.map((a, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    • {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-ghost-500/10 p-3">
              <h3 className="text-xs font-semibold text-ghost-400">Priority Fix</h3>
              <p className="mt-1 text-sm text-gray-300">{session.priorityFix}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <h3 className="text-xs font-semibold text-white">Drill</h3>
              <p className="mt-1 text-sm text-gray-300">{session.drillSuggestion}</p>
            </div>
          </div>
        </div>

        <ChatPanel sessionId={session.id} />
      </div>
    </div>
  );
}
