'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// ── Static login credentials (when Supabase is not configured) ──
const STATIC_USER = { email: 'admin123', id: 'static-admin' } as User;
const ADMIN_CREDENTIALS = { username: 'admin123', password: 'admin123' };
const STORAGE_KEY = 'portfolio_admin_auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: 'Not implemented' }),
  signUp: async () => ({ error: 'Not implemented' }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check static login first (localStorage)
    if (!supabase) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'true') {
          setUser(STATIC_USER);
        }
      } catch {}
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    // Static login when Supabase is not configured
    if (!supabase) {
      if (email === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch {}
        setUser(STATIC_USER);
        return { error: null };
      }
      return { error: 'Username atau password salah' };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string) {
    if (!supabase) return { error: 'Supabase is not configured' };
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    if (!supabase) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
