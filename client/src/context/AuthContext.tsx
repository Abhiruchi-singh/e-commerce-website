import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import * as authApi from '../api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User> & { password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ecommerce_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const saveUser = (userData: User) => {
    localStorage.setItem('ecommerce_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    saveUser(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authApi.register(name, email, password);
    saveUser(data);
  };

  const logout = () => {
    localStorage.removeItem('ecommerce_user');
    setUser(null);
  };

  const updateUser = async (data: Partial<User> & { password?: string }) => {
    const updated = await authApi.updateProfile(data);
    saveUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
