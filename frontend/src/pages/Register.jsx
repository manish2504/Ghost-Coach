import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    sport: 'Cricket',
    role: '',
    level: 'Beginner',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-card p-8">
      <h2 className="font-display text-2xl font-bold text-white">Join Ghost Coach</h2>
      <p className="mt-1 text-sm text-gray-400">Create your player profile to get started</p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Full Name</label>
          <input
            name="name"
            className="input-field"
            placeholder="Virat Sharma"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
          <input
            name="email"
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Password</label>
          <input
            name="password"
            type="password"
            className="input-field"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Sport</label>
            <input
              name="sport"
              className="input-field"
              value={form.sport}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Role/Position</label>
            <input
              name="role"
              className="input-field"
              placeholder="Opening Batsman"
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Experience Level
          </label>
          <select name="level" className="input-field" value={form.level} onChange={handleChange}>
            {LEVELS.map((l) => (
              <option key={l} value={l} className="bg-pitch-800">
                {l}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ghost-400 hover:text-ghost-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
