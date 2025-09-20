
"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_TOKEN_KEY = 'authToken';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    if (email === 'admin@fahmiefarhan.com' && password === 'Zxcvbnm@123') {
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, 'dummy-auth-token');
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error("Could not access localStorage:", error);
        return false;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
       console.error("Could not access localStorage:", error);
    }
    setIsAuthenticated(false);
    router.push('/admin/login');
  }, [router]);

  const value = { isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
