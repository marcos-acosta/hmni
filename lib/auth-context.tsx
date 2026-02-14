import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { apiGetMe, apiLogin, apiSignup, clearAuthToken, loadAuthToken, setAuthToken } from './api';
import type { User } from './types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await loadAuthToken();
        if (token) {
          const me = await apiGetMe();
          setUser(me);
        }
      } catch {
        await clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function login(username: string, password: string) {
    const { token, user: u } = await apiLogin(username, password);
    await setAuthToken(token);
    setUser(u);
  }

  async function signup(username: string, email: string, password: string) {
    const { token, user: u } = await apiSignup(username, email, password);
    await setAuthToken(token);
    setUser(u);
  }

  async function logout() {
    await clearAuthToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
