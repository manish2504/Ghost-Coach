import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = useCallback((userData, token) => {
    localStorage.setItem('ghost_coach_token', token);
    localStorage.setItem('ghost_coach_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ghost_coach_token');
    localStorage.removeItem('ghost_coach_user');
    setUser(null);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    persistAuth(data.data.user, data.data.token);
    return data.data.user;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    persistAuth(data.data.user, data.data.token);
    return data.data.user;
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('ghost_coach_token');
      const cached = localStorage.getItem('ghost_coach_user');

      if (cached && token) {
        try {
          setUser(JSON.parse(cached));
          const { data } = await authAPI.me();
          setUser(data.data.user);
          localStorage.setItem('ghost_coach_user', JSON.stringify(data.data.user));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    init();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
