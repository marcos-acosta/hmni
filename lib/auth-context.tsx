import { createContext, useContext, useState, type ReactNode } from 'react';

import { fetchUser, createUser } from './api';
import type { User } from './types';

const CURRENT_USER_ID = 'u1';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function login(_email: string, _password: string) {
    const u = await fetchUser(CURRENT_USER_ID);
    if (u) setUser(u);
  }

  async function signup(email: string, _password: string, username: string) {
    const u = await createUser({ username, email });
    setUser(u);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
