import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error?: string;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('sparkverse-auth');
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          setAuthState({
            isAuthenticated: true,
            user: parsed.user,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error parsing stored auth:', error);
          localStorage.removeItem('sparkverse-auth');
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const res = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }

      const data = await res.json(); // { user, token }

      const authData = {
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      localStorage.setItem('sparkverse-auth', JSON.stringify(authData));

      setAuthState({
        isAuthenticated: true,
        user: data.user,
        isLoading: false,
      });

      return { success: true };
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || 'Login failed',
      });
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (userData: {
    username: string;
    email: string;
    password: string;
    location: string;
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const res = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
      }

      const data = await res.json(); 

      const authData = {
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      localStorage.setItem('sparkverse-auth', JSON.stringify(authData));

      setAuthState({
        isAuthenticated: true,
        user: data.user,
        isLoading: false,
      });

      return { success: true };
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || 'Registration failed',
      });
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sparkverse-auth');
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
  };
};
