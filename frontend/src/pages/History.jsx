import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sessionsAPI } from '../services/api';
import SessionCard from '../components/SessionCard';
import SessionModal from '../components/SessionModal';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await sessionsAPI.getAll();
        setSessions(data.data.sessions);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Session History</h1>
        <p className="mt-1 text-gray-400">
          Review all your past batting stance analyses
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No sessions yet"
          description="Upload your first batting stance to start building your coaching history"
          action={
            <Link to="/upload" className="btn-primary">
              Upload Stance
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onExpand={setSelectedSession}
            />
          ))}
        </div>
      )}

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
