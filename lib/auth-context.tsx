import { createContext, useContext, useState, type ReactNode } from 'react';

import { getUserById, users, CURRENT_USER_ID } from './mock-data';
import type { User } from './types';

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
    // Fake delay
    await new Promise((r) => setTimeout(r, 500));
    setUser(getUserById(CURRENT_USER_ID)!);
  }

  async function signup(email: string, _password: string, username: string) {
    await new Promise((r) => setTimeout(r, 500));
    const newUser: User = {
      id: `u${users.length + 1}`,
      username,
      email,
      joinedAt: new Date().toISOString(),
    };
    users.push(newUser);
    setUser(newUser);
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
