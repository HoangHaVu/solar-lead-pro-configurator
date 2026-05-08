import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { fetchProfile, signIn, signOut } from '../services/auth';
import type { UserRole, Profile } from '../services/auth';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function buildUser(session: Session): Promise<AuthUser | null> {
  // Retry once — profile fetch can transiently fail right after sign-in
  // while the Supabase client settles its new JWT state.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const profile: Profile = await fetchProfile(session.user.id);
      return {
        id: session.user.id,
        email: session.user.email!,
        role: profile.role,
        fullName: profile.full_name,
        isVerified: profile.is_verified,
      };
    } catch {
      if (attempt === 0) await new Promise(r => setTimeout(r, 500));
    }
  }
  // Last-resort fallback: use metadata written during sign-up
  const meta = session.user.user_metadata as { role?: UserRole; full_name?: string } | undefined;
  if (meta?.role) {
    return {
      id: session.user.id,
      email: session.user.email!,
      role: meta.role,
      fullName: meta.full_name ?? session.user.email!,
      isVerified: false,
    };
  }
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // SIGNED_IN is handled directly in login() where the JWT is fully settled.
        // Handling it here causes a race where fetchProfile runs before PostgREST
        // has the new token, resulting in an RLS error and null user.
        if (event === 'SIGNED_IN') return;

        if (session) {
          setUser(await buildUser(session));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // signIn returns the session directly — at this point signInWithPassword
    // has fully completed and the JWT is injected, so fetchProfile works reliably.
    const session = await signIn(email, password);
    setUser(await buildUser(session));
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
