'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// ── Static credentials (no database) ──
const ADMIN_CREDENTIALS = { username: 'admin123', password: 'admin123' };
const STORAGE_KEY = 'portfolio_admin_auth';

export type AuthUser = { id: string; email: string };

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: 'Not implemented' }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage (static login, no database)
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setUser({ id: 'static-admin', email: ADMIN_CREDENTIALS.username });
      }
    } catch {}
    setLoading(false);
  }, []);

  async function signIn(username: string, password: string) {
    const u = (username ?? '').trim();
    const p = (password ?? '').trim();
    if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {}
      setUser({ id: 'static-admin', email: ADMIN_CREDENTIALS.username });
      return { error: null };
    }
    return { error: 'Username atau password salah' };
  }

  async function signOut() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
