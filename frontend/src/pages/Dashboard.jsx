import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionsAPI } from '../services/api';
import StatCard from '../components/StatCard';
import ProgressChart from '../components/ProgressChart';
import SessionCard from '../components/SessionCard';
import SessionModal from '../components/SessionModal';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await sessionsAPI.getAll();
        setSessions(data.data.sessions);
        setProgress(data.data.progress);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Player';

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">
          Hey {firstName} 👋
        </h1>
        <p className="mt-1 text-gray-400">
          {user?.level} {user?.role} · Track your batting progress
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Average Score"
          value={progress?.averageScore || '—'}
          icon="📈"
          accent="ghost"
        />
        <StatCard
          label="Best Score"
          value={progress?.bestScore || '—'}
          icon="🏆"
          accent="emerald"
        />
        <StatCard
          label="Total Sessions"
          value={progress?.totalSessions || 0}
          icon="🏏"
          accent="amber"
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="gradient-card p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-white">
            Score Trend
          </h2>
          {progress?.trend?.length > 0 ? (
            <ProgressChart trend={progress.trend} />
          ) : (
            <EmptyState
              icon="📊"
              title="No data yet"
              description="Upload your first stance to see your progress chart"
              action={
                <Link to="/upload" className="btn-primary text-sm">
                  Analyze Stance
                </Link>
              }
            />
          )}
        </div>

        <div className="gradient-card flex flex-col justify-center p-6">
          <div className="text-center">
            <span className="text-5xl">🏏</span>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">
              Ready to improve?
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Upload a batting stance photo for instant AI coaching feedback
            </p>
            <Link to="/upload" className="btn-primary mt-6 inline-flex w-full justify-center">
              Upload Stance
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Recent Sessions</h2>
          {sessions.length > 0 && (
            <Link to="/history" className="text-sm text-ghost-400 hover:text-ghost-300">
              View all →
            </Link>
          )}
        </div>

        {sessions.length === 0 ? (
          <EmptyState
            icon="📷"
            title="No sessions yet"
            description="Your coaching history will appear here after your first analysis"
            action={
              <Link to="/upload" className="btn-primary">
                Get Started
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.slice(0, 3).map((s) => (
              <SessionCard key={s.id} session={s} onExpand={setSelectedSession} />
            ))}
          </div>
        )}
      </div>

      {selectedSession && (
        <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}
    </div>
  );
}
