
"use client";

import { useState, useEffect, useCallback } from 'react';

const AUTH_TOKEN_KEY = 'authToken';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  return { isAuthenticated, isLoading, login, logout };
}
