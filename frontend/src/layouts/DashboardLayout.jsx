import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/upload', label: 'Analyze Stance', icon: '🏏' },
  { to: '/history', label: 'Session History', icon: '📋' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavContent = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive
                ? 'bg-ghost-500/20 text-ghost-300'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <span>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen bg-pitch-900">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/10 bg-pitch-800/50 lg:flex">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ghost-500 to-ghost-700 text-lg">
              👻
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-white">Ghost Coach</h1>
              <p className="text-xs text-gray-500">Cricket AI Coach</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <NavContent />
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/5 p-3">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-gray-500">
              {user?.role} · {user?.level}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-pitch-800/50 px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">👻</span>
            <span className="font-display font-bold text-white">Ghost Coach</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </header>

        {mobileOpen && (
          <div className="border-b border-white/10 bg-pitch-800 p-4 lg:hidden">
            <nav className="space-y-1">
              <NavContent />
            </nav>
            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-xl px-4 py-2 text-sm text-gray-400 hover:bg-white/5"
            >
              Sign out
            </button>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
