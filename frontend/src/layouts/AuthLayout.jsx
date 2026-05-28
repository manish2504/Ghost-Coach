import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pitch-900 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-ghost-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-ghost-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ghost-500 to-ghost-700 shadow-lg shadow-ghost-500/30">
            <span className="text-3xl">👻</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Ghost Coach
          </h1>
          <p className="mt-1 text-sm text-gray-400">AI-Powered Cricket Batting Analysis</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
